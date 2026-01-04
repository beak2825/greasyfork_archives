// ==UserScript==
// @name        Onlyfans.sx prank redirector
// @namespace   StephenP
// @match       https://onlyfans.tld/*
// @match       https://www.onlyfans.tld/*
// @match       http://onlyfans.tld/*
// @match       http://www.onlyfans.tld/*
// @exclude-match       https://onlyfans.sx/*
// @exclude-match       https://www.onlyfans.sx/*
// @exclude-match       http://onlyfans.sx/*
// @exclude-match       http://www.onlyfans.sx/*
// @grant       none
// @version     1.0.2.1
// @author      StephenP
// @description The script redirects the users from the real OnlyFans to the prank website OnlyFans.sx
// @license     AGPL-3.0
// @run-at      document-start
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/474306/Onlyfanssx%20prank%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/474306/Onlyfanssx%20prank%20redirector.meta.js
// ==/UserScript==
document.location.href=document.location.href.replace(document.location.hostname,"onlyfans.sx");