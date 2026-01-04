// ==UserScript==
// @name         哔哩哔哩防沉迷 @yzl
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  不出意外的话我会对个脚本持续更新下去,我目前未添加显示定时器的功能,作者由于技术力和时间的问题此脚本功能尚不完全，望谅解
// @author       U1iz
// @match        https://www.bilibili.com/*
// @license      MIT
// @icon         http://res1433223.net3v.net/img/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438698/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%98%B2%E6%B2%89%E8%BF%B7%20%40yzl.user.js
// @updateURL https://update.greasyfork.org/scripts/438698/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%98%B2%E6%B2%89%E8%BF%B7%20%40yzl.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url;
    window.onload = function () {
        url = window.location.href; /* 获取完整URL */
        console.log(url);
        if (document.getElementById('addByScriptAuthor_U1iz_MsgBox')) {
            tip_func();
        } else {
            var msgCtr = document.createElement('div');
            // msgCtr.setAttribute('id','addByScriptAuthor_U1iz_MsgBox');
            msgCtr.id = 'addByScriptAuthor_U1iz_MsgBox';
            document.body.append(msgCtr);
            tip_func();
        }
    }
    window.addEventListener('keyup', function (e) {
        // console.log(e.keyCode);
        if (e.altKey && e.keyCode == 88) {
            main_func();
        }
    })

    function tip_func() {
        var msgBox = document.getElementById('addByScriptAuthor_U1iz_MsgBox');
        msgBox.style.color = 'transparent';
        msgBox.style.backgroundColor = 'transparent';
        msgBox.style.zIndex = '999999999999999999999999999999';
        msgBox.innerHTML = '按下 Alt + X 执行防沉迷脚本';
        msgBox.style.position = 'absolute';
        msgBox.style.top = '7.2rem';
        msgBox.style.left = document.body.clientWidth / 2 - msgBox.clientWidth / 2 + 'px';
        msgBox.style.padding = '0.4rem 1rem';
        msgBox.style.font = '400 1rem "microsoft YaHei"';
        msgBox.style.borderRadius = '24px';
        msgBox.style.transition = 'all 1s';
        setTimeout(function () {
            msgBox.style.top = '3.2rem';
            msgBox.style.backgroundColor = 'rgba(36, 39, 46, 0.6)';
            msgBox.style.color = 'rgb(237, 236, 245)';

            setTimeout(function () {
                msgBox.style.top = '-1rem';
                msgBox.style.color = 'transparent';
                msgBox.style.backgroundColor = 'transparent';
                setTimeout(function () {
                    msgBox.remove();
                }, 1100)
            }, 3000);
        }, 1000);
    }

    function replaceByDiv() {
        document.documentElement.innerHTML += '<body> <div id="addByScriptAuthor_U1iz"></div> </body>';
        var addByMe = document.getElementById("addByScriptAuthor_U1iz");

        if (addByMe) {
            addByMe.style.position = "absolute";
            addByMe.style.top = 0;
            addByMe.style.left = 0;
            addByMe.style.width = "100%";
            addByMe.style.height = "100%";
            addByMe.style.backgroundColor = "#ccc";
            addByMe.style.backgroundImage = "linear-gradient(135deg,rgb(44, 170, 212), rgb(223, 61, 112))";
            addByMe.style.transition = "all 0.3s";
            addByMe.style.zIndex = 99999999999999999000;
        }
    }

    function main_func() {
        var limitTime = 1;
        var visitTime = 0;

        function onlded() {
            limitTime++;
            console.log(limitTime);
            if (limitTime == 12) {} else {
                /* 存储用户输入的字符冰转换 */
                var user_ipt = prompt("请为此次你的b站浏览限定一个时间" + "\n" + "（输入数字，0代表无限）");
                var user_iptToNum = parseFloat(user_ipt);
                console.log(user_ipt);

                if (user_ipt == "") {
                    alert("未设置限制时间");
                } else {
                    console.log(user_ipt);
                    /* 退出模块2 */
                    if (limitTime % 3 == 0) {
                        prompt("输入0表示退出:");
                    }

                    /* 矫正用户输入模块 */
                    if (user_iptToNum.toString().length == user_ipt.length) {
                        if (user_iptToNum == 0) {} else {
                            // window.visitTime = user_iptToNum;
                            visitTime = user_iptToNum * 60 * 1000;
                            FormClose(visitTime);
                            user_iptToNum < 300 ? alert("你已成功将此次b站浏览时间设为了" + user_iptToNum + "分钟;" + "\n" + user_iptToNum + "分钟后此浏览器元素将被清空，请注意保存重要工作！") : alert("你已成功将此次b站浏览时间设为了" + user_iptToNum + "分钟;" + "\n" + user_iptToNum + "分钟后此浏览器元素将被清空，请注意保存重要工作！" + "\n" + "呃呃,设置得这么高有什么意义吗");
                        }
                    } else {
                        alert("数值错误请再次输入" + "\n" + "(例： 10)");
                        onlded();
                    }
                }
            }
        }

        /* 首页推荐选择关闭模块 */
        var type = false;
        (function () {
            if (url.length == 25 && url == 'https://www.bilibili.com/') {
                var type_user_ipt = prompt("是否关闭首页推荐？" + "\n" + "（y/n）");
                type_user_ipt == "y" ? type = true : type = false;
                if (type) {
                    alert("首页推荐已关闭！");
                    if (document.getElementsByClassName('recommend-container__2-line')[0]) {
                        document.getElementsByClassName('recommend-container__2-line')[0].style.display = 'none';
                    }
                    if (document.getElementsByClassName('first-screen')[0]) {
                        document.getElementsByClassName('first-screen')[0].style.display = 'none';
                    }
                    if (document.getElementsByClassName('b-wrap')[0]) {
                        document.getElementsByClassName('b-wrap')[0].style.display = 'none';
                    }
                } else {
                    alert("未设置");
                }
            }
        })();

        onlded();

        /* 首页推荐关闭模块 */
        var ctr01 = document.getElementsByClassName('first-screen')[0];
        var ctr02 = document.getElementsByClassName('b-wrap')[0];
        var ctr03 = document.getElementsByClassName('space-between')[0];
        var ctr04 = document.getElementsByClassName('rec-list')[0];
        (function () {
            if (type) {
                if (ctr01) {
                    ctr01.remove();
                } else if (ctr02) {
                    ctr02.remove();
                } else if (ctr03) {
                    ctr03.remove();
                } else if (ctr04) {
                    ctr04.remove();
                }
            }
        }());

        function FormClose(time) {
            if (time == 0) {} else {
                setTimeout(function () {
                    var body = document.body;
                    body.remove();
                    replaceByDiv();
                    console.log(233333);
                }, time);
            }
        }
    }
})();