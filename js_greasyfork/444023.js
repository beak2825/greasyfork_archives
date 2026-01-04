
// ==UserScript==
// @name         获取selenium选择元素代码
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  用来获取selenium格式选择html元素的代码，将鼠标放到元素位置，快捷键alt+a就可以将代码复制到剪切板。
// @author       You
// @match        *://*.qq.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444023/%E8%8E%B7%E5%8F%96selenium%E9%80%89%E6%8B%A9%E5%85%83%E7%B4%A0%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/444023/%E8%8E%B7%E5%8F%96selenium%E9%80%89%E6%8B%A9%E5%85%83%E7%B4%A0%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.body.onmouseover = (event) => {
        window.currentOverElement = event.target;
    };
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.keyCode === 65) {
            var element = window.currentOverElement;
            // 优先通过text获取元素
            if (element.innerText.trim() != '') {
                var textSelector = '//' + element.tagName.toLowerCase() + '[normalize-space(text())="' + element.innerText.trim() + '"]';
                var count = document.evaluate('count(' + textSelector + ')', document.body, null, XPathResult.ANY_TYPE, null).numberValue;
                if (count >= 1) {
                    var index = 0;
                    var results = document.evaluate(textSelector, document.body, null, XPathResult.ANY_TYPE, null);
                    while (true) {
                        const eachDom = results.iterateNext();
                        if (!eachDom) break;
                        if (eachDom == element) {
                            if (index == 0) {
                                copySpecialText(`self.driver.find_element_by_xpath('` + textSelector + `')`);
                            } else {
                                copySpecialText(`self.driver.find_elements_by_xpath('` + textSelector + `')[` + index + `]`);
                            }
                            return;
                        }
                        index += 1;
                    }
                }
            }
            // 有id的通过id
            if (element.id) {
                selector = '#' + element.id;
                if(document.querySelectorAll(selector).length == 1) {
                    copySpecialText(`self.driver.find_element_by_id('` + element.id + `')`);
                    return;
                }
            }
            // 有class的通过class
            if (element.className) {
                var selector = element.className.trim();
                selector = selector.replace(/ +/g, '.');
                selector = '.' + selector;
                if (document.querySelectorAll(selector).length == 1) {
                    copySpecialText(`self.driver.find_element_by_css_selector('` + selector + `')`);
                    return;
                } else if (document.querySelectorAll(selector).length > 1) {
                    index = 0;
                    for (const eachDom of document.querySelectorAll(selector)) {
                        if (eachDom == element) {
                            break;
                        }
                        index++;
                    }
                    if (index == 0) {
                        copySpecialText(`self.driver.find_elements_by_css_selector('` + selector + `')`);
                    } else {
                        copySpecialText(`self.driver.find_elements_by_css_selector('` + selector + `')[` + index + `]`);
                    }
                    return;
                }
            }
            // 都没有的通过id优先的xpath
            copySpecialText(getXpath(element));
        }
    });
    window.getXpath = (dom) => {
        var path = "";
        for (; dom && dom.nodeType == 1; dom = dom.parentNode) {
            var index = 1;
            for (var sib = dom.previousSibling; sib; sib = sib.previousSibling) {
                if (sib.nodeType == 1 && sib.tagName == dom.tagName) index++;
            }
            var xname = dom.tagName.toLowerCase();
            if (dom.id) {
                xname += "[@id=\"" + dom.id + "\"]";
            } else {
                if (index > 0) xname += "[" + index + "]";
            }
            path = "/" + xname + path;
        }
        path = path.replace("html[1]/body[1]/", "html/body/");
        var xpathElementsStr = path.split("/");
        var xpathElementList = [];
        var processElementList = [];
        var flag = true;
        for (const eachDom of xpathElementsStr.reverse()) {
            if (flag) {
                xpathElementList.push(eachDom);
            }
            if (eachDom.indexOf('@id') != -1) {
                flag = false;
            }
        }
        for (const eachDom of xpathElementList.reverse()) {
            if (eachDom.trim() != ''){
                processElementList.push(eachDom.trim());
            }
        }
        path = '//' + processElementList.join('/');
        return path;
    }
    window.copySpecialText = (text) => {
        var node = document.createElement('span');
        node.id = 'copy_element_20220426';
        node.innerText = text;
        document.body.appendChild(node);
        if (document.queryCommandSupported('copy')) {
            // 移除所有的range
            window.getSelection().removeAllRanges();
            const range = document.createRange()
            // 要复制的内容dom节点
            range.selectNode(node)
            window.getSelection().addRange(range)
            try {
                // 返回true 表示成功
                const successful = document.execCommand('copy')
                } catch(err) {}
            // 移除所有的range
            window.getSelection().removeAllRanges();
        }
        node.remove();
        alert('已将代码复制到剪切板！\nCode：' + text);
    }
})();
