// ==UserScript==
// @name          WME Bad Junction Angle Info
// @description   Shows "Bad Angle Infos" of all Junctions in the editing area
// @match         https://beta.waze.com/*editor*
// @match         https://www.waze.com/*editor*
// @exclude       https://www.waze.com/*user/*editor/*
// @require       https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @version       1.9.13
// @grant         GM_addElement
// @namespace     https://wms.kbox.at/
// @copyright     2021 Gerhard; 2018 seb-d59, 2016 Michael Wikberg <waze@wikberg.fi>
// @license       CC-BY-NC-SA
// @icon          data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/434562/WME%20Bad%20Junction%20Angle%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/434562/WME%20Bad%20Junction%20Angle%20Info.meta.js
// ==/UserScript==

/**
 * This script is based on the code from "WME Junction angle Info".
 * Thanks for the great work to the authors of the original script:
 */
/**
 * Copyright 2016 Michael Wikberg <waze@wikberg.fi>
 * WME Junction Angle Info extension is licensed under a Creative Commons
 * Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 *
 * Contributions by:
 *	2014 Paweł Pyrczak "tkr85" <support@pyrczak.pl>
 *	2014 "AlanOfTheBerg" <alanoftheberg@gmail.com>
 *	2014 "berestovskyy" <?>
 *	2015 "FZ69617" <?>
 *	2015 "wlodek76" <?>
 *	2016 Sergey Kuznetsov "WazeRus" <sergey@izhevsk.pro> (Russian translation)
 *	2016 "MajkiiTelini" <?> Czech translation
 *	2016 "witoco" <?> (Latin-American Spanish translation)
 *	2017 "seb-d59" (Check override instruction and French translation)  <https://www.waze.com/forum/memberlist.php?mode=viewprofile&u=16863068>
 *  2019 thank to Sapozhnik for the Ukrainian (український) translation
 */

/*jshint eqnull:true, nonew:true, nomen:true, curly:true, latedef:true, unused:strict, noarg:true, loopfunc:true */
/*jshint trailing:true, forin:true, noempty:true, maxparams:7, maxerr:100, eqeqeq:true, strict:true, undef:true */
/*jshint bitwise:true, newcap:true, immed:true, onevar:true, browser:true, nonbsp:true, freeze:true */
/*global I18n, $*/
/* global _ */
/* global W */
/* global WazeWrap */

