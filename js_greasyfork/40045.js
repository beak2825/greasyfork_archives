// ==UserScript==
// @name         交互英语
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ringotc
// @match        http://210.42.74.49/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40045/%E4%BA%A4%E4%BA%92%E8%8B%B1%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/40045/%E4%BA%A4%E4%BA%92%E8%8B%B1%E8%AF%AD.meta.js
// ==/UserScript==

(function() {
var pojie = function(){
$(document).unbind();$('body').unbind();$('body').attr('onpaste',null);
}
$("body").append("<button style='position:absolute;right:10%;bottom:10%;' onclick=pojie()>破解</button>")
})();