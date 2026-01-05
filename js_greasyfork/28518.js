// ==UserScript==
// @name        KissAnime KissCartoon KissAsian io no ads clean layout part 2
// @description used by part 1, remember never login to io
// @namespace   hebiohime
// @icon        https://kissanime.io/images/icons/favicon_new.ico
// @match       *://kissanime.io/*
// @match       *://kisscartoon.io/*
// @match       *://kissasian.io/*
// @match       *://kissmanga.io/*
// @require     https://greasyfork.org/scripts/4900-kissanime-anti-adblock-blocker/code/KissAnime%20Anti-Adblock%20Blocker.user.js
// @version     2017.28.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28518/KissAnime%20KissCartoon%20KissAsian%20io%20no%20ads%20clean%20layout%20part%202.user.js
// @updateURL https://update.greasyfork.org/scripts/28518/KissAnime%20KissCartoon%20KissAsian%20io%20no%20ads%20clean%20layout%20part%202.meta.js
// ==/UserScript==

//scrolls video and eps buttons up, great for lower height monitors
$("#next_ep_desk")[0].scrollIntoView({behavior: "smooth",block: "start"});
//re-order selection bar
$("#selectEpisode").after($("select[id*='selectQuality']"));
$("#selectEpisode").before($("select[id*='selectPlayer']"));