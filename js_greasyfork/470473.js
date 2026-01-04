
// ==UserScript==
// @name         nf招聘助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1.推荐牛人，批量打招呼;支持BOSS、智联、前程
// @author       You
// @match        https://www.zhipin.com/vue/index/*
// @match        https://rd6.zhaopin.com/*
// @match        https://ehire.51job.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470473/nf%E6%8B%9B%E8%81%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/470473/nf%E6%8B%9B%E8%81%98%E5%8A%A9%E6%89%8B.meta.js
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
    window.addEventListener(
        "load",
        (_) => {
            let el = document.createElement("button");
            el.setAttribute(
                "style",
                "width:140px;height:30px;border:0;color:#fff;background-color:#67C23A;cursor:pointer;outline: none;"
            );
            el.innerText = "自动打招呼";
            if (window.location.host === "www.zhipin.com") {
                if (
                    window.location.href.startsWith(
                        "https://www.zhipin.com/vue/index/#/dashboard/candidate/recommend"
                    )
                ) {
                    retryCheck(
                        (_) => {
                            let lst = document.querySelectorAll("#recommend-list li");
                            return lst && lst.length > 0;
                        },
                        500,
                        (_) => {
                            let checking = null;
                            let timmer = null;
                            document.querySelector(".op-filter").appendChild(el);
                            el.addEventListener(
                                "click",
                                function (e) {
                                    if (checking) {
                                        if (timmer) {
                                            window.clearTimeout(timmer);
                                        }
                                        window.clearInterval(checking);
                                        el.innerText = "自动打招呼";
                                        el.style.background = "#67C23A";
                                        checking = null;
                                    } else {
                                        let lst = document.querySelector("#recommend-list li");
                                        let ct = 1;
                                        let hct = 0;
                                        function callFn() {
                                            if (lst) {
                                                lst.scrollIntoView(true);
                                                let sel = lst.querySelector("button.btn-greet");
                                                if (sel && sel.innerText.includes("打招呼")) {
                                                    sel.click();
                                                    setTimeout(function () {
                                                        if (
                                                            document.querySelector(".dialog-chat-greeting")
                                                        ) {
                                                            $(".dialog-chat-greeting").remove();
                                                        }
                                                    }, 100);
                                                    lst.style.border = "1px solid #67C23A";
                                                    hct++;
                                                } else {
                                                    lst.style.border = "1px solid #F56C6C";
                                                }
                                                lst = lst.nextSibling;
                                                ct++;
                                                el.style.background = "#E6A23C";
                                                el.innerText = "停止打招呼(" + hct + "/" + ct + ")";
                                            } else {
                                                if (document.querySelector(".dialog-chat-greeting")) {
                                                    $(".dialog-chat-greeting").remove();
                                                }
                                                window.clearInterval(checking);
                                                el.style.background = "#67C23A";
                                                el.innerText = "自动打招呼(" + hct + "/" + ct + ")";
                                                checking = null;
                                            }
                                        }
                                        callFn();
                                        checking = window.setInterval((_) => {
                                            if (document.querySelector(".dialog-chat-greeting")) {
                                                $(".dialog-chat-greeting").remove();
                                            }
                                            timmer = window.setTimeout((_) => {
                                                callFn();
                                            }, Math.ceil(Math.random() * 4000));
                                        }, 2000);
                                    }
                                },
                                false
                            );
                        }
                    );
                }
            } else if (window.location.host === "rd6.zhaopin.com") {
    const el = document.createElement('button');
    el.innerText = "自动打招呼";
    el.style.background = "#67C23A";
    document.querySelector(".talent-fresh-tabs__group").appendChild(el);
    let checking = null;
    let timer = null;
    let count = 0;
    let helloCount = 0;
    let isGreeting = false;
    const updateButton = () => {
        el.innerText = checking ? `停止打招呼 (${helloCount})` : `自动打招呼 (${helloCount})`;
        el.style.background = checking ? "#E6A23C" : "#67C23A";
    }
    const sayHello = async () => {
        if (isGreeting) return;
        const list = document.querySelector(".resume-button")
        if (!list) {
            clearInterval(checking);
            clearTimeout(timer);
            checking = null;
            updateButton();
            return;
        }
        isGreeting = true;
        list.scrollIntoView(true);
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待1秒
        const buttons = document.querySelectorAll(".resume-button button");
        for (let button of buttons) {
            if (button.innerText.includes("打招呼")) {
                button.click();
                list.style.border = "1px solid #67C23A";
                helloCount++;
            } else {
                list.style.border = "1px solid #F56C6C";
            }
            count++;
            updateButton();
            await new Promise(resolve => setTimeout(resolve, 100)); // 等待1秒
        }
        isGreeting = false;
    }
    el.addEventListener("click", function () {
        if (checking) {
            clearInterval(checking);
            clearTimeout(timer);
            checking = null;
            updateButton();
        } else {
            sayHello();
            checking = setInterval(sayHello, 200);
        }
    }, false);
} else if (window.location.host === "ehire.51job.com") {
                let cTimmer = null;
                function clearDialog() {
                    if (document.querySelector("#tip_msgbox2")) {
                        document.querySelector("#tip_msgbox2").style.display = "none";
                    }
                    if (document.querySelector("#DivBoxMaskTwo")) {
                        document.querySelector("#DivBoxMaskTwo").style.display = "none";
                    }
                    if (document.querySelector("#application")) {
                        document.querySelector("#application").style.display = "none";
                    }
                    if (document.querySelector("#chat_select_job")) {
                        document.querySelector("#chat_select_job").style.display = "none";
                    }
                    if (document.querySelector("#DivBoxMask")) {
                        document.querySelector("#DivBoxMask").style.display = "none";
                    }
                }
                setTimeout(() => {
                    el.className = "fr";
                    el.style.marginRight = "20px";
                    el.style.position = "fixed";
                    el.style.top = "100px";
                    el.style.right = "100px";
                    el.style.zIndex = "99999";
                    document.querySelector("body").appendChild(el);
                    let timmer = null;
                    let checking = null;
                    let pgL = document.querySelector(".position-page-numble").children;
                    let total = parseInt(pgL[pgL.length-2].innerHTML);
                    let nextBtn = document.getElementById("pagerBottomNew_nextButton");
                    let curPage = parseInt(document.querySelector(".position-page-numble").querySelector('a.active').innerHTML);

                    if (parseInt(sessionStorage.getItem("call_status")) !== 0) {
                        if (cTimmer) {
                            window.clearTimeout(cTimmer)
                        }
                    } else {
                        if (curPage >= total) {
                            window.clearInterval(checking);
                            window.clearTimeout(timmer);
                            window.clearTimeout(cTimmer);
                            el.style.background = "#67C23A";
                            el.innerText = "自动打招呼";
                            sessionStorage.setItem("call_status", 0);
                        }else{
                            cTimmer = setTimeout(() => {
                                renderCall();
                                el.innerText = "停止打招呼";
                                el.style.background = "#E6A23C";
                            }, 3000)
                        }
                    }
                    function renderCall() {
                        clearDialog();
                        let cLi = 0;
                        let cNum = document.querySelector("#search_resume_list ul").children.length;
                        let lst = document.querySelector("#search_resume_list li");
                        function call51Fn() {
                            if (cLi >= cNum) {
                                window.clearInterval(checking);
                                window.clearTimeout(timmer);
                                nextBtn.click();
                                return;
                            }
                            if (lst) {
                                lst.scrollIntoView(true);
                                let sel = lst.querySelector(".free-hichat");
                                if (sel && sel.innerText.includes("立即Hi聊")) {
                                    sel.click();
                                    let sendBtn = document.querySelector("#chat_select_job").querySelector(".ccd_footer div");
                                    sendBtn.click();
                                    lst.style.border = "1px solid #67C23A";
                                } else {
                                    lst.style.border = "1px solid #F56C6C";
                                }
                                cLi++;
                                lst = lst.nextSibling;
                                el.style.background = "#E6A23C";
                                el.innerText = "停止打招呼";
                            } else {
                                window.clearInterval(checking);
                                el.style.background = "#67C23A";
                                el.innerText = "自动打招呼";
                                checking = null;
                            }
                        }
                        call51Fn();
                        checking = window.setInterval((_) => {
                            timmer = window.setTimeout((_) => {
                                call51Fn();
                                clearDialog();
                            }, 1000 + Math.ceil(Math.random() * 4000));
                        }, 2000);

                    };
                    el.addEventListener(
                        "click",
                        function (e) {
                            if (e) {
                                e.preventDefault();
                            }
                            clearDialog();
                            let status = parseInt(sessionStorage.getItem("call_status"));
                            if (status) {
                                sessionStorage.setItem("call_status", 0);
                            } else {
                                sessionStorage.setItem("call_status", 1);
                            }
                            if (this.innerHTML == '停止打招呼') {
                                if (timmer) {
                                    window.clearTimeout(timmer);
                                }
                                if (cTimmer) {
                                    window.clearTimeout(cTimmer)
                                }
                                window.clearInterval(checking);
                                el.innerText = "自动打招呼";
                                el.style.background = "#67C23A";
                                checking = null;
                            } else {
                                renderCall();
                            }
                        },
                        false
                    );
                }, 3000)
            }
        },
        false
    );
})();