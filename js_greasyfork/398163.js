// ==UserScript==
// @name          Planets.nu - RoboMax Plugin
// @description   RoboMax Plugin
// @version       0.9.3
// @date          2020-05-08
// @author        robodoc
// @include       http://*.planets.nu/*
// @include       https://*.planets.nu/*
// @include       http://planets.nu/*
// @include       https://planets.nu/*
// @exclude       http://help.planets.nu/*
// @exclude       https://help.planets.nu/*
// @exclude       http://profile*.planets.nu/*
// @exclude       https://profile*.planets.nu/*
// @history       0.9.0    Preview release

// @namespace https://greasyfork.org/users/5275
// @downloadURL https://update.greasyfork.org/scripts/398163/Planetsnu%20-%20RoboMax%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/398163/Planetsnu%20-%20RoboMax%20Plugin.meta.js
// ==/UserScript==


function wrapper1 () { // wrapper for injection

	if (vgap.version < 3.0) {
		console.log("RoboMax Plugin requires at least NU version 3.0. Plugin disabled." );
		return;
	}

	var plugin_version = "0.9.3";
	console.log("RoboMax plugin version: v" + plugin_version );

	var roboMaxPlugin = {

		processload: function() {
			//console.log("ProcessLoad: roboMaxPlugin plugin called.");
			var plg = vgap.plugins["roboMaxPlugin"];

			vgap.plugins["roboMaxPlugin"].mobile_version = vgap.plugins["roboMaxPlugin"].checkIfMobileVersion();

			// Initialize arrays

			//need = []; // stores the resource needs of each planet
			//surplus = []; // stores the resource surplus of each planet

			plg.roboFinished = false;

			//console.log("END roboMaxPlugin PROCESS LOAD");
		},

		loaddashboard: function() {
			//console.log("LoadDashboard: roboMaxPlugin plugin called.");

			// Add RoboMax Button
			var menu = document.getElementById("DashboardMenu").childNodes[2]; //insert in middle
			$("<li style=\"color:#FFF000\">RoboMax »</li>").tclick(function () { vgap.plugins["roboMaxPlugin"].displayRoboMax(); }).appendTo(menu);

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
			//console.log("ShowSummary: roboMaxPlugin plugin called.");

			//insert Icon for RoboMax on Home Screen

			// The following code adapted from Kedalion's Enemy ship list plugin:
			var node;
			// if (vgap.plugins["plsCheckPlugin"].mobile_version) {
			if (vgap.plugins["roboMaxPlugin"].checkIfMobileVersion) {
			  // console.log("ShowSummary for mobile ");
			  var summary_list = document.getElementById("TurnSummary");
			  node = document.createElement("span");
			}
			else {
			  // console.log("ShowSummary for non-mobile");
			  var summary_list = document.getElementById("TurnSummary").childNodes[0];
			  node = document.createElement("li");
			}

			if (true) {
				//var node2 = document.createElement("li");
				//node.setAttribute("style", "color:#FFF000");
				node.setAttribute("style", "color:#85bb65");
				node.innerHTML = "<div class=\"iconholder\"><img src=\"https://planets.nu/img/icons/blacksquares/planets.png\"/></div>" + "RoboMax";
				node.onclick = function() {vgap.plugins["roboMaxPlugin"].displayRoboMax();};

				var starbase_entry = summary_list.children[4];
				summary_list.insertBefore(node, starbase_entry);
			}

		},

		/*
		 * loadmap: executed after the first turn has been loaded to create the map
		 * as far as I can tell not executed again when using time machine
		 */
		loadmap: function() {
			//console.log("LoadMap: roboMaxPlugin plugin called.");
		},

		/*
		 * showmap: executed when switching from dashboard to starmap
		 */
		showmap: function() {
			//console.log("ShowMap: roboMaxPlugin plugin called.");
		},

		/*
		 * draw: executed on any click or drag on the starmap
		 */
		draw: function() {
			//console.log("Draw: roboMaxPlugin plugin called.");
		},

		/*
		 * loadplanet: executed a planet is selected on dashboard or starmap
		 */
		loadplanet: function() {
			//console.log("LoadPlanet: roboMaxPlugin plugin called.");
		},

		/*
		 * loadstarbase: executed a starbase is selected on dashboard or starmap
		 */
		loadstarbase: function() {
			//console.log("LoadStarbase: roboMaxPlugin plugin called.");
		},

		/*
		 * loadship: executed a ship is selected on dashboard or starmap
		 */
		loadship: function() {
			//console.log("LoadShip: roboMaxPlugin plugin called.");
		},

		// Variables

		setColonistTaxes: true,
		setNativeTaxes: true,
		buildFactoriesAndMines: true,
		fcrandomize: true,
		unloadMegacredits: false,
		unloadCargo: false,
		buildDefenses: true,

		// Main Display Function

		displayRoboMax: function(view) {

			vgap.playSound("button");
			vgap.closeSecond();
			var plg = vgap.plugins["roboMaxPlugin"];
			vgap.dash.content.empty();

			var html = "";

			if (!view) view = 0;
			//console.log("Entered displayRoboMax");
			var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
				$("<li " + (view == 0 ? "class='SelectedFilter'" : "") + ">RoboMax Command Center</li>").tclick(function() { vgap.plugins["roboMaxPlugin"].displayRoboMax(0); }).appendTo(filterMenu);
				// $("<li " + (view == 3 ? "class='SelectedFilter'" : "") + ">Planet Needs and Surpluses</li>").tclick(function() { vgap.plugins["roboMaxPlugin"].displayRoboMax(3); }).appendTo(filterMenu);
				$("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">RoboMax Help</li>").tclick(function() { vgap.plugins["roboMaxPlugin"].displayRoboMax(2); }).appendTo(filterMenu);

			html = "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 70) + "px;'>";

			if (view == 0) {
				// Display RoboMax Command Center

				//html += "<br><h1>RoboMax v" + plugin_version + "</h1>";
				html += "<p><span style='color:yellow'><b>RoboMax v" + plugin_version + "</b></span>, an AI (Artificial Intelligence) that governs your planets for you. <br>Click the green button below to order <b>RoboMax</b> to serve you!</p>";

				if (vgap.player.raceid != 12) { // Does not work for Horwasp!
					// Display Options
					html += "<table><td valign='top' style='width:20%'>";
					html += "<p><span style='font-size:20px;'>Options:</span>";
					html += "</td><td valign='top'>";
					//html += "<ul><li><input type='checkbox' name='MngPlCheck' id='ManagePlanetsCheck' value ='c' checked disabled />Manage planet building and taxing</li>";
					html += "<ul>";
					if (plg.unloadMegacredits == true) {
						html += "<li><input type='checkbox' name='ULMegacreditsCheck' id='UnloadMegacreditsCheck' value ='c' checked />Automatically unload megacredits</li>";
					} else {
						html += "<li><input type='checkbox' name='ULMegacreditsCheck' id='UnloadMegacreditsCheck' value ='c' />Automatically unload megacredits</li>";
					}
					if (plg.unloadCargo == true) {
						html += "<li><input type='checkbox' name='ULCargoCheck' id='UnloadCargoCheck' value ='c' checked />Automatically unload cargo</li>";
					} else {
						html += "<li><input type='checkbox' name='ULCargoCheck' id='UnloadCargoCheck' value ='c' />Automatically unload cargo</li>";
					}
					if (plg.buildFactoriesAndMines == true) {
						html += "<li><input type='checkbox' name='buildFactCheck' id='buildFactoriesCheck' value ='c' checked />Build factories and mines</li>";
					} else {
						html += "<li><input type='checkbox' name='buildFactCheck' id='buildFactoriesCheck' value ='c' />Build factories and mines</li>";
					}
					if (plg.buildDefenses == true) {
						html += "<li><input type='checkbox' name='BldDPCheck' id='BuildDPsCheck' value ='c' checked />Automatically build defense posts where needed</li>";
					} else {
						html += "<li><input type='checkbox' name='BldDPCheck' id='BuildDPsCheck' value ='c' />Automatically build defense posts where needed</li>";
					}
					if (plg.setColonistTaxes == true) {
						html += "<li><input type='checkbox' name='setColonistTaxCheck' id='setColonistTaxesCheck' value ='c' checked />Set Colonist taxes</li>";
					} else {
						html += "<li><input type='checkbox' name='setColonistTaxCheck' id='setColonistTaxesCheck' value ='c' />Set Colonist taxes</li>";
					}
					if (plg.setNativeTaxes == true) {
						html += "<li><input type='checkbox' name='setNativeTaxCheck' id='setNativeTaxesCheck' value ='c' checked />Set Native taxes</li>";
					} else {
						html += "<li><input type='checkbox' name='setNativeTaxCheck' id='setNativeTaxesCheck' value ='c' />Set Native taxes</li>";
					}
					if (plg.fcrandomize == true) {
						html += "<li><input type='checkbox' name='MngFCCheck' id='ManagePlanetFCsCheck' value ='c' checked />Manage planetary friendly codes</li>";
					} else {
						html += "<li><input type='checkbox' name='MngFCCheck' id='ManagePlanetFCsCheck' value ='c' />Manage planetary friendly codes</li>";
					}

					html += "</td></table>";

					// Display run button
					html += "<table cellpadding='5'>";
					if (plg.roboFinished) {
						html += "<td class=RoboMaxRun id='RoboMaxRun' width='400' align='center' style='border: solid white 1px; color: #FFEBCD; background-color:#006400; '><b> RoboMax is finished giving orders </b></td>";
					} else {
						html += "<td class=RoboMaxRun id='RoboMaxRun' width='400' align='center' style='border: solid white 1px; color: #FFEBCD; background-color:#006400; '><b> Manage planets </b></td>";
					}
					html += "</table>";
				} else {
					html += "<p> RoboMax does not work for Horwasps</p>";
				}

				html += "<br />";

				html += "<p><div id='ResetTurnButton' class='BasicFlatButton' title='Use with caution.'>Reset Turn If Needed</div></p><p></p><br/><br/>";

				this.pane = $(html).appendTo(vgap.dash.content);

				// $('#ManagePlanetsCheck').click(function () {
					// console.log("Manage planet building and taxing CLICKED");
				// });

				$('#UnloadMegacreditsCheck').click(function () {
					console.log("Unload Megacredits CLICKED");
					if (plg.unloadMegacredits == true)
						plg.unloadMegacredits = false;
					else
						plg.unloadMegacredits = true;
					console.log("Unload Megacredits is now: " + plg.unloadMegacredits);
				});

				$('#UnloadCargoCheck').click(function () {
					console.log("Unload Cargo CLICKED");
					if (plg.unloadCargo == true)
						plg.unloadCargo = false;
					else
						plg.unloadCargo = true;
					console.log("Unload Cargo is now: " + plg.unloadCargo);
				});

				$('#setColonistTaxesCheck').click(function () {
					console.log("setColonistTaxesCheck CLICKED");
					if (plg.setColonistTaxes == true)
						plg.setColonistTaxes = false;
					else
						plg.setColonistTaxes = true;
					console.log("setColonistTaxes is now: " + plg.setColonistTaxes);
				});

				$('#setNativeTaxesCheck').click(function () {
					console.log("setNativeTaxesCheck CLICKED");
					if (plg.setNativeTaxes == true)
						plg.setNativeTaxes = false;
					else
						plg.setNativeTaxes = true;
					console.log("setNativeTaxes is now: " + plg.setNativeTaxes);
				});

				$('#buildFactoriesCheck').click(function () {
					console.log("buildFactoriesCheck CLICKED");
					if (plg.buildFactoriesAndMines == true)
						plg.buildFactoriesAndMines = false;
					else
						plg.buildFactoriesAndMines = true;
					console.log("buildFactoriesAndMines is now: " + plg.setTaxes);
				});

				$('#ManagePlanetFCsCheck').click(function () {
					console.log("Manage planetary friendly codes CLICKED");
					if (plg.fcrandomize == true)
						plg.fcrandomize = false;
					else
						plg.fcrandomize = true;
					console.log("FC Randomize is now: " + plg.fcrandomize);
				});

				$('#BuildDPsCheck').click(function () {
					console.log("Build defense posts CLICKED");
					if (plg.buildDefenses == true)
						plg.buildDefenses = false;
					else
						plg.buildDefenses = true;
					console.log("Build defense posts: " + plg.buildDefenses);
				});

				$('.BuildButton').click(function() {
                    console.log("Build Button Pressed :)");
					plg.runRoboMax();
				});

				$('body').delegate('.RoboMaxRun','click',function() {
					console.log("RoboMaxRun CLICKED!!!");
					if (plg.roboFinished) return; // skip if we've already run roboMax
          acknowledgement = "By your command";
          // for (var i=0; i < acknowledgement.length; i++) {
          //   setTimeout(function(){plg.roboStatusUpdate(0,acknowledgement.substring(0,i));},200);
          // }
					plg.roboStatusUpdate(0,"By your command");
					setTimeout(function(){plg.roboStatusUpdate(0,"RoboMax is running...");},1000);
					//plg.roboStatusUpdate(0,"RoboMax is running...");
					setTimeout(function(){plg.runRoboMax();},200);
					var identifier = "#RoboMaxRun";
					//console.log("SELECTOR: " + identifier);
					plg.roboFinished = true;
				});

        			$("#ResetTurnButton").tclick(function () { vgap.resetTurn(); });

			}

			if (view == 2) {
				// Display RoboMax Help

				html += "<br /><table border='0' width='100%'>";
				html += "<tr><td>";

				html += "<h1>RoboMax v" + plugin_version + "</h1><br />";
				html += "<h4><i><b>by Robodoc</b></i></h4><br/>";
				html += "<h2>Introduction</h2><p>RoboMax is a client-side planet management AI that will build mines and factories and tax colonists and natives. Optionally, RoboMax will unload cargo from ships, build defense posts, and randomize planetary friendly codes</p><br/>";
				html += "<h2>Instructions</h2><p>Installation instructions are beyond the scope of this manual. General instructions for running RoboMax are:</p><ol><li>Click on 'RoboMax' in the main menu.</li><li>Select or unselect options.</li><li>Click the green rectangle on the main RoboMax page to run RoboMax.</li><li>When it is finished, a message will state that RoboMax is finished giving orders.</li></ol><p>You can continue to change orders after RoboMax has run.</p><p>Avoid running RoboMax more than once in a given turn. Remember that you can always reset your turn if you do not like what RoboMax has done.</p><p><b>SUGGESTION:</b> 'Double-check' (i.e., in the checkbox) planets that you are fully confident in RoboMax handling, and 'single-check' planets where you might want to review or alter the orders. If you beam down clans to a planet, etc., then you can manually update the orders for that planet at the same time that you are giving orders for the ship in orbit. </p><p><span style='color:yellow'><b>WARNING: RoboMax should be run before you give any manual orders.</b></span> If you give manual orders and then run RoboMax, then you run the risk of corrupting your turn. If your turn gets corrupted, you will have to reset, exit the game, then re-enter.</p>";
				// html += "<h2>Options</h2><br/><h3 style='color:yellow'>Manage planet building and taxing</h3><p>This option cannot be unchecked. RoboMax will always give orders to build planet factories and mines, and it will tax colonists and natives.</p><h3 style='color:yellow'>Manage planetary friendly codes</h3><p>If this option is checked, RoboMax will assign new friendly codes to all planets.</p><h3 style='color:yellow'>Automatically unload cargo</h3><p>If this option is checked, RoboMax will unload colonists, supplies, money and minerals to your planets.</p><h3 style='color:yellow'>Automatically build defense posts where needed</h3><p>RoboMax will scan for enemy activity and build planetary defense posts where it thinks they are needed. </p>";
				html += "<h2>Options</h2><br/><h3 style='color:yellow'>Automatically unload megacredits</h3><p>If this option is checked, RoboMax will unload money to your planets from orbiting ships.</p><h3 style='color:yellow'>Automatically unload cargo</h3><p>If this option is checked, RoboMax will unload colonists, supplies, and minerals to your planets.</p><h3 style='color:yellow'>Build factories and mines</h3><p>RoboMax will automatically build factories and mines. The target number of factories is the maximum possible. The target number of mines is the amount needed to mine the planet out in 30 turns.</p><h3 style='color:yellow'>Automatically build defense posts where needed. </h3><p>RoboMax will scan for enemy activity and build planetary defense posts where it thinks they are needed. The default number of defense posts for a planet is 15, and it is 57 for a planet with a starbase. If enemy activity is detected within a 200 LY radius, it will attempt to max defense posts. Fewer defense posts will be built in the early turns of the game.</p><h3 style='color:yellow'>Tax colonists</h3><p>RoboMax will tax colonists as follows. If the population can't grow, use safe tax 40. However, if your race can build appropriate terraformers that can change the temperature so that clans can grow, use flat tax 70. If the population is less that 5000 clans and the population can grow, set the tax rate to zero. Otherwise, if the population is less than or equal to 6.6 million and the population can grow, use growth tax. If the planet is still building factories, use flat tax instead of growth tax to get money faster. Otherwise, if the population is greater than 6.6 million, use flat tax 70.</p><h3 style='color:yellow'>Tax natives</h3><p>RoboMax will tax natives as follows. If the population can't grow, use safe tax 40. However, if your race can build appropriate terraformers that can change the temperature so that clans can grow, use flat tax 70. If the population is less that 2500 clans and the population can grow, set the tax rate to zero. Otherwise, if the population is less than or equal to 6.6 million and the population can grow, use growth tax. If the planet is still building factories, use flat tax instead of growth tax to get money faster. Otherwise, if the population is greater than 6.6 million, use flat tax 70 unless the natives are bovinoid (in that case use growth tax).</p><h3 style='color:yellow'>Manage planetary friendly codes</h3><p>If this option is checked, RoboMax will assign new friendly codes to all planets. The rules are as follows: 'att', 'nuk', 'bum', 'edf', 'dmp' are changed to a random permutation of the same code. E.g., 'Att' to 'atT'. 'pbX' and 'mfX' codes are altered in a similar way. E.g., 'pb1' to 'pB1'. Codes beginning with an 'x' are left unaltered. The rationale is that Superspy Deluxe cannot be used to set codes that start with 'x', so these codes are assumed to be special and intentional. These are the codes that you can give to your allies. All other codes are replaced with a random alphanumeric code. The algorithm makes it impossible for a special code to be generated this way.</p>";
html += "</td></tr>"
				html += "</table><br /></div>";

				this.pane = $(html).appendTo(vgap.dash.content);
			}

		this.pane.jScrollPane();

		},



// ****************************************************************************

		roboStatusUpdate: function(col,msg) {
			// Updates the status message
			var plg = vgap.plugins["roboMaxPlugin"];
			if (col == 0) $("#RoboMaxRun").replaceWith("<td class=RoboMaxRun id='RoboMaxRun'  width='400' align='center' style='border: solid white 1px; color: #FFEBCD; background-color: #680000;'><b>" + msg + "</b></td>");
			if (col == 1) $("#RoboMaxRun").replaceWith("<td class=RoboMaxRun id='RoboMaxRun'  width='400' align='center' style='border: solid white 1px; color: #FFEBCD; background-color: #006400;'><b>" + msg + "</b></td>");
		},

		runRoboMax: function() {
			// This function runs when the button is clicked
			var plg = vgap.plugins["roboMaxPlugin"];
			console.log("");
			console.log("Running RoboMax!");
			vgap.playSound("button");

			// Unload ship cargo
			if (plg.unloadCargo) plg.roboUnloadCargo("all");
			if (plg.unloadMegacredits) plg.roboUnloadMegacredits("all");

			// Build factories
			if (plg.buildFactoriesAndMines) plg.roboBuildFactories();

			// Build mines, basic defenses, and improved defenses
			if (plg.buildFactoriesAndMines) plg.roboBuildMines();
			if (plg.buildDefenses) plg.roboBuildDefenses();

			// Assign taxes
			// if (plg.setTaxes) plg.roboPlanetSetTaxes();
			if (plg.setColonistTaxes) plg.roboPlanetSetAllColonistTaxes();
			if (plg.setNativeTaxes) plg.roboPlanetSetAllNativeTaxes();

			// Manage planetary friendly codes, and permute ship friendly codes
			if (plg.fcrandomize) plg.roboMaxRandomizePlanetFcodes();

			// We're finished giving orders, so initiate save
			vgap.save(); // Save all our changes at the end
			plg.roboStatusUpdate(0,"Saving changes...");

			// Check save, and end the function
			var checkInterval = setInterval(function(){
				if (vgap.saveInProgress == 2) {
					// We are still saving, check again in a little bit
					return;
				} else {
					clearInterval(checkInterval);
					plg.roboStatusUpdate(1,"RoboMax is finished giving orders.");
					vgap.loadWaypoints();
					console.log("RoboMax is finished giving orders.");
				}
			}, 500);
		},

		checkIfMobileVersion: function() {
			// This function adapted from Kedalion's Enemy ship list plugin:
			url = window.location.href;
			if (vgap.version >= 4.0) {
			  console.log("Mobile client code detected...");
			  return true;
			}
			else {
			  console.log("Non-mobile client code detected...");
			  return false;
			}
		},

///////////////////////////////////////////////////////////////////////////////////
//// Unload Cargo Section
///////////////////////////////////////////////////////////////////////////////////

		roboUnloadMegacredits: function(shiptype) {
			// Unloads megacredits from ships
			var plg = vgap.plugins["roboMaxPlugin"];
						console.log("Unloading megacredits from ships");
			plg.roboStatusUpdate(0,"Unloading ship megacredits.");

			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				var plships = vgap.shipsAt(planet.x, planet.y);
				for (var j = 0; j < plships.length; j++) {
					var ship = plships[j];
					if (plships[j].ownerid != planet.ownerid) continue; // Skip ships that aren't owned
					if (shiptype == "freighter" && !plg.roboIsFreighter(ship)) continue; // Skip ships that aren't freighters
					if (shiptype == "alchemy" && !plg.roboIsRefinery(ship)) continue; // Skip ships that aren't alchemy/refinery

					planet.megacredits = planet.megacredits + plships[j].megacredits;
					plships[j].megacredits = 0;

					planet.changed = 1;
					plships[j].changed = 1;
				}
			}
			//vgap.save();
		},

		roboUnloadCargo: function(shiptype) {
			// Unloads cargo from ships
			var plg = vgap.plugins["roboMaxPlugin"];
            console.log("Unloading cargo from ships");
			plg.roboStatusUpdate(0,"Unloading ship cargo.");

			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				var plships = vgap.shipsAt(planet.x, planet.y);
				for (var j = 0; j < plships.length; j++) {
					var ship = plships[j];
					if (plships[j].ownerid != planet.ownerid) continue; // Skip ships that aren't owned
					if (shiptype == "freighter" && !plg.roboIsFreighter(ship)) continue; // Skip ships that aren't freighters
					if (shiptype == "alchemy" && !plg.roboIsRefinery(ship)) continue; // Skip ships that aren't alchemy/refinery

          //console.log("Unloading ship",plships[j].id);
					planet.clans = planet.clans + plships[j].clans;
					plships[j].clans = 0;
					if (!vgap.settings.nosupplies) {
						planet.supplies = planet.supplies + plships[j].supplies;
						plships[j].supplies = 0;
					}
					// planet.megacredits = planet.megacredits + plships[j].megacredits;
					// plships[j].megacredits = 0;
					// planet.neutronium = planet.neutronium + plships[j].neutronium;
					// plships[j].neutronium = 0;
					planet.duranium = planet.duranium + plships[j].duranium;
					plships[j].duranium = 0;
					planet.tritanium = planet.tritanium + plships[j].tritanium;
					plships[j].tritanium = 0;
					planet.molybdenum = planet.molybdenum + plships[j].molybdenum;
					plships[j].molybdenum = 0;

					planet.changed = 1;
					plships[j].changed = 1;
				}
			}
			//vgap.save();
		},

///////////////////////////////////////////////////////////////////////////////////
//// Ship Information Section
///////////////////////////////////////////////////////////////////////////////////
		roboIsFreighter: function(ship) {
			//console.log("Entered roboIsFreighter");
			// Returns true if a ship is a freighter
			var h = ship.hullid;
			if (h==18 || h==17 || h==16 || h==15 || h==14) {
				return true; // Freighter
			}
			return false;
		},

		roboIsRefinery: function(ship) {
			//console.log("Entered roboIsRefinery");
			// Returns true if a ship is a refinery or alchemy ship
			var h = ship.hullid;
			if (h==105 || h==104 || h==97) {
				return true; // refinery or alchemy
			}
			return false;
		},


///////////////////////////////////////////////////////////////////////////////////
//// Tax section
//// 1. roboPlanetSetAllColonistTaxes
//// 2. roboPlanetSetAllNativeTaxes
//// 3. roboSetColonistTax
//// 4. roboFindColonistRate
//// 5. roboColonistHappyChange
//// 6. roboSetNativeTax
//// 7. roboFindNativeRate
//// 8. roboNativeHappyChange
//// 9. roboHISSeffect
//// 10. getMaxNatives
//// 11. getMaxColonists
//// 12. roboColGrowthIsPossible
///////////////////////////////////////////////////////////////////////////////////
		roboPlanetSetAllColonistTaxes: function() {
			// Main function for setting taxes for colonists and natives

			var plg = vgap.plugins["roboMaxPlugin"];
			plg.roboStatusUpdate(0,"Setting taxes");
			//var raceId = vgap.player.raceid;

			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				var HISSeffect = plg.roboHISSeffect(planet);

				// Tax colonists:
				plg.roboSetColonistTax(planet,HISSeffect);

				// Tax natives:
				// if (planet.nativeclans > 0) {
				// 	plg.roboSetNativeTax(planet,HISSeffect);
				// }
			}
			return;
		},

		roboPlanetSetAllNativeTaxes: function() {
			// Main function for setting taxes for colonists and natives

			var plg = vgap.plugins["roboMaxPlugin"];
			plg.roboStatusUpdate(0,"Setting taxes");
			//var raceId = vgap.player.raceid;

			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				var HISSeffect = plg.roboHISSeffect(planet);

				// Tax colonists:
				// plg.roboSetColonistTax(planet,HISSeffect);

				// Tax natives:
				if (planet.nativeclans > 0) {
					plg.roboSetNativeTax(planet,HISSeffect);
				}
			}
			return;
		},

		roboSetColonistTax: function(planet,HISSeffect) {
			// This function was inspired by tax management code from Dotman's
			// Planetary Management Plugin (version 1.20).
			var plg = vgap.plugins["roboMaxPlugin"];
			var raceId = vgap.player.raceid;
			console.log("Entered roboSetColonistTax: ",planet.id,HISSeffect,planet.clans);

			//var rate;
			// Use growth tax by default
			var useGrowthTaxforColonists = true;
			var minColHappiness = 70;
			var minColClansForTaxing = 5000; // Don't tax if less than this number, unless climate is bad.
			var zeroTaxHappyChange = plg.roboColonistHappyChange(planet, 0);//
			console.log("zeroTaxHappyChange is",zeroTaxHappyChange);
			//var colonistGrowthIsPossible = true;

			// Use "safe" tax if population is high
			if (planet.clans > 66000) {
				useGrowthTaxforColonists = false;
				//console.log("Planet " + planet.name + ": Assigning mid tax");
			}

			// The next several lines may only make sense in the context of the
			// Roboplayer AI. The basic idea is to keep the cash flow going at the
			// homeworld so that you can build ships every turn.
			// Make sure cash is flowing if a starbase is present.
			// For races that don't have extremely low-cost ships to build,
			// i.e. Birds (3), Fascists (4), Cyborg (6), Crystal (7), and EvilEmpire (8).
			var raceId = vgap.player.raceid;
			if (raceId == 3 || raceId == 4 || raceId == 6 || raceId == 7 || raceId == 8) {

				if (vgap.getStarbase(planet.id) != null && planet.clans > 10000 && planet.megacredits < 500) {
					console.log("Squeezing extra money out of planet",planet.id);
					useGrowthTaxforColonists = false;
					minColHappiness = 70;
				}
			}

			// Safe tax if population can't grow
			//console.log("Planet",planet.id,"plg.getMaxColonists(planet)", plg.getMaxColonists(planet));
			//if (planet.clans >= plg.getMaxColonists(planet)) {
			if (!plg.roboColGrowthIsPossible(planet)) {
				//colonistGrowthIsPossible = false;
				useGrowthTaxforColonists = false;
				minColHappiness = 40;
				//console.log("Planet " + planet.name + ": Assigning max tax");
				if (vgap.player.raceid == 1 && (planet.temp < 15 || planet.temp > 84)) {
					// Feds might terraform these, so don't tax so aggressively
					minColHappiness = 70 - zeroTaxHappyChange;
				} else if (vgap.player.raceid == 2 && planet.temp > 84) {
					// Lizards might terraform these, so don't tax so aggressively
					minColHappiness = 70 - zeroTaxHappyChange;
				} else if (vgap.player.raceid == 7 && planet.temp < 100) {
					// Crystals might terraform these, so don't tax so aggressively
					minColHappiness = 70 - zeroTaxHappyChange;
				}
			}

			//console.log("Planet " + planet.name + ": Taxing Colonists with " +
			//var maxFutureHappiness = planet.colonisthappypoints + 2*HISSeffect + zeroTaxHappyChange; // Happiness next turn if no tax

			if (planet.clans < minColClansForTaxing && plg.roboColGrowthIsPossible(planet)){
				// Too few clans - let them grow unless climate won't allow it!
				console.log("Planet " + planet.id + "has population too low for taxing",plg.roboColGrowthIsPossible(planet));
				planet.colonisttaxrate = 0;
				return;
			}
			if (useGrowthTaxforColonists) {
				// Don't tax this turn if happiness is still rising.
				// Try not to "waste" happiness points. Tax if happiness would rise
				// to 100 without taxing.
				// With hissers, assume that the same number will be present next turn.
				// Next turn's hissing will be counted so that hiss effect won't be
				// wasted next turn.
				if (planet.colonisthappypoints + 2*HISSeffect + zeroTaxHappyChange < 100) {
					planet.colonisttaxrate = 0;
					return;
				}
			}
			// Tax them!
			console.log("Taxing colonists: ",planet.id,HISSeffect,useGrowthTaxforColonists,minColHappiness);
			// This is the happiness when taxing begins:
			var startingHappiness = Math.min(planet.colonisthappypoints + HISSeffect,100);
			// This is the maximum change in happiness that is possible according to
			// our tax strategy:
			var maxColHappyChange = minColHappiness - startingHappiness;
			planet.colonisttaxrate = plg.roboFindColonistRate(planet, maxColHappyChange);
		},

		roboFindColonistRate: function(planet, maxHappyChange) {
			// Find the tax rate needed to achieve a certain happiness change
			// This function was inspired by tax management code from Dotman's
			// Planetary Management Plugin (version 1.20). Code from the
			// colonistTaxAmount function in the planets.nu client was also
			// adapted for this function.
			var plg = vgap.plugins["roboMaxPlugin"];
			for (var rate = 1; rate <= 100; rate++) {
				// Find tax amount for this rate
				var colTax = Math.round(rate * planet.clans / 1000);
				//var taxbonus = 1; //player tax rate
				if (vgap.advActive(2)) // Fed 2X bonus
					colTax *= 2;
				//console.log(planet.id,"Rate",rate,colTax, plg.roboColonistHappyChange(planet,rate));
				if (plg.roboColonistHappyChange(planet,rate) < maxHappyChange) {
					if (colTax == 0) return 0; // Don't tax if taxing yields no money
					return rate-1; // Otherwise, we have found our tax rate
				}

				// Make sure that we don't tax more than we can collect:
				//colTax = colTax * taxbonus;
				if (colTax > 5000)
					return rate-1;
			}
			if (plg.roboColonistHappyChange(planet,100) > maxHappyChange)
				return 100
			else
				return 0;
		},

		roboColonistHappyChange: function(planet,r) {
			// Calculate the native happiness change given a tax rate.
			// Based on the colonistTaxChange function in the planets.nu client.
			var change = 0;
			if (vgap.player.raceid == 7) //crystal
				change = Math.truncate((1000 - (80 * r) - Math.sqrt(planet.clans) - ((planet.mines + planet.factories) / 3) - (3 * (100 - planet.temp))) / 100);
			else
				change = Math.truncate((1000 - (80 * r) - Math.sqrt(planet.clans) - ((planet.mines + planet.factories) / 3) - (3 * Math.abs(planet.temp - 50))) / 100);
			return change;
		},

		roboSetNativeTax: function(planet,HISSeffect) {
			// This function was inspired by tax management code from Dotman's
			// Planetary Management Plugin (version 1.20).
			var plg = vgap.plugins["roboMaxPlugin"];
			console.log("Entered roboSetNativeTax: ",planet.id,HISSeffect,planet.nativeclans);

			//var rate;
			var maxfactories = plg.roboMaxBldgs(planet,100);
			var useGrowthTaxforNatives = true;
			var minNatHappiness = 70;
			var minNatClansForTaxing = 2500; // Don't tax if less than this number
			var zeroTaxHappyChange = plg.roboNativeHappyChange(planet, 0);
			var nativeGrowthIsPossible = true;

			// Decide on a native tax strategy

			if (planet.factories < maxfactories) {
				// Tax more aggressively if we are still building factories
				useGrowthTaxforNatives = false;
				minNatHappiness = 70;
			}
			if (planet.nativeclans > 66000 && planet.nativeclans < plg.getMaxNatives(planet,false)) {
				// Tax more aggressively if population is high but can still grow
				useGrowthTaxforNatives = false;
				minNatHappiness = 70;
				//console.log("Planet " + planet.name + ": Native  Assigning mid tax");

				// Exceptions to this rule:

				// Always grow bovinoids
				if (planet.nativetype == 2)
					useGrowthTaxforNatives = true;

				// Continue to grow insectoids and avians if government is good
				if ((planet.nativetype == 4 || planet.nativetype == 6)  && planet.nativegovernment >= 120)
					useGrowthTaxforNatives = true;
			}

			// Safe tax if population can't grow
			if (planet.nativeclans >= plg.getMaxNatives(planet,false)) {
				// No more native growth is possible, so tax even more aggressively
				nativeGrowthIsPossible = false;
				useGrowthTaxforNatives = false;
				minNatHappiness = 40;
				//console.log("Planet " + planet.name + ": Assigning max tax");
				if (vgap.player.raceid == 1 && (planet.temp < 15 || planet.temp > 84)) {
					// Feds might terraform these, so don't tax so aggressively
					minNatHappiness = 70 - zeroTaxHappyChange;
				} else if (vgap.player.raceid == 2 && planet.temp > 84) {
					// Lizards might terraform these, so don't tax so aggressively
					minNatHappiness = 70 - zeroTaxHappyChange;
				} else if (vgap.player.raceid == 7 && planet.temp < 100) {
					// Crystals might terraform these, so don't tax so aggressively
					minColHappiness = 70 - zeroTaxHappyChange;
				}
			}
			if (planet.nativeclans < minNatClansForTaxing && nativeGrowthIsPossible){
				// Don't tax at all if native population is very low and can grow
				//console.log("Planet " + planet.name + ": Nat Tax < Min Clans, 0");
				planet.nativetaxrate = 0;
				return;
			}
			if (vgap.player.raceid == 6) {
				// Cyborg should tax natives very aggressively
				useGrowthTaxforNatives = false;
				minNatHappiness = 40;
				//console.log("Planet " + planet.name + ": Native Assigning max tax");
			}
			//rate = plg.roboGetTaxNat(planet,useGrowthTaxforNatives,minNatHappiness);
			planet.nativetaxrate = rate;

			// Don't tax amorphous natives
			if (planet.nativetype == 5) {
				planet.nativetaxrate = 0;
				return;
			}

			// Now determine the appropriate tax rate

			//console.log("nathap + maxhapchng + hapmod = " + (planet.nativehappypoints+maxhapchng+hapmod) + ", compval is " + (100-hapmod));
			if (useGrowthTaxforNatives) {
				// Don't tax this turn if happiness is still rising.
				// Try not to "waste" happiness points. Tax if happiness would rise
				// to 100 without taxing.
				// With hissers, assume that the same number will be present next turn.
				// Next turn's hissing will be counted so that hiss effect won't be
				// wasted next turn.
				if (planet.nativehappypoints + 2*HISSeffect + zeroTaxHappyChange < 100) {
					planet.nativetaxrate = 0;
					return;
				}
			}

			// This is the happiness when taxing begins:
			var startingNativeHappiness = Math.min(planet.nativehappypoints + HISSeffect,100);
			// This is the maximum change in happiness that is possible according to
			// our tax strategy:
			var maxNatHappyChange = minNatHappiness - startingNativeHappiness;

			var rate = plg.roboFindNativeRate(planet, maxNatHappyChange, false);

			if (vgap.player.raceid == 6 && rate > 20)
                rate = 20; // Cyborg can't tax natives above 20%

			planet.nativetaxrate = rate;

		},

		roboFindNativeRate: function(planet, maxHappyChange, calcIdealRate) {
			// This function was inspired by tax management code from Dotman's
			// Planetary Management Plugin (version 1.20). Code from the
			// nativeTaxAmount function in the planets.nu client was also
			// adapted for this function.

			// Calculate the native rate rate for a planet given a
			// certain happiness change.
			// calIdealRate: If true, calculate what the rate would be
			// regardless of the actual colonist population. Otherwise,
			// return a rate that can be supported by the population.

			console.log("roboFindNativeRate",planet.id,maxHappyChange,calcIdealRate);
			var plg = vgap.plugins["roboMaxPlugin"];

			for (var rate = 1; rate <= 100; rate++) {
				// Look for the tax rate that results in maxHappyChange
				// console.log("rate,roboNativeHappyChange:", rate, plg.roboNativeHappyChange(planet,rate))
				if (plg.roboNativeHappyChange(planet,rate) < maxHappyChange)
					return rate-1;

				// Make sure that we don't tax more than we can collect:
				var maxCanCollect = planet.clans;
				var nativeTax = Math.round(rate * planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000);
				//var taxbonus = 1; //player tax rate
				if (vgap.advActive(2)) { // Fed 2X bonus
					//taxbonus = 2;
					maxCanCollect *= 2;
					nativeTax *= 2;
				}
				//nativeTax = nativeTax * taxbonus;

				// Insectoid tax bonus
				if (planet.nativetype == 6) {
					maxCanCollect *= 2;
					nativeTax *= 2;
				}
				if (maxCanCollect > 5000)
					maxCanCollect = 5000; // 5000 is the absolute limit
				//console.log("nativeTax",planet.id,nativeTax,planet.clans,plg.roboNativeHappyChange(planet,rate));

				if (nativeTax > maxCanCollect && calcIdealRate == false) {
					return rate-1;
				}

				// if (vgap.player.raceid != 1 && nativeTax > planet.clans) { 					return rate-1; // Can't collect more than our number of clans 				} else if (vgap.player.raceid == 1 && vgap.advActive(2) && nativeTax > 2*planet.clans) { 					console.log("Fed bonus active. ",nativeTax); 					return rate-1; // Feds with bonus 				} else if (vgap.player.raceid == 1 && nativeTax > planet.clans) { 					console.log("Fed bonus inactive. ",nativeTax); 					return rate-1; // Feds without bonus 				}
				// if (nativeTax > 5000)
					// return rate-1; // Can't collect more than 5000
			}
			return 0;
		},

		roboNativeHappyChange: function (planet,rate) {
			// Calculate the native happiness change given a tax rate.
			// Based on the nativeTaxChange function in the planets.nu client.

			var change = Math.truncate((1000 - Math.sqrt(planet.nativeclans) - (rate * 85) - Math.truncate((planet.factories + planet.mines) / 2) - (50 * (10 - planet.nativegovernment))) / 100);

			if (planet.nativetype == 4) //avian
				change += 10;

			if (vgap.getNebulaIntensity(planet.x, planet.y) >= 80) //50ly visibility
				change += 5;

			return change;
		},

		roboHISSeffect: function (planet) {
			// Calculate effect of hissers on happiness
			if (vgap.player.raceid != 2) {
				// Not Lizard, so we can't count hissers
				return 0;
			} else {
				var HISSeffect = 0;
				var plships = vgap.shipsAt(planet.x, planet.y);
				for (var i = 0; i < plships.length; i++) {
					if (plships[i].ownerid == vgap.player.id && plships[i].mission == 8) {
						console.log("Ship", plships[i].id,"is hissing!");
						HISSeffect += 5;
					}
				}
				console.log("HISSeffect", planet.id,HISSeffect);
				return HISSeffect;
			}
		},

		getMaxNatives: function(planet) {
			// This code was adapted from the nativePopGrowth function in the planets.nu client.
			if (planet.nativetype == 9) {
				//siliconoid like it hot
				return nativeMax = planet.temp * 1000;
			}
			else
				return nativeMax = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 150000);
		},

		getMaxColonists: function(planet) {
			// This code was adapted from the maxPop function in the planets.nu client.
			var player = vgap.getPlayer(planet.ownerid);
			var raceId = player.raceid;

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

			//if (!getGrowth)
				return maxSupported;

			// NOTE: This next part doesn't make much sense. Delete it????

			//determine how much we are overpopulated
			// var overPopulation = Math.ceil((planet.clans - maxSupported) * (climateDeathRate / 100));
			// if (overPopulation > 0) {
				// //recalculate maxsupported/overpopulation
				// maxSupported = maxSupported + Math.round(planet.supplies * 10 / 40);
				// overPopulation = Math.ceil((planet.clans - maxSupported) * (climateDeathRate / 100));

				// //update population
				// colGrowth = -1 * Math.max(0, overPopulation);
			// }
			// return colGrowth;
		},

		roboColGrowthIsPossible: function (planet) {
			// returns true is colonists can grow
			// (based only on temperature, population and planet type)
			var plg = vgap.plugins["roboMaxPlugin"];
			colMax = plg.getMaxColonists(planet)

			if (planet.debrisdisk = 0) {
				return false; // planetoids do not have an atmosphere
			}

            //crystals like it hot
            if (vgap.player.raceid == 7) {
                if (planet.temp > 0 && planet.clans < colMax) {
					return true;
				} else {
					return false;
				}
            }
            if (planet.temp >= 15 && planet.temp <= 84 && planet.clans < colMax) {
				return true;
			} else {
				return false;
			}
        },

