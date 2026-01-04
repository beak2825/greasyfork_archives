// ==UserScript==
// @name			SINGULARITY'S Waypoint plotter
// @description		Break waypoints up and optimise fuel
// @author			Singularity
// @include			http://*.planets.nu/*
// @include			http://planets.nu/*
// @version			0.5
//
// @history         0.1 Prototype. warp 9 and grav 9.
//                  Dangers: planets, planetoids
//
// @history         0.2 Cleaner code. warp 1..9 and gravatonic 1..9. Chunnels not stopped.
//                  Dangers: added predictable stopping points, wormholes
//
// @history         0.3  Fuel calc added: Basic movement
//
// @history         0.4 Added jinking to improve fuel use and make cloaked interception harder.
//
// @namespace https://greasyfork.org/users/15085
// @downloadURL https://update.greasyfork.org/scripts/33339/SINGULARITY%27S%20Waypoint%20plotter.user.js
// @updateURL https://update.greasyfork.org/scripts/33339/SINGULARITY%27S%20Waypoint%20plotter.meta.js
// ==/UserScript==


//TO-DO:
//(MED) Find cheapest route for hyperjumpers
//(MED) Extend plotter to future moves too
//(MED) Cobols maximise movement

//(LOW) "Turns to target" could use better math (safe vs exact vs inexact?)
//(LOW) Use inexact movement if needed
//(LOW) Use Parallel.js / Hamster.js to speed code up?


