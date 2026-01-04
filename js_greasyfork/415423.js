// ==UserScript==
// @name         Torn: Custom CSS
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  Block or change CSS on Torn
// @author       Untouchable [1360035]
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/415423/Torn%3A%20Custom%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/415423/Torn%3A%20Custom%20CSS.meta.js
// ==/UserScript==

GM_addStyle ( `

/* Hide Non-Related Forum */
#forums > div:nth-child(7) {
  display:none;
}

/* ================================= */

/* Torn Tools Color Overwrite */
.tt-title.title-black {
	color:white !important
}

/* Torn Tools Profile Info */
#tt-target-info {
  display:none;
}

/* ================================= */

/* Trade Chat Minimizer */
#chatRoot > div > div.chat-box_Wjbn9.trade_3ZOI5.chat-active_1Sufk > div.chat-box-content_2C5UJ > div.viewport_1F0WI > div > div.message_oP8oM {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-top: 3px;
}

/* ================================= */

/* Laptop Screen Enlarger */
.d .computer-frame-wrap>.viewport, .d .computer-frame-wrap { height:900px; }

/* ================================= */

/* Hide Property Info */
.property-info-cont {
 display:none;
}

/* ================================= */

/* Hide Happy Bar */
/*#barHappy {
 display:none;
}*/

/* ================================= */

/* Hide Info Panes on Home Page */
#item640545, /* Personal Perks */
#item640543, /* Working Stats */
#item640548, /* Latest Messages */
#item640546 /* Job Information */ {
 display:none;
}

/* ================================= */

/* DocTorn Effective Stats Graph */
#item640538 > div.bottom-round > div > article.doctorn-widget.svelte-1jam6qd.doctorn-widget--animated.doctorn-widget--flat.doctorn-widget--fullbleed.doctorn-widget--toggleable  {
 display:none;
}

/* ================================= */

/* Property Image */
/* #item640542 > div.bottom-round > div > ul > li.image.default {
	display:none;
} */

/* ================================= */

/* Other */
.dkk-widget_green {
 background-color:#505050!important;
}

#6461020 {
 background-color: yellow!important;
}

#6461020 {
 display:none!important;
}

.stage, .popup-info {
    display:none
}

/* ================================= */

` );



function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

//////////////////////////////////////////////////////////////////////////////////////////

