// ==UserScript==
// @name Youtube WideScreen (New Design Polymer) [USw] v.71
// @namespace youtube.com
// @version 71000.0.0
// @description For a Wide Screen and the YouTube New Design
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/409893/Youtube%20WideScreen%20%28New%20Design%20Polymer%29%20%5BUSw%5D%20v71.user.js
// @updateURL https://update.greasyfork.org/scripts/409893/Youtube%20WideScreen%20%28New%20Design%20Polymer%29%20%5BUSw%5D%20v71.meta.js
// ==/UserScript==

(function() {
let css = `

/* 0- YouTube WideScreen (New Design Polymer) v.71 (new71) - TEST TOTARA -From UserCSS - HOME Simple / SEARCH (2 By Row) / CHAT - TEST (No Color)- QUANTUM */

/* YouTube WideScreen (New Design Polymer DEV Test */
/* ==== 0- YouTube WideScreen (New Design Polymer) [USw] v.56 (new6) - USw - FIX CY Fung FIX ==== */
/* LAST UPDATE USERSTYLES.ORG - ERROR MINIFIED */

/* NO DARK 
html:not([dark]):not([dark="true"]):not(.style-scope) 
BLACK    background-color: rgba(17, 17, 17, 0.4) !important;
RED    background-color: rgba(255, 0, 0, 0.19) !important;
==== */

/* (removed 2025.09 by YOUTUBE) - DEPRECATE-FULLERSCREEN-UI
deprecate-fullerscreen-ui
SEE GM: "YouTube Restore Fullscreen Scrolling":
https://greasyfork.org/fr/scripts/547663-youtube-restore-fullscreen-scrolling
=== */

/* GM "TABVIEW TOTARA":
not(:has(tabview-view-pos-thead))
:has(tabview-view-pos-thead)
==== */

/* PLAYER - DESIGN INTERFACE - ACTUAL  - 2025-10:
.ytp-delhi-modern
==== */

/* TOOLTIP BOTTOM - NORMAL PLAYER
ytd-watch-flexy:not([fullscreen], [theater], .ytp-embed) .ytp-tooltip.ytp-bottom
==== */
/* TOOLTIP BOTTOM - THEATER PLAYER
ytd-watch-flexy[theater] .ytp-tooltip.ytp-bottom
==== */
/* TOOLTIP BOTTOM - FULLSREEN PLAYER
ytd-watch-flexy[fullscreen] .ytp-tooltip.ytp-bottom
==== */

/* NOT PREVIEW VIDEO ON HOVER =
not(#inline-preview-player)
=== */

/* SKELETON ;
div[class*="skeleton"]
=== */

/* MINI HIDDEN - MINI PANEL LEFT HIDDEN 
ytd-mini-guide-renderer.ytd-app[hidden]
==== */


/* NOT EMDED : 
.html5-video-player:not(.ytp-embed)
==== */

/* PLAYER - NORMAL :
ytd-watch-flexy:not([fullscreen], [theater], .ytp-embed)
==== */

/* PLAYER - THEATER / CINEMA :
ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy, 
==== */

/* PLAYER - FULLSCREEN :
ytd-watch-flexy[fullscreen] #player-theater-container.ytd-watch-flexy
ytd-watch-flexy[fullscreen]
.ytp-big-mode
==== */

/* MAXIMIZE VIDEO: 
#bodyToothbrush
==== */

/* MINI PLAYER :
#movie_player.html5-video-player.ytp-player-minimized.ytp-small-mode  
==== */

/*  NOT EMBED/ CHANNEL PLAYER:
:not(.ytp-embed)not(#c4-player)
#player:not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom 
==== */

/* CHANNEL PLAYER :
ytd-channel-video-player-renderer #c4-player.html5-video-player .html5-video-container
=== */

/* CHAT :
.ytd-page-manager[should-stamp-chat]
=== */

/* GUIDE PERSISTENT / ALWAYS OPEN:
[guide-persistent-and-visible]
ytd-app:not([guide-persistent-and-visible])
=== */


/* GM "YouTube Lecture Plox" by Alplox [2025.10]:
span[style="display: inline-block; margin-left: 10px; color: rgb(15, 157, 88); font-weight: bold;"]
==== */


/* ADDON GM "Video Speed Buttons"
.vsb-container
#below .watch-active-metadata + div  > div:first-of-type > div +div:not(#info-contents)
=== */

/* GM "TABVIEW" :
html[plugin-tabview-youtube]  .ytd-page-manager[tabview-youtube-comments][tabview-selection]
=== */

/* GM "POPOUT" :
#movie_player.html5-video-player.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode  .ytp-player-content.ytp-iv-player-content .html5-stop-propagation.iv-drawer-manager + .annotation.annotation-type-custom.iv-branding

/* GM "YouTube Player Controls" by Costas - WIDE  PLAYER
[ytpc_cinema][ytpc_top]
#ytpc_cog_container #ytpc_ytcontrol_button
=== */

/* GM "Youtube UI Fix (2020)":
body.yt-ui-fix 
=== */

/* GM "TIME REMAINING"
.time-remaining-renderer
=== */
/* 3 VERSIONS OF VIDEO PAGE:
https://greasyfork.org/fr/scripts/368389-youtube-time-remaining/discussions/133619#comment-298237
=== */
/* First Version - OWNER UNDER THE PLAYER :
ytd-watch-metadata > #above-the-fold
=== */
/* 2nd Version - OWNER in TABS
ytd-watch-metadata + .watch-active-metadata
OR
.watch-active-metadata 
=== */

/*test OK FIX LAZY LOADING for QUEUE) TEST FRESH:
https://greasyfork.org/fr/scripts/28678-youtube-play-next-queue/discussions/82921
#secondary #secondary-inner  #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:not(:empty) {
DEL     position: fixed !important;
=== */


/* (new4) GM in USE (WORK WITH...):
== NO DARK :
html:not([dark]) ...

== DARK  :
html[dark] ...


==================================================================
==================================================================
==== BEST ====
==================================================================
==================================================================

📌 - GM "TABVIEW TOTARA" by 𝖢𝖸 𝖥𝗎𝗇𝗀 [2025]:
This is a reconstruction version of Tabview Youtube

.

It is under beta testing.
https://greasyfork.org/fr/scripts/501249-tabview-youtube-totara

📌 - GM "Tabview Youtube" by 𝖢𝖸 𝖥𝗎𝗇𝗀 [2025]:
https://greasyfork.org/fr/scripts/428651-tabview-youtube
Please move to Tabview YouTube Totara.

Request about: Tabs Infos empty [NO FIX]:
https://greasyfork.org/fr/scripts/428651-tabview-youtube/discussions/311438#comment-616934
https://github.com/tabview-youtube/Tabview-Youtube/issues/59

Request about: Support "GM - Youtube Play Next Queue":
https://greasyfork.org/fr/scripts/428651-tabview-youtube/discussions/91612

📌 - GM "Youtube Play Next Queue" by Cptmathix [2021]:
Works better than the official queue IMO (which doesn't persist between tabs and elongates video URLs, for example)
https://greasyfork.org/fr/scripts/28678-youtube-play-next-queue
FOR UPDATED version - by 𝖢𝖸 𝖥𝗎𝗇𝗀 (2023.12):
https://greasyfork.org/fr/scripts/28678-youtube-play-next-queue/discussions/189129#comment-452654

📌 - GM "u-Youtube" by ok! [2022]:
AUTO DARK mode + Choose Resolution
https://greasyfork.org/en/scripts/442317-u-youtube

📌 - GM "YouTube Links" by nhyone [2021]:
https://greasyfork.org/en/scripts/5566-youtube-links

📌 - GM "Video Speed Buttons" by Braden Best [2021]:
2022.07 - Add this line to container_candidates to make youtube happy again. "div#above-the-fold",
// Multi-purpose Loader (defaults to floating on top right)
const loader_data = {
    container_candidates: [
        // YouTube
COMMENT : https://greasyfork.org/fr/scripts/30506-video-speed-buttons/discussions/142730
https://greasyfork.org/fr/scripts/30506-video-speed-buttons

📌 - GM "YouTube More Speeds" / "YouTube Plus de délais" by ssssssander [2022]:
https://greasyfork.org/fr/scripts/421670-youtube-more-speeds

📌 - GM "YouTube Time Remaining" by stinkrock [2021]:
https://greasyfork.org/fr/scripts/368389-youtube-time-remaining
YouTube Time Remaining OLD version Working 2022.05 - v.1.8.0 by stinkrock :
https://greasyfork.org/fr/scripts/368389-youtube-time-remaining/discussions/133619#comment-297235

📌 - GM "Youtube Middle Click Search" by kufii [2022]:
https://greasyfork.org/fr/scripts/6031-youtube-middle-click-search

📌 - GM "Youtube subtitles under video frame" by T1m_ [2022]:
- PB THEATER:
https://greasyfork.org/fr/scripts/433440-youtube-subtitles-under-video-frame
#ytp-caption-window-container #caption-window-1.ytp-caption-window-bottom span.captions-text

📌 - GM "Automatic Material Dark-Mode for YouTube" by SteveJobzniak [2018]:
https://greasyfork.org/fr/scripts/32954-automatic-material-dark-mode-for-youtube


==================================================================
==== 👁️ - NEW TEST ==== 
==================================================================

👁️ - GM "[youtube.com] Arrow buttons constant binding by Artem Zaytsev [2025]:
https://greasyfork.org/fr/scripts/393958-youtube-com-arrow-buttons-constant-binding
The arrow buttons don't depend on slider/seekbar focus. Left/Right - always playback, Down/Up - always sound volume.

👁️ - GM "YouTube Lecture Plox" by Alplox [2025.10]:
https://greasyfork.org/fr/scripts/553387-youtube-playback-plox
Enregistre et reprend automatiquement la progression de la lecture des vidéos sur YouTube sans avoir besoin de se connecter.

👁️ - GM "Utags" by Pipe Craft [2025]:
https://greasyfork.org/fr/scripts/460718-utags-add-usertags-to-links

👁️ - GM "Youtube channels open to "Videos" tab" by Bawdy Ink Slinger [2025]:
https://greasyfork.org/fr/scripts/543087-youtube-channels-open-to-videos-tab



👁️ - GM "Bouton de traduction des commentaires YouTube" by linkwanggo [2022]:
https://greasyfork.org/fr/scripts/456108-youtube%E8%AF%84%E8%AE%BA%E7%BF%BB%E8%AF%91%E6%8C%89%E9%92%AE
PB with Greasemonkey 3.17 (Request):
https://greasyfork.org/fr/scripts/456108-youtube%E8%AF%84%E8%AE%BA%E7%BF%BB%E8%AF%91%E6%8C%89%E9%92%AE/discussions/166219

👁️ - GM "Clickbait Remover for Youtube" by Pieter van Heijningen [2022]:
https://addons.mozilla.org/en-US/firefox/addon/clickbait-remover-for-youtube/

👁️ - GM "Move Preferred YouTube Subtitle Auto-translate Language Options To Top" by jcunews - 2022:
https://greasyfork.org/fr/scripts/404054-move-preferred-youtube-subtitle-auto-translate-language-options-to-top
SETTINGS explanation:
If English subtitle is preferred when YouTube is in English, and French subtitle is preferred when YouTube is in French, then then settings should be like below.
let menuTitle    = ["Auto-translate", "Traduire automatiquement"];
let keepLanguage = ["English", "Français"];

👁️ - GM "YouTube Player Controls" by Costas [2022]:
https://greasyfork.org/fr/scripts/16323-youtube-player-controls

👁️ - GM "Add YouTube Video Progress" by jcunews [2022]:
Not working with Gresemonkey
https://greasyfork.org/fr/scripts/38090-add-youtube-video-progress

👁️ - GM "YouTube Clickbait-Buster" by hjk789 [2022]:
https://greasyfork.org/en/scripts/439305-youtube-clickbait-buster

👁️ - GM "Nova YouTube" by raingart [2022]:
https://greasyfork.org/en/scripts/433360-nova-youtube
(Request Not work Waterfox):
https://greasyfork.org/en/scripts/433360-nova-youtube/discussions/128126

👁️ - GM "Youtube - Search While Watching Video" by Cptmathix [2021]:
https://greasyfork.org/fr/scripts/29451-youtube-search-while-watching-video

👁️ - GM "YouTube Permanent ProgressBar"  by cccaaannn - Can Kurt (v.03 - 2022) voir Youtube Music [2022]:(BETTER?) :
https://greasyfork.org/en/scripts/426283-youtube-permanent-progressbar
OR
👁️ - GM "YouTube Progressbar Updater" by Workgroups [2015]:
https://greasyfork.org/fr/scripts/11486-youtube-progressbar-updater

👁️ - GM "Maximize Video" by 冻猫 [2020]:
https://greasyfork.org/fr/scripts/4870-maximize-video

👁️ - GM "Youtube HD" by adisib:
https://greasyfork.org/en/scripts/23661-youtube-hd

👁️ - GM "Youtube - dismiss sign-in" / "Youtube - cacher "connectez-vous"" by Achernar [2022]:
https://greasyfork.org/fr/scripts/412178-youtube-dismiss-sign-in

👁️ - GM "YouTube Popout Button [mashup]" by joeytwiddle [2022]:
https://greasyfork.org/fr/scripts/401907-youtube-popout-button-mashup

👁️ - GM "Close YT Confirmations" by Felipe Marinho [2019]:
Nedd Tweak YT MUSIC + INCLUDE
https://greasyfork.org/fr/scripts/386987-close-yt-confirmations
Alternative ,:

👁️ - GM "Remove Youtube Activity Check" by TIFUByRedditting [2017]:
https://greasyfork.org/fr/scripts/35157-remove-youtube-activity-check



==== Embedded Youtube ====

👁️ - GM "Allow full screen on embedded Youtube" by marwis [2021]:
https://greasyfork.org/fr/scripts/398281-allow-full-screen-on-embedded-youtube



👁️ - ADDON "PotPlayer YouTube Shortcut, Open Links":
https://addons.mozilla.org/fr/firefox/addon/potplayer-youtube-shortcut/
SPONSORBLOCK "SponsorBlock - Skip Sponsorships on YouTube" 
👁️ - ADDON "SponsorBlock" :
https://addons.mozilla.org/en-US/firefox/addon/sponsorblock/
https://sponsor.ajay.
YouTube Clickbait-Busterapp/




==== 🚧 - 2025 - SEEMS NOT WORK WITH or need adaptation ====

🚧 - GM "Youtube Scrollable Suggestions" by TheAlienDrew [2022]:
https://greasyfork.org/en/scripts/397344-youtube-scrollable-suggestions

🚧 - GM "YT: not interested in one click": (seems have no effects... 2021.07)
Hover a thumbnail to see icons at the right: "Not interested" and "Don't recommend channel"
https://greasyfork.org/en/scripts/396936-yt-not-interested-in-one-click


==== 👁️ - SEEMS WORK WITH ====

👁️ - GM "Youtube UI Fix" by Roy192 [2020]:
https://greasyfork.org/fr/scripts/11485-youtube-ui-fix

👁️ - GM "Youtube Ad Cleaner(Include Non-Skippable Ads- works)" by dumb dumb [2021]:
in test (add a Download Button)"
https://greasyfork.org/en/scripts/386925-youtube-ad-cleaner-include-non-skippable-ads-works

👁️ - GM "Youtube - Fix channel links in sidebar recommendations" by 1N07 (2021):
https://greasyfork.org/en/scripts/376510-youtube-fix-channel-links-in-sidebar-recommendations

👁️ - GM "Space-efficient Youtube" by 1N07 [2021]:
https://greasyfork.org/fr/scripts/34388-space-efficient-youtube

👁️ - GM "Youtube polymer engine fixes"
https://greasyfork.org/en/scripts/405614-youtube-polymer-engine-fixes

==== Note about: BYPASS VIDEOS Restricted ====

TEST LINK :
https://www.youtube.com/watch?v=DAsZjMizTJ0
https://www.youtube.com/watch?v=7t0SqerlBA0
EMBED :
https://forums.warframe.com/topic/1286241-thanks-for-watching-prime-time-292/#comment-12332841


👁️ - GM "Simple YouTube Age Restriction Bypass" by zerodytrash [2022]:
Work perfecly!
Review:
https://greasyfork.org/en/scripts/423851-simple-youtube-age-restriction-bypass/discussions/128220
OLD Request:
https://greasyfork.org/en/scripts/423851-simple-youtube-age-restriction-bypass/discussions/93645
GhitHub:
https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass
USERSCRIPT vs EXTENSION:
https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass/issues/136
GM:
https://greasyfork.org/en/scripts/423851-simple-youtube-age-restriction-bypass
ADDON:


OLD SCRIPT [DEPRECATED] :
GM "YouTube: Age Verification Bypass [by u00F8)> v.1.6" (NOT WOTRK / DELETED):
https://greasyfork.org/en/scripts/375525-youtube-age-verification-bypass
MAYBE WRONG:
Youtube Age Verification Bypass Script – Best AI Content Generator Review [2022]:
https://www.learnsteps4profit.com/youtube-age-verification-bypass-script-best-ai-content-generator-review-2022/


ALTERNATIVE /FORKS ?:
👁️ - GM "Bypass YouTube Age Verification 1.01.js" byXP1 [2001]:
https://gist.github.com/XP1/1147490
👁️ - GM "YouTube Age Bypass" by lawl (not work 2018)
https://greasyfork.org/fr/scripts/371261-youtube-age-bypass

Others Solutions:
BKLET - Bookmarklet :
BLET "Bypass YT login!" (watch a protected YouTube):
https://www.nsfwyoutube.com/
OR USE this ADDON:
XPI "Ageless for YouTube" :
https://addons.mozilla.org/en-US/firefox/addon/ageless/

==== Note about Waterfox Classic ====
Not Need now:
For use with Waterfox Classic and  User Agent Switcher, choose:
Force for the domain (the first one)
Robot: Google Bot

NEED always for Youtube 360° and Nivida:
TOPIC:
https://github.com/MrAlex94/Waterfox/issues/1473#issuecomment-787830672

Install enhanced h264ify:
https://addons.mozilla.org/en-US/firefox/addon/enhanced-h264ify/
about:config:
Set media.windows-media-foundation.allow-d3d11-dxva:false
reset media.hardware-video-decoding.failed to false

=== OTHER ===

GM "Don't "fuck" with my scroll":
Maybe solve related video loading but PB for comments:
https://greasyfork.org/en/scripts/381674-don-t-with-my-scroll

==================================================================
==================================================================
================================================================== */




/* (new62) TEST - DEPRECATE-FULLERSCREEN-UI =======================
deprecate-fullerscreen-ui
ytd-app[deprecate-fullerscreen-ui][frosted-glass-exp][ guide-persistent-and-visible]

GM: "YouTube Restore Fullscreen Scrolling":
https://greasyfork.org/fr/scripts/547663-youtube-restore-fullscreen-scrolling
======================================================================== */

/* (new62) TEST - (removed 2025.09 by YOUTUBE) DEPRECATE-FULLERSCREEN-UI - FEEDS - YOUTUBE
https://www.youtube.com/feed/storefront?bp=ogUCKAU%3D
========================================================================== */

/* (new62) TEST - (removed 2025.09 by YOUTUBE) - DEPRECATE-FULLERSCREEN-UI - FULL SCREEN PLAYER */
/*ytd-app[deprecate-fullerscreen-ui][fullscreen]*/

ytd-app[fullscreen]{
    width: 99.9%;
    min-height: 99.8vh !important;
    max-height: 99.8vh !important;
    overflow: hidden !important;
/*border: 1px solid green !important;*/
}

/* (new62) TEST - (removed 2025.09 by YOUTUBE) - ALL */
/*html {
    width: 99.9%;
    min-height: 99.8vh !important;
    max-height: 99.8vh !important;
    overflow: hidden auto !important;
border: 1px solid green !important;
}*/

/* (new62) TEST - (removed 2025.09 by YOUTUBE) - ALL - NOT SHORT  */
ytd-app[guide-persistent-and-visible] ytd-page-manager.ytd-app:not(:has(ytd-shorts)) {
    display: inline-block !important;
    height: 100% !important;
    min-height: 93vh !important;
    max-height: 93vh !important;
    overflow: hidden auto !important;
/*border: 1px solid green !important;*/
}
/* (new62) TEST - (removed 2025.09 by YOUTUBE) - ALL - @L:
https://www.youtube.com/@machinethinking/videos
=== */
ytd-app[guide-persistent-and-visible] ytd-page-manager.ytd-app:not(:has(ytd-shorts)):has(.ytd-browse.grid.grid-6-columns) {
    display: inline-block !important;
    width: 100% !important;
    min-width: 87% !important;
    max-width: 87% !important;
    height: 100% !important;
    min-height: 93vh !important;
    max-height: 93vh !important;
    overflow: hidden auto !important;
/*border: 1px solid lime !important;*/
}
/* (new62) TEST - (removed 2025.09 by YOUTUBE) - ALL - PODCAST / FEEDS / CHANNE:
https://www.youtube.com/podcasts
https://www.youtube.com/feed/news_destination/entertainment
https://www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw
== HOME OK
https://www.youtube.com/
=== */
ytd-app[guide-persistent-and-visible] ytd-page-manager.ytd-app:has(ytd-two-column-browse-results-renderer) {
    display: inline-block !important;
    width: 100% !important;
    min-width: 87% !important;
    max-width: 87% !important;
    height: 100% !important;
    min-height: 93vh !important;
    max-height: 93vh !important;
    overflow: hidden auto !important;
/*border: 1px solid aqua !important;*/
}

/* ALL - TOP HEADER*/
#header.ytd-browse {
    width: 99.7% !important;
    top: 0vh !important;
    z-index:2000;
/*border: 1px solid aqua  !important;*/
}
#wrapper.tp-yt-app-header-layout>[slot=header] {
    position: sticky !important;
    width: 98.7% !important;
    margin:  0 0 0 0 !important;
    top:0;
    left:0 !important;
    right:0;
    padding: 0 0 0 0 !important;
    z-index:1;
/*border: 1px solid pink  !important;*/
}
#contentContainer.tp-yt-app-header-layout {
	position:relative;
    padding: 0 0 0 0 !important;
	z-index:0
}

/*ytd-app[deprecate-fullerscreen-ui][frosted-glass-exp][ guide-persistent-and-visible] ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-top: 0 !important;
    width: 100%;
height: 87.5vh !important;
overflow: hidden !important;
overflow-y: auto !important;
border-top: 1px solid aqua  !important;
}*/
/*ytd-app[deprecate-fullerscreen-ui][frosted-glass-exp][ guide-persistent-and-visible] ytd-page-manager ytd-browse {
    width: 100%;
    min-height: 92.5vh !important;
    max-height: 92.5vh !important;
    overflow: hidden auto !important;
border: 1px solid gold !important;
}*/

/* (new60) TEST - DEPRECATE-FULLERSCREEN-UI - CHANNEL - SPORT [page-subtype="sports"]
https://www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw
== */
/*ytd-app[deprecate-fullerscreen-ui][frosted-glass-exp][ guide-persistent-and-visible] [page-subtype="sports"] {
    
    width: 100%;
    height: 87.5vh !important;
    overflow: hidden auto !important;
border-top: 1px solid aqua  !important;
}*/


/* (new60) TEST - DEPRECATE-FULLERSCREEN-UI - PODSCAST / CHANNEL @MEDIA [page-subtype="channels"]
https://www.youtube.com/@MeidasTouch
ytd-app[deprecate-fullerscreen-ui][frosted-glass-exp][ guide-persistent-and-visible] #page-manager > [guide-persistent-and-visible][page-subtype="channels"][responsive-sizing="COMPACT"]
==== */
/*ytd-app[deprecate-fullerscreen-ui][frosted-glass-exp][ guide-persistent-and-visible] #page-manager > [guide-persistent-and-visible][page-subtype="channels"][responsive-sizing="COMPACT"] {
    width: 100%;
    height: 92.5vh !important;
    overflow: hidden auto !important;
border: 1px solid lime !important;
}*/








/* VIDEO - TITLE NOT TAGGED */

#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold h1.ytd-watch-metadata + ul.utags_ul.utags_ul_0 {
    position: fixed !important;
    height: 22px  !important;
    width: 22px  !important;
    top: 4vh !important;
    right: 40% !important;
    padding: 0 !important;
    opacity: 1 !important;
    z-index: 5000000 !important;
/*border: 1px solid red !important;*/
}

#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold h1.ytd-watch-metadata + ul.utags_ul.utags_ul_0 li button  {
    display: block !important;
    height: 22px  !important;
    width: 22px  !important;
    margin: -1px 0 0 -1px !important;
    padding: 0 !important;
    z-index: 5000000 !important;
    opacity: 1 !important;
    background: transparent !important;
border: 1px solid green !important;
}

#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold h1.ytd-watch-metadata + ul.utags_ul.utags_ul_0 li button svg  {
    display: block !important;
    height: 20px  !important;
    width: 20px  !important;
    padding: 0 !important;
    z-index: 5000000 !important;
    opacity: 1 !important;
/*border: 1px solid yellow !important;*/
}

/* TAGGED*/
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold h1.ytd-watch-metadata + ul.utags_ul.utags_ul_1 {
    position: fixed !important;
    top: 4.7vh !important;
    right: 40% !important;
    z-index: 500000000 !important;
/*background: green !important;*/
}


/* (new57) TEST GM "u-Youtube" - TOP MENU SETTINGS */
#end > div.dropdown-hover > div > div{
top: 3vh !important;
    right: 0 !important;
color:#aaa !important;
/*background-color:red !important;*/
}

/* (new56) MARKET UNDER PAYER */
ytd-merch-shelf-renderer {
	display: none !important;
}



/*  (new35) SUPP - BACKGROUNS GRADIENT IMAGE TOP / BOTTOM */
.ytp-big-mode .ytp-gradient-bottom,
.ytp-gradient-top,
.ytp-gradient-bottom {
	background-image: none !important;
}

/* (new56) SUPP ADDS */
ytd-guide-signin-promo-renderer,

/* POP UP ABDBOCK */
tp-yt-paper-dialog,

/* GM - "Disable Playlist Blur Background":
https://greasyfork.org/fr/scripts/453963-disable-playlist-blur-background/code
== */
.immersive-header-background-wrapper.ytd-playlist-header-renderer,

/* GM - "Disable YouTube Glow/Ambilight" :
https://greasyfork.org/fr/scripts/453801-disable-youtube-glow-ambilight/code
===  */
#cinematics.ytd-watch-flexy,

ytd-ad-slot-renderer,
ytd-app[disable-upgrade="true"],
.ytp-drawer-open-button,
.ytp-drawer-content,
iron-overlay-backdrop.opened,
ytd-consent-bump-lightbox#consent-bump,
.annotation-type-custom > div,
.ytp-cards-teaser,
#offer-module {
	display: none !important;
}

/* (new46) DONATION  */
#secondary-inner #donation-shelf:not(:empty):not(:hover) {
	position: fixed !important;
	display: inline-block !important;
	height: 15px !important;
	line-height: 15px !important;
	width: 15px !important;
	margin: 0 0 0 -20px !important;
	border-radius: 100% !important;
	overflow: hidden !important;
	z-index: 5000000000 !important;
/* background: red !important; */
/* border: 1px solid yellow !important; */
}
#secondary-inner #donation-shelf:not(:empty):hover {
	position: fixed !important;
	display: inline-block !important;
	z-index: 500000000 !important;
	background: green !important;
/* border: 1px solid yellow !important; */
}
#secondary-inner #donation-shelf:not(:empty):before {
	content: "€/$" !important;
	position: fixed !important;
	display: inline-block !important;
	height: 15px !important;
	width: 17px !important;
	border-radius: 100% !important;
	font-size: 10px !important;
	text-align: center !important;
	z-index: 500000000 !important;
	opacity: 0.5 !important;
background: red !important;
/* border: 1px solid yellow !important; */
}
#secondary-inner #donation-shelf:not(:empty):hover:before {
	content: "€/$" !important;
	position: fixed !important;
	display: inline-block !important;
	height: 15px !important;
	width: 25px !important;
	margin: 0 0 0 -26px !important;
	font-size: 10px !important;
	text-align: center !important;
	border-radius: 10px 0 0 10px !important;
	opacity: 1 !important;
	z-index: 500000000 !important;
	background: green !important;
border: 1px solid yellow !important;
}


/* (new31) ==== SKELETON - ALL ==== */
div[class*="skeleton"] {
	/* border: 1px solid yellow !important; */
}

/* (new35) PLAYER SKELETON - DEFAULT / THEATER  -  */
#player.skeleton.flexy #player-wrap #player-api #movie_player .html5-video-container {
	top: 0px !important;
/* border: 1px solid pink !important; */
}

#player.skeleton.flexy #player-wrap #player-api #movie_player .html5-video-container .video-stream.html5-main-video {
	height: calc(0.5625 * 100vw);
	max-height: calc(100vh - 185px) !important;
	min-height: 70vh !important;
	min-width: 99.85% !important;
	max-width: 99.85% !important;
	left: 0% !important;
/* border: 1px solid green !important; */
}
#player.skeleton.theater,
#player.skeleton#player.skeleton {
	height: calc(0.5625 * 100vw);
	max-height: calc(100vh - 185px);
	min-height: 480px;
	min-width: 59.9% !important;
	max-width: 59.9% !important;
	left: -20% !important;
/* border: 1px solid aqua !important; */
}

#player.skeleton.theater {
	/* border: 1px solid yellow !important; */
}
#player.skeleton#player.skeleton {
	/* border: 1px solid aqua !important; */
}

/* (new21) SKELETON - UNDER PLAYER - METAS */
#watch-page-skeleton.watch-skeleton #info-container {
	position: fixed !important;
	display: inline-block !important;
	height: 100% !important;
	max-height: 18vh !important;
	min-height: 18vh !important;
	width: 100% !important;
	min-width: 1156px !important;
	max-width: 1156px !important;
	margin: 0 !important;
	bottom: 0vh !important;
	left: 8px !important;
	visibility: visible !important;
}
/* (new21) SKELETON - RELATED VID  - RIGHT PLAYER */
#watch-page-skeleton.watch-skeleton #related {
	position: fixed !important;
	display: inline-block !important;
	height: 100% !important;
	min-height: 94vh !important;
	max-height: 94vh !important;
	width: 100% !important;
	min-width: 37vw !important;
	max-width: 37vw !important;
	margin: 0 !important;
	top: 5vh !important;
	left: 62vw!important;
	visibility: visible !important;
}
/* #related-skeleton.watch-skeleton.ytd-watch-flexy  #related > div.hidden */
#watch-page-skeleton.watch-skeleton #related > div {
	display: inline-block !important;
	width: 35vw !important;
}
/* (new21) SKELETON - INFOS ON LOAD */
#watch-page-skeleton {
	min-width: 1154px !important;
	max-width: 1154px !important;
	height: 100px !important;
	left: -375px !important;
	bottom: 0px !important;
}
/* (new21) SKELETON - PLAYER ON LOAD */
#player.skeleton.flexy:not([hidden=""]) {
	min-width: 1154px !important;
	height: 726px !important;
	left: -374px !important;
	top: -20px !important;
}
#player.skeleton.flexy:not([hidden=""]) #player-wrap {
	width: 1144px !important;
	height: 712px !important;
	margin-left: -22px !important;
	margin-top: -20px !important;
}
#player.skeleton.flexy:not([hidden=""]) #player-wrap #player-api {
	width: 1142px !important;
	height: 712px !important;
	top: 0px !important;
}

/* (new42) SEEK INFOS */
/* BACK */
.ytp-doubletap-ui-legacy[data-side="back"] {
	position: absolute;
	bottom: 0;
	left: 0 !important;
	top: 0 !important;
	overflow: hidden;
	z-index: 19;
	color: #ddd;
/* border: 1px solid red !important; */
}
.ytp-doubletap-ui-legacy[data-side="back"] .ytp-doubletap-static-circle {
	position: absolute;
	left: 0 !important;
	top: 50% !important;
	border-radius: 50%;
	overflow: hidden;
	transform: translate(0%, -50%) !important;
/* background-color: red !important; */
}
/* NOT THEATER */
ytd-watch-flexy[flexy][is-two-columns_]:not([theater]):not([fullscreen]) .ytp-doubletap-ui-legacy[data-side="back"]:not(.ytp-chapter-seek) .ytp-doubletap-seek-info-container {
	position: relative !important;
	width: 4% !important;
	height: 4vh !important;
	top: 50% !important;
	text-align: left !important;
	transform: translate(-5vw, -2vh) !important;
/* border: 1px solid gold !important; */
}
/* THEATER / FULL SCREEN */
ytd-watch-flexy[flexy][is-two-columns_][fullscreen] .ytp-doubletap-ui-legacy[data-side="back"]:not(.ytp-chapter-seek) .ytp-doubletap-seek-info-container,
ytd-watch-flexy[flexy][is-two-columns_][theater] .ytp-doubletap-ui-legacy[data-side="back"]:not(.ytp-chapter-seek) .ytp-doubletap-seek-info-container {
	position: relative !important;
	width: 4% !important;
	height: 4vh !important;
	top: 50% !important;
	text-align: left !important;
	transform: translate(-9.2vw, -2vh) !important;
/* border: 1px dashed gold !important; */
}

/* FORWARD */
.ytp-doubletap-ui-legacy[data-side="forward"] {
	position: absolute;
	bottom: 0;
	left: 0% !important;
	top: 0% !important;
	overflow: hidden;
	z-index: 19;
/* border: 1px solid green !important; */
}
.ytp-doubletap-ui-legacy[data-side="forward"] .ytp-doubletap-static-circle {
	position: absolute;
	left: 90% !important;
	top: 50% !important;
	border-radius: 50%;
	overflow: hidden;
/* background-color: green !important; */
}
/* NOT THEATER */
ytd-watch-flexy[flexy][is-two-columns_]:not([theater]):not([fullscreen]) .ytp-doubletap-ui-legacy[data-side="forward"]:not(.ytp-chapter-seek) .ytp-doubletap-seek-info-container {
	position: relative !important;
	width: 4% !important;
	height: 4vh !important;
	top: 50% !important;
	text-align: left !important;
	transform: translate(7.5vw, -1.5vh) !important;
/* border: 1px solid red !important; */
}
/* THEATER */
ytd-watch-flexy[flexy][is-two-columns_][fullscreen] .ytp-doubletap-ui-legacy[data-side="forward"]:not(.ytp-chapter-seek) .ytp-doubletap-seek-info-container,
ytd-watch-flexy[flexy][is-two-columns_][theater]:not([fullscreen]) .ytp-doubletap-ui-legacy[data-side="forward"]:not(.ytp-chapter-seek) .ytp-doubletap-seek-info-container {
	position: relative !important;
	width: 4% !important;
	height: 4vh !important;
	top: 50% !important;
	text-align: left !important;
	transform: translate(11vw, -2vh) !important;
/* border: 1px dashed red !important; */
}


/* (new41) YOUTUBE STUDIO */
/*  MISE EN LIGNES LIST */
#dialog.ytcp-multi-progress-monitor {
	position: fixed;
	max-height: 60vh !important;
	min-width: 20vw !important;
	bottom: 0;
	right: 0.5rem !important;
	margin: 0 0 0 0 !important;
	overflow: hidden;
border: 1px solid red !important;
}

#progress-list.ytcp-multi-progress-monitor {
	display: flex;
	flex: 1 1 0;
	flex-direction: column;
	min-height: 60vh !important;
	max-height: 60vh !important;
	overflow-x: hidden;
	overflow-y: auto;
	padding: 0;
/* color: gold !important; */
}
.row.ytcp-multi-progress-monitor {
	align-items: center;
	display: inline-block !important;
	padding: 0 8px;
}
.edit-button.ytcp-multi-progress-monitor {
	align-items: center;
	height: 55px !important;
	outline: medium none;
	overflow: hidden;
	width: 100%;
}
.row.ytcp-multi-progress-monitor .edit-button.ytcp-multi-progress-monitor .progress-title {
	display: inline-block !important;
	min-width: 85% !important;
	margin-right: auto;
	overflow: hidden;
	padding-left: 8px;
	text-align: start;
	text-overflow: ellipsis;
	white-space: nowrap;
color: gold !important;
/* border: 1px solid red !important; */
}
/* .row.ytcp-multi-progress-monitor .edit-button.ytcp-multi-progress-monitor:visited .progress-title{
color: red !important;
} */
.progress-status-text.ytcp-multi-progress-monitor {
	position: absolute !important;
	display: inline-block !important;
	max-width: 70% !important;
	margin: 4vh 0 0 45px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
/* color: red !important; */
}
.progress-row-icon.ytcp-multi-progress-monitor {
	position: absolute !important;
	height: 15px !important;
	width: 15px !important;
	left: 3.4rem !important;
	margin: -3.8vh 0 0 0px;
	padding: 0 !important;
	border-radius: 100% !important;
/* border: 1px solid red !important; */
}

/* HOVER */
#dialog.ytcp-multi-progress-monitor:hover {
	position: fixed;
	max-height: 60vh !important;
	min-width: 30vw !important;
	bottom: 0;
	right: 0.5rem !important;
	margin: 0 0 0 0 !important;
	overflow: hidden;
border: 1px solid red !important;
}
#dialog.ytcp-multi-progress-monitor:hover .progress-status-text.ytcp-multi-progress-monitor {
	text-align: right !important;
	display: inline-block;
	min-width: 80% !important;
}

/* (new22) HOME - YOUTUBE - in 2 Coumn - TOP HEADER - TAGS */
#chips-wrapper.ytd-feed-filter-chip-bar-renderer {
	z-index: 20000 !important;
}
#chips-wrapper.ytd-feed-filter-chip-bar-renderer #scroll-container {
	position: relative;
	width: 100vw !important;
	overflow: hidden;
	white-space: nowrap;
	z-index: 100 !important;
}

/* (new22) HOME - YOUTUBE - in 2 Coumn - LEFT GUIDE */
#content #guide #guide-spacer {
	margin-top: 4vh !important;
}

/* (new63) GM "TIME REMAINING" - MOD NORMAL - .time-remaining-renderer === */
html.tabview-normal-player .time-remaining-renderer  ,
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] .time-remaining-renderer  {
	display: inline-block !important;
	position: fixed !important;
	width: 100% !important;
	min-width: 150px !important;
	max-width: 150px !important;
	height: 100% !important;
	min-height: 25px !important;
	max-height: 25px !important;

	left: 25% !important;
	margin: 2vh 0 0 0 !important;
	padding: 0 !important;
	opacity: 1 !important;
	z-index: 500000000 !important;
/*background: red !important; */
/* border: 1px dashed aqua !important; */
}

/* (new62) GM "TIME REMAINING" - THEATER  / BLEED -[full-bleed-player] .time-remaining-renderer === */
ytd-watch-flexy[theater] .time-remaining-renderer ,
html[plugin-tabview-youtube] ytd-watch-flexy[flexy][theater][theater-requested_][flexy-large-window_][full-bleed-player] .time-remaining-renderer {
	display: inline-block !important;
	position: fixed !important;
	width: 100% !important;
	min-width: 150px !important;
	max-width: 150px !important;
	height: 100% !important;
	min-height: 25px !important;
	max-height: 25px !important;
	top: 6.5vh !important;
	left: 50% !important;
	margin: 0 !important;
	padding: 0 !important;
	opacity: 0.3 !important;
	z-index: 500000000 !important;
/* background: red !important; */
/* border: 1px dashed aqua !important; */
}


/* (new29) ADDON "PotPlayer YouTube Shortcut, Open Links" BUTTONS - MOVE to TOP */
#below .watch-active-metadata + div > div:first-of-type > div + div:not(#info-contents) {
	position: fixed !important;
	top: 5px !important;
	left: 12vw !important;
	z-index: 5000 !important;
}

/* (new37)  GM "YouTube More Speeds" / "YouTube Plus de délais" by ssssssander (2022):
https://greasyfork.org/fr/scripts/421670-youtube-more-speeds
=== */
#more-speeds {
	position: fixed !important;
	bottom: 18vh !important;
	left: 4vw !important;
	z-index: 5000 !important;
	visibility: hidden !important;
}
#more-speeds:hover {
	visibility: visible !important;
}
#more-speeds:before {
	content: "More Speed ►" !important;
	position: absolute !important;
	left: -7.2rem !important;
	padding: 0.19rem 0.3rem !important;
	border-radius: 3px !important;
	z-index: 5000 !important;
	opacity: 0.3 !important;
	visibility: visible !important;
color: gold !important;
background: #111 !important;
border: 1px solid red !important;
}
#more-speeds:hover:before {
	opacity: 1 !important;
	visibility: visible !important;
}

#more-speeds button {
	opacity: 0.2 !important;
}
#more-speeds button:hover {
	opacity: 0.6 !important;
}
#more-speeds button:focus {
	opacity: 1!important;
}
/* (new63) TEST - GM "YouTube More Speeds" - THEATER */
ytd-watch-flexy[theater] #more-speeds ,
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy #below .watch-active-metadata.ytd-watch-flexy + div #more-speeds {
	position: fixed !important;
	top: 6.5vh !important;
	left: 30.5vw !important;
	bottom: unset !important;
	z-index: 5000 !important;
}

/* (new68) OK - GM "Youtube subtitles under video frame" - ytd-watch-flexy.yfms-userjs.ytd-page-manager:not([fullscreen])
=== */

/* (new31) NORMAL PLAYER - Subtitles under video frame */
ytd-watch-flexy.yfms-userjs.ytd-page-manager:not([fullscreen]):not(.parentToothbrush) .ytp-caption-window-container .caption-window.ytp-caption-window-bottom {
	position: absolute !important;
	display: inline-block !important;
	width: 99.5% !important;
	height: 6.5vh !important;
	top: calc(100% + 3.3vh) !important;
	margin-bottom: 0;
	margin-top: 0;
	z-index: 500000 !important;
	opacity: 1 !important;
	visibility: visible !important;
	pointer-events: none !important;
/*border: 1px solid aqua !important;*/
}
/* THEATER - Subtitles under video frame */
/* ytd-watch-flexy.yfms-userjs.ytd-page-manager.hide-skeleton[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments]:not([fullscreen])[theater][theater-requested_]:not([fullscreen]):not(.parentToothbrush) #player-theater-container.ytd-watch-flexy:not(:empty) , */
ytd-watch-flexy.yfms-userjs:not([fullscreen])[theater][theater-requested_]:not([fullscreen]):not(.parentToothbrush) #player-theater-container.ytd-watch-flexy:not(:empty) {
	position: fixed !important;
	display: inline-block !important;
	height: 100% !important;
	min-height: 76.4vh !important;
	max-height: 76.4vh !important;
	min-width: 99.9%;
	max-width: 99.9%;
	top: 9.3vh;
	left: 0;
	margin: 0;
	padding-bottom: 0;
	overflow: visible;
	z-index: 2147483647;
/* background: red !important; */
/* border: 1px solid violet !important; */
}

html.tabview-normal-player[plugin-tabview-youtube]:not(#htmlToothbrush):not(.floater):not(.iri-always-visible) ytd-page-manager#page-manager ytd-watch-flexy.yfms-userjs #player-theater-container.ytd-watch-flexy:not(:empty) .video-stream.html5-main-video,
ytd-watch-flexy.yfms-userjs:not([fullscreen])[theater][theater-requested_]:not([fullscreen]):not(.parentToothbrush) #player-theater-container.ytd-watch-flexy:not(:empty) .video-stream.html5-main-video {
	min-height: 76.4vh !important;
	max-height: 76.4vh !important;
/* border: 1px solid yellow !important; */
}
/* MAXIMIZE - Subtitles under video frame */
ytd-watch-flexy.yfms-userjs.ytd-page-manager.parentToothbrush:not([fullscreen]) .ytp-caption-window-container .caption-window.ytp-caption-window-bottom {
	position: absolute !important;
	display: inline-block !important;
	width: 99.5% !important;
	margin-bottom: 0;
	margin-top: 0;
	top: calc(100% - 10vh) !important;
	z-index: 9999;
/* border: 1px solid green !important; */
}
ytd-watch-flexy.yfms-userjs.ytd-page-manager.parentToothbrush:not([fullscreen]) .ytp-caption-window-container .caption-window.ytp-caption-window-bottom span.captions-text span {
	font-size: 28px !important;
}

/* Subtitles under video frame - CURSER - UNSET */
ytd-watch-flexy.yfms-userjs.ytd-page-manager .caption-window {
	cursor: unset !important;
}

/* (new22) TEST GM "YouTube Player Controls" - html[plugin-tabview-youtube] - [ytpc_cinema][ytpc_top] */
/* NO THEATER */
/* [ytpc_cinema][ytpc_top] #page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata , */
ytd-watch-flexy.ytd-page-manager.hide-skeleton[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments]:not([fullscreen]):not(.parentToothbrush) #player-theater-container.ytd-watch-flexy:not(:empty) ~ #columns.ytd-watch-flexy #primary .watch-active-metadata.ytd-watch-flexy {
	position: fixed !important;
	display: flex;
	display: inline-block !important;
	flex-direction: column;
	flex-grow: 1;
	width: 59.5% !important;
	top: 6.4vh !important;
	z-index: 50000000 !important;
/* border: 1px solid aqua !important; */
}
/* (new22) GM "YouTube Player Controls" - THEATER */
[ytpc_cinema] #page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata,
#page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner td-watch-metadata.watch-active-metadata[description-collapsed][smaller-yt-sans-light-title] {
	bottom: 0;
	height: 2.4vh !important;
	margin: 0vh 0 0;
	overflow-y: hidden !important;
border: 1px solid red !important;
}
[ytpc_cinema] #page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata #above-the-fold #description-and-actions,
#page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata #above-the-fold #description-and-actions,

[ytpc_cinema] #page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata #above-the-fold #owner-and-teaser,
#page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata #above-the-fold #owner-and-teaser {
	display: none !important;
}
/* (new31) THEATER ytd-watch-flexy[theater] */
#page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata #above-the-fold #super-title {
	display: none !important;
}

/* (new22) GM "YouTube Player Controls" - SETTINGS CONTAINER - WIDE PLAYER - [ytpc_cinema][ytpc_top] #page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #player-theater-container ~ #columns #primary #primary-inner .watch-active-metadata 
#columns.ytd-watch-flexy #primary:not(:hover)
===  */
#content.ytd-app[ytpc_cinema]:not([ytpc_top]) ytd-page-manager#page-manager.ytd-app ytd-watch-flexy.ytd-page-manager #columns #primary,
#content.ytd-app[ytpc_top][ytpc_cinema] ytd-page-manager#page-manager.ytd-app ytd-watch-flexy.ytd-page-manager #columns #primary {
	display: inline-block !important;
	z-index: 2147483647 !important;
}
/* (new22) GM "YouTube Player Controls" - OK TOP SEARCH */
#content.ytd-app[ytpc_cinema][ytpc_top] #masthead-container.ytd-app {
	z-index: 2147483647 !important;
}
/* (new22) GM "YouTube Player Controls" - TOP SEARCH */
#content.ytd-app[ytpc_cinema]:not([ytpc_top]) #masthead-container.ytd-app {
	z-index: 100 !important;
}

/* (new43) GM "YouTube Player Controls" - BUTTON SETTINGS  (OWNER INFOS UNDER PLAYER )*/
#ytpc_cog_container #ytpc_ytcontrol_button,
span#ytpc_title_container {
	position: fixed !important;
	display: inline-block !important;
	right: 20vw !important;
	top: 1vh !important;
	z-index: 500000000 !important;
}
#ytpc_cog_container #ytpc_ytcontrol_button::after,
span#ytpc_title_container::after {
	position: fixed;
	display: inline-block;
	content: "Y-Ct";
	top: 1px;
	padding: 2px;
	border-radius: 100%;
	font-size: 7px;
	z-index: 500000000;
	opacity: 0.3 !important;
color: white !important;
background: red !important;
}
#ytpc_cog_container #ytpc_ytcontrol_button:hover::after,
span#ytpc_title_container:hover::after {
	position: fixed;
	display: inline-block;
	content: "YouTube Player Controls";
	top: 1px;
	padding: 2px;
	border-radius: 5px !important;
	font-size: 7px;
	z-index: 500000000;
	opacity: 1 !important;
color: gold !important;
background: green !important;
}
#ytpc_options_popup {
	position: fixed !important;
	width: 235px;
	right: 33vh;
	top: 10px;
	z-index: 5000000 !important;
}
/* (new22) TEST GM "YouTube Player Controls" - GUIDE PANEL - PLAYER PAGE */
#content[ytpc_cinema] tp-yt-app-drawer.ytd-app.ytd-app#guide[opened][swipe-open]:not([persistent]) ~ ytd-page-manager#page-manager.ytd-app ytd-watch-flexy.ytd-page-manager #columns #primary {
	z-index: 0 !important;
}

/* (new32) - GM "Add YouTube Video Progress" Only TAMPERMONKEY */
#vidprogress {
	position: fixed !important;
	line-height: normal;
	min-width: 29ex !important;
	max-width: 49ex !important;
	left: 24vw !important;
	bottom: 2vh !important;
	margin: 0 !important;
	padding: 2px;
	border-radius: 4px;
	font-size: 9pt;
	text-align: center;
	vertical-align: top;
	white-space: nowrap;
}
/* 2nd PROGRESSBAR added by the script - Move to cover the Original */
.ytp-chrome-bottom + #vidprogress2 {
	position: absolute;
	bottom: 4px !important;
	width: 100%;
	z-index: 2000000000;
}
#vidprogress {
	background: #eee none repeat scroll 0 0;
	border: 1px solid #ccc;
}

/* (new21) TEST - GM "u-Youtube" */
#masthead-container.ytd-app {
	z-index: 500000000 !important;
}
#end.ytd-masthead {
	padding-right: 15px !important;
}
.dropdown-hover:focus,
.dropdown-hover:hover,
.dropdown-hover {
	position: fixed !important;
	display: inline-block !important;
	right: -15px !important;
}
/*(new29) */
.dropdown-hover:after {
	content: "U-Y" !important;
	display: inline-block;
	position: fixed;
	right: 2px;
	top: 1px !important;
	padding: 2px !important;
	border-radius: 100% !important;
	font-size: 8px !important;
	z-index: 500000000;
	opacity: 0.8 !important;
color: gold!important;
background: red !important;
}
.dropdown-hover:hover:after {
	content: "u-Youtube" !important;
	display: inline-block;
	position: fixed;
	right: 2px;
	top: 1px !important;
	padding: 3px !important;
	border-radius: 5px !important;
	font-size: 10px !important;
	z-index: 500000000 !important;
background: green !important;
}
.dropdown-box .item {
	position: fixed !important;
	display: inline-block !important;
	right: 114px;
	top: -20px !important;
color: #aaa !important;
background: #202020 !important;
}
/* NO DARK */
html:not([dark="true"]) .dropdown-box .item {
	color: #111 !important;
	background: white !important;
}
/* (new36) ADDON GM "SPONSORBLOCK" MESSAGE */
#categoryPill {
	position: fixed !important;
	display: inline-block !important;
	width: auto !important;
	left: 20vw !important;
	bottom: 2vh !important;
	margin: auto;
	text-align: center !important;
}
/* (new21) ADDON GM "SPONSORBLOCK" ICONS */
.playerButtonImage {
	bottom: 0;
	display: block;
	max-height: 40% !important;
	margin: auto;
	top: 0;
}
/* (new21) ADDON GM "SPONSORBLOCK" POPUP */
#sponsorBlockPopupContainer {
	position: fixed !important;
	margin: 0 !important;
	top: 3.9vh !important;
	right: 0 !important;
	z-index: 50000000 !important;
border: 1px solid red !important;
}

/* (new56) TEST INDICATOR for INFOS UNDER PLAYER  - TAB INFOS - TABVIEW  - ytd-watch-flexy[is-two-columns_]  */
html[plugin-tabview-youtube] .ytd-page-manager.hide-skeleton[is-two-columns_] #columns.ytd-watch-flexy #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy #right-tabs #tab-info ,
html[plugin-tabview-youtube] .ytd-page-manager.hide-skeleton[is-two-columns_] #columns.ytd-watch-flexy #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy #right-tabs #tab-info:not(.tab-content-hidden){
	padding: 5px 5px 0 5px;
	z-index: 50000000 !important;
/*background: olive !important;*/
border: 1px solid red !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[is-two-columns_] #right-tabs #tab-info.tab-content-cld:not(.tab-content-hidden) #description.ytd-video-secondary-info-renderer {
	display: block;
	max-width: 100% !important;
	margin-top: -4.8vh !important;
/*background: pink !important;*/
}

/* (new49) TABVIEW - TABS CNTAINER EXPANDER */
#secondary > tabview-view-secondary-xpander + #secondary-inner tabview-view-tab-expander {
	--tabview-view-tab-expander-opacity1: 0.8;
	--tabview-view-tab-expander-opacity2: 0.5 !important;
	box-sizing: border-box;
	color: var(--yt-spec-call-to-action);
	float: right;
	height: 0;
	margin: 0;
	opacity: 0.8;
	padding: 0;
	position: sticky;
	right: 0;
	top: 0;
	transform: translateY(-300px);
	width: 0;
	z-index: 4;
}
ytd-watch-flexy[is-two-columns_] #tab-info ytd-expander[tyt-info-expander-content] {
	margin: 0;
	padding: 0;
border: 1px solid blue !important;
}
/* #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy #right-tabs , */
#secondary.tabview-hover-slider-enable.ytd-watch-flexy > tabview-view-secondary-xpander + #secondary-inner.ytd-watch-flexy #right-tabs {
	display: inline-block;
	margin: 0;
	position: fixed;
	right: 0vw;
	top: 2.4vh !important;
	width: 100% !important;
	z-index: 5000000;
/* background: olive !important; */
}
#secondary.tabview-hover-slider-enable.ytd-watch-flexy > tabview-view-secondary-xpander + #secondary-inner.ytd-watch-flexy #right-tabs #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy::before {
	content: "Yt Next Queue ";
	top: 2.4vh !important;
/* border: 1px solid aqua  !important; */
}
#secondary.tabview-hover-slider-enable.ytd-watch-flexy > tabview-view-secondary-xpander + #secondary-inner.ytd-watch-flexy #right-tabs #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:hover {
	top: 5.2vh !important;
}
#secondary.tabview-hover-slider-enable.ytd-watch-flexy > tabview-view-secondary-xpander + #secondary-inner.ytd-watch-flexy #right-tabs #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:hover #contents:empty {
	width: 38.5% !important;
	top: 5vh !important;
/* background: red !important; */
}

/* (new36) INFOS MUSIC */
#tab-info ytd-expander.ytd-video-secondary-info-renderer .ytd-video-secondary-info-renderer ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer > #items ytd-video-description-music-section-renderer.ytd-structured-description-content-renderer > div:not([hidden]) {
	display: inline-block !important;
	width: 99% !important;
	height: auto !important;
	margin: 0 !important;
/* border-top: 1px solid red !important; */
border-bottom: 1px solid red !important;
}
#tab-info ytd-expander.ytd-video-secondary-info-renderer .ytd-video-secondary-info-renderer ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer > #items ytd-video-description-music-section-renderer.ytd-structured-description-content-renderer > div:not([hidden]) ytd-info-row-renderer {
	display: inline-block !important;
	height: 30px!important;
	width: 99% !important;
	padding: 0px 0 !important;
	overflow: hidden;
/* border-bottom: 1px solid aqua !important; */
}

#tab-info ytd-expander.ytd-video-secondary-info-renderer .ytd-video-secondary-info-renderer ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer > #items ytd-video-description-music-section-renderer.ytd-structured-description-content-renderer > div:not([hidden])#header {
	height: 30px !important;
	line-height: 30px!important;
	width: 99% !important;
	padding: 0px 0 !important;
/* border-bottom: 1px solid aqua !important; */
}
#tab-info ytd-expander.ytd-video-secondary-info-renderer .ytd-video-secondary-info-renderer ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer > #items ytd-video-description-music-section-renderer.ytd-structured-description-content-renderer > div:not([hidden])#header h3 {
	position: relative !important;
	display: inline-block !important;
	height: 30px!important;
	line-height: 30px!important;
	width: 100% !important;
	margin: 0px 0 0px 0 !important;
	top: -60px !important;
	padding: 0px 0 0 5px !important;
/*border: 1px solid aqua !important; */
}

#tab-info ytd-expander.ytd-video-secondary-info-renderer .ytd-video-secondary-info-renderer ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer > #items ytd-video-description-music-section-renderer.ytd-structured-description-content-renderer > div:not([hidden]) #info-row-container {
	display: inline-block !important;
	width: 90.4% !important;
	height: 27px!important;
	margin: 0px 0 0px 0 !important;
/* border-bottom: 1px solid red !important */
}
#tab-info ytd-expander.ytd-video-secondary-info-renderer .ytd-video-secondary-info-renderer ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer > #items ytd-video-description-music-section-renderer.ytd-structured-description-content-renderer > div:not([hidden]) #info-row-container > div {
	width: 93.8% !important;
	height: auto !important;
	margin: -25px 0 0px 0 !important;
	padding: 0 23px 0 20px !important;
/* border: 1px solid yellow !important; */
}

/* (new21) GM "POPOUT VIDEO body.site-as-giant-card */
/* (new21) GM POPOUT - SUPP ICON BRANDING */
#movie_player.html5-video-player.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .ytp-player-content.ytp-iv-player-content .html5-stop-propagation.iv-drawer-manager + .annotation.annotation-type-custom.iv-branding {
	display: none !important;
}
/* (new21) GM POPOUT PLAYER */
#movie_player.html5-video-player.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .html5-video-container .video-stream.html5-main-video {
	width: 100% !important;
	height: 99.4vh !important;
	left: 0 !important;
	top: 0 !important;
	object-fit: contain !important;
}
/* (new21) GM POPOUT - PROGRESSBAR */
#player #movie_player.html5-video-player.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .ytp-chrome-bottom .ytp-progress-bar-container:not([aria-disabled="true"]) {
	margin-top: 0;
	opacity: 1;
	top: 0.5vh !important;
}

/* (new21)POPOUT - .ytp-iv-drawer-enabled PAUSED */
#player #movie_player.html5-video-player.paused-mode.html5-video-player.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .ytp-chrome-bottom .ytp-progress-bar-container:not([aria-disabled="true"]) {
	margin-top: 0;
	opacity: 1;
	top: 3.7vh !important;
}
/* (new21)POPOUT - PREVIEW - .ytp-iv-drawer-enabled / .paused-mode */
#player #movie_player.html5-video-player.html5-video-player.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .ytp-tooltip.ytp-bottom.ytp-preview {
	top: 76vh !important;
}

/* (new21) OK - GM "Maximize Video" */
#htmlToothbrush #bodyToothbrush #page-manager.ytd-app.parentToothbrush {
	position: fixed !important;
	display: inline-block !important;
	max-height: 100vh !important;
	min-height: 100vh !important;
	width: 100vw !important;
	min-width: 100vw !important;
	max-width: 100vw !important;
	margin: 0 !important;
	z-index: 500000000 !important;
}
#htmlToothbrush #bodyToothbrush #page-manager.ytd-app.parentToothbrush #ujs-hdr-links-div,
#htmlToothbrush #bodyToothbrush #page-manager.ytd-app.parentToothbrush #columns {
	display: none !important;
}
#htmlToothbrush ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy {
	position: fixed !important;
	display: inline-block !important;
	max-height: 99vh !important;
	min-height: 99vh !important;
	margin-top: 0 !important;
	overflow: visible;
	transform: none;
	transform-style: flat;
	transition: none 0s ease 0s;
	z-index: auto;
}
#htmlToothbrush #bodyToothbrush .playerToothbrush {
	position: fixed;
	max-height: 99vh !important;
	min-height: 99vh !important;
	width: 100vw;
	margin-top: 0 !important;
	top: 0 !important;
	transform: none;
	z-index: 2147483646 !important;
}
#htmlToothbrush #bodyToothbrush .parentToothbrush .html5-video-player.ytp-large-width-mode video,
#htmlToothbrush #bodyToothbrush .parentToothbrush video {
	min-width: 100vw !important;
	left: 0 !important;
	object-fit: contain;
}
#leftFullStackButton:not([style=""]),
#rightFullStackButton:not([style=""]) {
	position: fixed;
	height: 95vh !important;
	width: 30px !important;
	top: 0;
	z-index: 2147483647;
	cursor: w-resize !important;
	transition: all ease 0.7s !important;
background: transparent !important;
}
#leftFullStackButton:not([style=""]):hover,
#rightFullStackButton:not([style=""]):hover {
	transition: all ease 0.7s !important;
background: #333 !important;
}
.parentToothbrush ytd-watch-flexy[flexy][theater-requested_=""]:not([fullscreen]) #player-theater-container #player-container #movie_player.ytp-large-width-mode .ytp-chrome-bottom {
	position: absolute !important;
	display: inline-block;
	top: 100vh !important;
	width: 100%;
	opacity: 1;
	visibility: visible;
}
/* GM "Maximize Video" HOVER */
.parentToothbrush ytd-watch-flexy[flexy][theater-requested_=""]:not([fullscreen]) #player-theater-container #player-container #movie_player.ytp-large-width-mode:hover .ytp-chrome-bottom .ytp-chrome-controls {
	position: absolute !important;
	display: inline-block;
	top: -6vh !important;
	min-width: 100% !important;
	opacity: 1;
	visibility: visible;
}
.parentToothbrush ytd-watch-flexy[flexy][theater-requested_=""]:not([fullscreen]) #player-theater-container #player-container #movie_player.ytp-large-width-mode .ytp-chrome-bottom .ytp-progress-bar-container,
.parentToothbrush #movie_player.html5-video-player.ytp-exp-bottom-control-flexbox.ytp-hide-info-bar.ytp-autohide .ytp-progress-bar-container,
.parentToothbrush .ytp-hide-info-bar .ytp-progress-bar-container {
	position: fixed !important;
	display: inline-block !important;
	width: 100%;
	top: 99.1vh !important;
	opacity: 1;
	visibility: visible;
	z-index: 5000000 !important;
}
.parentToothbrush .annotation.annotation-type-custom.iv-branding {
	display: none !important;
}
.parentToothbrush .ytp-tooltip.ytp-preview:not(.ytp-text-detail):not([style*="display: none;"]) {
	position: fixed !important;
	display: inline-block !important;
	top: 72vh !important;
	margin-top: 0vh !important;
	z-index: 500000000 !important;
border: 1px solid green !important;
}

/* (new21) GM "Maximize Video" : #bodyToothbrush  - EMBED - BOTTOM CONTROL */
#bodyToothbrush #player:hover .html5-video-player.ytp-embed.ytp-large-width-mode.paused-mode:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom,
#bodyToothbrush .html5-video-player.ytp-embed.ytp-large-width-mode.paused-mode:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom {
	height: 3px;
	top: 95% !important;
}
/* (new21) GM "Maximize Video" : #bodyToothbrush  - EMBED - CONTROL */
#bodyToothbrush .ytp-exp-bottom-control-flexbox .ytp-chrome-controls,
#bodyToothbrush .html5-video-player.ytp-embed.ytp-large-width-mode.ended-mode:not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom .ytp-chrome-controls,
#bodyToothbrush .html5-video-player.ytp-embed.ytp-large-width-mode.ended-mode:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chrome-controls {
	min-width: 100% !important;
	max-width: 100% !important;
	left: 0px !important;
	right: 0 !important;
	vertical-align: top;
}

/* (new21) POPUP YOUTUBE FIXED - ON PLAYER */
.ytp-popup.ytp-contextmenu:not([style$="display: none;"]) {
	position: fixed !important;
	display: inline-block !important;
	top: 32% !important;
	left: 55% !important;
	z-index: 5000000000 !important;
	text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
background: rgba(28, 28, 28, 0.9);
border: 1px solid red !important;
}

/* (new21) GUIDE PANEL - PLAYER PAGE */
tp-yt-app-drawer.ytd-app.ytd-app[opened]:not([persistent]) {
	z-index: 500000000 !important;
}
tp-yt-app-drawer.ytd-app.ytd-app[opened]:not([persistent]) #contentContainer.tp-yt-app-drawer {
	position: absolute !important;
	top: -36px;
}
tp-yt-app-drawer.ytd-app.ytd-app[opened]:not([persistent]) #contentContainer.tp-yt-app-drawer #header.ytd-app {
	margin-top: -35px;
}
/* (new21) GUIDE PANEL - PLAYER PAGE - TABVIEW */
html[plugin-tabview-youtube] tp-yt-app-drawer.ytd-app.ytd-app[opened]:not([persistent]),
html[plugin-tabview-youtube] tp-yt-app-drawer {
	position: fixed !important;
	display: inline-block !important;
	height: 100vh !important;
	max-height: 100vh !important;
	min-height: 100vh !important;
	right: 0;
	top: 0 !important;
	bottom: 0 !important;
	left: 0;
	transition-property: visibility;
	z-index: 5000000000 !important;
}
html[plugin-tabview-youtube] tp-yt-app-drawer.ytd-app.ytd-app[opened] {
	visibility: visible !important;
}

/* (new21) POPUP - ALL - SETTINGS  / BOTOM PLAYER / etc */
tp-yt-paper-dialog[modern],
.ytd-app > .ytd-popup-container {
	z-index: 500000000 !important;
}

/* (new49) MODAL - PERMISSION - CONNECT TO ADD VIDEO PLAY LIST */
ytd-modal-with-title-and-button-renderer[modal] {
	display: none !important;
	overflow: auto;
	opacity: 0.2 !important;
}

/* (new41) POPUP - EXTRAIT - CONFIMATION */
tp-yt-paper-dialog[modern].ytd-popup-container:not([aria-hidden="true"]) {
	z-index: 500000000 !important;
}

/* (new21) TEST - POPUP CHANNEL MESSAGE */
yt-tooltip-renderer[position-type="OPEN_POPUP_POSITION_BOTTOM"] {
	display: none !important;
}
/* (new21) VIDEO BRANDING */
.annotation.annotation-type-custom.iv-branding {
	position: fixed !important;
	height: 40px !important;
	right: 41vw !important;
	top: 80vh !important;
}
/* (new21) VIDEO BRANDING - EMBED - SUPP */
#movie_player.html5-video-player.html5-video-player .annotation.annotation-type-custom.iv-branding {
	display: none !important;
}

/* (new21) NOT THEATER - BRANDING - PAUSED  */
ytd-watch-flexy:not([theater]):not([fullscreen]) .ytd-watch-flexy:not(#player-theater-container) #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .annotation.annotation-type-custom.iv-branding {
	top: 80vh !important;
}
/* THEATER - BRANDING - PLAYING  */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .annotation.annotation-type-custom.iv-branding {
	top: 87vh !important;
}

/* TEST - ADD INDICATOR FO BUTTON ADDED BY GM "Youtube Ad Cleaner */
.myButton:before {
	content: "Provided \\A by Youtube \\A Add Cleaner" !important;
	position: absolute !important;
	display: inline-block !important;
	vertical-align: middle;
	right: 150px !important;
	height: auto;
	line-height: 8px;
	width: auto !important;
	top: 16px;
	padding: 2px 5px;
	color: white;
	font-size: 10px;
	text-align: center;
	white-space: pre !important;
	border-radius: 2px;
	opacity: 0 !important;
	border: 1px solid transparent;
background-color: green;
}
.myButton:hover:before {
	content: "Provided \\A by Youtube \\A Add Cleaner" !important;
	right: 231px !important;
	opacity: 1 !important;
	transition: all ease 0.7s !important;
background-color: red;
}
.myButton {
	cursor: pointer !important;
}
/* test QUANTUM VIDEO UNSTARTED */
.html5-video-player.unstarted-mode {}

.html5-video-player.unstarted-mode .ytp-cued-thumbnail-overlay {
	z-index: 5000000 !important;
}
.unstarted-mode:not(.playing-mode) .ytp-cued-thumbnail-overlay:not([aria-hidden="true"]) {
	z-index: 5000000 !important;
}

/* (new22) Update PLAY NEXT QUEUE v.3*/
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy {
	position: fixed !important;
	display: inline-block !important;
	width: 40%!important;
	height: auto !important;
	top: 9.3vh !important;
	right: 0 !important;
	padding: 0 0 0 0 !important;
	resize: unset !important;
	overflow: hidden !important;
	z-index: 5 !important;
	visibility: visible !important;
	transition: height ease 0.7s !important;
border-left: 0.2rem solid #222 !important;
border-right: none !important;
border-bottom: 4px solid #222 !important;
background: rgba(17, 17, 17, 0.41) !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:empty,
html:not([dark]):not([dark="true"]):not(.style-scope) #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy {
	border-left: 0.2rem solid #E7E7E7 !important;
	border-bottom: 4px solid #E7E7E7 !important;
	background: transparent !important;
}
/* (new22) */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:not(:empty) {
	display: inline-block !important;
	width: 100% !important;
	height: 13.1vh !important;
	min-height: 13.1vh !important;
	margin-top: 0vh !important;
	right: 0 !important;
	padding: 0.2rem 0 0 0rem !important;
	overflow: hidden !important;
	z-index: 5 !important;
	visibility: visible !important;
	transition: height ease 0.7s !important;
background: #111 !important;
border-left: 0.2rem solid green !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:not(:empty) {
	background-color: rgba(17, 17, 17, 0.4) !important;
}
/* EMPTY QUEUE */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:empty {
	position: fixed !important;
	display: inline-block !important;
	width: 39% !important;
	height: 125px !important;
	min-height: 125px !important;
	top: 9.5vh !important;
	right: 6px !important;
	padding: 7px 5px 0 5px !important;
	overflow: hidden !important;
	z-index: -1 !important;
	visibility: visible !important;
	transition: height ease 0.7s !important;
	pointer-events: none !important;
border-left: 4px solid #333 !important;
background: #111 !important;
}
/* (new21) PLAY NEXT EMPTY - NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:empty {
	border-left: 4px solid #E7E7E7 !important;
	border-bottom: 4px solid #E7E7E7;
	color: gray !important;
	background: white !important;
}

/* (new49) PLAY NEXT EMPTY - INDICATOR */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:empty:after {
	content: "No Videos In Queue ... ";
	display: inline-block !important;
	width: 100% !important;
	height: 115px !important;
	line-height: 115px !important;
	padding: 5px !important;
	font-size: 20px;
	text-align: center;
	z-index: -1 !important;
	border-bottom: none !important;
background: transparent !important;
}
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:empty:hover:after,
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:hover #contents:empty:after {
	color: gold !important;
	background: #222 !important;
}

/* (new32) PLAY NEXT - TAB */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:before {
	content: "Yt Next Queue ";
	position: fixed !important;
	display: inline-block !important;
	width: 6.5rem !important;
	height: 2.1rem!important;
	line-height: 1.9rem;
	margin: 0 0 0 0 !important;
	top: 6.4vh !important;
	right: 3.3vw !important;
	padding: 0.2rem 0.5rem !important;
	text-align: left;
	visibility: visible;
	z-index: 5000000 !important;
	transition: all ease 0.7s !important;
	border-radius: 3px 3px 0 0 !important;
border-top: 1px solid #333;
border-bottom: 2px solid #333;
border-right: 0.2rem solid #333;
border-left: 0.2rem solid #333;
color: gray !important;
background-color: #222;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:before {
	border-top: 1px solid gray !important;
	border-bottom: 2px solid gray!important;
	border-right: none !important;
	border-left: 0.2rem solid gray !important;
	color: gray !important;
background-color: white !important;
}
/* (new35) HOVER */
/* DARK / NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:hover:before,
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:hover:before {
	transition: all ease 0.7s !important;
color: gold !important;
background: rgba(1, 128, 0, 0.49) !important;
border-bottom: 2px solid green !important;
}
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:focus-within #contents:not(:empty),
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:hover #contents:not(:empty) {
	height: 708px !important;
	min-height: 708px !important;
	padding: 7px 0px 0 0 !important;
	overflow-y: auto !important;
	transition: height ease 0.7s !important;
background: rgba(17, 17, 17, 0.9) !important;
border-top: 0.2rem solid green !important;
border-left: 0.2rem solid green !important;
border-bottom: 0.2rem solid green !important;
}
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:focus-within #contents:not(:empty) {
	/* background: green !important; */
}
#related-skeleton + div a,
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy .queue-item.ytd-item-section-renderer {
	float: left;
	clear: none;
	width: 100%;
	max-width: 31.3%;
	min-width: 31.3%;
	height: auto;
	margin-right: 0.2rem;
	margin-left: 0.2rem;
	margin-bottom: 0.2rem;
	border-radius: 3px !important;
	padding: 3px !important;
background-color: black;
border: 1px solid gray !important;
}
#tab-videos ytd-compact-video-renderer .metadata .secondary-metadata {
	display: inline-block !important;
	width: 100% !important;
}
/* (new35) */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy .queue-item.ytd-item-section-renderer ytd-badge-supported-renderer.badges {
	position: relative !important;
	display: inline-block !important;
	width: 100% !important;
	top: 0px !important;
	text-align: center !important;
}
/* (new32) */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy .queue-item.ytd-item-section-renderer ytd-badge-supported-renderer.badges .queue-button {
	display: inline-block !important;
	width: 44% !important;
	line-height: 13px !important;
	font-size: 1rem !important;
	text-align: center !important;
}
/* (new21) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #related-skeleton + div a,
html:not([dark]):not([dark="true"]):not(.style-scope) #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy .queue-item.ytd-item-section-renderer {
	border: 1px solid #E7E7E7 !important;
	background-color: white !important;
}

/* (new31) - PLAY NEXT - COUNTER - start at 01 */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:not(:empty) {
	content: counter(myIndex, decimal);
	counter-increment: myIndex 00 !important;
}
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:not(:empty) .queue-item.ytd-item-section-renderer::before {
	counter-increment: myIndex ! important;
	content: counter(myIndex, decimal);
	position: fixed;
	display: inline-block !important;
	width: auto;
	line-height: 21px;
	height: 21px;
	min-width: 10px;
	right: 2.5vw !important;
	top: 6.5vh;
	bottom: 0px !important;
	padding: 1px 3px;
	text-align: center;
	border-radius: 0 10px 10px 0 !important;
	font-size: 10px;
	z-index: 50000000 !important;
	opacity: 0.7 !important;
color: tomato;
box-shadow: 0 0 2px rgba(162, 160, 160, 0.6) inset;
background: gold;
border: 1px solid red;
}
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:hover #contents:not(:empty) .queue-item.ytd-item-section-renderer::before {
	opacity: 1 !important;
color: white !important;
box-shadow: 0 0 2px rgba(162, 160, 160, 0.6) inset;
background: green !important;
border: 1px solid red;
}

/* (new23) RELATED VIDEO - PLAY NEXT  + TABVIEW - VISIBLE ON HOVER - VOIR THEATER HOVER*/
ytd-watch-flexy[is-two-columns_][tabview-selection=""][theater]:not([fullscreen]) #right-tabs #tab-comments.tab-content-cld.tab-content-hidden + #tab-videos.tab-content-cld.tab-content-hidden #related[placeholder-for-youtube-play-next-queue] #youtube-play-next-queue-renderer:hover,

ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld.tab-content-hidden + #tab-videos.tab-content-cld.tab-content-hidden #related[placeholder-for-youtube-play-next-queue] #youtube-play-next-queue-renderer:hover,
ytd-watch-flexy #right-tabs .tab-content-cld.tab-content-hidden #related[placeholder-for-youtube-play-next-queue] #youtube-play-next-queue-renderer:hover {
	position: fixed !important;
	display: inline-block !important;
	width: 39.4% !important;
	height: 100% !important;
	min-height: 89vh !important;
	max-height: 89vh !important;
	right: 0px !important;
	top: 9vh;
	padding: 7px 5px 0 0;
	resize: unset;
	overflow: hidden;
	overflow-y: auto !important;
	transition: height 0.7s ease 0s;
	visibility: visible !important;
	z-index: 500000000 !important;
background: rgba(17, 17, 17, 1) !important;
border-bottom: 4px solid red !important;
border-left: 4px solid red !important;
border-right: 4px solid red !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld.tab-content-hidden + #tab-videos.tab-content-cld.tab-content-hidden #related[placeholder-for-youtube-play-next-queue] #youtube-play-next-queue-renderer:hover,
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy #right-tabs .tab-content-cld.tab-content-hidden #related[placeholder-for-youtube-play-next-queue] #youtube-play-next-queue-renderer:hover {
	background: white !important;
}
/* (new48) */
ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld.tab-content-hidden + #tab-videos.tab-content-cld.tab-content-hidden #related[placeholder-for-youtube-play-next-queue] #youtube-play-next-queue-renderer:hover #contents:not(:empty),
ytd-watch-flexy #right-tabs .tab-content-cld.tab-content-hidden #related[placeholder-for-youtube-play-next-queue] #youtube-play-next-queue-renderer:hover #contents:not(:empty) {
	display: inline-block !important;
	min-height: 88.5vh !important;
	max-height: 88.5vh !important;
	overflow-y: auto;
	padding: 7px 0 0 5px;
	transition: height 0.7s ease 0s;
	visibility: visible !important;
	z-index: 50000000 !important;
}

/* (new23) PLAY NEXT - THEATER - TABVIEW */
/* ytd-watch-flexy[is-two-columns_][tabview-selection=""] #right-tabs .tab-content , */
ytd-watch-flexy[is-two-columns_][tabview-selection=""][theater]:not([fullscreen]) #right-tabs .tab-content {
	display: inline-block !important;
}
/* (new41) GM "YOUTUBE LINKS" */
ytd-watch-flexy[fullscreen] #ujs-hdr-links-div {
	display: none !important;
}
ytd-thumbnail.ytd-compact-video-renderer .ujs-links-cls,
ytd-thumbnail .ujs-links-cls.ujs-quality {
	z-index: 10 !important;
	opacity: 0.2;
}
ytd-thumbnail:hover .ujs-links-cls.ujs-quality {
	opacity: 0.8;
}
#ujs-hdr-links-div {
	position: fixed !important;
	display: inline-block !important;
	max-width: 39.4vw !important;
	min-width: 39.4vw !important;
	top: 8.9vh;
	right: 0 !important;
	padding: 5px 0 !important;
	z-index: 500 !important;
	visibility: hidden;
}
#ujs-hdr-links-div:hover {
	visibility: visible;
	z-index: 5000000000 !important;
border: 1px solid yellow !important;
}
#ujs-hdr-links-div:after {
	content: "👁 ";
	position: absolute;
	height: 21px;
	line-height: 21px;
	top: -23px;
	right: 10px;
	font-size: 25px;
	border-radius: 5px 5px 0 0;
    visibility: visible;
background-color: red;
}
/* (new29) */
#ujs-hdr-links-div:not(:hover):before {
	content: "YL";
	position: absolute;
	width: 15px !important;
	height: 15px;
	line-height: 15px;
	top: -28px !important;
	right: 10px;
	font-size: 10px !important;
	border-radius: 100% !important;
	text-align: center !important;
	visibility: visible;
	z-index: 500 !important;
	opacity: 0.5 !important;
color: white !important;
background-color: red;
}
#ujs-hdr-links-div:hover:after {
	content: "👁 YouTube Links";
	position: absolute;
	height: 22px;
	line-height: 22px;
	top: -25px;
	right: 10px;
	padding: 0 3px !important;
	font-size: 17px;
	border-radius: 5px 5px 0 0;
	visibility: visible;
background-color: gold;
}
#ujs-hdr-links-div .ujs-group {
	border-radius: 3px;
	display: inline-block;
	margin: 1px 1px 1px 2px;
}
div.ujs-links-cls .ujs-video {
	display: inline-block;
	text-align: center;
	width: 2.5em !important;
}
/* (new58) */
ytd-compact-video-renderer .details.ytd-compact-video-renderer ytd-badge-supported-renderer[wrap-badges][system-icons]:has(.badge.queue-button)  {
	display: inline-block;
	margin: 0vh 0px 1.7vh 0px !important;
}
ytd-compact-video-renderer .details.ytd-compact-video-renderer ytd-badge-supported-renderer[wrap-badges][system-icons]:has(.badge.queue-button) p  {
	display: inline-block;
    font-size: 15px  !important;
}


/* (new21) GM "YOUTUBE LINKS" */
.ujs-group > a {
	pointer-events: auto !important;
}
.ujs-group > a:hover {
	border: 1px dashed lime !important;
}

/* (new13) TEST */
#content.ytd-app {
	height: 0px !important;
}

/* YOUTUBE MUSIC */
.content.ytmusic-player-page {
	padding-top: 0 !important;
}

/* TEST 360° / GAME :
https://www.youtube.com/watch?v=I-Y14gm8C6o
=== */
.webgl > canvas,
.webgl {
	display: block;
	position: absolute;
	width: 100% !important;
	z-index: 11;
}
.ytp-webgl-spherical .ytp-progress-bar-container {
	bottom: -2px !important;
	display: inline-block;
	opacity: 1;
	position: absolute;
	visibility: visible;
	width: 100%;
}

/* (new7) TEST VIDEO RESTRICTED:
GM "YouTube: Age Verification Bypass 
=== */
/* ADD NOTE ON THE RESTICTED PLAYER about Solution */
.ytd-page-manager.hide-skeleton[player-unavailable=""] #player #button.yt-player-error-message-renderer yt-button-renderer a.yt-simple-endpoint:before {
	content: "Video Restricted \\A use addon:\\A  Ageless for YouTube";
	position: fixed;
	display: inline-block !important;
	width: 57%;
	height: 15%;
	top: 65px;
	left: 1.9%;
	font-size: 30px;
	white-space: pre;
	text-align: center;
	z-index: 50000;
	visibility: visible !important;
color: gold !important;
background: rgba(255, 0, 0, 0.1);
}


/* SOLVED touch MENU PARAMETERS TOP RIGHT - TEST - 3  DOTTS - SECONDARY - TRANSRCIPTION / REAPORT (#panels) */
#info.ytd-video-primary-info-renderer #menu-container.ytd-video-primary-info-renderer ytd-menu-renderer #top-level-buttons + .top-level-buttons + .dropdown-trigger {
	position: fixed !important;
	display: inline-block !important;
	left: 1870px !important;
	height: 20px !important;
	max-height: 20px !important;
	top: 7.3vh !important;
	width: 35px !important;
}

/* (new53) PANELS - CHAPTERS - FOR TRANSCRIPTIONS
https://www.youtube.com/watch?v=BB4ItuVnJD0
=== */
#secondary-inner #panels {
	position: fixed !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 510px !important;
	max-width: 510px !important;
	top: 90px !important;
	right: 0 !important;
	left: 1408px !important;
	z-index: 500000000 !important;
}
ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] {
	max-height: 70vh !important;
	min-height: 70vh !important;
}
#content.ytd-engagement-panel-section-list-renderer {
	display: inline-block;
	flex: unset;
	flex-direction: column;
	height: auto;
	max-height: 72vh;
	min-height: 67vh;
	overflow-x: hidden;
	overflow-y: auto;
}

/* PLAYER - CHAPTER INDICATOR - OPEN LEFT PANEL */
.ytp-chapter-title.ytp-button,
.ytp-chapter-container .ytp-chapter-title-prefix {
	height: 25px !important;
	line-height: 26px !important;
}
/* (new55) CONTROLS BAR - CHATER BUT */
/* .html5-video-player:not(.ytp-embed) .ytp-chrome-controls .ytp-button.ytp-chapter-title , */
.ytp-chapter-container .ytp-chapter-title.ytp-button .ytp-chapter-title-content {
	height: auto !important;
	line-height: 10px !important;
	max-width: 200px !important;
	padding: 1px 3px !important;
	border-radius: 5px !important;
	white-space: pre-wrap !important;
	word-break: normal !important;
/* background: red !important; */
}
/* (new38) SECONDARY - EXPANDED COMMENTS - TABVIEW */
#secondary.tabview-hover-slider.tabview-hover-slider-enable {
	position: fixed !important;
	display: inline-block !important;
	min-width: 60% !important;
	max-width: 60% !important;
	z-index: 5000000000 !important;
/* background: red !important; */
/* border: 1px solid yellow !important; */
}
#secondary.tabview-hover-slider.tabview-hover-slider-enable #secondary-inner {
	position: fixed !important;
	display: inline-block !important;
	height: 28px;
	height: 100% !important;
	min-height: 94.9vh !important;
	max-height: 94.9vh !important;
	min-width: 70% !important;
	max-width: 70% !important;
	right: 0% !important;
	top: 4vh !important;
	padding: 0 !important;
/* background: green !important; */
/* border: 1px solid yellow !important; */
}

#secondary.tabview-hover-slider.tabview-hover-slider-enable #right-tabs {
	top: 0vh !important;
	width: 100% !important;
/* border: 1px dashed yellow !important; */
}
ytd-watch-flexy #secondary.tabview-hover-slider.tabview-hover-slider-enable #right-tabs #tab-comments.tab-content-cld ytd-item-section-renderer#sections.ytd-comments {
	display: inline-block;
	max-width: 90% !important;
	min-width: 90% !important;
	width: 100%;
/* border: 1px dashed red !important; */
}


/* (new49) SECONDARY - LIVE CHAT - DISABLE - TOP MESSAGE */
ytd-live-chat-frame[collapsed] {
	/* display: none  !important; */
	position: fixed !important;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	top: 10vh !important;
	z-index: 50000000 !important;
/* border: 1px solid aqua  !important; */
}
ytd-message-renderer.ytd-live-chat-frame {
	position: fixed !important;
	display: inline-block !important;
	width: 140px !important;
	line-height: 13px !important;
	top: 4vh !important;
	right: 198px !important;
	margin: 0vh 0 0 0 !important;
	padding: 3px 5px !important;
	text-align: center !important;
	border-radius: 5px !important;
	visibility: hidden !important;
	z-index: 500000000 !important;
background: red !important;
}
ytd-message-renderer.ytd-live-chat-frame:hover {
	visibility: visible !important;
}

#message.ytd-message-renderer {
	display: inline-block !important;
	line-height: 13px !important;
	text-align: center !important;
/* background: gold !important; */
}

ytd-message-renderer.ytd-live-chat-frame:after {
	content: "⚠️" !important;
	position: fixed !important;
	display: inline-block !important;
	width: 15px !important;
	height: 15px !important;
	right: 210px !important;
	top: 7vh !important;
	margin: 0vh 0 0 0 !important;
	padding: 0px !important;
	border-radius: 100% !important;
	visibility: visible !important;
	opacity: 0.4 !important;
	z-index: 5000000 !important;
color: gold !important;
background: red !important;
}

/* (new49) SECONDARY - LIVE CHAT */
ytd-watch-flexy[flexy_] #secondary.ytd-watch-flexy,
ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy {
	position: absolute;
	display: inline-block !important;
	height: 28px;
	height: 100% !important;
	min-height: 94.9vh !important;
	max-height: 94.9vh !important;
	min-width: 40%;
	right: 0% !important;
	top: 4vh !important;
	padding: 0 !important;
/*z-index: 5000000 !important; */
}
ytd-watch-flexy[flexy_] #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy,
ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy {
	position: absolute;
	display: inline-block !important;
	width: 100%;
	min-width: 100%;
	max-width: 100%;
	height: 100%;
	max-height: 90.9vh !important;
	min-height: 90.9vh !important;
	top: 4.6vh !important;
/* border: 1px solid pink !important; */
}


/* CHAT - NO TABVIEW */
html:not([plugin-tabview-youtube]) ytd-live-chat-frame,
html:not([plugin-tabview-youtube]) ytd-live-chat-frame[yt-userscript-iframe-loaded] {
	position: fixed;
	display: inline-block;
	height: 50vh !important;
	max-width: 39.9% !important;
	min-width: 39.9% !important;
	left: 60%;
	top: 9.3vh !important;
	overflow: hidden;
	padding: 0 10px;
	visibility: hidden;
	z-index: 50000;
background: #111 !important;
}
html:not([plugin-tabview-youtube]) ytd-live-chat-frame:not([collapsed]),
html:not([plugin-tabview-youtube]) ytd-live-chat-frame:not([collapsed])[yt-userscript-iframe-loaded] {
	display: inline-block !important;
	width: 100% !important;
	max-width: 39.9% !important;
	min-width: 39.9% !important;
	top: 9.2vh !important;
	left: auto !important;
	right: 2px !important;
/* border-top: 1px solid yellow !important; */
}

html:not([plugin-tabview-youtube]) ytd-live-chat-frame:hover,
html:not([plugin-tabview-youtube]) ytd-live-chat-frame[yt-userscript-iframe-loaded]:hover {
	max-height: 90vh !important;
	min-height: 90vh !important;
	border-radius: 0 !important;
	visibility: visible;
border-left: 1px solid #e7e7e7 !important;
border-right: 1px solid #e7e7e7 !important;
border-top: 1px solid #4C4BB5 !important;
border-bottom: 4px solid #4C4BB5 !important;
background: #111 !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope):not([plugin-tabview-youtube]) ytd-live-chat-frame:hover {
	max-height: 90vh !important;
	min-height: 90vh !important;
	visibility: visible;
border-left: 1px solid #e7e7e7 !important;
border-right: 1px solid #e7e7e7 !important;
border-top: 1px solid #4C4BB5 !important;
border-bottom: 4px solid #4C4BB5 !important;
background: white !important;
}
/* (new68) CHAT - NO TABVIEW  */
html:not([plugin-tabview-youtube]):not(:has(tabview-view-pos-thead)) ytd-live-chat-frame::after {
	content: "Live Chat";
	position: fixed;
	display: inline-block;
	width: 3vw;
	height: 23px;
	line-height: 21px;
	top: 6.4vh;
	right: 7.7vw !important;
	margin: 0 0 0 0 !important;
	padding: 1px 5px;
	border-radius: 3px 3px 0 0;
	text-align: center;
	color: gray;
	visibility: visible;
	z-index: 5000000;
border-bottom: 1px solid #333 !important;
border-left: 5px solid #333 !important;
border-right: 5px solid #333 !important;
border-top: 1px solid #333 !important;
background-color: #222 !important;
}
html:not([plugin-tabview-youtube]) ytd-live-chat-frame:hover::before {
	border-bottom: 1px solid #4C4BB5 !important;
	color: white !important;
	background-color: #333 !important;
}
/* NO DARK */
html:not([plugin-tabview-youtube]):not([dark]):not([dark="true"]):not(.style-scope) ytd-live-chat-frame::after {
	border-bottom: 1px solid #e7e7e7 !important;
	border-left: 5px solid #e7e7e7 !important;
	border-right: 5px solid #e7e7e7 !important;
	border-top: 1px solid #e7e7e7 !important;
	background-color: white !important;
}
html:not([plugin-tabview-youtube]):not([dark]):not([dark="true"]):not(.style-scope) ytd-live-chat-frame:hover::after {
	color: white !important;
	border-bottom: 1px solid #999 !important;
	border-left: 5px solid #999 !important;
	border-right: 5px solid #999 !important;
	border-top: 1px solid #999 !important;
	background-color: #999 !important;
	cursor: pointer !important;
}
html:not([plugin-tabview-youtube]) iframe.ytd-live-chat-frame {
	display: inline-block !important;
	position: absolute !important;
	width: 100%;
	min-height: 90vh !important;
	border-radius: 0 !important;
}

/* (new44) CHAT - with / without TABVIEW 
:not(:has(tabview-view-pos-thead))
*/
html:not([plugin-tabview-youtube]):not(:has(tabview-view-pos-thead)) #item-scroller.animated.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer,

html:not([plugin-tabview-youtube]) #item-scroller.animated.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer,
html[plugin-tabview-youtube] .tabview-allow-pointer-events #item-scroller.animated.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer {
	position: absolute;
	height: 93.9vh !important;
	bottom: 0;
	left: 0;
	top: 0 !important;
	right: 0;
	transform: translateY(0px);
	overflow: hidden !important;
	overflow-y: auto !important;
/* background: red !important; */
/* border-left: 1px solid yellow !important; */
}

/* (new44) DARK */
html[dark="true"] #item-offset.yt-live-chat-item-list-renderer yt-live-chat-text-message-renderer:nth-child(odd) {
	background: #222 !important;
}
html[dark="true"] #item-offset.yt-live-chat-item-list-renderer yt-live-chat-text-message-renderer:nth-child(even) {
	background: #333 !important;
}

/* (new36)CHAT SHOW HIDD BUT */
html:not([plugin-tabview-youtube]) ytd-live-chat-frame #show-hide-button {
	position: absolute !important;
	width: 300px !important;
	height: 23px !important;
	line-height: 21px !important;
	top: 7px;
	left: auto !important;
	right: 2px !important;
	z-index: 5000 !important;
/* border: 1px solid red; */
}
html:not([plugin-tabview-youtube]) #show-hide-button.ytd-live-chat-frame > ytd-toggle-button-renderer.ytd-live-chat-frame {
	font-size: 9px;
}

html:not([plugin-tabview-youtube]) ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame yt-button-shape .yt-spec-button-shape-next,
html:not([plugin-tabview-youtube]) ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame yt-button-shape .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--outline {
	height: 23px !important;
	line-height: 21px !important;
	/* outline: 1px solid red !important; */
}
/* CHAT BANNER - SUPP */
yt-live-chat-banner-manager.yt-live-chat-item-list-renderer {
	display: none;
}
/* (new36) CHAT MESSAGE */
html:not([plugin-tabview-youtube]) ytd-live-chat-frame #message.ytd-message-renderer {
	display: inline-block;
	position: absolute;
	top: 12px;
	visibility: hidden !important;
	z-index: 50000000 !important;
}
html:not([plugin-tabview-youtube]) ytd-live-chat-frame:hover #message.ytd-message-renderer {
	visibility: visible !important;
}
html:not([plugin-tabview-youtube]) ytd-live-chat-frame #message.ytd-message-renderer:before {
	content: "⛔";
	display: inline-block;
	position: fixed;
	width: 15px !important;
	height: 13px !important;
	line-height: 13px;
	top: 60px;
	right: 7.8%;
	border-radius: 50%;
	font-size: 10px;
	text-align: center;
	opacity: 0.5;
	visibility: visible;
background: black !important;
}

/* HOVER */
ytd-watch-flexy[flexy][is-two-columns_] #chat.tyt-chat-frame-ready:not([collapse]) tyt-iframe-popup-btn.tyt-btn-enabled:hover {
	background-color: green !important;
	color: red !important;
}
/*

/* (new56) COLLAPSED CLOSED */
html[plugin-tabview-youtube] ytd-live-chat-frame#chat[collapsed] ,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat:not(.tyt-chat-frame-ready) {
	position: fixed !important;
	display: inline-block;
	width: 5.1vw;
	height: 23px !important;
	line-height: 21px;
	top: 8vh !important;
	right: 9.2vw !important;
	margin: 0 0 0 0 !important;
	padding: 1px 0px;
	border-radius: 3px 3px 0 0 !important;
	text-align: center;
	font-size: 15px;
	color: gray;
	visibility: visible;
	z-index: 50000 !important;
    overflow: hidden !important;
border: 1px solid #333 !important;
border-bottom: 1px solid aqua !important;
background-color: red !important;
}

/* (new56) CHAT - TABVIEW - Live Chat - INDICATOR */
/*html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button::after ,*/
html[plugin-tabview-youtube] ytd-live-chat-frame#chat[collapsed] #show-hide-button ytd-toggle-button-renderer yt-button-shape::after ,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat:not(.tyt-chat-frame-ready) #show-hide-button ytd-toggle-button-renderer yt-button-shape::after {
	content: "Live Chat" !important;
    position: relative !important;
	display: inline-block !important;
	width: 10.1vw !important;
	height: 3vh !important;
	line-height: 3vh !important;
    top: -5px !important;
	margin: 5px 0 0 -30px !important;
	padding: 1px 0px !important;
	border-radius: 3px 3px 0 0 !important;
	text-align: center;
	visibility: visible;
	/*z-index: 5000000 !important;*/
    overflow: hidden !important;
    pointer-events: none !important;
color: gray;    
border: 1px solid #333 !important;
border-bottom: 1px solid aqua !important;
background-color: brown !important;
}
html[plugin-tabview-youtube] ytd-live-chat-frame#chat[collapsed] #show-hide-button ytd-toggle-button-renderer yt-button-shape::before ,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat:not(.tyt-chat-frame-ready) #show-hide-button ytd-toggle-button-renderer yt-button-shape::before {
	content: "👁️‍🗨️";
	width: 40px !important;
	height: 3vh !important;
	line-height: 3vh !important;
	right: 14.5vw !important;
	font-size: 15px !important;
color: gold !important;
background-color: green !important;
}
/* COLLAPSED */
/*html[plugin-tabview-youtube] ytd-live-chat-frame #show-hide-button .yt-spec-button-shape-next span::after {
	content: "👁️‍🗨️";
	position: fixed !important;
	width: 20px !important;
	height: 23px !important;
	line-height: 21px !important;
	right: 14.5vw !important;
	font-size: 15px !important;
color: gold !important;
background-color: green !important;
}*/
/* NOT COLLAPSED */
/*html[plugin-tabview-youtube] ytd-live-chat-frame:not([collapsed]) #show-hide-button .yt-spec-button-shape-next span::after {
	content: "X";
	position: fixed !important;
	width: 20px !important;
	height: 23px !important;
	line-height: 21px !important;
	right: 14.5vw !important;
	font-size: 15px !important;
color: gold !important;
background-color: red !important;
}*/

/* HOVER */
html[plugin-tabview-youtube] ytd-live-chat-frame #show-hide-button:hover::after {
	/*content: "Live Chat"; */
	background-color: green !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"])[plugin-tabview-youtube] ytd-live-chat-frame #show-hide-button::after {
	background-color: rgb(245, 245, 245) !important;
}


/* HOVER */
html[plugin-tabview-youtube] ytd-live-chat-frame#chat[collapsed] #show-hide-button.ytd-live-chat-frame:hover + iframe.ytd-live-chat-frame[src="about:blank"] + ytd-message-renderer,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame:hover > ytd-toggle-button-renderer.ytd-live-chat-frame,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame:hover > ytd-button-renderer.ytd-live-chat-frame {
	visibility: visible !important;
/* color: red !important; */
background: #111 !important;
/*border: 1px solid red !important;*/
}

/* (new56) CHAT - BUTTON SHAPE */
/*html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame yt-button-shape {
	display: inline-block !important;
    width: 200px !important;
	height: 3.9vh !important;
	line-height: 3.9vh !important;
	margin: -1vh 0 0 0 !important;
	padding: 0 0 !important;
    border-bottom: 2px solid aqua  !important;
}*/
/* HOVER */
/*html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame yt-button-shape:hover {
background: gold !important;
outline: 1px solid green !important;
}*/

/*html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame yt-button-shape button.yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame yt-button-shape .yt-spec-button-shape-next--size-m {
    display: inline-block !important;
    width: 70px  !important;
	height: 3.9vh !important;
	line-height: 3.9vh !important;
	font-size: 14px;
	padding: 0 0px !important;
    white-space: pre-wrap !important;
background: green !important;
}*/
/*.yt-spec-button-shape-next__button-text-content {
    display: inline-block !important;
	width: 70px  !important;
	height: 3.9vh !important;
	line-height: 3.9vh !important;
	padding: 0 0px !important;
    text-align: left!important;
	overflow: hidden;
	text-overflow: ellipsis;
    white-space: pre-wrap !important;
}*/

/* NO CHAT - TABVIEW 
:not(:has(tabview-view-pos-thead))
:has(tabview-view-pos-thead) */
html[plugin-tabview-youtube] ytd-live-chat-frame#chat[collapsed] #show-hide-button.ytd-live-chat-frame + iframe.ytd-live-chat-frame[src="about:blank"] + ytd-message-renderer {
	position: fixed !important;
	display: inline-block !important;
	height: 23px !important;
	line-height: 21px !important;
	width: 100% !important;
	min-width: 300px !important;
	max-width: 300px !important;
	top: 9.3vh !important;
	right: 0.1vw !important;
	visibility: hidden !important;
	z-index: 5000000 !important;
background: #111 !important;
/* border: 1px solid violet !important; */
}
html[plugin-tabview-youtube] ytd-live-chat-frame#chat[collapsed] #show-hide-button.ytd-live-chat-frame:hover + iframe.ytd-live-chat-frame[src="about:blank"] + ytd-message-renderer {
	min-width: 400px !important;
	max-width: 400px !important;
	visibility: visible !important;
	z-index: 5000000 !important;
background: red !important;
border: 1px solid red !important;
}
html[plugin-tabview-youtube] ytd-live-chat-frame#chat[collapsed] #show-hide-button.ytd-live-chat-frame + iframe.ytd-live-chat-frame[src="about:blank"] + ytd-message-renderer:before {
	content: "⛔";
	position: fixed !important;
	display: inline-block;
	width: 15px !important;
	height: 13px !important;
	line-height: 13px;
	top: 60px;
	right: 7.8%;
	border-radius: 50%;
	font-size: 10px;
	text-align: center;
	opacity: 0.5;
	visibility: visible !important;
	z-index: 5000000 !important;
background: black !important;
}


/* (new49) CHAT - FRAME - TABVIEW */


/* CHAT COLLAPSED */
/* html[plugin-tabview-youtube] #chat-container , */
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy] #chat-container.ytd-watch-flexy.ytd-watch-flexy[chat-collapsed],
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy][js-panel-height_] #chat-container.ytd-watch-flexy.ytd-watch-flexy[chat-collapsed] {
	position: fixed !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 39.7% !important;
	max-width: 39.7% !important;
	top: 8.8vh !important;
	border-radius: 0 !important;
	z-index: 50000000 !important;
/* border: 1px solid pink !important; */
}

/* CHAT - NOT COLLAPSED (visible) */
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy][js-panel-height_] #chat-container.ytd-watch-flexy.ytd-watch-flexy:not([chat-collapsed]) .tyt-chat-frame-ready {
	position: fixed !important;
	display: inline-block !important;
	flex-direction: unset !important;
	width: 100% !important;
	min-width: 39.7% !important;
	max-width: 39.7% !important;
	top: 8.8vh !important;
	overflow: visible !important;
	z-index: 5000000 !important;
/* border: 1px solid aqua  !important; */
}


/* html[plugin-tabview-youtube] #chat-container , */
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy] #chat-container.ytd-watch-flexy.ytd-watch-flexy:not([chat-collapsed]) {
	position: fixed !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 39.7% !important;
	max-width: 39.7% !important;
	top: 8.8vh !important;
	border-radius: 0 !important;
	overflow: visible !important;
	z-index: 50000000 !important;
/*border: 1px solid yellow !important; */
/*border-left: 4px solid yellow !important; */
}
/* HOVER */
html[plugin-tabview-youtube] #chat-container:hover {
	position: fixed !important;
	display: inline-block !important;
	height: 90.5vh !important;
	width: 100% !important;
	top: 8.8vh !important;
	border-radius: 0 !important;
	visibility: visible !important;
	z-index: 50000000 !important;
/* border: 1px solid yellow !important; */
}

/* COLLAPSED */
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy.ytd-watch-flexy[collapsed] {
	position: fixed !important;
	display: inline-block !important;
	height: 2.9vh !important;
	width: 125px !important;
	top: 5.9vh !important;
	right: 174px !important;
	border-radius: 0 !important;
	visibility: visible !important;
	z-index: 50000000 !important;
/*border: 1px solid blue !important;*/
}

/* NOT COLLAPSED */
/* html[plugin-tabview-youtube] iframe.ytd-live-chat-frame:not([collapsed]) , */
html[plugin-tabview-youtube] iframe.ytd-live-chat-frame:not([collapsed]) {
	display: inline-block !important;
	flex: unset !important;
	width: 100% !important;
	min-width: 40.5% !important;
	max-width: 40.5% !important;
	height: 100% !important;
	min-height: 92vh !important;
	max-height: 92vh !important;
	background: #111 !important;
/* border: 1px dotted violet !important; */
}

/* CHAT NOT COLLAPSED - BUTTON - SHOW/HIDE */
html[plugin-tabview-youtube] ytd-live-chat-frame.tyt-chat-frame-ready[collapsed] #show-hide-button.ytd-live-chat-frame .ytd-live-chat-frame {
	flex: unset;
	position: fixed !important;
	width: 150px !important;
	height: 24px !important;
	top: 6vh !important;
	right: 150px !important;
/*background: blue !important;*/
/* border: 1px dotted aqua !important; */
}
/* CHAT NOT COLLAPSED (visible) - BUTTON - HIDE/HIDE ( SAME ?) */
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy][js-panel-height_] #chat-container.ytd-watch-flexy.ytd-watch-flexy:not([chat-collapsed]) .tyt-chat-frame-ready #show-hide-button.ytd-live-chat-frame,
html[plugin-tabview-youtube] #chat-container.ytd-watch-flexy ytd-live-chat-frame#chat.ytd-watch-flexy:not([collapsed]) #show-hide-button.ytd-live-chat-frame {
	position: fixed !important;
    flex: unset;
	width: 150px !important;
	height: 24px !important;
	top: 6vh !important;
	right: 150px !important;
	z-index: 50000000 !important;
/*background: tan !important;*/
/* border: 1px dotted aqua !important; */
}

/*html[plugin-tabview-youtube] ytd-live-chat-frame.tyt-chat-frame-ready #show-hide-button.ytd-live-chat-frame yt-button-shape {
	position: absolute !important;
	display: inline-block !important;
	height: 20px !important;
	width: 120px !important;
}*/

/* (new56) CHAP - BUTTON SHAPE - AFFICHER - NOT COLLAPSED*/
/* html[plugin-tabview-youtube]  ytd-live-chat-frame#chat #show-hide-button.style-scope.ytd-live-chat-frame yt-button-shape .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--outline .yt-spec-button-shape-next__button-text-content , */
/*html[plugin-tabview-youtube] ytd-live-chat-frame#chat:not([collapsed]) #show-hide-button.ytd-live-chat-frame yt-button-shape .yt-spec-button-shape-next .yt-spec-button-shape-next__button-text-content span {
    position: fixed !important;
	display: inline-block !important;
	width: 200px !important;
	height: 3.6vh !important;
    line-height: 3.6vh !important;
	margin: 0vh 0 0 0px !important;
    padding:  0 10px 0 0px !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important;
    z-index: 50000 !important;
}*/
/* HOVER */
/*html[plugin-tabview-youtube] ytd-live-chat-frame#chat:not([collapsed]) #show-hide-button.ytd-live-chat-frame yt-button-shape .yt-spec-button-shape-next .yt-spec-button-shape-next__button-text-content:hover span {
    position: fixed !important;
	display: inline-block !important;
	width: auto !important;
	margin: 0vh 0 0 -30px !important;
    padding:  0 10px 0 10px !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important;
    z-index: 50000 !important;
}*/

/* (new56) CHAT BUTTON IFRAME */
/*html[plugin-tabview-youtube] ytd-watch-flexy[flexy][is-two-columns_] #chat.tyt-chat-frame-ready:not([collapse]) tyt-iframe-popup-btn.tyt-btn-enabled,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame > ytd-toggle-button-renderer.ytd-live-chat-frame tyt-iframe-popup-btn,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame > ytd-button-renderer.ytd-live-chat-frame tyt-iframe-popup-btn {
	position: fixed !important;
	display: inline-block !important;
	float: right !important;
	height: 100% !important;
	min-height: 15px !important;
	max-height: 15px !important;
	line-height: 15px !important;
	width: 100% !important;
	min-width: 15px !important;
	max-width: 15px !important;
	margin: 0 0 0 0 !important;
	top: 6.6vh !important;
	right: 160px !important;
	padding: 0 !important;
	visibility: visible !important;
	z-index: 50000000 !important;
}*/

/* (new56) CHAT PAGE - CSS HACK CHROME / QUANTUM */
@media screen and (-webkit-min-device-pixel-ratio:0) {

/* (new56) CHAT - CSS HACK CHROME */
html[plugin-tabview-youtube] iframe.ytd-live-chat-frame:not([collapsed]) {
    display: inline-block !important;
    flex: unset !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    min-height: 89.5vh !important;
    max-height: 89.5vh !important;
background: #111 !important;
/* border: 1px dotted yellow !important; */
}
/* (new56) CHAT NOT COLLAPSED (visible) - BUTTON - HIDE/HIDE ( SAME ?) - CSS HACK CHROME */
#chat-container.ytd-watch-flexy ytd-live-chat-frame#chat.ytd-watch-flexy:not([collapsed]) #show-hide-button.ytd-live-chat-frame {
    display: inline-block !important;
    position: fixed !important;
    flex: unset !important;
    width: 170px !important;
    height: 24px !important;
    top: 0vh !important;
    right: 150px !important;
    margin: -8vh 0 0 0 !important;
    z-index: 5000000 !important;
/*background: gold !important;*/
/* border: 1px dotted aqua !important; */
	}
/* (new56) CHAT NOT COLLAPSED (visible) - BUTTON - HIDE/HIDE ( SAME ?) - CSS HACK CHROME */
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy][js-panel-height_] #chat-container.ytd-watch-flexy.ytd-watch-flexy:not([chat-collapsed]) .tyt-chat-frame-ready #show-hide-button.ytd-live-chat-frame,
html[plugin-tabview-youtube] #chat-container.ytd-watch-flexy ytd-live-chat-frame#chat.ytd-watch-flexy:not([collapsed]) #show-hide-button.ytd-live-chat-frame {
    position: fixed !important;
    flex: unset;
    width: 275px !important;
    height: 4vh !important;
    top: 8.5vh !important;
    right: 85px !important;
    z-index: 2 !important;
/*background: olive !important;*/
/* border: 1px dotted aqua !important; */
}

/* (new58) - COR FLOAT */ 
/* (new58) CHAT BUTTON IFRAME - CSS HACK CHROME */
html[plugin-tabview-youtube] ytd-watch-flexy[flexy][is-two-columns_] #chat.tyt-chat-frame-ready:not([collapse]) tyt-iframe-popup-btn.tyt-btn-enabled,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame > ytd-toggle-button-renderer.ytd-live-chat-frame tyt-iframe-popup-btn,
html[plugin-tabview-youtube] ytd-live-chat-frame#chat #show-hide-button.ytd-live-chat-frame > ytd-button-renderer.ytd-live-chat-frame tyt-iframe-popup-btn {
    position: fixed !important;
    display: block !important;
    float: right !important;
    height: 100% !important;
    min-height: 15px !important;
    max-height: 15px !important;
    line-height: 15px !important;
    width: 100% !important;
    min-width: 15px !important;
    max-width: 15px !important;
    margin: 0vh 0px 0  0!important;
    top: 1.5vh !important;
    right: 90px !important;
    padding: 0 !important;
    visibility: visible !important;
    z-index: 50000000 !important;
/* background: yellow !important; */
 /*border: 1px solid violet !important;*/
}
/* (new56) SHOW HIDE BUTTON - CSS HACK CHROME */

html[plugin-tabview-youtube] body ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy.ytd-watch-flexy[collapsed]::before {
    content: "👁️‍ live Chat";
	position: absolute !important;
	display: inline-block !important;
    width: 100% !important;
    min-width: 150px !important;
    max-width: 150px !important;
    height: 2.5vh !important;
    line-height: 2.5vh !important;
    top: 0vh !important;
    right: 0px !important;
    text-align: center !important;
    z-index: 500000 !important;
    pointer-events:  none !important;
    background: #222 !important;
}
/* NOT DARK */
html[plugin-tabview-youtube]:not([dark]) body ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy.ytd-watch-flexy[collapsed]::before {
/*border: 1px solid red  !important;*/
    background-color: white !important;
}
html[plugin-tabview-youtube] body ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy.ytd-watch-flexy[collapsed] #show-hide-button{
	position: absolute !important;
	display: inline-block !important;
	height: 2.9vh !important;
	width: 125px !important;
	top: 0vh !important;
	right: 0px !important;
	border-radius: 0 !important;
	visibility: visible !important;
	z-index: 5 !important;
border: 1px solid blue !important;
}


/* ====END == CHAT - HACK CHROME / QUANTUM */
}




/* CHAT - LIST */
#item-offset.yt-live-chat-item-list-renderer {
	position: relative;
	height: 100% !important;
	/* background: olive  !important; */
}
yt-live-chat-app.iframe-buyflow-launcher.iframe-gfeedback-manager,
yt-live-chat-app {
	/* display: inline-block !important; */
	display: flex;
	/* flex-direction:  unset !important; */
	/* flex-direction: unset !important; */
	/* width: 100% !important; */
	/* min-width: 40.5vw !important; */
	/* max-width: 40.5vw !important; */
	height: 100vh;
	/*     min-height: 100vh !important; */
	z-index: 601;
	background: brown !important;
}
#contents.yt-live-chat-app {
	display: flex;
	flex: 1 1 1e-9px;
	flex-direction: column;
	/* height: 100% !important; */
	/* min-height: 100% !important; */
}
#contents.yt-live-chat-renderer {
	/*     display: inline-block !important; */
	flex: 1 1 1e-9px;
	flex-direction: column;
	overflow: hidden;
	position: relative;
	height: 100% !important;
	/* min-height: 100% !important; */
	z-index: 0;
}


/* (new7) COMMENT DISABLE 
https://www.youtube.com/watch?v=SA0RlGtOCmE
=== */
ytd-comments #message.ytd-message-renderer:before {
	content: "⛔";
	display: inline-block;
	position: fixed;
	width: 15px !important;
	height: 13px !important;
	line-height: 13px;
	top: 60px;
	right: 26.9%;
	border-radius: 50%;
	font-size: 10px;
	text-align: center;
	opacity: 0.5;
	visibility: visible;
	z-index: 5000000 !important;
	background: black !important;
}

/* CHANNEL - PLAYER TOP HEADER */
.ytd-two-column-browse-results-renderer .ytd-channel-video-player-renderer .html5-video-player.ytp-small-mode .video-stream.html5-main-video,
.ytd-two-column-browse-results-renderer .ytd-channel-video-player-renderer #c4-player.html5-video-player.ytp-small-mode .video-stream.html5-main-video {
	top: 0 !important;
}

/* CHANNEL - SUBSRIBE CARD */
.ytd-two-column-browse-results-renderer .ytd-channel-video-player-renderer .html5-endscreen.ytp-player-content.subscribecard-endscreen {
	cursor: default;
	overflow: hidden;
	z-index: 34;
	transform: scale(0.6);
	border: 1px solid blue;
	outline: 1px solid red !important;
}
/* (new6) CHANNEL - SUPP PLAYER SUBSCIBE OVERLAY  */
ytd-channel-video-player-renderer .ytd-channel-video-player-renderer .ended-mode .html5-video-container,
ytd-channel-video-player-renderer .ytd-channel-video-player-renderer .ytp-exp-bigger-button.ytp-small-mode.ended-mode .html5-video-container .video-stream.html5-main-video {
	display: none;
}

/* YouTube - Hide End Cards (unless hovering):
https://greasyfork.org/fr/scripts/408725-youtube-hide-end-cards-unless-hovering
=== */
div[class*="video-player"]:not(:hover) div[class^="ytp-ce"],
div[class*="ytp-autohide"] div[class^="ytp-ce"] {
	display: none !important;
}
/* YouTube - Watch Later and Share Buttons Return
https://greasyfork.org/fr/scripts/408875-youtube-watch-later-and-share-buttons-return
=== */
.ytp-hide-info-bar:not(.ended-mode) .ytp-chrome-top:not(.ytp-chrome-top-show-buttons) .ytp-watch-later-button,
.ytp-hide-info-bar:not(.ended-mode) .ytp-chrome-top:not(.ytp-chrome-top-show-buttons) .ytp-share-button {
	display: inline-block !important;
}

/* GM "Youtube UI Fix (2020)" - INDICATOR :
go to https://www.youtube.com/ui_fix_options
=== */
body.yt-ui-fix #logo-icon-container.ytd-topbar-logo-renderer:before {
	content: "Youtube UI Fix";
	position: fixed;
	display: inline-block;
	top: 0px;
	left: 100px;
	padding: 0 5px;
	font-size: 7px;
	opacity: 0.5;
	z-index: 5000000 !important;
	background: red;
}
body.yt-ui-fix #logo-icon-container.ytd-topbar-logo-renderer:hover:before {
	content: "Youtube UI Fix Options: go to https://www.youtube.com/ui_fix_options (need to be loged)";
	position: fixed;
	display: inline-block;
	opacity: 1;
	background: green;
}
/* GM "Youtube UI Fix (2020)" - CENTER VIDEO VERTICALY:
https://greasyfork.org/fr/scripts/11485-youtube-ui-fix/discussions/64241
https://www.youtube.com/watch?v=yUif6C_uJgk
 */
/* FOR :not(.playerToothbrush) ??:
https://www.youtube.com/watch?v=PVUZ8Nvr1ic
==== */
/* #ytd-player.ytd-watch-flexy[context="WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH"] #container.ytd-player #movie_player.html5-video-player.ytp-fit-cover-video .html5-video-container video , */
#ytd-player.ytd-watch-flexy[context="WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH"] #container.ytd-player #movie_player.html5-video-player.ytp-fit-cover-video:not(.ytp-fullscreen):not(.playerToothbrush) {
	display: inline-block !important;
	max-width: 100% !important;
}
#ytd-player.ytd-watch-flexy[context="WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH"] #container.ytd-player #movie_player.html5-video-player.ytp-fit-cover-video:not(.ytp-fullscreen) .html5-video-container {
	display: inline-block !important;
	min-width: 100% !important;
	max-width: 100% !important;
	height: 100% !important;
}
#ytd-player.ytd-watch-flexy[context="WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH"] #container.ytd-player #movie_player.html5-video-player.ytp-fit-cover-video:not(.ytp-fullscreen) .ytp-iv-video-content,
#movie_player.html5-video-player .ytp-iv-video-content {
	height: 100% !important;
}
.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed) .ytp-endscreen-content {
	height: 100% !important;
}

/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) :not(.floater):not(.iri-always-visible):not(.part_fullbrowser) #movie_player:not(.ytp-fullscreen):not(.ytp-hide-controls):not(.ytp-embed) {
	background-color: white !important;
}
/* (new21) object-fit: contain */
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .html5-main-video {
	min-width: 100% !important;
	max-width: 100% !important;
	height: calc(100% - 35px) !important;
	top: 0 !important;
	left: 0 !important;
	object-fit: contain !important;
}

/* (new33) FULL :
.ytp-fullscreen.ytp-big-mode
.html5-video-player.ytp-transparent.ytp-exp-bottom-control-flexbox.ytp-large-width-mode.initialized-listeners.addedupdateevents.paused-mode.ytp-fullscreen.ytp-big-mode.ytp-iv-drawer-enabled
NOT FULL:
ytd-app:not([scrolling_])
===*/
ytd-app[scrolling_] {
	right: 0 !important;
}
.ytp-big-mode .ytp-chrome-controls .ytp-fullerscreen-edu-button.ytp-button {
	width: 40% !important;
}
/* FULLSCREEN - FOR QUANTUM  */
.no-scroll #columns {
	display: none !important;
}
.no-scroll > ytd-app[style*="--ytd-app-fullerscreen-scrollbar-width:12px;"] #columns.ytd-watch-flexy {
	display: none;
}

/* (new49) FULLSCREEN  / BLEED - NO ACTION - PROGRESS BAR ALWAYS VISIBLE - .ytp-autohide ?? */
/* #movie_player.html5-video-player.ytp-big-mode.ytp-fullscreen.ytp-autohide .ytp-chrome-bottom , */
ytd-watch-flexy[full-bleed-player][fullscreen] #full-bleed-container.ytd-watch-flexy #movie_player.html5-video-player.ytp-big-mode.ytp-fullscreen .ytp-chrome-bottom {
	/*     height: 5px  !important; */
	bottom: -5vh !important;
	/* overflow: hidden !important; */
	opacity: 1 !important;
	/* border: 1px solid aqua !important; */
}
ytd-watch-flexy[full-bleed-player][fullscreen] #full-bleed-container.ytd-watch-flexy #player-container:hover #movie_player.html5-video-player.ytp-big-mode.ytp-fullscreen .ytp-chrome-bottom {
	/*     height: 5px  !important; */
	bottom: 0vh !important;
	/* overflow: hidden !important; */
	opacity: 1 !important;
	border: 1px solid red !important;
}

/* (new22) INFOS UNDER PLAYER */
ytd-watch-metadata.ytd-watch-flexy[hidden] + .watch-active-metadata.ytd-watch-flexy > #info {
	position: fixed !important;
	width: 59.5% !important;
	z-index: 50000 !important;
}
.watch-active-metadata #info #info-contents {
	height: 21.5vh !important;
}
ytd-video-primary-info-renderer {
	display: block;
	height: 20vh !important;
	padding: 5px 0 5px !important;
}
.watch-active-metadata #info #info-contents #container {
	height: 20.4vh !important;
	margin-top: 0vh !important;
	/* border: 1px solid aqua !important; */
}

/* (new25) PLAYER INFOS - THEATER - TABVIEW */
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info.ytd-watch-flexy {
	position: fixed;
	width: 59.5%;
	height: 2.4vh !important;
	top: 6.4vh !important;
	margin-top: 0 !important;
	overflow: hidden !important;
	/* border: 1px solid red !important; */
}



/* (new45) THEATER - COMMENT TEASER ? */
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta {
	position: fixed;
	min-height: 21px !important;
	max-height: 21px !important;
	max-width: 20vw !important;
	top: 6.6vh !important;
	left: 39.5vw !important;
	margin: 0;
	overflow: hidden !important;
	/* border: 1px dashed aqua !important; */
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta:hover {
	min-height: 65px !important;
	max-height: 65px !important;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta #meta-contents:not(:hover) {
	min-height: 21px !important;
	max-height: 21px !important;
	width: 100%;
	margin: 0;
	overflow: hidden;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta:hover #meta-contents {
	top: 0px !important;
}

html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta #meta-contents:not(:hover) ytd-video-secondary-info-renderer {
	min-height: 21px !important;
	max-height: 21px !important;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta:hover #meta-contents {
	min-height: 65px !important;
	max-height: 65px !important;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta:hover #meta-contents ytd-video-secondary-info-renderer {
	min-height: 60px !important;
	max-height: 60px !important;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta #meta-contents:not(:hover) #container {
	min-height: 21px !important;
	max-height: 21px !important;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta #meta-contents:hover #container {
	min-height: 60px !important;
	max-height: 60px !important;
	line-height: 1.5rem !important;
	overflow-y: hidden !important;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta #meta-contents:not(:hover) #top-row {
	min-height: 21px !important;
	max-height: 21px !important;
	padding: 0 !important;
}
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta #meta-contents:hover #top-row {
	min-height: 50px !important;
	max-height: 50px !important;
	margin: 0 !important;
	padding: 10px 0 0 0 !important;
}
ytd-video-owner-renderer[watch-metadata-refresh] #channel-name.ytd-video-owner-renderer,
#channel-name.ytd-video-owner-renderer {
	font-size: 1.4rem;
	font-weight: 500;
	line-height: 2rem;
}

html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info ~ #meta #meta-contents:hover #top-row #owner-sub-count {
	margin-top: -26px !important;
}

/* (new54) GM "Video Speed Buttons" === */
.vsb-container {
	margin-bottom: 0;
	margin-top: -17px;
	padding: 0;
	text-align: center !important;
	border-bottom: none !important;
	border: 1px solid aqua !important;
}

/* (new54) THEATER - GM VIDEO SPEED / TABVIEW */
html.tabview-normal-player[plugin-tabview-youtube] .ytd-page-manager[theater-requested_][theater] #columns.ytd-watch-flexy .watch-active-metadata > #info.ytd-watch-flexy .vsb-container {
	margin-top: 0vh !important;
}

/* (new54) GM "Video Speed Buttons" - For  GM "Youtube UI Fix (2020)" ??:
body.yt-ui-fix
=== */
body:not(.yt-ui-fix) .vsb-container {
	margin-top: 6vh !important;
}

/* (new21) GM "Video Speed Buttons" - ADAPTATION for INFOS HIDDEN - #info-contents[hidden] */
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] {
	display: inline-block !important;
	height: 0 !important;
	overflow: hidden !important;
}
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] #info.ytd-video-primary-info-renderer {
	display: none !important;
	height: 0 !important;
	overflow: hidden !important;
}
/* (new54) GM "Video Speed Buttons" - DESC UNDER PLAYER */
#above-the-fold .vsb-container,
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container {
	position: fixed !important;
	display: inline-block !important;
	width: auto !important;
	min-width: 0vw !important;
	max-width: 29.7vw !important;
	height: 100% !important;
	min-height: 20px !important;
	max-height: 20px !important;
	line-height: 20px !important;
	bottom: 15vh !important;
	left: 0.2vw !important;
	margin: 0 0 0 0vw !important;
	padding: 0 0 0 0.2rem !important;
	border-radius: 5px !important;
	text-align: center !important;
	visibility: visible !important;
	opacity: 0.3 !important;
	z-index: 50000 !important;
	border: 1px solid red !important;
	background: #111 !important;
}
#above-the-fold .vsb-container:hover,
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container:hover {
	width: 100% !important;
	min-width: 29.7vw !important;
	max-width: 29.7vw !important;
	height: 100% !important;
	min-height: 25px !important;
	max-height: 25px !important;
	line-height: 25px !important;
	bottom: 15vh !important;
	left: 0.2vw !important;
	margin: 0 0 0 0vw !important;
	padding: 0 !important;
	border-radius: 5px !important;
	text-align: center !important;
	visibility: visible !important;
	opacity: 1 !important;
	z-index: 50000 !important;
	background: #111 !important;
}
#above-the-fold .vsb-container > span:first-of-type:after,
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container > span:first-of-type:after {
	content: "►" !important;
	margin-left: -0.4vw !important;
	color: gold !important;
}
#above-the-fold .vsb-container > span:first-of-type ~ span,
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container > span:first-of-type ~ span {
	display: none !important;
	visibility: hidden !important;
}
#above-the-fold .vsb-container:hover > span:first-of-type ~ span,
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container:hover > span:first-of-type ~ span {
	display: inline-block !important;
	visibility: visible !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #above-the-fold .vsb-container,
html:not([dark]):not([dark="true"]):not(.style-scope) .watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container {
	background-color: rgba(17, 17, 17, 0.1) !important;
}

/* (new62) THEATER - UNDER THE FOLD - VIDEO SPEED */
ytd-watch-flexy[theater] .vsb-container,
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) .watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container {
	position: fixed !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 29.7vw !important;
	max-width: 29.7vw !important;
	height: 100% !important;
	min-height: 25px !important;
	max-height: 25px !important;
	line-height: 25px !important;
	top: 6.3vh !important;
	left: 0.5vw !important;
	margin: 0 0 0 0vw !important;
	padding: 0 !important;
	border-bottom: none !important;
	border-radius: 5px !important;
	text-align: center !important;
	visibility: visible !important;
	opacity: 0.2 !important;
/*background: red !important;*/
}
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) .watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container:hover {
	opacity: 1 !important;
	/*background: red !important;*/
}
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container > span:not(:first-of-type) {
	display: inline-block !important;
	width: 100% !important;
	min-width: 15px !important;
	max-width: 40px !important;
	height: 100% !important;
	min-height: 15px !important;
	max-height: 15px !important;
	line-height: 15px !important;
	padding: 0 !important;
	margin-left: 5px !important;
	margin-right: 5px !important;
	opacity: 1 !important;
	font-size: 14px !important;
	pointer-events: auto !important;
	color: gold !important;
}


/* NO DARK */
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container > span:not(:first-of-type) {
	text-shadow: 1px 1px 4px#000 !important;
	opacity: 1 !important;
}
/* NORMAL SPEED - GREEN BUTON */
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container > span[style*="color: rgb(255, 85, 0)"] {
	color: green !important;
	text-shadow: 1px 1px 4px white !important;
}
/* NO DARK */
.watch-active-metadata + .ytd-watch-flexy #info.ytd-watch-flexy #info-contents[hidden] ytd-video-primary-info-renderer.ytd-watch-flexy #container.ytd-video-primary-info-renderer .vsb-container > span[style*="color: rgb(255, 85, 0)"] {
	opacity: 1 !important;
	text-shadow: none !important;
}

/* TOP HEADER */
#masthead-container,
#masthead,
#masthead-container #interstitial + #container {
	height: 3.5vh !important;
}
/* (new49) */
#buttons.ytd-masthead .yt-spec-button-shape-next .yt-spec-button-shape-next__button-text-content,
#buttons.ytd-masthead .yt-spec-button-shape-next {
	height: 2.6vh !important;
	line-height: 2.6vh !important;
	/* padding: 0 !important; */
	/* color: gray; */
	/* border: none; */
}
a.yt-simple-endpoint.ytd-topbar-menu-button-renderer .ytd-topbar-menu-button-renderer,
a.yt-simple-endpoint.ytd-topbar-menu-button-renderer,
#buttons.ytd-masthead > .ytd-masthead button .ytd-topbar-menu-button-renderer,
#buttons.ytd-masthead > .ytd-masthead button,
#buttons.ytd-masthead > .ytd-masthead {
	height: 2.6vh !important;
	padding: 0 !important;
	/* color: gray; */
	/* border: none; */
}
#background.ytd-masthead {
	height: 3.5vh !important;
	position: absolute;
	width: 100%;
	z-index: -1;
	/* background: var(--yt-spec-base-background); */
}
#container.ytd-masthead {
	align-items: center;
	display: flex;
	flex-direction: row;
	height: 3.5vh !important;
	justify-content: space-between;
	padding: 0 16px;
	/* background: olive  !important; */
}
#end.ytd-masthead #buttons.ytd-masthead,
#start.ytd-masthead,
#end.ytd-masthead {
	height: 2.6vh !important;
}
#buttons.ytd-masthead > .ytd-masthead.style-suggestive {
	height: 3.4vh !important;
	margin: 0 !important;
}
#buttons.ytd-masthead > .ytd-masthead.style-suggestive #button {
	border: none;
}




/* (new56) TOP HEADER - SEARCH */
#masthead-container #center.ytd-masthead {
	height: 3.5vh !important;
	margin-top: 0vh !important;
}

#voice-search-button.ytd-masthead .ytd-masthead yt-button-shape .yt-spec-button-shape-next,
#voice-search-button.ytd-masthead .ytd-masthead yt-button-shape,
#voice-search-button.ytd-masthead .ytd-masthead,
#voice-search-button.ytd-masthead,
#content #masthead-container #container #center #search-form.ytd-searchbox,
#search-icon-legacy.ytd-searchbox {
	height: 2.6vh !important;
	/* border: 1px solid yellow !important; */
}

#content #masthead-container #container #center #search-form.ytd-searchbox ytd-button-renderer  yt-button-shape .yt-spec-button-shape-next--icon-only-default ,
#content #masthead-container #container #center #search-form.ytd-searchbox ytd-button-renderer {
	width: 20px !important;
	height: 20px !important;
    color: red !important;
}
#content #masthead-container #container #center #search-form.ytd-searchbox ytd-button-renderer  yt-button-shape .yt-spec-button-shape-next--icon-only-default yt-icon-shape {
	/*border: 1px solid yellow !important; */
}
#content #masthead-container #container #center #search-form.ytd-searchbox ytd-button-renderer  yt-button-shape .yt-spec-button-shape-next--icon-only-default yt-icon-shape div {
    width: 15px !important;
	height: 15px !important;
  stroke: red !important;
  /*fill: green !important;*/
}
/* NOT DARK */
html:not([dark]) #content #masthead-container #container #center #search-form.ytd-searchbox ytd-button-renderer  yt-button-shape .yt-spec-button-shape-next--icon-only-default yt-icon-shape div {
  stroke: red !important;
  /*fill: green !important;*/
}


/* (new49) VIDEO TITLE */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold h1,
ytd-watch-metadata:not([smaller-yt-sans-light-title]) h1.ytd-watch-metadata,
ytd-app:not([scrolling_]) .title.ytd-video-primary-info-renderer,
.title.ytd-video-primary-info-renderer {
	position: fixed !important;
	display: inline-block !important;
	height: 27px !important;
	line-height: 1.8rem !important;
	max-width: 57.98vw !important;
	min-width: 57.98vw !important;
	left: 0 !important;
	top: 4.5vh !important;
	padding-left: 30px !important;
	z-index: 0 !important;
	font-size: 1.8rem !important;
	font-family: "Roboto", sans-serif !important;
	font-weight: 400 !important;
	/* background: #111  !important; */
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold h1,
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-metadata:not([smaller-yt-sans-light-title]) h1.ytd-watch-metadata,
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-app:not([scrolling_]) .title.ytd-video-primary-info-renderer,
html:not([dark]):not([dark="true"]):not(.style-scope) .title.ytd-video-primary-info-renderer {
	background: white !important;
}

/* (new34) For Sub TITILE */
.super-title.ytd-video-primary-info-renderer {
	display: none !important;
	position: fixed;
	max-width: 57.98vw !important;
	min-width: 57.98vw !important;
	left: 0;
	top: 6.4vh !important;
	padding-left: 30px;
	z-index: 5000 !important;
}
/* (new31) - For Sub TITILE - THEATER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) .super-title.ytd-video-primary-info-renderer {
	position: fixed;
	max-width: 7.98vw !important;
	min-width: 7.98vw !important;
	left: 0;
	top: 6.7vh !important;
	/* background: aqua !important; */
}
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) .super-title.ytd-video-primary-info-renderer a.yt-simple-endpoint.yt-formatted-string {
	display: inline-block !important;
	width: 100% !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important;
	/* background: red !important; */
}

/* BOTTOM PLAYER - VIDEO INFOS */
ytd-app:not([scrolling_]) #info.ytd-video-primary-info-renderer {
	position: absolute;
	bottom: 3vh !important;
	left: 10vw !important;
}
/* for BOTTOM PLAYER - VIDEO INFOS - not THEATER - NOT TABVIEW */
html:not([plugin-tabview-youtube]) #player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer {
	position: absolute;
	bottom: 3vh !important;
}
/* for BOTTOM PLAYER - VIDEO INFOS - not THEATER - TABVIEW */
html[plugin-tabview-youtube] tp-yt-app-drawer {
	position: fixed;
	height: 100vh !important;
	max-height: 100vh !important;
	right: 0;
	top: 0 !important;
	bottom: 0 !important;
	left: 0;
	transition-property: visibility;
	visibility: hidden;
	z-index: 50000000 !important;
}
/* (new31) CONTAINER UNDER - TOP HEADER - NORMALIZE HEIGHT - with/without TABVIEW */
ytd-app:not([guide-persistent-and-visible]) #page-manager.ytd-app:not(.parentToothbrush),
html[plugin-tabview-youtube] ytd-app:not([guide-persistent-and-visible]) #page-manager.ytd-app:not(.parentToothbrush) {
	height: 100vh !important;
	min-height: 100vh !important;
	max-height: 100vh !important;
	margin: 0vh 0 0 0 !important;
	overflow-x: auto;
}

/* (new21) INFO BAR - SMALLER - with/without TABVIEW */
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer {
	position: fixed !important;
	height: 2rem !important;
	bottom: 2vh !important;
	left: 0.5vw !important;
	/* border: 1px solid violet !important; */
}
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu-container ytd-menu-renderer.ytd-video-primary-info-renderer,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu-container,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu-container.ytd-video-primary-info-renderer #menu.ytd-video-primary-info-renderer,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu-container.ytd-video-primary-info-renderer,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #info-text {
	max-height: 2rem;
	line-height: 1rem !important;
	top: 0 !important;
	margin: 0 0.5vw 0 0 !important;
	font-size: 1rem !important;
}
.top-level-buttons.ytd-menu-renderer yt-icon-button,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu.ytd-video-primary-info-renderer ytd-menu-renderer #top-level-buttons-computed .ytd-menu-renderer.force-icon-button a.ytd-button-renderer,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu.ytd-video-primary-info-renderer ytd-menu-renderer #top-level-buttons-computed .ytd-menu-renderer.force-icon-button,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu.ytd-video-primary-info-renderer ytd-menu-renderer .yt-simple-endpoint.ytd-toggle-button-renderer {
	min-height: 2rem !important;
	max-height: 2rem !important;
	line-height: 1.2rem !important;
	padding: 0 !important;
	font-size: 1rem !important;
}
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #menu.ytd-video-primary-info-renderer ytd-menu-renderer a.yt-simple-endpoint.ytd-button-renderer yt-icon-button#button button {
	min-height: 2rem !important;
	max-height: 2rem !important;
	line-height: 1rem !important;
	top: 0 !important;
	font-size: 1rem !important;
}

#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer .dropdown-trigger #interaction .stroke.yt-interaction,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer .dropdown-trigger #interaction .fill.yt-interaction,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer #button.dropdown-trigger,
#player-theater-container:empty ~ #columns #primary-inner .ytd-watch-flexy.watch-active-metadata #info.ytd-watch-flexy #info.ytd-video-primary-info-renderer .dropdown-trigger #interaction,
.ytd-menu-renderer.force-icon-button > a.ytd-button-renderer.yt-simple-endpoint {
	min-height: 2rem !important;
	max-height: 2rem !important;
	line-height: 1rem !important;
	top: 0 !important;
	font-size: 1rem !important;
}
/* (new23) UNDER PLAYER - OWNER - not THEATER - TABVIEW  */
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta {
	position: fixed !important;
	width: 23vw !important;
	bottom: 1vh !important;
	left: 36.5vw !important;
	margin: 0 !important;
	z-index: 50000 !important;
}
/* (new42) PB DOUBLE CHANNEL INFO */
ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents.ytd-watch-flexy[hidden] ytd-video-secondary-info-renderer,
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents.ytd-watch-flexy[hidden] ytd-video-secondary-info-renderer {
	display: none !important;
}
html[plugin-tabview-youtube] #primary #info ~ #meta #meta-contents:not(:hover) {
	width: 100% !important;
	margin: 0 !important;
	overflow: hidden;
}
html[plugin-tabview-youtube] #primary #info ~ #meta #meta-contents:hover {
	width: 100% !important;
	right: -19px;
}
html[plugin-tabview-youtube] ytd-watch-flexy #primary #info ~ #meta #meta-contents:hover ytd-video-secondary-info-renderer {
	padding: 2px !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) #sponsor-button ytd-button-renderer.ytd-video-owner-renderer.style-suggestive.size-default,
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) .ytd-video-secondary-info-renderer.style-destructive.size-default {
	height: 11px !important;
	line-height: 11px !important;
	margin-top: -14px !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) #sponsor-button ytd-button-renderer.ytd-video-owner-renderer.style-suggestive.size-default a.yt-simple-endpoint.ytd-button-renderer,
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) .ytd-video-secondary-info-renderer.style-destructive.size-default a.yt-simple-endpoint.ytd-button-renderer {
	height: 11px !important;
	line-height: 11px !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) #sponsor-button ytd-button-renderer.ytd-video-owner-renderer.style-suggestive.size-default a.yt-simple-endpoint.ytd-button-renderer tp-yt-paper-button#button.ytd-button-renderer.style-suggestive.size-default {
	min-height: 11px !important;
	max-height: 11px !important;
	line-height: 11px !important;
	padding: 0 !important;
}

html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) #sponsor-button ytd-button-renderer.ytd-video-owner-renderer.style-suggestive.size-default a.yt-simple-endpoint > .ytd-button-renderer tp-yt-paper-button,
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) .ytd-video-secondary-info-renderer.style-destructive.size-default .yt-simple-endpoint > .ytd-button-renderer tp-yt-paper-button {
	height: 11px !important;
	padding: 10px 0;
}
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) .ytd-video-secondary-info-renderer.style-destructive.size-default .yt-simple-endpoint > .ytd-button-renderer yt-formatted-string {
	line-height: 10px !important;
	margin-top: -10px !important;
	font-size: 10px !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) #sponsor-button ytd-button-renderer.ytd-video-owner-renderer.style-suggestive.size-default a.yt-simple-endpoint > .ytd-button-renderer yt-formatted-string {
	line-height: 10px !important;
	margin-top: 0px !important;
	font-size: 10px !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) #sponsor-button ytd-button-renderer.ytd-video-owner-renderer.style-suggestive.size-default a.yt-simple-endpoint > .ytd-button-renderer paper-ripple.tp-yt-paper-button,
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #meta-contents:not(:hover) .ytd-video-secondary-info-renderer.style-destructive.size-default .yt-simple-endpoint > .ytd-button-renderer paper-ripple.tp-yt-paper-button {
	height: 11px !important;
}
/* (new21) OWNER - ADDON SKIP ADD */
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #removed_ess {
	bottom: -16px;
	position: absolute;
	right: 0;
	text-align: center;
	font-size: 10px !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[flexy] #primary #info ~ #meta #removed_ess h2 {
	font-size: 12px !important;
}

/* (new44) SOURCE INFO */
#clarify-box:not(.attached-message):not(:empty) {
	position: fixed !important;
	top: 3vh !important;
	left: 29vw !important;
	visibility: hidden;
	z-index: 500000 !important;
}
#clarify-box:not(.attached-message):not(:empty):hover {
	position: fixed !important;
	top: 2.7vh !important;
	left: 29vw !important;
	visibility: visible;
}
#clarify-box:not(.attached-message):not(:empty):before {
	content: "©";
	position: absolute;
	width: 20px;
	height: 20px;
	line-height: 18px;
	right: 0;
	padding: 0;
	font-size: 20px;
	text-align: center;
	border-radius: 50%;
	visibility: visible;
	color: red;
	background: #333;
}
#clarify-box:not(.attached-message):not(:empty):hover:before {
	background: green;
}
/* (new44) MESSAGE ATTACHED */
#clarify-box.attached-message:not(:empty) {
	position: fixed !important;
	top: 2.3vh !important;
	left: 19vw !important;
	visibility: hidden;
	z-index: 500000000 !important;
}
#clarify-box.attached-message:not(:empty):hover {
	position: fixed !important;
	top: 2.6vh !important;
	left: 19vw !important;
	visibility: visible;
}
#clarify-box.attached-message:not(:empty):before {
	content: "💡";
	position: absolute;
	width: 15px;
	height: 15px;
	line-height: 18px;
	right: 2px;
	top: 2px;
	padding: 0;
	font-size: 15px;
	text-align: center;
	border-radius: 50%;
	visibility: visible;
	opacity: 0.5 !important;
	color: red;
	background: #333;
}
#clarify-box.attached-message:not(:empty):hover:before {
	opacity: 0.5 !important;
	background: green;
}

/* DISMISS CONNECTION - PB TEST disble NEW DISMISS - TOUCHE OTHER POPUP: tree dots popup */
#content + ytd-popup-container.ytd-app paper-dialog[prevent-autonav="true"] .style-scope.yt-upsell-dialog-renderer.no-transition,
#content + ytd-popup-container.ytd-app paper-dialog[prevent-autonav="true"] #upsell-dialog-text,
#content + ytd-popup-container.ytd-app paper-dialog[prevent-autonav="true"] #icon-container {
	display: none;
}
#content + ytd-popup-container.ytd-app paper-dialog[prevent-autonav="true"] {
	left: 7%;
	max-height: 845px;
	max-width: 1840px;
	outline: medium none;
	position: fixed;
	top: -48px;
	transform: scale(0.5);
	z-index: 2202;
	background: green !important;
}
#content + ytd-popup-container.ytd-app paper-dialog[prevent-autonav="true"] yt-upsell-dialog-renderer[dialog][dialog][dialog] {
	margin: 0 !important;
	padding: 0 !important;
	background: transparent;
}
#content + ytd-popup-container.ytd-app paper-dialog[prevent-autonav="true"] #content.yt-upsell-dialog-renderer {
	flex-direction: row !important;
	height: 20px;
	padding: 4px 4px 0;
	margin-bottom: -47px;
}

/* FIXED POSITION - ALL */
html {
	overflow: auto !important;
}
ytd-app[is-watch-page=""],
ytd-app[is-watch-page=""] app-drawer {
	height: 1049px !important;
	overflow: hidden !important;
}

/* (new33) PLAYLIST */
/* (new33) PLAYLIST (Watch LATER Original) + NO/WITH TABVIEW  */
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist:not(:hover):not(hidden) {
	position: fixed;
	display: inline-block;
	height: 90vh;
	left: 60%;
	max-width: 38.8%;
	min-width: 38.8%;
	top: 85px !important;
	padding: 0 10px !important;
	overflow-x: hidden;
	overflow-y: auto;
	z-index: 500000;
	visibility: hidden !important;
	background: black !important;
}
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist:hover:not([hidden]) {
	position: fixed !important;
	display: inline-block !important;
	min-height: 90vh !important;
	min-width: 38.8%;
	max-width: 38.8%;
	margin: 0 0 0 0 !important;
	left: 60% !important;
	top: 8.6vh !important;
	padding: 0 10px !important;
	visibility: visible !important;
	z-index: 500000 !important;
	border-bottom: 4px solid gray;
	/* border-top: 1px solid yellow !important; */
	/* background: #333 !important; */
}
/* (new35) NO DARK */
html:not([plugin-tabview-youtube]):not([dark]):not([dark="true"]):not(.style-scope) #columns ytd-playlist-panel-renderer#playlist:hover:not([hidden]) {
	background: #333 !important;
}

#columns ytd-playlist-panel-renderer#playlist > #container {
	display: inline-block !important;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
	min-height: 89vh !important;
	max-height: 89vh !important;
	border-radius: 0 !important;
	overflow: hidden !important;
	overflow-y: auto !important;
}
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist #items {
	position: absolute !important;
	display: inline-block !important;
	height: 100% !important;
	min-height: 74vh !important;
	max-height: 74vh !important;
	width: 95% !important;
	overflow: hidden !important;
	overflow-y: auto !important;
	padding: 14vh 10px 4px 10px !important;
}

/* (new35) PLAYLIST TAB  - TAB INDICATOR  - NO TABVIEW */
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist::before {
	content: "PlayList";
	position: fixed !important;
	display: inline-block !important;
	width: 70px !important;
	height: 2rem !important;
	line-height: 2rem !important;
	font-size: 1rem !important;
	top: 6.4vh !important;
	right: 7.8vw !important;
	margin: 0 0 0 0 !important;
	padding: 1px 3px !important;
	text-align: center;
	visibility: visible !important;
	z-index: 5000000 !important;
	border-color: #333;
	border-radius: 3px 3px 0 0;
	border-style: solid;
	border-width: 1px 5px;
	color: gray;
	background-color: #222;
}

/* (new35) HOVER - NO TABVIEW - ytd-playlist-panel-renderer#playlist */
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist:hover::before {
	width: 76px !important;
	color: white !important;
	border: none !important;
	border-bottom: 1px solid yellow !important;
	border-top: 2px solid transparent !important;
	background-color: #333 !important;
}

/* (new32) PLAYLIST - TABVIEW  */
/* (new33) PLAYLIST - LIST - TOP HEADER - NO + WITH TABVIEW */
ytd-playlist-panel-renderer[collapsible] #header-description h3:not(#next-video-title),
#tab-list #header-description.ytd-playlist-panel-renderer h3 .title.ytd-playlist-panel-renderer,
#tab-list #header-description.ytd-playlist-panel-renderer h3,
#tab-list #columns #header-top-row.ytd-playlist-panel-renderer,
#tab-list #header-description.ytd-playlist-panel-renderer {
	height: 100% !important;
	max-height: 20px !important;
	min-height: 20px !important;
	line-height: 20px !important;
	margin: 0 !important;
	font-size: 1rem !important;
	white-space: nowrap !important;
}

/* PLAYLIST - TOP DESCRIPTION - NO / WITH TABVIEW */
#tab-list #columns #header-top-row.ytd-playlist-panel-renderer {
	width: 73% !important;
	font-size: 15px !important;
}
#tab-list ytd-playlist-panel-renderer#playlist #container > .header {
	position: absolute;
	display: inline-block !important;
	width: 100%;
	height: 100% !important;
	max-height: 90px !important;
	min-height: 90px !important;
	line-height: 20px !important;
	margin: 0px 0 0px 0 !important;
	padding: 30px 16px 2px 15px !important;
	z-index: 1;
	box-shadow: none !important;
	background-color: #111 !important;
	border-bottom: 1px solid red !important;
}
#tab-list ytd-playlist-panel-renderer#playlist #container > .header #header-contents #header-top-row.ytd-playlist-panel-renderer {
	position: relative;
	width: 100% !important;
}
#tab-list ytd-playlist-panel-renderer#playlist #container .playlist-items.ytd-playlist-panel-renderer {
	height: 100%;
	overflow-y: auto;
	padding: 14vh 0 4px 0 !important;
}
/* (new35) PLAYLIST - TOP HEADER - NEW ITEM TITTLE */
#tab-list #header-description.ytd-playlist-panel-renderer h3#next-video-title,
#header-description.ytd-playlist-panel-renderer h3#next-video-title {
	display: inline-block !important;
	width: 97% !important;
	height: 100% !important;
	line-height: 20px;
	margin: 0px 0 0px 0px !important;
	max-height: 100% !important;
	min-height: 0px !important;
	padding: 2px 5px !important;
	font-size: 15px !important;
	white-space: normal !important;
	/* background: green !important; */
}
/* (new35) */
#next-label.ytd-playlist-panel-renderer {
	float: left !important;
	font-size: 1.2rem !important;
}
#header-description.ytd-playlist-panel-renderer h3#next-video-title#next-label.ytd-playlist-panel-renderer {
	display: inline-block !important;
	line-height: 1.1rem !important;
	margin-right: 4px;
	font-size: 1.1rem !important;
}
#header-description.ytd-playlist-panel-renderer h3#next-video-title yt-formatted-string[ellipsis-truncate-styling] {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	/* border: 1px solid yellow !important; */
}

/* (new33) PLAYLIST - META - NO + WITH TABVIEW */
#columns ytd-playlist-panel-renderer#playlist #meta.ytd-playlist-panel-video-renderer {
	min-width: 70% !important;
	max-width: 70% !important;
	padding: 3px 8px !important;
	text-align: left !important;
	overflow: hidden !important;
	border: 1px solid #333 !important;
}

/* (new33) PLAYLIST - SELECTED - NO + WITH TABVIEW */
#columns ytd-playlist-panel-renderer#playlist #playlist-items[selected] #meta.ytd-playlist-panel-video-renderer {
	min-width: 74% !important;
	max-width: 74% !important;
	left: -0.5vw !important;
	border: 1px solid red !important;
}
#columns ytd-playlist-panel-renderer#playlist span#video-title.ytd-playlist-panel-video-renderer {
	height: 100%;
	line-height: 2rem !important;
	margin-bottom: 2px !important;
	padding: 3px 0 0 0 !important;
	text-transform: unset !important;
	border-bottom: 1px solid red;
}
#columns ytd-playlist-panel-renderer#playlist span#video-title.ytd-playlist-panel-video-renderer::first-letter {
	display: inline-block !important;
	text-transform: unset !important;
	color: red !important;
}
#columns ytd-playlist-panel-renderer#playlist #reorder {
	cursor: move !important;
}
/* (new68) PLAYLIST - TOP DESC - NO TABVIEW */
html:not([plugin-tabview-youtube]):not(:has(tabview-view-pos-thead)) #columns ytd-playlist-panel-renderer[collapsible] .ytd-playlist-panel-renderer#container .header.ytd-playlist-panel-renderer {
	position: fixed !important;
	display: inline-block !important;
	flex: unset !important;
	width: 100% !important;
	min-width: 40% !important;
	max-width: 40% !important;
	height: 100% !important;
	line-height: 20px !important;
	max-height: 90px !important;
	min-height: 90px !important;
	margin: 0 !important;
	padding: 30px 16px 2px 15px !important;
	box-shadow: none;
	z-index: 1 !important;
	/* background-color: red !important; */
	border-bottom: 1px solid red !important;
}
#columns ytd-playlist-panel-renderer[collapsible] .ytd-playlist-panel-renderer#container .header.ytd-playlist-panel-renderer {
	height: 60px !important;
	padding: 0 5px !important;
	/* border-bottom: 1px solid yellow !important; */
}

ytd-playlist-panel-renderer[collapsible] #publisher-container {
	float: left;
	margin-top: 0px !important;
	font-size: 15px;
}
/* (new35) */
.ytd-playlist-panel-renderer h3 yt-formatted-string a.yt-simple-endpoint.yt-formatted-string {
	float: left;
	font-size: 1.4rem !important;
}
#columns .ytd-playlist-panel-renderer #publisher-container > yt-formatted-string {
	font-size: 15px;
}
.ytd-playlist-panel-renderer #header-description #publisher-container > yt-formatted-string.publisher {
	float: left;
	font-size: 15px;
}

/* (new35) PLAYLIST - ACTION BUTT - TABVIEW */
html[plugin-tabview-youtube] #columns #playlist-actions {
	float: right;
	height: 20px !important;
	line-height: 20px !important;
	width: 20% !important;
	margin-top: -5vh !important;
	border: 1px solid red !important;
}
html[plugin-tabview-youtube] #columns ytd-playlist-panel-renderer .ytd-playlist-panel-renderer#container .header.ytd-playlist-panel-renderer #header-contents #expand-button {
	position: absolute !important;
	/*     display: none !important; */
	display: inline-block !important;
	float: none !important;
	height: 25px !important;
	line-height: 20px !important;
	width: 30px !important;
	margin: 0 !important;
	top: -3vh !important;
	left: 0 !important;
	/* border: 1px solid red !important; */
}
/* (new35) PLAYLIST - ACTION / EXPAND BUTT - NO TABVIEW */
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist > #container #playlist-actions.ytd-playlist-panel-renderer {
	float: right;
	height: 25px !important;
	line-height: 25px !important;
	width: 15% !important;
	margin: -8vh 2vw 0 0 !important;
	/* border: 1px solid green !important; */
}
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist > #container #playlist-actions.ytd-playlist-panel-renderer #start-actions {
	float: left !important;
	height: 25px !important;
	line-height: 25px !important;
	width: 60% !important;
	margin: 0 0 0 5px !important;
	/* border: 1px solid aqua !important; */
}
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist > #container #playlist-actions.ytd-playlist-panel-renderer #end-actions {
	float: right !important;
	height: 25px !important;
	line-height: 25px !important;
	width: 20% !important;
	margin: 0 0px 0 0 !important;
	/* border: 1px solid yellow !important; */
}

html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist > #container #playlist-actions.ytd-playlist-panel-renderer #top-level-buttons-computed ytd-toggle-button-renderer yt-button-shape button,
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist > #container #playlist-actions.ytd-playlist-panel-renderer #top-level-buttons-computed ytd-playlist-loop-button-renderer #button ytd-button-renderer yt-button-shape button,
html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer#playlist > #container #playlist-actions.ytd-playlist-panel-renderer yt-icon-button {
	height: 25px !important;
	line-height: 0px !important;
}

html:not([plugin-tabview-youtube]) #columns ytd-playlist-panel-renderer[collapsible] .ytd-playlist-panel-renderer#container .header.ytd-playlist-panel-renderer #header-contents #expand-button {
	position: absolute !important;
	display: inline-block !important;
	float: none !important;
	height: 25px !important;
	line-height: 20px !important;
	width: 30px !important;
	margin: 0 !important;
	top: 0vh !important;
	left: 0 !important;
	/* border: 1px solid aqua !important; */
}
/* (new33) PLAYLIST - CONTAINER LIST - NO + WITH TABVIEW */
#columns #secondary.ytd-watch-flexy #playlist[js-panel-height_=""] {
	position: fixed;
	width: 39.5% !important;
	min-height: 14.6vh !important;
	max-height: 14.6vh !important;
	top: 83px;
	left: 60% !important;
	padding-top: 0px;
	padding-bottom: 0px !important;
	overflow: hidden;
	overflow-y: hidden;
	z-index: 50 !important;
	border-right: 5px solid #333;
	border-left: 5px solid #333;
	border-bottom: 1px solid red;
	background-color: #333 !important;
}
#columns #secondary.ytd-watch-flexy #playlist[js-panel-height_=""]:hover {
	min-height: 89.8vh !important;
	max-height: 89.8vh !important;
	background-color: red !important;
}
#columns #secondary.ytd-watch-flexy #playlist[js-panel-height_=""]:hover #items {
	min-height: 89.5vh !important;
	max-height: 89.5vh !important;
	overflow: hidden;
	overflow-y: auto;
}

/* (new56) LEFT COLUMN - RELATED - GENERAL (AQUA) === */
#related.ytd-watch-flexy ytd-watch-next-secondary-results-renderer {
	position: fixed;
	display: inline-block;
	width: 39.5%;
	height: 89.8vh !important;
	top: 85px;
	left: 60% !important;
border-radius: 5px 5px 0 0 !important;
	overflow: hidden;
	overflow-y: auto;
/*	z-index: 500000 !important; */
	border-bottom: 3px solid red;
	border-right: 5px solid #222;
	border-left: 5px solid #222;
}
/* (new56) NOT TABVIEW */
html:not([plugin-tabview-youtube]) #related.ytd-watch-flexy ytd-watch-next-secondary-results-renderer:before {
    content: "Videos" !important;
	position: fixed;
	display: inline-block;
	width: 100px  !important;
	height: 2.5vh !important;
    line-height: 2.5vh !important;
	top: 6.2vh !important;
	left: 75% !important;
    font-size: 15px  !important;
    border-radius: 5px 5px 0 0 !important;
	overflow: hidden;
	overflow-y: auto;
    text-align: center !important;
	z-index: 500000 !important;
    color: gold !important;
border: 3px solid #222;
border-bottom: 1px solid red;
border-right: 5px solid #222;
border-left: 5px solid #222;
}
/* (new35) RIGHT COLUMN - RELATED - RESULTS ITEMS - GENERAL */
ytd-watch-flexy[flexy_] #secondary.ytd-watch-flexy #secondary.ytd-watch-flexy #channel-name.ytd-video-meta-block,
ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy #channel-name.ytd-video-meta-block {
	position: absolute !important;
	width: 98% !important;
	bottom: 3px !important;
	left: 0 !important;
	padding: 0 0 0 0.2rem !important;
	font-size: 1.2rem !important;
	z-index: 300;
	color: peru !important;
}
ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy #channel-name.ytd-video-meta-block #text {
	line-height: 1rem;
	min-height: 1rem !important;
	max-height: 1rem !important;
	font-size: 1rem !important;
}
/* (new48) RELATED ITEMS - TIMES - ALL */
#related ytd-video-meta-block:not([rich-meta]) #metadata-line.ytd-video-meta-block {
	display: inline-block !important;
	line-height: 1.2rem;
	min-height: 1.2rem !important;
	max-height: 1.2rem !important;
	margin-bottom: 11px !important;
	font-size: 1.1rem !important;
	overflow: hidden;
	/* border: 1px solid aqua !important; */
}
/* (new32) RELATED ITEMS - TIMES - GM PLAY NEXT */
yt-img-shadow.ytd-thumbnail[loaded] ~ #overlays.ytd-thumbnail ytd-thumbnail-overlay-time-status-renderer {
	background-color: rgba(0, 0, 0, 0.40) !important;
}
yt-img-shadow.ytd-thumbnail[loaded] ~ #overlays.ytd-thumbnail span#text,
#related #youtube-play-next-queue-renderer ytd-video-meta-block:not([rich-meta]) #metadata-line.ytd-video-meta-block {
	display: inline-block !important;
	line-height: 1rem;
	min-height: 1rem !important;
	max-height: 1rem !important;
	font-size: 1rem !important;
	margin-bottom: 0 !important;
	overflow: hidden;
	/* border: 1px solid yellow !important; */
}

/* (new21) BAGDGES CONTAINER  */
ytd-watch-next-secondary-results-renderer .yt-simple-endpoint .badges.ytd-compact-video-renderer {
	position: absolute;
	display: inline-block;
	width: 100%;
	left: 0;
	top: 0;
	background: transparent !important;
}
/* LIVE BADGE DIRECT */
ytd-watch-next-secondary-results-renderer .yt-simple-endpoint .badges.ytd-compact-video-renderer .badge.badge-style-type-live-now.ytd-badge-supported-renderer {
	position: absolute;
	display: inline-block;
	width: 44%;
	left: 0;
	top: 0;
	font-size: 9px !important;
	color: white !important;
	border: none !important;
	background: rgba(0, 0, 0, 0.30) !important;
}
/* (new58) BADGE NEW */
ytd-watch-next-secondary-results-renderer .yt-simple-endpoint .badges.ytd-compact-video-renderer .badge.badge-style-type-simple.ytd-badge-supported-renderer:not(:has(.yt-icon-shape)) {
	position: absolute;
	display: inline-block;
	width: 15% !important;
	left: -0.7vw !important;
	top: -5.27vh !important;
	padding: 0 4px !important;
	font-size: 9px !important;
	transform: rotate(90deg) !important;
	background: rgba(255, 211, 0, 0.32) !important;
}
/* DOUBLE */
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer .badge.badge-style-type-simple.ytd-badge-supported-renderer.ytd-badge-supported-renderer:has(.yt-icon-shape) {
	position: absolute;
	display: inline-block;
	width: 14px !important;
    height: 2vh !important;
	left: 90% !important;
	top: unset !important;
    bottom: -8vh !important;
	padding: 0 4px !important;
	font-size: 9px !important;
	transform: unset !important;
    white-space: nowrap !important;
    overflow: hidden !important;
background: rgba(255, 0, 0, .27) !important;
}



/* ICONS ON HOVER */
ytd-thumbnail-overlay-toggle-button-renderer {
	border-radius: 100% !important;
	background-color: rgba(255, 0, 0, 0.19) !important;
}
#hover-overlays #icon {
	border-radius: 100% !important;
	border: 1px solid red !important;
}

/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-thumbnail-overlay-toggle-button-renderer {
	border-radius: 100% !important;
	background-color: rgba(17, 17, 17, 0.4) !important;
}

/* (new45) RIGHT COLUMN - WITH NOQUEUE TOP (BLUE) - NO normal SEARCH INPUT / NO LECT AUTO + RESTRICTED - :not(.ytd-video-preview) :
https://www.youtube.com/watch?v=C8XGd7Lg5GM
=== */
#related-skeleton + div:not(ytd-macro-markers-list-item-renderer):not(.thumbnail-and-metadata-wrapper),
.ujs-pos-rel:not(ytd-macro-markers-list-item-renderer):not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview),
#related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) {
	position: fixed !important;
	display: inline-block !important;
	width: 39.5%;
	height: 89.5vh !important;
	top: 9.2vh;
	left: 60% !important;
	overflow: hidden;
	overflow-y: auto;
	border-top: 1px solid red;
	border-bottom: 1px solid red;
	border-right: 5px solid #222;
	border-left: 5px solid #222;
}
yt-page-navigation-progress.ytd-app {
	display: inline-block !important;
}

/* (new41) RIGHT COLUMN - RELATED - WITH NOQUEUE in USE */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy ~ ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper) {
	position: fixed !important;
	display: inline-block !important;
	width: 39.5%;
	height: 75.3vh !important;
	top: 23.5vh!important;
	left: 60% !important;
	padding-top: 0vh !important;
	overflow: hidden;
	overflow-y: auto;
	/* z-index: 500000 !important; */
	border-top: 1px dashed red;
	border-bottom: 1px solid red;
	border-right: 5px solid #222;
	border-left: 5px solid #222;
	/* border: 1px solid yellow !important; */
}

/* (new45) WITH TOP QUEUE (And Work RESTRICTED - :not(.ytd-video-preview) */
#related-skeleton + div:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview),
.null.ujs-pos-rel:not(.thumbnail-and-metadata-wrapper):not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview),
.ujs-pos-rel:not(ytd-macro-markers-list-item-renderer):not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview),
/* TEST CHROME*/
#related .youtube-play-next-queue + #player-ads + input + ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(ytd-macro-markers-list-item-renderer):not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview),
#related .youtube-play-next-queue + #player-ads + ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(ytd-macro-markers-list-item-renderer):not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview),
#related .youtube-play-next-queue + input + ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(ytd-macro-markers-list-item-renderer):not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) {
	position: fixed !important;
	display: inline-block !important;
	width: 39.7% !important;
	height: 75.2vh !important;
	top: 23.5vh !important;
	left: 60% !important;
	right: 0 !important;
	padding-top: 5px !important;
	overflow: hidden;
	overflow-y: auto;
	border-top: 1px dashed red;
	border-bottom: 1px dashed red;
	border-right: none !important;
	border-left: 0.2rem solid red !important;
}
/* NO DARK - :not(.ytd-video-preview) */
html:not([dark]):not([dark="true"]) #related-skeleton + div:not(.ytd-video-preview),
html:not([dark]):not([dark="true"]) .null.ujs-pos-rel:not(.ytd-video-preview),
html:not([dark]):not([dark="true"]) .ujs-pos-rel:not(ytd-macro-markers-list-item-renderer):not(.ytd-video-preview),
/* TEST CHROME*/
html:not([dark]):not([dark="true"]) #related .youtube-play-next-queue + #player-ads + input + ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(ytd-macro-markers-list-item-renderer):not(.ytd-video-preview),
html:not([dark]):not([dark="true"]) #related .youtube-play-next-queue + #player-ads + ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(ytd-macro-markers-list-item-renderer):not(.ytd-video-preview),
html:not([dark]):not([dark="true"]) #related .youtube-play-next-queue + input + ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(ytd-macro-markers-list-item-renderer):not(.ytd-video-preview) {
	border-left: 0.2rem solid gray !important;
	background-color: white !important;
}
/* (new35) + RESTRICTED CONT */
.ujs-pos-rel:not(ytd-macro-markers-list-item-renderer):not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) {
	height: 87.2vh !important;
	top: -35px !important;
}

/* (new22) PLAY LIST WITH GM ENABLE - with SEACH INPUT */
#related #suggestions-search.playlist-or-live + ytd-watch-next-secondary-results-renderer {
	position: fixed;
	display: inline-block !important;
	width: 39.7%;
	height: 89.3vh !important;
	top: 9.3vh !important;
	left: 60% !important;
	right: 0 !important;
	overflow: hidden;
	border-top: 1px solid red !important;
	border-bottom: 1px solid red;
	border-right: none !important;
	border-left: 1px solid #222;
}
#related #suggestions-search.playlist-or-live + ytd-watch-next-secondary-results-renderer #items {
	height: 75vh !important;
	top: 218px !important;
	overflow: hidden;
	overflow-y: auto;
}
/* (new21) TABVIEW - VIDEO ENDSCREEN */
ytd-watch-flexy[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments="-101D"].ytd-page-manager.hide-skeleton #player-theater-container.ytd-watch-flexy .html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles .ytp-endscreen-content {
	height: 100% !important;
	min-width: 100% !important;
	background: #111 !important;
}
/* (new49) - ADAPT GM "TABVIEW"  - RELATED VIDEO  ALWAY VISIBLE */
#secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy #right-tabs,
#right-tabs {
	position: fixed !important;
	display: inline-block !important;
	width: 40% !important;
	right: 0vw !important;
	top: 6.4vh !important;
	margin: 0 !important;
	z-index: 5000000 !important;
	/* background: red !important; */
}
#secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy #right-tabs .tab-content,
ytd-watch-flexy #right-tabs .tab-content {
	display: inline-block !important;
	height: 100% !important;
	min-height: 89.8vh !important;
	max-height: 89.8vh !important;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
	left: -1px;
	top: 0px !important;
	z-index: 5000000 !important;
	border: none !important;
/* background: aqua !important; */
}
#right-tabs > header {
	height: 2.8vh !important;
	width: 20.5vw !important;
}
#right-tabs #material-tabs {
	position: relative;
	display: flex;
	height: 2.3vh !important;
	padding: 0;
}
/* (new49) */
#material-tabs .tab-btn {
	padding: 0 !important;
}
/* (new49) TEST PLAYLIST  */
ytd-watch-flexy #right-tabs .tab-btn.tab-btn-hidden[tyt-tab-content] {
	display: inline-block !important;
	opacity: 0.2 !important;
	/* border: 1px solid yellow !important; */
}
ytd-watch-flexy #right-tabs .tab-btn[userscript-tab-content],
ytd-watch-flexy #right-tabs .tab-btn.active[userscript-tab-content] {
	height: 2vh !important;
	line-height: 19px !important;
	padding: 0px 0px 1px !important;
}
ytd-watch-flexy #right-tabs .tab-btn.active[userscript-tab-content] {
	outline: 1px solid red !important;
}
/* (new31) - ADAPT GM "TABVIEW" - THEATER  - RELATED VIDEO  ALWAY VISIBLE */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #right-tabs {
	top: 6.2vh !important;
	opacity: 0.2 !important;
	border: none !important;
}
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #right-tabs:hover {
	opacity: 1 !important;
}
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #right-tabs .tab-content {
	display: none !important;
}
ytd-watch-flexy[is-two-columns_][tabview-selection=""][theater]:not([fullscreen]) #right-tabs .tab-content,
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #right-tabs,
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) ytd-live-chat-frame {
	border: 1px solid transparent !important;
	border: none !important;
	outline: none !important;
	/* background: red !important; */
}

/* TAB ALL */
ytd-watch-flexy #right-tabs .tab-content-cld:not(.tab-content-hidden) {
	display: inline-block !important;
	height: 100% !important;
	min-height: 90vh !important;
	max-height: 90vh !important;
	z-index: 5000000 !important;
	background: #111 !important;
}
/* NO DARK  */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy #right-tabs .tab-content-cld:not(.tab-content-hidden) {
	background: white !important;
}
ytd-watch-flexy #right-tabs .tab-content-cld:not(.tab-content-hidden) ytd-playlist-panel-renderer #container.ytd-playlist-panel-renderer {
	height: 100% !important;
	min-height: 90vh !important;
	max-height: 90vh !important;
	z-index: 5000000 !important;
	background: #111 !important;
}

/* TAB INFOS*/
ytd-watch-flexy #right-tabs #tab-info.tab-content-cld:not(.tab-content-hidden):not([tyt-hidden]) {
	display: inline-block !important;
	z-index: 5000000 !important;
	background: #111 !important;
}
/* ytd-watch-flexy #right-tabs #tab-info.tab-content-cld.tab-content-hidden[tyt-hidden]{
    display: none !important;
    visibility: hidden !important;
background: #111 !important;
} */
/* NO DARK  */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy #right-tabs #tab-info.tab-content-cld.tab-content-hidden[tyt-hidden],
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy #right-tabs #tab-info.tab-content-cld.tab-content-hidden[tyt-hidden],
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy #right-tabs #tab-info.tab-content-cld:not(.tab-content-hidden) {
	background: white !important;
}
ytd-watch-flexy #right-tabs #tab-info.tab-content-cld:not(.tab-content-hidden) #description.ytd-video-secondary-info-renderer {
	display: block;
	max-width: 100% !important;
}
#tab-info ytd-expander,
#tab-info ytd-expander .content.ytd-metadata-row-header-renderer,
#tab-info ytd-expander #title.ytd-metadata-row-renderer,
#tab-info ytd-expander .ytd-metadata-row-renderer,
#tab-info ytd-expander ytd-metadata-row-renderer,
#above-the-fold.ytd-watch-metadata #description-and-actions.ytd-watch-metadata #snippet-text.ytd-text-inline-expander yt-formatted-string#formatted-snippet-text span.yt-formatted-string,
ytd-watch-flexy #right-tabs #tab-info.tab-content-cld:not(.tab-content-hidden) #description.ytd-video-secondary-info-renderer span.yt-formatted-string {
	line-height: 15px !important;
	font-size: 15px !important;
	white-space: pre-wrap;
}
ytd-metadata-row-header-renderer {
	align-items: center;
	display: flex;
	flex-direction: row;
	height: 20px;
	line-height: 20px;
	padding-top: 2px !important;
}
.yt-simple-endpoint.yt-formatted-string[href="/premium"] {
	display: none !important;
}
ytd-metadata-row-container-renderer #collapsible.ytd-metadata-row-container-renderer .ytd-metadata-row-container-renderer:nth-child(odd) {
	background: #222 !important;
}
ytd-metadata-row-container-renderer #collapsible.ytd-metadata-row-container-renderer .ytd-metadata-row-container-renderer h4 {
	align-items: center;
	display: flex;
	flex-direction: row;
	height: auto !important;
	line-height: 20px;
	padding-top: 2px !important;
}
ytd-metadata-row-renderer.ytd-metadata-row-container-renderer[has-divider-line] {
	opacity: 0.2 !important;
}

/* (new68) GM TABVIEW - TOP INFO - SPACE FOR NUMBERS OF VIEWS */
html[tabview-loaded] #above-the-fold #bottom-row #description {
	display: inline-block !important;
	width: 100%;
    height: 0vh !important;
    padding: 2vh 0 0 0 !important;
    top: 0.4vh !important;
    margin: 0vh 0 0 0 !important;
    border-radius: 0 !important;
background: brown !important;
/*border: 1px solid aqua !important;*/
}
html[tabview-loaded] #above-the-fold #bottom-row #description:hover {
	display: inline-block !important;
	width: 100%;
    height: 100% !important;
    min-height: 2.4vh !important;
    max-height: 2.4vh !important;
    top: 0.4vh !important;
    margin: 0vh 0 0 0 !important;
    padding: 0 !important;
    border-radius: 0 !important;
background: brown !important;
/*border: 1px solid yellow !important;*/
}

html[tabview-loaded] #above-the-fold #bottom-row #description #description-inner {
    pointer-events: none  !important;
}

html[tabview-loaded] #above-the-fold #bottom-row #description #description-inner #info-container {
	display: inline-block !important;
	width: 100%;
    height: 100% !important;
    min-height: 2vh !important;
    max-height: 2vh !important;
    padding-top: 0vh !important;

}
/* HOVER */
html[tabview-loaded] #above-the-fold #bottom-row #description:hover #description-inner #info-container {
	display: inline-block !important;
	width: 100%;
    height: 100% !important;
    min-height: 2vh !important;
    max-height: 2vh !important;
    padding-top: 0vh !important;

}


tabview-view-tab-expander + ytd-expander.ytd-video-secondary-info-renderer #description .content.ytd-video-secondary-info-renderer {
	display: inline-block !important;
	width: 100%;
    padding-top: 2vh !important;
/*background: brown !important;*/
}

html[tabview-loaded] #above-the-fold #bottom-row #description ytd-watch-info-text#ytd-watch-info-text #info-container {
    position: absolute!important;
	display: inline-block !important;
	width: 100%;
    top: 0vh !important;
    left: 0 !important;
    padding: 0vh !important;
background: brown !important;
}

/* (new68) +++++-+-+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------NO TABVIEW - TOP INFO - SPACE FOR NUMBERS OF VIEWS  */

#above-the-fold #bottom-row #description ytd-watch-info-text#ytd-watch-info-text #info-container {
    position: absolute!important;
	display: inline-block !important;
	width: 100%;
    top: 1.2vh !important;
    left: 0 !important;
    padding: 0vh !important;
background: brown !important;
}


/* html[dark][dark="true"]  #subtitle{
   color: red !important;
} */
/* html:not([dark]):not([dark="true"])  */
ytd-horizontal-card-list-renderer h2 #subtitle {
	position: relative !important;
	/* display: inline-block !important; */
	float: left !important;
	/* height: 100% !important;
min-height: 15px !important;
max-height: 15px !important; */
	margin: 0 0 6vh 0 !important;
	font-size: 15px !important;
	/* color: red !important; */
	/* border: 1px solid aqua  !important; */
}

/* (new49) NO DARK  */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer #subtitle,
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-expander.ytd-video-secondary-info-renderer #description #subtitle.ytd-rich-list-header-renderer,
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-expander.ytd-video-secondary-info-renderer #description .content.ytd-video-secondary-info-renderer span,
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-expander.ytd-video-secondary-info-renderer #description .content.ytd-video-secondary-info-renderer {
	color: black !important;
	background: white !important;
}

/* (new49) COMMENTS - #tab-btn3 */
/* ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld , */
ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld:not(.tab-content-hidden):not([tyt-hidden]) {
	display: inline-block !important;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
	z-index: 50000000 !important;
	border: 1px solid aqua !important;
	background: #111 !important;
}

ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld ytd-item-section-renderer#sections.style-scope.ytd-comments {
	display: inline-block !important;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
}

/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld:not(.tab-content-hidden) {
	background: white !important;
}
/* (new29) COMMENTS POPUP - from COMMENTS TASER */
ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"][target-id="engagement-panel-comments-section"] {
	width: 100% !important;
	max-width: 767px !important;
	min-width: 767px !important;
	height: 100% !important;
	max-height: 90vh !important;
	min-height: 90vh !important;
	margin: 0 0 0 -13.4vw !important;
	border: 1px solid red !important;
}
ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"][target-id="engagement-panel-comments-section"] #content.ytd-engagement-panel-section-list-renderer {
	max-height: 92vh !important;
	min-height: 67vh;
	/* border-bottom: 1px solid aqua !important; */
}

/* VID */
/* ytd-watch-flexy #right-tabs #tab-videos.tab-content-cld.tab-content-hidden  {
    display: inline-block !important;
} */
/* (new31) THEATER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #right-tabs #tab-videos.tab-content-cld.tab-content-hidden + #tab-list,
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #right-tabs #tab-videos.tab-content-cld.tab-content-hidden {
	display: none !important;
}


/* (new21) TABVIEW - NO TABS VISIBLE - THEATER - PLAYER WIDTH 100% 
:not([fullscreen]) / :not(.ytp-fullscreen):not(.ytp-big-mode) 
:not(.parentToothbrush)
=== */
ytd-watch-flexy:not([fullscreen])[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments]:not(.parentToothbrush).ytd-page-manager.hide-skeleton #player-theater-container.ytd-watch-flexy:not(:empty) {
	position: fixed!important;
	display: inline-block !important;
	left: 0;
	margin: 0 !important;
	top: 9.3vh !important;
	min-height: 88.4vh !important;
	max-height: 88.4vh !important;
	max-width: 99.9% !important;
	min-width: 99.9% !important;
	padding-bottom: 0px !important;
	overflow: visible !important;
	z-index: 50000000000 !important;
	background: #111 !important;
}
/* (new21) TABVIEW - NO TABS VISIBLE - THEATER - PLAYER WIDTH 100%  - PROGRESS BAR - PAUSED */
ytd-watch-flexy.ytd-page-manager[theater-requested_][theater]:not(.parentToothbrush) #player-theater-container.ytd-watch-flexy:not(:empty) #movie_player.html5-video-player.paused-mode .ytp-progress-bar-container {
	top: 0.5vh !important;
}

/* (new21) VIDEO SPEED - THEATER */
html ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_]:not(.parentToothbrush) #player-theater-container.ytd-watch-flexy:not(:empty) ~ #columns.ytd-watch-flexy #primary .watch-active-metadata #info .vsb-container,
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_]:not(.parentToothbrush) #player-theater-container.ytd-watch-flexy:not(:empty) ~ #columns.ytd-watch-flexy #primary .watch-active-metadata #info .vsb-container {
	position: fixed;
	max-width: 21vw;
	min-width: 21vw;
	left: 24vw;
	margin-top: 0.5vh !important;
	margin-bottom: 0vh !important;
	padding-bottom: 0 !important;
	z-index: 1000;
}

/* (new21) TABVIEW - NO TABS VISIBLE - THEATER - PROGRESSBAR */
ytd-watch-flexy[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments="-101D"].ytd-page-manager.hide-skeleton #player-theater-container.ytd-watch-flexy #movie_player:not(.ytp-hide-info-bar) .ytp-progress-bar-container,
ytd-watch-flexy[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments="-101D"].ytd-page-manager.hide-skeleton #player-theater-container.ytd-watch-flexy #movie_player.ytp-hide-info-bar .ytp-progress-bar-container {
	position: fixed !important;
	display: inline-block;
	width: 100%;
	top: 99.1vh !important;
	visibility: visible;
	opacity: 1;
	z-index: 5000000000 !important;
	background: #333 none repeat scroll 0 0;
}
/* (new21) TABVIEW / MAXIMIZE - NO TABS VISIBLE - THEATER - CAPTIONS */
ytd-watch-flexy[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments="-101D"].ytd-page-manager.hide-skeleton #player-theater-container.ytd-watch-flexy #player-container ytd-player#ytd-player #movie_player.html5-video-player .caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup {
	margin: 0 0 -1vh 0 !important;
	overflow: hidden;
	text-align: left;
}
ytd-watch-flexy[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments="-101D"].ytd-page-manager.hide-skeleton #player-theater-container.ytd-watch-flexy #player-container ytd-player#ytd-player #movie_player.html5-video-player:hover .caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup {
	margin: 0 0 6vh 0 !important;
	text-align: left;
}

/* (new21) TABVIEW - NO TABS VISIBLE - THEATER - GM "VIDEO SPEED" */
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_]:not(.parentToothbrush) .vsb-container {
	position: fixed !important;
	max-width: 21vw;
	min-width: 21vw;
	margin-top: 3vh !important;
	left: 24vw !important;
	z-index: 1000 !important;
}

/* (new21) TEST BIG / FULLSCREEN - CONTAINER */
ytd-watch-flexy[fullscreen][flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments].ytd-page-manager.hide-skeleton #player-theater-container.ytd-watch-flexy:not(:empty) {
	position: sticky !important;
	left: 0;
	margin: 0 !important;
	min-height: 100vh !important;
	max-height: 100vh !important;
	max-width: 100vw !important;
	min-width: 100vw !important;
	padding: 0px !important;
	overflow: hidden !important;
	z-index: 50000000000 !important;
	background: #111 !important;
}

/* (new21) TEST BIG / FULLSCREEN - PLAYER */
.html5-video-player.ytp-big-mode,
.html5-video-player.ytp-fullscreen {
	display: inline-block !important;
	height: 100% !important;
	min-height: 99.8% !important;
	max-height: 99.8% !important;
	max-width: 100% !important;
	overflow: hidden !important;
	overflow-y: hidden !important;
	/* background-color: red !important; */
}
.html5-video-player.ytp-big-mode .ytp-player-content {
	bottom: 0 !important;
	top: 0 !important;
	left: 0 !important;
	right: 0 !important;
}
#player-theater-container #movie_player.html5-video-player.ytp-fullscreen.ytp-big-mode .ytp-chrome-bottom .ytp-chrome-controls {
	max-width: 100% !important;
	/* text-align: center !important; */
}

/* YOUTUBE LINKS / BRANDING */
/* ytd-watch-flexy[flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments].ytd-page-manager.hide-skeleton #ujs-hdr-links-div , */
ytd-watch-flexy[theater][flexy][flexy-enable-small-window-sizing][flexy-enable-large-window-sizing][is-four-three-to-sixteen-nine-video_][tabview-selection][is-two-columns_][flexy-large-window_][tabview-selection][tabview-youtube-comments].ytd-page-manager.hide-skeleton .annotation.annotation-type-custom.iv-branding {
	display: none !important;
}

/* RIGHT COLUMN - PLAYLIST PRESENT (YELLOW) :
 https://www.youtube.com/watch?v=YqL6stzNsqE&list=RDnHqKu5ofUbY&index=9
=== */
ytd-playlist-panel-renderer#playlist[playlist-type_="RDnH"] ~ #related ytd-watch-next-secondary-results-renderer.ytd-watch-flexy #items {
	position: fixed;
	display: inline-block;
	width: 39.5%;
	max-height: 68.7vh !important;
	top: 273px !important;
	left: 60% !important;
	padding-top: 5px !important;
	overflow: hidden;
	overflow-y: auto;
	border-top: 1px solid red;
	border-bottom: 1px solid red;
	border-right: 5px solid #222;
	border-left: 5px solid #222;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #items.ytd-watch-next-secondary-results-renderer {
	border-left: 5px solid #E7E7E7 !important;
	background-color: white !important;
}

/* (new21) PLAY LIST - THUMBNAIL */
#thumbnail-container.ytd-playlist-panel-video-renderer {
	height: 10vh !important;
	width: 7vw !important;
}
#thumbnail-container.ytd-playlist-panel-video-renderer > ytd-thumbnail.ytd-playlist-panel-video-renderer .ytd-thumbnail.no-transition,
#thumbnail-container.ytd-playlist-panel-video-renderer > ytd-thumbnail.ytd-playlist-panel-video-renderer {
	height: 9vh !important;
}
#thumbnail-container.ytd-playlist-panel-video-renderer > ytd-thumbnail.ytd-playlist-panel-video-renderer .ytd-thumbnail.no-transition img.yt-img-shadow {
	width: 100% !important;
	min-height: 9vh !important;
	max-height: 9vh !important;
	margin: 0 !important;
}
/* PLAY LIST - VIDEO IN PLAY */
ytd-playlist-panel-video-renderer[selected][watch-color-update] {
	border-left: 5px solid red !important;
}
/* PLAYLIST - TOGGLE ARROW - Change to BAKGROUND color CHANGE */
#columns ytd-playlist-panel-renderer[collapsible][collapsed] .playlist-items.ytd-playlist-panel-renderer {
	display: inline-block !important;
	/* background-color: black  !important; */
}
#columns ytd-playlist-panel-renderer[collapsible][collapsed] #playlist-actions.ytd-playlist-panel-renderer {
	display: inline-block !important;
	margin-top: -30px !important;
}
/* RIGHT COLUMN - NO QUEUE / NO PLAY LIST MODE (TAN) :
https://www.youtube.com/watch?v=SA0RlGtOCmE
=== */
#columns #primary.ytd-watch-flexy + #secondary.ytd-watch-flexy #secondary-inner dom-if + #panels + #donation-shelf + dom-if + #playlist.ytd-watch-flexy[disable-upgrade] + #related input#suggestions-search + ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer {
	position: fixed;
	display: inline-block;
	height: 88.5vh !important;
	top: 9.3vh !important;
	left: 60%;
	padding-top: 5px !important;
	overflow-x: hidden;
	overflow-y: auto;
	border-left: 5px solid #222;
	border-right: 5px solid #222;
	border-top: 1px solid red;
	border-bottom: 1px solid red;
}

/* RIGHT COLUMN - TOP PANEL  - NO normal SEARCH INPUT / NO LECT AUTO:*/
#related #items ytd-compact-autoplay-renderer,
#related #items ytd-compact-autoplay-renderer {
	position: fixed;
	clear: none;
	width: 39%;
	height: 122px !important;
	top: 85px !important;
	margin-bottom: 0;
	padding: 5px !important;
	overflow: hidden !important;
	z-index: 5000000 !important;
	background-color: #333;
	border-bottom: 5px solid #333;
}
#related #items ytd-compact-autoplay-renderer #contents {
	height: 175px !important;
}

/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #related #items ytd-compact-autoplay-renderer,
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-compact-autoplay-renderer {
	background-color: white;
	border-bottom: 5px solid gray;
}
#related #items ytd-compact-autoplay-renderer #contents {
	position: fixed;
	clear: none;
	height: 120px !important;
	width: 39.6%;
	margin-left: -5px;
	overflow: hidden !important;
	overflow-y: auto !important;
	transition: ease all 0.7s !important;
	background-color: rgba(0, 0, 0, 0.72) !important;
	border-bottom: 5px solid red;
}
#related #items ytd-compact-autoplay-renderer:hover #contents {
	height: auto !important;
	height: 767px !important;
	overflow: hidden !important;
	overflow-y: auto !important;
	transition: ease all 0.7s !important;
	background-color: black;
	border-bottom: 5px solid red;
}

/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #related #items ytd-compact-autoplay-renderer #contents {
	background-color: rgba(0, 0, 0, 0.72) !important;
	border-bottom: 5px solid gray;
}

/* POSITION LIST UNDER */
#head + #contents ytd-compact-video-renderer {
	float: left;
	clear: none;
	width: 100% !important;
	max-width: 363px !important;
	min-width: 363px !important;
	height: 108px !important;
	margin-right: 5px;
	background-color: black !important;
}
/* SEARCH - QUEUE */
#contents + #suggestions-search {
	position: fixed;
	width: 18%;
	top: 44px;
	right: 5px !important;
	z-index: 500 !important;
	border: 1px solid tomato !important;
}
/* AUTO PLAY BUTTON */
#head.ytd-compact-autoplay-renderer {
	position: fixed !important;
	display: inline-block !important;
	vertical-align: top;
	align-items: center;
	flex-direction: unset !important;
	height: 21px !important;
	line-height: 21px !important;
	width: 345px !important;
	margin-bottom: 0;
	right: 24% !important;
	top: 35px !important;
	padding: 2px 5px;
	border-radius: 3px !important;
	transform: scale(0.7) !important;
	z-index: 6000000 !important;
	background: #111 !important;
	border: 1px solid #333;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #head.ytd-compact-autoplay-renderer {
	background: white !important;
	border: 1px solid white;
}
#upnext {
	float: right !important;
	clear: none;
	height: 20px;
	line-height: 20px;
	width: 77px;
}
#autoplay {
	float: left !important;
	height: 20px;
	line-height: 20px;
	width: 163px;
}
paper-toggle-button.ytd-compact-autoplay-renderer {
	float: left;
	height: 20px;
	line-height: 20px;
	width: 44px;
	margin: -0.5px 0 0 0 !important;
	border-radius: 20px;
	background: #111 !important;
	border: 1px solid #333;
}

/* SEARCH TOP/RIGHT FORM (Not Matched by GM)  - NO QUEUE */
#related #suggestions-search.playlist-or-live {
	position: fixed;
	top: 3.9vh !important;
	right: 0 !important;
	width: 40vw;
	margin: 0 !important;
	padding: 1px 2px;
	z-index: 500;
	border: 1px solid #333 !important;
	border-left: 4px solid #333 !important;
	border-right: 4px solid #333 !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #related #suggestions-search.playlist-or-live {
	border-bottom: 1px solid #E7E7E7 !important;
	border-right: 5px solid #E7E7E7 !important;
	border-left: 5px solid #E7E7E7 !important;
}

/* (new43) TABVIEW - SERACH SUGGESTION */
tabview-view-autocomplete-pos[position-fixed-by-tabview-youtube],
tabview-view-autocomplete-pos,
tabview-view-autocomplete-pos > .autocomplete-suggestions {
	z-index: 500000 !important;
}


/* INPUT TXT COLOR FOR DARK */
html[dark] #related #suggestions-search.playlist-or-live span {
	color: white;
}

/* INPUT PLACEHOLDER COLOR FOR DARK */
/* Standard one last! */
html[dark] :placeholder-shown {
	opacity: 1;
	color: gray !important;
}
/* AUTO COMPLETE SUG */
.autocomplete-suggestions {
	z-index: 500000 !important;
}
/* DARK */
html[dark] .autocomplete-suggestions {
	background: #111 !important;
}

/* DARK */
html[dark] .autocomplete-suggestion {
	color: gray;
}

/* (new58) - COR FLOAT */ 
/* QUEUE */
#head + #contents ytd-compact-video-renderer {
	display: block !important;
	float: left;
	clear: none;
	width: 100% !important;
	max-width: 358px !important;
	min-width: 358px !important;
	height: 108px !important;
	margin-left: 5px !important;
	margin-right: 5px !important;
	background-color: black !important;
	border: 1px solid gray;
}
#head + #contents ytd-compact-video-renderer:after {
	content: "Queue";
	color: white;
	background-color: black !important;
	border: 1px solid gray;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #head + #contents ytd-compact-video-renderer {
	background-color: white !important;
}

/* RELATED PANEL - with PARTIAL TWEAK SHOW THE when VIDEO RESTRICTED :
GM "YouTube: Age Verification Bypass v.1.4r" 
=== */
.ytd-page-manager.hide-skeleton[player-unavailable=""] #related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer {
	height: 89.2vh !important;
	padding-top: 0px !important;
}
.ytd-page-manager.hide-skeleton[player-unavailable=""] #related ytd-watch-next-secondary-results-renderer + #related-skeleton + div {
	position: fixed;
	display: inline-block;
	width: 39.5%;
	height: 89.2vh;
	top: 87px;
	left: 60%;
	padding-top: 5px !important;
	overflow-x: hidden;
	overflow-y: auto;
}

/* (new59) NEXT QUEUE =========== REDESIGN - THUMBNAIL=============== */
/* (new32) NEXT QUEUE (taked for UPDATE v.3) + ITEMS RESTRICTED */
/* ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) #dismissible , */
.null.ujs-pos-rel.ujs-pos-rel.ujs-pos-rel > a,
.ytd-page-manager.hide-skeleton[player-unavailable=""] #related ytd-watch-next-secondary-results-renderer + #related-skeleton + div a,
#items .ytd-watch-next-secondary-results-renderer:not(ytd-compact-autoplay-renderer):not(yt-related-chip-cloud-renderer),
.ytd-watch-next-secondary-results-renderer.suggestion-tag {
	float: left;
	clear: none;
	width: 100% !important;
	max-width: 31.8% !important;
	min-width: 31.8% !important;
	height: 100% !important;
	min-height: 25vh !important;
	max-height: 180px !important;
	margin: 0 0rem 0.2rem 0.2rem !important;
	padding: 0.2rem !important;
	border-radius: 3px !important;
background-color: black !important;
border: 1px solid #333 !important;
}

#dismissible.ytd-compact-video-renderer {
	display: inline-block !important;
}
ytd-compact-video-renderer:not([watch-feed-big-thumbs]) ytd-thumbnail.ytd-compact-video-renderer {
	display: inline-block !important;
	height: 94px;
	margin: 0px 0 0px 0 !important;
	width: 100% !important;
}

/*(new61) SHORT ROW  */
#related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview)  ytd-reel-shelf-renderer.ytd-watch-next-secondary-results-renderer  {
    display: block !important;
	float: left;
	clear: none;
	width: 100% !important;
	max-width: 98% !important;
	min-width: 98% !important;
	height: 100% !important;
	min-height: unset !important;
	max-height: 35vh !important;
	margin: 0 0rem 1rem 0rem !important;
	padding: 0.2rem !important;
	border-radius: 3px !important;
    overflow: hidden !important;
/*background-color: brown !important;*/
/*border: 1px solid aqua !important;*/
}
/*(new66) SHORT */
#related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) ytd-reel-shelf-renderer #contents.ytd-reel-shelf-renderer yt-horizontal-list-renderer #scroll-outer-container.yt-horizontal-list-renderer #scroll-container #items.yt-horizontal-list-renderer  {
    display:inline-block;
    height: 100% !important;
	min-height: unset !important;
	max-height: 25.5vh !important;
    margin: 0 0 0 0 !important;
    padding: 0.5vh 0 1vh 10px !important;
    transition-duration:.15s;
    transition-timing-function:cubic-bezier(.05,0,0,1);
    will-change:transform;
    white-space: pre-wrap !important;
    overflow: hidden auto !important;
    /*overscroll-behavior-y: contain !important;*/
/*background-color: olive !important;*/
/*border: 1px solid lime !important;*/
}
#related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) ytd-reel-shelf-renderer #contents.ytd-reel-shelf-renderer yt-horizontal-list-renderer #scroll-outer-container.yt-horizontal-list-renderer #scroll-container #items.yt-horizontal-list-renderer ytm-shorts-lockup-view-model-v2.yt-horizontal-list-renderer {
    padding-right:4px;
    display:inline-block;
    vertical-align:top;
    width: 15% !important;
    margin: 0 5px 5px 0 !important;
    white-space:normal;
/*border: 1px solid lime !important;*/
}
#related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) ytd-reel-shelf-renderer #contents.ytd-reel-shelf-renderer yt-horizontal-list-renderer #scroll-outer-container.yt-horizontal-list-renderer #scroll-container #items.yt-horizontal-list-renderer ytm-shorts-lockup-view-model-v2.yt-horizontal-list-renderer .shortsLockupViewModelHost {
    display:inline-block;
    position:relative;
    width: 100% !important;
	max-width: 100% !important;
	min-width: 100% !important;
}
#related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) ytd-reel-shelf-renderer #contents.ytd-reel-shelf-renderer yt-horizontal-list-renderer #scroll-outer-container.yt-horizontal-list-renderer #scroll-container #items.yt-horizontal-list-renderer ytm-shorts-lockup-view-model-v2 .shortsLockupViewModelHostOutsideMetadata {
    padding-right: 15px !important;
}
#related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview) ytd-reel-shelf-renderer #contents.ytd-reel-shelf-renderer yt-horizontal-list-renderer #scroll-outer-container.yt-horizontal-list-renderer #scroll-container #items.yt-horizontal-list-renderer ytm-shorts-lockup-view-model-v2 .shortsLockupViewModelHostOutsideMetadata .shortsLockupViewModelHostOutsideMetadataTitle {
    font-size: 1.3rem;
    line-height:1.5rem;
    font-weight:500;
    overflow:hidden;
    max-height: 4.4rem;
    -webkit-line-clamp:2;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    text-overflow:ellipsis;
    white-space:normal
}

/* (new68) REDESIGN - THUMBNAIL */
#related ytd-watch-next-secondary-results-renderer #items .yt-lockup-view-model--horizontal.yt-lockup-view-model--compact a.yt-lockup-view-model__content-image {
    display: block !important;
    float: left !important;
    width: 98% !important;
    height: 14vh !important;
    padding: 2px !important;
    border-radius: 5px !important;
    overflow: hidden !important;
border: 1px solid silver !important;
}
/* (neww68) VISITED */
#related ytd-watch-next-secondary-results-renderer #items .yt-lockup-view-model--horizontal.yt-lockup-view-model--compact a.yt-lockup-view-model__content-image:visited {
    border: 1px solid red !important;
}
.yt-lockup-view-model--horizontal .yt-lockup-view-model__metadata {
    position:absolute !important;
    -moz-box-orient:horizontal;
    -moz-box-direction:normal;
    flex-direction:row;
    width: 100% !important;
    height: 8.5vh !important;
    padding: 0vh 2px 0 2px !important;
    top: 14.5vh !important;
/*border: 1px solid aqua !important;*/
}

.yt-lockup-view-model--horizontal .yt-lockup-view-model__metadata .yt-lockup-metadata-view-model__text-container  {
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    margin:0;
    padding:0;
/*border: 1px solid aqua !important;*/
}
.yt-lockup-view-model--horizontal .yt-lockup-view-model__metadata .yt-lockup-metadata-view-model__text-container h3.yt-lockup-metadata-view-model__heading-reset  {
    width: 100% !important;
    min-width: 92% !important;
    max-width: 92% !important;
    max-height: 4vh !important;
    margin:0;
    padding:0;
/*border: 1px solid green !important;*/
}
.yt-lockup-metadata-view-model__title {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    text-decoration:none;
    word-break:break-word;
    padding-right:24px;
color:#f1f1f1;
/*border: 1px solid pink !important;*/
}
.yt-lockup-view-model--horizontal .yt-lockup-view-model__metadata .yt-lockup-metadata-view-model__text-container span.yt-core-attributed-string--white-space-pre-wrap {
    display: inline-block !important;
    width: 100% !important;
    min-width: 98% !important;
    max-width: 98% !important;
    text-decoration:none;
    word-break:break-word;
    padding-right:24px;
color:#f1f1f1;
/*border: 1px solid yellow !important;*/
}


.yt-lockup-metadata-view-model__metadata {
        color:#aaa
}


/* ============ */
ytd-compact-video-renderer:not([watch-feed-big-thumbs]) ytd-thumbnail.ytd-compact-video-renderer img.yt-core-image--fill-parent-height.yt-core-image--fill-parent-width,
ytd-compact-video-renderer:not([watch-feed-big-thumbs]) ytd-thumbnail.ytd-compact-video-renderer img {
	object-fit: contain !important;
}


/* (new32) */
ytd-thumbnail[size="medium"] a.ytd-thumbnail,
ytd-thumbnail[size="medium"]::before {
	border-radius: 3px !important;
}

ytd-compact-video-renderer:not([watch-feed-big-thumbs]) .metadata.ytd-compact-video-renderer {
	display: inline-block !important;
	width: 100% !important;
	padding-right: 0 !important;
}
/* (new58) COR - A VOIR - GM "NEXT QUEUE" - THUMBNAIL - TITLE  */ 
/*:not(.ytd-playlist-renderer) 
h3.ytd-compact-video-renderer */
h3.ytd-compact-video-renderer:not(.ytd-playlist-renderer) {
	margin-bottom: 4px !important;
	padding: 3px !important;
color: silver !important;
}
span#video-title:not(.ytd-playlist-renderer)  {
	display: inline-block !important;
	width: 100%;
	height: 100%;
	line-height: 14px !important;
	min-height: 5vh !important;
	max-height: 5vh !important;
	margin-bottom: -7px !important;
	overflow: hidden !important;
	font-size: 1.1rem !important;
	text-transform: lowercase !important;
	overflow-y: auto !important;
	border-bottom: 1px solid red !important;
}
span#video-title:first-letter {
	display: inline-block !important;
	text-transform: capitalize !important;
	color: red !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager.hide-skeleton[player-unavailable=""] #related ytd-watch-next-secondary-results-renderer + #related-skeleton + div a,
html:not([dark]):not([dark="true"]):not(.style-scope) #items .ytd-watch-next-secondary-results-renderer:not(ytd-compact-autoplay-renderer),
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-watch-next-secondary-results-renderer.suggestion-tag {
	border: 1px solid #E7E7E7 !important;
	background-color: white !important;
}
a.yt-simple-endpoint.ytd-compact-video-renderer,
ytd-compact-video-renderer:not([watch-feed-big-thumbs]) .metadata.ytd-compact-video-renderer ytd-video-meta-block,
ytd-compact-video-renderer:not([watch-feed-big-thumbs]) .metadata.ytd-compact-video-renderer .ytd-video-meta-block[meta-block] {
	display: inline-block !important;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
}

/* (new33) RELATED - THUMBNAIL ITEMS - MOVIE RENT */
#secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy ytd-compact-video-renderer.queue-item.ytd-item-section-renderer,
#items.ytd-watch-next-secondary-results-renderer ytd-compact-movie-renderer {
	float: left !important;
	clear: none;
	width: 100%;
	max-width: 31.8% !important;
	min-width: 31.8% !important;
	height: auto;
	max-height: 195px !important;
	min-height: 195px !important;
	margin: 0 0rem 0.2rem 0.2rem !important;
	padding: 0.2rem;
	border-radius: 3px;
	border: 1px solid #333;
	/* border: 1px solid aqua !important; */
}

ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) ytd-thumbnail.ytd-compact-movie-renderer {
	position: relative !important;
	display: inline-block !important;
	height: 94px !important;
	width: 100% !important;
	margin-right: 8px;
	/* border: 1px solid tan !important; */
}
ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) .details.ytd-compact-movie-renderer {
	position: relative !important;
	display: inline-block !important;
	height: 78px !important;
	min-width: 100% !important;
	margin: 0px 0 0 0 !important;
	left: -12.9vw !important;
	top: 10.5vh !important;
	/* border: 1px solid red !important; */
}
ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) .details.ytd-compact-movie-renderer a.yt-simple-endpoint.ytd-compact-movie-renderer {
	position: relative !important;
	display: inline-block !important;
	width: 100% !important;
	height: 77px !important;
	left: 0 !important;
	padding: 0 !important;
	/* border: 1px solid yellow !important; */
}
/* (new32) */
ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) .details.ytd-compact-movie-renderer a.yt-simple-endpoint.ytd-compact-movie-renderer #movie-title {
	display: inline-block !important;
	line-height: 2rem;
	max-height: 4rem;
	margin-bottom: -13px;
	font-size: 1.1rem !important;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
}
ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) .details.ytd-compact-movie-renderer a.yt-simple-endpoint.ytd-compact-movie-renderer ytd-badge-supported-renderer {
	position: absolute !important;
	display: inline-block !important;
	top: -20px !important;
	width: 100% !important;
}
ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) .details.ytd-compact-movie-renderer a.yt-simple-endpoint.ytd-compact-movie-renderer .badge.ytd-badge-supported-renderer:not(:last-of-type) {
	float: left !important;
	width: 50% !important;
	height: 10px !important;
	margin: 0 0 0 0 !important;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	/* background: red !important; */
}
ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) .details.ytd-compact-movie-renderer a.yt-simple-endpoint.ytd-compact-movie-renderer .badge.ytd-badge-supported-renderer:not(:first-of-type) {
	float: left !important;
	width: 10% !important;
	height: 10px !important;
	margin-left: 10px !important;
	/* background: green !important; */
}

/* (new28) - CHAINE  */
.ytd-watch-next-secondary-results-renderer.use-ellipsis {
	display: inline-block !important;
	min-height: 180px !important;
	max-height: 180px !important;
	max-width: 31.8%;
	min-width: 31.8%;
	border: 1px solid aqua !important;
}
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer {
	display: inline-block !important;
	height: 94px !important;
	margin-right: 8px;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
}
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer ytd-thumbnail {
	display: inline-block !important;
	height: 94px !important;
	margin-right: 8px;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
}
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer .details.ytd-compact-radio-renderer {
	display: inline-block !important;
	height: auto !important;
	margin-right: 8px;
	width: 100% !important;
	min-width: 97.5% !important;
	max-width: 97.5% !important;
	padding: 2px 3px !important;
	background: #333 !important;
	border-top: 1px solid red !important;
	border-bottom: 1px solid red !important;
}

/* (new58) COR FLOAT */
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer .details.ytd-compact-radio-renderer .metadata.ytd-compact-radio-renderer {
	display: block !important;
	float: left !important;
	width: 88% !important;
	height: 40px !important;
	min-width: 0;
	padding: 0 !important;
/* border-right: 1px solid  red !important; */
}
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer .details.ytd-compact-radio-renderer .metadata.ytd-compact-radio-renderer #title {
	display: inline-block !important;
	width: 100% !important;
	height: auto !important;
	padding: 0 !important;
/* border-right: 1px solid  red !important; */
}
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer .details.ytd-compact-radio-renderer .metadata.ytd-compact-radio-renderer #title h3 {
	display: inline-block !important;
	width: 100% !important;
	height: auto !important;
	padding: 0 !important;
	/* border-right: 1px solid  red !important; */
}
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer .details.ytd-compact-radio-renderer .metadata.ytd-compact-radio-renderer #title h3 span {
	display: inline-block !important;
	width: 100%;
	height: 100% !important;
	min-height: 40px !important;
	max-height: 40px !important;
	text-transform: lowercase;

	border-bottom: 1px solid red;
}

/* (new58) COR FLOAT */
.ytd-watch-next-secondary-results-renderer.use-ellipsis #dismissible.ytd-compact-radio-renderer .details.ytd-compact-radio-renderer #menu {
	display: block !important;
	float: right !important;
	width: 10% !important;
	height: 39px !important;
	min-width: 0;
	margin: 2px 0 0 0 !important;
	padding: 0 !important;
border-left: 1px solid tan !important;
}

/* (new41)  RELATED PANEL - when CONNECTED  */
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer {
	position: sticky;
	display: inline-block !important;
	width: 100% !important;
	min-width: 99.9% !important;
	max-width: 99.9% !important;
	top: 0.5vh !important;
	padding-left: 1rem !important;
	z-index: 500 !important;
	background: #111 !important;
	/* border-bottom: 1px solid yellow !important; */
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer {
	background: white !important;
	border-top: 1px solid red !important;
	border-bottom: 1px solid red !important;
}

/* (new41) CONNECTED (with CHIPS TAGS ) */
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer {
	display: inline-block !important;
	float: none !important;
	clear: none;
	width: 100% !important;
	max-width: 98% !important;
	min-width: 98% !important;
	height: 100% !important;
	min-height: 0px !important;
	max-height: 0px !important;
	margin: 0.5vh 0rem 0.2rem 0.5rem !important;
	padding: 0rem !important;
	border: none !important;
	/* border: 1px solid aqua !important; */
}

#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer #contents {
	display: inline-block !important;
    width: 100% !important;
	max-width: 98% !important;
	min-width: 98% !important;
}


#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer ytd-compact-video-renderer {
	clear: none !important;
	float: left !important;
	width: 100% !important;
	max-width: 31.8% !important;
	min-width: 31.8% !important;
	height: auto !important;
	margin-bottom: 0.2rem !important;
	margin-left: 0.5rem !important;
	margin-right: 0rem !important;
	padding: 0.2rem !important;
	border-radius: 3px;
/* background-color: red !important; */
border: 1px solid gray !important;
}

/* (new70) TOTARA - RELATED ITEMS - LOCKUP */
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer .ytd-item-section-renderer.lockup {
	clear: none !important;
	float: left !important;
	width: 100% !important;
	max-width: 31.8% !important;
	min-width: 31.8% !important;
	height: 100% !important;
    min-height: 22vh !important;
    margin: 8px 0rem 0.2rem 0.5rem !important;
	padding: 0.2rem !important;
	border-radius: 3px;
border: 1px solid gray !important;
}
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer .ytd-item-section-renderer.lockup .yt-lockup-view-model-wiz--horizontal {
    position: relative !important;
    display: block !important;
    float: left !important;
    width: 100% !important;
    min-width: 100% !important;
	max-width: 100% !important;
    margin: 0px 0 -1.5vh 0 !important;
/*border: 1px dashed yellow !important;*/
}

#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer .ytd-item-section-renderer.lockup .yt-lockup-view-model-wiz.yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image yt-collection-thumbnail-view-model yt-collections-stack.collections-stack-wiz > div  > div{
    width: 100% !important;
    min-width: 99% !important;
	max-width: 99% !important;
    height: 11vh !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
/*border: 1px dashed greenyellow!important;*/
}


#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer .ytd-item-section-renderer.lockup .yt-lockup-view-model-wiz__content-image {
    display: inline-block !important;
    width: 100% !important;
    min-width: 99% !important;
	max-width: 99% !important;
    height: 11vh !important;
    margin: 0 0 0vh 0 !important
/*border: 1px dashed greenyellow!important;*/
}
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer .ytd-item-section-renderer.lockup .yt-lockup-view-model-wiz__content-image .yt-thumbnail-view-model .yt-thumbnail-view-model__image {
    display: inline-block !important;
    width: 100% !important;
    min-width: 99% !important;
	max-width: 99% !important;
    height: 11vh !important;
    margin: -1vh 0 0vh 0 !important;
    padding: 0 0 0vh 0 !important;
/*border: 1px dashed aqua !important;*/
}
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer .ytd-item-section-renderer.lockup .yt-lockup-view-model-wiz__content-image .yt-thumbnail-view-model .yt-thumbnail-view-model__image img{
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
	max-width: 100% !important;
    height: 11vh !important;
    padding: 0 0 0vh 0 !important;
    object-fit: contain !important;
    object-position: center center !important;
/*border: 1px dashed greenyellow!important;*/
}
#items yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer + ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > .ytd-item-section-renderer .ytd-item-section-renderer.lockup .yt-lockup-view-model-wiz__metadata {
    position: relative !important;
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
	max-width: 100% !important;
    top: -2vh !important;
    margin: 0vh 0 0vh 0 !important;
/*background: brown !important;*/
/*border: 1px dashed aqua !important;*/
}

/* (new35) PLAYLIST ITEMS */
#related #items ytd-compact-playlist-renderer.ytd-watch-next-secondary-results-renderer,
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer,
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-playlist-renderer[custom-thumbnail-size] {
	clear: none !important;
	float: left !important;
	width: 100% !important;
	max-width: 31.8% !important;
	min-width: 31.8% !important;
	height: auto !important;
	margin-bottom: 0.2rem !important;
	margin-left: 0.5rem !important;
	margin-right: 0rem !important;
	padding: 0.2rem !important;
	border-radius: 3px;
	border: 1px solid #333 !important;
	border: 1px solid green !important;
}

#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer ytd-thumbnail.ytd-compact-radio-renderer,
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-playlist-renderer[custom-thumbnail-size] ytd-playlist-thumbnail.ytd-compact-playlist-renderer,
#related #items ytd-compact-playlist-renderer.ytd-watch-next-secondary-results-renderer ytd-playlist-thumbnail.ytd-compact-playlist-renderer {
	display: inline-block;
	height: 107px;
	margin: 0 !important;
	width: 100%;
	border-radius: 3px !important;
}
/* (new35) PLAYLIST BORDER RADIUS  */
ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail,
ytd-playlist-thumbnail[size="medium"]::before {
	border-radius: 3px !important;
}
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer #dismissible,
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-playlist-renderer[custom-thumbnail-size] #dismissible,
#related #items ytd-compact-playlist-renderer.ytd-watch-next-secondary-results-renderer #dismissible {
	display: inline-block !important;
	min-width: 100% !important;
	width: 100%;
}
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer #dismissible .details.ytd-compact-playlist-renderer,
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-playlist-renderer[custom-thumbnail-size] #dismissible .details.ytd-compact-playlist-renderer,
#related #items ytd-compact-playlist-renderer.ytd-watch-next-secondary-results-renderer #dismissible .details.ytd-compact-playlist-renderer {
	min-width: 100% !important;
	width: 100%;
}
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer #dismissible .metadata.ytd-compact-playlist-renderer,
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-playlist-renderer[custom-thumbnail-size] #dismissible .metadata.ytd-compact-playlist-renderer,
#related #items ytd-compact-playlist-renderer.ytd-watch-next-secondary-results-renderer #dismissible .metadata.ytd-compact-playlist-renderer {
	display: inline-block !important;
	min-width: 0;
	padding-right: 0px;
	width: 100%;
}
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer #dismissible .metadata.ytd-compact-playlist-renderer #title.ytd-compact-playlist-renderer,
#related #items ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer ytd-compact-playlist-renderer[custom-thumbnail-size] #dismissible .metadata.ytd-compact-playlist-renderer #title.ytd-compact-playlist-renderer,
#related #items ytd-compact-playlist-renderer.ytd-watch-next-secondary-results-renderer #dismissible .metadata.ytd-compact-playlist-renderer #title.ytd-compact-playlist-renderer {
	width: 100%;
}
/* (new21) PLAY QUEUE - BUTTONS */
.badge.queue-button.ytd-badge-supported-renderer {
	margin-bottom: 0 !important;
	margin-top: 0px !important;
	padding: 0 !important;
}

/* (new41) NUDGE ITEMS ?? */
#related #items ytd-feed-nudge-renderer[is-dismissed] {
	float: left;
	clear: none;
	width: 100% !important;
	max-width: 99% !important;
	min-width: 99% !important;
	height: 20px !important;
	line-height: 15px !important;
	margin-right: 0rem;
	margin-left: 0.5rem;
	margin-bottom: 0.2rem;
	border-radius: 3px !important;
	padding: 0 !important;
	/* border: 1px solid aqua !important; */
}
#dismissed.ytd-feed-nudge-renderer {
	position: relative;
	padding-bottom: 0 !important;
}

/* (new21) SEARCH GENERATED for GM "Youtube - Search While Watching Video" */
.yt-search-generated:before {
	content: "🔎";
	position: absolute;
	display: inline-block;
	min-width: 15px;
	height: 12px;
	bottom: 0 !important;
	right: 0 !important;
	text-align: center;
	border-radius: 5px 0 0 0 !important;
	z-index: 500;
	opacity: 0.5;
	color: red;
	border: 1px solid green !important;
	background: gold;
}
#items .ytd-watch-next-secondary-results-renderer:not(ytd-compact-autoplay-renderer).yt-search-generated {
	border: 1px solid blue !important;
}

/* (new31) - COMMENTS - FIXED - MOVE RIGHT - A VOIR :not([should-stamp-chat])  */
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:hover):not(:empty):not([hidden]),
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:hover):not(:empty):not([hidden]) {
	position: fixed !important;
	display: inline-block !important;
	min-width: 38.8% !important;
	max-width: 38.8% !important;
	height: 90vh;
	left: 60% !important;
	top: 85px;
	padding: 0 10px;
	overflow: hidden;
	overflow-y: auto !important;
	z-index: 500000 !important;
	background: black;
}
/* (new31) - CY Fung FIX - A VOIR :not([should-stamp-chat])  */
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:hover):not(:empty):not([hidden]),
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:hover):not(:empty):not([hidden]) {
	visibility: collapse !important;
}

/* (new31) - NO DARK - A VOIR :not([should-stamp-chat])  */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments,
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments {
	background-color: white !important;
}
/* (new31) - COMMENTS - HOVER - A VOIR :not([should-stamp-chat])  */
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:hover:not(:empty):not([hidden]),
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:hover:not(:empty):not([hidden]) {
	position: fixed !important;
	display: inline-block !important;
	min-width: 38.8% !important;
	max-width: 38.8% !important;
	height: 90vh;
	left: 60% !important;
	top: 9vh;
	padding: 0 10px;
	z-index: 500000 !important;
	visibility: visible !important;
	background: black;
	border-top: 1px solid green !important;
	border-bottom: 4px solid gray !important;
}

/* (new31) - NO DARK - A VOIR :not([should-stamp-chat])  */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:hover,
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:hover {
	background-color: white !important;
}

/* (new31) - A VOIR :not([should-stamp-chat]) */
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]) ytd-item-section-renderer,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]) ytd-item-section-renderer {
	display: inline-block !important;
	min-height: 100% !important;
	width: 100% !important;
	margin-top: 0px;
}
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments ytd-item-section-renderer ytd-comments-header-renderer,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments ytd-item-section-renderer ytd-comments-header-renderer {
	margin-bottom: 5px;
	margin-top: 25px;
}
ytd-comments #title.ytd-comments-header-renderer,
#title.ytd-comments-header-renderer {
	margin-bottom: 5px;
}
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]) #contents,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]) #contents {
	display: inline-block !important;
	width: 98%;
	top: -35px;
	padding: 5px 10px;
	overflow: hidden;
	overflow-y: auto;
	background: #333;
}
/* (new31) - CY Fung FIX - A VOIR :not([should-stamp-chat]) */
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]) #contents,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]) #contents {
	height: 77vh !important;
}

/* (new31) - NO DARK - A VOIR :not([should-stamp-chat])*/
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager ytd-comments #contents,
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) ytd-comments #contents {
	background-color: white !important;
}
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]):before,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:not(:empty):not([hidden]):before {
	content: "Comments ▼";
	position: fixed;
	display: inline-block;
	width: 100px;
	height: 21px !important;
	line-height: 21px;
	margin: 0px 0 0 125px !important;
	top: 6.4vh !important;
	padding: 1px 5px;
	border-radius: 3px 3px 0 0;
	text-align: center !important;
	z-index: 5000000 !important;
	visibility: visible;
	color: gray !important;
	border-top: 1px solid #333;
	border-bottom: 1px solid #333;
	border-right: 5px solid #333;
	border-left: 5px solid #333;
background-color: #222;
}
/* (new31) - TEST - CHAT - COMMENTS */
#secondary ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"][visibility="ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"] ytd-comments:before {
	display: none !important;
}
/* (new31) - NO DARK - A VOIR - :not([should-stamp-chat]) */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:before,
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:before {
	border-top: 1px solid #E7E7E7 !important;
	border-bottom: 1px solid #E7E7E7 !important;
	border-right: 5px solid #E7E7E7;
	border-left: 5px solid #E7E7E7;
background-color: white !important;
color: black!important;
}
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments:not([hidden]):hover:before,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:not([hidden]):hover:before {
	font-size: 15px !important;
	text-align: center !important;
	color: white !important;
	border: none !important;
	border-bottom: 1px solid green !important;
	border-top: 2px solid transparent !important;
background-color: #333 !important;
}
/* (new31) - NO DARK - A VOIR - :not([should-stamp-chat]) */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments,
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments:hover:before {
	color: white !important;
	border-bottom: 1px solid #E7E7E7;
	border-top: 5px solid #999;
	border-left: 5px solid #999;
border-right: 5px solid #999;
background-color: #999 !important;
}
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments#comments #contents ytd-comment-thread-renderer,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments#comments #contents ytd-comment-thread-renderer {
	display: block;
	margin-bottom: 5px !important;
	padding: 5px;
	border-radius: 5px;
background-color: #222;
border: 1px solid #333 !important;
}
/* (new31) - NO DARK  - A VOIR - :not([should-stamp-chat])*/
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager ytd-comments #contents ytd-comment-thread-renderer,
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) ytd-comments #contents ytd-comment-thread-renderer {
	background-color: white !important;
}

/* (new31) - COMMENTS COUNTER - start at 01 - A VOIR - :not([should-stamp-chat]) */
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments#comments:not(:empty):not([hidden]),
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments#comments:not(:empty):not([hidden]) {
	content: counter(myIndex, decimal);
	counter-increment: myIndex 0 !important;
}
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments#comments:not(:empty):not([hidden]) ytd-comment-thread-renderer::before,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments#comments:not(:empty):not([hidden]) ytd-comment-thread-renderer::before {
	counter-increment: myIndex ! important;
	content: counter(myIndex, decimal)"\\A Comments";
	position: fixed;
	width: auto;
	line-height: 15px;
	min-width: 17px;
	right: 5px !important;
	top: 3.95vh !important;
	padding: 1px 5px;
	text-align: center;
	border-radius: 3px;
	font-size: 15px;
	z-index: 100;
	visibility: visible !important;
	opacity: 1 !important;
color: tomato;
box-shadow: 0 0 2px rgba(162, 160, 160, 0.6) inset;
/* background: rgba(62, 59, 59, 0.6) none repeat scroll 0 0; */
background: black !important;
}
.ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments#comments ytd-comment-thread-renderer:hover::before,
.ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments#comments ytd-comment-thread-renderer:hover::before {
	opacity: 1 !important;
}
/* (new31) - NO DARK - A VOIR - :not([should-stamp-chat]) */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager #columns.ytd-watch-flexy #primary-inner ytd-comments#comments ytd-comment-thread-renderer::before,
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) #columns.ytd-watch-flexy #primary-inner ytd-comments#comments ytd-comment-thread-renderer::before {
	background-color: white !important;
}


/* WIDE THEATER - TABVIEW - :not(.parentToothbrush) */
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_]:not(.parentToothbrush) {
	position: fixed !important;
	left: 0;
	right: 0;
	bottom: 0 !important;
	z-index: 50000000 !important;
}
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_] #columns.ytd-watch-flexy #primary {
	z-index: 0 !important;
}

/* WIDE THEATER - SUPP ELEMENTS UNDER PALYER - TABVIEW */
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_] .watch-active-metadata.ytd-watch-flexy > #meta,
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_] .watch-active-metadata.ytd-watch-flexy > #info #info-contents #info,
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-youtube-comments][flexy][theater][theater-requested_][flexy-large-window_] .watch-active-metadata.ytd-watch-flexy > #info #primary-info #info {
	display: none !important;
}

/* (new21) YOUTUBE HOME  in 2 Coumn - VIDEO PREVIEW on HOVER THUMB ADD :not(.ytp-big-mode):not(.ytp-embed):not(#c4-player):not(#inline-preview-player) */
/* (new21) NOT EMBED .html5-video-player:not(.ytp-embed) */
.html5-video-player:not(.ytp-embed).ytp-inline-preview-ui,
.html5-video-player:not(.ytp-embed) .ytp-inline-preview-scrim {
	/* height: 407px; */
	/* border: 1px solid aqua !important; */
}



/* (new21) TOOLTIPS - THEATER */
ytd-watch-flexy[flexy][theater]:not([fullscreen]):not(.ytp-embed):not([style*="display: none;"]) .ytp-tooltip.ytp-bottom .ytp-tooltip-text-wrapper span.ytp-tooltip-text.ytp-tooltip-text-no-title {
	margin-top: -60px !important;
}

/* (new21) TEST - PREVIEW VIDEO THUMBNAIL + BUTTON TOOLTIPS - THEATER */
ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy .ytp-tooltip.ytp-bottom.ytp-preview:not([style*="display: none;"]) {
	position: fixed !important;
	display: inline-block !important;
	margin-top: 8.5vh !important;
	pointer-events: none;
	z-index: 500000000 !important;
}
/* (new21) TOOLTIPS - THEATER */
ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy #player-container ytd-player.ytd-watch-flexy #movie_player.html5-video-player .ytp-tooltip.ytp-bottom .ytp-tooltip-text-wrapper .ytp-tooltip-text.ytp-tooltip-text-no-title {
	margin-top: -20px !important;
}

/* (new21) TOOLTIP TITLE */
.html5-video-player:not(#c4-player) .ytp-preview:not(.ytp-text-detail) .ytp-tooltip-title {
	position: relative;
	display: block;
	height: 16px;
	width: 200%;
	top: 2.7vh !important;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
border: 0 none;
color: white !important;
}
.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-title {
	position: relative;
	display: block;
	width: 200%;
	height: 16px;
	top: 45px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
border: 0 none;
color: red !important;
}

/* (new48) TOTAL CONTAINER - PLAYER + RIGHT PANEL - COLUMN FLEXY 
:not([flexy-enable-large-window-sizing])
==== */
.tabview-normal-player ytd-page-manager#page-manager ytd-watch-flexy:not([flexy-enable-large-window-sizing]) #columns.ytd-watch-flexy,
ytd-page-manager#page-manager ytd-watch-flexy:not([flexy-enable-large-window-sizing]) #columns.ytd-watch-flexy {
	min-width: 100% !important;
	max-width: 100% !important;
	height: 100% !important;
	min-height: 99.9vh !important;
	max-height: 99.9vh !important;
	margin-left: 0 !important;
	overflow: hidden !important;
}

/* (new48) FULL - LARGE MODE */
.tabview-normal-player ytd-page-manager#page-manager ytd-watch-flexy[flexy-enable-large-window-sizing] #columns.ytd-watch-flexy,
ytd-page-manager#page-manager ytd-watch-flexy[flexy-enable-large-window-sizing] #columns.ytd-watch-flexy {
	position: fixed !important;
	display: inline-block !important;
	min-width: 100% !important;
	max-width: 100% !important;
	height: 100% !important;
	min-height: 100vh !important;
	max-height: 100vh !important;
	margin-left: 0 !important;
	overflow: hidden !important;
}
ytd-watch-flexy[full-bleed-player][fullscreen] #columns.ytd-watch-flexy #below,
ytd-watch-flexy[full-bleed-player][fullscreen] #columns.ytd-watch-flexy #secondary {
	display: none !important;
}
/* (new63) LARGE - THEATER - NOT FULL - CONTROL BAR */
ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy .ytp-chrome-bottom  {
	position: fixed !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
	height: 3vh !important;
	bottom: -2vh !important;
	left: 0 !important;
	z-index: 500000000 !important;
}
ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy #movie_player:hover .ytp-chrome-bottom {
	bottom: 2vh !important;
}

/* (new63) LARGE - THEATER - NOT FULL */
ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy {
	position: fixed !important;
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100vw !important;
	min-height: 43.7vw !important;
	max-height: 43.7vw !important;
	top: 9vh !important;
	z-index: 50000000 !important;
}
ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy .ytp-title {
	position: fixed !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 48% !important;
	max-width: 48% !important;
	height: 3vh !important;
	top: 6vh !important;
	left: 0 !important;
	z-index: 50000000 !important;
}

ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy .ytp-title .ytp-title-text {
	position: fixed !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 48% !important;
	max-width: 48% !important;
	height: 3vh !important;
	top: 6vh !important;
	margin: 0 !important;
	padding: 0 0 0 10px!important;
	font-size: 18px;
	text-overflow: ellipsis;
	vertical-align: top;
	overflow: hidden;
	white-space: nowrap;
	overflow-wrap: normal;
}
/* (new48) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy .ytp-title .ytp-title-text {
	color: black !important;
}




/* (new31) Z-INDEX FOR PREVIEW */
#columns.ytd-watch-flexy #primary {
	position: absolute !important;
	min-width: 59.5% !important;
	max-width: 59.5% !important;
	height: 100% !important;
	min-height: 92.1vh !important;
	max-height: 92.1vh !important;
	margin-left: 0 !important;
	left: 0.3rem !important;
	top: 6.5vh !important;
	padding: 0 !important;
	overflow: visible !important;
}
#columns.ytd-watch-flexy #primary:hover {
	z-index: 5000000000 !important;
}

/* (new21) Z-INDEX FOR PREVIEW  TABVIEW  - PB HIDE SEARCH BAR on HOVER :
html[plugin-tabview-youtube]  #columns.ytd-watch-flexy #primary #primary-inner > #player:first-child  #player-container-outer.ytd-watch-flexy #player-container-inner.ytd-watch-flexy ytd-player #container.ytd-player .html5-video-player:hover
=== */
html[plugin-tabview-youtube] #columns.ytd-watch-flexy #primary {
	z-index: 500000000 !important;
}
html[plugin-tabview-youtube] #columns.ytd-watch-flexy #primary:hover {
	display: inline-block !important;
	z-index: 5000000000 !important;
}

/* (new31) PRIMARY INNER - PLAYER + INFOW UNDER THE FOLD */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy {
	min-width: 100% !important;
	max-width: 100% !important;
	height: 100% !important;
	min-height: 92.5vh !important;
	max-height: 92.5vh !important;
	margin-left: 0 !important;
	overflow: visible !important;
}

/* (new31) PLAYER - TEST BACKGROUND COLOR on LOAD */
ytd-watch-flexy #columns #primary #player {
	overflow: visible !important;
background-color: transparent !important;
}

/* (new49) INFOS ACTIVE UNDER THE FOLD - ytd-watch-metadata[description-collapsed]  */

/* (new45) INFOS ACTIVE UNDER THE FOLD - THEATER - DISPLAY NONE ?? - ytd-watch-metadata[description-collapsed]  */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy {
	display: inline-block !important;
	width: 0% !important;
	height: 0vh !important;
	margin: 0 !important;
	overflow: hidden !important;
	z-index: 5000 !important;
	border: none !important;
}

/* (new31) THEATER - INFOS ACTIVE UNDER THE FOLD - move TOP */
/* ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy  #below .watch-active-metadata.ytd-watch-flexy + div , */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy #below .watch-active-metadata.ytd-watch-flexy #top-row.ytd-watch-metadata + #bottom-row,
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy #below .watch-active-metadata.ytd-watch-flexy #top-row.ytd-watch-metadata {
	display: none !important;
}


/* (new56) UNDER PLAYER - INFOS CONTAINER */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold {
	position: fixed !important;
    display: inline-block !important;
	float: none !important;
	min-width: 59.5% !important;
	max-width: 59.5% !important;
	height: 6.9vh !important;
	margin: 0 0 0 0 !important;
	bottom: 1.2vh !important;
	z-index: 500000 !important;
}

/* (new31) THEATER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold {
	height: 0vh !important;
	bottom: -2vh !important;
border: 1px solid green !important;
}

/* (new49) UNDER PLAYER - TOP INFOS - OWNER / ACTIONS (BOTTOM) */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #top-row.ytd-watch-metadata {
	position: fixed;
	height: 40px !important;
	line-height: 30px !important;
	min-width: 30% !important;
	max-width: 30% !important;
	left: 0.5vw !important;
	margin: 0 0 0 0 !important;
	bottom: 1.3vh !important;
}

/* (new52) UNDER PLAYER - MIDDLE INFOS - TEXT INFOS OWNER  - RESUME */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #middle-row .ytd-watch-metadata[has-menu] {
	position: fixed !important;
	height: auto !important;
	max-height: 4.5vh !important;
	width: 55px !important;
	bottom: 6.5vh !important;
	right: 40% !important;
	overflow: hidden !important;
	opacity: 0.5 !important;
	transform: scale(0.5) !important;
}
/* HOVER */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #middle-row .ytd-watch-metadata[has-menu]:hover {
	width: auto !important;
	opacity: 1 !important;
	transform: scale(1) !important;
background: red !important;
}
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #middle-row .ytd-watch-metadata[has-menu] .content.ytd-info-panel-content-renderer {
	display: flex;
	flex: 1 1 1e-9px;
	flex-direction: row;
	padding: 0px 16px !important;
}


#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #middle-row .ytd-watch-metadata[has-menu] #menu.ytd-info-panel-content-renderer {
	height: 20px !important;
	margin: 0px !important;
}
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #middle-row .ytd-watch-metadata[has-menu] #menu.ytd-info-panel-content-renderer ytd-menu-renderer {
	height: 20px !important;
	margin: 0px !important;
}
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #middle-row .ytd-watch-metadata[has-menu] #menu.ytd-info-panel-content-renderer ytd-menu-renderer yt-icon-button {
	height: 20px !important;
	margin: 0px !important;
}
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #middle-row .ytd-watch-metadata[has-menu] #menu.ytd-info-panel-content-renderer ytd-menu-renderer yt-icon.ytd-menu-renderer {
	height: 20px !important;
	margin: 0px !important;
}


/* (new49) UNDER PLAYER - BOTTOM INFOS - INFOS DESCRIPTION - TAB - TABVIEW  cf TAB DESCRIPTION */
/* #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy  .watch-active-metadata.ytd-watch-flexy #above-the-fold #bottom-row .ytd-watch-metadata  */
/* (new49) UNDER PLAYER - TOP + BOTTOM INFOS - UNDER PLAYER */
/* #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy  .watch-active-metadata.ytd-watch-flexy #above-the-fold #bottom-row .ytd-watch-metadata  , */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #top-row + #bottom-row {
	position: fixed;
	display: inline-block !important;
	min-width: 59% !important;
	max-width: 59% !important;
	margin: 0 !important;
	bottom: 8vh !important;
}
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #top-row + #bottom-row #owner.ytd-watch-metadata {
	float: left !important;
	align-items: center;
	display: flex;
	flex: 1 1 1e-9px;
	flex-direction: row;
	min-width: 59% !important;
	max-width: 59% !important;
}
/* (new30) */
#below ytd-rich-metadata-row-renderer:not([fixie]) #contents.ytd-rich-metadata-row-renderer {
	height: 5vh !important;
	margin: 41px 0 0 0 !important;
}
#below ytd-rich-metadata-row-renderer:not([fixie]) #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer {
	height: 4.8vh !important;
	min-width: 98% !important;
	max-width: 98% !important;
	margin: 0px 16px 8px 5px !important;
border: 1px solid #333 !important;
}
#below ytd-rich-metadata-row-renderer:not([fixie]) #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer a#endpoint-link > div {
	height: 4vh !important;
	margin-top: 0px !important;
}
#below ytd-rich-metadata-row-renderer:not([fixie]) #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer #thumbnail.ytd-rich-metadata-renderer {
	height: 4.8vh !important;
	margin-top: -5px !important;
}
#below ytd-rich-metadata-row-renderer:not([fixie]) #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer #title.ytd-rich-metadata-renderer {
	margin-top: 14px !important;
	line-height: 0.6rem !important;
	font-size: 1.4rem !important;
}
#below ytd-rich-metadata-row-renderer:not([fixie]) #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer #call-to-action.ytd-rich-metadata-renderer {
	line-height: 1.5rem !important;
	margin-top: 4px;
	font-size: 1rem !important;
	text-transform: uppercase;
}

/* (new36) PLAYER - SUBSCRIB BUTTON */
#top-row.ytd-watch-metadata #subscribe-button ytd-button-renderer #button.ytd-button-renderer {
	padding: 0.1em 0.27em !important;
	font-size: 1.1rem !important;
}
/* (new36) NEW DESIGN - COMMENTS TEASER (with BOTTOM ROW) */
.ytd-page-manager:not([should-stamp-chat]) #comment-teaser.ytd-watch-metadata:not(:hover) {
	display: inline-block !important;
	width: 100% !important;
	min-width: 10vw !important;
	max-width: 10vw !important;
	opacity: 0.2 !important;
border: 1px solid #333 !important;
}
.ytd-page-manager:not([should-stamp-chat]) #comment-teaser.ytd-watch-metadata:not(:hover) #content {
	display: none !important;
}
.ytd-page-manager:not([should-stamp-chat]) #comment-teaser.ytd-watch-metadata:hover {
	display: inline-block !important;
	z-index: 5000000 !important;
	opacity: 1 !important;
background: #111 !important;
border: 1px solid #333 !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-page-manager:not([should-stamp-chat]) #comment-teaser.ytd-watch-metadata:hover {
	background: white !important;
}

/* (new23) THEATER - INFOS UNDER THE FOLD */
#page-manager ytd-watch-flexy.ytd-page-manager.hide-skeleton[theater-requested_][theater] #columns #primary #primary-inner {
	position: fixed;
	display: inline-block;
	width: 100% !important;
	min-width: 60% !important;
	max-width: 60% !important;
	height: 100%;
	min-height: 5vh !important;
	max-height: 5vh !important;
	margin-left: 0;
	left: 0 !important;
	overflow: hidden !important;
}

/* (new31) INFOS UNDER THE FOLD - PURCHASE /RENT */
.watch-active-metadata #above-the-fold + ytd-metadata-row-container-renderer.ytd-watch-metadata #always-shown {
	display: none !important;
}
/* (new31) RENT NO THEATER ytd-watch-flexy[theater] */
/* .ytd-page-manager[flexy-enable-large-window-sizing=""][flexy-large-window_=""] #above-the-fold  .badge.badge-style-type-ypc.ytd-badge-supported-renderer , */
#above-the-fold .badge.badge-style-type-ypc.ytd-badge-supported-renderer {
	position: fixed !important;
	display: inline-block !important;
	height: 15px !important;
	width: 100px !important;
	right: 43.3vw !important;
	top: 3.8vh !important;
	opacity: 0.5 !important;
}
/* (new31) RENT THEATER ytd-watch-flexy[theater] */
ytd-watch-flexy[theater] #above-the-fold .badge.badge-style-type-ypc.ytd-badge-supported-renderer {
	display: none !important;
}
/* (new56) INFOS ACTIVE UNDER THE FOLD - ACTION BAR */
#columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #actions {
	position: fixed !important;
	display: inline-block !important;
	height: 40px !important;
	line-height: 30px !important;
	min-width: 25% !important;
	max-width: 25% !important;
	left: 34.5vw !important;
	margin: 0 0 0 0 !important;
	bottom: 1.3vh !important;
	text-align: left !important;
        opacity: 1 !important;
        visibility: visible !important;
}

/* DARK - BUTTONS ALL */
html[dark][dark="true"]:not(.style-scope) .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
	background-color: #222 !important;
	color: silver !important;
}

/* (new31) */
ytd-watch-metadata[modern-metapanel-order] #owner.ytd-watch-metadata {
	min-width: calc(100% - 6px) !important;
	max-width: calc(100% - 6px) !important;
	margin: 2px 0 0 5px !important;
}

/*  (new21) NOT EMBED - :not(.ytp-embed):not(.ytp-big-mode):not(.ytp-embed):not(#c4-player):not(#inline-preview-player) */
.html5-video-player:not(.ytp-big-mode):not(.ytp-embed):not(#c4-player):not(#inline-preview-player) {
	/* height: 74vh !important; */
}
/* PLAYER - THEATER MOD - BOTTOM CONTAINER  */
ytd-watch-flexy[flexy-large-window_=""] #player-theater-container:not(:empty) + #ujs-hdr-links-div + #columns #primary.ytd-watch-flexy {
	margin-left: 333px !important;
}
ytd-watch-flexy[flexy_][is-two-columns_][is-extra-wide-video_] #primary.ytd-watch-flexy,
ytd-watch-flexy[flexy_][is-two-columns_][is-four-three-to-sixteen-nine-video_] #primary.ytd-watch-flexy {
	padding-top: 0;
}

/* (new23) THEATER MODE (not FULLSCREEN) Width 1148px - , ytd-watch-flexy[fullscreen] #player-theater-container.ytd-watch-flexy  - :not(.parentToothbrush) */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #player-theater-container,
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #player-theater-container.ytd-watch-flexy {
	/* position: relative !important; */
	position: fixed !important;
	min-width: 99.92% !important;
	max-width: 99.92% !important;
	min-height: calc(100vh - 9.5vh) !important;
	max-height: calc(100vh - 9.5vh) !important;
	left: 0px !important;
	bottom: 0 !important;
	margin: 3vh 0 0 0 !important;
	overflow: visible !important;
	z-index: 50000 !important;
	background: transparent !important;
}
/* (new23) THEATER - TABVIEW */
html[plugin-tabview-youtube] ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #player-theater-container,
html[plugin-tabview-youtube] ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #player-theater-container.ytd-watch-flexy {
	position: fixed !important;
	min-width: 99.92% !important;
	max-width: 99.92% !important;
	min-height: calc(100vh - 9.5vh) !important;
	max-height: calc(100vh - 9.5vh) !important;
	left: 0px !important;
	top: 9vh !important;
	margin: 0 0 0 0 !important;
	overflow: visible !important;
	z-index: 50000 !important;
background: #111 !important;
}


html:not(.floater):not(.iri-always-visible) #player-theater-container .html5-video-player:not(.ytp-embed):not(#c4-player):not(.ytp-fullscreen):not(.ytp-hide-controls) .html5-main-video.video-stream {
	max-height: 88vh !important;
	min-height: 88vh !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy {
	background: transparent !important;
}

/* (new21) THEATER */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container {
	width: 100%;
}
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player .caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup {
	display: inline-block;
	width: 99.7% !important;
	margin-left: 0;
	bottom: 7% !important;
	height: 72px;
	left: 21.2%;
	overflow: hidden;
	text-align: center !important;
}
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player:hover .caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup {
	bottom: -1% !important;
}
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player.paused-mode .caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup {
	bottom: 7.5% !important;
}
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player.paused-mode:hover .caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup {
	bottom: 4.5% !important;
}



/* (new48) THEATER */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy ~ #columns {
	position: absolute !important;
	display: inline-block !important;
	min-width: 59.5% !important;
	max-width: 59.5% !important;
	height: 100% !important;
	min-height: 5vh !important;
	max-height: 5vh !important;
	overflow: hidden !important;
}
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy ~ #columns #primary {
	min-height: 10vh !important;
	max-height: 10vh !important;
	min-width: 100% !important;
	max-width: 100% !important;
	padding: 0 !important;
	overflow: hidden !important;
}
/* (new23) THEATER - display NONE ? */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy ~ #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #top-row #actions {
	display: none !important;

}
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy ~ #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #top-row + #bottom-row {
	position: fixed;
	/*     display: inline-block; */
	display: none !important;
	min-height: 7vh !important;
	max-height: 7vh !important;
	max-width: 21.9% !important;
	min-width: 21.9% !important;
	top: 9vh !important;
	right: 18vw!important;
	margin: 0;
	background: yellow !important;
	border: 1px solid green;
}
ytd-watch-flexy[theater] .annotation.annotation-type-custom.iv-branding {
	display: none !important;
}



/* (new21) TEST - UNDER PLAYER - DESCRIPTION + OWNER TEASER */
ytd-watch-metadata.watch-active-metadata[description-collapsed][smaller-yt-sans-light-title] {
	position: absolute !important;
	height: 8vh !important;
	width: 99.7% !important;
	margin: 0vh 0 0 0 !important;
	bottom: 0 !important;
	z-index: 50000000 !important;
}
ytd-watch-metadata.watch-active-metadata[description-collapsed][smaller-yt-sans-light-title] #above-the-fold {
	height: 8vh !important;
}
ytd-watch-metadata.watch-active-metadata[description-collapsed][smaller-yt-sans-light-title] #above-the-fold #description-and-actions.ytd-watch-metadata {
	float: left !important;
	height: 7vh !important;
	margin: -1vh 0 0 0 !important;
}
ytd-watch-metadata.watch-active-metadata[description-collapsed][smaller-yt-sans-light-title] #owner-and-teaser.ytd-watch-metadata {
	float: right !important;
	width: 32vw !important;
	height: 8vh !important;
	margin: -2vh 0 0 0 !important;
}
ytd-watch-metadata.watch-active-metadata[description-collapsed][smaller-yt-sans-light-title] #above-the-fold h1 + ytd-badge-supported-renderer {
	float: left !important;
}



/* (new21) END SCREEN - ALL */
/* (new21) NOT EMBED */
#movie_player:not(.ytp-embed):not(.ytp-mweb-player) .html5-endscreen {
	height: 70vh !important;
	overflow: hidden;
	z-index: 34;
}
#movie_player:not(.ytp-embed):not(.ytp-mweb-player):not(.ytp-big-mode):not(.ytp-fullscreen) .ytp-endscreen-content {
	display: table !important;
	position: absolute;
	width: 59.3vw !important;
	height: 63.2vh !important;
	top: 0% !important;
	left: 0% !important;
	margin: 0 0 0 0 !important;
	padding-top: 6.5vh !important;
}

/* (new49) FULL - END SCREN */
#movie_player.html5-video-player.ytp-fit-cover-video.ytp-large-width-mode.ytp-autonav-endscreen-cancelled-state:not(.ytp-embed):not(.ytp-mweb-player) .html5-endscreen {
	height: 100vh !important;
	overflow: hidden;
	z-index: 34;
}
#movie_player.ytp-big-mode.ytp-fullscreen:not(.ytp-embed):not(.ytp-mweb-player) .ytp-endscreen-content,
.ytd-page-manager[theater-requested_] #movie_player.html5-video-player.ytp-rounded-miniplayer-not-regular-wide-video.ytp-fit-cover-video.ytp-large-width-mode.ytp-autonav-endscreen-cancelled-state:not(.ytp-embed):not(.ytp-mweb-player) .html5-endscreen .ytp-endscreen-content {
	display: table !important;
	position: absolute;
	width: 100vw !important;
	height: 83.2vh !important;
	top: 0% !important;
	left: 0% !important;
	margin: 0 0 0 0 !important;
	padding-top: 6.5vh !important;
}

/* (new21) NOT EMBED */
#movie_player:not(.ytp-embed):not(.ytp-mweb-player) .ytp-endscreen-content .ytp-videowall-still {
	position: unset !important;
	display: inline-block !important;
	width: 100% !important;
	min-width: 23.8% !important;
	max-width: 23.8% !important;
	height: 100% !important;
	min-height: 170px !important;
	max-height: 170px !important;
	margin: 3px -5px 5px 12px !important;
	overflow: hidden;
	border-radius: 5px !important;
	transform: scale(1) !important;
border: 1px solid red !important;
}
#movie_player:not(.ytp-embed):not(.ytp-mweb-player) .ytp-endscreen-content .ytp-videowall-still .ytp-videowall-still-image {
	background-size: contain !important;
	background-color: #111 !important;
}
.ytp-videowall-still-info-content {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	bottom: 0;
	padding: 18px 5px 5px 5px !important;
	opacity: 0.2 !important;
	transition: opacity 0.3s ease 0s;
color: #fff;
background-image: linear-gradient(to bottom, rgba(12, 12, 12, 0.8) 0px, transparent 100px);
}
.ytp-videowall-still-info-content:hover {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	bottom: 0;
	padding: 18px 5px 5px 5px !important;
	opacity: 1 !important;
	transition: opacity 0.3s ease 0s;
	color: #fff;
	background-image: linear-gradient(to bottom, rgba(12, 12, 12, 0.8) 0px, transparent 100px);
}
/* NO DARK */
/* (new21) END SCREEN - ALL - NOT EMBED */
html:not([dark]):not([dark="true"]):not(.style-scope) #movie_player:not(.ytp-embed):not(.ytp-mweb-player) .html5-endscreen:not(.subscribecard-endscreen) {
	background-color: white !important;
}
html:not([dark]):not([dark="true"]):not(.style-scope) #movie_player:not(.ytp-embed):not(.ytp-mweb-player) .html5-endscreen:not(.subscribecard-endscreen):hover {
	z-index: 50 !important;
}

/* (new21) END SCREEN SUGGESTION */
/* NOT EMBED ? */
#movie_player:not(.ytp-embed):not(.ytp-mweb-player) .ytp-ce-element.ytp-ce-element-show,
#movie_player:not(.ytp-embed).html5-endscreen + .ytp-ce-shadow + .ytp-ce-element.ytp-ce-element-show {
	height: 320px;
	width: 569px;
	left: 35% !important;
	top: 93px;
	border: 1px solid red !important;
}

/* PLAYER */
#primary.ytd-watch-flexy {
	min-width: 97% !important;
	max-width: 97% !important;
	padding: 0;
}

/* (new21) THEATER - INFOS BOTTOM */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy + #columns #primary.ytd-watch-flexy {
	height: 72px !important;
	min-width: 99% !important;
	max-width: 99% !important;
	margin-left: 29% !important;
	padding: 0;
}
#player-container-inner {
	padding-top: 72vh !important;
}
.ytp-cards-teaser-shown .ytp-cards-teaser .ytp-cards-teaser-text {
	max-width: 415px;
	opacity: 1;
	transition: opacity 0.165s cubic-bezier(0, 0, 0.2, 1) 0.415s;
}
#movie_player:not(.ytp-embed) .html5-video-player:not(.ytp-embed) .video-stream.html5-main-video {
	width: 99% !important;
}
.ytp-iv-video-content {
	width: 100% !important;
	top: 55px;
}

/* (new21) VIDEO PLAYER center MOVIE  for - NOT EMBED 
https://www.youtube.com/watch?v=_DsyLuxfu64
=== */
#movie_player:not(.ytp-embed) .html5-video-player:not(.ytp-embed) .video-stream.html5-main-video {
	left: 0 !important;
}

/* (new66) START ==== PROGRESSBAR VISIBLE ===== */

/* (new69) CONTROL - NOT EMBED .html5-video-player:not(.ytp-embed] */
#player:not(:has(.ytp-embed)) .html5-video-player:not(.ytp-embed) .ytp-chrome-bottom {
	width: 100% !important;
	height: 3px !important;
	left: 0px !important;
	top: 70.8vh !important;
	opacity: 1 !important;
}
/* (new68) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #player:hover .ytp-chrome-bottom {
	background-color: transparent !important;
	background-image: none !important;
}


/* TOOLTIP BOTTOM - NORMAL PLAYER
ytd-watch-flexy:not([fullscreen], [theater], .ytp-embed) .ytp-tooltip.ytp-bottom
==== */
/* TOOLTIP BOTTOM - THEATER PLAYER
ytd-watch-flexy[theater] .ytp-tooltip.ytp-bottom
==== */
/* TOOLTIP BOTTOM - FULLSREEN PLAYER
ytd-watch-flexy[fullscreen] .ytp-tooltip.ytp-bottom
==== */

/* (new68) TOOLTIP BOTTOM - NORMAL PLAYER  */
ytd-watch-flexy:not([fullscreen], [theater], .ytp-embed) .ytp-tooltip.ytp-bottom {
  max-width: 300px;
  top: 60.8vh !important;
/*background: red !important;
/*border: 1px solid red  !important;*/
}




/* (new68) ACTIVE HOVER on #player:hover */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom {
	width: 99% !important;
	height: 3.5vh !important;
	left: 5px !important;
    top: 64.8vh !important;
    margin:  0vh 0 0vh 0 !important;
	opacity: 1 !important;
/*background: red !important;*/
/*border: 1px solid red  !important;*/
}
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls {
	width: 99% !important;
	height: 3vh !important;
	left: 5px !important;
    margin:  0 0 0vh 0 !important;
	opacity: 1 !important;
/*background: peru !important;*/
/*border: 1px solid aqua  !important;*/
}


/* LEFT */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls {
    width: 40% !important;
	height: 3.4vh !important;
	left: 5px !important;
    margin:  0 0 0vh 0 !important;
    padding:  0 0 0 0 !important;
	opacity: 1 !important;
/*background: green !important;*/
/*border: 1px solid red  !important;*/
}
/*PLAY BUTTON */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls .ytp-play-button {
    display: inline-flex !important;
    width: 30px;
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin-top: 0px !important;
    padding: 0;
    border-radius: 50%;
/*border: 1px solid red  !important;*/
}
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls .ytp-play-button svg{
    width: 36px;
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin-top: -3px !important;
    padding: 3px;
    border-radius: 50%;
/*border: 1px solid red  !important;*/
}

/* VOLUME */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls span.ytp-volume-area {

    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin: 0px 0 0 30px !important;
    padding: 0;

/*border: 1px solid red  !important;*/
}
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls span.ytp-volume-area .ytp-volume-icon svg {

    min-height: 2.2vh !important;
    max-height: 2.2vh !important;
    margin: 2px 0 0 0 !important;
    padding: 3px;

/*border: 1px solid red  !important;*/
}
.ytp-delhi-modern .ytp-time-display:not(.ytp-miniplayer-ui *) {
    height: 3.4vh !important;
    padding: 0 5px !important;
}


/* RIGHT */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-right-controls {
    width: auto !important;
    max-width: 40% !important;
	height: 3.4vh !important;
    margin:  0 5px 0vh 0 !important;
    padding:  0 0 0 0 !important;
	opacity: 1 !important;
/*background: brown !important;*/
/*border: 1px solid aqua  !important;*/
}

.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button svg {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button.ytp-subtitles-button ,
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button.ytp-fullscreen-button ,
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button.ytp-settings-button{
    width: 30px !important;
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}

/* (new69) RIGHT - HIDDEN BUTTONS */
/* NO EFFECT - Regarder sur un téléviseur */
/*.ytp-remote-button.ytp-button ,*/

/* NO EFFECT - Expand Right Bottom Section */
/*.ytp-expand-right-bottom-section-button.ytp-button,*/

/* NO EFFECT - PIP */
/*.ytp-pip-button.ytp-button ,*/

/* OK - LECTURE AUTO DESACTIVE */
.ytp-button.ytp-autonav-toggle  {
  opacity: .9;
  display: inline-block !important;
  width: 48px;
  padding: 0 2px;
  -webkit-transition: opacity .1s cubic-bezier(.4,0,1,1);
  transition: opacity .1s cubic-bezier(.4,0,1,1);
  overflow: hidden;
}

/* (new69) Info BUTTON - SPONSORBLOCK - 2n button ALWAYS VISIBLE */
#infoButton.playerButton.ytp-button.autoHiding  {
    display: inline-block !important;
    width: 100% !important;
    min-width: 40px !important;
    max-width: 40px !important;
    -webkit-transition: opacity .1s cubic-bezier(.4,0,1,1);
    transition: opacity .1s cubic-bezier(.4,0,1,1);
    transform: unset !important;
    overflow: hidden;
    opacity: .9 !important;
    visibility: visible !important;
/*border: 1px solid aqua  !important;*/
}
#infoButton.playerButton.ytp-button.autoHiding img#infoImage.playerButtonImage {
    display: block !important;
    height: 70% !important;
    width: 100% !important;
    min-width: 38px !important;
    max-width: 38px !important;
    top: 0 !important;
    bottom: 0;
    margin: 0 0 0 0px !important;
    visibility: visible !important;
/*border: 1px solid lime !important;*/
}
/* PROGRESSBAR*/
#player:not(:has(.ytp-embed)):hover .ytp-hide-info-bar .ytp-progress-bar-container {
    position: absolute;
    display: inline-flex !important;
    width: 99.4%;
	bottom: 39px;
	visibility: visible;
}


/* (new20) PROGRESSBAR VISIBLE - CHROME BOTTOM - ALL */
.ytp-hide-info-bar .ytp-chrome-bottom {
	opacity: 1 !important;
	visibility: visible !important;
}
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):not(.ytp-autohide) .ytp-chrome-bottom {
	opacity: 1 !important;
	visibility: visible !important;
}
/* (new17) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope):not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-autohide) .ytp-chrome-bottom {
	background: transparent !important;
}


/* (new48) CHROME BOTTOM - ALL  */
html:not(.floater):not(.iri-always-visible) ytd-watch-flexy[flexy] #player-container.ytd-watch-flexy .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom {
	position: absolute;
	display: inline-block !important;
	width: 100% !important;
	height: 5px !important;
	bottom: 0px !important;
	left: 0 !important;
	opacity: 1 !important;
	visibility: visible !important;
	transition: all ease 0.7s !important;
background: transparent !important;
}
/* (new21) CHROME BOTTOM - ALL - HOVER*/
html:not(.floater):not(.iri-always-visible) ytd-watch-flexy[flexy] #player-container.ytd-watch-flexy .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom {
	position: absolute;
	display: inline-block !important;
	height: 3.6vh !important;
	line-height: 20px !important;
	max-width: 100% !important;
	min-width: 100% !important;
	margin: 0px !important;
	left: 0px !important;
	right: 0px !important;
	padding: 0 !important;
	bottom: 2.5vh !important;
	opacity: 1 !important;
	visibility: visible !important;
	transition: all ease 0.7s !important;
}

/* (new48) THEATER / BLEED */
html:not(.floater):not(.iri-always-visible) ytd-watch-flexy[flexy][full-bleed-player] #player-container.ytd-watch-flexy .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom {
	position: absolute;
	display: inline-block !important;
	height: 45px !important;
	line-height: 20px !important;
	max-width: 100% !important;
	min-width: 100% !important;
	margin: 0px !important;
	left: 0px !important;
	right: 0px !important;
	padding: 0 !important;
	bottom: -1vh!important;
	opacity: 1 !important;
	visibility: visible !important;
	transition: all ease 0.7s !important;
}
/* (new48) THEATER / BLEED - HOVER */
ytd-watch-flexy[full-bleed-player] .ytd-watch-flexy:not(#player-theater-container) #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-progress-bar-container + .ytp-chrome-controls {
	top: 1vh !important;
}

/* (new68) THEATER / BLEED - HOVER */


/* (new21) TEST PAUSED - NOT THEATER */
html:not(.floater):not(.iri-always-visible) ytd-watch-flexy:not([theater]):not([fullscreen]) .html5-video-player.ytp-exp-bottom-control-flexbox.ytp-large-width-mode.paused-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom {
	vertical-align: top;
	height: 35px !important;
	line-height: 28px;
	max-width: 100% !important;
	min-width: 100% !important;
	margin: 0px !important;
	left: 0px !important;
	right: 0px !important;
	padding: 0 !important;
}
html:not(.floater):not(.iri-always-visible) ytd-watch-flexy:not([theater]):not([fullscreen]) .html5-video-player.ytp-exp-bottom-control-flexbox.ytp-large-width-mode.paused-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom .ytp-chrome-controls {
	vertical-align: top;
	height: 35px;
	line-height: 28px;
	max-width: 99.7% !important;
	min-width: 99.7% !important;
	margin-top: 10px !important;
	left: 0px !important;
	right: 0 !important;
}

/* (new21) PROGRESSBAR VISIBLE - TEST CHAPTER CONTAINER */
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-player-content.ytp-iv-player-content {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}
/* (new49) PROGRESSBAR VISIBLE - CHAPTERS CONT - NOT THEATER - HOVER */
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom .ytp-chapters-container,
html:not(.floater):not(.iri-always-visible) #player.ytd-watch-flexy .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapters-container {
	display: inline-flex !important;
	width: 100% !important;
	max-width: 100% !important;
	min-width: 100% !important;
	height: 6px !important;
	height: 100%;
	top: -6px !important;
	left: 0px;
	z-index: 32;
}
.ytp-chapter-container button.ytp-chapter-title.ytp-button {
	margin-top: 8px !important;
}

/* CHAPTER-HOVER-CONTAINER - ALL */
.ytp-chapters-container .ytp-chapter-hover-container {
	max-width: 100% !important;
	height: 100%;
	left: 0;
	z-index: 32;
}
/* CHAPTER-HOVER-CONTAINER - ALL  */
html:not(.floater):not(.iri-always-visible) #player.ytd-watch-flexy:hover .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container {
	height: 100%;
	left: 0;
	z-index: 32;
}
/* CHAPTER-HOVER-CONTAINER - HOVER - ALL  */
html:not(.floater):not(.iri-always-visible) #player.ytd-watch-flexy:hover .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container,
html:not(.floater):not(.iri-always-visible) #player.ytd-watch-flexy:not(:hover) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container {
	height: 100%;
	left: 0;
	z-index: 32;
}
/* CHAPTER-HOVER-CONTAINER - last CHAPTER - ALL */
html:not(.floater):not(.iri-always-visible) #player.ytd-watch-flexy:hover .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container:last-of-type {
	/* outline: 1px solid green !important; */
}
html:not(.floater):not(.iri-always-visible) #player.ytd-watch-flexy:not(:hover) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container:last-of-type {
	/* outline: 1px solid yellow !important; */
}

/* CHAPTER-HOVER-CONTAINER - LAST - ALL */
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container:last-of-type {
	/* outline: 1px solid red !important; */
}
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container:only-of-type {
	max-width: 100% !important;
	min-width: 100% !important;
	height: 100%;
	left: 0;
	z-index: 32;
}
/* CHAPTER-HOVER-CONTAINER - PROGRESS-BER-PADDING - ALL */
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chapter-hover-container .ytp-progress-bar-padding {
	top: 0px !important;
	height: 5px !important;
}
.ytp-progress-list {
	position: relative;
	height: 100%;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
	transition: transform 0.1s cubic-bezier(0.4, 0, 1, 1) 0s;
	z-index: 39;
background: rgba(255, 255, 255, 0.2);
}

/* (new21) CONTROLS - OPACITY */
.ytp-hide-info-bar.ytp-autohide .ytp-chrome-controls {
	opacity: 0 !important;
}

/* (new58) PROGRESS BAR - ALL - not PREVIEW VIEDO not(#inline-preview-player) */
#movie_player.html5-video-player.ytp-exp-bottom-control-flexbox.ytp-hide-info-bar.ytp-autohide:not(#inline-preview-player) .ytp-progress-bar-container,
.ytp-hide-info-bar .ytp-progress-bar-container {
	position: absolute;
	display: inline-block !important;
	width: 100% !important;
	height: 5px;
	top: 0.7vh !important;
	opacity: 1 !important;
	visibility: visible !important;
background: #333 !important;
}

ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy #movie_player.html5-video-player.ytp-exp-bottom-control-flexbox.ytp-hide-info-bar.ytp-autohide:not(#inline-preview-player) .ytp-progress-bar-container {
	position: absolute !important;
	display: inline-block !important;
	width: 100% !important;
	height: 5px;
	top: 0.6vh !important;
	opacity: 1 !important;
	visibility: visible !important;
background: #333 !important;
}
/* (new48) HOVER */
html:not(.floater):not(.iri-always-visible) ytd-watch-flexy[flexy][full-bleed-player] #player-container.ytd-watch-flexy .html5-video-player.ytp-large-width-mode:hover:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-progress-bar-container {
	background: #333 none repeat scroll 0 0;
	display: inline-block;
	height: 5px;
	opacity: 1;
	position: absolute;
	top: -2px !important;
	visibility: visible;
	width: 100%;
}

/* (new49) PROGRESSBAR VISIBLE - PROGRES - NOT THEATER  */
ytd-watch-flexy:not([theater]):not([fullscreen]) .ytd-watch-flexy:not(#player-theater-container) #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-progress-bar-container {
	top: 2px !important;
}

/* (new48) PROGRESSBAR VISIBLE - PROGRES - NOT THEATER - HOVER - :not([full-bleed-player]) */
ytd-watch-flexy:not([theater]):not([fullscreen]) .ytd-watch-flexy:not(#player-theater-container) #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom .ytp-progress-bar-container {
	top: 49px !important;
}


/* (new31) fine scrubbing */
/* (new31) PROGRESSBAR Y-DRAG - PREVIEW VIDEO - FINE SCRUBBING - NORMAL :not([style="display: none;"] */
.ytp-storyboard-framepreview:not([style="display: none;"]) {
	position: absolute;
	width: 100% !important;
	left: 0;
	top: 0;
	transition: opacity 0.1s cubic-bezier(0, 0, 0.2, 1) 0s;
	object-fit: contain !important;
}
.ytp-storyboard-framepreview-img {
	width: 100% !important;
	opacity: 0.4;
}

.ytp-progress-bar-container.ytp-drag .ytp-fine-scrubbing-container[style="transform: translateY(48px); height: 90px;"] {
	position: fixed !important;
	display: inline-block !important;
	width: 59.4% !important;
	height: 95px !important;
	bottom: 33vh !important;
	left: 0.3vw !important;
	transform: translateY(48px)!important;
	overflow: hidden !important;
	z-index: 5000000 !important;
background-color: rgba(0, 0, 0, 0.44) !important;
border: 1px solid blue !important;
}
/* (new31) THEATER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) .ytp-progress-bar-container.ytp-drag .ytp-fine-scrubbing-container[style="transform: translateY(48px); height: 90px;"] {
	width: 99% !important;
	bottom: 12vh !important;
border: 1px solid green !important;
}

.ytp-progress-bar-container.ytp-drag .ytp-fine-scrubbing-container[style="transform: translateY(48px); height: 90px;"] .ytp-fine-scrubbing-play {
	position: fixed !important;
	height: 35px;
	width: 35px;
	bottom: 2vh !important;
	z-index: 5000000 !important;
}
.ytp-progress-bar-container.ytp-drag .ytp-fine-scrubbing-container[style="transform: translateY(48px); height: 90px;"] .ytp-fine-scrubbing-dismiss {
	position: fixed !important;
	height: 35px;
	width: 35px;
	bottom: 2vh !important;
	z-index: 5000000 !important;
}

/* (new49) PROGRESSBAR VISIBLE - SCRUBBER - ALL */
/* NOT OK - Not Perfect for NOT THEATER buttoo at RIGT of Progressbar */
/* OK FOR THEATER */
.ytp-chrome-bottom .ytp-scrubber-container {
	display: none !important;
	position: absolute;
	top: -2px !important;
	z-index: 43;
}
html:not(.floater):not(.iri-always-visible) ytd-watch-flexy[flexy] #player-container.ytd-watch-flexy .html5-video-player.ytp-large-width-mode:not(:hover):not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-scrubber-container {
	display: none !important;
}


/* (new31) PROGRESSBAR VISIBLE - CHROME BOTTOM - THEATER */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom {
	left: 0px !important;
	margin-left: 0 !important;
	bottom: 0!important;
	overflow: hidden !important;
}
/* (new21) PROGRESSBAR VISIBLE - CHROME BOTTOM - THEATER - HOVER */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom {
	max-width: 99.8% !important;
	min-width: 99.8% !important;
	margin-top: 0 !important;
	bottom: 0.7vh !important;
	left: 0px !important;
	overflow: visible !important;
}

/* (new33) PROGRESSBAR VISIBLE - PROGRESS BAR - THEATER - not HOVER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #player-theater-container .ytp-progress-bar-container,
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):not(:hover) .ytp-chrome-bottom .ytp-progress-bar-container {
	max-width: 99.8% !important;
	min-width: 99.8% !important;
	margin-top: 0px !important;
	top: 0.4vh !important;
	left: 0px !important;
}

/* (new21) PROGRESSBAR VISIBLE - PROGRESS - THEATER - HOVER */
ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container.ytd-watch-flexy #player-container .html5-video-player.ytp-large-width-mode:not(.ytp-embed):not(.ytp-small-mode):not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom .ytp-progress-bar-container {
	max-width: 99.8% !important;
	min-width: 99.8% !important;
	margin-top: 0px !important;
	top: 42px !important;
	left: 0px !important;
}
/* (new2) CHAPTER-CONTAINER-DISABLED - PB WITH CHAPTER :
https://www.youtube.com/watch?v=RIgBsz1MduI
=== */
.ytp-big-mode .ytp-chapter-title.ytp-button.ytp-chapter-container-disabled,
.ytp-chapter-title.ytp-button.ytp-chapter-container-disabled {
	display: none !important;
}
#player .ytp-progress-bar-container:not([aria-disabled="true"]) {
	height: 5px;
	margin-top: 0;
	top: 0px;
	opacity: 1 !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #player .ytp-progress-bar-container:not([aria-disabled="true"]) {
	background-color: #DCDADA;
}

/* (new31) CONTROLS BAR - ALL BUTTONS - ALL (VOIR THEATER) */
#player-container #movie_player.html5-video-player .ytp-chrome-bottom .ytp-chrome-controls {
	vertical-align: top !important;
	max-width: 1155px !important;
	height: 35px !important;
	line-height: 28px !important;
	margin-top: 5px !important;
	opacity: 0.2 !important;
	pointer-events: none !important;
}
/*  (new31) HOVER */
#player-container #movie_player.html5-video-player:hover .ytp-chrome-bottom .ytp-chrome-controls {
	vertical-align: top !important;
	max-width: 1155px !important;
	height: 35px !important;
	line-height: 28px !important;
	margin-top: -3px !important;
	opacity: 1 !important;
	pointer-events: auto !important;
	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==") !important;
	background-position: center bottom !important;
	background-repeat: repeat-x !important;
}
.ytp-gradient-top,
.ytp-gradient-bottom {
	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==");
	background-repeat: repeat-x;
	pointer-events: none;
	position: absolute;
	transition: opacity 0.25s cubic-bezier(0, 0, 0.2, 1) 0s;
	width: 100%;
}

/* (new48) CONTROLS BAR - ALL BUTTONS - THEATER  */
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #player-container #movie_player.html5-video-player .ytp-chrome-bottom .ytp-chrome-controls {
	max-width: 100%!important;
}
ytd-watch-flexy[theater]:not([fullscreen]):not(.parentToothbrush) #player-container #movie_player.html5-video-player:hover .ytp-chrome-bottom .ytp-chrome-controls {
	max-width: 100% !important;
}

.ytp-larger-tap-buttons .ytp-chrome-controls .ytp-button {
	padding: 0 !important;
}

/* (new21) CONTROLS - OPACITY? - AGAINST BUTTONS FLINKERING on HOVER */
.ytp-chrome-controls,
.ytp-hide-info-bar.ytp-autohide .ytp-chrome-controls {
	position: absolute !important;
	display: inline-block !important;
	width: 99.8% !important;
	z-index: 50000000 !important;
}


/* (new21) CONTROLS BAR - TIME */
.ytp-time-display.notranslate > span {
	height: 100% !important;
	min-height: 30px !important;
	max-height: 30px !important;
	line-height: 35px !important;
	margin: 0px 0 0px 0 !important;
	font-size: 20px !important;
}
.ytp-larger-tap-buttons .ytp-time-display {
	display: inline-block;
	vertical-align: top;
	line-height: 27px !important;
	padding: 0 5px;
	font-size: 109%;
	white-space: nowrap;
}

/* (new21) CONTROLS BAR - BUTTON ICONS / SPONSORBLOCK -  BUTTONS */
.playerButtonImage {
	max-height: 100% !important;
}
#startSegmentButton .playerButtonImage {
	max-height: 100% !important;
}

/* (new21) CONTROLS BAR - BUTTONS - TOOLTIPS */
.ytp-chrome-top .ytp-button,
.ytp-chrome-controls .ytp-button[aria-expanded="true"],
.ytp-chrome-controls .ytp-button[aria-pressed="true"],
.ytp-replay-button {
	opacity: 1 !important;
	transition: opacity 0.1s cubic-bezier(0, 0, 0.2, 1) 0s;
	color: gold !important;
}

/* END ==== PROGRESSBAR VISIBLE ===== */


/* (new21) PLAYER SOUS TITRES + TRANSLATION - ALL */
.caption-window.ytp-caption-window-bottom .captions-text {
	display: inline-block;
	width: 100% !important;
	left: 0 !important;
	text-align: center !important;
}
.html5-video-player:not(.ytp-embed) .caption-visual-line .ytp-caption-segment {
	background: transparent !important;
}

/* (new26) PLAYER - CAPTION - NOT HOVER - ALL */
.caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup,
.caption-window.ytp-caption-window-bottom {
	width: 100% !important;
	left: 1px !important;
	margin-left: 0 !important;
	margin-bottom: -5px !important;
	text-align: center !important;
	overflow: hidden;
}
.caption-window.ytp-caption-window-bottom.ytp-caption-window-rollup,
.caption-window.ytp-caption-window-bottom {
	display: inline-block;
	width: 100% !important;
	left: 1px !important;
	margin-bottom: 0px !important;
	margin-left: 0!important;
}
/* (new26) */
.html5-video-player .ytp-caption-window-container .caption-visual-line .ytp-caption-segment:first-child,
.html5-video-player .ytp-caption-window-container .caption-visual-line .ytp-caption-segment:last-child {
	min-width: 60% !important;
	max-width: 60% !important;
	text-align: center !important;
	font-size: 20.6889px !important;
color: white !important;
background: rgba(0, 0, 0, 0.54) !important;
}

/* (new21) CAPTION - PLAYER - HOVER - ALL (NOT CHANNEL PLAYER) */
#player-container:not(.ytd-channel-video-player-renderer):hover .caption-window.ytp-caption-window-bottom {
	left: 0 !important;
	margin-bottom: 43px !important;
}
/* CAPTION - PLAYER + CAPTION - HOVER */
#player-container:not(.ytd-channel-video-player-renderer):hover .caption-window.ytp-caption-window-bottom:hover {
	margin-bottom: 43px !important;
}

/* (new21) CAPTION - THEATER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) .caption-window.ytp-caption-window-bottom {
	bottom: 8%;
	left: 50%;
	margin-left: -552.5px;
	text-align: center;
	touch-action: none;
	width: 1105px;
	min-height: 112px !important;
}
/* (new21) CAPTION - THEATER - PLAY */
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #movie_player.html5-video-player.ytp-hide-info-bar.playing-mode .caption-window.ytp-caption-window-bottom {
	bottom: 7% !important;
	left: 50%;
	margin-left: -552.5px;
	text-align: center;
	touch-action: none;
	width: 1105px;
	min-height: 75px !important;
}
/* (new21) CAPTION - THEATER - PLAY + hover*/
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #movie_player.html5-video-player.playing-mode:hover .caption-window.ytp-caption-window-bottom {
	min-height: 75px !important;
	bottom: 5% !important;
}
/* (new21) CAPTION - THEATER - PAUSED */
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #movie_player.html5-video-player.paused-mode.ytp-hide-info-bar .caption-window.ytp-caption-window-bottom {
	min-height: 75px !important;
	bottom: 5% !important;
}
/* (new21) CAPTION - THEATER - PAUSED + HOVER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #movie_player.html5-video-player.paused-mode:hover .caption-window.ytp-caption-window-bottom {
	min-height: 75px !important;
	bottom: 5% !important;
}

/* (new21) CAPTION - THEATER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) .caption-window.ytp-caption-window-bottom .caption-visual-line .ytp-caption-segment:last-child {
	height: auto !important;
	min-width: 60% !important;
	max-width: 60% !important;
	text-align: center !important;
	color: white !important;
background: rgba(0, 0, 0, 0.44) !important;
}

/* (new21) CAPTION - THEATER - HOVER */
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #player-container:hover .caption-window.ytp-caption-window-bottom:hover,
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #player-container:hover .caption-window.ytp-caption-window-bottom,
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #player-container:hover .caption-window.ytp-caption-window-bottom {
	left: 0 !important;
	margin-bottom: 60px !important;
}


/* (new21) GM "Youtube subtitles under video frame" - THEATER */
/*ytd-watch-flexy[theater]:not([fullscreen]) #ytp-caption-window-container #caption-window-1.ytp-caption-window-bottom span.captions-text*/
ytd-watch-flexy[theater]:not([fullscreen]):not(.ytp-embed) #ytp-caption-window-container #caption-window-1.ytp-caption-window-bottom {
    position: fixed !important;
	display: inline-block !important;
	width: 99.7% !important;
    height: 10vh !important;
	left: 0 !important;
	margin-left: 0;
    top: unset !important;
	bottom: 0vh !important;
	text-align: center !important;
	overflow: hidden;
    z-index: 5000000000 !important;
/*border: 1px solid pink !important;*/
}
/* (new68) TEST - GM "Youtube subtitles under video frame" - FULLSCREEN */
ytd-watch-flexy[fullscreen]:not([theater]):not(.ytp-embed) #ytp-caption-window-container #caption-window-1.ytp-caption-window-bottom {
    position: fixed !important;
	display: inline-block !important;
	width: 99.7% !important;
    height: 7vh !important;
	left: 0 !important;
	margin-left: 0;
    top: unset !important;
	bottom: 3vh !important;
	text-align: center !important;
	overflow: hidden;
    z-index: 5000000000 !important;
border: 1px dashed pink !important;
}

/* (new68) FULLSCREEN - CAPT - PLAY  - */
/*ytd-watch-flexy[fullscreen]:not(.ytp-embed) #movie_player.html5-video-player.ytp-fullscreen.ytp-big-mode.playing-mode #caption-window-1 {
	min-height: 136px !important;
	width: 99.7vw !important;
	left: 0% !important;
	bottom: 0 !important;
	text-align: left;
border: 1px solid red !important;
}*/

/* (new68) FULLSCREEN - CAPT - PLAY - HOVER */
/*ytd-watch-flexy[fullscreen]:not(.ytp-embed) #movie_player.html5-video-player.ytp-fullscreen.ytp-big-mode.playing-mode.ytp-autohide #caption-window-1 {
	border: 1px solid yellow !important;
}*/

/* (new21) FULLSCREEN - CAPT - PAUSED - */
/*ytd-watch-flexy[fullscreen]:not(.ytp-embed) #movie_player.html5-video-player.ytp-fullscreen.ytp-big-mode.paused-mode #caption-window-1 {
	min-height: 136px !important;
	width: 99.7vw !important;
	left: 21.2%;
	bottom: 7%;
	text-align: left;
border: 1px solid red !important;
}*/


/* FULLSCREEN - CONTAINER FULL - ALL  */
.no-scroll > ytd-app[style^="--ytd-app-fullerscreen-scrollbar-width:12px;"][scrolling] {
	right: 0 !important;
}
ytd-watch-flexy[fullscreen] .annotation.annotation-type-custom.iv-branding {
	display: none !important;
}

/* (new42) - FULL - INDICATOR TO SEE MORE DETAILS (under player) - SUPP  */
.ytp-big-mode .ytp-chrome-controls .ytp-fullerscreen-edu-button.ytp-button {
	position: absolute;
	width: 40%;
	left: 50% !important;
	bottom: -2vh !important;
	text-align: center;
	transform: translateX(-50%) !important;
	transition: opacity 0.25s cubic-bezier(0, 0, 0.2, 1) 0s;
}
.ytp-big-mode .ytp-chrome-controls .ytp-fullerscreen-edu-button.ytp-button {
	display: none !important;
}




/* (new56) INFOS UNDER PLAYER - NEW DESIGN - NOT TABVIEW  */
html:not([plugin-tabview-youtube]) #below ytd-watch-metadata #description.ytd-watch-metadata ,
html:not([plugin-tabview-youtube]) ytd-watch-metadata #description.ytd-watch-metadata,
html:not([plugin-tabview-youtube]) #meta-contents #container.ytd-video-secondary-info-renderer {
	position: fixed !important;
	display: inline-block !important;
	width: 39%;
	min-height: 190px;
	top: 85px;
	left: 60% !important;
	padding: 0 5px;
	overflow: hidden;
	border-radius: 0 0 5px 5px !important;
	z-index: 500000 !important;
	visibility: hidden !important;
border-bottom: 4px solid red;
border-right: 5px solid red;
border-left: 5px solid red;
background-color: #333 !important;
}
/* (new56) HOVER */
html:not([plugin-tabview-youtube]) #below ytd-watch-metadata #description.ytd-watch-metadata:hover ,
html:not([plugin-tabview-youtube]) ytd-watch-metadata #description.ytd-watch-metadata:hover,
html:not([plugin-tabview-youtube]) #meta-contents #container.ytd-video-secondary-info-renderer:hover {
	visibility: visible !important;
}

/* (new34) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope):not([plugin-tabview-youtube]) ytd-watch-metadata #description.ytd-watch-metadata,
html:not([dark]):not([dark="true"]):not(.style-scope):not([plugin-tabview-youtube]) #meta-contents #container.ytd-video-secondary-info-renderer {
	border-top: 1px solid red !important;
	background-color: white !important;
}

/*  (new49) */
/* ytd-rich-list-header-renderer[is-modern-sd] #title.ytd-rich-list-header-renderer  , */
.ytd-video-secondary-info-renderer.ytd-video-secondary-info-renderer[inline-structured-description] #items ytd-horizontal-card-list-renderer #header-container h2 ytd-rich-list-header-renderer.ytd-horizontal-card-list-renderer .title-row #title-text {
	display: inline-block !important;
	height: 3.5vh !important;
	line-height: 0.5vh !important;
	font-size: 1rem !important;
}
/* ytd-text-inline-expander ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer  */
#shelf-container.ytd-horizontal-card-list-renderer {
	height: 23vh !important;
}
#scroll-container.ytd-horizontal-card-list-renderer {
	height: 23vh !important;
}

ytd-rich-list-header-renderer[is-modern-sd] #title.ytd-rich-list-header-renderer {
	display: inline-block !important;
	max-height: 2.5vh !important;
	font-size: 1.7rem;
	overflow: hidden;
}

/* (new36) INFOS OWNER cf [description-collapsed] - NO TABVIEW */
html:not([plugin-tabview-youtube]) ytd-watch-metadata[description-collapsed] #description-and-actions.ytd-watch-metadata,
html:not([plugin-tabview-youtube]) ytd-watch-metadata #description-and-actions.ytd-watch-metadata {
	display: inline-block !important;
	flex-flow: unset !important;
	justify-content: unset !important;
}
html:not([plugin-tabview-youtube]) ytd-watch-metadata #description.ytd-watch-metadata {
	position: fixed !important;
	display: inline-block !important;
	flex: unset !important;
	min-width: 39% !important;
	width: 39% !important;
	min-height: 190px;
	top: 72px !important;
	left: 60% !important;
	padding: 0 5px !important;
	overflow: hidden !important;
	border-radius: 0 0 5px 5px !important;
	z-index: 500 !important;
	visibility: hidden;
border-bottom: 4px solid red;
border-right: 5px solid red;
border-left: 5px solid red;
background-color: #333;
}
/* (new49) INFOS OWNER cf [description-collapsed] - TABVIEW */
html[plugin-tabview-youtube] ytd-watch-metadata[description-collapsed] #description-and-actions.ytd-watch-metadata,
html[plugin-tabview-youtube] ytd-watch-metadata #description-and-actions.ytd-watch-metadata {
	display: inline-block !important;
	flex-flow: unset !important;
	justify-content: unset !important;
}
/* (new65) UNDER PLAYER - BOTTOM INFOS - INFOS DESCRIPTION - TAB - TABVIEW  cf TAB DESCRIPTION - [tyt-tab] DISPLAY NONE*/
html[plugin-tabview-youtube] ytd-watch-flexy.ytd-page-manager[tyt-tab] #columns.ytd-watch-flexy #below ytd-watch-metadata.watch-active-metadata[flex-menu-enabled] #above-the-fold.ytd-watch-metadata #bottom-row.ytd-watch-metadata {
	display: none !important
}
html[plugin-tabview-youtube] ytd-watch-flexy.ytd-page-manager[tyt-tab="#tab-info"] #columns.ytd-watch-flexy #below ytd-watch-metadata.watch-active-metadata[flex-menu-enabled] #above-the-fold.ytd-watch-metadata #bottom-row.ytd-watch-metadata#bottom-row {
	position: fixed !important;
	display: inline-block !important;
    height: 0 !important;
	min-width: 40% !important;
	width: 39.5% !important;
	top: 8.9vh !important;
	left: 60% !important;
	padding: 0 0px !important;
	overflow: hidden !important;
	border-radius: 0 0 5px 5px !important;
	z-index: 0 !important;
/*background: green !important;*/
}


html[plugin-tabview-youtube] ytd-watch-flexy.ytd-page-manager[tyt-tab="#tab-info"] #columns.ytd-watch-flexy #below ytd-watch-metadata.watch-active-metadata[flex-menu-enabled] #above-the-fold.ytd-watch-metadata #bottom-row.ytd-watch-metadata#bottom-row ytd-text-inline-expander #expanded ,

html[plugin-tabview-youtube] ytd-watch-flexy.ytd-page-manager[tyt-tab="#tab-info"] #columns.ytd-watch-flexy #below ytd-watch-metadata.watch-active-metadata[flex-menu-enabled] #above-the-fold.ytd-watch-metadata #bottom-row.ytd-watch-metadata#bottom-row ytd-text-inline-expander ,

html[plugin-tabview-youtube] ytd-watch-flexy.ytd-page-manager[tyt-tab="#tab-info"] #columns.ytd-watch-flexy #below ytd-watch-metadata.watch-active-metadata[flex-menu-enabled] #above-the-fold.ytd-watch-metadata #bottom-row.ytd-watch-metadata#bottom-row ytd-text-inline-expander ytd-structured-description-content-renderer {
    display: inline-block !important;
    min-height: 0 !important;
    max-height: 0 !important;
background: green !important;
}

/* (new68) GM TABVIEW - DESCRIPT - MUSIC */
html[plugin-tabview-youtube] #tab-info #description ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer {
    display: inline-block !important;
    width: 100% !important;
    height: 9vh !important;
    margin: -2vh 0 0vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: green !important;*/
border-top: 1px solid red !important;
}
html[plugin-tabview-youtube] #tab-info #description ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer #shelf-container {
    display: inline-block !important;
    width: 100% !important;
    height: 23vh !important;
    margin: 0.5vh 0 -8vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: brown !important;*/
border-bottom: 1px solid red !important;
}
#tab-info #description ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer #shelf-container #scroll-container {
    display: inline-block !important;
    width: 99% !important;
    height: 18vh !important;
    margin: -3.1vh 0 0vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: peru !important;*/
}
html[plugin-tabview-youtube] #tab-info #description ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer #shelf-container #items  {
    display: inline-block !important;
    width: 100% !important;
    height: 14vh !important;
    margin: -2vh 0 0vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: peru !important;*/
}

#tab-info #description ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer #footer-section {
    display: inline-block !important;
    width: 99% !important;
    height: 4vh !important;
    margin: -4vh 0 4vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: green !important;
border: 1px solid red !important;-*/
}


/* (new68) GM TABVIEW - DESCRIPT - TRANSCRIPTION BUTTON */
html[plugin-tabview-youtube] ytd-video-description-transcript-section-renderer {
    display: inline-block !important;
    width: 100% !important;
    height: 11vh !important;
    margin: -4vh 0 0vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: green !important;*/
}

html[plugin-tabview-youtube] ytd-video-description-transcript-section-renderer #header {
    display: inline-block !important;
    width: 99% !important;
    height: 3vh !important;
    margin: -1vh 0 0vh 0 !important;
	color: silver !important;
/*background: brown !important;
border: 1px solid red !important;*/
}
html[plugin-tabview-youtube] ytd-video-description-transcript-section-renderer #header #title.ytd-video-description-transcript-section-renderer {
    position: relative !important;
    display: inline-block !important;
    width: 100% !important;
    height: 3vh !important;
    top: -3.5vh !important;
    margin: 0vh 0 0 0 !important;
	color: silver !important;
/*background: brown !important;
border: 1px solid red !important;*/
}

html[plugin-tabview-youtube] ytd-video-description-transcript-section-renderer #header + #sub-header {
    position: relative !important;
    display: inline-block !important;
    width: 99% !important;
    height: 2vh !important;
    top: -3.5vh !important;
    margin: 0vh 0 0 0 !important;
	color: silver !important;
/*background: olive !important;
border: 1px solid aqua !important;*/
}
html[plugin-tabview-youtube] ytd-video-description-transcript-section-renderer #header + #sub-header #sub-header-text {
    position: relative !important;
    display: inline-block !important;
    width: 100% !important;
    height: 2vh !important;
    top: -3.4vh !important;
    margin: 0vh 0 0 0 !important;
	color: silver !important;
/*background: brown !important;
border: 1px solid aqua !important;*/
}

html[plugin-tabview-youtube] ytd-video-description-transcript-section-renderer #header + #sub-header + #button-container {
    display: inline-block !important;
    width: 99% !important;
    height: 0vh !important;
    margin: -7.5vh 0 0vh 0 !important;
	color: silver !important;
/*background: brown !important;
border: 1px solid red !important;*/
}
html[plugin-tabview-youtube] ytd-video-description-transcript-section-renderer #header + #sub-header + #button-container #primary-button{
    position: relative !important;
    display: inline-block !important;
    width: 100% !important;
    height: 4vh !important;
    top: -4.3vh !important;
    margin: 0vh 0 0 0 !important;
	color: silver !important;
/*background: brown !important;
border: 1px solid aqua !important;*/
}


/* (new68) GM TABVIEW - DESCRIPT - INFOS CARD */
html[plugin-tabview-youtube] ytd-expander.ytd-video-secondary-info-renderer #items ytd-video-description-infocards-section-renderer {
    display: inline-block !important;
    width: 100% !important;
    height: 6vh !important;
    margin: -4vh 0 0vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: green !important;*/
border-top: 1px solid red !important;
border-bottom: 1px solid red !important;
}

html[plugin-tabview-youtube] ytd-expander.ytd-video-secondary-info-renderer #items ytd-video-description-infocards-section-renderer #header-text {
    display: inline-block !important;
    width: 90% !important;
    height: 5.5vh !important;
    margin: 0vh 0 -4vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: olive !important;
border-top: 1px solid red !important;
border-bottom: 1px solid red !important;*/
}
ytd-expander.ytd-video-secondary-info-renderer #items ytd-video-description-infocards-section-renderer #header-text h3#title {
    display: inline-block !important;
    width: 80% !important;
    height: 6vh !important;
    margin: -1.5vh 0 1vh 0 !important;
    padding: 0 !important;
	color: silver !important;
/*background: green !important*/;
/*border-top: 1px solid red !important;*/
border-bottom: 1px solid silver !important;
}

.yt-video-attribute-view-model__title {
	color: silver !important;
}


/* NOT DARK */
html[plugin-tabview-youtube]:not([dark]):not([dark="true"]):not(.style-scope) #columns.ytd-watch-flexy #primary #primary-inner.ytd-watch-flexy .watch-active-metadata.ytd-watch-flexy #above-the-fold #bottom-row .ytd-watch-metadata#description-inner,
html[plugin-tabview-youtube]:not([dark]):not([dark="true"]):not(.style-scope) ytd-watch-metadata.watch-active-metadata #description.ytd-watch-metadata {
	background-color: white !important;
}
/* DARK */
html[plugin-tabview-youtube]:not([dark]):not([dark="true"]) .yt-video-attribute-view-model__title {
	color: black !important;
}

/* ytd-watch-flexy #right-tabs .tab-content-cld.tab-content-hidden */
html[plugin-tabview-youtube] ytd-watch-metadata #description.ytd-watch-metadata:before {
	content: "🔻" !important;
	position: fixed !important;
	display: inline-block !important;
	top: 6.5vh !important;
	z-index: 5000000 !important;
	visibility: visible !important;
}
/* html[plugin-tabview-youtube] ytd-watch-metadata #description.ytd-watch-metadata:hover {
    visibility: visible !important;
background: #111 !important;
} */
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #meta-contents #container.ytd-video-secondary-info-renderer {
	background-color: white !important;
}
/* (new25) */
ytd-watch-metadata #description.ytd-watch-metadata:hover,
#meta-contents #container.ytd-video-secondary-info-renderer:hover {
	max-height: 90vh !important;
	visibility: visible !important;
	overflow-y: auto !important;
	z-index: 5000000 !important;
/* border-top: 1px solid red !important; */
}
#top-row.ytd-video-secondary-info-renderer {
	display: flex;
	flex-direction: row;
	margin-bottom: 5px;
	padding-top: 5px;
	border-radius: 5px !important;
/* background: aqua !important; */
}
ytd-text-inline-expander#description-inline-expander {
	display: inline-block !important;
	flex-direction: unset !important;
	width: 100% !important;
	min-width: 100% !important;
	max-width: 100% !important;
	height: 100% !important;
	min-height: 180px !important;
	max-height: 85vh !important;
	margin-bottom: 5px;
	top: 0 !important;
	padding: 0 !important;
	overflow: hidden !important;
	overflow-y: auto !important;
/* background: #111 !important; */
}
ytd-text-inline-expander#description-inline-expander #snippet.ytd-text-inline-expander:not([hidden]) {
	display: inline-block !important;
	mask-image: unset !important;
	max-height: 80vh !important;
	overflow: hidden !important;
	white-space: pre-wrap !important;
}
ytd-video-secondary-info-renderer {
	border: none;
}
ytd-expander.ytd-video-secondary-info-renderer #description .content.ytd-video-secondary-info-renderer {
	display: inline-block;
	width: 100%;
/* background: #111 none repeat scroll 0 0; */
}

/* (new56) SUMMARRY UNDER PLAYER */
#below #expandable-metadata.ytd-watch-flexy:not(:empty) {
    position: absolute !important;
	margin: 6vh 0 0 0 !important;
    /*background: red !important;*/
}
#below #expandable-metadata.ytd-watch-flexy:not(:empty) [is-expanded] #menu {
    position: absolute !important;
    display: inline-block !important;
    right: 100px !important;
}
/* (new56) NOT DARK - SUMMARY EXPANDALE - OPEN */
html:not([dark]) #below #expandable-metadata.ytd-watch-flexy:not(:empty) [is-expanded] {
    margin: -6vh 0 0 0 !important;
    background: white !important;
}
html:not([dark]) #below #expandable-metadata.ytd-watch-flexy:not(:empty) .video-summary-content-view-model-wiz span {
	color: #111 !important;
}

/* (new56) DARK - SUMMARY EXPANDALE - OPEN */
[dark] #below #expandable-metadata.ytd-watch-flexy:not(:empty) [is-expanded] {
    background: #222 !important;
}



/* NOT DARK - BUTTONS - ALL */
html:not([dark]) .yt-spec-touch-feedback-shape {
    color: red !important;
	/*background-color: #D5D5D57A !important;*/
    background: transparent !important;
    border: 1px solid #C0C0C03D  !important;
}
html:not([dark]) ytd-watch-flexy #primary.ytd-watch-flexy #menu ytd-menu-renderer .smartimation__content .yt-spec-button-shape-next--size-m .yt-spec-button-shape-next__icon yt-icon-shape div {
    fill: #111 !important;
    /*background: #222 !important;*/
}
html:not([dark]) .yt-spec-button-shape-next__button-text-content ,
html:not([dark]) .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
  color: #111 !important;
  background-color: rgba(255,255,255,0.1);
}

html:not([dark]) yt-icon , 
html:not([dark]) .yt-icon-container.yt-icon  {


}
html:not([dark]) yt-icon div, 
html:not([dark]) .yt-icon-container.yt-icon div {
	stroke: #111 !important;
    fill: #111 !important;
}



/* (new53) TXT COLOR FOR DARK */
html[dark] ytd-text-inline-expander#description-inline-expander #snippet.ytd-text-inline-expander:not([hidden]) .yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap .yt-core-attributed-string--link-inherit-color,
html[dark] .yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap .yt-core-attributed-string--link-inherit-color,
html[dark] .yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap {
	color: white !important;
}
html[dark] .yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap .yt-core-attributed-string--link-inherit-color a {
	color: peru !important;
}
html[dark] .yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap .yt-core-attributed-string--link-inherit-color a:visited {
	color: tomato !important;
}
/* (new53) */
html[dark] .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline {
	border-color: #333 !important;
	color: peru !important;
background: #222 !important;
}


ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer #header.ytd-video-description-infocards-section-renderer #header-text #subtitle.ytd-video-description-infocards-section-renderer {
	position: relative !important;
	display: inline-block !important;
	width: 100% !important;
	height: 15px !important;
	line-height: 5px !important;
	top: -20px !important;
	left: 0 !important;
	margin: -20px 0 0 0 !important;
	font-size: 12px !important;
	text-align: left !important;
	overflow: visible !important;
}
html[dark] ytd-structured-description-content-renderer.ytd-video-secondary-info-renderer #header.ytd-video-description-infocards-section-renderer #header-text #subtitle.ytd-video-description-infocards-section-renderer {
	color: white !important;
/* background: red !important; */
}


/* (new21) INFOS  - NEW DESIGN */
.content.ytd-video-secondary-info-renderer,
#above-the-fold.ytd-watch-metadata #description-and-actions.ytd-watch-metadata #snippet-text.ytd-text-inline-expander yt-formatted-string#formatted-snippet-text span.yt-formatted-string,
#above-the-fold.ytd-watch-metadata #description-and-actions #description.ytd-watch-metadata span.yt-formatted-string {
	line-height: 15px !important;
	font-size: 15px !important;
}
/* (new21) When EXPANDED */
#above-the-fold.ytd-watch-metadata #description-and-actions #description.ytd-watch-metadata span.yt-formatted-string:first-of-type {
	color: gold !important;
}

/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #description .yt-simple-endpoint.yt-formatted-string,
html:not([dark]):not([dark="true"]):not(.style-scope) #description .yt-formatted-string[style="color: rgb(170, 170, 170);"] {
	background-color: transparent !important;
}

/* (new56) - INFOS - NOT TABVIEW */
html:not([plugin-tabview-youtube]) #bottom-row ,
html:not([plugin-tabview-youtube]) #below #bottom-row.ytd-watch-metadata {
	position: fixed;
	display: inline-block;
/*    width: 60% !important;*/
    height: 0vh !important;
    top: 7.4vh !important;
    right: 0 !important;
    margin: 0 0 0 0 !important;
    /*overflow: hidden !important;*/
    z-index: 5000 !important;
/*background-color: red !important;*/
}
/*html:not([plugin-tabview-youtube]) #bottom-row:before ,*/
html:not([plugin-tabview-youtube]) ytd-watch-metadata #description.ytd-watch-metadata:before,
html:not([plugin-tabview-youtube]) #meta-contents #container.ytd-video-secondary-info-renderer:before {
	content: "Infos ▼";
	position: fixed;
	display: inline-block;
	width: 100px;
	height: 21px !important;
	line-height: 21px;
	margin: 0px 0 0 -7px !important;
	top: 6.4vh !important;
	padding: 1px 5px;
	border-radius: 3px 3px 0 0;
	text-align: center !important;
	z-index: 5000 !important;
	visibility: visible;
color: gray !important;
border-bottom: 1px solid #333 !important;
border-left: 5px solid #333 !important;
border-right: 5px solid #333 !important;
border-top: 1px solid #333 !important;
background-color: #222 !important;
}

/* (new17) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #meta-contents #container.ytd-video-secondary-info-renderer:before {
	border-top: 1px solid #E7E7E7 !important;
	border-bottom: 1px solid #E7E7E7 !important;
	border-right: 5px solid #E7E7E7 !important;
	border-left: 5px solid #E7E7E7 !important;
	background-color: white !important;
}

/* (new41) INFOS - NEW DESIGN */
ytd-watch-metadata #description.ytd-watch-metadata:hover:before,
#meta-contents #container.ytd-video-secondary-info-renderer:hover:before {
	font-size: 15px !important;
	text-align: center !important;
color: white !important;
border: none !important;
border-top: 3px solid transparent !important;
border-bottom: 1px solid red !important;
background-color: #333 !important;
}
/* (new21) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #meta-contents #container.ytd-video-secondary-info-renderer:hover:before {
	color: white !important;
border-bottom: 1px solid #999 !important;
border-top: 5px solid #999 !important;
border-left: 5px solid #999 !important;
border-right: 5px solid #999 !important;
background-color: #999 !important;
}
/* (new21) */
.ytd-video-secondary-info-renderer[style="--ytd-expander-collapsed-height:60px;"] {
	display: inline-block !important;
	width: 100% !important;
	max-width: 98% !important;
	height: auto !important;
	max-height: 82vh !important;
	margin-left: 0 !important;
	padding: 5px !important;
	border-radius: 5px;
	overflow: hidden !important;
	overflow-y: auto !important;
background-color: #222 !important;
}
.more-button.ytd-video-secondary-info-renderer,
.less-button.ytd-video-secondary-info-renderer {
	display: inline-block;
	line-height: 1.8rem;
	margin: 8px 0 0 20px !important;
	padding: 5px !important;
	border-radius: 5px !important;
	font-size: 1.2rem;
	text-transform: uppercase;
	opacity: 0.5 !important;
	transition: opacity ease 0.7s !important;
}
.more-button.ytd-video-secondary-info-renderer:hover,
.less-button.ytd-video-secondary-info-renderer:hover {
	transition: opacity ease 0.7s !important;
	opacity: 1 !important;
}
.more-button.ytd-video-secondary-info-renderer {
	background: green !important;
}
.less-button.ytd-video-secondary-info-renderer {
	background: red !important;
}

/* (new36) INFOS - EXPANDER - MORE - :not([style="overflow: hidden; max-height: 6rem;"]) /  :not([hidden]) */
ytd-watch-metadata #description.ytd-watch-metadata:hover yt-formatted-string[split-lines] + #snippet + tp-yt-paper-button#expand:not([hidden]) {
	position: fixed !important;
	height: 100% !important;
	min-height: 20px !important;
	max-height: 20px !important;
	line-height: 2rem;
	width: 100% !important;
	min-width: 135px !important;
	max-width: 135px !important;
	bottom: 88.5vh !important;
	right: 0;
	left: 91.5vw !important;
	margin: 0;
	padding: 0 4px;
	text-transform: none;
	white-space: pre;
	visibility: visible !important;
	z-index: 5000000 !important;
background: red !important;
}

/* (new36) BUTTON - LESS */
yt-formatted-string[split-lines] {
	white-space: pre-wrap;
}
#description tp-yt-paper-button#collapse {
	position: fixed !important;
	line-height: 2rem;
	height: 20px !important;
	min-width: 45px !important;
	bottom: 88.5vh !important;
	right: 30px !important;
	margin: 0;
	padding: 0 4px;
	text-transform: none;
	white-space: pre;
background: green !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) .ytd-video-secondary-info-renderer[style="--ytd-expander-collapsed-height:60px;"] {
	background-color: white !important;
}

/* (new58) MINI PLAYER ==== */
.miniplayer.ytd-miniplayer {

    padding: 2vh 5px 5px 5px !important;
    border-radius: 5px 5px !important;
background: green !important;
}
.ytp-miniplayer-ui {
    position:absolute;
    height:100%;
    width:100%;
    top:0;
    z-index:67;

}

/* (new58) PROGRESS BAR - MINI PLAYER */
#movie_player.html5-video-player.ytp-player-minimized.ytp-small-mode .ytp-tooltip.ytp-bottom + .ytp-progress-bar-container {
	position: absolute;
	width: 100% !important;
	height: 5px;
	top: 322px!important;
	opacity: 1 !important;
	visibility: visible !important;
background: #333 !important;
}
#movie_player.html5-video-player.ytp-player-minimized.ytp-small-mode.playing-mode .ytp-tooltip.ytp-bottom + .ytp-progress-bar-container{
	position: absolute;
	width: 100% !important;
	height: 5px;
	top: -1vh !important;
	opacity: 1 !important;
	visibility: visible !important;
background: red !important;
}
/* (new48) MINI PLAYER - TITLE*/
#info-bar.ytd-miniplayer .title.ytd-miniplayer a {
	color: gold !important;
}
/* (new48) NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #info-bar.ytd-miniplayer .title.ytd-miniplayer a {
	color: red !important;
}

/* ===== (new58) A VOIR ===== */
#vidprogress {
	display: none !important;
}

/* CHANNEL PAGES */
/* CHANNEL PLAYER */
ytd-channel-video-player-renderer #c4-player.html5-video-player .html5-video-container {
	height: 21vh !important;
border: 1px solid red !important;
}
ytd-channel-video-player-renderer #c4-player.html5-video-player .html5-video-container .html5-main-video.video-stream {
	max-width: 99.6% !important;
	min-width: 99.6% !important;
	height: 20.8vh !important;
/* border: 1px solid aqua !important; */
}
ytd-channel-video-player-renderer #c4-player.html5-video-player .ytp-caption-window-container {
	height: 82% !important;
	pointer-events: none;
	position: absolute;
	top: 0;
	width: 100%;
}

/* CHANNEL PAGES - HOME/ ACCUEIL */

.ytd-browse.grid.grid-6-columns {
	min-width: 100%;
	padding-left: 20px;
}

/*  (new61) */
ytd-browse[page-subtype~="channels"] ytd-two-column-browse-results-renderer.ytd-browse.ytd-browse.grid.grid-6-columns #primary.ytd-two-column-browse-results-renderer  {
	min-width: 100%;

}

.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer > .ytd-section-list-renderer#contents ytd-item-section-renderer {
	width: 86%;
}

/*  (new64) GRID - ALL */
ytd-two-column-browse-results-renderer.ytd-browse.grid.grid-6-columns #primary.ytd-two-column-browse-results-renderer  {
	display:inline-block !important;
    width: 100% !important;
	min-width: 99% !important;
    max-width: 99% !important;
/*border: 1px solid yellow !important;*/
}
ytd-two-column-browse-results-renderer.ytd-browse.grid.grid-6-columns #primary.ytd-two-column-browse-results-renderer #contents.ytd-section-list-renderer > ytd-item-section-renderer {
    display:inline-block !important;
    width: 100% !important;
	min-width: 99.8% !important;
    max-width: 99.8% !important;
    padding: 0 0 0 20px !important;
/*border: 1px solid aqua !important;*/
}

.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #scroll-container.yt-horizontal-list-renderer {
    display:inline-block;
    width: 100% !important;
    min-width: 98% !important;
    max-width: 98% !important;
    margin:  0 0px 0 0 !important;
    padding: 0px;
    transition-duration:.15s;
    transition-timing-function:cubic-bezier(.05,0,0,1);
    will-change:transform;
    transform: unset !important;
    white-space: pre-line !important;
/*border: 1px solid yellow !important;*/ 
}
.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #scroll-container.yt-horizontal-list-renderer > #items.yt-horizontal-list-renderer {
    display:inline-block;
    width: 100% !important;
    min-width: 94% !important;
    max-width: 94% !important;
    margin:  0 0px 0 0 !important;
    padding: 0px;
    transition-duration:.15s;
    transition-timing-function:cubic-bezier(.05,0,0,1);
    will-change:transform;
    transform: unset !important;
    white-space: pre-line !important;
/*border: 1px solid green!important;*/
}

.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #scroll-container.yt-horizontal-list-renderer  > .yt-horizontal-list-renderer > ytd-grid-video-renderer.yt-horizontal-list-renderer #scroll-container {
	width: 100% !important;
    padding:  0 0 0 3px !important;
/*border: 1px solid aqua !important;*/
}

/* (new64) ALL ITEMS  */
.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #scroll-container.yt-horizontal-list-renderer  > .yt-horizontal-list-renderer > ytd-grid-video-renderer.yt-horizontal-list-renderer {
    display:block !important;
    float: left !important;
    clear: none !important;
    width: 100% !important;
    min-width: 15.4% !important;
    max-width: 15.4% !important;
    margin:  0 5px 0 0 !important;
    padding: 2px 4px 0 7px;
    white-space: pre-line !important;
/*border: 1px solid aqua !important;*/
}
ytd-two-column-browse-results-renderer.ytd-browse.grid.grid-6-columns #primary.ytd-two-column-browse-results-renderer ytd-thumbnail.ytd-grid-video-renderer{
    width: 100% !important;
    height: 18vh !important;
/*border: 1px solid aqua !important;*/
}
ytd-two-column-browse-results-renderer.ytd-browse.grid.grid-6-columns #primary.ytd-two-column-browse-results-renderer ytd-thumbnail.ytd-grid-video-renderer a#thumbnail yt-image img{
    width: 100% !important;
    height: 17.5vh !important;
    margin:  -1.2vh 0px 0 0 !important;
    object-fit:contain !important;
/*border: 1px solid aqua !important;*/
}

/* (new64) GRID GAMES 
https://www.youtube.com/gaming
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer[not-sticky] ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #dismissible #shelf-container #scroll-container #items
=== */


/* STICKY */
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer:not([not-sticky]) ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #header-container {
    width: 100% !important;
    max-height: 8vh !important;
    margin: 0vh 0px 0 0 !important;
/*border: 1px solid red !important;*/
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer:not([not-sticky]) ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #dismissible #shelf-container {
    display: inline-block !important;
    position:relative !important;
    width: 100% !important;
    height: 20vh !important;
/*border: 1px solid blue !important;*/
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer:not([not-sticky]) ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #dismissible #shelf-container #scroll-container {
    display: inline-block !important;
    position:relative !important;
    width: 100% !important;
    height: 20vh !important;
/*border: 1px solid pink!important;*/
}
/* NOT STICKY */
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer[not-sticky] ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #header-container{
    width: 100% !important;
    height: auto !important;
    margin: 0vh 0px 0 0 !important;
/*border: 1px solid aqua !important;*/
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer[not-sticky] ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #dismissible #shelf-container {
    display: inline-block !important;
    position:relative !important;
    width: 100% !important;
    height: auto !important;
    min-height: 40vh !important;
/*border: 1px solid lime !important;*/
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer[not-sticky] ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #dismissible #shelf-container #scroll-container {
    display: inline-block !important;
    position:relative !important;
    width: 98% !important;
    height: auto !important;
    min-height: 40vh !important;
    margin: 0 0 0 1% !important;
/*border: 1px solid yellow !important;*/
}

.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #dismissible #shelf-container #scroll-container #items {
    display: inline-block !important;
    position: relative !important;
    height: auto !important;
    transform: unset !important;
    white-space: pre-line !important;
/*border: 1px solid blue !important;*/
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #shelf-container #scroll-container.ytd-horizontal-card-list-renderer #items ytd-game-card-renderer.ytd-horizontal-card-list-renderer {
    display: block !important;
    float: left !important;
    margin: 0 5px 5px 0 !important;
    padding-right: 4px; 
/*border: 1px solid yellow !important;*/
}
/* FIRST */
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer ytd-horizontal-card-list-renderer.ytd-item-section-renderer[has-game-card] #shelf-container #scroll-container.ytd-horizontal-card-list-renderer #items ytd-game-card-renderer.ytd-horizontal-card-list-renderer:first-of-type {
    display: block !important;
    float: left !important;
    margin: 0 0 20px 8% !important;
    padding-right: 4px; 
/*border: 1px dotted lime !important;*/
}


/* (new64) GRID - COMMENTS */
ytd-two-column-browse-results-renderer.ytd-browse.grid.grid-6-columns #primary.ytd-two-column-browse-results-renderer #contents.ytd-section-list-renderer > ytd-item-section-renderer:has(ytd-post-renderer)  yt-horizontal-list-renderer #scroll-outer-container #scroll-container #items ytd-post-renderer {
    display:inline-flex;
    width: 100% !important;
    min-width: 18.5% !important;
    max-width: 18.5% !important;
    margin: 0 5px 10px 0 !important;
    padding: 5px 8px!important;
/*border: 1px solid aqua !important;*/
}



/* ALL MODEL  */
.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #scroll-container.yt-horizontal-list-renderer yt-lockup-view-model  {
    display:block !important;
    float: left !important;
    clear: none !important;
    width: 100% !important;
    min-width: 15.4% !important;
    max-width: 15.4% !important;
    height: 28vh !important;
    margin:  5px 5px 2vh 0 !important;
    padding: 2px 4px 0 7px;
    white-space: pre-line !important;
/*border: 1px solid pink !important;*/
}
.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #scroll-container.yt-horizontal-list-renderer yt-lockup-view-model a.yt-lockup-view-model__content-image yt-collection-thumbnail-view-model .ytThumbnailViewModelHost  {
    position:relative;
    display:block;
    width:100%;
    height:17vh !important;
    padding: 0 !important;
    overflow:hidden;
}
.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #scroll-container.yt-horizontal-list-renderer yt-lockup-view-model a.yt-lockup-view-model__content-image yt-collection-thumbnail-view-model .ytThumbnailViewModelHost .ytCoreImageHost {
    height: 17vh !important;
    object-fit:contain !important;
}

.ytCollectionsStackCollectionStack2 {
    position:absolute;
    width: 100% !important;
    height: 100% !important;
    top: 2px;
    left: 0px !important;
    right: 0px !important;
    border-radius: 5px;
    opacity:50%;
/*background-color:red !important;*/
}
.ytCollectionsStackCollectionStack1 {
    display: none  !important;
}

/*.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #items:not(.ytd-vertical-channel-section-renderer) {
	transform: translateX(-1289px) !important;
}
.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #items:not(.ytd-vertical-channel-section-renderer)[style="transform: translateX(0px);"] {
	transform: translateX(100px) !important;
}
.ytd-browse.grid.grid-6-columns .ytd-two-column-browse-results-renderer #items:not(.ytd-vertical-channel-section-renderer) ytd-grid-video-renderer {
	margin-left: 15px !important;
	border: 1px solid #222;
}*/



/* (new61) ARROWS */
yt-horizontal-list-renderer[at-start] #left-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer {
	display: none !important;
	opacity: 0 !important;
}
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer #right-arrow,
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer #left-arrow {
	height: 30px !important;
}
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer #right-arrow {
	width: 20px !important;
	right: 13px !important;
	top: 42px !important;
}
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer #left-arrow {
	width: 20px !important;
	right: -6px !important;
}
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer #right-arrow.yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer {
	/*border: 1px solid aqua; */
}

.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer #left-arrow ytd-button-renderer {
	border-radius: 50%;
	/*border: 1px solid yellow;*/
}
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer[at-start=""] #left-arrow ytd-button-renderer {
	/*border: 1px solid blue !important;*/
}
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer[at-end=""] #left-arrow ytd-button-renderer {
	/*border: 1px solid green !important;*/
}

.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer:not([at-start=""]) .yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer {
	/*border: 1px dotted tan !important;*/
}
.ytd-browse.grid.grid-6-columns yt-horizontal-list-renderer:not([at-end=""]) .arrow.yt-horizontal-list-renderer {
	/*border: 1px solid tan !important;*/
}
/* .ytd-browse.grid.grid-6-columns ytd-button-renderer .arrow.yt-horizontal-list-renderer[has-no-text=""] , */
.ytd-browse.grid.grid-6-columns .arrow.yt-horizontal-list-renderer .yt-simple-endpoint .paper-ripple[style="opacity: 0;"] + #waves.paper-ripple,
.ytd-browse.grid.grid-6-columns .arrow.yt-horizontal-list-renderer .yt-simple-endpoint .paper-ripple[style="opacity: 0;"] {
	display: none !important;
	opacity: 0 !important;
	visibility: hidden !important;
}

/* PLAYLIST */
ytd-two-column-browse-results-renderer.ytd-browse.grid.grid-6-columns #primary + #secondary.ytd-two-column-browse-results-renderer {
	width: 13% !important;
border-left: 1px solid red;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer.ytd-section-list-renderer.ytd-section-list-renderer > #contents ytd-shelf-renderer.ytd-item-section-renderer > #dismissable.ytd-shelf-renderer #contents.ytd-shelf-renderer yt-horizontal-list-renderer.ytd-shelf-renderer #scroll-container.yt-horizontal-list-renderer #items.yt-horizontal-list-renderer ytd-grid-playlist-renderer {
	margin-left: 0.8% !important;
/* border-left: 1px solid red ; */
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer.ytd-section-list-renderer.ytd-section-list-renderer > #contents ytd-shelf-renderer.ytd-item-section-renderer > #dismissable.ytd-shelf-renderer #contents.ytd-shelf-renderer yt-horizontal-list-renderer.ytd-shelf-renderer #scroll-container.yt-horizontal-list-renderer #items.yt-horizontal-list-renderer ytd-grid-playlist-renderer:first-of-type {
	margin-left: 0.63% !important;
}

/* CHANNEL - VIDEOS TAB */
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container.ytd-section-list-renderer {
	width: 89%;
	padding-left: 6%;
	padding-right: 3%;
}

.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents {
	width: 99%;
	min-height: 100% !important;
/* border: 1px solid yellow !important; */
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer {
	width: 100%;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #header-container + #contents ytd-item-section-renderer #items {
	min-width: 100% !important;
	margin-left: -95px;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer #items.ytd-grid-renderer:not(.ytd-vertical-channel-section-renderer) {
	width: 96% !important;
	overflow: hidden !important;
	transform: translateX(100px) !important;
}
/* CHANNEL - COMMUNITY TAB */
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items {
	display: inline-block !important;
	max-width: 100%;
	height: auto !important;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items .ytd-backstage-items > .ytd-item-section-renderer:not(#header):not(#continuations):not(#spinner-container) ytd-backstage-post-thread-renderer {
	display: inline-block !important;
	width: 45.5% !important;
	min-height: 270px !important;
	max-height: 270px !important;
	margin-left: 1% !important;
	margin-right: 1% !important;
	margin-bottom: 20px !important;
	border-radius: 3px;
border: 1px solid gray !important;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items .ytd-backstage-items > .ytd-item-section-renderer:not(#header):not(#continuations):not(#spinner-container) ytd-backstage-post-thread-renderer #expander + #content-attachment ytd-backstage-image-renderer.ytd-backstage-post-renderer {
	min-width: 100% !important;
	max-height: 124px;
border: 1px solid red;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items .ytd-backstage-items > .ytd-item-section-renderer:not(#header):not(#continuations):not(#spinner-container) ytd-backstage-post-thread-renderer #content-attachment.ytd-backstage-post-renderer {
	margin-top: 4px;
	text-align: center;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items .ytd-backstage-items > .ytd-item-section-renderer:not(#header):not(#continuations):not(#spinner-container) ytd-backstage-post-thread-renderer #img.yt-img-shadow {
	max-height: 124px;
	width: auto;
}

/* SONDAGE */
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items .ytd-backstage-items > .ytd-item-section-renderer:not(#header):not(#continuations):not(#spinner-container) ytd-backstage-post-thread-renderer ytd-backstage-poll-renderer paper-listbox {
	min-height: 105px;
	max-height: 115px;
	padding-top: 2px;
	overflow: hidden;
	overflow-y: auto !important;
border-bottom: 1px solid red !important;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items .ytd-backstage-items > .ytd-item-section-renderer:not(#header):not(#continuations):not(#spinner-container) ytd-backstage-post-thread-renderer ytd-backstage-poll-renderer paper-listbox #sign-in {
	height: 20px;
	line-height: 20px;
	padding-bottom: 0;
}
.ytd-browse.grid.grid-6-columns[page-subtype="channels"] #primary.ytd-two-column-browse-results-renderer ytd-backstage-items .ytd-backstage-items > .ytd-item-section-renderer:not(#header):not(#continuations):not(#spinner-container) ytd-backstage-post-thread-renderer ytd-backstage-poll-renderer paper-listbox #sign-in paper-item.vote-choice {
	display: inline-block !important;
	min-height: 20px !important;
	max-height: 20px !important;
	line-height: 20px !important;
}
.choice-info.ytd-backstage-poll-renderer,
.check-icons.ytd-backstage-poll-renderer {
	height: 20px !important;
	line-height: 20px;
}
.check-icons.ytd-backstage-poll-renderer {
	margin-top: -10px;
}
yt-icon.ytd-backstage-poll-renderer {
	top: -6px;
	padding: 0;
}
.choice-text.ytd-backstage-poll-renderer {
	margin-top: -10px;
}



/* COLOR */
a.yt-simple-endpoint.yt-formatted-string,
a.linkifyplus {
	color: peru;
}
a.yt-simple-endpoint.yt-formatted-string:visited,
a.linkifyplus:visited {
	color: tan !important;
}

/*(new7)  VISITED */
a#thumbnail {
	border: 1px solid #262626;
}
a.ytp-videowall-still.ytp-suggestion-set:visited,
a#thumbnail:visited {
	border: 1px solid red !important;
}

/* === END ==== */
}

@-moz-document url-prefix("https://www.youtube.com/watch?") {
/* PLAYER VIDEO PAGE */

/* START - VIDEO WATCH ==== */
html {
	overflow-y: hidden !important;
}

/* (new67) REDESIGN - PURCHASE - VIDEO - PURCHASE END SCREEN 
https://www.youtube.com/watch?v=_xFyUn8gveI
Harry Potter et la chambre des secrets (Harry Potter and the Chamber of Secrets)
https://www.youtube.com/watch?v=f2lNVCSMj8w
== */
.html5-ypc-endscreen[style="display: block;"]:has(.html5-ypc-purchase) {
    position:absolute;
    display: inline-block !important;
    right:0;
    bottom:0;
    left:0;
    padding:51px 21px 21px;
    z-index: 50 !important;
/*background:red !important;*/
/*border: 1px solid pink !important;*/
}
#movie_player:has(.html5-ypc-purchase) .ytp-cued-thumbnail-overlay .ytp-cued-thumbnail-overlay-image {
    position:absolute;
    display: inline-block !important;
    width:100%;
    height: 62vh !important;
    top: 0.5vh !important;
    background-size: contain !important;
    -moz-background-size:cover;
    -webkit-background-size:cover;
    background-position:center;
    background-repeat:no-repeat;
    opacity: 1 !important;
    z-index: 50000 !important;
/*border: 1px solid yellow !important;*/
}

/* (new67) REDESIGN - PURCHASE - VIDEO - PURCHASE END SCREEN - CONTAINER */
#movie_player:has(.html5-ypc-purchase) .html5-ypc-endscreen[style="display: block;"]:has(.html5-ypc-purchase).html5-ypc-endscreen[style="display: block;"]:has(.html5-ypc-purchase) .html5-ypc-module {
    position: fixed !important;
    display: inline-block !important;
    width: 100% !important;
    min-width: 20% !important;
    max-width: 20% !important;
    max-height: 15.5vh !important;
    top: 79vh !important;
    right:0;
    bottom:0;
    left: 16.7% !important;
    padding: 5px !important;
    border-radius: 5px  !important;
    z-index: 50000000000 !important;
/*background:green !important;*/
}
#movie_player:has(.html5-ypc-purchase) .html5-ypc-endscreen[style="display: block;"]:has(.html5-ypc-purchase).html5-ypc-endscreen[style="display: block;"]:has(.html5-ypc-purchase) .html5-ypc-module .html5-ypc-action-heading {
    display: none !important;
}

/* DARK */
[dark] .html5-ypc-endscreen[style="display: block;"]:has(.html5-ypc-purchase) .html5-ypc-module {
	background: #111 !important;
}
/* NO DARK */
html:not([dark]) .html5-ypc-endscreen[style="display: block;"]:has(.html5-ypc-purchase) .html5-ypc-module {
	background:white !important;
}

/* (new67) REDESIGN - PURCHASE - RELATED - THUMBNAIL */
.ytd-compact-movie-renderer:not([watch-feed-big-thumbs]) ytd-thumbnail.ytd-compact-movie-renderer ,
.yt-lockup-view-model--horizontal.yt-lockup-view-model--compact .yt-lockup-view-model__content-image {
    display: block !important;
    float: left !important;
    width: 100% !important;
    height: 14vh !important;
    padding: 2px !important;
    overflow: hidden !important;
/*border: 1px solid red !important;*/
}
/* (new67) REDESIGN - PURCHASE - RELATED - META */
ytd-watch-flexy .tab-content-cld#tab-videos > [placeholder-videos] > ytd-watch-next-secondary-results-renderer > #items .details.ytd-compact-movie-renderer  {
    -moz-box-orient:horizontal;
    -moz-box-direction:normal;
    flex-direction:row;
    min-width: 98% !important;
    max-width: 98% !important;
    height: 10vh !important;
    top: 15vh !important;
    margin: 0 0 0 -4px !important;
    padding: 0vh 2px 0 2px !important;
/*border: 1px solid aqua !important;*/
}
ytd-watch-flexy .tab-content-cld#tab-videos > [placeholder-videos] > ytd-watch-next-secondary-results-renderer > #items .details.ytd-compact-movie-renderer #movie-title.ytd-compact-movie-renderer {
    margin:0 0 4px 0;
    font-size: 1.4rem !important;
}
ytd-watch-flexy .tab-content-cld#tab-videos > [placeholder-videos] > ytd-watch-next-secondary-results-renderer > #items .details.ytd-compact-movie-renderer .movie-metadata.ytd-compact-movie-renderer {
    margin: 0 0 4px 0 !important;
    font-size: 1.4rem !important;
}
ytd-watch-flexy .tab-content-cld#tab-videos > [placeholder-videos] > ytd-watch-next-secondary-results-renderer > #items .ytd-badge-supported-renderer.badge.badge-style-type-ypc {
    height: 2vh !important;
    margin: -1vh 0 0px 0 !important;
/*border: 1px solid aqua !important;*/
}
ytd-watch-flexy .tab-content-cld#tab-videos > [placeholder-videos] > ytd-watch-next-secondary-results-renderer > #items .details.ytd-compact-movie-renderer ytd-video-meta-block #metadata.ytd-video-meta-block #byline-container ytd-channel-name #container.ytd-channel-name   #text-container {
    position: absolute !important;
    min-height: 2vh !important;
    max-height: 2vh !important;
    margin: 0vh 0 0px 0 !important;
    top: 0vh !important;
    padding: 0px !important;
/*border: 1px solid yellow !important;*/
}
ytd-watch-flexy .tab-content-cld#tab-videos > [placeholder-videos] > ytd-watch-next-secondary-results-renderer > #items .details.ytd-compact-movie-renderer ytd-video-meta-block #metadata.ytd-video-meta-block #byline-container ytd-channel-name #container.ytd-channel-name   #text-container yt-formatted-string {
    min-height: 2vh !important;
    max-height: 2vh !important;
    line-height: 2vh  !important;
    margin: 0vh 0 0px 0 !important;
    top: 0vh !important;
    font-size: 1.3rem !important;
/*border: 1px solid aqua !important;*/
}

/* (new45) IN PLAYER - PREVIEW VIDEO THUMBNAIL + BUTTON TOOLTIPS + PREVIEW TIME  - NO THEATER - Cf TOOLTIPS */
ytd-watch-flexy[flexy]:not([theater]):not([fullscreen]):not(.ytp-embed) .ytp-tooltip.ytp-bottom .ytp-tooltip-text-wrapper .ytp-tooltip-text:not([style*="display: none;"]) {
	position: fixed !important;
	display: inline-block !important;
	top: 69vh !important;
	z-index: 500000000 !important;
/* border: 1px solid pink !important; */
}


/* (new45) IN PLAYER - CONTAINER (For PREVIEW THUMB VIDEO vible on Right) */
ytd-watch-flexy[flexy] #player-container-outer.ytd-watch-flexy {
	min-width: 59.5vw !important;
	max-width: 59.5vw !important;
	overflow: visible !important;
}
ytd-watch-flexy[flexy] #player-container.ytd-watch-flexy {
	bottom: 0;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	/* overflow: visible !important; */
}
ytd-watch-flexy[flexy] #player-container.ytd-watch-flexy:hover {
	z-index: 50000000 !important;
}
#previewbar.hovered,
#previewbar {
	z-index: 50000 !important;
}

/* (new45) (not for priview video in SEARCH :not(.ytd-video-preview) - 
IN NORMAL PLAYER - CONTAINER (For PREVIEW THUMB VIDEO vible on Right)- PREVIEW PROGRESS BAR - 
For visibility - ytp-tooltip.ytp-preview:not(.ytp-text-detail)
=== */
html[plugin-tabview-youtube] #columns.ytd-watch-flexy #primary,
#columns.ytd-watch-flexy #primary #primary-inner:not(.ytd-video-preview),
ytd-watch-flexy[flexy] #player-container-outer:not(.ytd-video-preview),
ytd-watch-flexy[flexy]:not([is-vertical-video_]) #player-container-inner:not(.ytd-video-preview),
ytd-watch-flexy[flexy] #player-container:not(.ytd-video-preview),
ytd-player:not(.ytd-video-preview),
#container.ytd-player:not(.ytd-video-preview) {
    display: inline-block !important;
    height: 100%;
    width: 100%;
    overflow: visible !important;
    z-index: 500000000 !important;
/* border: 1px solid aqua  !important; */
}
/* (new45) IN PLAYER - CONTAINER (For PREVIEW THUMB VIDEO vible on Right)- PROGRESS BAR - THUMBNAIL - FOR VISIBILITY RIGHT SIDE - NORMAL */
.ytp-tooltip.ytp-preview:not(.ytp-text-detail) {
    position: fixed !important;
    top: 62vh !important;
    z-index: 5000000 !important;
}
/* (new45) IN PLAYER - PREVIEW PROGRESS BAR - FOR VISIBILITY RIGHT SIDE - THEATER */
ytd-watch-flexy[flexy][theater] .ytp-tooltip.ytp-preview:not(.ytp-text-detail) {
    top: 72vh !important;
}

/* ==== END  ==== */






/* END === VIDEO WATCH === */
}

@-moz-document url-prefix("https://www.youtube.com/watch?") {
/* PLAYER INTERFACE - .ytp-delhi-modern - CSS FROM TOTARA (new68) */

/* TOOLTIP BOTTOM - NORMAL PLAYER
ytd-watch-flexy:not([fullscreen], [theater], .ytp-embed) .ytp-tooltip.ytp-bottom
==== */
/* TOOLTIP BOTTOM - THEATER PLAYER
ytd-watch-flexy[theater] .ytp-tooltip.ytp-bottom
==== */
/* TOOLTIP BOTTOM - FULLSREEN PLAYER
ytd-watch-flexy[fullscreen] .ytp-tooltip.ytp-bottom
==== */

/* (new68) TOOLTIP BOTTOM - NORMAL PLAYER  */
ytd-watch-flexy:not([fullscreen], [theater], .ytp-embed) .ytp-tooltip.ytp-bottom {
    max-width: 300px;
    top: 55.8vh !important;
/*background: red !important;*/
/*border: 1px solid red  !important;*/
}



/* (new68) TO SUPP - CONTROLS - AGANIST BUTTONS FLINKERING on HOVER - NOT EMBED - .html5-video-player:not(.ytp-embed)  */
/*.html5-video-player:not(.ytp-embed) .autoHiding.hidden,
.html5-video-player:not(.ytp-embed) .ytp-chrome-top .ytp-button:hover,
.html5-video-player:not(.ytp-embed) .ytp-chrome-controls .ytp-button:hover:not([aria-disabled="true"]):not([disabled]):not(.ytp-chapter-title),
.html5-video-player:not(.ytp-embed) .ytp-chrome-controls .ytp-button[aria-expanded="true"],
.html5-video-player:not(.ytp-embed) .ytp-chrome-controls .ytp-button[aria-pressed="true"],
.html5-video-player:not(.ytp-embed) .ytp-replay-button:hover {
	display: inline-block !important;
	width: 48px;
	height: 35px !important;
border: 1px solid red !important;
}*/
/* (new55) CONTROLS - AGANIST BUTTONS FLINKERING on HOVER - NOT EMBED - .html5-video-player:not(.ytp-embed)  */
/*.html5-video-player:not(.ytp-embed) .autoHiding.hidden,
.html5-video-player:not(.ytp-embed) .ytp-chrome-top .ytp-button:hover,
.html5-video-player:not(.ytp-embed) .ytp-chrome-controls .ytp-button:hover:not([aria-disabled="true"]):not([disabled]):not(.ytp-chapter-title),
.html5-video-player:not(.ytp-embed) .ytp-chrome-controls .ytp-button[aria-expanded="true"],
.html5-video-player:not(.ytp-embed) .ytp-chrome-controls .ytp-button[aria-pressed="true"],
.html5-video-player:not(.ytp-embed) .ytp-replay-button:hover {
	display: inline-block !important;
	width: 48px;
	height: 35px !important;
border: 1px solid red !important;
}*/

/* (new68) NORMAL - ACTIVE HOVER on #player:hover */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom {
	width: 99% !important;
	height: 3.5vh !important;
	left: 5px !important;
    top: 64.8vh !important;
    margin:  0vh 0 0vh 0 !important;
	opacity: 1 !important;
/*background: red !important;*/
/*border: 1px solid red  !important;*/
}
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls {
	width: 99% !important;
	height: 3vh !important;
	left: 5px !important;
    margin:  0 0 0vh 0 !important;
	opacity: 1 !important;
/*background: peru !important;*/
/*border: 1px solid aqua  !important;*/
}


/* (new68) NORMAL - LEFT */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls {
    width: 40% !important;
	height: 3.4vh !important;
	left: 5px !important;
    margin:  0 0 0vh 0 !important;
    padding:  0 0 0 0 !important;
	opacity: 1 !important;
/*background: green !important;*/
/*border: 1px solid red  !important;*/
}

/* (new69) NORMAL - LEFT - PLAY BUTTON */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls .ytp-play-button {
    display: inline-flex !important;
    width: 30px;
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin-top: 0px !important;
    padding: 0;
    border-radius: 50%;
/*border: 1px solid red  !important;*/
}
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls .ytp-play-button svg{
    width: 36px;
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin-top: 0px !important;
    padding: 0px !important;
    border-radius: 50%;
/*border: 1px solid red  !important;*/
}

/* (new69) NORMAL - LEFT - VOLUME */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer) .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls span.ytp-volume-area:not(:hover) ,
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer) .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls span.ytp-volume-area:hover {
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin: 0px 0 0 30px !important;
    padding: 0;
/*border: 1px solid yellow  !important;*/
}
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls span.ytp-volume-area button.ytp-mute-button.ytp-button  {
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin: 2px 0 0 0 !important;
    padding: 0px !important;
/*border: 1px solid aqua  !important;*/
}
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls span.ytp-volume-area .ytp-volume-icon svg {
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin: 0px 0 0 0 !important;
    padding: 0px !important;
/*border: 1px solid aqua  !important;*/
}

/* LEFT - TIME */
.ytp-delhi-modern .ytp-time-display:not(.ytp-miniplayer-ui *) {
    height: 3.4vh !important;
    padding: 0 5px !important;
}




/* (new68) NORMAL - RIGHT */
#player:not(:has(.ytp-embed)):not(.ytd-channel-video-player-renderer):hover .ytp-chrome-bottom .ytp-chrome-controls .ytp-right-controls {
    width: 40% !important;
	height: 3.4vh !important;

    margin:  0 0px 0vh 0 !important;
    padding:  0 0 0 0 !important;
	opacity: 1 !important;
/*background: brown !important;*/
/*border: 1px solid red  !important;*/
}

.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button svg {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}

/* (new69) NORMAL - SPONSORBLOCK CHAPTER - SMALL SIZED */
.ytp-delhi-modern .ytp-chapter-container.sponsorblock-chapter-visible{
    width: auto !important;
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    margin:  -0.6vh 0px 0vh 0 !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}
/* (new68) NORMAL - RIGHT - SMALL SIZED */
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-left .ytp-button.ytp-settings-button ,
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-left .ytp-button.ytp-subtitles-button ,
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-right .ytp-size-button.ytp-button ,
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-right .ytp-button.ytp-fullscreen-button {
    width: 30px !important;
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}



/* (new68) NO GM - TABS VIDEO - VIEW ON HOVER BEFORE: 
html:not([plugin-tabview-youtube], tabview-view-pos-thead):not([plugin-tabview-youtube]):has([theater]):has(#full-bleed-container.ytd-watch-flexy) ytd-page-manager:has(#full-bleed-container.ytd-watch-flexy):has(#player-full-bleed-container)  #columns #secondary ytd-watch-next-secondary-results-renderer
=== */
html:not([plugin-tabview-youtube], tabview-view-pos-thead):not([plugin-tabview-youtube]):has([theater]):has(#full-bleed-container.ytd-watch-flexy) ytd-page-manager:has(#full-bleed-container.ytd-watch-flexy):has(#player-full-bleed-container)  #columns #secondary ytd-watch-next-secondary-results-renderer:hover {
    display: inline-block !important;
    z-index: 50000000 !important;
border: 1px solid red  !important;
}



/* (new68) THEATER ======== 
ytd-watch-flexy:has(#full-bleed-container) #full-bleed-container
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode)
========= */

 ytd-page-manager#page-manager.ytd-app ytd-watch-flexy[theater]:has(#full-bleed-container) #full-bleed-container #player-container #container #movie_player.html5-video-player .ytp-gradient-bottom ,

ytd-watch-flexy[theater]:has(#full-bleed-container) .ytp-title .ytp-title-text .ytp-title-subtext ,
ytd-watch-flexy[theater]:has(#full-bleed-container) .ytp-title .ytp-title-text .ytp-title-link.yt-uix-sessionlink.ytp-title-fullerscreen-link,

ytd-watch-flexy[theater]:has(#full-bleed-container) #columns #primary #middle-row ,

ytd-watch-flexy[theater]:has(#full-bleed-container) #columns #primary + #secondary ,
ytd-watch-flexy[theater]:has(#full-bleed-container) #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy #right-tabs .tab-content {
	display: none !important;
/* background: aqua !important; */
}

ytd-watch-flexy[theater]:has(#full-bleed-container) #columns #primary #primary-inner ,
ytd-watch-flexy[theater]:has(#full-bleed-container) #columns #primary ,
ytd-watch-flexy[theater]:has(#full-bleed-container) #columns {
    width: 100% !important;
    min-height: 0vh !important;
    max-height: 0vh !important;
/*border: 1px solid red  !important;*/
}

ytd-watch-flexy:has(#full-bleed-container) #full-bleed-container ,
ytd-watch-flexy:has(#full-bleed-container) {
    width: 100% !important;
    min-height: 92vh !important;
    max-height: 92vh !important;
/*border: 1px solid red  !important;*/
}

 ytd-page-manager#page-manager.ytd-app ytd-watch-flexy[theater]:has(#full-bleed-container){
    display: flex;
    flex-direction: column;
    width: 100% !important;
    min-height: 99vh !important;
    max-height: 99vh !important;
    overflow: hidden  !important;
/*border: 1px solid red  !important;*/
}




/* (new68) THEATER - TOOLTIP BOTTOM - THEATER PLAYER  */
ytd-watch-flexy[theater] .ytp-tooltip.ytp-bottom {
  max-width: 300px;
  top: 70.8vh !important;
/*background: blue!important;*/
/*border: 1px solid red  !important;*/
}


/* (new68) THEATER - #movie_player.ytp-delhi-modern == .ytp-big-mode .ytp-chrome-bottom */
html:has(#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode)) #columns #secondary ,
html:has(#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode)) #columns #primary {
    height: 100% !important;
    min-height: 2.4vh !important;
    max-height: 2.4vh !important;
    overflow: hidden !important;
/*background: blue!important;*/
/*border: 1px solid red  !important;*/
}

 ytd-page-manager#page-manager.ytd-app ytd-watch-flexy[theater]:has(#full-bleed-container) #full-bleed-container #player-container #container #movie_player.html5-video-player .ytp-iv-video-content {
    width: 100% !important;
    height: 853px;
    left: 0 !important;
    top: 0px;
}


/* (new68) THEATER - CAPTIONS */
ytd-page-manager#page-manager.ytd-app ytd-watch-flexy[theater]:has(#full-bleed-container) #full-bleed-container #player-container #container #movie_player.html5-video-player #ytp-caption-window-container .caption-window.ytp-caption-window-bottom {
    margin-bottom: 70px;
    bottom: 0% !important;
/*border: 1px solid red  !important;*/
}



/* (new68) THEATER - CHROME BOTTOM == .ytp-big-mode .ytp-chrome-bottom  ==  */
ytd-watch-flexy:has(#full-bleed-container) #full-bleed-container #movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode):hover .ytp-chrome-bottom ,
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode):hover .ytp-chrome-bottom {
    min-height: 7.4vh !important;
    line-height: 2.4vh !important;
    bottom: 0vh !important;
    margin: 0vh 0 0 0 !important;
/*border: 1px solid yellow !important;*/
}

/* (new68) THEATER - PROGRESSBAR HOVER */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-chrome-bottom .ytp-progress-bar-container {
    min-height: 0vh !important;
    max-height: 0vh !important;
    line-height: 2.9vh !important;
    z-index: 500000000 !important;
  outline: none;
/*border: 1px solid lime  !important;*/
}

#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode):hover .ytp-chrome-bottom .ytp-progress-bar {
    position: fixed !important;
    width: 99.9%;
    height: 100%;
    min-height: 2.4vh !important;
    max-height: 2.4vh !important;
    line-height: 2.9vh !important;
    bottom: 0vh !important;
    left: 0;
    z-index: 500000000 !important;
    outline: none;
/*border: 1px solid lime  !important;*/
}

ytd-page-manager#page-manager.ytd-app ytd-watch-flexy[theater]:has(#full-bleed-container) #full-bleed-container #player-container #container #movie_player.html5-video-player:hover .ytp-chrome-bottom .ytp-progress-bar-container {
    position: fixed !important;
    width: 99.9%;
    height: 100%;
    min-height: 1.4vh !important;
    max-height: 1.4vh !important;
    line-height:1.9vh !important;
    top: unset !important;
    bottom: 0vh !important;
    left: 0;
    z-index: 500000000 !important;
    outline: none;
/*border: 1px solid lime  !important;*/
}


/* (new68) THEATER - CONTROLS */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-chrome-controls {
    min-height: 3.4vh !important;
    line-height: 3.4vh !important;
    bottom: 0vh !important;
    margin: 0vh 0 0 0 !important;
/*border: 1px solid peru  !important;*/
}
/* HOVER */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode):hover .ytp-chrome-controls {
    min-height: 9.4vh !important;
    line-height: 3.4vh !important;
    bottom: 0vh !important;
    margin: 0vh 0 0 0 !important;
/*border: 1px solid aqua  !important;*/
}


/* (new68) THEATER - CONTROLS - LEFT  */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-left-controls {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    margin: 0 0 0 100px !important;
/*border: 1px solid red  !important;*/
}

/* (new68) THEATER - CONTROLS - LEFT - PLAY */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-left-controls .ytp-play-button.ytp-button {
    display: inline-flex !important;
    width: 30px;
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin-top: 2px !important;
    padding: 0;
    border-radius: 50%;
/*border: 1px solid red  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-left-controls .ytp-play-button.ytp-button svg {
    width: 36px;
    min-height: 2.2vh !important;
    max-height: 3.2vh !important;
    margin-top: -3px !important;
    padding: 3px;
    border-radius: 50%;
/*border: 1px solid red  !important;*/
}

/* (new69) THEATER - CONTROLS - LEFT - VOLUME */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-left-controls .ytp-volume-area ,
.ytp-left-controls .ytp-volume-area {
    height: 3.2vh !important;
    line-height: 3.2vh !important;
    margin-top: 0px !important;
/*border: 1px solid red  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-left-controls .ytp-volume-area ,
.ytp-left-controls .ytp-volume-area button.ytp-mute-button.ytp-button {
    height: 3.2vh !important;
    line-height: 3.2vh !important;
    margin-top: 0px !important;
    padding: 0px !important;
/*border: 1px solid red  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-left-controls span.ytp-volume-area .ytp-mute-button .ytp-volume-icon svg ,
.ytp-left-controls span.ytp-volume-area .ytp-mute-button .ytp-volume-icon svg{
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    margin: 0px 0 0 0 !important;
    padding: 0px !important;
/*border: 1px solid red  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-left-controls .ytp-volume-area .ytp-volume-slider  ,
.ytp-left-controls .ytp-volume-area .ytp-volume-slider{
    min-height: 3.2vh !important;
    max-height: 3.2vh !important;
    line-height: 1.2vh !important;
/*border: 1px solid aqua  !important;*/
}


/* (new68) THEATER - CONTROLS - LEFT - TIME */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-time-display:not(.ytp-miniplayer-ui *) {
    height: 3.2vh !important;
    line-height: 3.2vh !important;
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-time-display:not(.ytp-miniplayer-ui *) span.ytp-time-wrapper.ytp-time-wrapper-delhi {
    height: 3.2vh !important;
    line-height: 3.2vh !important;
}



/* (new68) THEATER - CONTROLS - RIGHT  */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    margin-top: 0 !important;
/*border: 1px solid red  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-right-controls-left {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-right-controls-right {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
}



#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-button {
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-button svg {
    height: 3.2vh !important;
    line-height: 3.2vh !important;
    padding: 0 0px !important;
/*border: 1px solid yellow  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-button.ytp-subtitles-button ,
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-button.ytp-fullscreen-button ,
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-button.ytp-settings-button{
    width: 28px !important;
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}

/* (new68) THEATER - CONTROLS - RIGHT- LECT AUTO */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls .ytp-right-controls-left .ytp-button.ytp-autonav-toggle{
    width: auto !important;
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
/*border: 1px solid aqua  !important;*/
}


#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls button.ytp-button .ytp-autonav-toggle-button{
    width: 45px !important;
    padding: 0 0px !important;
    margin:  0 0 0 0 !important;
/*border: 1px solid aqua  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls button.ytp-button .ytp-autonav-toggle-button{
    width: 45px !important;
    padding: 0 0px !important;
    margin:  0 0 0 0 !important;
/*border: 1px solid aqua  !important;*/
}


/* (new68) THEATER - CONTROLS - RIGHT - SPONSORBLOCK */
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls button#startSegmentButton.playerButton.ytp-button {
    width: 35px !important;
    height: 3.4vh !important;
    line-height: 3.4vh !important;
    padding: 0 0px !important;
    margin:  0 0 0 0 !important;
/*border: 1px solid aqua  !important;*/
}
#movie_player.ytp-delhi-modern.ytp-big-mode:not(.ytp-xsmall-width-mode) .ytp-right-controls button#startSegmentButton.playerButton.ytp-button img#startSegmentImage.playerButtonImage {
    width: 35px !important;
    height: 2.8vh !important;
    line-height: 2.8vh !important;
    padding: 0 5px 0 0  !important;
    margin:  0 0 0 0 !important;
/*border: 1px solid aqua  !important;*/
}


/* (new68) THEATER - CONTROLS - RIGHT -SETTING MENU */
.ytp-delhi-modern.ytp-big-mode .ytp-settings-menu {
    bottom: 18vh !important;
    z-index: 6000 !important;
border: 1px solid silver !important
}



/* (new68) FULLSCREEN - VIDEO CONTAINER SIZE */

html:has([fullscreen]) #content ytd-page-manager#page-manager ytd-watch-flexy.ytd-page-manager {
    width: 99.8% !important;
    min-height: 99.5vh important;
    max-height: 99.5vh !important;
/*border: 1px solid red  !important;*/
}
html:has([fullscreen]) #content ytd-page-manager#page-manager ytd-watch-flexy.ytd-page-manager #full-bleed-container {
    min-height: 99.5vh important;
    max-height: 99.5vh !important;
/*border: 1px solid aqua  !important;*/
}

/* (new68) FULLSCREEN - CONTROLS */
html:has([fullscreen]) .ytp-chrome-bottom {
    border: none  !important;
}
html:has([fullscreen]) .ytp-chrome-controls {
    min-width: 99.8% !important;
    max-width: 99.8% !important;
    border: none  !important;
/*border: 1px solid red  !important;*/
}
}

@-moz-document url-prefix("https://www.youtube.com/watch?") {
/* ADAPTATION for GM "Tabview YouTube Totara" the NEW TABVIEW */

/* WITH IT:
:has(tabview-view-pos-thead)
====*/

/* WITHOUT IT:
:not(:has(tabview-view-pos-thead))
===*/

/* GM "TABVIEW TOTARA":
not(:has(tabview-view-pos-thead))
:has(tabview-view-pos-thead)
==== */

/* (new69) TOTARA - TOP HEADER */
#masthead-container #end {
  height: 3.8vh !important;
  padding: 0 16px;
  justify-content: space-between;
    margin:  4px 0 0 0 !important;
/*border: 1px solid yellow !important;*/
}
#masthead-container #end #buttons {
    height: 3.5vh !important;
}
#masthead-container #end #buttons .ytd-masthead {
    height: 3.5vh !important;
    line-height: 3.5vh !important;
}
#masthead-container #end #buttons .ytd-masthead button {
    height: 3.5vh !important;
    line-height: 3.5vh !important;
    padding:  0 0px !important;
/*border: 1px solid yellow !important;*/
}
#masthead-container #end #buttons .ytd-masthead button.yt-spec-button-shape-next {
    height: 3.5vh !important;
    line-height: 3.5vh !important;
    margin:  0 0 0 0 !important;
    padding:  0 15px !important;
/*border: 1px solid aqua !important;*/
}
#masthead-container #end #buttons .ytd-masthead button#avatar-btn yt-img-shadow {
    height: 3.5vh !important;
    line-height: 3.5vh !important;
    padding:  0 0px !important;
/*border: 1px solid lime !important;*/
}

/*#masthead-container #end #buttons ytd-topbar-menu-button-renderer*/


/* (new68) TOTARA - GM "YOUTUBE LINK" - EYE / YL ICON */

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #ujs-hdr-links-div {
    position: fixed !important;
    display: inline-block !important;
    max-width: 39.4vw !important;
    min-width: 39.4vw !important;
    top: 6.1vh;
    right: 0px !important;
    padding: 5px 0px !important;
    z-index: 500 !important;
    visibility: hidden;
}
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #ujs-hdr-links-div:hover {
    visibility: visible;
    z-index: 2147483647 !important;
/*border: 1px solid yellow !important;*/
}


/* (new68) TOTARA - TABS - RIGHT - NORMAL */
html:not([plugin-tabview-youtube]):not(:has([theater])):has(tabview-view-pos-thead) ytd-watch-flexy[flexy_] #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy, 
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy {
    /*border: 1px solid yellow !important;*/
}
html:not([plugin-tabview-youtube]):not(:has([theater])):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner secondary-wrapper {
    position: absolute; 
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    contain: strict;
    box-sizing: border-box;
    width: 100% !important;
    height: 100%;
    min-height: 100vh !important;
    max-height: 100vh !important;
/*max-height: calc(100vh - var(--ytd-toolbar-height, 56px));*/
    margin: 0;
    top: -11.2vh !important;
    right: 0;
    left: 0;
    padding: 0 0 0 0 !important;
/*border: 1px solid aqua  !important;*/
}
html:not([plugin-tabview-youtube]):not(:has([theater])):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner.ytd-watch-flexy secondary-wrapper #right-tabs {
    position: fixed !important;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100% !important;
    min-height: 95.8vh !important;
    max-height: 95.8vh !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    padding: 0 0 0 0 !important;
    transition: none !important;
    animation: none !important;
/*border: 4px dashed yellow  !important;*/
}
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead).ytd-watch-flexy #secondary-inner.ytd-watch-flexy #right-tabs .tab-content, 
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy #right-tabs .tab-content {
    display: inline-block !important;
    height: 100% !important;
    min-height: 90.8vh !important;
    max-height: 90.8vh !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    left: -1px;
    top: 0px !important;
    z-index: 5000000 !important;
/*border: 1px dashed yellow  !important;*/
}
html:not([plugin-tabview-youtube], [theater]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner secondary-wrapper #right-tabs .tab-content .tab-content-cld {
    display: inline-block !important;
    height: 100% !important;
    min-height: 90.8vh !important;
    max-height: 90.8vh !important;
    padding: 1vh 100px 0 100px !important;
    overflow: hidden auto !important;
border-top: 1px solid silver  !important;
}



/* (new68) TOTARA - TABS - RIGHT - THEATER */
html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) ytd-watch-flexy[flexy_] #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy, 
html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy #secondary-inner.ytd-watch-flexy {
    /*border: 1px solid yellow !important;*/
}
html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner secondary-wrapper {
    position: fixed  !important;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    contain: strict;
    box-sizing: border-box;
    width: 100% !important;
    height: 100% !important;
    min-height: 8vh !important;
    max-height: 8vh !important;
/*max-height: calc(100vh - var(--ytd-toolbar-height, 56px));*/
    margin: 0;
    top: 0vh !important;
    right: 0 !important;
    left: 0 !important;
    padding: 0 0 0 0 !important;
    opacity: 1 !important;
    z-index: 500000000 !important;
    overflow: hidden!important;
border-bottom: 1px solid gray  !important;
}
html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner.ytd-watch-flexy secondary-wrapper #right-tabs {
    position: fixed !important;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100% !important;
    min-height: 2.5vh !important;
    max-height: 2.5vh !important;
    width: 100% !important;
    min-width: 20% !important;
    max-width: 20% !important;
    top: 4vh !important;
    padding: 0vh 0 0 0 !important;
    opacity: 1 !important;
    z-index: 50000000000 !important;
    overflow: hidden!important;
    transition: none !important;
    animation: none !important;
/*border: 1px dashed yellow  !important;*/
}

html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner.ytd-watch-flexy secondary-wrapper #right-tabs header {
    position: fixed !important;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100% !important;
    min-height: 2.5vh !important;
    max-height: 2.5vh !important;
    width: 100% !important;
    min-width: 20% !important;
    max-width: 20% !important;
    right: 0px !important;
    padding: 0 0 0 0 !important;
    opacity: 1 !important;
    z-index: 500000000 !important;
    overflow: hidden !important;
    transition: none !important;
    animation: none !important;
/*background-color: red !important;*/
/*border: 1px dashed lime  !important;*/
}
html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner.ytd-watch-flexy secondary-wrapper #right-tabs header #material-tabs {
    width: 100% !important;
    height: 100% !important;
    min-height: 2.5vh !important;
    max-height: 2.5vh !important;
    overflow: hidden !important;
}
html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner.ytd-watch-flexy secondary-wrapper #right-tabs header #material-tabs .tab-btn[tyt-tab-content] {
    width: 100% !important;
    min-width: 30% !important;
    max-width: 30% !important;
    height: 100% !important;
    min-height: 2.5vh !important;
    max-height: 2.5vh !important;
    padding: 3px 0px 0 0px !important;
    overflow: hidden !important;
border-bottom: 0px solid transparent;
border-left: 1px solid gray !important;
}

html:not([plugin-tabview-youtube]):has([theater]):has(tabview-view-pos-thead) #secondary:has(tabview-view-pos-thead) #secondary-inner.ytd-watch-flexy secondary-wrapper #right-tabs .tab-content {
	display: none  !important;
}


/* (new68) INFOS - NOT TABVIEW / NOT TOTARA :not(:has(tabview-view-pos-thead))  */
html:not([plugin-tabview-youtube]):not(:has(tabview-view-pos-thead)) #bottom-row ,
html:not([plugin-tabview-youtube]):not(:has(tabview-view-pos-thead)) #below #bottom-row.ytd-watch-metadata {
	position: fixed;
	display: inline-block;
/*width: 60% !important;*/
    height: 0vh !important;
    top: 7.4vh !important;
    right: 0 !important;
    margin: 0 0 0 0 !important;
/*overflow: hidden !important;*/
    z-index: 5000 !important;
/*background-color: red !important;*/
}

/*html:not([plugin-tabview-youtube]) #bottom-row:before ,*/


/* (new68) TOTARA - INFOS - NO TABS INDICATOR WITH TOTARA
NO TOTARA :
not(:has(tabview-view-pos-thead))  

WITH TOTARA:
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead)
=== */
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #columns ytd-playlist-panel-renderer#playlist::before ,
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #related.ytd-watch-flexy ytd-watch-next-secondary-results-renderer:before ,
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #below ytd-watch-metadata #description.ytd-watch-metadata::before, 
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-metadata #description.ytd-watch-metadata::before, html:not([plugin-tabview-youtube]) #meta-contents #container.ytd-video-secondary-info-renderer::before ,
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #below ytd-watch-metadata #description.ytd-watch-metadata:before  ,
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-metadata #description.ytd-watch-metadata:before,
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #meta-contents #container.ytd-video-secondary-info-renderer:before {
	content: "XXx ▼" !important;
	display: none !important;
}

/* (new68) TOTARA - GM "YOUTUBE LINK" ??? */
/* A VOIR - TOTARA - INFOS TAB - FOR INFO TABS with 1 VIDEO COLLECTION + 1 VIDEO:
https://www.youtube.com/watch?v=KEVA1qWv_8w
===== */
/*html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #tab-info ytd-video-description-infocards-section-renderer #infocards-section{
    position: relative;
    display: block !important;
    float: left !important;
    clear: none !important;
    width: 100% !important;
    -moz-box-direction: unset !important;
    flex-direction: unset !important;
    text-decoration: none;
}
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy[is-two-columns_] #right-tabs .tab-content-cld #infocards-section #content:has(ytd-structured-description-playlist-lockup-renderer){
    position: relative !important;
    display: inline-block !important;
    float: none !important;
    clear: both !important;
    width: 100% !important;
    height: auto !important;
    -moz-box-direction: unset !important;
    flex-direction: unset !important;
    margin: 0 0 0 0 !important;
    text-decoration: none;
}
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy[is-two-columns_] #right-tabs .tab-content-cld #infocards-section #content:has(ytd-structured-description-playlist-lockup-renderer) ytd-structured-description-playlist-lockup-renderer{
    position: relative !important;
    display: flex !important;
    float: left !important;
    clear: both !important;
    width: 100% !important;
    height: auto !important;
    -moz-box-direction: unset !important;
    flex-direction: unset !important;
    margin: 4vh 0 0 -60%  !important;
    text-decoration: none;
}*/


/* TOTARA - TAB COMMENTS */

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld:not(.tab-content-hidden):not([tyt-hidden]) {
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    z-index: 50000000 !important;
background: rgb(17, 17, 17) !important;
border: none  !important;
border-top: 1px solid silver  !important;
}

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld:not(.tab-content-hidden):not([tyt-hidden]) .tab-content-cld {
    --tab-content-padding: var(--ytd-margin-4x);
}
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy #right-tabs #tab-comments.tab-content-cld ytd-item-section-renderer#sections.style-scope.ytd-comments #contents {
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    min-height: 83vh !important;
    max-height: 83vh !important;
    margin:  -3vh 0 0 0 !important;
    padding: 0 0 0 0 !important;
    overflow: hidden auto !important;
    z-index: 5000000 !important;
border-top: 1px solid silver !important;
border-bottom: 1px solid silver !important;
}



/* TOTARA - TAB VIDEOS */
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy #right-tabs .tab-content-cld:not(.tab-content-hidden) {
    display: inline-block !important;
    height: 100% !important;
    min-height: 95vh !important;
    max-height: 95vh !important;
    padding: 0 0 0 0 !important;
    overflow: hidden !important;
    z-index: 5000000 !important;
background: rgb(17, 17, 17) !important;
border-top: 1px solid silver  !important;
}
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #related.ytd-watch-flexy ytd-watch-next-secondary-results-renderer:before {
  content: "VV" !important;
    	display: none !important;
}

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #related.ytd-watch-flexy ytd-watch-next-secondary-results-renderer ,
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy #right-tabs .tab-content-cld:not(.tab-content-hidden) ytd-watch-next-secondary-results-renderer[is-two-columns] {
    position: fixed;
    display: inline-block;
    width: 100% !important;
    height: 95vh !important;
    top:  0 !important;
    left: 0% !important;
    border-radius: 5px 5px 0px 0px !important;
    overflow: hidden !important;
border-bottom: 3px solid red;
border-right: 5px solid rgb(34, 34, 34);
border-left: 5px solid rgb(34, 34, 34);
}



/* (new71) RELATED VIDEOS TABS */

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #related ytd-watch-next-secondary-results-renderer #items.ytd-watch-next-secondary-results-renderer:not(.thumbnail-and-metadata-wrapper):not(.ytd-video-preview):not(a#lockup-container) {
    position: fixed !important;
    display: inline-block !important;
    width: 100% !important;
    height: 92.5vh !important;
    top: 0.1vh !important;
    left: 0 !important;
    padding: 0vh 5px 0 5px !important;
    overflow: hidden auto;
/*border: 1px dashed aqua  !important;*/
border: 1px solid red !important;
}


/* (new69) TOTARA - VIDEO TAB - ITEMS */

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) .null.ujs-pos-rel.ujs-pos-rel.ujs-pos-rel > a, 

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) .ytd-page-manager.hide-skeleton[player-unavailable=""] #related ytd-watch-next-secondary-results-renderer + #related-skeleton + div a, 

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) #items .ytd-watch-next-secondary-results-renderer:not(ytd-compact-autoplay-renderer):not(yt-related-chip-cloud-renderer), .ytd-watch-next-secondary-results-renderer.suggestion-tag {
    display: block !important;
    float: left;
    clear: none;
    width: 100% !important;
    max-width: 32% !important;
    min-width: 32% !important;
    height: 100% !important;
    min-height: 25vh !important;
    max-height: 180px !important;
    margin: 0px 0rem 0.6rem 0.2rem !important;
    padding: 0.2rem !important;
    border-radius: 3px !important;
background-color: black !important;
/*border: 1px dashed aqua  !important;*/
}

html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy[is-two-columns_] #right-tabs .tab-content #tab-info > ytd-expandable-video-description-body-renderer {
    position: relative;
    display: block !important;
    float: left !important;
    clear: both !important;
    width: 100%;
/*border: 1px solid red !important;*/
}
html:not([plugin-tabview-youtube]):has(tabview-view-pos-thead) ytd-watch-flexy[is-two-columns_] #right-tabs .tab-content #tab-info > ytd-expandable-video-description-body-renderer + ytd-structured-description-content-renderer {
    position: relative;
    display: block !important;
    float: left !important;
    clear: both !important;
    width: 100%;
/*border: 1px solid red !important;*/
}


/* TOTARA - PLAYLIST TAB  - TOP TAB BUTTON - ACTIVE */
#columns.ytd-watch-flexy #primary + #secondary:has(#tab-btn5.active) #tab-btn5.active {
  opacity: 1 !important;
}

#columns.ytd-watch-flexy #primary + #secondary:has(#tab-btn5.active)  #secondary-inner secondary-wrapper #panels + ytd-playlist-panel-renderer {
    position: fixed;
    display: inline-block;
    width: 100% !important;
    min-width: 98% !important;
    max-width: 98% !important;
    min-height: 89vh !important;
    max-height: 89vh !important;
    top:  10vh !important;
    left: 0% !important;
    border-radius: 0px 0px 0px 0px !important;
    overflow: hidden !important;
    z-index: 5000000000 !important;
    opacity: 1 !important;
    visibility: visible !important;
border-bottom: 1px solid rgb(34, 34, 34) !important;
border-left: 1px solid rgb(34, 34, 34);
}
#columns.ytd-watch-flexy #primary + #secondary:has(#tab-btn5.active)  #secondary-inner secondary-wrapper #panels + ytd-playlist-panel-renderer #items.playlist-items.ytd-playlist-panel-renderer{
    min-height: 82.3vh !important;
    max-height: 82.3vh !important;
    padding:  0 0 0 0 !important;
    overflow: hidden auto !important;
border: 1px solid rgb(34, 34, 34) !important;
}
}

@-moz-document domain("youtube.com") {
/* TEST - AGAINST EMBED YOUTUBE in OTHERS SITES cf REDDIT (new66) 
.html5-video-player.ytp-embed .html5-main-video.video-stream
:not(ytd-channel-video-player-renderer)
=== */
/*  NOT EMBED/ CHANNEL PLAYER :not(.ytp-embed)not(#c4-player) */
html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-embed):not(#c4-player):not(.ytp-fullscreen):not(.ytp-hide-controls):not(#inline-preview-player) .html5-main-video.video-stream {
	height: 100% !important;
	max-height: 100% !important;
	min-height: 100% !important;
}
}

@-moz-document domain("youtube.com") {
/* TEST - YOUTUBE EMBED (for REDDIT) PLAYER/POSTER COVER  SIZE (new66) */
/* EMBED - PREVIEW VIDEO */
/* html:not(.floater):not(.iri-always-visible) .html5-video-player.ytp-embed:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-tooltip.ytp-preview:not(.ytp-text-detail):not([style*="display: none;"]) {
    margin-top: 70px !important;
} */
/* (new22)EMBED - PREVIEW VIDEO THUMBNAIL */
#player #movie_player.html5-video-player.ytp-embed.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .ytp-tooltip.ytp-bottom.ytp-preview {
	margin-top: -15vh !important;
}
/* (new22)EMBED - PLAY BUTTON - when PLAYing - SUPP */
#player #movie_player.html5-video-player.ytp-embed.playing-mode.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .ytp-cued-thumbnail-overlay {
	display: none !important;
}
/* (new22)EMBED - BRANDING ICON */
#player #movie_player.html5-video-player.ytp-embed.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .annotation.annotation-type-custom.iv-branding {
	display: none !important;
}

/* EMBED - END SCREEN NONE */
html:not(.floater):not(.iri-always-visible) .html5-video-player.ytp-embed:not(.ytp-fullscreen):not(.ytp-hide-controls) .html5-endscreen.ytp-player-content.videowall-endscreen.ytp-endscreen-paginate.ytp-show-tiles {
	display: none !important;
}

#movie_player.ytp-embed .html5-video-player .video-click-tracking {
	display: inline-block !important;
	height: calc(100% - 2px) !important;
	max-height: 128px !important;
	min-height: 128px !important;
	position: absolute;
	width: 99.7% !important;
border: 1px solid #111 !important;
}
#movie_player.ytp-embed .html5-video-player .ytp-cued-thumbnail-overlay-image {
	position: absolute;
	width: 100% !important;
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain !important;
	height: 100%;
	object-fit: contain;
border: 3px solid red !important;
}
/* (new22)EMBED - PROGRESSBAR - HOVER */
#player #movie_player.html5-video-player.ytp-embed.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode:hover .ytp-chrome-bottom .ytp-progress-bar-container:not([aria-disabled="true"]) {
	margin-top: 0;
	opacity: 1;
	top: -1vh !important;
}
/* (new22)EMBED - PROGRESSBAR - PAUSED */
#player #movie_player.html5-video-player.ytp-embed.paused-mode.ytp-fit-cover-video.ytp-embed.ytp-large-width-mode.ytp-large-width-mode .ytp-chrome-bottom .ytp-progress-bar-container:not([aria-disabled="true"]) {
	margin-top: 0;
	opacity: 1;
	top: 9.9vh !important;
}


/* TEST EMBED YOUTUBE FULLSCREEN - TEST BYPASS AGE RESTRICTION BY ADDING:
/embed/
In place of:
/watch?v=
TEST LINK VID RESTRICTED NORMAL:
https://www.youtube.com/watch?v=YgT3e4CMMD4
TEST LINK VID RESTRICTED URL TWEAKED:
https://www.youtube.com/embed/YgT3e4CMMD4
LINK TIPS:
https://www.wikihow.com/Bypass-Age-Restrictions-on-YouTube-Videos
TEST LINK :
https://ryanseddon.com/css/pointer-events-60fps/
==== */
/* (new45)NOT EMDED - .html5-video-player:not(.ytp-embed) - NOT POPOUT:not(.ytp-iv-drawer-enabled) */
#player:hover .html5-video-player.ytp-embed.ytp-large-width-mode.paused-mode:not(.ytp-fullscreen):not(.ytp-hide-controls):not(.ytp-iv-drawer-enabled):not(#inline-preview-player) .ytp-chrome-bottom,
.html5-video-player.ytp-embed.ytp-large-width-mode.paused-mode:not(.ytp-fullscreen):not(.ytp-hide-controls):not(.ytp-iv-drawer-enabled) .ytp-chrome-bottom {
	width: 100% !important;
	height: 3px;
	left: 0px !important;
	top: 88% !important;
	opacity: 1;
}
.ytp-exp-bigger-button .ytp-chrome-controls {
	height: 40px;
	line-height: 40px;
}
/* (new21) TEST EMBED YOUTUBE - NOT FULLSCREEN - PLAY/PAUSE */
.html5-video-player.ytp-embed.ytp-large-width-mode.playing-mode:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom {
	width: 100%;
	height: 3px;
	left: 0;
	top: 99% !important;
	opacity: 1;
}

/* (new26) TEST EMBED YOUTUBE FULLSCREEN - PLAY HOVER */
/* Cf GM "Maximize Video" : #bodyToothbrush  */
.html5-video-player.ytp-embed.ytp-large-width-mode.playing-mode:not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom {
	top: 99% !important;
background-color: transparent!important;
}
.html5-video-player.ytp-embed.ytp-large-width-mode.playing-mode:not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom .ytp-chrome-controls {
	vertical-align: top;
	height: 35px;
	line-height: 28px;
	margin-top: -48px !important;
background: rgba(0, 0, 0, 0.44) !important;
}

/* (new21) TEST EMBED YOUTUBE FULLSCREEN - ENDED */
.html5-video-player.ytp-embed.ytp-large-width-mode.ended-mode:not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom,
.html5-video-player.ytp-embed.ytp-large-width-mode.ended-mode:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom {
	min-width: 100% !important;
	max-width: 100% !important;
	top: 98% !important;
	left: 0px !important;
	right: 0 !important;
background-color: green !important;
}
.html5-video-player.ytp-embed.ytp-large-width-mode.ended-mode:not(.ytp-fullscreen):not(.ytp-hide-controls):hover .ytp-chrome-bottom .ytp-chrome-controls,
.html5-video-player.ytp-embed.ytp-large-width-mode.ended-mode:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom .ytp-chrome-controls {
	min-width: 100% !important;
	max-width: 100% !important;
	height: 35px;
	line-height: 28px;
	margin-top: -45px !important;
	left: -5px !important;
	right: 0 !important;
	vertical-align: top;
}
}

@-moz-document url-prefix("https://www.youtube.com/results?search_query="), url("https://www.youtube.com/") {
/* HOME + VIDEO SEARCH RESULTS (2 BY ROW ) ==== */


/* START - HOME/VIDEO SEARCH RESULTS - URL PREF ==== */


/* (new56) SEARCH - from SMALL TEST - (search-pyv-renderer - EMPTY ITEMS Deleted by UBLOCK) - SUPP */
#primary.ytd-two-column-search-results-renderer .ytd-item-section-renderer.ytd-item-section-renderer ytd-search-pyv-renderer.ytd-item-section-renderer {
  display: none !important;
  /*background: olive  !important;*/
}


/* (new56) RESULTS SEARCH - POPUP FILTER */
ytd-permission-role-bottom-bar-renderer.ytd-app + ytd-popup-container.ytd-app {
  position: fixed !important;
  top:0;
  min-width: 100% !important;
  z-index: 500000000 !important;
}

ytd-permission-role-bottom-bar-renderer.ytd-app + ytd-popup-container.ytd-app tp-yt-paper-dialog.ytd-popup-container:not([aria-hidden="true"]) {
  position: absolute !important;
	display: inline-block !important;
  top:5vh !important;
	left: 30% !important;
  width: 40% !important;
  z-index: 500000000 !important;
}

/* (new56) RESULTS SEARCH - CONTAINER */
ytd-app #content.ytd-app {
	display: inline-block !important;
	height: 100%!important;
	min-height: 99vh !important;
	max-height: 99vh !important;
	width: 100% !important;
/*background: brown !important;*/
}

ytd-search[has-search-header] #container.ytd-search {
	position: relative;
	display: block;
	flex: 0 0 auto;
	width: 100%;
	height: auto !important;
/* height: 96.3vh !important; */
	overflow: hidden !important;
/*border: 1px solid yellow !important;*/
}

/* LEFT PANEL MENU - OPEN */
html[plugin-tabview-youtube] tp-yt-app-drawer#guide.ytd-app,
html[plugin-tabview-youtube] tp-yt-app-drawer#guide.ytd-app,
tp-yt-app-drawer#guide.ytd-app {
	position: fixed;
	height: 100vh;
	max-height: 100vh;
	left: 0;
	bottom: 0;
	top: 0;
	transition-property: visibility;
	z-index: 100 !important;
border: 1px solid red !important;
}
#contentContainer.tp-yt-app-drawer[opened] {
	padding: 0vh 0 0 0 !important;
}
#contentContainer.tp-yt-app-drawer[opened] .ytd-guide-section-renderer > a.ytd-guide-entry-renderer.yt-simple-endpoint {
    position: relative !important;
    display: inline-block !important;
    flex-direction: unset !important;
    align-items: unset !important;
    min-height: 3vh !important;
    max-height: 3vh !important;
    line-height: 15px !important;
    margin: 0 0 0.4vh 0 !important;
    padding: 2px 0 2px 0 !important;
    font-size: 16px;
/* border: 1px solid aqua !important; */
}
#contentContainer.tp-yt-app-drawer[opened] .ytd-guide-section-renderer > a.ytd-guide-entry-renderer.yt-simple-endpoint > .ytd-guide-entry-renderer {
    position: relative !important;
    display: inline-block !important;
    flex-direction: unset !important;
    align-items: unset !important;
    min-height: 2.6vh !important;
    max-height: 2.6vh !important;
    line-height: 15px !important;
    width: 88% !important;
    font-size: 15px !important;
/* border: 1px solid red !important; */
}
#contentContainer.tp-yt-app-drawer[opened] .ytd-guide-section-renderer > a.ytd-guide-entry-renderer.yt-simple-endpoint > .ytd-guide-entry-renderer .title.ytd-guide-entry-renderer {
    display: inline-block !important;
    width: 95% !important;
    line-height: 2rem;
    margin: 0 0 0 -10% !important;
    font-size: 1.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
/* border: 1px solid pink !important; */
}

#contentContainer.tp-yt-app-drawer[opened] .ytd-guide-section-renderer > a.ytd-guide-entry-renderer.yt-simple-endpoint > .ytd-guide-entry-renderer .guide-icon.ytd-guide-entry-renderer {
    margin: -14px 17px 0 -12px !important;
}


/* (new56) ========== SEARCH RESULTS - BIG LEFT PANEL OPEN - MINI PANEL HIDDEN ======  */

/* LARGE PANEL OPEN - MINI GUIDE HIDDEN */

/* TOP SEARCH - NAVBAR - LEFT PANEL OPEN */
tp-yt-app-drawer#guide[swipe-open] + ytd-mini-guide-renderer.ytd-app[hidden] + ytd-page-manager.ytd-app #header.ytd-search,
ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search {
    position: fixed !important;
    margin: 0 0 0 0 !important;
    min-width: 87% !important;
    max-width: 87% !important;
    z-index: 5000 !important;
background: white !important;
}
/* (new56) DARK */
[dark] tp-yt-app-drawer#guide[swipe-open] + ytd-mini-guide-renderer.ytd-app[hidden] + ytd-page-manager.ytd-app #header.ytd-search,
[dark] ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search {
    background: #111 !important;
}

ytd-search-header-renderer[has-chip-bar] {
    height: 56px;
    max-width: 94% !important;
    padding: 0 0px 0 5% !important;
}
ytd-search-header-renderer {
    display: flex;
    align-items: center;
    max-width: 80% !important;
}
/* (new62)  HOME  */
/*tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app[hidden] + ytd-page-manager#page-manager.ytd-app {
    position: relative;
    width: 87% !important;
    height: auto !important;
    margin: 0vh 0 0 245px !important;
    top: 3.2vh !important;
    overflow: visible !important;
}*/

ytd-search.ytd-page-manager[has-bigger-thumbs][has-search-header]:not([hidden]),
ytd-search.ytd-page-manager[has-search-header]:not([hidden]),
ytd-search.ytd-page-manager[has-bigger-thumbs]:not([hidden]),
ytd-search.ytd-page-manager:not([hidden]),
ytd-search:not([hidden]) {
    position: relative;
    display: inline-block !important;
    height: auto !important;
    height: 96vh !important;
    width: 100% !important;
    top: 0vh !important;
    margin-top: 0vh !important;
    padding: 0 0 0 0 !important;
    overflow-y: hidden auto !important;
    z-index: 0;
/*border: 1px solid aqua !important;*/
}

tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app[hidden] + ytd-page-manager#page-manager.ytd-app #contents.ytd-rich-grid-renderer  {
    position: relative;
    width: 100% !important;
    height: auto !important;
    margin: 0vh 0 0 0px !important;
    top: 2vh !important;
    padding: 0 0 0 0 !important;
    overflow-y: hidden !important;
/*background: olive !important;*/
/*border: 1px dashed pink !important;*/
}




/* (new71) ========== SEARCH RESULTS - MINI PANEL VISIBLE ======  */

/* (new71) TOP SEARCH - with MINI PANEL - NAVBAR - MINI GUIDE VISIBLE - BIG LEFT PANEL CLOSE  */
ytd-mini-guide-renderer.ytd-app[mini-guide-visible] + ytd-page-manager#page-manager ytd-search.ytd-page-manager #header.ytd-search,
tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search {
    position: fixed !important;
    width: 100% !important;
    max-width: 100% !important;
    top: 3.6vh !important;
    margin: 0vh 0 0 0 !important;
    z-index: 5000 !important;
/*background: gold !important;*/
}
/* tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search + ytd-two-column-search-results-renderer.ytd-search[mini-guide-visible] , */
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search {
    width: 100% !important;
    min-width: 86vw !important;
    max-width: 86vw !important;
    margin: 6.3vh 0 0 0 !important;
/*background: peru !important;*/
}
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 86.5vh !important;
    overflow: hidden auto !important;
/*border: 1px solid aqua  !important;*/
}

/* (new71) SEARCH - SHORT - SIMILAR SEARCH CARROUSEL HORIZONTAL  */
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents ytd-horizontal-card-list-renderer:not(.ytd-expandable-metadata-renderer) {
    display: inline-block !important;
    min-width: 84vw !important;
    max-width: 84vw !important;
    margin:  2vh 0 2vh 10px !important;
border: 1px solid silver  !important;
}


/* (new71) SEARCH - SHORT - CONTAINER */
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer {
    position: relative;
    display: inline-block !important;
    -moz-box-orient: unset !important;
    -moz-box-direction: unset !important;
    flex-direction: unset !important;
    height: auto !important;
    margin:  0 0 0 0 !important;
    padding: 0 0 0vh 0 !important;
/*background: brown !important;*/
/*border: 1px solid aqua  !important;*/
}

/* (new71) SEARCH - SHORT - ITEMS - HEADER */
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer yt-section-header-view-model {
    display: inline-block !important;
    width: 98% !important;
    height: 3vh !important;
    line-height: 3vh !important;
/*border: 1px solid aqua  !important;*/
}
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer yt-section-header-view-model .yt-shelf-header-layout--disable-horizontal-padding {
    display: inline-block !important;
    max-height: 3vh !important;
    min-height: 3vh !important;
    line-height: 2vh !important;
    padding: 0 0 0 0 !important;
/*background: olive !important;*/
}

/* (new71) SEARCH - SHORT - ITEMS - ITEMS */
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer .ytd-item-section-renderer > div {
    display: block;
    float: left !important;
    width: 48% !important;
    height: 20vh !important;
    margin:  0 10px 0 10px !important;
    border-radius: 5px !important;
border: 1px solid silver !important;
}

/* (new71) SEARCH - SHORT - ITEMS - LAST ITEM */
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer .ytGridShelfViewModelGridShelfRow.ytd-item-section-renderer:last-of-type .ytGridShelfViewModelGridShelfItem {
    display: block;
    float: left !important;
    width: 100% !important;
    height: 20vh !important;
    margin:  0 10px 0 10px !important;
    border-radius: 5px !important;
border: 1px solid silver !important;
}


ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer ytm-shorts-lockup-view-model-v2{
    display: inline-block !important;
    width: 100% !important;
    height: 20vh !important;
    margin:  0 0px 0 0 !important;
    overflow: hidden !important;
/*border: 1px solid yellow  !important;*/
}
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer ytm-shorts-lockup-view-model-v2 ytm-shorts-lockup-view-model{
    display: inline-block !important;
    width: 100% !important;
    height: 20vh !important;
    margin:  0 0px 0 0 !important;
    overflow: hidden !important;
/*border: 1px solid yellow  !important;*/
}
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer ytm-shorts-lockup-view-model-v2 ytm-shorts-lockup-view-model .shortsLockupViewModelHostEndpoint {
    position: relative;
    display: block;
    float: left !important;
    width: 50% !important;
  text-decoration: none;
/*border: 1px solid yellow  !important;*/
}
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer ytm-shorts-lockup-view-model-v2 yt-thumbnail-view-model{
  padding-top: 0% !important;
    height: 20vh !important;
    object-fit: contain !important;
}
ytd-search[has-search-header] ytd-two-column-search-results-renderer.ytd-search #primary ytd-section-list-renderer.ytd-two-column-search-results-renderer #contents.ytd-section-list-renderer grid-shelf-view-model.ytd-item-section-renderer ytm-shorts-lockup-view-model-v2 yt-thumbnail-view-model img{
  padding-top: 0% !important;
    height: 20vh !important;
    object-fit: contain !important;
}

/* (new71) SEARCH - SHORT - ITEMS - META */
a.shortsLockupViewModelHostEndpoint.reel-item-endpoint + .shortsLockupViewModelHostOutsideMetadata.shortsLockupViewModelHostMetadataRounded.shortsLockupViewModelHostOutsideMetadataHasMenu {
    position: relative;
    display: block;
    float: right  !important;
    min-width: 48% !important;
    max-width: 48% !important;
    min-height: 20vh !important;
    max-height: 20vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 0 !important;
    border-radius:  0 !important;
border: 1px solid silver  !important;
}


a.shortsLockupViewModelHostEndpoint.reel-item-endpoint + .shortsLockupViewModelHostOutsideMetadata.shortsLockupViewModelHostMetadataRounded.shortsLockupViewModelHostOutsideMetadataHasMenu > div:not(.image-overlay-text) {
    position: relative;
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    min-height: 20vh !important;
    max-height: 20vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 0 !important;
/*border: 1px solid yellow  !important;*/
}
a.shortsLockupViewModelHostEndpoint.reel-item-endpoint + .shortsLockupViewModelHostOutsideMetadata.shortsLockupViewModelHostMetadataRounded.shortsLockupViewModelHostOutsideMetadataHasMenu > div:not(.image-overlay-text) h3.shortsLockupViewModelHostOutsideMetadataTitle {
    position: relative;
    display: block;
    float: left  !important;
    width: 100% !important;
    min-width: 98% !important;
    max-width: 98% !important;
    height: 100% !important;
    min-height: 17vh !important;
    max-height: 17vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 0 !important;
/*border: 1px solid yellow  !important;*/
}

a.shortsLockupViewModelHostEndpoint.reel-item-endpoint + .shortsLockupViewModelHostOutsideMetadata.shortsLockupViewModelHostMetadataRounded.shortsLockupViewModelHostOutsideMetadataHasMenu > div:not(.image-overlay-text) .shortsLockupViewModelHostOutsideMetadataSubhead {
    position: relative;
    display: block;
    float: left  !important;
    min-width: 100% !important;
    max-width: 100% !important;
    min-height: 5vh !important;
    max-height: 5vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 5px !important;
border-top: 1px solid silver !important;
}


a.shortsLockupViewModelHostEndpoint.reel-item-endpoint + .shortsLockupViewModelHostOutsideMetadata.shortsLockupViewModelHostMetadataRounded.shortsLockupViewModelHostOutsideMetadataHasMenu > div:not(.image-overlay-text) h3.shortsLockupViewModelHostOutsideMetadataTitle a {
    position: relative;
    display: inline-block !important;
    width: 100% !important;
    min-width: 98% !important;
    max-width: 98% !important;
    height: 100% !important;
    min-height: 20vh !important;
    max-height: 20vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 0 !important;
/*border: 1px solid yellow  !important;*/
}

a.shortsLockupViewModelHostEndpoint.reel-item-endpoint + .shortsLockupViewModelHostOutsideMetadata.shortsLockupViewModelHostMetadataRounded.shortsLockupViewModelHostOutsideMetadataHasMenu > div:not(.image-overlay-text) a.shortsLockupViewModelHostEndpoint.shortsLockupViewModelHostOutsideMetadataEndpoint span{
    position: relative;
    float: left  !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical !important;
    width: 100% !important;
    min-width: 97% !important;
    max-width: 97% !important;
    height: 100% !important;
    min-height: 16.5vh !important;
    max-height: 16.5vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 5px 0 05px !important;
    overflow: hidden !important;
    text-overflow: ellipsis;

/*border: 1px solid yellow  !important;*/
}

/* (new71) SEARCH - SHORT - ITEMS - BUT MORE / LESS */
.ytGridShelfViewModelGridShelfBottomButtonContainer {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 130px;
  background-color: transparent !important;
  transform: translate(-50%,50%);
}

/* (new71) SEARCH - SHORT - CONTINATION */
#contents.ytd-item-section-renderer + #continuations {
    position: relative;
    float: left  !important;
    width: 100% !important;
    height: 1vh !important;
    margin: 0 0 0 0 !important;
/*background-color: red !important;*/
}



/* (new71) SEARCH - SHORT - ITEMS - HORIZONTAL */

.yt-lockup-view-model.yt-lockup-view-model--horizontal.yt-lockup-view-model--collection-stack-2{
    width: 100% !important;
    min-width: 100% !important;
    margin: 0 0 0 0 !important;
/*border: 1px solid aqua !important;*/
}
/* (new71) SEARCH - SHORT - ITEMS - HORIZ THUMB */
.yt-lockup-view-model.yt-lockup-view-model--horizontal.yt-lockup-view-model--collection-stack-2 .yt-lockup-view-model__content-image {
    position: relative;
    display: block !important;
    float: left !important;
    min-width: 50% !important;
    max-width: 50% !important;
    min-height: 20vh !important;
    max-height: 20vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 0 !important;
/*border: 1px solid yellow  !important;*/
}

/* (new71) SEARCH - SHORT - ITEMS - HORIZ META */
.yt-lockup-view-model.yt-lockup-view-model--horizontal.yt-lockup-view-model--collection-stack-2 .yt-lockup-view-model__metadata {
    position: relative;
    display: block !important;
    float: right  !important;
    min-width: 48% !important;
    max-width: 48% !important;
    min-height: 20vh !important;
    max-height: 20vh !important;
    margin: -14.5vh 0 0 50.3% !important;
    padding: 0 5px 0 5px !important;
/*border: 1px solid aqua  !important;*/
}


/* MEDIA QUERIES QUANTUM - MINI GUIDE VISIBLE */
#primary.ytd-two-column-search-results-renderer {
    width: 100% !important;
    min-width: 100% !important;
}
ytd-mini-guide-renderer[mini-guide-visible] + ytd-page-manager#page-manager.ytd-app #primary.ytd-two-column-search-results-renderer {
    width: 100% !important;
    min-width: 100% !important;
    padding: 0 0 0 20% !important;
}

/* ytd-app:not([guide-persistent-and-visible]) #page-manager.ytd-app:not(.parentToothbrush), html[plugin-tabview-youtube] ytd-app:not([guide-persistent-and-visible]) #page-manager.ytd-app:not(.parentToothbrush) , */
tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app {
    height: 100vh;
    margin: 3vh 0 0 0 !important;
    max-height: 96.5vh !important;
    min-height: 96.5vh !important;
    padding: 0 0 0 0 !important;
    overflow: hidden !important;
    overflow-x: hidden !important;
/*background: green !important;*/
/*border: 1px dashed aquamarine !important;*/
}

tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app ytd-search[has-search-header][has-bigger-thumbs] {
    position: relative;
    display: inline-block !important;
    height: auto !important;
    height: 99.5vh !important;
    width: 100% !important;
    top: 0vh !important;
    margin-top: 0vh !important;
    padding: 0 0 0 0 !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    z-index: 0;
/*border: 1px dashed pink !important;*/
}

tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app ytd-search[has-search-header][has-bigger-thumbs] > #container {
    position: relative;
    display: inline-block !important;
    flex: 0 0 auto;
    height: 99vh !important;
    width: 100%;
    overflow: hidden;
/*border: 1px dashed violet !important;*/
}

tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search + ytd-two-column-search-results-renderer.ytd-search[mini-guide-visible] {
    position: relative;
    display: inline-block !important;
    height: auto !important;
    height: 95.5vh !important;
    width: 100% !important;
    top: 9.3vh !important;
    margin: -3vh 0 0 !important;
    padding: 0 0 0 0 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    z-index: 0;
/*border: 1px dashed aqua !important;*/
}

tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search + ytd-two-column-search-results-renderer.ytd-search[mini-guide-visible] #contents.ytd-section-list-renderer {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    margin: 0vh 0 0 0 !important;
    padding: 0 0 0 0% !important;
/*background: orangered !important;*/
}
tp-yt-app-drawer#guide + ytd-mini-guide-renderer.ytd-app:not([hidden]) + ytd-page-manager#page-manager.ytd-app ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search + ytd-two-column-search-results-renderer.ytd-search[mini-guide-visible] #primary.ytd-two-column-search-results-renderer {
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    padding: 0 0 0 150px !important;
}

/* (new57) SEARCH RESULTS - ITEMS - from SMALL TEST :not(ytd-search-pyv-renderer) */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer) {
    float: left  !important;
    height: 25vh !important;
    width: 100% !important;
    max-width: calc(800px + var(--ytd-rich-grid-item-margin)) !important;
    margin: 0 3px 4px 0 !important;
    border-radius: 5px  !important;
    overflow: visible !important;
/*background: brown !important;*/
border: 1px solid #333 !important;
}
/* NOT DARK */
html:not([dark]) #contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer) {
    border: 1px solid silver !important;
}

#contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer)[modern-typography]:not(ytd-search-pyv-renderer) {
    display: flex !important;
    float: left !important;
    height: 30vh !important;
    width: 100% !important;
    max-width: calc(810px + var(--ytd-rich-grid-item-margin)) !important;
    margin: 0 1px !important;
/*background: GREEN !important;*/
/*border: 1px solid aqua !important;*/
}

/* (new57) */
#contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer[modern-typography] .grid-subheader + #contents  ytd-vertical-list-renderer.ytd-shelf-renderer #items.ytd-vertical-list-renderer ytd-video-renderer.ytd-vertical-list-renderer {
    float: left  !important;
    height: 25vh !important;
    width: 100% !important;
    max-width: calc(800px + var(--ytd-rich-grid-item-margin)) !important;
    margin: 0 3px 4px 0 !important;
    border-radius: 5px  !important;
    overflow: visible !important;
  /*pointer-events: none !important;*/
/*background: olive!important;*/
border: 1px solid #333 !important;
/*border: 1px solid aqua !important;*/
}

/* ACTU /  ASSOCAITED SEARCH - CARROUSEL */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer).ytd-item-section-renderer:has(.grid-subheader)  {
    float: left  !important;
    height: 25vh !important;
    width: 100% !important;
    max-width: calc(800px + var(--ytd-rich-grid-item-margin)) !important;
    margin: 0 3px 4px 0 !important;
    border-radius: 5px  !important;
    overflow: visible !important;
background: brown !important;
border: 1px solid #333 !important;
}
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer).ytd-item-section-renderer:has(.grid-subheader) .grid-subheader.ytd-shelf-renderer {
    height: 2vh !important;
    margin-top: 0px !important;
}
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer).ytd-item-section-renderer:has(.grid-subheader) #contents.ytd-shelf-renderer {
  margin-top: 0px !important;
}
/* (new57) EXPANDABLE THUMBNAIL */
#contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer[modern-typography] .grid-subheader + #contents  ytd-vertical-list-renderer.ytd-shelf-renderer #items.ytd-vertical-list-renderer ytd-video-renderer.ytd-vertical-list-renderer  #expandable-metadata.ytd-video-renderer:not(:empty) ,

#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer)  #expandable-metadata.ytd-video-renderer:not(:empty) {
    position: absolute !important;
    display: inline-block !important;
    width: 100% !important;
    min-width: 395px !important;
    max-width: 395px !important;
    bottom: -1.5vh !important;
/*border: 1px solid aqua  !important;*/
}
#contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer[modern-typography] .grid-subheader + #contents  ytd-vertical-list-renderer.ytd-shelf-renderer #items.ytd-vertical-list-renderer ytd-video-renderer.ytd-vertical-list-renderer  #expandable-metadata.ytd-video-renderer:not(:empty) ytd-expandable-metadata-renderer[use-custom-colors] ,

#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer)  #expandable-metadata.ytd-video-renderer:not(:empty) ytd-expandable-metadata-renderer[use-custom-colors] {
    top: 0vh !important;
/*background: olive !important;*/
/*border: 1px solid aqua  !important;*/
}


/* (new57) WITH RIGHT PANEL - INFOS - .ytd-section-list-renderer */
ytd-secondary-search-container-renderer#secondary.ytd-two-column-search-results-renderer:not([hidden]) {
    position: fixed  !important;
	width: 20% !important;
    height: 89vh !important;
    margin:  0 0px 0 0 !important;
    right: -21% !important;
    padding: 0px 5px !important;
    overflow: hidden !important;
    transition: all ease 0.7s !important;
    z-index: 500000 !important;
    /*background: olive  !important;*/
border: 1px solid red !important;
}
/* HOVER */
ytd-secondary-search-container-renderer#secondary.ytd-two-column-search-results-renderer:not([hidden]):hover {
    position: fixed  !important;
	width: 20% !important;
    height: 89vh !important;
    margin:  0 0px 0 0 !important;
    right: 0% !important;
    padding: 0px 35px 0 5px !important;
    overflow: hidden !important;
    z-index: 5000 !important;
    transition: all ease 0.7s !important;
background: #111  !important;
/*background: aqua  !important;*/
border: 1px solid red !important;
}
ytd-secondary-search-container-renderer#secondary.ytd-two-column-search-results-renderer:not([hidden]) #channel-name{
    position: fixed  !important;
	width: 20% !important;
    height: 3vh !important;
    margin:  0 0px 0 0 !important;
    right: -9.5% !important;
    top: 30vh !important;
    padding: 0px 5px !important;
    border-radius: 0  0  5px 5px !important;
    overflow: hidden !important;
    transform: rotate(90deg) !important;
background: #111  !important;
/*background: aqua  !important;*/
border: 1px solid red !important;
}
ytd-secondary-search-container-renderer#secondary.ytd-two-column-search-results-renderer:not([hidden]) #channel-name:after {
    content: "🔻" !important;    
/*border: 1px solid red !important;*/
}
/* (new57) */
ytd-secondary-search-container-renderer#secondary.ytd-two-column-search-results-renderer:not([hidden])  #sections.ytd-universal-watch-card-renderer  {
    height: 48vh !important;
    margin:  0 0px 0 0 !important;
    right: 0 !important;
    padding: 0px 5px !important;
    overflow: hidden !important;
    overflow-y: auto !important;
/*background: peru  !important;*/
border: 1px solid red !important;
}

/* (new57) NOT DARK */
html:not([dark]) ytd-secondary-search-container-renderer#secondary.ytd-two-column-search-results-renderer:not([hidden]) #channel-name ,
html:not([dark]) ytd-secondary-search-container-renderer#secondary.ytd-two-column-search-results-renderer:not([hidden]) {
    background: white  !important;
}

html:not([dark]) #contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer[modern-typography] .grid-subheader + #contents  ytd-vertical-list-renderer.ytd-shelf-renderer #items.ytd-vertical-list-renderer ytd-video-renderer.ytd-vertical-list-renderer  #expandable-metadata.ytd-video-renderer:not(:empty) ytd-expandable-metadata-renderer[use-custom-colors] ,

html:not([dark]) #contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer)  #expandable-metadata.ytd-video-renderer:not(:empty) ytd-expandable-metadata-renderer[use-custom-colors] {
    color: red !important;
    background: white!important;
    border: 1px solid #333  !important;
}
/* (new57) NO DARK - EXPANDABLE - ICON */
html:not([dark]) #contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer[modern-typography] .grid-subheader + #contents  ytd-vertical-list-renderer.ytd-shelf-renderer #items.ytd-vertical-list-renderer ytd-video-renderer.ytd-vertical-list-renderer  #expandable-metadata.ytd-video-renderer:not(:empty) ytd-expandable-metadata-renderer[use-custom-colors]  yt-icon div ,

html:not([dark]) #contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]):not(ytd-search-pyv-renderer)  #expandable-metadata.ytd-video-renderer:not(:empty) ytd-expandable-metadata-renderer[use-custom-colors]  yt-icon div {
    fill: red !important;
    stroke: peru !important;
/*border: 1px solid green !important;*/
}


/* LARGE - SHORTS / WITH ARROWS - MINI VISIBLE */
/* #items.ytd-vertical-list-renderer > .ytd-vertical-list-renderer:not(.lockup) */
#contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer:not(ytd-ad-slot-renderer)[modern-typography][thumbnail-style] {
    display: flex !important;
    float: left !important;
    height: auto !important;
    width: 100% !important;
    min-width: 85.95% !important;
    max-width: 85.95% !important;
    margin: 0 1px !important;
/*background: blue !important;*/
/*border: 1px solid aqua !important;*/
}
/* LARGE - SHORTS / WITH ARROWS - MINI HIDDEN - ytd-mini-guide-renderer.ytd-app[hidden] */
/* ytd-mini-guide-renderer.ytd-app[hidden] + ytd-page-manager #contents.ytd-rich-grid-renderer ytd-rich-section-renderer.ytd-rich-grid-renderer */
ytd-mini-guide-renderer.ytd-app[hidden] + ytd-page-manager #contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer:not(ytd-ad-slot-renderer)[modern-typography][thumbnail-style] {
    display: flex !important;
    float: left !important;
    height: auto !important;
    width: 100% !important;
    min-width: 99.2% !important;
    max-width: 99.2% !important;
    margin: 0 1px 4px 1px !important;
/*background: aqua !important;*/
/*border: 1px solid aqua !important;*/
}

#contents.ytd-item-section-renderer > ytd-shelf-renderer.ytd-item-section-renderer:not(ytd-ad-slot-renderer)[modern-typography][thumbnail-style] .grid-subheader.ytd-shelf-renderer {
    position: absolute !important;
    margin: 0 0 0 0 !important;
}

/* (new56) SERACH - CONTAINER WITH MORE - , #all.ytd-vertical-list-renderer */

ytd-vertical-list-renderer #items.ytd-vertical-list-renderer > .ytd-vertical-list-renderer  {
/*display: flex; */
    display: inline-block !important;
    float: none !important;
    height: 25vh;
    width: 100%;
    min-width: calc(797px + var(--ytd-rich-grid-item-margin)) !important;
    max-width: calc(797px + var(--ytd-rich-grid-item-margin)) !important;
    margin: 0 3px 4px 0 !important;
	border-radius: 5px  !important;
/*background: pink !important;*/
/*border: 1px solid aqua;*/
}

/* (new56) MORE - , #all.ytd-vertical-list-renderer */
#more.ytd-vertical-list-renderer {
    position: relative !important;
    width: 30% !important;
    margin: 2vh 0 0 34.5% !important;
    top: 0 !important;
    padding: 2px 10px !important;
    border-radius: 8px !important;
background: #222 !important;
border: 1px solid #333 !important;
}
#more.ytd-vertical-list-renderer span {
    color: peru !important;
}
/* NO DARK */
html:not([dark]) #more.ytd-vertical-list-renderer {
background: white !important;
border: 1px solid silver !important;
}
html:not([dark]) #more.ytd-vertical-list-renderer span {
    color: peru !important;
}

/* (new56) LARGE - SHORTS */
#contents.ytd-item-section-renderer > ytd-reel-shelf-renderer.ytd-item-section-renderer[modern-typography] {
    display: inline-block !important;
    height: 25vh !important;
    width: 100% !important;
    min-width: calc(800px + var(--ytd-rich-grid-item-margin)) !important;
    max-width: calc(800px + var(--ytd-rich-grid-item-margin)) !important;
    margin: 0 3px 4px 0 !important;
/* overflow: hidden !important; */
/*background: tan !important;*/
/*border: 1px solid aqua !important;*/
}

#contents.ytd-reel-shelf-renderer {
    margin-top: 25px !important;
}
#contents.ytd-item-section-renderer > ytd-reel-shelf-renderer.ytd-item-section-renderer[modern-typography] #title-container.ytd-reel-shelf-renderer {
    position: absolute !important;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 2rem;
    margin: 0 0 0 0 !important;
/*background: aqua !important;*/
}
yt-horizontal-list-renderer #scroll-outer-container #dismissible.ytd-reel-item-renderer ytd-thumbnail.ytd-reel-item-renderer {
	height: 12vh !important;
}
yt-horizontal-list-renderer #scroll-outer-container #dismissible.ytd-reel-item-renderer ytd-thumbnail.ytd-reel-item-renderer a#thumbnail.ytd-thumbnail {
    background-color: rgba(0, 0, 0, 83) !important;
    height: 194px !important;
    padding: 5px !important;
}
yt-horizontal-list-renderer #scroll-outer-container #dismissible.ytd-reel-item-renderer ytd-thumbnail.ytd-reel-item-renderer a#thumbnail.ytd-thumbnail img {
    object-fit: contain !important;
background-color: rgba(0, 0, 0, 83) !important;
}

/* INTERACTION - ALL NORMAL */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible {
    width: 100% !important;
    max-height: 25vh !important;
    pointer-events: auto !important;
/* border: 1px solid yellow !important; */
}

/* THUMBNAIL VIDEO WRAPER */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > ytd-thumbnail.ytd-video-renderer[use-hovered-property][size="large"] {
    max-width: 500px;
    min-width: 240px;
    pointer-events: auto !important;
}

/* (new56) TEXT WRAPER */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > .text-wrapper.ytd-video-renderer {
    max-width: none;
/*pointer-events: none !important;*/
}

/* (new56) TEXT WRAPER - CHAPTER EXPANDABLE - OPEN */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > .text-wrapper.ytd-video-renderer  #expandable-metadata.ytd-video-renderer:not(:empty)  ytd-expandable-metadata-renderer[use-custom-colors][is-expanded] {
    position: relative !important;
    height: auto !important;
    margin: 0 15px 0 0px !important;
    bottom: 12vh !important;
    right: 10px !important;
    overflow: hidden !important;
}
/* (new56) TEXT WRAPER - CHAPTER EXPANDABLE - NOT OPEN */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > .text-wrapper.ytd-video-renderer  #expandable-metadata.ytd-video-renderer:not(:empty)  ytd-expandable-metadata-renderer[use-custom-colors]:not([is-expanded]) {
    position: relative !important;
    height: 4vh !important;
    margin: 0 0px 0 0px !important;
    bottom: -6vh !important;
    right: 10px !important;
    overflow: hidden !important;
}
/* DARK/ NOT DARK */
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > .text-wrapper.ytd-video-renderer  #expandable-metadata.ytd-video-renderer:not(:empty)  ytd-expandable-metadata-renderer[use-custom-colors][is-expanded]  ,
#contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > .text-wrapper.ytd-video-renderer  #expandable-metadata.ytd-video-renderer:not(:empty)  ytd-expandable-metadata-renderer[use-custom-colors]:not([is-expanded]){
  background: #222 !important;
  border: none;
}
html:not([dark]) #contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > .text-wrapper.ytd-video-renderer  #expandable-metadata.ytd-video-renderer:not(:empty)  ytd-expandable-metadata-renderer[use-custom-colors][is-expanded]  ,
html:not([dark]) #contents.ytd-item-section-renderer > .ytd-item-section-renderer:not(ytd-ad-slot-renderer):not(ytd-reel-shelf-renderer):not(ytd-shelf-renderer):not([modern-typography]) #dismissible > .text-wrapper.ytd-video-renderer  #expandable-metadata.ytd-video-renderer:not(:empty)  ytd-expandable-metadata-renderer[use-custom-colors]:not([is-expanded]) {
  background: white !important;
  border: 1px solid silver !important;
}

/* (new56) PREVIEW VIDEO - SHORT */
#media-container.ytd-video-preview {
  overflow: visible !important;
}

a#media-container-link[href^="/shorts"] #player-container {
    position: fixed !important;
    display: inline-block !important;
    height: 100% !important;
    min-height: 23vh !important;
    max-height: 23vh !important;
    left: -10px !important;
    top: -0.5vh !important;
    margin: 0vh 0 0 0px !important;
    padding: 0px 0px 0px 0px !important;
    transform: scale(0.91) !important;
    object-fit: contain !important;
    z-index: 50000000 !important;
/*background-color: red!important;*/
/*background-color: yellowgreen !important;*/
/*border: 1px solid yellow !important;*/
}

/* PREVIEW CAPTION */
#video-preview #ytp-caption-window-container > * {
    bottom: -2.3vh !important;
    transform: scale(0.6) !important;
 background: rgba(0, 0, 0, 0.48) !important;
}


/* END === HOME + VIDEO RESULTS SEARCH === */
}

@-moz-document url("https://www.youtube.com/") {
/* HOME / ALL?? - YOUTUBE  (new60) */

ytd-two-column-browse-results-renderer.ytd-browse #contents.ytd-rich-grid-renderer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-top: 0 !important;
    width: 100%;
    height: 87.5vh !important;
    overflow: hidden auto !important;
border-top: 1px solid red  !important;
}

/* (new60) HOME - YOUTUBE - VIDEO PREVIEW on HOVER */
/*#video-preview ytd-video-preview:not([hidden]) {
	display: inline-block!important
}*/
ytd-video-preview[active] {
/*border: 1px solid orange !important;*/
}
#video-preview-container.ytd-video-preview {
/*border: 1px solid peru !important;*/
}

/* #video-preview ytd-video-preview #video-preview-container #media-container #media-container-link #player-container #inline-player.ytd-video-preview .html5-video-container .video-stream.html5-main-video */
#video-preview #video-preview-container {
    overflow: hidden !important;
    border-radius: 9px  !important;
/*border: 1px solid violet !important;*/
}

/* LARGE */
#video-preview ytd-video-preview  #video-preview-container #player-container {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
	height: 100% !important;
    min-height: 100% !important;
	max-height: 100% !important;
    margin: -0.5%  0 0 -0.5% !important;
/*border: 1px solid blue !important;*/
}
/* SHORT [style*="--ytd-video-preview-initial-scale: scale(1);"] */
#video-preview ytd-video-preview[style*="--ytd-video-preview-initial-scale: scale(1);"]  #video-preview-container #player-container {
    position: absolute  !important;
    width: 100% !important;
    min-width: 110% !important;
    max-width: 110% !important;
	height: 100% !important;
    min-height: 110% !important;
	max-height: 110% !important;
    margin: -9% 0  0% 0% !important;
    transform: scale(1) !important;
/*border: 1px solid lime !important;*/
}

#video-preview #video-preview-container #player-container #inline-player.ytd-video-preview {
/*border: 1px solid aqua !important;*/
}
#video-preview #video-preview-container #player-container #inline-player.ytd-video-preview .html5-video-container {
/*border: 1px solid gold !important;*/
}
#video-preview #video-preview-container #player-container #inline-player.ytd-video-preview .html5-video-container .video-stream.html5-main-video {
/*border: 1px solid green !important;*/
}


#preview ytd-video-preview[active]{
    background: rgba(28, 28, 28, 0.9) ;
    border: 1px solid red !important;
}
/* NO DARK */
html:not([dark]):not([dark="true"]):not(.style-scope) #preview ytd-video-preview[active]{
    background: rgba(28, 28, 28, 0.3) ;
    border: 1px solid red !important;
} 

/* (new41) YOUTUBE STUDIO */

/*  MISE EN LIGNES LIST */
#dialog.ytcp-multi-progress-monitor {
    position: fixed;
    max-height: 60vh !important;
    min-width: 20vw !important;
    bottom: 0;
    right: 0.5rem !important;
    margin: 0 0 0 0 !important;
    overflow: hidden;
border: 1px solid red !important;
}

#progress-list.ytcp-multi-progress-monitor {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-height: 60vh !important;
    max-height: 60vh !important;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0;
/* color: gold !important; */
}
.row.ytcp-multi-progress-monitor {
    align-items: center;
    display: inline-block !important;
    padding: 0 8px;
}
.edit-button.ytcp-multi-progress-monitor {
    align-items: center;
    height: 55px !important;
    outline: medium none;
    overflow: hidden;
    width: 100%;
}
.row.ytcp-multi-progress-monitor .edit-button.ytcp-multi-progress-monitor .progress-title{
    display: inline-block !important;
        min-width: 85% !important;
    margin-right: auto;
    overflow: hidden;
    padding-left: 8px;
    text-align: start;
    text-overflow: ellipsis;
    white-space: nowrap;
color: gold !important;
/* border: 1px solid red !important; */
}
/* .row.ytcp-multi-progress-monitor .edit-button.ytcp-multi-progress-monitor:visited .progress-title{
color: red !important;
} */
.progress-status-text.ytcp-multi-progress-monitor {
    position: absolute !important;
    display: inline-block !important;
    max-width: 70% !important;
    margin: 4vh 0  0 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
/* color: red !important; */
}
.progress-row-icon.ytcp-multi-progress-monitor {
    position: absolute !important;
    height: 15px !important;
    width: 15px !important;
    left: 3.4rem !important;
    margin: -3.8vh 0  0 0px;
    padding: 0 !important;
border-radius: 100% !important;
/* border: 1px solid red !important; */
}

/* HOVER */
#dialog.ytcp-multi-progress-monitor:hover {
    position: fixed;
    max-height: 60vh !important;
    min-width: 30vw !important;
    bottom: 0;
    right: 0.5rem !important;
    margin: 0 0 0 0 !important;
    overflow: hidden;
border: 1px solid red !important;
}
#dialog.ytcp-multi-progress-monitor:hover .progress-status-text.ytcp-multi-progress-monitor {
    text-align: right !important;
    display: inline-block;
    min-width: 80% !important;
}

/* (new22) HOME - YOUTUBE - in 2 Coumn - TOP HEADER - TAGS */
#chips-wrapper.ytd-feed-filter-chip-bar-renderer {
    z-index: 20000 !important;
}
#chips-wrapper.ytd-feed-filter-chip-bar-renderer  #scroll-container {
    position: relative;
    width: 100vw !important;
    overflow: hidden;
    white-space: nowrap;
    z-index: 100 !important;
}

/* (new22) HOME - YOUTUBE - in 2 Coumn - LEFT GUIDE */
#content #guide #guide-spacer {
    margin-top: 4vh !important;
}
}

@-moz-document domain("youtube.com") {
/* RESET - CHROME for TABVIEW */

@media screen and (-webkit-min-device-pixel-ratio:0) {

/* START - URL PREF - RESET CHROME/QUANTUM ONLY = for PLAY NEXT QUEUE + TABVIEW ==== */
/* (new51) RESET */
html[plugin-tabview-youtube] ytd-comment-thread-renderer:not([can-reorder]):not([touch-persistent-drag-handle]),
html[plugin-tabview-youtube] ytd-comment-renderer:not([can-reorder]):not([touch-persistent-drag-handle]),
html[plugin-tabview-youtube] ytd-comment-replies-renderer:not([can-reorder]):not([touch-persistent-drag-handle]),
html[plugin-tabview-youtube] ytd-compact-video-renderer:not([can-reorder]):not([touch-persistent-drag-handle]),

html[plugin-tabview-youtube] ytd-watch-flexy #player,
html[plugin-tabview-youtube] ytd-player#ytd-player,
html[plugin-tabview-youtube] ytd-masthead > #container .ytd-masthead,
html[plugin-tabview-youtube] ytd-masthead > #container,
html[plugin-tabview-youtube] #masthead-container,
html[plugin-tabview-youtube] ytd-masthead#masthead,
html[plugin-tabview-youtube] #tab-comments ytd-comments,
html[plugin-tabview-youtube] #tab-comments ytd-item-section-renderer,
html[plugin-tabview-youtube] #tab-comments #contents,
html[plugin-tabview-youtube] ytd-watch-flexy[is-two-columns_] #tab-videos [placeholder-videos],
html[plugin-tabview-youtube] ytd-watch-flexy[is-two-columns_] #tab-videos ytd-watch-next-secondary-results-renderer,
html[plugin-tabview-youtube] ytd-watch-flexy[is-two-columns_] #tab-videos #items,
html[plugin-tabview-youtube] #secondary #secondary-inner #right-tabs #tab-videos.tab-content-cld:not(.tab-content-hidden),
html[plugin-tabview-youtube] ytd-watch-flexy[is-two-columns_] #right-tabs .tab-content-cld,
html[plugin-tabview-youtube] ytd-watch-flexy[is-two-columns_] #right-tabs .tab-content,
html[plugin-tabview-youtube] ytd-watch-flexy[is-two-columns_] #right-tabs,
html[plugin-tabview-youtube] ytd-watch-flexy[tabview-selection=""] #right-tabs .tab-content-cld {
    zoom: unset !important;
/* contain: unset !important; */
    contain: none !important;
    transition: none !important;
    transform: unset !important;
    animation: none !important;
}

/* CHROME - PB Zindex - COUNTER - TABVIEW - CHROME/QUANTUM ONLY  */

/* (new58) COR - A VOIR */
/* CHROME - VIDEO PLAYNEXT COUNTER - TABVIEW - CHROME/QUANTUM ONLY */
ytd-watch-flexy[is-two-columns_]:not([theater]) #tab-videos {
    
    }

html[plugin-tabview-youtube] #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy:not(:empty) {
    counter-reset: myIndex 00 !important;
}
html[plugin-tabview-youtube] #secondary #secondary-inner #related ytd-item-section-renderer.youtube-play-next-queue.ytd-watch-flexy #contents:not(:empty) .queue-item.ytd-item-section-renderer::before {
		counter-increment: myIndex ! important;
		content: counter(myIndex, decimal);
		position: fixed !important;
		display: inline-block !important;
		width: auto;
		line-height: 14px;
		height: 15px;
		min-width: 10px;
		right: 2.8vw !important;
		top: 6.7vh !important;
		bottom: 0px !important;
		padding: 1px 3px;
		text-align: center;
		border-radius: 0 10px 10px 0;
		font-size: 10px;
		z-index: 500000000 !important;
		opacity: 1 !important;
color: tomato;
background: gold !important;
border: 1px solid red;
}

/* CHROME - PLAYLIST COUNTER - TABVIEW - CHROME/QUANTUM ONLY */
html[plugin-tabview-youtube] #columns #right-tabs[data-dom-created-by-tabview-youtube] #tab-list.tab-content-cld.tab-content-hidden ytd-playlist-panel-renderer#playlist {
    counter-reset: myIndex 00 !important;
}

html[plugin-tabview-youtube] #columns #right-tabs[data-dom-created-by-tabview-youtube] #tab-list.tab-content-cld.tab-content-hidden ytd-playlist-panel-renderer#playlist #container.ytd-playlist-panel-renderer .playlist-items.ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer::before,

html[plugin-tabview-youtube] #columns #right-tabs[data-dom-created-by-tabview-youtube] #tab-list ytd-playlist-panel-renderer#playlist #container.ytd-playlist-panel-renderer .playlist-items.ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer::before {
    counter-increment: myIndex ! important;
    content: counter(myIndex, decimal);
    position: fixed !important;
    display: inline-block !important;
    width: auto !important;
    min-width: 10px !important;
    height: 15px !important;
    line-height: 14px !important;
    right: 11.6vw !important;
    top: 6.5vh !important;
    bottom: 0px !important;
    padding: 1px 3px;
    text-align: center;
    border-radius: 0 10px 10px 0;
    font-size: 10px;
    z-index: 5000000 !important;
    opacity: 1 !important;
    visibility: visible !important;
color: tomato;
background: gold !important;
border: 1px solid red;
}
    
/* (new58) COR A VOIR */
/* HACK CHROME / QUANTUM */
@media screen and (-webkit-min-device-pixel-ratio:0) {
    #div {
        
}
    
}
    
}

/* ==== END ==== RESET CHROME/QUANTUM ONLY = for PLAY NEXT QUEUE + TABVIEW ====  */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
