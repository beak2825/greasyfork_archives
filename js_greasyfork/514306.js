// ==UserScript==
// @name        [PS] Team Damage Calc
// @namespace   https://greasyfork.org/en/users/1357767-indigeau
// @version     0.1
// @description Gives Pokémon Showdown a keyboard shortcut for damage calculation with your current team.
// @match       https://play.pokemonshowdown.com/*
// @exclude     https://play.pokemonshowdown.com/sprites/*
// @match       https://calc.pokemonshowdown.com/*
// @author      indigeau
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/514306/%5BPS%5D%20Team%20Damage%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/514306/%5BPS%5D%20Team%20Damage%20Calc.meta.js
// ==/UserScript==

// A template for messages from this script with a signature
const MESSAGE = {password: 'calcWithTeam'};

// Trigger a callback when a message is recieved from the target url
const listen = (callback, target) => {
	const listener = ({origin, 'data': {password, ...data}}) => {
		if (origin !== target || password !== MESSAGE.password) {
			return;
		}
		
		window.removeEventListener('message', listener);
		
		callback(data);
	};
	
	window.addEventListener('message', listener);
};

// play.pokemonshowdown.com
const play = () => {
	const CONFIG_MENU = {
		ctrl: {
			name: 'calcshortcutctrl',
			method: 'calcUpdateShortcutCtrl',
			key: 'calcshortcutctrl',
			text: ' Require ctrl',
			placeholder: true,
		},
		alt: {
			name: 'calcshortcutalt',
			method: 'calcUpdateShortcutAlt',
			key: 'calcshortcutalt',
			text: ' Require alt',
			placeholder: true,
		},
		key: {
			name: 'calcshortcutkey',
			method: 'calcUpdateShortcutKey',
			key: 'calcshortcutkey',
			text: ' Key',
			placeholder: 'c',
		},
	};
	
	for (const {name, method, key} of [CONFIG_MENU.alt, CONFIG_MENU.ctrl]) {
		window.OptionsPopup.prototype.events[`change input[name=${name}]`] = method;
		
		window.OptionsPopup.prototype[method] = ({currentTarget}) => {
			// Idk what's up with the !! for checked, just copying the showdown code
			window.Storage.prefs(key, !!currentTarget.checked);
		};
	}
	
	window.OptionsPopup.prototype.events[`input input[name=${CONFIG_MENU.key.name}]`] = CONFIG_MENU.key.method;
	
	window.OptionsPopup.prototype[CONFIG_MENU.key.method] = ({currentTarget, 'originalEvent': {data}}) => {
		currentTarget.value = data ? data[data.length - 1].toLowerCase() : CONFIG_MENU.key.placeholder;
		
		window.Storage.prefs(CONFIG_MENU.key.key, currentTarget.value);
	};
	
	window.OptionsPopup.prototype.update = (() => {
		const callback = window.OptionsPopup.prototype.update;
		
		return function () {
			callback.call(this);
			
			const nextSibling = this.el.querySelector('.buttonbar');
			
			(() => {
				const line = document.createElement('p');
				const title = document.createElement('strong');
				
				title.innerText = 'Calc Command';
				
				line.append(title);
				
				this.el.insertBefore(line, nextSibling);
			})();
			
			for (const {name, text, key, placeholder} of Object.values(CONFIG_MENU)) {
				const line = document.createElement('p');
				const input = document.createElement('input');
				const label = document.createElement('label');
				
				label.classList.add('checkbox');
				label.innerText = text;
				
				input.setAttribute('name', name);
				
				if (key === CONFIG_MENU.key.key) {
					label.style.setProperty('display', 'flex');
					label.style.setProperty('align-items', 'center');
					label.style.setProperty('white-space', 'pre');
					
					input.style.setProperty('width', '14px');
					input.style.setProperty('height', '1.5em');
					input.style.setProperty('font-family', 'monospace');
					input.style.setProperty('text-align', 'center');
					input.style.setProperty('cursor', 'text');
					input.style.setProperty('caret-color', 'transparent');
					
					input.value = Storage.prefs(key) ?? placeholder;
				} else {
					input.setAttribute('type', 'checkbox');
					
					input.checked = Storage.prefs(key) ?? placeholder;
				}
				
				label.insertBefore(input, label.firstChild);
				line.append(label);
				this.el.insertBefore(line, nextSibling);
			}
			
			this.el.insertBefore(document.createElement('hr'), nextSibling);
		};
	})();
	
	document.body.addEventListener('keydown', ({key, altKey, ctrlKey}) => {
		if (
			!key
			|| key.toLowerCase() !== (Storage.prefs(CONFIG_MENU.key.key) ?? CONFIG_MENU.key.placeholder)
			|| altKey !== (Storage.prefs(CONFIG_MENU.alt.key) ?? CONFIG_MENU.alt.placeholder)
			|| ctrlKey !== (Storage.prefs(CONFIG_MENU.ctrl.key) ?? CONFIG_MENU.ctrl.placeholder)
		) {
			return;
		}
		
		const button = window.app.rooms[''].el.querySelector('.teamselect:not(.preselected)');
		
		if (!button) {
			return null;
		}
		
		const team = Storage.teams[button.value];
		
		if (!team) {
			return;
		}
		
		const {postMessage} = window.open(`https://calc.pokemonshowdown.com/?gen=${team.gen}`);
		
		listen(() => postMessage({
			team: Storage.exportTeam(Storage.unpackTeam(team.team), team.gen),
			name: team.name,
			...MESSAGE,
		}, 'https://calc.pokemonshowdown.com'), 'https://calc.pokemonshowdown.com');
	});
};

// calc.pokemonshowdown.com
const calc = () => {
	const KEY_STORAGE = 'calcWithTeamSets';
	
	const importTeam = ({name, team}) => {
		const {alert, 'localStorage': {customsets}} = window;
		const checkbox = document.getElementById('importedSets');
		
		// Avoid the ("Successfully imported x sets" popup)
		window.alert = (message) => {
			console.log(`CalcWithTeam: ${message}`);
		};
		
		document.querySelector('.import-name-text').value = name;
		document.querySelector('.import-team-text').value = team;
		
		// Do the import
		document.querySelector('button#import').click();
		
		// Click the "Only show imported sets" button
		checkbox.click();
		
		// Undo save to localStorage
		if (customsets) {
			localStorage.customsets = customsets;
		} else {
			localStorage.removeItem('customsets');
		}
		
		window.alert = alert;
		
		const target = checkbox.parentElement;
		(new MutationObserver(() => {
			if (target.style.display === 'none') {
				sessionStorage.removeItem(KEY_STORAGE);
			}
		})).observe(target, {attributes: true, attributeFilter: ['style']});
	};
	
	// Only run if opened from play.pokemonshowdown.com
	if (!window.opener) {
		const saved = sessionStorage.getItem(KEY_STORAGE);
		
		if (saved) {
			importTeam(JSON.parse(saved));
		}
		
		return;
	}
	
	listen((data) => {
		sessionStorage.setItem(KEY_STORAGE, JSON.stringify(data));
		
		importTeam(data);
	}, 'https://play.pokemonshowdown.com');
	
	window.opener.postMessage(MESSAGE, 'https://play.pokemonshowdown.com');
	
	// Avoid running again on refresh
	window.opener = null;
};

({play, calc})[window.location.hostname.slice(0, 4)]();
