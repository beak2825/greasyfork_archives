// ==UserScript==
// @name			CancelBattle_HeroWars
// @name:en			CancelBattle_HeroWars
// @namespace		CancelBattle_HeroWars
// @version			1.184
// @description		Отмена боев в игре Хроники Хаоса
// @description:en	Cancellation of battles in the game Hero Wars
// @author			ZingerY
// @homepage		http://ilovemycomp.narod.ru/CancelBattle_HeroWars.user.js
// @icon			http://ilovemycomp.narod.ru/VaultBoyIco16.ico
// @icon64			http://ilovemycomp.narod.ru/VaultBoyIco64.png
// @encoding		utf-8
// @include			https://*.nextersglobal.com/*
// @include			https://*.hero-wars*.com/*
// @downloadURL https://update.greasyfork.org/scripts/443420/CancelBattle_HeroWars.user.js
// @updateURL https://update.greasyfork.org/scripts/443420/CancelBattle_HeroWars.meta.js
// ==/UserScript==

(function() {
	/** Стартуем скрипт */
	console.log('Start ' + GM_info.script.name + ', v' + GM_info.script.version);
	/** Оригинальные методы для работы с AJAX */
	const original = {
		open: XMLHttpRequest.prototype.open,
		send: XMLHttpRequest.prototype.send,
		setRequestHeader: XMLHttpRequest.prototype.setRequestHeader,
	};
	/** Декодер для перобразования байтовых данных в JSON строку */
	let decoder = new TextDecoder("utf-8");
	/** Хранит историю запросов */
	let requestHistory = {};
	/** Была ли взломана подписка */
	let isHackSubscribe = false;
	/** URL для запросов к API */
	let apiUrl = '';
	/** Идетификатор социальной сети */
	let sNetwork = '';
	/** Идетификаторы подписки для соц сетей */
	let socials = {
		vk: 1, // vk.com
		ok: 2, // ok.ru
		mm: 3, // my.mail.ru
		mg: 5, // store.my.games
		fb: 4, // apps.facebook.com
		wb: 6, // hero-wars.com
	}
	/** Возвращает историю запросов */
	this.getRequestHistory = function() {
		return requestHistory;
	}
	/** Гененирует случайное целое число от min до max */
	const random = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	/** Очистка истоии запросов */
	setInterval(function () {
		let now = Date.now();
		for (let i in requestHistory) {
			if (now - i > 300000) {
				delete requestHistory[i];
			}
		}
	}, 300000);
	/** Переопределяем/проксируем метод создания Ajax запроса */
	XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
		this.uniqid = Date.now();
		if (method == 'POST' && url.includes('.nextersglobal.com/api/') && /api\/$/.test(url)) {
			if (!apiUrl) {
				apiUrl = url;
				socialInfo = /heroes-(.+?)\./.exec(apiUrl);
				sNetwork = socialInfo ? socialInfo[1] : 'vk';
			}
			requestHistory[this.uniqid] = {
				method,
				url,
				error: [],
				headers: {},
				request: null,
				response: null,
				signature: [],
				calls: {},
			};
		}
		return original.open.call(this, method, url, async, user, password);
	};
	/** Переопределяем/проксируем метод установки заголовков для AJAX запроса */
	XMLHttpRequest.prototype.setRequestHeader = function (name, value, check) {
		if (this.uniqid in requestHistory) {
			requestHistory[this.uniqid].headers[name] = value;
		} else {
			check = true;
		}

		if (name == 'X-Auth-Signature') {
			requestHistory[this.uniqid].signature.push(value);
			if (!check) {
				return;
			}
		}

		return original.setRequestHeader.call(this, name, value);
	};
	/** Переопределяем/проксируем метод отправки AJAX запроса */
	XMLHttpRequest.prototype.send = async function(data) {
		if (this.uniqid in requestHistory) {
			if (getClass(data) == "ArrayBuffer") {
				Sdata = decoder.decode(data);
			} else {
				Sdata = data;
			}
			requestHistory[this.uniqid].request = Sdata;

			try {
				/** Функция заменяющая данные боя на неверные для отмены боя */
				const fixBattle = function (heroes) {
					for (const ids in heroes) {
						hero = heroes[ids];
						hero.energy = random(1, 999);
						if (hero.hp > 0) {
							hero.hp = random(1, hero.hp);
						}
					}
				}
				/** Диалоговое окно */
				const showMsg = async function (msg, ansF, ansS) {
					if (typeof popup == 'object') {
						return await popup.confirm(msg, [
							{msg: ansF, result: false},
							{msg: ansS, result: true},
						]);
					} else {
						return !confirm(msg + "\n" + ansF + " (Ок)\n" + ansS + " (Отмена)");
					}
				}

				let changeRequest = false;
				testData = JSON.parse(Sdata);
				for (const call of testData.calls) {
					requestHistory[this.uniqid].calls[call.name] = call.ident;
					/** Отмена боя в приключениях, на ВГ и с прислужниками Асгарда */
					if (call.name == 'adventure_endBattle' ||
						call.name == 'adventureSolo_endBattle' ||
						call.name == 'clanWarEndBattle' ||
						call.name == 'brawl_endBattle' ||
						call.name == 'towerEndBattle' ||
						call.name == 'clanRaid_endNodeBattle') {
						if (!call.args.result.win) {
							if (await showMsg('Вы потерпели поражение!', 'Хорошо', 'Отменить бой')) {
								fixBattle(call.args.progress[0].attackers.heroes);
								fixBattle(call.args.progress[0].defenders.heroes);
								changeRequest = true;
							}
						}
					}
					/** Отмена боя в Асгарде */
					if (call.name == 'clanRaid_endBossBattle') {
						bossDamage = call.args.progress[0].defenders.heroes[1].extra;
						sumDamage = bossDamage.damageTaken + bossDamage.damageTakenNextLevel;
						if (await showMsg(
								'Вы нанесли ' + sumDamage.toLocaleString() + ' урона.',
								'Хорошо',
								'Отменить бой')) {
							fixBattle(call.args.progress[0].attackers.heroes);
							fixBattle(call.args.progress[0].defenders.heroes);
							changeRequest = true;
						}
					}
					/** Отключить трату карт предсказаний */
					if (call.name == 'dungeonEndBattle') {
						if (call.args.isRaid) {
							delete call.args.isRaid;
							changeRequest = true;
						}
					}
				}

				let headers = requestHistory[this.uniqid].headers;
				if (changeRequest) {
					data = JSON.stringify(testData);
					headers['X-Auth-Signature'] = getSignature(headers, data);
				}

				let signature = headers['X-Auth-Signature'];
				if (signature) {
					this.setRequestHeader('X-Auth-Signature', signature, true);
				}

			} catch (err) {
				requestHistory[this.uniqid].error.push(err);
			}

			/** Обработка данных входящего запроса */
			const oldReady = this.onreadystatechange;
			this.onreadystatechange = function (e) {
				if(this.readyState == 4 && this.status == 200) {
					isTextResponse = this.responseType != "json";
					let response = isTextResponse ? this.responseText : this.response;
					requestHistory[this.uniqid].response = response;
					/** Заменна данных входящего запроса */
					if (isTextResponse) {
						isChange = false;
						let nowTime = Math.round(Date.now() / 1000);
						try {
							callsIdent = requestHistory[this.uniqid].calls;
							respond = JSON.parse(response);
							for (const call of respond.results) {
								if (call.ident == callsIdent['subscriptionGetInfo'] && (call.result.response.subscription?.status != 1 || !call.result.response.subscription)) {
									if (!call.result.response.subscription) {
										call.result.response.subscription = {
										}
									}
									callRes = call.result.response.subscription;
									/** Устанавливаем время последней подписки */
									// callRes.ctime = nowTime;
									/** Устанавливем какое-то время на +5 от подписки */
									// callRes.renewTime = nowTime;
									/** Устанавливем время окончания подписки на +7 от подписки */
									callRes.endTime = nowTime + 1001 * 24 * 60 * 60;
									/** Устанавливаем рандомный идетификатор подписки */
									// callRes.vkSubscriptionId = random(26981, 1726981);
									/** Статус подписки */
									callRes.status = 1;
									callRes.type = socials[sNetwork];
									// callRes.endLoginTime = 0;
									// callRes.mayRenew = false;
									isHackSubscribe = true;
								}
								/** Фикс экспедиций */
								if (call.ident == callsIdent['expeditionGet'] && isHackSubscribe) {
									expeditions = call.result.response;
									for (const n in expeditions) {
										exped = expeditions[n];
										if (exped.slotId == 6) {
											exped.status = 3;
											isChange = true;
										}
									}
								}
								/** Бесконечные карты предсказаний */
								if (call.ident == callsIdent['inventoryGet']) {
									consumable = call.result.response.consumable;
									consumable[81] = 999;
									isChange = true;
								}
								/** Потасовка */
								if (call.ident == callsIdent['brawl_getInfo']) {
									brawl = call.result.response;
									if (brawl) {
										brawl.boughtEndlessLivesToday = 1;
										isChange = true;
									}
								}
							}
						} catch(err) {
							console.log('responseERROR', err, response);
						}

						if (isChange) {
							Object.defineProperty(this, 'responseText', {
								writable: true
							});
							this.responseText = JSON.stringify(respond);
						}
					}
				}
				if (oldReady) {
					return oldReady.apply(this, arguments);
				}
			}
		}
		return original.send.call(this, data);
	};
	/** Возвращает название класса переданного объекта */
	function getClass(obj) {
		return {}.toString.call(obj).slice(8, -1);
	}
	/** Расчитывает сигнатуру запроса */
	this.getSignature = function(headers, data) {
		var signatureStr = [headers["X-Request-Id"], headers["X-Auth-Token"], headers["X-Auth-Session-Id"], data, 'LIBRARY-VERSION=1'].join(':');
		return md5(signatureStr);
	}
	/** Расчитывает HASH MD5 из строки */
	function md5(r){for(var a=(r,n,t,e,o,u)=>f(c(f(f(n,r),f(e,u)),o),t),n=(r,n,t,e,o,u,f)=>a(n&t|~n&e,r,n,o,u,f),t=(r,n,t,e,o,u,f)=>a(n&e|t&~e,r,n,o,u,f),e=(r,n,t,e,o,u,f)=>a(n^t^e,r,n,o,u,f),o=(r,n,t,e,o,u,f)=>a(t^(n|~e),r,n,o,u,f),f=function(r,n){var t=(65535&r)+(65535&n);return(r>>16)+(n>>16)+(t>>16)<<16|65535&t},c=(r,n)=>r<<n|r>>>32-n,u=Array(r.length>>2),h=0;h<u.length;h++)u[h]=0;for(h=0;h<8*r.length;h+=8)u[h>>5]|=(255&r.charCodeAt(h/8))<<h%32;len=8*r.length,u[len>>5]|=128<<len%32,u[14+(len+64>>>9<<4)]=len;var l=1732584193,i=-271733879,g=-1732584194,v=271733878;for(h=0;h<u.length;h+=16){var A=l,d=i,C=g,m=v;i=o(i=o(i=o(i=o(i=e(i=e(i=e(i=e(i=t(i=t(i=t(i=t(i=n(i=n(i=n(i=n(i,g=n(g,v=n(v,l=n(l,i,g,v,u[h+0],7,-680876936),i,g,u[h+1],12,-389564586),l,i,u[h+2],17,606105819),v,l,u[h+3],22,-1044525330),g=n(g,v=n(v,l=n(l,i,g,v,u[h+4],7,-176418897),i,g,u[h+5],12,1200080426),l,i,u[h+6],17,-1473231341),v,l,u[h+7],22,-45705983),g=n(g,v=n(v,l=n(l,i,g,v,u[h+8],7,1770035416),i,g,u[h+9],12,-1958414417),l,i,u[h+10],17,-42063),v,l,u[h+11],22,-1990404162),g=n(g,v=n(v,l=n(l,i,g,v,u[h+12],7,1804603682),i,g,u[h+13],12,-40341101),l,i,u[h+14],17,-1502002290),v,l,u[h+15],22,1236535329),g=t(g,v=t(v,l=t(l,i,g,v,u[h+1],5,-165796510),i,g,u[h+6],9,-1069501632),l,i,u[h+11],14,643717713),v,l,u[h+0],20,-373897302),g=t(g,v=t(v,l=t(l,i,g,v,u[h+5],5,-701558691),i,g,u[h+10],9,38016083),l,i,u[h+15],14,-660478335),v,l,u[h+4],20,-405537848),g=t(g,v=t(v,l=t(l,i,g,v,u[h+9],5,568446438),i,g,u[h+14],9,-1019803690),l,i,u[h+3],14,-187363961),v,l,u[h+8],20,1163531501),g=t(g,v=t(v,l=t(l,i,g,v,u[h+13],5,-1444681467),i,g,u[h+2],9,-51403784),l,i,u[h+7],14,1735328473),v,l,u[h+12],20,-1926607734),g=e(g,v=e(v,l=e(l,i,g,v,u[h+5],4,-378558),i,g,u[h+8],11,-2022574463),l,i,u[h+11],16,1839030562),v,l,u[h+14],23,-35309556),g=e(g,v=e(v,l=e(l,i,g,v,u[h+1],4,-1530992060),i,g,u[h+4],11,1272893353),l,i,u[h+7],16,-155497632),v,l,u[h+10],23,-1094730640),g=e(g,v=e(v,l=e(l,i,g,v,u[h+13],4,681279174),i,g,u[h+0],11,-358537222),l,i,u[h+3],16,-722521979),v,l,u[h+6],23,76029189),g=e(g,v=e(v,l=e(l,i,g,v,u[h+9],4,-640364487),i,g,u[h+12],11,-421815835),l,i,u[h+15],16,530742520),v,l,u[h+2],23,-995338651),g=o(g,v=o(v,l=o(l,i,g,v,u[h+0],6,-198630844),i,g,u[h+7],10,1126891415),l,i,u[h+14],15,-1416354905),v,l,u[h+5],21,-57434055),g=o(g,v=o(v,l=o(l,i,g,v,u[h+12],6,1700485571),i,g,u[h+3],10,-1894986606),l,i,u[h+10],15,-1051523),v,l,u[h+1],21,-2054922799),g=o(g,v=o(v,l=o(l,i,g,v,u[h+8],6,1873313359),i,g,u[h+15],10,-30611744),l,i,u[h+6],15,-1560198380),v,l,u[h+13],21,1309151649),g=o(g,v=o(v,l=o(l,i,g,v,u[h+4],6,-145523070),i,g,u[h+11],10,-1120210379),l,i,u[h+2],15,718787259),v,l,u[h+9],21,-343485551),l=f(l,A),i=f(i,d),g=f(g,C),v=f(v,m)}var y=Array(l,i,g,v),b="";for(h=0;h<32*y.length;h+=8)b+=String.fromCharCode(y[h>>5]>>>h%32&255);var S="0123456789abcdef",j="";for(h=0;h<b.length;h++)u=b.charCodeAt(h),j+=S.charAt(u>>>4&15)+S.charAt(15&u);return j}
	/** Скрипт для красивых диалоговых окошек */
	const popup = new(function () {

		this.popUp,
			this.downer,
			this.msgText,
			this.buttons = [];;

		function init() {
			addStyle();
			addBlocks();
		}

		const addStyle = () => {
			style = document.createElement('style');
			style.innerText = `
			.PopUp_ {
				position: absolute;
				min-width: 300px;
				max-width: 500px;
				max-height: 400px;
				background-color: #190e08e6;
				z-index: 10000;
				top: 169px;
				left: 345px;
				border: 3px #ce9767 solid;
				border-radius: 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				padding: 15px 12px;
			}

			.PopUp_back {
				position: absolute;
				background-color: #00000066;
				width: 100%;
				height: 100%;
				z-index: 9999;
				top: 0;
				left: 0;
			}

			.PopUp_blocks {
				width: 100%;
				height: 50%;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
			}
			
			.PopUp_blocks:last-child {
				margin-top: 25px;
			}

			.PopUp_button {
				background-color: #52A81C;
				border-radius: 5px;
				box-shadow: inset 0px -4px 10px, inset 0px 3px 2px #99fe20, 0px 0px 4px, 0px -3px 1px #d7b275, 0px 0px 0px 3px #ce9767;
				cursor: pointer;
				padding: 5px 18px 8px;
				margin: 10px 12px;
			}

			.PopUp_button:hover {
				filter: brightness(1.2);
			}

			.PopUp_text {
				font-size: 22px;
				font-family: sans-serif;
				font-weight: 600;
				font-stretch: condensed;
				letter-spacing: 1px;
				text-align: center;
			}

			.PopUp_buttonText {
				color: #E4FF4C;
				text-shadow: 0px 1px 2px black;
			}

			.PopUp_msgText {
				color: #FDE5B6;
				text-shadow: 0px 0px 2px;
			}
			`;
			document.head.appendChild(style);
		}

		const addBlocks = () => {
			this.back = document.createElement('div');
			this.back.classList.add('PopUp_back');
			this.back.style.display = 'none';
			document.body.append(this.back);

			this.popUp = document.createElement('div');
			this.popUp.classList.add('PopUp_');
			this.back.append(this.popUp);

			upper = document.createElement('div')
			upper.classList.add('PopUp_blocks');
			this.popUp.append(upper);

			this.downer = document.createElement('div')
			this.downer.classList.add('PopUp_blocks');
			this.popUp.append(this.downer);

			this.msgText = document.createElement('div');
			this.msgText.classList.add('PopUp_text', 'PopUp_msgText');
			upper.append(this.msgText);
		}

		this.show = function () {
			this.back.style.display = '';
			this.popUp.style.left = (window.innerWidth - this.popUp.offsetWidth) / 2 + 'px';
			this.popUp.style.top = (window.innerHeight - this.popUp.offsetHeight) / 3 + 'px';
		}

		this.hide = function () {
			this.back.style.display = 'none';
		}

		this.addButton = (text, func) => {
			button = document.createElement('div');
			button.classList.add('PopUp_button');
			this.downer.append(button);

			button.addEventListener('click', func);

			buttonText = document.createElement('div');
			buttonText.classList.add('PopUp_text', 'PopUp_buttonText');
			button.append(buttonText);

			buttonText.innerText = text;
			this.buttons.push(button);
		}

		this.clearButtons = () => {
			while (this.buttons.length) {
				this.buttons.pop().remove();
			}
		}

		this.setMsgText = (text) => {
			this.msgText.innerText = text;
		}

		this.confirm = async (msg, buttOpt) => {
			this.clearButtons();
			return new Promise((complete, failed) => {
				this.setMsgText(msg);
				if (!buttOpt) {
					buttOpt = [{
						msg: 'Ок',
						result: true
					}];
				}
				for (let butt of buttOpt) {
					this.addButton(butt.msg, () => {
						complete(butt.result);
						popup.hide();
					});
				}
				this.show();
			});
		}

		init();
	});
})();
