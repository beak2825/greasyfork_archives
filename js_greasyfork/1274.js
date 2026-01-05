// ==UserScript==
// @name        Root.cz - zpruhledneni PR clanku
// @include     http://www.root.cz/
// @version     2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   monnef.tk
// @author      moen
// @description Tento skript zprůhlední PR články. Po najetí myši jsou zviditelněny.
// @downloadURL https://update.greasyfork.org/scripts/1274/Rootcz%20-%20zpruhledneni%20PR%20clanku.user.js
// @updateURL https://update.greasyfork.org/scripts/1274/Rootcz%20-%20zpruhledneni%20PR%20clanku.meta.js
// ==/UserScript==

// author of some code is root user Riff

function addStyle(style) {
    style = style instanceof Array ? style.join('\n') : style;
    $("head").append($('<style type="text/css">' + style + '</style>'));
}

var prClass = "adfix24711";
var prAnimLen = "0.5";

addStyle([
    '.' + prClass + ' {',
    '    -webkit-transition: opacity ' + prAnimLen + 's;',
    '    -moz-transition: opacity ' + prAnimLen + 's;',
    '    -ms-transition: opacity ' + prAnimLen + 's;',
    '    transition: opacity ' + prAnimLen + 's;',
    '    opacity: 0.05;',
    '}',
    '.' + prClass + ':hover {',
    '    opacity: 1;',
    '}'
]);

$(document).ready(function() {
    $("h4[class='admarker']").parent().addClass(prClass);
});