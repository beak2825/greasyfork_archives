// ==UserScript==
// @name         Github color preview
// @author       Afzal Najam
// @namespace    http://afzaln.com/
// @version      1.0
// @description  Adds colour to github gutter if the line contains a hex color code
// @match        https://*.github.com/*
// @copyright    2014+, Afzal Najam
// @downloadURL https://update.greasyfork.org/scripts/4034/Github%20color%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/4034/Github%20color%20preview.meta.js
// ==/UserScript==

rows = $('.file > .blob-wrapper > table > tbody > tr');
GM_addStyle ( ".blob-line-num { width:6% !important }" );
rows.each(function (index) {
    lineNum = $(this).find('.blob-line-num');
    lineText = $(this).find('.blob-line-code').text();
    var patt = /#([0-9A-F]{2})?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;
    var colors = patt.exec(lineText);
    if (colors != null) {
//        GM_log(colors);
        if (colors[1]) {
          var opacity = parseInt(colors[1], 16)/255;
        } else {
            var opacity = 1;
        }
        var r = parseInt(colors[2], 16);
        var g = parseInt(colors[3], 16);
        var b = parseInt(colors[4], 16);
        var colordiv = "<div style=\"float:left; display:inline; background: rgb(" + r + "," + g + "," + b + "); opacity: " + opacity + "; height: 14px; width: 8px\"></div>";
        lineNum.append(colordiv);
    }
});
