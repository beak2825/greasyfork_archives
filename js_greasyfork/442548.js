// ==UserScript==
// @name         abc_helloworld
// @namespace    http://tampermonkey.net/
// @version      117.0
// @description  helloworld!
// @author       You
// @match        https://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @match        https://zt.huya.com/d6e8655c/pc/index.html
// @match        https://zt.huya.com/459da919/pc/index.html
// @match        https://www.douyu.com/topic/*
// @match        https://www.huya.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442548/abc_helloworld.user.js
// @updateURL https://update.greasyfork.org/scripts/442548/abc_helloworld.meta.js
// ==/UserScript==

(function () {
    (function (workerScript) {
        if (!/MSIE 10/i.test(navigator.userAgent)) {
            try {
                var blob = new Blob(["\
var fakeIdToId = {};\
onmessage = function (event) {\
var data = event.data,\
name = data.name,\
fakeId = data.fakeId,\
time;\
if(data.hasOwnProperty('time')) {\
time = data.time;\
}\
switch (name) {\
case 'setInterval':\
fakeIdToId[fakeId] = setInterval(function () {\
postMessage({fakeId: fakeId});\
}, time);\
break;\
case 'clearInterval':\
if (fakeIdToId.hasOwnProperty (fakeId)) {\
clearInterval(fakeIdToId[fakeId]);\
delete fakeIdToId[fakeId];\
}\
break;\
case 'setTimeout':\
fakeIdToId[fakeId] = setTimeout(function () {\
postMessage({fakeId: fakeId});\
if (fakeIdToId.hasOwnProperty (fakeId)) {\
delete fakeIdToId[fakeId];\
}\
}, time);\
break;\
case 'clearTimeout':\
if (fakeIdToId.hasOwnProperty (fakeId)) {\
clearTimeout(fakeIdToId[fakeId]);\
delete fakeIdToId[fakeId];\
}\
break;\
}\
}\
"]);
                // Obtain a blob URL reference to our worker 'file'.
                workerScript = window.URL.createObjectURL(blob);
            } catch (error) {
                /* Blob is not supported, use external script instead */
            }
        }
        var worker,
            fakeIdToCallback = {},
            lastFakeId = 0,
            maxFakeId = 0x7FFFFFFF, // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer
            logPrefix = 'HackTimer.js by turuslan: ';
        if (typeof (Worker) !== 'undefined') {
            function getFakeId() {
                do {
                    if (lastFakeId == maxFakeId) {
                        lastFakeId = 0;
                    } else {
                        lastFakeId++;
                    }
                } while (fakeIdToCallback.hasOwnProperty(lastFakeId));
                return lastFakeId;
            }
            try {
                worker = new Worker(workerScript);
                window.setInterval = function (callback, time /* , parameters */) {
                    var fakeId = getFakeId();
                    fakeIdToCallback[fakeId] = {
                        callback: callback,
                        parameters: Array.prototype.slice.call(arguments, 2)
                    };
                    worker.postMessage({
                        name: 'setInterval',
                        fakeId: fakeId,
                        time: time
                    });
                    return fakeId;
                };
                window.clearInterval = function (fakeId) {
                    if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                        delete fakeIdToCallback[fakeId];
                        worker.postMessage({
                            name: 'clearInterval',
                            fakeId: fakeId
                        });
                    }
                };
                window.setTimeout = function (callback, time /* , parameters */) {
                    var fakeId = getFakeId();
                    fakeIdToCallback[fakeId] = {
                        callback: callback,
                        parameters: Array.prototype.slice.call(arguments, 2),
                        isTimeout: true
                    };
                    worker.postMessage({
                        name: 'setTimeout',
                        fakeId: fakeId,
                        time: time
                    });
                    return fakeId;
                };
                window.clearTimeout = function (fakeId) {
                    if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                        delete fakeIdToCallback[fakeId];
                        worker.postMessage({
                            name: 'clearTimeout',
                            fakeId: fakeId
                        });
                    }
                };
                worker.onmessage = function (event) {
                    var data = event.data,
                        fakeId = data.fakeId,
                        request,
                        parameters,
                        callback;
                    if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                        request = fakeIdToCallback[fakeId];
                        callback = request.callback;
                        parameters = request.parameters;
                        if (request.hasOwnProperty('isTimeout') && request.isTimeout) {
                            delete fakeIdToCallback[fakeId];
                        }
                    }
                    if (typeof (callback) === 'string') {
                        try {
                            callback = new Function(callback);
                        } catch (error) {
                            console.log(logPrefix + 'Error parsing callback code string: ', error);
                        }
                    }
                    if (typeof (callback) === 'function') {
                        callback.apply(window, parameters);
                    }
                };
                worker.onerror = function (event) {
                    console.log(event);
                };
            } catch (error) {
                console.log(logPrefix + 'Initialisation failed');
                console.error(error);
            }
        } else {
            console.log(logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
        }
    })('HackTimerWorker.js');

    'use strict'
    //个位数补0
    function getZero(num) {
        // 单数前面加0
        if (parseInt(num) < 10) {
            num = '0' + num
        }
        return num
    }

    const initBox = () => {
        const style = `
            #msBox{
                background-color:rgba(255,255,255,0.8);
                width:260px;
                font-size:14px;
                position:fixed;
                bottom:0%;
                padding:10px;
                border-radius:5px;
                box-shadow:1px 1px 9px 0 #888;
                transition:right 1s;
                text-align:center
            }
        `
        const html = `
            <div id='msBox'>
                <h3 class="title" style="color:red">
                    <p><span id='msBoxTitle'>msBox4.6</span></p>
                </h3>
                <div class='curMsg'>
                    <p><span id='msBoxMsg'>loading . .</span></p>
                </div>
                <div class='btn'>
                    <p><span id='msBoxBtn'></span></p>
                </div>
            </div>
         `
        var stylenode = document.createElement('style');
        stylenode.setAttribute("type", "text/css");
        if (stylenode.styleSheet) { // IE
            stylenode.styleSheet.cssText = style;
        } else { // w3c
            var cssText = document.createTextNode(style);
            stylenode.appendChild(cssText);
        }
        var node = document.createElement('div');
        node.innerHTML = html;
        document.head.appendChild(stylenode);
        document.body.appendChild(node);
    }

    function bz1() {
        var h = -1
        var m = -1
        var s = -1
        var delay_refresh = 1000
        var delay_getTime = 500
        var delay_click = 10
        var i = 0
        //console.log("⭐B站_领取奖励⭐")
        setTimeout(() => {
            //console.log("⭐B站_领取奖励⭐")
            document.querySelector('#msBoxTitle').innerText = "🌙 bilibili"
            var getTime = setInterval(() => {
                h = new Date().getHours()
                m = new Date().getMinutes()
                s = new Date().getSeconds()

                var dialog = document.querySelector("body > div.v-dialog > div.v-dialog__wrap > div > div.v-dialog__body > div > p")
                if (dialog){
                    document.querySelector('#msBoxMsg').innerText = "参数异常"
                    window.location.reload()
                }else{
                    document.querySelector('#msBoxMsg').innerText = getZero(h) + ":" + getZero(m) + ":" + getZero(s)
                }

                var bzBtn = document.querySelector(".tool-wrap > div")
                if (bzBtn.textContent == "已达发放上限") {
                    document.querySelector('#msBoxMsg').innerText = "已达发放上限！"
                    return
                }

                //bzBtn.textContent = "领取奖励"//!已达每日发放上限
                //bzBtn.attributes[0].value = "button exchange-button"//!
                //|| h == 23 && m >= 59 && s >= 50
                if (h == 2 && m >= 0 && s >= 3
                    || h == 0 && m < 10 && s >= 0
                    || h == 1 && m < 10 && s >= 0
                ) {
                    clearInterval(getTime)
                    if (bzBtn != null) {
                        console.log(bzBtn.textContent)
                        if (bzBtn.textContent == "领取奖励") {//!
                            console.log("🎁 活动已开启~ %d:%d:%d", h, m, s)
                            let t_refresh = new Date().getTime()
                            var refreshClick = setInterval(() => {
                                //console.log(new Date().getTime() - t_refresh)
                                if (new Date().getTime() - t_refresh >= 20000) {
                                    clearInterval(refreshClick)
                                    clearInterval(runClick)
                                    window.location.reload()
                                    return
                                }
                            }, 1000)
                            var runClick = setInterval(() => {
                                bzBtn.click()
                                i = i + 1
                                console.log("点击 " + i)
                                console.log(new Date().getTime() - t_refresh)
                                if (bzBtn.textContent == "查看奖励") {//!
                                    console.log("✅ 执行完毕！")
                                    clearInterval(refreshClick)
                                    clearInterval(runClick)
                                    return
                                }
                            }, 10)
                        } else if (bzBtn.textContent == "已达每日发放上限1" || bzBtn.textContent == "已达发放上限" || new Date().getMinutes() == 5) {
                            console.log("❌ 领取失败")
                            return
                        } else if (bzBtn.textContent == "查看奖励") {
                            console.log("✅ 执行完毕！")
                            return
                        } else {
                            window.location.reload()
                        }

                    } else {
                        window.location.reload()
                    }

                } else {
                    console.log("❗ 不合条件！%d:%d:%d", h, m, s)
                }
            }, delay_getTime)
        }, delay_refresh)
    }

    function hy2() {
        var h = -1
        var m = -1
        var s = -1
        var ms = -1
        var delay_refresh = 1000
        var delay_getTime = 500
        var delay_click = 100
        //var btn_day20 = null
        //console.log("⭐虎牙_领取奖励⭐")
        document.querySelector('#msBoxTitle').innerText = "🌙 虎牙：原神"
        function gcorrectionTime() {
            let curtime = new Date()
            h = curtime.getHours()
            m = curtime.getMinutes()
            s = curtime.getSeconds()
            //ms = curtime.getMilliseconds()
            //console.log("时间：%d:%d:%d:%d", h, m, s, ms)
            document.querySelector('#msBoxMsg').innerText = h + ":" + m + ":" + s
            //document.querySelector('#msBoxMsg').innerText = getZero(h) + ":" + getZero(m) + ":" + getZero(s) + "." + getZero2(ms)
            //return {hour:new Date().getHours(), minutes:new Date().getMinutes(), seconds:new Date().getSeconds()}
        }
        function getSelBtn() {
            let sel = document.querySelectorAll("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.ltw-cont > ul > li")
            if (sel.length != 7) {
                return null
            }
            for (let i = 1; i <= 7; i++) {
                //console.log(i)
                document.querySelector('#msBoxTitle').innerText = "🌙 huya >> i=" + i
                if (document.querySelectorAll("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.ltw-cont > ul > li:nth-child(" + i + ") > div.task-name")[0].innerText == "+10经验值") {
                    console.log("i=" + i)
                    return { index: i, btn: document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.ltw-cont > ul > li:nth-child(" + i + ") > button"), status: 123 }
                }
            }
            return null
        }
        function scrollToBtnSth(self) {
            window.scrollTo({ top: 2000, left: 300, behavior: "smooth" })
            //document.querySelector("#matchComponent8 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.awards-box.J_awardBox > div.awrad-list.J_listBox > div.slider-box > ul > li:nth-child(4) > p > button").scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
            if (self.index == 7) {
                document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.task-slider > div.btn.btn-right.J_nsRight").click()
            } else if (self.index == 1) {
                document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.task-slider > div.btn.btn-left.J_nsLeft").click()
            }
        }
        //auto click
        let loading = setInterval(() => { window.location.reload() }, 20000)
        window.onload = function () {
            clearInterval(loading)
            console.log("⭐虎牙_领取奖励⭐")
            //page 2
            document.querySelector('#matchComponent3 > div > div.tabs-img-handler.J_tab_handler > div > div:nth-child(2)').click()

            //main action
            setTimeout(() => {
                let ret = getSelBtn()

                //抢购Selector
                let YS = "#matchComponent11 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.awards-box.J_awardBox > div.awrad-list.J_listBox > div.slider-box > ul > li:nth-child(4) > p > button"

                if (ret == null || document.querySelector(YS) == null) {
                    console.log(document.querySelector(YS))
                    window.location.reload()
                }

                let scrollToBtn = setInterval(() => {
                    scrollToBtnSth(ret)
                }, 3000) //scrollToBtn

                let isTime = setInterval(() => {//||h == 23 && m >= 59 && s >= 59
                    gcorrectionTime()
                    if (h >= 230 && m >= 0 && s >= 0
                        || h == 2 && m >= 0 && s >= 3
                    ) {
                        clearInterval(scrollToBtn)
                        clearInterval(isTime)

                        // 抢购
                        let winds
                        let N
                        let runClick = setInterval(() => {
                            winds = document.querySelectorAll("#matchComponent11 > div")
                            console.log("窗口长度："+winds.length)

                            //更新数据
                            ret = getSelBtn()

                            if (winds.length == 1) {
                                if (ret.btn.textContent == "未完成") {
                                    console.log("刷新经验1")
                                    document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.refresh-prize > span").click()
                                } else if (ret.btn.textContent == "领取") {
                                    console.log("点击XP")
                                    document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.task-slider > div.btn.btn-right.J_nsRight").click()
                                    ret.btn.click()
                                } else if (ret.btn.textContent == "已领取") {
                                    if (document.querySelector(YS).textContent == "领奖") {
                                        clearInterval(runClick)
                                        console.log("开启抢购 ..")
                                        let seckill = setInterval(() => {
                                            if (document.querySelector(YS).textContent == "已领奖") {
                                                clearInterval(seckill)
                                                console.log("✅ 已领奖")
                                                return
                                            } else if (new Date().getSeconds() > 55 && new Date().getSeconds() <= 58) {
                                                clearInterval(seckill)
                                                console.log("❌ 领奖超时")
                                                return

                                            }
                                            winds = document.querySelectorAll("#matchComponent11 > div")
                                            if (winds.length == 1) {
                                                console.log("点击YS")
                                                document.querySelector(YS).click()
                                            } else {
                                                console.log("点击wind")
                                                for (let i = 1; i < winds.length - 1; i++) {
                                                    N = document.querySelectorAll("#matchComponent11 > div")[i].className //diy-com-pop diy-com-pop-0
                                                    N = N.replace(/\s*/g, "")
                                                    //N = N.substr(23, N.length - 1)
                                                    N = N.substring(23, N.length)
                                                    //console.log(N)
                                                    document.querySelector("#matchComponent11 > div.diy-com-pop.diy-com-pop-" + N + " > div.dcp-foot > button").click()
                                                }
                                            }
                                            //document.querySelector(YS).textContent = "已领奖"
                                        }, 500)

                                    } else if (document.querySelector(YS).textContent == "已领奖") {
                                        clearInterval(runClick)
                                        console.log("✅ 已领奖")
                                        return
                                    } else if (document.querySelector(YS).textContent == "未完成") {
                                        console.log("刷新YS 1")
                                        document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.refresh-prize > span").click()
                                    }
                                }
                            } else {
                                console.log("点击wind")
                                for (let i = 1; i < winds.length - 1; i++) {
                                    N = document.querySelectorAll("#matchComponent11 > div")[i].className //diy-com-pop diy-com-pop-0
                                    N = N.replace(/\s*/g, "")
                                    //N = N.substr(23, N.length - 1)
                                    N = N.substring(23, N.length)
                                    //console.log(N)
                                    document.querySelector("#matchComponent11 > div.diy-com-pop.diy-com-pop-" + N + " > div.dcp-foot > button").click()
                                }
                            }
                        }, 500) //runClick 250
                    }
                }, 100) //isTime
            }, 6000) //setTimeout
        }
    }

    function hy2_xqtd() {
        var zhanwei = 1
        var h = -1
        var m = -1
        var s = -1
        var ms = -1
        var delay_refresh = 1000
        var delay_getTime = 500
        var delay_click = 100
        //var btn_day20 = null
        //console.log("⭐虎牙_领取奖励⭐")
        document.querySelector('#msBoxTitle').innerText = "🌙 虎牙：星穹铁道"

        function gcorrectionTime() {
            let curtime = new Date()
            h = curtime.getHours()
            m = curtime.getMinutes()
            s = curtime.getSeconds()
            //ms = curtime.getMilliseconds()
            //console.log("时间：%d:%d:%d:%d", h, m, s, ms)
            document.querySelector('#msBoxMsg').innerText = h + ":" + m + ":" + s
            //document.querySelector('#msBoxMsg').innerText = getZero(h) + ":" + getZero(m) + ":" + getZero(s) + "." + getZero2(ms)
            //return {hour:new Date().getHours(), minutes:new Date().getMinutes(), seconds:new Date().getSeconds()}
        }
        function getSelBtn() {
            let sel = document.querySelectorAll("#matchComponent17 > div > div.J_contrainer > div.mod-tasks > div > div.ltw-cont > ul > li")
            if (sel.length != 7) {
                return null
            }
            for (let i = 1; i <= 7; i++) {
                //console.log(i)
                //document.querySelector('#msBoxTitle').innerText = "🌙 虎牙 >> 经验=" + i
                if (document.querySelectorAll("#matchComponent17 > div > div.J_contrainer > div.mod-tasks > div > div.ltw-cont > ul > li:nth-child(" + i + ") > div.task-name")[0].innerText == "+10经验值") {
                    //console.log("i=" + i)
                    return { index: i, btn: document.querySelector("#matchComponent17 > div > div.J_contrainer > div.mod-tasks > div > div.ltw-cont > ul > li:nth-child(" + i + ") > button"), status: 123 }
                }
            }
            return null
        }
        function scrollToBtnSth(self) {
            window.scrollTo({ top: 2000, left: 300, behavior: "smooth" })
            //document.querySelector("#matchComponent8 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.awards-box.J_awardBox > div.awrad-list.J_listBox > div.slider-box > ul > li:nth-child(4) > p > button").scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
            if (self.index == 7) {
                document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.task-slider > div.btn.btn-right.J_nsRight").click()
            } else if (self.index == 1) {
                document.querySelector("#matchComponent11 > div > div.J_contrainer > div.mod-tasks > div > div.task-slider > div.btn.btn-left.J_nsLeft").click()
            }
        }

        //ys click
        let loading = setInterval(() => { window.location.reload() }, 20000)
        window.onload = function () {
            var btn = document.createElement("button"); //创建一个input对象（提示框按钮）
            btn.id = "id000";
            btn.textContent = "里程碑";
            btn.style.width = "60px";
            btn.style.height = "20px";
            btn.style.align = "center";
            document.querySelector('#msBoxBtn').appendChild(btn);

            var btn1 = document.createElement("button"); //创建一个input对象（提示框按钮）
            btn1.id = "id001";
            btn1.textContent = "萌新";
            btn1.style.width = "60px";
            btn1.style.height = "20px";
            btn1.style.align = "center";
            document.querySelector('#msBoxBtn').appendChild(btn1);

            btn.onclick = function (){
                document.querySelector('#msBoxBtn').removeChild(btn)
                document.querySelector('#msBoxBtn').removeChild(btn1)
                //里程碑
                document.querySelector('#msBoxTitle').innerText = "🌙 虎牙：星穹铁道 - 里程碑"
                let page1 = setInterval(() => {
                    let p1 = document.querySelector('#matchComponent3 > div > div.tabs-img-handler.J_tab_handler > div > div:nth-child(2)')
                    if (p1 != null){
                        clearInterval(page1)
                        p1.click()
                        let page2 = setInterval(() => {
                            let p2 = document.querySelector('#matchComponent10 > diy > div > div:nth-child(2) > div')
                            if (p2 != null){
                                clearInterval(page2)
                                p2.click()
                                //抢购Selector
                                let YS = "#matchComponent17 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.awards-box.J_awardBox > div.awrad-list.J_listBox > div.slider-box > ul > li:nth-child(3) > p > button"
                                let into_ys = setInterval(() => {
                                    let ret = getSelBtn()
                                    if (ret != null && document.querySelector(YS) != null) {
                                        clearInterval(loading)
                                        clearInterval(into_ys)
                                        document.querySelector(YS).scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                                        document.querySelector('#msBoxMsg').innerText = "页面已加载，经验值="+ret.index
//                                         let close_winds = setInterval(() => {
//                                             let ws
//                                             let w
//                                             ws = document.querySelectorAll("#matchComponent19 > div")
//                                             if (ws.length != 1) {
//                                                 for (let i = 1; i < ws.length - 1; i++) {
//                                                     w = document.querySelectorAll("#matchComponent19 > div")[i].className //diy-com-pop diy-com-pop-0
//                                                     w = w.replace(/\s*/g, "")
//                                                     //N = N.substr(23, N.length - 1)
//                                                     w = w.substring(23, w.length)
//                                                     //console.log(N)
//                                                     document.querySelector("#matchComponent19 > div.diy-com-pop.diy-com-pop-" + w + " > div.dcp-foot > button").click()
//                                                 }
//                                             }
//                                         }, 100)
                                        //
                                        let isTime = setInterval(() => {//||h == 23 && m >= 59 && s >= 59
                                            gcorrectionTime()
                                            if ((h == 0 && m >= 0 && s >= 0) || (h == 2 && m >= 0 && s >=3 )) {
                                                clearInterval(isTime)
//                                                 if (h == 2) {
//                                                     YS = "#matchComponent17 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.awards-box.J_awardBox > div.awrad-list.J_listBox > div.slider-box > ul > li:nth-child(2) > p > button"
//                                                 }

                                                // 抢购
                                                let winds
                                                let N
                                                let click_count = 0
                                                let refresh_count = 0
                                                let runClick = setInterval(() => {
                                                    winds = document.querySelectorAll("#matchComponent17 > div")
                                                    console.log("窗口长度："+winds.length)
                                                    gcorrectionTime()
                                                    if (click_count >= 10) {
                                                        clearInterval(runClick)
                                                        return
                                                    }
                                                    if (refresh_count >= 360) {
                                                        clearInterval(runClick)
                                                        return
                                                    }

                                                    if (winds.length == 1) {
                                                        if (document.querySelector(YS).textContent == "领奖") {
                                                            document.querySelector(YS).click()
                                                            document.querySelector('#msBoxMsg').innerText = "点击领奖..."
                                                            click_count = click_count + 1
//                                                             if (h == 0 && m >= 0 && s >= 3 || h == 2) {
//                                                                 clearInterval(runClick)
//                                                                 return
//                                                             }
                                                        } else {
                                                            //更新数据
                                                            ret = getSelBtn()
                                                            if (ret.btn.textContent == "未完成") {
                                                                console.log("刷新经验")
                                                                document.querySelector('#msBoxMsg').innerText = "刷新经验..."
                                                                document.querySelector("#matchComponent17 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.refresh-prize > span").click()
                                                            } else if (ret.btn.textContent == "领取") {
                                                                console.log("点击XP")
                                                                document.querySelector('#msBoxMsg').innerText = "领取经验..."
                                                                document.querySelector("#matchComponent17 > div > div.J_contrainer > div.mod-tasks > div > div.task-slider > div.btn.btn-right.J_nsRight").click()
                                                                ret.btn.click()
                                                            } else if (ret.btn.textContent == "已领取") {
                                                                if (document.querySelector(YS).textContent == "领奖") {
                                                                    clearInterval(runClick)
                                                                    console.log("经验已领取！")
                                                                    document.querySelector('#msBoxMsg').innerText = "经验已领取！"
                                                                    let seckill = setInterval(() => {
                                                                        if (document.querySelector(YS).textContent == "已领奖") {
                                                                            clearInterval(seckill)
                                                                            document.querySelector('#msBoxMsg').innerText = "已领奖！"
                                                                            console.log("✅ 已领奖")
                                                                            return
                                                                        } else if (new Date().getHours() == 0 && new Date().getMinutes() >= 0 && new Date().getSeconds() >= 5) {
                                                                            clearInterval(seckill)
                                                                            console.log("❌ 领奖超时")
                                                                            document.querySelector('#msBoxMsg').innerText = "领奖超时XXX"
                                                                            return

                                                                        }
                                                                        winds = document.querySelectorAll("#matchComponent17 > div")
                                                                        if (winds.length == 1) {
                                                                            document.querySelector(YS).click()
                                                                            document.querySelector('#msBoxMsg').innerText = "点击领奖..."
                                                                            if (h == 0 && m >= 0 && s >= 3 || h == 2) {
                                                                                clearInterval(seckill)
                                                                                return
                                                                            }
                                                                        } else {
                                                                            console.log("点击wind")
                                                                            document.querySelector('#msBoxMsg').innerText = "点击窗口..."
                                                                            for (let i = 1; i < winds.length - 1; i++) {
                                                                                N = document.querySelectorAll("#matchComponent17 > div")[i].className //diy-com-pop diy-com-pop-0
                                                                                N = N.replace(/\s*/g, "")
                                                                                //N = N.substr(23, N.length - 1)
                                                                                N = N.substring(23, N.length)
                                                                                //console.log(N)
                                                                                document.querySelector("#matchComponent17 > div.diy-com-pop.diy-com-pop-" + N + " > div.dcp-foot > button").click()
                                                                            }
                                                                        }
                                                                        //document.querySelector(YS).textContent = "已领奖"
                                                                    }, 500)

                                                                    } else if (document.querySelector(YS).textContent == "已领奖") {
                                                                        clearInterval(runClick)
                                                                        console.log("✅ 已领奖")
                                                                        document.querySelector('#msBoxMsg').innerText = "已领奖！"
                                                                        return
                                                                    } else if (document.querySelector(YS).textContent == "未完成") {
                                                                        console.log("刷新YS 1")
                                                                        document.querySelector('#msBoxMsg').innerText = "刷新里程碑奖励..."
                                                                        document.querySelector("#matchComponent17 > div > div.J_contrainer > div.mod-level > div > div.exp-award > div.refresh-prize > span").click()
                                                                        refresh_count = refresh_count + 1
                                                                    }
                                                            }
                                                        }
                                                    } else {
                                                        console.log("点击wind")
                                                        document.querySelector('#msBoxMsg').innerText = "点击窗口..."
                                                        for (let i = 1; i < winds.length - 1; i++) {
                                                            N = document.querySelectorAll("#matchComponent17 > div")[i].className //diy-com-pop diy-com-pop-0
                                                            N = N.replace(/\s*/g, "")
                                                            //N = N.substr(23, N.length - 1)
                                                            N = N.substring(23, N.length)
                                                            //console.log(N)
                                                            document.querySelector("#matchComponent17 > div.diy-com-pop.diy-com-pop-" + N + " > div.dcp-foot > button").click()
                                                        }
                                                    }
                                                }, 500) //runClick 250




                                               }
                                        }, 1000) //isTime
                                        }
                                }, 1000)
                                }
                        }, 1000)
                        }
                }, 1000)
                zhanwei =1
            };

            btn1.onclick = function (){
                document.querySelector('#msBoxBtn').removeChild(btn)
                document.querySelector('#msBoxBtn').removeChild(btn1)
                //萌新
                document.querySelector('#msBoxTitle').innerText = "🌙 虎牙：星穹铁道 - 萌新"
                let page1 = setInterval(() => {
                    let p1 = document.querySelector('#matchComponent3 > div > div.tabs-img-handler.J_tab_handler > div > div:nth-child(2)')
                    if (p1 != null){
                        clearInterval(page1)
                        p1.click()
                        let page2 = setInterval(() => {
                            let p2 = document.querySelector('#matchComponent10 > diy > div > div:nth-child(3) > div')
                            if (p2 != null){
                                clearInterval(page2)
                                p2.click()
                                //抢购Selector
                                let ys = "#matchComponent23 > div > div > div.style__TaskMod-sc-1p74ut5-1.hFtARu > div.style__TaskBox-sc-1p74ut5-3.ctODSH.flex.items-center > div.swiper-box > div > div > div:nth-child(1) > div > div:nth-child(3)"
                                let refresh = "#matchComponent21 > div > div > div.style__TaskMod-sc-1p74ut5-1.ejtvtP > div.style__ToolsBar-sc-1p74ut5-4.eRqCiC.flex.flex-end > div.reload-item.flex.items-center > span"

                                let into_ys = setInterval(() => {
                                    if (document.querySelector(ys) != null) {
                                        clearInterval(loading)
                                        clearInterval(into_ys)
                                        document.querySelector(ys).scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                                        document.querySelector('#msBoxMsg').innerText = "页面已加载"
                                        let close_winds = setInterval(() => {
                                            let w
                                            w = document.querySelector("#matchComponent23 > div > div > div:nth-child(2) > div > div > div.diy-popup--option > div")
                                            w.click()
                                        }, 100)
                                        // 抢购
                                        let isTime = setInterval(() => {
                                            gcorrectionTime()
                                            if (h == 0) {
                                                document.querySelector(refresh).click()
                                            }
                                            if (h == 0 && m < 5 && s >=3
                                                || h == 1 && m < 5
                                               ) {
                                                clearInterval(isTime)
                                                let index = 1
                                                let run_click = setInterval(() => {
                                                    if (index > 4) {
                                                        index = 1
                                                    }
                                                    document.querySelector('#msBoxMsg').innerText = "通票 - "+document.querySelector(ys).textContent
                                                    if (document.querySelector(ys).textContent == "领取") {
                                                        document.querySelector('#msBoxMsg').innerText = "通票 - 已领取"
                                                        document.querySelector(ys).click()
                                                        clearInterval(run_click)
                                                    } else {
                                                        document.querySelector("#matchComponent23 > div > div > div.style__TaskMod-sc-1p74ut5-1.hFtARu > div.style__ToolsBar-sc-1p74ut5-4.uRNRW.flex.flex-end > div.reload-item.flex.items-center > span").click()
                                                    }

//                                                     if (index == 1) {
//                                                         document.querySelector('#msBoxMsg').innerText = "萌新180 - "+document.querySelector(ys180).textContent
//                                                         if (document.querySelector(ys180).textContent == "领取") {
//                                                             document.querySelector('#msBoxMsg').innerText = "萌新180 - 领取"
//                                                             document.querySelector(ys180).click()
//                                                         }
//                                                     } else if (index == 2) {
//                                                         document.querySelector('#msBoxMsg').innerText = "萌新120 - "+document.querySelector(ys120).textContent
//                                                         if (document.querySelector(ys120).textContent == "领取") {
//                                                             document.querySelector('#msBoxMsg').innerText = "萌新120 - 领取"
//                                                             document.querySelector(ys120).click()
//                                                         }
//                                                     } else if (index == 3) {
//                                                         document.querySelector('#msBoxMsg').innerText = "萌新 80 - "+document.querySelector(ys80).textContent
//                                                         if (document.querySelector(ys80).textContent == "领取") {
//                                                             document.querySelector('#msBoxMsg').innerText = "萌新80 - 领取"
//                                                             document.querySelector(ys80).click()
//                                                         }
//                                                     } else if (index == 4) {
//                                                         document.querySelector('#msBoxMsg').innerText = "萌新 50 - "+document.querySelector(ys50).textContent
//                                                         if (document.querySelector(ys50).textContent == "领取") {
//                                                             document.querySelector('#msBoxMsg').innerText = "萌新50 - 领取"
//                                                             document.querySelector(ys50).click()
//                                                         }
//                                                     }
                                                    index = index + 1
                                                }, 1500)

//                                                 let end_click = setInterval(() => {
//                                                     document.querySelector("#matchComponent23 > div > div > div.style__TaskMod-sc-1p74ut5-1.hFtARu > div.style__ToolsBar-sc-1p74ut5-4.uRNRW.flex.flex-end > div.reload-item.flex.items-center > span").click()
//                                                     if (h == 0 && m >= 5
//                                                         || h == 1 && m >= 5
//                                                        ) {
//                                                         document.querySelector('#msBoxMsg').innerText = "终止运行"
//                                                         clearInterval(run_click)
//                                                         clearInterval(end_click)
//                                                     }

//                                                 }, 3000)




                                                }
                                        }, 1000) //isTime

                                        }
                                }, 1000)
                                }
                        }, 1000)
                        }
                }, 1000)
                zhanwei =1
            };

        }
    }

    function dy3() {
        var h = -1
        var m = -1
        var s = -1
        var ms = -1
        var delay_refresh = 1000
        var delay_getTime = 500
        var delay_click = 100
        var i = 0
        //var btn_day20 = null
        document.querySelector('#msBoxTitle').innerText = "🌙 douyu"
        function gcorrectionTime() {
            let curtime = new Date()
            h = curtime.getHours()
            m = curtime.getMinutes()
            s = curtime.getSeconds()
            //ms = curtime.getMilliseconds()
            //console.log("时间：%d:%d:%d:%d", h, m, s, ms)
            document.querySelector('#msBoxMsg').innerText = h + ":" + m + ":" + s
            //document.querySelector('#msBoxMsg').innerText = getZero(h) + ":" + getZero(m) + ":" + getZero(s) + "." + getZero2(ms)
            //return {hour:new Date().getHours(), minutes:new Date().getMinutes(), seconds:new Date().getSeconds()}
        }

        function speedIntervalClick(btn) {
            let clickN = 0
            let nd
            let temp = setInterval(() => {
                btn.click()
                clickN = clickN + 1
                //console.log(clickN)
                nd = new Date()
                if (nd.getHours() >= 18 && nd.getSeconds() >= 1 && nd.getSeconds() <= 55) { //6~55
                    clearInterval(temp)
                    console.log("执行完毕！")
                    document.querySelector('#msBoxTitle').innerText = "🌙 douyu >> 次数：" + clickN
                    return
                }
            }, 500) //10
        }

        //auto pause
        let autoPause = setInterval(() => {
            let btn_pause = document.querySelector("#__h5player > div:nth-child(11) > div > div > div.left-d3671e > div.pause-c594e8")
            if (btn_pause != null) {
                btn_pause.click()
                clearInterval(autoPause)
            }
        }, 1000)
        //moveto
        let autoScroll = setInterval(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }, 6000)

        let intoBtn = setInterval(() => {
            let btn_into = document.querySelector("#bc57")
            if (btn_into != null) {
                clearInterval(autoScroll)
                clearInterval(intoBtn)
                btn_into.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                btn_into.click()
                //#bc370
                let intoBtn2 = setInterval(() => {
                    let btn_into2 = document.querySelector("#bc92")
                    if (btn_into2 != null) {
                        clearInterval(intoBtn2)
                        btn_into2.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                        btn_into2.click()
                    }
                }, 1000)
            }
        }, 1000)

        //auto click
        let setXY = setInterval(() => {
            let btn_day20 = document.querySelector("#bc515 > div > button")
            let btn_mengxing = document.querySelector("#bc464 > div > button")
            if (btn_day20 != null) {
                //document.querySelector("#bc1123 > div > span:nth-child(2)").innerHTML = 'hello world!' //test
                clearInterval(setXY)
                setTimeout(() => {
                    btn_day20.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                }, 3000)
                //if current time
                let isTime = setInterval(() => {
                    gcorrectionTime()
                    if (h >= 230 && m >= 0 && s >= 0 ||
                        h == 17 && m >= 59 && s >= 58 ||
                        h == 18 && m >= 0 && s >= 0
                    ) {
                        clearInterval(isTime)
                        speedIntervalClick(btn_day20)
                        speedIntervalClick(btn_mengxing)
                    }
                }, 10) //isTime
            }
        }, 1000)
    }

    function hy2_room() {
        var h = -1
        var m = -1
        var s = -1
        function gcorrectionTime() {
            let curtime = new Date()
            h = curtime.getHours()
            m = curtime.getMinutes()
            s = curtime.getSeconds()
            //ms = curtime.getMilliseconds()
            //console.log("时间：%d:%d:%d:%d", h, m, s, ms)
            document.querySelector('#msBoxMsg').innerText = h + ":" + m + ":" + s
            //document.querySelector('#msBoxMsg').innerText = getZero(h) + ":" + getZero(m) + ":" + getZero(s) + "." + getZero2(ms)
            //return {hour:new Date().getHours(), minutes:new Date().getMinutes(), seconds:new Date().getSeconds()}
        }

        let send = document.querySelector("#msg_send_bt")
        //moveto
        setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }, 6000)

        let autoScroll = setInterval(() => {
            if (send != null) {
                send.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                clearInterval(autoScroll)

                var btn = document.createElement("button"); //创建一个input对象（提示框按钮）
                btn.id = "id000";
                btn.textContent = "0点发2条";
                btn.style.width = "60px";
                btn.style.height = "20px";
                btn.style.align = "center";
                document.querySelector('#msBoxBtn').appendChild(btn);

                var btn1 = document.createElement("button"); //创建一个input对象（提示框按钮）
                btn1.id = "id001";
                btn1.textContent = "0点发6条";
                btn1.style.width = "60px";
                btn1.style.height = "20px";
                btn1.style.align = "center";
                document.querySelector('#msBoxBtn').appendChild(btn1);

                btn.onclick = function (){
                    //document.querySelector('#msBoxBtn').removeChild(btn)
                    //document.querySelector('#msBoxBtn').removeChild(btn1)
                    //弹幕
                    document.querySelector('#msBoxTitle').innerText = "🌙 虎牙：整点发送1条弹幕"
                    let isTime = setInterval(() => {
                        gcorrectionTime()
                        if (h == 0 && s >= 3) {
                            clearInterval(isTime)
                            let num = 1
                            let send_danmu = setInterval(() => {
                                var input = document.querySelector('#player-full-input-txt')
                                input.value = num
                                var btn = document.querySelector('#player-full-input-btn')
                                btn.click()
                                num = num + 1
                                if (num > 1) {
                                    document.querySelector('#msBoxMsg').innerText = "弹幕发送完毕"
                                    clearInterval(send_danmu)
                                }
                            }, 1000)
                        }
                    }, 1000) //istime
                    //

                };

                btn1.onclick = function (){
                    //document.querySelector('#msBoxBtn').removeChild(btn)
                    //document.querySelector('#msBoxBtn').removeChild(btn1)
                    //弹幕
                    document.querySelector('#msBoxTitle').innerText = "🌙 虎牙：整点发送5条弹幕"
                    let isTime = setInterval(() => {
                        gcorrectionTime()
                        if (h == 0 && s >= 2) {
                            clearInterval(isTime)
                            let num = 1
                            let send_danmu = setInterval(() => {
                                var input = document.querySelector('#player-full-input-txt')
                                input.value = num
                                var btn = document.querySelector('#player-full-input-btn')
                                btn.click()
                                num = num + 1
                                if (num > 6) {
                                    document.querySelector('#msBoxMsg').innerText = "弹幕发送完毕"
                                    clearInterval(send_danmu)
                                }
                            }, 1000)
                        }
                    }, 1000) //istime

                };
            }
        }, 1000)

        //auto pause
        let autoPause = setInterval(() => {
            let btn_pause = document.querySelector("#player-btn")
            if (btn_pause.title == '开始观看') {
                clearInterval(autoPause)
                document.querySelector('#msBoxMsg').innerText = '已暂停'
                setTimeout(() => {
                    send.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                }, 3000)
                setTimeout(() => {
                    send.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                }, 6000)
            } else if (btn_pause != null) {
                btn_pause.click()
            }
        }, 6000)

    }

/*     setInterval(function () {
        const myDate = new Date();
        const currentDate = myDate.getMinutes() + '分' + myDate.getSeconds() + '秒' + myDate.getMilliseconds() + '豪秒';
        // 每次循环打印当前时间
        console.log(currentDate);
    }, 500);

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            console.log('页面不可见');
        }
    }) */

    initBox()
    let hostName = window.location.href.split(".")[1]
    //console.log(hostName) //zt.huya.com bilibili
    if (hostName == "bilibili") {
        bz1()
    } else if (hostName == "huya") {
        let hm = window.location.href.split(".")[0]
        if (hm == "https://zt") {
            //hy2()
            if (window.location.href == "https://zt.huya.com/d6e8655c/pc/index.html") {
                hy2_xqtd()
            } else {
                hy2()
            }
        } else {
            document.querySelector('#msBoxTitle').innerText = "🌙 虎牙：房间内"
            hy2_room()
        }
    } else if (hostName == "douyu") {
        //dy3()
        console.log("")
    }

})()