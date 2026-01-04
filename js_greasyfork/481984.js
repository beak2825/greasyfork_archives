
// ==UserScript==
// @name         liepin-tools
// @namespace    http://brenda.top/
// @version      1.2
// @description  猎聘 自动打招呼
// @author       Austin Young
// @match        https://*.liepin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481984/liepin-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/481984/liepin-tools.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var retryCheck = function (
        checkFun,
        interval,
        nextFun,
        times,
        delay,
        startTime
    ) {
        if (!times) times = 1;
        else times += 1;
        if (!delay) delay = 0;
        if (!startTime) startTime = new Date().getTime();
        setTimeout(function () {
            if (checkFun(times)) {
                if (delay) {
                    var detal = delay - (new Date().getTime() - startTime);
                    if (detal > 0) setTimeout(nextFun, detal);
                    else nextFun();
                } else nextFun();
            } else retryCheck(checkFun, interval, nextFun, times, delay, startTime);
        }, interval);
    };
    var setFilterHandle = function (e, isHandle = false) {
        let s1 = document.querySelector("#Fileters").innerText
        let s = prompt("输入过滤词", s1)
        document.querySelector("#Fileters").innerText = s.trim()
    }
    // 检查标题和设置是否一致，输入为标题
    var checkTitle = function (text) {
        // "高级投资经理\n【\n北京\n】\n急聘\n15-40k\n3-5年\n统招本科\n北京泽中京联实业发展有限公司\n基金/证券/期货1-49人\n王女士\n行政人事主管\n广告"
        let title = text.split('\n')[0]
        let matchText = document.querySelector("#Fileters").innerText
        let arr = matchText.split(/\s+/g)
        return arr.some(x => {
            return title.indexOf(x) > -1
        })
    }
    let interHandle = null
    let toolChecking = false
    var closeHandle = (flag) => {
        let el = document.querySelector(".tools-btn");
        let lst = document.querySelectorAll('div.job-list-box>div')
        let ct = +window.localStorage.getItem('job-ct') || 1;
        let msg = flag==1?"完成，重新开始":"继续(" + ct + "/" + lst.length + ")"
        el.innerText = msg;
        el.style.background = "#67C23A";
        toolChecking =  false
        clearInterval(interHandle)
        interHandle = null
    }
    var bossHandle = function (e) {
        let matchText = document.querySelector("#Fileters").innerText
        if(matchText == '')
        {
            alert('输入过滤词！')
            return 
        }
        let el = document.querySelector(".tools-btn");
        console.log('checking', toolChecking)
        toolChecking = !toolChecking;
        const myEvent = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        const myEvent2 = new MouseEvent('mouseleave', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        let openHandle = () => {
            el.style.background = "#E6A23C";
            toolChecking = true
            function callFn() {
                let lst = document.querySelectorAll('div.job-list-box>div')
                let ct = +window.localStorage.getItem('job-ct') || 1;
                let len = lst.length;
                if (len) {
                    let item = lst[ct - 1]
                    let text = item.innerText;
                    if (checkTitle(text)) {
                        let item2 = item.querySelector("div")
                        item2.dispatchEvent(myEvent);  // 模拟鼠标移入
                        let sel = item.querySelector(".chat-btn-box button");
                        if (sel.innerText == '聊一聊') {
                            sel.click();
                            // console.log('click')
                        }
                        item2.dispatchEvent(myEvent2);  // 模拟鼠标移出
                        item2.style.backgroundColor= 'powderblue';
                    }
                    // 循环结束
                    el.innerText = "停止(" + ct + "/" + len + ")";
                    ct++;
                    window.localStorage.setItem('job-ct', ct);
                    if (ct > len) {
                        ct = 1;
                        window.localStorage.setItem('job-ct', ct);
                        let next = document.querySelector(".ant-pagination-next button")
                        if(next){
                            if(next.disabled){
                                closeHandle(1); // 结束了
                            }else{
                                next.click()  // 下一页
                            }
                        }
                    }
                } else {
                    console.log('列表为空');
                }
            }
            if (interHandle != null) {
                clearInterval(interHandle)
                interHandle = null
            }
            interHandle = setInterval(() => {
                callFn();
            }, 100);
        }
        if ((toolChecking)) {
            openHandle();
        } else {
            closeHandle();
        }
    };
    function resetHandle(){
        window.localStorage.setItem('job-ct', 1);
        closeHandle()
    }
    ((_) => {
        console.log('jobs tools start ============================================');
        let divEl = document.createElement("div");
        divEl.setAttribute(
            "style",
            "width:400px;height:35px;border:0;color:#fff;background-color:#8611AA;outline: none;position: fixed; top: 100px; left: 0;z-index:99999; padding:5px;"
        );
        divEl.innerHTML = '<button id="setFilter" style="color:#fff;background-color:#67C23A;">过滤词:</button><span style="min-width:120px;border:1px;display:inline-block;color:orange" id="Fileters"></span>' +
            '<button style="color:#fff;background-color:#67C23A;" class="tools-btn">打招呼</button> <button style="color:#fff;background-color:#67C23A;" class="toolreset-btn">复位</button>'
        if (
            window.location.href.startsWith(
                "https://www.liepin.com/"
            )
        ) {
            retryCheck(
                (_) => {
                    let lst = document.querySelectorAll("div.job-list-box");
                    return lst && lst.length > 0;
                },
                100,
                (_) => {
                    document.querySelector("body").appendChild(divEl);

                    let el = document.querySelector(".tools-btn");
                    let toolreset = document.querySelector(".toolreset-btn");
                    let filter = document.querySelector("#setFilter");
                    ((_) => {
                        // bossHandle(_, true);
                    })()
                    el.addEventListener(
                        "click",
                        bossHandle,
                        false
                    );
                    filter.addEventListener(
                        "click",
                        setFilterHandle,
                        false
                    );
                    toolreset.addEventListener(
                        "click",
                        resetHandle,
                        false
                    );
                }
            );
        }
    })()
    if (
            window.location.href.startsWith(
                "https://c.liepin.com/?time="
            )
        ) {
            window.location.href = "https://c.liepin.com/resume/getdefaultresume"
        }
    
})();