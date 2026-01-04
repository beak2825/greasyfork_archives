// ==UserScript==
// @name			Bestmoba_Helper
// @namespace		Bestmoba_Helper
// @version			1.15
// @description		Помощник в игре Хроники Хаоса
// @author			ZingerY
// @homepage		http://ilovemycomp.narod.ru/Bestmoba_Helper.user.js
// @icon			http://ilovemycomp.narod.ru/VaultBoyIco16.ico
// @icon64			http://ilovemycomp.narod.ru/VaultBoyIco64.png
// @encoding		utf-8
// @include			https://i-heroes-vk.nextersglobal.com/*
// @downloadURL https://update.greasyfork.org/scripts/420588/Bestmoba_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/420588/Bestmoba_Helper.meta.js
// ==/UserScript==

(function() {

	console.log('Start Helper');
	var self = this;
	var checkOn = false;
	var globHeaders = {};
	var headersBuffer = {};
	var lastHeaders = {};
	var original = {
		open: XMLHttpRequest.prototype.open,
		send: XMLHttpRequest.prototype.send,
		setRequestHeader: XMLHttpRequest.prototype.setRequestHeader
	};
	var decoder = new TextDecoder("utf-8");
	var buttons = [];
	var buttonsActive = false;
	var progress;
	// Переопределяем/проксируем метод создания Ajax запроса
	XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
		if (url == 'https://heroes-vk.nextersglobal.com/api/') {
			checkOn = true;
			// console.log(method, url);
		}
		return original.open.call(this, method, url, async, user, password);
	};
	// Переопределяем/проксируем метод задания заголовков для Ajax запроса
	XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
		if (checkOn) {
			headersBuffer[name] = value;
			globHeaders[name] = value;
		}
		return original.setRequestHeader.call(this, name, value);
	};
	// Переопределяем/проксируем метод отправки Ajax запроса
	XMLHttpRequest.prototype.send = function (data) {
		if (checkOn) {
			if (getClass(data) == "ArrayBuffer") {
				data = decoder.decode(data);
			}
			// console.log(headersBuffer, data);
			checkOn = false;
			lastHeaders = headersBuffer;

			if (lastHeaders["X-Request-Id"] > 3 && !buttonsActive && buttons.length) {
				buttonsActive = true;
				activateButtons();
				checkExpedition();
			}
			headersBuffer = {};

			var oldReady = this.onreadystatechange;
			this.onreadystatechange = function (e) {
				if(this.readyState == 4) {
					let responseText = this.responseText;
					Object.defineProperty(this, 'responseText', {writable: true});
					let ctime = Math.round(Date.now()/1000);
					let renewTime = ctime + 100 * 24 * 60 * 60;
					let endTime = ctime + 102 * 24 * 60 * 60;
					var seach = /{"ident":"subscriptionGetInfo","result":{"response":{.+?(}}}})/;
					var replace ='{"ident":"subscriptionGetInfo","result":{"response":{"subscription":{"level":1,"status":1,"type":1,"endTime":'+endTime+',"lastFarm":"20214","ctime":'+ctime+',"daysLeft":100,"mayRenew":false,"renewTime":'+renewTime+',"pendingCancel":0,"endLoginTime":0,"vkSubscriptionId":"726981"},"dailyReward":{"availableFarm":false,"currentReward":{"coin":{"14":"400"}},"notFarmedDays":0}}}}';
					// Фикс вальки
					responseText = responseText.replace(seach, replace);
					// Фикс экспедиции вальки
					responseText = responseText.replace(/("slotId":6.+?status":)0/, '$13');
					this.responseText = responseText;
					// console.log(responseText);
				}
				return oldReady.apply(this, arguments);
			}
		}
		return original.send.call(this, data);
	};

	createInterface();

	// Определяет название класса объекта
	function getClass(obj) {
		return {}.toString.call(obj).slice(8, -1);
	}

	// Возвращает глабальные заголовки
	this.getGlobHeaders = function() {
		return globHeaders;
	}

	// Создает интерфейс управления
	function createInterface() {
		let socialForm = document.querySelector('form.isSocial');
		let bodyInt = document.createElement('div');
		bodyInt.appendChild(createButton('Helper v' + GM_info.script.version, function() {
			if (confirm('Запустить скрипт?')) {
				startHelpHH();
			}
		}, 'Выполнение действий по заранее заданому списку'));
		bodyInt.appendChild(createButton('StatClan', function() {
			if (confirm('Запустить скрипт?')) {
				clanStatistic();
			}
		}, 'Выводит статистику клана в консоль браузера'));
		bodyInt.appendChild(createButton('ClanLog', function() {
			if (confirm('Запустить скрипт?')) {
				clanLog();
			}
		}, 'Выводит лог клана в консоль браузера'));
		bodyInt.appendChild(createButton('Expedition', function() {
			if (confirm('Запустить скрипт?')) {
				checkExpedition();
			}
		}, 'Собирает и отправляет экспедиции'));
		bodyInt.appendChild(createButton('GetMail', function() {
			if (confirm('Запустить скрипт?')) {
				mailGetAll();
			}
		}));
		bodyInt.appendChild(createButton('ArenaFindEnemies', function() {
			if (confirm('Запустить скрипт?')) {
				arenaFindEnemies();
			}
		}, 'Поиск слабых врагов на арене'));
		progress = createButton('Status', function() {
			console.log('Click');
		}, 'Статус');
		progress.style.display = 'none';
		bodyInt.appendChild(progress);
		socialForm.parentNode.insertBefore(bodyInt, socialForm);
	}
	// Создает кнопку для интерфейса
	function createButton(name, func, title) {
		let button = document.createElement('button');
		button.style.margin = '4px';
		button.style.padding = '5px 20px';
		button.style.cursor = "pointer";
		button.innerHTML = name;
		button.title = title || '';
		button.onclick = func;
		button.disabled = true;
		buttons.push(button);
		return button;
	}
	// Активация кнопок
	function activateButtons() {
		for(var b of buttons) {
			b.disabled = false;
		}
	}
	// Проверка и отправка экспедиций
	function checkExpedition() {
		var heroesInfo = '{"calls":[{"name":"heroGetAll","args":{},"ident":"body"}]}';
		var sendExped = '{"calls":[{"name":"expeditionSendHeroes","args":{"expeditionId":#number#,"heroes":[#heroes#]},"ident":"body"}]}';
		var checkExped = '{"calls":[{"name":"expeditionGet","args":{},"ident":"body"}]}';
		var endExped = '{"calls":[{"name":"expeditionFarm","args":{"expeditionId":#number#},"ident":"body"}]}';

		send(lastHeaders, checkExped, function(res) {
			let dataExpedition = JSON.parse(res);
			dataExpedition = dataExpedition?.results[0]?.result?.response;
			dataExped = {useHeroes:[], exped:[]};
			for (var n in dataExpedition) {
				var exped = dataExpedition[n];
				
				// console.log(exped, exped.status, dateNow, exped.endTime);
				var dateNow = (Date.now() / 1000);
				if (exped.status == 2 && exped.endTime != 0 && dateNow > exped.endTime) {
					send(lastHeaders, endExped.replace('#number#', exped.id), function(res, exped) {
						// console.log(exped.id,res);
					}, exped);
				} else {
					dataExped.useHeroes = dataExped.useHeroes.concat(exped.heroes);
				}
				if (exped.status == 1) {
					dataExped.exped.push({id: exped.id, power: exped.power});
				}
			}
			dataExped.exped = dataExped.exped.sort((a,b)=>(b.power - a.power));
			send(lastHeaders, heroesInfo, function(res, expData) {
				let dataHeroes = JSON.parse(res);
				dataHeroes = dataHeroes?.results[0]?.result?.response;
				let heroesArr = [];
				for (let n in dataHeroes) {
					let hero = dataHeroes[n];
					if (hero.xp > 0 && !expData.useHeroes.includes(hero.id)) {
						heroesArr.push({id: hero.id, power: hero.power})
					}
				}
				heroesArr = heroesArr.sort((a,b)=>(a.power - b.power));
				for (let i in expData.exped) {
					let exped = expData.exped[i];
					let heroesIds = selectionHeroes(heroesArr, exped.power);
					if (heroesIds && heroesIds.length > 4) {
						for (let q in heroesArr) {
							if (heroesIds.includes(heroesArr[q].id)) {
								delete heroesArr[q];
							}
						}
						let sendExp = sendExped.replace('#heroes#', heroesIds.join());
						sendExp = sendExp.replace('#number#', exped.id)
						send(lastHeaders, sendExp, function(res, exped) {
							// console.log(exped,res);
						}, sendExp);
					}
				}
				setProgress('Done', true);
			}, dataExped)
		}, null);
	}
	// Подбор героев для экспедиций
	function selectionHeroes(heroes, power) {
		let resultHeroers = [];
		let heroesIds = [];
		for (let q = 0; q < 5; q++) {
			for (let i in heroes) {
				let hero = heroes[i];
				let summ = summArray(resultHeroers, 'power');
				if (heroesIds.includes(hero.id)) {
					continue;
				}
				// let dif = (summ + hero.power) - power;
				let need = Math.round((power - summ) / (5 - resultHeroers.length));
				// if (hero.power > need && dif < need) {
				if (hero.power > need) {
					resultHeroers.push(hero);
					heroesIds.push(hero.id);
					break;
				}
			}
		}
		let summ = summArray(resultHeroers, 'power');
		if (summ < power) {
			return false;
		}
		return heroesIds;
	}
	// Суммирует силу героев в пачке
	function summArray(arr, elem) {
		return arr.reduce((e,i)=>e+i[elem],0);
	}
	// Получить всю почту
	function mailGetAll() {
		let getMailInfo = '{"calls":[{"name":"mailGetAll","args":{},"ident":"body"}]}';
		let getLetters = '{"calls":[{"name":"mailFarm","args":{"letterIds":[#letterIds#]},"ident":"body"}]}';

		send(lastHeaders, getMailInfo, function(res) {
			let dataMail = JSON.parse(res);
			let letters = dataMail?.results[0]?.result?.response?.letters;
			lettersIds = [];
			for (let l in letters) {
				letter = letters[l];
				lettersIds.push(~~letter.id);
			}
			sendGetLetters = getLetters.replace('#letterIds#', lettersIds.join())
			send(lastHeaders, sendGetLetters, function(res) {
				// console.log('mailGetAll',res);
			});
			setProgress('Done!', true);
		});
	}
	// Вывести всю клановую статистику в консоль браузера
	function clanStatistic() {
		var clanLog = '{"calls":[{"name":"clanGetLog","args":{},"ident":"body"}]}';
		var clanInfo = '{"calls":[{"name":"clanGetInfo","args":{},"ident":"body"}]}';
		var clanStat = '{"calls":[{"name":"clanGetWeeklyStat","args":{},"ident":"body"}]}';

		var dataClanInfo, dataClanStat, dataClanLog;

		send(lastHeaders, clanInfo, function(res) {
			dataClanInfo = JSON.parse(res);
			dataClanInfo = dataClanInfo?.results[0]?.result?.response;
			send(lastHeaders, clanStat, function(res) {
				dataClanStat = JSON.parse(res);
				dataClanStat = dataClanStat?.results[0]?.result?.response;
				send(lastHeaders, clanLog, function(res) {
					dataClanLog = JSON.parse(res);
					dataClanLog = dataClanLog?.results[0]?.result?.response;
					showInfo();
				}, null);
			}, null);
		}, null);

		function showInfo() {
			var membersStat = {};
			for (let i = 0; i < dataClanStat.stat.length; i++) {
				membersStat[dataClanStat.stat[i].id] = dataClanStat.stat[i];
			}

			var joinStat = {};
			historyLog = dataClanLog.history;
			for (let j in historyLog) {
				his = historyLog[j];
				if (his.event == 'join') {
					joinStat[his.userId] = his.ctime;
				}
			}

			var infoArr = [];

			var members = dataClanInfo.clan.members;
			for(let n in members) {
				var member = [
					n,
					members[n].name,
					members[n].level,
					dataClanInfo.clan.warriors.includes(+n) ? 1 : 0,
					(new Date(members[n].lastLoginTime*1000)).toLocaleString().replace(',', ''),
					joinStat[n] ? (new Date(joinStat[n]*1000)).toLocaleString().replace(',', '') : '',
					membersStat[n].activity.reverse().join('\t'),
					membersStat[n].adventureStat.reverse().join('\t'),
					membersStat[n].clanGifts.reverse().join('\t'),
					membersStat[n].clanWarStat.reverse().join('\t'),
					membersStat[n].dungeonActivity.reverse().join('\t'),
				];
				infoArr.push(member);
			}
			var info = infoArr.sort((a, b) => (b[2] - a[2])).map((e) => e.join('\t')).join('\n');
			console.log(info);
			setProgress('Done!', true);
		}
	}
	// Вывести всю клановую статистику в консоль браузера
	function clanLog() {
		var clanLog = '{"calls":[{"name":"clanGetLog","args":{},"ident":"body"}]}';
		send(lastHeaders, clanLog, function(res) {
			dataClanLog = JSON.parse(res);
			dataClanLog = dataClanLog?.results[0]?.result?.response;
			historyLog = dataClanLog.history;
			usersLog = dataClanLog.users;
			dataLog = [];
			for (let i in usersLog) {
				user = usersLog[i];
				id = user.id;
				user['actions'] = [];
				for (let j in historyLog) {
					his = historyLog[j];
					if ((id == his.userId && his.event != 'kick' ) || id == his.details?.userId) {
						user['actions'].push({event: his.event, time: his.ctime, date: (new Date(his.ctime*1000)).toLocaleString()});
					}
				}
				user.actions = user.actions.sort((a, b)=>(a.time - b.time));
				dataLog.push({id: user.id, name: user.name, actions: user.actions});
			}
			let result = '';
			for(let user of dataLog) {
				result += user.name + " (" + user.id + "): \n";
				for (let act of user.actions) {
					result += "\t" + act.event + " " + act.date + "\n";
				}
			}
			console.log(result);
			setProgress('Done!', true);
		});
	}
	// Поиск слабых врагов на арене
	function arenaFindEnemies() {
		let getArenaInfo = '{"calls":[{"name":"teamGetAll","args":{},"ident":"teamGetAll"},{"name":"arenaGetAll","args":{},"ident":"arenaGetAll"}]}';

		send(lastHeaders, getArenaInfo, function(res) {
			let data = JSON.parse(res);
			let arenaTeam = data?.results[0]?.result?.response?.arena;
			let arenaPower = data?.results[1]?.result?.response?.arenaPower;
			if (!arenaTeam || !arenaPower) {
				return;
			}

			var heroesTeam = arenaTeam.slice(0, 5).join();
			var petTeam = arenaTeam[5];
			var myPower = arenaPower - arenaPower * 0.2;
			findEnemies(heroesTeam, petTeam, myPower, 0);
		});
	}
	// Поиск врагов на арене
	function findEnemies(heroesTeam, petTeam, myPower, counter) {
		let getArenaEnemies = '{"calls":[{"name":"arenaFindEnemies","args":{},"ident":"body"}]}';
		let getArenaAttack = '{"calls":[{"name":"arenaAttack","args":{"userId":#userId#,"heroes":[#heroesTeam#],"pet":#petTeam#},"ident":"body"}]}';
		let minPower = myPower * 0.3;
		send(lastHeaders, getArenaEnemies, function(res) {
			// console.log('Find',counter);
			let data = JSON.parse(res);
			let enemies = data?.results[0]?.result?.response;
			for (let e of enemies) {
				if (!(e.power < minPower) && (e.power > myPower || e.heroes.length < 6)) {
					continue;
				}
				let arenaAttack = getArenaAttack.replace('#userId#', e.userId);
				arenaAttack = arenaAttack.replace('#heroesTeam#', heroesTeam);
				arenaAttack = arenaAttack.replace('#petTeam#', petTeam);
				send(lastHeaders, arenaAttack, function(res, counter) {
					let data = JSON.parse(res);
					let error = data?.error;
					if (!error) {
						alert('Done ' + counter);
					} else {
						alert('Error: ' + error.description);
						// console.log(error);
					}
					// console.log(res);
				}, counter);
				return;
			}
			// console.log('Find',counter);
			if (counter < 10) {
				setTimeout(findEnemies, 200, heroesTeam, petTeam, myPower, ++counter);
				return;
			}
			alert('Not find enemies');
			// console.log('Not find enemies');
		});
	}
	function setProgress(text, hide) {
		hide = hide || false;
		progress.innerHTML = text;
		progress.style.display = '';
		if (hide) {
			setTimeout(function() {
				progress.style.display = 'none';
			}, 3000);
		}
	}
	// Код для расчета сигнатуры запроса (подписи)
	var cript={cFd:function(r,t){return(r>>>1|t>>>1)<<1|1&r|1&t},dFd:function(r,t){return(r>>>1^t>>>1)<<1|1&r^1&t},uKc:function(r,t){return(r>>>1&t>>>1)<<1|1&r&t&1},SYa:function(r,t){var c=(65535&r)+(65535&t);return(r>>16)+(t>>16)+(c>>16)<<16|65535&c},iA:function(r){for(var t="",c=0;c<r.length;){var i=r[c];++c,t+="0123456789abcdef".charAt(i>>4&15)+"0123456789abcdef".charAt(15&i),t+="0123456789abcdef".charAt(i>>12&15)+"0123456789abcdef".charAt(i>>8&15),t+="0123456789abcdef".charAt(i>>20&15)+"0123456789abcdef".charAt(i>>16&15),t+="0123456789abcdef".charAt(i>>28&15)+"0123456789abcdef".charAt(i>>24&15)}return t},bXg:function(r,t){return r<<t|r>>>32-t},uMc:function(r,t,c,i,p,n){return cript.SYa(cript.bXg(cript.SYa(cript.SYa(t,r),cript.SYa(i,n)),p),c)},iw:function(r,t,c,i,p,n,a){return cript.uMc(cript.cFd(cript.uKc(t,c),cript.uKc(~t,i)),r,t,p,n,a)},o3:function(r,t,c,i,p,n,a){return cript.uMc(cript.cFd(cript.uKc(t,i),cript.uKc(c,~i)),r,t,p,n,a)},x3:function(r,t,c,i,p,n,a){return cript.uMc(cript.dFd(cript.dFd(t,c),i),r,t,p,n,a)},Vp:function(r,t,c,i,p,n,a){return cript.uMc(cript.dFd(c,cript.cFd(t,~i)),r,t,p,n,a)},tNe:function(r){for(var t=1732584193,c=-271733879,i=-1732584194,p=271733878,n=0;n<r.length;){var a=t,u=c,e=i,o=p,t=cript.iw(t,c,i,p,r[n],7,-680876936),p=cript.iw(p,t,c,i,r[n+1],12,-389564586),i=cript.iw(i,p,t,c,r[n+2],17,606105819),c=cript.iw(c,i,p,t,r[n+3],22,-1044525330);t=cript.iw(t,c,i,p,r[n+4],7,-176418897),p=cript.iw(p,t,c,i,r[n+5],12,1200080426),i=cript.iw(i,p,t,c,r[n+6],17,-1473231341),c=cript.iw(c,i,p,t,r[n+7],22,-45705983),t=cript.iw(t,c,i,p,r[n+8],7,1770035416),p=cript.iw(p,t,c,i,r[n+9],12,-1958414417),i=cript.iw(i,p,t,c,r[n+10],17,-42063),c=cript.iw(c,i,p,t,r[n+11],22,-1990404162),t=cript.iw(t,c,i,p,r[n+12],7,1804603682),p=cript.iw(p,t,c,i,r[n+13],12,-40341101),i=cript.iw(i,p,t,c,r[n+14],17,-1502002290),c=cript.iw(c,i,p,t,r[n+15],22,1236535329),t=cript.o3(t,c,i,p,r[n+1],5,-165796510),p=cript.o3(p,t,c,i,r[n+6],9,-1069501632),i=cript.o3(i,p,t,c,r[n+11],14,643717713),c=cript.o3(c,i,p,t,r[n],20,-373897302),t=cript.o3(t,c,i,p,r[n+5],5,-701558691),p=cript.o3(p,t,c,i,r[n+10],9,38016083),i=cript.o3(i,p,t,c,r[n+15],14,-660478335),c=cript.o3(c,i,p,t,r[n+4],20,-405537848),t=cript.o3(t,c,i,p,r[n+9],5,568446438),p=cript.o3(p,t,c,i,r[n+14],9,-1019803690),i=cript.o3(i,p,t,c,r[n+3],14,-187363961),c=cript.o3(c,i,p,t,r[n+8],20,1163531501),t=cript.o3(t,c,i,p,r[n+13],5,-1444681467),p=cript.o3(p,t,c,i,r[n+2],9,-51403784),i=cript.o3(i,p,t,c,r[n+7],14,1735328473),c=cript.o3(c,i,p,t,r[n+12],20,-1926607734),t=cript.x3(t,c,i,p,r[n+5],4,-378558),p=cript.x3(p,t,c,i,r[n+8],11,-2022574463),i=cript.x3(i,p,t,c,r[n+11],16,1839030562),c=cript.x3(c,i,p,t,r[n+14],23,-35309556),t=cript.x3(t,c,i,p,r[n+1],4,-1530992060),p=cript.x3(p,t,c,i,r[n+4],11,1272893353),i=cript.x3(i,p,t,c,r[n+7],16,-155497632),c=cript.x3(c,i,p,t,r[n+10],23,-1094730640),t=cript.x3(t,c,i,p,r[n+13],4,681279174),p=cript.x3(p,t,c,i,r[n],11,-358537222),i=cript.x3(i,p,t,c,r[n+3],16,-722521979),c=cript.x3(c,i,p,t,r[n+6],23,76029189),t=cript.x3(t,c,i,p,r[n+9],4,-640364487),p=cript.x3(p,t,c,i,r[n+12],11,-421815835),i=cript.x3(i,p,t,c,r[n+15],16,530742520),c=cript.x3(c,i,p,t,r[n+2],23,-995338651),t=cript.Vp(t,c,i,p,r[n],6,-198630844),p=cript.Vp(p,t,c,i,r[n+7],10,1126891415),i=cript.Vp(i,p,t,c,r[n+14],15,-1416354905),c=cript.Vp(c,i,p,t,r[n+5],21,-57434055),t=cript.Vp(t,c,i,p,r[n+12],6,1700485571),p=cript.Vp(p,t,c,i,r[n+3],10,-1894986606),i=cript.Vp(i,p,t,c,r[n+10],15,-1051523),c=cript.Vp(c,i,p,t,r[n+1],21,-2054922799),t=cript.Vp(t,c,i,p,r[n+8],6,1873313359),p=cript.Vp(p,t,c,i,r[n+15],10,-30611744),i=cript.Vp(i,p,t,c,r[n+6],15,-1560198380),c=cript.Vp(c,i,p,t,r[n+13],21,1309151649),t=cript.Vp(t,c,i,p,r[n+4],6,-145523070),p=cript.Vp(p,t,c,i,r[n+11],10,-1120210379),i=cript.Vp(i,p,t,c,r[n+2],15,718787259),c=cript.Vp(c,i,p,t,r[n+9],21,-343485551),t=cript.SYa(t,a),c=cript.SYa(c,u),i=cript.SYa(i,e),p=cript.SYa(p,o),n+=16}return[t,c,i,p]},s7f:function(r){for(var t=1+(r.length+8>>6),c=[],i=0,p=16*t;i<p;){c[i++]=0}for(i=0;i<r.length;)c[i>>2]|=r[i]<<(((r.length<<3)+i&3)<<3),++i;return c[i>>2]|=128<<(8*r.length+i)%4*8,r=8*r.length,c[t=16*t-2]=255&r,c[t]|=(r>>>8&255)<<8,c[t]|=(r>>>16&255)<<16,c[t]|=(r>>>24&255)<<24,c},PMb:function(r){r=cript.tNe(cript.s7f(r));var t=new Dd(new ArrayBuffer(16)),c=0;return t.b[c++]=255&r[0],t.b[c++]=r[0]>>8&255,t.b[c++]=r[0]>>16&255,t.b[c++]=r[0]>>>24&255,t.b[c++]=255&r[1],t.b[c++]=r[1]>>8&255,t.b[c++]=r[1]>>16&255,t.b[c++]=r[1]>>>24&255,t.b[c++]=255&r[2],t.b[c++]=r[2]>>8&255,t.b[c++]=r[2]>>16&255,t.b[c++]=r[2]>>>24&255,t.b[c++]=255&r[3],t.b[c++]=r[3]>>8&255,t.b[c++]=r[3]>>16&255,t.b[15]=r[3]>>>24&255,t}};
	function Dd(r){this.length=r.byteLength,this.b=new Uint8Array(r),(this.b.Wla=r).uHg=this,r.Ej=this.b};
	var anf=function(r){r=cript.PMb(r);for(var t="",c=0;c<16;){var i=c++,i=r.b[i];t+="0123456789abcdef".charAt(i>>4&15)+"0123456789abcdef".charAt(15&i)}return t};
	// Отправка запроса
	function send(headers, json, callback, pr) {
		var signatureStr = [headers["X-Request-Id"], headers["X-Auth-Token"], headers["X-Auth-Session-Id"], json, 'LIBRARY-VERSION=1'].join(':');
		var enc = new TextEncoder("utf-8");
		var arrEncode = enc.encode(signatureStr)
		headers["X-Auth-Signature"] = anf(arrEncode);

		var xhr = new XMLHttpRequest;
		xhr.open('POST', 'https://heroes-vk.nextersglobal.com/api/', true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				setTimeout(callback, 200, xhr.response, pr);
			}
		};
		xhr.responseType = 'ajax';
		for(let nameHeader in headers) {
			let head = headers[nameHeader];
			xhr.setRequestHeader(nameHeader, head);
		}
		xhr.send(json);
	}
	// Отправка запроса доступная через консоль
	this.SendRequest = function(json, callback, pr) {
		send(lastHeaders, json, callback, pr);
	}
	// Выполнение действий по списку
	function startHelpHH() {
		// До какого дня вип
		var dayVip = 0;
		var dayM = (new Date()).getDate();
		var day = dayM % 5;
		// Порядок запросов
		var arrAction = [14, 13, 12, 6, 7, 8, 9, 10, 11, 5, 4, 1, 2, 1, 3, 1, 2, 1, 3, 1, 3, 1, 2, 1, 3, 1, 3, 1, 2, 1, 3, 1, 3, 1, 2, 1, 3, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31, 33, 34, 35, 36, 37, 38, 39, 42, 28, 46, 47, 48];
		var heartsFriends = '[]';

		var move = {
			// 1 Башня скип этажа
			1: '{"calls":[{"name":"towerSkipFloor","args":{},"ident":"body"}]}',
			// 2 Башня переключение на следющий этаж
			2: '{"calls":[{"name":"towerNextFloor","args":{},"ident":"body"}]}',
			// 3 Открытие сундука и переключение на следующий этаж
			3: {1: '{"calls":[{"name":"towerOpenChest","args":{"num":0},"ident":"body"}]}', 2: '{"calls":[{"name":"towerNextFloor","args":{},"ident":"body"}]}', 'length': 2},
			// 4 Героический сундук
			4: '{"calls":[{"name":"chestBuy","args":{"chest":"town","free":true,"pack":false},"ident":"body"}]}',
			// 5 Ключ от валькирий
			5: '{"calls":[{"name":"subscriptionFarm","args":{},"ident":"body"},{"name":"zeppelinGiftFarm","args":{},"ident":"zeppelinGiftFarm"}]}',
			// 6-11 Сундуки в Запределье
			6: '{"calls":[{"name":"bossRaid","args":{"bossId":12},"ident":"body"},{"name":"bossGetAll","args":{},"ident":"bossGetAll"}]}',
			7: '{"calls":[{"name":"bossOpenChest","args":{"bossId":12,"amount":1,"starmoney":0},"ident":"body"}]}',
			8: '{"calls":[{"name":"bossRaid","args":{"bossId":11},"ident":"body"},{"name":"bossGetAll","args":{},"ident":"bossGetAll"}]}',
			9: '{"calls":[{"name":"bossOpenChest","args":{"bossId":11,"amount":1,"starmoney":0},"ident":"body"}]}',
			10: '{"calls":[{"name":"bossRaid","args":{"bossId":10},"ident":"body"},{"name":"bossGetAll","args":{},"ident":"bossGetAll"}]}',
			11: '{"calls":[{"name":"bossOpenChest","args":{"bossId":10,"amount":1,"starmoney":0},"ident":"body"}]}',
			// 12 Отправка сердечек
			12: '{"calls":[{"name":"friendsSendDailyGift","args":{"ids":' + heartsFriends + ',"notifiedUserIds":[]},"ident":"body"}]}',
			// 13 Ежедневная награда
			13: '{"calls":[{"name":"dailyBonusFarm","args":{"vip":' + ((day == 2 || day == 4) || dayM > dayVip ? 0 : 1) + '},"ident":"body"}]}',
			// 14 Ежедневные камни облика
			14: '{"calls":[{"name":"offerFarmReward","args":{"offerId":127},"ident":"body"}]}',
			// 15 Квест на отправку сердечек
			15: '{"calls":[{"name":"questFarm","args":{"questId":10016},"ident":"body"}]}',
			// 16 Квест на открытие сундука
			16: '{"calls":[{"name":"questFarm","args":{"questId":10007},"ident":"body"}]}',
			// 17 Квест на сундуки в запределье
			17: '{"calls":[{"name":"questFarm","args":{"questId":10020},"ident":"body"}]}',
			// 18 Квест на сундуки в башне
			18: '{"calls":[{"name":"questFarm","args":{"questId":10019},"ident":"body"}]}',
			// 19 Квест на халявную энергию
			19: '{"calls":[{"name":"questFarm","args":{"questId":10037},"ident":"body"}]}',
			// 20 Квест на титанит и карты 1
			20: '{"calls":[{"name":"questFarm","args":{"questId":10033},"ident":"body"}]}',
			// 21 Квест на карты предсказаний 2
			21: '{"calls":[{"name":"questFarm","args":{"questId":10034},"ident":"body"}]}',
			// 22 Квест на карты предсказаний 3
			22: '{"calls":[{"name":"questFarm","args":{"questId":10035},"ident":"body"}]}',
			// 23 Квест за титанит 1
			23: '{"calls":[{"name":"questFarm","args":{"questId":10021},"ident":"body"}]}',
			// 24 Квест за титанит 2
			24: '{"calls":[{"name":"questFarm","args":{"questId":10022},"ident":"body"}]}',
			// 25 Рейд на души Астарота 1
			25: '{"calls":[{"name":"missionRaid","args":{"id":20,"times":3},"ident":"body"}]}',
			// 26 Рейд на души Астарота 2
			26: '{"calls":[{"name":"missionRaid","args":{"id":65,"times":3},"ident":"body"}]}',
			// 27 Рейд на души Астарота 3
			27: '{"calls":[{"name":"missionRaid","args":{"id":91,"times":3},"ident":"body"}]}',
			// 28 Квест на 3 героические мисии
			28: '{"calls":[{"name":"questFarm","args":{"questId":10003},"ident":"body"}]}',
			// 29 Квест на 10 миссий
			29: '{"calls":[{"name":"questFarm","args":{"questId":10002},"ident":"body"}]}',
			// 30 Обмен изумрудов
			30: '{"calls":[{"name":"refillableAlchemyUse","args":{"multi":false},"ident":"body"}]}',
			// 31 Квест на обмен изумрудов
			31: '{"calls":[{"name":"questFarm","args":{"questId":10006},"ident":"body"}]}',
			// 32 Рейд на души Селесты 1
			32: '{"calls":[{"name":"missionRaid","args":{"id":193,"times":3},"ident":"body"}]}',
			// 33 Открыть яйцо питомца
			33: '{"calls":[{"name":"pet_chestOpen","args":{"amount":3,"paid":false},"ident":"body"}]}',
			// 34 Квест на открытие яйца питомца
			34: '{"calls":[{"name":"questFarm","args":{"questId":10044},"ident":"body"}]}',
			// 35 Открыть сферу артефактов титанов
			35: '{"calls":[{"name":"titanArtifactChestOpen","args":{"amount":1,"free":true},"ident":"body"}]}',
			// 36 Квест на открытие сферы артефактов титанов
			36: '{"calls":[{"name":"questFarm","args":{"questId":10029},"ident":"body"}]}',
			// 37 Улучшить дар стихий Галахарду
			37: '{"calls":[{"name":"heroTitanGiftLevelUp","args":{"heroId":2},"ident":"body"}]}',
			// 38 Сбросить дар стихий у Галахарда
			38: '{"calls":[{"name":"heroTitanGiftDrop","args":{"heroId":2},"ident":"body"}]}',
			// 39 Квест на улучшение дара стихий
			39: '{"calls":[{"name":"questFarm","args":{"questId":10023},"ident":"body"}]}',
			// 40 Рейд на души Селесты 2
			40: '{"calls":[{"name":"missionRaid","args":{"id":205,"times":3},"ident":"body"}]}',
			// 41 Рейд на души Селесты 3
			41: '{"calls":[{"name":"missionRaid","args":{"id":209,"times":3},"ident":"body"}]}',
			// 42 Квест на карты предсказаний 4
			42: '{"calls":[{"name":"questFarm","args":{"questId":10036},"ident":"body"}]}',
			// 43 Рейд на души Астрид и Лукас 1
			43: '{"calls":[{"name":"missionRaid","args":{"id":198,"times":3},"ident":"body"}]}',
			// 44 Рейд на души Астрид и Лукас 2
			44: '{"calls":[{"name":"missionRaid","args":{"id":203,"times":3},"ident":"body"}]}',
			// 45 Рейд на души Астрид и Лукас 3
			45: '{"calls":[{"name":"missionRaid","args":{"id":204,"times":3},"ident":"body"}]}',
			// 46 Квест на отправку экспедиций 1
			46: '{"calls":[{"name":"questFarm","args":{"questId":10025},"ident":"body"}]}',
			// 47 Квест на отправку экспедиций 2
			47: '{"calls":[{"name":"questFarm","args":{"questId":10026},"ident":"body"}]}',
			// 48 Квест на 150 очков активности
			48: '{"calls":[{"name":"questFarm","args":{"questId":10047},"ident":"body"}]}',
			// 49 Обмен черепов на деньги в башне
			49: '{"calls":[{"name":"tower_farmSkullReward","args":{},"ident":"body"}]}',
			// 50 Переход к следующему сундуку и его открытие
			50: {1: '{"calls":[{"name":"towerNextChest","args":{},"ident":"body"}]}', 2: '{"calls":[{"name":"towerOpenChest","args":{"num":2},"ident":"body"}]}', 'length': 2},
			// 51 Получение награды за башню
			51: '{"calls":[{"name":"tower_farmPointRewards","args":{"points":[200,3000,10000,15000,20000,25000,35000,45000,60000]},"ident":"body"}]}',
		};
		// Подготовка заголовков
		var headers = {
			"Content-Type":"application/json; charset=UTF-8",
			"X-Request-Id":globHeaders["X-Request-Id"], // *
			"X-Auth-Network-Ident":globHeaders["X-Auth-Network-Ident"],
			"X-Auth-Application-Id":globHeaders["X-Auth-Application-Id"],
			"X-Auth-Session-Id":globHeaders["X-Auth-Session-Id"], // *
			"X-Auth-User-Id":globHeaders["X-Auth-User-Id"],
			"X-Auth-Player-Id":globHeaders["X-Auth-Player-Id"], // *
			"X-Auth-Session-Key":"",
			"X-Env-Library-Version":"1",
			"X-Requested-With":"XMLHttpRequest",
			"X-Server-Time":"0",
			"X-Auth-Signature":"24efb1d70be114d22f089c65aaef47b8",
			"X-Auth-Token":globHeaders["X-Auth-Token"]
		};

		var stop = false;
		start(0, false);
		// Запуск выполнения действий по списку
		function start(num,a) {
			a = a || false;
			setProgress(Math.floor(num/arrAction.length * 100)+ '%');
			if (!(num in arrAction) || stop) {
				setProgress('Done!', true);
				alert('Completed');
				return;
			}
			let json = move[arrAction[num]];
			if (a) {
				json = json[a];
			}
			headers["X-Request-Id"] = +headers["X-Request-Id"] + 1;
			send(headers, json, function(res, pr) {
				if (res['error']) {
					console.log(pr.num, res['error']);
				}
				if ((arrAction[pr.num + 1] == 3 || arrAction[pr.num + 1] == 50) && pr.a != 1) {
					start(++pr.num, 1);
				} else if ((arrAction[pr.num] == 3 || arrAction[pr.num] == 50) && pr.a == 1) {
					start(pr.num, 2);
				} else {
					start(++pr.num, false);
				}

			}, {num: num,a: a});
		}
	}
})();