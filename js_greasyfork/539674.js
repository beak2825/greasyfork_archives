// ==UserScript==
// @name            1stopbuilders - Yelp cleanup
// @description     Cleanup Yelp for 1stopbuilders
// @version         1.0.4
// @author          Oliver P
// @namespace       https://github.com/OlisDevSpot
// @license         MIT
// @match           https://*.yelp.com/biz/1-stop-builders-mission-hills
// @run-at          document-end
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/539674/1stopbuilders%20-%20Yelp%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/539674/1stopbuilders%20-%20Yelp%20cleanup.meta.js
// ==/UserScript==

const redColor = "rgba(251,67,60,1)";

setTimeout(() => {
	updateMainScore()
}, 1000)

function updateMainScore() {
	const mainScore = document.querySelector("#InfoBox > div > div.left__09f24__AA5eb.y-css-mhg9c5 > div.arrange__09f24__LDfbs.gutter-1__09f24__yAbCL.y-css-mhg9c5 > div:nth-child(1) > div > div > div")
	for (const star of mainScore.children) {
		const svg = star.querySelector("svg");
		const paths = [...svg.querySelectorAll("path")].slice(0,2);
		for (const path of paths) {
			path.style.fill = redColor;
			path.style.opacity = "1";
		}
	}
	
	const rating = document.querySelector("#InfoBox > div > div.left__09f24__AA5eb.y-css-mhg9c5 > div.arrange__09f24__LDfbs.gutter-1__09f24__yAbCL.y-css-mhg9c5 > div.arrange-unit__09f24__rqHTg.arrange-unit-fill__09f24__CUubG.y-css-1n5biw7 > span.y-css-f73en8")
	
	rating.innerText = "4.9 ";
}