// ==UserScript==
// @name             Hide AdBlock popup - zive.cz
// @name:cs          Skrytí AdBlock vyskakovacího okna - zive.cz
// @namespace        Violentmonkey Scripts
// @description      Hide AdBlock popup on website zive.cz
// @description:cs   Skryje AdBlock vyskakovací okno na zive.cz
// @match            *://*.zive.cz/*
// @grant            none
// @version          1.4
// @author           zener
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/477798/Hide%20AdBlock%20popup%20-%20zivecz.user.js
// @updateURL https://update.greasyfork.org/scripts/477798/Hide%20AdBlock%20popup%20-%20zivecz.meta.js
// ==/UserScript==
window.addEventListener("load", function(event) {
    $('a[title="Povolit reklamu"]').parent().parent().parent().parent().remove();
});