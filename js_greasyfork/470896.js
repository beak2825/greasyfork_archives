// ==UserScript==
// @name          WME Junction Angle Info
// @description   Show the angle between two selected (and connected) segments
// @match         https://beta.waze.com/*editor*
// @match         https://www.waze.com/*editor*
// @exclude       https://www.waze.com/*user/*editor/*
// @version       2.2.16
// @grant         GM_addElement
// @namespace     https://greasyfork.org/scripts/35547-wme-junction-angle-info/
// @require       https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @copyright     2018 seb-d59, 2016 Michael Wikberg <waze@wikberg.fi>
// @license       CC-BY-NC-SA
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA6pSURBVFhHrZkJcBNnlscbgjEZmHAYsHVZUrek7pbUuo9W674l65Z8WzbGxoAxhzNgcweMDeY0GLDHwYBhGCABTEwIOSaTZBIyye6mcjBJFTs7O5Xazc4ks7NbU7vJzjKVrc0+RVqwhWEC5NW/VFKr3//79fe+fv3JRrp2bjs00NfW3gqqSldojCqFVk4q8LK4z+a2kEosVRVIVnrL60KMU602SfnaohIaQR0zb/72428eNr7+n6/r14bBh2+ahaJCDMOcWk9ndOuFFdeQlrbF4USZ0aqlNDJKS8YrovXNNSa7PlEVSTdVK3REMGIDcbEiuU5c3hDhmgvA6PV3X8p5P2x89ecv6XIRWCX94bFVP//l+l9lhYikpTB8MOauW1y1pqN13ab26oZkrCLo9JuBZj77CYfH0LysJt1UXtdcqXALwOJHu5bkXB8tRl85C26Mj3xm5eU7QLWN5TB8RV0MXpPVYbVRNuOJqVoT5fAx9c1V3bs2Ny2pYSxqX9AWSvlYpqkc87RPP/tNzvKRo6Y9AEzratrvAD25rrW+sYKQCUQ4F17Ti8pXrlmytLUhFHVX1kTLIq7mltrautSuPTsa1qQgubEznjP7PuKtv3sVPGkPfgeomD1bSqHA1La6OVUZikFJYx54raiOdGxYtXvf9i1b1h3q37dpc6cmiELyqdHBnNn3Ef/+pz9aKgkeM/3UinM5oOp0tLy6rLYh7g9Z043Jhqby9nVLgePg4d4Nm9vXrV99fHhw6OmjiUSshJ4CQGCRM5ssvri+SVeIIPVjuY9jy4UzkUJO6MQn2QOTRNv2NNj2NvbmgKJJD3DU1MfWrm/t3Lh6X1/34NN9q59cfnxk8NrLzw2f/PGh/v1LW5pNNgOk6ROCnM0k8dX7R30LkMLCO0CvrZqr3Hnjq18fNBc2X/v2yCSx//h2cG6vbhtte2VjfBuycduT+/p3Dp8e6N6zdf/h3U+PDJw+f2LkpyeODPXv6O3auHlDV1fXzu5doZQf0sItTM7m7rh1Yw9DrXrx59tlDwY0cmkAnAk9B7oRiqJI74Fth4f2n3n2xPnRM8dODe7p6926Y/OmbRuf6t7avbtn995eiKOHjyRqM32sYpUnZ3PPGKtHJinZ0I1b2SN3xzMvjICzxFxSWV0bjsWRsRcvDB4/1LmlfV9/b++B7u7dXb37d/YdOTBw7GjXzq66dK1erwNwIcGBtNgya87mnjEB6LvET54bAmeucjZBEC6vC9nc1bH3UM/A8MHdfT19R/cOHDuyrfupqtoqlVoFHBKRJGKKd5XvOb70NKTRKSxnc894YKCDJ7vBOdrkunDtwtU3riKwaAaG+3fu69q0bX2yIiGn5MCBi/GkpbK36uArT/4yu/jf6vwQ0kDQ8nNOk8cDA0HfB9vOvauA5tyVc8ja9e2hSJCUksAhxWVVtvT+2oHX1v5tlmO8QiEaMs9dPZFzmjweDOjL//pPV1oJtn0ndw+eGjRbzQhwUISi3tl0uH74zY738yBA729+++aOK5/tOdbTnFnX7T2Lc2bfR7z2zovgaamWXn3jeZihTMmGGk9f7/wwD+Kd9Tfe33L91zsu/8ueoc/3Hfl0108+3vbK6JpRSObbZvzh3z7P+T1yZLti88aqLM2lly8heRwfbHnzH7ov/m7vIHD8dufZG0+9+u6GO7h18QTkb+lbk/N7tHjpzTHUOVMV4WzcvW7V2lXegBfH8QzQOxs++mjr67/peeb3e4+C4A18hIO3OUDnV17e33RgUbyGRU+BB/5HN9/LuT5swB7N36iDy0M1C3GSwHCCLUAFuBT5x56fAgRMCUwMTE8ex9m2i0srFslsJZA5XvLgwt//4bOc90NF9ubi0oWJdHm0psIdCetsdlSuQG52jX6w5S0o1ngO0KXVL3h9ptsEQh/X0JK2rml3djyFBTKPfUet/KEX08GRTO+Bzacn5YzVJi1+pycW8kQjGKVA3uqYsKKh3wwuGrHbjFCaTI51pn3thvTJD1de++a2lo3+SRwi4Ft1lPugO+tbf/nv7EJmmaaYI/pITSxYERLIMEIrswXdhEaNvNnxwdvrf/XGuvf608fSjkY5LseM8yEBZGpdsuTZz8ej3BYcl1dY4BzUOWvf8HYYJjfgfeNnb1+FeYUsLlMQaQgualvsjnkT9SkOzlsgLFZbdErGgOyp7q+y1WmU2mgi2rml05POLDSubVZ8/8U8iDy1Xf2aaVueRafKSqAK99raQnO/9NKZ5ApH9uRS80yRBtPaDI6wy+y32kN2voxfjBWjCpFISSKta1r7j/Vfee0KtAHoB5DAdxXl1eg+qh66np2qrNz1qjXdjT0DG2DaQLBy4ecOtK7cCcapXNUC2mVRM/qFghI+KXSF3dVNNeUNFaGKsMaiK8F4yPOv51rkU/0dkMNmpsEYeaP+VaUOXaWXNfJduVrfpSks3ePF0rlskUBEybUmo9FqVurVEjmB4pjD6zTQRpKSU1q1wmjIAV1+dVQRYkFyZNdI3mDfXVDE2mPvRnefUdR4wIplKOBQbLaUwxGjbFQkJGU8iZiHYXyxmI+hLB53IZsF0uoMBCljc3gcvkAEt312elZ2LQYLdX3Z8sv/kTfM3Qq54Pn5bbjG8r7KavHZT6VJIxhyKTZPTHAwCQDxxDhLiLH4fI5QCFilIhFKECSlWMAqQSViMSmFj6hUnpsh3DsX8mHm86wn19bME/0+QCCYaTBk62cKSbmAkPFxKRsVA5ZATEjkclKpxCkKXuUajRAXYyRezOPNYcGqkiK7+naFqjMzTCZ0rVf+nOc7ibI090bJquXiv4qCYhb9mEAuwaQqTKYQyZWYjIKiiCmlgCSKBfx5HHYRl0MZtNaAh3bDvYYvEPIRq91qDEoBCLpwnukk+m40WUEbA1sOVSLAKZRUimTq7GwJCClXLCoWCtgYypdKZhUXKRiDJeDBDeo5fC5SUZcUWed8p3o9CA0otvc82LJUs3kiOV8iZ6F4CSriiPFSguSTBF9GElqlykIrbUa1w6SwGnReq7s8ijQtTWMAZETqT97Ic5yoTxjhA9CAqgbeyABpZgJQKa4oFohLhBIA4pEkWyJaIOQtREtZhLBUKSYsaqlNixooFiVCevdu5zM/YDPToep5jo+o+pGPAahYOx1oUJmGK5bO4wkXCjGBQsGTk0UojyPFFHa9yscovbS9IiCiKVPEhfzi0knYA7BN09te+N88x0dU09lPMzNkmM6TyIq4wgUCEUdCsAlioRhlERimk5OMCjcrxWaFPmK3lfs1AbOrMoS8fPm0yPoEi57afP53eY6PqPTJjwCIrX9crFQLZVQJJhbIKKGKEmrkhEmp8tBqn5F0qCiv3lEdsKTcujKrMeRABgYPiMxzAKh2+L08R1Dr8Bl0NoII99RmPx4dQktmwsp+bKYYXXmjFQ6eHZPDkQKOYM0n4xNBlUczf2qZT01nYSKBVM4SSeajaClFqJwmfdBKubQyh1IT1Dtr/eZKNx2zE3al1KZB1q5dhluLSoxT4vsuTHS81di1am5B4WMFt4H+3iJGENaK8NM3wyEMQZyOU9/EI3PnN9xYduwgq6A5MiH9m1DPMADxdPPkBiOh0Qopiq+QkbTa4LeaonZj2GSvckZaYp76AO6m6JgVZssUcSJeH62ycuH5Z2ptGW+38toXIRdV2vo3XtttoH92awoRVkdq9KtUCkMKEv5n7wekb64BIKGGI1Yq5nE5M+bPWyDil+CCH/KL5ojnEzaSSTK2Spuz1oOaJZaU0xBikksqkeqacGW1FzJLnUXwdBzv+K2+vdtvlyxbwUxgVM8XmRNulyxbwf/X8ue+ZJsL4TrlBqXKbIQGKFZTKjutchgwPS5mcHPCEmj0+Ro8AKQJ6U1xizluT7VUIen6WCziKKUhedJH/XigWzUtTAGyoMQeLZqBPK4Zqhkbf+YEeTf1Zi7S+EOZnlKZtZiC0NpohVmjsGkNPhMdovUBnc6v1pVpPbVeX11A7zdawvZoXQKprCwL+s0aa+bPq7IU3XTunyZajwN69gy8ndeQ6Z+teztmIYX41lsTT84pfeIDUZkYtlZiIweVCwVSvsai5pOljrCjvLHcVmbBdZjWofQk7I6o1eDRWwIW2DqqGI2IIhCTSUnBwxjnsHXTgAm29BPdxwGNjeEFSKHxWNWpm+XLooVIoXT7+DPvSN9cDVaYZZ7aoqBoqcxA0G69vcwSSHltQbPZR8dqy6I1QbPPYHCqMQoVK0USSoKRYqFYhNC0QqFAlUrMaCdZpql3FW7CGmrq+VHJ7Mxtj8wQoouvN9057Y6yxWKbphl9SpgGkNpGGT3ayuYk7dU5IpZ4fdgeNpt8ekuQphiS1BJCmYCDctgCbikqzMyQTkeYzAq336RyZH5wsZjH/uoO/16CWx3S4cIIhqf3qKVGicpG6V1qg0drcGvcCQeQaRxKwJIzpEgt8KVcRqdBqiMFuICLlgpEGMJY1EaT3O7U+cosZqeWsOZ+pLo6t+cNdn/BHZrdb4BkLoGUxpUOhUDBk5pJ2qc3+PVMwFiq5MFxeK91qpxJR6gmoLDIlGYlAOEKHKdIQi5DnB6T1a5x+ehUTShS4QsmPQoPxmEy/9DQLIrH9+d1y0m04vm/hHeNZPfRHGaGyi8O1AXooJGJMKhWKLfL4b3ao4ZXX43PGDCo3Kr44liyJanzagkTTupxAFLTaqPVpDHoEaffbHVqHR6D0aq2+xlHwGrymmQWMZvOMIHU9WFYVS0X/5jHAWo+/1nZjh/f/hnEYx5Xe2Wxplh0ScyWsDqrXDKb1BA2OssdCo8yvCjkrw8kWxKhxWFr3GKvcNiTNpyWSA0EocEVeoWOMSi1GiReWRZJuGMpL+PQ+WMud8ihcxikeopDlPINJRxmenYwFjNNEpGr4NKXNYKoKoeoLPO/nNy3xqliMwvXYzILCSjQ9OQuiombKbcC2gzw0VET0AQXlbmq3fCtrdwOQJak1ZFyiFQoV8LhYlyUEKES8f8BmIA7Ka4NUW4AAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/35547/WME%20Junction%20Angle%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/35547/WME%20Junction%20Angle%20Info.meta.js
// ==/UserScript==

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
/*global I18n, $, W*/


