// ==UserScript==
// @name         Vulcun Autoclicker
// @namespace    http://your.homepage/
// @version      0.35
// @description  enter something useful
// @author       You
// @match      https://vulcun.com/user/lobby#page-live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14012/Vulcun%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/14012/Vulcun%20Autoclicker.meta.js
// ==/UserScript==

var console=(function(oldCons){
    return {
        log: function(text){
            oldCons.log(text);
            // Your code
        },
        info: function (text) {
            oldCons.info(text);
            if(text == "Lootdrop started"){
				document.getElementById("enter-lootdrop").click();
				oldCons.info("Lootdrop entered");
			}
        },
        warn: function (text) {
            oldCons.warn(text);
            // Your code
        },
        error: function (text) {
            oldCons.error(text);
            // Your code
        }
    };
}(window.console));

//Then redefine the old console
window.console = console;
