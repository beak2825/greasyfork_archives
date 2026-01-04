// ==UserScript==
// @name         WME Diffinator
// @namespace    https://greasyfork.org/en/users/166843-wazedev
// @version      2023.03.13.01
// @description  Display differences between two segments
// @author       JustinS83
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @exclude      https://www.waze.com/dashboard/editor
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373522/WME%20Diffinator.user.js
// @updateURL https://update.greasyfork.org/scripts/373522/WME%20Diffinator.meta.js
// ==/UserScript==

/* global W */
/* global OL */
/* ecmaVersion 2017 */
/* global $ */
/* global I18n */
/* global _ */
/* global WazeWrap */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';

    var terminatorimg = "data:image/jpeg;base64,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";

    const updateMessage = "The Diffinator has installed updates to work with the WME changes and is ready to diff.";

    var attributeToTextMap={
        fwdDirection: "A -> B",
        revDirection: "B -> A",
        fwdMaxSpeed: I18n.translations[I18n.currentLocale()].edit.segment.speed_limit.fwdMaxSpeed + " " + I18n.translations[I18n.currentLocale()].edit.segment.fields.speed_limit,
        revMaxSpeed: I18n.translations[I18n.currentLocale()].edit.segment.speed_limit.revMaxSpeed + " " + I18n.translations[I18n.currentLocale()].edit.segment.fields.speed_limit,
        fwdMaxSpeedUnverified: "A -> B Unverified",
        revMaxSpeedUnverified: "B -> A Unverified",
        fwdToll: "Toll",
        //revToll: "Toll", //Current implementation only supports flagging of both directions even though data structure allows per direction
        level: I18n.translations[I18n.currentLocale()].edit.segment.fields.level,
        lockRank: "Lock Level",
        rank: "Auto Lock",
        roadType: I18n.translations[I18n.currentLocale()].edit.segment.fields.road_type,
        routingRoadType: I18n.translations[I18n.currentLocale()].edit.segment.fields.routing,
        flags: ""
    };

    function bootstrap(tries = 1) {
        if (W && W.map &&
            W.model && W.loginManager.user &&
            $ && WazeWrap.Ready)
            init();
        else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    bootstrap();

    function init(){
        injectCSS();
        W.selectionManager.events.register('selectionchanged', this, checkDisplayDiffinator);
        checkDisplayDiffinator();

        WazeWrap.Interface.ShowScriptUpdate("WME Diffinator", GM_info.script.version, updateMessage, "", "https://www.waze.com/forum/viewtopic.php?p=2339393");
    }

    function checkDisplayDiffinator(){
        if(WazeWrap.getSelectedFeatures().length === 2){
            setTimeout( function(){
                $('.segment .panel-header-component').append('<i class="fa fa-object-ungroup" aria-hidden="true" id="diffSegs" style="cursor:pointer;"></i>');

            $('#diffSegs').click(releaseTheDiffinator);
            }, 100 );
        }
        else
        {
            $('#SegDiffContainer').remove();
        }
    }

    function releaseTheDiffinator(){
        let selected = WazeWrap.getSelectedFeatures();
        let seg1St, seg2St;
        let streets = W.model.streets.getByIds([WazeWrap.getSelectedFeatures()[0].model.attributes.primaryStreetID, WazeWrap.getSelectedFeatures()[1].model.attributes.primaryStreetID]);
        seg1St = streets[0];
        seg2St = streets[1];
        let seg1Street = WazeWrap.getSelectedFeatures()[0].model.getAddress().attributes.street.name;
        let seg1City = WazeWrap.getSelectedFeatures()[0].model.getAddress().attributes.city.attributes.name;
        let seg2Street = WazeWrap.getSelectedFeatures()[1].model.getAddress().attributes.street.name;
        let seg2City = WazeWrap.getSelectedFeatures()[1].model.getAddress().attributes.city.attributes.name;
        let seg1Alts = WazeWrap.getSelectedFeatures()[0].model.getAddress().attributes.altStreets;
        let seg2Alts = WazeWrap.getSelectedFeatures()[1].model.getAddress().attributes.altStreets;

        $('#SegDiffContainer').remove();
        var $segDiff = $('<div>');
        $segDiff.html([
            '<div class="segDiffContainer" style="display: grid; position: absolute; z-index:1000; background-color:white; top:40px; left:300px; border-radius:20px; border: 2px solid; min-width: 650px; padding-left:10px; padding-right: =10px; padding-bottom:5px;" id="SegDiffContainer">',
            `<div class="segDiffHeader"><h3>The Diffinator<img width="50" height="50" src="${terminatorimg}"></h3><div style="position:absolute; float:right; cursor:pointer; top:0; right:10px;" id="segDiffClose"><i class="fa fa-window-close" aria-hidden="true"></i></div></div>`,
            '<div class="segDiffAttr"><h6>Attribute</h6></div>',
            `<div class="segDiffSeg1"><h6>Segment ${selected[0].model.attributes.id}</h6></div>`,
            `<div class="segDiffSeg2"><h6>Segment ${selected[1].model.attributes.id}</h6></div>`,
            '</div>'
        ].join(' '));

        $("#WazeMap").append($segDiff.html());

        $('#segDiffClose').click(function(){ $('#SegDiffContainer').remove(); });

        if(seg1Street !== seg2Street){
            if(seg1Street == "")
                seg1Street = "[Empty]";
            if(seg2Street == "")
                seg2Street = "[Empty]";
            $('.segDiffAttr').append(`<div>Street name</div>`);
            $('.segDiffSeg1').append(`<div>${seg1Street}</div>`);
            $('.segDiffSeg2').append(`<div>${seg2Street}</div>`);
        }
        if(seg1City !== seg2City){
            $('.segDiffAttr').append(`<div>Primary City</div>`);
            if(seg1City === "")
                seg1City = "None";
            if(seg2City === "")
                seg2City = "None";
            $('.segDiffSeg1').append(`<div>${seg1City}</div>`);
            $('.segDiffSeg2').append(`<div>${seg2City}</div>`);
        }

        for (var property in selected[0].model.attributes) {
            if (selected[0].model.attributes.hasOwnProperty(property)) {
                if(attributeToTextMap[property] !== undefined){
                    if(selected[0].model.attributes[property] != selected[1].model.attributes[property]){
                        if(property !== "flags"){
                            $('.segDiffAttr').append(`<div>${attributeToTextMap[property]}</div>`);

                            if(property=="roadType"){
                                $('.segDiffSeg1').append(`<div>${I18n.translations[I18n.currentLocale()].segment.road_types[selected[0].model.attributes[property]]}</div>`);
                                $('.segDiffSeg2').append(`<div>${I18n.translations[I18n.currentLocale()].segment.road_types[selected[1].model.attributes[property]]}</div>`);
                            }
                            else if(property == "routingRoadType"){
                                let rrt0 = I18n.translations[I18n.currentLocale()].edit.segment.routing.road_type.current;
                                let rrt1 = I18n.translations[I18n.currentLocale()].edit.segment.routing.road_type.current;
                                if(selected[0].model.attributes.routingRoadType !== null){
                                    if(isNextRoutingRoadType(selected[0].model.attributes.roadType,selected[0].model.attributes[property]))
                                        rrt0 = I18n.translations[I18n.currentLocale()].edit.segment.routing.road_type.next;
                                    else
                                        rrt0 = I18n.translations[I18n.currentLocale()].edit.segment.routing.road_type.prev;
                                }

                                if(selected[1].model.attributes.routingRoadType !== null){
                                    if(isNextRoutingRoadType(selected[1].model.attributes.roadType, selected[1].model.attributes[property]))
                                        rrt1 = I18n.translations[I18n.currentLocale()].edit.segment.routing.road_type.next;
                                    else
                                        rrt1 = I18n.translations[I18n.currentLocale()].edit.segment.routing.road_type.prev;
                                }

                                $('.segDiffSeg1').append(`<div>${rrt0}</div>`);
                                $('.segDiffSeg2').append(`<div>${rrt1}</div>`);
                            }
                            else{
                                $('.segDiffSeg1').append(`<div>${selected[0].model.attributes[property]}</div>`);
                                $('.segDiffSeg2').append(`<div>${selected[1].model.attributes[property]}</div>`);
                            }
                        }
                        else{
                            if(selected[0].model.attributes.flags & 1 || selected[1].model.attributes.flags & 1){
                                //Tunnel
                                $('.segDiffAttr').append(`<div>${I18n.translations[I18n.currentLocale()].edit.segment.fields.tunnel}</div>`);
                                $('.segDiffSeg1').append(`<div>${(selected[0].model.attributes.flags & 1) === 1}</div>`);
                                $('.segDiffSeg2').append(`<div>${(selected[1].model.attributes.flags & 1) === 1}</div>`);
                            }
                            if(selected[0].model.attributes.flags & 16 || selected[1].model.attributes.flags & 16){
                                //Unpaved
                                $('.segDiffAttr').append(`<div>${I18n.translations[I18n.currentLocale()].edit.segment.fields.unpaved}</div>`);
                                $('.segDiffSeg1').append(`<div>${(selected[0].model.attributes.flags & 16) === 16}</div>`);
                                $('.segDiffSeg2').append(`<div>${(selected[1].model.attributes.flags & 16) === 16}</div>`);
                            }
                            if(selected[0].model.attributes.flags & 32 || selected[1].model.attributes.flags & 32){
                                //Headlights
                                $('.segDiffAttr').append(`<div>${I18n.translations[I18n.currentLocale()].edit.segment.fields.headlights}</div>`);
                                $('.segDiffSeg1').append(`<div>${(selected[0].model.attributes.flags & 32) === 32}</div>`);
                                $('.segDiffSeg2').append(`<div>${(selected[1].model.attributes.flags & 32) === 32}</div>`);
                            }
                            if(selected[0].model.attributes.flags & 128 || selected[1].model.attributes.flags & 128){
                                //Nearby HOV
                                $('.segDiffAttr').append(`<div>${I18n.translations[I18n.currentLocale()].edit.segment.fields.nearbyHOV}</div>`);
                                $('.segDiffSeg1').append(`<div>${(selected[0].model.attributes.flags & 128) === 128}</div>`);
                                $('.segDiffSeg2').append(`<div>${(selected[1].model.attributes.flags & 128) === 128}</div>`);
                            }
                        }
                    }
                }
            }
        }
    }

    function isNextRoutingRoadType(roadType, routingRoadType) {
        switch (roadType) {
            case 1:
                if (routingRoadType == 2)
                    return true;
                break;
            case 2:
                if (routingRoadType == 7)
                    return true;
                break;
            case 3:
                if (routingRoadType == 6)
                    return false;
                break;
            case 6:
                if (routingRoadType == 3)
                    return true;
                break;
            case 7:
                if (routingRoadType == 6)
                    return true;
                break;
        }
        return false;
    };

    function injectCSS() {
        var css = [
            '.segDiffContainer { text-align: center; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; grid-template-areas: "header header header" "segAttr seg1 seg2"}',
            '.segDiffHeader { grid-area: header }',
            '.segDiffAttr { grid-area: segAttr }',
            '.segDiffSeg1 { text-align: center; grid-area: seg1 }',
            '.segDiffSeg2 { text-align: center; grid-area: seg2 }'
        ].join(' ');
        $('<style type="text/css">' + css + '</style>').appendTo('head');
    }
})();
