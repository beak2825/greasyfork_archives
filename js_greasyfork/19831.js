// ==UserScript==
// @name          Planets.nu Hover Prediction
// @namespace     quapla/Hover Prediction
// @date          2016-05-26
// @author        Quapla
// @grant         none
// @description   NU Starmap-Plugin, that hovers more info for Planets, Ships and Minerals also for the next turn
// @include       http://planets.nu/home
// @include       http://planets.nu/games/*
// @include       http://play.planets.nu/*
// @include       http://*.planets.nu/*
// @include       http://planets.nu/*
// @homepage      https://greasyfork.org/de/scripts/19831-planets-nu-hover-prediction
// @version       0.4.10
// @downloadURL https://update.greasyfork.org/scripts/19831/Planetsnu%20Hover%20Prediction.user.js
// @updateURL https://update.greasyfork.org/scripts/19831/Planetsnu%20Hover%20Prediction.meta.js
// ==/UserScript==

// Reference Jim Clark's Planets.nu improved hover text (V2): https://greasyfork.org/en/scripts/2618-planets-nu-improved-hover-text
// Reference Big Beefer's Planet.nu improved hovertext (V3): https://greasyfork.org/en/scripts/2618-planets-nu-improved-hover-text
// Reference Stephen Piper's hoverTextbox: https://greasyfork.org/en/scripts/17959-hovertextbox
// Reference helmet's Planets.nu ship predictor: http://userscripts-mirror.org/scripts/show/146137
// Reference Kero van Gelder: Redraw and Filter: http://chmeee.org/ext/planets.nu/RedrawAndFilter.user.js
// Colaboration kedalion's Enemy Ship List Plugin: https://greasyfork.org/en/scripts/5994-planets-nu-enemy-ship-list-plugin

/*------------------------------------------------------------------------------
0.1 Initial Workout
0.2 Impelemntation of Jim Clark's and Big Beefer's code
0.3 Implementation of Stephen Piper's code
0.3 New Layout and diferent point of views
0.4 Implementation of helmet's code - Official Beta Release to start communication
0.4.3 Changed views, planned planets/ships are now green, added more settings (take care to click the checkboxes!)
0.4.4 Fixed bdm/bum cases
0.4.8 Changed views, added Enemey-Ships, and VPA-style net cargo info in brackets. Colaboration with Enemy Ship
0.4.10 Bugfix, thanx to Frostriese
------------------------------------------------------------------------------*/

