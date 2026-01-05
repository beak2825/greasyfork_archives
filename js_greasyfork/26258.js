// JavaScript source code
// ==UserScript==
// @name        CRM Sandbox Warning
// @namespace   InfoCumulus
// @include     *crm*
// @version     1.0.0
// @grant       none
// @description Warns you if you are on sandbox instance
// @downloadURL https://update.greasyfork.org/scripts/26258/CRM%20Sandbox%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/26258/CRM%20Sandbox%20Warning.meta.js
// ==/UserScript==

var x = $(".sandboxWatermark").length
if(x==1){
    $("#navTabGroupDiv").css("background-color","red");
    $(".sandboxWatermark").css("opacity","1"); 
    $(".sandboxWatermark").css("font-size","58px");
}