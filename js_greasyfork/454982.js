// ==UserScript==
// @license MIT
// @name         河北工程大学评教助手1
// @namespace   http://27.188.65.169:9112/student/teachingEvaluation/evaluation/index
// @version      0.1
// @description  自动评教
// @author       You
// @match        http://27.188.65.169:9112/student/teachingEvaluation/evaluation/index
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454982/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B1.user.js
// @updateURL https://update.greasyfork.org/scripts/454982/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
console.log("进入")


setTimeout(() => {
    var errr=document.getElementsByTagName("button");
    console.log(errr)

    for(var i in errr){
    if(errr[i].className=='btn btn-xs btn-round btn-purple'){

    errr[i].click();
        break;
    }

    }
},500)


})();