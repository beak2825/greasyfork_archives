// ==UserScript==
// @name         Old Youtube Buttons
// @namespace    YellowSubButt
// @version      0.3.26
// @description  Changes various YouTube elements to resemble the old YouTube Design. (Green/Red Like/Dislike, Yellow Subscribe Button.)
// @author       SomeSchmuck
// @match        *://*.youtube.com/*
// @icon         https://th.bing.com/th/id/R.a12178dd72afd2470f0d2285602f2374?rik=%2fZTUzR2M%2fWKHUA&riu=http%3a%2f%2fsguru.org%2fwp-content%2fuploads%2f2018%2f02%2fYouTube_logo.png&ehk=kk7ZapiqeyJwuqO64Byiid8PbemJtRLsbmphetcvtcE%3d&risl=&pid=ImgRaw&r=0
// @grant        GM_addStyle
// @run-at       document-end
// @connect      youtube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436565/Old%20Youtube%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/436565/Old%20Youtube%20Buttons.meta.js
// ==/UserScript==

// grant        GM.xmlHttpRequest TODO: is this needed?

// TODOs:
//    make the above section a little cleaner and see if certain parts are actually needed or not
//    maybe make this not use esversion 6? technically better browser support that way, although
//        that might not even be an issue... Too bad!
/* jshint esversion: 6 */

//known issues:
//sub button sometimes has a thin white/really bright line at the very bottom;
//  this might be a browser issue, though adjusting css padding can hide it a little bit

// 0.3.26 changes:
// Major script refactor, allows for much easier JS and CSS development + better compatibility through YT updates?
// Fix "Subscribe" button styling when signed out
// Fix "Join" button styling not applying on channel page
// Hide highlighted background on "Reply" and "More/Less Replies" buttons that would appear on hover

// 0.3.25 change:
// Refactor code to be visually cleaner
//   Use template literals as multi-line strings when possible
// Fix "Subscribe(d)" button styling not being correctly applied on channels (YouTube try not to change their CSS classes for no reason challenge failed instantly)

// 0.3.24 change:
// fix video like/dislike buttons not being coloured.
// fix comment "Reply" button text not being styled as shown on greasyfork.org page
// fixed "Subscribe" button styling not always being correctly applied (such as on channels and not hiding icons when subscribed)

// 0.3.23 change:
// fix video like/dislike buttons not being coloured.

// Supported values: 2008, 2012.
// TODO: Add support for design changes YouTube made during supported years, instead
// of a general hodgepodge of all the different designs ssen in one year.
"use strict";
var ytEra = 2008;
var lastTime = Date.now();
var delta = 0;
const subButtClass = '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled';
const chaJoinButtClass = '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline'
locationChange();

function set_join_buttons(){
    let joinButtons = [document.querySelector(`yt-flexible-actions-view-model ${chaJoinButtClass}`)];
    for (let joinButt of joinButtons) {
        // Get "Join" button, and check if it actually exists + hasn't had class applied + has aria-label
        if (joinButt == null) {
            continue;
        }
        if (joinButt.classList.contains('oyt-join-button')) {
            continue;
        }
        if (!joinButt.hasAttribute('aria-label')) {
            continue;
        }
        // Only execute on buttons with aria-label that starts with "join"
        if (joinButt.ariaLabel.toLowerCase().startsWith('join')) {
            joinButt.classList.add('oyt-join-button')
        }
    }
}

//TODO: Fix comments text formatting
function set_buttons_text(){
    let reply_info = document.getElementsByTagName('yt-formatted-string');
    //console.log(reply_info.length);
    if (reply_info.length != 0){
        for(let r = 0; r < reply_info.length; r++){
            let reply_str = reply_info[r].innerText.toLowerCase();
            const reply_style = 'border-bottom: 1px dotted #0140FF; color: #0140FF; text-transform: capitalize; font-weight: normal;';
            const join_text_style = 'color: #039';
            if (reply_str != null){
                if (reply_str === 'reply'){
                    reply_info[r].setAttribute('style', reply_style);
                } else if (reply_str === 'join' || reply_str === 'customize channel' || reply_str === 'manage videos'){
                    reply_info[r].setAttribute('style', join_text_style);
                } else {
                    //if we don't pass above checks, remove styling. Youtube shouldn't have anything
                    // important formatted like this anyway, so we're... fine i think
                    reply_info[r].removeAttribute('style');
                }
            }
        }
    }
}

function set_uns_sub() {
    let subButton = document.querySelector(`yt-flexible-actions-view-model ${subButtClass}`);
    // Don't do anything if button doesn't exist, already has class applied and has no aria-label
    if (subButton == null) {
        return;
    }
    if (subButton.classList.contains('oyt-action-button')) {
        return;
    }
    if (!subButton.hasAttribute('aria-label')) {
        return;
    }
    // Only execute on button with aria-label === 'subscribe"
    if (subButton.ariaLabel.toLowerCase() === "subscribe") {
        subButton.classList.add('oyt-action-button');
        // console.log('Successfully added class to signed-out subscribe button!');
    }
}

function set_video_inf(){
    // set_buttons_text();
    set_uns_sub();
    set_join_buttons();
}

