// ==UserScript==
// @name         自动答题
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动答题，疯狂刷新
// @author       You
// @match        https://www.dianmoyun.com/Course/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442734/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/442734/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a=document.getElementsByClassName("question")[0].getElementsByTagName("input").length;
document.getElementsByTagName("p")[0].innerText.substring(5,7);
    for(var i=0;i<document.getElementsByClassName("question").length;i++){
        document.getElementsByClassName("question")[i].getElementsByTagName("input")[Math.floor(Math.random() * a)].click();
    }

    
            document.getElementById("Submit1").click();
        
    document.getElementsByTagName("a")[6].click();
    // Your code here...
})();