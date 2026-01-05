// ==UserScript==
// @name        Daewoo iframe injecter
// @description:en  Injects the SoloTodo price comparison widget in Daewoo website
// @namespace   https://greasyfork.org/en/users/27074-vijay-khemlani
// @include     http://www.daewoo.cl/*
// @version     1.0
// @grant       none
// @description Injects the SoloTodo price comparison widget in Daewoo website
// @downloadURL https://update.greasyfork.org/scripts/16173/Daewoo%20iframe%20injecter.user.js
// @updateURL https://update.greasyfork.org/scripts/16173/Daewoo%20iframe%20injecter.meta.js
// ==/UserScript==

var parent_container = $('section.hero-slider-prod').parent();

parent_container.append('<div style="overflow: hidden; margin-top: 20px;"><iframe id="solotodo_wtb_frame" src="http://backend.solotodo.net/wtb/brands/1/widget/" width="100%" height="400" frameborder="0" style="overflow:hidden"></iframe></div>');

window.addEventListener("message", function(event) {
    if (event.data.name === 'solotodo_wtb_frame_resize') {
        $('#solotodo_wtb_frame').height(event.data.value);
    }
}, false);