function wrapper() { // wrapper for injection
	// Functions for Show Hover
	function hitText() {}

	hitText.prototype = {
		nativeTaxAmount : function (c, ntr) // How much do natives pay at 'c' with 'ntr'-taxrate - limited by natives/taxrate
		{
			var nt = 0;
			if (c.nativeclans > 0) {
				if (c.race == 6 && ntr > 20) { // borg == 6 can be taxed with 20% max
					ntr = 20;
				}

				nt = (c.nativeclans / 100) * (ntr / 10) * (c.nativegovernment / 5);

				nt = c.nativetype == 5 ? 0 : nt; // amorphous == 5 wont pay
				nt *= c.race == 1 ? 2 : 1; // feds == 1 pay twice
				nt *= c.nativetype == 6 ? 2 : 1; // insect == 6 pay twice

				nt = Math.round(nt);
			}
			return nt;
		},

		nativesupportedtax : function (c) // How taxes can we receive at 'c' - limited by clans
		{
			var ns = c.clans;
			ns *= c.race == 1 ? 2 : 1; // feds == 1
			ns *= c.nativetype == 6 ? 2 : 1; // insect == 6
			return ns;
		},

		showMin : function (txt, surface, change, ground, chtxt) // Shows | 00000000 | TXT | CHTXT 0000 | (00000)
		{
			var showtxt = "<td style='text-align:right;'>" + addCommas(surface) + "&nbsp</td>";
			showtxt += "<td>" + txt + "&nbsp</td>";
			showtxt += "<td style='text-align:right;'>&nbsp" + chtxt + addCommas(change, true) + "&nbsp</td>";
			showtxt += "<td style='text-align:right;";
			if (ground < 100) {
				showtxt += " color:#ff0000;";
			} // Red
			else if (ground < 1000) {
				showtxt += " color:#ffa500;";
			} // Orange
			else if (ground > 10000) {
				showtxt += " color:#90ee90;";
			} // Green
			showtxt += "'>&nbsp(" + addCommas(ground) + ")</td>";
			return showtxt;
		},

		// Reference: Redraw and Filter, Kero van Gelder, http://chmeee.org/ext/planets.nu/RedrawAndFilter.user.js
		shortHullName : function (hull) {
			var name;
			switch (hull.id) {
			case 15:
				return "SDSF";
			case 16:
				return "MDSF";
			case 17:
				return "LDSF";
			case 18:
				return "STF";
			case 28:
				return "Fearless";
			case 69:
				return "SSD";
			default:
				if (hull.id >= 1000)
					return hull.name;
				var hullName = hull.name;
				var m;
				if (m = hullName.match(/^(([^ ]+).*) Class /))
					name = m[2].match(/\d/) ? m[2] : m[1];
				else if (m = hullName.match(/^(([^ ]+) [^ ]+)/))
					name = m[2].match(/\d/) ? m[2] : hullName;
				else
					name = hullName;
				return name;
			}
		},

		GetMaxPop : function (hit) // Gets max. Population on Planet hit
		{
			/// Population in popup text
			//////////////////////
			var planetOwner = null;
			var maxPop = 0;

			// Do we have a temp scan?
			if (hit.temp >= 0 && hit.temp <= 100) {
				// Use your race if planet unowned
				if (hit.ownerid == 0)
					planetOwner = vgap.getPlayer(vgap.player.id);
				else
					planetOwner = vgap.getPlayer(hit.ownerid);
				// Find max pop
				// xtal
				if (planetOwner.raceid == 7) {
					maxPop = 1000 * hit.temp;
				} else {
					maxPop = Math.round(Math.sin(3.14 * (100 - hit.temp) / 100) * 100000);
					if (hit.temp > 84)
						maxPop = Math.floor((20099.9 - (200 * hit.temp)) / 10);
					if (hit.temp < 15)
						maxPop = Math.floor((299.9 + (200 * hit.temp)) / 10);
					// Cols, Rebles, Fascists, Bots
					if (hit.temp > 80 && (planetOwner.raceid == 4 || planetOwner.raceid == 9 || planetOwner.raceid == 10 || planetOwner.raceid == 11))
						maxPop = 60;
					// Rebels
					if (hit.temp <= 19 && planetOwner.raceid == 10)
						maxPop = 90000;
				}

				if (hit.debrisdisk > 0) {
					maxPop = 0;
					if (vgap.getStarbase(maxPop.id) != null) {
						maxPop = 500;
					}
				}
			}
			return maxPop;

		},

		GetPopGrowth : function (hit) // Gets growth of Population
		{
			var planet = hit;
			var player = vgap.getPlayer(hit.ownerid);
			var raceId = player.raceid;

			var colGrowth = 0;
			if ((planet.colonisthappypoints + vgap.colonistTaxChange(planet)) >= 70 && planet.clans > 0) {
				var colMax = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 100000);

				//crystals like it hot
				if (raceId == 7) {
					colMax = 1000 * planet.temp;
					colGrowth = Math.round(((planet.temp / 100) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5))));
					if (vgap.advActive(47))
						colGrowth = Math.round((((planet.temp * planet.temp) / 4000) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5))));
				} else if (planet.temp >= 15 && planet.temp <= 84)
					colGrowth = Math.round(Math.sin(3.14 * ((100 - planet.temp) / 100)) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5)));

				//slows down over 6,600,000
				if (planet.clans > 66000)
					colGrowth = Math.round(colGrowth / 2);

				//planetoids do not have an atmosphere
				if (planet.debrisdisk > 0)
					colGrowth = 0;

				//check against max
				if ((planet.clans + colGrowth) > colMax)
					colGrowth = colMax - planet.clans;

				//100 and 0 degree planets
				if (colGrowth < 0)
					colGrowth = 0;
			}

			if (colGrowth == 0)
				colGrowth = this.GetsmaxPop(hit, true);

			if (planet.nativetype == 5) // angry Amorphs...
				if (hit.nativetaxrate + vgap.nativeTaxChange(planet) >= 70)
					colGrowth -= 5;
				else if (hit.nativetaxrate + vgap.nativeTaxChange(planet) >= 70)
					colGrowth -= 20;
				else
					colGrowth -= 40;

			return colGrowth;
		},

		GetMinPopGrow : function (hit) {
			var player = vgap.getPlayer(hit.ownerid);
			var raceId = player.raceid;
			var planet = hit;
			var grow = 1;

			if (planet.nativetype == 5) // angry Amorphs...
					grow += 5;

			for (i = 1; i<300; i++) {
				if (raceId == 7) {
					if (vgap.advActive(47))
						colGrowth = Math.round((((planet.temp * planet.temp) / 4000) * (i / 20) * (5 / (planet.colonisttaxrate + 5))));
					else
						colGrowth = Math.round(((planet.temp / 100) * (i / 20) * (5 / (planet.colonisttaxrate + 5))));
				} else {
					if (planet.temp >= 15 && planet.temp <= 84)
						colGrowth = Math.round(Math.sin(3.14 * ((100 - planet.temp) / 100)) * (i / 20) * (5 / (planet.colonisttaxrate + 5)));
					else {
						colGrowth = 0;
						break;
					}
				}
				if (colGrowth >= grow)
					break;
			}
			if (i >= 299 || colGrowth == 0)
				i = 0;
			return i;
		},

		GetsmaxPop : function (hit, getGrowth) { // getGrows: TRUE Col growth, FALSE: max supported
			var player = vgap.getPlayer(hit.ownerid);
			var raceId = player.raceid;
			var planet = hit;
			var climateDeathRate = 10;
			var maxSupported = 0;
			var colGrowth = 0;

			//crystal calculation
			if (raceId == 7)
				maxSupported = planet.temp * 1000;
			else {
				//all others
				maxSupported = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 100000);
				if (planet.temp > 84)
					maxSupported = Math.floor((20099.9 - (200 * planet.temp)) / climateDeathRate);
				else if (planet.temp < 15)
					maxSupported = Math.floor((299.9 + (200 * planet.temp)) / climateDeathRate);
			}

			//Fascist, Robots, Rebels, Colonies can support a small colony of 60 clans on planets over 80 degrees
			if (raceId == 4 || raceId == 9 || raceId == 10 || raceId == 11) {
				if (planet.temp > 80)
					maxSupported = Math.max(maxSupported, 60);
			}

			//rebel arctic planet advantage
			if (planet.temp <= 19 && raceId == 10)
				maxSupported = Math.max(maxSupported, 90000);

			//planetoids do not have an atmosphere
			if (planet.debrisdisk > 0) {
				maxSupported = 0;
				if (vgap.getStarbase(planet.id) != null)
					maxSupported = 500;
			}

			if (!getGrowth)
				return maxSupported;

			//determine how much we are overpopulated
			var overPopulation = Math.ceil((planet.clans - maxSupported) * (climateDeathRate / 100));
			if (overPopulation > 0) {
				//recalculate maxsupported/overpopulation
				maxSupported = maxSupported + Math.round(planet.supplies * 10 / 40);
				overPopulation = Math.ceil((planet.clans - maxSupported) * (climateDeathRate / 100));

				//update population
				colGrowth = -1 * Math.max(0, overPopulation);
			}
			return colGrowth;
		},

		GetMinPop : function (hit) // Gets minimal Population on Hit
		{
			/// Population in popup text
			//////////////////////
			var planetOwner = null;
			var minPop = 0;

			// Do we have a temp scan?
			if (hit.temp >= 0 && hit.temp <= 100) {

				// Use your race if planet unowned
				if (hit.ownerid == 0)
					planetOwner = vgap.getPlayer(vgap.player.id);
				else
					planetOwner = vgap.getPlayer(hit.ownerid);

				// Find min growth pop
				var targetGrowth = 1;
				// Worms!
				if (hit.nativetype == 5)
					targetGrowth = 6;
				// xtal
				if (planetOwner.raceid == 7) {
					minPop = Math.floor(targetGrowth * 11 / (hit.temp / 100));
					if (vgap.advActive(47)) {
						minPop = Math.floor(targetGrowth * 11 / hit.temp * hit.temp / 4000);
					}
					if (hit.temp < 15)
						minPop = 0;

				} else {
					// This should just be a formula like: minPop = Math.floor(targetGrowth * 11 / Math.sin(3.14*(100-hit.temp)/100)));
					// But that is off but a bit. This seems more acurate, but is still slightly off the chart I was going off. Which may be wrong too!
					// ...
					for (minPop = 10; minPop < 300; minPop++) {
						var growth = Math.round(Math.sin(3.14 * ((100 - hit.temp) / 100)) * minPop / 20);
						if (growth >= targetGrowth)
							break;
					}
					if (hit.temp < 15 || hit.temp > 84)
						minPop = 0;
					if (minPop >= 299)
						minPop = 0;
				}

				if (hit.debrisdisk > 0) {
					minPop = 0;
				}

			}
			//////////////////////
			return minPop;
		},

		miningRate(p, ground, density, mines) {
			m = vgap.miningRate(p, density, mines);
			m = m > ground ? ground : Math.round(m);
			return m;
		},

		getDistQ : function (x1, y1, x2, y2) {
			var dx = x2 - x1;
			var dy = y2 - y1;
			return Math.sqrt((dx * dx) + (dy * dy));
		},

	};

	hitText.prototype.predictor = function (ship, forTowCalculation) { //be careful when calling 'this', needs the actual shipscreen!
		if (!ship)
			return;
		var hull = vgap.getHull(ship.hullid);
		var planet = vgap.planetAt(ship.x, ship.y);
		var starbase = null;
		if (planet)
			starbase = vgap.getStarbase(planet.id);
		var result = {
			ammo : 0,
			supplies : 0,
			neutronium : 0,
			duranium : 0,
			tritanium : 0,
			molybdenum : 0,
			megacredits : 0,
			damage : 0,
			crew : 0,
			cargo : 0
		};
		var getCargo = function () {
			result.cargo = result.ammo + result.supplies + result.duranium + result.tritanium + result.molybdenum;
		};
		var cloakFuel = function () {
			if ((ship.mission == 9 || (vgap.player.raceid == 3 && ship.mission == 8 && hull.cancloak)) && ship.hullid != 29 && ship.hullid != 31)
				return Math.max(5, Math.floor((hull.mass / 100) * 5));
			else
				return 0;
		}

		//cloak - will it use fuel when it fails because of lack of fuel?
		result.neutronium -= Math.min(ship.neutronium + result.neutronium, cloakFuel());

		//build fighters
		getCargo();
		if (ship.bays > 0 && vgap.player.raceid > 8) {
			var race = vgap.player.raceid;
			var loadedfighters = 0;
			//load
			if (planet != null && planet.ownerid == vgap.player.id && ship.friendlycode.toUpperCase() == "LFM" && ship.neutronium + result.neutronium > 0) {
				loadedfighters = Math.min(Math.floor(planet.molybdenum / 2), Math.floor(planet.tritanium / 3), Math.floor(planet.supplies / 5), Math.floor((hull.cargo - vgap.shipScreen.getTotalCargo(ship) - result.cargo) / 10));
				if (loadedfighters > 0) {
					result.molybdenum += loadedfighters * 2;
					result.tritanium += loadedfighters * 3;
					result.supplies += loadedfighters * 5;
				}
			}
			//build
			var builtfighters = 0;
			if ((ship.friendlycode.toUpperCase() == "LFM" && ship.neutronium + result.neutronium > 0) || ((race == 9 || race == 11) && ship.mission == 8)) {
				builtfighters = Math.min(Math.floor((ship.molybdenum + result.molybdenum) / 2), Math.floor((ship.tritanium + result.tritanium) / 3), Math.floor((ship.supplies + result.supplies) / 5));
				if (builtfighters > 0) {
					result.molybdenum -= builtfighters * 2;
					result.tritanium -= builtfighters * 3;
					result.supplies -= builtfighters * 5;
					result.ammo += builtfighters;
				}
			}
		}

		//lady royale
		if (hull.id == 42 && ship.neutronium > 0) {
			result.megacredits += Math.min(10000 - (ship.megacredits + result.megacredits), ship.clans + result.clans);
		}

		//borg repair
		if (vgap.player.raceid == 6 && ship.mission == 8 && ship.neutronium > 0 && ship.warp == 0)
			result.damage -= Math.min(ship.damage, 10);

		//bdm -> Ship 0 gets 0 MC, Planet get all MC for later bum...
		var bdm = 0;
		if (planet != null) {
			if (ship.friendlycode.toUpperCase() == "BDM")
				result.megacredits -= (ship.megacredits + result.megacredits);
			var shipsAt = vgap.shipsAt(ship.x, ship.y);
			for (var i = 0; i < shipsAt.length; i++) {
				var s = shipsAt[i];
				if (s.ownerid != vgap.player.id && !s.allyupdate) // try (vgap.allied(s.ownerid))
					continue;
				if (s.friendlycode.toUpperCase() == "BDM") {
					bdm += s.megacredits;
					if (s.allyupdate && s.hullid == 42 && s.neutronium > 0)
						bdm += Math.min(10000 - s.megacredits, s.clans); //allied Lady Royale
				}
			}
		}

		//bum
		if (planet != null && (planet.ownerid == 0 || planet.ownerid == vgap.player.id || planet.allyupdate) && planet.friendlycode.toUpperCase() == "BUM") {
			var bum = planet.megacredits + bdm;
			for (var i = 0; i < shipsAt.length; i++) {
				var s = shipsAt[i];
				if (s.id < ship.id && s.ownerid != vgap.player.id && !s.allyupdate) {
					bum = 0; //can't handle foreign ships
					break;
				}
				if (s.id < ship.id)
					bum -= Math.min(10000 - (s.friendlycode.toUpperCase() == "BDM" ? 0 : s.megacredits), bum);
				else
					break;
			}
			if (bum > 0)
				result.megacredits += bum;
		}

		//gather missions (2do: other ships gathering before)
		getCargo();
		if (ship.neutronium > 0 && ship.mission > 9 && ship.mission < 15 && planet != null && (planet.ownerid == 0 || planet.ownerid == vgap.player.id)) { //2do? allied
			freecargo = hull.cargo - vgap.shipScreen.getTotalCargo(ship) - result.cargo;
			switch (ship.mission) {
			case 10:
				if (planet.neutronium > 0)
					result.neutronium += Math.min(hull.fueltank - ship.neutronium - result.neutronium, planet.neutronium);
				break;
			case 11:
				if (planet.duranium > 0)
					result.duranium += Math.min(freecargo, planet.duranium);
				break;
			case 12:
				if (planet.tritanium > 0)
					result.tritanium += Math.min(freecargo, planet.tritanium);
				break;
			case 13:
				if (planet.molybdenum > 0)
					result.molybdenum += Math.min(freecargo, planet.molybdenum);
				break;
			case 14:
				if (planet.supplies > 0)
					result.supplies += Math.min(freecargo, planet.supplies);
				break;
			default:
				break;
			}
		}

		//alchemy
		if (hull.id == 105 && ship.friendlycode.toLowerCase() != "nal" && ship.neutronium > 0) //need fuel for that?
		{
			var alchemy = Math.floor((ship.supplies + result.supplies) / 9);
			result.supplies -= 9 * alchemy;
			switch (ship.friendlycode.toLowerCase()) {
			case "ald":
				result.duranium += 3 * alchemy;
				break;
			case "alt":
				result.tritanium += 3 * alchemy;
				break;
			case "alm":
				result.molybdenum += 3 * alchemy;
				break;
			default:
				result.duranium += alchemy;
				result.tritanium += alchemy;
				result.molybdenum += alchemy;
				break;
			}
		}

		getCargo();
		//refinery NRS=104, Aries=97
		if ((hull.id == 104 || hull.id == 97) && ship.friendlycode.toLowerCase() != "nal" && ship.neutronium > 0) { //need fuel for that?
			var ref = Math.min(ship.duranium + result.duranium + ship.tritanium + result.tritanium + ship.molybdenum + result.molybdenum, hull.fueltank - (ship.neutronium + result.neutronium));
			if (hull.id == 104) {
				ref = Math.min(ref, ship.supplies);
				result.supplies -= ref;
			}
			result.neutronium += ref;
			//how it's done
			var now = Math.min(ship.duranium + result.duranium, ref);
			result.duranium -= now;
			ref -= now;
			now = Math.min(ship.tritanium + result.tritanium, ref);
			result.tritanium -= now;
			ref -= now;
			now = Math.min(ship.molybdenum + result.molybdenum, ref);
			result.molybdenum -= now;
			ref -= now;
			if (ref != 0) { //whoops, something went wrong
			}

			/* that's how I'd do it...
			var a=[ship.duranium,ship.tritanium,ship.molybdenum];
			var k=0;
			while (ref>0) {
			if (a[k]>0) {a[k]--; ref--};
			k=(k+1)%3;
			}

			result.duranium-=ship.duranium-a[0];
			result.tritanium-=ship.tritanium-a[1];
			result.molybdenum-=ship.molybdenum-a[2];
			 */
		}

		getCargo();
		//lay mines
		if (ship.mission == 2 || (vgap.getPlayer(ship.ownerid).raceid == 7 && ship.mission == 8))
			// result.ammo -= vgap.shipScreen.getMineLayTorps(ship);  // Quapla to Todo: No function getMineLayTorps
			result.ammo = 0;
		getCargo();

		//scoop mines

		//create array of proposed minefields first
		if (ship.torps > 0 && ship.mission == 1 && ship.friendlycode.toLowerCase() == "msc") {
			var minefields = new Array();
			for (var j = 0; j < vgap.minefields.length; j++) {
				var mf = vgap.minefields[j];
				minefields.push({
					ownerid : mf.ownerid,
					x : mf.x,
					y : mf.y,
					radius : mf.radius,
					isweb : mf.isweb,
					units : mf.units,
					radiusPresweep : mf.radius
				});
			}
			//mine laying minefields (from preview)
			for (var i = 0; i < vgap.ships.length; i++) {
				var s = vgap.ships[i];
				if (s.ownerid != vgap.player.id && !s.allyupdate)
					continue;
				if (s.neutronium > 0 && s.ammo > 0 && s.torps > 0) {
					if (s.mission == 2 || (s.mission == 8 && vgap.player.raceid == 7)) {
						var isWeb = (s.mission == 8);

						var fieldOwnerId = s.ownerid;

						//miX friendlycode
						if (s.friendlycode.toLowerCase().indexOf("mi") === 0) {
							fieldOwnerId = vgap.getPlayerIdVal(s.friendlycode.toLowerCase().replace("mi", ""));
							if (fieldOwnerId == 0 || fieldOwnerId > vgap.game.slots)
								fieldOwnerId = s.ownerId;
						}
						var units = this.getMineUnits(s);

						//determine if we are inside of one of our minefields
						var minefield = null;
						var closest = 10000.0;
						for (var j = 0; j < minefields.length; j++) {
							var closestField = minefields[j];
							if (closestField.isweb == isWeb && closestField.ownerid == fieldOwnerId) {
								var dist = parseFloat(hitText.prototype.getDistQ(s.x, s.y, closestField.x, closestField.y)); // Quapla Todo
								// var dist = 9999; // never in Minefield -> Check funktion getDist Quapla
								if (dist < closest) {
									minefield = closestField;
									closest = dist;
								}
								if (closest == 0)
									break;
							}
						}
						var newField = true;
						if (minefield != null) {
							if (closest <= minefield.radius)
								newField = false;
						}
						//new field
						if (newField) {
							minefield = {
								ownerid : fieldOwnerId,
								x : s.x,
								y : s.y,
								isweb : isWeb,
								units : 0
							};
							minefields.push(minefield);
						}

						//add the units to the minefield
						minefield.units += units;
						minefield.changed = 1;

						//max minefield, don't lay so many torps
						if (minefield.units > 22500)
							minefield.units = 22500;

						minefield.radius = Math.sqrt(minefield.units);

					}
				}

			}
			var torp = vgap.getTorpedo(ship.torpedoid);
			getCargo();
			var openCargo = 0;
			var ammo = 0;
			//look for scooping ships
			for (var i = 0; i < vgap.ships.length; i++) {
				var s = vgap.ships[i];
				if (s.ownerid != vgap.player.id && !s.allyupdate)
					continue;
				if (s.friendlycode.toLowerCase() != "msc" || s.mission != 1 || s.torps < 1 || s.beams < 1 || s.neutronium < 1)
					continue;
				openCargo = vgap.getHull(s.hullid).cargo - vgap.shipScreen.getTotalCargo(s);
				if (s.id == ship.id)
					openCargo -= result.cargo; //2do? result for other ships
				for (var j = 0; j < minefields.length; j++) {
					var minefield = minefields[j];
					var dist = parseFloat(hitText.prototype.getDistQ(s.x, s.y, minefield.x, minefield.y));
					if (minefield.ownerid == s.ownerid && (dist - minefield.radius) <= 0) {
						//Mine scoop
						var unitsScooped = openCargo * s.torpedoid * s.torpedoid;
						if (vgap.player.raceid == 9)
							unitsScooped *= 4;

						if (unitsScooped > minefield.units)
							unitsScooped = minefield.units;

						if (unitsScooped > 0) {
							minefield.units -= unitsScooped;
							minefield.radius = Math.sqrt(minefield.units);
							minefield.swept = 1;
							if (minefield.units < 0)
								minefield.units = 0;

							if (vgap.player.raceid == 9)
								unitsScooped /= 4;

							ammo = Math.floor(unitsScooped / s.torpedoid / s.torpedoid);

							openCargo -= ammo;
							if (s.id == ship.id)
								result.ammo += ammo;
						}
					}
				}
				if (s.id == ship.id)
					break;
			}
		}

		//Starbase fix
		if (starbase && starbase.shipmission == 1 && starbase.targetshipid == ship.id) {
			result.damage -= ship.damage;
			result.crew += hull.crew - ship.crew;
		}

		//repair with supplies
		if (ship.damage + result.damage > 0) {
			var rep = Math.floor(ship.supplies / 5);
			rep = Math.min(rep, ship.damage + result.damage);
			result.supplies -= rep * 5;
			result.damage -= rep;
		}

		//mkt
		if (ship.torps > 0 && ship.friendlycode.toUpperCase() == "MKT") {
			var cost = vgap.getTorpedo(ship.torpedoid).torpedocost;
			var mkt = Math.min(ship.duranium + result.duranium, ship.tritanium + result.duranium, ship.molybdenum + result.molybdenum, Math.floor((ship.megacredits + result.megacredits) / cost));
			result.ammo += mkt;
			result.duranium -= mkt;
			result.tritanium -= mkt;
			result.molybdenum -= mkt;
			result.megacredits -= mkt * cost;
		}
		getCargo();
		if (forTowCalculation)
			return result;

		//movement
		var x,
		y,
		dist;
		var a = vgap.getNextLoc(ship); //includes breakTow
		x = a[0],
		y = a[1],
		dist = a[2];
		var actFuel = ship.neutronium + result.neutronium;
		var actMass = hull.mass + vgap.shipScreen.getTotalCargo(ship) + result.cargo + actFuel;
		if (ship.warp > 0 && dist > 0) {
			actMass += (ship.beams > 0 ? vgap.getBeam(ship.beamid).mass * ship.beams : 0);
			actMass += (ship.torps > 0 ? vgap.getTorpedo(ship.torpedoid).mass * ship.torps : 0);
			if (ship.mission == 6 && ship.mission1target != 0 && actFuel > 0) {
				var towShip = vgap.getShip(ship.mission1target);
				var towTarget = vgap.isTowTarget(ship.id);
				if (towShip != null && (towTarget == null || towShip.id != towTarget.id)) { //towee towing the tower?
					if (towShip.ownerid == vgap.player.id || towShip.allyupdate) {
						if (!vgap.breakTow(ship, towShip)) {
							var resultTowship = this.predictor(towShip, true);
							var towMass = 0;
							towMass += vgap.getHull(towShip.hullid).mass + vgap.shipScreen.getTotalCargo(towShip) + resultTowship.cargo + towShip.neutronium + resultTowship.neutronium;
							towMass += (towShip.beams > 0 ? vgap.getBeam(towShip.beamid).mass * towShip.beams : 0);
							towMass += (towShip.torps > 0 ? vgap.getTorpedo(towShip.torpedoid).mass * towShip.torps : 0);
							actMass += 10 * Math.truncate(towMass / 10); //according to http://donovansvgap.com/help/details.htm#fuel2
						}
					} else
						actMass += 10 * Math.truncate(towShip.mass / 10);
				}
			}
			var speed = vgap.getSpeed(ship.warp, vgap.getHull(ship.hullid));
			var xv = (vgap.getEngine(ship.engineid)["warp" + ship.warp] || 0);
			var turnFuel = (vgap.isHyping(ship) || vgap.isChunnelling(ship) ? 50 : Math.floor(xv * Math.floor(actMass / 10) * ((Math.floor(dist) / speed) / 10000)));
			result.neutronium -= turnFuel;
			/* No need at Hover Quapla
			var color = "green";
			if (ship.neutronium + result.neutronium < 0 && !(vgap.isHyping(ship) || vgap.isChunnelling(ship))) { //correction for running out of fuel (experimental)
			result.neutronium = -ship.neutronium;
			var i = 0,
			f = 0;

			/*while (f<actFuel+1) {
			dist=i;
			i+=1;
			f=Math.floor(xv * Math.floor(actMass / 10) * (i / speed) / 10000);
			//console.log("dist: "+i+" fuel: "+f)
			}*/
			/*
			dist = actFuel / turnFuel * dist;
			a = vgap.getNextLoc(ship, dist);
			x = a[0],
			y = a[1],
			dist = a[2];
			color = "red";
			} */
			/* if (ship.x == x && ship.y == y)
			color = "red";
			vgap.map.drawCircle(x, y, 3,{
			stroke : color,
			"stroke-width" : 1,
			"stroke-opacity" : "1"
			}
			);  // Quapla whats that? */
		}
		this.totalmass = actMass;

		//ramscoop (cobol)
		if (hull.id == 96 && ship.warp > 0 && dist > 0) {
			result.neutronium += Math.min(Math.floor(dist) * 2, hull.fueltank - (ship.neutronium + result.neutronium));
		}

		//radiation
		var radiation = vgap.shipScreen.getPathRadiation(ship);
		var crewDeath = vgap.shipScreen.radiationEffect(ship, radiation);
		if (crewDeath > 0)
			result.crew -= Math.min(crewDeath, ship.crew + result.crew);

		//glory device
		var nextloc = vgap.getNextLoc(ship);
		var d = 0;
		for (i = 0; i < vgap.ships.length; i++) {
			var s = vgap.ships[i];
			if (s.ownerid != vgap.player.id && !s.allyupdate)
				continue;
			var nextloc1 = vgap.getNextLoc(s);
			if ((s.hullid == 39 || s.hullid == 41 || s.hullid == 1034 || s.hullid == 1039) && s.friendlycode.toUpperCase() == "POP" && nextloc[0] == nextloc1[0] && nextloc[1] == nextloc1[1]) {
				if (s.id == ship.id)
					result.damage = 100;
				var factor = 10000; //normal damage
				if (s.hullid % 1000 == 39 && s.ownerid == ship.ownerid)
					factor = 2000; //D19b, D19c (20%)
				if (s.hullid == 41 && s.ownerid == ship.ownerid)
					factor = 1000; //saber (10%)
				if (s.hullid == 1034) {
					if (s.ownerid == ship.ownerid)
						factor = 2000; //D7b (20%) 2do: "friendly ships" - whatever that is
					else
						factor = 5000; //50%
				}
				result.damage += Math.floor((factor) / (hull.mass + 1));
				d++;
			}
			if (ship.damage + result.damage > 100) {
				result.damage = 100 - ship.damage;
				break;
			};
		}

		//repair if glory
		if (d > 0 && ship.damage + result.damage > 0 && ship.damage + result.damage < 100) {
			var rep = Math.floor(ship.supplies / 5);
			result.supplies -= rep * 5;
			result.damage -= rep;
		}

		/* wait a minute, that's after movement (careful, needs to really get there!)
		var target=vgap.getPlanetAt(x,y);
		var targetStarbase=vgap.getStarbase(target.id);
		//starbase unload all freighters
		if (targetStarbase && targetStarbase.mission == 4) {
		result.duranium-=ship.duranium;
		result.tritanium-=ship.tritanium;
		result.molybdenum-=ship.molybdenum;
		result.supplies-=ship.supplies;
		result.clans-=ship.clans;
		result.megacredits-=ship.megacredits;
		}


		//starbase refuel - that means calculating fuel of all ships (with lower id with this as target
		//starbase load torps onto ships - similar here
		 */
		getCargo();
		var prediction = {};
		prediction.neutronium = result.neutronium;
		prediction.duranium = result.duranium;
		prediction.tritanium = result.tritanium;
		prediction.molybdenum = result.molybdenum;
		prediction.megacredits = result.megacredits;
		prediction.damage = result.damage;
		prediction.crew = result.crew;
		prediction.ammo = result.ammo;
		prediction.supplies = result.supplies;
		prediction.cargo = result.cargo;
		prediction.x = x;
		prediction.y = y;
		hitText.prototype.prediction = prediction;
		return result;
	};

	//Helpers for Prediction

	vgaPlanets.prototype.getNextLoc = function (ship, maxDist) { //2do? include chunnelling?
		if (!ship)
			return;
		var curX = ship.x,
		curY = ship.y;
		var tower = vgap.isTowTarget(ship.id);
		if (tower != null && !vgap.breakTow(tower, ship) && ship.mission != 6) {
			var TowerLoc = this.getNextLoc(tower);
			TowerLoc[2] = 0; //didn't travel on own engine
			return TowerLoc;
		}
		if (vgap.isChunnelling(ship)) {
			var targetId = parseInt(ship.friendlycode, 10);
			var target = vgap.getShip(targetId);
			if (!target)
				return;
			return [target.x, target.y, 0];
		}
		if (vgap.isHyping(ship) && (!maxDist || maxDist != 350)) { //catch recursion
			var hypdist = hitText.prototype.getDistQ(ship.x, ship.y, ship.targetx, ship.targety);
			if (hypdist > 360.05 || hypdist < 339.95)
				return this.getNextLoc(ship, 350);
			else
				return [ship.targetx, ship.targety, hypdist];
		}
		var endX = ship.targetx;
		var endY = ship.targety;
		if (ship.mission == 7) { //intercept
			var interceptTarget = null;
			if (ship.mission1target != 0) {
				interceptTarget = vgap.getShip(ship.mission1target);
				if (interceptTarget.ownerid == vgap.player.id || interceptTarget.allyupdate) { //only ships that can be predicted correctly
					var a = this.getNextLoc(interceptTarget);
					endX = a[0];
					endY = a[1];
				}
			}
		}
		var diffX = endX - curX;
		var diffY = endY - curY;
		if (diffX == 0 && diffY == 0)
			return [curX, curY, 0];
		var totalDist = hitText.prototype.getDistQ(curX, curY, endX, endY);
		var speed = vgap.getSpeed(ship.warp, vgap.getHull(ship.hullid));
		if ((maxDist == null || maxDist > totalDist) && !(vgap.isHyping(ship) && maxDist == 350)) { //enough fuel and not indirecthyping
			if (vgap.isHyping(ship))
				speed = 359.55;
			if (totalDist < speed + 0.5) { //will arrive this turn
				var warpPlanet = vgap.warpWell(endX, endY);
				var hypThreeAway = vgap.isHyping(ship) && ((Math.abs(warpPlanet.x - endX) == 3) || (Math.abs(warpPlanet.y - endY) == 3));
				if (warpPlanet && speed > 1 && !hypThreeAway) {
					endX = warpPlanet.x;
					endY = warpPlanet.y;
				}
				return [endX, endY, totalDist];
			} else
				totalDist = speed; //waypoint is longer than speed
		} else
			totalDist = maxDist; //not enough fuel - experimental!!

		var newX,
		newY;
		if (Math.abs(diffX) > Math.abs(diffY)) {
			var moveX = Math.floor((totalDist * diffX) / Math.sqrt((diffX * diffX) + (diffY * diffY)) + 0.5);
			var moveY = Math.floor(moveX * (diffY / diffX) + 0.5);
			newX = curX + moveX;
			newY = curY + moveY;
		} else {
			var moveY = Math.floor((totalDist * diffY) / Math.sqrt((diffX * diffX) + (diffY * diffY)) + 0.5);
			var moveX = Math.floor(moveY * (diffX / diffY) + 0.5);
			newY = curY + moveY;
			newX = curX + moveX
		}
		var actDist = Math.sqrt((moveX * moveX) + (moveY * moveY)); //actual distance travelled by own engine (for fuel calculation)
		var warpPlanet = vgap.warpWell(newX, newY);
		var hypThreeAway = vgap.isHyping(ship) && ((Math.abs(warpPlanet.x - newX) == 3) || (Math.abs(warpPlanet.y - newY) == 3));
		if (warpPlanet && speed > 1 && !hypThreeAway) {
			newX = warpPlanet.x;
			newY = warpPlanet.y;
		}
		return [newX, newY, actDist];
	};

	vgaPlanets.prototype.warpWell = function (x, y) { // returns planet or false
		for (var i = 0; i < this.planets.length; i++) {
			var planet = this.planets[i];
			if (planet.debrisdisk > 0)
				continue;
			var dist = hitText.prototype.getDistQ(x, y, planet.x, planet.y);
			if (dist <= 3 && dist > 0)
				return planet;
		}
		return false;
	};

	vgaPlanets.prototype.breakTow = function (tower, towee) {
		if (!tower || !towee)
			return;
		var towTarget = vgap.isTowTarget(towee.id)
			if (towTarget == null || tower.id != towTarget.id)
				return true; //2do: what if multiple ships tow? isTowTarget returns only the lowest id ship
			if (vgap.getHull(tower.hullid).engines == 1)
				return true;
			var f1 = ((tower.hullid == 44 || tower.hullid == 45 || tower.hullid == 46) ? 2 : 1);
		var f2 = ((towee.hullid == 44 || towee.hullid == 45 || towee.hullid == 46) ? 2 : 1);
		if (f1 * tower.warp < f2 * tower.warp && hitText.prototype.getDistQ(towee.x, towee.y, towee.targetx, towee.targety) > vgap.getSpeed(towee.warp, towee.hullid) && towee.neutronium >= 25)
			return true;
		return false;
	};

	vgaPlanets.prototype.isChunnelling = function (ship) {
		if ((ship.hullid == 56 || ship.hullid == 1055) && ship.warp == 0 && ship.neutronium >= 50 && ship.mission != 6) {
			if (this.isTowTarget(ship.id) == null) {
				var RegExPattern = /([0-9])([0-9])([0-9])/;
				var matchExpression = ship.friendlycode;
				matchExpression = matchExpression.toString();
				if ((matchExpression.match(RegExPattern)) && (matchExpression != '')) {
					var targetId = parseInt(ship.friendlycode, 10);
					var target = vgap.getShip(targetId);
					if (target != null) {
						if (target.ownerid == ship.ownerid && (target.hullid == 56 || target.hullid == 1054 || (ship.hullid == 1055 && target.hullid == 51)) && target.warp == 0 && target.neutronium >= 1 && target.mission != 6 && hitText.prototype.getDistQ(ship.x, ship.y, target.x, target.y) >= 100 && this.isTowTarget(target.id) == null)
							return true;
					}
				}
			}
		}
		return false;
	};

	// Pediction

	vgaPlanets.prototype.setupAddOn = function (addOnName) {
		if (vgaPlanets.prototype.addOns == null)
			vgaPlanets.prototype.addOns = {};
		vgaPlanets.prototype.addOns[addOnName] = {};
		var settings = localStorage.getItem(addOnName + ".settings");
		if (settings != null)
			vgaPlanets.prototype.addOns[addOnName].settings = JSON.parse(settings);
		else
			vgaPlanets.prototype.addOns[addOnName].settings = {};
		vgaPlanets.prototype.addOns[addOnName].saveSettings = function () {
			localStorage.setItem(addOnName + ".settings", JSON.stringify(vgaPlanets.prototype.addOns[addOnName].settings));
		}
	};
	vgaPlanets.prototype.setupAddOn("vgapHoverPrediction");

	/*
	if (vgaPlanets.prototype.addOns == null) vgaPlanets.prototype.addOns = {};
	vgaPlanets.prototype.addOns.vgapHoverPrediction = {};
	var settings = localStorage.getItem("vgapHoverPrediction.settings");
	if (settings != null)
	vgaPlanets.prototype.addOns.vgapHoverPrediction.settings = JSON.parse(settings);
	else
	vgaPlanets.prototype.addOns.vgapHoverPrediction.settings = {}; //{terseInfo: false};

	vgaPlanets.prototype.addOns.vgapHoverPrediction.saveSettings = function () {
	localStorage.setItem("vgapHoverPrediction.settings", JSON.stringify(vgaPlanets.prototype.addOns.vgapHoverPrediction.settings));
	};
	 */

	var old_hitTextBox = vgapMap.prototype.hitTextBox;
	vgapMap.prototype.hitTextBox = function (hit) {
		// replace completely, pretty sure i want to do this
		// oldHitTextBox.apply(this, arguments);

		var settings = vgap.addOns.vgapHoverPrediction.settings;
		var txt = "";
		var wtx = "";
		var change = 0;
		var html = '';
		if (hit.isPlanet) { //planet
			if (settings.tersePlanet) { // Show new Info
				var predclans = (hit.clans > 0 ? hit.clans : 0);
				var prednativeclans = (hit.nativeclans > 0 ? hit.nativeclans : 0);
				var predsupplies = (hit.supplies > 0 ? hit.supplies : 0);
				var predmegacredits = (hit.megacredits > 0 ? hit.megacredits : 0);
				var predduranium = (hit.duranium > 0 ? hit.duranium : 0);
				var predmolybdenum = (hit.molybdenum > 0 ? hit.molybdenum : 0);
				var predtritanium = (hit.tritanium > 0 ? hit.tritanium : 0);
				var predneutronium = (hit.neutronium > 0 ? hit.neutronium : 0);

				// if (hit.id < 0)	{	hit = vgap.getPlanet(-hit.id); } // For what is that good? Quapla
				// 8 Colomns
				// AAAA | 00000000 | + 0000 | (00000') || BBBB | 00000000 | + 0000 | (00000')
				// Cln: |    23450 | +   21 |   (451') || Avi: |    23450 | +   21 |   (451')

				txt += "<div class='ItemSelectionBox minCorrection'>";
				// txt += "<span>" + hit.id + ": " + hit.name;
				// if (hit.temp != -1)
				//	txt += "<span style='float:right;'>Temp: " + hit.temp + "</span>";
				// txt += "</span>";
				txt += "<table style='table-layout:fixed' class='CleanTable'><colgroup span='8'></colgroup>";
				if (hit.infoturn == 0) { //unknown planet
					// txt += this.hitText(hit, hit.isPlanet).replace("&nbsp", ""); // Later for all Planets
					txt += "<tr><td>" + hit.id + ": unknown</td></tr>";
				} else {
					// if (hit.nativeclans > 0) // Has natives
					// {
					//	txt += "<tr><td colspan=8>" + addCommas(hit.nativeclans * 100) + " " + hit.nativeracename + " - " + hit.nativegovernmentname + "</td></tr>";
					// }
					//txt += "<div class='ItemSelectionBox minCorrection'>";
					//txt += "<table class='CleanTable'>";
					if (hit.ownerid != vgap.player.id)
						wtx = " class='WarnText'";
					else if (hit.readystatus == 0)
						wtx = "";
					else
						wtx = " style='color:#90ee90;'"; // Planet ready, show green?
					txt += "<tr><td" + wtx + ">" + hit.id + ": </td>";
					txt += "<td colspan = '3'" + wtx + ">" + hit.name + "</td>";
					txt += "<td style='text-align:right;'>FC:&nbsp</td><td>" + hit.friendlycode + "</td>";
					if (hit.temp != -1) // Temperature known
					{
						if (hit.temp > 84 || hit.temp < 15)
							wtx = " class='WarnText'";
						else
							wtx = ""; // Planet Hot/Cold?
						txt += "<td style='text-align:right;' colspan='2'" + wtx + ">&nbsp;" + hit.temp + "°</td>";
					}
					txt += "</tr>";
					// txt += "<td>Cln:&nbsp;</td><td>" + hit.clans + "&nbsp;</td><td style='float:right;'>+ " + (minPop == 0 ? "n/a" : minPop) + "+&nbsp;</td><td style='float:right;'>(" + maxPop + ")</td>";
					if (hit.clans > 0)
						wtx = "Clans";
					else
						wtx = "unowned";
					var grows = hitText.prototype.GetPopGrowth(hit);
					var maxcln = hitText.prototype.GetsmaxPop(hit, false); // Old function: hitText.prototype.GetMaxPop(hit);
					var change = hitText.prototype.GetMinPopGrow(hit);
					if (hit.clans < change || hit.clans < 1) // too little clans to grow
						txt += "<tr>" + hitText.prototype.showMin(wtx, hit.clans, "[" + change + "]", maxcln, "");
					else
						txt += "<tr>" + hitText.prototype.showMin(wtx, hit.clans, (grows == 0 ? "n/a" : grows), maxcln, (grows < 0 ? "-" : "+"));
					if (hit.ownerId = vgap.player.id)
						predclans += grows; // Clans added
					else
						predclans = 0;

					if (hit.nativeclans > 0) // Has Natives
					{
						txt += "<td style='text-align:right;'>&nbsp" + addCommas(hit.nativeclans) + "</td>";
						txt += "<td>&nbsp" + hit.nativeracename.substr(0, 5) + "</td>";
						if (hit.ownerid == vgap.player.id) {
							if (hit.nativehappypoints < 40) {
								wtx = "ff0000"; // Red
							} else if (hit.nativehappypoints < 70) {
								wtx = "ffa500"; // Orange
							} else {
								wtx = "90ee90"; // Green
							}
						}
						txt += "<td style='color:#" + wtx + ";'>&nbsp;" + hit.nativehappypoints + "%</td>";
						txt += "<td>&nbsp;" + hit.nativetaxrate + "%</td>";
					}

					txt += "</tr>";

					// if (vgap.player.status == 7 && !hit) {
					// var e = ["None", "Colonization", "Build Starbase", "Supply
					// Starbase", "Exploration", "Build Special", "Attack", "Defend",
					// "Move Fuel"];
					// return "<tr><td colspan='" + a + "' class='WarnText'>" +
					// e[b.goal] + "-" + b.goaltarget + "</td></tr>"
					// }
					var sp = hit.factories;
					var cs = 0;
					var nt = 0;
					var cs10 = 0;
					var nt10 = 0;
					var sps = 0;
					if (hit.nativeclans > 0) {
						if (hit.nativetype == 2) { // bovinoid
							spn = Math.floor(hit.nativeclans / 100);
							sps = hit.clans - spn;
							sp += sps > 0 ? spn : hit.clans;
						}

						nt = hitText.prototype.nativeTaxAmount(hit, hit.nativetaxrate); // Can pay max
						ns = hitText.prototype.nativesupportedtax(hit); // Can get may
						cs = ns - nt; // Won't get because lack of Clans
						nt = Math.min(nt, ns);

						nt10 = hitText.prototype.nativeTaxAmount(hit, 10);
						ns10 = hitText.prototype.nativesupportedtax(hit);
						cs10 = ns10 - nt10;
						nt10 = Math.min(nt10, ns10);
					}

					ct = Math.round(hit.clans * hit.colonisttaxrate / 1000);

					mn = hitText.prototype.miningRate(hit, hit.groundneutronium, hit.densityneutronium, hit.mines);
					md = hitText.prototype.miningRate(hit, hit.groundduranium, hit.densityduranium, hit.mines);
					mm = hitText.prototype.miningRate(hit, hit.groundmolybdenum, hit.densitymolybdenum, hit.mines);
					mt = hitText.prototype.miningRate(hit, hit.groundtritanium, hit.densitytritanium, hit.mines);
    
					var nText = hit.groundneutronium;
					var dText = hit.groundduranium;
					var tText = hit.groundtritanium;
					var mText = hit.groundmolybdenum;
					if (hit.totalneutronium > 0 && hit.groundneutronium < 0) { //"total" info available, surface/ground is not, enables display of dark sense and superspy info in hover text
						nText = hit.totalneutronium;
						dText = hit.totalduranium;
						tText = hit.totaltritanium;
						mText = hit.totalmolybdenum;
					}

					if (hit.groundneutronium > 0) {
						txt += "<tr>" + hitText.prototype.showMin("Neut", hit.neutronium, mn, nText, "+");
						predneutronium += mn;

						txt += "<td style='text-align:right;'>" + addCommas(hit.supplies) + "</td><td>&nbspSupp</td>";
						txt += "<td style='text-align:right;'>&nbsp+&nbsp" + sp;
						if (sps < 0)
							txt += "</td><td class='val' style='color:#f00;'>-" + (-sps);
						txt += "</td></tr>";
						predsupplies += sp;

						txt += "<tr>" + hitText.prototype.showMin("Dura", hit.duranium, md, dText, "+");
						predduranium += md;

						txt += "<td style='text-align:right;'>" + addCommas(hit.megacredits) + "</td>";
						txt += "<td style='text-align:center;'>MC</td><td style='text-align:right;'>&nbsp+&nbsp" + (nt + ct);
						if (cs < 0)
							txt += "</td><td class='val' style='color:#f00;'>-" + (-cs);
						txt += "</td></tr>";
						predmegacredits += (nt + ct);

						txt += "<tr>" + hitText.prototype.showMin("Trit", hit.tritanium, mt, tText, "+");
						predtritanium += mt;

						txt += "<td style='text-align:right;'>" + addCommas(hit.megacredits + hit.supplies) + "</td>";
						txt += "<td style='text-align:center;'>$</td>";
						txt += "<td style='text-align:right;'>&nbsp+&nbsp" + (nt + ct + sp);
						txt += "</td></tr>";
						/* Not used					if (hit.nativeclans > 0){
						txt += "<td>&nbsp;10%:</td><td>&nbsp;</td><td>" + nt10 + "-&nbsp;";
						if (cs10 < 0)
						txt += "</td><td  class='WarnText'>" + (-cs10);
						} */
						txt += "<tr>" + hitText.prototype.showMin("Moly", hit.molybdenum, mm, mText, "+");
						predmolybdenum += mm;

						txt += "<td>&nbsp&nbspM.&nbspF.&nbspD.</td><td style='text-align:right;'>&nbsp" + hit.mines + "</td><td style='text-align:right;'>|&nbsp" + hit.factories + "</td><td style='text-align:right;'>&nbsp|&nbsp" + hit.defense + "</td></tr>";

						var sb = vgap.getStarbase(hit.id);
						if (sb != null && (hit.ownerid == vgap.player.id || vgap.fullallied(hit.ownerid))) {
							if (sb.starbasetype != 2) {
								if (sb.isbuilding) {
									txt += "<tr><td colspan='8'>Build:&nbsp;" + vgap.getHull(sb.buildhullid).name + "</td></tr>";
								} else {
									txt += "<tr><td colspan='8' class='WarnText'>Starbase is not building</td></tr>";
								}
							}
							/// Add tech levels for SB
							txt += "<tr><td colspan='2'>Defense: " + sb.defense + "</td><td colspan='2'>Fighters: " + sb.fighters + "</td>";
							txt += "<td colspan='4'>Tech: H-" + sb.hulltechlevel + " E-" + sb.enginetechlevel + " B-" + sb.beamtechlevel;
							txt += " T-" + sb.torptechlevel + "</td></tr>";
						} else {
							if (hit.duranium > 119 && hit.tritanium > 401 && hit.molybdenum > 339 && (hit.megacredits + hit.supplies) > 899)
								txt += "<tr><td colspan='8' style='color:#0f0;'>Can build Starbase</td></tr>";
						}
					}
					//known enemy planet
					if (hit.ownerid != vgap.player.id && hit.ownerid != 0) {
						var player = vgap.getPlayer(hit.ownerid);
						var race = vgap.getRace(player.raceid);
						txt += "<tr><td colspan='8' class='WarnText'>" + race.name + " (" + player.username + ")</td></tr>";
					}
					// txt += this.hitText(hit, hit.isPlanet).replace("&nbsp", "");
				} // End of known Planets
				wtx = this.hitText(hit, hit.isPlanet).replace("'4'", "'8'");
				txt += wtx.replace("&nbsp", "");
				txt += "</table></div>";

				var change = 0;
				if (settings.showShips) { // Show new Info
					var dist;
					html = "";
					for (var i = 0; i < vgap.myships.length; i++) {
						var ship = vgap.myships[i];
						hitText.prototype.predictor(ship); // Get next Ressorces
						var hull = vgap.getHull(ship.hullid);
						// var dest = vgap.getDest(ship);
						dist = Math.dist(hit.x, hit.y, hitText.prototype.prediction.x, hitText.prototype.prediction.y);
						if (dist <= 3 && dist >= 0) {
							change += 1;
							html += "<tr><td>" + ship.id + ":</td>";
							html += "<td colspan='4'>" + ship.name.substr(0, 15) + "&nbsp(" + hitText.prototype.shortHullName(hull) + ")</td>";
							html += "<td colspan='3'>" + "E-" + ship.engineid;
							if (ship.beams > 0) // Has Beams?
								html += "&nbsp" + "B-" + ship.beamid;
							if (ship.torps > 0) // Has Launchers?
								html += "&nbsp" + "T-" + ship.torpedoid + ":";
							if (ship.bays > 0) // Has Fighter-Bays?
								html += "&nbspF-" + ":";
							if (ship.bays > 0 || ship.torps > 0)
								html += "&nbsp" + ship.ammo + "</td></tr>";
							predclans += ship.clans;
							predsupplies += ship.supplies + hitText.prototype.prediction.supplies;
							predmegacredits += ship.megacredits + hitText.prototype.prediction.megacredits;
							predduranium += ship.duranium + hitText.prototype.prediction.duranium;
							predmolybdenum += ship.molybdenum + hitText.prototype.prediction.molybdenum;
							predtritanium += ship.tritanium + hitText.prototype.prediction.tritanium;
							predneutronium += ship.neutronium + hitText.prototype.prediction.neutronium;
							// more to come here

						}
					}
					if (change > 0) {
						txt += "<div class='ItemSelectionBox minCorrection'>";
						txt += "<table class='CleanTable' style='width: 100%'><colgroup span='8'></colgroup>"; // New Table
						txt += "<tr><td colspan='8'>" + change + " ships here at next turn:</td></tr>";
						txt += html;
						txt += "</table></div>";
					} // else no ships here no show
				} // else nothing

				if (settings.showRessources) { // Show next Ressources
					html = "<div class='ItemSelectionBox minCorrection'>";
					html += "<table class='CleanTable' style='width: 100%'><colgroup span='8'></colgroup>"; // New Table
					html += "<tr><td colspan='8'>Ressources here at next turn:</td></tr>";
					html += "<tr><td>&nbsp&nbspCln:</td><td style='text-align:right;'>" + addCommas(predclans) + "</td>";
					if (prednativeclans > 0) {
						html += "<td>&nbsp&nbsp" + hit.nativeracename.substr(0, 3) + ":</td><td style='text-align:right;'>" + addCommas(prednativeclans) + "</td>";
					} else {
						html += "<td colspan='2'>&nbsp</td>";
					}
					html += "<td>&nbsp&nbspSup:</td><td style='text-align:right;'>" + addCommas(predsupplies) + "</td>";
					html += "<td>&nbsp&nbsp&nbspMC:</td><td style='text-align:right;'>" + addCommas(predmegacredits) + "</td></tr>";
					html += "<tr><td>&nbsp&nbspNeu:</td><td style='text-align:right;'>" + addCommas(predneutronium) + "</td>";
					html += "<td>&nbsp&nbspDur:</td><td style='text-align:right;'>" + addCommas(predduranium) + "</td>";
					html += "<td>&nbsp&nbspTri:</td><td style='text-align:right;'>" + addCommas(predtritanium) + "</td>";
					html += "<td>&nbsp&nbspMol:</td><td style='text-align:right;'>" + addCommas(predmolybdenum) + "</td>";
					html += "</table></div>";
					txt += html;
				} // else nothing

				// Show known Enemy Ships at X/Y
				var efound = false;
				if (vgap.plugins["enemyShipListPlugin"]) { // Plugin Loaded - find that Ship in List...
					var eship;
					var ship;
					var wtx = "";
					//see if the ship exist in the list
					for (var j = 0; j < vgap.plugins["enemyShipListPlugin"].enemyShipList.length; j++) {
						eship = vgap.plugins["enemyShipListPlugin"].enemyShipList[j];
						if (eship.x == hit.x && eship.y == hit.y && eship.ownerid != (vgap.player.id || vgap.fullallied(eship.ownerid))) { // Enemy Ship at position
							efound = true;
							var eplayer = vgap.getPlayer(eship.ownerid);
							var hull = vgap.getHull(eship.hullid);
							var race = vgap.getRace(eplayer.raceid);
							if (settings.terseShip) {
								wtx += "<tr><td colspan='5' class='WarnText'>" + eship.id + ": " + eship.name.substr(0, 10) + "&nbsp(" + race.name + "'s " + hitText.prototype.shortHullName(hull) + ")</td>";
								if (vgap.game.turn <= eship.infoturn) { //ignore info from future turns in case of history
									wtx += "<td colspan='3'>" + "&nbspE-" + eship.engineid;
									if (eship.beams > 0) // Has Beams?
										wtx += "&nbsp" + "B-" + eship.beamid;
									if (eship.torps > 0) // Has Launchers?
										wtx += "&nbsp" + "T-" + eship.torpedoid + ":";
									if (hull.fighterbays > 0) // Has Fighter-Bays?
										wtx += "&nbspF-" + hull.fighterbays + ":";
									if (hull.fighterbays > 0 || eship.torps > 0)
										wtx += "&nbsp" + eship.ammo;
								} else
									wtx += "<td colspan='3'>Old info from turn: " + eship.infoturn + "</td>";
								wtx += "</td></tr>";
								wtx += "<tr><td>Heading:</td><td>&nbsp;" + gsv(eship.heading);
								wtx += "</td><td>&nbsp;at Warp:</td><td>&nbsp;" + gsv(eship.warp);
								wtx += "</td><td>&nbsp;Mass:</td><td>&nbsp;" + gsv(eship.mass);

								var cargo = eship.mass - hull.mass;

								var weappon = 0;
								if (eship.beams > 0) {
									var beam = vgap.getBeam(eship.beamid);
									weappon += beam.mass * eship.beams;
								}
								if (eship.torps > 0) {
									var torp = vgap.getTorpedo(eship.torpedoid);
									weappon += torp.mass * eship.torps;
								}
								var wwtx = "";
								if (weappon > 0)
									if (cargo < weappon)
										wwtx = "0-";
									else
										wwtx = (cargo - weappon) + "-";
								wwtx += cargo;
								wtx += "</td><td colspan='2'>&nbsp;(" + wwtx + ")</td></tr>";
							} else {
								wtx += "<tr><td colspan='2' class='BadText'>" + eship.id + ": " + eship.name + "</td></tr>";
								wtx += "<tr><td colspan='2' class='BadText'>" + hull.name + "</td></tr>";
								wtx += "<tr><td>Heading:</td><td>&nbsp;" + gsv(eship.heading) + " at Warp: " + gsv(eship.warp) + "</td></tr>";
								wtx += "<tr><td>Mass: </td><td>&nbsp;" + gsv(eship.mass) + "</td></tr>";
								wtx += "<tr><td colspan='2'>" + race.name + " (" + player.username + ")" + "</td></tr>";
								//wtx += "<tr><td>Neutronium:</td><td>?/" + hull.fueltank + " </td><td>&nbsp;Total Cargo:</td><td>?/" + hull.cargo + "</td></tr>";
							}
						}
					}
					if (efound) {
						html = "<div class='ItemSelectionBox minCorrection'>";
						html += "<table class='CleanTable' style='width: 100%'><colgroup span='8'></colgroup>";
						html += "<td colspan='8'>Known enemy ships here:</td>"
						html += wtx;
						html += "</table></div>";
						txt += html;
					}
				} // 4 Tabs End if vgap.plugins
			} else { // Call original function...
				var txt = old_hitTextBox.apply(this, arguments);
			}
		} // End of Planets 2 Tabs
		else { //ships
			if (settings.terseShip) {
				var wtx = "";
				var ship = hit;
				var hull = vgap.getHull(ship.hullid);
				var totalCargo = ship.ammo + ship.duranium + ship.tritanium + ship.molybdenum + ship.supplies + ship.clans;
				if (ship.ownerid == vgap.player.id || vgap.fullallied(ship.ownerid)) {
					html = "<div class='ItemSelectionBox minCorrection'>";
					var player = vgap.getPlayer(ship.ownerid);
					var race = vgap.getRace(player.raceid);
					html += "<table class='CleanTable' style='width: 100%'>"; // New Table
					if (hit.readystatus == 0) // Why check this? hit.ownerid == vgap.player.id
						wtx = "";
					else
						wtx = " style='color:#90ee90;'"; // Ship ready, show green?
					if ((settings.showHullForAllies && vgap.fullallied(ship.ownerid)) || (settings.showHullForMine && ship.ownerid == vgap.player.id)) {
						html += "<tr><td colspan='5'" + wtx + ">" + ship.id + ": " + ship.name.substr(0, 15) + "&nbsp(" + hitText.prototype.shortHullName(hull) + ")</td>";
						html += "<td colspan='3'>" + "&nbspE-" + ship.engineid;
						if (ship.beams > 0) // Has Beams?
							html += "&nbsp" + "B-" + ship.beamid;
						if (ship.torps > 0) // Has Launchers?
							html += "&nbsp" + "T-" + ship.torpedoid + ":";
						if (ship.bays > 0) // Has Fighter-Bays?
							html += "&nbspF-" + ":";
						if (ship.bays > 0 || ship.torps > 0)
							html += "&nbsp" + ship.ammo;
					} else
						html += "<tr><td colspan='8'" + wtx + ">" + ship.id + ": " + ship.name;
					html += "</td></tr>";
					if (!settings.veryterseship) {
						html += "<tr><td>Neu:</td><td>&nbsp;" + gsv(ship.neutronium) + " / " + hull.fueltank + " </td><td>&nbsp;&nbsp;&nbsp;Dur:</td><td>&nbsp;" + gsv(ship.duranium) + "</td><td>&nbsp;&nbsp;&nbsp;Tri:</td><td>&nbsp;" + gsv(ship.tritanium) + "</td><td>&nbsp;&nbsp;&nbsp;Mol:</td><td>&nbsp;" + gsv(ship.molybdenum) + "</td></tr>";
						html += "<tr><td>MC:</td><td>&nbsp;" + gsv(ship.megacredits) + "</td><td>&nbsp;&nbsp;&nbspCln:</td><td>&nbsp;" + gsv(ship.clans) + "</td><td>&nbsp;&nbsp;&nbspSup:</td><td>&nbsp;" + gsv(ship.supplies) + "</td>";
						if (ship.torps > 0 || ship.bays > 0) {
							var ammoText = "&nbsp&nbsp&nbsp;Ftr";
							if (ship.torps > 0)
								ammoText = "&nbsp&nbsp&nbsp;Tor";
							html += "<td>" + ammoText + ":</td><td>&nbsp;" + gsv(ship.ammo) + "</td></tr>";
						}
					} else { // Very Terse
						html += "<tr><td>N:&nbsp;" + gsv(ship.neutronium) + "</td><td>&nbsp;D:&nbsp;" + gsv(ship.duranium) + "</td><td>&nbsp;T:&nbsp;" + gsv(ship.tritanium) + "</td><td>&nbsp;M:&nbsp;" + gsv(ship.molybdenum) + "</td>";
						html += "<td>$:&nbsp;" + gsv(ship.megacredits) + "</td><td>&nbspC:&nbsp;" + gsv(ship.clans) + "</td><td>&nbspS:&nbsp;" + gsv(ship.supplies) + "</td>";
						if (ship.torps > 0 || ship.bays > 0) {
							var ammoText = "<td>&nbsp;F:&nbsp";
							if (ship.torps > 0)
								ammoText = "<td>&nbsp;T:&nbsp";
							html += ammoText + gsv(ship.ammo) + "</td></tr>";
						}
					}
					if (ship.ownerid == vgap.player.id || ship.allyupdate) {
						html += "<tr>";
						if (settings.showShipMission)
							html += "<td colspan='2'>" + vgap.getShipMission(ship) + ((ship.mission == 6 || ship.mission == 7) && ship.mission1target > 0 ? " " + ship.mission1target : "") + "</td>";
						else
							html += "<td/><td/>";
						if (ship.damage > 0)
							html += "<td>&nbsp;&nbsp;&nbsp;Dmg:</td><td class='BadText'>&nbsp;" + ship.damage + "%</td>";
						else if (ship.iscloaked)
							html += "<td colspan='2' class='GoodText'>&nbsp;&nbsp;&nbsp;Cloaked</td>";
						else
							html += "<td/><td/>";
						html += "<td colspan='2'>&nbsp;&nbsp;&nbsp;Warp " + ship.warp + "</td>"
						html += "<td>&nbsp;&nbsp;&nbsp;FC:</td><td>&nbsp;" + ship.friendlycode + "</td></tr>";
					}
					if (settings.showPlayerForAllies && vgap.fullallied(ship.ownerid)) {
						html += "<tr><td colspan='8'>" + race.name + " (" + player.username + ")" + "</td></tr>";
					}
					html += this.hitText(hit, hit.isPlanet).replace("&nbsp", "");
					html += "</table></div>";
				} else { //enemy
					if (vgap.plugins["enemyShipListPlugin"] && (vgap.planetAt(hit.x, hit.y))) { // Plugin Loaded & no Planet - find that Ship in List...
					}
					// Nothing to do - ships already shown
					else {
						html = "<div class='ItemSelectionBox minCorrection'>";
						var player = vgap.getPlayer(ship.ownerid);
						var hull = vgap.getHull(ship.hullid);
						var race = vgap.getRace(player.raceid);
						var efound = false;
						if (vgap.plugins["enemyShipListPlugin"]) { // Plugin Loaded & no Planet - find that Ship in List...
							var eship = "";
							//see if the ship exist in the list
							for (var j = 0; j < vgap.plugins["enemyShipListPlugin"].enemyShipList.length; j++) {
								eship = vgap.plugins["enemyShipListPlugin"].enemyShipList[j];
								if (eship.id == ship.id) { // Ship in List!
									//console.log("Ship in List: ID:-"+" j:"+j+" Ship-ID:"+ship.id+" eship-ID:"+eship.id+" Beams:"+eship.beams+" ID:"+eship.beamid);
									//ship = vgap.plugins["enemyShipListPlugin"].enemyShipList[j];
									efound = true;
									break;
								}
							}
							//}
						}
						// class='enemyShipStyle'
						html += "<table class='CleanTable' style='width: 100%'><colgroup span='8'></colgroup>";
						if (settings.terseShip) {
							html += "<tr><td colspan='5' class='WarnText'>" + ship.id + ": " + ship.name.substr(0, 10) + "&nbsp(" + race.name + "'s " + hitText.prototype.shortHullName(hull) + ")</td>";
							if (efound) {
								if (vgap.game.turn <= eship.infoturn) { //ignore info from future turns in case of history

									html += "<td colspan='3'>" + "&nbspE-" + eship.engineid;
									if (eship.beams > 0) // Has Beams?
										html += "&nbsp" + "B-" + eship.beamid;
									if (eship.torps > 0) // Has Launchers?
										html += "&nbsp" + "T-" + eship.torpedoid + ":";
									if (hull.fighterbays > 0) // Has Fighter-Bays?
										html += "&nbspF-" + hull.fighterbays + ":";
									if (hull.fighterbays > 0 || eship.torps > 0)
										html += "&nbsp" + eship.ammo;
								} else
									html += "<td colspan='3'>Old info from turn: " + eship.infoturn + "</td>";
							}
							html += "</td></tr>";
							html += "<tr><td>Heading:</td><td>&nbsp;" + gsv(ship.heading);
							html += "</td><td>&nbsp;at Warp:</td><td>&nbsp;" + gsv(ship.warp);
							html += "</td><td>&nbsp;Mass:</td><td>&nbsp;" + gsv(ship.mass);
							var cargo = ship.mass - hull.mass;
							if (efound) {
								var weappon = 0;
								if (eship.beams > 0) {
									var beam = vgap.getBeam(eship.beamid);
									weappon += beam.mass * eship.beams;
								}
								if (eship.torps > 0) {
									var torp = vgap.getTorpedo(eship.torpedoid);
									weappon += torp.mass * eship.torps;
								}
								var wtx = "";
								if (weappon > 0)
									if (cargo < weappon)
										wtx = "0-";
									else
										wtx = (cargo - weappon) + "-";
							}
							wtx += cargo;
							html += "</td><td colspan='2'>&nbsp;(" + wtx + ")</td></tr>";
						} else {
							html += "<tr><td colspan='2' class='BadText'>" + ship.id + ": " + ship.name + "</td></tr>";
							html += "<tr><td colspan='2' class='BadText'>" + hull.name + "</td></tr>";
							html += "<tr><td>Heading:</td><td>&nbsp;" + gsv(ship.heading) + " at Warp: " + gsv(ship.warp) + "</td></tr>";
							html += "<tr><td>Mass: </td><td>&nbsp;" + gsv(ship.mass) + "</td></tr>";
							html += "<tr><td colspan='2'>" + race.name + " (" + player.username + ")" + "</td></tr>";
							//html += "<tr><td>Neutronium:</td><td>?/" + hull.fueltank + " </td><td>&nbsp;Total Cargo:</td><td>?/" + hull.cargo + "</td></tr>";
						}
						html += this.hitText(hit, hit.isPlanet).replace("&nbsp", "");
						html += "</table></div>";
					}
				}
				txt = html;
			} else { // Use original ship...
				var txt = old_hitTextBox.apply(this, arguments);
			}
		}
		return txt;
	};

	vgaPlanets.prototype.shipTransferView = function (ship, onclick) {
		var hull = vgap.getHull(ship.hullid);
		var totalCargo = ship.ammo + ship.duranium + ship.tritanium + ship.molybdenum + ship.supplies + ship.clans;
		var html = "<div class='ItemSelection' onclick='" + onclick + "'>";
		html += "<img src='" + hullImg(ship.hullid) + "'/>";
		if (ship.ownerid == vgap.player.id || vgap.fullallied(ship.ownerid)) {
			html += "<div  " + (vgap.fullallied(ship.ownerid) ? "class='AllyText'" : "") + ">";
			if (ship.ownerid != vgap.player.id)
				html += vgap.raceName(ship.ownerid);
			html += "<span>" + ship.id + ": " + ship.name + "</span>";
			html += "<table class='CleanTable'>";
			html += "<tr><td>Neutronium:</td><td>" + gsv(ship.neutronium) + "/" + hull.fueltank + " </td><td>Total Cargo:</td><td>" + gsv(totalCargo) + "/" + hull.cargo + "</td></tr>";
			html += "<tr><td>Duranium:</td><td>" + gsv(ship.duranium) + "</td><td>Supplies:</td><td>" + gsv(ship.supplies) + "</td></tr>";
			html += "<tr><td>Tritanium:</td><td>" + gsv(ship.tritanium) + "</td><td>Megacredits:</td><td>" + gsv(ship.megacredits) + "</td></tr>";
			html += "<tr><td>Molybdenum:</td><td>" + gsv(ship.molybdenum) + "</td><td>Clans:</td><td>" + gsv(ship.clans) + "</td></tr>";
			if (ship.torps > 0 || ship.bays > 0) {
				var ammoText = "Fighters";
				if (ship.torps > 0)
					ammoText = "Torpedos";
				html += "<tr><td>" + ammoText + ":</td><td>" + gsv(ship.ammo) + "</td></tr>";
			} else
				html += "<tr><td/><td/></tr>";
			html += "</table></div>";
		} else {
			html += "<span class='BadText'>" + ship.id + ": " + ship.name + "</span>";
			html += "<div class='BadText'>" + vgap.raceName(ship.ownerid);
			html += "<table class='CleanTable'>";
			html += "<tr><td>Neutronium:</td><td>?/" + hull.fueltank + " </td><td>Total Cargo:</td><td>?/" + hull.cargo + "</td></tr>";
			html += "</table></div>";
		}
		html += "</div>";

		// vgap.action added for the assistant (Alex):
		// vgap.action();

		return html;
	};

	vgaPlanets.prototype.shipFullInfoView = function (ship, onclick) {
		var view = this.shipTransferView(ship, onclick);
		var html = ""; //"<table class='CleanTable'>";
		//html += "<tr>";
		html += "<td>Friendly Code:</td><td>" + ship.friendlycode + "</td></tr>";
		html += "<tr><td colspan='2'>Warp " + ship.warp + "</td>"
		html += "<td colspan='2'>" + vgap.getShipMission(ship) + ((ship.mission == 6 || ship.mission == 7) && ship.mission1target > 0 ? " " + ship.mission1target : "") + "</td></tr>";
		html += "<tr>";
		if (ship.damage > 0)
			html += "<td>Damage:</td><td class='BadText'>" + ship.damage + "</td>";
		else if (ship.iscloaked)
			html += "<td colspan='2' class='GoodText'>Cloaked</td>";
		else
			html += "<td/><td/>";
		html += "</tr></table>";
		//html += "</table>"

		// vgap.action added for the assistant (Alex):
		// vgap.action();

		view = view.split("</tr></table>").join(html);
		return view;

	};

	vgaPlanets.prototype.showHover = function (shipId) {
		var ship = vgap.getShip(shipId);
		var newheight = 100;
		if (ship.ownerid == vgap.player.id || ship.allyupdate) {
			this.hc.html(this.shipFullInfoView(ship, ""));
			newheight = 120;
			if (ship.allyupdate)
				newheight += 10;
		} else if (vgap.fullallied(ship.ownerid)) {
			this.hc.html(this.shipTransferView(ship, ""));
			newheight = 110
		} else
			this.hc.html(this.shipScan(ship, "")); //Quapla check
		this.hc.show();
		this.hc.height(newheight);

		// vgap.action added for the assistant (Alex):
		//   vgap.action();

	};
	//*/

	vgaPlanets.prototype.getShipMission = function (ship) {
		var missions = new Array();
		var mdesc = new Array();
		var raceid = vgap.getPlayer(ship.ownerid).raceid;
		missions.push("Exploration");
		mdesc.push("Return information about planets you visit.");
		missions.push("Mine Sweep");
		mdesc.push("Sweep or detect enemy minefields.");
		if (ship.torps > 0) {
			missions.push("Lay Mines");
			mdesc.push("Convert your torpedos to deep space mines.");
		} else {
			missions.push("");
			mdesc.push("");
		}
		missions.push("Kill!!");
		mdesc.push("Attack any enemy ship or planet you encounter.");
		if (ship.hullid == 84 || ship.hullid == 96 || ship.hullid == 9) {
			missions.push("Bio Scan");
			mdesc.push("Search for native life on nearby planets.");
		} else {
			missions.push("Sensor Sweep");
			mdesc.push("Search for enemy colonies on nearby planets.");
		}
		missions.push("Land and Disassemble");
		mdesc.push("Dismantle this ship on an owned or unowned planet.");
		//if (ships.length > 1 && this.hull.engines > 1) {
		missions.push("Try to Tow");
		mdesc.push("Try to tow another ship at this location.");
		/*
		}
		else {
		missions.push("");
		mdesc.push("");
		}
		 */
		missions.push("Try to Intercept");
		mdesc.push("Try to intercept the ship you have selected.");
		if (raceid == 1) {
			missions.push("Super Refit");
			mdesc.push("Upgrade this ship to the best available parts. Must be at a starbase to work.");
		} else if (raceid == 2) {
			if (ship.beams > 0) {
				missions.push("Hisssss!");
				mdesc.push("Increase the happiness on the planet you orbit.");
			} else {
				missions.push("");
				mdesc.push("");
			}
		} else if (raceid == 3) {
			missions.push("Super Spy");
			mdesc.push("Spy on an enemy planet for info or to change its friendly code.");
		} else if (raceid == 4) {
			if (ship.beams > 0) {
				missions.push("Pillage Planet");
				mdesc.push("Pillage a planet for supplies and money.");
			} else {
				missions.push("");
				mdesc.push("");
			}
		} else if (raceid == 5) {
			missions.push("Rob Ship");
			mdesc.push("Rob an enemy ship of its fuel or cargo.");
		} else if (raceid == 6) {
			missions.push("Self Repair");
			mdesc.push("Repair this ship by 10% / turn.");
		} else if (raceid == 7) {
			if (ship.torps > 0) {
				missions.push("Lay Web Mines");
				mdesc.push("Convert your torpedos to special fuel sucking mines.");
			} else {
				missions.push("");
				mdesc.push("");
			}
		} else if (raceid == 8) {
			missions.push("Dark Sense");
			mdesc.push("Sense enemy colonies and starbases on nearby planets.");
		} else if (raceid == 9 || raceid == 11) {
			if (ship.bays > 0) {
				missions.push("Build Fighters");
				mdesc.push("Build fighters on your ship for 3 tritanium, 2 molybdenum and 5 supplies each.");
			} else {
				missions.push("");
				mdesc.push("");
			}
		} else if (raceid == 10) {
			missions.push("Rebel Ground Attack");
			mdesc.push("Sabotage the planet to destroy buildings and kill colonists.");
		}

		if (vgap.getHull(ship.hullid).cancloak) {
			missions.push("Cloak");
			mdesc.push("Make this ship invisible to enemies.");
		} else {
			missions.push("");
			mdesc.push("");
		}
		/*
		if (this.planet != null) {
		missions.push("Beam up Neutronium Fuel from " + this.planet.name);
		mdesc.push("");
		missions.push("Beam up Duranium from " + this.planet.name);
		mdesc.push("");
		missions.push("Beam up Tritanium from " + this.planet.name);
		mdesc.push("");
		missions.push("Beam up Molybdenum from " + this.planet.name);
		mdesc.push("");
		missions.push("Beam up Supplies from " + this.planet.name);
		mdesc.push("");
		} else {
		 */
		missions.push("Beam up Fuel");
		mdesc.push("");
		missions.push("Beam up Duranium");
		mdesc.push("");
		missions.push("Beam up Tritanium");
		mdesc.push("");
		missions.push("Beam up Molybdenum");
		mdesc.push("");
		missions.push("Beam up Supplies");
		mdesc.push("");
		//}
		return missions[ship.mission];
	};

	var old_showSettings = vgapDashboard.prototype.showSettings;
	vgapDashboard.prototype.showSettings = function () {

		old_showSettings.apply(this, arguments);

		var settings = vgaPlanets.prototype.addOns.vgapHoverPrediction.settings;

		var html = "";
		html += "<div id='vgapHoverPredictionSettings'><table>";
		html += "<tr><th colspan='4'>Add-On Settings: Quapla's Hover Prediction</th></tr>";
		html += "<tr>";
		html += "<td>Use terse planet prediction</td><td><input type='checkbox'" + (settings.tersePlanet ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.tersePlanet = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.tersePlanet; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "<td>Use terse ship prediction</td><td><input type='checkbox'" + (settings.terseShip ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.terseShip = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.terseShip; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "<td>Use very terse ship prediction</td><td><input type='checkbox'" + (settings.veryterseship ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.veryterseship = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.veryterseship; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "</tr><tr>";
		html += "<td>Show next ship prediction</td><td><input type='checkbox'" + (settings.showShips ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showShips = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showShips; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "<td>Show next Ressources prediction</td><td><input type='checkbox'" + (settings.showRessources ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showRessources = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showRessources; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "</tr><tr>";
		html += "<td>Show player for allied ships</td><td><input type='checkbox'" + (settings.showPlayerForAllies ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showPlayerForAllies = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showPlayerForAllies; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "<td>Show hull type for allied ships</td><td><input type='checkbox'" + (settings.showHullForAllies ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showHullForAllies = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showHullForAllies; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "</tr><tr>";
		html += "<td>Show hull type for my ships</td><td><input type='checkbox'" + (settings.showHullForMine ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showHullForMine = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showHullForMine; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "<td>Show mission for ships</td><td><input type='checkbox'" + (settings.showShipMission ? "checked='true'" : "") + "onChange='vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showShipMission = !vgaPlanets.prototype.addOns.vgapHoverPrediction.settings.showShipMission; vgap.addOns.vgapHoverPrediction.saveSettings();'/></td>";
		html += "</tr>";
		html += "</table></div>";

		$("#HoverSettings").after(html);
		this.pane.jScrollPane();

	};
	/* //REPLACED MAP TOOL WITH PERSISTENT SETTING
	var old_loadControls = vgapMap.prototype.loadControls;
	vgapMap.prototype.loadControls = function () {

	old_loadControls.apply(this, arguments);

	var additem = "<li onclick='vgap.addOns.vgapHoverPrediction.settings.terseInfo = !vgap.addOns.vgapHoverPrediction.settings.terseInfo;'>Switch Info View</li>";

	//$("#MapTools").append(additem);
	$("#MapTools > li:contains('Connections (q)')").after(additem);

	var height = this.controls.height() - this.toolsMenu.height();
	this.controls.css("marginTop", "-" + this.controls.height() + "px");

	};
	 */

}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
