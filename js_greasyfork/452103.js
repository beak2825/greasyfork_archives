// ==UserScript==
// @name                Eu não sou Robo
// @icon                https://i.gifer.com/2Hiq.gif
// @version             0.1
// @namespace           Brazucas Team
// @description         Efetuar Click sobre o formulario eu não sou robo universal
// @author              M.M
// @match               http://*/*
// @match               https://*/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/452103/Eu%20n%C3%A3o%20sou%20Robo.user.js
// @updateURL https://update.greasyfork.org/scripts/452103/Eu%20n%C3%A3o%20sou%20Robo.meta.js
// ==/UserScript==


var clickCheck = setInterval(function() {
            if (document.querySelectorAll("#checkbox").length > 0) {
                clearInterval(clickCheck);
                document.querySelector("#checkbox").click();
            }
        }, 100);