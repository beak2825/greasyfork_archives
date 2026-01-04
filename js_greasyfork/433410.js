// ==UserScript==
// @name         jigsawexplorer anti-troll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add an anti troll system for message popup and the Shift+R feature as a button
// @author       zaykho
// @match        https://www.jigsawexplorer.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433410/jigsawexplorer%20anti-troll.user.js
// @updateURL https://update.greasyfork.org/scripts/433410/jigsawexplorer%20anti-troll.meta.js
// ==/UserScript==

(function() {
var x_toolbar=document.getElementsByClassName("jigex-toolbar-center");
var x_popup=document.getElementById("jigex-toast-pnl");
var x_div_new=[];
var x_troll=0;
var x_image="data:image/png;base64,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"
function x_func_a(){if(x_troll===0){x_troll=1;x_popup.style.setProperty("visibility", "hidden", "important");x_div_new[0].style.backgroundPosition="-50px -7px";}else{x_troll=0;x_popup.style.setProperty("visibility", "visible", "important");x_div_new[0].style.backgroundPosition="0px -7px"; }}
function x_func_b(){document.dispatchEvent(new KeyboardEvent("keydown",{key:"r",keyCode:82,which:82,shiftKey:true}));}
x_div_new[0]=document.createElement("div");
x_div_new[0].id="x-troll-btn";
x_div_new[0].className += "niftybar-icon-button";
x_div_new[0].className += "main-tb-btn";
x_div_new[0].setAttribute("data-tooltip", "Anti Troll Mode: Disable message popup and mute sound");
x_div_new[0].style="width:36px;height:36px;padding:0 6px 0 6px;color:white;cursor:pointer;background:rgba(0, 0, 0, 0) url("+x_image+") no-repeat 0px -7px;";
x_toolbar[0].insertBefore(x_div_new[0], x_toolbar[0].firstChild);
x_div_new[0].onclick=function(){x_func_a()};
x_div_new[1]=document.createElement("div");
x_div_new[1].id="x-shift_r-btn";
x_div_new[1].className += "niftybar-icon-button";
x_div_new[1].className += "main-tb-btn";
x_div_new[1].setAttribute("data-tooltip", "Add the Shift+R shorcut as a button");
x_div_new[1].style="width:36px;height:36px;padding:0 6px 0 6px;color:white;cursor:pointer;background:rgba(0, 0, 0, 0) url("+x_image+") no-repeat -101px -7px;";
x_toolbar[0].insertBefore(x_div_new[1], x_toolbar[0].childNodes[5]);
x_div_new[1].onclick=function(){x_func_b()};
})();