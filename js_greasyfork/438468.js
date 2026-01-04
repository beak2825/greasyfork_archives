// ==UserScript==
// @name         Shake Gifts button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a 'Shake' button to unrevealed gifts
// @author       You
// @match        https://archiveofourown.org/users/*/gifts
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438468/Shake%20Gifts%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/438468/Shake%20Gifts%20button.meta.js
// ==/UserScript==

(function() {
	Array.from(document.getElementsByClassName("gift work blurb group")).map(a=>{
		const id = a.id.replace("work_","");
		const link = a.querySelector("a").href + "/works?work_search[query]=id%3A" + id;
		if (a.innerText.includes("This is part of an ongoing challenge and will be revealed soon!")) a.innerHTML += `<button onclick=window.open("${link}","_blank")>Shake</button>`
	})
})();