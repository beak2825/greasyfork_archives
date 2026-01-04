// ==UserScript==
// @name         CSDN复制破解
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  破解CSDN复制限制(登录后复制)
// @author       You
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434921/CSDN%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/434921/CSDN%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function mdCopy(e) {
        var t = e.target || e.srcElement,
            o = document.documentElement.scrollTop;
        if (t.className.indexOf("hljs-button") > -1) {
            e.preventDefault();
            var n = document.getElementById("hljs-copy-el");
            n ||
                ((n = document.createElement("textarea")),
                (n.style.position = "absolute"),
                (n.style.left = "-9999px"),
                (n.style.top = o + "px"),
                (n.id = "hljs-copy-el"),
                document.body.appendChild(n)),
                (n.textContent = e.currentTarget.innerText.replace(
                    /[\u00A0]/gi,
                    " "
                )),
                textElement("#hljs-copy-el");
            try {
                var r = document.execCommand("copy");
                n.remove(),
                    (t.dataset.title = r ? "复制成功" : "复制失败"),
                    r &&
                        setTimeout(function () {
                            t.dataset.title = "复制";
                        }, 1e3);
            } catch (i) {
                t.dataset.title = "复制失败";
            }
        }
    }
    function hlCopy(e) {
        var t = e.target || e.srcElement,
            o = document.documentElement.scrollTop;
        if (t.className.indexOf("hljs-button") > -1) {
            e.preventDefault();
            var n = document.getElementById("hljs-copy-el");
            n ||
                ((n = document.createElement("textarea")),
                (n.style.position = "absolute"),
                (n.style.left = "-9999px"),
                (n.style.top = o + "px"),
                (n.id = "hljs-copy-el"),
                document.body.appendChild(n)),
                (n.textContent = e.currentTarget.parentNode.innerText.replace(
                    /[\u00A0]/gi,
                    " "
                )),
                textElement("#hljs-copy-el");
            try {
                var r = document.execCommand("copy");
                n.remove(),
                    (t.dataset.title = r ? "复制成功" : "复制失败"),
                    r &&
                        setTimeout(function () {
                            t.dataset.title = "复制";
                        }, 1e3);
            } catch (i) {
                t.dataset.title = "复制失败";
            }
        }
    }

    function textElement(e) {
        if (
            ((e = "string" == typeof e ? document.querySelector(e) : e),
            navigator.userAgent.match(/ipad|ipod|iphone/i))
        ) {
            var t = e.contentEditable,
                o = e.readOnly;
            (e.contentEditable = !0), (e.readOnly = !0);
            var n = document.createRange();
            n.selectNodeContents(e);
            var r = window.getSelection();
            r.removeAllRanges(),
                r.addRange(n),
                e.setSelectionRange(0, 999999),
                (e.contentEditable = t),
                (e.readOnly = o);
        } else e.select();
    }
        $("code").each((idx) => {
        var code = $("code")[idx];
        code.style.userSelect = "text";
        var button;
        if (window.mdcp) {
            button = code.querySelector(".hljs-button");
            code.setAttribute("onclick", "copyCrack.mdCopy(event)");
        } else {
            button = $(code).siblings(".hljs-button").get(0);
            button.setAttribute("onclick", "copyCrack.hlCopy(event)");
        }
        button.dataset.title = "免登录复制by企鹅队长";
    });

    window.addEventListener(
        "copy",
        function (event) {
            event.stopImmediatePropagation();
        },
        true
    );
    window.copyCrack = {};
    window.copyCrack.mdCopy = mdCopy;
    window.copyCrack.hlCopy = hlCopy;
})();