// ==UserScript==
// @name          Planets.nu - Edge Outline Plugin
// @description   Plugin for Planets.nu which outlines the edges of Stellar Cartography objects
// @namespace     Planets.nu
// @version       0.1
// @grant         none
// @date          2017-05-29
// @author        aral, with lots of help from nareen, based on plugin template by meteor
// @include       http://planets.nu/home
// @include       http://planets.nu/games/*
// @include       http://planets.nu/*
// @include       http://play.planets.nu/*
// @include       http://test.planets.nu/*
// @include       http://*.planets.nu/*
// @downloadURL https://update.greasyfork.org/scripts/30104/Planetsnu%20-%20Edge%20Outline%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/30104/Planetsnu%20-%20Edge%20Outline%20Plugin.meta.js
// ==/UserScript==

function wrapper(plugin_version)
{
    if (vgap.version < 3.0)
    {
        console.log("Edge Outline plugin requires at least NU version 3.0. Plugin disabled.");
        return;
    }

    console.log("Edge Outline version: v" + plugin_version);

    var edgeOutlinePlugin =
        {
            version : plugin_version,
            enabled : false,
            mustCallEarlyDrawNebulas : false,
            mustCallEarlyDrawIonStorms : false,
            notetype : -20170529, // TO DO

            processload : function()
            {
                var plugin = vgap.plugins["edgeOutlinePlugin"];

                plugin.enabled = plugin.getObjectFromNote(1, plugin.notetype);
                if (plugin.enabled == null)
                {
                    plugin.enabled = false;
                }
            },

            loadmap : function()
            {
                var plugin = vgap.plugins["edgeOutlinePlugin"];

                $("<li class='ShowMinerals' id='edgeOutline'>Edge Outline</li>").toggleClass("selectedmaptool", plugin.enabled).tclick(function()
                {
                    plugin.enabled = !plugin.enabled;
                    plugin.saveObjectAsNote(1, plugin.notetype, plugin.enabled);

                    $("#edgeOutline").toggleClass("selectedmaptool", plugin.enabled);

                    vgap.map.draw();
                }).appendTo("#MapTools");
            },

            /* function: paintLotsOfCircles
             * arguments:
             *   circles = vgap.nebulas or vgap.ionstorms (array of circles objects with properties .x,.y & .radius)
             *   style   = color style to use for circle borders
             *
             * purpose:  this function determines all intersections / overlaps among the circles in the array
             *             and paints only the outer silhouette of the resulting shape (omitting all overlapping parts)
             * return value: NONE
            */
            paintLotsOfCircles : function( circles, style ) {

                var allOverlaps = new Array( circles.length );   // this array will store for each circle an array of arc sections that overlap with other circles
                // the logic in allOverlaps is:
                //     allOverlaps[ circleIndex ] [ sectionIndex ] [ 0 ] = arcMiddleAngle
                //     allOverlaps[ circleIndex ] [ sectionIndex ] [ 1 ] = arcVariance
                // where the middle angle is the "center of gravity" of the arc section, allowing a strict sorting logic for arc sections in mathematical sequence
                // and the variance is the "radius" of the arc section, in radians - so the arc spans from [middle angle MINUS variance] to [middle angle PLUS variance]

                // initialize arrays for storing all overlaps per circle
                for (var i = 0; i < circles.length; i++)
                    allOverlaps[i] = [];


        /* **** FIND ALL INTERSECTIONS ***** */
                // * outer loop over all circles i
                // * inner loop over all following circles j in the array 
                // * check for intersection & store "invisible" arc for BOTH circles in "allOverlaps"
                // * because of the "forward" storing of found "invisible" arcs, the circles at a lower
                //     index than i do not need to be checked

                for (var i = 0; i < circles.length; i++) {   // outer loop over all circles

                    for (var j = i+1; j < circles.length; j++) {   // inner loop over circles which follow circle i in the array

                        var x1 = circles[i].x, y1 = circles[i].y, r1 = circles[i].radius;   // easier variable access
                        var x2 = circles[j].x, y2 = circles[j].y, r2 = circles[j].radius;   // dito

                        var distance = Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) ); // calculate distance between circle centers

                        if ( distance < r1 + r2 ) {   // found an overlap - determine range

                            if( distance <= Math.abs( r1 - r2) ) {   // special case: one circle fully contained within the other
                                if( r1 > r2 ) {   // if circle i is the larger circle (circle j is fully contained)
                                   allOverlaps[j].push( [ Math.PI, Math.PI ] );   // store an overlap of range +/- 180 degrees for circle j
                                   continue; // proceed to compare this circle i with next circle j
                                }
                                else {          // if circle i is fully contained within circle j
                                   allOverlaps[i].push( [ Math.PI, Math.PI ] );   // store an overlap of range +/- 180 degrees for circle i
                                   break;   // stop processing this circle (because it is fully invisible)
                                }
                            }
                            else {   // partial overlap, need to calculate the actual intersections

                                // Heron's formula:
                                var s = (r1 + r2 + distance)/2;   // semi-perimeter of the triangle r1, r2, distance
                                var height = ( 2 / distance ) * Math.sqrt( s * (s-r1) * (s-r2) * (s-distance) );   // height of that triangle with distance as the base side (= c)

                                // arc variance (+/- this angle)
                                var variance1 = Math.asin( height / r1 );   // in the triangle of Heron's formula, r1 is opposite the angle under which circle i "sees" the intersection
                                var variance2 = Math.asin( height / r2 );   // accordingly for circle j

                                // definition: the critical distance is when the smaller radius "points" at 90 degrees (PI/2) towards the intersection point
                                var criticalDistance = Math.sqrt( Math.abs( Math.pow( r1, 2 ) - Math.pow( r2, 2) )  );
                                // if the circles are closer than that, for the smaller circle, more than 180 degree (PI) are covered (overlapped) by the bigger circle
                                // the variance angle of the smaller circle is then between PI/2 and PI (needs to be inverted)

                                if( distance < criticalDistance ) {   // the smaller circle is overlapped by more than PI
                                    if ( r1 < r2 )   // determine smaller circle
                                        variance1 = Math.PI - variance1;   // invert variance angle (180 deg. minus original value) of circle i
                                    else
                                        variance2 = Math.PI - variance2;   // invert variance angle of circle j
                                }

                                // STATUS of computation: two known overlap variance angles variance1 and variance2
                                // unknown as of yet: the middle angles of the overlapping sections in the original coordinate system

                                // calculate angle of the connection between circle centers to origin of the coordinate system
                                var M_x = x2 - x1;
                                var M_y = y2 - y1;
                                var intersection_angle1 = Math.atan( M_y / M_x );   // determine "raw" angle between connection of circle centers and coordinate system

                                if( M_x < 0 ) intersection_angle1 += Math.PI;   // transform angle into quadrant 2 or 3 if x distance is negative
                                if( intersection_angle1 < 0 ) intersection_angle1 += 2*Math.PI; // normalize negative angles into [0;2*PI[

                                allOverlaps[i].push( [ intersection_angle1, variance1 ] );   // store an overlap for circle i at intersection_angle1 of range variance1

                                var intersection_angle2 = intersection_angle1 + Math.PI;   // determine angle as seen from circle 2
                                if( intersection_angle2 >= 2*Math.PI ) intersection_angle2 -= 2*Math.PI;   // normalize angle into interval [0;2*PI[

                                allOverlaps[j].push( [ intersection_angle2, variance2 ] );   // store an overlap for circle j at intersection_angle2 of range variance2
                            }
                        } // end of if-clause computing overlap
                       
                    } // end of inner loop
                } // end of outer loop
        /* **** END OF BLOCK: FIND ALL INTERSECTIONS ***** */


                // fix JavaScript modulo bug
                // ==> determine JavaScript module, then add base number (to transform negative values
                //       into positive range) and apply JavaScript modulo a second time
                Number.prototype.mod = function(n) {
                    return ( (this % n) + n ) % n;
                }

                // custom sort function to compare arcs that have as first element the arc's middle angle (0 <= middle angle < 2*Math.PI)
                var sortArcs = function( a, b ) {
                    if( a[0] < b[0] ) return -1;
                    if( a[0] > b[0] ) return 1;
                    if( a[0] == b[0] ) return 0;
                }

               
                // merge overlapping invisible arc sections
                for( var i = 0; i < circles.length; i++ ) {   // for each circle

                    allOverlaps[i].sort( sortArcs );   // sort overlap arcs for each circle in order of ascending middle angle

                    const UP = 1, DOWN = -1;   // constants to express merge direction: UP = try merging next section with mathematical POSITIVE rotation
                                               //                                     DOWN = try merging next section with mathematical NEGATIVE rotation
                    var sectionIndex = 1; // skip first section because it will be compared with all other sections anyways

                    // loop through all invisible sections (= overlaps) in the current circle
                    while( (allOverlaps[i].length > 1) && (sectionIndex < allOverlaps[i].length) ) {  // stop looping if only 1 section left (or it will test overlap with itself)
                        var success = true;   // entry condition for merge-loop
                        var direction = UP;   // first direction to look for a section merge

                        // if a merge succeeded or the down direction has not been tried yet
                        while ( (allOverlaps[i].length > 1) && (success || direction == UP) ) { // stop merging when only 1 section left (see above)
                            if( !success ) direction = DOWN;   // if no UP merge happened, try merging DOWN

                            var nextSectionIndex = (sectionIndex + direction).mod( allOverlaps[i].length );   // determine the next invisible section to check for a merge

                            var alpha = allOverlaps[i][sectionIndex][0];
                            var variance_alpha = allOverlaps[i][sectionIndex][1];
                            var beta = allOverlaps[i][nextSectionIndex][0];
                            var variance_beta = allOverlaps[i][nextSectionIndex][1];

                            var distance = beta - alpha;   // determine the "distance" between the invisible sections j and k
                            if( distance < 0 ) distance += 2*Math.PI;   // if beta < alpha then determine the positive distance

                            // swap sections if they are closer in the other direction
                            if( distance > Math.PI ) {   // if the distance is more than a half circle, then check overlap in the other direction (swap sections)
                               distance = 2*Math.PI - distance; // "reverse distance"
                               var temp_angle = alpha; alpha = beta; beta = temp_angle; // swap( alpha, beta )
                               var temp_variance = variance_alpha; variance_alpha = variance_beta; variance_beta = temp_variance; // swap( variance_alpha, variance_beta )
                            }

                            // test overlap
                            if( distance <= variance_alpha + variance_beta ) {   // if the sections overlap
                               var relative_begin = Math.min( - variance_alpha, distance - variance_beta );   // determine first angle at which a section starts relative to alpha
                               var relative_end   = Math.max( + variance_alpha, distance + variance_beta );   // determine last angle at which a section ends relative to alpha

                               allOverlaps[i][sectionIndex][0] = ( alpha + (relative_begin + relative_end)/2 ).mod( 2 * Math.PI );   // determine new section middle (absolute)
                               var new_variance = (relative_end - relative_begin)/2;   // determine new section variance
                               if( new_variance < Math.PI )  // if section is not a full circle
                                  allOverlaps[i][sectionIndex][1] = new_variance; // store the new variance
                               else
                                  allOverlaps[i][sectionIndex][1] = Math.PI; // maximum variance: circle is invisible

                               allOverlaps[i].splice( nextSectionIndex, 1 );   // remove element nextSectionIndex
                               if( sectionIndex > nextSectionIndex )   // if the array position of the current section was modified
                                   sectionIndex -= 1;                        // then set sectionIndex to the new position of the current (merged) section
                               success = true;
                            }
                            else success = false;

                            if( success && direction == DOWN ) direction = UP;    // if a DOWN merge was successful, try merging UP again
                        }

                        sectionIndex++;
                    }


             // PAINT CIRCLES
                    if(allOverlaps[i].length == 0) {   // if this circle has no invisible sections
                       allOverlaps[i].push( [0,0] );         // "cheat" the paint routine that follows by creating two half circles
                       allOverlaps[i].push( [Math.PI,0] );   // with zero-length invisible sections
                    }

                    // all sections that overlap with other circles are now merged ==> there must be a visible arc between each two invisible sections!
                    // paint all visible sections
                    if( allOverlaps[i][0][1] < Math.PI ) { // don't paint anything for invisible circles (upon correct merge, the first and only invis section has variance PI)
                        for (sectionIndex = 0; sectionIndex < allOverlaps[i].length; sectionIndex++) {
                           
                            var x = circles[i].x, y = circles[i].y, radius = circles[i].radius;   // easier variable access

                            if( vgap.map.isVisible( x, y, radius ) ) {
                                var ctx = vgap.map.ctx;

                                var previousSectionIndex = (sectionIndex - 1).mod( allOverlaps[i].length ); // get index of previous section

                                var arcBegin = allOverlaps[i][ previousSectionIndex ][0] + allOverlaps[i][ previousSectionIndex ][1];   // determine absolute arc begin
                                var arcEnd = allOverlaps[i][ sectionIndex ][0] - allOverlaps[i][ sectionIndex ][1];   // determine absolute arc end

                                arcBegin = Math.PI * 2 - arcBegin; // transform angle to fix bug in arc function angular logic (counterclockwise to clockwise)
                                arcEnd = Math.PI * 2 - arcEnd;     // transform angle to fix bug in arc function angular logic (counterclockwise to clockwise)

                                ctx.beginPath();
                                ctx.arc(vgap.map.screenX(x), vgap.map.screenY(y), radius * vgap.map.zoom, arcBegin, arcEnd, true);
                                ctx.strokeStyle = style;
                                ctx.lineWidth = 1;
                                ctx.stroke();
                            }
                        }
                    }
                }
            },

            earlyDrawNebulas : function()
            {
                var plugin = vgap.plugins["edgeOutlinePlugin"];
                if (plugin.enabled)
                    plugin.paintLotsOfCircles( vgap.nebulas, "#669999" );
            },

            earlyDrawIonStorms : function()
            {
                var plugin = vgap.plugins["edgeOutlinePlugin"];
                if (plugin.enabled)
                    plugin.paintLotsOfCircles( vgap.ionstorms, vgap.accountsettings.ionstorms );

            },

            draw : function()
            {
                var plugin = vgap.plugins["edgeOutlinePlugin"];
                var map = vgap.map;
                var ctx = map.ctx;

                if (plugin.enabled)
                {
                    // debris disks
                    for (var i = 0; i < vgap.debrisdisks.length; i++)
                    {
                        var planet = vgap.debrisdisks[i];

                        if (map.isVisible(planet.x, planet.y, planet.debrisdisk))
                        {
                            ctx.strokeStyle = "white";
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(map.screenX(planet.x), map.screenY(planet.y), planet.debrisdisk * vgap.map.zoom, 0, Math.PI * 2, false);
                            ctx.closePath();
                            ctx.stroke();
                        }
                    }

                    // star clusters
                    for (var i = 0; i < vgap.stars.length; i++)
                    {
                        var star = vgap.stars[i];

                        if (map.isVisible(star.x, star.y, Math.sqrt(star.mass)))
                        {
                            ctx.strokeStyle = "white";
                            ctx.lineWidth = 1;

                            ctx.beginPath();
                            ctx.arc(map.screenX(star.x), map.screenY(star.y), star.radius * vgap.map.zoom, 0, Math.PI * 2, false);
                            ctx.closePath();
                            ctx.stroke();

                            ctx.beginPath();
                            ctx.arc(map.screenX(star.x), map.screenY(star.y), (star.radius + 10) * vgap.map.zoom, 0, Math.PI * 2, false);
                            ctx.closePath();
                            ctx.stroke();

                            ctx.beginPath();
                            ctx.arc(map.screenX(star.x), map.screenY(star.y), Math.sqrt(star.mass) * vgap.map.zoom, 0, Math.PI * 2, false);
                            ctx.closePath();
                            ctx.stroke();
                        }
                    }
                }
            },

            loaddashboard : function()
            {
            },

            showdashboard : function()
            {
            },

            showsummary : function()
            {
            },

            showmap : function()
            {
            },

            loadplanet : function()
            {
            },

            loadstarbase : function()
            {
            },

            loadship : function()
            {
            },

            saveObjectAsNote : function(id, type, obj)
            {
                var note = vgap.getNote(id, type);
                if (note == null)
                {
                    note = vgap.addNote(id, type);
                }

                note.changed = 1;
                note.body = JSON.stringify(obj);
                vgap.save();
            },

            getObjectFromNote : function(id, type)
            {
                var note = vgap.getNote(id, type);
                if (note != null && note.body != "")
                {
                    return JSON.parse(note.body);
                }
                else
                {
                    return null;
                }
            }
        };

    vgap.registerPlugin(edgeOutlinePlugin, "edgeOutlinePlugin");

    var oldVgapMapDraw = vgapMap.prototype.draw;
    vgapMap.prototype.draw = function(fast, ctx, skipUserContent, secondCanvas)
    {
        if (vgap.map.drawing)
            return;

        var plugin = vgap.plugins["edgeOutlinePlugin"];

        plugin.mustCallEarlyDrawNebulas = true;
        plugin.mustCallEarlyDrawIonStorms = true;

        oldVgapMapDraw.apply(this, arguments);

        plugin.mustCallEarlyDrawNebulas = false;        // aral: is this needed?
        plugin.mustCallEarlyDrawIonStorms = false;      // aral: is this needed?
    }

    var oldVgapMapDrawNebula = vgapMap.prototype.drawNebula;
    vgapMap.prototype.drawNebula = function(x, y, neb, ctx)
    {
        var plugin = vgap.plugins["edgeOutlinePlugin"];

        if (plugin.mustCallEarlyDrawNebulas)
        {
            plugin.earlyDrawNebulas();
            plugin.mustCallEarlyDrawNebulas = false;
        }

        oldVgapMapDrawNebula.apply(this, arguments);
    }

