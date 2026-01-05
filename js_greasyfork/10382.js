// ==UserScript==
// @name C&C: Tiberium Alliances - xTr1m's Base Overlay
// @description Provides an overlay over the base of the gain/cost relationship of building upgrades by holding the Control key
// @namespace      http*://*.alliances.commandandconquer.com/*
// @include        http*://*.alliances.commandandconquer.com/*
// @version 1.0
// @author xTr1m
// @grant none
// @source https://github.com/xTr1m/BaseOverlay
// @downloadURL https://update.greasyfork.org/scripts/10382/CC%3A%20Tiberium%20Alliances%20-%20xTr1m%27s%20Base%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/10382/CC%3A%20Tiberium%20Alliances%20-%20xTr1m%27s%20Base%20Overlay.meta.js
// ==/UserScript==

(function() {
    
var injectFunction = function() 
{
    function createClass() 
    {
        qx.Class.define("xTr1m_Base_Overlay", 
        {
            type: "singleton",
            extend: qx.core.Object,
            
            construct: function()
            {
                try
                {
                    var app = qx.core.Init.getApplication();
                                
                    this.__window = new xTr1m_Base_Overlay.Window();
                    
                    var onKeyDown = function(e) 
                    {
                        var xt = xTr1m_Base_Overlay.getInstance();
                        
                        // TODO: Determine if the player is watching his base and doesn't have build/sell/move mode enabled
                        
                        if (!!e.ctrlKey && !xt.__windowOpened)
                        {
                            xt.__openWindow();
                        }
                    };
                    
                    var onKeyUp = function(e) 
                    {
                        var xt = xTr1m_Base_Overlay.getInstance();
                        if (!e.ctrlKey && xt.__windowOpened)
                        {
                            xt.__closeWindow();
                        }
                    };
                    
                    document.addEventListener('keydown', onKeyDown, true);
                    document.addEventListener('keyup', onKeyUp, true);
                    document.addEventListener('blur', onKeyUp, true);
                }
                catch (e)
                {
                    console.log("Something is terribly wrong with xTr1m's Base Ovelray script. :(");
                    console.log(e.toString());
                }
                console.log("xTr1m's Base Overlay script: Initialising finshed");
            },
            
            destruct: function()
            {
            },
                        
            members: 
            {
                __windowOpened: false,
                __window: null,
                
                __openWindow: function()
                {
                    this.__windowOpened = true;
                    this.__window.open();
                },
                
                __closeWindow: function()
                {
                    this.__windowOpened = false;
                    this.__window.close();
                }
            }
        });
                
        qx.Class.define("xTr1m_Base_Overlay.Window", 
        {
            extend: qx.ui.container.Composite,
            
            construct: function()
            {
                this.base(arguments);

                var layout = new qx.ui.layout.Canvas();
        
                this._setLayout(layout);
                this.__background = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
                this._add(this.__background, { left: 0, top: 0, right: 0, bottom: 0, allowGrowX: true, allowGrowY: true });
            },
            
            destruct: function()
            {
            },
                        
            members: 
            {    
                __background: null,
                __buildings: [],
                
                open: function()
                {
                    var app = qx.core.Init.getApplication();
                    
                    var mainOverlay = app.getMainOverlay();
                   
                    this.setWidth(mainOverlay.getWidth());
                    this.setMaxWidth(mainOverlay.getMaxWidth());
                    this.setHeight(mainOverlay.getHeight());
                    this.setMaxHeight(mainOverlay.getMaxHeight());
                    
                    this.__background.removeAll();
                    this.__background.setThemedBackgroundColor("#00000080");
                    
                    var data = ClientLib.Data.MainData.GetInstance();
                    var cities = data.get_Cities();
                    var ownCity = cities.get_CurrentOwnCity();
                    var buildings = ownCity.get_Buildings();
                    var visMain = ClientLib.Vis.VisMain.GetInstance();
                    var visCity = visMain.get_City();
                    var zoomFactor = visCity.get_ZoomFactor();
                    var hudEntities = [];
                    var maxRes = 0;
                    var minRes = Number.MAX_VALUE;
                    var width = visCity.get_GridWidth() * zoomFactor;
                    var height = visCity.get_GridHeight() * zoomFactor;
                    this.collectData(ownCity);
                    
                    for (var ri in this.__buildings) 
                    {
                        var building = this.__buildings[ri];
                        var x = building.PosX * width;
                        var y = building.PosY * height;
                        x -= visCity.get_MinXPosition();
                        y -= visCity.get_MinYPosition();
                        
                        maxRes = Math.max(maxRes, building.Ratio);
                        minRes = Math.min(minRes, building.Ratio);
                            
                        hudEntities.push({ "Ratio": building.Ratio, "X": x, "Y" : y });
                    }
                    
                    var deltaRes = maxRes - minRes;
                    
                    for (var i in hudEntities)
                    {
                        var entity = hudEntities[i];
                        
                        var relRes = (entity.Ratio - minRes) / deltaRes;
                        var relHex = Math.round(relRes * 15);
                        
                        var red = (15 - relHex).toString(16);
                        var green = relHex.toString(16);
                        
                        var box = new qx.ui.layout.HBox();
                        var overlay = new qx.ui.container.Composite(box).set({
						    decorator : new qx.ui.decoration.Single(1, "solid", "#000000").set({backgroundColor : "#" + red + green + "0"}),
							opacity : 0.8,
							width: width - 2, 
                            height: height - 2
						});
                        
                        box.setAlignX("center");
                        box.setAlignY("middle");
                        
                        var label = new qx.ui.basic.Label(entity.Ratio.toFixed(6)).set({
                            allowGrowX: false,
                            allowGrowY: false,
                            textColor: "white",
                            font: new qx.bom.Font(16, ["Verdana", "sans-serif"])
                        });
                        
                        overlay._add(label);
                        
                        this.__background._add(overlay, 
                        { 
                            left: entity.X + 1, 
                            top: entity.Y + 1
                        });
                    }
                    
                    app.getDesktop().add(this, { left: mainOverlay.getBounds().left, top: mainOverlay.getBounds().top });
                },
                
                close: function()
                {
                    var app = qx.core.Init.getApplication();
                    app.getDesktop().remove(this);
                },
                
                collectData: function (city) 
                {
                    try 
                    {
                        var resList = [];
                        resList.push(this.getResList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.TiberiumPackageSize, ClientLib.Base.EModifierType.TiberiumProduction));
                        resList.push(this.getResList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.CrystalPackageSize, ClientLib.Base.EModifierType.CrystalProduction));
                        resList.push(this.getResList(city, [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction));
                        resList.push(this.getResList(city, [ClientLib.Base.ETechName.Refinery, ClientLib.Base.ETechName.PowerPlant], ClientLib.Base.EModifierType.CreditsPackageSize, ClientLib.Base.EModifierType.CreditsProduction));
                        
                        this.__buildings = [];
                        for (var i in resList)
                        {
                            var resEntry = resList[i];
                            for (var b in resEntry)
                            {
                                var building = resEntry[b];
                                var index = building.PosY * 10 + building.PosX;
                                if (!(index in this.__buildings))
                                {
                                    this.__buildings[index] = building;
                                }
                                else
                                {
                                    this.__buildings[index].Gain += building.Gain;
                                }
                            }
                        }    
                        
                        for (var j in this.__buildings)
                        {
                            this.__buildings[j].Ratio = this.__buildings[j].Gain / this.__buildings[j].Cost;
                        }
                    }
                    catch (e) 
                    {
                        console.log("xTr1m_Base_Overlay.Window.collectData: ", e);
                    }
                },
                
                getResList: function (city, arTechtypes, eModPackageSize, eModProduction) 
                {
                    try 
                    {
                        var i = 0;
                        var buildings = city.get_Buildings().d;
                        var resAll = [];

                        var objbuildings = [];
                        if (PerforceChangelist >= 376877) 
                        {
                            for (var o in buildings)  //new
                            {
                                objbuildings.push(buildings[o]);
                            }
                        }
                        else
                        {
                            for (i = 0; i < buildings.length; i++)  //old
                            {
                                objbuildings.push(buildings[i]);
                            }
                        }

                        for (i = 0; i < objbuildings.length; i++) 
                        {
                            var city_building = objbuildings[i];

                            var iTechType = city_building.get_TechName();
                            var bSkip = true;
                            for (var iTypeKey in arTechtypes) 
                            {
                                if (arTechtypes[iTypeKey] == iTechType) 
                                {
                                    bSkip = false;
                                    break;
                                }
                            }
                            
                            if (bSkip)
                            {
                                continue;
                            }
                            
                            var city_buildingdetailview = city.GetBuildingDetailViewInfo(city_building);
                            if (city_buildingdetailview === null) 
                            {
                                continue;
                            }
                            
                            var bindex = city_building.get_Id();
                            var resbuilding = [];
                            resbuilding.PosX = city_building.get_CoordX();
                            resbuilding.PosY = city_building.get_CoordY();
                            resbuilding.Gain = 0;
                            
                            for (var ModifierType in city_buildingdetailview.OwnProdModifiers.d) 
                            {
                                switch (parseInt(ModifierType, 10)) 
                                {
                                    case eModPackageSize:
                                    {
                                        var ModOj = city_buildingdetailview.OwnProdModifiers.d[city_building.get_MainModifierTypeId()];
                                        var CurrentDelay = (ModOj.TotalValue) / ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                                        var NextDelay = (ModOj.TotalValue + ModOj.NewLvlDelta) / ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                                        
                                        var mtProd = city_buildingdetailview.OwnProdModifiers.d[ModifierType];
                                        var CurrentProd = mtProd.TotalValue / CurrentDelay;
                                        var NextProd = (mtProd.TotalValue + mtProd.NewLvlDelta) / NextDelay;
                                        resbuilding.Gain += NextProd - CurrentProd;
                                        break;
                                    }
                                    case eModProduction:
                                    {
                                        resbuilding.Gain += city_buildingdetailview.OwnProdModifiers.d[ModifierType].NewLvlDelta;
                                        break;
                                    }
                                }
                            }
                            
                            var TechLevelData = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(city_building.get_CurrentLevel() + 1, city_building.get_TechGameData_Obj());
                            var Cost = 0;
                            
                            for (var costtype in TechLevelData) 
                            {
                                if (typeof(TechLevelData[costtype]) == "function" || TechLevelData[costtype].Type == "0") 
                                {
                                    continue;
                                }

                                if (parseInt(TechLevelData[costtype].Count) <= 0) 
                                {
                                    continue;
                                }
                                
                                Cost += TechLevelData[costtype].Count;
                            }
                            
                            resbuilding.Cost = Cost;
                            
                            resAll.push(resbuilding);
                        }

                        return resAll;
                    }
                    catch (e) 
                    {
                        console.log("xTr1m_Base_Overlay.Window.getResList: ", e);
                    }
                },
            }
        });
    }
    
    function waitForGame() 
    {
        try 
        {
            if (typeof qx != 'undefined' && typeof qx.core != 'undefined' && typeof qx.core.Init != 'undefined' && qx.core.Init.getApplication() !== null) 
            {
                var app = qx.core.Init.getApplication();
                if (app.initDone === true) 
                {
                    try
                    {                    
                        createClass();
                        
                        xTr1m_Base_Overlay.getInstance();
                    }
                    catch(e)
                    {
                        console.log("xTr1m's Base Overlay script init error:");
                        console.log(e);
                    }
                } 
                else
                    window.setTimeout(waitForGame, 1000);
            } 
            else 
            {
                window.setTimeout(waitForGame, 1000);
            }
        } 
        catch (e) 
        {
            if (typeof console != 'undefined') console.log(e);
            else if (window.opera) opera.postError(e);
            else GM_log(e);
        }
    }
    
    window.setTimeout(waitForGame, 1000);    
};

var script = document.createElement("script");
var txt = injectFunction.toString();
script.innerHTML = "(" + txt + ")();";
script.type = "text/javascript";

document.getElementsByTagName("head")[0].appendChild(script);
    
})();