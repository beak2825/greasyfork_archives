// ==UserScript==
// @name         Torn Poker Helper
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  Clean and simple poker helper for Torn City
// @author       JESUUS [2353554]
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538541/Torn%20Poker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/538541/Torn%20Poker%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ranks = '23456789TJQKA'.split('');
    const expertMode = false;
    const showProbabilities = true;
    const cache = new Map();
    let lastGameState = null;

    const translations = {
        en: {
            yourCards: 'Your cards',
            board: 'Board',
            combination: 'Combination',
            advice: 'Advice',
            draws: 'Draws',
            activePlayers: 'Active players',
            waiting: 'Waiting...',
            empty: 'Empty',
            analyzing: 'Analyzing...',
            outOf: 'outs •',
            chanceOf: '% chance',
            highCard: 'High Card',
            onePair: 'One Pair',
            twoPair: 'Two Pair',
            threeOfAKind: 'Three of a Kind',
            straight: 'Straight',
            flush: 'Flush',
            fullHouse: 'Full House',
            fourOfAKind: 'Four of a Kind',
            straightFlush: 'Straight Flush',
            royalFlush: 'Royal Flush',
            weakHandDrawTemplate:
                '🤔 Weak hand but possible draw ({probability}% chance). {position}',
            inPosition: 'In position, you can call or raise small',
            outOfPosition: 'Out of position, be careful',
            weakHandFollow:
                '🤔 Weak hand but possible draw. Call or check if cheap',
            allIn: '💰 You can go all-in (very strong hand)',
            raiseStrong: '🔥 You can raise big (good hand in position)',
            raiseNormal: '🔥 You can raise (good hand)',
            callOrRaise: '🙂 You can call or small raise (few opponents)',
            callOnly: '🙂 You can call',
            checkInPosition: '🤏 You can check in position',
            foldOrCheck: '🕊️ Wait and see (or fold)',
            fold: '🚫 I advise you to fold',
            winProbability: 'Win chance',
            folded: 'Folded',
            assistant: 'Poker Assistant',
            helper: 'Torn City Helper',
            language: 'Language',
            minimize: 'Minimize',
            maximize: 'Maximize',
            toggleView: 'Toggle view',
        },
        fr: {
            yourCards: 'Tes cartes',
            board: 'Plateau',
            combination: 'Combinaison',
            advice: 'Conseil',
            draws: 'Tirages',
            activePlayers: 'Joueurs actifs',
            waiting: 'En attente...',
            empty: 'Vide',
            analyzing: 'Analyse en cours...',
            outOf: 'outs •',
            chanceOf: '% de chances',
            highCard: 'Aucune combinaison',
            onePair: 'Une paire',
            twoPair: 'Deux paires',
            threeOfAKind: 'Un brelan',
            straight: 'Une suite',
            flush: 'Une couleur',
            fullHouse: 'Un full',
            fourOfAKind: 'Un carré',
            straightFlush: 'Suite couleur',
            royalFlush: 'Quinte flush royale',
            weakHandDrawTemplate:
                '🤔 Main faible mais tirage possible ({probability}% chance). {position}',
            inPosition: 'En position, tu peux suivre ou relancer petit',
            outOfPosition: 'Hors position, prudence',
            weakHandFollow:
                '🤔 Main faible mais tirage possible. Suis ou check si pas cher',
            allIn: '💰 Tu peux tout mettre (très forte main)',
            raiseStrong: '🔥 Tu peux relancer fort (bonne main en position)',
            raiseNormal: '🔥 Tu peux relancer (bonne main)',
            callOrRaise:
                "🙂 Tu peux suivre ou relancer léger (peu d'adversaires)",
            callOnly: '🙂 Tu peux suivre (call)',
            checkInPosition: '🤏 Tu peux checker en position',
            foldOrCheck: '🕊️ Attends de voir (ou couche-toi)',
            fold: '🚫 Je te conseille de te coucher',
            winProbability: 'Chance de victoire',
            folded: 'Couché',
            assistant: 'Assistant Poker',
            helper: 'Aide Torn City',
            language: 'Langue',
            minimize: 'Réduire',
            maximize: 'Agrandir',
            toggleView: 'Changer la vue',
        },
        de: {
            yourCards: 'Deine Karten',
            board: 'Board',
            combination: 'Kombination',
            advice: 'Ratschlag',
            draws: 'Draws',
            activePlayers: 'Aktive Spieler',
            waiting: 'Warten...',
            empty: 'Leer',
            analyzing: 'Analysieren...',
            outOf: 'Outs •',
            chanceOf: '% Chance',
            highCard: 'Höchste Karte',
            onePair: 'Ein Paar',
            twoPair: 'Zwei Paare',
            threeOfAKind: 'Drilling',
            straight: 'Straße',
            flush: 'Flush',
            fullHouse: 'Full House',
            fourOfAKind: 'Vierling',
            straightFlush: 'Straight Flush',
            royalFlush: 'Royal Flush',
            weakHandDrawTemplate:
                '🤔 Schwache Hand aber möglicher Draw ({probability}% Chance). {position}',
            inPosition: 'In Position, du kannst callen oder klein raisen',
            outOfPosition: 'Außerhalb der Position, sei vorsichtig',
            weakHandFollow:
                '🤔 Schwache Hand aber möglicher Draw. Calle oder checke wenn billig',
            allIn: '💰 Du kannst All-in gehen (sehr starke Hand)',
            raiseStrong: '🔥 Du kannst stark erhöhen (gute Hand in Position)',
            raiseNormal: '🔥 Du kannst erhöhen (gute Hand)',
            callOrRaise:
                '🙂 Du kannst callen oder leicht erhöhen (wenige Gegner)',
            callOnly: '🙂 Du kannst callen',
            checkInPosition: '🤏 Du kannst in Position checken',
            foldOrCheck: '🕊️ Warte ab (oder folde)',
            fold: '🚫 Ich rate dir zu folden',
            winProbability: 'Gewinnchance',
            folded: 'Gefoldet',
            assistant: 'Poker Assistent',
            helper: 'Torn City Helfer',
            language: 'Sprache',
            minimize: 'Minimieren',
            maximize: 'Maximieren',
            toggleView: 'Ansicht umschalten',
        },
        es: {
            yourCards: 'Tus cartas',
            board: 'Mesa',
            combination: 'Combinación',
            advice: 'Consejo',
            draws: 'Posibilidades',
            activePlayers: 'Jugadores activos',
            waiting: 'Esperando...',
            empty: 'Vacío',
            analyzing: 'Analizando...',
            outOf: 'outs •',
            chanceOf: '% de probabilidad',
            highCard: 'Carta alta',
            onePair: 'Una pareja',
            twoPair: 'Dos parejas',
            threeOfAKind: 'Trío',
            straight: 'Escalera',
            flush: 'Color',
            fullHouse: 'Full',
            fourOfAKind: 'Póker',
            straightFlush: 'Escalera de color',
            royalFlush: 'Escalera real',
            weakHandDrawTemplate:
                '🤔 Mano débil pero posible proyecto ({probability}% probabilidad). {position}',
            inPosition: 'En posición, puedes ver o subir poco',
            outOfPosition: 'Fuera de posición, ten cuidado',
            weakHandFollow:
                '🤔 Mano débil pero posible proyecto. Ve o pasa si es barato',
            allIn: '💰 Puedes ir all-in (mano muy fuerte)',
            raiseStrong: '🔥 Puedes subir fuerte (buena mano en posición)',
            raiseNormal: '🔥 Puedes subir (buena mano)',
            callOrRaise: '🙂 Puedes ver o subir poco (pocos oponentes)',
            callOnly: '🙂 Puedes ver',
            checkInPosition: '🤏 Puedes pasar en posición',
            foldOrCheck: '🕊️ Espera (o retírate)',
            fold: '🚫 Te aconsejo retirarte',
            winProbability: 'Probabilidad de ganar',
            folded: 'Retirado',
            assistant: 'Asistente de Póker',
            helper: 'Ayudante de Torn City',
            language: 'Idioma',
            minimize: 'Minimizar',
            maximize: 'Maximizar',
            toggleView: 'Cambiar vista',
        },
    };

    let currentLang = localStorage.getItem('tornPokerLanguage') || 'en';
    let isMinimized = localStorage.getItem('tornPokerMinimized') === 'true';
    let isMobileMode = false;
    let mobilePosition =
        localStorage.getItem('tornPokerMobilePosition') || 'bottom-right';
    function detectMobileMode() {
        isMobileMode = window.innerWidth <= 768;
        return isMobileMode;
    }

    window.addEventListener('resize', function () {
        const wasMobile = isMobileMode;
        const isMobileNow = detectMobileMode();

        if (wasMobile !== isMobileNow) {
            const main = lireCartesJoueur();
            const board = lireCartesPlateau();
            afficherInfos(main, board);
        }
    });
    function t(key, replacements = {}) {
        const text =
            translations[currentLang][key] || translations['en'][key] || key;
        return Object.entries(replacements).reduce((result, [key, value]) => {
            return result.replace(new RegExp('{' + key + '}', 'g'), value);
        }, text);
    }

    function changerLangue(lang) {
        if (translations[lang]) {
            currentLang = lang;
            localStorage.setItem('tornPokerLanguage', lang);
            const main = lireCartesJoueur();
            const board = lireCartesPlateau();
            afficherInfos(main, board);
        }
    }

    function changerPositionMobile() {
        const positions = [
            'top-left',
            'top-right',
            'bottom-right',
            'bottom-left',
        ];
        const currentIndex = positions.indexOf(mobilePosition);
        const nextIndex = (currentIndex + 1) % positions.length;
        mobilePosition = positions[nextIndex];
        localStorage.setItem('tornPokerMobilePosition', mobilePosition);

        const main = lireCartesJoueur();
        const board = lireCartesPlateau();
        afficherInfos(main, board);
    }
    function getPositionMobileStyles() {
        switch (mobilePosition) {
            case 'top-left':
                return 'top: 10px; left: 10px;';
            case 'top-right':
                return 'top: 10px; right: 10px;';
            case 'bottom-left':
                return 'bottom: 30px; left: 10px;';
            case 'bottom-right':
            default:
                return 'bottom: 30px; right: 10px;';
        }
    }

    const htmlTemplates = {
        mobileCard: (label, value, color = '#e2e8f0', dataAttr = '') => `
			<div style="
				background: rgba(255, 255, 255, 0.05);
				border-radius: 6px;
				padding: 5px 8px;
				margin-bottom: 4px;
				display: flex;
				justify-content: space-between;
				align-items: center;
			">
				<span style="font-size: 11px; color: ${color}; opacity: 0.9;">${label}</span>
				<span ${dataAttr} style="font-family: 'Courier New', monospace; font-weight: 600; color: ${color}; font-size: 12px;">
					${value}
				</span>
			</div>
		`,

        desktopCard: (
            label,
            value,
            color = '#e2e8f0',
            bgColor = 'rgba(255, 255, 255, 0.05)',
            dataAttr = ''
        ) => `
			<div style="
				background: ${bgColor};
				border-radius: 8px;
				padding: 10px 12px;
				margin-bottom: 16px;
			">
				<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
					<div style="width: 6px; height: 6px; background: ${color}; border-radius: 50%; box-shadow: 0 0 8px ${color}60;"></div>
					<span style="font-weight: 600; font-size: 13px; color: #e2e8f0;">${label}</span>
				</div>
				<div ${dataAttr} style="
					background: ${bgColor};
					border: 1px solid ${color}20;
					border-radius: 8px;
					padding: 10px 12px;
					font-family: 'Courier New', monospace;
					font-weight: 600;
					color: ${color};
					font-size: 15px;
				">${value}</div>
			</div>
		`,

        langOption: (code, flag, name, isActive) => `
			<div class="langOption" data-lang="${code}" style="
				display: flex;
				align-items: center;
				gap: 6px;
				padding: 6px 8px;
				color: ${isActive ? '#60a5fa' : '#e2e8f0'};
				font-weight: ${isActive ? '600' : '500'};
				font-size: 11px;
				cursor: pointer;
				transition: background 0.2s ease;
				${isActive ? 'background: rgba(59, 130, 246, 0.1);' : ''}
			">
				<span style="font-size: 12px;">${flag}</span>
				<span>${name}</span>
			</div>
		`,

        generateMobileInterface: (
            couleurAccent,
            main,
            board,
            nomFinal,
            conseilFinal,
            outs,
            nbJoueurs,
            isMinimized,
            winProbability
        ) => {
            if (isMinimized) {
                return `
					<div id="toggleMinimize" style="
						width: 40px;
						height: 40px;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
						background: linear-gradient(135deg, ${couleurAccent}50, ${couleurAccent}30);
						border-radius: 10px;
						position: relative;
					">
						<div style="
							width: 28px;
							height: 28px;
							background: linear-gradient(135deg, ${couleurAccent}, ${couleurAccent}80);
							border-radius: 8px;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 14px;
						">🃏</div>
						<div style="
							position: absolute;
							bottom: -1px;
							right: -1px;
							width: 10px;
							height: 10px;
							background: rgba(255, 255, 255, 0.9);
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 7px;
							color: #333;
						">📍</div>
					</div>
				`;
            }

            return `
				<div style="display: flex; flex-direction: column;">
					<div style="
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 6px 8px;
						border-bottom: 1px solid rgba(255, 255, 255, 0.1);
					">
						<div style="display: flex; align-items: center; gap: 6px;">
							<div style="
								width: 20px;
								height: 20px;
								background: linear-gradient(135deg, ${couleurAccent}, ${couleurAccent}80);
								border-radius: 5px;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 11px;
							">🃏</div>
							<div style="font-weight: 600; font-size: 11px; color: white; opacity: 0.95;">${t(
                                'assistant'
                            )}</div>
						</div>
						<div style="display: flex; gap: 4px;">
							<div id="positionButton" style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
								background: rgba(255, 255, 255, 0.1);
								border-radius: 5px;
								cursor: pointer;
								font-size: 9px;
							">📍</div>
							<div id="langSelector" style="position: relative;">
								<div id="langButton" style="
									width: 20px;
									height: 20px;
									display: flex;
									align-items: center;
									justify-content: center;
									background: rgba(255, 255, 255, 0.1);
									border-radius: 5px;
									cursor: pointer;
									font-size: 9px;
								">${langConfig[currentLang].flag}</div>
								<div id="langOptions" style="
									display: none;
									position: absolute;
									top: 100%;
									right: 0;
									margin-top: 2px;
									background: rgba(15, 23, 42, 0.98);
									border: 1px solid rgba(255, 255, 255, 0.1);
									border-radius: 5px;
									overflow: hidden;
									box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.8);
									width: 90px;
									z-index: 100000;
								">
									${Object.entries(langConfig)
                                        .map(
                                            ([code, { flag, name }]) => `
										<div class="langOption" data-lang="${code}" style="
											display: flex;
											align-items: center;
											gap: 5px;
											padding: 5px 8px;
											color: ${code === currentLang ? '#60a5fa' : '#e2e8f0'};
											font-weight: ${code === currentLang ? '600' : '500'};
											font-size: 9px;
											cursor: pointer;
											transition: background 0.2s ease;
											${code === currentLang ? 'background: rgba(59, 130, 246, 0.1);' : ''}
										">
											<span style="font-size: 9px;">${flag}</span>
											<span>${name}</span>
										</div>
									`
                                        )
                                        .join('')}
								</div>
							</div>
							<div id="toggleMinimize" style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
								background: rgba(255, 255, 255, 0.1);
								border-radius: 5px;
								cursor: pointer;
								font-size: 11px;
							">–</div>
						</div>
					</div>

					<div style="padding: 6px 8px;">
						${htmlTemplates.mobileCard(
                            t('yourCards'),
                            main.length ? main.join(' ') : t('waiting'),
                            'white',
                            'data-player-cards'
                        )}
						${htmlTemplates.mobileCard(
                            t('board'),
                            board.length ? board.join(' ') : t('empty'),
                            '#10b981',
                            'data-board-cards'
                        )}
						${htmlTemplates.mobileCard(
                            t('combination'),
                            nomFinal || t('analyzing'),
                            '#8b5cf6',
                            'data-combination'
                        )}
						${
                            winProbability > 0
                                ? htmlTemplates.mobileCard(
                                      t('winProbability'),
                                      `${Math.round(winProbability * 100)}%`,
                                      '#3b82f6',
                                      'data-win-probability'
                                  )
                                : ''
                        }
						<div data-advice style="
							background: linear-gradient(135deg, ${couleurAccent}30, ${couleurAccent}15);
							border: 1px solid ${couleurAccent}50;
							border-radius: 6px;
							padding: 5px 8px;
							color: white;
							font-weight: 600;
							font-size: 11px;
							line-height: 1.3;
							text-align: center;
							margin-bottom: 4px;
						">${conseilFinal}</div>
						${
                            outs && outs.nombre > 0
                                ? htmlTemplates.mobileCard(
                                      t('draws'),
                                      `${outs.nombre} ${t(
                                          'outOf'
                                      )} ${Math.round(
                                          outs.probability * 100
                                      )}${t('chanceOf')}`,
                                      '#f59e0b',
                                      'data-outs'
                                  )
                                : ''
                        }
					</div>
				</div>
			`;
        },

        generateLangSelector: (couleurAccent) => `
			<div id="langSelector" style="position: relative;">
				<div id="langButton" style="
					width: 24px;
					height: 24px;
					display: flex;
					align-items: center;
					justify-content: center;
					background: rgba(255, 255, 255, 0.1);
					border-radius: 6px;
					cursor: pointer;
					font-size: 12px;
				">${langConfig[currentLang].flag}</div>
				<div id="langOptions" style="
					display: none;
					position: absolute;
					top: 100%;
					right: 0;
					margin-top: 4px;
					background: rgba(15, 23, 42, 0.98);
					border: 1px solid rgba(255, 255, 255, 0.1);
					border-radius: 6px;
					overflow: hidden;
					box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7);
					width: 100px;
					z-index: 100000;
				">
					${Object.entries(langConfig)
                        .map(([code, { flag, name }]) =>
                            htmlTemplates.langOption(
                                code,
                                flag,
                                name,
                                code === currentLang
                            )
                        )
                        .join('')}
				</div>
			</div>
		`,

        generateDesktopInterface: (
            couleurAccent,
            main,
            board,
            nomFinal,
            conseilFinal,
            outs,
            nbJoueurs,
            winProbability
        ) => `
			<div data-drag-handle style="
				background: linear-gradient(135deg, ${couleurAccent}20, ${couleurAccent}10);
				padding: 16px 20px;
				border-radius: 14px 14px 0 0;
				border-bottom: 1px solid ${couleurAccent}40;
				position: relative;
			">
				<div style="
					display: flex;
					align-items: center;
					gap: 12px;
					margin-bottom: 12px;
				">
					<div style="
						width: 40px;
						height: 40px;
						background: linear-gradient(135deg, ${couleurAccent}, ${couleurAccent}80);
						border-radius: 12px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 20px;
						box-shadow: 0 4px 12px ${couleurAccent}40;
					">🃏</div>
					<div>
						<div style="font-weight: 700; font-size: 16px; color: white;">${t(
                            'assistant'
                        )}</div>
						<div style="font-size: 12px; color: ${couleurAccent}; opacity: 0.8;">${t(
            'helper'
        )}</div>
					</div>
					${htmlTemplates.generateDesktopLangSelector(couleurAccent)}
				</div>
			</div>

			<div style="padding: 20px;">
				${htmlTemplates.desktopCard(
                    t('yourCards'),
                    main.length ? main.join(' • ') : '🎴 ' + t('waiting'),
                    'white',
                    'rgba(255, 255, 255, 0.05)',
                    'data-player-cards'
                )}
				${htmlTemplates.desktopCard(
                    t('board'),
                    board.length ? board.join(' • ') : '🟢 ' + t('empty'),
                    '#10b981',
                    'rgba(16, 185, 129, 0.1)',
                    'data-board-cards'
                )}
				${htmlTemplates.desktopCard(
                    t('combination'),
                    nomFinal || '🔍 ' + t('analyzing'),
                    '#8b5cf6',
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))',
                    'data-combination'
                )}
				${
                    winProbability > 0
                        ? htmlTemplates.desktopCard(
                              t('winProbability'),
                              `🎯 ${Math.round(winProbability * 100)}%`,
                              '#3b82f6',
                              'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                              'data-win-probability'
                          )
                        : ''
                }

				<div style="margin-bottom: ${outs ? '16px' : '0'};">
					<div style="
						display: flex;
						align-items: center;
						gap: 8px;
						margin-bottom: 8px;
					">
						<div style="
							width: 6px;
							height: 6px;
							background: ${couleurAccent};
							border-radius: 50%;
							box-shadow: 0 0 8px ${couleurAccent}60;
						"></div>
						<span style="font-weight: 600; font-size: 13px; color: #e2e8f0;">${t(
                            'advice'
                        )}</span>
					</div>
					<div data-advice style="
						background: linear-gradient(135deg, ${couleurAccent}20, ${couleurAccent}10);
						border: 1px solid ${couleurAccent}40;
						border-radius: 8px;
						padding: 12px;
						color: white;
						font-weight: 600;
						font-size: 14px;
						line-height: 1.4;
					">${conseilFinal}</div>
				</div>

				${
                    outs && outs.nombre > 0
                        ? `
				<div style="margin-bottom: 16px;">
					<div style="
						display: flex;
						align-items: center;
						gap: 8px;
						margin-bottom: 8px;
					">
						<div style="
							width: 6px;
							height: 6px;
							background: #f59e0b;
							border-radius: 50%;
							box-shadow: 0 0 8px #f59e0b60;
						"></div>
						<span style="font-weight: 600; font-size: 13px; color: #e2e8f0;">${t(
                            'draws'
                        )}</span>
					</div>
					<div data-outs style="
						background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
						border: 1px solid rgba(245, 158, 11, 0.3);
						border-radius: 8px;
						padding: 12px;
						color: #fbbf24;
						font-weight: 600;
						font-size: 14px;
					">
						${outs.nombre} ${t('outOf')} ${Math.round(outs.probability * 100)}${t(
                              'chanceOf'
                          )}
						<div style="color: #94a3b8; font-size: 12px; line-height: 1.3; margin-top: 4px;">
							${outs.details.slice(0, 3).join(' • ')}${outs.details.length > 3 ? '...' : ''}
						</div>
					</div>
				</div>
				`
                        : ''
                }

				${
                    nbJoueurs > 0
                        ? `
				<div style="
					margin-top: 16px;
					padding-top: 16px;
					border-top: 1px solid rgba(255, 255, 255, 0.1);
				">
					<div style="
						display: flex;
						justify-content: space-between;
						align-items: center;
					">
						<div style="
							display: flex;
							align-items: center;
							gap: 8px;
						">
							<span style="font-size: 16px;">👥</span>
							<span style="color: #94a3b8; font-size: 13px;">${t('activePlayers')}</span>
						</div>
						<div data-active-players style="
							background: rgba(255, 255, 255, 0.1);
							border-radius: 12px;
							padding: 4px 12px;
							font-weight: 700;
							color: white;
							font-size: 13px;
						">${nbJoueurs}</div>
					</div>
				</div>
				`
                        : ''
                }
			</div>
		`,

        generateDesktopLangSelector: (couleurAccent) => `
			<div id="langSelector" style="
				position: absolute;
				top: 16px;
				right: 16px;
				z-index: 2;
			">
				<div id="langButton" style="
					display: flex;
					align-items: center;
					justify-content: center;
					width: 32px;
					height: 32px;
					background: rgba(255, 255, 255, 0.1);
					border-radius: 8px;
					cursor: pointer;
					user-select: none;
					transition: all 0.2s ease;
				">
					<span style="font-size: 16px;">${langConfig[currentLang].flag}</span>
				</div>
				<div id="langOptions" style="
					display: none;
					position: absolute;
					top: 100%;
					right: 0;
					margin-top: 8px;
					background: rgba(15, 23, 42, 0.95);
					backdrop-filter: blur(12px);
					border: 1px solid rgba(255, 255, 255, 0.1);
					border-radius: 8px;
					overflow: hidden;
					box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7);
					width: 120px;
					z-index: 3;
				">
					${Object.entries(langConfig)
                        .map(
                            ([code, { flag, name }]) => `
						<div class="langOption" data-lang="${code}" style="
							display: flex;
							align-items: center;
							gap: 8px;
							padding: 10px 12px;
							color: ${code === currentLang ? '#60a5fa' : '#e2e8f0'};
							font-weight: ${code === currentLang ? '700' : '500'};
							font-size: 13px;
							cursor: pointer;
							transition: background 0.2s ease;
							${code === currentLang ? 'background: rgba(59, 130, 246, 0.1);' : ''}
						">
							<span style="font-size: 16px;">${flag}</span>
							<span>${name}</span>
						</div>
					`
                        )
                        .join('')}
				</div>
			</div>
		`,
    };

    function updateContentOnly(main, board, box) {
        const isMobile = window.innerWidth <= 768;
        const joueurAFold = detecterSiJoueurAFold();

        const playerCardsElement = box.querySelector('[data-player-cards]');
        if (playerCardsElement) {
            if (isMobile) {
                playerCardsElement.textContent = main.length
                    ? main.join(' ')
                    : t('waiting');
            } else {
                playerCardsElement.textContent = main.length
                    ? main.join(' • ')
                    : '🎴 ' + t('waiting');
            }
        }

        const boardCardsElement = box.querySelector('[data-board-cards]');
        if (boardCardsElement) {
            if (isMobile) {
                boardCardsElement.textContent = board.length
                    ? board.join(' ')
                    : t('empty');
            } else {
                boardCardsElement.textContent = board.length
                    ? board.join(' • ')
                    : '🟢 ' + t('empty');
            }
        }

        const nbJoueurs = compterJoueursActifs();
        const activePlayersElement = box.querySelector('[data-active-players]');
        if (activePlayersElement) {
            activePlayersElement.textContent = nbJoueurs;
        }

        if (joueurAFold) {
            const winProbabilityElement = box.querySelector(
                '[data-win-probability]'
            );
            if (winProbabilityElement) {
                winProbabilityElement.textContent = t('folded');
            }

            const adviceElement = box.querySelector('[data-advice]');
            if (adviceElement) {
                adviceElement.textContent = t('folded');
            }

            const combinationElement = box.querySelector('[data-combination]');
            if (combinationElement) {
                combinationElement.textContent = '';
            }
        } else if (main.length >= 2) {
            const toutesCartes = [...main, ...board];
            const evaluation = evaluerMain(toutesCartes, true);
            const position = detecterPosition();

            let outs = null;
            if (evaluation.tirage && main.length >= 2 && board.length >= 3) {
                outs = calculerOuts(main, board);
            }

            const winProbability = calculerProbabiliteVictoire(
                main,
                board,
                nbJoueurs,
                500
            );
            const nomFinal = expertMode
                ? evaluation.nom
                : simplifierMain(evaluation.nom);
            const conseilFinal = simplifierConseil(
                evaluation.conseil,
                position,
                nbJoueurs,
                evaluation.tirage,
                outs
            );

            const combinationElement = box.querySelector('[data-combination]');
            if (combinationElement) {
                if (isMobile) {
                    combinationElement.textContent = nomFinal || t('analyzing');
                } else {
                    combinationElement.textContent =
                        nomFinal || '🔍 ' + t('analyzing');
                }
            }

            const winProbabilityElement = box.querySelector(
                '[data-win-probability]'
            );
            if (winProbabilityElement) {
                if (isMobile) {
                    winProbabilityElement.textContent = `${Math.round(
                        winProbability * 100
                    )}%`;
                } else {
                    winProbabilityElement.textContent = `🎯 ${Math.round(
                        winProbability * 100
                    )}%`;
                }
            }

            const adviceElement = box.querySelector('[data-advice]');
            if (adviceElement) {
                adviceElement.textContent = conseilFinal;
            }

            const outsElement = box.querySelector('[data-outs]');
            if (outsElement && outs && outs.nombre > 0) {
                outsElement.textContent = `${outs.nombre} ${t(
                    'outOf'
                )} ${Math.round(outs.probability * 100)}${t('chanceOf')}`;
            }
        }
    }

    function extraireValeurEtCouleur(className) {
        const regex = /(clubs|spades|hearts|diamonds)-([0-9TJQKA]+)/;
        const match = className.match(regex);
        if (!match) {
            return null;
        }
        const couleurMap = {
            clubs: '♣',
            spades: '♠',
            hearts: '♥',
            diamonds: '♦',
        };
        const couleur = couleurMap[match[1]];
        const valeur = match[2].toUpperCase();
        return `${valeur}${couleur}`;
    }

    function lireCartesJoueur() {
        const cartes = document.querySelectorAll(
            '.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ .front___osz1p > div'
        );
        return Array.from(cartes)
            .map((c) => extraireValeurEtCouleur(c.className))
            .filter(Boolean);
    }

    function lireCartesPlateau() {
        const cartes = document.querySelectorAll(
            '.communityCards___cGHD3 .front___osz1p > div'
        );
        return Array.from(cartes)
            .map((c) => extraireValeurEtCouleur(c.className))
            .filter(Boolean);
    }

    function compterJoueursActifs() {
        let joueursTable = document.querySelectorAll('[class*="opponent___"]');
        if (joueursTable.length === 0) {
            joueursTable = document.querySelectorAll('[id*="player-"]');
        }
        if (joueursTable.length === 0) {
            joueursTable = Array.from(
                document.querySelectorAll('[class*="name___"]')
            )
                .map((nom) =>
                    nom.closest(
                        'div[class*="player"], div[class*="opponent"], div'
                    )
                )
                .filter(Boolean);
        }

        let joueursActifs = 0;

        if (joueursTable.length > 0) {
            joueursTable.forEach((joueur, index) => {
                const nom = joueur.querySelector
                    ? joueur.querySelector('[class*="name___"]')
                    : null;
                const texteComplet = joueur.textContent
                    ? joueur.textContent.toLowerCase()
                    : '';

                const estInactif =
                    texteComplet.includes('sitting out') ||
                    texteComplet.includes('waiting bb') ||
                    texteComplet.includes('waiting') ||
                    texteComplet.includes('folded') ||
                    texteComplet.includes('fold');

                if (!estInactif) {
                    joueursActifs++;
                }
            });
        } else {
            const nomsJoueurs = document.querySelectorAll('[class*="name___"]');

            nomsJoueurs.forEach((nom, index) => {
                let conteneur = nom.parentElement;
                while (
                    conteneur &&
                    !conteneur.textContent.includes('Sitting out') &&
                    !conteneur.textContent.includes('Waiting') &&
                    conteneur.parentElement
                ) {
                    conteneur = conteneur.parentElement;
                }

                const texteComplet = conteneur
                    ? conteneur.textContent.toLowerCase()
                    : '';
                const estInactif =
                    texteComplet.includes('sitting out') ||
                    texteComplet.includes('waiting bb') ||
                    texteComplet.includes('waiting') ||
                    texteComplet.includes('folded') ||
                    texteComplet.includes('fold');

                if (!estInactif) {
                    joueursActifs++;
                }
            });
        }

        let votreStatut = '';

        const scriptStatus =
            document.querySelector('[data-testid="poker-assistant"]')
                ?.textContent ||
            document.querySelector('.advice')?.textContent ||
            document.querySelector('[class*="advice"]')?.textContent ||
            '';

        const votreJoueur = document.querySelector('.playerMeGateway___AEI5_');
        const playerStatus = votreJoueur
            ? votreJoueur.textContent.toLowerCase()
            : '';

        let yourSpecificStatus = '';
        if (votreJoueur) {
            const yourStatusSpan = votreJoueur.querySelector('span');
            yourSpecificStatus = yourStatusSpan
                ? yourStatusSpan.textContent.toLowerCase()
                : '';
        }

        votreStatut = (
            scriptStatus +
            ' ' +
            playerStatus +
            ' ' +
            yourSpecificStatus
        ).toLowerCase();

        const vosCartes = document.querySelectorAll(
            '.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ'
        );
        const avezDesCartes = vosCartes.length >= 2;

        const votreZone = document.querySelector('.playerMeGateway___AEI5_');
        const votreZoneText = votreZone
            ? votreZone.textContent.toLowerCase()
            : '';

        let votreZoneComplete = votreZoneText;
        if (votreZone) {
            const spans = votreZone.querySelectorAll('span, div');
            spans.forEach((span) => {
                votreZoneComplete += ' ' + span.textContent.toLowerCase();
            });
        }

        const vousAvezFolde =
            votreZoneComplete.includes('folded') ||
            votreStatut.includes('folded') ||
            votreStatut.includes('fold');

        const vousEtesActif =
            avezDesCartes &&
            !vousAvezFolde &&
            !votreStatut.includes('waiting') &&
            !votreStatut.includes('sitting out');

        if (vousEtesActif) {
            joueursActifs++;
        }

        if (joueursActifs === 0) {
            const positionsAvecCartes = document.querySelectorAll(
                '[class*="hand___"], [class*="card___"]'
            ).length;
            const positionsAvecJetons = document.querySelectorAll(
                '[class*="bet"], [class*="chip"]'
            ).length;

            joueursActifs = Math.max(
                Math.floor(positionsAvecCartes / 2),
                Math.floor(positionsAvecJetons / 2),
                3
            );
        }

        const resultat = Math.max(joueursActifs, 2);

        if (window.lastPlayerCount !== resultat) {
            window.lastPlayerCount = resultat;
        }

        return resultat;
    }

    function detecterSiJoueurAFold() {
        const vosCartes = document.querySelectorAll(
            '.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ'
        );
        const avezDesCartes = vosCartes.length >= 2;

        const votreZone = document.querySelector('.playerMeGateway___AEI5_');
        const votreZoneText = votreZone
            ? votreZone.textContent.toLowerCase()
            : '';

        let votreZoneComplete = votreZoneText;
        if (votreZone) {
            const spans = votreZone.querySelectorAll('span, div');
            spans.forEach((span) => {
                votreZoneComplete += ' ' + span.textContent.toLowerCase();
            });
        }

        const votreJoueur = document.querySelector('.playerMeGateway___AEI5_');
        const playerStatus = votreJoueur
            ? votreJoueur.textContent.toLowerCase()
            : '';

        const vousAvezFolde =
            votreZoneComplete.includes('folded') ||
            playerStatus.includes('folded') ||
            playerStatus.includes('fold');

        return vousAvezFolde;
    }

    function detecterPosition() {
        const bouton = document.querySelector('.yourTurn___b2sZp');
        return bouton && bouton.textContent.includes('Your turn');
    }

    function detecterPositionTable() {
        const tousJoueurs = document.querySelectorAll('.player___Z25g2');
        const monIndex = Array.from(tousJoueurs).findIndex((p) =>
            p.classList.contains('playerMeGateway___AEI5_')
        );

        if (monIndex === -1) {
            return 0;
        }

        const totalJoueurs = tousJoueurs.length;
        if (monIndex === totalJoueurs - 1) {
            return 2; // Button/Dealer
        }
        if (monIndex === 0 || monIndex === 1) {
            return 0; // SB/BB
        }
        return 1; // Position médiane
    }

    function simplifierMain(nom) {
        return t(nom.replace(/\s+/g, '').toLowerCase()) || nom;
    }

    function trouverMeilleureMain(toutesCartes) {
        if (toutesCartes.length < 5) {
            return toutesCartes;
        }

        const combinations = [];

        function getCombinations(arr, size) {
            if (size === 1) {
                return arr.map((el) => [el]);
            }
            const result = [];
            arr.forEach((el, i) => {
                const rest = arr.slice(i + 1);
                const combos = getCombinations(rest, size - 1);
                combos.forEach((combo) => {
                    result.push([el, ...combo]);
                });
            });
            return result;
        }

        const combos = getCombinations(toutesCartes, 5);
        let meilleureCombo = combos[0];
        let meilleureEval = evaluerMain5Cartes(combos[0]);

        combos.forEach((combo) => {
            const evaluate = evaluerMain5Cartes(combo);
            if (comparerMains(evaluate, meilleureEval) > 0) {
                meilleureCombo = combo;
                meilleureEval = evaluate;
            }
        });

        return { cartes: meilleureCombo, evaluation: meilleureEval };
    }

    function comparerMains(main1, main2) {
        if (main1.force !== main2.force) {
            return main1.force - main2.force;
        }

        if (main1.valeurPrincipale !== main2.valeurPrincipale) {
            return main1.valeurPrincipale - main2.valeurPrincipale;
        }

        for (
            let i = 0;
            i < Math.max(main1.kickers.length, main2.kickers.length);
            i++
        ) {
            const k1 = main1.kickers[i] || -1;
            const k2 = main2.kickers[i] || -1;
            if (k1 !== k2) {
                return k1 - k2;
            }
        }

        return 0;
    }

    function evaluerMain5Cartes(cartes5) {
        const suits = { '♠': [], '♥': [], '♦': [], '♣': [] };
        const values = {};
        const allVals = [];

        cartes5.forEach((card) => {
            const match = card.match(/^([0-9TJQKA]+)(.)$/);
            if (!match) {
                return;
            }

            const val = match[1];
            const suit = match[2];
            suits[suit].push(val);
            values[val] = (values[val] || 0) + 1;
            allVals.push(val);
        });

        const countList = Object.values(values).sort((a, b) => b - a);
        const allRanks = allVals
            .map((v) => ranks.indexOf(v))
            .sort((a, b) => b - a);

        const flushSuit = Object.entries(suits).find(
            ([_, list]) => list.length === 5
        );
        const isFlush = !!flushSuit;

        const uniqueRanks = [...new Set(allRanks)].sort((a, b) => a - b);
        let straightFound = false;
        let straightHighCard = 0;

        // Vérifier toutes les suites possibles de 5 cartes consécutives
        for (let i = 0; i <= uniqueRanks.length - 5; i++) {
            const seq = uniqueRanks.slice(i, i + 5);
            // Vérifier si c'est une suite (différence de 4 entre la première et dernière carte)
            if (seq[4] - seq[0] === 4) {
                straightFound = true;
                straightHighCard = seq[4];
                break;
            }
        }

        if (!straightFound) {
            // Vérifier la wheel (A-2-3-4-5)
            const wheelRanks = [
                ranks.indexOf('A'),
                ranks.indexOf('2'),
                ranks.indexOf('3'),
                ranks.indexOf('4'),
                ranks.indexOf('5'),
            ];
            const hasWheel = wheelRanks.every((rank) =>
                uniqueRanks.includes(rank)
            );
            if (hasWheel) {
                straightFound = true;
                straightHighCard = ranks.indexOf('5');
            }
        }

        const royalFlush =
            isFlush && straightFound && straightHighCard === ranks.indexOf('A');

        const valeurPair = Object.entries(values)
            .filter(([_, count]) => count === 2)
            .map(([val, _]) => ranks.indexOf(val))
            .sort((a, b) => b - a);

        const valeurBrelan = Object.entries(values)
            .filter(([_, count]) => count === 3)
            .map(([val, _]) => ranks.indexOf(val))[0];

        const valeurCarre = Object.entries(values)
            .filter(([_, count]) => count === 4)
            .map(([val, _]) => ranks.indexOf(val))[0];

        let kickers = [];
        let force = 0;
        let valeurPrincipale = 0;
        let nom = '';

        if (royalFlush) {
            force = 9;
            valeurPrincipale = ranks.indexOf('A');
            nom = 'Royal Flush';
            kickers = [];
        } else if (isFlush && straightFound) {
            force = 8;
            valeurPrincipale = straightHighCard;
            nom = 'Straight Flush';
            kickers = [];
        } else if (countList[0] === 4) {
            force = 7;
            valeurPrincipale = valeurCarre;
            nom = 'Four of a Kind';
            kickers = allRanks.filter((r) => r !== valeurCarre).slice(0, 1);
        } else if (countList[0] === 3 && countList[1] === 2) {
            force = 6;
            valeurPrincipale = valeurBrelan;
            nom = 'Full House';
            kickers = valeurPair.slice(0, 1);
        } else if (isFlush) {
            force = 5;
            nom = 'Flush';
            const flushCards = suits[flushSuit[0]]
                .map((v) => ranks.indexOf(v))
                .sort((a, b) => b - a);
            valeurPrincipale = flushCards[0];
            kickers = flushCards.slice(1, 5);
        } else if (straightFound) {
            force = 4;
            valeurPrincipale = straightHighCard;
            nom = 'Straight';
            kickers = [];
        } else if (countList[0] === 3) {
            force = 3;
            valeurPrincipale = valeurBrelan;
            nom = 'Three of a Kind';
            kickers = allRanks.filter((r) => r !== valeurBrelan).slice(0, 2);
        } else if (countList[0] === 2 && countList[1] === 2) {
            force = 2;
            valeurPrincipale = valeurPair[0];
            nom = 'Two Pair';
            kickers = [
                valeurPair[1],
                ...allRanks.filter((r) => !valeurPair.includes(r)).slice(0, 1),
            ];
        } else if (countList[0] === 2) {
            force = 1;
            valeurPrincipale = valeurPair[0];
            nom = 'One Pair';
            kickers = allRanks.filter((r) => r !== valeurPair[0]).slice(0, 3);
        } else {
            force = 0;
            valeurPrincipale = allRanks[0];
            nom = 'High Card';
            kickers = allRanks.slice(1, 5);
        }

        return {
            nom,
            force,
            valeurPrincipale,
            kickers,
            cartes: cartes5,
        };
    }

    function calculerOuts(main, board) {
        const toutesCartes = [...main, ...board];
        const cartesUtilisees = new Set(toutesCartes);
        const outs = new Set();
        const outDetails = [];

        // Analyser les tirages possibles
        const flushOuts = calculerFlushOuts(main, board, cartesUtilisees);
        const straightOuts = calculerStraightOuts(main, board, cartesUtilisees);

        // Ajouter les outs de flush
        flushOuts.forEach((carte) => {
            outs.add(carte);
            outDetails.push(`${carte} → Flush`);
        });

        // Ajouter les outs de suite
        straightOuts.forEach((carte) => {
            if (!outs.has(carte)) {
                outDetails.push(`${carte} → Straight`);
            }
            outs.add(carte);
        });

        return {
            nombre: outs.size,
            details: outDetails,
            probability: calculerProbabilite(outs.size, board.length),
        };
    }

    function calculerFlushOuts(main, board, cartesUtilisees) {
        const outs = [];
        const toutesCartes = [...main, ...board];

        // Compter les cartes par couleur
        const suits = { '♠': [], '♥': [], '♦': [], '♣': [] };
        toutesCartes.forEach((carte) => {
            const match = carte.match(/^([0-9TJQKA]+)(.)$/);
            if (match) {
                suits[match[2]].push(match[1]);
            }
        });

        // Chercher un tirage couleur (4 cartes de même couleur)
        Object.entries(suits).forEach(([suit, cartes]) => {
            if (cartes.length === 4) {
                // Ajouter toutes les cartes restantes de cette couleur
                const allRanks = '23456789TJQKA'.split('');
                allRanks.forEach((rank) => {
                    const carte = `${rank}${suit}`;
                    if (!cartesUtilisees.has(carte)) {
                        outs.push(carte);
                    }
                });
            }
        });

        return outs;
    }

    function calculerStraightOuts(main, board, cartesUtilisees) {
        const outs = [];
        const toutesCartes = [...main, ...board];

        // Obtenir les rangs uniques
        const rangs = new Set();
        toutesCartes.forEach((carte) => {
            const match = carte.match(/^([0-9TJQKA]+)(.)$/);
            if (match) {
                rangs.add(ranks.indexOf(match[1]));
            }
        });

        const rangsArray = Array.from(rangs).sort((a, b) => a - b);
        const allSuits = ['♠', '♥', '♦', '♣'];

        // Chercher tous les tirages de suite possibles
        // Pour chaque séquence possible de 5 cartes consécutives
        for (let start = 0; start <= ranks.length - 5; start++) {
            const sequence = [
                start,
                start + 1,
                start + 2,
                start + 3,
                start + 4,
            ];

            // Compter combien de cartes de cette séquence on a
            const cartesPresentes = sequence.filter((rang) =>
                rangsArray.includes(rang)
            );

            // Si on a exactement 4 cartes de la séquence
            if (cartesPresentes.length === 4) {
                // Trouver la carte manquante
                const carteManquante = sequence.find(
                    (rang) => !rangsArray.includes(rang)
                );

                // Ajouter toutes les variantes de couleur de cette carte
                allSuits.forEach((suit) => {
                    const carte = `${ranks[carteManquante]}${suit}`;
                    if (!cartesUtilisees.has(carte)) {
                        outs.push(carte);
                    }
                });
            }
        }

        // Cas spécial pour la wheel (A-2-3-4-5)
        const wheelSequence = [
            ranks.indexOf('A'),
            ranks.indexOf('2'),
            ranks.indexOf('3'),
            ranks.indexOf('4'),
            ranks.indexOf('5'),
        ];
        const wheelPresentes = wheelSequence.filter((rang) =>
            rangsArray.includes(rang)
        );

        if (wheelPresentes.length === 4) {
            const wheelManquante = wheelSequence.find(
                (rang) => !rangsArray.includes(rang)
            );
            allSuits.forEach((suit) => {
                const carte = `${ranks[wheelManquante]}${suit}`;
                if (!cartesUtilisees.has(carte)) {
                    outs.push(carte);
                }
            });
        }

        // Cas spécial pour la suite royale (T-J-Q-K-A)
        const royalSequence = [
            ranks.indexOf('T'),
            ranks.indexOf('J'),
            ranks.indexOf('Q'),
            ranks.indexOf('K'),
            ranks.indexOf('A'),
        ];
        const royalPresentes = royalSequence.filter((rang) =>
            rangsArray.includes(rang)
        );

        if (royalPresentes.length === 4) {
            const royalManquante = royalSequence.find(
                (rang) => !rangsArray.includes(rang)
            );
            allSuits.forEach((suit) => {
                const carte = `${ranks[royalManquante]}${suit}`;
                if (!cartesUtilisees.has(carte)) {
                    outs.push(carte);
                }
            });
        }

        return outs;
    }

    function calculerProbabilite(outs, boardSize) {
        // Formules corrigées pour les probabilités de tirage
        if (boardSize === 3) {
            // Flop vers turn et river (2 cartes restantes)
            // Formule: 1 - ((47-outs)/47) * ((46-outs)/46)
            const cartesRestantes = 52 - 5; // 47 cartes (52 - 2 du joueur - 3 du flop)
            return 1 - Math.pow((cartesRestantes - outs) / cartesRestantes, 2);
        } else if (boardSize === 4) {
            // Turn vers river (1 carte restante)
            const cartesRestantes = 52 - 6; // 46 cartes (52 - 2 du joueur - 4 du board)
            return outs / cartesRestantes;
        } else if (boardSize === 0) {
            // Preflop vers river (5 cartes à venir)
            // Approximation simplifiée pour preflop
            const cartesRestantes = 52 - 2; // 50 cartes
            return 1 - Math.pow((cartesRestantes - outs) / cartesRestantes, 5);
        }
        return 0;
    }

    function calculerProbabiliteVictoire(
        main,
        board,
        nbJoueurs = 2,
        simulations = 1000
    ) {
        if (main.length < 2) {
            return 0;
        }

        const cartesUtilisees = new Set([...main, ...board]);
        const cartesRestantes = [];

        // Créer le deck des cartes restantes
        const allRanks = '23456789TJQKA'.split('');
        const allSuits = ['♠', '♥', '♦', '♣'];

        allRanks.forEach((rank) => {
            allSuits.forEach((suit) => {
                const carte = `${rank}${suit}`;
                if (!cartesUtilisees.has(carte)) {
                    cartesRestantes.push(carte);
                }
            });
        });

        let victoires = 0;

        for (let sim = 0; sim < simulations; sim++) {
            // Mélanger les cartes restantes
            const deck = [...cartesRestantes];
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }

            // Calculer les cartes nécessaires pour board et adversaires
            const cartesNecessairesBoard = Math.max(0, 5 - board.length);
            const cartesNecessairesAdversaires = (nbJoueurs - 1) * 2;
            const cartesTotalesNecessaires =
                cartesNecessairesBoard + cartesNecessairesAdversaires;

            // Vérifier qu'il y a assez de cartes
            if (deck.length < cartesTotalesNecessaires) {
                continue; // Passer cette simulation
            }

            // Compléter le board si nécessaire
            const boardComplet = [...board];
            for (let i = 0; i < cartesNecessairesBoard; i++) {
                boardComplet.push(deck.pop());
            }

            // Évaluer notre main
            const notreMeilleureMain = trouverMeilleureMain([
                ...main,
                ...boardComplet,
            ]);

            // Simuler les mains des adversaires
            let gagne = true;
            let deckIndex = 0;

            for (let adversaire = 1; adversaire < nbJoueurs; adversaire++) {
                const mainAdversaire = [deck[deckIndex], deck[deckIndex + 1]];
                deckIndex += 2;

                const mainAdversaireComplete = trouverMeilleureMain([
                    ...mainAdversaire,
                    ...boardComplet,
                ]);

                if (
                    comparerMains(
                        mainAdversaireComplete.evaluation,
                        notreMeilleureMain.evaluation
                    ) > 0
                ) {
                    gagne = false;
                    break;
                }
            }

            if (gagne) {
                victoires++;
            }
        }

        return victoires / simulations;
    }

    function analyserTirages(toutesCartes) {
        const suits = { '♠': [], '♥': [], '♦': [], '♣': [] };
        const values = {};
        const allVals = [];

        toutesCartes.forEach((card) => {
            const match = card.match(/^([0-9TJQKA]+)(.)$/);
            if (!match) {
                return;
            }

            const val = match[1];
            const suit = match[2];
            suits[suit].push(val);
            values[val] = (values[val] || 0) + 1;
            allVals.push(val);
        });

        const countList = Object.values(values).sort((a, b) => b - a);
        const allRanks = allVals
            .map((v) => ranks.indexOf(v))
            .sort((a, b) => a - b);
        const uniqueRanks = [...new Set(allRanks)].sort((a, b) => a - b);

        const flushDraw = Object.values(suits).some(
            (list) => list.length === 4
        );
        const doubleTwayFlushDraw =
            Object.values(suits).filter((list) => list.length === 3).length >=
            2;

        let openEndedStraight = false;
        let gutShot = false;

        for (let i = 0; i <= uniqueRanks.length - 4; i++) {
            const seq = uniqueRanks.slice(i, i + 4);
            if (seq[3] - seq[0] === 3) {
                openEndedStraight = true;
                break;
            }
        }

        if (!openEndedStraight) {
            for (let i = 0; i <= uniqueRanks.length - 4; i++) {
                const seq = uniqueRanks.slice(i, i + 4);
                if (seq[3] - seq[0] === 4) {
                    gutShot = true;
                    break;
                }
            }
        }

        const nombrePair =
            countList[0] >= 2
                ? Object.entries(values).filter(([_, count]) => count >= 2)
                      .length
                : 0;
        const doublePair = nombrePair >= 2;

        return {
            flushDraw,
            doubleTwayFlushDraw,
            openEndedStraight,
            gutShot,
            nombrePair,
            doublePair,
            possibleStraight: openEndedStraight || gutShot,
            possibleFlush: flushDraw || doubleTwayFlushDraw,
        };
    }

    function simplifierConseil(conseil, position, joueurs, tirage, outs) {
        if (expertMode) {
            return conseil;
        }

        const positionTable = detecterPositionTable();
        const estEnPosition = positionTable === 2;
        const peuJoueurs = joueurs <= 3;
        const bonneProba = outs && outs.probability > 0.3;

        // Gestion des tirages
        if (conseil.includes('tirage')) {
            if (bonneProba) {
                return t('weakHandDrawTemplate', {
                    probability: Math.round(outs.probability * 100),
                    position: estEnPosition
                        ? t('inPosition')
                        : t('outOfPosition'),
                });
            }
            return t('weakHandFollow');
        }

        // Gestion des conseils forts
        if (conseil === 'All-in') {
            return t('allIn');
        }
        if (conseil === 'RAISE fort') {
            return estEnPosition ? t('raiseStrong') : t('raiseNormal');
        }
        if (conseil === 'RAISE') {
            return estEnPosition ? t('raiseStrong') : t('raiseNormal');
        }
        if (conseil === 'Call') {
            return peuJoueurs && estEnPosition
                ? t('callOrRaise')
                : t('callOnly');
        }
        if (conseil === 'Check / Call') {
            return position ? t('checkInPosition') : t('foldOrCheck');
        }
        if (conseil === 'Fold') {
            return t('fold');
        }

        // Si aucune condition n'est remplie, retourner le conseil traduit ou original
        return conseil;
    }

    function evaluerMainPreflop(main) {
        if (main.length !== 2) {
            return null;
        }

        // Extraire les valeurs et couleurs
        const cartes = main.map((carte) => {
            const match = carte.match(/^([0-9TJQKA]+)(.)$/);
            return {
                valeur: match[1],
                couleur: match[2],
                rang: ranks.indexOf(match[1]),
            };
        });

        const valeur1 = cartes[0].rang;
        const valeur2 = cartes[1].rang;
        const memeCouleur = cartes[0].couleur === cartes[1].couleur;

        // Paire
        if (valeur1 === valeur2) {
            const valeurPaire = Math.max(valeur1, valeur2);

            // Stratégie TAG moderne: plus agressive avec les top pairs
            if (valeurPaire >= ranks.indexOf('A')) {
                // AA
                return {
                    nom: 'One Pair',
                    conseil: 'All-in',
                    force: 8,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            } else if (valeurPaire >= ranks.indexOf('K')) {
                // KK
                return {
                    nom: 'One Pair',
                    conseil: 'RAISE fort',
                    force: 7,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            } else if (valeurPaire >= ranks.indexOf('Q')) {
                // QQ
                return {
                    nom: 'One Pair',
                    conseil: 'RAISE fort',
                    force: 6,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            } else if (valeurPaire >= ranks.indexOf('J')) {
                // JJ
                return {
                    nom: 'One Pair',
                    conseil: 'RAISE fort',
                    force: 6,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            } else if (valeurPaire >= ranks.indexOf('T')) {
                // TT
                return {
                    nom: 'One Pair',
                    conseil: 'RAISE',
                    force: 5,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            } else if (valeurPaire >= ranks.indexOf('9')) {
                // 99
                return {
                    nom: 'One Pair',
                    conseil: 'RAISE',
                    force: 4,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            } else if (valeurPaire >= ranks.indexOf('7')) {
                // 88-77
                return {
                    nom: 'One Pair',
                    conseil: 'Call', // Position dependent
                    force: 3,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            } else {
                // 66-22 - plus strict
                return {
                    nom: 'One Pair',
                    conseil: 'Call', // En position seulement
                    force: 2,
                    valeurPrincipale: valeurPaire,
                    tirage: false,
                    kickers: [],
                };
            }
        }

        // Cartes non appariées - Stratégie TAG moderne
        const hauteValeur = Math.max(valeur1, valeur2);
        const basseValeur = Math.min(valeur1, valeur2);

        // AK - Main premium absolue
        if (
            hauteValeur >= ranks.indexOf('A') &&
            basseValeur >= ranks.indexOf('K')
        ) {
            return {
                nom: 'High Card',
                conseil: 'RAISE fort',
                force: 7,
                valeurPrincipale: hauteValeur,
                tirage: false,
                kickers: [basseValeur],
            };
        }

        // AQ - Très forte mais pas premium
        if (
            hauteValeur >= ranks.indexOf('A') &&
            basseValeur >= ranks.indexOf('Q')
        ) {
            return {
                nom: 'High Card',
                conseil: 'RAISE',
                force: 5,
                valeurPrincipale: hauteValeur,
                tirage: false,
                kickers: [basseValeur],
            };
        }

        // AJ - Bonne main, position dépendante
        if (
            hauteValeur >= ranks.indexOf('A') &&
            basseValeur >= ranks.indexOf('J')
        ) {
            return {
                nom: 'High Card',
                conseil: memeCouleur ? 'RAISE' : 'Call',
                force: memeCouleur ? 4 : 3,
                valeurPrincipale: hauteValeur,
                tirage: false,
                kickers: [basseValeur],
            };
        }

        // AT - Main marginale, suited only
        if (
            hauteValeur >= ranks.indexOf('A') &&
            basseValeur >= ranks.indexOf('T')
        ) {
            return {
                nom: 'High Card',
                conseil: memeCouleur ? 'Call' : 'Fold',
                force: memeCouleur ? 2 : 0,
                valeurPrincipale: hauteValeur,
                tirage: false,
                kickers: [basseValeur],
            };
        }

        // KQ - Main solide
        if (
            hauteValeur >= ranks.indexOf('K') &&
            basseValeur >= ranks.indexOf('Q')
        ) {
            return {
                nom: 'High Card',
                conseil: memeCouleur ? 'Call' : 'Fold',
                force: memeCouleur ? 3 : 1,
                valeurPrincipale: hauteValeur,
                tirage: false,
                kickers: [basseValeur],
            };
        }

        // Connecteurs assortis 65s+ (pour le potentiel post-flop)
        if (
            memeCouleur &&
            Math.abs(hauteValeur - basseValeur) <= 4 &&
            hauteValeur >= ranks.indexOf('9') &&
            basseValeur >= ranks.indexOf('5')
        ) {
            return {
                nom: 'High Card',
                conseil: 'Call',
                force: 2,
                valeurPrincipale: hauteValeur,
                tirage: true,
                kickers: [basseValeur],
            };
        }

        // Autres mains - fold strict
        return {
            nom: 'High Card',
            conseil: 'Fold',
            force: 0,
            valeurPrincipale: hauteValeur,
            tirage: false,
            kickers: [basseValeur],
        };
    }

    function evaluerMain(toutesCartes, inclureDetails = false) {
        const cacheKey = toutesCartes.join(',');
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        let result;
        if (toutesCartes.length < 5) {
            // Si on est preflop (exactement 2 cartes), utiliser l'évaluation preflop
            if (toutesCartes.length === 2) {
                result = evaluerMainPreflop(toutesCartes);
            } else {
                // Sinon utiliser l'analyse de tirage existante
                const tirage = analyserTirages(toutesCartes);
                const isTirage =
                    tirage.possibleFlush || tirage.possibleStraight;

                if (isTirage) {
                    let detailTirage = '';
                    if (tirage.openEndedStraight) {
                        detailTirage += 'Quinte ouverte (8 outs)';
                    }
                    if (tirage.gutShot && !tirage.openEndedStraight) {
                        detailTirage += 'Gutshot (4 outs)';
                    }
                    if (tirage.flushDraw) {
                        detailTirage +=
                            (detailTirage ? ', ' : '') +
                            'Tirage couleur (9 outs)';
                    }

                    result = {
                        nom: 'High Card',
                        conseil:
                            'Main faible avec tirage' +
                            (detailTirage ? ': ' + detailTirage : ''),
                        force: 0.5,
                        valeurPrincipale: 0,
                        tirage: true,
                        detailTirage,
                        kickers: [],
                    };
                } else {
                    result = {
                        nom: 'High Card',
                        conseil: 'Fold',
                        force: 0,
                        valeurPrincipale: 0,
                        tirage: false,
                        kickers: [],
                    };
                }
            }
        } else {
            const meilleureMain = trouverMeilleureMain(toutesCartes);
            const evaluation = meilleureMain.evaluation;

            const conseilMap = {
                9: 'All-in', // Royal Flush
                8: 'All-in', // Straight Flush
                7: 'All-in', // Four of a Kind
                6: 'RAISE fort', // Full House
                5: 'RAISE fort', // Flush
                4: 'RAISE fort', // Straight
                3: 'RAISE', // Three of a Kind
                2: 'Call', // Two Pair
                1: 'Check / Call', // One Pair
                0: 'Fold', // High Card
            };

            let conseil = 'Fold';
            const forces = Object.keys(conseilMap)
                .map((k) => parseInt(k))
                .sort((a, b) => b - a);
            for (const minForce of forces) {
                if (evaluation.force >= minForce) {
                    conseil = conseilMap[minForce];
                    break;
                }
            }

            result = {
                nom: evaluation.nom,
                conseil,
                force: evaluation.force,
                valeurPrincipale: evaluation.valeurPrincipale,
                tirage: false,
                kickers: evaluation.kickers,
            };
        }

        cache.set(cacheKey, result);
        if (cache.size > 100) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        return result;
    }

    const getThemeColors = (force) => {
        const themes = {
            9: {
                accent: '#dc2626',
                fond: 'rgba(127, 29, 29, 0.95)',
                bordure: '#dc2626',
            },
            8: {
                accent: '#dc2626',
                fond: 'rgba(127, 29, 29, 0.95)',
                bordure: '#dc2626',
            },
            7: {
                accent: '#dc2626',
                fond: 'rgba(127, 29, 29, 0.95)',
                bordure: '#dc2626',
            },
            6: {
                accent: '#ea580c',
                fond: 'rgba(124, 45, 18, 0.95)',
                bordure: '#ea580c',
            },
            5: {
                accent: '#f59e0b',
                fond: 'rgba(120, 53, 15, 0.95)',
                bordure: '#f59e0b',
            },
            4: {
                accent: '#f59e0b',
                fond: 'rgba(120, 53, 15, 0.95)',
                bordure: '#f59e0b',
            },
            3: {
                accent: '#ca8a04',
                fond: 'rgba(113, 63, 18, 0.95)',
                bordure: '#ca8a04',
            },
            2: {
                accent: '#10b981',
                fond: 'rgba(6, 95, 70, 0.95)',
                bordure: '#10b981',
            },
            1: {
                accent: '#059669',
                fond: 'rgba(6, 78, 59, 0.95)',
                bordure: '#059669',
            },
            0: {
                accent: '#6b7280',
                fond: 'rgba(15, 23, 42, 0.95)',
                bordure: '#374151',
            },
        };

        for (const [minForce, theme] of Object.entries(themes)) {
            if (force >= parseInt(minForce)) {
                return theme;
            }
        }
        return themes[0];
    };

    const langConfig = {
        en: { flag: '🇬🇧', name: 'English' },
        fr: { flag: '🇫🇷', name: 'Français' },
        de: { flag: '🇩🇪', name: 'Deutsch' },
        es: { flag: '🇪🇸', name: 'Español' },
    };

    function afficherInfos(main, board) {
        const nbJoueurs = compterJoueursActifs();
        const joueurAFold = detecterSiJoueurAFold();
        const gameStateKey = `${main.join(',')}-${board.join(
            ','
        )}-${currentLang}-${isMobileMode}-${isMinimized}-${mobilePosition}-${nbJoueurs}-${joueurAFold}`;

        if (lastGameState === gameStateKey) {
            return;
        }

        let box = document.getElementById('mainPokerBox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'mainPokerBox';
            document.body.appendChild(box);
        }

        const langOptions = document.getElementById('langOptions');
        const dropdownIsOpen =
            langOptions && langOptions.style.display === 'block';

        if (dropdownIsOpen && box.innerHTML) {
            updateContentOnly(main, board, box);
            return;
        }

        lastGameState = gameStateKey;

        let evaluation, winProbability, nomFinal, conseilFinal, outs;

        if (joueurAFold) {
            evaluation = {
                nom: '',
                conseil: t('folded'),
                tirage: false,
                force: 0,
            };
            winProbability = 0;
            nomFinal = '';
            conseilFinal = t('folded');
            outs = null;
        } else {
            evaluation =
                main.length < 2
                    ? {
                          nom: '',
                          conseil: t('waiting'),
                          tirage: false,
                          force: 0,
                      }
                    : evaluerMain([...main, ...board], true);

            winProbability =
                main.length >= 2
                    ? calculerProbabiliteVictoire(main, board, nbJoueurs, 500)
                    : 0;

            nomFinal = expertMode
                ? evaluation.nom
                : simplifierMain(evaluation.nom);

            // Calculer les outs AVANT simplifierConseil pour les tirages
            const outs =
                !joueurAFold &&
                evaluation.tirage &&
                main.length >= 2 &&
                board.length >= 3
                    ? calculerOuts(main, board)
                    : null;

            conseilFinal = simplifierConseil(
                evaluation.conseil,
                detecterPosition(),
                nbJoueurs,
                evaluation.tirage,
                outs
            );
        }

        const {
            accent: couleurAccent,
            fond: couleurFond,
            bordure: couleurBordure,
        } = getThemeColors(evaluation.force);

        detectMobileMode();
        box.style.cssText = `
			position: fixed;
			${
                isMobileMode
                    ? getPositionMobileStyles()
                    : `top: ${currentPosition.y}px; left: ${currentPosition.x}px;`
            }
			width: ${isMobileMode ? (isMinimized ? '40px' : '220px') : '350px'};
			background: ${couleurFond};
			backdrop-filter: blur(12px);
			border: ${isMobileMode ? '1px' : '2px'} solid ${couleurBordure};
			border-radius: ${isMobileMode ? '8px' : '16px'};
			padding: 0;
			font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
			font-size: ${isMobileMode ? '12px' : '14px'};
			color: white;
			z-index: 99999;
			box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.6);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		`;

        if (isMobileMode) {
            box.innerHTML = htmlTemplates.generateMobileInterface(
                couleurAccent,
                main,
                board,
                nomFinal,
                conseilFinal,
                outs,
                nbJoueurs,
                isMinimized,
                winProbability
            );
        } else {
            box.innerHTML = htmlTemplates.generateDesktopInterface(
                couleurAccent,
                main,
                board,
                nomFinal,
                conseilFinal,
                outs,
                nbJoueurs,
                winProbability
            );
        }

        if (!box.dataset.animated) {
            box.style.transform = 'translateX(100%) scale(0.8)';
            box.style.opacity = '0';

            setTimeout(() => {
                box.style.transform = 'translateX(0) scale(1)';
                box.style.opacity = '1';
            }, 100);

            box.dataset.animated = 'true';
        }

        const activePlayersElement = box.querySelector('[data-active-players]');
        if (activePlayersElement) {
            activePlayersElement.textContent = nbJoueurs;
        }

        rendreModaleDraggable(box);
        eventHandlers.setupUIEvents(box);
    }

    let isDragging = false;
    const dragOffset = { x: 0, y: 0 };
    const currentPosition = { x: 20, y: 20 };

    let tapCount = 0;
    let tapTimer = null;

    const eventHandlers = {
        setupUIEvents: (box) => {
            setTimeout(() => {
                const elements = {
                    langButton: document.getElementById('langButton'),
                    langOptions: document.getElementById('langOptions'),
                    toggleMinimize: document.getElementById('toggleMinimize'),
                    positionButton: document.getElementById('positionButton'),
                };

                if (elements.toggleMinimize) {
                    elements.toggleMinimize.addEventListener('click', (e) => {
                        e.stopPropagation();
                        eventHandlers.handleToggleMinimize();
                    });
                }

                if (elements.positionButton && isMobileMode) {
                    elements.positionButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        changerPositionMobile();
                    });
                }

                if (elements.langButton && elements.langOptions) {
                    eventHandlers.setupLanguageSelector(
                        elements.langButton,
                        elements.langOptions
                    );
                }
            }, 100);
        },

        handleToggleMinimize: () => {
            if (isMobileMode && isMinimized) {
                tapCount++;
                if (tapCount === 1) {
                    tapTimer = setTimeout(() => {
                        isMinimized = false;
                        localStorage.setItem('tornPokerMinimized', isMinimized);
                        eventHandlers.refreshInterface();
                        tapCount = 0;
                    }, 300);
                } else if (tapCount === 2) {
                    clearTimeout(tapTimer);
                    changerPositionMobile();
                    tapCount = 0;
                }
            } else {
                isMinimized = !isMinimized;
                localStorage.setItem('tornPokerMinimized', isMinimized);
                eventHandlers.refreshInterface();
            }
        },

        setupLanguageSelector: (langButton, langOptions) => {
            const newLangButton = langButton.cloneNode(true);
            langButton.parentNode.replaceChild(newLangButton, langButton);

            newLangButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isDisplayed = langOptions.style.display === 'block';
                langOptions.style.display = isDisplayed ? 'none' : 'block';
            });

            const closeDropdown = (e) => {
                if (!e.target.closest('#langSelector')) {
                    langOptions.style.display = 'none';
                }
            };

            document.removeEventListener('click', closeDropdown);
            document.addEventListener('click', closeDropdown);

            langOptions.addEventListener('click', (e) => e.stopPropagation());

            setTimeout(() => {
                document.querySelectorAll('.langOption').forEach((option) => {
                    const newOption = option.cloneNode(true);
                    option.parentNode.replaceChild(newOption, option);

                    newOption.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const lang = newOption.getAttribute('data-lang');
                        changerLangue(lang);
                        langOptions.style.display = 'none';
                    });

                    newOption.addEventListener('mouseover', () => {
                        if (
                            newOption.getAttribute('data-lang') !== currentLang
                        ) {
                            newOption.style.background =
                                'rgba(255, 255, 255, 0.05)';
                        }
                    });

                    newOption.addEventListener('mouseout', () => {
                        if (
                            newOption.getAttribute('data-lang') !== currentLang
                        ) {
                            newOption.style.background = 'transparent';
                        }
                    });
                });
            }, 50);
        },

        refreshInterface: () => {
            const main = lireCartesJoueur();
            const board = lireCartesPlateau();
            afficherInfos(main, board);
        },
    };

    function rendreModaleDraggable(box) {
        if (isMobileMode) {
            return;
        }

        const header = box.querySelector('[data-drag-handle]');
        if (!header) {
            return;
        }

        header.style.cursor = 'move';
        header.style.userSelect = 'none';

        header.addEventListener('mousedown', function (e) {
            if (
                e.target.closest('#langButton') ||
                e.target.closest('#langOptions')
            ) {
                return;
            }

            isDragging = true;
            const rect = box.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            box.style.transition = 'none';

            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging || isMobileMode) {
                return;
            }

            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            const maxX = window.innerWidth - box.offsetWidth;
            const maxY = window.innerHeight - box.offsetHeight;

            currentPosition.x = Math.max(0, Math.min(newX, maxX));
            currentPosition.y = Math.max(0, Math.min(newY, maxY));

            box.style.left = currentPosition.x + 'px';
            box.style.top = currentPosition.y + 'px';
            box.style.right = 'auto';
            box.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                box.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    }

    function ajouterStylesGlobaux() {
        if (document.getElementById('pokerHelperStyles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'pokerHelperStyles';
        styles.textContent = `
			#mainPokerBox {
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
			}

			#mainPokerBox:hover {
				transform: translateY(-2px) !important;
			}

			#langButton:hover {
				background: rgba(255, 255, 255, 0.2) !important;
				transform: scale(1.05) !important;
			}

			.langOption:hover {
				background: rgba(255, 255, 255, 0.05) !important;
			}

			[data-drag-handle] {
				cursor: move !important;
			}

			[data-drag-handle]:active {
				cursor: grabbing !important;
			}

			@keyframes pulse {
				0%, 100% { opacity: 1; }
				50% { opacity: 0.7; }
			}

			@keyframes slideIn {
				from {
					transform: translateX(100%) scale(0.8);
					opacity: 0;
				}
				to {
					transform: translateX(0) scale(1);
					opacity: 1;
				}
			}

			@media (max-width: 768px) {
				#mainPokerBox {
                    font-size: 11px !important;
				}

				[data-drag-handle] {
					cursor: default !important;
				}
			}
		`;
        document.head.appendChild(styles);
    }

    const gameLoop = {
        isRunning: false,
        intervalId: null,
        lastPlayerCount: null,

        start: () => {
            if (gameLoop.isRunning) {
                return;
            }

            ajouterStylesGlobaux();
            detectMobileMode();
            gameLoop.isRunning = true;

            gameLoop.intervalId = setInterval(() => {
                const currentPlayerCount = compterJoueursActifs();
                if (gameLoop.lastPlayerCount !== currentPlayerCount) {
                    gameLoop.lastPlayerCount = currentPlayerCount;
                    cache.clear();
                    eventHandlers.refreshInterface();
                }

                const mainCards = document.querySelectorAll(
                    '.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ .front___osz1p > div'
                );
                if (mainCards.length >= 2) {
                    eventHandlers.refreshInterface();
                }
            }, 1000);
        },

        stop: () => {
            if (gameLoop.intervalId) {
                clearInterval(gameLoop.intervalId);
                gameLoop.intervalId = null;
                gameLoop.isRunning = false;
            }
        },
    };

    function attendreEtExecuter() {
        gameLoop.start();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attendreEtExecuter);
    } else {
        attendreEtExecuter();
    }

    window.addEventListener('load', attendreEtExecuter);
})();
