/*jslint
   browser, for, multivar, single, white, this
*/
/*global
   Components, GM_info, console, window
*/
// ==UserScript==
// @name          WME Missing SL
// @namespace     https://greasyfork.org/en/scripts/23210-wme-missing-sl
// @description   Highlights user-selected road type segments missing speed limits
// @version       0.9.3
// @author        jbpace63
// @copyright     Jon Pace, 2016
// @grant         GM_info
// @include       https://*.waze.com/editor/*
// @include       https://*.waze.com/*/editor/*
// @include       https://editor-beta.waze.com/*
// @exclude       https://*.waze.com/user/*
// @exclude       https://*.waze.com/*/user/*
// @icon          data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/23210/WME%20Missing%20SL.user.js
// @updateURL https://update.greasyfork.org/scripts/23210/WME%20Missing%20SL.meta.js
// ==/UserScript==
//
// TO-DO LIST
// ----------
// test script in Firefox, IE10 & Edge browsers
// Street types not always properly highlighted when checked, even when still visible on screen and zoom set to 0
// Need way to confirm everything is loaded before starting - too many "Cannot read property 'getElementsByTagName' of null" errors
// ensure the user is logged in [https://www.waze.com/forum/viewtopic.php?t=172503#p1296497]
// figure out how to add icon to tab
// highlightRoads need to run after Waze save button is clicked (onblur?)
//
// need to use JSHint.com & JSLint.com to scrub code
//

var unsafeWindow, missingSL_name = GM_info.script.name;
var missingSL_ver = ' v ' + GM_info.script.version;

