// ==UserScript==
// @name       move army
// @namespace  Tr0ubl3
// @version    1.0
// @description  shine bright like a diamond
// @match      http://*.imperiaonline.org/imperia/game_v5/game/village.php
// @copyright  2014, shine bright like a diamond
// @downloadURL https://update.greasyfork.org/scripts/21139/move%20army.user.js
// @updateURL https://update.greasyfork.org/scripts/21139/move%20army.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}
document.body.style.background = 'orange';
setInterval(
function checker(){
    if(document.getElementsByClassName('incoming province')[0] != null){
    xajax_changeProvArrow(1,1)    
    xajax_premiumMoveAll(1)
    xajax_premiumMoveAll(2)
    xajax_premiumMoveAll(3)
    xajax_transport_all(containersStuff.findContaner({saveName:'transportation',title:'Òðàíñïîðòíè ìèñèèè'}));
    document.body.style.background = 'red';
        }
    //xajax_settings(2,0,'',true)
    xajax_find_babysit(1, 1);
},5000);
