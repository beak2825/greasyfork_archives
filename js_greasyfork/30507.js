// ==UserScript==
// @name       Simulationsbutton im Profil
// @include  https://fussballcup.de/*
// @version    0.1.2
// @description  Erzeugt in jedem Profil einen Simulations-Spiel-Button
// @copyright  Klaid, 2013
// @connect <value>
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/30507/Simulationsbutton%20im%20Profil.user.js
// @updateURL https://update.greasyfork.org/scripts/30507/Simulationsbutton%20im%20Profil.meta.js
// ==/UserScript==

window.setTimeout(function() { changes() }, 2500);
window.setInterval(function() { changes() }, 5000);
function changes()
{
    	if(!document.getElementById("simuspiel"))
        {
            var user_id = document.getElementsByClassName("button button-container-friendly-invite-button")[0].firstElementChild.getAttribute("href");
			user_id = user_id.substring(user_id.indexOf('invite=')+7, user_id.indexOf('&calendar'));
    		document.getElementsByClassName("profile-actions")[0].innerHTML += "<a href='#/index.php?w=301&area=user&module=simulation&action=index&squad=" + user_id + "' class='button' id='simuspiel'><span>Simulationsspiel</span></a>";
		}
}