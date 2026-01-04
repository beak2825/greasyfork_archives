// ==UserScript==
// @name         抖音去水印视频下载-黑狗伴侣
// @namespace    https://vt.javadev.top/
// @version      3.4.0
// @description  解析web版抖音，获取抖音去水印视频下载地址，多分辨率识别。
// @author       北封
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/search/*
// @require      https://greasyfork.org/scripts/447699-spop/code/spop.js?version=1069143
// @license GPLv3
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447256/%E6%8A%96%E9%9F%B3%E5%8E%BB%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD-%E9%BB%91%E7%8B%97%E4%BC%B4%E4%BE%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/447256/%E6%8A%96%E9%9F%B3%E5%8E%BB%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD-%E9%BB%91%E7%8B%97%E4%BC%B4%E4%BE%A3.meta.js
// ==/UserScript==
var hgWebSocket = null;
var lockReconnect = false;  //避免ws重复连接
var defaultWsPort = 12888;
var connectSocketSucceed = false;
var sendMessageInternal;
function connectSocket() {
    try {
        hgWebSocket = new WebSocket("ws://127.0.0.1:" + defaultWsPort + "/plugin.sph-download");
        initEvent();
    } catch (e) {
        reconnect();
        // console.log(e);
        // console.log('111111')
    }
}
function suggestPort() {
    if (defaultWsPort == 12888) {
        defaultWsPort = 8899;
    } else if (defaultWsPort == 8899) {
        defaultWsPort = 12888;
    }
    return defaultWsPort;
}
//重连
function reconnect() {

    if (lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        connectSocket();
        lockReconnect = false;
    }, 2000);
}
function closeConnectSocket() {
    hgWebSocket.close();
    connectSocketSucceed = false;
}
function initEvent() {
    //连接发生错误的回调方法
    hgWebSocket.onerror = function (e) {
        spop({
            template: '<a href="https://wcmyxpl8xu.feishu.cn/docx/doxcnUweuEbh4Vbo3h0xXgQWFCd" target="_blank" >未检测到黑狗客户端，请启动客户端</a>',// string required. Without it nothing happens!
            style: 'error',// success, warning or error
            autoclose: 150000,// miliseconds
            group: 'one-pop',
            position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
            icon: true// or false
        });
        suggestPort();
        reconnect();
        console.log("llws连接错误!");
    };

    //连接成功建立的回调方法
    hgWebSocket.onopen = function (event) {
        connectSocketSucceed = true;
        // 链接成功，消去之前的toast
        spop({
            template: '一大波狗粮在路上，汪汪~~~',// string required. Without it nothing happens!
            style: 'success',// success, warning or error
            autoclose: 2000,// miliseconds
            group: 'one-pop',
            position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
            icon: true// or false
        });
        console.log("llws连接成功!" + new Date().toLocaleString());
    }

    //接收到消息的回调方法
    hgWebSocket.onmessage = function (event) {
        console.log("llws收到消息啦:" + event.data);
        connectSocketSucceed = true;
        var data = JSON.parse(event.data);
        if (data.command == 'message') {
            spop({
                template: data.text,// string required. Without it nothing happens!
                style: 'success',// success, warning or error
                autoclose: 5000,// miliseconds
                group: 'one-pop',
                position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
        } else if (data.command == 'alert') {
            spop({
                template: data.text,// string required. Without it nothing happens!
                style: 'error',// success, warning or error
                autoclose: 15000,// miliseconds
                group: 'one-pop',
                position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
        }
        // document.getElementById('down_a_back').innerHTML='喂狗粮（自动带标题下载）'+data.text;

    }

    //连接关闭的回调方法
    hgWebSocket.onclose = function (e) {
        console.log("llws连接关闭!" + new Date().toLocaleString());
        connectSocketSucceed = false;
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        hgWebSocket.close();
    }
}


(function () {
    'use strict';
    window.autoRefresh = function autoRefresh(time){
        if(time<=0){
            time = Math.floor(Math.random() * (20000 - 3000 + 1)) + 3000;
        }
        console.log("下次执行时间间隔："+time)
        // alert(1)
        var height = document.body.scrollHeight;
        document.scrollingElement.scrollTo(0,height +2000);
        // var autoButton = document.getElementById('auto_refresh_a_id');
        setTimeout(function () {
            var afterHeight = document.body.scrollHeight;
            if(afterHeight>height) {
                autoRefresh(Math.floor(Math.random() * (20000 - 3000 + 1)) + 3000);
            }
        },time);

    }
    window.addStyle = function addStyle(cssText) {
        let a = document.createElement('style');
        a.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(a);
    }
    window.copyToClipboard = function copyToClipboard(content, message) {
        let $input = document.createElement('textarea')
        $input.style.opacity = '0'
        $input.value = content
        document.body.appendChild($input)
        $input.select()
        document.execCommand('copy', true)
        document.body.removeChild($input)
        $input = null
        if (message) {
            spop({
                template: message ? message : '复制成功',// string required. Without it nothing happens!
                style: 'success',// success, warning or error
                autoclose: 2000,// miliseconds
                group: 'one-pop',
                position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
        }
    }
    window.sendToHeiGouDown = function sendToHeiGouDown(url, text) {
        if ('WebSocket' in window) {
            if (!connectSocketSucceed) {
                connectSocket();
            }
            sendMessageInternal = setInterval(function () {
                if (connectSocketSucceed) {
                    var sendMessage = { 'command': 'down', 'type': 'dy_plugin', data: [{ 'url': url, 'text': text }] };
                    sendMessage = encodeURIComponent(JSON.stringify(sendMessage));
                    hgWebSocket.send(sendMessage);
                    clearInterval(sendMessageInternal);
                } else {
                    console.log('等待黑狗张嘴~');
                }
            }, 500)
        } else {
            alert('Not support websocket');
            return;
        }

    }
    var data = document.getElementById('RENDER_DATA');
    if (data) {
        addStyle(`
    .spop-container{z-index:2000;position:fixed}.spop-container,.spop-container *,.spop-container :after,.spop-container :before{box-sizing:border-box}.spop--top-left{top:0;left:0}.spop--top-left .spop{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}.spop--top-center{top:0;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}.spop--top-center .spop{-webkit-transform-origin:50% 0;-ms-transform-origin:50% 0;transform-origin:50% 0}.spop--top-right{top:0;right:0}.spop--top-right .spop{-webkit-transform-origin:100% 0;-ms-transform-origin:100% 0;transform-origin:100% 0}.spop--center{top:50%;left:50%;-webkit-transform:translate3d(-50%,-50%,0);transform:translate3d(-50%,-50%,0)}.spop--center .spop{-webkit-transform-origin:50% 0;-ms-transform-origin:50% 0;transform-origin:50% 0}.spop--bottom-left{bottom:0;left:0}.spop--bottom-left .spop{-webkit-transform-origin:0 100%;-ms-transform-origin:0 100%;transform-origin:0 100%}.spop--bottom-center{bottom:0;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}.spop--bottom-center .spop{-webkit-transform-origin:50% 100%;-ms-transform-origin:50% 100%;transform-origin:50% 100%}.spop--bottom-right{bottom:0;right:0}.spop--bottom-right .spop{-webkit-transform-origin:100% 100%;-ms-transform-origin:100% 100%;transform-origin:100% 100%}@media screen and (max-width:30em){.spop--bottom-center,.spop--bottom-left,.spop--bottom-right,.spop--top-center,.spop--top-left,.spop--top-right{top:auto;bottom:0;left:0;right:0;margin-left:0;-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}.spop--bottom-center .spop,.spop--bottom-left .spop,.spop--bottom-right .spop,.spop--top-center .spop,.spop--top-left .spop,.spop--top-right .spop{-webkit-transform-origin:50% 100%;-ms-transform-origin:50% 100%;transform-origin:50% 100%}.spop{border-bottom:1px solid rgba(0,0,0,.15)}}.spop{position:relative;min-height:56px;line-height:1.25;font-size:14px;-webkit-transform:translateZ(0);transform:translateZ(0)}@media screen and (min-width:30em){.spop{border-radius:2px;width:320px;margin:.7em}}.spop--error,.spop--info,.spop--success,.spop--warning{color:#fff;background-color:#454A56}@-webkit-keyframes spopIn{0%{-webkit-transform:scale(.2,.2);transform:scale(.2,.2)}95%{-webkit-transform:scale(1.1,1.1);transform:scale(1.1,1.1)}100%{-webkit-transform:scale(1,1);transform:scale(1,1)}}@keyframes spopIn{0%{-webkit-transform:scale(.2,.2);transform:scale(.2,.2)}95%{-webkit-transform:scale(1.1,1.1);transform:scale(1.1,1.1)}100%{-webkit-transform:scale(1,1);transform:scale(1,1)}}@-webkit-keyframes spopOut{0%{opacity:1;-webkit-transform:scale(1,1);transform:scale(1,1)}20%{-webkit-transform:scale(1.1,1.1);transform:scale(1.1,1.1)}100%{opacity:0;-webkit-transform:scale(0,0);transform:scale(0,0)}}@keyframes spopOut{0%{opacity:1;-webkit-transform:scale(1,1);transform:scale(1,1)}20%{-webkit-transform:scale(1.1,1.1);transform:scale(1.1,1.1)}100%{opacity:0;-webkit-transform:scale(0,0);transform:scale(0,0)}}.spop--out{-webkit-animation:spopOut .4s ease-in-out;animation:spopOut .4s ease-in-out}.spop--in{-webkit-animation:spopIn .4s ease-in-out;animation:spopIn .4s ease-in-out}.spop-body{padding:1.4em}.spop-body p{margin:0}.spop-body a{color:#fff;text-decoration:underline}.spop-body a:hover{color:rgba(255,255,255,.8);text-decoration:none}.spop-title{margin-top:0;margin-bottom:.25em;color:#fff}.spop-close{position:absolute;right:0;top:0;height:32px;width:32px;padding-top:7px;padding-right:7px;font-size:22px;font-weight:700;text-align:right;line-height:.6;color:#fff;opacity:.5}.spop-close:hover{opacity:.7;cursor:pointer}.spop-icon{position:absolute;top:13px;left:16px;width:30px;height:30px;border-radius:50%;-webkit-animation:spopIn .4s .4s ease-in-out;animation:spopIn .4s .4s ease-in-out}.spop-icon:after,.spop-icon:before{content:"";position:absolute;display:block}.spop-icon+.spop-body{padding-left:4.2em}.spop-icon--error,.spop-icon--info{border:2px solid #3a95ed}.spop-icon--error:before,.spop-icon--info:before{top:5px;left:11px;width:4px;height:4px;background-color:#3a95ed}.spop-icon--error:after,.spop-icon--info:after{top:12px;left:11px;width:4px;height:9px;background-color:#3a95ed}.spop-icon--error{border-color:#ff5656}.spop-icon--error:before{top:16px;background-color:#ff5656}.spop-icon--error:after{top:5px;background-color:#ff5656}.spop-icon--success{border:2px solid #2ecc54}.spop-icon--success:before{top:7px;left:7px;width:13px;height:8px;border-bottom:3px solid #2ecc54;border-left:3px solid #2ecc54;-webkit-transform:rotate(-45deg);-ms-transform:rotate(-45deg);transform:rotate(-45deg)}.spop-icon--warning{border:2px solid #fcd000}.spop-icon--warning:before{top:7px;left:7px;width:0;height:0;border-style:solid;border-color:transparent transparent #fcd000;border-width:0 6px 10px}
    `);
        setTimeout(function () {
            var decodeData = decodeURIComponent(data.innerText);
            var json = JSON.parse(decodeData);
            for (var item in json) {
                if (json[item]['aweme']) {
                    var detail = json[item]['aweme']['detail'];
                    console.log(detail)
                    var video = detail.video;
                    let showInfo = { bitRate: 0 };
                    if (video.bitRateList) {
                        var bitRateList = video.bitRateList;
                        for (var i = 0; i < bitRateList.length; i++) {
                            var bitRate = +bitRateList[i].gearName.split('_')[1];
                            var text = '视频下载：' + bitRate + 'p';
                            var url = bitRateList[i].playApi
                            if (bitRate > showInfo.bitRate) {
                                showInfo = {
                                    text: text,
                                    url: url,
                                    bitRate: bitRate
                                }
                            }
                        }
                    }
                    var defaultUrl = video.playApi;
                    var defaultRatio = +video.ratio.replace('p', '');
                    if (defaultRatio > showInfo.bitRate) {
                        var text = '视频下载：' + defaultRatio + 'p';
                        showInfo = {
                            text: text,
                            url: defaultUrl,
                            bitRate: defaultRatio
                        }
                    }
                    console.log(defaultRatio)
                    var buttons = document.getElementsByTagName('button')
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].innerText == '关注' || buttons[i].innerText == '已关注') {
                            var classNames = buttons[i].className;
                            console.log(classNames)
                            var btnGrand = buttons[i].parentNode.parentNode;
                            const div = document.createElement('div');

                            var downA = document.createElement('a');
                            downA.href = showInfo.url;
                            downA.target = '_blank';
                            downA.innerHTML = showInfo.text;
                            downA.className = classNames;
                            div.appendChild(downA);


                            var copyText = document.createElement('a');
                            copyText.href = 'javascript:copyToClipboard(\'' + detail.desc + '\',\'视频标题复制成功\')';
                            copyText.innerHTML = '复制视频标题';
                            copyText.className = classNames;
                            div.appendChild(copyText);

                            var br = document.createElement('br');
                            div.appendChild(br);
                            var br2 = document.createElement('br');
                            div.appendChild(br2);

                            var sentToBackDown = document.createElement('a');
                            sentToBackDown.href = 'javascript:sendToHeiGouDown(\'' + defaultUrl + '\',\'' + detail.desc + '\')';
                            sentToBackDown.innerHTML = '喂狗粮（一键带标题下载）';
                            sentToBackDown.id = 'down_a_back';
                            sentToBackDown.className = classNames;
                            div.appendChild(sentToBackDown);

                            // var processP = document.createElement('p');
                            // processP.className=classNames;
                            // processP.id='progress_con_p';
                            // // processP.style='display: none;';
                            // var processSpan = document.createElement('span');
                            // processSpan.innerHTML='下载进度';
                            // processP.appendChild(processSpan);
                            // var processMeter = document.createElement('meter');
                            // processMeter.min=0;
                            // processMeter.max=100;
                            // processMeter.id='process_meter_m';
                            // processP.appendChild(processMeter);
                            // div.appendChild(processP);


                            btnGrand.after(div);
                            console.log('add btn');
                            // 复制标题按钮
                        }
                    }
                }
            }
        }, 1500);
        setTimeout(function() {
            // var auto_class_names='';
            // var buttons = document.getElementsByTagName('button')
            // for (var i = 0; i < buttons.length; i++) {
            //     if (buttons[i].innerText == '关注' || buttons[i].innerText == '已关注') {
            //         auto_class_names = buttons[i].className;
            //         break;
            //     }
            // }
            var spans = document.getElementsByTagName('span')
            for (var i = 0; i < spans.length; i++) {
                if (spans[i].innerText == '搜索' ) {
                    // var classNames = auto_class_names;
                    var classNames = spans[i].className;;
                    console.log(classNames)
                    var btnGrand = spans[i].parentNode.parentNode;
                    console.log(btnGrand)
                    var downA = document.createElement('a');
                    downA.href = 'javascript:autoRefresh(0)';
                    downA.innerHTML = '开启自动刷新';
                    downA.id="auto_refresh_a_id";
                    downA.className = classNames;
                    btnGrand.appendChild(downA);
                    // document.scrollingElement.scrollTo(0,document.body.scrollHeight +2000)
                    break;
                }
            }
        },1500);
    }
})();