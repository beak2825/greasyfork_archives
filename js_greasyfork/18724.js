// ==UserScript==
// @name        Flunik Tools
// @namespace   FlunikTools
// @description Bot, Upgrader
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author      Flunik dbendure RobertT KRS_L
// @version     2017.07.13.1
// @downloadURL https://update.greasyfork.org/scripts/18724/Flunik%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/18724/Flunik%20Tools.meta.js
// ==/UserScript==

/*
Original Flunik tools would upgrade buildings randomly. I have tried to make the upgrading more
intelligent.

Currently there is no real logic for unit upgrades other than those are done lowest level offence
unit first followed by lowest level defence unit. Unit upgrades will spend crystals as soon as
available at the moment but I would like to get those to wait until crystals is full as well.

As far as buildings go, first off I try to keep the base at maximum capacity since that gives us the
opportunity to use the resources in ways we see fit. This script will kick in when Tiberium
is full to upgrade the best building it can. It will also try to upgrade the CC or DHQ any time
the offence or defence units have maxed out.

Here is the basic logic for building upgrades:
If CY is less than level 25 upgrade CY (max build sites in base)
If CC < Base level upgrade CC
If Offence Level = CC level upgrade CC
If DHQ < Base level upgrade DHQ
If DHQ < CC upgrade DHQ
If DF < DHQ upgrade DF
If support < DHQ upgrade support
If Airport/Barracks/Vehicles < CC level upgrade repair building
(Version A) If cost of upgrade of any of the main buildings exceeds silo capacity upgrade silos
(Version B) If rate of production would cause silos full in less than 24 hours upgrade silos
(Version A) Upgrade lowest level normal building
(Version B) Try and determine what building will give greatest benefit to resource production and upgrade it
*/

