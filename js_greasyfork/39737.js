// ==UserScript==
// @name     Intranet normale afbeeldingen
// @description Zorgt ervoor dat afbeeldingn op Topicus intranet een normale omvang hebben.
// @namespace JOLIJT
// @version  1.1
// @match    http://intranet/*
// @match    http://intranet.topicus.nl/*
// @match    https://intranet.topicus.nl/*
// @author	Ben van der Stouwe
// @grant    none
// @licence 
// @downloadURL https://update.greasyfork.org/scripts/39737/Intranet%20normale%20afbeeldingen.user.js
// @updateURL https://update.greasyfork.org/scripts/39737/Intranet%20normale%20afbeeldingen.meta.js
// ==/UserScript==
(function() {
    var imgs = document.getElementsByTagName("img");

    for (var i = 0; i < imgs.length; i++) {
      	var img = imgs[i];
      	img.src = img.src.replace(/_resampled\/resizedimage(.*?)-/g,"");
    }
}) ();