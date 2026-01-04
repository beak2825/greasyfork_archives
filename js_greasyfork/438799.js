// ==UserScript==
// @name		Melvor Idle - Auto Save
// @namespace   http://tampermonkey.net/
// @version		0.1.2
// @description	Adds extra button to character menu in top right that saves and then goes to character selection screen.
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/438799/Melvor%20Idle%20-%20Auto%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/438799/Melvor%20Idle%20-%20Auto%20Save.meta.js
// ==/UserScript==


function script() {
    function closeAfterSave() {
        if (forceSaveCooldown && !forceSave) {
            location.href='index.php';
        }
        else {
            setTimeout(closeAfterSave, 100);
        }
    }

	function attemptForceSave() {
		if (!forceSaveCooldown) {
			forceSync(false, false);
			closeAfterSave();
		}
		else {
			setTimeout(attemptForceSave, 100);
		}
	};

	let htmlSaveAndQuitButton = `
		<a class="dropdown-item d-flex align-items-center justify-content-between pointer-enabled">
			<span>
				Save &amp; Select Character
			</span>
		</a>`;
	let template = document.createElement('template');
	template.innerHTML = htmlSaveAndQuitButton.trim();

	let parentElement = document.querySelector("#header-user-options-dropdown > div.p-2")
	let selectCharacterAndQuitButton = parentElement.appendChild(template.content.firstChild);

	selectCharacterAndQuitButton.onclick = attemptForceSave;
}

function loadScript() {
	if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
		clearInterval(scriptLoader);
		const scriptElement = document.createElement('script');
		scriptElement.textContent = `try {(${script})();} catch (e) {console.log(e);}`;
		document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
	}
}
 
const scriptLoader = setInterval(loadScript, 200);