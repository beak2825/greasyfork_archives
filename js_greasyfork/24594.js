// ==UserScript==
// @name         Youtube Fix (projanmo)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Youtube fix for projanmo forum
// @author       Saiful Isalm
// @match        https://forum.projanmo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24594/Youtube%20Fix%20%28projanmo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24594/Youtube%20Fix%20%28projanmo%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.each($("p>object a"), function() {
        var url = $(this).attr('href').replace('http://', 'https://');
        url = url.replace('watch?v=', 'embed/');
        var html = '<iframe width="640" height="360" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
        $(this).parents("p:first").html(html);
    });
})();