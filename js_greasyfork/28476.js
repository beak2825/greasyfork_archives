// ==UserScript==
// @name         bv7_blablacar
// @namespace    bv7
// @version      1.15
// @description  say 'blaaaa blaaaaa caaaaaaar'
// @author       bv7
// @include      https://www.blablacar.ru/*
// @include      https://m.blablacar.ru/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/28476/bv7_blablacar.user.js
// @updateURL https://update.greasyfork.org/scripts/28476/bv7_blablacar.meta.js
// ==/UserScript==

(function() {
    'use strict';
	addEventListener('load', function() {

		class App {
			constructor() {
				this.elStartStop      = document.createElement("button");
				this.elMinutesBooking = document.createElement('input');
				//https://www.blablacar.ru/trip?proximity_from=MIDDLE&distance_from=4982&proximity_to=MIDDLE&distance_to=14693&requested_seats=1&source=CARPOOLING&id=1930903256-moskva-pushkin
				//https://www.blablacar.ru/trip?proximity_from=MIDDLE&distance_from=8045&proximity_to=FAR&distance_to=16163&requested_seats=1&source=PRO_PARTNER&pro_partner_id=busfor&id=2020-03-25_QkJDcGFydG5lcn4zMzExMH4yNDQ0MzB-MTsxMH5-MTI1fjBlZTY5ZGIzOGIwNzZiNTlmNzg1M2QyMGY1NjlhNmRh
        //https://www.blablacar.ru/trip?proximity_from=MIDDLE&distance_from=10546&proximity_to=CLOSE&distance_to=739&requested_seats=1&source=CARPOOLING&id=1960259877-moskva-mogilev
				this.regTripCarpooling         = /\/trip\?.*\bsource=(CARPOOLING|PRO_PARTNER)\b.*\bid=([^&]*)/;
				//this.regTripCarpooling         = /\/trip\/carpooling\/([^\?]*)/;
				this.intervalHuman         =                                      1 * 1000;  // millisecond
				this.intervalHumanAddMax   =                                      9 * 1000;  // millisecond
				this.intervalBooking       = GM_getValue('minutesBooking', 16) * 60 * 1000;  // millisecond
				this.intervalBookingAddMax =                                 1 * 60 * 1000;  // millisecond
				this.intervalCounter       =                                      1 * 1000;  // millisecond
				this.app = this;
				this.idtInterval = 0;
				this.idtCounter  = 0;
				this.init();
				this.elMinutesBooking.setAttribute('type', 'number');
				this.elMinutesBooking.setAttribute('min', '0');
				this.elMinutesBooking.setAttribute('max', '600');
				this.elMinutesBooking.setAttribute('style', 'width:3em');
				this.elMinutesBooking.value = GM_getValue('minutesBooking', 16);
				this.elMinutesBooking.addEventListener('change', {
					handleEvent: function(event) {
						event.preventDefault();
						GM_setValue('minutesBooking', this.app.elMinutesBooking.value);
					},
					app: this
				});
				var elTool   = document.createElement("div");
				elTool.setAttribute('style', 'position:absolute;z-index:1024;');
				elTool.appendChild(this.elStartStop);
				elTool.appendChild(document.createTextNode(' Booking every '));
				elTool.appendChild(this.elMinutesBooking);
				elTool.appendChild(document.createTextNode(' minutes.'));
				document.body.insertBefore(elTool, document.body.firstChild);
				this.elStartStop.addEventListener(
					"click",
					{
						handleEvent: function(event) {
							event.preventDefault();
							var time = GM_getValue('time', 0);
							if (time > 0) {
								clearTimeout(this.app.idtInterval);
								clearTimeout(this.app.idtCounter);
								this.app.idtInterval = 0;
								this.app.idtCounter  = 0;
								GM_deleteValue('time');
								GM_deleteValue('wait');
								this.app.stopping();
							}
							else {
								GM_setValue('time', Date.now());
								this.app.init();
								if (this.app.isTripCarpooling) GM_setValue('href', this.app.trip.href);
								this.app.check(app);
							}
						},
						app: this
					},
					false
				);
			}
			newTrip(href = '') {
        //console.log('href = ', href);
				return (href == null || !this.regTripCarpooling.test(href)) ? null : {
					href: href,
					id: href.match(this.regTripCarpooling)[2]
				};
			}
			init() {
				this.isTripCarpooling = this.regTripCarpooling.test(location.href);
				this.trip = (this.isTripCarpooling) ? this.newTrip(location.href) : null;
				this.storedTrip = this.newTrip(GM_getValue('href', null));
				this.isStoredTrip = this.storedTrip !== null;
				this.isTripCarpoolingAsStored = this.isTripCarpooling && this.isStoredTrip && (this.trip.id == this.storedTrip.id);
			};
			counter(app) {
				var time = GM_getValue('time', 0);
				var repeat = time > 0;
				if (repeat) {
					var intervalTime = Math.max(time - Date.now(), 0);
					var fullsec = parseInt(intervalTime / 1000);
					var justsec = fullsec % 60;
					app.elStartStop.innerHTML = ((intervalTime <= 0) ? '0:00' : (parseInt(fullsec / 60) + ':' + ((justsec < 10) ? '0' : '') + justsec)) + ' Stop: ' + app.storedTrip.id;
					repeat = intervalTime > 0;
					if (repeat && app.idtCounter === 0) app.idtCounter = setInterval(app.counter, app.intervalCounter, app);
				}
				if (!repeat && app.idtCounter !== 0) {
					clearInterval(app.idtCounter);
					app.idtCounter = 0;
				}
			};
			check(app) {
				var time = GM_getValue('time', 0);
				app.init();
				if (time == 0 && (app.isTripCarpooling || app.isStoredTrip)) {
					app.stopping();
				} else if (time > 0) {
					var now = Date.now();
					if (time > now) {
						app.idtInterval = setTimeout(app.check, now - time, app);
						app.counter(app);
					} else {
						var checked = false;
						var el = null;
						if (app.isTripCarpooling) {
							el = document.querySelector(".kirk-button-primary");
							if (el !== null) {
								if (!app.isStoredTrip) {
									GM_setValue('href', app.trip.href);
									app.init();
								}
								checked = app.isTripCarpoolingAsStored;
								if (checked) {
									GM_setValue('time', Date.now() + app.intervalBooking + Math.random() * app.intervalBookingAddMax);
									el.click();
									app.idtInterval = setTimeout(app.check, 0, app);
								}
							} else {
								checked = true;
								GM_setValue('time', Date.now() + app.intervalHuman + Math.random() * app.intervalHumanAddMax);
								app.idtInterval = setTimeout(app.check, 0, app);
							}
						}
						if (app.isStoredTrip && !checked) {
							GM_setValue('time', Date.now() + app.intervalHuman + Math.random() * app.intervalHumanAddMax);
							location.href = app.storedTrip.href;
							app.idtInterval = setTimeout(app.check, 0, app);
						}
					}
				}
			}
			stopping() {
				this.init();
				this.elStartStop.innerHTML = 'Start ' + (this.isTripCarpooling? this.trip.id: this.storedTrip.id);
				this.elMinutesBooking.disabled = '';
			}
		}

		var app = new App();
		app.check(app);
	});

})();
