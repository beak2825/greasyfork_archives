// ==UserScript==
// @name         AutoFarm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AutoFarm A
// @author       NotweR
// @match        https://*.divokekmeny.cz/game.php?village=*&screen=am_farm
// @match        https://*.divokekmeny.cz/game.php?village=*&screen=am_farm&Farm_page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divokekmeny.cz
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/458686/AutoFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/458686/AutoFarm.meta.js
// ==/UserScript==

(function() {
    FarmA();
    setInterval(reload, 600000+Math.random(5000));
})();


function FarmA(){
var progressElm = $("<div>da</div>");
$("#am_widget_Farm").before(progressElm);
var total = $(".farm_icon_a").length;
var farms = $(".farm_icon_a");
var a = 0;
setInterval(function(){
    if (a == total) return;
    $(farms[a]).trigger("click");
    progressElm.html(a + " / " + total);
    a++;
},300+Math.random(200));
}

function reload()
{
window.location.reload();
}
