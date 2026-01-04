// ==UserScript==
// @name         Discord darker dark mode
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  Improved dark mode for Discord.
// @author       github.com/akuankka128
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403796/Discord%20darker%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/403796/Discord%20darker%20dark%20mode.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// console.info("Starting injection script");

let d = Date.now();
let injection =
`[class$="comment"] { color: rgba(33,33,33,1) !important; }
[class^="contents-"]>div, [class^="name-"] { color: darkmagenta !important; }
#popout_1>div>div>h4 { background:rgba(0,0,0,0)!important; }
#popout_1>div :nth-child(1) { background:rgba(11,11,11,.85); }
[class^="embedWrapper-"], [class^="grid-"], [class^="searchHeader-"], [class*=categoryWrapper-], div[class^=inspector-], div[class^=container-]>[class*=userSelectNone-] { background-color: rgb(12,12,12) !important; }
[class^="expandedFolderBackground-"], [class^="actionButton-"], [class*="fixClipping-"], #popout_1>div>div[class*=footer-] { background: rgba(11,11,11, .85) !important; }
[class^=option-]::after, [class^="resultsGroup-"] { background: rgb(11,11,11) !important; }
[class^="scrollableContainer-"] { background: rgba(5,5,5, 1) !important; }
[class^="scroller"], [aria-label="User area"], [class^="form"],[class^="form"]::before, [aria-label="Channel header"], [class^="searchBar"], [class^="spacer-"]::after, header[class^="header-"], [class^="uploadModal-"], [class^="userPopout-"] :nth-child(1), [class^="footer-"] { background: rgba(0,0,0, 1) !important; }
[data-ref-id^="messages"] { font-size: .75rem !important; }
[data-ref-id^="private-channels-"], [class^="uploadModal-"] > div[class^="footer-"], [class^="topSectionNormal-"] > div[class] > div[class^="activity-"], [class^="tabBarContainer-"], textarea[maxlength="256"], [class^="drawerSizingWrapper-"]>*, section[class^="container-"] { background: rgba(7,7,7, 1) !important; }
[class^="headerFill-"] { background: rgba(0,0,0,.95) !important; }
code { background: rgba(12,12,12,1) !important; }
body * { font-family: Consolas, Inconsolata !important; }
[class^="searchHeader"] { background: rgba(2,2,2,.95) !important; }
[class^="resultsGroup"] { background: rgba(0,0,0,.75) !important; }
[class^=option]::after { display:none!important }
[class*="botTagRegular-"] { background:rgba(0,0,0,1)!important; }
div[class*="fullscreenOnMobile-"]>div[class*="alignCenter-"], div[class*="fullscreenOnMobile-"]>div[class*="directionRowReverse-"] { background:rgba(0,0,0,.75)!important; }
[class*=slideBody-]>header[class*=header] { color:rgb(230,230,230)!important; }
[class^="autocompleteInner-"] { background:rgba(0,0,0,.71)!important; }
section[class^=title]>[class^=children-]::after { display:none!important; }
[class*=gridItem-] { opacity:0.8!important; }
[class*=gridItem-]>* { background:rgba(0,0,0,.875)!important; }
[class*=channelNotice-] { background:rgba(0,0,0,.9)!important; }
[class*=channelNotice-]>svg { z-Index:999999999!important; }
[class*=channelNotice-]>div {
	position:absolute!important;
	translateY(50%)!important;
	top:0%!important;
}
div[class*=join], div[class*=create] {
	background-color:rgba(12,12,12,.8);
	color:rgb(230,230,230);
}`;

(function() {
//    console.info("In main function at " + Date.now());
    'use strict';

    if(!/.*?(www\.)?discord(app)?\.com\/channels\/(@me|\d{17,19})(\/\d{17,19})?/.test(document.location.href)) return console.info(`Did not match a Discord message channel URL. Stopping execution at: ${Date.now()}, execution time: ${Date.now() - d}ms`);

//    console.info("Discord message channel URL detected. Proceeding with injection...");
    let injector = document.createElement('style');
    injector.innerHTML = injection;
//    console.info("Injection tag made, injecting into HTML content...");

    document.body.appendChild(injector);
//    console.info(`Injection completed at ${Date.now()}. Total execution time: ${Date.now() - d}ms`);
})();