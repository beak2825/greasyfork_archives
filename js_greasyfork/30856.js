// ==UserScript==
// @name         Remove Leetcode's Premium Problems
// @namespace    http://www.kongpingfan.com/
// @version      0.1.2
// @description  If you are not a VIP member of leetcode, you can't solve the premium problems which have a lock after them. But we can get rid of them~~~~~~ Fuck them and give you a nice interface！
// @author       kongpingfan
// @include        *leetcode.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30856/Remove%20Leetcode%27s%20Premium%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/30856/Remove%20Leetcode%27s%20Premium%20Problems.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   setInterval(getRidOf,1500);
    function getRidOf(){
     if (document.getElementsByClassName("fa-lock")){
    var elements=document.getElementsByClassName("fa-lock");
    for (var i =0;i<elements.length;i++){
        if (elements[i].parentNode.parentNode.parentNode.parentNode.parentNode.tagName=="TR" ||elements[i].parentNode.parentNode.parentNode.parentNode.parentNode.tagName=="tr" ){
            elements[i].parentNode.parentNode.style.display="none";
        }
        if (elements[i].parentNode.parentNode.parentNode.tagName=="TR" ||elements[i].parentNode.parentNode.parentNode.tagName=="tr" ){
            elements[i].parentNode.parentNode.parentNode.style.display="none";
        }
    }
}
    }
})();