// ==UserScript==
// @name        Google Fixed Tab Order
// @namespace   google.com
// @description Stops google from reordering the tabs like wtf are you doing you piece of shit, stolen from https://productforums.google.com/forum/#!topic/websearch/rWuCGv4OluA
// @include     https://www.google.com/search?*
// @include     https://www.google.com/webhp?*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18521/Google%20Fixed%20Tab%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/18521/Google%20Fixed%20Tab%20Order.meta.js
// ==/UserScript==

(function ()
{
	var order = ["All", "Web", "Images", "Videos", "News", "Maps", "Books", "Apps", "Shopping", "Flights"];

	function observerEnable()
	{
		observer.observe(document.querySelector("#main"), { childList: true, subtree: true });
	}
	function observerDisable()
	{
		observer.disconnect();
	}
	var observer = new MutationObserver(function(mutations)
	{
		observerDisable();
		fixTabs();
		observerEnable();
	});
	observerEnable();
	
	function fixTabs()
	{
		var parent = document.querySelector("#hdtb-msb");
		if (parent == null)
			return;

		var tabs = parent.querySelectorAll(".hdtb-mitem");

		var more = document.querySelector("#hdtb-more");
		var tools = document.querySelector("#hdtb-tls");

		while (parent.firstChild)
			parent.removeChild(parent.firstChild);

		for (var i = 0; i < order.length; i++)
			for (var t = 0; t < tabs.length; t++)
				if (order[i] == tabs[t].textContent)
					parent.appendChild(tabs[t]);
					
		parent.appendChild(tools);
	}
	fixTabs();
})();
