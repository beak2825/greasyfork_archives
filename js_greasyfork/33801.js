// ==UserScript==
// @name           AHD Internal & User Group Highlighter
// @version        0.2 (Purg mod)
// @lastupdated    2017-03-21
// @description    Colors the Internal & User Groups Tag & the Internal! tag
// @include        https://*awesome-hd.me/*
// @grant          none
// @namespace https://greasyfork.org/users/155139
// @downloadURL https://update.greasyfork.org/scripts/33801/AHD%20Internal%20%20User%20Group%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/33801/AHD%20Internal%20%20User%20Group%20Highlighter.meta.js
// ==/UserScript==
var allStrongAreas = document.getElementsByTagName('strong');
for (var i in allStrongAreas) {
    var thisStrongArea = allStrongAreas[i];
	var tsa_iH = thisStrongArea.innerHTML; //just so I have less to type

	if (tsa_iH == "HiFi" || tsa_iH == "BMF" || tsa_iH == "decibeL" || tsa_iH == "D-Z0N3" || tsa_iH == "NCmt" || tsa_iH == "FoRM" || tsa_iH == "FTW-HD" || tsa_iH == "OlSTiLe" || tsa_iH == "Penumbra" || tsa_iH == "Positive" || tsa_iH == "SHeNTo" || tsa_iH == "de[42]" || tsa_iH == "G3N3" || tsa_iH == "NiBuRu" || tsa_iH == "SaNcTi" || tsa_iH == "ZQ" || tsa_iH == "TDD") thisStrongArea.style.color = '#8cf43b';

	if (tsa_iH == "User Release!") thisStrongArea.style.color = '#FFD817';

    if (tsa_iH == "Internal!") thisStrongArea.style.color = '#0099CC';

}