// ==UserScript==
// @name          Planets.nu gravitonic connections
// @description   Shows paths between planets that can be reached by gravitonic  and hyperjump connections
// @author        robodoc
// @license       Creative Commons Attribution 4.0 (CC BY 4.0)
// @include       http://planets.nu/home
// @include       http://planets.nu/games/*
// @include       http://*.planets.nu/*
// @include       https://*.planets.nu/*
// @include       http://planets.nu/*
// @include       https://planets.nu/*

// @version 3.0 (2019)
// @date          2019-08-01
// @namespace https://greasyfork.org/users/5275
// @downloadURL https://update.greasyfork.org/scripts/5020/Planetsnu%20gravitonic%20connections.user.js
// @updateURL https://update.greasyfork.org/scripts/5020/Planetsnu%20gravitonic%20connections.meta.js
// ==/UserScript==

// The movement information is based on the article
// "Movement Limits Tim's Host: How far can you go?" by Stefan Reuther:
// http://www.phost.de/~stefan/movement.html

// Thanks to McNimble for suggesting improvements to version 2!
// 1. Fixed a line weight problem that caused this plugin to not play well with
//    others such as Ion Storm Predictor.
// 2. Made some cosmetic improvements to make the Grav and HYP lines
//    easier on the eyes.

// Improvements to Version 3:
// 1. This version includes connections that can be reached via "inexact"
// movement (i.e., movement where you don't end up at your waypoint)
// The inexact movement displacements are partly taken from Reuther's document
// and partly taken from new calculations using the Nu client source code.
// 2. These "inexact" connections are shown in purple.
// 3. The W9Connect tool now shows "regular" connections (i.e. the same ones
// shown by the Nu client) in gray and "hidden" connections in a different
// color.

// Features:
// 1. The GravConnect tool shows paths between planets that can be reached by
//    gravitonic connections. Paths that can be reached by non-gravitonic
//    engines via normal connections are not shown. Special "inexact"
//    connections that can only be reached by setting a waypoint that can't be
//    reached in a single turn are shown in a differnt color (purple).

// 2. The HYPConnect tool shows paths between planets that can be reached by
//    hyperjump connections.

// 3. The W9Connect tool is an improved version of the built-in connections
//    tool that shows normal connections (gray), hidden connections (orange)
//    and special "inexact" connections that can only be reached by setting a
//    waypoint that can't be reached in a single turn (purple).

// Instructions: Click the "GravConnect", "W9Connect" or "HYPConnect" items on
// the Map Tools menu to turn these features on and off.

