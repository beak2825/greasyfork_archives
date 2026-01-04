// ==UserScript==
// @name         Boosty socionics style TEST
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  Добавление тима рядом с именем, небольшие визуальные корректировки. Замена названия аспекта из двух букв- картинкой. Цветные тимы в тексте. Кнопки навигации по комментам
// @author       IDtwelve
// @match        https://boosty.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boosty.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518471/Boosty%20socionics%20style%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/518471/Boosty%20socionics%20style%20TEST.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
	'use strict';

	const CONFIG = {
		isMobile: () => {
			return window.innerWidth <= 480 ||
				/iPhone|Android.*Mobile|Mobile.*Android/i.test(navigator.userAgent);
		},
		isTablet: () => {
			const isIPadDesktop = /iPad/i.test(navigator.userAgent) &&
				  window.innerWidth > 1024;
			return !isIPadDesktop && (
				(window.innerWidth > 480 && window.innerWidth <= 1024) ||
				/iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) ||
				('ontouchstart' in window && window.innerWidth <= 1024)
			);
		},
		spacing: {
			mobile: 70,
			tablet: 80,
			desktop: 40 // 80
		},
		styles: {
			common: {
				position: 'fixed',
				background: 'hsla(0, 0%, 100%, .7)',
				borderRadius: 'var(--border-radius-default)',
				boxShadow: '0 4px 24px rgba(0, 0, 0, .05)',
				color: 'var(--color-brand)',
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				transition: 'opacity .15s ease',
				opacity: '.5',
				zIndex: '100'
			},
			desktop: {
				arrow: {
					width: '40px',
					height: '32px',
					fontSize: '20px',
				},
				text: {
					width: '150px',
					height: '32px',
					fontSize: '14px',
					padding: '8px 15px'
				}
			},
			tablet: {
				arrow: {
					width: '70px',     //  50px
					height: '70px',    //  50px
					fontSize: '28px',   //  22px
				},
				text: {
					width: '150px',
					height: '60px',    //  44px
					fontSize: '20px',  //  16px
					padding: '12px 20px' //  8px 15px
				}
			},
			mobile: {
				arrow: {
					width: '50px',
					height: '50px',
					fontSize: '24px'
				},
				text: {
					width: '150px',
					height: '44px',
					fontSize: '16px',
					padding: '8px 15px'
				}
			}
		}
	};

	const styles = `

		.comment-thread-line {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 2px;
			background: #e3e3e3;
			transition: background-color 0.2s;
		}

		.comment-thread-line:hover {
			background: #ccc;
		}

		.comment-thread-container {
			position: relative;
			padding-left: 20px;
			margin-left: 20px;
		}

		.tim {
            position: relative;
            margin-right: 5px;
            font-size: 10px;
            padding: 2px 4px;
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        .shape {
            margin: 0 4px;
            display: inline-block;
            filter: url(#shadow);
        }

        .owl {
			filter: url(#emojiShadow);
			transform: translateZ(0);
			will-change: transform;
			backface-visibility: hidden;
			display: inline-block;
			transform-origin: bottom center;
			padding-right: 5px;
			animation: owlActions 26s ease-in-out infinite;
		}

		@keyframes owlActions {
			0%, 10% {
				transform: translateY(0) scale(1) rotateY(0deg);
			}
			11% {
				transform: translateY(-10px) scale(1) rotateY(0deg);
			}
			12% {
				transform: translateY(0) scale(1) rotateY(0deg);
			}
			20% {
				transform: rotateY(0deg) scale(1);
			}
			21% {
				transform: rotateY(180deg) scale(1);
			}
			22% {
				transform: rotateY(0deg) scale(1);
			}
			30% {
				transform: scale(1);
			}
			31% {
				transform: scale(1.2);
			}
			32% {
				transform: scale(1);
			}
			33% {
				transform: scale(1.3);
			}
			34%, 100% {
				transform: scale(1) rotateY(0deg);
			}
		}

    `;

	const styleSheet = document.createElement("style");
	styleSheet.type = "text/css";
	styleSheet.innerText = styles;
	document.head.appendChild(styleSheet);

	const timMap = new Map([
		['Дон Кихот', ['Stephen Mindfult']],
		['Дюма', ['vova_killer_2004', 'Kannei']],
		['Гюго', ['Ася Б.', 'Barsaf']],
		['Робеспьер', []],
		['Гамлет', ['Тома Игольникова']],
		['Максим', []],
		['Жуков', ['Артём Саврулин']],
		['Есенин', ['Ekaterina Popova', 'Евгения Истомина']],
		['Наполеон', []],
		['Бальзак', ['Алена П.', 'Соня Тащян', 'Egor Nemykin', 'Антон Покемонов']],
		['Джек', []],
		['Драйзер', []],
		['Штирлиц', []],
		['Достоевский', []],
		['Гексли', ['Соня Котова']],
		['Габен', []],
	]);

	const timDerivatives = {
		'Дон Кихот': [
			'Дон Кихот', 'Дон Кихота', 'Дон Кихоту', 'Дон Кихотом', 'Дон Кихоте', 'Дон Кихоты', 'Дон Кихотов', 'Дон Кихотам', 'Дон Кихотами', 'Дон Кихотах', 'дон-кихот', 'дон-кихота', 'дон-кихоту', 'дон-кихотом', 'дон-кихоте', 'дон-кихоты', 'дон-кихотов', 'дон-кихотам', 'дон-кихотами', 'дон-кихотах', 'донкихот', 'донкихота', 'донкихоту', 'донкихотом', 'донкихоте', 'донкихоты', 'донкихотов', 'донкихотам', 'донкихотами', 'донкихотах', 'дк', 'ДКХ', 'донка', 'донки', 'донке', 'донку', 'донкой', 'донке', 'донки', 'донок', 'донкам', 'донками', 'донках', 'Кихот', 'Кихота', 'Кихоту', 'Кихотом', 'Кихоте', 'Кихоты', 'Кихотов', 'Кихотам', 'Кихотами', 'Кихотах','Дон', 'Дона', 'Дону', 'Дон', 'Доном', 'Доне', 'Доны', 'Донов', 'Донам', 'Доны', 'Донами', 'Донах','Донка', 'Донки', 'Донке', 'Донку', 'Донкой', 'Донке', 'Донки', 'Донок', 'Донкам', 'Донок', 'Донками', 'Донках', 'доно', 'ИЛЭ'
		],
		'Дюма': [
			'Дюма', 'Дюмы', 'Дюме', 'Дюму', 'Дюмой', 'Дюме', 'Дюмы', 'Дюм', 'Дюме', 'Дюмам', 'Дюмами', 'Дюмах', 'дюмка', 'дюмки', 'дюмке', 'дюмку', 'дюмкой', 'дюмке', 'дюмки', 'дюмок', 'дюмкам', 'дюмками', 'дюмках', 'дюмаша', 'дюмаши', 'дюмаше', 'дюмашу', 'дюмашей', 'дюмаше', 'дюмаши', 'дюмаш', 'дюмашам', 'дюмашами', 'дюмашах', 'Дюмочка', 'Дюмочки', 'Дюмочке', 'Дюмочку', 'Дюмочкой', 'Дюмочек', 'Дюмочкам', 'Дюмочками', 'Дюмочках', 'Дюмский', 'Дюмского', 'Дюмскому', 'Дюмским', 'Дюмском', 'Дюмская', 'Дюмскую', 'Дюмское', 'Дюмские', 'Дюмских', 'Дюмским', 'дюмо', 'СЭИ'
		],
		'Гюго': [
			'Гюго', 'Гюгой', 'Гюги', 'Гюгов', 'Гюгоха', 'гюгохи', 'гюгохе', 'гюгоху', 'гюгохой', 'гюгох', 'гюгохам', 'гюгохами', 'гюгохах', 'Гюгье', 'гюгошонок', 'гюгошонка', 'гюгошонку', 'гюгошонком', 'гюгошонке', 'гюгошонки', 'гюгошонкам', 'гюгошонками', 'гюгошонках', 'гюгошонки', 'Гюг', 'Гюга', 'Гюгу', 'Гюгом', 'Гюге', 'Гюги', 'Гюгов', 'Гюгам', 'Гюгами', 'Гюгах', 'Гюгоша', 'Гюгоши', 'Гюгоше', 'Гюгошу', 'Гюгошей', 'Гюгош', 'Гюгошам', 'Гюгошами', 'Гюгошах', 'гюгский', 'гюгского', 'гюгскому', 'гюгским', 'гюгском', 'гюгская', 'гюгскую', 'гюгское', 'гюгские', 'гюгских', 'ЭСЭ'
		],
		'Робеспьер': [
			'Робеспьер', 'Робеспьера', 'Робеспьеру', 'Робеспьером', 'Робеспьере', 'Робеспьеры', 'Робеспьеров', 'Робеспьерам', 'Робеспьерами', 'Робеспьерах', 'роб', 'роба', 'робу', 'робом', 'робе', 'робы', 'робов', 'робам', 'робами', 'робах', 'робка', 'робки', 'робке', 'робку', 'робкой', 'робке', 'робки', 'робок', 'робкам', 'робками', 'робках', 'робеспьеровский', 'робеспьеровского', 'робеспьеровскому', 'робеспьеровским', 'робеспьеровском', 'робеспьеровская', 'робеспьеровской', 'робеспьеровскую', 'робеспьеровские', 'робеспьеровских', 'робеспьеровским', 'робеспьеровский', 'робеспьеровского', 'робеспьеровскому', 'робеспьеровским', 'робеспьеровском', 'робеспьеровские', 'робеспьеровских', 'робеспьеровским', 'робеспьеровская', 'робеспьеровской', 'робеспьеровскую', 'робо', 'ЛИИ'
		],
		'Гамлет': [
			'Гамлет', 'Гамлета', 'Гамлету', 'Гамлетом', 'Гамлете', 'Гамлеты', 'Гамлетов', 'Гамлетам', 'Гамлетами', 'Гамлетах', 'гамло', 'гамла', 'гамлу', 'гамлом', 'гамле', 'гамлы', 'гамлов', 'гамлам', 'гамлами', 'гамлах', 'гамка', 'гамки', 'гамке', 'гамку', 'гамкой', 'гамке', 'гамки', 'гамок', 'гамкам', 'гамками', 'гамках', 'Гам', 'Гама', 'Гаму', 'Гамом', 'Гаме', 'Гамы', 'Гамов', 'Гамам', 'Гамами', 'Гамах', 'гамлетесса', 'гамлетессы', 'гамлетессе', 'гамлетессу', 'гамлетессой', 'гамлетессам', 'гамлетесс', 'гамлетессами', 'гамлетессах', 'гамо', 'ЭИЭ'
		],
		'Максим': [
			'Максим', 'Максима', 'Максиму', 'Максимом', 'Максиме', 'Максимы', 'Максимов', 'Максимам', 'Максимами', 'Максимах', 'макс', 'макса', 'максу', 'максом', 'максе', 'максы', 'максов', 'максам', 'максами', 'максах', 'Горький', 'Горького', 'Горькому', 'Горьким', 'Горьком', 'Горькие', 'Горьких', 'Горьким', 'Горькими', 'максимка', 'максимки', 'максимке', 'максимку', 'максимкой', 'максимке', 'максимки', 'максимок', 'максимкам', 'максимками', 'максимках', 'максо', 'ЛСИ'
		],
		'Жуков': [
			'Жуков', 'Жукова', 'Жукову', 'Жуковым', 'Жукове', 'Жуковы', 'Жуковым', 'Жуковыми', 'Жуковых', 'жучка', 'жучки', 'жучке', 'жучку', 'жучкой', 'жучки', 'жучков', 'жучкам', 'жучками', 'жучках', 'жук', 'жука', 'жуку', 'жука', 'жучком', 'жуки', 'жуков', 'жукам', 'жуками', 'жуковах', 'жуко', 'СЛЭ'
		],
		'Есенин': [
			'Есенин', 'Есенина', 'Есенину', 'Есениным', 'Есенине', 'есенины', 'есениных', 'есенинам', 'есенинами', 'есенинах', 'есенинка', 'есенинки', 'есенинке', 'есенинку', 'есенинкой', 'есенинках', 'есь', 'еся', 'есю', 'есем', 'есе', 'еси', 'есей', 'есям', 'есями', 'есях', 'еська', 'еськи', 'еське', 'еську', 'еськой', 'еськах', 'есью', 'ИЭИ'
		],
		'Наполеон': [
			'Наполеон', 'Наполеона', 'Наполеону', 'Наполеоном', 'Наполеоне', 'наполеоны', 'наполеонов', 'наполеонам', 'наполеонами', 'наполеонах', 'нап', 'напа', 'напу', 'напом', 'напе', 'напы', 'напов', 'напам', 'напами', 'напах', 'напка', 'напки', 'напке', 'напку', 'напкой', 'напках', 'Напша', 'Напши', 'Напшы', 'Напше', 'Напшу', 'Напшей', 'Напшам', 'Напшами', 'Напшах', 'напо', 'СЭЭ'
		],
		'Бальзак': [
			'Бальзак', 'Бальзака', 'Бальзаку', 'Бальзаком', 'Бальзаке', 'бальзаки', 'бальзаков', 'бальзакам', 'бальзаками', 'бальзаках', 'бальзачка', 'бальзачки', 'бальзачке', 'бальзачку', 'бальзачкой', 'бальзачках', 'баль', 'баля', 'балю', 'балем', 'бале', 'бали', 'балей', 'балям', 'балями', 'балях', 'балька', 'бальки', 'бальке', 'бальку', 'балькой', 'бальках', 'бальзаковская', 'бальзаковской', 'бальзаковскую', 'бальзаковский', 'бальзаковского', 'бальзаковскому', 'бальзаковским', 'бальзаковском', 'бальзаковские', 'бальзаковских', 'бальзаковским', 'бале',
		],
		'Джек': [
			'Джек', 'Джека', 'Джеку', 'Джеком', 'Джеке', 'Джеки', 'Джеки', 'Джеков', 'Джекам', 'Джеками', 'Джеках', 'джечка', 'джечки', 'джечке', 'джечку', 'джечкой', 'джечки', 'джечек', 'джечкам', 'джечками', 'джечках', 'джеко', 'ЛИЭ'
		],
		'Драйзер': [
			'Драйзер', 'Драйзера', 'Драйзеру', 'Драйзером', 'Драйзере', 'Драйзеры', 'Драйзеров', 'Драйзерам', 'Драйзерами', 'Драйзерах', 'драйзерка', 'драйзерки', 'драйзерке', 'драйзерку', 'драйзеркой', 'драйзерках', 'драй', 'драя', 'драю', 'драи', 'драем', 'драями', 'драях', 'драйка', 'драйки', 'драйке', 'драйку', 'драйкой', 'драйках', 'драйское', 'Драйзерша', 'Драйзерши', 'Драйзерше', 'Драйзершу', 'Драйзершей', 'Драйзерш', 'Драйзершам', 'Драйзершами', 'Драйзершах', 'ЭСИ'
		],
		'Штирлиц': [
			'Штирлиц', 'Штирлица', 'Штирлицу', 'Штирлицем', 'Штирлице', 'штирлицы', 'штирлицев', 'штирлицам', 'штирлицами', 'штирлицах', 'штирка', 'штирки', 'штирке', 'штирку', 'штиркой', 'штирках', 'штир', 'штира', 'штиру', 'штиром', 'штире', 'штиры', 'штиров', 'штирам', 'штирами', 'штирах', 'штиро', 'ЛСЭ'
		],
		'Достоевский': [
			'Достоевский', 'Достоевского', 'Достоевскому', 'Достоевским', 'Достоевском', 'Достоевские', 'Достоевских', 'Достоевским', 'Достоевскими', 'Достоевских', 'дост', 'доста', 'досту', 'достом', 'досте', 'досты', 'достов', 'достам', 'достами', 'достах', 'достоевская', 'достоевской', 'достоевскую', 'достоевской', 'достоевские', 'достоевских', 'достоевским', 'достоевскими', 'достоевских', 'досто', 'ЭИИ'
		],
		'Гексли': [
			'Гексли', 'гек', 'гека', 'геку', 'геком', 'геке', 'геки', 'геков', 'гекам', 'геками', 'геках', 'гечка', 'гечки', 'гечке', 'гечку', 'гечкой', 'гечках', 'геко', 'гекслевый', 'гекслевого', 'гекслевому', 'гекслевым', 'гекслевом', 'гекслевая', 'гекслевую', 'гекслевое', 'гекслевые', 'гекслевых', 'гекслевым', 'ИЭЭ'
		],
		'Габен': [
			'Габен', 'Габена', 'Габену', 'Габеном', 'Габене', 'Габены', 'Габенов', 'Габенам', 'Габенами', 'Габенах', 'габ', 'габа', 'габу', 'габом', 'габе', 'габы', 'габов', 'габам', 'габами', 'габах', 'габенка', 'габенки', 'габенке', 'габенку', 'габенкой', 'габенках', 'Габеньи', 'Габеньих', 'Габеньим', 'габо', 'СЛИ'
		]
	};



	const timStyles = {
		'Дон Кихот': { backgroundColor: '#479a3c', boxShadow: '0 0.2rem 0.3rem #326030'},
		'Дюма': { backgroundColor: '#326030', boxShadow: '0 0.2rem 0.3rem #479a3c' },
		'Гюго': { backgroundColor: '#588973', boxShadow: '0 0.2rem 0.3rem #5aa982' },
		'Робеспьер': { backgroundColor: '#5aa982', boxShadow: '0 0.2rem 0.3rem #588973' },
		'Гамлет': { backgroundColor: '#c5702b', boxShadow: '0 0.2rem 0.3rem #a7431f' },
		'Максим': { backgroundColor: '#a7431f', boxShadow: '0 0.2rem 0.3rem #c5702b' },
		'Жуков': { backgroundColor: '#dda338', boxShadow: '0 0.2rem 0.3rem #e3c644' },
		'Есенин': { backgroundColor: '#e3c644', boxShadow: '0 0.2rem 0.3rem #dda338' },
		'Наполеон': { backgroundColor: '#a1336f', boxShadow: '0 0.2rem 0.3rem #9d3774' },
		'Бальзак': { backgroundColor: '#9d3774', boxShadow: '0 0.2rem 0.3rem #a1336f' },
		'Джек': { backgroundColor: '#8a211d', boxShadow: '0 0.2rem 0.3rem #b92d2c' },
		'Драйзер': { backgroundColor: '#b92d2c', boxShadow: '0 0.2rem 0.3rem #8a211d' },
		'Штирлиц': { backgroundColor: '#5030a8', boxShadow: '0 0.2rem 0.3rem #492893' },
		'Достоевский': { backgroundColor: '#492893', boxShadow: '0 0.2rem 0.3rem #5030a8' },
		'Гексли': { backgroundColor: '#262dbe', boxShadow: '0 0.2rem 0.3rem #181e93' },
		'Габен': { backgroundColor: '#181e93', boxShadow: '0 0.2rem 0.3rem #262dbe' },
	};

	const customUserStyles = {
		'Ручная Сова': {
			padding: '0 10px',
			backgroundColor: '#ffcc00',
			boxShadow: '0 0.2rem 0.3rem #b38f00',
		}
	};

	const shapeElements = {
		'triangle-white': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/3/32/Socionics_symbol_Ni.svg" width="12" height="12" alt="Triangle White" />`,
		'triangle-black': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Socionics_symbol_Ne.svg" width="12" height="12" alt="Triangle Black" />`,
		'circle-white': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Socionics_symbol_Si.svg" width="12" height="12" alt="Circle White" />`,
		'circle-black': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Socionics_symbol_Se.svg" width="12" height="12" alt="Circle Black" />`,
		'square-white': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Socionics_symbol_Ti.svg" width="12" height="12" alt="Square White" />`,
		'square-black': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Socionics_symbol_Te.svg" width="12" height="12" alt="Square Black" />`,
		'white_square_non_corner': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/0/00/Socionics_symbol_Fi.svg" width="12" height="12" alt="White Square Non-Corner" />`,
		'black_square_non_corner': `<img class="shape" src="https://upload.wikimedia.org/wikipedia/commons/9/98/Socionics_symbol_Fe.svg" width="12" height="12" alt="Black Square Non-Corner" />`
    };


	const keywords = {
		'би': 'triangle-white',
		'чи': 'triangle-black',
		'бс': 'circle-white',
		'чс': 'circle-black',
		'бл': 'square-white',
		'чл': 'square-black',
		'бэ': 'white_square_non_corner',
		'чэ': 'black_square_non_corner',
	};


	const stylesCache = new Map();
	const shapesCache = new Map();
	const keywordsCache = new Map();

	const MAX_CACHE_SIZE = 1000;
	const CACHE_CLEANUP_SIZE = 800;

	// const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF]/gu;


	function matchEmojiPattern(text) {
		return text.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]*)(.*?)([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]*)$/u);
	}



	function cleanupCache(cache) {
		if (cache.size > MAX_CACHE_SIZE) {
			const entries = Array.from(cache.entries());
			entries.slice(0, CACHE_CLEANUP_SIZE).forEach(([key]) => cache.delete(key));
		}
	}



	function createShapeElement(shapeClass) {
		cleanupCache(shapesCache);

		if (!shapesCache.has(shapeClass)) {
			shapesCache.set(shapeClass, shapeElements[shapeClass] || '');
		}
		return shapesCache.get(shapeClass);
	}



	function hideNotice() {
		const noticeListHide = document.getElementById('noticeList');
		if (noticeListHide) noticeListHide.style.display = 'none';
	}



	function addShadowFilter() {
		if (!document.getElementById('shadow')) {

			const svgFilter = `
        <svg width="0" height="0">
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                    <feOffset dx="1" dy="1" result="offsetblur"/>
                    <feFlood flood-color="rgba(0,0,0,0.45)"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="emojiShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feFlood flood-color="rgba(0,0,0,0.5)"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        </svg>`;
			document.body.insertAdjacentHTML('afterbegin', svgFilter);
		}
	}



	function replaceKeywords(postContent) {
		cleanupCache(keywordsCache);

		if (keywordsCache.has(postContent)) {
			return keywordsCache.get(postContent);
		}

		const contentWithSpaces = postContent.replace(/<br\s*\/?>/gi, ' <br> ');

		// Регулярное выражение для разделения текста на слова и символы
		const wordPattern = /(\s+|[.,!?;<>(){}[\]+\-—_@#$%^&*=:;"'\\|/«»‘’”“…–+*/|^&%=<>€₹₽₣$]|(?=\d)|(?<=\d))/;

		const result = contentWithSpaces.split(wordPattern).map(word => {
			const match = matchEmojiPattern(word);

			if (match) {
				const [, preEmoji, textPart, postEmoji] = match;
				const trimmedWord = textPart.trim().replace(/^[.,…]+|[.,…]+$/g, '');
				const lowerWord = trimmedWord.toLowerCase();

				if (keywords[lowerWord]) {
					const prefix = textPart.match(/^[.,…]+/)?.[0] || '';
					const suffix = textPart.match(/[.,…]+$/)?.[0] || '';
					return `${preEmoji}${prefix}${createShapeElement(keywords[lowerWord])}${suffix}${postEmoji}`;
				}
				return word;
			}

			// Возвращаем слово без изменений, если не нашли эмодзи
			return word;
		}).join('');

		keywordsCache.set(postContent, result);
		return result;
	}




	function convertLinks(postElement) {
		let postContent = postElement.innerHTML;

		const linkRegex = /(?:^|[\s+.,!?;:<>(){}[\]+\-—_@#$%^&*=:;"'\\|/«»‘’”“…–+*/|^&%=<>€₹₽₣$]|(?=\d)|(?<=\d))((https?:\/\/(?!images\.boosty\.to\/smile\/)[^\s<]+))(?![^<]*>|[^<>]*<\/a>)/g;

		// Если есть ссылки, обрабатываем их
		if (linkRegex.test(postContent)) {
			postContent = postContent.replace(linkRegex, (match, url) => {
				const urlMatch = matchEmojiPattern(url);

				// Проверка на URL с эмодзи
				if (urlMatch) {
					const [, preEmoji, urlPart, postEmoji] = urlMatch;
					if (!isLinkAlreadyWrapped(match)) {
						return `${preEmoji}<a href="${urlPart}" target="_blank">${urlPart}</a>${postEmoji}`;
					}
				}
				// Если не эмодзи и ссылка не имеет тегов <a> или <span> с классом
				else if (!isLinkAlreadyWrapped(match)) {
					return `<a href="${url}" target="_blank">${url}</a>`;
				}

				return match;
			});

			postElement.innerHTML = postContent;
		}
	}

	// Вспомогательная функция для проверки, обернута ли ссылка в <a> или имеет ли ссылку класс "shape"
	function isLinkAlreadyWrapped(match) {
		return match.includes('href=') || match.includes('class="shape"');
	}




	function applyStyles(nameElements) {
		cleanupCache(stylesCache);

		nameElements.forEach(function(nameElement) {
			const userName = nameElement.textContent.trim();

			if (nameElement.dataset.styled) return;

			nameElement.style.fontWeight = 'bold';

			if (customUserStyles[userName]) {
				Object.assign(nameElement.style, customUserStyles[userName]);
			}

			if (stylesCache.has(userName)) {
				const { emoji, tim } = stylesCache.get(userName);
				if (emoji) {
					nameElement.insertAdjacentHTML('afterend', emoji);
				}
				if (tim) {
					const teamSpan = document.createElement('span');
					teamSpan.textContent = tim;
					teamSpan.className = 'tim';
					Object.assign(teamSpan.style, timStyles[tim]);
					nameElement.insertAdjacentElement('afterend', teamSpan);
				}
				nameElement.dataset.styled = 'true';
				return;
			}

			let emoji;
			if (userName === 'Ручная Сова') {
				emoji = `<span class="owl">🦉</span>`;
			}

			let tim = null;
			for (const [team, names] of timMap.entries()) {
				if (names.includes(userName)) {
					tim = team;
					break;
				}
			}

			stylesCache.set(userName, { emoji, tim });

			if (emoji) {
				nameElement.insertAdjacentHTML('afterend', emoji);
			}
			if (tim) {
				const teamSpan = document.createElement('span');
				teamSpan.textContent = tim;
				teamSpan.className = 'tim';
				Object.assign(teamSpan.style, timStyles[tim]);
				nameElement.insertAdjacentElement('afterend', teamSpan);
			}

			nameElement.dataset.styled = 'true';
		});
	}



	function colorizeTimNames() {
		const timNameToStyle = new Map();
		for (const [key, derivatives] of Object.entries(timDerivatives)) {
			const style = timStyles[key];
			if (style) {
				timNameToStyle.set(key.toLowerCase(), style);
				derivatives.forEach(derivative => timNameToStyle.set(derivative.toLowerCase(), style));
			}
		}

		const elements = document.querySelectorAll('.BlockRenderer_markup_Wtipg, .Post_title_G2QHp');
		const processedCache = new Map();

		elements.forEach(element => {
			if (processedCache.size > 1000) { processedCache.clear(); }

			if (element.dataset.timColored) return;

			const textWithSpaces = element.innerHTML.replace(/<br\s*\/?>/gi, ' <br> ');

			if (processedCache.has(textWithSpaces)) {
				element.innerHTML = processedCache.get(textWithSpaces);
			} else {
				const processedText = textWithSpaces.split(/(\s+|[.,!?;<>(){}[\]+\-—_@#$%^&*=:;"'\\|/]|(?=\d)|(?<=\d))/).map(word => {
					const match = matchEmojiPattern(word);

					if (match) {
						const [, preEmoji, textPart, postEmoji] = match;
						const trimmedWord = textPart.trim().replace(/^["']|["']$/g, '');
						const lowerWord = trimmedWord.toLowerCase();

						if (timNameToStyle.has(lowerWord)) {
							const style = timNameToStyle.get(lowerWord);
							const capitalizedWord = trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1);
							return `${preEmoji}<span style="color: ${style.backgroundColor}; text-shadow: 1px 1px 1px rgba(0,0,0,0.5);">${capitalizedWord}</span>${postEmoji}`;
						}
					}
					return word;
				}).join('');

				processedCache.set(textWithSpaces, processedText);
				element.innerHTML = processedText;
			}

			element.dataset.timColored = 'true';
		});
	}




	function processPosts() {
		const posts = document.querySelectorAll('.BlockRenderer_markup_Wtipg:not([data-processed]), .Post_title_G2QHp:not([data-processed])');
		posts.forEach(function(postElement) {
			if (postElement.dataset.processed) return;

			const postContent = postElement.innerHTML;
			const newContent = replaceKeywords(postContent);
			if (newContent !== postContent) {
				postElement.innerHTML = newContent;
			}

			convertLinks(postElement);
			colorizeTimNames();
			postElement.dataset.processed = 'true';
		});
	}




	////////////////////////////BUTTONS///////////////////////////////////////////

	function getDeviceType() {
		const ua = navigator.userAgent.toLowerCase();
		const isTablet = /ipad|android(?!.*mobile)|tablet/.test(ua) ||
			  (window.innerWidth > 480 && window.innerWidth <= 1024 && 'ontouchstart' in window);
		const isMobile = /iphone|ipod|android.*mobile|mobile.*android/.test(ua) || window.innerWidth <= 480;

		if (isTablet) {
			return 'tablet';
		}
		if (isMobile) {
			return 'mobile';
		}
		return 'desktop';
	}



	function createButton({ text, onClick, isArrow, index }) {
		const button = document.createElement('div');
		button.setAttribute('data-navigation-button', '');
		button.textContent = text;

		const isMobile = CONFIG.isMobile();
		const isTablet = CONFIG.isTablet();

		const deviceStyles = isMobile ? CONFIG.styles.mobile :
		isTablet ? CONFIG.styles.tablet :
		CONFIG.styles.desktop;

		const positionStyles = {
			mobile: {
				left: '20px',
				right: 'auto',
				bottom: `${30 + ((3 - index) * CONFIG.spacing.mobile)}px`
        },
			tablet: {
				right: '20px',
				left: 'auto',
				bottom: `${30 + ((3 - index) * CONFIG.spacing.tablet)}px`
        },
			desktop: {
				right: '20px',
				left: 'auto',
				bottom: `${75 + ((3 - index) * CONFIG.spacing.desktop)}px`
        }
		};

		const devicePosition = isMobile ? positionStyles.mobile :
		isTablet ? positionStyles.tablet :
		positionStyles.desktop;

		const buttonStyles = {
			...CONFIG.styles.common,
			...(isArrow ? deviceStyles.arrow : deviceStyles.text),
			...devicePosition
		};

		Object.assign(button.style, buttonStyles);

		const handleClick = () => {
			onClick();
			if (isMobile || isTablet) {
				button.style.opacity = '1';
				setTimeout(() => button.style.opacity = '.5', 300);
			}
		};

		button.addEventListener('click', handleClick);
		button.addEventListener('mouseover', () => button.style.opacity = '1');
		button.addEventListener('mouseout', () => button.style.opacity = '.5');

		document.body.appendChild(button);
		return button;
	}





	function createNavigationButtons() {
		[
			{
				text: '⤒',
				onClick: () => {
					window.scrollTo({
						top: 0,
						behavior: 'smooth'
					});
				},
				isArrow: true,
				index: 0
			},

			{
				text: '💬',
				onClick: () => {
					const commentsStart = CONFIG.isMobile()
					? document.querySelector('.Post_footer_QJbgx')
					: document.querySelector('.Post_footer_NWxJl');

					if (commentsStart) {
						window.scrollTo({
							top: commentsStart.getBoundingClientRect().top + window.pageYOffset - 300,
							behavior: 'smooth'
						});
					}
				},
				isArrow: true,
				index: 1
			},

			{
				text: '⤓',
				onClick: () => {
					const footer = document.querySelector('.Footer_block_ylyfI');
					if (footer) {
						window.scrollTo({
							top: footer.getBoundingClientRect().top + window.pageYOffset - 50,
							behavior: 'smooth'
						});
					}
				},
				isArrow: true,
				index: 2
			}
		].forEach((props, index) => createButton({ ...props, index }));
	}





	function handleNavigationButtons() {
		function removeAllNavigationButtons() {
			const existingButtons = document.querySelectorAll('[data-navigation-button]');
			existingButtons.forEach(button => {
				if (button && button.parentNode) {
					button.parentNode.removeChild(button);
					button.remove();
				}
			});
		}

		removeAllNavigationButtons();

		const currentUrl = window.location.href;
		const isMainPage = currentUrl.endsWith('/feed') ||
			  currentUrl.endsWith('/feed/') ||
			  currentUrl === window.location.origin + '/' ||
			  currentUrl === window.location.origin;

		const isMobile = CONFIG.isMobile();
		const mainFeedElement = isMobile ?
			  document.querySelector('.MainFeed_root_XI9wq') :
		document.querySelector('.MainFeed_root_pO8A5');

		if (!isMainPage && !mainFeedElement) {
			setTimeout(() => {
				createNavigationButtons();
			}, 100);
		}
	}



	function handleShowMoreClick() {
		document.addEventListener('click', function(e) {
			if (e.target.matches('.ShowMore_showMore_VRTFG')) {
				debounce(() => {
					requestAnimationFrame(() => {
						addShadowFilter();
						applyStyles(document.querySelectorAll('.CommentView_name_rDuK_'));
						processPosts();
					});
				}, 100)();
			}
		});
	}




	function observeDynamicContent() {
		const observer = new MutationObserver(mutations => {
			if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
				requestAnimationFrame(() => {
					addShadowFilter();
					applyStyles(document.querySelectorAll('.CommentView_name_rDuK_'));
					processPosts();
					colorizeTimNames();
				});
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}


	function observeUrlChanges() {
		let lastUrl = location.href;

		const observer = new MutationObserver(() => {
			if (location.href !== lastUrl) {
				lastUrl = location.href;
				handleNavigationButtons();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}



	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}



	function init() {
		return new Promise((resolve) => {
			addShadowFilter();
			hideNotice();2
			applyStyles(document.querySelectorAll('.CommentView_name_rDuK_'));
			processPosts();
			observeDynamicContent();
			handleShowMoreClick();
			observeUrlChanges();
			handleNavigationButtons();
			resolve();
		});
	}




	init().then(() => {
		// Initialization complete
	});
});