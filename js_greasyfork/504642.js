// ==UserScript==
// @name        CT网大考试魔法盒子-框选搜题版
// @namespace   Violentmonkey Scripts
// @match       https://*zhixueyun.com/*
// @match       https://*iguokao.com/*
// @grant       none
// @version     1.3.5
// @author      鲁小呆
// @license MIT
// @description 原作者：南宫子韩。需配合本地go服务实现考试宝接口。原项目地址：https://greasyfork.org/zh-CN/scripts/500270
// @downloadURL https://update.greasyfork.org/scripts/504642/CT%E7%BD%91%E5%A4%A7%E8%80%83%E8%AF%95%E9%AD%94%E6%B3%95%E7%9B%92%E5%AD%90-%E6%A1%86%E9%80%89%E6%90%9C%E9%A2%98%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/504642/CT%E7%BD%91%E5%A4%A7%E8%80%83%E8%AF%95%E9%AD%94%E6%B3%95%E7%9B%92%E5%AD%90-%E6%A1%86%E9%80%89%E6%90%9C%E9%A2%98%E7%89%88.meta.js
// ==/UserScript==


class CTExam {
    static getExamPaper() {
        const examPaper = {
            title: document.getElementsByClassName('main-title')[0].textContent,
            questions: []
        };
        const questionsClassList = document.getElementsByClassName('questions-types');
        [...questionsClassList].forEach(qc => {
            const section = {
                'name': qc.getElementsByClassName('h3')[0].innerHTML.replace(/<\/?span>|\r?\n|\r|\s/g, ''),
                'questions': []
            };
            const questions = qc.getElementsByClassName('question-type-item');
            [...questions].forEach(question => {
                const questionObject = {
                    index: question.getElementsByClassName('stem-index-text')[0].textContent,
                    questionContent: question.getElementsByClassName('stem-content-main')[0].textContent,
                    oScore: question.getElementsByClassName('o-score')[0].textContent,
                    answerOptions: [],
                };
                if (questionObject.oScore.includes("单选题") || questionObject.oScore.includes("多选题")) {
                    const dl = question.getElementsByClassName('answer')[0].getElementsByTagName('dl')[0];
                    const pointers = dl.getElementsByClassName('pointer');
                    [...pointers].forEach(pointer => {
                        const num = pointer.getElementsByClassName('option-num')[0].textContent;
                        const answerOptions = pointer.getElementsByClassName('answer-options')[0].textContent;
                        questionObject.answerOptions.push(num + answerOptions);
                    });
                } else if (questionObject.oScore.includes("判断题")) {
                    const dl = question.getElementsByClassName('answer')[0].getElementsByTagName('dl')[0];
                    const pointers = dl.getElementsByClassName('pointer');
                    [...pointers].forEach(pointer => {
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
    //后面不要带斜杠
    static ServiceAddress = 'http://localhost:14399';
    static ChatIdentity = '1';
    static Style = {
        Box: {
            'z-index': 9999,
            position: 'absolute',
            top: '100px',
            left: '100px',
            width: '280px',
            height: '450px',
            backgroundColor: 'rgb(247,247,247,0.3)',
            justifyContent: 'center',
            userSelect: 'none',
            padding: '10px 10px 0 10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0)',
            borderRadius: '4px',
            '-webkit-user-drag': 'none'
        },
        Header: {
            height: '20px',
            width: '100%',
            color: '#ccc',
            'padding-right': '60px',
            'border-bottom': '1px solid #ccc',
            cursor: 'move',
        },
        ReponseBox: {
            'text-align': 'left',
            'font-size': '14px',
            width: '100%',
            height: 'calc(100% - 65px)',
            margin: '4px 0',
            // padding: '8px',
            backgroundColor: 'rgb(247,247,247,0.3)',
            color: 'rgba(0,0,0,0.31)',
            'overflow-y': 'auto',
            'box-sizing': 'border-box',
            'word-wrap': 'break-word',
        },
        InputBox: {
            position: 'absolute',
            // bottom: '10px',
            // left: '10px',
            width: '95%',
            height: '30px',
            // border: '1px solid #ccc',
            // padding: '8px',
            'box-sizing': 'border-box',
            // resize: 'none',
            'white-space': 'pre-wrap',
            'word-wrap': 'break-word',
            outline: 'none'
        },
        ParseBtn: {
            'font-size': '12px',
            position: 'absolute',
            bottom: '35px',
            right: '10px',
            width: '48px',
            height: '20px',
            'line-height': '20px',
            margin: '0',
            padding: '0'
        },
        SwitchBtn: {
            'font-size': '12px',
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '56px',
            height: '20px',
            'line-height': '20px',
            color: '#aaa',
            margin: '0',
            padding: '0'
        }
    };

    static CreateP(text, direction) {
        // 给请求体准备P元素
        let ml = '0';
        let d = 'left';
        let w = 'calc(70%-10px)';
        if (!direction) {
            w = 'calc(100%-10px)';
        } else if (direction === 'right') {
            ml = '30%';
            d = 'right';
        }
        const styleP = {
            width: w,
            height: 'auto',
            margin: '2px',
            'font-size': '14px',
            'margin-left': ml,
            'text-align': d,
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
        this.header.innerText = 'alt显隐; 选中文本自动搜';
        Object.assign(this.header.style, MagicBox.Style.Header);
        this.element.appendChild(this.header);

        this.a = document.createElement('a')
        this.a.id = 'info'
        Object.assign(this.a.style, MagicBox.Style.Header);
        this.a.href = `${MagicBox.ServiceAddress}/kaoshibao/getqr`
        this.a.innerText = '请点击扫码登录考试宝(拖动刷新token)'
        this.a.target = '_blank'
        // Object.assign(this.a.style, MagicBox.Style.Header);
        this.element.appendChild(this.a)

        // 响应体
        this.reponseBox = document.createElement('div');
        Object.assign(this.reponseBox.style, MagicBox.Style.ReponseBox);
        this.element.appendChild(this.reponseBox);

        // 底部提示信息
        // this.messageBox=document.createElement('div');
        // Object.assign(this.messageBox.style, MagicBox.Style.InputBox);
        // this.messageBox.innerText="多人共用同一IP将导致账号掉线，请谨慎！"
        // this.element.appendChild(this.messageBox)

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
        myMagicBox.getTokenState();
    }

    // 初始化快捷键
    initShortcutKeys() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case "Alt":
                this.toggleVisibility();
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
    sendMessage(text) {
        const fullAddress = `${MagicBox.ServiceAddress}/magic/message?text=${encodeURI(text)}&chatId=${MagicBox.ChatIdentity}`;
        fetch(fullAddress)
            .then(response => response.json())
            .then(data => {
                //返回数据应形如:
                //{code:1,msg:'',data:{type:'message',value:[]}}
                if (data['code']) {
                    // 模式不匹配不渲染结果
                    if (data['data']['type'] === this.sendModel) {
                        this.reponseBox.innerHTML = ''; //先清空
                        data['data']['value'].forEach(item => {
                            if (item['chatId'] === MagicBox.ChatIdentity) {
                                // 我的消息在右侧
                                this.reponseBox.appendChild(MagicBox.CreateP(item['time'], 'right'));
                                this.reponseBox.appendChild(MagicBox.CreateP(item['text'], 'right'));
                            } else {
                                this.reponseBox.appendChild(MagicBox.CreateP(item['time'], 'left'));
                                this.reponseBox.appendChild(MagicBox.CreateP(item['text'], 'left'));
                            }
                        });
                    }
                } else {
                    console.log(data['msg']);
                }
            })
    }

    // 发送查询
    sendQuery(text) {
        console.log(encodeURI(text))
        const fullAddress = `${MagicBox.ServiceAddress}/kaoshibao/askQuestion`;
        fetch(fullAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: encodeURI(text)
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                //返回数据应形如:
                //{code:1,msg:'',data:{type:'query',value:[]}}
                if (data['code']) {
                    // 模式不匹配不渲染结果
                    if (data['type'] === 'query') {
                        this.reponseBox.innerHTML = ''; //先清空
                        console.log(data['data']['data']['rows'])
                        if (!data['data']['data']['rows']) {
                            this.reponseBox.appendChild(MagicBox.CreateP('查不到数据', null));
                        } else {
                            this.reponseBox.appendChild(MagicBox.CreateP(`找到${data['data']['data']['rows'].length}个相关问题`, null));
                            this.reponseBox.appendChild(MagicBox.CreateP(`
                            ${decodeURI(data['data']['data']['rows'][0]['question.raw'].replace(/<[^>]*>/g, '').replace(/https?:\/\/[^ ]+/g, '').replace(/http?:\/\/[^ ]+/g, '').replace(/HYPERLINK "/g, '').replace(/\s/g, ''))}:
                            ${decodeURI(data['data']['data']['rows'][0]['answer'])}:
                            ${decodeURI(JSON.stringify(JSON.parse(data['data']['data']['rows'][0]['options'])))}`
                                , null));
                            this.reponseBox.appendChild(MagicBox.CreateP('-'.repeat(20), null));
                        }
                    }
                } else {
                    console.log(data['msg']);
                }
            })
    }

    // 获取token状态
    getTokenState() {
        fetch(`${MagicBox.ServiceAddress}/kaoshibao/gettoken`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('info').innerText = 'Token: ' + data.msg.slice(11, 20)
            }).catch(error => {
                document.getElementById('info').innerText = "请检查后台程序开启情况!"
                if (error.message.includes('Failed to fetch')) {
                    console.error('Connection refused or network error.');
                } else {
                    document.getElementById('info').innerText = "发生了未知错误..."
                    console.error('Error:', error);
                }
            })
    }
}

document.addEventListener('mouseup', function () {
    var selection = document.getSelection().toString();
    if (selection !== '') {
        // console.log('选中的文本是：', selection);
        myMagicBox.sendQuery(selection);
    }
});

const myMagicBox = new MagicBox('myMagicBox');

