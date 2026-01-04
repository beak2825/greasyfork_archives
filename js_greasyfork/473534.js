// ==UserScript==
// @name         powpowyt
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  The Infitine powers script
// @author       Made by powpowyt
// @match        https://cellcraft.io/
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0GHd03zAYQL2pMq8j1wSfqvXNS4PYM08_rdA25bTl878dBxWpNGzE5TcWqU89f60MAac&usqp=CAU
// @grant        none
// @license      niceguy1111
// @downloadURL https://update.greasyfork.org/scripts/473534/powpowyt.user.js
// @updateURL https://update.greasyfork.org/scripts/473534/powpowyt.meta.js
// ==/UserScript==

(() => {
	const realSettings = {
		bypassNameBlock: false,
		bypassChatCensor: false,
		skinChanger: false,
		infinitePowers: false,
	};
	const settings = new Proxy(realSettings, {
		set(target, prop, newValue, receiver) {
			let ret = Reflect.set(...arguments);
			localStorage.setItem(
				'extrasSettings',
				JSON.stringify(realSettings)
			);
			return ret;
		},
	});
	let _pSettings;
	if ((_pSettings = localStorage.getItem('extrasSettings'))) {
		try {
			let parsed = JSON.parse(_pSettings);
			for (let item in parsed) {
				settings[item] = parsed[item];
			}
		} catch (e) {
			localStorage.removeItem('extrasSettings');
		}
	}
	bypassNameBlock: {
		const blockedNamed = [
			'hitler',
			'nazi',
			'porno',
			'fuck',
			'lul',
			'eikel',
			'isis',
			'penis',
			'sora',
			'admin',
			'administrator',
			'hate',
			'terrorist',
            'nigger' ,
		];
		let pindexOf = Array.prototype.indexOf;
		Array.prototype.indexOf = function (str) {
			if (
				typeof str == 'string' &&
				blockedNamed.includes(str.replace(/ /g, '').toLowerCase()) &&
				settings.bypassNameBlock
			)
				return -1;
			return pindexOf.apply(this, arguments);
		};
	}
	bypassChatCensor: {
		function unfilter(value) {
			if (value.startsWith('/')) return value;
			return value.replace(/([^:\w]|^)(\w)(\w+)/g, '$1$2\u206a$3');
		}

		const chatbox = document.getElementById('chtbox');
		let pValue = '';
		let pGetter = Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			'value'
		).get;
		let pSetter = Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			'value'
		).set;
		Object.defineProperty(chatbox, 'value', {
			get() {
				if (settings.bypassChatCensor)
					return unfilter(pGetter.apply(chatbox));
				else return pGetter.apply(chatbox);
			},
			set() {
				return pSetter.apply(chatbox, arguments);
			},
		});
	}
	skinChanger: {
		let pSendNick = null;
		let isAlive = false;
		let realSetUint16 = DataView.prototype.setUint16;
		DataView.prototype.setUint16 = function (offset, value, LE) {
			if (offset == 1 && LE && this.getUint8(0) == 1) {
				pSendNick = arguments.callee.caller;
				isAlive = true;
				if (settings.skinChanger) {
					return realSetUint16.apply(this, [
						offset,
						Math.ceil(Math.random() * 16),
						LE,
					]);
				}
			} else if (offset == 0 && value == 14) {
				isAlive = false;
			}
			return realSetUint16.apply(this, arguments);
		};

		setInterval(() => {
			if (isAlive && pSendNick && settings.skinChanger) {
				pSendNick();
			}
		}, 10);
	}

	infinitePowers: {
		/** @type {WebSocket} */
		let gameSocket = null;
		let websockSendFromGame = null;
		(call => {
			Function.prototype.call = function (thisArg, ...args) {
				// console.log(this, thisArg, ...args);
				if (thisArg instanceof WebSocket) {
					if (thisArg.url.includes('cellcraft.io')) {
						gameSocket = thisArg;
						if (this.name == 'send') websockSendFromGame = this;
					}
				}
				return call.apply(this, [thisArg, ...args]);
			};
		})(Function.prototype.call);

		function sendLogin() {
			const username = localStorage.getItem('username');
			if (!username) return;
			const drum = localStorage.getItem('drum');
			let password;
			if (drum) password = localStorage.getItem(window.md5(drum));
			else password = localStorage.getItem('password');
			if (!password) return;

			let packet = new Uint8Array(
				5 + 2 * password.length + 2 * username.length
			);
			let idx = 0;

			packet[idx++] = 0x02;

			for (let char of [...username]) {
				packet[idx++] = char.charCodeAt(0) & 0xff;
				packet[idx++] = (char.charCodeAt(0) >> 8) & 0xff;
			}
			idx += 2;
			for (let char of [...password]) {
				packet[idx++] = char.charCodeAt(0) & 0xff;
				packet[idx++] = (char.charCodeAt(0) >> 8) & 0xff;
			}
			if (gameSocket && gameSocket.readyState == WebSocket.OPEN) {
				websockSendFromGame.call(gameSocket, packet);
			}
		}
		const powerOps = [30, 31];
		let pSetUint8 = DataView.prototype.setUint8;
		let shootingPower = true;
		let loginInter = -1;

		const realU8 = DataView.prototype.getUint8;
		DataView.prototype.getUint8 = function (offset) {
			if (offset == 0 && realU8.call(this, 0) == 96) {
				clearInterval(loginInter);
			}
			return realU8.apply(this, arguments);
		};
		DataView.prototype.setUint8 = function (offset, value) {
			if (
				settings.infinitePowers &&
				offset == 0 &&
				powerOps.includes(value)
			) {
				if (gameSocket && gameSocket.readyState == WebSocket.OPEN) {
					websockSendFromGame.call(gameSocket, new Uint8Array([5]));
					clearInterval(loginInter);
					setTimeout(() => {
						clearInterval(loginInter);
						loginInter = setInterval(() => {
							sendLogin();
						}, 50);
					}, 50);
				}
			}

			if (offset == 1 && this.getUint8(0) == 22) {
				if (value == 0) shootingPower = false;
				else shootingPower = true;
			}
			if (
				settings.infinitePowers &&
				shootingPower &&
				offset == 0 &&
				value == 21
			) {
				shootingPower = false;
				websockSendFromGame.call(gameSocket, new Uint8Array([5]));
				clearInterval(loginInter);
				setTimeout(() => {
					clearInterval(loginInter);
					loginInter = setInterval(() => {
						sendLogin();
					}, 50);
				}, 50);
			}
			return pSetUint8.apply(this, arguments);
		};
	}

	addToSettings: {
		const settingsMenu = document.querySelector(
			'div.modal.settings > div.body'
		);
		const settingsNav = settingsMenu.querySelector('div.settings-nav');
		const settingsButton = document.createElement('button');
		settingsButton.setAttribute('settings-nav', 'extras');
		settingsButton.innerText = ' Extras ';
		settingsButton.onclick = () => {
			for (const elm of settingsNav.children) {
				elm.classList.remove('active');
			}
			settingsButton.classList.add('active');

			for (const elm of settingsMenu.querySelectorAll(
				'div.settings-page'
			)) {
				if (elm.getAttribute('settings') == 'extras')
					elm.style.display = 'block';
				else elm.style.display = 'none';
			}
		};
		settingsNav.appendChild(settingsButton);

		const settingsPage = document.createElement('div');
		settingsPage.classList.add('settings-page');
		settingsPage.setAttribute('settings', 'extras');
		settingsPage.style.display = 'none';

		let lastSettingWrapper = null;
		for (const setting in settings) {
			const wasASettingWrapper = lastSettingWrapper != null;
			if (!wasASettingWrapper) {
				lastSettingWrapper = document.createElement('div');
				lastSettingWrapper.classList.add('settings-wrapper');
			}

			const settingElm = document.createElement('div');
			settingElm.classList.add('setting');

			const settingCheckbox = document.createElement('div');
			settingCheckbox.classList.add('checkbox');

			const settingInput = document.createElement('input');
			settingInput.id = 'extras' + setting;
			settingInput.type = 'checkbox';
			settingInput.checked = settings[setting];
			settingInput.onchange = () =>
				(settings[setting] = settingInput.checked);

			const settingLabel = document.createElement('label');
			settingLabel.htmlFor = 'extras' + setting;

			settingLabel.appendChild(document.createElement('span'));

			settingLabel.appendChild(
				new Text(
					setting
						.replace(/([A-Z])/g, ' $1')
						.replace(/^(\w)/, (_, $1) => $1.toUpperCase())
				)
			);

			settingCheckbox.appendChild(settingInput);
			settingCheckbox.appendChild(settingLabel);

			settingElm.appendChild(settingCheckbox);

			lastSettingWrapper.appendChild(settingElm);

			if (wasASettingWrapper) {
				settingsPage.appendChild(lastSettingWrapper);
				lastSettingWrapper = null;
			}
		}
		if (lastSettingWrapper) {
			settingsPage.appendChild(lastSettingWrapper);
			lastSettingWrapper = null;
		}

		settingsMenu.appendChild(settingsPage);
	}

	addHiddenItems: {
		function createShopItem(
			title,
			price,
			prodId,
			type,
			tooltip,
			picture,
			time = null
		) {
			const skinCard = document.createElement('div');
			skinCard.classList.add('skin-card');

			const skinDiv = document.createElement('div');
			skinDiv.classList.add('skin');

			if (time) {
				const timeDiv = document.createElement('div');
				timeDiv.classList.add('time');
				timeDiv.innerText = time;
				skinDiv.appendChild(timeDiv);
			}

			const productImage = document.createElement('img');
			productImage.src = picture;

			skinDiv.appendChild(productImage);

			const infoDiv = document.createElement('div');
			infoDiv.classList.add('info');

			const infoTitle = document.createElement('p');
			infoTitle.classList.add('title');
			infoTitle.innerText = title;

			const infoPrice = document.createElement('p');
			infoPrice.classList.add('price');

			const coinI = document.createElement('i');
			coinI.classList.add('fas', 'fa-coins');

			infoPrice.appendChild(coinI);
			infoPrice.appendChild(new Text(price.toString()));

			const buttonsDiv = document.createElement('div');
			buttonsDiv.classList.add('buttons');

			const infoBtn = document.createElement('button');
			infoBtn.classList.add('btn', 'info', 'small');
			infoBtn.onclick = () => {
				window.itemInfoAlert(title, tooltip);
			};

			const infoButtonIcon = document.createElement('i');
			infoButtonIcon.classList.add('fas', 'fa-info-circle');

			infoBtn.appendChild(infoButtonIcon);

			const buyButton = document.createElement('button');
			buyButton.classList.add('btn', 'success', 'small');
			buyButton.onclick = () => {
				window.warnBeforeBuy(
					type,
					'coins',
					price.toString(),
					`${title}${time ? ` | ${time}` : ''}`,
					prodId.toString()
				);
			};

			buyButton.appendChild(new Text('Buy'));

			buttonsDiv.appendChild(infoBtn);
			buttonsDiv.appendChild(buyButton);

			infoDiv.appendChild(infoTitle);
			infoDiv.appendChild(infoPrice);
			infoDiv.appendChild(buttonsDiv);

			skinCard.appendChild(skinDiv);
			skinCard.appendChild(infoDiv);

			return skinCard;
		}

		const minionsDiv = document.querySelector(
			'div.shop-page.minions > div.skin-cards'
		);
		const itemsDiv = document.querySelector(
			'div.shop-page.runes > div.skin-cards'
		);

		function addItemToShop(
			targetDiv,
			title,
			price,
			prodId,
			type,
			tooltip,
			picture,
			time = null
		) {
			const elm = createShopItem(
				title,
				price,
				prodId,
				type,
				tooltip,
				picture,
				time
			);
			/** @type { HTMLParagraphElement | null } */
			let lowest = null;
			for (const child of targetDiv.children) {
				/** @type { HTMLParagraphElement | null } */
				let npriceElm = child.querySelector('p.price');
				if (!npriceElm) {
					continue;
				}
				let nprice = parseInt(npriceElm.innerText);
				if (isNaN(nprice)) {
					continue;
				}
				let oprice = lowest
					? parseInt(lowest.querySelector('p.price').innerText)
					: Infinity;

				if (nprice < oprice && nprice > price) {
					lowest = child;
				}
			}
			if (!lowest) {
				targetDiv.appendChild(elm);
			} else {
				targetDiv.insertBefore(elm, lowest);
			}
		}
		addHiddenMinions: {
			addItemToShop(
				minionsDiv,
				'50 Minions',
				150,
				3,
				'minions',
				'These 50 minions will follow you around the map, and gain you mass for 2 hours. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'2 Hours'
			);
			addItemToShop(
				minionsDiv,
				'50 Minions',
				300,
				15,
				'minions',
				'These 50 minions will follow you around the map, and gain you mass for 8 hours. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'8 Hours'
			);
			addItemToShop(
				minionsDiv,
				'80 Minions',
				300,
				4,
				'minions',
				'These 80 minions will follow you around the map, and gain you mass for 4 hours. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'4 Hours'
			);
			addItemToShop(
				minionsDiv,
				'100 Minions',
				700,
				9,
				'minions',
				'These 100 minions will follow you around the map, and gain you mass for 24 hours. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'24 Hours'
			);
			addItemToShop(
				minionsDiv,
				'125 Minions',
				900,
				10,
				'minions',
				'These 125 minions will follow you around the map, and gain you mass for 48 hours. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'48 Hours'
			);
			addItemToShop(
				minionsDiv,
				'300 Minions',
				2000,
				11,
				'minions',
				'These 300 minions will follow you around the map, and gain you mass for 72 hours. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'72 Hours'
			);
			addItemToShop(
				minionsDiv,
				'100XL Minions',
				800,
				8,
				'minions',
				'These 100 XXL minions will follow you around the map, and gain you mass for 1 hour. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'1 Hour'
			);
			addItemToShop(
				minionsDiv,
				'100XL Minions',
				2500,
				12,
				'minions',
				'These 100 XXL minions will follow you around the map, and gain you mass for 24 hours. You can control them with the keybinds set in the settings.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'24 Hours'
			);
			addItemToShop(
				minionsDiv,
				'500XL Minions',
				3000,
				16,
				'minions',
				'These 500 XXL minions will follow you around the map,and wil suck your dick all the time.',
				'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-06-512.png',
				'24 Hours'
			);
		}
		addItems: {
			let ogShop = [];
			for (const child of itemsDiv.children) {
				try {
					const infoBtn = child.querySelector(
						'button.btn.info.small'
					);
					const buyBtn = child.querySelector(
						'button.btn.success.small'
					);
					const imgSrc = child.querySelector('img').src;
					const infoJSON = JSON.parse(
						infoBtn.getAttribute('item-info')
					);
					const buyJSON = JSON.parse(
						buyBtn.getAttribute('warn-before-buy')
					);
					console.log(parseInt(buyJSON.price));
					ogShop.push([
						infoJSON.title,
						parseInt(buyJSON.price),
						parseInt(buyJSON.prodId),
						buyJSON.type,
						infoJSON.text,
						imgSrc,
					]);
				} catch (e) {}
			}
			itemsDiv.innerHTML = '';
			for (const ogShopItem of ogShop) {
				addItemToShop(itemsDiv, ...ogShopItem);
			}
			addItemToShop(
				itemsDiv,
				'Virus',
				380,
				7,
				'items',
				'Virus',
				'https://cellcraft.io/img/inventory/virus.png'
			);
			addItemToShop(
				itemsDiv,
				'Mothercell',
				380,
				8,
				'items',
				'Mothercell',
				'https://cellcraft.io/img/inventory/mothercell.png'
			);
			addItemToShop(
				itemsDiv,
				'Freeze Ability',
				280,
				18,
				'items',
				'Freeze Ability',
				'https://cellcraft.io/img/freeze.png'
			);
			addItemToShop(
				itemsDiv,
				'2x Spawn Mass',
				300,
				20,
				'items',
				'2x Spawn Mass',
				'https://cdn.discordapp.com/attachments/376498148358750209/694875968522813480/wjzVz167eGDWdGVRKVnsHpeY32mQkUc9yn6WaJ3jGDMmeh0d6o5c60cUpJ57Y-s1SP79Z1935m_TLaflO5u6WRUC1s0HLqNqplf2.png'
			);
			addItemToShop(
				itemsDiv,
				'Invisibility',
				280,
				22,
				'items',
				'Invisibility',
				'https://cellcraft.io/img/frozen_virus.png'
			);
			addItemToShop(
				itemsDiv,
				'2x XP',
				2000,
				23,
				'items',
				'2x XP',
				'https://cdn.discordapp.com/attachments/376498148358750209/694875968522813480/wjzVz167eGDWdGVRKVnsHpeY32mQkUc9yn6WaJ3jGDMmeh0d6o5c60cUpJ57Y-s1SP79Z1935m_TLaflO5u6WRUC1s0HLqNqplf2.png'
			);
			addItemToShop(
				itemsDiv,
				'Anti Recombine',
				60,
				34,
				'items',
				'Anti Recombine',
				'https://cellcraft.io/skins/objects/21_lo.png'
			);
			addItemToShop(
				itemsDiv,
				'Anti Freeze',
				40,
				35,
				'items',
				'Anti Freeze',
				'https://cellcraft.io/skins/objects/20_lo.png'
			);
		}
	}
})();