// ==UserScript==
// @name         新锦城自动答题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  新锦城创新创业自动答题，只能完成课后习题，考试并不能使用！
// @author       itx686
// @match        http://course.njcedu.com/questionRecord.htm?courseId=*&lPanId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424251/%E6%96%B0%E9%94%A6%E5%9F%8E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/424251/%E6%96%B0%E9%94%A6%E5%9F%8E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    var ts=document.getElementsByClassName("mtb30");
    var tj=document.getElementsByClassName("xt_tj_btn ml250");
    for(var i=1;i<=ts.length;i++){
    var da=document.getElementById("table"+i+"").getAttribute("stranswer");
    var ri=document.getElementsByName("radio"+i+"");
    switch(da){
        case "A":
            ri[0].click();
            break;
        case "B":
            ri[1].click();
            break;
        case "C":
            ri[2].click();
            break;
        case "D":
            ri[3].click();
            break;
    }
}
tj[0].click();
})();