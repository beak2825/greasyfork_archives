// ==UserScript==
// @name         魔卡-助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Ifover
// @match        http://appimg2.qq.com/card/index_v3.html*

// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/421880/%E9%AD%94%E5%8D%A1-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/421880/%E9%AD%94%E5%8D%A1-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function () {
    'use strict';
    // 设置Skey
    var setSkey = function () {
        var a, r = new RegExp("skey=(@.{9})");
        if (a = document.cookie.match(r)) {
            var li = document.createElement('li')
            li.innerHTML = `<b>${a[1]}</b>`;
            li.onclick = function () {
                GM_setClipboard(a[1].substring(1), 'text');
                this.innerHTML = `复制成功`;
                this.style.color = 'green'
                setTimeout(() => {
                    this.style.color = '#3367cd'
                    this.innerHTML = `<b>${a[1]}</b>`;
                }, 1000)
            }
            document.getElementsByClassName('path_link')[0].append(li)
        }
    };
    // 设置移动端跳转
    var setWap = function () {
        var li2 = document.createElement('li')
        li2.innerHTML = `<a href='http://appimg.qq.com/cardhd/cardh5/index.html?gamepf=wb' target='_blank'>手机版</a>`;
        document.getElementsByClassName('path_link')[0].append(li2)
    }
    // 设置版权信息
    var setCopyRight = function () {
        let isCopyRightHide = GM_getValue('isCopyRightHide', false)
        let copyright = document.getElementById('copyright')

        let li = document.createElement('li')
        let btn = document.createElement('button')
        btn.innerHTML = isCopyRightHide ? '显示版权' : '隐藏版权';
        copyright.style.display = isCopyRightHide ? 'none' : 'block';

        btn.onclick = function () {
            isCopyRightHide = !isCopyRightHide
            this.innerHTML = isCopyRightHide ? '显示版权' : '隐藏版权';
            copyright.style.display = isCopyRightHide ? 'none' : 'block';
            GM_setValue('isCopyRightHide', isCopyRightHide)
        }
        li.append(btn)

        document.getElementsByClassName('path_link')[0].append(li)
    }
    // 设置日志
    var setRecordModel = function () {
        let isRecordHide = GM_getValue('isRecordHide', false)
        let recordModel = document.getElementsByClassName('record_model')[0]


        let li = document.createElement('li')
        let btn = document.createElement('button')

        btn.innerHTML = isRecordHide ? '显示日志' : '隐藏日志';
        recordModel.style.display = isRecordHide ? 'none' : 'block';
        btn.onclick = function () {
            isRecordHide = !isRecordHide
            this.innerHTML = isRecordHide ? '显示日志' : '隐藏日志';
            recordModel.style.display = isRecordHide ? 'none' : 'block';
            GM_setValue('isRecordHide', isRecordHide)
        }
        li.append(btn)

        document.getElementsByClassName('path_link')[0].append(li)
    }
    // 魔卡工具
    var setMcardTool = function (){
        let isMcardToolHide = GM_getValue('isMcardToolHide', false)
        let container = document.getElementById('container')


        let li = document.createElement('li')
        let a = document.createElement('a')
        a.innerText = isMcardToolHide ? '打开助手' : '关闭助手';
        container.style.display = isMcardToolHide ? 'none' : 'block';

        a.onclick = function (){
            isMcardToolHide = !isMcardToolHide
            this.innerText = isMcardToolHide ? '打开助手' : '关闭助手';
            container.style.display = isMcardToolHide ? 'none' : 'block';
            GM_setValue('isMcardToolHide', isMcardToolHide)
        }
        li.append(a)

        document.getElementsByClassName('path_link')[0].append(li)
    }
    setSkey();// 设置Skey
    setWap();// 设置移动端跳转
    setCopyRight();// 设置版权信息
    setRecordModel();// 设置日志
    setMcardTool();


    var cardStyle = `.path_link a{margin:0 !important;} .path_link li:nth-of-type(n+3):before{content:'|';margin:0 5px;}`
    GM_addStyle(cardStyle)
})();
