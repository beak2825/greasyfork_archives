// ==UserScript==
// @name ITM_ERP_Comment
// @description expand Comment column on ITM ERP
// @author Andrii
// @license MIT
// @version 1.3
// @match https://employee.itmagination.com/Employee/Timesheet/All?*

// @namespace https://greasyfork.org/users/396031
// @downloadURL https://update.greasyfork.org/scripts/392140/ITM_ERP_Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/392140/ITM_ERP_Comment.meta.js
// ==/UserScript==
// [1] Оборачиваем скрипт в замыкание, для кроссбраузерности (opera, ie)

(function (window, undefined) {// [2] нормализуем window
   var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
if (w.self != w.top) {
        return;
    }
var table1 = document.getElementsByClassName("table table-condensed table-hover")[0];
var pattern = /<a href=\"#\" class=\"popovers\" data-toggle=\"popover\" data-placement=\"left\" data-content=\"(.*?)\".*?>Show<\/a>/gis;
 function waitForElement(){
                 var table = document.getElementsByClassName("table table-condensed table-hover")[0];
                 if(table){
                     table.innerHTML = table.innerHTML.replace(pattern,"$1");
                 }
                 else{
                     setTimeout(waitForElement, 2500);
                     console.log("waiting for element");
                 }
             }

if(table1){
    table1.innerHTML = table1.innerHTML.replace(pattern,"$1");
}else{
    setTimeout(waitForElement, 2500);
}

})(window);