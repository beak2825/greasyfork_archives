// ==UserScript==
// @name         Japeal Toolbox v2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dragon Ball Fusion Generator Toolbox
// @author       Ciber
// @match        https://japeal.com/dbfg/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488892/Japeal%20Toolbox%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/488892/Japeal%20Toolbox%20v2.meta.js
// ==/UserScript==

const toolTitle = "Japeal Toolbox v2";
const toolUrl = "https://github.com/w3bOs/DBFG";

function JPv2() {

    // Title Change
    document.getElementsByClassName("ht-site-title")[0].firstChild.innerHTML = toolTitle;
    document.getElementsByClassName("ht-site-title")[0].firstChild.href = toolUrl;

    // VIP Activation :P
    window.VIPstatus = "Y";

    // Forms Patches
    document.querySelector("#kbtn").setAttribute("onclick", "KaiokenOn()");
    document.querySelector("#kbtn").setAttribute("src", "Kaioken01.png");

    document.querySelector("#PUButtonsSS4").setAttribute("onclick", "MasterSSCheckPre(-3, -3, 5)");
    document.querySelector("#PUButtonsSS4").setAttribute("src", "PUButtonsSS4.png");

	document.querySelector("#PUButtonsSSR").setAttribute("onclick", "MasterSSCheckPre(-3, -3, 8)");
    document.querySelector("#PUButtonsSSR").setAttribute("src", "PUButtonSSR.png");

    document.querySelector("#PUButtonsSS5").setAttribute("onclick", "MasterSSCheckPre(-3, -3, 11)");
    document.querySelector("#PUButtonsSS5").setAttribute("src", "PUButtonsSS5.png");

    document.querySelector("#PUButtonsLSS").setAttribute("onclick", "MasterSSCheckPre(-3, -3, 12)");
    document.querySelector("#PUButtonsLSS").setAttribute("src", "PUButtonsLSS.png");

    document.querySelector("#PUButtonsUE").setAttribute("onclick", "MasterSSCheckPre(-3, -3, 13)");
    document.querySelector("#PUButtonsUE").setAttribute("src", "PUButtonsUE.png");

	// Background Patches
	var bg1Elements = [19, 21, 23, 24, 25, 26, 29, 30, 31];

	bg1Elements.forEach(function(n) {
		document.getElementById(`idBG${n}`).setAttribute("onclick", `changeBG${n}();`);
		document.getElementById(`idBG${n}`).setAttribute("src", `Backgrounds/sprBG0_${n}.jpg`);
	});

	// Background Patches 2
	var lockedBGs = Array.from(document.getElementsByClassName("lockedBGClass"));

	lockedBGs.forEach(function(bgElement) {
		bgElement.remove();
	});

	var bg2Elements = [5, 7, 8, 9, 10, 13, 14, 16, 17, 18, 19, 20, 21, 22, 25, 26, 29, 32];

	bg2Elements.forEach(function(n) {
		document.querySelector(`#idArtBG${n}`).setAttribute("onclick", `changeBG(${n});`);
		document.querySelector(`#idArtBG${n}`).parentElement.setAttribute("onclick", "");
	});

}

// Execute the tool every 1 second (1000 miliseconds)
setTimeout(JPv2, 1000);
