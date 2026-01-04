// ==UserScript==
// @name		Weibo Huati Check-in
// @description	超级话题集中签到
// @namespace	https://greasyfork.org/users/10290
// @version		0.4.2018053114
// @author		xyau
// @match		http*://*.weibo.com/*
// @match		http*://weibo.com/*
// @icon		https://n.sinaimg.cn/photo/5b5e52aa/20160628/supertopic_top_area_big_icon_default.png
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// @connect		m.weibo.cn
// @connect		login.sina.com.cn
// @connect		passport.weibo.cn
// @connect		weibo.com
// @downloadURL https://update.greasyfork.org/scripts/32143/Weibo%20Huati%20Check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/32143/Weibo%20Huati%20Check-in.meta.js
// ==/UserScript==

window.addEventListener('unload', () => console.groupEnd());
window.addEventListener('load', () => {
	try {
		if ($CONFIG && '1' !== $CONFIG.islogin) {
			console.warn('尚未登录微博');
			return;
		}
		/**
			 * @const	{object}	DEFAULT_CONFIG			默认设置
			 * @const	{boolean}	DEFAULT_CONFIG.autoCheckin	自动签到
			 * @const	{string}	DEFAULT_CONFIG.checkinMode	签到模式
			 * @const	{boolean}	DEFAULT_CONFIG.checkNormal	普话签到
			 * @const	{boolean}	DEFAULT_CONFIG.autoCheckState	自动查询状态
			 * @const	{boolean}	DEFAULT_CONFIG.openDetail	展开详情
			 * @const	{int}		DEFAULT_CONFIG.maxHeight	详情限高(px)
			 * @const	{int}		DEFAULT_CONFIG.timeout		操作超时(ms)
			 * @const	{int}		DEFAULT_CONFIG.retry		重试次数
			 * @const	{int}		DEFAULT_CONFIG.delay		操作延时(ms)
			 */
		const DEFAULT_CONFIG = Object.freeze({
			autoCheckin: true,
			checkinMode: 'followList',
			checkNormal: true,
			autoCheckState: false,
			openDetail: true,
			maxHeight: 360,
			timeout: 5000,
			retry: 5,
			delay: 0,
		}),

			  /**
				 * @const	{object}	USER		当前用户
				 * @const	{string}	USER.UID	用户ID
				 * @const	{string}	USER.NICK	用户昵称
				 */
			  USER = Object.freeze({
				  UID: $CONFIG.uid,
				  NICK: $CONFIG.nick,
			  });
		/* @global	{string}	记录名称 */
		var logName, checkinInfo;//, configForm;

		/**
			 * @global	{object}	log		签到记录
			 * @global	{object[]}	log.已签	已签话题列表
			 * @global	{object[]}	log.待签	待签话题列表
			 * @global	{object}	log.异常	签到异常列表
			 */
		let	log = {},

			/* @return	{string}	当前东八区日期 */
			getDate = () => new Date(new Date().getTime() + 288e5).toJSON().substr(0, 10).replace(/-0?/g, '/'),

			/* @global	{Task|null}	currentTask 当前 xhr 任务 */
			currentTask = null,

			/**
				 * 任务构造，初始化通用 xhr 参数
				 * @constructor
				 * @param	{string}	name			任务名称
				 * @param	{object}	options			附加 xhr 参数
				 * @param	{function}	load			成功加载函数
				 * @param	{function}	retry			重试函数
				 * @param	{function}	[retryButton=]	重试按钮函数
				 */
			Task = this.Task || function (name, options, load, retry, retryButton) {
				this.name = name;
				this.onerror = function(errorType='timeout') {
					initLog(name, 0);
					log[name] += 1;

					if (errorType != 'timeout') {
						console.error(`${name}异常`);
						console.info(this);
					}

					if (log[name] < config.retry + 1) {
						setStatus(name + (errorType === 'timeout' ? `超过${config.timeout / 1e3}秒` : '异常') + `，第${log[name]}次重试…`);
						retry();
					} else {
						setStatus(`${name}超时/异常${log[name]}次，停止自动重试`);

						if (retryButton)
							retryButton();
						else
							clearTask();
					}
				};
				this.xhrConfig = {
					synchoronous: false,
					timeout: config.timeout,
					onloadstart: () => {
						currentTask = this;

						if (!log.hasOwnProperty(name))
							setStatus(`${name}…`);
						if (retryButton) {
							/* 跳过按钮 */
							let skipHuati = document.createElement('a');
							skipHuati.classList.add('S_ficon');
							skipHuati.onclick = () => {
								this.xhr.abort();
								retryButton();
								skipHuati.remove();
							};
							skipHuati.innerText = '[跳过]';
							checkinInfo.querySelector('.status').appendChild(skipHuati);
						}

					},
					onload: (xhr) => {
						if (xhr.finalUrl.includes('login')) {
							xhr.timeout = 0;
							/* 登录跳转 */
							let loginJump = GM_xmlhttpRequest({
								method: 'GET',
								synchronous: false,
								timeout: config.timeout,
								url: /url=&#39;([^']+)&#39;/.exec(xhr.responseText)[1],
								onloadstart: () => this.xhr = loginJump,
								onload: (xhr) => this.load(xhr),
								ontimeout: xhr.ontimeout,
							});
						}
						else
							this.load(xhr);
					},
					ontimeout: () => this.onerror(),
				};

				Object.assign(this.xhrConfig, options);

				this.load = (xhr) => setTimeout(load(xhr), config.delay);
				this.xhr = GM_xmlhttpRequest(this.xhrConfig);
			},

			clearTask = function() {
				currentTask = null;
				document.querySelector('.checkin .close').title = '关闭';
			},

			initLog = function(key, initialValue) {
				if (!log.hasOwnProperty(key))
					log[key] = initialValue;
			},

			/**
				 * see DEFAULT_CONFIG
				 * @global	{object}	config		脚本设置
				 * @global	{object}	lastCheckin	上次签到记录
				 * @global	{array}		whitelist	话题白名单
				 */
			config = Object.assign(Object.assign({},DEFAULT_CONFIG), JSON.parse(GM_getValue(`config${USER.UID}`, '{}'))),
			lastCheckin = JSON.parse(GM_getValue(`lastCheckin${USER.UID}`, '{}')),
			whitelist = JSON.parse(GM_getValue(`whitelist${USER.UID}`, '[]')),

			initCheckinBtn = function() {
				if (config.autoCheckState && logName === '微博超话签到')
					checkState();
				if (config.openDetail && document.querySelector('.checkin .detail'))
					document.querySelector('.checkin .done').parentNode.setAttribute('open', '');
				checkinBtn.style = 'cursor: pointer';
				Array.from(checkinBtn.querySelectorAll('em')).forEach((em) => {em.removeAttribute('style');});
				checkinBtn.querySelector('em:last-child').innerText = '超话签到';
				checkinBtn.title = '左击开始签到/右击配置脚本';
				if (logName)
					console.groupEnd();
				logName = document.querySelector('.checkin.config') ? '微博超话签到设置' : null;
			},

			/* @param	{string}	operationName	操作名称 */
			alterCheckinBtn = function(operationName) {
				checkinBtn.style.pointerEvents = 'none';
				Array.from(checkinBtn.querySelectorAll('em')).forEach((em) => {em.style.color = '#fa7d3c';});
				checkinBtn.querySelector('em:last-child').innerText = `${operationName}中…`;
				document.querySelector('.checkin .close').title = '中止';
				logName = '微博超话签到' + (operationName !== '签到' ? operationName : '');
				if (!logName.includes('查询') || operationName !== '设置')
					console.group(logName);
			},

			/* @param	{boolean}	auto	自动开始*/
			huatiCheckin = function(auto=true) {
				const date = getDate();

				/**
					 * 获取关注话题列表
					 * @param	{object[]}	[huatiList=[]]		关注话题列表
					 * @param	{string}	huatiList[].name	名称
					 * @param	{string}	huatiList[].hash	编号
					 * @param	{int|null}	huatiList[].level	超话等级
					 * @param	{boolean}	huatiList[].checked	超话已签
					 * @param	{object}	[since_id='']		列表起始
					 * @param	{string}	[type='super']		超话或普话, 'super'/'normal'
					 */
				let getFollowList = function(huatiList=[], since_id='', type='super') {

					let getPage = new Task(
						`正在获取${type=='super'?'超级':'普通'}话题列表`,
						{
							method: 'GET',
							url: `https://m.weibo.cn/api/container/getIndex?containerid=100803_-_page_my_follow_${type}&since_id=${since_id}`,
						},
						(xhr) => parsePage(xhr),
						() => getFollowList(huatiList, since_id, type)
					),

						parsePage = function(xhr) {
							let data = JSON.parse(xhr.responseText);
							// console.log(data);

							if (!data.ok) {
								getPage.onerror('error');
							} else {
								//let cards = data.data.cards.find(c => c.card_type_name.includes('follow'));
								data.data.cards.forEach(c => c.card_group.forEach(function(card) {
									if ([4,8].includes(+card.card_type)) {
										let huati = {
											name: (card.title_sub || card.desc).replace(/#(.*)#/,'$1'),
											level: null,
											checked: !!card.title_flag_pic,
											hash: null,
											element: null
										};

										if (lastHuatiList && lastHuatiList.includes(huati.name)) {
											if (!todayChecked) {
												Object.assign(huati, log.待签.find((huati_) => huati_.name === huati.name));
												if (huati.checked)
													Object.assign(huati, log.待签.splice(log.待签.findIndex((huati_) => huati_.name === huati.name), 1).pop());
											} else {
												huati.hash = log.已签[huati.name];
												huati.element = document.getElementById(`_${huati.hash}`);
											}
										} else {
											huati.hash = /100808(\w+)&/.exec(card.scheme)[1];
											huati.element = initElement(huati.name, huati.hash);
										}
										huatiList.push(huati);

										if (!lastHuatiList || !lastHuatiList.includes(huati.name) || !todayChecked) {
											if (huati.checked) {
												checkinInfo.querySelector('.done').appendChild(huati.element);
												initLog('已签', {});
												log.已签[huati.name] = huati.hash;
											} else {
												checkinInfo.querySelector('.toDo').appendChild(huati.element);
												initLog('待签', []);
												log.待签.push(huati);
											}
										}
										if (huati.level)
											setStatus(`Lv.${huati.level}`, huati.element);
									}
								}));
								debugger;
								if (data.data.cardlistInfo.since_id)
									getFollowList(huatiList,data.data.cardlistInfo.since_id,type);
								else if (config.checkNormal && type == 'super')
									getFollowList(huatiList,'','normal');
								else {
									setStatus(`关注列表获取完毕，共${huatiList.length}个话题，` + (log.hasOwnProperty('待签') ? `${log.待签.length}个待签` : '全部已签'));
									console.table(huatiList);
									readyCheckin();
								}
							}
						};
				},

					readyCheckin = function(){
						console.info(log);

						if (log.hasOwnProperty('待签')) {
							if (config.autoCheckin)
								checkin(log.待签.shift());
							else {
								clearTask();
								/* 开始签到按钮 */
								let startCheckin = document.createElement('a');
								startCheckin.classList.add('S_ficon');
								startCheckin.onclick = () => checkin(log.待签.shift());
								startCheckin.innerText = '[开始签到]';
								checkinInfo.querySelector('.status').appendChild(startCheckin);
							}
						} else {
							clearTask();
							initCheckinBtn();
						}
					},

					/* 获取话题编号	@param	{array}	list	话题名称列表 */
					getHash = function(list) {
						let name = list.shift(),
							huatiGetHash = new Task(
								`${name}话题信息获取`,
								{
									method: 'get',
									url: `https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D1%26q%3D%23${name}%23&page_type=searchall`,
								},
								(xhr) => {
									if (xhr.status === 200) {
										//let regexp = /fid%3D100808(\w+)/g,
										//	hash = regexp.exec(xhr.responseHeaders.match(regexp).pop())[1];
										let data = JSON.parse(xhr.responseText);
										// console.log(data);

										if (!data.ok) {
											getPage.onerror('error');
										} else {
											let hash = data.data.cardlistInfo.containerid.slice(6),
												element = initElement(name, hash);
											checkinInfo.querySelector('.toDo').append(element);
											initLog('待签', []);
											log.待签.push({name, hash, element});
											if (list.length)
												getHash(list);
											else {
												setStatus(`话题列表获取完毕，共${(log.hasOwnProperty('已签') ? Object.keys(log.已签).length : 0) + (log.hasOwnProperty('待签') ? log.待签.length : 0)}个话题` + (log.hasOwnProperty('待签') ? `${log.待签.length}个待签` : '全部已签'));
												readyCheckin();
											}
										}
									}
								});
					},

					getWhitelist = function() {
						let toDoList = whitelist.slice(0);
						if (!whitelist.length) {
							setStatus('尚未设置签到话题白名单！<a>[设置]</a>');
							checkinInfo.querySelector('.status').querySelector('a').onclick = () => {
								setupConfig();
								checkinInfo.querySelector('.whitelist .mode').click();
								checkinInfo.querySelector('.whitelist .edit').click();
								checkinInfo.querySelector('.whitelist .box').focus();
							};
							clearTask();
							initCheckinBtn();
						} else {
							if (lastHuatiList) {
								for (let name of lastHuatiList) {
									if (!whitelist.includes(name)) {
										if (!todayChecked) {
											let index = log.待签.findIndex((huati) => huati.name === name);
											log.待签[index].element.remove();
											log.待签.splice(index, 1);
										}
									} else
										toDoList.splice(toDoList.indexOf(name), 1);
								}
							}
							if (toDoList.length)
								getHash(toDoList);
							else {
								setStatus(`话题列表获取完毕，共${(log.hasOwnProperty('已签') ? Object.keys(log.已签).length : 0) + (log.hasOwnProperty('待签') ? log.待签.length : 0)}个话题` + (log.hasOwnProperty('待签') ? `${log.待签.length}个待签` : '全部已签'));
								readyCheckin();
							}
						}
					},

					/**
						 * 话题签到
						 * @param	{object}	huati		话题，参见 {@link getFollowList#huatiList}
						 * @param	{boolean}	checkinAll	签到全部话题
						 */
					checkin = function(huati, checkinAll=true) {
						let huatiCheckin = new Task(
							`${huati.name}话题签到`,
							{
								method: 'GET',
								url: `/p/aj/general/button?api=http://i.huati.weibo.com/aj/super/checkin&id=100808${huati.hash}`,
							},
							(xhr) => {
								let data = JSON.parse(xhr.responseText),
									code = +data.code;
								// console.log(data);

								switch (code) {
									case 100000:
										if (Object.keys(data.data).length)
											setStatus(
												/\d+/g.exec(data.data.alert_title) ?
												`签到第${/\d+/g.exec(data.data.alert_title)[0]}名，经验+${/\d+/g.exec(data.data.alert_subtitle)[0]}` :
												(console.log(JSON.stringify(data.data)), '签到成功'), huati.element, true);
									case 382004: {
										if (code !== 100000 || 0 === Object.keys(data.data).length)
											setStatus('已签', huati.element, true);
										checkinInfo.querySelector('.done').appendChild(huati.element);
										initLog('已签', {});
										log.已签[huati.name] = huati.hash;
										Object.assign(lastCheckin, {date, nick: USER.NICK});
										Object.assign(lastCheckin, log.已签);
										GM_setValue(`lastCheckin${USER.UID}`, JSON.stringify(lastCheckin));
										break;
									}
									default: {
										setStatus(data.msg, huati.element, true);
										initLog('异常', {});
										log.异常[huati.name] = {huati, code: data.code, msg: data.msg, xhr: xhr};
										huatiCheckin.onerror('error');
									}
								}
								if (checkinAll) {
									if (log.待签.length > 0)
										checkin(log.待签.shift());
									else {
										clearTask();
										setStatus(`${date} 签到完成`);
										checkinInfo.querySelector('.toDo').parentNode.removeAttribute('open');
										Object.assign(lastCheckin, {allChecked: true});
										GM_setValue(`lastCheckin${USER.UID}`, JSON.stringify(lastCheckin));
										console.info(log);
										initCheckinBtn();
									}
								}
							},
							() => checkin(huati, false),
							() => {
								log.待签.push(huati);
								if (log.待签.length > 0)
									checkin(log.待签.shift());
								else
									clearTask();

								let retryHuati =document.createElement('a');
								retryHuati.classList.add('S_ficon');
								retryHuati.onclick = () => checkin(Object.assign({}, huati), false);
								retryHuati.innerText = '[重试]';
								setStatus(retryHuati, huati.element, true);
							}
						);
					},

					initElement = function(name, hash) {
						/**
							 * 文本限宽输出
							 * @param	{string}	text	输入文本
							 * @param	{int}		length	宽度限定
							 * @return	{string}	输出文本
							 */
						let shorten = function(text, length) {
							let count = 0;
							for (let index in text) {
								let increment = /[\x00-\x7f]/.test(text[index]) ? 1 : 2;
								if (count + increment > length - 2)
									return `${text.substr(0, index)}…`;
								count += increment;
							}
							return text;
						},
							element = document.createElement('li');
						element.id = `_${hash}`;
						element.innerHTML = `<i class=order></i>.<a href=//weibo.com/p/100808${hash} target=_blank title=${name}>${shorten(name, 12)}</a><span class=info></span>`;
						return element;
					};

				if (!lastCheckin.date || lastCheckin.date != date || !lastCheckin.allChecked || !auto) {

					/* 设置信息展示界面 */
					var checkinCSS = document.querySelector('style.checkin') || document.createElement('style');
					checkinCSS.className = 'checkin';
					checkinCSS.type = 'text/css';
					checkinCSS.innerHTML = `.checkin.info {z-index:10000;position:fixed;left: 0px;bottom: 0px;min-width:320px;max-width: 640px;opacity: 0.9}.checkin.info .W_layer_title {border-top: solid 1px #fa7f40}.checkin .status {float: right;padding: 0 60px 0 10px}.checkin .more {right: 36px}.checkin.info .close {right: 12px}.checkin .detail {display: ${config.openDetail ? '' : 'none'};margin: 6px 12px;padding: 2px;max-height: ${config.maxHeight}px;overflow-y:auto;}${scrollbarStyle('.checkin .detail')}.checkin .detail summary {margin: 2px}.checkin .detail ol {column-count: 3}.checkin .detail li {line-height: 1.5}.checkin a {cursor: pointer}.checkin .info {float: right}.checkin .status ~ .W_ficon {position: absolute;bottom: 0px;font-size: 18px;}`;
					document.head.appendChild(checkinCSS);

					//var
					checkinInfo = document.querySelector('.checkin.info') || document.createElement('div');
					//checkinInfo.id = 'checkinInfo';
					checkinInfo.className = 'W_layer checkin info';
					checkinInfo.innerHTML = `<div class=content><div><div class=detail><details open style=display:none><summary class="W_f14 W_fb">待签</summary><ol class=toDo></ol></details><details style=display:none><summary class="W_f14 W_fb">已签</summary><ol class=done></ol></details></div></div><div class=W_layer_title>${USER.NICK}<span class=status></span><a title=${config.openDetail ? '收起' :'详情'} class="W_ficon S_ficon more">${config.openDetail ? 'c' : 'd'}</a><a title=${currentTask ? '中止' : '关闭'} class="W_ficon S_ficon close">X</a></div></div>`;
					document.body.appendChild(checkinInfo);

					alterCheckinBtn('签到');

					checkinInfo.querySelector('.more').onclick = function() {
						if (this.innerText === 'd') {
							this.innerText = 'c';
							this.title = '收起';
							checkinInfo.querySelector('.detail').removeAttribute('style');
						} else {
							this.innerText = 'd';
							this.title = '详情';
							checkinInfo.querySelector('.detail').style.display = 'none';
						}
					};

					checkinInfo.querySelector('.close').onclick = function() {
						if (currentTask) {
							currentTask.xhr.abort();
							setStatus(`${currentTask.name}中止`);
							clearTask();
							initCheckinBtn();
						} else {
							checkinInfo.remove();
							checkinCSS.remove();
							initCheckinBtn();
						}
					};

					[checkinInfo.querySelector('.toDo'), checkinInfo.querySelector('.done')].forEach((ol, i) =>
																									 ['DOMNodeInserted', 'DOMNodeRemoved'].forEach((event) =>
																																				   ol.addEventListener(event, function() {
						let isRemoval = event != 'DOMNodeInserted',
							subtotal = ol.childElementCount - (isRemoval ? 1 : 0);
						if (!subtotal)
							this.parentNode.style.display = 'none';
						else
							this.parentNode.removeAttribute('style');
						this.previousSibling.innerText = `${i ? '已' : '待'}签${subtotal}个话题`;
						Array.from(this.querySelectorAll('li .order')).forEach((el) => /* 计算序号并按小计添加 en quad 进行格式化 */
																			   el.innerText = (Array.from(el.parentNode.parentNode.querySelectorAll('li')).findIndex((li) =>
											li === el.parentNode) + (isRemoval ? 0 : 1)).toString().padStart(subtotal.toString().length).replace(/ /g, String.fromCharCode(8192)));
					})));

					/* 开始获取话题列表 */

					if (lastCheckin.date) {
						setStatus(`从${lastCheckin.date}签到记录读取话题列表`);
						var lastHuatiList = [],
							todayChecked = lastCheckin.date === date;
						for (let name in lastCheckin) {
							if (!['date', 'nick', 'allChecked'].includes(name)) {
								lastHuatiList.push(name);
								let hash = lastCheckin[name],
									element = initElement(name, hash);
								if (!todayChecked) {
									checkinInfo.querySelector('.toDo').appendChild(element);
									initLog('待签', []);
									log.待签.push({name, hash, element});
								} else {
									checkinInfo.querySelector('.done').appendChild(element);
									initLog('已签', {});
									log.已签[name] = hash;
								}
							}
						}
						if (!todayChecked)
							lastCheckin = {};
						if (log.hasOwnProperty('待签') && log.待签.length) {
							setStatus(`话题列表读取完毕，共${log.待签.length}个话题待签`);
							if (config.checkinMode === 'followList') {
								if (config.autoCheckin)
									checkin(log.待签.shift());
								else {
									/* 开始签到按钮 */
									let startCheckin = document.createElement('a');
									startCheckin.classList.add('S_ficon');
									startCheckin.onclick = () => checkin(log.待签.shift());
									startCheckin.innerText = '[开始签到]';
									checkinInfo.querySelector('.status').appendChild(startCheckin);
								}
							}
						} else
							initCheckinBtn();
					}
					switch (config.checkinMode) {
						case 'followList':
							getFollowList();
							break;
						case 'whitelist':
							getWhitelist();
							break;
					}
				} else
					initCheckinBtn();
			},

			importWhitelist = () => Object.keys(lastCheckin).filter((key) => !['date', 'nick', 'allChecked'].includes(key)),

			checkState = function(list=importWhitelist()) {
				if (!arguments.length) {
					console.group('话题状态查询');
					alterCheckinBtn('查询');
				}
				let load = (xhr, name, hash) => {
					try {
						let data = JSON.parse(xhr.responseText),
							element = document.getElementById(`_${hash}`);
						if (!data.ok) {
							list.push(name);
						} else {
							let cards = data.data.cards;
							setStatus((
								'我的经验值' != cards[1].card_type_name ? '' : cards[1].card_group.reduce(
									(text, card) => 4 != +card.card_type || !/\d/.test(card.desc) ? text : text +
									card.desc.replace(/[^\.\d]*(\.?\d+)\D.*/g,
													  (_, match) => (match.includes('.') ? 'Lv' : '-') + match),
									'')), element);
							let countsCard = !cards[0].card_group ?
								19 != +cards[0].card_type ? null :
							cards[0] : cards[0].card_group.pop();
							if (countsCard)
								element.title = countsCard.group.map(
									(item) => item.item_title + item.item_desc).join() + (!cards[3] || 4 != cards[3].card_type ? '' : ',' + cards[3].desc.replace('超级话题', ''));
							if (cards[2].card_group && cards[2].card_group[1].group)
								setStatus(';' + cards[2].card_group[1].group.map(
									(item) => item.item_desc + item.item_title).join(), element, true);
						}
					} catch (e) {
						console.error(e);
						list.push(name);
					}
					checkState(list);
				};
				if (!list.length) {
					setStatus('查询完毕。');
					clearTask();
					initCheckinBtn();
					console.groupEnd('话题状态查询');
				} else {
					let name = list.shift(),
						hash = lastCheckin[name],
						stateCheck = new Task(
							`查询${name}话题状态`,
							{
								method: 'GET',
								url: `https://m.weibo.cn/api/container/getIndex?containerid=231140${hash}_-_detail`,
							},
							(xhr) => load(xhr, name, hash)
						);
				}
			};

		setupConfig = function() {
			const date = getDate();
			var configCSS = document.createElement('style');
			//configCSS.id = 'configCSS';
			configCSS.type = 'text/css';
			configCSS.innerHTML = `.checkin.config {z-index:6666;position:fixed;right: 0px;top: 50px;width:540px;opacity: 0.9}.checkin.config a {cursor: pointer}.checkin.config form {height: 288px}.checkin.config header {text-align: center}.checkin.config .close {position: absolute;z-index: 2;left: 12px;top: 2px;font-size: 18px;}.checkin.config header img {position: relative;top: 3px;padding-right: 6px}.checkin.config footer {position: absolute;bottom: 0px;padding: 12px;width: 492px;border-top: solid 1px #ccc}.checkin.config footer input {margin: 0 12px}.checkin.config main {margin: 6px 12px;}.checkin.config fieldset:first-child {width: 240px;float:left;margin-right: 12px}.checkin.config fieldset {padding: 1px 12px}
.checkin.config fieldset > fieldset > legend {text-align: right; padding:3px}.checkin.config input[type=number] {width: 48px}.checkin.config input[type=button] {padding: 0 12px}.checkin.config th {font-weight: bold;padding: 6px 0 3px}.checkin.config table {float: left;margin: 0 6px}.checkin.config div {padding: 6px;height: 160px;overflow-y: scroll;background-color: whitesmoke;line-height: 1.5}${scrollbarStyle('.checkin.config textarea', '.checkin.config div')}.checkin.config span {float: right; margin-top: 3px}
.checkin.config textarea {width: 120px; height: 90px;padding: 6px;margin: 6px 0}`;
			document.head.appendChild(configCSS);

			//var
			configForm = document.createElement('div');
			//configForm.id = 'configForm';
			configForm.className = 'W_layer checkin config';
			configForm.innerHTML = `<form class=content><header class=W_layer_title><img src=//img.t.sinajs.cn/t6/style/images/pagecard/icon.png>签到脚本设置<span class=status></span><a title=关闭 class="W_ficon S_ficon close">X</a></header><main><fieldset><legend>参数设定</legend>
<fieldset><legend>签到模式</legend><label class=followList title=先获取话题关注列表再进行签到><input type=radio value=followList name=checkinMode>关注列表模式 　<label for=checkNormal><input type=checkbox name=checkNormal for=followList class=sub>普话签到</label></label><br>
<label class=whitelist title=只读取本地名单并按顺序签到><input type=radio value=whitelist name=checkinMode>白名单模式　　<input type=button class="edit sub" value=编辑名单></label></fieldset>
<fieldset><legend>运行参数</legend>请求延时 <input type=number name=delay min=0 max=1000 step=100> 毫秒<span><label for=autoCheckin><input type=checkbox name=autoCheckin>自动签到</label><br><label title=自动查询等级、连续签到天数、话题数据及主持人考核进度><input type=checkbox name=autoCheckState>自动查询</label></span><br>请求超时 <input type=number name=timeout min=1000 max=10000 step=100> 毫秒<br>自动重试 <input type=number name=retry min=0 max=10> 次</fieldset>
<fieldset><legend>签到详情</legend>最大高度 <input type=number name=maxHeight min=60 max=1080 step=60> 像素<span><label for=openDetail><input type=checkbox name=openDetail>自动展开</label></span></fieldset>
</fieldset>
<fieldset class=account><legend>账户信息</legend><table><tbody><tr><th>昵称</th></tr><tr><td>${USER.NICK}</td></tr><tr><th>ID</th></tr><tr><td>${USER.UID}</td></tr><tr><th>上次签到</th></tr><tr><td>${lastCheckin.date || '尚无记录'}</td></tr><tr><th><input type=button value=状态查询 class=stateCheck></th></tr><tr><th><input type=button value=清空记录 class=clear ${Object.keys(lastCheckin).length != 0 ? '' : 'disabled'}></th></tr></tbody></table><div>${importWhitelist().map((name) => {
				let hash = lastCheckin[name];
				return '<p id=_' + hash + '><a href=//weibo.com/p/100808' + hash + ' target=_blank>' + name + '</a><i class=info></i></p>';
			}).join('')}</div></fieldset>
<fieldset class="whitelist editor" style=display:none><legend>签到名单编辑</legend>请在下方编辑名单，每行一个话题名，完成后点击[保存名单]按钮。<br><textarea class=box placeholder="每行一个话题名，不带#号，如\n读书\n美食">${whitelist.join('\n')}</textarea><span><input type=button class=save value=保存名单 disabled><input type=button class=import value=导入列表 title=导入签到记录中的话题列表></fieldset>
<footer><input type=button value=保存 class=save disabled><input type=button value=还原 class=restore disabled><input type=button value=重置 class=default><span><a href=//greasyfork.org/scripts/32143/feedback target=_blank>GreasyFork</a> / <a href=//gist.github.com/xyauhideto/b9397058ca3166b87e706cbb7249bd54 target=_blank>Gist</a> / <a href=//weibo.com/678896489 target=_blank>微博</a> 报错请F12提供后台记录</span></footer> </form>`;
			document.body.appendChild(configForm);
			alterCheckinBtn('设置');

			let inputs = Array.from(configForm.querySelectorAll('input:not([type=button])')),

				getWhitelist = () => configForm.querySelector('.checkin .whitelist .box').value.split('\n').filter((name) => name.trim().length),
				getInputs = () => inputs.reduce((conf, input) => {
					if (!(input.type === 'radio' && !input.checked))
						conf[input.name] = input.type != 'number' ? input.type != 'checkbox' ? input.value : input.checked : Math.max(+input.min, Math.min(+input.max, +input.value));
					return conf;
				}, {}),

				initForm = function(conf=config) {
					for (let [key, value] of Object.entries(conf)) {
						let input = typeof value === 'string' ? configForm.querySelector(`[name=${key}][value=${value}]`) : document.querySelector(`[name=${key}]`);
						if (typeof value === 'boolean')
							input.checked = value;
						else if (typeof value === 'string') {
							input.checked = true;
							input.parentNode.querySelector('.sub').removeAttribute('disabled');
							let other = configForm.querySelector(`[name=${key}]:not([value=${value}])`).parentNode.querySelector('.sub');
							if (other.value === '退出编辑')
								other.click();
							other.disabled = true;
						} else
							input.value = value;
					}
					configForm.querySelector('.restore').disabled = isEqual(conf, config);
					configForm.querySelector('.default').disabled = isEqual(conf, DEFAULT_CONFIG);
					configForm.querySelector('footer .save').disabled = configForm.querySelector('.restore').disabled;
					configForm.querySelector('.whitelist .box').oninput();
				},

				/**
		 * 简单对象、阵列比较
		 * @param	{object|array}	x	比较对象/阵列x
		 * @param	{object|array}	y	比较对象/阵列y
		 * @return	{boolean}	比较结果
		 */
				isEqual = function(x, y) {
					if (Object.values(x).length != Object.values(y).length)
						return false;
					if (x instanceof Array) {
						for (let value of x) {
							if (!y.includes(value))
								return false;
						}
					} else {
						for (let key in x) {
							if (!y.hasOwnProperty(key) || x[key] != y[key])
								return false;
						}
					}
					return true;
				};

			configForm.querySelector('.stateCheck').onclick = ()=>checkState();

			configForm.querySelector('footer .save').onclick = function() {
				config = getInputs();
				if (!configForm.querySelector('.whitelist .save').disabled && confirm('尚未保存签到名单，一起保存？'))
					configForm.querySelector('.whitelist .save').click();
				if (configForm.querySelector('.whitelist .edit').value === '退出编辑')
					configForm.querySelector('.whitelist .edit').click();
				GM_setValue(`config${USER.UID}`, JSON.stringify(config));
				initForm();
			};
			configForm.querySelector('.restore').onclick = () => initForm();
			configForm.querySelector('.default').onclick = function() {
				GM_deleteValue(`config${USER.UID}`);
				initForm(DEFAULT_CONFIG);
			};
			configForm.querySelector('.clear').onclick = function() {
				console.warn('清空上次签到');
				console.table(lastCheckin);
				GM_deleteValue(`lastCheckin${USER.UID}`);
				lastCheckin = {};
				configForm.querySelector('tr:nth-of-type(6)>td').innerText = '尚无记录';
				configForm.querySelector('div').innerText = '';
				this.disabled = true;
			};
			configForm.querySelector('.close').onclick = function() {
				if (currentTask) {
					currentTask.xhr.abort();
					setStatus(`${currentTask.name}中止`);
					clearTask();
					initCheckinBtn();
				} else {
					configCSS.remove();
					configForm.remove();
					initCheckinBtn();
				}
			};

			inputs.forEach(function(input) {
				input.onchange = () => initForm(getInputs());
				if (input.parentNode.title) {
					input.onfocus = () => {
						let tip = document.createElement('i');
						tip.innerText = input.parentNode.title;
						tip.style = `position:absolute;left:${input.offsetLeft - 10 * input.parentNode.title.length}px;top:${input.offsetTop + 15}px;padding:3px;border:1px solid grey;color:grey;background-color:white;box-shadow:1px 1px 2px`;
						input.parentNode.append(tip);
					};
					input.onblur = () => input.parentNode.lastChild.remove();
				}
			});

			configForm.querySelector('.whitelist .edit').onclick = function() {
				if (this.value === '编辑名单') {
					configForm.querySelector('.whitelist .box').value = whitelist.join('\n');
					configForm.querySelector('.account').style.display = 'none';
					configForm.querySelector('.whitelist.editor').removeAttribute('style');
					this.value = '退出编辑';
				} else {
					configForm.querySelector('.whitelist.editor').style.display = 'none';
					configForm.querySelector('.account').removeAttribute('style');
					this.value = '编辑名单';
				}
			};
			configForm.querySelector('.whitelist .save').onclick = function() {
				let whitelist_ = getWhitelist();
				if (whitelist_.length || confirm('尚未设定白名单，继续保存？')) {
					whitelist = whitelist_;
					GM_setValue(`whitelist${USER.UID}`, JSON.stringify(whitelist));
					configForm.querySelector('.whitelist.editor').style.display = 'none';
					configForm.querySelector('.account').removeAttribute('style');
					configForm.querySelector('.whitelist .edit').value = '编辑名单';
					configForm.querySelector('.whitelist .box').oninput();
				}
			};
			configForm.querySelector('.checkin .whitelist .import').onclick = function() {
				configForm.querySelector('.whitelist .box').value = importWhitelist().join('\n');
				configForm.querySelector('.whitelist .box').oninput();
			};
			configForm.querySelector('.whitelist .box').oninput = function() {
				let whitelist_ = getWhitelist();
				configForm.querySelector('.whitelist .save').disabled = isEqual(Object.assign({}, whitelist_), Object.assign({}, whitelist));
				configForm.querySelector('.whitelist .import').disabled = isEqual(whitelist_, importWhitelist());
			};

			initForm();
		},

			/**
		 * 提示签到状态
		 * @param	{string|node}	status					当前状态
		 * @param	{node}			[element=checkinStatus]	显示提示的节点
		 * @param	{boolean}		[append=false]			追加节点
		 */
			setStatus = function(status, element=document.querySelector('.checkin .status'), append=false) {
			if (element.id && element.id.startsWith('_'))
				element = element.querySelector('.info');

			if (typeof status === 'string' && status)
				console.info(status);

			if (append) {
				if (typeof status !== 'string')
					element.appendChild(status);
				else
					element.innerHTML += status;
			} else
				element.innerHTML = status;
		},

			scrollbarStyle = function() {
			return Array.from(arguments).map((elementSelector) => `${elementSelector}::-webkit-scrollbar {width: 4px;background-color: #f2f2f5;border-radius: 2px;}${elementSelector}::-webkit-scrollbar-thumb {width: 4px;background-color: #808080;border-radius: 2px;}`).join('');
		},

			/* 隐藏游戏按钮，替换为超话签到 */
			checkinBtn = document.createElement('li');
		checkinBtn.id = 'checkinBtn';
		checkinBtn.innerHTML = `<a><em class="W_ficon checkin S_ficon">s</em><em class="S_txt1">超话签到</em></a>`;
		checkinBtn.addEventListener('contextmenu', e => {
			e.preventDefault();
			e.stopPropagation();
			setupConfig();
		});
		checkinBtn.addEventListener('click', () => huatiCheckin(false));

		let navLast = document.querySelector('.gn_nav_list li:last-child');
		navLast.parentNode.insertBefore(checkinBtn, navLast);
		navLast.parentNode.querySelector('a[nm=game]').parentNode.style.display = 'none';

		/* 清理旧版数据 */
		['autoSignbox', 'todaySigned'].forEach((key) => GM_deleteValue(key));

		/* 自动签到 */
		if (config.autoCheckin)
			huatiCheckin();
	} catch (ReferenceError) {
		console.error(ReferenceError);
		setTimeout(this.onload, 500);
	}
});