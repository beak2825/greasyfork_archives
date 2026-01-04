// ==UserScript==
// @name         Hi-PDA自动选中全文搜索
// @namespace    https://www.hi-pda.com/forum/search.php*
// @version      0.2
// @description    Hi-PDA自动添加选中全文搜索
// @author       inmyfree
// @match        https://www.hi-pda.com/forum/search.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36358/Hi-PDA%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E5%85%A8%E6%96%87%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/36358/Hi-PDA%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E5%85%A8%E6%96%87%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements =  document.getElementsByName("srchtype");
    var selectedelement;
    if(elements.length==1){
        selectedelement = elements[0];
    }else if(elements.length==2){
        selectedelement = elements[1];
    }
    selectedelement.options.add(new Option("全文","fulltext"));
    selectedelement.options[selectedelement.options.length-1].selected='selected';
})();