// ==UserScript==
// @name         Background Tab Stopper
// @namespace    bgTabStopper_kk
// @version      0.2
// @description  Speed up browser (chrome) by stopping background tabs from completely loading
// @author       Kai Krause <kaikrause95@gmail.com>
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/32337/Background%20Tab%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/32337/Background%20Tab%20Stopper.meta.js
// ==/UserScript==

/*
Powershell:
(Get-Process chrome | Measure-Object WorkingSet -sum).sum

Working Memory Set of 28 Chrome Tabs (Several Youtube) at Startup
...Before: 3833778176 (3.8gb)
...After: 2463367168 (2.4gb)
= 35.7457% decrease!

https://www.calculatorsoup.com/calculators/algebra/percent-change-calculator.php
*/

setTimeout(function() {
	if (!document.hasFocus() && document.hidden) {
		window.stop();
		window.addEventListener("focus", restoreTab, true);
		document.getElementsByTagName('head')[0].innerHTML = "<title>" + document.title + "</title>";
		document.body.remove();
	}
}, 4);

function restoreTab() {
	location.reload();
}