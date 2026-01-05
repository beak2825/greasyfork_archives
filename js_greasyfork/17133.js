// ==UserScript==
// @name         Vbox7 - Play in a window
// @namespace    vbox7_piaw
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        http://www.vbox7.com/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17133/Vbox7%20-%20Play%20in%20a%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/17133/Vbox7%20-%20Play%20in%20a%20window.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var css = '<style type="text/css">' +
             "#play-separate { display: block; padding: 0 8px; height: 30px; float: left; font-family: 'PT Sans Caption', sans-serif; font-size: 14px; line-height: 30px !important; background-color: #f4f4f4; border: 1px solid #d4d4d4; border-radius: 1px 1px 1px 1px; -moz-border-radius:1px; -webkit-border-radius:1px; -o-border-radius: 1px; color: #414141; margin: 0px 10px 0px 0px; }" +
             "#play-separate:hover { background-color: #459eed; border: 1px solid #407ce5; color: #ffffff; text-decoration: none; cursor: pointer; }" +
          '</style>';

$(css).appendTo('head');

var textarea = $('.embed-opt-desc textarea');
var row = $('.play-row-controls');

if (textarea.length > 0) {
    var a = $('<a href="#" id="play-separate">Отдели в прозорец</a>');
    a.click(function() {
        var html = '<html><head><style>html, body { margin: 0; }</style></head><body>' + $(textarea.get(0)).text().replace(/width\=\"(\d+)\"/i, 'width="100%"').replace(/height\=\"(\d+)\"/i, 'height="100%"') + '</body></html>';
        var uri = "data:text/html," + encodeURIComponent(html);
        window.open(uri);
    });
    row.prepend(a);
}