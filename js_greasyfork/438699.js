// ==UserScript==
// @name Recreate old YouTube Footer!
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Brings Back the footer on YouTube!
// @author You
// @match https://www.youtube.com/*
// @icon https://www.google.com/s2/favicons?domain=youtube.com
// @run at document-end
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/438699/Recreate%20old%20YouTube%20Footer%21.user.js
// @updateURL https://update.greasyfork.org/scripts/438699/Recreate%20old%20YouTube%20Footer%21.meta.js
// ==/UserScript==

(function() {

'use strict';

var footer = document.createElement("footer_container");

footer.innerHTML = '<div id="footer-container" class="yt-base-gutter force-layer"><div id="footer"><div id="footer-main"><div id="footer-logo"><a href="/" id="footer-logo-link" title="YouTube home" data-sessionlink="ei=4yp_V7naAsvG-gOWjZmYDw&amp;ved=CAEQpmEiEwj515vhguPNAhVLo34KHZZGBvMojh4" class="yt-uix-sessionlink"><span class="footer-logo-icon yt-sprite"></span></a></div> <ul class="pickers yt-uix-button-group" data-button-toggle-group="optional"> <li> <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-has-icon" type="button" onclick=";return false;" id="yt-picker-language-button" data-button-menu-id="arrow-display" data-button-action="yt.www.picker.load" data-picker-key="language" data-picker-position="footer" data-button-toggle="true"><span class="yt-uix-button-icon-wrapper"><span class="yt-uix-button-icon yt-uix-button-icon-footer-language yt-sprite"></span></span><span class="yt-uix-button-content"> <span class="yt-picker-button-label">Language: </span> English</span><span class="yt-uix-button-arrow yt-sprite"></span></button> </li> <li> <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default" type="button" onclick=";return false;" id="yt-picker-country-button" data-button-menu-id="arrow-display" data-button-action="yt.www.picker.load" data-picker-key="country" data-picker-position="footer" data-button-toggle="true"><span class="yt-uix-button-content"> <span class="yt-picker-button-label">Country: </span> Worldwide</span><span class="yt-uix-button-arrow yt-sprite"></span></button> </li> <li> <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default" type="button" onclick=";return false;" id="yt-picker-safetymode-button" data-button-menu-id="arrow-display" data-button-action="yt.www.picker.load" data-picker-key="safetymode" data-picker-position="footer" data-button-toggle="true"><span class="yt-uix-button-content"> <span class="yt-picker-button-label">Restricted Mode: </span>Off</span><span class="yt-uix-button-arrow yt-sprite"></span></button> </li> </ul><a href="/feed/history" class="yt-uix-button footer-history yt-uix-sessionlink yt-uix-button-default yt-uix-button-size-default yt-uix-button-has-icon" data-sessionlink="ei=4yp_V7naAsvG-gOWjZmYDw"><span class="yt-uix-button-icon-wrapper"><span class="yt-uix-button-icon yt-uix-button-icon-footer-history yt-sprite"></span></span><span class="yt-uix-button-content">History</span></a> <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-has-icon yt-uix-button-reverse yt-google-help-link inq-no-click " type="button" onclick=";return false;" id="google-help" data-ghelp-tracking-param="" data-ghelp-anchor="google-help" data-load-chat-support="" data-feedback-product-id="59"><span class="yt-uix-button-icon-wrapper"><span class="yt-uix-button-icon yt-uix-button-icon-questionmark yt-sprite"></span></span><span class="yt-uix-button-content">Help</span></button> <div id="yt-picker-language-footer" class="yt-picker" style="display: none"> <p class="yt-spinner "> <span class="yt-spinner-img yt-sprite" title="Loading icon"></span> <span class="yt-spinner-message">Loading... </span> </p> </div> <div id="yt-picker-country-footer" class="yt-picker" style="display: none"> <p class="yt-spinner "> <span class="yt-spinner-img yt-sprite" title="Loading icon"></span> <span class="yt-spinner-message">Loading... </span> </p> </div> <div id="yt-picker-safetymode-footer" class="yt-picker" style="display: none"> <p class="yt-spinner "> <span class="yt-spinner-img yt-sprite" title="Loading icon"></span> <span class="yt-spinner-message">Loading... </span> </p> </div></div><div id="footer-links"><ul id="footer-links-primary"> <li><a href="//www.youtube.com/yt/about/">About</a></li> <li><a href="//www.youtube.com/yt/press/">Press</a></li> <li><a href="//www.youtube.com/yt/copyright/">Copyright</a></li> <li><a href="//www.youtube.com/yt/creators/">Creators</a></li> <li><a href="//www.youtube.com/yt/advertise/">Advertise</a></li> <li><a href="//www.youtube.com/yt/dev/">Developers</a></li> </ul><ul id="footer-links-secondary"> <li><a href="/t/terms">Terms</a></li> <li><a href="https://www.google.com/intl/en/policies/privacy/">Privacy</a></li> <li><a href="//www.youtube.com/yt/policyandsafety/">Policy &amp; Safety </a></li> <li><a href="//support.google.com/youtube/?hl=en" onclick="return yt.www.feedback.start(59);" class="reportbug">Send feedback</a></li> <li><a href="/testtube">Test new features</a></li> <li> <span class="copyright" dir="ltr">© 2022 YouTube, LLC</span></li></ul></div></div></div>'

document.querySelector("div#content").appendChild(footer);

var brain = document.createElement("brain");

brain.innerHTML = '<link rel="stylesheet" href="/s/player/1256b7e2/www-player-webp.css" name="player/www-player" class="css-httpswwwyoutubecomsplayer1256b7e2wwwplayerwebpcss"><link rel="stylesheet" href="/yts/cssbin/www-core-webp-vflmpaDFs.css" name="www-core" class="css-httpswwwyoutubecomytscssbinwwwcorewebpvflmpaDFscss"><link rel="stylesheet" href="/yts/cssbin/www-pageframe-webp-vflg6Dvof.css" name="www-pageframe" class="css-httpswwwyoutubecomytscssbinwwwpageframewebpvflg6Dvofcss"><link rel="stylesheet" href="/yts/cssbin/www-the-rest-webp-vflC_SdHT.css" name="www-the-rest" class="css-httpswwwyoutubecomytscssbinwwwtherestwebpvflC_SdHTcss"><link rel="stylesheet" href="/yts/cssbin/www-attribution-webp-vflhQnyPy.css" name="www-attribution" class="css-httpswwwyoutubecomytscssbinwwwattributionwebpvflhQnyPycss"><link class="css-httpswwwyoutubecomytscssbinwwwpageframedelayloadedwebpvflndjoDMcss" rel="stylesheet" href="https://www.youtube.com/yts/cssbin/www-pageframedelayloaded-webp-vflndjoDM.css" name="www-pageframedelayloaded"><script src="/yts/jsbin/www-core-vflVjSENF/www-core.js" type="text/javascript" name="www-core/www-core" class="js-httpswwwyoutubecomytsjsbinwwwcorevflVjSENFwwwcorejs"></script><script src="/yts/jsbin/spf-vflM_vz5X/spf.js" type="text/javascript" name="spf/spf" class="js-httpswwwyoutubecomytsjsbinspfvflM_vz5Xspfjs"></script>'

document.querySelector("head").appendChild(brain);

var brainjs = document.createElement("brainjs");

brainjs.innerHTML = '<script src="/yts/jsbin/www-core-vflVjSENF/www-core.js" type="text/javascript" name="www-core/www-core" class="js-httpswwwyoutubecomytsjsbinwwwcorevflVjSENFwwwcorejs"></script><script src="/yts/jsbin/spf-vflM_vz5X/spf.js" type="text/javascript" name="spf/spf" class="js-httpswwwyoutubecomytsjsbinspfvflM_vz5Xspfjs"></script>'

document.querySelector("head").appendChild(brainjs);

function addGlobalStyle(css) {

var head, style;

head = document.getElementsByTagName('head')[0];

if (!head) { return; }

style = document.createElement('style');

style.type = 'text/css';

style.innerHTML = css;

head.appendChild(style);

}

addGlobalStyle('#masthead{font-size: 13px;height: 40px;margin: 0 auto;overflow: hidden;padding: 0px 0;padding-bottom: 10px;position: relative;}');
 addGlobalStyle('.content.ytd-metadata-row-header-renderer { display: none !important; } ytd-metadata-row-renderer { margin: 0 !important; } #title.ytd-metadata-row-renderer { font-size: 11px !important; margin: 0 !important; } .content.ytd-metadata-row-renderer { font-size: 11px !important; font-weight: normal !important; }');

addGlobalStyle('#masthead, #masthead-subnav{width:auto!important;min-width:0px!imporant;}');

addGlobalStyle('html:not([dark="true"]) .ytcp-main-appbar {top:49px!important;}');

addGlobalStyle('[page-subtype="home"] ytd-two-column-browse-results-renderer, [page-subtype="trending"] ytd-two-column-browse-results-renderer, [page-subtype="subscriptions"] ytd-two-column-browse-results-renderer{margin-top:20px!important;top:-18px!important;position:relative!important;margin-bottom:125px!Important;}');

addGlobalStyle('body #footer-container{position:relative!important;}');

addGlobalStyle('.yt-base-gutter, .yt-unlimited #footer-container.yt-base-gutter{padding-left:245px;}');

addGlobalStyle('#footer-logo .footer-logo-icon {vertical-align: middle;background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl2T97zD.webp) -468px -156px;background-size: auto;width: 73px;height: 30px;}');

addGlobalStyle('#progress.ytd-thumbnail-overlay-resume-playback-renderer{background-color:transaprent!important}#progress{background:0 0!important}');

addGlobalStyle('div#content{top:0px!important}');

addGlobalStyle('div#primary{top:10px!important;position:relative}');

addGlobalStyle('div#primary-inner{padding-bottom:155px}')
    addGlobalStyle('ytd-item-section-renderer.ytd-section-list-renderer.style-scope:nth-of-type(1) h2.ytd-shelf-renderer.style-scope {bottom: 0px !important;position:relative} h2.ytd-shelf-renderer.style-scope {bottom: 6px !important;position:relative} ytd-browse[page-subtype="home"] #items.yt-horizontal-list-renderer {margin-bottom: 10px !important;} ytd-browse[page-subtype="home"] #contents > .ytd-shelf-renderer.style-scope {bottom: 20px !important;position:relative;margin-bottom: -8px } ytd-searchbox[system-icons] #search-icon-legacy.ytd-searchbox yt-icon.ytd-searchbox{ opacity:0.75; } .ytp-button:not([aria-disabled=true]):not([disabled]):not([aria-hidden=true]):nth-of-type(6){ display:none; } ytd-masthead[desktop-mic-background] #voice-search-button.ytd-masthead{ display:none!important; } div#bypass-notification{ font-size:13px!important; margin-bottom:10px; } #tooltip.tp-yt-paper-tooltip{ background:#000!important; padding:0 0px!important; line-height:10px!important; border-radius:2px!important; color:#fff!important; letter-spacing:0px; font-size:11px!important; } tp-yt-paper-tooltip{ background:#000!important; border-radius:2px!important; } /* tp-yt-paper-tooltip:before{ content:url("https://cdn.discordapp.com/attachments/778323864445779969/881610478814646292/img-1.png") } */ ytd-comments-header-renderer span#sort-menu{ z-index:2019!Important; } #watch7-sidebar{ left:-13px!important; } #newness-dot.ytd-guide-entry-renderer{ width:0px; height:0px; } #newness-dot.ytd-guide-entry-renderer:after{ content:"1"; position:relative!important; font-size:11px!Important; top:-13px!important; } .yt-pl-thumb-link .yt-pl-thumb-overlay{ width:168px!Important; left:5px!important; } #guide-icon.ytd-app, #guide-icon.ytd-masthead{ opacity:1!important; left:3px!important; } yt-formatted-string.title.style-scope.ytd-guide-entry-renderer{ color:#000!important; } html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover{ background-color:#f00!Important; } .guide-icon.ytd-guide-entry-renderer{ margin-right:10px!important; } ytd-thumbnail-overlay-bottom-panel-renderer.style-scope.ytd-thumbnail{ display:none; } yt-icon.ytd-topbar-logo-renderer{ width:100px!important; height:30px!Important; left:8px!Important; } ytd-searchbox.ytd-masthead{ padding: 0 1; } ytd-thumbnail-overlay-resume-playback-renderer{ display:none!important; } ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block span:nth-of-type(2){ display:block!important; } #metadata-line.ytd-video-meta-block > .ytd-video-meta-block:not(:last-of-type):after { content: "•"!important; } ytd-thumbnail-overlay-time-status-renderer{ margin-bottom: 2px; top:7px!important position:relative; margin-right: 2px; padding: 0 4px; font-weight: 500; font-size: 11px; line-height:-5px!important; background-color: #000; color: #fff!important; height: 14px; line-height: 14px; opacity: .75; filter: alpha(opacity=75); display: -moz-inline-stack; vertical-align: top; display: inline-block; border-radius:initial; } ytd-rich-item-renderer[content-visibility-optimization]:hover ytd-thumbnail-overlay-time-status-renderer{ display:none; } #voice-search-button.ytd-masthead{ display:none!important; } #unhearted.ytd-creator-heart-renderer{ opacity:0.5!important; } div#movie_player{ background:#000!important; } `); }')
addGlobalStyle('div#footer.style-scope.ytd-guide-renderer { display: none; }')
})();
