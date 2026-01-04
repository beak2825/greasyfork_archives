// ==UserScript==
// @name        CT网大考试魔法盒子
// @namespace   Violentmonkey Scripts
// @match       https://*zhixueyun.com/*
// @grant       none
// @version     1.1
// @author      南宫子韩
// @license MIT
// @description 这个盒子可以帮你通过CT网大考试，懂的都懂，你需要一个后端服务地址（https），然后把MagicBox ServiceAddress替换成你的地址
// @downloadURL https://update.greasyfork.org/scripts/500270/CT%E7%BD%91%E5%A4%A7%E8%80%83%E8%AF%95%E9%AD%94%E6%B3%95%E7%9B%92%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/500270/CT%E7%BD%91%E5%A4%A7%E8%80%83%E8%AF%95%E9%AD%94%E6%B3%95%E7%9B%92%E5%AD%90.meta.js
// ==/UserScript==

class CTExam {
    // 可以解析zhixueyun.com考试详情页，返回结构如下:
    // {
    //     title:'试卷名称',
    //     questions:{
    //         '试题类型1':[
    //             {index:'试题序号',questionContent:'问题内容',oScore:'小题类型',answerOptions:['选项']}
    //         ],
    //     }
    // }
    static getExamPaper(){
        const examPaper = {
            title: document.getElementsByClassName('main-title')[0].textContent,
            questions:[]
        };
        const questionsClassList = document.getElementsByClassName('questions-types');
        [...questionsClassList].forEach(qc => {
            const section = {
                'name':qc.getElementsByClassName('h3')[0].innerHTML.replace(/<\/?span>|\r?\n|\r|\s/g, ''),
                'questions':[]
            };
            const questions = qc.getElementsByClassName('question-type-item');
            [...questions].forEach(question =>{
                const questionObject = {
                    index: question.getElementsByClassName('stem-index-text')[0].textContent,
                    questionContent: question.getElementsByClassName('stem-content-main')[0].textContent,
                    oScore: question.getElementsByClassName('o-score')[0].textContent,
                    answerOptions:[],
                };
                if(questionObject.oScore.includes("单选题") || questionObject.oScore.includes("多选题")){
                    const dl = question.getElementsByClassName('answer')[0].getElementsByTagName('dl')[0];
                    const pointers = dl.getElementsByClassName('pointer');
                    [...pointers].forEach(pointer=>{
                        const num = pointer.getElementsByClassName('option-num')[0].textContent;
                        const answerOptions = pointer.getElementsByClassName('answer-options')[0].textContent;
                        questionObject.answerOptions.push(num + answerOptions);
                    });
                }else if(questionObject.oScore.includes("判断题")){
                    const dl = question.getElementsByClassName('answer')[0].getElementsByTagName('dl')[0];
                    const pointers = dl.getElementsByClassName('pointer');
                    [...pointers].forEach(pointer=>{
                        questionObject.answerOptions.push(pointer.textContent);
                    });
                }
                section.questions.push(questionObject);
            });
            examPaper.questions.push(section);

        });
        return examPaper;
    }
}

class MagicBox {
    static ServiceAddress = 'https://localhost:8100';//后面不要带斜杠
    static ChatIdentity = '1';
    static Style = {
        Box:{
            'z-index':9999,
            position: 'absolute',
            top: '100px',
            left: '100px',
            width: '280px',
            height: '400px',
            backgroundColor: '#fff',
            justifyContent: 'center',
            userSelect: 'none',
            padding: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            '-webkit-user-drag':'none'
        },
        Header:{
            height:'24px',
            width:'100%',
            color:'#ccc',
            'padding-right':'60px',
            'border-bottom': '1px solid #ccc',
            cursor:'move',
        },
        ReponseBox:{
            'text-align':'left',
            'font-size':'14px',
            width:'100%',
            height:'calc(100% - 80px)',
            margin:'4px 0',
            padding:'8px',
            backgroundColor:'#f3f5f9',
            'overflow-y': 'auto',
            'box-sizing': 'border-box',
            'word-wrap': 'break-word',
        },
        InputBox: {
            position: 'absolute',
            bottom:'10px',
            left:'10px',
            width: 'calc(100% - 78px)',
            height: '42px',
            border: '1px solid #ccc',
            padding:'8px',
            'box-sizing': 'border-box',
            resize: 'none',
            'white-space': 'pre-wrap',
            'word-wrap': 'break-word',
            outline: 'none'
        },
        SendBtn: {
            'font-size':'12px',
            position: 'absolute',
            bottom:'10px',
            right:'10px',
            width:'48px',
            height:'20px',
            'line-height': '20px',
            margin:'0',
            padding:'0'
        },
        ParseBtn: {
            'font-size':'12px',
            position: 'absolute',
            bottom:'35px',
            right:'10px',
            width:'48px',
            height:'20px',
            'line-height': '20px',
            margin:'0',
            padding:'0'
        },
        SwitchBtn: {
            'font-size':'12px',
            position: 'absolute',
            top:'10px',
            right:'10px',
            width:'56px',
            height:'20px',
            'line-height': '20px',
            color:'#aaa',
            margin:'0',
            padding:'0'
        }
    };
    static boxSizeConf = {
        widthStep: 20,
        heightStep:20,
        widthMin:280,
        widthMax:800,
        heightMin:100,
        heightMax:960,
    };
    static CreateP(text,direction){
        // 给请求体准备P元素
        let ml = '0';
        let d = 'left';
        let w = 'calc(70%-10px)';
        if(!direction){
            w = 'calc(100%-10px)';
        }else if(direction === 'right'){
            ml = '30%';
            d = 'right';
        }
        const styleP = {
            width: w,
            height:'auto',
            margin:'2px',
            'font-size':'14px',
            'margin-left':ml,
            'text-align':d,
        };
        const p = document.createElement('p');
        p.innerHTML = text.replace(/\n/g, '<br>');
        Object.assign(p.style, styleP);
        return p;
    }

