// ==UserScript==
// @name         bv7_bbc_dark
// @namespace    bv7
// @version      3.37
// @description  say 'caaaaaaar' then I help you
// @author       bv7
// @include      https://www.blablacar.ru/*
// @include      https://*.datadome.co/*
// @include      https://www.google.com/recaptcha/api2/bframe?*
// @require      https://greasyfork.org/scripts/39480-bv7-canvas/code/bv7_canvas.js
// @require      https://greasyfork.org/scripts/39476-bv7-jpeg-encoder/code/bv7_jpeg_encoder.js
// @require      https://greasyfork.org/scripts/39479-bv7-jpeg2array/code/bv7_jpeg2array.js
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/29929/bv7_bbc_dark.user.js
// @updateURL https://update.greasyfork.org/scripts/29929/bv7_bbc_dark.meta.js
// ==/UserScript==

(function() {
	'use strict';

	setTimeout(function() {
		new (function(){
			var timeoutCounter          = GM_getValue('timeoutCounter', 1 * 1000); // milliseconds for counter
			const idStart               = 'start';
			var ok                      = true;
			var idTimeoutCounter;
			var time;
			var nodeTimer;
			var nodeReset;
			var page;
			const regHrefTripOffersActive    = /\/dashboard\/trip-offers\/active/; // regual expression for identify of link to "Trip Offers Active"
			const regHrefPassengers          = /\/dashboard\/trip-offer\/(\d+)\/passengers/;
			const regHrefMessagesShow        = /\/messages\/show\/[^\/]+/;
			const regHrefMessageInit         = /\/messages\/init\/[^\/]-(\d+)\/([^\/]+)/;
			//const regHrefPoiskPoputchikov = /\/poisk-poputchikov\/([^\/]+\/[^\/]+)\//;
			const regHrefPoiskPoputchikov    = /\/ride-sharing\/([^\/]+\/[^\/]+)\//;
			const regHrefSearch              = /\/search\?/;
			//const regHrefPoezdka          = /\/poezdka-[^\?]+-(\d+)/;
			const regHrefPoezdka             = /\/trip-[^\?]+-(\d+)/;
			//const regHrefOplata           = /\/oplata\//;
			const regHrefOplata              = /\/payment\//;
			const regHrefConnect             = /\/connect/;
			const regHrefCaptcha             = /.\.datadome\.co\//;
			const regHrefReCaptchaApi2BFrame = /www\.google\.com\/recaptcha\/api2\/bframe\?/;
			
			
			const prefixTrip              = 'trip_';                // prefix for stored parametrs of Trip with GM_setValue function
			var regPrefixTrip           = new RegExp('/' + prefixTrip + '(\d+)_/');
			var tools                   = [];


			this.idTimeoutAction    = 0;
			this.timeoutHumanMin    = GM_getValue('timeoutHuman',        500); // milliseconds for reading page for bot
			this.timeoutHumanAddMax = GM_getValue('timeoutHumanAddMax', 3000); // max add milliseconds to time for reading page for bot
			this.getTimeoutHuman    = () => this.timeoutHumanMin + Math.random() * this.timeoutHumanAddMax;


			class Trip {
				constructor(id) {
					this.id                 = id;
					this.prefix             = prefixTrip + this.id + '_';
					this.prefixPassenger    = this.prefix + 'passenger_'
					this.regPrefixPassenger = new RegExp('/' + this.prefixPassenger + '([0-9a-zA-Z]+)_/');
					this.idDefault          = this.prefix + 'default';
					this.idSendMessage      = this.prefix + 'sendMessage';
					this.idMessage          = this.prefix + 'message';
					this.idMessageCount     = this.prefix + 'messageCount';
					this.idHrefPassengers   = this.prefix + 'hrefPassengers';
					this.idDriver           = this.prefix + 'driver'
					this.idTime             = this.time;
					this.default            = GM_getValue(this.idDefault, true);
					this.messageCount       = GM_getValue(this.idMessageCount, 0);
					this.hrefPassengers     = GM_getValue(this.idHrefPassengers, '');
					this.time               = new Date(GM_getValue(this.idTime, 0));
					let driverId            = GM_getValue(this.idDriver, '');
					if (driverId) this.driver = new Driver(driverId);
				}
				setDriver(driver) {
					this.driver = driver;
					GM_setValue(this.idDriver, this.driver.id);
				}
			} // Class Trip

			class Polzovatel {
				constructor(badId) {
					this.id = badId.replace(/[^0-9a-zA-Z]/g, '');
				}
			} // Polzovatel

			class Passenger extends Polzovatel { // Class
				constructor(badId, trip) {
					super(badId);
					this.prefix     = trip.prefixPassenger + this.id + '_';
					this.idMessaged = this.prefix + 'messaged';
					this.messaged   = GM_getValue(this.idMessaged, false);
				}
			} // Class Passenger

			class Driver extends Polzovatel {
				constructor(badId) {
					super(badId);
					this.prefix = 'driver_' + this.id + '_';
					this.idNotBlockTrip = this.prefix + 'notBlockTrip';
					this.idName = this.prefix + 'name';
					this.notBlockTrip = GM_getValue(this.idNotBlockTrip, false);
					this.name = GM_getValue(this.idName, '');
				}
			} // Driver

			class Page {
				constructor(app, selectorExclude) {
					this.app = app;
					if (this.ok = (!selectorExclude) || !document.querySelector(selectorExclude)) this.init28();
					//this.idHrefTripOffersActive = 'href_tripOffersActive';
				}
				init28() {}
			} // Page

			class PageBbc extends Page {
				constructor(app) {
					super(app, 'body>iframe[src^="https://c.datadome.co/"]');
				}
			}

			class PagePoiskPoputchikov extends PageBbc {
				/*
				constructor(app) {
					super(app);
				}
				*/
				init28() {
					super.init28();
					this.isPoiskPoputchikov = true;
					this.init();
				}
				init() {
					class MyTrip extends Trip {
						constructor(nodeTrip, pg) {
							let nodeAncorPoezdka = nodeTrip.querySelector('a.trip-search-oneresult.js-tracktor-search-result');
							ok = !!nodeAncorPoezdka;
							if (ok) {
								//let arrId = nodeAncorPoezdka.getAttribute('href').match(/\/poezdka-.+-(\d+)$/);
								let arrId = nodeAncorPoezdka.getAttribute('href').match(regHrefPoezdka);
								ok        = arrId !== null && arrId.length > 1;
								if (ok) {
									super(arrId[1]);
									this.nodeAncorPoezdka = nodeAncorPoezdka;
									//this.nodeFrom = nodeTrip.querySelector('dl.geo-from>dd.js-tip-custom');
									this.nodeFrom = nodeTrip.querySelector('h3.fromto>span.from.trip-roads-stop');
									//this.nodeTo = nodeTrip.querySelector('dl.geo-to>dd.js-tip-custom');
									this.nodeTo = nodeTrip.querySelectorAll('h3.fromto>span.trip-roads-stop')[1];
									this.nodePrice = nodeTrip.querySelector('div.price>strong>span');
									this.nodeTime = nodeTrip.querySelector('h3.time');
									ok = !!this.nodeFrom && !!this.nodeTo && !!this.nodePrice && !!this.nodeTime;
									if (ok) {
										let arrPrice = this.nodePrice.innerText.match(/\d+(\s+\d+)*/);
										let strDate = this.nodeTime.getAttribute('content');
										let arrTime = this.nodeTime.innerText.match(/(\d+):(\d+)/);
										ok = !!arrPrice && !!strDate && !!arrTime;
										if (ok) {
											this.from = this.nodeFrom.innerText;
											this.to = this.nodeTo.innerText;
											this.price = Number(arrPrice[0].replace(/\s+/g, ''));
											this.fromAsSearch = -1 < this.from.toLowerCase().replace(/ё/g, 'е').indexOf(pg.from.toLowerCase().replace(/ё/g, 'е'));
											this.toAsSearch = -1 < this.to.toLowerCase().replace(/ё/g, 'е').indexOf(pg.to.toLowerCase().replace(/ё/g, 'е'));
											this.priceAsSearch = true;
											this.asSearch = this.fromAsSearch && this.toAsSearch;
											if (pg.existFilterMaxPrice) this.setMaxPrice(pg.maxPrice);
											let arrDate = strDate.match(/(\d+)-(\d+)-(\d+)/);
											ok = !!arrDate;
											if (ok) {
												this.time = new Date(arrDate[1], arrDate[2] - 1, arrDate[3], arrTime[1], arrTime[2], 0, 0);
												GM_setValue(this.idTime, this.time);
												if (pg.existFilterTime) this.setMinMaxTime(pg.minTime, pg.maxTime);
											}
										}
										
									}
								}
							}
						}
						setMaxPrice(maxPrice) {
							this.priceAsSearch = this.price <= maxPrice;
							this.asSearch = this.asSearch && this.priceAsSearch;
						}
						setMinMaxTime(minTime, maxTime) {
							this.timeAsSearch = this.time >= minTime && this.time <= maxTime;
							this.asSearch = this.asSearch && this.timeAsSearch;
						}
					} // MyTrip
					this.nodeFrom = document.getElementById('search_from_name');
					this.nodeTo = document.getElementById('search_to_name');
					ok = !!this.nodeFrom && !!this.nodeTo;
					if (ok) {
						this.from = this.nodeFrom.value;
						this.to = this.nodeTo.value;
						this.nodesTrip      = document.querySelectorAll('li.trip.relative');
						this.trips          = new Array(this.nodesTrip.length);
						this.firstBlockTrip = null;
						let arr = location.href.match(/\bdb=(\d+)\/(\d+)\/(\d+)\b/);
						this.existFilterTime = !!arr;
						if (this.existFilterTime) {
							this.minTime = new Date(arr[3], arr[2] - 1, arr[1], 0, 0, 0, 0);
							this.maxTime = new Date(arr[3], arr[2] - 1, arr[1], 23, 59, 59, 999);
							arr = location.href.match(/\bhb=(\d+)\b/);
							if (arr) this.minTime.setHours(arr[1], 0, 0, 0);
							arr = location.href.match(/\bhe=(\d+)\b/);
							if (arr) this.maxTime.setHours(arr[1], 0, 0, 0);
						}
						arr = location.href.match(/\bpmax=(\d+)\b/);
						this.existFilterMaxPrice = !!arr;
						if (this.existFilterMaxPrice) this.maxPrice = Number(arr[1]);
						this.filterIsOld = this.existFilterTime && this.maxTime < Date.now();
						let tripsIdx = {};
						for (var i = 0; i < this.nodesTrip.length && ok; i++) {
							let trip = new MyTrip(this.nodesTrip[i], this);
							this.trips[i] = trip;
							tripsIdx[this.trips[i].id] = true;
						}
						this.nodeNext = document.querySelector('li.next');
						this.last  = (this.nodeNext === null) || (document.querySelector('li.next.disabled') !== null);
						if (!this.last) {
							this.nodeAncorNext = this.nodeNext.querySelector('a.js-trip-search-pagination');
							ok = this.nodeAncorNext !== null;
						}
						if (ok) {
							for (let i = 0, keys = GM_listValues(); i < keys.length; i++) {
								let key = keys[i];
								arr = key.match(regPrefixTrip);
								if (arr && !tripsIdx[arr[1]]) {
									let trip = new Trip(arr[1]);
									if (trip.time < Date.now()) GM_deleteValue(key);
								}
							}
						}
					}
				}
			} // PagePoiskPoputchikov

			class PagePoezdka extends PageBbc {
				init28() {
					class MyDriver extends Driver {
						constructor(badId, node, nodeAncor) {
							super(badId);
							this.nodeAncor = nodeAncor;
							this.name = this.nodeAncor.innerText;
							let nodeInfo = node.querySelector('div.ProfileCard-info')
							if (nodeInfo) this.name = this.name + ' (' + nodeInfo.innerText + ')';
						}
					}
					class MyTrip extends Trip {
						constructor(driver) {
							let arr = location.href.match(regHrefPoezdka);
							ok = ok && !!arr;
							if (ok) {
								super(arr[1]);
								this.setDriver(driver);
								let node = document.querySelector('strong.RideDetails-infoValue>span');
								ok = ok && !!node;
								if (ok) {
									this.time = new Date();
									arr = node.innerText.match(/^\s*([^\s-:\d\<]+)(\s+(\d+)\s+([^\s-:\d\<]+)(\s+(\d+))?)?\s*-\s*(\d+):(\d+)/);
									let hour   = arr[7];
									let minut  = arr[8];
									ok = ok && !!hour && !!minut;
									if (ok) {
										let tMonth = arr[4];
										let date   = arr[3];
										if (tMonth && date) {
											let month = 
												/янв/.test(tMonth)? 0:
												/фев/.test(tMonth)? 1:
												/мар/.test(tMonth)? 2:
												/апр/.test(tMonth)? 3:
												/мая/.test(tMonth)? 4:
												/июн/.test(tMonth)? 5:
												/июл/.test(tMonth)? 6:
												/авг/.test(tMonth)? 7:
												/сен/.test(tMonth)? 8:
												/окт/.test(tMonth)? 8:
												/ноя/.test(tMonth)? 10:
												/дек/.test(tMonth)? 11:
												-1;
											ok = ok && month !== -1;
											if (ok) {
												let tYear = arr[6];
												if (tYear) this.time.setFullYear(tYear);
												this.time.setMonth(month, date);
											}
										} else {
											let tDay = arr[1];
											ok = ok && !!tDay;
											if (ok) {
												let dDay =
													/вчера/.test(tDay)? -1:
													/Сегодня/.test(tDay)? 0:
													/Завтра/.test(tDay)? 1:
													-9;
												ok = ok && dDay !== -9;
												if (ok) this.time.setDate(this.time.getDate() + dDay);
											}
										}
										if (ok) {
											this.time.setHours(hour, minut);
											GM_setValue(this.idTime, this.time);
										}
									}
								}
							}
						}
					}
					super.init28();
					this.seats = 0;

					let node = document.querySelector('div.ProfileCard-infosBlock');
					if (!!node) {
						//let nodeAncor = node.querySelector('a[href^="/polzovatel/pokazat/"]');
						let nodeAncor = node.querySelector('a[href^="/user/show/"]');
						if (!!nodeAncor) {
							//let arr = nodeAncor.getAttribute('href').match(/\/polzovatel\/pokazat\/([^\/]+)$/);
							let arr = nodeAncor.getAttribute('href').match(/\/user\/show\/([^\/]+)$/);
							if (!!arr) this.driver = new MyDriver(arr[1], node, nodeAncor);
						}
					}
					//this.driver = new MyDriver();
					if (this.driver) {
						this.trip = new MyTrip(this.driver);
						if (ok) {
							this.nodeSeats = document.getElementById('booking_booking_nb_seats');
							this.nodeCGU = document.getElementById('booking_booking_cgu');
							this.nodeButtonBooking = document.querySelector("button[name='booking_form_submit']");
							//this.nodeAncorProdolzhitOplatu = document.querySelector("a[href^='/prodolzhit-oplatu/']");
							this.nodeAncorProdolzhitOplatu = document.querySelector("a[href^='/payment-continue/']");
							if (this.nodeSeats && this.nodeCGU && this.nodeButtonBooking) this.seats = this.nodeSeats.lastChild.value;

						}
					}
				}
			} // PagePoezdka

			class PageOplata extends PageBbc {
			} // PageOplata

			class PageConnect extends PageBbc {
				init28() {
					super.init28();
					this.nodeButtonLogin = document.body.querySelector('button.btn-validation');
				}
			} // PageConnect

			class PageCaptcha extends PageBbc {
				init28() {
					super.init28();
					if (this.ok = !!(this.nodeSubmit = document.body.querySelector('[data-sitekey]'))) this.googlekey = this.nodeSubmit.getAttribute('data-sitekey');
				}
			} // PageCaptcha

			class PageReCaptchaApi2BFrame extends PageBbc {
				init28() {
					super.init28();
					this.cors = [];
					this.nodeBody = new Canvas();
				}
				initImgs() {
					this.nodesImageSelect = document.body.querySelectorAll('.rc-imageselect-tile');
					this.selected         = document.body.querySelector('.rc-imageselect-tileselected');
				}
				init(onload) {
					this.ok = true;
					this.onload = onload;
					this.nodeTextInstuctions  = document.body.querySelector('strong');
					this.nodeTryLater        = document.body.querySelector('.rc-doscaptcha-header');
					if (!this.nodeTryLater) {
						//console.log('onload =', onload);
						this.nodesCaptchaRows     = document.body.querySelectorAll('.rc-imageselect-target>table>tbody>tr');
						this.nodesCaptchaCells    = document.body.querySelectorAll('.rc-imageselect-target>table>tbody>tr>td');
						this.nodesCaptchaWrappers = document.body.querySelectorAll('.rc-image-tile-wrapper');
						this.nodesCaptchaImgs     = document.body.querySelectorAll('.rc-image-tile-wrapper>img');
						this.initImgs();
						this.captchaRows          = this.nodesCaptchaRows.length;
						this.captchaCells         = this.nodesCaptchaCells.length;
						this.captchaWrappers      = this.nodesCaptchaWrappers.length;
						this.captchaImgs          = this.nodesCaptchaImgs.length;
						if (!!this.captchaRows && !!this.captchaCells) {
							this.captchaCols = this.captchaCells / this.captchaRows;
							if (this.captchaImgs == this.captchaCells && this.captchaWrappers == this.captchaCells) {
								this.bodyCellHeight = this.naturalCellHeight = this.nodesCaptchaImgs[0].naturalHeight * this.nodesCaptchaWrappers[0].clientHeight / this.nodesCaptchaImgs[0].height;
								this.bodyCellWidth  = this.naturalCellWidth  = this.nodesCaptchaImgs[0].naturalWidth  * this.nodesCaptchaWrappers[0].clientWidth  / this.nodesCaptchaImgs[0].width ;
								let h = this.bodyCellHeight * this.captchaRows;
								let w = this.bodyCellWidth  * this.captchaCols;
								if (h > 400) h = (this.bodyCellHeight = Math.floor(400 / this.captchaRows)) * this.captchaRows;
								if (w > 400) w = (this.bodyCellWidth  = Math.floor(400 / this.captchaCols)) * this.captchaCols;
								this.nodeBody.height = h;
								this.nodeBody.width  = w;
								this.contextBody     = this.nodeBody.getContext('2d');
								this.drawBody(0);
							} else this.ok = false;
						} else this.ok = false;
						if (!!this.nodeTextInstuctions) this.textInstructions = this.nodeTextInstuctions.innerText;
						else this.ok = false;
						this.buttonReCaptchaVerify = document.getElementById('recaptcha-verify-button');
						if (!this.buttonReCaptchaVerify) this.ok = false;
					} else this.onload();
				}
				drawBody(iImg) {
					if (iImg < this.captchaImgs) this.contextBody.drawImage(
						this.nodesCaptchaImgs[iImg],
						-this.nodesCaptchaImgs[iImg].x * this.nodesCaptchaImgs[iImg].naturalWidth  / this.nodesCaptchaImgs[iImg].width ,
						-this.nodesCaptchaImgs[iImg].y * this.nodesCaptchaImgs[iImg].naturalHeight / this.nodesCaptchaImgs[iImg].height,
						this.naturalCellWidth ,
						this.naturalCellHeight,
						this.bodyCellWidth  *           (iImg % this.captchaCols),
						this.bodyCellHeight * Math.floor(iImg / this.captchaCols),
						this.bodyCellWidth ,
						this.bodyCellHeight,
						() => this.drawBody(iImg + 1)
					);
					else {
						this.captchaBodyBase64 = this.nodeBody.toDataUrl('image/jpeg');
						this.onload();
					}
				}
			} // PageReCaptchaApi2BFrame


			class Tool {
				constructor(app, selectorExclude = undefined) {
					this.app = app;
					if (this.ok = (!selectorExclude) || document.querySelector(selectorExclude)) this.init28();
				}
				init28() {
					this.timeoutCheckAdd    = GM_getValue('timeoutCheckAddMax', 60000)  // max add milliseconds to timeout for check states
						* Math.random();
					this.nodeDebug = createNodeTool(true);
					setVisible({node: this.nodeDebug, nodeCheckbox: this.app.nodeDebug});
					this.nodeTool = createNodeTool(true);
					this.nodeTool.appendChild(this.nodeDebug);
				}
				changeStart() {}
				minutesToTimeoutCheck(minutes) {
					return minutes * 60000 + this.timeoutCheckAdd;
				}
			} //Class Tool


			class ToolBlockTrip extends Tool {
				init28() {
					super.init28();
					this.prefixTool                     = 'toolBlockTrip_';
					this.idHrefPoiskPoputchikov         = this.prefixTool + 'hrefPoiskPoputchikov';
					this.idHrefPoezdka                  = this.prefixTool + 'hrefPoezdka';
					this.idStart                        = this.prefixTool + 'start';
					this.idMinutesCheckPoiskPoputchikov = this.prefixTool + 'minutesCheckPoiskPoputchikov';
					this.idMinutesBooking               = this.prefixTool + 'minutesBooking';
					this.idMinutesWait                  = this.prefixTool + 'minutesWait';
					this.idMaxPrice                     = this.prefixTool + 'maxPrice';
					this.start                          = GM_getValue(this.idStart, false);
					this.hrefPoiskPoputchikov           = GM_getValue(this.idHrefPoiskPoputchikov, '');
					this.hrefPoezdka                    = GM_getValue(this.idHrefPoezdka, '');
					this.minutesCheckPoiskPoputchikov   = GM_getValue(this.idMinutesCheckPoiskPoputchikov, 5); // default minutes between checkings of changing of trips
					this.minutesBooking                 = GM_getValue(this.idMinutesBooking, 16);
					this.minutesWait                    = GM_getValue(this.idMinutesWait, 2);
					this.maxPrice                       = GM_getValue(this.idMaxPrice, 1500);
					this.nodeName = document.createTextNode('...');
					this.nodeLinkPoiskPoputchikov = document.createElement('a');
					this.nodeLinkPoiskPoputchikov.appendChild(this.nodeName);
					this.refreshHrefPoiskPoputchikov();
					this.nodeStart = document.createElement('input');
					this.nodeStart.setAttribute('type', 'checkbox');
					this.nodeStart.checked = this.start;
					this.nodeStart.addEventListener('change', function(me, pg) {
						return function(event) {
							event.preventDefault();
							me.start = me.nodeStart.checked;
							me.refreshHrefPoiskPoputchikov();
							GM_setValue(me.idStart, me.start);
							me.changeStart();
						};
					}(this, page));
					this.nodeMinutesCheckPoiskPoputchikov = document.createElement('input');
					this.nodeMinutesCheckPoiskPoputchikov.setAttribute('type', 'number');
					this.nodeMinutesCheckPoiskPoputchikov.setAttribute('min', '0');
					this.nodeMinutesCheckPoiskPoputchikov.setAttribute('max', '600');
					this.nodeMinutesCheckPoiskPoputchikov.setAttribute('style', 'width:3em');
					this.nodeMinutesCheckPoiskPoputchikov.addEventListener('change', function(me) {
						return function(event) {
							event.preventDefault();
							me.minutesCheckPoiskPoputchikov = me.nodeMinutesCheckPoiskPoputchikov.value;
							GM_setValue(me.idMinutesCheckPoiskPoputchikov, me.minutesCheckPoiskPoputchikov);
						};
					}(this));
					this.nodeMinutesCheckPoiskPoputchikov.value = this.minutesCheckPoiskPoputchikov;
					this.nodeMinutesBooking = document.createElement('input');
					this.nodeMinutesBooking.setAttribute('type', 'number');
					this.nodeMinutesBooking.setAttribute('min', '0');
					this.nodeMinutesBooking.setAttribute('max', '600');
					this.nodeMinutesBooking.setAttribute('style', 'width:3em');
					this.nodeMinutesBooking.addEventListener('change', function(me) {
						return function(event) {
							event.preventDefault();
							me.minutesBooking = me.nodeMinutesBooking.value;
							GM_setValue(me.idMinutesBooking, me.minutesBooking);
						};
					}(this));
					this.nodeMinutesBooking.value = this.minutesBooking;
					this.nodeMinutesWait = document.createElement('input');
					this.nodeMinutesWait.setAttribute('type', 'number');
					this.nodeMinutesWait.setAttribute('min', '0');
					this.nodeMinutesWait.setAttribute('max', '600');
					this.nodeMinutesWait.setAttribute('style', 'width:3em');
					this.nodeMinutesWait.addEventListener('change', function(me) {
						return function(event) {
							event.preventDefault();
							me.minutesWait = me.nodeMinutesWait.value;
							GM_setValue(me.idMinutesWait, me.minutesWait);
						};
					}(this));
					this.nodeMinutesWait.value = this.minutesWait;
					this.nodeMaxPrice = document.createElement('input');
					this.nodeMaxPrice.setAttribute('type', 'number');
					this.nodeMaxPrice.setAttribute('min', '10');
					this.nodeMaxPrice.setAttribute('max', '999990');
					this.nodeMaxPrice.setAttribute('step', '10');
					this.nodeMaxPrice.setAttribute('style', 'width:6em');
					this.nodeMaxPrice.addEventListener('change', function(me) {
						return function(event) {
							event.preventDefault();
							me.maxPrice = me.nodeMaxPrice.value;
							GM_setValue(me.idMaxPrice, me.maxPrice);
							me.refreshHrefPoiskPoputchikov()
						};
					}(this));
					this.nodeMaxPrice.value = this.maxPrice;
					this.idCaptchaKey = this.prefixTool + 'captchaKey';
					this.nodeCaptchaKey = document.createElement('input');
					this.nodeCaptchaKey.value = GM_getValue(this.idCaptchaKey, '');
					this.nodeCaptchaKey.addEventListener('change', (event) => {
						event.preventDefault();
						GM_setValue(this.idCaptchaKey, this.nodeCaptchaKey.value);
					});
					/*
					this.idProxy = this.prefixTool + 'proxy';
					this.nodeProxy = document.createElement('input');
					this.nodeProxy.value = GM_getValue(this.idProxy, '');
					this.nodeProxy.addEventListener('change', (event) => {
						event.preventDefault();
						GM_setValue(this.idProxy, this.nodeProxy.value);
					});
					this.idProxyType = this.prefixTool + 'proxyType';
					this.nodeProxyType = document.createElement('input');
					this.nodeProxyType.value = GM_getValue(this.idProxyType, '');
					this.nodeProxyType.addEventListener('change', (event) => {
						event.preventDefault();
						GM_setValue(this.idProxyType, this.nodeProxyType.value);
					});
					*/
					this.idCaptchaLimit = this.prefixTool + 'captchaLimit';
					this.nodeCaptchaLimit = document.createElement('input');
					this.nodeCaptchaLimit.setAttribute('type', 'number');
					this.nodeCaptchaLimit.setAttribute('min', '0');
					this.nodeCaptchaLimit.value = GM_getValue(this.idCaptchaLimit, '50');
					this.nodeCaptchaLimit.addEventListener('change', (event) => {
						event.preventDefault();
						GM_setValue(this.idCaptchaLimit, this.nodeCaptchaLimit.value);
					});
					this.nodeCaptchaIndex = document.createElement('input');
					this.nodeCaptchaIndex.setAttribute('type', 'number');
					this.nodeCaptchaIndex.value = GM_getValue(this.idCaptchaIndex = this.prefixTool + 'captchaIndex', '0');
					this.nodeCaptchaIndex.disabled = 'disabled'
					this.nodeCaptchaIndex.addEventListener('change', (event) => {
						event.preventDefault();
						GM_setValue(this.nodeCaptchaIndex, this.nodeCaptchaIndex.value);
					});
					let node2 = document.createElement('div');
					node2.appendChild(document.createTextNode(' Booking every '));
					node2.appendChild(this.nodeMinutesBooking);
					node2.appendChild(document.createTextNode(' and then '));
					node2.appendChild(this.nodeMinutesWait);
					node2.appendChild(document.createTextNode(' minutes. Max price: '));
					node2.appendChild(this.nodeMaxPrice);
					this.nodeNotBlockDrivers = document.createElement('ul');
					let node1 = document.createElement('div');
					node1.appendChild(document.createTextNode('Not block ('));
					this.nodeCopy = document.createElement('button');
					this.nodeCopy.appendChild(document.createTextNode('copy'));
					this.nodeCopy.addEventListener('click', function(me) {
						return function(event) {
							event.preventDefault();
							me.copyDrivers();
						};
					}(this));
					node1.appendChild(this.nodeCopy);
					this.nodePaste = document.createElement('button');
					this.nodePaste.appendChild(document.createTextNode('paste'));
					this.nodePaste.addEventListener('click', function(me) {
						return function(event) {
							event.preventDefault();
							me.pasteDrivers();
						};
					}(this));
					node1.appendChild(this.nodePaste);
					node1.appendChild(document.createTextNode('):'));
					this.drivers = {};
					if (page.driver) this.addDriver(page.driver);
					for (let i = 0, keys = GM_listValues(); i < keys.length; i++) {
						let arr = keys[i].match(/driver_([0-9a-zA-Z]+)_notBlockTrip/);
						if (arr && (!page.driver || page.driver.id !== arr[1])) {
							this.addDriver(new Driver(arr[1]));
						}
					}
					node1.appendChild(this.nodeNotBlockDrivers);
					this.nodeTool.appendChild(this.nodeStart);
					this.nodeTool.appendChild(document.createTextNode(' Block every  '));
					this.nodeTool.appendChild(this.nodeMinutesCheckPoiskPoputchikov);
					this.nodeTool.appendChild(document.createTextNode(' minutes: '));
					this.nodeTool.appendChild(this.nodeLinkPoiskPoputchikov);
					this.nodeTool.appendChild(document.createTextNode(' Captcha key: '));
					this.nodeTool.appendChild(this.nodeCaptchaKey);
					/*
					this.nodeTool.appendChild(document.createTextNode(' Proxy: '));
					this.nodeTool.appendChild(this.nodeProxy);
					this.nodeTool.appendChild(document.createTextNode(' Proxy type: '));
					this.nodeTool.appendChild(this.nodeProxyType);
					*/
					this.nodeTool.appendChild(document.createTextNode(' Captcha response: '));
					this.nodeTool.appendChild(this.nodeCaptchaResponse = document.createTextNode('-'));
					this.nodeTool.appendChild(document.createTextNode(' Captcha limit: '));
					this.nodeTool.appendChild(this.nodeCaptchaIndex);
					this.nodeTool.appendChild(document.createTextNode('/'));
					this.nodeTool.appendChild(this.nodeCaptchaLimit);
					this.nodeTool.appendChild(node2)
					this.nodeTool.appendChild(node1)
				}
				copyDrivers() {
					let nodeCopy = document.createElement('input');
					nodeCopy.setAttribute('type', 'text');
					nodeCopy.value = '';
					for(let k in this.drivers) {
						let driver = this.drivers[k];
						if (driver.notBlockTrip) nodeCopy.value = nodeCopy.value + '<driver id="' + driver.id + '" name="' + driver.name + '" />\n';
					}
					this.nodeTool.appendChild(nodeCopy);
					nodeCopy.select();
					document.execCommand('copy');
					nodeCopy.remove();
				}
				elPasteDrivers(event, nd) {
					event.preventDefault();
					let arr = nd.value.match(/<driver[^\/]+\/>/g);
					if (arr) {
						for(let i = 0; i < arr.length; i++) {
							let arr1 = arr[i].match(/\bid=["']([^"']*)["']/);
							if (arr1) {
								let driver = new Driver(arr1[1]);
								driver.notBlockTrip = true;
								GM_setValue(driver.idNotBlockTrip, driver.notBlockTrip);
								arr1 = arr[i].match(/\bname=["']([^"']*)["']/)
								if (arr1) {
									driver.name = arr1[1];
									GM_setValue(driver.idName, driver.name);
								}
								if (!this.drivers[driver.id]) this.addDriver(driver);
							}
						}
					}
					nd.remove();
				}
				pasteDrivers() {
					let node = document.createElement('textarea');
					node.setAttribute('placeholder', 'Press Ctrl+V or Paste here');
					node.addEventListener('input', function(me, nd) {
						return function(event) {
							me.elPasteDrivers(event, nd);
						};
					}(this, node));
					this.nodeTool.appendChild(node);
					node.select();
				}
				addDriver(driver) {
					let nodeName = document.createTextNode(driver.name);
					let nodeTool = document.createElement('li');
					let nodeNot = document.createElement('input');
					nodeNot.setAttribute('type', 'checkbox');
					nodeNot.checked = driver.notBlockTrip;
					nodeNot.addEventListener('change', function(drv, ndNot) {
						return function(event) {
							event.preventDefault();
							drv.notBlockTrip = ndNot.checked;
							if (drv.notBlockTrip) {
								GM_setValue(drv.idNotBlockTrip, drv.notBlockTrip);
								GM_setValue(drv.idName, drv.name);
							} else {
								GM_deleteValue(drv.idNotBlockTrip);
								GM_deleteValue(drv.idName);
							}
						};
					}(driver, nodeNot));
					nodeTool.appendChild(nodeNot);
					nodeTool.appendChild(document.createTextNode(' '));
					nodeTool.appendChild(nodeName);
					nodeTool.appendChild(document.createTextNode(' / ' + driver.id));
					this.drivers[driver.id] = driver;
					this.drivers[driver.id].nodeNot = nodeNot;
					this.nodeNotBlockDrivers.appendChild(nodeTool);
				}
				refreshHrefPoiskPoputchikov() {
					if (page.isPoiskPoputchikov) this.hrefPoiskPoputchikov = location.href;
					//this.hrefPoiskPoputchikov = this.hrefPoiskPoputchikov.replace(/\/\#\?/g, '/?');
					this.hrefPoiskPoputchikov = this.hrefPoiskPoputchikov.replace(/\bpage=\d+\b/g, 'page=1');
					//this.hrefPoiskPoputchikov = this.hrefPoiskPoputchikov.replace(/\bpmin=\d+\b/g, 'pmin=0');
					if (this.hrefPoiskPoputchikov.match(/\bpmax=\d+\b/)) this.hrefPoiskPoputchikov = this.hrefPoiskPoputchikov.replace(/\bpmax=\d+\b/g, 'pmax=' + this.maxPrice);
					else this.hrefPoiskPoputchikov = this.hrefPoiskPoputchikov.replace(/\?/, '?pmax=' + this.maxPrice + '&');
					if (this.hrefPoiskPoputchikov.match(/\bpmin=\d+\b/)) this.hrefPoiskPoputchikov = this.hrefPoiskPoputchikov.replace(/\bpmin=\d+\b/g, 'pmin=0');
					else this.hrefPoiskPoputchikov = this.hrefPoiskPoputchikov.replace(/\?/, '?pmin=0&');
					GM_setValue(this.idHrefPoiskPoputchikov, this.hrefPoiskPoputchikov);
					this.nodeLinkPoiskPoputchikov.setAttribute('href', this.hrefPoiskPoputchikov);
					this.nodeName.data = decodeURI(this.hrefPoiskPoputchikov);
				}
				changeStart() {
					let disabled = (this.app.nodeStart.checked ? 'disabled' : '');
					this.nodeStart.disabled                        = disabled;
					this.nodeMinutesCheckPoiskPoputchikov.disabled = disabled;
					this.nodeMinutesBooking.disabled               = disabled;
					this.nodeMinutesWait.disabled                  = disabled;
					this.nodeCopy.disabled                         = disabled;
					this.nodePaste.disabled                        = disabled;
					this.nodeMaxPrice.disabled                     = disabled;
					this.nodeCaptchaKey.disabled                   = disabled;
					/*
					this.nodeProxy.disabled                        = disabled;
					this.nodeProxyType.disabled                    = disabled;
					*/
					this.nodeCaptchaLimit.disabled                 = disabled;
					if (this.app.nodeStart.checked && !!this.app.prevStartChecked) this.nodeCaptchaIndex.value = '0';
					for(let k in this.drivers) {
						this.drivers[k].nodeNot.disabled = disabled;
					}
				}
				plan() {
					return this.start && this.app.nodeStart.checked && !!this.hrefPoiskPoputchikov? {
						timeout: this.app.getTimeoutHuman(),
						action : function(me) {return function() {
							me.nodeLinkPoiskPoputchikov.click();
							//location.href = href;
							//location.reload();
						};}(this)
					}: null;
				}
			} // ToolBlockTrip

			class ToolBlockTripPagePoiskPoputchikov extends ToolBlockTrip {
				init28() {
					super.init28();
					this.nodesTripTool = [];
					this.init(false);
					this.nodeStart.addEventListener('change', (v) => {
						v.preventDefault();
						this.init(true);
					});
				}
				init(pageInit) {
					if (pageInit) page.init();
					for (let i = 0; i < this.nodesTripTool.length; i++) this.nodesTripTool[i].remove();
					for (let i = 0; i < page.trips.length; i++) {
						let trip = page.trips[i];
						trip.setMaxPrice(this.maxPrice);
						let notBlock = (trip.driver && trip.driver.notBlockTrip) || !trip.asSearch;
						if (!page.firstBlockTrip && !notBlock) page.firstBlockTrip = trip;
						if (notBlock || page.firstBlockTrip) {
							let j = this.nodesTripTool.length;
							this.nodesTripTool[j] = createNodeTool();
							this.nodesTripTool[j].appendChild(document.createTextNode(notBlock? ' NO BLOCK ': ' !!! BLOCK !!! '));
							page.nodesTrip[i].insertBefore(this.nodesTripTool[j], page.nodesTrip[i].firstChild);
						}
					}
				}
				changeStart() {
					super.changeStart();
					this.init(true);
				}
				plan() {
					if (this.start && this.app.nodeStart.checked) {
						if (page.filterIsOld) {
							this.start = false;
							this.nodeStart.checked = this.start;
							return null;
						} else if (page.firstBlockTrip || !page.last) return {
							timeout: this.app.getTimeoutHuman(),
							action:  function(pg, me) {
								return function() {
									me.init(true);
									if (pg.firstBlockTrip) pg.firstBlockTrip.nodeAncorPoezdka.click();
									else if (!pg.last) {
										pg.nodeAncorNext.click();
										setTimeout(function() {location.reload()}, 1000);
									} else location.reload();
								};
							} (page, this)
						}; else if (this.hrefPoiskPoputchikov) return {
							timeout: this.minutesToTimeoutCheck(this.minutesCheckPoiskPoputchikov),
							action:  function(me) {return function() {
								me.nodeLinkPoiskPoputchikov.click();
								setTimeout(function() {location.reload()}, 1000);
								/*location.href = href;
								location.reload();*/
							};} (this)
						}; else return null;
					} else return null;
				}
			} // ToolBlockTripPagePoiskPoputchikov

			class ToolBlockTripPagePoezdka extends ToolBlockTrip {
				init28() {
					super.init28();
					this.hrefPoezdka = location.href;
					GM_setValue(this.idHrefPoezdka, this.hrefPoezdka);
				}
				plan() {
					if (this.start && this.app.nodeStart.checked && page.driver && !page.driver.notBlockTrip && page.seats > 0) return {
						timeout: this.app.getTimeoutHuman(),
						action:  function(pg) {
							return function() {
								pg.nodeSeats.value = pg.seats;
								pg.nodeCGU.checked = true
								pg.nodeButtonBooking.click();
							};
						}(page)
					}; else if (this.start && this.app.nodeStart.checked && page.driver && !page.driver.notBlockTrip && page.nodeAncorProdolzhitOplatu) return {
						timeout: this.minutesToTimeoutCheck(this.minutesWait),
						action : function() {location.reload()}
					}; else return super.plan();
				}
			} // ToolBlockTripPagePoezdka

			class ToolBlockTripPageOplata extends ToolBlockTrip {
				plan() {
					if (this.start && this.app.nodeStart.checked && this.hrefPoezdka) return {
						timeout: this.minutesToTimeoutCheck(this.minutesBooking),
						action : () => location.href = this.hrefPoezdka
					}; else return super.plan();
				}
			} // ToolBlockTripPagePoezdka

			class ToolBlockTripPageConnect extends ToolBlockTrip {
				init28() {
					super.init28();
					this.ok = !!this.app.page.nodeButtonLogin;
					this.planCurrent = this.ok ? {timeout: this.app.getTimeoutHuman(), action: () => this.app.page.nodeButtonLogin.click()} : null;
				}
				plan() {
					return this.planCurrent;
				}
			} // ToolBlockTripPageConnect

			class ToolBlockTripPageCaptcha extends ToolBlockTrip {
				init28() {
					super.init28();
					this.ok = this.app.nodeDebug.checked || (parseInt(this.nodeCaptchaIndex.value) < parseInt(this.nodeCaptchaLimit.value));
					this.planCurrent = (this.ok && !this.app.nodeDebug.checked)? {timeout: this.app.getTimeoutHuman(), action: () => this.app.page.nodeSubmit.click()} : null;
				}
				plan() {
					return this.planCurrent;
				}
			} // ToolBlockTripPageCaptcha
			
			class ToolBlockTripPageReCaptchaApi2BFrame extends ToolBlockTrip {
				init28() {
					super.init28();
					this.buttonActionGetCaptcha = document.createElement('button');
					this.buttonActionGetCaptcha.appendChild(document.createTextNode('Create Canvas'));
					this.buttonActionGetCaptcha.addEventListener('click', (v) => {
						v.preventDefault();
						this.app.page.init(() => {});
						//this.nodeCaptcha.appendChild(this.app.page.nodeBody);
						this.nodeCaptcha.appendChild(this.app.page.nodeBody.domCanvas);
					});
					setStyleHidable(this.nodeCaptcha = document.createElement('div'));
					this.buttonShowBase64 = document.createElement('button');
					this.buttonShowBase64.appendChild(document.createTextNode('Show Basa64 Image'));
					this.buttonShowBase64.addEventListener('click', (v) => {
						v.preventDefault();
						this.nodeBase64.src = this.app.page.nodeBody.toDataUrl();
					});
					setStyleHidable(this.nodeBase64 = document.createElement('img'));
					this.nodeBase64.setAttribute('crossorigin', 'anonymous');
					this.nodeBase64.setAttribute('width', '100px');
					this.nodeBase64.setAttribute('height', '100px');
					this.buttonActionIn = document.createElement('button');
					this.buttonActionIn.appendChild(document.createTextNode('Find captcha'));
					this.buttonActionIn.addEventListener('click', (v) => {
						v.preventDefault();
						this.setPlan(this.planReCapthca2OldIn);
					});
					this.buttonReCaptchaClick = document.createElement('button');
					this.buttonReCaptchaClick.appendChild(document.createTextNode('Captcha Verify'));
					this.buttonReCaptchaClick.addEventListener('click', (v) => {
						v.preventDefault();
						this.app.page.buttonReCaptchaVerify.click();
					});
					this.buttonReCaptchaVerify = document.createElement('button');
					this.buttonReCaptchaVerify.appendChild(document.createTextNode('Click to Images'));
					this.buttonReCaptchaVerify.addEventListener('click', (v) => {
						v.preventDefault();
						this.actionReCaptcha2OldClick();
					});
					this.nodeDebug.appendChild(this.buttonActionGetCaptcha);
					this.nodeDebug.appendChild(this.nodeCaptcha);
					this.nodeDebug.appendChild(this.buttonShowBase64);
					this.nodeDebug.appendChild(this.nodeBase64);
					this.nodeDebug.appendChild(this.buttonActionIn);
					this.nodeDebug.appendChild(this.buttonReCaptchaClick);
					this.nodeDebug.appendChild(this.buttonReCaptchaVerify);
					this.ok = this.app.nodeDebug.checked || (parseInt(this.nodeCaptchaIndex.value) < parseInt(this.nodeCaptchaLimit.value));
					this.planReCapthca2InitAndOldIn   = {timeout:  0       , action: () => this.actionReCapthca2InitAndOldIn()  };
					this.planReCapthca2OldIn          = {timeout:  0       , action: () => this.actionReCapthca2OldIn()         };
					this.planReCapthca2OldInRepeat    = {timeout:  5 * 1000, action: () => this.actionReCapthca2OldIn()         };
					this.planReCapthca2OldResWait     = {timeout:  5 * 1000, action: () => this.actionReCapthca2OldRes()        };
					this.planReCapthca2OldResRepeat   = {timeout:  5 * 1000, action: () => this.actionReCapthca2OldRes()        };
					this.planReCaptcha2OldCheckChange = {timeout:  5 * 1000, action: () => this.actionReCaptcha2OldCheckChange()};
					this.planCurrent = (this.ok && !this.app.nodeDebug.checked)? this.planReCapthca2InitAndOldIn : null;
				}
				setPlan(plan) {
					this.planCurrent = plan;
					this.app.runPlan();
				}
				plan() {
					return this.planCurrent;
				}
				actionReCapthca2InitAndOldIn() {
					this.app.page.init(() => {
						if (!!this.app.page.nodeTryLater) {
							GM_setValue('cmd', 'windowTopLocationReloadLater');
							this.setPlan({timeout: 1920000 + this.app.getTimeoutHuman(), action: () => ''});
						} else this.actionReCapthca2OldIn();
					});
				}
				actionReCapthca2OldIn() {
					if (this.ok = (this.nodeCaptchaKey.value != '')) GM_xmlhttpRequest({
						method: 'POST',
						url   : 'http://rucaptcha.com/in.php',
						data  : 'method=base64'
							+ '&recaptcha=1'
							+ '&canvas=0'
							+ '&can_no_answer=1'
							+ '&key='              + this.nodeCaptchaKey.value
							+ '&textinstructions=' + this.app.page.textInstructions
							+ '&recaptcharows='    + this.app.page.captchaRows
							+ '&recaptchacols='    + this.app.page.captchaCols
							+ '&body='             + encodeURIComponent(this.app.page.captchaBodyBase64),
						onload: (v) => {
							if (v.status == 500 || v.status == 502) this.setPlan(this.planReCapthca2OldInRepeat);
							else {
								this.nodeCaptchaResponse.data = v.responseText;
								let arrResponse = v.responseText.match(/^OK\|(.+)$/);
								if (this.ok = !!arrResponse) {
									this.captchaId = arrResponse[1];
									this.setPlan(this.planReCapthca2OldResWait);
								}
							}
						}
					});
				}
				actionReCapthca2OldRes() {
					if (this.ok) GM_xmlhttpRequest({
						method: 'GET',
						url:    'http://rucaptcha.com/res.php?key=' + this.nodeCaptchaKey.value + '&action=get&id=' + this.captchaId,
						onload: (v) => {
							if (v.status == 500 || v.status == 502) this.setPlan(this.planReCapthca2OldResRepeat);
							else {
								this.nodeCaptchaResponse.data = v.responseText;
								if (/^CAPCHA_NOT_READY/.test(v.responseText)) this.setPlan(this.planReCapthca2OldResRepeat);
								else if (/^OK\|No_matching_images/.test(v.responseText)) this.actionReCaptcha2OldClickVerify();
								else if (/^ERROR_CAPTCHA_UNSOLVABLE/.test(v.responseText)) this.setPlan(this.planReCapthca2OldIn);
								else {
									let arrResponse = v.responseText.match(/^OK\|click:([0-9\/]+)$/);
									this.nodeCaptchaIndex.value = parseInt(this.nodeCaptchaIndex.value) + 1;
									if (this.ok = !!arrResponse) {
										let clicksChr = arrResponse[1].match(/[0-9]+/g);
										this.clicks = new Array(clicksChr.length);
										clicksChr.forEach((v, i) => this.clicks[i] = parseInt(v) - 1);
										this.clickIndex = 0;
										this.srcs = new Array(this.app.page.nodesCaptchaImgs.length);
										for(let i = 0; i < this.app.page.nodesCaptchaImgs.length; i++) this.srcs[i] = this.app.page.nodesCaptchaImgs[i].src;
										if (!this.app.nodeDebug.checked) this.actionReCaptcha2OldClick();
									}
								}
							}
						}
					});
				}
				actionReCaptcha2OldClick() {
					if (this.clickIndex < this.clicks.length) {
						this.app.page.nodesImageSelect[this.clicks[this.clickIndex]].click();
						this.clickIndex++;
						if (!this.app.nodeDebug.checked) this.setPlan({timeout: this.app.getTimeoutHuman(), action: () => this.actionReCaptcha2OldClick()});
					} else {
						this.setPlan(this.planReCaptcha2OldCheckChange);
						//if (!this.app.nodeDebug.checked) this.setPlan({timeout: this.app.getTimeoutHuman(), action: () => this.actionReCapthca2OldIn()});
					}
				}
				actionReCaptcha2OldCheckChange() {
					this.app.page.initImgs();
					if (this.app.page.selected) this.actionReCaptcha2OldClickVerify();
					else this.actionReCapthca2InitAndOldIn();
				}
				actionReCaptcha2OldClickVerify() {
					if (!this.app.nodeDebug.checked && this.app.page.ok) {
						this.nodeCaptchaIndex.value = parseInt(this.nodeCaptchaIndex.value) + 1;
						this.app.page.buttonReCaptchaVerify.click();
						this.setPlan({timeout: 5000 + this.app.getTimeoutHuman(), action: () => this.actionReCapthca2InitAndOldIn()});
					}
				}
			}


			this.nodeStart = document.createElement('input');
			this.nodeStart.setAttribute('type', 'checkbox');
			this.prevStartChecked = this.nodeStart.checked =  GM_getValue(idStart, false);
			this.nodeDebug = document.createElement('input');
			this.nodeDebug.setAttribute('type', 'checkbox');
			this.nodeDebug.checked = GM_getValue(this.idDebug = 'debug', false);
			this.nodeDebug.addEventListener('change', (v) => {
				v.preventDefault();
				GM_setValue(this.idDebug, this.nodeDebug.checked);
			});

			var pages = {
				/*
				tripOffersActive   : {regsHref: [regHrefTripOffersActive                ], Page: PageTripOffersActive   }, 
				tripOfferPassengers: {regsHref: [regHrefPassengers                      ], Page: PageTripOfferPassengers},
				messagesShow       : {regsHref: [regHrefMessagesShow, regHrefMessageInit], Page: PageMessagesShow       },
				*/
				poiskPoputchikov   : {regsHref: [regHrefPoiskPoputchikov, regHrefSearch ], Page: PagePoiskPoputchikov   },
				poezdka            : {regsHref: [regHrefPoezdka                         ], Page: PagePoezdka            },
				oplata             : {regsHref: [regHrefOplata                          ], Page: PageOplata             },
				connect            : {regsHref: [regHrefConnect                         ], Page: PageConnect            },
				captcha            : {regsHref: [regHrefCaptcha                         ], Page: PageCaptcha            },
				reCaptchaApi2BFrame: {regsHref: [regHrefReCaptchaApi2BFrame             ], Page: PageReCaptchaApi2BFrame}
			};
			var Tools = [
				{
					
					items: [
						{page: pages.poiskPoputchikov   , Tool: ToolBlockTripPagePoiskPoputchikov   },
						{page: pages.poezdka            , Tool: ToolBlockTripPagePoezdka            },
						{page: pages.oplata             , Tool: ToolBlockTripPageOplata             },
						{page: pages.connect            , Tool: ToolBlockTripPageConnect            },
						{page: pages.captcha            , Tool: ToolBlockTripPageCaptcha            },
						{page: pages.reCaptchaApi2BFrame, Tool: ToolBlockTripPageReCaptchaApi2BFrame}
					]/*,
					Default: ToolBlockTrip*/
				}
			];
			for (var idPage in pages) pages[idPage].Tools = [];
			for (var iTool = 0; iTool < Tools.length; iTool++) {
				var ToolsItems = Tools[iTool].items;
				for (var iPage = 0; iPage < ToolsItems.length; iPage++) {
					var ToolsPage             = ToolsItems[iPage];
					var PagesTools            = ToolsPage.page.Tools;
					var iToolsInPages         = PagesTools.length;
					PagesTools[iToolsInPages] = ToolsPage.Tool;
				}
			}
			for (let idPage in pages) {
				let pagesPage = pages[idPage];
				for (let iRegHref = 0; iRegHref < pagesPage.regsHref.length && ok && !page; iRegHref++) if (pagesPage.regsHref[iRegHref].test(location.href)) {
					this.page = page = new (pagesPage.Page)(this);
					if (ok = ok && page.ok) for (let iTool = 0; iTool < pagesPage.Tools.length && ok; iTool++) tools[iTool] = new (pagesPage.Tools[iTool])(this);
				}
				if (page || !ok) break;
			}
			if (ok) {
				if (!page) {
					this.page = page = new Page(this);
					ok = ok && this.page.ok;
					for (let iTool = 0; iTool < Tools.length && ok; iTool++) if (Tools[iTool].Default) {
						let jTool = tools.length;
						tools[jTool] = new (Tools[iTool].Default)(this);
					}
				}
				let ok1 = false;
				for (let iTool = 0; iTool < tools.length && !ok1; iTool++) ok1 = ok1 || !!tools[iTool].plan;
				ok = ok && ok1;
			}
			
			this.tools = tools;
			
			this.elReset = function(event) {
				event.preventDefault();
				this.gmDeleteValues();
				location.reload();
			};
			this.elChangeStart = (event, tools) => {
				event.preventDefault();
				if (!this.nodeStart.checked) {
					clearTimeout(this.idTimeoutAction);
					clearTimeout(idTimeoutCounter);
					nodeTimer.data = '';
				}
				this.prevStartChecked = GM_getValue(idStart, false);
				GM_setValue(idStart, this.nodeStart.checked);
				this.changeStart(tools);
				if (this.nodeStart.checked) this.runPlan();
			};

			this.changeStart = function(tools) {
				nodeReset.disabled = (this.nodeStart.checked ? 'disabled' : '');
				for (var iTool = 0; iTool < tools.length; iTool++) {
					tools[iTool].changeStart();
				}
			};

			this.runPlan18 = (plan) => { // plan = {action: func, timeout: msec}
				time = Date.now() + plan.timeout;
				this.counter();
				this.idTimeoutAction = setTimeout(plan.action, plan.timeout);
			};

			this.runPlan = () => {
				if (this.nodeStart.checked || this.nodeDebug.checked) {
					let plan;
					for (let i = 0; i < tools.length; i++) {
						let planMB = tools[i].plan();
						if (planMB && (!plan || planMB.timeout < plan.timeout)) plan = planMB;
					}
					if (plan) {
						this.runPlan18(plan);
						/*
						time = Date.now() + plan.timeout;
						this.counter();
						this.idTimeoutAction = setTimeout(plan.action, plan.timeout);
						*/
					}
				}
			};
			
			this.counter = function() {
				var timeout      = time - Date.now();
				var fullsec      = parseInt(timeout / 1000);
				var justsec      = fullsec % 60;
				if (!nodeTimer) {
					nodeTimer = document.createTextNode('');
					let newTool = !nodeTool;
					if (newTool) nodeTool = createNodeTool(true, 'position:fixed;');
					nodeTool.appendChild(nodeTimer);
					if (newTool) document.body.insertBefore(nodeTool, document.body.firstChild);
				}
				nodeTimer.data  = ((timeout <= 0) ? '0:00' : (parseInt(fullsec / 60) + ':' + ((justsec < 10) ? '0' : '') + justsec));
				idTimeoutCounter = setTimeout(() => this.counter(), timeoutCounter);
			};
			
			function createNodeTool(hidable = false, style = '') {
				let node = document.createElement('div');
				setStyle(node, 'border:2px solid red;padding:4px;overflow:hidden;background-color:white;z-index:10000;' + style);
				if (hidable) setStyleHidable(node);
				return node;
			}

			function setStyleHidable(node){
				//setStyle(node, 'border:2px solid red;padding:4px;overflow:hidden;background-color:white;position:fixed;z-index:10000;');
				let hide = (v) => setStyle(node, 'height:16px;width:128px;', !v);
				hide(true);
				node.addEventListener(
					'mouseenter',
					(event => {
						event.preventDefault();
						hide(false);
					})
				);
				node.addEventListener(
					'mouseleave',
					(event => {
						event.preventDefault();
						hide(true);
					})
				);
				return node;
			}

			function setStyle(node, style, clear = false) {
				let st = node.getAttribute('style');
				if (st || !clear) node.setAttribute('style', (st ? st.replace(new RegExp('\\s*\\b(' + style.replace(/\s*\b(\w+)\s*:[^;]*;\s*/g, '$1|').slice(0, -1) + ')\\s*:[^;]*;', 'g'), '') : '') + (clear ? '' : style));
			}
			this.gmDeleteValues = function() {
				var gmValues = GM_listValues();
				for (var i = 0; i < gmValues.length; i++) GM_deleteValue(gmValues[i]);
			};

			function gmShowValues() {
				var gmValues = GM_listValues();
				var gmObj    = {};
				for (var i = 0; i < gmValues.length; i++) gmObj[gmValues[i]] = GM_getValue(gmValues[i]);
				console.log(gmObj);
			}

			function setVisible(args /*{node: this.nodeDebug, nodeCheckbox: this.app.nodeDebug}*/) {
				let setMyStyle = () => setStyle(args.node, 'display:' + (args.nodeCheckbox.checked ? 'block' : 'none') + ';');
				setMyStyle();
				args.nodeCheckbox.addEventListener('change', (v) => {
					v.preventDefault();
					setMyStyle();
				});
			}
			var nodeTool;
			if (this.ok = ok) {
				/////////////// Create node Tool //////////////////////////
				nodeTool = createNodeTool(true, 'position:fixed;');
				nodeTimer = document.createTextNode('');
				this.nodeStart.addEventListener('change', (event) => this.elChangeStart(event, tools));
				nodeReset = document.createElement('button');
				nodeReset.appendChild(document.createTextNode('Reset'));
				nodeReset.addEventListener('click', function(me) {return function(event) {me.elReset(event);};}(this));
				nodeTool.appendChild(this.nodeStart);
				nodeTool.appendChild(document.createTextNode(' Start '));
				nodeTool.appendChild(nodeTimer);
				nodeTool.appendChild(nodeReset);
				nodeTool.appendChild(this.nodeDebug);
				nodeTool.appendChild(document.createTextNode(' Debug '));

				this.changeStart(tools);
				///////////////////////////////////////////////////////////
				////////////// Append tools to node Tool //////////////////
				for (var iTool = 0; iTool < tools.length; iTool++) if (tools[iTool].nodeTool) nodeTool.appendChild(tools[iTool].nodeTool);
				///////////////////////////////////////////////////////////
		        document.body.insertBefore(nodeTool, document.body.firstChild);
				this.runPlan();
			}
	
			//gmShowValues();
			console.log('app = ', this);
			if (!ok) {
				console.log('app = ', this);
			}
			let cmdCheck = () => setTimeout(() => {
				switch (GM_getValue('cmd')) {
					case 'windowTopLocationReloadLater':
						if (window.top === window.self) {
							GM_deleteValue('cmd');
							this.runPlan18({action: () => window.location.reload(), timeout: 1920000 + this.getTimeoutHuman()})
						}
						break;
				}
				cmdCheck();
			}, 5000);
			cmdCheck();
		});
	}, (/(\/ride-sharing\/([^\/]+\/[^\/]+)\/|\/search\?)/.test(location.href)? 15000: 15000));
})();
