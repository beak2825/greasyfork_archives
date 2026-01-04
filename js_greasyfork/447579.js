// ==UserScript==
// @name        Duolingo dark mode
// @author      Amie McLaughlin
// @namespace   DLDM
// @description Dark mode for Duolingo
// @version     0.3.3
// @last-update 11/11/22
// @grant GM_addStyle
// @license MIT

// @match     https://www.duolingo.com/*
// @downloadURL https://update.greasyfork.org/scripts/447579/Duolingo%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/447579/Duolingo%20dark%20mode.meta.js
// ==/UserScript==

/*
Search and replace these values to change the colour scheme!
Backgrounds colour = #0b131c
Text colour = #d9d9d9
// Special text colour (for the fill in the blank letters challenge) = #1cb0f6 // Unused
Selected colour = #4c4675
Hovered colour = #333
Green = #2c3c21  // Kinda gross but it'll do for now
Red = #351e1f  // Kinda gross but it'll do for now
*/

const css = `
/*********** DARK BACKGROUNDS ***********/
body

/* Welcome page */
, div._2a3s4 /* Input password to login */
, section._338aW /* Main sections when you scroll down */
/* , button._2NolF::before /* Login button after scrolling down on the login page (Commented out because it messes with the SIGN IN button */

/* Main page */
, div._3g2C1 /* Header */
, div._3bTT7 /* Left-side menu */
, div._3ZuGY /* League and XP progress */
, div._1KUxv:not(._3PEwn):not(.zylDf) /* Header hover menus (not the popup from lessons) */
, .WOZnx:not(header._5CGAu > a)::before /* Dumbell and down/up arrow on the main page (not Guidebook button) */
, div._3WFLr, div._3p5e9:not(div.eIZ_c div) /* Speech bubble arrow left, right (not the popup from lessons) */
, div._1Dky3:not(._2zOgU) > div > div > div > div:not(.ite_X) /* Start and Jump here? (not trophy progress) (not speech-bubble-like arrow below) */

/* Guidebook */
, table._1Dr4X /* Explanation table */

/* Lessons */
, div._399cc /* Footer */
, div._1yodw /* Are you sure you want to quit footer */
, div._3lUbm /* Report popup */

/* Loading Screen */
, div._3IvEG

/* Stories */
, div.xzblA  /* Background when starting */
, div._3PnTi /* Background when resuming */
, div._2QKoe /* Header */
, div._11VOS /* Footer */
, div._2lvkY /* Speech bubbles */
, button._27o_2 /* Buttons */

/* Friend updates */
, img._2ikVT /* Images in friend updates */
, div._2l3ju /* Reactions to friend updates */

/* Settings */
, label._26wPn::after /* Set daily goal buttons */

/* Choose a new course */
, div._2PVaI /* Background */
, a.zAIdz /* Buttons */
, div.HnjwC /* Contributors */
{
    background: #0b131c
}

/* Stories */
div._1e1GW::after /* Speech bubble point */
{
    border-right-color: #0b131c
}

/*********** LIGHTER BACKGROUNDS ***********/
/* Guidebook */
div._2fqcw /* Explanation panel */
{
    background: #2f2f2f
}

/*********** WHITE TEXT ***********/
body
, h2

/* Welcome page */
, div._2gzeH
, div._2KQih *:not(a)
, a._2mU94 /* App store and Google Play buttons */
/* , span._13HXc /* Login button after scrolling down on the welcome page (Commented out because it messes with the SIGN IN button */

/* Main page */
, div._2XlFZ._1v2Gj:not(.WCcVn.-frXS) *:not(button):not(span._13HXc):not(._34v50) /* Header hover menus (not the popups when you click path lessons) (not See All, profile, friend updates, etc., Go to shop) */
, span._3cvJx /* League XP */
, div._1LpFA /* Daily goal */

/* Guidebook */
, span._1hMfp /* Guidebook subtitle */

/* Lessons */
, p._2L75s /* Show off what you’ve learned and earn a special reward! */
, span._3cDk3:not(._34Xbr) /* Lesson complete! Combo bonus! (not the yellow XP amounts next to those) */
, div._2b2qG /* Do a lesson every day this week for a perfect week! */
, div.ccZTP /* Nice job reaching your daily goal! */
, button._1O290:not(button._1rl91) span /* Buttons in word banks in lessons (but not buttons you got right in stories) */
, div._2-OmZ /* Words in buttons in lessons */

/* Loading screen */
, span.a1TnJ /* LOADING */
, span.XWge1 /* Facts */

/* Stories */
, div.saQLX /* Title */
, span._2igzU._3LUrt /* Words */
, span.W6uig._3B_aK /* Words between buttons in some parts */

/* Friend updates */
, div._1V_qq /* Title */
, div._3YkaQ /* New */
, div._1MTUU /* Friend names */
, button._23mZA:not(.t1Hcp) /* Celebrate (not Celebrated) */

/* Profile */
, div._91Tq4 * /* Top */
, div._25dpq *:not(.-oI84):not(._13kYE) /* Bottom left (not achievement progress bars, not the names of achievements) */
, div._2P12E:not(.Fc0NK) *:not(._1c25o > .hWQ2W):not(._1c25o > .hWQ2W span) /* Bottom right (not the right of the main page) (not the blue text on the right) */ /* TODO there must be a way to simplify this */

/* Settings */
, td._1CsoA /* Labels on settings page */
, a._1wy04 /* Menu on the right */
, td._2k8ad /* Language names */
, h3._1Y-pT /* What you’ll get with Super Duolingo */
, div.tkIr- * /* The benefits of Super Duolingo */
, div._3oNS9 /* Notification settings */
, label._26wPn:not(._3-21f) span /* Set daily goal buttons (not the current choice) */
, p._2KvKK /* Duolingo for schools */
, div._1oj-F /* Privacy */

/* Choose a new course */
, h1.oN_-E /* Language Courses for [] Speakers */
, div.iNDwf * /* Words on buttons */
, div._30_tV * /* Learn [] from [], [] active learners */
, h2._14oJt /* About the course, did you know?, course contributors */
, a._1OeGd /* Contributor names */
{
    color: #d9d9d9
}

div._1WCLL span /* Guidebook section */
{
    color: #d9d9d9 !important
}

/*********** DARK BACKGROUND AND WHITE TEXT ***********/
textarea._1QDX9 /* Text input in lessons */
, label._2FKqf /* Text input in lessons, but for some reason a different thing */
, input._17nEt /* Text input in fill in the word lessons */
, div._3C_oC::before /* Buttons in lessons */
, input._2gBEa /* Text input in profile settings */
, input._3Yh_i /* Duolingo for schools input */
{
    background: #0b131c;
    color: #d9d9d9
}

/*********** GREEN ***********/
div._3e9O1 /* Correct footer in lessons */
, a.yXp5g._3QwaZ.mKH7H /* Your league position when you're in the top 10 */
, button._3pXv7 /* Buttons in stories */
, div.TVxEB /* Correct footer in stories */
{
    background: #2c3c21
}

/*********** RED ***********/
div._3vF5k /* Incorrect footer in lessons */
, a.yXp5g._3QwaZ._1xmOg /* Your league position when you're in the bottom 10 */ /* TODO test */
{
    background: #351e1f
}

/*********** PURPLE ***********/
/* Main page */
span._1eTnJ:hover:not(._2IQEn) /* Hovering over left-side menu */
, a.yXp5g:hover /* Hovering over league positions */
, a.yXp5g._3QwaZ.mKH7H:hover, a.yXp5g._3QwaZ._1xmOg:hover /* Hovering over your specific league position */
, .uqCpu ._2WiQc:hover /* Course selection submenu */
, .uqCpu .uOkpe:hover /* Add new course */
, div._1kT7V button._1H_R6:hover:not(:disabled) /* Header hover submenu buttons */

/* Lessons */
, div._3C_oC:hover:not(:active):not(.disCS):not(.hfPEz)::before /* Hovering over buttons */

/* Stories */
, button._27o_2:hover /* Hovering over buttons */

/* Settings */
, li.rmbzf:hover /* Hovering over the tabs on the right */
{
    background: #4c4675
}

/* Lessons */
._3C_oC.disCS::before, ._3C_oC:active:not(.hfPEz)::before /* Clicking buttons */

/* Settings */
, .fJSw6:hover:not(:active):not(._326cY):not(.IACXk)::after /* Hovering over set daily XP goal buttons */
, .fJSw6:active:not(._326cY):not(.IACXk)::after /* Clicking set daily XP goal buttons */
{
    background: #4c4675 !important
}


/*********** GREY ***********/
/* Main page */
a._3QwaZ, /* Your league position when not in the top 10 or bottom 10 */

/* Lessons */
, ._2NolF.LhRk3:not(._1rl91)::before, ._2NolF:disabled:not(._1rl91)::before /* Inactive button in report popup */
{
    background: #333
}

/* Main page */
div._2WiQc._1Gh9e:not(:hover) /* Selected course in course selection submenu */
, span._2BPAp /* Current tab on the left of the main page */

/* Lessons */
, .WOZnx.LhRk3:not(._1rl91)::before, .WOZnx:disabled:not(._1rl91)::before /* Chosen words in word banks in lessons */
, div._3C_oC.disCS::before /* Chosen buttons in lessons */

/* Settings */
, li._1eSrF /* Current tab */
{
    background: #333 !important
}

/*********** MISC ***********/
input._3MNft /* Password input to login */
{
    color: #d9d9d9;
    caret-color: #fff
}

/* TODO
Sign up page
*/
`;

(function() {
    'use strict';
    GM_addStyle(css);
})();