// ==UserScript==
// @name         bv7_bbc_helper_b
// @namespace    bv7
// @version      1.2.1b
// @description  say 'caaaaaaar' then I will help you
// @author       bv7
// @include      https://www.blablacar.ru/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/29028/bv7_bbc_helper_b.user.js
// @updateURL https://update.greasyfork.org/scripts/29028/bv7_bbc_helper_b.meta.js
// ==/UserScript==


(function() {
	'use strict';

	addEventListener('load', function() {
		new (function() {
	        
			this.idStart                = 'start';
			this.idTimeoutCounter       = 'timeoutCounter';
			var ok                      = true;
			var page;
			var regHrefTripOffersActive = /\/dashboard\/trip-offers\/active/; // regual expression for identify of link to "Trip Offers Active"
			var regHrefPassengers       = /\/dashboard\/trip-offer\/(\d+)\/passengers/;
			var regHrefMessagesShow     = /\/messages\/show\/[^\/]+/;
			var rehHrefMessageInit      = /\/messages\/init\/[^\/]-(\d+)\/([^\/]+)/;
			var prefixTrip              = 'trip_';                // prefix for stored parametrs of Trip with GM_setValue function
			var regPrefixTrip           = new RegExp('/' + prefixTrip + '(\d+)_/');
			var tools                   = {};


			function Trip(id) 													{ // Class
				this.id                 = id;
				this.prefix             = prefixTrip + this.id + '_';
				this.prefixPassenger    = this.prefix + 'passenger_'
				this.regPrefixPassenger = new RegExp('/' + this.prefixPassenger + '([0-9a-zA-Z]+)_/');
				this.idDefault          = this.prefix + 'default';
				this.idSendMessage      = this.prefix + 'sendMessage';
				this.idMessage          = this.prefix + 'message';
				this.idMessageCount     = this.prefix + 'messageCount';
				this.idHrefPassengers   = this.prefix + 'hrefPassengers';
				this.default            = GM_getValue(this.idDefault, true);
				this.messageCount       = GM_getValue(this.idMessageCount, 0);
				this.hrefPassengers     = GM_getValue(this.idHrefPassengers, '');
			} // Class Trip

			function Passenger(badId, trip) { // Class
				this.id         = badId.replace(/[^0-9a-zA-Z]/g, '');
				this.prefix     = trip.prefixPassenger + this.id + '_';
				this.idMessaged = this.prefix + 'messaged';
				this.messaged   = GM_getValue(this.idMessaged, false);
			} // Class Passenger

			function Page() 		{ // Class
				this.idHrefTripOffersActive = 'href_tripOffersActive';
			} // Class

			function PageTripOffersActive() 																																											{ // Class
				function MyTrip(nodeTrip) { // Class
					this.nodeAncorPassengers = nodeTrip.querySelector('a[href^="/dashboard/trip-offer/"][href$="/passengers"].passengers');
					this.nodeAncorEdit       = nodeTrip.querySelector('a[href^="/dashboard/trip-offer/"][href$="/modify"].edit');
					this.bookedCount         = nodeTrip.querySelectorAll('li.booked').length;
					this.actual              = this.nodeAncorEdit       !== null;
					ok                       = this.nodeAncorPassengers !== null;
					if (ok) {
						this.strWithId = this.nodeAncorPassengers.getAttribute('href');
						ok             = this.strWithTripId !== null;
						if (ok) {
							var arrId = this.strWithId.match(/\/dashboard\/trip-offer\/(\d+)\/passengers/);
							ok        = arrId.length > 1;
							if (ok) Trip.call(this, arrId[1]);
						}
					}
				} // Class NodeTrip
				MyTrip.prototype = Object.create(Trip.prototype);
				Page.call(this);
				this.nodesTrip        = document.querySelectorAll('li.my-trip');
				this.actualTripsCount = 0;
				this.trips = new Array(this.nodesTrip.length);
				this.tripsIdx  = {};
				for (var i = 0; i < this.nodesTrip.length && ok; i++) {
					this.trips[i] = new MyTrip(this.nodesTrip[i]);
					if (ok) {
						this.actualTripsCount++;
						this.tripsIdx[this.trips[i].id] = this.trips[i];
					}
				}
				if (ok) {
					/////////////////////////// Remove from GM store values for trips are not exist 
					var gmValues = GM_listValues();
					for (var i = 0; i < gmValues.length; i++) {
						var arrId = gmValues[i].match(regPrefixTrip);
						if (arrId) {
							var id = arrId[1];
							if (id && !this.tripsIdx[id]) GM_deleteValue(gmValues[i]);
						}
					}
					//////////////////////////////////////////////////////////////////////////////////
					GM_setValue(this.idHrefTripOffersActive, location.href);
				}
		} // PageTripOffersActive
			PageTripOffersActive.prototype = Object.create(Page.prototype);

			function PageTripOfferPassengers() { // Class
				function MyTrip() { // Class
					function MyPassenger(nodePassenger, trip) { // Class
						this.nodeCancel       = nodePassenger.querySelector('a.delete');
						this.nodeAncorMessage = nodePassenger.querySelector('a[href^="/messages/init/"].blue');
						this.nodeSeat         = nodePassenger.querySelector('li.passenger-seat');
						this.booked           = this.nodeCancel !== null;
						ok                    = this.nodeAncorMessage !== null && this.nodeSeat !== null;
						if (ok) {
							var arrId    = this.nodeAncorMessage.getAttribute('href').match(/\/messages\/init\/[^\/]+-\d+\/([^\/]+)/);
							var arrSeats = this.nodeSeat.innerText.match(/^(\d+)[^\d]/);
							ok       = arrId !== null && arrSeats !== null;
							if (ok) {
								this.seatsCount = parseInt(arrSeats[1]);
								Passenger.call(this, arrId[1], trip);
							}
						}
					} // Class NodePassenger
					MyPassenger.prototype = Object.create(Passenger.prototype);
					this.strWithId          = location.href;
					this.nodesPassenger     = document.querySelectorAll('div.accordion-group');
					var arrId               = this.strWithId.match(regHrefPassengers);
					ok                      = arrId.length > 1;
					if (ok) {
						Trip.call(this, arrId[1]);
						this.passengers          = new Array(this.nodesPassenger.length);
						this.bookedCount         = 0;
						this.messageCount        = 0;
						this.passengersBookedIdx = {};
						for (var i = 0; i < this.nodesPassenger.length && ok; i++) {
							this.passengers[i] = new MyPassenger(this.nodesPassenger[i], this);
							if (ok && this.passengers[i].booked) {
								this.bookedCount = this.bookedCount + this.passengers[i].seatsCount;
								if (this.passengers[i].messaged) this.messageCount = this.messageCount + this.passengers[i].seatsCount;
								this.passengersBookedIdx[this.passengers[i].id] = this.passengers[i];
							}
						}
						if (ok) {
							var gmValues = GM_listValues();
							for (var i = 0; i < gmValues.length; i++) {
								var arrId = gmValues[i].match(this.regPrefixPassenger);
								if (arrId && !this.passengersBookedIdx[arrId[1]]) GM_deleteValue(gmValues[i]);
							}
							GM_setValue(this.idMessageCount,   this.messageCount);
							GM_setValue(this.idHrefPassengers, location.href);
						}
					}
				} // Class MyTrip
				MyTrip.prototype = Object.create(Trip.prototype);
				Page.call(this);
				this.trip = new MyTrip();
			} // Class TripOfferPassengers
			PageTripOfferPassengers.prototype = Object.create(Page.prototype);


			function PageMessagesShow() 																											{ // Class
				function MyTrip(nodeForm) { // Class
					function MyPassenger(trip) { // Class
						this.nodeBadId  = document.getElementById('message_recipient_encrypted_id');
						ok              = this.nodeBadId !== null;
						if (ok) Passenger.call(this, this.nodeBadId.value, trip);
					} // Class MyPassenger
					MyPassenger.prototype = Object.create(Passenger.prototype);
					this.strWithId        = nodeForm.getAttribute('action');
					ok                    = this.strWithId !== null;
					if (ok) {
						var arrId = this.strWithId.match(/^\/messages\/send\/[^\/]+-(\d+)/);
						ok        = arrId && arrId.length > 1;
						if (ok) {
							Trip.call(this, arrId[1]);
							this.passenger = new MyPassenger(this);
						}
					}
				} // Class MyTrip
				MyTrip.prototype  = Object.create(Trip.prototype);
				Page.call(this);
				this.nodeForm     = document.getElementById('qa');
				this.nodeMessage  = document.getElementById('message_content');
				this.nodeButton   = document.getElementById('sendMessageButton');
				this.nodesMessage = document.querySelectorAll('div.trip-my-qa p:not([class])');
				ok                = this.nodeForm && this.nodeMessage && this.nodeButton;
				if (ok) this.trip = new MyTrip(this.nodeForm);
			} // Class PageMessagesShow
			PageMessagesShow.prototype = Object.create(Page.prototype);


			function Tool() 									{ // Class
				this.timeoutHuman          = GM_getValue('timeoutHuman',        3 * 1000)  // milliseconds for reading page for bot
					+ Math.random() *        GM_getValue('timeoutHumanAddMax',  9 * 1000); // max add milliseconds to time for reading page for bot
				this.timeoutCheckAdd       = GM_getValue('timeoutCheckAddMax', 60 * 1000)  // max add milliseconds to timeout for check states
					* Math.random();
				this.changeStart           = function() {};
				this.minutesToTimeoutCheck = function(minutes) {
					return minutes * 60000 + this.timeoutCheckAdd;
				};
			} //Class Tool

			function ToolSendMessage() 																														{ // Class
				Tool.call(this)
				this.prefixTool               = 'toolSendMessage_'
				this.idSendMessage            = this.prefixTool + 'sendMessage';
				this.idMessage                = this.prefixTool + 'message';
				this.idMinutesCheckPassengers = this.prefixTool + 'minutesCheckPassengers';
				this.plan                     = null;
				this.minutesCheckPassengers   = GM_getValue(this.idMinutesCheckPassengers, 17) // default minutes between checkings of changing of passingers
				this.sendMessage              = GM_getValue(this.idSendMessage, false);
				this.message                  = GM_getValue(this.idMessage,     '');
				this.getPlanDefault           = function() 															{
				var href = GM_getValue(page.idHrefTripOffersActive, '');
//				console.log(page.idHrefTripOffersActive);
				return href? function(me, href) {
					return function() {
						return {
							timeout: me.timeoutHuman,
							action : function(href) {
								return function() {
									location.href = href;
								};
							}(href)
						};
					};
				}(this, href): null;
			};
				this.setTrip = function(trip) 			{
				trip.sendMessage = (trip.default? this.sendMessage: GM_getValue(trip.idSendMessage, this.sendMessage));
				trip.message     = (trip.default? this.message    : GM_getValue(trip.idMessage,     this.message));
			};
			} // Class ToolSendMessage
			ToolSendMessage.prototype = Object.create(Tool.prototype);

			function ToolSendMessagePageTripOffersActive(bbch) 																																																																																																																																	{ // Class
				ToolSendMessage.call(this);
				ok = page.actualTripsCount > 0;
				if (ok) {
					////////////////////// Create node Trip Offers Active tool /////////////////////////
					this.nodeTool = createNodeTool();
					this.nodeSendMessage = document.createElement('input');
					this.nodeSendMessage.setAttribute('type', 'checkbox');
					this.nodeMessage = document.createElement('textarea');
					this.nodeMessage.setAttribute('placeholder', 'Message');
					this.nodeSendMessage.addEventListener('change', function(me, trips) {
						return function(event) {
							event.preventDefault();
							GM_setValue(me.idSendMessage, me.nodeSendMessage.checked);
							for(var i = 0; i < trips.length; i++) if (trips[i].actual && trips[i].nodeDefault.checked) trips[i].nodeSendMessage.checked = me.nodeSendMessage.checked;
						};
					} (this, page.trips));
					this.nodeMessage.addEventListener('change', function(me, trips) {
						return function(event) {
							event.preventDefault();
							GM_setValue(me.idMessage, me.nodeMessage.value);
							for(var i = 0; i < trips.length; i++) if (trips[i].actual && trips[i].nodeDefault.checked) trips[i].nodeMessage.value = me.nodeMessage.value;
						};
					}(this, page.trips));
					this.nodeMinutesCheckPassengers = document.createElement('input');
					this.nodeMinutesCheckPassengers.setAttribute('type', 'number');
					this.nodeMinutesCheckPassengers.setAttribute('min', '0');
					this.nodeMinutesCheckPassengers.setAttribute('max', '600');
					this.nodeMinutesCheckPassengers.setAttribute('style', 'width:3em');
					this.nodeMinutesCheckPassengers.addEventListener('change', function(me) {
						return function(event) {
							event.preventDefault();
							me.minutesCheckPassengers = me.nodeMinutesCheckPassengers.value;
							GM_setValue(me.idMinutesCheckPassengers, me.minutesCheckPassengers);
						};
					}(this));
					this.nodeTool.appendChild(document.createTextNode(' Check every '));
					this.nodeTool.appendChild(this.nodeMinutesCheckPassengers);
					this.nodeTool.appendChild(document.createTextNode(' minutes for '));
					this.nodeTool.appendChild(this.nodeSendMessage)
					this.nodeTool.appendChild(document.createTextNode(' send message: '));
					this.nodeTool.appendChild(this.nodeMessage);
					this.nodeSendMessage.checked          = this.sendMessage;
					this.nodeMessage.value                = this.message;
					this.nodeMinutesCheckPassengers.value = this.minutesCheckPassengers;
					for(var i = 0; i < page.trips.length; i++) {
						var trip = page.trips[i];
						if (trip.actual) {
							var nodeTripTool = createNodeTool();
							trip.nodeDefault = document.createElement('input');
							trip.nodeDefault.setAttribute('type', 'checkbox');
							trip.nodeSendMessage = document.createElement('input');
							trip.nodeSendMessage.setAttribute('type', 'checkbox');
							trip.nodeMessage  = document.createElement('textarea');
							trip.nodeMessage.setAttribute('placeholder', 'Message');
							trip.nodeDefault.addEventListener('change', function(me, trip) {
								return function(event) {
									event.preventDefault();
									GM_setValue(trip.idDefault, trip.nodeDefault.checked);
									var disabled = (trip.nodeDefault.checked ? 'disabled' : '');
									trip.nodeSendMessage.checked  = me.nodeSendMessage.checked;
									trip.nodeMessage.value        = me.nodeMessage.value;
									trip.nodeSendMessage.disabled = disabled;
									trip.nodeMessage.disabled     = disabled;
									if (!trip.nodeDefault.checked) {
										GM_setValue(trip.idSendMessage, trip.nodeSendMessage.checked);
										GM_setValue(trip.idMessage,     trip.nodeMessage.value);
									}
								};
							}(this, trip));
							trip.nodeSendMessage.addEventListener('change', function(trip) {
								return function(event) {
									event.preventDefault();
									GM_setValue(trip.idSendMessage, trip.nodeSendMessage.checked);
								};
							}(trip));
							trip.nodeMessage.addEventListener('change', function(trip) {
								return function(event) {
									event.preventDefault();
									GM_setValue(trip.idMessage, trip.nodeMessage.value);
								};
							}(trip));
							trip.nodeCountMessaged = document.createTextNode('');
							this.setTrip(trip);
							trip.nodeDefault.checked     = trip.default;
							trip.nodeSendMessage.checked = trip.sendMessage;
							trip.nodeMessage.value       = trip.message;
							trip.nodeCountMessaged.data  = ' Send message (' + trip.messageCount + '/' + trip.bookedCount + '): ';
							nodeTripTool.appendChild(trip.nodeDefault);
							nodeTripTool.appendChild(document.createTextNode(' Use default settings: '));
							nodeTripTool.appendChild(trip.nodeSendMessage);
							nodeTripTool.appendChild(trip.nodeCountMessaged);
							nodeTripTool.appendChild(trip.nodeMessage);
							page.nodesTrip[i].insertBefore(nodeTripTool, page.nodesTrip[i].firstChild);
						}
					}
					this.plan = function() {
						for (var i = 0; i < page.trips.length; i++) {
							var trip = page.trips[i];
							if (trip.actual &&
								(trip.nodeDefault.checked ? (this.nodeSendMessage.checked && this.nodeMessage.value) : (trip.nodeSendMessage.checked && trip.nodeMessage.value)) &&
								trip.bookedCount > trip.messageCount
							) return {
								timeout: this.timeoutHuman,
								action : function(trip){
									return function() {
										trip.nodeAncorPassengers.click();
									};
								}(trip)
							};
						}
						return {
							timeout: this.minutesToTimeoutCheck(this.minutesCheckPassengers),
							action : function() {location.reload();}
						};
					};
					this.changeStart = function() {
						var disabled = (bbch.nodeStart.checked ? 'disabled' : '');
						this.nodeSendMessage.disabled            = disabled;
						this.nodeMessage.disabled                = disabled;
						this.nodeMinutesCheckPassengers.disabled = disabled;
						for(var i = 0; i < page.trips.length; i++) if(page.trips[i].actual) {
							var disabled2                          = ((bbch.nodeStart.checked || page.trips[i].nodeDefault.checked)? 'disabled' : '')
							page.trips[i].nodeDefault.disabled     = disabled;
							page.trips[i].nodeSendMessage.disabled = disabled2;
							page.trips[i].nodeMessage.disabled     = disabled2;
						}
					};
				}
			} // Class ToolSendMessagePageTripOffersActive
			ToolSendMessagePageTripOffersActive.prototype = Object.create(ToolSendMessage.prototype);

			function ToolSendMessagePageTripOfferPassengers() { // Class
				ToolSendMessage.call(this);
				this.setTrip(page.trip);
				if (page.trip.sendMessage) {
					ok = page.trip.passengers.length > 0;
					if (ok) {
						for (var i = 0; i < page.trip.passengers.length; i++) {
							var passenger = page.trip.passengers[i];
							if (passenger.booked) {
								//////////////// Create node Passenger tool ////////////////
								var nodePassenger     = page.trip.nodesPassenger[i];
								var nodePassengerTool = createNodeTool();
								nodePassengerTool.appendChild(document.createTextNode('Send message (' + (passenger.messaged? '1': '0') + '/1)'));
								nodePassenger.insertBefore(nodePassengerTool, nodePassenger.firstChild);
								/////////////////////////////////////////////////////
								if (!passenger.messaged && !this.plan) this.plan = function(nodeAncor, me) {
									return function() {
										return {
											timeout: me.timeoutHuman,
											action:  function(nodeAnc) {
												return function() {
													nodeAnc.click();
												};
											}(nodeAncor)
										};
									};
								}(passenger.nodeAncorMessage, this);
							}
						}
						this.nodeTool = createNodeTool();
						this.nodeTool.appendChild(document.createTextNode('Send message (' + page.trip.messageCount + '/' + page.trip.bookedCount + ').'));
						if (!this.plan) this.plan = this.getPlanDefault();
					}
				}
			} // Class ToolSendMessagePageTripOfferPassengers
			ToolSendMessagePageTripOfferPassengers.prototype = Object.create(ToolSendMessage.prototype);

			function ToolSendMessagePageMessagesShow() { // Class
				ToolSendMessage.call(this);
				this.setTrip(page.trip);
				if (page.trip.sendMessage) {
					if (!page.trip.passenger.messaged) {
						for (var i = 0; i < page.nodesMessage.length && !page.trip.passenger.messaged; i++) page.trip.passenger.messaged = page.nodesMessage[i].innerText === '"' + page.trip.message + '"';
						GM_setValue(page.trip.passenger.idMessaged, page.trip.passenger.messaged);
					}
					this.plan = page.trip.passenger.messaged? (page.trip.hrefPassengers? function(me, href) {
						return function() {
							return {
								timeout: me.timeoutHuman,
								action:  function(href) {
									return function() {
										location.href = href;
									};
								}(href)
							};
						};
					}(this, page.trip.hrefPassengers): this.getPlanDefault()): function(me, page) {
						return function() {
							page.nodeMessage.value = page.trip.message;
							return {
								timeout: me.timeoutHuman,
								action:  function(page) {
									return function() {
										GM_setValue(page.trip.passenger.idMessaged, true);
										page.nodeButton.click();
									};
								}(page)
							};
						};
					}(this, page);
				}
			} // Class ToolSendMessagePageMessagesShow
			ToolSendMessagePageMessagesShow.prototype = Object.create(ToolSendMessage.prototype);

			function ToolSendMessageDefault() { // Class
				ToolSendMessage.call(this);
				this.plan = this.getPlanDefault();
			} // Class ToolSendMessageDefault
			ToolSendMessageDefault.prototype = Object.create(ToolSendMessage.prototype);
			


			if (regHrefTripOffersActive.test(location.href)) {
				page = new PageTripOffersActive();
				if (ok) tools.sendMessage = new ToolSendMessagePageTripOffersActive(this);
			} else if (regHrefPassengers.test(location.href)) {
				page = new PageTripOfferPassengers();
				if (ok) tools.sendMessage = new ToolSendMessagePageTripOfferPassengers();
			} else if (regHrefMessagesShow.test(location.href)) {
				page = new PageMessagesShow();
				if (ok) tools.sendMessage = new ToolSendMessagePageMessagesShow();
			} else if (rehHrefMessageInit) {
				page = new PageMessagesShow();
				if (ok) tools.sendMessage = new ToolSendMessagePageMessagesShow();
			} else {
				page = new Page();
				if (ok) tools.sendMessage = new ToolSendMessageDefault()
			}
			ok = ok && tools.sendMessage && tools.sendMessage.plan;

			this.changeStart = function() {
				this.nodeReset.disabled = (this.nodeStart.checked ? 'disabled' : '');
				tools.sendMessage.changeStart();
			};

			this.runPlan = function() {
				if (this.nodeStart.checked) {
					var plan = tools.sendMessage.plan();
					this.time = Date.now() + plan.timeout;
					this.counter();
					this.idTimeoutAction = setTimeout(plan.action, plan.timeout);
				}
			};

			this.counter = function() {
				var timeout = this.time - Date.now();
				var fullsec = parseInt(timeout / 1000);
				var justsec = fullsec % 60;
				this.nodeTimer.data   = ((timeout <= 0) ? '0:00' : (parseInt(fullsec / 60) + ':' + ((justsec < 10) ? '0' : '') + justsec));
				this.idTimeoutCounter = setTimeout(function(me) {
					return function() {
						me.counter();
					};
				} (this), GM_getValue('timeoutCounter', 1 * 1000)); // milliseconds for counter
			};
			


			function createNodeTool() {
				var node = document.createElement('div');
				node.setAttribute('style', 'border:2px solid red;padding:4px');
				return node;
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
			if (ok) {
				/////////////// Create node Tool //////////////////////////
				var nodeTool = createNodeTool();
				this.nodeStart = document.createElement('input');
				this.nodeStart.setAttribute('type', 'checkbox');
				this.nodeStart.checked = GM_getValue(this.idStart, false);
				this.nodeTimer = document.createTextNode('');
				this.nodeStart.addEventListener('change', function(me) {
					return function(event) {
						event.preventDefault();
						if (me.nodeStart.checked)
							me.runPlan();
						else {
							clearTimeout(me.idTimeoutAction);
							clearTimeout(me.idTimeoutCounter);
							me.nodeTimer.data = '';
						}
						GM_setValue(me.idStart, me.nodeStart.checked);
						me.changeStart();
					};
				}(this));
				this.nodeReset = document.createElement('button');
				this.nodeReset.appendChild(document.createTextNode('Reset'));
				this.nodeReset.addEventListener('click', function(me) {
					return function(event) {
						event.preventDefault();
						me.gmDeleteValues();
						location.reload();
					};
				}(this));
				nodeTool.appendChild(me.nodeStart);
				nodeTool.appendChild(document.createTextNode(' Start '));
				nodeTool.appendChild(me.nodeTimer);
				nodeTool.appendChild(this.nodeReset);

				this.changeStart();
				///////////////////////////////////////////////////////////
				////////////// Append tools to node Tool //////////////////
				if (tools.sendMessage.nodeTool) nodeTool.appendChild(tools.sendMessage.nodeTool);
				///////////////////////////////////////////////////////////
		        document.body.insertBefore(nodeTool, document.body.firstChild);
				this.runPlan();
	//			gmShowValues();
	//			console.log(page);
			}
	/*
			if (!ok) {
				gmShowValues();
				console.log(page);
				console.log(tools);
			}
	*/
		});
	});    
})();
