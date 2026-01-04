// ==UserScript==
// @name         Chihuahuaspin Cheat
// @namespace    https://waa.ai/spinpy
// @version      1.2
// @description  Allows you to change the amount of spins in chihuahuaspin.com
// @author       Spinfal
// @match        http://www.chihuahuaspin.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422851/Chihuahuaspin%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/422851/Chihuahuaspin%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function change(amount) {
        if (isNaN(amount)) {
            alert('that wasnt a number.');
            window.location.reload();
        } else {
            document.getElementsByTagName("img")[0].src = 'http://cdn.funnyisms.com/d3540090-1765-4633-99ff-1bb3ba7e40ec.gif';
            $(window).load(function (){
                var spins = amount;
                setInterval(function () {
                    spins = spins + 1;
                    $("#spin").text(spins + " spin" + (spins != 1 ? "s" : ""));
                    if (spins == 10)
                        $("#ethan").show();
                    else if (spins == 17)
                        $("#ethan").hide();
                }, 4205);
            });
        }
    }

    var set = prompt('amount of spins');
    if (set === null) {
        change(0);
    } else {
        change(parseInt(set));
    }

    // uwu - webhook test
    
})();
