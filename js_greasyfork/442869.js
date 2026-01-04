// ==UserScript==
// @name         谷歌学术直接复制bibtex
// @namespace    blog.icespite.top
// @version      0.3
// @description  在学术网站上直接复制bibtex到剪贴板，免去跳转步骤，请在设置中开启“导入BibTeX”按钮。
// @author       IceSpite
// @match        https://scholar.google.com/scholar*
// @match        https://scholar.google.com.hk/scholar*
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @connect      scholar.googleusercontent.com
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442869/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6bibtex.user.js
// @updateURL https://update.greasyfork.org/scripts/442869/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6bibtex.meta.js
// ==/UserScript==

 (function() {
    'use strict';
    var ALERT = true;
    $('a.gs_nta.gs_nph').each(function() {
        if (this.classList.length==2) {
            var that = this;
            this.onclick = function() {
                GM_xmlhttpRequest({
                    url: that.href,
                    onload: ({
                        responseText
                    }) => {
                        GM_setClipboard(responseText);
                        if (ALERT) {
                            alert('复制成功');
                        }
                    }
                });
              return false;
            }
        }
    })
})();