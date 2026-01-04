// ==UserScript==
// @name          Planets.nu - Clone Checker Plugin
// @description   Clone Checker Plugin
// @version       1.0
// @date          2018-11-2
// @author        robodoc
// @license       Creative Commons Attribution 4.0 (CC BY 4.0)
// @include       http://*.planets.nu/*
// @include       https://*.planets.nu/*
// @include       http://planets.nu/*
// @include       https://planets.nu/*
// @history       1.0  (2018)

// @namespace https://greasyfork.org/users/5275
// @downloadURL https://update.greasyfork.org/scripts/373894/Planetsnu%20-%20Clone%20Checker%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/373894/Planetsnu%20-%20Clone%20Checker%20Plugin.meta.js
// ==/UserScript==

/*
Changelog:
pre-1.0.0 (part of the PLSCheck plugin)
1.0.0    [2018-11-2] First release as a stand-alone plugin
*/

function wrapper () { // wrapper for injection
    
	if (vgap.version < 3.0) {
		console.log("Clone Checker Plugin requires at least NU version 3.0. Plugin disabled." );
		return;	
	}
	// Global variables
	var plugin_version = "1.0.0";
	console.log("Clone Checker plugin version: v" + plugin_version );
	
	var displayCloneCheckicon = true; // set to "false" if you don't want this in your menu
	
	var cloneCheckPlugin = {
			
		processload: function() {
			//console.log("ProcessLoad: plsCheckPlugin plugin called.");
			
			// The following code adapted from Kedalion's Enemy ship list plugin:
			vgap.plugins["cloneCheckPlugin"].mobile_version = vgap.plugins["cloneCheckPlugin"].checkIfMobileVersion();

			//console.log("END PROCESS LOAD");
		},	
		
			
		loaddashboard: function() {
			//console.log("LoadDashboard: plsCheckPlugin plugin called.");
			
			// Add CloneCheck link
			var menu = document.getElementById("DashboardMenu").childNodes[2]; //insert in middle
			if (displayCloneCheckicon) $("<li style=\"color:#FFF000\">Clone Check »</li>").tclick(function () { vgap.plugins["cloneCheckPlugin"].displayCC(1); }).appendTo(menu);
			
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
			//console.log("ShowSummary: plsCheckPlugin plugin called.");
			
			//insert Icon for PLSCheck on Home Screen
			//var summary_list = document.getElementById("TurnSummary").childNodes[0];
			//var planets_entry = summary_list.children[2];
			
			// The following code adapted from Kedalion's Enemy ship list plugin:
			var node;
			if (vgap.plugins["cloneCheckPlugin"].mobile_version) {
			  // console.log("ShowSummary for mobile ");
			  var summary_list = document.getElementById("TurnSummary");
			  node = document.createElement("span");
			}
			else {
			  // console.log("ShowSummary for non-mobile");
			  var summary_list = document.getElementById("TurnSummary").childNodes[0];
			  node = document.createElement("li");
			}

			if (displayCloneCheckicon) {
				//var node2 = document.createElement("li");
				node.setAttribute("style", "color:#FFF000");
				// alternate icon http://play.planets.nu/img/races/9.png
				// node2.innerHTML = "<div class=\"iconholder\"><img src=\"http://play.planets.nu/img/icons/blacksquares/ships.png\"/></div>" + "Clone Check";
				node.innerHTML = "<div class=\"iconholder\"><img src=\"https://planets.nu/img/icons/blacksquares/ships.png\"/></div>" + "Clone Check";
				node.onclick = function() {vgap.plugins["cloneCheckPlugin"].displayCC(1);};
				//summary_list.insertBefore(node, planets_entry);
				
				var starbase_entry = summary_list.children[4];
				summary_list.insertBefore(node, starbase_entry);
			}
			
		},
		
		/*
		 * loadmap: executed after the first turn has been loaded to create the map
		 * as far as I can tell not executed again when using time machine
		 */
		loadmap: function() {
			//console.log("LoadMap: plsCheckPlugin plugin called.");
		},
		
		/*
		 * showmap: executed when switching from dashboard to starmap
		 */
		showmap: function() {
			//console.log("ShowMap: plsCheckPlugin plugin called.");
		},
		
		/*
		 * draw: executed on any click or drag on the starmap
		 */			
		draw: function() {
			//console.log("Draw: plsCheckPlugin plugin called.");
		},		
		
		/*
		 * loadplanet: executed a planet is selected on dashboard or starmap
		 */
		loadplanet: function() {
			//console.log("LoadPlanet: plsCheckPlugin plugin called.");
			
		},
		
		/*
		 * loadstarbase: executed a starbase is selected on dashboard or starmap
		 */
		loadstarbase: function() {
			//console.log("LoadStarbase: plsCheckPlugin plugin called.");
		},
		
		/*
		 * loadship: executed a ship is selected on dashboard or starmap
		 */
		loadship: function() {
			//console.log("LoadShip: plsCheckPlugin plugin called.");
		},
		
		
		/*
		 * Variables
		 */
	
		
		/* Main Display Function
		 */
		displayCC: function(view) {

			vgap.playSound("button");
			vgap.closeSecond();
			var plg = vgap.plugins["cloneCheckPlugin"];
			vgap.dash.content.empty();

			var html = "";

			if (!view)
				view = 1;
			//console.log("Entered displayCC, buildmethods is " + plg.buildmethods);
			console.log("Entered displayCC");
			var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
				$("<li " + (view == 1 ? "class='SelectedFilter'" : "") + ">Clone/Recycle/Disassemble Checker</li>").tclick(function() { vgap.plugins["cloneCheckPlugin"].displayCC(1); }).appendTo(filterMenu);
				//$("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">PLSCheck Help</li>").tclick(function() { vgap.plugins["cloneCheckPlugin"].displayCC(2); }).appendTo(filterMenu);
			
			//loop through all planets and show the ones owned by this player
			html = "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 70) + "px;'>";			
			
			if (view == 1) {
				// Show the Clone Checker summary page
				html += plg.display_clone_recycle_disassemble_details();
				this.pane = $(html).appendTo(vgap.dash.content);							
				$("#UpdateButtonClone").tclick(function () { plg.updateCloneButton(); });
			}
			
			//this.content.fadeIn();
			this.pane.jScrollPane();

			// vgap.action added for the assistant (Alex):
			vgap.CurrentView = "showPlanets";
			vgap.showPlanetsViewed = 1;

		},
		

// ***********************************************************************************************
	checkIfMobileVersion: function() {
		// This function adapted from Kedalion's Enemy ship list plugin:
        url = window.location.href;
        if (url.match(new RegExp("play.planets.nu"))) {
          console.log("Non-mobile client code detected...");
          return false;
        }
        else {
          console.log("Mobile client code detected...");
          return true;
        }
      },

	display_clone_recycle_disassemble_details: function () {
		// Produce content for the Clone Checker summary page
		var plg = vgap.plugins["cloneCheckPlugin"];
		var details = "";
				// Clone/Recyle/Disassemble Checker
		 
		details += "<br><h1>Clone/Recycle/Disassemble Checker</h1><br />";
		details += "<p>The clone checker checks attempted cloning orders for viability. In order to be checked, a ship must be at one of your starbases and have a friendly code that is some permutation of 'CLN'. This tool will only report one reason for clone failure, even if multiple reasons exist. The disassemble checker only checks for Land and Disassemble orders and does not check the validity of the orders or the chance of success.</p>";
		// Display Update Button
		details += "<table><td><div id='UpdateButtonClone' class='BasicFlatButton' title='Update'>Update and re-check</div></td></table>";
		//html += "</div>";
		
		details += "<h2 style='color:yellow'>Attempted clones detected:</H2>";
		console.log("Number of attempted clones is", plg.findAttemptedClones(false));
		
		if (vgap.player.raceid == 5 || vgap.player.raceid == 7) {
			details += "<p><span style='background-color:#680000;'><b>Privateers and Crystals cannot clone ships.</b></span></p>";
		} else if (plg.findAttemptedClones(false)) {
			
			details += "<p><table id='CloneCheckTable' align='left' border='0' width='100%'>";
			
			// List attempted clones
			for (var i = 0; i < vgap.mystarbases.length; i++) {
				var sb = vgap.mystarbases[i];
				var planet = vgap.getPlanet(sb.planetid);
				var plships = vgap.shipsAt(planet.x, planet.y);
				for (var j = 0; j < plships.length; j++) {
					var ship = plships[j];
					var hull = vgap.getHull(ship.hullid);
					if (ship.ownerid != planet.ownerid) continue; // Skip ships that aren't owned
					if (ship.friendlycode.toLowerCase() != "cln") continue; // Skip
					details += "<tr><td>Ship " + plg.addShipLink(ship.id) + " (" + hull.name + ") at planet " + plg.addStarbaseLink(planet.id) + ".</td>";
					details += "<td><b> " + plg.checkClone(sb,ship) + "</td><td></td></tr>";
				}
			}
			details += "<tr><td> </td><td></td><td></td></tr></table></p>";
		} else {
			details += "<p><b>No attempted clones detected.</b></p>";
		}
		
		//html += "<p><br><h1>Summary of Recycles</h1><br />";
		//html += "<p>This tool checks attempted cloning orders for viability. In order to be checked, a ship must be at one of your starbases and have a friendly code that is some permutation of 'CLN'. This tool will only report one reason for clone failure, even if multiple reasons exist.</p>";
		details += "<br><H2 style='color:yellow'>Recycles detected:</H2>";
		console.log("Number of recycles is", plg.findRecycles());
		if (plg.findRecycles()) {
			
			details += "<p><table id='RecycleTable' align='left' border='0' width='100%'>";
			
			// List recycles
			for (var i = 0; i < vgap.mystarbases.length; i++) {
				var sb = vgap.mystarbases[i];
				if (sb.shipmission == 2) {
					var ship = vgap.getShip(sb.targetshipid);
					var planet = vgap.getPlanet(sb.planetid);
					var hull = vgap.getHull(ship.hullid);
					details += "<tr><td>Ship " + plg.addShipLink(ship.id) + " (" + hull.name + ") at planet " + plg.addStarbaseLink(planet.id) + ".</td>";
					details += "</tr>";
				}
			}
			details += "<tr><td> </td></tr></table></p>";
		} else {
			details += "<p><b>No recycles detected.</b></p>";
		}
		
		//html += "<h2></h2><br><h1>Summary of Disassembles</h1><br />";
		//html += "<p>This tool only checks for Land and Disassemble orders and does not check the validity of the orders or the chance of success.</p>";
		details += "<br><h2 style='color:yellow'>Attempted disassembles detected:</H2>";
		console.log("Number of disassembles is", plg.findDisassembles());
		if (plg.findDisassembles()) {
			
			details += "<p><table id='DisassemblesTable' align='left' border='0' width='100%'>";
			
			// List disassembles
			for (var i = 0; i < vgap.myships.length; i++) {
				var ship = vgap.myships[i];
				if (ship.mission == 5) {
					var hull = vgap.getHull(ship.hullid);
					details += "<tr><td>Ship " + plg.addShipLink(ship.id) + " (" + hull.name + ").</td>";
					details += "</tr>";
				}
			}
			details += "<tr><td> </td></tr></table></p>";
		} else {
			details += "<p><b>No disassembles detected.</b></p>";
		}
		
		// Display Update Button
		//html += "<br><p><div id='UpdateButtonClone' class='BasicFlatButton' title='Update'>Update and re-check</div></p><br>";
		//html += "</div>";
		//this.pane = $(details).appendTo(vgap.dash.content);							
		//	$("#UpdateButtonClone").tclick(function () { plg.updateCloneButton(); });
		return details;
	}, 
	
	addShipLink: function (id) {
		// Adds link to ship
		var ship = vgap.getShip(id);
		if (ship != null) {
		jumpfunc = ( vgap.player.id == ship.ownerid ? "vgap.map.selectShip(" + id + ");" : "vgap.map.shipSurvey(" + id + ");" );
		mouseover = "";
		return "<a style='color:cyan;' onclick='vgap.showMap();vgap.map.centerMap(" + ship.x + ", " + ship.y + ");" + jumpfunc + "return false;'" + mouseover + " ><span style='cursor:pointer'>" + ship.id + " " + ship.name + "</span></a>"; 
		}
	},    

	addStarbaseLink: function (id) {
		// Adds link to starbase
		var planet = vgap.getPlanet(id);
		if (planet != null) {
		jumpfunc = ( vgap.player.id == planet.ownerid ? "vgap.map.selectStarbase(" + id + ");" : "vgap.map.planetSurvey(" + id + ");" );
		mouseover = "";
		return "<a style='color:cyan;' onclick='vgap.showMap();vgap.map.centerMap(" + planet.x + ", " + planet.y + ");" + jumpfunc + "return false;'" + mouseover + " ><span style='cursor:pointer'>" + planet.id + " " + planet.name + "</span></a>"; 
		}
	},    

	findAttemptedClones: function (returnOnlyValid){
		// Finds out how many ship clones are attempted
		// Returns only the number of valid clones if returnOnlyValid is true.
		// Otherwise, it returns the number of attempted clones.
		console.log("Entered function findAttemptedClones");

		var plg = vgap.plugins["cloneCheckPlugin"];
		var shipClones = 0;
		// skip if privateer or crystal
		if (vgap.player.raceid == 5 || vgap.player.raceid == 7) return shipClones;
		// Find attempted clones
		for (var i = 0; i < vgap.mystarbases.length; i++) {
			var sb = vgap.mystarbases[i];
			// Looks for possible clones
			var planet = vgap.getPlanet(sb.planetid)
			var plships = vgap.shipsAt(planet.x, planet.y);
			for (var j = 0; j < plships.length; j++) {
				var ship = plships[j];
				if (ship.ownerid != planet.ownerid) continue; // Skip ships that aren't owned
				if (ship.friendlycode.toLowerCase() != "cln") continue; // Skip ships without cln fcode
				//if (plg.possibleClone(sb,ship)) shipClones += 1;
				console.log("Ship",ship.id,"is an attempted clone.");
				if (returnOnlyValid) {
					if (plg.possibleClone(sb,ship)) shipClones += 1;
				} else {
					shipClones += 1;
				}
			}
		}
		return shipClones;
	},

	isAtOwnedPlanet: function (ship) {
			// Are we at a planet that we own?
			// Returns myplanets index, or -1 if not at a planet
			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				if ((planet.x == ship.x) && (planet.y == ship.y)) {
					return i;
				}
			}
			return -1;
		},
	
	// findClones: function (){
		// // Finds out how many valid ship clones are scheduled
		// //console.log("Entered function findClones");

		// var plg = vgap.plugins["cloneCheckPlugin"];
		// var shipClones = 0;
		// // Find clones
		// for (var i = 0; i < vgap.mystarbases.length; i++) {
			// var sb = vgap.mystarbases[i];
			// if (sb.isbuilding != true) {
				// // Looks for possible clones
				// // skip if privateer or crystal
				// if (vgap.player.raceid == 5 || vgap.player.raceid == 7) continue;
				// var planet = vgap.getPlanet(sb.planetid)
				// var plships = vgap.shipsAt(planet.x, planet.y);
				// for (var j = 0; j < plships.length; j++) {
					// var ship = plships[j];
					// if (ship.ownerid != planet.ownerid) continue; // Skip ships that aren't owned
					// if (ship.friendlycode.toLowerCase() != "cln") continue; // Skip ships without cln fcode
					// if (plg.possibleClone(sb,ship)) shipClones += 1;
				// }
			// }
		// }

		// return shipClones;
	// },

	checkClone: function(sb,ship) {
		// checks to see if it is possible to clone a ship. If not, it returns the reason why.
		console.log("Entered function checkClone");
		var plg = vgap.plugins["cloneCheckPlugin"];
		var planet = vgap.getPlanet(sb.planetid);

		if (sb.isbuilding == true) return "<span style='background-color:#680000;'> A regular build is scheduled at this starbase. </span>";

		var hull = vgap.getHull(ship.hullid);

		// This hull must be of a different race for cloning to be possible
		for (var i = 0; i < vgap.racehulls.length; i++) {
			if (hull.id == vgap.getHull(vgap.racehulls[i]).id) {
				return "<span style='background-color:#680000;'> Hull is not alien. </span>"; // cannot clone
			} 
		}
		console.log("Can clone hull of ship",ship.id);

		// Check to see if build is possible		
		var engine = vgap.getEngine(ship.engineid);
		var n_engines = hull.engines;
		var n_tubes = ship.torps;
		var n_beams = ship.beams;
		if (n_beams > 0) var beam = vgap.getBeam(ship.beamid);
		if (n_tubes > 0) var tube = vgap.getTorpedo(ship.torpedoid);

		// Calculate total cost to clone ship
		buildcost = hull.cost + n_engines * engine.cost;
		buildduranium = hull.duranium + n_engines * engine.duranium;
		buildtritanium = hull.tritanium + n_engines * engine.tritanium;
		buildmolybdenum = hull.molybdenum + n_engines * engine.molybdenum;
		if (hull.techlevel > sb.hulltechlevel) return "<span style='background-color:#680000;'>Inadequate hull tech at starbase.</span>";
		if (engine.techlevel > sb.enginetechlevel) return "<span style='background-color:#680000;'>Inadequate engine tech at starbase.</span>";
		if (n_beams > 0) {
			if (beam.techlevel > sb.beamtechlevel) return "<span style='background-color:#680000;'>Inadequate beam tech at starbase.</span>";
			buildcost = buildcost  + n_beams * beam.cost; 
			buildduranium = buildduranium + n_beams * beam.duranium;
			buildtritanium = buildtritanium + n_beams * beam.tritanium;
			buildmolybdenum = buildmolybdenum + n_beams * beam.molybdenum;
		}
		if (n_tubes > 0) {
			if (tube.techlevel > sb.torptechlevel) return "<span style='background-color:#680000;'>Inadequate torpedo tech at starbase.</span>";
			buildcost = buildcost + n_tubes * tube.launchercost; 
			buildduranium = buildduranium + n_tubes * tube.duranium;
			buildtritanium = buildtritanium + n_tubes * tube.tritanium;
			buildmolybdenum = buildmolybdenum + n_tubes * tube.molybdenum;
		}
		buildcost = buildcost * 2;

		// Check to see if we can build this ship
		if (planet.megacredits < buildcost) return "<span style='background-color:#680000;'>Inadequate megacredits.</span>";
		if (planet.duranium < buildduranium) return "<span style='background-color:#680000;'>Inadequate duranium.</span>";
		if (planet.tritanium < buildtritanium) return "<span style='background-color:#680000;'>Inadequate tritanium.</span>";
		if (planet.molybdenum < buildmolybdenum) return "<span style='background-color:#680000;'>Inadequate molybdenum.</span>";

		return "<span style='color: #FFEBCD; background-color: #006400;'> Clone is valid </span>";
	},

	possibleClone: function(sb,ship) {
		// checks to see if it is possible to clone a ship.
		console.log("Entered function possibleClone");
		var plg = vgap.plugins["cloneCheckPlugin"];
		var planet = vgap.getPlanet(sb.planetid)

		var hull = vgap.getHull(ship.hullid);

		// This hull must be of a different race for cloning to be possible
		for (var i = 0; i < vgap.racehulls.length; i++) {
			//console.log("race hull ",vgap.getHull(vgap.racehulls[i]).id);
			if (hull.id == vgap.getHull(vgap.racehulls[i]).id) {
				//console.log("Cannot clone ship",ship.id);
				return false; // cannot clone
			} 
		}
		console.log("Can clone hull of ship",ship.id);
		//return true;

		// Check to see if build is possible		
		var engine = vgap.getEngine(ship.engineid);
		var n_engines = hull.engines;
		var n_tubes = ship.torps;
		var n_beams = ship.beams;
		if (n_beams > 0) var beam = vgap.getBeam(ship.beamid);
		if (n_tubes > 0) var tube = vgap.getTorpedo(ship.torpedoid);

		// Calculate total cost to clone ship
		buildcost = hull.cost + n_engines * engine.cost;
		buildduranium = hull.duranium + n_engines * engine.duranium;
		buildtritanium = hull.tritanium + n_engines * engine.tritanium;
		buildmolybdenum = hull.molybdenum + n_engines * engine.molybdenum;
		if (hull.techlevel > sb.hulltechlevel) return false;
		if (engine.techlevel > sb.enginetechlevel) return false;
		if (n_beams > 0) {
			if (beam.techlevel > sb.beamtechlevel) return false;
			buildcost = buildcost  + n_beams * beam.cost; 
			buildduranium = buildduranium + n_beams * beam.duranium;
			buildtritanium = buildtritanium + n_beams * beam.tritanium;
			buildmolybdenum = buildmolybdenum + n_beams * beam.molybdenum;
		}
		if (n_tubes > 0) {
			if (tube.techlevel > sb.torptechlevel) return false;
			buildcost = buildcost + n_tubes * tube.launchercost; 
			buildduranium = buildduranium + n_tubes * tube.duranium;
			buildtritanium = buildtritanium + n_tubes * tube.tritanium;
			buildmolybdenum = buildmolybdenum + n_tubes * tube.molybdenum;
		}
		buildcost = buildcost * 2;
		//console.log("Can clone?",planet.megacredits >= buildcost,planet.duranium >= buildduranium,planet.tritanium >= buildtritanium,planet.molybdenum >= buildmolybdenum);
		// Check to see if we can build this ship
		var canbuild = (planet.megacredits >= buildcost && planet.duranium >= buildduranium && planet.tritanium >= buildtritanium && planet.molybdenum >= buildmolybdenum);
		if (!canbuild) return false; // cannot clone

		return true;
	},

		findRecycles: function (){
		// Finds out how many ship recycles are scheduled 
		//console.log("Entered function findRecycles");

		var plg = vgap.plugins["cloneCheckPlugin"];
		var shipRecycles = 0;
		// Find recycles
		for (var i = 0; i < vgap.mystarbases.length; i++) {
			var sb = vgap.mystarbases[i];
			if (sb.shipmission == 2) {
				shipRecycles += 1;
			} 
		}

		return shipRecycles;
	},
	
	findDisassembles: function (){
		// Finds out how many ships have valid land and disassemble orders 
		//console.log("Entered function findRecycles");

		var plg = vgap.plugins["cloneCheckPlugin"];
		var shipDisassembles = 0;
		// Find ships with valid land and disassemble orders
		for (var i = 0; i < vgap.myships.length; i++) {
			var ship = vgap.myships[i];
			if (ship.mission == 5) {
				// Is ship at owned planet?
				//if (plg.isAtOwnedPlanet(ship) > 0) {
				   shipDisassembles += 1;
				//}
			} 
		}

		return shipDisassembles;
	},
	
	updateCloneButton: function (){
		// Runs when the clone check update button is clicked
		console.log("Entered function updateCloneButton");
		var plg = vgap.plugins["cloneCheckPlugin"];
		plg.displayCC(1); // Re-run CloneCheck
	   	//return null;
	},


	updateButton: function (){
		// Runs when the update button is clicked
		console.log("Entered function updateButton");
		var plg = vgap.plugins["cloneCheckPlugin"];
		var plsVal = plg.valButton( document.getElementsByName('plsradio'))
		if (plsVal == "pls70") plsType = 70;
		if (plsVal == "pls50") plsType = 50;
		if (plsVal == "pls20") plsType = 20;
		if (plsVal == "pls10") plsType = 10;
		if (plsVal == "nobuild") plsType = 0;
		var ruleVal = plg.valButton( document.getElementsByName('ruleradio'))
		if (ruleVal == "short") ruleType = "short";
		if (ruleVal == "long") ruleType = "long";
		//console.log("plsType is ",plsType,"ruleType is ",ruleType);
		plg.plsSaveChanges(false); // Save changes
		plg.displayCC(0); // Re-run PLSCheck
	   	//return null;
	},

	valButton: function(btn) { 
		// Returns value of radio button
		for (var i=btn.length-1; i > -1; i--) { 
		  if (btn[i].checked) return btn[i].value; 
		} 
		return null; 
	}, 

	plsSaveChanges: function(savestarted) {
		var plg = vgap.plugins["cloneCheckPlugin"];
		
		/*if (vgap.saveInProgress == 2) {
			// We are still saving, check again in a little bit
			timeoutID = window.setTimeout(plg.plsSaveChanges(true), 500);
			return;*/
		if (savestarted == true) {
			return;
		} else if (savestarted == false) {
			// We can start the save 
			vgap.save();
			timeoutID = window.setTimeout(plg.plsSaveChanges(true), 1000);
		} else {
			// save is completed
			return;
		}
	},

		
			
	};
		
	// register your plugin with NU
	vgap.registerPlugin(cloneCheckPlugin, "cloneCheckPlugin");

	
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);

