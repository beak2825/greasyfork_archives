// ==UserScript==
// @name         bv7_beepcar_dark
// @namespace    bv7
// @version      1.4
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
// @downloadURL https://update.greasyfork.org/scripts/39711/bv7_beepcar_dark.user.js
// @updateURL https://update.greasyfork.org/scripts/39711/bv7_beepcar_dark.meta.js
// ==/UserScript==


(function() {
	'use strict';

	let gm;
	//const regHrefPoputchiki = /\/poputchiki\/([^_]+_[^\?]+)\?/;
	const regHrefPoputchiki = /\/poputchiki/;
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
						gm.getValue('timeoutHuman',       1000),
						gm.getValue('timeoutHumanAddMax', 4000)
					])
					.then(v => this.getTimeoutHuman = () => v[0] + Math.random() * v[1]),
					gm.getValue('timeoutCheckAddMax', 60000).then(v => this.timeoutCheckAdd = v * Math.random()),
					this.initPlans(),
					this.setTimeout(5000)
				])
				//.then(() => this.initPlans())
				//.then(() => this.setTimeout(5000))
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
			this.mainTool.nodeChild.appendChild(this.node);
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
			this.mainTool.promise = Promise.all([
				this.mainTool.promise,
				prm
			]);
			return this.promise = Promise.all([
				this.promise,
				prm
			]);
		}
		minutesToTimeoutCheck(minutes) {
			return minutes * 60000 + this.timeoutCheckAdd;
		}
		setPlan(plan, nd) {
			this.plan = plan;
			if (!nd && plan.getNode) nd = plan.getNode();
			if (nd) this.setBorder(nd, this.plan === this.planBegin ? '' : 'solid red 2px');
		}
		setBorder(nd, style) {
			if (nd) {
				if (nd instanceof NodeList) for (let i = 0; i < nd.length; i++) nd[i].style.border = style;
				else nd.style.border = style;
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
				/*
				this.node = createNodeTool();
				let nd1 = document.createElement('div');
				this.nodeChild = document.createElement('div');
				setElementStyleHidable({nodeMain: nd1, nodeHidable: this.nodeChild})
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
				//nd1.appendChild(this.nodeChild);
				this.node.appendChild(nd1);
				this.node.appendChild(this.nodeChild);
				*/
				this.node = createNodeTool();
				//let nd1 = document.createElement('div');
				this.nodeChild = document.createElement('div');
				setElementStyleHidable({nodeMain: this.node, nodeHidable: this.nodeChild})
				this.node.setAttribute('style', 'z-index:999;position:relative;');
				this.nodeNext  = createElementButton('-:--', () => this.tool.complitePlan());
				//this.nodeTimer       = document.createTextNode('');
				this.nodeTimer = this.nodeNext.firstChild;
				this.nodeReset = this.createElementReset();
				this.node.appendChild(this.nodeStart);
				this.node.appendChild(document.createTextNode(' Start '));
				this.node.appendChild(this.nodeNext);
				this.node.appendChild(this.nodeReset);
				this.node.appendChild(this.createElementLog());
				//nd1.appendChild(this.nodeChild);
				//this.node.appendChild(nd1);
				this.node.appendChild(this.nodeChild);
				
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
				() => {
					console.log('MainTool: ', this);
					gm.showValues();
				}
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
			let prms = [gm.getValue(this.idNotBlockTrip, false).then((v) => this.notBlockTrip = v)];
			if (name) this.name = name;
			else prms.push(gm.getValue(this.idName, '').then((v) => this.name = v));
			this.promise = Promise.all(prms);
		}
	} // class Driver
	class Trip {
		constructor(id, driver, time, seatsRequested) {
			this.id               = id;
			this.prefix           = prefixTrip + this.id + '_';
			this.idNotBlock       = this.prefix + 'notBlock';
			this.idTime           = this.prefix + 'time';
			this.idCountBookings  = this.prefix + 'countBookings';
			this.idSeatsRequested = this.prefix + 'seatsRequested';
			let prms = [gm.getValue(this.idNotBlock,  false)];
			if (driver) prms.push((this.driver = driver).promise.then(() => this.driver.notBlockTrip));
			prms = [
				Promise.all(prms).then((v) => this.notBlock = v.find((v) => v)),
				gm.getValue(this.idCountBookings, 0).then((v) => this.countBookings = v)
			];
			if (time) this.time = time;
			else prms.push(gm.getValue(this.idTime, 0).then((v) => this.time = v));
			if (typeof seatsRequested == 'undefined') prms.push(gm.getValue(this.idSeatsRequested, 0).then((v) => this.seatsRequested = v));
			else if (this.seatsRequested = seatsRequested) {
				if (time) prms.push(gm.setValue(this.idTime, this.time));
				prms.push(gm.setValue(this.idSeatsRequested, this.seatsRequested));
			} else {
				prms.push(gm.deleteValue(this.idSeatsRequested));
			}
			this.promise = Promise.all(prms);
		}
	} // class Trip

	class PageBeepcar extends Page {
		init () {
			super.init();
			this.timezoneOffset    = -180;
			this.trips             = null;
			this.nodeButtonSearch  = document.body.querySelector('button[aria-label="create-trip-button"]+* button');
			this.nodeButtonMytrips = document.body.querySelector('button[aria-label="create-trip-button"]+div button+button');
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
					let nodeTime         = nodeTrip.querySelector('a>div:first-child>div>div')
					//console.log('nodeAncorPoezdka = ', nodeAncorPoezdka);
					//console.log('nodeAncorDriver = ', nodeAncorDriver);
					pg.ok = !!nodeAncorPoezdka && !!nodeAncorDriver && nodeTime;
					if (pg.ok) {
						let arrId     = nodeAncorPoezdka.getAttribute('href').match(regHrefPoezdka);
						let arrDriver = nodeAncorDriver.getAttribute('href').match(/*pg.*/regHrefProfile);
						let arrTime   = nodeTime.innerText.match(/(\d+):(\d+)/);
						//console.log('arrId = ', arrId);
						//console.log('arrDriver = ', arrDriver);
						pg.ok         = !!arrId && !!arrDriver && arrTime;
						if (pg.ok) {
							//console.log('arrId = ', arrId);
							super(arrId[4], new Driver(arrDriver[1], nodeAncorDriver.innerText), new Date(arrId[3], arrId[2] - 1, arrId[1], arrTime[1], arrTime[2], 0, 0));
							this.priceAsSearch = true;
							this.timeAsSearch  = true;
							this.fromAsSearch  = true;
							this.toAsSearch    = true;
							this.nodeAncorPoezdka = nodeAncorPoezdka;
							this.nodeAncorDriver  = nodeAncorDriver;
							this.nodeTime         = nodeTime;
							this.nodeFrom         = nodeTrip.querySelector('a>div+div+div+div>div>div:first-child>div:nth-child(1)>div+div>div');
							this.nodeTo           = nodeTrip.querySelector('a>div+div+div+div>div>div:first-child>div:nth-child(2)>div+div>div');
							this.nodePrice        = nodeTrip.querySelector('a>div:first-child>div+div>span');
							this.nodeSeats        = nodeTrip.querySelector('a>div+div>span');
							pg.ok = !!this.nodeFrom && !!this.nodeTo && !!this.nodePrice && !!this.nodeTime && !!this.nodeSeats;
							if (pg.ok) {
								let arrPrice  = this.nodePrice.innerText.match(/\d+/);
								this.price = !!arrPrice ? Number(arrPrice[0]) : 0;
								let arrSeats  = this.nodeSeats.innerText.match(/\d+/);
								this.from           = this.nodeFrom.innerText;
								this.to             = this.nodeTo.innerText;
								this.seatsAvailable = arrSeats ? Number(arrSeats[0]) : 0;
								pg.promise = Promise.all([
									pg.promise,
									this.promise = this.promise.then(() => this.seatsAvailable -= this.seatsRequested)
								])
								.then(() => {
									this.fromAsSearch = -1 < this.from.toLowerCase().replace(/ё/g, 'е').indexOf(pg.from.toLowerCase().replace(/ё/g, 'е'));
									this.toAsSearch = -1 < this.to.toLowerCase().replace(/ё/g, 'е').indexOf(pg.to.toLowerCase().replace(/ё/g, 'е'));
									if (pg.existFilterTime) this.setMinMaxTime(pg.minTime, pg.maxTime);
								})
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
			this.nodePanelLeft       = document.evaluate('(//div[@aria-label="from-search-field"])[last()]/../../..', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			//                         document.querySelector('div.app-content>div>div>div>div>div:first-child>div>div:first-child');
			this.nodeAncorPrevSearch = document.evaluate('//div[text()="Вы недавно искали"]/following-sibling::div[1]//a[starts-with(@href,"/poputchiki/")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (this.nodeAncorPrevSearch) this.ok = true;
			else {
				this.nodeFrom   = document.querySelector('div>div[tabindex="-1"]:nth-child(1)>div[data-react-toolbox="input"]>input');
				this.nodeTo     = document.querySelector('div>div[tabindex="-1"]:nth-child(2)>div[data-react-toolbox="input"]>input');
				this.nodeScroll = document.querySelector('div.app-content>div>header+div>div>div>div:first-child');
				this.nodeNoMore = document.querySelector('div.app-content>div>header+div>div>div>div:first-child>div:nth-child(1)>div:nth-child(2)>div>div:nth-child(2)>div:last-child>h1');
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
					this.trips           = [];
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
					for (let i = 0; i < this.nodesTrip.length && this.ok; i++) this.trips.push(new MyTrip(this.nodesTrip[i], this));
				}
			}
		}
		scroll() {
			this.nodeScroll.scrollBy(0, 1000000);
		}
	} // PagePoputchiki

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
							super(id, nodeAncor ? nodeAncor.innerText : null);
							this.nodeAncor = nodeAncor;
						}
					}
					let arr      = location.href.match(regHrefPoezdka);
					let nodeTime = document.body.querySelector('div.app-content ol+div div>div>div>div');
					if (!!arr && !!nodeTime) {
						let arrTime = nodeTime.innerText.match(/(\d+):(\d+)/);
						if (arrTime) {
							super(arr[4], new MyDriver(), new Date(arr[3], arr[2] - 1, arr[1], arrTime[1], arrTime[2]));
							this.seatsAvailable      = 0;
							this.seatsForBooking     = 0;
							this.price               = 0;
							this.seatsMy             = 0;
							//this.nodeTime            = document.body.querySelector('div.app-content meta[itemprop="description"]+div+div>div>div>div');
							this.nodeTime            = nodeTime;
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
							this.ok                      = true;
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
			}
			super.init();
			this.trip = new MyTrip();
			this.ok = this.ok && this.trip.ok;
			this.promise = this.promise.then(() => this.trip.promise);
		}
	} // class PagePoezdka

	class PageMytrips extends PageBeepcar {
		init() {
			class MyTrip extends Trip {
				constructor(nd, pg) {
					let seatsRequested;
					let time;
					let id                = 0;
					let nodeAncor         = nd.querySelector('a[href^="/poezdka/"]');
					let nodeTime          = nd.querySelector('a>div:first-child>div>div');
					let arrSeatsRequested = document.evaluate('.//*[./*[starts-with(text(), "Заявка отправлена")]]', nd, null, XPathResult.STRING_TYPE, null).stringValue.match(/\d+/);
					let ok = nodeAncor && nodeTime;
					if (ok) {
						let arrId   = nodeAncor.getAttribute('href').match(regHrefPoezdka);
						let arrTime = nodeTime.innerText.match(/(\d+):(\d+)/);
						ok = arrId && arrTime;
						if (ok) {
							id   = arrId[4];
							time = new Date(arrId[3], arrId[2] - 1, arrId[1], arrTime[1], arrTime[2], 0, 0);
						}
					}
					if (arrSeatsRequested) {
						seatsRequested = Number(arrSeatsRequested[0]);
					}
					super(id, undefined, time, seatsRequested);
					this.ok = ok;
					this.nodeAncor = nodeAncor;
					this.nodeSeats = nodeAncor.querySelector('a>div+div>span');
					if (this.nodeSeats) {
						let arrSeats  = this.nodeSeats.innerText.match(/\d+/);
						this.seatsAvailable = (arrSeats ?  Number(arrSeats[0]) : 0) - this.seatsRequested;
					}
					pg.ok = pg.ok && this.ok;
					pg.promise = Promise.all([
						pg.promise,
						this.promise
					]);
					pg.actualTripsIdx[this.id] = this;
				}
			} // MyTrip
			super.init();
			this.actualTrips           = [];
			this.actualTripsIdx        = {};
			this.nodeDialogCloseButton = document.body.querySelector('section[role="body"] button');
			//this.nodesTripAncor        = document.body.querySelectorAll('a[href^="/poezdka/"]');
			let xprTripAncor           = document.evaluate('.//div[./div[1]/div/span][./div[2]//a[starts-with(@href,"/poezdka/")]]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

			/*
			document.evaluate('//div[text()="Мои поездки"]/following-sibling::div//a[starts-with(@href,"/poezdka/")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
			*/


			for(let i = 0; i < xprTripAncor.snapshotLength && this.ok; i++) this.actualTrips.push(new MyTrip(xprTripAncor.snapshotItem(i), this));
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
				reinit     : {action: () => '', getTimeout: () => 5000},
				stop       : {action: () => this.mainTool.nodeStart.checked = false, getTimeout: () => 1000},
				goToMytrips: {action: () => this.page.nodeButtonMytrips.click()},
				waitMytrips: {action: () => this.page.nodeButtonMytrips.click(), getTimeout: () => this.minutesBooking * 60000 + this.getTimeoutHuman()},
				goToSearch : {action: () => this.page.nodeButtonSearch.click()},
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
					tripNotfound  : {action: () => this.page.nodeDateInput.click(), getTimeout: () => this.minutesCheckPoputchiki * 60000 + this.getTimeoutHuman()},
					goToPrevSearch: {action: () => this.page.nodeAncorPrevSearch.click(), getNode: () => this.page.nodeAncorPrevSearch}
				},
				poezdka: {
					goToPoputchiki      : {action: () => this.page.trip.nodeAncorPoputchiki.click()},
					addSeat             : {action: () => this.page.trip.nodeButtonAddSeats.click()},
					selectCouseUnbooking: {action: () => this.nodeCancelCause.click()},
					submitCouseUnbooking: {action: () => this.page.trip.nodeCancelCauseButtonOk.click()},
					showCousesUnbooking : {action: () => this.page.trip.nodeCancelCauseShowList.click()},
					submitUnbooking     : {action: () => this.page.trip.nodeButtonCancel.click()},
					selectCashPayMethod : {action: () => this.page.trip.nodePayCash.click()},
					submitPayMethod     : {action: () => {
						gm.setValue(this.page.trip.idCountBookings, ++this.page.trip.countBookings);
						gm.setValue(this.page.trip.idTime, this.page.trip.time.toISOString());
						this.page.trip.nodePaySubmit.click();
					}},
					submitBooking       : {action: () => this.page.trip.nodeButtonBooking.click()},
					waitReload          : {action: () => location.reload(), getTimeout: () => this.minutesBooking * 60000 + this.getTimeoutHuman()}
				},
				mytrips: {
					dialogClose: {action: () => this.page.nodeDialogCloseButton.click()},
					goToTrip   : {action: () => this.trip.nodeAncor.click()}
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
			this.idMaxTrips               = this.prefixTool + 'maxTrips';
			this.idMaxBookings            = this.prefixTool + 'maxBookings';
			this.idTimeSetMaxTrips        = this.prefixTool + 'timeSetMaxTrips';
			this.minTime                  = new Date(now);
			this.maxTime                  = new Date(now);
			this.minTime.setHours(0, 0, 0, 0);
			this.maxTime.setHours(23, 59, 59, 999);
			this.node            = createNodeTool();
			this.nodeCopyDrivers     = this.createElementCopyDrivers();
			this.nodePasteDrivers    = this.createElementPasteDrivers();
			this.nodeNotBlockDrivers = document.createElement('ul');
			this.drivers = {};
			return Promise.all([
				Promise.all([
					this.page.promise,
					gm.getValue(this.idMinutesCheckPoputchiki,     5).then(v => this.minutesCheckPoputchiki = v).then(() => this.nodeMinutesCheckPoputchiki = this.createElementMinutesCheckPoputchiki()),
					gm.getValue(this.idMinutesBooking,            16).then(v => this.minutesBooking         = v).then(() => this.nodeMinutesBooking         = this.createElementMinutesBooking()        ),
					gm.getValue(this.idMinutesWait,                2).then(v => this.minutesWait            = v).then(() => this.nodeMinutesWait            = this.createElementMinutesWait()           ),
					gm.getValue(this.idMaxPrice,                1500).then(v => this.maxPrice               = v).then(() => this.nodeMaxPrice               = this.createElementMaxPrice()              ),
					gm.getValue(this.idTimeSetMaxTrips,        false).then(v => this.timeSetMaxTrips        = v),
					gm.getValue(this.idMaxTrips,                   0).then(v => this.nodeMaxTrips    = this.createElementMaxTrips(v)),
					gm.getValue(this.idMaxBookings,                0).then(v => this.nodeMaxBookings = this.createElementMaxBookings(v)),
					Promise.all([
						gm.getValue(this.idMinTime, this.minTime.toISOString()).then(v => this.minTime = new Date(v)),
						gm.getValue(this.idMaxTime, this.maxTime.toISOString()).then(v => this.maxTime = new Date(v))
					]).then(() => this.nodePeriod = this.createElementMyPeriod())
				])
				.then(() => {
					if (isPoputchiki) this.page.nodePanelLeft.style.position = 'absolute';
					let node2 = document.createElement('div');
					node2.appendChild(document.createTextNode(' Бронь каждые '));
					node2.appendChild(this.nodeMinutesBooking);
					node2.appendChild(document.createTextNode(' и затем '));
					node2.appendChild(this.nodeMinutesWait);
					node2.appendChild(document.createTextNode(' мин. Макс.цена: '));
					node2.appendChild(this.nodeMaxPrice);
					node2.appendChild(document.createTextNode('. Макс.поездок: '));
					node2.appendChild(this.nodeMaxTrips);
					node2.appendChild(document.createTextNode('. Макс.броней 1 поезки: '));
					node2.appendChild(this.nodeMaxBookings);
					node2.appendChild(document.createTextNode('.'));
					node2.appendChild(this.nodePeriod);
					this.node.appendChild(document.createTextNode(' Искать каждые '));
					this.node.appendChild(this.nodeMinutesCheckPoputchiki);
					this.node.appendChild(document.createTextNode(' мин: '));
					this.node.appendChild(node2);
					this.node.appendChild(this.createElementDriversTool());
					let prm;
					let now = this.page.getNow();
					if (isNoPage || !this.page.ok) {
						this.setPlan(this.plans.reinit);
					} else if (this.maxTime < now) {
						this.setPlan(this.plans.stop);
					} else {
						let plans;
						if (isPoputchiki) {
							plans = this.plans.poputchiki;
							if (this.page.nodeAncorPrevSearch) this.setPlan(plans.goToPrevSearch); // Go to previously searching page
							else {
								this.firstBlockTrip = null;
								for (let i = 0; i < this.page.trips.length; i++) {
									let trip = this.page.trips[i];
									if (!!trip) {
										trip.setMaxPrice(this.maxPrice);
										trip.setMinMaxTime(this.minTime, this.maxTime);
										let notBlock = (trip.driver && trip.driver.notBlockTrip )
											|| trip.notBlock
											|| !trip.asSearch
											|| trip.seatsAvailable < 1
											|| (this.maxBookings && trip.countBookings >= this.maxBookings)
											|| trip.time < now
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
									if (curMonth < this.page.calendarMonth) this.setPlan(plans.prevMonth, this.page.nodeCalendarMonthPrev); // Next month
									else if (curMonth > this.page.calendarMonth) this.setPlan(plans.nextMonth, this.page.nodeCalendarMonthNext); // Prev month
									else this.setPlan(plans.selectDay, this.page.nodesCalendarDay[this.curTime.getDate() - 1]); // Select day
								} else if (
									!this.page.existFilterTime ||
									this.page.minTime > this.maxTime ||
									this.page.maxTime < this.curTime
								) this.setPlan(plans.showCalendar, this.page.nodeDateInput); // Show calendar
								else if (this.firstBlockTrip) this.setPlan(plans.openTrip); // Open trip
								else if (
									!this.page.last &&
									this.page.trips.length &&
									this.page.trips[this.page.trips.length - 1].time < this.maxTime
								) this.setPlan(plans.showMoreTrips, this.page.nodeScroll); // Show more trips
								else this.setPlan(plans.tripNotfound, this.page.nodeDateInput); // Trip not found
							}
						} else if (isPoezdka) {
							plans = this.plans.poezdka;
							let noNeedBooking =
								this.page.trip.time < now ||
								this.page.trip.time < this.minTime ||
								this.page.trip.time > this.maxTime ||
								this.page.trip.notBlock ||
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
									this.setPlan(plans.addSeat, this.page.trip.nodeButtonAddSeats);
									this.seatsForBookingPrev = this.page.trip.seatsForBooking;
								} else if (
									this.page.trip.nodesCancelCause.length > 6 &&
									window.getComputedStyle(this.page.trip.nodesCancelCause[0]).visibility == "visible"
								) {
									if (!this.nodeCancelCause) {
										let causes = [2, 4, 6, 7];
										this.nodeCancelCause = this.page.trip.nodesCancelCause[causes[Math.floor(Math.random() * causes.length)]];
									}
									this.setPlan(plans.selectCouseUnbooking, this.nodeCancelCause); // Select couse of unbooking
								} else if (
									!!this.page.trip.nodeCancelCauseCurrent &&
									this.page.trip.nodeCancelCauseCurrent.innerText != ''
								) this.setPlan(plans.submitCouseUnbooking, this.page.trip.nodeCancelCauseButtonOk); // Submit couse of unbooking
								else if (!!this.page.trip.nodeCancelCauseShowList) {
									this.nodeCancelCause = null;
									this.setPlan(plans.showCousesUnbooking, this.page.trip.nodeCancelCauseShowList); // Show list of couses of unbooking
								} else if (
									this.page.trip.nodeButtonCancel && (
										this.page.trip.seatsAvailable > (this.page.trip.booked ? 0 : this.page.trip.seatsMy) ||
										noNeedBooking
									)
								) this.setPlan(plans.submitUnbooking, this.page.trip.nodeButtonCancel); // Submit unbooking
								else this.setPlan(this.plans.goToMytrips, this.page.nodeButtonMytrips); // Go to Mytrips page
							} else if (
								this.page.trip.nodePayCash
								&& !this.page.trip.nodePayCash.checked
							) this.setPlan(plans.selectCashPayMethod, this.page.trip.nodePayCash); // Select cash pay method
							else if (this.page.trip.nodePaySubmit) this.setPlan(plans.submitPayMethod, this.page.trip.nodePaySubmit); // Submit pay method
							else if (this.page.trip.errorLimit) {
								if (!this.maxTrips) prm = gm.setValue(this.idTimeSetMaxTrips, now.toISOString())
								this.setPlan(this.plans.goToMytrips, this.page.nodeButtonMytrips); // Go to Mytrips
							} else if (this.page.trip.nodeButtonBooking) this.setPlan(plans.submitBooking, this.page.trip.nodeButtonBooking); // Submit booking
							else this.setPlan(this.plans.goToMytrips, this.page.nodeButtonMytrips); // Go to Mytrips page
						} else if (isMytrips) {
							if (this.timeSetMaxTrips) {
								if (this.page.actualTrips.length && !this.maxTrips) {
									let t = new Date (this.timeSetMaxTrips);
									t.setSeconds(t.getSeconds() + 15);
									if (t > now) this.nodeMaxTrips.value = this.page.actualTrips.length;
								}
								prm = gm.deleteValue(this.idTimeSetMaxTrips);
							}
							plans = this.plans.mytrips;
							if (this.page.nodeDialogCloseButton) this.setPlan(plans.dialogClose, this.page.nodeDialogCloseButton); // Close dialog
							else {
								this.trip = this.page.actualTrips.find((trip) => trip.seatsAvailable > 0 && (!this.maxBookings || trip.countBookings < this.maxBookings));
								if (this.trip) {
									if (this.trip.nodeAncor) this.setPlan(plans.goToTrip, this.trip.nodeAncor); // Go to trip page
									else this.setPlan(this.plans.stop); // Error
								} else if (!this.maxTrips || this.page.actualTrips.length < this.maxTrips) this.setPlan(this.plans.goToSearch, this.page.nodeButtonSearch); // Go to trips search page
								else this.setPlan(this.plans.waitMytrips, this.page.nodeButtonMytrips); // Wait & go to Mytrips page
							} 
						}
					}
					return prm;
				}),
				gm.listValues()
				.then(v => {
					let objTrips = {};
					let prm = Promise.resolve();
					for(let key of v) {
						let arrKeyD = key.match(/driver_([0-9a-zA-Z]+)_notBlockTrip/);
						if (!!arrKeyD) prm = prm.then(() => this.addDriver(new Driver(arrKeyD[1])));
						let arrKeyT = key.match(regPrefixTrip);
						if (!!arrKeyT) {
							let id   = arrKeyT[1];
							let trip;
							let del = false;
							if (objTrips[id]) trip = objTrips[id];
							else {
								trip = objTrips[id] = new Trip(id);
								del = isMytrips && trip.idSeatsRequested == key && this.page.ok && !this.page.actualTripsIdx[id]
							}
							if (del) prm = prm.deleteValue(key);
							else trip.promise.then(() => trip.time < now ? gm.deleteValue(key) : '');
						}
					}
					if (!!this.page.trip) prm = prm.then(() => this.addDriver(this.page.trip.driver));
					if (!!this.page.trips) for (let trip of this.page.trips) if (!!trip && !!trip.driver) prm = prm.then(() => this.addDriver(trip.driver));
					return prm;
				})
				.then(() => {
					let disabled = (this.mainTool.nodeStart.checked ? 'disabled' : '');
					this.nodeMinutesCheckPoputchiki.disabled = disabled;
					this.nodeMinutesBooking.disabled         = disabled;
					this.nodeMinutesWait.disabled            = disabled;
					this.nodeCopyDrivers.disabled            = disabled;
					this.nodePasteDrivers.disabled           = disabled;
					this.nodeMaxPrice.disabled               = disabled;
					for(let k in this.drivers) this.drivers[k].nodeNot.disabled = disabled;
				})
			])
			.then(() => super.init());
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
		createElementMaxTrips(initValue) {
			return createElementNumber(0, 99, 3,
				(v) => gm.setValue(this.idMaxTrips, this.maxTrips = v),
				this.maxTrips = initValue
			);
		}
		createElementMaxBookings(initValue) {
			return createElementNumber(0, 99, 3,
				(v) => gm.setValue(this.idMaxBookings, this.maxBookings = v),
				this.maxBookings = initValue
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
				() => this.getStringDrivers()
			);
		}
		getStringDrivers() {
			let value = '';
			for(let k in this.drivers) {
				let driver = this.drivers[k];
				if (driver.notBlockTrip) value = value + '<driver id="' + driver.id + '" name="' + driver.name + '" />\n';
			}
			return value;
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
			nd.appendChild(document.createTextNode('Исключения ('));
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
			let prm;
			if (!!driver && !this.drivers[driver.id]) {
				let nd = document.createElement('li');
				this.drivers[driver.id] = driver;
				this.nodeNotBlockDrivers.appendChild(nd);
				prm = driver.promise.then(() => {
					nd.appendChild(driver.nodeNot = createElementCheckbox(
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
					));
					nd.appendChild(document.createTextNode(' ' + driver.name + ' / ' + driver.id));
				});
			}
			return prm;
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
			setValue(Number(nd.value));
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
	/*
	function createElementButtonCopy(nd, text, getValue) {
		return createElementButton(text, () => getValue().then(v => copy(nd, v)));
	}
	*/
	function createElementButtonCopy(nd, text, getValue) {
		return createElementButton(text, () => copy(nd, getValue()));
	}
	/*
	function createElementButtonCopy(ndHelper, text, getValue) {
		let ndButton = document.createElement('button');
		ndButton.appendChild(document.createTextNode(text));
		ndButton.addEventListener('click', (event) => {
			event.preventDefault();
			getValue().then((v) => copy(ndHelper, v));
		});
		return ndButton;
	}
	*/
	/*
	function createElementButtonCopy(ndHelper, text, getValue) {
		let ndButton = document.createElement('button');
		ndButton.appendChild(document.createTextNode(text));
		ndButton.addEventListener('click', (event) => {
			event.preventDefault();
			copy(ndHelper, getValue());
		});
		return ndButton;
	}
	*/
	function createElementButtonPaste(nd, text, setValue) {
		return createElementButton(text, () => paste(nd, setValue));
	}
	
	function setElementStyleHidable(args) { // args{nodeMain, nodeHidable, onMouseEnter, onMouseLeave}
		args.nodeMain.setAttribute('style', 'background-color:white;border:solid grey 1px;padding:5px;border-radius:15px;display:inline-block;');
		args.nodeHidable.setAttribute('style', 'z-index:999;background-color:white;border:solid grey 1px;border-radius:15px;position:absolute;display:none;');
		args.nodeMain.addEventListener(
			'mouseenter',
			(event => {
				event.preventDefault();
				args.nodeHidable.setAttribute('style', args.nodeHidable.getAttribute('style').replace(/\bdisplay:\b\w+\b/, 'display:block'));
				if (args.onMouseEnter) args.onMouseEnter();
			})
		);
		args.nodeMain.addEventListener(
			'mouseleave',
			(event => {
				event.preventDefault();
				args.nodeHidable.setAttribute('style', args.nodeHidable.getAttribute('style').replace(/\bdisplay:\b\w+\b/, 'display:none'));
				if (args.onMouseLeave) args.onMouseLeave();
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
	gm.showValues   = () => gm.listValues().then(v => {
		let obj = {};
		return Promise.all(v.map(key => gm.getValue(key).then((v) => obj[key] = v))).then(() => console.log('GM.values =', obj));
	});
	
	let mainTool = new MainTool(ToolBlockTrip);
})();
