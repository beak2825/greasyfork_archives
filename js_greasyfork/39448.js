// ==UserScript==
// @name        clearCSDNDocument
// @namespace    http://blog.csdn.net
// @version      0.4
// @description  clear CSDN Document
// @author       inmyfree
// @match        http://blog.csdn.net/*/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39448/clearCSDNDocument.user.js
// @updateURL https://update.greasyfork.org/scripts/39448/clearCSDNDocument.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = 0;
    var clearID = 0;
    function clearCSDNDocument() {
        $(".pulllog-box").css("display","none");
        if(i>2){
            window.clearInterval(clearID);
        }
        if(i===0){
            $(".hide-article-box").css("display","none");
            $("#article_content").css("height","unset");
            $("#article_content").css("overflow","unset");
        }
        i++;
        $(".hide-article-box").css("display","none");
        $("#article_content").css("height","unset");
        $("#article_content").css("overflow","unset");
    }
    clearID = window.setInterval(clearCSDNDocument, 500);

})();