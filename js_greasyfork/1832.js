// ==UserScript==
// @name           C&C Tiberium Alliances Info - Updated Layout
// @author         Soera and TheStriker(OriginalAuthor) and then later... dbendure
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
// @version        1.0.14
// @downloadURL https://update.greasyfork.org/scripts/1832/CC%20Tiberium%20Alliances%20Info%20-%20Updated%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/1832/CC%20Tiberium%20Alliances%20Info%20-%20Updated%20Layout.meta.js
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
                    MemberBaseName: function(x, y, type) {
                        //input member base name

                        var top = y - 1;
                        var left = x - 1;
                        var right = x + 1;
                        var bottom = y + 1;
                        var num = -1;
                        var obj = new Array();
                        var city = ClientLib.Data.MainData.GetInstance().get_Cities();
                        //TOP :)

                        if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x, top) != undefined && type == "T") {

                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x, top)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x, top)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];
                                    if (obj[18] != undefined) {
                                        console.log(obj);
                                        return obj[18] + " [base]" + x + ":" + top + "[/base] "; //player base name = obj[17]
                                    }
                                }
                            }
                            /*if(obj[16] !== undefined){
                            	if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            		console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            		return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            	}else if((city.GetCity(member[16]).get_PlayerName() !== undefined) && (city.GetCity(member[16]).get_PlayerName() !== null)) {
                            		console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            		return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            	}
                            }*/
                        }
                        //Left :)
                        else if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, y) != undefined && type == "L") {

                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, y)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, y)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];

                                    if (obj[18] != undefined) {

                                        return obj[18] + " [base]" + left + ":" + y + "[/base] "; //player base name = obj[17]
                                    }
                                }

                            }
                            /*if(obj[16] !== undefined){
                            if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            	console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            	return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            }else if((city.GetCity(member[16]).get_PlayerName() !== undefined)) {
                            	console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            	return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            }
                            }*/
                        }
                        //Right :)
                        else if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, y) != undefined && type == "R") {
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, y)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, y)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];

                                    if (obj[18] != undefined) {

                                        return obj[18] + " [base]" + right + ":" + y + "[/base] "; //player base name = obj[17]
                                    }
                                }
                            }
                            /*if(obj[16] !== undefined){
                            if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            	console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            	return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            }else if((city.GetCity(member[16]).get_PlayerName() !== undefined)) {
                            	console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            	return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            }
                            }*/
                        }
                        //Bottom
                        else if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x, bottom) != undefined && type == "B") {
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x, bottom)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x, bottom)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];

                                    if (obj[18] != undefined) {

                                        return obj[18] + " [base]" + x + ":" + bottom + "[/base] "; //player base name = obj[17]
                                    }
                                }
                            }
                            /*if(obj[16] !== undefined){
                            	if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            	console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            	return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            }else {
                            	console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            	return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            }
                            }*/
                        }
                        //Top-Left
                        else if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, top) != undefined && type == "T-L") {
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, top)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, top)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];

                                    if (obj[18] != undefined) {

                                        return obj[18] + " [base]" + left + ":" + top + "[/base] "; //player base name = obj[17]
                                    }
                                }
                            }
                            /*if(obj[16] !== undefined){
                            if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            	console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            	return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            }else {
                            	console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            	return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            }
                            console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
					
                            }*/
                        }
                        //Top-Right :)
                        else if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, top) != undefined && type == "T-R") {
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, top)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, top)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];

                                    if (obj[18] != undefined) {

                                        return obj[18] + " [base]" + right + ":" + top + "[/base] "; //player base name = obj[17]
                                    }
                                }
                            }
                            /*if(obj[16] !== undefined){
                            if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            	console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            	return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            }else{
                            	console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            	return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            }
                            }*/
                        }
                        //Bottom-Left
                        else if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, bottom) != undefined && type == "B-L") {
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, bottom)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(left, bottom)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];

                                    if (obj[18] != undefined) {

                                        return obj[18] + " [base]" + left + ":" + bottom + "[/base] "; //player base name = obj[17]
                                    }
                                }
                            }
                            /*if(obj[16] !== undefined){
                            if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            	console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            	return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            }else  {
                            	console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            	return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            }
                            }*/
                        }
                        //Bottom-Right
                        else if (ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, bottom) != undefined && type == "B-R") {
                            //else{
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, bottom)) {
                                num++;
                                obj[num] = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(right, bottom)[key];

                                if ((num == 18) && (obj[0] == ClientLib.Data.WorldSector.ObjectType.City)) {

                                    //txt += " Member Base Name: " + obj[17];

                                    if (obj[18] != undefined) {

                                        return obj[18] + " [base]" + right + ":" + bottom + "[/base] "; //player base name = obj[17]
                                    }
                                }
                            }
                            /*console.log(obj);
                            if(obj[16] !== undefined){
                            if( (city.GetCity(obj[16]) !== undefined) && (city.GetCity(obj[16]) !== null) ){
                            	console.log(obj[16], city.GetCity(obj[16]).toString(), city.GetCity(obj[16]).get_OwnerName());
                            	return "[player]" + city.GetCity(obj[16]).get_OwnerName() + "[/player]";
                            }else {
                            	console.log(obj[16], city.GetCity(obj[16]), city.GetCity(obj[16]).get_PlayerName());
                            	return "[player]" + city.GetCity(obj[16]).get_PlayerName() + "[/player]";
                            }
                            }*/
                        }
                        /*else{
                        return "";
                        }*/
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
                            } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "G") {
                                //try{
                                //ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIRankScore()[0].s
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

                                    //var score = _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l));



                                } else {
                                    var tib = alliance.get_POITiberiumBonus();


                                    var tibnum = tibpts;


                                    var tibminnum = pastallpts;
                                    var tibmaxnum = tibmaxpts;



                                }

                                //8 field possibilities 
                                /*
			     T
			   L P R
			     B
				 For Top    X-value  0 Y-Value +1
				 For Bottom X-value  0 Y-Value -1
				 For Right  X-value +1 Y-Value  0
				 For Left   X-value -1 Y-Value  0
				 
				 For Top-Left:     X-val +1 Y-val -1
				 For Top-Right:    X-val +1 Y-val +1
				 For Bottom-Left:  X-val -1 Y-val -1
				 For Bottom-Right: X-val -1 Y-val +1
			   
				
				top = ;
				
				left = ;
				right = ;
				
				bottom = ;
				*/

                                txt = "[quote=" + alliance.get_Abbreviation() + "sTIBProduction]";
                                txt += "Tiberium score: [b]" + tibnum + " / " + tibmaxnum + "[/b] Tiberium rank: [b]" + pois[0].r + "[/b] Tiberium Bonus: [b]" + tib + "[/b]";

                                for (var key in ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()) {
                                    num++;

                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];

                                    if (ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(tibpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusTiberium) == ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(tibpts, ClientLib.Data.Ranking.ERankingType.BonusTiberium)) {

                                        var tibPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(tibpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusTiberium, pois[0].r);

                                    } else {
                                        var tibPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(tibpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusTiberium, pois[0].r + 1);
                                    }



                                    var tibPOIBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(tibpts, ClientLib.Data.Ranking.ERankingType.BonusTiberium, pois[0].r);
                                    //console.log(window.TAI.getInstance().MemberBaseName(poi0.x , poi0.y), poi0);

                                    if ((poi0.t == ClientLib.Base.EPOIType.TiberiumBonus) && (this.InfoSticker_IsInstalled == true)) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = tibpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = tibpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }


                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)) + " IfDropSc: " + _IS.formatNumbersCompact(val) + " IfDropNxtTier: " + _IS.formatNumbersCompact(nextscore(val)) + "[/quote]";



                                        if ((poi0.t == ClientLib.Base.EPOIType.TiberiumBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";

                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";
                                        }

                                    } else if ((poi0.t == ClientLib.Base.EPOIType.TiberiumBonus) && (this.InfoSticker_IsInstalled == false)) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = tibpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = tibpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }
                                        //base = window.TAI.getInstance().MemberBaseName(poi0.x , poi0.y);
                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) + " IfDropSc: " + val + " IfDropNxtTier: " + nextscore(val) + "[/quote]";
                                        /* if((tibPOILoss - tibPOIBonus) == 0 ){
				   txt += " Amount: 0/h Loss[/quote]";
				 
				   } else {
				   txt += " Amount: " +  (tibPOIBonus - tibPOILoss)  + "/h Loss[/quote]";
				   
				   }*/
                                        if ((poi0.t == ClientLib.Base.EPOIType.TiberiumBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";

                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";
                                        }

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
                                //var tibpts =  pois[0].s;
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

                                txt += " Crystal score: [b]" + crynum + " / " + crymaxnum + "[/b] Crystal rank: [b]" + pois[1].r + "[/b] Crystal Bonus: [b]" + cry + "[/b]";
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    //var base = window.TAI.getInstance().MemberBaseName(poi0.x , poi0.y);
                                    if (ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(crypts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusCrystal) == ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(crypts, ClientLib.Data.Ranking.ERankingType.BonusCrystal)) {

                                        var cryPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(crypts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusCrystal, pois[1].r);

                                    } else {
                                        var cryPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(crypts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusCrystal, pois[1].r + 1);
                                    }
                                    //var cryPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(crypts-ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) ,ClientLib.Data.Ranking.ERankingType.BonusCrystal ,pois[1].r+1);
                                    var cryPOIBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(crypts, ClientLib.Data.Ranking.ERankingType.BonusCrystal, pois[1].r);
                                    //console.log(poi0.t, poi0.l);
                                    if ((poi0.t == ClientLib.Base.EPOIType.CrystalBonus) && ((this.InfoSticker_IsInstalled == true))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = crypts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = crypts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }


                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)) + " IfDropSc: " + _IS.formatNumbersCompact(val) + " IfDropNxtTier: " + _IS.formatNumbersCompact(nextscore(val)) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.CrystalBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
                                    } else if ((poi0.t == ClientLib.Base.EPOIType.CrystalBonus) && ((this.InfoSticker_IsInstalled == false))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = crypts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = crypts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }

                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) + " IfDropSc: " + val + " IfDropNxtTier: " + nextscore(val) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.CrystalBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";
                                        }

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
                                //var tibpts =  pois[0].s;
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

                                txt += " Power score: [b]" + pownum + " / " + powmaxnum + "[/b] Power rank: [b]" + pois[2].r + "[/b] Power Bonus: [b]" + pow + "[/b]";
                                var poiArr = new Array();
                                var num = 0;
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    var base = window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y);
                                    if (ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(powpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusPower) == ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(powpts, ClientLib.Data.Ranking.ERankingType.BonusPower)) {

                                        var powPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(powpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusPower, pois[2].r);

                                    } else {
                                        var powPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(powpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusPower, pois[2].r + 1);
                                    }
                                    //var powPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(powpts-ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) ,ClientLib.Data.Ranking.ERankingType.BonusPower ,pois[2].r+1);
                                    var powPOIBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(powpts, ClientLib.Data.Ranking.ERankingType.BonusPower, pois[2].r);
                                    //console.log(poi0.t, poi0.l);
                                    if ((poi0.t == ClientLib.Base.EPOIType.PowerBonus) && ((this.InfoSticker_IsInstalled == true))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = powpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = powpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }


                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)) + " IfDropSc: " + _IS.formatNumbersCompact(val) + " IfDropNxtTier: " + _IS.formatNumbersCompact(nextscore(val)) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.PowerBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
                                    } else if ((poi0.t == ClientLib.Base.EPOIType.PowerBonus) && ((this.InfoSticker_IsInstalled == false))) {

                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = powpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = powpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }

                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) + " IfDropSc: " + val + " IfDropNxtTier: " + nextscore(val) + "[/quote]";


                                        if ((poi0.t == ClientLib.Base.EPOIType.PowerBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
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
                                //var tibpts =  pois[0].s;
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

                                txt += "Inf score: [b]" + infnum + " / " + infmaxnum + "[/b] Inf rank: [b]" + pois[3].r + "[/b] Inf Bonus: [b]" + alliance.get_POIInfantryBonus() + "%[/b]";
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    var base = window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y);
                                    if (ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(infpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusInfantry) == ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(infpts, ClientLib.Data.Ranking.ERankingType.BonusInfantry)) {
                                        var infPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(infpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusInfantry, pois[3].r);
                                    } else {
                                        var infPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(infpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusInfantry, pois[3].r + 1);
                                    }
                                    //var infPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(infpts-ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) ,ClientLib.Data.Ranking.ERankingType.BonusInfantry ,pois[3].r+1);
                                    var infPOIBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(infpts, ClientLib.Data.Ranking.ERankingType.BonusInfantry, pois[3].r + 1);
                                    //console.log(poi0.t, poi0.l);
                                    if ((poi0.t == ClientLib.Base.EPOIType.InfanteryBonus) && ((this.InfoSticker_IsInstalled == true))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = infpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = infpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }


                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)) + " IfDropSc: " + _IS.formatNumbersCompact(val) + " IfDropNxtTier: " + _IS.formatNumbersCompact(nextscore(val)) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.InfanteryBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
                                    } else if ((poi0.t == ClientLib.Base.EPOIType.InfanteryBonus) && ((this.InfoSticker_IsInstalled == false))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = infpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = infpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }
                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) + " IfDropSc: " + val + " IfDropNxtTier: " + nextscore(val) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.InfanteryBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
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

                                txt += " Veh score : [b]" + vehnum + " / " + vehmaxnum + "[/b] Veh rank : [b]" + pois[4].r + "[/b] Veh Bonus: [b]" + alliance.get_POIVehicleBonus() + "%[/b]";
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    var base = window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y);
                                    if (ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(vehpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusVehicles) == ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(vehpts, ClientLib.Data.Ranking.ERankingType.BonusVehicles)) {
                                        var vehPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(vehpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusVehicles, pois[4].r);
                                    } else {
                                        var vehPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(vehpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusVehicles, pois[4].r + 1);
                                    }
                                    //var vehPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(vehpts-ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) ,ClientLib.Data.Ranking.ERankingType.BonusVehicles ,pois[4].r+1);
                                    var vehPOIBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(vehpts, ClientLib.Data.Ranking.ERankingType.BonusVehicles, pois[4].r);
                                    //console.log(poi0.t, poi0.l);
                                    if ((poi0.t == ClientLib.Base.EPOIType.VehicleBonus) && ((this.InfoSticker_IsInstalled == true))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = vehpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = vehpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }


                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)) + " IfDropSc: " + _IS.formatNumbersCompact(val) + " IfDropNxtTier: " + _IS.formatNumbersCompact(nextscore(val)) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.VehicleBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
                                    } else if ((poi0.t == ClientLib.Base.EPOIType.VehicleBonus) && ((this.InfoSticker_IsInstalled == false))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = vehpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = vehpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }
                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) + " IfDropSc: " + val + " IfDropNxtTier: " + nextscore(val) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.VehicleBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
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

                                txt += " Air score : [b]" + airnum + " / " + airmaxnum + "[/b] Air rank : [b]" + pois[5].r + "[/b] Air Bonus: [b]" + alliance.get_POIAirBonus() + "%[/b]";
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    var base = window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y);
                                    if (ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(airpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusAircraft) == ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(airpts, ClientLib.Data.Ranking.ERankingType.BonusAircraft)) {
                                        var airPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(airpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusAircraft, pois[5].r);
                                    } else {
                                        var airPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(airpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusAircraft, pois[5].r + 1);
                                    }
                                    //var airPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(airpts-ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) ,ClientLib.Data.Ranking.ERankingType.BonusAircraft ,pois[5].r+1);
                                    var airPOIBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(airpts, ClientLib.Data.Ranking.ERankingType.BonusAircraft, pois[5].r);
                                    //console.log(poi0.t, poi0.l);
                                    if ((poi0.t == ClientLib.Base.EPOIType.AirBonus) && ((this.InfoSticker_IsInstalled == true))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = airpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = airpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }


                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)) + " IfDropSc: " + _IS.formatNumbersCompact(val) + " IfDropNxtTier: " + _IS.formatNumbersCompact(nextscore(val)) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.AirBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
                                    } else if ((poi0.t == ClientLib.Base.EPOIType.AirBonus) && ((this.InfoSticker_IsInstalled == false))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = airpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = airpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }
                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) + " IfDropSc: " + val + " IfDropNxtTier: " + nextscore(val) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.AirBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
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

                                txt += " Def score : [b]" + defnum + " / " + defmaxnum + "[/b] Def rank : [b]" + pois[6].r + "[/b] Def Bonus: [b]" + alliance.get_POIDefenseBonus() + "%[/b]";
                                for (var key in poi) {
                                    num++;
                                    var poi0 = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];
                                    var base = window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y);
                                    if (ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(defpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusDefense) == ClientLib.Base.PointOfInterestTypes.GetBoostsByScore(defpts, ClientLib.Data.Ranking.ERankingType.BonusDefense)) {
                                        var defPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(defpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusDefense, pois[6].r);
                                    } else {
                                        var defPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(defpts - ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l), ClientLib.Data.Ranking.ERankingType.BonusDefense, pois[6].r + 1);;
                                    }
                                    //var defPOILoss = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(defpts-ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) ,ClientLib.Data.Ranking.ERankingType.BonusDefense ,pois[6].r+1);
                                    var defPOIBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBoostsByScoreByRanking(defpts, ClientLib.Data.Ranking.ERankingType.BonusDefense, pois[6].r);
                                    //console.log(poi0.t, poi0.l);
                                    if ((poi0.t == ClientLib.Base.EPOIType.DefenseBonus) && ((this.InfoSticker_IsInstalled == true))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = defpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = defpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }


                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + _IS.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l)) + " IfDropSc: " + _IS.formatNumbersCompact(val) + " IfDropNxtTier: " + _IS.formatNumbersCompact(nextscore(val)) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.DefenseBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
                                    } else if ((poi0.t == ClientLib.Base.EPOIType.DefenseBonus) && ((this.InfoSticker_IsInstalled == false))) {
                                        poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l);
                                        if (num >= 0) {
                                            if (num == 0) {
                                                val = defpts - poiSorceHolder[num];
                                            } else if (num >= 1) {
                                                val = defpts - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                    return (previousValue + currentValue);
                                                });
                                            }

                                        }
                                        txt += "[quote]Level : " + poi0.l + " [coords]" + poi0.x + ":" + poi0.y + "[/coords]" + " Score: " + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi0.l) + " IfDropSc: " + val + " IfDropNxtTier: " + nextscore(val) + "[/quote]";

                                        if ((poi0.t == ClientLib.Base.EPOIType.DefenseBonus)) {
                                            txt += "[quote] [b]Member Base:[/b] [quote]";
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "T-L");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-R");
                                            }
                                            if ((window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L") != undefined)) {
                                                txt += window.TAI.getInstance().MemberBaseName(poi0.x, poi0.y, "B-L");
                                            }
                                            txt += "[/quote][/quote][hr]";

                                        }
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
