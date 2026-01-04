// ==UserScript==
// @name        Baduk Link Fixer
// @match       *://*.reddit.com/r/badunitedkingdom/*
// @version     1.1
// @author      Betamax_17 (China Sexpat)
// @description Please don't mock my terrible scripting!
// @namespace Gammon Space
// @downloadURL https://update.greasyfork.org/scripts/451220/Baduk%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/451220/Baduk%20Link%20Fixer.meta.js
// ==/UserScript==
[...document.links].forEach(item => item.href = item.href.replace('/v/', '/r/'));
[...document.links].forEach(item => item.href = item.href.replace('reveddit', 'reddit'));
[...document.links].forEach(item => item.href = item.href.replace('unddit', 'reddit'));
[...document.links].forEach(item => item.href = item.href.replace('nitter.net', 'twitter.com'));