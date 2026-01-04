// ==UserScript==
// @name         B站油管showroom简易打尻装置
// @namespace    http://tampermonkey.net/
// @version      0.5.2.1
// @description  啊B、油管或showroom打尻，需要用户已登录。若有滥用等问题概不负责，诶嘿。顺便关注一下小东人鱼和noworld吧~
// @author       太陽闇の力
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @match        https://www.youtube.com/live_chat*
// @exclude      https://www.youtube.com/live_chat_replay*
// @match        https://www.showroom-live.com/*
// @exclude      https://www.showroom-live.com/room/*
// @require      https://cdn.jsdelivr.net/gh/eric2788/bliveproxy@d66adfa34cbf41db3d313f49d0814e47cb3b6c4c/bliveproxy-unsafe.js
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437897/B%E7%AB%99%E6%B2%B9%E7%AE%A1showroom%E7%AE%80%E6%98%93%E6%89%93%E5%B0%BB%E8%A3%85%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/437897/B%E7%AB%99%E6%B2%B9%E7%AE%A1showroom%E7%AE%80%E6%98%93%E6%89%93%E5%B0%BB%E8%A3%85%E7%BD%AE.meta.js
// ==/UserScript==

//1.界面参考自小东人鱼午安社五更耗纸 https://github.com/gokoururi-git/gachihelper/

//2.interval.min、interval.max、interval.step分别是滑动条的最小值、最大值和滑动间隔，已根据平台区别设定了这三个值和interval的关系，尽量避免发送太猛吓到主播。
//3.B站直播五秒内同一句打call的话，会显示发送频率太快而无法发送成功。建议写多几句不一样的。

//4.showroom的50 count中，搜索找到下面这两行代码可以更改设置
//5.const kankaku = 2; //50 count的时间间隔 。网络不好的时候不宜进行50 count，会自动停止
//6.countDownButton.innerText = kankaku*(50-1)+1;//50 count所用总时间。这个值是我乱猜的，不过也有实验过姑且能用的样子

