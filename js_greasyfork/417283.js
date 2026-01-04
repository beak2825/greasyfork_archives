// ==UserScript==
// @name         Get Google job infos
// @namespace    https://aymericdev.fr
// @version      2.1.1
// @description  permet de repcuprer les infos Google job
// @author       AymericDev.fr
// @match        https://www.google.fr/search?*
// @match        https://www.google.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417283/Get%20Google%20job%20infos.user.js
// @updateURL https://update.greasyfork.org/scripts/417283/Get%20Google%20job%20infos.meta.js
// ==/UserScript==

console.log("Get Google job infos");
window.googleJobScrapper = () => {
	var objDiv = document.querySelector(".gws-plugins-horizon-jobs__tl-lvc");
	var Interval = setInterval(() => {
		if (
			objDiv.scrollTop === objDiv.scrollTopMax &&
			document.querySelector(".tV5gNc.AD0oDb.gws-plugins-horizon-jobs__hz-sp-h") &&
			window.getComputedStyle(document.querySelector(".tV5gNc.AD0oDb.gws-plugins-horizon-jobs__hz-sp-h")).display == "none"
		) {
			clearInterval(Interval);
			var jobs = document.querySelectorAll(".iFjolb")
			var output = '"title";"city";"network";"logo"\n';
			for (var job of jobs) {
				var img = job.querySelector("img.rISBZc")
				var data = {
					title: job.querySelector(".BjJfJf.PUpOsf").innerText.trim().replace('"', '\"'),
					city: job.querySelector(".Qk80Jf").innerText.trim().replace('"', '\"'),
					network: job.querySelector(".vNEEBe").innerText.trim().replace('"', '\"'),
					logo: img ? img.src : '',
				};
				output += `"${data.title}";"${data.city}";"${data.network}";"${data.logo}"\n`
			}
			console.log(output);
		}
		objDiv.scrollTop = objDiv.scrollHeight;
	}, 500);
}
