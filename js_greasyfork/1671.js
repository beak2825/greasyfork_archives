// ==UserScript==
// @name        TW-FriendsEvents
// @description   Add a button for filtering friends who wants event stuff
// @include     http*://*.the-west.*/game.php*
// @version     1.4.4.1
// @nocompat Chrome
// @grant       none
// @namespace https://greasyfork.org/users/2196
// @downloadURL https://update.greasyfork.org/scripts/1671/TW-FriendsEvents.user.js
// @updateURL https://update.greasyfork.org/scripts/1671/TW-FriendsEvents.meta.js
// ==/UserScript==
(function(e) {
	var t = document.createElement("script");
	t.type = "application/javascript";
	t.textContent = "(" + e + ")();";
	document.body.appendChild(t);
	t.parentNode.removeChild(t);
})
		(function() {
			if (/.+\.the-west\..*\/game\.php.*/
					.test(window.location.href)) {
         
				FriendsEvents = {
					info : {
						lang : 'en',
						version : '1.4.3.1',
						min_gameversion : '2.0',
						max_gameversion : '2.2',
						description :	"<center><BR /><b>TW FriendsEvents</b><br><br><b>Add a button for filtering friends who wants event stuff</b><center>",
						url:'https://greasyfork.org/fr/scripts/1671-tw-friendsevents'
							
				    },
					id : "",
					interval : 0,
					ready : false,
					create : function(runId) {

						try {

							this.id = runId;

							WestUi.FriendsBar.friendsBarUi.friendsBar.filterTypes_[runId
									.toLowerCase()] = function(player) {

								if (player.name === Character.name)
									return false; 

								var ev = Game.sesData[runId];

								var lastActivation = WestUi.FriendsBar.friendsBarUi.friendsBar
										.getEventActivation(runId,
												player.player_id);

								var diff = lastActivation
										+ parseInt(ev.friendsbar.cooldown, 10)
										- new ServerDate().getTime() / 1000;

								return (diff < 0);

							};

							var img = $('<img class="filter_event'
									+ runId
									+ '" src="/images/interface/friendsbar/events/'
									+ runId + '.png" />');

							var here = $('div.toggler-left');

							here.before($('<div class="fbar-event-img"  />')
									.append(img));
							img
									.click(function(e) {
										if (!isDefined(WestUi.FriendsBar.friendsBarUi.friendsBar.activeFilters_[runId
												.toLowerCase()])) {

											WestUi.FriendsBar.friendsBarUi
													.inLine(runId);

											$('.filter_event' + runId).css({
												'opacity' : '1'
											});
										} else {
											WestUi.FriendsBar.friendsBarUi.friendsBar
													.setFilter(runId
															.toLowerCase(),
															null);

											$('.filter_event' + runId).css({
												'opacity' : '0.43'
											});
											WestUi.FriendsBar.friendsBarUi
													.changeEvents_('listen');
										}
									}

									);
							img.css({
								'opacity' : '0.43',
								'cursor' : 'pointer'
							});

							this.ready = true;
						} catch (e) {
							ErrorLog.log('Erreur de creation du button du FriendsEvent: ', e);
							ErrorLog.showLog();
						}
						return this;
					},getDunMp : function() {

						if (Game.worldName == 'Monde 1'
								|| Game.worldName == 'Monde 3'
								|| Game.worldName == 'Alamogordo'
								|| Game.worldName == 'Death Valley') {
							return "<div style='text-align:right;padding-right: 5px; padding-top: 15px;'><a href=\"javascript:MessagesWindow.open(\'telegram\', {insert_to: \'Dun\'})\">by Dun</a></div>";
						} else {
							if (Game.worldName == 'World 1') {
								return "<div style='text-align:right;padding-right: 5px; padding-top: 15px;'><a href=\"javascript:MessagesWindow.open(\'telegram\', {insert_to: \'Duncol\'})\">by Dun</a></div>";

							}
							return "";
						}
						;
					},
				api : function() {

						var TWApi = TheWestApi.register('TW_FriendsEvents',
								'TW FriendsEvents', FriendsEvents.info.min_gameversion,
								FriendsEvents.info.max_gameversion, 'Dun - v'
										+ FriendsEvents.info.version,
										FriendsEvents.info.url);


						TWApi
								.setGui($(
										"<div id='FriendsEventsApiContent' style=' font-family: comic sans ms;font-size: 12pt;padding-top: 10px;text-align: right;'>"
												+ FriendsEvents.info.description
												+ "</div>").after(
										FriendsEvents.getDunMp()));

					}
				};

				try {
 
			    FriendsEvents.api();
					
					FriendsEvents.interval = setInterval(
							function() {

								var loading = false;
             
								if (Game.loaded){
			            var runningEvents = west.events.Manager.getRunningEvents();
									if(runningEvents.length>0){
                    
                         if (isDefined(WestUi.FriendsBar.friendsBarUi)) {
                           loading = true;
                         // console.log("Loaded")
                         }else{
                               WestUi.FriendsBar.toggle();                               
                         }
                     
						                    if (loading) {
						
						                          WestUi.FriendsBar.friendsBarUi.inLine = function(eventId) {
						
						                                    WestUi.FriendsBar.friendsBarUi
						                                        .changeEvents_('unlisten');
						                                    $('.filter_event2'+eventId).css({
						                                      'opacity' : '1'
						                                    });
						                                    WestUi.FriendsBar.friendsBarUi.friendsBar
						                                        .setFilter(eventId.toLowerCase(), true);
						
						
						                          };
						
						                    
						
						                      // for each active events
						                      for(i=0;i<runningEvents.length;i++){
						
						                        var runId=runningEvents[i].id;
						                        if(isDefined( Game.sesData[runId])) { 
						                          Game.sesData[runId].friendsEvent 
						                          = FriendsEvents.create(runId);
						                        }
						                      }
                                  clearInterval(FriendsEvents.interval);
						                      FriendsEvents.ready = true;
						                    }
									}else{
					                      loading = true;
					                   //   console.log("Pas d'event : Loaded")
					                      clearInterval(FriendsEvents.interval);
									}
							}
                
							}, 500);

				} catch (e) {
					ErrorLog.log("Erreur d'initialisation", e);
         
					FriendsEvents.ready = false;
				}

			}

		});