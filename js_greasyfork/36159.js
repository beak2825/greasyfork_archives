// ==UserScript==
// @name         scrollBottom
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ir al último comentario de un vox con un clic.
// @author       Hhaz
// @match        http*://www.voxed.net/*
// @downloadURL https://update.greasyfork.org/scripts/36159/scrollBottom.user.js
// @updateURL https://update.greasyfork.org/scripts/36159/scrollBottom.meta.js
// ==/UserScript==

$(".comment .image").click(function() {
    $("body, html").animate({
    scrollTop: $(document).height()
}, 400);

});