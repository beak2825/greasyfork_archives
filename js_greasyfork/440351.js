// ==UserScript==
// @name         sobclear
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  添加一个一键已读按钮
// @author       cctyl
// @match        https://www.sunofbeach.net/*
// @icon         https://www.google.com/s2/favicons?domain=sunofbeach.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440351/sobclear.user.js
// @updateURL https://update.greasyfork.org/scripts/440351/sobclear.meta.js
// ==/UserScript==

(function () {
    'use strict';


    let cssStr = `
        #clear-msg{
            color: #0084ff;
            width:15px;
            margin-right: 12px !important;
        }
    `;

    /**
     * 添加css样式
     * @returns {boolean}
     */
    function initCss() {

        let addTo = document.querySelector('body');
        if (!addTo)
            addTo = (document.head || document.body || document.documentElement);


        //创建style标签
        let cssNode = document.createElement("style");
        cssNode.setAttribute("type", "text/css");


        //设置css值
        cssNode.innerHTML = cssStr;
        try {
            addTo.appendChild(cssNode);
        } catch (e) {
            console.log(e.message);
        }


    }

    /**
     * 获取cookie值
     * @param name
     * @returns {string|null}
     * @deprecated 因为有多个sobtoken，暂时不用他
     */
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    //重试次数
    let tryCount = 0
    //多个sobtoken组成的数组
    let sobTokenArr = []

    /**
     * 获取到所有的sobtoken
     */
    function getSobToken() {
        let cookies = document.cookie
        cookies = cookies.split(';')
        for (let i = 0; i < cookies.length; i++) {

            let cookieTemp = cookies[i];
            if (cookieTemp.indexOf("sob_token") !== -1) {
                let tempSobArr = cookieTemp.split('=');
                sobTokenArr.push(tempSobArr[1])
            }

        }
    }


    /**
     * 发送请求清除消息
     */
    function clearMsg(sobToken) {
        // https://api.sunofbeaches.com/ct/msg/read
        tryCount++;
        fetch('https://api.sunofbeaches.com/ct/msg/read', {
            headers: {
                'sob_token': sobToken,

            },
            credentials: "include"
        })
            .then(response => {

                response.json().then(value => {
                    console.log(value)
                    if (value.code === 10000) {
                        console.log("发送成功")
                        let ring = document.querySelector('.el-badge__content')
                        ring.style.display = "none"

                    } else {
                        console.log('发送失败')
                        //如果失败了，就重发
                        //重发次数有限制，有多少sobtoken就发多少次
                        if (tryCount < sobTokenArr.length) {
                            console.log("重试")
                            clearMsg(sobTokenArr[tryCount])
                        }
                    }
                })


            })
            .then(data => console.log(data));

    }


    /**
     * 摸鱼动态的输入框允许粘贴
     */
    function allowPaste() {
        let divInput = document.querySelector('div[contenteditable]')
        if (divInput) {
            divInput.addEventListener("paste", function (e) {


                e.stopPropagation();

                e.preventDefault();

                var text = '', event = (e.originalEvent || e);

                console.log(event.clipboardData)

                if (event.clipboardData && event.clipboardData.getData) {

                    text = event.clipboardData.getData('text/plain');

                } else if (window.clipboardData && window.clipboardData.getData) {

                    text = window.clipboardData.getData('Text');

                }

                if (document.queryCommandSupported('insertText')) {

                    document.execCommand('insertText', false, text);

                } else {

                    document.execCommand('paste', false, text);

                }

            })
        }


    }


    //允许粘贴
    allowPaste();


    //创建节点
    let clsBtnParent = document.getElementById('header-login-success');
    let newnode = document.createElement("i");


    //设置id
    newnode.setAttribute('id', 'clear-msg')
    newnode.setAttribute('class', 'el-icon-delete')


    //添加到节点中
    clsBtnParent.insertBefore(newnode, clsBtnParent.firstChild);


    //初始化样式
    initCss();

    //获取cookie
    getSobToken();

    //添加点击事件
    setTimeout(() => {
        newnode.onclick = function () {

            clearMsg(sobTokenArr[0])
        }
    }, 1000)


})();
