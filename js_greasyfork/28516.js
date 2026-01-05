// ==UserScript==
// @name         bv7_blablacar_b
// @namespace    bv7
// @version      1.11b.1
// @description  say 'blaaaa blaaaaa caaaaaaar'
// @author       bv7
// @include      https://www.blablacar.ru/*
// @include      https://m.blablacar.ru/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/28516/bv7_blablacar_b.user.js
// @updateURL https://update.greasyfork.org/scripts/28516/bv7_blablacar_b.meta.js
// ==/UserScript==

(function() {
    'use strict';
	addEventListener('load', function() {

		var regTripCarpooling         = /\/trip\/carpooling\/([^\?]*)/; 
		var regBookingCarpoolingSeats = /\/booking\/carpooling\/([^\?]*)\/seats/;
	
		var elStartStop      = document.createElement("button");
		var elMinutesBooking = document.createElement('input');

		var idtInterval      = 0;
		var idtCounter       = 0;

		function newTrip(href) {
			return (href == null) ? null : {
				href: href,
				id: href.match(regTripCarpooling)[1]
			};
		};

		var page = new Object();
		page.init = function() {
			this.isTripCarpooling = regTripCarpooling.test(location.href);
			this.trip = (this.isTripCarpooling) ? newTrip(location.href) : null;
			this.storedTrip = newTrip(GM_getValue('href', null));
			this.isStoredTrip = this.storedTrip !== null;
			this.isTripCarpoolingAsStored = this.isTripCarpooling && this.isStoredTrip && (this.trip.id == this.storedTrip.id);
		};

		console.log('47: CheckPoint');

		page.init();

		var check = () => {

			var intervalHuman            =                                      1 * 1000;  // millisecond
			var intervalHumanAddMax      =                                      9 * 1000;  // millisecond

			var intervalBooking          = GM_getValue('minutesBooking', 16) * 60 * 1000;  // millisecond
			var intervalBookingAddMax    =                                 1 * 60 * 1000;  // millisecond

			var intervalCounter          =                                      1 * 1000;  // millisecond

			var time = GM_getValue('time', 0);

			page.init();

			if (time == 0 && (page.isTripCarpooling || page.isStoredTrip)) {
				stopping();
			} else if (time > 0) {
	
				var now = Date.now();
	
				console.log('72: CheckPoint');
				
				if (time > now) {
					idtInterval = setTimeout(() => check(), now - time);

					var counter = () => {
						var time = GM_getValue('time', 0);
						if (time > 0) {
							var intervalTime = Math.max(time - Date.now(), 0);
							var fullsec           = parseInt(intervalTime / 1000);
							var justsec           = fullsec % 60;
							elStartStop.innerHTML = ((intervalTime <= 0) ? '0:00' : (parseInt(fullsec / 60) + ':' + ((justsec < 10) ? '0' : '') + justsec)) + ' Stop: ' + page.storedTrip.id;
							if (intervalTime > 0) idtCounter = setTimeout(() => counter(), intervalCounter);
						}
					};
					counter();
			

				} else {
					
					console.log('90: CheckPoint');

					var checked = false;
					var el = null;
					
					if (page.isTripCarpooling) {
						//el = document.querySelector("a.kirk-button-primary");
						el = document.querySelector(".kirk-button-primary");
						
						console.log('97: el = ', el);
						
						if (el !== null) {
							if (!page.isStoredTrip) {
								GM_setValue('href', page.trip.href);
								page.init();
							}
							checked = page.isTripCarpoolingAsStored;
							if (checked) {
								GM_setValue('time', Date.now() + intervalHuman + Math.random() * intervalHumanAddMax);
								el.click();
								check();
							}
						}
					} else if (page.isStoredTrip && regBookingCarpoolingSeats.test(location.href)) {
						
						console.log('111: location.href.match(regBookingCarpoolingSeats)[1] = ', location.href.match(regBookingCarpoolingSeats)[1]);
						
						if (page.storedTrip.id == location.href.match(regBookingCarpoolingSeats)[1]) {
							el = document.querySelector('button.kirk-stepper-increment:not([disabled])');
							
							console.log('119: el = ', el);
							
							checked = el !== null;
							if (checked) {
								
								console.log('117: CheckPoint');
								
								GM_setValue('time', Date.now() + intervalHuman + Math.random() * intervalHumanAddMax);
								var event = document.createEvent('MouseEvents');
								event.initEvent('mousedown', true, false);
								el.dispatchEvent(event);
								check();
							} else {
								el = document.querySelector('button.kirk-stepper-increment[disabled]');
								
								console.log('125: el = ', el);
								
								if (el !== null) {
									var event = document.createEvent('MouseEvents');
									event.initEvent('mouseup', true, false);
									el.dispatchEvent(event);
									el = document.querySelector("button.kirk-button-primary");
									
									console.log('131: el = ', el);
									
									checked = el !== null;
									if (checked) {
										GM_setValue('time', Date.now() + intervalBooking + Math.random() * intervalBookingAddMax);
										el.click();
										check();
									}
								}
							}
						}
					}
					if (page.isStoredTrip && !checked) {
						GM_setValue('time', Date.now() + intervalHuman + Math.random() * intervalHumanAddMax);
						location.href = page.storedTrip.href;
						check();
					}
				}
			}
		};

		console.log('151: CheckPoint');

		function stopping() {
			page.init();
            elStartStop.innerHTML = 'Start ' + (page.isTripCarpooling? page.trip.id: page.storedTrip.id);
            elMinutesBooking.disabled = '';
        }

		var elTool   = document.createElement("div");

		elTool.setAttribute('style', 'position:absolute;z-index:1024;');
		elTool.appendChild(elStartStop);
		elMinutesBooking.setAttribute('type', 'number');
		elMinutesBooking.setAttribute('min', '0');
		elMinutesBooking.setAttribute('max', '600');
		elMinutesBooking.setAttribute('style', 'width:3em');
		elMinutesBooking.value = GM_getValue('minutesBooking', 16);
		elMinutesBooking.addEventListener(
			'change', 
			(event) => {
				event.preventDefault();
				GM_setValue('minutesBooking', elMinutesBooking.value);
			}
		);
		elTool.appendChild(document.createTextNode(' Booking every '));
		elTool.appendChild(elMinutesBooking);
		elTool.appendChild(document.createTextNode(' minutes.'));
		document.body.insertBefore(elTool, document.body.firstChild);
		elStartStop.addEventListener(
			"click", 
			(event) => {
				event.preventDefault();
				var time = GM_getValue('time', 0);
				if (time > 0) {
					clearTimeout(idtInterval);
					clearTimeout(idtCounter);
					GM_deleteValue('time');
					GM_deleteValue('wait');
					stopping();
				}
				else {
					GM_setValue('time', Date.now());
					page.init();
					if (page.isTripCarpooling) GM_setValue('href', page.trip.href);
					check();
				}
			},
			false
		);
		
		console.log('198: CheckPoint');
		
		check();
		
		console.log('200: CheckPoint');
	
	});

})();
