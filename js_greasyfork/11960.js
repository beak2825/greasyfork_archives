// ==UserScript==
// @name		@-posting
// @version		0.7.0.0
// @namespace	atposting
// @license		WTFPL
// @include		*://boards.4chan.org/*
// @run-at		document-end
// @grant		none
// @description Link to posts in the same 4chan thread with "@".
// @downloadURL https://update.greasyfork.org/scripts/11960/%40-posting.user.js
// @updateURL https://update.greasyfork.org/scripts/11960/%40-posting.meta.js
// ==/UserScript==

var updateTextChildren = function(node, callback) {
	for (var i = 0; i < node.childNodes.length; i++) {
		var cn = node.childNodes[i];
		if (cn.nodeType === 3) {
			callback(cn);
		};
	};
}

var twitterify = function(targets) {
	Array.prototype.forEach.call(targets, function(target) {
		updateTextChildren(target, function(x) {
			var html = x.nodeValue.replace(
				/#([a-zA-Z]+)/g,
				'<a href="https://archive.rebeccablacktech.com/g/?task=search&search_text=%23$1">#$1</a>'
			).replace(
				/@([0-9]+)/g,
				'<a href="#p$1" class="quotelink">@$1</a>'
			).replace(
				/Dear ([0-9]+)/g,
				'Dear <a href="#p$1" class="quotelink">$1</a>'
			);
			var span = document.createElement("span");
			span.innerHTML = html;
			x.parentNode.replaceChild(span, x);
		});
	});
};

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		twitterify(mutation.addedNodes);
	});
});

observer.observe(document.querySelector('.board .thread'), { attributes: true, childList: true });
twitterify(document.querySelectorAll('.postMessage'));
