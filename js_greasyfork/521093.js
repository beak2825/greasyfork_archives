// ==UserScript==
// @name         02 com pdf dis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  水印痕迹
// @author       st123
// @icon         https://www.picc.com/images/favicon.ico
// @match        *://10.160.12.1234/*/view/*
// @match        *://10.2.10.29/docview/*
// @match        11*://10.2.10.29:8011/docview/view/preview/*

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521093/02%20com%20pdf%20dis.user.js
// @updateURL https://update.greasyfork.org/scripts/521093/02%20com%20pdf%20dis.meta.js
// ==/UserScript==

(function() {

    GM_addStyle(`
/*   审计系统  */
    .mask_div div,/* .layui-table-cell, */

/*     .page,
/*     .unvisible,

/*   OA系统  */
    /* doc   --         .ismnGc,        -- */
    .sc-lbOyJj,

    /* pdf  --   .textLayer span,                  --  */
    .mask_div span,
    
    .word-page div{display:none !important;}

   /*
   .mask___3po2I{background-color:red22 !important;}
   .word-page .sc-lbOyJj{background-color:red !important;}
   .word-page .ismnGc{background-color:blue !important;}
   .word-page .main-w-1{background-color:black !important;}
   .sc-gFGZVQ{background-color:blue !important;}
   .ftMsqe{background-color:black !important;}
   */

   `);

})();