///////////////////////////////////////////////////////////////////////////////////
////  Diplomacy Section
///////////////////////////////////////////////////////////////////////////////////

		roboIsEnemy: function (playerID) {
            //console.log("Determining if player",playerID,"is an enemy");
			// Returns true if playerID is of an enemy

			if (playerID == 0) return false; // Entity is unowned
			if (playerID == vgap.player.id) return false; // We are not our enemy

			var relation = vgap.getRelation(playerID);
			if (relation == null) console.log("No diplomatic relation found for player",playerID);

			// "None"
			if (relation.relationto == 0) return true;
			// "Communication Blocked
			else if (relation.relationto == -1) return true;
			// "Open Communication"
			else if (relation.relationto == 1) return true;

			// "Peace Agreement"
			else if (relation.relationto == 2) return false;
			// "Intelligence Agreement"
			else if (relation.relationto == 3) return false;
			// "Full Alliance"
			else if (relation.relationto == 4) return false;

			else return null;
		},

///////////////////////////////////////////////////////////////////////////////////
////  Planetary Structures Section
////  1. roboBuildFactories
////  2. roboBuildMines
////  3. roboBuildDefenses
////  4. roboEnemyThreatsNearby
////  5. roboMaxBldgs
///////////////////////////////////////////////////////////////////////////////////

		roboBuildFactories: function() {
			// Builds Factories
			var plg = vgap.plugins["roboMaxPlugin"];
            console.log("Constructing factories at planets");

			// Use vgap.settings.nosupplies to determine if the nosupplies option is set

			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				//console.log(".Constructing factories for planet",planet.id);

				var numbuildtemp = 999; // Always build as many factories as possible

				// number we can build is limited by supplies and megacredits
				if (!vgap.settings.nosupplies && planet.supplies < numbuildtemp)
					numbuildtemp = planet.supplies;
				// Don't sell supplies if there is no money and there are
				// taxable natives present, unless you have many supplies.
				if (planet.megacredits == 0 && planet.nativeclans > 0 && planet.nativetype != 5 && planet.supplies < 250) {
					var available_supplies = 0;
				} else {
					var available_supplies = planet.supplies;
				}
				// if ((planet.megacredits + planet.supplies) < (numbuildtemp * 4))
				// 	numbuildtemp = Math.floor((planet.megacredits + planet.supplies) / 4);
				if ((planet.megacredits + available_supplies) < (numbuildtemp * 4))
					numbuildtemp = Math.floor((planet.megacredits + available_supplies) / 4);
				// number we can build is limited by population
				var maxbld = plg.roboMaxBldgs(planet,100);
				//if (planet.factories > maxbld) numbuildtemp = 0;
				//if (numbuildtemp + planet.factories > maxbld) numbuildtemp = maxbld - planet.factories;
				if (planet.factories >= maxbld) {
				  numbuildtemp = 0;
				} else if (numbuildtemp + planet.factories > maxbld) {
				  numbuildtemp = maxbld - planet.factories;
				}

				// Sell supplies if needed
				if (planet.megacredits < (numbuildtemp * 3)) {
					var diff = (numbuildtemp * 3) - planet.megacredits;
					planet.megacredits += diff;
					planet.supplies -= diff;
					planet.suppliessold += diff;
				}
				// Build the factories
				//console.log("Building",numbuildtemp,"factories at planet",planet.id);
				if (!vgap.settings.nosupplies) {
					// Building under normal rules
					planet.supplies -= numbuildtemp;
					planet.megacredits -= numbuildtemp * 3;
				} else {
					// Only megacredits are used for building
					planet.megacredits -= numbuildtemp * 4;
				}
				planet.builtfactories += numbuildtemp;
				planet.factories += numbuildtemp;

				planet.changed = 1;
			}
		},

		roboBuildMines: function() {
			// Builds Mines
			var plg = vgap.plugins["roboMaxPlugin"];
            console.log("Constructing Mines and Defense Posts at planets");

			// Effect of race ability on mining rate
			var miningrate = 1;
			if (vgap.advActive(31))
				miningrate = 2; // Lizard
			else if (vgap.advActive(4))
				miningrate = 0.7; // Fed

			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				//console.log(".Constructing mines for planet",planet.id);

				// Other factors affecting mining rate:
				var mineRateFactor = 1;
				if (planet.nativetype == 3) // Reptilians
					mineRateFactor *= 2;
				if (planet.debrisdisk > 0 && vgap.getStarbase(planet.id) != null)
					mineRateFactor *= 2; // Mining station

				var numbuildtemp = 0;
				var turnsToMineOut = 30; // Build enough mines to mine everything out in 30 turns
				var mines;
				var x = turnsToMineOut * miningrate * mineRateFactor;
				if (!vgap.settings.unlimitedfuel) {
					// Don't check neutronium if there is unlimited fuel
					mines = Math.round(planet.groundneutronium / x / planet.densityneutronium * 100.0);
					if (mines > numbuildtemp) numbuildtemp = mines;
				}
				mines = Math.round(planet.groundduranium / x / planet.densityduranium * 100.0);
				if (mines > numbuildtemp) numbuildtemp = mines;
				mines = Math.round(planet.groundtritanium / x / planet.densitytritanium * 100.0);
				if (mines > numbuildtemp) numbuildtemp = mines;
				mines = Math.round(planet.groundmolybdenum / x / planet.densitymolybdenum * 100.0);
				if (mines > numbuildtemp) numbuildtemp = mines;
				numbuildtemp = numbuildtemp - planet.mines;

				//planet.targetmines = numbuildtemp; // indicate target number of mines in user interface

				// number we can build is limited by supplies and megacredits
				if (!vgap.settings.nosupplies && planet.supplies < numbuildtemp)
					numbuildtemp = planet.supplies;
				// Don't sell supplies if there are taxable natives present,
				// unless you have many supplies.
				if (planet.megacredits == 0 && planet.nativeclans > 0 && planet.nativetype != 5 && planet.supplies < 250) {
					var available_supplies = 0;
				} else {
					var available_supplies = planet.supplies;
				}

				// if ((planet.megacredits + planet.supplies) < (numbuildtemp * 5))
				// 	numbuildtemp = Math.floor((planet.megacredits + planet.supplies) / 5);
				if ((planet.megacredits + available_supplies) < (numbuildtemp * 5))
					numbuildtemp = Math.floor((planet.megacredits + available_supplies) / 5);
				// number we can build is limited by population
				var maxbld = plg.roboMaxBldgs(planet,200);
				//if (planet.mines > maxbld) numbuildtemp = 0;
				//if (numbuildtemp + planet.mines > maxbld) numbuildtemp = maxbld - planet.mines;
				if (planet.mines >= maxbld) {
					numbuildtemp = 0;
				} else if (numbuildtemp + planet.mines > maxbld) {
					numbuildtemp = maxbld - planet.mines;
				}
				if (numbuildtemp < 0) numbuildtemp = 0;
				//sell supplies if needed
				if (planet.megacredits < (numbuildtemp * 4)) {
					var diff = (numbuildtemp * 4) - planet.megacredits;
					planet.megacredits += diff;
					planet.supplies -= diff;
					planet.suppliessold += diff;
				}
				// build the mines
				//console.log("Building",numbuildtemp,"mines at planet",planet.id);
				if (!vgap.settings.nosupplies) {
					// Build under normal rules
					planet.supplies -= numbuildtemp;
					planet.megacredits -= numbuildtemp * 4;
				} else {
					// Only megacredits are used for building
					planet.megacredits -= numbuildtemp * 5;
				}
				planet.builtmines += numbuildtemp;
				planet.mines += numbuildtemp;

				planet.changed = 1;
			}
		},

		roboBuildDefenses: function() {
			// Builds Defense Posts
			var plg = vgap.plugins["roboMaxPlugin"];
                        console.log("Constructing Mines and Defense Posts at planets");

			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				//console.log(".Constructing defense posts for planet",planet.id);

				var numbuildtemp = 15; // Make sure there are at least 15 defense posts
				// Check for presence of starbase. Build up to 57 defenses,
				// but not in the opening turns.
				if (vgap.settings.turn > 8 && vgap.getStarbase(planet.id) != null)
					numbuildtemp = 57; // build extra defenses at each starbase
				// for (var k = 0; k < vgap.mystarbases.length; k++) {
					// var sb = vgap.mystarbases[k];
					// if (planet.id == sb.planetid) {
						// numbuildtemp = 57; // build extra defenses at each starbase
						// break;
					// }
				// }
				// Check for nearby threats
				// Maximize defenses if threats detected,
				// but not in the earliest turns.
				if (vgap.settings.turn > 6 && plg.roboEnemyThreatsNearby(planet)) {
					console.log(".Enemy activity was detected near our planet",planet.id,". Maximizing planetary defenses.");
					numbuildtemp = 999;
				}

				numbuildtemp = numbuildtemp - planet.defense;

				// number we can build is limited by supplies and megacredits
				if (!vgap.settings.nosupplies && planet.supplies < numbuildtemp)
					numbuildtemp = planet.supplies;
				// Don't sell supplies if there are taxable natives present,
				// unless you have many supplies.
				if (planet.megacredits == 0 && planet.nativeclans > 0 && planet.nativetype != 5 && planet.supplies < 250) {
					var available_supplies = 0;
				} else {
					var available_supplies = planet.supplies;
				}

				// if ((planet.megacredits + planet.supplies) < (numbuildtemp * 11))
				// 	numbuildtemp = Math.floor((planet.megacredits + planet.supplies) / 11);
				if ((planet.megacredits + available_supplies) < (numbuildtemp * 11))
					numbuildtemp = Math.floor((planet.megacredits + available_supplies) / 11);
				// number we can build is limited by population
				var maxbld = plg.roboMaxBldgs(planet,50);
				//if (planet.defense > maxbld) numbuildtemp = 0;
				//if (numbuildtemp + planet.defense > maxbld) numbuildtemp = maxbld - planet.defense;
				if (planet.defense > maxbld) {
					numbuildtemp = 0;
				} else if (numbuildtemp + planet.defense > maxbld) {
					numbuildtemp = maxbld - planet.defense;
				}
				if (numbuildtemp < 0) numbuildtemp = 0;

				//sell supplies if needed
				if (planet.megacredits < (numbuildtemp * 10)) {
					var diff = (numbuildtemp * 10) - planet.megacredits;
					planet.megacredits += diff;
					planet.supplies -= diff;
					planet.suppliessold += diff;
				}
				// build the defense posts
				//console.log("Building",numbuildtemp,"defense posts at planet",planet.id);
				if (!vgap.settings.nosupplies) {
					// Build under normal rules
					planet.supplies -= numbuildtemp;
					planet.megacredits -= numbuildtemp * 10;
				} else {
					// Only megacredits are used for building
					planet.megacredits -= numbuildtemp * 11;
				}
				planet.builtdefense += numbuildtemp;
				planet.defense += numbuildtemp;

				planet.changed = 1;
			}
		},

		roboEnemyThreatsNearby: function(planet) {
			// Look for enemy activity near our planet
			var plg = vgap.plugins["roboMaxPlugin"];
            //console.log("Scanning for threats to planet",planet.id);

			// Check combat messages for nearby hostile activity
    			for (var k = 0; k < vgap.messages.length; k++) {
        			var message = vgap.messages[k];
        			if (message.messagetype == 6) {
            				// combat report
					var distance = Math.dist(planet.x, planet.y, message.x, message.y);
					if (distance < 200) return true;
        			}
    			}
			// Check for enemy ships nearby
			for (var k = 0; k < vgap.ships.length; k++) {
				var s = vgap.ships[k];
				if (s.ownerid == vgap.player.id) continue; // player's ship
				if (plg.roboIsEnemy(s.ownerid)) {
					var distance = Math.dist(planet.x, planet.y, s.x, s.y);
					if (distance < 200) return true;
				}
			}
			// Check for enemy planets nearby
			for (var k = 0; k < vgap.planets.length; k++) {
				var p = vgap.planets[k];
				if (p.ownerid == 0) continue; // unowned planet
				if (p.ownerid == vgap.player.id) continue; // player's planet
				if (plg.roboIsEnemy(p.ownerid)) {
					var distance = Math.dist(planet.x, planet.y, p.x, p.y);
					if (distance < 200) return true;
				}
			}
			return false;
		},

		roboMaxBldgs: function (planet,baseAmount) {
			// This function was adapted from the maxBuilding function in the planets.nu client
			// baseAmount is 100 for factories, 200 for mines, 50 for defense
			if (planet.clans <= baseAmount)
				return planet.clans;
			else
				return Math.floor(baseAmount + Math.sqrt(planet.clans - baseAmount));
		},