    // 构造函数，初始化 MagicBox 实例
    constructor(id) {
        this.id = id;
        this.sendModel = 'query';//query或message

        // 初始化元素
        this.element = document.createElement('div');
        this.element.id = id;
        Object.assign(this.element.style, MagicBox.Style.Box)

        // 头部,显示提示并用于拖动位置
        this.header = document.createElement('div');
        this.header.innerText = 'ctrl+H显隐J窄K宽U矮I高';
        Object.assign(this.header.style, MagicBox.Style.Header);
        this.element.appendChild(this.header);

        // 模式按钮
        this.switchBtn = document.createElement('button');
        this.switchBtn.textContent = '去聊天';
        Object.assign(this.switchBtn.style, MagicBox.Style.SwitchBtn);
        this.element.appendChild(this.switchBtn);
        this.switchBtn.addEventListener('click', ()=>{
            if(this.switchBtn.textContent === '去聊天'){
                this.sendModel = 'message';
                // 进入聊天状态获取一次消息
                this.sendMessage('');
                this.switchBtn.textContent = '去查询'
            }else{
                this.sendModel = 'query';
                this.reponseBox.innerHTML = '';
                this.switchBtn.textContent = '去聊天'
            }
        });

        // 响应体
        this.reponseBox = document.createElement('div');
        Object.assign(this.reponseBox.style, MagicBox.Style.ReponseBox);
        this.element.appendChild(this.reponseBox);

        // 请求体
        this.inputBox = document.createElement('textarea');
        // this.inputBox.type = 'text';
        Object.assign(this.inputBox.style, MagicBox.Style.InputBox);
        this.element.appendChild(this.inputBox);

        // 发送按钮
        this.sendBtn = document.createElement('button');
        this.sendBtn.textContent = '发送';
        Object.assign(this.sendBtn.style, MagicBox.Style.SendBtn);
        this.element.appendChild(this.sendBtn);
        this.sendBtn.addEventListener('click',()=>{
            if(this.sendModel === 'query'){
                this.sendQuery(this.inputBox.value);
            }else{
                this.sendMessage(this.inputBox.value);
            }
            this.inputBox.value = '';
        });

        // 解析按钮
        this.parseBtn = document.createElement('button');
        this.parseBtn.textContent = '解析';
        Object.assign(this.parseBtn.style, MagicBox.Style.ParseBtn);
        this.element.appendChild(this.parseBtn);
        this.parseBtn.addEventListener('click', ()=>{
            const ctep = CTExam.getExamPaper();
            let fullAddress = `${MagicBox.ServiceAddress}/magic/uploadExamPaper`;
            fetch(fullAddress, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ctep)
            })
            console.log(ctep);
        });

        // 初始化拖动变量
        this.mouseDown = false;
        this.initialMouseX = 0;
        this.initialMouseY = 0;
        this.initialElementTop = parseFloat(this.element.style.top) || 0;
        this.initialElementLeft = parseFloat(this.element.style.left) || 0;

        // 绑定拖动事件
        this.header.addEventListener('mousedown', this.dragStart.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.dragEnd.bind(this));

        // 初始化快捷键
        this.initShortcutKeys();

        // 元素渲染
        document.body.appendChild(this.element);

        // 定时刷新消息
        const interval = setInterval(()=>{
            this.sendMessage('');
        }, 3000);
    }

    dragStart(event) {
        this.mouseDown = true;
        // 记录鼠标按下时的屏幕坐标
        this.initialMouseX = event.clientX;
        this.initialMouseY = event.clientY;

        // 记录元素的初始位置
        this.initialElementTop = parseInt(this.element.style.top || '0', 10) || 0;
        this.initialElementLeft = parseInt(this.element.style.left || '0', 10) || 0;
    }

    drag(event) {
        if (!this.mouseDown) return;

        // 计算鼠标移动的距离
        const dx = event.clientX - this.initialMouseX;
        const dy = event.clientY - this.initialMouseY;

        // 更新元素的新位置
        this.element.style.top = `${this.initialElementTop + dy}px`;
        this.element.style.left = `${this.initialElementLeft + dx}px`;
    }

    dragEnd() {
        this.mouseDown = false;
    }

    // 初始化快捷键
    initShortcutKeys() {
        document.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'h':
                    // 显示/隐藏
                    if (event.ctrlKey || event.metaKey) {
                        this.toggleVisibility();
                    }
                    break;
                case 'j':
                    // 变窄
                    if (event.ctrlKey || event.metaKey) {
                        this.element.style.width = `${Math.max(parseInt(this.element.style.width || '0', 10) - MagicBox.boxSizeConf.widthStep, MagicBox.boxSizeConf.widthMin)}px`;
                    }
                    break;
                case 'k':
                    // 变宽
                    if (event.ctrlKey || event.metaKey) {
                        this.element.style.width = `${Math.min(parseInt(this.element.style.width || '0', 10) + MagicBox.boxSizeConf.widthStep, MagicBox.boxSizeConf.widthMax)}px`;
                    }
                    break;
                case 'u':
                    // 变矮
                    if (event.ctrlKey || event.metaKey) {
                        this.element.style.height = `${Math.max(parseInt(this.element.style.height || '0', 10) - MagicBox.boxSizeConf.heightStep, MagicBox.boxSizeConf.heightMin)}px`;
                    }
                    break;
                case 'i':
                    // 变高
                    if (event.ctrlKey || event.metaKey) {
                        this.element.style.height = `${Math.min(parseInt(this.element.style.height || '0', 10) + MagicBox.boxSizeConf.heightStep, MagicBox.boxSizeConf.heightMax)}px`;
                    }
                    break;
            }
        });
    }

    // 控制盒子的显示和隐藏
    toggleVisibility() {
        if (this.element.style.display === 'none') {
            this.element.style.display = 'block';
        } else {
            this.element.style.display = 'none';
        }
    }

    // 发送请求
    sendMessage(text){
        const fullAddress = `${MagicBox.ServiceAddress}/magic/message?text=${encodeURI(text)}&chatId=${MagicBox.ChatIdentity}`;
        fetch(fullAddress)
            .then(response => response.json())
            .then(data => {
                //返回数据应形如:
                //{code:1,msg:'',data:{type:'message',value:[]}}
                if(data['code']){
                    // 模式不匹配不渲染结果
                    if(data['data']['type'] === this.sendModel){
                        this.reponseBox.innerHTML = ''; //先清空
                        data['data']['value'].forEach(item=>{
                            if(item['chatId'] === MagicBox.ChatIdentity){
                                // 我的消息在右侧
                                this.reponseBox.appendChild(MagicBox.CreateP(item['time'],'right'));
                                this.reponseBox.appendChild(MagicBox.CreateP(item['text'],'right'));
                            }else{
                                this.reponseBox.appendChild(MagicBox.CreateP(item['time'],'left'));
                                this.reponseBox.appendChild(MagicBox.CreateP(item['text'],'left'));
                            }
                        });
                    }
                }else{
                    console.log(data['msg']);
                }
            })
    }

    // 发送查询
    sendQuery(text){
        const fullAddress = `${MagicBox.ServiceAddress}/magic/query?text=${encodeURI(text)}`;
        fetch(fullAddress)
            .then(response => response.json())
            .then(data => {
                //返回数据应形如:
                //{code:1,msg:'',data:{type:'query',value:[]}}
                if(data['code']){
                    // 模式不匹配不渲染结果
                    if(data['data']['type'] === this.sendModel){
                        this.reponseBox.innerHTML = ''; //先清空
                        if(!data['data']['value']){
                            this.reponseBox.appendChild(MagicBox.CreateP('查不到数据',null));
                        }else{
                            this.reponseBox.appendChild(MagicBox.CreateP(`找到${data['data']['value'].length}个相关问题`,null));
                            data['data']['value'].forEach(item=>{
                                const keys = ['问题','正确答案','A','B','C','D','E','F'];
                                keys.forEach(k=>{
                                    if(item[k] !== 'None'){
                                        this.reponseBox.appendChild(MagicBox.CreateP(`${k}:${item[k]}`,null));
                                    }
                                });
                                this.reponseBox.appendChild(MagicBox.CreateP('-'.repeat(20),null));
                            });
                        }
                    }
                }else{
                    console.log(data['msg']);
                }
            })
    }
}

const myMagicBox = new MagicBox('myMagicBox');

