// ==UserScript==
// @name            WME Street to River+
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAg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
// @description     This script create a new river landmark in waze map editor (WME). It transforms the the geometry of a new unsaved street to a polygon.
// @namespace       https://greasyfork.org/scripts/441595-wme-street-to-river/
// @grant           none
// @version         2025.06.06.000
// @match           https://beta.waze.com/*editor*
// @match           https://www.waze.com/*editor*
// @exclude         https://www.waze.com/*user/*editor/*
// @require         https://update.greasyfork.org/scripts/450160/1218867/WME-Bootstrap.js
// @downloadURL https://update.greasyfork.org/scripts/441595/WME%20Street%20to%20River%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/441595/WME%20Street%20to%20River%2B.meta.js
// ==/UserScript==

// Based on WME Street to River PLUS (mod) Auteur: Andriy Fomenko - https://greasyfork.org/fr/scripts/457548-wme-street-to-river-plus-mod

// Mini howto:
// 1) install this script as greasemonkey script or chrome extension
// 2) draw a new street but do not save the street
// 3) add and apply a street name to define the rivers name and the the width of the river
//    Example: "20m Spree" creates a 20 meters width river named "Spree"
// 4) Select the helper street
// 5) Click the "Street to river" button
// 4) Delete the helper street
// 5) Edit the new landmark as you like
//
// Updated by: Eduardo Carvajal

/* jshint esversion: 11 */
/* global W */
/* global I18n */
/* global OpenLayers */
/* global $ */
/* global require */

console.warn('Remove this line, when WME-Bootstrap will fix its syntax. now it causes script error on load, details https://stackoverflow.com/questions/42036349/uncaught-typeerror-intermediate-value-is-not-a-function');

