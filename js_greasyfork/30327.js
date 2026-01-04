// ==UserScript==
// @name        C&C Tiberium Alliances AutoCheat
// @namespace   AutoCheat
// @description Autocheat move cool down, Autocheat repairall (Def, Off)
// @include http*://prodgame*.alliances.commandandconquer.com/*/index.aspx
// @version     2.1.0gg
// @author      D4rkv3nom
// @contributor leo7044
// @contributor Vocheck
// @downloadURL https://update.greasyfork.org/scripts/30327/CC%20Tiberium%20Alliances%20AutoCheat.user.js
// @updateURL https://update.greasyfork.org/scripts/30327/CC%20Tiberium%20Alliances%20AutoCheat.meta.js
// ==/UserScript==
(function () {
    var AutoCheat_main = function () {
        try {
            function initAutoCheat() {
                console.log('C&C:Tiberium Alliances AutoCheat loaded.');
                var autoCheat = {
                    timeOutAutoCheat: function () {
                        try {
                            window.setTimeout(autoCheat.timeOutAutoCheat, 4500);
                            if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity() !== null) 
                            {
                                if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_hasCooldown()) 
                                {
                                    autoCheat.sendCheatMoveCoolDown();
                                }
                                var x = 0; 
                                var apcl = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                                for (var key in apcl)
                                {
                                    var c = apcl[key];
                                    if (c.GetFullConditionInPercent() < 100 && (c.GetBuildingsConditionInPercent() < 100 || c.GetDefenseConditionInPercent() < 100 || c.GetOffenseConditionInPercent() < 100))
                                    {
                                        switch (x)
                                        {
                                            case 0: autoCheat.sendCheatAutoRepair(0);break;
                                            case 1: autoCheat.sendCheatAutoRepair(1);break;
                                            case 2: autoCheat.sendCheatAutoRepair(2);break;
                                            case 3: autoCheat.sendCheatAutoRepair(3);break;
                                            case 4: autoCheat.sendCheatAutoRepair(4);break;
                                            case 5: autoCheat.sendCheatAutoRepair(5);break;
                                            case 6: autoCheat.sendCheatAutoRepair(6);break;
                                            case 7: autoCheat.sendCheatAutoRepair(7);break;
                                            case 8: autoCheat.sendCheatAutoRepair(8);break;
                                            case 9: autoCheat.sendCheatAutoRepair(9);break;
                                            case 10: autoCheat.sendCheatAutoRepair(10);break;
                                            case 11: autoCheat.sendCheatAutoRepair(11);break;
                                            case 12: autoCheat.sendCheatAutoRepair(12);break;
                                            case 13: autoCheat.sendCheatAutoRepair(13);break;    
                                        }
                                    }
                                    x = x + 1;
                                    //    window.setTimeout(autoCheat.timeOutAutoCheat, 9000);
                                }
                                if (ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() < 500) {
                                    autoCheat.sendCheatSetCommandPoints();
                                }
                            }
                        } catch (e) {
                            console.log('timeOutAutoCheat: ', e);
                        }
                    },
                    sendCheatMoveCoolDown: function () {
                        try {
                            if (qx.core.Init.getApplication().getChat() !== null) {
                                qx.core.Init.getApplication().getChat().getChatWidget().send('/cheat resetmovecooldownpte');
                            }
                        } catch (e) {
                            console.log('sendCheatMoveCoolDown: ', e);
                        }
                    },
                    sendCheatAutoRepair: function (id) {
                        try {
                            if (qx.core.Init.getApplication().getChat() !== null) {
                                qx.core.Init.getApplication().getChat().getChatWidget().send('/cheat repairallpte '+id);
                                qx.core.Init.getApplication().getChat().getChatWidget().send('/cheat repairallpte');
                            }
                        } catch (e) {
                            console.log('sendCheatAutoRepair: ', e);
                        }
                    },
                    sendCheatSetCommandPoints: function () {
                        try {
                            if (qx.core.Init.getApplication().getChat() !== null) {
                                qx.core.Init.getApplication().getChat().getChatWidget().send('/cheat setcommandpoints 800');
                            }
                        } catch (e) {
                            console.log('sendCheatSetCommandPoints: ', e);
                        }
                    }
                };
                console.log('init AutoCheat');
                window.setTimeout(autoCheat.timeOutAutoCheat, 2000);
            }
        } catch (e) {
            console.log('initAutoCheat: ', e);
        }
        function AutoCheat_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined') {
                    initAutoCheat();
                } else {
                    window.setTimeout(AutoCheat_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log('AutoCheat_checkIfLoaded: ', e);
            }
        }
        window.setTimeout(AutoCheat_checkIfLoaded, 1000);
    };
    try {
        var AutoCheat = document.createElement('script');
        AutoCheat.innerHTML = '(' + AutoCheat_main.toString() + ')();';
        AutoCheat.type = 'text/javascript';
        document.getElementsByTagName('head') [0].appendChild(AutoCheat);
    } catch (e) {
        console.log('AutoCheat: init error: ', e);
    }
}) ();