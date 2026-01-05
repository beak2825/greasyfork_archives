// ==UserScript==
// @name         WME Util Singleton
// @namespace    http://tampermonkey.net/
// @version      0.203
// @description  Utility singleton for Waze map editor scripts
// @author       slemmon
// @match        https://www.waze.com/editor/*
// @match        https://editor-beta.waze.com/editor/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

/**
 *  =============================================
 *  USER INFORMATION
 *  =============================================
 *
 * This is a util class to be @required by other scripts.  Consider the API a bit fluid at
 * this stage as this class is new and not very fleshed out.  Documentation for each class
 * method / property will appear just before the method / property.
 * 
 * The Ext JS framework is loaded and once loaded the W.ux.Util singleton is
 * created.  Next we fire a jQuery event of "extready" into the document body
 * so that any scripts waiting on Ext JS and the W.ux.Util singleton know they 
 * may proceed.
 * 
 * Scripts using W.ux.Util should add the following to listen for the 'extready'
 * event:
 *     $(document.body).on('extready', function () {
 *         // script logic - may still need to check for dom ready and / or
 *         // the OpenLayers map's existence here before proceeding
 *     });
 */
$.getScript('https://cdnjs.cloudflare.com/ajax/libs/extjs/6.0.0/ext-all.js', function () {
    
    Ext.define('W.ux.Util', {
        /**
         * Adds CSS style rule(s) to the page
         * @param {String/String[]/String...} rule An array of CSS style rule strings or
         * any number of CSS style rule params
         */
        injectStyleRules(rule) {
            var styleTag = this.styleTag,
                args = Array.prototype.slice.call(arguments),
                div;
            
            // allows you to pass in an array, string, or n number of string params
            rule = args.length === 1 ? args.shift() : args;
            
            // if the style tag is found cached then create at the end of the <body>
            // and cache a reference to it
            if (!styleTag) {
                div = $("<div />", {
                    html: '&shy;<style></style>'
                }).appendTo("body");
                
                // cache a ref to the style tag
                styleTag = this.styleTag = div.find('style');
            }
            
            // append to the style tag the style rule / rules passed
            styleTag.append(Ext.Array.from(rule).join(''));
        },
        
        /**
         * Returns the Waze editor map or false if the map is not found
         * @return {Object/Boolean} The map instance used by Waze or false if not found
         */
        getMap: function () {
            return (W && W.map) ? W.map : false;
        },
        
        /**
         * Simple util to return an array of [a, b] type endpoint sub-arrays given a complete
         * array of points (vertices) from a ring polygon geometry.  For example, if you passed:
         * [x, y, z] in what would be returned is [[x, y], [y, z], [z, x]].
         * @param {Array} points Array of all points in the ring polygon geometry
         * @return {Array} An array of endpoint arrays from the passed points
         */
        getEndpoints: function (points) {
            var endpoints = [],
                len = points.length,
                pointB;
            
            points.forEach(function (point, i) {
                var pointB = (points[i + 1]) ? points[i + 1] : points[0];
                endpoints.push([points[i], pointB]);
            });
            
            return endpoints;
        },
        
        // http://jsfiddle.net/justin_c_rounds/Gd2S2/
        /**
         * Finds the points where two lines intersect.  That could be intersections where
         * the lines would literally overlap or could be where the extension of a line would
         * logically overlap.
         * @param {Number} line1StartX The starting x coordinate of line 1
         * @param {Number} line1StartY The starting y coordinate of line 1
         * @param {Number} line1EndX The ending x coordinate of line 1
         * @param {Number} line1EndY The ending y coordinate of line 1
         * @param {Number} line2StartX The starting x coordinate of line 2
         * @param {Number} line2StartY The starting y coordinate of line 2
         * @param {Number} line2EndX The ending x coordinate of line 2
         * @param {Number} line2EndY The ending y coordinate of line 2
         * @return {Object} Returns an object with the following key / value info
         * 
         *     - x {Number} the x coordinate of the intersection or null if there is no intersection
         *     - y {Number} the y coordinate of the intersection or null if there is no intersection
         *     - onLine1 {Boolean} true if the intersection falls on line 1 otherwise false
         *     - onLine2 {Boolean} true if the intersection falls on line 2 otherwise false
         */
        findIntersectionPoint: function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
            // if the lines intersect, the result contains the x and y of the intersection
            // (treating the lines as infinite) and booleans for whether line segment 1 
            // or line segment 2 contain the point
            var denominator, a, b, numerator1, numerator2, result = {
                x: null,
                y: null,
                onLine1: false,
                onLine2: false
            };
            
            // we'll assume two arrays of two points were passed so we'll split them out
            if (Ext.isArray(line1StartX)) {
                line2EndY = line1StartY[1].y;
                line2EndX = line1StartY[1].x;
                line2StartY = line1StartY[0].y;
                line2StartX = line1StartY[0].x;
                
                line1EndY = line1StartX[1].y;
                line1EndX = line1StartX[1].x;
                line1StartY = line1StartX[0].y;
                line1StartX = line1StartX[0].x;
            }

            denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
            if (denominator == 0) {
                return result;
            }
            a = line1StartY - line2StartY;
            b = line1StartX - line2StartX;
            numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
            numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
            a = numerator1 / denominator;
            b = numerator2 / denominator;

            // if we cast these lines infinitely in both directions, they intersect here:
            result.x = line1StartX + (a * (line1EndX - line1StartX));
            result.y = line1StartY + (a * (line1EndY - line1StartY));
            /*
            // it is worth noting that this should be the same as:
            x = line2StartX + (b * (line2EndX - line2StartX));
            y = line2StartX + (b * (line2EndY - line2StartY));
            */
            // if line1 is a segment and line2 is infinite, they intersect if:
            if (a > 0 && a < 1) {
                result.onLine1 = true;
            }
            // if line2 is a segment and line1 is infinite, they intersect if:
            if (b > 0 && b < 1) {
                result.onLine2 = true;
            }
            // if line1 and line2 are segments, they intersect if both of the above are true
            return result;
        },
        
        /**
         * Returns the first two intersecting features from a layer
         * @param {Object} layer The layer from which to find intersecting features
         * @return {Array} An array containing the first two intersecting features
         * found or an empty array if no intersection features were found
         */
        getIntersection: function (layer) {
            if (!layer) {
                return false;
            }
            
            var features = layer.features,
                len = features.length,
                intersected = [],
                i = 0,
                j, feature, featureGeo, candidate, candidateGeo, intersects;
            
            for (; i < len; i++) {
                feature = features[i];
                featureGeo = feature.geometry;
                j = 0;
                for (; j < len; j++) {
                    candidate = features[j];
                    candidateGeo = candidate.geometry;
                    intersects = featureGeo.intersects(candidateGeo);
                    
                    if (intersects && (featureGeo !== candidateGeo)) {
                        intersected = [feature, candidate];
                        break;
                    }
                }
                if (intersected.length) {
                    break;
                }
            }
            
            return intersected;
        },
        
        /**
         * Get a new polygon feature from an array of points
         * @param {Array} points The array of OpenLayers.Geometry.Points used to make the polygon feature
         * @param {Object} [attribs] Optional object to be mapped to the attributes property of the feature
         * @param {Object} [style] Optional style object
         * @return {Object} The polygon feature generaeted from the provided points
         */
        getPolyFromPoints: function (points, attribs, style) {
            var ring = new OpenLayers.Geometry.LinearRing(points),
                polygon = new OpenLayers.Geometry.Polygon([ring]), 
                feature = new OpenLayers.Feature.Vector(polygon, attribs, style);

            return feature;
        },
        
        /**
         * @private
         * Internal method used by the getMergedPolygon method
         */
        applyIntersectionPoints: function (pointsArrA, pointsArrB, altPoly, segmentsArrA, segmentsArrB, copyPoints) {
            var me = this,
                intersect, junction;
            
            pointsArrA.forEach(function (first, i) {
                first.isInternal = altPoly.containsPoint(first);
                delete first.isJunction;
                var junctions = [];
                pointsArrB.forEach(function (second, j) {
                    intersect = me.findIntersectionPoint(segmentsArrA[i], segmentsArrB[j]);
                    if (intersect.onLine1 && intersect.onLine2) {
                        junction = new OpenLayers.Geometry.Point(intersect.x, intersect.y);
                        junction.isJunction = true;
                        junctions.unshift(junction);
                    }
                });
                junctions.sort(function (a, b) {
                    var aDist = first.distanceTo(a),
                        bDist = first.distanceTo(b);

                    return aDist > bDist ? -1 : ((bDist > aDist) ? 1 : 0);
                });
                junctions.forEach(function (item) {
                    copyPoints.splice(copyPoints.indexOf(pointsArrA[i]) + 1, 0, item);
                });
            });
        },
        
        /**
         * Return a single polygon feature from the outline of two intersecting
         * polygons
         * @param {Object/Object[]} polyA The first polygon or feataure owning the polygon
         * to be merged.  May also be an array of both constituent polygons in which case
         * the second param if passed will be ignored
         * @param {Object} polyB The second polygon or feature owning the polygon to
         * be merged
         * return {Object} The merged polygon vector feature
         */
        getMergedPolygon: function (polyA, polyB) {
            if (Ext.isArray(polyA)) {
                polyB = polyA[1];
                polyA = polyA[0];
            }
            
            // set polyA and B to be the polygon geometries if the parent vector feature was passed in
            polyA = polyA.CLASS_NAME === "OpenLayers.Feature.Vector" ? polyA.geometry : polyA;
            polyB = polyB.CLASS_NAME === "OpenLayers.Feature.Vector" ? polyB.geometry : polyB;
            
            var me = this,
                pointsA = polyA.getVertices(),
                pointsB = polyB.getVertices(),
                copyPointsA = pointsA.slice(),
                copyPointsB = pointsB.slice(),
                segmentsA = me.getEndpoints(pointsA),
                segmentsB = me.getEndpoints(pointsB),
                initialX = Infinity,
                initial, activePoints, hostPoly, activePoint, union, altPoints,
                activeIndex, next, nextAltIndex, i, altNext, altA, altB,
                centroidA, candidateAIntersects, centroidB, candidateBIntersects,
                mids, mid;
            
            // Set OpenLayers.geometry.Points in the points / vertices array where the two
            // polygons intersect
            me.applyIntersectionPoints(pointsA, pointsB, polyB, segmentsA, segmentsB, copyPointsA);
            me.applyIntersectionPoints(pointsB, pointsA, polyA, segmentsB, segmentsA, copyPointsB);

            // function to find the starting point for when we walk through the polygon to get
            // its outline.  The initial point will be the one that's furthest left
            (function () {
                var evalPoints = function (points) {
                    points.forEach(function (point) {
                        if (point.x < initialX) {
                            initialX = point.x;
                            initial = point;
                            activePoints = points;
                            hostPoly = (activePoints === copyPointsA) ? polyA : polyB;
                        }
                    });
                };

                evalPoints(copyPointsA);
                evalPoints(copyPointsB);
            })();

            // the union array will hold the points of the new polygon perimeter
            union = [initial];
            altPoints = (activePoints === copyPointsA) ? copyPointsB : copyPointsA;
            while (activePoint !== initial) {
                activePoint = activePoint || initial;

                // find the current pointer and the next point from it
                activeIndex = activePoints.indexOf(activePoint);
                next = activePoints[activeIndex + 1] || activePoints[0];
                
                // if the next point is not a junction add it to the union array
                if (!next.isJunction) {
                    if (next !== initial) {
                        union.push(next);
                    }
                    activePoint = next;
                } else { // the point is a junction / intersect point
                    union.push(next); // add it to the union array
                    nextAltIndex;
                    // find the next perimeter junction
                    for (i = 0; i < altPoints.length; i++) {
                        if (altPoints[i].x === next.x && altPoints[i].y === next.y) {
                            nextAltIndex = i;
                            break;
                        }
                    }

                    // using the next junction find the point ahead and behind it
                    altNext = altPoints[nextAltIndex];
                    altA = altPoints[nextAltIndex - 1] || altPoints[altPoints.length - 1];
                    altB = altPoints[nextAltIndex + 1] || altPoints[0];

                    // see if the point behind it crosses the initial polygon
                    centroidA = new OpenLayers.Geometry.Point((altNext.x + altA.x)/2, (altNext.y + altA.y)/2);
                    candidateAIntersects = hostPoly.containsPoint(centroidA);
                    centroidA.destroy();

                    // see if the point ahead of it crosses the initial polygon
                    centroidB = new OpenLayers.Geometry.Point((altNext.x + altB.x)/2, (altNext.y + altB.y)/2);
                    candidateBIntersects = hostPoly.containsPoint(centroidB);
                    centroidB.destroy();

                    // the mids array will be the points from the companion polygon
                    // between the two intersections currently being inspected
                    mids = [];
                    mid = {};
                    //if one of the lines does not intersect (its posible for there
                    // to be no points between the junctions)
                    if (!candidateAIntersects || !candidateBIntersects) {
                        i = nextAltIndex;
                        // find all the points between the junctions and add them to the
                        // mids array to be then added to the union array
                        while (!mid.isJunction) {
                            if (!candidateAIntersects) {
                                i = (i - 1 > -1) ? i - 1 : altPoints.length - 1;
                            } else {
                                i = (i + 1 < altPoints.length) ? i + 1 : 0;
                            }
                            mid = altPoints[i];
                            if (mid && !mid.isJunction) {
                                mids.push(mid);
                            }
                        }
                    }

                    // add the points between the junctions from the companion polygon
                    union = union.concat(mids);

                    // if we're at the junction add the junction point corresponding within
                    // the initial polygon
                    if (mid.isJunction) {
                        for (i = 0; i < activePoints.length; i++) {
                            if (activePoints[i].x === mid.x && activePoints[i].y === mid.y) {
                                activePoint = activePoints[i];
                                union.push(activePoint);
                                break;
                            }
                        }
                    }
                }
                // continue the loop until all points from the initial and companion polygon
                // have been included to create a merged perimeter
            }

            return this.getPolyFromPoints(union);
        }
    });
    
    // this announces to any listening scripts that Ext and the W.ux.Util
    // singleton are now ready for use
    $(document.body).trigger('extready');
});