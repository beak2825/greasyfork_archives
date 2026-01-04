// ==UserScript==
// @name			SINGULARITY'S FuelUse
// @description		Calculates fuel use turn by turn for greater accuracy
// @author			Singularity
// @include			http://*.planets.nu/*
// @include			http://planets.nu/*
// @version			0.7.1
// @history         0.1 prototype
// @history         0.2 added beam up missions. added getILCSmovement.
// @history         0.3 fixed turn to destination bug.
// @history         0.4 fixed beamup bugs.
// @history         0.5 added fuelgained. Corrected UI "fuel used" to be consistant with nu client.
// @history         0.6 added oofAt code and indicator
// @history         0.7 added mine lay/scoop/decay/explode
// @history         0.7.1 fix to tow mass code

// @namespace https://greasyfork.org/users/15085
// @downloadURL https://update.greasyfork.org/scripts/33338/SINGULARITY%27S%20FuelUse.user.js
// @updateURL https://update.greasyfork.org/scripts/33338/SINGULARITY%27S%20FuelUse.meta.js
// ==/UserScript==

//Notes:
//   FuelUse cannot accurately calculate fuel consumed to reach somewhere beyond your fuel range (same as the Nu client).
//   ... Instead it calculates how far you can go with on board fuel, and then (under) estimates fuel needed to go the rest.
//   ... If Fuel needed > fuel, you cannot reach destination.

//Notes: FuelUse does not factor in:
//   Enemy laying/scooping/sweeping mines - which affects number of torps you can lay/scoop,
//   Mine / webmine hits (too random),
//   Robbing / being robbed,
//   Foreign ships beaming mass to your ship,
//   Failed transfer cargo or btt/btf/btm to foreign ships (when excess cargo is returned/destroyed),
//   Beam up money (bum) from foreign planets - which affects mkt,
//   EE fighter transfer,
//   Drag / damage / vortex by Ion storms (too random),
//   Chunnels / Wormholes (maybe later)

//Note: a red circle indicates where the ship is predicted to run out of fuel, but there is an unidentified +-1 light year rounding error present. It is still useful in that you can target planet warpwells, but should not be used for accurate location prediction.



//TO-DO:
//(MED) CargoDrop (ship to foreign planet) (needs fuel or fails?) - including imperial assault
//(MED) Transfer (ship to foreign starship) (needs fuel or fails?)
//(MED) Beam transfer Friendly Codes (bdm, extended bdm codes, btf, btt)
//(MED) Lay mines in another raceId - effects counter minelaying - which effects minelaying max size
//(MED) Minesweep - effects counterminelaying - which effects minelaying max size
//(MED) Ensure tow target is still present before towing it

//(MED) cache results? normally ~0.5ms
//(MED) run in a parallel process?

//(MED) Add all planet + starbase phases as stubs
//(MED) simulate ALL planets, ships and bases for more complex interactions
//... such as another ship lays/scoops mines first
//... such as another ship beams up resources first
//... such as lower ID tows ship away
//    use closure

//(MED) re-write ILCS code
//(MED) if a hyperjumper is with ILCS, and it intially does not have enough fuel but then gains fuel via beam up fuel etc, does it still jump in movement phase 2 or regular move in phase 1?

//(LOW) Add: SB Orders: Refuel, Unload Freighters, Load Torps
//(LOW) Add: Cyborg Repair Self mission
//(LOW) Add: Web drain
//(LOW) Add: Superrefit (doesn't need fuel)
//(LOW) Test how Chameleon parses fcode
//(LOW) Add: gsx
//(LOW) Add: establish tow lock only at movement, in case another ship is trying to tow too
//(LOW) maxMinefieldSize needs calculating in campaign games
//(LOW) Add: LFM full ally
//(LOW) Chunnel - self and others
//(LOW) wormhole
//(LOW) oofAt - calculate exactly where ship runs out of fuel

//(LOW) Disable normal client fuel code to save cpu. Set warning colours on my indicator.

