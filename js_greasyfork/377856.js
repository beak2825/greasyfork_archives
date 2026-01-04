// ==UserScript==
// @name            SmartChute
// @version         20.8.28
// @description     BitChute.com Enhancer. Adds missing features. Makes you feel warm.
// @license         MIT
// @author          S-Marty
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @namespace       https://github.com/s-marty/SmartChute
// @homepageURL     https://github.com/s-marty/SmartChute
// @supportURL      https://github.com/s-marty/SmartChute/wiki
// @icon            https://raw.githubusercontent.com/s-marty/SmartChute/master/images/smartChute2.png
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QHFFSLZ7ENUQN&source=url
// @include         /^https?://www\.bitchute\.com.*$/
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.info
// @grant           GM.xmlHttpRequest
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/377856/SmartChute.user.js
// @updateURL https://update.greasyfork.org/scripts/377856/SmartChute.meta.js
// ==/UserScript==

// @compatible  Firefox 16+, Chrome 36+, Opera 15+, Brave 1.0.1+, Vivaldi 2.2+
// @compatible  TamperMonkey 4.10+, ViolentMonkey 2.12+, Greasemonkey 4.7+

/* greasyfork.org jshint syntax checking hacks */
/* jshint asi: true */
/* jshint boss: true */
/* jshint esversion: 6 */
/* jshint loopfunc: true */
/* jshint multistr: true */

/** **********************   Features   **********************
*** Accelerated Bit Chute user experience ahead
*** Floating mini video player is visible when scrolling
*** Floating mini video player position is draggable
*** Floating mini video player size is mouse resizeable
*** Downloader for your favorite videos and posters.
*** Up to 25 playlist choices in sidebar when viewing playlists.
*** Blacklist annoying channels with one click if enabled
*** De-blacklist channels with two clicks using Smarty menu
*** Double-click the Smarty menu button for additional options.
*** Unfix top header to show only while up-scrolling
*** Hide the upper channel carousel using Smarty menu
*** Hide unsafe ads to avoid viruses or other malware
*** Hide or unhide comments section - make up your own mind  or not
*** Scrolls down to video player automatically if header is unfixed
*** Seek by single frame using <> (,.) keys while video is paused.
*** Mouse-over the progress bar for frame preview. (not for slow conn.)
***   *Requires ~8mB additional bandwidth for a 640x360 video.
*** Volume indicator visible when using ↑↓ keys.
*** Full screen forward/back navigation, autoplay or not.
*** Take and edit a downloadable screenshot of the current video frame.
*** Autoplay videos or not is now selectable
*** Video volume is persisted - No More 100% volume on the first play
*** Theme night/day is persisted when clicking the sun/moon icon
*** Three additional night themes for your tired eyes
*** Play Next persists when clicking the "PLAYING NEXT" button
*** Persistence lasts across browser instantiations too
*** Top ten most viewed channel video playlist on video page option
*** Channel owner-created playlists displayed on video page option
*** 32 More video choices on Video watch page vs. 6
*** Unlimited video choices using "SHOW MORE" button, vs. 6
*** OpenSearch browser search to search from address or search bar
*** Rss channel feed subscribe link (Browser extension now needed)
***   All browsers have now dropped live bookmarks/rss feeds
***   The rss url format is:
***   https://www.bitchute.com/feeds/rss/channel/[CHANNEL_NAME]/
***          Smarty menu always available

***  ***  Does not & will not work well with IE and IEdge  ***/

/* Editable options */
const BC_Debug = false;
/* End Editable options */


