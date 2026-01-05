// ==UserScript==
// @name        Furvilla - Highlight Monster Weakness
// @namespace   Shaun Dreclin
// @description Highlights the weapon your warrior should use to attack a monster.
// @include     /^https?://www\.furvilla\.com/career/warrior/[0-9]+$/
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21483/Furvilla%20-%20Highlight%20Monster%20Weakness.user.js
// @updateURL https://update.greasyfork.org/scripts/21483/Furvilla%20-%20Highlight%20Monster%20Weakness.meta.js
// ==/UserScript==

function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        (rect.bottom - ((rect.bottom - rect.top)/2)) <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

setInterval(function() {
	if (document.querySelectorAll("img[src$='furvilla.com/img/battle.png']").length > 0) {
		switch(document.querySelectorAll("img[src$='furvilla.com/img/battle.png']").length) {
			case 1:
				var monsterElement = document.querySelectorAll(".label.label-primary:not(.tooltipster)")[1].innerHTML.trim();
				break;
			case 2:
				var monsterElement = document.querySelectorAll(".label.label-primary:not(.tooltipster)")[0].innerHTML.trim();
				break;
		}
		
		var battling = false;
		var bottomDiv = document.querySelector("div.modal-body > div.text-right");
		if(bottomDiv.querySelector("a:not(.btn)")) {
			battling = true;
		}
		
		if(battling) {
			var weapons = document.querySelectorAll(".explore-item");
			if(weapons.length > 0) {
				for(var weapon of weapons) {
					var weaponElement = weapon.querySelector(".label.label-primary").innerHTML.trim();

					if(monsterElement == "Balance" && weaponElement == "Dark") {
						weapon.style.boxShadow = "0 0 5px 5px #FFD700 inset";
						if(!isElementInViewport(weapon)) { weapon.querySelector("img").scrollIntoView(false); }
					} else if(monsterElement == "Light" && weaponElement == "Balance") {
						weapon.style.boxShadow = "0 0 5px 5px #FFD700 inset";
						if(!isElementInViewport(weapon)) { weapon.querySelector("img").scrollIntoView(false); }
					} else if(monsterElement == "Dark" && weaponElement == "Light") {
						weapon.style.boxShadow = "0 0 5px 5px #FFD700 inset";
						if(!isElementInViewport(weapon)) { weapon.querySelector("img").scrollIntoView(false); }
					}
				}
			}
		} else {
			if(!isElementInViewport(bottomDiv)) {
				bottomDiv.scrollIntoView(false);
			}
		}
	}
}, 100);