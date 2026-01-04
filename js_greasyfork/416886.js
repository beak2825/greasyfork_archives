// ==UserScript==
// @name         ERP-任务表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       
// @match        */personalTableTask
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/416886/ERP-%E4%BB%BB%E5%8A%A1%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/416886/ERP-%E4%BB%BB%E5%8A%A1%E8%A1%A8.meta.js
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
            var checkBoxSel = "#dataTable > tbody > tr:nth-child(1) > td.bs-checkbox > input[type=checkbox]"
            // 自评
            var zipingSel = "#pencil"
            // document.querySelector("#completion").value=100
            // document.querySelector("#reasonInfo").value="完成"
            // 提交
            var tijiaoSel = "#save"
            // 确认
            var querenSel = "div.layui-layer-btn.layui-layer-btn- > a"
            // 刷新
            // var shuaxinSel = "#divStyle > div > div:nth-child(1) > div > div > div > button:nth-child(2)"

            // 第一条的审批状态
            var shenpiStatus ="#dataTable > tbody > tr:nth-child(1) > td:nth-child(4)"
//            console.log("shenpiStatus:",document.querySelector(shenpiStatus))
            if(!!document.querySelector(shenpiStatus)){
//             console.log("document.querySelector(shenpiStatus).textContent====||",document.querySelector(shenpiStatus).textContent,document.querySelector(shenpiStatus).textContent=="--")
            if(document.querySelector(shenpiStatus).textContent=="--"){
                obsCheckClick(checkBoxSel)
                    .then(() =>
                          obsClick(zipingSel)
                         )
                    .then(() =>
                          obsFill("#completion","100",5)
                         )
					.then(() =>
                          obsFill("#reasonInfo","完成",5)
                         )
                    .then(() =>
                          obsClick(tijiaoSel,5)
                         )
                    .then(() =>
                          obsClick(querenSel,5)
                         )
//                     .then(
                    //   () => window.location.reload()
//                 )
            }
            loopFunc(5000)
                }
        },tt);
    }
    loopFunc(5000)
    // Your code here...
    function sleep(time, desc = 'sleep') {
        return new Promise(resolve => {
            //sleep
            setTimeout(() => {
               // console.log(desc, time, 's')
                resolve(time)
            }, Math.floor(time * 1000))
        })
    }

	function obsFill(selector,fillValue, time = 0, desc = 'fill') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            target.value=fillValue
                            console.log(1,desc, selector,target)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        setTimeout(() => {
                            target.value=fillValue
                            console.log(2,desc, selector,target)
                            resolve(selector)
                        }, time * 1000)
                    } else {
                        target.value=fillValue
                        console.log(3,desc, selector,target)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
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
                            console.log(1,desc, selector)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        target.click()
                        setTimeout(() => {
                            console.log(2,desc, selector)
                            resolve(selector)
                        }, time * 1000)
                    } else {
                        target.click()
                        console.log(3,desc, selector)
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