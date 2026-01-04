// ==UserScript==
// @name         jandan showpic
// @namespace    jandan utils
// @version      0.2
// @description  显示煎蛋正文图片
// @author       vevan
// @match        http://jandan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394224/jandan%20showpic.user.js
// @updateURL https://update.greasyfork.org/scripts/394224/jandan%20showpic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if($("#content .post")){
        $("#content .post p").find("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.png'],a[href$='gif']").each(function(idx,el){
            var src = $(this).attr("href")
            $(this).text("").append("<img src='"+src+"' style='max-height: 600px; display:block;' />")
        })
    }
})();