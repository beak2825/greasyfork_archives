// ==UserScript==
// @name            Horwasp corrections Beta
// @description     Fixes Horwasp predictions in planet view
// @author          Jezzarimu / Sibuna (Usernames at Planets.Nu)
// @include         http://planets.nu/*
// @include         http://*.planets.nu/*
// @include         https://planets.nu/*
// @include         https://*.planets.nu/*
// @version         3.05
// @namespace https://greasyfork.org/users/859074
// @downloadURL https://update.greasyfork.org/scripts/438439/Horwasp%20corrections%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/438439/Horwasp%20corrections%20Beta.meta.js
// ==/UserScript==

/*
    This script fixes multiple prediction display errors on the planet screen. Larva, Colonist Growth, Native Growth, Burrows,
        turns until arrival when building pods, waypoints of pod when being built.
    It also adds the percentage you are over on burrows, expected change in percentage and number of minerals mined.
    Shows information in clans. Change var inClans to false to show in population.
    Adjusted the ship transfer screen to show planet clans in number of clans if inClans is true.
    Added a new screen and map button on the right side for tracking pods.

    Minefield Predictions:
        Predictions are shown with the normal prediction intensity when the minefield will be laid next turn.
        Minefields that will be laid in future turns are shown in 30% normal prediction intensity.
        minefieldPredictionMultiplier is the percentage of the normal prediction intensity for future turns minefields.
            Default is 0.3 (30%)
            Set to 0 to disable future turn predictions, it will only show next turn predictions.

        Known problems:
            Predictions only use current turn minefield locations and does not account for minefield decay.
            Predictions do not account for minefield destruction with other minefields.
            Predictions do not account for the order in which protominefields are laid. Because of this, if two
                protominefields are being laid in the same turn that overlap with each other, the prediction shows
                each protominefield being laid separately even though only the one with the lower ship id will exist
                and the other will add to it. Sadly this cannot be completely solved since the id of a pod built and
                laid on the same turn is not known.

        Future work:
            When order of ship id is known, combining future turn protofields predictions when there is not already
                a minefield at the location is possible and it should be updated to show the prediction
                - NOTE: It will never be known the order of newly built ship ids from planets, so if a minefield from a planet
                    and ship intersect the prediction should be able to break down to display them as separate until the following
                    turn when the ship id order is known.

    Pod Screen:
        There is now a new icon on the right side of the screen to track pods. The expected behavior of the screen is such:
            - Clicking on a planet's title bar hides/shows information on the planet and pods going to that planet
            - Clicking on a planet selects that planet by opening it's planetScreen
            - Clicking on a pod selects that ship by opening it's shipScreen
            - Clicking on a pod that is currently being built opens the planetScreen for the planet that is building the pod
            - When the planet screen is open only that planet and that's planet's target and the pods going to them are displayed
            - Opening a shipScreen does not adjust the pod screen
                This is intended so when you are looking at a planet you are able to freely swap to the pod and back to the planet
                by clicking on the icons in the pod screen
        
        Known Problems:
            - If the messageScreen is opened, clicking the messageScreen title bar does not adjust the location of the pod screen button
                if this happens, reopening the messageScreen and clicking the title bar returns button positions to normal.
            - The podScreen is not implemented in play.planets.nu
                This may be remedied as a future update to the dashboard, design is still in progress.
    
    Additional found problems to solve in future updates:
        - The number of turns for a pod to reach it's destination shown on the shipScreen may be incorrect
            This problem has already been solved on both the planetScreen when building the pod and on the podScreen
            For correct information check those screens
        - The waypoint locations shown when a pod is selected can be significantly off if the pod is traveling to an accelerator
            This problem has been fixed when building the pod but has not been corrected from the default display when the pod is already built
        - The amount of fuel displayed on non-pod ships is sometimes miscalculated when the trip is longer than a single turn

    Please send Jezzarimu a message in planets.nu if you find any problems.

    Version History:
    3.05 - Changed the default map tool for ship scan range to adjust for horwasp limited range.
    3.04 - Changed Liquify menu to show number being liquified in clan when inClans is true
    3.03 - Fixed the turns until arrival on the planet screen when building a pod
    3.02 - Fixed waypoint locations for planets
    3.01 - Added a side menu for tracking pods and the turns until arrival
    3.00 - Full rewrite to reduce cpu usage
    2.21 - Fixed some compatibility issues with Dotman's Planetary Management plugin 
    2.20 - Fixed a problem that occured with the minefield prediction when you already have protofields built
    2.19 - Added a catch to prevent adding the CSS style into the head multiple times
    2.18 - Fixed a recursion problem for play.planets.nu
    2.17 - Updated the minefield predictions to use significantly less processing power
    2.16 - Fixed waypoint problem when moving in a cardinal direction
    2.15 - Fixed a zero radius bug in the minefield predictions
    2.14 - Changed minefield prediction to add to the predictions when combining with a minefield already placed
    2.13 - Added CSS style to the plugin to change the look based on the size of the planetScreen
    2.12 - Added a build farm button that sets the planet to build a fully loaded farm
    2.11 - Added a build stinger button that sets the planet to build a fully loaded stinger
    2.10 - Added protominefield predictions for protofields
    2.03 - Added catch to only affect horwasp screens and functions
    2.02 - Fixed colonist death from overpopulation (supplies are generated before overpopulation is calculated)
    2.01 - Adjusted the transfer screen from ships to show planet clans in clans if inClans is true
    2.00 - Changed the display to edit the default planet screen instead of remaking it
    1.14 - Fixed warp speed setting for pods on the planet screen from play.planets.nu
    1.13 - Shifted inClans into the plugin variables
    1.12 - Updated next turn values when a ship is being built or a ship build is canceled
    1.11 - Fixed colonist growth rate
    1.10 - Enabled compatability with play.planets.nu
    1.00 - Initial Release
*/

