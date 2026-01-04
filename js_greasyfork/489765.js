// ==UserScript==
// @name         粉笔题库当前问题序号高亮
// @namespace    http://tampermonkey.net/
// @version      2025.4.18
// @description  当前问题序号高亮
// @author       AN drew
// @match        https://www.fenbi.com/spa/tiku/*
// @match        https://spa.fenbi.com/ti/exam/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489765/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E5%BD%93%E5%89%8D%E9%97%AE%E9%A2%98%E5%BA%8F%E5%8F%B7%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/489765/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E5%BD%93%E5%89%8D%E9%97%AE%E9%A2%98%E5%BA%8F%E5%8F%B7%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.answer-btn.active{
  border: 1px solid orange !important;
  background: yellow !important;
  color: red !important;
}
    `);

    let index;

    $("body").delegate(".ti","mouseover",function(){
        index=parseInt($(this).find('.title-index').text());
        $('.answer-btn').eq(index).addClass('active');
    })

    $("body").delegate(".ti","mouseout",function(){
        $('.answer-btn').eq(index).removeClass('active');
    })

})();