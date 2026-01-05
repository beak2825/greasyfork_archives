// ==UserScript==
// @name        CnC:TA Crucial Script Base Info
// @version      1.0.38
// @minGMVer     1.14
// @minFFVer     26
// @namespace   AllYourBasesBelong2UsCNCTAPlayerInfo
// @description Automatically sends your off/def of main base to the CiC every hour for better management.
// @author      Debitosphere
// @homepage    http://www.allyourbasesbelong2us.com
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_updatingEnabled
// @grant       unsafeWindow
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/16905/CnC%3ATA%20Crucial%20Script%20Base%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/16905/CnC%3ATA%20Crucial%20Script%20Base%20Info.meta.js
// ==/UserScript==

(function (){

	var CrucialBaseInfo_main =  function() {
	try {

        } catch (e) {
            console.log("createCrucialBaseInfo: ", e);
        }

	function SD(){

	//console.log("Starting SD Function");
	var WorldID = ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId();
	if (WorldID == 334){
	var SCUpdateChecker;
	var undertaker;
    SCUpdateChecker = localStorage.SCUpdateChecker;
	//SCUpdateChecker && JSON.parse(SCUpdateChecker);
	var CrucialScriptUpdateChecker = SCUpdateChecker;
	//console.log(undertaker + "CrucialScriptUpdateChecker = " + CrucialScriptUpdateChecker );		
	if (!Date.now) {
		Date.now = function() { return new Date().getTime(); };
	}
	var CurrrentDate = Date.now() / 1000 | 0;
	//console.log("CurrrentDate = " + CurrrentDate);
	if (typeof(CrucialScriptUpdateChecker) == "undefined"){
			//console.log("Assigning Current Time to Empty Variable");
			SCUpdateChecker = CurrrentDate;
			CrucialScriptUpdateChecker = CurrrentDate;
			//var data = JSON.stringify(SCUpdateChecker);
            localStorage.SCUpdateChecker = SCUpdateChecker;
			//console.log("Assigned Current Time to Empty Variable");
	}

	var CSDater = CurrrentDate - CrucialScriptUpdateChecker;
	//console.log("CurrrentDate = " + CurrrentDate + "CrucialScriptUpdateChecker = " + CrucialScriptUpdateChecker);
	if (CSDater >= 2700){
		SCUpdateChecker = CurrrentDate;
		CrucialScriptUpdateChecker = CurrrentDate;
			var data = JSON.stringify(SCUpdateChecker);
            localStorage.SCUpdateChecker = data;
		//console.log("Updated Variable to Current Time");
			var WorldName = ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
			var AllianceID = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id();
			var AllianceName = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Name();
			var PlayerID = ClientLib.Data.MainData.GetInstance().get_Player().get_Id();
			var PlayerName = ClientLib.Data.MainData.GetInstance().get_Player().get_Name();
			var BaseOff = 0;
			var BaseDef = 0;
			var ResearchLeft;
			var currentBaseOff = 0;
			var Prod_Power = 0;
			var Prod_Tiberium = 0;
			var Prod_Credits = 0;
			var Prod_Crystal = 0;
			var BaseRT = 0;
			var repairCharge = 0;
			
			var Bases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
			for (var selectedBaseID in Bases) {
				if (!Bases.hasOwnProperty(selectedBaseID)) {
					continue;
				}

            var selectedBase = Bases[selectedBaseID];
            if (selectedBase === undefined) {
                throw new Error('can not find the base: ' + selectedBaseID);
            }
			
				Prod_Power = Prod_Power + selectedBase.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + selectedBase.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);
				Prod_Tiberium = Prod_Tiberium + selectedBase.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + selectedBase.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium);
				Prod_Crystal = Prod_Crystal + selectedBase.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + selectedBase.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal);
				Prod_Credits = Prod_Credits + ClientLib.Base.Resource.GetResourceGrowPerHour(selectedBase.get_CityCreditsProduction(), false) + ClientLib.Base.Resource.GetResourceBonusGrowPerHour(selectedBase.get_CityCreditsProduction(), false);
			
			currentBaseOff = selectedBase.get_LvlOffense();
			if (currentBaseOff > 0){
								
				if (currentBaseOff > BaseOff){
					BaseDef = selectedBase.get_LvlDefense();
					BaseOff = selectedBase.get_LvlOffense();
					BaseRT = selectedBase.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);
					BaseRT = ClientLib.Vis.VisMain.FormatTimespan(BaseRT);
				}
			}
			}
		        var player = ClientLib.Data.MainData.GetInstance().get_Player();
				var playerRank = player.get_OverallRank();
                var PlayerFaction = player.get_Faction();
				switch (player.get_Faction()) {
							case ClientLib.Base.EFactionType.GDIFaction:
								var playerFactionD = "GDI";
								break;
							case ClientLib.Base.EFactionType.NODFaction:
								var playerFactionD = "NOD";
								break;
							}

				var PlayerFaction = player.get_Faction();				
                var McvR = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, PlayerFaction);
                var PlayerResearch = player.get_PlayerResearch();
				var PlayerCP = player.GetCommandPointCount();
                var MCVNext = PlayerResearch.GetResearchItemFomMdbId(McvR);
				var nextLevelInfo = MCVNext.get_NextLevelInfo_Obj();
                var resourcesNeeded = [];
                for (var i in nextLevelInfo.rr) {
                  if (nextLevelInfo.rr[i].t > 0) {
                    resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
                  }
                }
                var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
                var currentResearchPoints = player.get_ResearchPoints();
				XY = 100 / researchNeeded;
				XYX = currentResearchPoints;
				PercentageOfResearchPoints = XYX * XY;
              if (PerforceChangelist >= 387751) { //new
                ResearchLeft = phe.cnc.gui.util.Numbers.formatNumbersCompact(researchNeeded - currentResearchPoints);
              } else { //old
                ResearchLeft = webfrontend.gui.Util.formatNumbersCompact(researchNeeded - currentResearchPoints);
              }
                var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
                var creditsResourceData = player.get_Credits();
                var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                var creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;
			
			var MCVTime = ClientLib.Vis.VisMain.FormatTimespan(creditTimeLeftInHours * 60 * 60);
			var MainOffense = BaseOff;
			var MainDefense = BaseDef;
			
			Prod_Power = phe.cnc.gui.util.Numbers.formatNumbersCompact(Prod_Power);
			Prod_Tiberium = phe.cnc.gui.util.Numbers.formatNumbersCompact(Prod_Tiberium);
			Prod_Crystal = phe.cnc.gui.util.Numbers.formatNumbersCompact(Prod_Crystal);
			Prod_Credits = phe.cnc.gui.util.Numbers.formatNumbersCompact(Prod_Credits);
			PlayerCP = PlayerCP.toFixed(0)
			PlayerFaction = playerFactionD;
			
			//console.log("Player CP = " + PlayerCP);
			if (PlayerName === "") {

		    } else {

				var xmlhttp = new XMLHttpRequest();
                	var url = "https://www.allyourbasesbelong2us.com/DbService/Service.php";
                	var params = "functionname=SavePIRecord&PlayerID="+PlayerID+"&WorldID="+WorldID+"&WorldName="+WorldName+"&AllianceID="+AllianceID+"&AllianceName="+AllianceName+"&PlayerName="+PlayerName+"&MainOffense="+MainOffense+"&MainDefense="+MainDefense+"&MCVTime="+MCVTime+"&ResearchLeft="+ResearchLeft+"&Prod_Power="+Prod_Power+"&Prod_Tiberium="+Prod_Tiberium+"&Prod_Credits="+Prod_Credits+"&Prod_Crystal="+Prod_Crystal+"&PlayerFaction="+PlayerFaction+"&BaseRT="+BaseRT+"&playerRank="+playerRank+"&PlayerCP="+PlayerCP;

	                xmlhttp.open("POST", url, false);
        	        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        	        xmlhttp.onreadystatechange = function ()
		        {
		            if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
		            {
		                 //return_data= eval(xmlhttp.responseText);
		            }
		        };
		        xmlhttp.send(params);		
			}
	} else {
		//console.log("Update aborted...too early... " + CSDater);
	}
	}
	window.setTimeout(SD2, 120 * 1000);

	}
			
		function SD2(){
			window.setTimeout(SD2, 600 * 1000);
		}
		
		function CrucialBaseInfo_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
					window.setTimeout(SD, 30 * 1000)
					window.setTimeout(CrucialBaseInfo_checkIfLoaded, 900000);					
            } else {
                    window.setTimeout(CrucialBaseInfo_checkIfLoaded, 60000);
                }
            } catch (e) {
                console.log("CrucialBaseInfo_checkIfLoaded: ", e);
            }
		}

        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(CrucialBaseInfo_checkIfLoaded, 60000);
        }
    }
    try
    {
        var CrucialBaseInfoScript = document.createElement("script");
        CrucialBaseInfoScript.innerHTML = "(" + CrucialBaseInfo_main.toString() + ")();";
        CrucialBaseInfoScript.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(CrucialBaseInfoScript);
        }
    } catch (e) {
        console.log("CrucialScript: init error: ", e);
    }
})();