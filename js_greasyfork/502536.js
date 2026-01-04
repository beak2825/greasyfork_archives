// ==UserScript==
// @name         2nd Gen Reddit UI
// @namespace    
// @version      1.2.2
// @description  Reverts Reddit to 2nd Generation UI (new.reddit.com)
// @author       sidetime
// @license MIT
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/502536/2nd%20Gen%20Reddit%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/502536/2nd%20Gen%20Reddit%20UI.meta.js
// ==/UserScript==

//------GENERAL------

//Hide Post Insights (to display: comment next line)
GM_addStyle('faceplate-tracker[source="post_insights"] {display: none !important;}');



//Remove Media Borders
GM_addStyle('.relative {border-radius: 0px !important;}');
GM_addStyle('.border-solid {border-radius: 0px !important;}');
//Site Background-color
GM_addStyle(':root.theme-beta {background-color: #030303 !important;}');
//Post Background-color
GM_addStyle('.bg-neutral-background {background-color: #1a1a1b !important; border-width: .05rem !important}');
//Hide left sidebar
GM_addStyle('#left-sidebar-container {display: none !important;}');
//Hide Post Borders
GM_addStyle('.border-0 {display: none !important;}');

//GM_addStyle('.my-xs {display: none !important;}');


//------HOME PAGE------

//Filterbar
GM_addStyle('.my-xs {background-color: #1a1a1b !important; border-style: solid !important; border-color: #343636 !important; border-width: 0.05rem !important; border-radius: .25rem !important; margin-left: 0px !important; margin-right: 0px !important; padding-top: .25rem !important; padding-bottom: .25rem !important;');



//------SUBREDDIT------

//Subreddit Filterbar
GM_addStyle('.my-2xs {margin-top: 0.5rem !important; margin-bottom: .5rem !important; border-color: #343536 !important; border-width: 0.05rem !important; border-style: solid !important; border-radius: .25rem !important;}');
//Subreddit Banner Background-color
GM_addStyle('.masthead {background-color: #1a1a1b !important; padding-bottom: 1rem !important;}');
//Right Sidebar
GM_addStyle('.bg-neutral-background-weak {background-color: #1a1a1b !important; margin-top: 2rem !important;}');
//Hightlight Background-color
GM_addStyle(':root:not(.theme-light) .theme-rpl {--color-neutral-background: #1a1a1b !important;}');
GM_addStyle('.pl-md {padding-left: 0rem !important;}');

//------POSTS------

GM_addStyle(':root.theme-beta {--shreddit-content-background: #1a1a1b !important;}');
GM_addStyle('shreddit-post {border-radius: .25rem !important;}');
GM_addStyle('.highlight-list-item {padding-left: 0rem !important; padding-right: 0rem !important;}');

//GM_addStyle('comment-body-header {padding-right: 1rem !important;}');

GM_addStyle('.right-sidebar-xs {padding-right: 1rem !important; padding-left: 1rem !important; background-color: #1a1a1b !important; margin-top: 2rem !important; border-radius: .25rem}');

//Subreddit & User Hover Background-color
GM_addStyle('.overflow-hidden {background-color: #1a1a1b00 !important; border-radius: .25rem !important;}');
//GM_addStyle(':host {--color-neutral-background-strong: #1a1a1b !important; border-radius: .25rem !important;}');


GM_addStyle('.button-secondary {--button-color-background-default: #1a1a1b !important;}');
//GM_addStyle(':root {--button-color-background-default: #1a1a1b !important;}');

GM_addStyle('.theme-light.theme-rpl, .theme-rpl {--color-button-secondary-background: #1a1a1b !important;}');
GM_addStyle('.theme-light.theme-rpl, .theme-rpl {--color-secondary-background-hover: #1a1a1b !important;}');

GM_addStyle(':root:not(.theme-light) .theme-rpl {--color-secondary-background-hover: #1a1a1b !important; --color-secondary: #abacac !important; --color-neutral-background-strong: #1a1a1b !important;}');

//GM_addStyle(':root:not(.theme-light) .theme-rpl {--color-secondary-onBackground: #1a1a1b !important;}');

GM_addStyle('.bg-neutral-background-strong {background-color: #1a1a1b !important;}');


GM_addStyle('shreddit-profile-comment {background-color: #1a1a1b !important; border-color: #343536 !important; border-width: 0.1rem !important; border-style: solid !important; border-radius: 0.25rem !important; margin-top: .25rem !important; margin-bottom: .25rem !important;}');



GM_addStyle('r-post-composer-form {background-color: #1a1a1b !important; border-color: #343536 !important; border-width: 0.1rem !important; border-style: solid !important; border-radius: .25rem !important;}');



GM_addStyle('.-m-xs {background-color: #1a1a1b !important; border-color: #343536 !important; border-width: 0.05rem !important; border-style: solid !important; border-radius: .25rem !important;}');


GM_addStyle('.h-2xs {display: none !important;}');


GM_addStyle('.my-md {margin-top: 0rem !important; margin-bottom: 0rem !important;}');


GM_addStyle('div[slot="desktop-cta-row"] {display: none !important;}');

GM_addStyle('.p-md {padding-top: 0.25rem !important; padding-bottom: 0.25rem !important;}');



//GM_addStyle(':host([wide]) {--card-border-radius: 0rem !important; border-radius: 0rem !important;}');
//GM_addStyle('button {border-width: .05rem !important}');
//GM_addStyle('.bg-neutral-background-weak {background-color: #1a1a1b !important;}');
//GM_addStyle('#form {background-color: #ae2c00 !important; border-style: solid !important; border-width: .1rem !important; border-color: #343636 !important; border-radius: 3px !important;}');
