// ==UserScript==
// @name         Whatsapp Web Logger
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  try to take over the world!
// @author       You
// @match        https://web.whatsapp.com/
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @downloadURL https://update.greasyfork.org/scripts/372185/Whatsapp%20Web%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/372185/Whatsapp%20Web%20Logger.meta.js
// ==/UserScript==

(function() {

	"use strict";

	function appendHtml( el, str ) {

		var div = document.createElement( "div" );

		div.innerHTML = str;

		while( div.children.length > 0 ) {
			el.appendChild( div.children[0] );
		}

	}

	window.onload = function(e) {

		var checkPaneSide = true;

		setInterval( function() {

			if( checkPaneSide ) {

				if( document.getElementById( "main" ) !== null ) {

					console.clear();

					checkPaneSide = false;

					appendHtml( document.getElementById( "pane-side" ), `<div id="wal"></div>` );

					appendHtml( document.querySelector( "head" ), `

						<style type="text/css">

							#wal { position: fixed; left: 0; bottom: 0; padding: 10px 10px 10px 10px; background-color: #F5F1EE; border-top: 1px solid #E2DEDB; overflow: hidden; overflow-y: scroll; }

							.wa-logger-clear-button { margin: 5px 5px 0 0; font-size: 11px; color: inherit; }

							.wa-logger-list { width: 100%; margin: 0 }
							.wa-logger-list-item td { vertical-align: middle !important; padding: 5px; font-family: inherit; font-size: 11px; }
							.wa-logger-list-item td input { font-family: inherit; }

							.wa-logger-list-item td:nth-child(1) { width: 30px; }
							.wa-logger-list-item td:nth-child(2) { width: 25px; text-align: center; }
							.wa-logger-list-item td:nth-child(3) { width: 110px; }
							.wa-logger-list-item td:nth-child(4) { width: auto; }
							.wa-logger-list-item td:nth-child(5) { width: 20px; text-align: center; }

							.wa-logger-list-item td:nth-child(2) span { width: 20px; display: block; white-space: nowrap; overflow: hidden; }

							.wa-logger-list-item[ data-status ^= "Son görülme" ]        td { background-color: rgba( 189, 195, 199, .25 ) }
							.wa-logger-list-item[ data-status ^= "son görülme" ]        td { background-color: rgba( 189, 195, 199, .25 ) }
							.wa-logger-list-item[ data-status = "çevrimdışı" ]          td { background-color: rgba( 127, 140, 141, .25 ) }
							.wa-logger-list-item[ data-status = "çevrimiçi" ]           td { background-color: rgba(  46, 204, 113, .25 ) }
							.wa-logger-list-item[ data-status = "yazıyor..." ]          td { background-color: rgba( 241, 196,  15, .25 ) }
							.wa-logger-list-item[ data-status = "ses kaydediliyor..." ] td { background-color: rgba( 241, 196,  15, .25 ) }

							.wa-logger-list-item + .wa-logger-list-item {
								border-top: 1px solid rgba( 0, 0, 0, .1 );
							}

							.wa-logger-list-item:last-child {
								border-top: none;
							}

							header[ class = "_3AwwN" ] .O90ur[ title = "çevrimiçi"  ]::after,
							header[ class = "_3AwwN" ] .O90ur[ title = "yazıyor..." ]::after { content: ""; position: fixed; left: 0; right: 0; top: 0; height: 60px; text-align: center; color: white; background-color: #25D366; display: inline-block !important; z-index: 9999px !important; animation: flash linear .3s infinite; }
							header[ class = "_3AwwN" ] .O90ur[ title = "yazıyor..." ]::after { background-color: #f1c40f; }

							@keyframes flash { 0% { opacity: 1; } 25% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }

						</style>

					` );

					var app = new Vue({

						el: "#wal",

						template: `

							<div id="wal" v-bind:style="walStyle">

								<table class="wa-logger-list" v-if=" logs.length ">

									<tbody>

										<tr class="wa-logger-list-item" v-for="(log, key) in logs" v-bind:data-status="log.status">

											<td @click="alert_date_full( log.start )">
												<span>{{ log.start | filter_date_short }}</span>
											</td>

											<td>
												<span>{{ log.name | decodeURIComponent }}</span>
											</td>

											<td>
												<span>{{ log.status | status_beautifier }}</span>
											</td>

											<td>
												<span v-if="log.duration">{{ log.duration | duration }}</span>
											</td>

											<td>
												<img :src="'https://saitergun.com/wal/api/v1/log/log.png?log=' + json_encode( log )" @click="refreshLogImage" v-if="saveLogServer" />
												<span v-else>-</span>
											</td>

										</tr>

										<tr class="wa-logger-list-item" v-if=" logs.length > 0 ">

											<td style=" text-align: left !important ">
												<label id="saveLogServer"><input type="checkbox" id="saveLogServer" v-model="saveLogServer" title="sunucuya gönder" /></label>
											</td>

											<td></td>
											<td></td>

											<td style=" text-align: right !important ">
												<input type="number" min="1" v-model="logLimit" style=" width: 40px; padding: 5px; background: transparent; border: none; font-family: inherit; font-size: 11px; " />
											</td>

											<td style=" text-align: right !important">
												<input type="checkbox" id="isLogLimited" v-model="isLogLimited" title="limit aktif" />
											</td>

										</tr>

									</tbody>

								</table>

								<table class="wa-logger-list" v-else>
									<tbody>
										<tr class="wa-logger-list-item">
											<td colspan="5" v-html="textNonLog"></td>
										</tr>
									</tbody>
								</table>

							</div>

						`,

						data: function() {

							return {

								walStyle: {
									width: ( document.getElementById( "pane-side" ).offsetWidth - 20 ) + "px",
									maxHeight: 325 + "px",
								},

								textNonLog: "...",

								isLogLimited: false,

								saveLogServer: false,

								logLimit: 10,

								logs: [],

							}

						},

						created: function() {

							var _this = this;

							if( typeof( Storage ) !== "undefined" ) {

								if( localStorage.getItem( "wal-logs" ) != null ) {

									_this.textNonLog = "localStorage datası alınıyor...";

									var storageData = JSON.parse( localStorage.getItem( "wal-logs" ) );

									if( storageData.logs.length ) {

										for( var i = 0; i < storageData.logs.length; i++ ) {

											_this.logs.push({
												id      : Number( storageData.logs[i].id ),
												type    : Number( storageData.logs[i].type ),
												phone   : Number( storageData.logs[i].phone ),
												name    : storageData.logs[i].name,
												status  : storageData.logs[i].status,
												start   : Number( storageData.logs[i].start ),
												duration: Number( storageData.logs[i].duration ),
												is_localstorage_data: true
											});

										}

									}

								}

								else {
									localStorage.setItem( "wal-logs", JSON.stringify( { at_updated: Date.now(), logs: [] } ) );
								}

							}

							window.addEventListener( "resize", _this.resizeLogBox );

							this.resizeLogBox();

							// create an observer instance, safari via webkit
							var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

							// create the observer
							var observer = new MutationObserver( function( mutations ) {
								mutations.forEach( function( mutation ) {
									_this.updateLogs();
								});
							});

							observer.observe( document.querySelector( "._1WBXd" ), { attributes: true, childList: true, characterData: true } );

						},

						methods: {

							resizeLogBox() {
								this.walStyle.width = ( document.getElementById( "pane-side" ).offsetWidth - 20 ) + "px";
							},

							updateLogs() {

								this.textNonLog = "Yeni kayıt alınıyor...";

								var id = Math.round( Date.now() / 1000 );
								var type = 0;
								var phone = 0;
								var name = document.querySelector( "header[ class = '_3AwwN' ] span[ class = '_1wjpf' ]" ).innerText.replace( /(\r\n\t|\n|\r\t)/gm, "" );
								var status = null;
								var start = Date.now();
								var duration = 0;

								// set new log status
								if( document.querySelector( "header[ class = '_3AwwN' ] span[ class = 'O90ur' ]" ) !== null ) {
									status = document.querySelector( "header[ class = '_3AwwN' ] span[ class = 'O90ur' ]" ).innerText;
								}

								// get person phone
								if( document.querySelector( "header[ class = '_3AwwN' ] img" ) !== null ) {

									var results = new RegExp( "[?&]u(=([^&#]*)|&|#|$)" ).exec( document.querySelector( "header[ class = '_3AwwN' ] img" ).getAttribute( "src" ) );

									if( ! results ) return null;
									if( ! results[2] ) return null;

									var parse_u = decodeURIComponent( results[2].replace( /\+/g, " " ) ).split( "@" );

									phone = parse_u[0]; // 905345180255

								}

								if( status == "kişi bilgisi için buraya tıkla" ) { return false; }

								if( status == "çevrimiçi" ) { type = 1; }
								if( (/Son görülme/).test( status ) ) { type = 2; }
								if( (/son görülme/).test( status ) ) { type = 2; }
								if( status == "yazıyor..." ) { type = 3; }
								if( status == "ses kaydediliyor..." ) { type = 4; }
								if( status == "kişi bilgisi için buraya tıkla" ) { type = 5; }

								if( ! navigator.onLine ) { status = "internet bağlantısı yok"; type = 10; }

								// insert log if different from last status
								if( this.logs.length == 0 || ( this.logs[0].status != status ) || ( this.logs[0].status == status && this.logs[0].is_localstorage_data ) ) {

									if( id == this.logs[0].status ) {
										id = id + 1;
									}

									this.logs.unshift({
										id      : id,
										type    : type,
										phone   : phone,
										name    : name,
										status  : status,
										start   : start,
										duration: duration,
										is_localstorage_data: false
									});

								}

								this.updateLastLogDuration();

							},

							updateLastLogDuration: function() {

								let _this = this;

								_this.logs[0].duration = _this.timeRound( ( Date.now() - _this.logs[0].start ) / 1000 );

								setInterval( function() {

									_this.logs[0].duration = _this.timeRound( ( Date.now() - _this.logs[0].start ) / 1000 );

								}, 100 );

								setInterval( function() {

									_this.updateLocalStorage();

								}, 1000 );

							},

							timeRound: function( time ) {
								return time < 1 ? 1 : Math.round( time );
							},

							updateLocalStorage() {

								if( typeof( Storage ) !== "undefined" ) {

									var isset_storage_data_old = false;

									var setItem = {
										at_updated: Date.now(),
										logs: this.logs
									}

									if( typeof( localStorage.getItem( "wal-logs" ) ) !== "undefined" ) {

										var storage_data_old = JSON.parse( localStorage.getItem( "wal-logs" ) );

										isset_storage_data_old = true;

									}

									localStorage.setItem( "wal-logs", JSON.stringify( setItem ) );

									var storage_data_new = JSON.parse( localStorage.getItem( "wal-logs" ) );

									if( isset_storage_data_old && storage_data_new.at_updated > storage_data_old.at_updated ) {
										//console.log( "updateLocalStorage(): " + ( storage_data_new.at_updated / 1000 ) )
									}

								}

							},

							clearLocalStorage() {

								for( var i = this.logs.length - 1; i >= 0; i-- ) {

									setInterval( function() {

										if( i > 0 ) {
											this.logs.splice( i, 1 );
										}

									}, 500 );

								}

								this.updateLocalStorage();

							},

							alert_date_full: function( miliseconds ) {

								var monthNames = [ "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık" ];
								var dayNames = [ "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi" ];

								var newDate = new Date( miliseconds );

								alert( newDate.getDate() + " " + monthNames[ newDate.getMonth() + 1 ] + " " + newDate.getFullYear() + ", " + dayNames[ newDate.getDay() ] + ", " + ( "0" + newDate.getHours() ).substr( -2 ) + "." + ( "0" + newDate.getMinutes() ).substr( -2 ) + "." + ( "0" + newDate.getSeconds() ).substr( -2 ) );

							},

							json_encode( object ) {
								return JSON.stringify( object );
							},

							refreshLogImage( event ) {

								var src = event.target.src;

								event.target.src = "";

								setTimeout( function() {
									event.target.src = src;
								}, 1000 );

							},

							filter_date_short: function( miliseconds ) {

								var dayNames = [ "Pa", "Pzt", "Sa", "Ça", "Pe", "Cu", "Cts" ];

								var newDate = new Date( miliseconds );

								return ( "0" + newDate.getHours() ).substr( -2 ) + "." + ( "0" + newDate.getMinutes() ).substr( -2 );

							},

						},

						filters: {

							filter_date_short: function( miliseconds ) {

								var dayNames = [ "Pa", "Pzt", "Sa", "Ça", "Pe", "Cu", "Cts" ];

								var newDate = new Date( miliseconds );

								return ( "0" + newDate.getHours() ).substr( -2 ) + "." + ( "0" + newDate.getMinutes() ).substr( -2 );

							},

							duration: function( seconds ) {

								var min, hou, sec, days;

								if( seconds <= 59 ) {
									return seconds + " sn";
								}

								if( seconds >= 60 && seconds <= 3599 ) {
									min = Math.floor( seconds / 60 );
									sec = seconds - ( min * 60 );
									return min + " dk" + ( sec > 0 ? " " + sec + " sn" : "" );
								}

								if( seconds >= 3600 && seconds <= 86399 ) {
									hou = Math.floor( seconds / 3600 );
									min = Math.floor( ( seconds - ( hou * 3600 ) ) / 60 );
									return hou + " sa" + ( min > 0 ? " " + min + " dk" : "" );
								}

								if( seconds >= 86400 ) {
									days = Math.floor( seconds / 86400 );
									hou = Math.floor( ( seconds - ( days * 86400 ) ) / 60 / 60 );
									return days + " gün" + ( hou > 0 ? " " + hou + " sa" : "" );
								}

							},

							duration1000: function( miliseconds ) {

								var seconds = Math.round( miliseconds / 1000 );

								var min, hou, sec, days;

								if( seconds <= 59 ) {
									return seconds + " sn";
								}

								if( seconds >= 60 && seconds <= 3599 ) {
									min = Math.floor( seconds / 60 );
									sec = seconds - ( min * 60 );
									return min + " dk" + ( sec > 0 ? " " + sec + " sn" : "" );
								}

								if( seconds >= 3600 && seconds <= 86399 ) {
									hou = Math.floor( seconds / 3600 );
									min = Math.floor( ( seconds - ( hou * 3600 ) ) / 60 );
									return hou + " sa" + ( min > 0 ? " " + min + " dk" : "" );
								}

								if( seconds >= 86400 ) {
									days = Math.floor( seconds / 86400 );
									hou = Math.floor( ( seconds - ( days * 86400 ) ) / 60 / 60 );
									return days + " gün" + ( hou > 0 ? " " + hou + " sa" : "" );
								}

							},

							status_beautifier: function( status ) {

								var split = [];

								if( (/Son görülme/).test( status ) ) {
									split = status.split( "Son görülme " );
									status = split[1];
								}

								else if( (/son görülme/).test( status ) ) {
									split = status.split( "son görülme " );
									status = split[1];
								}

								return status;

							},

							decodeURIComponent: function( string ) {
								return decodeURIComponent( string );
							}

						},

						watch: {

							logLimit: function() {

								if( this.isLogLimited && this.logs.length > this.logLimit ) {

									for( var i = this.logs.length - 1; i >= this.logLimit; i-- ) {
										this.logs.splice( i, 1 );
									}

								}

							},

							isLogLimited: function() {

								if( this.isLogLimited && this.logs.length > this.logLimit ) {

									for( var i = this.logs.length - 1; i >= this.logLimit; i-- ) {
										this.logs.splice( i, 1 );
									}

								}

							},

							logs: function() {

								if( this.isLogLimited && this.logs.length > this.logLimit ) {

									for( var i = this.logs.length - 1; i >= this.logLimit; i-- ) {
										this.logs.splice( i, 1 );
									}

								}


							}

						}

					});

				}

				else {
					checkPaneSide = true
				}

			}

		}, 500 );

	}

})();