function createStyle() {
    const unsubButtClass = '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal';
    const subChaLoc = `yt-subscribe-button-view-model ${subButtClass}`;
    const unsubChaLoc = `yt-subscribe-button-view-model ${unsubButtClass}`;
    const subVidLoc = `#subscribe-button ${subButtClass}`;
    const unsubVidLoc = `#subscribe-button ${unsubButtClass}`;
    let style =
`/*= Subscribe-Unsubscribe button (Channel, Video & Subbed, Unsubbed) =*/
/* Common button formatting */
${subChaLoc},
${unsubChaLoc},
${subVidLoc},
${unsubVidLoc},
.oyt-action-button {
    border-radius: 4px;
    text-transform: capitalize;
    font-weight: bold;
    padding: 2px 9px 0 10px;
    height: 27px;
    font-family: Arial, sans-serif;
    font-size: 12px;
}
${subChaLoc}:hover,
${unsubChaLoc}:hover,
${subVidLoc}:hover,
${unsubVidLoc}:hover,
.oyt-action-button:hover {
    text-decoration: underline;
}

/* State specific (colours, subbed/unsubbed, etc.) */
${subChaLoc},
${subVidLoc},
${subButtClass}.oyt-action-button {
    background: linear-gradient(180deg, #fff9c1 0%, #fed81c 100%);
    border: 1px solid #ecc101;
    color: #994800;
}
${subChaLoc}:hover,
${subVidLoc}:hover,
${subButtClass}.oyt-action-button:hover {
    background: linear-gradient(180deg, #fffffa 0%, #fed925 100%);
}
${unsubChaLoc},
${unsubVidLoc} {
    background: linear-gradient(180deg, #fefefe 0%, #c2c2c2 100%);
    color: #333;
    border: 1px solid #ccc;
    max-width: 88.6667px;
}
${unsubChaLoc}:hover,
${unsubVidLoc}:hover {
    /*
        2008 YouTube actually used the same BG on hover as the "subscribe" button,
        but I think this looks better so I'll break accuracy slightly for it
    */
    background: linear-gradient(180deg, #fefefe 0%, #a8a6a6 100%);
}

/* Hide Subscribed button icons (notif bell, dropdown arrow) */
${unsubChaLoc} > .yt-spec-button-shape-next__icon,
${unsubChaLoc} > .yt-spec-button-shape-next__secondary-icon,
${unsubVidLoc} > .yt-spec-button-shape-next__icon,
${unsubVidLoc} > .yt-spec-button-shape-next__secondary-icon{display: none;}

/*= Channel membership Join button =*/
${chaJoinButtClass}.oyt-join-button,
#purchase-button .yt-spec-button-shape-next--call-to-action,
#sponsor-button ${subButtClass} {
    background-image: linear-gradient(180deg, #fbfcff 0%, #93b2ff 100%);
    color: #1c1b16;
    font-size: 14px;
    text-transform: capitalize;
    font-weight: bold;
    font-family: Arial, sans-serif;
    height: 27px;
    border: 1px solid #8aa1d5;
    border-radius: 4px;
}

/*= Like-Dislike button colours =*/
/* Videos (+Comments for dislike) */
like-button-view-model .yt-spec-button-shape-next__icon path {fill: green;}
dislike-button-view-model .yt-spec-button-shape-next__icon,
#dislike-button .yt-spec-button-shape-next__icon {color: red;}

/* Comments */
#like-button .yt-spec-button-shape-next__icon {color: green;}

/*= "Reply" button + replies dropdown =*/
`;
    let repCol = '#0140FF'; // default 2008 colour
    let repLapseCol = repCol;
    let repUnd =
`    border-bottom: 1px dotted ${repCol};
    font-weight: normal;`; // Ends with semi-colon, mind before use
    if (ytEra == 2012) {
        repCol = '#999';
        repLapseCol = '#438bc5';
        repUnd =
`    font-weight: bold;
    font-size: 11px;
    font-family: Arial, sans-serif;`;
        style +=
`#reply-button-end button:hover span {
    color: ${repLapseCol};
    text-decoration: underline;
}
#more-replies span,
#less-replies span {
${repUnd}
    font-size: 12px;
}
#more-replies:hover span,
#less-replies:hover span {
    text-decoration: underline;
}
`;
    }
    style +=
`#reply-button-end span {
${repUnd}
    color: ${repCol};
}
#more-replies .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text,
#less-replies .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text,
#more-replies-icon .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text,
#less-replies-icon .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text {
    color: ${repCol};
}

/* Hide background highlight when hovering */
#reply-button-end yt-button-shape:hover,
#reply-button-end .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text:hover,
#more-replies .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover,
#less-replies .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover,
#more-replies-icon .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover,
#less-replies-icon .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover {
    background-color: transparent;
}

/* Hide background highlight when clicking */
#reply-button-end yt-touch-feedback-shape,
#more-replies yt-touch-feedback-shape,
#less-replies yt-touch-feedback-shape,
#more-replies-icon yt-touch-feedback-shape,
#less-replies-icon yt-touch-feedback-shape {
    display: none;
}
`;
    return style;
}
//trick to make buttons that don't originally have hover css have hover css part 2 :)
//addGlobalStyle('ytd-button-renderer #button.ytd-button-renderer[join]:hover { border-color: green !important;}')
GM_addStyle(createStyle());
//this bit of script was taken and modified from the script "Youtube: Download Video" by HayaoGai
//link to that script: https://greasyfork.org/en/scripts/404304-youtube-download-video
function locationChange() {
    //console.log('Switched page!');
    const observer = new MutationObserver(mutations => {
        // limit update rate
        let tempTime = Date.now();
        delta += tempTime - lastTime;
        lastTime = tempTime;
        if (delta >= 500) {
            set_video_inf();
            delta = 0; // reset delta time
        }
    });
    const target = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(target, config);
}