function wrapper () { // wrapper for injection

	//globals
	var version= 0.4;
	var moveData= {
		normal: [0, 1.415, 4.473, 9.487, 16.493, 25.613, 36.497, 49.579, 64.537, 81.609],   //normal maxExact dist for 0..9
		grav: [0, 2.237, 8.603, 18.602, 32.650, 50.607, 72.623, 98.601, 128.694, 162.660], 	//grav maxExact dist for warp 0..9
	};


	if (vgap.version < 3) {
		console.log("Waypoint plotter needs Nu version 3 or above.");
		return;
	} else
		console.log("Waypoint Plotter : v"+version);


	//plugin
	var plugin = {

		draw: function() {
			if (vgap.shipScreenOpen && !$("#PlotButton").length) {
				var html = '<input name="PlotButton" id="PlotButton" type="button" class="SepButton" value="Plot">';
				$('#Movement').append(html);
				$('#PlotButton').click( function(event) { plot(); } );
			}//if
		}, //draw
	};//plugin


	//Register the ` hotkey
	var old_hotkey = vgaPlanets.prototype.hotkey;
	vgaPlanets.prototype.hotkey = function (ev) {

		if (vgap.shipScreenOpen && ev.keyCode === 192) // ` key
			plot();

		old_hotkey.apply(this, arguments);

	}; //vgaPlanets.prototype.hotkey



	//////////////////// plot functions ////////////////////////
	function plot() {

		var ship= vgap.shipScreen.ship;
		var tx= ship.targetx;
		var ty= ship.targety;
		var targetDist= Math.dist(ship.x, ship.y, tx, ty);

		var hullid= ship.hullid;
		var hypship= (hullid===51 || hullid===77 || hullid===87 || hullid===110);   //B200, PL21, Falcon, Sapphire
		var gravship= (hullid===44 || hullid===45 || hullid===46);   //BR4, BR5, Meteor

		var speed= vgap.getSpeed(ship.warp, hullid);
		var maxSafe= speed+0.5;
		var maxExact= gravship ? moveData.grav[ship.warp] : moveData.normal[ship.warp];


		//eliminate simple solutions
		if (targetDist<=maxSafe  || speed===0)               //single safe move (including warp 0 ships)
			return;

		if (targetDist <= maxExact) {                        //single exact move
			var end= getNext(ship.x, ship.y, tx, ty, speed); //Not all moves between maxSafe and maxExact are valid
			if (end.x===tx && end.y===ty)                    //so check carefully if we can actually reach it in 1 move
				return;
		}//if

		if (hypship && targetDist>=340 && targetDist<=360)   //single hyperjump
			return;

		if (ship.mission===7 && ship.mission1target)         //we cant optimise intercepts
			return;



		//make a list of dangerous locations to avoid along the route. do this once only.
		var dangers= getDangerList(ship);


		//search for routes that avoid the dangers
		var bestRoute= null;
		var tests= 150; //we try a minimum of 150 times
		var maxTests= 5000; //and a maximum of 5000 times (acts as a safety time out)
		
		while (tests-- && maxTests--) {

			var route= getNewRoute(ship, dangers);     //make a new route

			if (route.valid && (isNull(bestRoute) || route.fuelUsed<bestRoute.fuelUsed)) {  //this is a new best
				bestRoute= route;
				tests= 150; //do another 150 tests
			}//if
		}//while
		

		//test code xxx
//		var route= getNewRoute(ship, dangers);     //make a new route
//		bestRoute= route;
//		console.log(bestRoute);


		//update ship with the best route
		if (!isNull(bestRoute)) {

			bestRoute.legs= bestRoute.legs.concat(ship.waypoints); //add the old ship.waypoints

			var target= bestRoute.legs.shift();          //get the first xy and set as target
			ship.targetx= target.x;
			ship.targety= target.y;
			ship.waypoints= bestRoute.legs;              //the rest are waypoints

			vgap.playSound("fastwoosh");
			vgap.loadWaypoints();
			vgap.shipScreen.screen.refresh();
			vgap.map.draw();

		} else {

			//failed
			vgap.playSound("lowchordbutton");
			console.log("Waypoint plotter route failed");
		}//if else

	}//plot



	function getNewRoute(ship, dangers) {

		var route= {
			valid: false,
			legs: [],
			fuelUsed: null,
		};

		var hullid= ship.hullid;
		var gravship= (hullid===44 || hullid===45 || hullid===46);   //BR4, BR5, Meteor
		var cobol = (hullid===96);

		var tx= ship.targetx;
		var ty= ship.targety;

		var speed= vgap.getSpeed(ship.warp, ship.hullid);
		var maxSafe= speed+0.5;
		var maxExact= gravship ? moveData.grav[ship.warp] : moveData.normal[ship.warp];
		var targetDist= Math.dist(ship.x, ship.y, tx, ty);
		var turns= Math.ceil(targetDist/maxSafe);   //turns to reach target location using safe moves


		//pick random numbers for each leg's length
		//(this is used to divide out the spare movement)
		var randoms= [];
		var randTotal= 0;

		for (var randLoop=0; randLoop<turns; randLoop+=1) {
			var rand= Math.random();
			randoms[randLoop]=rand;
			randTotal+= rand;
		}//for



		//calculate each x,y
		//(by normalising and sharing out the spare distance)
		var distMoved= 0;
		var spare= turns*maxSafe - targetDist; //spare distance available
		var dx= ship.targetx-ship.x;
		var dy= ship.targety-ship.y;

		var maxJink= (ship.warp>2 ? ship.warp-2 : 0); //small jink to the side to improve fuel use and randomise route

		if (cobol)                         //quick cobol code. not very good
			maxJink = speed*0.85;


		for (var moveLoop=0; moveLoop<turns-1; moveLoop+=1) {

			//calculate distance and percent moved
			distMoved += maxSafe - spare * (randoms[moveLoop] / randTotal);
			var percentMoved= distMoved/targetDist;

			var jink= Math.round(Math.random()*maxJink*2) - maxJink; // +-0..maxJink
			var jinkx= (dx>dy ? 0 : jink); //small +- in the y direction
			var jinky= (dx>dy ? jink : 0); //small +- in the x direction

			route.legs[moveLoop] = {
				x: Math.round(ship.x + dx*percentMoved) + jinkx,
				y: Math.round(ship.y + dy*percentMoved) + jinky,
			};

		}//for

		//add the end move
		route.legs.push( {
			x: ship.targetx,
			y: ship.targety,
		} );


		//double check that all moves are valid
		//include warpwell pull?
		route.valid= true;
		var shipx= ship.x;
		var shipy= ship.y;

		for (var validloop=0, validEnd=route.legs.length; validloop<validEnd; validloop+=1) {
			var next= route.legs[validloop];

			var end= getNext(shipx, shipy, next.x, next.y, speed);
			if (end.x!==next.x || end.y!==next.y) {
				route.valid= false;
				//console.log("move is too large to be valid x:"+end.x+" y:"+end.y);
				return route;
			}//if

			shipx= end.x;
			shipy= end.y;
		}//for


		//check for dangers
		for (var legloop=0, legEnd=route.legs.length; legloop<legEnd; legloop+=1) {
			var leg= route.legs[legloop];

			for (var dangerloop=0; dangerloop<dangers.length; dangerloop+=1) {
				var danger= dangers[dangerloop];

				var dist= Math.dist(leg.x, leg.y, danger.x, danger.y);
				if (dist<=danger.radius) {
					route.valid= false;
					//console.log("route hits a predictable point at x:"+danger.x+" y:"+danger.y);
					return route;
				}
			}//dangerloop
		}//legloop


		//create a simulation ship object with this route programmed
		var simShip= cleanCopy(ship);
		var legs= route.legs.slice(0);     //copy array

		var target= legs.shift();          //get the first xy and set as target
		simShip.targetx= target.x;
		simShip.targety= target.y;
		simShip.waypoints= legs;           //the rest are waypoints


		//calculate fuel consumption for this simulated ship journey
		route.fuelUsed= vgap.plugins.fuelUse.getFuelUsed(simShip).fuel;

		return route;
	}//getNewRoute



	function getDangerList(ship) {

		var danger1= getPlanetDangers(ship);
		var danger2= getWaypointDangers(ship);
		var danger3= getWormholeDangers(ship);

		var dangers= danger1.concat(danger2,danger3);
		return dangers;

	}//getDangerList



	function getPlanetDangers(ship) {
		//these are planets or planetoids along the route that we are intentionally not stopping at
		//this avoids a predictable stopping point

		var danger= [];
		var tx= ship.targetx;
		var ty= ship.targety;

		var x1= tx<ship.x ? tx-3 : ship.x-3;
		var x2= tx>ship.x ? tx+3 : ship.x+3;
		var y1= ty<ship.y ? ty-3 : ship.y-3;
		var y2= ty>ship.y ? ty+3 : ship.y+3;

		//find planet at destination (if any)

		var p, planet, pend= vgap.planets.length;
		var destPlanet= null;

		for (p=0; p<pend; p+=1) {
			planet= vgap.planets[p];

			var dist= Math.dist(tx, ty, planet.x, planet.y);

			if ((!planet.debrisdisk && dist<=3) || (planet.debrisdisk && dist===0)) {
				destPlanet= planet;
				break;
			}//if
		}//for


		//scan all planets for potential dangers
		for (p=0; p<pend; p+=1) {
			planet= vgap.planets[p];

			if (planet.x>=x1 && planet.x<=x2 && planet.y>=y1 && planet.y<=y2 &&
				!(planet.x === ship.x && planet.y===ship.y) && (planet != destPlanet)) {

				danger.push({
					x: planet.x,
					y: planet.y,
					type: !planet.debrisdisk ? 1 : 2, //type: 1=planet, 2= planetoid, 3= predictable move
					radius: !planet.debrisdisk ? 3 : 0, //warpwell size
				});
			}
		}//for

		return danger;
	}//getPlanetDangers



	function getWaypointDangers(ship) {
		//these are the locations that a ship would normally stop at along the route
		//if we were not breaking up the waypoints. This avoids a predictable stopping point

		var danger= [];
		var speed = vgap.getSpeed(ship.warp, ship.hullid);
		var sx= ship.x;
		var sy= ship.y;
		var tx= ship.targetx;
		var ty= ship.targety;

		var dist= Math.dist(sx, sy, tx, ty);

		while (dist > speed+0.5) {
			var next= getNext(sx, sy, tx, ty, speed);
			danger.push({
				x: next.x,
				y: next.y,
				type: 3, //type: 1=planet, 2= planetoid, 3= predictable move
				radius: 0, //warpwell size
			});

			sx= next.x;
			sy= next.y;
			dist= Math.dist(sx, sy, tx, ty);
		}//while

		return danger;
	}//getWaypointDangers



	function getWormholeDangers(ship) {

		var danger= [];
		if (!defined(vgap.wormholes))
			return danger;


		var tx= ship.targetx;
		var ty= ship.targety;
		var x1= (tx<ship.x ? tx : ship.x);
		var x2= (tx>ship.x ? tx : ship.x);
		var y1= (ty<ship.y ? ty : ship.y);
		var y2= (ty>ship.y ? ty : ship.y);


		//scan all wormholes for potential dangers
		for (var w=0; w<vgap.wormholes.length; w+=1) {
			var wormhole= vgap.wormholes[w];

			if (wormhole.x>x1 && wormhole.x<x2 && wormhole.y>y1 && wormhole.y<y2) {   //find wormholes along the route

				danger.push({
					x: wormhole.x,
					y: wormhole.y,
					type: 4, //4=wormhole
					radius: 0,
				});

			}//if
		}//for

		return danger;
	}//getWormholeDangers



	function getNext(x1, y1, x2, y2, speed) {
		//x1,y1 is ship.x,ship.y
		//x2,y2 is targetx,targety

		var movedx, movedy;
		var dx= x2-x1;
		var dy= y2-y1;

		var dist= Math.dist(x1,y1,x2,y2);
		if (dist <= speed+0.5)
			return {x:x2, y:y2};

		if (Math.abs(dx)>Math.abs(dy)) {
			//dx is major. dy is minor
			movedx= Math.floor((speed * dx) / Math.sqrt(dx*dx + dy*dy) + 0.5);
			movedy= Math.floor( movedx * (dy / dx) + 0.5);

		} else {
			//dy is major. dx is minor
			movedy= Math.floor((speed * dy) / Math.sqrt(dy*dy + dx*dx) + 0.5);
			movedx= Math.floor( movedy * (dx / dy) + 0.5);
		}//if

		var nx= x1+movedx;
		var ny= y1+movedy;

		return {x:nx, y:ny};
	}//getNext



	/////////////////////// small functions ///////////////////\


	function con(variable) {
		console.log(variable);
	}//con


	function isNull(variable) {
		return (variable === null && typeof variable === "object");
	}//isNull


	function notNull(variable) {
		return !(variable === null && typeof variable === "object");
	}//notNull


	function defined(variable) {
		return (typeof variable !== 'undefined');
	}//defined


	function isUndefined(variable) {
		return (typeof variable === 'undefined');
	}//isUndefined


	
	function cleanCopy(obj) {

		var seen= [];

		var json= JSON.stringify(obj, function(key, val) {
			if (typeof val == "object") {
				if (seen.indexOf(val) >= 0)
					return;

				seen.push(val);
			}//if

			return val;
		});

		return JSON.parse(json);
	}//cleanCopy


	//register with Nu
	vgap.registerPlugin(plugin, "Waypoint Plotter");

} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
