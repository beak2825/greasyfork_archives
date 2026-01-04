// ==UserScript==
// @name        度盘密码自动化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动拼接密码到网址，点击过的高亮显示
// @author       etng
// @match        *://fanxinzhui.com/rr/*
// @match        *://www.fanxinzhui.com/rr/*
// @match        *://www.ghxi.com/*
// @match        *://subs.kamigami.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanxinzhui.com
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/454286/%E5%BA%A6%E7%9B%98%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454286/%E5%BA%A6%E7%9B%98%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = unsafeWindow.jQuery;
    var getTextNodes = function (root, keyword) {
        if (!root) {
            root = document.querySelector('body')
        }
        var textNodes = []
        root.childNodes.forEach(node => {
            var nodeType = node.nodeType;
            if (nodeType == 3) {
                if (!keyword || node.textContent.indexOf(keyword) >= 0) {
                    textNodes.push(node)
                }
            } else if ([1, 9, 11].indexOf(nodeType) >= 0) {
                textNodes = textNodes.concat(getTextNodes(node, keyword))
            }
        })
        return textNodes
    };
    var cnt = 0;
    $('a[href^="https://pan.baidu"]').each((k, v) => {
        var a = $(v);
        var url = a.attr('href');
        if (url.indexOf('?pwd=') == -1) {
            var pswd = a.closest('span').find('a.password')
            var pswdTxt = ""
            if (pswd.length) {
                pswdTxt = pswd.text()
            } else {
                try {
                    var keywords = ["密码", "提取码"]
                    keywords.forEach((keyword) => {
                        getTextNodes(v.parentNode, keyword).forEach((linkNode) => {
                            var pattern = new RegExp('密码' + '[:：]\\s*', 'g')
                            pswdTxt = linkNode.textContent.split(pattern)[1].trim()
                            throw new Error("Found")
                        })
                    })
                } catch (e) {
                    if (e.message == "Found") {
                    }
                }
            }
            if (pswdTxt) {
                a.attr('href', url + '?pwd=' + pswdTxt)
                pswd.hide()
                a.css('font-size', '24px')
                cnt += 1
            }
        }
    })
    $('a[href^="https://pan.baidu"]').click((e) => {
        //e.preventDefault();
        $(e.target).css('color', '#f00')
    })
    if (cnt > 0) {
        GM_notification({ text: `${cnt}百度盘链接自动添加密码成功`, timeout: 800, onclick: function () { } });
    } else {
        var textNodes = getTextNodes('', 'pan.baidu.com');
        textNodes.forEach((linkNode) => {
            var link = linkNode.textContent.split('：')[1]
            var current = linkNode
            var i = 0;
            while (current.textContent.indexOf('提取码') == -1 && i < 10) {
                current = current.nextSibling
                i++
            }
            if (current.textContent.indexOf('提取码') >= 0) {
                link += '?pwd=' + current.textContent.split('：')[1]
                var a = document.createElement('a')
                a.href = link
                a.textContent = link
                a.target = "_blank"
                current.remove()
                linkNode.replaceWith(a)
                cnt += 1;
            }
        });
        if (cnt > 0) {
            GM_notification({ text: `${cnt}百度盘文本链接转换成功`, timeout: 800, onclick: function () { } });
        }
    }
})();