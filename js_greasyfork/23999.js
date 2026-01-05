// ==UserScript==
// @name Bot Bubble
// @namespace /userscripts/
// @description Pozwala na automatyczne wejscie w gre Emoticón wink a exp leci Emoticón winktongue 
// @include http://bubble.am/*
// @Author DavE 
// @version 0.0.1.20161014210541
// @downloadURL https://update.greasyfork.org/scripts/23999/Bot%20Bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/23999/Bot%20Bubble.meta.js
// ==/UserScript==


setInterval(function () {document.getElementsByClassName("btn btn-primary btn-needs-server")[0].click();}, 5000);