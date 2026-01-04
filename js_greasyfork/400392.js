// ==UserScript==
// @name         YWOT Tile Coords
// @namespace    https://greasyfork.org/en/users/501887-spitfirex86
// @version      1.1
// @description  Show tile coordinates next to world coordinates.
// @author       ~spitfire
// @match        http*://www.yourworldoftext.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400392/YWOT%20Tile%20Coords.user.js
// @updateURL https://update.greasyfork.org/scripts/400392/YWOT%20Tile%20Coords.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    function d() {return $('<div>')}
    function s() {return $('<span>')}

    var coords = $('#coords').prepend(d().html('<b>Coords:</b>')).show();
    var tc = d().append(d().html('<b>Tile:</b>')).appendTo(coords);
    var x = s().appendTo(tc.append(' X: '));
    var y = s().appendTo(tc.append(' Y: '));

    $('#yourworld').mousemove(function(e) {
        var tile = $(document.elementFromPoint(e.pageX, e.pageY).closest('.tilecont')).data('tileyx').split(',');
        x.html(tile[1]);
        y.html(tile[0]);
    });
})();