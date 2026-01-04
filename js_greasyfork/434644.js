// ==UserScript==
// @name         ContentBlocker - Keep your kids safe on the internet!
// @icon         https://cdn-icons-png.flaticon.com/512/814/814108.png
// @namespace    https://greasyfork.org/en/users/817964
// @homepage     https://www.patreon.com/tech2survive
// @version      4.9
// @description  ContentBlocker is the #1 solution to preventing your kids from visiting NSFW or explicit websites. Works with all browsers!
// @author       Hidden_X
// @include      *pornhub*
// @include      *dick*
// @include      *pussy*
// @include      *cum*
// @include      *nude*
// @include      *nudity*
// @include      *ome*
// @include      *porn*
// @include      *houseparty*
// @include      *sex*
// @include      *telonym*
// @include      *kik*
// @include      *rule34*
// @include      *xhamster*
// @include      *yolo*
// @include      *fuck*
// @include      *suck*
// @include      *tinder*
// @include      *periscope*
// @include      *ask.fm*
// @include      *4chan*
// @include      *8chan*
// @include      *chatroulette*
// @include      *youporn*
// @include      *hentai*
// @include      *daddy*
// @include      *xx*
// @exclude      *google*
// @exclude      *youtube*
// @require      https://greasyfork.org/scripts/18490-ads-dom-remover-runner/code/Ads%20DOM%20Remover%20Runner.js?version=983896
// @run-at       document-start
// @license      GNU General Public License v2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434644/ContentBlocker%20-%20Keep%20your%20kids%20safe%20on%20the%20internet%21.user.js
// @updateURL https://update.greasyfork.org/scripts/434644/ContentBlocker%20-%20Keep%20your%20kids%20safe%20on%20the%20internet%21.meta.js
// ==/UserScript==

// variables
var con = confirm;
var doc = window.document.title;

// does stuff
doc = "Access Denied"; // <title> - may not be functional bc run-at start
con("Website blocked by ContentBlocker \nReason: Website not secure for kids. \n\nYou will now be redirected to www.google.com")&&window.open("https://www.google.com/"); // pop-up && redirect
open(location, '_self').close(); // page refresh if con = false (loop)


/*
Developed by Hidden_X
    - on behalf of Tech2Survive

This is an open-source and copyright-free project. You can use and modify it as you wish.
Warning: Any attempts of reuploading it without permission from the original creator will be taken down by GreasyFork as it goes against it's Terms of Service (TOS).

· Copyright is for cowards ·

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Consider Donating: https://www.patreon.com/tech2survive
Thank you!
*/