// ==UserScript==
// @name       Planets.nu Automatic Gravity Well Movement
// @version    0.17
// @description Enables auto usage of gravity wells and auto warp
// @include    http://planets.nu/*
// @history   0.5   Added shift-w to toggle on/off
// @history	  0.6   If you select the planet you are over, don't plot a course into the gravwell
// @history	  0.7   If you select a target distance within 1ly (really under 2ly - aka next to you), set warp speed to 1 so you can fly around in gravity wells.
// @histopy   0.8	Fixed warpwell bug from Planets.nu. Ships with WP's in warpwells keep their WP on the next turn, in the warpwell. This results in a perpetual move cycle on ships not manual reset each turn. This also allows multiple-step warpwell plotting.
// @history   0.9   Corrected distance function to use Math.dist instead of half assing it (You could have used sqrt(a^2+b^2) atleast!)
// @history   0.10  Added on/off toggle and display under menu.
// @history   0.11  Fixed display bug - ship window now shows "warp well" instead of planet
// @history   0.12  Clear waypoints only on if: first turn load; wp is in a warpwell; ship is over a planet; and not going warp1
// @history   0.13  Found bug in clearing function, as the turn status doesn't get set when you load the turn, so using the turn history viwer would cause the clearing function to re-run. 
//					This highlighted a bug! :) Fixed clearing with wp is in a warpwell -> wp is in a warpwell of the planet youi are over.
// @history   0.14  Added check for HYP ships... don't warpwell them, or they will not land on planet!
// @history   0.15  Cleared WP's are saved immediatly.
// @history   0.16  Do not attmept to use warpwells on debris disks.

// @history   0.17  @Singularity - updated shipSelectorClick code for pods, locked intercept & sphere.
//                  Fixed "second leg" bug.
//                  Departure uses planet's xy (if any), not the previous waypoint's xy.
//                  Ships returning to their point of departure (with shift-click) now use auto warpwell on return.
//                  Fixed bug stopping auto warpwell use if the destination planet is exactly North/south/east/west of your location.
//                  Removed auto warpspeed change code.
//                  Better hyperjump ship detection (not just when fcode is HYP)
//                  Added a vgap.map.draw() to refresh movement indicators.
//                  Various speed optimisations. Minor bug fixes/typos. Removed old debug code. Better commenting.



// @namespace https://greasyfork.org/users/15085
// @downloadURL https://update.greasyfork.org/scripts/33340/Planetsnu%20Automatic%20Gravity%20Well%20Movement.user.js
// @updateURL https://update.greasyfork.org/scripts/33340/Planetsnu%20Automatic%20Gravity%20Well%20Movement.meta.js
// ==/UserScript==

