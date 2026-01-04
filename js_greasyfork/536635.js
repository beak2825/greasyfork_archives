// ==UserScript==
// @name         Bonk.io - Hide avatar from win screen
// @namespace    https://greasyfork.org/users/1272759
// @version      1.0.1
// @description  hides avatar from win screen
// @author       Apx
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536635/Bonkio%20-%20Hide%20avatar%20from%20win%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/536635/Bonkio%20-%20Hide%20avatar%20from%20win%20screen.meta.js
// ==/UserScript==

const scriptName = "Hide avatar from win screen";

const guiSettings = {
    noWindow: true,
    settingsContent: null,
    bonkLIBVersion: "1.1.3",
    modVersion: "1.0",
}

window.hideAvatar = {
    enabled: true,
    hideSelfAvatar: false,
};

if(localStorage.getItem("hideAvatar")) {
    window.hideAvatar = JSON.parse(localStorage.getItem("hideAvatar"));
}
else {
    localStorage.setItem("hideAvatar", JSON.stringify(window.hideAvatar));
}

function injector(src) {
	let newSrc = src;

	const toolRegex = newSrc.match(/=new [A-Za-z0-9\$_]{1,3}\(this,[A-Za-z0-9\$_]{1,3}\[0\]\[0\],[A-Za-z0-9\$_]{1,3}\[0\]\[1\]\);/);
	newSrc = newSrc.replace(toolRegex, toolRegex + "window.hideAvatar.toolFunctions = this;");
    const player = newSrc.match(/[a-zA-Z0-9\$_]{3}=null;[a-zA-Z0-9\$_]{3}=1;[a-zA-Z0-9\$_]{3}=0;/)[0];
    const match = newSrc.match(new RegExp(`if\\(${player.split("=")[0]}`));
    newSrc = newSrc.replace(match, match + `&& (!window.hideAvatar.enabled || (!window.hideAvatar.hideSelfAvatar && ${player.split(";")[2].split("=")[0]} == window.hideAvatar.toolFunctions.networkEngine.getLSID()))`);

	return newSrc;
}

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];

window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (e) {
        alert(`Whoops! ${scriptName} was unable to load.`);
		throw e;
	}
});

if (window.bonkHUD) {
    const checkbox = (name, variable) => {
        let container = document.createElement("div");

        const label = document.createElement("label");
		label.classList.add("bonkhud-settings-label");
		label.textContent = name;
		label.style.marginRight = "5px";
		label.style.display = "inline-block";
		label.style.verticalAlign = "middle";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.display = "inline-block";
        checkbox.style.verticalAlign = "middle";
        checkbox.checked = window.hideAvatar[variable];
        checkbox.onclick = () => {
            window.hideAvatar[variable] = checkbox.checked;
            localStorage.setItem("hideAvatar", JSON.stringify(window.hideAvatar));
        }

        container.appendChild(label);
        container.appendChild(checkbox);
        settings.appendChild(container);
    }

    let settings = window.bonkHUD.generateSection();
	guiSettings.settingsContent = settings;

    checkbox("Is Enabled", "enabled");
    checkbox("Hide Self Avatar", "hideSelfAvatar");
    const ind = window.bonkHUD.createMod("Hide avatar from win screen", guiSettings);

	window.bonkHUD.updateStyleSettings();
}