function wrapper () { // wrapper for injection

    var $= window.$;
    var vgap= window.vgap;

    var version = "0.7.1";

	if (vgap.version < 3) {
		console.log("FuelUse needs Nu version 3 or above.");
		return;
	} else {
        console.log("FuelUse v"+version);
    }

	var twoPi = Math.PI * 2;

	//empty cache
	var cache ={
		ship: null,
		result: null,
	};


	var plugin = {

		processload : function() {},

		draw: function() {

			//run getFuelUsed and display result
			try {

				if (vgap.shipScreenOpen) {
					var ship = vgap.shipScreen.ship;
					var result= getResult(ship); //cache or new result
					if (!result)
						return;

					//display fuel used
					if (result.used)
						$('#FuelNeeded div:first').text(result.used);


					//display turns taken
					if (result.turns>0 && result.turns<100) {
						if (result.turns === 1)
							$('#ArrivalStatus div:first').text(result.turns+" turn");
						else
							$('#ArrivalStatus div:first').text(result.turns+" turns");
					}//if


					//display oof indicator
					if (result.oofAt) {

						var ctx= vgap.map.ctx;
						var screenX= vgap.map.screenX(result.oofAt.x);
						var screenY= vgap.map.screenY(result.oofAt.y);

						ctx.strokeStyle = "red";
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.arc(screenX, screenY, 5, 0, twoPi , false);
						ctx.closePath();
						ctx.stroke();

					}//if oofAt

				}//if shipScreenOpen

			}//try
			catch(err) {
				console.log('getFuelUsed error: '+err);
			}//catch

		}, //draw



		getFuelUsed: function(originalShip) {

			if (!originalShip)
				return;

			//copy all ships, planets, starbases, minefields
			//var ships= cleanCopy(vgap.ships);
			//var planets= cleanCopy(vgap.planets);
			//var starbases= cleanCopy(vgap.starbases);
			var minefields= cleanCopy(vgap.minefields);


			//copy ship and towShip so that we don't damage them in simulation
			var ship= cleanCopy(originalShip);
			var originalTowShip= (ship.mission === 6 && ship.mission1target && ship.neutronium ? vgap.getShip(ship.mission1target) : null);
			var towShip= cleanCopy(originalTowShip);


			//my custom ship properties
			ship.fuelgained= 0;
			ship.oofAt= null;
			ship.moving= (ship.x !== ship.targetx || ship.y !== ship.targety);


			//simulate movement of all my ILCS for the next few turns
			var ILCSarray= [];
			if (ship.moving)
				ILCSarray= getILCSmovement();


			//Run simulation turn by turn
			var turn= 1;
			var maxCount= 100;
			var finished= false;
			var planet, starbase;
			var vgapturn= vgap.game.turn;


			while (!finished && maxCount--) {

				//find the planet at ship's (and towShip's) location.
				//we may stop at a number of planets along the route so check every move
				planet= cleanCopy(vgap.planetAt(ship.x, ship.y));
				starbase= cleanCopy(getStarbase(planet));


				//Early checks
				var shipStartedOOF= !ship.neutronium;
				var towShipStartedOOF= towShip && !towShip.neutronium;
				var movePhase= getMovementPhase(ship, ILCSarray, turn);


				//1F Jettison
				jettison(ship);
				jettison(towShip);


				//3.  Cloak/chameleon
				cloak(ship);
				cloak(towShip);
				chameleon(ship);
				chameleon(towShip);


				// 11C. Build fighters (lfm, Mission or Rebel)
				buildFighters(ship, planet);
				buildFighters(towShip, planet);


				//11D. Cyborg Repair Self
				borgRepair(ship);
				borgRepair(towShip);


				//12. Cargo drop (to foreign planet)
				cargoDrop(ship, planet, shipStartedOOF);
				cargoDrop(towShip, planet, towShipStartedOOF);


				//13. Transfers (ship to foreign starship) (needs fuel). cant beam to cloaked ship
				//14  Beam transfer Friendly Codes (bdm, btf, btt)
				//14.1 Give starships ( GSX )


				//16. Beam up missions
				beamUp(ship, planet);
				beamUp(towShip, planet);


				//17. Alchemy
				alchemy(ship);
				alchemy(towShip);


				//20. Command Ship Groups : Normal & Tow
				if (ship.moving && movePhase === 1) {
					finished= moveShips(ship, towShip);
					planet= cleanCopy(vgap.planetAt(ship.x, ship.y));
					starbase= cleanCopy(getStarbase(planet));
				}//if


				//21. Lay mines (needs fuel)
				layMines(ship);
				layMines(towShip);


				//Mine sweep
				sweepMines(ship);
				sweepMines(towShip);


				//24. Mine scoop (needs fuel)
				scoopMines(ship);
				scoopMines(towShip);

				//25. Mines decay
				minesDecay();

				//26. Mines destroy mines
				minesDestroyMines();


				//28. Web drain


				//29. Starbase fix
				starbaseFix(ship, starbase);


				//33. Superrefit (doesn't need fuel)


				//35. Repair with supplies
				repairSupplies(ship);
				repairSupplies(towShip);


				//35.1 make torpedoes
				makeTorpedoes(ship);
				makeTorpedoes(towShip);


				//35.2 Empire Fighter Transfer (Needs fuel??)


				//37. Normal movement (inc HYP) : Normal & tow
				//38. Intercept movement
				if (ship.moving && movePhase >= 2) {
					finished= moveShips(ship, towShip);
					planet= cleanCopy(vgap.planetAt(ship.x, ship.y));
					starbase= cleanCopy(getStarbase(planet));

				}//if


				//44. SB Orders: Refuel, Unload Freighters, Load Torps


				//end of turn
				if (!ship.moving)
					finished= true;

				if (!finished)
					turn++;

				vgapturn++;
			}//while


			//Non-moving ships always 'arrive' in 0 turns
			//(although they may burn fuel from cloaking / chameleon)
			if (!ship.moving && turn === 1)
				turn= 0;


			//return results
			var used= originalShip.neutronium - ship.neutronium + ship.fuelgained;
			return {
				completed: (ship.neutronium >= 0),               //if ship had enough fuel to get to destination
				turns: turn,                                     //turns to reach destination
				used: used,                                      //fuel consumed to reach destination
				gained: ship.fuelgained,                         //fuel gained (ramscoop, alchemy, beam up fuel etc)
				oofAt: ship.oofAt,                               //x,y where ship will run out of fuel
			};


			//
			//functions using closure for access to ships, planets, starbases, minefields
			//


			function sweepMines(ship) {

				if (!ship || ship.mission !== 1 ||
					ship.beams === 0 || ship.beamid === 0 || ship.neutronium === 0)
					return;

				//incomplete code

			}//sweepMines


			function layMines(ship) {

				if (!ship || (ship.mission !==2 && ship.mission!==8) ||
					ship.torpedoid === 0 || ship.torps === 0 || ship.ammo === 0 || ship.neutronium === 0)
					return;


				//are we dropping mines or webs?
				var isWeb = (ship.mission === 8);


				//are we laying in another race's id?
				var layRaceId= vgap.player.id; //default = me
				var fcode = ship.friendlycode.toUpperCase();

				if (fcode.substring(0,2) === "MI") {
					var raceCode = fcode.substring(2);
					//incomplete code
				}//if


				//find number of torps we want to drop
				var torps = ship.ammo; //default = drop all

				if (fcode.substring(0,2) === "MD") {

					if (fcode === "MDH")
						torps = Math.floor(ship.ammo / 2);
					else
						if (fcode === "MDQ")
							torps = Math.floor(ship.ammo / 4);
					else
					{
						//try md0 .. md9 codes
						var digit = Number(fcode.substring(2));

						if (!isNaN(digit)) {

							if (digit === 0)
								torps= 100;
							else
								torps= digit * 10;

							if (torps>ship.ammo)
								torps= ship.ammo;

						}//if NaN
					}//if else
				}//if md


				//find closest candidate minefield for expanding
				var minefield= null;
				var minefield_dist= 99999;

				for (var m= 0; m < minefields.length; m++) {
					var nextmf = minefields[m];

					if (nextmf.ownerid === layRaceId && nextmf.isweb === isWeb) {
						var dist = Math.dist(ship.x, ship.y, nextmf.x, nextmf.y);

						if (dist < minefield_dist) {
							minefield= nextmf;
							minefield_dist= dist;
						}//if

						if (minefield_dist === 0)
							break;
					}//if candidate
				}//for


				//if we are not inside it, then we are making a new minefield
				if (minefield && minefield_dist > minefield.radius)
					minefield = null;


				//if we are making a new minefield, then create a new entry
				if (minefield === null) {

					//find new minefield id. new minefields are id 9000+
					var id= 0;
					for (var m2=0; m2<minefields.length; m2++) {
						var minefield2= minefields[m2];

						if (minefield2.id > id)
							id= minefield2.id;

					}//for

					if (id<9000)
						id= 9000;
					else
						id++;


					//create stub
					var newminefield= {
						color: "",
						friendlycode: "",
						id: id,
						infoturn: vgapturn,
						isweb: isWeb,
						ownerid: layRaceId,
						radius: 0,
						units: 0,
						x: ship.x,
						y: ship.y,
					};

					//add stub
					minefields.push(newminefield);
					minefield= newminefield;

				}//if minefield === null


				//what is the maximum minefield size?
				var maxMinefieldSize= 10000;

				if (layRaceId === vgap.player.id && vgap.advActive(48)) //if we are laying as us and we have lay large minefields
					maxMinefieldSize= 22500;

				if (layRaceId !== vgap.player.id) //if we are laying as other races, we assume they can lay large minefields
					maxMinefieldSize= 22500;      //this is true in all classic and standard games, and usually true in campaign


				//what is the maximum number of torps we can drop into this minefield?
				var unitsPerTorp= ship.torpedoid * ship.torpedoid;

				if (vgap.advActive(24) && layRaceId === ship.ownerid) //Robots laying as Robots
					unitsPerTorp *= 4;

				var maxtorps= Math.ceil((maxMinefieldSize - minefield.units) / unitsPerTorp);

				if (torps>maxtorps)
					torps= maxtorps;


				//drop torps! update minefield!
				if (torps>0) {
					ship.ammo -= torps;
					minefield.units += torps * unitsPerTorp;

					if (minefield.units > maxMinefieldSize)
						minefield.units= maxMinefieldSize;

					minefield.radius = Math.floor(Math.sqrt(minefield.units));
				}//if
			}//layMines



			function scoopMines(ship) {

				if (!ship || ship.mission !== 1 || ship.neutronium === 0 ||
					ship.torpedoid === 0 || ship.torps === 0)
					return;

				var fcode = ship.friendlycode.toUpperCase();
				if (fcode !== "MSC")
					return;


				//units per torp
				var unitsPerTorp= ship.torpedoid * ship.torpedoid;

				if (vgap.advActive(24)) //Robots scoop their own fields at 1/4 rate
					unitsPerTorp *= 4;


				//find all my minefields the ship is in
				var emptyCargo= vgap.getHull(ship.hullid).cargo - getTotalCargo(ship);

				for (var m=0; m<minefields.length; m++) {
					var minefield= minefields[m];

					if (minefield.ownerid === ship.ownerid) {
						var dist= Math.dist(ship.x, ship.y, minefield.x, minefield.y);
						if (dist < minefield.radius) {

							//scoop up as many torps as I have room for
							var torps= minefield.units / unitsPerTorp; //torps is a float
							if (torps>emptyCargo)
								torps= emptyCargo;                     //torps is an integer

							ship.ammo += Math.floor(torps);
							emptyCargo -= Math.floor(torps);
							minefield.units -= torps * unitsPerTorp;

							if (minefield.units < 0)
								minefield.units= 0;

							minefield.radius = Math.floor(Math.sqrt(minefield.units));

						}//if in minefield
					}//if I am owner
				}//for each minefield

			}//scoopMines


			function minesDecay() {

				if (!minefields.length)
					return;

				for (var m=0; m<minefields.length; m++) {
					var minefield= minefields[m];

					minefield.units= Math.floor(minefield.units * 0.95);
					minefield.radius= Math.floor(Math.sqrt(minefield.units));

				}//for

			}//minesDecay



			function minesDestroyMines() {

				if (!minefields.length)
					return;

				var me= vgap.player.id;

				//scan all minefields
				for (var m1=0; m1<minefields.length; m1++) {
					var mf1= minefields[m1];

					for (var m2=0; m2<minefields.length; m2++) {
						var mf2= minefields[m2];

						//one of the minefields must belong to me, but not both
						//(we cant easily process two other players without knowing their alliance status)
						//and neither can be webs
						//and the need to have mine units
						if ((mf1.ownerid === me || mf2.ownerid === me) && mf1.ownerid !== mf2.ownerid &&
							!mf1.isweb && !mf2.isweb &&
							mf1.units && mf2.units) {

							//do they touch?
							//(R0-R1)^2 <= (x0-x1)^2+(y0-y1)^2 <= (R0+R1)^2
							var radiusDiff= mf1.radius - mf2.radius;
							var radiusDiff2= radiusDiff * radiusDiff;

							var radiusSum= mf1.radius + mf2.radius;
							var radiusSum2= radiusSum * radiusSum;

							var dx= mf1.x - mf2.x;
							var dy= mf1.y - mf2.y;
							var distance2 = dx*dx + dy*dy;

							if (radiusDiff <= distance2 && distance2 <= radiusSum2) {

								//are we enemies?
								var otherPlayer= (mf1.ownerid === me ?  mf2.ownerid : mf1.ownerid);
								var relation = getArray(vgap.relations, otherPlayer, "playertoid");

								if (relation.relationto < 2 || relation.relationfrom < 2) {
									//minefields destroy each other

									var unitsLost= (mf1.units < mf2.units ? mf1.units : mf2.units);

									console.log(mf1.id+" and "+mf2.id+" lose units: "+unitsLost);

									mf1.units -= unitsLost;
									mf1.radius = Math.floor(Math.sqrt(mf1.units));

									mf2.units -= unitsLost;
									mf2.radius = Math.floor(Math.sqrt(mf2.units));

								}//if
							}//if
						}//if different owners
					}//for
				}//for

			}//minesDestroyMines


		},//getFuelUsed

	};//plugin



	function getResult(ship) {

		return vgap.plugins.fuelUse.getFuelUsed(ship);

		//have we got a cached result?
		/*
		if (objectEquals(ship, cache.ship)) {
			console.log("using cache");
			return cache.result;
		} else {

			console.log("making new result");
			cache.ship= cleanCopy(ship);
			var result= vgap.plugins.fuelUse.getFuelUsed(ship);
			cache.result= cleanCopy(result);

			return result;
		} //if else
		*/

	}//getResult



	function getStarbase(planet) {

		if (!planet || !planet.isbase)
			return null;

		return vgap.getStarbase(planet.id);
	}//getStarbase



	function getILCSmovement() {
		//returns an array of ILCS's locations for the next few turns.

		//for simplicity we assume the ILCS's fuel remains constant...
		//i.e if ILCS is fuelled, we assume it will remain fuelled for it's entire journey.
		//    if ILCS is unfuelled, we assume it remains unfuelled (to avoid being attacked etc).

		//array does not include unfuelled ILCS.

		//ILCS is only found in campaign games
		if (!vgap.settings.campaignmode)
			return [];

		var ILCSarray= [];
		var data;

		//find all ILCS
		for (var sLoop=0; sLoop<vgap.myships.length; sLoop++) {
			var originalship= vgap.myships[sLoop];

			//check for ILCS (with fuel)
			if (originalship.hullid === 1089 && originalship.neutronium) {

				//pick ILCS or ship towing ILCS - and clone it for simulation
				var tower= vgap.isTowTarget(originalship.id);
				var ship= ( !tower ? cleanCopy(originalship) : cleanCopy(tower) );

				//check if ship is moving
				if (ship.moving) {

					//turn by turn movement
					var turn= 0;
					var maxCount= 100;
					var finished= false;

					while (!finished && maxCount--) {

						//add each turn's position
						data= {
							shipid: ship.id,
							finished: false,
							turn: turn,
							x: ship.x,
							y: ship.y,
						};
						ILCSarray.push(data);

						finished= moveShips(ship, null);
						turn++;
					}//while

					//add finished position
					data= {
						shipid: ship.id,
						finished: true,
						turn: turn,
						x: ship.x,
						y: ship.y,
					};
					ILCSarray.push(data);

				} else {

					//non moving ship
					data= {
						shipid: ship.id,
						finished: true,
						turn: 0,
						x: ship.x,
						y: ship.y,
					};
					ILCSarray.push(data);
				}//else


			}//if ILCS
		}//for

		return ILCSarray;
	}//getILCSmovement



	function getMovementPhase(ship, ILCSarray, turn) {
		//returns: 1= command move, 2= normal move (inc HYP), 3= intercept move
		if (!ship)
			return;

		//if the ship isn't moving then we can skip this function
		if (!ship.moving)
			return 2;

		//hyperjumping ships always move in normal phase (even if intercepting or with command ship)
		if (isHyperjumping(ship))
			return 2;

		//intercepting ships always move in intercept phase (even if with command ship)
		if (ship.mission === 7 && ship.mission1target)
			return 3;

		//command ships move in phase 1 (unless intercepting)
		if (ship.hullid === 1089 && ship.neutronium)
			return 1;

		//check if we meet a ILCS on our route
		for (var ILCSloop= 0; ILCSloop < ILCSarray.length; ILCSloop++) {
			var entry= ILCSarray[ILCSloop];

			if (entry.x === ship.x && entry.y === ship.y) {
				if (entry.turn === turn || (entry.finished && entry.turn <= turn))
					return 1;

			}//if
		}//for each ILCS entry

		//everything else moves in the normal move/tow phase
		return 2;

	}//getMovementPhase


	function jettison(ship) {

		if (!ship || ship.transfertargettype !== 3)
			return;

		//jettison
		if (!ship.neutronium && !ship.transferneutronium) {

			//cargo is returned to cargo bay
			ship.neutronium += ship.transferneutronium;
			ship.duranium += ship.transferduranium;
			ship.tritanium += ship.transfertritanium;
			ship.molybdenum += ship.transfermolybdenum;
			ship.supplies += ship.transfersupplies;
			ship.clans += ship.transferclans;
			ship.ammo += ship.transferammo;

			//cargo is trimmed
			var cargoPercentage= vgap.getHull(ship.hullid).cargo / getTotalCargo(ship);

			if (cargoPercentage<1) {
				ship.duranium= Math.floor(ship.duranium * cargoPercentage);
				ship.tritanium= Math.floor(ship.tritanium * cargoPercentage);
				ship.molybdenum= Math.floor(ship.molybdenum * cargoPercentage);
				ship.supplies= Math.floor(ship.supplies * cargoPercentage);
				ship.clans= Math.floor(ship.clans * cargoPercentage);
				ship.ammo= Math.floor(ship.ammo * cargoPercentage);
			}//if

		}//else

		//either way the transfer beam is now empty
		ship.transfertargettype= 0;
		ship.transferneutronium= 0;
		ship.transferduranium= 0;
		ship.transfertritanium= 0;
		ship.transfermolybdenum= 0;
		ship.transfersupplies= 0;
		ship.transferclans= 0;
		ship.transferammo= 0;
	}//jettison


	function cloak(ship) {

		if (!ship)
			return;

		var canCloak= vgap.getHull(ship.hullid).cancloak;
		var cloakMissionIsOn= (ship.mission === 9 || ship.mission === 8 || ship.mission === 20); //9=Cloak, 8= Super Spy, 20= cloak & intercept

		//Basic checks: not able to cloak, not trying to cloak, no fuel or damaged
		if (!canCloak || !cloakMissionIsOn || ship.neutronium === 0 || ship.damage)
			return;


		//A starship with Advanced Cloaking does not consume fuel while cloaking (but does need fuel)
		var hullid= ship.hullid;
		var advancedCloak= (hullid === 31 || hullid === 29 || hullid === 3033 || hullid === 1047);
		if (advancedCloak && ship.neutronium)
			return;


		//Cloaking consumes 1 KT of fuel for every 20 KT of hull mass, rounded up, with a minimum fuel consumption of 5 KT.
		var hullMass= vgap.getHull(ship.hullid).mass;
		var fuelNeeded= Math.ceil(hullMass/20);
		if (fuelNeeded<5)
			fuelNeeded= 5;

		//The starship must have (more than) enough fuel to operate the cloaking device.
		if (ship.neutronium > fuelNeeded)
			ship.neutronium -= fuelNeeded;

	}//cloak



	function chameleon(ship) {

		if (!ship)
			return;

		//is this a chameleon ship?
		var hullid = ship.hullid;
		var chameleonShip= (hullid === 109 || hullid === 1049 || hullid === 1023);
		if (!chameleonShip || ship.neutronium<10)
			return;

		//check fcode matches a valid hull id
		var fcode= Number(ship.friendlycode); //Number() and Host may parse fcode slightly differently. eg " 01" === "001" ?
		var hull= vgap.getHull(fcode);

		if (!hull)
			return;

		//activate chameleon
		ship.neutronium -= 10;

	}//chameleon



	function buildFighters(ship, planet) {

		if (!ship || !planet || !ship.bays || !ship.neutronium)
			return;

		//lfm - load and build fighters
		var newFighters, fighterMaterials, fighterCapacity;
		var lfmActive= (ship.friendlycode.toUpperCase() === "LFM");

		if (lfmActive && (planet.ownerid === vgap.player.id) ) { //ally planets?

			fighterMaterials= Math.floor(Math.min(planet.supplies/5, planet.tritanium/3, planet.molybdenum/2));
			fighterCapacity= Math.floor((vgap.getHull(ship.hullid).cargo - getTotalCargo(ship))/10);

			newFighters= (fighterMaterials>fighterCapacity ? fighterCapacity : fighterMaterials);

			ship.ammo += newFighters;
			planet.supplies -= newFighters * 5;
			planet.tritanium -= newFighters * 3;
			planet.molybdenum -= newFighters * 2;
			return;
		}//if


		// rebel auto-build / "build fighter" mission
		if (ship.supplies && ship.tritanium && ship.molybdenum) {

			var ownerid= ship.ownerid;

			if (lfmActive || ownerid === 10 ||
				(ship.mission === 8 && (ownerid === 9 || ownerid === 11) )) {

				newFighters= Math.floor(Math.min(ship.supplies/5, ship.tritanium/3, ship.molybdenum/2));

				ship.ammo += newFighters;
				ship.supplies -= newFighters * 5;
				ship.tritanium -= newFighters * 3;
				ship.molybdenum -= newFighters * 2;
			}//if
		}//if

	}//buildFighters



	function borgRepair(ship) {

		if (!ship)
			return;

		if (vgap.player.raceid === 6 && ship.damage && ship.warp === 0 && ship.neutronium) {

			ship.damage -= 10;

			if (ship.damage < 0)
				ship.damage= 0;
		}//if

	}//borgRepair



	function cargoDrop(ship, planet, startedOOF) {
		//drop cargo to planet
		//needs fuel or the cargo returns to the cargo bay (possibly destroying some cargo)

		if (!ship || ship.transfertargettype !== 1)
			return;

		//include imperial assault

		//incomplete code

	}//cargoDrop



	function beamUp(ship, planet) {

		if (!ship || !planet)
			return;

		//check we are on beam up mission and we know what is on the surface
		if (ship.mission<10 || ship.mission>14 || planet.duranium === -1)
			return;

		//check we have permission to beam up
		var permission= (planet.ownerid === 0 || planet.ownerid === vgap.player.id || planet.friendlycode === ship.friendlycode);
		if (!permission)
			return;

		//ready to beam up!
		var qty;
		var emptySpace;


		//beam up Neutronium
		if (ship.mission === 10) {
			emptySpace= vgap.getHull(ship.hullid).fueltank - ship.neutronium;
			qty= Math.min(planet.neutronium, emptySpace);

			planet.neutronium -= qty;
			ship.neutronium += qty;
			ship.fuelgained += qty;
			return;
		}//beam up Neutronium


		//beam up other resources
		var resource;
		if (ship.mission === 11) resource= 'duranium';
		if (ship.mission === 12) resource= 'tritanium';
		if (ship.mission === 13) resource= 'molybdenum';
		if (ship.mission === 14) resource= 'supplies';


		//find empty cargo space
		var emptyCargo= vgap.getHull(ship.hullid).cargo - getTotalCargo(ship);
		qty= Math.min(planet[resource], emptyCargo);

		planet[resource] -= qty;
		ship[resource] += qty;

	}//beamUp



	function alchemy(ship) {

		if (!ship)
			return;

		var qty, fuelTank;
		var fc= ship.friendlycode.toUpperCase();
		var extended= vgap.settings.fcodesextraalchemy;

		if (fc === "NAL")
			return;

		//Merlin
		if (ship.hullid === 105 && ship.supplies) {

			//ALD: 9s => 3d
			if (fc === "ALD") {
				qty= Math.floor(ship.supplies/9);
				ship.supplies -= qty * 9;
				ship.duranium += qty * 3;
				return;
			}//ald


			//ALT: 9s => 3t
			if (fc === "ALT") {
				qty= Math.floor(ship.supplies/9);
				ship.supplies -= qty * 9;
				ship.tritanium += qty * 3;
				return;
			}//alt


			//ALM: 9s => 3m
			if (fc === "ALM") {
				qty= Math.floor(ship.supplies/9);
				ship.supplies -= qty * 9;
				ship.molybdenum += qty * 3;
				return;
			}//alt


			//NAD: 6s => 1t + 1m
			if (fc === "NAD" && extended) {
				qty= Math.floor(ship.supplies/6);
				ship.supplies -= qty * 6;
				ship.tritanium += qty;
				ship.molybdenum += qty;
				return;
			}//nad


			//NAT: 6s => 1d + 1m
			if (fc === "NAT" && extended) {
				qty= Math.floor(ship.supplies/6);
				ship.supplies -= qty * 6;
				ship.duranium += qty;
				ship.molybdenum += qty;
				return;
			}//nat


			//NAM: 6s => 1d + 1t
			if (fc === "NAM" && extended) {
				qty= Math.floor(ship.supplies/6);
				ship.supplies -= qty * 6;
				ship.duranium += qty;
				ship.tritanium += qty;
				return;
			}//nam


			//default: 9s => 1d + 1t + 1m
			qty= Math.floor(ship.supplies/9);
			ship.supplies -= qty * 9;
			ship.duranium += qty;
			ship.tritanium += qty;
			ship.molybdenum += qty;
			return;
		}//Merlin


		//NRS
		if (ship.hullid === 104 && ship.supplies) {

			fuelTank= 800; //vgap.getHull(104).fueltank;

			qty = Math.min(ship.supplies, ship.duranium, (fuelTank - ship.neutronium));
			ship.supplies -= qty;
			ship.duranium -= qty;
			ship.neutronium += qty;
			ship.fuelgained += qty;

			qty = Math.min(ship.supplies, ship.molybdenum, (fuelTank - ship.neutronium));
			ship.supplies -= qty;
			ship.molybdenum -= qty;
			ship.neutronium += qty;
			ship.fuelgained += qty;

			qty = Math.min(ship.supplies, ship.tritanium, (fuelTank - ship.neutronium));
			ship.supplies -= qty;
			ship.tritanium -= qty;
			ship.neutronium += qty;
			ship.fuelgained += qty;

			return;
		}//NRS


		//Aries
		if (ship.hullid === 97) {

			fuelTank= 260;  //vgap.getHull(97).fueltank;

			qty = Math.min(ship.duranium, (fuelTank - ship.neutronium));
			ship.duranium -= qty;
			ship.neutronium += qty;
			ship.fuelgained += qty;

			qty = Math.min(ship.molybdenum, (fuelTank - ship.neutronium));
			ship.molybdenum -= qty;
			ship.neutronium += qty;
			ship.fuelgained += qty;

			qty = Math.min(ship.tritanium, (fuelTank - ship.neutronium));
			ship.tritanium -= qty;
			ship.neutronium += qty;
			ship.fuelgained += qty;

			return;
		}//Aries
	}//alchemy



	function starbaseFix(ship, starbase) {

		if (!ship || !starbase)
			return;

		if (ship.damage && starbase.shipmission === 1 && starbase.targetshipid === ship.id) {

			ship.damage= 0;
			ship.crew= vgap.getHull(ship.hullid).crew;

			starbase.shipmission= 0;
			starbase.targetshipid= 0;

		}//if

	}//starbaseFix


	function repairSupplies(ship) {

		if (!ship)
			return;

		if (ship.damage && ship.supplies) {

			var maxRepair= Math.floor(ship.supplies/5);
			var repaired= (maxRepair>ship.damage ? ship.damage : maxRepair);

			ship.damage -= repaired;
			ship.supplies -= repaired * 5;
		}//if

	}//repairSupplies


	function makeTorpedoes(ship) {

		if (!ship)
			return;

		if (ship.friendlycode.toUpperCase() === "MKT" && ship.torpedoid && ship.torps) { //don't need fuel to mkt

			var mcrCost= vgap.getTorpedo(ship.torpedoid).torpedocost;
			var newTorps= Math.floor(Math.min(ship.megacredits/mcrCost, ship.duranium, ship.tritanium, ship.molybdenum));

			if (newTorps <= 0) return;

			ship.ammo += newTorps;
			ship.mcr -= newTorps * mcrCost;
			ship.duranium -= newTorps;
			ship.tritanium -= newTorps;
			ship.molybdenum -= newTorps;
		}//if
	}//makeTorpedoes


	//================= MOVE ==========//

	function moveShips(ship, towShip) {

		if (!ship)
			return;

		var finished= false;

		//speed reduction for damaged ships
		var maxWarp = Math.ceil((100 - ship.damage) / 10);

		if (vgap.player.raceid === 2)
			maxWarp += 5;

		if (maxWarp>9)
			maxWarp= 9;

		if (ship.warp>maxWarp)
			ship.warp= maxWarp;


		//calculate where we move to next, how far it is, and how much fuel it costs
		var next, distance, fuelCost;

		var hyperjump= isHyperjumping(ship);
		if (hyperjump) {

			//calculate hyper jump
			next= {x: ship.targetx, y: ship.targety};
			distance= Math.dist(ship.x, ship.y, ship.targetx, ship.targety);
			fuelCost= 50;

		} else {

			//calculate normal moving ships
			var mass= getShipMass(ship);
			//var massTow= getShipMass(towShip);
            mass += getShipMass(towShip);

			var engine= vgap.getEngine(ship.engineid);
			var xv= vgap.getXV(engine, ship.warp);
			var speed= vgap.getSpeed(ship.warp, ship.hullid);

			next= getNext(ship.x, ship.y, ship.targetx, ship.targety, speed);
			distance= Math.dist(ship.x, ship.y, next.x, next.y);

			//fuelCost= Math.floor(xv * (Math.floor(mass / 10) + Math.floor(massTow / 10)) * ((Math.floor(distance) / speed) / 10000)); //from nu client
            fuelCost= Math.floor(xv * Math.floor(mass / 10) * ((Math.floor(distance) / speed) / 10000)); //from nu client
		}//if else


		//if we don't have enough fuel, calculate where we run out (for the oofAT indicator)
		if (!ship.oofAt && ship.neutronium < fuelCost) {

			var moved= distance * (ship.neutronium / fuelCost);
			ship.oofAt= getNext(ship.x, ship.y, ship.targetx, ship.targety, moved, true);

		}//if


		//execute move - even if we don't have enough fuel
		ship.x= next.x;
		ship.y= next.y;
		ship.neutronium -= fuelCost;


		//update targetxy (and waypoints) if we reached target
		if (ship.x === ship.targetx && ship.y === ship.targety) {
			if (ship.waypoints.length) {

				var target= ship.waypoints.shift();
				ship.targetx= target.x;
				ship.targety= target.y;

			} else
				finished= true; //yay! reached end of route
		}//if


		//fall into warpwell
		var planet = warpWell(ship.x, ship.y, hyperjump );

		if (ship.warp>1 && planet) {
			ship.x = planet.x;
			ship.y = planet.y;
		}//if


		//move towShip too
		if (towShip) {
			towShip.x= ship.x;
			towShip.y= ship.y;

			towShip.warp= 0;
			towShip.targetx= null;
			towShip.targety= null;
			towShip.waypoints= [];
		}//if


		//Cobol rampscoop makes fuel
		if (ship.hullid === 96) {
			var fuelgained= Math.floor(distance*2);
			var maxgain= 450 - ship.neutronium;

			if (fuelgained > maxgain)
				fuelgained= maxgain;

			ship.neutronium += fuelgained;
			ship.fuelgained += fuelgained;

		}//if

		return finished;
	}//moveShips



	function getNext (x1, y1, x2, y2, speed, runningOOF) {
		//x1,y1 is ship.x, ship.y
		//x2,y2 is targetx, targety

		if (runningOOF === undefined)
			runningOOF= false;

		//simple moves within speed
		var dist= Math.dist(x1, y1, x2, y2);

		if (dist <= speed + 0.5)
			return {x:x2, y:y2};


		//moves larger than speed
		var movedx, movedy;
		var dx= x2-x1;
		var dy= y2-y1;



		if (Math.abs(dx) > Math.abs(dy)) {
			//dx is major. dy is minor

			if (!runningOOF) {
				movedx= Math.floor((speed * dx) / Math.sqrt(dx*dx + dy*dy) + 0.5);
				movedy= Math.floor( movedx * (dy / dx) + 0.5);
			} else {
				movedx= Math.floor((speed * dx) / Math.sqrt(dx*dx + dy*dy) + 0.5);
				movedy= Math.floor( movedx * (dy / dx) + 0.5);
			}

		} else {
			//dy is major. dx is minor
			if (!runningOOF) {
				movedy= Math.floor((speed * dy) / Math.sqrt(dy*dy + dx*dx) + 0.5);
				movedx= Math.floor( movedy * (dx / dy) + 0.5);
			} else {
				movedy= Math.floor((speed * dy) / Math.sqrt(dy*dy + dx*dx) + 0.5);
				movedx= Math.floor( movedy * (dx / dy) + 0.5);
			}

		}//if

		var nx= x1 + movedx;
		var ny= y1 + movedy;

		return {x:nx, y:ny};
	}//getNext


	function isHyperjumping(ship) {

		if (!ship)
			return false;

		//we ignore fcode in this function since jump may be in future turns

		//technically a ship will jump if it's target is over 20ly, not just 340 .. 360ly
		//But this is a good test so we ignore cases of bad-jumps.

		var hullid= ship.hullid;
		var hyperHull= (hullid === 51 || hullid === 77 || hullid === 87 || hullid === 110);

		if (hyperHull && ship.neutronium >= 50 && ship.warp > 1) {
			var dist= Math.dist(ship.x, ship.y, ship.targetx, ship.targety);
			return (dist >= 340 && dist <= 360);
		}//if

		return false;
	}//isHyperjumping



	function warpWell(x, y, hyper) {

		var pullDistance = (hyper ? 2.83 : 3); // Sqrt(2*2 + 2*2) = 2.83
		var pend= vgap.planets.length;

		for (var ploop = 0; ploop < pend; ploop+=1) {
			var planet = vgap.planets[ploop];

			if (x === planet.x && y === planet.y)
				return null;

			var dist = Math.dist(x, y, planet.x, planet.y);

			if (dist <= pullDistance)
				return planet;

		}//for

		return null;
	}//warpWell



	function getShipMass(ship) {

		if (!ship)
			return 0;

		var mass = vgap.getHull(ship.hullid).mass;
		mass += ship.neutronium;
		mass += getTotalCargo(ship);

		if (ship.beams && ship.beamid) {
			var beam = vgap.getBeam(ship.beamid);
			mass += beam.mass * ship.beams;
		}

		if (ship.torps && ship.torpedoid) {
			var torp = vgap.getTorpedo(ship.torpedoid);
			mass += torp.mass * ship.torps;
		}

		return mass;
	}//getShipMass



	function getTotalCargo(ship) {

		if (!ship)
			return 0;

		var cargo= ship.ammo + ship.supplies + ship.clans;
		cargo += ship.duranium + ship.tritanium + ship.molybdenum;

		return cargo;
	}//getTotalCargo



	function cleanCopy(obj) {

		if (!obj)
			return null;

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


	function getArray(array, search, searchTerm) {

		if (searchTerm === undefined)
			searchTerm= "id";

		for (var i= 0; i < array.length; i++) {
			if (array[i][searchTerm] === search)
				return array[i];
		}//for

		return null;
	}//getArray


	//register with Nu
	vgap.registerPlugin(plugin, "fuelUse");
} //wrapper for injection



var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";
document.body.appendChild(script);