(function() {
    "use strict";

const w = window;
const d = document;
const name = "SmartChute";
const scriptHandler = GM.info.scriptHandler;
const isChrome = navigator.userAgent.indexOf('Chrome') !=-1;
const BC = {

    miniPlayerX: 0,
    miniPlayerY: 0,
    miniPlayerW: 0,
    miniPlayerH: 0,
    startButton: 0,
    isFullScreen: false,
    listingsAllHeight: 0,
    listingsPopHeight: 0,
    miniSiz: {h: 0, hd: 0},
    miniPos: {x:0,y:0,xd:0,yd:0},
    origVid: {w:698,h:393,r:1.778},
    miniplayer: { x:0,y:0,w:350,h:197 },


    chuteMePlease: (e) => {

        BC.url          = w.location.href;
        BC.host         = w.location.hostname;
        BC.path         = w.location.pathname;
        BC.searchpage   = BC.url.indexOf('/search') !=-1;
        BC.watchpage    = BC.path.indexOf('/video') !=-1;
        BC.profilepage  = BC.path.indexOf('/profile/') !=-1;
        BC.channelpage  = BC.path.indexOf('/channel/') !=-1;
        BC.categorypage = BC.path.indexOf('/category/') !=-1;
        BC.playlistpage = BC.path.indexOf('/playlist/') !=-1;
        BC.homepage     = BC.url.match(/^https?:\/\/www\.bitchute\.com\/?$/);
        if (BC.watchpage && BC.url.indexOf('list=') !=-1) BC.playlist = BC.url;
        else if (BC.watchpage && qs(".sidebar-next a") && qs(".sidebar-next a").href.indexOf('list=') !=-1) BC.playlist = qs(".sidebar-next a").href;
        else BC.playlist = null;

        if (!BC.loaded) {
            if (!BC.loader) {
                if (BC.loader = qs("title")) {
                    addListener(BC.loader, (e) => {
                        if (isChrome && BC.settings.hidemenubar) {
                            if (! document.activeElement.href) {w.scrollTo(0, 0)}
                        }
                        BC.chuteMePlease(e);
                    },{ childList: true });
                }
                qs("#loader-container").addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    w.stop();
                    e.target.style.display = "none";
                }, false);
            }
            if (! (BC.homepage || BC.watchpage || BC.channelpage || BC.categorypage || BC.profilepage || BC.searchpage || BC.playlistpage)) return;
            if (!BC.themes) {
                setTimeout(BC.addThemeListeners, 2000);
                if (isChrome && BC.settings.hidemenubar) {
                    w.addEventListener('beforeunload', function(e){
                      if (!document.activeElement.href){w.scrollTo(0, 0)}
                    }, false);
                }
                BC.setTheme();
                BC.setPreferencesCookie("autoplay", BC.settings.playnext);
                BC.themes = true;
            }
            if (BC.searchpage || BC.profilepage || BC.playlistpage) return;
            let style = dce("style");
            style.type = "text/css";
            style.innerText = `
                .nav-tabs-list {min-width: 500px !important; width: 100%;} .sidebar-recent .video-card.active {box-shadow: 0 0 1em 0.2em #f37835; border-radius:5px;} .playlist-card.active {border-top: 1px solid #f37835bb; box-shadow: 0 2px 1em 0.2em #f37835; border-radius:5px;}
                svg.smarty-donate {float:right;cursor: pointer; color:#209227;display: block;}  svg.smarty-donate:hover {-webkit-transform:rotate(14deg) scale(1.2);-khtml-transform:rotate(14deg) scale(1.2);transform:rotate(14deg) scale(1.2);color:#30a247;}
                #loader-container {opacity: 0.5;} span.add-to-blacklist { position: absolute; top: 4px; left: 4px; z-index: 50; width:30px; height:30px; } a.side-toggle {cursor: pointer; }
                svg.smarty-donate {-webkit-transition: transform 0.25s ease-in, color 0.25s; -moz-transition: transform 0.25s ease-in, color 0.25s; -khtml-transition: transform 0.25s ease-in, color 0.25s; transition: transform 0.25s ease-in, color 0.25s;}
                span.blacklist-tooltip { position: absolute; font-size: 14px;padding: 0 4px; height: 22px; left: 2px; top: 38px; line-height: 1.6; background-color: #000 ;display:none;} #smarty_tab label:hover, #smarty_tab #blacklistedchannels span:hover {color:#ef4136;}
                #smarty_tab #smartymm > div, #smarty_tab #blacklistedchannels, #smarty_tab #smartyam {padding: 8px; border: 1px solid #333; border-radius:3px;} #smarty_tab #blacklistedchannels span{width: 137px; max-height: 16px;cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;}
                span.add-to-blacklist svg {cursor: pointer;} html.noblacklist span.add-to-blacklist {display:none;} #channel-list div.item div.channel-card:hover .add-to-blacklist {opacity: 1;} .video-views, .video-duration {color: #272727; opacity: 0.8;}
                span.add-to-blacklist:hover span.blacklist-tooltip { color:#fff; display:inline; } #carousel {${BC.settings.hidecarousel ? "display:none" : "width: 100%; min-height: 210px"};} .plyr__tooltip {color: #000;}
                #carousel .hidden-md > div .channel-card:hover .action-button {opacity:1;} .channel-banner .name a.userisblacklisted {text-decoration: line-through red;} .night .video-views, .night .video-duration {color: #dbdbdb;} html.night .jquery-comments .textarea-wrapper .textarea {background-color: #000 !important;}
                .night .jquery-comments ul.main li.comment .comment-wrapper {border-top-color: #dddddd33 !important;}, .channel-banner .name .add-to-blacklist {position: relative;left: 10px;} .channel-banner .name:hover .add-to-blacklist {opacity: 1;}
                .smartybox { position: relative; display: block; width: 100%; } .smartybox:nth-child(2) {  width: 132px; } .smartybox input[type="checkbox"], .smartybox input[type="radio"] { width: auto; opacity: 0.00000001; position: absolute; left: 0; margin-left: -20px; }
                .cbhelper, .radiohelper { top: -4px; left: -8px; display: block; cursor: pointer; position: absolute; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none;} .cbhelper:before, .radiohelper:before { content: ''; position: absolute; left: 0; top: 0;
                  margin: 6px; width: 18px; height: 18px; transition: transform 0.28s ease; border-radius: 5px; border: 1px solid #4d4b4e; }
                .radiohelper:before { border-radius: 9px; } .radiohelper.r1:before { left: 48px; } .radiohelper.r2:before { left: 88px; } .radiohelper.r3:before { left: 128px; } .cbhelper:after, .radiohelper:after { content: ''; display: block; width: 10px; height: 5px;
                  border-bottom: 2px solid #7bbe72; border-left: 2px solid #7bbe72; -webkit-transform: rotate(-45deg) scale(0); -moz-transform: rotate(-45deg) scale(0); -khtml-transform: rotate(-45deg) scale(0); transform: rotate(-45deg) scale(0); position: absolute; top: 12px; left: 10px; }
                .radiohelper.r1:after { left: 58px; } .radiohelper.r2:after { left: 98px; } .radiohelper.r3:after { left: 138px; } .smartybox input[type="checkbox"]:checked ~ .cbhelper::before, .smartybox input[type="radio"]:checked ~ .radiohelper::before { color: #7bbe72;
                  background: linear-gradient(to bottom, #d5d1d833 0%, #93919566 100%)}
                .smartybox input[type="checkbox"]:checked ~ .cbhelper::after, .smartybox input[type="radio"]:checked ~ .radiohelper::after { -webkit-transform: rotate(-45deg) scale(1); -moz-transform: rotate(-45deg) scale(1); -khtml-transform: rotate(-45deg) scale(1); transform:rotate(-45deg) scale(1); }
                .smartybox label { cursor: pointer; padding-left: 25px; white-space: nowrap;} .smartybox.radios label { padding-left: 0px; } .smartybox.radios label.r1 { margin-left: 14px; color:#f0af5a !important; } .smartybox.radios label.r2 { margin-left: 18px; color: #559bcc !important; }
                .smartybox.radios label.r3 { margin-left: 18px; color:#55a47c !important; } .smartybox input[type="checkbox"]:focus + label::before, .smartybox input[type="radio"]:focus + label::before { outline: rgb(59, 153, 252) auto 5px; }
                .sidebar-recent .playlist_sidebar {margin-bottom: 14px;-webkit-transition: all 1s cubic-bezier(1, 1, 0.5, 1); -moz-transition: all 1s cubic-bezier(1, 1, 0.5, 1); transition: all 1s cubic-bezier(1, 1, 0.5, 1);}
                .sidebar-recent .playlist_sidebar.slidein {overflow: hidden; max-height: 0px !important; } .sidebar-heading.playlists {position: relative; cursor: pointer; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none;}
                .sidebar-heading.playlists:after {content: ''; display: block; position: absolute; right: 6px; bottom: 15px; width: 0; height: 0; border-bottom-width: 10px; border-bottom-style: solid; border-top: 10px solid transparent; border-left: 10px solid transparent; border-right: 10px solid transparent; }
	            .sidebar-heading.playlists:after {border-bottom-color: white;} .sidebar-heading.playlists:hover:after {border-bottom-color: lightgray;} .sidebar-heading.playlists:after {-webkit-transition: all 0.5s ease; -moz-transition: all 0.5s ease; transition: all 0.5s ease;}
                .sidebar-heading.playlists.slidein:after {content: ''; display: block; position: absolute; right: 6px; bottom: 5px; width: 0; height: 0; border-top-width: 10px; border-top-style: solid; border-bottom: 10px solid transparent; border-left: 10px solid transparent; border-right: 10px solid transparent; }
	            .sidebar-heading.playlists.slidein:after {border-top-color: white;} .sidebar-heading.playlists.slidein:hover:after {border-top-color: lightgray;} .plyr.plyr--hide-controls {cursor:none}
	            #volumometer {position: absolute;right: 40px;width: 20px;height: calc(100% - 120px);bottom: 40px;border: 2px solid #aaa;border-right-color: #888;display: flex;background: linear-gradient(to right, #000 0%, #111 60%, #111 60%, #333 100%);opacity: 0;transition: opacity 2s;}
	            #volumometer.change {opacity: 0.8;transition: 0.1s;} #volumometer .vol {bottom: 0px;width: 100%;height: 0px;position: absolute;transition: height 0.1s ease-in 0s;box-shadow: 2px 0px 2px #555;background: linear-gradient(to right, #cdcdcd 0%, #fff 50%, #fff 50%, #888 100%);}
                #volumometer .percent {position: absolute;right: -30px;width: 80px;height: 80px;top: -60px;text-align: center;color: #333333dd;font-weight: bold;font-size: 2em;text-shadow: 1px 1px #dddddd;pointer-events: none;}
                #volumometer .percent::after {content: "";display: block;position: absolute;width: 100%;height: 100%;bottom: 15px;left: 0;pointer-events: none;background-image: radial-gradient(circle, #555 10%, #cacaca 20%, transparent 10.01%);background-position: 50%;transform: scale(0, 0);opacity: 0;transition: 0s;}
                #volumometer.change .percent:after {transform: scale(6, 4);opacity: .2;transition: transform .5s, opacity .35s;}
                .plyr #autoplay-details {z-index:22; color:#ee3333 !important;} .plyr.plyr--paused button.plyr__control--overlaid.plyr__control--pressed[aria-label="Play"] {opacity:0;visibility:hidden;}
                #autoplay-next {position:absolute;width: 800px;top: 50%;left: 50%;margin: -100px 0 0 -400px;z-index: 1;} #autoplay-next .video-card-image {width: 240px; height: 135px;opacity: .9;} #autoplay-next .video-card-image .img-responsive:first-child {opacity: .9; border-radius: 10px;}
                #autoplay-next .video-card-text {max-height:88px;} #autoplay-next .video-card-title {font-size: 12px;height: 45px;max-height: 45px;overflow: hidden;} #autoplay-next .video-card-published {font-size: 12px;margin: 2px 0;}
                #autoplay-next .video-card {position:absolute;width: 240px;border-radius: 10px;opacity:.9;background:#211f22;box-shadow: 1em 1em 1em 0.7em #000000a0, -0.05em -0.05em 0.1em 0.1em white;}
                .autoplay-prev {left:0px;} .autoplay-prev img.play-overlay {width: 64px !important;height: 64px !important;transform: scaleX(-0.7) !important;} .autoplay-prev:hover img.play-overlay {transform: scaleX(-1) !important;}
                .autoplay-next {right:0px;} .autoplay-next img.play-overlay {width: 64px !important;height: 64px !important;transform: scaleX(0.7) !important;} .autoplay-next:hover img.play-overlay {transform: scaleX(1) !important;}
                #bcframes {opacity: 0; height: 90px; position: absolute; border-radius: 3px; border: 1px solid #555; background-color: #222222aa; overflow: hidden; transform: translate(50%,10px) scale(0); transform-origin: -50% 100%; transition: transform .2s .1s ease,opacity .2s .1s ease; z-index: 130;}
                #bcframes.visible {opacity: 1; transform: translate(0,0) scale(1); transform-origin: 50% 100%; transition: transform .2s .1s ease,opacity .2s .1s ease;}
                #screenshot {transition: opacity .5s; background: #222222b3; text-align: center; position: fixed; overflow: hidden; z-index: 2000; opacity: 1; bottom: 0; right: 0; left: 0; top: 0;}
                #screenshot canvas {top: 50%; z-index: 2001; max-width: 80%; max-height: 80%; position: relative; transform: translateY(-50%); box-shadow: 1em 1em 1em 0.7em #000000a0, -0.01em -0.01em 0.03em 0.03em #aaa;} #screenshot .action {left: calc(50% - 114px); position: absolute;
                  width: 228px; height: 74px; top: 70%; border-radius: 7px; background: linear-gradient(to top, #ffffff88 10%, #22222288 60%); border-color: #222 #555 #555 #222; border-width: 1px; border-style: solid; border-bottom-right-radius: 39px; border-bottom-left-radius: 39px;}
                #screenshot .cancel, #screenshot .save, #screenshot .edit {width: 100px; height: 28px; display: inline-block; background: linear-gradient(to bottom, #333 0%, #000 100%); border: 1px solid #555; border-radius: 5px; text-align: center; line-height: 1.8em; margin: 6px; cursor: pointer;
                  box-shadow: 0.5em 0.5em 1em 0.1em #00000070, -0.02em -0.02em 0.03em 0.03em #aaaaaaaa;} #screenshot .save a {width: 100%; height: 100%; display: block;} a#takeScreenShot.disabled {pointer-events: none; opacity: 0.3; cursor: default;} #screenshot .cancel:hover, #screenshot .save a:hover {color:#d01105;}
                #screenshot .edit {width: 28px; font-weight: bold; font-size: 18px; line-height: 1.5em; margin: 2px 4px;} #screenshot .action .edit.two {opacity:0; position: absolute; top: 4px;}
                #screenshot #editInfo {z-index: 2005; cursor: default; font-size: 22px; padding-left: 1px; line-height: 1.1em; position: absolute; border-radius: 14px; margin: 24px 0 0 28px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; box-shadow: 1em 1em 1em 0.1em #00000090;}
                #screenshot #editInfo:hover:after {top: 100%; z-index: 2011; width: 200px; font-size: 14px; margin-top: 10px;
                  padding: 4px 6px; color: #ffffffdd; position: absolute; border-radius: 4px; content: attr(data); background: linear-gradient(to top, #22222288 10%, #00000088 60%); transform: translateX(-90%); border: 2px solid #555555aa; box-shadow: 0.5em 0.5em 1em 0.2em #000000a0;}
                #screenshot .action {opacity: 1; z-index: 2010; cursor: move; -webkit-transition: height .5s, opacity .5s; -moz-transition: height .5s, opacity .5s; transition: height .5s, opacity .5s;}
                #screenshot .action .cancel, #screenshot .action .save, #screenshot .action .edit {visibility: visible; -webkit-transition: visibility 0s, opacity 0.5s linear; -moz-transition: visibility 0s, opacity 0.5s linear; transition: visibility 0s, opacity 0.5s linear;
                  user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none;} #screenshot .action.gone {height:40px !important;}
                #screenshot .action .cancel.gone, #screenshot .action .save.gone {opacity: 0; visibility: hidden; transition: visibility 0s 0.5s, opacity 0.5s linear}
                #screenshot .action .edit.one.gone {opacity:0 !important; visibility: hidden; width:0px !important; transition: visibility 0s 0.5s, opacity 0.5s linear}
                #screenshot .action .edit.two {opacity:1;}
                #screenshot .action .edit.disabled, #screenshot .action input#zoomfactor[disabled] {pointer-events: none; opacity: 0.5; cursor: default;}
                #screenshot .action .edit.two.gone {opacity:0 !important; visibility: hidden; transition: visibility 0s 0.5s, opacity 0.5s linear}
                #screenshot .action input#zoomfactor {width:75px; margin-left: -8px;} #screenshot .action input#zoomfactor.gone {display: none}
                .drag_resize {z-index: 2003; display: none; position: absolute;} .drag_resize.active {display: block;}
                .drag_resize_overlay, .drag_resize_overlay tbody {width: 100%; height: 100%; z-index: 2004; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none;}
                .drag_resize_overlay td {border-width: 0px;} .drag_resize_overlay td.corner {width: 21px; height: 21px;${(isChrome) ? ' display: -webkit-box;' : ''}}
                .drag_resize_overlay td.corner.tl {cursor: nwse-resize; border-left: 1px solid #eeeeeeaa; border-top: 1px solid #eeeeeeaa;} .drag_resize_overlay td.corner.tr {cursor: nesw-resize; border-top: 1px solid #eeeeeeaa; border-right: 1px solid #eeeeeeaa;}
                .drag_resize_overlay td.corner.br {cursor: nwse-resize; border-right: 1px solid #eeeeeeaa; border-bottom: 1px solid #eeeeeeaa;} .drag_resize_overlay td.corner.bl {cursor: nesw-resize; border-bottom: 1px solid #eeeeeeaa; border-left: 1px solid #eeeeeeaa;}
                .drag_resize_overlay td.cropper.ct {height: 21px; cursor: ns-resize; border-left: 1px solid #eeeeeeaa; border-top: 1px solid #eeeeeeaa; border-right: 1px solid #eeeeeeaa; color: #fff; font-size: 14px; overflow: hidden; text-align: center;}
                .drag_resize_overlay td.cropper.cr {width: 21px; cursor: ew-resize; border-top: 1px solid #eeeeeeaa; border-right: 1px solid #eeeeeeaa; border-bottom: 1px solid #eeeeeeaa;}
                .drag_resize_overlay td.cropper.cb {height: 21px; cursor: ns-resize; border-right: 1px solid #eeeeeeaa; border-bottom: 1px solid #eeeeeeaa; border-left: 1px solid #eeeeeeaa; color: #fff; font-size: 14px; overflow: hidden; text-align: left; padding-left: 15px;}
                .drag_resize_overlay td.cropper.cl {width: 21px; cursor: ew-resize; border-bottom: 1px solid #eeeeeeaa; border-left: 1px solid #eeeeeeaa; border-top: 1px solid #eeeeeeaa;}
                .drag_resize_overlay td.corner:hover, .drag_resize_overlay td.cropper:hover {background-color:#ffffff1a;} .drag_resize_overlay td.dragger {cursor: move; overflow: visible; display: inline-flex; scrollbar-width: none;
                background-image: linear-gradient(90deg, #eeeeeeaa 50%, #11111199 50%), linear-gradient(90deg, #eeeeeeaa 50%, #11111199 50%), linear-gradient(0deg, #eeeeeeaa 50%, #11111199 50%), linear-gradient(0deg, #eeeeeeaa 50%, #11111199 50%);
                background-repeat: repeat-x, repeat-x, repeat-y, repeat-y; background-size: 15px 1px, 15px 1px, 1px 15px, 1px 15px; background-position: left top, right bottom, left bottom, right top; animation: borderline 1s infinite linear;}
                @keyframes borderline {0% {background-position: left top, right bottom, left bottom, right top;} 100% {background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;}} .drag_resize_overlay td.dragger::-webkit-scrollbar {display: none;}
                input#zoomfactor[type=range] {-webkit-appearance: none; margin-left: 100px; width: 100px;} input#zoomfactor[type=range][disabled] {opacity: .2; cursor: default;} input#zoomfactor[type=range]:focus {outline: none;}
                input#zoomfactor[type=range]::-webkit-slider-runnable-track {width: 100%; height: 6px; cursor: pointer; animate: 0.2s; box-shadow: 1px 1px 1px #000000; background: #aaaaaa77; border-radius: 5px; border: 1px solid #000000;}
                input#zoomfactor[type=range]::-webkit-slider-thumb {box-shadow: 1px 1px 1px #000000; border: 1px solid #000000; height: 16px; width: 10px; border-radius: 5px; background: currentColor; cursor: pointer; -webkit-appearance: none; margin-top: -6px;}
                input#zoomfactor[type=range]:focus::-webkit-slider-runnable-track {background: #3071A9;} input#zoomfactor[type=range]::-moz-range-track {width: 100%; height: 6px; cursor: pointer; animate: 0.2s; box-shadow: 1px 1px 1px #000000; background: #aaaaaa77; border-radius: 5px; border: 1px solid #000000;}
                input#zoomfactor[type=range]::-moz-range-thumb {box-shadow: 1px 1px 1px #000000; border: 1px solid #000000; height: 16px; width: 10px; border-radius: 5px; background: currentColor; cursor: pointer;}
                #screenshot #shader {opacity: .6; z-index: 2002; position: absolute; transition: opacity .5s; background-position: left top, right bottom, left bottom, right top;
                  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y; background-image: linear-gradient(#000, #000), linear-gradient(#000, #000), linear-gradient(#000, #000), linear-gradient(#000, #000);} #screenshot #shader.transparent, #screenshot .action.transparent {opacity: 0 !important;}`;
            if (BC.settings.hidemenubar) {
                style.innerText += `
                    #nav-top-menu {position: static; width: 100%; height: 60px;} #nav-menu-buffer {height: 0px; padding-top: 0px !important;}
                    html.topNavfloat #nav-top-menu, html.tabNavfloat .tab-scroll-outer {-webkit-transition: top 0.5s ease-in-out; -moz-transition: top 0.5s ease-in-out; -khtml-transition: top 0.5s ease-in-out; transition: top 0.5s ease-in-out;}
                    html.topNavfloat #nav-top-menu {position: fixed;} html.tabNavfloat .tab-scroll-outer {position: fixed; width: 100%; z-index:989; background: #fff;}
                    html.tabNavfloat.night .tab-scroll-outer {background: #211f22;}
                    html.topNavfloat #nav-menu {padding-top: 60px;} html.tabNavfloat #page-detail .tab-content {margin-top: 50px;} html.tabNavfloat #page-detail #listing-trending {margin-top: -50px;} html.tabNavfloat #nav-side-menu {z-index:999;}`;
            }
            if (BC.settings.playlists || BC.settings.mvplaylist) {
                style.innerText += `
                    .mvplaylist.row, .playlist.row {width: 723px;margin-top:20px;margin-bottom:20px;} .plslider, .mvslider {width:100%;max-width: 878px; padding-left:35px;margin: auto 0px; overflow:hidden;display: inline;}
                    .mvplaylist .playlist-title, .playlist .playlist-title {display:inline-block; width: auto !important; margin: 20px 37px 10px;} #comment-frm-container {margin-top: 20px !important;}
                    .mvplaylist .playlistbt, .playlist .playlistbt {width: 30px; height: 195px; padding-top: 85px; background-color: #f3f3f3; position: absolute; z-index: 78; } .night .mvplaylist .playlistbt, .night .playlist .playlistbt {background-color: #211f22;}
                    .plslider, .mvslider {-webkit-transition: margin-left 0.25s ease-in-out; -moz-transition: margin-left 0.25s ease-in-out; -khtml-transition: margin-left 0.25s ease-in-out; transition: margin-left 0.25s ease-in-out;}
                    .playlistup {margin-left:693px; background: linear-gradient(to right, #BBB 0%,#DDD 100%); border-bottom-right-radius: 20px 40px; border-top-right-radius: 20px 40px;}
                    .playlistdn {background: linear-gradient(to left, #BBB 0%,#DDD 100%); border-bottom-left-radius: 20px 40px; border-top-left-radius: 20px 40px;}
                    .night .playlistup {background: linear-gradient(to right, #2c2a2d 0%,#544e53 100%);} .night .playlistdn {background: linear-gradient(to left, #2c2a2d 0%,#544e53 100%);}
                    .playlistbtn:not(.disabled):hover {background: radial-gradient(ellipse at center, #BBB 0%,#DDD 100%);} .night .playlistbtn:not(.disabled):hover {background: radial-gradient(ellipse at center, #2c2a2d 0%,#544e53 100%);}
                    .playlistbtn {cursor:pointer;width: 30px;height:195px;padding-top:85px;background-color: #ddd;text-align:center;position: absolute; z-index: 80;margin-top: 5px;}
                    .playlistbtn b {cursor:pointer; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none;} .playlistbtn.disabled {cursor:default; opacity:0.3;} .playlistbtn.disabled b {color: #ddd;cursor:default;}
                    .playlist-title span {margin-left:16px;} .playlist-title span:hover {color:#ffaa00;} .video-card-published.sequence {position: absolute;bottom: 0px;right: 3px; z-index:50;} .playlist svg.fa-square {opacity: 0.4;}
                    .mvplaylist .playlist-card, .playlist .playlist-card {width: 208px;height:195px;margin: 5px;} .night .playlistbtn {background-color: #2c2a2d; background:}
                    .playlist-card .video-card-title {height: 52px; width: 200px; max-height: 52px; max-width: 200px; cursor: pointer; overflow: hidden; display: block;} .playlist-card .video-card-title a {font-size: 13px; font-weight: 500;}
                    .playlist-card.active .video-card-title {max-height: 47px;}
                    .night .playlistbtn.disabled b {color: #2c2a2d;} @media (min-width: 768px) {.plslider, .mvslider {max-width: 660px;} .playlistup {margin-left:475px;}.mvplaylist.row, .playlist.row {width: 505px;}}
                    @media (min-width: 992px) {.plslider, .mvslider {max-width: 878px;} .playlistup {margin-left:693px;}.mvplaylist.row, .playlist.row {width: 723px;}}`;
            }
            if (BC.settings.hidedonationbar) style.innerText += '.video-container .text-center {display: none !important;}';
            if (BC.settings.hidecookienotice) style.innerText += '#alert-cookie {display: none !important;}';
            if (BC.settings.hidesignupnotice) style.innerText += '#alert-signup {display: none !important;}';
            if (BC.settings.usesquareicons) style.innerText += '.channel-banner .image-container {border-radius:0px !important;}';
            if (BC.settings.hideadverts) {
                style.innerText += '.sidebar .rcad-container, .sidebar > div:not(.sidebar-video) {display:none !important;}';
                let affiliates = null;
                if (affiliates = qs('.affiliate-container')) {
                    affiliates.outerHTML = ''
                }
            }
            if (BC.settings.useminiplayer) style.innerText += 'button.plyr__control[data-plyr="pip"] {display: none !important;}';
            d.documentElement.appendChild(style);
            if (BC.settings.hidemenubar) w.addEventListener('scroll', BC.floatHeaders);
            BC.addBrowserSearch();
            BC.loaded = 1;
            debug('>>>>>>>>>>>>>> BC load <<<<<<<<<<=');
        } else debug('>>>>>>>>>>>>>> BC reload <<<<<<<<<<=');

        if (BC.watchpage) {
            BC.page = 'watchpage';
            BC.player.api = qs('video#player');
            if (isChrome) {
                BC.player.api.crossOrigin = "Anonymous";/* for webkit CORS*/
                let src = qs("source", BC.player.api).src;
                qs("source", BC.player.api).src = src;
                BC.player.api.load();
                if (BC.player.autoplay) BC.player.api.play();
            }
                /* Provide mini player */
            if (BC.player.api !== null) {
                if (!BC.player.rect) {
                    w.scrollTo(0, 0);
                    BC.player.rect = BC.player.api.getBoundingClientRect();
                }
                BC.player.api.mini_point = BC.player.rect.top + ((BC.player.rect.height / 2) + 50);
                BC.origVid = {
                  w: Math.round(BC.player.rect.width * 10) / 10,
                  h: Math.round(BC.player.rect.height * 10) / 10,
                  r: Math.round(BC.player.rect.width/BC.player.rect.height * 1000) / 1000
                };
                if (!BC.miniPlayerIni && BC.settings.useminiplayer) {
                    GM.getValue('miniplayer', "{}").then( (value) => {
                        if (value && value != '{}') {
                            BC.miniplayer = JSON.parse(value);
                            w.addEventListener("scroll", BC.miniPlayer, false);
                            d.addEventListener("fullscreenchange", (e) => { BC.onFullScreen(e)});
                            d.addEventListener("mozfullscreenchange", (e) => { BC.onFullScreen(e)});
                            d.addEventListener("webkitfullscreenchange", (e) => { BC.onFullScreene(e)});
                            let style = dce("style");
                            style.type = "text/css";
                            style.innerText = `
                                html:not(.isfullscreen).s-marty-miniplayer video#player, html:not(.isfullscreen).s-marty-miniplayer .plyr__video-wrapper, html:not(.isfullscreen).s-marty-miniplayer .plyr--video {opacity: 0.94;}
                                html:not(.isfullscreen).s-marty-miniplayer .video-container > .row > div > .wrapper {position: fixed;z-index: 100;background-color:transparent; border:1px solid rgba(255,255,255,0.3);}
                                html:not(.isfullscreen).s-marty-miniplayer #s-marty-miniplayer-bar {display : block;cursor: move; height: 40px; left: -3px; right: 5px; top: -6px; position: absolute;z-index: 110;background-color:transparent;}
                                html:not(.isfullscreen).s-marty-miniplayer #s-marty-miniplayer-bar:hover {background-color:#000; opacity: 0.4; background-clip: padding-box; padding: 6px 0 0 6px;}
                                html:not(.isfullscreen).s-marty-miniplayer #s-marty-miniplayer-size {display : block;cursor: nesw-resize; width:7px; height: 7px; right: -3px; top: -3px; position: absolute;z-index: 120;background-color:transparent;}
                                html:not(.isfullscreen).s-marty-miniplayer .plyr__controls button[data-plyr="captions"], html:not(.isfullscreen).s-marty-miniplayer .plyr__controls button[data-plyr="pip"], html:not(.isfullscreen).s-marty-miniplayer .plyr__controls .plyr__menu {display : none !important;}
                                html:not(.s-marty-miniplayer) #s-marty-miniplayer-bar, html:not(.s-marty-miniplayer) #s-marty-miniplayer-size {display : none;} html:not(.isfullscreen).s-marty-miniplayer .plyr__controls imput[data-plyr="volume"] {/*max-width:12% !important; */width: 12% !important;}
                                html:not(.isfullscreen).s-marty-miniplayer .plyr__video-embed iframe, html:not(.isfullscreen).s-marty-miniplayer .plyr__video-wrapper--fixed-ratio video {position: relative !important; } html:not(.isfullscreen).s-marty-miniplayer #volumometer {height: calc(100% - 90px);bottom: 20px;}
                                html.isfullscreen video#player {width: 100% !important; height: !important;}`;
                            d.documentElement.appendChild(style);
                            BC.miniPlayerIni = true;
                        }
                    }).catch (error => {
                        error('miniplayer: Error in GM.getValue promise: '+ error)
                    });
                }

                if (!qs("#s-marty-miniplayer-bar")) {
                    BC.player.fur = qs(".video-container .wrapper");
                    let bar = dce("div");
                    bar.setAttribute('id', 's-marty-miniplayer-bar');
                    bar.addEventListener("mousedown", BC.moveMiniPlayer, true);
                    let size = dce("div");
                    size.setAttribute('id', 's-marty-miniplayer-size');
                    size.addEventListener("mousedown", BC.sizeMiniPlayer.bind(this), true);
                    BC.player.fur.insertBefore(bar, BC.player.fur.firstChild);
                    BC.player.fur.insertBefore(size, BC.player.fur.firstChild);
                    BC.player.api.volume = BC.player.volume;
                    BC.player.fur.parentNode.style = `width:${BC.origVid.w}px;height:${BC.origVid.h}px;`;
                }

                    /* Autoplay videos */
                if (BC.player.autoplay) {
                    if (! BC.startButton) {
                        BC.startButton = qs('button[aria-label="Play"]');
                        BC.player.api.autoplay = true;
                        if (qs('.plyr__controls imput[data-plyr="volume"]')) {
                            qs('.plyr__controls imput[data-plyr="volume"]').removeAttribute('hidden'); // Volume
                            qs('.plyr__controls .plyr__volume button').removeAttribute('hidden'); // Mute
                        }
                    }
                    if (BC.player.api.paused) {
                        BC.player.api.play()
                          .catch( function(e) { BC.startButton.dispatchEvent( new MouseEvent('click', {bubbles: true, cancelable: true})) })
                    }
                }
                else {
                    BC.player.api.autoplay = false;
                    if (!BC.player.api.paused) BC.player.api.pause();
                }

                if (!qs("video#player.bc")) {
                        /* Video errors */
                    qs('progress.plyr__progress__buffer').style = '';
                    qs('div.plyr__progress').title = '';
                    if (isChrome) {
                        if (isNaN(BC.player.api.duration)) {
                            w.setTimeout(() => {
                               if (BC.player.api.readyState === 0 && isNaN(BC.player.api.duration)) { 
                                    let err = null, f = '', n = parseInt(BC.player.api.children[0].attributes.dl.value);
                                    try { err = Bcd.src.videos[n].error; f = Bcd.src.videos[n].url}
                                    catch (e) { err = 'Undefined video error' }
                                    if (err) {
                                        qs('progress.plyr__progress__buffer').style.backgroundColor = 'rgba(255,255,60,.80)';
                                        qs('div.plyr__progress').title = err;
                                        error(`Media error ${err} ${f}`);
                                    }
                                }
                           }, 3000)
                       }
                    }
                    else {
                        BC.player.api.addEventListener('error', function(e) {
                            let err = '';
                            if (BC.player.api.error) {
                                if (BC.player.api.error.code == BC.player.api.error.MEDIA_ERR_NETWORK)
                                    err = 'File error';
                                else if (BC.player.api.error.code == BC.player.api.error.MEDIA_ERR_DECODE)
                                    err = 'Video file is corrupt';
                                else if (BC.player.api.error.code == BC.player.api.error.MEDIA_ERR_SRC_NOT_SUPPORTED)
                                    err = 'Video file is incompatable';
                            }
                            w.setTimeout((e, err) => {
                                let f = '';
                                if (!err) {
                                    try {
                                        let n = parseInt(e.target.attributes.dl.value);
                                        err = Bcd.src.videos[n].error; f = Bcd.src.videos[n].url}
                                    catch (e) { err = 'Undefined video error' }
                                }
                                qs('progress.plyr__progress__buffer').style.backgroundColor = 'rgba(255,255,60,.80)';
                                qs('div.plyr__progress').title = (err || "Undefined video error");
                                error(`Media error ${err || "undefined"} ${f}`);
                            }, 3000, e, err)
                        }, true);
                    }
                    if (!qs("#volumometer")) {
                        let volInd = dce("div");
                        volInd.id = "volumometer";
                        volInd.innerHTML = '<div class="vol"></div><div class="percent"></div>';
                        qs(".wrapper .plyr").appendChild(volInd);
                        BC.player.api.addEventListener('volumechange', function(e) {
                            let volume = Math.round(e.target.volume / 0.01) * 0.01;
                            BC.savePlayerValue('volume', volume);
                            if (qs(".plyr").classList.contains("plyr--hide-controls")) {
                                qs("#volumometer .percent").innerText = `${(volume * 100).toFixed()}%`;
                                qs("#volumometer .vol").style.height = `${volume * 100}%`;
                                qs("#volumometer").classList.add("change");
                                setTimeout(()=>{qs("#volumometer").classList.remove("change")},500);
                            }
                        }, false);
                        w.addEventListener('keydown', BC.catchKey, false);
                    }
                    BC.player.api.addEventListener('timeupdate', function(e){ BC.onPlayerProgress(e) }, false);
                    if (BC.settings.useseekbarpreview) {
                        if (BC.player.api.readyState > 0) BC.getVideoThumbnails({target: BC.player.api});
                        BC.player.api.addEventListener('loadedmetadata', BC.getVideoThumbnails, false);
                    }
                    BC.player.api.classList.add("bc");
                }
            }
            let sidebarnext = qs(".sidebar-next");
            let playnext = qs("label.sidebar-autoplay:not(.active)");
            if (sidebarnext && playnext) {
                playnext.addEventListener('mousedown', function(e) {
                    if (e.which===1) {
                       let checked = qs("input#autoplay-toggle").checked;
                       BC.savePlayerValue('playnext', !checked);
                    }
                }, false);
                playnext.classList.add('active')
            }
            if (BC.settings.hidecomments) setTimeout(BC.hideComments, 2000);
            if (BC.playlist) {
                BC.playlist = BC.playlist.match( /[&?]+list=([^&]*[a-z0-9_-]+)/i )[1];
                BC.addMoreRecentVideos(-1, BC.playlist);
            }
            else BC.addMoreRecentVideos(8);
            if (BC.settings.mvplaylist) BC.addMostViewedPlaylist();
            if (BC.settings.playlists) BC.addChannelPlaylists();
            if (BC.settings.useblacklist) BC.applyChannelBlacklist();

            let link = Bcd.addVideoAction("takeScreenShot", "Take Screen Shot", BC.screenshotIcon);
            Bcd.addTooltip(link, Bcd.tooltip.length); /* screenshot link */
            link.addEventListener('click', BC.takeScreenShot, false);

            BC.setChannelFeed('add');
            BC.addPublishDate();
            BC.player.api.focus(); /* keycode listening */
        }
        else if (BC.channelpage) {
            BC.page = 'channelpage';
            if (d.cookie.indexOf('sensitivity=') !=-1 && w.location.search.indexOf('showall=1') ==-1) {
                d.cookie = "sensitivity=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
            }
            let sensitivityWarning;
            if (sensitivityWarning = qs('.sensitivity-warning a')) sensitivityWarning.addEventListener('click', BC.addSensitivityCookie, false);
            if (BC.settings.useblacklist) BC.applyChannelBlacklist();
            BC.setChannelFeed('add');
        }
        else if (BC.homepage || BC.categorypage) {
            BC.page = 'homepage';
            if (BC.settings.useblacklist) {
                let listingTabs = qs('#listing-tabs.listening');
                let listingsAll = qs('#listing-all > div.row');
                let listingsPopular = qs('#listing-popular > div.row');
                BC.listingsAllHeight = Math.round(listingsAll.getBoundingClientRect().height);
                BC.listingsPopHeight = Math.round(listingsPopular.getBoundingClientRect().height);

                if (!listingTabs) {
                    qs("ul.nav-tabs-list li a[href='#listing-all']")
                      .addEventListener('click', function(e){ BC.applyBlacklist('#listing-all > div.row > div', 'all') }, false);
                    qs("ul.nav-tabs-list li a[href='#listing-popular']")
                      .addEventListener('click', function(e){ BC.applyBlacklist('#listing-popular > div.row > div', 'popular') }, false);
                    qs("ul.nav-tabs-list li a[href='#listing-trending']")
                      .addEventListener('click', function(e){ BC.applyBlacklist('div#trending-day > div.row > div,div#trending-week > div.row > div,div#trending-month > div.row > div', 'trending') }, false);
                    qs("ul.nav-tabs-list li a[href='#listing-subscribed']")
                      .addEventListener('click', function(e){ BC.navsIni('subscribedpage') }, false);

                    addListener(listingsAll, function(e) {
                        let newlistings = qs('#listing-all > div.row');
                        let newlistingsHeight = Math.round(newlistings.getBoundingClientRect().height);
                        if (BC.listingsAllHeight < newlistingsHeight) {
                            BC.listingsAllHeight = newlistingsHeight;
                            BC.applyBlacklist('#listing-all > div.row > div');
                        }
                    },{ childList: true });

                    addListener(listingsPopular, function(e) {
                        let newlistings = qs('#listing-popular > div.row');
                        let newlistingsHeight = Math.round(newlistings.getBoundingClientRect().height);
                        if (BC.listingsPopHeight < newlistingsHeight) {
                            BC.listingsPopHeight = newlistingsHeight;
                            BC.applyBlacklist('#listing-popular > div.row > div');
                        }
                    },{ childList: true });

                    qs('#listing-tabs').classList.add('listening');
                    if (!BC.settings.hidecarousel)
                        BC.applyBlacklist('#carousel #channel-list div.item > div,#carousel .hidden-md > div');
                }
            }
            if (BC.settings.hidecarousel) { // The only way to pause this thing
                if (qs('#carousel')) qs('#carousel').innerHTML = '';
            }

            if (BC.settings.homepagegotoall) {
                let preferAll = qs("ul.nav-tabs-list li a[href='#listing-all']");
                if (preferAll !== null && preferAll.parentNode.className.indexOf('active') ==-1) {
                    preferAll.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                    BC.applyBlacklist('#listing-all > div.row > div', 'all');
                }
            }
            else BC.applyBlacklist('#listing-popular > div.row > div');
            BC.setChannelFeed('remove');
        }
        BC.createSmartyButton();
        BC.navsIni();
    },


    applyBlacklist: (selector, page) => {

        BC.previouslisting = selector;
        if (page) BC.navsIni();
        if (!BC.settings.useblacklist) return;
        selector = selector.split(',').join(':not([polled]), ') + ':not([polled])';
        let i,
            listings = qsa(selector);

        if (listings.length) {
            try {
                for (i = 0; i < listings.length; i++) {
                    let card = qs('.video-card-channel a, .video-trending-channel a, .channel-card a', listings[i]);
                    if (card) {
                        let href = card.getAttribute("href");
                        let channel = href.match( /\/channel\/([a-z0-9_-]+)\//i );
                        if (channel) {
                            if (BC.blacklist.find( id => id[0] == channel[1] )) {
                                listings[i].outerHTML = ''
                            }
                            else {
                                listings[i].setAttribute('polled', channel[1]);
                                let button = BC.blacklistButton();
                                let videoCard = qs('.video-card, .video-trending-image, .channel-card', listings[i]);
                                let name = qs('.channel-card-title', listings[i]);
                                name = name ? name.innerText : card.innerText;
                                videoCard.appendChild(button);
                                button.addEventListener('click', function(e){ BC.blacklistAdd(e, channel[1], name) }, true);
                            }
                        }
                    }
                }
            } catch (e) {error('applyBlacklist: '+ e)}
        }
    },


    applyChannelBlacklist: () => {
        let card = qs('.channel-banner .name a'),
            name = card.innerText;

        if (card) {
            try {
                let href = card.getAttribute("href");
                let channel = href.match( /\/channel\/([a-z0-9_-]+)\//i );
                if (channel) {
                    if (BC.blacklist.find( id => id[0] == channel[1] )) {
                        card.setAttribute('title', name +' is blacklisted ☺');
                        card.classList.add('userisblacklisted')
                    }
                    else if (! qs('.add-to-blacklist', card.parentNode)) {
                        let button = BC.blacklistButton();
                        card.parentNode.appendChild(button);
                        button.addEventListener('click', function(e){
                            BC.blacklistAdd(e, channel[1], name);
                            this.previousSibling.classList.add('userisblacklisted');
                            this.previousSibling.setAttribute('title', name +' is blacklisted ☺');
                            this.style.display = 'none';
                        }, true);
                    }
                }
            } catch (e) {error('applyChannelBlacklist: '+ e)}
        }
    },


    createSmartyButton: () => {
        let i, blacklisted, menu, smarty, colors;
        let blContent = '';
        let donate = '<svg class="smarty-donate" version="1.0" xmlns="http://www.w3.org/2000/svg" width="14pt" height="14pt" viewBox="0 0 496 512" preserveAspectRatio="xMidYMid meet"><g transform="translate(248 256)"><g transform="translate(0, 0)  scale(1, 1)  rotate(-14 7 7)">'+
            '<path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm24 376v16c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-16.2c-16.5-.6-32.6-5.8-46.4-15.1-8.7-5.9-10-18.1-2.3-25.2l12-11.3c5.4-5.1 13.3-5.4 19.7-1.6 6.1 3.6 12.9 5.4 19.9 5.4h45c11.3 '+
            '0 20.5-10.5 20.5-23.4 0-10.6-6.3-19.9-15.2-22.7L205 268c-29-8.8-49.2-37-49.2-68.6 0-39.3 30.6-71.3 68.2-71.4v-16c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16.2c16.5.6 32.6 5.8 46.4 15.1 8.7 5.9 10 18.1 2.3 25.2l-12 11.3c-5.4 5.1-13.3 5.4-19.7 1.6-6.1-3.6-12.9-5.4-19.9-5.4h-45c-11.3 '+
            '0-20.5 10.5-20.5 23.4 0 10.6 6.3 19.9 15.2 22.7l72 21.9c29 8.8 49.2 37 49.2 68.6.2 39.3-30.4 71.2-68 71.4z" transform="translate(-248 -256)"></path></g></g><title>Donate to Smarty</title></svg>';
        let tabContent = `<a href="javascript:void(0)">Smarty</a><div id="smarty_tab" class="modal-content" style="display: none; position: absolute; z-index: 200;">
          <div id="smartymm" style="display: block;"><div style="width: 170px;">${donate}
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="useblacklist2"><input name="useblacklist" id="useblacklist2" type="checkbox"${BC.settings.useblacklist ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Use Blacklist</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="hidemenubar2"><input name="hidemenubar" id="hidemenubar2" type="checkbox"${BC.settings.hidemenubar ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Scroll Menubar</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="hidecarousel2"><input name="hidecarousel" id="hidecarousel2" type="checkbox"${BC.settings.hidecarousel ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Hide Carousel</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="hidecomments2"><input name="hidecomments" id="hidecomments2" type="checkbox"${BC.settings.hidecomments ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Hide Comments</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="mvplaylist2"><input name="mvplaylist" id="mvplaylist2" type="checkbox"${BC.settings.mvplaylist ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Popular Playlist</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="playlists2"><input name="playlists" id="playlists2" type="checkbox"${BC.settings.playlists ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;All Playlists</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="useminiplayer2"><input name="useminiplayer" id="useminiplayer2" type="checkbox"${BC.settings.useminiplayer ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Use Miniplayer</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="autoplay2"><input name="autoplay" id="autoplay2" type="checkbox"${BC.player.autoplay ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Auto Play Video</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="hideadverts2"><input name="hideadverts" id="hideadverts2" type="checkbox"${BC.settings.hideadverts ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Hide Unsafe Ads</label></div>
            <div class="smartybox radios"><label class="r0" title="Night Color: Default"><input name="color" title="Night Color: None" value="none" type="radio"${BC.settings.color == 'none' ? ' checked':''}><i class="radiohelper r0 tabinput"></i>&nbsp;&nbsp;</label><span style="height:12px;width:12px">
                  &nbsp;&nbsp;<label class="r1" title="Night Color: Orange"><b>O</b>&nbsp;
            <input name="color" value="orange" type="radio"${BC.settings.color == 'orange' ? ' checked':''}><i class="radiohelper r1 tabinput"></i></label></span><span style="height:12px;width:12px;color">&nbsp;&nbsp;<label class="r2" title="Night Color: Blue"><b>B</b>&nbsp;
            <input name="color" value="blue" type="radio"${BC.settings.color == 'blue' ? ' checked':''}><i class="radiohelper r2 tabinput"></i></label></span><span style="height:12px;width:12px">&nbsp;&nbsp;<label class="r3" title="Night Color: Green"><b>G</b>&nbsp;
            <input name="color" value="green" type="radio"${BC.settings.color == 'green' ? ' checked':''}><i class="radiohelper r3 tabinput"></i></label>&nbsp;</span></div>
          </div><div id="blacklistedchannels" style="border-top:none;"><div><em>No Blacklist</em></div></div></div><div id="smartyam" style="width: 198px; display: none;">
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="usesquareicons2"><input name="usesquareicons" id="usesquareicons2" type="checkbox"${BC.settings.usesquareicons ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Use Square Icons</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="hidedonationbar2"><input name="hidedonationbar" id="hidedonationbar2" type="checkbox"${BC.settings.hidedonationbar ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Hide Donation Bar</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="homepagegotoall2"><input name="homepagegotoall" id="homepagegotoall2" type="checkbox"${BC.settings.homepagegotoall ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Homepage Goto All</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="hidecookienotice2"><input name="hidecookienotice" id="hidecookienotice2" type="checkbox"${BC.settings.hidecookienotice ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Hide Cookie Notice</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="hidesignupnotice2"><input name="hidesignupnotice" id="hidesignupnotice2" type="checkbox"${BC.settings.hidesignupnotice ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Hide Signup Notice</label></div>
            <div class="smartybox"><label class="tabinput" style="margin-bottom: 0px;" for="useseekbarpreview2"><input name="useseekbarpreview" id="useseekbarpreview2" type="checkbox"${BC.settings.useseekbarpreview ? ' checked':''} class="tabinput"> <i class="cbhelper tabinput"></i>&nbsp;Use Seekbar Preview</label></div></div></div>`;

        menu = qs('ul.nav-tabs-list');
        smarty = qs('#smarty_tab');

        if (smarty === null) {
            smarty = dce("li");
            smarty.innerHTML = tabContent;
            menu.appendChild(smarty);
            blacklisted = qs('#blacklistedchannels');

            if (BC.settings.useblacklist) {
                if (BC.blacklist.length ) {
                    for (i = 0; i < BC.blacklist.length; i++) {
                        blContent += `<span title="Click to remove ${BC.blacklist[i][1]}" data-name="${BC.blacklist[i][0]}">${BC.blacklist[i][1]}</span>`;
                    }
                }
                else blContent = '<div><em>No Blacklist</em></div>';
            }
            else blContent = '<div><em>Blacklist Off</em></div>';
            if (blContent) blacklisted.innerHTML = blContent;

            qs('a', smarty).addEventListener('click', function(e) {setTimeout(BC.toggleTab,300)}, true);
            qs('a', smarty).addEventListener('dblclick', function(e) {e.stopPropagation(); BC.auxMenu = 1; BC.toggleTab(e, false, true)}, true);
            qs('#useminiplayer2', smarty).addEventListener('change', function(e) {BC.toggleSettings('useminiplayer',e.target.checked)}, false);
            qs('#hidecomments2', smarty).addEventListener('change', function(e) {BC.savePlayerValue('hidecomments',e.target.checked)}, false);
            qs('#useblacklist2', smarty).addEventListener('change', function(e) {BC.toggleSettings('useblacklist',e.target.checked)}, false);
            qs('#hidecarousel2', smarty).addEventListener('change', function(e) {BC.toggleSettings('hidecarousel',e.target.checked)}, false);
            qs('#hidemenubar2', smarty).addEventListener('change', function(e) {BC.toggleSettings('hidemenubar',e.target.checked)}, false);
            qs('#hideadverts2', smarty).addEventListener('change', function(e) {BC.toggleSettings('hideadverts',e.target.checked)}, false);
            qs('#mvplaylist2', smarty).addEventListener('change', function(e) {BC.savePlayerValue('mvplaylist',e.target.checked)}, false);
            qs('#playlists2', smarty).addEventListener('change', function(e) {BC.savePlayerValue('playlists',e.target.checked)}, false);
            qs('#autoplay2', smarty).addEventListener('change', function(e) {BC.savePlayerValue('autoplay',e.target.checked)}, false);
            qs('#usesquareicons2', smarty).addEventListener('change', function(e) {BC.toggleSettings('usesquareicons',e.target.checked)}, false);
            qs('#hidedonationbar2', smarty).addEventListener('change', function(e) {BC.toggleSettings('hidedonationbar',e.target.checked)}, false);
            qs('#homepagegotoall2', smarty).addEventListener('change', function(e) {BC.toggleSettings('homepagegotoall',e.target.checked)}, false);
            qs('#hidecookienotice2', smarty).addEventListener('change', function(e) {BC.toggleSettings('hidecookienotice',e.target.checked)}, false);
            qs('#hidesignupnotice2', smarty).addEventListener('change', function(e) {BC.toggleSettings('hidesignupnotice',e.target.checked)}, false);
            qs('#useseekbarpreview2', smarty).addEventListener('change', function(e) {BC.toggleSettings('useseekbarpreview',e.target.checked)}, false);
            qs('svg').addEventListener('click', function(e) {w.open('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QHFFSLZ7ENUQN&source=url', '_blank');}, false);
            colors = qsa('input[type=radio][name=color]', smarty);
            for (i = 0; i < colors.length; i++) {
                colors[i].addEventListener('change', function(e) {BC.toggleSettings('color',this.value)}, false);
            }
        }
        else {
            blacklisted = qs('#blacklistedchannels');
            if (BC.settings.useblacklist) {
                if (BC.blacklist.length ) {
                    for (i = 0; i < BC.blacklist.length; i++) {
                        blContent += `<span title="Click to remove ${BC.blacklist[i][1]}" data-name="${BC.blacklist[i][0]}">${BC.blacklist[i][1]}</span>`;
                    }
                }
                else blContent = '<div><em>No Blacklist</em></div>';
            }
            else blContent = '<div><em>Blacklist Off</em></div>';
            blacklisted.innerHTML = blContent;
        }
        if (BC.blacklist.length > 14 && BC.settings.useblacklist) {
            blacklisted.style.height = '280px';
            blacklisted.style.overflowY = 'scroll';
        }
        else {
            blacklisted.style.height = 'auto';
            blacklisted.style.overflowY = 'visible';
        }
        menu.parentNode.style.overflow = 'visible';
        smarty = qsa('#blacklistedchannels > span');
        for (i = 0; i < smarty.length; i++) {
            smarty[i].addEventListener('click', BC.blacklistRemove, true);
        }
    },


    blacklistButton: () => {
        let span = dce("span");

        span.className = "action-button add-to-blacklist";
        span.innerHTML = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,27.000000) ' +
            'scale(0.100000,-0.100000)" stroke="none"><path fill="currentColor" d="M12 258 c-17 -17 -17 -229 0 -246 17 -17 229 -17 246 0 17 17 17 229 0 246 -17 17 -229 17 -246 0z m233 -123 l0 -110 -110 0 -110 0 -3 99 c-1 55 0 106 2 113 4 11 30 13 113 11 l108 -3 0 -110z"/>' +
            '<path fill="currentColor" d="M40 217 c0 -7 16 -26 35 -42 19 -17 35 -35 35 -40 0 -6 -16 -25 -35 -42 -19 -18 -35 -37 -35 -43 0 -22 31 -8 60 29 l32 39 35 -39 c34 -37 63 -51 63 -29 0 6 -16 24 -35 41 -19 17 -35 37 -35 44 0 7 16 25 35 39 35 27 47 56 ' +
            '23 56 -7 0 -26 -16 -41 -35 -15 -19 -33 -35 -40 -35 -7 0 -25 16 -41 35 -30 35 -56 46 -56 22z"/></g></svg><span class="blacklist-tooltip">&nbsp;Blacklist&nbsp;</span>';
        return span
    },


    closeTab: (e) => {e.stopPropagation(); if (!e.target.classList.contains("tabinput")) {BC.toggleTab(null,'close')}},

    toggleTab: (e, close = false, aux = false) => {
        let tab = qs('#smarty_tab');

        if (!aux && !close && BC.auxMenu) return;
        if (tab.style.display == 'block' && aux) return;

        if (tab.style.display == 'none' && !close) {
            if (aux) {
                qs("#smartymm").style.display = 'none';
                qs("#smartyam").style.display = 'block';
            }
            else qs("#smartymm").style.display = 'block';
            tab.style.display = 'block';
            d.body.addEventListener('click', BC.closeTab, false);
        }
        else {
            setTimeout(function(){
                BC.auxMenu = !1;
                tab.style.display = 'none';
                qs("#smartyam").style.display = 'none';
                if (BC.reload) w.location.replace(w.location.href);
            },200);
            d.body.removeEventListener('click', BC.closeTab, false);
        }
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    },


    blacklistAdd: (e, channel, name) => {
        let i,
            blocked = qsa('[polled="'+channel+'"]');

        for (i = 0; i < blocked.length; i++) blocked[i].innerHTML = BC.wait(blocked[i]);
        BC.blacklist.push([channel, name]);
            /* Sort by User Name*/
        BC.blacklist.sort( (a, b) => {
            let x = a[1].toUpperCase(), y = b[1].toUpperCase();
            if (x > y) return 1;
            else if (x < y) return -1;
            return 0;
        });
        GM.setValue('blacklist', JSON.stringify(BC.blacklist));
        BC.createSmartyButton();

        e.preventDefault();
        e.stopPropagation();
        return false;
    },


    blacklistRemove: (e) => {
        BC.toggleTab();
        let arr = BC.blacklist.filter(function(ele) {
            return ele[0] != e.target.getAttribute('data-name');
        });
        BC.blacklist = arr;
        BC.blacklist.sort( (a, b) => {
            let x = a[1].toUpperCase(), y = b[1].toUpperCase();
            if (x > y) return 1;
            else if (x < y) return -1;
            return 0;
        });
        GM.setValue('blacklist', JSON.stringify(BC.blacklist));
        BC.createSmartyButton();
        e.preventDefault();
        e.stopPropagation();
        return false;
    },


    wait: (o) => {
        let waiter = '<div id="loader" style="position: relative;margin: auto;left: 0;top: 90px;width: 10%;"><ul style="width: 10%;"><li></li><li></li><li></li></ul></div>',
            dim = o.getBoundingClientRect(),
            n = dim.width;

        o.style.padding = '0';
        o.style.width = n +'px';
        o.style.height = dim.height +'px';

        setTimeout(function() {
            o.style = '-webkit-transition: width 1s ease-out; -moz-transition: width 1s ease-out; -khtml-transition: width 1s ease-out; transition: width 1s ease-out; width:0%;';
            setTimeout(function() {
                o.outerHTML = '';
            }, 900)
        }, 500);
        return waiter;
    },


    maxY: 0, minY: 0, lastY: 0, tabTop: 0,
    topfloat: '', tabfloat: '', upPrev: 0,
    tabNav: '', topNav: '',
    floatHeaders: (e) => {
        let spanY = 0,
            scrolled = Math.round(pageYOffset),
            up = scrolled < BC.lastY;

        if (scrolled == BC.lastY) return;
        else if (up) {
            BC.minY = scrolled;
            spanY = BC.minY - BC.maxY;
        }
        else {
            BC.maxY = scrolled;
            spanY = BC.maxY - BC.minY;
        }
        BC.lastY = scrolled;

        if (up) {
            if (!BC.upPrev) BC.maxY = BC.lastY;
            if (scrolled < BC.tabTop + 100 || spanY < -150) {
                if (BC.topfloat) {
                    if (scrolled < 1) {
                        BC.maxY = 0;
                        BC.topfloat = false;
                        BC.topNav.style.top = '';
                        d.documentElement.classList.remove("topNavfloat");
                    }
                    else if (scrolled > BC.tabTop + 99) {
                        BC.topNav.style.top = '0px';
                    }
                }
                if (BC.topfloat || scrolled < 1) {
                    if (scrolled <= BC.tabTop - 60) {
                        BC.tabfloat = false;
                        BC.tabNav.style.top = '';
                        d.documentElement.classList.remove("tabNavfloat");
                    }
                    else if (scrolled > BC.tabTop + 99) {
                        BC.tabNav.style.top = '60px';
                    }
                }
            }
        }
        else if (scrolled > BC.tabTop + 88 && spanY > 149) {
            if (BC.upPrev) BC.minY = BC.lastY;
            BC.topNav.style.top = '-160px';
            if (!BC.topfloat) {
                BC.topfloat = true;
                d.documentElement.classList.add("topNavfloat");
            }
            BC.tabNav.style.top = '-102px';
            if (!BC.tabfloat) {
                BC.tabfloat = true;
                d.documentElement.classList.add("tabNavfloat");
            }
        }
        BC.upPrev = up;
    },


    navsIni: () => {
        if (BC.settings.hidemenubar) {
            w.scrollTo(0, 0);
            BC.maxY = 0; BC.minY = 0; BC.lastY = 0; BC.tabTop = 0;
            BC.topfloat = false; BC.tabfloat = false; BC.upPrev = true;
            BC.topNav = qs('#nav-top-menu');
            BC.tabNav = qs('.tab-scroll-outer');
            d.documentElement.classList.remove("topNavfloat");
            d.documentElement.classList.remove("tabNavfloat");
            BC.topNav.style.top = '';
            if (BC.tabNav && !BC.tabTop) {
                BC.tabNav.style.top = '';
                setTimeout( function() {
                  BC.tabTop = BC.tabNav.getBoundingClientRect().top;
                  if (isChrome) setTimeout( function(){w.scrollTo(0, BC.tabTop)},1000);
                  else w.scrollTo(0, BC.tabTop);
                },1000);
            }
        } else return
    },


    toggleSettings: (arg, val) => {
        let previouslisting, carousel, advert;

        if (arg == 'useblacklist') {
            BC.savePlayerValue(arg, val);
            BC.createSmartyButton();
            if (BC.homepage) {
                if (val) {
                    if (BC.previouslisting) {
                        previouslisting = BC.previouslisting;
                        if (previouslisting.indexOf('listing') !=-1 && !BC.settings.hidecarousel)
                            BC.applyBlacklist('#carousel #channel-list div.item > div,#carousel .hidden-md > div');
                        BC.applyBlacklist(previouslisting);
                    }
                    d.documentElement.classList.remove("noblacklist");
                }
                else d.documentElement.classList.add("noblacklist");
            }
        }
        else if (arg == 'hidecarousel') {
            if (carousel = qs('#carousel')) {
                carousel.style.display = (val ? 'none' : 'block');
                if (val) carousel.innerHTML = '';
                else carousel.innerHTML = '<h3>Refresh window to start carousel</h3>';
            }
            BC.savePlayerValue(arg, val);
            BC.createSmartyButton();
        }
        else if (arg == 'hidemenubar') {
            BC.savePlayerValue(arg, val);
            BC.createSmartyButton();
        }
        else if (arg == 'hideadverts') {
            if (advert = qs('.rcad-container')) {
                advert.style.display = (val ? 'none' : 'block');
            }
            BC.savePlayerValue(arg, val);
            BC.createSmartyButton();
        }
        else if (arg == 'usedark') {
            if (val) d.documentElement.classList.add("night");
            else d.documentElement.classList.remove("night");
            BC.savePlayerValue(arg, val);
        }
        else if (arg == 'useminiplayer' || arg == 'color' || arg == 'usesquareicons' || arg == 'hidedonationbar' ||
                 arg == 'homepagegotoall' || arg == 'hidecookienotice' || arg == 'hidesignupnotice' || arg == 'useseekbarpreview') {
            BC.reload = true;
            BC.savePlayerValue(arg, val);
        }
    },


    savePlayerValue: (arg, val) => {
        if (arg == 'volume') BC.player.volume = val;
        else if (arg == 'color') BC.settings.color = val;
        else if (arg == 'usedark') BC.settings.usedark = val;
        else if (arg == 'autoplay') BC.player.autoplay = val;
        else if (arg == 'playnext') BC.settings.playnext = val;
        else if (arg == 'playlists') BC.settings.playlists = val;
        else if (arg == 'mvplaylist') BC.settings.mvplaylist = val;
        else if (arg == 'hidemenubar') BC.settings.hidemenubar = val;
        else if (arg == 'hideadverts') BC.settings.hideadverts = val;
        else if (arg == 'useblacklist') BC.settings.useblacklist = val;
        else if (arg == 'hidecarousel') BC.settings.hidecarousel = val;
        else if (arg == 'hidecomments') BC.settings.hidecomments = val;
        else if (arg == 'useminiplayer') BC.settings.useminiplayer = val;
        else if (arg == 'usesquareicons') BC.settings.usesquareicons = val;
        else if (arg == 'hidedonationbar') BC.settings.hidedonationbar = val;
        else if (arg == 'homepagegotoall') BC.settings.homepagegotoall = val;
        else if (arg == 'hidecookienotice') BC.settings.hidecookienotice = val;
        else if (arg == 'hidesignupnotice') BC.settings.hidesignupnotice = val;
        else if (arg == 'useseekbarpreview') BC.settings.useseekbarpreview = val;
        GM.setValue('player', JSON.stringify({
          volume     : BC.player.volume,
          autoplay   : BC.player.autoplay,
          color      : BC.settings.color,
          playnext   : BC.settings.playnext,
          playlists  : BC.settings.playlists,
          mvplaylist : BC.settings.mvplaylist,
          usedark       : BC.settings.usedark,
          useblacklist  : BC.settings.useblacklist,
          hidecarousel  : BC.settings.hidecarousel,
          hidecomments  : BC.settings.hidecomments,
          hidemenubar   : BC.settings.hidemenubar,
          hideadverts   : BC.settings.hideadverts,
          useminiplayer : BC.settings.useminiplayer,
          usesquareicons    : BC.settings.usesquareicons,
          hidedonationbar   : BC.settings.hidedonationbar,
          homepagegotoall   : BC.settings.homepagegotoall,
          hidecookienotice  : BC.settings.hidecookienotice,
          hidesignupnotice  : BC.settings.hidesignupnotice,
          useseekbarpreview : BC.settings.useseekbarpreview
        }));
    },


    miniPlayer: () => {
        let show_mini = pageYOffset > BC.player.api.mini_point,
            is_mini = d.documentElement.classList.contains("s-marty-miniplayer")

        if (!show_mini && is_mini) {
            d.documentElement.classList.remove("s-marty-miniplayer");
            BC.player.fur.style.width = '';
            BC.player.fur.style.height = '';
            BC.player.fur.style.left = '0px';
            BC.player.fur.style.bottom = '0px';
            BC.player.api.style.width = '';
            BC.player.api.style.height = BC.origVid.h +'px';
            w.dispatchEvent(new Event("resize"));
        }
        else if (show_mini && !is_mini) {
            d.documentElement.classList.add("s-marty-miniplayer");
            BC.player.fur.style.left = BC.miniplayer.x +'px';
            BC.player.fur.style.bottom = BC.miniplayer.y +'px';
            BC.player.api.style.width = BC.miniplayer.w +'px';
            BC.player.api.style.height = BC.miniplayer.h +'px';
        }
    },


    onFullScreen: (e) => {
        let a, el;
        if (d.fullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement) {
            BC.isFullScreen = true;
            d.documentElement.classList.add("isfullscreen");
            if (BC.settings.playnext) {
                a = dce("a");
                a.href = "javascript:void(0)";
                a.id = "block_playnext";
                a.style.display = "none";
                el = qs(".sidebar-next .video-card");
                el.insertBefore(a, el.firstChild);
            }
            BC.prevUp = []; BC.nextUp = {}; BC.history = -1; BC.nextUpLoaded = false;
            el = dce("div");
            el.id = "autoplay-next";
            el.className = "hidden";
            qs(".wrapper .plyr").appendChild(el);
            BC.player.api.addEventListener('ended', BC.playNextFullScreen, false);
            BC.player.api.addEventListener('play', BC.hideAutoplayNext, false);
        }
        else {
            BC.isFullScreen = false;
            d.documentElement.classList.remove("isfullscreen");
            if (a = qs(".sidebar-next .video-card a#block_playnext"))
                qs(".sidebar-next .video-card").removeChild(a);
            if (el = qs(".wrapper .plyr #autoplay-next"))
                qs(".wrapper .plyr").removeChild(el);
            BC.player.api.removeEventListener('ended', BC.playNextFullScreen, false);
            BC.player.api.removeEventListener('play', BC.hideAutoplayNext, false);
            BC.prevUp = []; BC.nextUp = {}; BC.history = -1; BC.nextUpLoaded = false;
        }
    },

    catchKey: (e) => {
        let el = d.activeElement,
            fr = 1 / 24, /*23.976,*/
          code = e.keyCode ? e.keyCode : e.which,
         click = new MouseEvent('click', {bubbles: true, cancelable: true});

        if ((typeof code !== "number") ||
           (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) ||
           (typeof e.target.type !== "undefined" && e.target.type.indexOf('text') !=-1)) return;
        
        if (code == 188 || code == 190 && BC.player.api.paused) { /* < or > */
            e.preventDefault();
            e.stopPropagation();
            if (code == 188) { /* < one frame back */
                BC.player.api.currentTime =
                  Math.max(0, BC.player.api.currentTime - fr);
            }
            else if (code == 190) { /* > one frame forward */
                BC.player.api.currentTime =
                  Math.min(BC.player.api.duration, BC.player.api.currentTime + fr);
            } /* hide the red play button */
            setTimeout(()=>{qs('.plyr button.plyr__control--overlaid[aria-label="Play"]')
                 .classList.add("plyr__control--pressed")},150);
        }
        else if (!BC.isFullScreen) {
            if (code == 83) { /* s is for screenshot */
                let ss = qs("#screenshot");
                if (!ss)
                    qs("#takeScreenShot").dispatchEvent(click)
                else {
                    if (qs("#overlay")) ss.removeChild(qs("#overlay"));
                    ss.dispatchEvent(click)
                }
            }
            else if (code == 68) { /* d is for download */
                Bcd.toggle_download_dialog();
            }
        }
    },


    sizeMiniPlayer: (e) => {
        let miniPlayerSized = false;

        if (e.type === "mousemove") {
            BC.miniSiz.hd = e.clientY - BC.miniSiz.h;
            BC.miniSiz.h = e.clientY;
            BC.miniPlayerH -= BC.miniSiz.hd;
            if (BC.miniPlayerH < 197) BC.miniPlayerH = 197;
            if (BC.miniPlayerH > BC.origVid.h) BC.miniPlayerH = BC.origVid.h;
            if (BC.miniPlayerH + BC.miniplayer.y > w.innerHeight -15) BC.miniPlayerH = w.innerHeight - BC.miniplayer.y -15;
            BC.miniPlayerW = Math.round(BC.miniPlayerH * BC.origVid.r);

            BC.player.api.style.width = BC.miniPlayerW +'px';
            BC.player.fur.style.width = BC.miniPlayerW +'px';
            BC.player.fur.style.height = BC.miniPlayerH +'px';
            BC.player.api.style.height = BC.miniPlayerH +'px';
        }
        else if (e.type === "mouseup") {
            w.removeEventListener("mouseup", BC.sizeMiniPlayer, true);
            w.removeEventListener("mousemove", BC.sizeMiniPlayer, true);
            if (BC.miniPlayerH != BC.miniplayer.h) {
                BC.miniPlayerH = (BC.miniPlayerH < 197) ? 197 : BC.miniPlayerH;
                BC.miniplayer.h = (BC.miniPlayerH > BC.origVid.h) ? BC.origVid.h : BC.miniPlayerH;
                BC.miniplayer.w = Math.round(BC.miniPlayerH * BC.origVid.r);
                miniPlayerSized = true;
            }
        }
        else if (e.type === "mousedown") {
            BC.miniSiz.h = e.clientY;
            BC.miniPlayerH = BC.miniplayer.h;
            w.addEventListener("mouseup", BC.sizeMiniPlayer, true);
            w.addEventListener("mousemove", BC.sizeMiniPlayer, true);
        }
        if (miniPlayerSized) {
            GM.setValue('miniplayer', JSON.stringify({ x:BC.miniplayer.x,y:BC.miniplayer.y,w:BC.miniplayer.w,h:BC.miniplayer.h }));
            miniPlayerSized = false;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    },


    moveMiniPlayer: (e) => {
        let miniPlayerMoved = false;

        if (e.type === "mousemove") {
            BC.miniPos.xd = e.clientX - BC.miniPos.x;
            BC.miniPos.yd = BC.miniPos.y - e.clientY;
            BC.miniPos.x = e.clientX;
            BC.miniPos.y = e.clientY;
            BC.miniPlayerX += BC.miniPos.xd;
            BC.miniPlayerY += BC.miniPos.yd;
            if (BC.miniPlayerX < 0) BC.miniPlayerX = 0;
            if (BC.miniPlayerX + BC.miniplayer.w > w.innerWidth) BC.miniPlayerX = w.innerWidth - BC.miniplayer.w;
            if (BC.miniPlayerY < 0) BC.miniPlayerY = 0;
            if (BC.miniPlayerY + BC.miniplayer.h > w.innerHeight -15) BC.miniPlayerY = w.innerHeight - BC.miniplayer.h -15;

            BC.player.fur.style.left = BC.miniPlayerX +'px';
            BC.player.fur.style.bottom = BC.miniPlayerY +'px';
        }
        else if (e.type === "mouseup") {
            w.removeEventListener("mouseup", BC.moveMiniPlayer, true);
            w.removeEventListener("mousemove", BC.moveMiniPlayer, true);
            if (BC.miniPlayerX != BC.miniplayer.x || BC.miniPlayerY != BC.miniplayer.y) {
                BC.miniplayer.x = (BC.miniPlayerX < 0) ? 0 : BC.miniPlayerX;
                BC.miniplayer.y = (BC.miniPlayerY < 0) ? 0 : BC.miniPlayerY;
                miniPlayerMoved = true;
            }
        }
        else if (e.type === "mousedown") {
            BC.miniPos.x = e.clientX;
            BC.miniPos.y = e.clientY;
            BC.miniPlayerX = BC.miniplayer.x;
            BC.miniPlayerY = BC.miniplayer.y;
            w.addEventListener("mouseup", BC.moveMiniPlayer, true);
            w.addEventListener("mousemove", BC.moveMiniPlayer, true);
        }
        if (miniPlayerMoved) {
            GM.setValue('miniplayer', JSON.stringify({ x:BC.miniplayer.x,y:BC.miniplayer.y,w:BC.miniplayer.w,h:BC.miniplayer.h }));
            miniPlayerMoved = false;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    },


    addBrowserSearch: () => {
      	let head = qs('head'),
      	    openSearch = dce('link');

      	openSearch.setAttribute('rel', 'search');
      	openSearch.setAttribute('href', location.protocol +'//github.com/s-marty/SmartChute/raw/master/inc/search.xml');
      	openSearch.setAttribute('type', 'application/opensearchdescription+xml');
      	openSearch.setAttribute('title', 'Bit Chute');
      	head.appendChild(openSearch);
    },


    setChannelFeed: (action) => {
        let rssLink, title, href, channel;
        let head = qs('head'),
            card = qs('.channel-banner .name a'),
            feed = qs('#rss_feed');

        if (action == 'remove' && feed) {
            head.removeChild(feed)
        }
        else if (action == 'add' && card) {
            title = card.innerText;
            href = card.getAttribute("href");
            channel = href.match( /\/channel\/([a-z0-9_-]+)\//i );
            if (channel) {
      	        if (feed && feed.title != title) head.removeChild(feed);
      	        else if (!feed) {
          	        rssLink = dce('link');
                    rssLink.setAttribute('rel', 'alternate');
                    rssLink.setAttribute('href', `${location.protocol}//www.bitchute.com/feeds/rss/channel/${channel[1]}/`);
                    rssLink.setAttribute('type', 'application/rss+xml');
                    rssLink.setAttribute('title', title);
                    rssLink.setAttribute('id', 'rss_feed');
                    head.appendChild(rssLink);
                }
            }
        }
    },


    setPreferencesCookie: (name, value) => {
        let val, preferences = d.cookie.match(/preferences=(\{[a-z0-9_%:-]+[^;]*\})/i);
        if (preferences) {
            if (name == 'autoplay') {
                val = preferences[1].match(/theme%22:%22([a-z]+)%22/);
                d.cookie = `preferences={%22theme%22:%22${val[1]}%22%2C%22autoplay%22:${value}}; path=/`;
            }
            else if (name == 'theme') {
                val = preferences[1].match(/autoplay%22:([a-z]+)(\}|%2C)/);
                d.cookie = `preferences={%22theme%22:%22${value}%22%2C%22autoplay%22:${val[1]}}; path=/`;
            }
        }
    },


    addSensitivityCookie: (e) => {
        d.cookie = "sensitivity=true; path=/";
        return false
    },


    getCsrftoken: () => {
        let csrftoken = d.cookie.match(/csrftoken=([a-z0-9_-]+[^;]*)/i);
        return csrftoken ? csrftoken[1] : null
    },


    addPublishDate: (update = false) => {
        let u, tn, out = null;
        let vpd = qs("div.video-publish-date");

        if (vpd) {
            u = vpd.innerHTML.match(/(\d\d):(\d\d)\s(UTC)\son\s([a-zA-Z]*)\s(\d?\d)[a-z]{2},\s(\d{4})/);
            //debug('dateString.match', u);
            if (u) {
                if (update) {
                    if (out = getPublishDate(u)) {
                        vpd = qs("b", vpd);
                        tn = d.createTextNode(`${out} ago`);
                        vpd.replaceChild(tn, vpd.childNodes[0]);
                        setTimeout(BC.addPublishDate, 60000, true)
                    }
                }
                else {
                    vpd.style.fontSize = "12px";
                    out = getPublishDate(u);
                    if (out) {
                        vpd.innerHTML += `&nbsp;&nbsp; <b>${out} ago</b>`;
                        setTimeout(BC.addPublishDate, 60000, true)
                    }
                }
            }
        }
    },


    isDark: false, isTheme: false, persistTryDT: 0,

    setTheme: () => {
        let c, theme, version, colours, style;

        if (!BC.isDark && BC.settings.usedark) {
            theme = qs('link#css-theme');
            if (theme !== null) {
                if (theme.href.indexOf('night.css') ==-1) {
                    version = theme.href.match( /\/static\/([a-z]+[0-9]+)\//i );
                    if (version !== null && version[1] !== null) {
                        BC.version = version[1];
                        theme.setAttribute('href',`/static/${BC.version}/css/theme-default-night.css`);
                    }
                    BC.isDark = true;
                }
                BC.setPreferencesCookie("theme", "night");
                d.documentElement.classList.add("night");
                BC.persistTryDT = 0;
            }
            else if (!BC.isDark && BC.persistTryDT++ < 30) {
                w.setTimeout(BC.setTheme, 1000);
            }
        }
        if (!BC.isTheme && BC.settings.color != 'none') {
            BC.isTheme = true;
            colours = {
                'orange':{dark:'#ef4136',lighter:'#f37835',lightest:'#f0af5a'},
                 'green':{dark:'#46a604',lighter:'#35c453',lightest:'#55a47c'},
                  'blue':{dark:'#2532e0',lighter:'#2567e0',lightest:'#559bcc'}
            };
            c = colours[BC.settings.color];
            style = dce("style");
            style.type = "text/css";
            style.innerText = `
                .night .sidebar-heading, .night .subscribe-button, .night .btn-danger, .night #loader ul li {background-color: ${c.dark};}
                .night .sidebar-recent .video-card.active {box-shadow: 0 0 1em 0.2em ${c.lighter};} .night .nav-tabs>li.active {border-bottom-color:${c.dark};}
                .night .playlist-card.active {border-top: 1px solid ${c.lighter}bb; box-shadow: 0 2px 1em 0.2em ${c.lighter};}
                .night body, .night .video-card .video-card-text, .night .video-card .video-card-text p i, .night .notify-button,
                .night .channel-notify-button, .night .channel-videos-details, .night .channel-videos-title a, .night .channel-videos-text,
                .night .video-trending-details, .night .video-trending-title a, .night .video-trending-channel a, .night .video-trending-text,
                .night .playlist-video .details, .night .playlist-video .title a, .night .playlist-video .channel a, .night .playlist-video .description,
                .night #smarty_tab label, .night #smarty_tab #blacklistedchannels span, .night .jquery-comments ul.main li.comment time,
                .night .video-detail-text p, .night .video-information .sharing-drop span, .night #nav-top-menu .search-box .form-control, .jquery-comments .no-data { color: ${c.lightest};}
                .night a:link, .night a:active, .night a:visited, .night a:focus, .night .scripted-link, .night #nav-top-menu .unauth-link a, .night .jquery-comments ul.navigation li,
                .night .video-card .video-card-text a, .night #nav-top-menu .user-link a, .night #day-theme a svg, .night .search-icon svg { color: ${c.lighter};}
                .night #nav-side-menu .side-toggle:hover, .night #day-theme a svg:hover, .night .search-icon svg:hover, .night #smarty_tab label:hover, .night #smarty_tab #blacklistedchannels span:hover,
                .night a:hover, .night .scripted-link:hover, .night #screenshot .cancel:hover, .night #screenshot .save a:hover, .night .jquery-comments ul.navigation li.active, .night .jquery-comments ul.navigation li:hover {color: ${c.dark} !important;}
                .night #video_download_dialog button[disabled]:not(.download_finished):not(.download_error):hover {background-color: ${c.dark} !important;}
                .night .tags ul li a, .night #show-comments {background-color: #3b383c; border-radius:5px;} .night .tags ul li a:hover {background-color: #4d484e;} .creator-monetization {color: #30a247;}
                .night .channel-banner .name a.userisblacklisted {text-decoration-color: yellow;} .night #video_download_dialog hr {background: linear-gradient(to right, #211f22 0%, ${c.dark} 50%, ${c.dark} 50%, #211f22 100%) !important;}
                .night .radiohelper::before, .night .cbhelper::before {border: 1px solid ${c.dark};}
                .night .smartybox input[type="checkbox"]:checked ~ .cbhelper::before, .night .smartybox input[type="radio"]:checked ~ .radiohelper::before {background: linear-gradient(to bottom, ${c.lightest}33 0%, ${c.dark}66 100%) !important;}`;
            d.documentElement.appendChild(style);
        }
    },


    persistTryATL: 0, buttonFound: false,

    addThemeListeners: () => {
        let toDay   = qs('#day-theme a'),
            toNight = qs('#night-theme a');

        if (toDay && toNight && !BC.buttonFound) {
            BC.buttonFound = true;
            toDay.addEventListener('click', function(e) {
                if (e.which===1)
                    BC.toggleSettings('usedark', false)
            }, false);

            toNight.addEventListener('click', function(e) {
                if (e.which===1)
                    BC.toggleSettings('usedark', true)
            }, false);
        }
        else if (BC.persistTryATL++ < 30 && !BC.buttonFound) setTimeout(BC.addThemeListeners, 1000);
    },


    persistTryHC: 0, showComments: null,

    hideComments: (e) => {
        let comments = qs('#comments-container');
        let container = qs('#comment-frm-container');
        let comment_cnt = qsa('#comments-container li.comment');
        let nocomments = qs('.video-no-comments p') && !qs('.video-no-comments a');
        BC.showComments = qs('#comment-frm-container > #show-comments');

        if (nocomments || BC.showComments) return;
        if (container && comments) {
            if (qs('#comments-container #comment-list') === null) {
                if (BC.persistTryHC++ < 60 && !BC.showComments)
                    setTimeout(BC.hideComments, 1000);
                return
            }
            BC.showComments = dce("div");
            BC.showComments.id = 'show-comments';
            BC.showComments.innerHTML = `<span class="scripted-link">Show ${comment_cnt.length} Comment${comment_cnt.length === 1 ? '' : 's'}</span>`;
            BC.showComments.style = "width:100%;height:38px;margin:0px;padding:8px;text-align:center;border-radius:5px;";
            container.insertBefore(BC.showComments, comments);
            comments.style.display = 'none';
            BC.showComments.addEventListener('click', function(e) {
                if (e.which===1) {
                    qs('#comments-container').style.display = 'block';
                    this.style.display = 'none';
                }
            }, false);
        } else if (BC.persistTryHC++ < 30 && !BC.showComments) setTimeout(BC.hideComments, 2000);
    },


    fetchingMoreRecentVideos: 0,

    addMoreRecentVideos: (offset = -1, playlist = null) => {
        let data, link, xhr, sensitivity;
        let extend = "",
            name = null,
            showall = "";

        if (!playlist) {
            if (BC.fetchingMoreRecentVideos == offset) return;
            BC.fetchingMoreRecentVideos = offset;
            link = qs('.details .name a');
            if (link) name = link.href.match( /\/channel\/([a-z0-9_-]+)\//i );
        }
        else {
            link = `${location.protocol}//${BC.host}/playlist/${playlist}/`;
        }
        sensitivity = d.cookie.match(/sensitivity=((true)|(false))/i);
        if (name || playlist) {
            if (scriptHandler == "Greasemonkey"){xhr = new BC.SM_XMLHttpRequest()}else{xhr = new XMLHttpRequest()}
            if (playlist) {
                data = `csrfmiddlewaretoken=${BC.getCsrftoken()}`;
                xhr.addEventListener("load", (e) => { BC.pare(e, playlist) });
                xhr.addEventListener("error", (e) => { error('XMLHttpRequest playlist videos error: '+ e) });
            }
            else {
                if (sensitivity && sensitivity[1] == 'true') showall = '?showall=1';
                if (offset >= 0) {
                    extend = "extend/";
                    offset = `&offset=${offset}`;
                }
                data = `csrfmiddlewaretoken=${BC.getCsrftoken()}&name=${name[1]}${offset}`;
                xhr.addEventListener("load", (e) => { BC.pear(e) });
                xhr.addEventListener("error", (e) => { error('XMLHttpRequest recent videos error: '+ e) });
            }
            xhr.open("POST", `${link}${extend}${showall}`, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    },


    SM_XMLHttpRequest: function() {
        /* Used only under Greasemonkey due to lack of Referer header */
        this.headers = {"Referer": BC.url}
        this.listeners = {load: null, abort: null, error: null, timeout: null,
                                      progress: null, readystatechange: null};
        this.addEventListener = function(event, data) {
            if (Object.keys(this.listeners).indexOf(event) !=-1)
                this.listeners[event] = data
        }
        this.setRequestHeader = function(header, data) {
            this.headers[header] = data
        }
        this.open = function(method, url) {
            this.method = method;
            this.url = url;
        }
        this.send = function(data = null) {
            var xhr = GM.xmlHttpRequest({
                              data: data,
                               url: this.url,
                            method: this.method,
                           headers: this.headers,
                            onload: this.listeners.load,
                           onabort: this.listeners.abort,
                           onerror: this.listeners.error,
                         ontimeout: this.listeners.timeout,
                        onprogress: this.listeners.progress,
                onreadystatechange: this.listeners.readystatechange
            });
        }
    },


    pear: (e) => {
        try {
            e = typeof e.target === "undefined" ? {target: e} : e;
            let i, a1, title, pdate, card, cards, active,
                hidden, sidebar, offset, addedoffset, showmore;
            let result = JSON.parse(e.target.responseText);

            if ('undefined' !== result.success && result.success) {
                hidden = dce("div");
                sidebar = qs('.sidebar-recent');
                if (sidebar) {
                    hidden.innerHTML = result.html;
                    offset = qsa('.video-card', sidebar).length;
                    cards = qsa('.channel-videos-container', hidden);
                    addedoffset = cards.length;
                    showmore = dce("div");
                    showmore.className="show-more-container";
                    showmore.innerHTML = '<div class="show-more"><span>SHOW MORE</span></div>';
                    for (i = 0; i < cards.length; i++) {
                        a1 = qs('.channel-videos-image-container', cards[i]).innerHTML
                            .replace('channel-videos-image','video-card-image')
                            .replace(/_640x360/g,'_320x180');
                        title = qs('.channel-videos-title', cards[i]).innerHTML;
                        pdate = qs('.channel-videos-details span', cards[i]).innerText;
                        card = dce("div");
                        card.className="video-card more";
                        card.innerHTML = a1 + `
                              <div class="video-card-text">
                                <p class="video-card-title">${title}</p>
                                <p class="video-card-published">${pdate}</p>\n</div>`;
                        sidebar.appendChild(card);
                    }
                    active = qs('.active', sidebar);
                    if (active) active.classList.remove("active");
                    active = qs(`.video-card > a[href='${BC.path}']`, sidebar);
                    if (active) active.parentNode.classList.add("active");
                    if (offset == 6 && addedoffset == 25) {
                        sidebar.parentNode.appendChild(showmore);
                        qs('.show-more').classList.remove("hidden");
                        qs('.show-more').addEventListener("click", function(e){ BC.addMoreRecentVideos(offset+addedoffset+2) }, false);
                    }
                    else if (offset > 6 && addedoffset == 25 && qs('.show-more')) {
                        qs('.show-more').outerHTML = showmore.outerHTML;
                        qs('.show-more').classList.remove("hidden");
                        qs('.show-more').addEventListener("click", function(e){ BC.addMoreRecentVideos(offset+addedoffset+2) }, false);
                    }
                }
            }
            else { error('XMLHttpRequest recent videos request error') }
            BC.fetchingMoreRecentVideos = 0;
        } catch (e) { error('XMLHttpRequest recent videos parsing error: '+ e) }
    },


    pare: (e, playlist) => {
        try {
            e = typeof e.target === "undefined" ? {target: e} : e;
            let i, r, a, q, h, a1, br, title, name, icon, pchan, pdate,
                card, active, hidden, content, sidebar, cards;
            let result = JSON.parse(e.target.responseText),
                index = 0,
                seqId = 0,
                cards2 = [];

            if ('undefined' !== result.success && result.success) {
                cards = qs('.sidebar-recent');
                hidden = dce("div");
                content = dce("div");
                content.className = "playlist_sidebar";
                sidebar = dce("h2");
                sidebar.className = "sidebar-heading playlists";
                cards.insertBefore(content, cards.firstChild);
                cards.insertBefore(sidebar, cards.firstChild);
                hidden.innerHTML = result.html;
                cards = qsa('.playlist-video div.row', hidden);
                title = qs('#playlist-title', hidden).innerText;
                name = qs('.details .name a').innerText;
                title = `${cards.length == 25 ? "First 25" : cards.length} videos from ${name}'s \"${title}\" playlist.`;
                icon = qs('.sidebar-recent h2 span');
                icon.setAttribute("data-original-title", title);
                sidebar.innerText = "Playlist Videos";
                sidebar.appendChild(icon);

                a = BC.url.match( /\/video\/([a-z0-9_-]+)\//i )[1];
                r = new RegExp (`/video/${a}/`, 'i');
                for (i = 0; i < cards.length; i++) {
                    q = qs('.image-container a', cards[i]).href;
                    if (r.test(q)) index = i;
                    cards[i].setAttribute("id", i+1);
                    cards2.push(cards[i].outerHTML);
                }

                if (index !== 0) {
                    cards = new Array(cards2.length);
                    cards2.forEach( (item, i) => {
                        h = new DOMParser().parseFromString(item, 'text/html');
                        h = qs("body > div.row", h);
                        if (i < index) cards[cards2.length - index + i] = h;
                        else cards[i - index] = h;
                    })
                }

                for (i = 0; i < cards.length; i++) {
                    if (a1 = qs('.image-container', cards[i])) {
                        a1 = a1.innerHTML
                            .replace('image','video-card-image')
                            .replace(/_640x360/g,'_320x180')
                            .replace(/<\/div>/,'')
                            .replace(/<\/a>/,'<\/div><\/a>');
                        seqId = cards[i].id;
                        title = qs('.text-container .title', cards[i]).innerHTML;
                        pchan = qs('.text-container .channel', cards[i]).innerHTML;
                        pdate = qs('.text-container .details span', cards[i]).innerText;
                        q = qs('.image-container a', cards[i]).href.match( /\/video\/([a-z0-9_-]+)\//i )[1];
                        card = dce("div");
                        card.className="video-card more";
                        card.setAttribute("q", q);
                        card.innerHTML = a1 + `
                              <div class="video-card-text">
                                <p class="video-card-title">${title}</p>
                                <p class="video-card-channel">${pchan}</p>
                                <p class="video-card-published">${pdate}</p>
                                <span class="video-card-published sequence">${seqId}</span>\n</div>`;
                        content.appendChild(card);
                    }
                }
                active = qs('.active', content);
                if (active) active.classList.remove("active");
                active = qs(`.video-card[q='${a}']`, content);
                if (active) active.classList.add("active");
                setTimeout(() => {content.style.maxHeight = `${content.getBoundingClientRect().height}px`;}, 1500);
                sidebar.addEventListener("click", function(e){
                    setTimeout(() => {e.target.classList.toggle("slidein");}, 750);
                    qs(".playlist_sidebar").classList.toggle("slidein");
                }, false);
            }
            else { error('XMLHttpRequest playlist videos request error') }
            BC.fetchingMoreRecentVideos = 0;
        } catch (e) { error('XMLHttpRequest playlist videos parsing error: '+ e) }
    },


    fetchingMvplaylist: !1,
    mostViewedPlaylist: {slider:null,index:0,length:0,cardWidth:function(){let o = qs('.mvplaylist').getBoundingClientRect();return (!o || !o.width ? 0 : Math.round(o.width/240))}},

    addMostViewedPlaylist: () => {
        let el, comments, parent, row, xhr, data, showall;
        let link = qs('.details .name a'),
            sensitivity = d.cookie.match(/sensitivity=((true)|(false))/i);

        if (qs('.mvplaylist.row') || BC.fetchingMvplaylist) return;
        else {
            parent = qs('.video-container');
            row = dce("div");
            row.className = 'mvplaylist row';
            if (comments = qs('.comments.row')) {
                el = comments;
            }
            else {
                el = parent.children[3];
                el.className = 'comments row';
            }
            parent.insertBefore(row, el);
        }
        if (link) {
            BC.fetchingMvplaylist = 1;
            if (scriptHandler == "Greasemonkey"){xhr = new BC.SM_XMLHttpRequest()}else{xhr = new XMLHttpRequest()}
            data = 'csrfmiddlewaretoken='+ BC.getCsrftoken();
            showall = '';
            if (sensitivity)
                if (sensitivity[1] == 'true') showall = '?showall=1';

            xhr.addEventListener("load", (e) => { BC.peer(e) });
            xhr.addEventListener("error", (e) => { error('XMLHttpRequest most viewed error: '+ e) });
            xhr.open("POST", link + showall, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    },


    peer: (e) => {
        try {
            e = typeof e.target === "undefined" ? {target: e} : e;
            let i, hidden, html, active, cards, row, title, content,
                arrow, slider, cardActive, cds, pos, left, right;
            let result = JSON.parse(e.target.responseText);

            if ('undefined' !== result.success && result.success) {
                hidden = dce("div");
                html = result.html.match(/(<div class="video-card"[^<]*?>[\s\S]*<\/div>[\s\n]*?<\/div>)[\s\n]*?<\/div>[\s\n]*?<\/div>/i);
                if (html && html[1]) {
                    hidden.innerHTML = html[1];
                    active = '';
                    cards = qsa('.video-card', hidden);
                    row = qs(".mvplaylist.row");
                    title = dce("div");
                    content = dce("div");
                    arrow = dce("div");
                    slider = dce("div");
                    BC.mostViewedPlaylist.length = cards.length;
                    BC.mostViewedPlaylist.slider = slider;
                    title.className = 'playlist-title';
                    title.innerHTML = `<h2 class="sidebar-heading">Most Viewed (${cards.length})</h2>`;
                    row.appendChild(title);
                    arrow.className = 'playlistbt';
                    content.appendChild(arrow);
                    arrow = dce("div");
                    arrow.className = 'playlistdn playlistbtn disabled';
                    arrow.innerHTML = '<b>&lt;</b>';
                    content.style = 'width: 100%;margin: 0px;padding: 0px; overflow:hidden;display: inline-block; max-height: 205px;';
                    content.appendChild(arrow);
                    arrow = dce("div");
                    arrow.className = `playlistup playlistbtn${cards.length > 3 ? '' : ' disabled'}`;
                    arrow.innerHTML = '<b>&gt;</b>';
                    content.appendChild(arrow);
                    slider.className = 'mvslider';

                    for (i = 0; i < cards.length; i++) {
                        cardActive = qs(`a[href='${BC.path}']`, cards[i]);
                        if (cardActive) {
                            cds = Math.round( (row.getBoundingClientRect().width - 60) / 218 );
                            pos = (i > cards.length - cds) ? cards.length - cds : i;
                            BC.mostViewedPlaylist.slider.style.marginLeft = `-${pos * 218}px`;
                            if (pos > 0) qs('.playlistdn', content).classList.remove('disabled');
                            if (pos >= cards.length - cds) qs('.playlistup', content).classList.add('disabled');
                            BC.mostViewedPlaylist.index = pos;
                            active = ' active';
                        }
                        else active = '';
                        cards[i].className += ' playlist-card'+ active;
                        cards[i].innerHTML = cards[i].innerHTML.replace(/<\/div>(?![\s\S]*<\/div>)/, '\n<span class="video-card-published sequence">'+(i+1)+'</span>\n</div>');
                        slider.appendChild(cards[i]);
                    }
                    content.appendChild(slider);
                    row.appendChild(content);

                    left = qs('.mvplaylist .playlistdn');
                    left.addEventListener("click", function(e) {
                        if (this.classList.contains('disabled')) return false;
                        if (BC.mostViewedPlaylist.index > 0) {
                            BC.mostViewedPlaylist.slider.style.marginLeft = `-${--BC.mostViewedPlaylist.index * 218}px`;
                            if (BC.mostViewedPlaylist.index <= 0) this.classList.add('disabled');
                            if (BC.mostViewedPlaylist.index < BC.mostViewedPlaylist.length + BC.mostViewedPlaylist.cardWidth()) this.nextSibling.classList.remove('disabled');
                        }
                    });
                    right = qs('.mvplaylist .playlistup');
                    right.addEventListener("click", function(e) {
                        if (this.classList.contains('disabled')) return false;
                        if (BC.mostViewedPlaylist.index <= BC.mostViewedPlaylist.length - BC.mostViewedPlaylist.cardWidth()) {
                            BC.mostViewedPlaylist.slider.style.marginLeft = `-${++BC.mostViewedPlaylist.index * 218}px`;
                            if (BC.mostViewedPlaylist.index + BC.mostViewedPlaylist.cardWidth() >= BC.mostViewedPlaylist.length) this.classList.add('disabled');
                            if (BC.mostViewedPlaylist.index > 0) this.previousSibling.classList.remove('disabled');
                        }
                    });
                }
            }
            else { error('XMLHttpRequest most viewed request error') }
            BC.fetchingMvplaylist = !1;
        } catch (e) { error('XMLHttpRequest most viewed parsing error: '+ e) }
    },


    playlists: {}, fetchingPlaylists: !1,

    addChannelPlaylists: () => {
        let xhr, data, showall;
        let link = qs('.details .owner a');

        if (qs('.playlist.row') || BC.fetchingPlaylists) return;
        BC.fetchingPlaylists = 1;
        if (link) {
            if (scriptHandler == "Greasemonkey"){xhr = new BC.SM_XMLHttpRequest()}else{xhr = new XMLHttpRequest()}
            data = 'csrfmiddlewaretoken='+ BC.getCsrftoken();
            showall = '';
            xhr.addEventListener("load", (e) => { BC.addPlaylist(e) });
            xhr.addEventListener("error", (e) => { error('XMLHttpRequest most viewed error: '+ e) });
            xhr.open("POST", link, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    },


    playAll: null,
    addPlaylist: (e) => {
        try {
            e = typeof e.target === "undefined" ? {target: e} : e;
            let link, plName, xhr, m, re, el, row, comments, parent, data;
            let i = 0,
                result = JSON.parse(e.target.responseText);

            if ('undefined' !== result.success && result.success) {
                parent = qs('.video-container');
                data = 'csrfmiddlewaretoken='+ BC.getCsrftoken();
                re = /class="playlist-card">[\n\s]+<a href="([a-zA-Z0-9\/_-]+)"[\s\S]*?(?!<\/a)+<div class="title">(.*)<\/div>/g
                do {
                    m = re.exec(result.html);
                    if (m) {
                        if (scriptHandler == "Greasemonkey"){xhr = new BC.SM_XMLHttpRequest()}else{xhr = new XMLHttpRequest()}
                        plName = 'pl'+ m[1].substr(10, 12);
                        BC.playlists[plName] = {item:i++,slider:null,index:0,length:0,cardWidth:function(){let o = qs('#'+ plName +'.playlist').getBoundingClientRect();return (!o || !o.width ? 0 : Math.round(o.width/240))}};
                        row = qs('#'+plName+'.playlist.row');
                        if (!row) {
                            row = dce("div");
                            row.className = 'playlist row';
                            row.setAttribute('id', plName);
                            if (comments = qs('.comments.row')) {
                                el = comments;
                            }
                            else {
                                if (BC.settings.mvplaylist)
                                    el = parent.children[4];
                                else el = parent.children[3];
                                el.className = 'comments row';
                            }
                            parent.insertBefore(row, el);
                        }
                        link = location.protocol +"//"+ BC.host + m[1];

                        xhr.addEventListener("load", (e) => { BC.pier(e) });
                        xhr.addEventListener("error", (e) => { error('XMLHttpRequest most viewed error: '+ e) });
                        xhr.open("POST", link, true);
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhr.send(data);
                    }
                } while (m);
            }
            else {
                error('XMLHttpRequest profile page request error');
                BC.fetchingPlaylists = !1;
            }
        } catch (e) { error('XMLHttpRequest profile page parsing error: '+ e) }
    },


    pier: (e) => {
        try {
            e = typeof e.target === "undefined" ? {target: e} : e;
            let i, a1, pdate, link, hidden, html, card, cards, active,
                showMore, plName, row, title, content, arrow, slider,
                href, pos, cds, play, cardActive, left, right;
            let result = JSON.parse(e.target.responseText);

            if ('undefined' !== result.success && result.success) {
                if (!BC.playAll) {
                    BC.playAll = result.html.match( /<span class="fa-layers">.*<\/span>/ );
                    if (BC.playAll) BC.playAll = BC.playAll[0].replace('<span', '<span title="Play All"')
                }
                link = result.canonical.match( /.*\/playlist\/([a-z0-9_-]+)\//i );
                hidden = dce("div");
                html = result.html.match(/(<div .* class="playlist-video"[^<]*?>[\s\S]*<\/div>[\s\n]*?<\/div>)[\s\n]*?<\/div>[\s\n]*?<\/div>/i);
                if (html && html[1]) {
                    hidden.innerHTML = html[1];
                    active = '';
                    plName = 'pl'+ link[1];
                    cards = qsa('.playlist-video > div.row', hidden);
                    showMore = qs('.show-more-container .show-more:not(.hidden)', hidden);
                    row = qs("#"+ plName +'.row');
                    title = dce("div");
                    content = dce("div");
                    arrow = dce("div");
                    slider = dce("div");
                    BC.playlists[plName].length = cards.length;
                    BC.playlists[plName].slider = slider;
                    title.className = 'playlist-title';

                    title.innerHTML = `<h2 class="sidebar-heading">${result.title} (${cards.length})${BC.playAll}</h2>`;
                    row.appendChild(title);
                    if (BC.playAll) {
                        href = qs('a', cards[0]).href.match( /(\/video\/[a-z0-9_-]+\/).*/i )[1];
                        qs('span', title).addEventListener("click", (e) => {
                            w.location.href = `${href}?list=${link[1]}&randomize=false`
                        });
                    }

                    arrow.className = 'playlistbt';
                    content.appendChild(arrow);
                    arrow = dce("div");
                    arrow.className = `playlistdn playlistbtn ${plName} disabled`;
                    arrow.innerHTML = '<b>&lt;</b>';
                    content.style = 'width: 100%;margin: 0px;padding: 0px; overflow:hidden;display: inline-block; max-height: 205px;';
                    content.appendChild(arrow);
                    arrow = dce("div");
                    arrow.className = `playlistup playlistbtn ${plName + (cards.length > 3 ? '' : ' disabled')}`;
                    arrow.innerHTML = '<b>&gt;</b>';
                    content.appendChild(arrow);
                    slider.className = 'plslider';

                    for (i = 0; i < cards.length; i++) {
                        if (a1 = qs('.image-container', cards[i])) {
                            a1 = a1.innerHTML
                                .replace('image','video-card-image')
                                .replace(/_640x360/g,'_320x180')
                                .replace(/<\/div>/,'')
                                .replace(/<\/a>/,'<\/div><\/a>');
                            title = qs('.text-container .title', cards[i]).innerHTML;
                            pdate = qs('.text-container .details span', cards[i]).innerText;
                            card = dce("div");
                            card.className="video-card";
                            card.innerHTML = a1 + `
                                  <div class="video-card-text">
                                    <p class="video-card-title">${title}</p>
                                    <p class="video-card-published">${pdate}</p>
                                    <span class="video-card-published sequence">${i+1}</span>\n</div>`;

                            play = qs("a", card).getAttribute("href");
                            cardActive = play.indexOf(BC.path) !=-1;
                            if (cardActive) {
                                cds = Math.round( (row.getBoundingClientRect().width - 60) / 218 );
                                pos = (i > cards.length - cds) ? cards.length - cds : i;
                                BC.playlists[plName].slider.style.marginLeft = `-${pos * 218}px`;
                                if (pos > 0) qs(`.playlistdn.${plName}`, content).classList.remove('disabled');
                                if (pos >= cards.length - cds) qs(`.playlistup.${plName}`, content).classList.add('disabled');
                                BC.playlists[plName].index = pos;
                                active = ' active';
                            }
                            else active = '';
                            card.className += ' playlist-card'+ active;
                            slider.appendChild(card);
                        }
                    }
                    content.appendChild(slider);
                    row.appendChild(content);

                    left = qs('.playlistdn.'+ plName);
                    left.addEventListener("click", function(e) {
                        if (this.classList.contains('disabled')) return false;
                        if (BC.playlists[plName].index > 0) {
                            BC.playlists[plName].slider.style.marginLeft = `-${--BC.playlists[plName].index * 218}px`;
                            if (BC.playlists[plName].index <= 0) this.classList.add('disabled');
                            if (BC.playlists[plName].index < BC.playlists[plName].length + BC.playlists[plName].cardWidth()) this.nextSibling.classList.remove('disabled');
                        }
                    });
                    right = qs('.playlistup.'+ plName);
                    right.addEventListener("click", function(e) {
                        if (this.classList.contains('disabled')) return false;
                        if (BC.playlists[plName].index <= BC.playlists[plName].length - BC.playlists[plName].cardWidth()) {
                            BC.playlists[plName].slider.style.marginLeft = `-${++BC.playlists[plName].index * 218}px`;
                            if (BC.playlists[plName].index + BC.playlists[plName].cardWidth() >= BC.playlists[plName].length) this.classList.add('disabled');
                            if (BC.playlists[plName].index > 0) this.previousSibling.classList.remove('disabled');
                        }
                    });
                }
            }
            else { error('XMLHttpRequest playlists request error') }
            BC.fetchingPlaylists = !1;
        } catch (e) { error('XMLHttpRequest playlists parsing error: '+ e) }
    },


    playNextFullScreenCancel: null, nextUp: {}, prevUp: [], history:-1, nextUpLoaded: false, countsRefreshed: false,

    playNextFullScreen: (vector = null) => {
        let xhr, data;
        if (!BC.isFullScreen) return;
        debug('playNextFullScreen typeof vector: ',typeof vector);
        if (typeof vector === "object") vector = null;
        const fetch = function() {
            return new Promise((resolve, reject) => {
                let url, link = qs('.sidebar-next .video-card a:not(#block_playnext)');

                if (link) {
                    url = link.href;
                    if (scriptHandler == "Greasemonkey"){xhr = new BC.SM_XMLHttpRequest()}else{xhr = new XMLHttpRequest()}
                    data = 'csrfmiddlewaretoken='+ BC.getCsrftoken();
                    xhr.addEventListener("error", (e) => { error('XMLHttpRequest playNextFullScreen error: '+ e); reject() });
                    xhr.addEventListener("load", (res) => {
                        try {
                            let e = typeof res.target === "undefined" ? {target: res} : res;
                            let content, card, now = qs(".sidebar-next .video-card");
                            let result = JSON.parse(e.target.responseText);

                            if ('undefined' !== result.success && result.success) {
                                const getHistoryItem = (hidden) => {
                                    card = qs(".sidebar-next .video-card", hidden);

                                    let nextUp = {
                                        url: url,
                                        history: BC.history,
                                        src: qs("video#player source", hidden).src,
                                        type: qs("video#player source", hidden).type,
                                        poster: qs("video#player", hidden).poster,
                                        tracks: qsa("video#player track", hidden),
                                        count: qs("#video-view-count", hidden).innerHTML,
                                        likes: qs("#video-like-count", hidden).innerHTML,
                                        dislike: qs("#video-dislike-count", hidden).innerHTML,
                                        pdate: qs(".video-publish-date", hidden).innerText,
                                        hashtags: qs("#video-hashtags", hidden).innerHTML,
                                        title: qs("#page-bar #video-title", hidden).innerText,
                                        tooltip: qs(".sidebar-next h2.sidebar-heading", hidden).innerHTML,
                                        recent: qsa(".sidebar-recent div.video-card:not(.more)", hidden),
                                        teaser: qs("#video-description .teaser", hidden).innerHTML,
                                        full: qs("#video-description .full", hidden).innerHTML,
                                        actions: qsa(".video-actions .action-list a", hidden),
                                        appealScript: qs("#appeal-modal + script", hidden),
                                        reportScript: qs("#report-modal + script", hidden),
                                        link: qs('.sidebar-next .video-card a:not(#block_playnext)', card).href,
                                        image: qs(".video-card-image img", card).getAttribute("data-src"),
                                        views: qs(".video-card-image .video-views", card).innerText,
                                        duration: qs(".video-card-image .video-duration", card).innerText,
                                        text: qs(".video-card-text", card).innerHTML,
                                        now: {
                                            image: qs(".video-card-image img", now).getAttribute("data-src"),
                                            arrow: qs(".video-card-image img.play-overlay", now).getAttribute("src"),
                                            views: qs(".video-card-image .video-views", now).innerText,
                                            duration: qs(".video-card-image .video-duration", now).innerText,
                                            text: qs(".video-card-text", now).innerHTML
                                        }
                                    }
                                    return nextUp
                                }
                                if (!BC.prevUp.length) {
                                    BC.history += 1;
                                    BC.prevUp.push(getHistoryItem(qs("#main-content")));
                                    let mt = new Date(null);
                                    mt.setSeconds(qs("video#player").duration);
                                    mt = mt.toISOString().substr(11, 8);
                                    while (mt[0] == "0" || mt[0] == ":") mt = mt.substr(1);
                                    BC.prevUp[0].url = BC.url;
                                    BC.prevUp[0].now.duration = mt;
                                    BC.prevUp[0].now.image = qs("video#player").poster;
                                    BC.prevUp[0].now.text = `<p class="video-card-title"><a href="/video/12345678901/">${qs("title").innerText}</a></p><p class="video-card-published">${qs(".video-publish-date b").innerText}</p>`;
                                    BC.prevUp[0].now.views = qs("#video-view-count").innerText;
                                }
                                BC.history += 1;
                                content = dce("div");
                                content.innerHTML = result.html;
                                BC.nextUp = getHistoryItem(content);
                                BC.prevUp.push(BC.nextUp);
                                resolve()
                            } else reject()
                        } catch (e) { error('XMLHttpRequest playNextFullScreen parsing error: '+ e); reject() }
                    });
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.send(data);
                }
            });
        }
        const render = (dir, next) => {
            let path,
                card = qs(".sidebar-next .video-card");
            BC.closeItem("details");
            if (qs("#video-view-count")) qs("#video-view-count").setAttribute("id", "fs-view-count");
            if (qs("#video-like-count")) qs("#video-like-count").setAttribute("id", "fs-like-count");
            if (qs("#video-dislike-count")) qs("#video-dislike-count").setAttribute("id", "fs-dislike-count");
            qs("#fs-view-count").innerHTML = next.count;
            qs("#fs-like-count").innerHTML = next.likes;
            qs("#fs-dislike-count").innerHTML = next.dislike;
            qs(".video-publish-date").innerHTML = next.pdate;
            qs("#video-hashtags").innerHTML = next.hashtags;
            if (qs("#disqus_thread")) qs("#disqus_thread").innerHTML = "";
            qs(".sidebar-next h2.sidebar-heading").innerHTMl = next.tooltip;
            qs("#video-description .teaser").innerHTML = next.teaser;
            qs("#video-description .full").innerHTML = next.full;
            qs(".video-actions .action-list").innerHTML = "";
            next.actions.forEach((o) => {qs(".video-actions .action-list").appendChild(o)});

            qsa(".sidebar-recent div.video-card").forEach((o) => {o.parentNode.removeChild(o)});
            next.recent.forEach((o) => {qs(".sidebar-recent").appendChild(o)});

            qs("a:not(#block_playnext)", card).href = next.link;
            qs(".video-card-title a", card).href = next.link;
            qs(".video-card-image img", card).classList.replace("lazyloaded", "lazyload");
            qs(".video-card-image img", card).setAttribute("src", next.image);
            qs(".video-card-image img", card).setAttribute("data-src", next.image);
            qs(".video-card-image img.play-overlay", card).setAttribute("src", next.now.arrow);
            qs(".video-card-image .video-views", card).innerText = next.views;
            qs(".video-card-image .video-duration", card).innerText = next.duration;
            qs(".video-card-text", card).innerHTML = next.text;
            qs("#main-content").replaceChild(next.appealScript, qs("#appeal-modal + script"));
            qs("#main-content").replaceChild(next.reportScript, qs("#report-modal + script"));
            BC.player.api.pause();
            BC.player.api.removeAttribute("autoplay");
            let source = dce("source");
            source.setAttribute("src", next.src);
            source.setAttribute("type", next.type);
            qs("video#player").setAttribute("poster", next.poster);
            qs(".plyr__poster").style.backgroundImage = `url("${next.poster}")`;
            if (BC.player.api.readyState < 2) qs(".plyr").classList.add("plyr--stopped");
            BC.player.api.replaceChild(source, qs("video#player source"));
            qsa("video#player track").forEach((o) => {qs("video#player").removeChild(o)});
            next.tracks.forEach((o) => {qs("video#player").appendChild(o)});
            BC.player.api.load();
            qs("#page-bar #video-title").innerText = next.title;
            path = next.url.match( /(\/video\/[a-z0-9_-]+\/).*/i )[1];

            if (path != BC.path) {
                if (!BC.countsRefreshed) {
                    /* Push the page at going fullscreen */
                    debug("FullScreen Pushing History 0");
                    w.history.pushState({'url': BC.url}, '', BC.url);
                }
                    /* Cant pop history states any longer, so just use the next state repeatedly - forward & back */
                debug("FullScreen Replacing History "+ (BC.history));
                w.history.replaceState({'url': next.url}, '', next.url);
                d.title = next.title;
                setTimeout((path)=>{BC.countsRefreshed = false; BC.refreshCounts(path)}, 1000, path);
                BC.nextUpLoaded = false;
                BC.nextUp = {}
            }
        }
        const playsoon = () => {
            let details = qs(".plyr #autoplay-details");
            let detail2 = qs(".wrapper > #autoplay-details");
            if (!details) {
                details = detail2.cloneNode(true);
                qs(".wrapper .plyr").appendChild(details);
                details.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    BC.closeItem("details");
                    return false
                }, false);
            }
            details.classList.remove('hidden');
            qs('.timer .spinner', details).classList.add('animate');
            qs('.timer .filler', details).classList.add('animate');
            qs('.timer .mask', details).classList.add('animate');
            detail2.classList.add("hidden");
            qs('.timer .spinner', detail2).classList.remove('animate');
            qs('.timer .filler', detail2).classList.remove('animate');
            qs('.timer .mask', detail2).classList.remove('animate');
            BC.playNextFullScreenCancel = setTimeout(() => {
                if (BC.playNextFullScreenCancel)
                    render("nextUp", BC.nextUp);
                else BC.closeItem("details");
            }, 4800)
        }
        const prevnext = () => {
            let apn;
            let nu = BC.nextUp.now;
            let pu = (("undefined" === typeof BC.prevUp[BC.history-2]) ? null : BC.prevUp[BC.history-2].now);
            let html = `${((!pu) ? "" : `<div class="video-card autoplay-prev" title="Play Previous Video">
                <a class="previmg" href="#"><div class="video-card-image">
                  <img class="img-responsive" src="${pu.image}" alt="play previous">
                  <img class="img-responsive play-overlay" src="${pu.arrow}" alt="prev">
                  <span class="video-views"><svg class="svg-inline--fa fa-eye fa-w-18" aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" role="img" `+
                    `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 `+
                    `0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 `+
                    `32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 `+
                    `112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg><!-- <i class="far fa-eye"></i> --> ${pu.views}</span>
                  <span class="video-duration">${pu.duration}</span></div></a>
                <div class="video-card-text">${pu.text.replace(/\/video\/[\w_-]+\//i, "#").replace(/<a href="\/channel.*>(.+)<\/a>/i,"$1")}</div></div>`)}
                <div class="video-card autoplay-next" title="Play Next Video">
                <a class="nextimg" href="#"><div class="video-card-image">
                  <img class="img-responsive" src="${nu.image}" alt="play next">
                  <img class="img-responsive play-overlay" src="${nu.arrow}" alt="next">
                  <span class="video-views"><svg class="svg-inline--fa fa-eye fa-w-18" aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" role="img" `+
                    `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 `+
                    `0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 `+
                    `32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 `+
                    `112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg><!-- <i class="far fa-eye"></i> --> ${nu.views}</span>
                  <span class="video-duration">${nu.duration}</span></div></a>
                <div class="video-card-text">${nu.text.replace(/\/video\/[\w_-]+\//i, "#").replace(/<a href="\/channel.*>(.+)<\/a>/i,"$1")}</div></div>`;
            apn = qs("#autoplay-next");
            apn.innerHTML = html;
            if (pu) qs(".previmg", apn).addEventListener('click', (e) => {e.stopPropagation();e.preventDefault();BC.playNextFullScreen(BC.history-2)}, false);
            if (pu) qs(".autoplay-prev .video-card-text a", apn).addEventListener('click', (e) => {e.stopPropagation();e.preventDefault();BC.playNextFullScreen(BC.history-2)}, false);
            qs(".nextimg", apn).addEventListener('click', (e) => {e.stopPropagation();e.preventDefault();BC.playNextFullScreen(-1)}, false);
            qs(".autoplay-next .video-card-text a", apn).addEventListener('click', (e) => {e.stopPropagation();e.preventDefault();BC.playNextFullScreen(-1)}, false);
            apn.classList.remove("hidden")
        }
        if (vector === null && BC.settings.playnext) {
            /* video ended
             * use next data if fetched, else
             * get next data, show playing soon & prev/next */
            playsoon();
            if (!BC.nextUpLoaded) {
                fetch().then( () => { prevnext() })
                       .catch( (err) => { error("playnext fetch Failed: "+err) });
            } else prevnext()
        }
        else if (vector || vector === 0) {
            /* background pre-auto load */
            if (vector == "load" && !BC.nextUpLoaded) {
                /* view previous was clicked */
                if ("undefined" !== typeof BC.prevUp[BC.history+1]) {
                    BC.nextUp = BC.prevUp[BC.history+1];
                    BC.nextUpLoaded = true;
                    BC.history += 1;
                /* fetch next */
                } else {
                    BC.nextUpLoaded = true;
                    fetch().then( () => {
                    }).catch( (err) => {
                        error("load playnext fetch Failed: "+err);
                        BC.nextUpLoaded = false;
                    });
                }
            /* render next video */
            } else if (vector == -1) {render("nextUp", BC.nextUp);
            /* render previous video */
            } else {
                BC.history = vector;
                render("prevUp", BC.prevUp[vector]);
            }
        }
        /* display only prev/next videos - no timer */
        else {
            if (!BC.nextUpLoaded) {
                fetch().then( () => { prevnext() })
                   .catch( (val) => { error("prevnext fetch Failed") });
            } else prevnext()
        }
    },


    onPlayerProgress: (e) => {
        if (BC.isFullScreen && !BC.nextUpLoaded) {
            let t = BC.player.api.currentTime, l = BC.player.api.duration;
            if(t && l && t/l > 0.00005) {
                BC.playNextFullScreen("load");
            }
        }
    },


    closeItem: (item) => {
        if (item == "details") {
            if (BC.playNextFullScreenCancel) {clearTimeout(BC.playNextFullScreenCancel); BC.playNextFullScreenCancel = null}
            if (item = qs('.plyr #autoplay-details')) {
                item.classList.add('hidden');
                qs('.timer .spinner', item).classList.remove('animate');
                qs('.timer .filler', item).classList.remove('animate');
                qs('.timer .mask', item).classList.remove('animate');
            }
        }
    },


    hideAutoplayNext: (e) => {
        if (qs(".plyr #autoplay-next")) {qs(".plyr #autoplay-next").classList.add("hidden")};
    },


    thumbas: null, thumbPlayerUrl: "", thumbs: [], thumbsLoaded: false, thWidth: 0,

    getVideoThumbnails: (e) => {
        let src, context,
            vid = e.target,
            seconds = vid.duration;
        if (vid.id == "thumbPlayer") {
            BC.thumbas = dce("canvas");
            BC.thumbas.style.display = "none";
            BC.thWidth = Math.ceil(vid.videoWidth / vid.videoHeight * 90);
            BC.thumbas.width = BC.thWidth;
            BC.thumbas.height = 90;
            vid.currentTime = 0.0333;
        }
        else {
            BC.thumbs = [];
            BC.thumbsLoaded = false;
            src = dce("source");
            src.src = qs("source", vid).src;
            BC.thumbPlayerUrl = src.src;
            debug("GetVideoThumbnails: "+ src.src);
            vid = dce("video");
            vid.style.display = "none";
            vid.setAttribute("width", BC.thWidth);
            vid.setAttribute("height", "90");
            vid.setAttribute("muted", "muted");
            vid.setAttribute("id", "thumbPlayer");
            vid.setAttribute("crossOrigin", "Anonymous");/* for webkit CORS */
            vid.addEventListener('seeked', function(e) {
                let secs, vid = e.target;
                if (BC.thumbPlayerUrl == e.target.currentSrc) {
                    context = BC.thumbas.getContext("2d");
                    context.drawImage(vid, 0, 0, BC.thumbas.width, 90);
                    let img = new Image();
                    img.src = BC.thumbas.toDataURL();
                    BC.thumbs.push(img);
                    secs = vid.currentTime + vid.duration/75;
                    if (secs < vid.duration) vid.currentTime = secs;
                    else {
                        BC.thumbPlayerUrl = "";
                        BC.thumbas = null;
                    }
                    if (BC.thumbs.length > 6 && !BC.thumbsLoaded) {
                        if (qs('#bcframes')) qs('#bcframes').parentNode.removeChild(qs('#bcframes'));
                        qs(".plyr__progress").addEventListener('mousemove', function(e) {
                            var fr = (BC.isFullScreen) ? qs(".plyr #bcframes") : qs("body > #bcframes");
                            var rect = e.target.getBoundingClientRect();
                            var key = Math.round(75 / rect.width * (e.pageX - rect.left));
                            var x = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
                            key = parseInt((key < 0) ? 0 : (key > 74) ? 74 : key);
                            var left = (e.pageX - (BC.thWidth / 2) < 20) ? 20 :
                                       (e.pageX + (BC.thWidth + 20) > x) ? x - (BC.thWidth + 20): e.pageX - (BC.thWidth / 2);
                            if (!fr) {
                                fr = dce("div");
                                fr.id = "bcframes";
                                fr.style.width = BC.thWidth +'px';
                                if (BC.isFullScreen) qs(".wrapper .plyr").appendChild(fr);
                                else qs("body").appendChild(fr);
                            }
                            if (BC.isFullScreen) fr.style.top = (w.innerHeight - 170) +'px';
                            else fr.style.top = (w.pageYOffset + rect.top - 130) +'px';
                            fr.style.left = left +'px';
                            fr.classList.add("visible");
                            if ("undefined" !== typeof BC.thumbs[key]) {
                                if (fr.firstChild) fr.replaceChild(BC.thumbs[key], fr.firstChild);
                                else fr.appendChild(BC.thumbs[key])
                            } else if (fr.firstChild) fr.removeChild(fr.firstChild)
                        })
                        qs(".plyr__progress").addEventListener('mouseleave', function(e) {
                            if (BC.isFullScreen && qs(".plyr #bcframes")) qs(".plyr #bcframes").classList.remove("visible");
                            if (qs("body > #bcframes")) qs("body > #bcframes").classList.remove("visible")
                        })
                        BC.thumbsLoaded = true
                    }
                }
            }, false);
            vid.addEventListener('error', (err) => {error(" Error: "+ err)}, false);
            vid.addEventListener('loadedmetadata', BC.getVideoThumbnails, false);
            vid.appendChild(src);
            vid.load()
        }
    },


    takeScreenShot: (e) => {
        if (qs("#takeScreenShot").classList.contains("disabled")) return;
        qs("#takeScreenShot").classList.add("disabled");
        let updateURL = (canv) => {
            canv.toBlob(function(blob) {
                let href = qs("#objectURL").href;
                (w.URL || w.webkitURL || w).revokeObjectURL(href);
                qs("#objectURL").href = (w.URL || w.webkitURL || w).createObjectURL(blob)
            })
        },
        flipImg = (vert = false) => {
            let ctxs, ctxd, canv = dce("canvas");
            canv.width = canvas.width;
            canv.height = canvas.height;
            ctxs = canv.getContext("2d");
            ctxs.drawImage(canvas, 0, 0);
            ctxd = canvas.getContext("2d");
            ctxd.save();
            if (vert) {
                ctxd.translate(0, canvas.height);
                ctxd.scale(1, -1);
            }
            else {
                ctxd.translate(canvas.width, 0);
                ctxd.scale(-1, 1);
            }
            ctxd.drawImage(canv, 0, 0);
            ctxd.restore();
            updateURL(canvas);
        }
        let a, tm, div, blob, save,
            context, close, action,
            canvasOffsetLeft,
            editInfo, canvasOffsetTop,
            vidRotateAngle = 0,
            vidScaleFactor = 1,
            vid = BC.player.api,
            time = vid.currentTime,
            width = vid.videoWidth,
            height = vid.videoHeight,
            title = Bcd.flattenTitle(d.title),
            canvas = dce("canvas"),
            editInfoTitle = ["(Save), reorient (⏎⇔⇕⚫), crop & enlarge (✂), or (Close)",
                             "Go back (⇦) to save or close, drag widget border to desired size to crop (✂), or set zoom slider and enlarge (⤧)"];

        canvas.id = "canvas";
        canvas.width = width;
        canvas.height = height;
        context = canvas.getContext("2d");
        context.drawImage(vid, 0, 0, width, height);
        canvas.toBlob(function(blob) {
            let mmactionT, mmactionL, actionT, actionL;
            tm = new Date(null);
            tm.setSeconds(time);
            tm = tm.toISOString().substr(11, 8);
            //while (tm[0] == "0" || tm[0] == ":") tm = tm.substr(1);/* Truncate leading zeros & colons */
            div = dce("div");
            div.setAttribute("id", "screenshot");
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!qs("#overlay")) {
                    let delay = (e.target.tagName === "A") ? 5000 : 500;
                    setTimeout((url) => {
                        (w.URL || w.webkitURL || w).revokeObjectURL(url);
                        qs("body").removeChild(qs("#screenshot"));
                        qs("#takeScreenShot").classList.remove("disabled");
                    }, delay, qs("#objectURL").href);
                    qs("#screenshot").style.opacity = 0
                }
            }, false);
            div.appendChild(canvas);
            
            editInfo = dce("div");
            editInfo.id = "editInfo";
            editInfo.innerText = "!";
            editInfo.className = "edit";
            editInfo.setAttribute('data', editInfoTitle[0]);
            div.appendChild(editInfo);

            action = dce("div");
            action.className = "action";
            action.style.cursor = "move";
            action.addEventListener("click", function(e) {
                if (!e.target.classList.contains('cancel') && e.target.id != 'objectURL') {
                    e.stopPropagation(); return false}
            });
            action.addEventListener("mousedown", function(e) {
                e.stopPropagation();
                if (e.which !== 1) return;
                actionT = action.offsetTop;
                actionL = action.offsetLeft;
                mmactionT = e.clientY;
                mmactionL = e.clientX;

                function onActionMove(e) {
                    actionL = actionL + e.clientX - mmactionL;
                    actionT = actionT + e.clientY - mmactionT;
                    if (actionL < 20) actionL = 20;
                    else if (actionL > w.innerWidth - 248) actionL = w.innerWidth - 248;
                    if (actionT < 20) actionT = 20;
                    else if (actionT > w.innerHeight - 90) actionT = w.innerHeight - 90;
                    mmactionL = e.clientX;
                    mmactionT = e.clientY;
                    action.style.left = actionL +'px';
                    action.style.top = actionT +'px';
                }
                function onActionMouseUp(e) {
                    d.removeEventListener("mouseup", onActionMouseUp, false);
                    d.removeEventListener("mousemove", onActionMove, false);
                }
                d.addEventListener("mouseup", onActionMouseUp, false);
                d.addEventListener("mousemove", onActionMove, false);
            });
            close = dce("div");
            close.className = "cancel";
            close.innerText = "Close";
            action.appendChild(close);
            save = dce("div");
            save.className = "save";
            a = d.createElementNS("http://www.w3.org/1999/xhtml", "a");
            a.setAttribute("download", `${title}_(at ${tm}).png`);
            a.setAttribute("id", "objectURL");
            a.setAttribute("type", "image/png");
            a.innerText = "Save";
            a.setAttribute("href", (w.URL || w.webkitURL || w).createObjectURL(blob));
            save.appendChild(a);
            action.appendChild(save);

            let rotateR = dce("div");
            rotateR.className = "edit one rotate-r";
            rotateR.innerText = "⏎";
            rotateR.title = "Rotate Clockwise";
            rotateR.addEventListener("click", function(e) {
                e.stopPropagation();
                let ctxs, ctxd, canv = dce("canvas");
                vidRotateAngle += 90;
                canv.width = canvas.width;
                canv.height = canvas.height;
                ctxs = canv.getContext("2d");
                ctxs.drawImage(canvas, 0, 0);
                canvas.width = canv.height;
                canvas.height = canv.width;
                ctxd = canvas.getContext("2d");
                ctxd.save();
                ctxd.clearRect(0, 0, canvas.width, canvas.height);
                ctxd.translate(canvas.width, 0);
                ctxd.rotate(90 * Math.PI / 180);
                ctxd.drawImage(canv, 0, 0);
                ctxd.restore();
                updateURL(canvas);
            });
            action.appendChild(rotateR);

            let flipH = dce("div");
            flipH.className = "edit one flip-h";
            flipH.innerText = "⇔";
            flipH.title = "Flip Horizontally";
            flipH.addEventListener("click", function(e) {
                e.stopPropagation();
                flipImg()
            });
            action.appendChild(flipH);

            let flipV = dce("div");
            flipV.className = "edit one flip-v";
            flipV.innerText = "⇕";
            flipV.title = "Flip Vertically";
            flipV.addEventListener("click", function(e) {
                e.stopPropagation();
                flipImg(true)
            });
            action.appendChild(flipV);

            let greyscale = dce("div");
            greyscale.className = "edit one greyscale";
            greyscale.innerText = "⚫";
            greyscale.style.color = "#444141";
            greyscale.title = "Black and White";
            greyscale.addEventListener("click", function(e) {
                e.stopPropagation();
                e.target.classList.add("disabled");
                let ctxs = canvas.getContext("2d"),
                    imgData = ctxs.getImageData(0, 0, canvas.width, canvas.height),
                    pxData = imgData.data;
                ctxs.save();
                for(var x = 0; x < pxData.length; x+=4) {
                    var r = pxData[x],
                    g = pxData[x + 1],
                    b = pxData[x + 2],
                    gr = r * .3 + g * .59 + b * .11;
                    pxData[x] = gr;
                    pxData[x + 1] = gr;
                    pxData[x + 2] = gr;								
                }
                ctxs.putImageData(imgData, 0, 0);
                ctxs.restore();
                updateURL(canvas);
            });
            action.appendChild(greyscale);

            let cropper = dce("div");
            cropper.className = "edit one cropmenu";
            cropper.innerText = "✂";
            cropper.title = "Crop and Enlarge";
            cropper.addEventListener("click", function(e) {
                e.stopPropagation(); showResize();
                editInfo.setAttribute('data', editInfoTitle[1]);
                qs("#screenshot .action").classList.toggle("gone");
                qs("#screenshot .action .save").classList.toggle("gone");
                qs("#screenshot .action .cancel").classList.toggle("gone");
                qsa("#screenshot .action .edit.one, #screenshot .action .edit.two")
                  .forEach((o) => {o.classList.toggle("gone")})
            });
            action.appendChild(cropper);


            let acancel = dce("div");
            acancel.className = "edit two acancel gone";
            acancel.innerText = "⇦";
            acancel.style.left = '16px';
            acancel.title = "Return to previous editor";
            acancel.addEventListener("click", function(e) {
                e.stopPropagation(); closeEditor();
            });
            action.appendChild(acancel);

            let aresize = dce("div");
            aresize.className = "edit two aresize disabled gone";
            aresize.innerText = "✂";
            aresize.style.left = '50px';
            aresize.title = "Crop image to selection";
            aresize.addEventListener("click", function(e) {
                e.stopPropagation(); doCrop(e)
            });
            action.appendChild(aresize);

            let azoom = dce("div");
            azoom.className = "edit two azoom disabled gone";
            azoom.innerText = "⤧";
            azoom.style.left = '84px';
            azoom.style.lineHeight = "1.3em";
            azoom.title = "Enlarge image to 150% at selection";
            azoom.addEventListener("click", function(e) {
                e.stopPropagation(); doZoom(e)
            });
            action.appendChild(azoom);

            let zoomfactor = dce("input");
            zoomfactor.className = "edit two zoomfactor gone";
            zoomfactor.setAttribute("id", "zoomfactor");
            zoomfactor.setAttribute("type", "range");
            zoomfactor.setAttribute("disabled", "");
            zoomfactor.setAttribute("min", "150");
            zoomfactor.setAttribute("max", "300");
            zoomfactor.setAttribute("step", "50");
            zoomfactor.setAttribute("value", "150");
            zoomfactor.setAttribute("autocomplete", "off");
            zoomfactor.title = "Enlarge image to 150% at selection";
            zoomfactor.addEventListener("change", function(e) {
                let zoomTitle = 'Enlarge image to '+e.target.value+'% at selection';
                e.target.title = zoomTitle;
                qs('.action .azoom').title = zoomTitle
            });
            action.appendChild(zoomfactor);

            div.appendChild(action);
            qs("body").appendChild(div);

            var closeEditor = () => {
                if (qs("#overlay")) {
                    cropMenu = null;
                    qs("#screenshot").removeChild(qs("#overlay"));
                }
                editInfo.setAttribute('data', editInfoTitle[0]);
                qs("#shader").style.backgroundSize = "100% 0px, 100% 0px, 0px 100%, 0px 100%";
                qs("#shader").classList.add("transparent");
                qs("#screenshot .azoom").classList.add("disabled");
                qs("#screenshot .aresize").classList.add("disabled");
                qs("#screenshot #zoomfactor").classList.add("disabled");
                qs("#screenshot #zoomfactor").setAttribute("disabled",'');
                qs("#screenshot .action").classList.toggle("gone");
                qs("#screenshot .action .save").classList.toggle("gone");
                qs("#screenshot .action .cancel").classList.toggle("gone");
                qsa("#screenshot .action .edit.one, #screenshot .action .edit.two")
                  .forEach((o) => {o.classList.toggle("gone")})
            }
            var resizer = {}, cropMenu = null;
            var doCrop = (e, f = 1) => {
                e.stopPropagation();
                closeEditor();
                qs("#shader").classList.add("transparent");
                let ctxs, ctxd, canv = dce("canvas");
                let r = resizer.now;
                let dw = Math.round(f * Math.round(r.w/ r.sf)),
                    dh = Math.round(f * Math.round(r.h/ r.sf)),
                    sl = Math.round(r.l/ r.sf), st = Math.round(r.t/ r.sf),
                    sw = Math.round(r.w/ r.sf), sh = Math.round(r.h/ r.sf);
                canv.width = dw;
                canv.height = dh;
                ctxs = canv.getContext("2d");
                ctxs.drawImage(canvas,sl,st,sw,sh,0,0,dw,dh);
                canvas.width = dw;
                canvas.height = dh;
                ctxd = canvas.getContext("2d");
                ctxd.save();
                ctxd.drawImage(canv, 0, 0);
                ctxd.restore();
                updateURL(canvas);
                cropper.classList.add("disabled");
            }
            var doZoom = (e) => {doCrop(e, Math.round(qs("#zoomfactor").value / 100));}
            var displayCoords = (set = 0) => {
                if (set) {setResizerNow()};
                let dspT = Math.max(Math.round(resizer.now.t / resizer.now.sf), 0),
                    dspL = Math.max(Math.round(resizer.now.l / resizer.now.sf), 0),
                    dspW = Math.max(Math.round(Math.min(resizer.now.w, vid.videoWidth) / resizer.now.sf), 160),
                    dspH = Math.max(Math.round(Math.min(resizer.now.h, vid.videoHeight) / resizer.now.sf), 90),
                    dspS = Math.round(resizer.now.sf * 1000) / 10;
                qs("#overlay .cropper.ct").innerText = `${dspL}, ${dspT} (${dspW} x ${dspH})`;
                qs("#overlay .cropper.cb").innerText = `(${dspS}%)`
            }
            var setResizerNow = (el = dragger) => {
                let offsetTop, offsetLeft, coords = el.getBoundingClientRect();

                if ("undefined" === typeof  resizer.now) {
                    offsetTop = coords.top;
                    offsetLeft = coords.left;
                    if ((vidRotateAngle % 180) === 0)
                        vidScaleFactor = coords.width / vid.videoWidth;
                    else
                        vidScaleFactor = coords.width / vid.videoHeight;
                } else  {
                    offsetTop = canvasOffsetTop;
                    offsetLeft = canvasOffsetLeft;
                }
                resizer.now = {l: coords.left - offsetLeft, t: coords.top - offsetTop, w: coords.width, h: coords.height, 
                               r: coords.right - offsetLeft, b: coords.bottom  - offsetTop, sf: vidScaleFactor};
            }
            var showResize = function(e) {
                if (!qs("#overlay")) {
                    /* create resizable overlay */
                    setResizerNow(canvas);
                    canvasOffsetTop = (qs('#screenshot').getBoundingClientRect().height/ 2) - (resizer.now.h/ 2);
                    canvasOffsetLeft = qs('#canvas').getBoundingClientRect().left;
                    var tabSizeX = 22, tabSizeY = 22;
                    var dragger, limits, isProp = 0, stops = {};
                    var overlay = dce("div");
                    overlay.id = "overlay";
                    overlay.className = "drag_resize active";
                    overlay.innerHTML = `
                        <table class="drag_resize_overlay">
                            <tbody><tr><td class="corner tl">&nbsp;</td><td class="cropper ct">&nbsp;</td><td class="corner tr">&nbsp;</td></tr>
                            <tr><td class="cropper cl">&nbsp;</td><td id="dragger" class="dragger">&nbsp;</td><td class="cropper cr">&nbsp;</td></tr>
                            <tr><td class="corner bl">&nbsp;</td><td class="cropper cb">&nbsp;</td><td class="corner br">&nbsp;</td></tr></tbody>
                        </table>`;

                    qs("#screenshot").insertBefore(overlay, qs("#screenshot .action"));
                    if (!qs("#screenshot #shader")) {
                        let shader = dce("div");
                        shader.id = "shader";
                        shader.className = "transparent";
                        shader.style.top = canvasOffsetTop +'px';
                        shader.style.width = resizer.now.w +'px';
                        shader.style.height = resizer.now.h +'px';
                        shader.style.left = canvas.offsetLeft +'px';
                        qs("#screenshot").insertBefore(shader, overlay);
                    }
                    if (isChrome) {
                        tabSizeX = qs(".cropper.cl", overlay).getBoundingClientRect().width//+0.83;
                        tabSizeY = qs(".cropper.ct", overlay).getBoundingClientRect().height//-0.2378;
                    }
                    limits = {l: 0, t: 0, w: resizer.now.w, h: resizer.now.h};
                    overlay.style = `left: 0px; top: 0px; margin-left: ${canvasOffsetLeft - tabSizeX}px; margin-top: ${canvasOffsetTop - tabSizeY}px;`;
                    dragger = qs("#overlay .dragger");
                    dragger.style.width = `${resizer.now.w}px`;
                    dragger.style.height = `${resizer.now.h}px`;
                    dragger.style.maxWidth = `${resizer.now.w}px`;
                    dragger.style.maxHeight = `${resizer.now.h}px`;
                    displayCoords();

                    function stopSet(key, val = null) {
                        let has = "undefined" !== typeof stops[key];
                        if (val === null) return (has) ? stops[key] : false;
                        if (!has) stops[key] = val;
                        return stops[key]
                    }
                    function dragTo(e) {
                        let topNow = resizer.now.t, leftNow = resizer.now.l,
                            widthNow = resizer.now.w, heightNow = resizer.now.h,
                            newTop = topNow + e.clientY - resizer.e.clientY,
                            newLeft = leftNow + e.clientX - resizer.e.clientX;
                        if (newTop + heightNow - limits.t > limits.h)
                            newTop = limits.h - heightNow + limits.t;
                        else if (newTop < limits.t) newTop= limits.t;
                        if (newLeft + widthNow - limits.l > limits.w)
                            newLeft = limits.w - widthNow + limits.l;
                        else if (newLeft < limits.l)newLeft=limits.l;
                        overlay.style.top = newTop +"px";
                        overlay.style.left = newLeft +"px";
                        resizer.e.clientY = e.clientY;
                        resizer.e.clientX = e.clientX;
                        displayCoords(1)
                    }
                    function freeCrop(e) {
                        if (Object.keys(stops).length) return;
                        let newAttr, newProp,
                            newTop = null,
                            newWidth = null,
                            newHeight = null,
                            tab = resizer.tab,
                            resetTop = 0, resetLeft = 0,
                            topNow = resizer.now.t, leftNow = resizer.now.l,
                            widthNow = resizer.now.w, heightNow = resizer.now.h,
                            mmoved = {X: e.clientX - resizer.e.clientX, Y: e.clientY - resizer.e.clientY};
                        if (resizer.pro == "width") {
                            newAttr = widthNow + mmoved.X;
                            if (isProp && tab == "tr" || tab == "br") {
                                if (mmoved.Y !== 0) {
                                newProp = (tab == "tr") ? topNow + mmoved.Y : topNow - mmoved.Y;
                                newHeight = (tab == "tr") ? heightNow - mmoved.Y : heightNow + mmoved.Y;
                                newWidth = newHeight / isProp * 100;
                                newAttr = newWidth;
                                }
                                else return
                            }
                            if (tab == "tr" && isProp) {
                                if (newHeight < 90) {
                                    newAttr = stopSet("newAttr", 90 / isProp * 100);
                                    newWidth = stopSet("newWidth", newAttr);
                                    resetTop = stopSet("resetTop", topNow + heightNow - 90);
                                }
                                else if (newWidth < 160) {
                                    newAttr = stopSet("newAttr", 160);
                                    newWidth = stopSet("newWidth", newAttr);
                                    resetTop = stopSet("resetTop", topNow + (widthNow * isProp/ 100)) - (newAttr * isProp/ 100);
                                }
                                else if (newProp < limits.t) {
                                    newProp = stopSet("newProp", limits.t);
                                    newAttr = stopSet("newAttr", widthNow - ((0 - topNow) / isProp * 100));
                                    newWidth = stopSet("newWidth", newAttr);
                                    resetTop = stopSet("resetTop", newProp);
                                }
                            }
                            else if (newAttr < 160) {
                                newAttr = stopSet("newAttr", 160);
                            }
                            else if (tab == "br" && newHeight < 90) {
                                newAttr = stopSet("newAttr", 90 / isProp * 100);
                            }
                            if (newAttr > limits.w - leftNow + limits.l) {
                                newAttr = stopSet("newAttr", limits.w - leftNow + limits.l);
                                newProp = stopSet("newProp", topNow);
                                newWidth = stopSet("newWidth", newAttr);
                                resetTop = (topNow + (widthNow * isProp/ 100)) - (newAttr * isProp/ 100);
                            }
                            else if (tab == "br" && topNow + heightNow + mmoved.Y > limits.h) {
                                newAttr = stopSet("newAttr", (limits.h - topNow) / isProp * 100);
                            }
                            if (tab == "tr") {
                                if (resetTop) {
                                    newProp = resetTop;
                                    if (newWidth) newAttr = newWidth;
                                }
                                overlay.style.top = newProp +"px";
                            }
                            dragger.style.width = newAttr +"px";
                        }
                        else if (resizer.pro == "height") {
                            newAttr = heightNow + mmoved.Y;
                            if (newAttr > limits.h - topNow + limits.t) {
                                newAttr = limits.h - topNow + limits.t;
                            } else if (newAttr < 90) newAttr = 90;
                            dragger.style.height = Math.round(newAttr) +"px";
                        }
                        else if (resizer.pro == "top") {
                            newAttr = topNow + mmoved.Y;
                            newProp = heightNow - mmoved.Y;
                            if (newProp < 90) {
                                newProp = stopSet("newProp", 90);
                                newAttr = stopSet("newAttr", topNow + heightNow - 90);
                            }
                            else if (newAttr < limits.t) {
                                newProp = stopSet("newProp", heightNow + topNow);
                                newAttr = stopSet("newAttr", limits.t);
                            }
                            dragger.style.height = Math.round(newProp) +"px";
                            overlay.style.top = Math.round(newAttr) +"px";
                        }
                        else if (resizer.pro == "left") {
                            newAttr = leftNow + mmoved.X;
                            newProp = widthNow - mmoved.X;
                            if (isProp && tab == "tl" || tab == "bl") {
                                heightNow = isProp * widthNow / 100;
                                newTop = topNow + mmoved.Y;
                                newHeight = heightNow - mmoved.Y;
                            }
                            if (tab == "tl" && isProp) {
                                if (newHeight < 90) {
                                    resetLeft = stopSet("resetLeft", leftNow + widthNow - (90 / isProp * 100));
                                    resetTop = stopSet("resetTop", topNow + heightNow - 90);
                                    newProp = stopSet("newProp", 90 / isProp * 100);
                                }
                                else if (newProp < 160) {
                                    newProp = stopSet("newProp", 160);
                                    resetLeft = stopSet("resetLeft", leftNow + widthNow - 160);
                                    resetTop = stopSet("resetTop", topNow + (widthNow * isProp/ 100)) - (newProp * isProp/ 100);
                                }
                                else if (newTop < limits.t) {
                                    newTop = stopSet("newTop", limits.t);
                                    leftNow = stopSet("leftNow", leftNow);
                                    newProp = stopSet("newProp", widthNow - ((0 - topNow) / isProp * 100));
                                    resetLeft = leftNow + widthNow - newProp;
                                }
                            }
                            else if (tab == "bl" && newHeight < 90 && mmoved.Y < 0) {
                                newProp = stopSet("newProp", 90 / isProp * 100);
                                newAttr = stopSet("newAttr", leftNow + widthNow - (90 / isProp * 100));
                            }
                            else if (newProp < 160) {
                                newProp = stopSet("newProp", 160);
                                newAttr = stopSet("newAttr", leftNow + widthNow - newProp);
                            }
                            if (newAttr < limits.l) {
                                newAttr = stopSet("newAttr", limits.l);
                                newProp = stopSet("newProp", widthNow - (0 - leftNow));
                                resetTop = (topNow + (widthNow * isProp/ 100)) - (newProp * isProp/ 100);
                            }
                            else if (tab == "bl" && topNow + heightNow + mmoved.Y > limits.h) {
                                newProp = stopSet("newProp", (limits.h - topNow) / isProp * 100);
                                newAttr = stopSet("newAttr", leftNow + widthNow - newProp);
                            }
                            if (tab == "tl") {
                                if (resetTop || resetLeft) {
                                    if (resetTop) {newTop = resetTop;}
                                    if (resetLeft) {newAttr = resetLeft;}
                                }
                                else {
                                    newAttr = leftNow + widthNow - (newHeight / isProp * 100);
                                    newProp = newHeight / isProp * 100;
                                }
                                overlay.style.top = Math.round(newTop) +"px";
                            }
                            overlay.style.left = Math.round(newAttr) +"px";
                            dragger.style.width = Math.round(newProp) +"px";
                        }
                        if (!cropMenu) {
                           qs(".action .aresize").classList.remove("disabled");
                           qs(".action .azoom").classList.remove("disabled");
                           qs("#zoomfactor").classList.remove("disabled");
                           qs("#zoomfactor").removeAttribute("disabled");
                           cropMenu = true
                        }
                        resizer.e.clientX = e.clientX;
                        resizer.e.clientY = e.clientY;
                        displayCoords(1)
                    }
                    function propCrop(e) {
                        let bx;
                        if (!isProp) {
                            bx = dragger.getBoundingClientRect();
                            isProp = bx.height / bx.width * 100;
                            dragger.style.height = "0";
                            dragger.style.paddingTop = isProp +'%';
                        }
                        freeCrop(e)
                    }
                    function onMouseMove(e) {resizer.fn(e);}
                    overlay.onmousedown = function(e) {
                        e.stopPropagation(); e.preventDefault();
                        if (e.which !== 1) return;
                        stops = {};
                        setResizerNow();
                        resizer.e = {clientX: e.clientX, clientY: e.clientY};
                        shader.classList.add("transparent");
                        action.classList.add("transparent");
                        
                        let names = e.target.classList;
                        if (names.contains("cropper")) {
                            resizer.fn = freeCrop;
                            if (names.contains("ct")) {resizer.pro = "top"; resizer.tab = "ct"; }
                            else if (names.contains("cr")) {resizer.pro = "width"; resizer.tab = "cr"; }
                            else if (names.contains("cb")) {resizer.pro = "height"; resizer.tab = "cb";}
                            else {resizer.pro = "left"; resizer.tab = "cl";}
                        }
                        else if (names.contains("corner")) {
                            resizer.fn = propCrop;
                            if (names.contains("tr")) { resizer.pro = "width"; resizer.tab = "tr";}
                            else if (names.contains("br")) {resizer.pro = "width"; resizer.tab = "br";}
                            else if (names.contains("bl")) {resizer.pro = "left"; resizer.tab = "bl";}
                            else {resizer.pro = "left"; resizer.tab = "tl";}
                        }
                        else {resizer.fn = dragTo; resizer.tab = "dr";}

                        function onMouseUp(e) {
                            if (shader.classList.contains("transparent")) {
                                d.removeEventListener('mousemove', onMouseMove, false);
                                let cvs = qs("#dragger").getBoundingClientRect();
                                if (isProp) {
                                    dragger.style.height = Math.round(cvs.height) +'px';
                                    dragger.style.removeProperty('padding-top');
                                    isProp = 0;
                                }
                                displayCoords(1);
                                let shadetop = Math.max(Math.round(resizer.now.t),0),
                                    shadeleft = Math.max(Math.round(resizer.now.l),0),
                                    shaderight = Math.round(limits.w - Math.min(resizer.now.r,limits.w)),
                                    shadebottom = Math.round(limits.h - Math.min(resizer.now.b,limits.h)),
                                    bgs = `100% ${shadetop}px, 100% ${shadebottom}px, ${shadeleft}px 100%, ${shaderight}px 100%`;
                                shader.style.backgroundSize = bgs;
                                shader.classList.remove("transparent");
                                action.classList.remove("transparent");
                                d.removeEventListener('mouseup', onMouseUp, false);
                            }
                        }
                        d.addEventListener('mousemove', onMouseMove, false);
                        d.addEventListener('mouseup', onMouseUp, false);
                    }
                } else qs("#overlay").classList.toggle("active");
            }
        });
    },


    refreshCounts: (vid) => {
        let xhr, data;
        let link = `${vid}counts/`;
        if (BC.path == vid) {
            if (!BC.countsRefreshed || d.visibilityState == 'visible' || BC.isFullScreen) {
                if (scriptHandler == "Greasemonkey"){xhr = new BC.SM_XMLHttpRequest()}else{xhr = new XMLHttpRequest()}
                data = 'csrfmiddlewaretoken='+ BC.getCsrftoken();
                xhr.addEventListener("error", (e) => { error('XMLHttpRequest refreshCounts error: '+ e) });
                xhr.addEventListener("load", (res) => {
                    try {
                        let e = typeof res.target === "undefined" ? {target: res} : res;
                        let result = JSON.parse(e.target.responseText);
                        if ('undefined' !== result.success && result.success) {
                            qs('#fs-view-count').innerHTML = result.view_count;
                            qs('#fs-like-count').innerHTML = result.like_count;
                            qs('#fs-dislike-count').innerHTML = result.dislike_count;
                            qs('#subscriber_count').innerHTML = result.subscriber_count;
                            BC.countsRefreshed = true;
                            setTimeout(BC.refreshCounts, 60000, vid);
                        }
                    } catch (e) { error('XMLHttpRequest refreshCounts parsing error: '+ e) }
                });
                xhr.open("POST", link, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(data);
            }
            else setTimeout(BC.refreshCounts, 60000, vid)
        }
    },


    screenshotIcon: '<svg class="svg-inline--fa fa-w-18 action-icon fa-fw" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="0.55in" height="0.55in">'+
    '<path fill="currentColor" stroke="currentColor" stroke-width="2" d="M20,728.816h816.506c11.046,0,20-8.954,20-20V228.013c0-11.046-8.954-20-20-20h-530.81v-60.323c0-11.046-8.954-20-20-20 '+
    'H114.253c-11.046,0-20,8.954-20,20v60.323H20c-11.046,0-20,8.954-20,20v480.804C0,719.862,8.954,728.816,20,728.816z M427.027,300.181c93.607,0,169.491,75.884,169.491,169.492s-75.884,169.492-169.491,169.492 '+
	'c-93.608,0-169.492-75.884-169.492-169.492S333.419,300.181,427.027,300.181z" /></svg>',


    init: function() {
        return new Promise( resolve => {
            let settings = {volume:0.5,autoplay:true,color:"none",playnext:false,usedark:true,playlists:true,mvplaylist:true,
                            useblacklist:true,hidecarousel:false,hidecomments:false,hidemenubar:true,hideadverts:true,useminiplayer:true,
                            usesquareicons:true,hidedonationbar:true,homepagegotoall:true,hidecookienotice:true,hidesignupnotice:true,useseekbarpreview:true};
            GM.getValue('player', "{}").then( value => {
                if (value && value != '{}') {
                    let player = Object.assign({}, settings, JSON.parse(value));
                    BC.url = null;
                    BC.host = null;
                    BC.path = null;
                    BC.loaded = !1;
                    BC.reload = !1;
                    BC.auxMenu = !1;
                    BC.loader = null;
                    BC.themes = null;
                    BC.blacklist = [];
                    BC.page = 'homepage';
                    BC.previouslisting = '';
                    BC.miniPlayerIni = false;
                    BC.player = {
                        api     : null,
                        fur     : null,
                        rect    : null,
                        volume  : player.volume,
                        autoplay: player.autoplay
                    }
                    BC.settings = {
                        color             : player.color,
                        usedark           : player.usedark,
                        playnext          : player.playnext,
                        playlists         : player.playlists,
                        mvplaylist        : player.mvplaylist,
                        hideadverts       : player.hideadverts,
                        hidemenubar       : player.hidemenubar,
                        useblacklist      : player.useblacklist,
                        hidecarousel      : player.hidecarousel,
                        hidecomments      : player.hidecomments,
                        useminiplayer     : player.useminiplayer,
                        usesquareicons    : player.usesquareicons,
                        hidedonationbar   : player.hidedonationbar,
                        homepagegotoall   : player.homepagegotoall,
                        hidecookienotice  : player.hidecookienotice,
                        hidesignupnotice  : player.hidesignupnotice,
                        useseekbarpreview : player.useseekbarpreview
                    }
                    GM.getValue('blacklist', "[]").then( value => {
                        BC.blacklist = JSON.parse(value);
                        let err = qs("#page-bar .page-title");
                            /* Server Error */
                        if (!err || (err && !err.innerText.match(/.*((server)+\serror)+$/i))) {
                            debug('>>>>>>>>>>>>>> BC init <<<<<<<<<<=');
                            resolve(true);
                        }
                    }).catch ( e => {
                        error('S_marty: Error in promise loading blacklist: '+ e);
                    });
                }
                else {
                        /* Install Database */
                    GM.setValue('blacklist', '[]');
                    GM.setValue('player', JSON.stringify(settings));
                    GM.setValue('miniplayer', "{ \"x\":0,\"y\":0,\"w\":350,\"h\":197 }");
                    w.location.replace(w.location.href);
                }
            }).catch ( e => {
                error('S_marty: Error in promise loading dB: '+ e);
            });
        });
    }
};


const Bcd = {

    link: null,
    dialog: null,
    loader: null,
    unloader: null,
    playerAPI: null,
    videoButtons: 0,
    videoSources: 0,
    downloadIndex: -1,
    download_poster: false,
    src: {videos: []},
    downloads: [],
    captions: [],
    tooltip: [],


    flattenTitle: (t, title = "") => {

        t = t.replace(/\s?\[mirrored\]/i, "");
        t = t.replace(/(?=\W{3,})/g, "");
        t = t.replace(/\s?["'\[\(\{]*Re.{0,3}upload(ed)?["':\]\)\}]*\s?/i, "");
        [...t].forEach(n => {
    	    if ( /[^\\/:\*\?'"<>@\|]+/.test(n) ) title += n;
        });
        while (title[0] === "." || title[0] === " ") {title = title.slice(1)}
        while (title.slice(-1) === "." || title.slice(-1) === " ") {title = title.slice(0, -1)}
        title = title.trim();
        if (/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i.test(title)) title = "Video_" + title;

        return title;
    },


    addTooltip: (el, n) => {
        let tooltip, left, br;
        
        el.addEventListener('mouseover', function(e) {
            Bcd.tooltip[n] = dce("div");
            Bcd.tooltip[n] .className = "tooltip fade bottom in";
            Bcd.tooltip[n] .setAttribute("id", `tooltip${el.id}`);
            Bcd.tooltip[n] .setAttribute("role", "tooltip");
            br = el.getBoundingClientRect();
            Bcd.tooltip[n].style.top = br.bottom + w.scrollY +"px";
            left = br.left + w.scrollX + ((br.right - br.left) / 2)
            Bcd.tooltip[n].innerHTML = `<div class="tooltip-arrow"></div><div class="tooltip-inner">${el.getAttribute("data-original-title")}</div>`;
            qs("body").appendChild(Bcd.tooltip[n]);
            br = Bcd.tooltip[n].getBoundingClientRect();
            Bcd.tooltip[n].style.left = (left - (br.width / 2)) +"px";
        }, false);

        el.addEventListener('mouseout', function(e) {
            Bcd.tooltip[n].classList.remove('in');
            w.setTimeout( function(e) {
                qs(`#tooltip${el.id}`).outerHTML = "";
            }, 150);
        }, false);
    },


    addVideoAction: (id, title, icon) => {
        let spc, action = null,
            menu = qs(".video-actions .action-list");

        action = dce("a");
        action.setAttribute("id", id);
        action.setAttribute("title", "");
        action.setAttribute("data-original-title", title);
        action.setAttribute("data-placement", "bottom");
        action.setAttribute("data-toggle", "tooltip");
        action.className = "disabled";
        action.innerHTML = icon;
        menu.insertBefore(action, menu.firstChild);
        spc = d.createTextNode("  \n  \n  ");
        menu.insertBefore(spc, menu.firstChild);
        return action
    },


    load: (e, vid) => {
        let style;

        debug(`>>>>>>>>>>>>>> Bcd load <<<<<<<<<<= ${e}:`, vid);

        if (! qs("#downloadLink")) {
            Bcd.link = Bcd.addVideoAction("downloadLink", "Download", Bcd.downloadIcon);
            Bcd.addTooltip(Bcd.link, Bcd.tooltip.length);
            Bcd.link.addEventListener('click', (e) => {
                e.preventDefault();
                if (Bcd.dialog) {
                    Bcd.toggle_download_dialog();
                    return
                }
            }, false);
        }

        if (! qs("style#video_download")) {
            style = dce("style");
            style.id = "video_download";
            style.type = "text/css";
            style.innerText = `
                    a#downloadLink.disabled {pointer-events: none; opacity: 0.3; cursor: default}
                    .video-information .video-actions a.download_started {color: #eeee00;}
                    .video-information .video-actions a.download_finished {color: #00ee00;}
                    .video-information .video-actions a.download_error {color: #ee0000;}

                    #video_download_dialog {width: 400px; border: 2px solid #5F5F5F; border-radius: 6px; position: absolute;
                      z-index: 99000; background-color: #ddd;}
                    html.night #video_download_dialog {background-color: #211f22; border-color: #aaa;}
                    #video_download_dialog h2 {text-align: center;}
                    #video_download_dialog h4 {padding: 6px; text-align: center; text-shadow: 1px 1px #A1A1A1;}
                    #video_download_dialog .download_poster {background-color: transparent;}
                    #video_download_dialog .download_poster img {border: 1px solid #5F5F5F; width: 160px; height: 90px; margin-left: 18px;}
                    #video_download_dialog .poster_saveas {position: relative; right: 92px; text-align: center; float: right; top: 14px; font-size: 1em;}
                    #video_download_dialog #tracks {margin: 6px 16px 0 0; text-align: right;}
                    html.night #video_download_dialog .download_poster img {border-color: #aaa;}
                    #video_download_dialog button {font-size: 13px; color: #000; border-radius: 4px;
                      margin: 4px; right: 10px; position: absolute;-webkit-border-radius: 4;  -moz-border-radius: 4; border: 2px solid #555;}
                    #video_download_dialog button[disabled] {opacity: 0.5;}
                    #video_download_dialog .download_dialog_close_button {color: #990000; background-color: #aaa; top: -16px; right: -16px;
                      position: absolute; width: 32px; height: 32px; border-radius: 16px; border: 2px solid #555; cursor: pointer;
                      font-size: 24px; font-weight: bold; text-align: center; vertical-align: middle; line-height: 28px;}
                    #video_download_dialog .download_dialog_close_button:hover {background-color: #ddd; border-color: #222;}
                    #video_download_dialog .download_videos {background-color: transparent;}
                    #video_download_dialog hr {height: 1px; width: 80%; margin: 20px auto; border: none;
                      background: linear-gradient(to right, #BFBDBD 10%, #000 50%, #000 50%, #BFBDBD 90%);}
                    html.night #video_download_dialog hr {background: linear-gradient(to right, #000 0%, #BFBDBD 50%, #BFBDBD 50%, #000 100%);}
                    #video_download_dialog .download_videos div {background-color: transparent;}
                    #video_download_dialog .download_videos div.download_progress {margin: 2px 0px 2px 16px;}
                    #video_download_dialog .download_videos div.download_details {height: 50px; width: 188px; max-width: 200px; float: left;
                      padding: 6px; margin-left: 10px;}
                    #video_download_dialog button.download_error {background-color: #ff0000 !important;}
                    #video_download_dialog button.download_cancel {background-color: #aaaa22;}
                    #video_download_dialog button.download_finished {background-color: #8efc8e !important;}
                    #video_download_dialog button:not([disabled]):hover {color: #ffffff;}
                    #tracks .captions {display: inline-block;font-size: 13px;font-family: sans-serif;font-weight: 500;color: #000;line-height: 1.3;padding: .1em 1em .1em .3em;
                      width: 100%;max-width: 100%;box-sizing: border-box;margin: 0;border: 2px solid #555;box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
                      border-radius: 5px;-moz-appearance: none;-webkit-appearance: none;appearance: none;background-color: #2532e0;
                      background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20`+
                      `height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.`+
                      `6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%20`+
                      `5.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),linear-gradient(to bottom, #525cde 0%,#2532e0 100%);
                      background-repeat: no-repeat, repeat;background-position: right .2em top 50%, 0 0;background-size: .65em auto, 100%;outline-style: none;}
                    #tracks .captions:hover {color: #fff;} #tracks .captions option {font-weight:normal;}`;
            d.documentElement.appendChild(style);
        }
        Bcd.downloadDialog(vid);
    },


    downloadDialog: (vid) => {
        let downloadVideos, hr, newVid, tracks, captions = "";

        Bcd.dialog = qs("#video_download_dialog");
        debug(`Building downloadDialog (${Bcd.videoButtons})`)

        if (Bcd.dialog) {
            downloadVideos = qs(".download_videos", Bcd.dialog);

            if (downloadVideos) {
                hr = dce("hr");
                newVid = dce("div");
                newVid.style.height = "54px";
                newVid.style.margin = "0px 0px 20px 0px";
                newVid.innerHTML = `
                    <div class="download_details v${Bcd.videoButtons}">
                      <div id="loader" style="position: relative;margin: auto;left: 0;top: 100%;">
                      <ul style="width: 10%;"><li></li><li></li><li></li><li></li><li></li></ul></div>
                    </div>
                    <div style="width: 180px; height: 26px;">
                      <button class="btn-danger download_video_only v${Bcd.videoButtons}" bid="v${Bcd.videoButtons}">Video Only</button><br />
                    </div>
                    <div style="width: 180px; height: 26px;">
                      <button class="btn-danger download_video_and_poster v${Bcd.videoButtons}" bid="v${Bcd.videoButtons}">Video &amp; Poster</button>
                    </div>
                    <div class="download_progress v${Bcd.videoButtons}"></div>`;

                downloadVideos.insertBefore(newVid, downloadVideos.firstChild);
                downloadVideos.insertBefore(hr, downloadVideos.firstChild);

                qs("button.download_video_only.v"+ Bcd.videoButtons, Bcd.dialog).addEventListener('click', (e) => {
                    e.preventDefault();
                    let t = e.target;
                    let vb = t.getAttribute("bid");
                    if (!t.classList.contains("download_cancel")) {
                        let i = Bcd.saveToDisk(vid, false);
                        debug('download_video: '+i);
                        if (i[0] === null) return;
                        t.classList.add("download_cancel");
                        t.setAttribute("downloadid", i[0]);
                        t.innerText = "Cancel "+ t.innerText;
                        qs(".download_video_and_poster."+ vb, Bcd.dialog).disabled = "disabled";
                    } else {
                        let dl = Bcd.downloads[parseInt(t.getAttribute("downloadid"))];
                        dl[1].abort();
                        msg(`Download Canceled: ${dl[0].name} (${dl[0].n} of ${dl[0].t})`);
                        t.classList.remove("download_cancel");
                        t.removeAttribute("style");
                        t.removeAttribute("downloadid");
                        t.innerText = t.innerText.substr(7);
                        qs(".download_progress."+ vb, Bcd.dialog).innerHTML = "";
                        if (qs("button.download_poster_only", Bcd.dialog).className == "btn-danger download_poster_only") {
                            qs(".download_video_and_poster."+ vb, Bcd.dialog).removeAttribute("disabled");
                        }
                        if (! qs("button.download_cancel", Bcd.dialog)) {
                            Bcd.link.classList.remove("download_started");
                        }
                    }
                });
                qs("button.download_video_and_poster.v"+ Bcd.videoButtons, Bcd.dialog).addEventListener('click', (e) => {
                    e.preventDefault();
                    let t = e.target;
                    let vb = t.getAttribute("bid");
                    if (!t.classList.contains("download_cancel")) {
                        let i = Bcd.saveToDisk(vid, Bcd.src.poster);
                        debug('download_video_and_poster: '+i);
                        if (i[0] === null || i[1] === null) return;
                        t.classList.add("download_cancel");
                        t.setAttribute("downloadid", i[0]+'-'+i[1]);
                        t.innerText = "Cancel "+ t.innerText;
                        qs("button.download_poster_only", Bcd.dialog).disabled = "disabled";
                        qs("button.download_video_only."+ vb, Bcd.dialog).disabled = "disabled";
                        qs("button.download_poster_only", Bcd.dialog).setAttribute("downloadid", i[1]);
                        qs("button.download_poster_only", Bcd.dialog).classList.add("download_cancel");
                        qs("button.download_video_only."+ vb, Bcd.dialog).setAttribute("downloadid", i[0]);
                        qsa("button.download_video_and_poster:not(."+ vb +")", Bcd.dialog).forEach( (b) => {
                            b.setAttribute("disabled", "disabled");
                        })
                    } else {
                        let p, v;
                        let ids = t.getAttribute("downloadid").split('-');
                        let dl = Bcd.downloads[parseInt(ids[0])];
                        dl[1].abort();
                        msg(`Download Canceled: ${dl[0].name} (${dl[0].n} of ${dl[0].t})`);
                        dl = Bcd.downloads[parseInt(ids[1])];
                        if (qs("button.download_poster_only.download_cancel", Bcd.dialog)) {
                            dl[1].abort();
                            msg(`Download Canceled: ${dl[0].name} (${dl[0].n} of ${dl[0].t})`);
                        }
                        t.classList.remove("download_cancel");
                        t.removeAttribute("style");
                        t.removeAttribute("downloadid");
                        t.innerText = t.innerText.substr(7);
                        qs(".download_progress."+ vb, Bcd.dialog).innerHTML = "";
                        if (qsa("button.download_poster_only.download_finished,"+
                               "button.download_poster_only.download_error", Bcd.dialog).length)
                        {
                            t.disabled = "disabled";
                            if (! qs("button.download_cancel", Bcd.dialog)) {
                                Bcd.link.classList.replace("download_started", "download_finished");
                            }
                        }
                        else {
                            if (p = qs('button.download_poster_only', Bcd.dialog)) {
                                p.classList.remove("download_cancel");
                                p.removeAttribute("disabled");
                                p.removeAttribute("downloadid");
                            }
                            qsa("button.download_video_and_poster:not(."+ vb +")", Bcd.dialog).forEach( (b) => {
                                b.removeAttribute("disabled");
                            })
                            if (! qs("button.download_cancel", Bcd.dialog)) {
                                Bcd.link.classList.remove("download_started");
                            }
                        }
                        if (v = qs('button.download_video_only[downloadid="'+ids[0]+'"]', Bcd.dialog)) {
                            v.removeAttribute("disabled")
                            v.removeAttribute("downloadid");
                        }
                    }
                });
/* ===================================================================================== */
            }
        }
        else {
            try { /* TODO BETA */
            //tracks = [{kind: "captions", src:"/sampleCaptions2.vtt", srclang:"en"},{kind: "captions", src:"/sampleCaptions3.vtt", srclang:"fr"}]
            tracks = qsa("track", Bcd.playerAPI);
            if (tracks.length) {
                captions = '<div id="tracks"><select class="captions btn-danger"><option value="-1">Select Caption</option>';
                tracks.forEach((o, i) => {
                    if (o.kind == "captions" || o.kind == "subtitles") {
                        Bcd.captions.push({lang: o.srclang, url: o.src, type: o.kind, index: i+1});
                        captions += `<option value="${i}">${o.srclang} ${o.kind}</option>`;
                    }
                })
                captions += "</select></div>";
            }
            } catch (err) {"Captions Error: "+ err}
            
            Bcd.dialog = dce("div");
            Bcd.dialog.setAttribute("id", "video_download_dialog");
            Bcd.dialog.innerHTML = `
                <div class="download_poster">
                  <h2 class="download_smarty">Smarty Video Download</h2>
                  <h4 class="download_title">${Bcd.flattenTitle(d.title)}</h4>
                  <img alt="- No Poster -" src="${Bcd.src.poster.url}" title="${Bcd.src.poster.width} x ${Bcd.src.poster.height}"
                       onerror="this.nextElementSibling.style.visibility='hidden'; this.onerror=''; this.title=''">
                  <button class="btn-danger download_poster_only">Poster Only</button>
                  <div class="poster_saveas hidden">Try:<br />right-click<br />Save Image As...</div>${captions}
                </div>
                <div class="download_videos">
                  <hr />
                  <div style="height: 54px; margin: 0px 0px 20px 0px;">
                    <div class="download_details v0">
                      <div id="loader" style="position: relative;margin: auto;left: 0;top: 100%;">
                      <ul style="width: 10%;"><li></li><li></li><li></li><li></li><li></li></ul></div>
                    </div>
                    <div style="width: 180px; height: 26px;">
                      <button class="btn-danger download_video_only v0" bid="v0">Video Only</button><br />
                    </div>
                    <div style="width: 180px; height: 26px;">
                      <button class="btn-danger download_video_and_poster v0" bid="v0">Video &amp; Poster</button>
                    </div>
                    <div class="download_progress v0"></div>
                  </div>
                </div>
                <div class="download_dialog_close_button" title="Close">X</div>`;
            Bcd.dialog.style.display = "none";
            qs("body").appendChild(Bcd.dialog);

            qs("button.download_poster_only", Bcd.dialog).addEventListener('click', (e) => {
                e.preventDefault();
                let t = e.target;
                if (!t.classList.contains("download_cancel")) {
                    let i = Bcd.saveToDisk(false, Bcd.src.poster);
                    debug('download_poster: '+i);
                    if (i[1] === null) return;
                    t.classList.add("download_cancel");
                    t.setAttribute("downloadid", i[1]);
                    t.innerText = "Cancel "+ t.innerText;
                    qsa("button.download_video_and_poster", Bcd.dialog).forEach( (b) => {
                        b.setAttribute("disabled", "disabled");
                    })
                } else {
                    let dl = Bcd.downloads[parseInt(t.getAttribute("downloadid"))];
                    dl[1].abort();
                    msg(`Download Canceled: ${dl[0].name} (${dl[0].n} of ${dl[0].t})`);
                    t.classList.remove("download_cancel");
                    t.removeAttribute("style");
                    t.removeAttribute("downloadid");
                    t.innerText = t.innerText.substr(7);
                    qsa("button.download_video_and_poster", Bcd.dialog).forEach( (b) => {
                        let cn = "button.download_video_only."+ b.getAttribute("bid");
                        if (! qs(cn, Bcd.dialog).classList.contains("download_cancel") &&
                            ! qs(cn, Bcd.dialog).classList.contains("download_finished"))
                        { b.removeAttribute("disabled"); }
                    })
                    if (! qs("button.download_cancel", Bcd.dialog)) {
                        Bcd.link.classList.remove("download_started");
                    }
                }
            });

            qs("button.download_video_only.v0", Bcd.dialog).addEventListener('click', (e) => {
                e.preventDefault();
                let t = e.target;
                if (!t.classList.contains("download_cancel")) {
                    let i = Bcd.saveToDisk(vid, false);
                    debug('download_video: '+i);
                    if (i[0] === null) return;
                    t.classList.add("download_cancel");
                    t.setAttribute("downloadid", i[0]);
                    t.innerText = "Cancel "+ t.innerText;
                    qs(".download_video_and_poster.v0", Bcd.dialog).disabled = "disabled";
                } else {
                    let dl = Bcd.downloads[parseInt(t.getAttribute("downloadid"))];
                    dl[1].abort();
                    msg(`Download Canceled: ${dl[0].name} (${dl[0].n} of ${dl[0].t})`);
                    t.classList.remove("download_cancel");
                    t.removeAttribute("style");
                    t.removeAttribute("downloadid");
                    t.innerText = t.innerText.substr(7);
                    qs(".download_progress.v0", Bcd.dialog).innerHTML = "";
                    if (qs("button.download_poster_only", Bcd.dialog).className == "btn-danger download_poster_only") {
                        qs(".download_video_and_poster.v0", Bcd.dialog).removeAttribute("disabled");
                    }
                    if (! qs("button.download_cancel", Bcd.dialog)) {
                        Bcd.link.classList.remove("download_started");
                    }
                }
            });
            qs("button.download_video_and_poster.v0", Bcd.dialog).addEventListener('click', (e) => {
                e.preventDefault();
                let t = e.target;
                if (!t.classList.contains("download_cancel")) {
                    let i = Bcd.saveToDisk(vid, Bcd.src.poster);
                    debug('download_video_and_poster: '+i);
                    if (i[0] === null || i[1] === null) return;
                    t.classList.add("download_cancel");
                    t.setAttribute("downloadid", i[0]+'-'+i[1]);
                    t.innerText = "Cancel "+ t.innerText;
                    qs("button.download_poster_only", Bcd.dialog).disabled = "disabled";
                    qs("button.download_video_only.v0", Bcd.dialog).disabled = "disabled";
                    qs("button.download_poster_only", Bcd.dialog).setAttribute("downloadid", i[1]);
                    qs("button.download_poster_only", Bcd.dialog).classList.add("download_cancel");
                    qs("button.download_video_only.v0", Bcd.dialog).setAttribute("downloadid", i[0]);
                    qsa("button.download_video_and_poster:not(.v0)", Bcd.dialog).forEach( (b) => {
                        b.setAttribute("disabled", "disabled");
                    })
                } else {
                    let p, v;
                    let ids = t.getAttribute("downloadid").split('-');
                    let dl = Bcd.downloads[parseInt(ids[0])];
                    dl[1].abort();
                    msg(`Download Canceled: ${dl[0].name} (${dl[0].n} of ${dl[0].t})`);
                    dl = Bcd.downloads[parseInt(ids[1])];
                    if (qs("button.download_poster_only.download_cancel", Bcd.dialog)) {
                        dl[1].abort();
                        msg(`Download Canceled: ${dl[0].name} (${dl[0].n} of ${dl[0].t})`);
                    }
                    t.classList.remove("download_cancel");
                    t.removeAttribute("style");
                    t.removeAttribute("downloadid");
                    t.innerText = t.innerText.substr(7);
                    qs(".download_progress.v0", Bcd.dialog).innerHTML = "";
                    if (qsa("button.download_poster_only.download_finished,"+
                            "button.download_poster_only.download_error", Bcd.dialog).length)
                    {
                        t.disabled = "disabled";
                        if (! qs("button.download_cancel", Bcd.dialog)) {
                            Bcd.link.classList.replace("download_started", "download_finished");
                        }
                    }
                    else {
                        if (p = qs('button.download_poster_only', Bcd.dialog)) {
                            p.classList.remove("download_cancel");
                            p.removeAttribute("disabled");
                            p.removeAttribute("downloadid");
                        }
                        qsa("button.download_video_and_poster:not(.v0)", Bcd.dialog).forEach( (b) => {
                            b.removeAttribute("disabled");
                        })
                        if (! qs("button.download_cancel", Bcd.dialog)) {
                            Bcd.link.classList.remove("download_started");
                        }
                    }
                    if (v = qs('button.download_video_only[downloadid="'+ids[0]+'"]', Bcd.dialog)) {
                        v.removeAttribute("disabled")
                        v.removeAttribute("downloadid");
                    }
                }
            });
            if (qs("#tracks .captions")) {
                qs("#tracks .captions", Bcd.dialog).addEventListener('change', (e) => {
                    if (e.target.selectedIndex.value!=-1) Bcd.saveToDisk(false, false, e.target.selectedIndex.value);
                })
            }

            qs(".download_dialog_close_button", Bcd.dialog).addEventListener('click', (e) => {
                e.preventDefault();
                Bcd.toggle_download_dialog();
                return false
            });
            qs(".download_dialog_close_button", Bcd.dialog).addEventListener('mouseover', (e) => {
                Bcd.animate({
                  duration: 400,
                  timing: function(timeFraction) {
                    return Math.pow(timeFraction, 2);
                  },
                  draw: function(progress) {
                    e.target.style.borderTopRightRadius = 16 + (progress * 6) + 'px';
                    e.target.style.borderBottomLeftRadius = 16 - (progress * 16) + 'px';
                  }
                });
            });
            qs(".download_dialog_close_button", Bcd.dialog).addEventListener('mouseout', (e) => {
                Bcd.animate({
                  duration: 300,
                  timing: function back(timeFraction) {
                    return Math.pow(timeFraction, 2)
                  }.bind(2.0),
                  draw: function(progress) {
                    e.target.style.borderBottomLeftRadius = progress * 16 + 'px';
                    e.target.style.borderTopRightRadius = 22 - (progress * 6) + 'px';
                  }
                });
            });
            Bcd.link.classList.remove("disabled");
        }
        (function (vb) {
            return new Promise( (resolve) => {
                try {
                  var url = Bcd.src.videos[vb].url;
                  var valid = true;
                  var response = "";
                  var request = new XMLHttpRequest();

                  if ('withCredentials' in request) {
                    request.addEventListener('progress', function(e) {
                      if (e.total && valid) {
                          request.abort();
                          valid = false;
                          debug('Size request progress', e);
                          resolve({size: e.total, vb: vb});
                      }
                      else {
                          if (request.status !== 0) {
                              var err = `Error: ${request.status} ${request.statusText}`;
                              Bcd.src.videos[vb].error = err;
                              valid = false;
                              request.abort();
                              qs(".download_details.v"+ vb, Bcd.dialog).innerHTML = err;
                          }
                      }
                    });
                    request.addEventListener('error', function() {
                      error('Size request Error', request.status);
                      qs(".download_details.v"+ vb, Bcd.dialog).innerHTML = "";
                    });
                    request.open('GET', url, true);
                    request.responseType = "blob";
                    request.send();
                  }
                } catch (e) {
                  error('Size Promise Error', e);
                }
            })
        }) (Bcd.videoButtons).then( (blob) => {
          let dims = "",
              type = Bcd.src.videos[blob.vb].type,
              size = Bcd.prettyBytes(blob.size),
              width = Bcd.src.videos[blob.vb].width,
              height = Bcd.src.videos[blob.vb].height;

          if (type && type.indexOf('video/') !=-1) {
              type = type.slice(type.lastIndexOf('/') +1);
              type = type[0].toUpperCase() + type.slice(1);
          }

          if (width && height) {
              dims = `<br />&nbsp;&nbsp;${width} x ${height}`;
          }
          qs(".download_details.v"+ blob.vb, Bcd.dialog).innerHTML = `${type} ${size}${dims}`;
          debug('videoButtons Blob response:', blob);
        });
        Bcd.videoButtons += 1;
    },


    toggle_download_dialog: () => {
        if (Bcd.dialog.style.display == "none") {
            Bcd.dialog.style.overflow = "hidden";
            Bcd.dialog.style.top = w.scrollY + 60 +"px";
            Bcd.dialog.style.left = w.innerWidth - 500 +"px";
            Bcd.dialog.style.display ='block';
            Bcd.dialog.style.height ='auto';

            Bcd.animate({
              duration: 400,
              timing: function(timeFraction) {
                return Math.pow(timeFraction, 2);
              },
              draw: function(progress) {
                Bcd.dialog.style.width = progress * 400 + 'px';
                if (progress === 1) {
                    Bcd.dialog.style.overflow = 'visible';
                }
              }
            });
        }
        else {
            let height = Bcd.dialog.getBoundingClientRect().height;
            Bcd.dialog.style.overflow = "hidden";

            Bcd.animate({
              duration: 500,
              timing: function back(x, timeFraction) {
                return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
              }.bind(null, 2.8),
              draw: function(progress) {
                Bcd.dialog.style.width = 400 - (progress * 400) + 'px';
                Bcd.dialog.style.height = height - (progress * height) + 'px';
                if (progress === 1) {
                    Bcd.dialog.style.display ='none';
                    Bcd.dialog.style.overflow = 'visible';
                }
              }
            });
        }
    },


    buttonDone: (button, state = "finished", txt = "Done") => {
        button.classList.replace("download_cancel", `download_${state}`);
        button.removeAttribute("downloadid");
        button.removeAttribute("style");
        button.disabled = "disabled";
        button.innerText = txt;
    },


    saveToDisk: (asVideo = false, asPoster = false, asAux = false) => {

        // Reset icon color
        Bcd.link.classList.remove('download_error', 'download_finished');
        Bcd.link.classList.add('download_started');

        let el, ext, title, total, button;
        let abo = "",
            dlp = [],
            ab0 = null,
            ab1 = null,
            indx = null,
            update = [],
            progress = [],
            mos = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            downloadURLs = ((url, name, type, n, t, dli, ab) => {

            msg('Download Started:', name, `(${n} of ${t})`);

            Bcd.downloads[dli]    = [];
            Bcd.downloads[dli][0] = {name: name, n: n, t: t};
            Bcd.downloads[dli][1] = SmartyDownload({

                id: dli,
                url: url,
                name: name,
                type: type,
                onload: () => {
                    msg(`Download Complete: ${name} (${n} of ${t})`);
                    // single video, single image, caption file
                    if (! ab) {
                        if (button = qs(`button.download_video_only[downloadid="${dli}"]`, Bcd.dialog)) {
                            Bcd.buttonDone(button);
                            if (dlp[dli]) dlp[dli].innerHTML = "";
                        } else if (button = qs(`button.download_poster_only[downloadid="${dli}"]`, Bcd.dialog)) {
                            Bcd.buttonDone(button);
                        }
                        if (indx && qs("#tracks .captions")) {
                            qs("#tracks .captions").options[indx].style.backgroundColor = "#8efc8e";
                        }
                    }
                    //  ab as video or image
                    else {
                        if (button = qs(`button.download_poster_only[downloadid="${dli}"]`, Bcd.dialog)) {
                            Bcd.buttonDone(button);
                        } else if (button = qs(`button.download_video_and_poster[downloadid="${ab}"]`, Bcd.dialog)) {
                            Bcd.buttonDone(button);
                            if (dlp[dli]) dlp[dli].innerHTML = "";
                        }
                    }
                    if (qsa("button.download_cancel", Bcd.dialog).length === 0) {
                        Bcd.link.classList.replace('download_started', 'download_finished');
                    }
                },
                onprogress: (dl) => {
                    debug(`Download Progress ${dli}:`, dl);

                    if (progress[dli] && dlp[dli]) {
                        if ((update[dli]++ % 10 === 0) || dl.loaded == dl.total) {
                            let now = new Date(),
                                pct = Math.round(dl.loaded / dl.total * 100),
                                rate = dl.loaded / (now - progress[dli]) * 1000,
                                finish = Math.round((dl.total - dl.loaded)/ dl.loaded * (now - progress[dli])),
                                crt = `${Math.round(dl.loaded / dl.total * 1000) / 10}.0`;

                            crt = crt.slice(0, crt.indexOf(".") + 2);
                            //debug('Round (dl.total - dl.loaded: '+(dl.total - dl.loaded)+') / dl.loaded: '+dl.loaded+' * (now - progress: '+(now - progress[dli])+'), yeilds: '+finish)
                            finish = new Date(now - finish);
                            finish = getPublishDate([ [], [finish.getUTCHours()], [finish.getUTCMinutes()], ["UTC"], [mos[finish.getUTCMonth()]], [finish.getUTCDate()], [finish.getUTCFullYear()], [finish.getUTCSeconds()] ]);
                            el.style.background = `linear-gradient(to right, #30a247 ${pct - 10}%, #8efc8e ${pct}%, #ed7f5d 0%, #ed7f5d 100%)`;
                            dlp[dli].innerHTML = `<b>${crt}%</b> =&gt; ${Bcd.prettyBytes(dl.loaded)} of ${Bcd.prettyBytes(dl.total)} (${Bcd.prettyBytes(rate)}/s) in ${finish}`;
                        }
                    }
                    else if (dl.total !=-1 && dl.lengthComputable) {
                        el = qs(`button.download_cancel[downloadid="${ab ? ab : dli}"]`, Bcd.dialog);
                        if (el && ! el.classList.contains("download_poster_only")) {
                            progress[dli] = new Date();
                            update[dli] = 0;
                            dlp[dli] = qs(".download_progress."+ (el.getAttribute("bid")), Bcd.dialog);
                        }
                    }
                    else if (dl.total ==-1) {
                    }
                },
                onerror: (dl) => {
                    button = qs(`button.download_cancel[downloadid="${ab ? ab : dli}"]`, Bcd.dialog);
                    if (! dl.error) {
                        msg(`Download Canceled: ${name} (${n} of ${t})`);
                        if (button) {
                            button.dispatchEvent( new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true
                            }));
                        }
                        if (qsa("button.download_cancel", Bcd.dialog).length === 0) {
                            Bcd.link.classList.remove('download_started');
                        }
                        if (qsa("button.download_finished", Bcd.dialog).length) {
                            Bcd.link.classList.add('download_finished');
                        }
                    }
                    else {
                        error(`SmartyDownload (${dli})`, dl.error);
                        msg(`Download Canceled: ${name} (${n} of ${t})`);
                        Bcd.link.classList.replace('download_started', 'download_error');
                        if (dl.ext && ["mp4","ogg","webm"].indexOf(dl.ext) ==-1) {
                            button = qs("button.download_poster_only", Bcd.dialog);
                            qs(".download_poster .poster_saveas", Bcd.dialog).classList.remove("hidden")
                        }
                        if (button) {
                            Bcd.buttonDone(button, "error", "Error");
                        }
                    }
                    if (indx && qs("#tracks .captions")) {
                        qs("#tracks .captions").options[indx].style.backgroundColor = "#f00";
                    }

                    return
                },
                ontimeout: () => {
                    error(`SmartyDownload: ${name} (${n} of ${t}) has timed out`);
                    Bcd.link.classList.replace('download_started', 'download_error');

                    return
                },
                onabort: () => {
                    debug(`SmartyDownload: ${name} (${n} of ${t}) has been aborted`)

                    return
                }
            })
        })
        title = Bcd.flattenTitle(d.title);
        total = (asVideo && asPoster) ? 2 : 1;
        if (asVideo) {
            ab0 = ++Bcd.downloadIndex;
            abo = asPoster ? `${ab0}-${ab0 + 1}` : '';
            ext = asVideo.url.slice(asVideo.url.lastIndexOf('.'));
            downloadURLs(asVideo.url, title + ext, asVideo.type, 1, total, ab0, abo);
        }
        if (asPoster) {
            ab1 = ++Bcd.downloadIndex;
            abo = asVideo ? `${ab1 - 1}-${ab1}` : '';
            ext = asPoster.url.slice(asPoster.url.lastIndexOf('.'));
            downloadURLs(asPoster.url, title + ext, asPoster.type, total, total, ab1, abo);
        }
        if (asAux) {
            ab1 = ++Bcd.downloadIndex;
            asAux = Bcd.captions[asAux];
            indx = asAux.index;
            ext = asAux.url.slice(asAux.url.lastIndexOf('.'));
            downloadURLs(asAux.url, `${title}.${asAux.lang + ext}`, asAux.type, 1, 1, ab1, null);
        }

        return [ab0, ab1]
    },


    init: (e) => {
        let ext, source, torrent;

        debug('>>>>>>>>>>>>>> Bcd init <<<<<<<<<<=', e);

        if (qs("title") && ! Bcd.loader) {
            addListener(qs("title"), function(e) {
              Bcd.init("loader");
            },{ childList: true });
            Bcd.loader = true;
        }

        if (! Bcd.unloader) {
            w.addEventListener('beforeunload', (e) => {
                try {
                    let vdl = qs("#video_download_dialog");
                    let svd = qs("style#video_download");
                    if (vdl) vdl.parentNode.removeChild(vdl);
                    if (svd) svd.parentNode.removeChild(svd);
                } catch (e) {}
            }, false);
            Bcd.unloader = true;
        }
        Bcd.captions = [];
        Bcd.downloads = [];
        Bcd.videoButtons = 0;
        Bcd.downloadIndex = -1;
        Bcd.download_poster = false;

        if (Bcd.dialog) {
            Bcd.dialog.parentNode.removeChild(Bcd.dialog);
            Bcd.dialog = null;
        }
        if (Bcd.playerAPI = qs("video#player")) {
            Bcd.videoSources = 0;
            Bcd.src = {videos: []};

            if (w.webtorrent) {
                torrent = w.webtorrent.torrents[0];
                torrent.on('ready', () => {
                    source = torrent.urlList[0];
                    Bcd.addSource({src: source, type: "torrent"});
                })
            }
            if (source = qs("source:not([dl])", Bcd.playerAPI)) {
                Bcd.addSource(source);
            }

            if (!qs("video#player.bcd")) {
                addListener(Bcd.playerAPI, function(e) {
                    Bcd.addSource(e.target);
                },{ childList: true, subtree: true });

                if (Bcd.playerAPI.readyState > 0) Bcd.onloadedmetadata();
                Bcd.playerAPI.addEventListener('loadedmetadata', Bcd.onloadedmetadata);
                Bcd.playerAPI.classList.add("bcd");
            }
        }
        else if (w.location.pathname.indexOf('/video') !=-1) {
            if (e == "timed") {
                let err = qs("#page-bar .page-title");
                    /* Server Error */
                if (err && err.innerText.match(/.*((server)+\serror)+$/i)) return
            }
            w.setTimeout(Bcd.init, 250, "timed")
        }
    },


    addSource: (source = null) => {
        let vid, ext, s, poster, postersize;

        if (!Bcd.download_poster) {
            if (Bcd.playerAPI.poster) {
                poster = {url: null, type: null, width: 0, height: 0};
                poster.url = new URL(Bcd.playerAPI.poster);
                poster.url = poster.url.href;
                if (postersize = poster.url.match(/_(\d+)x(\d+)\./)) {
                    poster.width = postersize[1];
                    poster.height = postersize[2];
                }
                poster.type = qs('meta[property="og:image:type"]').content || "image/jpeg";
                Bcd.src.poster = poster;
                Bcd.download_poster = true
            }
        }
        if (source && source.src) {
            ext = source.src.slice(source.src.lastIndexOf('.'));
            s = new URL(source.src);
            if (source.type == "torrent") source.type = "video/mp4 (torrent)";
            else source.setAttribute("dl", Bcd.videoSources);
            vid = {ext: ext, url: s.href, type: source.type, width: 0, height: 0, error: null};
            Bcd.src.videos.push(vid);
            debug(`Video source found: ${source.type}, ${s.href}`);
            Bcd.load("source", vid);
            Bcd.videoSources += 1;
        }
    },


    onloadedmetadata: (e) => {
        let width = Bcd.playerAPI.videoWidth,
            height = Bcd.playerAPI.videoHeight,
            curSrc = Bcd.playerAPI.currentSrc;

        qs("#takeScreenShot").classList.remove("disabled");
        Bcd.src.videos.forEach( (v, i) => {
            debug("url = curSrc ? "+ (v.url == curSrc) +" url: "+v.url);
            if (v.url == curSrc) {
                v.width = width;
                v.height = height;
                if (Bcd.dialog) {
                    if (qs(".download_details.v"+ i, Bcd.dialog).innerText.indexOf(" x ") ==-1 &&
                      ! qs(".download_details.v"+ i +" ul", Bcd.dialog))
                    {
                        let dims = `<br />&nbsp;&nbsp;${width} x ${height}`;
                        qs(".download_details.v"+ i, Bcd.dialog).innerHTML += dims;
                        debug("loadedmetadata Bcd.src.videos: ", Bcd.src.videos);
                        debug("Bcd.dialog video("+i+") dimensions added");
                    }
                }
            }
        })
    },


    animate: ({timing, draw, duration}) => {
      let start = performance.now();

      requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = timing(timeFraction);
        draw(progress);
        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        }
      });
    },


    prettyBytes: (bytes=0) => {
        let c, i = 0, b = parseInt(Math.abs(bytes)), g = [' B',' kB',' mB',' gB',' tB', ' pB'];
        if (b < 1) return '0.00 B';
        while (b >= 1024) { b /= 1024; i+=1 };
        c = `${Math.round(b * 10) /10}.0`;
        c = c.slice(0, c.indexOf(".") + 2);
        return c + g[i]
    },


    downloadIcon: '<svg class="svg-inline--fa fa-w-18 action-icon fa-fw" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="0.55in" height="0.55in">'+
    '<path fill="currentColor" stroke="currentColor" stroke-width="2" d="M 0.17,37.33 C 3.00,37.11 4.50,44.67 4.83,47.39 4.83,47.39 45.33,47.39 45.33,47.39 45.33,47.39 45.58,37.19 49.61,36.83 '+
    '48.11,43.44 47.30,46.66 47.17,49.72 47.17,49.72 21.39,49.61 21.39,49.61 21.39,49.61 5.50,28.81 5.50,28.81 5.50,28.81 15.31,28.81 15.31,28.81 16.06,6.12 29.50,2.19 42.38,0.62 33.50,4.62 '+
    '23.10,9.76 24.28,28.89 24.28,28.89 34.25,28.88 34.25,28.88 34.25,28.88 18.61,49.67 18.61,49.67 18.61,49.67 3.00,49.67 3.00,49.67 3.22,49.67 1.33,42.56 0.06,37.28M 40.31,-1.94" /></svg>'
};


    const xhrRequest = function(opt) {
        var xhr = null;
        var saveAs = function(blob, name) {
            return new Promise((resolve, reject) => {
                var url;
                var success = 0;
                var a = d.createElementNS("http://www.w3.org/1999/xhtml", "a");
                const removeLink = (url) => {setTimeout(() => {(w.URL || w.webkitURL || w).revokeObjectURL(url);}, 20000)}
                if ("download" in a) {
                    success = 1;
                    (url = (w.URL || w.webkitURL || w).createObjectURL(blob), setTimeout(function() {
                        a.href = url;
                        a.download = name;
                        a.dispatchEvent(new MouseEvent('click'));
                        removeLink(url);
                        debug('download saveAs 1, linkclick');
                        resolve();
                    }))
                }
                else if ("application/octet-stream" === blob.type && w.FileReader) {
                    success = 1;
                    var fr = new FileReader;
                    fr.onloadend = function() {
                        var f = fr.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                        w.open(f, "_blank") || (w.location.href = f);
                        debug('download saveAs 2, FileReader');
                        resolve();
                    };
                    fr.readAsDataURL(blob);
                }
                else {
                    success = 1;
                    url = (w.URL || w.webkitURL || w).createObjectURL(blob);
                    "application/octet-stream" === blob.type ?
                                       w.location.href = url :
                                       w.open(url, "_blank") || (w.location.href = url);
                    removeLink(a, url);
                    debug('download saveAs 3, w.open');
                    resolve();
                }
                if (!success) reject()
            })
        }

        var getFile = function () {
            xhr = new XMLHttpRequest();
            let abort = xhr.abort;
            abort = abort.bind(xhr);
            xhr.timeout = opt.timeout;
            xhr.onerror = (function() {
                if (xhr.readyState === 4 && xhr.status === 0 && xhr.response === null) {
                    let ext = opt.url.slice(opt.url.lastIndexOf('.') + 1);
                    opt.onerror({error: "Possible Cross-Origin Request Block", ext: `${ext}`})
                } else opt.onerror
            });
            xhr.onabort = opt.onabort;
            xhr.ontimeout = opt.ontimeout;
            xhr.onprogress = opt.onprogress;
            xhr.onload = (e) => {
                e = e.target;
                if (e.status == 200 || e.status == 304 && e.readyState == 4) {
                    let type = e.response.type || opt.type || 'application/octet-stream';
                    let blob = new Blob([e.response], { type: type });
                    saveAs(blob, (opt.name || "download")).then( (val) => {
                        debug('saveAs Success');
                        opt.onload();
                    }).catch( (val) => {
                        opt.onerror({error: `saveAs( "${opt.name}" ) Failed`});
                    });
                }
                else opt.onerror({error: `${e.status}: ${e.statusText}`});
            }

            xhr.open('GET', opt.url, true);
            xhr.responseType = 'blob';
            xhr.send();
            return {abort: abort}
        }
        return getFile()
    }


    const SmartyDownload = function(params) {return xhrRequest(params);}


    const getPublishDate = (u = []) => {
        let now, days, scs, mis, hrs, dys, wks, yrs, utc, sec;
        let out = "",
            mos = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        if (u.length) {
            utc = u[3];
            now = new Date();
            sec = typeof u[7] !== 'undefined';
            dys = now.getUTCDate() - parseInt(u[5]);
            hrs = now.getUTCHours() - parseInt(u[1]);
            mis = now.getUTCMinutes() - parseInt(u[2]);
            yrs = now.getUTCFullYear() - parseInt(u[6]);
            mos = now.getUTCMonth() - mos.indexOf(String(u[4]));
            scs = sec ? now.getUTCSeconds() - parseInt(u[7]) : now.getUTCSeconds();
            days = new Date(now.getUTCFullYear(), now.getUTCMonth(), 0).getDate();

            if (mis < 0) {hrs -= 1; mis += 60;}
            if (hrs < 0) {dys -= 1; hrs += 24;}
            if (dys < 0) {mos -= 1; dys += days;}
            if (mos < 0) {yrs -= 1; mos += 12;}
            if (yrs < 0) {yrs = 0;}

            if (yrs) {
                out = `${yrs === 1 ? "a" : yrs} year${yrs > 1 ? 's' : ''}`;
                if (mos > 0) out += `, ${mos} month${mos > 1 ? 's' : ''}`;
            }
            else if (mos > 0) {
                out = `${mos} month${mos > 1 ? 's' : ''}`;
                if (dys > 6) {
                    wks = parseInt(dys / 7);
                    out += `, ${wks === 1 ? "a" : wks} week${wks > 1 ? 's' : ''}`;
                }
                else if (dys > 0) out += `, ${dys === 1 ? "a" : dys} day${dys > 1 ? 's' : ''}`;
            }
            else if (dys > 0) {
                if (dys > 6) {
                    wks = parseInt(dys / 7);
                    out = `${wks === 1 ? "a" : wks} week${wks > 1 ? 's' : ''}`;
                    if (dys % 7 > 0) out += `, ${dys % 7} day${dys % 7 > 1 ? 's' : ''}`;
                }
                else if (dys > 0) {
                    out = `${dys === 1 ? "a" : dys} day${dys > 1 ? 's' : ''}`;
                    if (hrs > 0) out += `, ${hrs} hour${hrs > 1 ? 's' : ''}`;
                }
            }
            else if (hrs > 0) {
                out = `${hrs === 1 ? "an" : hrs} hour${hrs > 1 ? 's' : ''}`;
                if (mis > 0) out += `, ${mis} minute${mis > 1 ? 's' : ''}`;
            }
            else if (mis > 0 || (! sec && scs > 30)) {
                if (scs > 30) mis += 1;
                if (mis < 60) out = `${mis === 1 ? "a" : mis} minute${mis > 1 ? 's' : ''}`;
                else out = "an hour";
            }
            else if (scs > 0) out = `${scs} second${scs > 1 ? 's' : ''}`;
            else out = "a moment";

            return out
        }
    }

    const qs = (selector, el=document) => el.querySelector(selector);
    const qsa = (selector, el=document) => el.querySelectorAll(selector);
    const dce = (tag) => document.createElement(tag);

    const addListener = (target, fn, config) => {
        var cfg = Object.assign({}, {attributes:!1, childList:!1,
                          characterData:!1, subtree:!1}, config);
        var observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => { fn(mutation) })});
        observer.observe(target, cfg);
        return observer
    }

    const msg = function() {console.log(`\u2139\ufe0f %c[${name}] ${Array.prototype.slice.call(arguments).join(" ")}`, "font-weight: 600; color: #0B149E; text-shadow: 1px 1px #DDD;");}

    const error = function() {console.error(`[${name}] ${Array.prototype.slice.call(arguments).join(" ")}`);}

    const debug = function() {
        if (BC_Debug) {
            let n, m = "";
            for (n in arguments) {
                if (typeof arguments[n] === "object" || typeof arguments[n] === "array") {
                    m += "%o";
                    console.log(`\ud83d\udd28 %c[${name}] ${m}`, "font-weight: 400; color: #853f02; text-shadow: 1px 1px #DDD;", arguments[n]);
                    return;
                } else m += arguments[n] + " ";
            }
            console.log(`\ud83d\udd28 %c[${name}] ${m}`, "font-weight: 400; color: #BC5802; text-shadow: 1px 1px #DDD;");
        }
    }

      /* Not in Frames or Cloudflare error pages */
    if (w.self == w.top && !qs("#cf-error-details")) {
        BC.init().then( results => {
            if(results) {BC.chuteMePlease(); Bcd.init("orig")}
            else console.error('S_marty: Error initialising SmartChute');
        });
    }

}) ();
