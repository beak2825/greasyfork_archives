// ==UserScript==
// @name         Hungry kadoatie alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Alert when more than x kadoaties need to be fed.
// @author       Nyu (clraik)
// @match        http://www.neopets.com/games/kadoatery/
// @match        http://www.neopets.com/games/kadoatery/index.phtml
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/29564/Hungry%20kadoatie%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/29564/Hungry%20kadoatie%20alert.meta.js
// ==/UserScript==


var i = GM_getValue('unfed', 0);
GM_setValue('unfed', hungryKads());
var kadsToSkip=2;
$(document).ready(function(){
    if(hungryKads()>i){
        alert("The number of unfed Kads changed.");
    }else{
        setTimeout(function(){ location.reload();},1000);
    }
})();
function hungryKads() {
    var hungry=$("[id='content']")[0].innerHTML;
    if(hungry.includes("You should give it")){
        var t = document.body.textContent.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont = new RegExp("You should give it", "gi");
        return t.match(cont).length;
    }else{
        return 0;
    }
}