// ==UserScript==
// @namespace		GTBT
// @name     		alibaba-ad-distinguish
// @name:zh-CN		区分阿里巴巴广告
// @description		make it easier to distinguish the ads in alibaba's search page
// @description:zh-CN   让‘阿里巴巴’搜索页的广告易于分辨
// @version  1.4
// @match    http://s.1688.com/*
// @match    https://s.1688.com/*
// @grant    none
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/377383/alibaba-ad-distinguish.user.js
// @updateURL https://update.greasyfork.org/scripts/377383/alibaba-ad-distinguish.meta.js
// ==/UserScript==

/*eslint curly: ["off", "multi", "consistent"]*/

console.log('!!!!!!!!!!!!!!!!!!!alibaba-ad-remove!!!!!!!!!!!!!!!!!!!!!!!!!!');
(function () {
	let verbose = 0 ? console.log : () => {};
	let debug = 0 ? console.log : () => {};
	let info = 1 ? console.info : () => {};
	function changeTreeBgColor(root, color) {
		verbose('changeTreeBgColor', root, '=>', color);
		if (!root)
			return;
		if (root.style)
			root.style.backgroundColor = color;
		for (let node of root.childNodes) {
			changeTreeBgColor(node, color);
		}
	}
	function findNodeWithText(root, text) {
		verbose('findNodeWithText', root, '<=', text);
		if (!root)
			return;
		if (root.nodeName == '#text') {
			if (root.nodeValue.includes(text))
				return root.parentNode;
			return;
		}
		for (let node of root.childNodes) {
			let ret = findNodeWithText(node, text);
			if (ret)
				return ret;
		}
	}
	function checkRemoveNodeAd(node) {
		if (node.nodeName !== 'LI')
			return;
		debug('> check node', node);
		let ad = findNodeWithText(node, '广告');
		debug('  ad ', ad);
		if (!ad /*&& !node.innerText.includes('广告')*/) {
			debug('  no ad', node.innerText);
			return;
		}

		let item = ad.closest('li');
		info('weaken ad', item.id);
		//item.remove();
		ad.setAttribute('style', 'color:yellow!important; font-weight: bold!important;');
		changeTreeBgColor(item, 'DimGray');

	}

	function removeStaticNodesAd() {
		//main list
		for (let node of document.querySelectorAll('#sm-offer-list li, .sw-layout-side ol'))
			checkRemoveNodeAd(node);
		// side bar
		/*
		document.querySelectorAll('.sw-layout-side').forEach((e, i) => {
			info(`side ${i}. ${e}`);
			//e.style.backgroundColor = 'DimGray';
			changeTreeBgColor(e, 'DimGray');
		});
		*/
	}

	function waitAndRemoveDynamicNodesAd() {
		let targetNode = document.querySelector('#sm-offer-list');
		debug('#sm-offer-list', targetNode);
		// Create an observer instance linked to the callback function
		new MutationObserver(function (mutationsList, observer) {
			for (let mutation of mutationsList) {
				if (mutation.type == 'childList') {
					debug('A child node has been added or removed.', mutation);
					for (let node of mutation.addedNodes)
						checkRemoveNodeAd(node);
				}
			}
		}).observe(targetNode, { attributes: false, childList: true, subtree: false });

		targetNode = document.querySelector('.sw-layout-side .sm-widget-p4p');
		debug('.sw-layout-side', targetNode);
		// Create an observer instance linked to the callback function
		new MutationObserver(function (mutationsList, observer) {
			for (let mutation of mutationsList) {
				if (mutation.type == 'childList') {
					debug('A child node has been added or removed.', mutation);
					for (let node of document.querySelectorAll('.sw-layout-side ol > li'))
						checkRemoveNodeAd(node);
				}
			}
		}).observe(targetNode, { attributes: false, childList: true, subtree: false });
	}
	//document.addEventListener('ready', waitAndRemove);
	removeStaticNodesAd();
	waitAndRemoveDynamicNodesAd();
})();
console.log('!!!!!!!!!!!!!!!!!!!/alibaba-ad-remove!!!!!!!!!!!!!!!!!!!!!!!!!!');
