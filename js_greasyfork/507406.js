// ==UserScript==
// @name         Pokédex Edge for SangTacViet
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Pokedex for SangTacViet pokemon novels.
// @author       @playrough
// @license      MIT
// @match        *://sangtacviet.vip/truyen/*
// @match        *://sangtacviet.pro/truyen/*
// @match        *://sangtacviet.com/truyen/*
// @match        *://sangtacviet.app/truyen/*
// @match        *://sangtacviet.xyz/truyen/*
// @match        *://14.225.254.182/truyen/*
// @icon         https://i.postimg.cc/8kqyjRg7/pokeball.png
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507406/Pok%C3%A9dex%20Edge%20for%20SangTacViet.user.js
// @updateURL https://update.greasyfork.org/scripts/507406/Pok%C3%A9dex%20Edge%20for%20SangTacViet.meta.js
// ==/UserScript==

(function () {
	const PokemonApp = {
		DATA_URLS: {
			stats: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-stats.json',
			images: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-name-image.json',
			forms: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-form.json',
			abilities: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-abilities.json',
			moves: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-moves.json',
			types: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-type.json',
			typeChart: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-type-chart.json',
			characters: 'https://cdn.jsdelivr.net/gh/playrough/stv-pokemon/pokemon-characters.json',
		},

		EFFECTIVENESS: {
			NO_EFFECT: 0,
			NOT_VERY_EFFECTIVE: 0.5,
			NEUTRAL: 1,
			SUPER_EFFECTIVE: 2,
		},

		TYPE_COLORS: {
			normal: '#8c8c8c',
			fire: '#ff972f',
			water: '#5aafdb',
			electric: '#f1b700',
			grass: '#2b9734',
			ice: '#59c0c1',
			fighting: '#c44353',
			poison: '#c11bde',
			ground: '#cd7b40',
			flying: '#8f94f3',
			psychic: '#ff5c56',
			bug: '#76bc00',
			rock: '#b59f5a',
			ghost: '#7048b6',
			dragon: '#1876c5',
			dark: '#a575d1',
			steel: '#2b7a8e',
			fairy: '#eb5bbf',
		},

		data: {
			stats: null,
			images: null,
			forms: null,
			abilities: null,
			moves: null,
			types: null,
			typeChart: null,
			characters: null,
		},

		init() {
			window.addEventListener('DOMContentLoaded', () => {
				const targetNode = document.querySelector('#content-container .contentbox');

				if (!targetNode) return;

				const observer = new MutationObserver((mutationsList, observer) => {
					if (document.querySelector('#content-container .contentbox i')) {
						observer.disconnect();
						this.run();
					}
				});

				observer.observe(targetNode, {
					childList: true,
					subtree: true,
				});

				if (document.querySelector('#content-container .contentbox i')) {
					observer.disconnect();
					this.run();
				}
			});
		},

		run() {
			setTimeout(async () => {
				try {
					await this.loadAllData();
					this.injectStyles();
					this.renderPokemonElements();
					this.setupAutoReload();
				} catch (e) {
					console.error('Initialization error:', e);
				}
			}, 2500);
		},

		async loadAllData() {
			const requests = Object.entries(this.DATA_URLS).map(async ([key, url]) => {
				const response = await fetch(url);
				this.data[key] = await response.json();
			});
			await Promise.all(requests);
		},

		setupAutoReload() {
			const actions = ["addSuperName('hv','z')", "addSuperName('hv','f')", "addSuperName('hv','s')", "addSuperName('hv','l')", "addSuperName('hv','a')", "addSuperName('el')", "addSuperName('vp')", "addSuperName('kn')", 'saveNS();excute();', 'excute()'];

			actions.forEach((action) => {
				const button = document.querySelector(`[onclick="${action}"]`);
				if (button) {
					button.addEventListener('click', () => this.renderPokemonElements());
				}
			});
		},

		renderPokemonElements() {
			const contentBoxes = document.querySelectorAll('#content-container .contentbox i');

			contentBoxes.forEach((box) => {
				const text = box.textContent.trim();
				const html = this.getElementHTML(text);

				if (html && html !== text) {
					box.innerHTML = html;
				}
			});

			this.setupEventListeners();
		},

		getElementHTML(name) {
			const { images, forms, abilities, moves, types, characters } = this.data;

			if (images[name]) {
				return forms[name] ? this.generateFormImagesHTML(name) : this.generatePokemonImageHTML(name);
			}

			if (abilities[name]) return this.generateAbilityHTML(name);
			if (moves[name]) return this.generateMoveHTML(name);
			if (types[name]) return this.generateTypeHTML(name);
			if (characters[name]) return this.generateCharacterHTML(name);

			return name;
		},

		generateCharacterHTML(name) {
			return `${name}<img class="pokemon-character" src="${this.data.characters[name]}" loading="lazy" data-character="${name}">`;
		},

		generatePokemonImageHTML(name) {
			return `${name}<img class="pokemon-image" src="${this.data.images[name]}" loading="lazy" data-pokemon="${name}">`;
		},

		generateFormImagesHTML(name) {
			const images = this.data.forms[name].map((form) => `<img class="pokemon-image" src="${this.data.images[form]}" loading="lazy" data-pokemon="${form}">`).join('');

			return `${name}${images}`;
		},

		generateAbilityHTML(name) {
			const icon = 'Ability';
			return `<span>${name}</span><img class="pokemon-ability" src="${this.data.images[icon]}" loading="lazy" data-ability="${name}">`;
		},

		generateMoveHTML(name) {
			const type = this.data.moves[name].type || '';
			return `<span class="${type}">${name}</span><img class="pokemon-move" src="${this.data.types[type]}" loading="lazy" data-move="${name}">`;
		},

		generateTypeHTML(name) {
			return `<span class="${name}">${name}</span><img class="pokemon-type" src="${this.data.types[name]}" loading="lazy" data-type="${name}">`;
		},

		setupEventListeners() {
			this.addClickListener('img.pokemon-image', (element) => {
				const name = element.dataset.pokemon;
				if (this.data.stats[name]) this.showPokemonInfoPopup(this.data.stats[name]);
			});

			this.addClickListener('img.pokemon-ability', (element) => {
				const name = element.dataset.ability;
				if (this.data.abilities[name]) this.showAbilityInfoPopup(this.data.abilities[name]);
			});

			this.addClickListener('img.pokemon-move', (element) => {
				const name = element.dataset.move;
				if (this.data.moves[name]) this.showMoveInfoPopup(this.data.moves[name]);
			});

			this.addClickListener('img.pokemon-type', (element) => {
				const name = element.dataset.type;
				if (this.data.types[name] && this.data.typeChart) {
					const typeData = this.setupTypeData(name, this.data.typeChart);
					this.showTypeInfoPopup(name, typeData);
				}
			});
		},

		addClickListener(selector, callback) {
			document.querySelectorAll(selector).forEach((element) => {
				element.addEventListener('click', (e) => {
					e.stopPropagation();
					callback(element);
				});
			});
		},

		showPokemonInfoPopup(pokemon) {
			this.removeExistingPopup();

			const popup = this.createPopup(`
                <div class="popup-header">
                    <h2>
                        <span class="pokemon-name">${pokemon.name} </span>
                        <span class="pokemon-number">${pokemon.number}</span>
                    </h2>
                    <button id="close-pokemon-info" title="Đóng">×</button>
                </div>
                <p><b>Type:</b> ${this.formatTypes(pokemon.type)}</p>
                <p><b>Abilities:</b> ${this.formatAbilities(pokemon.abilities)}</p>
                <div class="stat-grid">
                    ${this.generateStatHTML('HP', pokemon.hp)}
                    ${this.generateStatHTML('Attack', pokemon.attack)}
                    ${this.generateStatHTML('Defense', pokemon.defense)}
                    ${this.generateStatHTML('Sp. Atk', pokemon.spAttack)}
                    ${this.generateStatHTML('Sp. Def', pokemon.spDefense)}
                    ${this.generateStatHTML('Speed', pokemon.speed)}
                    <div class="total-stat"><span>Total</span><strong>${pokemon.total}</strong></div>
                </div>
            `);

			document.body.appendChild(popup);
			this.setupPopupCloseButton(popup);
		},

		showAbilityInfoPopup(ability) {
			this.removeExistingPopup();

			const popup = this.createPopup(`
                <div class="popup-header">
                    <h2>${ability.name}</h2>
                    <button id="close-pokemon-info" title="Đóng">×</button>
                </div>
                <p>${ability.description}</p>
            `);

			document.body.appendChild(popup);
			this.setupPopupCloseButton(popup);
		},

		showMoveInfoPopup(move) {
			this.removeExistingPopup();

			const popup = this.createPopup(`
                <div class="popup-header">
                    <h2>${move.name}</h2>
                    <button id="close-pokemon-info" title="Đóng">×</button>
                </div>
                <p><b>Type:</b> <span class="${move.type}">${move.type}</span></p>
                <p><b>Category:</b> ${move.category}</p>
                <p><b>Power:</b> ${move.power || '—'}</p>
                <p><b>Accuracy:</b> ${move.accuracy || '—'}</p>
                <p><b>PP:</b> ${move.pp}</p>
                <p><b>Effect:</b> ${move.effect}</p>
            `);

			document.body.appendChild(popup);
			this.setupPopupCloseButton(popup);
		},

		showTypeInfoPopup(typeName, typeData) {
			this.removeExistingPopup();

			const popup = this.createPopup(`
                <div class="popup-header">
                    <h2>${typeName} Type</h2>
                    <button id="close-pokemon-info" title="Đóng">×</button>
                </div>
                <h4>Attack Effectiveness</h4>
                ${this.renderEffectivenessLine('Super effective against', typeData.attackEffectiveness.superEffective)}
                ${this.renderEffectivenessLine('Not very effective against', typeData.attackEffectiveness.notVeryEffective)}
                ${this.renderEffectivenessLine('No effect against', typeData.attackEffectiveness.noEffect)}
 
                <h4>Defense Effectiveness</h4>
                ${this.renderEffectivenessLine('Weak to', typeData.defenseEffectiveness.superEffective)}
                ${this.renderEffectivenessLine('Resists', typeData.defenseEffectiveness.notVeryEffective)}
                ${this.renderEffectivenessLine('Immune to', typeData.defenseEffectiveness.noEffect)}
            `);

			document.body.appendChild(popup);
			this.setupPopupCloseButton(popup);
		},

		createPopup(content) {
			const popup = document.createElement('div');
			popup.id = 'pokemon-info-popup';
			popup.innerHTML = content;
			return popup;
		},

		setupPopupCloseButton(popup) {
			popup.querySelector('#close-pokemon-info').addEventListener('click', (e) => {
				e.stopPropagation();
				popup.remove();
			});
		},

		removeExistingPopup() {
			const existingPopup = document.getElementById('pokemon-info-popup');
			if (existingPopup) existingPopup.remove();
		},

		formatTypes(types) {
			return types.map((type) => `<span class="${type}">${type}</span>`).join(', ');
		},

		formatAbilities(abilities) {
			let arr = [];
			if (abilities.ability1) arr.push(abilities.ability1);
			if (abilities.ability2) arr.push(abilities.ability2);
			if (abilities.hidden) arr.push(`<i>(Hidden)</i> ${abilities.hidden}`);
			return arr.join(', ');
		},

		generateStatHTML(label, value) {
			return `<div><span>${label}</span><strong>${value}</strong></div>`;
		},

		renderEffectivenessLine(label, types) {
			if (!types || types.length === 0) return '';
			return `<p><b>${label}:</b> ${types.map((t) => `<span class="${t}" data-type="${t}">${t}</span>`).join(', ')}</p>`;
		},

		setupTypeData(type, typeChart) {
			return {
				type,
				attackEffectiveness: this.getTypeEffectiveness(type, typeChart),
				defenseEffectiveness: this.getDefenseEffectiveness(type, typeChart),
			};
		},

		getTypeEffectiveness(attackType, typeChart) {
			const effectiveness = {
				noEffect: [],
				notVeryEffective: [],
				superEffective: [],
			};

			Object.entries(typeChart[attackType]).forEach(([defenseType, value]) => {
				if (value === this.EFFECTIVENESS.NO_EFFECT) effectiveness.noEffect.push(defenseType);
				else if (value === this.EFFECTIVENESS.NOT_VERY_EFFECTIVE) effectiveness.notVeryEffective.push(defenseType);
				else if (value === this.EFFECTIVENESS.SUPER_EFFECTIVE) effectiveness.superEffective.push(defenseType);
			});

			return effectiveness;
		},

		getDefenseEffectiveness(defenseType, typeChart) {
			const effectiveness = {
				noEffect: [],
				notVeryEffective: [],
				superEffective: [],
			};

			Object.entries(typeChart).forEach(([attackType, values]) => {
				const defenseEffectiveness = values[defenseType];
				if (defenseEffectiveness === this.EFFECTIVENESS.NO_EFFECT) effectiveness.noEffect.push(attackType);
				else if (defenseEffectiveness === this.EFFECTIVENESS.NOT_VERY_EFFECTIVE) effectiveness.notVeryEffective.push(attackType);
				else if (defenseEffectiveness === this.EFFECTIVENESS.SUPER_EFFECTIVE) effectiveness.superEffective.push(attackType);
			});

			return effectiveness;
		},

		injectStyles() {
			let typeCss = Object.entries(this.TYPE_COLORS)
				.map(
					([type, color]) => `
                .${type} {
                    color: ${color};
                }
            `
				)
				.join('');

			GM_addStyle(`
                ${typeCss}
 
                .pokemon-image,
				.pokemon-move,
				.pokemon-ability,
                .pokemon-type {
                    display: inline-block !important;
					margin: 0 !important;
                    margin-left: 2px !important;
					margin-bottom: 2px !important;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

				.pokemon-character {
					width: 40px;
					display: inline-block !important;
					margin: 0 !important;
					margin-left: 2px !important;
					margin-bottom: 2px !important;
				}
 
                .pokemon-image {
                    width: 45px;
                    height: 45px;
                    vertical-align: text-bottom;
                }
 
				.pokemon-ability {
				    width: 25px;
					height: 25px;
					vertical-align: middle;
				}
 
                .pokemon-move,
                .pokemon-type {
                    width: 20px;
                    height: 20px;
                    vertical-align: middle;
                }
 
                .pokemon-image:hover,
				.pokemon-move:hover,
				.pokemon-ability:hover,
                .pokemon-type:hover {
                    transform: scale(1.3);
                }
 
                #pokemon-info-popup {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    color: rgb(75, 75, 75);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    padding: 20px;
                    width: 300px;
                    max-height: 80vh;
                    overflow-y: auto;
                    font: inherit;
                    font-weight: 300;
                    z-index: 10001;
                    animation: fadeIn 0.3s ease;
                }
 
                #pokemon-info-popup .popup-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
 
                #pokemon-info-popup h2 {
                    margin: 0;
                    font-size: 20px;
                    text-align: left;
                }
 
                #pokemon-info-popup h4 {
                    margin: 15px 0 5px 0;
                    font-size: 16px;
                    color: #555;
                }
 
                #pokemon-info-popup p {
                    margin: 5px 0;
                    font-size: 14px;
                    line-height: 1.4;
                }
 
                .pokemon-name {
                    margin-right: 5px;
                }
 
                .pokemon-number {
                    display: inline-block;
                    margin-top: 2px;
                    color: #999;
                    font-size: 14px;
                }
 
                #close-pokemon-info {
                    background: #eee;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    font-size: 24px;
                    line-height: 36px;
                    text-align: center;
                    cursor: pointer;
                    color: #444;
                    transition: background 0.2s, transform 0.2s;
                    outline: none;
                }
 
                #close-pokemon-info:hover {
                    background: #ccc;
                    transform: scale(1.1);
                }
 
                .stat-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: 15px;
                }
 
                .stat-grid div {
                    background: #f5f5f5;
                    padding: 8px 12px;
                    border-radius: 6px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
 
                .stat-grid span {
                    font-size: 12px;
                    color: #555;
                }
 
                .stat-grid strong {
                    font-size: 16px;
                    font-weight: bold;
                }
 
                .total-stat {
                    grid-column: span 2;
                    background: #dff0d8;
                }
 
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
 
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `);
		},
	};

	PokemonApp.init();
})();