(function() {
    let waitTime = 1;//等待1秒，如果加载比较慢的话，不等待可能获取不到元素。
    let times = 10;//尝试查询的次数

    let timescopy = times;
    let maint;
    let isOnLive;//showroom是否在直播
    const main = () => {
        try {
            //-----------配置区-------------
            //0默认收起，1默认展开
            let isunfold = 0;
            let unfold = ["展开","收起"];
            let hachihachikinou = 1;//是否开启观众发送888的人数超过固定人则自动停止功能(仅限B站直播间)
            const hachihachitext = ['不检888','检测888'];
            let hachihachi = 3;//观众发送888的人数超过3人则自动停止
            let hachihachitimes = 0;//观众发送888的人数计数器
            //输入框选择符
            let inputSelector = 'textarea';
            //发送按钮选择符
            let sendSelector = '.bl-button';
            const urlCheck = (s)=>window.location.host == s;
            const isShowroom = urlCheck("www.showroom-live.com");
            const isBilibili = urlCheck("live.bilibili.com");
            const isYoutube = urlCheck("www.youtube.com");
            let countdown = "220"; //倒计时
            let intervaltime = "6";//发送间隔
            let biliTextArea;
            let biliTextSender;
            if(isYoutube){//如果在油管的话设置初始发送间隔时间为20秒
                intervaltime="20";
            }
            if(isShowroom){//判断是不是showroom的直播间
                intervaltime="50";//如果在showroom的话设置初始发送间隔时间为20秒

                const showroomURL = "https://www.showroom-live.com";
                let ogURL = window.document.querySelector("meta[property='og:url']");
                ogURL = ogURL?.content;
                if(ogURL==showroomURL) {
                    clearInterval(maint);
                    return;
                }
                const showroomID = /(?!room_id=)\d+$/.exec(window.document.querySelector("#this-room-profile")?.href)[0];
                const liveURL = "https://www.showroom-live.com/api/live/live_info?room_id="+showroomID;
                const req = new XMLHttpRequest();
                let live_status;
                req.onload = function(){
                    if(req.status == 200){
                        live_status = JSON.parse(req.responseText).live_status;
                        isOnLive = live_status == 2;
                    }
                }
                req.open("GET",liveURL,false);
                req.send(null);
                if(!isOnLive) {
                    clearInterval(maint);
                    return;
                }
                //免费礼物点一下就能十连发
                const comboInterval=25;
                const list = window.document.querySelector("#room-gift-item-list");
                const gift = list.childNodes;
                for(let i = 0;i<5;i++){
                    gift[i].addEventListener('mousedown',(e)=>{
                        if(e.which ==1){//左键点下
                            const num = e.target.parentNode.parentNode.querySelector("div").innerText.split(" ")[1]-1;
                            const comboNum = num > 9 ? 9 : num;
                            for(let i = 1;i<=comboNum;i++){
                                setTimeout(()=>{e.target.click();},i*comboInterval)
                            }
                        }
                    })
                }

                //评论栏和发送按钮
                inputSelector ='.comment-input-text';
                sendSelector = '.js-room-comment-btn';
            }
            //iframe,生日直播间之类的会成嵌套框架的结构，那个时候只看框架代码
            if(isBilibili&&!(window.document.firstChild instanceof window.Comment)){//「あなたに逢えなくなって、錆びた時計と泣いたけど…」
                clearInterval(maint);
                return;
            }
            clearInterval(maint);

            const callDealler = (call) => {
                let tempcallResult = [];
                call = call.trim();
                call = call.replace(/　/g, '');
                call = call.replace(/ /g, '');
                call = call.replace(/\n{2,}/g, '\n');
                tempcallResult = call.split('\n');
                return tempcallResult;
            }
            let callResult = [];
            let currIndex = 0;
            let t = null;
            let ct = null;
            const inputEvent = document.createEvent("Event");
            inputEvent.initEvent("input",true, true);
            const send = function(){
                if(isYoutube){
                    biliTextArea.innerText = callResult[currIndex++];
                }else{
                    biliTextArea.value = callResult[currIndex++];
                }
                biliTextArea.dispatchEvent(inputEvent);
                biliTextSender.click();
            }
            const next = function() {
                if(isShowroom&&!biliTextSender.classList.contains('is-disabled')){
                    biliTextArea.value = "";
                    pause();
                    return;
                }
                currIndex %= callResult.length;
                send();
            }
            let intervalChoose;
            const init = function() {
                biliTextArea = window.document.querySelector(inputSelector);
                biliTextSender = window.document.querySelector(sendSelector);
                if(isYoutube){
                    biliTextArea = window.document.querySelector("#input").querySelector("#input");
                    biliTextSender = window.document.querySelector("#send-button").querySelector("#button");
                }
                currIndex = 0;
                send();
                timeLabel.innerText = intervalChoose;
                t = setInterval(next, intervalChoose * 1000);
            }

            // ------------------GUI设计开始---------------
            // 总容器
            const container = window.document.createElement('div');
            container.style.cssText = 'width:260px;position:fixed;bottom:5px;left:5px;z-index:999;box-sizing:border-box;';

            // 工具名称
            const topTool = window.document.createElement('div');
            topTool.innerText = 'call';
            topTool.style.cssText = 'text-align:center;line-height:20px;height:20px;width:100%;color:rgb(210,143,166);font-size:14px;';

            // 最小化按钮
            const collapseButton = window.document.createElement('button');
            collapseButton.innerText = unfold[isunfold];
            collapseButton.style.cssText = 'float:right;width:40px;height:20px;border:none;cursor:pointer;background-color:#1890ff;border-radius:1px;color:#ffffff;';

            // 主窗口
            const mainWindow = window.document.createElement('div');
            mainWindow.style.cssText = 'width:100%;background-color:rgba(220, 192, 221, .5);padding:10px;box-sizing:border-box;';
            if(isunfold==0){
                mainWindow.style.display = "none";
            }
            // call框
            const textArea = window.document.createElement('textarea');
            textArea.style.cssText = 'width:100%;height:50px;resize:none;outline:none;background-color:rgba(255,255,255,.5);border-radius:2px';

            // 按钮区容器
            const buttonArea = window.document.createElement('div');
            buttonArea.style.cssText = 'width:100%;height:30px;box-sizing:border-box;display:flex; justify-content: center;';

            // 按钮区容器2
            const buttonArea2 = window.document.createElement('div');
            buttonArea2.style.cssText = 'width:100%;height:30px;box-sizing:border-box;display:flex;justify-content: space-around;';

            // 开始按钮
            const goButton = window.document.createElement('button');
            goButton.innerText = '开始';
            goButton.style.cssText = 'width:max-content;height:28px;padding:0 5px;margin-left:5px;';

            // 发送间隔提示文本
            const intervalLabel = window.document.createElement('div');
            intervalLabel.innerText = '发送间隔：'
            intervalLabel.style.cssText = 'width:70px;height:28px;line-height:28px;';

            // 888功能按钮
            let hachihachiButton;
            if(isBilibili){
                hachihachiButton = window.document.createElement('button');
                hachihachiButton.innerText = hachihachitext[hachihachikinou];
                hachihachiButton.style.cssText = 'width:max-content;height:28px;padding:0 5px;margin-left:5px;';
            }
            // 选择延迟
            const interval = window.document.createElement('input');
            interval.type = "range";
            interval.step = "0.1";
            interval.min = (intervaltime-2)/2;
            interval.value = intervaltime;
            interval.max = (+intervaltime+14)*1.5;
            interval.style.cssText = 'width:max-content;padding:0 5px;height:28px;margin-left:5px;';

            const timeLabel = window.document.createElement('div');
            timeLabel.innerText = intervaltime;
            timeLabel.style.cssText = 'width:24px;height:28px;line-height:28px;';

            const secondLabel = window.document.createElement('div');
            secondLabel.innerText = '秒';
            secondLabel.style.cssText = 'width:max-content;height:28px;line-height:28px;';

            // 倒计时
            const countDownButton = window.document.createElement('button');
            countDownButton.setAttribute("contenteditable", "true");
            countDownButton.innerText = countdown;
            countDownButton.style.cssText = 'width:50px;height:28px;margin-left:5px;padding:0 5px;';

            // 组装
            topTool.appendChild(collapseButton);
            container.appendChild(topTool);

            mainWindow.appendChild(textArea);

            buttonArea.appendChild(intervalLabel);
            buttonArea.appendChild(interval);
            buttonArea.appendChild(timeLabel);
            buttonArea.appendChild(secondLabel);
            buttonArea2.appendChild(goButton);
            if(isBilibili){
                buttonArea2.appendChild(hachihachiButton);
            }
            buttonArea2.appendChild(countDownButton);
            mainWindow.appendChild(buttonArea);
            mainWindow.appendChild(buttonArea2);
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
                    mainWindow.style.display = 'block';
                    collapseButton.innerText = '收起';
                    return;
                }
            }, false);
            if(isBilibili){
                hachihachiButton.addEventListener('click', () => {
                    hachihachikinou=(hachihachikinou+1)%2;
                    hachihachiButton.innerText = hachihachitext[hachihachikinou];
                }, false);
            }
            //显示滑动条数字
            interval.oninput = function() {
                timeLabel.innerText = interval.value;
            }

            if(isShowroom){
                container.style.width = "282px";
                timeLabel.style.width = "32px";
            }
            let roomID;
            if(isBilibili){
                roomID = /\d+/.exec(location.pathname)[0];
                //填充上次所写的打call语句
                const tsc = localStorage.getItem('tampermonkey_script_call');
                const setting = localStorage.getItem('tampermonkey_script_call_setting');
                if(tsc){
                    const tscJson = JSON.parse(tsc);
                    textArea.value = tscJson[roomID]||``;
                }else{
                    localStorage.setItem('tampermonkey_script_call',JSON.stringify({}));
                }
                //填充上次使用的设置
                if(setting){
                    const settingJson = JSON.parse(setting);
                    if(settingJson[roomID]){
                        intervaltime = settingJson[roomID][0];
                        interval.min = 2;
                        interval.value = intervaltime;
                        interval.max = intervaltime>30?intervaltime:30;
                        timeLabel.innerText = intervaltime;
                        countDownButton.innerText = settingJson[roomID][1];
                        hachihachikinou = settingJson[roomID][2];
                        hachihachiButton.innerText = hachihachitext[hachihachikinou];
                    }

                }else{
                    localStorage.setItem('tampermonkey_script_call_setting',JSON.stringify({}));
                }

            }
            //-------------------gui设计结束------------------
            let intervalValBox ;
            function createInput(){
                intervalLabel.innerText = "";
                intervalValBox = document.createElement('input');
                intervalValBox.style.width = "100%";
                intervalValBox.placeholder = "输入数值";
                intervalLabel.appendChild(intervalValBox);
                intervalLabel.onclick = null;
            }
            intervalLabel.onclick =createInput;
            function pause(){
                clearInterval(t);
                clearInterval(ct);
                if(isBilibili){
                    bliveproxy.removeCommandHandler('DANMU_MSG', hdl);
                }
                goButton.innerText = '开始';
                countDownButton.innerText = countdown;
                countDownButton.setAttribute("contenteditable", "true");
                if(isShowroom&&textArea.value.trim() === ''){
                    //showroom中如果输入为空，则进行50 count。
                    interval.min = (intervaltime-2)/2;
                    interval.value = intervaltime;
                    timeLabel.innerText = intervaltime;
                }
            }
            function hdl(command) {
                const info = command.info;
                if(/^8+/.test(info[1])){
                    hachihachitimes+=1;
                }
                if(hachihachitimes>=hachihachi){
                    pause();
                    hachihachitimes = 0;
                }

            }
            const countdownfunc = function() {
                if (countDownButton.innerText > 0) {
                    countDownButton.innerText -= 1;
                } else {
                    pause();
                }

            }
            goButton.addEventListener('click', () => {
                if (goButton.innerText == '暂停') {
                    pause()
                    return;
                }

                if(isBilibili&&hachihachikinou){
                    bliveproxy.addCommandHandler('DANMU_MSG', hdl);
                }
                if(intervalValBox){
                    intervalValBox.remove();
                    intervalLabel.innerText = "发送间隔：";
                    intervalLabel.onclick = createInput;
                }
                const value = textArea.value;
                callResult = callDealler(value);
                if (value.trim() === '') {
                    if(!isShowroom){
                        window.alert('打尻：您还没有输入call语句');
                        return;
                    }else{
                        //设定50 count
                        const kankaku = 2; //50 count的时间间隔
                        countDownButton.innerText = kankaku*(50-1)+1;//这个值是我乱猜的
                        interval.min = kankaku;
                        interval.value = kankaku;
                        timeLabel.innerText = kankaku;
                        callResult = Array.from({length:50}, (v,k) => k+1);
                    }
                }
                if(!(countDownButton.innerText>0)){
                   return
                }
                if(intervalValBox&&parseFloat(intervalValBox.value) > 0){
                    timeLabel.innerText = intervalValBox.value;
                    intervalChoose = intervalValBox.value;
                }else{
                    intervalChoose = interval.value;
                }

                if(isBilibili){
                    const tsc_temp = localStorage.getItem('tampermonkey_script_call');
                    const tscJson_temp = JSON.parse(tsc_temp);
                    tscJson_temp[roomID] = textArea.value;
                    localStorage.setItem('tampermonkey_script_call',JSON.stringify(tscJson_temp));

                    const setting_temp = localStorage.getItem('tampermonkey_script_call_setting');
                    const settingJson_temp = JSON.parse(setting_temp);
                    settingJson_temp[roomID] = [intervalChoose,countDownButton.innerText,hachihachikinou];
                    localStorage.setItem('tampermonkey_script_call_setting',JSON.stringify(settingJson_temp));
                }
                ct = setInterval(countdownfunc, 1000);
                goButton.innerText = '暂停';
                countDownButton.setAttribute("contenteditable", "false");
                if (!isNaN(parseFloat(countDownButton.innerText))&&!(isShowroom&&textArea.value.trim() === '')) {
                    countdown = countDownButton.innerText;
                }
                init();
            }, false);
        } catch (e) {
            times-=1;
            if(times==0){
                times = timescopy;
                clearInterval(maint);
                if(window.confirm('打尻：发生未知错误\n可能是在加载中无法获取元素\n' + e+"\n是否重新尝试打尻？")){
                    maint= setInterval(main, 1000 * waitTime);
                }
            };
        }
    }
    maint= setInterval(main, 1000 * waitTime);
})();
