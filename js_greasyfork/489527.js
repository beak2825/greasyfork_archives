// ==UserScript==
// @name         获取直播弹幕
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  在线获取弹幕
// @author       37
// @match        https://buyin.jinritemai.com/*
// @match        https://zs.kwaixiaodian.com/*
// @match        https://liveplatform.taobao.com/*
// @match        https://live.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/489527/%E8%8E%B7%E5%8F%96%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/489527/%E8%8E%B7%E5%8F%96%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let ws;
    let observer;
    let waitMsgList = [];
    let stopWs = false;
    let goodsList = []
    let wxUrl = ''
    let promotionsList = []
    let nowHost = window.location.host
    let ksBol = false
    let tbWscomments = []
    let tbOnceArr = []
    let tbOnceArrLastMsg = ''
    let  timeElment = ''
    function connectWebSocket() {
        ws = new WebSocket(wxUrl);
        ws.addEventListener('open', () => {
            if (nowHost == 'zs.kwaixiaodian.com') {
                ksBol = false
                $('.ReactVirtualized__List').scrollTop(9999)
                setTimeout(() => {
                    ksBol = true
                }, 1000)
            }


            console.log('连接成功')
            const submitButton = document.querySelector('#submitButton');
            submitButton.textContent = `断开弹幕采集${nowHost == 'zs.kwaixiaodian.com' ? '(提示:连接弹幕后请勿手动拖动弹幕列表!)' : ''}`;

            if (waitMsgList.length) {
                waitMsgList.forEach((item) => {
                    ws.send(item);
                    console.log('成功发送缓存---', item);
                });
                waitMsgList = [];
            }

        });

        ws.addEventListener('message', event => {
            console.log('从服务器接收到消息:', JSON.parse(event.data));
            JSON.parse(event.data).type == 3 && findGoods(JSON.parse(event.data).answerText[0])
        });
        ws.addEventListener('close', (event) => {
            const submitButton = document.querySelector('#submitButton');
            submitButton.textContent = '连接弹幕采集';
            if (stopWs) {
                stopWs = false
            } else {
                setTimeout(() => {
                    console.log('WebSocket 已关闭--正在重新连接');
                    connectWebSocket(wxUrl);
                }, 3000);
            }
        });
    }

    function startObserver() {
        observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(addedNode => {
                    var userElement = ''
                    var contentElement = ''
                    if (nowHost == 'buyin.jinritemai.com') {//抖音捕捉弹幕逻辑
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains('index-module__commentItem___2fLb5')) {
                            userElement = addedNode.querySelector('.index-module__nickname___L6O_K');
                            contentElement = addedNode.querySelector('.index-module__description___2W_id');
                        }
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains('index-module__newCommentShadow___3rffn')) {
                            console.log('监测到需要加载新弹幕')
                            $(".index-module__newCommentShadow___3rffn")[0].click()
                        }
                    }

                    if (nowHost == 'zs.kwaixiaodian.com') {//快手捕捉弹幕逻辑（快手中控有后台监测，需手动活跃到可视窗口）
                        if (!ksBol) return;//等待滚动条加载

                        try {
                            if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.childNodes.length && addedNode.childNodes[0].classList.contains('list-item--f1eox')) {
                                userElement = addedNode.querySelector('.username--naHYA');
                                contentElement = addedNode.querySelector('.replied-content--OFcGD');
                            }
                        } catch (error) { }

                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains('bubble--qrbI7')) {
                            try {
                                $(".bubble--qrbI7")[0].click()
                            } catch (error) {
                                // console.log(error)
                            }
                        }
                    }

                    if (nowHost == 'liveplatform.taobao.com') {//淘宝捕捉弹幕逻辑

                        // console.log('------进入淘宝-----');
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains('tc-comment-item')) {
                            userElement = addedNode.querySelector('.tc-comment-item-userinfo-name ')
                            contentElement = addedNode.querySelector('.tc-comment-item-content span')
                            timeElment = addedNode.querySelector('.alpw-comment-time').textContent.trim()
                            tbWscomments.push({ userName: userElement.textContent, answerText: contentElement.textContent,timestamp:timeElment })
                            tbOnceArr = tbWscomments.filter((value, index, self) => {
                                return index === self.findIndex(item => item.userName === value.userName && item.answerText === value.answerText)
                            })
                            //当前时间
                            const currentTime = new Date();
                            const fiveMinutesBefore = new Date(currentTime.getTime() - 5 * 60 * 1000);
                            const fiveMinutesAfter = new Date(currentTime.getTime() + 5 * 60 * 1000);
                            tbOnceArr = tbOnceArr.filter((item) => {
                                const itemTimestamp = new Date().setHours(item.timestamp.substring(0, 2), item.timestamp.substring(3, 5), 0);
                                return itemTimestamp >= fiveMinutesBefore && itemTimestamp <= fiveMinutesAfter;
                              });

                            // console.log(tbWscomments, tbOnceArr,timeElment,'淘宝消息');
                        }
                        //如果有需要加载的提示
                        var element = $(".tc-comment-list-newtip")
                        // 判断特定条件
                        if (element.css("display") === "block") {
                            element.trigger('click')
                            element.click(function () {
                            });
                        }

                    }


                    if (nowHost == 'live.baidu.com') { //百度捕捉弹幕逻辑
                        // console.log('进入百度弹幕');
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains('chat-room-msg')) {
                            userElement = addedNode.querySelector('.msg-box-name');
                            contentElement = addedNode.querySelector('.msg-box-text');
                        }



                    }



                    //发送弹幕
                    if (contentElement) {
                        if (nowHost == 'liveplatform.taobao.com' && tbOnceArr.length !== 0) {
                            if  ( tbOnceArr[tbOnceArr.length -1].answerText !== tbOnceArrLastMsg) {
                                const dataToSend = {
                                    answerText: tbOnceArr[tbOnceArr.length - 1].answerText,
                                    type: 1
                                }
                                if (ws && ws.readyState === 1) {
                                    tbOnceArrLastMsg = tbOnceArr[tbOnceArr.length - 1].answerText
                                    ws.send(JSON.stringify(dataToSend));
                                    console.log('成功发送弹幕---', tbOnceArr[tbOnceArr.length - 1].userName, tbOnceArr[tbOnceArr.length - 1].answerText);
                                } else {
                                    tbOnceArrLastMsg = tbOnceArr[tbOnceArr.length - 1].answerText
                                    console.log('储存弹幕一条---', tbOnceArr[tbOnceArr.length - 1].userName, tbOnceArr[tbOnceArr.length - 1].answerText);
                                    waitMsgList.push(JSON.stringify(dataToSend));
                                }
                            }
                           
                        } else if(nowHost != 'liveplatform.taobao.com') {
                            console.log("进入别的平台");
                            const dataToSend = {
                                answerText: contentElement.textContent,
                                type: 1
                            };
                            if (ws && ws.readyState === 1) {
                                ws.send(JSON.stringify(dataToSend));

                                console.log('成功发送弹幕---', userElement.textContent, contentElement.textContent);
                            } else {

                                console.log('储存弹幕一条---', userElement.textContent, contentElement.textContent);
                                waitMsgList.push(JSON.stringify(dataToSend));
                            }
                        }

                    }
                });
            });
        });


        observer.observe(document.documentElement, { childList: true, subtree: true });

    }





    function getGoodsList() {
        const match = wxUrl.match(/websocket\/([^\/]+)/);
        if (match ? match[1] : null) {
            $.ajax({
                type: "GET",
                url: "https://buyin.jinritemai.com/api/anchor/livepc/promotions",
                success: function (data) {
                    promotionsList = data.data.promotions
                    goodsList = data.data.promotions.map((data, index) => {
                        return {
                            goodName: data.title,
                            goodNo: index + 1,
                            price: data.min_price / 100,
                            liveId: match[1],
                        }
                    })
                    const dataToSend = {
                        answerText: goodsList,
                        type: 4
                    };
                    ws.send(JSON.stringify(dataToSend));
                    alert('更新商品成功')
                }
            });
        } else { console.log('获取liveID失败') }

    }
    function findGoods(item) {
        $.ajax({
            type: "POST",
            url: "https://buyin.jinritemai.com/api/anchor/livepc/setcurrent",
            data: { promotion_id: promotionsList[item.goodNo - 1].promotion_id },
            success: function (data) {
                document.querySelectorAll(".index__actionItem___2Z8YV")[1].click()
            }
        });
    }
    function stopObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }
    function disconnectWebSocket() {
        if (ws) {
            ws.close();
            stopObserver()
            stopWs = true
            console.log('WebSocket 已手动断开连接');
        }
    }

    function createFloatingInput() {
        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'fixed';
        inputContainer.style.top = '60px';
        inputContainer.style.left = '20px';
        inputContainer.style.zIndex = '999999';

        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('placeholder', '输入 WebSocket 地址');
        inputElement.classList.add('input-box');
        inputElement.style.padding = '8px';
        inputElement.style.border = '1px solid #ccc';
        inputElement.style.borderRadius = '4px';
        inputElement.style.outline = 'none';

        const submitButton = document.createElement('button');
        submitButton.id = 'submitButton'
        submitButton.textContent = '连接弹幕采集';
        submitButton.style.marginLeft = '8px';
        submitButton.style.padding = '8px';
        submitButton.style.border = '1px solid #ccc';
        submitButton.style.borderRadius = '4px';
        submitButton.style.backgroundColor = '#f0f0f0';
        submitButton.style.cursor = 'pointer';

        const goodsButton = document.createElement('button');
        goodsButton.id = 'submitButton'
        goodsButton.textContent = '更新抖音商品';
        goodsButton.style.marginLeft = '8px';
        goodsButton.style.padding = '8px';
        goodsButton.style.border = '1px solid #ccc';
        goodsButton.style.borderRadius = '4px';
        goodsButton.style.backgroundColor = '#f0f0f0';
        goodsButton.style.cursor = 'pointer';

        submitButton.addEventListener('click', () => {
            const inputVal = inputElement.value.trim();
            if (inputVal) {
                if (ws && ws.readyState == 1) {
                    disconnectWebSocket();
                } else {
                    startObserver()
                    wxUrl = inputVal
                    connectWebSocket(inputVal);
                }
            }
        });
        goodsButton.addEventListener('click', () => {
            getGoodsList()
        });
        inputContainer.appendChild(inputElement);
        inputContainer.appendChild(submitButton);
        nowHost == 'buyin.jinritemai.com' && inputContainer.appendChild(goodsButton);
        document.body.appendChild(inputContainer);
    }
    createFloatingInput();

})();
