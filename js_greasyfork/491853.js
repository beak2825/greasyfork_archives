// ==UserScript==
// @name         JDY_Packing_List_Print
// @namespace    https://www.liftnova-cranes.com/
// @version      0.2
// @description  用于简道云装箱清单弹窗打印
// @author       Bruce
// @match        https://u4c0fh51hz.jiandaoyun.com/q/630adcd5970d7e0008093d2f
// @icon         https://www.google.com/s2/favicons?domain=jiandaoyun.com
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491853/JDY_Packing_List_Print.user.js
// @updateURL https://update.greasyfork.org/scripts/491853/JDY_Packing_List_Print.meta.js
// ==/UserScript==

(function() {
    'use strict';

setTimeout(function(){
    const parentWindow = window.parent;
    const container = parentWindow.document.querySelector('body');
    const title = parentWindow.document.title;
    function set(dom,num,value){
        let inputLabel = dom; //这里获取需要自动录入的input内容
        let lastValue = inputLabel[num].value;
        inputLabel[num].value = value;
        let event = new Event("input", { bubbles: true });
        event.simulated = true;
        let tracker = inputLabel[num]._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputLabel[num].dispatchEvent(event);
    }

    if (title === "装箱明细单_V1") {
        var XSDD = parentWindow.document.getElementsByClassName("field-component")[1].innerText;
        var PackageNo = parentWindow.document.getElementsByClassName("field-component")[2].innerText;
        setTimeout(()=>{
            var mydom = document.getElementsByClassName("input-inner");
            set(mydom,0,XSDD);
            set(mydom,1,PackageNo);
        },200)
    }
    else
    {
        container.addEventListener('click', function (e) {
            if (e.target.classList.contains('x-window-mask')&&e.target.classList.contains('mask-appear-done')&&e.target.classList.contains('mask-enter-done')) {
                var XSDD = e.target.getElementsByClassName("widget-data")[1].innerText;
                var PackageNo = e.target.getElementsByClassName("widget-data")[3].innerText;
                console.log(XSDD);
                console.log(PackageNo);
                setTimeout(()=>{
		        //mydom=document.getElementById("_widget_1712466995641").contentWindow.document.getElementsByClassName("input-inner");
                    var mydom = document.getElementsByClassName("input-inner");
                    set(mydom,0,XSDD);
                    set(mydom,1,PackageNo);
                    alert(XSDD+" "+PackageNo+"复制完成");
                } , 200)

            }
        });
    }
} , 2000)
    // Your code here...
})();