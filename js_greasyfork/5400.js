// ==UserScript==
// @name                WME Roundabout Angles
// @namespace           http://userscripts.org/scripts/show/440831
// @description         Draws angles for typical roundabout and overlays helper line to adjust geometry of roundabout.
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             1.06
// @grant               none
// @copyright           2014 wlodek76
// @copyright           2014,2016 FZ69617
// @downloadURL https://update.greasyfork.org/scripts/5400/WME%20Roundabout%20Angles.user.js
// @updateURL https://update.greasyfork.org/scripts/5400/WME%20Roundabout%20Angles.meta.js
// ==/UserScript==

/*
 * Version history:
 *
 * 1.06 (20160405)
 * - New: Roundabount Angles layer enablement persisted in local storege.
 * - New: Added yellow color marker for uncertain angles.
 * - Change: Roundabount center taken from junction model geomentry if available.
 * - Change: Logic slightly modified in order to better support various roundabount types.
 * - Other: Minor code refactoring and cleanup.
 *
 * 1.05 (20141002)
 * - New: Added support for roundabouts with 1 or 2 nodes.
 * - Improvement: Simplified roundabout markers starts displaying at zoom level 1.
 * - Improvement: Minimal required zoom level to compute roundabout angles changed to 5 (was 6).
 * - Improvement: Light blue marker circle is now displayed only with roundabouts for which the script
 * can measure angles. The other roundabouts (with more than 4 nodes) are displayed a bit darker.
 * - Optimization: Significantly improved script execution performance.
 *
 * 1.04.1 (20141001)
 * - Fix: Adapted to WME v1.6-297 by FZ69617.
 */

var wmech_version = "1.06"

//---------------------------------------------------------------------------------------
function bootstrapRoundaboutAngles()
{
  var bGreasemonkeyServiceDefined = false;

  try {
    bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
  }
  catch (err) { /* Ignore */ }

  if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
      var dummyElem = document.createElement('p');
      dummyElem.setAttribute('onclick', 'return window;');
      return dummyElem.onclick();
    }) ();
  }

    /* begin running the code! */
    setInterval(DrawRoundaboutAngles, 500);
