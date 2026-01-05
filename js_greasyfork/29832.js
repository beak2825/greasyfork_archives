// ==UserScript==
// @name         Banh bím FPT Play
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Như tít :)
// @include      /^https?://fptplay\.net/livetv.*$/
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/29832/Banh%20b%C3%ADm%20FPT%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/29832/Banh%20b%C3%ADm%20FPT%20Play.meta.js
// ==/UserScript==
var x = $('a[onclick="showLogin()"]').get()>-1;
if (x===true) {
    $('.page-loading').hide();
    $(".col-sm-4.col-lg-4.pull-left.calendar.fix_padding_slider_right").appendTo( $(".player_title.Regular .row"));
    var css = '.col-sm-4.col-lg-4.pull-left.calendar.fix_padding_slider_right { padding-top: 0px!important; padding-left: 65px!important; width: 100%!important; } #player-wrapper-livetv{ width:94%!important; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}