// ==UserScript==
// @name         WME RPP-EP
// @namespace    https://github.com/jm6087/
// @version      2020.06.04.02
// @description  Locks RPPs and adds entry point
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/38421-wme-utils-navigationpoint/code/WME%20Utils%20-%20NavigationPoint.js?version=251065
// @author       jm6087 (with lots of help from SkiDooGuy - THANKS)
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426306/WME%20RPP-EP.user.js
// @updateURL https://update.greasyfork.org/scripts/426306/WME%20RPP-EP.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */
/* global wazedevtoastr */
/* global MultiAction */
/* global require */

(function(){
    'use strict';
    var UPDATE_NOTES = ''
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    let UpdateObj;
    var RPPlock = 2; //RPPlock 2 = Actual lock of L3
    var RPPlat;
    var RPPlon;
    var SelMan

    function RPPEP() {

        SelMan = W.selectionManager;
        if (SelMan.getSelectedFeatures().length > 0){ // Determines if there is an item selected
            let mod = W.selectionManager.getSelectedFeatures()[0].model
            if (mod.type == "venue"){
                let att = mod.attributes
                let res = att.residential
                let EP = att.entryExitPoints.length
                let entry = att.entryExitPoints
                let cityadded = mod.getAddress().attributes.city.attributes.name
                if (res != false){
                    if (cityadded != false){
                        if (att.lockRank <2){
                            UpdateObj = require('Waze/Action/UpdateObject');
                            W.model.actionManager.add(new UpdateObj(mod, { lockRank: RPPlock })); //locks to RRPlock
                            console.log ("Locked RPP", SCRIPT_NAME, VERSION);
                        }
                    }else{
                        wazedevtoastr.options.timeOut = 6000;
                        WazeWrap.Alerts.error(SCRIPT_NAME, ['The selected RPP does not have a city.', 'RPPs require a city to work correctly', 'Either add a city or delete the RPP'].join('\n'));
                    }
                    if (EP == 0){
                        var AddEP = require("Waze/Action/UpdateFeatureGeometry");
                        RPPlat = att.geometry.y
                        RPPlon = att.geometry.x
                        let rppep = new NavigationPoint(new OpenLayers.Geometry.Point(RPPlon,RPPlat));
                        mod.attributes.entryExitPoints.push(rppep);
//                         W.model.actionManager.add(new AddEP(mod));
//                         wazedevtoastr.options.timeOut = 6000;
//                         WazeWrap.Alerts.error(SCRIPT_NAME, ['The selected RPP does not have an entry point', 'RPPs require a stop point to work correctly', 'ADD ENTRY POINT'].join('\n'));
                        //////////////////////////////////////////////
                        //////////////////////////////////////////////
                        //NEED TO FIGURE OUT HOW TO ADD THE STOP POINT
                        //////////////////////////////////////////////
                        //////////////////////////////////////////////
                        console.log ("Needs Entry Point", SCRIPT_NAME, VERSION);
                    }
                }
            }
        }
    }

    function bootstrap(tries = 1) {
        if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap.Ready ) {
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES);
            WazeWrap.Events.register("selectionchanged", null, RPPEP);
            console.log(SCRIPT_NAME, "loaded");
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(++tries);}, 200);
    }
    bootstrap();
})();
