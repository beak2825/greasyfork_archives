// ==UserScript==
// @name         v2ex 和谐插件
// @namespace    https://github.com/imdong/v2hx?u
// @version      0.3
// @description  世界本该和谐
// @author       青石
// @match        https://www.v2ex.com/t/*
// @match        https://www.v2ex.com/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390035/v2ex%20%E5%92%8C%E8%B0%90%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/390035/v2ex%20%E5%92%8C%E8%B0%90%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function (window, $) {
    'use strict';

    let _v2hx = window._v2hx || {
        /**
         * 字符串转 base64 并翻转
         * @param {string} str 需要编码的字符串
         */
        str2b64: function (str) {
            return btoa(escape(str)).split("").reverse().join('');
        },
        /**
         * 翻转 base64 编码并转 字符串
         * @param {string}} str 编码后的字符串
         */
        b642str: function (str) {
            return unescape(atob(str.split("").reverse().join('')));
        },
        /**
         * 替换文本中需要编码的字符串
         * @param {string} content 待处理的文本内容
         */
        encode: function (content) {
            let result = content.replace(/(?<!`)~~([!@#$%^&])([^~]+)~~(?!`)/g, function (match_full, type, content, offset, string) {
                // 对于 type 做备用，暂不处理
                return "[v2hx::" + _v2hx.str2b64(content) + "]";
            });
            return result;
        },
        /**
         * 找出需要解编码的字符串解码后替换
         * @param {string} str 待处理的文本内容
         */
        decode: function (str) {
            let result = str.replace(/\[([vV]2[hH][xX]):([^:]{0,2}):([^\]]+)\]/g, function (match_full, head, type, content, offset, string) {
                // 对于 type / head 做备用，暂不处理
                return _v2hx.b642str(content);
            });
            return result;
        },
        /**
         * 拦截 发主题 / 回复 输入框，尝试替换内容
         */
        changeEdit: function () {
            if (location.pathname == '/new') {
                window.editor.setValue(this.encode(window.editor.getValue()));
            } else if (location.pathname.substr(0, 3) == '/t/') {
                $("#reply_content").val(this.encode($("#reply_content").val()));
            } else {
                return;
            }
            return true;
        },
        /**
         *  逐级遍历子节点
         * @param {child} child
         */
        replaceChild: function (child, id) {
            if (child.nodeType == 3) {
                child.textContent = _v2hx.decode(child.textContent);
            } else {
                child.childNodes.forEach(_v2hx.replaceChild);
            }
        },
        /**
         * 解码正文 / 评论的内容
         */
        decodeText: function () {
            if (location.pathname.substr(0, 3) != '/t/') return;
            // 评论回复
            $('.topic_content,.markdown_body,.reply_content').each(function (index, item) {
                item.childNodes.forEach(_v2hx.replaceChild);
            });
        },
        /**
         * 初始化
         */
        init: function () {
            $('#editor,#reply_content').parents('form').submit(function (event) {
                return _v2hx.changeEdit();
            });
            this.decodeText();
        }
    };

    // _v2hx.init();
    window.v2hx = _v2hx;
})(window, jQuery);
