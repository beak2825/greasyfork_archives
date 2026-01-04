// ==UserScript==
// @name         B站直播间弹幕广播
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  B站直播间弹幕转发，辅助联动同传的工作，需要用户已登录。若有滥用等问题概不负责，诶嘿。顺便关注一下小东人鱼和noworld吧~
// @author       太陽闇の力
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/gh/eric2788/bliveproxy@d66adfa34cbf41db3d313f49d0814e47cb3b6c4c/bliveproxy-unsafe.js
// @require      https://cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437965/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%B9%BF%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/437965/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%B9%BF%E6%92%AD.meta.js
// ==/UserScript==


// 命令分析参考自  https://segmentfault.com/a/1190000017328813
//界面参考自小东人鱼午安社五更耗纸 https://github.com/gokoururi-git/gachihelper/
// 弹幕api使用参考自   https://greasyfork.org/zh-CN/scripts/434726

(function() {
    //-----------配置区----------
    //0默认收起，1默认展开
    let isunfold = 0;
    // 转发对象的UID，也即转发谁的弹幕
    let uid = `
353039514
`.replace(/ /g, '').trim().replace(/\n{2,}/g, '\n').split('\n');
    // 要转发的直播间号，也即发到哪儿
    let rooms = `
9806022
2077803
431458
145657
`.replace(/ /g, '').trim().replace(/\n{2,}/g, '\n').split('\n');
    // 设置弹幕的发送间隔（秒），默认1秒，指转发到直播间A，然后再转发到直播间B，中间的时间间隔
    //如果设置太小，会因发送频率过快而被B站吞掉且有系统屏蔽风险
    let inter = 1;
    let logic = 0;//取值为0则为与，1则为或，3则为非。
    //默认正则，带【】（）[]()的弹幕都会被转发。
    let regdef = "[【】（）\\[\\]()]";
    //默认自己为20字数限制，一般不改了（有需要的就找我反馈吧）
    // 当前直播间号
    const proomid = /(?<=https?:\/\/live\.bilibili\.com\/(blanc\/)?)\d+/.exec(window.location.href)[0];

    if(!(window.document.firstChild instanceof window.Comment)){//「あなたに逢えなくなって、錆びた時計と泣いたけど…」
        return;
    }
    //-----------UI区----------
    let unfold = ["展开","收起"];
    // 总容器
    const container = window.document.createElement('div');
    container.style.cssText = 'width:218px;position:fixed;bottom:5px;right:60px;z-index:999;box-sizing:border-box;';

    // 工具名称
    const topTool = window.document.createElement('div');
    topTool.innerText = '弹幕转发';
    topTool.style.cssText = 'text-align:center;line-height:20px;width:100%;color:rgb(210,143,166);font-size:14px;';

    // 最小化按钮
    const collapseButton = window.document.createElement('button');
    collapseButton.innerText = unfold[isunfold];
    collapseButton.style.cssText = 'float:right;width:40px;height:20px;border:none;cursor:pointer;background-color:#1890ff;border-radius:1px;color:#ffffff;';

    // 主窗口
    const mainWindow = window.document.createElement('div');
    mainWindow.style.cssText = 'display: flex;flex-wrap: wrap;justify-content:space-between;width:100%;background-color:rgba(220, 192, 221, .5);padding:10px;box-sizing:border-box;';
    if(isunfold==0){
        mainWindow.style.display = "none";
    }

    // 直播间号输入框
    const textArea = window.document.createElement('textarea');
    textArea.placeholder = '转发的直播间号，换行分隔'
    textArea.style.cssText = 'width:45%;height:60px;resize:none;outline:none;background-color:rgba(255,255,255,.5);border-radius:2px';

    // 直播间号输入框
    const textArea2 = window.document.createElement('textarea');
    textArea2.placeholder = '选择的uid，换行分隔'
    textArea2.style.cssText = 'width:45%;height:60px;resize:none;outline:none;background-color:rgba(255,255,255,.5);border-radius:2px';

    // 按钮区容器
    const buttonArea = window.document.createElement('div');
    buttonArea.style.cssText = 'width:100%;height:30px;box-sizing:border-box;display:flex;justify-content: space-around;margin-top:10px;';

    // 按钮区容器
    const buttonArea2 = window.document.createElement('div');
    buttonArea2.style.cssText = 'width:100%;height:28;box-sizing:border-box;display:flex;margin-top:10px;';

    // 开始按钮
    const goButton = window.document.createElement('button');
    goButton.innerText = '开始';
    goButton.style.cssText = 'width:max-content;height:28px;padding:0 5px;margin-left:5px;';


    //发送间隔
    const interBox = window.document.createElement('input');
    interBox.value = 1;
    interBox.title = "转发间隔的秒数";
    interBox.style.cssText = 'width:30px;height:20px;padding:0 5px;';

    //前缀
    const prefix = window.document.createElement('input');
    prefix.placeholder = "前缀";
    prefix.style.cssText = 'width:30px;height:20px;padding:0 5px;';

    // 逻辑按钮
    const logi = window.document.createElement('select');
    logi.options.add(new Option("与",0));
    logi.options.add(new Option("或",1));
    logi.options.add(new Option("非",2));;
    logi.value = logic;
    logi.style.cssText = 'text-align:center;width:20px;height:20px;appearance:none;margin:auto;border-radius:2px';
    // 正则提示文本
    const regLabel = window.document.createElement('div');
    regLabel.innerText = '正则：'
    regLabel.style.cssText = 'width:20%;height:28;line-height:30px;';
    // 正则输入
    const regBox = window.document.createElement('input');
    regBox.title = ".*匹配任意字符";
    regBox.value = regdef;
    regBox.style.cssText = 'width:60%;height:18px;padding:0 5px:5px;margin:auto';
    // 组装
    topTool.appendChild(collapseButton);
    container.appendChild(topTool);
    mainWindow.appendChild(textArea);
    mainWindow.appendChild(textArea2)
    buttonArea.appendChild(goButton);
    buttonArea.appendChild(prefix);
    buttonArea.appendChild(interBox);
    buttonArea2.appendChild(logi);
    buttonArea2.appendChild(regLabel);
    buttonArea2.appendChild(regBox);
    mainWindow.appendChild(buttonArea2);
    mainWindow.appendChild(buttonArea);
    container.appendChild(mainWindow);
    window.document.body.appendChild(container);
    // 显示逻辑控制
    collapseButton.addEventListener('click', () => {
        if (collapseButton.innerText === '收起') {
            mainWindow.style.display = 'none';
            collapseButton.innerText = '展开';
            return;
        }
        if (collapseButton.innerText === '展开') {
            mainWindow.style.display = 'flex';
            collapseButton.innerText = '收起';
            return;
        }
    }, false);
    function fadeOut(ele,time) {
        const count = 20;
        ele.style.opacity=1;
        return setInterval(function() {
            ele.style.opacity = ele.style.opacity - 1/count;
        }, time/count);
    }

    function showMessage(intext) {
        const div = window.document.createElement('div');
        div.innerText = intext;
        div.style.cssText = 'box-sizing:border-box;width:max-content;padding:0 10px;height:40px;position:fixed;bottom:40px;left:50px;z-index:999;background-color:rgba(255, 255, 0,.2);border-radius:5px;color:#FF0000;font-size:medium;line-height:40px;text-align:center;';
        window.document.body.appendChild(div);
        let st = fadeOut(div, 2000);
        setTimeout((ele) => {
            clearInterval(st);
            ele.remove();
        }, 2000, div);
    }
    let prefixValue = "";
    let limit = 20;
    //-----------队列------------
    function Queue() {
        let list = [];

        //向队列中添加数据
        this.push = function(data,rlist,dmtype) {
            data = prefixValue+data;
            for(let i = 0; i < rlist.length;i++){
                if(data.length>limit){
                    list.unshift([data.substring(0,limit),rlist[i],dmtype]);
                    list.unshift([prefixValue+"【…"+data.substring(limit,data.length),rlist[i],dmtype]);
                }else{
                    list.unshift([data,rlist[i],dmtype]);
                }
                /*
                const pre = this.getRear();
                if(pre && pre[0]==data&&!dmtype){
                    data+="\u200b";
                }
                if(data.length>20){
                    list.unshift([data.substring(0,16),rlist[i],dmtype]);
                    list.unshift([prefixValue+"【…"+data.substring(16,data.length),rlist[i],dmtype]);
                }else{
                    list.unshift([data,rlist[i],dmtype]);
                }
                */

            }
            return true;
        }
        this.getFront = function(){
            return list[list.length-1];

        }
        this.getRear = function(){
            return list[0];
        }
        this.pushHead = function(data,r,dmtype){
            /*
            const post = this.getFront();
            if(post&&post[0]==data&&!dmtype){
                data+="\u200b";
            }
            if(data.length>20){
                list[list.length] = [data.substring(0,16),r,dmtype];
                list[list.length] = [data.substring(16,data.length),r,dmtype];
            }else{
                list[list.length] = [data,r,dmtype];
            }
            */
            list[list.length] = [data,r,dmtype];
            return true;
        }
        //从队列中取出数据
        this.pop = function() {
            return list.pop();
        }
        //返回队列的大小
        this.size = function() {
            return list.length;
        }

    }
    //-----------逻辑区----------
    let msgQueue =new Queue();
    let apiClient = axios.create({
        baseURL: 'https://api.live.bilibili.com',
        withCredentials: true
    })
    const bili_jct = document.cookie.replace(/(?:(?:^|.*;\s*)bili_jct\s*=\s*([^;]*).*$)|^.*$/, '$1');
    async function Request(msg, roomid,dm_type = 0) {
        let rnd = parseInt(+new Date() / 1000);
        let data = new FormData()
        data.append('dm_type', dm_type);
        data.append('bubble', 0)
        data.append('color', 16777215)
        data.append('fontsize', 25)
        data.append('mode', 1)
        data.append('rnd', rnd)
        data.append('msg', msg)
        data.append('roomid', roomid)
        data.append('csrf', bili_jct)
        data.append('csrf_token', bili_jct)
        let ajaxObj = (await apiClient.post('/msg/send', data)).data
        return ajaxObj;
    }
    const send = ()=>{
        if(msgQueue.size()>0){
            let [msg,roomid,dmType] = msgQueue.pop();
            let ReturnPackage = Request(msg,roomid,dmType);
            ReturnPackage.then(res=>{
                if(res.code ==0 && res.message == ""){
                    //发送成功
                }else if(res.message == "您发送弹幕的频率过快"){
                    showMessage(res.message+"正在重发");
                    msgQueue.pushHead(msg,roomid,dmType);
                    clearInterval(qt);
                    setTimeout(()=>{
                        send();
                        qt = setInterval(send,1000*inter);
                    },2000)
                }else if (res.message == "f") {
                    showMessage("全局屏蔽词或被一定程度限制发言："+msg);
                }else if(res.message == "k"){
                    showMessage("房间屏蔽词："+msg);
                }else if (res.message == "表情发送失败~"){
                    msgQueue.pushHead("[表情_"+msg+"]",roomid,0);
                }else{
                    showMessage(res.message);
                }
            }//数据参考
                               //code: -500 data: [] message: "超出限制长度" msg: "超出限制长度" [[Prototype]]: Object
                              )//code: 10030 data: [] message: "您发送弹幕的频率过快" msg: "您发送弹幕的频率过快"

        }
    }
    let qt;
    let flag= false;//qt是否在运行中
    const originFetch = fetch;
    unsafeWindow.fetch = (...arg) => {
        if (arg[0].indexOf('send') > -1) {
            if(flag){
                msgQueue.pushHead(arg[1].data.msg,arg[1].data.roomid,arg[1].data.dm_type);
            }else{
                let ReturnPackage = Request(arg[1].data.msg,arg[1].data.roomid,arg[1].data.dm_type);
                ReturnPackage.then(res => {
                    if(res.code ==0 && res.message == ""){
                        return
                    }else if(res.message == "您发送弹幕的频率过快"){
                        showMessage(res.message);
                    }else if (res.message == "f") {
                        showMessage("全局屏蔽词或被一定程度限制发言");
                    }else if(res.message == "k"){
                        showMessage("房间屏蔽词");
                    }else{
                        showMessage(res.message);
                    }
                    const biliTextArea = window.document.querySelector("textarea");
                    const inputEvent = document.createEvent("Event");
                    inputEvent.initEvent("input",true, true);
                    biliTextArea.value = arg[1].data.msg;
                    biliTextArea.dispatchEvent(inputEvent);
                })
            }
            return new Promise(() => {
                throw new Error();
            });

        } else {
            return originFetch(...arg);
        }
    }
    function hdl(command) {
        const info = command.info;
        const uidlogi = uid.indexOf(info[2][0].toString())>-1;
        const reg = new RegExp(regBox.value);
        const reglogi = reg.test(info[1]);
        switch(logic){
            case "0":if(!(uidlogi&&reglogi)){return};
                break;
            case "1":if(!(uidlogi||reglogi)){return};
                break;
            case "2":if(reglogi){return};
                break;
        }
        let dmType = command.info[0][12];
        msgQueue.push(info[1],rooms,dmType);

    }

    try{
        goButton.addEventListener('click', () => {
            if (goButton.innerText == '暂停') {
                bliveproxy.removeCommandHandler('DANMU_MSG', hdl)
                flag = false;
                clearInterval(qt);
                goButton.innerText = '开始';
                return;
            }
            limit = parseInt(window.document.querySelector('.input-limit-hint').innerHTML.split('/')[1]);
            uid = textArea2.value.replace(/ /g, '').trim().replace(/\n{2,}/g, '\n').split('\n');
            logic = logi.value;
            rooms=textArea.value;
            if(rooms==''){
                showMessage("您未输入直播间号");
                return;
            }
            rooms = textArea.value.replace(/ /g, '').trim().replace(/\n{2,}/g, '\n').split('\n');
            if (rooms.indexOf(proomid) > -1) {
                showMessage("不能转发到所在直播间");
                return;
            }
            prefixValue = prefix.value;
            bliveproxy.addCommandHandler('DANMU_MSG', hdl);
            goButton.innerText = '暂停';
            if(!flag){
                flag = true;
                qt = setInterval(send,1000*inter);
            }


        }, false);
    }catch (e) {
        alert('弹幕转发：发生未知错误\n' + e);
        bliveproxy.removeCommandHandler('DANMU_MSG', hdl);
    }
})();

//点击弹幕区的人显示uid和悬停显示自己的uid
window.onload = function(){
    const div = window.document.createElement("div");
    let chat = window.document.querySelector("#chat-items");
    const parent = window.document.querySelector(".user-panel.panel-shadow");
    const a = window.document.querySelector(".msg-hinter")?.parentNode;
    const myId = parent?.querySelector("span");
    let username;
    if(chat){
        chat.addEventListener("click",(e)=>{
            if(!username){
                username = window.document.querySelector(".danmaku-menu");
                username.insertBefore(div,username.childNodes[1]);
            }
            if(e.target.className.split(" ").indexOf("pointer")>-1){
                const userID=e.target.parentNode.getAttribute("data-uid");
                div.innerText = userID;
            }
        })

    }else{
        console.log("无法获取弹幕栏");
    }
    if(myId&&a){

        parent.classList.remove("none-select");
        myId.style = "font-size:15px";
        setTimeout(()=>{
            const myUid = /(?=.*)\d+/.exec(a.href)[0];
            myId.innerHTML = myUid + "<br>" + myId.innerHTML;
        },1000);

    }else{
        console.log("无法获取个人资料卡");
    }
}