function wrapper () {
	var ver = 0.17;
	console.log("autoGravetyWell plugin v" + ver);

	vgap.autoGravetyWell = {};
	vgap.autoGravetyWell.shipSelectorClickOn = true;
	vgap.autoGravetyWell.shipSelectorClickInit = false;

	var AGWdelta = [[-3,0],[3,0],[0,-3],[0,3],[-2,-2],[2,2],[-2,2],[2,-2]];


	vgapMap.prototype.shipSelectorClick = function (shift) {

		//console.log("shipSelectorClick: " + shift);
		var minDist = {dist:999999, x:null, y:null};

		vgap.playSound("select");
		var ship = this.activeShip;

		//do nothing for pods
		if (ship.hullid >= 200 && ship.hullid < 300)
			return;

		// pop up warning if ship on intercept and trying to change waypoint
		if ((ship.mission === 7 || ship.mission === 20) && vgap.getShip(ship.mission1target) !== null) {
			var warning = $("<div>Your waypoint is locked because this ship is on an intercept mission.<div>");
			$("<div class=esimplewinbtn>Reset Mission</div>").tclick(function () {
				vgap.getShip(ship.id).mission = 0;
				vgap.map.selectShip(ship.id);
				nu.closekeyedmodal("Waypoint Locked");
			}).appendTo(warning);
			$("<div class=esimplewinbtn>OK</div>").tclick(function () { nu.closekeyedmodal("Waypoint Locked"); }).appendTo(warning);
			nu.keyedmodal("Waypoint Locked", warning, "Waypoint Locked", 300, vgap.map.container);
			return;
		}//if

		//clear hyp rings
		this.hypcircles = [];

		var tx = this.x;
		var ty = this.y;
		ship.target = null;

		if (this.over) {
			tx = this.over.x;
			ty = this.over.y;
			ship.target = this.over;
		}
		else {
			//snap to waypoint if near one
			for (var i = 0, ships=vgap.ships.length ; i < ships; i+=1) {
				var other = vgap.ships[i];
				var otherDest = vgap.getDest(other);
				if (other.id != ship.id && Math.dist(this.x, this.y, otherDest.x, otherDest.y) < (10 / this.zoom)) {
					tx = otherDest.x;
					ty = otherDest.y;
					break;
				}//if
			}//for
		}//else


		// Auto warpwell!
		var clickingOnStart= (ship.x === tx && ship.y === ty);
		var dist= Math.dist(ship.x, ship.y, tx, ty);
		var hypship= (ship.hullid===51 || ship.hullid===77 || ship.hullid===87 || ship.hullid===110);
		var hypjumping= hypship && dist>=340 && dist <= 360;
		var lastX, lastY;

		if (vgap.autoGravetyWell.shipSelectorClickOn && (!clickingOnStart || shift) && !hypjumping) {

			//find location we are departing from
			if (!shift) {
				//console.log("first leg");
				lastX = ship.x;
				lastY = ship.y;
			} else {

				if (ship.waypoints.length === 0) {
					//console.log("second leg");
					lastX= ship.targetx;
					lastY= ship.targety;
				} else {
					//console.log("nth leg");
					lastX = ship.waypoints[ship.waypoints.length - 1].x;
					lastY = ship.waypoints[ship.waypoints.length - 1].y;
				}//if

			}//if

			//console.log("Leaving location ",lastX,lastY);


			//find planet of departure (if any)
			if (ship.x!==lastX || ship.y!==lastY) { //only for second/nth leg

				for (var p1= 0, pend1= vgap.planets.length; p1< pend1; p1+=1) {
					var planet1= vgap.planets[p1];

					if (planet1.debrisdisk===0) {
						if (Math.dist(lastX, lastY, planet1.x, planet1.y)<3.00001) {

							//console.log("Departing "+planet1.name);
							lastX= planet1.x;
							lastY= planet1.y;
							break;

						}//if
					}//if
				}//for
			}//if


			//find destination planet (if any)
			for (var p2 = 0, pend2= vgap.planets.length; p2 < pend2; p2+=1) {
				var planet2= vgap.planets[p2];
				if (planet2.x === tx && planet2.y === ty) {
					//console.log("Going to "+planet2.name);

					// Don't snap on debris disks
					if (planet2.debrisdisk > 0)   break;

					//find closest point in destination warpwell
					for(var dloop = 0, dend= AGWdelta.length; dloop < dend ; dloop+=1) {
						var checkX = this.over.x + AGWdelta[dloop][0];
						var checkY = this.over.y + AGWdelta[dloop][1];
						var dist2 = Math.dist(lastX, lastY, checkX, checkY);

						if(dist2 < minDist.dist) {
							minDist.dist = dist2;
							minDist.x = checkX;
							minDist.y = checkY;
						}//if
					}//for

					tx = minDist.x;
					ty = minDist.y;
					break;
				}//if
			}//for each planet
		}//if 


		//reset waypoints - targetx is the first waypoint and waypoints holds additional ones.
		if (!shift || (ship.x === ship.targetx && ship.y === ship.targety) || vgap.isHyping(ship)) {
			ship.targetx = tx;
			ship.targety = ty;
			ship.waypoints = [];

			if (vgap.settings.sphere)
				vgap.sphere();
		}
		else
			ship.waypoints.push({ x: tx, y: ty });

		vgap.loadWaypoints();
		vgap.shipScreen.screen.refresh();
		vgap.map.draw();

	};//shipSelectorClick



	// Fix a bug in Nu where if you move to a WP on your next turn that WP still exists.
	var old_processLoad = vgaPlanets.prototype.processLoad;
	vgaPlanets.prototype.processLoad = function(result) {

		old_processLoad.apply(this, arguments);
		if (!result.success) return;

//		if (vgap.player.turnstatus === 0) { 
			vgap.autoGravetyWell.clearBuggedWP();
			//vgap.player.turnstatus = 1;
//		}//if

		// Add menu button
		if (vgap.autoGravetyWell.shipSelectorClickInit === false) {
			$("<ul style='padding: 0 5px 0 5px;margin: 0;position: absolute;right: 20px;z-index: 6;color: #fff;" +
			  "border-bottom-left-radius: 5px 5px;border-bottom-right-radius: 5px 5px;border-top-left-radius: 5px 5px;border-top-right-radius: 5px 5px;" + 
			  "background-color: #333;list-style-type: none;' id='GravWellMenu'>" + 
			  "<li style='font-size: xx-small;' id='GravWell' onClick='vgap.shipSelectorClickToggle()'>AutoWells On</li></ul>").css("top", "38px").appendTo("body");
			vgap.autoGravetyWell.shipSelectorClickInit = true;
		}//if

		vgap.autoGravetyWell.shipSelectorClickOn = true;   
		$("#GravWell").text("AutoWells On");
	};//processLoad


	vgap.autoGravetyWell.shipSelectorClickToggle = function() {
		
		vgap.autoGravetyWell.shipSelectorClickOn = !vgap.autoGravetyWell.shipSelectorClickOn;

		if (vgap.autoGravetyWell.shipSelectorClickOn)
			$("#GravWell").text("AutoWells On");
		else
			$("#GravWell").text("AutoWells Off");

	};//shipSelectorClickToggle


	vgap.autoGravetyWell.clearBuggedWP = function() {
		//console.log("Turn Status: " + vgap.player.turnstatus);
		// Find "bugged" WP's

		for (var i = 0; i < vgap.myships.length; i+=1) {
			var ship = vgap.myships[i];     
			// If you're on a planet AND your next WP is in a warpwell

			var planetAt = vgap.planetAt(ship.x, ship.y);
			var planetTarget = vgap.warpWell(ship.targetx, ship.targety);
			if (planetAt && planetAt == planetTarget && ship.warp != 1) {
				if (ship.waypoints.length > 0) {
					ship.targetx = ship.waypoints[0].x;
					ship.targety = ship.waypoints[0].y;
					ship.waypoints.shift();
				} else {
					ship.targetx = ship.x;
					ship.targety = ship.y;
				}//if                   

				//console.log("        reseting " + ship.name + " -> " + ship.targetx + " x " + ship.targety);
				vgap.loadWaypoints();
				ship.changed = 1;
			}//if
		}//for
	};//clearBuggedWP


	var old_hotkey = vgaPlanets.prototype.hotkey;
	vgaPlanets.prototype.hotkey = function (ev) {
		// shift-w
//		if (ev.keyCode == 87 && ev.shiftKey) {
//			vgap.autoGravetyWell.shipSelectorClickToggle();
//			return;
//		}

		old_hotkey.apply(this, arguments);	
	};  //hotkey
}//wrapper

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
