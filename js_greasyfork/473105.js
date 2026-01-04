// ==UserScript==
// @name         Cellcraft Extras Script
// @namespace    Add Hiden Item
// @version      0.1
// @description  Cellcraft Add All Item Hiden
// @author       Huy
// @match        https://cellcraft.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cellcraft.io
// @grant        none
// ==/UserScript==

(() => {
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
				'These 500 XXL minions will follow you around the map, and gain you mass for 24 hours. You can control them with the keybinds set in the settings.',
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
				290,
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
				60,
				35,
				'items',
				'Anti Freeze',
				'https://cellcraft.io/skins/objects/20_lo.png'
			);
		}
	}
})();