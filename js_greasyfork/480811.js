// ==UserScript==
// @name         t66y助手
// @namespace    com.t66y.jujufatu
// @author       jujufatu
// @version      0.1.2
// @description  优化t66y网页使用体验
// @match        http*://*t66y.com/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @license      CC BY-NC-ND 4.0
// @homepage     https://sleazyfork.org/zh-CN/scripts/480811-t66y%E5%8A%A9%E6%89%8B
// @supportURL     https://t66y.com/thread0806.php?fid=7
// @downloadURL https://update.greasyfork.org/scripts/480811/t66y%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/480811/t66y%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var pageWindow = unsafeWindow;
    const BAD_IMG_SVG = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjAwcHgiIGhlaWdodD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICAgICAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBiMDE4IiAvPgogICAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI3MS40IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZjdjNTAwIiBmb250LXNpemU9IjUyIiBmb250LWZhbWlseT0iQXJpYWwiPjx0c3BhbiB4PSI1MCUiIGR5PSIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ov4fmnJ88L3RzcGFuPjx0c3BhbiB4PSI1MCUiIGR5PSI1Ny4yIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77luoo8L3RzcGFuPjwvdGV4dD48L3N2Zz4=";
    const ERROR_FORMAT_BBCODE_TIP_IMG = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjAwcHgiIGhlaWdodD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICAgICAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiIC8+CiAgICAgICAgICA8dGV4dCB4PSI1MCUiIHk9IjYwLjM5OTk5OTk5OTk5OTk5IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZjdjNTAwIiBmb250LXNpemU9IjM2IiBmb250LWZhbWlseT0iQXJpYWwiPjx0c3BhbiB4PSI1MCUiIGR5PSIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7otLTlm748L3RzcGFuPjx0c3BhbiB4PSI1MCUiIGR5PSIzOS42IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7moLzlvI88L3RzcGFuPjx0c3BhbiB4PSI1MCUiIGR5PSIzOS42IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7plJnor688L3RzcGFuPjwvdGV4dD48L3N2Zz4=";
    const originalWindowOpen = pageWindow.open;
    pageWindow.open = function(url) {
        let nextUrl = url;
        if (/^https:\/\/2023\.redircdn\.com/.test(url)) {
            const queryParams = new URLSearchParams(new URL(url).search);
            const queryObj = {};
            for (const [ key, value ] of queryParams) {
                queryObj[key] = value === "undefined" ? undefined : value;
            }
            nextUrl = queryObj.src || url;
        }
        return originalWindowOpen.call(this, nextUrl);
    };
    document.addEventListener("click", handleLinkClick);
    window.addEventListener("error", function(event) {
        if (event.target.tagName === "IMG") {
            event.target.src = event.target.src.startsWith(location.origin) ? ERROR_FORMAT_BBCODE_TIP_IMG : BAD_IMG_SVG;
        }
    }, true);
    document.addEventListener("DOMContentLoaded", function() {
        let floors = [ ...document.querySelectorAll(".tpc_content") ];
        floors.forEach(floor => {
            floor.innerHTML = createMagnetLink(floor.innerHTML);
            if (floor.innerHTML.includes("點擊這里打開新視窗")) {
                var $floor = $(floor);
                var urlRegex = /http[s]?:\/\/[^"'\s]+/i;
                $floor.find("a").each(function() {
                    var onclickValue = $(this).attr("onclick");
                    var urlMatch = urlRegex.exec(onclickValue);
                    if (urlMatch) {
                        var url = urlMatch[0];
                        var $iframe = $(this).nextAll("iframe").first();
                        $iframe.attr("src", url);
                    }
                });
            }
        });
        let initComments = [ ...document.querySelectorAll(".post_cont") ];
        initComments.forEach(c => {
            c.innerHTML = createMagnetLink(c.innerHTML);
        });
        if (typeof pageWindow.loadComment === "function") {
            const originalLoadComment = pageWindow.loadComment;
            pageWindow.loadComment = function() {
                var data = pageWindow["comm" + arguments[0]];
                for (var key in data) {
                    data[key].c = createMagnetLink(data[key].c);
                }
                originalLoadComment.apply(this, arguments);
            };
        }
    });
    if (document.readyState === "complete") {
        jump18();
    } else {
        window.addEventListener("load", jump18);
    }
    function jump18() {
        if (document.body.innerHTML.includes(`__ 滿 18 歲, \n請按此 __`)) {
            location.href = location.origin + "/index.php";
        }
    }
    function handleLinkClick(event) {
        const target = event.target;
        if (target.tagName === "A" && target.href) {
            let url = target.href;
            if (/^https:\/\/2023\.redircdn\.com\/\?http/.test(url)) {
                url = url.split("https://2023.redircdn.com/?")[1].replace(/______/g, ".").replace(/&z$/, "");
                event.preventDefault();
                window.open(url);
            }
        }
    }
    function createMagnetLink(str) {
        try {
            str = decodeURIComponent(str);
            str = decodeHtmlEntities(str);
        } catch (e) {
            console.log("createMagnetLink: format str error");
        }
        const magnetRegex = /(?<!<[^>]*|http\S*)(?:magnet:\?xt=urn:btih:)?([A-Z2-7]{32}|[a-fA-F0-9]{40})(?:&dn=([^&\s]+))?(?:&tr=([^&\s]+))?/gi;
        function replaceFunc(match, hash, dn, tr) {
            const magnetPrefix = "magnet:?xt=urn:btih:";
            const decodedDn = dn ? `磁力链接-${decodeURIComponent(dn)}` : `磁力链接-${hash}`;
            const trParam = tr ? `&tr=${encodeURIComponent(tr)}` : "";
            let href = match.startsWith(magnetPrefix) ? match : `${magnetPrefix}${hash}${dn ? `&dn=${encodeURIComponent(dn)}` : ""}${trParam}`;
            href = href.replace(/\s+/g, "");
            return `<a href="${href}">${decodedDn}</a>&nbsp;|&nbsp;<a style="cursor: pointer;" onclick="t66ycopy('${href}')">复制</a>`;
        }
        return str.replace(magnetRegex, replaceFunc);
    }
    function decodeHtmlEntities(str) {
        return str.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&iexcl;/g, "¡").replace(/&cent;/g, "¢").replace(/&pound;/g, "£").replace(/&curren;/g, "¤").replace(/&yen;/g, "¥").replace(/&brvbar;/g, "¦").replace(/&sect;/g, "§").replace(/&uml;/g, "¨").replace(/&copy;/g, "©").replace(/&ordf;/g, "ª").replace(/&laquo;/g, "«").replace(/&not;/g, "¬").replace(/&shy;/g, "­").replace(/&reg;/g, "®").replace(/&macr;/g, "¯").replace(/&deg;/g, "°").replace(/&plusmn;/g, "±").replace(/&sup2;/g, "²").replace(/&sup3;/g, "³").replace(/&acute;/g, "´").replace(/&micro;/g, "µ").replace(/&para;/g, "¶").replace(/&middot;/g, "·").replace(/&cedil;/g, "¸").replace(/&sup1;/g, "¹").replace(/&ordm;/g, "º").replace(/&raquo;/g, "»").replace(/&frac14;/g, "¼").replace(/&frac12;/g, "½").replace(/&frac34;/g, "¾").replace(/&iquest;/g, "¿").replace(/&amp;/g, "&");
    }
    pageWindow.t66ycopy = function(str) {
        GM_setClipboard(str);
        Message({
            msg: "复制成功",
            duration: 666
        });
    };
    function Message({
        msg,
        duration = 1024
    } = {}) {
        const messageElement = document.createElement("div");
        messageElement.textContent = msg;
        messageElement.style.position = "fixed";
        messageElement.style.top = "66px";
        messageElement.style.left = "50%";
        messageElement.style.transform = "translate(-50%, -50%)";
        messageElement.style.backgroundColor = "#10b018";
        messageElement.style.color = "#f7c500";
        messageElement.style.fontSize = "3rem";
        messageElement.style.padding = "20px";
        messageElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        messageElement.style.borderRadius = "10px";
        messageElement.style.zIndex = "1000";
        messageElement.style.transition = "opacity 0.5s, transform 0.5s";
        messageElement.style.opacity = "0";
        document.body.appendChild(messageElement);
        setTimeout(() => {
            messageElement.style.opacity = "1";
            messageElement.style.transform = "translate(-50%, -50%) scale(1)";
        }, 10);
        setTimeout(() => {
            messageElement.style.opacity = "0";
            messageElement.style.transform = "translate(-50%, -50%) scale(0.9)";
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 500);
        }, duration);
    }
    let style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet.insertRule(`.bad_bg { background-image: url("${BAD_IMG_SVG}") !important; }`, 0);
})();