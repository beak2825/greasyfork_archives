// ==UserScript==
// @name         Rock Paper Shotgun [RPS] & Eurogamer embed fix
// @version      10
// @description  Enable embedded third party content on RPS & Eurogamer despite having rejected cookies
// @author       Tim Smith
// @license      GPL-3.0 License
// @namespace    https://greasyfork.org/users/945293
// @match        *://www.rockpapershotgun.com/*
// @match        *://www.eurogamer.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rockpapershotgun.com
// @downloadURL https://update.greasyfork.org/scripts/459215/Rock%20Paper%20Shotgun%20%5BRPS%5D%20%20Eurogamer%20embed%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/459215/Rock%20Paper%20Shotgun%20%5BRPS%5D%20%20Eurogamer%20embed%20fix.meta.js
// ==/UserScript==

(function() {

class EmbedFixer {
	sourcesByDataName = [
		['src', [
			['iframe', 'embed.acast.com'],
			['iframe', 'bandcamp.com'],
			['iframe', 'efmfeedback.com'],
			['iframe', 'docs.google.com'],
			['iframe', 'gfycat.com'],
			['iframe', 'giphy.com'],
			['iframe', 'libsyn.com'],
			['iframe', 'megaphone.fm'],
			['iframe', 'redditmedia.com'],
			['iframe', 'soundcloud.com'],
			['iframe', 'spotify.com'],
			['iframe', 'streamable.com'],
			['iframe', 'twitch.tv'],
			['iframe', 'youtube']
		]],
		['cookiesSrc', [
			['script', 'primis.tech']
		]]
	]
	scriptSources = [
		'apester.com',
		'instagram.com',
		'twitter.com'
	]
	mutationObserverOptions = {
		childList: true,
		subtree: true
	}

	constructor() {
		this.cachedDashStyles = new Map();
		this.selectors = this.sourcesByDataName.map(([dataName, sources]) => [dataName, sources.map(source => this.selector(dataName, ...source)).join()]);
		this.scriptSelector = this.scriptSources.map(domain => this.selector('src', 'script', domain)).join();
		this.addedScripts = new Set();

		const style = document.createElement('style');
		document.head.appendChild(style);
		style.sheet.insertRule('.embed_placeholder {display: none;}');
		this.enable(document.body);

		const liveblogContainer = document.body.querySelector('.liveblog');
		if (liveblogContainer !== null) {
			this.mutationObserver = new MutationObserver(mutationRecords => this.checkMutations(mutationRecords));
			this.mutationObserver.observe(liveblogContainer, this.mutationObserverOptions);
		}
	}

	selector(dataName, nodeName, domain) {
		return `${nodeName}[data-${this.dashStyle(dataName)}*="${domain}"]:not([src])`;
	}

	dashStyle(camelCase) {
		if (!this.cachedDashStyles.has(camelCase))
			this.cachedDashStyles.set(camelCase, camelCase.replaceAll(/[A-Z]/g, letter => `-${letter.toLowerCase()}`));
		return this.cachedDashStyles.get(camelCase);
	}

	enable(ancestor) {
		for (const [dataName, selector] of this.selectors)
			ancestor.querySelectorAll(selector).forEach(element => this.addSrc(element, dataName));
		ancestor.querySelectorAll(this.scriptSelector).forEach(script => this.addScript(script));
	}

	addSrc(element, dataName = 'src') {
		element.src = element.dataset[dataName];
		element.removeAttribute(`data-${this.dashStyle(dataName)}`);
	}

	addScript(inlineScript) {
		if (this.addedScripts.has(inlineScript.dataset.src)) return;
		const headScript = inlineScript.cloneNode();
		this.addSrc(headScript);
		document.head.appendChild(headScript);
		this.addedScripts.add(inlineScript.dataset.src)
	}

	checkMutations(mutationRecords) {
		for (const mutationRecord of mutationRecords)
			for (const addedNode of mutationRecord.addedNodes)
				if (addedNode.nodeType == Node.ELEMENT_NODE)
					this.enable(addedNode);
	}
}

const embedFixer = new EmbedFixer();

})();