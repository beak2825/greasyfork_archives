// ==UserScript==
// @name           BvS FIGHTO Hider
// @namespace      BvS
// @version        5
// @history        5 undo last version, the message is identical whether you have TB2.0 or whether you have another TB unbanked. by taltamir
// @history        4 hides FKF if you already have Tiny Bee 2.0. by taltamir
// @history        3 hides FKF Qualifier if you already have the pass. by taltamir
// @history        2 fixed script not working, cleaned up code, added hiding when blocked by having a non part item (flux capacitor) or when blocked by mr roboto bloodline. by taltamir
// @history        1.0 initial version. by Daniel Karlsson
// @description    Hide FIGHTO tournaments when you already have the part or when you lack Kaiju status.
// @match          http://www.animecubed.com/billy/bvs/villagerobofighto.html
// @match          http://animecubed.com/billy/bvs/villagerobofighto.html
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/19009/BvS%20FIGHTO%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/19009/BvS%20FIGHTO%20Hider.meta.js
// ==/UserScript==

function main()
{
	var tourneyTable = document.evaluate("//table[@class='robotourney']/tbody/tr/td[8]", document, null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	// Check td[8] of all table rows
	var td;
	for (var i = 0; i < 20; i++)
    {
        td = tourneyTable.snapshotItem(i);
		if (/have part/i.test(td.innerHTML) || /Have Item/i.test(td.innerHTML) || /Has Bloodline/i.test(td.innerHTML) || /not kaiju/i.test(td.innerHTML) || /Have Pass/i.test(td.innerHTML))
        {
			td.parentNode.parentNode.removeChild(td.parentNode);
        }
    }
}

main();