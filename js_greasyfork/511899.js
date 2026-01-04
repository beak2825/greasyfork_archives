// ==UserScript==
// @name        [PS] Battle Log Styler
// @namespace   https://greasyfork.org/en/users/1357767-indigeau
// @version     0.0
// @description Re-styles the Pokémon Showdown battle log.
// @match       https://play.pokemonshowdown.com/*
// @exclude     https://play.pokemonshowdown.com/sprites/*
// @author      indigeau
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/511899/%5BPS%5D%20Battle%20Log%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/511899/%5BPS%5D%20Battle%20Log%20Styler.meta.js
// ==/UserScript==

const main = () => {
	const logSelector = '.battle-log > .message-log';
	
	(() => {
		const styleSheet = (() => {
			const styleElement = document.createElement('style');
			
			document.head.appendChild(styleElement);
			
			return styleElement.sheet;
		})();
		
		const rules = [
			[`${logSelector} > .spacer.battle-history`, [
				['width', '100%'],
				['height', '2px'],
			]],
			[`${logSelector} > .spacer.battle-history:not(h2 + *):not(:has(+h2))`, [
				['margin', '8px -8px'],
				['padding', '0 8px'],
			]],
			[`${logSelector} > h2.battle-history`, [['border-width', '2px']]],
			[`${logSelector} > :not(.battle-history):not(.chat)`, [
				['margin', '-8px'],
				['padding', '5px 8px'],
			]],
			[`${logSelector} > .chat:first-child`, [['visibility', 'hidden']]],
			['.battle-log > .battle-options:has(+ .message-log > .chat:first-child)', [['margin-bottom', '-1em']]],
			['html.dark .ps-room .battle-log', [['scrollbar-color', '#333 #5a5a5a']]],
			['html:not(.dark) .ps-room .battle-log', [['scrollbar-color', '#eef2f5 #aaa']]],
			[`html:not(.dark) ${logSelector} > .spacer.battle-history:not(h2 + *):not(:has(+h2))`, [['background', '#aaa']]],
			[`html.dark ${logSelector} > .spacer.battle-history:not(h2 + *):not(:has(+h2))`, [['background', '#5a5a5a']]],
		];
		
		for (let rule of rules) {
			styleSheet.insertRule(`${rule[0]}{${rule[1].map(([property, value]) => `${property}:${value};`).join('')}}`);
		}
	})();
	
	(() => {
		const onBattle = (() => {
			const addListeners = [];
			const removeListeners = [];
			
			const getBattleRoom = (node) => {
				if (!node.classList.contains('ps-room')) {
					return null;
				}
				
				const room = window.app.rooms[node.id.slice(5)];
				
				return room instanceof window.BattleRoom ? room : null;
			};
			
			const rooms = [...document.body.children]
				.map((node) => getBattleRoom(node))
				.filter((room) => room !== null);
			
			(new MutationObserver((mutations) => {
				for (const {addedNodes, removedNodes} of mutations) {
					for (const node of addedNodes) {
						const room = getBattleRoom(node);
						
						if (!room) {
							return;
						}
						
						for (const listener of addListeners) {
							listener(room, node.id);
						}
						
						rooms.push(room);
					}
					
					for (const node of removedNodes) {
						for (const listener of removeListeners) {
							listener(node.id);
						}
					}
				}
			})).observe(document.body, {childList: true});
			
			return (onAdd, onRemove) => {
				addListeners.push(onAdd);
				
				if (onRemove) {
					removeListeners.push(onRemove);
				}
				
				for (const room of rooms) {
					onAdd(room, room.el.id);
				}
			};
		})();
		
		// Fixes scroll issue for leave message
		onBattle(({'$chat': [{parentElement, children}], 'userList': {'el': userList}}) => {
			(new MutationObserver(() => {
				if (children.length === 0) {
					return;
				}
				
				const {offsetTop} = children[children.length - 2];
				
				if (parentElement.scrollTop + parentElement.clientHeight >= offsetTop) {
					parentElement.scrollTop = parentElement.scrollHeight;
				}
			})).observe(userList, {childList: true});
		});
		
		// Header colour setting
		
		// HSL without the H
		const SL = {
			LIGHT: [24, 90],
			DARK: [20, 20],
		};
		
		// https://stackoverflow.com/a/6445104
		function rgbToHue(...args) {
			const [r, g, b] = args.map((arg) => arg / 255);
			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
			
			if (max === min) {
				return 0;
			}
			
			const d = max - min;
			
			switch (max) {
				case r:
					return ((g - b) / d + (g < b ? 6 : 0)) / 6 * 255;
				
				case g:
					return ((b - r) / d + 2) / 6 * 255;
			}
			
			return ((r - g) / d + 4) / 6 * 255;
		}
		
		const styleSheets = {};
		
		onBattle(
			({battle}, id) => {
				const [deleteColours, setColours] = (() => {
					const styleSheet = (() => {
						const styleElement = document.createElement('style');
						
						document.head.appendChild(styleElement);
						
						return styleElement.sheet;
					})();
					
					const selectors = [`#${id} ${logSelector} > :not(.battle-history):not(.chat)`, `#${id} ${logSelector} > h2.battle-history`];
					
					styleSheets[id] = styleSheet;
					
					return [
						(deleteInitial = false) => {
							for (let i = styleSheet.cssRules.length - 1; i >= (deleteInitial ? 0 : 2); --i) {
								styleSheet.deleteRule(i);
							}
						},
						(hue, doTransition = true) => {
							const rules = [
								[selectors.map((selector) => `html:not(.dark) > body > ${selector}`).toString(), [
									['background-color', `hsl(${hue}, ${SL.LIGHT[0]}%, ${SL.LIGHT[1]}%)${doTransition ? ' !important' : ''}`],
								]],
								[selectors.map((selector) => `html.dark > body > ${selector}`).toString(), [
									['background-color', `hsl(${hue}, ${SL.DARK[0]}%, ${SL.DARK[1]}%)${doTransition ? ' !important' : ''}`],
								]],
							];
							
							if (doTransition) {
								rules.push([selectors.toString(), [['transition', 'background-color 0.9s ease-in-out']]]);
							}
							
							for (let rule of rules) {
								styleSheet.insertRule(`${rule[0]}{${rule[1].map(([property, value]) => `${property}:${value};`).join('')}}`, styleSheet.cssRules.length);
							}
						},
					];
				})();
				
				const init = async () => {
					const image = new Image();
					
					await new Promise((resolve) => {
						image.onload = resolve;
						
						image.src = battle.scene.backdropImage;
					});
					
					const baseHue = rgbToHue(...(new window.ColorThief()).getColor(image));
					
					const updateWeather = (doTransition = false) => {
						const [r, g, b, a = 1] = [...getComputedStyle(battle.scene.$weather[0]).backgroundColor]
							.filter((c) => /[\d\s]/.test(c))
							.join('')
							.split(' ')
							.map((string) => Number.parseInt(string));
						
						deleteColours();
						
						if (a === 0) {
							return;
						}
						
						const weatherHue = rgbToHue(r, g, b);
						
						setColours(weatherHue, doTransition);
					};
					
					setColours(baseHue, false);
					
					if (battle.weather) {
						updateWeather();
					}
					
					Object.defineProperty(battle, 'weather', (() => {
						let weather = battle.weather;
						
						return {
							set(value) {
								weather = value;
								
								updateWeather(true);
							},
							get() {
								return weather;
							},
						};
					})());
				};
				
				init();
				
				Object.defineProperty(battle.scene, 'backdropImage', (() => {
					let image = battle.scene.backdropImage;
					
					return {
						set(value) {
							image = value;
							
							deleteColours(true);
							
							init();
						},
						get() {
							return image;
						},
					};
				})());
			},
			(id) => {
				if (!(id in styleSheets)) {
					return;
				}
				
				styleSheets[id].node.remove();
				
				delete styleSheets[id];
			},
		);
		
		Object.defineProperty(Storage.prefs.data, 'theme', (() => {
			let theme = Storage.prefs.data.theme;
			
			return {
				set(value) {
					theme = value;
					
					for (const sheet of Object.values(styleSheets)) {
						if (sheet.cssRules.length > 4) {
							sheet.deleteRule(4);
						}
					}
				},
				get() {
					return theme;
				},
			};
		})());
	})();
};

// Dealing with firefox being restrictive
(() => {
	const context = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
	
	context._test = {};
	
	const isAccessDenied = (() => {
		try {
			window.eval('_test._');
		} catch (e) {
			return true;
		}
		
		return false;
	})();
	
	delete context._test;
	
	if (isAccessDenied) {
		window.eval(`(${main.toString()})()`);
	} else {
		main();
	}
})();