function wrapper () {


    var horwaspCorrections = {
        inClans: true,
        adjustedOldFunctions: false,
        adjustedFunctions: false,
        adjustedPlanetScreenFunctions: false,
        adjustedShipTransfer: false,
        adjustedMapFunctions: false,
        minefieldPredictionMultiplier: .3,
        updatedFields: new Array(),
        horwaspBorderColorControl: "#FF00FF",

        SortedObjectArray: function (sort) {
            this.array = new Array();
            this.sort = sort;
        },

        processload: function () {
            console.log("load process");
            if (vgap.player.raceid == 12) {
                //Created a sorted array alogorithm to setup the podScreen
                HCPlugin.SortedObjectArray.prototype.add = function (element) {
                    if (this.array.length == 0) {
                        this.array.push(element);
                        return;
                    }
                    let minindex = 0;
                    let maxindex = this.array.length;
                    while (minindex != maxindex) {
                        let midpoint = Math.floor(minindex + (maxindex - minindex) / 2);
                        for (let i = 0; i < this.sort.length; i++){
                            if (element[this.sort[i]] == this.array[midpoint][this.sort[i]]) {
                                if (i == this.sort.length-1) {
                                    console.log("Error: Must have a unique property to sort by.");
                                    return;
                                } else {
                                    continue;
                                }
                            } else if (element[this.sort[i]] < this.array[midpoint][this.sort[i]]) {
                                maxindex = midpoint;
                                break;
                            } else {
                                minindex = midpoint+1;
                                break;
                            }
                        }
                    }
                    this.array.splice(minindex, 0, element);
                }
                HCPlugin.SortedObjectArray.prototype.remove = function (element) {
                    if(this.array.length == 0) {
                        console.log("The array is empty!");
                        return;
                    }
                    let minindex = 0;
                    let maxindex = this.array.length;
                    while (minindex != maxindex) {
                        let midpoint = Math.floor(minindex + (maxindex - minindex) / 2);
                        console.log(midpoint);
                        for (let i = 0; i < this.sort.length; i++){
                            if (element[this.sort[i]] == this.array[midpoint][this.sort[i]]) {
                                if (i == this.sort.length-1) {
                                    return this.array.splice(midpoint, 1);
                                } else {
                                    continue;
                                }
                            } else if (element[this.sort[i]] < this.array[midpoint][this.sort[i]]) {
                                maxindex = midpoint;
                                break;
                            } else {
                                minindex = midpoint+1;
                                break;
                            }
                        }
                    }
                }

                //set initial states on process load
                vgap.planetScreenOpen = false;
                if (vgap.map) {
                    vgap.map.activePlanet = null;
                    vgap.map.activeShip = null;
                    vgap.map.activestarbase = null;
                    //note: the original code uses both vgap.map.activestarbase and vgap.map.activeStarbase but the second one is only ever set to null.
                    //recommend: adjust all occurences of activestarbase to activeStarbase to be consistent with activePlanet and activeShip.
                }

                //for minefield prediction
                HCPlugin.updatedFields = new Array();
                HCPlugin.minefieldIdCounter = -1;
                HCPlugin.MinefieldPreviewPrecalculations();


                if (vgap.version < 4) {
                    if (!HCPlugin.adjustedOldFunctions) {
                        //Fix Broken Function
                        vgap.isPlanet = function (obj) {return obj.isPlanet || (typeof obj.factories !== "undefined");};

                        //adjust default functions
                        leftContent.prototype.HCrefreshOld = leftContent.prototype.refresh;
                        leftContent.prototype.refresh = function () {this.HCrefreshOld(); if(vgap.planetScreenOpen) HCPlugin.EditPlanetScreenOld(vgap.planetScreen.planet);}
                        vgapPlanetScreen.prototype.HCalloHarvestOld = vgapPlanetScreen.prototype.alloHarvest;
                        vgapPlanetScreen.prototype.alloHarvest = function (change) {this.HCalloHarvestOld(change); HCPlugin.HCHarvestingClans(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloMiningOld = vgapPlanetScreen.prototype.alloMining;
                        vgapPlanetScreen.prototype.alloMining = function (change) {this.HCalloMiningOld(change); HCPlugin.HCMining(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloBurrowOld = vgapPlanetScreen.prototype.alloBurrow;
                        vgapPlanetScreen.prototype.alloBurrow = function (change) {this.HCalloBurrowOld(change); HCPlugin.HCBurrows(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloAlchemyOld = vgapPlanetScreen.prototype.alloAlchemy;
                        vgapPlanetScreen.prototype.alloAlchemy = function (change) {this.HCalloAlchemyOld(change); HCPlugin.HCLiquifying(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloTerraOld = vgapPlanetScreen.prototype.alloTerra;
                        vgapPlanetScreen.prototype.alloTerra = function (change) {this.HCalloTerraOld(change); HCPlugin.HCTerraforming(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCcancelBuildOld = vgapPlanetScreen.prototype.cancelBuild;
                        vgapPlanetScreen.prototype.cancelBuild = function () {
                            if(this.planet.podhullid == 206)
                                HCPlugin.cancelMinefieldBuild(vgap.planetScreen.planet);
                            this.HCcancelBuildOld();
                            vgap.map.draw();
                            HCPlugin.HCTerraforming(this.planet, true)
                        };
                        vgapPlanetScreen.prototype.HCverifyBuildOld = vgapPlanetScreen.prototype.verifyBuild;
                        vgapPlanetScreen.prototype.verifyBuild = function () {
                            this.HCverifyBuildOld();
                            var planet = this.planet;
                            var bld = this.buildData;
                            $("#BuildShipButton").unbind();
                            $("#BuildShipButton").tclick(function () {
                                //build the pod
                                planet.podhullid = vgap.planetScreen.selectedpodhullid;
                                if (planet.podspeed == 0) {
                                    if (planet.nativetype == 8)
                                        planet.podspeed = 7;
                                    else
                                        planet.podspeed = 6;
                                }

                                planet.clans -= bld.cost;
                                planet.duranium -= bld.dur;
                                planet.tritanium -= bld.tri;
                                planet.molybdenum -= bld.mol;

                                vgap.planetScreen.buildPod();
                                vgap.setLeftHeight();
                                HCPlugin.HCTerraforming(planet, true);
                            })
                        };
                        vgapTransferScreen.prototype.HCtransferClansOld = vgapTransferScreen.prototype.transferClans;
                        vgapTransferScreen.prototype.transferClans = function (change) {
                            this.HCtransferClansOld(change);
                            if (vgap.isPlanet(this.from)) {
                                HCPlugin.HCTerraforming(this.from, true);
                            } else if (vgap.isPlanet(this.to)) {
                                HCPlugin.HCTerraforming(this.to, true);
                            }
                        }
                        HCPlugin.adjustedOldFunctions = true;
                    }
                } else {
                    if (!HCPlugin.adjustedFunctions) {
                        vgapPlanetScreen.prototype.HCrefreshOld = vgapPlanetScreen.prototype.refresh
                        vgapPlanetScreen.prototype.refresh = function () {this.HCrefreshOld(); HCPlugin.EditPlanetScreen(vgap.planetScreen.planet);}
                        vgapPlanetScreen.prototype.HCalloHarvestOld = vgapPlanetScreen.prototype.alloHarvest;
                        vgapPlanetScreen.prototype.alloHarvest = function (change) {this.HCalloHarvestOld(change); HCPlugin.HCHarvestingClans(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloMiningOld = vgapPlanetScreen.prototype.alloMining;
                        vgapPlanetScreen.prototype.alloMining = function (change) {this.HCalloMiningOld(change); HCPlugin.HCMining(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloBurrowOld = vgapPlanetScreen.prototype.alloBurrow;
                        vgapPlanetScreen.prototype.alloBurrow = function (change) {this.HCalloBurrowOld(change); HCPlugin.HCBurrows(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloAlchemyOld = vgapPlanetScreen.prototype.alloAlchemy;
                        vgapPlanetScreen.prototype.alloAlchemy = function (change) {this.HCalloAlchemyOld(change); HCPlugin.HCLiquifying(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCalloTerraOld = vgapPlanetScreen.prototype.alloTerra;
                        vgapPlanetScreen.prototype.alloTerra = function (change) {this.HCalloTerraOld(change); HCPlugin.HCTerraforming(vgap.planetScreen.planet)};
                        vgapPlanetScreen.prototype.HCcancelBuildOld = vgapPlanetScreen.prototype.cancelBuild;
                        vgapPlanetScreen.prototype.cancelBuild = function () {
                            let planet = this.planet;
                            switch (planet.podhullid) {
                                case 206: //protofield
                                    HCPlugin.cancelMinefieldBuild(planet);
                                    break;
                                case 205: //Accelerator
                                    HCPlugin.acceleratorPods.remove({ shipId: 0, planetId: planet.id, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true)});
                                    HCPlugin.BuildPodScreen();
                                    break;
                                case 201: //Sentry
                                    HCPlugin.sentryPods.remove({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true), towshipid: null});
                                    HCPlugin.BuildPodScreen();
                                    break;
                                default:
                                    if (planet.podhullid >=200 && planet.podhullid < 300 && vgap.planetAt(planet.targetx, planet.targety)) {
                                        HCPlugin.podArray.remove({ planetid: planet.id, shipid: 0, hullid: planet.podhullid, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetid: planet.target.id, turns: HCPlugin.HCGetWaypointLocations(planet, true) });
                                        HCPlugin.BuildPodScreen();
                                    }
                                    break;
                            }
                            this.HCcancelBuildOld();
                            vgap.map.draw();
                            HCPlugin.HCTerraforming(this.planet, true);
                            HCPlugin.BuildPodScreen();
                        };
                        vgapPlanetScreen.prototype.HCpodTransferOld = vgapPlanetScreen.prototype.podTransfer;
                        vgapPlanetScreen.prototype.podTransfer = function (change, cargotype) {
                            switch (this.planet.podhullid) {
                                case 206: //protofield
                                    HCPlugin.cancelMinefieldBuild(this.planet);
                                    this.HCpodTransferOld(change, cargotype);
                                    HCPlugin.BuildMinefield(this.planet);
                                    vgap.map.draw();
                                    break;
                                case 205: //Accelerator
                                    HCPlugin.acceleratorPods.remove({ shipId: 0, planetId: this.planet.id, cargoType: vgap.podCargoType(this.planet.podhullid), cargo: this.planet.podcargo, targetx: this.planet.target.x, targety: this.planet.targety, turns: HCPlugin.HCGetWaypointLocations(this.planet, true)});
                                    this.HCpodTransferOld(change, cargotype);
                                    HCPlugin.acceleratorPods.add({ shipId: 0, planetId: this.planet, cargoType: vgap.podCargoType(this.planet.podhullid), cargo: this.planet.podcargo, targetx: this.planet.target.x, targety: this.planet.targety, turns: HCPlugin.HCGetWaypointLocations(this.planet, true)});
                                    HCPlugin.BuildPodScreen();
                                    break;
                                case 201: //Sentry
                                    HCPlugin.sentryPods.remove({ shipId: 0, planetId: this.planet, cargoType: vgap.podCargoType(this.planet.podhullid), cargo: this.planet.podcargo, targetx: this.planet.target.x, targety: this.planet.targety, turns: HCPlugin.HCGetWaypointLocations(this.planet, true), towshipid: null});
                                    this.HCpodTransferOld(change, cargotype);
                                    HCPlugin.sentryPods.add({ shipId: 0, planetId: this.planet, cargoType: vgap.podCargoType(this.planet.podhullid), cargo: this.planet.podcargo, targetx: this.planet.target.x, targety: this.planet.targety, turns: HCPlugin.HCGetWaypointLocations(this.planet, true), towshipid: null});
                                    HCPlugin.BuildPodScreen();
                                    break;
                                default:
                                    if (this.planet.podhullid >=200 && this.planet.podhullid < 300 && vgap.planetAt(this.planet.targetx, this.planet.targety)) {
                                        HCPlugin.podArray.remove({ planetid: this.planet.id, shipid: 0, hullid: this.planet.podhullid, cargoType: vgap.podCargoType(this.planet.podhullid), cargo: this.planet.podcargo, targetid: this.planet.target.id, turns: HCPlugin.HCGetWaypointLocations(this.planet, true) });
                                        this.HCpodTransferOld(change, cargotype);
                                        HCPlugin.podArray.add({ planetid: this.planet.id, shipid: 0, hullid: this.planet.podhullid, cargoType: vgap.podCargoType(this.planet.podhullid), cargo: this.planet.podcargo, targetid: this.planet.target.id, turns: HCPlugin.HCGetWaypointLocations(this.planet, true) });
                                        HCPlugin.BuildPodScreen();
                                    } else {
                                        this.HCpodTransferOld(change, cargotype);
                                    }
                                    break;
                            }
                            switch (cargotype) {
                                case "clans":
                                    HCPlugin.HCTerraforming(this.planet, true);
                                    break;
                                case "nativeclans":
                                    HCPlugin.HCNativeGrowth(this.planet);
                                    break;
                            }
                        }
                        vgapPlanetScreen.prototype.HCbuildPodOld = vgapPlanetScreen.prototype.buildPod;
                        vgapPlanetScreen.prototype.buildPod = function () {
                            this.HCbuildPodOld();
                            if (this.planet.podhullid != this.selectedpodhullid && this.selectedpodhullid != 0) {
                                $("#BuildButton").unbind();
                                $("#BuildButton").tclick(function () {
                                    HCPlugin.BuildPodButtonFunction();
                                    HCPlugin.HCTerraforming(vgap.planetScreen.planet, true);
                                });
                            }
                        }
                        vgapPlanetScreen.prototype.HCsetSpeedOld = vgapPlanetScreen.prototype.setSpeed;
                        vgapPlanetScreen.prototype.setSpeed = function (warp) {
                            if (vgap.map.activePlanet) {
                                let planet = vgap.map.activePlanet;
                                switch (planet.podhullid) {
                                    case 206: //protofield
                                        HCPlugin.cancelMinefieldBuild(planet);
                                        vgap.planetScreen.HCsetSpeedOld(warp);
                                        HCPlugin.BuildMinefield(planet);
                                        break;
                                    case 205: //Accelerator
                                        HCPlugin.acceleratorPods.remove({ shipId: 0, planetId: planet.id, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true)});
                                        vgap.planetScreen.HCsetSpeedOld(warp);
                                        HCPlugin.acceleratorPods.add({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true)});
                                        HCPlugin.BuildPodScreen();
                                        break;
                                    case 201: //Sentry
                                        HCPlugin.sentryPods.remove({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true), towshipid: null});
                                        vgap.planetScreen.HCsetSpeedOld(warp);
                                        HCPlugin.sentryPods.add({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true), towshipid: null});
                                        HCPlugin.BuildPodScreen();
                                        break;
                                    default:
                                        if (planet.podhullid >= 200 && planet.podhullid < 300) {
                                            if (vgap.planetAt(planet.targetx, planet.targety)) {
                                                HCPlugin.podArray.remove({ planetid: planet.id, shipid: 0, hullid: planet.podhullid, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetid: planet.target.id, turns: HCPlugin.HCGetWaypointLocations(planet, true) });
                                            }
                                            vgap.planetScreen.HCsetSpeedOld(warp);
                                            if (vgap.planetAt(planet.targetx, planet.targety)) {
                                                HCPlugin.podArray.add({ planetid: planet.id, shipid: 0, hullid: planet.podhullid, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetid: planet.target.id, turns: HCPlugin.HCGetWaypointLocations(planet, true) });
                                            }
                                        } else {
                                            vgap.planetScreen.HCsetSpeedOld(warp);
                                        }
                                        HCPlugin.BuildPodScreen();
                                        break;
                                }
                            } else {
                                vgap.planetScreen.HCsetSpeedOld(warp);
                            }
                            vgap.map.draw();
                        }
                        vgapTransferScreen.prototype.HCtransferClansOld = vgapTransferScreen.prototype.transferClans;
                        vgapTransferScreen.prototype.transferClans = function (change) {
                            this.HCtransferClansOld(change);
                            if (vgap.isPlanet(this.from)) {
                                HCPlugin.HCTerraforming(this.from, true);
                            } else if(vgap.isPlanet(this.to)) {
                                HCPlugin.HCTerraforming(this.to, true);
                            }
                        };
                        vgapMap.prototype.HCtoggleControlsOld = vgapMap.prototype.toggleControls;
                        vgapMap.prototype.toggleControls = function (show) {
                            this.HCtoggleControlsOld(show);
                            if (show) {
                                $("#HCPodScreenButton").show();
                            } else {
                                $("#HCPodScreenButton").hide();
                            }
                        }
                        vgapMap.prototype.HCplanetSelectorClickOld = vgapMap.prototype.planetSelectorClick;
                        vgapMap.prototype.planetSelectorClick = function () {
                            if (vgap.map.activePlanet) {
                                let planet = vgap.map.activePlanet;
                                switch (planet.podhullid) {
                                    case 206: //protofield
                                        HCPlugin.cancelMinefieldBuild(planet);
                                        vgap.map.HCplanetSelectorClickOld();
                                        HCPlugin.BuildMinefield(planet);
                                        vgap.map.draw();
                                        break;
                                    case 205: //Accelerator
                                        HCPlugin.acceleratorPods.remove({ shipId: 0, planetId: planet.id, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true)});
                                        vgap.map.HCplanetSelectorClickOld();
                                        HCPlugin.acceleratorPods.add({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true)});
                                        HCPlugin.BuildPodScreen();
                                        break;
                                    case 201: //Sentry
                                        HCPlugin.sentryPods.remove({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true), towshipid: null});
                                        vgap.map.HCplanetSelectorClickOld();
                                        HCPlugin.sentryPods.add({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true), towshipid: null});
                                        HCPlugin.BuildPodScreen();
                                        break;
                                    default:
                                        if (planet.podhullid >= 200 && planet.podhullid < 300) {
                                            if (vgap.planetAt(planet.targetx, planet.targety)) {
                                                HCPlugin.podArray.remove({ planetid: planet.id, shipid: 0, hullid: planet.podhullid, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetid: planet.target.id, turns: HCPlugin.HCGetWaypointLocations(planet, true) });
                                            }
                                            vgap.map.HCplanetSelectorClickOld();
                                            if (vgap.planetAt(planet.targetx, planet.targety)) {
                                                HCPlugin.podArray.add({ planetid: planet.id, shipid: 0, hullid: planet.podhullid, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetid: planet.target.id, turns: HCPlugin.HCGetWaypointLocations(planet, true) });
                                            }
                                        } else {
                                            vgap.map.HCplanetSelectorClickOld();
                                        }
                                        HCPlugin.BuildPodScreen();
                                        break;
                                }
                            } else {
                                vgap.map.HCplanetSelectorClickOld();
                            }
                            vgap.map.draw();
                        }
                        vgapMap.prototype.HCdeselectOld = vgapMap.prototype.deselect;
                        vgapMap.prototype.deselect = function () {
                            if (vgap.planetScreenOpen) {
                                vgap.map.HCdeselectOld();
                                HCPlugin.BuildPodScreen();
                            } else {
                                vgap.map.HCdeselectOld();
                            }
                        }
                        vgapMap.prototype.HCdrawShipScanRangeOld = vgapMap.prototype.drawShipScanRange;
                        vgapMap.prototype.drawShipScanRange = function (ctx) {
                            var objs = vgap.ships.concat(vgap.planets);
                            var scanners = [];
                            var HorwaspScanners = [];
                            for (var i = 0; i < objs.length; i++) {
                                var obj = objs[i];
                                if (vgap.shareIntel(obj.ownerid)){
                                    if (vgap.getPlayer(obj.ownerid).raceid == 12) {
                                        HorwaspScanners.push(obj);
                                    } else {
                                        scanners.push(obj);
                                    }
                                }
                            }
                            for (let i = 0; i < HorwaspScanners.length; i++) {
                                let j = i + 1;
                                while (j < HorwaspScanners.length) {
                                    if (HorwaspScanners[i].x === HorwaspScanners[j].x && HorwaspScanners[i].y === HorwaspScanners[j].y) {
                                        HorwaspScanners.splice(j,1);
                                    } else {
                                        j++;
                                    }
                                }
                            }
                            if (!this.scanmaskcanvas)
                                this.scanmaskcanvas = document.createElement("canvas");

                            this.scanmaskcanvas.width = this.canvas.width;
                            this.scanmaskcanvas.height = this.canvas.height;
                            ctx2 = this.scanmaskcanvas.getContext("2d");
                            let w = this.canvas.width;
                            let h = this.canvas.height;
                            
                            
                            ctx2.clearRect(0, 0, w, h);
                            ctx2.fillStyle = "rgba(0, 0, 0, 0.49)";
                            ctx2.fillRect(0, 0, w, h);
                            radius = 150;
                            ctx2.fillStyle = "#000";
                            ctx2.globalCompositeOperation = "destination-out";
                    
                            radius = vgap.settings.shipscanrange;
                            for (let i = 0; i < scanners.length; i++) {
                                let pt = scanners[i];
                                if (this.isVisible(pt.x, pt.y, radius)) {
                                    ctx2.beginPath();
                                    ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                    ctx2.closePath();
                                    ctx2.fill();
                                }
                            }
                            radius = 150;
                            for (let i = 0; i < HorwaspScanners.length; i++) {
                                let pt = HorwaspScanners[i];
                                if (this.isVisible(pt.x, pt.y, radius)) {
                                    ctx2.beginPath();
                                    ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                    ctx2.closePath();
                                    ctx2.fill();
                                }
                            }
                            ctx2.globalCompositeOperation = "source-over";
                            ctx2.fillStyle = HCPlugin.horwaspBorderColorControl;
                            for (let i = 0; i < HorwaspScanners.length; i++) {
                                let pt = HorwaspScanners[i];
                                if (this.isVisible(pt.x, pt.y, radius)) {
                                    ctx2.beginPath();
                                    ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                    ctx2.closePath();
                                    ctx2.fill();
                                }
                            }
                            ctx2.globalCompositeOperation = "destination-out";
                            radius = 149.7;
                            for (let i = 0; i < HorwaspScanners.length; i++) {
                                let pt = HorwaspScanners[i];
                                if (this.isVisible(pt.x, pt.y, radius)) {
                                    ctx2.beginPath();
                                    ctx2.arc(this.screenX(pt.x), this.screenY(pt.y), radius * this.zoom, 0, Math.PI * 2, false);
                                    ctx2.closePath();
                                    ctx2.fill();
                                }
                            }
                            ctx.drawImage(ctx2.canvas, 0, 0);
                        }
                        vgaPlanets.prototype.HCcontinueExitingOld = vgaPlanets.prototype.continueExiting;
                        vgaPlanets.prototype.continueExiting = function () {
                            if (vgap.version >=4) {
                                vgapPlanetScreen.prototype.refresh = vgapPlanetScreen.prototype.HCrefreshOld;
                                vgapPlanetScreen.prototype.alloHarvest = vgapPlanetScreen.prototype.HCalloHarvestOld;
                                vgapPlanetScreen.prototype.alloMining = vgapPlanetScreen.prototype.HCalloMiningOld;
                                vgapPlanetScreen.prototype.alloBurrow = vgapPlanetScreen.prototype.HCalloBurrowOld;
                                vgapPlanetScreen.prototype.alloAlchemy = vgapPlanetScreen.prototype.HCalloAlchemyOld;
                                vgapPlanetScreen.prototype.alloTerra = vgapPlanetScreen.prototype.HCalloTerraOld;
                                vgapPlanetScreen.prototype.cancelBuild = vgapPlanetScreen.prototype.HCcancelBuildOld;
                                vgapPlanetScreen.prototype.podTransfer = vgapPlanetScreen.prototype.HCpodTransferOld;
                                vgapPlanetScreen.prototype.buildPod = vgapPlanetScreen.prototype.HCbuildPodOld;
                                vgapPlanetScreen.prototype.setSpeed = vgapPlanetScreen.prototype.HCsetSpeedOld;
                                vgapTransferScreen.prototype.transferClans = vgapTransferScreen.prototype.HCtransferClansOld;
                                vgapMap.prototype.toggleControls = vgapMap.prototype.HCtoggleControlsOld;
                                vgapMap.prototype.planetSelectorClick = vgapMap.prototype.HCplanetSelectorClickOld;
                                vgapMap.prototype.deselect = vgapMap.prototype.HCdeselectOld;
                                vgapMap.prototype.drawShipScanRange = vgapMap.prototype.HCdrawShipScanRangeOld;
                            } else {
                                leftContent.prototype.refresh = leftContent.prototype.HCrefreshOld;
                                vgapPlanetScreen.prototype.alloHarvest = vgapPlanetScreen.prototype.HCalloHarvestOld;
                                vgapPlanetScreen.prototype.alloMining = vgapPlanetScreen.prototype.HCalloMiningOld;
                                vgapPlanetScreen.prototype.alloBurrow = vgapPlanetScreen.prototype.HCalloBurrowOld;
                                vgapPlanetScreen.prototype.alloAlchemy = vgapPlanetScreen.prototype.HCalloAlchemyOld;
                                vgapPlanetScreen.prototype.alloTerra = vgapPlanetScreen.prototype.HCalloTerraOld;
                                vgapPlanetScreen.prototype.cancelBuild = vgapPlanetScreen.prototype.HCcancelBuildOld;
                                vgapPlanetScreen.prototype.verifyBuild = vgapPlanetScreen.prototype.HCverifyBuildOld;
                                vgapTransferScreen.prototype.transferClans = vgapTransferScreen.prototype.HCtransferClansOld;
                            }
                            vgaPlanets.prototype.continueExiting = vgaPlanets.prototype.HCcontinueExitingOld;
                            HCPlugin.adjustedFunctions = false;
                            vgap.continueExiting();
                        }
                        HCPlugin.adjustedFunctions = true;
                    }
                    HCPlugin.adjustedPlanetScreenFunctions = false;
                    HCPlugin.adjustedShipTransfer = false;
                    let head = document.getElementsByTagName('head')[0];
                    if (head != null && !document.getElementById("HCCss")) {
                        var CssStyle = document.createElement('style');
                        CssStyle.setAttribute("id", "HCCss");
                        CssStyle.innerHTML="@media screen and (orientation:landscape) and (min-height: 550px) {\
                                                .HCBuildButtons { \
                                                    width: 90px;\
                                                    height: 30px;\
                                                    position: absolute;\
                                                    background: linear-gradient(to bottom, #006600 5%, #003300 100%);\
                                                    border-radius: 12px;\
                                                    text-align: center;\
                                                    text-transform: uppercase;\
                                                    font-size: 11px;\
                                                    line-height: 30px;}\
                                                .HCGreyedBuildButton { \
                                                    width: 90px;\
                                                    height: 30px;\
                                                    position: absolute;\
                                                    background: linear-gradient(to bottom, #77777788 5%, #33333355 100%);\
                                                    border-radius: 12px;\
                                                    text-align: center;\
                                                    text-transform: uppercase;\
                                                    font-size: 11px;\
                                                    line-height: 30px;\
                                                    color:#FF3030;}\
                                                .HCBuildPod {\
                                                    top: 0px;\
                                                    left: 10px;}\
                                                .HCBuildStinger {\
                                                    top: 35px;\
                                                    left: 10px;}\
                                                .HCBuildFarm {\
                                                    top: 70px;\
                                                    left: 10px;}\
                                                .HCBuildDuranium {\
                                                    top: 0px;\
                                                    left:110px}\
                                                .HCBuildTritanium {\
                                                    width: 110px;\
                                                    top: 35px;\
                                                    left:110px}\
                                                .HCBuildMolybdenum {\
                                                    width: 110px;\
                                                    top: 70px;\
                                                    left:110px}}\
                                            @media screen and (orientation:landscape) and (max-height: 549px) {\
                                                .HCBuildButtons { \
                                                    width: 90px;\
                                                    height: 25px;\
                                                    position: absolute;\
                                                    background: linear-gradient(to bottom, #006600 5%, #003300 100%);\
                                                    border-radius: 12px;\
                                                    text-align: center;\
                                                    text-transform: uppercase;\
                                                    font-size: 9px;\
                                                    line-height: 25px;\
                                                    left: 5px;}\
                                                .HCGreyedBuildButton { \
                                                    width: 90px;\
                                                    height: 25px;\
                                                    position: absolute;\
                                                    background: linear-gradient(to bottom, #77777777 5%, #77777777 100%);\
                                                    border-radius: 12px;\
                                                    text-align: center;\
                                                    text-transform: uppercase;\
                                                    font-size: 9px;\
                                                    line-height: 25px;\
                                                    left: 5px;}\
                                                .HCBuildPod {\
                                                    top: 12px}\
                                                .HCBuildStinger {\
                                                    top: 41px}\
                                                .HCBuildFarm {\
                                                    top: 70px}\
                                                .HCBuildDuranium {\
                                                    display: none;}\
                                                .HCBuildTritanium {\
                                                    display: none;}\
                                                .HCBuildMolybdenum {\
                                                    display: none;}}\
                                            .mousepresent.inhcpodscreen {\
                                                right: 390px !important;} \
                                            #MapControls.inhcpodscreen, #mapbuttons.inhcpodscreen {\
                                                right: 340px;}\
                                            #PlanetsDashboard.inhcpodscreen{\
                                                width: calc(100% - 360px);\
                                            }\
                                            #PlanetsMenu.inhcpodscreen {\
                                                right: 340px;\
                                            }\
                                            .inhcpodscreen {\
                                                right: 350px;}\
                                            #HCPodScreenButton{\
                                                top: 90px;\
                                                color: #0FF;\
                                                font-weight: bold;\
                                                line-height: 28px;\
                                                font-size: 10px;}\
                                            #HCPodScreen {\
                                                position: absolute;\
                                                right: -37px;\
                                                top: 0px;\
                                                width: 360px;\
                                                height: 100%;\
                                                background-color: #111;\
                                                padding-right: 17px;\
                                                overflow-y: scroll;\
                                                z-index: 9;\
                                                border-radius: 0;\
                                                opacity: 1;\
                                                background-image: url('/img/ui/dot.png'), linear-gradient(to bottom, rgba(26,30,30,1) 0, rgba(13,15,15,1) 100px);}\
                                            #HCPodScreen header {\
                                                background-color: rgba(26,30,30,1);\
                                                cursor: pointer;}\
                                            #HCPodScreenButton.inmessaging {\
                                                right: 350px;}\
                                            @media screen and (orientation:landscape) {\
                                                #Alerts.inhcpodscreen {\
                                                    right: 420px;\
                                                }\
                                            }\
                                            .hcpodrow {\
                                                position:relative;\
                                                height:30px;\
                                                line-height:3px;\
                                            }\
                                            .hcpodscreenimage {\
                                                position:relative;\
                                                height:80px;\
                                                width:80px;\
                                                float:left;\
                                            }\
                                            .hcpodscreenpodimage1 {\
                                                position:absolute;\
                                                height:40px;\
                                                left:40px;\
                                                float:left;\
                                                top:-5px;\
                                            }\
                                            .hcpodscreenpodimage2 {\
                                                position:relative;\
                                                height:20px;\
                                                left:90px;\
                                                float:left;\
                                                top:5px;\
                                            }\
                                            .hcpodscreenplanettext {\
                                                position:relative;\
                                                float:left;\
                                                height:80px;\
                                                width:120px;\
                                            }\
                                            .hcpodscreenplanettextindented {\
                                                position:relative;\
                                                left:2200px;\
                                                width:140px;\
                                            }\
                                            .hcpodscreenpodtext {\
                                                position:absolute;\
                                                left:120px;\
                                                top:13px;\
                                                font-size:14px;\
                                            }\
                                            .hcpodscreenpodtextindented {\
                                                position:absolute;\
                                                left:260px;\
                                                top:13px;\
                                                font-size:14px;\
                                            }\
                                            .hccols::before {\
                                                content:'\\f0c0';\
                                                color:#ff9900;\
                                                font-weight:501;\
                                                font-family:'Font Awesome 5 free';\
                                                position:relative;\
                                                left:-2px;\
                                            }\
                                            .hcnatives::before {\
                                                content:'\\f0c0';\
                                                color:#a000a0;\
                                                font-weight:501;\
                                                font-family:'Font Awesome 5 free';\
                                                position:relative;\
                                                left:-2px;\
                                            }\
                                            .supplies::before {\
                                                font-weight:501\
                                            }\
                                            .tri {\
                                                display:inline-block;\
                                            }\
                                            .tri::before, .tritanium::before {\
                                                font-family: 'Font Awesome 5 Free' !important;\
                                                color: #00ffff;\
                                                content: '\\f0c9';\
                                                content: '\\f0b0';\
                                                content: '\\f037';\
                                                transform: rotate(180deg) translate(0, 0px);\
                                                display:inline-block;\
                                                font-weight:501;\
                                            }"
                        head.appendChild(CssStyle);
                    }
                    if (!document.getElementById("HCPodScreen")) {
                        let podButton = document.createElement("div");
                        podButton.setAttribute("id", "HCPodScreenButton");
                        podButton.setAttribute("class", "mapbutton");
                        podButton.textContent = "HCP";
                        $("#PlanetsContainer").append(podButton);
                        $("#HCPodScreenButton").tclick(function(){HCPlugin.toggleScreen("HCPodScreen", "Messaging")});
                        $("#tomessaging").unbind();
                        $("#tomessaging").tclick(function(){HCPlugin.toggleScreen("Messaging", "HCPodScreen")});
                        vgap.hcpodscreen = $("<section id='HCPodScreen'></section>").hide().appendTo($("#PlanetsContainer"));
                    }
                }

                if(HCPlugin.inClans)
                    HCPlugin.clansMultiplier = 1;
                else
                    HCPlugin.clansMultiplier = 100;

                for (let i = 0; i < vgap.myplanets.length; i++) {
                    HCPlugin.HCTerraforming(vgap.myplanets[i], true);
                }

                //arrays for podscreen
                HCPlugin.podArray = new HCPlugin.SortedObjectArray(["targetid", "turns", "planetid", "hullid", "shipid"]);
                HCPlugin.acceleratorPods = new HCPlugin.SortedObjectArray(["planetId", "shipId"]);
                HCPlugin.sentryPods = new HCPlugin.SortedObjectArray(["planetId", "shipId"]);
                HCPlugin.HCPopulatePodArrays();
                HCPlugin.BuildPodScreen();                
            }
        },

        toggleScreen: function (showScreen, hideScreen) {
            if(!$("#" + hideScreen).attr("style").includes("display: none;")) {
                hideScreen = hideScreen.toLowerCase();
                vgap[hideScreen].toggle();
                vgap.list.toggleClass("in" + hideScreen);
                vgap.menu.toggleClass("in" + hideScreen);
                vgap.dashboard.toggleClass("in" + hideScreen);
                $("#todashboard").toggleClass("in" + hideScreen);
                $("#tomessaging").toggleClass("in" + hideScreen);
                $("#mapbuttons").toggleClass("in" + hideScreen);
                $("#HCPodScreenButton").toggleClass("in" + hideScreen);
                $("#Alerts").toggleClass("in" + hideScreen);
                $("#MapControls").toggleClass("in" + hideScreen);
            }
            if (showScreen) {
                showScreen = showScreen.toLowerCase();
                vgap[showScreen].toggle();
                vgap.list.toggleClass("in" + showScreen);
                vgap.menu.toggleClass("in" + showScreen);
                vgap.dashboard.toggleClass("in" + showScreen);
                $("#todashboard").toggleClass("in" + showScreen);
                $("#tomessaging").toggleClass("in" + showScreen);
                $("#mapbuttons").toggleClass("in" + showScreen);
                $("#HCPodScreenButton").toggleClass("in" + showScreen);
                $("#Alerts").toggleClass("in" + showScreen);
                $("#MapControls").toggleClass("in" + showScreen);
            }
        },

        loadplanet: function () {
            console.log("load planet");
            if (vgap.player.raceid == 12) {
                HCPlugin.BuildPodScreen();
                if (vgap.version < 4) {
                    HCPlugin.EditPlanetScreenOld(vgap.planetScreen.planet);
                    //Add an option to build a stinger fully loaded in a single click (as requested)
                    let createStingerButton = document.createElement("div");
                    createStingerButton.setAttribute('class','SepButton');
                    createStingerButton.setAttribute('id','BuildStingerButton');
                    createStingerButton.innerText = "Build Stinger";
                    var PodLaunchbar = document.getElementById("PodLaunchbar")
                    PodLaunchbar.append(createStingerButton, PodLaunchbar.lastChild);
                    $("#BuildStingerButton").tclick(() => {if(vgap.planetScreen.planet.podhullid != 0) {vgap.planetScreen.cancelBuild();} HCPlugin.BuildAndLoadPod(210);});
                } else {
                    HCPlugin.EditPlanetScreen(vgap.planetScreen.planet);
                    let node = document.getElementById("PodLaunchbar");
                    if (node && node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                    vgap.planetScreen.screen.addSection("PodLaunch", function () { return HCPlugin.BuildMenuButtons()}, null, null, function(){$("#PodLaunchbar").css("height", "90px"); HCPlugin.AddFunctionsToBuildMenu();});
                }
            }
        },

        BuildPodButtonFunction: function () {
            let planet = vgap.planetScreen.planet;
            let bld = vgap.planetScreen.buildData;
            //build the pod
            planet.podhullid = vgap.planetScreen.selectedpodhullid;
            if (planet.podspeed == 0) {
                if (planet.nativetype == 8)
                    planet.podspeed = 7;
                else
                    planet.podspeed = 6;
            }
            vgap.planetScreen.planet.clans -= bld.cost;
            vgap.planetScreen.planet.duranium -= bld.dur;
            vgap.planetScreen.planet.tritanium -= bld.tri;
            vgap.planetScreen.planet.molybdenum -= bld.mol;

            switch (planet.podhullid) {
                case 206: //protofield
                    HCPlugin.BuildMinefield(planet);
                    break;
                case 205: //Accelerator
                    if (HCPlugin.acceleratorPods == undefined) {
                        HCPlugin.acceleratorPods = new HCPlugin.SortedObjectArray(["planetId", "shipId"]);
                    }
                    HCPlugin.acceleratorPods.add({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true)});
                    break;
                case 201: //Sentry
                    if (HCPlugin.sentryPods == undefined) {
                        HCPlugin.sentryPods = new HCPlugin.SortedObjectArray(["planetId", "shipId"]);
                    }
                    HCPlugin.sentryPods.add({ shipId: 0, planetId: vgap.planet, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.target.x, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true), towshipid: null});
                    break;
                default:
                    if (planet.podhullid >=200 && planet.podhullid < 300 && vgap.planetAt(planet.targetx, planet.targety)) {
                        HCPlugin.podArray.add({ planetid: planet.id, shipid: 0, hullid: planet.podhullid, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetid: planet.target.id, turns: HCPlugin.HCGetWaypointLocations(planet, true) });
                    }
                    break;
            }

            vgap.planetScreen.buildPod();
            vgap.map.draw();
            if(vgap.version<4){
                vgap.setLeftHeight();
            } else {
                vgap.planetScreen.refresh();
            }
        },

        BuildMenuButtons: function () {
            var html = "";
            if (vgap.planetScreen.planet.podhullid == 0) {
                html += HCPlugin.BuildButton(null, "BuildPod", "Build Pod");
                html += HCPlugin.BuildButton(210, "BuildStinger", "Build Stinger");
                html += HCPlugin.BuildButton(204, "BuildFarm", "Build Farm");
                html += HCPlugin.BuildButton(207, "BuildDuranium", "Duranium Rock");
                html += HCPlugin.BuildButton(208, "BuildTritanium", "Tritanium Rock");
                html += HCPlugin.BuildButton(209, "BuildMolybdenum", "Molybdenum Rock");
            } else {
                html += HCPlugin.HullPicture();
            }
            return html;
        },

        AddFunctionsToBuildMenu: function () {
            $("#BuildPodButton").tclick(function(){vgap.planetScreen.buildPod()});
            $("#BuildStingerButton").tclick(function(){HCPlugin.BuildAndLoadPod(210)});
            $("#BuildFarmButton").tclick(function(){HCPlugin.BuildAndLoadPod(204)});
            $("#BuildDuraniumButton").tclick(function(){HCPlugin.BuildAndLoadPod(207)});
            $("#BuildTritaniumButton").tclick(function(){HCPlugin.BuildAndLoadPod(208)});
            $("#BuildMolybdenumButton").tclick(function(){HCPlugin.BuildAndLoadPod(209)});
            $("#HullPicture").tclick(function(){vgap.planetScreen.buildPod()});
        },

        HullPicture: function () {
            var hull = vgap.getHull(vgap.planetScreen.planet.podhullid);
            return "<img style='width:90px;height:90px;' src='" + hullImg(hull.id) + "' id='HullPicture'/>";
        },

        BuildButton: function (hullid, id, text) {
            if (hullid == null || HCPlugin.VerifyFullBuild(hullid, true)) {
                return "<div class='HC" + id + " HCBuildButtons' id='" + id + "Button'>" + text + "</div>";
            } else {
                return "<div class='HC" + id + " HCGreyedBuildButton' id='" + id + "Button'>" + text + "</div>";
            }
        },

        BuildAndLoadPod: function (hullid) {
            var planet = vgap.planetScreen.planet;
            if (HCPlugin.VerifyFullBuild(hullid, true)) {
                vgap.planetScreen.selectedpodhullid = hullid;
                var hull = vgap.getHull(hullid);
                let bld = vgap.planetScreen.buildData;
                planet.clans -= bld.cost;
                planet.duranium -= bld.dur;
                planet.tritanium -= bld.tri;
                planet.molybdenum -= bld.mol;
                planet.podhullid = hullid;
                if (planet.podspeed == 0) {
                    if (planet.nativetype == 8)
                        planet.podspeed = 7;
                    else
                        planet.podspeed = 6;
                }
                vgap.planetScreen.podTransfer(hull.cargo, vgap.podCargoType(hullid));
                vgap.closeMore();
                vgap.map.draw();
                if(vgap.version < 4){
                    vgap.setLeftHeight();
                }
            }
        },

        VerifyFullBuild: function (hullid, store) {
            var planet = vgap.planetScreen.planet;

            var bld = { cost: 0, dur: 0, tri: 0, mol: 0, hcount: 0, hcost: 0, hdur: 0, htri: 0, hmol: 0, ecount: 0, ecost: 0, edur: 0, etri: 0, emol: 0, bcount: 0, bcost: 0, bdur: 0, btri: 0, bmol: 0, lcount: 0, lcost: 0, ldur: 0, ltri: 0, lmol: 0, tcost: 0, hup: 0, eup: 0, bup: 0, lup: 0 };

            var hull = vgap.getHull(hullid);

            bld.hcost = hull.cost;
            bld.hdur = hull.duranium;
            bld.htri = hull.tritanium;
            bld.hmol = hull.molybdenum;

            bld.cost = bld.hcost + bld.ecost + bld.bcost + bld.lcost + bld.tcost;
            bld.dur = bld.hdur + bld.edur + bld.bdur + bld.ldur;
            bld.tri = bld.htri + bld.etri + bld.btri + bld.ltri;
            bld.mol = bld.hmol + bld.emol + bld.bmol + bld.lmol;

            //store for startbuild
            if (store)
                vgap.planetScreen.buildData = bld;
            if (hullid != 207 && hullid != 208 && hullid != 209) {
                vgap.planetScreen.planet[vgap.podCargoType(hullid)] -= hull.cargo;
            }
            if (planet.clans >= bld.cost && planet.duranium >= bld.dur && planet.tritanium >= bld.tri && planet.molybdenum >= bld.mol) {
                if (hullid != 207 && hullid != 208 && hullid != 209) {
                    vgap.planetScreen.planet[vgap.podCargoType(hullid)] += hull.cargo;
                }
                return true;
            } else {
                if (hullid != 207 && hullid != 208 && hullid != 209) {
                    vgap.planetScreen.planet[vgap.podCargoType(hullid)] += hull.cargo;
                }
                return false;
            }
        },

        HCBurrows: function (planet) {
            //Determine burrow adjustments to mining rate and percentage
            planet.HCBurrowsAdded = Math.floor(planet.targetdefense / 100 * planet.clans / 4);
            planet.HCBurrowPercentage = planet.burrowsize / planet.clans * 100;
            planet.HCBurrowAdjustment = planet.HCBurrowsAdded / planet.clans * 100;
            HCPlugin.HCFoodNeeded(planet);
        },

        HCMining: function (planet, fullBuild) {
            //Calculate number of effective mines and amount mined
            planet.HCMines = Math.floor(Math.ceil(Math.sqrt(planet.clans * 0.49 * planet.targetmines / 100)) * (Math.min(1, planet.burrowsize/planet.clans) + 1));
            //repitiles double effective mines
            if (planet.nativetype == 3) {
                planet.HCMines = 2 * planet.HCMines
            }
            planet.HCMiningNeutronium = Math.min(planet.groundneutronium, Math.round(planet.HCMines * planet.densityneutronium / 100));
            planet.HCMiningDuranium = Math.min(planet.groundduranium, Math.round(planet.HCMines * planet.densityduranium / 100));
            planet.HCMiningTritanium = Math.min(planet.groundtritanium, Math.round(planet.HCMines * planet.densitytritanium / 100));
            planet.HCMiningMolybdenum = Math.min(planet.groundmolybdenum, Math.round(planet.HCMines * planet.densitymolybdenum / 100));
            if (fullBuild) {
                HCPlugin.HCLiquifying(planet, fullBuild);
            } else {
                HCPlugin.HCFoodNeeded(planet);
            }
        },

        HCHarvestingClans: function (planet, fullBuild) {
            //Determine how many clans will harvest (or exterminate)
            planet.HCHarvestingClans = Math.floor(planet.targetfactories / 100 * (planet.clans - planet.HCLiqClans));
            if (fullBuild) {
                HCPlugin.HCBurrows(planet, fullBuild);
            } else {
                HCPlugin.HCFoodNeeded(planet);
            }
        },

        HCLiquifying: function (planet, fullBuild) {
            //Determine the amount of Neutronium made from liquification, side note, liquifying generates MegaCredits on the planet as though the population were taxed
            planet.HCLiqClans = Math.floor(planet.colonisttaxrate / 100 * planet.clans);
            planet.HCNeutroniumMadeFromLiquidation = Math.floor(Math.pow(planet.HCLiqClans, 2 / 3));
            HCPlugin.HCHarvestingClans(planet, fullBuild);
        },

        HCTerraforming: function (planet, fullBuild) {
            //Determine the temperature change of a planet
            planet.HCTempChange = Math.min(Math.abs(50 - planet.temp), Math.floor(Math.sqrt(Math.floor(planet.builtmines / 100 * planet.clans)) / 100));
            if (planet.temp>50) {
                planet.HCTempChange *= -1;
            }
            if (fullBuild) {
                HCPlugin.HCMining(planet, fullBuild);
            } else {
                HCPlugin.HCFoodNeeded(planet);
            }
        },

        HCFoodNeeded: function (planet) {
            //Get number of unallocated workers (Allocated is 100 - unallocated)
            planet.HCUnallocated = 100 - planet.targetmines - planet.targetfactories - planet.targetdefense - planet.builtmines - planet.colonisttaxrate;
            //When a planet is taken to 50 degrees all the workers that were terraforming count as though they were resting
            if ((planet.temp + planet.HCTempChange) == 50) {
                planet.HCUnallocated += planet.builtmines;
            }
            //Determine the amount of food needed
            if (planet.HCBurrowPercentage + planet.HCBurrowAdjustment >= 100) {
                planet.HCFoodNeeded = Math.ceil((100 - planet.HCUnallocated) / 100 * (planet.clans - planet.HCLiqClans) / 100);
            } else {
                planet.HCFoodNeeded = Math.ceil(planet.HCUnallocated / 100 * (planet.clans - planet.HCLiqClans) / 100) + 2 * Math.ceil((100 - planet.HCUnallocated) / 100 * (planet.clans - planet.HCLiqClans) / 100);
            }
            HCPlugin.HCNativeGrowth(planet);
        },

        HCNativeGrowth: function (planet) {
            //Native Growth isn't calculated in one step because the first part of the calculation is used to determine the number of native clans eaten and harvested
            
            planet.HCSimpleNativeGrowth = 0;
            planet.HCEaten = 0;
            planet.HCHarvestedNativeClans = 0;
            planet.HCNewLarva = 0;
            if (planet.nativeclans > 0){

                //Get the maximum population after terraforming
                let nativeMax = 0;
                if (planet.nativetype == 9)
                    nativeMax = (planet.temp + planet.HCTempChange) * 1000; //siliconoid like it hot
                else
                    nativeMax = Math.round(Math.sin(3.14 * (100 - (planet.temp + planet.HCTempChange)) / 100) * 150000);

                //Calculate the base growth before deductions
                if (planet.clans > 0 && planet.nativeclans < nativeMax) {
                    if (planet.nativetype == 9)
                        planet.HCSimpleNativeGrowth = Math.round((planet.temp + planet.HCTempChange) / 100 * planet.nativeclans / 25); //siliconoid like it hot
                    else
                        planet.HCSimpleNativeGrowth = Math.round(Math.sin(3.14 * (100 - (planet.temp + planet.HCTempChange)) / 100) * planet.nativeclans / 25);
                }

                //avian growth
                if (planet.nativetype == 4)
                    planet.HCSimpleNativeGrowth = Math.floor(planet.HCSimpleNativeGrowth * 1.25);
            
            
                //Determine the number of native clans eaten
                if (planet.nativetype != 9) {
                    planet.HCEaten = Math.min(planet.nativeclans + planet.HCSimpleNativeGrowth, planet.HCFoodNeeded);
                }
                planet.HCHarvestedNativeClans = Math.min(planet.nativeclans + planet.HCSimpleNativeGrowth - planet.HCEaten, planet.HCHarvestingClans);
                HCPlugin.HCLarva(planet);
            }

            //Determine the number of native clans harvested
            planet.HCNativeGrowth = planet.HCSimpleNativeGrowth - planet.HCEaten - planet.HCHarvestedNativeClans;
            HCPlugin.HCSupplies(planet);
            HCPlugin.HCColonistGrowth(planet);
        },

        HCLarva: function (planet) {
            var factor = 3;
            if (planet.nativetype == 2) factor = 4;//bov
            if (planet.nativetype == 4) factor = 2;//avian
            if (planet.nativetype == 6) factor = 1;//insectoid
            if (planet.nativetype == 9) factor = 0;//siliconoid

            //return number of new larva
            planet.HCNewLarva = planet.HCHarvestedNativeClans * factor;
        },

        HCSupplies: function (planet) {
            //Determine the change in supplies based on the number of natives actually eaten
            planet.HCSuppliesGenerated = 0;
            //can't eat Siliconoids or Air
            if (planet.nativetype != 0 && planet.nativetype != 9) {
                planet.HCSuppliesGenerated = Math.floor(planet.HCEaten / 10);
                if (planet.clans > 0 && planet.nativetype == 2 && planet.nativeclans > 0)
                    planet.HCSuppliesGenerated += Math.min(planet.clans, Math.floor(planet.nativeclans / 100));
            }
        },

        HCColonistGrowth: function (planet) {
            //supplies consumed is set when colonist growth is calculated since it is based on overpopulation
            planet.HCSuppliesConsumed = 0;
            let climateDeathRate = 10;
            planet.HCColonistMaxPop = 0;
            if(planet.debrisdisk == 0) {
                let temp = planet.temp + planet.HCTempChange;
                //Horwasp support 3 times normal population from temperature
                if (temp > 84)
                    planet.HCColonistMaxPop = 3 * Math.floor((20099.9 - 200 * temp) / climateDeathRate);
                else if (temp < 15)
                    planet.HCColonistMaxPop = 3 * Math.floor((299.9 + 200 * temp) / climateDeathRate);
                else
                    planet.HCColonistMaxPop = 3 * Math.round(Math.sin(3.14 * (100 - temp) / 100) * 100000);
            }

            //burrows protect horwasp
            planet.HCColonistMaxPop = Math.max(planet.HCColonistMaxPop, planet.burrowsize + planet.HCBurrowsAdded);

            //Botaniccals increase the maximum population supported by 50%
            if (planet.nativetype == 11 && planet.nativeclans > 0)
                planet.HCColonistMaxPop = Math.round(planet.HCColonistMaxPop * 1.5);

            //Colonist Growth
            planet.HCColonistGrowth = planet.larva - planet.HCLiqClans;
            if (planet.nativetype != 9 && planet.nativetype != 0) {
                var unfed = planet.HCFoodNeeded - planet.HCEaten;
                if (unfed > 0) {
                    planet.HCColonistGrowth -= unfed;
                }
            } else {
                planet.HCColonistGrowth -= planet.HCFoodNeeded;
            }
            let unsupportedPopulation = planet.clans + planet.HCColonistGrowth - planet.HCColonistMaxPop;
            if (unsupportedPopulation > 0) {
                planet.HCSuppliesConsumed = 1 + Math.floor(unsupportedPopulation / 400);
                let populationSupportedBySupplies = Math.round((planet.supplies+planet.HCSuppliesGenerated) / 4);
                unsupportedPopulation -= populationSupportedBySupplies;
                if (unsupportedPopulation > 0) {
                    //death from overpopulation
                    planet.HCColonistGrowth -= Math.ceil(unsupportedPopulation / 10);
                }
            }    
            //Amorphous eating
            if (planet.nativetype == 5) {
                planet.HCColonistGrowth -= 25;
            }

            //Determine what the burrow percentage should be next turn to show the predicted change in burrow percentage
            planet.HCNextTurnBurrowPercentage = (planet.burrowsize + planet.HCBurrowsAdded) / (planet.clans + planet.HCColonistGrowth) * 100;

            if (vgap.map.activePlanet) {
                if (vgap.version <4) {
                    HCPlugin.EditPlanetScreenOld(planet);
                } else {
                    HCPlugin.EditPlanetScreen(planet);
                }
            }
        },

        EditPlanetScreen: function (planet) {
            if (planet.HCMines > 0 || planet.HCNeutroniumMadeFromLiquidation > 0)
                document.getElementById("Resourcesbar").getElementsByClassName("lval neu")[0].getElementsByTagName("span")[1].innerHTML = vgap.planetScreen.changeText(planet.HCMiningNeutronium + planet.HCNeutroniumMadeFromLiquidation);
            else
                document.getElementById("Resourcesbar").getElementsByClassName("lval neu")[0].getElementsByTagName("span")[1].innerHTML = "(" + gsv(planet.densityneutronium) + "%)";
            if (planet.HCMines > 0) {
                document.getElementById("Resourcesbar").getElementsByClassName("lval dur")[0].getElementsByTagName("span")[1].innerHTML = vgap.planetScreen.changeText(planet.HCMiningDuranium);
                document.getElementById("Resourcesbar").getElementsByClassName("lval tri")[0].getElementsByTagName("span")[1].innerHTML = vgap.planetScreen.changeText(planet.HCMiningTritanium);
                document.getElementById("Resourcesbar").getElementsByClassName("lval mol")[0].getElementsByTagName("span")[1].innerHTML = vgap.planetScreen.changeText(planet.HCMiningMolybdenum);
            } else {
                document.getElementById("Resourcesbar").getElementsByClassName("lval dur")[0].getElementsByTagName("span")[1].innerHTML = "(" + gsv(planet.densityduranium) + "%)";
                document.getElementById("Resourcesbar").getElementsByClassName("lval tri")[0].getElementsByTagName("span")[1].innerHTML = "(" + gsv(planet.densitytritanium) + "%)";
                document.getElementById("Resourcesbar").getElementsByClassName("lval mol")[0].getElementsByTagName("span")[1].innerHTML = "(" + gsv(planet.densitymolybdenum) + "%)";
            }
            if (planet.HCSuppliesGenerated - planet.HCSuppliesConsumed < 0 && planet.supplies < Math.abs(planet.HCSuppliesGenerated - planet.HCSuppliesConsumed)) {
                document.getElementById("Resourcesbar").getElementsByClassName("lval supplies")[0].childNodes[1].textContent = addCommas(planet.supplies) + " " + vgap.planetScreen.changeText(-planet.supplies);
            } else {
                document.getElementById("Resourcesbar").getElementsByClassName("lval supplies")[0].childNodes[1].textContent = addCommas(planet.supplies) + " " + vgap.planetScreen.changeText(planet.HCSuppliesGenerated-planet.HCSuppliesConsumed);
            }
            if (planet.clans > 0) {
                if (planet.HCColonistMaxPop < 10000) {
                    document.getElementById("Colonybar").getElementsByClassName("vval cols")[0].innerHTML = addCommas(planet.clans * HCPlugin.clansMultiplier) + "<span> /" + addCommas(planet.HCColonistMaxPop) + " " + vgap.planetScreen.changeText(planet.HCColonistGrowth * HCPlugin.clansMultiplier);
                } else {
                    document.getElementById("Colonybar").getElementsByClassName("vval cols")[0].innerHTML = addCommas(planet.clans * HCPlugin.clansMultiplier) + "<span> " + vgap.planetScreen.changeText(planet.HCColonistGrowth * HCPlugin.clansMultiplier);
                }
                document.getElementById("Colonybar").getElementsByClassName("vval larva")[0].innerHTML = addCommas(planet.larva * HCPlugin.clansMultiplier) + "<span> " + vgap.planetScreen.changeText(planet.HCNewLarva * HCPlugin.clansMultiplier);
                document.getElementById("Colonybar").getElementsByClassName("vval burrow")[0].innerHTML = Math.min(100, Math.floor(planet.HCBurrowPercentage)) + "%<span> " + Math.floor(planet.HCBurrowPercentage) + "% " + vgap.planetScreen.changeText(Math.floor(planet.HCNextTurnBurrowPercentage) - Math.floor(planet.HCBurrowPercentage));
                if (planet.nativeclans > 0)
                    document.getElementById("Colonybar").getElementsByClassName("vval natives")[0].innerHTML = addCommas(planet.nativeclans * HCPlugin.clansMultiplier) + "<span> " + vgap.planetScreen.changeText(planet.HCNativeGrowth * HCPlugin.clansMultiplier);
            }
            if (document.getElementsByClassName("formshow showmining").length != 0) {
                document.getElementsByClassName("formshow showmining")[0].innerHTML = HCPlugin.planetMiningAbility(planet);
            }
            if (document.getElementsByClassName("formshow showburrowing").length != 0) {
                document.getElementsByClassName("formshow showburrowing")[0].innerHTML = HCPlugin.planetBurrowAbility(planet);
            }
            if (document.getElementsByClassName("formshow showliquify").length != 0) {
                document.getElementsByClassName("formshow showliquify")[0].innerHTML = HCPlugin.planetLiquifyAbility(planet);
            }
            if (planet.podhullid >= 200 && planet.podhullid < 300) {
                document.getElementById("PodWarpbar").getElementsByClassName("tval arrival")[0].childNodes[0].data = HCPlugin.HCGetWaypointLocations(planet, true);
            }
        },

        planetMiningAbility: function (planet) {
            var html = "<p>Effective planetary mines: " + planet.HCMines + "<br/>";
            html += "Mining " + planet.HCMiningNeutronium + " Neutronium<br/>";
            html += "Mining " + planet.HCMiningDuranium + " Duranium<br/>";
            html += "Mining " + planet.HCMiningTritanium + " Tritanium<br/>";
            html += "Mining " + planet.HCMiningMolybdenum + " Molybdenum<br/></p>";
            return html;
        },

        planetBurrowAbility: function (planet) {
            var burrowText = "<p>Burrow can hold " + addCommas(planet.burrowsize * HCPlugin.clansMultiplier) + " workers - " + Math.floor(planet.HCBurrowPercentage) + "%.<br/>";
            burrowText += "Adding room for " + addCommas(planet.HCBurrowsAdded * HCPlugin.clansMultiplier) + " more workers - " + Math.floor(planet.HCNextTurnBurrowPercentage) + "%.</p>";
            return burrowText;
        },

        planetLiquifyAbility: function (planet) {
            return "<p>Liquify " + addCommas(planet.HCLiqClans * HCPlugin.clansMultiplier) + " workers into " + Math.floor(Math.pow(planet.HCLiqClans, 2 / 3)) + " neutronium.</p>";
        },

        EditPlanetScreenOld: function (planet) {
            if (planet.HCMines > 0 || planet.HCNeutroniumMadeFromLiquidation > 0)
                document.getElementById("Resources").getElementsByClassName("valsup")[1].innerHTML = (planet.HCMines > 0 ? "mining " + planet.HCMiningNeutronium + "/turn " : "") + (planet.colonisttaxrate > 0 ? "+" + planet.HCNeutroniumMadeFromLiquidation : "");
            else
                document.getElementById("Resources").getElementsByClassName("valsup")[1].innerHTML = "";
            if (planet.HCMines > 0) {
                document.getElementById("Resources").getElementsByClassName("valsup")[3].innerHTML = "mining " + planet.HCMiningDuranium + "/turn";
                document.getElementById("Resources").getElementsByClassName("valsup")[5].innerHTML = "mining " + planet.HCMiningTritanium + "/turn";
                document.getElementById("Resources").getElementsByClassName("valsup")[7].innerHTML = "mining " + planet.HCMiningMolybdenum + "/turn";
            } else {
                document.getElementById("Resources").getElementsByClassName("valsup")[3].innerHTML = "";
                document.getElementById("Resources").getElementsByClassName("valsup")[5].innerHTML = "";
                document.getElementById("Resources").getElementsByClassName("valsup")[7].innerHTML = "";
            }
            if (planet.HCSuppliesGenerated - planet.HCSuppliesConsumed < 0 && planet.supplies < Math.abs(planet.HCSuppliesGenerated - planet.HCSuppliesConsumed)) {
                document.getElementById("Resources").getElementsByClassName("valsup")[8].innerHTML = vgap.planetScreen.changeText(-planet.supplies);
            } else {
                document.getElementById("Resources").getElementsByClassName("valsup")[8].innerHTML = vgap.planetScreen.changeText(planet.HCSuppliesGenerated - planet.HCSuppliesConsumed);
            }
            if (planet.clans > 0) {
                document.getElementById("Colony").getElementsByClassName("val")[0].innerHTML = addCommas(planet.clans * HCPlugin.clansMultiplier);
                document.getElementById("Colony").getElementsByClassName("valsup")[0].innerHTML = " " + vgap.planetScreen.changeText(planet.HCColonistGrowth * HCPlugin.clansMultiplier);
                document.getElementById("Colony").getElementsByClassName("val")[1].innerHTML = addCommas(planet.larva * HCPlugin.clansMultiplier);
                document.getElementById("Colony").getElementsByClassName("valsup")[1].innerHTML = " " + vgap.planetScreen.changeText(planet.HCNewLarva * HCPlugin.clansMultiplier);
                document.getElementById("Colony").getElementsByClassName("val")[2].innerHTML = "(" + Math.min(100, Math.floor(planet.HCBurrowPercentage)) + "%) " + HCPlugin.burrowSizeText(planet);
                document.getElementById("Colony").getElementsByClassName("valsup")[2].innerHTML = " " + Math.floor(planet.HCBurrowPercentage) + "% " + vgap.planetScreen.changeText(Math.floor(planet.HCNextTurnBurrowPercentage) - Math.floor(planet.HCBurrowPercentage));
                if (planet.nativeclans > 0) {
                    document.getElementById("Colony").getElementsByClassName("val")[3].innerHTML = addCommas(planet.nativeclans * HCPlugin.clansMultiplier)
                    document.getElementById("Colony").getElementsByClassName("valsup")[4].innerHTML = vgap.planetScreen.changeText(planet.HCNativeGrowth * HCPlugin.clansMultiplier);
                }
            }
            if (document.getElementById("TransferScreen") && document.getElementById("TransferScreen").getElementsByTagName("h1")[0].textContent == "Allocate Workers") {
                document.getElementById("TransferScreen").getElementsByTagName("p")[1].innerHTML = HCPlugin.planetBurrowAbility(planet);
                
            }
            if (document.getElementById("AssemblyHullSpecial") && !document.getElementById("ShipPurchase")) {
                //insert data to be able to put clans on non-pod ships at construction to be consistant with the new interface
                var hull = vgap.getHull(vgap.planetScreen.selectedpodhullid);
                if (vgap.podCargoType(planet.podhullid) == "clans") {
                    if (hull.beams > 0) {
                        var beamId = Math.floor((planet.podcargo / hull.cargo) * 9) + 1;
                        $("#beamtype").text(hull.beams + " " + vgap.getBeam(beamId).name);
                    }
                    if (hull.launchers > 0) {
                        var torpedoId = Math.floor((planet.podcargo / hull.cargo) * 9) + 1;
                        $("#launchertype").text(hull.launchers + " " + vgap.getTorpedo(torpedoId).name);
                    }
                    if (hull.fighterbays > 0) {
                        var fighters = Math.floor((planet.podcargo / hull.cargo) * 10 * hull.fighterbays) + 10;
                        $("#fightercount").text(hull.fighterbays + " (" + fighters + " fighters)");
                    }
                    $("#combatmass").text(hull.mass + Math.floor((planet.podcargo / hull.cargo) * hull.mass));
                }
                document.getElementById("AssemblyHullSpecial").after(HCPlugin.InsertTable(planet));
            }
            if (planet.podhullid >= 200 && planet.podhullid < 300) {
                document.getElementById("ArrivalStatus").getElementsByClassName("BoxVal")[0].childNodes[0].textContent = HCPlugin.HCGetWaypointLocations(planet, true) + " ";
            }
            
            if (HCPlugin.VerifyFullBuild(210) && planet.podhullid == 0) {
                $("#BuildStingerButton").show();
            } else {
                $("#BuildStingerButton").hide();
            }
        },

        InsertTable: function (planet) {
            var cargoType = vgap.podCargoType(planet.podhullid);
            var html = "<div id='ShipPurchase'>";
            html += "<table><tr><td style='width:100px;text-transform:capitalize;'>" + cargoType + ": </td><td class='TransferVal'>" + planet[cargoType] + "</td><td></td><td><div id='PodTransfer'></div></td><td class='TransferVal'>" + planet.podcargo + "</td><td class='valsup'></td></tr></table>";
            html += "</table></div>";
            $(html).appendTo(vgap.more);
            $("#PodTransfer").leftRight(function (change) { vgap.planetScreen.podTransfer(change, cargoType); }, 1000);
            vgap.planetScreen.screen.refresh();
        },

        burrowSizeText: function (planet) {
            var burrowSize = "None";
            if (planet.burrowsize > 100000)
                burrowSize = "Massive";
            else if (planet.burrowsize > 10000)
                burrowSize = "Large";
            else if (planet.burrowsize > 1000)
                burrowSize = "Medium";
            else if (planet.burrowsize > 100)
                burrowSize = "Small";
            else if (planet.burrowsize > 0)
                burrowSize = "Tiny";
            return burrowSize;
        },

        //commented out
        loadship: function () {
            console.log("load ship");
            var plg = vgap.plugins["HorwaspCorrections"];
            if (vgap.player.raceid == 12 && !HCPlugin.adjustedShipTransfer) {
                vgap.shipScreen.transferOld = vgap.shipScreen.transfer;
                vgap.shipScreen.transfer = function () {vgap.shipScreen.transferOld(); HCPlugin.adjustShipTransferScreen();}
                HCPlugin.adjustedShipTransfer = true;
            }
            return;
        },

        adjustShipTransferScreen: function () {
            var planet = vgap.shipScreen.planet;
            var plg = vgap.plugins["HorwaspCorrections"];
            if (vgap.version >= 4 && HCPlugin.inClans) {
                if (planet && document.getElementsByClassName("MoreTitle").length !=0 && document.getElementsByClassName("MoreTitle")[0].innerHTML == "Select Transfer Target"){
                    document.getElementById("MoreScreen").getElementsByClassName("lval clans")[0].innerHTML = "" + planet.clans;
                }
            } else if (HCPlugin.inClans) {
                if (planet && document.getElementById("SelectLocation") != null){
                    let partialIndex = document.getElementById("SelectLocation").getElementsByClassName("CleanTable")[0].innerHTML.indexOf("Colonists");
                    let narrowedIndex = document.getElementById("SelectLocation").getElementsByClassName("CleanTable")[0].innerHTML.substring(partialIndex).indexOf("<td>") + 4;
                    let endIndex = document.getElementById("SelectLocation").getElementsByClassName("CleanTable")[0].innerHTML.substring(partialIndex+narrowedIndex).indexOf("</td>");
                    document.getElementById("SelectLocation").getElementsByClassName("CleanTable")[0].innerHTML =
                        document.getElementById("SelectLocation").getElementsByClassName("CleanTable")[0].innerHTML.substring(0, partialIndex + narrowedIndex) + planet.clans +
                        document.getElementById("SelectLocation").getElementsByClassName("CleanTable")[0].innerHTML.substring(partialIndex + narrowedIndex + endIndex);
                }
            }
        },

        draw: function () {
            if (vgap.player.raceid === 12) {
                HCPlugin.ShowMinefieldPreview();
                if (vgap.planetScreenOpen && vgap.planetScreen.planet.podhullid != 0) {
                    HCPlugin.AddWaypointCircles(vgap.planetScreen.planet);
                }
            }
        },

        loadmap: function () {
            console.log("load map");
            if (vgap.player.raceid == 12) {
                if (vgap.version >=4) {
                    //shift buttons to make room for more
                    $("#MapControls").attr("style", "top:130px;");
                    $("#mapbuttons").attr("style", "top:130px;");
                }
            }
        },

        AddWaypointCircles: function (planet) {
            if (planet.podhullid >= 200 && planet.podhullid < 300) {
                var waypointLocations = HCPlugin.HCGetWaypointLocations(planet);
                for (let i = 0; i < waypointLocations.length; i++) {
                    vgap.map.drawCircle(vgap.map.ctx, vgap.map.screenX(waypointLocations[i].x), vgap.map.screenY(waypointLocations[i].y), 3, "yellow", 1);
                }
            }
        },

        HCGetPath: function (obj) {
            let path = new Array();
            if (obj.x != obj.targetx || obj.y != obj.targety) {
                if (vgap.isPlanet(obj)) {
                    if (obj.builtdefense > 0) {
                        let accelerator = vgap.getShip(obj.builtdefense);
                        path.push({ x1: obj.x, y1: obj.y, x2: accelerator.x, y2: accelerator.y, dist: Math.dist(obj.x, obj.y, accelerator.x, accelerator.y), speed: obj.podspeed * obj.podspeed });
                        path.push({ x1: accelerator.x, y1: accelerator.y, x2: obj.targetx, y2: obj.targety, dist: Math.dist(accelerator.x, accelerator.y, obj.targetx, obj.targety), speed: obj.podspeed * obj.podspeed * 1.5 });
                    } else {
                        path.push({ x1: obj.x, y1: obj.y, x2: obj.targetx, y2: obj.targety, dist: Math.dist(obj.x, obj.y, obj.targetx, obj.targety), speed: obj.podspeed * obj.podspeed });
                    }
                } else {
                    if (obj.neutronium == 2) {
                        path.push({ x1: obj.x, y1: obj.y, x2: obj.targetx, y2: obj.targety, dist: Math.dist(obj.x, obj.y, obj.targetx, obj.targety), speed: obj.warp * obj.warp * 1.5 });
                    } else {
                        path.push({ x1: obj.x, y1: obj.y, x2: obj.targetx, y2: obj.targety, dist: Math.dist(obj.x, obj.y, obj.targetx, obj.targety), speed: obj.warp * obj.warp });
                        if (obj.target.x != obj.targetx && obj.target.y != obj.targety) {
                            path.push({ x1: obj.targetx, y1: obj.targety, x2: obj.target.x, y2: obj.target.y, dist: Math.dist(obj.targetx, obj.targety, obj.target.x, obj.target.y), speed: obj.warp * obj.warp * 1.5});
                        }
                    }
                }
            }
            return path;
        },

        HCGetWaypointLocations: function (planet, returnNumberOfTurns) {
            let waypoints = new Array();
            let path = HCPlugin.HCGetPath(planet);
            let curX = planet.x;
            let curY = planet.y;
            for (var i = 0; i < path.length; i++) {
                while (curX != path[i].x2 || curY != path[i].y2) {
                    if (Math.dist(curX, curY, path[i].x2, path[i].y2) <= path[i].speed + 0.5) {
                        curX = path[i].x2;
                        curY = path[i].y2;
                    } else {
                        let diffX = path[i].x2 - curX;
                        let diffY = path[i].y2 - curY;
                        if (Math.abs(diffX) > Math.abs(diffY)) {
                            let moveX = Math.floor((path[i].speed * diffX) / Math.sqrt((diffX * diffX) + (diffY * diffY)) + 0.5);
                            curX = curX + moveX;
                            let minordist = moveX * (diffY / diffX);
                            let minorsign = (minordist ? minordist / Math.abs(minordist) : 1);
                            curY = curY + Math.floor(Math.abs(minordist) + 0.5) * minorsign;
                        } else {
                            let moveY = Math.floor((path[i].speed * diffY) / Math.sqrt((diffX * diffX) + (diffY * diffY)) + 0.5);
                            curY = curY + moveY;
                            let minordist = moveY * (diffX / diffY);
                            let minorsign = (minordist ? minordist / Math.abs(minordist) : 1);
                            curX = curX + Math.floor(Math.abs(minordist) + 0.5) * minorsign;
                        }
                    }
                    let planet = vgap.warpWell(curX, curY);
                    if (planet != null && planet.debrisdisk == 0) {
                        //alert(planet.name);
                        curX = planet.x;
                        curY = planet.y;
                        let dist = Math.dist(path[i].x2, path[i].y2, planet.x, planet.y);
                        if (dist <= 3) {
                            //alert(planet.name);
                            path[i].x2 = planet.x;
                            path[i].y2 = planet.y;
                        }
                    }
                    waypoints.push({x: curX, y:curY});
                }
            }
            if (returnNumberOfTurns)
                return waypoints.length;
            return waypoints;
        },

        cancelMinefieldBuild: function (planet) {
            if (planet.podcargo == 0)
                return;
            let minefield = HCPlugin.updatedFields.find(field => field.planetId.find(planetid => planetid == planet.id) != undefined);
            minefield.planetId.splice(minefield.planetId.findIndex(field => field == planet.id), 1);
            if (planet.targetx == planet.x && planet.targety == planet.y){
                minefield.units -= planet.podcargo;
                if (minefield.futureUnits === 0 && minefield.originalUnits === minefield.units && minefield.planetId.length === 0) {
                    HCPlugin.updatedFields.splice(HCPlugin.updatedFields.findIndex(field => field.id === minefield.id), 1);
                } else {
                    minefield.radius = vgap.minefieldRadius(minefield.units);
                }
            } else {
                minefield.futureUnits -= planet.podcargo;
                if (minefield.futureUnits === 0 && minefield.originalUnits === minefield.units && minefield.planetId.length === 0) {
                    HCPlugin.updatedFields.splice(HCPlugin.updatedFields.findIndex(field => field.id === minefield.id), 1);
                } else {
                    minefield.futureRadius = vgap.minefieldRadius(minefield.units + minefield.futureUnits);
                }
            }
        },

        BuildMinefield: function (planet) {
            if (planet.podcargo == 0)
                return;
            var minefields = vgap.minefieldsAt(planet.targetx, planet.targety);
            var existingMinefield = null;
            var mfdist = Infinity;
            for(let i = 0; i < minefields.length; i++) {
                let minefield = minefields[i];
                if (minefield.ownerid == planet.ownerid) {
                    var distance = Math.dist(minefield.x, minefield.y, planet.targetx, planet.targety);
                    if (distance < mfdist) {
                        mfdist = distance;
                        existingMinefield = minefield;
                    }
                }
            }
            var update = null;
            let newMinefield = null
            if (existingMinefield == null) {
                newMinefield = {id: HCPlugin.minefieldIdCounter--, ownerid: planet.ownerid, x: planet.targetx, y: planet.targety, isWeb: false, originalUnits: 0, units: 0, futureUnits: 0};
                newMinefield.planetId = new Array();
                newMinefield.planetId.push(planet.id);
            } else {
                update = HCPlugin.updatedFields.find(e => e.id === existingMinefield.id);
                if (update) {
                    newMinefield = update;
                    update.planetId.push(planet.id);
                } else {
                    newMinefield = {id: existingMinefield.id, ownerid: planet.ownerid, x: existingMinefield.x, y: existingMinefield.y, isWeb: false, originalUnits: existingMinefield.units, units: existingMinefield.units, futureUnits: 0};
                    newMinefield.planetId = new Array();
                    newMinefield.planetId.push(planet.id);
                }
            }
            vgap.setMineColors(newMinefield);
            if (planet.x == planet.targetx && planet.y == planet.targety) {
                newMinefield.units += planet.podcargo;
                if (newMinefield.units >= 22500) {
                    newMinefield.radius = 150;
                } else {
                    newMinefield.radius = vgap.minefieldRadius(newMinefield.units);
                }
            } else {
                newMinefield.futureUnits += planet.podcargo;
                if (newMinefield.units + newMinefield.futureUnits >= 22500) {
                    newMinefield.futureRadius = 150;
                } else {
                    newMinefield.futureRadius = vgap.minefieldRadius(newMinefield.units + newMinefield.futureUnits);
                }
            }
            if (!update) {
                HCPlugin.updatedFields.push(newMinefield);
            }
        },

        MinefieldPreviewPrecalculations: function () {
            //Ships to Map
            let update = null;
            for (let i = 0; i < vgap.myships.length; i++) {
                let ship = vgap.myships[i];
                if (ship.hullid == 206 && ship.clans > 0) {
                    let minefields = vgap.minefieldsAt(ship.targetx, ship.targety);
                    let existingMinefield = null;
                    let mfdist = Infinity;
                    for (let j = 0; j < minefields.length; j++) {
                        let minefield = minefields[j];
                        if (minefield.ownerid == ship.ownerid) {
                            let distance = Math.dist(minefield.x, minefield.y, ship.targetx, ship.targety);
                            if (distance < mfdist) {
                                mfdist = distance;
                                existingMinefield = minefield;
                            }
                        }
                    }
                    update = null;
                    let newMinefield = null;
                    if (existingMinefield == null) {
                        newMinefield = {id: HCPlugin.minefieldIdCounter--, ownerid: ship.ownerid, x: ship.targetx, y: ship.targety, isWeb: false, originalUnits: 0, units: 0, futureUnits: 0};
                        newMinefield.originalRadius = 0;
                        newMinefield.planetId = new Array();
                    } else {
                        update = HCPlugin.updatedFields.find(e => e.id === existingMinefield.id);
                        if (update) {
                            newMinefield = update;
                        } else {
                            newMinefield = {id: existingMinefield.id, ownerid: ship.ownerid, x: existingMinefield.x, y: existingMinefield.y, isWeb: false, originalUnits: existingMinefield.units, units: existingMinefield.units, futureUnits: 0};
                            newMinefield.originalRadius = vgap.minefieldRadius(newMinefield.originalUnits);
                            newMinefield.planetId = new Array();
                        }
                    }
                    vgap.setMineColors(newMinefield);
                    if (ship.x == ship.targetx && ship.y == ship.targety) {
                        newMinefield.units += ship.clans;
                        if (newMinefield.units >= 22500) {
                            newMinefield.radius = 150;
                        } else {
                            newMinefield.radius = vgap.minefieldRadius(newMinefield.units);
                        }
                    } else {
                        newMinefield.futureUnits += ship.clans;
                        if (newMinefield.units + newMinefield.futureUnits >= 22500) {
                            newMinefield.futureRadius = 150;
                        } else {
                            newMinefield.futureRadius = vgap.minefieldRadius(newMinefield.units + newMinefield.futureUnits);
                        }
                    }
                    if (!update) {
                        HCPlugin.updatedFields.push(newMinefield);
                    }
                }
            }
            //Planet to Map (when building)
            for (let i = 0; i < vgap.myplanets.length; i++) {
                let planet = vgap.myplanets[i];
                if (planet.podhullid == 206 && planet.podcargo > 0) {
                    let minefields = vgap.minefieldsAt(planet.targetx, planet.targety);
                    let existingMinefield = null;
                    let mfdist = Infinity;
                    for (let j = 0; j < minefields.length; j++){
                        let minefield = minefields[j];
                        if (minefield.ownerid == planet.ownerid) {
                            let distance = Math.dist(minefield.x, minefield.y, planet.targetx, planet.targety);
                            if (distance < mfdist) {
                                mfdist = distance;
                                existingMinefield = minefield;
                            }
                        }
                    }
                    update = null;
                    let newMinefield = null;
                    if (existingMinefield == null) {
                        newMinefield = {id: HCPlugin.minefieldIdCounter--, ownerid: planet.ownerid, x: planet.targetx, y: planet.targety, isWeb: false, originalUnits: 0, units: 0, futureUnits: 0};
                        newMinefield.originalRadius = 0;
                        newMinefield.planetId = new Array();
                        newMinefield.planetId.push(planet.id);
                    } else {
                        update = HCPlugin.updatedFields.find(e => e.id === existingMinefield.id);
                        if (update) {
                            newMinefield = update;
                            newMinefield.planetId.push(planet.id);
                        } else {
                            newMinefield = {id: existingMinefield.id, ownerid: planet.ownerid, x: existingMinefield.x, y: existingMinefield.y, isWeb: false, originalUnits: existingMinefield.units, units: existingMinefield.units, futureUnits: 0};
                            newMinefield.originalRadius = vgap.minefieldRadius(newMinefield.originalUnits);
                            newMinefield.planetId = new Array();
                            newMinefield.planetId.push(planet.id);
                        }
                    }
                    vgap.setMineColors(newMinefield);
                    if (planet.x == planet.targetx && planet.y == planet.targety) {
                        newMinefield.units += planet.podcargo;
                        if (newMinefield.units >= 22500) {
                            newMinefield.radius = 150;
                        } else {
                            newMinefield.radius = vgap.minefieldRadius(newMinefield.units);
                        }
                    } else {
                        newMinefield.futureUnits += planet.podcargo;
                        if (newMinefield.units + newMinefield.futureUnits >= 22500) {
                            newMinefield.futureRadius = 150;
                        } else {
                            newMinefield.futureRadius = vgap.minefieldRadius(newMinefield.units + newMinefield.futureUnits);
                        }
                    }
                    if (!update) {
                        HCPlugin.updatedFields.push(newMinefield);
                    }
                }
            }
        },

        ShowMinefieldPreview: function () {
            for (let i = 0; i < HCPlugin.updatedFields.length; i++){
                let minefield = HCPlugin.updatedFields[i];
                if (minefield.units != 0) {
                    vgap.map.ctx.fillStyle = colorToRGBA(minefield.color, 0.1);
                    vgap.map.ctx.beginPath();
                    if (minefield.radius * vgap.map.zoom >= 1)
                        vgap.map.ctx.arc(vgap.map.screenX(minefield.x), vgap.map.screenY(minefield.y), (minefield.radius * vgap.map.zoom) - 1, 0, Math.PI * 2, false);
                    if (minefield.originalUnits && minefield.orginialRadius * vgap.map.zoom >= 1) {
                        vgap.map.ctx.arc(vgap.map.screenX(minefield.x), vgap.map.screenY(minefield.y), (minefield.orginialRadius * vgap.map.zoom) - 1, 0, Math.PI * 2, true);
                    }
                    vgap.map.ctx.closePath();
                    vgap.map.ctx.fill();
                }
                if (minefield.futureUnits != 0) {
                    vgap.map.ctx.fillStyle = colorToRGBA(minefield.color, 0.1 * HCPlugin.minefieldPredictionMultiplier);
                    vgap.map.ctx.beginPath();
                    if (minefield.futureRadius * vgap.map.zoom >= 1)
                        vgap.map.ctx.arc(vgap.map.screenX(minefield.x), vgap.map.screenY(minefield.y), (minefield.futureRadius * vgap.map.zoom) - 1, 0, Math.PI * 2, false);
                    if (minefield.radius && minefield.radius * vgap.map.zoom >= 1)
                        vgap.map.ctx.arc(vgap.map.screenX(minefield.x), vgap.map.screenY(minefield.y), (minefield.radius * vgap.map.zoom) - 1, 0, Math.PI * 2, true);
                    vgap.map.ctx.closePath();
                    vgap.map.ctx.fill();
                }
            }
        },

        HCPopulatePodArrays: function () {
            for (let i = 0; i < vgap.myships.length; i++) {
                let ship = vgap.myships[i];
                //select all pods that are not an accelerator, sentry, or protofield
                if (ship.hullid >=200 && ship.hullid < 300 && ship.hullid != 205 && ship.hullid != 201 && ship.hullid != 206) {
                    if (ship.warp != 0) {
                        HCPlugin.podArray.add({ planetid: 0, shipid: ship.id, hullid: ship.hullid, cargoType: vgap.podCargoType(ship.hullid), cargo: ship.clans, targetid: ship.target.id, turns: HCPlugin.HCGetWaypointLocations(ship, true), towshipid: null});
                    } else {
                        if (HCPlugin.loosePods == undefined) {
                            HCPlugin.loosePods = new HCPlugin.SortedObjectArray(["id"]);
                        }
                        HCPlugin.loosePods.add(ship);
                    }
                } else if (ship.hullid == 205) {
                    HCPlugin.acceleratorPods.add({ shipId: ship.id, planetId: 0, cargoType: vgap.podCargoType(ship.hullid), cargo: ship.clans, targetx: ship.target.x, targety: ship.targety, turns: HCPlugin.HCGetWaypointLocations(ship, true)});
                } else if (ship.hullid == 201) {
                    HCPlugin.sentryPods.add({ shipId: ship.id, planetId: 0, cargoType: vgap.podCargoType(ship.hullid), cargo: ship.clans, targetx: ship.target.x, targety: ship.targety, turns: HCPlugin.HCGetWaypointLocations(ship, true), towshipid: null});
                }

            };
            for(let i = 0; i < vgap.myplanets.length; i++) {
                let planet = vgap.myplanets[i];
                //select all pods that are not an accelerator or a sentry
                if (planet.podhullid >=200 && planet.podhullid < 300 && planet.podhullid != 205 && planet.podhullid != 201 && planet.podhullid != 206 && vgap.planetAt(planet.targetx, planet.targety)) {
                    HCPlugin.podArray.add({ planetid: planet.id, shipid: 0, hullid: planet.podhullid, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetid: planet.target.id, turns: HCPlugin.HCGetWaypointLocations(planet, true) });
                } else if (planet.podhullid == 205) {
                    if (HCPlugin.acceleratorPods == undefined) {
                        HCPlugin.acceleratorPods = new HCPlugin.SortedObjectArray(["planetId", "shipId"]);
                    }
                    HCPlugin.acceleratorPods.add({ shipId: 0, planetId: planet.id, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.targetx, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true)});
                } else if (planet.podhullid == 201) {
                    if (HCPlugin.sentryPods == undefined) {
                        HCPlugin.sentryPods = new HCPlugin.SortedObjectArray(["planetId", "shipId"]);
                    }
                    HCPlugin.acceleratorPods.add({ shipId: 0, planetId: planet.id, cargoType: vgap.podCargoType(planet.podhullid), cargo: planet.podcargo, targetx: planet.targetx, targety: planet.targety, turns: HCPlugin.HCGetWaypointLocations(planet, true), towshipid: null});
                }
            }
        },

        cargoPictureClass: function (cargoType) {
            let classType = "";
            switch (cargoType) {
                case "clans":
                    classType = "hccols";
                    break;
                case "nativeclans":
                    classType = "hcnatives";
                    break;
                case "neutronium":
                    classType = "lval neu";
                    break;
                case "duranium":
                    classType = "dur";
                    break;
                case "tritanium":
                    classType = "tri";
                    break;
                case "molybdenum":
                    classType = "mol";
                    break;
                case "supplies":
                    classType = "supplies";
                    break;
                default:
                    console.log("Default in switch statement for cargoPictureClass");
                    console.log(cargoType);
                    break;
            }
            return classType;
        },

        PlanetHeader: function (pod, planet) {
            let changeText = vgapPlanetScreen.prototype.changeText;
            let html = "";
            if (planet.ownerid == vgap.player.id) {
                html = "<div id='HCPodScreenPlanet" + pod.targetid + "' style='height:80px;margin-top:5px'>" +
                       "<img src= '" + planet.img + "' class='hcpodscreenimage' />" +
                       "<div class='hcpodscreenplanettext'>" +
                       "<div class='lval neu'>" + planet.neutronium + " " + changeText(planet.HCMiningNeutronium + planet.HCNeutroniumMadeFromLiquidation) + "</div>" +
                       "<div class='lval dur'>" + planet.duranium + " " + changeText(planet.HCMiningDuranium) + "</div>" +
                       "<div class='lval tri'>" + planet.tritanium + " " + changeText(planet.HCMiningTritanium) + "</div>" +
                       "<div class='lval mol'>" + planet.molybdenum + " " + changeText(planet.HCMiningMolybdenum) + "</div>" +
                       "</div>";
                let supplyChange = 0
                if (planet.HCSuppliesGenerated - planet.HCSuppliesConsumed < 0 && planet.supplies < Math.abs(planet.HCSuppliesGenerated - planet.HCSuppliesConsumed)) {
                    supplyChange = -planet.supplies;
                } else {
                    supplyChange = planet.HCSuppliesGenerated - planet.HCSuppliesConsumed;
                }
                html += "<div class='hcpodscreenplanettext'>" +
                        "<div class='lval supplies'>" + planet.supplies + " " + changeText(supplyChange) + "</div>" +
                        "<div class='hccols'>" + (planet.clans * HCPlugin.clansMultiplier) + " <span>" + changeText(planet.HCColonistGrowth * HCPlugin.clansMultiplier) + "</span></div>" +
                        "<div class='hcnatives'>" + (planet.nativeclans * HCPlugin.clansMultiplier) + " <span>" + changeText(planet.HCNativeGrowth * HCPlugin.clansMultiplier) + "</span></div>";
            } else {
                html = "<div id='HCPodScreenPlanet" + pod.targetid + "' style='height:80px;margin-top:20px'>" +
                       "<img src= '" + planet.img + "' class='hcpodscreenimage' />" +
                       "<div class='hcpodscreenplanettext'>" +
                       "<div class='lval neu'>" + (planet.neutronium == -1?"Unkown":planet.neutronium) + "</div>" +
                       "<div class='lval dur'>" + (planet.duranium == -1?"Unkown":planet.duranium) + "</div>" +
                       "<div class='lval tri'>" + (planet.tritanium == -1?"Unkown":planet.tritanium) + "</div>" +
                       "<div class='lval mol'>" + (planet.molybdenum == -1?"Unkown":planet.molybdenum) + "</div>" +
                       "</div><div class='hcpodscreenplanettext'>" +
                       "<div class='lval supplies'>" + (planet.supplies == -1?"Unkown":planet.supplies) + "</div>" +
                       "<div class='hccols'>" + (planet.clans == -1?"Unkown":planet.clans * HCPlugin.clansMultiplier) + "</div>" +
                       "<div class='hcnatives'>" + (planet.nativeclans == -1?"Unkown":planet.nativeclans * HCPlugin.clansMultiplier) + "</div>";
            }
            if ((planet.podhullid >= 200 && planet.podhullid<300 && planet.target) && (vgap.isPlanet(planet.target) || planet.podhullid == 201 || planet.podhullid == 205 || planet.podhullid == 206)) {
                html += "<div><img src='" + hullImg(planet.podhullid) + "' style='position:relative;float:left;height:20px;padding-right:10px' />" +
                        "<div class='" + HCPlugin.cargoPictureClass(pod.cargoType) + "'>" + pod.cargo + "</div></div>";
            }
            return html;
        },

        BuildPodMenuItem: function (pod) {
            let html = "";
            if (pod.planetid)
                html += "<div id='HCPodPlanetShip" + pod.planetid + "' class='hcpodrow' style='background:#ff990030'>" +
                        "<img class='hcpodscreenpodimage1' src='" + hullImg(pod.hullid) + "' />" +
                        "<img class='hcpodscreenpodimage2' src='" + vgap.getPlanet(pod.planetid).img + "' />";
            else
                html += "<div id='HCPodShip" + pod.shipid + "' class='hcpodrow'>" +
                        "<img class='hcpodscreenpodimage1' src='" + hullImg(pod.hullid) + "' />"
            html += "<div class='hcpodscreenpodtext'><div class='" + HCPlugin.cargoPictureClass(pod.cargoType) + "'>" + pod.cargo;
                if (pod.cargoType == "nativeclans") {
                    if (pod.planetid) {
                        html += " " + nudata.nativetypes[vgap.getPlanet(pod.planetid).nativetype].name;
                    } else {
                        html += " " + nudata.nativetypes[vgap.getShip(pod.shipid).beamid].name;
                    }
                }
            html += "</div></div><div class='hcpodscreenpodtextindented'>Turns: " + pod.turns + "</div>";
            return html;
        },

        BuildPodScreen: function () {
            if (vgap.planetScreenOpen) {
                $("#HCPodScreen").empty();
                $("<header>Pod Screen</header>").appendTo("#HCPodScreen");
                let planetid = vgap.planetScreen.planet.id;
                let otherplanetid = 0;
                if (vgap.planetScreen.planet.target && vgap.isPlanet(vgap.planetScreen.planet.target) && vgap.planetScreen.planet.target !== vgap.planetScreen.planet) {
                    otherplanetid = vgap.planetScreen.planet.target.id;
                }
                let currentPlanet = null;
                let currentPlanetHeader = null;
                let targetPlanet = null;
                let targetPlanetHeader = null;

                for (let i = 0; i < HCPlugin.podArray.array.length; i++) {
                    let pod = HCPlugin.podArray.array[i];
                    let planet = vgap.getPlanet(pod.targetid);
                    if (pod.targetid == planetid) {
                        if (currentPlanet == null) {
                            currentPlanetHeader = document.createElement("div");
                            currentPlanetHeader.setAttribute("style","height:25px;text-align:center;border:#FFFFFF33;border-style:double;width:340px;");
                            currentPlanetHeader.textContent = "Current Planet " + pod.targetid + ": " + planet.name;
                            currentPlanet = document.createElement("div");
                            currentPlanet.setAttribute("id", "PodPlanet" + pod.targetid);
                            let html = HCPlugin.PlanetHeader(pod, planet);
                            $(html).appendTo(currentPlanet).tclick(function () {vgap.map.selectPlanet(pod.targetid)});
                        }
                        let html = HCPlugin.BuildPodMenuItem(pod);
                        if (pod.planetid) {
                            $(html).appendTo(currentPlanet).tclick(function () {vgap.map.selectPlanet(pod.planetid)});
                        } else {
                            $(html).appendTo(currentPlanet).tclick(function () {vgap.map.selectShip(pod.shipid)});
                        }
                    }
                    if (otherplanetid && pod.targetid == otherplanetid) {
                        if (targetPlanet == null) {
                            targetPlanetHeader = document.createElement("div");
                            targetPlanetHeader.setAttribute("style","height:25px;text-align:center;border:#FFFFFF33;border-style:double;width:340px;margin-top:10px;");
                            targetPlanetHeader.textContent = "Target Planet " + pod.targetid + ": " + planet.name;
                            targetPlanet = document.createElement("div");
                            targetPlanet.setAttribute("id", "PodPlanet" + pod.targetid);
                            let html = HCPlugin.PlanetHeader(pod, planet);
                            $(html).appendTo(targetPlanet).tclick(function () {vgap.map.selectPlanet(pod.targetid)});
                        }
                        let html = HCPlugin.BuildPodMenuItem(pod);
                        if (pod.planetid) {
                            $(html).appendTo(targetPlanet).tclick(function () {vgap.map.selectPlanet(pod.planetid)});
                        } else {
                            $(html).appendTo(targetPlanet).tclick(function () {vgap.map.selectShip(pod.shipid)});
                        }
                    }
                }
                $(currentPlanetHeader).appendTo("#HCPodScreen").tclick(function () {$("#PodPlanet" + planetid).toggle()});
                $(currentPlanet).appendTo("#HCPodScreen");
                $(targetPlanetHeader).appendTo("#HCPodScreen").tclick(function () {$("#PodPlanet" + otherplanetid).toggle()});
                $(targetPlanet).appendTo("#HCPodScreen");
            } else {
                $("#HCPodScreen").empty();
                $("<header>Pod Screen</header>").appendTo("#HCPodScreen");
                let currentPlanet = null;
                let currentPlanetHeader = null;
                for (let i = 0; i < HCPlugin.podArray.array.length; i++) {
                    if (i > 0 && HCPlugin.podArray.array[i-1].targetid != HCPlugin.podArray.array[i].targetid) {
                        $("#PodPlanet" + HCPlugin.podArray.array[i-1].targetid)[0].lastChild.setAttribute("style", "margin-bottom:10px");
                        currentPlanet = null;
                    }
                    let pod = HCPlugin.podArray.array[i];
                    let planet = vgap.getPlanet(pod.targetid);
                    if (currentPlanet == null) {
                        currentPlanetHeader = document.createElement("div");
                        currentPlanetHeader.setAttribute("style","height:25px;text-align:center;border:#FFFFFF33;border-style:double;width:340px;");
                        currentPlanetHeader.textContent = "Planet " + pod.targetid + ": " + planet.name;
                        $(currentPlanetHeader).appendTo("#HCPodScreen").tclick(function () {$("#PodPlanet" + pod.targetid).toggle()});
                        currentPlanet = document.createElement("div");
                        currentPlanet.setAttribute("id", "PodPlanet" + pod.targetid);
                        let html = HCPlugin.PlanetHeader(pod, planet);
                        $(html).appendTo(currentPlanet).tclick(function () {vgap.map.selectPlanet(pod.targetid)});
                        $(currentPlanet).appendTo("#HCPodScreen");
                    }
                    let html = HCPlugin.BuildPodMenuItem(pod);
                    if (pod.planetid) {
                        $(html).appendTo("#PodPlanet" + pod.targetid).tclick(function () {vgap.map.selectPlanet(pod.planetid)});
                    } else {
                        $(html).appendTo("#PodPlanet" + pod.targetid).tclick(function () {vgap.map.selectShip(pod.shipid)});
                    }
                }
            }
        },
    }
    vgap.registerPlugin(horwaspCorrections, "HorwaspCorrections");
    this.HCPlugin = vgap.plugins.HorwaspCorrections;
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
