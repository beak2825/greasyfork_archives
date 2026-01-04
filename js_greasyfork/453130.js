// ==UserScript==
// @name        Sharp Smileys
// @description Sharp smileys for jeuxvideo.com forums.
// @match       https://www.jeuxvideo.com/*
// @run-at      document-end
// @license MIT
// @version     1.3
// @namespace https://greasyfork.org/users/971281
// @downloadURL https://update.greasyfork.org/scripts/453130/Sharp%20Smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/453130/Sharp%20Smileys.meta.js
// ==/UserScript==

const css = `img[alt=":)"],img[alt=":snif:"],img[alt=":gba:"],img[alt=":g)"],img[alt=":-)"],img[alt=":snif2:"],img[alt=":bravo:"],img[alt=":d)"],img[alt=":hap:"],img[alt=":ouch:"],img[alt=":pacg:"],img[alt=":cd:"],img[alt=":-)))"],img[alt=":ouch2:"],img[alt=":pacd:"],img[alt=":cute:"],img[alt=":content:"],img[alt=":p)"],img[alt=":-p"],img[alt=":noel:"],img[alt=":oui:"],img[alt=":("],img[alt=":peur:"],img[alt=":question:"],img[alt=":cool:"],img[alt=":-("],img[alt=":coeur:"],img[alt=":mort:"],img[alt=":rire:"],img[alt=":-(("],img[alt=":fou:"],img[alt=":sleep:"],img[alt=":-D"],img[alt=":nonnon:"],img[alt=":fier:"],img[alt=":honte:"],img[alt=":rire2:"],img[alt=":non2:"],img[alt=":sarcastic:"],img[alt=":monoeil:"],img[alt=":o))"],img[alt=":nah:"],img[alt=":doute:"],img[alt=":rouge:"],img[alt=":ok:"],img[alt=":non:"],img[alt=":malade:"],img[alt=":fete:"],img[alt=":sournois:"],img[alt=":hum:"],img[alt=":ange:"],img[alt=":diable:"],img[alt=":gni:"],img[alt=":play:"],img[alt=":desole:"],img[alt=":spoiler:"],img[alt=":merci:"],img[alt=":svp:"],img[alt=":sors:"],img[alt=":salut:"],img[alt=":rechercher:"],img[alt=":hello:"],img[alt=":up:"],img[alt=":bye:"],img[alt=":gne:"],img[alt=":lol:"],img[alt=":dpdr:"],img[alt=":dehors:"],img[alt=":hs:"],img[alt=":banzai:"],img[alt=":bave:"],img[alt=":pf:"],img[alt=":cimer:"],img[alt=":ddb:"],img[alt=":pave:"],img[alt=":objection:"],img[alt=":siffle:"],img[alt=":loveyou:"],img[alt=":fish:"],img[alt=":mac:"],img[alt=":hapoelparty:"]{
  image-rendering: pixelated;
}`

var style = document.createElement('style');

style.innerHTML = css;

document.body.appendChild(style);