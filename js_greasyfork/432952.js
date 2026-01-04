// ==UserScript==
// @name         小米便签(笔记)pdf导出工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  点击右上角打印按钮，打印本篇笔记。
// @author       aqni
// @match        https://i.mi.com/note/h5
// @require      https://cdn.jsdelivr.net/npm/jquery@3.1.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jQuery.print@1.5.1/jQuery.print.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432952/%E5%B0%8F%E7%B1%B3%E4%BE%BF%E7%AD%BE%28%E7%AC%94%E8%AE%B0%29pdf%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432952/%E5%B0%8F%E7%B1%B3%E4%BE%BF%E7%AD%BE%28%E7%AC%94%E8%AE%B0%29pdf%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function(){
    /* globals $*/
    'use strict';
    const iconHTML='<i class="icon-8zlI5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="1em" height="1em" fill="none"><path d="M14,15.3h4v-8H2v8h4V18h8v-5.3H6 M6,7.3V2.9C6,2.4,6.4,2,7,2h6c0.6,0,1,0.4,1,0.9v2.2" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg></i>';
    const btnCreate=`<button class="action-2Jcj0 action-btn-3pa39">${iconHTML}</button>`;
    const posSelect="span.action-group-record-21ymU";
    const noteSelect="div.editor-body-VJW45";
    $(document).ready(function(){
        $(posSelect).prepend(
            $(btnCreate).click(function(){
                $(noteSelect).print();
            })
        );
    });
})();