/*
    var oldVgapMapDrawMinefield = vgapMap.prototype.drawMinefield;
    vgapMap.prototype.drawMinefield = function(x, y, color, rad, ctx, isweb)
    {
        var plugin = vgap.plugins["edgeOutlinePlugin"];

        if (plugin.mustCallEarlyDrawIonStorms)
        {
            plugin.earlyDrawIonStorms();                         // aral: TBC why this was implemented - is the function possibly deprecated now?
            plugin.mustCallEarlyDrawIonStorms = false;           // aral: TBC why this was implemented - is the function possibly deprecated now?
        }

        oldVgapMapDrawMinefield.apply(this, arguments);
    }
*/

    var oldVgapMapDrawIon = vgapMap.prototype.drawIon;
    vgapMap.prototype.drawIon = function(x, y, voltage, rad, ctx, storm)
    {
        var plugin = vgap.plugins["edgeOutlinePlugin"];

        if (plugin.mustCallEarlyDrawIonStorms)
        {
            plugin.earlyDrawIonStorms();
            plugin.mustCallEarlyDrawIonStorms = false;
        }

        oldVgapMapDrawIon.apply(this, arguments);
    }
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")(\"" + GM_info.script.version + "\");";
document.body.appendChild(script);
document.body.removeChild(script);
