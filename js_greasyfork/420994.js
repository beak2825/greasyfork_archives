// ==UserScript==
// @name         Rushers.dk temp theme
// @namespace    rushersTmpTheme
// @version      0.3
// @description  try to take over the world!
// @author       johnnie johansen
// @match        https://rushers.dk/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.3/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420994/Rushersdk%20temp%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/420994/Rushersdk%20temp%20theme.meta.js
// ==/UserScript==


// http://www.greasespot.net/2012/08/greasemonkey-10-jquery-broken-with.html
this.$ = this.jQuery = jQuery.noConflict(true); // GM/jQ v1.0 quickfix

rushersFix();

function rushersFix()
{
    var rushRed = '#c13b37';

    var fontSize14 = '.bbp-topic-freshness, .bbp-author-name';

    var makeButton = '.bsp-new-topic a, a.subscription-toggle, .button, button, input[type=button], a.favorite-toggle';
    var makeButtonHover = '.bsp-new-topic a:hover, a.subscription-toggle:hover, .button:hover, button:hover, input[type=button]:hover, a.favorite-toggle:hover';

    $('body').append(
        '<style>' +
        fontSize14 + '{ font-size:14px !important; }' +
        '.page-nav a{ border:0px !important; }' +
        'a{ color:#EEE !important; } a:hover{ color: #a00000 !important; }' +
        '.status-publish p a{ color: #AAA !important; }' +
        '.main > .loop-meta-wrap { text-align:left; }' +
        '.bbp-template-notice { padding:4px !important; }' +
        '.bbp-template-notice.info, .bbp-forum-description{ font-size:14px !important; }' +
        makeButton + '{ background:#EEE !important;color:#222 !important;display:inline-block !important;font-size:16px !important;padding:8px !important;text-decoration:none !important; border-radius: 6px !important; }' +
        makeButtonHover + ' { background: #666 !important; color:#EEE !important; }' +
        // form/create topic
        '#wp-bbp_topic_content-editor-container input, #qt_bbp_reply_content_toolbar input { margin-right:3px !important }' +
        'input[type=text], input[type=email], input[type=password], input[type=number], input[type=data], textarea, select { display:block !important; width:100% !important; border-color:#EEE !important; font-size:16px !important; }' +
        '.widget li a:first-of-type:before { content: " # "; color: ' + rushRed + '; }' +
        '.gdpol-topic-poll{ color:#222 !important; display: block; margin-top:15px !important; background: none !important; color:#EEE !important; border:0 !important; border-bottom:2px dashed #EEE !important; }' +
        '.gdpol-topic-poll header, .gdpol-topic-poll footer { background:#333 !important; }' +
        '.gdpol-topic-poll header h2:before { content: "Afstemning: " }' +
        '.gdpol-response-bar { border:0 !important; }' +
        '.gdpol-response-percent, .gdpol-response-votes { color: #222 !important; }' +
        '.gdpol-footer-voters{ font-size:24px !important }'+
        '.bbp-topic-content p, .bbp-reply-content p { line-height: 1.8; } ' +
        '#bbp-search-form input{ font-size:22px !important; padding:8px !important; height: auto !important; border-radius: 6px !important; }' +
        '#bbp-search-form input[type=submit]{ font-size:18px !important; padding:16px 16px !important; height: 100% !important; color:#EEE !important; }' +
    '</style>');

    let votes = $('.gdpol-footer-voters strong').html();
    $('.gdpol-footer-voters').replaceWith('<div class="gdpol-footer-voters">Stemt: ' + votes + '</div>');
}

