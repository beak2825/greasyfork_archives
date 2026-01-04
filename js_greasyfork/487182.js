// ==UserScript==
// @name         Get code client(TG)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Get stake code from telegram!
// @author       FCFC
// @match        https://web.telegram.org/a/*
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
// @downloadURL https://update.greasyfork.org/scripts/487182/Get%20code%20client%28TG%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487182/Get%20code%20client%28TG%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = $ || window.$;
    $(function(){
        var version = 2.3
        var debug = false // 是否是调试模式
        var msgObserver = null
        var push = false // 是否推送code
        console.log(`+ ---------------------------------- +
Name: Get code client(TG) Version: ${version} debug: ${debug}
+ ---------------------------------- +`)
        var socketUrl = debug ? 'http://localhost:3000/' : 'https://www.hh123.site/'
        if (debug) {
            console.log(`请求地址：${socketUrl}`)
        }
        function controlAction() {
            var html = `<div id="drop-status" style="position:fixed;right: 10px;top:508px;width:50px;height:30px;text-align:center;line-height:30px;border-radius:2px;background:green;color:#fff;font-size:12px;cursor:pointer;z-index:10000">推送</div>`
            $('body').append(html)
            $('#drop-status').click(function(){
                if (push) {
                    push = false
                    $(this).text('推送')
                } else {
                    push = true
                    $(this).text('推送中')
                }
            })
        }
        controlAction()
        var socket = io(socketUrl,{
            query: {
                "user": 'admin'
            }
        })
        console.log(socket)
        socket.on("connect", () => {
            logger('连接ID:' + socket.id); // "G5p5..."
        });
        socket.io.on("error", (error) => {
            logger('连接错误',error)
        });
        socket.io.on("ping", () => {
            console.log('ping')
        });
        socket.on('chat message', function(msg) {
            logger(`from server:  ${JSON.stringify(msg)}`)
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
        // 监听信息组
        setTimeout(()=>{
            listenMsgGroup()
        },4000)
        function listenMsgGroup() {
            let target = $("#MiddleColumn .Transition .MessageList .messages-container")[0]
            if (!target) {
                setTimeout(()=>{
                    listenMsgGroup()
                },1000)
                return
            }
            // console.log('监听信息组',target)
            var config = { attributes: true, childList: true, characterData: true, subtree: true }
            var chatListObserver = listenNode(target, config, function (mutation) {
                if(mutation.addedNodes) {
                    if ($(mutation.addedNodes).hasClass('message-date-group')) {
                        let item = $(mutation.addedNodes).find('.message-list-item')
                        if (item[0]) {
                            let textWrap = item.last().find('.message-content-wrapper .message-content .content-inner .text-content')
                            if (textWrap[0]) {
                                checkCode(textWrap)
                            }
                        }
                    }
                    if ($(mutation.addedNodes).hasClass('message-list-item')) {
                        // console.log('新信息',mutation.addedNodes)
                        let textWrap = $(mutation.addedNodes).find('.message-content-wrapper .message-content .content-inner .text-content')
                        if (textWrap[0]) {
                            checkCode(textWrap)
                        }
                    }
                    // 监听信息被编辑的情况
                    if ($(mutation.target).hasClass('text-content')) {
                        let text = $(mutation.addedNodes).text()
                        checkCode($(mutation.addedNodes))
                    }
                }
            })
            console.log(chatListObserver)
        }
        // 判断code
        function checkCode(target) {
            let marks = ['Code:', 'code:', 'Code-', 'code-']
            target.contents().each(function() {
                if (this.nodeType === 3) { // 判断是否为文本节点
                    let text = this.nodeValue.trim()
                    if (/^[\da-zA-Z]*$/.test(text) && text.length >=3) {
                        logger('A匹配到code：' + text)
                        if (push) {
                             socket.emit('chat message',text);
                        }
                    } else {
                        marks.forEach(mark=>{
                            if (text.indexOf(mark) > -1) {
                                let codeList = text.split(mark)
                                console.log('B代码列表', codeList)
                                let code = codeList[1].trim()
                                if (code && code.length >= 3) {
                                    logger('B匹配到code: ' + code)
                                    if (push) {
                                        socket.emit('chat message',code);
                                    }
                                } else {
                                    //console.log('C不是code: ' +　code)
                                }
                            } else {
                                //console.log('B不是code: ' +　text)
                            }
                        })
                    }
                }
                // 是元素节点
                if (this.nodeType === 1) {
                    // 如果是加密隐藏的内容
                    if ($(this).hasClass('Spoiler')) {
                        console.log('这是隐藏文字，', this.innerText)
                        let text = this.innerText
                        if (this.innerText.indexOf('\n') > -1) {
                            let codeList = this.innerText.split('\n')
                            //console.log(codeList)
                            codeList.forEach(item => {
                                if (item) {
                                    logger('匹配到CODE：' + item)
                                    if (push) {
                                        socket.emit('chat message',item);
                                    }
                                }
                            })
                        } else {
                            logger('匹配到CODE：' + this.innerText)
                            if (push) {
                                socket.emit('chat message',this.innerText);
                            }
                        }
                    }
                }
            });
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