//     setInterval( function() {
//             console.time('DrawRoundaboutAngles');
//             DrawRoundaboutAngles();
//             console.timeEnd('DrawRoundaboutAngles');
//         }, 500 );

  console.log("WME Roundabout Angles " + wmech_version + " started.");
}
//---------------------------------------------------------------------------------------
function DrawRoundaboutAngles()
{
    if (Waze == null || Waze.map == null || Waze.model == null || OpenLayers == null) return;

    //---------get or create layer
    var layers = Waze.map.getLayersBy("uniqueName","__DrawRoundaboutAngles");
    var drc_layer;
    
    if(layers.length > 0) {
        drc_layer = layers[0];
    } else {

         var drc_style = new OpenLayers.Style({
                fillOpacity: 0.0,
                strokeOpacity: 1.0,
                fillColor: "#FF40C0",
                strokeColor: "${strokeColor}",


                strokeWidth: 10,
                fontWeight: "bold",
                pointRadius: 0,
                label : "${labelText}",
                fontFamily: "Tahoma, Courier New",
                labelOutlineColor: "#FFFFFF",
                labelOutlineWidth: 3,
                fontColor: "${labelColor}",
                fontSize: "10px"
        });

        drc_layer = new OpenLayers.Layer.Vector("Roundabout Angles", {
            displayInLayerSwitcher: true,
            uniqueName: "__DrawRoundaboutAngles",
            styleMap: new OpenLayers.StyleMap(drc_style)
        });
        
        I18n.translations.en.layers.name["__DrawRoundaboutAngles"] = "Roundabout Angles";
        Waze.map.addLayer(drc_layer);
        
        drc_layer.setVisibility(localStorage.WMERAEnabled == "true");
    }
            
    localStorage.WMERAEnabled = drc_layer.visibility;

    if (drc_layer.visibility == false) {
        drc_layer.removeAllFeatures();
        return;
    }

    if (Waze.map.zoom < 1) {
        drc_layer.removeAllFeatures();
        return;
    }


    //---------collect all roundabouts first
    var rsegments = {};


    for (var iseg in Waze.model.segments.objects) {
        var isegment = Waze.model.segments.get(iseg);
        var iattributes = isegment.attributes;
        var iline = isegment.geometry.id;

        var irid = iattributes.junctionID;
        
        if (iline !== null && irid != undefined) {
            var rsegs = rsegments[irid];
            if (rsegs == undefined) {
                rsegments[irid] = rsegs = new Array();
            }
            rsegs.push(isegment);
        }
    }


//     var rcount = 0, scount = 0;
//     for (var irid in rsegments) {
//         var rsegs = rsegments[irid];
//         scount += rsegs.length;
//         ++rcount;
//     }
//     console.log("Roundabouts found: " + rcount + ", segments: " + scount);


    var drc_features = [];

    //-------for each roundabout do...
    for (var irid in rsegments) {
        var rsegs = rsegments[irid];

        var isegment = rsegs[0];
        var jsegment;

        var nodes = new Array();
        var nodes_x = new Array();
        var nodes_y = new Array();

        for (var j = 0; j < rsegs.length; ++j) {
            jsegment = rsegs[j];
            var jattributes = jsegment.attributes;

            if (nodes.indexOf(jattributes.fromNodeID) == -1) {
                nodes.push(jattributes.fromNodeID);
            }
            if (nodes.indexOf(jattributes.toNodeID) == -1) {
                nodes.push(jattributes.toNodeID);
            }
        }

        var node_objects = Waze.model.nodes.getByIds(nodes);
        for (var i=0; i < node_objects.length; ++i) {
            var node = node_objects[i];

            nodes_x.push(node.geometry.x);
            nodes_y.push(node.geometry.y);
        }


        var sr_x   = 0;
        var sr_y   = 0;
        var radius = 0;
        var numNodes = nodes_x.length;


        if (numNodes >= 1) {

            //-----------throw short segments
            /* while (nodes_x.length > 4) {
                var id = 0;
                var dmin = 99999999;
                for(var i=0; i<nodes_x.length; i++) {
                    for(var j=0; j<nodes_x.length; j++) {
                        if (i == j) continue;

                        var x1 = nodes_x[i];
                        var y1 = nodes_y[i];
                        var x2 = nodes_x[j];
                        var y2 = nodes_y[j];

                        var dx = x1 - x2;
                        var dy = y1 - y2;
                        var d = dx*dx + dy*dy;
                        if (d < dmin) { dmin = d; id = i; }
                    }
                }

                nodes_x.splice(id, 1);
                nodes_y.splice(id, 1);
            } */


            var ax = nodes_x[0];
            var ay = nodes_y[0];

            var junction = Waze.model.junctions.get(irid);
            var junction_coords = junction && junction.geometry && junction.geometry.coordinates;
            
            if (junction_coords && junction_coords.length == 2) {
                //---------- get center point from junction model
                var lonlat = new OpenLayers.LonLat(junction_coords[0], junction_coords[1]);
                lonlat.transform(Waze.map.displayProjection, Waze.map.projection);
                var pt = lonlat.toPoint();
                sr_x = pt.x;
                sr_y = pt.y;
            }
            else if (numNodes >= 3) {
                //-----------simple approximation of centre point calculated from three first points
                var bx = nodes_x[1];
                var by = nodes_y[1];
                var cx = nodes_x[2];
                var cy = nodes_y[2];

                var x1 = (bx + ax) * 0.5;


                var y11 = (by + ay) * 0.5;
                var dy1 = bx - ax;
                var dx1 = -(by - ay);
                var x2 = (cx + bx) * 0.5;
                var y2 = (cy + by) * 0.5;
                var dy2 = cx - bx;
                var dx2 = -(cy - by);
                sr_x = (y11 * dx1 * dx2 + x2 * dx1 * dy2 - x1 * dy1 * dx2 - y2 * dx1 * dx2)/ (dx1 * dy2 - dy1 * dx2);
                sr_y = (sr_x - x1) * dy1 / dx1 + y11;
            }
            else {
                //---------- simple bounds-based calculation of center point
                var rbounds = new OpenLayers.Bounds();
                rbounds.extend(isegment.geometry.bounds);
                rbounds.extend(jsegment.geometry.bounds);

                var center = rbounds.getCenterPixel();
                sr_x = center.x;
                sr_y = center.y;
            }

            var angles = [];
            var rr = -1;
            var r_ix;

            for(var i=0; i<nodes_x.length; i++) {

                var dx = nodes_x[i] - sr_x;
                var dy = nodes_y[i] - sr_y;

                var rr2 = dx*dx + dy*dy;
                if (rr < rr2) {
                    rr = rr2;
                    r_ix = i;
                }

                var angle = Math.atan2(dy, dx);
                angle = (360.0 + (angle * 180.0 / Math.PI));
                if (angle < 0.0) angle += 360.0;
                if (angle > 360.0) angle -= 360.0;
                angles.push(angle);
            }

            radius = Math.sqrt(rr);


            //---------sorting angles for calulating angle difference between two segments
            angles = angles.sort(function(a,b) { return a - b; });
            angles.push( angles[0] + 360.0);
            angles = angles.sort(function(a,b) { return a - b; });
            //console.log(angles);


            var drc_color = (numNodes <= 4) ? "#0040FF" : "#002080";


            var drc_point = new OpenLayers.Geometry.Point(sr_x, sr_y );
            var drc_circle = new OpenLayers.Geometry.Polygon.createRegularPolygon( drc_point, radius, 10 * Waze.map.zoom );
            var drc_feature = new OpenLayers.Feature.Vector(drc_circle, {labelText: "", labelColor: "#000000", strokeColor: drc_color, }  );
            drc_features.push(drc_feature);


            if (numNodes >= 2 && numNodes <= 4 && Waze.map.zoom >= 5) {


               for(var i=0; i<nodes_x.length; i++) {
                    var ix = nodes_x[i];
                    var iy = nodes_y[i];
                    var startPt   = new OpenLayers.Geometry.Point( sr_x, sr_y );
                    var endPt     = new OpenLayers.Geometry.Point( ix, iy );
                    var line      = new OpenLayers.Geometry.LineString([startPt, endPt]);
                    var style     = {strokeColor:drc_color, strokeWidth:2};
                    var fea       = new OpenLayers.Feature.Vector(line, {}, style);
                    drc_features.push(fea);
               }

               var angles_int = [];
               var angles_float = [];
               var angles_sum = 0;

               for(var i=0; i<angles.length - 1; i++) {

                   var ang = angles[i+1] - angles[i+0];
                   if (ang < 0) ang += 360.0;
                   if (ang < 0) ang += 360.0;

                   if (ang < 135.0) {
                      ang = ang - 90.0;
                   }
                   else {
                      ang = ang - 180.0;
                   }

                   angles_sum += parseInt(ang);

                   angles_float.push( ang );
                   angles_int.push( parseInt(ang) );
               }

               if (angles_sum > 45) angles_sum -= 90;
               if (angles_sum > 45) angles_sum -= 90;
               if (angles_sum > 45) angles_sum -= 90;
               if (angles_sum > 45) angles_sum -= 90;
               if (angles_sum < -45) angles_sum += 90;
               if (angles_sum < -45) angles_sum += 90;
               if (angles_sum < -45) angles_sum += 90;
               if (angles_sum < -45) angles_sum += 90;

               if (angles_sum != 0) {
                   for(var i=0; i<angles_int.length; i++) {
                       var a = angles_int[i];
                       var af = angles_float[i] - angles_int[i];
                       if ( (a < 10 || a > 20) && (af < -0.5 || af > 0.5) )  {
                           angles_int[i] += -angles_sum;

                           break;
                       }
                   }
               }

               if (numNodes == 2) {
                   angles_int[1] = -angles_int[0];
                   angles_float[1] = -angles_float[0];
               }


               for(var i=0; i<angles.length - 1; i++) {

                   var arad = (angles[i+0] + angles[i+1]) * 0.5 * Math.PI / 180.0;
                   var ex = sr_x + Math.cos (arad) * radius * 0.5;
                   var ey = sr_y + Math.sin (arad) * radius * 0.5;

                   var angint = angles_int[i];

                   var kolor = "#004000";
                   if (angint <= -15 || angint >= 15) kolor = "#FF0000";
                   else if (angint <= -13 || angint >= 13) kolor = "#FFC000";

                   var pt = new OpenLayers.Geometry.Point(ex, ey);
                   drc_features.push(new OpenLayers.Feature.Vector( pt, {labelText: (angint + "°"), labelColor: kolor } ));
                   //drc_features.push(new OpenLayers.Feature.Vector( pt, {labelText: (+angles_float[i].toFixed(2) + "°"), labelColor: kolor } ));
               }
            }
            else {

               for(var i=0; i < nodes_x.length; i++) {

                    var ix = nodes_x[i];
                    var iy = nodes_y[i];
                    var startPt   = new OpenLayers.Geometry.Point( sr_x, sr_y );
                    var endPt     = new OpenLayers.Geometry.Point( ix, iy );
                    var line      = new OpenLayers.Geometry.LineString([startPt, endPt]);
                    var style     = {strokeColor:drc_color, strokeWidth:2};
                    var fea       = new OpenLayers.Feature.Vector(line, {}, style);
                    drc_features.push(fea);
               }               
            }

            var p1   = new OpenLayers.Geometry.Point( nodes_x[r_ix], nodes_y[r_ix] );
            var p2   = new OpenLayers.Geometry.Point( sr_x, sr_y );
            var line = new OpenLayers.Geometry.LineString([p1, p2]);
            var geo_radius = line.getGeodesicLength(Waze.map.projection);

            var diam = geo_radius * 2.0;
            var pt = new OpenLayers.Geometry.Point(sr_x, sr_y);
            drc_features.push(new OpenLayers.Feature.Vector( pt, {labelText: (diam.toFixed(0) + "m"), labelColor: "#000000" } ));

        }

    }
        
    drc_layer.removeAllFeatures();
    drc_layer.addFeatures(drc_features);
}
//---------------------------------------------------------------------------------------
bootstrapRoundaboutAngles();