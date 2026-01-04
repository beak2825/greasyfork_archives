// ==UserScript==
// @name         miraiseed open the answer
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       Travler__#6121
// @match        https://miraiseed3.benesse.ne.jp/seed/*/drill/*
// @match        https://miraiseed3.benesse.ne.jp/seed/*/drillResume*
// @match        https://miraiseed3.benesse.ne.jp/seed/*/drillStart/*
// @match        https://miraiseed3.benesse.ne.jp/seed/*/restart/*
// @grant        none
// @license      GNU GPL v3.0 
// @downloadURL https://update.greasyfork.org/scripts/403275/miraiseed%20open%20the%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/403275/miraiseed%20open%20the%20answer.meta.js
// ==/UserScript==

for (let i = 0; i < $('div.main_cont')[0].children[0].children[0].children.length - 2; i++) {
	toggleExpound(i);
}