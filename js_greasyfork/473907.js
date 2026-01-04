// ==UserScript==
// @name         DOTV To Next Level Timer
// @namespace    https://greasyfork.org/users/1159361
// @version      1.8
// @license MIT
// @description  Estimates Time needed to naturally level
// @author       Zaregoto_Gaming & Infinity
// @match        https://play.dragonsofthevoid.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/473907/DOTV%20To%20Next%20Level%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/473907/DOTV%20To%20Next%20Level%20Timer.meta.js
// ==/UserScript==
(function () {
	// globals
	let tnlText;
	let xpPerMin;
	let mobileAdj;

	// Wait for the page to load
	async function timedExecution() {
		if (
			typeof document.getElementsByClassName("chat-container")[0] === "object"
		) {
			console.log("TNL Script Running");
			mobileAdj =
				document.getElementsByClassName("ammount-left").length === 5 ? 1 : 0;
			xpPerMin = await getXpPerMin();
			tnlCounter();
		} else {
			setTimeout(timedExecution, 1000);
		}
	}

	// TNL Counter
	function tnlCounter() {
		// Create the TNL text element
		tnlText = document.createElement("span");
		tnlText.style.cssText =
			"font-size: max(14px, var(--min-font-size)); margin-left: 20px; color: white; padding-top: 3px;";
		document
			.getElementsByClassName("ammount-left")
			[3 + mobileAdj].appendChild(tnlText);

		//Use a mutation observer to update the TNL text when the resource values change
		const observer = new MutationObserver(update);
		const config = { childList: true, subtree: true };
		const elements = document.querySelectorAll(".ammount-left");
		elements.forEach((el) => observer.observe(el.firstChild, config));

		update();
	}

	// Update the TNL text using new resource values
	function update() {
		let resources = {
			vit: 0,
			en: 0,
			hon: 0,
			xp: 0,
		};
		// Get the resource values from the DOM
		const elements = document.querySelectorAll(".ammount-left");
		elements.forEach((el, i) => {
			const r = parseInt(
				el.firstChild.innerText.split("/")[0].replace(",", "")
			);
			if (i === 0 + mobileAdj) resources.vit = r;
			else if (i === 1 + mobileAdj) resources.en = r;
			else if (i === 2 + mobileAdj) resources.hon = r;
			else if (i === 3 + mobileAdj) resources.xp = r;
		});
        var totalResources, resourcesRequired, minutesTNL,hours,remainingMinutes,timestr;
		totalResources = resources.vit + resources.en + resources.hon;
		resourcesRequired = parseInt(resources.xp / 1.50);

		minutesTNL = (resourcesRequired - totalResources) / xpPerMin;
        console.log("reqired RSC " + resourcesRequired);
        console.log("exp per min " + xpPerMin);
        console.log("total RSC " + totalResources);
		hours = Math.floor(minutesTNL / 60);
		remainingMinutes = minutesTNL % 60;
		timestr = "";
		if (hours > 0) {
			timestr += `${hours}h `;
		}
		timestr += `${Math.floor(remainingMinutes)}m`;

		// Change the TNL text
		if (resourcesRequired < totalResources) {
			tnlText.innerHTML = "You have enough resources to level up!";
		} else {

			tnlText.innerHTML = `&nbsp;&nbsp;&nbsp; ${timestr}   &nbsp;&nbsp;&nbsp;  Resources: ${totalResources}/${resourcesRequired}`;
		}
	}

	// Get the xp per minute using dotv api
	async function getXpPerMin() {
		const response = await fetch(
			"https://api.dragonsofthevoid.com/api/user/info",
			{
				headers: {
					Authorization: localStorage.token,
				},
			}
		);
		const responseData = await response.json();
		const user = responseData.payload.user;

		const rscPerMin =
			60 / user.energyTimerSeconds +
			60 / user.vitalityTimerSeconds +
			60 / user.honorTimerSeconds;

		return rscPerMin;
	}

	// Start the timed execution.
	timedExecution();
})();