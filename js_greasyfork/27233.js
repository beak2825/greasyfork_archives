// ==UserScript==
// @name           SE Timeline link
// @description    Adds a timeline link for the questions
// @version        1.0.1
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
// @match          *://*.stackoverflow.com/questions/*
// @match          *://*.superuser.com/questions/*
// @match          *://*.serverfault.com/questions/*
// @match          *://*.askubuntu.com/questions/*
// @match          *://*.stackapps.com/questions/*
// @match          *://*.mathoverflow.com/questions/*
// @match          *://*.stackexchange.com/questions/*
// @exclude        /\.com\/questions\/\D/
// @run-at         document-start
// @require        https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/27233/SE%20Timeline%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/27233/SE%20Timeline%20link.meta.js
// ==/UserScript==

var id = location.pathname.match(/\d+/)[0];
setMutationHandler('#link-post-' + id, nodes => {
	nodes[0].parentElement.insertAdjacentHTML(
		'beforeend',
		'<span class="lsep">|</span>' +
		`<a href="/posts/${id}/timeline">timeline</a>`
	);
	return false;
});