(function () {
    const version = GM_info.script.version;

    //const unused = 0;
    const idWidth = 1;
    const idTitle = 2;
    const idStreetToRiver = 3;
    const idUnlimitedSize = 4;
    const idNoUsavedStreet = 5;
    const idAllSegmentsInside = 6;
    const idMultipleSegmentsInside = 7;
    const idStreetToOther = 8;
    const idStreetToForest = 9;
    const idDeleteSegment = 10;
    const idStreetToLake = 11;
    const idStreetToPark = 12;
    const idStreetToSwamp = 13;

    function streetToRiver_bootstrap() {
        $(document)
        .on('bootstrap.wme', function () {
            streetToRiver_init()
        })
    }

// CSS INJECTION
  (()=> {
    let riverCss =
        `

          .btnRiver {
              padding: 4px;
              color: white;
              font-size: 100%;
              border-radius: 10px;
              margin: 0;
              border: 2px solid #eeeeee;
              -webkit-transition: .3s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
              }

          .btnRiver:hover {
              border: 2px solid #FFD900;
              cursor: pointer;
              z-index: 2;
              }

        `;

    let style = document.createElement('style');
     style.type = 'text/css';
    (style.styleSheet) ? style.styleSheet.cssText = riverCss : style.innerHTML = riverCss; // IE or Other browsers

    document.getElementsByTagName("head")[0].appendChild( style );
})();




    function streetToRiver_init() {
        const defaultWidth = 5;
        var scriptLanguage = "us";
        var langText;
        {
            var Config = [{
                    handler: 'WME-Street-to-River_other',
                    title: "Other",
                    func: function (ev) {
                        doPOI(ev, "OTHER");
                    },
                    key: -1,
                    arg: {
                        type: "OTHER"
                    }
                },
            ];

            for (var i = 0; i < Config.length; ++i) {
                WMEKSRegisterKeyboardShortcut('WME-Street-to-River', 'WME-Street-to-River', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
            }

            WMEKSLoadKeyboardShortcuts('WME-Street-to-River');

            window.addEventListener("beforeunload", function () {
                WMEKSSaveKeyboardShortcuts('WME-Street-to-River');
            }, false);
        }

        function insertButtons() {
            if (W.selectionManager.getSelectedWMEFeatures().length === 0)
                return;

            let btn0 = $('<button class="btnRiver" style="background-color:#9B9B9B"; title="' + getString(idTitle) + '">' + getString(idStreetToOther) + '</button>');
            btn0.click(doOther);

            let btn1 = $('<button class="btnRiver" style="background-color: #318ce7"; title="' + getString(idTitle) + '">' + getString(idStreetToRiver) + '</button>');
            btn1.click(doRiver);

            let btn2 = $('<button class="btnRiver" style="background-color: #0B7C01"; title="' + getString(idTitle) + '">' + getString(idStreetToForest) + '</button>');
            btn2.click(doForest);

            let btn3 = $('<button class="btnRiver" style="background-color: #1CCFA4"; title="' + getString(idTitle) + '">' + getString(idStreetToLake) + '</button>');
            btn3.click(doLake);

            let btn4 = $('<button class="btnRiver" style="background-color: #86C245"; title="' + getString(idTitle) + '">' + getString(idStreetToPark) + '</button>');
            btn4.click(doPark);

            let btn5 = $('<button class="btnRiver" style="background-color: #436D51"; title="' + getString(idTitle) + '">' + getString(idStreetToSwamp) + '</button>');
            btn5.click(doSwamp);

            const widthValues = [1, 2, 3, 5, 8, 10, 11, 12, 13, 15, 17, 20, 25, 30, 40, 50, 80, 100, 120, 150, 180, 200];

            var selRiverWidth = $('<wz-select name="riverWidth" />');
            for (let w = 0; w < widthValues.length; w++) {
                selRiverWidth.append($(`<wz-option value="${widthValues[w]}">${widthValues[w]}</wz-option>`));
            }
            selRiverWidth.change(function () {
                setLastRiverWidth(this.value);
            });

            var lastRiverWidth = getLastRiverWidth(defaultWidth);
            console_log("Last river width: " + lastRiverWidth);
            selRiverWidth.val(lastRiverWidth);

            var chk = $('<wz-checkbox title="' + getString(idUnlimitedSize) + '" name="_isUnlimitedSize" >' + getString(idUnlimitedSize) + '</wz-checkbox>');
            chk.prop("checked", getLastIsUnlimitedSize(false));
            chk.change(function () {
                setLastIsUnlimitedSize(this.checked);
            });
            var chkDel = $('<wz-checkbox name="_isDeleteSegment" >' + getString(idDeleteSegment) + '</wz-checkbox>');
            chkDel.prop("checked", getLastIsDeleteSegment(true));
            chkDel.change(function () {
                setLastIsDeleteSegment(this.checked);
            });

            var cnt = $('<div class="form-group" />');
            var label = $('<label ><br>🌲 Street to POI <spam><font size="2" face="arial" color="gray"> &nbsp;&nbsp; Vers: ' + version +'</font></spam></label>' );
        //  var label = $('<wz-label><a href="https://github.com/waze-ua/wme-street-to-river-plus-mod" target="_blank">Street to River+ (Mod) v' + version + '</a></wz-label>');
            cnt.append(label);

            var divGroup1 = $('<div class="controls-container" />');
            divGroup1.append($('<wz-label html-for>' + getString(idWidth) + '</wz-label>'));
            divGroup1.append(selRiverWidth);

            var divGroup2 = $('<div class="controls-container" />');
            divGroup2.append(chk);
            divGroup2.append(chkDel);

            var divGroup3 = $('<div class="controls-container" />');
            divGroup3.append(btn0);
            divGroup3.append(btn1);
            divGroup3.append(btn2);
  	        divGroup3.append(btn3);
            divGroup3.append(btn4);
            divGroup3.append(btn5);

            cnt.append(divGroup1);
            cnt.append(divGroup2);
            cnt.append(divGroup3);

            $("#segment-edit-general form.attributes-form").after(cnt);

            console_log("Street to River Language: " + scriptLanguage);
            console_log("Street to river PLUS initialized");
        }

        function doPOI(ev, typ) {
            var convertOK;
            var foundSelectedSegment = false;

            var isUnlimitedSize = getLastIsUnlimitedSize(false);
            var isDeleteSegment = getLastIsDeleteSegment(true);

            // 2014-01-09: Search for helper street. If found create or expand a river
            for (var s = W.selectionManager.getSelectedWMEFeatures().length - 1; s >= 0; s--) {
                var sel = W.selectionManager.getSelectedWMEFeatures()[s]._wmeObject;
                if (sel.type == "segment") {
                    // found segment
                    foundSelectedSegment = true;
                    convertOK = convertToLandmark(sel, typ, isUnlimitedSize);
                    if (convertOK && isDeleteSegment) {
                        var wazeActionDeleteSegment = require("Waze/Action/DeleteSegment");
                        W.model.actionManager.add(new wazeActionDeleteSegment(sel));
                    }
                }
            }
            if (!foundSelectedSegment) {
                alert(getString(idNoUsavedStreet));
            }

        }

        function doRiver(ev) {
            doPOI(ev, "RIVER_STREAM");
        }

        function doForest(ev) {
            doPOI(ev, "FOREST_GROVE");
        }
        function doOther(ev) {
            doPOI(ev, "OTHER");
        }
        function doLake(ev) {
            doPOI(ev, "SEA_LAKE_POOL");
        }
          function doPark(ev) {
            doPOI(ev, "PARK");
        }
          function doSwamp(ev) {
            doPOI(ev, "SWAMP_MARSH");
        }

        function CalcRL(components) {
            var count = components.length;
            var j = count - 1;
            var area = 0;

            for (var i = 0; i < count; ++i) {
                area += (components[i].y * components[j].x) - (components[i].x * components[j].y);
                j = i;
            }
            return area < 0 ? 1 : -1; // 1 - according to time, -1 - against time
        }

        function uniq(a) {
            var seen = {};
            return a.filter(function (item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        }

        // 2014-01-09: Base on selected helper street creates or expand an existing river/railway
        function convertToLandmark(sel, lmtype, isUnlimitedSize) {
            var i;
            var leftPa,
            rightPa,
            leftPb,
            rightPb;
            var prevLeftEq,
            prevRightEq;
            var street = getStreet(sel);

            var displacement = getDisplacement(street);

            // create place with a minimum area 100m2
            // for simple segments only (A-B)
            if (sel.geometry.components.length === 2) {
                var segLength = 0;
                var minArea = 100;
                var pt = [];
                pt[0] = sel.geometry.components[0];
                pt[1] = sel.geometry.components[1];

                var seg = new OpenLayers.Geometry.LineString(pt);
                segLength = seg.getGeodesicLength(W.map.getProjectionObject());

                // if small area is expected
                if (minArea / displacement > segLength) {
                    if (segLength <= Math.sqrt(minArea)) {
                        // create a minimum square
                        var line = Math.sqrt(minArea);
                        var segScale = line / segLength;
                        displacement = line / 1.18;
                        pt[1].resize(segScale, pt[0], 1);
                    } else {
                        // adjust displacement (width)
                        displacement = minArea / segLength;
                    }
                }
            }

            var streetVertices = sel.geometry.getVertices();
            var polyPoints = null;
            var firstPolyPoint = null;
            var secondPolyPoint = null;

            var wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
            var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
            var wazeActionAddLandmark = require("Waze/Action/AddLandmark");
            var wazeActionDeleteObject = require("Waze/Action/DeleteObject");
            var wazeActionUpdateFeatureAddress = require("Waze/Action/UpdateFeatureAddress");

            console_log("Street vertices: " + streetVertices.length);

            // 2013-10-13: Is new street inside an existing river?
            var bAddNew = !0;
            var riverLandmark = null;
            var repo = W.model.venues;

            var rrr,
            donorLandmark = null;
            for (var t in repo.objects) {
                riverLandmark = repo.objects[t];
                if (riverLandmark.attributes.categories[0] === lmtype) {
                    console_log("riverLandmark.attributes.id=" + riverLandmark.attributes.id);
                    console_log("streetVertices.length=" + streetVertices.length);
                    console_log("streetVertices[0]=" + streetVertices[0]);
                    console_log("streetVertices[streetVertices.length - 1]=" + streetVertices[streetVertices.length - 1]);

                    // 2014-06-27: Verify if the landmark object has containsPoint function
                    if ("function" === typeof riverLandmark.geometry.containsPoint) {
                        if (riverLandmark.geometry.containsPoint(streetVertices[0])) {
                            bAddNew = false; // Street is inside an existing river
                            console_log("rrr=" + riverLandmark.attributes.id);
                            rrr = riverLandmark;
                            // break;
                        }
                        if (riverLandmark.geometry.containsPoint(streetVertices[streetVertices.length - 1])) {
                            // bAddNew = false;    // Street is inside an existing river
                            console_log("donorLandmark=" + riverLandmark.attributes.id);
                            donorLandmark = riverLandmark;
                            //             break;
                        }

                    }
                }
            }
            riverLandmark = rrr;

            // 2013-10-13: Ignore vertices inside river
            var bIsOneVerticeStreet = false;
            var firstStreetVerticeOutside = 0;
            if (!bAddNew) {
                console_log("Expanding an existing river");
                while (firstStreetVerticeOutside < streetVertices.length) {
                    if (!riverLandmark.geometry.containsPoint(streetVertices[firstStreetVerticeOutside]))
                        break;
                    firstStreetVerticeOutside += 1;
                }
                if (firstStreetVerticeOutside === streetVertices.length) {
                    alert(getString(idAllSegmentsInside));
                    return false;
                }
                bIsOneVerticeStreet = firstStreetVerticeOutside === (streetVertices.length - 1);
                if (bIsOneVerticeStreet) {
                    console_log("It's one vertice street");
                }
                if (firstStreetVerticeOutside > 1) {
                    alert(getString(idMultipleSegmentsInside));
                    return false;
                }
                console_log("First street vertice outside river:" + firstStreetVerticeOutside);
            }

            // 2013-10-13: Add to polyPoints river polygon
            console_log("River polygon: Create");
            var first;
            if (bAddNew)
                first = 0;
            else
                first = firstStreetVerticeOutside - 1;

            for (i = first; i < streetVertices.length - 1; i++) {
                var pa = streetVertices[i];
                var pb = streetVertices[i + 1];

                // fix for incorrect scale calculation, as distanceTo() returns units, but displacement is in meters
                // old:
                //var scale = (pa.distanceTo(pb) + displacement) / pa.distanceTo(pb);
                // new:
                //TODO optimize this, convert displacement into map units for easier scale calculation
                var points = [pa, pb];
                var ls = new OpenLayers.Geometry.LineString(points);
                var len = ls.getGeodesicLength(W.map.getProjectionObject());
                var scale = (len + displacement / 2) / len;

                leftPa = pa.clone();
                leftPa.resize(scale, pb, 1);
                rightPa = leftPa.clone();
                leftPa.rotate(90, pa);
                rightPa.rotate(-90, pa);

                leftPb = pb.clone();
                leftPb.resize(scale, pa, 1);
                rightPb = leftPb.clone();
                leftPb.rotate(-90, pb);
                rightPb.rotate(90, pb);

                var leftEq = getEquation({
                    'x1': leftPa.x,
                    'y1': leftPa.y,
                    'x2': leftPb.x,
                    'y2': leftPb.y
                });
                var rightEq = getEquation({
                    'x1': rightPa.x,
                    'y1': rightPa.y,
                    'x2': rightPb.x,
                    'y2': rightPb.y
                });
                if (polyPoints === null) {
                    polyPoints = [leftPa, rightPa];
                } else {
                    var li = intersectX(leftEq, prevLeftEq);
                    var ri = intersectX(rightEq, prevRightEq);
                    if (li && ri) {
                        // 2013-10-17: Is point outside river?
                        if (i >= firstStreetVerticeOutside) {
                            polyPoints.unshift(li);
                            polyPoints.push(ri);

                            // 2013-10-17: Is first point outside river? -> Save it for later use
                            if (i == firstStreetVerticeOutside) {
                                firstPolyPoint = li.clone();
                                secondPolyPoint = ri.clone();
                                polyPoints = [li, ri];
                            }
                        }
                    } else {
                        // 2013-10-17: Is point outside river?
                        if (i >= firstStreetVerticeOutside) {
                            polyPoints.unshift(leftPb.clone());
                            polyPoints.push(rightPb.clone());

                            // 2013-10-17: Is first point outside river? -> Save it for later use
                            if (i == firstStreetVerticeOutside) {
                                firstPolyPoint = leftPb.clone();
                                secondPolyPoint = rightPb.clone();
                                polyPoints = [leftPb, rightPb];
                            }
                        }
                    }
                }

                prevLeftEq = leftEq;
                prevRightEq = rightEq;

                // 2013-06-03: Is Waze limit reached?
                if ((polyPoints.length > 50) && !isUnlimitedSize) {
                    break;
                }
            }

            if (bIsOneVerticeStreet) {
                firstPolyPoint = leftPb.clone();
                secondPolyPoint = rightPb.clone();
                polyPoints = [leftPb, rightPb];
                console_log("One vertice river:" + polyPoints.length);
            } else {
                polyPoints.push(rightPb);
                polyPoints.push(leftPb);
            }
            console_log("River polygon: done");

            // 2014-01-09: Create or expand an existing river?
            if (bAddNew) {
                // 2014-01-09: Add new river
                // 2014-01-09: Create new river's Polygon
                var polygon = new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));

                // 2014-10-08: Creates river's Landmark

                //FIX (?????? Start)
                //                riverLandmark = new wazefeatureVectorLandmark();
                var ldk = {};
                ldk.geoJSONGeometry = W.userscripts.toGeoJSONGeometry (polygon);
                riverLandmark = new wazefeatureVectorLandmark(ldk);
                //FIX (?????? End)

                riverLandmark.geometry = polygon;
                riverLandmark.attributes.categories.push(lmtype);

                // 2014-01-09: Add river's name base on Street Name
                if (street && street.attributes.name) {
                    riverLandmark.attributes.name = street.attributes.name.replace(/^\d+(m|м|ft)\s*/, ''); // TODO make localizable
                }

                // 2014-10-08: Add new Landmark to Waze Editor
                var riverLandmark_o = new wazeActionAddLandmark(riverLandmark);
                W.model.actionManager.add(riverLandmark_o);
                try {
                    W.selectionManager.setSelectedModels([riverLandmark]);
                } catch (err) {
                    // Ignore error:
                    // Uncaught TypeError: Cannot read properties of undefined (reading 'children')
                    // at Object.WMETB_FPnewSelectionAvailable (FancyPermalink.min.js:216:184)
                    // at v (third_party-45fe9aba9d649e1fe91a.js.gz:2:1169484)
                    console_log(err)
                }

                if (lmtype !== "OTHER") {
                    console_log("bAddNew");
                    let address = riverLandmark.getAddress().attributes;
                    console_log(address);
                    let newAddressAtts = {
                        streetName: null,
                        emptyStreet: true,
                        cityName: null,
                        emptyCity: true,
                        stateID: address.state.attributes.id,
                        countryID: address.country.attributes.id
                    };
                    W.model.actionManager.add(new wazeActionUpdateFeatureAddress(riverLandmark, newAddressAtts, {
                            streetIDField: 'streetID'
                        }));
                }

            } else {
                // 2014-01-09: Expand an existing river
                var originalGeometry = riverLandmark.geometry.clone();

                if (donorLandmark) // if there is a donor
                {
                    let undoGeometry = riverLandmark.geometry.clone();
                    var undoGeometryDonor = donorLandmark.geometry.clone();
                    var components = riverLandmark.geometry.components[0].components;
                    var componentsDonor = donorLandmark.geometry.components[0].components;

                    //window.donorLandmark=donorLandmark;
                    //window.riverLandmark=riverLandmark;

                    // where is the array twisted?
                    var componentsRL = CalcRL(components);
                    var componentsDonorRL = CalcRL(componentsDonor);
                    console_log("src=" + componentsRL + ", donor=" + componentsDonorRL);
                    // find the index of the nearest point to the beginning of the segment
                    var dist = 1000000000;
                    var p1 = [0, 0],
                    p2 = [0, 0]; // where is the array twisted?
                    for (let i1 = 0; i1 < components.length; i1++) {
                        var d1 = Math.sqrt(Math.pow(Math.abs(components[i1].x - streetVertices[0].x), 2) + Math.pow(Math.abs(components[i1].y - streetVertices[0].y), 2));
                        if (d1 < dist) {
                            dist = d1;
                            p1[0] = i1;
                            if (componentsRL > 0)
                                p1[1] = i1 === 0 ? components.length - 1 : i1 - 1;
                            else
                                p1[1] = i1 == components.length - 1 ? 0 : i1 + 1;
                        }
                    }

                    console_log("p1=" + p1 + ", dist=" + dist);
                    // we are looking for the index in the second POI, where the insertion starts.
                    dist = 1000000000;
                    for (let i1 = 0; i1 < componentsDonor.length; i1++) {
                        let d1 = Math.sqrt(Math.pow(Math.abs(componentsDonor[i1].x - streetVertices[streetVertices.length - 1].x), 2) + Math.pow(Math.abs(componentsDonor[i1].y - streetVertices[streetVertices.length - 1].y), 2));
                        if (d1 < dist) {
                            dist = d1;
                            p2[0] = i1;
                            if (componentsDonorRL > 0)
                                p2[1] = i1 === 0 ? componentsDonor.length - 1 : i1 - 1;
                            else
                                p2[1] = i1 == componentsDonor.length - 1 ? 0 : i1 + 1;
                        }
                    }
                    console_log("p2=" + p2 + ", dist=" + dist);

                    var componentsNew = components.slice();
                    componentsNew.length = 0;

                    // add a source
                    for (let i1 = 0; i1 <= p1[0]; ++i1)
                        componentsNew.push(components[i1]);

                    // we add a donor
                    if (componentsRL < 0) {
                        if (componentsDonorRL < 0) {
                            // we add the donor in a circle
                            for (let i1 = p2[0]; i1 < componentsDonor.length; ++i1)
                                componentsNew.push(componentsDonor[i1]);

                            // ...the remainder of the donor
                            for (let i1 = 0; i1 < p2[0]; ++i1)
                                componentsNew.push(componentsDonor[i1]);
                        } else {
                            // we add the donor in a circle
                            for (let i1 = p2[0]; i1 >= 0; --i1)
                                componentsNew.push(componentsDonor[i1]);

                            // ...the remainder of the donor
                            for (let i1 = componentsDonor.length - 1; i1 > p2[0]; --i1)
                                componentsNew.push(componentsDonor[i1]);
                        }
                    } else {
                        if (componentsDonorRL < 0) {
                            // we add the donor in a circle
                            for (let i1 = p2[0]; i1 >= 0; --i1)
                                componentsNew.push(componentsDonor[i1]);

                            // ...the remainder of the donor
                            for (let i1 = componentsDonor.length - 1; i1 > p2[0]; --i1)
                                componentsNew.push(componentsDonor[i1]);
                        } else {
                            // we add the donor in a circle
                            for (let i1 = p2[0]; i1 < componentsDonor.length; ++i1)
                                componentsNew.push(componentsDonor[i1]);

                            // ...the remainder of the donor
                            for (let i1 = 0; i1 < p2[0]; ++i1)
                                componentsNew.push(componentsDonor[i1]);
                        }
                    }

                    // add a source
                    for (let i1 = p1[0] + 1; i1 < components.length; ++i1)
                        componentsNew.push(components[i1]);

                    //window.componentsNew=componentsNew
                    // we are updating
                    riverLandmark.geometry.components[0].components = uniq(componentsNew);

                    W.model.actionManager.add(new wazeActionUpdateFeatureGeometry(riverLandmark, W.model.venues, W.userscripts.toGeoJSONGeometry(undoGeometry), W.userscripts.toGeoJSONGeometry(riverLandmark.geometry)));
                    W.model.actionManager.add(new wazeActionDeleteObject(donorLandmark, W.model.venues, W.userscripts.toGeoJSONGeometry(undoGeometryDonor), W.userscripts.toGeoJSONGeometry(donorLandmark.geometry)));

                    return true;
                }
                var riverVertices = riverLandmark.geometry.getVertices();
                console_log("Total river vertices:" + riverVertices.length);

                // 2013-06-01: Adjust first street vertice in case of a 2 vertice river
                if (firstStreetVerticeOutside === 0)
                    firstStreetVerticeOutside = 1;

                // 2013-06-01: Find on selected river, the nearest point from the beginning of road

                var distance = 0;
                var minDistance = 100000;
                var indexNearestPolyPoint = 0;
                for (i = 0; i < polyPoints.length; i++) {
                    distance = polyPoints[i].distanceTo(streetVertices[firstStreetVerticeOutside]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        indexNearestPolyPoint = i;
                    }
                }
                console_log("polyPoints.length: " + polyPoints.length);
                console_log("indexNearestPolyPoint: " + indexNearestPolyPoint);

                var indexNearestRiverVertice = 0;
                var nextIndex;
                minDistance = 100000;
                for (i = 0; i < riverVertices.length; i++) {
                    nextIndex = getNextIndex(i, riverVertices.length, +1);
                    if (isIntersectingLines(riverVertices[i], riverVertices[nextIndex], streetVertices[0], streetVertices[1])) {
                        distance = polyPoints[indexNearestPolyPoint].distanceTo(riverVertices[i]);
                        if (distance < minDistance) {
                            minDistance = distance;
                            indexNearestRiverVertice = i;
                        }
                    }
                }
                console_log("indexNearestRiverVertice: " + indexNearestRiverVertice);
                var nextRiverVertice = getNextIndex(indexNearestRiverVertice, riverVertices.length, 1);

                // 2013-06-01: Is river's Polygon clockwise or counter-clockwise?

                console_log("nextRiverVertice: " + nextRiverVertice);

                console_log("firstPolyPoint:" + firstPolyPoint);
                console_log("secondPolyPoint:" + secondPolyPoint);

                var inc = 1;
                var incIndex = 0;
                if (isIntersectingLines(riverVertices[indexNearestRiverVertice], firstPolyPoint, riverVertices[nextRiverVertice], secondPolyPoint)) {
                    //inc = -1;
                    console_log("Lines intersect: clockwise polygon");
                    inc = +1;
                    incIndex = 1;
                } else {
                    inc = +1;
                    console_log("Lines doesn't intersect: counter-clockwise polygon");
                }

                // 2013-06-03: Update river's polygon (add new vertices)
                //var indexLastPolyPoint = getNextIndex(index, polyPoints.length, -inc);
                var indexNextVertice = 1;
                var index = polyPoints.length / 2 - 1;

                if (bIsOneVerticeStreet)
                    index += 1;

                for (i = 0; i < polyPoints.length; i++) {
                    if (!originalGeometry.containsPoint(polyPoints[index])) {

                        // 2014-01-09: Save's old Landmark
                        let undoGeometry = riverLandmark.geometry.clone();

                        // 2014-01-09: Add a new point to existing river landmark
                        riverLandmark.geometry.components[0].addComponent(polyPoints[index], indexNearestRiverVertice + indexNextVertice);

                        // 2014-01-09: Update river landmark on Waze editor
                        // 2014-09-30: Gets UptdateFeatureGeometry
                        W.model.actionManager.add(new wazeActionUpdateFeatureGeometry(riverLandmark, W.model.venues, W.userscripts.toGeoJSONGeometry(undoGeometry), W.userscripts.toGeoJSONGeometry(riverLandmark.geometry)));
                        //delete undoGeometry;

                        console_log("Added: " + index);
                        indexNextVertice += incIndex;
                    }
                    index = getNextIndex(index, polyPoints.length, inc);
                }

                // 2013-06-03: Notify Waze that current river's geometry change.
                //Waze.model.actionManager.add(new Waze.Action.UpdateFeatureGeometry(riverLandmark,Waze.model.landmarks,originalGeometry,riverLandmark.geometry));
                //delete originalGeometry;

                if (lmtype !== "OTHER") {
                    console_log("!bAddNew");
                    let address = riverLandmark.getAddress().attributes;
                    console_log(address);
                    let newAddressAtts = {
                        streetName: null,
                        emptyStreet: true,
                        cityName: null,
                        emptyCity: true,
                        stateID: address.state.attributes.id,
                        countryID: address.country.attributes.id
                    };
                    W.model.actionManager.add(new wazeActionUpdateFeatureAddress(riverLandmark, newAddressAtts, {
                            streetIDField: 'streetID'
                        }));
                }

            }
            return true;
        }

        // 2013-06-02: Returns TRUE if line1 intersects lines2
        function isIntersectingLines(pointLine1From, pointLine1To, pointLine2From, pointLine2To) {
            var segment1;
            var segment2;

            // 2013-06-02: OpenLayers.Geometry.segmentsIntersect requires that start and end are ordered so that x1 < x2.
            if (pointLine1From.x <= pointLine1To.x)
                segment1 = {
                    'x1': pointLine1From.x,
                    'y1': pointLine1From.y,
                    'x2': pointLine1To.x,
                    'y2': pointLine1To.y
                };
            else
                segment1 = {
                    'x1': pointLine1To.x,
                    'y1': pointLine1To.y,
                    'x2': pointLine1From.x,
                    'y2': pointLine1From.y
                };

            if (pointLine2From.x <= pointLine2To.x)
                segment2 = {
                    'x1': pointLine2From.x,
                    'y1': pointLine2From.y,
                    'x2': pointLine2To.x,
                    'y2': pointLine2To.y
                };
            else
                segment2 = {
                    'x1': pointLine2To.x,
                    'y1': pointLine2To.y,
                    'x2': pointLine2From.x,
                    'y2': pointLine2From.y
                };

            return OpenLayers.Geometry.segmentsIntersect(segment1, segment2, !1);
        }

        // 2013-06-02: Returns TRUE if polygon's direction is clockwise. FALSE -> counter-clockwise
        // Based on: http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
        /*
        function isClockwise(vertices,index,count){
        var total=0;
        var nextIndex;

        if(count > vertices.length)
        count = vertices.length;


        for(var i=0; i < vertices.length-1; i++){
        nextIndex = getNextIndex(index,vertices.length,+1);
        total += (vertices[nextIndex].x-vertices[index].x) * (vertices[nextIndex].y+vertices[index].y);
        index = nextIndex;
        }
        return total>=0;
        }
         */

        // 2013-06-01: Increment/decrement index by 1
        function getNextIndex(index, length, inc) {
            var next = index + inc;
            if (next == length)
                next = 0;
            if (next < 0)
                next = length - 1;
            return next;
        }

        function getEquation(segment) {
            if (segment.x2 == segment.x1)
                return {
                    'x': segment.x1
                };

            var slope = (segment.y2 - segment.y1) / (segment.x2 - segment.x1);
            var offset = segment.y1 - (slope * segment.x1);
            return {
                'slope': slope,
                'offset': offset
            };
        }

        //
        // line A: y = ax + b
        // line B: y = cx + b
        //
        // x = (d - b) / (a - c)
        function intersectX(eqa, eqb) {
            if ("number" == typeof eqa.slope && "number" == typeof eqb.slope) {
                if (eqa.slope == eqb.slope)
                    return null;

                var ix = (eqb.offset - eqa.offset) / (eqa.slope - eqb.slope);
                var iy = eqa.slope * ix + eqa.offset;
                return new OpenLayers.Geometry.Point(ix, iy);
            } else if ("number" == typeof eqa.x) {
                return new OpenLayers.Geometry.Point(eqa.x, eqb.slope * eqa.x + eqb.offset);
            } else if ("number" == typeof eqb.y) {
                return new OpenLayers.Geometry.Point(eqb.x, eqa.slope * eqb.x + eqa.offset);
            }
            return null;
        }

        function getStreet(segment) {
            if (!segment.attributes.primaryStreetID)
                return null;
            var street = segment.model.streets.getObjectById(segment.attributes.primaryStreetID);
            return street;
        }

        function getDisplacement(street) {
            if (!street)
                return getLastRiverWidth(defaultWidth);
            if (!street.attributes.name)
                return getLastRiverWidth(defaultWidth);
            if (street.attributes.name.match(/^(\d+)(m|м)\b/)) // TODO make localizable
                return parseInt(RegExp.$1);
            if (street.attributes.name.match(/^(\d+)ft\b/)) // TODO make localizable
                return parseInt(RegExp.$1) * 0.3048;
            return getLastRiverWidth(defaultWidth);
        }

        // 2013-06-09: Save current river Width
        function setLastRiverWidth(riverWidth) {
            if (typeof(Storage) !== "undefined") {
                // 2013-06-09: Yes! localStorage and sessionStorage support!
                sessionStorage.riverWidth = Number(riverWidth);
            } else {
                // Sorry! No web storage support..
                console_log("No web storage support");
            }
        }

        // 2013-06-09: Returns last saved river width
        function getLastRiverWidth(defaultRiverWidth) {
            if (typeof(Storage) !== "undefined") {
                // 2013-06-09: Yes! localStorage and sessionStorage support!
                if (sessionStorage.riverWidth)
                    return Number(sessionStorage.riverWidth);
                else
                    return Number(defaultRiverWidth); // Default river width
            } else {
                // Sorry! No web storage support..
                return Number(defaultRiverWidth); // Default river width
            }
        }

        // 2013-10-20: Save current unlimited size preference
        function setLastIsUnlimitedSize(isUnlimitedSize) {
            if (typeof(Storage) !== "undefined") {
                // 2013-06-09: Yes! localStorage and sessionStorage support!
                sessionStorage.isUnlimitedSize = Number(isUnlimitedSize);
            } else {
                // Sorry! No web storage support..
                console_log("No web storage support");
            }
        }

        // 2013-10-20: Returns last saved unlimited size preference
        function getLastIsUnlimitedSize(defaultValue) {
            if (typeof(Storage) !== "undefined") {
                // 2013-10-20: Yes! localStorage and sessionStorage support!
                if (sessionStorage.isUnlimitedSize)
                    return Number(sessionStorage.isUnlimitedSize);
                else
                    return Number(defaultValue); // Default preference
            } else {
                // Sorry! No web storage support..
                return Number(defaultValue); // Default preference
            }
        }

        // 2013-10-20: Save current unlimited size preference
        function setLastIsDeleteSegment(isDeleteSegment) {
            if (typeof(Storage) !== "undefined") {
                // 2013-06-09: Yes! localStorage and sessionStorage support!
                sessionStorage.isDeleteSegment = Number(isDeleteSegment);
            } else {
                // Sorry! No web storage support..
                console_log("No web storage support");
            }
        }

        // 2013-10-20: Returns last saved unlimited size preference
        function getLastIsDeleteSegment(defaultValue) {
            if (typeof(Storage) !== "undefined") {
                // 2013-10-20: Yes! localStorage and sessionStorage support!
                if (sessionStorage.isDeleteSegment)
                    return Number(sessionStorage.isDeleteSegment);
                else
                    return Number(defaultValue); // Default preference
            } else {
                // Sorry! No web storage support..
                return Number(defaultValue); // Default preference
            }
        }

        // 2014-06-05: Returns WME interface language
        function getLanguage() {
            var wmeLanguage;
            var urlParts;

            urlParts = location.pathname.split("/");
            wmeLanguage = urlParts[1].toLowerCase();
            if (wmeLanguage === "editor")
                wmeLanguage = "us";

            return wmeLanguage;

        }

        // 2014-06-05: Returns WME interface language
        /*
        function isBetaEditor(){
        var wmeEditor = location.host.toLowerCase();

        return wmeEditor==="editor-beta.waze.com";
        }
         */

        // 2014-06-05: Translate text to different languages
        function intLanguageStrings() {
            switch (getLanguage()) {
            case "es": // 2014-06-05: Spanish
            case "es-419":
                langText = new Array("", "Ancho (metros)", "Cree una nueva calle, selecciónela y oprima este botón.", "Calle a Río", "Tamaño ilimitado",
                        "¡No se encontró una calle sin guardar!", "Todos los segmentos de la calle adentro del río. No se puede continuar.",
                        "Múltiples segmentos de la calle dentro del río. No se puede continuar", "Other", "Forest", "Delete segment");
                break;
           case "fr": // French
               langText = new Array("mètres", "Largeur du POI ", "Créez une nouvelle rue, sélectionnez-la et cliquez sur ce bouton.", "Rivière", "Longueur illimitée (dangereux)",
                        "Pas de nouvelle rue non enregistré trouvée!", "Tous les segments de la rue dans la rivière. Vous ne pouvez pas continuer.",
                        "Plusieurs segments de rues à l'intérieur de la rivière. Vous ne pouvez pas continuer.", "Autre", "Forêt", "Supprimer le segment après", "Lac", "Parc", "Marais");
                break;

            case "uk": // 2018-05-03: Ukrainian
                langText = new Array("", "Ширина (в метрах)", "Створіть нову дорогу (не зберігайте і не знімайте виділення) та натисніть цю кнопку.", "Ріка", "Безлімітна довжина (небезпечно)",
                        "Не виділено жодної збереженої дороги!", "Усі сегменти дороги знаходяться всередині ріки. Перетворення неможливе.",
                        "Занадто багато сегментів дороги знаходяться всередині ріки. Перетворення неможливе.", "Контур", "Ліс", "Видалити сегмент");
                break;
            case "hu": // 2014-07-02: Hungarian
                langText = new Array("", "Szélesség (méter)", "Hozzon létre egy új utcát, válassza ki, majd kattintson erre a gombra.", "Utcából folyó", "Korlátlan méretű (nem biztonságos)",
                        "Nem található nem mentett és kiválasztott új utca!", "Az útszakasz a folyón belül található! Nem lehet folytatni.",
                        "Minden útszakasz a folyón belül található! Nem lehet folytatni.", "Other", "Forest", "Delete segment");
                break;
            case "cs": // 2014-07-03: Czech
                langText = new Array("", "Šířka (metrů)", "Vytvořte osu řeky, vyberte segment a stiskněte toto tlačítko.", "Silnice na řeku", "Neomezená šířka (nebezpečné)",
                        "Nebyly vybrány žádné neuložené segmenty!", "Všechny segmenty jsou uvnitř řeky! Nelze pokračovat.",
                        "Uvnitř řeky je více segmentů! Nelze pokračovat.", "Other", "Forest", "Delete segment");
                break;
            case "pl": // 2014-11-08: Polish - By Zniwek
                langText = new Array("", "Szerokość (w metrach)", "Stwórz ulicę, wybierz ją i kliknij ten przycisk.", "Ulica w Rzekę", "Nieskończony rozmiar (niebezpieczne)",
                        "Nie znaleziono nowej i niezapisanej ulicy!", "Wszystkie segmenty ulicy wewnątrz rzeki. Nie mogę kontynuować.",
                        "Wiele segmentów ulicy wewnątrz rzeki. Nie mogę kontynuować.", "Other", "Forest", "Delete segment");
                break;
            case "pt-br": // 2015-04-05: Portuguese - By esmota
                langText = new Array("", "Largura (metros)", "Criar uma nova rua, selecione e clique neste botão.", "Rua para Rio", "Comprimento ilimitado (instável)",
                        "Nenhuma nova rua, sem salvar, selecionada!", "Todos os segmentos de rua estão dentro de um rio. Nada a fazer.",
                        "Múltiplos segmentos de rua dentro de um rio. Impossível continuar.", "Other", "Forest", "Delete segment");
                break;
            default: // 2014-06-05: English
                langText = new Array("", "Width (in meters)", "Create a new street, select and click this button.", "River", "Unlimited size (unsafe)",
                        "No unsaved and selected new street found!", "All street segments inside river. Cannot continue.",
                        "Multiple street segments inside river. Cannot continue.", "Other", "Forest", "Delete segment");
            }
        }

        // 2014-06-05: Returns the translated  string to current language, if the language is not recognized assumes English
        function getString(stringID) {
            return langText[stringID];
        }

        function console_log(msg) {
            //if (console.log)
            // 2013-05-19: Alternate method to validate console object
            if (typeof console != "undefined")
                console.log(msg);
        }

        // 2014-06-05: Get interface language
        scriptLanguage = getLanguage();
        intLanguageStrings();

        //W.selectionManager.events.register(
        //  'selectionchanged',
        //  null,
        //  insertButtons
        //)
        $(document)
        .on('segment.wme', (event, element, model) => {
            insertButtons()
        })
    }

    streetToRiver_bootstrap();

    // from: https://greasyfork.org/ru/scripts/16071-wme-keyboard-shortcuts (modify)
    /*
    when adding shortcuts each shortcut will need a unique name
    the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
    ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
    ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
    ShortcutsHeader: this is the header that will show up in the keyboard editor
    NewShortcut: This is the name of the shortcut and needs to be unique from all of the other shortcuts, from other scripts, and WME
    ShortcutDescription: This will show up as the text next to your shortcut
    FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
    ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
    ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
     */
    function WMEKSRegisterKeyboardShortcut(a, b, c, d, e, f, g) {
        try {
            I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members.length
        } catch (c) {
            W.accelerators.Groups[a] = [],
            W.accelerators.Groups[a].members = [],
            I18n.translations[I18n.locale].keyboard_shortcuts.groups[a] = [],
            I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].description = b,
            I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members = []
        }
        if (e && "function" == typeof e) {
            I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members[c] = d,
            W.accelerators.addAction(c, {
                group: a
            });
            var i = "-1",
            j = {};
            j[i] = c,
            W.accelerators._registerShortcuts(j),
            null !== f && (j = {}, j[f] = c, W.accelerators._registerShortcuts(j)),
            W.accelerators.events.register(c, null, function () {
                e(g)
            })
        } else
            alert("The function " + e + " has not been declared")
    }
    function WMEKSLoadKeyboardShortcuts(a) {
        if (console.log("WMEKSLoadKeyboardShortcuts(" + a + ")"), localStorage[a + "KBS"])
            for (var b = JSON.parse(localStorage[a + "KBS"]), c = 0; c < b.length; c++)
                try {
                    W.accelerators._registerShortcuts(b[c])
                } catch (a) {
                    console.log(a)
                }
    }
    function WMEKSSaveKeyboardShortcuts(a) {
        console.log("WMEKSSaveKeyboardShortcuts(" + a + ")");
        var b = [];
        for (var c in W.accelerators.Actions) {
            var d = "";
            if (W.accelerators.Actions[c].group == a) {
                W.accelerators.Actions[c].shortcut ? (W.accelerators.Actions[c].shortcut.altKey === !0 && (d += "A"), W.accelerators.Actions[c].shortcut.shiftKey === !0 && (d += "S"), W.accelerators.Actions[c].shortcut.ctrlKey === !0 && (d += "C"), "" !== d && (d += "+"), W.accelerators.Actions[c].shortcut.keyCode && (d += W.accelerators.Actions[c].shortcut.keyCode)) : d = "-1";
                var e = {};
                e[d] = W.accelerators.Actions[c].id,
                b[b.length] = e
            }
        }
        localStorage[a + "KBS"] = JSON.stringify(b)
    }
    /* ********************************************************** */
})();
