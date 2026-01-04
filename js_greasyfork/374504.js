// ==UserScript==
// @name         Heart all time
// @namespace    Heart all time
// @version      1.0
// @description  Mixlr Heart all time
// @author       @niko1094
// @match        *mixlr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374504/Heart%20all%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/374504/Heart%20all%20time.meta.js
// ==/UserScript==
(setInterval(function(){
    $('a[title^="Heart this now"]').trigger('click');
}, 500))(jQuery);