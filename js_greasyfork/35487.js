// ==UserScript==
// @name         bv7_beepcar_dark_b
// @namespace    bv7
// @version      1.3
// @description  Don't say anything (.)(.)
// @author       bv7
// @include      https://beepcar.ru/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_listValues
// @grant        GM.listValues
// @downloadURL https://update.greasyfork.org/scripts/35487/bv7_beepcar_dark_b.user.js
// @updateURL https://update.greasyfork.org/scripts/35487/bv7_beepcar_dark_b.meta.js
// ==/UserScript==


(function() {
	'use strict';

	let gm;
	const regHrefPoputchiki = /\/poputchiki\/([^_]+_[^\?]+)\?/;
	const regHrefPoezdka    = /\/poezdka\/[^_]+_[^_]+_(\d+)-(\d+)-(\d+)_(\d+)/;
	const regHrefMytrips    = /\/mytrips/;
	const regHrefProfile    = /\/profile\/(\d+)/;
	const prefixTrip        = 'trip_';
	//const sufixTime         = '_time';
	const regPrefixTrip     = new RegExp('/^' + prefixTrip + '(\d+)_/');
	//const regIdTripTime     = new RegExp('/^' + prefixTrip + '(\d+)' + sufixTime + '/');
	
	
	class Page {
		constructor() {
			this.promise = Promise.resolve();
			this.init();
		}
		init() {
			this.ok = true;
		}
	} // class Page
	
	class Tool {
		constructor(mainTool) {
			this.mainTool = mainTool;
			this.unfreeze = () => '';
			this.promise = Promise
				.all([
					Promise
					.all([
						gm.getValue('timeoutHuman',       3000),
						gm.getValue('timeoutHumanAddMax', 9000)
					])
					.then(v => this.getTimeoutHuman = () => v[0] + Math.random() * v[1]),
					gm.getValue('timeoutCheckAddMax', 60000).then(v => this.timeoutCheckAdd = v * Math.random())
				])
				.then(() => this.initPlans())
				.then(() => this.setTimeout(5000))
				.then(() => this.init())
			;
		}
		initPlans() {
			console.log('Tool.initPlan().');
		}
		remove() {
			return Promise.resolve();
		}
		init() {
			this.mainTool.node.appendChild(this.node);
			//console.log('Tool.init()');
			let prm;
			this.mainTool.nodeReset.disabled = (this.mainTool.nodeStart.checked ? 'disabled' : '');
			if (this.mainTool.nodeStart.checked) {
				if (this.plan) {
					let timeout;
					//console.log('plan          =', this.plan);
					//console.log('planBegin     =', this.planBegin);
					//console.log('planPrevBegin =', this.planPrevBegin);
					if (this.plan === this.planBegin) {
						this.planPrevBegin = this.planBegin;
						this.planBegin     = null;
						//this.planPrev  = this.plan;
						this.plan.action();
						//console.log('this.plan.action =', this.plan.action);
						timeout = 5000;
					} else {
						this.planBegin = this.plan;
						timeout = this.plan.getTimeout ? this.plan.getTimeout() : this.getTimeoutHuman();
					}
					prm = this.setTimeout(timeout)
					.then(() => this.reinit());
				}
			} //else if (this.planBegin) this.cancelPlan();
			return prm;
		}
		setTimeout(timeout) {
			return new Promise((resolve, reject) => {
				let idTimeoutAction, idTimeoutCounter;
				let time    = Date.now() + timeout;
				let counter = () => {
					//if (this.mainTool.nodeStart.checked) {
						let timeout = time - Date.now();
						if (timeout > 0) {
							let fullsec = parseInt(timeout / 1000);
							let justsec = fullsec % 60;
							this.mainTool.nodeTimer.data  = ((timeout <= 0) ? '0:00' : (parseInt(fullsec / 60) + ':' + ((justsec < 10) ? '0' : '') + justsec));
							idTimeoutCounter = setTimeout(() => counter(), this.mainTool.timeoutCounter);
						}
					//}
				};
				this.complitePlan = () => {
					clearTimeout(idTimeoutAction);
					clearTimeout(idTimeoutCounter);
					resolve();
				};
				this.cancelPlan = () => {
					//console.log('cancelPlan');
					clearTimeout(idTimeoutAction);
					clearTimeout(idTimeoutCounter);
					this.planBegin = null;
					resolve();
				};
				idTimeoutAction = setTimeout(() => {
					clearTimeout(idTimeoutCounter);
					resolve();
				}, timeout);
				counter();
			}).then(() => this.mainTool.nodeTimer.data = '-:--');
		}
		reinit() {
			return this.remove()
				.then(() => this.init())
			;
		}
		freeze() {
			let prm = new Promise((resolve, reject) => this.unfreeze = resolve);
			this.mainTool.promise = this.mainTool.promise.then(() => prm);
			return this.promise = this.promise.then(() => prm);
		}
		minutesToTimeoutCheck(minutes) {
			return minutes * 60000 + this.timeoutCheckAdd;
		}
		setPlan(plan, nd) {
			this.plan = plan;
			if (nd) {
				if (nd instanceof NodeList) for (let i = 0; i < nd.length; i++) nd[i].style.border = 'solid red 2px';
				else nd.style.border = 'solid red 2px';
			}
		}
	} //class Tool

	class MainTool {
		constructor(classTool) {
			this.classTool = classTool;
			this.idStart   = 'start';
			this.promise   = Promise.resolve().then(() => this.init());
		}
		init() {
			return gm.getValue('timeoutCounter', 1000)
			.then(v => this.timeoutCounter = v)
			.then(() => this.createElementStart())
			.then(() => {
				if (!!this.node) this.node.remove();
				this.node = createNodeTool();
				let nd1 = document.createElement('div');
				nd1.setAttribute('style', 'z-index:999;position:relative;');
				this.nodeNext  = createElementButton('-:--', () => this.tool.complitePlan());
				//this.nodeTimer       = document.createTextNode('');
				this.nodeTimer = this.nodeNext.firstChild;
				this.nodeReset = this.createElementReset();
				nd1.appendChild(this.nodeStart);
				nd1.appendChild(document.createTextNode(' Start '));
				nd1.appendChild(this.nodeNext);
				nd1.appendChild(this.nodeReset);
				nd1.appendChild(this.createElementLog());
				this.node.appendChild(nd1);
				document.body.insertBefore(this.node, document.body.firstChild);
				this.tool = new (this.classTool)(this);
				return this.tool.promise;
			});
		}
		createElementStart() {
			return gm.getValue(this.idStart, false)
				.then((start) => {
					this.nodeStart = createElementCheckbox(
						(v) => {
							gm.setValue(this.idStart, v);
							if (!v) this.tool.cancelPlan();
							this.tool.promise = this.tool.promise.then(() => this.tool.reinit());
						},
						start
					);
					//this.nodeStart.setAttribute('style', 'z-index:999;position:relative;');
				});
		}
		createElementReset() {
			return createElementButton(
				'Reset',
				() => this.promise = this.promise
					.then(() => gm.deleteValues())
					.then(() => this.tool.promise = this.tool.remove())
					.then(() => this.init())
			);
		}
		createElementLog() {
			let nd = createElementButton(
				'Log',
				() => console.log('MainTool: ', this)
			);
			//nd.setAttribute('style', 'z-index:999;position:relative;');
			return nd;
		}
	} // class MainTool


	class Polzovatel {
		constructor(badId) {
			this.id = badId.replace(/[^0-9a-zA-Z]/g, '');
		}
	} // class Polzovatel
	class Driver extends Polzovatel {
		constructor(badId, name = null) {
			super(badId);
			this.prefix         = 'driver_' + this.id + '_';
			this.idNotBlockTrip = this.prefix + 'notBlockTrip';
			this.idName         = this.prefix + 'name';
			if (!!name) this.name = name;
			this.promise = Promise.all([
				gm.getValue(this.idNotBlockTrip, false).then((v) => this.notBlockTrip = v),
				!!this.name ? Promise.resolve() : gm.getValue(this.idName, '').then((v) => this.name = v)
			]);
		}
	} // class Driver
	
	class Trip {
		constructor(id, driver) {
			this.id         = id;
			this.prefix     = prefixTrip + this.id + '_';
			this.idNotBlock = this.prefix + 'notBlock';
			this.idTime     = this.prefix + 'time';
			this.driver     = driver;
			this.promise    = Promise.all([
				gm.getValue(this.idTime, 0).then((v) => this.time = v),
				Promise.all([
					gm.getValue(this.idNotBlock, false),
					this.driver.promise
				]).then((v) => this.notBlock = v[1] || v[1])
			]);
		}
	} // class Trip

	class PageBeepcar extends Page {
		init () {
			super.init();
			this.timezoneOffset = -180;
			this.trips          = null;
		}
		getNow() {
			let r = new Date();
			r.setMinutes(r.getMinutes() + (r.getTimezoneOffset() - this.timezoneOffset));
			return r;
		}
	} // class PageBeepcar

	class PagePoputchiki extends PageBeepcar {
		init() {
			super.init();
			class MyTrip extends Trip {
				constructor(nodeTrip, pg) {
					let nodeAncorPoezdka = nodeTrip.querySelector('a');
					let nodeAncorDriver  = nodeTrip.querySelector('a+div>div>span>a');
					//console.log('nodeAncorPoezdka = ', nodeAncorPoezdka);
					//console.log('nodeAncorDriver = ', nodeAncorDriver);
					pg.ok = !!nodeAncorPoezdka && !!nodeAncorDriver;
					if (pg.ok) {
						let arrId     = nodeAncorPoezdka.getAttribute('href').match(regHrefPoezdka);
						let arrDriver = nodeAncorDriver.getAttribute('href').match(/*pg.*/regHrefProfile);
						//console.log('arrId = ', arrId);
						//console.log('arrDriver = ', arrDriver);
						pg.ok         = !!arrId && !!arrDriver;
						if (pg.ok) {
							//console.log('arrId = ', arrId);
							super(arrId[4], new Driver(arrDriver[1], nodeAncorDriver.innerText));
							this.priceAsSearch = true;
							this.timeAsSearch  = true;
							this.fromAsSearch  = true;
							this.toAsSearch    = true;
							this.nodeAncorPoezdka = nodeAncorPoezdka;
							this.nodeAncorDriver  = nodeAncorDriver;
							this.nodeFrom         = nodeTrip.querySelector('a>div+div+div+div>div>div:first-child>div:nth-child(1)>div+div>div');
							this.nodeTo           = nodeTrip.querySelector('a>div+div+div+div>div>div:first-child>div:nth-child(2)>div+div>div');
							this.nodePrice        = nodeTrip.querySelector('a>div:first-child>div+div>span');
							this.nodeTime         = nodeTrip.querySelector('a>div:first-child>div>div');
							this.nodeSeats        = nodeTrip.querySelector('a>div+div>span');
							pg.ok = !!this.nodeFrom && !!this.nodeTo && !!this.nodePrice && !!this.nodeTime && !!this.nodeSeats;
							if (pg.ok) {
								let arrPrice  = this.nodePrice.innerText.match(/\d+/);
								this.price = !!arrPrice ? Number(arrPrice[0]) : 0;
								let arrTime   = this.nodeTime.innerText.match(/(\d+):(\d+)/);
								let arrSeats  = this.nodeSeats.innerText.match(/\d+/);
								pg.ok = !!arrTime;
								if (pg.ok) {
									this.from           = this.nodeFrom.innerText;
									this.to             = this.nodeTo.innerText;
									this.fromAsSearch = -1 < this.from.toLowerCase().replace(/ё/g, 'е').indexOf(pg.from.toLowerCase().replace(/ё/g, 'е'));
									this.toAsSearch = -1 < this.to.toLowerCase().replace(/ё/g, 'е').indexOf(pg.to.toLowerCase().replace(/ё/g, 'е'));
									this.time = new Date(arrId[3], arrId[2] - 1, arrId[1], arrTime[1], arrTime[2], 0, 0);
									if (pg.existFilterTime) this.setMinMaxTime(pg.minTime, pg.maxTime);
									if (!!arrSeats) this.seatsAvailable = Number(arrSeats[0]);
									else this.seatsAvailable = 0;
								}
							}
							this.setAsSearch();
						}
					}
				}
				setAsSearch() {
					this.asSearch = this.priceAsSearch && this.timeAsSearch && this.fromAsSearch && this.toAsSearch;
				}
				setMaxPrice(maxPrice) {
					this.priceAsSearch = this.price <= maxPrice;
					this.setAsSearch()
				}
				setMinMaxTime(minTime, maxTime) {
					this.timeAsSearch = this.time >= minTime && this.time <= maxTime;
					this.setAsSearch()
				}
			} // class MyTrip
			let now = this.getNow();
			this.nodeFrom   = document.querySelector('div>div[tabindex="-1"]:nth-child(1)>div[data-react-toolbox="input"]>input');
			this.nodeTo     = document.querySelector('div>div[tabindex="-1"]:nth-child(2)>div[data-react-toolbox="input"]>input');
			this.nodeScroll = document.querySelector('div.app-content>div>header+div>div>div>div:first-child');
			this.nodeNoMore = document.querySelector('div.app-content>div>header+div>div>div>div:first-child>div:nth-child(1)>div:nth-child(2)>div>div:nth-child(2)>div:last-child>h1');
			this.nodePanelLeft = document.querySelector('div.app-content>div>div>div>div>div:first-child>div>div:first-child');
			this.nodeDateInput = document.body.querySelector('div.app-content header[data-react-toolbox="app-bar"]+div div+div+div input');
			this.nodeCalendar  = document.body.querySelector('div[data-react-toolbox="calendar"]');
			this.nodeCalendarMonthName = document.body.querySelector('div[data-react-toolbox="month"] span');
			this.nodeCalendarMonthPrev = document.body.querySelector('div[data-react-toolbox="calendar"]>button');
			this.nodeCalendarMonthNext = document.body.querySelector('div[data-react-toolbox="calendar"]>button+button');
			this.nodesCalendarDay = document.body.querySelectorAll('div[data-react-toolbox="day"] span');
			this.nodesRow         = document.body.querySelectorAll('div.app-content>div>header+div>div>div>div>div>div+div>div>div:not([class])>*');
			this.nodesTrip        = document.body.querySelectorAll('div.app-content>div>header+div div:not([class])>div:nth-child(1n+2)>div>div:first-child');
			this.last  = (this.nodeNoMore !== null || this.nodesRow && this.nodesRow.length < 8);
			this.ok = !!this.nodeFrom && !!this.nodeTo && !!this.nodeScroll && !!this.nodePanelLeft && !!this.nodeDateInput;
			if (this.ok) {
				this.from            = this.nodeFrom.value;
				this.to              = this.nodeTo.value;
				this.trips           = new Array(this.nodesTrip.length);
				let arr              = location.href.match(/\bdate=(\d+)-(\d+)-(\d+)\b/);
				this.existFilterTime = !!arr;
				if (this.existFilterTime) {
					this.minTime = new Date(arr[1], arr[2] - 1, arr[3], 0, 0, 0, 0);
					this.maxTime = new Date(arr[1], arr[2] - 1, arr[3], 23, 59, 59, 999);
				}
				if (this.nodeCalendarMonthName) {
					let arrMonth = this.nodeCalendarMonthName.innerText.match(/(\S+)\s+(\d+)/);
					this.ok = !!arrMonth;
					if (this.ok) {
						let month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].indexOf(arrMonth[1]);
						this.ok = month >= 0;
						if (this.ok) this.calendarMonth = new Date(arrMonth[2], month);
					}
				}
				this.filterIsOld = this.existFilterTime && this.maxTime < Date.now();
				//let tripsIdx = {};
				for (let i = 0; i < this.nodesTrip.length && this.ok; i++) {
					let trip = new MyTrip(this.nodesTrip[i], this);
					this.promise = this.promise.then(() => trip.promise);
					this.trips[i] = trip;
					//tripsIdx[this.trips[i].id] = true;
				}
			}
		}
		scroll() {
			this.nodeScroll.scrollBy(0, 1000000);
			//for(let i = 0; i < 2; i++) this.nodeScroll.scrollTop +=1000000;
		}
	} // class PagePoputchiki
	
	class PagePoezdka extends PageBeepcar {
		init() {
			class MyTrip extends Trip {
				constructor() {
					class MyDriver extends Driver {
						constructor() {
							let id = '0';
							let nodeAncor = document.body.querySelector('div.app-content span>a');
							if (!!nodeAncor) {
								let arrId = nodeAncor.getAttribute('href').match(regHrefProfile);
								if (!!arrId) id = arrId[1];
							}
							super(id);
							if (this.nodeAncor = nodeAncor) this.name = this.nodeAncor.innerText;
						}
					}
					let arr      = location.href.match(regHrefPoezdka);
					if (!!arr) {
						super(arr[4], new MyDriver());
						this.seatsAvailable      = 0;
						this.seatsForBooking     = 0;
						this.price               = 0;
						this.seatsMy             = 0;
						//this.nodeTime            = document.body.querySelector('div.app-content meta[itemprop="description"]+div+div>div>div>div');
						this.nodeTime            = document.body.querySelector('div.app-content ol+div div>div>div>div');
						this.nodeButtonBooking   = document.body.querySelector('div.app-content button[aria-label="book-button"]');
						//this.nodeSeatsAvailable  = document.body.querySelector('div.app-content meta[itemprop="description"]+div+div>div+div+div>div+div');
						//this.nodeSeatsAvailable      = document.querySelector('div.app-content meta[itemprop="description"]+div+span+div>div+div+div>div>div');
						//if (!this.nodeSeatsAvailable) this.nodeSeatsAvailable = document.querySelector('div.app-content meta[itemprop="description"]+div+div>div+div+div>div>div');
						//this.nodeSeatsAvailable  = document.body.querySelector('div.app-content ol+div div>div+div+div>div>div');
						//if (!this.nodeSeatsAvailable) this.nodeSeatsAvailable  = document.body.querySelector('div.app-content ol+div div>div+div+div>div+div');
						this.nodeSeatsMy         = document.body.querySelector('div.app-content ol+div+div>div>div>div');
						//this.nodeSeatsForBooking = document.body.querySelector('div.app-content meta[itemprop="description"]+div+div button+span+span');
						this.nodeSeatsForBooking = document.body.querySelector('div.app-content ol+div button+span+span');
						//this.nodeButtonAddSeats  = document.body.querySelector('div.app-content meta[itemprop="description"]+div+div span+button');
						this.nodeButtonAddSeats  = document.body.querySelector('div.app-content ol+div span+button');
						this.nodeSeatsAvailable = this.nodeButtonAddSeats
							? document.body.querySelector('div.app-content ol+div div>div+div+div>div+div')
							: document.body.querySelector('div.app-content ol+div div>div+div+div>div>div')
						;
						this.nodeAncorPoputchiki = document.body.querySelector('div.app-content li+li+li>a[href^="/poputchiki/');
						//this.nodePrice           = document.body.querySelector('div.app-content meta[itemprop="description"]+div+div span');
						this.nodePrice           = document.body.querySelector('div.app-content ol+div div>div+div>div>div>span');
						//this.nodeButtonCancel    = document.body.querySelector('div.app-content div+button');
						this.nodeCancelCauseShowList = document.body.querySelector('section>form div[tabindex="0"]>div');
						this.nodeCancelCauseCurrent  = document.body.querySelector('section>form div[tabindex="0"]>span');
						this.nodesCancelCause        = document.body.querySelectorAll('body section>form a[title]')
						this.nodeCancelCauseButtonOk = document.body.querySelector('body section>form button[type="submit"]');
						this.nodePayCash             = document.body.querySelector('input[value="cash"]');
						this.nodePaySubmit           = document.body.querySelector('section form button[type="submit"]');
						this.nodeErrorMessage        = document.body.querySelector('section img+div');
						this.ok = !!this.nodeTime;
						if (this.nodeTime) {
							let arrTime = this.nodeTime.innerText.match(/(\d+):(\d+)/);
							this.ok = this.ok && arrTime;
							if (arrTime) this.time = new Date(arr[3], arr[2] - 1, arr[1], arrTime[1], arrTime[2]);
						}
						if (!!this.nodeSeatsAvailable) {
							let arrSeatsAvailable = this.nodeSeatsAvailable.innerText.match(/\d+/);
							if (!!arrSeatsAvailable) this.seatsAvailable = Number(arrSeatsAvailable[0]);
							this.noSeatsAvailable = this.nodeSeatsAvailable.innerText.indexOf('Мест нет') != -1;
						}
						if (!!this.nodeSeatsForBooking) {
							let arrSeatsForBooking = this.nodeSeatsForBooking.innerText.match(/(\d+)/);
							if (!!arrSeatsForBooking) this.seatsForBooking = Number(arrSeatsForBooking[1]);
						}
						if (!!this.nodePrice) {
							let arrPrice = this.nodePrice.innerText.match(/\d+/g);
							if (!!arrPrice) this.price = Number(arrPrice[arrPrice.length < 2 ? 0 : 1]);
						}
						if (!!this.nodeSeatsMy) {
							let a = this.nodeSeatsMy.innerText.match(/\d+/);
							this.booked   = this.nodeSeatsMy.innerText.indexOf('Забронировано') != -1;
							this.canceled = this.nodeSeatsMy.innerText.indexOf('отменили'     ) != -1;
							this.otklonena = this.nodeSeatsMy.innerText.indexOf('отклонена'    ) != -1;
							if (!!a && !this.canceled && !this.otlonena) {
								this.seatsMy  = Number(a[0]);
								if (this.seatsMy) this.nodeButtonCancel = document.body.querySelector('div.app-content div+button');
							}
						}
						if (this.nodeErrorMessage) this.errorLimit = this.nodeErrorMessage.innerText.indexOf('Превышен лимит') != -1;
					}
				}
			}
			super.init();
			this.nodeButtonMytrips = document.body.querySelector('button[aria-label="create-trip-button"]+div button+button');
			this.trip = new MyTrip();
			this.ok = this.ok && this.trip.ok;
			this.promise = this.promise.then(() => this.trip.promise);
		}
	} // class PagePoezdka

	class PageMytrips extends PageBeepcar {
		init() {
			super.init();
			this.nodeDialogCloseButton = document.body.querySelector('section[role="body"] button');
			this.nodesTripAncor        = document.body.querySelectorAll('a[href^="/poezdka/"]');
		}
	} // PageMytrips
	

	class ToolBlockTrip extends Tool {
		remove() {
			//if (this.nodes) for (let nd of this.nodes) nd.remove();
			if (this.node) this.node.remove();
			return super.remove();
		}
		initPlans() {
			//super.initPlans();
			this.plans = {
				reinit    : {action: () => '', getTimeout: () => 5000},
				stop      : {action: () => this.mainTool.nodeStart.checked = false, getTimeout: () => 1000},
				poputchiki: {
					prevMonth    : {action: () => this.page.nodeCalendarMonthPrev.click()},
					nextMonth    : {action: () => this.page.nodeCalendarMonthNext.click()},
					selectDay    : {action: () => this.page.nodesCalendarDay[this.curTime.getDate() - 1].click()},
					showCalendar : {action: () => this.page.nodeDateInput.click()},
					openTrip     : {action: () => this.firstBlockTrip.nodeAncorPoezdka.click()},
					showMoreTrips: {action: () => {
						//this.hide();
						this.page.scroll();
						//this.show();
					}},
					tripNotfound : {action: () => this.page.nodeDateInput.click(), getTimeout: () => this.minutesCheckPoputchiki * 60000 + this.getTimeoutHuman()}
				},
				poezdka: {
					goToPoputchiki      : {action: () => this.page.trip.nodeAncorPoputchiki.click()},
					addSeat             : {action: () => this.page.trip.nodeButtonAddSeats.click()},
					selectCouseUnbooking: {action: () => {
						let causes = [2, 4, 6, 7];
						this.page.trip.nodesCancelCause[causes[Math.floor(Math.random() * causes.length)]].click();
					}},
					submitCouseUnbooking: {action: () => this.page.trip.nodeCancelCauseButtonOk.click()},
					showCousesUnbooking : {action: () => this.page.trip.nodeCancelCauseShowList.click()},
					submitUnbooking     : {action: () => this.page.trip.nodeButtonCancel.click()},
					selectCashPayMethod : {action: () => this.page.trip.nodePayCash.click()},
					submitPayMethod     : {action: () => this.page.trip.nodePaySubmit.click()},
					submitBooking       : {action: () => this.page.trip.nodeButtonBooking.click()},
					waitReload          : {action: () => location.reload(), getTimeout: () => this.minutesBooking * 60000 + this.getTimeoutHuman()},
					goToMytrips         : {action: () => this.page.nodeButtonMytrips.click()}
				},
				mytrips: {
					dialogClose: {action: () => this.page.nodeDialogCloseButton.click()},
					goToTrip   : {action: () => this.nodeTripAncor.click(), getTimeout: () => this.minutesBooking * 60000 + this.getTimeoutHuman()}
				}
			};
		}
		init() {
			let isPoputchiki = regHrefPoputchiki.test(location.href);
			let isPoezdka    = regHrefPoezdka.test(location.href);
			let isMytrips    = regHrefMytrips.test(location.href);
			let isNoPage     = !isPoputchiki && !isPoezdka && !isMytrips;
			this.page = new (
				isPoputchiki ? PagePoputchiki :
				isPoezdka    ? PagePoezdka    :
				isMytrips    ? PageMytrips    :
				               PageBeepcar
			)();
			let now                       = this.page.getNow();
			this.prefixTool               = 'toolBlockTrip_';
			this.idStart                  = this.prefixTool + 'start';
			this.idMinutesCheckPoputchiki = this.prefixTool + 'minutesCheckPoputchiki';
			this.idMinutesBooking         = this.prefixTool + 'minutesBooking';
			this.idMinutesWait            = this.prefixTool + 'minutesWait';
			this.idMaxPrice               = this.prefixTool + 'maxPrice';
			this.idMinTime                = this.prefixTool + 'minTime';
			this.idMaxTime                = this.prefixTool + 'maxTime';
			this.minTime                  = now;
			this.maxTime                  = now;
			this.minTime.setHours(0, 0, 0, 0);
			this.maxTime.setHours(23, 59, 59, 999);
			this.node            = createNodeTool();
			this.nodeCopyDrivers     = this.createElementCopyDrivers();
			this.nodePasteDrivers    = this.createElementPasteDrivers();
			this.nodeNotBlockDrivers = document.createElement('ul');
			this.drivers = {};
			let promise = Promise.all([
				this.page.promise,
				gm.getValue(this.idMinutesCheckPoputchiki,     5).then(v => this.minutesCheckPoputchiki = v).then(() => this.nodeMinutesCheckPoputchiki = this.createElementMinutesCheckPoputchiki()),
				gm.getValue(this.idMinutesBooking,            16).then(v => this.minutesBooking         = v).then(() => this.nodeMinutesBooking         = this.createElementMinutesBooking()        ),
				gm.getValue(this.idMinutesWait,                2).then(v => this.minutesWait            = v).then(() => this.nodeMinutesWait            = this.createElementMinutesWait()           ),
				gm.getValue(this.idMaxPrice,                1500).then(v => this.maxPrice               = v).then(() => this.nodeMaxPrice               = this.createElementMaxPrice()              ),
				Promise.all([
					gm.getValue(this.idMinTime, this.minTime.toISOString()).then(v => this.minTime = new Date(v)),
					gm.getValue(this.idMaxTime, this.maxTime.toISOString()).then(v => this.maxTime = new Date(v))
				]).then(() => this.nodePeriod = this.createElementMyPeriod())
			]).then(() => {
				if (isPoputchiki) this.page.nodePanelLeft.style.position = 'absolute';
				let node2 = document.createElement('div');
				node2.appendChild(document.createTextNode(' Booking every '));
				node2.appendChild(this.nodeMinutesBooking);
				node2.appendChild(document.createTextNode(' and then '));
				node2.appendChild(this.nodeMinutesWait);
				node2.appendChild(document.createTextNode(' minutes. Max price: '));
				node2.appendChild(this.nodeMaxPrice);
				node2.appendChild(document.createTextNode('.'));
				node2.appendChild(this.nodePeriod);
				this.node.appendChild(document.createTextNode(' Block every  '));
				this.node.appendChild(this.nodeMinutesCheckPoputchiki);
				this.node.appendChild(document.createTextNode(' minutes: '));
				this.node.appendChild(node2);
				this.node.appendChild(this.createElementDriversTool());
			});
			if (!!this.page.trip) promise = promise.then(() => this.addDriver(this.page.trip.driver));
			if (!!this.page.trips) for (let trip of this.page.trips) if (!!trip && !!trip.driver) promise = promise.then(() => this.addDriver(trip.driver));
			return promise
			.then(() => gm.listValues())
			.then(v => {
				let objTrips = {};
				let prm;
				for(let key of v) {
					let arrKey = key.match(/driver_([0-9a-zA-Z]+)_notBlockTrip/);
					if (!!arrKey) this.addDriver(new Driver(arrKey[1]));
					arrKey = key.match(regPrefixTrip);
					if (!!arrKey) {
						let id   = arrKey[1];
						let trip = objTrips[id] ? objTrips[id] : (objTrips[id] = new Trip(id));
						trip.promise.then(() => trip.time < now ? gm.deleteValue(key) : '');
					}
				}
				let disabled = (this.mainTool.nodeStart.checked ? 'disabled' : '');
				this.nodeMinutesCheckPoputchiki.disabled = disabled;
				this.nodeMinutesBooking.disabled         = disabled;
				this.nodeMinutesWait.disabled            = disabled;
				this.nodeCopyDrivers.disabled            = disabled;
				this.nodePasteDrivers.disabled           = disabled;
				this.nodeMaxPrice.disabled               = disabled;
				for(let k in this.drivers) this.drivers[k].nodeNot.disabled = disabled;
				let now = this.page.getNow();
				if (isNoPage || !this.page.ok) {
					this.setPlan(this.plans.reinit);
				} else if (this.maxTime < now) {
					this.setPlan(this.plans.stop);
				} else {
					let plans;
					if (isPoputchiki) {
						plans = this.plans.poputchiki;
						this.firstBlockTrip = null;
						//this.nodes = [];
						for (let i = 0; i < this.page.trips.length; i++) {
							let trip = this.page.trips[i];
							if (!!trip) {
								trip.setMaxPrice(this.maxPrice);
								trip.setMinMaxTime(this.minTime, this.maxTime);
								let notBlock = (trip.driver && trip.driver.notBlockTrip )
									|| trip.notBlock
									|| !trip.asSearch
									|| trip.seatsAvailable < 1
								;
								if (!this.firstBlockTrip && !notBlock) this.firstBlockTrip = trip;
								this.page.nodesTrip[i].style.border = notBlock ? 'solid green 2px' : 'solid red 2px';
							}
						}
						//console.log('this.mainTool = ', this.mainTool);
						this.curTime = this.minTime > now ? this.minTime : now;
						//console.log('this.page.nodeCalendar = ', this.page.nodeCalendar);
						//console.log('now = ', now);
						if (this.page.filterIsOld) {
							this.setPlan(this.plans.stop);
						} else if (!!this.page.nodeCalendar) {
							// Calendar
							if (
								this.page.existFilterTime &&
								this.page.maxTime < this.maxTime &&
								this.page.last &&
								this.page.trips.length &&
								this.page.trips[this.page.trips.length - 1].time < this.maxTime
							) this.curTime.setDate(this.page.minTime.getDate() + 1); // Next day
							let curMonth = new Date(this.curTime.getFullYear(), this.curTime.getMonth());
							if (curMonth < this.page.calendarMonth) {
								// Next month
								this.setPlan(plans.prevMonth, this.page.nodeCalendarMonthPrev);
							} else if (curMonth > this.page.calendarMonth) {
								// Prev month
								this.setPlan(plans.nextMonth, this.page.nodeCalendarMonthNext);
							} else {
								// Select day
								this.setPlan(plans.selectDay, this.page.nodesCalendarDay[this.curTime.getDate() - 1]);
							}
						} else if (
							!this.page.existFilterTime ||
							this.page.minTime > this.maxTime ||
							this.page.maxTime < this.curTime
						) {
							// Show calendar
							this.setPlan(plans.showCalendar, this.page.nodeDateInput);
						} else if (this.firstBlockTrip) {
							// Open trip
							this.setPlan(plans.openTrip);
						} else if (
							!this.page.last &&
							this.page.trips.length &&
							this.page.trips[this.page.trips.length - 1].time < this.maxTime
						) {
							// Show more trips
							this.setPlan(plans.showMoreTrips, this.page.nodeScroll);
						} else {
							// Trip not found
							this.setPlan(plans.tripNotfound, this.page.nodeDateInput);
						}
					} else if (isPoezdka) {
						plans = this.plans.poezdka;
						let noNeedBooking =
							this.page.trip.time < now ||
							this.page.trip.time < this.minTime ||
							this.page.trip.time > this.maxTime ||
							this.page.trip.driver.notBlockTrip ||
							this.page.trip.price > this.maxPrice
						;
						if (
							(
								noNeedBooking ||
								this.page.noSeatsAvailable ||
								this.page.trip.otklonena
							) && !this.page.trip.nodeButtonCancel
						) {
							if (this.page.trip.otklonena) {
								let t = new Date(this.page.trip.time);
								t.setSeconds(60);
								prm = Promise.all([
									gm.setValue(this.page.trip.idTime, this.trip.time.toISOString()),
									gm.setValue(this.page.trip.idNotBlock, true)
								]);
							}
							this.setPlan(plans.goToPoputchiki, this.page.trip.nodeAncorPoputchiki);
						} else if (
							this.page.trip.seatsAvailable > this.page.trip.seatsForBooking ||
							noNeedBooking
						) {
							// Present unbooked seat
							if (
								this.page.trip.nodeButtonAddSeats &&
								!noNeedBooking
							) {
								//if (this.planPrevBegin === plans.addSeat && this.page.trip.seatsForBooking === this.seatsForBookingPrev) this.setPlan(plans.goToPoputchiki);
								//else {
								this.setPlan(plans.addSeat, this.page.trip.nodeButtonAddSeats);
								//}
								this.seatsForBookingPrev = this.page.trip.seatsForBooking;
							} else if (
								this.page.trip.nodesCancelCause.length > 6 &&
								window.getComputedStyle(this.page.trip.nodesCancelCause[0]).visibility == "visible"
							) {
								// Select couse of unbooking
								this.setPlan(plans.selectCouseUnbooking, this.page.trip.nodesCancelCause);
							} else if (
								!!this.page.trip.nodeCancelCauseCurrent &&
								this.page.trip.nodeCancelCauseCurrent.innerText != ''
							) {
								// Submit couse of unbooking
								this.setPlan(plans.submitCouseUnbooking, this.page.trip.nodeCancelCauseButtonOk);
							} else if (!!this.page.trip.nodeCancelCauseShowList) {
								// Show list of couses of unbooking
								this.setPlan(plans.showCousesUnbooking, this.page.trip.nodeCancelCauseShowList);
							} else if (
								this.page.trip.nodeButtonCancel && (
									this.page.trip.seatsAvailable > (this.page.trip.booked ? 0 : this.page.trip.seatsMy) ||
									noNeedBooking
								)
							) {
								// Submit unbooking
								this.setPlan(plans.submitUnbooking, this.page.trip.nodeButtonCancel);
							} else this.setPlan(plans.waitReload); // Wait & reload
						} else if (
							this.page.trip.nodePayCash
							&& !this.page.trip.nodePayCash.checked
						) {
							// Select cash pay method
							this.setPlan(plans.selectCashPayMethod, this.page.trip.nodePayCash);
						} else if (this.page.trip.nodePaySubmit) {
							// Submit pay method
							this.setPlan(plans.submitPayMethod, this.page.trip.nodePaySubmit);
						} else if (this.page.trip.errorLimit) {
							// Go to Mytrips
							this.setPlan(plans.goToMytrips, this.page.nodeButtonMytrips);
						} else if (this.page.trip.nodeButtonBooking) {
							// Submit booking
							this.setPlan(plans.submitBooking, this.page.trip.nodeButtonBooking);
						} else this.setPlan(plans.waitReload);// Wait & reload
					} else if (isMytrips) {
						plans = this.plans.mytrips;
						if (this.page.nodeDialogCloseButton) {
							this.setPlan(plans.dialogClose, this.page.nodeDialogCloseButton);
						} else if (this.page.nodesTripAncor.length) {
							this.nodeTripAncor = this.page.nodesTripAncor[0];
							if (this.nodeTripAncor) {
								this.setPlan(plans.goToTrip, this.nodeTripAncor);
							} else this.setPlan(this.plans.stop);
						} else this.setPlan(this.plans.reinit);
					}
				}
				return prm;
			}).then(() => super.init());
		}
		createElementMinutesCheckPoputchiki() {
			return createElementNumber(0, 600, 3,
				(v) => gm.setValue(this.idMinutesCheckPoputchiki, this.minutesCheckPoputchiki = v),
				this.minutesCheckPoputchiki
			);
		}
		createElementMinutesBooking() {
			return createElementNumber(0, 600, 3,
				v => gm.setValue(this.idMinutesBooking, this.minutesBooking = v),
				this.minutesBooking
			);
		}
		createElementMinutesWait() {
			return createElementNumber(0, 600, 3,
				v => gm.setValue(this.idMinutesWait, this.minutesWait = v),
				this.minutesWait
			);
		}
		createElementMaxPrice() {
			return createElementNumber(10, 999990, 6, 
				v => this.promise = this.promise
					.then(() => gm.setValue(this.idMaxPrice, this.maxPrice = v))
					.then(() => this.reinit()),
				this.maxPrice, 10
			);
		}
		createElementMyPeriod() {
			let minValue = this.page.getNow();
			let maxValue = this.page.getNow();
			maxValue.setFullYear(maxValue.getFullYear() + 1);
			return createElementPeriodHidable({
				minValue:     minValue,
				maxValue:     maxValue,
				setValue1:    (newValue => this.promise = this.promise.then(() => gm.setValue(this.idMinTime, (this.minTime = newValue).toISOString()))),
				setValue2:    (newValue => this.promise = this.promise.then(() => gm.setValue(this.idMaxTime, (this.maxTime = newValue).toISOString()))),
				value1:       this.minTime,
				value2:       this.maxTime,
				onChanged:    (() => this.promise = this.promise.then(() => this.reinit())    ),
				onMouseEnter: (() => this.freeze()  ),
				onMouseLeave: (() => this.unfreeze())
			});
		}
		createElementCopyDrivers() {
			return createElementButtonCopy(
				this.node,
				'copy',
				() => this.getPromiseDriverString()
			);
		}
		getPromiseDrivers2String() {
			return this.promise = this.promise.then(() => {
				let value = '';
				for(let driver of this.drivers) if (driver.notBlockTrip) value = value + '<driver id="' + driver.id + '" name="' + driver.name + '" />\n';
				return value;
			});
		}
		createElementPasteDrivers() {
			return createElementButtonPaste(
				this.node,
				'paste',
				(v) => this.string2Drivers(v)
			);
		}
		string2Drivers(v) {
			let arrDrv = v.match(/<driver[^\/]+\/>/g);
			if (!!arrDrv) for(let drv of arrDrv) {
				let arrId   = drv.match(/\bid=["']([^"']*)["']/);
				let arrName = drv.match(/\bname=["']([^"']*)["']/);
				if (!!arrId) {
					let driver = new Driver(arrId[1], !!arrName ? arrName[1] : null);
					this.promise = this.promise
						.then(() => driver.promise)
						.then(() => driver.notBlockTrip = true)
						.then(() => Promise.all([
							gm.setValue(driver.idNotBlockTrip, driver.notBlockTrip),
							gm.setValue(driver.idName,         driver.name        )
						]))
						.then(() => this.addDriver(driver));
				}
			}
		}
		createElementDriversTool() {
			let nd = document.createElement('div');
			nd.appendChild(document.createTextNode('Not block ('));
			nd.appendChild(this.nodeCopyDrivers);
			nd.appendChild(this.nodePasteDrivers);
			nd.appendChild(document.createTextNode('):'));
			nd.appendChild(this.nodeNotBlockDrivers);
			setElementStyleHidable({
				nodeMain: nd,
				nodeHidable: this.nodeNotBlockDrivers,
				onMouseEnter: (() => this.freeze()),
				onMouseLeave: (() => this.unfreeze())
			});
			return nd;
		}
		addDriver(driver) {
			if (!!driver && !this.drivers[driver.id]) {
				let nd = document.createElement('li');
				driver.nodeNot = createElementCheckbox(
					(newValue) => {
						driver.notBlockTrip = newValue;
						this.promise = this.promise
							.then(() => Promise.all(newValue ? [
								gm.setValue(driver.idNotBlockTrip, newValue   ),
								gm.setValue(driver.idName,         driver.name)
							] : [
								gm.deleteValue(driver.idNotBlockTrip),
								gm.deleteValue(driver.idName        )
							]))
							.then(() => this.reinit());
					},
					driver.notBlockTrip
				);
				nd.appendChild(driver.nodeNot);
				nd.appendChild(document.createTextNode(' ' + driver.name + ' / ' + driver.id));
				this.drivers[driver.id] = driver;
				this.nodeNotBlockDrivers.appendChild(nd);
			}
		}
	} // class ToolBlockTrip

	
	function createNodeTool(style = '') {
		let nd = document.createElement('div');
		nd.setAttribute('style', 'border:2px solid red;padding:4px;' + style);
		return nd;
	}
	
	function createElementNumber(minValue, maxValue, widthEm, setValue, value, step = 1) {
		let nd = document.createElement('input');
		nd.setAttribute('type', 'number');
		nd.setAttribute('min', minValue);
		nd.setAttribute('max', maxValue);
		if (step != 1) nd.setAttribute('step', '10');
		nd.setAttribute('style', 'width:' + widthEm + 'em');
		nd.addEventListener('change', (event => {
			event.preventDefault();
			setValue(nd.value);
		}));
		nd.value = value;
		return nd;
	}
	
	function createElementNumber1(widthEm) {
		let nd = document.createElement('input');
		nd.setAttribute('type', 'number');
		nd.setAttribute('style', 'width:' + widthEm + 'em');
		return nd;
	}
	
	function createElementsTime() {
		return {
			year:   createElementNumber1(4),
			month:  createElementNumber1(3),
			date:   createElementNumber1(3),
			hour:   createElementNumber1(3),
			minute: createElementNumber1(3),
		}
	}
	function getElementsTimeValue(nds) {
		return new Date(nds.year.value, nds.month.value - 1, Math.min(nds.date.value, new Date(nds.year.value, nds.month.value, 0).getDate()), nds.hour.value, nds.minute.value);
	}
	function setElementsTimeMinMax(nds, getMin, getMax) {
			let minValue  = getMin();
			let maxValue  = getMax();
			let minYear   = minValue.getFullYear();
			let maxYear   = maxValue.getFullYear();
			let minMonth  = 1;
			let maxMonth  = 12;
			let minDate   = 1;
			let maxDate   = new Date(nds.year.value, nds.month.value, 0).getDate();
			let minHour   = 0;
			let maxHour   = 23;
			let minMinute = 0;
			let maxMinute = 59;
			if (nds.year.value == minYear) {
				minMonth = minValue.getMonth() + 1;
				if (nds.month.value == minMonth) {
					minDate = minValue.getDate();
					if (nds.date.value == minDate) {
						minHour = minValue.getHours();
						if (nds.hour.value == minHour) {
							minMinute = minValue.getMinutes();
						} 
					}
				}
			}
			if (nds.year.value == maxYear) {
				maxMonth = maxValue.getMonth() + 1;
				if (nds.month.value == maxMonth) {
					maxDate = maxValue.getDate();
					if (nds.date.value == maxDate) {
						maxHour = maxValue.getHours();
						if (nds.hour.value == maxHour) {
							maxMinute = maxValue.getMinutes();
						} 
					}
				}
			}
			nds.year.setAttribute(  'min', '' + minYear);
			nds.year.setAttribute(  'max', maxYear);
			nds.month.setAttribute( 'min', minMonth);
			nds.month.setAttribute( 'max', maxMonth);
			nds.date.setAttribute(  'min', minDate);
			nds.date.setAttribute(  'max', maxDate);
			nds.hour.setAttribute(  'min', minHour);
			nds.hour.setAttribute(  'max', maxHour);
			nds.minute.setAttribute('min', minMinute);
			nds.minute.setAttribute('max', maxMinute);
			//console.log('getMin(): ', minValue);
			//console.log('getMax(): ', maxValue);
			//console.log('min: ', minYear, minMonth, minDate, minHour, minMinute);
			//console.log('max: ', maxYear, maxMonth, maxDate, maxHour, maxMinute);
	}
	function createElementTime(nds, getMin, getMax, setValue, value) {
		let onChange = (event) => {
			event.preventDefault();
			let minValue = getMin();
			let maxValue = getMax();
			value = getElementsTimeValue(nds);
			if (value < minValue) value = minValue;
			else if (value > maxValue) value = maxValue;
			let year   = value.getFullYear();
			let month  = value.getMonth() + 1;
			let date   = value.getDate();
			let hour   = value.getHours();
			let minute = value.getMinutes();
			if (nds.year.value   != year)   nds.year.value   = year;
			if (nds.month.value  != month)  nds.month.value  = month;
			if (nds.date.value   != date)   nds.date.value   = date;
			if (nds.hour.value   != hour)   nds.hour.value   = hour;
			if (nds.minute.value != minute) nds.minute.value = minute;
			setValue(value);
		};
		nds.year.value   = value.getFullYear();
		nds.month.value  = value.getMonth() + 1;
		nds.date.value   = value.getDate();
		nds.hour.value   = value.getHours();
		nds.minute.value = value.getMinutes();
		nds.year.addEventListener('change', onChange);
		nds.month.addEventListener('change', onChange);
		nds.date.addEventListener('change', onChange);
		nds.hour.addEventListener('change', onChange);
		nds.minute.addEventListener('change', onChange);
		let nd   = document.createElement('span');
		nd.setAttribute('style', 'border:1px solid blue;padding:2px;');
		nd.appendChild(nds.year);
		nd.appendChild(document.createTextNode('-'));
		nd.appendChild(nds.month);
		nd.appendChild(document.createTextNode('-'));
		nd.appendChild(nds.date);
		nd.appendChild(document.createTextNode('T'));
		nd.appendChild(nds.hour);
		nd.appendChild(document.createTextNode(':'));
		nd.appendChild(nds.minute);
		return nd;
	}
	
	function createElementPeriod(minValue, maxValue, setValue1, setValue2, value1, value2) {
		let nodesTime1 = createElementsTime();
		let nodesTime2 = createElementsTime();
		let getMin1 = (() => minValue);
		let getMax1 = (() => getElementsTimeValue(nodesTime2));
		let getMin2 = (() => getElementsTimeValue(nodesTime1));
		let getMax2 = (() => maxValue);
		let setMinMax = (() => {
			//console.log('setElementsTimeMinMax(nodesTime1, getMin1, getMax1):');
			setElementsTimeMinMax(nodesTime1, getMin1, getMax1);
			//console.log('setElementsTimeMinMax(nodesTime2, getMin2, getMax2):');
			setElementsTimeMinMax(nodesTime2, getMin2, getMax2);
		});
		let nodeTime1 = createElementTime(
			nodesTime1,
			getMin1,
			getMax1,
			(newValue => {
					setValue1(newValue);
					setMinMax();
			}),
			value1
		);
		let nodeTime2 = createElementTime(
			nodesTime2,
			getMin2,
			getMax2,
			(newValue => {
				setValue2(newValue);
				setMinMax();
			}),
			value2
		);
		let nd = document.createElement('div');
		nd.setAttribute('style', 'padding-top:5px;padding-bottom:4px;');
		nd.appendChild(document.createTextNode('Time: '));
		nd.appendChild(nodeTime1);
		nd.appendChild(document.createTextNode(' - '));
		nd.appendChild(nodeTime2);
		nd.appendChild(document.createTextNode('.'));
		return nd;
	}
	
	function createElementPeriodHidable(args /*{minValue, maxValue, setValue1, setValue2, value1, value2, onChanged, onMouseEneter, onMouseLeave}*/) {
		let nd = document.createElement('div');
		let nodeView = document.createElement('div');
		let changed = false;
		let nodeSubview1 = document.createTextNode('');
		let nodeSubview2 = document.createTextNode('');
		let setSubview = ((nodeSubview, value) => nodeSubview.data = value.toISOString().substr(0, 16));
		nodeView.appendChild(nodeSubview1);
		nodeView.appendChild(document.createTextNode('><'));
		nodeView.appendChild(nodeSubview2);
		setSubview(nodeSubview1, args.value1);
		setSubview(nodeSubview2, args.value2);
		let nodeInput = createElementPeriod(
			args.minValue,
			args.maxValue,
			(newValue => {
				setSubview(nodeSubview1, newValue);
				args.setValue1(newValue);
				changed = true;
			}),
			(newValue => {
				setSubview(nodeSubview2, newValue);
				args.setValue2(newValue);
				changed = true;
			}),
			args.value1,
			args.value2
		);
		nd.appendChild(nodeView);
		nd.appendChild(nodeInput);
		setElementStyleHidable({
			nodeMain: nd,
			nodeHidable: nodeInput,
			onMouseEnter: (() => args.onMouseEnter()),
			onMouseLeave: (() => {
				args.onMouseLeave();
				if (changed) args.onChanged();
			})
		});
		return nd;
	}
	
	function createElementCheckbox(setValue, value) {
		let nd = document.createElement('input');
		nd.setAttribute('type', 'checkbox');
		nd.checked = value;
		nd.addEventListener(
			'change',
			(event => {
				event.preventDefault();
				setValue(nd.checked)
			})
		);
		return nd;
	}

	function createElementButton(text, onClick) {
		let nd = document.createElement('button');
		nd.appendChild(document.createTextNode(text));
		nd.addEventListener('click',
			(event => {
				event.preventDefault();
				onClick();
			})
		);
		return nd;
	}
	
	function createElementButtonCopy(nd, text, getValue) {
		return createElementButton(text, () => getValue().then(v => copy(nd, v)));
	}
	function createElementButtonPaste(nd, text, setValue) {
		return createElementButton(text, () => paste(nd, setValue));
	}
	
	function setElementStyleHidable(args) { // args{nodeMain, nodeHidable, onMouseEnter, onMouseLeave}
		args.nodeMain.setAttribute('style', 'background-color:green;padding:5px;border-radius:15px;display:inline-block;');
		args.nodeHidable.setAttribute('style', 'z-index:999;background-color:green;border-radius:15px;position:absolute;display:none;');
		args.nodeMain.addEventListener(
			'mouseenter',
			(event => {
				event.preventDefault();
				args.nodeHidable.setAttribute('style', args.nodeHidable.getAttribute('style').replace(/\bdisplay:\b\w+\b/, 'display:block'));
				args.onMouseEnter();
			})
		);
		args.nodeMain.addEventListener(
			'mouseleave',
			(event => {
				event.preventDefault();
				args.nodeHidable.setAttribute('style', args.nodeHidable.getAttribute('style').replace(/\bdisplay:\b\w+\b/, 'display:none'));
				args.onMouseLeave();
			})
		);
	}
	function hideElement(nd) {
		nd.style.display = 'none';
	}
	function showElement(nd) {
		nd.style.display = nd.style.display.replace(/^none$/i, '');
	}

	function copy(nd, value) {
		let nodeCopy = document.createElement('input');
		nodeCopy.setAttribute('type', 'text');
		nodeCopy.value = value;
		nd.appendChild(nodeCopy);
		nodeCopy.select();
		document.execCommand('copy');
		nodeCopy.remove();
	}
	function paste(nd, setValue) {
		let nodePaste = document.createElement('textarea');
		nodePaste.setAttribute('placeholder', 'Press Ctrl+V or Paste here');
		nodePaste.addEventListener(
			'input',
			(event => {
				event.preventDefault();
				setValue(nodePaste.value);
				nodePaste.remove();
			})
		);
		nd.appendChild(nodePaste);
		nodePaste.select();
	}
	
	if (typeof GM == 'undefined') {
		gm = {
			getValue: ((key, value) => new Promise((resolve, reject) => {
      			try {
        			resolve(GM_getValue(key, value));
      			} catch (e) {
        			reject(e);
      			}
    		})),
			setValue: ((key, value) => new Promise((resolve, reject) => {
      			try {
        			resolve(GM_setValue(key, value));
      			} catch (e) {
        			reject(e);
      			}
    		})),
			deleteValue: ((key) => new Promise((resolve, reject) => {
      			try {
        			resolve(GM_deleteValue(key));
      			} catch (e) {
        			reject(e);
      			}
    		})),
			listValues: (() => new Promise((resolve, reject) => {
      			try {
        			resolve(GM_listValues());
      			} catch (e) {
        			reject(e);
      			}
    		})),
		};
	} else gm = GM;
	gm.deleteValues = (() => gm.listValues().then(v => Promise.all(v.map(key => gm.deleteValue(key)))));
	gm.showValues   = (() => gm.listValues().then(v => console.log(v)));
	
	let mainTool = new MainTool(ToolBlockTrip);
})();
