// ==UserScript==
// @name           Gaia Dumpster Dive Thing
// @description    Attempt to claim Dumpster Dive every around 5 minutes.
// @include        http://www.gaiaonline.com/dumpsterdive/
// @include        https://www.gaiaonline.com/dumpsterdive/
// @version        1.0.0
// @author         surashu
// @namespace      com.surashu.gaiadumpsterdivething
// @downloadURL https://update.greasyfork.org/scripts/24647/Gaia%20Dumpster%20Dive%20Thing.user.js
// @updateURL https://update.greasyfork.org/scripts/24647/Gaia%20Dumpster%20Dive%20Thing.meta.js
// ==/UserScript==

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

window.addEventListener("load", function() {
    exec(function() {
        function doDive(){
            document.getElementById('get_treasure').click();
            setTimeout(function(){
                document.getElementById('close').click();
            }, 4000);
        }
        
        doDive();
        
        setInterval(function(){
            doDive();
        }, 303000);
    });
}, false);