function run_aja() {
    "use strict";

    //    var TURN_ANGLE = 45.50; //Turn vs. keep angle - based on map experiments (45.04 specified in Wiki).
    //    var GRAY_ZONE = 1.5; //Gray zone angle intended to prevent from irregularities observed on map.

    /*
     * First some variable and enumeration definitions
     */
    var junctionangle_version = "1.9.13";
    var name = "Bad Junction Angle Info";
    const AJA_UPDATE_NOTES = `<b>FIX:</b><br>
- Update for new Beta WME<br>`;

    var junctionangle_debug = 0; //0: no output, 1: basic info, 2: debug 3: verbose debug, 4: insane debug
    var aja_last_restart = 0;
    var aja_roundabout_points = [];
    var aja_options = {};
    var aja_mapLayer;
    //    var scriptenabled = true;
    var pointSize = 12;
    var decimals = 2;
    var AJASettings = {};
    var country;
    var withRouting = true;

    var aja_vehicle_types = {
        TRUCK: 1,
        PUBLIC: 2,
        TAXI: 4,
        BUS: 8,
        HOV2: 16,
        HOV3: 32,
        RV: 64,
        TOWING: 128,
        MOTORBIKE: 256,
        PRIVATE: 512,
        HAZ: 1024
    };

    const css = [
        '.aja-wrapper {position:relative;width:100%;font-size:12px;font-family:"Rubik", "Boing-light", sans-serif;user-select:none;}',
        '.aja-section-wrapper {display:block;width:100%;padding:4px;}',
        '.aja-section-wrapper.border {border-bottom:1px solid grey;margin-bottom:5px;}',
        '.aja-header {font-weight:bold;}',
        '.aja-option-container {padding:3px;}',
        '.aja-option-container.no-display {display:none;}',
        '.aja-option-container.sub {margin-left:20px;}',
        'input[type="checkbox"].aja-checkbox {display:inline-block;position:relative;top:3px;vertical-align:top;margin:0;}',
        'input[type="color"].aja-color-input {display:inline-block;position:relative;width:20px;padding:0px 1px;border:0px;vertical-align:top;cursor:pointer;}',
        'input[type="color"].aja-color-input:focus {outline-width:0;}',
        'label.aja-label {display:inline-block;position:relative;max-width:80%;vertical-align:top;font-weight:normal;padding-left:5px;word-wrap:break-word;}',
        '.group-title.toolbar-top-level-item-title.rsa:hover {cursor:pointer;}'
    ].join(' ');

    const TRANSLATIONS = {
        default: {
            scriptTitle: 'Bad Junction Angle Info',
            scriptenabled: 'Script enabled',
            check: 'Check for TIOs and Restrictions',
            skiproundabout: 'Skip Roundabouts'
        }
    };

    /*
     * Main logic functions
     */

    function junctionangle_init() {
        // Register event listeners
        WazeWrap.Events.register('selectionchanged', null, aja_calculate);
        WazeWrap.Events.register('moveend', null, aja_calculate);
        WazeWrap.Events.register('afteraction', null, aja_calculate);
        WazeWrap.Events.register('moveend', null, aja_calculate);

        window.W.model.segments.on({
            "objectschanged": aja_calculate,
            "objectsremoved": aja_calculate
        });
        window.W.model.nodes.on({
            "objectschanged": aja_calculate,
            "objectsremoved": aja_calculate
        });

        window.W.map.olMap.events.register("zoomend", null, aja_calculate);
        window.W.map.olMap.events.register("move", null, aja_calculate);





        const $section = $('<div>');
        // HTML for UI tab
        $section.html([
            `<div class='aja-wrapper' id='aja-tab-wrapper'>
               <div style='margin-bottom:5px;border-bottom:1px solid black;'>
                  <span style='font-weight:bold;'>
                        <a href='https://www.waze.com/forum/viewtopic.php?t=334486' target='_blank' style='text-decoration:none;'>${name}</a>
                  </span> - v${junctionangle_version}
               </div>
               <div class="aja-option-container">
                   <input type=checkbox class='aja-checkbox' id='aja-scriptenabled' />
                   <label class='aja-label' for='aja-enableScript'><span id='aja-text-enableScript'>${TRANSLATIONS.default.scriptenabled}</span></label>
                </div>
                <div class='aja-option-container'>
                   <input type=checkbox class='aja-checkbox' id='aja-check' />
                   <label class='aja-label' for='aja-CeckTIOs'><span id='aja-text-Check'>${TRANSLATIONS.default.check}</span></label>
                </div>
               <div class='aja-option-container'>
                 <input type=checkbox class='aja-checkbox' id='aja-skiproundabout' />
                 <label class='aja-label' for='aja-SkipRoundabout'><span id='aja-text-SkipRoundabout'>${TRANSLATIONS.default.skiproundabout}</span></label>
               </div>
            </div>`
        ].join(' '));
        // Attach HTML for tab to webpage
        //    UpdateObj = require('Waze/Action/UpdateObject');

        // Script is initialized and the highlighting layer is created
        WazeWrap.Interface.Tab('BJAI', $section.html(), initializeSettings, 'BJAI');

        WazeWrap.Interface.ShowScriptUpdate(name, junctionangle_version, AJA_UPDATE_NOTES, 'https://greasyfork.org/en/scripts/434562-wme-bad-junction-angle-info', 'https://www.waze.com/forum/viewtopic.php?t=334486');


        async function initializeSettings() {
            await loadSettings();
            setEleStatus();
            $(`<style type="text/css">${css}</style>`).appendTo('head');
        }

        //Add support for translations. Default (and fallback) is "en".
        //Note, don't make typos in "acceleratorName", as it has to match the layer name (with whitespace removed)
        // to actually work. Took me a while to figure that out...
        I18n.translations[window.I18n.locale].layers.name.alljunction_angles = name;

        /**
         * Initialize BJAI OpenLayers vector layer
         */
        if (window.W.map.getLayersBy("uniqueName","alljunction_angles").length === 0) {

            // Create a vector layer and give it your style map.
            aja_mapLayer = new window.OpenLayers.Layer.Vector(name, {
                displayInLayerSwitcher: true,
                uniqueName: "alljunction_angles",
                shortcutKey: "S+j",
                accelerator: "toggle" + name.replace(/\s+/g,''),
                className: "alljunction-angles",
                styleMap: new window.OpenLayers.StyleMap(aja_style())
            });

            window.W.map.addLayer(aja_mapLayer);
            aja_log("version " + junctionangle_version + " loaded.", 0);

            aja_log(window.W.map, 3);
            aja_log(window.W.model, 3);
            aja_log(window.W.loginManager, 3);
            aja_log(window.W.selectionManager, 3);
            aja_log(aja_mapLayer, 3);
            aja_log(window.OpenLayers, 3);
        } else {
            aja_log("Oh, nice.. We already had a layer?", 3);
        }

        WazeWrap.Interface.AddLayerCheckbox("display", "Bad Junction Angle Info", true, LayerToggled);

        $('.aja-checkbox').change(function () {
            let settingName = $(this)[0].id.substr(4);
            AJASettings[settingName] = this.checked;

            saveSettings();
            aja_mapLayer.setVisibility(AJASettings.scriptenabled);
            aja_calculate();
        });

        aja_apply();

        // MTE mode event
        // reload after changing WME units
        W.prefs.on('change:isImperial', function(){
            aja_apply();
        });
        aja_calculate();
    }

    function LayerToggled(checked){
        aja_mapLayer.setVisibility(checked);
        AJASettings.scriptenabled = checked;
        setChecked('aja-scriptenabled', AJASettings.scriptenabled);
    }

    function findLayer(partOf_id){
        var layer;
        for (var i=0; i < window.W.map.layers.length; i++){
            if (window.W.map.layers[i].id.search(partOf_id) != -1){
                layer={id: window.W.map.layers[i].id, name: window.W.map.layers[i].name, number : i};
                aja_log("Number: " + i + "; id : " + layer.id + "; name :" + layer.name ,3);
                return layer;
            }
        }
    }

    function testLayerZIndex(){
        // seb-d59:
        // Here i search the selection layer and i read the z-index
        // and put BJAI's layer under this one.
        var zIndex = 0;
        aja_mapLayer.setZIndex(500);
        // now selection layer has no name ...
        var layer = {}
        layer = findLayer("OpenLayers_Layer_Vector_RootContainer");
        var layerOBJ = window.W.map.layers[layer.number];
        //aja_log("id : " + layerOBJ.id + "; name :" + layerOBJ.name + " zIndex: " + layerOBJ.getZIndex() ,3);
        zIndex = parseInt(layerOBJ.getZIndex()) - 1 ;
        aja_mapLayer.setZIndex(zIndex);
        aja_log("aja_mapLayer new zIndex: " + aja_mapLayer.getZIndex() ,3);
    }

    function aja_calculate_real() {
        var aja_start_time = Date.now();
        var aja_nodes = [];
        var restart = false;
        aja_log("Actually calculating now", 2);
        aja_roundabout_points = [];
        aja_log(window.W.map, 3);
        if (typeof aja_mapLayer === 'undefined') {
            return;
        }
        //clear old info
        aja_mapLayer.destroyFeatures();

        testLayerZIndex();
        if (!AJASettings.scriptenabled) return;

        _.each(W.model.segments.getObjectArray(), s => {
            if(![5, 10, 16, 18, 19].includes(s.attributes.roadType)){
                let segmentsAtt = s.attributes;
                if (segmentsAtt.fromNodeID != null &&
                    aja_nodes.indexOf(segmentsAtt.fromNodeID) === -1) {
                    aja_nodes.push(segmentsAtt.fromNodeID);
                }
                if (segmentsAtt.toNodeID != null &&
                    aja_nodes.indexOf(segmentsAtt.toNodeID) === -1) {
                    aja_nodes.push(segmentsAtt.toNodeID);
                }
            }
        });
        aja_log(aja_nodes, 3);

        var aja_label_distance;
        /*
         * Define a base distance to markers, depending on the zoom level
         */
        switch (window.W.map.olMap.zoom) {
            case 22: //10:
                aja_label_distance = 2.8;
                break;
            case 21: //9:
                aja_label_distance = 4;
                break;
            case 20: //8:
                aja_label_distance = 8;
                break;
            case 19: //7:
                aja_label_distance = 15;
                break;
            case 18: //6:
                aja_label_distance = 25;
                break;
            case 17: //5:
                aja_label_distance = 40;
                break;
            case 16: //4:
                aja_label_distance = 80;
                break;
            case 15: //3:
                aja_label_distance = 150;
                break;
            case 14: //2:
                aja_label_distance = 300;
                break;
            case 13: //1:
                aja_label_distance = 400;
                break;
            default:
                aja_log("Unsupported zoom level: " + window.W.map.olMap.zoom + "!", 2);
        }

        aja_label_distance *= (1 + (0.2 * parseInt(decimals)));

        aja_log("zoom: " + window.W.map.olMap.zoom + " -> distance: " + aja_label_distance, 2);

        //Start looping through selected nodes
        for (var i = 0; i < aja_nodes.length; i++) {
            var node = getByID(window.W.model.nodes,aja_nodes[i]);
            var angles = [];
            var aja_selected_segments_count = 0;
            var aja_selected_angles = [];
            var a;

            if (node == null || !node.hasOwnProperty('attributes')) {
                //Oh oh.. should not happen? We want to use a node that does not exist
                aja_log("Oh oh.. should not happen?",2);
                aja_log(node, 2);
                aja_log(aja_nodes[i], 2);
                aja_log(window.W.model, 3);
                aja_log(window.W.model.nodes, 3);
                continue;
            }

            //check connected segments
            var aja_current_node_segments = node.attributes.segIDs;
            aja_log("Alle aja_current_node_segments",2);
            aja_log(aja_current_node_segments.length,2);
            aja_log(node, 2);

            aja_log(aja_current_node_segments.length,2);

            //ignore of we have less than 2 segments
            if (aja_current_node_segments.length <= 2) {
                aja_log("Found only " + aja_current_node_segments.length + " connected segments at " + aja_nodes[i] +
                        ", not calculating anything...", 2);
                continue;
            }
            aja_log("Mehr als 2 aja_current_node_segments",2);
            aja_log(aja_current_node_segments.length,2);


            aja_log("Calculating angles for " + aja_current_node_segments.length + " segments", 2);
            aja_log(aja_current_node_segments, 3);

            aja_current_node_segments.forEach(function (nodeSegment, j) {
                var s = window.W.model.segments.objects[nodeSegment];
                if(typeof s === 'undefined') {
                    //Meh. Something went wrong, and we lost track of the segment. This needs a proper fix, but for now
                    // it should be sufficient to just restart the calculation
                    aja_log("Failed to read segment data from model. Restarting calculations.", 1);
                    if(aja_last_restart === 0) {
                        aja_last_restart = new Date().getTime();
                        setTimeout(function(){aja_calculate();}, 500);
                    }
                    restart = true;
                }
                a = aja_getAngle(aja_nodes[i], s);
                aja_log("Segment " + nodeSegment + " angle is " + a, 2);
                angles[j] = [a, nodeSegment, s == null ? false : true, s.attributes.roadType];
                if (s == null ? false : true) {
                    aja_selected_segments_count++;
                }
            });

            if(restart) { return; }

            for( var ii = 0; ii < angles.length; ii++){
                if([5, 10, 16, 18, 19].includes(angles[ii][3])){
                    angles.splice(ii, 1);
                    ii--;
                }
            }

            aja_log(angles, 2);

            var ha, point;
            //sort angle data (ascending)
            angles.sort(function (a, b) {
                return a[0] - b[0];
            });
            aja_log(angles, 3);
            aja_log(aja_selected_segments_count, 3);

            //get all segment angles

            for (var iii = 0; iii < angles.length - 1; iii++) {
                for (var jjj = iii + 1; jjj < angles.length; jjj++) {
                    a = (360 + (angles[(jjj) % angles.length][0] - angles[iii][0])) % 360;
                    if (a > 180) {
                        a = 360 - a;
                        ha = (360 + ((a / 2) + angles[jjj][0])) % 360;
                    } else {

                        ha = (360 + ((a / 2) + angles[iii][0])) % 360;
                    }
                    aja_log(a,3);

                    aja_log("Angle between " + angles[iii][1] + " and " + angles[(jjj) % angles.length][1] + " is " +
                            a + " and position for label should be at " + ha, 1);
                    //                    if (a < 10.26 || (a > 133 && a < 136 )) {
                    if ((a > 133 && a < 136 )) {
                        point = new window.OpenLayers.Geometry.Point(
                            node.getOLGeometry().x + (aja_label_distance * 1.25 * Math.cos((ha * Math.PI) / 180)),
                            node.getOLGeometry().y + (aja_label_distance * 1.25 * Math.sin((ha * Math.PI) / 180))
                        );
                        // Respect Trunrestrictons and TIOs
                        var s1 = getByID(window.W.model.segments,angles[iii][1])
                        var s2 = getByID(window.W.model.segments,angles[(jjj) % angles.length][1])

                        var draw_marker = true;

                        if (AJASettings.check) {
                            draw_marker = false;
                            if (aja_is_turn_allowed(s1, node, s2)) {
                                var WazeModelGraphTurnData = window.require("Waze/Model/Graph/TurnData");
                                var turn = new WazeModelGraphTurnData();
                                turn = window.W.model.getTurnGraph().getTurnThroughNode(node, s1, s2);
                                var opcode = turn.getTurnData().getInstructionOpcode();
                                if(!opcode) {
                                    if (aja_is_turn_allowed(s2, node, s1)) {
                                        turn = window.W.model.getTurnGraph().getTurnThroughNode(node, s2, s1);
                                        opcode = turn.getTurnData().getInstructionOpcode();
                                        if(!opcode) {
                                            draw_marker = true;
                                        }
                                    }
                                }
                            }
                            if (s1.attributes.junctionID || s2.attributes.junctionID) {
                                draw_marker = false;
                            }
                        }

                        if (AJASettings.skiproundabout) {
                            if(getByID(window.W.model.segments,angles[iii][1]).attributes.junctionID) {
                                draw_marker = false;
                            }
                            if(getByID(window.W.model.segments,angles[(jjj) % angles.length][1]).attributes.junctionID) {
                                draw_marker = false;
                            }
                        }

                        if (draw_marker) {
                            aja_draw_marker(point, node, aja_label_distance, a, ha);
                        }
                    }
                }
            }
        }

        aja_last_restart = 0;
        var aja_end_time = Date.now();
        aja_log("Calculation took " + String(aja_end_time - aja_start_time) + " ms", 2);
    }

    /*
     * Drawing functions
     */
    /**
     *
     * @param point Estimated point for marker
     * @param node Node the marker is for
     * @param aja_label_distance Arbitrary distance to be used in moving markers further away etc
     * @param a Angle to display
     * @param ha Angle to marker from node (FIXME: either point or ha is probably unnecessary)
     * @param withRouting true: show routing guessing markers, false: show "normal" angle markers
     * @param aja_junction_type If using routing, this needs to be set to the desired type
     */
    function aja_draw_marker(point, node, aja_label_distance, a, ha, withRouting, aja_junction_type) {

        //Try to estimate of the point is "too close" to another point
        //(or maybe something else in the future; like turn restriction arrows or something)
        //FZ69617: Exctract initial label distance from point
        var aja_tmp_distance = Math.abs(ha) % 180 < 45 || Math.abs(ha) % 180 > 135 ?
            (point.x - node.getOLGeometry().x) / (Math.cos((ha * Math.PI) / 180)) :
        (point.y - node.getOLGeometry().y) / (Math.sin((ha * Math.PI) / 180));
        aja_log("Starting distance estimation", 3);
        while(aja_mapLayer.features.some(function(feature){
            if(typeof feature.attributes.aja_type !== 'undefined' && feature.attributes.aja_type !== 'roundaboutOverlay') {
                //Arbitrarily chosen minimum distance.. Should actually use the real bounds of the markers,
                //but that didn't work out.. Bounds are always 0..
                if(aja_label_distance / 1.4 > feature.geometry.distanceTo(point)) {
                    aja_log(aja_label_distance / 1.5 > feature.geometry.distanceTo(point) + " is kinda close..", 3);
                    return true;
                }
            }
            return false;
        })) {
            //add 1/4 of the original distance and hope for the best =)
            aja_tmp_distance += aja_label_distance / 4;
            aja_log("setting distance to " + aja_tmp_distance, 2);
            point = new window.OpenLayers.Geometry.Point(
                node.getOLGeometry().x + (aja_tmp_distance * Math.cos((ha * Math.PI) / 180)),
                node.getOLGeometry().y + (aja_tmp_distance * Math.sin((ha * Math.PI) / 180))
            );
        }
        aja_log("Distance estimation done", 3);

        var anglePoint = new window.OpenLayers.Feature.Vector(
            point,
            { angle: aja_round(180 - a) + "°", aja_type: "generic" }
        );

        aja_log(anglePoint, 3);

        //Draw a line to the point
        aja_mapLayer.addFeatures([
            new window.OpenLayers.Feature.Vector(
                new window.OpenLayers.Geometry.LineString([node.getOLGeometry(), point]),
                {},
                {strokeOpacity: 0.9, strokeWidth: 2.2, strokeDashstyle: "solid", strokeColor: "#ff9966"}
            )
        ]
                                );
        //push the angle point
        aja_mapLayer.addFeatures([anglePoint]);
    }

    function aja_get_first_point(segment) {
        return segment.getOLGeometry().components[0];
    }

    function aja_get_last_point(segment) {
        return segment.getOLGeometry().components[segment.getOLGeometry().components.length - 1];
    }

    function aja_get_second_point(segment) {
        return segment.getOLGeometry().components[1];
    }

    function aja_get_next_to_last_point(segment) {
        return segment.getOLGeometry().components[segment.getOLGeometry().components.length - 2];
    }

    //get the absolute angle for a segment end point
    function aja_getAngle(aja_node, aja_segment) {
        aja_log("node: " + aja_node, 2);
        aja_log("segment: " + aja_segment, 2);
        if (aja_node == null || aja_segment == null) { return null; }
        var aja_dx, aja_dy;
        if (aja_segment.attributes.fromNodeID === aja_node) {
            aja_dx = aja_get_second_point(aja_segment).x - aja_get_first_point(aja_segment).x;
            aja_dy = aja_get_second_point(aja_segment).y - aja_get_first_point(aja_segment).y;
        } else {
            aja_dx = aja_get_next_to_last_point(aja_segment).x - aja_get_last_point(aja_segment).x;
            aja_dy = aja_get_next_to_last_point(aja_segment).y - aja_get_last_point(aja_segment).y;
        }
        aja_log(aja_node + " / " + aja_segment + ": dx:" + aja_dx + ", dy:" + aja_dy, 2);
        var aja_angle = Math.atan2(aja_dy, aja_dx);
        return ((aja_angle * 180 / Math.PI)) % 360;
    }

    /**
     * Decimal adjustment of a number. Borrowed (with some modifications) from
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
     * aja_round(55.55); with 1 decimal // 55.6
     * aja_round(55.549); with 1 decimal // 55.5
     * aja_round(55); with -1 decimals // 60
     * aja_round(54.9); with -1 decimals // 50
     *
     * @param    {Number}    value    The number.
     * @returns    {Number}            The adjusted value.
     */
    function aja_round(value) {
        var aja_rounding = -parseInt(decimals);
        var valueArray;
        if (typeof aja_rounding === 'undefined' || +aja_rounding === 0) {
            return Math.round(value);
        }
        value = +value;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof aja_rounding === 'number' && aja_rounding % 1 === 0)) {
            return NaN;
        }
        // Shift
        valueArray = value.toString().split('e');
        value = Math.round(+(valueArray[0] + 'e' + (valueArray[1] ? (+valueArray[1] - aja_rounding) : -aja_rounding)));
        // Shift back
        valueArray = value.toString().split('e');
        return +(valueArray[0] + 'e' + (valueArray[1] ? (+valueArray[1] + aja_rounding) : aja_rounding));
    }

    /*
     * WME interface helper functions
     */
    var aja_apply = function applyAJAOptions() {
        aja_log("Applying stored (or default) settings", 2);
        if(typeof window.W.map.getLayersBy("uniqueName","alljunction_angles")[0] === 'undefined') {
            aja_log("WME not ready yet, trying again in 400 ms", 2);
            setTimeout(function(){aja_apply();}, 400);
            return;
        }
        window.W.map.getLayersBy("uniqueName","alljunction_angles")[0].styleMap = aja_style();
        aja_calculate_real();
        aja_log(aja_options, 2);
    };

    var aja_reset = function resetAJAOptions() {
        aja_log("Resetting settings", 2);
        if(localStorage != null) {
            localStorage.removeItem("wme_bja_options");
        }
        aja_options = {};
        aja_apply();
        return false;
    };

    var aja_calculation_timer = {
        start: function() {
            aja_log("Starting timer", 2);
            this.cancel();
            var aja_calculation_timer_self = this;
            this.timeoutID = window.setTimeout(function(){aja_calculation_timer_self.calculate();}, 200);
        },

        calculate: function() {
            aja_calculate_real();
            delete this.timeoutID;
        },

        cancel: function() {
            if(typeof this.timeoutID === "number") {
                window.clearTimeout(this.timeoutID);
                aja_log("Cleared timeout ID : " + this.timeoutID, 2);
                delete this.timeoutID;
            }
        }
    };

    function aja_calculate() {
        aja_calculation_timer.start();
    }

    function aja_style() {
        aja_log("Point radius will be: " + (parseInt(pointSize, 10)) +
                (parseInt(decimals > 0 ? (4 * parseInt(decimals)).toString() : "0")), 2);
        return new window.OpenLayers.Style({
            fillColor: "#ffff00",
            strokeColor: "#ff9966",
            strokeWidth: 2,
            label: "${angle}",
            fontWeight: "bold",
            pointRadius: parseInt(pointSize, 10) +
            (parseInt(decimals) > 0 ? 4 * parseInt(decimals) : 0),
            fontSize: "10px"
        });
    }

    function aja_is_turn_allowed(s_from, via_node, s_to) {
        aja_log("Allow from " + s_from.attributes.id +
                " to " + s_to.attributes.id +
                " via " + via_node.attributes.id + "? " +
                via_node.isTurnAllowedBySegDirections(s_from, s_to) + " | " + s_from.isTurnAllowed(s_to, via_node), 2);

        //Is there a driving direction restriction?
        if(!via_node.isTurnAllowedBySegDirections(s_from, s_to)) {
            aja_log("Driving direction restriction applies", 3);
            return false;
        }

        //Is turn allowed by other means (e.g. turn restrictions)?
        if(!s_from.isTurnAllowed(s_to, via_node)) {
            aja_log("Other restriction applies", 3);
            return false;
        }

        if(s_to.attributes.fromNodeID === via_node.attributes.id) {
            aja_log("FWD direction",3);
            return aja_is_car_allowed_by_restrictions(s_to.attributes.fwdRestrictions);
        } else {
            aja_log("REV direction",3);
            return aja_is_car_allowed_by_restrictions(s_to.attributes.revRestrictions);
        }
    }

    function aja_is_car_allowed_by_restrictions(restrictions) {
        aja_log("Checking restrictions for cars", 2);
        if(typeof restrictions === 'undefined' || restrictions == null || restrictions.length === 0) {
            aja_log("No car type restrictions to check...", 3);
            return true;
        }
        aja_log(restrictions, 3);

        return !restrictions.some(function(element) {
            /*jshint bitwise: false*/
            aja_log("Checking restriction " + element, 3);
            //noinspection JSBitwiseOperatorUsage
            var ret = element.allDay &&				//All day restriction
                element.days === 127 &&				//Every week day
                ( element.vehicleTypes === -1 ||	//All vehicle types
                 element.vehicleTypes & aja_vehicle_types.PRIVATE //or at least private cars
                );
            if (ret) {
                aja_log("There is an all-day-all-week restriction", 3);
                var fromDate = Date.parse(element.fromDate);
                var toDate = Date.parse(element.toDate);
                aja_log("From: " + fromDate + ", to: " + toDate + ". " + ret, 3);
                if(isNaN(fromDate && isNaN(toDate))) {
                    aja_log("No start nor end date defined");
                    return false;
                }
                var fRes, tRes;
                if(!isNaN(fromDate) && new Date() > fromDate) {
                    aja_log("From date is in the past", 3);
                    fRes = 2;
                } else if(isNaN(fromDate)) {
                    aja_log("From date is invalid/not set", 3);
                    fRes = 1;
                } else {
                    aja_log("From date is in the future: " + fromDate, 3);
                    fRes = 0;
                }
                if(!isNaN(toDate) && new Date() < toDate) {
                    aja_log("To date is in the future", 3);
                    tRes = 2;
                } else if(isNaN(toDate)) {
                    aja_log("To date is invalid/not set", 3);
                    tRes = 1;
                } else {
                    aja_log("To date is in the past: " + toDate, 3);
                    tRes = 0;
                }
                // Car allowed unless
                // - toDate is in the future and fromDate is unset or in the past
                // - fromDate is in the past and toDate is unset in the future
                // Hope I got this right ;)
                return (fRes <= 1 && tRes <= 1);
            }
            return ret;
        });
    }

    async function loadSettings() {
        const localSettings = $.parseJSON(localStorage.getItem('AJA_Settings'));
        console.log('AJA Settings loaded');
        // Attempt connection to WazeWrap setting server to retrieve settings
        const serverSettings = await WazeWrap.Remote.RetrieveSettings('AJA_Settings');
        if (!serverSettings) console.log('AJA: Error communicating with WW settings server');
        // Default checkbox settings
        const defaultsettings = {
            lastSaveAction: 0,
            scriptenabled: true,
            check: false,
            skiproundabout: false
        };

        AJASettings = $.extend({}, defaultsettings, localSettings);
        if (serverSettings && serverSettings.lastSaveAction > AJASettings.lastSaveAction) {
            $.extend(AJASettings, serverSettings);
            // console.log('AJA: server settings used');
        } else {
            // console.log('AJA: local settings used');
        }

        // If there is no value set in any of the stored settings then use the default
        Object.keys(defaultsettings).forEach((funcProp) => {
            if (!AJASettings.hasOwnProperty(funcProp)) {
                AJASettings[funcProp] = defaultsettings[funcProp];
            }
        });
    }

    async function saveSettings() {
        const {
            lastSaveAction,
            scriptenabled,
            check,
            skiproundabout
        } = AJASettings;

        const localSettings = {
            lastSaveAction: Date.now(),
            scriptenabled,
            check,
            skiproundabout
        };

        // Required for the instant update of changes to the keyboard shortcuts on the UI
        AJASettings = localSettings;

        if (localStorage) {
            localStorage.setItem('AJA_Settings', JSON.stringify(localSettings));
        }
        const serverSave = await WazeWrap.Remote.SaveSettings('AJA_Settings', localSettings);

        if (serverSave === null) {
            console.warn('AJA: User PIN not set in WazeWrap tab');
        } else {
            if (serverSave === false) {
                console.error('AJA: Unable to save settings to server');
            }
        }
        if (serverSave === true) {
            console.log('AJA: Settings saved');
        }
    }

    // Set user options
    function setEleStatus() {
        setChecked('aja-scriptenabled', AJASettings.scriptenabled);
        setChecked('aja-skiproundabout', AJASettings.skiproundabout);
        if ( country == 'Austria' ) {
            $(`#${'aja-check'}`).prop('disabled', true);
        } else {
            setChecked('aja-check', AJASettings.check);
        }
    }

    function setChecked(ele, status) {
        $(`#${ele}`).prop('checked', status);
    }

    /*
     * Bootstrapping and logging
     */

    function aja_bootstrap(retries) {
        retries = retries || 0;
        //If Waze has not been defined in ~15 seconds, it probably won't work anyway. Might need tuning
        //for really slow devices?
        if (retries >= 30) {
            aja_log("Failed to bootstrap 30 times. Giving up.", 0);
            return;
        }

        try {
            //User logged in and WME ready
            if (
//                !(document.querySelector('.list-unstyled.togglers .group') === null) &&
                aja_is_model_ready() &&
                aja_is_dom_ready() &&
                checkCountry() &&
                window.W.loginManager.isLoggedIn()) {
                setTimeout(function () {
                    junctionangle_init();
                }, 500);
            }
            //Some part of the WME was not yet fully loaded. Retry.
            else {
                setTimeout(function () {
                    aja_bootstrap(++retries);
                }, 500);
            }
        } catch (err) {
            aja_log(err, 1);
            setTimeout(function () {
                aja_bootstrap(++retries);
            }, 500);
        }
    }

    function aja_is_model_ready() {
        if(typeof window.W === 'undefined' || typeof window.W.map === 'undefined') {
            return false;
        } else {
            //return 'undefined' !== typeof window.W.map.events.register &&
            return 'undefined' !== typeof window.W.map.olMap.events.register &&
                'undefined' !== typeof window.W.selectionManager.events.register &&
                'undefined' !== typeof window.W.loginManager.events.register;
        }
    }

    function aja_is_dom_ready() {
        if(null === document.getElementById('user-info')) {
            return false;
        } else {
            return document.getElementById('user-info').getElementsByClassName('nav-tabs').length > 0 &&
                document.getElementById('user-info').getElementsByClassName('tab-content').length > 0;
        }
    }

    /**
     * Debug logging.
     * @param aja_log_msg
     * @param aja_log_level
     */
    function aja_log(aja_log_msg, aja_log_level) {
        if(typeof aja_log_level === 'undefined') { aja_log_level = 1; }
        if (aja_log_level <= junctionangle_debug) {
            if (typeof aja_log_msg === "object") {
                console.log(aja_log_msg);
            }
            else {
                console.log("WME Bad JAI: " + aja_log_msg);
            }
        }
    }

    function getByID(obj, id){
        if (typeof(obj.getObjectById) == "function"){
            return obj.getObjectById(id);
        }else if (typeof(obj.getObjectById) == "undefined"){
            return obj.get(id);
        }
    }
    function checkCountry() {
        try {
            country = W.model.getTopCountry().attributes.name;
        } catch (err) {
            country = null;
            // console.log(err);
        }
        return country;
    }

    aja_bootstrap();
}

let run_aja_script = GM_addElement('script', {
  textContent: "" + run_aja.toString() + " \n" + "run_aja();"
});