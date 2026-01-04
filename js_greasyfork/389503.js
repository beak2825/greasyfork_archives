// ==UserScript==
// @name        TA Autorepair
// @description Repair buildings in a specific order
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @version     1.0.0
// @author      petui
// @contributor    AlkalyneD4 (https://github.com/SebHeuze) Patch 19.3 Fix
// @namespace https://greasyfork.org/users/9599
// @downloadURL https://update.greasyfork.org/scripts/389503/TA%20Autorepair.user.js
// @updateURL https://update.greasyfork.org/scripts/389503/TA%20Autorepair.meta.js
// ==/UserScript==
(function () {
    var n = function () {
        'use strict';
        function createAutoRepair() {
            console.log('AutoRepair loaded');
            qx.Class.define('AutoRepair', {
                type: 'singleton',
                extend: qx.core.Object,
                statics: {
                    Defaults: {
                        Interval: 10,
                        RepairOrder: [ClientLib.Base.ETechName.Defense_Facility, ClientLib.Base.ETechName.Construction_Yard, ClientLib.Base.ETechName.Defense_HQ, ClientLib.Base.ETechName.Support_Air, ClientLib.Base.ETechName.Command_Center, ClientLib.Base.ETechName.Barracks, ClientLib.Base.ETechName.Factory, ClientLib.Base.ETechName.Airport, ClientLib.Base.ETechName.Silo, ClientLib.Base.ETechName.Accumulator, ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Harvester_Crystal, ClientLib.Base.ETechName.Refinery]
                    },
                    ResourceModifierTypes: [ClientLib.Base.EModifierType.CreditsProduction, ClientLib.Base.EModifierType.CrystalProduction, ClientLib.Base.EModifierType.PowerProduction, ClientLib.Base.EModifierType.TiberiumProduction]
                },
                members: {
                    settingsWindow: null,
                    intervalTimer: null,
                    lockdownEndTimer: null,
                    repairContainerButton: null,
                    interval: null,
                    repairOrder: null,
                    initialize: function () {
                        this.initializeHacks();
                        this.initializeUserInterface();
                        this.loadSettings();
                        phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), 'Change', ClientLib.Data.CitiesChange, this, this.onCitiesChange);
                        this.onCitiesChange()
                    },
                    initializeHacks: function () {
                        var a;
                        if (typeof ClientLib.Data.CityEntity.prototype.CanRepair !== 'function') {
                            a = ClientLib.Vis.City.CityBuilding.prototype.CanExecuteCommand.toString();
                            var b = a.match(/case \$I\.[A-Z]{6}\.RepairBuilding:return this\.[A-Z]{6}\(\)\.([A-Z]{6})\(\);/)[1];
                            ClientLib.Data.CityEntity.prototype.CanRepair = ClientLib.Data.CityEntity.prototype[b]
                        }
                        if (typeof ClientLib.Data.CityEntity.prototype.Repair !== 'function') {
                            a = ClientLib.Vis.City.CityBuilding.prototype.ExecuteCommand.toString();
                            var c = a.match(/case \$I\.[A-Z]{6}\.RepairBuilding:this\.[A-Z]{6}\(\)\.([A-Z]{6})\(false\);return true;/)[1];
                            ClientLib.Data.CityEntity.prototype.Repair = ClientLib.Data.CityEntity.prototype[c]
                        }
                        if (typeof ClientLib.Data.CityEntity.prototype.get_City !== 'function') {
                            a = ClientLib.Data.CityEntity.prototype.get_CurrentLevel.toString();
                            var d = a.match(/return\(this\.([A-Z]{6})\.[A-Z]{6}\(\)-[a-z]\);/)[1];
                            ClientLib.Data.CityEntity.prototype.get_City = function () {
                                return this[d]
                            }
                        }
                        if (typeof webfrontend.gui.PlayArea.PlayAreaHUD.prototype.get_RepairContainer !== 'function') {
                            a = PerforceChangelist >= 430398 ? webfrontend.gui.PlayArea.PlayAreaHUD.$$original.toString() : Function.prototype.toString.call(webfrontend.gui.PlayArea.PlayAreaHUD.prototype.constructor);
                            var e = a.match(/this\.([A-Za-z_]+)=[A-Za-z]+\.container;/)[1];
                            webfrontend.gui.PlayArea.PlayAreaHUD.prototype.get_RepairContainer = function () {
                                return this[e]
                            }
                        }
                        if (AutoRepair.prototype.GetUnitRepairCosts === null) {
                            if (ClientLib.API.Util.GetUnitRepairCostsForCity === undefined) {
                                a = ClientLib.API.Util.GetUnitRepairCosts.toString();
                                var f = a.replace(/^function (?:anonymous)?\((a,b,c\n?)(?:\s\/\*\*\/)?\)\s?\{/, 'function (city,$1) {').replace(/(var [a-z])=\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.([A-Z]{6}\(\))/, '$1=city.$2');
                                AutoRepair.prototype.GetUnitRepairCosts = eval('(' + f + ')')
                            } else {
                                AutoRepair.prototype.GetUnitRepairCosts = ClientLib.API.Util.GetUnitRepairCostsForCity
                            }
                        }
                    },
                    initializeUserInterface: function () {
                        this.repairContainerButton = new qx.ui.form.Button('Auto-repair').set({
                            font: 'font_size_13',
                            paddingRight: 8
                        });
                        this.repairContainerButton.addListener('execute', this.onRepairContainerButtonClick, this);
                        qx.core.Init.getApplication().getPlayArea().getHUD().get_RepairContainer().addListener('appear', this.onRepairContainerAppear, this)
                    },
                    saveSettings: function () {
                        var a = ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId();
                        localStorage.setItem('TAAutoRepair/' + a + '/settings', JSON.stringify({
                            interval: this.interval,
                            repairOrder: this.repairOrder
                        }))
                    },
                    loadSettings: function () {
                        var a = ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId();
                        var b = JSON.parse(localStorage.getItem('TAAutoRepair/' + a + '/settings')) || {};
                        this.interval = b.interval || AutoRepair.Defaults.Interval;
                        this.repairOrder = b.repairOrder || AutoRepair.Defaults.RepairOrder
                    },
                    onRepairContainerAppear: function (a) {
                        var b = a.getTarget();
                        if (ClientLib.Vis.VisMain.GetInstance().get_Mode() === ClientLib.Vis.Mode.City) {
                            b.addAt(this.repairContainerButton, 0)
                        } else if (this.repairContainerButton.getLayoutParent() === b) {
                            b.remove(this.repairContainerButton)
                        }
                    },
                    onRepairContainerButtonClick: function () {
                        if (this.settingsWindow === null) {
                            this.settingsWindow = new AutoRepair.SettingsWindow(this.repairOrder, this.interval);
                            this.settingsWindow.addListener('change', this.onSettingsChange, this)
                        }
                        this.settingsWindow.open();
                        qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_REPAIR).setValue(false)
                    },
                    onSettingsChange: function (a) {
                        var b = a.getData();
                        this.interval = b.interval;
                        this.repairOrder = b.repairOrder;
                        this.saveSettings();
                        if (this.intervalTimer !== null) {
                            this.intervalTimer.dispose();
                            this.intervalTimer = null;
                            console.log('AutoRepair resetting repair interval due to settings change');
                            this.onCitiesChange()
                        }
                    },
                    onCitiesChange: function () {
                        if (this.lockdownEndTimer !== null) {
                            this.lockdownEndTimer.dispose();
                            this.lockdownEndTimer = null
                        }
                        var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                        var b = false;
                        var c = null;
                        for (var d in a) {
                            var e = a[d];
                            if (!e.get_IsGhostMode() && e.get_IsDamaged()) {
                                if (!e.get_IsLocked()) {
                                    b = true;
                                    break
                                } else if (c === null || e.get_LockdownEndStep() < c) {
                                    c = e.get_LockdownEndStep()
                                }
                            }
                        }
                        if (b) {
                            if (this.intervalTimer === null) {
                                console.log('AutoRepair starting repair interval');
                                this.intervalTimer = new qx.event.Timer(this.interval * 60000);
                                this.intervalTimer.addListener('interval', this.repair, this);
                                this.intervalTimer.start();
                                this.repair()
                            }
                        } else {
                            if (this.intervalTimer !== null) {
                                this.intervalTimer.dispose();
                                this.intervalTimer = null;
                                console.log('AutoRepair repairs finished')
                            }
                            if (c !== null) {
                                var f = ClientLib.Data.MainData.GetInstance().get_Time();
                                this.lockdownEndTimer = qx.event.Timer.once(this.onCitiesChange, this, (c - f.GetServerStep()) / f.get_StepsPerSecond() * 1000 + 500)
                            }
                        }
                    },
                    repair: function () {
                        var b = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                        for (var c in b) {
                            var d = b[c];
                            if (d.get_IsGhostMode() || !d.get_IsDamaged() || d.get_IsLocked()) {
                                continue
                            }
                            var e = ClientLib.Vis.VisMain.GetInstance();
                            var f = e.get_Mode();
                            e.set_Mode(ClientLib.Vis.Mode.City);
                            var g = this.getExpandedRepairItems();
                            var h = d.get_CityBuildingsData();
                            var j = true;
                            for (var i = 0; i < g.length; i++) {
                                var k = h.GetAllBuildingsByTechName(g[i]).l;
                                var l = k.filter(function (a) {
                                    return a.get_IsDamaged()
                                });
                                l.sort(this.compareBuildingReturnOnFullRepair.bind(this));
                                for (var a = 0; a < l.length; a++) {
                                    var m = l[a];
                                    if (m.CanRepair()) {
                                        m.Repair()
                                    }
                                    if (m.get_IsDamaged()) {
                                        j = false;
                                        break
                                    }
                                }
                                if (!j) {
                                    break
                                }
                            }
                            if (j && d.get_IsDamaged() && d.CanRepairAll()) {
                                d.RepairAll()
                            }
                            e.set_Mode(f)
                        }
                    },
                    getExpandedRepairItems: function () {
                        var a = this.repairOrder.slice();
                        for (var i = 0; i < a.length; i++) {
                            if (a[i] === ClientLib.Base.ETechName.Support_Air) {
                                a.splice(i + 1, 0, ClientLib.Base.ETechName.Support_Ion, ClientLib.Base.ETechName.Support_Art);
                                i += 2
                            }
                        }
                        return a
                    },
                    compareBuildingReturnOnFullRepair: function (a, b) {
                        var c = this.getBuildingReturnOnFullRepair(a);
                        var d = this.getBuildingReturnOnFullRepair(b);
                        if (c === false) {
                            if (d === false) {
                                return 0
                            } else {
                                return 1
                            }
                        } else if (d === false) {
                            return -1
                        }
                        return c - d
                    },
                    getBuildingReturnOnFullRepair: function (c) {
                        var d = this.getBuildingContinuousProductionPerHour(c);
                        var e = Object.keys(d).reduce(function (a, b) {
                            return a + d[b].Delta
                        }, 0);
                        if (e <= 0) {
                            return false
                        }
                        var f = this.getEntityFullRepairCosts(c);
                        var g = Object.keys(f).reduce(function (a, b) {
                            return a + f[b]
                        }, 0);
                        return g / e
                    },
                    getBuildingContinuousProductionPerHour: function (a) {
                        var b = a.get_City().GetBuildingDetailViewInfo(a);
                        var c = {};
                        if (b.OwnProdModifiers !== null) {
                            var d = b.OwnProdModifiers.d;
                            for (var i = 0; i < AutoRepair.ResourceModifierTypes.length; i++) {
                                var e = AutoRepair.ResourceModifierTypes[i];
                                if (d[e]) {
                                    var f = d[e];
                                    c[e] = {
                                        Current: f.TotalValue,
                                        Delta: (f.TotalValue / a.get_HitpointsPercent()) - f.TotalValue
                                    }
                                }
                            }
                        }
                        return c
                    },
                    getEntityFullRepairCosts: function (a) {
                        var b = ClientLib.Base.Util.FilterResourceCosts(this.GetUnitRepairCosts(a.get_City(), a.get_CurrentLevel(), a.get_MdbUnitId(), 1));
                        var c = {};
                        for (var i = 0; i < b.length; i++) {
                            c[b[i].Type] = b[i].Count
                        }
                        return c
                    },
                    GetUnitRepairCosts: null
                }
            });
            qx.Class.define('AutoRepair.SettingsWindow', {
                extend: qx.ui.window.Window,
                construct: function (a, b) {
                    qx.ui.window.Window.call(this);
                    this.currentRepairOrder = a;
                    this.set({
                        caption: 'Auto Repair Settings',
                        icon: 'FactionUI/icons/icon_mode_repair.png',
                        showMaximize: false,
                        showMinimize: false,
                        allowMaximize: false,
                        allowMinimize: false,
                        resizable: false,
                        textColor: 'text-label-light',
                        width: 330
                    });
                    this.getChildControl('icon').set({
                        scale: true,
                        width: 20,
                        height: 20,
                        alignY: 'middle'
                    });
                    this.setLayout(new qx.ui.layout.VBox(4));
                    var c = qx.core.Init.getApplication().getMainOverlay().getBounds();
                    this.moveTo(c.left + c.width - this.getWidth() - 150, c.top + c.height - 550);
                    var d = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                    d.add(new qx.ui.basic.Label('Interval in minutes (5-360):').set({
                        alignY: 'middle'
                    }));
                    d.add(new qx.ui.core.Spacer(), {
                        flex: 1
                    });
                    d.add(this.intervalSpinner = new qx.ui.form.Spinner().set({
                        minimum: 5,
                        maximum: 360,
                        value: b
                    }));
                    this.intervalSpinner.addListener('changeValue', this.onSettingsChange, this);
                    this.add(d);
                    this.repairOrderList = new AutoRepair.SettingsWindow.DraggableList();
                    this.repairOrderList.addListener('change', this.onSettingsChange, this);
                    var e = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                    e.add(new qx.ui.basic.Label('Repair order (drag & drop):'));
                    e.add(this.repairOrderList);
                    this.add(e);
                    var f = new qx.ui.form.Button('Reset to default').set({
                        paddingLeft: 10,
                        paddingRight: 10
                    });
                    f.addListener('execute', this.onResetClick, this);
                    var g = new qx.ui.form.Button('Cancel').set({
                        paddingLeft: 10,
                        paddingRight: 10
                    });
                    g.addListener('execute', this.close, this);
                    this.saveButton = new qx.ui.form.Button('Save').set({
                        paddingLeft: 10,
                        paddingRight: 10
                    });
                    this.saveButton.addListener('execute', this.onSaveClick, this);
                    var h = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
                    h.add(f, {
                        flex: 1
                    });
                    h.add(g, {
                        flex: 1
                    });
                    h.add(this.saveButton, {
                        flex: 1
                    });
                    this.add(h);
                    this.addListener('appear', this.onAppear, this)
                },
                events: {
                    change: 'qx.event.type.Data'
                },
                members: {
                    repairOrderList: null,
                    intervalSpinner: null,
                    saveButton: null,
                    currentRepairOrder: [],
                    onAppear: function () {
                        this.repairOrderList.removeAllItems();
                        this.populateRepairOrderList(this.currentRepairOrder);
                        this.saveButton.setEnabled(false)
                    },
                    onSettingsChange: function () {
                        this.saveButton.setEnabled(true)
                    },
                    onResetClick: function () {
                        this.repairOrderList.removeAllItems();
                        this.populateRepairOrderList(AutoRepair.Defaults.RepairOrder);
                        this.intervalSpinner.setValue(AutoRepair.Defaults.Interval)
                    },
                    onSaveClick: function () {
                        this.currentRepairOrder = this.repairOrderList.getItems().map(function (a) {
                            return a.getUserData('techName')
                        });
                        this.fireDataEvent('change', {
                            interval: this.intervalSpinner.getValue(),
                            repairOrder: this.currentRepairOrder
                        });
                        this.close()
                    },
                    populateRepairOrderList: function (a) {
                        var b = ClientLib.Res.ResMain.GetInstance();
                        var c = ClientLib.Data.MainData.GetInstance().get_Player().get_Faction();
                        for (var i = 0; i < a.length; i++) {
                            var d = b.GetTech_Obj(ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(a[i], c)).dn;
                            switch (a[i]) {
                            case ClientLib.Base.ETechName.Harvester_Crystal:
                                d += ' ' + b.GetResource(ClientLib.Base.EResourceType.Crystal).dn;
                                break;
                            case ClientLib.Base.ETechName.Harvester:
                                d += ' ' + b.GetResource(ClientLib.Base.EResourceType.Tiberium).dn;
                                break;
                            case ClientLib.Base.ETechName.Support_Air:
                                d = [d, b.GetTech_Obj(ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Support_Ion, c)).dn, b.GetTech_Obj(ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Support_Art, c)).dn].join('/');
                                break
                            }
                            var e = new qx.ui.form.ListItem(d);
                            e.setUserData('techName', a[i]);
                            this.repairOrderList.addItem(e)
                        }
                    }
                }
            });
            qx.Class.define('AutoRepair.SettingsWindow.DraggableList', {
                extend: qx.ui.container.Composite,
                construct: function () {
                    qx.ui.container.Composite.call(this);
                    this.setLayout(new qx.ui.layout.Canvas());
                    this.add(this.list = new qx.ui.form.List().set({
                        draggable: true,
                        droppable: true,
                        selectionMode: 'single',
                        height: null
                    }), {
                        edge: 1
                    });
                    this.add(this.indicator = new qx.ui.core.Widget().set({
                        decorator: PerforceChangelist >= 430398 ? new qx.ui.decoration.Decorator().set({
                            top: [1, 'solid', '#ccaf72']
                        }) : new qx.ui.decoration.Single().set({
                            top: [1, 'solid', '#ccaf72']
                        }),
                        height: 0,
                        opacity: 0.5,
                        zIndex: 100,
                        droppable: true,
                        visibility: 'excluded'
                    }), {
                        left: 6,
                        right: 6
                    });
                    this.list.addListener('dragstart', this.onDragStart, this);
                    this.list.addListener('dragend', this.onDragEnd, this);
                    this.list.addListener('drag', this.onDrag, this);
                    this.list.addListener('dragover', this.onDragOver, this);
                    this.list.addListener('drop', this.onDrop, this);
                    this.list.addListener('addItem', this.onAddItem, this);
                    this.indicator.addListener('drop', this.onDropIndicator, this)
                },
                events: {
                    change: 'qx.event.type.Event'
                },
                members: {
                    list: null,
                    currentItem: null,
                    indicator: null,
                    addItem: function (a) {
                        this.list.add(a)
                    },
                    getItems: function () {
                        return this.list.getChildren()
                    },
                    removeAllItems: function () {
                        this.list.removeAll()
                    },
                    onDragStart: function (a) {
                        a.addAction('move');
                        this.indicator.show()
                    },
                    onDragEnd: function (a) {
                        this.indicator.exclude()
                    },
                    onDrag: function (a) {
                        var b = a.getOriginalTarget();
                        if (this.currentItem !== b && b instanceof qx.ui.form.ListItem) {
                            this.currentItem = b;
                            this.indicator.setLayoutProperties({
                                top: b.getBounds().top + 4
                            })
                        }
                    },
                    onDragOver: function (a) {
                        if (a.getRelatedTarget()) {
                            a.preventDefault()
                        }
                    },
                    onDrop: function (a) {
                        var b = a.getOriginalTarget();
                        if (!(b instanceof qx.ui.form.ListItem)) {
                            b = this.currentItem
                        }
                        this.reorderList(b)
                    },
                    onDropIndicator: function (a) {
                        this.reorderList(this.currentItem)
                    },
                    onAddItem: function () {
                        this.fireNonBubblingEvent('change')
                    },
                    reorderList: function (a) {
                        var b = this.list.getSortedSelection();
                        for (var i = 0; i < b.length; i++) {
                            this.list.addBefore(b[i], a);
                            this.list.addToSelection(b[i])
                        }
                    }
                }
            })
        }
        function waitForGame() {
            try {
                if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
                    createAutoRepair();
                    AutoRepair.getInstance().initialize()
                } else {
                    setTimeout(waitForGame, 1000)
                }
            } catch (e) {
                console.log('AutoRepair: ', e.toString())
            }
        }
        setTimeout(waitForGame, 1000)
    };
    var o = document.createElement('script');
    o.innerHTML = '(' + n.toString() + ')();';
    o.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(o)
})();