// ==UserScript==
// @name          Planets.nu - Build Plan Plugin
// @namespace     daunting/buildPlan
// @version       0.1
// @date          2017-11-18
// @author        Daunting
// @description   NU dashboard plugin that allows you to plan ship builds on star bases
// @include       http://planets.nu/*
// @include       http://play.planets.nu/*
// @include       http://test.planets.nu/*
// @resource      userscript https://greasyfork.org/en/scripts/35354-planets-nu-build-plan-plugin
// @homepage      http://planets.nu

// @downloadURL https://update.greasyfork.org/scripts/35354/Planetsnu%20-%20Build%20Plan%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/35354/Planetsnu%20-%20Build%20Plan%20Plugin.meta.js
// ==/UserScript==
/*
* Used kedalion's Enemy ship list as the starting point for this script, so some code
* and syntax will be the same. First attempt at writing any serious HTML
*/

/*
Change log:
0.1 Tab
*/
function wrapper () { // wrapper for injection
    
   if (vgap.version < 3.0) 
   {
      console.log("Build Plan plugin requires at least NU version 3.0. Plugin disabled." );
      return;	
   }
	
   var plugin_version = 0.1;
   
   console.log("Build Plan plugin version: v" + plugin_version );
    
   /**
   *  Specify your plugin
   *  You need to have all those methods defined or errors will be thrown. 
   *  I inserted the print-outs in order to demonstrate when each method is 
   *  being called. Just comment them out once you know your way around.
   *  
   *  For any access to plugin class variables and methods, 
   *  "vgap.plugins["buildPlanPlugin"].my_variable" has to be used 
   *  instead of "this.my_variable".
   */
   var buildPlanPlugin = 
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
	 			//add Link to Build Plan to left Dashboard menu
	 			var menu = document.getElementById("DashboardMenu").childNodes[2]; //insert into left summary
	 			$("<li>Build Plan &raquo;</li>").tclick(function () { vgap.plugins["buildPlanPlugin"].showBuildPlan(); }).appendTo(menu);
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
		  N_TURNS: 6,
     
      /***************************************************************************************
       * Custom plugin methods
       ***************************************************************************************/
      showBuildPlan: function() 
      {
	 			console.log("showBuildPlan");
	 			vgap.dash.content.empty();

	 			var baseBoxHTML = vgap.plugins["buildPlanPlugin"].createBaseDropdown(-1);
	 			this.pane = $(baseBoxHTML).appendTo(vgap.dash.content);
   			//this.pane.jScrollPane();
   			vgap.action();
   			//return;
      },

      selectBase: function(base) 
      {
	 			console.log("Selected base: " + vgap.mystarbases[base].planetid);
        
				vgap.dash.content.empty();
        
        //Create the header
	 			var html = vgap.plugins["buildPlanPlugin"].createBaseDropdown(vgap.mystarbases[base].planetid);
        html += "<div class='DashPane'>";
        html += "<table id='BaseTable' align='left' border='0' width='100%' style='cursor:pointer;'><thead>";
       	html += "<th align='left'>Turn</th>";
        html += "<th align='left'>MC</th>";
        html += "<th align='left'>S</th>";
        html += "<th align='left'>D</th>";
        html += "<th align='left'>T</th>";
        html += "<th align='left'>M</th>";
        html += "<th align='left'>Hulls</th>";
        html += "<th align='left'>Engines</th>";
        html += "<th align='left'>Beams</th>";
        html += "<th align='left'>Torpedos</th>";
				html += "</thead><tbody id='BaseRows' align=left  >";
        html += "</tbody></table>";
        html += "</div>";
        this.pane = $(html).appendTo(vgap.dash.content);
        
        //TODO: Fill in the table
        for (var i=0; i<vgap.plugins["buildPlanPlugin"].N_TURNS; i++)
        {
          var turn = (vgap.game.turn + i);
          html = "<tr>";
          html += "<td>" + turn + "</td>";
          html += "<td>MC</td>";
          html += "<td>S</td>";
          html += "<td>D</td>";
          html += "<td>T</td>";
          html += "<td>M</td>";
          html += vgap.plugins["buildPlanPlugin"].createHullDropdown(base, vgap.player.raceid);
          html += vgap.plugins["buildPlanPlugin"].createEngineDropdown(base);
          html += vgap.plugins["buildPlanPlugin"].createBeamDropdown(base);
          html += vgap.plugins["buildPlanPlugin"].createTorpedoDropdown(base);
          html += "</tr>";
          $(html).appendTo("#BaseRows");
        }
        
        vgap.action(); 
      },

     /**
     * Taken from:
     * https://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
     */
     sortByKey: function(array, key) 
     {
    		return array.sort(function(a, b) 
     		{
        	var x = a[key]; var y = b[key];
        	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    		});
			},
        
      createShipDropdown: function(base, id, func, array)
      {
        var html = "<td><select id='" + id + "' ";
        html += "onChange='vgap.plugins[\"buildPlanPlugin\"]." + func + "(" + base + ", this.selectedIndex);'> ";
        for (var j=0; j<array.length; j++)
        {
          var name = array[j].name;
          html += "<option value='" + name + "'>" + name + "</option>";
        }
        
        html += "</select></td>";      
        return html;
      },
     
      createHullDropdown: function(base, raceid)
      {
        //Create the list of hulls accessible to this player
        var hullIds = vgap.races[raceid].hulls.split(",");
        var hulls = [];
        
        //Build the list of hulls
        for (var i=0; i<hullIds.length; i++)
        {
          var intid = parseInt(hullIds[i]);
          for (var j=0; j<vgap.hulls.length; j++)
          {
            if (vgap.hulls[j].id == intid)
              hulls.push(vgap.hulls[j]);
          }
        }
        
        //Sort by techlevel
        hulls = vgap.plugins["buildPlanPlugin"].sortByKey(hulls, "techlevel");
        
        //Create the dropdown
        return vgap.plugins["buildPlanPlugin"].createShipDropdown(base, "hullSelect", "selectHull", hulls);
      },
     
      createEngineDropdown: function(base)
      {
        return vgap.plugins["buildPlanPlugin"].createShipDropdown(base, "engineSelect", "selectEngine", vgap.engines);
      },
         
      createBeamDropdown: function(base)
      {
 				return vgap.plugins["buildPlanPlugin"].createShipDropdown(base, "beamSelect", "selectBeam", vgap.beams);
      },
     
      createTorpedoDropdown: function(base)
      {
        return vgap.plugins["buildPlanPlugin"].createShipDropdown(base, "torpedoSelect", "selectTorpedo", vgap.torpedos);
      },
     
      selectHull: function(base, hull)
      {
        console.log("selectEngine: " + base + " " + hull);
        
        //TODO: Store the selection and redraw the table.
      },

      selectEngine: function(base, engine)
      {
        console.log("selectEngine: " + base + " " + engine);
        
        //TODO: Store the selection and redraw the table.
      },
      
      selectBeam: function(base, beam)
      {
        console.log("selectBeam: " + base + " " + beam);
        
        //TODO: Store the selection and redraw the table.
      },
     
      selectTorpedo: function(base, torpedo)
      {
        console.log("selectTorpedo: " + base + " " + torpedo);
        
        //TODO: Store the selection and redraw the table.
      },
     
     
      createBaseDropdown: function(base) 
      {
        console.log("createBaseDropdown: " + base);
        
	 			var html = "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 30) + "px;'>";
	 			html += "<table id='StarBaseSelectionTable' align='left' border='0' width='100%'>";
        html += "<tr>";
        html += "<td><strong>Select Base:</strong> <select id='listBases' " + 
	    		"onChange='vgap.plugins[\"buildPlanPlugin\"].selectBase(this.selectedIndex-1);'> ";
        if (base == -1)
	 				html += "<option disabled selected> -- select a Base -- </option>";
        else
          html += "<option disabled> -- select a Base -- </option>";

        for (var i=0; i<vgap.mystarbases.length; i++) 
	 			{
          if (base == vgap.mystarbases[i].planetid)
            html += "<option selected value='" + vgap.mystarbases[i].planetid + "'>" + vgap.mystarbases[i].planetid + "</option>";
          else
	    			html += "<option value='" + vgap.mystarbases[i].planetid + "'>" + vgap.mystarbases[i].planetid + "</option>";
	 			}
         
	 			html += "</select> <br></td></tr></table><div id='selectBase'></div></br>";
	 			return html;
      },

   }; //End plugin
	
   // register your plugin with NU
   vgap.registerPlugin(buildPlanPlugin, "buildPlanPlugin");
	 
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
document.body.removeChild(script);