function run_ja() {
    "use strict";

    /*
	 * First some variable and enumeration definitions
	 */
    var newwmever = W.version.substring(1, 6) >= '2.252'

    var junctionangle_version = "2.2.16";

    var junctionangle_debug = 0;	//0: no output, 1: basic info, 2: debug 3: verbose debug, 4: insane debug

    var ja_last_restart = 0, ja_roundabout_points = [], ja_options = {}, ja_mapLayer;

    var TURN_ANGLE = 45.50;			//Turn vs. keep angle - based on map experiments (45.04 specified in Wiki).
    var U_TURN_ANGLE = 168.24;		//U-Turn angle based on map experiments.
    var GRAY_ZONE = 1.5;			//Gray zone angle intended to prevent from irregularities observed on map.
    var OVERLAPPING_ANGLE = 0.666;	//Experimentally measured overlapping angle.

    var ja_routing_type = {
        BC: "junction_none",
        KEEP: "junction_keep",
        KEEP_LEFT: "junction_keep_left",
        KEEP_RIGHT: "junction_keep_right",
        TURN: "junction_turn",
        TURN_LEFT: "junction_turn_left",
        TURN_RIGHT: "junction_turn_right",
        EXIT: "junction_exit",
        EXIT_LEFT: "junction_exit_left",
        EXIT_RIGHT: "junction_exit_right",
        U_TURN: "junction_u_turn",
        PROBLEM: "junction_problem",
        NO_TURN: "junction_no_turn",
        NO_U_TURN: "junction_no_u_turn",
        ROUNDABOUT: "junction_roundabout",
        ROUNDABOUT_EXIT: "junction_roundabout_exit",

        OverrideBC: "Override_none",
        OverrideCONTINUE: "Override_continue",
        OverrideKEEP_LEFT: "Override_keep_left",
        OverrideKEEP_RIGHT: "Override_keep_right",
        OverrideTURN_LEFT: "Override_turn_left",
        OverrideTURN_RIGHT: "Override_turn_right",
        OverrideEXIT: "Override_exit",
        OverrideEXIT_LEFT: "Override_exit_left",
        OverrideEXIT_RIGHT: "Override_exit_right",
        OverrideU_TURN: "Override_u_turn"
    };

    var ja_road_type = {
        //Streets
        NARROW_STREET: 22,
        STREET: 1,
        PRIMARY_STREET: 2,
        //Highways
        RAMP: 4,
        FREEWAY: 3,
        MAJOR_HIGHWAY: 6,
        MINOR_HIGHWAY: 7,
        //Other drivable
        DIRT_ROAD: 8,
        FERRY: 14,
        PRIVATE_ROAD: 17,
        PARKING_LOT_ROAD: 20,
        //Non-drivable
        WALKING_TRAIL: 5,
        PEDESTRIAN_BOARDWALK: 10,
        STAIRWAY: 16,
        RAILROAD: 18,
        RUNWAY: 19
    };

    var ja_vehicle_types = {
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

    var ja_settings = {
        defaultOn: { elementType: "checkbox", elementId: "_jaCbShowLayer", defaultValue: true },
        angleMode: { elementType: "select", elementId: "_jaSelAngleMode", defaultValue: "aDeparture", options: ["aAbsolute", "aDeparture"]},
        angleDisplay: { elementType: "select", elementId: "_jaSelAngleDisplay", defaultValue: "displayFancy", options: ["displayFancy", "displaySimple"]},
        angleDisplayArrows: { elementType: "select", elementId: "_jaSelAngleDisplayArrows", defaultValue: "⇐⇒⇖⇗⇑", options: ["<><>^", "⇦⇨⇦⇨⇧", "⇐⇒⇐⇒⇑", "←→←→↑", "⇐⇒⇖⇗⇑", "←→↖↗↑"]},
        override: { elementType: "checkbox", elementId: "_jaCbOverride", defaultValue: true, group: "guess" },
        overrideAngles: { elementType: "checkbox", elementId: "_jaCboverrideAngles", defaultValue: false, group: "override" },
        guess: { elementType: "checkbox", elementId: "_jaCbGuessRouting", defaultValue: true },
        noInstructionColor: { elementType: "color", elementId: "_jaTbNoInstructionColor", defaultValue: "#ffffff", group: "guess"},
        continueInstructionColor: { elementType: "color", elementId: "_jaTbContinueInstructionColor", defaultValue: "#ffffff", group: "guess"},
        keepInstructionColor: { elementType: "color", elementId: "_jaTbKeepInstructionColor", defaultValue: "#cbff84", group: "guess"},
        exitInstructionColor: { elementType: "color", elementId: "_jaTbExitInstructionColor", defaultValue: "#6cb5ff", group: "guess"},
        turnInstructionColor: { elementType: "color", elementId: "_jaTbTurnInstructionColor", defaultValue: "#4cc600", group: "guess"},
        uTurnInstructionColor: { elementType: "color", elementId: "_jaTbUTurnInstructionColor", defaultValue: "#b66cff", group: "guess"},
        noTurnColor: { elementType: "color", elementId: "_jaTbNoTurnColor", defaultValue: "#a0a0a0", group: "guess"},
        problemColor: { elementType: "color", elementId: "_jaTbProblemColor", defaultValue: "#feed40", group: "guess"},
        roundaboutOverlayDisplay: { elementType: "select", elementId: "_jaSelRoundaboutOverlayDisplay", defaultValue: "rOverNever", options: ["rOverNever","rOverSelected","rOverAlways"]},
        roundaboutOverlayColor: { elementType: "color", elementId: "_jaTbRoundaboutOverlayColor", defaultValue: "#aa0000", group: "roundaboutOverlayDisplay"},
        roundaboutColor: { elementType: "color", elementId: "_jaTbRoundaboutColor", defaultValue: "#ff8000", group: "roundaboutOverlayDisplay"},
        decimals: { elementType: "number", elementId: "_jaTbDecimals", defaultValue: 2, min: 0, max: 2},
        pointSize: { elementType: "number", elementId: "_jaTbPointSize", defaultValue: 12, min: 6, max: 20}
    };

    var ja_arrow = {
        get: function(at) {
            var arrows = ja_getOption("angleDisplayArrows");
            return arrows[at % arrows.length];
        },
        left: function() { return this.get(0); },
        right: function() { return this.get(1); },
        left_up: function() { return this.get(2); },
        right_up: function() { return this.get(3); },
        up: function() { return this.get(4); }
    };

    var ja_calculation_Interval = {
        set: function(){
            this.clear();
            ja_log("Starting IntervalID", 2);
            this.IntervalID = window.setInterval(ja_calculate, 500);
            //console.log("this",this);
        },
        clear: function(){
            if(typeof this.IntervalID === "number"){
                ja_log("Cleared IntervalID ID : " + this.IntervalID, 2);
                window.clearInterval(this.IntervalID);
                delete this.IntervalID;
                ja_calculate();
                //console.log("this",this);
            }
        }
    };

    function getselfeat () {
        if (newwmever){
            return window.W.selectionManager.getSelectedWMEFeatures();
        } else {
            return window.W.selectionManager.getSelectedFeatures();
        }
    }

    function testSelectedItem(){
        if (getselfeat().length > 1) { return; }

        var registerInterval = false;

        getselfeat().forEach(function(element) {
            switch (element._wmeObject.type) {
                case "node":
                case "segment":
                    registerInterval = true;
                    break;
                default:
                    break;
            }
        });

        if (registerInterval == true){
            ja_calculation_Interval.set();
        }else{
            ja_calculation_Interval.clear();
        }
        ja_log("ja_calculation_Interval.start = " + registerInterval,2);
    }
    /*
	 * Main logic functions
	 */

    function junctionangle_init() {

        //Listen for selected nodes change event
        //window.W.selectionManager.events.register("selectionchanged", null, ja_calculate);
        window.W.selectionManager.events.register("selectionchanged", null, testSelectedItem);

        //Temporary workaround. Beta editor changed the event listener logic, but live is still using the old version
        //if-else should be removed once not needed anymore
        /*		if("events" in window.W.model.segments) {
			//Live
			window.W.model.segments.events.on({
				"objectschanged": ja_calculate,
				"objectsremoved": ja_calculate
			});
			window.W.model.nodes.events.on({
				"objectschanged": ja_calculate,
				"objectsremoved": ja_calculate
			});
		} else if("_events" in window.W.model.segments) {
*/			//Beta editor
        window.W.model.segments.on({
            "objectschanged": ja_calculate,
            "objectsremoved": ja_calculate
        });
        window.W.model.nodes.on({
            "objectschanged": ja_calculate,
            "objectsremoved": ja_calculate
        });
        //		}

        //Recalculate on zoom end also
        window.W.map.olMap.events.register("zoomend", null, ja_calculate);
        window.W.map.olMap.events.register("move", null, ja_calculate);

        ja_load();
        ja_loadTranslations();

        setupHtml();

        //Add support for translations. Default (and fallback) is "en".
        //Note, don't make typos in "acceleratorName", as it has to match the layer name (with whitespace removed)
        // to actually work. Took me a while to figure that out...
        I18n.translations[window.I18n.locale].layers.name.junction_angles = ja_getMessage("name");

        /**
		 * Initialize JAI OpenLayers vector layer
		 */
        if (window.W.map.getLayersBy("uniqueName","junction_angles").length === 0) {

            // Create a vector layer and give it your style map.
            ja_mapLayer = new window.OpenLayers.Layer.Vector(ja_getMessage("name"), {
                displayInLayerSwitcher: true,
                uniqueName: "junction_angles",
                shortcutKey: "S+j",
                accelerator: "toggle" + ja_getMessage("name").replace(/\s+/g,''),
                className: "junction-angles",
                styleMap: new window.OpenLayers.StyleMap(ja_style())
            });

            //Set visibility according to user preference
            //ja_mapLayer.setVisibility(ja_getOption("defaultOn"));

            window.W.map.addLayer(ja_mapLayer);
            ja_log("version " + junctionangle_version + " loaded.", 0);

            ja_log(window.W.map, 3);
            ja_log(window.W.model, 3);
            ja_log(window.W.loginManager, 3);
            ja_log(window.W.selectionManager, 3);
            ja_log(ja_mapLayer, 3);
            ja_log(window.OpenLayers, 3);
        } else {
            ja_log("Oh, nice.. We already had a layer?", 3);
        }

        WazeWrap.Interface.AddLayerCheckbox("display", "Junction Angle Info", ja_getOption("defaultOn"), layerToggled);
        layerToggled(ja_getOption("defaultOn"))

        ja_apply();

        // MTE mode event
        /*
		W.app.modeController.model.bind('change:mode', function(){
		if (W.app.modeController.getState() === undefined){
		  createToggler();
		  setupHtml();
		  ja_apply();
		}
		});
		*/
        // reload after changing WME units
        W.prefs.on('change:isImperial', function(){
            setupHtml();
            ja_apply();
        });

        ja_calculate();
    }


    function setupHtml(){
        var i, ja_select_option, navTabs, tabContent;
        var ja_settings_dom = document.createElement("div");
        var ja_settings_dom_panel = document.createElement("div");
        var ja_settings_dom_content = document.createElement("div");
        var ja_settings_header = document.createElement('h4');
        var style = document.createElement('style');
        var form = document.createElement('form');
        var section = document.createElement('div');
        var ja_reset_button = document.createElement('button');
        var userTabs = document.getElementById('user-info');
        var ja_info = document.createElement('ul');
        var ja_version_elem = document.createElement('li');
        var jatab = document.createElement('li');

        /**
		 * Add JAI tab configuration options
		 */
        ja_settings_dom_panel.className = "side-panel-section";
        ja_settings_dom_content.className = "tab-content";
        ja_settings_header.appendChild(document.createTextNode(ja_getMessage("settingsTitle")));
        ja_settings_dom_content.appendChild(ja_settings_header);

        style.appendChild(document.createTextNode(function () {/*
			#jaOptions > *:first-child {
				margin-top: 1em;
			}
			#jaOptions * {
				vertical-align: middle;
			}
			#jaOptions label {
				display: inline;
			}
			#jaOptions input, select {
				display: inline;
				margin-right: 7px;
				box-sizing: border-box;
				border: 1px solid #cccccc;
				border-radius: 5px;
				padding: 3px;
			}
			#jaOptions input[type="number"] {
				width: 4em;
				padding: 6px;
			}
			#jaOptions input[type="color"] {
				width: 15%;
				height: 2em;
				padding: 4px;
			}
			@supports (-webkit-appearance:none) {
				#jaOptions input[type="color"] {
					padding: 0px 2px 0px 2px;
				}
			}
			#jaOptions .disabled {
				position: relative;
			}
			#jaOptions .disabled:after {
				content: " ";
				z-index: 10;
				display: block;
				position: absolute;
				height: 100%;
				top: 0;
				left: 0;
				right: 0;
				background: rgba(255, 255, 255, 0.666);
			}
			*/}.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]));

        section.className = "form-group";
        form.className = "attributes-form side-panel-section";
        section.id = "jaOptions";
        ja_log("---------- Creating settings HTML ----------", 2);
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
            var setting = ja_settings[a];
            var ja_controls_container = document.createElement('div');
            var ja_input = document.createElement('input');
            var ja_label = document.createElement('label');
            ja_controls_container.className = "controls-container";
            ja_input.type = setting.elementType;
            switch (setting.elementType) {
                case 'color':
                    ja_input.id = setting.elementId;
                    ja_controls_container.appendChild(ja_input);
                    break;
                case 'number':
                    ja_input.id = setting.elementId;
                    ja_input.setAttribute("min", setting.min);
                    ja_input.setAttribute("max", setting.max);
                    ja_controls_container.appendChild(ja_input);
                    break;
                    /*
				case 'text':
					ja_input.id = setting.elementId;
					ja_input.size = (setting.max ? setting.max : 8);
					ja_input.maxlength = (setting.max ? setting.max : 7);
					ja_controls_container.appendChild(ja_input);
					break;
				*/
                case 'checkbox':
                    ja_input.id = setting.elementId;
                    ja_controls_container.appendChild(ja_input);
                    break;
                case 'select':
                    ja_input = document.createElement('select'); //Override <input> with <select>
                    ja_input.id = setting.elementId;
                    for(i = 0; i < setting.options.length; i++) {
                        ja_select_option = document.createElement('option');
                        ja_select_option.value = setting.options[i];
                        ja_select_option.appendChild(document.createTextNode(ja_getMessage(setting.options[i])));
                        ja_input.appendChild(ja_select_option);
                    }
                    ja_controls_container.appendChild(ja_input);
                    break;
                default:
                    ja_log("Unknown setting type " + setting.elementType, 2);
            }

            ja_input.onchange = function() { ja_onchange(this); };

            ja_label.setAttribute("for", setting.elementId);
            ja_label.appendChild(document.createTextNode(ja_getMessage(a)));
            ja_controls_container.appendChild(ja_label);

            section.appendChild(ja_controls_container);
        });
        section.appendChild(document.createElement('br'));

        ja_reset_button.type = "button";
        ja_reset_button.className = "btn btn-default";
        ja_reset_button.addEventListener("click", ja_reset, true);
        ja_reset_button.appendChild(document.createTextNode(ja_getMessage("resetToDefault")));

        section.appendChild(document.createElement('div'));
        section.appendChild(ja_reset_button);

        form.appendChild(section);
        ja_settings_dom_content.appendChild(form);

        navTabs = userTabs.getElementsByClassName('nav-tabs')[0];
        tabContent = userTabs.getElementsByClassName('tab-content')[0];

        ja_settings_dom.id = "sidepanel-ja";
        ja_settings_dom.className = "tab-pane";

        ja_settings_dom_content.style.paddingTop = "0";

        ja_settings_dom.appendChild(style);

        ja_settings_dom_panel.appendChild(ja_settings_dom_content);
        ja_settings_dom.appendChild(ja_settings_dom_panel);

        //Add some version info etc
        ja_info.className = "list-unstyled -side-panel-section";
        ja_info.style.fontSize = "11px";

        ja_version_elem.appendChild(document.createTextNode(ja_getMessage("name") + ": v" + junctionangle_version));
        ja_info.appendChild(ja_version_elem);

        //Add some useful links
        ja_info.appendChild(ja_helpLink(
            'https://wiki.waze.com/wiki/Roundabouts/USA#Understanding_navigation_instructions', 'roundaboutnav')
                           );
        ja_info.appendChild(ja_helpLink('https://www.waze.com/forum/viewtopic.php?f=819&t=61926', 'ghissues'));

        ja_settings_dom.appendChild(ja_info);

        tabContent.appendChild(ja_settings_dom);

        jatab.innerHTML = '<!--suppress HtmlUnknownAnchorTarget --><a href="#sidepanel-ja" data-toggle="tab">JAI</a>';
        if(navTabs != null) { navTabs.appendChild(jatab); }
    }

    function layerToggled(visible) {
        ja_mapLayer.setVisibility(visible);
    }

    function ja_guess_routing_instruction(node, s_in_a, s_out_a, angles) {
        /**********************************************************************************
	 * @param node Junction node
	 * @param s_in_a "In" segment id
	 * @param s_out_a "Out" segment id
	 * @param angles array of segment absolute angles [0] angle, [1] segment id, 2[?]
	 * @returns {string}
	 **********************************************************************************/
        var s_n = {}, s_in = null, s_out = {}, street_n = {}, street_in = null, angle;
        var s_in_id = s_in_a;
        var s_out_id = s_out_a;

        ja_log("Guessing routing instructions from " + s_in_a + " via node " + node.attributes.id + " to " + s_out_a,2);
        ja_log(node, 4);
        ja_log(s_in_a, 4);
        ja_log(s_out_a, 4);
        ja_log(angles, 3);

        s_in_a = window.$.grep(angles, function(element){
            return element[1] === s_in_a;
        });
        s_out_a = window.$.grep(angles, function(element){
            return element[1] === s_out_a;
        });

        node.attributes.segIDs.forEach(function(element) {
            if (element === s_in_id) {
                s_in = getByID(node.model.segments,element);
                street_in = ja_get_streets(element);
                //Set empty name for streets if not defined
                if(typeof street_in.primary === 'undefined') { street_in.primary = {}; }
                if(typeof street_in.primary.name === 'undefined') {
                    street_in.primary.name = "";
                }
            } else {
                if(element === s_out_id) {
                    //store for later use
                    s_out[element] = getByID(node.model.segments,element);
                    //Set empty name for streets if not defined
                    if(typeof s_out[element].primary === 'undefined') {
                        s_out[element].primary = { name: "" };
                    }
                }
                s_n[element] = getByID(node.model.segments,element);
                street_n[element] = ja_get_streets(element);
                if(typeof street_n[element].primary === 'undefined') {
                    street_n[element].primary = { name: ""};
                }
            }
        });

        ja_log(s_n, 3);
        ja_log(street_n,3);
        ja_log(s_in,3);
        ja_log(street_in,2);
        if (s_in === null || street_in === null) {
            //Should never happen, but adding to make code validation happy
            return ja_routing_type.PROBLEM;
        }

        angle = ja_angle_diff(s_in_a[0], (s_out_a[0]), false);
        ja_log("turn angle is: " + angle, 2);

        //Check turn possibility first
        if(!ja_is_turn_allowed(s_in, node, s_out[s_out_id])) {
            ja_log("Turn is disallowed!", 2);
            return ja_routing_type.NO_TURN;
        }

        //seb-d59:
        //Check override instruction
        if (ja_getOption("override")){
            var WazeModelGraphTurnData = window.require("Waze/Model/Graph/TurnData");
            var turn = new WazeModelGraphTurnData();
            turn = window.W.model.getTurnGraph().getTurnThroughNode(node, getByID(window.W.model.segments,s_in_id), getByID(window.W.model.segments,s_out_id));
            var opcode = turn.getTurnData().getInstructionOpcode();
            switch (opcode) {
                case "NONE":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideBC;
                    break;
                case "CONTINUE":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideCONTINUE;
                    break;
                case "TURN_LEFT":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideTURN_LEFT;
                    break;
                case "TURN_RIGHT":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideTURN_RIGHT;
                    break;
                case "KEEP_LEFT":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideKEEP_LEFT;
                    break;
                case "KEEP_RIGHT":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideKEEP_RIGHT;
                    break;
                case "EXIT_LEFT":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideEXIT_LEFT;
                    break;
                case "EXIT_RIGHT":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideEXIT_RIGHT;
                    break;
                case "UTURN":
                    ja_log("turn opcode override is: " + opcode, 2);
                    return ja_routing_type.OverrideU_TURN;
                    break;
                default:
                    ja_log("no turn opcode override", 2);
            }
        }

        //Roundabout - no true instruction guessing here!
        if (s_in.attributes.junctionID) {
            if (s_out[s_out_id].attributes.junctionID) {
                ja_log("Roundabout continuation - no instruction", 2);
                return ja_routing_type.BC;
            } else {
                ja_log("Roundabout exit - no instruction", 2);
                //exit just to visually distinguish from roundabout continuation
                return ja_routing_type.ROUNDABOUT_EXIT;
            }
        } else if (s_out[s_out_id].attributes.junctionID) {
            ja_log("Roundabout entry - no instruction", 2);
            //no instruction since it's normally the only continuation - true instruction can be computed for
            //entry-exit selection only
            return ja_routing_type.BC;
        }

        //Check for U-turn, which is emitted even if there is only one s-out
        if (Math.abs(angle) > U_TURN_ANGLE + GRAY_ZONE) {
            ja_log("Angle is >= 170 - U-Turn", 2);
            return ja_routing_type.U_TURN;
        } else if (Math.abs(angle) > U_TURN_ANGLE - GRAY_ZONE) {
            ja_log("Angle is in gray zone 169-171", 2);
            return ja_routing_type.PROBLEM;
        }

        //No other possible turns
        if(node.attributes.segIDs.length <= 2) {
            ja_log("Only one possible turn - no instruction", 2);
            return ja_routing_type.BC;
        } //No instruction

        /*
		 *
		 * Here be dragons!
		 *
		 */
        if(Math.abs(angle) < TURN_ANGLE - GRAY_ZONE) {
            ja_log("Turn is <= 44", 2);

            /*
			 * Filter out disallowed and non-"BC eligible" turns.
			 */
            ja_log("Original angles and street_n:", 2);
            ja_log(angles, 2);
            ja_log(street_n, 2);
            ja_log(s_n, 2);
            angles = angles.filter(function (a) {
                ja_log("Filtering angle: " + ja_angle_diff(s_in_a, a[0], false), 2);
                if(s_out_id === a[1] ||
                   (typeof s_n[a[1]] !== 'undefined' &&
                    ja_is_turn_allowed(s_in, node, s_n[a[1]]) &&
                    Math.abs(ja_angle_diff(s_in_a, a[0], false)) < TURN_ANGLE //Any angle above 45.04 is not eligible
                   )) {
                    ja_log(true, 4);
                    return true;
                } else {
                    ja_log(false, 4);
                    if(street_n[a[1]]) {
                        delete s_n[a[1]];
                        delete street_n[a[1]];
                    }
                    return false;
                }
            });
            ja_log("Filtered angles and street_n:", 2);
            ja_log(angles, 2);
            ja_log(street_n, 2);
            ja_log(s_n, 2);

            if(angles.length <= 1) {
                ja_log("Only one allowed turn left", 2);
                return ja_routing_type.BC;
            } //No instruction

            /*
			 * Apply simplified BC logic
			 */
            var bc_matches = {}, bc_prio = 0, bc_count = 0;
            var bc_collect = function(a, prio) {
                ja_log("Potential BC = " + prio, 2);
                ja_log(a, 2);
                if (prio > bc_prio) { //highest priority wins now
                    bc_matches = {};
                    bc_prio = prio;
                    bc_count = 0;
                }
                if (prio === bc_prio) {
                    bc_matches[a[1]] = a;
                    bc_count++;
                }
                ja_log("BC candidates:", 2);
                ja_log(bc_matches, 2);
            };

            //Check each eligible turn against routing rules
            for(var k=0; k< angles.length; k++) {
                var a = angles[k];

                ja_log("Checking angle " + k, 2);
                ja_log(a, 2);

                var tmp_angle = ja_angle_diff(s_in_a[0], a[0], false);
                ja_log(tmp_angle, 2);

                var tmp_s_out = {};
                tmp_s_out[a[1]] = s_n[a[1]];
                var tmp_street_out = {};
                tmp_street_out[a[1]] = street_n[a[1]];

                var name_match = ja_primary_name_match(street_in, tmp_street_out) ||
                    ja_alt_name_match(street_in, tmp_street_out) ||
                    ja_cross_name_match(street_in, tmp_street_out);

                if(name_match && ja_segment_type_match(s_in, tmp_s_out)) {
                    ja_log("BC name and type match", 2);
                    bc_collect(a, 3);
                } else if(name_match) {
                    ja_log("BC name match", 2);
                    bc_collect(a, 2);
                } else if(ja_segment_type_match(s_in, tmp_s_out)) {
                    ja_log("BC type match", 2);
                    bc_collect(a, 1);
                }
                //Else: Non-BC
            }

            //If s-out is the only BC, that's it.
            if (bc_matches[s_out_id] !== undefined && bc_count === 1) {
                ja_log("\"straight\": no instruction", 2);
                return ja_routing_type.BC;
            }

            ja_log("BC logic did not apply; using old default rules instead.", 2);

            //FZ69617: Sort angles in left most first order
            ja_log("Unsorted angles", 4);
            ja_log(angles, 4);
            angles.sort(function(a, b) { return ja_angle_dist(a[0], s_in_a[0][0]) - ja_angle_dist(b[0], s_in_a[0][0]); });
            ja_log("Sorted angles", 4);
            ja_log(angles, 4);

            //wlodek76: FIXING KEEP LEFT/RIGHT regarding to left most segment
            //WIKI WAZE: When there are more than two segments less than 45.04°, only the left most segment will be
            // KEEP LEFT, all the rest will be KEEP RIGHT
            //FZ69617: Wiki seems to be wrong here - experiments shows that "more than two" must be read as "at least two"
            //FZ69617: Wiki also does not mention differences between RHT and LHT countries for this consideration,
            // but map experiments seem to prove that we have to use reverse logic for LHT countries.
            if (!s_in.model.isLeftHand) { //RHT
                if (angles[0][1] === s_out_id) { //s-out is left most segment

                    //wlodek76: KEEP LEFT/RIGHT overlapping case
                    //WIKI WAZE: If the left most segment is overlapping another segment, it will also be KEEP RIGHT.
                    if (!ja_overlapping_angles(angles[0][0], angles[1][0])) {
                        ja_log("Left most <45 segment: keep left", 2);
                        return ja_routing_type.KEEP_LEFT;
                    }
                }
            } else { //LHT
                //FZ69617: KEEP RIGHT/LEFT logic for right most segment
                //MISSING IN WIKI: When there are at least two segments less than 45.04°, only the right most segment will
                // be KEEP RIGHT, all the rest will be KEEP LEFT
                if (angles[angles.length - 1][1] === s_out_id) { //s-out is right most segment

                    //FZ69617: KEEP RIGHT/LEFT overlapping case
                    //MISSING IN WIKI: If the right most segment is overlapping another segment, it will also be KEEP LEFT.
                    if (!ja_overlapping_angles(angles[angles.length - 1][0], angles[angles.length - 2][0])) {
                        ja_log("Right most <45 segment: keep right", 2);
                        return ja_routing_type.KEEP_RIGHT;
                    }
                }
            }

            //FZ69617: Two overlapping segments logic
            //WAZE WIKI: If the only two segments less than 45.04° overlap each other, neither will get an instruction.
            //...
            //wlodek76: Three overlapping segments logic
            //MISSING IN WIKI: If the ONLY THREE segments less than 45.04° overlap each other, neither will get an instruction.
            //...
            //FZ69617: Two or more overlapping segments logic
            //MISSING IN WIKI: If there are two or more segments less than 45.04° and all these segmentes overlap each other,
            // neither will get an instruction.
            var overlap_i = 1;
            while(overlap_i < angles.length &&
                  ja_overlapping_angles(angles[0][0], angles[overlap_i][0])) {
                ++overlap_i;
            }
            if(overlap_i > 1 && overlap_i === angles.length) {
                ja_log("Two or more overlapping segments only: no instruction", 2);
                return ja_routing_type.BC;
            }

            //Primary to non-primary
            if(ja_is_primary_road(s_in) && !ja_is_primary_road(s_out[s_out_id])) {
                ja_log("Primary to non-primary = exit", 2);
                return s_in.model.isLeftHand ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
            }

            //Ramp to non-primary or non-ramp
            if(ja_is_ramp(s_in) && !ja_is_primary_road(s_out[s_out_id]) && !ja_is_ramp(s_out[s_out_id]) ) {
                ja_log("Ramp to non-primary and non-ramp = exit", 2);
                return s_in.model.isLeftHand ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
            }

            ja_log("DEFAULT: keep", 2);
            return s_in.model.isLeftHand ? ja_routing_type.KEEP_LEFT : ja_routing_type.KEEP_RIGHT;
        } else if (Math.abs(angle) < TURN_ANGLE + GRAY_ZONE) {
            ja_log("Angle is in gray zone 44-46", 2);
            return ja_routing_type.PROBLEM;
        } else {
            ja_log("Normal turn", 2);
            return ja_routing_type.TURN; //Normal turn (left|right)
        }
    }
    function findLayer(partOf_id){
        var layer;
        for (var i=0; i < window.W.map.layers.length; i++){
            if (window.W.map.layers[i].id.search(partOf_id) != -1){
                layer={id: window.W.map.layers[i].id, name: window.W.map.layers[i].name, number : i};
                ja_log("Number: " + i + "; id : " + layer.id + "; name :" + layer.name ,3);
                return layer;
            }
        }

    }
    function testLayerZIndex(){
        // seb-d59:
        // Here i search the selection layer and i read the z-index
        // and put JAI's layer under this one.
        var zIndex = 0;
        ja_mapLayer.setZIndex(500);
        // now selection layer has no name ...
        var layer = {}
        layer = findLayer("OpenLayers_Layer_Vector_RootContainer");
        var layerOBJ = window.W.map.layers[layer.number];
        //ja_log("id : " + layerOBJ.id + "; name :" + layerOBJ.name + " zIndex: " + layerOBJ.getZIndex() ,3);
        zIndex = parseInt(layerOBJ.getZIndex()) - 1 ;
        ja_mapLayer.setZIndex(zIndex);
        ja_log("ja_mapLayer new zIndex: " + ja_mapLayer.getZIndex() ,3);



    }

    function ja_calculate_real() {
        var ja_start_time = Date.now();
        var ja_nodes = [];
        var restart = false;
        ja_log("Actually calculating now", 2);
        ja_roundabout_points = [];
        ja_log(window.W.map, 3);
        if (typeof ja_mapLayer === 'undefined') {
            return;
        }
        //clear old info
        ja_mapLayer.destroyFeatures();


        testLayerZIndex();

        if (ja_getOption("roundaboutOverlayDisplay") === "rOverAlways") {
            ja_draw_roundabout_overlay();
        }

        //try to show all angles for all selected segments
        if (getselfeat().length === 0) { return; }
        ja_log("Checking junctions for " + getselfeat().length + " segments", 2);

        getselfeat().forEach(function(element) {
            ja_log(element, 3);
            switch (element._wmeObject.type) {
                case "node":
                    ja_nodes.push(element._wmeObject.attributes.id);
                    break;
                case "segment":
                    //segments selected?
                    if (getAttributeValue(element._wmeObject, "attributes.fromNodeID") != null &&
                        ja_nodes.indexOf(getAttributeValue(element._wmeObject, "attributes.fromNodeID")) === -1) {
                        ja_nodes.push(element._wmeObject.attributes.fromNodeID);
                    }
                    if (getAttributeValue(element._wmeObject, "attributes.toNodeID") != null &&
                        ja_nodes.indexOf(getAttributeValue(element._wmeObject, "attributes.toNodeID")) === -1) {
                        ja_nodes.push(element._wmeObject.attributes.toNodeID);
                    }
                    break;
                case "venue":
                    break;
                default:
                    ja_log("Found unknown item type: " + element._wmeObject.type, 2);
                    break;
            }
            ja_log(ja_nodes, 2);
        });

        function getAttributeValue(object, path, defaultValue = null) {
            return path.split(".").reduce((obj, key) => obj?.[key], object) ?? defaultValue;
        }

        //Figure out if we have a selected roundabout and do some magic
        var ja_selected_roundabouts = {};

        ja_nodes.forEach(function(node) {
            ja_log(getByID(window.W.model.nodes,node), 3);

            var tmp_s = null, tmp_n = null, tmp_junctionID = null;
            if(getByID(window.W.model.nodes,node) == null ||
               typeof getByID(window.W.model.nodes,node).attributes.segIDs === 'undefined') {
                return;
            }
            getByID(window.W.model.nodes,node).attributes.segIDs.forEach(function(segment) {
                ja_log(segment, 3);

                if(getAttributeValue(getByID(window.W.model.segments,segment), "attributes.junctionID")) {
                    ja_log("Roundabout detected: " + getByID(window.W.model.segments,segment).attributes.junctionID, 3);
                    tmp_junctionID = getByID(window.W.model.segments,segment).attributes.junctionID;
                } else {
                    tmp_s = segment;
                    tmp_n = node;
                }
                ja_log("tmp_s: " + (tmp_s === null ? 'null' : tmp_s), 3);
            });
            ja_log("final tmp_s: " + (tmp_s === null ? 'null' : tmp_s), 3);
            if(tmp_junctionID === null) { return; }
            if (ja_selected_roundabouts.hasOwnProperty(tmp_junctionID)) {
                ja_selected_roundabouts[tmp_junctionID].out_s = tmp_s;
                ja_selected_roundabouts[tmp_junctionID].out_n = node;
            } else {
                ja_selected_roundabouts[tmp_junctionID] = {
                    'in_s': tmp_s,
                    'in_n': tmp_n,
                    'out_s': null,
                    'out_n': null,
                    'p': getByID(window.W.model.junctions,tmp_junctionID).getOLGeometry()
                };
            }
        });

        //Do some fancy painting for the roundabouts...
        for(var tmp_roundabout in ja_selected_roundabouts) {
            if (ja_selected_roundabouts.hasOwnProperty(tmp_roundabout)) {
                ja_log(tmp_roundabout, 3);
                ja_log(ja_selected_roundabouts[tmp_roundabout], 3);

                //New roundabouts don't have coordinates yet..
                if(typeof ja_selected_roundabouts[tmp_roundabout].p === 'undefined' ||
                   ja_selected_roundabouts[tmp_roundabout].out_n === null
                  ) {
                    continue;
                }

                //Draw circle overlay for this roundabout
                if(ja_getOption("roundaboutOverlayDisplay") === "rOverSelected") {
                    ja_draw_roundabout_overlay(tmp_roundabout);
                }

                //Transform LonLat to actual layer projection
                var tmp_roundabout_center = ja_coordinates_to_point([ja_selected_roundabouts[tmp_roundabout].p.x, ja_selected_roundabouts[tmp_roundabout].p.y]);
                var angle = ja_angle_between_points(
                    getByID(window.W.model.nodes,ja_selected_roundabouts[tmp_roundabout].in_n).getOLGeometry(),
                    tmp_roundabout_center,
                    getByID(window.W.model.nodes,ja_selected_roundabouts[tmp_roundabout].out_n).getOLGeometry()
                );
                ja_mapLayer.addFeatures([
                    new window.OpenLayers.Feature.Vector(
                        tmp_roundabout_center,
                        {
                            angle: ja_round(angle) + '°',
                            ja_type: ja_is_roundabout_normal(
                                tmp_roundabout,
                                ja_selected_roundabouts[tmp_roundabout].in_n) ? ja_routing_type.TURN : ja_routing_type.ROUNDABOUT
                        }
                    )
                ]);
            }
        }


        var ja_label_distance;
        /*
		 * Define a base distance to markers, depending on the zoom level
		 */
        switch (window.W.map.olMap.zoom) {
            case 22: //10:
                ja_label_distance = 2.8;
                break;
            case 21: //9:
                ja_label_distance = 4;
                break;
            case 20: //8:
                ja_label_distance = 8;
                break;
            case 19: //7:
                ja_label_distance = 15;
                break;
            case 18: //6:
                ja_label_distance = 25;
                break;
            case 17: //5:
                ja_label_distance = 40;
                break;
            case 16: //4:
                ja_label_distance = 80;
                break;
            case 15: //3:
                ja_label_distance = 150;
                break;
            case 14: //2:
                ja_label_distance = 300;
                break;
            case 13: //1:
                ja_label_distance = 400;
                break;
            default:
                ja_log("Unsupported zoom level: " + window.W.map.olMap.zoom + "!", 2);
        }

        ja_label_distance *= (1 + (0.2 * parseInt(ja_getOption("decimals"))));

        ja_log("zoom: " + window.W.map.olMap.zoom + " -> distance: " + ja_label_distance, 2);


        /**
		 * Collect double-turn (inc. U-turn) segments info
		 */
        var doubleTurns = {

            data: {}, //Structure: map<s_id, map<s_out_id, list<{s_in_id, angle, turn_type}>>>

            collect: function (s_id, s_in_id, s_out_id, angle, turn_type) {
                ja_log("Collecting double-turn path from " + s_in_id + " to " + s_out_id
                       + " via " + s_id + " with angle " + angle + " type: " + turn_type, 2);
                var info = this.data[s_id];
                if (info === undefined) {
                    info = this.data[s_id] = {};
                }
                var list = info[s_out_id];
                if (list === undefined) {
                    list = info[s_out_id] = [];
                }
                list.push({ s_in_id: s_in_id, angle: angle, turn_type: turn_type });
            },

            forEachItem: function (s_id, s_out_id, fn) {
                var info = this.data[s_id];
                if (info !== undefined) {
                    var list = info[s_out_id];
                    if (list !== undefined) {
                        list.forEach(function(item, i) {
                            fn(item, i);
                        });
                    }
                }
            }
        };

        //Loop through all 15m or less long segments and collect double-turn disallowed ones
        if (ja_getOption("angleMode") === "aDeparture" && ja_nodes.length > 1) {
            getselfeat().forEach(function (selectedSegment) {
                var segmentId = selectedSegment._wmeObject.attributes.id;
                var segment = window.W.model.segments.objects[segmentId];
                ja_log("Checking " + segmentId + " for double turns ...", 2);

                var len = ja_segment_length(segment);
                ja_log("Segment " + segmentId + " length: " + len, 2);

                if (Math.round(len) <= 15) {

                    var fromNode = getByID(window.W.model.nodes,segment.attributes.fromNodeID);
                    var toNode = getByID(window.W.model.nodes,segment.attributes.toNodeID);
                    var a_from = ja_getAngleMidleSeg(segment.attributes.fromNodeID, segment);
                    var a_to = ja_getAngleMidleSeg(segment.attributes.toNodeID, segment);

                    fromNode.attributes.segIDs.forEach(function (fromSegmentId) {
                        if (fromSegmentId === segmentId) return;
                        var fromSegment = window.W.model.segments.objects[fromSegmentId];
                        if(!ja_is_up_to_primary_road(fromSegment)) return;
                        var from_a = ja_getAngle(segment.attributes.fromNodeID, fromSegment);
                        var from_angle = ja_angle_diff(from_a, a_from, false);
                        ja_log("Segment from " + fromSegmentId + " angle: " + from_a + ", turn angle: " + from_angle, 2);

                        toNode.attributes.segIDs.forEach(function (toSegmentId) {
                            if (toSegmentId === segmentId) return;
                            var toSegment = window.W.model.segments.objects[toSegmentId];
                            if(!ja_is_up_to_primary_road(toSegment)) return;
                            var to_a = ja_getAngle(segment.attributes.toNodeID, toSegment);
                            var to_angle = ja_angle_diff(to_a, a_to, false);
                            ja_log("Segment to " + toSegmentId + " angle: " + to_a + ", turn angle: " + to_angle, 2);

                            var angle = Math.abs(to_angle - from_angle);
                            ja_log("Angle from " + fromSegmentId + " to " + toSegmentId + " is: " + angle, 2);

                            //Determine whether a turn is disallowed
                            if (angle >= 175 - GRAY_ZONE && angle <= 185 + GRAY_ZONE) {
                                var turn_type = (angle >= 175 + GRAY_ZONE && angle <= 185 - GRAY_ZONE) ?
                                    ja_routing_type.NO_U_TURN : ja_routing_type.PROBLEM;

                                if (ja_is_turn_allowed(fromSegment, fromNode, segment) &&
                                    ja_is_turn_allowed(segment, toNode, toSegment)) {
                                    doubleTurns.collect(segmentId, fromSegmentId, toSegmentId, angle, turn_type);
                                }
                                if (ja_is_turn_allowed(toSegment, toNode, segment) &&
                                    ja_is_turn_allowed(segment, fromNode, fromSegment)) {
                                    doubleTurns.collect(segmentId, toSegmentId, fromSegmentId, angle, turn_type);
                                }
                            }
                        });
                    });
                }
            });
        }

        ja_log("Collected double-turn segments:", 2);
        ja_log(doubleTurns.data, 2);


        //Start looping through selected nodes
        for (var i = 0; i < ja_nodes.length; i++) {
            var node = getByID(window.W.model.nodes,ja_nodes[i]);
            var angles = [];
            var ja_selected_segments_count = 0;
            var ja_selected_angles = [];
            var a;

            if (node == null || !node.hasOwnProperty('attributes')) {
                //Oh oh.. should not happen? We want to use a node that does not exist
                ja_log("Oh oh.. should not happen?",2);
                ja_log(node, 2);
                ja_log(ja_nodes[i], 2);
                ja_log(window.W.model, 3);
                ja_log(window.W.model.nodes, 3);
                continue;
            }
            //check connected segments
            var ja_current_node_segments = node.attributes.segIDs;
            ja_log(node, 2);

            //ignore of we have less than 2 segments
            if (ja_current_node_segments.length <= 1) {
                ja_log("Found only " + ja_current_node_segments.length + " connected segments at " + ja_nodes[i] +
                       ", not calculating anything...", 2);
                continue;
            }

            ja_log("Calculating angles for " + ja_current_node_segments.length + " segments", 2);
            ja_log(ja_current_node_segments, 3);

            ja_current_node_segments.forEach(function (nodeSegment, j) {
                var s = window.W.model.segments.objects[nodeSegment];
                if(typeof s === 'undefined') {
                    //Meh. Something went wrong, and we lost track of the segment. This needs a proper fix, but for now
                    // it should be sufficient to just restart the calculation
                    ja_log("Failed to read segment data from model. Restarting calculations.", 1);
                    if(ja_last_restart === 0) {
                        ja_last_restart = new Date().getTime();
                        setTimeout(function(){ja_calculate();}, 500);
                    }
                    restart = true;
                }
                a = ja_getAngle(ja_nodes[i], s);
                ja_log("Segment " + nodeSegment + " angle is " + a, 2);
                angles[j] = [a, nodeSegment, s == null ? false : s.isSelected()];
                if (s == null ? false : s.isSelected()) {
                    ja_selected_segments_count++;
                }
            });

            if(restart) { return; }

            //make sure we have the selected angles in correct order
            ja_log(ja_current_node_segments, 3);
            getselfeat().forEach(function (selectedSegment) {
                var selectedSegmentId = selectedSegment._wmeObject.attributes.id;
                ja_log("Checking if " + selectedSegmentId + " is in current node", 3);
                if(ja_current_node_segments.indexOf(selectedSegmentId) >= 0) {
                    ja_log("It is!", 4);
                    //find the angle
                    for(var j=0; j < angles.length; j++) {
                        if(angles[j][1] === selectedSegmentId) {
                            ja_selected_angles.push(angles[j]);
                            break;
                        }
                    }
                } else {
                    ja_log("It's not..", 4);
                }
            });

            ja_log(angles, 3);

            var ha, point;
            //if we have two connected segments selected, do some magic to get the turn angle only =)
            if (ja_selected_segments_count === 2) {
                var ja_extra_space_multiplier = 1;

                a = ja_angle_diff(ja_selected_angles[0][0], ja_selected_angles[1][0], false);

                ha = (parseFloat(ja_selected_angles[0][0]) + parseFloat(ja_selected_angles[1][0]))/2;
                if((Math.abs(ja_selected_angles[0][0]) + Math.abs(ja_selected_angles[1][0])) > 180 &&
                   ((ja_selected_angles[0][0] < 0 && ja_selected_angles[1][0] > 0) ||
                    (ja_selected_angles[0][0] > 0 && ja_selected_angles[1][0] < 0))
                  ) {
                    ha += 180;
                }

                if (Math.abs(a) > 120) {
                    ja_log("Sharp angle", 2);
                    ja_extra_space_multiplier = 2;
                }

                //Move point a bit if it's on the top (Bridge icon will obscure it otherwise)
                if(ha > 40 && ha < 120) { ja_extra_space_multiplier = 2; }

                ja_log("Angle between " + ja_selected_angles[0][1] + " and " + ja_selected_angles[1][1] + " is " +
                       a + " and position for label should be at " + ha, 3);

                //Guess some routing instructions based on segment types, angles etc
                var ja_junction_type = ja_routing_type.TURN; //Default to old behavior

                if(ja_getOption("guess")) {
                    ja_log(ja_selected_angles, 2);
                    ja_log(angles, 2);
                    ja_junction_type =
                        ja_guess_routing_instruction(node, ja_selected_angles[0][1], ja_selected_angles[1][1], angles);
                    ja_log("Type is: " + ja_junction_type, 2);
                }
                //get the initial marker point
                point = new window.OpenLayers.Geometry.Point(
                    node.getOLGeometry().x + (ja_extra_space_multiplier * ja_label_distance * Math.cos((ha * Math.PI) / 180)),
                    node.getOLGeometry().y + (ja_extra_space_multiplier * ja_label_distance * Math.sin((ha * Math.PI) / 180))
                );
                ja_draw_marker(point, node, ja_label_distance, a, ha, true, ja_junction_type);

                //draw double turn markers
                doubleTurns.forEachItem(ja_selected_angles[0][1], ja_selected_angles[1][1], function(item) {
                    ja_draw_marker(point, node, ja_label_distance, item.angle, ha, true, item.turn_type);
                });
            }
            else {
                //sort angle data (ascending)
                angles.sort(function (a, b) {
                    return a[0] - b[0];
                });
                ja_log(angles, 3);
                ja_log(ja_selected_segments_count, 3);

                //get all segment angles
                angles.forEach(function(angle, j) {
                    a = (360 + (angles[(j + 1) % angles.length][0] - angle[0])) % 360;
                    ha = (360 + ((a / 2) + angle[0])) % 360;
                    var a_in = angles.filter(function(a) {
                        return !!a[2];
                    })[0];

                    //Show only one angle for nodes with only 2 connected segments and a single selected segment
                    // (not on both sides). Skipping the one > 180
                    if (ja_selected_segments_count === 1 &&
                        angles.length === 2 &&
                        a >=180 &&
                        ja_getOption("angleMode") !== "aDeparture"
                       ) {
                        ja_log("Skipping marker, as we need only one of them", 2);
                        return;
                    }
                    if(ja_getOption("angleMode") === "aDeparture" && ja_selected_segments_count > 0) {
                        if(a_in[1] === angle[1]) {
                            ja_log("in == out. skipping.", 2);
                            return;
                        }
                        ja_log("Angle in:",2);
                        ja_log(a_in,2);
                        ja_log(ja_guess_routing_instruction(node, a_in[1], angle[1], angles), 2);
                        //FIXME: we might want to try to keep the marker on the segment, instead of just
                        //in the direction of the first part
                        ha = angle[0];
                        a = ja_angle_diff(a_in[0], angles[j][0], false);
                        point = new window.OpenLayers.Geometry.Point(
                            node.getOLGeometry().x + (ja_label_distance * 2 * Math.cos((ha * Math.PI) / 180)),
                            node.getOLGeometry().y + (ja_label_distance * 2 * Math.sin((ha * Math.PI) / 180))
                        );
                        ja_draw_marker(point, node, ja_label_distance, a, ha, true,
                                       ja_getOption("guess") ?
                                       ja_guess_routing_instruction(node, a_in[1], angle[1], angles) : ja_routing_type.TURN);

                        //draw double turn markers
                        doubleTurns.forEachItem(a_in[1], angle[1], function(item) {
                            ja_draw_marker(point, node, ja_label_distance, item.angle, ha, true, item.turn_type);
                        });

                    } else {
                        ja_log("Angle between " + angle[1] + " and " + angles[(j + 1) % angles.length][1] + " is " +
                               a + " and position for label should be at " + ha, 3);
                        point = new window.OpenLayers.Geometry.Point(
                            node.getOLGeometry().x + (ja_label_distance * 1.25 * Math.cos((ha * Math.PI) / 180)),
                            node.getOLGeometry().y + (ja_label_distance * 1.25 * Math.sin((ha * Math.PI) / 180))
                        );
                        ja_draw_marker(point, node, ja_label_distance, a, ha);
                    }
                });
            }
        }

        //testLayerZIndex();

        ja_last_restart = 0;
        var ja_end_time = Date.now();
        ja_log("Calculation took " + String(ja_end_time - ja_start_time) + " ms", 2);
    }


    /*
	 * Drawing functions
	 */
    /**
	 *
	 * @param point Estimated point for marker
	 * @param node Node the marker is for
	 * @param ja_label_distance Arbitrary distance to be used in moving markers further away etc
	 * @param a Angle to display
	 * @param ha Angle to marker from node (FIXME: either point or ha is probably unnecessary)
	 * @param withRouting true: show routing guessing markers, false: show "normal" angle markers
	 * @param ja_junction_type If using routing, this needs to be set to the desired type
	 */
    function ja_draw_marker(point, node, ja_label_distance, a, ha, withRouting, ja_junction_type) {

        //Try to estimate of the point is "too close" to another point
        //(or maybe something else in the future; like turn restriction arrows or something)
        //FZ69617: Exctract initial label distance from point
        var ja_tmp_distance = Math.abs(ha) % 180 < 45 || Math.abs(ha) % 180 > 135 ?
            (point.x - node.getOLGeometry().x) / (Math.cos((ha * Math.PI) / 180)) :
        (point.y - node.getOLGeometry().y) / (Math.sin((ha * Math.PI) / 180));
        ja_log("Starting distance estimation", 3);
        while(ja_mapLayer.features.some(function(feature){
            if(typeof feature.attributes.ja_type !== 'undefined' && feature.attributes.ja_type !== 'roundaboutOverlay') {
                //Arbitrarily chosen minimum distance.. Should actually use the real bounds of the markers,
                //but that didn't work out.. Bounds are always 0..
                if(ja_label_distance / 1.4 > feature.geometry.distanceTo(point)) {
                    ja_log(ja_label_distance / 1.5 > feature.geometry.distanceTo(point) + " is kinda close..", 3);
                    return true;
                }
            }
            return false;
        })) {
            //add 1/4 of the original distance and hope for the best =)
            ja_tmp_distance += ja_label_distance / 4;
            ja_log("setting distance to " + ja_tmp_distance, 2);
            point = new window.OpenLayers.Geometry.Point(
                node.getOLGeometry().x + (ja_tmp_distance * Math.cos((ha * Math.PI) / 180)),
                node.getOLGeometry().y + (ja_tmp_distance * Math.sin((ha * Math.PI) / 180))
            );
        }
        ja_log("Distance estimation done", 3);

        var angleString = ja_round(Math.abs(a)) + "°";

        //FZ69617: Add direction arrows for turn instructions only
        if (ja_getOption("angleDisplay") === "displaySimple") {
            switch(ja_junction_type) {
                case ja_routing_type.TURN:
                    angleString = a > 0 ? ja_arrow.left() + angleString : angleString + ja_arrow.right();
                    break;
                case ja_routing_type.TURN_LEFT:
                    angleString = ja_arrow.left() + angleString;
                    break;
                case ja_routing_type.TURN_RIGHT:
                    angleString = angleString + ja_arrow.right();
                    break;
                case ja_routing_type.EXIT:
                case ja_routing_type.KEEP:
                    angleString = a > 0 ? ja_arrow.left_up() + angleString : angleString + ja_arrow.right_up();
                    break;
                case ja_routing_type.EXIT_LEFT:
                case ja_routing_type.KEEP_LEFT:
                    angleString = ja_arrow.left_up() + angleString;
                    break;
                case ja_routing_type.EXIT_RIGHT:
                case ja_routing_type.KEEP_RIGHT:
                    angleString += ja_arrow.right_up();
                    break;
                    //Override
                case ja_routing_type.OverrideBC:
                    angleString = ja_getOption("overrideAngles") ? angleString : "";
                    break;
                case ja_routing_type.OverrideCONTINUE:
                    angleString = ja_arrow.up() + (ja_getOption("overrideAngles") ? angleString : "");
                    break;
                case ja_routing_type.OverrideTURN_LEFT:
                    angleString = ja_arrow.left() + (ja_getOption("overrideAngles") ? angleString : "");
                    break;
                case ja_routing_type.OverrideTURN_RIGHT:
                    angleString = (ja_getOption("overrideAngles") ? angleString : "") + ja_arrow.right();
                    break;
                case ja_routing_type.OverrideEXIT_LEFT:
                case ja_routing_type.OverrideKEEP_LEFT:
                    angleString = ja_arrow.left_up() + (ja_getOption("overrideAngles") ? angleString : "");
                    break;
                case ja_routing_type.OverrideEXIT_RIGHT:
                case ja_routing_type.OverrideKEEP_RIGHT:
                    angleString = (ja_getOption("overrideAngles") ? angleString : "") + ja_arrow.right_up();
                default:
                    ja_log("No extra format for junction type: " + ja_junction_type, 2);
            }
        } else {
            switch(ja_junction_type) {
                case ja_routing_type.TURN:
                    angleString = (a > 0 ? ja_arrow.left() : ja_arrow.right()) + "\n" + angleString;
                    break;
                case ja_routing_type.TURN_LEFT:
                    angleString = ja_arrow.left() + "\n" + angleString;
                    break;
                case ja_routing_type.TURN_RIGHT:
                    angleString = ja_arrow.right() + "\n" + angleString;
                    break;
                case ja_routing_type.EXIT:
                case ja_routing_type.KEEP:
                    angleString = (a > 0 ? ja_arrow.left_up() : ja_arrow.right_up()) + "\n" + angleString;
                    break;
                case ja_routing_type.EXIT_LEFT:
                case ja_routing_type.KEEP_LEFT:
                    angleString = ja_arrow.left_up() + "\n" + angleString;
                    break;
                case ja_routing_type.EXIT_RIGHT:
                case ja_routing_type.KEEP_RIGHT:
                    angleString = ja_arrow.right_up() + "\n" + angleString;
                    break;
                case ja_routing_type.PROBLEM:
                    angleString = "?\n" + angleString;
                    break;
                    //Override
                case ja_routing_type.OverrideBC:
                    angleString = ja_getOption("overrideAngles") ? angleString : "";
                    break;
                case ja_routing_type.OverrideCONTINUE:
                    angleString = ja_arrow.up() + (ja_getOption("overrideAngles") ? ("\n" + angleString) : "");
                    break;
                case ja_routing_type.OverrideTURN_LEFT:
                    angleString = ja_arrow.left() + (ja_getOption("overrideAngles") ? ("\n" + angleString) : "");
                    break;
                case ja_routing_type.OverrideTURN_RIGHT:
                    angleString = ja_arrow.right() + (ja_getOption("overrideAngles") ? ("\n" + angleString) : "");
                    break;
                case ja_routing_type.OverrideEXIT_LEFT:
                case ja_routing_type.OverrideKEEP_LEFT:
                    angleString = ja_arrow.left_up() + (ja_getOption("overrideAngles") ? ("\n" + angleString) : "");
                    break;
                case ja_routing_type.OverrideEXIT_RIGHT:
                case ja_routing_type.OverrideKEEP_RIGHT:
                    angleString = ja_arrow.right_up() + (ja_getOption("overrideAngles") ? ("\n" + angleString) : "");
                    break;
                default:
                    ja_log("No extra format for junction type: " + ja_junction_type, 2);
            }
        }

        var anglePoint = withRouting ?
            new window.OpenLayers.Feature.Vector(
                point,
                { angle: angleString, ja_type: ja_junction_type }
            ): new window.OpenLayers.Feature.Vector(
                point,
                { angle: ja_round(a) + "°", ja_type: "generic" }
            );
        ja_log(anglePoint, 3);

        //Don't paint points inside an overlaid roundabout
        if(ja_roundabout_points.some(function (roundaboutPoint){
            return roundaboutPoint.containsPoint(point);
        })) {
            return;
        }

        //Draw a line to the point
        ja_mapLayer.addFeatures([
            new window.OpenLayers.Feature.Vector(
                new window.OpenLayers.Geometry.LineString([node.getOLGeometry(), point]),
                {},
                {strokeOpacity: 0.6, strokeWidth: 1.2, strokeDashstyle: "solid", strokeColor: "#ff9966"}
            )
        ]
                               );

        //push the angle point
        ja_mapLayer.addFeatures([anglePoint]);

    }

    function ja_draw_roundabout_overlay(junctionId) {
        (junctionId === undefined ? (window.W.model.junctions.getObjectArray()) : (function (junction) {
            return junction === undefined ? [] : [ junction ];
        })
         (getByID(window.W.model.junctions,junctionId))).forEach(function (element) {
            ja_log(element, 3);
            var nodes = {};
            element.attributes.segIDs.forEach(function(s) {
                var seg = getByID(window.W.model.segments,s);
                ja_log(seg, 3);
                nodes[seg.attributes.fromNodeID] = getByID(window.W.model.nodes,seg.attributes.fromNodeID);
                nodes[seg.attributes.toNodeID] = getByID(window.W.model.nodes,seg.attributes.toNodeID);
            });

            ja_log(nodes, 3);
            var center = ja_coordinates_to_point([element.getOLGeometry().x, element.getOLGeometry().y]);
            ja_log(center, 3);
            var distances = [];
            Object.getOwnPropertyNames(nodes).forEach(function(name) {
                ja_log("Checking " + name + " distance", 3);
                var dist = Math.sqrt(
                    Math.pow(nodes[name].getOLGeometry().x - center.x, 2) +
                    Math.pow(nodes[name].getOLGeometry().y - center.y, 2)
                );
                distances.push(dist);
            });
            ja_log(distances, 3);
            ja_log("Mean distance is " + distances.reduce(function(a,b){return a + b;}) / distances.length, 3);

            var circle = window.OpenLayers.Geometry.Polygon.createRegularPolygon(
                center,
                distances.reduce(function(a,b){return a + b;}) / distances.length,
                40,
                0
            );
            var roundaboutCircle = new window.OpenLayers.Feature.Vector(circle, {'ja_type': 'roundaboutOverlay'});
            ja_roundabout_points.push(circle);
            ja_mapLayer.addFeatures([roundaboutCircle]);
        });
    }


    /*
	 * Segment and routing helpers
	 */

    /**
	 * Check if segment in type matches any other segments
	 * @param segment_in
	 * @param segments
	 * @returns {boolean}
	 */
    function ja_segment_type_match(segment_in, segments) {
        ja_log(segment_in, 2);
        ja_log(segments, 2);

        return Object.getOwnPropertyNames(segments).some(function (segment_n_id, index) {
            var segment_n = segments[segment_n_id];
            ja_log("PT Checking element " + index, 2);
            ja_log(segment_n, 2);
            if(segment_n.attributes.id === segment_in.attributes.id) { return false; }
            ja_log("PT checking sn.rt " + segment_n.attributes.roadType +
                   " vs i.pt: " + segment_in.attributes.roadType, 2);
            return (segment_n.attributes.roadType === segment_in.attributes.roadType);
        });
    }

    function ja_is_primary_road(seg) {
        var t = seg.attributes.roadType;
        return t === ja_road_type.FREEWAY || t === ja_road_type.MAJOR_HIGHWAY || t === ja_road_type.MINOR_HIGHWAY;
    }

    function ja_is_up_to_primary_road(seg) {
        var t = seg.attributes.roadType;
        return t === ja_road_type.FREEWAY || t === ja_road_type.RAMP || t === ja_road_type.MAJOR_HIGHWAY || t === ja_road_type.MINOR_HIGHWAY || t === ja_road_type.PRIMARY_STREET;
    }

    function ja_is_ramp(seg) {
        var t = seg.attributes.roadType;
        return t === ja_road_type.RAMP;
    }

    function ja_is_turn_allowed(s_from, via_node, s_to) {
        ja_log("Allow from " + s_from.attributes.id +
               " to " + s_to.attributes.id +
               " via " + via_node.attributes.id + "? " +
               via_node.isTurnAllowedBySegDirections(s_from, s_to) + " | " + s_from.isTurnAllowed(s_to, via_node), 2);

        //Is there a driving direction restriction?
        if(!via_node.isTurnAllowedBySegDirections(s_from, s_to)) {
            ja_log("Driving direction restriction applies", 3);
            return false;
        }

        //Is turn allowed by other means (e.g. turn restrictions)?
        if(!s_from.isTurnAllowed(s_to, via_node)) {
            ja_log("Other restriction applies", 3);
            return false;
        }

        if(s_to.attributes.fromNodeID === via_node.attributes.id) {
            ja_log("FWD direction",3);
            return ja_is_car_allowed_by_restrictions(s_to.attributes.fwdRestrictions);
        } else {
            ja_log("REV direction",3);
            return ja_is_car_allowed_by_restrictions(s_to.attributes.revRestrictions);
        }
    }

    function ja_is_car_allowed_by_restrictions(restrictions) {
        ja_log("Checking restrictions for cars", 2);
        if(typeof restrictions === 'undefined' || restrictions == null || restrictions.length === 0) {
            ja_log("No car type restrictions to check...", 3);
            return true;
        }
        ja_log(restrictions, 3);

        return !restrictions.some(function(element) {
            /*jshint bitwise: false*/
            ja_log("Checking restriction " + element, 3);
            //noinspection JSBitwiseOperatorUsage
            var ret = element.allDay &&				//All day restriction
                element.days === 127 &&				//Every week day
                ( element.vehicleTypes === -1 ||	//All vehicle types
                 element.vehicleTypes & ja_vehicle_types.PRIVATE //or at least private cars
                );
            if (ret) {
                ja_log("There is an all-day-all-week restriction", 3);
                var fromDate = Date.parse(element.fromDate);
                var toDate = Date.parse(element.toDate);
                ja_log("From: " + fromDate + ", to: " + toDate + ". " + ret, 3);
                if(isNaN(fromDate && isNaN(toDate))) {
                    ja_log("No start nor end date defined");
                    return false;
                }
                var fRes, tRes;
                if(!isNaN(fromDate) && new Date() > fromDate) {
                    ja_log("From date is in the past", 3);
                    fRes = 2;
                } else if(isNaN(fromDate)) {
                    ja_log("From date is invalid/not set", 3);
                    fRes = 1;
                } else {
                    ja_log("From date is in the future: " + fromDate, 3);
                    fRes = 0;
                }
                if(!isNaN(toDate) && new Date() < toDate) {
                    ja_log("To date is in the future", 3);
                    tRes = 2;
                } else if(isNaN(toDate)) {
                    ja_log("To date is invalid/not set", 3);
                    tRes = 1;
                } else {
                    ja_log("To date is in the past: " + toDate, 3);
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

    /**
	 * From wiki:
	 * A Cross-match is when the primary name of one segment is identical to the alternate name of an adjacent segment.
	 * It had the same priory as a Primary name match. In order for a Cross match to work there must be at least one
	 * alt name on both involved segments (even though they don't necessarily match each other). It will work even if
	 * the are no Primary names on those segments. It will not work if all three segments at a split have a matching
	 * Primary name or a matching Alternate name.
	 * @param street_in
	 * @param streets
	 * @returns {boolean}
	 */
    function ja_cross_name_match(street_in, streets) {
        ja_log("CN: init", 2);
        ja_log(street_in, 2);
        ja_log(streets, 2);
        return Object.getOwnPropertyNames(streets).some(function (street_n_id, index) {
            var street_n_element = streets[street_n_id];
            ja_log("CN: Checking element " + index, 2);
            ja_log(street_n_element, 2);
            return (street_in.secondary.some(function (street_in_secondary){
                ja_log("CN2a: checking n.p: " + street_n_element.primary.attributes.name +
                       " vs in.s: " + street_in_secondary.attributes.name, 2);

                //wlodek76: CROSS-MATCH works when two compared segments contain at least one ALT NAME
                //when alt name is empty cross-match does not work
                //FZ69617: This no longer seems to be needed
                //if (street_n_element.secondary.length === 0) { return false; }

                return street_n_element.primary.attributes.name === street_in_secondary.attributes.name;
            }) || street_n_element.secondary.some(function (street_n_secondary) {
                ja_log("CN2b: checking in.p: " + street_in.primary.attributes.name + " vs n.s: " + street_n_secondary.attributes.name, 2);

                //wlodek76: CROSS-MATCH works when two compared segments contain at least one ALT NAME
                //when alt name is empty cross-match does not work
                //FZ69617: This no longer seems to be needed
                //if (street_in.secondary.length === 0) { return false; }

                //wlodek76: missing return from checking primary name with alternate names
                return street_in.primary.attributes.name === street_n_secondary.attributes.name;
            }));
        });
    }

    function ja_alt_name_match(street_in, streets) {
        return Object.getOwnPropertyNames(streets).some(function (street_n_id, index) {
            var street_n_element = streets[street_n_id];
            ja_log("AN alt name check: Checking element " + index, 2);
            ja_log(street_n_element, 2);

            if(street_in.secondary.length === 0) { return false; }
            if(street_n_element.secondary.length === 0) { return false; }

            return street_in.secondary.some(function (street_in_secondary, index2) {
                ja_log("AN2 checking element " + index2, 2);
                ja_log(street_in_secondary, 2);
                return street_n_element.secondary.some(function (street_n_secondary_element, index3) {
                    ja_log("AN3 Checking in.s: " + street_in_secondary.attributes.name +
                           " vs n.s." + index3 + ": " + street_n_secondary_element.attributes.name, 2);
                    return street_in_secondary.attributes.name === street_n_secondary_element.attributes.name;
                });
            });
        });
    }

    function ja_primary_name_match(street_in, streets) {
        ja_log("PN", 2);
        ja_log(street_in, 2);
        ja_log(streets, 2);
        return Object.getOwnPropertyNames(streets).some(function (id, index, array) {
            var element = streets[id];
            ja_log("PN Checking element " + index + " of " + array.length, 2);
            ja_log(element, 2);
            return (element.primary.attributes.name === street_in.primary.attributes.name);
        });
    }

    function ja_get_streets(segmentId) {
        var primary =
            window.W.model.streets.objects[window.W.model.segments.objects[segmentId].attributes.primaryStreetID];
        var secondary = [];
        window.W.model.segments.objects[segmentId].attributes.streetIDs.forEach(function (element) {
            secondary.push(window.W.model.streets.objects[element]);
        });
        ja_log(primary, 3);
        ja_log(secondary, 3);
        return { primary: primary, secondary: secondary };
    }

    /**
	 * Computes segment's length in meters
	 * @param segment Segment to compute the length of
	 * @returns {number}
	 */
    function ja_segment_length(segment) {
        var len = segment.getOLGeometry().getGeodesicLength(window.W.map.olMap.projection);
        ja_log("segment: " + segment.attributes.id
               + " computed len: " + len + " attrs len: " + segment.attributes.length, 3);
        return len;
    }


    /**
	 * Checks whether the two segments (connected at the same node) overlap each other.
	 * @param a1 Angle of the 1st segment
	 * @param a2 Angle of the 2nd segment
	 */
    function ja_overlapping_angles(a1, a2) {
        // If two angles are close < 2 degree they are overlapped.
        // Method of recognizing overlapped segment by server is unknown for me yet, I took this from WME Validator
        // information about this.
        // TODO: verify overlapping check on the side of routing server.
        return Math.abs(ja_angle_diff(a1, a2, true)) < OVERLAPPING_ANGLE;
    }


    /*
	 * Misc math and map element functions
	 */

    /**
	 *
	 * @param p0 From point
	 * @param p1 Center point
	 * @param p2 To point
	 * @returns {number}
	 */
    function ja_angle_between_points(p0,p1,p2) {
        ja_log("p0 " + p0,3);
        ja_log("p1 " + p1,3);
        ja_log("p2 " + p2,3);
        var a = Math.pow(p1.x-p0.x,2) + Math.pow(p1.y-p0.y,2);
        var b = Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2);
        var c = Math.pow(p2.x-p0.x,2) + Math.pow(p2.y-p0.y,2);
        var angle = Math.acos((a+b-c) / Math.sqrt(4*a*b)) / (Math.PI / 180);
        ja_log("angle is " + angle,3);
        return angle;
    }

    /**
	 * get absolute (or turn) angle between 2 inputs.
	 * 0,90,true	-> 90	0,90,false	-> -90
	 * 0,170,true	-> 170	0,170,false	-> -10
	 * @param aIn absolute s_in angle (from node)
	 * @param aOut absolute s_out angle (from node)
	 * @param absolute return absolute or turn angle?
	 * @returns {number}
	 */
    function ja_angle_diff(aIn, aOut, absolute) {
        var a = parseFloat(aOut) - parseFloat(aIn);
        if(a > 180) { a -= 360; }
        if(a < -180) { a+= 360; }
        return absolute ? a : (a > 0 ? a - 180 : a + 180);
    }

    function ja_angle_dist(a, s_in_angle) {
        ja_log("Computing out-angle " + a + " distance to in-angle " + s_in_angle, 4);
        var diff = ja_angle_diff(a, s_in_angle, true);
        ja_log("Diff is " + diff + ", returning: " + (diff < 0 ? diff + 360 : diff), 4);
        return diff < 0 ? diff + 360 : diff;
    }

    function ja_is_roundabout_normal(junctionID, n_in) {
        ja_log("Check normal roundabout", 3);
        var junction = getByID(window.W.model.junctions,junctionID);
        var nodes = {};
        var numValidExits = 0;
        junction.attributes.segIDs.forEach(function (element, index) {
            var s = getByID(window.W.model.segments,element);
            ja_log("index: " + index, 3);
            //ja_log(s, 3);
            if (!nodes.hasOwnProperty(s.attributes.toNodeID)) {
                ja_log("Adding node id: " + s.attributes.toNodeID, 3);
                //Check if node has allowed exits
                var allowed = false;
                var currNode = getByID(window.W.model.nodes,s.attributes.toNodeID);
                ja_log(currNode, 3);
                currNode.attributes.segIDs.forEach(function (element2) {
                    var s_exit = getByID(window.W.model.segments,element2);
                    ja_log(s_exit, 3);
                    if (s_exit.attributes.junctionID === null) {
                        ja_log("Checking: " + s_exit.attributes.id, 3);
                        if (currNode.isTurnAllowedBySegDirections(s, s_exit)) {
                            //Exit possibly allowed
                            ja_log("Exit allowed", 3);
                            allowed = true;
                        } else {
                            ja_log("Exit not allowed", 3);
                        }
                    } else {
                        //part of the junction.. Ignoring
                        ja_log(s_exit.attributes.id + " is in the roundabout. ignoring", 3);
                    }
                });
                if (allowed) {
                    numValidExits++;
                    nodes[s.attributes.toNodeID] = getByID(window.W.model.nodes,s.attributes.toNodeID);
                }
            }
        });

        var is_normal = true;
        ja_log(n_in, 3);
        ja_log(junction, 3);
        ja_log(nodes, 3);

        //If we have more than 4 possible exits, the roundabout is non-normal, and we don't want to paint the
        //offending angles.
        if (numValidExits > 4) { return false; }

        for (var n in nodes) {
            if (nodes.hasOwnProperty(n)) {
                ja_log("Checking " + n, 3);
                if (String(n) === String(n_in)) {
                    ja_log("Not comparing to n_in ;)", 3);
                } else {
                    var angle = ja_angle_between_points(
                        getByID(window.W.model.nodes,n_in).getOLGeometry(),
                        ja_coordinates_to_point([junction.getOLGeometry().x, junction.getOLGeometry().y]),
                        getByID(window.W.model.nodes,n).getOLGeometry()
                    );
                    ja_log("Angle is: " + angle, 3);
                    ja_log("Normalized angle is: " + (angle % 90), 3);
                    //angle = Math.abs((angle%90 - 90))
                    angle = Math.abs((angle % 90));
                    ja_log("Angle is: " + angle, 3);
                    // 90 +/- 15 is considered "normal"
                    if (angle <= 15 || 90 - angle <= 15) {
                        ja_log("turn is normal", 3);
                    } else {
                        ja_log("turn is NOT normal", 3);
                        is_normal = false;
                        //Push a marker on the node to show which exit is "not normal"
                        ja_mapLayer.addFeatures([
                            new window.OpenLayers.Feature.Vector(
                                getByID(window.W.model.nodes,n).getOLGeometry(),
                                {
                                    angle: '±' + ja_round(Math.min(angle, 90 - angle)),
                                    ja_type: ja_routing_type.ROUNDABOUT
                                }
                            )]
                                               );
                    }
                }
            }
        }
        return is_normal;
    }


    /**
	 * Helper to get get correct projections for roundabout center point
	 */

    function ja_coordinates_to_point(coordinates) {
        return new window.OpenLayers.Geometry.Point(
            coordinates[0],
            coordinates[1]
        )
    }

    function getOLFeatureGeometryFromSegment(segment) {
        const feature = W.map.segmentLayer.features.find((feat) => feat.attributes.wazeFeature.id === segment.attributes.id);
        return feature.geometry;
    }

    function ja_get_first_point(segment) {
        return getOLFeatureGeometryFromSegment(segment).components[0];
        //        return segment.getOLGeometry().components[0];
    }

    function ja_get_last_point(segment) {
        return getOLFeatureGeometryFromSegment(segment).components.at(-1);
        //        return segment.getOLGeometry().components[segment.getOLGeometry().components.length - 1];
    }

    function ja_get_second_point(segment) {
        return getOLFeatureGeometryFromSegment(segment).components[1];
        //        return segment.getOLGeometry().components[1];
    }

    function ja_get_next_to_last_point(segment) {
        return getOLFeatureGeometryFromSegment(segment).components.at(-2);
        //        return segment.getOLGeometry().components[segment.getOLGeometry().components.length - 2];
    }

    //get the absolute angle for a segment end point
    function ja_getAngle(ja_node, ja_segment) {
        ja_log("node: " + ja_node, 2);
        ja_log("segment: " + ja_segment, 2);
        if (ja_node == null || ja_segment == null) { return null; }
        var ja_dx, ja_dy;
        if (ja_segment.attributes.fromNodeID === ja_node) {
            ja_dx = ja_get_second_point(ja_segment).x - ja_get_first_point(ja_segment).x;
            ja_dy = ja_get_second_point(ja_segment).y - ja_get_first_point(ja_segment).y;
        } else {
            ja_dx = ja_get_next_to_last_point(ja_segment).x - ja_get_last_point(ja_segment).x;
            ja_dy = ja_get_next_to_last_point(ja_segment).y - ja_get_last_point(ja_segment).y;
        }
        ja_log(ja_node + " / " + ja_segment + ": dx:" + ja_dx + ", dy:" + ja_dy, 2);
        var ja_angle = Math.atan2(ja_dy, ja_dx);
        return ((ja_angle * 180 / Math.PI)) % 360;
    }

    //get the absolute angle for a midle segment (to prevent a false positive on the curved segment)
    function ja_getAngleMidleSeg(ja_node, ja_segment) {
        ja_log("node: " + ja_node, 2);
        ja_log("segment: " + ja_segment, 2);
        if (ja_node == null || ja_segment == null) { return null; }
        var ja_dx, ja_dy;
        if (ja_segment.attributes.fromNodeID === ja_node) {
            ja_dx = ja_get_last_point(ja_segment).x - ja_get_first_point(ja_segment).x;
            ja_dy = ja_get_last_point(ja_segment).y - ja_get_first_point(ja_segment).y;
        } else {
            ja_dx = ja_get_first_point(ja_segment).x - ja_get_last_point(ja_segment).x;
            ja_dy = ja_get_first_point(ja_segment).y - ja_get_last_point(ja_segment).y;
        }
        ja_log(ja_node + " / " + ja_segment + ": dx:" + ja_dx + ", dy:" + ja_dy, 2);
        var ja_angle = Math.atan2(ja_dy, ja_dx);
        return ((ja_angle * 180 / Math.PI)) % 360;
    }

    /**
	 * Decimal adjustment of a number. Borrowed (with some modifications) from
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
	 * ja_round(55.55); with 1 decimal // 55.6
	 * ja_round(55.549); with 1 decimal // 55.5
	 * ja_round(55); with -1 decimals // 60
	 * ja_round(54.9); with -1 decimals // 50
	 *
	 * @param	{Number}	value	The number.
	 * @returns	{Number}			The adjusted value.
	 */
    function ja_round(value) {
        var ja_rounding = -parseInt(ja_getOption("decimals"));
        var valueArray;
        if (typeof ja_rounding === 'undefined' || +ja_rounding === 0) {
            return Math.round(value);
        }
        value = +value;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof ja_rounding === 'number' && ja_rounding % 1 === 0)) {
            return NaN;
        }
        // Shift
        valueArray = value.toString().split('e');
        value = Math.round(+(valueArray[0] + 'e' + (valueArray[1] ? (+valueArray[1] - ja_rounding) : -ja_rounding)));
        // Shift back
        valueArray = value.toString().split('e');
        return +(valueArray[0] + 'e' + (valueArray[1] ? (+valueArray[1] + ja_rounding) : ja_rounding));
    }


    /*
	 * WME interface helper functions
	 */

    function ja_getOption(name) {
        ja_log("Loading option: " + name, 2);
        if(!ja_options.hasOwnProperty(name) || typeof ja_options[name] === 'undefined') {
            ja_options[name] = ja_settings[name].defaultValue;
        }
        //Check for invalid values
        //Select values
        if(ja_settings[name].elementType === "select" && ja_settings[name].options.lastIndexOf(ja_options[name]) < 0) {
            ja_log(ja_settings[name].options, 2);
            ja_log("Found invalid value for setting " + name + ": " + ja_options[name] + ". Using default.", 2);
            ja_options[name] = ja_settings[name].defaultValue;
        }
        //Color values
        else if(ja_settings[name].elementType === "color" && String(ja_options[name]).match(/#[0-9a-f]{6}/) == null) {
            ja_log("Found invalid value for setting " + name + ": \"" + ja_options[name] + "\". Using default.", 2);
            ja_options[name] = ja_settings[name].defaultValue;
        }
        //Numeric values
        else if(ja_settings[name].elementType === "number") {
            var minValue = typeof ja_settings[name].min === 'undefined' ? Number.MIN_VALUE : ja_settings[name].min;
            var maxValue = typeof ja_settings[name].max === 'undefined' ? Number.MAX_VALUE : ja_settings[name].max;
            if(isNaN(ja_options[name]) || ja_options[name] < minValue || ja_options[name] > maxValue) {
                ja_log("Found invalid value for setting " + name + ": \"" + ja_options[name] + "\". Using default.", 2);
                ja_options[name] = ja_settings[name].defaultValue;
            }
        }
        //Checkboxes
        else if(ja_settings[name].elementType === "checkbox" && ja_options[name] !== true && ja_options[name] !== false) {
            ja_log("Found invalid value for setting " + name + ": \"" + ja_options[name] + "\". Using default.", 2);
            ja_options[name] = ja_settings[name].defaultValue;
        }

        ja_log("Got value: " + ja_options[name], 2);
        return ja_options[name];
    }

    function ja_setOption(name, val) {
        ja_options[name] = val;
        if(localStorage) {
            localStorage.setItem("wme_ja_options", JSON.stringify(ja_options));
        }
        ja_log(ja_options,3);
    }

    var ja_onchange = function(e) {
        var applyPending = false;
        var settingName = Object.getOwnPropertyNames(ja_settings).filter(function(a){
            ja_log(ja_settings[a], 4);
            return ja_settings[a].elementId === e.id;
        })[0];
        ja_log(e, 3);
        ja_log(settingName, 3);
        switch(ja_settings[settingName].elementType) {
            case "checkbox":
                ja_log("Checkbox setting " + e.id + ": stored value is: " + ja_options[settingName] + ", new value: " + e.checked, 3);
                if (ja_options[settingName] !== e.checked) { applyPending = true; }
                break;
            case "select":
            case "color":
            case "number":
                ja_log("Setting " + e.id + ": stored value is: " + ja_options[settingName] + ", new value: " + e.value, 3);
                if (String(ja_options[settingName]) !== String(e.value)) { applyPending = true; }
                break;
            default:
                ja_log("Unknown setting " + e.id + ": stored value is: " + ja_options[settingName] + ", new value: " + e.value, 3);
        }

        function disable_input(element, disable) {
            element.disabled = disable;
            if (disable) {
                $(element.parentNode).addClass("disabled");
            } else {
                $(element.parentNode).removeClass("disabled");
            }
        }

        //Enable|disable certain dependent settings
        switch(e.id) {
            case ja_settings.override.elementId:
                Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
                    var setting = ja_settings[a];
                    if(setting.group && setting.group === 'override') {
                        ja_log(a + ": " + !e.checked , 3);
                        disable_input(document.getElementById(setting.elementId), (!e.checked || e.disabled) );
                    }
                });
                break;
            case ja_settings.guess.elementId:
                Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
                    var setting = ja_settings[a];
                    if(setting.group && (setting.group === 'guess' || setting.group === 'override')) {
                        ja_log(a + ": " + !e.checked , 3);
                        disable_input(document.getElementById(setting.elementId), !e.checked);
                    }
                });
                break;
            case ja_settings.roundaboutOverlayDisplay.elementId:
                Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
                    var setting = ja_settings[a];
                    if(setting.group && setting.group === 'roundaboutOverlayDisplay') {
                        ja_log(a +": " + e.value, 3);
                        disable_input(document.getElementById(setting.elementId), e.value === "rOverNever");
                    }
                });
                break;
            default:
                ja_log("Nothing to do for " + e.id, 2);
        }

        ja_log("Apply pending configuration changes? " + applyPending, 2);
        if(applyPending) {
            ja_log("Applying new settings now", 3);
            setTimeout(function(){ja_save();}, 500);

        } else {
            ja_log("No new settings to apply", 3);
        }
    };

    var ja_load = function loadJAOptions() {
        ja_log("Should load settings now.", 2);
        if(localStorage != null) {
            ja_log("We have local storage! =)",2);
            try {
                ja_options = JSON.parse(localStorage.getItem("wme_ja_options"));
            } catch (e){
                ja_log("Loading settings failed.. " + e.message, 2);
                ja_options = null;
            }
        }
        if(ja_options == null) {
            ja_reset();
        } else {
            ja_log(ja_options, 2);
            setTimeout(function(){ja_apply();}, 500);
        }
    };

    var ja_save = function saveJAOptions() {
        ja_log("Saving settings", 2);
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
            var setting = ja_settings[a];
            ja_log(setting, 2);
            switch (setting.elementType) {
                case "checkbox":
                    ja_setOption(a, document.getElementById(setting.elementId).checked);
                    break;
                case "color":
                    var re = /^#[0-9a-f]{6}$/;
                    if(re.test(document.getElementById(setting.elementId).value)) {
                        ja_setOption(a, document.getElementById(setting.elementId).value);
                    } else {
                        ja_setOption(a, ja_settings[a]['default']);
                    }
                    break;
                case "number":
                    var val = parseInt(document.getElementById(setting.elementId).value);
                    if(!isNaN(val) && val === parseInt(val) && setting.min <= val && val <= setting.max) {
                        ja_setOption(a, document.getElementById(setting.elementId).value);
                    } else {
                        ja_setOption(a, ja_settings[a]['default']);
                    }
                    break;
                case "text":
                case "select":
                    ja_setOption(a, document.getElementById(setting.elementId).value);
                    break;
                default:
                    ja_log("Unknown setting type " + setting.elementType, 2);
            }
        });
        ja_apply();
        return false;
    };

    var ja_apply = function applyJAOptions() {
        ja_log("Applying stored (or default) settings", 2);
        if(typeof window.W.map.getLayersBy("uniqueName","junction_angles")[0] === 'undefined') {
            ja_log("WME not ready yet, trying again in 400 ms", 2);
            setTimeout(function(){ja_apply();}, 400);
            return;
        }
        if (document.getElementById("sidepanel-ja") == null) {
            ja_log("WME not ready (no settings tab)", 2);
        } else {
            ja_log(Object.getOwnPropertyNames(ja_settings), 2);
            Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
                var setting = ja_settings[a];
                ja_log(a, 2);
                ja_log(setting, 2);
                ja_log(document.getElementById(setting.elementId), 2);
                switch (setting.elementType) {
                    case "checkbox":
                        document.getElementById(setting.elementId).checked = ja_getOption(a);
                        document.getElementById(setting.elementId).onchange(null);
                        break;
                    case "color":
                    case "number":
                    case "text":
                        document.getElementById(setting.elementId).value = ja_getOption(a);
                        break;
                    case "select":
                        document.getElementById(setting.elementId).value = ja_getOption(a);
                        document.getElementById(setting.elementId).onchange(null);
                        break;
                    default:
                        ja_log("Unknown setting type " + setting.elementType, 2);
                }
            });
        }
        window.W.map.getLayersBy("uniqueName","junction_angles")[0].styleMap = ja_style();
        ja_calculate_real();
        ja_log(ja_options, 2);
    };

    var ja_reset = function resetJAOptions() {
        ja_log("Resetting settings", 2);
        if(localStorage != null) {
            localStorage.removeItem("wme_ja_options");
        }
        ja_options = {};
        ja_apply();
        return false;
    };

    function ja_helpLink(url, text) {
        var elem = document.createElement('li');
        var l = document.createElement('a');
        l.href = url;
        l.target = "_blank";
        l.appendChild(document.createTextNode(ja_getMessage(text)));
        elem.appendChild(l);
        return elem;
    }

    var ja_calculation_timer = {
        start: function() {
            ja_log("Starting timer", 2);
            this.cancel();
            var ja_calculation_timer_self = this;
            this.timeoutID = window.setTimeout(function(){ja_calculation_timer_self.calculate();}, 200);
        },

        calculate: function() {
            ja_calculate_real();
            delete this.timeoutID;
        },

        cancel: function() {
            if(typeof this.timeoutID === "number") {
                window.clearTimeout(this.timeoutID);
                ja_log("Cleared timeout ID : " + this.timeoutID, 2);
                delete this.timeoutID;
            }
        }

    };

    function ja_calculate() {
        ja_calculation_timer.start();
    }

    function ja_get_contrast_color(hex_color) {
        ja_log("Parsing YIQ-based contrast color for: " + hex_color + " ...", 2);
        var r = parseInt(hex_color.substr(1, 2), 16);
        var g = parseInt(hex_color.substr(3, 2), 16);
        var b = parseInt(hex_color.substr(5, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    function ja_get_style_rule(routingType, fillColorOption) {
        return new window.OpenLayers.Rule(
            {
                filter: new window.OpenLayers.Filter.Comparison({
                    type: window.OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "ja_type",
                    value: routingType
                }),
                symbolizer: {
                    pointRadius: 3 + parseInt(ja_getOption("pointSize"), 10) +
                    (parseInt(ja_getOption("decimals")) > 0 ? 4 * parseInt(ja_getOption("decimals")) : 0),
                    fontSize: (parseInt(ja_getOption("pointSize")) - 1) + "px",
                    fillColor: ja_getOption(fillColorOption),
                    strokeColor: "#183800",
                    fontColor: ja_get_contrast_color(ja_getOption(fillColorOption))
                }
            });
    }
    function ja_get_styleOverride_rule(routingType, fillColorOption) {
        return new window.OpenLayers.Rule(
            {
                filter: new window.OpenLayers.Filter.Comparison({
                    type: window.OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "ja_type",
                    value: routingType
                }),
                symbolizer: {
                    pointRadius: 2+ parseInt(ja_getOption("pointSize"), 10) +
                    (parseInt(ja_getOption("decimals")) > 0 ? 4 * parseInt(ja_getOption("decimals")) : 0),
                    fontSize: (parseInt(ja_getOption("pointSize")) + (ja_getOption("overrideAngles") ? (-1) : 8)) + "px",
                    fillColor: ja_getOption(fillColorOption),
                    strokeColor: "#F68F23", //183800
                    strokeWidth: 5,
                    fontColor: ja_get_contrast_color(ja_getOption(fillColorOption))

                }
            });
    }

    function ja_style() {
        ja_log("Point radius will be: " + (parseInt(ja_getOption("pointSize"), 10)) +
               (parseInt(ja_getOption("decimals") > 0 ? (4 * parseInt(ja_getOption("decimals"))).toString() : "0")), 2);
        return new window.OpenLayers.Style({
            fillColor: "#ffcc88",
            strokeColor: "#ff9966",
            strokeWidth: 2,
            label: "${angle}",
            fontWeight: "bold",
            pointRadius: parseInt(ja_getOption("pointSize"), 10) +
            (parseInt(ja_getOption("decimals")) > 0 ? 4 * parseInt(ja_getOption("decimals")) : 0),
            fontSize: "10px"
        }, {
            rules: [
                new window.OpenLayers.Rule({
                    symbolizer: {
                    }
                }),
                ja_get_style_rule(ja_routing_type.TURN, "turnInstructionColor"),
                ja_get_style_rule(ja_routing_type.TURN_LEFT, "turnInstructionColor"),
                ja_get_style_rule(ja_routing_type.TURN_RIGHT, "turnInstructionColor"),
                ja_get_style_rule(ja_routing_type.BC, "noInstructionColor"),
                ja_get_style_rule(ja_routing_type.KEEP, "keepInstructionColor"),
                ja_get_style_rule(ja_routing_type.KEEP_LEFT, "keepInstructionColor"),
                ja_get_style_rule(ja_routing_type.KEEP_RIGHT, "keepInstructionColor"),
                ja_get_style_rule(ja_routing_type.EXIT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.EXIT_LEFT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.EXIT_RIGHT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.NO_TURN, "noTurnColor"),
                ja_get_style_rule(ja_routing_type.PROBLEM, "problemColor"),
                ja_get_style_rule(ja_routing_type.ROUNDABOUT, "roundaboutColor"),
                ja_get_style_rule(ja_routing_type.ROUNDABOUT_EXIT, "exitInstructionColor"),
                ja_get_style_rule(ja_routing_type.U_TURN, "uTurnInstructionColor"),
                ja_get_style_rule(ja_routing_type.NO_U_TURN, "problemColor"),

                ja_get_styleOverride_rule(ja_routing_type.OverrideTURN_LEFT, "turnInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideTURN_RIGHT, "turnInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideBC, "noInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideCONTINUE, "continueInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideKEEP_LEFT, "keepInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideKEEP_RIGHT, "keepInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideEXIT, "exitInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideEXIT_LEFT, "exitInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideEXIT_RIGHT, "exitInstructionColor"),
                ja_get_styleOverride_rule(ja_routing_type.OverrideU_TURN, "uTurnInstructionColor"),


                new window.OpenLayers.Rule(
                    {
                        filter: new window.OpenLayers.Filter.Comparison({
                            type: window.OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: "ja_type",
                            value: "roundaboutOverlay"
                        }),
                        symbolizer: {
                            pointRadius: 3 + parseInt(ja_getOption("pointSize"), 10) +
                            (parseInt(ja_getOption("decimals")) > 0 ? 4 * parseInt(ja_getOption("decimals")) : 0),
                            fontSize: "12px",
                            fillColor: ja_getOption("roundaboutOverlayColor"),
                            fillOpacity: 0.1,
                            strokeColor: ja_getOption("roundaboutOverlayColor"),
                            label: ""
                        }
                    })

            ]
        });
    }


    /*
	 * Translation helpers
	 */

    function ja_getMessage(key) {
        var tr = I18n.translate('ja.' + key), no_tr = I18n.missingTranslation('ja.' + key);
        return tr === no_tr ? key : tr;
    }

    function ja_loadTranslations() {
        var set_trans = function(def) {
            /*jshint -W093*/
            return I18n.translations[I18n.locale].ja = def;
        };

        ja_log("Loading translations",2);

        //Apply
        switch (I18n.locale) {
            default:
                //Default language (English)
                set_trans({
                    name: "Junction Angle Info",
                    settingsTitle: "Junction Angle Info settings",
                    resetToDefault: "Reset to default",
                    defaultOn: "Show layer by default",
                    aAbsolute: "Absolute",
                    aDeparture: "Departure",
                    angleMode: "Angle mode",
                    angleDisplay: "Angle display style",
                    angleDisplayArrows: "Direction arrows",
                    displayFancy: "Fancy",
                    displaySimple: "Simple",
                    override: "Check \"override instruction\"",
                    overrideAngles: "Show angles of \"override instruction\"",
                    guess: "Estimate routing instructions",
                    noInstructionColor: "Color for best continuation",
                    continueInstructionColor: "Color for continue straight prompt",
                    keepInstructionColor: "Color for keep prompt",
                    exitInstructionColor: "Color for exit prompt",
                    turnInstructionColor: "Color for turn prompt",
                    uTurnInstructionColor: "Color for U-turn prompt",
                    noTurnColor: "Color for disallowed turns",
                    problemColor: "Color for angles to avoid",
                    roundaboutColor: "Color for non-normal roundabouts",
                    roundaboutOverlayColor: "Color for roundabout overlay",
                    roundaboutOverlayDisplay: "Show roundabout",
                    rOverNever: "Never",
                    rOverSelected: "When selected",
                    rOverAlways: "Always",
                    decimals: "Number of decimals",
                    pointSize: "Base point size",
                    roundaboutnav: "WIKI: Roundabouts",
                    ghissues: "JAI issue tracker"
                });
                break;

                //Czech (čeština)
            case 'cs':
                set_trans({
                    name: "Junction Angle Info",
                    settingsTitle: "Nastavení JAI",
                    resetToDefault: "Výchozí nastavení",
                    defaultOn: "Vždy aktivní",
                    aAbsolute: "Absolutní",
                    aDeparture: "Odjezdový",
                    angleMode: "Styl zobrazení úhlů",
                    angleDisplay: "Styl výpisu úhlů",
                    angleDisplayArrows: "Směrové šipky",
                    displayFancy: "Zdobný",
                    displaySimple: "Jednoduchý",
                    override: "Zvýraznit vynucené hlasové pokyny",
                    overrideAngles: "Zobrazit úhly vynucených pokynů",
                    guess: "Odhadovat navigační hlášky",
                    noInstructionColor: "Bez hlášení",
                    continueInstructionColor: "\"Pokračujte rovně\"",
                    keepInstructionColor: "\"Držte se/Zůstaňte\"",
                    exitInstructionColor: "\"Sjeďte\"",
                    turnInstructionColor: "\"Odbočte\"",
                    uTurnInstructionColor: "\"Otočte se\"",
                    noTurnColor: "Nepovolené směry",
                    problemColor: "Nejasné úhly",
                    roundaboutColor: "Rozbité kruháče",
                    roundaboutOverlayColor: "Kruháče",
                    roundaboutOverlayDisplay: "ukazovat kruháče",
                    rOverNever: "Ne-",
                    rOverSelected: "Při výběru",
                    rOverAlways: "Vždy",
                    decimals: "Počet des. míst",
                    pointSize: "Velikost písma",
                    roundaboutnav: "US WIKI: Kruhové objezdy",
                    ghissues: "Hlášení problémů JAI"
                });
                break;

                //Finnish (Suomen kieli)
            case 'fi':
                set_trans({
                    name: "Risteyskulmat",
                    settingsTitle: "Rysteyskulmien asetukset",
                    resetToDefault: "Palauta",
                    defaultOn: "Näytä taso oletuksena",
                    aAbsolute: "Absoluuttinen",
                    aDeparture: "Käännös",
                    angleMode: "Kulmien näyttö",
                    angleDisplay: "Näyttötyyli",
                    angleDisplayArrows: "Suuntanuolet",
                    displayFancy: "Nätti",
                    displaySimple: "Yksinkertainen",
                    override: "Check \"override instruction\"",
                    overrideAngles: "Show angles of \"override instruction\"",
                    guess: "Arvioi reititysohjeet",
                    noInstructionColor: "ohjeeton \"Suora\"-väri",
                    continueInstructionColor: "Color for continue straight",
                    keepInstructionColor: "\"Pysy vasemmalla/oikealla\"-ohjeen väri",
                    exitInstructionColor: "\"Poistu\"-ohjeen väri",
                    turnInstructionColor: "\"Käänny\"-ohjeen väri",
                    uTurnInstructionColor: "\"Käänny ympäri\"-ohjeen väri",
                    noTurnColor: "Kielletyn käännöksen väri",
                    problemColor: "Vältettävien kulmien väri",
                    roundaboutColor: "Liikenneympyrän (jolla ei-suoria kulmia) ohjeen väri",
                    roundaboutOverlayColor: "Liikenneympyrän korostusväri",
                    roundaboutOverlayDisplay: "Korosta liikenneympyrä",
                    rOverNever: "Ei ikinä",
                    rOverSelected: "Kun valittu",
                    rOverAlways: "Aina",
                    decimals: "Desimaalien määrä",
                    pointSize: "Ympyrän peruskoko"
                });
                break;

                //Polish (język polski)
            case 'pl':
                set_trans({
                    settingsTitle: "Ustawienia",
                    resetToDefault: "Przywróć domyślne",
                    defaultOn: "Pokazać warstwę domyślnie",
                    aAbsolute: "Absolutne",
                    aDeparture: "Rozjazdy",
                    angleMode: "Tryb wyświetlania kątów",
                    angleDisplay: "Styl kierunków",
                    displayFancy: "Dwuliniowy",
                    displaySimple: "Prosty",
                    angleDisplayArrows: "Strzałki kierunków",
                    override: "Check \"override instruction\"",
                    overrideAngles: "Show angles of \"override instruction\"",
                    guess: "Szacuj komunikaty trasy",
                    noInstructionColor: "Kolor najlepszej kontynuacji",
                    continueInstructionColor: "Color for continue straight",
                    keepInstructionColor: "Kolor dla \"kieruj się\"",
                    exitInstructionColor: "Kolor dla \"zjedź\"",
                    turnInstructionColor: "Kolor dla \"skręć\"",
                    uTurnInstructionColor: "Kolor dla \"zawróć\"",
                    noTurnColor: "Kolor niedozwolonych manewrów",
                    problemColor: "Kolor problematycznych kątów",
                    roundaboutColor: "Kolor rond niestandardowych",
                    roundaboutOverlayColor: "Kolor znacznika rond",
                    roundaboutOverlayDisplay: "Pokazuj ronda",
                    rOverNever: "Nigdy",
                    rOverSelected: "Gdy zaznaczone",
                    rOverAlways: "Zawsze",
                    decimals: "Ilość cyfr po przecinku",
                    pointSize: "Rozmiar punktów pomiaru"
                });
                break;

                //Russian (русский)
            case 'ru':
                set_trans({
                    name: "Углы поворотов",
                    settingsTitle: "Настройки Junction Angle Info",
                    resetToDefault: "Сбросить настройки",
                    defaultOn: "По умолчанию показывать",
                    aAbsolute: "Абсолютные",
                    aDeparture: "Повороты",
                    angleMode: "- режим углов",
                    angleDisplay: "- стиль отображения",
                    angleDisplayArrows: "- стрелки направлений",
                    displayFancy: "Модный",
                    displaySimple: "Простой",
                    override: "Визуализировать изменённые подсказки",
                    overrideAngles: "Показывать углы изменённых подсказок",
                    guess: "Ожидаемые подсказки",
                    noInstructionColor: "- нет подсказки",
                    continueInstructionColor: "Цвет изменённой подсказки \"продолжайте движение прямо\"",
                    keepInstructionColor: "- держитесь",
                    exitInstructionColor: "- съезд",
                    turnInstructionColor: "- поверните",
                    uTurnInstructionColor: "- развернитесь",
                    noTurnColor: "- запрещённый манёвр",
                    problemColor: "- угол следует избегать",
                    roundaboutColor: "- некорректное кольцо",
                    roundaboutOverlayColor: "- цвет кольца",
                    roundaboutOverlayDisplay: "- показ колец",
                    rOverNever: "Никогда",
                    rOverSelected: "Если выбрано",
                    rOverAlways: "Всегда",
                    decimals: "- знаков после запятой",
                    pointSize: "- размер кружка",
                    roundaboutnav: "Вики: круговые перекрестки",
                    ghissues: "Сообщить об ошибке"
                });
                break;

                //Swedish (svenska)
            case 'sv':
                set_trans({
                    name: "Korsningsvinklar",
                    settingsTitle: "Inställningar för korsningsvinklar",
                    resetToDefault: "Återställ",
                    defaultOn: "Visa skiktet som standard",
                    aAbsolute: "Absolut",
                    aDeparture: "Sväng",
                    angleMode: "Vinkelvisning",
                    angleDisplay: "Vinkelstil",
                    angleDisplayArrows: "Riktningspilar",
                    displayFancy: "Grafisk",
                    displaySimple: "Simpel",
                    override: "Check \"override instruction\"",
                    overrideAngles: "Show angles of \"override instruction\"",
                    guess: "Gissa navigeringsinstruktioner",
                    noInstructionColor: "Färg för \"ingen instruktion\"",
                    continueInstructionColor: "Color for continue straight",
                    keepInstructionColor: "Färg för \"håll höger/vänster\"-instruktion",
                    exitInstructionColor: "Färg för \"ta av\"-instruktion",
                    turnInstructionColor: "Färg för \"sväng\"-instruktion",
                    uTurnInstructionColor: "Färg för \"U-sväng\"-instruktion",
                    noTurnColor: "Färg förbjuden sväng",
                    problemColor: "Färg för vinklar att undvika",
                    roundaboutColor: "Färg för rondell (med icke-räta vinklar)",
                    roundaboutOverlayColor: "Färg för rondellcirkel",
                    roundaboutOverlayDisplay: "Visa cirkel på rondell",
                    rOverNever: "Aldrig",
                    rOverSelected: "När vald",
                    rOverAlways: "Alltid",
                    decimals: "Decimaler",
                    pointSize: "Cirkelns basstorlek"
                });
                break;

                //French (Francais)
            case 'fr':
                set_trans({
                    name: "Junction Angle Info",
                    settingsTitle: "Paramètres de Junction Angle Info",
                    defaultOn: "Activer au démarrage",
                    angleMode: "Mode Angle",
                    aAbsolute: "Absolu",
                    aDeparture: "Départ",
                    angleDisplay: "Style d'affichage d'Angles",
                    angleDisplayArrows: "Flèches de Direction",
                    displayFancy: "Fancy",
                    displaySimple: "Simple",
                    override: "Contrôler les \"overrides instruction\"",
                    overrideAngles: "Afficher les angles des \"overrides\" actives",
                    guess: "Estimer les instructions routage",
                    noInstructionColor: "Couleur sans instruction",
                    continueInstructionColor: "Couleur pour \"continuez tout droit\"",
                    keepInstructionColor: "Couleur pour serrez",
                    exitInstructionColor: "Couleur pour sortez",
                    turnInstructionColor: "Couleur pour tournez",
                    uTurnInstructionColor: "Couleur pour demi-tour",
                    noTurnColor: "Couleur des virages interdits",
                    problemColor: "Couleur des angles à éviter",
                    roundaboutOverlayDisplay: "Surligner les rond-point",
                    rOverNever: "Jamais",
                    rOverSelected: "Sélectionné",
                    rOverAlways: "Toujours",
                    roundaboutOverlayColor: "Couleur de surlignage rond-point",
                    roundaboutColor: "Couleur pour les ronds-points anormaux",
                    decimals: "Nombre de decimales",
                    pointSize: "Taille des bulles",
                    resetToDefault: "Réinitialiser par défaut",
                    roundaboutnav: "WIKI: Rond-point (en)",
                    ghissues: "JAI Reporter un problème"
                });
                break;
                //Latin-American Spanish (español latinoamericano)
            case 'es-419':
                set_trans({
                    name: "Información en Ángulos de Intersección (JAI)",
                    settingsTitle: "Configuración de Información en Ángulos",
                    resetToDefault: "Limpiar configuración",
                    defaultOn: "Activo al iniciar",
                    aAbsolute: "Absoluto",
                    aDeparture: "Salida",
                    angleMode: "Modo de ángulos",
                    angleDisplay: "Estilo para mostrar",
                    angleDisplayArrows: "Flechas de dirección",
                    displayFancy: "Lujoso",
                    displaySimple: "Simple",
                    override: "Revisar \"instrucciones forzadas\"",
                    overrideAngles: "Ver ángulos en \"instrucciones forzadas\"",
                    guess: "Estimar instrucciones de giro",
                    noInstructionColor: "Sin instrucción",
                    continueInstructionColor:  "\"Sigue derecho\"",
                    keepInstructionColor: "\"Mantente\"",
                    exitInstructionColor: "\"Sale\"",
                    turnInstructionColor: "\"Gira\"",
                    uTurnInstructionColor: "\"Gira en U\"",
                    noTurnColor: "Giros deshabilitados",
                    problemColor: "Ángulos a evitar",
                    roundaboutColor: "Rotondas anormales",
                    roundaboutOverlayColor: "Rotondas",
                    roundaboutOverlayDisplay: "Mostrar rotondas",
                    rOverNever: "Nunca",
                    rOverSelected: "Seleccionadas",
                    rOverAlways: "Siempre",
                    decimals: "Decimales",
                    pointSize: "Tamaño del texto",
                    roundaboutnav: "WIKI: Rotondas",
                    ghissues: "Seguimiento de problemas"
                });
                break;
                //Ukrainian (український)
            case 'uk':
                set_trans({
                    name: "Junction Angle Info",
                    settingsTitle: "Налаштування Junction Angle Info",
                    resetToDefault: "Скинути налаштування",
                    defaultOn: "За замовчуванням показувати",
                    aAbsolute: "Абсолютні",
                    aDeparture: "Повороти",
                    angleMode: "- режим кутів",
                    angleDisplay: "- стиль відображення",
                    angleDisplayArrows: "- стрілки напрямків",
                    displayFancy: "Модний",
                    displaySimple: "Простий",
                    override: "Візуалізувати \"змінені підказки\"",
                    overrideAngles: "Показувати кути для \"змінених підказок\"",
                    guess: "Очікувані підказки:",
                    noInstructionColor: "- немає підказки",
                    continueInstructionColor: "- продовжуйте рух прямо",
                    keepInstructionColor: "- тримайтеся",
                    exitInstructionColor: "- з'їзд",
                    turnInstructionColor: "- поверніть",
                    uTurnInstructionColor: "- розверніться",
                    noTurnColor: "- заборонений маневр",
                    problemColor: "- кут слід уникати",
                    roundaboutColor: "- некоректне кільце",
                    roundaboutOverlayColor: "- колір кільця",
                    roundaboutOverlayDisplay: "- показ кілець",
                    rOverNever: "Ніколи",
                    rOverSelected: "Якщо вибрано",
                    rOverAlways: "Завжди",
                    decimals: "- знаків після коми",
                    pointSize: "- розмір шрифту",
                    roundaboutnav: "WIKI: кругові перехрестя(en)",
                    ghissues: "JAI - Повідомити про помилку"
                });
                break;
        }
    }


    /*
	 * Bootstrapping and logging
	 */

    function ja_bootstrap(retries) {
        retries = retries || 0;
        //If Waze has not been defined in ~15 seconds, it probably won't work anyway. Might need tuning
        //for really slow devices?
        if (retries >= 30) {
            ja_log("Failed to bootstrap 30 times. Giving up.", 0);
            return;
        }

        try {
            //User logged in and WME ready
            if (
                ja_is_model_ready() &&
                ja_is_dom_ready() &&
                window.W.loginManager.isLoggedIn()) {
                setTimeout(function () {
                    junctionangle_init();
                }, 500);
            }
            //Some part of the WME was not yet fully loaded. Retry.
            else {
                setTimeout(function () {
                    ja_bootstrap(++retries);
                }, 500);
            }
        } catch (err) {
            ja_log(err, 1);
            setTimeout(function () {
                ja_bootstrap(++retries);
            }, 500);
        }
    }

    function ja_is_model_ready() {
        if(typeof window.W === 'undefined' || typeof window.W.map === 'undefined') {
            return false;
        } else {
            //return 'undefined' !== typeof window.W.map.events.register &&
            return 'undefined' !== typeof window.W.map.olMap.events.register &&
                'undefined' !== typeof window.W.selectionManager.events.register &&
                'undefined' !== typeof window.W.loginManager.events.register;
        }
    }

    function ja_is_dom_ready() {
        if(null === document.getElementById('user-info')) {
            return false;
        } else {
            return document.getElementById('user-info').getElementsByClassName('nav-tabs').length > 0 &&
                document.getElementById('user-info').getElementsByClassName('tab-content').length > 0;
        }
    }

    /**
	 * Debug logging.
	 * @param ja_log_msg
	 * @param ja_log_level
	 */
    function ja_log(ja_log_msg, ja_log_level) {
        //##NO_FF_START##
        //Firefox addons should not use console.(log|error|debug), so these lines
        //are removed by the FF addon packaging script.
        if(typeof ja_log_level === 'undefined') { ja_log_level = 1; }
        if (ja_log_level <= junctionangle_debug) {
            if (typeof ja_log_msg === "object") {
                console.log(ja_log_msg);
            }
            else {
                console.log("WME Junction Angle: " + ja_log_msg);
            }
        }
        //##NO_FF_END##
    }
    function getByID(obj, id){
        if (typeof(obj.getObjectById) == "function"){
            return obj.getObjectById(id);
        }else if (typeof(obj.getObjectById) == "undefined"){
            return obj.get(id);
        }
    }

    ja_bootstrap();

}

//Dynamically create, add and run the script in the real page context. We really do need access to many of the objects...
let run_ja_script = GM_addElement('script', {
    textContent: "" + run_ja.toString() + " \n" + "run_ja();"
});