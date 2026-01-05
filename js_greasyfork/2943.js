// ==UserScript==
// @name           C&C Tiberium Alliances Info - Updated Layout
// @author         Soera and TheStriker(OriginalAuthor) and dbendure
// @description    Relay your levels etc in a wink of an eye.
// @description    Alt+1 - Insert to message/chat/post all your bases/cities 1 - 10 info
// @description    Alt+2 - Insert to message/chat/post all your bases/cities 10 - 20 info
// @description    Alt+3 - Insert to message/chat/post all your bases/cities 20 - 30 info
// @description    Alt+N - Insert to message/chat/post ally support info
// @description    *Please Note the POI infos will over fill character size, so you will need to manualy edit the output if this is the case.
// @description    Alt+G - Insert to message/chat/post  Tiberium POIs and base names info with infosticker functions ability
// @description    Alt+R - Insert to message/chat/post  Crystal POIs info and base names infosticker functions ability
// @description    Alt+P - Insert to message/chat/post  Power POIs info and base names with infosticker functions ability  
// @description    Alt+I - Insert to message/chat/post  Infantry POIs info and base names with infosticker functions ability 
// @description    Alt+C - Insert to message/chat/post  Vehicals POIs info and base names with infosticker functions ability
// @description    Alt+U - Insert to message/chat/post  Air POIs info and base names with infosticker functions ability  
// @description    Alt+O - Insert to message/chat/post  Defense POIs info and base names with infosticker functions ability  
// @namespace      https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version        1.0.16
// @downloadURL https://update.greasyfork.org/scripts/2943/CC%20Tiberium%20Alliances%20Info%20-%20Updated%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/2943/CC%20Tiberium%20Alliances%20Info%20-%20Updated%20Layout.meta.js
// ==/UserScript==
(function() {
    function InfoSticker_IsInstalled() {
        return (typeof(InfoSticker_IsInstalled) != 'undefined' && InfoSticker_IsInstalled);
    }
    var TAI_main = function() {

        function createInstance() {
            qx.Class.define("TAI", { //TAI.main
                type: "singleton",
                extend: qx.core.Object,
                members: {
                    initialize: function() {
                        addEventListener("keyup", this.onKey, false);
                        console.log("TA Info loaded.");

                    },
                    

                    onKey: function(ev) {
                        var s = String.fromCharCode(ev.keyCode);
                        var inputField = document.querySelector('input:focus, textarea:focus');
                        if (inputField != null) {
                            // ALT+
                            if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "1") {
                                // player bases info to share with others

                                var apc = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d; //all player cities
                                var playername = ClientLib.Data.MainData.GetInstance().get_Player().get_Name();
                                var num = 0;
                                var txt = "",
                                    c, unitData, bh, supp, type, df;
                                txt += "[quote=" + playername + "]";
                                for (var key in apc) {
                                    num++;
                                    if (num <= 10) {
                                        c = apc[key];
                                        txt += "[quote]Def: [b]" + ('0' + c.get_LvlDefense().toFixed(2)).slice(-5) + "[/b] ";
                                        txt += "Off: [b]" + ('0' + c.get_LvlOffense().toFixed(2)).slice(-5) + "[/b] ";
                                        unitData = c.get_CityBuildingsData();
                                        bh = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard);
                                        df = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
                                        supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Ion);
                                        if (supp === null)
                                            supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Art);
                                        if (supp === null)
                                            supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Air);
                                        if (bh !== null) {
                                            txt += "CY: [b]" + bh.get_CurrentLevel() + "[/b] ";
                                            //txt += "[u]BaseRep:[/u] [b]" + (c.get_CityBuildingsData().GetFullRepairTime() / 3600).toFixed(2) + "h[/b] ";
                                            //txt += "[u]DefRep:[/u] [b]" + (c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense) / 3600).toFixed(2) + "h[/b] ";
                                        }
                                        if (df !== null) {
                                            txt += "DF: [b]" + df.get_CurrentLevel() + "[/b] ";
                                        } else {
                                            txt += "DF: [b]NA[/b] ";
                                        }
                                        if (supp !== null) {
                                            txt += "" + supp.get_TechGameData_Obj().dn.slice(0, 3) + ": [b]" + supp.get_CurrentLevel() + "[/b] ";
                                        } else {
                                            txt += "SUP: [b]NA[/b] ";
                                        }


                                        if (this.InfoSticker_IsInstalled == true) {
                                            var _IS = window.InfoSticker.Base.$$instance;
                                            txt += "[/quote][quote][u]Tib cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false)) + "/h[/b][/u] [u]Cry cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false)) + "/h[/b][/u] [u]Pow cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false)) + "/h[/b][/u][hr][u]Res cont : [b]" + _IS.formatNumbersCompact(ClientLib.Base.Resource.GetResourceGrowPerHour(c.get_CityCreditsProduction())) + "/h[/b][/u][/quote]";
                                        } else {
                                            txt += "[/quote][quote][u]Tib cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + "/h[/b][/u] [u]Cry cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + "/h[/b][/u] [u]Pow cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + "/h[/b][/u][/quote]";
                                        }
                                        txt += "--" + "[b][coords]" + c.get_PosX() + ":" + c.get_PosY() + ":" + c.get_Name() + "[/b][/coords]";
                                        txt += "[hr]";
                                    }
                                }
                                inputField.value += txt + "[/quote]";

                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "2") {
                                // player bases info to share with others

                                var apc = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d; //all player cities
                                var playername = ClientLib.Data.MainData.GetInstance().get_Player().get_Name();
                                var num = 0;
                                var txt = "",
                                    c, unitData, bh, supp, type, df;
                                txt += "[quote=" + playername + "]";
                                for (var key in apc) {
                                    num++;
                                    if ((num > 10) && (num <= 20)) {
                                        c = apc[key];
                                        txt += "[quote]Def: [b]" + ('0' + c.get_LvlDefense().toFixed(2)).slice(-5) + "[/b] ";
                                        txt += "Off: [b]" + ('0' + c.get_LvlOffense().toFixed(2)).slice(-5) + "[/b] ";
                                        unitData = c.get_CityBuildingsData();
                                        bh = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard);
                                        df = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
                                        supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Ion);
                                        if (supp === null)
                                            supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Art);
                                        if (supp === null)
                                            supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Air);
                                        if (bh !== null) {
                                            txt += "CY: [b]" + bh.get_CurrentLevel() + "[/b] ";
                                            //txt += "[u]BaseRep:[/u] [b]" + (c.get_CityBuildingsData().GetFullRepairTime() / 3600).toFixed(2) + "h[/b] ";
                                            //txt += "[u]DefRep:[/u] [b]" + (c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense) / 3600).toFixed(2) + "h[/b] ";
                                        }
                                        if (df !== null) {
                                            txt += "DF: [b]" + df.get_CurrentLevel() + "[/b] ";
                                        } else {
                                            txt += "DF: [b]NA[/b] ";
                                        }
                                        if (supp !== null) {
                                            txt += "" + supp.get_TechGameData_Obj().dn.slice(0, 3) + ": [b]" + supp.get_CurrentLevel() + "[/b] ";
                                        } else {
                                            txt += "SUP: [b]NA[/b] ";
                                        }


                                        if (this.InfoSticker_IsInstalled == true) {
                                            var _IS = window.InfoSticker.Base.$$instance;
                                            txt += "[/quote][quote][u]Tib cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false)) + "/h[/b][/u] [u]Cry cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false)) + "/h[/b][/u] [u]Pow cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false)) + "/h[/b][/u][hr][u]Res cont : [b]" + _IS.formatNumbersCompact(ClientLib.Base.Resource.GetResourceGrowPerHour(c.get_CityCreditsProduction())) + "/h[/b][/u][/quote]";
                                        } else {
                                            txt += "[/quote][quote][u]Tib cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + "/h[/b][/u] [u]Cry cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + "/h[/b][/u] [u]Pow cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + "/h[/b][/u][/quote]";
                                        }
                                        txt += "--" + "[b][coords]" + c.get_PosX() + ":" + c.get_PosY() + ":" + c.get_Name() + "[/b][/coords]";
                                        txt += "[hr]";
                                    }
                                }
                                inputField.value += txt + "[/quote]";

                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "3") {
                                // player bases info to share with others

                                var apc = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d; //all player cities
                                var playername = ClientLib.Data.MainData.GetInstance().get_Player().get_Name();
                                var credits = ClientLib.Data.MainData.GetInstance().get_Player().GetCreditsCount();
                                var num = 0;
                                var txt = "",
                                    c, unitData, bh, supp, type, df;
                                txt += "[quote=" + playername + "]";
                                for (var key in apc) {
                                    num++;
                                    if ((num > 20) && (num <= 30)) {
                                        c = apc[key];
                                        txt += "[quote]Def: [b]" + ('0' + c.get_LvlDefense().toFixed(2)).slice(-5) + "[/b] ";
                                        txt += "Off: [b]" + ('0' + c.get_LvlOffense().toFixed(2)).slice(-5) + "[/b] ";
                                        unitData = c.get_CityBuildingsData();
                                        bh = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard);
                                        df = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
                                        supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Ion);
                                        if (supp === null)
                                            supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Art);
                                        if (supp === null)
                                            supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Air);
                                        if (bh !== null) {
                                            txt += "CY: [b]" + bh.get_CurrentLevel() + "[/b] ";
                                            //txt += "[u]BaseRep:[/u] [b]" + (c.get_CityBuildingsData().GetFullRepairTime() / 3600).toFixed(2) + "h[/b] ";
                                            //txt += "[u]DefRep:[/u] [b]" + (c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense) / 3600).toFixed(2) + "h[/b] ";
                                        }
                                        if (df !== null) {
                                            txt += "DF: [b]" + df.get_CurrentLevel() + "[/b] ";
                                        } else {
                                            txt += "DF: [b]NA[/b] ";
                                        }
                                        if (supp !== null) {
                                            txt += "" + supp.get_TechGameData_Obj().dn.slice(0, 3) + ": [b]" + supp.get_CurrentLevel() + "[/b] ";
                                        } else {
                                            txt += "SUP: [b]NA[/b] ";
                                        }


                                        if (this.InfoSticker_IsInstalled == true) {
                                            var _IS = window.InfoSticker.Base.$$instance;
                                            txt += "[/quote][quote][u]Tib cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false)) + "/h[/b][/u] [u]Cry cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false)) + "/h[/b][/u] [u]Pow cont : [b]" + _IS.formatNumbersCompact(c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false)) + "/h[/b][/u][hr][u]Res cont : [b]" + _IS.formatNumbersCompact(ClientLib.Base.Resource.GetResourceGrowPerHour(c.get_CityCreditsProduction())) + "/h[/b][/u][/quote]";
                                        } else {
                                            txt += "[/quote][quote][u]Tib cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + "/h[/b][/u] [u]Cry cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + "/h[/b][/u] [u]Pow cont : [b]" + c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + "/h[/b][/u][/quote]";
                                        }
                                        txt += "--" + "[b][coords]" + c.get_PosX() + ":" + c.get_PosY() + ":" + c.get_Name() + "[/b][/coords]";
                                        txt += "[hr]";
                                    }
                                }
                                inputField.value += txt + "[/quote]";

                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "N") {
                                var bases = ClientLib.Data.MainData.GetInstance().get_AllianceSupportState().get_Bases().d;
                                var base, keys = Object.keys(bases),
                                    len = keys.length,
                                    info = {},
                                    avg = 0,
                                    high = 0,
                                    supBaseCount = len;
                                while (len--) {
                                    base = bases[keys[len]];
                                    if (!info.hasOwnProperty(base.get_Type())) {
                                        info[base.get_Type()] = 0;
                                    }
                                    info[base.get_Type()]++;
                                    if (base.get_Level() >= 30)
                                        high++;
                                    avg += base.get_Level();
                                }
                                avg /= supBaseCount;
                                var members = ClientLib.Data.MainData.GetInstance().get_Alliance().get_MemberData().d,
                                    member, baseCount = 0;
                                keys = Object.keys(members);
                                len = keys.length;
                                while (len--) {
                                    member = members[keys[len]];
                                    baseCount += member.Bases;
                                }
                                inputField.value += "Bases: " + baseCount + " SupCount: " + supBaseCount + "(" + (supBaseCount / baseCount * 100).toFixed(0) + "%) Avg: " + avg.toFixed(2) + " 30+: " + high + "(" + (high / baseCount * 100).toFixed(0) + "%)";
                                //for (var i in info)
                                //  console.log("Type: " + i + " Count: " + info[i]);
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "Y") {
                                var numA = 0;
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var tibpts = pois[0].s;
                                var crypts = pois[1].s;
                                var powpts = pois[2].s;
                                var infpts = pois[3].s;
                                var vehpts = pois[4].s;
                                var airpts = pois[5].s;
                                var defpts = pois[6].s;
                                txt = "[quote=DoNotNeed]";
                                for (var key in ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()) {
                                     var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if ((poi0.t == ClientLib.Base.EPOIType.TiberiumBonus) && ((ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)/tibpts)*100 < 1)){
                                        numA++;
                                    txt += "Tib Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y +" [hr]";
                                    }
                                    if ((poi0.t == ClientLib.Base.EPOIType.CrystalBonus) && ((ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)/crypts)*100 < 1)){
                                        numA++;
                                    txt += "Cry Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  +" [hr]";
                                    }
                                    if ((poi0.t == ClientLib.Base.EPOIType.PowerBonus) && ((ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)/powpts)*100 < 1)){
                                        numA++;
                                    txt += "Pow Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  +" [hr]";
                                    }
                                    if ((poi0.t == ClientLib.Base.EPOIType.InfanteryBonus) && ((ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)/infpts)*100 < 1)){
                                        numA++;
                                    txt += "Inf Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  +" [hr]";
                                    }
                                    if ((poi0.t == ClientLib.Base.EPOIType.VehicleBonus) && ((ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)/vehpts)*100 < 1)){
                                        numA++;
                                    txt += "Veh Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  +" [hr]";
                                    }
                                    if ((poi0.t == ClientLib.Base.EPOIType.AirBonus) && ((ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)/airpts)*100 < 1)){
                                        numA++;
                                    txt += "Air Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  +" [hr]";
                                    }
                                    if ((poi0.t == ClientLib.Base.EPOIType.DefenseBonus) && ((ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)/defpts)*100 < 1)){
                                        numA++;
                                    txt += "Def Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  +" [hr]";
                                    }
                                 }
                                txt += "Total of: "+numA+" :to Drop[/quote]";
                                
                            inputField.value += txt;
                            
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "G") {
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
                                var poi = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs();
                                var tibpts = pois[0].s;
                                var nextallpts = pois[0].ns;
                                var pastallpts = pois[0].ps;
                                var allRank = pois[0].r;
                                var nextAllRank = allRank - 1;
                                var pastAllRank = allRank + 1;
                                var poiSorceHolder = new Array();
                                var num = -1;
                                var val = 0;
                                var tibmaxpts = nextscore(tibpts);
                                
                                if (this.InfoSticker_IsInstalled == true) {
                                    var _IS = window.InfoSticker.Base.$$instance;
                                    var tib = _IS.formatNumbersCompact(alliance.get_POITiberiumBonus());
                                    var tibnum = _IS.formatNumbersCompact(tibpts);
                                    var tibminnum = _IS.formatNumbersCompact(pastallpts);
                                    var tibmaxnum = _IS.formatNumbersCompact(tibmaxpts);
                                } else {
                                    var tib = alliance.get_POITiberiumBonus();
                                    var tibnum = tibpts;
                                    var tibminnum = pastallpts;
                                    var tibmaxnum = tibmaxpts;
                                }
                                
                                txt = "[quote=" + alliance.get_Abbreviation() + "sTIBProduction]";
                                txt += "Tiberium score: [b]" + tibnum + " / " + tibmaxnum + "[/b] Tiberium rank: [b]" + pois[0].r + "[/b] Tiberium Bonus: [b]" + tib + "[/b][hr]";

                                for (var key in ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if (poi0.t == ClientLib.Base.EPOIType.TiberiumBonus){
                                    txt += "Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  + " [hr]";
                                    }
                                 }

                                txt += "[quote]([i]nextRank:[/i] [b]" + nextAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(nextallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(nextallpts)) + "[/b] )[/quote][quote] ([i]pastRank:[/i] [b]" + pastAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(pastallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(pastallpts)) + "[/b])[/quote][/quote]";
                                inputField.value += txt;
                                poiSorceHolder[num] = [];
                                //}catch(e){console.log(e);}
                            
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "R") {
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
                                var poi = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs();
                                var crypts = pois[1].s;
                                var nextallpts = pois[1].ns;
                                var pastallpts = pois[1].ps;
                                var allRank = pois[1].r;
                                var nextAllRank = allRank - 1;
                                var pastAllRank = allRank + 1;
                                var poiSorceHolder = new Array();
                                var num = -1;
                                var val = 0;
                                var crymaxpts = nextscore(crypts);
                                
                                if (this.InfoSticker_IsInstalled == true) {
                                    var _IS = window.InfoSticker.Base.$$instance;
                                    var cry = _IS.formatNumbersCompact(alliance.get_POICrystalBonus());
                                    var crynum = _IS.formatNumbersCompact(crypts);
                                    var crymaxnum = _IS.formatNumbersCompact(crymaxpts);
                                } else {
                                    var cry = alliance.get_POICrystalBonus();
                                    var crynum = crypts;
                                    var crymaxnum = crymaxpts;
                                }

                                txt = "[quote=" + alliance.get_Abbreviation() + "sCryProduction]";
                                txt += " Crystal score: [b]" + crynum + " / " + crymaxnum + "[/b] Crystal rank: [b]" + pois[1].r + "[/b] Crystal Bonus: [b]" + cry + "[/b][hr]";
                                
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if (poi0.t == ClientLib.Base.EPOIType.CrystalBonus){
                                    txt += "Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  + " [hr]";
                                    }
                                }

                                txt += "[quote]([i]nextRank:[/i] [b]" + nextAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(nextallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(nextallpts)) + "[/b] )[/quote][quote] ([i]pastRank:[/i] [b]" + pastAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(pastallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(pastallpts)) + "[/b])[/quote][/quote]";
                                inputField.value += txt;
                                poiSorceHolder[num] = [];
                            
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "P") {
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
                                var poi = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs();
                                var powpts = pois[2].s;
                                var nextallpts = pois[2].ns;
                                var pastallpts = pois[2].ps;
                                var allRank = pois[2].r;
                                var nextAllRank = allRank - 1;
                                var pastAllRank = allRank + 1;
                                var poiSorceHolder = new Array();
                                var num = -1;
                                var val = 0;
                                var powmaxpts = nextscore(powpts);
                                
                                if (this.InfoSticker_IsInstalled == true) {
                                    var _IS = window.InfoSticker.Base.$$instance;
                                    var pow = _IS.formatNumbersCompact(alliance.get_POIPowerBonus());
                                    var pownum = _IS.formatNumbersCompact(powpts);
                                    var powmaxnum = _IS.formatNumbersCompact(powmaxpts);
                                } else {
                                    var pow = alliance.get_POIPowerBonus();
                                    var pownum = powpts;
                                    var powmaxnum = powmaxpts;
                                }

                                txt = "[quote=" + alliance.get_Abbreviation() + "sPowProduction]";
                                txt += " Power score: [b]" + pownum + " / " + powmaxnum + "[/b] Power rank: [b]" + pois[2].r + "[/b] Power Bonus: [b]" + pow + "[/b][hr]";
                                var poiArr = new Array();
                                var num = 0;
                                
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if (poi0.t == ClientLib.Base.EPOIType.PowerBonus){
                                    txt += "Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  + " [hr]";
                                   }
								}
                                
                                txt += "[quote]([i]nextRank:[/i] [b]" + nextAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(nextallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(nextallpts)) + "[/b] )[/quote][quote] ([i]pastRank:[/i] [b]" + pastAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(pastallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(pastallpts)) + "[/b])[/quote][/quote]";
                                inputField.value += txt;
                                poiSorceHolder[num] = [];
                            
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "I") {
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
                                var poi = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs();
                                var infpts = pois[3].s;
                                var nextallpts = pois[3].ns;
                                var pastallpts = pois[3].ps;
                                var allRank = pois[3].r;
                                var nextAllRank = allRank - 1;
                                var pastAllRank = allRank + 1;
                                var poiSorceHolder = new Array();
                                var num = -1;
                                var val = 0;
                                var infmaxpts = nextscore(infpts);
                                
                                if (this.InfoSticker_IsInstalled == true) {
                                    var _IS = window.InfoSticker.Base.$$instance;
                                    var infnum = _IS.formatNumbersCompact(infpts);
                                    var infmaxnum = _IS.formatNumbersCompact(infmaxpts);
                                } else {
                                    var infnum = infpts;
                                    var infmaxnum = infmaxpts;
                                }
                                
                                txt = "[quote=" + alliance.get_Abbreviation() + "sInfBonus]";
                                txt += "Inf score: [b]" + infnum + " / " + infmaxnum + "[/b] Inf rank: [b]" + pois[3].r + "[/b] Inf Bonus: [b]" + alliance.get_POIInfantryBonus() + "%[/b][hr]";
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if (poi0.t == ClientLib.Base.EPOIType.InfanteryBonus){
                                    txt += "Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  + " [hr]";
                                    }
								}

                                txt += "[quote]([i]nextRank:[/i] [b]" + nextAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(nextallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(nextallpts)) + "[/b] )[/quote][quote] ([i]pastRank:[/i] [b]" + pastAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(pastallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(pastallpts)) + "[/b])[/quote][/quote]";
                                inputField.value += txt;
                                poiSorceHolder[num] = [];
                            
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "C") {
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
                                var poi = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs();
                                var vehpts = pois[4].s;
                                var nextallpts = pois[4].ns;
                                var pastallpts = pois[4].ps;
                                var allRank = pois[4].r;
                                var nextAllRank = allRank - 1;
                                var pastAllRank = allRank + 1;
                                var vehmaxpts = nextscore(vehpts);
                                var poiSorceHolder = new Array();
                                var num = -1;
                                var val = 0;
                                
                                if (this.InfoSticker_IsInstalled == true) {
                                    var _IS = window.InfoSticker.Base.$$instance;
                                    var vehnum = _IS.formatNumbersCompact(vehpts);
                                    var vehmaxnum = _IS.formatNumbersCompact(vehmaxpts);
                                } else {
                                    var vehnum = vehpts;
                                    var vehmaxnum = vehmaxpts;
                                }

                                txt = "[quote=" + alliance.get_Abbreviation() + "sVehBonus]";
                                txt += " Veh score : [b]" + vehnum + " / " + vehmaxnum + "[/b] Veh rank : [b]" + pois[4].r + "[/b] Veh Bonus: [b]" + alliance.get_POIVehicleBonus() + "%[/b][hr]";
                                
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if (poi0.t == ClientLib.Base.EPOIType.VehicleBonus){
                                    txt += "Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  + " [hr]";
									}
								}

                                txt += "[quote]([i]nextRank:[/i] [b]" + nextAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(nextallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(nextallpts)) + "[/b] )[/quote][quote] ([i]pastRank:[/i] [b]" + pastAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(pastallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(pastallpts)) + "[/b])[/quote][/quote]";
                                inputField.value += txt;
                                poiSorceHolder[num] = [];
                            
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "U") {
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
                                var poi = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs();
                                var airpts = pois[5].s;
                                var nextallpts = pois[5].ns;
                                var pastallpts = pois[5].ps;
                                var allRank = pois[5].r;
                                var nextAllRank = allRank - 1;
                                var pastAllRank = allRank + 1;
                                var poiSorceHolder = new Array();
                                var num = -1;
                                var val = 0;
                                var airmaxpts = nextscore(airpts);
                                
                                if (this.InfoSticker_IsInstalled == true) {
                                    var _IS = window.InfoSticker.Base.$$instance;
                                    var airnum = _IS.formatNumbersCompact(airpts);
                                    var airmaxnum = _IS.formatNumbersCompact(airmaxpts);
                                } else {
                                    var airnum = airpts;
                                    var airmaxnum = airmaxpts;
                                }

                                txt = "[quote=" + alliance.get_Abbreviation() + "sAirBonus]";
                                txt += " Air score : [b]" + airnum + " / " + airmaxnum + "[/b] Air rank : [b]" + pois[5].r + "[/b] Air Bonus: [b]" + alliance.get_POIAirBonus() + "%[/b][hr]";
                                
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if (poi0.t == ClientLib.Base.EPOIType.AirBonus){
                                    txt += "Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  + " [hr]";
                                    }
								}
                                
                                txt += "[quote]([i]nextRank:[/i] [b]" + nextAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(nextallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(nextallpts)) + "[/b] )[/quote][quote] ([i]pastRank:[/i] [b]" + pastAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(pastallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(pastallpts)) + "[/b])[/quote][/quote]";
                                inputField.value += txt;
                                poiSorceHolder[num] = [];
                            
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "O") {
                                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                var pois = alliance.get_POIRankScore();
                                var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
                                var poi = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs();
                                var defpts = pois[6].s;
                                var nextallpts = pois[6].ns;
                                var pastallpts = pois[6].ps;
                                var allRank = pois[6].r;
                                var nextAllRank = allRank - 1;
                                var pastAllRank = allRank + 1;
                                var poiSorceHolder = new Array();
                                var num = -1;
                                var val = 0;
                                var defmaxpts = nextscore(defpts);
                                
                                if (this.InfoSticker_IsInstalled == true) {
                                    var _IS = window.InfoSticker.Base.$$instance;
                                    var defnum = _IS.formatNumbersCompact(defpts);
                                    var defmaxnum = _IS.formatNumbersCompact(defmaxpts);
                                } else {
                                    var defnum = defpts;
                                    var defmaxnum = defmaxpts;
                                }

                                txt = "[quote=" + alliance.get_Abbreviation() + "sDefBonus]";
                                txt += " Def score : [b]" + defnum + " / " + defmaxnum + "[/b] Def rank : [b]" + pois[6].r + "[/b] Def Bonus: [b]" + alliance.get_POIDefenseBonus() + "%[/b][hr]";
                                
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    if (poi0.t == ClientLib.Base.EPOIType.DefenseBonus){
                                    txt += "Level : " + poi0.l +" "+ poi0.x + ":" + poi0.y  + " [hr]";
                                    }
								 }
                                txt += "[quote]([i]nextRank:[/i] [b]" + nextAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(nextallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(nextallpts)) + "[/b] )[/quote][quote] ([i]pastRank:[/i] [b]" + pastAllRank + "[/b] [i]Their Points:[/i] [b]" + _IS.formatNumbersCompact(pastallpts) + "[/b] / [b]" + _IS.formatNumbersCompact(nextscore(pastallpts)) + "[/b])[/quote][/quote]";
                                inputField.value += txt;
                                poiSorceHolder[num] = [];
                            }
                        }
                    },

                } // members
            });
        }



        // Loading
        function TAI_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined') {
                    if (qx.core.Init.getApplication().getMenuBar() !== null) {
                        createInstance();
                        TAI.getInstance().initialize();
                    } else setTimeout(TAI_checkIfLoaded, 1000);
                } else {
                    setTimeout(TAI_checkIfLoaded, 1000);
                }
            } catch (e) {
                if (typeof console != 'undefined') {
                    console.log(e);
                } else if (window.opera) {
                    opera.postError(e);
                } else {
                    GM_log(e);
                }
            }
        }

        if (/commandandconquer\.com/i.test(document.domain)) {
            setTimeout(TAI_checkIfLoaded, 1000);
        }
    };
    // injecting, because there seem to be problems when creating game interface with unsafeWindow
    var TAIScript = document.createElement("script");
    var txt = TAI_main.toString();
    TAIScript.innerHTML = "(" + txt + ")();";
    TAIScript.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) {
        document.getElementsByTagName("head")[0].appendChild(TAIScript);
    }
})();