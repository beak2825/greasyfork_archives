// ==UserScript==
// @name         Open live in youtube gaming
// @namespace    https://greasyfork.org/users/124677
// @description  If you open live in normal youtube, it will be redirected to youtube gaming
// @version      0.3
// @author       Pabli
// @match        https://www.youtube.com/*
// @run-at       document-start
// @require      https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31897/Open%20live%20in%20youtube%20gaming.user.js
// @updateURL https://update.greasyfork.org/scripts/31897/Open%20live%20in%20youtube%20gaming.meta.js
// ==/UserScript==
setMutationHandler(document, '.ytp-live', nodes => {
	var url = location.href;
	var gaming = "https://gaming"+url.substr(11);
	location.href = gaming;
});