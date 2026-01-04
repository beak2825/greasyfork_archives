// ==UserScript==
// @name         超星考试允许粘贴
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在超星考试中允许粘贴答案。
// @author       Priate
// @match        *://*.chaoxing.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/401472/%E8%B6%85%E6%98%9F%E8%80%83%E8%AF%95%E5%85%81%E8%AE%B8%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/401472/%E8%B6%85%E6%98%9F%E8%80%83%E8%AF%95%E5%85%81%E8%AE%B8%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.UE){
        var text_inputs = document.getElementsByTagName("textarea");
        for(var i=0;i<text_inputs.length;++i){
            UE.getEditor(text_inputs[i].id).removeListener('beforepaste', myEditor_paste);
        }
    }
})();