// ==UserScript==
// @name         DailyRush V5 Darkside theme
// @namespace    dailyDarkside
// @version      0.1
// @description  try to take over the world!
// @author       johnnie johansen
// @match        http://www.dailyrush.dk/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.12.3/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19750/DailyRush%20V5%20Darkside%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/19750/DailyRush%20V5%20Darkside%20theme.meta.js
// ==/UserScript==


// http://www.greasespot.net/2012/08/greasemonkey-10-jquery-broken-with.html
this.$ = this.jQuery = jQuery.noConflict(true); // GM/jQ v1.0 quickfix

dailyrushDarkSide();

function dailyrushDarkSide()
{
    var headers = 'h1, h2, h3, h4, h5, h6';
    var sticky_class = '#bbpress-forums .bbp-body .super-sticky, #bbpress-forums .bbp-body .sticky, .comments .comment-form .submit, [type="submit"]';
    var darkBg = '.odd, .even, .message-content p, .td-category-header, .status-publish, .sticky, .td-header-sp-recs,.td-main-content-wrap, .td-category-grid, .bbp-body div, .bbp-topic-author, .td_block_mega_menu, .td_mega_menu_sub_cats, .td-mega-row *, .type-forum *, ul.even, ul.odd';
    var lightFont = '.odd, .even, .message-content p, strong, span, label, .label, .status-publish p, .sticky, span, quote, .topic, ' + headers;
    var darkFont = '.indicator-hint';

    $('body').append(
        '<style>' +
        '.page-nav a{ border:0px !important; }' +
        'a{ color:#DDD !important; } a:hover{ color: #a00000 !important; }' +
        '.status-publish p a{ color: #D00000 !important; }' +
        darkBg + "{ background:#242424 !important; }" +
        lightFont + "{ color: #FFF !important; }" +
        darkFont + "{ color: #242424 !important; }" +
        sticky_class + "{ border:1px solid #fff !important; background:#111 !important; }" +
    '</style>');
}
