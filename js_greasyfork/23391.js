// ==UserScript==
// @name        Maelstrom ADDON Basescanner + cncoptplus growth rate
// @namespace   http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @description Maelstrom ADDON Basescanner
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     1.8.5+
// @author      BlinDManX,chertosha,KRS_Lan
// @grant       none
// @copyright   2012+, Claus Neumann
// @license     CC BY-NC-ND 3.0 - http://creativecommons.org/licenses/by-nc-nd/3.0/
// @downloadURL https://update.greasyfork.org/scripts/23391/Maelstrom%20ADDON%20Basescanner%20%2B%20cncoptplus%20growth%20rate.user.js
// @updateURL https://update.greasyfork.org/scripts/23391/Maelstrom%20ADDON%20Basescanner%20%2B%20cncoptplus%20growth%20rate.meta.js
// ==/UserScript==
(function () {
	var MaelstromTools_Basescanner = function () {
		window.__msbs_version = "1.8.5";
		function createMaelstromTools_Basescanner() {

			qx.Class.define("Addons.BaseScannerGUI", {
				type : "singleton",
				extend : qx.ui.window.Window,
				construct : function () {
					try {
						this.base(arguments);
						console.info("Addons.BaseScannerGUI " + window.__msbs_version);
						this.T = Addons.Language.getInstance();
						this.setWidth(820);
						this.setHeight(400);
						this.setContentPadding(10);
						this.setShowMinimize(true);
						this.setShowMaximize(true);
						this.setShowClose(true);
						this.setResizable(true);
						this.setAllowMaximize(true);
						this.setAllowMinimize(true);
						this.setAllowClose(true);
						this.setShowStatusbar(false);
						this.setDecorator(null);
						this.setPadding(5);
						this.setLayout(new qx.ui.layout.VBox(3));
						this.stats.src = 'http://goo.gl/DrJ2x'; //1.5

						this.FI();
						this.FH();
						this.FD();
						if (this.ZE == null) {
							this.ZE = [];
						}
						this.setPadding(0);
						this.removeAll();

						this.add(this.ZF);
						this.add(this.ZN);

						this.add(this.ZP);
						this.ZL.setData(this.ZE);							

					} catch (e) {
						console.debug("Addons.BaseScannerGUI.construct: ", e);
					}
				},
				members : {
					// pictures
					stats : document.createElement('img'),
					T : null,
					ZA : 0,
					ZB : null,
					ZC : null,
					ZD : null,
					ZE : null,
					ZF : null,
					ZG : null,
					ZH : false,
					ZI : true,
					ZJ : null,
					ZK : null,
					ZL : null,
					ZM : null,
					ZN : null,
					ZO : null,
					ZP : null,
					ZQ : null,
					ZR : [],
					ZT : true,
					ZU : null,
					ZV : null,
					ZX : null,
					ZY : null,
					ZZ : [],
					ZS : {},
					YZ : null,
					YY : null,
					
					openWindow : function (title) {
						try {
							this.setCaption(title);
							if (this.isVisible()) {
								this.close();
							} else {
								MT_Cache.updateCityCache();
								MT_Cache = window.MaelstromTools.Cache.getInstance();
								var cname;								
								this.ZC.removeAll();
								for (cname in MT_Cache.Cities) {
									var item = new qx.ui.form.ListItem(cname, null, MT_Cache.Cities[cname].Object);
									this.ZC.add(item);
									if (Addons.LocalStorage.getserver("Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id()) {
										this.ZC.setSelection([item]);
									}
								}							
								this.open();
								this.moveTo(100, 100);
							}
						} catch (e) {
							console.log("MaelstromTools.DefaultObject.openWindow: ", e);
						}
					},
					FI : function () {
						try {
							this.ZL = new qx.ui.table.model.Simple();
							this.ZL.setColumns(["ID", "LoadState", this.T.get("City"), this.T.get("Location"), this.T.get("Level"), this.T.get("Tiberium"), this.T.get("Crystal"), this.T.get("Dollar"), this.T.get("Research"), "Crystalfields", "Tiberiumfields", this.T.get("Building state"), this.T.get("Defense state"), this.T.get("CP"), "Growth Rate", "Sum Tib+Cry+Cre", "(Tib+Cry+Cre)/CP", "CY", "DF", this.T.get("base set up at")]);
							this.YY = ClientLib.Data.MainData.GetInstance().get_Player();
							this.ZN = new qx.ui.table.Table(this.ZL);
							this.ZN.setColumnVisibilityButtonVisible(false);
							this.ZN.setColumnWidth(0, 0);
							this.ZN.setColumnWidth(1, 0);
							this.ZN.setColumnWidth(2, Addons.LocalStorage.getserver("Basescanner_ColWidth_2", 120));
							this.ZN.setColumnWidth(3, Addons.LocalStorage.getserver("Basescanner_ColWidth_3", 60));
							this.ZN.setColumnWidth(4, Addons.LocalStorage.getserver("Basescanner_ColWidth_4", 50));
							this.ZN.setColumnWidth(5, Addons.LocalStorage.getserver("Basescanner_ColWidth_5", 60));
							this.ZN.setColumnWidth(6, Addons.LocalStorage.getserver("Basescanner_ColWidth_6", 60));
							this.ZN.setColumnWidth(7, Addons.LocalStorage.getserver("Basescanner_ColWidth_7", 60));
							this.ZN.setColumnWidth(8, Addons.LocalStorage.getserver("Basescanner_ColWidth_8", 60));
							this.ZN.setColumnWidth(9, Addons.LocalStorage.getserver("Basescanner_ColWidth_9", 30));
							this.ZN.setColumnWidth(10, Addons.LocalStorage.getserver("Basescanner_ColWidth_10", 30));
							this.ZN.setColumnWidth(11, Addons.LocalStorage.getserver("Basescanner_ColWidth_11", 50));
							this.ZN.setColumnWidth(12, Addons.LocalStorage.getserver("Basescanner_ColWidth_12", 50));
							this.ZN.setColumnWidth(13, Addons.LocalStorage.getserver("Basescanner_ColWidth_13", 30));
							this.ZN.setColumnWidth(14, Addons.LocalStorage.getserver("Basescanner_ColWidth_14", 60));
							this.ZN.setColumnWidth(15, Addons.LocalStorage.getserver("Basescanner_ColWidth_15", 60));
							this.ZN.setColumnWidth(16, Addons.LocalStorage.getserver("Basescanner_ColWidth_16", 60));
							this.ZN.setColumnWidth(17, Addons.LocalStorage.getserver("Basescanner_ColWidth_17", 50));
							this.ZN.setColumnWidth(18, Addons.LocalStorage.getserver("Basescanner_ColWidth_18", 50));
							this.ZN.setColumnWidth(19, Addons.LocalStorage.getserver("Basescanner_ColWidth_19", 40));
							var c = 0;
							var tcm = this.ZN.getTableColumnModel();
							for (c = 0; c < this.ZL.getColumnCount(); c++) {
								if (c == 0 || c == 1 || c == 11 || c == 12) {
									tcm.setColumnVisible(c, Addons.LocalStorage.getserver("Basescanner_Column_" + c, false));
								} else {
									tcm.setColumnVisible(c, Addons.LocalStorage.getserver("Basescanner_Column_" + c, true));
								}
							}

							tcm.setColumnVisible(1, false);
							tcm.setHeaderCellRenderer(9, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Crystal]), "Crystalfields");
							tcm.setHeaderCellRenderer(10, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Tiberium], "Tiberiumfields"));
							tcm.setDataCellRenderer(5, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(6, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(7, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(8, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(15, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(16, new qx.ui.table.cellrenderer.Replace().set({
									ReplaceFunction : this.FA
								}));
							tcm.setDataCellRenderer(19, new qx.ui.table.cellrenderer.Boolean());
							
							if (PerforceChangelist >= 436669) { // 15.3 patch
								var eventType = "cellDbltap";
							} else { //old
								var eventType = "cellDblclick";
							}
				
							this.ZN.addListener(eventType, function (e) {
								Addons.BaseScannerGUI.getInstance().FB(e);
								
								
							}, this);
							tcm.addListener("widthChanged", function (e) {
								//console.log(e, e.getData());
								var col = e.getData().col;
								var width = e.getData().newWidth;
								Addons.LocalStorage.setserver("Basescanner_ColWidth_" + col, width);
							}, tcm);

						} catch (e) {
							console.debug("Addons.BaseScannerGUI.FI: ", e);
						}
					},
					FB : function (e) {
						try {
							console.log("e",e.getRow(),this.ZE);
							var cityId = this.ZE[e.getRow()][0];
							var posData = this.ZE[e.getRow()][3];
							/* center screen */
							if (posData != null && posData.split(':').length == 2) {
								var posX = parseInt(posData.split(':')[0]);
								var posY = parseInt(posData.split(':')[1]);
								ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(posX, posY);
							}
							/* and highlight base */
							if (cityId && !(this.ZK[4].getValue())) {
								//ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(cityId);
								//webfrontend.gui.UtilView.openCityInMainWindow(cityId);
								//webfrontend.gui.UtilView.openVisModeInMainWindow(1, cityId, false);
								var bk = qx.core.Init.getApplication();
								bk.getBackgroundArea().closeCityInfo();
								bk.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, cityId, 0, 0);
							}

							var q = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
							if (q != null)
								q.get_CityArmyFormationsManager().set_CurrentTargetBaseId(cityId);

						} catch (ex) {
							console.debug("Addons.BaseScannerGUI FB error: ", ex);
						}
					},
					FN : function (e) {
						this.ZG.setLabel(this.T.get("Scan"));
						this.ZH = false;
					},
					CBChanged : function (e) {
						this.ZH = false;
					},
					FA : function (oValue) {
						var f = new qx.util.format.NumberFormat();
						f.setGroupingUsed(true);
						f.setMaximumFractionDigits(3);
						if (!isNaN(oValue)) {
							if (Math.abs(oValue) < 100000)
								oValue = f.format(Math.floor(oValue));
							else if (Math.abs(oValue) >= 100000 && Math.abs(oValue) < 1000000)
								oValue = f.format(Math.floor(oValue / 100) / 10) + "k";
							else if (Math.abs(oValue) >= 1000000 && Math.abs(oValue) < 10000000)
								oValue = f.format(Math.floor(oValue / 1000) / 1000) + "M";
							else if (Math.abs(oValue) >= 10000000 && Math.abs(oValue) < 100000000)
								oValue = f.format(Math.floor(oValue / 10000) / 100) + "M";
							else if (Math.abs(oValue) >= 100000000 && Math.abs(oValue) < 1000000000)
								oValue = f.format(Math.floor(oValue / 100000) / 10) + "M";
							else if (Math.abs(oValue) >= 1000000000 && Math.abs(oValue) < 10000000000)
								oValue = f.format(Math.floor(oValue / 1000000) / 1000) + "G";
							else if (Math.abs(oValue) >= 10000000000 && Math.abs(oValue) < 100000000000)
								oValue = f.format(Math.floor(oValue / 10000000) / 100) + "G";
							else if (Math.abs(oValue) >= 100000000000 && Math.abs(oValue) < 1000000000000)
								oValue = f.format(Math.floor(oValue / 100000000) / 10) + "G";
							else if (Math.abs(oValue) >= 1000000000000 && Math.abs(oValue) < 10000000000000)
								oValue = f.format(Math.floor(oValue / 1000000000) / 1000) + "T";
							else if (Math.abs(oValue) >= 10000000000000 && Math.abs(oValue) < 100000000000000)
								oValue = f.format(Math.floor(oValue / 10000000000) / 100) + "T";
							else if (Math.abs(oValue) >= 100000000000000 && Math.abs(oValue) < 1000000000000000)
								oValue = f.format(Math.floor(oValue / 100000000000) / 10) + "T";
							else if (Math.abs(oValue) >= 1000000000000000)
								oValue = f.format(Math.floor(oValue / 1000000000000)) + "T";
						};
						return oValue.toString();
					},
					// updateCache : function () {
					// try {}
					// catch (e) {
					// console.debug("Addons.BaseScannerGUI.updateCache: ", e);
					// }
					// },
					// setWidgetLabels : function () {
					// try {
					// if (!this.ZL) {
					// this.FC();
					// }
					// this.ZL.setData(this.ZE);
					// } catch (e) {
					// console.debug("Addons.BaseScannerGUI.setWidgetLabels: ", e);
					// }
					// },
					FH : function () {
						try {
							var oBox = new qx.ui.layout.Flow();
							var oOptions = new qx.ui.container.Composite(oBox);
							this.ZC = new qx.ui.form.SelectBox();
							this.ZC.setHeight(25);
							this.ZC.setMargin(5);
							MT_Cache.updateCityCache();
							MT_Cache = window.MaelstromTools.Cache.getInstance();
							var cname;							
							for (cname in MT_Cache.Cities) {
								var item = new qx.ui.form.ListItem(cname, null, MT_Cache.Cities[cname].Object);
								this.ZC.add(item);
								if (Addons.LocalStorage.getserver("Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id()) {
									this.ZC.setSelection([item]);
								}
							}
							this.ZC.addListener("changeSelection", function (e) {								
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZC);

							var l = new qx.ui.basic.Label().set({
									value : this.T.get("CP Limit"),
									textColor : "white",
									margin : 5
								});
							oOptions.add(l);

							this.ZQ = new qx.ui.form.SelectBox();
							this.ZQ.setWidth(50);
							this.ZQ.setHeight(25);
							this.ZQ.setMargin(5);
							var limiter = Addons.LocalStorage.getserver("Basescanner_Cplimiter", 25);
							for (var m = 11; m < 42; m += 1) {
								item = new qx.ui.form.ListItem("" + m, null, m);
								this.ZQ.add(item);
								if (limiter == m) {
									this.ZQ.setSelection([item]);
								}
							}
							this.ZQ.addListener("changeSelection", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZQ);

							var la = new qx.ui.basic.Label().set({
									value : this.T.get("min Level"),
									textColor : "white",
									margin : 5
								});
							oOptions.add(la);
							var minlevel = Addons.LocalStorage.getserver("Basescanner_minLevel", "1");
							this.ZY = new qx.ui.form.TextField(minlevel).set({
									width : 50
								});
							oOptions.add(this.ZY);

							this.ZK = [];
							this.ZK[0] = new qx.ui.form.CheckBox(this.T.get("Player"));
							this.ZK[0].setMargin(5);
							this.ZK[0].setTextColor("white");
							this.ZK[0].setValue(Addons.LocalStorage.getserver("Basescanner_Show0", false));
							this.ZK[0].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[0]);
							this.ZK[1] = new qx.ui.form.CheckBox(this.T.get("Bases"));
							this.ZK[1].setMargin(5);
							this.ZK[1].setTextColor("white");
							this.ZK[1].setValue(Addons.LocalStorage.getserver("Basescanner_Show1", false));
							this.ZK[1].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[1]);
							this.ZK[2] = new qx.ui.form.CheckBox(this.T.get("Outpost"));
							this.ZK[2].setMargin(5);
							this.ZK[2].setTextColor("white");
							this.ZK[2].setValue(Addons.LocalStorage.getserver("Basescanner_Show2", false));
							this.ZK[2].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[2]);
							this.ZK[3] = new qx.ui.form.CheckBox(this.T.get("Camp"));
							this.ZK[3].setMargin(5);
							this.ZK[3].setTextColor("white");
							this.ZK[3].setValue(Addons.LocalStorage.getserver("Basescanner_Show3", true));
							this.ZK[3].addListener("changeValue", function (e) {
								this.ZE = [];
								this.FP(0, 1, 200);
								this.ZH = false;
								this.ZG.setLabel(this.T.get("Scan"));
							}, this);
							oOptions.add(this.ZK[3], {
								lineBreak : true
							});

							this.ZG = new qx.ui.form.Button(this.T.get("Scan")).set({
									width : 100,
									minWidth : 100,
									maxWidth : 100,
									height : 25,
									margin : 5
								});
							this.ZG.addListener("execute", function () {

								this.FE();
							}, this);
							oOptions.add(this.ZG);

							var border = new qx.ui.decoration.Single(2, "solid", "blue");
							this.ZV = new qx.ui.container.Composite(new qx.ui.layout.Basic()).set({
									decorator : border,
									backgroundColor : "red",
									allowGrowX : false,
									height : 20,
									width : 200
								});
							this.ZU = new qx.ui.core.Widget().set({
									decorator : null,
									backgroundColor : "green",
									width : 0
								});
							this.ZV.add(this.ZU);
							this.ZX = new qx.ui.basic.Label("").set({
									decorator : null,
									textAlign : "center",
									width : 200
								});
							this.ZV.add(this.ZX, {
								left : 0,
								top : -3
							});
							oOptions.add(this.ZV);

							this.YZ = new qx.ui.form.Button(this.T.get("clear Cache")).set({
									minWidth : 100,
									height : 25,
									margin : 5
								});
							this.YZ.addListener("execute", function () {
								this.ZZ = [];
							}, this);
							oOptions.add(this.YZ);

							this.ZK[4] = new qx.ui.form.CheckBox(this.T.get("Only center on World"));
							this.ZK[4].setMargin(5);
							this.ZK[4].setTextColor("white");
							oOptions.add(this.ZK[4], {
								lineBreak : true
							});

							this.ZJ = new qx.ui.form.SelectBox();
							this.ZJ.setWidth(150);
							this.ZJ.setHeight(25);
							this.ZJ.setMargin(5);
							var item = new qx.ui.form.ListItem("7 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 5 " + this.T.get(MaelstromTools.Statics.Crystal), null, 7);
							this.ZJ.add(item);
							item = new qx.ui.form.ListItem("6 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 6 " + this.T.get(MaelstromTools.Statics.Crystal), null, 6);
							this.ZJ.add(item);
							item = new qx.ui.form.ListItem("5 " + this.T.get(MaelstromTools.Statics.Tiberium) + " 7 " + this.T.get(MaelstromTools.Statics.Crystal), null, 5);
							this.ZJ.add(item);
							oOptions.add(this.ZJ);
							this.ZD = new qx.ui.form.Button(this.T.get("Get Layouts")).set({
									width : 120,
									minWidth : 120,
									maxWidth : 120,
									height : 25,
									margin : 5
								});
							this.ZD.addListener("execute", function () {
								var layout = window.Addons.BaseScannerLayout.getInstance();
								layout.openWindow(this.T.get("BaseScanner Layout"));
							}, this);
							this.ZD.setEnabled(false);
							oOptions.add(this.ZD);

							this.ZB = new qx.ui.container.Composite();
							this.ZB.setLayout(new qx.ui.layout.Flow());
							this.ZB.setWidth(750);
							//oOptions.add(this.ZB, {flex:1});

							var J = webfrontend.gui.layout.Loader.getInstance();
							//var L = J.getLayout("playerbar", this);
							//this._ZZ = J.getElement(L, "objid", 'lblplayer');


							//this.tableSettings = new qx.ui.groupbox.GroupBox("Visable Columns");
							//box.add(this.tableSettings, {flex:1});
							var k = 2;
							for (k = 2; k < this.ZL.getColumnCount(); k++) {
								var index = k - 2;

								this.ZR[index] = new qx.ui.form.CheckBox(this.ZL.getColumnName(k));
								this.ZR[index].setValue(this.ZN.getTableColumnModel().isColumnVisible(k));
								this.ZR[index].setTextColor("white");
								this.ZR[index].index = k;
								this.ZR[index].table = this.ZN;
								this.ZR[index].addListener("changeValue", function (e) {
									//console.log("click", e, e.getData(), this.index);
									var tcm = this.table.getTableColumnModel();
									tcm.setColumnVisible(this.index, e.getData());
									Addons.LocalStorage.setserver("Basescanner_Column_" + this.index, e.getData());
								});
								this.ZB.add(this.ZR[index]);
								//this.tableSettings.add( this.ZR[index] );
							}

							this.ZO = new qx.ui.form.Button("+").set({
									margin : 5
								});
							this.ZO.addListener("execute", function () {
								if (this.ZI) {
									oOptions.addAfter(this.ZB, this.ZO);
									this.ZO.setLabel("-");
								} else {
									oOptions.remove(this.ZB);
									this.ZO.setLabel("+");
								}
								this.ZI = !this.ZI;
							}, this);
							this.ZO.setAlignX("right");
							oOptions.add(this.ZO, {
								lineBreak : true
							});

							this.ZF = oOptions;

						} catch (e) {
							console.debug("Addons.BaseScannerGUI.createOptions: ", e);
						}
					},
					FD : function () {
						//0.7
						//var n = ClientLib.Data.MainData.GetInstance().get_Cities();
						//var i = n.get_CurrentOwnCity();
						var st = '<a href="https://sites.google.com/site/blindmanxdonate" target="_blank">Support Development of BlinDManX Addons</a>';
						var l = new qx.ui.basic.Label().set({
								value : st,
								rich : true,
								width : 800
							});
						this.ZP = l;
					},
					FE : function () {
						var selectedBase = this.ZC.getSelection()[0].getModel();
						ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(selectedBase.get_PosX(), selectedBase.get_PosY()); //Load data of region
						ClientLib.Vis.VisMain.GetInstance().Update();
						ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
						ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(selectedBase.get_Id());

						if (this.ZT) {
							var obj = ClientLib.Data.WorldSector.WorldObjectCity.prototype;
							// var fa = foundfnkstring(obj['$ctor'], /=0;this\.(.{6})=g>>7&255;.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectCity", 2);
							var fa = foundfnkstring(obj['$ctor'], /this\.(.{6})=\(?\(?g>>8\)?\&.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectCity", 2);
							if (fa != null && fa[1].length == 6) {
								obj.getLevel = function () {
									return this[fa[1]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectCity.Level undefined");
							}
							if (fa != null && fa[2].length == 6) {
								obj.getID = function () {
									return this[fa[2]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectCity.ID undefined");
							}

							obj = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype;
							//var fb = foundfnkstring(obj['$ctor'], /100;this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCBase", 2);
							var fb = foundfnkstring(obj['$ctor'], /100\){0,1};this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCBase", 2);
							if (fb != null && fb[1].length == 6) {
								obj.getLevel = function () {
									return this[fb[1]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.Level undefined");
							}
							if (fb != null && fb[2].length == 6) {
								obj.getID = function () {
									return this[fb[2]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.ID undefined");
							}

							obj = ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype;
							//var fc = foundfnkstring(obj['$ctor'], /100;this\.(.{6})=Math.floor.*=-1;\}this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCCamp", 2);
							var fc = foundfnkstring(obj['$ctor'], /100\){0,1};this\.(.{6})=Math.floor.*this\.(.{6})=\(*g\>\>(22|0x16)\)*\&.*=-1;\}this\.(.{6})=\(/, "ClientLib.Data.WorldSector.WorldObjectNPCCamp", 4);
							if (fc != null && fc[1].length == 6) {
								obj.getLevel = function () {
									return this[fc[1]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.Level undefined");
							}
							if (fc != null && fc[2].length == 6) {
								obj.getCampType = function () {
									return this[fc[2]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.CampType undefined");
							}

							if (fc != null && fc[4].length == 6) {
								obj.getID = function () {
									return this[fc[4]];
								};
							} else {
								console.error("Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.ID undefined");
							}
							this.ZT = false;
						}

						//Firstscan
						if (this.ZE == null) {
							this.ZH = false;
							this.ZG.setLabel("Pause");
							this.ZD.setEnabled(false);
							window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FJ()", 1000);
							return;
						}
						//After Pause
						var c = 0;
						for (i = 0; i < this.ZE.length; i++) {
							if (this.ZE[i][1] == -1) {
								c++;
							}
						}

						if (!this.ZH) {
							this.ZG.setLabel("Pause");
							this.ZD.setEnabled(false);
							if (c > 0) {
								this.ZH = true;
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", 1000);
								return;
							} else {
								this.ZH = false;
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FJ()", 1000);
							}
						} else {
							this.ZH = false;
							this.ZG.setLabel(this.T.get("Scan"));
						}

					},
					FP : function (value, max, maxwidth) {
						if (this.ZU != null && this.ZX != null) {
							this.ZU.setWidth(parseInt(value / max * maxwidth, 10));
							this.ZX.setValue(value + "/" + max);
						}
					},
					FJ : function () {
						try {
							this.ZM = {};
							this.ZE = [];
							var selectedBase = this.ZC.getSelection()[0].getModel();
							Addons.LocalStorage.setserver("Basescanner_LastCityID", selectedBase.get_Id());
							var ZQ = this.ZQ.getSelection()[0].getModel();
							Addons.LocalStorage.setserver("Basescanner_Cplimiter", ZQ);
							Addons.LocalStorage.setserver("Basescanner_minLevel", this.ZY.getValue());

							var c1 = this.ZK[0].getValue();
							var c2 = this.ZK[1].getValue();
							var c3 = this.ZK[2].getValue();
							var c4 = this.ZK[3].getValue();
							var c5 = parseInt(this.ZY.getValue(), 10);
							//console.log("Select", c1, c2, c3,c4,c5);
							Addons.LocalStorage.setserver("Basescanner_Show0", c1);
							Addons.LocalStorage.setserver("Basescanner_Show1", c2);
							Addons.LocalStorage.setserver("Basescanner_Show2", c3);
							Addons.LocalStorage.setserver("Basescanner_Show3", c4);
							var posX = selectedBase.get_PosX();
							var posY = selectedBase.get_PosY();
							var scanX = 0;
							var scanY = 0;
							var world = ClientLib.Data.MainData.GetInstance().get_World();
							console.info("Scanning from: " + selectedBase.get_Name());

							// world.CheckAttackBase (System.Int32 targetX ,System.Int32 targetY) -> ClientLib.Data.EAttackBaseResult
							// world.CheckAttackBaseRegion (System.Int32 targetX ,System.Int32 targetY) -> ClientLib.Data.EAttackBaseResult
							var t1 = true;
							var t2 = true;
							var t3 = true;

							var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
							for (scanY = posY - Math.floor(maxAttackDistance + 1); scanY <= posY + Math.floor(maxAttackDistance + 1); scanY++) {
								for (scanX = posX - Math.floor(maxAttackDistance + 1); scanX <= posX + Math.floor(maxAttackDistance + 1); scanX++) {
									var distX = Math.abs(posX - scanX);
									var distY = Math.abs(posY - scanY);
									var distance = Math.sqrt((distX * distX) + (distY * distY));
									if (distance <= maxAttackDistance) {
										var object = world.GetObjectFromPosition(scanX, scanY);
										var loot = {};
										if (object) {
											//console.log(object);

											if (object.Type == 1 && t1) {
												//console.log("object typ 1");
												//objfnkstrON(object);
												//t1 = !t1;
											}
											if (object.Type == 2 && t2) {
												//console.log("object typ 2");
												//objfnkstrON(object);
												//t2 = !t2;
											}

											if (object.Type == 3 && t3) {

												//console.log("object typ 3");
												//objfnkstrON(object);
												//t3 = !t3;
											}

											if (object.Type == 3) {
												if (c5 <= parseInt(object.getLevel(), 10)) {
													//console.log(object);
												}
											}

											//if(object.ConditionBuildings>0){
											var needcp = selectedBase.CalculateAttackCommandPointCostToCoord(scanX, scanY);
											if (needcp <= ZQ && typeof object.getLevel == 'function') {
												if (c5 <= parseInt(object.getLevel(), 10)) {
													// 0:ID , 1:Scanned, 2:Name, 3:Location, 4:Level, 5:Tib, 6:Kristal, 7:Credits, 8:Forschung, 9:Kristalfelder, 10:Tiberiumfelder,
													// 11:ConditionBuildings,12:ConditionDefense,13: CP pro Angriff , 14: defhp/offhp , 15:sum tib,krist,credits, 16: sum/cp
													var d = this.FL(object.getID(), 0);
													var e = this.FL(object.getID(), 1);
													if (e != null) {
														this.ZM[object.getID()] = e;
													}

													if (object.Type == 1 && c1) { //User
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															this.ZE.push(d);
														} else {
															this.ZE.push([object.getID(),  - 1, this.T.get("Player"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
														}
													}
													if (object.Type == 2 && c2) { //basen
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															this.ZE.push(d);
														} else {
															this.ZE.push([object.getID(),  - 1, this.T.get("Bases"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
														}
													}
													if (object.Type == 3 && (c3 || c4)) { //Lager Vposten
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															if (object.getCampType() == 2 && c4) {
																this.ZE.push(d);
															}
															if (object.getCampType() == 3 && c3) {
																this.ZE.push(d);
															}

														} else {
															if (object.getCampType() == 2 && c4) {
																this.ZE.push([object.getID(),  - 1, this.T.get("Camp"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
															}
															if (object.getCampType() == 3 && c3) {
																this.ZE.push([object.getID(),  - 1, this.T.get("Outpost"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0]);
															}
														}
													}
												}
											}
											//}
										}
									}
								}
							}
							this.ZH = true;
							this.ZL.setData(this.ZE);
							this.FP(0, this.ZE.length, 200);
							this.ZL.sortByColumn(4, false); //Sort form Highlevel to Lowlevel
							if (this.YY.name != "DR01D")
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", 50);
						} catch (ex) {
							console.debug("Maelstrom_Basescanner FJ error: ", ex);
						}
					},
					FG : function () {
						try {
							var retry = false;
							var loops = 0;
							var maxLoops = 10;
							var i = 0;
							var sleeptime = 150;
							while (!retry) {
								var ncity = null;
								var selectedid = 0;
								var id = 0;
								if (this.ZE == null) {
									console.warn("data null: ");
									this.ZH = false;
									break;
								}
								for (i = 0; i < this.ZE.length; i++) {
									// 1= "LoadState"
									if (this.ZE[i][1] == -1) {
										break;
									}
								}

								if (i == this.ZE.length) {
									this.ZH = false;
								}
								this.FP(i, this.ZE.length, 200); //Progressbar
								if (this.ZE[i] == null) {
									console.warn("data[i] null: ");
									this.ZH = false;
									this.ZG.setLabel(this.T.get("Scan"));
									this.ZD.setEnabled(true);
									break;
								}
								posData = this.ZE[i][3];
								/* make sure coordinates are well-formed enough */
								if (posData != null && posData.split(':').length == 2) {
									posX = parseInt(posData.split(':')[0]);
									posY = parseInt(posData.split(':')[1]);
									/* check if there is any base */
									var playerbase = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
									var world = ClientLib.Data.MainData.GetInstance().get_World();
									var foundbase = world.CheckFoundBase(posX, posY, playerbase.get_PlayerId(), playerbase.get_AllianceId());
									//console.log("foundbase",foundbase);
									this.ZE[i][19] = (foundbase == 0) ? true : false;
									//var obj = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
									//console.log("obj", obj);
									id = this.ZE[i][0];
									ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(id);
									ncity = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(id);
									//console.log("ncity", ncity);
									if (ncity != null) {
										if (!ncity.get_IsGhostMode()) {
											//if(ncity.get_Name() != null)
											//console.log("ncity.get_Name ", ncity.get_Name() , ncity.get_CityBuildingsData().get_Buildings());
											//var cityBuildings = ncity.get_CityBuildingsData();
											var cityUnits = ncity.get_CityUnitsData();
											if (cityUnits != null) { // cityUnits !=null können null sein
												//console.log("ncity.cityUnits", cityUnits );

												var selectedBase = this.ZC.getSelection()[0].getModel();
												var buildings = ncity.get_Buildings().d;
												var defenseUnits = cityUnits.get_DefenseUnits().d;
												var offensivUnits = selectedBase.get_CityUnitsData().get_OffenseUnits().d;
												//console.log(buildings,defenseUnits,offensivUnits);

												if (buildings != null) //defenseUnits !=null können null sein
												{
													var buildingLoot = getResourcesPart(buildings);
													var unitLoot = getResourcesPart(defenseUnits);

													//console.log("buildingLoot", buildingLoot);
													//console.log("unitLoot", unitLoot);
													this.ZE[i][2] = ncity.get_Name();
													this.ZE[i][5] = buildingLoot[ClientLib.Base.EResourceType.Tiberium] + unitLoot[ClientLib.Base.EResourceType.Tiberium];
													this.ZE[i][6] = buildingLoot[ClientLib.Base.EResourceType.Crystal] + unitLoot[ClientLib.Base.EResourceType.Crystal];
													this.ZE[i][7] = buildingLoot[ClientLib.Base.EResourceType.Gold] + unitLoot[ClientLib.Base.EResourceType.Gold];
													this.ZE[i][8] = buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + unitLoot[ClientLib.Base.EResourceType.ResearchPoints];
													//console.log(posX,posY,"GetBuildingsConditionInPercent", ncity.GetBuildingsConditionInPercent() );
													if (ncity.GetBuildingsConditionInPercent() != 0) {
														this.ZA = 0;
														if (this.ZE[i][5] != 0) {
															var c = 0;
															var t = 0;
															var m = 0;
															var k = 0;
															var l = 0;
															this.ZM[id] = new Array(9);
															for (m = 0; m < 9; m++) {
																this.ZM[id][m] = new Array(8);
															}
															for (k = 0; k < 9; k++) {
																for (l = 0; l < 8; l++) {
																	//console.log( ncity.GetResourceType(k,l) );
																	switch (ncity.GetResourceType(k, l)) {
																	case 1:
																		/* Crystal */
																		this.ZM[id][k][l] = 1;
																		c++;
																		break;
																	case 2:
																		/* Tiberium */
																		this.ZM[id][k][l] = 2;
																		t++;
																		break;
																	default:
																		//none
																		break;
																	}
																}
															}
															//console.log( c,t );


															this.ZE[i][9] = c;
															this.ZE[i][10] = t;
															this.ZE[i][11] = ncity.GetBuildingsConditionInPercent();
															this.ZE[i][12] = ncity.GetDefenseConditionInPercent();

															try {
																var u = offensivUnits;
																//console.log("OffenseUnits",u);
																var offhp = 0;
																var defhp = 0;
																for (var g in u) {
																	offhp += u[g].get_Health();
																}

																u = defenseUnits;
																//console.log("DefUnits",u);
																for (var g in u) {
																	defhp += u[g].get_Health();
																}

																u = buildings;
																//console.log("DefUnits",u);
																for (var g in u) {
																	//var id=0;
																	//console.log("MdbUnitId",u[g].get_MdbUnitId());
																	var mid = u[g].get_MdbUnitId();
																	//DF
																	if (mid == 158 || mid == 131 || mid == 195) {
																		this.ZE[i][18] = 8 - u[g].get_CoordY();
																	}
																	//CY
																	if (mid == 112 || mid == 151 || mid == 177) {
																		this.ZE[i][17] = 8 - u[g].get_CoordY();
																	}
																}

																//console.log("HPs",offhp,defhp, (defhp/offhp) );
															} catch (x) {
																console.debug("HPRecord", x);
															}
															//this.ZE[i][14] = (defhp / offhp);
															//console.log(this.ZM[id]);
															this.ZE[i][14] = this.maaain(id);

															this.ZE[i][15] = this.ZE[i][5] + this.ZE[i][6] + this.ZE[i][7];
															this.ZE[i][16] = this.ZE[i][15] / this.ZE[i][13];

															this.ZE[i][1] = 0;
															retry = true;
															console.info(ncity.get_Name(), " finish");
															this.ZA = 0;
															this.countlastidchecked = 0;
															//console.log(this.ZE[i],this.ZM[id],id);
															this.FK(this.ZE[i], this.ZM[id], id);
															//update table
															this.ZL.setData(this.ZE);
														}
													} else {
														if (this.ZA > 250) {
															console.info(this.ZE[i][2], " on ", posX, posY, " removed (GetBuildingsConditionInPercent == 0)");
															this.ZE.splice(i, 1); //entfernt element aus array
															this.ZA = 0;
															this.countlastidchecked = 0;
															break;
														}
														this.ZA++;
													}
												}
											}
										} else {
											console.info(this.ZE[i][2], " on ", posX, posY, " removed (IsGhostMode)");
											this.ZE.splice(i, 1); //entfernt element aus array
											break;
										}
									}
								}
								loops++;
								if (loops >= maxLoops) {
									retry = true;
									break;
								}
							}

							//console.log("getResourcesByID end ", this.ZH, Addons.BaseScannerGUI.getInstance().isVisible());
							if (this.lastid != i) {
								this.lastid = i;
								this.countlastidchecked = 0;
								this.ZA = 0;
							} else {
								if (this.countlastidchecked > 16) {
									console.info(this.ZE[i][2], " on ", posX, posY, " removed (found no data)");
									this.ZE.splice(i, 1); //entfernt element aus array
									this.countlastidchecked = 0;
								} else if (this.countlastidchecked > 10) {
									sleeptime = 500;
								} else if (this.countlastidchecked > 4) {
									sleeptime = 250;
								}
								this.countlastidchecked++;
							}
							//console.log("this.ZH", this.ZH);
							if (this.ZH && Addons.BaseScannerGUI.getInstance().isVisible()) {
								//console.log("loop");
								window.setTimeout("window.Addons.BaseScannerGUI.getInstance().FG()", sleeptime);
							} else {
								this.ZG.setLabel(this.T.get("Scan"));
								this.ZH = false;
							}
						} catch (e) {
							console.debug("MaelstromTools_Basescanner getResources", e);
						}
					},
					FK : function (dataa, datab, id) {
						this.ZZ.push(dataa);
						this.ZS[id] = datab;
					},
					FL : function (id, t) {
						if (t == 0) {
							for (var i = 0; i < this.ZZ.length; i++) {
								if (this.ZZ[i][0] == id) {
									return this.ZZ[i];
								}
							}
						} else {
							if (this.ZS[id]) {
								return this.ZS[id];
							}
						}
						return null;
					},


maaain : function (ied)
{   
  var fixbld = 0;
  var opty = 1;//-mySlider.conf.value;//document.getElementById("cylvl").value;
  var optd = 5;//-mySlider2.conf.value;//document.getElementById("dflvl").value;
  var reflag = 1;//-mySlider3.conf.value;//document.getElementById("reflvl").value;
  var recovery = 0.5;//mySlider0.conf.value;//document.getElementById("mvrec").value;
  //var cncoptt = document.getElementById("cncopt").value;
  var alliancerank = 20;//mySlider4.conf.value;//document.getElementById("mvrec").value;
  //console.log(mySlider.conf.value);
  
  
var globaa=this.initializ();  //have silo harv plnt accu defined etc
var addref=1; //whether to add refineries at all
var grid=[1, 1.25, 2.5]; var grdln=grid.length;  //grid search for power weight
var gridc=[1, 1.15]; var grdcln=gridc.length; //grid search for crystal weight
//optimize over
var acnum=2; //number of accumulators to place
var opta=0.8; //weight on slots when placing accumulators: 0 for max power, 0.8 to account for slots used
var optt=3.5; //how many touches in silos to tolerate (3, 3.5, 4)
var refwghb=1.09594661; //weight on refineries   1.32 is 3 levels
//refwghb=1.32^0.33; %weight on refineries   1.32 is 3 levels
var refwgh=Math.pow(refwghb,(2-reflag));
//roi weights
//    t p cry cre
var wgh=[1,1,1,refwgh];
var parms=[optt, opta, opty, optd, recovery,acnum,addref,alliancerank];
//// list of optimization options combinations
////optt acnum opta
if (fixbld===1) {    var optns=[[3.5,  1, 0.8]]; }
else {var optns=[[3, 1, 0.8], [3.5, 1, 0.8], [4, 1, 0.8], [4, 2, 0.3]];}
             //cncoptt=get(handles.edit1,'String');
iqll=0;

var map=[[".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."]];
for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
  if (this.ZM[ied][kk2][jj2]===2){map[jj2][kk2]="t";}
  if (this.ZM[ied][kk2][jj2]===1){map[jj2][kk2]="c";}
}}

var tmp=this.fillin_v2(map,parms);  
var bld=tmp[0];
var lvl=tmp[1];

    //progressbar(0);
    var map0_=new Array();
    var lvl0_=new Array();
    var grrt0_=new Array();
    var wgh_=new Array();
    var stats0_=new Array();
    var opts0_=new Array();
    var bss__0=new Array();
    var off__0=new Array();
    var bll__0=new Array();
    var ttm__0=new Array();
    var hrv__0=new Array();

    for (var iql=0;iql<optns.length;iql++)   //MAIN LOOP
    {   //// main loop
        var optt=optns[iql][0]; //how many touches in silos to tolerate (3, 3.5, 4)
        var acnum=optns[iql][1]; //number of accumulators to place
        var opta=optns[iql][2]; //weight on slots when placing accumulators: 0 for max power, 0.8 to account for slots used
        var parms=[optt, opta, opty, optd, recovery,acnum,addref,alliancerank];
        var tmp=this.fillin_v2(map,parms);  
        var bld=tmp[0];
        var lvl=tmp[1];
        //do not repeat if already done the simulation
        mmin=10;
        if (iqll>0)
        {    for (var wex=0;wex<iqll;wex++)
             {      var ccnntt=0;    
                    for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
                        if (bld[jj2][kk2]!==map0_[wex]) {ccnntt++;}
                    }}
                    if (ccnntt===0) {    mmin=0; }
             }
        }

        if (mmin>0)
        {    
            var wgh=[1,1,1,refwgh];
            var grrt_=new Array();  var map__=new Array(); var lvl__ =new Array();  var stats_=new Array();
            var bss___=new Array(); var off___ =new Array();  var bll___=new Array(); var ttm___=new Array(); var hrv___=new Array();
            for (var pwl=0;pwl<grid.length;pwl++)
            {     wgh[1]=grid[pwl];
                  for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
                      if (bld[jj2][kk2]==="." || bld[jj2][kk2]==="t" || bld[jj2][kk2]==="c") {lvl[jj2][kk2]=0;}
                      else {lvl[jj2][kk2]=12;}      
                  }}

                var tmp=this.operate_v2(bld,lvl,map,wgh,globaa,parms);
                //[bld, lvl, [bss00, bll00, off00], grrt, grrt0, str, T, ttm, ttime,bss_,off_,bll_,ttm,harvlvl]
                grrt_[pwl]=[tmp[3]*100,tmp[8]/24];
                map__[pwl]=tmp[0];
                lvl__[pwl]=tmp[1];
                stats_[pwl]=tmp[2];
                bss___[pwl]=tmp[9];
                off___[pwl]=tmp[10];
                bll___[pwl]=tmp[11];
                ttm___[pwl]=tmp[12];
                hrv___[pwl]=tmp[13];

                //progressbar((pwl+(iql-1)*(grdln+grdcln))/(1+(grdln+grdcln)*size(optns,1)));
            }
            var g0r=0; var m=0;
            for (var ox=0;ox<grrt_.length;ox++)
                {   if (grrt_[ox][0]>g0r) {g0r=grrt_[ox][0];var m=ox;}}
            wgh[1]=grid[m];

            var grrt_=new Array();  var map__=new Array(); var lvl__ =new Array();  var stats_=new Array();
            var bss___=new Array(); var off___ =new Array();  var bll___=new Array(); var ttm___=new Array(); var hrv___=new Array();
            for (var pwl=0;pwl<gridc.length;pwl++)
            {     wgh[2]=gridc[pwl];
                  for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
                      if (bld[jj2][kk2]==="." || bld[jj2][kk2]==="t" || bld[jj2][kk2]==="c") {lvl[jj2][kk2]=0;}
                      else {lvl[jj2][kk2]=12;}      
                  }}

                var tmp=this.operate_v2(bld,lvl,map,wgh,globaa,parms);
                //[bld, lvl, [bss00, bll00, off00], grrt, grrt0, str, T, ttm, ttime]
                grrt_[pwl]=[tmp[3]*100,tmp[8]/24];
                map__[pwl]=tmp[0];
                lvl__[pwl]=tmp[1];
                stats_[pwl]=tmp[2];              
                bss___[pwl]=tmp[9];
                off___[pwl]=tmp[10];
                bll___[pwl]=tmp[11];
                ttm___[pwl]=tmp[12];
                hrv___[pwl]=tmp[13];

//                progressbar((pwl+grdln+(iql-1)*(grdln+grdcln))/(1+(grdln+grdcln)*size(optns,1)));
            }
            var g0r=0; var m=0;
            for (var ox=0;ox<grrt_.length;ox++)
            {   if (grrt_[ox][0]>g0r) {g0r=grrt_[ox][0];var m=ox;}}
            wgh[2]=gridc[m];
            map0_[iqll]=map__[m];
            lvl0_[iqll]=lvl__[m];
            grrt0_[iqll]=grrt_[m];
            wgh_[iqll]=wgh;
            stats0_[iqll]=stats_[m];
            bss__0[iqll]=bss___[m];
            off__0[iqll]=off___[m];
            bll__0[iqll]=bll___[m];
            ttm__0[iqll]=ttm___[m];
            hrv__0[iqll]=hrv___[m];
            opts0_[iqll]=optns[iql];
            iqll=iqll+1;
        }
    }
    var g0r=0; var m=0;
    for (var ox=0;ox<grrt0_.length;ox++)
    {   if (grrt0_[ox][0]>g0r) {g0r=grrt0_[ox][0]; var m=ox;}}
    var optns0=opts0_[m];
    var wgh0=wgh_[m];
    var bss__f=bss__0[m];
    var off__f=off__0[m];
    var bll__f=bll__0[m];
    var ttm__f=ttm__0[m];
    var hrv__f=hrv__0[m];

//// report best outcome
//    ddat=get(handles.uitable1,'Data');
//    ddat{1,2}=bname;
    optt=optns0[0]; //how many touches in silos to tolerate (3, 3.5, 4)
    acnum=optns0[1]; //number of accumulators to place
    opta=optns0[2]; //weight on slots when placing accumulators: 0 for max power, 0.8 to account for slots used
    var bldr=map0_[m]; var lvlr=lvl0_[m];
    //console.log("Optimal Base Layout:")
    //console.log(cncoptpluss)
    //cncoptpluss=[cncoptt(1:rmv),ttx,mmp(jj0:length(mmp)),cncoptt(fnsh-1:length(cncoptt))];
    //set(handles.edit2,'String',cncoptpluss);
//    console.log("Growth rate: "+grrt0_[m][0].toFixed(2)+"%")
//    console.log("Time to fortress: " + grrt0_[m][1].toFixed(0)+" days")
    var tiblag=(3.5*(4.25-grrt0_[m][0]));
//    if (tiblag>=0) {  var ch1=String.fromCharCode(65+tiblag);} else {var ch1="A+";}
//    console.log("Tiberium grade: "+ch1)
    var crylag=1.5*(45-stats0_[m][2]);
//    if ((crylag+tiblag)>=0) {  var ch2=String.fromCharCode(65+crylag+tiblag);} else {var ch2="A+";}
//    console.log("Crystal grade: "+ch2)
    var crelag=2.5*(8-stats0_[m][0]);
    ///////////console.log([stats0_[m][0],crelag]);
//    if ((crelag+tiblag)>=0) {  var ch3=String.fromCharCode(65+crelag+tiblag);} else {var ch3="A+";}
//    console.log("Credit grade: "+ch3)
//    console.log("Weight on power: "+wgh0[1])
//    var eww=0;
//    if (typeof variable !== 'undefined') {var eww=multiple_dataset2.length};
    // the variable is defined
 
    return grrt0_[m][0].toFixed(2);
},
  
  
  
  
 //functions used inside are defined below

maxx: function (arr) {   var cc=new Array(); for (var xp=0;xp<arr.length;xp++){   cc[xp]=arr[xp].sort()[arr[xp].length-1];} return cc.sort()[cc.length-1]},

summ: function (arr){ var cc=0; for (jj2=0;jj2<arr.length;jj2++){  for (kk2=0;kk2<arr[jj2].length;kk2++) { cc=cc+arr[jj2][kk2]; }} return cc; },

transpose: function (arr)
{   var rows=arr.length;        var cols=arr[0].length;        var arrt=new Array();
    for (var jj=0;jj<cols;jj++) { var arrtt=new Array();  for (var kk=0;kk<rows;kk++) {   arrtt[kk]=arr[kk][jj]; } arrt[jj]=arrtt; }
    return arrt; },

interp1: function (xgrid,ygrid,xeval)
{   if (xgrid.length!==ygrid.length) {return 0;} else if (xeval<=xgrid[0]) {return ygrid[0];} else if (xeval>=xgrid[(xgrid.length-1)]) {return ygrid[(xgrid.length-1)];}
    else {   for(var jj=0;jj<(xgrid.length-1);jj++) {   if (xeval>xgrid[jj] && xeval<=xgrid[jj+1]) {   return ygrid[jj]+(ygrid[jj+1]-ygrid[jj])*(xeval-xgrid[jj])/(xgrid[jj+1]-xgrid[jj]);}  }  }    },


operate_v2: function (bld0,lvl0,map0,wgh,globaa,parms)
{//// compute the time it takes to grow fast enough tiberium-wise
    var bld=[[".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."]];
    for (jj2=0;jj2<bld.length;jj2++){  for (kk2=0;kk2<bld[jj2].length;kk2++) {
        bld[jj2][kk2]=bld0[jj2][kk2];    }}
    var map=[[".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."]];
    for (jj2=0;jj2<map.length;jj2++){  for (kk2=0;kk2<map[jj2].length;kk2++) {
        map[jj2][kk2]=map0[jj2][kk2];    }}
    var lvl=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    for (jj2=0;jj2<lvl.length;jj2++){  for (kk2=0;kk2<lvl[jj2].length;kk2++) {
        lvl[jj2][kk2]=lvl0[jj2][kk2];    }}
    var resrcs=[0, 0, 0, 0];    var ttime=0;        var mvr=0;    var balvl=12;
    var alliancerank=parms[7];
    var allbonus=Math.exp(7+0.2121*(balvl+1-alliancerank));
    var tmp = this.payoff(bld,lvl,map,wgh,mvr,balvl,globaa,parms); //all roi    //    [roi,tibr,powr,cryr,crer,tibc,powc,tibw,poww,cryw,tibrb,powrb,cryrb,crerb]
    var roi=tmp[0];var tibr=tmp[1];var powr=tmp[2];var cryr=tmp[3];var crer=tmp[4];var tibc=tmp[5];var powc=tmp[6];var tibw=tmp[7];var poww=tmp[8];var cryw=tmp[9];var tibrb=tmp[10];var powrb=tmp[11];var cryrb=tmp[12];var crerb=tmp[13];
    var roip=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    var roit=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
        if (bld[jj2][kk2]==="h" || bld[jj2][kk2]==="s")
            { roip[jj2][kk2]=NaN; } else { roip[jj2][kk2]=roi[jj2][kk2]; }
        if (bld[jj2][kk2]==="a" || bld[jj2][kk2]==="p")
            { roit[jj2][kk2]=NaN; } else { roit[jj2][kk2]=roi[jj2][kk2]; }
    }}
    var ofns=globaa[14];    var ofns_s=globaa[15];
    mcv=[[1, 0, 0],[2, 1800000, 0], [3, 12000000, 0],[4, 60000000, 0],[5, 250000000, 0],[6, 1000000000, 0],[7, 3900000000, 0],[8, 14800000000, 0],[9, 52000000000, 0],[10, 184000000000, 0],[11, 530000000000, 0]];
    mcv[0][2]=0;  for (var wl=1;wl<11;wl++) {    mcv[wl][2]=mcv[(wl-1)][2]+mcv[wl][1]; }
    mcv2=[[1, 8],[2, 12],[3, 18],[5, 26],[8, 40],[10, 50]];
    movrec=[[7, 1],[20, 6],[30, 12],[42, 24]];
    var allbonus=Math.exp(7+0.2121*(balvl+1-alliancerank));
    var ttibr=this.summ(tibr)+allbonus; var tpowr=this.summ(powr)+allbonus; var tcryr=this.summ(cryr)+allbonus; var tcrer=this.summ(crer);
    var tret=[ttibr,tpowr,tcryr,tcrer]; var twort=[this.summ(tibw),this.summ(poww),this.summ(cryw)];
    var tt=0;
    var twortt=new Array();   twortt[tt]=[twort[0]+resrcs[0],twort[1]+resrcs[1],twort[2]+resrcs[2],0+resrcs[3]];
    var ttwortt=new Array();  ttwortt[tt]=twortt[tt][0]+twortt[tt][1]+twortt[tt][2]+twortt[tt][3];
    var bss_=new Array();    bss_[tt]=2;
    var off_=new Array();    off_[tt]=0;
    var lvl_=new Array();    lvl_[tt]=lvl;
    var bll_=new Array();    bll_[tt]=12;
    var smm=0; var ct=0;
    for (jj2=0;jj2<bld.length;jj2++){  for (kk2=0;kk2<bld[jj2].length;kk2++) {
        if (bld[jj2][kk2]==="h" || bld[jj2][kk2]==="n") { smm=smm+lvl[jj2][kk2]; ct++;}
    }}
    var harvlvl=new Array();
    harvlvl[tt]=smm/ct;
    var smm=0; var ct=0;
    for (jj2=0;jj2<bld.length;jj2++){  for (kk2=0;kk2<bld[jj2].length;kk2++) {
        if (bld[jj2][kk2]!=="." && bld[jj2][kk2]!=="t" && bld[jj2][kk2]!=="c") { smm=smm+lvl[jj2][kk2]; ct++;}
    }}
    var baselvl=new Array();      baselvl[tt]=smm/ct;
    var resid=new Array();        resid[tt]=[resrcs[0]/tret[0],resrcs[1]/tret[1],resrcs[2]/tret[2],resrcs[3]/tret[3]];
    var ttm=new Array();          ttm[tt]=ttime;
    var str=1;      var nwo=0;
while (balvl<43 && ttime<(400*24)) //end at around 100G tib aka base worth at level 43
{   var upgg=[0,0];var upgt=[0,0];var upgp=[0,0];
    var mroi=100000000000000;      var mroit=100000000000000;      var mroip=100000000000000;  
    for (jj2=0;jj2<bld.length;jj2++){  for (kk2=0;kk2<bld[jj2].length;kk2++) {
        if (roi[jj2][kk2] <mroi ) { upgg[0]=jj2; upgg[1]=kk2; mroi = roi[jj2][kk2];}
        if (roit[jj2][kk2]<mroit) { upgt[0]=jj2; upgt[1]=kk2; mroit=roit[jj2][kk2];}
        if (roip[jj2][kk2]<mroip) { upgp[0]=jj2; upgp[1]=kk2; mroip=roip[jj2][kk2];}
    }}
    if (resid[tt][0]>24)        {    var upg=[upgp[0],upgp[1]];      }
    else if (resid[tt][1]>24)   {    var upg=[upgt[0],upgt[1]];      }
    else    {    var upg=[upgg[0],upgg[1]];      }

    if (bld[upg[0]][upg[1]]!=="q")
    {   var tm=[(tibc[upg[0]][upg[1]]-resrcs[0])/ttibr,(powc[upg[0]][upg[1]]-resrcs[1])/tpowr,0];
        if (tm[0]>tm[1] && tm[0]>0)         {var tm0=tm[0];}
        else if (tm[1]>tm[0] && tm[1]>0)    {var tm0=tm[1];}
        else {var tm0=0;}
        ttime=ttime+tm0;        //accumulate resources and pay cost of upgrade
        resrcs[0]=resrcs[0]+tm0*ttibr-tibc[upg[0]][upg[1]];
        resrcs[1]=resrcs[1]+tm0*tpowr-powc[upg[0]][upg[1]];
        resrcs[2]=resrcs[2]+tm0*tcryr;
        resrcs[3]=resrcs[3]+tm0*tcrer;
        lvl[upg[0]][upg[1]]=lvl[upg[0]][upg[1]]+1;  //upgrade
    }
    else //spend crystal and power on defense
    {   var tm=[(tibc[upg[0]][upg[1]]-resrcs[2])/tcryr,(powc[upg[0]][upg[1]]-resrcs[1])/tpowr,0];
        if (tm[0]>tm[1] && tm[0]>0)            {var tm0=tm[0];}
        else if (tm[1]>tm[0] && tm[1]>0)       {var tm0=tm[1];}
        else {var tm0=0;}
        ttime=ttime+tm0;        //accumulate resources and pay cost of upgrade
        resrcs[0]=resrcs[0]+tm0*ttibr;
        resrcs[1]=resrcs[1]+tm0*tpowr-powc[upg[0]][upg[1]];
        resrcs[2]=resrcs[2]+tm0*tcryr-tibc[upg[0]][upg[1]];
        resrcs[3]=resrcs[3]+tm0*tcrer;
        lvl[upg[0]][upg[1]]=lvl[upg[0]][upg[1]]+1; //upgrade
    }
    lvl_[tt]=lvl;
    var tmp = this.payoff(bld,lvl,map,wgh,mvr,balvl,globaa,parms); //all roi    //    [roi,tibr,powr,cryr,crer,tibc,powc,tibw,poww,cryw,tibrb,powrb,cryrb,crerb]
    var roi=tmp[0];var tibr=tmp[1];var powr=tmp[2];var cryr=tmp[3];var crer=tmp[4];var tibc=tmp[5];var powc=tmp[6];var tibw=tmp[7];var poww=tmp[8];var cryw=tmp[9];var tibrb=tmp[10];var powrb=tmp[11];var cryrb=tmp[12];var crerb=tmp[13];
    var roip=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    var roit=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
        if (bld[jj2][kk2]==="h" || bld[jj2][kk2]==="s")
            { roip[jj2][kk2]=NaN; } else { roip[jj2][kk2]=roi[jj2][kk2]; }
        if (bld[jj2][kk2]==="a" || bld[jj2][kk2]==="p")
            { roit[jj2][kk2]=NaN; } else { roit[jj2][kk2]=roi[jj2][kk2]; }
    }}
    var twort=[this.summ(tibw),this.summ(poww),this.summ(cryw)];
    tt=tt+1;
    twortt[tt]=[twort[0]+resrcs[0],twort[1]+resrcs[1],twort[2]+resrcs[2],0+resrcs[3]];
    ttwortt[tt]=twortt[tt][0]+twortt[tt][1]+twortt[tt][2]+twortt[tt][3];
    var smm=0; var ct=0;
    for (jj2=0;jj2<bld.length;jj2++){  for (kk2=0;kk2<bld[jj2].length;kk2++) {
        if (bld[jj2][kk2]==="h" || bld[jj2][kk2]==="n") { smm=smm+lvl[jj2][kk2]; ct++;}
    }}
    harvlvl[tt]=smm/ct;
    var smm=0; var ct=0;
    for (jj2=0;jj2<bld.length;jj2++){  for (kk2=0;kk2<bld[jj2].length;kk2++) {
        if (bld[jj2][kk2]!=="." && bld[jj2][kk2]!=="t" && bld[jj2][kk2]!=="c") { smm=smm+lvl[jj2][kk2]; ct++;}
    }}
    baselvl[tt]=smm/ct;
    //bnchmrk;
    var offgrd=new Array(); var offval=new Array();
    for (var jj=0;jj<60;jj++){  offgrd[jj]=ofns_s[jj][0];   offval[jj]=jj+1;}
    var balvl=this.interp1(offgrd,offval,(twort[0]+resrcs[0]));
    var bses0=this.interp1(this.transpose(mcv2)[1],this.transpose(mcv2)[0],balvl);
    var offlvl=this.interp1(offgrd,offval,(resrcs[2]*(bses0-1)));
    var bses=this.interp1(this.transpose(mcv)[2],this.transpose(mcv)[0],resrcs[3]*(bses0-1));
    var mvr=this.interp1(this.transpose(movrec)[0],this.transpose(movrec)[1],balvl);
    if (mvr>24) {mvr=24;}
    var recovery=parms[4];
    mvr=mvr*recovery;
    //
    var allbonus=Math.exp(7+0.2121*(balvl+1-alliancerank));
    var ttibr=this.summ(tibr)-mvr/24*this.summ(tibrb)+allbonus; var tpowr=this.summ(powr)-mvr/24*this.summ(powrb)+allbonus; var tcryr=this.summ(cryr)-mvr/24*this.summ(cryrb)+allbonus; var tcrer=this.summ(crer)-mvr/24*this.summ(crerb);
    var tret=[ttibr,tpowr,tcryr,tcrer];
    bss_[tt]=bses;      off_[tt]=offlvl;        bll_[tt]=balvl;
    resid[tt]=[resrcs[0]/tret[0],resrcs[1]/tret[1],resrcs[2]/tret[2],resrcs[3]/tret[3]];
    ttm[tt]=ttime;
    if (balvl>19 && str===1)  //start at 100M tib
    {    str=tt;    }
    if (ttime>(180*240) && nwo===0)
    {    nwo=1;  var off00=offlvl;   var bll00=balvl;    var bss00=bses;    }
}
if (nwo===0)  {       var off00=offlvl;   var bll00=balvl;    var bss00=bses;   }
var T=tt;
var grrt=Math.log(ttwortt[T]/ttwortt[str])/((ttm[T]-ttm[str])/24);
var grrt0=Math.log(twortt[T][0]/twortt[str][0])/((ttm[T]-ttm[str])/24);
//console.log(allbonus);
return   [bld, lvl, [bss00, bll00, off00], grrt, grrt0, str, T, ttm, ttime,bss_,off_,bll_,ttm,harvlvl];
},

payoff: function (bld,lvl,map,wgh,mvr,balvl,globaa,parms)
{  var silo=globaa[0];     var harv=globaa[1];     var plnt=globaa[2];     var accu=globaa[3];     var silo_s=globaa[4];       var harv_s=globaa[5];    var plnt_s=globaa[6];       var accu_s=globaa[7];       var defoff=globaa[8];    var defoff_s=globaa[9];    var rfnr=globaa[10];    var rfnr_s=globaa[11];    var dfns=globaa[12];    var dfns_s=globaa[13];   var ofns=globaa[14];    var ofns_s=globaa[15];
   var optt=parms[0];    var opta=parms[1];    var opty=parms[2];    var optd=parms[3];    var recovery=parms[4];   var acnum=parms[5]; var addref=parms[6];   var alliancerank=parms[7];
   var tibr=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var powr=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var cryr=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var crer=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var tibc=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var powc=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var tibw=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var poww=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var cryw=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    //bonus (non-continuous) part of returns
   var tibrb=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var powrb=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var cryrb=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
   var crerb=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    var r0=0; var c0=0;
    var r1=0; var c1=0;
    for (var row=0;row<8;row++)
    {    for (var col=0;col<9;col++)
         {   switch (bld[row][col])
             {  case "s":
                    var tmp=this.countadj(bld,[row,col],"h");
                    var tch=tmp[0]+1; if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    var tmp=this.countadj(bld,[row,col],"n");
                    var tchn=tmp[0]+1;  if (tchn>0) {var tchnsgn=1;} else {var tchnsgn=0;}
                    tibr[row][col]=silo[lvl[row][col]-1][2]+tch*silo[lvl[row][col]-1][3]+tchsgn*silo[lvl[row][col]-1][4];
                    tibrb[row][col]=silo[lvl[row][col]-1][2];
                    cryr[row][col]=silo[lvl[row][col]-1][2]+tchn*silo[lvl[row][col]-1][3]+tchnsgn*silo[lvl[row][col]-1][4];
                    cryrb[row][col]=silo[lvl[row][col]-1][2];
                    tibc[row][col]=silo[lvl[row][col]-1][0];
                    powc[row][col]=silo[lvl[row][col]-1][1];
                    tibw[row][col]=silo_s[lvl[row][col]-1][0];
                    poww[row][col]=silo_s[lvl[row][col]-1][1];
                    break;
                case "h":
                    var tmp=this.countadj(bld,[row,col],"s");
                    var tch=tmp[0]+1; if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    tibr[row][col]=harv[lvl[row][col]-1][2]+tch*harv[lvl[row][col]-1][3]+tchsgn*harv[lvl[row][col]-1][4];
                    tibrb[row][col]=harv[lvl[row][col]-1][2];
                    tibc[row][col]=harv[lvl[row][col]-1][0];
                    powc[row][col]=harv[lvl[row][col]-1][1];
                    tibw[row][col]=harv_s[lvl[row][col]-1][0];
                    poww[row][col]=harv_s[lvl[row][col]-1][1];
                    break;
                case "y":
                    var tch=3;  if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    var llv=lvl[row][col];
                    if (llv>10)
                    {    var llv=lvl[row][col]+opty;  } //CY needs to be at most opty levels below harvesters
                    tibr[row][col]=silo[llv-1][2]+tch*silo[llv-1][3]+tchsgn*silo[llv-1][4];
                    tibc[row][col]=silo[llv-1][0];
                    powc[row][col]=silo[llv-1][1];
                    tibw[row][col]=silo_s[llv-1][0];
                    poww[row][col]=silo_s[llv-1][1];  //use this to compute all kinds of roi
                    var r0=row; var c0=col;    //remember the location
                    break;
                case "q":
                    var tch=3;  if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    var llv=lvl[row][col];
                    if (llv>10)
                    {    var llv=lvl[row][col]+optd; } //defense needs to be at least optd levels below harvesters
                    tibr[row][col]=silo[llv-1][2]+tch*silo[llv-1][3]+tchsgn*silo[llv-1][4];
                    tibc[row][col]=silo[llv-1][0];
                    powc[row][col]=silo[llv-1][1];
                    tibw[row][col]=silo_s[llv-1][0];
                    poww[row][col]=silo_s[llv-1][1];  //use this to compute all kinds of roi
                    var r1=row; var c1=col;    //remember the location
                    break;
                case "n":
                    var tmp=this.countadj(bld,[row,col],"s");
                    var tch=tmp[0]+1;  if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    cryr[row][col]=harv[lvl[row][col]-1][2]+tch*harv[lvl[row][col]-1][3]+tchsgn*harv[lvl[row][col]-1][4];
                    cryrb[row][col]=harv[lvl[row][col]-1][2];
                    tibc[row][col]=harv[lvl[row][col]-1][0];
                    powc[row][col]=harv[lvl[row][col]-1][1];
                    tibw[row][col]=harv_s[lvl[row][col]-1][0];
                    poww[row][col]=harv_s[lvl[row][col]-1][1];
                    break;
                case "a":
                    var tmp=this.countadj(bld,[row,col],"p");
                    var tch=tmp[0]+1;  if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    powr[row][col]=accu[lvl[row][col]-1][2]+tch*accu[lvl[row][col]-1][3]+tchsgn*accu[lvl[row][col]-1][4];
                    powrb[row][col]=accu[lvl[row][col]-1][2];
                    tibc[row][col]=accu[lvl[row][col]-1][0];
                    powc[row][col]=accu[lvl[row][col]-1][1];
                    tibw[row][col]=accu_s[lvl[row][col]-1][0];
                    poww[row][col]=accu_s[lvl[row][col]-1][1];
                    break;
                case "p":
                    var tmp=this.countadj(bld,[row,col],"a");
                    var tch2=tmp[0]+1; if (tch2>0) {var tch2sgn=1;} else {var tch2sgn=0;}
                    var tmp=this.countadj(map,[row,col],"c");
                    var tch=tmp[0]+1; if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    powr[row][col]=plnt[lvl[row][col]-1][2]+tch*plnt[lvl[row][col]-1][3]+tch2sgn*plnt[lvl[row][col]-1][4];
                    powrb[row][col]=plnt[lvl[row][col]-1][2];
                    tibc[row][col]=plnt[lvl[row][col]-1][0];
                    powc[row][col]=plnt[lvl[row][col]-1][1];
                    tibw[row][col]=plnt_s[lvl[row][col]-1][0];
                    poww[row][col]=plnt_s[lvl[row][col]-1][1];
                    var tmp=this.countadj(bld,[row,col],"r");
                    var tchR=tmp[0]+1;  if (tchR>0) {var tchRsgn=1;} else {var tchRsgn=0;}
                    crer[row][col]=tchR*plnt[lvl[row][col]-1][5];
                    break;
                case "r":
                    var tmp=this.countadj(bld,[row,col],"p");
                    var tch2=tmp[0]+1; if (tch2>0) {var tch2sgn=1;} else {var tch2sgn=0;}
                    var tmp=this.countadj(map,[row,col],"t");
                    var tch=tmp[0]+1; if (tch>0) {var tchsgn=1;} else {var tchsgn=0;}
                    crer[row][col]=rfnr[lvl[row][col]-1][2]+tch*rfnr[lvl[row][col]-1][3]+tch2sgn*rfnr[lvl[row][col]-1][4];
                    crerb[row][col]=rfnr[lvl[row][col]-1][2];
                    tibc[row][col]=rfnr[lvl[row][col]-1][0];
                    powc[row][col]=rfnr[lvl[row][col]-1][1];
                    tibw[row][col]=rfnr_s[lvl[row][col]-1][0];
                    poww[row][col]=rfnr_s[lvl[row][col]-1][1];
                    break;
                default:     
                break;       
            }
        }
    }
    var roi=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
        roi[jj2][kk2]=(tibc[jj2][kk2]+powc[jj2][kk2]*wgh[1])/(tibr[jj2][kk2]-mvr/24*tibrb[jj2][kk2]+(powr[jj2][kk2]-mvr/24*powrb[jj2][kk2])*wgh[1]+(cryr[jj2][kk2]-mvr/24*cryrb[jj2][kk2])*wgh[2]+(crer[jj2][kk2]-mvr/24*crerb[jj2][kk2])*wgh[3])/24*4;
    }}
    // correct CY data
    if (r0>-1)
    {   tibr[r0][c0]=0;
        if (lvl[r0][c0]>10) { var lllv=lvl[r0][c0];} else { var lllv=10;}
        if (lvl[r0][c0]-(optd-opty)>10) { var lllv2=lvl[r0][c0]-(optd-opty);} else { var lllv2=10;}
        tibc[r0][c0]=defoff[lllv-1][0]*2+defoff[lllv2-1][0]*2;   //there are 2 buildins: CY, SUPPORT that have opty level and DF, DFHQ have optd level
        powc[r0][c0]=defoff[lllv-1][1]*2+defoff[lllv2-1][1]*2;
        tibw[r0][c0]=defoff_s[lllv-1][0]*2+defoff_s[lllv2-1][0]*2;
        poww[r0][c0]=defoff_s[lllv-1][1]*2+defoff_s[lllv2-1][1]*2;
    }
    // correct DFHQ data
    if (r1>-1)
    {   tibr[r1][c1]=0;
        tibc[r1][c1]=dfns[lvl[r1][c1]-1][0];   //defense costs are in crystal instead of tiberium
        powc[r1][c1]=dfns[lvl[r1][c1]-1][1];
        cryw[r1][c1]=dfns_s[lvl[r1][c1]-1][0]; //defense worth are also in crystal
        poww[r1][c1]=dfns_s[lvl[r1][c1]-1][1];
    }
    return [roi,tibr,powr,cryr,crer,tibc,powc,tibw,poww,cryw,tibrb,powrb,cryrb,crerb];
},

countadj: function (bldn,cntr,typ){
// counts number of buildings of certain type adjacent to a particular location in a layout
var srnd=[[cntr[0]-1,cntr[1]-1],     [cntr[0]-1,cntr[1]],     [cntr[0]-1,cntr[1]+1],     [cntr[0],cntr[1]-1],     [cntr[0],cntr[1]+1],     [cntr[0]+1,cntr[1]-1],     [cntr[0]+1,cntr[1]],     [cntr[0]+1,cntr[1]+1]];
var ind=new Array();     var bb=new Array();     var jjs=-1;     var jjs2=-1;
for (js=0;js<8;js++) 
{   if (srnd[js][0]>-1 && srnd[js][0]<8 && srnd[js][1]>-1 && srnd[js][1]<9)
    {   if (bldn[srnd[js][0]][srnd[js][1]] === typ)        {   jjs++;              ind[jjs]=js;        }       
        jjs2++;       bb[jjs2]=bldn[srnd[js][0]][srnd[js][1]];    }     }
return [jjs,bb,ind,srnd];
},

//INITIALIZATION PART
initializ: function (){
var silo=[[2, 0, 0, 72, 0,0],[3, 1, 0, 90, 0,0],[4, 1, 0, 125, 0,0],[20, 5, 0, 170, 0,0],[110, 28, 0, 220, 0,0],[360, 90, 0, 275, 0,0],[1100, 275, 0, 335, 0,0],[3200, 800, 0, 400, 0,0],[8800, 2200, 0, 460, 0,0],[22400, 5600, 0, 530, 0,0],[48000, 12000, 0, 610, 0,0],[63360, 15840, 0, 710, 0,0],[83630, 20900, 0, 888, 0,0],[110390, 27600, 0, 1100, 0,0],[145720, 36430, 0, 1380, 0,0],[192350, 48090, 0, 1730, 0,0],[253910, 63470, 0, 2160, 0,0],[335160, 83790, 0, 2700, 0,0],[442410, 110600, 0, 3380, 0,0],
[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
for (var j=19;j<60;j++){   silo[j][0]=silo[j-1][0]*1.32;    silo[j][1]=silo[j][0]/4;    silo[j][2]=silo[j-1][2]*1.25;    silo[j][3]=silo[j-1][3]*1.25;    silo[j][4]=silo[j-1][4]*1.25;}
var harv = new Array();
for (var j = 0; j < silo.length; j++){   harv[j] = [0,0,0,0,0,0];    for (var k = 0; k < silo[j].length; k++)    {   harv[j][k] = silo[j][k]+0.0;     } }
var tmp1=[3, 4, 6, 15, 110, 360, 1100, 3200, 8800, 22400]; var tmp2=[0, 1, 3, 12, 72,  234, 715,  2080, 5720, 14560 ]; var tmp3=[240, 300, 432, 570, 735, 920, 1120, 1330, 1560, 1800, 2050, 2360, 2950, 3680, 4600, 5760];
for (var j=1;j<60;j++) {   harv[j][1]=harv[j][0]*3/4;     harv[j][2]=10*harv[j][3]/3;    harv[j][4]=harv[j][3];    harv[j][3]=0;    if (j<10)    {   harv[j][0]=tmp1[j];        harv[j][1]=tmp2[j];    }    if (j<16)    {   harv[j][2]=tmp3[j];    }}
var plnt=[[3, 0, 120, 60, 72,0],[5, 0, 150, 75, 90,0],[10, 1, 198, 100, 120,0],[46, 5, 270, 135, 160,0],[286, 28, 360, 180, 215,0],[936, 90, 460, 230, 275,0],[2860, 275, 560, 280, 335,0],[8320, 800, 660, 330, 400,0],[22880, 2200, 780, 380, 460,0],[58240, 5600, 900, 440, 530,0],[124800, 12000, 1020, 500, 610,0],[164730, 15840, 1160, 580, 700,0],[217450, 20900, 1450, 725, 875,0],[287030, 27600, 1820, 906, 1090,0],[378880, 36430, 2270, 1130, 1360,0],[500130, 48090, 2840, 1410, 1700,0],[660170, 63470, 3560, 1770, 2130,0],[871420, 83790, 4450, 2210, 2670,0],[1150000, 110600, 5560, 2760, 3330,0],
       [0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
for (var j=19;j<60;j++){   plnt[j][0]=plnt[j-1][0]*1.32;    plnt[j][1]=plnt[j-1][1]*1.32;    plnt[j][2]=plnt[j-1][2]*1.25;    plnt[j][3]=plnt[j-1][3]*1.25;    plnt[j][4]=plnt[j-1][4]*1.25;}
var tmp4=[48, 60, 75, 100, 125, 160, 195, 230, 270, 315, 370, 430, 538, 672, 840, 1050, 1310, 1640, 2050];
for (var j=1;j<60;j++){   if (j<19)    {   plnt[j][5]=tmp4[j];    }    else    {   plnt[j][5]=plnt[j-1][5]*1.25;    }}
var accu=[[2, 0, 0, 48, 0,0],[3, 1, 0, 60, 0,0],[4, 1, 0, 80, 0,0],[20, 5, 0, 110, 0,0],[110, 28, 0, 145, 0,0],[360, 90, 0, 185, 0,0],[1100, 275, 0, 225, 0,0],[3200, 800, 0, 265, 0,0],[8800, 2200, 0, 310, 0,0],[22400, 5600, 0, 355, 0,0],[48000, 12000, 0, 405, 0,0],[63360, 15840, 0, 465, 0,0],[83630, 20900, 0, 581, 0,0],[110390, 27600, 0, 727, 0,0],[145720, 36430, 0, 908, 0,0],[192350, 48090, 0, 1130, 0,0],[253910, 63470, 0, 1410, 0,0],[335160, 83790, 0, 1770, 0,0],[442410, 110600, 0, 2210, 0,0],
[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
for (var j=19;j<60;j++){   accu[j][0]=accu[j-1][0]*1.32;    accu[j][1]=accu[j-1][1]*1.32;    accu[j][2]=accu[j-1][2]*1.25;    accu[j][3]=accu[j-1][3]*1.25;    accu[j][4]=accu[j-1][4]*1.25;}
var rfnr=[[3, 0, 120, 60, 72,0],[4, 1, 150, 75, 90,0],[8, 2, 180, 90, 110,0],[35, 9, 240, 120, 145,0],[220, 55, 315, 160, 190,0],[720, 180, 400, 200, 240,0],[2200, 550, 485, 240, 290,0],[6400, 1600, 575, 290, 345,0],[17600, 4400, 680, 340, 410,0],[44800, 11200, 790, 400, 475,0],[96000, 24000, 925, 460, 555,0],[126720, 31680, 1080, 540, 650,0],[167270, 41810, 1350, 675, 813,0],[220790, 55190, 1680, 844, 1010,0],[291450, 72860, 2100, 1050, 1270,0],[384710, 96170, 2630, 1310, 1580,0],[507820, 126950, 3290, 1640, 1980,0],[670330, 167580, 4110, 2060, 2480,0],[884830, 221200, 5140, 2570, 3090,0],
[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
var fct=[1.31999808021389, 1.31999502749370,  1.25005273120801,  1.25005273120801,  1.25008568540486];
for (var j=19;j<60;j++){   rfnr[j][0]=rfnr[j-1][0]*fct[0];    rfnr[j][1]=rfnr[j-1][1]*fct[1];    rfnr[j][2]=rfnr[j-1][2]*fct[2];    rfnr[j][3]=rfnr[j-1][3]*fct[3];    rfnr[j][4]=rfnr[j-1][4]*fct[4];}
var harv_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
var silo_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
var accu_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
var plnt_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
var rfnr_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
for (var j=1;j<60;j++){   harv_s[j][0]=harv_s[j-1][0]+harv[j-1][0];    harv_s[j][1]=harv_s[j-1][1]+harv[j-1][1];    silo_s[j][0]=silo_s[j-1][0]+silo[j-1][0];    silo_s[j][1]=silo_s[j-1][1]+silo[j-1][1];    accu_s[j][0]=accu_s[j-1][0]+accu[j-1][0];    accu_s[j][1]=accu_s[j-1][1]+accu[j-1][1];    plnt_s[j][0]=plnt_s[j-1][0]+plnt[j-1][0];    plnt_s[j][1]=plnt_s[j-1][1]+plnt[j-1][1];    rfnr_s[j][0]=rfnr_s[j-1][0]+rfnr[j-1][0];    rfnr_s[j][1]=rfnr_s[j-1][1]+rfnr[j-1][1];}
var defoff_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
defoff=[[10, 0],[15, 0],[30, 3],[60, 15],[440, 110],[1440, 360],[4400, 1100],[12800, 3200],[35200, 8800],[89600, 22400],[192000, 48000],[253440, 63360],[334540, 83630],[441590, 110390],[582900, 145720],[769430, 192350],[1010000, 253910],[1340000, 335160],[1760000, 442410],
[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
for (var j=19;j<60;j++){   defoff[j][1]=defoff[j-1][1]*1.32;    defoff[j][0]=defoff[j][1]*4;}
var ofns=[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
var dfns=[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
ofns[35][0]=4028442000; for (var js=36;js<60;js++){   ofns[js][0]=ofns[js-1][0]*1.32;  }
for (var js=34;js>=0;js--){   if (js<11)    {   ofns[js][0]=ofns[js+1][0]/3.3;    }    else    {   ofns[js][0]=ofns[js+1][0]/1.32;    }}
var ofns_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
var dfns_s=[[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];
for (var js=0;js<60;js++){   ofns[js][1]=ofns[js][0]/4;    dfns[js][0]=ofns[js][0]/2;    dfns[js][1]=ofns[js][1]/2;    if(js>0)    {   dfns_s[js][0]=dfns_s[js-1][0]+dfns[js-1][0];        dfns_s[js][1]=dfns_s[js-1][1]+dfns[js-1][1];        ofns_s[js][0]=ofns_s[js-1][0]+ofns[js-1][0];        ofns_s[js][1]=ofns_s[js-1][1]+ofns[js-1][1];        defoff_s[js][0]=defoff_s[js-1][0]+defoff[js-1][0];        defoff_s[js][1]=defoff_s[js-1][1]+defoff[js-1][1];   }}
//END INITIALIZATION PART
return [silo, harv, plnt, accu, silo_s, harv_s, plnt_s, accu_s, defoff, defoff_s, rfnr, rfnr_s, dfns, dfns_s, ofns, ofns_s];
},

fillin_v2: function (map,parms)
{   var optt=parms[0];    var opta=parms[1];    var opty=parms[2];    var optd=parms[3];    var recovery=parms[4];   var acnum=parms[5];  var addref=parms[6];
    map2=[[".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."]];
    //put all possible harvesters
    for (jj=0;jj<8;jj++)    {    for (kk=0;kk<9;kk++)
         {  if (map[jj][kk]==="t")         {    map2[jj][kk]="h"; }
            else if (map[jj][kk]==="c")    {   map2[jj][kk]="n"; }   }    }
    var tibcnt=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]];
    var crycnt=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]];
    var totcnt=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]];
    // put silos in all 4 and 5 touch places
    for (jj=0;jj<8;jj++)    {    for (kk=0;kk<9;kk++)
         {  var tmp=this.countadj(map,[jj,kk],"t");  tibcnt[jj][kk]=tmp[0]+1;
            var tmp=this.countadj(map,[jj,kk],"c");  crycnt[jj][kk]=tmp[0]+1;
            totcnt[jj][kk]=tibcnt[jj][kk]+crycnt[jj][kk];
            if (tibcnt[jj][kk]+crycnt[jj][kk]>=optt)  {    map2[jj][kk]="s";       }
        }}
    // link up harvs without silos with 3 touch silos, or remove harv if not possible
    for (jj=0;jj<8;jj++)
    {    for (kk=0;kk<9;kk++)
         {   if (map2[jj][kk]==="h" || map2[jj][kk]==="n")
             {  var tmp=this.countadj(map2,[jj,kk],"s");      var conn=tmp[0]+1;
                if (conn===0)
                {    var tmp=this.countadj(totcnt,[jj,kk],3);
                     var fn=tmp[0]+1; var bb=tmp[1]; var ind=tmp[2]; var srnd=tmp[3];
                    if (fn>0)
                    {   if (ind.length===1)
                        {    map2[srnd[ind[0]][0]][srnd[ind[0]][1]]="s";   }
                        else
                        {    //complicate things a bit
                                var dconn=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
                                //first figure out all disconnected harvesters left
                                for (jj1=0;jj1<8;jj1++)
                                {    for (kk1=0;kk1<9;kk1++)
                                     {   if (map2[jj1][kk1]==="h" || map2[jj1][kk1]==="n")
                                         {   var tmp=this.countadj(map2,[jj1,kk1],"s");
                                             var conn2=tmp[0]+1;
                                            if (conn2===0)
                                            {    dconn[jj1][kk1]=1;    }
                                         }
                                     }
                                }
                                //then count locations touching max number of disconnected harvesters
                                var cntdcnt=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
                                for (jj1=0;jj1<8;jj1++)
                                {    for (kk1=0;kk1<9;kk1++)
                                     {    var tmp=this.countadj(dconn,[jj1,kk1],1);
                                          cntdcnt[jj1][kk1]=tmp[0]+1;
                                     }
                                }
                                var ttm=-10;
                                for (var ij=0;ij<ind.length;ij++)
                                {    if (cntdcnt[srnd[ind[ij]][0]][srnd[ind[ij]][1]]>ttm)
                                    {   ttm=cntdcnt[srnd[ind[ij]][0]][srnd[ind[ij]][1]];
                                        var ind1=srnd[ind[ij]][0];
                                        var ind2=srnd[ind[ij]][1];
                                    }
                                }                               
                                map2[ind1][ind2]="s";
                        }
                    }
                    else  {    map2[jj][kk]=map[jj][kk]; } //remove harv is not possible to connect
                }
            }
        }
    }
    if (optt>3)
    {    //now some 3-touch silos might still be redundant
          for (jj=0;jj<8;jj++)
          {    for (kk=0;kk<9;kk++)
               {   if (map2[jj][kk]==="s" && totcnt[jj][kk]===3) //if it's a 3-touch silo
                   {   //test if removing it leaves any harvesters disconnected
                      var map3=[[".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."]];
                      for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  map3[jj2][kk2]=map2[jj2][kk2];}}
                      map3[jj][kk]=".";
                      //first figure out all disconnected harvesters left
                      var dconn=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
                      //first figure out all disconnected harvesters left
                      var ssm=0;
                      for (jj1=0;jj1<8;jj1++)
                      {    for (kk1=0;kk1<9;kk1++)
                           {   if (map2[jj1][kk1]==="h" || map2[jj1][kk1]==="n")
                               {   var tmp=this.countadj(map3,[jj1,kk1],"s");
                                   var conn2=tmp[0]+1;
                                  if (conn2===0) {    dconn[jj1][kk1]=1;  }
                              }
                              ssm=ssm+dconn[jj1][kk1];
                          }
                      }
                      if (ssm===0) //no new disconnected harvesters
                      {    //then worth removing this harvester
                           for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  map2[jj2][kk2]=map3[jj2][kk2];}}
                      }
                  }
              }
          }
    }
    // find best place for accumulators
    var acm=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    for (jj=0;jj<8;jj++)
    {    for (kk=0;kk<9;kk++)
         {   if (map2[jj][kk]===".")
             {   var tmp=this.countadj(map2,[jj,kk],".");
                 acm[jj][kk]=tmp[0]+1;
             }
             else
             {   acm[jj][kk]=0;
             }
         }
    }
    //this lists all accumulator spots with 7 or 8 touches
    var loc=new Array();
    var ijkk=-1;
    for (jj=0;jj<8;jj++)
    {    for (kk=0;kk<9;kk++)
         {    if (acm[jj][kk]>=6)
              {     ijkk++;
                    loc[ijkk]=[jj,kk];
              }
         }
    }
    //console.log(acm)
    var cmbind=new Array();
    var ijkk=-1;
    if (acnum===1)
    { for (jj=0;jj<loc.length;jj++)
      {       ijkk++;
              cmbind[ijkk]=[jj];
      }
    }
    else
    { for (jj=0;jj<loc.length;jj++)
      {    for (kk=jj+1;kk<loc.length;kk++)
           {    ijkk++;
                cmbind[ijkk]=[jj,kk];
           }
      }
    }
    //console.log(loc)
    var crycnt_=new Array();    var ppcnt_=new Array();    var pptch_=new Array();    var refcnt=new Array();    var mapss_=new Array();
    for (var ijk=0;ijk<cmbind.length;ijk++)
    {    //temporary map
         var map3=[[".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."]];
         for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  map3[jj2][kk2]=map2[jj2][kk2];}}

        for (var woq=0;woq<cmbind[ijk].length;woq++)
        {    map3[loc[cmbind[ijk][woq]][0]][loc[cmbind[ijk][woq]][1]]="a"; } //place both accums
        //place all powerplants
        crycnt_[ijk]=0;         ppcnt_[ijk]=0;
        for (jj=0;jj<8;jj++)
        {    for (kk=0;kk<9;kk++)
             {   if (map3[jj][kk]===".")
                 {   var tmp=this.countadj(map3,[jj,kk],"a");
                     wp=tmp[0]+1;
                     if (wp>0)
                     {  var tmp=this.countadj(map,[jj,kk],"c");
                        crycnt_[ijk]=crycnt_[ijk]+tmp[0]+1; //count crystal touches                       
                        ppcnt_[ijk]=ppcnt_[ijk]+1; //count pplants
                        map3[jj][kk]="p";   //place power plant
                    }
                }
            }
        }
        pptch_[ijk]=0;
        for (var woq=0;woq<cmbind[ijk].length;woq++)
        {    var tmp=this.countadj(map3,[loc[cmbind[ijk][woq]][0],loc[cmbind[ijk][woq]][1]],"p");
             pptch_[ijk]=pptch_[ijk]+tmp[0]+1;
        }
        var ttcnt=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (jj=0;jj<8;jj++)
        {    for (kk=0;kk<9;kk++)
             {   if (map3[jj][kk]===".")
                 {    var tmp=this.countadj(map3,[jj,kk],"t");
                      ttcnt[jj][kk]=tmp[0]+1;
                }
            }
        }
        refcnt[ijk]=0; //also take into account potential future refineries one might place
        for (jj=0;jj<8;jj++)
        {    for (kk=0;kk<9;kk++)
             {   if (map3[jj][kk]==="p")
                 {    var tmp1=this.countadj(ttcnt,[jj,kk],1);
                      var tmp2=this.countadj(ttcnt,[jj,kk],2);
                      var tmp3=this.countadj(ttcnt,[jj,kk],3);
                      refcnt[ijk]=refcnt[ijk]+tmp1[0]+1+tmp2[0]+1+tmp3[0]+1;
                }
            }
        }
         mapss_[ijk]=[[".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."]];
         for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  mapss_[ijk][jj2][kk2]=map3[jj2][kk2];}}
    }
    //now choose best setup
    //1. max pp touches net of number of power plants
    //2. among equals, minimum power plants
    //3. among equals, maximum pp crystal touches + discounted refinery touches
    var ttt=new Array();      var ttt2=new Array();     var w0e=-10;      var dcnt=0.1;
    for (var ikj=0;ikj<cmbind.length;ikj++)
    {      ttt[ikj]=pptch_[ikj]-opta*ppcnt_[ikj];
           ttt2[ikj]=crycnt_[ikj]+refcnt[ikj]*dcnt;
           if (ttt[ikj]>w0e){     w0e=ttt[ikj];   }
    }
    var inndx=new Array();      var owl=-1;
    for (var ikj=0;ikj<cmbind.length;ikj++)
    {      if (ttt[ikj]===w0e){     owl++;   inndx[owl]=ikj;  }
    }
    w0e=-10;
    for (var ikj=0;ikj<inndx.length;ikj++)
    {     if (ttt2[inndx[ikj]]>w0e){     w0e=ttt2[inndx[ikj]];   owl=inndx[ikj];   }
    }
    //console.log(mapss_);
    //console.log(owl);
    for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  map2[jj2][kk2]=mapss_[owl][jj2][kk2];}}
    //now fill in extra 3-touch tibs if wanted
    if (optt===3.5)
    {    for (jj=0;jj<8;jj++)
        {    for (kk=0;kk<9;kk++)
             {  if (totcnt[jj][kk]>=3 && tibcnt[jj][kk]>0)
                {    map2[jj][kk]="s";
                }
            }
        }
    }
    if (addref!==0)
    {    //add refineries and extra power plants in the remaining spots
        var ocpd=0;
        for (jj=0;jj<8;jj++)
        {    for (kk=0;kk<9;kk++)
             {  if (map2[jj][kk]!=="." && map2[jj][kk]!=="t" && map2[jj][kk]!=="c" && map2[jj][kk]!=="y")
                {    ocpd++;
                }
            }
        }
        var slots=41-ocpd-4;
        var sltlft=slots+0;
    //3touches and 2touches that already have pps
        var rfnrtc=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (jj=0;jj<8;jj++)
        {    for (kk=0;kk<9;kk++)
             {    if (map2[jj][kk]===".")  {     var tmp=this.countadj(map,[jj,kk],"t");  rfnrtc[jj][kk]=tmp[0]+1;          }
                  else  {   rfnrtc[jj][kk]=0;   }
                  var tmp=this.countadj(map2,[jj,kk],"p");
                  if ((tmp[0]+1)>0)
                  {   rfnrtc[jj][kk]=rfnrtc[jj][kk]+0.5;
                      if (rfnrtc[jj][kk]===2.5)  {    rfnrtc[jj][kk]=3.25;     }
                  }
            }
        }

        var b=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  b[jj2][kk2]=rfnrtc[jj2][kk2];}}
        var marfn=this.maxx(b);
        while (marfn>3 && sltlft>0)
        {   for (var jj=0;jj<8;jj++)
            {    for (var kk=0;kk<9;kk++)
                 {    if (rfnrtc[jj][kk]===marfn && sltlft>0)
                      {      rfnrtc[jj][kk]=0;
                             sltlft=sltlft-1;
                             map2[jj][kk]="r";
                      }
                 }
            }
        var b=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  b[jj2][kk2]=rfnrtc[jj2][kk2];}}
        var marfn=this.maxx(b);
        }
        //now find all the 2touches and 3touches and minimum powerplants that can serve them
        var cntn=1;
        while (sltlft>1 && cntn===1)
        {   var rfnrtc=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
            for (var jj=0;jj<8;jj++)
            {    for (var kk=0;kk<9;kk++)
                 {  if (map2[jj][kk]===".")
                    {     var tmp=this.countadj(map,[jj,kk],"t");
                          rfnrtc[jj][kk]=tmp[0]+1;
                    }
                    else
                    {   rfnrtc[jj][kk]=0;
                    }
                }
            }
            var rfnrpp=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
            for (jj=0;jj<8;jj++)
            {    for (kk=0;kk<9;kk++)
                 {    if (map2[jj][kk]===".")
                      {    var tmp3=this.countadj(rfnrtc,[jj,kk],3);
                           var tmp2=this.countadj(rfnrtc,[jj,kk],2);
                           rfnrpp[jj][kk]=tmp2[0]+1+tmp3[0]+1;
                      }
                      else
                      {  rfnrpp[jj][kk]=0;
                      }
                }
            }
            var trgt=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]];
            var trgt2=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]];
            var mm=0;
            var loc=[0,0];
            for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
                trgt[jj2][kk2]=rfnrpp[jj2][kk2]-rfnrtc[jj2][kk2]; trgt2[jj2][kk2]=rfnrpp[jj2][kk2];
                if (trgt[jj2][kk2]>mm)
                {   mm=trgt[jj2][kk2];
                    loc=[jj2,kk2];
                }
            }}
            if (mm===0)
            {   for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
                    if (trgt2[jj2][kk2]>mm)
                    {   mm=trgt2[jj2][kk2];
                        loc=[jj2,kk2];
                    }
                }}
                if (mm==0) {   cntn=0;  }
            }

            if (cntn===1)
            {    if (sltlft>1)
                  {   map2[loc[0]][loc[1]]="p";
                      sltlft=sltlft-1;
                  }
                  var tmp=this.countadj(rfnrtc,loc,3);
                  var ind3=tmp[2];
                  var srnd3=tmp[3];
                  for (ii=0;ii<ind3.length;ii++)//ii=1:size(llc,1))
                  {     if (sltlft>0)
                        {    map2[srnd3[ind3[ii]][0]][srnd3[ind3[ii]][1]]="r";
                             sltlft=sltlft-1;
                        }
                  }
                  var tmp=this.countadj(rfnrtc,loc,2);
                  var ind=tmp[2];
                  var srnd=tmp[3];
                  for (ii=0;ii<ind.length;ii++)//ii=1:size(llc,1))
                  {     if (sltlft>0)
                        {    map2[srnd[ind[ii]][0]][srnd[ind[ii]][1]]="r";
                             sltlft=sltlft-1;
                        }
                  }
            }
        }
       //1touches that already have pps
       var rfnrtc=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (var jj=0;jj<8;jj++)
        {    for (var kk=0;kk<9;kk++)
             {  if (map2[jj][kk]===".")
                {     var tmp=this.countadj(map,[jj,kk],"t");
                      rfnrtc[jj][kk]=tmp[0]+1;
                }
                else
                {   rfnrtc[jj][kk]=0;
                }
                var tmp=this.countadj(map2,[jj,kk],"p");
                if ((tmp[0]+1)>0 && rfnrtc[jj][kk]>0)
                {   rfnrtc[jj][kk]=rfnrtc[jj][kk]+0.5;
                }
            }
        }
        var b=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  b[jj2][kk2]=rfnrtc[jj2][kk2];}}
        var marfn=this.maxx(b);
        while (marfn===1.5 && sltlft>0)
        {   for (var jj=0;jj<8;jj++)
            {    for (var kk=0;kk<9;kk++)
                 {    if (rfnrtc[jj][kk]===marfn && sltlft>0)
                      {      rfnrtc[jj][kk]=0;
                             sltlft=sltlft-1;
                             map2[jj][kk]="r";
                      }
                 }
            }
        var b=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  b[jj2][kk2]=rfnrtc[jj2][kk2];}}
        var marfn=this.maxx(b);
        }
       //0touches with max pp
       var rfnrtc=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (var jj=0;jj<8;jj++)
        {    for (var kk=0;kk<9;kk++)
             {  if (map2[jj][kk]===".")
                {     var tmp=this.countadj(map2,[jj,kk],"p");
                      rfnrtc[jj][kk]=tmp[0]+1;
                }
                else {   rfnrtc[jj][kk]=0;  }
            }
        }
        var b=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
        for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  b[jj2][kk2]=rfnrtc[jj2][kk2];}}
        var marfn=this.maxx(b);
        while (marfn>0 && sltlft>0)
        {   for (var jj=0;jj<8;jj++)
            {    for (var kk=0;kk<9;kk++)
                 {    if (rfnrtc[jj][kk]===marfn && sltlft>0)
                      {      rfnrtc[jj][kk]=0;
                             sltlft=sltlft-1;
                             map2[jj][kk]="r";
                      }
                 }
            }
            var b=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
            for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  b[jj2][kk2]=rfnrtc[jj2][kk2];}}
            var marfn=this.maxx(b);
        }
    }
    //remove holders for crys and tib (do not do this!)
    var lvl2=[[0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ],     [0, 0, 0, 0, 0, 0, 0, 0, 0 ]]; 
    var bld2=[[".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],     [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."],      [".",".",".",".",".",".",".",".","."]];
    var cccnt=0;
    for (jj2=0;jj2<8;jj2++){  for (kk2=0;kk2<9;kk2++) {  
      bld2[jj2][kk2]=map2[jj2][kk2];
      if (bld2[jj2][kk2]==="." && cccnt===0)
      {bld2[jj2][kk2]="y"; cccnt++;}
      else if (bld2[jj2][kk2]==="." && cccnt===1)
      {bld2[jj2][kk2]="q"; cccnt++;}
      else if (bld2[jj2][kk2]==="." && cccnt===2)
      {bld2[jj2][kk2]="w"; cccnt++;}
      else if (bld2[jj2][kk2]==="." && cccnt===3)
      {bld2[jj2][kk2]="z"; cccnt++;}
      if (bld2[jj2][kk2]==="." || bld2[jj2][kk2]==="t" || bld2[jj2][kk2]==="c")
      {lvl2[jj2][kk2]=0;}
      else
      {lvl2[jj2][kk2]=12;}      
    }}
    return [bld2,lvl2];
}





				}
			});

			qx.Class.define("Addons.BaseScannerLayout", {
				type : "singleton",
				extend : qx.ui.window.Window,
				construct : function () {
					try {
						this.base(arguments);
						console.info("Addons.BaseScannerLayout " + window.__msbs_version);
						this.setWidth(820);
						this.setHeight(400);
						this.setContentPadding(10);
						this.setShowMinimize(false);
						this.setShowMaximize(true);
						this.setShowClose(true);
						this.setResizable(true);
						this.setAllowMaximize(true);
						this.setAllowMinimize(false);
						this.setAllowClose(true);
						this.setShowStatusbar(false);
						this.setDecorator(null);
						this.setPadding(10);
						this.setLayout(new qx.ui.layout.Grow());

						this.ZW = [];
						this.removeAll();
						this.ZZ = new qx.ui.container.Scroll();
						this.ZY = new qx.ui.container.Composite(new qx.ui.layout.Flow());
						this.add(this.ZZ, {
							flex : 3
						});
						this.ZZ.add(this.ZY);
						//this.FO();
					} catch (e) {
						console.debug("Addons.BaseScannerLayout.construct: ", e);
					}
				},
				members : {
					ZW : null,
					ZZ : null,
					ZY : null,
					ZX : null,
					openWindow : function (title) {
						try {
							this.setCaption(title);
							if (this.isVisible()) {
								this.close();
							} else {
								this.open();
								this.moveTo(100, 100);
								this.FO();
							}
						} catch (e) {
							console.log("Addons.BaseScannerLayout.openWindow: ", e);
						}
					},
					FO : function () {
						var ZM = window.Addons.BaseScannerGUI.getInstance().ZM;
						var ZE = window.Addons.BaseScannerGUI.getInstance().ZE;
						this.ZX = [];
						var selectedtype = window.Addons.BaseScannerGUI.getInstance().ZJ.getSelection()[0].getModel();
						//console.log("FO: " , ZM.length);
						var rowDataLine = null;
						if (ZE == null) {
							console.info("ZE null: ");
							return;
						}
						//console.log("FO: " , ZM);
						this.ZW = [];
						var id;
						var i;
						var x;
						var y;
						var a;
						for (id in ZM) {
							for (i = 0; i < ZE.length; i++) {
								if (ZE[i][0] == id) {
									rowDataLine = ZE[i];
								}
							}

							if (rowDataLine == null) {
								continue;
							}
							//console.log("ST",selectedtype,rowDataLine[10]);
							if (selectedtype > 4 && selectedtype < 8) {
								if (selectedtype != rowDataLine[10]) {
									continue;
								}
							} else {
								continue;
							}

							posData = rowDataLine[3];
							if (posData != null && posData.split(':').length == 2) {
								posX = parseInt(posData.split(':')[0]);
								posY = parseInt(posData.split(':')[1]);
							}
							var st = '<table border="2" cellspacing="0" cellpadding="0">';
							var link = rowDataLine[2] + " - " + rowDataLine[3];
							st = st + '<tr><td colspan="9"><font color="#FFF">' + link + '</font></td></tr>';
							for (y = 0; y < 8; y++) {
								st = st + "<tr>";
								for (x = 0; x < 9; x++) {
									var img = "";
									var res = ZM[id][x][y];
									//console.log("Res ",res);
									switch (res == undefined ? 0 : res) {
									case 2:
										//console.log("Tiberium " , MT_Base.images[MaelstromTools.Statics.Tiberium] );
										img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Tiberium] + '">';
										break;
									case 1:
										//console.log("Crystal ");
										img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Crystal] + '">';
										break;
									default:
										img = '<img width="14" height="14" src="' + MT_Base.images["Emptypixels"] + '">';
										break;
									}
									st = st + "<td>" + img + "</td>";
								}
								st = st + "</tr>";
							}
							st = st + "</table>";
							//console.log("setWidgetLabels ", st);
							var l = new qx.ui.basic.Label().set({
									backgroundColor : "#303030",
									value : st,
									rich : true
								});
							l.cid = id;
							this.ZX.push(id);
							l.addListener("click", function (e) {

								//console.log("clickid ", this.cid, );
								//webfrontend.gui.UtilView.openCityInMainWindow(this.cid);
								var bk = qx.core.Init.getApplication();
								bk.getBackgroundArea().closeCityInfo();
								bk.getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense, this.cid, 0, 0);
								var q = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
								if (q != null)
									q.get_CityArmyFormationsManager().set_CurrentTargetBaseId(this.cid);

							});
							l.setReturnValue = id;
							this.ZW.push(l);
						}
						this.ZY.removeAll();
						var b = 0;
						var c = 0;
						//console.log("this.ZW.length",this.ZW.length);
						for (a = 0; a < this.ZW.length; a++) {
							this.ZY.add(this.ZW[a], {
								row : b,
								column : c
							});
							c++;
							if (c > 4) {
								c = 0;
								b++;
							}
						}
					}
				}
			});

			qx.Class.define("Addons.LocalStorage", {
				type : "static",
				extend : qx.core.Object,
				statics : {
					isSupported : function () {
						return typeof(localStorage) !== "undefined";
					},
					isdefined : function (key) {
						return (localStorage[key] !== "undefined" && localStorage[key] != null);
					},
					isdefineddata : function (data, key) {
						return (data[key] !== "undefined" && data[key] != null);
					},
					setglobal : function (key, value) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								localStorage[key] = JSON.stringify(value);
							}
						} catch (e) {
							console.debug("Addons.LocalStorage.setglobal: ", e);
						}
					},
					getglobal : function (key, defaultValue) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								if (Addons.LocalStorage.isdefined(key)) {
									return JSON.parse(localStorage[key]);
								}
							}
						} catch (e) {
							console.log("Addons.LocalStorage.getglobal: ", e);
						}
						return defaultValue;
					},
					setserver : function (key, value) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								var sn = ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
								var data;
								if (Addons.LocalStorage.isdefined(sn)) {
									try {
										data = JSON.parse(localStorage[sn]);
										if (!(typeof data === "object")) {
											data = {};
											console.debug("LocalStorage data from server not null, but not object");
										}
									} catch (e) {
										console.debug("LocalStorage data from server not null, but parsererror", e);
										data = {};
									}
								} else {
									data = {};
								}
								data[key] = value;
								localStorage[sn] = JSON.stringify(data);
							}
						} catch (e) {
							console.debug("Addons.LocalStorage.setserver: ", e);
						}
					},
					getserver : function (key, defaultValue) {
						try {
							if (Addons.LocalStorage.isSupported()) {
								var sn = ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
								if (Addons.LocalStorage.isdefined(sn)) {
									var data = JSON.parse(localStorage[sn]);
									if (Addons.LocalStorage.isdefineddata(data, key)) {
										return data[key];
									}
								}
							}
						} catch (e) {
							console.log("Addons.LocalStorage.getserver: ", e);
						}
						return defaultValue;
					}
				}
			});
			
			if(typeof Addons.Language === 'undefined'){
				qx.Class.define("Addons.Language", {
					type : "singleton",
					extend : qx.core.Object,
					members : {
						d : {},
						debug : false,
						addtranslateobj : function (o) {
							if ( o.hasOwnProperty("main") ){
								this.d[o.main.toString()] = o;								
								if(this.debug){
									console.log("Translate Added ", o.main.toString() );
								}
								delete o.main;								
							} else {
								console.debug("Addons.Language.addtranslateobj main not define");
							}
						},
						get : function (t) {
							var locale = qx.locale.Manager.getInstance().getLocale();
							var loc = locale.split("_")[0];
							if ( this.d.hasOwnProperty(t) ){
								if ( this.d[t].hasOwnProperty(loc) ){
									return this.d[t][loc];
								}
							}
							if(this.debug){
								console.debug("Addons.Language.get ", t, " not translate for locale ", loc);
							}
							return t;
						}
					}
				});
			}
			
			qx.Class.define("qx.ui.table.cellrenderer.Replace", {
				extend : qx.ui.table.cellrenderer.Default,

				properties : {

					replaceMap : {
						check : "Object",
						nullable : true,
						init : null
					},
					replaceFunction : {
						check : "Function",
						nullable : true,
						init : null
					}
				},
				members : {
					// overridden
					_getContentHtml : function (cellInfo) {
						var value = cellInfo.value;
						var replaceMap = this.getReplaceMap();
						var replaceFunc = this.getReplaceFunction();
						var label;

						// use map
						if (replaceMap) {
							label = replaceMap[value];
							if (typeof label != "undefined") {
								cellInfo.value = label;
								return qx.bom.String.escape(this._formatValue(cellInfo));
							}
						}

						// use function
						if (replaceFunc) {
							cellInfo.value = replaceFunc(value);
						}
						return qx.bom.String.escape(this._formatValue(cellInfo));
					},

					addReversedReplaceMap : function () {
						var map = this.getReplaceMap();
						for (var key in map) {
							var value = map[key];
							map[value] = key;
						}
						return true;
					}
				}
			});
			
			
			console.info("Maelstrom_Basescanner initalisiert");
			
			var T = Addons.Language.getInstance();
			T.debug = false;
			T.addtranslateobj( {main:"Point", de: "Position", pt: "Position", fr: "Position"} );
			T.addtranslateobj( {main:"BaseScanner Overview", de: "Basescanner Übersicht", pt: "Visão geral do scanner de base", fr: "Aperçu du scanner de base"} );
			T.addtranslateobj( {main:"Scan", de: "Scannen", pt: "Esquadrinhar", fr: "Balayer"} );
			T.addtranslateobj( {main:"Location", de: "Lage", pt: "localização", fr: "Emplacement"} );
			T.addtranslateobj( {main:"Player", de: "Spieler", pt: "Jogador", fr: "Joueur"} );
			T.addtranslateobj( {main:"Bases", de: "Bases", pt: "Bases", fr: "Bases"} );
			T.addtranslateobj( {main:"Camp,Outpost", de: "Lager,Vorposten", pt: "Camp,posto avançado", fr: "Camp,avant-poste"} );
			T.addtranslateobj( {main:"Camp", de: "Lager", pt: "Camp", fr: "Camp"} );						
			T.addtranslateobj( {main:"Outpost", de: "Vorposten", pt: "posto avançado", fr: "avant-poste"} );
			T.addtranslateobj( {main:"BaseScanner Layout", de: "BaseScanner Layout", pt: "Layout da Base de Dados de Scanner", fr: "Mise scanner de base"} );
			T.addtranslateobj( {main:"Show Layouts", de: "Layouts anzeigen", pt: "Mostrar Layouts", fr: "Voir Layouts"} );						
			T.addtranslateobj( {main:"Building state", de: "Gebäudezustand", pt: "construção do Estado", fr: "construction de l'État"} );
			T.addtranslateobj( {main:"Defense state", de: "Verteidigungszustand", pt: "de Defesa do Estado", fr: "défense de l'Etat"} );
			T.addtranslateobj( {main:"CP", de: "KP", pt: "CP", fr: "CP"} );
			T.addtranslateobj( {main:"CP Limit", de: "KP begrenzen", pt: "CP limitar", fr: "CP limiter"} );						
			T.addtranslateobj( {main:"min Level", de: "min. Level", pt: "nível mínimo", fr: "niveau minimum"} );
			T.addtranslateobj( {main:"clear Cache", de: "Cache leeren", pt: "limpar cache", fr: "vider le cache"} );
			T.addtranslateobj( {main:"Only center on World", de: "Nur auf Welt zentrieren", pt: "Único centro no Mundial", fr: "Seul centre sur World"} );
			T.addtranslateobj( {main:"base set up at", de: "Basis errichtbar", pt: "base de configurar a", fr: "mis en place à la base"} );	
			T.addtranslateobj( {main:"Infantry", de: "Infanterie", pt: "Infantaria", fr: "Infanterie"} );
			T.addtranslateobj( {main:"Vehicle", de: "Fahrzeuge", pt: "Veículos", fr: "Vehicule"} );
			T.addtranslateobj( {main:"Aircraft", de: "Flugzeuge", pt: "Aeronaves", fr: "Aviation"} );
			T.addtranslateobj( {main:"Tiberium", de: "Tiberium", pt: "Tibério", fr: "Tiberium"} );
			T.addtranslateobj( {main:"Crystal", de: "Kristalle", pt: "Cristal", fr: "Cristal"} );
			T.addtranslateobj( {main:"Power", de: "Strom", pt: "Potência", fr: "Energie"} );
			T.addtranslateobj( {main:"Dollar", de: "Credits", pt: "Créditos", fr: "Crédit"} );
			T.addtranslateobj( {main:"Research", de: "Forschung", pt: "Investigação", fr: "Recherche"} );
			T.addtranslateobj( {main:"-----", de: "--", pt: "--", fr: "--"} );
			

			
			
			var MT_Lang = null;
			var MT_Cache = null;
			var MT_Base = null;
			var fileManager = null;
			var lastid = 0;
			var countlastidchecked = 0;
			fileManager = ClientLib.File.FileManager.GetInstance();
			MT_Lang = window.MaelstromTools.Language.getInstance();
			MT_Cache = window.MaelstromTools.Cache.getInstance();
			MT_Base = window.MaelstromTools.Base.getInstance();

			MT_Base.createNewImage("BaseScanner", "ui/icons/icon_item.png", fileManager);
			MT_Base.createNewImage("Emptypixels", "ui/menues/main_menu/misc_empty_pixel.png", fileManager);
			var openBaseScannerOverview = MT_Base.createDesktopButton(T.get("BaseScanner Overview") + "version " + window.__msbs_version, "BaseScanner", false, MT_Base.desktopPosition(2));
			openBaseScannerOverview.addListener("execute", function () {
				Addons.BaseScannerGUI.getInstance().openWindow(T.get("BaseScanner Overview") + " version " + window.__msbs_version);
			}, this);
			Addons.BaseScannerGUI.getInstance().addListener("close", Addons.BaseScannerGUI.getInstance().FN, Addons.BaseScannerGUI.getInstance());
			//this.addListener("resize", function(){ }, this );
			
			MT_Base.addToMainMenu("BaseScanner", openBaseScannerOverview);
			
			if(typeof Addons.AddonMainMenu !== 'undefined'){
				var addonmenu = Addons.AddonMainMenu.getInstance();
				addonmenu.AddMainMenu("Basescanner", function () {
					Addons.BaseScannerGUI.getInstance().openWindow(T.get("BaseScanner Overview") + " version " + window.__msbs_version);
				},"ALT+B");
			}
			
		}

		function getResourcesPart(cityEntities) {
			try {
				var loot = [0, 0, 0, 0, 0, 0, 0, 0];
				if (cityEntities == null) {
					return loot;
				}

				for (var i in cityEntities) {
					var cityEntity = cityEntities[i];
					var unitLevelRequirements = MaelstromTools.Wrapper.GetUnitLevelRequirements(cityEntity);

					for (var x = 0; x < unitLevelRequirements.length; x++) {
						loot[unitLevelRequirements[x].Type] += unitLevelRequirements[x].Count * cityEntity.get_HitpointsPercent();
						if (cityEntity.get_HitpointsPercent() < 1.0) {
							// destroyed

						}
					}
				}
				return loot;
			} catch (e) {
				console.debug("MaelstromTools_Basescanner getResourcesPart", e);
			}
		}

		function objfnkstrON(obj) {
			var key;
			for (key in obj) {
				if (typeof(obj[key]) == "function") {
					var s = obj[key].toString();
					console.debug(key, s);
					//var protostring = s.replace(/\s/gim, "");
					//console.log(key, protostring);
				}
			}
		}

		function foundfnkstring(obj, redex, objname, n) {
			var redexfounds = [];
			var s = obj.toString();
			var protostring = s.replace(/\s/gim, "");
			redexfounds = protostring.match(redex);
			var i;
			for (i = 1; i < (n + 1); i++) {
				if (redexfounds != null && redexfounds[i].length == 6) {
					console.debug(objname, i, redexfounds[i]);
				} else if (redexfounds != null && redexfounds[i].length > 0) {
					console.warn(objname, i, redexfounds[i]);
				} else {
					console.error("Error - ", objname, i, "not found");
					console.warn(objname, protostring);
				}
			}
			return redexfounds;
		}

		function MaelstromTools_Basescanner_checkIfLoaded() {
			try {
				if (typeof qx != 'undefined' && typeof MaelstromTools != 'undefined') {
					createMaelstromTools_Basescanner();
				} else {
					window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 1000);
				}
			} catch (e) {
				console.debug("MaelstromTools_Basescanner_checkIfLoaded: ", e);
			}
		}
		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 10000);
		}
	};
	try {
		var MaelstromScript_Basescanner = document.createElement("script");
		MaelstromScript_Basescanner.innerHTML = "(" + MaelstromTools_Basescanner.toString() + ")();";
		MaelstromScript_Basescanner.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(MaelstromScript_Basescanner);
		}
	} catch (e) {
		console.debug("MaelstromTools_Basescanner: init error: ", e);
	}
})();
