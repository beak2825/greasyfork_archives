// ==UserScript==
// @name         Copy With Title and Text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlike Windows OS, Mac doesn't support copy content with url.So, the major pupose is to copy content along with title and text.
//               因 Mac Chrome 未提供复制文本时同时复制 url 功能，故编写此脚本以实现并进一步增强。兼容性未测试。
// @author       Victor Wei
// @match        http://*/*
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/390682/Copy%20With%20Title%20and%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/390682/Copy%20With%20Title%20and%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener(
        "keydown",
        event => {
            const keyName = event.key;

            if (keyName == "c" && event.ctrlKey) {
                // 如果使用 Windows，或不想覆盖 Mac ⌘ + b 键，也可以自定义组合键
            } else if (keyName == "g" && event.metaKey) {
                // ⌘ + g 除循环搜索外与 ⌘ + f 无异，顺手替换
                event.preventDefault();
                copyWithTextAndUrl();
            }
        },
        false
    );

    /**
     * 复制文本 / 标题 / URL
     */
    function copyWithTextAndUrl() {
        // 获取 URL 标题
        var title = document.title;
        // 获取 URL 地址
        var url = document.location.href;
        // 换行、标题、地址组成新元素 (添加样式复制到 OneNote / Typora 无效)
        var urlHtml = `<p id="urlSuffixEle"><a href="${url}">${title}</a></p>`;

        // 插入原选中内容后方同时选中
        insertHtmlAfterSelection(urlHtml);
        document.execCommand("copy");

        console.log(urlHtml);

        // 上面的做法会在原选中区域添加内容，复制后需移除
        // TODO: 也可以尝试复制原选中内容到新的 Range，但可以用就不继续搞了
        removeElement("urlSuffixEle");
    }

    /**
     * 插入元素并添加选中
     *
     * @param html 待添加到选中区域末尾并选中的 html 文本
     * @see https://stackoverflow.com/questions/3597116/insert-html-after-a-selection
     */
    function insertHtmlAfterSelection(html) {
        var sel, range, expandedSelRange, node;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = window.getSelection().getRangeAt(0);
                expandedSelRange = range.cloneRange();
                range.collapse(false);

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    expandedSelRange.setEndAfter(lastNode);
                    sel.removeAllRanges();
                    sel.addRange(expandedSelRange);
                }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            expandedSelRange = range.duplicate();
            range.collapse(false);
            range.pasteHTML(html);
            expandedSelRange.setEndPoint("EndToEnd", range);
            expandedSelRange.select();
        }
    }

    /**
     * 根据 id 删除元素
     *
     * @param id 元素 Id
     */
    function removeElement(id) {
        var ele = document.getElementById(id);
        return ele.parentNode.removeChild(ele);
    }
})();