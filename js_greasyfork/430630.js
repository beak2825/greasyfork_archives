// ==UserScript==
// @name         B站评论区楼层显示
// @namespace    https://aih.im
// @description  在评论区添加了楼层
// @version      1.0
// @author       AiHimmel
// @match        *://www.bilibili.com/video/*
// @match        *://t.bilibili.com/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/core-js-bundle@3.16.1/minified.js
// @downloadURL https://update.greasyfork.org/scripts/430630/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/430630/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var raw_appendChild = Node.prototype.appendChild;

    Node.prototype.appendChild = function (e, ...args) {
        var _this = this;
        if (e.tagName == 'SCRIPT' && args.length == 0 && e.src.match(/.*comment.*js/)) {

            document._raw_e = e;
            fetch(e.src).then((rsp) => {
                return rsp.text();
            }).then((t) => {
                t = t.replaceAll("this._createReplyBtn(e.rcount)", "this._createReplyBtn(e.rcount),e.floor?'<span>'+e.floor+'楼</span>':''");
                var e = document._raw_e
                e.textContent = t;
                e.removeAttribute('src');
                e.id = 'comment_js'
                e.onerror = () => {
                    alert('检测到B站评论区楼层显示脚本错误，请反馈');
                };
                var ret=raw_appendChild.call(_this, e)
                e.onload();
                return ret

            })

        } else {

                return raw_appendChild.call(_this, e, ...args);

        }
    }





})();