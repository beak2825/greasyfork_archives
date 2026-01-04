// ==UserScript==
// @name         Webmail Ad Blocker
// @namespace    https://greasyfork.org/en/scripts/37967-webmail-ad-blocker
// @homepage     https://jasonsavard.com/Webmail-Ad-Blocker
// @source       https://chrome.google.com/webstore/detail/webmail-ad-blocker/cbhfdchmklhpcngcgjmpdbjakdggkkjp
// @icon         https://lh3.googleusercontent.com/rWx1KZ5jxbPmkvb8asXNoo5AnfthpZf554TbjYQuW_xPoPgzzzPtr9SQ0El1OvOQvaWEa6gvotA
// @version      5.0.6
// @description  Block ads on the right side of the screen when using Gmail, Yahoo Mail, Hotmail and Outlook.com which expand your message space
// @author       Jason Savard
// @supportURL   https://jasonsavard.com/wiki/Webmail_Ad_Blocker
// @match        https://mail.google.com/*
// @match        https://*.mail.live.com/*
// @match        https://outlook.live.com/*
// @match        https://*.mail.yahoo.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/37967/Webmail%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/37967/Webmail%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    var init = function() {
        var email;
        var addStyle = function(css) {
            var s = document.createElement('style');
            s.setAttribute('id', 'webmailAdBlocker');
            s.setAttribute('type', 'text/css');
            s.appendChild(document.createTextNode(css));
            return (document.getElementsByTagName('head')[0] || document.documentElement)
                .appendChild(s);
        };
        if (document.documentElement instanceof HTMLHtmlElement) {
            var addCSS = false;
            var css = "@namespace url(http://www.w3.org/1999/xhtml); ";
            var webmailName;
            if (document.location.href.match("mail.google.")) {
                addCSS = true;
                webmailName = "gmail";
                // Hide People Widget: extension used to show ads/peoplewidget by default before June 12th, 2016
                // Old version
                css += " #fi #fic {margin-right:100px !important} ";
                css += " #fi #rh {margin-left:-115px !important;width:95px !important} ";
                css += " #fi .rh {display:none !important} ";
                // Use for keeping right area visible for moving elements out of if using absolute like the Maps or Calendar events
                //css += " .iY .Bu:last-child > .nH {height: 0px !important;overflow: hidden !important;width: 1px !important} "; /* Ads Area - Jason: change from 0px to 1px cause right area was moving after loading */
                //chrome.runtime.sendMessage({name:"insertCSS", css:"  body:not(.xE) .Bs .Bu:last-child .nH[style*=\"width\"] {display: none !important} "});
                //css += " body:not(.xE) .m .Bs .Bu:not(:first-child) {display: none !important} "; /* .m is because the .bu happen above if right side chat is enabled. Completeling remove last bu and .xiu1Fc is used for excluding popout view it's the class of the <html> tag */
                css += " body:not(.xE) div[role='main'] .Bu:not(:first-child) {display: none !important} "; /* Using div[role='main'] because i found out that .Bs and .Bu was used higher up in the node atleast with right side chat etc. */
                //css += " .iY .Bu:first-child + .Bu {display: none !important} "; /* Separator column */
                //css += " .iY {width: 100% !important} "; /* Message area */
                // End People Widget
                // Hide ad below people widget
                css += " .Bs .Bu:last-child .oM {display:none !important} "; /* ads*/
                css += " .Bs .Bu:last-child .u8 {display:none !important} "; /* about these links */
                // hover ad when scrolling down
                css += " .AT {display:none !important} ";
                // new comment: ad above promotions emails -- old comment: ad above message area
                css += " .aKB .a2q {padding-bottom:0} ";
                css += " .aKB .a2q .F.cf {display:none !important} ";
                // Ad below email content (refer to ghazel@gmail.com for html or Mike Tirakis has reported it to me, a bit suspicious)
                css += " .z0DeRc {display:none !important} ";
                // another ad below by Christian Szita
                css += " .nH.hx .nH.PS {display:none !important} ";
                // Ad below email content (refer to ghazel@gmail.com for html or Mike Tirakis has reported it to me, a bit suspicious)
                css += " iframe[src*='http://pagead2.googlesyndication.com'] {display:none !important} ";
                // Ad for Checker Plus for Gmail
                //if (!ls["adForCheckerPlusForGmailShown"]) {
                //chrome.runtime.sendMessage({name:"showNotification"});
                //}
            }
            if (document.location.href.match("mail.live.")) {
                addCSS = true;
                webmailName = "hotmail";
                css += " iframe[id='dapIfM0'], iframe[id='dapIfM1'], .c_ads_ad, div[name='Advertisement'] {display:none !important} "; /* most ads:including ad below folders */
                css += " .Managed .WithSkyscraper #MainContent {right:0 !important} "; // with preview pane (default)
                css += " .Unmanaged .WithSkyscraper #MainContent {margin-right:0 !important} "; // no preview pane
                css += " .Managed .WithRightRail #MainContent {right:0 !important} "; // with preview pane (default)
                css += " .Unmanaged .WithRightRail #MainContent {margin-right:0 !important} "; // no preview pane
                css += " #SkyscraperContent {display:none !important} ";
                css += " #RadAd_Skyscraper {display:none !important} ";
                // outlook.com
                css += " #ManagedContentWrapper {padding-right:0 !important} ";
                css += " #RightRailContainer {display:none !important} ";
                // outlook.com version 2? refer to https://jasonsavard.com/forum/discussion/comment/1251#Comment_1251
                css += " .WithRightRail {right:0 !important} ";
            }
            if (document.location.href.match("outlook.live.")) {
                addCSS = true;
                webmailName = "outlook";
                css += " #primaryContainer > div:not(._n_f)[style*='width: 160'], #primaryContainer > div:not(._n_f)[style*='width:160'] {display:none !important;right:0 !important} ";
                css += " #primaryContainer > div:not(._n_f)[style*='right: 160'], #primaryContainer > div:not(._n_f)[style*='right:160'] {right:0 !important} ";
                css += " #primaryContainer > div:not(._n_f)[style*='width: 165'], #primaryContainer > div:not(._n_f)[style*='width:165'] {display:none !important;right:0 !important} ";
                css += " #primaryContainer > div:not(._n_f)[style*='right: 165'], #primaryContainer > div:not(._n_f)[style*='right:165'] {right:0 !important} ";
                css += " #primaryContainer > div:not(._n_f)[style*='width: 305'], #primaryContainer > div:not(._n_f)[style*='width:305'] {display:none !important;right:0 !important} ";
                css += " #primaryContainer > div:not(._n_f)[style*='right: 305'], #primaryContainer > div:not(._n_f)[style*='right:305'] {right:0 !important} ";
                // bottom ad when window is resized narrow
                css += " #primaryContainer > div[style*='bottom: 95'] {bottom:0 !important} ";
                css += " #primaryContainer > div._n_h {height:0 !important} ";
                // outlook.com v3
                css += " ._2qPmszDwBfYpF7PO9Mn3KN, ._2KxiN0IH0mUjw-Bw6WdAoB {display:none !important} ";
                css += " .stQe7wknhnXCAAroiyvBY, ._2deFj-S8jd1C_MSRZoRvlY, ._1K0cujP_EBzCd77bTesW1q {display:none !important} ";
                css += " ._254GqExCxnOxmPy7kKATP2, .fbAdLoaded {display:none !important} "; // when closing "Other" instead of "Focus"
            }
            if (document.location.href.match("mail.yahoo.")) {
                addCSS = true;
                webmailName = "yahoo";
                css += " *[class*='ad_slug'] {display:none !important} "; /* welcome page ad, empty inbox ad etc. */
                css += " div[id='MNW'] {display:none !important} "; /* Classic Yahoo:Ad above folder */
                css += " div[id='northbanner'] {display:none !important} "; /* Classic Yahoo:top banner */
                css += " iframe[src*='http://ad.'] {display:none !important} "; /* Classic Yahoo:top banner in calendar */
                // Beta version
                css += " #theAd {display:none !important} "; // right ad
                css += " #theMNWAd {display:none !important} "; // ad above inbox says... Sahil Best - sexy_sam28@ymail.com
                css += " #shellcontent {right:0 !important} "; // right ad
                css += " #slot_LREC {display:none !important} "; // What's new landing page ad
                css += " #slot_REC {display:none !important} "; // left ad
                css += " #slot_MON {display:none !important} "; // Spam box ad
                css += " #toolbar {right:0 !important} "; // right ad (stretches the toolbar)
                css += " .messagepane .right-ar {right:0 !important} "; // right arrow - for at&t yahoo
                // yahoo started using display:block !important   so i had to find an alternative to hiding by shrinking the size of div layer
                css += " .mb-rec-ad {display:none !important; height:0 !important; border:none !important; overflow-x:hidden !important} "; // ad in left column
                css += " .mb-list-ad {display:none !important; height:0 !important; border:none !important; overflow-x:hidden !important} "; // ad just above inbox
                css += " li[data-test-id='infinite-scroll-AD'] {display:none !important} "; // new add above inbox
                // Beta version (with page by page view option)
                css += " #main, #yucs, #yuhead-bucket {max-width:none !important} ";
                css += " .fullpage #main, .fullpage #yucs, .fullpage #yuhead-bucket {margin-right:0 !important} ";
                var foldersPane = document.getElementById("foldersPane");
                if (foldersPane) {
                    var contentWidth = window.innerWidth - foldersPane.clientWidth - 10;
                    css += " #welcomeAdsContainer {display:none !important} "; /* On Home tab (welcome screen of yahoo mail */
                    css += " #mainTabView {width:" + contentWidth + "px !important} ";
                    css += " #mainTablePane {width:100% !important} ";
                    css += " .PagedTableView_container {width:100% !important} ";
                    css += " div[id^='imcSession_'] {width:" + contentWidth + "px !important} "; /* Text/Chat message window */
                    css += " #ym-skyhider {display:none !important} "; /* seperator for the right side area */
                    css += " #largePane {display:none !important} "; /* Right side wrapper */
                    css += " #largeFrame {display:none !important} "; /* Ad area */
                    css += " #ym-skyscroller {display:none !important} "; /* Ad scrolling arrow */
                }
                // Empty Spam folder - hide video ad
                css += " #emptyFolderVideo .videopane {display:none !important} ";
                css += " .wide-right-rail .frost-container {right:0 !important} ";
                // Yahoo v2
                css += " #Atom a[data-test-id=pencil-ad] {display:none !important} ";
                css += " div[data-test-id='comms-properties-bar'] {flex-direction: column !important;height: auto !important} ";
                css += " div[data-test-id='comms-properties'] {flex-direction: column !important;margin-top: 14px !important} ";
                css += " div[data-test-id='comms-properties'] > a {margin-right: 0 !important; margin-bottom: 14px !important} ";
                css += " div[data-test-id='message-read-contact-card'] {display:none !important} ";
                css += " span[data-test-id='settings-link-label'] {display:none !important} ";
                css += " div[data-test-id='right-rail-ad'] {display:none !important} ";
            }
            if (addCSS) {
                addStyle(css);
            }
            return true;
        }
        return true;
    };
    init();
})();