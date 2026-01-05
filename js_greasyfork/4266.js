// ==UserScript==
// @name          Planets.nu map printing
// @namespace     planets.nu
// @description   Allows opening a printable map 
// @include       http://planets.nu/*
// @include       http://planets.nu/games/*
// @include       http://*.planets.nu/*
// @grant none
// @version 0.3
// @downloadURL https://update.greasyfork.org/scripts/4266/Planetsnu%20map%20printing.user.js
// @updateURL https://update.greasyfork.org/scripts/4266/Planetsnu%20map%20printing.meta.js
// ==/UserScript==
// later there will be svg-map animations - hopefully
// Version 0.3 - completely rewritten
// Version 0.2 - works with new servers
// Version 0.1 - created
function wrapper() {
  // wrapper for injection
  var plugin = {
    /*
			 * processload: executed whenever a turn is loaded: either the current turn or
			 * an older turn through time machine 
			 */
    processload: function () {
      //				console.log("ProcessLoad: plugin called.");
    },
    /*
			 * loaddashboard: executed to rebuild the dashboard content after a turn is loaded
			 */
    loaddashboard: function () {
      //				console.log("LoadDashboard: plugin called.");
    },
    /*
			 * showdashboard: executed when switching from starmap to dashboard
			 */
    showdashboard: function () {
      //				console.log("ShowDashboard: plugin called.");
    },
    /*
			 * showsummary: executed when returning to the main screen of the dashboard
			 */
    showsummary: function () {
      //				console.log("ShowSummary: plugin called.");
    },
    /*
			 * loadmap: executed after the first turn has been loaded to create the map
			 * as far as I can tell not executed again when using time machine
			 */
    loadmap: function () {
      vgap.map.addMapTool('Print Map', 'ShowMinerals', function () {
        vgap.plugins.PrintMap.openMap();
      });
    },
    /*
			 * showmap: executed when switching from dashboard to starmap
			 */
    showmap: function () {
      //				console.log("ShowMap: plugin called.");
    },
    /*
			 * draw: executed on any click or drag on the starmap
			 */
    draw: function () {
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
    loadplanet: function () {
      //				console.log("LoadPlanet: plugin called.");
      //				console.log("Planet id: " + vgap.planetScreen.planet.id);
    },
    /*
			 * loadstarbase: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapStarbaseScreen (vgapStarbaseScreen.prototype.load) the normal starbase screen 
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadstarbase");'.
			 * 
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X" 
			 * can be accessed here as "vgap.starbaseScreen.X".
			 */
    loadstarbase: function () {
      //				console.log("LoadStarbase: plugin called.");
      //				console.log("Starbase id: " + vgap.starbaseScreen.starbase.id + " on planet id: " + vgap.starbaseScreen.planet.id);
    },
    /*
			 * loadship: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapShipScreen (vgapShipScreen.prototype.load) the normal ship screen 
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadship");'.
			 * 
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X" 
			 * can be accessed here as "vgap.shipScreen.X".
			 */
    loadship: function () {
    },
    // END PLUGIN FUNCS       			
    openMap: function ()
    {
      var canvas = vgap.map.canvas;
      //$(canvas).css('background-color', 'black');
      var imgURL = canvas.toDataURL('image/jpeg');
      var mapWindow = window.open(imgURL, 'MapWindow');
    }
  };
  // register your plugin with NU
  vgap.registerPlugin(plugin, 'PrintMap');
}
//wrapper for injection

var script = document.createElement('script');
script.type = 'application/javascript';
script.textContent = '(' + wrapper + ')();';
document.body.appendChild(script);
document.body.removeChild(script);
