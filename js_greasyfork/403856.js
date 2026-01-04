// ==UserScript==
// @name         腾讯课堂助手
// @name:zh-CN   腾讯课堂助手
// @namespace    http://blog.z31.xyz/
// @version      2.1
// @description  自动进行签到, 记录签到数据, 去除XXX正在观看的弹幕, 解除必须登录的限制, 直播课自动5分钟刷新一次防止断流
// @description:zh-cn 自动进行签到, 记录签到数据, 去除XXX正在观看的弹幕, 解除必须登录的限制, 直播课自动5分钟刷新一次防止断流
// @author       simonkimi
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403856/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403856/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {
        gui();
        insertCSS();
        sign();
    }, 3000);
    if (window.location.href.indexOf("vid") === -1) {
        setTimeout(() => {
            location.reload()
        }, 1000 * 60 * 5)
    }
    function insertCSS() {
        const styleNode = document.createElement("style");
        styleNode.innerHTML = `
        [class*="player-marquee"]{display: none!important;}
        .ptlogin-mask{display: none!important;}
        .ptlogin-wrap{display: none!important;}
        .pause-ctn{display: none!important;}
        .sk-sign-log {
            height: 400px;
            overflow-y: scroll;
        }
        .sk-sign-item {
            font-family: "Microsoft YaHei",serif
        }
        .sk-sign-table {
            width: 100%;
        }
        .sk-sign-table td {
            padding: 6px 24px 6px 16px;
            border-bottom: 1px solid rgba(224, 224, 224, 1);
            font-size: 14px;
        }
    `;
        document.head.appendChild(styleNode);
    }

    function storeSign() {
        const storage = window.localStorage;
        let signData = JSON.parse(storage.getItem(`sk-sign`) || "[]");
        signData = signData.filter(value => new Date().getTime() - value.time < 7 * 24 * 60 * 60 * 1000);
        const className = document.getElementsByClassName('current-task-name')[0].innerHTML;
        signData.push({
            className,
            time: new Date().getTime()
        });
        storage.setItem('sk-sign', JSON.stringify(signData))
    }

    function setSignNum(num) {
        document.getElementsByClassName('applied-text')[0].innerHTML = `本课程今日已签到${num}次`
    }

    function sign() {
        const storage = window.localStorage;
        const termId = /term_id=([0-9]+?)&/.exec(window.location.href)[1] || "0";
        const signData = JSON.parse(storage.getItem(`sk-sign-${termId}`) || "{}");
        const date = new Date();
        const dateTime = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
        let {signNum = 0, signDate = "0"} = signData;
        if (signDate !== dateTime) {
            signNum = 0
        }
        setSignNum(signNum);
        setInterval(() => {
            const signElements = document.getElementsByClassName("s-btn s-btn--primary s-btn--m");
            for (let e of signElements) {
                if (e.innerHTML === '签到') {
                    e.click();
                    signNum += 1;
                    storage.setItem(`sk-sign-${termId}`, JSON.stringify({
                        signDate: dateTime,
                        signNum
                    }));
                    setSignNum(signNum);
                    storeSign();
                    setTimeout(() => {
                        for (let e of document.getElementsByClassName("s-btn s-btn--primary s-btn--m")) {
                            if (e.innerHTML === '确定') {
                                e.click();
                            }
                        }
                    }, 2000)
                }
            }
        }, 5000);
    }



    function gui() {
        const headers = document.getElementsByClassName('operations')[0];
        // 签到助手按钮
        const signButton = document.createElement("div");
        signButton.className = "header-item sign";
        signButton.innerText = "签到记录";
        // 历史展示页面
        const signPopup = document.createElement('div');
        signPopup.style.cssText = 'display:none; position:absolute; top:52px; left:50%; transform:translate(-50%);box-sizing: border-box; color:#000';
        signButton.onmouseenter = () => {
            signPopup.style.display = 'block';
            signData();
        };
        signButton.onmouseleave = () => {
            signPopup.style.display = 'none'
        };
        // code
        const codePopup = document.createElement('div');
        codePopup.className = 'code-popup sk-sign-log';
        codePopup.style.height = '400px';
        // table
        const table = document.createElement('table');
        table.className = 'sk-sign-table';
        const tbody = document.createElement('tbody');
        // 填充数据
        function signData() {
            console.log("加载签到记录");
            // 清除原来的数据
            tbody.innerHTML = "";
            const storage = window.localStorage;
            let signData = JSON.parse(storage.getItem(`sk-sign`) || "[]");
            console.log(signData);
            for (let e of signData) {
                const tr = document.createElement("tr");
                tr.className = 'sk-sign-item';
                const td1 = document.createElement('td');
                td1.innerText = formatDate(e.time);
                const td2 = document.createElement('td');
                td2.innerText = e.className;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tbody.appendChild(tr);
            }
        }
        signData();
        table.appendChild(tbody);
        codePopup.appendChild(table);
        signButton.appendChild(signPopup);
        signPopup.appendChild(codePopup);
        headers.insertBefore(signButton, headers.childNodes[0])
    }

    function formatDate(d) {
        const date = new Date(d);
        const YY = date.getFullYear() + '-';
        const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD +" "+hh + mm + ss;
    }
})();

