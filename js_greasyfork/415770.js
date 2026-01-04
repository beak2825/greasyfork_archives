// ==UserScript==
// @name         ERP-待办
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author
// @match        */erp/todolist
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/415770/ERP-%E5%BE%85%E5%8A%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/415770/ERP-%E5%BE%85%E5%8A%9E.meta.js
// ==/UserScript==

(function() {
    var setting = {},
        _self = unsafeWindow,
        url = location.pathname,
        top = _self;

    var $ = _self.jQuery || top.jQuery,
        parent = _self == top ? self : _self.parent,
        Ext = _self.Ext || parent.Ext || {},
        UE = _self.UE,
        Hooks = Hooks || window.Hooks;
    var myDate = new Date();

    setting.normal = ''; // ':visible'
    var st;

    function loopFunc (tt){
        st = setTimeout(function(){

            // 复选框
            var checkBoxSel = "#divStyle > div > div:nth-child(2) > div > div > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td > div > label > span > input"
            // 处理
            var chuliSel = "#divStyle > div > div:nth-child(1) > div > div > div > button:nth-child(5)"
            // 提交
            var tijiaoSel = "body > div.el-dialog__wrapper > div > div.el-dialog__body > form > div > div > div.el-row > div > button:nth-child(5) > span"
            // 确认
            var querenSel = "body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary > span"
            // 刷新
            var shuaxinSel = "#divStyle > div > div:nth-child(1) > div > div > div > button:nth-child(2)"

            obsCheckClick(checkBoxSel)
                .then(
                () => obsClick(chuliSel)
            )
                .then(() =>
                      obsClick(tijiaoSel)
                     )
                .then(
                () => obsClick(querenSel)
            )
                .then(
             //   () => window.location.reload()
            )
            loopFunc(5000)
        },tt);
    }
    loopFunc(5000)
    // Your code here...
    function sleep(time, desc = 'sleep') {
        return new Promise(resolve => {
            //sleep
            setTimeout(() => {
                console.log(desc, time, 's')
                resolve(time)
            }, Math.floor(time * 1000))
        })
    }

    function obsClick(selector, time = 0, desc = 'click') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            target.click()
                            console.log(desc, selector)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        target.click()
                        setTimeout(() => {
                            console.log(desc, selector)
                            resolve(selector)
                        }, time * 1000)
                    } else {
                        target.click()
                        console.log(desc, selector)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    function obsCheckClick(selector, time = 0, desc = 'click') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                console.log(desc, selector,target)
                if (!!target) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            if(!target.checked){
                                target.click()
                                console.log(1,desc, selector)
                                resolve(selector)}
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        if(!target.checked){
                            target.click()
                            setTimeout(() => {
                                console.log(2,desc, selector)
                                resolve(selector)
                            }, time * 1000)}
                    } else {
                        if(!target.checked){
                            target.click()
                            console.log(3,desc, selector)
                            resolve(selector)}
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

})();