function missingSL_init() {
   'use strict';

   var cancel_icon, confirm_icon, edit_icon, openLayers_window, openLayers_vectors;
   var layers, browserHandle, validRoads, hltOptions, defaultHighlight = '#ff0000';
   var browserTab, browserTabContent, Waze_map, Waze_model, Titles, debug;
   var Waze_window, openLayers_style, typeOfRoad, missingSL_Obj = {};

   cancel_icon = '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';
   confirm_icon = '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';
   edit_icon = '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';

   hltOptions = ['#ff0000','#ff2000','#ff4000','#ff6000','#ff8000','#ffa000','#ffc000','#ffe000','#ffff00','#e0ff00','#c0ff00','#a0ff00','#80ff00','#60ff00','#40ff00','#20ff00','#00ff00','#00ff20','#00ff40','#00ff60','#00ff80','#00ffa0','#00ffc0','#00ffe0','#00ffff','#00e0ff','#00c0ff','#00a0ff','#0080ff','#0060ff','#0040ff','#0020ff','#0000ff','#2000ff','#4000ff','#6000ff','#8000ff','#a000ff','#c000ff','#e000ff','#ff00ff','#ff00e0','#ff00c0','#ff00a0','#ff0080','#ff0060','#ff0040','#ff0020'];

// Zoom reference: 0 = 1 mi, 1 = 5000', 2 = 2000', 3 = 1000', 4 = 500'
//                 5 = 200', 6 =  100', 7 =   50', 8 =   20', 9 =  10'
//
//              Selectable   Visible  // WME seems to cache segments for selectability at higher zooms
// Freeway         2-9         0-9
// Highway         2-9         0-9
// Ramp            2-9         0-9
// Primary Street  2-9         0-9
// Street          4-9         3-9
// Unpaved         ?-9         3-9
//

   typeOfRoad = { '3': {'name':'Freeway',        'checked':true,  'zoom':0},
                  '6': {'name':'Major Highway',  'checked':true,  'zoom':1},
                  '7': {'name':'Minor Highway',  'checked':true,  'zoom':2},
                  '4': {'name':'Ramp',           'checked':false, 'zoom':2},
                  '2': {'name':'Primary Street', 'checked':true,  'zoom':3},
                  '1': {'name':'Street',         'checked':false, 'zoom':4},
                  '8': {'name':'Unpaved',        'checked':false, 'zoom':4} };

   validRoads = [3,6,7,4,2,1,8];

   Titles = [ 'Options',
              'Highlight Color',
              'Confirm new zoom',
              'Confirm new color',
              'Cancel',
              'Modify Highlight',
              'Modify Zoom\n   [0-9 valid]',
              'Check road type',
              'Zoom',
              'Road Types to Check',
              'Highlights unverified speed limits on road types selected above',
              'Highlight unverified speeds',
              'Temporarily hide all highlights',
              'Hide highlighting',
              'Highlights road types selected above with direction still Unknown',
              'Highlight no-direction roads' ];

   missingSL_Obj.useHighlight = defaultHighlight;
   missingSL_Obj.typeOfRoad = typeOfRoad;
   missingSL_Obj.visibility = true;
   missingSL_Obj.highlightUnverified = false;
   missingSL_Obj.showDirectionless = false;
   missingSL_Obj.hideHighlights = false;

   debug = true;

   function log(funcName, msgType, text) {
      text = 'MsgSL] ' + funcName + ': ' + text;

      switch(msgType) {
         case 'info':
            console.info(text);
            break;
         case 'error':
            console.error(text);
            break;
         case 'warn':
            console.warn(text);
            break;
         case 'debug':
            if (debug) { console.debug(text); }
            break;
         default:
            console.log(text);
      }
   }

   function getId(node) {
      if (node !== '') { return document.getElementById(node); }
      return false;
   }

   function getElementsByClassName(className, node) {
      var a = [], re = new RegExp('\\b' + className + '\\b');
      var i, els = node.getElementsByTagName('*');

      for (i=0; i<els.length; i+=1) {
         if (re.test(els[i].className)) { a.push(els[i]); }
      }
      return a;
   }

   function getFunctionWithArgs(func, args) {
      var json_args;

      return (function () {
         json_args = JSON.stringify(args);
         return function () {
            args = JSON.parse(json_args);
            func.apply(this, args);
         };
      } ());
   }

   function isJSONstring(str) {
      if ((str === 'undefined') || (str === null)) { return false; }

      try {
         JSON.parse(str);
      } catch(ignore) {
         return false;
      }
      return true;
   }

   log('missingSL_init', 'info', 'starting');

   function highlightRoads() {
      log('highlightRoads', 'debug', 'starting');
      var attributes, isSelected, revSpeed, fwdSpeedUnverified, revSpeedUnverified;
      var fwdDir, revDir, shiftValue, newLine, segment, geometry, lineFeature = [];
      var roadType, zoom, style, seg, fwdSpeed, isModified, hideHighlights = false;
      var mapResolution, points, highlightUnverified = true, seeNoDirect = false;

      function highlightStyle(typeRoad, zoomLevel, unverified) {
         var newWidth, newColor, newOpacity, newDashes, newLinecap;

         newWidth = 0;
         newColor = '';
         newOpacity = 0.75;
         newDashes = 'solid';
         newLinecap = 'round';

         if (typeRoad === 3) {  // Freeway
            if (zoomLevel > 4) { newWidth = 5; }
            else if (zoomLevel > 2) { newWidth = 4; }
            else { newWidth = 3; }
         } else if ( (typeRoad === 6) || (typeRoad === 7) ) {  // Highway
            if (zoomLevel > 5) { newWidth = 5; }
            else if (zoomLevel > 3) { newWidth = 4; }
            else { newWidth = 3; }
         } else if (typeRoad === 4) {  // Ramp
            if (zoomLevel > 7) { newWidth = 5; }
            else if (zoomLevel > 4) { newWidth = 4; }
            else { newWidth = 3; }
         } else if (typeRoad === 2) {  // Primary Street
            if (zoomLevel > 5) { newWidth = 5; }
            else if (zoomLevel > 4) { newWidth = 4; }
            else if (zoomLevel > 2) { newWidth = 3; }
            else { newWidth = 2; }
         } else if (typeRoad === 1) {  // Street
            if (zoomLevel > 6) { newWidth = 5; }
            else if (zoomLevel > 4) { newWidth = 4; }
            else { newWidth = 3; }
         } else if (typeRoad === 8) {  // Unpaved
            if (zoomLevel > 4) { newWidth = 4; }
            else if (zoomLevel > 3) { newWidth = 3; }
            else { newWidth = 2; }
         } else {  // should have matched
            if (debug) {
               newWidth = 20; // make it stand out so it's caught!
            }
         }

         if (!fwdDir || !revDir) {  // Only one highlight, centered on road
            newWidth = 2 * newWidth;
         }

         if (missingSL_Obj.useHighlight !== 'undefined') {
            newColor = missingSL_Obj.useHighlight;
         } else {
            newColor = defaultHighlight;
         }

         if (unverified || (!fwdDir && !revDir)) {
            newDashes = 'dash';
            newLinecap = 'butt';
         }

         return {
            strokeColor: newColor,
            strokeOpacity: newOpacity,
            strokeWidth: newWidth,
            strokeDashstyle: newDashes,
            strokeLinecap: newLinecap
         };
      }  // end highlightStyle()

      function shiftGeometry(shiftDist, line, driveLeft) {
         var j, point1, point2, vector, prevVector, nextVector, newPoints = [];

         function getOrthoVector(pnt1, pnt2) {
            return [pnt1.y - pnt2.y, pnt2.x - pnt1.x];
         }

         function normalizeVector(vect) {
            var len;

            if (vect[0] * vect[0] + vect[1] * vect[1] === 0) { return vect; }
            len = Math.sqrt(vect[0] * vect[0] + vect[1] * vect[1]);
            return [vect[0] / len, vect[1] / len];
         }

         if (!driveLeft) { shiftDist = -shiftDist; }

         for (j=0; j<line.length; j+=1) {  // compute orthogonal vectors:
            prevVector = [0,0];
            nextVector = [0,0];

            if (j > 0) {  // compute prev
               point1 = line[j-1];
               point2 = line[j];
               prevVector = getOrthoVector(point1, point2);
               prevVector = normalizeVector(prevVector);
            }

            if (j < line.length-1) {  // compute next
               point1 = line[j];
               point2 = line[j+1];
               nextVector = getOrthoVector(point1, point2);
               nextVector = normalizeVector(nextVector);
            }

            // sum vectors and normalize
            vector = [prevVector[0] + nextVector[0], prevVector[1] + nextVector[1]];
            vector = normalizeVector(vector);
            newPoints.push(new openLayers_window.Geometry.Point(line[j].x + vector[0] * shiftDist, line[j].y + vector[1] * shiftDist));
         }
         return newPoints;
      }

      try {
         openLayers_vectors.destroyFeatures();
      } catch(err1) {
         log('highlightRoads', 'warn', 'openLayers_vectors.destroyFeatures NOK: ' + err1);
      }

      missingSL_Obj.visibility = openLayers_vectors.visibility;
      if (!missingSL_Obj.visibility) { return; }  // what does this do???

      mapResolution = Waze_map.getResolution();
      hideHighlights = getId('optHideHlt').checked;
      seeNoDirect = getId('optNoDirection').checked;
      highlightUnverified = getId('optHltUnver').checked;

      if (zoom !== Waze_map.zoom) { zoom = Waze_map.zoom; }

      for (seg in Waze_model.segments.objects) {  // JSLint says 'Object.keys' expected, but 'for in' found
         segment = Waze_model.segments.get(seg);
         attributes = segment.attributes;
         roadType = attributes.roadType;
         fwdSpeed = attributes.fwdMaxSpeed;  // km/h value, null if not set
         revSpeed = attributes.revMaxSpeed;  // km/h value, null if not set
         fwdSpeedUnverified = attributes.fwdMaxSpeedUnverified;  // true/false
         revSpeedUnverified = attributes.revMaxSpeedUnverified;  // true/false
         fwdDir = attributes.fwdDirection;  // true if A->B allowed
         revDir = attributes.revDirection;  // true if B->A allowed
         isSelected = (segment.selected === true);  // true if currently selected
         isModified = (segment.state === 'Update');  // true if modified

         geometry = segment.geometry;

         // Checks to see if segment should NOT be highlighted
         if (!((hideHighlights) ||  // highlights hidden
              (geometry === null) ||  // not a valid element
              (isSelected || isModified) ||  // don't highlight segments currently selected or modified
              (!fwdDir && !revDir && !seeNoDirect) ||  // direction Unknown, but visibility not selected
              (validRoads.indexOf(roadType) === -1) ||  // not a road to check
              (!missingSL_Obj.typeOfRoad[roadType].checked) ||  // road type not selected
              (zoom < missingSL_Obj.typeOfRoad[roadType].zoom) ||  // current zoom below setting
              (seeNoDirect && !missingSL_Obj.showDirectionless) ||  // direction Unknown and visibility not selected
              (fwdDir && revDir && (fwdSpeed !== null) && (revSpeed !== null) &&
               (!highlightUnverified || (!fwdSpeedUnverified &&
                !revSpeedUnverified))) ||  // both speeds already set, or unverified and visibility not selected
              (((fwdDir && !revDir && (fwdSpeed !== null)) || (revDir && !fwdDir &&
               (revSpeed !== null))) && (highlightUnverified ||
               (!fwdSpeedUnverified && !revSpeedUnverified))))) {  // speed set for only direction, or unverified and visibility not selected
            // set highlighting depending on allowable direction(s)
            if (fwdDir && revDir) {  // Two-way segment
               style = highlightStyle(roadType, zoom, fwdSpeedUnverified);
               shiftValue = Math.floor(style.strokeWidth / 2) * mapResolution;
               points = revDir ? shiftGeometry(shiftValue, geometry.getVertices(), Waze_model.countries.top.leftHandTraffic) : geometry.getVertices();
               newLine = new openLayers_window.Geometry.LineString(points);
               lineFeature.push(new openLayers_window.Feature.Vector(newLine, null, style));

               style = highlightStyle(roadType, zoom, revSpeedUnverified);
               points = fwdDir ? shiftGeometry(shiftValue, geometry.getVertices(), !Waze_model.countries.top.leftHandTraffic) : geometry.getVertices();
               newLine = new openLayers_window.Geometry.LineString(points);
               lineFeature.push(new openLayers_window.Feature.Vector(newLine, null, style));
            } else if (fwdDir) {  // A->B only segment
               style = highlightStyle(roadType, zoom, fwdSpeedUnverified);
               shiftValue = Math.floor(style.strokeWidth / 2) * mapResolution;
               points = revDir ? shiftGeometry(shiftValue, geometry.getVertices(), Waze_model.countries.top.leftHandTraffic) : geometry.getVertices();
               newLine = new openLayers_window.Geometry.LineString(points);
               lineFeature.push(new openLayers_window.Feature.Vector(newLine, null, style));
            } else if (revDir) {  // B->A only segment
               style = highlightStyle(roadType, zoom, revSpeedUnverified);
               shiftValue = Math.floor(style.strokeWidth / 2) * mapResolution;
               points = fwdDir ? shiftGeometry(shiftValue, geometry.getVertices(), !Waze_model.countries.top.leftHandTraffic) : geometry.getVertices();
               newLine = new openLayers_window.Geometry.LineString(points);
               lineFeature.push(new openLayers_window.Feature.Vector(newLine, null, style));
            } else {  // Unknown direction segment
               style = highlightStyle(roadType, zoom, false);
               shiftValue = Math.floor(style.strokeWidth / 2) * mapResolution;
               points = fwdDir ? shiftGeometry(shiftValue, geometry.getVertices(), !Waze_model.countries.top.leftHandTraffic) : geometry.getVertices();
               newLine = new openLayers_window.Geometry.LineString(points);
               lineFeature.push(new openLayers_window.Feature.Vector(newLine, null, style));
            }
         }
      }

      // Display new array of segments
      try {
         openLayers_vectors.addFeatures(lineFeature);
      } catch(err2) {
         log('highlightRoads', 'warn', 'openLayers_vectors.addFeatures: ' + err2);
      }
   }

   function defineCss() {
      log('defineCss', 'info', 'starting');
      var css, cssStyle = document.createElement('style');

      cssStyle.type = 'text/css';
      css = '.missingSLcontent {width:250px; margin-left:20px; box-shadow: 0 4px 10px #aaaaaa;}';
      css += '.divHeader {height:24px; font-weight:bold; padding-top:2px; border:2px solid #3d3d3d; background-color:#bedce5;}';
      css += '.divContent {clear:both; line-height:21px; height:24px; border:1px solid #3d3d3d; border-top:0;}';
      css += '.divContent label {color: #59899e; font-weight: bold !important; text-align: left; margin-left: 5px;}';
      css += '.divContent input {margin-right: 5px; transform: translateY(1px);}';
      css += '.div_L {float:left; text-align:center;}';
      css += '.div_R {float:right; text-align:center;}';
      css += '.centerText {color:#59899e; font-weight:bold; text-align:center;}';
      css += '.divcolor {width:100px; height:17px; margin:3px 0 0 5px;}';
      css += '.zoomfont {color:#59899e; font-weight:bold;}';
      css += '#editHighlight {display:none;}';
      css += '#editZoom {display:none;}';
      css += '#zoomEntry {width:35px; height:22px;}';
      cssStyle.innerHTML = css;
      document.body.appendChild(cssStyle);
   }

   function createHTML() {
      log('createHTML', 'info', 'starting');
      var i, content, newtab = document.createElement('li');
      var addon = document.createElement('section');

      function saveOptions() {
         log('saveOptions', 'info', 'starting');
         localStorage.setItem('missingSL_Obj', JSON.stringify(missingSL_Obj));
      }

      //Create content in Missing SL's tab
      newtab.innerHTML = "<a href='#sidepanel-missingSL' data-toggle='tab'><span class='fa fa-low-vision' title='"+ missingSL_name +"'></span></a>";  // from fontawesome.io: fa-dashboard [originally], try fa-low-vision, fa-question-circle-o, fa-road
      browserTab.appendChild(newtab);

      // program title & version header
      content = "<div style='float:left; margin-left:5px;'><b><a href='https://greasyfork.org/en/scripts/23210-wme-missing-sl' target='_blank'><u>"+ missingSL_name +"</u></a></b>"+ missingSL_ver +"</div>";

      // Highlight-color-selection section
      content += "<div style='clear:both; padding-top:10px;'></div>";
      content += "<div class='missingSLcontent' >";

         // section header
         content += "<div class='divHeader'>";
            content += "<div class='div_L' style='width:240px; line-height:20px;'>"+ Titles[1] +"</div>";
         content += "</div>";

         // populate highlight row & color selections
         content += "<div class='divContent' id='editHighlight'>";
            content += "<div class='div_R' style='width:20px;'><a href='#'><img id='cancelHighlight' style='width:20px;' title='"+ Titles[4] +"' src='data:image/png;base64,"+ cancel_icon +"' /></a></div>";
            content += "<div class='div_R' style='width:20px;'><a href='#'><img id='submitHighlight' style='width:20px;' title='"+ Titles[3] +"' src='data:image/png;base64,"+ confirm_icon +"' /></a></div>";
            content += "<div class='div_R' style='width:150px; text-align:left;'>";
               content += "<select id='colorChoices' style='height:22px; width:120px;'>";
                  for (i=0; i<hltOptions.length; i+=1) {
                     content += "<option value="+ hltOptions[i] +" style='background-color:"+ hltOptions[i] +"'>&nbsp;</option>";
                  }
               content += "</select>";
            content += "</div>";
         content += "</div>";
         content += "<div id='hltTable'></div>";
      content += "</div><br>";

      // Type of roads to check section
      content += "<div style='clear:both; padding-top:10px;'></div>";
      content += "<div class='missingSLcontent'>";

         // section header
         content += "<div class='divHeader'>";
            content += "<div class='div_L' style='width:150px;'>"+ Titles[9] +"</div>";
            content += "<div class='div_R' style='width:60px; margin-right:20px;'>"+ Titles[8] +"</div>";
         content += "</div>";

         // populate edit zoom row
         content += "<div class='divContent' id='editZoom'>";
            content += "<div class='div_L centerText' style='width:110px;'><span id='textentry'></span></div>";
            content += "<div class='div_R' style='width:20px;'><a href='#'><img id='cancelZoom' style='width:20px;' title='"+ Titles[4] +"' src='data:image/png;base64,"+ cancel_icon +"' /></a></div>";
            content += "<div class='div_R' style='width:20px;'><a href='#'><img id='submitZoom' style='width:20px;' title='"+ Titles[2] +"' src='data:image/png;base64,"+ confirm_icon +"' /></a></div>";
            content += "<div class='div_R centerText' style='width:60px;'><input type='text' value='' id='zoomEntry' class='centerText' /></div>";
         content += '</div>';
         content += "<div id='roadTypeTable'></div>";  // road types later added to this section
      content += "</div><br>";

      // Unverified speeds section
      content += "<div class='missingSLcontent'>";

         // section header
         content += "<div class='divHeader'>";
            content += "<div class='div_L' style='width:120px;'>"+ Titles[0] +"</div>";
         content += "</div>";

         content += "<div class='divContent'><label title='"+ Titles[10] +"'><input id='optHltUnver' type='checkbox'/>"+ Titles[11] +"</label></div>";
         content += "<div class='divContent'><label title='"+ Titles[14] +"'><input id='optNoDirection' type='checkbox'/>"+ Titles[15] +"</label></div>";
         content += "<div class='divContent'><label title='"+ Titles[12] +"'><input id='optHideHlt' type='checkbox'/>"+ Titles[13] +"</label></div>";
      content += "</div>";

      addon.innerHTML = content;  // add content to addon tab panel
      addon.id = 'sidepanel-missingSL';
      addon.className = 'tab-pane';
      browserTabContent.appendChild(addon);  // add addon to HTML code

      if (!missingSL_Obj.hasOwnProperty('highlightUnverified')) {
         missingSL_Obj.highlightUnverified = true;
      }
      getId('optHltUnver').checked = (missingSL_Obj.highlightUnverified === true);
      getId('optHltUnver').onclick = function () {
         missingSL_Obj.highlightUnverified = (getId('optHltUnver').checked === true);
         highlightRoads();
      };

      if (!missingSL_Obj.hasOwnProperty('optNoDirection')) {
         missingSL_Obj.showDirectionless = false;
      }
      getId('optNoDirection').checked = (missingSL_Obj.showDirectionless === true);
      getId('optNoDirection').onclick = function () {
         missingSL_Obj.showDirectionless = (getId('optNoDirection').checked === true);
         highlightRoads();
      };

      if (!missingSL_Obj.hasOwnProperty('hideHighlights')) {
         missingSL_Obj.hideHighlights = false;
      }
      getId('optHideHlt').checked = (missingSL_Obj.hideHighlights === true);
      getId('optHideHlt').onclick = function () {
         missingSL_Obj.hideHighlights = (getId('optHideHlt').checked === true);
         highlightRoads();
      };

function test1() {
   log('save', 'debug', 'triggered');
}
      Waze_map.baseLayer.events.register('loadend', null, highlightRoads);  // after initial map load & zoom changes
      Waze_map.baseLayer.events.register('moveend', null, highlightRoads);  // after map move
      Waze_map.baseLayer.events.register('visibilitychanged', null, test1);  // need something after save
//      Waze_map.baseLayer.on('loadend': highlightRoads);  // after initial map load & zoom changes
//      Waze_map.baseLayer.on('moveend': highlightRoads);  // after map move
//      Waze_map.baseLayer.on('???': highlightRoads);  // after changes saved

      window.addEventListener('beforeunload', saveOptions);  // save current selections when page closes
   }

   function updateTab() {
      log('updateTab', 'info', 'starting');
      var i, color = missingSL_Obj.useHighlight;
      var div = document.createElement('div');  // new row
         div.className = 'divContent';
      var divdata = document.createElement('div');  // new row
         divdata.className = 'div_R';
         divdata.style.width = '20px';
      var divdatalink = document.createElement('a');  // new hyperlink
      var type, divcheck, divcolor, divzoom, newHighlight;

      function roadCheck(idx) {
         missingSL_Obj.typeOfRoad[idx].checked = getId('roadCheck_'+idx).checked;
         highlightRoads();
      }

      function selectHighlight(color) {
         getId('editHighlight').style.display = 'block';  // show color selection row
         getId('colorChoices').value = color;
         getId('colorChoices').style.backgroundColor = color;
      }

      function editZoom(idx, oldVal) {
         var newZoomVal;

         getId('editZoom').style.display = 'block';  // show zoom edit row
         getId('zoomEntry').value = oldVal;
         getId('textentry').textContent = missingSL_Obj.typeOfRoad[idx].name;

         getId('cancelZoom').onclick = function () {
            getId('editZoom').style.display = 'none';  // hide zoom edit row
            getId('hltTable').innerHTML = '';  // clear highlight to rebuild
            getId('roadTypeTable').innerHTML = '';  // clear roads to rebuild
            updateTab();
         };

         getId('submitZoom').onclick = function () {
            newZoomVal = getId('zoomEntry').value;
            newZoomVal = Math.max(0,Math.min(9,Math.round(newZoomVal)));
            if (newZoomVal >= 0 && newZoomVal <= 9) {
               getId('zoomEntry').value = newZoomVal; // in case entry changed
               missingSL_Obj.typeOfRoad[idx].zoom = newZoomVal;
            }
            getId('editZoom').style.display = 'none';  // hide zoom edit row
            getId('hltTable').innerHTML = '';  // clear highlight to rebuild
            getId('roadTypeTable').innerHTML = '';  // clear roads to rebuild
            updateTab();
            highlightRoads();
         };
      }

      function selectRoadZoom() {
         var zoomVal, index, listEditZoom = getId('roadTypeTable');
         var editZoomIcons = getElementsByClassName('modifyZoom', listEditZoom);

         for (i=0; i<editZoomIcons.length; i+=1) {
            index = editZoomIcons[i].id.split('_')[1];
            zoomVal = missingSL_Obj.typeOfRoad[parseInt(index)].zoom;
            editZoomIcons[i].onclick = getFunctionWithArgs(editZoom, [index, zoomVal]);
         }
      }

      // row showing current highlight color
      divdatalink.innerHTML = "<img style='width:16px;' title='"+ Titles[5] +"' src='data:image/png;base64,"+ edit_icon +"' />";
      divdatalink.href = '#';
      divdatalink.onclick = getFunctionWithArgs(selectHighlight, [color]);
      divdata.appendChild(divdatalink);
      div.appendChild(divdata);

      divcolor = document.createElement('div');  // new row
      divcolor.className = 'div_R';
      divcolor.style.width = '164px';
      divcolor.innerHTML = "<div class='divcolor' style='background-color:"+ color +";'>&nbsp;</div>";
      div.appendChild(divcolor);
      getId('hltTable').appendChild(div);  // add current highlight-color row

      // build row for each road type
      for (i=0; i<validRoads.length; i+=1) {
         type = validRoads[i];
         div = document.createElement('div');  // new row
         div.className = 'divContent';

         divcheck = document.createElement('label');
         divcheck.innerHTML = "<input type='checkbox' id='roadCheck_"+ type +"'>"+ missingSL_Obj.typeOfRoad[type].name;
         divcheck.onclick = getFunctionWithArgs(roadCheck, [type]);
         div.appendChild(divcheck);

         divdata = document.createElement('div');  // new row
         divdata.className = 'div_R';
         divdata.style.width = '20px';
         divdatalink = document.createElement('a');  // new hyperlink
         divdatalink.innerHTML = "<img style='width:16px;' title='"+ Titles[6] +"' src='data:image/png;base64,"+ edit_icon +"' />";
         divdatalink.href = '#';
         divdatalink.className = 'modifyZoom';
         divdatalink.id = 'roadType_'+ type;
         divdata.appendChild(divdatalink);
         div.appendChild(divdata);

         divzoom = document.createElement('div');  // new row
         divzoom.className = 'div_R zoomfont';
         divzoom.style.width = '60px';
         divzoom.innerHTML = missingSL_Obj.typeOfRoad[type].zoom;
         div.appendChild(divzoom);
         getId('roadTypeTable').appendChild(div);
         getId('roadCheck_'+type).checked = missingSL_Obj.typeOfRoad[type].checked;
      }

      getId('colorChoices').onchange = function () {
         getId('colorChoices').style.backgroundColor = getId('colorChoices').value;
      };

      getId('cancelHighlight').onclick = function () {
         getId('editHighlight').style.display = 'none';  // hide selection row
         getId('colorChoices').style.backgroundColor = '#ffffff';
         getId('hltTable').innerHTML = '';  // clear highlight to rebuild
         getId('roadTypeTable').innerHTML = '';  // clear roads to rebuild
         updateTab();
      };

      getId('submitHighlight').onclick = function () {
         newHighlight = getId('colorChoices').value;
         if (newHighlight) { missingSL_Obj.useHighlight = newHighlight; }
         getId('editHighlight').style.display = 'none';  // hide selection row
         getId('colorChoices').style.backgroundColor = '#ffffff';
         getId('hltTable').innerHTML = '';  // clear highlight to rebuild
         getId('roadTypeTable').innerHTML = '';  // clear roads to rebuild
         updateTab();
         highlightRoads();
      };

      selectRoadZoom();
   }

   // Waze object needed
   if (unsafeWindow.Waze === 'undefined') {
      log('missingSL_init', 'error', 'unsafeWindow.Waze NOK');
      window.setTimeout(missingSL_init, 500);
      return;
   }
   Waze_window = unsafeWindow.Waze;

   if (Waze_window.map === 'undefined') {
      log('missingSL_init', 'error', 'Waze_map.map NOK');
      window.setTimeout(missingSL_init, 500);
      return;
   }
   Waze_map = Waze_window.map;

   if (Waze_window.model === 'undefined') {
      log('missingSL_init', 'error', 'Waze_window.model NOK');
      window.setTimeout(missingSL_init, 500);
      return;
   }
   Waze_model = Waze_window.model;

   if ( (Waze_model.countries === 'undefined') ||
        (Waze_model.countries.top === 'undefined') ) {
      if (Waze_model.countries === 'undefined') {
         log('missingSL_init', 'error', 'Waze_model.countries NOK');
      }
      if (Waze_model.countries.top === 'undefined') {
         log('missingSL_init', 'error', 'Waze_model.countries.top NOK');
      }
      window.setTimeout(missingSL_init, 500);
      return;
   }

   // OpenLayers
   if (unsafeWindow.OpenLayers === 'undefined') {
      log('missingSL_init', 'error', 'unsafeWindow.OpenLayers NOK');
      window.setTimeout(missingSL_init, 500);
      return;
   }
   openLayers_window = unsafeWindow.OpenLayers;

   // Waze GUI needed
   if (getId('user-info') === 'undefined') {
      log('missingSL_init', 'error', 'browserHandle NOK');
      window.setTimeout(missingSL_init, 500);
      return;
   }
   browserHandle = getId('user-info');

   if (getElementsByClassName('nav-tabs', browserHandle)[0] === 'undefined') {
      log('missingSL_init', 'error', 'browserTab NOK');
      window.setTimeout(missingSL_init, 500);
      return;
   }
   browserTab = getElementsByClassName('nav-tabs', browserHandle)[0];

   if (getElementsByClassName('tab-content', browserHandle)[0] === 'undefined') {
      log('missingSL_init', 'error', 'browserTabContent NOK');
      window.setTimeout(missingSL_init, 500);
      return;
   }
   browserTabContent = getElementsByClassName('tab-content', browserHandle)[0];

   // Verify localStorage. Init if empty or not correct
   if ( (localStorage.missingSL_Obj !== 'undefined') &&
         isJSONstring(localStorage.getItem('missingSL_Obj')) ) {  // use previously selected options
      missingSL_Obj = JSON.parse(localStorage.missingSL_Obj);
      log('missingSL_init', 'debug', 'localStorage.missingSL_Obj loaded');

      if (missingSL_Obj.typeOfRoad === 'undefined') {
         missingSL_Obj.typeOfRoad = typeOfRoad;
         log('missingSL_init', 'debug', 'missingSL_Obj.typeOfRoad undefined');
      }

// what about useHighlight & highlightVisibility as below???

   } else {  // no previously selected options - load defaults
      log('missingSL_init', 'debug', 'localStorage.missingSL_Obj undefined');

      if (missingSL_Obj.typeOfRoad === 'undefined') {
         missingSL_Obj.typeOfRoad = typeOfRoad;
         log('missingSL_init', 'debug', 'missingSL_Obj.typeOfRoad undefined');
      }

      if ( (localStorage.useHighlight !== 'undefined') &&
            isJSONstring(localStorage.getItem('useHighlight')) ) {
         missingSL_Obj.useHighlight = localStorage.useHighlight;
         localStorage.removeItem('useHighlight');
         log('missingSL_init', 'debug', 'localStorage.useHighlight loaded');
      }

      if ( (localStorage.highlightVisibility !== 'undefined') &&
            isJSONstring(localStorage.getItem('highlightVisibility')) ) {
         missingSL_Obj.visibility = JSON.parse(localStorage.highlightVisibility);
         localStorage.removeItem('highlightVisibility');
         log('missingSL_init', 'debug', 'localStorage.highlightVisibility loaded');
      }
      localStorage.setItem('missingSL_Obj', JSON.stringify(missingSL_Obj));
   }

   // WME Layers check
   layers = Waze_map.getLayersBy('uniqueName','__WME_Missing_SL');
   if (layers.length === 0) {
      log('missingSL_init', 'info', 'initializing layer');
      openLayers_style = new openLayers_window.Style( {
         pointRadius: 2,
         fontWeight: 'normal',
         label: '${labelText}',
         fontFamily: 'Tahoma, Courier New',
         labelOutlineColor: '#ffffff',
         labelOutlineWidth: 2,
         fontColor: '#000000',
         fontSize: '10px'
      });

      openLayers_vectors = new openLayers_window.Layer.Vector('Missing SL', {
         displayInLayerSwitcher: true,
         uniqueName: '__WME_Missing_SL',
         styleMap: new openLayers_window.StyleMap(openLayers_style)
      });

      Waze_map.addLayer(openLayers_vectors);
      openLayers_vectors.setVisibility(missingSL_Obj.visibility);
   }

log('missingSL_init', 'info', 'calling defineCss');
   defineCss();
log('missingSL_init', 'info', 'calling createHTML');
   createHTML();
log('missingSL_init', 'info', 'calling updateTab');
   updateTab();
log('missingSL_init', 'info', 'calling highlightRoads');
   highlightRoads();
}

function missingSL_bootstrap() {
   'use strict';
   var dummyElem, bGreasemonkeyServiceDefined = false;

   try {
      if (typeof Components.interfaces.gmIGreasemonkeyService === 'object') {
         bGreasemonkeyServiceDefined = true;
      }
   } catch(ignore) {
      //Ignore
   }
   if ( (unsafeWindow === 'undefined') || !bGreasemonkeyServiceDefined) {
      unsafeWindow = ( function () {
         dummyElem = document.createElement('p');
         dummyElem.setAttribute ('onclick', 'return window;');
         return dummyElem.onclick ();
      } ());
   }
   // begin running the code!
   missingSL_init();
}

window.setTimeout(missingSL_bootstrap, 5000);  // 5 second pause hack
//missingSL_bootstrap();