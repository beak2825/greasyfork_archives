// ==UserScript==
// @name         Get code client(Kick)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get stake code from kick!
// @author       FCFC
// @match        https://kick.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://lib.baomitu.com/socket.io/4.7.3/socket.io.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.setValue
// @grant GM.getValue
// @grant GM_setClipboard
// @grant GM_notification
// @grant GM_addValueChangeListener
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487187/Get%20code%20client%28Kick%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487187/Get%20code%20client%28Kick%29.meta.js
// ==/UserScript==
(function() {
    //// @require      file://F:/orther/stake-drop/stake-drop/node_modules/socket.io/client-dist/socket.io.min.js
    'use strict';
    var $ = $ || window.$;
    $(function(){
        var socketUrl = 'https://www.hh123.site/'
        //var socketUrl = 'http://localhost:3000/'
        console.log(`+ ---------------------------------- +
Name: Get code client(Kick) Version: 1.1
+ ---------------------------------- +`)
        //var userName = ['Steve','Mikey','BlondeRabbit','hanvee','Syztmz','Rains5','diegusmoneymaker','Mikey','ekanos','lacroixla','iceinmyvein']
        var userName = ['Steve','Mikey']
        var msgObserver = null
        var socket = io(socketUrl,{
            query: {
                "user": 'admin_kick'
            }
        })
        //var socket = io('http://localhost:3000/')
        console.log(socket)
        socket.on("connect", () => {
            logger('连接ID:' + socket.id); // "G5p5..."
        });
        socket.io.on("error", (error) => {
            console.log('连接错误')
        });
        socket.io.on("ping", () => {
            console.log('ping')
        });
        socket.on('chat message', function(msg) {
            logger('来自服务器消息：' + JSON.stringify(msg))
        });
        /*
        * 监听节点函数
        * @param object target 要监听的节点对象
        */
        function listenNode(target, option, cb) {
            // Firefox和Chrome早期版本中带有前缀
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
            // 创建观察者对象
            var observer = new MutationObserver(function(mutations){
                mutations.forEach(function(mutation) {
                    cb(mutation)
                });
            });
            // 配置观察选项:
            //var config = { attributes: true, childList: true, characterData: true }

            // 传入目标节点和观察选项
            observer.observe(target, option);
            return observer
        }
        // 首次进入，先获取信息组的组后一个组进行监听
        firstIn()
        function firstIn() {
            console.log('首次进入页面监听信息列表项')
            let target = $("#chatroom .relative .overflow-y-scroll")[0]
            if (target) {
                listenMsg(target)
            } else {
                setTimeout(()=>{
                    firstIn()
                },1000)
            }
        }
        // 监听数据
        function listenMsg(target){
            logger('监听信息列表项', target)
            var config = { childList: true, characterData: true }
            msgObserver = listenNode(target, config, function (mutation) {
                if(mutation.addedNodes) {
                    let user = $(mutation.addedNodes).find('.chat-entry .chat-message-identity .chat-entry-username').text()
                    if (userName.includes(user)) {
                        let cont = $(mutation.addedNodes).find('.chat-entry .chat-entry-content').text()
                        if (cont) {
                            if (/^[\da-zA-Z]*$/.test(cont) && cont.length > 2) {
                                logger('匹配到code：' + cont + ' 来自：' + user)
                                socket.emit('chat message',cont);
                            } else {
                                console.log('不是code：' + cont)
                            }
                        }
                    }
                }
            })
            logger(msgObserver)
        }
        /**
         * 更新日志方法
         */
        function logger(text){
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours() >=10 ? date.getHours() : `0${date.getHours()}`
            let min = date.getMinutes() >=10 ? date.getMinutes() : `0${date.getMinutes()}`
            let second = date.getSeconds() >=10 ? date.getSeconds() : `0${date.getSeconds()}`
            let timeStr = date.getTime()
            let timeStr1 = new Date(`${year}-${month}-${day} ${hour}:${min}:${second}`).getTime()
            let haomiao = 0
            if (timeStr - timeStr1 < 10) {
                haomiao = `00${timeStr - timeStr1}`
            } else if (timeStr - timeStr1 >= 10 && timeStr - timeStr1 < 100) {
                haomiao = `0${timeStr - timeStr1}`
            } else {
                haomiao = timeStr - timeStr1
            }
            let time = `${year}-${month}-${day} ${hour}:${min}:${second}.${haomiao}`
            let mark = `[${time}] `
            let logtext = `${mark}${text}`
            console.log(logtext)
        }

    })
    // Your code here...
})();