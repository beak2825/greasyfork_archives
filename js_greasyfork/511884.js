// ==UserScript==
// @name         Gerador de Prompt de Resumo do YouTube
// @namespace    http://tampermonkey.net/
// @version      2025-01-08
// @description  Gera um prompt resumido com base nas legendas do vídeo no YouTube e copia para a área de transferência!
// @author       Frederico Guilherme Klüser de Oliveira
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/511884/Gerador%20de%20Prompt%20de%20Resumo%20do%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/511884/Gerador%20de%20Prompt%20de%20Resumo%20do%20YouTube.meta.js
// ==/UserScript==

(function () {
	'use strict';

	(() => {
		const copyToClipboard = (text) => {
			const inputTemp = document.createElement('input');
			document.body.appendChild(inputTemp);
			inputTemp.value = text;

			inputTemp.select();
			document.execCommand('copy');

			document.body.removeChild(inputTemp);
		};

		const waitElementByHierarchy = (
			hierarchy,
			config = {
				limitTime: 10000,
				from: document.body,
			},
		) =>
			new Promise((resolve, reject) => {
				const timeout = setTimeout(() => {
					clearInterval(interval);
					console.log(`timeout to find element by hierarchy: ${JSON.stringify(hierarchy)}`);
					reject(null);
				}, config.limitTime);

				const interval = setInterval(() => {
					console.log(`retry waitElementByHierarchy: ${JSON.stringify(hierarchy)}`);
					const element = findElementByHierarchy(hierarchy, config.from);

					if (element) {
						clearTimeout(timeout);
						clearInterval(interval);
						resolve(element);
					}
				}, 10);
			});

		const findElementByHierarchy = (hierarchy, from = document.body) => {
			let currentElements = [from];

			for (let i = 0; i < hierarchy.length; i += 1) {
				const { tag, attributes } = hierarchy[i];
				const matchingElements = [];

				currentElements.forEach((parentElement) => {
					const allElements = parentElement.getElementsByTagName(tag);

					for (let j = 0; j < allElements.length; j += 1) {
						const element = allElements[j];
						let match = true;

						for (let k = 0; k < attributes.length; k += 1) {
							const { attribute, value } = attributes[k];

							if (attribute === 'innerHTML') {
								if (element.innerHTML !== value) {
									match = false;
									break;
								}
							} else if (attribute === 'innerText') {
								if (element.innerText !== value) {
									match = false;
									break;
								}
							} else {
								if (element.getAttribute(attribute) !== value) {
									match = false;
									break;
								}
							}
						}

						if (match) {
							matchingElements.push(element);
						}
					}
				});

				if (matchingElements.length === 0) {
					return null; // Não encontrou nenhum elemento correspondente neste nível
				}

				currentElements = matchingElements; // Avança para o próximo nível com os elementos filtrados
			}

			// Retorna o primeiro elemento encontrado no último nível
			return currentElements.length > 0 ? currentElements[0] : null;
		};

		const findElementsByHierarchy = (hierarchy, from = document.body) => {
			let currentElements = [from];

			for (let i = 0; i < hierarchy.length; i += 1) {
				const { tag, attributes } = hierarchy[i];
				const matchingElements = [];

				currentElements.forEach((parentElement) => {
					const allElements = parentElement.getElementsByTagName(tag);

					for (let j = 0; j < allElements.length; j += 1) {
						const element = allElements[j];
						let match = true;

						for (let k = 0; k < attributes.length; k += 1) {
							const { attribute, value } = attributes[k];

							if (attribute === 'innerHTML') {
								if (element.innerHTML !== value) {
									match = false;
									break;
								}
							} else if (attribute === 'innerText') {
								if (element.innerText !== value) {
									match = false;
									break;
								}
							} else {
								if (element.getAttribute(attribute) !== value) {
									match = false;
									break;
								}
							}
						}

						if (match) {
							matchingElements.push(element);
						}
					}
				});

				if (matchingElements.length === 0) {
					return []; // Não encontrou nenhum elemento correspondente neste nível
				}

				currentElements = matchingElements; // Avança para o próximo nível com os elementos filtrados
			}

			// Retorna todos os elementos encontrados no último nível
			return currentElements;
		};

		const keyMap = {
			0: 'Digit0',
			1: 'Digit1',
			2: 'Digit2',
			3: 'Digit3',
			4: 'Digit4',
			5: 'Digit5',
			6: 'Digit6',
			7: 'Digit7',
			8: 'Digit8',
			9: 'Digit9',
			a: 'KeyA',
			b: 'KeyB',
			c: 'KeyC',
			d: 'KeyD',
			e: 'KeyE',
			f: 'KeyF',
			g: 'KeyG',
			h: 'KeyH',
			i: 'KeyI',
			j: 'KeyJ',
			k: 'KeyK',
			l: 'KeyL',
			m: 'KeyM',
			n: 'KeyN',
			o: 'KeyO',
			p: 'KeyP',
			q: 'KeyQ',
			r: 'KeyR',
			s: 'KeyS',
			t: 'KeyT',
			u: 'KeyU',
			v: 'KeyV',
			w: 'KeyW',
			x: 'KeyX',
			y: 'KeyY',
			z: 'KeyZ',
		};

		const addShortcut = (key, callback, preventDefault = true) => {
			const keyCode = keyMap[key.toLowerCase()] || key; // Converte para o código adequado

			document.addEventListener('keydown', (e) => {
				if (e.ctrlKey && e.code === keyCode) {
					if (preventDefault) {
						e.preventDefault();
					}
					callback(e);
				}
			});
		};

		addShortcut(
			'2',
			() => {
				document.getElementById('expand')?.click();

				waitElementByHierarchy([
					{
						tag: 'ytd-video-description-transcript-section-renderer',
						attributes: [],
					},
					{
						tag: 'div',
						attributes: [
							{
								attribute: 'id',
								value: 'primary-button',
							},
						],
					},
					{
						tag: 'button',
						attributes: [],
					},
				]).then((showMoreButton) => {
					showMoreButton.click();

					waitElementByHierarchy(
						[
							{
								tag: 'ytd-transcript-segment-list-renderer',
								attributes: [],
							},
						],
						{
							from: document.body,
							limitTime: 10000,
						},
					).then(() => {
						const subtitles = findElementsByHierarchy([
							{
								tag: 'ytd-transcript-segment-list-renderer',
								attributes: [],
							},
						]);

						const videoContent = subtitles.map((subtitle) => subtitle.innerText.replace('\n', ': ')).join('\n');

						const prompt = `Resuma o conteúdo do vídeo "${document.title}" em português, resuma de forma objetiva e clara. Aos final aponte os tempos do vídeo que começa a falar as partes importante (tempo que começa e tempo que termina), a seguir o conteúdo do vídeo: \n\n${videoContent}`;
						console.log(prompt);

						copyToClipboard(prompt);

						alert('Prompt copiado para a área de transferência');
					});
				});
			},
			true,
		);
	})();
})();
