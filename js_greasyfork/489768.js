// ==UserScript==
// @name         微博自动批量转发
// @version      0.7
// @description  20230224
// @author       WeiXin:215178231
// @match        https://weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @require      https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1035358
// @downloadURL https://update.greasyfork.org/scripts/489768/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E8%BD%AC%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/489768/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E8%BD%AC%E5%8F%91.meta.js
// ==/UserScript==

(() => {
    function t(t) {
        return new Promise(e => setTimeout(e, t))
    }
    function e(t, e, i = 50) {
        let n = document.createElement("button");
        if (n.innerHTML = t, n.setAttribute("floatButton", ""), 50 == i) {
            let t = document.querySelectorAll("button[floatButton]");
            i = (t = t[t.length - 1]) ? t.getBoundingClientRect().top + 40 : i
        }
        return n.setAttribute("style", "z-index:9999999;position:fixed;top:" + i + "px;right:5px;height:30px;min-width:40px;font-size:16px;padding:0 10px;border: 0;border-radius: .25em;background: initial;background-color: #3085d6;color: #fff;"),
        e && n.addEventListener("click", t => e(t)),
        document.body.appendChild(n),
        n
    }
    function i(...t) {
        let e = document.getElementById("toastDiv");
        e || ((e = document.createElement("div")).setAttribute("id", "toastDiv"), e.style.cssText = "max-width:95%;min-width: 100px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;bottom: 5px;right: 5px;z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;", document.body.appendChild(e)),
        0 === t.length ? document.body.removeChild(e) : e.innerHTML = (new Date).toLocaleTimeString() + " " + t.join(" ")
    }
    !async function () {
        let n = GM_getValue("interval", 10);
        GM_registerMenuCommand("设置操作间隔(单位秒)", t => {
            let e = prompt("请输入操作间隔秒数", n);
            e && (GM_setValue("interval", n = 1 * e), alert(`成功设置间隔为：${e}秒`))
        });
        let o = GM_getValue("content", "");
        async function a(e) {
            if (0 === window.stopFlag)
                return void function (t, e = 2e3) {
                    var i = document.createElement("div");
                    i.innerHTML = t,
                    i.style.cssText = "max-width:80%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;",
                    document.body.appendChild(i),
                    setTimeout(() => {
                        i.style.webkitTransition = "-webkit-transform 0.5s ease-in, opacity 0.5s ease-in",
                        i.style.opacity = "0",
                        setTimeout(() => {
                            document.body.removeChild(i)
                        }, 500)
                    }, e)
                }
            ("正在运行任务，请勿重复点击");
            let a = prompt(`请输入要${e}的次数`, localStorage.forwardTimes || 10);
            if (!a)
                return;
            localStorage.forwardTimes = a,
            a *= 1,
            window.stopFlag = 0,
            window.originText = "转发" == e && ($("textarea").val() || window.originText) || "";
            let r = 1,
            d = 0;
            for (; !window.stopFlag; ) {
                if ($(`button:contains(${e})`).length || ($(`footer:contains(${e}) i[title="${e}"]`).click(), await t(500)), $("textarea").setValue(o + r + window.originText), await t(200), $(`button:contains(${e})`).click(), r >= a) {
                    i(`${e}次数已达${a}次，已停止`);
                    break
                }
                for (let n = 0; n < 10; n++) {
                    await t(1e3);
                    let n = $("div.woo-toast-body>span");
                    if (n.length) {
                        if ("操作频繁，请您稍后再试" == n.text()) {
                            if (++d > 1)
                                return window.stopFlag = 1, void i(`已${e}${d}次，连续2次提示操作频繁，已停止`)
                        } else
                            d = 0;
                        break
                    }
                }
                r++,
                await t(1e3 * n)
            }
            window.stopFlag = 1
        }
        GM_registerMenuCommand("设置文本", t => {
            let e = prompt("请输入文本", o);
            e && (GM_setValue("content", o = e), alert("成功设置文本为：" + e))
        }),
        e("停 止", t => {
            window.stopFlag = 1
        }),
        e("转 发", t => a("转发"))
    }
    (),
    $.fn.setValue = function (t) {
        return this.length && this.each((e, i) => {
            i.value = t,
            i.dispatchEvent(new Event("input", {
                    bubbles: !0
                }))
        }),
        this
    }
})();
