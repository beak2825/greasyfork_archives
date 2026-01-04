// ==UserScript==
// @name         easy text colour
// @namespace    https://animebytes.tv/*
// @version      0.1
// @description  one button text colour
// @author       Destinnyy
// @match        https://animebytes.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474534/easy%20text%20colour.user.js
// @updateURL https://update.greasyfork.org/scripts/474534/easy%20text%20colour.meta.js
// ==/UserScript==

var textcolour = 'red';

(function() {
    'use strict';
    function ButtonClickAction() {
        var text1 = document.getElementById('quickpost').value;
        document.getElementById('quickpost').value = '[color='+textcolour+']' + text1 +'[/color]';
};

    var bb = document.getElementById('bbcode');
    bb.innerHTML += '<img src="/static/common/symbols/color-0bc017a2c1.png" title="Color" alt="Color" id="addcolor">';
    document.getElementById ("addcolor").addEventListener (
    "click", ButtonClickAction, false
);
})();