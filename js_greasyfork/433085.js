// ==UserScript==
// @name              jessicabakery
// @namespace         https://jessicabakery.com/
// @version           1.1.1
// @icon              https://jessicabakery.com/wp-content/uploads/2021/08/Jessica-Bakery-Roti.png
// @description       Aneka Resep Roti
// @author            jessicabakery.com
// @license           MIT
// @match             https://jessicabakery.com/
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_download
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/433085/jessicabakery.user.js
// @updateURL https://update.greasyfork.org/scripts/433085/jessicabakery.meta.js
// ==/UserScript==
var opts=["1","2","3","4","5","6","7","8","9","0"];function go(){addSlots($("#lotto_1 .numberL")),moveSlots($("#lotto_1 .numberL")),addSlots($("#lotto_2 .numberL")),moveSlots($("#lotto_2 .numberL")),addSlots($("#lotto_3 .numberL")),moveSlots($("#lotto_3 .numberL")),addSlots($("#lotto_4 .numberL")),moveSlots($("#lotto_4 .numberL"))}function addSlots(o){for(var t=0;t<10;t++){var n=Math.floor(Math.random()*opts.length);o.append("<div class='slot'>"+opts[n]+"</div>")}}function moveSlots(o){var t=300;t+=Math.round(1e3*Math.random()),o.stop(!0,!0);var n=parseInt(o.css("margin-top"),10);n-=405,o.animate({"margin-top":n+"px"},{duration:t})}$(document).ready(function(){addSlots($("#lotto_1 .numberL")),addSlots($("#lotto_2 .numberL")),addSlots($("#lotto_3 .numberL")),addSlots($("#lotto_4 .numberL"))});