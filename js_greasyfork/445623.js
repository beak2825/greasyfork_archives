// ==UserScript==
// @name         Collection Comment Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  counts the number of collection comments
// @author       You
// @match        https://archiveofourown.org/collections/WDLF_MF/works*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445623/Collection%20Comment%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/445623/Collection%20Comment%20Counter.meta.js
// ==/UserScript==

(function() {

	//Use by going to https://archiveofourown.org/collections/WDLF_MF/works?page=1
	//Open console on your browser: Right click --> Inspect, click Console
	//This program will automatically click 'next' until the end of the collection, and then it will write the count to the console
	//Records are stored in localStorage.log
	if (window.location.href == "https://archiveofourown.org/collections/WDLF_MF/works?page=1") window.name = "0"
	let total = JSON.parse(window.name)
	let count = Array.from(document.querySelectorAll("dd.comments")).map(a=>+a.innerText).reduce((a,b)=>a+b)
	total += count
	window.name = JSON.stringify(total)
	let nextbutton = document.querySelector(`a[rel="next"]`)
	if (nextbutton !== null) nextbutton.click()
	else{
		let data = "";
		data += `Count: ${window.name} \n`;
		console.log(data);
		localStorage.log += data;
		console.log(localStorage.log);
	}
})();