(function () {

    var FlunikTools_main = function () {
        try {
            function CCTAWrapperIsInstalled() {
                return (typeof (CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
            }

            function createFlunikTools() {
                console.log('Flunik Tools Created');

                var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

                window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
                    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
                    return __nativeST__(vCallback instanceof Function ? function () {
                        vCallback.apply(oThis, aArgs);
                    } : vCallback, nDelay);
                };

                window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
                    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
                    return __nativeSI__(vCallback instanceof Function ? function () {
                        vCallback.apply(oThis, aArgs);
                    } : vCallback, nDelay);
                };

                const BOT_NOT_INITIALISED = "not_initialised";
                const BOT_INITIALISED = "initialised";
                const BOT_SLEEPING = "sleeping";
                const BOT_SCANNING = "scanning";
                const BOT_PREPEARING_OFFENCE = "prepearing_offence";
                const BOT_PREPEARING_OFFENCE_2 = "prepearing_offence_2";
                const BOT_SWITCHING_BASE = "switching_base";
                const BOT_SIMULATING = "simulate_1";
                const BOT_SIMULATING_MIRRORED = "simulate_2";
                const BOT_ATTACKING = "attacking";



                qx.Class.define("FlunikTools.Farmer", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {

                        FarmButton : null,
                        FarmTresholdButton : null,
                        StartBattle : null,

                        attackFn : null,
                        timeoutHandler : null,
                        botTarget : null,
                        _botState : BOT_NOT_INITIALISED,
                        _cache : null,
                        _target : null,
                        _stats : null,
                        _shift : 0,

                        isFarmRunning : false,
                        initialize: function () {

                            var simBody = ClientLib.API.Battleground.GetInstance().SimulateBattle.toString();
                            var attackBody = simBody.substr(0, simBody.indexOf("ClientLib.Net.CommunicationManager.GetInstance()")) + 'ClientLib.Net.CommunicationManager.GetInstance().SendCommand("InvokeBattle", { battleSetup: c }, null,null,true); }}'
                            var attackBody = attackBody.replace("function", "function StartBattle");
                            this.attackFn = eval(attackBody);

                            this.StartBattle = StartBattle;

                            this.FarmButton = new qx.ui.form.Button("Farm", null).set({
                                toolTipText: "Farm",
                                width: 450,
                                height: 40,
                                maxWidth: 450,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.FarmTresholdButton = new qx.ui.form.Button("Minimum res", null).set({
                                toolTipText: "Farm treshold: ",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.FarmButton.addListener("click", function(e) {
                                this.switchFarm();
                            }, this);

                            this.FarmTresholdButton.addListener("click", function(e) {
                                try {
                                    var a = prompt("New Amount");
                                    a = parseInt(a);
                                    this.setMinResourceCount(a);
                                } catch (e)
                                {

                                }
                                this.FarmTresholdButton.setLabel(this.getMinResourceCount().toString());

                            }, this);

                            var app = qx.core.Init.getApplication();

                            app.getDesktop().add(this.FarmButton, {
                                right: 120,
                                bottom: 0
                            });
                            app.getDesktop().add(this.FarmTresholdButton, {
                                right: 120,
                                bottom: 40
                            });
                        },

                        getUniqueClientId : function()
                        {
                            //return window.location + "_" + ClientLib.Vis.VisMain.GetInstance().get_City().get_OwnerId();
                            return window.location + "_" + ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_OwnerId();

                        },

                        getMinResourceCount : function()
                        {
                            var result = localStorage[this.getUniqueClientId() + "_minResourceCount"];
                            if (!result)
                            {
                                result = 150;
                            }

                            return parseInt(result, 10);
                        },

                        getMaxResourceCount : function()
                        {
                            var result = parseInt(this.getMinResourceCount(), 10);
                            return result * 2;
                        },

                        setMinResourceCount : function(value)
                        {

                            this.FarmTresholdButton.setLabel(value.toString());

                            localStorage[this.getUniqueClientId() + "_minResourceCount"] = value;
                        },

                        getMaxCpPerAttack : function()
                        {
                            var result = localStorage[this.getUniqueClientId() + "_maxCpPerAttack"];
                            if (!result)
                            {
                                result = 12;
                            }
                            return result;
                        },

                        setMaxCpPerAttack : function(value)
                        {
                            localStorage[this.getUniqueClientId() + "_maxCpPerAttack"] = value;
                        },

                        getMinLevelToAttack : function()
                        {
                            var result = localStorage[this.getUniqueClientId() + "_minLevelToAttack"];
                            if (!result)
                            {
                                result = 50;
                            }
                            return result;
                        },

                        setMinLevelToAttack : function(value)
                        {
                            localStorage[this.getUniqueClientId() + "_minLevelToAttack"] = value;
                        },

                        loadUserSettings : function ()
                        {
                            //preseting the camp level

                            window.Addons.BaseScannerGUI.getInstance().ZY.setValue(this.getMinLevelToAttack().toString());
                            this.FarmTresholdButton.setLabel(this.getMinResourceCount().toString());

                            //presetting the cp limit
                            var cpDropDown = window.Addons.BaseScannerGUI.getInstance().ZQ;
                            var valueToSelect = this.getMaxCpPerAttack();
                            var cpItems = cpDropDown._getItems();
                            //window.Addons.BaseScannerGUI.getInstance().ZQ.getSelection()[0].$$user_label

                            for (var i=0;i<cpItems.length;i++)
                            {
                                if (cpItems[i].$$user_label == valueToSelect )
                                {
                                    //alert(i);
                                    break;
                                }
                            };

                            cpDropDown.setSelection( [cpItems[i]] );

                        },

                        saveUserSettings : function()
                        {
                            //saving camp level
                            this.setMinLevelToAttack(window.Addons.BaseScannerGUI.getInstance().ZY.getValue());
                            this.setMaxCpPerAttack(window.Addons.BaseScannerGUI.getInstance().ZQ.getSelection()[0].$$user_label);

                        },

                        setBotState : function(value)
                        {
                            try
                            {
                                console.log("[" + new Date().toLocaleTimeString() + "] Bot state changed: " + this._botState + "->" + value);
                                this._botState = value;

                                if (this._stats != null)
                                {
                                    this.FarmButton.setLabel(value + " | " + this._stats.scan + " / " + this._stats.sim + " / " + this._stats.att + " (" + this._stats.cp + "CP) " + " " + Math.round(this._stats.tib) + "G / " + Math.round(this._stats.cry) + "G" );
                                } else {
                                    this.FarmButton.setLabel(value);
                                }


                            } catch (err) {
                                this.log("Error in " + "setBotState()", true);
                            }
                        },

                        setTimeoutEx : function( func, delay )
                        {
                            try
                            {
                                this.timeoutHandler = setTimeout.call( this, func, delay );

                                var str = func.toString();
                                var fnName = str.slice(str.indexOf("function")+8, str.indexOf("("));

                                var date = new Date();
                                console.log("[" + date.toLocaleTimeString() + "] Running " + fnName + "() in " + delay +"ms");
                            } catch (err) {
                                this.log("Error in " + "setTimeoutEx()", true);
                            }
                        },

                        log : function(str, doAlert)
                        {
                            console.log(str);
                            if (doAlert != undefined)
                            {
                                alert(str);
                            }
                        },

                        //Starting func
                        init : function()
                        {
                            this._cache = new Object();
                            this._target = null;
                            if (!this._stats)
                            {
                                this._stats = {
                                    sim:0,
                                    att:0,
                                    scan:0,
                                    cry:0,
                                    tib:0,
                                    cp:0
                                };
                            }

                            //this is the copy of API: SimulateBattle, with changed params.
                            //we need battlesetup, and just send the simple command.
                            var simBody = ClientLib.API.Battleground.GetInstance().SimulateBattle.toString();
                            var attackBody = simBody.substr(0, simBody.indexOf("ClientLib.Net.CommunicationManager.GetInstance()")) + 'ClientLib.Net.CommunicationManager.GetInstance().SendCommand("InvokeBattle", { battleSetup: c }, null,null,true); }}'
                            var attackBody = attackBody.replace("function", "function StartBattle");
                            this.attackFn = eval(attackBody);

                            this.StartBattle = StartBattle;
                            //removing the showghosted confirmation
                            webfrontend.gui.widgets.confirmationWidgets.GhostedConfirmationWidget.getInstance().showGhostedInformation = function() { return true;}


                            this._shift = 0;
                            this._botStop = false;

                            this.setBotState(BOT_NOT_INITIALISED);
                            this.initCompleted();
                        },


                        //Init completed, the window is openned
                        initCompleted : function()
                        {

                            window.Addons.BaseScannerGUI.getInstance().openWindow("BaseScanner", "");
                            this.loadUserSettings();
                            this.setBotState(BOT_INITIALISED);
                            this.setTimeoutEx( this.checkBot, 5000 );
                        },

                        getCpCount : function()
                        {
                            return Math.floor(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().GetResourceCount(15));
                        },

                        //iterative routine
                        checkBot : function ()
                        {
                            this.saveUserSettings();

                            if (this._botStop == true)
                            {
                                this.setBotState(BOT_NOT_INITIALISED)
                                this._botStop = false;
                                return;
                            }

                            if (this._botState == BOT_INITIALISED || this._botState == BOT_SLEEPING)
                            {
                                if (this.getCpCount() < 15)
                                {
                                    this._cache = new Object();
                                    this.setBotState(BOT_SLEEPING)
                                    this.setTimeoutEx( this.checkBot, 60000 );

                                    if (this.stats && this.stats.sim > 1000) {

                                    }
                                } else {
                                    MaelstromTools.Base.getInstance().repairAll();



                                    this.loadUserSettings();

                                    this.scanTargets();

                                    this.setBotState(BOT_SCANNING);
                                    this.setTimeoutEx( this.checkBot, 1000 );
                                }
                            } else if (this._botState == BOT_SCANNING) {

                                //check if the scanning finished:
                                //if the button has name set to "pause" then it's still running, else it's stopped;
                                if (!this.isScanning())
                                {
                                    this._target = this.findBestTarget();

                                    if (this._target != null)
                                    {
                                        this.setBotState(BOT_PREPEARING_OFFENCE);
                                        this.setTimeoutEx( this.checkBot, 5000 );
                                    } else {

                                        this.setBotState(BOT_SWITCHING_BASE);
                                        this.setTimeoutEx( this.checkBot, 2000 );
                                    }
                                } else {
                                    this.setBotState(BOT_SCANNING);
                                    this.setTimeoutEx( this.checkBot, 1000 );
                                }
                            } else if (this._botState == BOT_PREPEARING_OFFENCE ) {

                                if (this.prepeareOffenceOn(this._target))
                                {
                                    this.setBotState(BOT_PREPEARING_OFFENCE_2);
                                    this.setTimeoutEx( this.checkBot, 5000 );
                                } else {

                                    this.log("Failed to prepeareOffence");

                                    this.blacklistTarget(this._target, true);

                                    this.setBotState(BOT_SWITCHING_BASE);
                                    this.setTimeoutEx( this.checkBot, 2000 );
                                }
                            } else if (this._botState == BOT_PREPEARING_OFFENCE_2 ){
                                //simulating the step
                                if (!this.isSimReady()) //we can't simulate
                                {
                                    this.setTimeoutEx( this.checkBot, 1000 );
                                } else {
                                    this.setTimeoutEx( function()
                                                      {
                                        //alert( this );
                                        this.simulateStats();
                                        this.setBotState(BOT_SIMULATING);
                                        this.setTimeoutEx( this.checkBot, 1000 );
                                    }, 1000);
                                }

                                //setTimeoutEx( checkBot, 15000 );
                            } else if (this._botState == BOT_SIMULATING) {
                                if (this.isCompleteVictory())
                                {
                                    if (this.attack())
                                    {
                                        this.setBotState(BOT_ATTACKING);

                                        var app = qx["core"]["Init"]["getApplication"]();
                                        app["getPlayArea"]()["setView"](ClientLib["Data"]["PlayerAreaViewMode"]["pavmNone"]);
                                    }

                                    this.setBotState(BOT_SWITCHING_BASE);
                                    this.setTimeoutEx( this.checkBot, 2000 );
                                } else {

                                    if (!this.isSimReady()) //we can't simulate
                                    {
                                        this.setTimeoutEx( this.checkBot, 1000 );
                                    } else {
                                        this.setTimeoutEx( function()
                                                          {
                                            //alert(this);
                                            Simulator.getInstance().mirrorFormation();
                                            this.simulateStats()
                                            this.setBotState(BOT_SIMULATING_MIRRORED);
                                            this.setTimeoutEx( this.checkBot, 1000 );
                                        }, 1000);
                                    }


                                }
                            } else if (this._botState == BOT_SWITCHING_BASE) {

                                this.switchBase();

                                this.setBotState(BOT_INITIALISED);
                                this.setTimeoutEx( this.checkBot, 2000 );

                            } else if (this._botState == BOT_SIMULATING_MIRRORED) {
                                //if the simulation is complete victory, then attack, else select next base;

                                /*if (document.body.innerHtml.indexOf("Spectating") != -1)
								{
								//document.body.innerHTML.indexOf("was destroyed and cannot be attacked")
									blacklistTarget(_target, false);

									setBotState(BOT_SWITCHING_BASE);
									setTimeoutEx( checkBot, 2000 );
								}*/

                                if (this.isCompleteVictory()) {

                                    if (this.attack())
                                    {
                                        this.setBotState(BOT_ATTACKING);

                                        var app = qx["core"]["Init"]["getApplication"]();
                                        app["getPlayArea"]()["setView"](ClientLib["Data"]["PlayerAreaViewMode"]["pavmNone"]);
                                    }

                                    this.setBotState(BOT_SWITCHING_BASE);
                                    this.setTimeoutEx( this.checkBot, 2000 );
                                } else {

                                    if (this._shift < 4)
                                    {
                                        if (!this.isSimReady()) //we can't simulate
                                        {
                                            this.setTimeoutEx( this.checkBot, 1000 );
                                        } else {

                                            this.setTimeoutEx( function()
                                                              {
                                                this._shift++;
                                                Simulator.getInstance().mirrorFormation();
                                                Simulator.getInstance().shiftFormation("r");
                                                this.simulateStats();

                                                this.setBotState(BOT_SIMULATING);
                                                this.setTimeoutEx( this.checkBot, 1000 );
                                            }, 1000);

                                        }
                                    } else {
                                        this._shift = 0;

                                        this.blacklistTarget(this._target, true);

                                        this.setBotState(BOT_SWITCHING_BASE);
                                        this.setTimeoutEx( this.checkBot, 5000 );
                                    }
                                }
                            }
                        },

                        simulateStats : function()
                        {
                            Simulator.StatWindow.getInstance().__labelMiscOutcome.$$user_label = "HAX0R"
                            this._stats.sim++;
                            Simulator.StatWindow.getInstance().simulateStats();
                        },

                        //window._prevReady = false;
                        isSimReady : function() //if we're getting ready 2 times in a row, we're ready ;)
                        {
                            var thisReady = simStatBtn.$$user_label == "Update";
                            //var result = window._prevReady %% thisReady;

                            //window._prevReady = thisReady;

                            return thisReady;
                        },

                        scanTargets : function()
                        {
                            //runs the basescanner routine
                            window.Addons.BaseScannerGUI.getInstance().FE();
                            this._stats.scan++;
                        },

                        isScanning : function()
                        {
                            return window.Addons.BaseScannerGUI.getInstance().ZG.$$user_label == "Pause";
                        },


                        closeBackgroundArea : function()
                        {
                            var app = qx["core"]["Init"]["getApplication"]();
                            app["getBackgroundArea"]()["closeCityInfo"]();
                            app["getPlayArea"]()["setView"](ClientLib["Data"]["PlayerAreaViewMode"]["pavmNone"]);

                            return app;
                        },

                        prepeareOffenceOn : function (target)
                        {
                            //var last = ghostedCounter; //we would fail to prepeare offences, if the app would like to show us the ghosted counter. we'll check it

                            //let's check - whether the camp still exists:
                            if (target[3].split(":").length == 2)
                            {
                                var targetX = parseInt(target[3].split(":")[0]);
                                var targetY = parseInt(target[3].split(":")[1]);
                                ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(targetX, targetY);

                                //now we're opening the attack view
                                var app = this.closeBackgroundArea();
                                app["getPlayArea"]()["setView"](ClientLib["Data"]["PlayerAreaViewMode"]["pavmCombatSetupDefense"], target[0], 0, 0);

                                //now we're selecting the attack city
                                var t = ClientLib["Data"]["MainData"].GetInstance()["get_Cities"]()["get_CurrentOwnCity"]();
                                if (t != null) {
                                    t["get_CityArmyFormationsManager"]()["set_CurrentTargetBaseId"](target[0]);
                                }

                                return true;
                            } else {

                                return false;
                            }

                            //return ghostedCounter != last;
                        },

                        isCompleteVictory : function()
                        {
                            return Simulator.StatWindow.getInstance().__labelEnemyBaseHealth.$$user_value == "0.00";
                            //return Simulator.StatWindow.getInstance().__labelEnemyBaseHealth.$$user_label == "Total Victory";
                        },

                        attack : function()
                        {
                            this.blacklistTarget(this._target, false);

                            if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity() && ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().CheckInvokeBattle() == 0)
                            {
                                this.StartBattle();

                                this._stats.att++;
                                this._stats.tib += Math.round(this._target[5] / 10000) / 100;
                                this._stats.cry += Math.round(this._target[6] / 10000) / 100;
                                this._stats.cp += this._target[13];

                                return true;
                            } else {
                                return false;
                            }
                        },


                        blacklistTarget : function(target, onlyFromOffenciveBase)
                        {
                            var list = window.Addons.BaseScannerGUI.getInstance().ZC;
                            var items = list._getItems();

                            var currentSelection = list.getSelection()[0];
                            var baseName = currentSelection.$$user_label;

                            if (this._cache[baseName] == undefined)
                            {
                                if (onlyFromOffenciveBase)
                                {
                                    this._cache[baseName] = "|" + target[0];
                                } else {
                                    this._cache["all"] = "|" + target[0];
                                }

                            } else {
                                if (onlyFromOffenciveBase)
                                {
                                    this._cache[baseName] += "|" + target[0];
                                } else {
                                    this._cache["all"] += "|" + target[0];
                                }
                            }
                        },

                        isTargetBlacklisted : function(target)
                        {
                            var list = window.Addons.BaseScannerGUI.getInstance().ZC;
                            var items = list._getItems();

                            var currentSelection = list.getSelection()[0];
                            var baseName = currentSelection.$$user_label;

                            var result = false;

                            if (this._cache[baseName] != undefined) {
                                result = result || this._cache[baseName].toString().indexOf("|" + target[0]) != -1;
                            }

                            if (this._cache["all"] != undefined) {
                                result = result || this._cache["all"].toString().indexOf("|" + target[0]) != -1;
                            }

                            return result;
                        },

                        switchBase : function()
                        {
                            var list = window.Addons.BaseScannerGUI.getInstance().ZC;
                            var items = list._getItems();

                            var currentSelection = list.getSelection()[0];
                            var baseName = currentSelection.$$user_label;

                            var foundIndex = -1;
                            for (var i=0;i<items.length;i++)
                            {
                                if (items[i].$$user_label == baseName)
                                {
                                    foundIndex = i;
                                    break;
                                }
                            }
                            console.log("foundIndex is " + foundIndex);

                            //trying to find the items from the current till the last
                            var newIndex = -1;
                            for (var i=foundIndex+1;i<items.length;i++)
                            {
                                if ((items[i]).$$user_label.indexOf("W") == 0)
                                {
                                    newIndex = i;
                                    break;
                                }
                            }
                            if (newIndex == -1)
                            {
                                for (var i=0;i<foundIndex;i++)
                                {
                                    if ((items[i]).$$user_label.indexOf("W") == 0)
                                    {
                                        newIndex = i;
                                        break;
                                    }
                                }
                            }
                            console.log("newIndex is " + newIndex);

                            list.setSelection([items[newIndex]]);
                        },

                        /* Targetting Logic */
                        getAttackViability : function (target)
                        {
                            return (target[5] + target[6]) / target[13];
                        },

                        findMostViableTarget : function(targets)
                        {
                            if (targets.length == 0)
                                return null;

                            var bestTargetIndex = 0;

                            for (var i=0;i<targets.length-1;i++)
                            {
                                if (this.getAttackViability(targets[bestTargetIndex]) < this.getAttackViability(targets[i]))
                                {
                                    if (!this.isTargetBlacklisted(targets[i]) && this.getAttackViability(targets[i]) < this.getMaxResourceCount())
                                    {
                                        bestTargetIndex = i;
                                    }
                                }
                            }

                            if (this.getAttackViability(targets[bestTargetIndex]) < this.getMinResourceCount() * 1000000)
                            {
                                return null;
                            }

                            return targets[bestTargetIndex];
                        },

                        findBestTarget : function()
                        {
                            var targets = window.Addons.BaseScannerGUI.getInstance().ZE;
                            var target = this.findMostViableTarget(targets);
                            return target;
                        },

                        kill : function()
                        {
                            this.setBotState("Killing Bot");
                            this._botStop = true;
                        },

                        switchFarm : function() {
                            try
                            {
                                if (this.isFarmRunning)
                                {
                                    this.kill();
                                } else {
                                    this.init();
                                }

                                this.isFarmRunning = !this.isFarmRunning;
                            } catch(err) {
                                console.debug("error while switching farm: " + err );
                            }
                        }


                    }
                });

                qx.Class.define("FlunikTools.Upgrader", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {

                        UpgraderButton : null,
                        TransferCrysButton : null,
                        TransferTibButton : null,

                        isRunning : false,

                        cityQueue : null,
                        delay: 3000,


                        initialize: function() {
                            this.UpgraderButton = new qx.ui.form.Button("Upgrader", null).set({
                                toolTipText: "Flunik",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.TransferCrysButton = new qx.ui.form.Button("GetCrys", null).set({
                                toolTipText: "1g",
                                width: 50,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.TransferTibButton = new qx.ui.form.Button("GetTib", null).set({
                                toolTipText: "1g",
                                width: 50,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.UpgraderButton.addListener("click", function(e) {
                                if (this.isRunning)
                                {
                                    this.kill();
                                } else {
                                    this.init();
                                }
                            }, this);

                            this.TransferCrysButton.addListener("click", function(e) {
                                try {

                                    var currentBase = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                    var transferAmount = currentBase.GetResourceCount(ClientLib.Base.EResourceType.Power) * 4 - currentBase.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                                    transferAmount = Math.floor(transferAmount);
                                    transferAmount = prompt("How Much?", transferAmount);
                                    if (transferAmount)
                                    {
                                        transferAmount = transferAmount.replace("g","000000000").replace("m","000000").replace("k","000");
                                        transferAmount = parseInt(transferAmount);

                                        var sourceTransferBase = this.findNearestWarBaseWithEnoughResources(currentBase, ClientLib.Base.EResourceType.Crystal, transferAmount);
                                        if (sourceTransferBase != null)
                                        {
                                            var transferCost = currentBase.CalculateTradeCostToCoord(sourceTransferBase.get_PosX(), sourceTransferBase.get_PosY(), transferAmount);

                                            if (transferCost < ClientLib.Data.MainData.GetInstance().get_Player().GetCreditsCount())
                                            {
                                                if (currentBase.CanTrade() == ClientLib.Data.ETradeError.None && sourceTransferBase.CanTrade() == ClientLib.Data.ETradeError.None)
                                                {
                                                    ClientLib.Net.CommunicationManager.GetInstance().SendCommand("SelfTrade",{targetCityId:currentBase.get_Id(),sourceCityId:sourceTransferBase.get_Id(),resourceType:ClientLib.Base.EResourceType.Crystal,amount:transferAmount}, null, null, true);
                                                    log("Traded crys successfully");
                                                }
                                            }
                                        }
                                    }




                                } catch (ex)
                                {
                                    alert(ex);
                                }
                            }, this)

                            this.TransferTibButton.addListener("click", function(e) {
                                var currentBase = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                var transferAmount = "1g";
                                transferAmount = prompt("How Much?", transferAmount);
                                if (transferAmount)
                                {
                                    transferAmount = transferAmount.replace("g","000000000").replace("m","000000").replace("k","000");
                                    transferAmount = parseInt(transferAmount);

                                    var sourceTransferBase = this.findNearestWarBaseWithEnoughResources(currentBase, ClientLib.Base.EResourceType.Tiberium, transferAmount);
                                    if (sourceTransferBase != null)
                                    {
                                        var transferCost = currentBase.CalculateTradeCostToCoord(sourceTransferBase.get_PosX(), sourceTransferBase.get_PosY(), transferAmount);

                                        if (transferCost < ClientLib.Data.MainData.GetInstance().get_Player().GetCreditsCount())
                                        {
                                            if (currentBase.CanTrade() == ClientLib.Data.ETradeError.None && sourceTransferBase.CanTrade() == ClientLib.Data.ETradeError.None)
                                            {
                                                ClientLib.Net.CommunicationManager.GetInstance().SendCommand("SelfTrade",{targetCityId:currentBase.get_Id(),sourceCityId:sourceTransferBase.get_Id(),resourceType:ClientLib.Base.EResourceType.Tiberium,amount:transferAmount}, null, null, true);
                                                log("Traded tib successfully");
                                            }
                                        }
                                    }
                                }
                            }, this)

                            var app = qx.core.Init.getApplication();

                            app.getDesktop().add(this.UpgraderButton, {
                                right: 120,
                                bottom: 80
                            });

                            app.getDesktop().add(this.TransferCrysButton, {
                                right: 120,
                                bottom: 120
                            });

                            app.getDesktop().add(this.TransferTibButton, {
                                right: 120,
                                bottom: 160
                            });

                        },

                        init: function() {
                            this.cityQueue = [];

                            var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;

                            for (var i in cities)
                            {
                                this.cityQueue.push(cities[i]);
                            }

                            log("Upgrader: Initialized");
                            this.UpgraderButton.setLabel("Upgrader On");
                            this.isRunning = true;
                            this.checkUpgrade();
                        },

                        kill: function() {
                            this.isRunning = false;
                            this.UpgraderButton.setLabel("Upgrader Killing");
                        },

                        doUpgradeCity : function(city)
                        {
                            try{
                                var buildings = city.get_Buildings();
                                var maxLevel = [];
                                maxLevel["Power Plant"] = 50;
                                maxLevel["Accumulator"] = 60;
                                maxLevel["Factory"] = 60;
                                maxLevel["War Factory"] = 60;
                                maxLevel["Airfield"] = 60;
                                maxLevel["Airport"] = 60;
                                maxLevel["Barracks"] = 60;
                                maxLevel["Hand of Nod"] = 60;
                                maxLevel["Command Center"] = 60;
                                maxLevel["Silo"] = 55;
                                maxLevel["Defence Facility"] = 60;
                                maxLevel["Defence HQ"] = 60;

                                var upgradeRun = 0;

                                for (var nBuildings in buildings.d) {
                                    var building = buildings.d[nBuildings];
                                    if (maxLevel[building.get_UnitGameData_Obj().dn] == undefined)
                                    {
                                        continue;
                                    }

                                    var building_obj = {
                                        cityid: city.get_Id(),
                                        posX: building.get_CoordX(),
                                        posY: building.get_CoordY(),
                                        isPaid: true
                                    }

                                    if (building.get_CurrentLevel() < maxLevel[building.get_UnitGameData_Obj().dn] && this.canUpgradeBuilding(building, city))
                                    {
                                        ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
                                        upgradeRun++;
                                    }
                                }

                                //trying to clean up memory leaks
                                buildings = null;
                                building = null;
                                building_obj = null;
                                nBuildings = null;
                                maxLevel = null;

                                return upgradeRun;
                            } catch(ex) {
                                alert(ex);
                            }
                        },

                        checkUpgrade: function() {
                            if (this.isRunning == false)
                            {
                                this.UpgraderButton.setLabel("Upgrader Off");
                                return;
                            }

                            log("Upgrader: Checking");
                            if (this.cityQueue.length == 0)
                            {
                                this.init();
                                return;
                            }
                            console.debug("Upgrader: Cities count: " + this.cityQueue.length.toString());
                            var currentBase = this.cityQueue.pop();
                            window.lastBase = currentBase;
                            //if (this.isWarBase(currentBase))
                            //{
                            //console.log(currentBase.get_Name() + ": Is a war base");

                            //if it's a war base, we try to upgrade buildings to the limits.

                            //first - making sure our main buildins are up to level on every base.
                            var upgradedEssentialBuildings = this.doUpgradeCity(currentBase)
                            log(currentBase.get_Name() + ": Tried to upgrade " + upgradedEssentialBuildings + " essential buildings");
                            if ( upgradedEssentialBuildings == 0)
                            {
                                var units = currentBase.get_CityUnitsData();

                                // var defenceUnits = units.get_DefenseUnits();
                                // var offenceUnits = units.get_OffenseUnits();
                                var units = null;
                                /*if (Math.random() >0.5)
                                {
                                    units = offenceUnits;
                                } else {
                                    units = defenceUnits;
                                }*/

                                var upgradeDone = false;

                                /*for (var nUnit in units.d) {

                                    var unit = units.d[nUnit];

                                    var unit_obj = {
                                        cityid: currentBase.get_Id(),
                                        unitId: unit.get_Id()
                                    };

                                    if (this.canUpgradeUnit(unit, currentBase)) {
                                        ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
                                        upgradeDone = true;
                                        log(currentBase.get_Name() + ": Upgrading " + unit.get_UnitGameData_Obj().dn + " to level " + (parseInt(unit.get_CurrentLevel(),10) + 1)  );
                                        break;
                                    };
                                }*/
                                if (!upgradeDone) {

                                    if (this.get_IsFull(currentBase, ClientLib.Base.EResourceType.Power) && false) //HACK
                                    {
                                        log(currentBase.get_Name() + ": Defence not upgraded. Power is full though.");

                                        var transferAmount = currentBase.GetResourceCount(ClientLib.Base.EResourceType.Power) * 4 - currentBase.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                                        transferAmount = Math.floor(transferAmount);

                                        if (transferAmount > 1000000000)
                                        {
                                            transferAmount = 1000000000;
                                        }

                                        log(currentBase.get_Name() + ": We need " + phe.cnc.gui.util.Numbers.formatNumbersCompactAfterMillion(transferAmount) + " crystals");

                                        var sourceTransferBase = this.findNearestWarBaseWithEnoughResources(currentBase, ClientLib.Base.EResourceType.Crystal, transferAmount);
                                        if (sourceTransferBase != null)
                                        {
                                            log(currentBase.get_Name() + ": Selected base " + sourceTransferBase.get_Name() + " for trading");
                                        } else {
                                            log(currentBase.get_Name() + ": Couldn't find the source base for trading");
                                        }

                                        if (sourceTransferBase != null && transferAmount > 0)
                                        {
                                            log(currentBase.get_Name() + ": Trying to transfer resources");
                                            var transferCost = currentBase.CalculateTradeCostToCoord(sourceTransferBase.get_PosX(), sourceTransferBase.get_PosY(), transferAmount);

                                            log(currentBase.get_Name() + ": The cost is " + phe.cnc.gui.util.Numbers.formatNumbersCompactAfterMillion(transferCost) + " credits");
                                            if (transferCost < ClientLib.Data.MainData.GetInstance().get_Player().GetCreditsCount())
                                            {
                                                log(currentBase.get_Name() + ": We have enought credits.");

                                                if (currentBase.CanTrade() == ClientLib.Data.ETradeError.None && sourceTransferBase.CanTrade() == ClientLib.Data.ETradeError.None)
                                                {
                                                    log(currentBase.get_Name() + ": Transferring");
                                                    log(currentBase.get_Id(), sourceTransferBase.get_Id(), ClientLib.Base.EResourceType.Crystal, transferAmount);
                                                    ClientLib.Net.CommunicationManager.GetInstance().SendCommand("SelfTrade",{targetCityId:currentBase.get_Id(),sourceCityId:sourceTransferBase.get_Id(),resourceType:ClientLib.Base.EResourceType.Crystal,amount:transferAmount}, null, null, true);
                                                } else {
                                                    log(currentBase.get_Name() + ": One of the cities cannot transfer resources");
                                                }

                                                log(currentBase.get_Name() + ": Returning current base into the queue.");
                                                this.cityQueue.unshift(currentBase);

                                                setTimeout.call(this, this.checkUpgrade, this.delay);
                                            } else {
                                                log(currentBase.get_Name() + ": Not enough credits. Transfer Canceled.");
                                                setTimeout.call(this, this.checkUpgrade, this.delay);
                                            }
                                        } else {
                                            log(currentBase.get_Name() + ": Transfer Canceled.");
                                            setTimeout.call(this, this.checkUpgrade, this.delay);
                                        }
                                    } else {
                                        log(currentBase.get_Name() + ": Unit not upgraded. Power is below threshold");
                                        setTimeout.call(this, this.checkUpgrade, this.delay);
                                    }
                                } else {
                                    setTimeout.call(this, this.checkUpgrade, this.delay);
                                }
                            } else {
                                setTimeout.call(this, this.checkUpgrade, this.delay * 3);
                            }


                            // } else {
                            // console.log(currentBase.get_Name() + ": Is a farm");
                            // if (this.defencesAtMaxLevel(currentBase))
                            // {
                            // console.log(currentBase.get_Name() + ": Defences maxed. Upgrading DF/DHQ");

                            // var dhq = this.getDHQ(currentBase);
                            // console.debug("found dhq");
                            // var df = this.getDF(currentBase);
                            // console.debug("found df");

                            // if (dhq != null && df != null)
                            // {
                            // console.debug("both dhq and df are present");
                            // if (dhq.get_CurrentLevel() < df.get_CurrentLevel())
                            // {
                            // console.debug("dhq level below df");

                            // if (this.canUpgradeBuilding(dhq, currentBase))
                            // {
                            // dhq.Upgrade();
                            // console.debug(currentBase.get_Name() + ":upgraded hq to level " + dhq.get_CurrentLevel());
                            // } else if (this.canUpgradeBuilding(df, currentBase)) {
                            // df.Upgrade();
                            // console.debug(currentBase.get_Name() + ": upgraded df @ " + df.get_CurrentLevel());
                            // } else {
                            // console.debug(currentBase.get_Name() + ": can't upgrade df/dhq :(");
                            // }
                            // } else {
                            // console.debug("df level below dhq");
                            // if (this.canUpgradeBuilding(df, currentBase))
                            // {
                            // df.Upgrade();
                            // console.debug(currentBase.get_Name() + ": upgraded df @ " + df.get_CurrentLevel());
                            // } else if (this.canUpgradeBuilding(dhq, currentBase)) {
                            // dhq.Upgrade();
                            // console.debug(currentBase.get_Name() + ": upgraded hq @ " + dhq.get_CurrentLevel());
                            // } else {
                            // console.debug(currentBase.get_Name() + ": can't upgrade df/dhq :(");
                            // }
                            // }
                            // }
                            // setTimeout.call(this, this.checkUpgrade, this.delay);
                            // } else {
                            // console.debug(currentBase.get_Name() + ": Upgrading defences");
                            // //we need to upgrade the units

                            // var units = currentBase.get_CityUnitsData();

                            // var defenceUnits = units.get_DefenseUnits();
                            // var offenceUnits = units.get_OffenseUnits();
                            // //ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_CityUnitsData().get_OffenseUnits()
                            // //var units = defenceUnits.concat(offenceUnits);
                            // var units = null;
                            // if (Math.random() >0.5)
                            // {
                            // units = offenceUnits;
                            // } else {
                            // units = defenceUnits;
                            // }

                            // var upgradeDone = false;

                            // for (var nUnit in units.d) {

                            // var unit = units.d[nUnit];

                            // var unit_obj = {
                            // cityid: currentBase.get_Id(),
                            // unitId: unit.get_Id()
                            // };

                            // if (this.canUpgradeUnit(unit, currentBase)) {
                            // ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
                            // upgradeDone = true;
                            // console.log(currentBase.get_Name() + ": Upgrading " + unit.get_UnitGameData_Obj().dn + " to level " + (parseInt(unit.get_CurrentLevel(),10) + 1)  );
                            // break;
                            // };

                            // }
                            // if (!upgradeDone) {

                            // if (this.get_IsFull(currentBase, ClientLib.Base.EResourceType.Power))
                            // {
                            // console.log(currentBase.get_Name() + ": Defence not upgraded. Power is full though.");

                            // var transferAmount = currentBase.GetResourceCount(ClientLib.Base.EResourceType.Power) * 4 - currentBase.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                            // transferAmount = Math.floor(transferAmount);

                            // if (transferAmount > 1000000000)
                            // {
                            // transferAmount = 1000000000;
                            // }

                            // console.log(currentBase.get_Name() + ": We need " + phe.cnc.gui.util.Numbers.formatNumbersCompactAfterMillion(transferAmount) + " crystals");

                            // var sourceTransferBase = this.findNearestWarBaseWithEnoughResources(currentBase, ClientLib.Base.EResourceType.Crystal, transferAmount);
                            // if (sourceTransferBase != null)
                            // {
                            // console.log(currentBase.get_Name() + ": Selected base " + sourceTransferBase.get_Name() + " for trading");
                            // } else {
                            // console.log(currentBase.get_Name() + ": Couldn't find the source base for trading");
                            // }

                            // if (sourceTransferBase != null && transferAmount > 0)
                            // {
                            // console.log(currentBase.get_Name() + ": Trying to transfer resources");
                            // var transferCost = currentBase.CalculateTradeCostToCoord(sourceTransferBase.get_PosX(), sourceTransferBase.get_PosY(), transferAmount);

                            // console.log(currentBase.get_Name() + ": The cost is " + phe.cnc.gui.util.Numbers.formatNumbersCompactAfterMillion(transferCost) + " credits");
                            // if (transferCost < ClientLib.Data.MainData.GetInstance().get_Player().GetCreditsCount())
                            // {
                            // console.log(currentBase.get_Name() + ": We have enought credits.");

                            // if (currentBase.CanTrade() == ClientLib.Data.ETradeError.None && sourceTransferBase.CanTrade() == ClientLib.Data.ETradeError.None)
                            // {
                            // console.log(currentBase.get_Name() + ": Transferring");
                            // console.log(currentBase.get_Id(), sourceTransferBase.get_Id(), ClientLib.Base.EResourceType.Crystal, transferAmount);
                            // ClientLib.Net.CommunicationManager.GetInstance().SendCommand("SelfTrade",{targetCityId:currentBase.get_Id(),sourceCityId:sourceTransferBase.get_Id(),resourceType:ClientLib.Base.EResourceType.Crystal,amount:transferAmount}, null, null, true);
                            // } else {
                            // console.log(currentBase.get_Name() + ": One of the cities cannot transfer resources");
                            // }

                            // console.log(currentBase.get_Name() + ": Returning current base into the queue.");
                            // this.cityQueue.unshift(currentBase);

                            // setTimeout.call(this, this.checkUpgrade, this.delay);
                            // } else {
                            // console.log(currentBase.get_Name() + ": Not enough credits. Transfer Canceled.");
                            // setTimeout.call(this, this.checkUpgrade, this.delay);
                            // }
                            // } else {
                            // console.log(currentBase.get_Name() + ": Transfer Canceled.");
                            // setTimeout.call(this, this.checkUpgrade, this.delay);
                            // }
                            // } else {
                            // console.log(currentBase.get_Name() + ": Unit not upgraded. Power is below threshold");
                            // setTimeout.call(this, this.checkUpgrade, this.delay);
                            // }
                            // } else {
                            // setTimeout.call(this, this.checkUpgrade, this.delay);
                            // }
                            // }
                            //}
                        },

                        canUpgradeUnit: function (unit, city) {
                            var nextLevel = unit.get_CurrentLevel() + 1;
                            var gameDataTech = unit.get_UnitGameData_Obj();
                            var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
                            if (gameDataTech == null || unit.get_IsDamaged() || city.get_IsLocked() || !hasEnoughResources) {
                                return false;
                            }
                            var id = this.getMainProductionBuildingMdbId(gameDataTech.pt, gameDataTech.f);
                            var building = city.get_CityBuildingsData().GetBuildingByMDBId(id);
                            if ((building == null) || (building.get_CurrentDamage() > 0)) {
                                return false;
                            }
                            var levelReq = ClientLib.Base.Util.GetUnitLevelRequirements_Obj(nextLevel, gameDataTech);
                            var reqTechIndexes = this.getMissingTechIndexesFromTechLevelRequirement(levelReq, true, city);
                            if ((reqTechIndexes != null) && (reqTechIndexes.length > 0)) {
                                return false;
                            }
                            return true;
                        },

                        getMainProductionBuildingMdbId: function (placementType, faction) {
                            var mdbId = -1;
                            var techNameId = -1;
                            if (placementType == 2) {
                                techNameId = 3;
                            } else {
                                techNameId = 4;
                            }
                            if (techNameId > 0) {
                                mdbId = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(techNameId, faction);
                            }
                            return mdbId;
                        },

                        getMissingTechIndexesFromTechLevelRequirement: function (levelRequirements, breakAtFirst, city) {
                            var reqTechIndexes = [];
                            if (levelRequirements != null && levelRequirements.length > 0) {
                                for (var lvlIndex=0; (lvlIndex < levelRequirements.length); lvlIndex++) {
                                    var lvlReq = levelRequirements[lvlIndex];
                                    var requirementsMet = false;
                                    var amountCounter = lvlReq.Amount;
                                    for (var buildingIndex in city.get_Buildings().d) {
                                        if (city.get_Buildings().d[buildingIndex].get_MdbBuildingId() == lvlReq.RequiredTechId && city.get_Buildings().d[buildingIndex].get_CurrentLevel() >= lvlReq.Level) {
                                            amountCounter--;
                                            if (amountCounter <= 0) {
                                                requirementsMet=true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!requirementsMet) {
                                        requirementsMet = ClientLib.Data.MainData.GetInstance().get_Player().get_PlayerResearch().IsResearchMinLevelAvailable(lvlReq.RequiredTechId, lvlReq.Level);
                                    }
                                    if (!requirementsMet) {
                                        reqTechIndexes.push(lvlIndex);
                                        if (breakAtFirst) {
                                            return reqTechIndexes;
                                        }
                                    }
                                }
                            }
                            return reqTechIndexes;
                        },

                        canUpgradeBuilding: function (building, city) {
                            var nextLevel = (building.get_CurrentLevel() + 1);
                            var gameDataTech = building.get_TechGameData_Obj();
                            var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
                            return (!building.get_IsDamaged() && !city.get_IsLocked() && hasEnoughResources);
                        },

                        isWarBase : function(base) {
                            return base.get_Name().indexOf("W") == 0 || base.get_Name().indexOf("sW") == 0;
                        },

                        getDF : function(base) {
                            return this.getBuildingByName(base, "Defense Facility");
                        },

                        getDHQ : function(base) {
                            return this.getBuildingByName(base, "Defense HQ");
                        },

                        defencesAtMaxLevel : function(base) {
                            var lowestLvl = 100;

                            var units = base.get_CityUnitsData();

                            /*var defenceUnits = units.get_DefenseUnits();

                            for (var nUnit in defenceUnits.d) {
                                var unit = defenceUnits.d[nUnit];
                                if (unit.get_CurrentLevel() < lowestLvl)
                                {
                                    lowestLvl = unit.get_CurrentLevel();
                                }
                            }*/


                            var dhq = this.getDHQ(base);

                            if ((dhq != null) && (dhq.get_CurrentLevel() > lowestLvl))
                            {
                                return false;
                            } else {
                                return true;
                            }
                        },

                        getBuildingByName : function(base, buildingName) {
                            var buildings = base.get_Buildings();
                            for (var nBuildings in buildings.d) {
                                var building = buildings.d[nBuildings];
                                var name = building.get_UnitGameData_Obj().dn;

                                if (name == buildingName)
                                {
                                    return building;
                                }
                            }
                            return null;
                        },

                        get_IsFull: function (base, type) {
                            return true;
                            if (base.GetResourceCount(type) < (base.GetResourceMaxStorage(type)*0.20)) {
                                return false;
                            } else {
                                return true;
                            }
                        },

                        findNearestWarBaseWithEnoughResources : function(base, resourceType, resourceAmount)
                        {
                            var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;

                            var result = null;
                            var lowestTransferCost = -1;

                            for (var i in cities)
                            {
                                if (cities[i] != base && this.isWarBase(cities[i]) && (cities[i].GetResourceCount(resourceType) > resourceAmount * 4)) //so we woulnd't take away the last resources
                                {
                                    var transferCost = cities[i].CalculateTradeCostToCoord(base.get_PosX(), base.get_PosY(), resourceAmount);

                                    if (lowestTransferCost == -1 || transferCost < lowestTransferCost)
                                    {
                                        lowestTransferCost = transferCost;
                                        result = cities[i];
                                    }
                                }
                            }

                            return result;
                        },



                    }
                });


                qx.Class.define("FlunikTools.BaseRaper", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {

                        StartRapeButton : null,

                        isRunning : false,

                        initialize: function() {
                            this.StartRapeButton = new qx.ui.form.Button("Raper", null).set({
                                toolTipText: "Flunik",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.StartRapeButton.addListener("click", function(e) {
                                if (this.isRunning)
                                {
                                    this.kill();
                                } else {
                                    this.init();
                                }
                            }, this);

                            var app = qx.core.Init.getApplication();

                            app.getDesktop().add(this.StartRapeButton, {
                                right: 230,
                                bottom: 80
                            });


                        },

                        init: function() {
                            log("Raper: Initialized");
                            this.StartRapeButton.setLabel("Raper On");
                            this.isRunning = true;
                            this.tryRape();
                        },

                        kill: function() {
                            this.isRunning = false;
                            this.StartRapeButton.setLabel("Raper Killing");
                        },

                        tryRape: function () {
                            if (!this.isRunning)
                            {
                                log("Raper Off");
                                this.StartRapeButton.setLabel("Raper Off");
                                return;
                            }


                            var target = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
                            var ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                            var currentCpCount = Math.floor(ownCity.GetResourceCount(15));

                            if (currentCpCount > 20)
                            {
                                if (ownCity != null) {
                                    ownCity.get_CityArmyFormationsManager().set_CurrentTargetBaseId(target);
                                }

                                if (  target && !target.get_isAlerted() && !target.get_IsLocked() && !target.get_HasIncommingAttack() )
                                {
                                    setTimeout.call( this, this.tryRape2, 5000 );
                                    log("Looks okay, trying to attack in 5s");
                                } else {
                                    log("Battle Not Started. alerted:" + target.get_isAlerted() + ", locked: " + target.get_IsLocked() + ", hasIncommingAttack: " + target.get_HasIncommingAttack() );
                                }
                            } else {
                                log("Battle Not Started. Not Enough CP");
                            }

                            var timeOut = (Math.random()+1)*10000;
                            if (currentCpCount<20) {
                                timeOut = 60000;
                            }
                            setTimeout.call( this, this.tryRape, timeOut );
                            //setTimeout(this.tryRape, timeOut);
                            log("Retrying farm in " + timeOut);
                        },
                        //if we can start battle, let's wait 2 seconds more and attack then
                        tryRape2: function() {
                            if (!this.isRunning)
                            {
                                log("Raper Off");
                                this.StartRapeButton.setLabel("Raper Off");
                                return;
                            }


                            var target = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
                            var ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                            var currentCpCount = Math.floor(ownCity.GetResourceCount(15));

                            if (currentCpCount > 20)
                            {
                                if (ownCity != null) {
                                    ownCity.get_CityArmyFormationsManager().set_CurrentTargetBaseId(target);
                                }

                                if (  target && !target.get_isAlerted() && !target.get_IsLocked() && !target.get_HasIncommingAttack() )
                                {
                                    FlunikTools.Farmer.getInstance().StartBattle();
                                    log("Battle Started");
                                } else {
                                    log("Battle Not Started. alerted:" + target.get_isAlerted() + ", locked: " + target.get_IsLocked() + ", hasIncommingAttack: " + target.get_HasIncommingAttack() );
                                }
                            } else {
                                log("Battle Not Started. Not Enough CP");
                            }
                        }
                    }
                });

                qx.Class.define("FlunikTools.Main", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {
                        UpgradePowerButton : null,
                        UpgradePowerAllButton : null,

                        initialize: function () {

                            UpgradeOffenceButton = new qx.ui.form.Button("Army +1", null).set({
                                toolTipText: "Upgrade Army +1 level in the selected city",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            UpgradeDefenceButton = new qx.ui.form.Button("Defence +1", null).set({
                                toolTipText: "Upgrade Defence +1 level in the selected city",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            UpgradeBuildingsButton = new qx.ui.form.Button("Base +1", null).set({
                                toolTipText: "Upgrade Buildings +1 level in the selected city",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.UpgradePowerButton = new qx.ui.form.Button("Power Selected", null).set({
                                toolTipText: "Click me once.",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            this.UpgradePowerAllButton = new qx.ui.form.Button("Power All", null).set({
                                toolTipText: "Click me once.",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });



                            UpgradeOffenceButton.addListener("click", function(e) {
                                window.FlunikTools.Main.getInstance().upgradeAllOffenceCurrentCity();
                            }, this);
                            UpgradeDefenceButton.addListener("click", function(e) {
                                window.FlunikTools.Main.getInstance().upgradeAllDefenceCurrentCity();
                            }, this);
                            UpgradeBuildingsButton.addListener("click", function(e) {
                                window.FlunikTools.Main.getInstance().upgradeAllBuildingsCurrentCity();
                            }, this);
                            this.UpgradePowerButton.addListener("click", function(e) {
                                window.FlunikTools.Main.getInstance().upgradePowerSelectedCity();
                            }, this);
                            this.UpgradePowerAllButton.addListener("click", function(e) {
                                window.FlunikTools.Main.getInstance().upgradePowerAllCity();
                            }, this);



                            var app = qx.core.Init.getApplication();



                            app.getDesktop().add(UpgradeOffenceButton, {
                                right: 120,
                                top: 0
                            });
                            app.getDesktop().add(UpgradeDefenceButton, {
                                right: 120,
                                top: 40
                            });
                            app.getDesktop().add(UpgradeBuildingsButton, {
                                right: 120,
                                top: 80
                            });
                            app.getDesktop().add(this.UpgradePowerButton, {
                                right: 120,
                                top: 120
                            });
                            app.getDesktop().add(this.UpgradePowerAllButton, {
                                right: 120,
                                top: 160
                            });

                        },


                        upgradeAllOffenceCurrentCity : function() {
                            try
                            {
                                var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                var units = city.get_CityUnitsData();
                                /*var offenceUnits = units.get_OffenseUnits();
                                for (var nUnit in offenceUnits.d)
                                {
                                    var unit = offenceUnits.d[nUnit];
                                    var unit_obj = {
                                        cityid: city.get_Id(),
                                        unitId: unit.get_Id()
                                    }

                                    ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
                                    //console.log(unit);
                                }*/
                            }
                            catch (e) {
                                console.log("Flunik Script: Failed to upgrade all offences. " + e);
                            }
                        },

                        upgradeAllDefenceCurrentCity : function() {
                            try
                            {
                                var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                var units = city.get_CityUnitsData();
                                var defenseUnits = units.get_DefenseUnits();
                                for (var nUnit in defenseUnits.d)
                                {
                                    var unit = defenseUnits.d[nUnit];
                                    var unit_obj = {
                                        cityid: city.get_Id(),
                                        unitId: unit.get_Id()
                                    }

                                    ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
                                    //console.log(unit);
                                }
                            }
                            catch (e) {
                                console.log("Flunik Script: Failed to upgrade all defences. " + e);
                            }
                        },

                        upgradePowerSelectedCity : function() {
                            try
                            {
                                canUpgradeBuilding = function (building, city) {
                                    var nextLevel = (building.get_CurrentLevel() + 1);
                                    var gameDataTech = building.get_TechGameData_Obj();
                                    var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
                                    return (!building.get_IsDamaged() && !city.get_IsLocked() && hasEnoughResources);
                                };

                                maxPowerRatio = 1000;

                                doUpgradePower = function()
                                {
                                    try {

                                        var priority = HuffyTools.UpgradePriority.getInstance().getPrioList(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity(), [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction, true, false);
                                        if (priority.length != 0)
                                        {
                                            var upgradeObject = priority[0];
                                            var powerCost = upgradeObject.Costs[5];
                                            if (!powerCost || powerCost == 0)
                                            {
                                                powerCost = 1;
                                            }
                                            var powerGain = upgradeObject.GainPerHour;
                                            var ratio = powerGain / powerCost;
                                            if (upgradeObject.Affordable)
                                            {
                                                console.log("upgrading");
                                                ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", upgradeObject.Building, null, null, true);

                                                FlunikTools.Main.getInstance().UpgradePowerButton.setLabel("Upgrading...");

                                                setTimeout(doUpgradePower, 5000)
                                            } else {
                                                FlunikTools.Main.getInstance().UpgradePowerButton.setLabel("Upgrading...");

                                                console.log("not viable or not affordable. ratio is " + ratio);

                                                setTimeout(doUpgradePower, 5000)
                                            }
                                        } else {
                                            FlunikTools.Main.getInstance().UpgradePowerButton.setLabel("stopped");
                                            console.log("no buildings to upgrade");
                                            //setTimeout(doUpgradePower, 500)
                                        }
                                    } catch (ex) {
                                        alert('Exception while upgrading power');
                                        FlunikTools.Main.getInstance().UpgradePowerButton.setLabel("stopped(ex)");
                                    }
                                }

                                setTimeout(doUpgradePower, 2000)
                            }
                            catch (e) {
                                console.log("Flunik Script: Failed to upgrade all buildings. " + e);
                                FlunikTools.Main.getInstance().UpgradePowerButton.setLabel("stopped(ex)");
                            }
                        },

                        upgradePowerAllCity : function() {
                            try
                            {
                                canUpgradeBuilding = function (building, city) {
                                    var nextLevel = (building.get_CurrentLevel() + 1);
                                    var gameDataTech = building.get_TechGameData_Obj();
                                    var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
                                    return (!building.get_IsDamaged() && !city.get_IsLocked() && hasEnoughResources);
                                };

                                maxPowerRatio = 1000;

                                doUpgradePower = function()
                                {
                                    if (!window.upgradepowercount)
                                    {
                                        window.upgradepowercount = 0;
                                    }
                                    if (!window.upgradepowerskipcount)
                                    {
                                        window.upgradepowerskipcount = 0;
                                    }


                                    try {
                                        var keys = Object.keys(ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d);
                                        var randomCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[keys[Math.floor(keys.length * Math.random())]];

                                        //var priority = HuffyTools.UpgradePriority.getInstance().getPrioList(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity(), [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction, true, false);
                                        var priority = HuffyTools.UpgradePriority.getInstance().getPrioList(randomCity, [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction, true, false);
                                        if (priority.length != 0)
                                        {
                                            var upgradeObject = priority[0];
                                            var powerCost = upgradeObject.Costs[5];
                                            if (!powerCost || powerCost == 0)
                                            {
                                                powerCost = 1;
                                            }
                                            var powerGain = upgradeObject.GainPerHour;
                                            var ratio = powerGain / powerCost;
                                            if (upgradeObject.Affordable)
                                            {
                                                console.log("upgrading");
                                                ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", upgradeObject.Building, null, null, true);

                                                window.upgradepowercount++;
                                                FlunikTools.Main.getInstance().UpgradePowerAllButton.setLabel(window.upgradepowercount + " . " + window.upgradepowerskipcount);

                                                setTimeout(doUpgradePower, 5000)
                                            } else {
                                                window.upgradepowerskipcount++;
                                                FlunikTools.Main.getInstance().UpgradePowerAllButton.setLabel(window.upgradepowercount + " . " + window.upgradepowerskipcount);

                                                console.log("not viable or not affordable. ratio is " + ratio);

                                                setTimeout(doUpgradePower, 5000)
                                            }
                                        } else {
                                            window.upgradepowerskipcount++;
                                            FlunikTools.Main.getInstance().UpgradePowerAllButton.setLabel(window.upgradepowercount + " . "+ window.upgradepowerskipcount);
                                            console.log("no buildings to upgrade");
                                            setTimeout(doUpgradePower, 500)
                                        }
                                    } catch (ex) {
                                        alert('Exception while upgrading power' + ex);
                                    }
                                }

                                setTimeout(doUpgradePower, 2000)
                            }
                            catch (e) {
                                console.log("Flunik Script: Failed to upgrade all buildings. " + e);
                            }
                        },

                        upgradeSiloSelectedCity : function() {
                            try
                            {
                                canUpgradeBuilding = function (building, city) {
                                    var nextLevel = (building.get_CurrentLevel() + 1);
                                    var gameDataTech = building.get_TechGameData_Obj();
                                    var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
                                    return (!building.get_IsDamaged() && !city.get_IsLocked() && hasEnoughResources);
                                };

                                maxPowerRatio = 5000;

                                doUpgradePower = function()
                                {
                                    try {
                                        var priority = HuffyTools.UpgradePriority.getInstance().getPrioList(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity(), [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Refinery], ClientLib.Base.EModifierType.CreditsPackageSize, ClientLib.Base.EModifierType.CreditsProduction, true, false);
                                        if (priority.length != 0)
                                        {
                                            var upgradeObject = priority[0];
                                            var powerCost = upgradeObject.Costs[5];
                                            if (!powerCost || powerCost == 0)
                                            {
                                                powerCost = 1;
                                            }
                                            var powerGain = upgradeObject.GainPerHour;
                                            var ratio = powerGain / powerCost;
                                            if (ratio < maxPowerRatio && upgradeObject.Affordable)
                                            {
                                                window.log("upgrading");
                                                ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", upgradeObject.Building, null, null, true);
                                                window.log('upgraded a silo')

                                                setTimeout(doUpgradePower, 2000)
                                            } else {
                                                FlunikTools.Main.getInstance().UpgradePowerButton.setLabel("Upgrading Done. Ready.");

                                                window.log("not viable or not affordable. ratio is " + ratio);
                                            }
                                        } else {
                                            FlunikTools.Main.getInstance().UpgradePowerButton.setLabel("Upgrading Done. Ready.");
                                            window.log("no buildings to upgrade");
                                        }
                                    } catch (ex) {
                                        alert('Exception while upgrading power');
                                    }
                                }

                                setTimeout(doUpgradePower, 2000)
                            }
                            catch (e) {
                                window.log("Flunik Script: Failed to upgrade all buildings. " + e);
                            }
                        },

                        upgradeAllBuildingsCurrentCity : function() {
                            try
                            {
                                var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                var buildings = city.get_Buildings();

                                for (var nBuildings in buildings.d) {
                                    var building = buildings.d[nBuildings];
                                    if (building.get_UnitGameData_Obj().dn == "Construction Yard")
                                    {
                                        continue;
                                    }

                                    var building_obj = {
                                        cityid: city.get_Id(),
                                        posX: building.get_CoordX(),
                                        posY: building.get_CoordY(),
                                        isPaid: true
                                    }

                                    //console.log(building);
                                    ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
                                }
                            }
                            catch (e) {
                                console.log("Flunik Script: Failed to upgrade all buildings. " + e);
                            }
                        },

                    } // members
                }); // class define


                qx.Class.define("FlunikTools.HUD", {
                    type: "singleton",
                    extend: qx.core.Object,
                    construct: function () {
                        this.SectorText = new qx.ui.basic.Label("").set({
                            textColor : "#FFFFFF",
                            font : "font_size_11"
                        });
                        HUD = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                            decorator : new qx.ui.decoration.Decorator().set({
                                backgroundRepeat : "no-repeat",
                                backgroundImage : "webfrontend/ui/menues/notifications/bgr_ticker_container.png",
                                backgroundPositionX : "center"
                            }),
                            padding : 2,
                            opacity: 0.8
                        });
                        HUD.add(this.SectorText);
                        HUD.addListener("click", function () {
                            this.paste_Coords();
                        }, this);
                        qx.core.Init.getApplication().getDesktop().add(HUD, {left: 128, top: 0});
                        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), "PositionChange", ClientLib.Vis.PositionChange, this, this._update);
                    },
                    destruct: function () {},
                    members: {
                        SectorText: null,
                        get_SectorText: function (i) {
                            var qxApp = qx.core.Init.getApplication();
                            switch (i) {
                                case 0:
                                    return qxApp.tr("tnf:south abbr");
                                case 1:
                                    return qxApp.tr("tnf:southwest abbr");
                                case 2:
                                    return qxApp.tr("tnf:west abbr");
                                case 3:
                                    return qxApp.tr("tnf:northwest abbr");
                                case 4:
                                    return qxApp.tr("tnf:north abbr");
                                case 5:
                                    return qxApp.tr("tnf:northeast abbr");
                                case 6:
                                    return qxApp.tr("tnf:east abbr");
                                case 7:
                                    return qxApp.tr("tnf:southeast abbr");
                            }
                        },
                        get_SectorNo: function (x, y) {
                            var WorldX2 = Math.floor(ClientLib.Data.MainData.GetInstance().get_Server().get_WorldWidth() / 2);
                            var WorldY2 = Math.floor(ClientLib.Data.MainData.GetInstance().get_Server().get_WorldHeight() / 2);
                            var SectorCount = ClientLib.Data.MainData.GetInstance().get_Server().get_SectorCount();
                            var WorldCX = (WorldX2 - x);
                            var WorldCY = (y - WorldY2);
                            var WorldCa = ((Math.atan2(WorldCX, WorldCY) * SectorCount) / 6.2831853071795862);
                            WorldCa += (SectorCount + 0.5);
                            return (Math.floor(WorldCa) % SectorCount);
                        },
                        get_Coords: function () {
                            var Region = ClientLib.Vis.VisMain.GetInstance().get_Region();
                            var GridWidth = Region.get_GridWidth();
                            var GridHeight = Region.get_GridHeight();
                            var RegionPosX = Region.get_PosX();
                            var RegionPosY = Region.get_PosY();
                            var ViewWidth = Region.get_ViewWidth();
                            var ViewHeight = Region.get_ViewHeight();
                            var ZoomFactor = Region.get_ZoomFactor();
                            var ViewCoordX = Math.floor((RegionPosX + ViewWidth / 2 / ZoomFactor) / GridWidth - 0.5);
                            var ViewCoordY = Math.floor((RegionPosY + ViewHeight / 2 / ZoomFactor) / GridHeight - 0.5);
                            return {X: ViewCoordX, Y: ViewCoordY};
                        },
                        paste_Coords: function(){
                            var Coords = this.get_Coords();
                            var input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable();
                            var inputDOM = input.getContentElement().getDomElement();
                            var text = [];
                            text.push(inputDOM.value.substring(0, inputDOM.selectionStart));
                            text.push("[coords]" + Coords.X + ':' + Coords.Y + "[/coords]");
                            text.push(inputDOM.value.substring(inputDOM.selectionEnd, inputDOM.value.length));
                            input.setValue(text.join(' '));
                        },
                        _update: function () {
                            var Coords = this.get_Coords();
                            this.SectorText.setValue(Coords.X + ":" + Coords.Y + " [" + this.get_SectorText(this.get_SectorNo(Coords.X, Coords.Y)) + "]");
                        }
                    }
                });


            } // create fluniktools
        } catch (e) {
            console.log("createFlunikTools: ", e);
        } // end try catch

        function FlunikTools_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                    createFlunikTools();

                    for (var key in ClientLib.Data.CityBuilding.prototype) { //KRS_L
                        if (ClientLib.Data.CityBuilding.prototype[key] !== null) {
                            var strFunction = ClientLib.Data.CityBuilding.prototype[key].toString();
                            if (typeof ClientLib.Data.CityBuilding.prototype[key] === 'function' & strFunction.indexOf("true).l.length==0)){return true;}}return false") > -1) {
                                ClientLib.Data.CityBuilding.prototype.CanUpgrade = ClientLib.Data.CityBuilding.prototype[key];
                                break;
                            }
                        }
                    }

                    for (var key in ClientLib.Data.CityUnit.prototype) { //KRS_L
                        if (ClientLib.Data.CityUnit.prototype[key] !== null) {
                            var strFunction = ClientLib.Data.CityUnit.prototype[key].toString();
                            if (typeof ClientLib.Data.CityUnit.prototype[key] === 'function' & strFunction.indexOf(".l.length>0)){return false;}") > -1) {
                                ClientLib.Data.CityUnit.prototype.CanUpgrade = ClientLib.Data.CityUnit.prototype[key];
                                break;
                            }
                        }
                    }

                    for (var key in ClientLib.Data.CityBuilding.prototype) {
                        if (typeof ClientLib.Data.CityBuilding.prototype[key] === 'function') {
                            var strFunction = ClientLib.Data.CityBuilding.prototype[key].toString();
                            if (strFunction.indexOf("()+1);this.") > -1) {
                                ClientLib.Data.CityBuilding.prototype.Upgrade = ClientLib.Data.CityBuilding.prototype[key];
                                break;
                            }
                        }
                    }


                    window.FlunikTools.HUD.getInstance();
                    window.FlunikTools.Upgrader.getInstance().initialize();
                    window.FlunikTools.Farmer.getInstance().initialize();
                    window.FlunikTools.Main.getInstance().initialize();
                    window.FlunikTools.BaseRaper.getInstance().initialize();

                    setTimeout(function() {
                        window.autoFarmList = ["flunik", "zzzmax3", "Paddy1223", "bl0h00", "zzz78787878"]

                        if (window.autoFarmList.indexOf(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_PlayerName()) != -1) {
                            window.FlunikTools.Farmer.getInstance().switchFarm();
                        }
                    }, 20000);

                    setTimeout(function() {
                        window.autoRaperList = ["Ibelman23", "Anariuses", "Bomberiks", "Hekmop", "jamerlan", "hty5", "Commander_Ran"];
                        window.farmCoords = "809:865";
                        window.farmId = 41602703;

                        if (window.autoRaperList.indexOf(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_PlayerName()) != -1) {
                            //centering the screen
                            var targetX = parseInt(window.farmCoords.split(":")[0]);
                            var targetY = parseInt(window.farmCoords.split(":")[1]);
                            ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(targetX, targetY);

                            //now we're opening the attack view
                            var app = qx.core.Init.getApplication();
                            app.getBackgroundArea().closeCityInfo();
                            app.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmNone);
                            app.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, window.farmId, 0, 0);

                            //now we're selecting the attack city
                            var t = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                            if (t != null) {
                                t.get_CityArmyFormationsManager().set_CurrentTargetBaseId(window.farmId);
                            }


                            //simulating
                            setTimeout(function() {
                                //alert('simulating');
                                ClientLib.API.Battleground.GetInstance().SimulateBattle();

                                setTimeout(function() {
                                    //alert('check simulate');
                                    var baseHealth = parseFloat(Simulator.StatWindow.getInstance().__labelEnemyBaseHealth.$$user_value,10);
                                    if (baseHealth > 100)
                                    {
                                        FlunikTools.BaseRaper.getInstance().init();
                                        //alert('raper started');
                                    } else {
                                        //alert('raper not started: base health is: ' + baseHealth);
                                    }
                                },10000);
                            }, 10000);

                        }


                        //

                        //start raper





                    }, 20000);

                    var logObject;
                    var createLogWindow = function()
                    {
                        var container = document.createElement('div');
                        logObject = document.createElement('p');
                        container.appendChild(logObject);
                        document.body.appendChild(container);
                        container.style.position = 'fixed'
                        container.style.top = 0;
                        container.style.left = 0;
                        container.style.width = '300px';
                        container.style.height = '100px';
                        container.style.resize = 'both';
                        container.style.zIndex = 100000000;
                        container.style.backgroundColor = '#666';
                        container.style.opacity = '0.8';
                        container.style.color = '#fff';
                        container.style.overflow = 'auto';
                        logObject.style.textAlign = 'left';
                        log('Log Initialised');
                    }

                    window.log = function(text)
                    {
                        console.log(text);
                        logObject.innerHTML += text + "<br/>";
                    }
                    createLogWindow();

                    //accessing substitutes
                    setTimeout(function() {
                        //alert(1);
                        window.subList = [];//["freak3k", "KleskMS"];
                        //alert(2);
                        window.subs = ClientLib.Data.MainData.GetInstance().get_PlayerSubstitution().getSubstitution().filter(function(sub) { return window.subList.indexOf(sub.n) != -1})
                        //alert(3);
                        window.handleAnswer = function(var1,code,var3)
                        {
                            var cn = "<form name='loginform' id='loginform' action='https://prodgame03.alliances.commandandconquer.com/11/index.aspx' method='post'><input type='text' name='dummy' id='dummy' class='input' value='' /><input type='hidden' name='SessionId' id='SessionId' class='input' value='" + code + "' /></form><script type='text/javascript'>document.loginform.submit();</script>";
                            var co = window.open("about:blank", "");
                            co.document.write(cn);
                            co.document.close();
                        }
                        //alert(4);
                        for (var i = 0; i < window.subs.length ; i++)
                        {
                            var sub = window.subs[i];
                            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("CreateSubstitutionSession", {
                                id: sub.i,
                                pid: sub.p0
                            }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, window, window.handleAnswer), null);
                        }
                    }, 10000);


                    //end accessing substitutes

                } else {
                    window.setTimeout(FlunikTools_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("FlunikTools_checkIfLoaded: ", e);
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(FlunikTools_checkIfLoaded, 1000);
        }
    }; // FlunikTools_main function

    try {
        var FlunikScript = document.createElement("script");
        FlunikScript.innerHTML = "(" + FlunikTools_main.toString() + ")();";
        FlunikScript.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(FlunikScript);
        }
    } catch (e) {
        console.log("FlunikTools: init error: ", e);
    }
})();


/*
canUpgradeBuilding = function (building, city) {
	var nextLevel = (building.get_CurrentLevel() + 1);
	var gameDataTech = building.get_TechGameData_Obj();
	var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
	return (!building.get_IsDamaged() && !city.get_IsLocked() && hasEnoughResources);
};

maxPowerRatio = 1000;

doUpgradePower = function(city)
{
	try {
		var priority = HuffyTools.UpgradePriority.getInstance().getPrioList(city, [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction, true, false);
	} catch(ex) {
		console.log(city.get_Name() + ": upgrade priority calculations failed. re-scheduling");
		setTimeout(doUpgradePower, Math.round(Math.random()*30000)+10000)
	}
	console.log(priority);

	if (priority.length != 0)
	{
		var upgradeObject = priority[0];
		var powerCost = upgradeObject.Costs[5];
		if (!powerCost || powerCost == 0)
		{
			powerCost = 1;
		}
		var powerGain = upgradeObject.GainPerHour;
		var ratio = powerCost / powerGain;
		if (ratio < maxPowerRatio && upgradeObject.Affordable)
		{
			console.log(city.get_Name() + ": upgrading power. ratio is " + ratio);
			ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", upgradeObject.Building, null, null, true);
			setTimeout(doUpgradePower, Math.round(Math.random()*30000)+10000)
		} else {
			console.log(city.get_Name() + ": not viable or not affordable");
		}
	} else {
		console.log(city.get_Name() + "no buildings to upgrade");
	}
}
starterTimeout = function(city, timeout)
{
	setTimeout(function() {
		doUpgradePower(city);
	}, timeout);
}
for (city in ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d)
{
	starterTimeout(ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[city], Math.round(Math.random()*60000)+10000);
}



FlunikTools.Upgrader.getInstance().doUpgradeCity(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity())

var updateCity = function() {
	var requestsCount = FlunikTools.Upgrader.getInstance().doUpgradeCity(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity());
	FlunikTools.Main.getInstance().upgradeAllOffenceCurrentCity();
	setTimeout(updateCity, (requestsCount + 20) * 200);
}
setTimeout(updateCity, 5000);





var cityList = null;

for (city in ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d)
{
	cityList.push(ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[city]);

}




*/

/*

var simBody = ClientLib.API.Battleground.GetInstance().SimulateBattle.toString();
var attackBody = simBody.substr(0, simBody.indexOf("ClientLib.Net.CommunicationManager.GetInstance()")) + 'ClientLib.Net.CommunicationManager.GetInstance().SendCommand("InvokeBattle", { battleSetup: c }, null,null,true); }}'
var attackBody = attackBody.replace("function", "function StartBattle");
this.attackFn = eval(attackBody);

function tryFarm() {
	var target = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
	var ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
	var currentCpCount = Math.floor(ownCity.GetResourceCount(15));

	if (currentCpCount > 20)
	{
		if (ownCity != null) {
			ownCity.get_CityArmyFormationsManager().set_CurrentTargetBaseId(target);
		}

		if (  target && !target.get_isAlerted() && !target.get_IsLocked() && !target.get_HasIncommingAttack() )
		{
			console.log("Battle Started");
			StartBattle();
		} else {
			console.log("Battle Not Started. alerted:" + target.get_isAlerted() + ", locked: " + target.get_IsLocked() + ", hasIncommingAttack: " + target.get_HasIncommingAttack() );
		}
	} else {
		console.log("Battle Not Started. Not Enough CP");
	}

	var timeOut = (Math.random()+1)*10000;
	setTimeout(tryFarm, timeOut);
	console.log("Retrying farm in " + timeOut);
}

tryFarm();


*/


/*
var interval = setInterval(function() {
	var empty = true;

	var mailbox = ClientLib.Data.MainData.GetInstance().get_Mail();

	var c = [];
	var messages = mailbox.GetMails(0).d;
	for (a in messages)
	{
		if (parseInt(messages[a]) != NaN) {
			c.push(a);
		}
	}

	if (c.length > 0)
	{
		mailbox.DeleteMessages(c, 1);
		empty = false;
		//console.log("deleting inbox " + c.length);
	}



	var messages = mailbox.GetMails(1).d;
	for (a in messages)
	{
		if (parseInt(messages[a]) != NaN) {
			c.push(a);
		}
	}

	if (c.length > 0)
	{
		mailbox.DeleteMessages(c, 0);
		empty = false;
		console.log("deleting sent " + c.length);
	}

	if (empty)
	{
		clearInterval(interval);
	}
}, 2000);
*/