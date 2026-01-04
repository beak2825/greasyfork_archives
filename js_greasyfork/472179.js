// ==UserScript==
// @name     dalao.net 域名高亮显示
// @version  1
// @grant    none
// @description  在 dalao.net 上对域名进行高亮处理，并根据前缀长度设置不同的颜色
// @author       wangqian
// @match       *://dalao.net/*
// @license  MIT
// @namespace https://greasyfork.org/users/1139915
// @downloadURL https://update.greasyfork.org/scripts/472179/dalaonet%20%E5%9F%9F%E5%90%8D%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/472179/dalaonet%20%E5%9F%9F%E5%90%8D%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    function getHighlightColor(domainName) {
        var prefix = domainName.split('.')[0];  // 获取域名的前缀
        var length = prefix.length;

        if (length >= 1 && length <= 2) {
            return 'yellow';  // 一级域名
        } else if (length >= 3 && length <= 4) {
            return 'pink';  // 二级域名
        } else if (length >= 5 && length <= 6) {
            return 'lightgreen';  // 三级域名
        } else if (length >= 7 && length <= 8) {
            return 'lightblue';  // 四级域名
        } else {
            return 'lightgray';  // 五级域名
        }
    }

    function highlightDomainNames(textNode) {
        var parent = textNode.parentNode;
        var textContent = textNode.textContent;

        var domainRegex = /\b((?:[a-z][a-z0-9-]*[a-z0-9]\.)+(?:[a-z][a-z-]{1,61}[a-z]|xn--[a-z0-9]{1,59}|[a-z]{2,}))\b/gi;
        var match = domainRegex.exec(textContent);

        while (match !== null) {
            var beforeMatchNode = document.createTextNode(textContent.slice(0, match.index));
            var matchNode = document.createElement('span');
            matchNode.style.backgroundColor = getHighlightColor(match[0]);  // 根据域名前缀长度设置高亮颜色
            matchNode.textContent = match[0];
            var afterMatchNode = document.createTextNode(textContent.slice(domainRegex.lastIndex));

            parent.insertBefore(beforeMatchNode, textNode);
            parent.insertBefore(matchNode, textNode);
            parent.insertBefore(afterMatchNode, textNode);

            parent.removeChild(textNode);

            textNode = afterMatchNode;
            textContent = textNode.textContent;
            match = domainRegex.exec(textContent);
        }
    }

    function findTextNodes(node) {
        var textNodes = [];

        for (var childNode of node.childNodes) {
            if (childNode.nodeType === Node.TEXT_NODE) {
                textNodes.push(childNode);
            } else {
                textNodes = textNodes.concat(findTextNodes(childNode));
            }
        }

        return textNodes;
    }

    var textNodes = findTextNodes(document.body);

    for (var textNode of textNodes) {
        highlightDomainNames(textNode);
    }
})();
