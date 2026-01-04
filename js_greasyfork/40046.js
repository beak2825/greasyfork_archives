// ==UserScript==
// @name         锐格平台粘贴复制右键破解
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       ringotc
// @match        http://112.64.141.46:9010/*
// @match        http://210.42.74.49/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40046/%E9%94%90%E6%A0%BC%E5%B9%B3%E5%8F%B0%E7%B2%98%E8%B4%B4%E5%A4%8D%E5%88%B6%E5%8F%B3%E9%94%AE%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/40046/%E9%94%90%E6%A0%BC%E5%B9%B3%E5%8F%B0%E7%B2%98%E8%B4%B4%E5%A4%8D%E5%88%B6%E5%8F%B3%E9%94%AE%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
window.pojie = function(){
$(document).unbind();$('body').unbind();$('body').attr('onpaste',null);
$('#gCodeBox .ace_text-input').unbind("keydown")
}
$("body").append("<button style='position:absolute;right:10%;bottom:10%;padding:30px' onclick=pojie()>破解</button>")
})();