function wrapper () { // wrapper for injection

if (vgap.version < 3) {

}
// NEW VERSION
else {
	// Change values from true to false if you do not want to show the features in your menu:
	var show_GravConnect = true;
	var show_HYPConnect = true;
	var show_W9Connect = true;

	var plugin = {

			/*
			 * processload: executed whenever a turn is loaded: either the current turn or
			 * an older turn through time machine
			 */
			processload: function() {
			},

			/*
			 * loaddashboard: executed to rebuild the dashboard content after a turn is loaded
			 */
			loaddashboard: function() {
			},

			/*
			 * showdashboard: executed when switching from starmap to dashboard
			 */
			showdashboard: function() {

			},

			/*
			 * showsummary: executed when returning to the main screen of the dashboard
			 */
			showsummary: function() {
			},

			/*
			 * loadmap: executed after the first turn has been loaded to create the map
			 * as far as I can tell not executed again when using time machine
			 */
			loadmap: function() {
				vgap.map.gravconnect = false;
				 if (show_GravConnect) vgap.map.addMapTool("GravConnect", "ShowMinerals", function () {
					if (vgap.map.gravconnect) {
						vgap.map.gravconnect = false;
						vgap.map.draw();
					} else {
						vgap.map.gravconnect = true;
						vgap.plugins["GravConnect"].renderGravConnections();
						vgap.map.draw();
					}
                		} );
				vgap.map.hypconnect = false;
				if (show_HYPConnect) vgap.map.addMapTool("HYPConnect", "ShowMinerals", function () {
					if (vgap.map.hypconnect) {
						vgap.map.hypconnect = false;
						vgap.map.draw();
					} else {
						vgap.map.hypconnect = true;
						vgap.plugins["GravConnect"].renderHypConnections();
						vgap.map.draw();
					}
                		} );
				vgap.map.w9connect = false;
				if (show_W9Connect) vgap.map.addMapTool("W9Connect", "ShowMinerals", function () {
				    //vgap.map.w9connect.toggleClass("selectedmaptool")
					if (vgap.map.w9connect) {
						vgap.map.w9connect = false;
						vgap.map.draw();
					} else {
						vgap.map.w9connect = true;
						vgap.plugins["GravConnect"].renderW9Connections();
						vgap.map.draw();
					}
                		} );

			},

			/*
			 * showmap: executed when switching from dashboard to starmap
			 */
			showmap: function() {
			},

			/*
			 * draw: executed on any click or drag on the starmap
			 */
			draw: function() {
			    if (vgap.map.gravconnect)
				vgap.plugins["GravConnect"].renderGravConnections();
			    if (vgap.map.hypconnect)
				vgap.plugins["GravConnect"].renderHypConnections();
			    if (vgap.map.w9connect)
				vgap.plugins["GravConnect"].renderW9Connections();
			},

			/*
			 * loadplanet: executed a planet is selected on dashboard or starmap
		 	 * loadstarbase: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapPlanetScreen (vgapPlanetScreen.prototype.load) the normal planet screen
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadplanet");'.
			 *
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X"
			 * can be accessed here as "vgap.planetScreen.X".
			 */
			loadplanet: function() {
			},

			/*
			 * loadstarbase: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapStarbaseScreen (vgapStarbaseScreen.prototype.load) the normal starbase screen
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadstarbase");'.
			 *
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X"
			 * can be accessed here as "vgap.starbaseScreen.X".
			 */
			loadstarbase: function() {
			},

			/*
			 * loadship: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapShipScreen (vgapShipScreen.prototype.load) the normal ship screen
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadship");'.
			 *
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X"
			 * can be accessed here as "vgap.shipScreen.X".
			 */
			loadship: function() {},

			// END PLUGIN FUNCS


		    renderGravConnections: function() {
			//console.log("Rendering connections" );
			var conn2 = []; // regular grav connections
			var conn3 = []; // inexact connections
			for (var i = 0; i < vgap.planets.length; i++) {
			    var planetA = vgap.planets[i];
			    for (var j = i + 1; j < vgap.planets.length; j++) {
				var planetB = vgap.planets[j];
				var dist = Math.dist(planetA.x, planetA.y, planetB.x, planetB.y);
				var connection = false;
				if (dist > 83.5 && dist <= 165.505) {
					if (dist <= 165.0) {
						// This should always be a valid connection
						connection = 2;
					} else {
						// This will be close, so check individual points in warp well
						connection = vgap.plugins["GravConnect"].checkGravConnection(planetA.x, planetA.y, planetB.x, planetB.y);
					}
				}
				if (connection == 2) {
						conn2.push({x1:planetA.x, x2:planetB.x, y1:planetA.y, y2:planetB.y});
						// ctx.moveTo(vgap.map.screenX(planetA.x), vgap.map.screenY(planetA.y));
						// ctx.lineTo(vgap.map.screenX(planetB.x), vgap.map.screenY(planetB.y));
				} else if (connection == 3) {
						conn3.push({x1:planetA.x, x2:planetB.x, y1:planetA.y, y2:planetB.y});
						// ctx.moveTo(vgap.map.screenX(planetA.x), vgap.map.screenY(planetA.y));
						// ctx.lineTo(vgap.map.screenX(planetB.x), vgap.map.screenY(planetB.y));
				}
			    }
			}

			var ctx = vgap.map.ctx
			ctx.beginPath();
			console.log("Number of grav connections:",conn2.length)
			ctx = vgap.map.ctx
			ctx.beginPath();
			for (var i = 0; i < conn2.length; i++) {
				ctx.moveTo(vgap.map.screenX(conn2[i].x1), vgap.map.screenY(conn2[i].y1));
				ctx.lineTo(vgap.map.screenX(conn2[i].x2), vgap.map.screenY(conn2[i].y2));
			}
			ctx.closePath();
			ctx.strokeStyle = "#ff4545";
			ctx.lineWidth = 0.5; // suggested by McNimble
			ctx.stroke();

			console.log("Number of inexact grav connections:",conn3.length)
			ctx = vgap.map.ctx
			ctx.beginPath();
			for (var i = 0; i < conn3.length; i++) {
				ctx.moveTo(vgap.map.screenX(conn3[i].x1), vgap.map.screenY(conn3[i].y1));
				ctx.lineTo(vgap.map.screenX(conn3[i].x2), vgap.map.screenY(conn3[i].y2));
			}
			ctx.closePath();
			ctx.strokeStyle = "#9932CC";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.lineWidth = 1; // suggested by McNimble
			//console.log("Rendered connections" );
		    },

		    checkGravConnection: function(Ax,Ay,Bx,By) {
			//console.log("Rendering connections" );
			// Determine if a point in the warp well is within the "maximum safe distance"
			var delx = [3.0,2.0,0,-2.0,-3.0,-2.0,0,2.0];
			var dely = [0,2.0,3.0,2.0,0,-2.0,-3.0,-2.0];
			var Bx2, By2;
			for (var i = 0; i < delx.length; i++) {
				Bx2 = Bx + delx[i];
				By2 = By + dely[i];
				var dist = Math.dist(Ax, Ay, Bx2, By2);
				if (dist <= 162.505) {
					//console.log("Safe distance at ",dist," to point in warp well");
					return 2;
				}
			}
			// Determine if a point in the warp well beyond the "maximum safe distance" can be reached exactly
			var exactx = [89,92,99,104,113,114,115,116,117,125,129,134,136];
			var exacty = [136,134,129,125,117,116,115,114,113,104,99,92,89];
			// Expanded list:

			for (var i = 0; i < delx.length; i++) {
				Bx2 = Bx + delx[i];
				By2 = By + dely[i];
				for (var j = 0; j < exactx.length; j++) {
					if (Math.abs(Bx2-Ax) == exactx[j] && Math.abs(By2-Ay) == exacty[j]) {
						//console.log("Beyond max safe distance at ",Math.dist(Ax, Ay, Bx2, By2)," to point in warp well");
						return 2;
					}
				}
			}

			// Determine if a point in the warp well beyond the "maximum safe distance" can be reached inexactly
			// Streu's numbers:
			// var inexactx = [13,34,42,49,52,55,63,65,81,86,95,98,102,103,126,127,130,132,138,141,149, 150,153,154,155,157,159,162];
			// var inexacty = [162,159,157,155,154,153,150,149,141,138,132,130,127,126,103,102,98,95, 86,81,65,63,55,52,49,42,34,13]

			// Inexact numbers, including Streu's:
			var inexactx = [13,34,42,49,52,55,63,65,81,86,95,98,102,103,126,127,130,132,138,141,149, 150,153,154,155,157,159,162,121,120,119,122,118,126,127,130,132,138,141,135,140,137,133,149,150,153,154,155,157,158,159,156,162,152,109,110,111,108,112,103,102,98,95,86,81,91,83,88,94,65,63,55,52,49,42,38,34,46,13,58];
			var inexacty = [162,159,157,155,154,153,150,149,141,138,132,130,127,126,103,102,98,95, 86,81,65,63,55,52,49,42,34,13,109,110,111,108,112,103,102,98,95,86,81,91, 83,88,94,65,63,55,52,49,42,38,34,46,13,58,121,120,119,122,118,126,127,130, 132,138,141,135,140,137,133,149,150,153,154,155,157,158,159,156,162,152];
			for (var i = 0; i < delx.length; i++) {
				Bx2 = Bx + delx[i];
				By2 = By + dely[i];
				for (var j = 0; j < inexactx.length; j++) {
					if (Math.abs(Bx2-Ax) == inexactx[j] && Math.abs(By2-Ay) == inexacty[j]) {
						//console.log("Beyond max safe distance at ",Math.dist(Ax, Ay, Bx2, By2)," to point in warp well");
						return 3; // Connection can be reached by "inexact" movement
					}
				}
			}

			//console.log("Connection not made for a distance of ",Math.dist(Ax, Ay, Bx, By));
			return 0;
			//console.log("Rendered connections" );
		    },

		    renderHypConnections: function() {
			// console.log("Rendering connections" );
			var ctx = vgap.map.ctx
			ctx.beginPath();
			for (var i = 0; i < vgap.planets.length; i++) {
			    var planetA = vgap.planets[i];
			    for (var j = i + 1; j < vgap.planets.length; j++) {
				var planetB = vgap.planets[j];
				var dist = Math.dist(planetA.x, planetA.y, planetB.x, planetB.y);
				var connection = false;
				if (dist >= 337 && dist <= 363) {
					if (dist >= 340 && dist <= 360) {
						// This should always be a valid connection
						connection = true;
					} else {
						// This will be close, so check individual points in warp well
						connection = vgap.plugins["GravConnect"].checkHypConnection(planetA.x, planetA.y, planetB.x, planetB.y);
					}
				}
				if (connection) {
				    ctx.moveTo(vgap.map.screenX(planetA.x), vgap.map.screenY(planetA.y));
				    ctx.lineTo(vgap.map.screenX(planetB.x), vgap.map.screenY(planetB.y));
				}
			    }
			}
			ctx.closePath();
			ctx.strokeStyle = "#8FBC8F";
			ctx.lineWidth = 0.5; // finer line weight suggested by McNimble
			ctx.stroke();
			ctx.lineWidth = 1; // suggested by McNimble
			//console.log("Rendered connections" );
		    },

		    checkHypConnection: function(Ax,Ay,Bx,By) {
			// console.log("Rendering Hyp connections" );
			// Determine if a point in the warp well can be jumped to to reach the planet
			var Bx2, By2;
			for (var i = -2; i < 2; i++) {
				for (var j = -2; j < 2; j++) {
					if (Math.abs(i) !=2)
						if (Math.abs(j) !=2) continue; // skip inner pixels
					Bx2 = Bx + i;
					By2 = By + j;
					var dist = Math.dist(Ax, Ay, Bx2, By2);
					if (dist >= 340 && dist <= 360) {
						//console.log("Hyp Connection made for a distance of ",Math.dist(Ax, Ay, Bx, By));
						return true;
					}
				}
			}
			//console.log("Hyp Connection not made for a distance of ",Math.dist(Ax, Ay, Bx, By));
			return false;
			//console.log("Rendered Hyp connections" );
		    },

		    renderW9Connections: function() {
			// console.log("Rendering connections" );
			var conn1 = []; // "normal" connections
			var conn2 = []; // hidden connections
			var conn3 = []; // inexact connections

			for (var i = 0; i < vgap.planets.length; i++) {
			    var planetA = vgap.planets[i];
			    for (var j = i + 1; j < vgap.planets.length; j++) {
				var planetB = vgap.planets[j];
				var dist = Math.dist(planetA.x, planetA.y, planetB.x, planetB.y);
				var connection = 0;
				if (dist <= 84.57) {
					if (dist <= 83.5) {
						// This should always be a valid connection
						// This is the connection reported by the Nu client
						connection = 1; // Basic "Nu client" connection
					} else {
						// This will be close, so check individual points in warp well
						connection = vgap.plugins["GravConnect"].checkW9Connection(planetA.x, planetA.y, planetB.x, planetB.y);
					}
				}
				if (connection == 1) {
						// console.log("Saving",planetA.x,planetA.y,planetB.x,planetB.y);
						conn1.push({x1:planetA.x, x2:planetB.x, y1:planetA.y, y2:planetB.y});
						// ctx.moveTo(vgap.map.screenX(planetA.x), vgap.map.screenY(planetA.y));
				    // ctx.lineTo(vgap.map.screenX(planetB.x), vgap.map.screenY(planetB.y));
				} else if (connection == 2) {
				    conn2.push({x1:planetA.x, x2:planetB.x, y1:planetA.y, y2:planetB.y});
						// ctx.moveTo(vgap.map.screenX(planetA.x), vgap.map.screenY(planetA.y));
				    // ctx.lineTo(vgap.map.screenX(planetB.x), vgap.map.screenY(planetB.y));
				} else if (connection == 3) {
				    conn3.push({x1:planetA.x, x2:planetB.x, y1:planetA.y, y2:planetB.y});
						// ctx.moveTo(vgap.map.screenX(planetA.x), vgap.map.screenY(planetA.y));
				    // ctx.lineTo(vgap.map.screenX(planetB.x), vgap.map.screenY(planetB.y));
				}
			    }
			}

			// Draw connections
			var ctx = vgap.map.ctx
			ctx.beginPath();
			for (var i = 0; i < conn1.length; i++) {
				// console.log("Drawing line",i,conn1[i].x1,conn1[i].y1,conn1[i].x2,conn1[i].y2)
				ctx.moveTo(vgap.map.screenX(conn1[i].x1), vgap.map.screenY(conn1[i].y1));
				ctx.lineTo(vgap.map.screenX(conn1[i].x2), vgap.map.screenY(conn1[i].y2));
			}
			// console.log("conn1.length",conn1.length);
			// console.log(conn1[1].x1,conn1[1].x2,conn1[1].y1,conn1[1].y2);
			ctx.closePath();
			ctx.strokeStyle = "#666666";
			ctx.lineWidth = 1; // suggested by McNimble
			ctx.stroke();

			console.log("Number of hidden connections:",conn2.length)
			ctx = vgap.map.ctx
			ctx.beginPath();
			for (var i = 0; i < conn2.length; i++) {
				ctx.moveTo(vgap.map.screenX(conn2[i].x1), vgap.map.screenY(conn2[i].y1));
				ctx.lineTo(vgap.map.screenX(conn2[i].x2), vgap.map.screenY(conn2[i].y2));
			}
			ctx.closePath();
			ctx.strokeStyle = "#FA8072";
			ctx.lineWidth = 1; // suggested by McNimble
			ctx.stroke();

			console.log("Number of inexact connections:",conn3.length)
			ctx = vgap.map.ctx
			ctx.beginPath();
			for (var i = 0; i < conn3.length; i++) {
				ctx.moveTo(vgap.map.screenX(conn3[i].x1), vgap.map.screenY(conn3[i].y1));
				ctx.lineTo(vgap.map.screenX(conn3[i].x2), vgap.map.screenY(conn3[i].y2));
			}
			ctx.closePath();
			ctx.strokeStyle = "#9932CC";
			ctx.lineWidth = 1.5;
			ctx.stroke();

			ctx.lineWidth = 1; // suggested by McNimble
		    },

		    checkW9Connection: function(Ax,Ay,Bx,By) {
			//console.log("Rendering connections" );
			// Determine if a point in the warp well is within the "maximum safe distance"
			var delx = [3.0,2.0,0,-2.0,-3.0,-2.0,0,2.0];
			var dely = [0,2.0,3.0,2.0,0,-2.0,-3.0,-2.0];
			var Bx2, By2;
			for (var i = 0; i < delx.length; i++) {
				Bx2 = Bx + delx[i];
				By2 = By + dely[i];
				var dist = Math.dist(Ax, Ay, Bx2, By2);
				if (dist <= 81.57) {
					//console.log("Safe distance at ",dist," to point in warp well");
					return 2; // Connection can be reached by "safe" movement
				}
			}
			// Determine if a point in the warp well beyond the "maximum safe distance" can be reached exactly
			var exactx = [48,66];
			var exacty = [66,48];
			for (var i = 0; i < delx.length; i++) {
				Bx2 = Bx + delx[i];
				By2 = By + dely[i];
				for (var j = 0; j < exactx.length; j++) {
					if (Math.abs(Bx2-Ax) == exactx[j] && Math.abs(By2-Ay) == exacty[j]) {
						//console.log("Beyond max safe distance at ",Math.dist(Ax, Ay, Bx2, By2)," to point in warp well");
						return 2; // Connection can be reached by "exact" movement
					}
				}
			}

			// Determine if a point in the warp well beyond the "maximum safe distance" can be reached inexactly
			// Streu's values:
			// var inexactx = [16, 24,	27,	43,	53,	54,	66,	67,	72,	78,	79,	82];
			// var inexacty = [82, 79,	78,	72,	67,	66,	54,	53,	43,	27,	24,	16];
			// Expanded values:
			// 63 52 81.68843247363729
			// 64 51 81.83520025025906
			// 70 42 81.6333265278342
			// 67 47 81.8413098624405
			// 77 27 81.59656855530139
			// 78 24 81.60882305241266
			// 80 16 81.58431221748455
			// 69 44 81.83520025025906
			// 76 30 81.70679286326198
			// 58 58 82.02438661763951
			// 59 57 82.03657720797473
			var inexactx = [16, 16,	24, 24,	27, 27,	30, 42, 43,	44, 47, 51, 52, 53,	54,	57, 58, 59, 63, 64, 66,	67, 67,	69, 70, 72,	76, 77, 78, 78,	79,	80, 82];
			var inexacty = [80, 82,	78, 79,	77, 78,	76, 70, 72,	69, 67, 64, 63, 67,	66,	59, 58, 57, 52, 51, 54,	47, 53,	44, 42, 43,	30, 27, 24, 27,	24,	16, 16];
			for (var i = 0; i < delx.length; i++) {
				Bx2 = Bx + delx[i];
				By2 = By + dely[i];
				for (var j = 0; j < inexactx.length; j++) {
					if (Math.abs(Bx2-Ax) == inexactx[j] && Math.abs(By2-Ay) == inexacty[j]) {
						//console.log("Beyond max safe distance at ",Math.dist(Ax, Ay, Bx2, By2)," to point in warp well");
						return 3; // Connection can be reached by "inexact" movement
					}
				}
			}

			//console.log("Connection not made for a distance of ",Math.dist(Ax, Ay, Bx, By));
			return 0;
			//console.log("Rendered connections" );
		    },

	};

	// register your plugin with NU
	vgap.registerPlugin(plugin, "GravConnect");

}

} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
