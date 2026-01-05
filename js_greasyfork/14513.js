// ==UserScript==
// @name        Flunik Tools reloaded
// @namespace   FlunikTools reloaded
// @description Windowed variant, Base Upgrade info and POI info
// @version     4.4.7
// @author      dbendure, KRS_L, Flunik, Towser
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/14513/Flunik%20Tools%20reloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/14513/Flunik%20Tools%20reloaded.meta.js
// ==/UserScript==

//change meaning the increase, the difference between pre and post upgarde
 //cost, change and time until.
(function() {
    var FlunikTools_main = function() {
        try {
            function CCTAWrapperIsInstalled() {
                return (typeof(CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
            }

            function createFlunikTools() {
                console.log('FLUNIKTOLS createFlunikTools');

                qx.Class.define("FlunikTools.Main", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {
                        AutoUpdateButton: null,
                        cmdButton: null,
                        autoUpdateHandleAll: null,
                        composite: null,
                        tabView: null,
                        tabViewA: null,
                        tabViewB: null,
                        page1: null,
                        win: null,
                        //checkGB : null,
                        groupBoxA: null,
                        groupBoxB: null,
                        groupBoxC: null,
                        groupBoxD: null,
                        checkBoxA: null,
						upChBx: null,
						upChBxRef: null,
						upChBxPow: null,
						upChBxHarTib: null,
						upChBxHarCry: null,
						upChBxSil: null,
						upChBxPow: null,
						upChBxSup: null,
						upChBxCmd: null,
						upChBxRt: null,
						upChBxOff: null,
						upChBxDef: null,
						upChBxFullBasePro: null,

                        checkBoxB: null,
                        checkBoxC: null,
                        cityPage: null,
                        cmdB: null,
                        textfield: null,
                        tableModel: null,
                        table: null,
                        poiRows: null,
                        createRandomRows: null,
						arrA: [],
						arrB: [],
						arrC: [],
						arrD: [],
						arrE: [],
						arrF: [],
						arrG: [],
						UpgradeArr: [],







                        initialize: function() {


                            console.log('FLUNIKTOLS initialize');



                            win = new qx.ui.window.Window("First Window");
							
                            win.setWidth(100);
                            win.setHeight(100);
							win.setResizable(true, true, true, true);
                            win.setShowMinimize(false);
                            win.setLayout(new qx.ui.layout.VBox());
                            //////////////////////////////////////////////////////////
                            composite = new qx.ui.container.Composite();
                            composite.setLayout(new qx.ui.layout.Basic());
                            ////////////////////////////////////////////////////////////////



                            // table model
                            tableModel = new qx.ui.table.model.Simple();
                            //tableModel.setColumns([ "ID", "Type", "Level", "Score" ]);
                            if (this.poiRows() != null) {
                                this.poiRows();
                            }
                            tableModelA = new qx.ui.table.model.Simple();
                            tableModelA.setColumns(["baseName", "Name", "toLevel", "x", "y", "Ratio", "Time", "Date"]);
							
                            // make second column editable
                            //tableModel.setColumnEditable(1, true);
							tableModelB = new qx.ui.table.model.Simple();
                            tableModelB.setColumns(["nextScore()","Score", "poiScore", "Level", "x", "y"]);
							
							tableModelC = new qx.ui.table.model.Simple();
                            tableModelC.setColumns(["nextScore()","Score", "poiScore", "Level", "x", "y"]);
							
							tableModelD = new qx.ui.table.model.Simple();
                            tableModelD.setColumns(["nextScore()","Score", "poiScore", "Level", "x", "y"]);
							
							tableModelE = new qx.ui.table.model.Simple();
                            tableModelE.setColumns(["nextScore()","Score", "poiScore", "Level", "x", "y"]);
							
							tableModelF = new qx.ui.table.model.Simple();
                            tableModelF.setColumns(["nextScore()","Score", "poiScore", "Level", "x", "y"]);
							
							tableModelG = new qx.ui.table.model.Simple();
                            tableModelG.setColumns(["nextScore()","Score", "poiScore", "Level", "x", "y"]);
							
							tableModelH = new qx.ui.table.model.Simple();
                            tableModelH.setColumns(["nextScore()","Score", "poiScore", "Level", "x", "y"]);

                            // table
                            var table = new qx.ui.table.Table(tableModel).set({
                                decorator: null,
                                Padding: 1,
								height: 300,
                                //width: 300

                            });
                            var tableA = new qx.ui.table.Table(tableModelA).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
							tableA.setColumnWidth(3, 12);
							tableA.setColumnWidth(4, 12);
							tableA.setColumnWidth(6, 75);
							//tableA.setColumnWidth(7, 50);
							var tableB = new qx.ui.table.Table(tableModelB).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
							
							var tableC = new qx.ui.table.Table(tableModelC).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
							
							var tableD = new qx.ui.table.Table(tableModelD).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
							var tableE = new qx.ui.table.Table(tableModelE).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
							
							var tableF = new qx.ui.table.Table(tableModelF).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
							
							var tableG = new qx.ui.table.Table(tableModelG).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
							
							var tableH = new qx.ui.table.Table(tableModelH).set({
                                decorator: null,
                                Padding: 1,
                                height: 200,
                                width: 300

                            });
                            ////////////////////////////////////////////////////////////////
                            page2 = new qx.ui.tabview.Page("Base Upgrade");
                            page2.setLayout(new qx.ui.layout.VBox());
                            ////////////////////////////////////////////////////////////////
                            page3 = new qx.ui.tabview.Page("Poi Info");
                            page3.setLayout(new qx.ui.layout.VBox());
                            page3.add(table);
                            ////////////////////////////////////////////////////////////////
                            tabView = new qx.ui.tabview.TabView();
                            tabView.setBarPosition('left');
							//tabView.setWidth(400);
                            //tabView.setHeight(420);
                            //page2.add(tabView);
                            //////////////////////////////////////////////////////////////////
                            tabViewB = new qx.ui.tabview.TabView();
                            tabViewB.setBarPosition('left');
                            tibPage = new qx.ui.tabview.Page("Tib", "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/98abd73f92a4fb8f5f3a28a1b2a82344.png");
                            tibPage.setLayout(new qx.ui.layout.Canvas());
                            cryPage = new qx.ui.tabview.Page("Cry", "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/61f096dde442bd3be1843a0929900194.png");
                            cryPage.setLayout(new qx.ui.layout.Canvas());
                            powPage = new qx.ui.tabview.Page("Pow", "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/fa6798783e2c662ce81e861990aef03a.png");
                            powPage.setLayout(new qx.ui.layout.Canvas());
                            defPage = new qx.ui.tabview.Page("Def", "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/58f5d05df06e0f7a168de22ecd3baaf8.png");
                            defPage.setLayout(new qx.ui.layout.Canvas());
                            infPage = new qx.ui.tabview.Page("Inf", "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/2a86e68b80393142036e6b9121852555.png");
                            infPage.setLayout(new qx.ui.layout.Canvas());
                            vehPage = new qx.ui.tabview.Page("Veh", "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/fdb2ebef642e14b91439d4b152c6c401.png");
                            vehPage.setLayout(new qx.ui.layout.Canvas());
                            airPage = new qx.ui.tabview.Page("Air", "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/b8735956fb36d35b16faf087bbcbd293.png");
                            airPage.setLayout(new qx.ui.layout.Canvas());
                            tabViewB.add(tibPage);
                            tabViewB.add(cryPage);
                            tabViewB.add(powPage);
                            tabViewB.add(defPage);
                            tabViewB.add(infPage);
                            tabViewB.add(vehPage);
                            tabViewB.add(airPage);
                            page3.add(tabViewB);

                            //////////////////////////////////////////////////////////////////
                            tabViewA = new qx.ui.tabview.TabView();
                            tabViewA.setBarPosition('top');
                            tabViewA.add(page2);
                            tabViewA.add(page3);
                            //////////////////////////////////////////////////////////////////
                            page1 = new qx.ui.tabview.Page("BaseName");
                            page1.setLayout(new qx.ui.layout.VBox());
                            //page1.add(new qx.ui.basic.Label("Page Content"));
                            //tabView.add(page1);
                            /////////////////////////////////////////////////////////////////
                            /*checkGB = new qx.ui.groupbox.CheckGroupBox("Label");
                            checkGB.setLayout(new qx.ui.layout.VBox());*/
                            /////////////////////////////////////////////////////////////////
                            groupBoxA = new qx.ui.groupbox.GroupBox("Buildings");
                            groupBoxA.setLayout(new qx.ui.layout.Grid());
                            groupBoxB = new qx.ui.groupbox.GroupBox("Defense");
                            groupBoxB.setLayout(new qx.ui.layout.Grid());
                            groupBoxC = new qx.ui.groupbox.GroupBox("Offence");
                            groupBoxC.setLayout(new qx.ui.layout.Grid());
                            groupBoxD = new qx.ui.groupbox.GroupBox("Base");
                            groupBoxD.setLayout(new qx.ui.layout.VBox());
                            groupBoxE = new qx.ui.groupbox.GroupBox();
                            groupBoxE.setLayout(new qx.ui.layout.VBox());
                            groupBoxF = new qx.ui.groupbox.GroupBox().set({
                                height: 300,
                                width: 600
                            });
                            groupBoxF.setLayout(new qx.ui.layout.VBox());
							groupBoxG = new qx.ui.groupbox.GroupBox("allowUpgrade filter Options");
                            groupBoxG.setLayout(new qx.ui.layout.Grid());
                            //////////////////////////////////////////////////////////////////
                            
							
                            /*checkBoxCy = new qx.ui.form.CheckBox("Construction_Yard");
                            checkBoxRe = new qx.ui.form.CheckBox("Refinery");
                            checkBoxPp = new qx.ui.form.CheckBox("PowerPlant");
                            checkBoxCc = new qx.ui.form.CheckBox("Command_Center");
                            checkBoxDh = new qx.ui.form.CheckBox("Defense_HQ");
                            checkBoxBa = new qx.ui.form.CheckBox("Barracks");
                            checkBoxFa = new qx.ui.form.CheckBox("Factory");
                            checkBoxAi = new qx.ui.form.CheckBox("Airport");
                            checkBoxDf = new qx.ui.form.CheckBox("Defense_Facility");
                            //checkBoxA = new qx.ui.form.CheckBox(ClientLib.Base.ETechName.Research_BaseFound
                            //checkBoxA = new qx.ui.form.CheckBox(ClientLib.Base.ETechName.Harvester_Crystal
                            checkBoxHa = new qx.ui.form.CheckBox("Harvester");
                            checkBoxSai = new qx.ui.form.CheckBox("Support_Air");
                            checkBoxSio = new qx.ui.form.CheckBox("Support_Ion");
                            checkBoxSar = new qx.ui.form.CheckBox("Support_Art");
                            checkBoxSi = new qx.ui.form.CheckBox("Silo");
                            checkBoxAc = new qx.ui.form.CheckBox("Accumulator");
							
                            checkBoxB = new qx.ui.form.CheckBox("stuffB");
							
                            checkBoxC = new qx.ui.form.CheckBox("stuffC");
                            */
                            //////////////////////////////////////////////////////////////////
							checkBoxA = new qx.ui.form.CheckBox("clearAddTable");
							tibPage.add(checkBoxA, {top:0, left:"60%"});
							textfieldTibx = new qx.ui.form.TextField("Change me...");
							textfieldTiby = new qx.ui.form.TextField("Change me...");
							tibPage.add(new qx.ui.basic.Label("Xcoord"), {top:0, left:"10%"});
							tibPage.add(textfieldTibx, {top:15, left:"10%"});
							tibPage.add(new qx.ui.basic.Label("Ycoord"), {top:0, left:"30%"});
							tibPage.add(textfieldTiby, {top:15, left:"30%"});
							tibPage.add(tableB, {top:50, left: 20});
							
							checkBoxB = new qx.ui.form.CheckBox("clearAddTable");
							cryPage.add(checkBoxB, {top:0, left:"60%"});
							textfieldCryx = new qx.ui.form.TextField("Change me...");
							textfieldCryy = new qx.ui.form.TextField("Change me...");
							cryPage.add(new qx.ui.basic.Label("Xcoord"), {top:0, left:"10%"});
							cryPage.add(textfieldCryx, {top:15, left:"10%"});
							cryPage.add(new qx.ui.basic.Label("Ycoord"), {top:0, left:"30%"});
							cryPage.add(textfieldCryy, {top:15, left:"30%"});
							cryPage.add(tableC, {top:50, left: 20});
					
							checkBoxC = new qx.ui.form.CheckBox("clearAddTable");
							powPage.add(checkBoxC, {top:0, left:"60%"});
							textfieldPowx = new qx.ui.form.TextField("Change me...");
							textfieldPowy = new qx.ui.form.TextField("Change me...");
							powPage.add(new qx.ui.basic.Label("Xcoord"), {top:0, left:"10%"});
							powPage.add(textfieldPowx, {top:15, left:"10%"});
							powPage.add(new qx.ui.basic.Label("Ycoord"), {top:0, left:"30%"});
							powPage.add(textfieldPowy, {top:15, left:"30%"});
							powPage.add(tableD, {top:50, left: 20});
							
							checkBoxD = new qx.ui.form.CheckBox("clearAddTable");
							defPage.add(checkBoxD, {top:0, left:"60%"});
							textfieldDefx = new qx.ui.form.TextField("Change me...");
							textfieldDefy = new qx.ui.form.TextField("Change me...");
							defPage.add(new qx.ui.basic.Label("Xcoord"), {top:0, left:"10%"});
							defPage.add(textfieldDefx, {top:15, left:"10%"});
							defPage.add(new qx.ui.basic.Label("Ycoord"), {top:0, left:"30%"});
							defPage.add(textfieldDefy, {top:15, left:"30%"});
							defPage.add(tableE, {top:50, left: 20});
							
							checkBoxE = new qx.ui.form.CheckBox("clearAddTable");
							infPage.add(checkBoxE, {top:0, left:"60%"});
							textfieldInfx = new qx.ui.form.TextField("Change me...");
							textfieldInfy = new qx.ui.form.TextField("Change me...");
							infPage.add(new qx.ui.basic.Label("Xcoord"), {top:0, left:"10%"});
							infPage.add(textfieldInfx, {top:15, left:"10%"});
							infPage.add(new qx.ui.basic.Label("Ycoord"), {top:0, left:"30%"});
							infPage.add(textfieldInfy, {top:15, left:"30%"});
							infPage.add(tableF, {top:50, left: 20});
							
							checkBoxF = new qx.ui.form.CheckBox("clearAddTable");
							vehPage.add(checkBoxF, {top:0, left:"60%"});
							textfieldVehx = new qx.ui.form.TextField("Change me...");
							textfieldVehy = new qx.ui.form.TextField("Change me...");
							vehPage.add(new qx.ui.basic.Label("Xcoord"), {top:0, left:"10%"});
							vehPage.add(textfieldVehx, {top:15, left:"10%"});
							vehPage.add(new qx.ui.basic.Label("Ycoord"), {top:0, left:"30%"});
							vehPage.add(textfieldVehy, {top:15, left:"30%"});
							vehPage.add(tableG, {top:50, left: 20});
									
							checkBoxG = new qx.ui.form.CheckBox("clearAddTable");
							airPage.add(checkBoxG, {top:0, left:"60%"});
							textfieldAirx = new qx.ui.form.TextField("Change me...");
							textfieldAiry = new qx.ui.form.TextField("Change me...");
							airPage.add(new qx.ui.basic.Label("Xcoord"), {top:0, left:"10%"});
							airPage.add(textfieldAirx, {top:15, left:"10%"});
							airPage.add(new qx.ui.basic.Label("Ycoord"), {top:0, left:"30%"});
							airPage.add(textfieldAiry, {top:15, left:"30%"});
							airPage.add(tableH, {top:50, left: 20});
							///////////////////////////////////////////////////////////////////
                            //textfield.setLiveUpdate(true);
                            //var label = new qx.ui.basic.Label("Change me...");
                            //textfield.bind("value", label, "value");
                            /////////////////////////////////////////////////////////////////////
                            //groupBoxA.add(checkBoxCy, {row : 0, column : 0});
                            //groupBoxA.add(checkBoxRe, {row : 0, column : 1});
                            //groupBoxA.add(checkBoxPp, {row : 0, column : 2});
                            //groupBoxA.add(checkBoxCc, {row : 0, column : 3});
                            //groupBoxA.add(checkBoxDh, {row : 1, column : 0});
                            //groupBoxA.add(checkBoxBa, {row : 1, column : 1});
                            //groupBoxA.add(checkBoxFa, {row : 1, column : 2});
                            //groupBoxA.add(checkBoxAi, {row : 1, column : 3});
                            //groupBoxA.add(checkBoxDf, {row : 2, column : 0});
                            //groupBoxA.add(checkBoxHa, {row : 2, column : 1});
                            //groupBoxA.add(checkBoxSai, {row : 3, column : 1});
                            //groupBoxA.add(checkBoxSio, {row : 3, column : 2});
                            //groupBoxA.add(checkBoxSar, {row : 3, column : 0});
                            //groupBoxA.add(checkBoxSi, {row : 2, column : 2});
                            //groupBoxA.add(checkBoxAc, {row : 2, column : 3});
                            //groupBoxB.add(checkBoxB, {row : 3, column : 3});
                            //groupBoxC.add(checkBoxC, {row : 4, column : 0});
                            //groupBoxF.add(tableA);

                            groupBoxD.add(groupBoxA);
                            groupBoxD.add(groupBoxB);
                            groupBoxD.add(groupBoxC);
                            //groupBoxF.add(textfield);
                            //groupBoxF.add(label);

                            /*checkGB.add(groupBoxA);
                            checkGB.add(groupBoxB);
                            checkGB.add(groupBoxC);*/

                            page2.add(groupBoxE);
                            page2.add(tabView);
                            page2.add(tableA);
                            //page2.add(label);


                            page1.add(groupBoxD);

                            composite.add(tabViewA);

                            win.add(tabViewA);
                            //win.open();

                            /*this.getRoot().add(win, {left:20, top:20});
                            win.open();*/


                            AutoUpdateButton = new qx.ui.form.Button("Toggle Autoupdate", null).set({
                                toolTipText: "Autoupdate",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            cmdButton = new qx.ui.form.RepeatButton("command", null).set({
                                    toolTipText: "Autoupdate",
                                    width: 100,
                                    height: 40,
                                    maxWidth: 100,
                                    maxHeight: 40,
                                    appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                    center: true,
                                    firstInterval: 10000,
                                    interval: 10000,
                                    minTimer: 0,
                                    timerDecrease: 1000

                                }),

                                tibButton = new qx.ui.form.Button("Update", null).set({
                                    toolTipText: "press to refresh table",
                                    width: 100,
                                    height: 40,
                                    maxWidth: 100,
                                    maxHeight: 40,
                                    appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                    center: true
                                });

                            cryButton = new qx.ui.form.Button("Update", null).set({
                                toolTipText: "press to refresh table",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            powButton = new qx.ui.form.Button("Update", null).set({
                                toolTipText: "press to refresh table",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            defButton = new qx.ui.form.Button("Update", null).set({
                                toolTipText: "press to refresh table",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            infButton = new qx.ui.form.Button("Update", null).set({
                                toolTipText: "press to refresh table",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            vehButton = new qx.ui.form.Button("Update", null).set({
                                toolTipText: "press to refresh table",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            airButton = new qx.ui.form.Button("Update", null).set({
                                toolTipText: "press to refresh table",
                                width: 100,
                                height: 40,
                                maxWidth: 100,
                                maxHeight: 40,
                                appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                                center: true
                            });

                            table.addListener("cellTap", function(e) {
                                if (table.getFocusedRow() != null) {
                                    var x = table.getTableModel().getData()[table.getFocusedRow()][5];
                                    var y = table.getTableModel().getData()[table.getFocusedRow()][6];
                                    FlunikTools.Main.getInstance().viewPOI(x, y);
                                }
                                //webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(parseInt('554', 10), parseInt('194', 10));
                            }, this);
							
							tableA.addListener("cellTap", function(e) {
                                if (tableModelA.getRowCount() > 100) {
                                    tableModelA.removeRows(0, tableModelA.getRowCount(), true);
									this.UpgradeArr = [];
                                }
                                //webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(parseInt('554', 10), parseInt('194', 10));
                            }, this);

                            tibButton.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Tib") {
									if(checkBoxA.getValue()){
										FlunikTools.Main.getInstance().arrA = [];
										tableModelB.removeRows(0, tableModelB.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldTibx.getValue() != "Change me..." && textfieldTiby.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(0, FlunikTools.Main.getInstance().arrA, tableModelB, textfieldTibx, textfieldTiby);
									//console.log(tableModelB);
									}
									//tableModelB.setData(FlunikTools.Main.getInstance().arrA);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								

                            }, this);
							tabViewB.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Tib") {
									if(checkBoxA.getValue()){
										FlunikTools.Main.getInstance().arrA = [];
										tableModelB.removeRows(0, tableModelB.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldTibx.getValue() != "Change me..." && textfieldTiby.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(0, FlunikTools.Main.getInstance().arrA, tableModelB, textfieldTibx, textfieldTiby);
									//console.log(tableModelB);
									}
									
									
									//tableModelB.setData(FlunikTools.Main.getInstance().arrA);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								if (tabViewB.getSelection()[0].getLabel() == "Cry") {
                                    if(checkBoxB.getValue()){
										FlunikTools.Main.getInstance().arrB = [];
										tableModelC.removeRows(0, tableModelC.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldCryx.getValue() != "Change me..." && textfieldCryy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(1, FlunikTools.Main.getInstance().arrB, tableModelC, textfieldCryx, textfieldCryy);
									}
									//tableModelC.setData(FlunikTools.Main.getInstance().arrB);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								
								if (tabViewB.getSelection()[0].getLabel() == "Pow") {
                                    if(checkBoxC.getValue()){
										FlunikTools.Main.getInstance().arrC = [];
										tableModelD.removeRows(0, tableModelD.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldPowx.getValue() != "Change me..." && textfieldPowy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(2, FlunikTools.Main.getInstance().arrC, tableModelD, textfieldPowx, textfieldPowy);
									}
									//tableModelD.setData(FlunikTools.Main.getInstance().arrC);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								
								if (tabViewB.getSelection()[0].getLabel() == "Def") {
                                    if(checkBoxD.getValue()){
										FlunikTools.Main.getInstance().arrD = [];
										tableModelE.removeRows(0, tableModelE.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldDefx.getValue() != "Change me..." && textfieldDefy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(6, FlunikTools.Main.getInstance().arrD, tableModelE, textfieldDefx, textfieldDefy);
									}
									//tableModelE.setData(FlunikTools.Main.getInstance().arrD);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								
								if (tabViewB.getSelection()[0].getLabel() == "Inf") {
                                    if(checkBoxE.getValue()){
										FlunikTools.Main.getInstance().arrE = [];
										tableModelF.removeRows(0, tableModelF.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldInfx.getValue() != "Change me..." && textfieldInfy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(3, FlunikTools.Main.getInstance().arrE, tableModelF, textfieldInfx, textfieldInfy);
									}
									//tableModelF.setData(FlunikTools.Main.getInstance().arrE);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								
								if (tabViewB.getSelection()[0].getLabel() == "Veh") {
                                     if(checkBoxF.getValue()){
										FlunikTools.Main.getInstance().arrF = [];
										tableModelG.removeRows(0, tableModelG.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldVehx.getValue() != "Change me..." && textfieldVehy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(4, FlunikTools.Main.getInstance().arrF, tableModelG, textfieldVehx, textfieldVehy);
									}
									//tableModelG.setData(FlunikTools.Main.getInstance().arrF);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								
								if (tabViewB.getSelection()[0].getLabel() == "Air") {
                                    if(checkBoxG.getValue()){
										FlunikTools.Main.getInstance().arrG = [];
										tableModelH.removeRows(0, tableModelH.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldAirx.getValue() != "Change me..." && textfieldAiry.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(5, FlunikTools.Main.getInstance().arrG, tableModelH, textfieldAirx, textfieldAiry);
									}
									//tableModelH.setData(FlunikTools.Main.getInstance().arrG);
									//}
									//console.log(checkBoxA.getValue());
									
                                }
								

                            }, this);
                            tibPage.add(tibButton, {bottom:0 ,left: "41.67%"});

                            cryButton.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Cry") {
                                    if(checkBoxB.getValue()){
										FlunikTools.Main.getInstance().arrB = [];
										tableModelC.removeRows(0, tableModelC.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldCryx.getValue() != "Change me..." && textfieldCryy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(1, FlunikTools.Main.getInstance().arrB, tableModelC, textfieldCryx, textfieldCryy);
									}
									//tableModelC.setData(FlunikTools.Main.getInstance().arrB);
									//}
									//console.log(checkBoxA.getValue());
									
                                }

                            }, this);
                            cryPage.add(cryButton, {bottom:0 ,left: "41.67%"});

                            powButton.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Pow") {
                                    if(checkBoxC.getValue()){
										FlunikTools.Main.getInstance().arrC = [];
										tableModelD.removeRows(0, tableModelD.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldPowx.getValue() != "Change me..." && textfieldPowy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(2, FlunikTools.Main.getInstance().arrC, tableModelD, textfieldPowx, textfieldPowy);
									}
									//tableModelD.setData(FlunikTools.Main.getInstance().arrC);
									//}
									//console.log(checkBoxA.getValue());
									
                                }

                            }, this);
                            powPage.add(powButton, {bottom:0 ,left: "41.67%"});

                            defButton.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Def") {
                                    if(checkBoxD.getValue()){
										FlunikTools.Main.getInstance().arrD = [];
										tableModelE.removeRows(0, tableModelE.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldDefx.getValue() != "Change me..." && textfieldDefy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(6, FlunikTools.Main.getInstance().arrD, tableModelE, textfieldDefx, textfieldDefy);
									}
									//tableModelE.setData(FlunikTools.Main.getInstance().arrD);
									//}
									//console.log(checkBoxA.getValue());
									
                                }

                            }, this);
                            defPage.add(defButton, {bottom:0 ,left: "41.67%"});

                            infButton.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Inf") {
                                    if(checkBoxE.getValue()){
										FlunikTools.Main.getInstance().arrE = [];
										tableModelF.removeRows(0, tableModelF.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldInfx.getValue() != "Change me..." && textfieldInfy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(3, FlunikTools.Main.getInstance().arrE, tableModelF, textfieldInfx, textfieldInfy);
									}
									//tableModelF.setData(FlunikTools.Main.getInstance().arrE);
									//}
									//console.log(checkBoxA.getValue());
									
                                }

                            }, this);
                            infPage.add(infButton, {bottom:0 ,left: "41.67%"});

                            vehButton.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Veh") {
                                     if(checkBoxF.getValue()){
										FlunikTools.Main.getInstance().arrF = [];
										tableModelG.removeRows(0, tableModelG.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldVehx.getValue() != "Change me..." && textfieldVehy.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(4, FlunikTools.Main.getInstance().arrF, tableModelG, textfieldVehx, textfieldVehy);
									}
									//tableModelG.setData(FlunikTools.Main.getInstance().arrF);
									//}
									//console.log(checkBoxA.getValue());
									
                                }

                            }, this);
                            vehPage.add(vehButton, {bottom:0 ,left: "41.67%"});

                            airButton.addListener("click", function(e) {
                                if (tabViewB.getSelection()[0].getLabel() == "Air") {
                                    if(checkBoxG.getValue()){
										FlunikTools.Main.getInstance().arrG = [];
										tableModelH.removeRows(0, tableModelH.getRowCount(), true);
									} else {
                                    FlunikTools.Main.getInstance().poiRows();
									//if(textfieldAirx.getValue() != "Change me..." && textfieldAiry.getValue() != "Change me..."){
									FlunikTools.Main.getInstance().addNewTableOnCoords(5, FlunikTools.Main.getInstance().arrG, tableModelH, textfieldAirx, textfieldAiry);
									}
									//tableModelH.setData(FlunikTools.Main.getInstance().arrG);
									//}
									//console.log(checkBoxA.getValue());
									
                                }

                            }, this);
                            airPage.add(airButton, {bottom:0 ,left: "41.67%"});


                            cmdButton.addListener("execute", function(e) {
                                //numb = 0;
                                if (FlunikTools.Main.getInstance().autoUpdateHandleAll != null) {
                                    //numb = 0;
                                    FlunikTools.Main.getInstance().stopAutoUpdate();
									tableModelA.removeRows(0, tableModelA.getRowCount(), true);

                                    cmdButton.setLabel("cmd.OFF");
                                    //FlunikTools.Main.getInstance().clearCheckBox();

                                    //FlunikTools.Main.getInstance().NumberCount(numb);
                                } else {
                                    this.startAutoUpdate();

                                    cmdButton.setLabel("cmd.ON");

                                    //win.open();


                                }
                                //groupBoxE.add(cmdButton);
                                //page.add(new qx.ui.form.CheckBox("Reading"));
                            }, this);



                            AutoUpdateButton.addListener("click", function(e) {
                                //numb = 0;
                                if (FlunikTools.Main.getInstance().cmdB != null) {
                                    //numb = 0;
                                    FlunikTools.Main.getInstance().stopCmdAutoUpdate();
                                    AutoUpdateButton.setLabel("B.OFF");
                                    //FlunikTools.Main.getInstance().clearCheckBox();
                                    //win.close();
                                    //FlunikTools.Main.getInstance().NumberCount(numb);
                                } else {

                                    FlunikTools.Main.getInstance().cmdUpdate();
                                    AutoUpdateButton.setLabel("B.ON");
                                    //win.open();



                                }
                                if (AutoUpdateButton.getLabel() == "B.ON") {
                                    win.open();
									FlunikTools.Main.getInstance().autoUpgradeInfo();
                                    if (FlunikTools.Main.getInstance().poiRows() != null) {
                                        FlunikTools.Main.getInstance().poiRows();
                                    }
                                } else {
                                    win.close();
                                }
                                //page.add(new qx.ui.form.CheckBox("Reading"));
                            }, this);
                            groupBoxE.add(new qx.ui.basic.Label("To upgrade, turn this button on after you have set you priorites."));
							groupBoxE.add(new qx.ui.basic.Label("To clear table, turn this button off."));
							groupBoxE.add(new qx.ui.basic.Label("*Note* If the cmd button is on and you close the window the script is still running."));
							groupBoxE.add(new qx.ui.basic.Label("*Note* To reopen the window turn the toggle button off then on."))
							upChBx = new qx.ui.form.CheckBox("Upgrade");
							upChBxRef = new qx.ui.form.CheckBox("allowUpgrade Refineries");
							upChBxPow = new qx.ui.form.CheckBox("allowUpgrade Power Plants");
							upChBxHarTib = new qx.ui.form.CheckBox("allowUpgrade Tib Harvs");
							upChBxHarCry = new qx.ui.form.CheckBox("allowUpgrade Cry Harvs");
							upChBxSil = new qx.ui.form.CheckBox("allowUpgrade Silos");
							upChBxAcc = new qx.ui.form.CheckBox("allowUpgrade Accumulators");
							upChBxSup = new qx.ui.form.CheckBox("allowUpgrade Supports");
							upChBxCmd = new qx.ui.form.CheckBox("allowUpgrade Cy, Cc, Def_Hq, Def_Fac");
							upChBxRt = new qx.ui.form.CheckBox("allowUpgrade Air, Veh, Inf");
							upChBxOff = new qx.ui.form.CheckBox("allowUpgrade Offense");
							upChBxDef = new qx.ui.form.CheckBox("allowUpgrade Defense");
							upChBxFullBasePro = new qx.ui.form.CheckBox("allowUpgradeby MostProductive");

                            groupBoxE.add(cmdButton);
							//groupBoxE.add(upChBx);
							groupBoxG.add(upChBxOff, {row: 0, column: 0});
							groupBoxG.add(upChBxDef, {row: 0, column: 1});
							groupBoxG.add(upChBxFullBasePro, {row: 0, column: 2});
							groupBoxG.add(upChBxRef, {row: 1, column: 0});
							groupBoxG.add(upChBxPow, {row: 1, column: 1});
							groupBoxG.add(upChBxHarTib, {row: 1, column: 2});
							groupBoxG.add(upChBxHarCry, {row: 2, column: 0});
							groupBoxG.add(upChBxSil, {row: 2, column: 1});
							groupBoxG.add(upChBxAcc, {row: 2, column: 2});
							groupBoxG.add(upChBxSup, {row: 3, column: 0});
							groupBoxG.add(upChBxCmd, {row: 3, column: 1});
							groupBoxG.add(upChBxRt, {row: 3, column: 2});
							groupBoxE.add(groupBoxG);
                            var app = qx.core.Init.getApplication();

                            app.getDesktop().add(AutoUpdateButton, {
                                right: 120,
                                bottom: 100
                            });

                            /*if(win.isActive()){
                            	FlunikTools.Main.getInstance().startAutoUpdate();
                            } else {
                            	FlunikTools.Main.getInstance().stopAutoUpdate();
                            }*/


                        },
						
						poiScoreLevel : function (nextScore, score, scoreByLevel){
							var poiDiff = nextScore - score;
							for(var x = 0; x < 99; x++){
								var scoreFromX = scoreByLevel(x);
								if(scoreFromX >= poiDiff){
									break;
								}
							}
							return x;
							
						},
						
						addNewTableOnCoords : function(numA, Arr0, aTable, x, y){
							var arr = [];
							//var arrA = [];
							var num = 0;
							var Level = 0;
							var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
							var poiRank_Score = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIRankScore();
							if(x.getValue != "Change me..." && y.getValue() != "Change me..."){
							var x = x.getValue();
							var y = y.getValue();
							if(ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x,y) != undefined){
								var obj = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x,y);
								if(obj.Type == ClientLib.Data.WorldSector.ObjectType.PointOfInterest){
									for(var key in obj){
									arr[num] = obj[key];
									if(num == 3){
									Level = arr[num];	
									}
									num++;
									}
									var poSc = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(Level);
									var poX = x;
									var poY = y;
									
									var nxSc = poiRank_Score[numA].s + ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(Level);
									var nxTi = nextscore(nxSc);
									if(Arr0[0] != undefined){
										nxSc +=  Arr0[0][3];
										nxTi = nextscore(nxSc);
									Arr0.push([nxTi, nxSc, poSc, Level, poX, poY]);
									} else { Arr0.push([nxTi, nxSc, poSc, Level, poX, poY]);}
								}
							aTable.setData(Arr0);
							}
							}
							
						},

                        viewPOI: function(coordx, coordy) {

                            return webfrontend.gui.UtilView.centerCoordinatesOnRegionViewWindow(parseInt(coordx.toString(), 10), parseInt(coordy.toString(), 10));
                        },
						
						unitRows: function (arr, unit, type, costA, costB, cityName, typeLvl, waitTib, waitPow){
							var _this = FlunikTools.Main.getInstance();
							var date = new Date();
							if(type != "object"){
                            var unitName = unit.get_UnitGameData_Obj().dn;
							var unitTech = unit.get_UnitGameData_Obj().at;
                            var x = unit.get_CoordX();
                            var y = unit.get_CoordY();
							
							if (unitTech == ClientLib.Base.EUnitType.Infantry) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "typeLevel", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", "", ""]);
								arr.push([cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y, "", "", "", "", ""]);
								//console.log(cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, costA, waitTib, costB, waitPow, x, y);								
							}
							if (unitTech == ClientLib.Base.EUnitType.Tank) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "typeLevel", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", "", ""]);
								arr.push([cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y, "", "", "", "", ""]);
								//console.log(cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, costA, waitTib, costB, waitPow, x, y);								
							}
							if (unitTech == ClientLib.Base.EUnitType.Air) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "typeLevel", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", "", ""]);
								arr.push([cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y, "", "", "", "", ""]);
								//console.log(cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, costA, waitTib, costB, waitPow, x, y);
							}
							if (unitTech == ClientLib.Base.EUnitType.Structure) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "typeLevel", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", "", ""]);
								arr.push([cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y, "", "", "", "", ""]);
								//console.log(cityName, unitName, type, unit.get_CurrentLevel(), typeLvl, costA, waitTib, costB, waitPow, x, y);
							}
							} else {
								//                     arr,  unit,     type,          costA,          costB,    cityName,    typeLvl,    waitTib, waitPow
								 //_this.unitRows(buildArr, D_obj, "object", D_obj.basename, D_obj.unitname, D_obj.level, D_obj.posX, D_obj.posY, "");
		   //tableModelA.setColumns(["baseName", "Name", "toLevel", "x", "y", "Upgraded", "Ratio", "", "", "", "", "", "", "", "", ""]);
		   //console.log(unit);
								arr.push([costA, unit.uName, "Upgraded to "+parseInt(cityName), typeLvl, waitTib, "Ratio: "+(Math.round(waitPow*1000)/1000), date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds(),  date.getDate()+" / "+date.getMonth()+" / "+date.getFullYear()]);
							
							}
							tableModelA.setData(arr);
							
						},

                        buildingRows: function(arr, building, type, prodA, prodB, prodC, costA, costB, deltaA, deltaB, deltaC, cityName, waitTib, waitPow) {
                            var _this = FlunikTools.Main.getInstance();
                            var date = new Date();
							//_this.formatNumbersCompact();
							if(type != "object"){
								var buildingName = building.get_UnitGameData_Obj().dn;
                            var x = building.get_CoordX();
                            var y = building.get_CoordY();
							
							tableModelA.setColumns(["baseName", "Name", "Type", "Level", "ProductionA", "NewLvlDeltaA", "ProductionB", "NewLvlDeltaB", "ProductonC", "NewLvlDeltaC", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y"]);
							if (building.get_TechName() == ClientLib.Base.ETechName.Support_Art) {
								//tableModelA.setColumns(["baseName",         "Name", "Type",                       "Level", "ProductionA", "NewLvlDeltaA", "ProductionB", "NewLvlDeltaB", "ProductonC", "NewLvlDeltaC",                          "TibCost", "waitTimeA",                         "PowCost", "waitTimeB", "x", "y"]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), deltaA, prodA, "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Support_Ion) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "defLevel", "isOkLevel", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), deltaA, prodA, "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Support_Air) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "defLevel", "isOkLevel", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), deltaA, prodA, "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Defense_Facility) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "defLevel", "isOkLevel", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), deltaA, prodA, "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							
							if (building.get_TechName() == ClientLib.Base.ETechName.Airport) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "currentRT", "deltaRT", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.FormatTimespan(prodA), _this.FormatTimespan(deltaA), "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Factory) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "currentRT", "deltaRT", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.FormatTimespan(prodA), _this.FormatTimespan(deltaA), "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Barracks) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "currentRT", "deltaRT", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.FormatTimespan(prodA), _this.FormatTimespan(deltaA), "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Defense_HQ) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "allUnitNxtLvlCryCost", "allUnitNxtLvlPowCost", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.formatNumbersCompact(prodA), _this.formatNumbersCompact(deltaA), "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Command_Center) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "allUnitNxtLvlCryCost", "allUnitNxtLvlPowCost", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.formatNumbersCompact(prodA), _this.formatNumbersCompact(deltaA), "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if (building.get_TechName() == ClientLib.Base.ETechName.Construction_Yard) {
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "baseRT", "newDelta", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", "", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.FormatTimespan(prodA), _this.FormatTimespan(deltaA), "", "", "", "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							if(building.get_TechName() == ClientLib.Base.ETechName.PowerPlant){
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "PowerProduction", "NewLvlDeltaA", "CrystalProduction", "NewLvlDeltaB", "CreditProducton", "NewLvlDeltaC", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y"]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.formatNumbersCompact(prodA), _this.formatNumbersCompact(deltaA), _this.formatNumbersCompact(prodB), _this.formatNumbersCompact(deltaB), _this.formatNumbersCompact(prodC), _this.formatNumbersCompact(deltaC), _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							
							if(building.get_TechName() == ClientLib.Base.ETechName.Refinery){
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "PowerCreditProduction", "NewLvlDeltaA", "TibCreditProduction", "NewLvlDeltaB", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.formatNumbersCompact(prodA), _this.formatNumbersCompact(deltaA), _this.formatNumbersCompact(prodB), _this.formatNumbersCompact(deltaB), "",  "",_this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							
							if(building.get_TechName() == ClientLib.Base.ETechName.Harvester){
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "TibProduction", "NewLvlDeltaA", "CryProduction", "NewLvlDeltaB", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.formatNumbersCompact(prodA), _this.formatNumbersCompact(deltaA), _this.formatNumbersCompact(prodB), _this.formatNumbersCompact(deltaB), "",  "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							
							if(building.get_TechName() == ClientLib.Base.ETechName.Silo){
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "TibProduction", "NewLvlDeltaA", "CryProduction", "NewLvlDeltaB", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y", "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.formatNumbersCompact(prodA), _this.formatNumbersCompact(deltaA), _this.formatNumbersCompact(prodB), _this.formatNumbersCompact(deltaB), "",  "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							
							if(building.get_TechName() == ClientLib.Base.ETechName.Accumulator){
								//tableModelA.setColumns(["baseName", "Name", "Type", "Level", "PowerProduction", "NewLvlDelta", "TibCost", "waitTimeA", "PowCost", "waitTimeB", "x", "y",  "", "",  "", ""]);
								arr.push([cityName, buildingName, type, building.get_CurrentLevel(), _this.formatNumbersCompact(prodA), _this.formatNumbersCompact(deltaA), "",  "", "",  "", _this.formatNumbersCompact(costA), waitTib, _this.formatNumbersCompact(costB), waitPow, x, y]);
								}
							} else {
								//tableModelA.setColumns(["baseName", "Name", "toLevel", "x", "y", "Upgraded", "Ratio", "Time", "Date"]);
								arr.push([prodA, prodB, "Upgraded to "+parseInt(prodC), costA, costB, "Ratio: "+(Math.round(deltaA*1000)/1000), date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds(),  date.getDate()+" / "+(date.getMonth() + 1)+" / "+date.getFullYear()]);
							}
							
							
							
							tableModelA.setData(arr);
							
                            //rowData = [];

                        },

                        poiRows: function() {
							var _this = FlunikTools.Main.getInstance();
                            //var inputField = document.querySelector('input:focus, textarea:focus');
                            //if (inputField != null) {
                            var num = -1;
							//var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
							var nextscore = ClientLib.Base.PointOfInterestTypes.GetNextScore;
							var boostByScore = ClientLib.Base.PointOfInterestTypes.GetBoostsByScore;
							var poiRank_Score = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIRankScore();
                            var tibArr = [];
                            var rowData = [];
							var rowDataA = [];
                            var poiSorceHolder = [];
                            
                            tableModel.setColumns(["","", "", "", "", "", ""]);

                            for (var key in ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()) {

                                var obj = ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnedPOIs()[key];

                                tibArr[num] = obj;

                                //var objCoords = obj.x, obj.y;//document.write(webfrontend.gui.util.BBCode.createCoordsLinkText(obj.x, obj.y));
                                if (tabViewB.getSelection()[0].getLabel() == "Tib" && obj.t == ClientLib.Base.EPOIType.TiberiumBonus) {
                                    num++;
									//_this.poiScoreLevel(poiRank_Score[0].ns, poiRank_Score[0].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
                                    poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l);
                                    if (num >= 0) {
                                        if (num == 0) {
											var nextGetLvl = _this.poiScoreLevel(poiRank_Score[0].ns, poiRank_Score[0].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											var nextGetLvlA = _this.poiScoreLevel(nextscore(poiRank_Score[0].s), poiRank_Score[0].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											rowData.push(["Next Score", _this.formatNumbersCompact(poiRank_Score[0].ns), "", "", "", "", ""]);
											rowData.push(["Our Score", _this.formatNumbersCompact(poiRank_Score[0].s), "", "", "", "", ""]);
											rowData.push(["Past Score", _this.formatNumbersCompact(poiRank_Score[0].ps), "", "", "", "", ""]);
											rowData.push(["POIlvl for NxtScr", nextGetLvl, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvl)), "", "", "", ""]);
											rowData.push(["POIlvl for NxtTier", nextGetLvlA, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvlA)), "", "", "", ""]);
											rowData.push(["Our Rank", poiRank_Score[0].r, "", "", "", "", ""]);
											rowData.push(["Score Boost", _this.formatNumbersCompact(boostByScore(poiRank_Score[0].s,ClientLib.Data.Ranking.ERankingType.BonusTiberium)), "", "", "", "", ""]);
											rowData.push(["Boost Modifier", ClientLib.Base.PointOfInterestTypes.GetBoostModifierByRank(poiRank_Score[0].r)+"%", "", "", "", "", ""]);
											rowData.push(["nextTier(ifLost)","ifLost", "getBonus(ifLost)", "Level", "Score", "XCoord", "YCoord"]);
                                            rowData.push([_this.formatNumbersCompact(nextscore(poiRank_Score[0].s)), _this.formatNumbersCompact(poiRank_Score[0].s), _this.formatNumbersCompact(boostByScore(poiRank_Score[0].s,ClientLib.Data.Ranking.ERankingType.BonusTiberium)), "", "", "", ""]);
                                            val = poiRank_Score[0].s - poiSorceHolder[num];
                                        } else if (num >= 1) {
                                            val = poiRank_Score[0].s - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                return (previousValue + currentValue);
                                            });
                                        }

                                    }
									/*tibPage.add(new qx.ui.basic.Label("Rank : "+poiRank_Score[0].r), {top:50 ,left: "20%"});
									tibPage.add(new qx.ui.basic.Label("Next Score : "+poiRank_Score[0].ns), {top:62 ,left: "20%"});
									tibPage.add(new qx.ui.basic.Label("Our Score : "+poiRank_Score[0].s), {top:74 ,left: "20%"});
									tibPage.add(new qx.ui.basic.Label("Past Score : "+poiRank_Score[0].ps), {top:86 ,left: "20%"});
									tibPage.add(new qx.ui.basic.Label("Next Tier Score : "+nextscore(poiRank_Score[0].s)), {top:98 ,left: "20%"});*/
                                    rowData.push([_this.formatNumbersCompact(nextscore(val)), _this.formatNumbersCompact(val), _this.formatNumbersCompact(boostByScore(val, ClientLib.Data.Ranking.ERankingType.BonusTiberium)), obj.l, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l)), obj.x, obj.y]);
                                }
                                if (tabViewB.getSelection()[0].getLabel() == "Cry" && obj.t == ClientLib.Base.EPOIType.CrystalBonus) {
                                    num++;
                                    poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l);
                                    if (num >= 0) {
                                        if (num == 0) {
											var nextGetLvl = _this.poiScoreLevel(poiRank_Score[1].ns, poiRank_Score[1].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											var nextGetLvlA = _this.poiScoreLevel(nextscore(poiRank_Score[1].s), poiRank_Score[1].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											rowData.push(["Next Score", _this.formatNumbersCompact(poiRank_Score[1].ns), "", "", "", "", ""]);
											rowData.push(["Our Score", _this.formatNumbersCompact(poiRank_Score[1].s), "", "", "", "", ""]);
											rowData.push(["Past Score", _this.formatNumbersCompact(poiRank_Score[1].ps), "", "", "", "", ""]);
											rowData.push(["POIlvl for NxtScr", nextGetLvl, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvl)), "", "", "", ""]);
											rowData.push(["POIlvl for NxtTier", nextGetLvlA, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvlA)), "", "", "", ""]);
											rowData.push(["Our Rank", poiRank_Score[1].r, "", "", "", "", ""]);
											rowData.push(["Score Boost", _this.formatNumbersCompact(boostByScore(poiRank_Score[1].s,ClientLib.Data.Ranking.ERankingType.BonusCrystal)), "", "", "", "", ""]);
											rowData.push(["Boost Modifier", ClientLib.Base.PointOfInterestTypes.GetBoostModifierByRank(poiRank_Score[1].r)+"%", "", "", "", "", ""]);
											rowData.push(["nextTier(ifLost)","ifLost", "getBonus(ifLost)", "Level", "Score", "XCoord", "YCoord"]);
                                            rowData.push([_this.formatNumbersCompact(nextscore(poiRank_Score[1].s)),_this.formatNumbersCompact(poiRank_Score[1].s), _this.formatNumbersCompact(boostByScore(poiRank_Score[1].s,ClientLib.Data.Ranking.ERankingType.BonusCrystal)), "", "", "", ""]);
                                            val = poiRank_Score[1].s - poiSorceHolder[num];
                                        } else if (num >= 1) {
                                            val = poiRank_Score[1].s - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                return (previousValue + currentValue);
                                            });
                                        }

                                    }
                                    rowData.push([_this.formatNumbersCompact(nextscore(val)), _this.formatNumbersCompact(val), _this.formatNumbersCompact(boostByScore(val,ClientLib.Data.Ranking.ERankingType.BonusCrystal)), obj.l, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l)), obj.x, obj.y]);
                                }
                                if (tabViewB.getSelection()[0].getLabel() == "Pow" && obj.t == ClientLib.Base.EPOIType.PowerBonus) {
                                    num++;
                                    poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l);
                                    if (num >= 0) {
                                        if (num == 0) {
											var nextGetLvl = _this.poiScoreLevel(poiRank_Score[2].ns, poiRank_Score[2].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											var nextGetLvlA = _this.poiScoreLevel(nextscore(poiRank_Score[2].s), poiRank_Score[2].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											rowData.push(["Next Score", _this.formatNumbersCompact(poiRank_Score[2].ns), "", "", "", "", ""]);
											rowData.push(["Our Score", _this.formatNumbersCompact(poiRank_Score[2].s), "", "", "", "", ""]);
											rowData.push(["Past Score", _this.formatNumbersCompact(poiRank_Score[2].ps), "", "", "", "", ""]);
											rowData.push(["POIlvl for NxtScr", nextGetLvl, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvl)), "", "", "", ""]);
											rowData.push(["POIlvl for NxtTier", nextGetLvlA, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvlA)), "", "", "", ""]);
											rowData.push(["Our Rank", poiRank_Score[2].r, "", "", "", "", ""]);
											rowData.push(["Score Boost", _this.formatNumbersCompact(boostByScore(poiRank_Score[2].s,ClientLib.Data.Ranking.ERankingType.BonusPower)), "", "", "", "", ""]);
											rowData.push(["Boost Modifier", ClientLib.Base.PointOfInterestTypes.GetBoostModifierByRank(poiRank_Score[2].r)+"%", "", "", "", "", ""]);
											rowData.push(["nextTier(ifLost)","ifLost", "getBonus(ifLost)", "Level", "Score", "XCoord", "YCoord"]);
                                            rowData.push([_this.formatNumbersCompact(nextscore(poiRank_Score[2].s)),_this.formatNumbersCompact(poiRank_Score[2].s), _this.formatNumbersCompact(boostByScore(poiRank_Score[2].s,ClientLib.Data.Ranking.ERankingType.BonusPower)), "", "", "", ""]);
                                            val = poiRank_Score[2].s - poiSorceHolder[num];
                                        } else if (num >= 1) {
                                            val = poiRank_Score[2].s - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                return (previousValue + currentValue);
                                            });
                                        }

                                    }
                                    rowData.push([_this.formatNumbersCompact(nextscore(val)), _this.formatNumbersCompact(val),_this.formatNumbersCompact(boostByScore(val,ClientLib.Data.Ranking.ERankingType.BonusPower)), obj.l, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l)), obj.x, obj.y]);
                                }
                                if (tabViewB.getSelection()[0].getLabel() == "Inf" && obj.t == ClientLib.Base.EPOIType.InfanteryBonus) {
                                    num++;
                                    poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l);
                                    if (num >= 0) {
                                        if (num == 0) {
											var nextGetLvl = _this.poiScoreLevel(poiRank_Score[3].ns, poiRank_Score[3].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											var nextGetLvlA = _this.poiScoreLevel(nextscore(poiRank_Score[3].s), poiRank_Score[3].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											rowData.push(["Next Score", _this.formatNumbersCompact(poiRank_Score[3].ns), "", "", "", "", ""]);
											rowData.push(["Our Score", _this.formatNumbersCompact(poiRank_Score[3].s), "", "", "", ""]);
											rowData.push(["Past Score", _this.formatNumbersCompact(poiRank_Score[3].ps), "", "", "", "", ""]);
											rowData.push(["POIlvl for NxtScr", nextGetLvl, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvl)), "", "", "", ""]);
											rowData.push(["POIlvl for NxtTier", nextGetLvlA, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvlA)), "", "", "", ""]);
											rowData.push(["Our Rank", poiRank_Score[3].r, "", "", "", "", ""]);
											rowData.push(["Score Boost", _this.formatNumbersCompact(boostByScore(poiRank_Score[3].s,ClientLib.Data.Ranking.ERankingType.BonusInfantry)), "", "", "", "", ""]);
											rowData.push(["Boost Modifier", ClientLib.Base.PointOfInterestTypes.GetBoostModifierByRank(poiRank_Score[3].r)+"%", "", "", "", "", ""]);
											rowData.push(["nextTier(ifLost)","ifLost", "getBonus(ifLost)", "Level", "Score", "XCoord", "YCoord"]);
                                            rowData.push([_this.formatNumbersCompact(nextscore(poiRank_Score[3].s)), _this.formatNumbersCompact(poiRank_Score[3].s), _this.formatNumbersCompact(boostByScore(poiRank_Score[3].s,ClientLib.Data.Ranking.ERankingType.BonusInfantry)), "", "", "", ""]);
                                            val = poiRank_Score[3].s - poiSorceHolder[num];
                                        } else if (num >= 1) {
                                            val = poiRank_Score[3].s - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                return (previousValue + currentValue);
                                            });
                                        }

                                    }
                                    rowData.push([_this.formatNumbersCompact(nextscore(val)), _this.formatNumbersCompact(val), _this.formatNumbersCompact(boostByScore(val, ClientLib.Data.Ranking.ERankingType.BonusInfantry)), obj.l, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l)), obj.x, obj.y]);
                                }
                                if (tabViewB.getSelection()[0].getLabel() == "Veh" && obj.t == ClientLib.Base.EPOIType.VehicleBonus) {
                                    num++;
                                    poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l);
                                    if (num >= 0) {
                                        if (num == 0) {
											var nextGetLvl = _this.poiScoreLevel(poiRank_Score[4].ns, poiRank_Score[4].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											var nextGetLvlA = _this.poiScoreLevel(nextscore(poiRank_Score[4].s), poiRank_Score[4].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											rowData.push(["Next Score", _this.formatNumbersCompact(poiRank_Score[4].ns), "", "", "", "", ""]);
											rowData.push(["Our Score", _this.formatNumbersCompact(poiRank_Score[4].s), "", "", "", "", ""]);
											rowData.push(["Past Score", _this.formatNumbersCompact(poiRank_Score[4].ps), "", "", "", "", ""]);
											rowData.push(["POIlvl for NxtScr", nextGetLvl, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvl)), "", "", "", ""]);
											rowData.push(["POIlvl for NxtTier", nextGetLvlA, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvlA)), "", "", "", ""]);
											rowData.push(["Our Rank", poiRank_Score[4].r, "", "", "", "", ""]);
											rowData.push(["Score Boost", _this.formatNumbersCompact(boostByScore(poiRank_Score[4].s,ClientLib.Data.Ranking.ERankingType.BonusVehicles)), "", "", "", "", ""]);
											rowData.push(["Boost Modifier", ClientLib.Base.PointOfInterestTypes.GetBoostModifierByRank(poiRank_Score[4].r)+"%", "", "", "", "", ""]);
											rowData.push(["nextTier(ifLost)","ifLost", "getBonus(ifLost)", "Level", "Score", "XCoord", "YCoord"]);
                                            rowData.push([_this.formatNumbersCompact(nextscore(poiRank_Score[4].s)), _this.formatNumbersCompact(poiRank_Score[4].s), _this.formatNumbersCompact(boostByScore(poiRank_Score[4].s, ClientLib.Data.Ranking.ERankingType.BonusVehicles)), "", "", "", ""]);
                                            val = poiRank_Score[4].s - poiSorceHolder[num];
                                        } else if (num >= 1) {
                                            val = poiRank_Score[4].s - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                return (previousValue + currentValue);
                                            });
                                        }

                                    }
                                    rowData.push([_this.formatNumbersCompact(nextscore(val)),_this.formatNumbersCompact(val),_this.formatNumbersCompact(boostByScore(val, ClientLib.Data.Ranking.ERankingType.BonusVehicles)), obj.l, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l)), obj.x, obj.y]);
                                }
                                if (tabViewB.getSelection()[0].getLabel() == "Air" && obj.t == ClientLib.Base.EPOIType.AirBonus) {
                                    num++;
                                    poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l);
                                    if (num >= 0) {
                                        if (num == 0) {
											var nextGetLvl = _this.poiScoreLevel(poiRank_Score[5].ns, poiRank_Score[5].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											var nextGetLvlA = _this.poiScoreLevel(nextscore(poiRank_Score[5].s), poiRank_Score[5].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											rowData.push(["Next Score", _this.formatNumbersCompact(poiRank_Score[5].ns), "", "", "", "", ""]);
											rowData.push(["Our Score", _this.formatNumbersCompact(poiRank_Score[5].s), "", "", "", "", ""]);
											rowData.push(["Past Score", _this.formatNumbersCompact(poiRank_Score[5].ps), "", "", "", "", ""]);
											rowData.push(["POIlvl for NxtScr", nextGetLvl, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvl)), "", "", "", ""]);
											rowData.push(["POIlvl for NxtTier", nextGetLvlA, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvlA)), "", "", "", ""]);
											rowData.push(["Our Rank", poiRank_Score[5].r, "", "", "", "", ""]);
											rowData.push(["Score Boost", _this.formatNumbersCompact(boostByScore(poiRank_Score[5].s,ClientLib.Data.Ranking.ERankingType.BonusAircraft)), "", "", "", "", ""]);
											rowData.push(["Boost Modifier", ClientLib.Base.PointOfInterestTypes.GetBoostModifierByRank(poiRank_Score[5].r)+"%", "", "", "", "", ""]);
											rowData.push(["nextTier(ifLost)","ifLost", "getBonus(ifLost)", "Level", "Score", "XCoord", "YCoord"]);
                                            rowData.push([_this.formatNumbersCompact(nextscore(poiRank_Score[5].s)), _this.formatNumbersCompact(poiRank_Score[5].s), _this.formatNumbersCompact(boostByScore(poiRank_Score[5].s, ClientLib.Data.Ranking.ERankingType.BonusAircraft)), "", "", "", ""]);
                                            val = poiRank_Score[5].s - poiSorceHolder[num];
                                        } else if (num >= 1) {
                                            val = poiRank_Score[5].s - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                return (previousValue + currentValue);
                                            });
                                        }

                                    }
                                    rowData.push([_this.formatNumbersCompact(nextscore(val)), _this.formatNumbersCompact(val), _this.formatNumbersCompact(boostByScore(val, ClientLib.Data.Ranking.ERankingType.BonusAircraft)), obj.l, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l)), obj.x, obj.y]);
                                }
                                if (tabViewB.getSelection()[0].getLabel() == "Def" && obj.t == ClientLib.Base.EPOIType.DefenseBonus) {
                                    num++;
                                    poiSorceHolder[num] = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l);
                                    if (num >= 0) {
                                        if (num == 0) {
											var nextGetLvl = _this.poiScoreLevel(poiRank_Score[6].ns, poiRank_Score[6].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											var nextGetLvlA = _this.poiScoreLevel(nextscore(poiRank_Score[6].s), poiRank_Score[6].s, ClientLib.Base.PointOfInterestTypes.GetScoreByLevel);
											rowData.push(["Next Score", _this.formatNumbersCompact(poiRank_Score[6].ns), "", "", "", "", ""]);
											rowData.push(["Our Score", _this.formatNumbersCompact(poiRank_Score[6].s), "", "", "", "", ""]);
											rowData.push(["Past Score", _this.formatNumbersCompact(poiRank_Score[6].ps), "", "", "", "", ""]);
											rowData.push(["POI lvl needed", nextGetLvl, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvl)), "", "", "", ""]);
											rowData.push(["POI lvl needed", nextGetLvlA, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(nextGetLvlA)), "", "", "", ""]);
											rowData.push(["Our Rank", poiRank_Score[6].r, "", "", "", "", ""]);
											rowData.push(["Score Boost", _this.formatNumbersCompact(boostByScore(poiRank_Score[6].s,ClientLib.Data.Ranking.ERankingType.BonusDefense)), "", "", "", "", ""]);
											rowData.push(["Boost Modifier", ClientLib.Base.PointOfInterestTypes.GetBoostModifierByRank(poiRank_Score[6].r)+"%", "", "", "", "", ""]);
											rowData.push(["nextTier(ifLost)","ifLost", "getBonus(ifLost)", "Level", "Score", "XCoord", "YCoord"]);
                                            rowData.push([_this.formatNumbersCompact(nextscore(poiRank_Score[6].s)), _this.formatNumbersCompact(poiRank_Score[6].s), _this.formatNumbersCompact(boostByScore(poiRank_Score[6].s, ClientLib.Data.Ranking.ERankingType.BonusDefense)), "", "", "", ""]);
                                            val = poiRank_Score[6].s - poiSorceHolder[num];
                                        } else if (num >= 1) {
                                            val = poiRank_Score[6].s - poiSorceHolder.reduce(function(previousValue, currentValue, index, array) {
                                                return (previousValue + currentValue);
                                            });
                                        }

                                    }
                                    rowData.push([_this.formatNumbersCompact(nextscore(val)), _this.formatNumbersCompact(val), _this.formatNumbersCompact(boostByScore(val, ClientLib.Data.Ranking.ERankingType.BonusDefense)), obj.l, _this.formatNumbersCompact(ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(obj.l)), obj.x, obj.y]);
                                }
                                //num++;
                            }


                            tableModel.setData(rowData);
                            rowData = [];
                            //tableModel.setData(FlunikTools.Main.getInstance().createRandomRows(tibArr.length));
                            //return tibArr.length
                            //}
                        },

                        cityPage: function(city, num) {
                            var _this = FlunikTools.Main.getInstance();
                            var pageArr = new Array();
                            var groupBoxArrA = new Array();
                            var groupBoxArrB = new Array();
                            var groupBoxArrC = new Array();
                            var groupBoxArr = new Array();
                            //var checkBoxArr = new Array();
							
                            if (num == 0 && num >= tabView.getChildren().length) {
                                //page1.resetLabel();
                                //page1.setLabel(city.m_SupportDedicatedBaseName);
                                ////groupBoxD.resetLegend();
                                //groupBoxD.setLegend("Upgrade on this base: " + city.m_SupportDedicatedBaseName);
                                page = new qx.ui.tabview.Page(city.m_SupportDedicatedBaseName);
                                pageArr[num] = page;
                                pageArr[num].setLayout(new qx.ui.layout.VBox());
								pageArr[num].setWidth(100);

                                groupBoxArrA[num] = new qx.ui.groupbox.GroupBox("Buildings");
								//groupBoxArrA[num].changeWidth(300);
                                groupBoxArrA[num].setLayout(new qx.ui.layout.Grid());
								

                                groupBoxArrB[num] = new qx.ui.groupbox.GroupBox("Defense");
								//groupBoxArrB[num].changeWidth(300);
                                groupBoxArrB[num].setLayout(new qx.ui.layout.Grid());
								

                                groupBoxArrC[num] = new qx.ui.groupbox.GroupBox("Offense");
								//groupBoxArrC[num].changeWidth(300);
                                groupBoxArrC[num].setLayout(new qx.ui.layout.Grid());
								

                                groupBoxArr[num] = new qx.ui.groupbox.GroupBox("Click Upgrades: " + city.m_SupportDedicatedBaseName);
								//groupBoxArr[num].changeWidth(400);
                                groupBoxArr[num].setLayout(new qx.ui.layout.VBox());



                                groupBoxArr[num].add(groupBoxArrA[num]);
                                groupBoxArr[num].add(groupBoxArrB[num]);
                                groupBoxArr[num].add(groupBoxArrC[num]);
                                pageArr[num].add(groupBoxArr[num]);
                                tabView.add(pageArr[num]);
                                //console.log(num, page1.getLabel(), page1.setLabel(city.m_SupportDedicatedBaseName) );
                            }
                            if (num > 0 && num >= tabView.getChildren().length) {

                                page = new qx.ui.tabview.Page(city.m_SupportDedicatedBaseName);
                                pageArr[num] = page;
                                pageArr[num].setLayout(new qx.ui.layout.VBox());

                                groupBoxArrA[num] = new qx.ui.groupbox.GroupBox("Buildings");
                                groupBoxArrA[num].setLayout(new qx.ui.layout.Grid());

                                groupBoxArrB[num] = new qx.ui.groupbox.GroupBox("Defense");
                                groupBoxArrB[num].setLayout(new qx.ui.layout.Grid());

                                groupBoxArrC[num] = new qx.ui.groupbox.GroupBox("Offense");
                                groupBoxArrC[num].setLayout(new qx.ui.layout.Grid());

                                groupBoxArr[num] = new qx.ui.groupbox.GroupBox("Click Upgrades: " + city.m_SupportDedicatedBaseName);
                                groupBoxArr[num].setLayout(new qx.ui.layout.VBox());



                                groupBoxArr[num].add(groupBoxArrA[num]);
                                groupBoxArr[num].add(groupBoxArrB[num]);
                                groupBoxArr[num].add(groupBoxArrC[num]);
                                pageArr[num].add(groupBoxArr[num]);
                                tabView.add(pageArr[num]);
                            }

                        },
                        buildingBox(building, num, tech, arr, typeNum) {
                            var groupBoxArrA = new Array();

                            var checkBox;
                            //console.log(building, tech, num, arr);
                            if (num == 0) {
								//if(tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum] != undefined){

                                if (tech == ClientLib.Base.ETechName.Research_BaseFound) {
                                    checkBox;
                                } else if (tech == ClientLib.Base.ETechName.Construction_Yard && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 0
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Refinery && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 1
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.PowerPlant && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Command_Center && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 3
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                    //continue;
                                } else if (tech == ClientLib.Base.ETechName.Defense_HQ && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 0
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Barracks && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 1
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Factory && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Airport && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 3
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Defense_Facility && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 0
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Harvester && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 1
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Support_Air && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                    //continue;
                                } else if (tech == ClientLib.Base.ETechName.Support_Ion && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Support_Art && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Silo && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 3
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Accumulator && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 3,
                                                column: 0
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }

                                }




                            
							}
                            if (num > 0) {
                                //console.log(tabView.getSelectables()[num]);
                                if (tech == ClientLib.Base.ETechName.Research_BaseFound) {
                                    checkBox;
                                } else if (tech == ClientLib.Base.ETechName.Construction_Yard && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 0
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                    //tabView.getChildren()[num].getChildren()[0].getChildren()[0].add(new qx.ui.form.CheckBox(building), {row : 0, column : 0});
                                    //continue;
                                } else if (tech == ClientLib.Base.ETechName.Refinery && tech == arr[building]) {
                                    try {

                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 1
                                            });
                                        }



                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }


                                } else if (tech == ClientLib.Base.ETechName.PowerPlant && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Command_Center && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 0,
                                                column: 3
                                            });
                                        }
                                        //FlunikTools.Main.getInstance().plzCheckBox(num, building, typeNum);
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Defense_HQ && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 0
                                            });
                                        }
                                        //FlunikTools.Main.getInstance().plzCheckBox(num, building, typeNum);
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Barracks && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 1
                                            });
                                        }
                                        //FlunikTools.Main.getInstance().plzCheckBox(num, building, typeNum);
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Factory && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 2
                                            });
                                        }
                                        //FlunikTools.Main.getInstance().plzCheckBox(num, building, typeNum);
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Airport && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 1,
                                                column: 3
                                            });
                                        }
                                        //FlunikTools.Main.getInstance().plzCheckBox(num, building, typeNum);
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Defense_Facility && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 0
                                            });
                                        }
                                        //FlunikTools.Main.getInstance().plzCheckBox(num, building, typeNum);
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Harvester && tech == arr[building]) {
                                    try {

                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 1
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }


                                } else if (tech == ClientLib.Base.ETechName.Support_Air && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Support_Ion && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                }
                                //continue;
                                else if (tech == ClientLib.Base.ETechName.Support_Art && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 2
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                } else if (tech == ClientLib.Base.ETechName.Silo && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 2,
                                                column: 3
                                            });
                                        }
                                        //groupBoxArrA[0].add(new qx.ui.form.CheckBox(building), {row : 2, column : 3});
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }

                                } else if (tech == ClientLib.Base.ETechName.Accumulator && tech == arr[building]) {
                                    try {
                                        if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, building, typeNum) == false) {
                                            tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(building), {
                                                row: 3,
                                                column: 0
                                            });
                                        }
                                    } catch (e) {
                                        console.log("createFlunikTools: ", e);
                                    }
                                }
                            }

                        },

                        plzCheckBox: function(num, building, typeNum) {
                            var bool = false;
                            for (var key in tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren()) {

                                var obj = tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren()[key];

                                //if(obj.getLabel() == building || obj.toString() == "undefined"){
                                if (cmdButton.getLabel() == "cmd.On") {
                                    obj.setValue() = true;

                                }
                            }
                            //return bool;
                        },
						
						formatNumbersCompact: function (value, decimals) {
						  if (decimals == undefined) decimals = 2;
						  var valueStr;
						  var unit = '';
						  if (value < 1000) valueStr = value.toString();
						   else if (value < 1000 * 1000) {
							valueStr = (value / 1000).toString();
							unit = 'K';
						  } else if (value < 1000 * 1000 * 1000) {
							valueStr = (value / (1000 * 1000)).toString();
							unit = 'M';
						  } else if (value < 1000 * 1000 * 1000 * 1000){
							valueStr = (value / (1000*1000*1000)).toString();
							unit = 'G';
						  } else if(value < 1000 * 1000 * 1000 * 1000 * 1000){
							valueStr = (value / (1000*1000*1000*1000)).toString();
							unit = 'P';
						  } else if(value < 1000 * 1000 * 1000 * 1000 * 1000 * 1000){
						  valueStr = (value / (1000*1000*1000*1000*1000)).toString();
						  unit = 'E';
						  } else if(value < 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000){
						  valueStr = (value / (1000*1000*1000*1000*1000*1000)).toString();
						  unit = 'Z';
						  } else {
						  valueStr = (value / (1000*1000*1000*1000*1000*1000*1000)).toString();
						  unit = 'Y';
						  }
						  if (valueStr.indexOf('.') >= 0) {
							var whole = valueStr.substring(0, valueStr.indexOf('.'));
							if (decimals === 0) {
							  valueStr = whole;
							} else {
							  var fraction = valueStr.substring(valueStr.indexOf('.') + 1);
							  if (fraction.length > decimals) fraction = fraction.substring(0, decimals);
							  valueStr = whole + '.' + fraction;
							}
						  }
						  valueStr = valueStr + unit;
						  return valueStr;
						},
						
						FormatTimespan: function (value) {
						  var i;
						  var t = ClientLib.Vis.VisMain.FormatTimespan(value);
						  var colonCount = 0;
						  for (i = 0; i < t.length; i++) {
							if (t.charAt(i) == ':') colonCount++;
						  }
						  var r = '';
						  for (i = 0; i < t.length; i++) {
							if (t.charAt(i) == ':') {
							  if (colonCount > 2) {
								r += 'd ';
							  } else {
								r += t.charAt(i);
							  }
							  colonCount--;
							} else {
							  r += t.charAt(i);
							}
						  }
						  return r;
						},

                        isCheckBoxChecked: function(num, building, typeNum) {
                            try{
							var bool = false;
                            for (var key in tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren()) {

                                var obj = tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren()[key];

                                //if(obj.getLabel() == building || obj.toString() == "undefined"){
                                if (obj.getValue() && obj.getLabel() == building) {
                                    bool = true;

                                }
                            }
                            return bool;
							}catch(e){
								console.log("createFlunikTools: ", e);
							}
                        },
                        isCheckBoxPlaced: function(num, building, typeNum) {
                            var bool = false;
                            for (var key in tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren()) {

                                var obj = tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren()[key];

                                if (obj.getLabel() == building || obj.toString() == "undefined") {

                                    bool = true;

                                }
                            }
                            return bool;
                        },
                        clearCheckBox: function() {
                            var bool = false;
                            for (var key in tabView.getSelectables()) {
                                var piece = tabView.getSelectables()[key];
                                for (var aKey in piece.getChildren()[0].getChildren()[typeNum].getChildren()) {

                                    var obj = piece.getChildren()[0].getChildren()[aKey];

                                    if (obj.toString() != "undefined") {

                                        bool = obj.removeAll();

                                    }
                                }
                            }
                            return bool;
                        },
                        unitBox: function(unitName, num, typeNum, xNum, yNum) {
							try{
                            if (typeNum == 2) {
                                //console.log(unitName, num, typeNum, xNum, yNum);
                                if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, unitName, typeNum) == false) {
                                    tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(unitName), {
                                        row: xNum,
                                        column: yNum
                                    });
                                    //console.log(unitName, num, typeNum, xNum, yNum);
                                }
                            } else if (typeNum == 1) {
                                //console.log(unitName, num, typeNum, xNum, yNum);
                                if (FlunikTools.Main.getInstance().isCheckBoxPlaced(num, unitName, typeNum) == false) {
									//console.log("tabView.getSelectables()["+num+"].getChildren()[0].getChildren()["+typeNum+"]", tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren().length);
                                    tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].add(new qx.ui.form.CheckBox(unitName), {
                                        row: xNum,
										
                                        column: yNum
										
                                    });
                                    //console.log(unitName, num, typeNum, xNum, yNum);
                                } //else {
									//console.log("tabView.getSelectables()["+num+"].getChildren()[0].getChildren()["+typeNum+"] = ", tabView.getSelectables()[num].getChildren()[0].getChildren()[typeNum].getChildren());
								//}
                            }
							}catch(e){
								console.log("createFlunikTools: ", e);
							}

                        },

                        canUpgradeUnit: function(unit, city) {
                            var _this = FlunikTools.Main.getInstance();
                            var nextLevel = unit.get_CurrentLevel() + 1;
                            var gameDataTech = unit.get_UnitGameData_Obj();
                            var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
                            if (gameDataTech == null || unit.get_IsDamaged() || city.get_IsLocked() || !hasEnoughResources) {
                                return false;
                            }
                            var id = _this.getMainProductionBuildingMdbId(gameDataTech.pt, gameDataTech.f);
                            var building = city.get_CityBuildingsData().GetBuildingByMDBId(id);
                            if ((building == null) || (building.get_CurrentDamage() > 0)) {
                                return false;
                            }
                            var levelReq = ClientLib.Base.Util.GetUnitLevelRequirements_Obj(nextLevel, gameDataTech);
                            var reqTechIndexes = _this.getMissingTechIndexesFromTechLevelRequirement(levelReq, true, city);
                            if ((reqTechIndexes != null) && (reqTechIndexes.length > 0)) {
                                return false;
                            }
                            return true;
                        },

                        getMainProductionBuildingMdbId: function(placementType, faction) {
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

                        getMissingTechIndexesFromTechLevelRequirement: function(levelRequirements, breakAtFirst, city) {
                            var reqTechIndexes = [];
                            if (levelRequirements != null && levelRequirements.length > 0) {
                                for (var lvlIndex = 0;
                                    (lvlIndex < levelRequirements.length); lvlIndex++) {
                                    var lvlReq = levelRequirements[lvlIndex];
                                    var requirementsMet = false;
                                    var amountCounter = lvlReq.Amount;
                                    for (var buildingIndex in city.get_Buildings().d) {
                                        if (city.get_Buildings().d[buildingIndex].get_MdbBuildingId() == lvlReq.RequiredTechId && city.get_Buildings().d[buildingIndex].get_CurrentLevel() >= lvlReq.Level) {
                                            amountCounter--;
                                            if (amountCounter <= 0) {
                                                requirementsMet = true;
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

                        // Add the below function to your code and then use
                        // this.canUpgradeBuilding(building, city)
                        // instead of
                        // building.CanUpgrade()
                        //Thanks to KRS_L

                        canUpgradeBuilding: function(building, city) {
                            var nextLevel = (building.get_CurrentLevel() + 1);
                            var gameDataTech = building.get_TechGameData_Obj();
                            var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
                            return (!building.get_IsDamaged() && !city.get_IsLocked() && hasEnoughResources);
                        },

                        startAutoUpdate: function() {
                            var _this = FlunikTools.Main.getInstance();
                            //_this.win.open();
                            //_this.autoUpgrade();
                            _this.autoUpdateHandleAll = setInterval(function () {_this.autoUpgradeInfo();}, 10000);


                            //return setInterval(upgrade, _this.autoUpdateHandleAll);
                        },
                        stopAutoUpdate: function() {
                            var _this = FlunikTools.Main.getInstance();
                            clearInterval(_this.autoUpdateHandleAll);
                            _this.autoUpdateHandleAll = null;
                        },

                        cmdUpdate: function() {
                            var _this = FlunikTools.Main.getInstance();
                            //this.autoUpgrade();
                            _this.cmdB = 1;
                        },
                        stopCmdAutoUpdate: function() {
                            var _this = FlunikTools.Main.getInstance();

                            _this.cmdB = null;
                        },
						
						

                        autoUpgradeInfo: function() {
                            
                            var _this = FlunikTools.Main.getInstance();
                            var num = -1;
                            var checkBoxes = null;
							var offUnitArr = [];
							var defUnitArr = [];
                            var buildArr = [];
							var cityArr = [];
                            //_this.cityPageTab(_this.cityName(), _this.buildingName());
                            //page2.getChildren()[1].getChildren()[num] == 0;
                            for (var nCity in ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d) {
                                num++;

                                var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[nCity];
                                //console.log(city.m_SupportDedicatedBaseName);
								var cityName = city.m_SupportDedicatedBaseName;
								cityArr[cityName] = city;
								var defLvl = city.get_LvlDefense();
								var offLvl = city.get_LvlOffense();

                                try {
                                    _this.cityPage(city, num);
                                } catch (e) {
                                    console.log("error : ", e)
                                }
								
								var offcryCost = 0; 
								var offpowCostA = 0;
								var defcryCost = 0; 
								var defpowCostA = 0;
								
								var tiberiumCont = city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false);
								var tiberiumBonus = city.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium);
								var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
								var tiberiumAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
								var powerCont = city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false);
								var powerBonus = city.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);
								var powerAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
								var crystalCont = city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false);
								var crystalBonus = city.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal);
								var crystalAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
								
								var airRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
								var nextAirRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, true);
								var vehRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
								var nextVehRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, true);
								var infRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
								var nextInfRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, true);
								
								var rtArr = [];
								rtArr[0] = airRT;
								rtArr[1] = vehRT;
								rtArr[2] = infRT;
								rtArr.sort(function(a,b){return b-a});
								//console.log("air: ", airRT, "veh: ", vehRT, "inf: ", infRT, "rtArr: ", rtArr);




                                var buildings = city.get_Buildings();
                                //console.log(city);

                                var fNum = 0;
                                var B_obj = 0;
								var Acc_obj = 0;
								var Sil_obj = 0;
								var TibHar_obj = 0;
								var CryHar_obj = 0; 
								var Pow_obj = 0; 
								var Ref_obj = 0;
								var Cmd_obj = 0;
								var Sup_obj = 0; 
								var Rt_obj = 0;
                                var D_obj = 0;
                                var O_obj = 0;
                                var x = -1;
                                var y = -1;
                                var nameArr = new Array();
                                var gNum = -1;
								var proNum = -1;
								
								
								var allArr = [];
								var refArr = [];
								var powArr = [];
								var harTibArr = [];
								var harCryArr = [];
								var silArr = [];
								var accArr = [];
								var refNum = -1;
								var powNum = -1;
								var harTibNum = -1;
								var harCryNum = -1;
								var silNum = -1;
								var accNum = -1;


                                var typeArr5 = [];
                                //typeArr5[num] = new Array();

                                for (var nBuildings in buildings.d) {
                                    var aNum = -1;
                                    var bNum = -1;
                                    var cNum = -1;
                                    var dNum = -1;
                                    var eNum = -1;
									var MaxLevel = 65;

                                    var type = "";
                                    var building = buildings.d[nBuildings];
									//console.log(!_this.canUpgradeBuilding(building, city), _this.canUpgradeBuilding(building, city));
									//if (!_this.canUpgradeBuilding(building, city)) continue;

                                    var tech = building.get_TechName();
                                    var buildingName = building.get_UnitGameData_Obj().dn;
                                    nameArr[buildingName] = tech;
                                    //_this.buildingBox(buildingName, num, tech);continue;
                                    //if(num == 0){
                                    aNum = 0;
                                    //console.log(aNum, bNum, cNum, dNum, eNum);
                                    if (tech == ClientLib.Base.ETechName.Construction_Yard && building.get_CurrentLevel() < MaxLevel){// && city.get_CityBuildingsData().GetFullRepairTime(false) > 43200) {
                                       
									   _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										
										var timeTibCost = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCost = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										
										var baseRT = city.get_CityBuildingsData().GetFullRepairTime(false);
										var baseRTDelta = city.get_CityBuildingsData().GetFullRepairTime(false) - city.get_CityBuildingsData().GetFullRepairTime(true);
										//console.log(_this.FormatTimespan(baseRT),_this.FormatTimespan(baseRTDelta));
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
											//arr, building, type, prodA, prodB, prodC, costA, costB, deltaA, deltaB, deltaC, cityName, waitTib, waitPow
                                            //_this.buildingRows(buildArr, building, "CY", baseRT, 0, 0, tibCost, powCost, baseRTDelta, 0, 0,cityName, tibCanbuy, powCanbuy);
											if(upChBxCmd.getValue()){
											Cmd_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
											//_this.buildingRows(buildArr, building, type, LinkTypes0, LinkTypes1, tibCost, powCost, change, time);
                                        }
                                    } //ClientLib.Base.ETechName.Construction_Yard
                                    if (tech == ClientLib.Base.ETechName.Refinery && building.get_CurrentLevel() < MaxLevel) {
										//console.log(city.GetBuildingDetailViewInfo_ForLevelRangeDelta_HorribleStuff(building, 64));
										_this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if(upChBxFullBasePro.getValue() == false){
										if (!_this.canUpgradeBuilding(building, city)) continue;
										}
                                        gNum++;
										refNum++;
										proNum = 0;
                                        type = "Credits";
										var Delta = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].NewLvlDelta;
                                        var refPro = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].TotalValue;
                                        var refPac = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsPackageSize].TotalValue;
                                        var refPacperH = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsBonusTimeToComplete].TotalValue;
                                        var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										
										var timeTibCost = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCost = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										//console.log(buildingName, tibCanbuy, powCanbuy);
                                        
										var LinkTypes0 = 0;
                                        var LinkTypes1 = 0;
										var deltaA = 0;
										var deltaB = 0;
										var refTotalProOfLevel12 = 605 + (7260/6) + 726 + 10738 + 605; 

                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[36] != undefined) {
											var add = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.PowerplantCreditBonus].ProvidingToValue;
                                            LinkTypes0 = (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.PowerplantCreditBonus].Value) + add;
											deltaA = (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.PowerplantCreditBonus].NewLvlDelta)
                                            //var refTotalPro = refPro + (refPac/(refPacperH/3600)) +  LinkTypes0 ;
                                        } else {
                                            LinkTypes0 = 0;
											deltaA = 0;
                                        }

                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[37] != undefined) {
                                            LinkTypes1 = (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.TiberiumCreditProduction].Value);
                                            deltaB = (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.TiberiumCreditProduction].NewLvlDelta)
											//var refTotalPro = refPro + (refPac/(refPacperH/3600)) +  LinkTypes0 +  LinkTypes1  ;
                                        } else {
                                            LinkTypes1 = 0;
                                        }
										
										var refTotalPro = refPro + (refPac/(refPacperH/3600)) +  LinkTypes0 +  LinkTypes1  ;
										if(building.get_CurrentLevel() < 15){
										var refProRatio = Math.pow( ((refTotalProOfLevel12/31608)*100)/((refTotalPro/tibCost)*100), -1);
										} else {
											var refProRatio = Math.pow( ((refTotalProOfLevel12/31608)*100)/((refTotalPro/tibCost)*100), -1);
										}
										refArr[refNum] = refProRatio;
										refArr.sort(function(a,b){return b-a});
										
											
										/*if((Math.max(refProRatio) == refArr[0])){
												var Ref_obj = {
													cityid: city.get_Id(),
													basename: city.m_SupportDedicatedBaseName,
													building: building.get_UnitGameData_Obj().dn,
													buildinglevel: building.get_CurrentLevel(),
													posX: building.get_CoordX(),
													posY: building.get_CoordY(),
													isPaid: true
												}
										}*/
                                        if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                            //_this.buildingRows(buildArr, building, type, LinkTypes0, LinkTypes1, "", tibCost, powCost, deltaA, deltaB, 0,cityName, tibCanbuy, powCanbuy);
											
											if(upChBxRef.getValue() && (Math.max(refProRatio) == refArr[0])){
												allArr[proNum] = refArr;
												if(upChBxFullBasePro.getValue()){
										if (!_this.canUpgradeBuilding(building, city)) continue;
										}
											Ref_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											Ratio: refProRatio,
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
											//_this.buildingRows(buildArr, building, type, LinkTypes0, LinkTypes1, tibCost, powCost, change, time);
                                        }
                                        

                                    }
                                    if (tech == ClientLib.Base.ETechName.PowerPlant && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if(upChBxFullBasePro.getValue() == false){
										if (!_this.canUpgradeBuilding(building, city)) continue;
										}
										gNum++;
										
										powNum++;
										proNum = 1;
                                        type = "Power";
										var Delta = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].NewLvlDelta;
                                        var powPro = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].TotalValue;
                                        var powPac = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerPackageSize].TotalValue;
                                        var powPacperH = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerBonusTimeToComplete].TotalValue;
                                        var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										//console.log(buildingName, tibCanbuy, powCanbuy);
                                        var LinkTypes0 = 0;
                                        var LinkTypes1 = 0;
                                        var LinkTypes2 = 0;
                                        var powTotalProOfLevel12 = 605 + (7260 / 6) + 684 + 456 + 570 + 484;
										var deltaA = 0;
										var deltaB = 0;
										var deltaC = 0;
										


                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.AccumulatorPowerBonus] != undefined) {
											var add = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.AccumulatorPowerBonus].ProvidingToValue;
                                            LinkTypes0 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.AccumulatorPowerBonus].Value + add;
                                            deltaA = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.AccumulatorPowerBonus].NewLvlDelta;
											//LinkTypes1 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.CrystalCreditProduction].Value ;
                                        } else {
                                            LinkTypes0 = 0;
                                        }

                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.CrystalCreditProduction] != undefined) {
                                            LinkTypes1 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.CrystalCreditProduction].Value;
											deltaB = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.CrystalCreditProduction].NewLvlDelta;
										} else {
                                            LinkTypes1 = 0;
                                        }

                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[42] != undefined) {
                                            LinkTypes2 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.RefineryPowerBonus].Value;
											deltaC = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CreditsProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.RefineryPowerBonus].NewLvlDelta;
										} else {
                                            LinkTypes2 = 0;
                                        }
										var powTotalPro = powPro + (powPac/(powPacperH/3600)) + LinkTypes0 +  LinkTypes1 + LinkTypes2 ;
										//var powProRatio = Math.pow( ((powTotalProOfLevel12/164736)*100)/((powTotalPro/tibCost)*100), -1);
										if(building.get_CurrentLevel() < 15){
										var powProRatio = Math.pow( ((powTotalProOfLevel12/164736)*100)/((powTotalPro/tibCost)*100), -1);
										} else {
											var powProRatio = Math.pow( ((powTotalProOfLevel12/164736)*100)/((powTotalPro/tibCost)*100), -1);
										}
										powArr[powNum] = powProRatio;
                                        powArr.sort(function(a,b){return b-a});
                                        
                                        if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                            //_this.buildingRows(buildArr, building, type, LinkTypes0, LinkTypes1, LinkTypes2, tibCost, powCost, deltaA, deltaB, deltaC, cityName, tibCanbuy, powCanbuy);
											
											if(upChBxPow.getValue() && (Math.max(powProRatio) == powArr[0])){
												allArr[proNum] = powArr;
												if(upChBxFullBasePro.getValue()){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
											Pow_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											Ratio: powProRatio,
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                        
                                    }
                                    if (tech == ClientLib.Base.ETechName.Command_Center && building.get_CurrentLevel() < MaxLevel && city.get_LvlOffense() >= building.get_CurrentLevel()) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										if (ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(building.get_CurrentLevel()) != null) {
										offcryCost = ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(building.get_CurrentLevel())[0].Count;
										offpowCostA = ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(building.get_CurrentLevel())[1].Count;
										}
										
										var tibCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										
										
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                            //_this.buildingRows(buildArr, building, "CC", offcryCost, 0, 0, tibCost, powCost, offpowCostA, 0, 0, cityName, tibCanbuy, powCanbuy);
											if(upChBxCmd.getValue()){
											Cmd_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Defense_HQ && building.get_CurrentLevel() < MaxLevel && city.get_LvlDefense() >= building.get_CurrentLevel()) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										
										if (ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(building.get_CurrentLevel()) != null ) {
										defcryCost = ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(building.get_CurrentLevel())[0].Count;
										defpowCostA = ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(building.get_CurrentLevel())[1].Count;
										}
										
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                            //_this.buildingRows(buildArr, building, "HQ", defcryCost, 0, 0, tibCost, powCost, defpowCostA, 0, 0, cityName, tibCanbuy, powCanbuy);
											if(upChBxCmd.getValue()){
											Cmd_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Barracks && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										
										
										var deltaInfRT = infRT - nextInfRT;
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										if (_this.isCheckBoxChecked(num, buildingName, aNum) && (rtArr[0] == infRT)) {
                                           // _this.buildingRows(buildArr, building, "RT", infRT, 0, 0, tibCost, powCost, deltaInfRT, 0, 0, cityName, tibCanbuy, powCanbuy);
											//console.log(upChBxRt.getValue());
											if((upChBxRt.getValue())){
												Rt_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Factory && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										
										var deltaVehRT = vehRT - nextVehRT;
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										if (_this.isCheckBoxChecked(num, buildingName, aNum) && (rtArr[0] == vehRT)) {
                                           // _this.buildingRows(buildArr, building, "RT", vehRT, 0, 0, tibCost, powCost, deltaVehRT, 0, 0, cityName, tibCanbuy, powCanbuy);
											if((upChBxRt.getValue())){
												Rt_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Airport && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										
										
										var deltaAirRT = airRT - nextAirRT;
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										//console.log(_this.totalRepairTime( airRT, vehRT, infRT));
										if (_this.isCheckBoxChecked(num, buildingName, aNum) && (rtArr[0] == airRT)) {
                                           // _this.buildingRows(buildArr, building, "RT", airRT, 0, 0, tibCost, powCost, deltaAirRT, 0, 0, cityName, tibCanbuy, powCanbuy);
											if((upChBxRt.getValue())){
												Rt_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Defense_Facility && building.get_CurrentLevel() < MaxLevel && city.get_LvlDefense() >= building.get_CurrentLevel()) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										if(building.get_CurrentLevel() >= defLvl){
											var okLvl = true;
										} else {
											var okLvl = false;
										}
										
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                           // _this.buildingRows(buildArr, building, "def", okLvl, 0, 0, tibCost, powCost, defLvl, 0, 0, cityName, tibCanbuy, powCanbuy);
											if(upChBxCmd.getValue()){
											Cmd_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }

                                    if (tech == ClientLib.Base.ETechName.Harvester && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if(upChBxFullBasePro.getValue() == false){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
										gNum++;
										
										
                                        var LinkTypes0 = 0;
                                        var LinkTypes1 = 0;
										var deltaA = 0;
										var deltaB = 0;
										var harTotalProOfLevel12 = 570 + (7260/6) + 380;
                                        //OwnProdModifiers.d[1].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloTiberiumProduction].Value - 

                                        if ((city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[1, 25, 33])) {
                                            harTibNum++;
											proNum = 2;
											type = "Tiberium";
											var Delta = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].NewLvlDelta;
                                            var hartibPro = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].TotalValue;
                                            //var LinkTypes0 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloTiberiumProduction].Value;
                                            var hartibPac = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumPackageSize].TotalValue;
                                            var hartibPacperH = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumBonusTimeToComplete].TotalValue;
											var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
											if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
											
											
											var timeTibCost = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
											var timePowCost = powCost / ((powerCont+powerBonus+powerAlly)/3600);
											if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										//console.log(buildingName, tibCanbuy, powCanbuy);

                                            if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloTiberiumProduction] != undefined) {
												var add = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloTiberiumProduction].ProvidingToValue;
                                                LinkTypes0 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloTiberiumProduction].Value + add;
												deltaA = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloTiberiumProduction].NewLvlDelta
                                            } else {
                                                LinkTypes0 = 0;
                                            }
											var harTibTotalPro = hartibPro + (hartibPac/(hartibPacperH/3600)) + LinkTypes0;
											//var harTibProRatio = Math.pow( ((harTotalProOfLevel12/95040)*100)/((harCryTotalPro/tibCost)*100), -1);
											if(building.get_CurrentLevel() < 15){
											var harTibProRatio = Math.pow( ((harTotalProOfLevel12/95040)*100)/((harTibTotalPro/tibCost)*100), -1);
											} else {
												var harTibProRatio = Math.pow( ((harTotalProOfLevel12/95040)*100)/((harTibTotalPro/tibCost)*100), -1);
											}
											harTibArr[harTibNum] = harTibProRatio;
											harTibArr.sort(function(a,b){return b-a});
                                           
											if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                               // _this.buildingRows(buildArr, building, type, LinkTypes0, LinkTypes1,"" , tibCost, powCost, deltaA, deltaB, 0, cityName, tibCanbuy, powCanbuy);
												
												if(upChBxHarTib.getValue() && (Math.max(harTibProRatio) == harTibArr[0])){
													allArr[proNum] = harTibArr;
													if(upChBxFullBasePro.getValue()){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
											TibHar_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: "Tib-"+building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											Ratio: harTibProRatio,
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                            }
                                        }

                                        if ((city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[4, 26, 34])) {
                                            type = "Crystal";
											harCryNum++;
											proNum = 3;
											var Delta = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].NewLvlDelta;
                                            var harcryPro = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].TotalValue;
                                            //var LinkTypes1 =  city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloCrystalProduction].Value;
                                            var harcryPac = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalPackageSize].TotalValue;
                                            var harcryPacperH = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalBonusTimeToComplete].TotalValue;
											var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
											if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
											
											
											var timeTibCost = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
											var timePowCost = powCost / ((powerCont+powerBonus+powerAlly)/3600);
											if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										//console.log(buildingName, tibCanbuy, powCanbuy);

                                            //var harCryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0 || 1].Count;

                                            if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloCrystalProduction] != undefined) {
												var add = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloCrystalProduction].ProvidingToValue;
                                                LinkTypes1 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloCrystalProduction].Value + add;
                                                deltaB = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.SiloCrystalProduction].NewLvlDelta;
												//var harCryTotalPro = harcryPro + (harcryPac/(harcryPacperH/3600)) + LinkTypes1;
                                            } else {
                                                var LinkTypes1 = 0;
                                            }
											
											var harCryTotalPro = harcryPro + (harcryPac/(harcryPacperH/3600)) + LinkTypes1;
											//var harCryProRatio = Math.pow( ((harTotalProOfLevel12/95040)*100)/((harCryTotalPro/tibCost)*100), -1);
											if(building.get_CurrentLevel() < 15){
											var harCryProRatio = Math.pow( ((harTotalProOfLevel12/95040)*100)/((harCryTotalPro/tibCost)*100), -1);
											} else {
												var harCryProRatio = Math.pow( ((harTotalProOfLevel12/95040)*100)/((harCryTotalPro/tibCost)*100), -1);
											}
											harCryArr[harCryNum] = harCryProRatio;
											harCryArr.sort(function(a,b){return b-a});
                                                
                                            if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                              //  _this.buildingRows(buildArr, building, type, LinkTypes0, LinkTypes1,"" ,tibCost, powCost, deltaA, deltaB, 0, cityName, tibCanbuy, powCanbuy);
												
												if(upChBxHarCry.getValue() && (Math.max(harCryProRatio) == harCryArr[0])){
													allArr[proNum] = harCryArr;
													if(upChBxFullBasePro.getValue() == false){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
											CryHar_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: "Cry-"+building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											Ratio: harCryProRatio,
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                            }
                                        }
                                       
                                    }
                                    if (tech == ClientLib.Base.ETechName.Support_Air && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										if(building.get_CurrentLevel() >= defLvl){
											var okLvl = true;
										} else {
											var okLvl = false;
										}
										
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                          //  _this.buildingRows(buildArr, building, "airSup", okLvl, 0, 0, tibCost, powCost, defLvl, 0, 0, cityName, tibCanbuy, powCanbuy);
											if(upChBxSup.getValue()){
											Sup_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Support_Ion && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										if(building.get_CurrentLevel() >= defLvl){
											var okLvl = true;
										} else {
											var okLvl = false;
										}
										
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                          //  _this.buildingRows(buildArr, building, "vehSup", okLvl, 0, 0, tibCost, powCost, defLvl, 0, 0, cityName, tibCanbuy, powCanbuy);
											if(upChBxSup.getValue()){
											Sup_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Support_Art && building.get_CurrentLevel() < MaxLevel) {
                                        _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if (!_this.canUpgradeBuilding(building, city)) continue;
										if(building.get_CurrentLevel() >= defLvl){
											var okLvl = true;
										} else {
											var okLvl = false;
										}
										
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
                                        if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										var timeTibCostPerIncome = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCostPerIncome = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                          //  _this.buildingRows(buildArr, building, "infSup", okLvl, 0, 0, tibCost, powCost, defLvl, 0, 0, cityName, tibCanbuy, powCanbuy);
											if(upChBxSup.getValue()){
											Sup_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                    }
                                    if (tech == ClientLib.Base.ETechName.Silo && building.get_CurrentLevel() < MaxLevel) {
										 _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if(upChBxFullBasePro.getValue() == false){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
                                        gNum++;
										silNum++;
										proNum = 4;
                                        type = "Tib + Cry";
                                        var LinkTypes1 = 0;
                                        var LinkTypes0 = 0;
										var deltaA = 0;
										var deltaB = 0;
                                        var silTotalPro = 0;
										var silTotalProOfLevel12 = 380 + 380 ;
										var DeltaA = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].NewLvlDelta;
										var DeltaB = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].NewLvlDelta;
                                        var silCryPro = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].TotalValue;
                                        //var LinkTypes1 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterCrystalProduction].Value;
                                        var silTibPro = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].TotalValue;
                                        //var LinkTypes0 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterTiberiumProduction].Value;
                                        var silCrySto = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalStorage].TotalValue;
                                        var silTibSto = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumStorage].TotalValue;
                                        //var silCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0 || 1].Count;
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										
										var timeTibCost = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCost = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										//console.log(buildingName, tibCanbuy, powCanbuy);

                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterCrystalProduction] == undefined) {

                                            LinkTypes1 = 0;
                                        } else {
                                            LinkTypes1 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterCrystalProduction].Value;
                                            deltaA = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.CrystalProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterCrystalProduction].NewLvlDelta;
											//silTotalPro = LinkTypes1 + LinkTypes0;
                                        }

                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterTiberiumProduction] == undefined) {

                                            LinkTypes0 = 0;
                                        } else {
                                            LinkTypes0 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterTiberiumProduction].Value;
                                            deltaB = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.TiberiumProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.HarvesterTiberiumProduction].NewLvlDelta;
											//silTotalPro = LinkTypes1 + LinkTypes0;
                                        }
                                        //console.log(building);
										var silTotalPro = LinkTypes1 + LinkTypes0;
										//var silProRatio = Math.pow( ((silTotalProOfLevel12/63360)*100)/((silTotalPro/tibCost)*100), -1);
										if(building.get_CurrentLevel() < 15){
											var silProRatio = Math.pow( ((silTotalProOfLevel12/63360)*100)/((silTotalPro/tibCost)*100), -1);
											} else {
												var silProRatio = Math.pow( ((silTotalProOfLevel12/63360)*100)/((silTotalPro/tibCost)*100), -1);
											}
                                         silArr[silNum] = silProRatio;
                                         silArr.sort(function(a,b){return b-a});
                                                
                                        
										if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                          //  _this.buildingRows(buildArr, building, type, LinkTypes0, LinkTypes1, "",tibCost, powCost, deltaB, deltaA, 0, cityName, tibCanbuy, powCanbuy);
											
											if(upChBxSil.getValue() && (Math.max(silProRatio) == silArr[0])){
												allArr[proNum] = silArr;
												if(upChBxFullBasePro.getValue()){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
											Sil_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											Ratio: silProRatio,
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                        
                                    }
                                    if (tech == ClientLib.Base.ETechName.Accumulator && building.get_CurrentLevel() < MaxLevel) {
										 _this.buildingBox(buildingName, num, tech, nameArr, aNum);
										if(upChBxFullBasePro.getValue() == false){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
                                        var LinkTypes0 = 0;
										accNum++;
										proNum = 5;
                                        //OwnProdModifiers.d[6].ConnectedLinkTypes.d[41].Value
                                        gNum++;
                                        type = "Power";
										var deltaA = 0;
										var accTotalProOfLevel12 = 456 ;
										var Delta = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].NewLvlDelta;
                                        var accPro = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].TotalValue;
                                        //var LinkTypes0 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.PowerPlantAccumulatorBonus].Value;
                                        var accSto = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerStorage].TotalValue;
										var tibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										
										
										var timeTibCost = tibCost / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600);
										var timePowCost = powCost / ((powerCont+powerBonus+powerAlly)/3600);
										//console.log((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
										if((tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(tibCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((tibCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
										//console.log(buildingName, tibCanbuy, powCanbuy);
										
                                        //var accCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((building.get_CurrentLevel() + 1), building.get_UnitGameData_Obj())[0 || 1].Count;
                                        //var accTotalPro = accPro ;

                                        if (city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.PowerPlantAccumulatorBonus] != undefined) {
                                            LinkTypes0 = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.PowerPlantAccumulatorBonus].Value;
											deltaA = city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[ClientLib.Base.EModifierType.PowerProduction].ConnectedLinkTypes.d[ClientLib.Base.ELinkType.PowerPlantAccumulatorBonus].NewLvlDelta;
                                            var accTotalPro = LinkTypes0;
                                        } else {
                                            LinkTypes0 = 0;
											var accTotalPro = LinkTypes0;
                                        }
										//var accProRatio = Math.pow( ((accTotalProOfLevel12/63360)*100)/((accTotalPro/tibCost)*100), -1);
										if(building.get_CurrentLevel() < 15){
											var accProRatio = Math.pow( ((silTotalProOfLevel12/63360)*100)/((accTotalPro/tibCost)*100), -1);
											} else {
												var accProRatio = Math.pow( ((silTotalProOfLevel12/63360)*100)/((accTotalPro/tibCost)*100), -1);
											}
										accArr[accNum] = accProRatio;
                                        accArr.sort(function(a,b){return b-a});
                                                
                                        if (_this.isCheckBoxChecked(num, buildingName, aNum)) {
                                           // _this.buildingRows(buildArr, building, type, LinkTypes0, "", "",tibCost, powCost, deltaA, 0, 0, cityName, tibCanbuy, powCanbuy);
											
											if(upChBxAcc.getValue() && (Math.max(accProRatio) == accArr[0])){
												allArr[proNum] = accArr;
												if(upChBxFullBasePro.getValue()){
												if (!_this.canUpgradeBuilding(building, city)) continue;
											}
											Acc_obj = {
											cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											Ratio: accProRatio,
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											}
                                        }
                                       
                                    }
									
									
                                    //_this.buildingBox(building, num);
                                    //}
                                    //console.log(_this.isCheckBoxChecked(num, buildingName, aNum), buildingName, aNum, city.m_SupportDedicatedBaseName );
                                    //if(_this.canUpgradeBuilding(building, city))continue;
									
                                    /*if (_this.isCheckBoxChecked(num, buildingName, aNum) && (building.get_CurrentLevel() < 65)) {
                                        console.log(_this.isCheckBoxChecked(num, buildingName, aNum), buildingName, aNum, city.m_SupportDedicatedBaseName);
                                        console.log(_this.canUpgradeBuilding(building, city));
										//_this.buildingRows(gNum, building, type, LinkTypes0, LinkTypes1, LinkTypes2);

                                        B_obj = {
                                            cityid: city.get_Id(),
                                     		basename: city.m_SupportDedicatedBaseName,
											bName: building.get_UnitGameData_Obj().dn,
											buildinglevel: building.get_CurrentLevel(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
                                            }
                                            //var label = new qx.ui.basic.Label(_this.isCheckBoxChecked(num, buildingName, aNum), buildingName, aNum, B_obj );
                                            //console.log((_this.isCheckBoxChecked(num, buildingName, aNum), buildingName, aNum, B_obj ));
                                            //page2.add(label);
                                    }*/

                                } //building loop
								if(allArr.toString() != '[]'){
									
									var proArr = [];
									if(allArr[0] != undefined){
										proArr[0]= allArr[0][0];
									}
									if(allArr[1] != undefined){
										proArr[1] = allArr[1][0];
									}
									if(allArr[2] != undefined){
										proArr[2] = allArr[2][0];
									}
									if(allArr[3] != undefined){
										proArr[3] = allArr[3][0];
									}
									if(allArr[4] != undefined){
										proArr[4] = allArr[4][0];
									}
									if(allArr[5] != undefined){
										proArr[5] = allArr[5][0];
									}
									proArr.sort(function(a,b){return b-a});
								//console.log(proArr);
								
								}
								if(proArr != undefined){
								if(Acc_obj != 0 && Acc_obj.Ratio == proArr[0]){
								//console.log(Acc_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", Acc_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, Acc_obj, "object", Acc_obj.basename, Acc_obj.bName, (Acc_obj.buildinglevel + 1), Acc_obj.posX, Acc_obj.posY, Acc_obj.Ratio);
								}
								if(Sil_obj != 0 && Sil_obj.Ratio == proArr[0]){
								//console.log(Sil_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", Sil_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, Sil_obj, "object", Sil_obj.basename, Sil_obj.bName, (Sil_obj.buildinglevel + 1), Sil_obj.posX, Sil_obj.posY, Sil_obj.Ratio);
								}
								if(TibHar_obj != 0 && TibHar_obj.Ratio == proArr[0]){
								//console.log(TibHar_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", TibHar_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, TibHar_obj, "object", TibHar_obj.basename, TibHar_obj.bName, (TibHar_obj.buildinglevel + 1), TibHar_obj.posX, TibHar_obj.posY, TibHar_obj.Ratio);
								}
								if(CryHar_obj != 0 && CryHar_obj.Ratio == proArr[0]){
								//console.log(CryHar_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", CryHar_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, CryHar_obj, "object", CryHar_obj.basename, CryHar_obj.bName, (CryHar_obj.buildinglevel + 1), CryHar_obj.posX, CryHar_obj.posY, CryHar_obj.Ratio);
								}
								if(Pow_obj != 0 && Pow_obj.Ratio == proArr[0]){
								//console.log(Pow_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", Pow_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, Pow_obj, "object", Pow_obj.basename, Pow_obj.bName, (Pow_obj.buildinglevel + 1), Pow_obj.posX, Pow_obj.posY, Pow_obj.Ratio);
								}
								if(Ref_obj != 0 && Ref_obj.Ratio == proArr[0]){
								//console.log(Ref_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", Ref_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, Ref_obj, "object", Ref_obj.basename, Ref_obj.bName, (Ref_obj.buildinglevel + 1), Ref_obj.posX, Ref_obj.posY, Ref_obj.Ratio);
								}
								}
								if(Cmd_obj != 0){
								//console.log(Cmd_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", Cmd_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, Cmd_obj, "object", Cmd_obj.basename, Cmd_obj.bName, (Cmd_obj.buildinglevel + 1), Cmd_obj.posX, Cmd_obj.posY, "");
								}
								if(Sup_obj != 0){
								//console.log(Sup_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", Sup_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, Sup_obj, "object", Sup_obj.basename, Sup_obj.bName, (Sup_obj.buildinglevel + 1), Sup_obj.posX, Sup_obj.posY, "");
								}
								if(Rt_obj != 0){
								//console.log(Rt_obj);
								ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", Rt_obj, null, null, true);
								_this.buildingRows(_this.UpgradeArr, Rt_obj, "object", Rt_obj.basename, Rt_obj.bName, (Rt_obj.buildinglevel + 1), Rt_obj.posX, Rt_obj.posY, "");
								}
								
										


								var units = city.get_CityUnitsData();
								var offarr = [];
								var defarr = [];
                                var offenceUnits = units.get_OffenseUnits();
                                var gNum = 0;
                                var hNum = 0;
								var offnumA = -1;
								var defnumA = -1;
                                for (var nUnit in offenceUnits.d) {
									offnumA++;
                                    var unit = offenceUnits.d[nUnit];
                                    //console.log(_this.canUpgradeUnit(unit, city));
									//if (!_this.canUpgradeUnit(unit, city)) continue;

                                    var unitTech = unit.get_UnitGameData_Obj().at;
									var unitTechName = unit.get_UnitGameData_Obj().i;
                                    var unitName = unit.get_UnitGameData_Obj().dn;
                                    var offNum = 2;
                                    //typeArr5[unitName] == unitTech;
                                    //console.log(ClientLib.Base.EUnitType.Infantry);
                                    //console.log(ClientLib.Base.EUnitType.Tank);
                                    //console.log(ClientLib.Base.EUnitType.Air);
									var repairCostA = unit.get_UnitLevelRepairRequirements()[0].Count;
									if(unit.get_UnitLevelRepairRequirements()[1].Count != undefined){
									var repairCostB = unit.get_UnitLevelRepairRequirements()[1].Count;
									} else {
									var repairCostB = 1;
									}
									var repairRatio = repairCostA/repairCostB;
									
                                    if (unitTech == ClientLib.Base.EUnitType.Infantry) {
										
                                        //fNum = 0;
										//offarr[offnumA] = unit.get_CurrentLevel();
										if (!_this.canUpgradeUnit(unit, city)) continue;
										if(unitTechName == ClientLib.Base.EUnit.NOD_Militant || unitTechName == ClientLib.Base.EUnit.GDI_Riflemen){
                                        _this.unitBox(unitName, num, offNum, 0, 0);
										}
										if(unitTechName == ClientLib.Base.EUnit.NOD_MilitantRocketSquad || unitTechName == ClientLib.Base.EUnit.GDI_MissileSquad){
                                        _this.unitBox(unitName, num, offNum, 0, 1);
										}
										if(unitTechName == 135 || unitTechName == ClientLib.Base.EUnit.GDI_SniperTeam){
                                        _this.unitBox(unitName, num, offNum, 0, 2);
										}
										if(unitTechName == 136 || unitTechName == ClientLib.Base.EUnit.GDI_ZoneTrooper){
                                        _this.unitBox(unitName, num, offNum, 0, 3);
										}
										if(unitTechName == 137 || unitTechName == ClientLib.Base.EUnit.GDI_Commando){
                                        _this.unitBox(unitName, num, offNum, 1, 0);
										}
										
                                        //_this.unitRows(offUnitArr, unit, "off", costA, costB, cityName, offLvl,waitTib, waitPow);
										var cryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1].Count;
										//offarr[offnumA] = tibCost/powCost;
										}else{
											var powCost = 1;
											//offarr[offnumA] = tibCost/(powCost);
										}
										var offRatio = (repairCostA + cryCost + powCost) / repairCostB;
										offarr[offnumA] = offRatio;
										if((cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) < 1){
											var cryCanbuy = _this.FormatTimespan(cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal));
											
										} else {
											var cryCanbuy = _this.FormatTimespan((cryCost - city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) / ((crystalCont+crystalBonus+crystalAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
													  //(arr, unit, type, costA, costB, cityName, typeLvl, waitTib, waitPow)
										if (_this.isCheckBoxChecked(num, unitName, offNum) && (_this.isCheckBoxChecked(num, unitName, offNum) != undefined)) {
										//_this.unitRows(buildArr, unit, "off", cryCost, powCost, cityName, offLvl, cryCanbuy, powCanbuy);
										}
                                    }
                                    if (unitTech == ClientLib.Base.EUnitType.Tank) {
										//console.log(unit.get_UnitGameData_Obj());
                                        //gNum = 0;
										//offarr[offnumA] = unit.get_CurrentLevel();
										if (!_this.canUpgradeUnit(unit, city)) continue;
										if(unitTechName == ClientLib.Base.EUnit.NOD_Scorpion || unitTechName == ClientLib.Base.EUnit.GDI_Predator){
                                        _this.unitBox(unitName, num, offNum, 1, 1);
										}
										if(unitTechName == ClientLib.Base.EUnit.NOD_Avatar || unitTechName == ClientLib.Base.EUnit.GDI_Mammoth){
                                        _this.unitBox(unitName, num, offNum, 1, 2);
										}
										if(unitTechName == 140 || unitTechName == ClientLib.Base.EUnit.GDI_Guardian){
                                        _this.unitBox(unitName, num, offNum, 1, 3);
										}
										if(unitTechName == 138 || unitTechName == ClientLib.Base.EUnit.GDI_Pitbull){
                                        _this.unitBox(unitName, num, offNum, 2, 0);
										}
										if(unitTechName == 142 || unitTechName == 90){
                                        _this.unitBox(unitName, num, offNum, 2, 1);
										}
										//if (!_this.canUpgradeUnit(unit, city)) continue;
										var cryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1].Count;
									
										}else{
											var powCost = 1;
											
										}
										var offRatio = (repairCostA + cryCost + powCost) / repairCostB;
										offarr[offnumA] = offRatio;
										if((cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) < 1){
											var cryCanbuy = _this.FormatTimespan(cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal));
											
										} else {
											var cryCanbuy = _this.FormatTimespan((cryCost - city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) / ((crystalCont+crystalBonus+crystalAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
													  //(arr, unit, type, costA, costB, cityName, typeLvl, waitTib, waitPow)
										if (_this.isCheckBoxChecked(num, unitName, offNum) && (_this.isCheckBoxChecked(num, unitName, offNum) != undefined)) {
										//_this.unitRows(buildArr, unit, "off", cryCost, powCost, cityName, offLvl, cryCanbuy, powCanbuy);
										}

                                    }
                                    if (unitTech == ClientLib.Base.EUnitType.Air) {
                                        //hNum = 0;
										//offarr[offnumA] = unit.get_CurrentLevel();
                                        if (!_this.canUpgradeUnit(unit, city)) continue;
										if(unitTechName == ClientLib.Base.EUnit.NOD_Vertigo || unitTechName == ClientLib.Base.EUnit.GDI_Firehawk){
                                        
										_this.unitBox(unitName, num, offNum, 2, 2);
										}
										if(unitTechName == 144 || unitTechName == 92){ // cobra or palatain
                                        _this.unitBox(unitName, num, offNum, 2, 3);
										}
										if(unitTechName == 143 || unitTechName == 91){ // venom or orca
                                        _this.unitBox(unitName, num, offNum, 3, 0);
										}
										if(unitTechName == 145 || unitTechName == 93){ // Sal or Kod
                                        _this.unitBox(unitName, num, offNum, 3, 1);
										}
										//if (!_this.canUpgradeUnit(unit, city)) continue;
										var cryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1].Count;
										//offarr[offnumA] = tibCost/powCost;
										}else{
											var powCost = 1;
											//offarr[offnumA] = tibCost/(powCost);
										}
										
										var offRatio = (repairCostA + cryCost + powCost) / repairCostB;
										offarr[offnumA] = offRatio;
										if((cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) < 1){
											var cryCanbuy = _this.FormatTimespan(cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal));
											
										} else {
											var cryCanbuy = _this.FormatTimespan((cryCost - city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) / ((crystalCont+crystalBonus+crystalAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
													  //(arr, unit, type, costA, costB, cityName, typeLvl, waitTib, waitPow)
										if (_this.isCheckBoxChecked(num, unitName, offNum) && (_this.isCheckBoxChecked(num, unitName, offNum) != undefined)) {
										//_this.unitRows(buildArr, unit, "off", cryCost, powCost, cityName, offLvl, cryCanbuy, powCanbuy);
										}

                                    }
									//console.log("cCost: ", cryCost, "pCost: ", powCost, "RTCost: ", repairCostA, "RTTime: ", repairCostB, "Ratio: ", offarr[offnumA]);
									offarr.sort(function(a,b){return b-a});
                                    
                                    if (_this.isCheckBoxChecked(num, unitName, offNum)) {
                                        //console.log(_this.isCheckBoxChecked(num, unitName, offNum), unitName, offNum, city.m_SupportDedicatedBaseName);
										if(upChBxOff.getValue()){


                                        //console.log(ClientLib.Base.EUnitType.Structure);

                                        O_obj = {
                                                cityid: city.get_Id(),
                                                basename: city.m_SupportDedicatedBaseName,
                                                Ratio: offRatio,
                                                uName: unitName,
                                                level: unit.get_CurrentLevel(),
                                                type: "Offence",
                                                posX: unit.get_CoordX(),
                                                posY: unit.get_CoordY(),
                                                //upgradepossiblity: canUpgrade,
                                                unitId: unit.get_Id()
                                            }
										}
                                            //textfield.setValue(_this.isCheckBoxChecked(num, unitName, offNum), unitName, offNum, O_obj );
                                    }
									

                                } //off loop
								if(O_obj != 0){
									//console.log(O_obj, offarr);
									ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", O_obj, null, null, true);
									_this.unitRows(_this.UpgradeArr, O_obj, "object", O_obj.basename, O_obj.uName, (O_obj.level + 1), O_obj.posX, O_obj.posY, O_obj.Ratio);
									}
								
                                var xNum = 0;
                                var yNum = 0;
                                var zNum = 0;

                                var defenceUnits = units.get_DefenseUnits();
                                for (var nUnit in defenceUnits.d) {
                                    var unit = defenceUnits.d[nUnit];
									//console.log(!_this.canUpgradeUnit(unit, city), _this.canUpgradeUnit(unit, city));
                                    //if (!_this.canUpgradeUnit(unit, city)) continue;
                                    var unitTech = unit.get_UnitGameData_Obj().at;
									var unitTechName = unit.get_UnitGameData_Obj().i;
                                    var unitName = unit.get_UnitGameData_Obj().dn;
									if(unit.get_UnitLevelRepairRequirements()[1].Count != undefined){
									var repairCostA = unit.get_UnitLevelRepairRequirements()[0].Count;
									}else{
										var repairCostA = 1;
									}
									if(unit.get_UnitLevelRepairRequirements()[1].Count != undefined){
									var repairCostB = unit.get_UnitLevelRepairRequirements()[1].Count;
									} else {
									var repairCostB = 1;
									}
									var repairRatio = repairCostA/repairCostB;
                                    var defNum = 1;
									defnumA++;
									//console.log(GAMEDATA.Tech[unit.get_UnitGameData_Obj().tl].dn, unit.get_UnitGameData_Obj().tl, unit.get_UnitGameData_Obj());
									//console.log(unit.get_UnitGameData_Obj());
                                    if (unitTech == ClientLib.Base.EUnitType.Infantry) {
										if (!_this.canUpgradeUnit(unit, city)) continue;
										//defarr[defnumA] = unit.get_CurrentLevel();
										//console.log(unit.get_UnitLevelRepairRequirements());
										if(unitTechName == 167 || unitTechName == 102){//MG nest
                                        _this.unitBox(unitName, num, defNum, 0, 0);
										}
										if(unitTechName == 160 || unitTechName == 95){//Black hand || Zone trooper
                                        _this.unitBox(unitName, num, defNum, 0, 1);
										}
										if(unitTechName == 161 || unitTechName == 96){//Confessor || Snipr Team
                                        _this.unitBox(unitName, num, defNum, 0, 2);
										}
										if(unitTechName == 162 || unitTechName == 97){//Rocket || Rocket Team
                                        _this.unitBox(unitName, num, defNum, 0, 3);
										}

                                        
										//if (!_this.canUpgradeUnit(unit, city)) continue;
										var cryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 1;
										}
										var defRatio = (repairCostA + cryCost + powCost) / repairCostB;
										defarr[defnumA] = defRatio;
										if((cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) < 1){
											var cryCanbuy = _this.FormatTimespan(cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal));
											
										} else {
											var cryCanbuy = _this.FormatTimespan((cryCost - city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) / ((crystalCont+crystalBonus+crystalAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
													  //(arr, unit, type, costA, costB, cityName, typeLvl, waitTib, waitPow)
										if (_this.isCheckBoxChecked(num, unitName, defNum) && (_this.isCheckBoxChecked(num, unitName, defNum) != undefined)) {
										//_this.unitRows(buildArr, unit, "def", cryCost, powCost, cityName, defLvl, cryCanbuy, powCanbuy);
										}
                                        //console.log(typeArr5);
                                    }
                                    if (unitTech == ClientLib.Base.EUnitType.Tank) {
                                        //defarr[defnumA] = unit.get_CurrentLevel();
                                        if (!_this.canUpgradeUnit(unit, city)) continue;
										if(unitTechName == 163 || unitTechName == 98){//scro || pred
                                        _this.unitBox(unitName, num, defNum, 1, 0);
										}
										if(unitTechName == 164 || unitTechName == 99){//rec || gar
                                        _this.unitBox(unitName, num, defNum, 1, 1);
										}
										if(unitTechName == 165 || unitTechName == 100){//attbi || pit
                                        _this.unitBox(unitName, num, defNum, 1, 2);
										}
										if(unitTechName == 170 || unitTechName == 127){//anitTank
                                        _this.unitBox(unitName, num, defNum, 1, 3);
										}
										if(unitTechName == 171 || unitTechName == 128){//anitInf
                                        _this.unitBox(unitName, num, defNum, 2, 0);
										}
										if(unitTechName == 172 || unitTechName == 129){//anitAir
                                        _this.unitBox(unitName, num, defNum, 2, 1);
										}
										//if (!_this.canUpgradeUnit(unit, city)) continue;
										var cryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 0;
										}
										var defRatio = (repairCostA + cryCost + powCost) / repairCostB;
										defarr[defnumA] = defRatio;
										if((cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) < 1){
											var cryCanbuy = _this.FormatTimespan(cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Crystal));
											
										} else {
											var cryCanbuy = _this.FormatTimespan((cryCost - city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)) / ((crystalCont+crystalBonus+crystalAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
													  //(arr, unit, type, costA, costB, cityName, typeLvl, waitTib, waitPow)
										if (_this.isCheckBoxChecked(num, unitName, defNum) && (_this.isCheckBoxChecked(num, unitName, defNum) != undefined)) {
										//_this.unitRows(buildArr, unit, "def", cryCost, powCost, cityName, defLvl, cryCanbuy, powCanbuy);
										}

                                    }
                                    if (unitTech == ClientLib.Base.EUnitType.Structure) {
                                       // defarr[defnumA] = unit.get_CurrentLevel();
                                        if (!_this.canUpgradeUnit(unit, city)) continue;
										if(unitTechName == 174 || unitTechName == 106){//wall
                                        _this.unitBox(unitName, num, defNum, 2, 2);
										}
										if(unitTechName == 173 || unitTechName == 105){//anti-tank
                                        _this.unitBox(unitName, num, defNum, 2, 3);
										}
										if(unitTechName == 169 || unitTechName == 104){//anti-inf
                                        _this.unitBox(unitName, num, defNum, 3, 0);
										}
										if(unitTechName == 166 || unitTechName == 101){//beam || gard tower
                                        _this.unitBox(unitName, num, defNum, 3, 1);
										}
										if(unitTechName == 168 || unitTechName == 103){//Flak
                                        _this.unitBox(unitName, num, defNum, 3, 2);
										}
										//if (!_this.canUpgradeUnit(unit, city)) continue;
										var cryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[0].Count;
										if(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1] != undefined){
                                        var powCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj((unit.get_CurrentLevel() + 1), unit.get_UnitGameData_Obj())[1].Count;
										}else{
											var powCost = 1;
										}
										var defRatio = (repairCostA + cryCost + powCost) / repairCostB;
										defarr[defnumA] = defRatio;
										if((cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) < 1){
											var tibCanbuy = _this.FormatTimespan(cryCost / city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium));
											
										} else {
											var tibCanbuy = _this.FormatTimespan((cryCost - city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)) / ((tiberiumCont+tiberiumBonus+tiberiumAlly)/3600));
											
										}
										if((powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power)) < 1){
											var powCanbuy = _this.FormatTimespan(powCost / city.GetResourceCount(ClientLib.Base.EResourceType.Power));
											
										} else {
											var powCanbuy = _this.FormatTimespan((powCost - city.GetResourceCount(ClientLib.Base.EResourceType.Power)) / ((powerCont+powerBonus+powerAlly)/3600));
											
										}
													  //(arr, unit, type, costA, costB, cityName, typeLvl, waitTib, waitPow)
										if (_this.isCheckBoxChecked(num, unitName, defNum) && (_this.isCheckBoxChecked(num, unitName, defNum) != undefined)) {
										//_this.unitRows(buildArr, unit, "def", cryCost, powCost, cityName, defLvl, tibCanbuy, powCanbuy);
										}

                                    }
									//console.log("cCost: ", cryCost, "pCost: ", powCost, "RTCost: ", repairCostA, "RTTime: ", repairCostB);
                                    defarr.sort(function(a,b){return a-b});
                                    if (_this.isCheckBoxChecked(num, unitName, defNum) != undefined && _this.isCheckBoxChecked(num, unitName, defNum)) {

                                        //console.log(_this.isCheckBoxChecked(num, unitName, defNum), unitName, aNum, city.m_SupportDedicatedBaseName, num);
                                        //if(!_this.canUpgradeUnit(unit, city))continue;
										if(upChBxDef.getValue()){

                                        D_obj = {
                                                cityid: city.get_Id(),
                                                basename: city.m_SupportDedicatedBaseName,
                                                Ratio: defRatio,
                                                uName: unitName.toString(),
                                                level: unit.get_CurrentLevel(),
                                                type: "Defense",
                                                posX: unit.get_CoordX(),
                                                posY: unit.get_CoordY(),
                                                //upgradepossiblity: canUpgrade,
                                                unitId: unit.get_Id()
                                            }
										}
                                            //textfield.add(_this.isCheckBoxChecked(num, unitName, defNum), unitName, defNum, D_obj);
                                    }
									
                                } //def loop
								
								if(D_obj != 0){
									//console.log(D_obj, defarr);
									ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", D_obj, null, null, true);
									_this.unitRows(_this.UpgradeArr, D_obj, "object", D_obj.basename, D_obj.uName, (D_obj.level + 1), D_obj.posX, D_obj.posY, D_obj.Ratio);
									}

                                /*
								if(B_obj != 0){
									console.log(B_obj);
									//ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", B_obj, null, null, true);
									//continue;
									}
								
								//ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", O_obj, null, null, true);
								
								if(D_obj != 0){
									console.log(D_obj);
									ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", D_obj, null, null, true);
									tableModelA.removeRows(0, tableModelA.getRowCount(), true);
									defUnitArr = [];
									continue;
									}
								if(O_obj != 0){
									console.log(D_obj);
									ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", O_obj, null, null, true);
									tableModelA.removeRows(0, tableModelA.getRowCount(), true);
									offUnitArr = [];
									continue;
									}
							*/
                                //container.add(tabView);
                                //win.add(container);
                                //win.open();

                                //continue;	
                            } //city loop
                            //console.log("End of Main Function");
							buildArr = [];
							if (tableModelA.getRowCount() > 100) {
                                    tableModelA.removeRows(0, tableModelA.getRowCount(), true);
									this.UpgradeArr = [];
                                }



                        }
                    }
                });
            }
        } catch (e) {
            console.log("createFlunikTools: ", e);
        }

        function FlunikTools_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                    createFlunikTools();
                    if (typeof ClientLib.API.Util.GetUnitMaxHealth == 'undefined'){
							for (var key in ClientLib.Base.Util)
							{
								var strFunction = ClientLib.Base.Util[key].toString();
								if ((strFunction.indexOf("function (a,b,c)") == 0 || strFunction.indexOf("function (a,b)") == 0) &&
									 strFunction.indexOf("*=1.1") > -1)
								{
										FlunikTools.Main.getInstance().GetUnitMaxHealth = ClientLib.Base.Util[key];
										console.log("FlunikTools.Main.getInstance().GetUnitMaxHealth = ClientLib.Base.Util["+key+"]");
										break;
								}
							}
						}else{
							FlunikTools.Main.getInstance().GetUnitMaxHealth = ClientLib.API.Util.GetUnitMaxHealth;	
					}
                    FlunikTools.Main.getInstance().initialize();
                    if (FlunikTools.Main.getInstance().cmdButton.getLabel != null) {
                        console.log(FlunikTools.Main.getInstance().cmdButton.getLabel);
                    }
                    /*if (FlunikTools.Main.getInstance().cmdButton.getLabel == "cmd.OFF") {
                                    //numb = 0;
                                    FlunikTools.Main.getInstance().stopAutoUpdate();
                                } else {
                                    FlunikTools.Main.getInstance()..startAutoUpdate();
                                }*/



                } else {
                    setTimeout(FlunikTools_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("FlunikTools_checkIfLoaded: ", e);
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            setTimeout(FlunikTools_checkIfLoaded, 1000);
        }
    }

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
