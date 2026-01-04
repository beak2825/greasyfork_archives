// ==UserScript==
// @name          VGA Bot
// @namespace     daunting/bot
// @version       0.1
// @date          2018-04-01
// @author        Daunting
// @description   NU bot for playing
// @include       http://planets.nu/*
// @include       http://play.planets.nu/*
// @include       http://test.planets.nu/*
// @include				userscript
// @resource      userscript https://greasyfork.org/en/scripts/40166-vga-bot
// @homepage      http://planets.nu
// @require 			https://greasyfork.org/scripts/47367-vga-bot-core/code/VGA%20Bot-Core.js?version=762362
// @downloadURL https://update.greasyfork.org/scripts/40166/VGA%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/40166/VGA%20Bot.meta.js
// ==/UserScript==
function wrapper () { // wrapper for injection
    
   if (vgap.version < 3.0) 
   {
      console.log("Bot plugin requires at least NU version 3.0. Plugin disabled." );
      return;	
   }
	
   var plugin_version = 0.1;
   
   console.log("Bot plugin version: v" + plugin_version );
    
   /**
   *  Specify your plugin
   *  You need to have all those methods defined or errors will be thrown. 
   *  I inserted the print-outs in order to demonstrate when each method is 
   *  being called. Just comment them out once you know your way around.
   *  
   *  For any access to plugin class variables and methods, 
   *  "vgap.plugins["vgaBot"].my_variable" has to be used 
   *  instead of "this.my_variable".
   */
   var vgaBot = 
   {			

      /**
       * processload: executed whenever a turn is loaded: either the current turn or
       * an older turn through time machine 
       */
      processload: function() 
      {
	 			console.log("ProcessLoad: plugin called.");
      },
			
      /**
       * loaddashboard: executed to rebuild the dashboard content after a turn is loaded
       */
      loaddashboard: function() 
      {
        
   			console.log("LoadDashboard: plugin called.");
        
        //Only enable add the run turn button if in a hosted game.
   			if (vgap.player.username == vgap.game.createdby)
        {
	 				//add Link to Run turn to left Dashboard menu
          var menu = document.getElementById("DashboardMenu").childNodes[1]; //insert into left summary
          $("<li>Run Turn &raquo;</li>").tclick(function () { vgap.plugins["vgaBot"].runTurn(); }).appendTo(menu);
        }
      },

      /**
       * showdashboard: executed when switching from starmap to dashboard
       */
      showdashboard: function() 
      {
	 			console.log("ShowDashboard: plugin called.");
      },
			
      /**
       * showsummary: executed when returning to the main screen of the dashboard
       */
      showsummary: function() 
      {
	 			console.log("ShowSummary: plugin called.");
      },
			
      /**
       * loadmap: executed after the first turn has been loaded to create the map
       * as far as I can tell not executed again when using time machine
       */
      loadmap: function() 
      {
	 			console.log("LoadMap: plugin called.");
      },
			
      /**
       * showmap: executed when switching from dashboard to starmap
       */
      showmap: function() 
      {
	 			console.log("ShowMap: plugin called.");
      },
			
      /**
       * draw: executed on any click or drag on the starmap
       */			
      draw: function() 
      {
	 			console.log("Draw: plugin called.");
      },		
			
      /**
       * loadplanet: executed a planet is selected on dashboard or starmap
       */
      loadplanet: function() 
      {
	 			console.log("LoadPlanet: plugin called.");
      },
			
      /**
       * loadstarbase: executed a planet is selected on dashboard or starmap
       */
      loadstarbase: function() 
      {
        console.log("LoadStarbase: plugin called.");
      },
			
      /**
       * loadship: executed a planet is selected on dashboard or starmap
       */
      loadship: function() 
      {
				console.log("LoadShip: plugin called.");
      },
			
      /***************************************************************************************
       * Custom plugin variables
       ***************************************************************************************/
      expansionPlanets: [],
      cloakEnemyPlanets: [],

      resetVars: function()
      {
     		vgap.plugins["vgaBot"].expansionPlanets = [];
        vgap.plugins["vgaBot"].cloakEnemyPlanets = [];
      },
       
      /***************************************************************************************
       * Custom plugin methods
       ***************************************************************************************/
      runTurn: function() 
      {
        var plugin = vgap.plugins["vgaBot"];
                
        plugin.resetVars();
        plugin.unloadFreighters();
        plugin.buildShips();
        plugin.buildStructures();
        plugin.tax();
        
        plugin.moveShips();
        
        vgap.turnReady();
      },
     
     /*****************************
     * Unload freighters
     ******************************/

     unloadFreighters: function()
     {
       for (var i=0; i<vgap.myships.length; i++)
       {
         var ship = vgap.myships[i];
         var planet = vgap.plugins["vgaBot"].orbittingPlanet(ship);
         if (planet != null && planet.ownerid == ship.ownerid)
         {
           vgap.plugins["vgaBot"].unloadToPlanet(ship, planet);           
         }
         else if (planet != null && planet.ownerid == 0)
         {
           vgap.plugins["vgaBot"].colonizePlanet(ship, planet);
         }
         //Someone else's planet! Can I take it?
         else if (planet != null)
         {
           vgap.plugins["vgaBot"].groundCombat(ship, planet);
         }
       }
     },
     
     unloadToPlanet: function(ship, planet)
     {
     		vgap.plugins["vgaBot"].transferClans(ship, planet, ship.clans);
        vgap.plugins["vgaBot"].transferSupplies(ship, planet, ship.supplies);
        vgap.plugins["vgaBot"].transferDur(ship, planet, ship.duranium);
        vgap.plugins["vgaBot"].transferTrit(ship, planet, ship.tritanium);
        vgap.plugins["vgaBot"].transferMoly(ship, planet, ship.molybdenum);
        vgap.plugins["vgaBot"].transferCredits(ship, planet, ship.megacredits);
     },
     
     colonizePlanet: function(ship, planet)
     {
       if (planet.nativeclans > 0)
       {
         vgap.plugins["vgaBot"].unloadToPlanet(ship, planet);
       }
       else
       {
         vgap.plugins["vgaBot"].transferClans(ship, planet, 1);
       }
     },
     
     groundCombat: function(ship, planet)
     {
       if (ship.clans > 0)
     			vgap.plugins["vgaBot"].unloadToPlanet(ship, planet);
     },
     
     transferClans: function(src, dest, nClans)
     {
       if (src.clans >= nClans)
       {
          if (dest.ownerid == src.ownerid)
          {
            dest.clans += nClans;
            dest.changed = 1;
          }
          else
          {
            src.transferclans += nClans;
            vgap.plugins["vgaBot"].setTransferTarget(src, dest);
          }
          src.clans -= nClans;
          src.changed = 1;
       }
     },
          
     transferSupplies: function(src, dest, nSupplies)
     {
       if (src.supplies >= nSupplies)
       {
          if (dest.ownerid == src.ownerid)
          {
            dest.supplies += nSupplies;
            dest.changed = 1;
          }
          else
          {
            src.transfersupplies += nSupplies;         
            vgap.plugins["vgaBot"].setTransferTarget(src, dest);
          }
          src.supplies -= nSupplies;
          src.changed = 1;
       }
     },
          
     transferDur: function(src, dest, nDur)
     {
       if (src.duranium >= nDur)
       {
          if (dest.ownerid == src.ownerid)
          {
            dest.duranium += nDur;
            dest.changed = 1;
          }
          else
          {
            src.transferduranium += nDur;
					  vgap.plugins["vgaBot"].setTransferTarget(src, dest);
          }
         
          src.duranium -= nDur;
          src.changed = 1;
       }
     },
     
     transferTrit: function(src, dest, nTrit)
     {
       if (src.tritanium >= nTrit)
       {
          if (dest.ownerid == src.ownerid)
          {
            dest.tritanium += nTrit;
            dest.changed = 1;
          }
          else
          {
            src.transfertritanium += nTrit;
            vgap.plugins["vgaBot"].setTransferTarget(src, dest);
          }        
            
          src.tritanium -= nTrit;
          src.changed = 1;
       }
     },
     
     transferMoly: function(src, dest, nMoly)
     {
       if (src.molybdenum >= nMoly)
       {         
          if (dest.ownerid == src.ownerid)
          {
            dest.molybdenum += nMoly;
            dest.changed = 1;
          }
          else
          {
            src.transfermolybdenum += nMoly;          
            vgap.plugins["vgaBot"].setTransferTarget(src, dest);
          }
         
          src.molybdenum -= nMoly;
          src.changed = 1;
       }
     },
     
     transferCredits: function(src, dest, nCredits)
     {
       if (src.megacredits >= nCredits && dest.ownerid == src.ownerid)
       {
          dest.megacredits += nCredits;         
          src.megacredits -= nCredits;
          src.changed = 1;
          dest.changed = 1;
       }
     },
     
     setTransferTarget: function(src, dest)
     {  
        src.transfertargetid = dest.id;
        if (dest.isPlanet)
        	src.transfertargettype = 1;
        else if (dest.isShip)
          src.transfertargettype = 0;
     },
     
     
     /*****************************
     * Move Ships
     ******************************/
     moveShips: function()
     {
       for (var i=0; i<vgap.myships.length; i++)
       {
         var ship = vgap.myships[i];
         
         //Already going somewhere?
         if (ship.target != null && (ship.x != ship.target.x || ship.y != ship.target.y))
         		continue;
                                     
       	 vgap.plugins["vgaBot"].moveShip(ship);
         
         if (!vgap.plugins["vgaBot"].loadFuel(ship))
         {
           console.log("Not enough fuel for waypoint: " + ship.id);
           var planet = vgap.plugins["vgaBot"].orbittingPlanet(ship);
           vgap.plugins["vgaBot"].unloadToPlanet(ship, planet);
           vgap.plugins["vgaBot"].clearWaypoint(ship);
       		 vgap.plugins["vgaBot"].returnHome(ship);
           if (!vgap.plugins["vgaBot"].loadFuel(ship))
           {
              console.log("Not enough fuel for anything");
        		  vgap.plugins["vgaBot"].clearWaypoint(ship);
           }
         }
       }
     },
     
     moveShip: function(ship)
     {
       var moved = false;
        vgap.plugins["vgaBot"].clearWaypoint(ship);
       
        if (vgap.plugins["vgaBot"].shipAttack(ship))
          moved = true;
       
        if (!moved)
        {
          if (vgap.plugins["vgaBot"].shipExpand(ship))
          	moved = true;
        }
       
        if (!moved)
        {
          if (vgap.plugins["vgaBot"].shipEconomy(ship))
          	moved = true;
        }
       
        if (!moved)
        {
        	if (vgap.plugins["vgaBot"].shipExplore(ship))
          	moved = true;
        }
          
       	if (!moved)
        	vgap.plugins["vgaBot"].returnHome(ship);
       
        if (vgap.plugins["vgaBot"].shouldCloak(ship))
        	ship.mission = vgap.plugins["vgaBot"].missionEnum.CLOAK;
        else
          //ship.mission = vgap.plugins["vgaBot"].missionEnum.EXPLORATION;
          ship.mission = 0;
     },
     
     shipEconomy: function(ship)
     {
       return false;
     },
     
     shipExplore: function(ship)
     {
       return false;
     },
     
     shipExpand: function(ship)
     {
       var moved = false;
       var planet = vgap.plugins["vgaBot"].findNearestUnownedPlanet(ship);
       
       if (planet != null && vgap.plugins["vgaBot"].calcDistance(ship, planet) <= Math.pow(ship.engineid,2)*2 &&
          vgap.plugins["vgaBot"].loadForExpansion(ship))
       {
         vgap.plugins["vgaBot"].createWaypoint(ship, planet);
         vgap.plugins["vgaBot"].expansionPlanets.push(planet);
         moved = true;
         console.log("Ship " + ship.id + " expand");
       }
       
       return moved;
     },
     
     shipAttack: function(ship)
     {
       var moved = false;
       
       if (ship.beams > 0 || (ship.torps > 0 && ship.ammo > 0) || (ship.bays > 0 && ship.ammo > 0))
       {
          var planet = vgap.plugins["vgaBot"].findNearestEnemyPlanet(ship);
         
          if (planet != null && vgap.plugins["vgaBot"].loadForAssault(ship))
          {

            if (vgap.plugins["vgaBot"].hasOrbitingShip(planet))
            {
              console.log("SHIP IN ORBIT");
            }
            
         		 vgap.plugins["vgaBot"].createWaypoint(ship, planet);
             vgap.plugins["vgaBot"].cloakEnemyPlanets.push(planet);

             moved = true;
             console.log("Ship " + ship.id + " attack");
          }
       }
       
       return moved;
     },
     
     returnHome: function(ship)
     {
       var planet = vgap.plugins["vgaBot"].findNearestStarbase(ship);
       if (planet != null)
       	  vgap.plugins["vgaBot"].createWaypoint(ship, planet);
       console.log("Ship " + ship.id + " return");
     },
     
     findNearestStarbase: function(target)
     {
       var min = 100000;
       var ret = null;
       for (var i=0; i<vgap.planets.length; i++)
       {
         var planet = vgap.planets[i];
         if ( planet.ownerid == vgap.player.id && planet.isbase)
         {
            var distance = vgap.plugins["vgaBot"].calcDistance(planet, target);
           	if (distance < min)
            {
              min = distance;
              ret = planet;
            }
         }
       }
       
       return ret;
     },
     
     loadForExpansion: function(ship)
     {
       //Check if we are on our planet, and if there is stuff to load
       var planet = vgap.plugins["vgaBot"].orbittingPlanet(ship);
       if (planet != null && planet.ownerid == ship.ownerid)
       {
       		if (vgap.plugins["vgaBot"].canSpareClans(planet))
          {
            var hull = vgap.hulls.find(function(element) {
                return element.id == ship.hullid;
            });
            
            //Load 35% supplies, 70% clans, up to a max of 100 supplies
            var nSupplies = Math.truncate(Math.min(planet.supplies, Math.min(100, 0.35 * hull.cargo)));
            var nClans = Math.min(planet.clans-vgap.plugins["vgaBot"].planetMinClans(planet), hull.cargo-nSupplies);
            
            ship.clans = nClans;
            planet.clans -= nClans;
            
            ship.supplies = nSupplies;
            planet.supplies -= nSupplies;
          }
       }
       
       return ship.clans > 0;
     },
        
     loadForAssault: function(ship)
     {
       //Check if we are on our planet, and if there is stuff to load
       var planet = vgap.plugins["vgaBot"].orbittingPlanet(ship);
       if (planet != null && planet.ownerid == ship.ownerid)
       {
       		if (vgap.plugins["vgaBot"].canSpareClans(planet))
          {
            var hull = vgap.hulls.find(function(element) {
                return element.id == ship.hullid;
            });
            
            //Load 35% supplies, 70% clans, up to a max of 100 supplies
            var nClans = Math.min(planet.clans-vgap.plugins["vgaBot"].planetMinClans(planet), hull.cargo);
            
            ship.clans = nClans;
            planet.clans -= nClans;
          }
       }
       
       return ship.clans > 0;
     },
     
     canSpareClans: function(planet)
     {
       return planet.clans > vgap.plugins["vgaBot"].planetMinClans(planet);
     },
     
     planetMinClans: function(planet)
     {
       return 1;
     },
     
     orbittingPlanet: function(ship)
     {
       for (var i=0; i<vgap.planets.length; i++)
       {
         var planet = vgap.planets[i];
         if ( (ship.x == planet.x && ship.y == planet.y) )
         		return planet;
       }
       
       return null;
     },

     findNearestUnownedPlanet: function(thing)
     {
       var min = 100000;
       var ret = null;
       for (var i=0; i<vgap.planets.length; i++)
       {
         var planet = vgap.planets[i];
         if ( (thing.x != planet.x || thing.y != planet.y) && planet.ownerid == 0 &&
            !vgap.plugins["vgaBot"].alreadyGoingHere(planet))
         {
            var distance = vgap.plugins["vgaBot"].calcDistance(planet, thing);
           	if (distance < min)
            {
              min = distance;
              ret = planet;
            }
         }
       }
       
       return ret;
     },
     
     findNearestEnemyPlanet: function(thing)
     {
       var min = 100000;
       var ret = null;
       for (var i=0; i<vgap.planets.length; i++)
       {
         var planet = vgap.planets[i];
         if ( (thing.x != planet.x || thing.y != planet.y) && planet.ownerid != 0 && planet.ownerid != vgap.player.id)
         {
            var distance = vgap.plugins["vgaBot"].calcDistance(planet, thing);
           	if (distance < min)
            {
              min = distance;
              ret = planet;
            }
         }
       }
       
       return ret;
     },
       
     alreadyGoingHere: function(planet)
     {
       var ret = false;
       for (var i=0; i<vgap.plugins["vgaBot"].expansionPlanets.length; i++)
       {
         if (vgap.plugins["vgaBot"].expansionPlanets[i].id == planet.id)
           ret = true;
       }
       for (var i=0; i<vgap.plugins["vgaBot"].cloakEnemyPlanets.length; i++)
       {
         if (vgap.plugins["vgaBot"].cloakEnemyPlanets[i].id == planet.id)
           ret = true;
       }
       return ret;
     },
     
     calcDistance: function(a, b)
     {
       return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2));
     },
     
     createWaypoint: function(ship, dest)
     {
       var waypoint = {id:ship.id, x1:ship.x, y1:ship.y, x2:dest.x, y2:dest.y, color:"#009900", dasharray:null};
       ship.lastwaypoint=waypoint;
       //vgap.waypoints.push(waypoint);
       ship.targetx = dest.x;
       ship.targety = dest.y;
       ship.target = dest;
       ship.warp = ship.engineid;
       ship.changed = 1;
     },
     
     clearWaypoint: function(ship)
     {
       ship.lastwaypoint=null;
       ship.targetx = ship.x;
       ship.targety = ship.y;
       ship.target = null;
       ship.changed = 1;
     },
     
     loadFuel: function(ship)
     {
       	var fuelAvailable = vgap.plugins["vgaBot"].getFuelAvailable(ship);
       	var planet = vgap.plugins["vgaBot"].orbittingPlanet(ship);
        var sbPlanet = vgap.plugins["vgaBot"].findNearestStarbase(ship.target);
        var returnFuel = vgap.plugins["vgaBot"].calcFuelConsumption(ship, ship.target, sbPlanet, false);
        var needed = vgap.plugins["vgaBot"].calcFuelConsumption(ship, ship, ship.target, true) + returnFuel;
        
        var added = 0;
        console.log("Ship " + ship.id + ": Needed: " + needed + " Ship: " + ship.neutronium + " Available: " + fuelAvailable + " Return: " + returnFuel);
        while (needed > ship.neutronium && needed < fuelAvailable)
        {
          if (needed > ship.neutronium)
          {
            if (planet != null && planet.ownerid == vgap.player.id)
            {
              var adding = needed - ship.neutronium;
              added += adding;
              planet.neutronium -= adding;
              ship.neutronium += adding;
            }
          }
          needed = vgap.plugins["vgaBot"].calcFuelConsumption(ship, ship, ship.target, true) + returnFuel;
        }
       
        if (ship.neutronium < needed && added > 0)
        {
          ship.neutronium -= added;
          planet.neutronium += added;
        }
        else if (planet != null && planet.neutronium > 0 && planet.ownerid == vgap.player.id)
        {
          planet.neutronium -= 1;
          ship.neutronium += 1;
        }
         
        console.log("Added fuel: " + added);
        return ship.neutronium >= needed;
     },
     
     calcFuelConsumption: function(ship, start, dest, includeCargo)
     {
       var fuelFactor = vgap.plugins["vgaBot"].getFuelFactor(ship);
       var mass = vgap.plugins["vgaBot"].getMass(ship, includeCargo);
       var distance = vgap.plugins["vgaBot"].calcDistance(start, dest);
       
       var cloakFuel = 0;
       if (ship.mission == vgap.plugins["vgaBot"].missionEnum.CLOAK)
       {
       		var turns = Math.ceil(distance / Math.pow(ship.engineid,2));
       		var hull = vgap.getHull(ship.hullid);
          cloakFuel = Math.ceil(hull.mass / 20) * turns;
       }
       
       console.log("mass: " + mass + " cloakFuel: " + cloakFuel + " distance: " + distance + " factor: " + fuelFactor);
       return Math.truncate(fuelFactor * Math.truncate(mass / 10) * Math.truncate(distance / Math.pow(ship.engineid,2)) / 10000) + cloakFuel;
     },
          
     getFuelFactor: function(ship)
     {
       var engine = vgap.getEngine(ship.engineid);
       
       return engine.warps[ship.engineid-1];
     },

     getMass: function(ship, includeCargo)
     {
       var mass = 0;
       
       var hull = vgap.getHull(ship.hullid);
       mass += hull.mass;
       
       if (ship.torpedoid != 0)
       {
         var torps = vgap.getTorpedo(ship.torpedoid);
       	 mass += torps.mass * ship.torps;
       }
       if (ship.beamid != 0)
       {
         var beam = vgap.getBeam(ship.beamid);
       	 mass += beam.mass * ship.beams;
       }
       
       //Will still have ammo
       mass += ship.ammo;
       
       if (includeCargo)
       {
         mass += ship.duranium + ship.tritanium + ship.molybdenum + ship.supplies + ship.clans +
           ship.neutronium;
       }
       
       return mass;       
     },
       
     getFuelAvailable: function(ship)
     {
       var planet = vgap.plugins["vgaBot"].orbittingPlanet(ship);
       var fuel = ship.neutronium;
       
       if (planet != null && planet.ownerid == ship.ownerid)
         fuel += planet.neutronium;
       
       return fuel;
     },
     
     /****************************
     * Build Ships
     *****************************/
     
     buildShips: function()
     {
       for (var i=0; i<vgap.mystarbases.length; i++)
       {
         vgap.plugins["vgaBot"].buildShip(vgap.mystarbases[i]);
       }
     },
          
     buildShip: function(base)
     {
       var shipAssembly = vgap.plugins["vgaBot"].getShipToBuild(base);
      
       if (shipAssembly != null)
         vgap.plugins["vgaBot"].assembleShip(base, shipAssembly);
     },
       
     calcShipCredits: function(shipAssembly, base)
     {
       console.log("Ship hull name: " + shipAssembly.hull.name);
       
       var credits = shipAssembly.hull.cost +
           shipAssembly.hull.engines * shipAssembly.engine.cost;
       if (shipAssembly.hull.launchers != 0 && shipAssembly.torp != null)
         credits += shipAssembly.hull.launchers * shipAssembly.torp.launchercost;
       if (shipAssembly.hull.beams != 0 && shipAssembly.beam != null)
         credits += shipAssembly.hull.beams * shipAssembly.beam.cost;
       
       credits += vgap.plugins["vgaBot"].calcTechCost(base.hulltechlevel, shipAssembly.hull.techlevel);
       credits += vgap.plugins["vgaBot"].calcTechCost(base.enginetechlevel, shipAssembly.engine.techlevel);
       credits += vgap.plugins["vgaBot"].calcTechCost(base.torptechlevel, shipAssembly.torp.techlevel);
       credits += vgap.plugins["vgaBot"].calcTechCost(base.beamtechlevel, shipAssembly.beam.techlevel);
       
       return credits;
     },
     
     calcTechCost: function(baseTech, shipTech)
     {
       var cost = 0;
       if (baseTech < shipTech)
       {
         for (i=baseTech; i<shipTech; i++)
           cost += i*100;
       }
       
       //Have we upgraded to level 9 (i.e. 10)
       if (shipTech == 9 && cost > 0)
         cost += 900;
       
       if (cost > 0)
       {
       		console.log("Tech Cost: " + cost);        
       		console.log("Upgrade from " + baseTech + " to " + shipTech);
       }
       
       return cost;
     },
     
     calcShipDur: function(shipAssembly)
     {
       var dur = shipAssembly.hull.duranium +
           shipAssembly.hull.engines * shipAssembly.engine.duranium;
       if (shipAssembly.hull.launchers != 0 && shipAssembly.torp != null)
         dur += shipAssembly.hull.launchers * shipAssembly.torp.duranium;
       if (shipAssembly.hull.beams != 0 && shipAssembly.beam != null)
         dur += shipAssembly.hull.beams * shipAssembly.beam.duranium;
       
       return dur;
     },
     
     calcShipTrit: function(shipAssembly)
     {
       var trit = shipAssembly.hull.tritanium +
           shipAssembly.hull.engines * shipAssembly.engine.tritanium;
       if (shipAssembly.hull.launchers != 0 && shipAssembly.torp != null)
         trit += shipAssembly.hull.launchers * shipAssembly.torp.tritanium;
       if (shipAssembly.hull.beams != 0 && shipAssembly.beam != null)
         trit += shipAssembly.hull.beams * shipAssembly.beam.tritanium;
       
       return trit;
     },
     
     calcShipMoly: function(shipAssembly)
     {
       var moly = shipAssembly.hull.molybdenum +
           shipAssembly.hull.engines * shipAssembly.engine.molybdenum;
       if (shipAssembly.hull.launchers != 0 && shipAssembly.torp != null)
         moly += shipAssembly.hull.launchers * shipAssembly.torp.molybdenum;
       if (shipAssembly.hull.beams != 0 && shipAssembly.beam != null)
         moly += shipAssembly.hull.beams * shipAssembly.beam.molybdenum;
       
       return moly;
     },
     
     getShipToBuild: function(base)
     {
       var shipAssembly = null;
       var hull = vgap.plugins["vgaBot"].findHullNamed("Lizard Class Cruiser");

       if (hull != null)
       {
         var planet = vgap.getPlanet(base.planetid);
         
         shipAssembly = {hull: hull, beam: vgap.getBeam(1), engine: vgap.getEngine(9), torp: vgap.getTorpedo(6)};
       
         var credits = vgap.plugins["vgaBot"].calcShipCredits(shipAssembly, base);
         var dur = vgap.plugins["vgaBot"].calcShipDur(shipAssembly);
         var trit = vgap.plugins["vgaBot"].calcShipTrit(shipAssembly);
         var moly = vgap.plugins["vgaBot"].calcShipMoly(shipAssembly);
         
         if (planet.molybdenum < moly || planet.duranium < dur || planet.tritanium < trit ||
             (planet.supplies + planet.megacredits) < credits)
         {
           shipAssembly = null;
         }
       }
       
       return shipAssembly;
     },
           
     findHullNamed: function(hullName)
     {
       var ret = null;
       for (var i=0; i<vgap.hulls.length; i++)
       {
         if (vgap.hulls[i].name == hullName)
           ret = vgap.hulls[i];
       }
       return ret;
     },
     
     assembleShip: function(base, shipAssembly)
     {
       var planet = vgap.getPlanet(base.planetid);
               
       //Pay for the ship       
       var credits = vgap.plugins["vgaBot"].calcShipCredits(shipAssembly, base);
       var dur = vgap.plugins["vgaBot"].calcShipDur(shipAssembly);
       var trit = vgap.plugins["vgaBot"].calcShipTrit(shipAssembly);
       var moly = vgap.plugins["vgaBot"].calcShipMoly(shipAssembly);
       
       planet.duranium -= dur;
       planet.tritanium -= trit;
       planet.molybdenum -= moly;              
       vgap.plugins["vgaBot"].payForStructure(planet, 0, credits);     
       
       //Upgrade all tech needed
       if (base.beamtechlevel < shipAssembly.beam.techlevel)
       {
         base.beamtechup = shipAssembly.beam.techlevel - base.beamtechlevel;
         base.beamtechlevel = shipAssembly.beam.techlevel;
       }       
       if (base.hulltechlevel < shipAssembly.hull.techlevel)
       {
         base.hulltechup = shipAssembly.hull.techlevel - base.hulltechlevel;
         base.hulltechlevel = shipAssembly.hull.techlevel;
       }
       if (base.enginetechlevel < shipAssembly.engine.techlevel)
       {
         base.enginetechup = shipAssembly.engine.techlevel - base.enginetechlevel;
         base.enginetechlevel = shipAssembly.engine.techlevel;
       }       
       if (base.torptechlevel < shipAssembly.torp.techlevel)
       {
         base.torptechup = shipAssembly.torp.techlevel - base.torptechlevel;
         base.torptechlevel = shipAssembly.torp.techlevel;
       }
       
       //Assemble the ship
       base.buildbeamcount = shipAssembly.hull.beams;
       base.buildbeamid = shipAssembly.beam.id;
       var stockitem = vgap.getStock(base.id, 3, shipAssembly.beam.id);
       stockitem.builtamount += shipAssembly.hull.beams;
       stockitem.amount += shipAssembly.hull.beams;
       stockitem.changed = 1;
       
       base.buildengineid = shipAssembly.engine.id;
       stockitem = vgap.getStock(base.id, 2, shipAssembly.engine.id);
       stockitem.builtamount += shipAssembly.hull.engines;
       stockitem.amount += shipAssembly.hull.engines;
       stockitem.changed = 1;
       
			 base.buildhullid = shipAssembly.hull.id;
       stockitem = vgap.getStock(base.id, 1, shipAssembly.hull.id);
       stockitem.builtamount += 1;
       stockitem.amount += 1;
       stockitem.changed = 1;
       
   		 base.buildtorpcount = shipAssembly.hull.launchers;
			 base.buildtorpedoid = shipAssembly.torp.id;
       stockitem = vgap.getStock(base.id, 4, shipAssembly.torp.id);
       stockitem.builtamount += shipAssembly.hull.launchers;
       stockitem.amount += shipAssembly.hull.launchers;
       stockitem.changed = 1;
       
       base.isbuilding = true;
       base.changed = 1;
       planet.changed = 1;
     },
     
     /*****************************
     * Build Structures
     ******************************/
     
     buildStructures: function()
     {
       for (var i=0; i<vgap.myplanets.length; i++)
       {
         var planet = vgap.myplanets[i];
         var maxFactories = vgap.plugins["vgaBot"].calcMaxFactories(planet);
         var maxMines = vgap.plugins["vgaBot"].calcMaxMines(planet);
         var desiredDefense = vgap.plugins["vgaBot"].calcDesiredDefense(planet);
         
         //First, build 15 factories
     	   if (vgap.plugins["vgaBot"].buildFactories(planet, Math.min(maxFactories, 15)))
     		 	if(vgap.plugins["vgaBot"].buildMines(planet, Math.min(maxMines, 20)))
         		if(vgap.plugins["vgaBot"].buildDefense(planet, desiredDefense))
              if(vgap.plugins["vgaBot"].buildFactories(planet, maxFactories))
                 vgap.plugins["vgaBot"].buildMines(planet, maxMines);
       }
       
       if (planet.builtfactories > 0 ||
           planet.builtmines > 0 ||
           planet.builtdefense > 0)
       {
          planet.changed = 1;
       }
     },
     
     calcMaxFactories: function(planet)
     {
       var nFactories;
       if (planet.clans <= 100)
         nFactories = planet.clans;
       else
         nFactories = Math.truncate(100 + Math.sqrt( planet.clans - 100));
       
       return nFactories;
     },
     
     calcMaxMines: function(planet)
     {
     	 var nMines;
       if (planet.clans <= 200)
         nMines = planet.clans;
       else
         nMines = Math.truncate(200 + Math.sqrt( planet.clans - 200));
       
       return nMines;
     },
     
     calcMaxDefense: function(planet)
     {
       var nDefense;
       if (planet.clans <= 50)
         nDefense = planet.clans;
       else
         nDefense = Math.truncate(50 + Math.sqrt( planet.clans - 50));
       
       return nDefense;
     },
     
     calcDesiredDefense: function(planet)
     {
       return Math.min(20, vgap.plugins["vgaBot"].calcMaxDefense(planet));
     },
     
     buildFactories: function(planet, max)
     {       
       while(planet.factories < max && vgap.plugins["vgaBot"].payForStructure(planet, 1, 3))
       {
         planet.factories += 1;
         planet.builtfactories += 1;
       }
       return planet.factories >= max;
     },
     
     buildMines: function(planet, max)
     {
       while(planet.mines < max && vgap.plugins["vgaBot"].payForStructure(planet, 1, 4))
       {
         planet.mines += 1;         
         planet.builtmines += 1;
       }
       return planet.mines >= max;
     },
     
     buildDefense: function(planet, max)
     {
       while(planet.defense < max && vgap.plugins["vgaBot"].payForStructure(planet, 1, 10))
       {
         planet.defense += 1;  
         planet.builtdefense += 1;
       }
       return planet.defense >= max;
     },
     
     payForStructure: function(planet, nSupplies, nCredits)
     {
       var bought = false;
       
       //Check if we can afford this
       if (planet.supplies >= nSupplies && ((planet.supplies + planet.megacredits) > (nSupplies + nCredits)) )
       {
         bought = true;
         planet.supplies -= nSupplies;
         var nCreditsSpend = Math.min(planet.megacredits, nCredits);
         planet.megacredits -= nCreditsSpend;
         nCredits -= nCreditsSpend;
         
         if (nCredits > 0)
         {
           vgap.plugins["vgaBot"].sellSupplies(planet, nCredits);
           planet.megacredits -= nCredits;
         }
       }
              
       return bought;
     },
       
     sellSupplies: function(planet, nSupplies)
     {
     		planet.suppliessold += nSupplies;
        planet.supplies -= nSupplies;
        planet.megacredits += nSupplies;
     },
     
     
     /*****************************
     * Tax
     ******************************/
     
     tax: function()
     {
       for (var i=0; i<vgap.myplanets.length; i++)
       {
         var planet = vgap.myplanets[i];
         planet.colhappychange = vgap.colonistTaxChange(planet);
         if ( (planet.colhappychange + planet.colonisthappypoints) >= 100)
         {
           //This is actually the max change - will be based on number of clans on the planet.
           var change = -1 * (planet.colonisthappypoints - 70 + planet.colhappychange);
           if (planet.nativeracename == "Amorphous")
             change -= planet.colhappychange;
         	 planet.colonisttaxrate = vgap.plugins["plManagerPlugin"].findColonistRate(planet, change);
        	 console.log("New colonist tax rate for planet " + planet.id + ": " + planet.colonisttaxrate);
         }
         else
         {
           planet.colonisttaxrate = 0;
         }
         
         if (planet.nativeclans > 0 && planet.nativeracename != "Amorphous" && (planet.nativehappypoints + planet.nativehappychange) >= 100)
         {
           //TODO: Adjust for number of clans on the planet.
           var change = -1 * (planet.nativehappypoints - 70 + planet.nativehappychange);
         	 planet.nativetaxrate = vgap.plugins["plManagerPlugin"].findNativeRate(planet, change);
           console.log("New native tax rate for planet " + planet.id + ": " + planet.nativetaxrate);
         }
         else
         {
           planet.nativetaxrate = 0;
         }
         
         planet.changed = 1;
       }
     },
          
     /*
     sleep: function(ms) 
     {
  		  return new Promise(resolve => setTimeout(resolve, ms));
		 },

     	saveChanges: async function(func) 
      {      
        vgap.save();
        console.log("Save in progress: " + vgap.saveInProgress);
        while (vgap.saveInProgress == 2)
        {
          await vgap.plugins["vgaBot"].sleep(100);
        }
        console.log("Save in progress: " + vgap.saveInProgress);
      },
     */
     
     /***************
     * To move to Library
     ***************/
   }; //End plugin
	
   // register your plugin with NU IF running a hosted game
   vgap.registerPlugin(vgaBot, "vgaBot");
	 
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
document.body.removeChild(script);