///////////////////////////////////////////////////////////////////////////////////
////  Planetary Friendly Code Section
////  1. roboMaxRandomizePlanetFcodes
////  2. roboPermuteFcode
///////////////////////////////////////////////////////////////////////////////////

		roboMaxRandomizePlanetFcodes: function () {
			// Manage planetary friendly codes
			var plg = vgap.plugins["roboMaxPlugin"];
			plg.roboStatusUpdate(0,"Managing planetary friendly codes");
            console.log("Managing planetary friendly codes");

			// Planet fcode behavior for RoboMax:
			// Don't change fcodes that start with "x"
			// Recognize special fcodes, but permute them
			// Randomize non-special fcodes

			const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
			// For the first position in a randomized fcode, the letters
			// 'a', 'n', 'b', 'e', 'd', 'p', 'm', 'x', and 'n' are eliminated
			// so that special friendly codes are not generated.
			const abc1 = "cfghijkloqrstuvwyz0123456789";

			for (var j = 0; j < vgap.myplanets.length; j++) {
				var planet = vgap.myplanets[j];
				var fcode = planet.friendlycode;

				if (fcode.substring(0, 1).toLowerCase() == "x") {
					// Do nothing if is starts with "x".
					// The idea is that Birds cannot set your friendly code to one that
					// starts with an x, so anything that starts with an x is intentional.
				} else if (	fcode.toLowerCase() == "att" ||
							fcode.toLowerCase() == "nuk" ||
							fcode.toLowerCase() == "bum" ||
							fcode.toLowerCase() == "edf" ||
							fcode.toLowerCase() == "dmp" ) {
					plg.roboPermuteFcode(planet); // Permute special friendly code
				} else if ( fcode.substring(0, 2).toLowerCase() == "pb" ||
							fcode.substring(0, 2).toLowerCase() == "mf") {
					plg.roboPermuteFcode(planet); // Permute special friendly code
				} else {
					// Create new alphanumeric fcode
					var r1 = Math.floor(Math.random()*abc1.length);
					var r2 = Math.floor(Math.random()*36);
					var r3 = Math.floor(Math.random()*36);
					planet.friendlycode = abc1[r1] + abc[r2] + abc[r3];
					plg.roboPermuteFcode(planet); // Permute friendly code
				}

				planet.changed = 1;
			}
		},

		roboPermuteFcode: function (entity) {
			// Create a random permuation of a friendly code
			entity.friendlycode = entity.friendlycode.toLowerCase();
			var r1 = Math.random(); var r2 = Math.random(); var r3 = Math.random();
			var a1 = entity.friendlycode.charAt(0).toLowerCase();
			var a2 = entity.friendlycode.charAt(1).toLowerCase();
			var a3 = entity.friendlycode.charAt(2).toLowerCase();
			if (r1 < 0.5) a1 = entity.friendlycode.charAt(0).toUpperCase();
			if (r2 < 0.5) a2 = entity.friendlycode.charAt(1).toUpperCase();
			if (r3 < 0.5) a3 = entity.friendlycode.charAt(2).toUpperCase();
			entity.friendlycode = a1 + a2 + a3;
		},

		checkIfMobileVersion: function() {
			// This function adapted from Kedalion's Enemy ship list plugin:
			url = window.location.href;
			if (vgap.version >= 4.0) {
				console.log("Mobile client code detected...");
				return true;
			}
			else {
				console.log("Non-mobile client code detected...");
				return false;
			}
		},

//***********************************************************************************************

	};

	// register your plugin with NU
	vgap.registerPlugin(roboMaxPlugin, "roboMaxPlugin");

} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper1 + ")();";

document.body.appendChild(script);
