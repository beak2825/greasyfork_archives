// ==UserScript==
// @name         Amaranthine - Botcheck
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       CitizenStile
// @match        http://amar.bornofsnails.net/index.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/10762/Amaranthine%20-%20Botcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/10762/Amaranthine%20-%20Botcheck.meta.js
// ==/UserScript==
var tmr = false;
var vis = false;
$(function() {
    $('#main_panel').bind("DOMSubtreeModified",function(){
        vis = $("map[name*='botcheckmap']").length > 0;
        
        if(vis){
            ts = Date.now();
            document.title = 'BC - Amaranthine';
            tmr = false;
        } else {
            tmr = true;
            document.title = 'Amaranthine';
            if(unsafeWindow.ts != "A"){
                //ssetTimeout(CheckBC, 1000, ts);
            }
        }

    });
});

function CheckBC(){
    vis = $("map[name*='botcheckmap']").length > 0;
    if(!vis){
        console.log(unsafeWindow.ts+3600*1000);
        var tm = ((unsafeWindow.ts+3600*1000)-Date.now())/1000;
        var min = parseInt(tm/60);
        var sec = parseInt(tm%60);
        document.title = min + ":" + sec + ' Amaranthine';
        setTimeout(CheckBC, 1000);
    } else {
        tmr = false;
    }
}
