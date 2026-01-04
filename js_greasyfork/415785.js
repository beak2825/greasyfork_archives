// ==UserScript==
// @name         Add Copy Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a button that copy code to the clipboard
// @author       beet
// @match       *://judge.u-aizu.ac.jp/onlinejudge/review.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415785/Add%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/415785/Add%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
$(window).load(function() {
    $("#tab").append("<a  id=\"copy\" class=\"link\">Copy</a>");
    $("#tab").append("<a id=\"copyalert\" style=\"display:none;margin-left:100px;\">copied</a>");
    $("#tab").append("<div id=\"buf\"></div>");
    $('#copy').on('click', function(){
    let text = $("#code")[0].innerText;
        console.log(text);
    let buf = $('<textarea></textarea>');
    buf.text(text);
    $("#buf").append(buf);
    buf.select();
    document.execCommand('copy');
    buf.remove();
    $('#copyalert').show().delay(2000).fadeOut(400);
  });
  });
})();