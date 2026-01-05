// ==UserScript==
// @name           C&C Tiberium Alliances PvP/PvE Ranking, POI Holding and split base kill score.
// @author         ViolentVin, KRS_L, YiannisS
// @description    Shows PvP/PvE Ranking of the players alliance in the PlayerWindow, also adds POIs the Player holds and splits pve/pvp score. 
// @namespace      pvp_rank_mod
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant          none
// @version        1.7.3
// @downloadURL https://update.greasyfork.org/scripts/1936/CC%20Tiberium%20Alliances%20PvPPvE%20Ranking%2C%20POI%20Holding%20and%20split%20base%20kill%20score.user.js
// @updateURL https://update.greasyfork.org/scripts/1936/CC%20Tiberium%20Alliances%20PvPPvE%20Ranking%2C%20POI%20Holding%20and%20split%20base%20kill%20score.meta.js
// ==/UserScript==

(function () {
    var PvpRankMod_main = function () {
  		var allianceId = null;
   		var allianceName = null;
   		var button = null;
   		var general = null;
   		var memberCount = null;
   		var playerInfoWindow = null;
   		var playerName = null;
   		var pvpHighScoreLabel = null;
        var poiTableLabel = null;
   		var rowData = null;
   		var tabView = null;
        var pData = null;
  		var dataTable = null;
		var pvpScoreLabel = null;
		var pveScoreLabel = null;
        var Bname = null;
        var Olv = null;
        var Dlv = null;
        var Blv = null;
        var Slv = null;
        var Cylev = null;
        var Dflev = null;
		var tableModel = null;
		var atableModel = null;
        var levelData = null;
		var baseCoords = null;
		var rowData1 = null;
        var pois = null;
        var rowData2 = [];

          
        function CreateMod() {
            try {
                console.log('PvP/PvE Ranking Mod + POI + Base Levels Loaded.');
                var tr = qx.locale.Manager.tr;
                playerInfoWindow = webfrontend.gui.info.PlayerInfoWindow.getInstance();
                if (PerforceChangelist >= 436669) { // 15.3 patch
					var eventType = "cellTap";
					general = playerInfoWindow.getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0];
				} else { //old
					var eventType = "cellClick";
					general = playerInfoWindow.getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0];
				}
                tabView = playerInfoWindow.getChildren()[0];
                playerName = general.getChildren()[1];

                allianceName = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Name();
                // New PvP Ranking Tab-page
                var pvpRankingTab = new qx.ui.tabview.Page("Ranking");
                pvpRankingTab.setLayout(new qx.ui.layout.Canvas());
                pvpRankingTab.setPaddingTop(6);
                pvpRankingTab.setPaddingLeft(8);
                pvpRankingTab.setPaddingRight(10);
                pvpRankingTab.setPaddingBottom(8);
                // Label PvP Ranking
                pvpHighScoreLabel = new qx.ui.basic.Label("PvP and PvE for Alliance: ").set({
                    textColor: "text-value",
                    font: "font_size_13_bold"
                });
                pvpRankingTab.add(pvpHighScoreLabel);
 
                // Table to show the PvP Scores of each player
                dataTable = new webfrontend.data.SimpleColFormattingDataModel().set({
                    caseSensitiveSorting: false
                });
                dataTable.setColumns(["Name", "PvP", "PvE"], ["name", "pve", "pvp"]);
                dataTable.setColFormat(0, "<div style=\"cursor:pointer;color:" + webfrontend.gui.util.BBCode.clrLink + "\">", "</div>");
                var pvpTable = new webfrontend.gui.widgets.CustomTable(dataTable);
                pvpTable.addListener("eventType", playerInfo, this);
                var columnModel = pvpTable.getTableColumnModel();
                columnModel.setColumnWidth(0, 200);
                columnModel.setColumnWidth(1, 80);
                columnModel.setColumnWidth(2, 80);
                columnModel.setDataCellRenderer(0, new qx.ui.table.cellrenderer.Html());
                pvpTable.setStatusBarVisible(false);
                pvpTable.setColumnVisibilityButtonVisible(false);
                pvpRankingTab.add(pvpTable, {
                    left: 0,
                    top: 25,
                    right: 0,
                    bottom: 0
                });
                // Add Tab page to the PlayerInfoWindow
                tabView.add(pvpRankingTab);
                
                // POI Tab
                var poiTab = new qx.ui.tabview.Page("POI");
				poiTab.setLayout(new qx.ui.layout.Canvas());
				poiTab.setPaddingTop(6);
				poiTab.setPaddingLeft(8);
				poiTab.setPaddingRight(10);
				poiTab.setPaddingBottom(8);
                poiTableLabel = new qx.ui.basic.Label("Player sits on these POIs").set({
                    textColor: "text-value",
                    font: "font_size_13_bold"
                });
                poiTab.add(poiTableLabel);
				tableModel = new webfrontend.data.SimpleColFormattingDataModel().set({
					caseSensitiveSorting: false
				});
				tableModel.setColumns([tr("POI Type"), tr("Level"), tr("Score"), tr("Coordinates"), tr("Base Name")], ["t", "l", "s", "c", "basen"]);
				tableModel.setColFormat(3, "<div style=\"cursor:pointer;color:" + webfrontend.gui.util.BBCode.clrLink + "\">", "</div>");
				var poiTable = new webfrontend.gui.widgets.CustomTable(tableModel);
				//poiTable.addListener("eventType", centerCoords, this);
				var columnModel = poiTable.getTableColumnModel();
				columnModel.setColumnWidth(0, 190);
				columnModel.setColumnWidth(1, 45);
				columnModel.setColumnWidth(2, 80);
				columnModel.setColumnWidth(3, 80);
				columnModel.setColumnWidth(4, 200);                
				columnModel.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Html());
                //columnModel.getDataCellRenderer(1).setUseAutoAlign(true);
				columnModel.getDataCellRenderer(2).setUseAutoAlign(false);
				poiTable.setStatusBarVisible(false);
				poiTable.setColumnVisibilityButtonVisible(true);
				poiTab.add(poiTable, {
					left: 0,
					top: 25,
					right: 0,
					bottom: 0
				});
				tabView.add(poiTab);

                // Alliance POIs Tab
                var apoiTab = new qx.ui.tabview.Page("Alliance POIs");
				apoiTab.setLayout(new qx.ui.layout.Canvas());
				apoiTab.setPaddingTop(6);
				apoiTab.setPaddingLeft(8);
				apoiTab.setPaddingRight(10);
				apoiTab.setPaddingBottom(8);
                var apoiTableLabel = new qx.ui.basic.Label("Alliance members are holding the following POIs").set({
                    textColor: "text-value",
                    font: "font_size_13_bold"
                });
                apoiTab.add(apoiTableLabel);
				atableModel = new webfrontend.data.SimpleColFormattingDataModel().set({
					caseSensitiveSorting: false
				});
				atableModel.setColumns([tr("POI Type"), tr("Level"), tr("Score"), tr("Coordinates"), tr("Player Name"), tr("Base Name")], ["t", "l", "s", "c", "p", "basen"]);
				atableModel.setColFormat(3, "<div style=\"cursor:pointer;color:" + webfrontend.gui.util.BBCode.clrLink + "\">", "</div>");
				atableModel.setColFormat(4, "<div style=\"cursor:pointer;color:" + webfrontend.gui.util.BBCode.clrLink + "\">", "</div>");
                var apoiTable = new webfrontend.gui.widgets.CustomTable(atableModel);
				//apoiTable.addListener("eventType", centerCoords, this);
				var columnModel = apoiTable.getTableColumnModel();
				columnModel.setColumnWidth(0, 190);
				columnModel.setColumnWidth(1, 45);
				columnModel.setColumnWidth(2, 80);
				columnModel.setColumnWidth(3, 80);
                columnModel.setColumnWidth(4, 130);
				columnModel.setColumnWidth(5, 115);                
				columnModel.getDataCellRenderer(2).setUseAutoAlign(false);
                columnModel.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Html());
				columnModel.setDataCellRenderer(4, new qx.ui.table.cellrenderer.Html());
				apoiTable.setStatusBarVisible(false);
				apoiTable.setColumnVisibilityButtonVisible(true);
				apoiTab.add(apoiTable, {
					left: 0,
					top: 25,
					right: 0,
					bottom: 5
				});
				tabView.add(apoiTab);
                
                // Levels Tab
                var levelTab = new qx.ui.tabview.Page("Base Levels");
				levelTab.setLayout(new qx.ui.layout.Canvas());
				levelTab.setPaddingTop(6);
				levelTab.setPaddingLeft(8);
				levelTab.setPaddingRight(10);
				levelTab.setPaddingBottom(8);

				levelData = new webfrontend.data.SimpleColFormattingDataModel().set({
					caseSensitiveSorting: false
				});
                levelData.setColumns(["Name", "Lvl", "DL", "OL", "SW", "CY", "DF"], ["Bname", "Blv", "Dlv", "Olv", "Slv", "Cylev", "Dflev"]);
                levelData.setColFormat(0, "<div style=\"cursor:pointer;color:" + webfrontend.gui.util.BBCode.clrLink + "\">", "</div>");
				var levelTable = new webfrontend.gui.widgets.CustomTable(levelData);
				levelTable.addListener("eventType", centerCoords, this);

				var columnlModel = levelTable.getTableColumnModel();
				columnlModel.setColumnWidth(0, 180);
				columnlModel.setColumnWidth(1, 70);
				columnlModel.setColumnWidth(2, 70);
				columnlModel.setColumnWidth(3, 70);
				columnlModel.setColumnWidth(4, 70);
				columnlModel.setColumnWidth(5, 70);
				columnlModel.setColumnWidth(6, 70);
				columnlModel.setDataCellRenderer(0, new qx.ui.table.cellrenderer.Html());
				columnlModel.getDataCellRenderer(2).setUseAutoAlign(false);
				levelTable.setStatusBarVisible(false);
				levelTable.setColumnVisibilityButtonVisible(false);
				levelTab.add(levelTable, {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				});
				tabView.add(levelTab);
                
                
                var pvpLabel = new qx.ui.basic.Label("- PvP:");
				pvpScoreLabel = new qx.ui.basic.Label("").set({
					textColor: "text-value",
					font: "font_size_13_bold"
				});
				general.add(pvpLabel, {
					row: 3,
					column: 3
				});
				general.add(pvpScoreLabel, {
					row: 3,
					column: 4
				});

				var pveLabel = new qx.ui.basic.Label("- PvE:");
				pveScoreLabel = new qx.ui.basic.Label("").set({
					textColor: "text-value",
					font: "font_size_13_bold"
				});
				general.add(pveLabel, {
					row: 4,
					column: 3
				});
				general.add(pveScoreLabel, {
					row: 4,
					column: 4
				});

                
                // Hook up callback when another user has been selected
                playerInfoWindow.addListener("close", onPlayerInfoWindowClose, this);
                playerName.addListener("changeValue", onPlayerChanged, this);

            } catch (e) {
                console.log("CreateMod: ", e);
            }
        }

        function playerInfo(e) {
			try {
                var pname = dataTable.getRowData(e.getRow())[0];
                if (e.getColumn() == 0) {
                    webfrontend.gui.util.BBCode.openPlayerProfile(pname);
                }    
			} catch (e) {
				console.log("PlayerName: ", e);
			}
		}

        function centerCoords(e) {
			try {
				var poiCoord = tableModel.getRowData(e.getRow())[3].split(":");
				if (e.getColumn() == 3) webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(Number(poiCoord[0]), Number(poiCoord[1]));
			} catch (e) {
				console.log("centerCoords: ", e);
			}
		}
        
        function baseinfos(e){
            try {
                var Cylv = null;
                var Cylev = null;
                var Dflv = null;
                var Dflev = null;
                var Slev = null;
                var aC = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                //console.log("aC =", ClientLib.Data.Cities().get_Cities());
                var pData = [];
                for (var sBID in aC) {
                    if (!aC.hasOwnProperty(sBID)) {
                        continue;
                    }
                    var sBase = aC[sBID];
                    if (sBase === undefined) {
                        throw new Error('unable to find base: ' + sBID);
                    }
                    var unitlData = sBase.get_CityBuildingsData();
                    Cylv = unitlData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard);
                    Dflv = unitlData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
                    Slev = unitlData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Ion);
                    if (Slev === null)
                        Slev = unitlData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Art);
                    if (Slev === null)
                        Slev = unitlData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Air);
                    if ( Cylv !== null) {
                        Cylev = Cylv.get_CurrentLevel();
                    }
                    if (Dflv !== null) {
                        Dflev = Dflv.get_CurrentLevel();
                    }
                    if (Slev !== null) {
                        Slv = Slev.get_TechGameData_Obj().dn.slice(0, 3) + " : " + Slev.get_CurrentLevel();
                    }
                    Bname = sBase.get_Name();
                    if (typeof Bname === 'string') {
                        Bname.replace(/\./g, '');
                    }
                    Blv = sBase.get_LvlBase();
                    Dlv = ('0' + sBase.get_LvlDefense().toFixed(2)).slice(-5);
                    Olv = ('0' + sBase.get_LvlOffense().toFixed(2)).slice(-5);
                    pData.push([Bname, Blv, Dlv, Olv, Slv, Cylev, Dflev]);
                }
                levelData.setData(pData);
                levelData.sortByColumn(3, false);
            } catch (e) {
                console.log("baseinfos: ", e);
            }
        }
        // Callback GetPublicPlayerInfoByName
        // [bde] => Forgotten Bases Destroyed
        // [d] => Player Bases Destroyed
        // [n] => Player Name
        function onPlayerInfoReceived(context, data) {
            try {
                var memberName = data.n;
                var pvp = data.d;
                var pve = data.bde;
                
                // Add player Base Levels.
                var tt = baseinfos();
                var abases = data.c;
                var abaseCoords = new Object();
                for (var i in abases) {
                   var abase = abases[i];
                   abaseCoords[i] = new Object();
                   abaseCoords[i]["x"] = abase.x;
                   abaseCoords[i]["y"] = abase.y;
                   abaseCoords[i]["n"] = abase.n;
                }
                for (var k in pois) {
                    var apoi = pois[k];
                    for (var j in abaseCoords) {
                        var distanceX = Math.abs(abaseCoords[j].x - apoi.x);
                        var distanceY = Math.abs(abaseCoords[j].y - apoi.y);
                        if (distanceX > 2 || distanceY > 2) continue;
                        if (distanceX == 2 && distanceY == 2) continue;
                        var aname = phe.cnc.gui.util.Text.getPoiInfosByType(apoi.t).name;
                        var alevel = apoi.l;
                        var ascore = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(apoi.l);
                        var acoords = phe.cnc.gui.util.Numbers.formatCoordinates(apoi.x, apoi.y);
                        var abasen = abaseCoords[j].n;
                        rowData2.push([aname, alevel, ascore, acoords, memberName, abasen]);
                        break;
                    }
                }
             
                // Add player with its PvP/PvE score.
                rowData.push([memberName, pvp, pve]);

                if (rowData.length == memberCount) {
                    // Show Alliance name in label.
                    pvpHighScoreLabel.setValue("PvP and PvE for Alliance: " + data.an);

                    dataTable.setData(rowData);
                    dataTable.sortByColumn(1, false);
                }
            } catch (e) {
                console.log("onPlayerInfoReceived: ", e);
            }
        }
      
        // GetPublicAllianceInfo Callback
        // [m] => Member Array
        // (
        //    [0] => Array
        //            [n] => Name
        // )
        // [mc]  => Member Count
        function onAllianceInfoReceived(context, data) {
            try {
   				rowData1 = [];
				pois = data.opois;
                for (var k in pois) {
					var poi = pois[k];
					for (var j in baseCoords) {
                        var distanceX = Math.abs(baseCoords[j].x - poi.x);
						var distanceY = Math.abs(baseCoords[j].y - poi.y);
						if (distanceX > 2 || distanceY > 2) continue;
						if (distanceX == 2 && distanceY == 2) continue;
						var name = phe.cnc.gui.util.Text.getPoiInfosByType(poi.t).name;
						var level = poi.l;
						var score = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi.l);
						var coords = phe.cnc.gui.util.Numbers.formatCoordinates(poi.x, poi.y);
                        var basen = baseCoords[j].n; 
						rowData1.push([name, level, score, coords, basen]);
						break;
					}
				}
				tableModel.setData(rowData1);
				tableModel.sortByColumn(0, true);  
                // Clear
                rowData = [];
                dataTable.setData(rowData);

                var members = data.m;
                memberCount = data.mc;

                for (var i in members) {
                    var member = members[i];

                    // For Each member (player); Get the PvP/PvE Score
                    if (member.n.length > 0) {
                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfoByName", {
                            name: member.n
                        }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onPlayerInfoReceived), null);
                    }
                }
                atableModel.setData(rowData2);
                atableModel.sortByColumn(0, true);
            } catch (e) {
                console.log("onAllianceInfoReceived: ", e);
            }
        }

        function onPlayerAllianceIdReceived(context, data) {
            try {
                // No need to recreate the RankingPage when player is member of same alliance
                if (data.a != allianceId) {
                    allianceId = data.a;
                    // Show Alliance name in label.
                    pvpHighScoreLabel.setValue("PvP and PvE for alliance: " + data.an + "     (loading plz wait)");

                    // Get Alliance MembersList
                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicAllianceInfo", {
                        id: allianceId
                    }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onAllianceInfoReceived), null);
                    pvpScoreLabel.setValue((data.bd - data.bde).toString());
                    pveScoreLabel.setValue(data.bde.toString());
                    var bases = data.c;
                    baseCoords = new Object();
                    for (var i in bases) {
                        var base = bases[i];
                        baseCoords[i] = new Object();
                        baseCoords[i]["x"] = base.x;
                        baseCoords[i]["y"] = base.y;
                        baseCoords[i]["n"] = base.n;
                    }
                    
                    rowData1 = [];
                    var pois = data.opois;
                    for (var k in pois) {
                        var poi = pois[k];
                        for (var j in baseCoords) {
                            var distanceX = Math.abs(baseCoords[j].x - poi.x);
                            var distanceY = Math.abs(baseCoords[j].y - poi.y);
                            if (distanceX > 2 || distanceY > 2) continue;
                            if (distanceX == 2 && distanceY == 2) continue;
                            var name = phe.cnc.gui.util.Text.getPoiInfosByType(poi.t).name;
                            var level = poi.l;
                            var score = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi.l);
                            var coords = phe.cnc.gui.util.Numbers.formatCoordinates(poi.x, poi.y);
                            var basen = baseCoords[j].n; 
                            rowData1.push([name, level, score, coords, basen]);
                            break;
                        }
                    }
                    tableModel.setData(rowData1);
                    tableModel.sortByColumn(0, true);
                }
                else {
                    pvpScoreLabel.setValue((data.bd - data.bde).toString());
                    pveScoreLabel.setValue(data.bde.toString());
                    var bases = data.c;
                    baseCoords = new Object();
                    for (var i in bases) {
                        var base = bases[i];
                        baseCoords[i] = new Object();
                        baseCoords[i]["x"] = base.x;
                        baseCoords[i]["y"] = base.y;
                        baseCoords[i]["n"] = base.n;
                    }
                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicAllianceInfo", {
                        id: data.a
                    }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onAllianceInfoReceived), null);
                    rowData1 = [];
                    var pois = data.opois;
                    for (var k in pois) {
                        var poi = pois[k];
                        for (var j in baseCoords) {
                            var distanceX = Math.abs(baseCoords[j].x - poi.x);
                            var distanceY = Math.abs(baseCoords[j].y - poi.y);
                            if (distanceX > 2 || distanceY > 2) continue;
                            if (distanceX == 2 && distanceY == 2) continue;
                            var name = phe.cnc.gui.util.Text.getPoiInfosByType(poi.t).name;
                            var level = poi.l;
                            var score = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(poi.l);
                            var coords = phe.cnc.gui.util.Numbers.formatCoordinates(poi.x, poi.y);
                            var basen = baseCoords[j].n; 
                            rowData1.push([name, level, score, coords, basen]);
                            break;
                        }
                    }
                    tableModel.setData(rowData1);
                    tableModel.sortByColumn(0, true);
                }
            } catch (e) {
                console.log("onPlayerAllianceIdReceived: ", e);
            }
        }


        function onPlayerChanged() {
            try {
                // Get Players AllianceId 
                if (playerName.getValue().length > 0) {
                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfoByName", {
                        name: playerName.getValue()
                    }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onPlayerAllianceIdReceived), null);
                }
                rowData2 = [];
            } catch (e) {
                console.log("onPlayerChanged: ", e);
            }
        }



        function onPlayerInfoWindowClose() {
            try {
                console.log("onPlayerinfoWindowClose");
   				pvpScoreLabel.setValue("");
				pveScoreLabel.setValue("");
				tableModel.setData([]);
                //dataTable.setData([]);
            } catch (e) {
                console.log("onPlayerInfoWindowClose: ", e);
            }
        }

        function PvpRankMod_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined' && typeof qx.locale !== 'undefined' && typeof qx.locale.Manager !== 'undefined') {
                    if (ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders() !== null && ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders().l.length != 0) {
                        CreateMod();
                    } else {
                        window.setTimeout(PvpRankMod_checkIfLoaded, 1000);
                    }
                } else {
                    window.setTimeout(PvpRankMod_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("PvpRankMod_checkIfLoaded: ", e);
            }
        }

        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(PvpRankMod_checkIfLoaded, 1000);
        }
    };

    try {
        var PvpRankMod = document.createElement("script");
        PvpRankMod.innerHTML = "(" + PvpRankMod_main.toString() + ")();";
        PvpRankMod.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(PvpRankMod);
        }
    } catch (e) {
        console.log("PvpRankMod: init error: ", e);
    }
})();
