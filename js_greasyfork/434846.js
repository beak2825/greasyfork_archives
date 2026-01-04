// ==UserScript==
// @name         CSDN 允许复制、去广告
// @namespace    https://github.com/the-eric-kwok/my_userscripts
// @version      0.9
// @description  将“登录以复制”按钮更改为复制功能，去除 banner 广告
// @author       EricKwok
// @supportURL   https://github.com/the-eric-kwok/my_userscripts/issues
// @match        https://*.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @run-at       document-start
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/434846/CSDN%20%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E3%80%81%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/434846/CSDN%20%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E3%80%81%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function addListener(element, eventName, handler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, handler, false);
        }
        else if (element.attachEvent) {
            element.attachEvent('on' + eventName, handler);
        }
        else {
            element['on' + eventName] = handler;
        }
    }

    function allowSelect(elem) {
        // 删除 CSS 中禁止复制的属性
        elem.style.setProperty("-webkit-touch-callout", "initial");
        elem.style.setProperty("-webkit-user-select", "initial");
        elem.style.setProperty("-khtml-user-select", "initial");
        elem.style.setProperty("-moz-user-select", "initial");
        elem.style.setProperty("-ms-user-select", "initial");
        elem.style.setProperty("user-select", "initial");
    }

    function copyMe(elem) {
        console.log(elem);
        elem.path[0].setAttribute("data-title", "复制成功✅")
        window.setTimeout(() => elem.path[0].setAttribute("data-title", "复制"), 1000);
        let code = elem.path[1].innerText;
        function _legacyCopy() {
            console.log("正在使用传统方法复制");
            let tmpInput = document.createElement('input');
            elem.insertAdjacentHTML("afterend", tmpInput)
            tmpInput.value = code;
            tmpInput.focus();
            tmpInput.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
            }
            tmpInput.blur();
            console.log('复制成功');
            tmpInput.remove();

        }

        if (navigator.clipboard && window.isSecureContext) {
            console.log("正在使用 navigator clipboard api 进行复制操作");
            navigator.clipboard.writeText(code)
                .then(() => {
                    console.log('复制成功');
                })
                .catch(err => {
                    console.log("navigator clipboard api 复制时出错，将使用传统方法进行复制")
                    _legacyCopy();
                })
        } else {
            _legacyCopy();
        }
    }

    function makeCopy() {
        for (var item of document.querySelectorAll("pre")) {
            allowSelect(item);
            for (var child of item.children) {
                allowSelect(child);
                if (child.className.includes("signin")) {
                    child.setAttribute("data-title", "复制");
                    child.setAttribute("onclick", "");
                    addListener(child, 'click', function (child) {
                        copyMe(child);
                    });
                }
                for (var child2 of child.children) {
                    allowSelect(child2);
                    if (child2.className.includes("signin")) {
                        child2.setAttribute("data-title", "复制");
                        child.setAttribute("onclick", "");
                        addListener(child2, 'click', function (child) {
                            copyMe(child);
                        });
                    }
                }
            }
        }
    }

    /**
     *
     * @param {string} CssSelector CSS selector to identify the advert element
     */
    function removeAd(CssSelector) {
        for (var elem of document.querySelectorAll(CssSelector)) {
            elem.remove();
        }
    }

    var adCssSelectors = [
        ".toolbar-advert",
        ".csdn-common-logo-advert",
        ".passport-login-container",
        ".top-bar",
        ".csdn-common-logo-advert",
        ".adsbygoogle"
    ];

    if (window.location.href.includes("blog.csdn.net")) {
        window.onload = makeCopy;
        // 去除复制时末尾追加的版权信息（实际上通过阻止copy事件传播来实现）
        window.addEventListener("copy", function (event) {
            event.stopImmediatePropagation();
        }, true);
        window.setInterval(function () {
            for (var sel of adCssSelectors) {
                removeAd(sel);
            }
        }, 100);
    } else if (window.location.href.includes("download.csdn.net")) {
        window.setInterval(function () {
            for (var sel of adCssSelectors) {
                removeAd(sel);
            }
        }, 100);
    }
})();
