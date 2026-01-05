// ==UserScript==
// @name        JIRA  issue linking for git.reactos.org
// @description I actually need this one, probably not the most useful script ever made.
// @namespace   swyter
// @match       https://git.reactos.org/*
// @version     2015.10.30
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13357/JIRA%20%20issue%20linking%20for%20gitreactosorg.user.js
// @updateURL https://update.greasyfork.org/scripts/13357/JIRA%20%20issue%20linking%20for%20gitreactosorg.meta.js
// ==/UserScript==

var page_body = document.querySelector(".page_body");

page_body.innerHTML  = page_body.innerHTML.replace(/(CORE-\w+)/gi, "<a href='https://jira.reactos.org/browse/$1'>$1</a>");