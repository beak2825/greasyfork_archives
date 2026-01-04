// ==UserScript==
// @name                WME MagicWand
// @namespace           http://en.advisor.travel/wme-magic-wand
// @description         The very same thing as same tool in graphic editor: select "similar" colored area and create landmark out of it + Clone, Orthogonalize, Rotate and Resize for landmarks
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version             2.2.3
// @grant               none
// @license             MIT
// @copyright		    2018 Vadim Istratov <wpoi@ya.ru>
// @downloadURL https://update.greasyfork.org/scripts/398965/WME%20MagicWand.user.js
// @updateURL https://update.greasyfork.org/scripts/398965/WME%20MagicWand.meta.js
// ==/UserScript==

/**
// Special thanks goes to:
// https://github.com/AndriiHeonia/hull
// https://gist.github.com/tixxit/252222
// http://blog.cedric.ws/draw-the-convex-hull-with-canvas-and-javascript
// http://www.iis.sinica.edu.tw/page/jise/2012/201205_10.pdf
// http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment?page=1&tab=active#tab-top
// http://jsfromhell.com/math/is-point-in-poly
// https://gist.github.com/robgaston/8855489
// https://github.com/predein
 */

/**
 * Contributors: justins83
 */

function run_magicwand() {
    var wmelmw_version = "2.2";

    window.wme_magic_wand_debug = false;
    window.wme_magic_wand_profile = false;

    window.wme_magicwand_helpers = {
        isDragging: false,
        draggedNode: null,
        modifiedFeatureControl: null,
        layer: null,
        snap: null
    };

    /* bootstrap, will call initialiseHighlights() */
    function bootstraMagicWand() {
        var bGreasemonkeyServiceDefined = false;

        /* begin running the code! */
        setTimeout(initialiseMagicWand, 500);
    }

    /* helper function */
    function getElClass(classname, node) {
        if (!node) node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className)) a.push(els[i]);
        return a;
    }

    function getElId(node) {
        return document.getElementById(node);
    }

    /* =========================================================================== */

    function initialiseMagicWand() {
        try {
            if (!((typeof W.map != undefined) && (undefined != typeof W.map.events.register) && (undefined != typeof W.selectionManager.events.register ) && (undefined != typeof W.loginManager.events.register) )) {
                setTimeout(initialiseMagicWand, 1000);
                return;
            }
        } catch (err) {
            setTimeout(initialiseMagicWand, 1000);
            return;
        }

        var userInfo = getElId('user-info');
        var userTabs = getElId('user-tabs');

        if(!getElClass('nav-tabs', userTabs)[0]) {
            setTimeout(initialiseMagicWand, 1000);
            return;
        }

        var navTabs = getElClass('nav-tabs', userTabs)[0];
        var tabContent = getElClass('tab-content', userInfo)[0];

        console.log('WME MagicWand init');

        window.wme_magic_wand = false;
        window.wme_magic_wand_process = false;

        // add new box to left of the map
        var addon = document.createElement('section');
        addon.innerHTML = '<b>WME Magic Wand</b> v' + wmelmw_version;

        section = document.createElement('p');
        section.style.paddingTop = "8px";
        section.style.textIndent = "16px";
        section.id = "magicwand_advanced";
        section.innerHTML = '<b>Advanced Editor Options</b><br/>'
            + '<label>Angle threshold<br/><input type="text" id="_cMagicWandAngleThreshold" name="_cMagicWandAngleThreshold" value="12" size="3" maxlength="2" /></label><br/>'
            + '<label><input type="checkbox" id="_cMagicWandEdit_Rotate" name="_cMagicWandEdit_Rotate" value="1" /> Enable Rotate landmarks</label><br/>'
            + '<label><input type="checkbox" id="_cMagicWandEdit_Resize" name="_cMagicWandEdit_Resize" value="1" /> Enable Resize (no reshape)</label><br/>'
            + '<label><input type="checkbox" id="_cMagicWandHighlight" name="_cMagicWandHighlight" value="1" /> Enable Highlight</label><br/>'
            + '<label><input type="checkbox" id="_cMagicWandStraightHelper" name="_cMagicWandStraightHelper" value="1" /> Enable straight angle helper (hold SHIFT)</label><br/><br/><br/>';
        addon.appendChild(section);

        var section = document.createElement('p');
        section.style.paddingTop = "8px";
        section.style.textIndent = "16px";
        section.id = "magicwand_common";
        section.innerHTML = '<b>Magic wand tool</b><br/>'
            + '<input type="button" id="_bMagicWandProcessClick" name="_bMagicWandProcessClick" value="CLICK TO START MAGIC WAND" style="background-color: green" /><br/><br/>'
            + '<b>Status:</b> <span id="_sMagicWandStatus">Disabled</span><br/>'
            + '<b>Layer:</b> <span id="_sMagicWandUsedLayer"></span><br/>'
            + '<b>Clicked pixel color to match:</b>'
            + '<div id="_dMagicWandColorpicker" style="width: 20px; height: 20px; border: 1px solid black; display: inline-block; margin-left: 10px;">&nbsp;</div><br/>';

        addon.appendChild(section);

        section = document.createElement('p');
        section.style.paddingTop = "8px";
        section.style.textIndent = "16px";
        section.id = "magicwand_advanced";
        section.innerHTML = '<b>Options</b><br/>'
            + 'Landmark type:<br/>'
            + '<select id="_sMagicWandLandmark" name="_sMagicWandLandmark" style="width: 95%"></select><br/><br/>'
            + 'Color match algorithm:<br/>'
            + '<label><input type="radio" id="_rMagicWandColorAlgorithm_color" name="_rMagicWandColorAlgorithm" value="1" checked="checked" /> Color Distance</label><br/>'
            + '<label><input type="radio" id="_rMagicWandColorAlgorithm_lab" name="_rMagicWandColorAlgorithm" value="2" /> Human-eye Similarity</label><br/><br/>'
            + '<label for="_cMagicWandSimilarity">Tolerance</label><br/>Around 4-10, >20 very slow<br/>'
            + '<input type="text" id="_cMagicWandSimilarity" name="_cMagicWandSimilarity" value="8" size="4" maxlength="3" /><br/><br/>'
            + '<label for="_cMagicWandConcavHull">Detailing</label><br/>Around 30-40, the bigger the less detailed<br/>'
            + '<input type="text" id="_cMagicWandConcavHull" name="_cMagicWandConcavHull" value="8" size="4" maxlength="3" /><br/><br/>'
            + '<label for="_cMagicWandSimplification">Landmark simplification</label><br/>Usually 0-5, lesser gives more points in polygon<br/>'
            + '<input type="text" id="_cMagicWandSimplification" name="_cMagicWandSimplification" value="3" size="5" maxlength="4" /><br/><br/>'
            + '<label for="_cMagicWandSampling">Sampling mask size</label><br/>Usually 1-3, larger - smoother and more greedy<br/>'
            + '<input type="text" id="_cMagicWandSampling" name="_cMagicWandSampling" value="3" size="3" maxlength="1" /><br/>';
        addon.appendChild(section);

        var newtab = document.createElement('li');
        newtab.innerHTML = '<a href="#sidepanel-magicwand" data-toggle="tab">MagicWand</a>';
        navTabs.appendChild(newtab);

        addon.id = "sidepanel-magicwand";
        addon.className = "tab-pane";
        tabContent.appendChild(addon);

        populateLandmarks();
        loadWMEMagicWandSettings();

        // UI listeners
        $('#_bMagicWandProcessClick').click(switchMagicWandStatus);
        $('#_cMagicWandEdit_Rotate').change(updateAdvancedEditing);
        $('#_cMagicWandEdit_Resize').change(updateAdvancedEditing);
        $('#_cMagicWandHighlight').change(updateAdvancedEditing);
        $('#_cMagicWandConcavHull').change(updateAdvancedEditing);
        $('#_cMagicWandStraightHelper').change(updateAdvancedEditing);

        // Event listeners
        W.selectionManager.events.register("selectionchanged", null, onLandmarkSelect);
        window.addEventListener("beforeunload", saveWMEMagicWandOptions, false);
        window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);

        let extprovobserver = new MutationObserver(function(mutations) {
           mutations.forEach(function(mutation) {
               for (var i = 0; i < mutation.addedNodes.length; i++) {
                   var addedNode = mutation.addedNodes[i];
                   if (addedNode.nodeType === Node.ELEMENT_NODE && $(addedNode).hasClass('address-edit-view')) {
                       if (W.selectionManager.hasSelectedItems() && W.selectionManager.selectedItems[0].model.type === 'venue') {
                           onLandmarkSelect();
                       }
                   }
               }
            });
        });

        extprovobserver.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

        // Hotkeys
        registerKeyShortcut("WMEMagicWand_CloneLandmark", "Clone Landmark", cloneLandmark, {"C+c": "WMEMagicWand_CloneLandmark"});
        registerKeyShortcut("WMEMagicWand_OrthogonalizeLandmark", "Orthogonalize Landmark", Orthogonalize, {"C+x": "WMEMagicWand_OrthogonalizeLandmark"});
        registerKeyShortcut("WMEMagicWand_SimplifyLandmark", "Simplify Landmark", simplifySelectedLandmark, {"C+j": "WMEMagicWand_SimplifyLandmark"});
        registerKeyShortcut("WMEMagicWand_HighlightLandmark", "Highlight Landmarks", highlightLandmarks, {"C+k": "WMEMagicWand_HighlightLandmark"});

        // Start extension
        WMELandmarkMagicWand();
    }

    function loadWMEMagicWandSettings () {
        if (localStorage.WMEMagicWandScript) {
            console.log("WME MagicWand: loading options");
            var options = JSON.parse(localStorage.WMEMagicWandScript);

            getElId('_cMagicWandEdit_Rotate').checked = typeof options[0] !== 'undefined' ? options[0] : true;
            getElId('_cMagicWandEdit_Resize').checked = typeof options[1] !== 'undefined' && options[1];

            for(var i = 0; i < getElId('_sMagicWandLandmark').options.length; i++) {
                if (getElId('_sMagicWandLandmark').options[i].value === options[2]) {
                    getElId('_sMagicWandLandmark').options[i].selected = true;
                    landmarkTypeSelected = true;
                    break;
                }
            }

            getElId('_cMagicWandSimilarity').value = typeof options[3] !== 'undefined' ? options[3] : 9;
            getElId('_cMagicWandSimplification').value = typeof options[4] !== 'undefined' ? options[4] : 4;
            getElId('_cMagicWandSampling').value = typeof options[5] !== 'undefined' ? options[5] : 3;
            getElId('_cMagicWandAngleThreshold').value = typeof options[6] !== 'undefined' ? options[6] : 12;
            getElId('_cMagicWandHighlight').checked = typeof options[7] !== 'undefined' && options[7];
            getElId('_cMagicWandConcavHull').value = typeof options[8] !== 'undefined' ? options[8] : 40;
            getElId('_cMagicWandStraightHelper').checked = typeof options[9] !== 'undefined' ? options[9] : true;
        }

        updateAdvancedEditing();
    }

    function registerKeyShortcut(action_name, annotation, callback, key_map) {
        W.accelerators.addAction(action_name, {group: 'default'});
        W.accelerators.events.register(action_name, null, callback);
        W.accelerators._registerShortcuts(key_map);
    }

    function saveWMEMagicWandOptions() {
        if (localStorage) {
            console.log("WME MagicWand: saving options");
            var options = [];

            // preserve previous options which may get lost after logout
            if (localStorage.WMEMagicWandScript)
                options = JSON.parse(localStorage.WMEMagicWandScript);

            options[0] = getElId('_cMagicWandEdit_Rotate').checked;
            options[1] = getElId('_cMagicWandEdit_Resize').checked;
            options[2] = getElId('_sMagicWandLandmark').value;
            options[3] = getElId('_cMagicWandSimilarity').value;
            options[4] = getElId('_cMagicWandSimplification').value;
            options[5] = getElId('_cMagicWandSampling').value;
            options[6] = getElId('_cMagicWandAngleThreshold').value;
            options[7] = getElId('_cMagicWandHighlight').checked;
            options[8] = getElId('_cMagicWandConcavHull').value;
            options[8] = getElId('_cMagicWandStraightHelper').checked;

            localStorage.WMEMagicWandScript = JSON.stringify(options);
        }
    }

    var onLandmarkSelect = function (e) {
        var mf = W.map.olMap.getControlsByClass('OpenLayers.Control.ModifyFeature')[0];
        console.log(mf);
        if (typeof mf === 'undefined') {
            setTimeout(onLandmarkSelect, 500);
            return;
        }

        insertLandmarkSelectedButtons(e);

        (function () {
            var mf = W.map.olMap.getControlsByClass('OpenLayers.Control.ModifyFeature')[0];
            if (typeof mf.wme_magicwand_helper !== 'undefined') {
                return;
            }

            mf.wme_magicwand_helper = true;

            var defaultOnStart = mf.dragStart;
            var defaultOnComplete = mf.dragComplete;

            // Reset helpers
            window.wme_magicwand_helpers = {
                isDragging: false,
                draggedNode: null,
                modifiedFeatureVertices: null,
                modifiedFeatureVirtualVertices: null,
                layer: null,
                snap: null
            };

            mf.dragStart = function (node, t) {
                window.wme_magicwand_helpers.modifiedFeatureVertices = mf.vertices.clone();
                window.wme_magicwand_helpers.modifiedFeatureVirtualVertices = mf.virtualVertices.clone();
                defaultOnStart(node, t);
                onVertexDrag(node);
            };
            mf.dragComplete = function (node) {
                defaultOnComplete(node);
                onVertexDragComplete();
            };
        })();
    };

    var insertLandmarkSelectedButtons = function(e)
    {
        if(W.selectionManager.getSelectedFeatures.length === 0 ||W.selectionManager.getSelectedFeatures()[0].model.type !== 'venue') return;
        if(getElId('_bMagicWandEdit_CloneLandmark') != null) return;

        $('#landmark-edit-general').prepend(
            '<div class="form-group"> \
              <label class="control-label">Advanced options</label> \
              <div class="controls"> \
                <input type="button" id="_bMagicWandEdit_CloneLandmark" name="_bMagicWandEdit_CloneLandmark" class="btn btn-default" value="Clone landmark" title="Ctrl+C (default)" /> \
                <input type="button" id="_bMagicWandEdit_Corners" name="_bMagicWandEdit_Corners" class="btn btn-default" value="Orthogonalize" title="Ctrl+X (default)"/><br/> \
                <input type="button" id="_bMagicWandEdit_Simplify" name="_bMagicWandEdit_Simplify" class="btn btn-default" value="Simplify" title="Ctrl+J (default)"/><br/> \
                <div class="controls-container"> \
                    <input type="checkbox" id="_cLandmarkMagicWandEdit_Rotate" name="_cLandmarkMagicWandEdit_Rotate" value="1" /><label for="_cLandmarkMagicWandEdit_Rotate">Enable Rotate</label>\
                </div>\
                <div class="controls-container"> \
                    <input type="checkbox" id="_cLandmarkWandEdit_Resize" name="_cLandmarkWandEdit_Resize" value="1" /><label for="_cLandmarkWandEdit_Resize">Enable Resize (no reshape)</label>\
                </div>\
              </div> \
            </div>'
        );

        getElId('_cLandmarkMagicWandEdit_Rotate').checked = getElId('_cMagicWandEdit_Rotate').checked;
        getElId('_cLandmarkWandEdit_Resize').checked = getElId('_cMagicWandEdit_Resize').checked;

        $('#_bMagicWandEdit_CloneLandmark').click(cloneLandmark);
        $('#_bMagicWandEdit_Corners').click(Orthogonalize);
        $('#_bMagicWandEdit_Simplify').click(simplifySelectedLandmark);
        $('#_cLandmarkWandEdit_Resize').change(function () {
            getElId('_cMagicWandEdit_Resize').checked = getElId('_cLandmarkWandEdit_Resize').checked;
            updateAdvancedEditing();
        });
        $('#_cLandmarkMagicWandEdit_Rotate').change(function () {
            getElId('_cMagicWandEdit_Rotate').checked = getElId('_cLandmarkMagicWandEdit_Rotate').checked;
            updateAdvancedEditing();
        });


        updateLandmarkControls();
    };

    var awaiting_controls = 0;
    var updateLandmarkControls = function () {
        var ModifyFeatureControl = W.geometryEditing.activeEditor;
        if (ModifyFeatureControl === null) {
            awaiting_controls++;

            // Waiting too long
            if (awaiting_controls > 10) {
                console.log('Something is broken, cannot locale active editor for far too long');
                return;
            }

            setTimeout(updateLandmarkControls, 500);
            return;
        }

        awaiting_controls = 0;

        // Reset modification mode
        ModifyFeatureControl.mode = OL.Control.ModifyFeature.RESHAPE | OL.Control.ModifyFeature.DRAG;

        if ($('#_cMagicWandEdit_Rotate').prop('checked')) {
            ModifyFeatureControl.mode |= OL.Control.ModifyFeature.ROTATE;
        }

        if ($('#_cMagicWandEdit_Resize').prop('checked')) {
            ModifyFeatureControl.mode |= OL.Control.ModifyFeature.RESIZE;
            ModifyFeatureControl.mode &= ~OL.Control.ModifyFeature.RESHAPE; // Do not allow changing the form, keep aspect ratio
        }

        ModifyFeatureControl.resetVertices();
    };

    var simplifySelectedLandmark = function () {
        var selectorManager = W.selectionManager;
        if (!selectorManager.hasSelectedItems() || selectorManager.selectedItems[0].model.type !== "venue" || !selectorManager.selectedItems[0].model.isGeometryEditable()) {
            return;
        }
        var simplifyFactor = $('#_cMagicWandSimplification').val();
        var SelectedLandmark = selectorManager.selectedItems[0];
        var oldGeometry = SelectedLandmark.geometry.clone();

        var LineString = new OL.Geometry.LineString(oldGeometry.components[0].components);
        LineString = LineString.simplify(simplifyFactor);
        var newGeometry = new OL.Geometry.Polygon(new OL.Geometry.LinearRing(LineString.components));

        if (newGeometry.components[0].components.length < oldGeometry.components[0].components.length) {
            var UpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
            W.model.actionManager.add(new UpdateFeatureGeometry(SelectedLandmark.model, W.model.venues, oldGeometry, newGeometry));
        }
    };

    var cloneLandmark = function () {
        var selectorManager = W.selectionManager;
        if (!selectorManager.hasSelectedItems() || selectorManager.selectedItems[0].model.type !== 'venue') {
            return;
        }

        var SelectedLandmark = selectorManager.selectedItems[0];
        var ClonedLandmark = SelectedLandmark.clone();
        ClonedLandmark.geometry.move(50, 50); // move to some offset
        ClonedLandmark.geometry.clearBounds();

        var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
        var wazeActionAddLandmark = require("Waze/Action/AddLandmark");

        var NewLandmark = new wazefeatureVectorLandmark();
        NewLandmark.geometry = ClonedLandmark.geometry;
        NewLandmark.attributes.categories = SelectedLandmark.model.attributes.categories;

        W.model.actionManager.add(new wazeActionAddLandmark(NewLandmark));
        selectorManager.select([NewLandmark]);
    };

    var Orthogonalize = function() {
        if (W.selectionManager.selectedItems.length <= 0 || W.selectionManager.selectedItems[0].model.type !== 'venue') {
            return;
        }

        var SelectedLandmark = W.selectionManager.selectedItems[0];

        var geom = SelectedLandmark.geometry.clone();
        var components = geom.components[0].components;
        var functor = new OrthogonalizeId(components);

        //if (!functor.isDisabled(components)) {
        //    window.alert('Unable to orthogonalize this polygon');
        //    return;
        //}

        var newWay = functor.action();
        var wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");

        var removeVertices = [];
        var undoGeometry = SelectedLandmark.geometry.clone();
        for (var i = 0; i < newWay.length; i++) {
            if (newWay[i] === false) {
                removeVertices.push(SelectedLandmark.geometry.components[0].components[i]);
            } else {
                SelectedLandmark.geometry.components[0].components[i].x = newWay[i].x;
                SelectedLandmark.geometry.components[0].components[i].y = newWay[i].y;
            }
        }

        if (removeVertices) {
            SelectedLandmark.geometry.components[0].removeComponents(removeVertices);
        }

        SelectedLandmark.geometry.components[0].clearBounds();

        var action = new wazeActionUpdateFeatureGeometry(SelectedLandmark.model, W.model.venues, undoGeometry, SelectedLandmark.geometry);
        W.model.actionManager.add(action);

        delete undoGeometry;
    };

    var highlightLandmarks = function () {
        if (!$('#_cMagicWandHighlight').prop('checked')) {
            return;
        }

        var geom, components, functor, newWay;

        for (var mark in W.model.venues.objects) {
            var SelectedLandmark = W.model.venues.get(mark);
            if (SelectedLandmark.isPoint()) {
                continue;
            }

            var poly = document.getElementById(SelectedLandmark.geometry.id);
            // check that WME hasn't highlighted this object already
            if (poly == null || mark.state == "Update" || SelectedLandmark.selected) {
              continue;
            }

            // if already highlighted by us or by WME Color Hightlight, avoid conflict and skip
            if (poly.getAttribute("stroke-opacity") == 0.987) {
              continue;
            }

            // if highlighted by mouse over, skip this one
            if (poly.getAttribute("fill") == poly.getAttribute("stroke")) {
              continue;
            }

            // flag this venue as highlighted so we don't update it next time
            poly.setAttribute("stroke-opacity", 0.987);

            geom = SelectedLandmark.geometry.clone();
            components = geom.components[0].components;
            functor = new OrthogonalizeId(components);

            newWay = functor.action();
            for (var i = 0; i < newWay.length; i++) {
                if (newWay[i] === false
                    || Math.abs(SelectedLandmark.geometry.components[0].components[i].x - newWay[i].x) > 2
                    || Math.abs(SelectedLandmark.geometry.components[0].components[i].y - newWay[i].y) > 2
                ) {
                    highlightAPlace(SelectedLandmark, '#FFC138', '#FFD38D');
                    break;
                }
            }
        }
    };

    // WME Color Highlights by Timbones
    function highlightAPlace(venue, fg, bg) {
        var poly = document.getElementById(venue.geometry.id);
        if (venue.isPoint()) {
            poly.setAttribute("fill", fg);
        }

        else { // area
            poly.setAttribute("stroke", fg);
            poly.setAttribute("fill", bg);
        }
    }

    var OrthogonalizeId = function (way) {
        var threshold = getElId('_cMagicWandAngleThreshold').value, // degrees within right or straight to alter
            lowerThreshold = Math.cos((90 - threshold) * Math.PI / 180),
            upperThreshold = Math.cos(threshold * Math.PI / 180);

        this.way = way;

        this.action = function () {
            var nodes = this.way,
                points = nodes.slice(0, nodes.length - 1).map(function (n) {
                    var t = n.clone();
                    var p = t.transform(new OL.Projection("EPSG:900913"), new OL.Projection("EPSG:4326"));
                    p.y = lat2latp(p.y);
                    return p;
                }),
                corner = {i: 0, dotp: 1},
                epsilon = 1e-4,
                i, j, score, motions;

            // Triangle
            if (nodes.length === 4) {
                for (i = 0; i < 1000; i++) {
                    motions = points.map(calcMotion);

                    var tmp = addPoints(points[corner.i], motions[corner.i]);
                    points[corner.i].x = tmp.x;
                    points[corner.i].y = tmp.y;

                    score = corner.dotp;
                    if (score < epsilon) {
                        break;
                    }
                }

                var n = points[corner.i];
                n.y = latp2lat(n.y);
                var pp = n.transform(new OL.Projection("EPSG:4326"), new OL.Projection("EPSG:900913"));

                var id = nodes[corner.i].id;
                for (i = 0; i < nodes.length; i++) {
                    if (nodes[i].id != id) {
                        continue;
                    }

                    nodes[i].x = pp.x;
                    nodes[i].y = pp.y;
                }

                return nodes;
            } else {
                var best,
                    originalPoints = nodes.slice(0, nodes.length - 1).map(function (n) {
                        var t = n.clone();
                        var p = t.transform(new OL.Projection("EPSG:900913"), new OL.Projection("EPSG:4326"));
                        p.y = lat2latp(p.y);
                        return p;
                    });
                    score = Infinity;

                for (i = 0; i < 1000; i++) {
                    motions = points.map(calcMotion);
                    for (j = 0; j < motions.length; j++) {
                        var tmp = addPoints(points[j], motions[j]);
                        points[j].x = tmp.x;
                        points[j].y = tmp.y;
                    }
                    var newScore = squareness(points);
                    if (newScore < score) {
                        best = points.clone();
                        score = newScore;
                    }
                    if (score < epsilon) {
                        break;
                    }
                }

                points = best;

                for (i = 0; i < points.length; i++) {
                    // only move the points that actually moved
                    if (originalPoints[i].x !== points[i].x || originalPoints[i].y !== points[i].y) {
                        var n = points[i];
                        n.y = latp2lat(n.y);
                        var pp = n.transform(new OL.Projection("EPSG:4326"), new OL.Projection("EPSG:900913"));

                        var id = nodes[i].id;
                        for (j = 0; j < nodes.length; j++) {
                            if (nodes[j].id != id) {
                                continue;
                            }

                            nodes[j].x = pp.x;
                            nodes[j].y = pp.y;
                        }
                    }
                }

                // remove empty nodes on straight sections
                for (i = 0; i < points.length; i++) {
                    var dotp = normalizedDotProduct(i, points);
                    if (dotp < -1 + epsilon) {
                        id = nodes[i].id;
                        for (j = 0; j < nodes.length; j++) {
                            if (nodes[j].id != id) {
                                continue;
                            }

                            nodes[j] = false;
                        }
                    }
                }

                return nodes;
            }

            function calcMotion(b, i, array) {
                var a = array[(i - 1 + array.length) % array.length],
                    c = array[(i + 1) % array.length],
                    p = subtractPoints(a, b),
                    q = subtractPoints(c, b),
                    scale, dotp;

                scale = 2 * Math.min(euclideanDistance(p, {x: 0, y: 0}), euclideanDistance(q, {x: 0, y: 0}));
                p = normalizePoint(p, 1.0);
                q = normalizePoint(q, 1.0);

                dotp = filterDotProduct(p.x * q.x + p.y * q.y);

                // nasty hack to deal with almost-straight segments (angle is closer to 180 than to 90/270).
                if (array.length > 3) {
                    if (dotp < -0.707106781186547) {
                        dotp += 1.0;
                    }
                } else if (dotp && Math.abs(dotp) < corner.dotp) {
                    corner.i = i;
                    corner.dotp = Math.abs(dotp);
                }

                return normalizePoint(addPoints(p, q), 0.1 * dotp * scale);
            }
        };

        function squareness(points) {
            return points.reduce(function (sum, val, i, array) {
                var dotp = normalizedDotProduct(i, array);

                dotp = filterDotProduct(dotp);
                return sum + 2.0 * Math.min(Math.abs(dotp - 1.0), Math.min(Math.abs(dotp), Math.abs(dotp + 1)));
            }, 0);
        }

        function normalizedDotProduct(i, points) {
            var a = points[(i - 1 + points.length) % points.length],
                b = points[i],
                c = points[(i + 1) % points.length],
                p = subtractPoints(a, b),
                q = subtractPoints(c, b);

            p = normalizePoint(p, 1.0);
            q = normalizePoint(q, 1.0);

            return p.x * q.x + p.y * q.y;
        }

        function subtractPoints(a, b) {
            return {x: a.x - b.x, y: a.y - b.y};
        }

        function addPoints(a, b) {
            return {x: a.x + b.x, y: a.y + b.y};
        }

        function euclideanDistance(a, b) {
            var x = a.x - b.x, y = a.y - b.y;
            return Math.sqrt((x * x) + (y * y));
        }

        function normalizePoint(point, scale) {
            var vector = {x: 0, y: 0};
            var length = Math.sqrt(point.x * point.x + point.y * point.y);
            if (length !== 0) {
                vector.x = point.x / length;
                vector.y = point.y / length;
            }

            vector.x *= scale;
            vector.y *= scale;

            return vector;
        }

        function filterDotProduct(dotp) {
            if (lowerThreshold > Math.abs(dotp) || Math.abs(dotp) > upperThreshold) {
                return dotp;
            }

            return 0;
        }

        this.isDisabled = function (nodes) {
            var points = nodes.slice(0, nodes.length - 1).map(function (n) {
                var p = n.toLonLat().transform(new OL.Projection("EPSG:900913"), new OL.Projection("EPSG:4326"));
                return {x: p.lat, y: p.lon};
            });

            return squareness(points);
        };
    };

    var updateAdvancedEditing = function ()
    {
        if ($('#_cMagicWandHighlight').prop('checked')) {
            window.setInterval(highlightLandmarks, 250);
        }

        updateLandmarkControls();

        // var selectorManager = W.selectionManager;
        // if (selectorManager.selectedItems.length > 0 && selectorManager.selectedItems[0].model.type === 'venue') {
        //     selectorManager.selectControl.select(selectorManager.selectedItems[0]);
        // }
    };


    var switchMagicWandStatus = function () {
        window.wme_magic_wand = !window.wme_magic_wand;
        var bgColor, status, btnText;
        if (window.wme_magic_wand) {
            bgColor = 'red';
            btnText = 'CLICK TO STOP MAGIC WAND';
            status = 'Waiting for click'
        } else {
            bgColor = 'green';
            btnText = 'CLICK TO START MAGIC WAND';
            status = 'Disabled'
        }

        $(this).css('background-color', bgColor);
        $(this).val(btnText);
        updateStatus(status);
    };

    function updateStatus(status) {
        $('#_sMagicWandStatus').html(status);
        $('#magicwand_common').hide().show();
    }

    function populateLandmarks() {
        var landmarkTypes = getElId('_sMagicWandLandmark');
        var translations = window.I18n.translations[window.I18n.currentLocale()].venues.categories;

        var filtered_translations = [];
        for (var id in translations) {
            if (!translations.hasOwnProperty(id)) {
                continue;
            }

            filtered_translations.push({
                type_id: id,
                type_name: translations[id]
            });
        }

        // Sorting by name
        filtered_translations = filtered_translations.sort(function (a, b) {
            return a.type_name.localeCompare(b.type_name);
        });

        for (var i = 0; i < filtered_translations.length; i++) {
            id = filtered_translations[i].type_id;
            var type = filtered_translations[i].type_name;

            var usrOption = document.createElement('option');
            var usrText = document.createTextNode(type);
            usrOption.setAttribute('value', id);
            usrOption.appendChild(usrText);
            landmarkTypes.appendChild(usrOption);
        }
    }

    function lat2latp(lat) {
        return 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * (Math.PI / 180) / 2));
    }

    function latp2lat(a) {
        return 180 / Math.PI * (2 * Math.atan(Math.exp(a * Math.PI / 180)) - Math.PI / 2);
    }

    function WMELandmarkMagicWand() {
        var W = window.W;

        var layer;

        var LatLon;
        var pixel;

        var canvas, draw_canvas, total_tiles, clickCanvasX, clickCanvasY, viewOffsetX, viewOffsetY;
        var context;

        var simplify_param;
        var color_sensitivity;
        var color_distance;
        var color_algorithm;
        var landmark_type;
        var concave_threshold;
        var sampling = 3;
        var detailing = 40;
        var waited_for = 0;
        var is_reload_tiles = true;

        W.map.events.register('moveend', map, function (e) {
            is_reload_tiles = true;
        });

        W.map.events.register('changebaselayer', map, function (e) {
            is_reload_tiles = true;
        });

        W.map.events.register('click', map, function (e) {
            if (!window.wme_magic_wand || window.wme_magic_wand_process) {
                return;
            }

            window.wme_magic_wand_process = true;
            $('#_bMagicWandProcessClick').attr("disabled", "disabled");

            // Get current active layer to process
            layer = null;
            var visible_layers = W.map.getLayersBy("visibility", true);
            for (var l = 0; l < visible_layers.length; l++) {
                if (true === visible_layers[l].isBaseLayer) {
                    layer = visible_layers[l];

                    $('#_sMagicWandUsedLayer').html(layer.name)
                    break;
                }
            }

            if (typeof layer == 'undefined') {
                resetProcessState();
                alert('Please make of the base layers active (default to Google)');
                return;
            }

            if (wme_magic_wand_debug) {
                console.log('WME MagicWand: layer selected', layer.name, layer);
            }

            simplify_param = parseInt(getElId('_cMagicWandSimplification').value);
            color_sensitivity = parseInt(getElId('_cMagicWandSimilarity').value);
            color_distance = parseInt(getElId('_cMagicWandSimilarity').value);
            color_algorithm = getElId("_rMagicWandColorAlgorithm_lab").checked ? "LAB" : "sensitivity";
            landmark_type = getElId("_sMagicWandLandmark").options[getElId("_sMagicWandLandmark").selectedIndex].value;
            concave_threshold = parseFloat(getElId('_cMagicWandSimplification').value);
            sampling = parseInt(getElId('_cMagicWandSampling').value);
            detailing = parseInt(getElId('_cMagicWandConcavHull').value);

            if (wme_magic_wand_debug) {
                console.log('WME MagicWand algorithm:', color_algorithm);
                console.log('WME MagicWand sensitivity:', color_sensitivity);
                console.log('WME MagicWand simplification:', simplify_param);
                console.log('WME MagicWand landmark type:', landmark_type);
                console.log('WME MagicWand sampling mask size:', sampling);
                console.log('WME MagicWand concave hull detailing:', detailing);
            }

            pixel = e.xy;
            LatLon = W.map.getLonLatFromPixel(pixel);

            if (wme_magic_wand_debug) {
                console.log('WME MagicWand: click event', e);
                console.log('WME MagicWand: click event XY', e.xy, ', in map coords', LatLon);
            }

            var tile_size = layer.grid[0][0].size;

            if (wme_magic_wand_debug) {
                console.log('WME MagicWand: grid size in pixels', tile_size);
            }

            updateStatus('Creating canvas');

            if (typeof canvas != 'undefined' && typeof context != 'undefined') {
                if (is_reload_tiles) {
                    canvas.width = tile_size.h * layer.grid[0].length;
                    canvas.height = tile_size.w * layer.grid.length;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
            } else {
                canvas = $('<canvas/>')[0];
                canvas.width = tile_size.h * layer.grid[0].length;
                canvas.height = tile_size.w * layer.grid.length;
                context = canvas.getContext('2d');
            }

            if (typeof draw_canvas == 'undefined') {
                draw_canvas = $('<canvas/>')[0];
            }

            draw_canvas.width = canvas.width;
            draw_canvas.height = canvas.height;

            if (wme_magic_wand_debug) {
                $('body').append(draw_canvas);
            }

            total_tiles = layer.grid.length * layer.grid[0].length;
            waited_for = 0;

            if (wme_magic_wand_debug) {
                console.log('WME MagicWand: total tiles in grid', total_tiles);
                console.log('WME MagicWand: canvas', canvas);
                console.log('WME MagicWand: context', context);
            }


            var clientX, clientY;
            var offsetX, offsetY;
            var imageX, imageY;
            var tile, img, location;

            updateStatus('Pre-processing tiles');
            if (wme_magic_wand_debug) {
                console.log('WME MagicWand: trying to load tiles');
            }

            for (var tilerow = 0; tilerow < layer.grid.length; tilerow++) {
                for (var tilei = 0; tilei < layer.grid[tilerow].length; tilei++) {
                    tile = layer.grid[tilerow][tilei];

                    if (tile.bounds.containsLonLat(LatLon, false)) {
                        // Click position on div image
                        clientX = e.pageX;
                        clientY = e.pageY;

                        offsetX = $(tile.imgDiv).offset().left;
                        offsetY = $(tile.imgDiv).offset().top;

                        imageX = clientX - offsetX;
                        imageY = clientY - offsetY;

                        clickCanvasX = tile_size.w * tilei + imageX;
                        clickCanvasY = tile_size.h * tilerow + imageY;

                        viewOffsetX = pixel.x - clickCanvasX;
                        viewOffsetY = pixel.y - clickCanvasY;
                    }

                    // No need to reload tiles
                    if (!is_reload_tiles && !($('img[data-default_url]').length > 0 && $('img[data-coords]').length > 0)) {
                        continue;
                    }

                    updateStatus('Loading tiles');

                    // Have to recreate image - image should have crossOrigin attribute set to "anonymous"
                    img = $('<img/>')[0];
                    $(img).data('tilei', tilei)
                        .data('tilerow', tilerow)
                        .attr('crossOrigin', 'anonymous');

                    img.onload = function () {
                        var img = this;
                        var tilei = $(img).data('tilei');
                        var tilerow = $(img).data('tilerow');

                        // Add tile to canvas
                        context.drawImage(img, tile_size.w * tilei, tile_size.h * tilerow, img.width, img.height);

                        total_tiles--;
                    };

                    img.onerror = function (e) {
                        console.log('WME MagicWand: Cannot load tile: ', e);
                    };

                    var img_url = tile.url;
                    // Experimental support for Map Overlays extension
                    // DO NOT USE FOR EDITS
                    var alt_img = $('img[data-default_url="' + img_url +'"]');
                    if (alt_img.length > 0) {
                        img_url = alt_img[0].src;
                    }

                    location = getLocation(img_url);
                    img.src = img_url + (typeof location.search == 'undefined' || location.search == '' ? '?' : '&') + 'dummy=wmemagicwand';
                }
            }

            if (is_reload_tiles) {
                waitForLoad();
            } else {
                process();
            }

        });

        function waitForLoad() {
            waited_for++;
            if (total_tiles > 0) {
                if (waited_for > 25) {
                    alert('Waiting too long for tiles to be reloaded, tiles left to load: ' + total_tiles);
                    resetProcessState();
                    return;
                }

                window.setTimeout(waitForLoad, 200);
            } else {
                is_reload_tiles = false;
                process();
            }
        }

        function getPixelInfo(canvas_data, x, y) {
            var offset = (y * canvas.width + x) * 4;
            return [canvas_data[offset], canvas_data[offset + 1 ], canvas_data[offset + 2], canvas_data[offset + 3]];
        }

        function getPixelAverageSample(canvas_data, x, y) {
            var sample_info;
            var average = [0, 0, 0, 0];
            var total_samples = 0;
            for (var xi = x - sampling; xi < x + sampling; xi++) {
                for (var yi = y - sampling; yi < y + sampling; yi++) {
                    if (xi < 0 || yi < 0 || xi >= canvas.width || yi >= canvas.height) {
                        continue;
                    }

                    total_samples++;
                    sample_info = getPixelInfo(canvas_data, xi, yi);

                    average[0] += sample_info[0];
                    average[1] += sample_info[1];
                    average[2] += sample_info[2];
                    average[3] += sample_info[3];
                }
            }

            return [average[0] / total_samples, average[1] / total_samples, average[2] / total_samples, average[3] / total_samples];
        }

        function process() {
            var canvas_data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            var ref_pixel = getPixelInfo(canvas_data, clickCanvasX, clickCanvasY);

            if (wme_magic_wand_debug) {
                console.log('WME MagicWand: clicked pixel data', ref_pixel);
            }

            var draw_canvas_context = draw_canvas.getContext('2d');
            draw_canvas_context.drawImage(canvas, 0, 0);

            $('#_dMagicWandColorpicker').css('background-color', 'rgb(' + ref_pixel[0] + ',' + ref_pixel[1] + ',' + ref_pixel[2] + ')');
            $('#magicwand_common').hide().show();

            var current_pixel;
            var processed_pixels = [];
            var polyPixels = [];
            var g = 0;
            var minX = Number.MAX_VALUE;
            var first_pixel = null;

            var stack = [
                [clickCanvasX, clickCanvasY]
            ];

            var x, y, c_pixel, r;
            var viewX, viewY;

            updateStatus('Processing tiles image');

            var id = draw_canvas_context.createImageData(1, 1);
            var d = id.data;
            d[0] = 255;
            d[1] = 0;
            d[2] = 0;
            d[3] = 255; // red

            while (stack.length > 0 && g < 1500000) {
                g++;
                current_pixel = stack.pop();

                // Already processed before
                if (typeof processed_pixels[current_pixel[0] + ',' + current_pixel[1]] != 'undefined') {
                    continue;
                } else {
                    processed_pixels[current_pixel[0] + ',' + current_pixel[1]] = true;
                }

                if (current_pixel[0] < 0 || current_pixel[0] >= canvas.width)
                    continue;
                if (current_pixel[1] < 0 || current_pixel[1] >= canvas.height)
                    continue;

                x = current_pixel[0];
                y = current_pixel[1];
                c_pixel = getPixelAverageSample(canvas_data, x, y);

                if ((color_algorithm == 'sensitivity' && !colorDistance(c_pixel, ref_pixel)) ||
                    (color_algorithm == 'LAB' && calcColorDistance(c_pixel, ref_pixel) > color_distance)) {

                    viewX = x + viewOffsetX;
                    viewY = y + viewOffsetY;

                    if (viewX < minX) {
                        minX = viewX;
                        first_pixel = [viewX, viewY];
                    } else if (viewX == minX && viewY < first_pixel[1]) {
                        first_pixel = [viewX, viewY];
                    }

                    // Outer pixel found
                    polyPixels.push([viewX, viewY]);

                    if (wme_magic_wand_debug) {
                        // Drawing outer border
                        draw_canvas_context.putImageData(id, x, y);
                    }
                } else {
                    // Inner point, add neighboring points to the stack
                    if (wme_magic_wand_debug) {
                        draw_canvas_context.putImageData(id, x, y);
                    }

                    if (typeof processed_pixels[(current_pixel[0] - 1) + ',' + current_pixel[1]] == 'undefined') {
                        stack.push([
                            current_pixel[0] - 1,
                            current_pixel[1]
                        ]);
                    }

                    if (typeof processed_pixels[(current_pixel[0] + 1) + ',' + current_pixel[1]] == 'undefined') {
                        stack.push([
                            current_pixel[0] + 1,
                            current_pixel[1]
                        ]);
                    }

                    if (typeof processed_pixels[(current_pixel[0]) + ',' + current_pixel[1] - 1] == 'undefined') {
                        stack.push([
                            current_pixel[0],
                            current_pixel[1] - 1
                        ]);
                    }

                    if (typeof processed_pixels[(current_pixel[0]) + ',' + current_pixel[1] + 1] == 'undefined') {
                        stack.push([
                            current_pixel[0],
                            current_pixel[1] + 1
                        ]);
                    }

                    // Experimental: with diagonal pixels
                    if (typeof processed_pixels[(current_pixel[0] + 1) + ',' + current_pixel[1] + 1] == 'undefined') {
                        stack.push([
                            current_pixel[0],
                            current_pixel[1] + 1
                        ]);
                    }
                    if (typeof processed_pixels[(current_pixel[0] + 1) + ',' + current_pixel[1] - 1] == 'undefined') {
                        stack.push([
                            current_pixel[0],
                            current_pixel[1] + 1
                        ]);
                    }
                    if (typeof processed_pixels[(current_pixel[0] - 1) + ',' + current_pixel[1] + 1] == 'undefined') {
                        stack.push([
                            current_pixel[0],
                            current_pixel[1] + 1
                        ]);
                    }
                    if (typeof processed_pixels[(current_pixel[0] - 1) + ',' + current_pixel[1] - 1] == 'undefined') {
                        stack.push([
                            current_pixel[0],
                            current_pixel[1] + 1
                        ]);
                    }
                }
            }

            if (wme_magic_wand_debug) {
                console.log('WME MagicWand: iterations done (should be way less than 1,000,000)', g);
                console.log('WME MagicWand: non-processed pixels left (should be 0)', stack.length);
                console.log('WME MagicWand: pixels processed', Object.keys(processed_pixels).length);
                console.log('WME MagicWand: Found pixels (should be way more than 3)', polyPixels.length);
            }

            // Clear unnecessary data
            processed_pixels = [];
            current_pixel = [];
            canvas_data = [];

            if (polyPixels.length > 2) {
                updateStatus('Computing convex hull');

                var points = [];
                for (var j = 0; j < polyPixels.length; j++) {
                    points.push(new Point(polyPixels[j][0], polyPixels[j][1]));
                }

                var convolutionHull = hull(points, 40, ['.x', '.y']);
                createLandmark(convolutionHull, simplify_param);
            } else {
                points = [];
                resetProcessState('Please, try again, no useful points found');
                return;
            }

            points = [];
            resetProcessState();
        }

        function resetProcessState(status_msg) {
            status_msg = typeof status_msg == 'string' ? status_msg : 'Waiting for click';

            window.wme_magic_wand_process = false;
            $('#_bMagicWandProcessClick').removeAttr("disabled");
            updateStatus(status_msg);
        }

        function colorDistance(c_pixel, ref_pixel) {
            return (Math.abs(c_pixel[0] - ref_pixel[0]) <= color_sensitivity &&
                Math.abs(c_pixel[1] - ref_pixel[1]) <= color_sensitivity &&
                Math.abs(c_pixel[2] - ref_pixel[2]) <= color_sensitivity &&
                Math.abs(c_pixel[3] - ref_pixel[3]) <= color_sensitivity);
        }

        function createLandmark(points, simplify) {
            var polyPoints = [];
            var o, point_lonlat;

            for (var k = 0; k < points.length; k++) {
                o = points[k];
                point_lonlat = W.map.getLonLatFromPixel(new OL.Pixel(o.x, o.y));
                polyPoints.push(new OL.Geometry.Point(point_lonlat.lon, point_lonlat.lat));
            }

            var LineString = new OL.Geometry.LineString(polyPoints);
            if (simplify > 0) {
                LineString = LineString.simplify(simplify);
            }

            var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
            var wazeActionAddLandmark = require("Waze/Action/AddLandmark");

            var polygon = new OL.Geometry.Polygon(new OL.Geometry.LinearRing(LineString.components));
            var landmark = new wazefeatureVectorLandmark();
            landmark.geometry = polygon;
            landmark.attributes.categories = [landmark_type];

            W.model.actionManager.add(new wazeActionAddLandmark(landmark));
        }

        //
        // Human-eye Similarity algorithm below
        //

        function calcColorDistance(c_pixel, r_pixel) {
            var xyz = rgbToXyz(c_pixel[0], c_pixel[1], c_pixel[2]);
            var lab = xyzToLab(xyz[0], xyz[1], xyz[2]);

            xyz = rgbToXyz(r_pixel[0], r_pixel[1], r_pixel[2]);
            var target_lab = xyzToLab(xyz[0], xyz[1], xyz[2]);

            return cie1994(lab, target_lab, false);

//    return Math.sqrt(Math.pow(c_pixel[0] - r_pixel[0], 2) + Math.pow(c_pixel[1] - r_pixel[1], 2) + Math.pow(c_pixel[2] - r_pixel[2], 2));
        }

// Convert RGB to XYZ
        function rgbToXyz(r, g, b) {
            var _r = (r / 255);
            var _g = (g / 255);
            var _b = (b / 255);

            if (_r > 0.04045) {
                _r = Math.pow(((_r + 0.055) / 1.055), 2.4);
            }
            else {
                _r = _r / 12.92;
            }

            if (_g > 0.04045) {
                _g = Math.pow(((_g + 0.055) / 1.055), 2.4);
            }
            else {
                _g = _g / 12.92;
            }

            if (_b > 0.04045) {
                _b = Math.pow(((_b + 0.055) / 1.055), 2.4);
            }
            else {
                _b = _b / 12.92;
            }

            _r = _r * 100;
            _g = _g * 100;
            _b = _b * 100;

            X = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
            Y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
            Z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;

            return [X, Y, Z];
        }

// Convert XYZ to LAB
        function xyzToLab(x, y, z) {
            var ref_X = 95.047;
            var ref_Y = 100.000;
            var ref_Z = 108.883;

            var _X = x / ref_X;
            var _Y = y / ref_Y;
            var _Z = z / ref_Z;

            if (_X > 0.008856) {
                _X = Math.pow(_X, (1 / 3));
            }
            else {
                _X = (7.787 * _X) + (16 / 116);
            }

            if (_Y > 0.008856) {
                _Y = Math.pow(_Y, (1 / 3));
            }
            else {
                _Y = (7.787 * _Y) + (16 / 116);
            }

            if (_Z > 0.008856) {
                _Z = Math.pow(_Z, (1 / 3));
            }
            else {
                _Z = (7.787 * _Z) + (16 / 116);
            }

            var CIE_L = (116 * _Y) - 16;
            var CIE_a = 500 * (_X - _Y);
            var CIE_b = 200 * (_Y - _Z);

            return [CIE_L, CIE_a, CIE_b];
        }

        function getLocation(href) {
            var l = document.createElement("a");
            l.href = href;
            return l;
        }

// Finally, use cie1994 to get delta-e using LAB
        function cie1994(x, y, isTextiles) {
            var x = {l: x[0], a: x[1], b: x[2]};
            var y = {l: y[0], a: y[1], b: y[2]};
            labx = x;
            laby = y;
            var k2;
            var k1;
            var kl;
            var kh = 1;
            var kc = 1;
            if (isTextiles) {
                k2 = 0.014;
                k1 = 0.048;
                kl = 2;
            } else {
                k2 = 0.015;
                k1 = 0.045;
                kl = 1;
            }

            var c1 = Math.sqrt(x.a * x.a + x.b * x.b);
            var c2 = Math.sqrt(y.a * y.a + y.b * y.b);

            var sh = 1 + k2 * c1;
            var sc = 1 + k1 * c1;
            var sl = 1;

            var da = x.a - y.a;
            var db = x.b - y.b;
            var dc = c1 - c2;

            var dl = x.l - y.l;
            var dh = Math.sqrt(da * da + db * db - dc * dc);

            return Math.sqrt(Math.pow((dl / (kl * sl)), 2) + Math.pow((dc / (kc * sc)), 2) + Math.pow((dh / (kh * sh)), 2));
        }

        // intersect.js
        function ccw(x1, y1, x2, y2, x3, y3) {
            var cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));
            return cw > 0 ? true : cw < 0 ? false : true; // colinear
        }

        function intersect(seg1, seg2) {
          var x1 = seg1[0][0], y1 = seg1[0][1],
              x2 = seg1[1][0], y2 = seg1[1][1],
              x3 = seg2[0][0], y3 = seg2[0][1],
              x4 = seg2[1][0], y4 = seg2[1][1];

            return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) && ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
        }

        // grid.js
        function Grid(points, cellSize) {
            this._cells = [];
            this._cellSize = cellSize;

            points.forEach(function(point) {
                var cellXY = this.point2CellXY(point),
                    x = cellXY[0],
                    y = cellXY[1];
                if (this._cells[x] === undefined) {
                    this._cells[x] = [];
                }
                if (this._cells[x][y] === undefined) {
                    this._cells[x][y] = [];
                }
                this._cells[x][y].push(point);
            }, this);
        }

        Grid.prototype = {
            cellPoints: function(x, y) { // (Number, Number) -> Array
                return (this._cells[x] !== undefined && this._cells[x][y] !== undefined) ? this._cells[x][y] : [];
            },

            rangePoints: function(bbox) { // (Array) -> Array
                var tlCellXY = this.point2CellXY([bbox[0], bbox[1]]),
                    brCellXY = this.point2CellXY([bbox[2], bbox[3]]),
                    points = [];

                for (var x = tlCellXY[0]; x <= brCellXY[0]; x++) {
                    for (var y = tlCellXY[1]; y <= brCellXY[1]; y++) {
                        points = points.concat(this.cellPoints(x, y));
                    }
                }

                return points;
            },

            removePoint: function(point) { // (Array) -> Array
                var cellXY = this.point2CellXY(point),
                    cell = this._cells[cellXY[0]][cellXY[1]],
                    pointIdxInCell;

                for (var i = 0; i < cell.length; i++) {
                    if (cell[i][0] === point[0] && cell[i][1] === point[1]) {
                        pointIdxInCell = i;
                        break;
                    }
                }

                cell.splice(pointIdxInCell, 1);

                return cell;
            },

            point2CellXY: function(point) { // (Array) -> Array
                var x = parseInt(point[0] / this._cellSize),
                    y = parseInt(point[1] / this._cellSize);
                return [x, y];
            },

            extendBbox: function(bbox, scaleFactor) { // (Array, Number) -> Array
                return [
                    bbox[0] - (scaleFactor * this._cellSize),
                    bbox[1] - (scaleFactor * this._cellSize),
                    bbox[2] + (scaleFactor * this._cellSize),
                    bbox[3] + (scaleFactor * this._cellSize)
                ];
            }
        };

        function grid(points, cellSize) {
            return new Grid(points, cellSize);
        }

        // format.js
        formatUtil = {

            toXy: function(pointset, format) {
                if (format === undefined) {
                    return pointset.slice();
                }
                return pointset.map(function(pt) {
                    /*jslint evil: true */
                    var _getXY = new Function('pt', 'return [pt' + format[0] + ',' + 'pt' + format[1] + '];');
                    return _getXY(pt);
                });
            },

            fromXy: function(pointset, format) {
                if (format === undefined) {
                    return pointset.slice();
                }
                return pointset.map(function(pt) {
                    /*jslint evil: true */
                    var _getObj = new Function('pt', 'var o = {}; o' + format[0] + '= pt[0]; o' + format[1] + '= pt[1]; return o;');
                    return _getObj(pt);
                });
            }

        };

        // convex.js
        function _cross(o, a, b) {
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        }

        function _upperTangent(pointset) {
            var lower = [];
            for (var l = 0; l < pointset.length; l++) {
                while (lower.length >= 2 && (_cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0)) {
                    lower.pop();
                }
                lower.push(pointset[l]);
            }
            lower.pop();
            return lower;
        }

        function _lowerTangent(pointset) {
            var reversed = pointset.reverse(),
                upper = [];
            for (var u = 0; u < reversed.length; u++) {
                while (upper.length >= 2 && (_cross(upper[upper.length - 2], upper[upper.length - 1], reversed[u]) <= 0)) {
                    upper.pop();
                }
                upper.push(reversed[u]);
            }
            upper.pop();
            return upper;
        }

        // pointset has to be sorted by X
        function convex(pointset) {
            var convex,
                upper = _upperTangent(pointset),
                lower = _lowerTangent(pointset);
            convex = lower.concat(upper);
            convex.push(pointset[0]);
            return convex;
        }

        // hull.js

        function _filterDuplicates(pointset) {
            return pointset.filter(function(el, idx, arr) {
                var prevEl = arr[idx - 1];
                return idx === 0 || !(prevEl[0] === el[0] && prevEl[1] === el[1]);
            });
        }

        function _sortByX(pointset) {
            return pointset.sort(function(a, b) {
                if (a[0] == b[0]) {
                    return a[1] - b[1];
                } else {
                    return a[0] - b[0];
                }
            });
        }

        function _sqLength(a, b) {
            return Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2);
        }

        function _cos(o, a, b) {
            var aShifted = [a[0] - o[0], a[1] - o[1]],
                bShifted = [b[0] - o[0], b[1] - o[1]],
                sqALen = _sqLength(o, a),
                sqBLen = _sqLength(o, b),
                dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];

            return dot / Math.sqrt(sqALen * sqBLen);
        }

        function _intersect(segment, pointset) {
            for (var i = 0; i < pointset.length - 1; i++) {
                var seg = [pointset[i], pointset[i + 1]];
                if (segment[0][0] === seg[0][0] && segment[0][1] === seg[0][1] ||
                    segment[0][0] === seg[1][0] && segment[0][1] === seg[1][1]) {
                    continue;
                }
                if (intersect(segment, seg)) {
                    return true;
                }
            }
            return false;
        }

        function _occupiedArea(pointset) {
            var minX = Infinity,
                minY = Infinity,
                maxX = -Infinity,
                maxY = -Infinity;

            for (var i = pointset.length - 1; i >= 0; i--) {
                if (pointset[i][0] < minX) {
                    minX = pointset[i][0];
                }
                if (pointset[i][1] < minY) {
                    minY = pointset[i][1];
                }
                if (pointset[i][0] > maxX) {
                    maxX = pointset[i][0];
                }
                if (pointset[i][1] > maxY) {
                    maxY = pointset[i][1];
                }
            }

            return [
                maxX - minX, // width
                maxY - minY  // height
            ];
        }

        function _bBoxAround(edge) {
            return [
                Math.min(edge[0][0], edge[1][0]), // left
                Math.min(edge[0][1], edge[1][1]), // top
                Math.max(edge[0][0], edge[1][0]), // right
                Math.max(edge[0][1], edge[1][1])  // bottom
            ];
        }

        function _midPoint(edge, innerPoints, convex) {
            var point = null,
                angle1Cos = MAX_CONCAVE_ANGLE_COS,
                angle2Cos = MAX_CONCAVE_ANGLE_COS,
                a1Cos, a2Cos;

            for (var i = 0; i < innerPoints.length; i++) {
                a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
                a2Cos = _cos(edge[1], edge[0], innerPoints[i]);

                if (a1Cos > angle1Cos && a2Cos > angle2Cos &&
                    !_intersect([edge[0], innerPoints[i]], convex) &&
                    !_intersect([edge[1], innerPoints[i]], convex)) {

                    angle1Cos = a1Cos;
                    angle2Cos = a2Cos;
                    point = innerPoints[i];
                }
            }

            return point;
        }

        function _concave(convex, maxSqEdgeLen, maxSearchArea, grid, edgeSkipList) {
            var edge,
                keyInSkipList,
                scaleFactor,
                midPoint,
                bBoxAround,
                bBoxWidth,
                bBoxHeight,
                midPointInserted = false;

            for (var i = 0; i < convex.length - 1; i++) {
                edge = [convex[i], convex[i + 1]];
                keyInSkipList = edge[0].join() + ',' + edge[1].join();

                if (_sqLength(edge[0], edge[1]) < maxSqEdgeLen ||
                    edgeSkipList[keyInSkipList] === true) { continue; }

                scaleFactor = 0;
                bBoxAround = _bBoxAround(edge);
                do {
                    bBoxAround = grid.extendBbox(bBoxAround, scaleFactor);
                    bBoxWidth = bBoxAround[2] - bBoxAround[0];
                    bBoxHeight = bBoxAround[3] - bBoxAround[1];

                    midPoint = _midPoint(edge, grid.rangePoints(bBoxAround), convex);
                    scaleFactor++;
                }  while (midPoint === null && (maxSearchArea[0] > bBoxWidth || maxSearchArea[1] > bBoxHeight));

                if (bBoxWidth >= maxSearchArea[0] && bBoxHeight >= maxSearchArea[1]) {
                    edgeSkipList[keyInSkipList] = true;
                }

                if (midPoint !== null) {
                    convex.splice(i + 1, 0, midPoint);
                    grid.removePoint(midPoint);
                    midPointInserted = true;
                }
            }

            if (midPointInserted) {
                return _concave(convex, maxSqEdgeLen, maxSearchArea, grid, edgeSkipList);
            }

            return convex;
        }

        function hull(pointset, concavity, format) {
            var convex1,
                concave,
                innerPoints,
                occupiedArea,
                maxSearchArea,
                cellSize,
                points,
                maxEdgeLen = concavity || 20;

            if (pointset.length < 4) {
                return pointset.slice();
            }

            points = _filterDuplicates(_sortByX(formatUtil.toXy(pointset, format)));

            occupiedArea = _occupiedArea(points);
            maxSearchArea = [
                occupiedArea[0] * MAX_SEARCH_BBOX_SIZE_PERCENT,
                occupiedArea[1] * MAX_SEARCH_BBOX_SIZE_PERCENT
            ];

            convex1 = convex(points);
            innerPoints = points.filter(function(pt) {
                return convex1.indexOf(pt) < 0;
            });

            cellSize = Math.ceil(1 / (points.length / (occupiedArea[0] * occupiedArea[1])));

            concave = _concave(
                convex1, Math.pow(maxEdgeLen, 2),
                maxSearchArea, grid(innerPoints, cellSize), {});

            return formatUtil.fromXy(concave, format);
        }

        var MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
        var MAX_SEARCH_BBOX_SIZE_PERCENT = 0.6;
    }

    // Point class
    function Point(x, y) {
        this.x = x;
        this.y = y;

        this.toString = function () {
            return "x: " + x + ", y: " + y;
        };
        this.rotateRight = function (p1, p2) {
            // cross product, + is counterclockwise, - is clockwise
            return ((p2.x * y - p2.y * x) - (p1.x * y - p1.y * x) + (p1.x * p2.y - p1.y * p2.x)) < 0;
        };
    }

    Point.prototype.add = function(v){
        return new Point(this.x + v.x, this.y + v.y);
    };
    Point.prototype.clone = function(){
        return new Point(this.x, this.y);
    };
    Point.prototype.degreesTo = function(v){
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var angle = Math.atan2(dy, dx); // radians
        return angle * (180 / Math.PI); // degrees
    };
    Point.prototype.distance = function(v){
        var x = this.x - v.x;
        var y = this.y - v.y;
        return Math.sqrt(x * x + y * y);
    };
    Point.prototype.equals = function(toCompare){
        return this.x == toCompare.x && this.y == toCompare.y;
    };
    Point.prototype.interpolate = function(v, f){
        return new Point((this.x + v.x) * f, (this.y + v.y) * f);
    };
    Point.prototype.length = function(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Point.prototype.normalize = function(thickness){
        var l = this.length();
        this.x = this.x / l * thickness;
        this.y = this.y / l * thickness;
    };
    Point.prototype.orbit = function(origin, arcWidth, arcHeight, degrees){
        var radians = degrees * (Math.PI / 180);
        this.x = origin.x + arcWidth * Math.cos(radians);
        this.y = origin.y + arcHeight * Math.sin(radians);
    };
    Point.prototype.offset = function(dx, dy){
        this.x += dx;
        this.y += dy;
    };
    Point.prototype.subtract = function(v){
        return new Point(this.x - v.x, this.y - v.y);
    };
    Point.prototype.toString = function(){
        return "(x=" + this.x + ", y=" + this.y + ")";
    };

    Point.interpolate = function(pt1, pt2, f){
        return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
    };
    Point.polar = function(len, angle){
        return new Point(len * Math.cos(angle), len * Math.sin(angle));
    };
    Point.distance = function(pt1, pt2){
        var x = pt1.x - pt2.x;
        var y = pt1.y - pt2.y;
        return Math.sqrt(x * x + y * y);
    };

    var onVertexDrag = function (dragged_node) {
        window.wme_magicwand_helpers.isDragging = true;
        window.wme_magicwand_helpers.draggedNode = dragged_node;

        if (window.event.shiftKey && window.wme_magicwand_helpers.isDragging) {
            startOrthogonalHelper(dragged_node);
        }
    };

    var onVertexDragComplete = function () {
        window.wme_magicwand_helpers.isDragging = false;
        window.wme_magicwand_helpers.draggedNode = null;
        window.wme_magicwand_helpers.modifiedFeatureVertices = null;
        window.wme_magicwand_helpers.modifiedFeatureVirtualVertices = null;
        stopOrthogonalHelper();
    };

    var onKeyDown = function () {
        if (getElId('_cMagicWandStraightHelper').checked && window.event.keyCode === 16 && window.wme_magicwand_helpers.isDragging) {
            startOrthogonalHelper();
        }
    };

    var onKeyUp = function () {
        // Shift key
        if (getElId('_cMagicWandStraightHelper').checked && window.event.keyCode === 16) {
            stopOrthogonalHelper();
        }
    };

    var startOrthogonalHelper = function () {
        var dragged_node = window.wme_magicwand_helpers.draggedNode;

        var components = window.wme_magicwand_helpers.modifiedFeatureVertices;
        var indexOf = null;

        // If dragged node is a real node
        for (var i = 0; i < components.length; i++) {
            if (components[i] === dragged_node) {
                indexOf = i;
                break;
            }
        }

        var prevPointIndex, nextPointIndex;

        // debugger;

        // Maybe we're dragging a new node?
        if (indexOf === null) {
            for (i = 0; i < window.wme_magicwand_helpers.modifiedFeatureVirtualVertices.length; i++) {
                if (window.wme_magicwand_helpers.modifiedFeatureVirtualVertices[i] === dragged_node) {
                    indexOf = i;
                    break;
                }
            }

            if (indexOf !== null) {
                prevPointIndex = indexOf;
                nextPointIndex = indexOf < components.length - 1 ? indexOf + 1 : 0;
            }
        } else {
            prevPointIndex = indexOf > 0 ? indexOf - 1 : components.length - 1;
            nextPointIndex = indexOf < components.length - 1 ? indexOf + 1 : 0;
        }

        if (indexOf === null) {
            console.log('Now that is strange, dragged node not found in vertices');
            return;
        }

        var centerPoint = new OL.Geometry.Point((components[nextPointIndex].geometry.x + components[prevPointIndex].geometry.x) / 2, (components[nextPointIndex].geometry.y + components[prevPointIndex].geometry.y) / 2);
        var radius = Math.sqrt(Math.pow(components[nextPointIndex].geometry.x - components[prevPointIndex].geometry.x, 2) + Math.pow(components[nextPointIndex].geometry.y - components[prevPointIndex].geometry.y, 2)) / 2;

        // Create helper layer and snapping control
        var helperLayer = new OL.Layer.Vector('WMEMagicwand_Helper');
        W.map.addLayer(helperLayer);

        var snap = new OL.Control.Snapping({
            layer: W.map.landmarkLayer,
            targets: [{
                layer: helperLayer,
                tolerance: 25
            }]
        });
        snap.activate();

        helperLayer.addFeatures(new OL.Feature.Vector(OpenLayers.Geometry.Polygon.createRegularPolygon(centerPoint, radius, 500, 0)));

        window.wme_magicwand_helpers.snap = snap;
        window.wme_magicwand_helpers.layer = helperLayer;
    };

    var stopOrthogonalHelper = function () {
        var helpers = window.wme_magicwand_helpers;
        if (!helpers.layer || !helpers.snap) {
            return;
        }

        var layers = W.map.getLayersByName('WMEMagicwand_Helper');
        for (var i = 0; i < layers.length; i++) {
            var l = layers[i];

            l.removeAllFeatures();
            W.map.removeLayer(l);
            l.destroy();
        }

        helpers.snap.deactivate();
        helpers.snap.destroy();

        helpers.snap = null;
        helpers.layer = null;
    };

    /* engage! =================================================================== */
    bootstraMagicWand();
}

