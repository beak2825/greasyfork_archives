// ==UserScript==
// @name         Waze Town Segment Renamer
// @version      0.4
// @author       Sumgui
// @description  Takes in census data and allows the user to rename segments so they match their township.
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/16253/Waze%20Town%20Segment%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/16253/Waze%20Town%20Segment%20Renamer.meta.js
// ==/UserScript==

//Remove JSHint Noise
/* globals Waze: false */
/* globals OpenLayers: false */
/* globals I18n: false */

(function() {
  'use strict';
  var formats = {};
  patchOpenLayers();  // patch adds KML

  var EPSG_4326 = new OpenLayers.Projection("EPSG:4326");  // lat,lon
  var EPSG_4269 = new OpenLayers.Projection("EPSG:4269");  // NAD 83
  var EPSG_3857 = new OpenLayers.Projection("EPSG:3857");  // WGS 84

  // delayed initialisation
  setTimeout(init, 654);
  //Waze.loginManager.events.register("login", null, init);  //??No idea what that does but it breaks firefox.... (from WME_Geometries)
  
  
  //Constants ---------------------------------------------------------------------------
  var FIPS_STATE_CODES_TO_NAMES = ["", //5-2 https://en.wikipedia.org/wiki/Federal_Information_Processing_Standard_state_code
    "Alabama","Alaska","","Arizona","Arkansas","California","","Colorado","Connecticut","Delaware",
    "District of Columbia","Florida","Georgia","","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas",
    "Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana",
    "Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
    "Oregon","Pennsylvania","","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","","Washington","West Virginia","Wisconsin","Wyoming","","","","American Samoa",
    "","","","Federated States of Micronesia","","Guam","Johnston Atoll","Marshall Islands","Northern Mariana Islands","Palau",
    "Midway Islands","Puerto Rico","","U.S. Minor Outlying Islands","","Navassa Island","","U.S. Virgin Islands","Wake Island","",
    "Baker Island","","","Howland Island","","Jarvis Island","","","Kingman Reef","",
    "","","","","Palmyra Atoll"];
  
  //Program Storage
  var county_fips_codes = {};
  var county_subdivion_not_defined = [];
  var state_check = 0;
  var subdivision_data = {};
  
  var COUNTY_SUBDIVISIONS_CALLED = "Counties";
  
  //Program State
  var scan_in_progress = false;
  var scan_is_paused = false;
  var fips_codes_loaded = false;
  var county_subivisions_loaded = false;
    
  
  //Strings -----------------------------------------------------------------------------
  var INVALID_TOWN_NAME = "County subdivisions not defined";
  
  //Status message box ids
  var STATUS_ID_FIPS_CODES = "fipsCodesStatus";
  var STATUS_ID_SCAN = "WME_TSR_Scan_Status";
  var STATUS_ID_COUNTY_SUBDIVISION = "countySubdivisionStatus";
  var STATUS_ID_COUNTY_SUBDIVISION_NOT_DEFINED = "countySubdivionNotDefinedInfoDisplay";
  
  //File input button ids
  var BUTTON_FILE_FIPS_CODES = "FIPSCodesLabel";
  var BUTTON_FILE_FIPS_CODES_DEFAULT_TEXT = "FIPS Codes <span style='font-weight:bold;'>.txt</span>";
  var BUTTON_FILE_COUNTY_SUBDIVISIONS = "countySubdivisionsFileLabel";
  var BUTTON_FILE_COUNTY_SUBDIVISIONS_TEXT = "County Subdivisions  <span style='font-weight:bold;'>.kml</span>";
  
  //Control Buttons
  var BUTTON_CTRL_CLASSNAME = "WME_TSR_controlButtons";
  var BUTTON_CTRL_CLASSNAME_DISABLED = BUTTON_CTRL_CLASSNAME + " disabled";
  var BUTTON_CTRL_ID_START = 'WME_TSR_controlButtons_start';
  var BUTTON_CTRL_START_TEXT = "Start";
  var BUTTON_CTRL_CONTINUE_TEXT = "Continue";  
  var BUTTON_CTRL_ID_PAUSE = 'WME_TSR_controlButtons_pause';
  var BUTTON_CTRL_ID_CANCEL = 'WME_TSR_controlButtons_cancel';
  
  
  //Colors
  var STATUS_COLOR_DEFAULT = ""; //Back to browser / other CSS styles
  var STATUS_COLOR_ERROR = "#FF0000"; // Red
  var STATUS_COLOR_SUCCESS = "#33CC33"; // Green

  
  //Layer
  var layer_id = "";
  var LAYER_UNIQUE_NAME = "WME_TSR";
  var LAYER_COLOR = "navy";
  
  //Waze specific strings
  
  
  var checkCounty;
  var checkTownship;
  
  var town_border_direction = "";
  var town_border_line_strings = [];  
  var Waze_segment_layer;
  var ZOOM_TO_LEVEL = 4; //Zoom level in which we are able to get all the roads loaded.
  var map_center_lon_start;
  var map_center_lat;
  var map_center_lon;
  var scan_stats = {
    segments_need_town_change: 0,
    segments_need_state_change: 0,
    segments_checked: 0,
    view_shifts: 1
  };
  var scan_no_segments_found_interval_id;
  var scan_no_segments_found_interval_time = 5000;
  
  var observer = new MutationObserver(function(mutations){
    processMapView(checkCounty, checkTownship);
  });

  //-----------------------------------------------
  // Setup the configuration panel for the user to interact with.
  //   HTML, CSS, Event Listeners, Loading settings
  function init() {    
    //Create the configuration section
    var WME_TSRcontainer = document.createElement('div');
    WME_TSRcontainer.id = "WME_TSR";
    //document.getElementById('user-box').appendChild(WME_TSRcontainer); //Temp while testing
    document.getElementById('sidepanel-areas').appendChild(WME_TSRcontainer);
    

    //All the HTML that the user will need to interact with.
    WME_TSRcontainer.innerHTML = "<div id='optionsFlyout' style='display:none;'><div id='WME_TSR_Options'>Controls not implemented yet.<form method='post' action=''>" + 
    "<ul><li>Fullscreen Mode: <select><option>None</option><option>Maximize map in window</option><option>Fullscreen</option></select></li></ul>" +
    "<table>" +
    "<tr><td><label for='WME_TSR_Township_Bisect_Segment'>Bisect Segment: </label></td><td><input type='checkbox' name='WME_TSR_Township_Bisect_Segment'/></td></tr>" +
    "<tr><td><label for='WME_TSR_Changes_Till_Pause'>Changes Till Pause: </label></td><td><input type='number' name='WME_TSR_Changes_Till_Pause' value='150' min='5' max='300'/></td></tr>" +
    "</table>" +
    "</form></div></div>" + 
    "<span id='optionsFlyoutToggle'>&hellip;</span><span id='displayToggle'>-</span><h4 style='margin: 0 0 0 20px;'>Town Segment Renamer</h4>" +

    //"<input type='button' value='Run Test' id='WME_TSRtest'/>" +

    "<div id='WME_TSR_container' style='display:block;'>" +
    //"<p>This will not alter the names of townships for you.  If you need that done you must do it manually at the moment.  <br />Load the FIPS Codes first.</p>" +" +
    "<label class='WME_TSR_file_upload_labels' id='FIPSCodesLabel' for='FIPSCodes'>FIPS Codes <span style='font-weight:bold;'>.txt</span></label><input type='file' id='FIPSCodes' name='FIPSCodes' title='.txt' accept='.txt'/>" +
    "<a class='WME_TSR_census_links' href='https://www.census.gov/geo/reference/codes/cou.html' target='_blank'>census.gov</a><br />Status: <span id='fipsCodesStatus'>Waiting for file.</span><br />" +

    "<label class='WME_TSR_file_upload_labels' id='countySubdivisionsFileLabel' for='countySubdivisionsFile'>County Subdivions  <span style='font-weight:bold;'>.kml</span></label><input type='file' id='countySubdivisionsFile' name='countySubdivisionsFile' title='.kml' accept='.kml'/>" +
    "<a class='WME_TSR_census_links' href='https://www.census.gov/geo/maps-data/data/kml/kml_cousub.html' target='_blank'>census.gov</a><br />Status: <span id='countySubdivisionStatus'></span><br />" +
    "<span style='cursor:pointer;color:"+STATUS_COLOR_ERROR+";' id='countySubdivionNotDefinedInfoDisplay'></span><br />" +

    "<form name='WME_TSR' id='WME_TSR_Rename_Picker' style='display: none; margin: 5px 0 0 0;'>" +
    "<table border='0'>" +
    "<tr><td><label for='WME_TSR_County'>County: </label></td><td><select name='WME_TSR_County' id='WME_TSR_County'></select></td></tr>" +
    "<tr><td><label for='WME_TSR_Township'>Township: </label></td><td><select name='WME_TSR_Township' id='WME_TSR_Township'></select></td></tr>" +
    "<tr><td colspan='2'><span id='WME_TSR_Scan_Status'></span></td></tr>" +
    "</table>" +
    "<span class='WME_TSR_controlButtons' id='WME_TSR_controlButtons_start'>Start</span><span class='WME_TSR_controlButtons disabled' id='WME_TSR_controlButtons_pause'>Pause</span><span class='WME_TSR_controlButtons disabled' id='WME_TSR_controlButtons_cancel'>Cancel</span>" +
    "</div>" +
    "</form>" +
    "<hr />";
    
    //All the styles for the previous HTML
    document.getElementsByTagName('head')[0].innerHTML += "//WME_TSR_STYLE\n<style>" +
    "#WME_TSR{margin-top:6px;}" +
    "#WME_TSR_container{margin-top:4px;}" +
    "#WME_TSR_container hr{margin-top:10px;}" +
    "#WME_TSR_Options{margin: 3px 1px 0 7px;overflow-y:auto;height:284px;}" +
    "#WME_TSR_Options ul{list-style-type: none;margin:0px;padding:0px;}" +
    "#displayToggle{color:#58889E;cursor:pointer;font-size:20px;font-weight:bold;width:15px;text-align:center;position:absolute;margin:-4px 0 0 0;padding: 0 3px;}" +
    "#optionsFlyoutToggle{cursor:pointer;position:absolute;font-size:20px;font-weight:bold;margin:-8px 0 0 255px;padding:0 2px 0 5px;}" +
    "#optionsFlyout {width: 235px;height: 300px;background-color: #FFFFFF;position: absolute;margin: -13px 0 0 0;z-index:9;border: 2px solid #58889E;border-radius:7px;box-shadow: 1px 0px 3px #999;}" +
    "#optionsFlyout:after, #optionsFlyout:before {left: 100%;top: 4%;border: solid transparent;content: ' ';height: 0;width: 0;position: absolute;pointer-events: none;}" +
    "#optionsFlyout:before {border-color: rgba(0, 0, 0, 0);border-left-color: #58889E;border-width: 12px 0 12px 23px;margin-top: -2px;}" +
    "#optionsFlyout:after {border-color: rgba(0, 0, 0, 0);border-left-color: #FFFFFF;border-width: 10px 0 10px 19px;}" +
    ".WME_TSR_controlButtons{display:inline-block;border: 2px solid #545454;padding: 4px 8px;border-radius: 6px;box-shadow: 2px 2px 1px 0px #DDD;color: #000000;margin:6px 0px 0 12px;width:75px;text-align:center;cursor:pointer;user-select:none;-webkit-user-select: none;-moz-user-select: none;}" +
    "#WME_TSR_controlButtons_start{background: linear-gradient(#81EA20, #85CA17);}" +
    "#WME_TSR_controlButtons_start.disabled{background: linear-gradient(#B1B1B1, #8A8A8A);cursor:not-allowed;}" +
    "#WME_TSR_controlButtons_pause {background: linear-gradient(#FDEE32, #E7EA1A);}" +
    "#WME_TSR_controlButtons_pause.disabled {background: linear-gradient(#B1B1B1, #8A8A8A);cursor:not-allowed;}"+
    "#WME_TSR_controlButtons_cancel {background: linear-gradient(#EF181F, #E41111);}" +
    "#WME_TSR_controlButtons_cancel.disabled {background: linear-gradient(#B1B1B1, #8A8A8A);cursor:not-allowed;}"+
    ".WME_TSR_file_upload_labels{cursor:pointer;background-color:#93C4D3;color:#FFFFFF;display:inline-block;padding:2px 5px;border:1px solid #58889E;margin:3px 0 0 0;max-width:220px;overflow-x:hidden;}" +
    ".WME_TSR_census_links{font-size:9px;margin-left:4px;}" +
    "#FIPSCodes, #countySubdivisionsFile{width:0.1px;height:0.1px;opacity:0;overflow:hidden;position:absolute;z-index:-1;}" +
    "</style>\n//WME_TSR_STYLE";
    
    //Event Listeners for the "buttons" and inputs
    document.getElementById('FIPSCodes').addEventListener('change', loadFipsCodes, false);
    document.getElementById('countySubdivisionsFile').addEventListener('change', loadCountySubdivisionFile, false);
    document.getElementById('WME_TSR_County').addEventListener('change', populateTownshipDropdown, false);
    document.getElementById('WME_TSR_Township').addEventListener('change', townshipDropdownBoxChanged, false);
    document.getElementById('WME_TSR_controlButtons_start').addEventListener('click', function(evt){ 
      if(!scan_is_paused) {
        if(!scan_in_progress) {
          WME_TSR_ScanRoads(evt);
        } else {
          statusMessage(STATUS_ID_SCAN,STATUS_COLOR_ERROR,"Only one scan at a time.");
        }
      } else {
        scan_is_paused = false;
        updateScanControlButtons();
        console.log("Continue scanning " + checkCounty + " - " + checkTownship);
        processMapView(checkCounty,checkTownship);
      }
    }, false);
    document.getElementById('WME_TSR_controlButtons_pause').addEventListener('click', function() {
      if(scan_in_progress) {
        if(!scan_is_paused) {
          scan_is_paused = true;
          updateScanControlButtons();
        }
      }
    }, false);
    document.getElementById('WME_TSR_controlButtons_cancel').addEventListener('click', function(){
      scan_in_progress = false;
      scan_is_paused = false;
      window.clearInterval(scan_no_segments_found_interval_id);
      
      updateScanControlButtons();
    }, false);

    document.getElementById('countySubdivionNotDefinedInfoDisplay').addEventListener('click', function(){
      var message = "";
      for(var i = 0; i < county_subdivion_not_defined.length; i++) {
        message += county_fips_codes[parseInt(county_subdivion_not_defined[i].data.COUNTYFP.value, 10)] + " - \"" +
          county_subdivion_not_defined[i].data.NAME.value + "\"\n";
      }
      alert(message);
    }, false);

    //Allow for showing and hiding everything.
    document.getElementById('displayToggle').addEventListener('click', function() {
      if( document.getElementById('WME_TSR_container').style.display == "none" ) {
        document.getElementById('WME_TSR_container').style.display = "block";
        this.innerHTML = "-";
        localStorage.setItem("WME_TSR_container_visible", "true");
      } else{
        document.getElementById('WME_TSR_container').style.display = "none";
        this.innerHTML = "+";
        localStorage.setItem("WME_TSR_container_visible", "false");
      }
    }, false);

    //Options menu toggle
    document.getElementById('optionsFlyoutToggle').addEventListener('click', function() {
      if(document.getElementById('optionsFlyout').style.display == "none"){
        document.getElementById('optionsFlyout').style.display = "block";
      } else {
        document.getElementById('optionsFlyout').style.display = "none";
      }
    }, false);
    
    
    //Load user settings
    if(localStorage.WME_TSR_container_visible == "true"){
      document.getElementById('WME_TSR_container').style.display = "block";
    } else {
      document.getElementById('WME_TSR_container').style.display = "none";
    }

    console.log("WME_TSR Loaded.");
  }

  //-----------------------------------------------
  // Load FIPS codes that the user submitted.
  //   Check to make sure we are only dealing with one state at a time.
  //
  function loadFipsCodes(evt) {
    fipsCodesReset();

    var file = evt.target.files[0];
    if(file) {
      statusMessage(STATUS_ID_FIPS_CODES, STATUS_COLOR_DEFAULT, "Checking file...");

      var reader = new FileReader();
      reader.onload = (function(e) {
        var counties = this.result.split('\n');
        
        for(var i = 0; i < counties.length; i++){
          var county = counties[i].split(',');
          if(parseInt(county[1],10) != state_check){
            if(state_check === 0){
              state_check = parseInt(county[1],10);
              
            } else {  //Check to make sure we are only doing one state at a time.
              statusMessage(STATUS_ID_FIPS_CODES, STATUS_COLOR_ERROR, "Error with FIPS file.");
              fipsCodesReset();
              alert("The FIPS file that was submitted has at least two states in it.  This program isn't desgined for that.");
              return;
            }
          }
          if(isNaN(parseInt(county[2], 10)) || (typeof parseInt(county[2], 10)) != "number"){ //Bad data was input.
            statusMessage(STATUS_ID_FIPS_CODES, STATUS_COLOR_ERROR, "Error with FIPS file.  Invalid data found.");
            fipsCodesReset();
            return;
          }
          county_fips_codes[parseInt(county[2], 10)] = county[3];
        }
        
        //Some states don't call their county subdivisions "Counties"
        if(state_check === 2) { //Alaska
          COUNTY_SUBDIVISIONS_CALLED = "Boroughs";
        } else if(state_check === 22) { //Louisiana
          COUNTY_SUBDIVISIONS_CALLED = "Parishes";
        } else {
          COUNTY_SUBDIVISIONS_CALLED = "Counties"; //All the rest
        }
        statusMessage(STATUS_ID_FIPS_CODES, STATUS_COLOR_SUCCESS, FIPS_STATE_CODES_TO_NAMES[state_check] + " | "+COUNTY_SUBDIVISIONS_CALLED+": " + (Object.keys(county_fips_codes)).length);

        //console.log(county_fips_codes);

        //Unlock County Subdivions
        fips_codes_loaded = true;
        fileButtonText(BUTTON_FILE_FIPS_CODES, evt.target.files[0].name, evt.target.files[0].name);
        statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_DEFAULT, "Waiting for file...");
      });
      reader.readAsText(file);
    } else {
      console.log("Error reading file.");
    }
  }
  
  //-----------------------------------------------
  // If the FIPS file is changed we reset everything
  //   
  function fipsCodesReset(){
    fips_codes_loaded = false;
    
    //We don't support changing the FIPS codes file while leaving the subdivisions file intact.  (Maybe after restructing)
    document.getElementById('countySubdivisionsFile').value = "";  //Clear subdivision file box to reselect same file if need be.
    countySubdivisionsReset();
    
    county_fips_codes = {};
    state_check = 0;
    
    fileButtonText(BUTTON_FILE_FIPS_CODES, "", BUTTON_FILE_FIPS_CODES_DEFAULT_TEXT);
  }
  
  //-----------------------------------------------
  // Take one feature from the subdivision file and validate that data
  //
  //   returns: true or false
  function validFeature(feature) {
    //Check to make sure all of the towns are listed for the same state loaded in the FIPS
    var stateNumber = parseInt(feature.data.STATEFP.value, 10);
    if(isNaN(stateNumber) || stateNumber != state_check) {
      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_ERROR, FIPS_STATE_CODES_TO_NAMES[stateNumber] + " | " + FIPS_STATE_CODES_TO_NAMES[state_check] + " required.");
      alert("All the counties of must match the state listed in the supplied FIPS Codes File.");
      return false;
    }
    
    //Make sure the each county number listed is valid.
    if(isNaN(parseInt(feature.data.COUNTYFP.value, 10))){
      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_ERROR, feature.data.NAME.value + "'s COUNTYFP is not a number.");
      return false;
    }
    
    //Some census files have invalid names for towns, we should notify the user about them
    if(feature.data.NAME.value == INVALID_TOWN_NAME) {
      county_subdivion_not_defined[county_subdivion_not_defined.length] = feature;
    }
    
    return true;
  }
  
  //-----------------------------------------------
  // Take the feature and store its linear rings so we can process them for scanning
  // 
  function storeFeature(feature){
    
    var countyNumber = parseInt(feature.data.COUNTYFP.value, 10);
    //console.log(countyNumber + " " + subdivision_data[countyNumber]);
    
    //Create an object to store the features if not already there
    if( subdivision_data[county_fips_codes[countyNumber]] === undefined ||
        subdivision_data[county_fips_codes[countyNumber]] === null ) {
      subdivision_data[county_fips_codes[countyNumber]] = {towns:[]};
    }

    //Some towns have multiple linear rings (Towns and villages/cities having the same name)
    var numLinearRingsPerTownName = 0;
    
    //------------------------------------------------------------------------
    //Store towns data
    //  If a village or city has the same name as the town it is in the parser stores it differently.
    //  Also some census data use different methods of storing villages / cities.
    //  Some of them are in collections, while some of them are just addons to the towns polygon.  (Not sure why?)
    //  We need to make them seperate so the user can see them and change the name if needed.
    if(feature.geometry.id.indexOf("OpenLayers.Geometry.Collection") >= 0) { //Check if this "town" is a collection of geometries.
      //console.log(i);
      for(var i = 0; i < feature.geometry.components.length; i++){
        if( feature.geometry.components[i].id.indexOf("OpenLayers.Geometry.Polygon") >= 0 ) { //Check if this "town" has more then one linearRing.
          for(var k = 0; k < feature.geometry.components[i].components.length; k++){
            subdivision_data[county_fips_codes[countyNumber]].towns[feature.data.NAME.value + (numLinearRingsPerTownName === 0 ? "" : "("+ (numLinearRingsPerTownName+1) +")")] = feature.geometry.components[i].components[k];
            subdivision_data[county_fips_codes[countyNumber]].towns[feature.data.NAME.value + (numLinearRingsPerTownName === 0 ? "" : "("+ (numLinearRingsPerTownName+1) +")")].name = feature.data.NAME.value;
            numLinearRingsPerTownName++;
          }
        } else {
          subdivision_data[county_fips_codes[countyNumber]].towns[feature.data.NAME.value + (numLinearRingsPerTownName === 0 ? "" : "("+ (numLinearRingsPerTownName+1) +")")] = feature.geometry.components[i];
          subdivision_data[county_fips_codes[countyNumber]].towns[feature.data.NAME.value + (numLinearRingsPerTownName === 0 ? "" : "("+ (numLinearRingsPerTownName+1) +")")].name = feature.data.NAME.value;
          numLinearRingsPerTownName++;
        }
      }
    }
    else if( feature.geometry.id.indexOf("OpenLayers.Geometry.Polygon") >= 0 ) { //Check if this "town" has more then one linearRing.
      for(var j = 0; j < feature.geometry.components.length; j++){
        subdivision_data[county_fips_codes[countyNumber]].towns[feature.data.NAME.value + (numLinearRingsPerTownName === 0 ? "" : "("+ (numLinearRingsPerTownName+1) +")")] = feature.geometry.components[j];
        subdivision_data[county_fips_codes[countyNumber]].towns[feature.data.NAME.value + (numLinearRingsPerTownName === 0 ? "" : "("+ (numLinearRingsPerTownName+1) +")")].name = feature.data.NAME.value;
        numLinearRingsPerTownName++;
      }
    } else { //I didn't program for any other case besides these two.
      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_ERROR, feature.data.NAME.value + " is of geometry not accounted for.");
      return;
    }
  }
    
  //-----------------------------------------------
  //  Load the county subdivision file, parse it
  //    import selected file as a vector layer
  //    TODO: Lift out the file vaildation and verification
  function loadCountySubdivisionFile(evt) {
    countySubdivisionsReset();
    if(fips_codes_loaded === false) {
      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_ERROR, "Load FIPS Codes first.");
      document.getElementById('countySubdivisionsFile').value = '';
      return;
    }

    statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_DEFAULT, "Loading...");
    // get the selected file from user
    var file = evt.target.files[0];
    var fileext = (file.name.split('.').pop()).toUpperCase();

    // check if format is supported
    var parser = formats[fileext];
    if (typeof parser === undefined) {
      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_ERROR, fileext + " format not supported :(");
       return;
    }
    parser.internalProjection = Waze.map.getProjectionObject();
    parser.externalProjection = EPSG_4326;

    
    // read the file into the new layer
    var reader = new FileReader();
    reader.onload = (function(e) {
      if (/"EPSG:3857"|:EPSG::3857"/.test(e.target.result)) {
        parser.externalProjection = EPSG_3857;
      }
      else if (/"EPSG:4269"|:EPSG::4269"/.test(e.target.result)) {
        parser.externalProjection = EPSG_4269;
      }

      // load geometry files
      var features = parser.read(e.target.result);

      // detect bad data
      if (features.length === 0) {
        statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_ERROR, "No features found in file.");
        return;
      }

      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_DEFAULT, "Sorting Data.");

      //Sort by Township and then by County if there is a duplicate
      features.sort(function compare(a, b) {
        if( a.data.NAME.value > b.data.NAME.value ) {
          return 1;
        } else if ( a.data.NAME.value < b.data.NAME.value ) {
          return -1;
        } else {
          if( county_fips_codes[parseInt(a.data.COUNTYFP.value, 10)] >
              county_fips_codes[parseInt(b.data.COUNTYFP.value, 10)] ) {
            return 1;
          } else {
            return -1;
          }
        }
      });
      //console.log(features);

      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_DEFAULT, "Parsing File.");

      for(var i = 0; i < features.length; i++) {
        if(validFeature(features[i]) === false) {
          return;
        }
        storeFeature(features[i]);
      }
      
      addLayerToMap(features);

      //Show the user the invalid town names
      if(county_subdivion_not_defined.length > 0){
        statusMessage(STATUS_ID_COUNTY_SUBDIVISION_NOT_DEFINED,STATUS_COLOR_ERROR, county_subdivion_not_defined.length + " invalid township name" + (county_subdivion_not_defined.length > 1 ? "s" : "") + " found.");
      }

      console.log(subdivision_data);
      
      county_subivisions_loaded = true;
      statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_SUCCESS, FIPS_STATE_CODES_TO_NAMES[state_check] + " | Townships: " + features.length);
      fileButtonText(BUTTON_FILE_COUNTY_SUBDIVISIONS, evt.target.files[0].name, evt.target.files[0].name);
      
      populatePickerForm();
    });
    reader.readAsText(file);
  }
  
  
  //-----------------------------------------------
  // Adds a new vector layer to Waze for the user to look at.
  //
  function addLayerToMap(features) {
    // hack in translation:
    I18n.translations[I18n.locale].layers.name[LAYER_UNIQUE_NAME] = "WME County Subdivision: " + FIPS_STATE_CODES_TO_NAMES[state_check];
    
    var layerName = "WME_TSR: " + FIPS_STATE_CODES_TO_NAMES[state_check];
    var layerSubdivision = new OpenLayers.Layer.Vector(layerName.substring(0,18), //Cut off extra characters so layers window isn't off screen.
      { rendererOptions: { zIndexing: true },
        uniqueName: LAYER_UNIQUE_NAME,
        //shortcutKey: "S+" + layerindex,
        layerGroup: 'wme_tsr',
        displayInLayerSwitcher: true //True is the default
      }
    );
    layerSubdivision.setZIndex(-9999);
    layerSubdivision.styleMap = new OpenLayers.StyleMap({
      strokeColor: LAYER_COLOR,
      strokeOpacity: 0.5,
      strokeWidth: 3,
      fillColor: LAYER_COLOR,
      fillOpacity: 0.02,
      pointRadius: 6,
      fontColor: 'white',
      labelOutlineColor: LAYER_COLOR,
      labelOutlineWidth: 4,
      labelAlign: 'left'
    });

    // add data to the map
    layerSubdivision.addFeatures(features);
    layer_id = layerSubdivision.id;
    
    Waze.map.addLayer(layerSubdivision);
  }
  
  //-----------------------------------------------
  // Reset everything in the form 
  //
  function countySubdivisionsReset() {
    county_subivisions_loaded = false;
    subdivision_data = {};
    pickerFormReset();
    removeCountySubdivisionLayer();
    
    county_subdivion_not_defined = [];    
    document.getElementById(STATUS_ID_COUNTY_SUBDIVISION_NOT_DEFINED).innerHTML = "";

    statusMessage(STATUS_ID_COUNTY_SUBDIVISION, STATUS_COLOR_DEFAULT, "");
    fileButtonText(BUTTON_FILE_COUNTY_SUBDIVISIONS, "", BUTTON_FILE_COUNTY_SUBDIVISIONS_TEXT);
    

  }

  //-----------------------------------------------
  // Populate the dropdown with the names of the counties
  // 
  function populatePickerForm() {
    document.getElementById('WME_TSR_County').style.borderColor = STATUS_COLOR_DEFAULT;

    var counties = [];
    var dataStoreObject = Object.keys(subdivision_data);
    for(var i = 0; i < dataStoreObject.length; i++) {
      counties[counties.length] = dataStoreObject[i];
      //console.log(dataStoreObject[i]);
    }
    //console.log(dataStoreObject.length + " " + counties);
    counties.sort();
    for(var i = 0; i < counties.length; i++){
      var ele = document.createElement('option');
      ele.value = counties[i];
      ele.innerHTML = counties[i];
      document.getElementById('WME_TSR_County').options[document.getElementById('WME_TSR_County').options.length] = ele;
    }

    //Now that we have counties, populate the Township box for the first time.
    populateTownshipDropdown();

    document.getElementById('WME_TSR_Rename_Picker').style.display = "block";
  }
  
  //-----------------------------------------------
  // Reset everything in the form to the original setup
  // 
  function pickerFormReset() {
    for(var i = document.getElementById('WME_TSR_County').options.length; i >= 0; i--){
      document.getElementById('WME_TSR_County').remove(i);
    }
    townshipDropdownBoxReset();

    document.getElementById('WME_TSR_Rename_Picker').style.display = "none";
  }

  //-----------------------------------------------
  // Take the list of townships that we got from the subdivision file and place an entry for them in the dropdown.
  // 
  function populateTownshipDropdown() {
    townshipDropdownBoxReset();

    var dataStoreObject = Object.keys(subdivision_data);
    for(var i = 0; i < dataStoreObject.length; i++) {
      //console.log(subdivision_data[dataStoreObject[i]].towns);
      if( dataStoreObject[i] == document.getElementById('WME_TSR_County').options[document.getElementById('WME_TSR_County').selectedIndex].value) {
        var dataStoreObject1 = Object.keys(subdivision_data[dataStoreObject[i]].towns);

        //Add a "blank" option to the menu
        var eleBlank = document.createElement('option');
        eleBlank.value = "";
        eleBlank.innerHTML = dataStoreObject1.length + " Township" + (dataStoreObject1.length > 1 ? "s" : "");
        document.getElementById('WME_TSR_Township').options[document.getElementById('WME_TSR_Township').options.length] = eleBlank;

        for(var j = 0; j < dataStoreObject1.length; j++)
        {
          //console.log(dataStoreObject1[j]);
          var ele = document.createElement('option');
          ele.value = dataStoreObject1[j];
          ele.innerHTML = dataStoreObject1[j];
          document.getElementById('WME_TSR_Township').options[document.getElementById('WME_TSR_Township').options.length] = ele;
        }
        break;
      }
    }

    var allTownshipsOption = document.createElement('option');
    allTownshipsOption.value = "all";
    allTownshipsOption.innerHTML = "-^- All -^-";
    document.getElementById('WME_TSR_Township').options[document.getElementById('WME_TSR_Township').options.length] = allTownshipsOption;
  }

  //-----------------------------------------------
  // Clear township dropdown box
  // 
  function townshipDropdownBoxReset(){
    document.getElementById('WME_TSR_Township').style.borderColor = STATUS_COLOR_DEFAULT;
    for(var i = document.getElementById('WME_TSR_Township').options.length; i >= 0; i--){
      document.getElementById('WME_TSR_Township').remove(i);
    }
  }
  
  //-----------------------------------------------
  // When the township dropdown box changes we will move the view to the center of their selection.
  // 
  function townshipDropdownBoxChanged(evt) {
    //console.log(evt.target.value);
    if(evt.target.value){
      document.getElementById('WME_TSR_Township').style.borderColor = STATUS_COLOR_DEFAULT;
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_DEFAULT, "");

      var county = document.getElementById('WME_TSR_County').value;
      var town = evt.target.value;
      var centerY = 0;
      var centerX = 0;

      if(town == "all"){ //Find the center spot of the county.
        var dataStoreObject1 = Object.keys(subdivision_data[county].towns);
        var farthestTop = subdivision_data[county].towns[dataStoreObject1[0]].bounds.top;
        var farthestBottom = subdivision_data[county].towns[dataStoreObject1[0]].bounds.bottom;
        var farthestLeft = subdivision_data[county].towns[dataStoreObject1[0]].bounds.left;
        var farthestRight = subdivision_data[county].towns[dataStoreObject1[0]].bounds.right;
        
        for(var i = 1; i < dataStoreObject1.length; i++){
          if(subdivision_data[county].towns[dataStoreObject1[i]].bounds.top > farthestTop){farthestTop = subdivision_data[county].towns[dataStoreObject1[i]].bounds.top;}
          if(subdivision_data[county].towns[dataStoreObject1[i]].bounds.bottom < farthestBottom){farthestBottom = subdivision_data[county].towns[dataStoreObject1[i]].bounds.bottom;}
          if(subdivision_data[county].towns[dataStoreObject1[i]].bounds.left < farthestLeft){farthestLeft = subdivision_data[county].towns[dataStoreObject1[i]].bounds.left;}
          if(subdivision_data[county].towns[dataStoreObject1[i]].bounds.right > farthestRight){farthestRight = subdivision_data[county].towns[dataStoreObject1[i]].bounds.right;}
          //console.log(subdivision_data[county] + " " + subdivision_data[county].towns[dataStoreObject1[i]].bounds.top + " " + farthestLeft + " " + farthestRight + " " + farthestBottom + " " + farthestTop);
        }
        centerX = (farthestLeft - farthestRight) / 2 + farthestRight;
        centerY = (farthestTop - farthestBottom) / 2 + farthestBottom;
      } else {
        //console.log(subdivision_data[county].towns[town]);
        centerX = (subdivision_data[county].towns[town].bounds.left - subdivision_data[county].towns[town].bounds.right) / 2 + subdivision_data[county].towns[town].bounds.right;
        centerY = (subdivision_data[county].towns[town].bounds.top - subdivision_data[county].towns[town].bounds.bottom) / 2 + subdivision_data[county].towns[town].bounds.bottom;
      }

      var panToPlace = new OpenLayers.LonLat(centerX, centerY);
      Waze.map.panTo(panToPlace);
    }
  }

  //-----------------------------------------------
  //  Validate that the user has picked valid inputs before scanning segments
  //
  function WME_TSR_ScanRoads(evt) {
    resetScanStats();
    
    var county = document.getElementById('WME_TSR_County').value;
    var township = document.getElementById('WME_TSR_Township').value;

    //Make sure county field is not null or blank.  Not sure how this would happen but it might.
    if(!county) {
      document.getElementById('WME_TSR_County').style.borderColor = STATUS_COLOR_ERROR;
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_ERROR, "County dropdown is null or blank.");
      return;
    }
    //Make sure this is a county that we have data loaded for
    if(!subdivision_data[county]) {
      document.getElementById('WME_TSR_County').style.borderColor = STATUS_COLOR_ERROR;
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_ERROR, "County data was not loaded.");
      return;
    }

    //Validate the towns data
    //Requirements:
    //  Make sure the township field is not null or blank. (This can happen if the user does not select a township and clicks run.
    if(!township){
      document.getElementById('WME_TSR_Township').style.borderColor = STATUS_COLOR_ERROR;
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_ERROR, "You must pick a valid township.");
      return;
    }
    //  Make sure we have a township selected that we have data for.
    if(!subdivision_data[county].towns[township]){
      document.getElementById('WME_TSR_Township').style.borderColor = STATUS_COLOR_ERROR;
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_ERROR, "No data for this township.");
      return;
    }
    //  Not named "County subdivisions not defined"  (If the user picked "All" there is a special case here)
    if(township == INVALID_TOWN_NAME) {
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_ERROR, "Cannot check township named: " + INVALID_TOWN_NAME);
      return;
    }
    
    //Township must have at least 3 points to make a polygon to check.
    if(subdivision_data[county].towns[township].components.length > 0) {
      if(subdivision_data[county].towns[township].components.length < 3) {
        statusMessage(STATUS_ID_SCAN, STATUS_COLOR_ERROR, township + " has less then 3 coordinates.");
        return;
      }
    } else { //There was no coordinate data for the township
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_ERROR, township + " has no coordinate data.");
      return;
    }
    
    //console.log("Township data validation passed");
    processTown(county, township);
  }
  
  //-----------------------------------------------
  // Collect all the information needed to scan the town and setup the listener and start the scanning process.
  // 
  function processTown(county, township) {
    //Determine if the towns points are in clockwise or counter-clockwise order
    var sumOfDistanceOfBoundariesForTown = 0;
    var townBoundaryPoints = subdivision_data[county].towns[township].components;
    for(var j = 0; j < townBoundaryPoints.length - 1; j++){ //The list of points has the last one being the first point so we skip the last one.
      var pointA = {'x': townBoundaryPoints[j].x,'y': townBoundaryPoints[j].y};
      var pointB = {'x': townBoundaryPoints[j+1].x,'y': townBoundaryPoints[j+1].y};
      sumOfDistanceOfBoundariesForTown += (pointB.x - pointA.x) * (pointB.y + pointB.y);
      
      var tempLineString = new OpenLayers.Geometry.LineString(new Array(new OpenLayers.Geometry.Point(pointA.x,pointA.y),new OpenLayers.Geometry.Point(pointB.x,pointB.y)));
      tempLineString.calculateBounds();
      town_border_line_strings[town_border_line_strings.length] = tempLineString;
      //console.log("Town border segment added.");
    }
    //console.log(town_border_line_strings);
    
    if(sumOfDistanceOfBoundariesForTown > 0) {
      town_border_direction = "Clockwise";
    } else if(sumOfDistanceOfBoundariesForTown < 0) {
      town_border_direction = "Counter-Clockwise";
    }

    var movementTolerance = 10;  // This well give the screen movement a bit of overlap.  Not sure if we want this or not.
    
    Waze.map.zoomTo(ZOOM_TO_LEVEL);
    var mapBounds = Waze.map.calculateBounds(); //We are checking the bounding box of the map.  We MUST zoom to the correct level before this is called.   
    
    // TODO CHANGE THESE:
   checkCounty = county;
   checkTownship = township;
    
    Waze_segment_layer = Waze.selectionManager.layers[2];
    
    //This is needed to track if the user changes the size of their screen.  Provides a starting point for the check
    var verticalDistanceOfLastView = Math.abs(mapBounds.left - mapBounds.right);
    var horizontalDistanceOfLastView = Math.abs(mapBounds.top - mapBounds.bottom);
    
    map_center_lon_start = subdivision_data[county].towns[township].bounds.left + (verticalDistanceOfLastView / 2 - movementTolerance);
    map_center_lat = subdivision_data[county].towns[township].bounds.top - (horizontalDistanceOfLastView / 2 - movementTolerance);
    map_center_lon = map_center_lon_start;
    
    //Enable controls
    scan_in_progress = true;
    updateScanControlButtons();
    
    console.log("Start scanning " + county + " - " + township);
    
    observer.observe(document.getElementById(Waze_segment_layer.id + '_vroot'),
      {attributes: true, childList: true, characterData: true});
      

    //Make sure our observer is setup before we start.      
    window.setTimeout(function(){
      //Start by moving map to start location
      Waze.map.setCenter(new OpenLayers.LonLat(map_center_lon, map_center_lat),ZOOM_TO_LEVEL);
    }, 50);
    
    //This is a special case where we move into a map view and we do not find any segments (a lake or something)
    //  We want it as an interval in case more then one map view in a row has no segments.
    scan_no_segments_found_interval_id = window.setInterval(processMapView, scan_no_segments_found_interval_time, checkCounty, checkTownship);
  }
  
  //-----------------------------------------------
  // Take the current view of segments and check their position to see if they intersect with the town border.
  //   
  // 
  function processMapView(county, township){  
    //Processing controls
    if(scan_is_paused) {
      console.log("Paused scanning " + county + " - " + township);
      return;
    }
    if(!scan_in_progress) {
      console.log("Cancelled scanning " + county + " - " + township);
      return;
    }
    
    var townBordersThatAreInThisView = [];
    
    Waze.map.zoomTo(ZOOM_TO_LEVEL);
    var viewBounds = Waze.map.calculateBounds(); //We are checking the bounding box of the map and computing the distance.  We MUST zoom to the correct level before this is called.
    var horizontalDistance = Math.abs(viewBounds.left - viewBounds.right);
    var verticalDistance = Math.abs(viewBounds.top - viewBounds.bottom);
    var viewAABB = {'x' : viewBounds.left,
                    'y' : viewBounds.bottom,
                    'w' : Math.abs(viewBounds.left - viewBounds.right),
                    'h' : viewBounds.top - viewBounds.bottom};
    
    var viewLinearRing = new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(viewBounds.left,viewBounds.top),new OpenLayers.Geometry.Point(viewBounds.right,viewBounds.top),
    new OpenLayers.Geometry.Point(viewBounds.right,viewBounds.bottom),new OpenLayers.Geometry.Point(viewBounds.left,viewBounds.bottom),new OpenLayers.Geometry.Point(viewBounds.left,viewBounds.top)]);
    
    //console.log(subdivision_data[county].towns[township].bounds);
    //console.log(map_center_lon + " , " + map_center_lat);
    
    if(map_center_lon + (horizontalDistance / 2)  >= subdivision_data[county].towns[township].bounds.right) {
      map_center_lat -= verticalDistance;
      map_center_lon = map_center_lon_start;
    }
    
    //Check if any of the town's borders are within this view.
    for(var i = 0; i < town_border_line_strings.length; i++) {
      var lineStringAABB = {'x': town_border_line_strings[i].bounds.left,
                            'y': town_border_line_strings[i].bounds.bottom,
                            'w': Math.abs(town_border_line_strings[i].bounds.left - town_border_line_strings[i].bounds.right),
                            'h': town_border_line_strings[i].bounds.top - town_border_line_strings[i].bounds.bottom};
      if( axisAlignedBoundingBoxTest(viewAABB,lineStringAABB) ) {
        townBordersThatAreInThisView[townBordersThatAreInThisView.length] = i;
      }
    }

    //This is an edge case where the program will not continue onto the next view.  By itself as the layer does not update.
    //Areas where there might not be roads is a large lake.
    if(Waze_segment_layer.features.length === 0) {
      //console.log("features: " + Waze_segment_layer.features.length + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    } else {
      //Interval Reset
      window.clearInterval(scan_no_segments_found_interval_id);
      scan_no_segments_found_interval_id = window.setInterval(processMapView, scan_no_segments_found_interval_time, checkCounty, checkTownship);
      //console.log("features: " + Waze_segment_layer.features.length);
    }

    //TODO: Is the map view even in the town
    if(subdivision_data[county].towns[township].intersects(viewLinearRing)){
      //console.log("View intersects with town.");
    } else {
      //console.log("View does NOT intersect with town.");
    }
    
      //For every segment that is in the current view.      
      for(var i = 0; i < Waze_segment_layer.features.length; i++) {
        
        //Check if segment is inside the town at all. This could be segments of a "concave" like town border or a map view that shows another town.
        if(Waze_segment_layer.features[i].geometry.intersects(subdivision_data[county].towns[township])) {
          
          //TODO: add a tolerance to the intersect check as it misses some town roads by a little bit.
          
          //For every town border in this view
          for(var j = 0; j < townBordersThatAreInThisView.length; j++) {
            if(town_border_line_strings[townBordersThatAreInThisView[j]].intersects(Waze_segment_layer.features[i].geometry)){
              console.log("Intersection between border and segment " + Waze_segment_layer.features[i].model.attributes.id);
            }
          }
          
          if(Waze_segment_layer.features[i].model.model.cities.additionalInfo[0].name !== township) {
            scan_stats.segments_need_town_change++;
          }
          if(Waze_segment_layer.features[i].model.model.states.additionalInfo[0].name !== FIPS_STATE_CODES_TO_NAMES[state_check]) {
            scan_stats.segments_need_state_change++;
          }
          scan_stats.segments_checked++;
        }
      }

    if(map_center_lat + (verticalDistance / 2) < subdivision_data[county].towns[township].bounds.bottom) {
      observer.disconnect();
      scan_in_progress = false;
      scan_is_paused = false;
      window.clearInterval(scan_no_segments_found_interval_id);
      updateScanControlButtons();
      
      console.log("Finished scanning " + county + " - " + township);
      
      console.log("Views in town: " + scan_stats.view_shifts);
      console.log("Segments checked: " + scan_stats.segments_checked);
      console.log("Segments needing City field changed: " + scan_stats.segments_need_town_change);
      console.log("Segments needing State field changed: " + scan_stats.segments_need_state_change);
      
      //Reset any error fields that changed during check
      statusMessage(STATUS_ID_SCAN, STATUS_COLOR_DEFAULT, "");        
      return;
    }
    map_center_lon += horizontalDistance;
    //Position the map to the next view
    Waze.map.setCenter(new OpenLayers.LonLat(map_center_lon, map_center_lat),ZOOM_TO_LEVEL);
    scan_stats.view_shifts++;
  }
  
  //-----------------------------------------------
  // Reset scan stats to default
  // 
  function resetScanStats(){
    scan_stats.segments_need_town_change = 0;
    scan_stats.segments_need_state_change = 0;
    scan_stats.segments_checked = 0;
    scan_stats.view_shifts = 1;
  }

  //-----------------------------------------------
  // Check if two bounding boxes intersect with each other.
  //   Objects should be in form {x,y,width,height}
  function axisAlignedBoundingBoxTest(town1, town2) {
    return(town1.x < town2.w + town2.x &&
    town1.x + town1.w > town2.x &&
    town1.y < town2.h + town2.y &&
    town1.y + town1.h > town2.y );
  }
  
  //-----------------------------------------------
  // Changes the look of the scan control buttons to match the state of scanning a town
  // 
  function updateScanControlButtons() {
    if(scan_in_progress === true) {
      if(scan_is_paused === false){
        document.getElementById(BUTTON_CTRL_ID_START).className = BUTTON_CTRL_CLASSNAME_DISABLED;
        document.getElementById(BUTTON_CTRL_ID_START).innerHTML = BUTTON_CTRL_START_TEXT;
        document.getElementById(BUTTON_CTRL_ID_PAUSE).className = BUTTON_CTRL_CLASSNAME;
        document.getElementById(BUTTON_CTRL_ID_CANCEL).className = BUTTON_CTRL_CLASSNAME;
      } else {
        document.getElementById(BUTTON_CTRL_ID_START).className = BUTTON_CTRL_CLASSNAME;
        document.getElementById(BUTTON_CTRL_ID_START).innerHTML = BUTTON_CTRL_CONTINUE_TEXT;
        document.getElementById(BUTTON_CTRL_ID_PAUSE).className = BUTTON_CTRL_CLASSNAME_DISABLED;
        document.getElementById(BUTTON_CTRL_ID_CANCEL).className = BUTTON_CTRL_CLASSNAME;
      }
    } else {
      document.getElementById(BUTTON_CTRL_ID_START).className = BUTTON_CTRL_CLASSNAME;
      document.getElementById(BUTTON_CTRL_ID_START).innerHTML = BUTTON_CTRL_START_TEXT;
      document.getElementById(BUTTON_CTRL_ID_PAUSE).className = BUTTON_CTRL_CLASSNAME_DISABLED;
      document.getElementById(BUTTON_CTRL_ID_CANCEL).className = BUTTON_CTRL_CLASSNAME_DISABLED;
    }
  }

  //-----------------------------------------------
  // Remove the layer created of the county subdivisions
  //
  function removeCountySubdivisionLayer() {
    if(layer_id !== "") {
      var layer = Waze.map.getLayer(layer_id);
      layer.destroy();
    }
  }
  
  //-----------------------------------------------
  // Write a status message to a field with a specific type.
  //   where: Where should the message be written
  //   color: What color to write the text as
  //   message: The message to write
  function statusMessage(where, color, message) {
    document.getElementById(where).style.color = color;
    document.getElementById(where).innerHTML = message;
  }
  
  //-----------------------------------------------
  // Change file upload buttons text
  //   where: which button id to change
  //   title: the title attribute for the button
  //   message: the message to put in the button
  function fileButtonText(where, title, message) {
    document.getElementById(where).title = title;
    document.getElementById(where).innerHTML = message;
  }

  //-----------------------------------------------
  // Replace missing functions in OpenLayers 2.12
  //   Credit: Timbones - Thanks for allowing any of this to be possible and giving something to start with.
  //    https://www.waze.com/forum/viewtopic.php?t=129735
  //    https://greasyfork.org/en/scripts/8129-wme-geometries
  function patchOpenLayers() {
    if (OpenLayers.VERSION_NUMBER != 'Release 2.12') {
      console.log("WME TSR: OpenLayers version mismatch - cannot apply patch");
      return;
    }

/* jshint ignore:start */
    OpenLayers.Format.KML=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{kml:"http://www.opengis.net/kml/2.2",gx:"http://www.google.com/kml/ext/2.2"},kmlns:"http://earth.google.com/kml/2.0",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date,extractAttributes:!0,kvpAttributes:!1,extractStyles:!1,extractTracks:!1,trackAttributes:null,internalns:null,features:null,styles:null,styleBaseUrl:"",fetched:null,maxDepth:0,initialize:function(a){this.regExes=
{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g,kmlColor:/(\w{2})(\w{2})(\w{2})(\w{2})/,kmlIconPalette:/root:\/\/icons\/palette-(\d+)(\.\w+)/,straightBracket:/\$\[(.*?)\]/g};this.externalProjection=new OpenLayers.Projection("EPSG:4326");OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){this.features=[];this.styles={};this.fetched={};return this.parseData(a,{depth:0,styleBaseUrl:this.styleBaseUrl})},parseData:function(a,b){"string"==typeof a&&
(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));for(var c=["Link","NetworkLink","Style","StyleMap","Placemark"],d=0,e=c.length;d<e;++d){var f=c[d],g=this.getElementsByTagNameNS(a,"*",f);if(0!=g.length)switch(f.toLowerCase()){case "link":case "networklink":this.parseLinks(g,b);break;case "style":this.extractStyles&&this.parseStyles(g,b);break;case "stylemap":this.extractStyles&&this.parseStyleMaps(g,b);break;case "placemark":this.parseFeatures(g,b)}}return this.features},parseLinks:function(a,
b){if(b.depth>=this.maxDepth)return!1;var c=OpenLayers.Util.extend({},b);c.depth++;for(var d=0,e=a.length;d<e;d++){var f=this.parseProperty(a[d],"*","href");f&&!this.fetched[f]&&(this.fetched[f]=!0,(f=this.fetchLink(f))&&this.parseData(f,c))}},fetchLink:function(a){if(a=OpenLayers.Request.GET({url:a,async:!1}))return a.responseText},parseStyles:function(a,b){for(var c=0,d=a.length;c<d;c++){var e=this.parseStyle(a[c]);e&&(this.styles[(b.styleBaseUrl||"")+"#"+e.id]=e)}},parseKmlColor:function(a){var b=
null;a&&(a=a.match(this.regExes.kmlColor))&&(b={color:"#"+a[4]+a[3]+a[2],opacity:parseInt(a[1],16)/255});return b},parseStyle:function(a){for(var b={},c=["LineStyle","PolyStyle","IconStyle","BalloonStyle","LabelStyle"],d,e,f=0,g=c.length;f<g;++f)if(d=c[f],e=this.getElementsByTagNameNS(a,"*",d)[0])switch(d.toLowerCase()){case "linestyle":d=this.parseProperty(e,"*","color");if(d=this.parseKmlColor(d))b.strokeColor=d.color,b.strokeOpacity=d.opacity;(d=this.parseProperty(e,"*","width"))&&(b.strokeWidth=
d);break;case "polystyle":d=this.parseProperty(e,"*","color");if(d=this.parseKmlColor(d))b.fillOpacity=d.opacity,b.fillColor=d.color;"0"==this.parseProperty(e,"*","fill")&&(b.fillColor="none");"0"==this.parseProperty(e,"*","outline")&&(b.strokeWidth="0");break;case "iconstyle":var h=parseFloat(this.parseProperty(e,"*","scale")||1);d=32*h;var i=32*h,j=this.getElementsByTagNameNS(e,"*","Icon")[0];if(j){var k=this.parseProperty(j,"*","href");if(k){var l=this.parseProperty(j,"*","w"),m=this.parseProperty(j,
"*","h");OpenLayers.String.startsWith(k,"http://maps.google.com/mapfiles/kml")&&(!l&&!m)&&(m=l=64,h/=2);l=l||m;m=m||l;l&&(d=parseInt(l)*h);m&&(i=parseInt(m)*h);if(m=k.match(this.regExes.kmlIconPalette))l=m[1],m=m[2],k=this.parseProperty(j,"*","x"),j=this.parseProperty(j,"*","y"),k="http://maps.google.com/mapfiles/kml/pal"+l+"/icon"+(8*(j?7-j/32:7)+(k?k/32:0))+m;b.graphicOpacity=1;b.externalGraphic=k}}if(e=this.getElementsByTagNameNS(e,"*","hotSpot")[0])k=parseFloat(e.getAttribute("x")),j=parseFloat(e.getAttribute("y")),
l=e.getAttribute("xunits"),"pixels"==l?b.graphicXOffset=-k*h:"insetPixels"==l?b.graphicXOffset=-d+k*h:"fraction"==l&&(b.graphicXOffset=-d*k),e=e.getAttribute("yunits"),"pixels"==e?b.graphicYOffset=-i+j*h+1:"insetPixels"==e?b.graphicYOffset=-(j*h)+1:"fraction"==e&&(b.graphicYOffset=-i*(1-j)+1);b.graphicWidth=d;b.graphicHeight=i;break;case "balloonstyle":(e=OpenLayers.Util.getXmlNodeValue(e))&&(b.balloonStyle=e.replace(this.regExes.straightBracket,"${$1}"));break;case "labelstyle":if(d=this.parseProperty(e,
"*","color"),d=this.parseKmlColor(d))b.fontColor=d.color,b.fontOpacity=d.opacity}!b.strokeColor&&b.fillColor&&(b.strokeColor=b.fillColor);if((a=a.getAttribute("id"))&&b)b.id=a;return b},parseStyleMaps:function(a,b){for(var c=0,d=a.length;c<d;c++)for(var e=a[c],f=this.getElementsByTagNameNS(e,"*","Pair"),e=e.getAttribute("id"),g=0,h=f.length;g<h;g++){var i=f[g],j=this.parseProperty(i,"*","key");(i=this.parseProperty(i,"*","styleUrl"))&&"normal"==j&&(this.styles[(b.styleBaseUrl||"")+"#"+e]=this.styles[(b.styleBaseUrl||
"")+i])}},parseFeatures:function(a,b){for(var c=[],d=0,e=a.length;d<e;d++){var f=a[d],g=this.parseFeature.apply(this,[f]);if(g){this.extractStyles&&(g.attributes&&g.attributes.styleUrl)&&(g.style=this.getStyle(g.attributes.styleUrl,b));if(this.extractStyles){var h=this.getElementsByTagNameNS(f,"*","Style")[0];if(h&&(h=this.parseStyle(h)))g.style=OpenLayers.Util.extend(g.style,h)}if(this.extractTracks){if((f=this.getElementsByTagNameNS(f,this.namespaces.gx,"Track"))&&0<f.length)g={features:[],feature:g},
this.readNode(f[0],g),0<g.features.length&&c.push.apply(c,g.features)}else c.push(g)}else throw"Bad Placemark: "+d;}this.features=this.features.concat(c)},readers:{kml:{when:function(a,b){b.whens.push(OpenLayers.Date.parse(this.getChildValue(a)))},_trackPointAttribute:function(a,b){var c=a.nodeName.split(":").pop();b.attributes[c].push(this.getChildValue(a))}},gx:{Track:function(a,b){var c={whens:[],points:[],angles:[]};if(this.trackAttributes){var d;c.attributes={};for(var e=0,f=this.trackAttributes.length;e<
f;++e)d=this.trackAttributes[e],c.attributes[d]=[],d in this.readers.kml||(this.readers.kml[d]=this.readers.kml._trackPointAttribute)}this.readChildNodes(a,c);if(c.whens.length!==c.points.length)throw Error("gx:Track with unequal number of when ("+c.whens.length+") and gx:coord ("+c.points.length+") elements.");var g=0<c.angles.length;if(g&&c.whens.length!==c.angles.length)throw Error("gx:Track with unequal number of when ("+c.whens.length+") and gx:angles ("+c.angles.length+") elements.");for(var h,
i,e=0,f=c.whens.length;e<f;++e){h=b.feature.clone();h.fid=b.feature.fid||b.feature.id;i=c.points[e];h.geometry=i;"z"in i&&(h.attributes.altitude=i.z);this.internalProjection&&this.externalProjection&&h.geometry.transform(this.externalProjection,this.internalProjection);if(this.trackAttributes){i=0;for(var j=this.trackAttributes.length;i<j;++i)h.attributes[d]=c.attributes[this.trackAttributes[i]][e]}h.attributes.when=c.whens[e];h.attributes.trackId=b.feature.id;g&&(i=c.angles[e],h.attributes.heading=
parseFloat(i[0]),h.attributes.tilt=parseFloat(i[1]),h.attributes.roll=parseFloat(i[2]));b.features.push(h)}},coord:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(/\s+/),d=new OpenLayers.Geometry.Point(c[0],c[1]);2<c.length&&(d.z=parseFloat(c[2]));b.points.push(d)},angles:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(/\s+/);b.angles.push(c)}}},parseFeature:function(a){for(var b=["MultiGeometry","Polygon","LineString","Point"],
c,d,e,f=0,g=b.length;f<g;++f)if(c=b[f],this.internalns=a.namespaceURI?a.namespaceURI:this.kmlns,d=this.getElementsByTagNameNS(a,this.internalns,c),0<d.length){if(b=this.parseGeometry[c.toLowerCase()])e=b.apply(this,[d[0]]),this.internalProjection&&this.externalProjection&&e.transform(this.externalProjection,this.internalProjection);else throw new TypeError("Unsupported geometry type: "+c);break}var h;this.extractAttributes&&(h=this.parseAttributes(a));c=new OpenLayers.Feature.Vector(e,h);a=a.getAttribute("id")||
a.getAttribute("name");null!=a&&(c.fid=a);return c},getStyle:function(a,b){var c=OpenLayers.Util.removeTail(a),d=OpenLayers.Util.extend({},b);d.depth++;d.styleBaseUrl=c;!this.styles[a]&&!OpenLayers.String.startsWith(a,"#")&&d.depth<=this.maxDepth&&!this.fetched[c]&&(c=this.fetchLink(c))&&this.parseData(c,d);return OpenLayers.Util.extend({},this.styles[a])},parseGeometry:{point:function(a){var b=this.getElementsByTagNameNS(a,this.internalns,"coordinates"),a=[];if(0<b.length)var c=b[0].firstChild.nodeValue,
c=c.replace(this.regExes.removeSpace,""),a=c.split(",");b=null;if(1<a.length)2==a.length&&(a[2]=null),b=new OpenLayers.Geometry.Point(a[0],a[1],a[2]);else throw"Bad coordinate string: "+c;return b},linestring:function(a,b){var c=this.getElementsByTagNameNS(a,this.internalns,"coordinates"),d=null;if(0<c.length){for(var c=this.getChildValue(c[0]),c=c.replace(this.regExes.trimSpace,""),c=c.replace(this.regExes.trimComma,","),d=c.split(this.regExes.splitSpace),e=d.length,f=Array(e),g,h,i=0;i<e;++i)if(g=
d[i].split(","),h=g.length,1<h)2==g.length&&(g[2]=null),f[i]=new OpenLayers.Geometry.Point(g[0],g[1],g[2]);else throw"Bad LineString point coordinates: "+d[i];if(e)d=b?new OpenLayers.Geometry.LinearRing(f):new OpenLayers.Geometry.LineString(f);else throw"Bad LineString coordinates: "+c;}return d},polygon:function(a){var a=this.getElementsByTagNameNS(a,this.internalns,"LinearRing"),b=a.length,c=Array(b);if(0<b)for(var d=0,e=a.length;d<e;++d)if(b=this.parseGeometry.linestring.apply(this,[a[d],!0]))c[d]=
b;else throw"Bad LinearRing geometry: "+d;return new OpenLayers.Geometry.Polygon(c)},multigeometry:function(a){for(var b,c=[],d=a.childNodes,e=0,f=d.length;e<f;++e)a=d[e],1==a.nodeType&&(b=this.parseGeometry[(a.prefix?a.nodeName.split(":")[1]:a.nodeName).toLowerCase()])&&c.push(b.apply(this,[a]));return new OpenLayers.Geometry.Collection(c)}},parseAttributes:function(a){var b={},c=a.getElementsByTagName("ExtendedData");c.length&&(b=this.parseExtendedData(c[0]));for(var d,e,f,a=a.childNodes,c=0,g=
a.length;c<g;++c)if(d=a[c],1==d.nodeType&&(e=d.childNodes,1<=e.length&&3>=e.length)){switch(e.length){case 1:f=e[0];break;case 2:f=e[0];e=e[1];f=3==f.nodeType||4==f.nodeType?f:e;break;default:f=e[1]}if(3==f.nodeType||4==f.nodeType)if(d=d.prefix?d.nodeName.split(":")[1]:d.nodeName,f=OpenLayers.Util.getXmlNodeValue(f))f=f.replace(this.regExes.trimSpace,""),b[d]=f}return b},parseExtendedData:function(a){var b={},c,d,e,f,g=a.getElementsByTagName("Data");c=0;for(d=g.length;c<d;c++){e=g[c];f=e.getAttribute("name");
var h={},i=e.getElementsByTagName("value");i.length&&(h.value=this.getChildValue(i[0]));this.kvpAttributes?b[f]=h.value:(e=e.getElementsByTagName("displayName"),e.length&&(h.displayName=this.getChildValue(e[0])),b[f]=h)}a=a.getElementsByTagName("SimpleData");c=0;for(d=a.length;c<d;c++)h={},e=a[c],f=e.getAttribute("name"),h.value=this.getChildValue(e),this.kvpAttributes?b[f]=h.value:(h.displayName=f,b[f]=h);return b},parseProperty:function(a,b,c){var d,a=this.getElementsByTagNameNS(a,b,c);try{d=OpenLayers.Util.getXmlNodeValue(a[0])}catch(e){d=
null}return d},write:function(a){OpenLayers.Util.isArray(a)||(a=[a]);for(var b=this.createElementNS(this.kmlns,"kml"),c=this.createFolderXML(),d=0,e=a.length;d<e;++d)c.appendChild(this.createPlacemarkXML(a[d]));b.appendChild(c);return OpenLayers.Format.XML.prototype.write.apply(this,[b])},createFolderXML:function(){var a=this.createElementNS(this.kmlns,"Folder");if(this.foldersName){var b=this.createElementNS(this.kmlns,"name"),c=this.createTextNode(this.foldersName);b.appendChild(c);a.appendChild(b)}this.foldersDesc&&
(b=this.createElementNS(this.kmlns,"description"),c=this.createTextNode(this.foldersDesc),b.appendChild(c),a.appendChild(b));return a},createPlacemarkXML:function(a){var b=this.createElementNS(this.kmlns,"name");b.appendChild(this.createTextNode(a.style&&a.style.label?a.style.label:a.attributes.name||a.id));var c=this.createElementNS(this.kmlns,"description");c.appendChild(this.createTextNode(a.attributes.description||this.placemarksDesc));var d=this.createElementNS(this.kmlns,"Placemark");null!=
a.fid&&d.setAttribute("id",a.fid);d.appendChild(b);d.appendChild(c);b=this.buildGeometryNode(a.geometry);d.appendChild(b);a.attributes&&(a=this.buildExtendedData(a.attributes))&&d.appendChild(a);return d},buildGeometryNode:function(a){var b=a.CLASS_NAME,b=this.buildGeometry[b.substring(b.lastIndexOf(".")+1).toLowerCase()],c=null;b&&(c=b.apply(this,[a]));return c},buildGeometry:{point:function(a){var b=this.createElementNS(this.kmlns,"Point");b.appendChild(this.buildCoordinatesNode(a));return b},multipoint:function(a){return this.buildGeometry.collection.apply(this,
[a])},linestring:function(a){var b=this.createElementNS(this.kmlns,"LineString");b.appendChild(this.buildCoordinatesNode(a));return b},multilinestring:function(a){return this.buildGeometry.collection.apply(this,[a])},linearring:function(a){var b=this.createElementNS(this.kmlns,"LinearRing");b.appendChild(this.buildCoordinatesNode(a));return b},polygon:function(a){for(var b=this.createElementNS(this.kmlns,"Polygon"),a=a.components,c,d,e=0,f=a.length;e<f;++e)c=0==e?"outerBoundaryIs":"innerBoundaryIs",
c=this.createElementNS(this.kmlns,c),d=this.buildGeometry.linearring.apply(this,[a[e]]),c.appendChild(d),b.appendChild(c);return b},multipolygon:function(a){return this.buildGeometry.collection.apply(this,[a])},collection:function(a){for(var b=this.createElementNS(this.kmlns,"MultiGeometry"),c,d=0,e=a.components.length;d<e;++d)(c=this.buildGeometryNode.apply(this,[a.components[d]]))&&b.appendChild(c);return b}},buildCoordinatesNode:function(a){var b=this.createElementNS(this.kmlns,"coordinates"),
c;if(c=a.components){for(var d=c.length,e=Array(d),f=0;f<d;++f)a=c[f],e[f]=this.buildCoordinates(a);c=e.join(" ")}else c=this.buildCoordinates(a);c=this.createTextNode(c);b.appendChild(c);return b},buildCoordinates:function(a){this.internalProjection&&this.externalProjection&&(a=a.clone(),a.transform(this.internalProjection,this.externalProjection));return a.x+","+a.y},buildExtendedData:function(a){var b=this.createElementNS(this.kmlns,"ExtendedData"),c;for(c in a)if(a[c]&&"name"!=c&&"description"!=
c&&"styleUrl"!=c){var d=this.createElementNS(this.kmlns,"Data");d.setAttribute("name",c);var e=this.createElementNS(this.kmlns,"value");if("object"==typeof a[c]){if(a[c].value&&e.appendChild(this.createTextNode(a[c].value)),a[c].displayName){var f=this.createElementNS(this.kmlns,"displayName");f.appendChild(this.getXMLDoc().createCDATASection(a[c].displayName));d.appendChild(f)}}else e.appendChild(this.createTextNode(a[c]));d.appendChild(e);b.appendChild(d)}return this.isSimpleContent(b)?null:b},
CLASS_NAME:"OpenLayers.Format.KML"});
/* jshint ignore:end */
    formats.KML = new OpenLayers.Format.KML();
  }

})();