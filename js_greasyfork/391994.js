// ==UserScript==
// @name         Normal RA detect
// @namespace    https://www.waze.com/user/editor/B4ckTrace
// @version      0.2
// @description  Detects (Non)Normal roundabouts
// @author       B4ckTrace
// @include      https://www.waze.com/*/editor*
// @include      https://www.waze.com/editor*
// @include      https://beta.waze.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391994/Normal%20RA%20detect.user.js
// @updateURL https://update.greasyfork.org/scripts/391994/Normal%20RA%20detect.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var wmeNRA_Layer;
	
	function bootstrap(tries) {
        tries = tries || 1;

        if (W &&
			W.map &&
            W.model &&
			W.loginManager.user &&
            $ 
			) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        console.log("*** Normal RA detector initialized ***");
		
		W.selectionManager.events.register("selectionchanged", null, draw_line);
		// Action on zoom end
		W.map.events.register("zoomend", null, draw_line);
		
		// Create layer
		wmeNRA_Layer = new OL.Layer.Vector("wmeNRA_Layer", {uniqueName: "__wmeNRA_Layer"});
        W.map.addLayer(wmeNRA_Layer);
	}
	
	function draw_line()
	{
		if (wmeNRA_Layer) {
			wmeNRA_Layer.removeAllFeatures();
			W.map.removeLayer(wmeNRA_Layer);
			wmeNRA_Layer = null;
		}
		// Create layer
		wmeNRA_Layer = new OL.Layer.Vector("wmeNRA_Layer", {uniqueName: "__wmeNRA_Layer"});
        W.map.addLayer(wmeNRA_Layer);
			
		var SelectedItem = Waze.selectionManager.getSelectedFeatures();		
		if (SelectedItem.length == 1) // Check only one segment is selected
		{
			if (SelectedItem[0].model.type == 'segment')
			{				
				var fromNodeSegments = W.model.nodes.objects[SelectedItem[0].model.attributes.fromNodeID].attributes.segIDs;
				var toNodeSegments = W.model.nodes.objects[SelectedItem[0].model.attributes.toNodeID].attributes.segIDs;				
				
				var blReverse = false;
				var RA_id = null;
				for (var index = 0; index < fromNodeSegments.length; index++)
				{
					var Segment = W.model.segments.getObjectById(fromNodeSegments[index]);
					var roundabout  = Segment.attributes.junctionID !== null;
					if (roundabout)
					{
						RA_id = Segment.attributes.junctionID;
						blReverse = true;
						break;
					}
				}
				if (RA_id === null)
				{
					for (var index = 0; index < toNodeSegments.length; index++)
					{
						var Segment = W.model.segments.getObjectById(toNodeSegments[index]);
						var roundabout  = Segment.attributes.junctionID !== null;
						if (roundabout)
						{
							RA_id = Segment.attributes.junctionID;
							break;
						}
					}
				}
				
				var junction = W.model.junctions.getObjectById(RA_id);
				var junction_coords = junction && junction.geometry && junction.geometry.coordinates;
				var sr_x = 0;
				var sr_y = 0;
				if (junction_coords && junction_coords.length == 2) {
                    //---------- get center point from junction model
                    let lonlat = new OL.LonLat(junction_coords[0], junction_coords[1]);
                    lonlat.transform(W.map.displayProjection, W.map.projection);
                    let pt = new OL.Geometry.Point(lonlat.lon, lonlat.lat);
                    sr_x = pt.x;
                    sr_y = pt.y;
                }
				debugger;
				
				var points=[];
				var gline = SelectedItem[0].model.attributes.geometry.getVertices();
				if (blReverse)
				{
					gline.reverse();
				}
				
                for (var i=0; i<gline.length; i++)
				{
					points.push(new OL.Geometry.Point(gline[i].x, gline[i].y));
				}
				
				var ex_x = points[points.length-1].x;
				var ex_y = points[points.length-1].y;
				
				var before_ex_x = points[points.length-2].x;
				var before_ex_y = points[points.length-2].y;
				
				var angle = Math.atan2(sr_y - ex_y, sr_x - ex_x)
				
				var dist = 500;
				var Last_x = ex_x + dist * Math.cos(angle);
				var Last_y = ex_y + dist * Math.sin(angle);								
				
				points.push(new OL.Geometry.Point(Last_x, Last_y));
				
				var main_points = [];
				main_points.push(new OL.Geometry.Point(ex_x, ex_y));
				main_points.push(new OL.Geometry.Point(Last_x, Last_y));
				var main_line = new OL.Geometry.LineString(main_points);
				var main_lineFeature = new OL.Feature.Vector(main_line);
				main_lineFeature.style = {
					strokeWidth: 3,
					strokeColor: '#180cc7',
					strokeLinecap: 'round',
					strokeDashstyle: 'dash'
				};
				
				// --------------------------------------------
				var perpendicular_points = [];
				var centrePointX = sr_x;
				var centrePointY = sr_y;
				var perpendicular_x = (Math.sin(angle) * dist + centrePointX);
				var perpendicular_y = (-Math.cos(angle) * dist + centrePointY);
				perpendicular_points.push(new OL.Geometry.Point(perpendicular_x, perpendicular_y));
				
				var perpendicular_x = (-Math.sin(angle) * dist + centrePointX);
				var perpendicular_y = (Math.cos(angle) * dist + centrePointY);
				perpendicular_points.push(new OL.Geometry.Point(perpendicular_x, perpendicular_y));
				
				var perpendicular_line = new OL.Geometry.LineString(perpendicular_points);
				var perpendicular_lineFeature = new OL.Feature.Vector(perpendicular_line);
				perpendicular_lineFeature.style = {
					strokeWidth: 3,
					strokeColor: '#5c21d1',
					strokeLinecap: 'round',
					strokeDashstyle: 'dash'
				};
				// --------------------------------------------
				
				
				
				
				
				// ---------------------------------------------------------------Borrowed from http://jsfiddle.net/92jWG/6/
				var coord_first_points = [];
				var coord_first_x = before_ex_x + dist * Math.cos(angle-toRadians(15));
				var coord_first_y = before_ex_y + dist * Math.sin(angle-toRadians(15));
								
				coord_first_points.push(new OL.Geometry.Point(centrePointX, centrePointY));
				coord_first_points.push(new OL.Geometry.Point(coord_first_x, coord_first_y));
				var coord_first_line = new OL.Geometry.LineString(coord_first_points);
				var coord_first_lineFeature = new OL.Feature.Vector(coord_first_line);
				coord_first_lineFeature.style = {
					strokeWidth: 2,
					strokeColor: '#EDEDED',
					strokeLinecap: 'round',
					strokeDashstyle: 'solid'
				};
				// --------------------------------------------
				
				
				// --------------------------------------------
				var coord_second_points = [];
				var coord_second_x = before_ex_x + dist * Math.cos(angle+toRadians(15));
				var coord_second_y = before_ex_y + dist * Math.sin(angle+toRadians(15));
								
				coord_second_points.push(new OL.Geometry.Point(centrePointX, centrePointY));
				coord_second_points.push(new OL.Geometry.Point(coord_second_x, coord_second_y));
				var coord_second_line = new OL.Geometry.LineString(coord_second_points);
				var coord_second_lineFeature = new OL.Feature.Vector(coord_second_line);
				coord_second_lineFeature.style = {
					strokeWidth: 2,
					strokeColor: '#EDEDED',
					strokeLinecap: 'round',
					strokeDashstyle: 'solid'
				};
				// ---------------------------------------------------------------
				
				wmeNRA_Layer.addFeatures([coord_first_lineFeature, main_lineFeature, coord_second_lineFeature, perpendicular_lineFeature]);
				
			}
			// if () // Check if one side of segment is connected to a RA and the other side is not
			// {
				
			// }
		}			
	}
	
	function toRadians (angle) {
		return angle * (Math.PI / 180);
	}
	function toDegrees (angle) {
		return angle * (180 / Math.PI);
	}

	
	bootstrap();
})();