/* end ======================================================================= */

// ############################################################################################################################################################
//
// dummyd2's require() patch, modified to perform native require() detection for beta compatibility...
//
//{
if(typeof require === "undefined")
{
   var WMEAPI = {};
   WMEAPI.scripts = document.getElementsByTagName('script');
   WMEAPI.url=null;
   // https://editor-assets.waze.com/production/js/vendor-3836d84fce90e4b2af4d.js
   // https://editor-assets.waze.com/production/js/app-71e49a79929ac160ba72.js
   for (var i=0;i<WMEAPI.scripts.length;i++)
   {
      if (WMEAPI.scripts[i].src.indexOf('/production/js/app')!=-1)
      {
         WMEAPI.url=WMEAPI.scripts[i].src;
         break;
      }
   }
   if (WMEAPI.url==null)
   {
      throw new Error("WME Hack: can't detect WME main JS");
   }
   WMEAPI.require=function (e)
   {
      if (WMEAPI.require.define.modules.hasOwnProperty(e))
      {
         return WMEAPI.require.define.modules[e];
      }
      else
      {
         console.error('Require failed on ' + e, WMEAPI.require.define.modules);
      }
      return null;
   };
   WMEAPI.require.define=function (m)
   {
      if (WMEAPI.require.define.hasOwnProperty('modules') === false)
      {
         WMEAPI.require.define.modules={};
      }
      for (var p in m)
      {
         WMEAPI.require.define.modules[p]=m[p];
      }
   };
   WMEAPI.tmp = window.webpackJsonp;
   WMEAPI.t = function (n)
   {
      if (WMEAPI.s[n])
      {
         return WMEAPI.s[n].exports;
      }
      var r = WMEAPI.s[n] =
      {
         exports: {},
         id: n,
         loaded: !1
      };
      return WMEAPI.e[n].call(r.exports, r, r.exports, WMEAPI.t), r.loaded = !0, r.exports;
   };
   WMEAPI.e=[];
   window.webpackJsonp = function(a, i)
   {
      var api={};
      for (var o, d, u = 0, l = []; u < a.length; u++)
      {
         d = a[u], WMEAPI.r[d] && l.push.apply(l, WMEAPI.r[d]), WMEAPI.r[d] = 0;
      }
      var unknownCount=0;
      var classname, funcStr;
      for (o in i)
      {
         WMEAPI.e[o] = i[o];
         funcStr = i[o].toString();
         classname = funcStr.match(/CLASS_NAME:\"([^\"]*)\"/);
         if (classname)
         {
            api[classname[1].replace(/\./g,'/').replace(/^W\//, 'Waze/')]={index: o, func: WMEAPI.e[o]};
         }
         else
         {
            api['Waze/Unknown/' + unknownCount]={index: o, func: WMEAPI.e[o]};
            unknownCount++;
         }
      }
      for (; l.length;)
      {
         l.shift().call(null, WMEAPI.t);
      }
      WMEAPI.s[0] = 0;
      var module={};
      var apiFuncName;
      unknownCount=0;
      for (o in i)
      {
         funcStr = i[o].toString();
         classname = funcStr.match(/CLASS_NAME:\"([^\"]*)\"/);
         if (classname)
         {
            module={};
            apiFuncName = classname[1].replace(/\./g,'/').replace(/^W\//, 'Waze/');
            module[apiFuncName]=WMEAPI.t(api[apiFuncName].index);
            WMEAPI.require.define(module);
         }
         else
         {
            var matches = funcStr.match(/SEGMENT:"segment",/);
            if (matches)
            {
               module={};
               apiFuncName='Waze/Model/ObjectType';
               module[apiFuncName]=WMEAPI.t(api['Waze/Unknown/' + unknownCount].index);
               WMEAPI.require.define(module);
            }
            unknownCount++;
         }
      }
      window.webpackJsonp=WMEAPI.tmp;
      window.require=WMEAPI.require;
      setTimeout(initWmeMagicWand(), 500);
   };
   WMEAPI.s = {};
   WMEAPI.r = {0: 0};
   WMEAPI.WMEHACK_Injected_script = document.createElement("script");
   WMEAPI.WMEHACK_Injected_script.setAttribute("type", "application/javascript");
   WMEAPI.WMEHACK_Injected_script.src = WMEAPI.url;
   document.body.appendChild(WMEAPI.WMEHACK_Injected_script);
   initWmeMagicWand();
}
else
{
    initWmeMagicWand();
}
//}
//
// end of dummyd2's require() patch
//

function initWmeMagicWand() {
    var DLscript = document.createElement("script");
    DLscript.textContent = run_magicwand.toString() + ' \n' + 'run_magicwand();';
    DLscript.setAttribute("type", "application/javascript");
    document.body.appendChild(DLscript);
}