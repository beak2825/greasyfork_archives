// ==UserScript==
// @name        C&C NOVAGAMA Ultimate Pack Continued
// @namespace   https://greasyfork.org/de/scripts/2142-c-c-novagama-ultimate-pack-continued/
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     https://*.alliances.commandandconquer.com/*/index.aspx*
/**   url changed thx @kaeptmblaubaer1000 **/
// @include     http://*tiberiumalliances.com/*
// @include     https://*tiberiumalliances.com/*
// @include     https://signin.ea.com/p/web2/*
// @grant         GM_log
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @grant         unsafeWindow
// @description Ultimate Collection for Command & Conquer Tiberium Alliance Web Game.
// @compatible chrome
// @compatible firefox

// @version     4.2.1
// @icon        http://eistee82.github.io/ta_simv2/icon.png
// @author dark_atticus, continued by TFlipp
// @downloadURL https://update.greasyfork.org/scripts/2142/CC%20NOVAGAMA%20Ultimate%20Pack%20Continued.user.js
// @updateURL https://update.greasyfork.org/scripts/2142/CC%20NOVAGAMA%20Ultimate%20Pack%20Continued.meta.js
// ==/UserScript==

// type: /chelp in any text box and hit <enter> for a list of commands

/***********************************************************************************
Infernal Wrapper
***********************************************************************************/
// ==UserScript==
// @name infernal wrapper
// @description Supplies some wrapper functions for public use
// @downloadURL    https://raw.githubusercontent.com/leo7044/CnC_TA/master/API_wrapper.user.js
// @updateURL      https://raw.githubusercontent.com/leo7044/CnC_TA/master/API_wrapper.user.js
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include        http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @version 0.390737.6.3
// @author infernal_me, KRS_L, krisan
// @contributor leo7044 (https://github.com/leo7044)
// @contributor Netquik
// ==/UserScript==

(function () {
    var CCTAWrapper_main = function () {
        
window.navigator.pointerEnabled = "PointerEvent" in window;
        try {
            _log = function () {
                if (typeof console != 'undefined') console.log(arguments);
                else if (window.opera) opera.postError(arguments);
                else GM_log(arguments);
            }

            function createCCTAWrapper() {
                console.log('CCTAWrapper loaded');
                _log('wrapper loading' + PerforceChangelist);
                System = $I;
                SharedLib = $I;
                var strFunction;

                // SharedLib.Combat.CbtSimulation.prototype.DoStep
                for (var x in $I) {
                    for (var key in $I[x].prototype) {
                        if ($I[x].prototype.hasOwnProperty(key) && typeof ($I[x].prototype[key]) === 'function') { // reduced iterations from 20K to 12K
                            strFunction = $I[x].prototype[key].toString();
                            if (strFunction.indexOf("().l;var b;for (var d = 0 ; d < c.length ; d++){b = c[d];if((b.") > -1) {
                                $I[x].prototype.DoStep = $I[x].prototype[key];
                                console.log("SharedLib.Combat.CbtSimulation.prototype.DoStep = $I." + x + ".prototype." + key);
                                break;
                            }
                        }
                    }
                }

                // ClientLib.Data.CityUnits.prototype.get_OffenseUnits edited by Netquik
                strFunction = ClientLib.Data.CityUnits.prototype.HasUnitMdbId.toString();
                /*var searchString = "for(var b in {d:this.";
                var startPos = strFunction.indexOf(searchString) + searchString.length;
                var fn_name = strFunction.slice(startPos, startPos + 6);*/
                var fn_name = strFunction.match(/for {0,1}\(var b in {d:this.([A-Z]{6})/)[1];
                strFunction = "var $createHelper;return this." + fn_name + ";";
                var fn = Function('', strFunction);
                ClientLib.Data.CityUnits.prototype.get_OffenseUnits = fn;
                console.log("ClientLib.Data.CityUnits.prototype.get_OffenseUnits = function(){var $createHelper;return this." + fn_name + ";}");

                // ClientLib.Data.CityUnits.prototype.get_DefenseUnits edited by Netquik
                strFunction = ClientLib.Data.CityUnits.prototype.HasUnitMdbId.toString();
                /*searchString = "for(var c in {d:this.";
                startPos = strFunction.indexOf(searchString) + searchString.length;
                fn_name = strFunction.slice(startPos, startPos + 6);*/
                fn_name = strFunction.match(/for {0,1}\(var c in {d:this.([A-Z]{6})/)[1];
                strFunction = "var $createHelper;return this." + fn_name + ";";
                fn = Function('', strFunction);
                ClientLib.Data.CityUnits.prototype.get_DefenseUnits = fn;
                console.log("ClientLib.Data.CityUnits.prototype.get_DefenseUnits = function(){var $createHelper;return this." + fn_name + ";}");

                // ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation edited by Netquik
                strFunction = ClientLib.Vis.Battleground.Battleground.prototype.StartBattle.toString();
                /*searchString = "=0;for(var a=0;(a<9);a++){this.";
                startPos = strFunction.indexOf(searchString) + searchString.length;
                fn_name = strFunction.slice(startPos, startPos + 6);*/
                var regee = new RegExp(/=0;for\(var a=0; {0,1}\(a<9\); {0,1}a\+\+\){this.([A-Z]{6})/);
                fn_name = strFunction.match(regee)[1];
                strFunction = "return this." + fn_name + ";";
                fn = Function('', strFunction);
                ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation = fn;
                console.log("ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation = function(){return this." + fn_name + ";}");

                // GetNerfBoostModifier
                if (typeof ClientLib.Vis.Battleground.Battleground.prototype.GetNerfAndBoostModifier == 'undefined') ClientLib.Vis.Battleground.Battleground.prototype.GetNerfAndBoostModifier = ClientLib.Base.Util.GetNerfAndBoostModifier;

                _log('wrapper loaded');
            }
        } catch (e) {
            console.log("createCCTAWrapper: ", e);
        }

        function CCTAWrapper_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined') {
                    createCCTAWrapper();
                } else {
                    window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
                }
            } catch (e) {
                CCTAWrapper_IsInstalled = false;
                console.log("CCTAWrapper_checkIfLoaded: ", e);
            }
        }

        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
        }
    }

    try {
        var CCTAWrapper = document.createElement("script");
        CCTAWrapper.innerHTML = "var CCTAWrapper_IsInstalled = true; (" + CCTAWrapper_main.toString() + ")();";
        CCTAWrapper.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(CCTAWrapper);
        }
    } catch (e) {
        console.log("CCTAWrapper: init error: ", e);
    }
})();

/***********************************************************************************
Tiberium Alliances Info Sticker
***********************************************************************************/
// ==UserScript==
// @name       Unicode Info Sticker
// @version    1.11.10.4
// @description  Based on Maelstrom Dev Tools. Modified MCV timer, repair time label, resource labels.
// ==/UserScript==

(function () {
    var InfoSticker_main = function () {
        try {
            function createInfoSticker() {
                console.log('InfoSticker loaded');
                // define Base
                qx.Class.define("InfoSticker.Base", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {
                        /* Desktop */
                        dataTimerInterval: 1000,
                        positionInterval: 500,
                        tibIcon: null,
                        cryIcon: null,
                        powIcon: null,
                        creditIcon: null,
                        repairIcon: null,
                        hasStorage: false,

                        initialize: function () {
                            try {
                                this.hasStorage = 'localStorage' in window && window['localStorage'] !== null;
                            } catch (se) {}
                            try {
                                var fileManager = ClientLib.File.FileManager.GetInstance();
                                this.tibIcon = fileManager.GetPhysicalPath("ui/common/icn_res_tiberium.png");
                                this.cryIcon = fileManager.GetPhysicalPath("ui/common/icn_res_chrystal.png");
                                this.powIcon = fileManager.GetPhysicalPath("ui/common/icn_res_power.png");
                                this.creditIcon = fileManager.GetPhysicalPath("ui/common/icn_res_dollar.png");
                                this.repairIcon = fileManager.GetPhysicalPath("ui/icons/icn_repair_off_points.png");

                                if (typeof phe.cnc.Util.attachNetEvent == 'undefined')
                                    this.attachEvent = webfrontend.gui.Util.attachNetEvent;
                                else
                                    this.attachEvent = phe.cnc.Util.attachNetEvent;

                                this.runMainTimer();
                            } catch (e) {
                                console.log("InfoSticker.initialize: ", e.toString());
                            }
                        },
                        runMainTimer: function () {
                            try {
                                var self = this;
                                this.calculateInfoData();
                                window.setTimeout(function () {
                                    self.runMainTimer();
                                }, this.dataTimerInterval);
                            } catch (e) {
                                console.log("InfoSticker.runMainTimer: ", e.toString());
                            }
                        },
                        runPositionTimer: function () {
                            try {
                                var self = this;
                                this.repositionSticker();
                                window.setTimeout(function () {
                                    self.runPositionTimer();
                                }, this.positionInterval);
                            } catch (e) {
                                console.log("InfoSticker.runPositionTimer: ", e.toString());
                            }
                        },
                        infoSticker: null,
                        mcvPopup: null,
                        mcvTimerLabel: null,
                        mcvInfoLabel: null,
                        mcvPane: null,

                        repairPopup: null,
                        repairTimerLabel: null,

                        resourcePane: null,
                        resourceHidden: false,
                        resourceTitleLabel: null,
                        resourceHideButton: null,
                        resourceLabel1: null,
                        resourceLabel2: null,
                        resourceLabel3: null,

                        resourceLabel1per: null,
                        resourceLabel2per: null,
                        resourceLabel3per: null,

                        productionTitleLabel: null,
                        productionLabelPower: null,
                        productionLabelCredit: null,

                        repairInfoLabel: null,

                        lastButton: null,

                        top_image: null,
                        bot_image: null,

                        toFlipH: [],

                        pinButton: null,
                        pinned: false,

                        pinTop: 130,
                        pinButtonDecoration: null,
                        pinPane: null,

                        pinIconFix: false,

                        lockButton: null,
                        locked: false,

                        lockButtonDecoration: null,
                        lockPane: null,

                        lockIconFix: false,

                        mcvHide: false,
                        repairHide: false,
                        resourceHide: false,
                        productionHide: false,
                        stickerBackground: null,

                        mcvPane: null,

                        pinLockPos: 0,

                        attachEvent: function() {},

                        isNull: function(e) {
                            return typeof e == "undefined" || e == null;
                        },

                        getApp: function() {
                            return qx.core.Init.getApplication();
                        },

                        getBaseListBar: function() {
                            var app = this.getApp();
                            var b;
                            if(!this.isNull(app)) {
                                b = app.getBaseNavigationBar();
                                if(!this.isNull(b)) {
                                    if(b.getChildren().length > 0) {
                                        b = b.getChildren()[0];
                                        if(b.getChildren().length > 0) {
                                            b = b.getChildren()[0];
                                            return b;
                                        }
                                    }
                                }
                            }
                            return null;
                        },

                        repositionSticker: function () {
                            try {
                                var i;

                                if (this.infoSticker && !this.mcvInfoLabel.isDisposed() && !this.mcvPopup.isDisposed()) {
                                    var dele;

                                    try {
                                        if (this.top_image != null) {
                                            dele = this.top_image.getContentElement().getDomElement();
                                            if (dele != null) {
                                                dele.style["-moz-transform"] = "scaleY(-1)";
                                                dele.style["-o-transform"] = "scaleY(-1)";
                                                dele.style["-webkit-transform"] = "scaleY(-1)";
                                                dele.style.transform = "scaleY(-1)";
                                                dele.style.filter = "FlipV";
                                                dele.style["-ms-filter"] = "FlipV";
                                                this.top_image = null;
                                            }
                                        }
                                        for (i = this.toFlipH.length - 1; i >= 0; i--) {
                                            var e = this.toFlipH[i];
                                            if(e.isDisposed()) this.toFlipH.splice(i, 1);                                       
                                        }
                                    } catch (e2) {
                                        console.log("Error flipping images.", e2.toString());
                                    }
                                    var baseListBar = this.getBaseListBar();
                                    if(baseListBar!=null) {
                                        var baseCont = baseListBar.getChildren();
                                        for (i = 0; i < baseCont.length; i++) {
                                            var baseButton = baseCont[i];
                                            if(typeof baseButton.getBaseId === 'function') {
                                                if(baseButton.getBaseId() == ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_Id()
                                                   && baseButton.getBounds() != null && baseButton.getBounds().top!=null) {

                                                    if(this.locked) {
                                                        if(!this.pinned) {
                                                            if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                                                baseListBar.remove(this.mcvPopup);
                                                            }
                                                            this.pinLockPos = baseListBar.indexOf(baseButton)+1;
                                                            baseListBar.addAt(this.mcvPopup, this.pinLockPos);
                                                        } else if(baseListBar.indexOf(this.mcvPopup)<0) {
                                                            baseListBar.addAt(this.mcvPopup, Math.max(0, Math.min(this.pinLockPos, baseCont.length)));
                                                        }
                                                    } else {
                                                        if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                                            baseListBar.remove(this.mcvPopup);
                                                        }
                                                        if (!this.pinned) {
                                                            var top = baseButton.getBounds().top;
                                                            var infoTop;
                                                            try {
                                                                var stickerHeight = this.infoSticker.getContentElement().getDomElement().style.height;
                                                                stickerHeight = stickerHeight.substring(0, stickerHeight.indexOf("px"));
                                                                infoTop = Math.min(130 + top, Math.max(660, window.innerHeight) - parseInt(stickerHeight, 10) - 130);
                                                            } catch (heighterror) {
                                                                infoTop = 130 + top;
                                                            }
                                                            if(this.infoSticker.getContentElement().getDomElement()!=null)
                                                                this.infoSticker.setDomTop(infoTop);

                                                            this.pinTop = infoTop;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                }
                            } catch (ex) {
                                console.log("InfoSticker.repositionSticker: ", ex.toString());
                            }
                        },
                        toLock: function (e) {
                            try {
                                this.locked = !this.locked;
                                if(!this.locked) {
                                    this.infoSticker.show();
                                    this.stickerBackground.add(this.mcvPopup);
                                }
                                else this.infoSticker.hide();
                                this.lockButton.setIcon(this.locked ? "FactionUI/icons/icn_thread_locked_active.png" : "FactionUI/icons/icn_thread_locked_inactive.png");
                                this.updateLockButtonDecoration();
                                if (this.hasStorage) {
                                    if (this.locked) {
                                        localStorage["infoSticker-locked"] = "true";
                                        if(this.pinned) localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                    } else {
                                        localStorage["infoSticker-locked"] = "false";
                                    }
                                }
                                if(this.locked && this.pinned) {
                                    this.menuUpButton.setEnabled(true);
                                    this.menuDownButton.setEnabled(true);
                                } else {
                                    this.menuUpButton.setEnabled(false);
                                    this.menuDownButton.setEnabled(false);
                                }
                                this.repositionSticker();
                            } catch(e) {
                                console.log("InfoSticker.toLock: ", e.toString());
                            }
                        },
                        updateLockButtonDecoration: function () {
                            var light = "#CDD9DF";
                            var mid = "#9CA4A8";
                            var dark = "#8C9499";
                            this.lockPane.setDecorator(null);
                            this.lockButtonDecoration = new qx.ui.decoration.Decorator();
                            this.lockButtonDecoration.setBackgroundColor(this.locked ? dark : light);
                            this.lockPane.setDecorator(this.lockButtonDecoration);
                        },
                        toPin: function (e) {
                            try {
                                this.pinned = !this.pinned;
                                this.pinButton.setIcon(this.pinned ? "FactionUI/icons/icn_thread_pin_active.png" : "FactionUI/icons/icn_thread_pin_inactive.png");
                                this.updatePinButtonDecoration();
                                if (this.hasStorage) {
                                    if (this.pinned) {
                                        localStorage["infoSticker-pinned"] = "true";
                                        localStorage["infoSticker-top"] = this.pinTop.toString();
                                        if(this.locked) {
                                            localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                        }
                                    } else {
                                        localStorage["infoSticker-pinned"] = "false";
                                    }
                                }
                                if(this.locked && this.pinned) {
                                    this.menuUpButton.setEnabled(true);
                                    this.menuDownButton.setEnabled(true);
                                } else {
                                    this.menuUpButton.setEnabled(false);
                                    this.menuDownButton.setEnabled(false);
                                }
                            } catch(e) {
                                console.log("InfoSticker.toPin: ", e.toString());
                            }
                        },
                        updatePinButtonDecoration: function () {
                            var light = "#CDD9DF";
                            var mid = "#9CA4A8";
                            var dark = "#8C9499";
                            this.pinPane.setDecorator(null);
                            this.pinButtonDecoration = new qx.ui.decoration.Decorator().set({
                                //innerOpacity: 0.5
                            });
                            //this.pinButtonDecoration.setInnerColor(this.pinned ? mid : light);
                            //this.pinButtonDecoration.setOuterColor(this.pinned ? light : mid);
                            this.pinButtonDecoration.setBackgroundColor(this.pinned ? dark : light);
                            this.pinPane.setDecorator(this.pinButtonDecoration);
                        },
                        hideResource: function () {
                            try {
                                //if(this.resourceHidden)
                                if (this.resourcePane.isVisible()) {
                                    //this.resourcePane.hide();
                                    this.resourcePane.exclude();
                                    this.resourceHideButton.setLabel("+");
                                } else {
                                    this.resourcePane.show();
                                    this.resourceHideButton.setLabel("-");
                                }
                            } catch(e) {
                                console.log("InfoSticker.hideResource: ", e.toString());
                            }
                        },
                        lastPane: null,
                        createSection: function (parent, titleLabel, visible, visibilityStorageName) {
                            try {
                                var pane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                    padding: [5, 0, 5, 5],
                                    width: 124,
                                    decorator: new qx.ui.decoration.Decorator().set({
                                        backgroundImage: "decoration/pane_messaging_item/messaging_items_pane.png",
                                        backgroundRepeat: "scale",
                                    }),
                                    alignX: "right"
                                });

                                var labelStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 12
                                    }),
                                    textColor: '#595969'
                                };
                                titleLabel.set(labelStyle);

                                var hidePane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                    width: 124,
                                    alignX: "right"
                                });

                                var hideButton = new qx.ui.form.Button("-").set({
                                    //decorator: new qx.ui.decoration.Single(1, "solid", "black"),
                                    maxWidth: 15,
                                    maxHeight: 10,
                                    //textColor: "black"
                                });
                                var self = this;
                                //resourceHideButton.addListener("execute", this.hideResource, this);
                                hideButton.addListener("execute", function () {
                                    if (hidePane.isVisible()) {
                                        hidePane.exclude();
                                        hideButton.setLabel("+");
                                    } else {
                                        hidePane.show();
                                        hideButton.setLabel("-");
                                    }
                                    if(self.hasStorage)
                                        localStorage["infoSticker-"+visibilityStorageName] = !hidePane.isVisible();
                                });

                                var titleBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
                                titleBar.add(hideButton);
                                titleBar.add(titleLabel);
                                pane.add(titleBar);
                                pane.add(hidePane);

                                if(!visible) hidePane.exclude();

                                this.toFlipH.push(pane);

                                this.lastPane = pane;
                                parent.add(pane);

                                return hidePane;
                            } catch(e) {
                                console.log("InfoSticker.createSection: ", e.toString());
                                throw e;
                            }
                        },
                        createHBox: function (ele1, ele2, ele3) {
                            var cnt;
                            cnt = new qx.ui.container.Composite();
                            cnt.setLayout(new qx.ui.layout.HBox(0));
                            if (ele1 != null) {
                                cnt.add(ele1);
                                ele1.setAlignY("middle");
                            }
                            if (ele2 != null) {
                                cnt.add(ele2);
                                ele2.setAlignY("bottom");
                            }
                            if (ele3 != null) {
                                cnt.add(ele3);
                                ele3.setAlignY("bottom");
                            }

                            return cnt;
                        },

                        formatCompactTime: function (time) {
                            var comps = time.split(":");

                            var i = 0;
                            var value = Math.round(parseInt(comps[i], 10)).toString();
                            var len = comps.length;
                            while(value==0) {
                                value = Math.round(parseInt(comps[++i], 10)).toString();
                                len--;
                            }
                            var unit;
                            switch(len) {
                                case 1: unit = "s"; break;
                                case 2: unit = "m"; break;
                                case 3: unit = "h"; break;
                                case 4: unit = "d"; break;
                            }
                            return value+unit;
                        },
                        createImage: function(icon) {
                            var image = new qx.ui.basic.Image(icon);
                            image.setScale(true);
                            image.setWidth(20);
                            image.setHeight(20);
                            return image;
                        },

                        createMCVPane: function() {
                            try {
                                this.mcvInfoLabel = new qx.ui.basic.Label();
                                this.mcvTimerLabel = new qx.ui.basic.Label().set({
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 18
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 114,
                                    textAlign: 'center'
                                });
                                this.mcvTimerCreditProdLabel = new qx.ui.basic.Label().set({
                                    font: qx.bom.Font.fromString('normal').set({
                                        size: 12
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 114,
                                    textAlign: 'center',
                                    marginTop: 4,
                                    marginBottom: -4
                                });
                                var app = qx.core.Init.getApplication();
                                var b3 = app.getBaseNavigationBar().getChildren()[0].getChildren()[0];


                                var pane = this.createSection(b3, this.mcvInfoLabel, !this.mcvHide, "mcvHide");
                                pane.add(this.mcvTimerLabel);
                                pane.add(this.mcvTimerCreditProdLabel);
                                this.mcvPane = this.lastPane;
                                this.lastPane.setMarginLeft(7);

                            } catch(e) {
                                console.log("InfoSticker.createMCVPopup", e.toString());
                            }
                        },
                        moveStickerUp: function() {
                            try {
                                var baseListBar = this.getBaseListBar();
                                this.pinLockPos=Math.max(0, this.pinLockPos-1);
                                if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                    baseListBar.remove(this.mcvPopup);
                                }
                                if (this.hasStorage) {
                                    localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                }
                            } catch(e) {
                                console.log("InfoSticker.moveStickerUp", e.toString());
                            }
                        },
                        moveStickerDown: function() {
                            try {
                                var baseListBar = this.getBaseListBar();
                                this.pinLockPos=Math.min(baseListBar.getChildren().length, this.pinLockPos+1);
                                if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                    baseListBar.remove(this.mcvPopup);
                                }
                                if (this.hasStorage) {
                                    localStorage["infoSticker-pinLock"] = this.pinLockPos.toString();
                                }
                            } catch(e) {
                                console.log("InfoSticker.moveStickerDown", e.toString());
                            }
                        },
                        menuUpButton: null,
                        menuDownButton: null,
                        createMCVPopup: function() {
                            try {
                                var self = this;
                                this.mcvPopup = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                                    spacing: 3})).set({
                                    paddingLeft: 5,
                                    width: 105,
                                    decorator: new qx.ui.decoration.Decorator()
                                });

                                var menu = new qx.ui.menu.Menu();
                                var menuPinButton = new qx.ui.menu.Button("Pin", "FactionUI/icons/icn_thread_pin_inactive.png");
                                menuPinButton.addListener("execute", this.toPin, this);
                                menu.add(menuPinButton);
                                var menuLockButton = new qx.ui.menu.Button("Lock", "FactionUI/icons/icn_thread_locked_inactive.png");
                                menuLockButton.addListener("execute", this.toLock, this);
                                menu.add(menuLockButton);
                                var fileManager = ClientLib.File.FileManager.GetInstance();
                                this.menuUpButton = new qx.ui.menu.Button("Move up", fileManager.GetPhysicalPath("ui/icons/icon_tracker_arrow_up.png"));
                                //ui/icons/icon_tracker_arrow_up.png ui/gdi/icons/cht_opt_arrow_down.png
                                this.menuUpButton.addListener("execute", this.moveStickerUp, this);
                                menu.add(this.menuUpButton);
                                this.menuDownButton = new qx.ui.menu.Button("Move down", fileManager.GetPhysicalPath("ui/icons/icon_tracker_arrow_down.png"));
                                this.menuDownButton.addListener("execute", this.moveStickerDown, this);
                                menu.add(this.menuDownButton);
                                this.mcvPopup.setContextMenu(menu);
                                if(!this.locked) {
                                    this.stickerBackground.add(this.mcvPopup);
                                }

                                ////////////////////////////----------------------------------------------------------
                                this.pinButton = new webfrontend.ui.SoundButton().set({
                                    decorator: "button-forum-light",
                                    icon: this.pinned ? "FactionUI/icons/icn_thread_pin_active.png" : "FactionUI/icons/icn_thread_pin_inactive.png",
                                    iconPosition: "top",
                                    show: "icon",
                                    cursor: "pointer",
                                    height: 23,
                                    width: 50,
                                    //maxHeight: 25,
                                    maxWidth: 33,
                                    maxHeight: 19,
                                    alignX: "center"
                                });
                                this.pinButton.addListener("execute", this.toPin, this);

                                this.pinPane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                    //width: 50,
                                    maxWidth: 37,
                                });

                                this.updatePinButtonDecoration();

                                this.pinPane.setDecorator(this.pinButtonDecoration);
                                this.pinPane.add(this.pinButton);
                                //this.mcvPopup.add(this.pinPane);
                                //this.toFlipH.push(this.pinPane);

                                var icon = this.pinButton.getChildControl("icon");
                                icon.setWidth(15);
                                icon.setHeight(15);
                                icon.setScale(true);
                                ////////////////////////////----------------------------------------------------------
                                this.lockButton = new webfrontend.ui.SoundButton().set({
                                    decorator: "button-forum-light",
                                    icon: this.pinned ? "FactionUI/icons/icn_thread_locked_active.png" : "FactionUI/icons/icn_thread_locked_inactive.png",
                                    iconPosition: "top",
                                    show: "icon",
                                    cursor: "pointer",
                                    height: 23,
                                    width: 50,
                                    //maxHeight: 25,
                                    maxWidth: 33,
                                    maxHeight: 19,
                                    alignX: "center"
                                });
                                this.lockButton.addListener("execute", this.toLock, this);

                                this.lockPane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                    //width: 50,
                                    maxWidth: 37,
                                });

                                this.updateLockButtonDecoration();

                                this.lockPane.setDecorator(this.lockButtonDecoration);
                                this.lockPane.add(this.lockButton);
                                //this.mcvPopup.add(this.pinPane);
                                //this.toFlipH.push(this.pinPane);

                                icon = this.lockButton.getChildControl("icon");
                                icon.setWidth(15);
                                icon.setHeight(15);
                                icon.setScale(true);
                                ////////////////////////////----------------------------------------------------------
                                this.resourceTitleLabel = new qx.ui.basic.Label();
                                this.resourceTitleLabel.setValue("Base");
                                var resStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 14
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 65,
                                    marginLeft: -10,
                                    textAlign: 'right'
                                };

                                this.resourceLabel1 = new qx.ui.basic.Label().set(resStyle);
                                this.resourceLabel2 = new qx.ui.basic.Label().set(resStyle);
                                this.resourceLabel3 = new qx.ui.basic.Label().set(resStyle);

                                var perStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 9
                                    }),
                                    textColor: '#282828',
                                    height: 18,
                                    width: 33,
                                    textAlign: 'right'
                                };
                                this.resourceLabel1per = new qx.ui.basic.Label().set(perStyle);
                                this.resourceLabel2per = new qx.ui.basic.Label().set(perStyle);
                                this.resourceLabel3per = new qx.ui.basic.Label().set(perStyle);


                                var pane3 = this.createSection(this.mcvPopup, this.resourceTitleLabel, !this.resourceHide, "resourceHide");


                                this.repairTimerLabel = new qx.ui.basic.Label().set({
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 16
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 85,
                                    marginLeft: 0,
                                    textAlign: 'center'
                                });
                                pane3.add(this.createHBox(this.createImage(this.repairIcon), this.repairTimerLabel));

                                pane3.add(this.createHBox(this.createImage(this.tibIcon), this.resourceLabel1, this.resourceLabel1per));
                                pane3.add(this.createHBox(this.createImage(this.cryIcon), this.resourceLabel2, this.resourceLabel2per));
                                pane3.add(this.createHBox(this.createImage(this.powIcon), this.resourceLabel3, this.resourceLabel3per));

                                var mcvC = this.mcvPopup.getChildren();
                                mcvC[mcvC.length-1].getChildren()[0].add(this.pinPane);
                                mcvC[mcvC.length-1].getChildren()[0].add(this.lockPane);
                                ////////////////////////////----------------------------------------------------------

                                this.productionTitleLabel = new qx.ui.basic.Label();
                                this.productionTitleLabel.setValue("Productions");

                                var productionStyle = {
                                    font: qx.bom.Font.fromString('bold').set({
                                        size: 13
                                    }),
                                    textColor: '#282828',
                                    height: 20,
                                    width: 60,
                                    textAlign: 'right',
                                    marginTop: 2,
                                    marginBottom: -2
                                };
								this.productionLabelTiberium = new qx.ui.basic.Label().set(productionStyle);
                                this.productionLabelCrystal = new qx.ui.basic.Label().set(productionStyle);
                                this.productionLabelPower = new qx.ui.basic.Label().set(productionStyle);
                                this.productionLabelCredit = new qx.ui.basic.Label().set(productionStyle);

                                var pane4 = this.createSection(this.mcvPopup, this.productionTitleLabel, !this.productionHide, "productionHide");
								pane4.add(this.createHBox(this.createImage(this.tibIcon), this.productionLabelTiberium));
                                pane4.add(this.createHBox(this.createImage(this.cryIcon), this.productionLabelCrystal));
                                pane4.add(this.createHBox(this.createImage(this.powIcon), this.productionLabelPower));
                                pane4.add(this.createHBox(this.createImage(this.creditIcon), this.productionLabelCredit));

								////////////////////////////----------------------------------------------------------
								this.repairTimeTitleLabel = new qx.ui.basic.Label();
								this.repairTimeTitleLabel.setValue('RepairTimes');
								this.repairTimeStyle = {
								  font: qx.bom.Font.fromString('bold').set({
									size: 13
								  }),
								  textColor: '#282828',
								  height: 20,
								  width: 85,
								  textAlign: 'center',
								  marginTop: 2,
								  marginBottom: - 2
								};
								this.repairTimeLabel0 = new qx.ui.basic.Label().set(this.repairTimeStyle);
								this.repairTimeLabel1 = new qx.ui.basic.Label().set(this.repairTimeStyle);
								this.repairTimeLabel2 = new qx.ui.basic.Label().set(this.repairTimeStyle);
								this.repairTimeLabel3 = new qx.ui.basic.Label().set(this.repairTimeStyle);
								var pane6 = this.createSection(this.mcvPopup, this.repairTimeTitleLabel.set(this.repairTimeStyle), !this.rtHide, 'repairHide');
								pane6.add(this.createHBox(this.createImage("ui/icons/icon_res_repair_air.png"), this.repairTimeLabel0));
								pane6.add(this.createHBox(this.createImage("ui/icons/icon_res_repair_tnk.png"), this.repairTimeLabel1));
								pane6.add(this.createHBox(this.createImage("ui/icons/icon_res_repair_inf.png"), this.repairTimeLabel2));
								//pane6.add(this.createHBox(this.createImage(this.repairIcon), this.repairTimeLabel3));
								//pane6.add(this.createHBox(this.createImage(this.creditIcon), this.productionLabelCredit));
								////////////////////////////----------------------------------------------------------
								this.UnitCostTitleLabel = new qx.ui.basic.Label();
								this.UnitCostTitleLabel.setValue('OffUnitCost');
								this.UnitCostStyle = {
								  font: qx.bom.Font.fromString('bold').set({
									size: 13
								  }),
								  textColor: '#282828',
								  height: 20,
								  width: 85,
								  textAlign: 'center',
								  marginTop: 2,
								  marginBottom: - 2
								};
								this.UnitCostLabel0 = new qx.ui.basic.Label().set(this.UnitCostStyle);
								this.UnitCostLabel1 = new qx.ui.basic.Label().set(this.UnitCostStyle);
								//this.UnitCostLabel2 = new qx.ui.basic.Label().set(this.UnitCostStyle);
								var pane7 = this.createSection(this.mcvPopup, this.UnitCostTitleLabel.set(this.UnitCostStyle), !this.costHide, 'costHide');
								pane7.add(this.createHBox(this.createImage(this.cryIcon), this.UnitCostLabel0));
								pane7.add(this.createHBox(this.createImage(this.powIcon), this.UnitCostLabel1));
								//pane7.add(this.createHBox(this.createImage(this.repairIcon), this.UnitCostLabel2));
								//pane6.add(this.createHBox(this.createImage(this.creditIcon), this.productionLabelCredit));
								////////////////////////////----------------------------------------------------------
								this.DEFUnitCostTitleLabel = new qx.ui.basic.Label();
								this.DEFUnitCostTitleLabel.setValue('DefUnitCost');
								this.DEFUnitCostStyle = {
								  font: qx.bom.Font.fromString('bold').set({
									size: 13
								  }),
								  textColor: '#282828',
								  height: 20,
								  width: 85,
								  textAlign: 'center',
								  marginTop: 2,
								  marginBottom: - 2
								};
								this.DEFUnitCostLabel0 = new qx.ui.basic.Label().set(this.DEFUnitCostStyle);
								this.DEFUnitCostLabel1 = new qx.ui.basic.Label().set(this.DEFUnitCostStyle);
								this.DEFUnitCostLabel2 = new qx.ui.basic.Label().set(this.DEFUnitCostStyle);
								var pane8 = this.createSection(this.mcvPopup, this.DEFUnitCostTitleLabel.set(this.DEFUnitCostStyle), !this.DEFcostHide, 'DEFcostHide');
								pane8.add(this.createHBox(this.createImage(this.tibIcon), this.DEFUnitCostLabel0));
								pane8.add(this.createHBox(this.createImage(this.cryIcon), this.DEFUnitCostLabel1));
								pane8.add(this.createHBox(this.createImage(this.powIcon), this.DEFUnitCostLabel2));
								//pane7.add(this.createHBox(this.createImage(this.repairIcon), this.UnitCostLabel2));
								//pane6.add(this.createHBox(this.createImage(this.creditIcon), this.productionLabelCredit));
								////////////////////////////----------------------------------------------------------

                            } catch(e) {
                                console.log("InfoSticker: createMCVPopup", e.toString());
                            }
                        },
                        currentCityChange: function() {
                            this.calculateInfoData();
                            this.repositionSticker();
                        },
                        disposeRecover: function() {

                            try {
                                if(this.mcvPane.isDisposed()) {
                                    this.createMCVPane();
                                }

                                if(this.mcvPopup.isDisposed()) {
                                    this.createMCVPopup();

                                    this.repositionSticker();
                                }
                                this.waitingRecovery = false;
                            } catch(e) {
                                console.log("InfoSticker: disposeRecover", e.toString());
                            }

                        },
                        waitingRecovery: false,
                        citiesChange: function() {
                            try {
                                var self = this;
                                var baseListBar = this.getBaseListBar();
                                this.disposeRecover();

                                if(baseListBar.indexOf(this.mcvPopup)>=0) {
                                    baseListBar.remove(this.mcvPopup);
                                    this.mcvPopup.dispose();
                                }

                                if(baseListBar.indexOf(this.mcvPane)>=0) {
                                    baseListBar.remove(this.mcvPane);
                                    this.mcvPane.dispose();
                                }
                                if(!this.waitingRecovery) {
                                    this.waitingRecovery = true;
                                    window.setTimeout(function () {
                                        self.disposeRecover();
                                    }, 10);
                                }
                            } catch(e) {
                                console.log("InfoSticker: citiesChange", e.toString());
                            }
                        },
                        calculateInfoData: function () {
                            try {
                                var self = this;
                                var player = ClientLib.Data.MainData.GetInstance().get_Player();
                                var cw = player.get_Faction();
                                var cj = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, cw);
                                var cr = player.get_PlayerResearch();
                                var cd = cr.GetResearchItemFomMdbId(cj);

                                var app = qx.core.Init.getApplication();
                                var b3 = app.getBaseNavigationBar().getChildren()[0].getChildren()[0];
                                if(b3.getChildren().length==0) return;
                                if (!this.infoSticker) {
                                    this.infoSticker = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                                        alignX: "right"
                                    })).set({
                                        width: 105,
                                    });

                                    var top = 130;
                                    if (this.hasStorage) {
                                        var l = localStorage["infoSticker-locked"] == "true";
                                        if (l != null) {
                                            this.locked = l;
                                            var pl = localStorage["infoSticker-pinLock"];
                                            if(pl!=null) {
                                                try {
                                                    this.pinLockPos = parseInt(pl, 10);
                                                } catch(etm) {}
                                            }
                                        }

                                        var p = localStorage["infoSticker-pinned"];
                                        var t = localStorage["infoSticker-top"];
                                        if (p != null && t != null) {
                                            var tn;
                                            try {
                                                this.pinned = p == "true";
                                                if (this.pinned) {
                                                    tn = parseInt(t, 10);
                                                    top = tn;
                                                }
                                            } catch (etn) {}
                                        }
                                        this.mcvHide = localStorage['infoSticker-mcvHide'] == 'true';
										this.repairHide = localStorage['infoSticker-repairHide'] == 'true';
										this.rtHide = localStorage['infoSticker-repairHide'] == 'true';
										this.costHide = localStorage['infoSticker-costHide'] == 'true';
										this.DEFcostHide = localStorage['infoSticker-DEFcostHide'] == 'true';
										this.resourceHide = localStorage['infoSticker-resourceHide'] == 'true';
										this.productionHide = localStorage['infoSticker-productionHide'] == 'true';
										this.contProductionHide = localStorage['infoSticker-contProductionHide'] == 'true';
                                    }


                                    app.getDesktop().add(this.infoSticker, {
                                        right: 124,
                                        top: top
                                    });
                                    if(this.locked) {
                                        this.infoSticker.hide();
                                    }

                                    this.stickerBackground = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                        //paddingLeft: 5,
                                        width: 105,
                                        decorator: new qx.ui.decoration.Decorator().set({
                                            backgroundImage: "webfrontend/ui/common/bgr_region_world_select_scaler.png",
                                            backgroundRepeat: "scale",
                                        })
                                    });

                                    this.createMCVPane();
                                    this.createMCVPopup();

                                    if(this.locked && this.pinned) {
                                        this.menuUpButton.setEnabled(true);
                                        this.menuDownButton.setEnabled(true);
                                    } else {
                                        this.menuUpButton.setEnabled(false);
                                        this.menuDownButton.setEnabled(false);
                                    }

                                    this.top_image = new qx.ui.basic.Image("webfrontend/ui/common/bgr_region_world_select_end.png");
                                    this.infoSticker.add(this.top_image);

                                    this.infoSticker.add(this.stickerBackground);
                                    //this.infoSticker.add(this.mcvPopup);

                                    this.bot_image = new qx.ui.basic.Image("webfrontend/ui/common/bgr_region_world_select_end.png");
                                    this.infoSticker.add(this.bot_image);

                                    this.runPositionTimer();

                                    try {
                                        this.attachEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.currentCityChange);
                                        this.attachEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "Change", ClientLib.Data.CitiesChange, this, this.citiesChange);
                                    } catch(eventError) {
                                        console.log("InfoSticker.EventAttach:", eventError);
                                        console.log("The script will continue to run, but with slower response speed.");
                                    }
                                }
                                this.disposeRecover();

                                if (cd == null)
                                {
                                    if (this.mcvPopup) {
                                        //this.mcvInfoLabel.setValue("MCV ($???)");
                                        this.mcvInfoLabel.setValue("MCV<br>$???");
                                        this.mcvTimerLabel.setValue("Loading");
                                    }
                                }
                                else if (ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().c == 31)
                                {
                                    if (this.mcvPopup)
                                    {
                                        this.mcvInfoLabel.setValue("MCV<br>$???");
                                        this.mcvTimerLabel.setValue("max Bases reached");
                                    }
                                }
                                else
                                {
                                    var nextLevelInfo = cd.get_NextLevelInfo_Obj();
                                    var resourcesNeeded = [];
                                    for (var i in nextLevelInfo.rr) {
                                        if (nextLevelInfo.rr[i].t > 0) {
                                            resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
                                        }
                                    }
                                    //var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
                                    //var currentResearchPoints = player.get_ResearchPoints();
                                    var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
                                    var creditsResourceData = player.get_Credits();
                                    var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                                    var creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;

                                    this.mcvInfoLabel.setValue("MCV ($ " + this.formatNumbersCompact(creditsNeeded) + ")");
                                    //this.mcvInfoLabel.setValue("MCV<br>$" + this.formatNumbersCompact(creditsNeeded));
                                    this.mcvTimerCreditProdLabel.setValue("at " + this.formatNumbersCompact(creditGrowthPerHour) + "/h");
                                    if (creditTimeLeftInHours <= 0) {
                                        this.mcvTimerLabel.setValue("Ready");
                                    } else if (creditGrowthPerHour == 0) {
                                        this.mcvTimerLabel.setValue("Never");
                                    } else {
                                        if(creditTimeLeftInHours >= 24 * 100) {
                                            this.mcvTimerLabel.setValue("> 99 days");
                                        } else {
                                            this.mcvTimerLabel.setValue(this.FormatTimespan(creditTimeLeftInHours * 60 * 60));
                                        }
                                    }
                                }

                                var ncity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (ncity == null) {
                                    if (this.mcvPopup) {
                                        this.repairTimerLabel.setValue('Select a base');
										this.repairTimeLabel0.setValue('Select a base');
										this.repairTimeLabel1.setValue('Select a base');
										this.repairTimeLabel2.setValue('Select a base');
										this.repairTimeLabel3.setValue('Select a base');
										this.resourceLabel1.setValue('N/A');
										this.resourceLabel2.setValue('N/A');
										this.resourceLabel3.setValue('N/A');
										this.UnitCostLabel0.setValue('N/A');
										this.UnitCostLabel1.setValue('N/A');
                                    }
                                } else {
									  var DEFtibCost = 0;
									  var DEFcryCost = 0;
									  var DEFpowCost = 0;
									  var cryCost = 0;
									  var powCost = 0;
									  var cost = ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(ncity.GetBuildingTypeMaxLvlByTechName(ClientLib.Base.ETechName.Defense_HQ));
									  if (cost != null) {
										//console.log(ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(ncity.GetBuildingTypeMaxLvlByTechName(ClientLib.Base.ETechName.Defense_HQ))[0].Type, ClientLib.Base.EResourceType.Tiberium, ClientLib.Base.EResourceType.Crystal, ClientLib.Base.EResourceType.Power );
										if (cost[0].Type == ClientLib.Base.EResourceType.Crystal) {
										  DEFcryCost = cost[0].Count;
										  //DEFpowCost = cost[1].Count;
										} else if (cost[0].Type == ClientLib.Base.EResourceType.Tiberium) {
										  DEFtibCost = cost[0].Count;
										  if (cost[1].Type == ClientLib.Base.EResourceType.Crystal) {
											DEFcryCost = cost[1].Count;
										  }
										}
										if (cost[1].Type == ClientLib.Base.EResourceType.Power) {
										  DEFpowCost = cost[1].Count;
										}
										else if (cost[2] !== undefined && cost[2].Type == ClientLib.Base.EResourceType.Power) {
										  DEFpowCost = cost[2].Count;
										}
										//console.log(HQ, ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(ncity.GetBuildingTypeMaxLvlByTechName(ClientLib.Base.ETechName.Defense_HQ)), DEFpowCost);

										this.DEFUnitCostLabel0.setValue(this.formatNumbersCompact(DEFtibCost));
										this.DEFUnitCostLabel1.setValue(this.formatNumbersCompact(DEFcryCost));
										this.DEFUnitCostLabel2.setValue(this.formatNumbersCompact(DEFpowCost));
									  } else {
										this.DEFUnitCostLabel0.setValue('Upgrade');
										this.DEFUnitCostLabel1.setValue('DEF');
										this.DEFUnitCostLabel2.setValue('HQ');
									  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

										if (ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(ncity.get_CommandCenterLevel()) != null) {
                    cryCost = ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(ncity.get_CommandCenterLevel())[0].Count;
                    powCost = ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(ncity.get_CommandCenterLevel())[1].Count;
                    this.UnitCostLabel0.setValue(this.formatNumbersCompact(cryCost));
                    this.UnitCostLabel1.setValue(this.formatNumbersCompact(powCost));
                  } else {
                    this.UnitCostLabel0.setValue('Upgrade');
                    this.UnitCostLabel1.setValue('CC');
                  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    var rt = Math.min(ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf),
                                                      ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh),
                                                      ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir));
                                    if (ncity.get_CityUnitsData().get_UnitLimitOffense() == 0) {
                                        this.repairTimerLabel.setValue("No army");
                                    } else {
                                        this.repairTimerLabel.setValue(this.FormatTimespan(rt));
                                    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var airRT = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
                  if (ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false) == 0) {
                    this.repairTimeLabel0.setValue('No birds');
                  } else {
                    this.repairTimeLabel0.setValue(this.FormatTimespan(airRT) + ' AIR');
                  }
                  var vehRT = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
                  if (ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false) == 0) {
                    this.repairTimeLabel1.setValue('No cars');
                  } else {
                    this.repairTimeLabel1.setValue(this.FormatTimespan(vehRT) + ' VEH');
                  }
                  var infRT = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
                  if (ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false) == 0) {
                    this.repairTimeLabel2.setValue('No dudes');
                  } else {
                    this.repairTimeLabel2.setValue(this.FormatTimespan(infRT) + ' INF');
                  }
                  var defRT = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense, false);
                  if (ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense, false) == 0) {
                    this.repairTimeLabel3.setValue('No nothin');
                  } else {
                    this.repairTimeLabel3.setValue(this.FormatTimespan((defRT)) + ' DEF');
                  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    var tib = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
                                    var tibMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium);
                                    var tibRatio = tib / tibMax;
                                    this.resourceLabel1.setTextColor(this.formatNumberColor(tib, tibMax));
                                    this.resourceLabel1.setValue(this.formatNumbersCompact(tib));
                                    this.resourceLabel1per.setValue(this.formatPercent(tibRatio));

                                    var cry = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                                    var cryMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal);
                                    var cryRatio = cry / cryMax;
                                    this.resourceLabel2.setTextColor(this.formatNumberColor(cry, cryMax));
                                    this.resourceLabel2.setValue(this.formatNumbersCompact(cry));
                                    this.resourceLabel2per.setValue(this.formatPercent(cryRatio));

                                    var power = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
                                    var powerMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power);
                                    var powerRatio = power / powerMax;
                                    this.resourceLabel3.setTextColor(this.formatNumberColor(power, powerMax));
                                    this.resourceLabel3.setValue(this.formatNumbersCompact(power));
                                    this.resourceLabel3per.setValue(this.formatPercent(powerRatio));

									var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();

									var tibCont = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false);
                                    var tibBonus = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium);
                                    var tibAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
                                    var tibProd = tibCont + tibBonus + tibAlly;

									var cryCont = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false);
                                    var cryBonus = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal);
                                    var cryAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
                                    var cryProd = cryCont + cryBonus + cryAlly;

                                    var powerCont = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false);
                                    var powerBonus = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);
                                    var powerAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
                                    var powerProd = powerCont + powerBonus + powerAlly;

                                    var creditCont = ClientLib.Base.Resource.GetResourceGrowPerHour(ncity.get_CityCreditsProduction(), false);
                                    var creditBonus = ClientLib.Base.Resource.GetResourceBonusGrowPerHour(ncity.get_CityCreditsProduction(), false);
                                    var creditProd = creditCont + creditBonus;

                                    this.productionLabelTiberium.setValue(this.formatNumbersCompact(tibProd) + "/h");
									this.productionLabelCrystal.setValue(this.formatNumbersCompact(cryProd) + "/h");
                                    this.productionLabelPower.setValue(this.formatNumbersCompact(powerProd) + "/h");
                                    this.productionLabelCredit.setValue(this.formatNumbersCompact(creditProd) + "/h");
                                }
                            } catch (e) {
                                console.log("InfoSticker.calculateInfoData", e.toString());
                            }
                        },
                        formatPercent: function (value) {
                            return value > 999 / 100 ? ">999%" : this.formatNumbersCompact(value * 100, 0) + "%";
                            //return this.formatNumbersCompact(value*100, 0) + "%";
                        },
                        formatNumberColor: function (value, max) {
                            var ratio = value / max;

                            var color;
                            var black = [40, 180, 40];
                            var yellow = [181, 181, 0];
                            var red = [187, 43, 43];

                            if (ratio < 0.5) color = black;
                            else if (ratio < 0.75) color = this.interpolateColor(black, yellow, (ratio - 0.5) / 0.25);
                            else if (ratio < 1) color = this.interpolateColor(yellow, red, (ratio - 0.75) / 0.25);
                            else color = red;

                            //console.log(qx.util.ColorUtil.rgbToHexString(color));
                            return qx.util.ColorUtil.rgbToHexString(color);
                        },
                        interpolateColor: function (color1, color2, s) {
                            //console.log("interp "+s+ " " + color1[1]+" " +color2[1]+" " +(color1[1]+s*(color2[1]-color1[1])));
                            return [Math.floor(color1[0] + s * (color2[0] - color1[0])),
                                    Math.floor(color1[1] + s * (color2[1] - color1[1])),
                                    Math.floor(color1[2] + s * (color2[2] - color1[2]))];
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
                unit = 'T';
              } else if(value < 1000 * 1000 * 1000 * 1000 * 1000 * 1000){
			  valueStr = (value / (1000*1000*1000*1000*1000)).toString();
              unit = 'P';
			  } else if(value < 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000){
			  valueStr = (value / (1000*1000*1000*1000*1000*1000)).toString();
              unit = 'E';
			  } else if(value < 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000){
			  valueStr = (value / (1000*1000*1000*1000*1000*1000*1000)).toString();
              unit = 'Z';
			  } else {
			  valueStr = (value / (1000*1000*1000*1000*1000*1000*1000*1000)).toString();
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
                            var r = "";
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') {
                                    if (colonCount > 2) {
                                        r += "d ";
                                    } else {
                                        r += t.charAt(i);
                                    }
                                    colonCount--;
                                } else {
                                    r += t.charAt(i);
                                }
                            }
                            return r;
                        }
                    }
                });
            }
        } catch (e) {
            console.log("InfoSticker: createInfoSticker: ", e.toString());
        }

        function InfoSticker_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                    createInfoSticker();
                    window.InfoSticker.Base.getInstance().initialize();
                } else {
                    window.setTimeout(InfoSticker_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("InfoSticker_checkIfLoaded: ", e.toString());
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(InfoSticker_checkIfLoaded, 1000);
        }
    }
    try {
        var InfoStickerScript = document.createElement("script");
        InfoStickerScript.innerHTML = "var InfoSticker_IsInstalled = true; ("  + InfoSticker_main.toString() + ")();";
        InfoStickerScript.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(InfoStickerScript);
        }
    } catch (e) {
        console.log("InfoSticker: init error: ", e.toString());
    }
})();


/***********************************************************************************
C&C:Tiberium Alliances Coords Button + Forgotten Bases Count
***********************************************************************************/
// ==UserScript==
// @description Display the number of forgotten bases in range of selected world object and paste it to chat message
// @description --this script is based on Paste Coords Button and Shockr's BaseScanner sripts--
// @version     1.1.0
// ==/UserScript==

(function () {
    var CNCTACountBases_main = function () {
        try {
            function createCountButton() {
                console.log('C&C:Tiberium Alliances Count Forgotten Bases in Range: loaded.');
                var countButton = {
                    selectedBase: null,
                    countBases: function (x, y) {
                        var levelCount = [];
                        var count = 0;
                        var maxAttack = 10;
                        var world = ClientLib.Data.MainData.GetInstance() .get_World();
                        for (var scanY = y - 10; scanY <= y + 10; scanY++)
                        {
                            for (var scanX = x - 10; scanX <= x + 10; scanX++)
                            {
                                var distX = Math.abs(x - scanX);
                                var distY = Math.abs(y - scanY);
                                var distance = Math.sqrt((distX * distX) + (distY * distY));
                                // too far away to scan
                                if (distance > maxAttack)
                                {
                                    continue;
                                }
                                var object = world.GetObjectFromPosition(scanX, scanY);
                                // Nothing to scan
                                if (object === null)
                                {
                                    continue;
                                }
                                // Object isnt a NPC Base / Camp / Outpost
                                if (object.Type !== ClientLib.Data.WorldSector.ObjectType.NPCBase)
                                {
                                    continue;
                                }
                                if (typeof object.getCampType === 'function' && object.getCampType() === ClientLib.Data.Reports.ENPCCampType.Destroyed)
                                {
                                    continue;
                                }
                                if (typeof object.getLevel !== 'function')
                                {
                                    countButton._patchClientLib();
                                }
                                var level = object.getLevel();
                                levelCount[level] = (levelCount[level] || 0) + 1;
                                count++;
                            }
                        }
                        var output = [];
                        for (var i = 0; i < levelCount.length; i++)
                        {
                            var lvl = levelCount[i];
                            if (lvl !== undefined)
                            {
                                output.push(lvl + 'x' + i);
                            }
                        }
                        console.log(x + ':' + y + ' [' + count + ' Bases: ' + output.join(' ') + ']');
                        countButton.pasteCount(x, y, count, output.join(' '));
                    },
                    countSoloBases: function (x, y) {
                        var count = 0;
                        var maxAttack = 10;
                        var world = ClientLib.Data.MainData.GetInstance() .get_World();
                        for (var scanY = y - 10; scanY <= y + 10; scanY++)
                        {
                            for (var scanX = x - 10; scanX <= x + 10; scanX++)
                            {
                                var distX = Math.abs(x - scanX);
                                var distY = Math.abs(y - scanY);
                                var distance = Math.sqrt((distX * distX) + (distY * distY));
                                // too far away to scan
                                if (distance > maxAttack)
                                {
                                    continue;
                                }
                                var object = world.GetObjectFromPosition(scanX, scanY);
                                // Nothing to scan
                                if (object === null)
                                {
                                    continue;
                                }
                                // Object isnt a NPC Base / Camp / Outpost
                                if (object.Type !== ClientLib.Data.WorldSector.ObjectType.NPCBase)
                                {
                                    continue;
                                }
                                if (typeof object.getCampType === 'function' && object.getCampType() === ClientLib.Data.Reports.ENPCCampType.Destroyed)
                                {
                                    continue;
                                }
                                count++;
                            }
                        }
                        return count;
                    },
                    count: function () {
                        if (countButton.selectedBase === null || countButton.selectedBase === undefined) {
                            return;
                        }
                        return countButton.countBases(countButton.selectedBase.get_RawX(), countButton.selectedBase.get_RawY());
                    },
                    pasteCount: function (x, y, baseCount, baseData) {
                        var input = qx.core.Init.getApplication() .getChat() .getChatWidget() .getEditable();
                        // Input
                        var dom = input.getContentElement() .getDomElement();
                        // Input DOM Element
                        var result = new Array();
                        result.push(dom.value.substring(0, dom.selectionStart));
                        // start
                        result.push('[coords]' + x + ':' + y + '[/coords] [' + baseCount + ' Bases: ' + baseData + ']');
                        result.push(dom.value.substring(dom.selectionEnd, dom.value.length));
                        // end
                        input.setValue(result.join(' '));
                    },
                    /** not needed CoordButton
                    pasteCoords: function () {
                        var input = qx.core.Init.getApplication() .getChat() .getChatWidget() .getEditable();
                        // Input
                        var dom = input.getContentElement() .getDomElement();
                        // Input DOM Element
                        var result = new Array();
                        result.push(dom.value.substring(0, dom.selectionStart));
                        // start
                        result.push('[coords]' + countButton.selectedBase.get_RawX() + ':' + countButton.selectedBase.get_RawY() + '[/coords]');
                        result.push(dom.value.substring(dom.selectionEnd, dom.value.length));
                        // end
                        input.setValue(result.join(' '));
                    },
                    **/
                    _g: function (k, r, q, m) {
                        var p = [
                        ];
                        var o = k.toString();
                        var n = o.replace(/\s/gim, '');
                        p = n.match(r);
                        var l;
                        for (l = 1; l < (m + 1); l++) {
                            if (p !== null && p[l].length === 6) {
                                console.debug(q, l, p[l]);
                            } else {
                                if (p !== null && p[l].length > 0) {
                                    console.warn(q, l, p[l]);
                                } else {
                                    console.error('Error - ', q, l, 'not found');
                                    console.warn(q, n);
                                }
                            }
                        }
                        return p;
                    },
                    _patchClientLib: function () {
                        var proto = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype;
                        var re = /100\){0,1};this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/;
                        var x = countButton._g(proto.$ctor, re, 'ClientLib.Data.WorldSector.WorldObjectNPCBase', 2);
                        if (x !== null && x[1].length === 6) {
                            proto.getLevel = function () {
                                return this[x[1]];
                            };
                        } else {
                            console.error('Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.Level undefined');
                        }
                    }
                };
                if ( webfrontend.gui.region.RegionCityMenu.prototype.__baseCounterButton_showMenu ){
                    webfrontend.gui.region.RegionCityMenu.prototype.showMenu = webfrontend.gui.region.RegionCityMenu.prototype.__baseCounterButton_showMenu;
                    webfrontend.gui.region.RegionCityMenu.prototype.__baseCounterButton_initialized = false;
                    webfrontend.gui.region.RegionCityMenu.prototype.__baseCounterButton_showMenu = undefined;
                };


                if (!webfrontend.gui.region.RegionCityMenu.prototype.__countButton_showMenu) {
                    webfrontend.gui.region.RegionCityMenu.prototype.__countButton_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
                    webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selectedVisObject) {
                        var self = this;
                        countButton.selectedBase = selectedVisObject;
                        if (this.__countButton_initialized != 1) {
                            this.__countButton_initialized = 1;
                            this.__coordButton = [];
                            this.__countButton = [];
                            this.__countComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({
                                padding: 2
                            });
                            for (var i in this) {
                                try {
                                    if (this[i] && this[i].basename == "Composite") {
                                        var coordbutton = new qx.ui.form.Button("Paste Coords");
                                        coordbutton.addListener("execute", function () {
                                            countButton.pasteCoords();
                                        });
                                        var countbutton = new qx.ui.form.Button("Paste Count");
                                        countbutton.addListener("execute", function () {
                                            countButton.count();
                                        });
                                        /*this[i].add(coordbutton);*/
                                        this[i].add(countbutton);
                                        /*this.__coordButton.push(coordbutton);*/
                                        this.__countButton.push(countbutton);
                                    }
                                } catch (e) {
                                    console.log("buttons ", e);
                                }
                            }
                        }
                        for (var i = 0; i < self.__countButton.length; ++i) {
                            self.__countButton[i].setLabel('Paste Count (' + countButton.countSoloBases(countButton.selectedBase.get_RawX(), countButton.selectedBase.get_RawY()) + ')');
                        }
                        switch (selectedVisObject.get_VisObjectType()) {
                            case ClientLib.Vis.VisObject.EObjectType.RegionPointOfInterest:
                            case ClientLib.Vis.VisObject.EObjectType.RegionRuin:
                            case ClientLib.Vis.VisObject.EObjectType.RegionHubControl:
                            case ClientLib.Vis.VisObject.EObjectType.RegionHubServer:
                                this.add(this.__countComposite);
                                break;
                        }
                        this.__countButton_showMenu(selectedVisObject);
                    };
                }
            }
        } catch (e) {
            console.log('createCountButton: ', e);
        }
        function CNCTACountBases_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined') {
                    createCountButton();
                } else {
                    window.setTimeout(CNCTACountBases_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log('CNCTACountBases_checkIfLoaded: ', e);
            }
        }
        window.setTimeout(CNCTACountBases_checkIfLoaded, 1000);
    };
    try {
        var CNCTACountBases = document.createElement('script');
        CNCTACountBases.innerHTML = '(' + CNCTACountBases_main.toString() + ')();';
        CNCTACountBases.type = 'text/javascript';
        document.getElementsByTagName('head') [0].appendChild(CNCTACountBases);
    } catch (e) {
        console.log('C&C:Tiberium Alliances Count Forgotten Bases in Range: init error: ', e);
    }
}) ();

/***********************************************************************************
C&C:Tiberium Alliances Wavy WaveCount
***********************************************************************************/
// ==UserScript==
// @name           Tiberium Alliances Wavy
// @version        0.5.5
// @namespace      https://openuserjs.org/users/petui
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author         petui
// @description    Displays details about forgotten attack wave zones.
// ==/UserScript==
'use strict';

(function() {
	var main = function() {
		'use strict';

		function createWavy() {
			console.log('Wavy loaded');

			qx.Class.define('Wavy', {
				type: 'singleton',
				extend: qx.core.Object,
				statics: {
					ForgottenAttackDistance: 10
				},
				members: {
					regionCityInfoContainer: null,
					regionCityInfoCountLabel: null,
					regionCityInfoLevelLabel: null,
					regionCityMoveInfoCountLabel: null,
					regionCityMoveInfoLevelLabel: null,
					regionCityMoveInfoCache: null,

					initialize: function() {
						this.initializeHacks();

						var regionCityInfoCountContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
						regionCityInfoCountContainer.add(new qx.ui.basic.Label('Forgotten bases within attack range:'));
						regionCityInfoCountContainer.add(this.regionCityInfoCountLabel = new Wavy.CountLabel().set({
							textColor: 'text-region-tooltip'
						}));

						var regionCityInfoLevelContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
						regionCityInfoLevelContainer.add(new qx.ui.basic.Label('Levels:'));
						regionCityInfoLevelContainer.add(this.regionCityInfoLevelLabel = new qx.ui.basic.Label().set({
							textColor: 'text-region-value'
						}));

						this.regionCityInfoContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							marginTop: 6,
							textColor: 'text-region-tooltip'
						});
						this.regionCityInfoContainer.add(new qx.ui.basic.Label('Wavy').set({
							font: 'font_size_14',
							textColor: 'text-region-value'
						}));
						this.regionCityInfoContainer.add(regionCityInfoCountContainer);
						this.regionCityInfoContainer.add(regionCityInfoLevelContainer);

						var regionCityMoveInfoCountContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
						regionCityMoveInfoCountContainer.add(new qx.ui.basic.Label('Forgotten bases within range:').set({
							alignY: 'middle'
						}));
						regionCityMoveInfoCountContainer.add(this.regionCityMoveInfoCountLabel = new Wavy.CountLabel().set({
							alignY: 'middle',
							font: 'bold',
							textColor: 'text-region-tooltip'
						}));
						var regionCityMoveInfoLevelContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
						regionCityMoveInfoLevelContainer.add(new qx.ui.basic.Label('Levels:').set({
							alignY: 'middle'
						}));
						regionCityMoveInfoLevelContainer.add(this.regionCityMoveInfoLevelLabel = new qx.ui.basic.Label().set({
							alignY: 'middle',
							font: 'bold',
							textColor: 'text-region-value'
						}));

						var regionCityMoveInfoContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							textColor: 'text-region-tooltip'
						});
						regionCityMoveInfoContainer.add(regionCityMoveInfoCountContainer);
						regionCityMoveInfoContainer.add(regionCityMoveInfoLevelContainer);
						webfrontend.gui.region.RegionCityMoveInfo.getInstance().addAt(regionCityMoveInfoContainer, 3);

						var regionObjectStatusInfos = [
							webfrontend.gui.region.RegionCityStatusInfoOwn,
							webfrontend.gui.region.RegionCityStatusInfoAlliance,
							webfrontend.gui.region.RegionCityStatusInfoEnemy,
							webfrontend.gui.region.RegionNPCBaseStatusInfo,
							webfrontend.gui.region.RegionNPCCampStatusInfo,
							webfrontend.gui.region.RegionRuinStatusInfo
						];

						for (var i = 0; i < regionObjectStatusInfos.length; i++) {
							regionObjectStatusInfos[i].getInstance().addListener('appear', this.onRegionObjectStatusInfoAppear, this);
						}

						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Notifications(), 'NotificationAdded', ClientLib.Data.NotificationAdded, this, this.onNotificationAdded);

						var moveBaseMouseTool = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase);
						phe.cnc.Util.attachNetEvent(moveBaseMouseTool, 'OnCellChange', ClientLib.Vis.MouseTool.OnCellChange, this, this.onMoveBaseMouseToolCellChange);
						phe.cnc.Util.attachNetEvent(moveBaseMouseTool, 'OnDeactivate', ClientLib.Vis.MouseTool.OnDeactivate, this, this.onMoveBaseMouseToolDeactivate);
						phe.cnc.Util.attachNetEvent(moveBaseMouseTool, 'OnActivate', ClientLib.Vis.MouseTool.OnActivate, this, this.onMoveBaseMouseToolActivate);
					},

					initializeHacks: function() {
						var source;

						if (typeof webfrontend.gui.region.RegionCityInfo.prototype.getObject !== 'function') {
							source = webfrontend.gui.region.RegionCityInfo.prototype.setObject.toString();
              source=source.replace("function(","function (");
							var objectMemberName = PerforceChangelist >= 448942 && PerforceChangelist < 451851
								? source.match(/^function \(([A-Za-z]+)\)\{.+([A-Za-z]+)=\1\.object;[\s\S]+this\.([A-Za-z_]+)=\2;/)[3]
								: source.match(/^function \(([A-Za-z]+)(?:,[A-Za-z]+)?\)\{.+this\.([A-Za-z_]+)=\1;/)[2];

							/**
							 * @returns {ClientLib.Vis.Region.RegionObject}
							 */
							webfrontend.gui.region.RegionCityInfo.prototype.getObject = function() {
								return this[objectMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevelFloat !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevelFloat.toString();
							var npcBaseBaseLevelFloatMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevelFloat = function() {
								return this[npcBaseBaseLevelFloatMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevel !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevel.toString();
							var npcBaseBaseLevelMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevel = function() {
								return this[npcBaseBaseLevelMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_BaseLevelFloat !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCCamp.prototype.get_BaseLevelFloat.toString();
							var npcCampBaseLevelFloatMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_BaseLevelFloat = function() {
								return this[npcCampBaseLevelFloatMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_CampType !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCCamp.prototype.get_CampType.toString();
							var npcCampTypeMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {ClientLib.Data.WorldSector.WorldObjectNPCCamp.ECampType}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_CampType = function() {
								return this[npcCampTypeMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Level !== 'function') {
							source = ClientLib.Vis.Region.RegionPointOfInterest.prototype.get_Level.toString();
							var poiLevelMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Level = function() {
								return this[poiLevelMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Type !== 'function') {
							source = ClientLib.Vis.Region.RegionPointOfInterest.prototype.get_Type.toString();
							var poiTypeMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {ClientLib.Data.WorldSector.WorldObjectPointOfInterest.EPOIType}
							 */
							ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Type = function() {
								return this[poiTypeMemberName];
							};
						}
					},

					/**
					 * @param {qx.event.type.Event} event
					 */
					onRegionObjectStatusInfoAppear: function(event) {
						var regionObjectStatusInfo = event.getTarget();
						var visObject = regionObjectStatusInfo.getLayoutParent().getObject();
						var worldObjectNPCBases = this.getWorldObjectsWithinRange(
							visObject.get_RawX(),
							visObject.get_RawY(),
							Wavy.ForgottenAttackDistance,
							[ClientLib.Data.WorldSector.ObjectType.NPCBase]
						)[ClientLib.Data.WorldSector.ObjectType.NPCBase];
						var npcBaseLevels = this.getNPCBaseLevels(worldObjectNPCBases);

						this.regionCityInfoCountLabel.setBaseCount(worldObjectNPCBases.length);

						if (Object.keys(npcBaseLevels).length > 0) {
							this.regionCityInfoLevelLabel.setValue(
								Object.keys(npcBaseLevels).sort(function(a, b) {
									return b - a;
								}).map(function(baseLevel) {
									return npcBaseLevels[baseLevel] + ' x ' + baseLevel;
								}).join(', ')
							);
						}
						else {
							this.regionCityInfoLevelLabel.setValue('-');
						}

						regionObjectStatusInfo.add(this.regionCityInfoContainer);
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 */
					onMoveBaseMouseToolCellChange: function(x, y) {
						var coords = ClientLib.Base.MathUtil.EncodeCoordId(x, y);

						if (!(coords in this.regionCityMoveInfoCache)) {
							var worldObjectNPCBases = this.getWorldObjectsWithinRange(x, y,
								Wavy.ForgottenAttackDistance,
								[ClientLib.Data.WorldSector.ObjectType.NPCBase]
							)[ClientLib.Data.WorldSector.ObjectType.NPCBase];

							this.regionCityMoveInfoCache[coords] = {
								count: worldObjectNPCBases.length,
								levels: this.getNPCBaseLevels(worldObjectNPCBases)
							};
						}

						var cached = this.regionCityMoveInfoCache[coords];
						this.regionCityMoveInfoCountLabel.setBaseCount(cached.count);

						if (Object.keys(cached.levels).length > 0) {
							this.regionCityMoveInfoLevelLabel.setValue(
								Object.keys(cached.levels).sort(function(a, b) {
									return b - a;
								}).map(function(baseLevel) {
									return cached.levels[baseLevel] + ' x ' + baseLevel;
								}).join(', ')
							);
						}
						else {
							this.regionCityMoveInfoLevelLabel.setValue('-');
						}
					},

					onMoveBaseMouseToolDeactivate: function() {
						this.regionCityMoveInfoCache = null;
					},

					onMoveBaseMouseToolActivate: function() {
						this.regionCityMoveInfoCache = {};
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 * @param {Number} maxDistance
					 * @param {Array<ClientLib.Data.WorldSector.ObjectType>} worldObjectTypes
					 * @returns {Object}
					 */
					getWorldObjectsWithinRange: function(x, y, maxDistance, worldObjectTypes) {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						var maxDistanceSquared = maxDistance * maxDistance;
						var maxDistanceFloored = Math.floor(maxDistance);

						var minX = x - maxDistanceFloored;
						var maxX = x + maxDistanceFloored;
						var minY = y - maxDistanceFloored;
						var maxY = y + maxDistanceFloored;
						var objects = {};

						for (var i = 0; i < worldObjectTypes.length; i++) {
							objects[worldObjectTypes[i]] = [];
						}

						for (var scanX = minX; scanX <= maxX; scanX++) {
							for (var scanY = minY; scanY <= maxY; scanY++) {
								var distanceSquared = (x - scanX) * (x - scanX) + (y - scanY) * (y - scanY);

								if (distanceSquared > maxDistanceSquared) {
									continue;
								}

								var worldObject = world.GetObjectFromPosition(scanX, scanY);

								if (worldObject !== null && worldObjectTypes.indexOf(worldObject.Type) !== -1) {
									objects[worldObject.Type].push(worldObject);
								}
							}
						}

						return objects;
					},

					/**
					 * @param {Array} worldObjectNPCBases
					 * @returns {Object}
					 */
					getNPCBaseLevels: function(worldObjectNPCBases) {
						var npcBaseLevels = {};

						for (var i = 0; i < worldObjectNPCBases.length; i++) {
							var baseLevel = worldObjectNPCBases[i].get_BaseLevel();

							if (!(baseLevel in npcBaseLevels)) {
								npcBaseLevels[baseLevel] = 0;
							}

							npcBaseLevels[baseLevel]++;
						}

						return npcBaseLevels;
					},

					/**
					 * @param {ClientLib.Data.Notification} notification
					 */
					onNotificationAdded: function(notification) {
						if (notification.get_CategoryId() === ClientLib.Data.ENotificationCategory.Combat) {
							switch (notification.get_MdbId()) {
								case ClientLib.Data.ENotificationId.NPCPlayerCombatBattleDefaultDefense:
								case ClientLib.Data.ENotificationId.NPCPlayerCombatBattleTotalLostDefense:
									var reportDetails = this.getNoficationParameter(notification, webfrontend.gui.notifications.NotificationsUtil.ParameterReportId);
									var reportId = reportDetails[0], playerReportType = reportDetails[1];
									ClientLib.Data.MainData.GetInstance().get_Reports().MarkReportsAsRead([reportId], playerReportType, false);
									break;
							}
						}
					},

					/**
					 * @param {ClientLib.Data.Notification} notification
					 * @param {String} parameter
					 * @returns {*}
					 */
					getNoficationParameter: function(notification, parameter) {
						var params = notification.get_Parameters();

						for (var i = 0; i < params.length; i++) {
							if (params[i].t === parameter) {
								return params[i].v;
							}
						}

						throw new Error('Notification ' + notification.get_Id() + ' parameter "' + parameter + '" not found');
					}
				}
			});

			qx.Class.define('Wavy.CountLabel', {
				extend: qx.ui.container.Composite,
				construct: function() {
					qx.ui.container.Composite.call(this);
					this.setLayout(new qx.ui.layout.HBox());

					this.add(this.baseCountLabel = new qx.ui.basic.Label().set({
						textColor: 'text-region-value'
					}));
					this.add(new qx.ui.core.Spacer(4));
					this.add(new qx.ui.basic.Label('('));
					this.add(this.waveCountLabel = new qx.ui.basic.Label().set({
						textColor: 'text-region-value'
					}));
					this.add(new qx.ui.basic.Label(')'));
				},
				members: {
					baseCountLabel: null,
					waveCountLabel: null,

					/**
					 * @param {Number} baseCount
					 */
					setBaseCount: function(baseCount) {
						var waveCount = this.getNumberOfWaves(baseCount);
						this.baseCountLabel.setValue(baseCount.toString());
						this.waveCountLabel.setValue(waveCount.toString()
							+ ' wave' + (waveCount === 1 ? '' : 's')
						);
					},

					/**
					 * @param {Number} baseCount
					 * @returns {Number}
					 */
					getNumberOfWaves: function(baseCount) {
						return Math.max(1, Math.min(5, Math.floor(baseCount / 10)));
					}
				}
			});
		}

		function waitForGame() {
			try {
				if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
					if (ClientLib.Data.MainData.GetInstance().get_Server().get_ForgottenAttacksEnabled()) {
						createWavy();
						Wavy.getInstance().initialize();
					}
					else {
						console.log('Wavy: Forgotten attacks not enabled. Init cancelled.');
					}
				}
				else {
					setTimeout(waitForGame, 1000);
				}
			}
			catch (e) {
				console.log('Wavy: ', e.toString());
			}
		}

		setTimeout(waitForGame, 1000);
	};

	var script = document.createElement('script');
	script.innerHTML = '(' + main.toString() + ')();';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
})();

/***********************************************************************************
Maelstrom ADDON Basescanner + Infected Camps
***********************************************************************************/
// ==UserScript==
// @description Maelstrom ADDON Basescanner
// @version     1.9.0.I
// @author      BlinDManX
// @grant       none
// @copyright   2012+, Claus Neumann
// @license     CC BY-NC-ND 3.0 - http://creativecommons.org/licenses/by-nc-nd/3.0/
// ==/UserScript==

(function () {
	var MaelstromTools_Basescanner = function () {
		window.__msbs_version = "1.9.0 Plus Infected Camps";
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
                    crysCounter : null,
                    tibCounter : null,
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
							this.ZL.setColumns(["ID", "LoadState", this.T.get("City"), this.T.get("Location"), this.T.get("Level"), this.T.get("Tiberium"), this.T.get("Crystal"), this.T.get("Dollar"), this.T.get("Research"), "Crystalfields", "Tiberiumfields", this.T.get("Building state"), this.T.get("Defense state"), this.T.get("CP"), "Def.HP/Off.HP", "Sum Tib+Cry+Cre", "(Tib+Cry+Cre)/CP", "CY", "DF", this.T.get("base set up at"), "6+5+4+3t Tib", "6+5+4+3t Crys", "6+5+4+3t Mixed"]);
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
							this.ZN.setColumnWidth(20, Addons.LocalStorage.getserver("Basescanner_ColWidth_20", 50));
							this.ZN.setColumnWidth(21, Addons.LocalStorage.getserver("Basescanner_ColWidth_21", 50));
							this.ZN.setColumnWidth(22, Addons.LocalStorage.getserver("Basescanner_ColWidth_22", 50));
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
							var limiter = Addons.LocalStorage.getserver("Basescanner_Cplimiter", 40);
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
							this.ZK[2].setValue(Addons.LocalStorage.getserver("Basescanner_Show2", true));
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

							var border = new qx.ui.decoration.Decorator(2, "solid", "blue");
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
							var item = new qx.ui.form.ListItem(this.T.get("All Layouts"), null, 0);
							this.ZJ.add(item);
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
                            this.crysCounter = {};
							this.tibCounter = {};
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
															this.ZE.push([object.getID(),  - 1, this.T.get("Player"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0, 0, 0 ,0]);
														}
													}
													else if (object.Type == 2 && c2) { //basen
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															this.ZE.push(d);
														} else {
															this.ZE.push([object.getID(),  - 1, this.T.get("Bases"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0, 0, 0 ,0]);
														}
													}
													else if (object.Type == 3 && (c3 || c4)) { //Lager Vposten
                                                        //debugger;
														//console.log("object ID LEVEL", object.getID() ,object.getLevel() );
														if (d != null) {
															if ((object.getCampType() == 2 || object.getCampType() == 1) && c4) {
																this.ZE.push(d);
															}
															else if ((object.getCampType() == 7) && c4) {
																this.ZE.push(d);
															}
															else if (object.getCampType() == 3 && c3) {
																this.ZE.push(d);
															}

														} else {
															if ((object.getCampType() == 7 || object.getCampType() == 2 || object.getCampType() == 1) && c4) {
																this.ZE.push([object.getID(),  - 1, this.T.get("Camp"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0, 0, 0 ,0]);
															}
															else if ((object.getCampType() == 7) && c4) {
																this.ZE.push([object.getID(),  - 1, this.T.get("Infected Camp"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0, 0, 0 ,0]);
															}
															else if (object.getCampType() == 3 && c3) {
																this.ZE.push([object.getID(),  - 1, this.T.get("Outpost"), scanX + ":" + scanY, object.getLevel(), 0, 0, 0, 0, 0, 0, 0, 0, needcp, 0, 0, 0, 0, 0, 0 ,0]);
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
							this.ZL.sortByColumn(4, false); //Sort from High to Low. Sort by lvl is "4". Sort by Crist is "6".
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
															this.crysCounter[id] = new Array(9);
															this.tibCounter[id] = new Array(9);
															for (m = 0; m < 9; m++) {
																this.ZM[id][m] = new Array(8);
                                                                this.crysCounter[id][m] = new Array(9).join('0').split('').map(parseFloat);
                                                                this.tibCounter[id][m] = new Array(9).join('0').split('').map(parseFloat);
															}
															for (k = 1; k < 8; k++) {
																for (l = 1; l < 7; l++) {
																	//console.log( ncity.GetResourceType(k,l) );
																	switch (ncity.GetResourceType(k, l)) {
																	case 1:
																		/* Crystal */
																		this.ZM[id][k][l] = 1;
																		this.crysCounter[id][k-1][l]++;
																		this.crysCounter[id][k-1][l-1]++;
																		this.crysCounter[id][k-1][l+1]++;

																		this.crysCounter[id][k+1][l]++;
																		this.crysCounter[id][k+1][l-1]++;
																		this.crysCounter[id][k+1][l+1]++;

																		this.crysCounter[id][k][l-1]++;
																		this.crysCounter[id][k][l+1]++;
																		c++;
																		break;
																	case 2:
																		/* Tiberium */
																		this.ZM[id][k][l] = 2;
																		this.tibCounter[id][k-1][l]++;
																		this.tibCounter[id][k-1][l-1]++;
																		this.tibCounter[id][k-1][l+1]++;

																		this.tibCounter[id][k+1][l]++;
																		this.tibCounter[id][k+1][l-1]++;
																		this.tibCounter[id][k+1][l+1]++;

																		this.tibCounter[id][k][l-1]++;
																		this.tibCounter[id][k][l+1]++;
																		t++;
																		break;
																	default:
																		//none
																		break;
																	}
																}
															}
                                                            var tib_xtouch = new Array(6).join('0').split('').map(parseFloat);
                                                            var crys_xtouch = new Array(6).join('0').split('').map(parseFloat);
                                                            var mixed_xtouch = new Array(6).join('0').split('').map(parseFloat);
                                                            for (k = 0; k < 9; k++) {
																for (l = 0; l < 8; l++) {
                                                                    if(this.ZM[id][k][l] != 1 && this.ZM[id][k][l] != 2)
                                                                    {
                                                                        if(this.tibCounter[id][k][l] > 0 && this.crysCounter[id][k][l] > 0 && (this.tibCounter[id][k][l] + this.crysCounter[id][k][l] >= 3))
                                                                        {
                                                                            mixed_xtouch[this.tibCounter[id][k][l] + this.crysCounter[id][k][l]-3]++;
                                                                        }
                                                                        else if(this.tibCounter[id][k][l] >= 3 )
                                                                        {
                                                                            tib_xtouch[this.tibCounter[id][k][l] -3]++;
                                                                        }
                                                                        else if(this.crysCounter[id][k][l] >= 3 )
                                                                        {
                                                                            crys_xtouch[this.crysCounter[id][k][l] - 3]++;
                                                                        }
                                                                    }
																}
															}
															//console.log( c,t );


															this.ZE[i][9] = c;
															this.ZE[i][10] = t;
															this.ZE[i][11] = ncity.GetBuildingsConditionInPercent();
															this.ZE[i][12] = ncity.GetDefenseConditionInPercent();

                                                            if(tib_xtouch[2] > 0 || tib_xtouch[3] > 0)
                                                            {
                                                                this.ZE[i][20] = "!! " + tib_xtouch[3] + "+" +tib_xtouch[2] + "+" +tib_xtouch[1] + "+" +tib_xtouch[0] + " !!";
                                                            }
                                                            else
                                                            {
                                                                this.ZE[i][20] = (tib_xtouch[3] + "+" +tib_xtouch[2] + "+" +tib_xtouch[1] + "+" +tib_xtouch[0]).slice(-9);
                                                            }
                                                            if(crys_xtouch[2] > 0 || crys_xtouch[3] > 0)
                                                            {
                                                                this.ZE[i][21] = "!! " + crys_xtouch[3] + "+" +crys_xtouch[2] + "+" +crys_xtouch[1] + "+" +crys_xtouch[0]+ " !!";
                                                            }
                                                            else
                                                            {
                                                                this.ZE[i][21] = (crys_xtouch[3] + "+" +crys_xtouch[2] + "+" +crys_xtouch[1] + "+" +crys_xtouch[0]).slice(-9);
                                                            }
                                                            if(mixed_xtouch[2] > 0 || mixed_xtouch[3] > 0)
                                                            {
                                                                this.ZE[i][22] = "!! " + mixed_xtouch[3] + "+" +mixed_xtouch[2] + "+" +mixed_xtouch[1] + "+" +mixed_xtouch[0]+ " !!";
                                                            }
                                                            else
                                                            {
                                                                this.ZE[i][22] = (mixed_xtouch[3] + "+" +mixed_xtouch[2] + "+" +mixed_xtouch[1] + "+" +mixed_xtouch[0]).slice(-9);
                                                            }

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
															this.ZE[i][14] = (defhp / offhp);

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
							}// else {
							//	continue;
							//}

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
			T.addtranslateobj( {main:"All Layouts", de: "All Layouts", pt: "All Layouts", fr: "All Layouts"} );
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

/***********************************************************************************
MaelstromTools DEV
***********************************************************************************/
// ==UserScript==
// @description Just a set of statistics & summaries about repair time and base resources. Mainly for internal use, but you are free to test and comment it.
// @version     0.1.4.48
// @author      Maelstrom, HuffyLuf, KRS_L, Krisan and DLwarez
// ==/UserScript==

(function () {
  var MaelstromTools_main = function () {
    try {
      function CCTAWrapperIsInstalled() {
        return (typeof (CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
      }

      function createMaelstromTools() {
        console.log('MaelstromTools loaded');

        qx.Class.define("MaelstromTools.Language", {
          type: "singleton",
          extend: qx.core.Object,
          construct: function (language) {
            this.Languages = ['de_DE', 'pt_PT', 'fr_FR', 'tr_TR']; // en is default, not needed in here!
            if (language != null) {
              this.MyLanguage = language;
            }
          },
          members: {
            MyLanguage: "en",
            Languages: null,
            Data: null,

            loadData: function (language) {
              var l = this.Languages.indexOf(language);

              if (l < 0) {
                this.Data = null;
                return;
              }

              this.Data = {};
              this.Data["Collect all packages"] = ["Alle Pakete einsammeln", "Recolher todos os pacotes", "Récupérez tous les paquets", "Tüm paketleri topla"][l];
              this.Data["Overall production"] = ["Produktionsübersicht", "Produção global", "La production globale", "Genel üretim"][l];
              this.Data["Army overview"] = ["Truppenübersicht", "Vista Geral de Exército", "Armée aperçu", "Ordu önizlemesi"][l];
              this.Data["Base resources"] = ["Basis Ressourcen", "Recursos base", "ressources de base", "Üs önizlemesi"][l];
              this.Data["Main menu"] = ["Hauptmenü", "Menu Principal", "menu principal", "Ana menü"][l];
              this.Data["Repair all units"] = ["Alle Einheiten reparieren", "Reparar todas as unidades", "Réparer toutes les unités", "Tüm üniteleri onar"][l];
              this.Data["Repair all defense buildings"] = ["Alle Verteidigungsgebäude reparieren", "Reparar todos os edifícios de defesa", "Réparer tous les bâtiments de défense", "Tüm savunma binalarini onar"][l];
              this.Data["Repair all buildings"] = ["Alle Gebäurde reparieren", "Reparar todos os edifícios", "Réparer tous les bâtiments", "Tüm binalari onar"][l];
              this.Data["Base status overview"] = ["Basisübersicht", "Estado geral da base", "aperçu de l'état de base", "Üs durumu önizlemesi"][l];
              this.Data["Upgrade priority overview"] = ["Upgrade Übersicht", "Prioridade de upgrades", "aperçu des priorités de mise à niveau", "Yükseltme önceligi önizlemesi"][l];
              this.Data["MaelstromTools Preferences"] = ["MaelstromTools Einstellungen", "Preferências de MaelstromTools", "Préférences MaelstromTools", "MaelstromTools Ayarlari"][l];
              this.Data["Options"] = ["Einstellungen", "Opções", "Options", "Seçenekler"][l];
              this.Data["Target out of range, no resource calculation possible"] = ["Ziel nicht in Reichweite, kann die plünderbaren Ressourcen nicht berechnen", "Alvo fora do alcance, não é possivel calcular os recursos", "Cible hors de portée, pas de calcul de ressources possible",
			  "Hedef menzil disinda, kaynak hesaplamasi olanaksiz"][l];
              this.Data["Lootable resources"] = ["Plünderbare Ressourcen", "Recursos roubáveis", "Ressources à piller", "Yagmalanabilir kaynaklar"][l];
              this.Data["per CP"] = ["pro KP", "por PC", "par PC", "KP basina"][l];
              this.Data["2nd run"] = ["2. Angriff", "2º ataque", "2° attaque", "2. saldiri"][l];
              this.Data["3rd run"] = ["3. Angriff", "3º ataque", "3° attaque", "3. saldiri"][l];
              this.Data["Calculating resources..."] = ["Berechne plünderbare Ressourcen...", "A calcular recursos...", "calcul de ressources ...", "Kaynaklar hesaplaniyor..."][l];
              this.Data["Next MCV"] = ["MBF", "MCV", "VCM"][l];
              this.Data["Show time to next MCV"] = ["Zeige Zeit bis zum nächsten MBF", "Mostrar tempo restante até ao próximo MCV", "Afficher l'heure pour le prochain VCM ", "Sirdaki MCV için gereken süreyi göster"][l];
              this.Data["Show lootable resources (restart required)"] = ["Zeige plünderbare Ressourcen (Neustart nötig)", "Mostrar recursos roubáveis (é necessário reiniciar)", "Afficher les ressources fouiller (redémarrage nécessaire)", "Yagmalanabilir kaynaklari göster (yeniden baslatma gerekli)"][l];
              this.Data["Use dedicated Main Menu (restart required)"] = ["Verwende extra Hauptmenü (Neustart nötig)", "Usar botão para o Menu Principal (é necessário reiniciar)", "Utiliser dédiée du menu principal (redémarrage nécessaire)", "Ana menü tusunu kullan (yeniden baslatma gerekli)"][l];
              this.Data["Autocollect packages"] = ["Sammle Pakete automatisch", "Auto recolher pacotes", "paquets autocollecté", "Paketleri otomatik topla"][l];
              this.Data["Autorepair units"] = ["Repariere Einheiten automatisch", "Auto reparar o exército", "unités autoréparé", "Üniteleri otomatik onar"][l];
              this.Data["Autorepair defense (higher prio than buildings)"] = ["Repariere Verteidigung automatisch (höhere Prio als Gebäude)", "Auto reparar defesa (maior prioridade do que os edifícios)", "réparation automatique la défense (priorité plus élevé que les bâtiments) ", "Savunmayi otomatik onar (binalardan daha yüksek öncelikli olarak)"][l];
              this.Data["Autorepair buildings"] = ["Repariere Gebäude automatisch", "Auto reparar edifícios", "bâtiments autoréparé", "Binalari otomatik onar"][l];
              this.Data["Automatic interval in minutes"] = ["Auto-Intervall in Minuten", "Intervalo de tempo automático (em minutos)", "intervalle automatique en quelques minutes", "Otomatik toplama araligi (dk)"][l];
              this.Data["Apply changes"] = ["Speichern", "Confirmar", "Appliquer changements", "Uygula"][l];
              this.Data["Discard changes"] = ["Abbrechen", "Cancelar", "Annuler changements", "Iptal"][l];
              this.Data["Reset to default"] = ["Auf Standard zurücksetzen", "Definições padrão", "Réinitialiser", "Sifirla"][l];
              this.Data["Continuous"] = ["Kontinuierlich", "Contínua", "continue", "Sürekli"][l];
              this.Data["Bonus"] = ["Pakete", "Bónus", "Bonus", "Bonus"][l];
              this.Data["POI"] = ["POI", "POI", "POI", "POI"][l];
              this.Data["Total / h"] = ["Gesamt / h", "Total / h", "Total / h", "Toplam / sa."][l];
              this.Data["Repaircharges"] = ["Reparaturzeiten", "Custo de reparação", "frais de réparation", "Onarim maliyeti"][l];
              this.Data["Repairtime"] = ["Max. verfügbar", "Tempo de reparação", "Temps de réparation", "Onarim süresi"][l];
              this.Data["Attacks"] = ["Angriffe", "Ataques", "Attaques", "Saldirilar"][l];
              this.Data[MaelstromTools.Statics.Infantry] = ["Infanterie", "Infantaria", "Infanterie", "Piyade"][l];
              this.Data[MaelstromTools.Statics.Vehicle] = ["Fahrzeuge", "Veículos", "Vehicule", "Motorlu B."][l];
              this.Data[MaelstromTools.Statics.Aircraft] = ["Flugzeuge", "Aeronaves", "Aviation", "Hava A."][l];
              this.Data[MaelstromTools.Statics.Tiberium] = ["Tiberium", "Tibério", "Tiberium", "Tiberium"][l];
              this.Data[MaelstromTools.Statics.Crystal] = ["Kristalle", "Cristal", "Cristal", "Kristal"][l];
              this.Data[MaelstromTools.Statics.Power] = ["Strom", "Potência", "Energie", "Güç"][l];
              this.Data[MaelstromTools.Statics.Dollar] = ["Credits", "Créditos", "Crédit", "Kredi"][l];
              this.Data[MaelstromTools.Statics.Research] = ["Forschung", "Investigação", "Recherche", "Arastirma"][l];
              this.Data["Base"] = ["Basis", "Base", "Base", "Üs"][l];
              this.Data["Defense"] = ["Verteidigung", "Defesa", "Défense", "Savunma"][l];
              this.Data["Army"] = ["Armee", "Exército", "Armée", "Ordu"][l];
              this.Data["Level"] = ["Stufe", "Nível", "Niveau", "Seviye"][l];
              this.Data["Buildings"] = ["Gebäude", "Edifícios", "Bâtiments", "Binalar"][l];
              this.Data["Health"] = ["Leben", "Vida", "Santé", "Saglik"][l];
              this.Data["Units"] = ["Einheiten", "Unidades", "Unités", "Üniteler"][l];
              this.Data["Hide Mission Tracker"] = ["Missionsfenster ausblenden", "Esconder janela das Missões", "Cacher la fenêtre de mission", "Görev Izleyicisini Gizle"][l];
              this.Data["none"] = ["keine", "nenhum", "aucun", "hiçbiri"][l];
              this.Data["Cooldown"] = ["Cooldown", "Relocalização", "Recharge", "Cooldown"][l];
              this.Data["Protection"] = ["Geschützt bis", "Protecção", "Protection", "Koruma"][l];
              this.Data["Available weapon"] = ["Verfügbare Artillerie", "Apoio disponível", "arme disponible", "Mevcut silah"][l];
              this.Data["Calibrated on"] = ["Kalibriert auf", "Calibrado em", "Calibré sur ", "Kalibreli"][l];
              this.Data["Total resources"] = ["Gesamt", "Total de recursos", "Ressources totales", "Toplam kaynaklar"][l];
              this.Data["Max. storage"] = ["Max. Kapazität", "Armazenamento Máx.", "Max. de stockage", "Maks. Depo"][l];
              this.Data["Storage full!"] = ["Lager voll!", "Armazenamento cheio!", "Stockage plein", "Depo dolu!"][l];
              this.Data["Storage"] = ["Lagerstand", "Armazenamento", "Stockage", "Depo"][l];
              this.Data["display only top buildings"] = ["Nur Top-Gebäude anzeigen", "Mostrar apenas melhores edifícios", "afficher uniquement les bâtiments principaux", "yalnizca en iyi binalari göster"][l];
              this.Data["display only affordable buildings"] = ["Nur einsetzbare Gebäude anzeigen", "Mostrar apenas edíficios acessíveis", "afficher uniquement les bâtiments abordables", "yalnizca satin alinabilir binalari göster"][l];
              this.Data["City"] = ["Stadt", "Base", "Base", "Sehir"][l];
              this.Data["Type (coord)"] = ["Typ (Koord.)", "Escrever (coord)", "Type (coord)", "Tip (koord.)"][l];
              this.Data["to Level"] = ["Auf Stufe", "para nível", "à Niveau ", "Seviye için"][l];
              this.Data["Gain/h"] = ["Zuwachs/h", "Melhoria/h", "Gain / h", "Kazanç / sa."][l];
              this.Data["Factor"] = ["Faktor", "Factor", "Facteur", "Faktör"][l];
              this.Data["Tib/gain"] = ["Tib./Zuwachs", "Tib/melhoria", "Tib / gain", "Tib/Kazanç"][l];
              this.Data["Pow/gain"] = ["Strom/Zuwachs", "Potencia/melhoria", "Puissance / Gain", "Güç/Kazanç"][l];
              this.Data["ETA"] = ["Verfügbar in", "Tempo restante", "Temps restant", "Kalan Zaman"][l];
              this.Data["Upgrade"] = ["Aufrüsten", "Upgrade", "Upgrade", "Yükselt"][l];
              this.Data["Powerplant"] = ["Kratfwerk", "Central de Energia", "Centrale", "Güç Santrali"][l];
              this.Data["Refinery"] = ["Raffinerie", "Refinaria", "Raffinerie", "Rafineri"][l];
              this.Data["Harvester"] = ["Sammler", "Harvester", "Collecteur", "Biçerdöver"][l];
              this.Data["Silo"] = ["Silo", "Silo", "Silo", "Silo"][l];
              this.Data["Accumulator"] = ["Akkumulator", "Acumulador", "Accumulateur", "Akümülatör"][l];
              this.Data["Calibrate support"] = ["Artillerie kalibrieren", "Calibrar apoio", "Calibrer soutien", "Takviyeyi kalibre et"][l];
              this.Data["Access"] = ["Öffne", "Aceder", "Accès ", "Aç"][l];
              this.Data["Focus on"] = ["Zentriere auf", "Concentrar em", "Centré sur", "Odaklan"][l];
              this.Data["Possible attacks from this base (available CP)"] = ["Mögliche Angriffe (verfügbare KP)", "Possible attacks from this base (available CP)","Possible attacks from this base (available CP)", "Bu üsten yapilmasi mümkün olan saldirilar (mevcut KP)"][l];
              //this.Data[""] = [""][l];
            },
            get: function (ident) {
              return this.gt(ident);
            },
            gt: function (ident) {
              if (!this.Data || !this.Data[ident]) {
                /*if(!parseInt(ident.substr(0, 1), 10) && ident != "0") {
                  console.log("missing language data: " + ident);
                }*/
                return ident;
              }
              return this.Data[ident];
            }
          }
        }),

        // define Base
        qx.Class.define("MaelstromTools.Base", {
          type: "singleton",
          extend: qx.core.Object,
          members: {
            /* Desktop */
            timerInterval: 1500,
            mainTimerInterval: 5000,
            lootStatusInfoInterval: null,
            images: null,
            mWindows: null,
            mainMenuWindow: null,

            itemsOnDesktop: null,
            itemsOnDesktopCount: null,
            itemsInMainMenu: null,
            itemsInMainMenuCount: null,
            buttonCollectAllResources: null,
            buttonRepairAllUnits: null,
            buttonRepairAllBuildings: null,

            lootWidget: null,

            initialize: function () {
              try {
                //console.log(qx.locale.Manager.getInstance().getLocale());
                Lang.loadData(ClientLib.Config.Main.GetInstance().GetConfig(ClientLib.Config.Main.CONFIG_LANGUAGE));
                //console.log("Client version: " + MaelstromTools.Wrapper.GetClientVersion());
                this.itemsOnDesktopCount = [];
                this.itemsOnDesktop = {};
                this.itemsInMainMenuCount = [];
                this.itemsInMainMenu = {};

                var fileManager = ClientLib.File.FileManager.GetInstance();
                //ui/icons/icon_mainui_defense_button
                //ui/icons/icon_mainui_base_button
                //ui/icons/icon_army_points
                //icon_def_army_points
                var factionText = ClientLib.Base.Util.GetFactionGuiPatchText();
                this.createNewImage(MaelstromTools.Statics.Tiberium, "ui/common/icn_res_tiberium.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Crystal, "ui/common/icn_res_chrystal.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Power, "ui/common/icn_res_power.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Dollar, "ui/common/icn_res_dollar.png", fileManager);
                this.createNewImage(MaelstromTools.Statics.Research, "ui/common/icn_res_research.png", fileManager);
                this.createNewImage("Sum", "ui/common/icn_build_slots.png", fileManager);
                this.createNewImage("AccessBase", "ui/" + factionText + "/icons/icon_mainui_enterbase.png", fileManager);
                this.createNewImage("FocusBase", "ui/" + factionText + "/icons/icon_mainui_focusbase.png", fileManager);
                this.createNewImage("Packages", "ui/" + factionText + "/icons/icon_collect_packages.png", fileManager);
                this.createNewImage("RepairAllUnits", "ui/" + factionText + "/icons/icon_army_points.png", fileManager);
                this.createNewImage("RepairAllBuildings", "ui/" + factionText + "/icons/icn_build_slots.png", fileManager);
                this.createNewImage("ResourceOverviewMenu", "ui/common/icn_res_chrystal.png", fileManager);
                this.createNewImage("ProductionMenu", "ui/" + factionText + "/icons/icn_build_slots.png", fileManager);
                this.createNewImage("RepairTimeMenu", "ui/" + factionText + "/icons/icon_repair_all_button.png", fileManager);
                this.createNewImage("Crosshair", "ui/icons/icon_support_tnk_white.png", fileManager);
                this.createNewImage("UpgradeBuilding", "ui/" + factionText + "/icons/icon_building_detail_upgrade.png", fileManager);

                this.createNewWindow("MainMenu", "R", 125, 140, 120, 100, "B");
                this.createNewWindow("Production", "L", 120, 60, 340, 140);
                this.createNewWindow("RepairTime", "L", 120, 60, 340, 140);
                this.createNewWindow("ResourceOverview", "L", 120, 60, 340, 140);
                this.createNewWindow("BaseStatusOverview", "L", 120, 60, 340, 140);
                this.createNewWindow("Preferences", "L", 120, 60, 440, 140);
                this.createNewWindow("UpgradePriority", "L", 120, 60, 870, 400);

                if (!this.mainMenuWindow) {
                  this.mainMenuWindow = new qx.ui.popup.Popup(new qx.ui.layout.Canvas()).set({
                    //backgroundColor: "#303030",
                    padding: 5,
                    paddingRight: 0
                  });
                  if (MT_Preferences.Settings.useDedicatedMainMenu) {
                    this.mainMenuWindow.setPlaceMethod("mouse");
                    this.mainMenuWindow.setPosition("top-left");
                  } else {
                    this.mainMenuWindow.setPlaceMethod("widget");
                    this.mainMenuWindow.setPosition("bottom-right");
                    this.mainMenuWindow.setAutoHide(false);
                    this.mainMenuWindow.setBackgroundColor("transparent");
                    //this.mainMenuWindow.setShadow(null);
                    this.mainMenuWindow.setDecorator(new qx.ui.decoration.Decorator());
                  }
                }

                var desktopPositionModifier = 0;

                this.buttonCollectAllResources = this.createDesktopButton(Lang.gt("Collect all packages"), "Packages", true, this.desktopPosition(desktopPositionModifier));
                this.buttonCollectAllResources.addListener("execute", this.collectAllPackages, this);

                var openProductionWindowButton = this.createDesktopButton(Lang.gt("Overall production"), "ProductionMenu", false, this.desktopPosition(desktopPositionModifier));
                openProductionWindowButton.addListener("execute", function () {
                  MaelstromTools.Production.getInstance().openWindow("Production", Lang.gt("Overall production"));
                }, this);

                var openResourceOverviewWindowButton = this.createDesktopButton(Lang.gt("Base resources"), "ResourceOverviewMenu", false, this.desktopPosition(desktopPositionModifier));
                openResourceOverviewWindowButton.addListener("execute", function () {
                  MaelstromTools.ResourceOverview.getInstance().openWindow("ResourceOverview", Lang.gt("Base resources"));
                }, this);

                desktopPositionModifier++;
                var openMainMenuButton = this.createDesktopButton(Lang.gt("Main menu"), "ProductionMenu", false, this.desktopPosition(desktopPositionModifier));
                openMainMenuButton.addListener("click", function (e) {
                  this.mainMenuWindow.placeToPointer(e);
                  this.mainMenuWindow.show();
                }, this);

                this.buttonRepairAllUnits = this.createDesktopButton(Lang.gt("Repair all units"), "RepairAllUnits", true, this.desktopPosition(desktopPositionModifier));
                this.buttonRepairAllUnits.addListener("execute", this.repairAllUnits, this);

                this.buttonRepairAllBuildings = this.createDesktopButton(Lang.gt("Repair all buildings"), "RepairAllBuildings", true, this.desktopPosition(desktopPositionModifier));
                this.buttonRepairAllBuildings.addListener("execute", this.repairAllBuildings, this);

                var openRepairTimeWindowButton = this.createDesktopButton(Lang.gt("Army overview"), "RepairTimeMenu", false, this.desktopPosition(desktopPositionModifier));
                openRepairTimeWindowButton.addListener("execute", function () {
                  MaelstromTools.RepairTime.getInstance().openWindow("RepairTime", Lang.gt("Army overview"));
                }, this);

                var openBaseStatusOverview = this.createDesktopButton(Lang.gt("Base status overview"), "Crosshair", false, this.desktopPosition(desktopPositionModifier));
                openBaseStatusOverview.addListener("execute", function () {
                  MaelstromTools.BaseStatus.getInstance().openWindow("BaseStatusOverview", Lang.gt("Base status overview"));
                }, this);

                desktopPositionModifier++;
                var openHuffyUpgradeOverview = this.createDesktopButton(Lang.gt("Upgrade priority overview"), "UpgradeBuilding", false, this.desktopPosition(desktopPositionModifier));
                openHuffyUpgradeOverview.addListener("execute", function () {
                  HuffyTools.UpgradePriorityGUI.getInstance().openWindow("UpgradePriority", Lang.gt("Upgrade priority overview"));
                }, this);

                desktopPositionModifier++;
                var preferencesButton = new qx.ui.form.Button(Lang.gt("Options")).set({
                  appearance: "button-text-small",
                  width: 100,
                  minWidth: 100,
                  maxWidth: 100
                });
                preferencesButton.setUserData("desktopPosition", this.desktopPosition(desktopPositionModifier));
                preferencesButton.addListener("execute", function () {
                  MaelstromTools.Preferences.getInstance().openWindow("Preferences", Lang.gt("MaelstromTools version 0.1.4.48 Preferences"), true);
                }, this);

                if (MT_Preferences.Settings.useDedicatedMainMenu) {
                  this.addToDesktop("MainMenu", openMainMenuButton);
                }
                this.addToMainMenu("ResourceOverviewMenu", openResourceOverviewWindowButton);
                this.addToMainMenu("ProductionMenu", openProductionWindowButton);
                this.addToMainMenu("BaseStatusMenu", openBaseStatusOverview);
                this.addToMainMenu("RepairTimeMenu", openRepairTimeWindowButton);
                this.addToMainMenu("UpgradeBuilding", openHuffyUpgradeOverview);

                this.addToMainMenu("PreferencesMenu", preferencesButton);

                if (!MT_Preferences.Settings.useDedicatedMainMenu) {
                  this.mainMenuWindow.show();
                  var target = qx.core.Init.getApplication().getOptionsBar(); //getServerBar(); //qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_APPOINTMENTS);
                  this.mainMenuWindow.placeToWidget(target, true);
                }

                phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, function () {
                  MaelstromTools.Cache.getInstance().SelectedBaseForLoot=null;
                });

                webfrontend.gui.chat.ChatWidget.recvbufsize = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.CHATHISTORYLENGTH, 64);
                this.runSecondlyTimer();
                this.runMainTimer();
                this.runAutoCollectTimer();
              } catch (e) {
                console.log("MaelstromTools.initialize: ", e);
              }
            },

            desktopPosition: function (modifier) {
              if (!modifier) modifier = 0;
              return modifier;
            },

            createDesktopButton: function (title, imageName, isNotification, desktopPosition) {
              try {
                if (!isNotification) {
                  isNotification = false;
                }
                if (!desktopPosition) {
                  desktopPosition = this.desktopPosition();
                }
                var desktopButton = new qx.ui.form.Button(null, this.images[imageName]).set({
                  toolTipText: title,
                  width: 50,
                  height: 40,
                  maxWidth: 50,
                  maxHeight: 40,
                  appearance: (isNotification ? "button-standard-nod" : "button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
                  center: true
                });

                desktopButton.setUserData("isNotification", isNotification);
                desktopButton.setUserData("desktopPosition", desktopPosition);
                return desktopButton;
              } catch (e) {
                console.log("MaelstromTools.createDesktopButton: ", e);
              }
            },

            createNewImage: function (name, path, fileManager) {
              try {
                if (!this.images) {
                  this.images = {};
                }
                if (!fileManager) {
                  return;
                }

                this.images[name] = fileManager.GetPhysicalPath(path);
              } catch (e) {
                console.log("MaelstromTools.createNewImage: ", e);
              }
            },

            createNewWindow: function (name, align, x, y, w, h, alignV) {
              try {
                if (!this.mWindows) {
                  this.mWindows = {};
                }
                this.mWindows[name] = {};
                this.mWindows[name]["Align"] = align;
                this.mWindows[name]["AlignV"] = alignV;
                this.mWindows[name]["x"] = x;
                this.mWindows[name]["y"] = y;
                this.mWindows[name]["w"] = w;
                this.mWindows[name]["h"] = h;
              } catch (e) {
                console.log("MaelstromTools.createNewWindow: ", e);
              }
            },

            addToMainMenu: function (name, button) {
              try {
                /*if(!this.useDedicatedMainMenu) {
                  return;
                }*/
                if (this.itemsInMainMenu[name] != null) {
                  return;
                }
                var desktopPosition = button.getUserData("desktopPosition");
                var isNotification = button.getUserData("isNotification");
                if (!desktopPosition) {
                  desktopPosition = this.desktopPosition();
                }
                if (!isNotification) {
                  isNotification = false;
                }

                if (isNotification && MT_Preferences.Settings.useDedicatedMainMenu) {
                  this.addToDesktop(name, button);
                } else {
                  if (!this.itemsInMainMenuCount[desktopPosition]) {
                    this.itemsInMainMenuCount[desktopPosition] = 0;
                  }
                  this.mainMenuWindow.add(button, {
                    right: 5 + (52 * this.itemsInMainMenuCount[desktopPosition]),
                    top: 0 + (42 * (desktopPosition)) //bottom: 0 - (42 * (desktopPosition - 1))
                  });

                  this.itemsInMainMenu[name] = button;
                  this.itemsInMainMenuCount[desktopPosition]++;
                }
              } catch (e) {
                console.log("MaelstromTools.addToMainMenu: ", e);
              }
            },

            removeFromMainMenu: function (name, rearrange) {
              try {
                if (rearrange == null) {
                  rearrange = true;
                }
                if (this.itemsOnDesktop[name] != null) {
                  var isNotification = this.itemsOnDesktop[name].getUserData("isNotification");
                  if (!isNotification) {
                    isNotification = false;
                  }
                  if (isNotification && MT_Preferences.Settings.useDedicatedMainMenu) {
                    this.removeFromDesktop(name, rearrange);
                  }
                } else if (this.itemsInMainMenu[name] != null) {
                  var desktopPosition = this.itemsInMainMenu[name].getUserData("desktopPosition");
                  var isNotification = this.itemsInMainMenu[name].getUserData("isNotification");
                  if (!desktopPosition) {
                    desktopPosition = this.desktopPosition();
                  }
                  if (!isNotification) {
                    isNotification = false;
                  }

                  this.mainMenuWindow.remove(this.itemsInMainMenu[name]);
                  this.itemsInMainMenu[name] = null;
                  this.itemsInMainMenuCount[desktopPosition]--;

                  if (rearrange && this.itemsInMainMenu[desktopPosition] > 1) {
                    var tmpItems = {};
                    // remove notifications
                    for (var itemName in this.itemsOnDesktop) {
                      if (this.itemsInMainMenu[itemName] == null) {
                        continue;
                      }
                      if (!isNotification) {
                        continue;
                      }
                      tmpItems[itemName] = this.itemsInMainMenu[itemName];
                      this.removeFromMainMenu(itemName, false);
                    }
                    // rearrange notifications
                    for (var itemName2 in tmpItems) {
                      var tmp = tmpItems[itemName2];
                      if (tmp == null) {
                        continue;
                      }
                      this.addToMainMenu(itemName2, tmp);
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.removeFromDesktop: ", e);
              }
            },

            addToDesktop: function (name, button) {
              try {
                if (this.itemsOnDesktop[name] != null) {
                  return;
                }
                var desktopPosition = button.getUserData("desktopPosition");
                if (!desktopPosition) {
                  desktopPosition = this.desktopPosition();
                }

                if (!this.itemsOnDesktopCount[desktopPosition]) {
                  this.itemsOnDesktopCount[desktopPosition] = 0;
                }

                var app = qx.core.Init.getApplication();
                //var navBar = app.getNavigationBar();

                // console.log("add to Desktop at pos: " + this.itemsOnDesktopCount);
                app.getDesktop().add(button, {
                  //right: navBar.getBounds().width + (52 * this.itemsOnDesktopCount[desktopPosition]),
                  //top: 42 * (desktopPosition - 1)
                  right: 5 + (52 * this.itemsOnDesktopCount[desktopPosition]),
                  //top: this.initialAppointmentBarHeight + 125 + (42 * (desktopPosition - 1))
                  bottom: 140 - (42 * (desktopPosition - 1))
                });

                this.itemsOnDesktop[name] = button;
                this.itemsOnDesktopCount[desktopPosition]++;
              } catch (e) {
                console.log("MaelstromTools.addToDesktop: ", e);
              }
            },

            removeFromDesktop: function (name, rearrange) {
              try {
                if (rearrange == null) {
                  rearrange = true;
                }
                var app = qx.core.Init.getApplication();

                if (this.itemsOnDesktop[name] != null) {
                  var desktopPosition = this.itemsOnDesktop[name].getUserData("desktopPosition");
                  var isNotification = this.itemsOnDesktop[name].getUserData("isNotification");
                  if (!desktopPosition) {
                    desktopPosition = this.desktopPosition();
                  }
                  if (!isNotification) {
                    isNotification = false;
                  }

                  app.getDesktop().remove(this.itemsOnDesktop[name]);
                  this.itemsOnDesktop[name] = null;
                  this.itemsOnDesktopCount[desktopPosition]--;

                  if (rearrange && this.itemsOnDesktopCount[desktopPosition] > 1) {
                    var tmpItems = {};
                    // remove notifications
                    for (var itemName in this.itemsOnDesktop) {
                      if (this.itemsOnDesktop[itemName] == null) {
                        continue;
                      }
                      if (!this.itemsOnDesktop[itemName].getUserData("isNotification")) {
                        continue;
                      }
                      tmpItems[itemName] = this.itemsOnDesktop[itemName];
                      this.removeFromDesktop(itemName, false);
                    }
                    // rearrange notifications
                    for (var itemName2 in tmpItems) {
                      var tmp = tmpItems[itemName2];
                      if (tmp == null) {
                        continue;
                      }
                      this.addToMainMenu(itemName2, tmp);
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.removeFromDesktop: ", e);
              }
            },

            runSecondlyTimer: function () {
              try {
                this.calculateCostsForNextMCV();

                var self = this;
                setTimeout(function () {
                  self.runSecondlyTimer();
                }, 1000);
              } catch (e) {
                console.log("MaelstromTools.runSecondlyTimer: ", e);
              }
            },

            runMainTimer: function () {
              try {
                this.checkForPackages();
                this.checkRepairAllUnits();
                this.checkRepairAllBuildings();

                var missionTracker = typeof (qx.core.Init.getApplication().getMissionsBar) === 'function' ? qx.core.Init.getApplication().getMissionsBar() : qx.core.Init.getApplication().getMissionTracker(); //fix for PerforceChangelist>=376877
                if (MT_Preferences.Settings.autoHideMissionTracker) {
                  if (missionTracker.isVisible()) {
                    missionTracker.hide();
                  }
                  if (typeof (qx.core.Init.getApplication().getMissionsBar) === 'function') {
                    if (qx.core.Init.getApplication().getMissionsBar().getSizeHint().height != 0) {
                      qx.core.Init.getApplication().getMissionsBar().getSizeHint().height = 0;
                      qx.core.Init.getApplication().triggerDesktopResize();
                    }
                  }
                } else {
                  if (!missionTracker.isVisible()) {
                    missionTracker.show();
                    if (typeof (qx.core.Init.getApplication().getMissionsBar) === 'function') {
                      qx.core.Init.getApplication().getMissionsBar().initHeight();
                      qx.core.Init.getApplication().triggerDesktopResize();
                    }
                  }
                }

                var self = this;
                setTimeout(function () {
                  self.runMainTimer();
                }, this.mainTimerInterval);
              } catch (e) {
                console.log("MaelstromTools.runMainTimer: ", e);
              }
            },

            runAutoCollectTimer: function () {
              try {
                //console.log("runAutoCollectTimer ", MT_Preferences.Settings.AutoCollectTimer);
                if (!CCTAWrapperIsInstalled()) return; // run timer only then wrapper is running
                if (this.checkForPackages() && MT_Preferences.Settings.autoCollectPackages) {
                  this.collectAllPackages();
                }
                if (this.checkRepairAllUnits() && MT_Preferences.Settings.autoRepairUnits) {
                  this.repairAllUnits();
                }
                if (this.checkRepairAllBuildings() && MT_Preferences.Settings.autoRepairBuildings) {
                  this.repairAllBuildings();
                }

                var self = this;
                setTimeout(function () {
                  self.runAutoCollectTimer();
                }, MT_Preferences.Settings.AutoCollectTimer * 60000);
              } catch (e) {
                console.log("MaelstromTools.runMainTimer: ", e);
              }
            },

            openWindow: function (windowObj, windowName, skipMoveWindow) {
              try {
                if (!windowObj.isVisible()) {
                  if (windowName == "MainMenu") {
                    windowObj.show();
                  } else {
                    if (!skipMoveWindow) {
                      this.moveWindow(windowObj, windowName);
                    }
                    windowObj.open();
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.openWindow: ", e);
              }
            },

            moveWindow: function (windowObj, windowName) {
              try {
                var x = this.mWindows[windowName]["x"];
                var y = this.mWindows[windowName]["y"];
                if (this.mWindows[windowName]["Align"] == "R") {
                  x = qx.bom.Viewport.getWidth(window) - this.mWindows[windowName]["x"];
                }
                if (this.mWindows[windowName]["AlignV"] == "B") {
                  y = qx.bom.Viewport.getHeight(window) - this.mWindows[windowName]["y"] - windowObj.height;
                }
                windowObj.moveTo(x, y);
                if (windowName != "MainMenu") {
                  windowObj.setHeight(this.mWindows[windowName]["h"]);
                  windowObj.setWidth(this.mWindows[windowName]["w"]);
                }
              } catch (e) {
                console.log("MaelstromTools.moveWindow: ", e);
              }
            },

            checkForPackages: function () {
              try {
                MT_Cache.updateCityCache();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (ncity.get_CityBuildingsData().get_HasCollectableBuildings() && !ncity.get_IsGhostMode()) {
                    this.addToMainMenu("CollectAllResources", this.buttonCollectAllResources);
                    return true;
                  }
                }
                this.removeFromMainMenu("CollectAllResources");
                return false;
              } catch (e) {
                console.log("MaelstromTools.checkForPackages: ", e);
                return false;
              }
            },

            collectAllPackages: function () {
              try {
                MT_Cache.updateCityCache();
                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (ncity.get_CityBuildingsData().get_HasCollectableBuildings()) {
                    ncity.CollectAllResources();
                  }
                }
                this.removeFromMainMenu("CollectAllResources");
              } catch (e) {
                console.log("MaelstromTools.collectAllPackages: ", e);
              }
            },

            checkRepairAll: function (visMode, buttonName, button) {
              try {
                MT_Cache.updateCityCache();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (!ncity.get_IsGhostMode() && ncity.get_CityRepairData().CanRepairAll(visMode)) {
                    this.addToMainMenu(buttonName, button);
                    return true;
                  }
                }

                this.removeFromMainMenu(buttonName);
                return false;
              } catch (e) {
                console.log("MaelstromTools.checkRepairAll: ", e);
                return false;
              }
            },

            checkRepairAllUnits: function () {
              return this.checkRepairAll(ClientLib.Vis.Mode.ArmySetup, "RepairAllUnits", this.buttonRepairAllUnits);
            },

            checkRepairAllBuildings: function () {
              return this.checkRepairAll(ClientLib.Vis.Mode.City, "RepairAllBuildings", this.buttonRepairAllBuildings);
            },

            repairAll: function (visMode, buttonName) {
              try {
                MT_Cache.updateCityCache();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (!ncity.get_IsGhostMode() && ncity.get_CityRepairData().CanRepairAll(visMode)) {
                    ncity.get_CityRepairData().RepairAll(visMode);
                  }

                }
                this.removeFromMainMenu(buttonName);
              } catch (e) {
                console.log("MaelstromTools.repairAll: ", e);
              }
            },

            //ClientLib.Data.City.prototype.get_CityRepairData
            //ClientLib.Data.CityRepair.prototype.CanRepairAll
            //ClientLib.Data.CityRepair.prototype.RepairAll
            repairAllUnits: function () {
              try {
                this.repairAll(ClientLib.Vis.Mode.ArmySetup, "RepairAllUnits");
              } catch (e) {
                console.log("MaelstromTools.repairAllUnits: ", e);
              }
            },

            repairAllBuildings: function () {
              try {
                this.repairAll(ClientLib.Vis.Mode.City, "RepairAllBuildings");
              } catch (e) {
                console.log("MaelstromTools.repairAllBuildings: ", e);
              }
            },

            updateLoot: function (ident, visCity, widget) {
              try {
                clearInterval(this.lootStatusInfoInterval);
                if (!MT_Preferences.Settings.showLoot) {
                  if (this.lootWidget[ident]) {
                    this.lootWidget[ident].removeAll();
                  }
                  return;
                }

                var baseLoadState = MT_Cache.updateLoot(visCity);
                if (baseLoadState == -2) { // base already cached and base not changed
                  return;
                }

                if (!this.lootWidget) {
                  this.lootWidget = {};
                }
                if (!this.lootWidget[ident]) {
                  this.lootWidget[ident] = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
                  this.lootWidget[ident].setTextColor("white");
                  widget.add(this.lootWidget[ident]);
                }
                var lootWidget = this.lootWidget[ident];

                var rowIdx = 1;
                var colIdx = 1;
                lootWidget.removeAll();
                switch (baseLoadState) {
                  case -1:
                    {
                      MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, "Target out of range, no resource calculation possible", null, null, 'bold', null);
                      break;
                    }
                  case 1:
                    {
                      var Resources = MT_Cache.SelectedBaseResources;
                      this.createResourceLabels(lootWidget, ++rowIdx, "Possible attacks from this base (available CP)", Resources, - 1);
                      this.createResourceLabels(lootWidget, ++rowIdx, "Lootable resources", Resources, 1);
                      this.createResourceLabels(lootWidget, ++rowIdx, "per CP", Resources, 1 * Resources.CPNeeded);
                      this.createResourceLabels(lootWidget, ++rowIdx, "2nd run", Resources, 2 * Resources.CPNeeded);
                      this.createResourceLabels(lootWidget, ++rowIdx, "3rd run", Resources, 3 * Resources.CPNeeded);
                      break;
                    }
                  default:
                    {
                      MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, "Calculating resources...", null, null, 'bold', null);
                      this.lootStatusInfoInterval = setInterval(function () {
                        MaelstromTools.Base.getInstance().updateLoot(ident, visCity, widget);
                      }, 100);
                      break;
                    }
                }
              } catch (e) {
                console.log("MaelstromTools.updateLoot: ", e);
              }
            },

            createResourceLabels: function (lootWidget, rowIdx, Label, Resources, Modifier) {
              var colIdx = 1;
              var font = (Modifier > 1 ? null : 'bold');

              if (Modifier == -1 && Resources.CPNeeded > 0) {
                Label = Lang.gt(Label) + ": " + Math.floor(ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() / Resources.CPNeeded);
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, Label, null, 'left', font, null, 9);
                return;
              }
              colIdx = 1;
              if (Modifier > 0) {
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, Lang.gt(Label) + ":", null, null, font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Research));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Research] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Tiberium));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Tiberium] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Crystal));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Crystal] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage(MaelstromTools.Statics.Dollar));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources[MaelstromTools.Statics.Dollar] / Modifier), 50, 'right', font);
                MaelstromTools.Util.addImage(lootWidget, rowIdx, colIdx++, MaelstromTools.Util.getImage("Sum"));
                MaelstromTools.Util.addLabel(lootWidget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Resources["Total"] / Modifier), 50, 'right', font);
              }
            },

            mcvPopup: null,
            mcvPopupX : 0,
            mcvPopupY : 0,
            mcvTimerLabel: null,
            mcvCreditProcentageLabel: null,
			mcvResearchTimerLabel: null,
              calculateCostsForNextMCV: function () {
              try {
                if (!MT_Preferences.Settings.showCostsForNextMCV) {
                  if (this.mcvPopup) {
                    this.mcvPopup.close();
                  }
                  return;
                }
                var player = ClientLib.Data.MainData.GetInstance().get_Player();
                var cw = player.get_Faction();
                var cj = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, cw);
                var cr = player.get_PlayerResearch();
                var cd = cr.GetResearchItemFomMdbId(cj);
                if (cd == null) {
                  if (this.mcvPopup) {
                    this.mcvPopup.close();
                  }
                  return;
                }

                if (!this.mcvPopup) {
                  this.mcvPopup = new qx.ui.window.Window("").set({
                    contentPadding : 0,
                    showMinimize : false,
                    showMaximize : false,
                    showClose : false,
                    resizable : false
                  });
                  this.mcvPopup.setLayout(new qx.ui.layout.VBox());
                  this.mcvPopup.addListener("move", function (e) {
                    var base = MaelstromTools.Base.getInstance();
                    var size = qx.core.Init.getApplication().getRoot().getBounds();
                    var value = size.width - e.getData().left;
                    base.mcvPopupX = value < 0 ? 150 : value;
                    value = size.height - e.getData().top;
                    base.mcvPopupY = value < 0 ? 70 : value;
                    MaelstromTools.LocalStorage.set("mcvPopup", {
                      x : base.mcvPopupX,
                      y : base.mcvPopupY
                    });
                  });
                  var font1 = qx.bom.Font.fromString('bold').set({
                    size: 15
                  });
                  var font2 = qx.bom.Font.fromString('bold').set({
                    size: 14
                  });
                  var font3 = qx.bom.Font.fromString('bold').set({
                    size: 14
                  });

                  this.mcvTimerLabel = new qx.ui.basic.Label().set({
                    font: font1,
                    textColor: 'cyan',
                    width: 155,
                    textAlign: 'center',
                    marginBottom : 5
                  });
                  this.mcvCreditProcentageLabel = new qx.ui.basic.Label().set({
                    font: font2,
                    textColor: 'yellow',
                    width: 155,
                    textAlign: 'center',
                    marginBottom : 5
                  });
                    this.mcvResearchTimerLabel = new qx.ui.basic.Label().set({
                    font: font3,
                    textColor: 'yellow',
                    width: 155,
                    textAlign: 'center',
                    marginBottom : 5
                  });
                    this.mcvPopup.add(this.mcvTimerLabel);
                    this.mcvPopup.add(this.mcvCreditProcentageLabel);
                    this.mcvPopup.add(this.mcvResearchTimerLabel);
                    var serverBar = qx.core.Init.getApplication().getServerBar().getBounds();
                  var pos = MaelstromTools.LocalStorage.get("mcvPopup", {
                      x : serverBar.width + 30,
                      y : 120
                    });
                  this.mcvPopupX = pos.x;
                  this.mcvPopupY = pos.y;
                  this.mcvPopup.open();
                }
                var size = qx.core.Init.getApplication().getRoot().getBounds();
                this.mcvPopup.moveTo(size.width - this.mcvPopupX, size.height - this.mcvPopupY);

                var nextLevelInfo = cd.get_NextLevelInfo_Obj();
                var resourcesNeeded = [];
                for (var i in nextLevelInfo.rr) {
                  if (nextLevelInfo.rr[i].t > 0) {
                    resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
                  }
                }
                var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
                var currentResearchPoints = player.get_ResearchPoints();
					XY = 100 / researchNeeded
					XYX = currentResearchPoints
					PercentageOfResearchPoints = XYX * XY
					//PercentageOfResearchPoints = 150.23

                var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
                var creditsResourceData = player.get_Credits();
                var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                var creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;
                var ZX = 100 / creditsNeeded;
                var ZXZ = player.GetCreditsCount();
                var PercentageOfCredits = ZXZ * ZX
                    //PercentageOfCredits = ZXZ * 1% of ZX

                //if (creditGrowthPerHour == 0 || creditTimeLeftInHours <= 0) {
                //  if (this.mcvPopup) {
                //    this.mcvPopup.close();
                //  }
                //  return;
                //}

                this.mcvPopup.setCaption(Lang.gt("Next MCV") + " ($ " + MaelstromTools.Wrapper.FormatNumbersCompact(creditsNeeded) + ")");
                  if (creditTimeLeftInHours > 0) {
					this.mcvTimerLabel.setValue("$-timer : " + MaelstromTools.Wrapper.FormatTimespan(creditTimeLeftInHours * 60 * 60));
				} else {
					this.mcvTimerLabel.setValue("");
				}
                  if (PercentageOfCredits >= 100) {
                  this.mcvCreditProcentageLabel.setValue("Credits READY");
                }
                  if (PercentageOfCredits < 100) {
                  this.mcvCreditProcentageLabel.setValue("Credits @ " + (PercentageOfCredits).toFixed(2) + "%");
                }
                  if (PercentageOfResearchPoints >= 100) {
                  this.mcvResearchTimerLabel.setValue("Res.Points READY");
                }
                  if (PercentageOfResearchPoints < 100) {
                  this.mcvResearchTimerLabel.setValue("Res.Points @ " + (PercentageOfResearchPoints).toFixed(2) + "%");
                }

                if (!this.mcvPopup.isVisible()) {
                  this.mcvPopup.open();
                }
              } catch (e) {
                console.log("calculateCostsForNextMCV", e);
              }
            }
          }
        });

        // define Preferences
        qx.Class.define("MaelstromTools.Preferences", {
          type: "singleton",
          extend: qx.core.Object,

          statics: {
            USEDEDICATEDMAINMENU: "useDedicatedMainMenu",
            AUTOCOLLECTPACKAGES: "autoCollectPackages",
            AUTOREPAIRUNITS: "autoRepairUnits",
            AUTOREPAIRBUILDINGS: "autoRepairBuildings",
            AUTOHIDEMISSIONTRACKER: "autoHideMissionTracker",
            AUTOCOLLECTTIMER: "AutoCollectTimer",
            SHOWLOOT: "showLoot",
            SHOWCOSTSFORNEXTMCV: "showCostsForNextMCV",
            CHATHISTORYLENGTH: "ChatHistoryLength"
          },

          members: {
            Window: null,
            Widget: null,
            Settings: null,
            FormElements: null,

            readOptions: function () {
              try {
                if (!this.Settings) {
                  this.Settings = {};
                }

                /*
                if(MaelstromTools.LocalStorage.get("useDedicatedMainMenu") == null) {
                  if(qx.bom.Viewport.getWidth(window) > 1800) {
                    this.Settings["useDedicatedMainMenu"] = false;
                  }
                } else {
                  this.Settings["useDedicatedMainMenu"] = (MaelstromTools.LocalStorage.get("useDedicatedMainMenu", 1) == 1);
                }*/
                this.Settings[MaelstromTools.Preferences.USEDEDICATEDMAINMENU] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.USEDEDICATEDMAINMENU, 1) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOCOLLECTPACKAGES] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTPACKAGES, 1) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOREPAIRUNITS, 0) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOREPAIRBUILDINGS, 1) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER, 0) == 1);
                this.Settings[MaelstromTools.Preferences.AUTOCOLLECTTIMER] = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTTIMER, 5);
                this.Settings[MaelstromTools.Preferences.SHOWLOOT] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.SHOWLOOT, 1) == 1);
                this.Settings[MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV] = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV, 0) == 1);
                this.Settings[MaelstromTools.Preferences.CHATHISTORYLENGTH] = MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.CHATHISTORYLENGTH, 512);

                if (!CCTAWrapperIsInstalled()) {
                  this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] = false;
                  this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] = false;
                  //this.Settings[MaelstromTools.Preferences.SHOWLOOT] = false;
                }
                //console.log(this.Settings);

              } catch (e) {
                console.log("MaelstromTools.Preferences.readOptions: ", e);
              }
            },

            openWindow: function (WindowName, WindowTitle) {
              try {
                if (!this.Window) {
                  //this.Window = new qx.ui.window.Window(WindowTitle).set({
                  this.Window = new webfrontend.gui.OverlayWindow().set({
                    autoHide: false,
                    title: WindowTitle,
                    minHeight: 350

                    //resizable: false,
                    //showMaximize:false,
                    //showMinimize:false,
                    //allowMaximize:false,
                    //allowMinimize:false,
                    //showStatusbar: false
                  });
                  this.Window.clientArea.setPadding(10);
                  this.Window.clientArea.setLayout(new qx.ui.layout.VBox(3));

                  this.Widget = new qx.ui.container.Composite(new qx.ui.layout.Grid().set({
                    spacingX: 5,
                    spacingY: 5
                  }));

                  //this.Widget.setTextColor("white");

                  this.Window.clientArea.add(this.Widget);
                }

                if (this.Window.isVisible()) {
                  this.Window.close();
                } else {
                  MT_Base.openWindow(this.Window, WindowName);
                  this.setWidgetLabels();
                }
              } catch (e) {
                console.log("MaelstromTools.Preferences.openWindow: ", e);
              }
            },

            addFormElement: function (name, element) {
              this.FormElements[name] = element;
            },

            setWidgetLabels: function () {
              try {
                this.readOptions();

                this.FormElements = {};
                this.Widget.removeAll();
                var rowIdx = 1;
                var colIdx = 1;

                var chkAutoHideMissionTracker = new qx.ui.form.CheckBox(Lang.gt("Hide Mission Tracker")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER] == 1
                });
                var chkUseDedicatedMainMenu = new qx.ui.form.CheckBox(Lang.gt("Use dedicated Main Menu (restart required)")).set({
                  value: this.Settings[MaelstromTools.Preferences.USEDEDICATEDMAINMENU] == 1
                });
                var chkShowLoot = new qx.ui.form.CheckBox(Lang.gt("Show lootable resources (restart required)")).set({
                  value: this.Settings[MaelstromTools.Preferences.SHOWLOOT] == 1/*,
                  enabled: CCTAWrapperIsInstalled()*/
                });
                var chkCostsNextMCV = new qx.ui.form.CheckBox(Lang.gt("Show time to next MCV")).set({
                  value: this.Settings[MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV] == 1
                });
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoHideMissionTracker, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkUseDedicatedMainMenu, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkShowLoot, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkCostsNextMCV, 2);

                var chkAutoCollectPackages = new qx.ui.form.CheckBox(Lang.gt("Autocollect packages")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOCOLLECTPACKAGES] == 1
                });
                var chkAutoRepairUnits = new qx.ui.form.CheckBox(Lang.gt("Autorepair units")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOREPAIRUNITS] == 1,
                  enabled: CCTAWrapperIsInstalled()
                });
                var chkAutoRepairBuildings = new qx.ui.form.CheckBox(Lang.gt("Autorepair buildings")).set({
                  value: this.Settings[MaelstromTools.Preferences.AUTOREPAIRBUILDINGS] == 1,
                  enabled: CCTAWrapperIsInstalled()
                });

                var spinnerChatHistoryLength = new qx.ui.form.Spinner().set({
                  minimum: 64,
                  maximum: 512,
                  value: this.Settings[MaelstromTools.Preferences.CHATHISTORYLENGTH]
                });

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, Lang.gt("Chat history length") + " (" + spinnerChatHistoryLength.getMinimum() + " - " + spinnerChatHistoryLength.getMaximum() + ")");
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx + 1, spinnerChatHistoryLength);

                var spinnerAutoCollectTimer = new qx.ui.form.Spinner().set({
                  minimum: 5,
                  maximum: 60 * 6,
                  value: this.Settings[MaelstromTools.Preferences.AUTOCOLLECTTIMER]
                });

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, Lang.gt("Automatic interval in minutes") + " (" + spinnerAutoCollectTimer.getMinimum() + " - " + spinnerAutoCollectTimer.getMaximum() + ")");
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx + 1, spinnerAutoCollectTimer);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoCollectPackages, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoRepairUnits, 2);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, chkAutoRepairBuildings, 2);

                var applyButton = new qx.ui.form.Button(Lang.gt("Apply changes")).set({
                  appearance: "button-addpoints",
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120
                });
                applyButton.addListener("execute", this.applyChanges, this);

                var cancelButton = new qx.ui.form.Button(Lang.gt("Discard changes")).set({
                  appearance: "button-addpoints",
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120
                });
                cancelButton.addListener("execute", function () {
                  this.Window.close();
                }, this);

                var resetButton = new qx.ui.form.Button(Lang.gt("Reset to default")).set({
                  appearance: "button-addpoints",
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120
                });
                resetButton.addListener("execute", this.resetToDefault, this);

                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, resetButton);
                colIdx = 1;
                MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, cancelButton);
                MaelstromTools.Util.addElement(this.Widget, rowIdx++, colIdx, applyButton);

                this.addFormElement(MaelstromTools.Preferences.AUTOHIDEMISSIONTRACKER, chkAutoHideMissionTracker);
                this.addFormElement(MaelstromTools.Preferences.USEDEDICATEDMAINMENU, chkUseDedicatedMainMenu);
                this.addFormElement(MaelstromTools.Preferences.SHOWLOOT, chkShowLoot);
                this.addFormElement(MaelstromTools.Preferences.SHOWCOSTSFORNEXTMCV, chkCostsNextMCV);
                this.addFormElement(MaelstromTools.Preferences.AUTOCOLLECTPACKAGES, chkAutoCollectPackages);
                this.addFormElement(MaelstromTools.Preferences.AUTOREPAIRUNITS, chkAutoRepairUnits);
                this.addFormElement(MaelstromTools.Preferences.AUTOREPAIRBUILDINGS, chkAutoRepairBuildings);
                this.addFormElement(MaelstromTools.Preferences.AUTOCOLLECTTIMER, spinnerAutoCollectTimer);
                this.addFormElement(MaelstromTools.Preferences.CHATHISTORYLENGTH, spinnerChatHistoryLength);
              } catch (e) {
                console.log("MaelstromTools.Preferences.setWidgetLabels: ", e);
              }
            },

            applyChanges: function () {
              try {
                var autoRunNeeded = false;
                for (var idx in this.FormElements) {
                  var element = this.FormElements[idx];
                  if (idx == MaelstromTools.Preferences.AUTOCOLLECTTIMER) {
                    autoRunNeeded = (MaelstromTools.LocalStorage.get(MaelstromTools.Preferences.AUTOCOLLECTTIMER, 0) != element.getValue());
                  }
                  if (idx == MaelstromTools.Preferences.CHATHISTORYLENGTH) {
                    webfrontend.gui.chat.ChatWidget.recvbufsize = element.getValue();
                  }
                  MaelstromTools.LocalStorage.set(idx, element.getValue());
                }
                this.readOptions();
                if (autoRunNeeded) {
                  MT_Base.runAutoCollectTimer();
                }
                this.Window.close();
              } catch (e) {
                console.log("MaelstromTools.Preferences.applyChanges: ", e);
              }
            },

            resetToDefault: function () {
              try {
                MaelstromTools.LocalStorage.clearAll();
                this.setWidgetLabels();
              } catch (e) {
                console.log("MaelstromTools.Preferences.resetToDefault: ", e);
              }
            }
          }
        });

        // define DefaultObject
        qx.Class.define("MaelstromTools.DefaultObject", {
          type: "abstract",
          extend: qx.core.Object,
          members: {
            Window: null,
            Widget: null,
            Cache: {}, //k null
            IsTimerEnabled: true,

            calc: function () {
              try {
                if (this.Window.isVisible()) {
                  this.updateCache();
                  this.setWidgetLabels();
                  if (this.IsTimerEnabled) {
                    var self = this;
                    setTimeout(function () {
                      self.calc();
                    }, MT_Base.timerInterval);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.DefaultObject.calc: ", e);
              }
            },

            openWindow: function (WindowName, WindowTitle) {
              try {
                if (!this.Window) {
                  this.Window = new qx.ui.window.Window(WindowTitle).set({
                    resizable: false,
                    showMaximize: false,
                    showMinimize: false,
                    allowMaximize: false,
                    allowMinimize: false,
                    showStatusbar: false
                  });
                  this.Window.setPadding(10);
                  this.Window.setLayout(new qx.ui.layout.VBox(3));

                  this.Widget = new qx.ui.container.Composite(new qx.ui.layout.Grid());
                  this.Widget.setTextColor("white");

                  this.Window.add(this.Widget);
                }

                if (this.Window.isVisible()) {
                  this.Window.close();
                } else {
                  MT_Base.openWindow(this.Window, WindowName);
                  this.calc();
                }
              } catch (e) {
                console.log("MaelstromTools.DefaultObject.openWindow: ", e);
              }
            }
          }
        });

        // define Production
        qx.Class.define("MaelstromTools.Production", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            updateCache: function (onlyForCity) {
              try {
                MT_Cache.updateCityCache();
                var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                //this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  if (onlyForCity != null && onlyForCity != cname) {
                    continue;
                  }
                  var ncity = MT_Cache.Cities[cname].Object;
                  if (typeof (this.Cache[cname]) !== 'object') this.Cache[cname] = {};
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Tiberium]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Tiberium] = {}; // all have to be checked,
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Crystal]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Crystal] = {}; // this.Cache[cname] can be created inside different namespaces
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Power]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Power] = {}; // like the RepairTime etc... without those objs
                  if (typeof (this.Cache[cname][MaelstromTools.Statics.Dollar]) !== 'object') this.Cache[cname][MaelstromTools.Statics.Dollar] = {};

                  this.Cache[cname]["ProductionStopped"] = ncity.get_IsGhostMode();
                  this.Cache[cname]["PackagesStopped"] = (ncity.get_hasCooldown() || ncity.get_IsGhostMode());
                  this.Cache[cname][MaelstromTools.Statics.Tiberium]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false); // (production.d[ClientLib.Base.EResourceType.Tiberium]['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Tiberium]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium); //(production.d[ClientLib.Base.EResourceType.Tiberium]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Tiberium]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
                  this.Cache[cname][MaelstromTools.Statics.Crystal]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false); //(production.d[ClientLib.Base.EResourceType.Crystal]['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Crystal]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal); //(production.d[ClientLib.Base.EResourceType.Crystal]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Crystal]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
                  this.Cache[cname][MaelstromTools.Statics.Power]["Delta"] = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false); //(production.d[ClientLib.Base.EResourceType.Power]['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Power]["ExtraBonusDelta"] = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power); // (production.d[ClientLib.Base.EResourceType.Power]['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Power]["POI"] = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
                  this.Cache[cname][MaelstromTools.Statics.Dollar]["Delta"] = ClientLib.Base.Resource.GetResourceGrowPerHour(ncity.get_CityCreditsProduction(), false); // (ncity.get_CityCreditsProduction()['Delta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Dollar]["ExtraBonusDelta"] = ClientLib.Base.Resource.GetResourceBonusGrowPerHour(ncity.get_CityCreditsProduction(), false); // (ncity.get_CityCreditsProduction()['ExtraBonusDelta'] * serverTime.get_StepsPerHour());
                  this.Cache[cname][MaelstromTools.Statics.Dollar]["POI"] = 0;
                  this.Cache[cname]["BaseLevel"] = MaelstromTools.Wrapper.GetBaseLevel(ncity);
                  if (onlyForCity != null && onlyForCity == cname) return this.Cache[cname];
                }
              } catch (e) {
                console.log("MaelstromTools.Production.updateCache: ", e);
              }
            },

            createProductionLabels2: function (rowIdx, colIdx, cityName, resourceType) {
              try {
                if (cityName == "-Total-") {
                  var Totals = Object();
                  Totals["Delta"] = 0;
                  Totals["ExtraBonusDelta"] = 0;
                  Totals["POI"] = 0;
                  Totals["Total"] = 0;

                  for (var cname in this.Cache) {
                    Totals["Delta"] += this.Cache[cname][resourceType]['Delta'];
                    Totals["ExtraBonusDelta"] += this.Cache[cname][resourceType]['ExtraBonusDelta'];
                    Totals["POI"] += this.Cache[cname][resourceType]['POI'];
                  }
                  Totals["Total"] = Totals['Delta'] + Totals['ExtraBonusDelta'] + Totals['POI'];

                  rowIdx++;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['Delta']), 80, 'right', 'bold');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['ExtraBonusDelta']), 80, 'right', 'bold');
                  if (resourceType != MaelstromTools.Statics.Dollar) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['POI']), 80, 'right', 'bold');
                  } else {
                    rowIdx++;
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(Totals['Total']), 80, 'right', 'bold');
                } else if (cityName == "-Labels-") {
                  MaelstromTools.Util.addImage(this.Widget, rowIdx++, colIdx, MaelstromTools.Util.getImage(resourceType));
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Continuous", 100, 'left');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Bonus", 100, 'left');
                  if (resourceType != MaelstromTools.Statics.Dollar) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "POI", 100, 'left');
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Total / BaseLevel", 100, 'left');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, "Total / h", 100, 'left');
                } else {
                  var cityCache = this.Cache[cityName];
                  if (rowIdx > 2) {
                    rowIdx++;
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['Delta']), 80, 'right', null, ((cityCache["ProductionStopped"] || cityCache[resourceType]['Delta'] == 0) ? "red" : "white"));
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['ExtraBonusDelta']), 80, 'right', null, ((cityCache["PackagesStopped"] || cityCache[resourceType]['ExtraBonusDelta'] == 0) ? "red" : "white"));
                  if (resourceType != MaelstromTools.Statics.Dollar) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['POI']), 80, 'right', null, (cityCache[resourceType]['POI'] == 0 ? "red" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact((cityCache[resourceType]['Delta'] + cityCache[resourceType]['ExtraBonusDelta'] + cityCache[resourceType]['POI']) / cityCache["BaseLevel"]), 80, 'right');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[resourceType]['Delta'] + cityCache[resourceType]['ExtraBonusDelta'] + cityCache[resourceType]['POI']), 80, 'right', 'bold');
                }
                return rowIdx;
              } catch (e) {
                console.log("MaelstromTools.Production.createProductionLabels2: ", e);
              }
            },

            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();

                var rowIdx = 1;
                var colIdx = 1;

                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Tiberium);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Crystal);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Power);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Labels-", MaelstromTools.Statics.Dollar);

                colIdx++;
                for (var cityName in this.Cache) {
                  rowIdx = 1;
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx, cityName, 80, 'right');

                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Tiberium);
                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Crystal);
                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Power);
                  rowIdx = this.createProductionLabels2(rowIdx, colIdx, cityName, MaelstromTools.Statics.Dollar);

                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                }

                rowIdx = 1;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Total / h", 80, 'right', 'bold');

                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Tiberium);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Crystal);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Power);
                rowIdx = this.createProductionLabels2(rowIdx, colIdx, "-Total-", MaelstromTools.Statics.Dollar);
              } catch (e) {
                console.log("MaelstromTools.Production.setWidgetLabels: ", e);
              }
            }
          }
        });

        // define RepairTime
        qx.Class.define("MaelstromTools.RepairTime", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {

            updateCache: function () {
              try {
                MT_Cache.updateCityCache();
                this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  var RepLargest = '';

                  this.Cache[cname] = Object();
                  this.Cache[cname]["RepairTime"] = Object();
                  this.Cache[cname]["Repaircharge"] = Object();
                  this.Cache[cname]["Repaircharge"]["Smallest"] = 999999999;
                  this.Cache[cname]["RepairTime"]["Largest"] = 0;

                  this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
                  this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
                  this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft] = ncity.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
                  this.Cache[cname]["RepairTime"]["Maximum"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf);
                  this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);
                  this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh);
                  this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft] = ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);

                  if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Infantry];
                  }
                  if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Vehicle];
                  }
                  if (this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft] < this.Cache[cname]["Repaircharge"]["Smallest"]) {
                    this.Cache[cname]["Repaircharge"]["Smallest"] = this.Cache[cname]["Repaircharge"][MaelstromTools.Statics.Aircraft];
                  }

                  if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry] > this.Cache[cname]["RepairTime"]["Largest"]) {
                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Infantry];
                    RepLargest = "Infantry";
                  }
                  if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle] > this.Cache[cname]["RepairTime"]["Largest"]) {
                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Vehicle];
                    RepLargest = "Vehicle";
                  }
                  if (this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft] > this.Cache[cname]["RepairTime"]["Largest"]) {
                    this.Cache[cname]["RepairTime"]["Largest"] = this.Cache[cname]["RepairTime"][MaelstromTools.Statics.Aircraft];
                    RepLargest = "Aircraft";
                  }

                  //PossibleAttacks and MaxAttacks fixes
                  var offHealth = ncity.GetOffenseConditionInPercent();
                  if (RepLargest !== '') {
                    this.Cache[cname]["RepairTime"]["LargestDiv"] = this.Cache[cname]["RepairTime"][RepLargest];
                    var i = Math.ceil(this.Cache[cname]["Repaircharge"].Smallest / this.Cache[cname]["RepairTime"].LargestDiv); //fix
                    var j = this.Cache[cname]["Repaircharge"].Smallest / this.Cache[cname]["RepairTime"].LargestDiv;
                    if (offHealth !== 100) { i--; i += '*';} // Decrease number of attacks by 1 when unit unhealthy. Additional visual info: asterisk when units aren't healthy
                    this.Cache[cname]["RepairTime"]["PossibleAttacks"] = i;
                    var k = this.Cache[cname]["RepairTime"].Maximum / this.Cache[cname]["RepairTime"].LargestDiv;
                    this.Cache[cname]["RepairTime"]["MaxAttacks"] = Math.ceil(k); //fix
                  } else {
                    this.Cache[cname]["RepairTime"]["LargestDiv"] = 0;
                    this.Cache[cname]["RepairTime"]["PossibleAttacks"] = 0;
                    this.Cache[cname]["RepairTime"]["MaxAttacks"] = 0;
                  }

                  var unitsData = ncity.get_CityUnitsData();
                  this.Cache[cname]["Base"] = Object();
                  this.Cache[cname]["Base"]["Level"] = MaelstromTools.Wrapper.GetBaseLevel(ncity);
                  this.Cache[cname]["Base"]["UnitLimit"] = ncity.GetBuildingSlotLimit(); //ncity.GetNumBuildings();
                  this.Cache[cname]["Base"]["TotalHeadCount"] = ncity.GetBuildingSlotCount();
                  this.Cache[cname]["Base"]["FreeHeadCount"] = this.Cache[cname]["Base"]["UnitLimit"] - this.Cache[cname]["Base"]["TotalHeadCount"];
                  this.Cache[cname]["Base"]["HealthInPercent"] = ncity.GetBuildingsConditionInPercent();

                  this.Cache[cname]["Offense"] = Object();
                  this.Cache[cname]["Offense"]["Level"] = (Math.floor(ncity.get_LvlOffense() * 100) / 100).toFixed(2);
                  this.Cache[cname]["Offense"]["UnitLimit"] = unitsData.get_UnitLimitOffense();
                  this.Cache[cname]["Offense"]["TotalHeadCount"] = unitsData.get_TotalOffenseHeadCount();
                  this.Cache[cname]["Offense"]["FreeHeadCount"] = unitsData.get_FreeOffenseHeadCount();
                  this.Cache[cname]["Offense"]["HealthInPercent"] = offHealth > 0 ? offHealth : 0;

                  this.Cache[cname]["Defense"] = Object();
                  this.Cache[cname]["Defense"]["Level"] = (Math.floor(ncity.get_LvlDefense() * 100) / 100).toFixed(2);
                  this.Cache[cname]["Defense"]["UnitLimit"] = unitsData.get_UnitLimitDefense();
                  this.Cache[cname]["Defense"]["TotalHeadCount"] = unitsData.get_TotalDefenseHeadCount();
                  this.Cache[cname]["Defense"]["FreeHeadCount"] = unitsData.get_FreeDefenseHeadCount();
                  this.Cache[cname]["Defense"]["HealthInPercent"] = ncity.GetDefenseConditionInPercent() > 0 ? ncity.GetDefenseConditionInPercent() : 0;

                  //console.log(ncity.get_CityUnitsData().get_UnitLimitOffense() + " / " + ncity.get_CityUnitsData().get_TotalOffenseHeadCount() + " = " + ncity.get_CityUnitsData().get_FreeOffenseHeadCount());
                  //console.log(ncity.get_CityUnitsData().get_UnitLimitDefense() + " / " + ncity.get_CityUnitsData().get_TotalDefenseHeadCount() + " = " + ncity.get_CityUnitsData().get_FreeDefenseHeadCount());
                }
              } catch (e) {
                console.log("MaelstromTools.RepairTime.updateCache: ", e);
              }
            },

            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();
                var rowIdx = 1;

                rowIdx = this.createOverviewLabels(rowIdx);
                rowIdx = this.createRepairchargeLabels(rowIdx);
              } catch (e) {
                console.log("MaelstromTools.RepairTime.setWidgetLabels: ", e);
              }
            },

            createRepairchargeLabels: function (rowIdx) {
              try {
                var colIdx = 2;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx++, colIdx++, "Repaircharges", null, 'left', null, null, 3);
                colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Infantry, 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Vehicle, 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Statics.Aircraft, 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Repairtime", 80, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Attacks", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Next at", 80, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Max+1 at", 80, 'right');

                rowIdx++;
                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  if (cityCache.Offense.UnitLimit == 0) {
                    continue;
                  }
                  colIdx = 1;
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 80, 'left');

                  // Skip bases with no armies
                  if (cityCache.Offense.UnitLimit > 0) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Infantry), 60, 'right', null, (cityCache.RepairTime.Infantry == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Vehicle), 60, 'right', null, (cityCache.RepairTime.Vehicle == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.RepairTime.Aircraft), 60, 'right', null, (cityCache.RepairTime.Aircraft == cityCache.RepairTime.LargestDiv ? "yellow" : "white"));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(cityCache.Repaircharge.Smallest), 80, 'right');
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.RepairTime.PossibleAttacks + " / " + cityCache.RepairTime.MaxAttacks, 60, 'right', null, (cityCache.Offense.HealthInPercent !== 100 ? 'red' : null)); // mark red when unhealthy
                    var i = cityCache.RepairTime.LargestDiv * cityCache.RepairTime.PossibleAttacks;
                    var j = cityCache.RepairTime.LargestDiv * cityCache.RepairTime.MaxAttacks;
                    (i>0) ? MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(i), 80, 'right', null, (i > cityCache.RepairTime.Maximum ? "yellow" : "white")) : colIdx++; /// yellow if more than Maximum RT
                    (j>0) ? MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatTimespan(j), 80, 'right') : colIdx++;
                  } else {
                    colIdx += 7;
                  }

                  colIdx += 4;
                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName, PerforceChangelist >= 376877 ? ClientLib.Data.PlayerAreaViewMode.pavmPlayerOffense : webfrontend.gui.PlayArea.PlayArea.modes.EMode_PlayerOffense));
                  rowIdx += 2;
                }

                return rowIdx;
              } catch (e) {
                console.log("MaelstromTools.RepairTime.createRepairchargeLabels: ", e);
              }
            },

            createOverviewLabels: function (rowIdx) {
              try {
                var colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Base", 60, 'right');
                colIdx += 3;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Defense", 60, 'right');
                colIdx += 3;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx, "Army", 60, 'right');

                rowIdx++;
                colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Buildings", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Buildings", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Level", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Units", 60, 'right');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Health", 60, 'right');

                rowIdx++;
                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  colIdx = 1;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 80, 'left');

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.Level, 60, 'right');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.TotalHeadCount + " / " + cityCache.Base.UnitLimit, 60, 'right', null, (cityCache.Base.FreeHeadCount >= 1 ? "red" : "white"));
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Base.HealthInPercent + "%", 60, 'right', null, (cityCache.Base.HealthInPercent < 25 ? "red" : (cityCache.Base.HealthInPercent < 100 ? "yellow" : "white")));

                  if (cityCache.Defense.UnitLimit > 0) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.Level, 60, 'right');
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.TotalHeadCount + " / " + cityCache.Defense.UnitLimit, 60, 'right', null, (cityCache.Defense.FreeHeadCount >= 5 ? "red" : (cityCache.Defense.FreeHeadCount >= 3 ? "yellow" : "white")));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Defense.HealthInPercent + "%", 60, 'right', null, (cityCache.Defense.HealthInPercent < 25 ? "red" : (cityCache.Defense.HealthInPercent < 100 ? "yellow" : "white")));
                  } else {
                    colIdx += 3;
                  }

                  // Skip bases with no armies
                  if (cityCache.Offense.UnitLimit > 0) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.Level, 60, 'right');
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.TotalHeadCount + " / " + cityCache.Offense.UnitLimit, 60, 'right', null, (cityCache.Offense.FreeHeadCount >= 10 ? "red" : (cityCache.Offense.FreeHeadCount >= 5 ? "yellow" : "white")));
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.Offense.HealthInPercent + "%", 60, 'right', null, (cityCache.Offense.HealthInPercent < 25 ? "red" : (cityCache.Offense.HealthInPercent < 100 ? "yellow" : "white")));
                  } else {
                    colIdx += 3;
                  }

                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                  rowIdx += 2;
                }
                return rowIdx;
              } catch (e) {
                console.log("MaelstromTools.RepairTime.createOverviewLabels: ", e);
              }
            }

          }
        });

        // define ResourceOverview
        qx.Class.define("MaelstromTools.ResourceOverview", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            Table: null,
            Model: null,

            updateCache: function () {
              try {
                MT_Cache.updateCityCache();
                this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  var mtime = ClientLib.Data.MainData.GetInstance().get_Time();

                  this.Cache[cname] = Object();
                  this.Cache[cname][MaelstromTools.Statics.Tiberium] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
                  this.Cache[cname][MaelstromTools.Statics.Tiberium + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium);
                  this.Cache[cname][MaelstromTools.Statics.Tiberium + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Tiberium));
                  this.Cache[cname][MaelstromTools.Statics.Crystal] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                  this.Cache[cname][MaelstromTools.Statics.Crystal + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal);
                  this.Cache[cname][MaelstromTools.Statics.Crystal + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Crystal));
                  this.Cache[cname][MaelstromTools.Statics.Power] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
                  this.Cache[cname][MaelstromTools.Statics.Power + "Max"] = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power);
                  this.Cache[cname][MaelstromTools.Statics.Power + "Full"] = mtime.GetJSStepTime(ncity.GetResourceStorageFullStep(ClientLib.Base.EResourceType.Power));
                }

              } catch (e) {
                console.log("MaelstromTools.ResourceOverview.updateCache: ", e);
              }
            },
/*
            setWidgetLabelsTable: function () {
              try {
                if (!this.Table) {
                  this.Widget.setLayout(new qx.ui.layout.HBox());

                  this.Model = new qx.ui.table.model.Simple();
                  this.Model.setColumns(["City", "Tib. Storage", "Tiberium", "Full", "Crystal", "Full", "Power", "Storage", "Full"]);
                  this.Table = new qx.ui.table.Table(this.Model);
                  this.Widget.add(this.Table, {
                    flex: 1
                  });
                }

                var Totals = Object();
                Totals[MaelstromTools.Statics.Tiberium] = 0;
                Totals[MaelstromTools.Statics.Crystal] = 0;
                Totals[MaelstromTools.Statics.Power] = 0;
                Totals[MaelstromTools.Statics.Tiberium + "Max"] = 0;
                Totals[MaelstromTools.Statics.Power + "Max"] = 0;

                var rowData = [];

                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];

                  Totals[MaelstromTools.Statics.Tiberium] += cityCache[MaelstromTools.Statics.Tiberium];
                  Totals[MaelstromTools.Statics.Crystal] += cityCache[MaelstromTools.Statics.Crystal];
                  Totals[MaelstromTools.Statics.Power] += cityCache[MaelstromTools.Statics.Power];
                  Totals[MaelstromTools.Statics.Tiberium + "Max"] += cityCache[MaelstromTools.Statics.Tiberium + 'Max'];
                  Totals[MaelstromTools.Statics.Power + "Max"] += cityCache[MaelstromTools.Statics.Power + 'Max'];

                  rowData.push([
                    cityName,
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium + 'Max']),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium]),
                    MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Tiberium + 'Full']),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Crystal]),
                    MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Crystal + 'Full']),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power]),
                    MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power + 'Max']),
                    MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Power + 'Full'])
                    ]);
                }
                rowData.push([
                  'Total resources',
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium + 'Max']),
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium]),
                  '',
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Crystal]),
                  '',
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power]),
                  MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power + 'Max']),
                  ''
                  ]);

                this.Model.setData(rowData);
              } catch (e) {
                console.log("MaelstromTools.ResourceOverview.setWidgetLabels: ", e);
              }
            },

            */
            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();

                var first = true;
                var rowIdx = 2;
                var Totals = Object();
                var colIdx = 1;
                Totals[MaelstromTools.Statics.Tiberium] = 0;
                Totals[MaelstromTools.Statics.Crystal] = 0;
                Totals[MaelstromTools.Statics.Power] = 0;
                Totals[MaelstromTools.Statics.Tiberium + "Max"] = 0;
                Totals[MaelstromTools.Statics.Power + "Max"] = 0;

                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  Totals[MaelstromTools.Statics.Tiberium] += cityCache[MaelstromTools.Statics.Tiberium];
                  Totals[MaelstromTools.Statics.Crystal] += cityCache[MaelstromTools.Statics.Crystal];
                  Totals[MaelstromTools.Statics.Power] += cityCache[MaelstromTools.Statics.Power];
                  Totals[MaelstromTools.Statics.Tiberium + "Max"] += cityCache[MaelstromTools.Statics.Tiberium + 'Max'];
                  Totals[MaelstromTools.Statics.Power + "Max"] += cityCache[MaelstromTools.Statics.Power + 'Max'];

                  colIdx = 1;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 100, 'left');
                  if (first) {
                    MaelstromTools.Util.addLabel(this.Widget, 1, colIdx, 'Max. storage', 80, 'left');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium + 'Max']), 80, 'right');

                  if (first) {
                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Tiberium));
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Tiberium]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Tiberium] >= cityCache[MaelstromTools.Statics.Tiberium + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Tiberium] >= (0.75 * cityCache[MaelstromTools.Statics.Tiberium + 'Max']) ? "yellow" : "white")));

                  if (cityCache[MaelstromTools.Statics.Tiberium] < cityCache[MaelstromTools.Statics.Tiberium + 'Max']) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Tiberium + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Tiberium] >= (0.75 * cityCache[MaelstromTools.Statics.Tiberium + 'Max']) ? "yellow" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                  }
                  if (first) {
                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Crystal));
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Crystal]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Crystal] >= cityCache[MaelstromTools.Statics.Crystal + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Crystal] >= (0.75 * cityCache[MaelstromTools.Statics.Crystal + 'Max']) ? "yellow" : "white")));

                  if (cityCache[MaelstromTools.Statics.Crystal] < cityCache[MaelstromTools.Statics.Crystal + 'Max']) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Crystal + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Crystal] >= (0.75 * cityCache[MaelstromTools.Statics.Crystal + 'Max']) ? "yellow" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                  }

                  if (first) {
                    MaelstromTools.Util.addImage(this.Widget, 1, colIdx, MaelstromTools.Util.getImage(MaelstromTools.Statics.Power));
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power]), 60, 'right', null, (cityCache[MaelstromTools.Statics.Power] >= cityCache[MaelstromTools.Statics.Power + 'Max'] ? "red" : (cityCache[MaelstromTools.Statics.Power] >= (0.75 * cityCache[MaelstromTools.Statics.Power + 'Max']) ? "yellow" : "white")));

                  if (first) {
                    MaelstromTools.Util.addLabel(this.Widget, 1, colIdx, 'Storage', 80, 'left');
                  }
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(cityCache[MaelstromTools.Statics.Power + 'Max']), 80, 'right');

                  if (cityCache[MaelstromTools.Statics.Power] < cityCache[MaelstromTools.Statics.Power + 'Max']) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetDateTimeString(cityCache[MaelstromTools.Statics.Power + 'Full']), 100, 'right', null, (cityCache[MaelstromTools.Statics.Power] >= (0.75 * cityCache[MaelstromTools.Statics.Power + 'Max']) ? "yellow" : "white"));
                  } else {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Storage full!", 100, 'right', null, "red");
                  }


                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                  rowIdx++;
                  first = false;
                }

                colIdx = 1;
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Total resources", 100, 'left', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium + 'Max']), 80, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Tiberium]), 60, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Tiberium] / Totals[MaelstromTools.Statics.Tiberium + 'Max'] * 100) + '%', 100, 'center', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Crystal]), 60, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Crystal] / Totals[MaelstromTools.Statics.Tiberium + 'Max'] * 100) + '%', 100, 'center', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power]), 60, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.FormatNumbersCompact(Totals[MaelstromTools.Statics.Power + 'Max']), 80, 'right', 'bold');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, Math.round(Totals[MaelstromTools.Statics.Power] / Totals[MaelstromTools.Statics.Power + 'Max'] * 100) + '%', 100, 'center', 'bold');
              } catch (e) {
                console.log("MaelstromTools.ResourceOverview.setWidgetLabels: ", e);
              }
            }
          }
        });

        // define BaseStatus
        qx.Class.define("MaelstromTools.BaseStatus", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            CityMenuButtons: null,

            //City.SetDedicatedSupport
            //City.RecallDedicatedSupport
            //City.get_SupportDedicatedBaseId
            //System.String get_SupportDedicatedBaseName ()
            updateCache: function () {
              try {
                MT_Cache.updateCityCache();
                this.Cache = Object();

                for (var cname in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cname].Object;
                  var player = ClientLib.Data.MainData.GetInstance().get_Player();
                  var supportData = ncity.get_SupportData();
                  //System.String get_PlayerName ()
                  this.Cache[cname] = Object();
                  // Movement lock
                  this.Cache[cname]["HasCooldown"] = ncity.get_hasCooldown();
                  this.Cache[cname]["CooldownEnd"] = Math.max(ncity.get_MoveCooldownEndStep(), ncity.get_MoveRestictionEndStep());
                  this.Cache[cname]["MoveCooldownEnd"] = ncity.get_MoveCooldownEndStep();
                  this.Cache[cname]["MoveLockdownEnd"] = ncity.get_MoveRestictionEndStep();
                  this.Cache[cname]["IsProtected"] = ncity.get_isProtected();
                  this.Cache[cname]["ProtectionEnd"] = ncity.get_ProtectionEndStep();
                  this.Cache[cname]["IsProtected"] = ncity.get_ProtectionEndStep();
                  this.Cache[cname]["IsAlerted"] = ncity.get_isAlerted();

                  // Supportweapon
                  if (supportData == null) {
                    this.Cache[cname]["HasSupportWeapon"] = false;
                  } else {
                    this.Cache[cname]["HasSupportWeapon"] = true;
                    if (ncity.get_SupportDedicatedBaseId() > 0) {
                      this.Cache[cname]["SupportedCityId"] = ncity.get_SupportDedicatedBaseId();
                      this.Cache[cname]["SupportedCityName"] = ncity.get_SupportDedicatedBaseName();
                      var coordId = ncity.get_SupportDedicatedBaseCoordId();
                      this.Cache[cname]["SupportedCityX"] = (coordId & 0xffff);
                      this.Cache[cname]["SupportedCityY"] = ((coordId >> 0x10) & 0xffff);
                      /*
                      var cityX = ncity.get_PosX();
                      var cityY = ncity.get_PosY();

                      var mainData = ClientLib.Data.MainData.GetInstance();
                      var visRegion = ClientLib.Vis.VisMain.GetInstance().get_Region();

                      var gridW = visRegion.get_GridWidth();
                      var gridH = visRegion.get_GridHeight();
                      //console.log(cname);
                      //console.log("x: " + cityX + " y: " + cityY);

                      var worldObj = visRegion.GetObjectFromPosition((this.Cache[cname]["SupportedCityX"]*gridW), (this.Cache[cname]["SupportedCityY"]*gridH));

                      //ClientLib.Vis.Region.RegionCity
                      if (worldObj == null) {
                        this.Cache[cname]["SupportTime"] = "";
                      } else {
                        console.log(cname);
                        //console.log(worldObj.CalibrationSupportDuration());
                        var weaponState = worldObj.get_SupportWeaponStatus();

                        //console.log(this.calcDuration(ncity, worldObj));
                        var cities = ClientLib.Data.MainData.GetInstance().get_Cities();
                        cities.set_CurrentOwnCityId(ncity.get_Id());
                        var status = worldObj.get_SupportWeaponStatus();
                        var server = mainData.get_Server();
                        //console.log(worldObj.CalculateSupportCalibrationEndStep(worldObj.get_SupportData(), worldObj.get_SupportWeapon()));
                        console.log(status);
                        console.log(currStep);
                        this.Cache[cname]["SupportTime"] = mainData.get_Time().GetTimespanString(worldObj.CalculateSupportCalibrationEndStep(worldObj.get_SupportData(), worldObj.get_SupportWeapon()), currStep);
                        //status.Status&ClientLib.Vis.Region.ESupportWeaponStatus.Calibrating)==ClientLib.Vis.Region.ESupportWeaponStatus.Calibrating
                        var currStep = ClientLib.Data.MainData.GetInstance().get_Time().GetServerStep();
                        //this.Cache[cname]["SupportTime"] = webfrontend.Util.getTimespanString(ClientLib.Data.MainData.GetInstance().get_Time().GetTimeSpan(Math.max(0, status.CalibrationEndStep) - currStep), false);
                        //this.Cache[cname]["SupportTime"] = ClientLib.Data.MainData.GetInstance().get_Time().GetTimespanString(weaponState.CalibrationEndStep, currStep);
                        //this.Cache[cname]["SupportTime"] = webfrontend.Util.getTimespanString(ClientLib.Data.MainData.GetInstance().get_Time().GetTimeSpan(Math.max(0, worldObj.CalculateSupportCalibrationEndStep(worldObj.get_SupportData(), worldObj.get_SupportWeapon()) - currStep)), false);
                      //console.log(this.Cache[cname]["SupportTime"]);
                      }
                       */
                    } else { // prevent reference to undefined property ReferenceError
                      this.Cache[cname]["SupportedCityId"] = null;
                      this.Cache[cname]["SupportedCityName"] = null;
                      this.Cache[cname]["SupportedCityX"] = null;
                      this.Cache[cname]["SupportedCityY"] = null;
                    }
                    this.Cache[cname]["SupportRange"] = MaelstromTools.Wrapper.GetSupportWeaponRange(ncity.get_SupportWeapon());
                    var techName = ClientLib.Base.Tech.GetTechNameFromTechId(supportData.get_Type(), player.get_Faction());
                    this.Cache[cname]["SupportName"] = ClientLib.Base.Tech.GetProductionBuildingNameFromFaction(techName, player.get_Faction());
                    this.Cache[cname]["SupportLevel"] = supportData.get_Level();
                    //this.Cache[cname]["SupportBuilding"] = ncity.get_CityBuildingsData().GetUniqueBuildingByTechName(techName);
                    //console.log(this.Cache[cname]["SupportBuilding"]);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.BaseStatus.updateCache: ", e);
              }
            },
            /*
            calcDuration: function(currOwnCity, regionCity) {
              var targetCity = MaelstromTools.Wrapper.GetCity(regionCity.get_Id());

              var supportBase=regionCity.get_SupportData();
              if(supportBase == null)
              {
                return -1;
              }
              var weapon=regionCity.get_SupportWeapon();
              if(weapon == null)
              {
                return -1;
              }
              if(currOwnCity.get_Id() == regionCity.get_Id())
              {
                if(supportBase.get_Magnitude() == 0) {
                  return -1;
                }
                return 0;
              }
              var dx=(currOwnCity.get_X() - targetCity.get_PosX());
              var dy=(currOwnCity.get_Y() - targetCity.get_PosY());
              var distance=((dx * dx) + (dy * dy));
              return Math.floor((weapon.pt + (weapon.tpf * Math.floor((Math.sqrt(distance) + 0.5)))));
            },*/

            setWidgetLabels: function () {
              try {
                this.Widget.removeAll();
                var rowIdx = 1;
                var colIdx = 2;

                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Cooldown", 85, 'left');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Protection", 85, 'left');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Available weapon", 140, 'left');
                MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "Calibrated on", 140, 'left');

                //colIdx++;
                var rowIdxRecall = rowIdx;
                var colIdxRecall = 0;
                var supportWeaponCount = 0;

                rowIdx++;
                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  colIdx = 1;

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityName, 100, 'left', null, (cityCache.IsAlerted ? 'red' : null));

                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetStepTime(cityCache.CooldownEnd), 70, 'right');
                  MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, MaelstromTools.Wrapper.GetStepTime(cityCache.ProtectionEnd), 70, 'right');

                  if (!cityCache.HasSupportWeapon) {
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, "none", 140, 'left');
                    colIdx += 2;
                  } else {
                    supportWeaponCount++;
                    MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.SupportName + " (" + cityCache.SupportLevel + ")", 140, 'left');

                    if (cityCache.SupportedCityId > 0) {
                      MaelstromTools.Util.addLabel(this.Widget, rowIdx, colIdx++, cityCache.SupportedCityName, 140, 'left');
                      colIdxRecall = colIdx;
                      MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, this.getRecallButton(cityName));
                    } else {
                      colIdx += 2;
                    }
                  }

                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getAccessBaseButton(cityName));
                  MaelstromTools.Util.addElement(this.Widget, rowIdx, colIdx++, MaelstromTools.Util.getFocusBaseButton(cityName));

                  rowIdx++;
                }

                if (supportWeaponCount > 0 && colIdxRecall > 0) {
                  MaelstromTools.Util.addElement(this.Widget, rowIdxRecall, colIdxRecall, this.getRecallAllButton());
                }
              } catch (e) {
                console.log("MaelstromTools.BaseStatus.setWidgetLabels: ", e);
              }
            },

            getRecallAllButton: function () {
              var button = new qx.ui.form.Button("Recall all").set({
                appearance: "button-text-small",
                toolTipText: "Recall all support weapons",
                width: 100,
                height: 20
              });
              button.addListener("execute", function (e) {
                MaelstromTools.Util.recallAllSupport();
              }, this);
              return button;
            },

            getRecallButton: function (cityName) {
              var button = new qx.ui.form.Button("Recall").set({
                appearance: "button-text-small",
                toolTipText: "Recall support to " + cityName,
                width: 100,
                height: 20
              });
              button.addListener("execute", function (e) {
                MaelstromTools.Util.recallSupport(cityName);
              }, this);
              return button;
            }
            /*
            getCalibrateAllOnSelectedBaseButton: function() {
              var button = new qx.ui.form.Button("Calibrate all weapons on selected base").set({
                appearance: "button-text-small",
                toolTipText: "Calibrate all weapons",
                width: 100,
                height: 20
              });
              button.addListener("execute", function(e){
                Util.calibrateWholeSupport(ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId());
              }, this);
              return button;
            }*/


          }
        });

        // define Statics
        qx.Class.define("MaelstromTools.Statics", {
          type: "static",
          statics: {
            Tiberium: 'Tiberium',
            Crystal: 'Crystal',
            Power: 'Power',
            Dollar: 'Dollar',
            Research: 'Research',
            Vehicle: "Vehicle",
            Aircraft: "Aircraft",
            Infantry: "Infantry",

            LootTypeName: function (ltype) {
              switch (ltype) {
                case ClientLib.Base.EResourceType.Tiberium:
                  return MaelstromTools.Statics.Tiberium;
                  break;
                case ClientLib.Base.EResourceType.Crystal:
                  return MaelstromTools.Statics.Crystal;
                  break;
                case ClientLib.Base.EResourceType.Power:
                  return MaelstromTools.Statics.Power;
                  break;
                case ClientLib.Base.EResourceType.Gold:
                  return MaelstromTools.Statics.Dollar;
                  break;
                default:
                  return "";
                  break;
              }
            }
          }
        });

        // define Util
        //ClientLib.Data.Cities.prototype.GetCityByCoord
        //ClientLib.Data.City.prototype.get_HasIncommingAttack
        qx.Class.define("MaelstromTools.Util", {
          type: "static",
          statics: {
            ArrayUnique: function (array) {
              var o = {};
              var l = array.length;
              r = [];
              for (var i = 0; i < l; i++) o[array[i]] = array[i];
              for (var i in o) r.push(o[i]);
              return r;
            },

            ArraySize: function (array) {
              var size = 0;
              for (var key in array)
              if (array.hasOwnProperty(key)) size++;
              return size;
            },

            addLabel: function (widget, rowIdx, colIdx, value, width, textAlign, font, color, colSpan) {
              try {
                var label = new qx.ui.basic.Label().set({
                  value: Lang.gt(value)
                });
                if (width) {
                  label.setWidth(width);
                }
                if (textAlign) {
                  label.setTextAlign(textAlign);
                }
                if (color) {
                  label.setTextColor(color);
                }
                if (font) {
                  label.setFont(font);
                }
                if (!colSpan || colSpan == 0) {
                  colSpan = 1;
                }

                widget.add(label, {
                  row: rowIdx,
                  column: colIdx,
                  colSpan: colSpan
                });
              } catch (e) {
                console.log("MaelstromTools.Util.addLabel: ", e);
              }
            },

            addElement: function (widget, rowIdx, colIdx, element, colSpan) {
              try {
                if (!colSpan || colSpan == 0) {
                  colSpan = 1;
                }
                widget.add(element, {
                  row: rowIdx,
                  column: colIdx,
                  colSpan: colSpan
                });
              } catch (e) {
                console.log("MaelstromTools.Util.addElement: ", e);
              }
            },

            addImage: function (widget, rowIdx, colIdx, image) {
              try {
                widget.add(image, {
                  row: rowIdx,
                  column: colIdx
                });
              } catch (e) {
                console.log("MaelstromTools.Util.addImage: ", e);
              }
            },

            getImage: function (name) {
              var image = new qx.ui.basic.Image(MT_Base.images[name]);
              image.setScale(true);
              image.setWidth(20);
              image.setHeight(20);
              return image;
            },

            getAccessBaseButton: function (cityName, viewMode) {
              try {
                var cityButton = new qx.ui.form.Button(null, MT_Base.images["AccessBase"]).set({
                  appearance: "button-addpoints",
                  toolTipText: Lang.gt("Access") + " " + cityName,
                  width: 20,
                  height: 20,
                  marginLeft: 5
                });
                cityButton.setUserData("cityId", MT_Cache.Cities[cityName].ID);
                cityButton.setUserData("viewMode", viewMode);
                cityButton.addListener("execute", function (e) {
                  MaelstromTools.Util.accessBase(e.getTarget().getUserData("cityId"), e.getTarget().getUserData("viewMode"));
                }, this);
                return cityButton;
              } catch (e) {
                console.log("MaelstromTools.Util.getAccessBaseButton: ", e);
              }
            },

            getFocusBaseButton: function (cityName) {
              try {
                var cityButton = new qx.ui.form.Button(null, MT_Base.images["FocusBase"]).set({
                  appearance: "button-addpoints",
                  toolTipText: Lang.gt("Focus on") + " " + cityName,
                  width: 20,
                  height: 20,
                  marginLeft: 5
                });
                cityButton.setUserData("cityId", MT_Cache.Cities[cityName].ID);
                cityButton.addListener("execute", function (e) {
                  MaelstromTools.Util.focusBase(e.getTarget().getUserData("cityId"));
                }, this);
                return cityButton;
              } catch (e) {
                console.log("MaelstromTools.Util.getFocusBaseButton: ", e);
              }
            },

            accessBase: function (cityId, viewMode) {
              try {
                if (cityId > 0) {
                  var ncity = MaelstromTools.Wrapper.GetCity(cityId);

                  if (ncity != null && !ncity.get_IsGhostMode()) {
                    if (viewMode) {
                      webfrontend.gui.UtilView.openVisModeInMainWindow(viewMode, cityId, false);
                    } else {
                      webfrontend.gui.UtilView.openCityInMainWindow(cityId);
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.Util.accessBase: ", e);
              }
            },
            focusBase: function (cityId) {
              try {
                if (cityId > 0) {
                  var ncity = MaelstromTools.Wrapper.GetCity(cityId);

                  if (ncity != null && !ncity.get_IsGhostMode()) {
                    webfrontend.gui.UtilView.centerCityOnRegionViewWindow(cityId);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.Util.focusBase: ", e);
              }
            },

            recallSupport: function (cityName) {
              try {
                var ncity = MT_Cache.Cities[cityName]["Object"];
                ncity.RecallDedicatedSupport();
              } catch (e) {
                console.log("MaelstromTools.Util.recallSupport: ", e);
              }
            },

            recallAllSupport: function () {
              try {
                MT_Cache.updateCityCache();
                for (var cityName in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cityName]["Object"];
                  ncity.RecallDedicatedSupport();
                }
              } catch (e) {
                console.log("MaelstromTools.Util.recallAllSupport: ", e);
              }
            },

            checkIfSupportIsAllowed: function (selectedBase) {
              try {
                if (selectedBase.get_VisObjectType() != ClientLib.Vis.VisObject.EObjectType.RegionCityType) {
                  return false;
                }
                if (selectedBase.get_Type() != ClientLib.Vis.Region.RegionCity.ERegionCityType.Own && selectedBase.get_Type() != ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance) {
                  return false;
                }
                return true;
              } catch (e) {
                console.log("MaelstromTools.Util.checkIfSupportIsAllowed: ", e);
                return false;
              }
            },

            calibrateWholeSupportOnSelectedBase: function () {
              if (this.checkIfSupportIsAllowed(MT_Cache.SelectedBaseForMenu)) {
                this.calibrateWholeSupport(MT_Cache.SelectedBaseForMenu);
              }
            },

            calibrateWholeSupport: function (targetRegionCity) {
              try {
                MT_Cache.updateCityCache();
                for (var cityName in MT_Cache.Cities) {
                  var ncity = MT_Cache.Cities[cityName]["Object"];
                  //var targetCity = MaelstromTools.Wrapper.GetCity(targetCityId);
                  var weapon = ncity.get_SupportWeapon();

                  //console.log("checking support weapon for " + ncity.get_Name() + " calibrating on " + targetRegionCity.get_Name());

                  if (targetRegionCity != null && weapon != null) {
                    //console.log("city at " + ncity.get_X() + " / " + ncity.get_Y());
                    //console.log("targetRegionCity at " + targetRegionCity.get_RawX() + " / " + targetRegionCity.get_RawY());
                    //var distance = ClientLib.Base.Util.CalculateDistance(ncity.get_X(), ncity.get_Y(), targetRegionCity.get_RawX(), targetRegionCity.get_RawY());
                    var dx = (ncity.get_X() - targetRegionCity.get_RawX());
                    var dy = (ncity.get_Y() - targetRegionCity.get_RawY());
                    var distance = ((dx * dx) + (dy * dy));
                    var range = MaelstromTools.Wrapper.GetSupportWeaponRange(weapon);
                    //console.log("distance is " + distance);
                    //console.log("range isy " + range*range);
                    if (distance <= (range * range)) {
                      ncity.SetDedicatedSupport(targetRegionCity.get_Id());
                    }
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.Util.calibrateWholeSupport: ", e);
              }
            },

            // visCity : ClientLib.Vis.Region.RegionObject
            getResources: function (visCity) { // to verifier against PerforceChangelist>=376877
              try {
                var loot = {};
                if (visCity.get_X() < 0 || visCity.get_Y() < 0) {
                  loot["LoadState"] = 0;
                  return loot;
                }
                var currentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();

                var distance = ClientLib.Base.Util.CalculateDistance(currentOwnCity.get_X(), currentOwnCity.get_Y(), visCity.get_RawX(), visCity.get_RawY());
                var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
                if (distance > maxAttackDistance) {
                  loot["LoadState"] = -1;
                  return loot;
                }

                var ncity = MaelstromTools.Wrapper.GetCity(visCity.get_Id());
                /* ClientLib.Data.CityBuildings */
                //var cityBuildings = ncity.get_CityBuildingsData();
                var cityUnits = ncity.get_CityUnitsData();

                //var buildings = MaelstromTools.Wrapper.GetBuildings(cityBuildings);
                var buildings = ncity.get_Buildings().d;
                var defenseUnits = MaelstromTools.Wrapper.GetDefenseUnits(cityUnits);
                //var defenseUnits = MaelstromTools.Wrapper.GetDefenseUnits();

                /*for(var u in buildings) {
              console.log(buildings[u].get_MdbBuildingId());
              console.log("----------------");
            }*/

                var buildingLoot = MaelstromTools.Util.getResourcesPart(buildings);
                //var buildingLoot2 = MaelstromTools.Util.getResourcesPart(this.collectBuildings(ncity));

                var unitLoot = MaelstromTools.Util.getResourcesPart(defenseUnits);

                loot[MaelstromTools.Statics.Tiberium] = buildingLoot[ClientLib.Base.EResourceType.Tiberium] + unitLoot[ClientLib.Base.EResourceType.Tiberium];
                loot[MaelstromTools.Statics.Crystal] = buildingLoot[ClientLib.Base.EResourceType.Crystal] + unitLoot[ClientLib.Base.EResourceType.Crystal];
                loot[MaelstromTools.Statics.Dollar] = buildingLoot[ClientLib.Base.EResourceType.Gold] + unitLoot[ClientLib.Base.EResourceType.Gold];
                loot[MaelstromTools.Statics.Research] = buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + unitLoot[ClientLib.Base.EResourceType.ResearchPoints];
                loot["Factor"] = loot[MaelstromTools.Statics.Tiberium] + loot[MaelstromTools.Statics.Crystal] + loot[MaelstromTools.Statics.Dollar] + loot[MaelstromTools.Statics.Research];
                loot["CPNeeded"] = currentOwnCity.CalculateAttackCommandPointCostToCoord(ncity.get_X(), ncity.get_Y());
                loot["LoadState"] = (loot["Factor"] > 0 ? 1 : 0);
                loot["Total"] = loot[MaelstromTools.Statics.Research] + loot[MaelstromTools.Statics.Tiberium] + loot[MaelstromTools.Statics.Crystal] + loot[MaelstromTools.Statics.Dollar];

                /*console.log("Building loot");
                console.log( buildingLoot[ClientLib.Base.EResourceType.Tiberium] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Tiberium]);
                console.log( buildingLoot[ClientLib.Base.EResourceType.Crystal] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Crystal]);
                console.log( buildingLoot[ClientLib.Base.EResourceType.Gold] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.Gold]);
                console.log( buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + " vs " +  buildingLoot2[ClientLib.Base.EResourceType.ResearchPoints]);
                console.log("-------------");*/
                return loot;
              } catch (e) {
                console.log("MaelstromTools.Util.getResources", e);
              }
            },
            /*
            collectBuildings: function(ncity) {
              var cityBuildings = ncity.get_CityBuildingsData();
              var buildings = [];
              var count = 0;
              // ncity.GetNumBuildings()
              for(var i = 0; i < 100000; i++) {
                var building = cityBuildings.GetBuildingByMDBId(i);
                if(!building) {
                  continue;
                }

                //console.log(building.get_TechName() + " - " + ncity.get_CityFaction() + " - " + ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(building.get_TechName(), ncity.get_CityFaction()) + " at lvl " + building.get_CurrentLevel());
                buildings.push(building);
              //buildings[count++] = building;
              }
              return buildings; //MaelstromTools.Util.ArrayUnique(buildings);
            },*/

            getResourcesPart: function (cityEntities) {
              try {
                var loot = [0, 0, 0, 0, 0, 0, 0, 0];
                if (cityEntities == null) {
                  return loot;
                }

                var objcityEntities = [];
                if (PerforceChangelist >= 376877) { //new
                  for (var o in cityEntities) objcityEntities.push(cityEntities[o]);
                } else { //old
                  for (var i = 0; i < cityEntities.length; i++) objcityEntities.push(cityEntities[i]);
                }

                for (var i = 0; i < objcityEntities.length; i++) {
                  var cityEntity = objcityEntities[i];
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
                console.log("MaelstromTools.Util.getResourcesPart", e);
              }
            }

            /*
            findBuildings: function(city) {
              for (var k in city) {
                if ((typeof(city[k]) == "object") && city[k] && city[k] && 0 in city[k]) {
                  if ((typeof(city[k][0]) == "object")  && city[k][0] && "BuildingDBId" in city[k][0]) {
                    return city[k];
                  }
                }
              }
              return [];
            }*/
          }
        });

        // define Wrapper
        qx.Class.define("MaelstromTools.Wrapper", {
          type: "static",
          statics: {
            GetStepTime: function (step, defaultString) {
              if (!defaultString) {
                defaultString = "";
              }
              var endTime = ClientLib.Data.MainData.GetInstance().get_Time().GetTimespanString(step, ClientLib.Data.MainData.GetInstance().get_Time().GetServerStep());
              if (endTime == "00:00") {
                return defaultString;
              }
              return endTime;
            },

            FormatNumbersCompact: function (value) {
              if (PerforceChangelist >= 387751) { //new
                return phe.cnc.gui.util.Numbers.formatNumbersCompact(value);
              } else { //old
                return webfrontend.gui.Util.formatNumbersCompact(value);
              }
            },

            GetDateTimeString: function (value) {
                return phe.cnc.Util.getDateTimeString(value);
            },

            FormatTimespan: function (value) {
              return ClientLib.Vis.VisMain.FormatTimespan(value);
            },

            GetSupportWeaponRange: function (weapon) {
              return weapon.r;
            },

            GetCity: function (cityId) {
              return ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(cityId);
            },

            GetDefenseUnits: function (cityUnits) {
            //GetDefenseUnits: function () {
              if (PerforceChangelist >= 392583) { //endgame patch
                return (cityUnits.get_DefenseUnits() != null ? cityUnits.get_DefenseUnits().d : null);
              } else { //old
                var defenseObjects = [];
                for (var x = 0; x < 9; x++) {
                  for (var y = 0; y < 8; y++) {
                    var defenseObject = ClientLib.Vis.VisMain.GetInstance().get_DefenseSetup().GetDefenseObjectFromPosition((x * ClientLib.Vis.VisMain.GetInstance().get_City().get_GridWidth()),(y * ClientLib.Vis.VisMain.GetInstance().get_City().get_GridHeight()));
                    if (defenseObject !== null && defenseObject.get_CityEntity() !== null) {
                      defenseObjects.push(defenseObject.get_UnitDetails());
                    }
                  }
                }
                return defenseObjects;
              }
            },
            GetUnitLevelRequirements: function (cityEntity) {
              if (PerforceChangelist >= 376877) { //new
                return (cityEntity.get_UnitLevelRepairRequirements() != null ? cityEntity.get_UnitLevelRepairRequirements() : null);
              } else { //old
                return (cityEntity.get_UnitLevelRequirements() != null ? cityEntity.get_UnitLevelRequirements() : null);
              }
            },

            GetBaseLevel: function (ncity) {
              return (Math.floor(ncity.get_LvlBase() * 100) / 100).toFixed(2);
            }
            /*,

            GetPointsByLevelWithThresholds: function (_levelThresholds,_levelFactors,_iLevel) {
              var result=0;
              var lastLevel=_iLevel;
              if(_levelThresholds.length != _levelFactors.length) {
                return 0;
              }
              for (var i=(_levelThresholds.length - 1); (i >= 0); i--) {
                var threshold=(_levelThresholds[i] - 1);
                if(lastLevel >= threshold) {
                  result += ((lastLevel - threshold) * _levelFactors[i]);
                  lastLevel=threshold;
                }
              }
              return result;
            },
            GetArmyPoints: function(_iLevel) {
              var server = ClientLib.Data.MainData.GetInstance().get_Server();
              var m_iArmyPointsPerLevelThresholds = server.get_ArmyPointsPerLevelThresholds();
              var m_fArmyPointsPerLevel = server.get_ArmyPointsPerLevel();
              _iLevel += 4;
              var armyPoints = MaelstromTools.Wrapper.GetPointsByLevelWithThresholds(m_iArmyPointsPerLevelThresholds, m_fArmyPointsPerLevel, _iLevel);
              return Math.min(armyPoints, server.get_MaxArmyPoints());
            },

            GetBuilding: function(ncity, techName) {
              return ncity.get_CityBuildingsData().GetUniqueBuildingByTechName(techName)
            },

            GetCommandCenter: function(ncity) {
              //var techName = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Command_Center, ClientLib.Data.MainData.GetInstance().get_Player().get_Faction());

              return MaelstromTools.Wrapper.GetBuilding(ncity, ClientLib.Base.ETechName.Command_Center);
            // conyard return this.GetBuildingCondition$0(ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction$0(0, ClientLib.Data.MainData.GetInstance$9().get_Player$2().get_Faction$2()));
            // ClientLib.Data.City.prototype.GetOffenseConditionInPercent=ClientLib.Data.City.prototype.GetOffenseConditionInPercent$0;
            }*/
          }
        });

        // define LocalStorage
        qx.Class.define("MaelstromTools.LocalStorage", {
          type: "static",
          statics: {
            isSupported: function () {
              return typeof (Storage) !== "undefined";
            },
            set: function (key, value) {
              try {
                if (MaelstromTools.LocalStorage.isSupported()) {
                  localStorage["CCTA_MaelstromTools_" + key] = JSON.stringify(value);
                }
              } catch (e) {
                console.log("MaelstromTools.LocalStorage.set: ", e);
              }
            },
            get: function (key, defaultValueIfNotSet) {
              try {
                if (MaelstromTools.LocalStorage.isSupported()) {
                  if (localStorage["CCTA_MaelstromTools_" + key] != null && localStorage["CCTA_MaelstromTools_" + key] != 'undefined') {
                    return JSON.parse(localStorage["CCTA_MaelstromTools_" + key]);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.LocalStorage.get: ", e);
              }
              return defaultValueIfNotSet;
            },
            clearAll: function () {
              try {
                if (!MaelstromTools.LocalStorage.isSupported()) {
                  return;
                }
                for (var key in localStorage) {
                  if (key.indexOf("CCTA_MaelstromTools_") == 0) {
                    localStorage.removeItem(key);
                  }
                }
              } catch (e) {
                console.log("MaelstromTools.LocalStorage.clearAll: ", e);
              }
            }
          }
        });

        // define Cache
        qx.Class.define("MaelstromTools.Cache", {
          type: "singleton",
          extend: qx.core.Object,
          members: {
            CityCount: 0,
            Cities: null,
            SelectedBaseForMenu: null,
            SelectedBaseResources: null,
            SelectedBaseForLoot: null,

            updateCityCache: function () {
              try {
                this.CityCount = 0;
                this.Cities = Object();

                var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
                for (var cindex in cities.d) {
                  this.CityCount++;
                  var ncity = MaelstromTools.Wrapper.GetCity(cindex);
                  var ncityName = ncity.get_Name();
                  this.Cities[ncityName] = Object();
                  this.Cities[ncityName]["ID"] = cindex;
                  this.Cities[ncityName]["Object"] = ncity;
                }
              } catch (e) {
                console.log("MaelstromTools.Cache.updateCityCache: ", e);
              }
            },

            updateLoot: function (visCity) {
              var cityId = visCity.get_Id();

              if (this.SelectedBaseForLoot != null && cityId == this.SelectedBaseForLoot.get_Id() && this.SelectedBaseResources != null && this.SelectedBaseResources["LoadState"] > 0) {
                return -2;
              }
              this.SelectedBaseForLoot = visCity;
              this.SelectedBaseResources = MaelstromTools.Util.getResources(visCity);
              return this.SelectedBaseResources["LoadState"];
            }
          }
        });

        // define HuffyTools.ImageRender
        qx.Class.define("HuffyTools.ImageRender", {
          extend: qx.ui.table.cellrenderer.AbstractImage,
          construct: function (width, height) {
            this.base(arguments);
            if (width) {
              this.__imageWidth = width;
            }
            if (height) {
              this.__imageHeight = height;
            }
            this.__am = qx.util.AliasManager.getInstance();
          },
          members: {
            __am: null,
            __imageHeight: 16,
            __imageWidth: 16,
            // overridden
            _identifyImage: function (cellInfo) {
              var imageHints = {
                imageWidth: this.__imageWidth,
                imageHeight: this.__imageHeight
              };
              if (cellInfo.value == "") {
                imageHints.url = null;
              } else {
                imageHints.url = this.__am.resolve(cellInfo.value);
              }
              imageHints.tooltip = cellInfo.tooltip;
              return imageHints;
            }
          },
          destruct: function () {
            this.__am = null;
          }
        });

        // define HuffyTools.ReplaceRender
        qx.Class.define("HuffyTools.ReplaceRender", {
          extend: qx.ui.table.cellrenderer.Default,
          properties: {
            replaceFunction: {
              check: "Function",
              nullable: true,
              init: null
            }
          },
          members: {
            // overridden
            _getContentHtml: function (cellInfo) {
              var value = cellInfo.value;
              var replaceFunc = this.getReplaceFunction();
              // use function
              if (replaceFunc) {
                cellInfo.value = replaceFunc(value);
              }
              return qx.bom.String.escape(this._formatValue(cellInfo));
            }
          }
        });

        qx.Class.define("HuffyTools.CityCheckBox", {
          extend: qx.ui.form.CheckBox,
          members: {
            HT_CityID: null
          }
        });

        // define HuffyTools.UpgradePriorityGUI
        qx.Class.define("HuffyTools.UpgradePriorityGUI", {
          type: "singleton",
          extend: MaelstromTools.DefaultObject,
          members: {
            HT_TabView: null,
            HT_Options: null,
            HT_ShowOnlyTopBuildings: null,
            HT_ShowOnlyAffordableBuildings: null,
            HT_CityBuildings: null,
            HT_Pages: null,
            HT_Tables: null,
            HT_Models: null,
            HT_SelectedResourceType: null,
            BuildingList: null,
            upgradeInProgress: null,
			upgradeToDoType: null,
			upgradeToDo: null,
            init: function () {
              /*
              Done:
              - Added cost per gain to the lists
              - Added building coordinates to the lists
              - Only display the top affordable and not affordable building
              - Persistent filter by city, top and affordable per resource type
              - Reload onTabChange for speed optimization
              - Estimated time until upgrade is affordable

              ToDo:
              - let the user decide to sort by colums he like i.e. timefactor or cost/gain and save it in the configuration
              - integrate buttons to transfer resources ?

               */
              try {
                this.HT_SelectedResourceType = -1;
                this.IsTimerEnabled = false;
                this.upgradeInProgress = false;

                this.HT_TabView = new qx.ui.tabview.TabView();
                this.HT_TabView.set({
                  contentPadding: 0,
                  appearance: "tabview",
                  margin: 5,
                  barPosition: 'left'
                });
                this.Widget = new qx.ui.tabview.Page("UpgradePriority");
                this.Widget.setPadding(0);
                this.Widget.setMargin(0);
                this.Widget.setBackgroundColor("#BEC8CF");
                this.Widget.setLayout(new qx.ui.layout.VBox(2));
                //this.Widget.add(this.HT_Options);
                this.Widget.add(this.HT_TabView, {
                  flex: 1
                });
                this.Window.setPadding(0);
                this.Window.set({
                  resizable: true
                });

                this.Window.removeAll();
                this.Window.add(this.Widget);

                this.BuildingList = [];
                this.HT_Models = [];
                this.HT_Tables = [];
                this.HT_Pages = [];

				if (PerforceChangelist >= 436669) { // 15.3 patch
					var eventType = "cellTap";
				} else { //old
					var eventType = "cellClick";
				}

                this.createTabPage(ClientLib.Base.EResourceType.Tiberium);
                this.createTable(ClientLib.Base.EResourceType.Tiberium);
                this.HT_Tables[ClientLib.Base.EResourceType.Tiberium].addListener(eventType, function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Tiberium);
                }, this);


                this.createTabPage(ClientLib.Base.EResourceType.Crystal);
                this.createTable(ClientLib.Base.EResourceType.Crystal);
                this.HT_Tables[ClientLib.Base.EResourceType.Crystal].addListener(eventType, function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Crystal);
                }, this);

                this.createTabPage(ClientLib.Base.EResourceType.Power);
                this.createTable(ClientLib.Base.EResourceType.Power);
                this.HT_Tables[ClientLib.Base.EResourceType.Power].addListener(eventType, function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Power);
                }, this);

                this.createTabPage(ClientLib.Base.EResourceType.Gold);
                this.createTable(ClientLib.Base.EResourceType.Gold);
                this.HT_Tables[ClientLib.Base.EResourceType.Gold].addListener(eventType, function (e) {
                  this.upgradeBuilding(e, ClientLib.Base.EResourceType.Gold);
                }, this);


                MT_Cache.updateCityCache();
                this.HT_Options = [];
                this.HT_ShowOnlyTopBuildings = [];
                this.HT_ShowOnlyAffordableBuildings = [];
                this.HT_CityBuildings = [];
                for (var mPage in this.HT_Pages) {
                  this.createOptions(mPage);
                  this.HT_Pages[mPage].add(this.HT_Options[mPage]);
                  this.HT_Pages[mPage].add(this.HT_Tables[mPage], {
                    flex: 1
                  });
                  this.HT_TabView.add(this.HT_Pages[mPage]);
                }

                // Zeigen wir Dollars an !
                this.HT_TabView.setSelection([this.HT_TabView.getChildren()[2]]);
                this.HT_SelectedResourceType = ClientLib.Base.EResourceType.Gold;
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.init: ", e);
              }
            },
            createOptions: function (eType) {
              var oBox = new qx.ui.layout.Flow();
              var oOptions = new qx.ui.container.Composite(oBox);
              oOptions.setMargin(5);
              this.HT_ShowOnlyTopBuildings[eType] = new qx.ui.form.CheckBox(Lang.gt("display only top buildings"));
              this.HT_ShowOnlyTopBuildings[eType].setMargin(5);
              this.HT_ShowOnlyTopBuildings[eType].setValue(MaelstromTools.LocalStorage.get("UGL_TOPBUILDINGS_" + eType, true));
              this.HT_ShowOnlyTopBuildings[eType].addListener("execute", this.CBChanged, this);
              oOptions.add(this.HT_ShowOnlyTopBuildings[eType], {
                left: 10,
                top: 10
              });
              this.HT_ShowOnlyAffordableBuildings[eType] = new qx.ui.form.CheckBox(Lang.gt("display only affordable buildings"));
              this.HT_ShowOnlyAffordableBuildings[eType].setMargin(5);
              this.HT_ShowOnlyAffordableBuildings[eType].setValue(MaelstromTools.LocalStorage.get("UGL_AFFORDABLE_" + eType, true));
              this.HT_ShowOnlyAffordableBuildings[eType].addListener("execute", this.CBChanged, this);
              oOptions.add(this.HT_ShowOnlyAffordableBuildings[eType], {
                left: 10,
                top: 10,
                lineBreak: true
              });
              this.HT_CityBuildings[eType] = [];
              for (var cname in MT_Cache.Cities) {
                var oCity = MT_Cache.Cities[cname].Object;
                var oCityBuildings = new HuffyTools.CityCheckBox(cname);
                oCityBuildings.HT_CityID = oCity.get_Id();
                oCityBuildings.setMargin(5);
                oCityBuildings.setValue(MaelstromTools.LocalStorage.get("UGL_CITYFILTER_" + eType + "_" + oCity.get_Id(), true));
                oCityBuildings.addListener("execute", this.CBChanged, this);
                oOptions.add(oCityBuildings, {
                  left: 10,
                  top: 10
                });
                this.HT_CityBuildings[eType][cname] = oCityBuildings;
              }
              var buttonUpgradeAll = new qx.ui.form.Button("UpgradeAll").set({
                width : 80,
                appearance : "button-text-small",
                toolTipText : "Upgrade all filtered buildings"
              });
              buttonUpgradeAll.addListener("execute", function (e) {
                  this.upgradeAll(e, eType);
                }, this);
              oOptions.add(buttonUpgradeAll, {
                  left: 10,
                  top: 10
                });
              this.HT_Options[eType] = oOptions;
            },
            createTable: function (eType) {
              try {
                this.HT_Models[eType] = new qx.ui.table.model.Simple();
                this.HT_Models[eType].setColumns(["ID", Lang.gt("City"), Lang.gt("Type (coord)"), Lang.gt("to Level"), Lang.gt("Gain/h"), Lang.gt("Factor"), Lang.gt("Tiberium"), Lang.gt("Power"), Lang.gt("Tib/gain"), Lang.gt("Pow/gain"), Lang.gt("ETA"), Lang.gt("Upgrade"), "State"]);
                this.HT_Tables[eType] = new qx.ui.table.Table(this.HT_Models[eType]);
                this.HT_Tables[eType].setColumnVisibilityButtonVisible(false);
                this.HT_Tables[eType].setColumnWidth(0, 0);
                this.HT_Tables[eType].setColumnWidth(1, 90);
                this.HT_Tables[eType].setColumnWidth(2, 120);
                this.HT_Tables[eType].setColumnWidth(3, 55);
                this.HT_Tables[eType].setColumnWidth(4, 70);
                this.HT_Tables[eType].setColumnWidth(5, 60);
                this.HT_Tables[eType].setColumnWidth(6, 70);
                this.HT_Tables[eType].setColumnWidth(7, 70);
                this.HT_Tables[eType].setColumnWidth(8, 70);
                this.HT_Tables[eType].setColumnWidth(9, 70);
                this.HT_Tables[eType].setColumnWidth(10, 70);
                this.HT_Tables[eType].setColumnWidth(11, 40);
                this.HT_Tables[eType].setColumnWidth(12, 0);
                var tcm = this.HT_Tables[eType].getTableColumnModel();
                tcm.setColumnVisible(0, false);
                tcm.setColumnVisible(12, false);
                tcm.setDataCellRenderer(4, new qx.ui.table.cellrenderer.Number().set({
                  numberFormat: new qx.util.format.NumberFormat().set({
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })
                }));
                tcm.setDataCellRenderer(5, new qx.ui.table.cellrenderer.Number().set({
                  numberFormat: new qx.util.format.NumberFormat().set({
                    maximumFractionDigits: 5,
                    minimumFractionDigits: 5
                  })
                }));
                tcm.setDataCellRenderer(6, new HuffyTools.ReplaceRender().set({
                  ReplaceFunction: this.formatTiberiumAndPower
                }));
                tcm.setDataCellRenderer(7, new HuffyTools.ReplaceRender().set({
                  ReplaceFunction: this.formatTiberiumAndPower
                }));
                tcm.setDataCellRenderer(11, new HuffyTools.ImageRender(40, 20));
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.createTable: ", e);
              }
            },
            createTabPage: function (resource_type) {
              try {
                var sName = MaelstromTools.Statics.LootTypeName(resource_type);
                var oRes = new qx.ui.tabview.Page(Lang.gt(sName), MT_Base.images[sName]);
                oRes.setLayout(new qx.ui.layout.VBox(2));
                oRes.setPadding(5);
                var btnTab = oRes.getChildControl("button");
                btnTab.resetWidth();
                btnTab.resetHeight();
                btnTab.set({
                  show: "icon",
                  margin: 0,
                  padding: 0,
                  toolTipText: sName
                });
                btnTab.addListener("execute", this.TabChanged, [this, resource_type]);
                this.HT_Pages[resource_type] = oRes;
                return oRes;
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.createTabPage: ", e);
              }
            },

            TabChanged: function (e) {
              try {
                this[0].HT_SelectedResourceType = this[1];
                this[0].UpgradeCompleted(null, null);
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.TabChanged: ", e);
              }
            },
            upgradeAll: function (e, eResourceType) {
              try {
                if (this.upgradeToDo == null) {
                  this.upgradeToDoType = parseInt(eResourceType);
                  this.upgradeToDo = this.HT_Models[eResourceType].getData();
                }
                if (this.upgradeToDo.length > 0) {
                  this.upgradeInProgress = true;
                  var current = this.upgradeToDo.pop();
                  var buildingID = current[0];
                  var iState = parseInt(current[12]);
                  if (iState != 1) {
                    return;
                  }
                  if (buildingID in this.BuildingList) {
                    if (PerforceChangelist >= 382917) { //new
                      ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.upgradeAllCompleted), null, true);
                    } else { //old
                      ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], webfrontend.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.upgradeAllCompleted), null, true);
                    }
                  }
                } else {
                  this.upgradeToDo = null;
                }
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.upgradeBuilding: ", e);
              }
            },
            upgradeAllCompleted: function (context, result) {
              var self = this;
              if (this.upgradeToDo.length > 0) {
                setTimeout(function () {
                  self.upgradeAll(self.upgradeToDoType);
                }, 100);
              } else {
                this.upgradeToDoType = null;
                this.upgradeToDo = null;
                setTimeout(function () {
                  self.calc();
                }, 100);
                this.upgradeInProgress = false;
              }
            },
            upgradeBuilding: function (e, eResourceType) {
              if (this.upgradeInProgress == true) {
                console.log("upgradeBuilding:", "upgrade in progress !");
                return;
              }
              try {
                if (e.getColumn() == 11) {
                  var buildingID = this.HT_Models[eResourceType].getValue(0, e.getRow());
                  var iState = parseInt(this.HT_Models[eResourceType].getValue(12, e.getRow()));
                  if (iState != 1) {
                    return;
                  }
                  if (buildingID in this.BuildingList) {
                    this.upgradeInProgress = true;
                    if (PerforceChangelist >= 382917) { //new
                      ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.UpgradeCompleted), null, true);
                    } else { //old
                      ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", this.BuildingList[buildingID], webfrontend.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.UpgradeCompleted), null, true);
                    }
                  }
                }
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.upgradeBuilding: ", e);
              }
            },
            UpgradeCompleted: function (context, result) {
              /* Dodgy solution to get upgrade priority working.
                 Upgrades in the game were reworked in the February patch and again in the March patch.
                 In the past resources were deducted from the base immediately when the upgrade command was sent, but now it is done moments after the upgrade has been completed.
                 When running updateCache() immediately after the upgrade it will still return with the pre-upgrade resource amounts.
                 A one second delay will work as a temporary solution giving the base enough time to update to reflect the new resource amounts.
                 A better solution could be to monitor for the reduction in resources after an upgrade and once it takes place only then update the cache.
              */
              var self = this;
              setTimeout(function () {
                self.calc();
              }, 1000);
              //this.calc();
              this.upgradeInProgress = false;
            },
            CBChanged: function (e) {
              this.UpgradeCompleted(null, null);
            },
            formatTiberiumAndPower: function (oValue) {
              if (PerforceChangelist >= 387751) { //new
                return phe.cnc.gui.util.Numbers.formatNumbersCompact(oValue);
              } else { //old
                return webfrontend.gui.Util.formatNumbersCompact(oValue);
              }
            },
            updateCache: function () {
              try {
                if (!this.HT_TabView) {
                  this.init();
                }
                var eType = this.HT_SelectedResourceType;
                var bTop = this.HT_ShowOnlyTopBuildings[eType].getValue();
                MaelstromTools.LocalStorage.set("UGL_TOPBUILDINGS_" + eType, bTop);
                var bAffordable = this.HT_ShowOnlyAffordableBuildings[eType].getValue();
                MaelstromTools.LocalStorage.set("UGL_AFFORDABLE_" + eType, bAffordable);
                var oCityFilter = [];
                for (var cname in this.HT_CityBuildings[eType]) {
                  var oCityBuildings = this.HT_CityBuildings[eType][cname];
                  var bFilterBuilding = oCityBuildings.getValue();
                  MaelstromTools.LocalStorage.set("UGL_CITYFILTER_" + eType + "_" + oCityBuildings.HT_CityID, bFilterBuilding);
                  oCityFilter[cname] = bFilterBuilding;
                }
                HuffyTools.UpgradePriority.getInstance().collectData(bTop, bAffordable, oCityFilter, eType);
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.updateCache: ", e);
              }
            },
            setWidgetLabels: function () {
              try {
                var HuffyCalc = HuffyTools.UpgradePriority.getInstance();
                var UpgradeList = HuffyCalc.Cache;

                for (var eResourceType in UpgradeList) {
                  //var eResourceType = MaelstromTools.Statics.LootTypeName(eResourceName);
                  var rowData = [];

                  this.HT_Models[eResourceType].setData([]);

                  for (var mCity in UpgradeList[eResourceType]) {
                    for (var mBuilding in UpgradeList[eResourceType][mCity]) {
                      var UpItem = UpgradeList[eResourceType][mCity][mBuilding];
                      if (typeof (UpItem.Type) == "undefined") {
                        continue;
                      }
                      if (!(mBuilding in this.BuildingList)) {
                        this.BuildingList[UpItem.ID] = UpItem.Building;
                      }
                      var iTiberiumCosts = 0;
                      if (ClientLib.Base.EResourceType.Tiberium in UpItem.Costs) {
                        iTiberiumCosts = UpItem.Costs[ClientLib.Base.EResourceType.Tiberium];
                      }
                      var iTiberiumPerGain = 0;
                      if (ClientLib.Base.EResourceType.Tiberium in UpItem.Costs) {
                        iTiberiumPerGain = UpItem.Costs[ClientLib.Base.EResourceType.Tiberium] / UpItem.GainPerHour;
                      }
                      var iPowerCosts = 0;
                      if (ClientLib.Base.EResourceType.Power in UpItem.Costs) {
                        iPowerCosts = UpItem.Costs[ClientLib.Base.EResourceType.Power];
                      }
                      var iPowerPerGain = 0;
                      if (ClientLib.Base.EResourceType.Power in UpItem.Costs) {
                        iPowerPerGain = UpItem.Costs[ClientLib.Base.EResourceType.Power] / UpItem.GainPerHour;
                      }
                      var img = MT_Base.images["UpgradeBuilding"];
                      if (UpItem.Affordable == false) {
                        img = "";
                      }
                      var sType = UpItem.Type;
                      sType = sType + "(" + UpItem.PosX + ":" + UpItem.PosY + ")";
                      var iETA = 0;
                      if (UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Tiberium] > 0) {
                        iETA = UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Tiberium];
                      }
                      if (UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Power] > iETA) {
                        iETA = UpItem.TimeTillUpgradable[ClientLib.Base.EResourceType.Power];
                      }
                      var sETA = "";
                      if (iETA > 0) {
                        sETA = ClientLib.Vis.VisMain.FormatTimespan(iETA);
                      }
                      var iState = 0;
                      if (UpItem.Affordable == true) {
                        iState = 1;
                      } else if (UpItem.AffordableByTransfer == true) {
                        iState = 2;
                      } else {
                        iState = 3;
                      }
                      rowData.push([UpItem.ID, mCity, sType, UpItem.Level, UpItem.GainPerHour, UpItem.Ticks, iTiberiumCosts, iPowerCosts, iTiberiumPerGain, iPowerPerGain, sETA, img, iState]);
                    }
                  }
                  this.HT_Models[eResourceType].setData(rowData);
                }
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.setWidgetLabels: ", e);
              }
            }
          }
        });

        // define HuffyTools.UpgradePriority
        qx.Class.define("HuffyTools.UpgradePriority", {
          type: "singleton",
          extend: qx.core.Object,
          members: {
            list_units: null,
            list_buildings: null,

            comparePrio: function (elem1, elem2) {
              if (elem1.Ticks < elem2.Ticks) return -1;
              if (elem1.Ticks > elem2.Ticks) return 1;
              return 0;
            },
            getPrioList: function (city, arTechtypes, eModPackageSize, eModProduction, bOnlyTopBuildings, bOnlyAffordableBuildings) {
              try {
                var RSI = MaelstromTools.ResourceOverview.getInstance();
                RSI.updateCache();
                var TotalTiberium = 0;

                for (var cityName in this.Cache) {
                  var cityCache = this.Cache[cityName];
                  var i = cityCache[MaelstromTools.Statics.Tiberium];
                  if (typeof (i) !== 'undefined') {
                    TotalTiberium += i;
                    //but never goes here during test.... // to optimize - to do
                  }
                }
                var resAll = [];
                var prod = MaelstromTools.Production.getInstance().updateCache(city.get_Name());
                //var buildings = MaelstromTools.Wrapper.GetBuildings(city.get_CityBuildingsData());
                var buildings = city.get_Buildings().d;

                // 376877 & old fixes
                var objbuildings = [];
                if (PerforceChangelist >= 376877) { //new
                  for (var o in buildings) objbuildings.push(buildings[o]);
                } else { //old
                  for (var i = 0; i < buildings.length; i++) objbuildings.push(buildings[i]);
                }


                for (var i = 0; i < objbuildings.length; i++) {
                  var city_building = objbuildings[i];

                  // TODO: check for destroyed building

                  var iTechType = city_building.get_TechName();
                  var bSkip = true;
                  for (var iTypeKey in arTechtypes) {
                    if (arTechtypes[iTypeKey] == iTechType) {
                      bSkip = false;
                      break;
                    }
                  }
                  if (bSkip == true) {
                    continue;
                  }
                  var city_buildingdetailview = city.GetBuildingDetailViewInfo(city_building);
                  if (city_buildingdetailview == null) {
                    continue;
                  }
                  var bindex = city_building.get_Id();
                  var resbuilding = [];
                  resbuilding["ID"] = bindex;
                  resbuilding["Type"] = this.TechTypeName(parseInt(iTechType, 10));
                  resbuilding["PosX"] = city_building.get_CoordX();
                  resbuilding["PosY"] = city_building.get_CoordY();

                  resbuilding["Building"] = {
                    cityid: city.get_Id(),
                    posX: resbuilding["PosX"],
                    posY: resbuilding["PosY"],
                    isPaid: true
                  };

                  resbuilding["GainPerHour"] = 0;
                  resbuilding["Level"] = city_building.get_CurrentLevel() + 1;
                  for (var ModifierType in city_buildingdetailview.OwnProdModifiers.d) {
                    switch (parseInt(ModifierType, 10)) {
                      case eModPackageSize:
                        {
                          var ModOj = city_buildingdetailview.OwnProdModifiers.d[city_building.get_MainModifierTypeId()];
                          var Mod = (ModOj.TotalValue + ModOj.NewLvlDelta) / ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                          resbuilding["GainPerHour"] += (city_buildingdetailview.OwnProdModifiers.d[ModifierType].NewLvlDelta / Mod);
                          break;
                        }
                      case eModProduction:
                        {
                          resbuilding["GainPerHour"] += city_buildingdetailview.OwnProdModifiers.d[ModifierType].NewLvlDelta;
                          break;
                        }
                    }
                  }
                  // Nutzen ins VerhÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¤ltnis zu den Kosten setzten
                  var TechLevelData = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(city_building.get_CurrentLevel() + 1, city_building.get_TechGameData_Obj());
                  var RatioPerCostType = {};
                  var sRatio = "";
                  var sCosts = "";
                  var lTicks = 0;
                  var bHasPower = true;
                  var bHasTiberium = true;
                  var bAffordableByTransfer = true;
                  var oCosts = [];
                  var oTimes = [];
                  for (var costtype in TechLevelData) {
                    if (typeof (TechLevelData[costtype]) == "function") {
                      continue;
                    }
                    if (TechLevelData[costtype].Type == "0") {
                      continue;
                    }

                    oCosts[TechLevelData[costtype].Type] = TechLevelData[costtype].Count;
                    if (parseInt(TechLevelData[costtype].Count) <= 0) {
                      continue;
                    }
                    RatioPerCostType[costtype] = TechLevelData[costtype].Count / resbuilding["GainPerHour"];
                    if (sCosts.length > 0) {
                      sCosts = sCosts + ", ";
                    }
                    sCosts = sCosts + MaelstromTools.Wrapper.FormatNumbersCompact(TechLevelData[costtype].Count) + " " + MaelstromTools.Statics.LootTypeName(TechLevelData[costtype].Type);
                    if (sRatio.length > 0) {
                      sRatio = sRatio + ", ";
                    }
                    // Upgrade affordable ?
                    if (city.GetResourceCount(TechLevelData[costtype].Type) < TechLevelData[costtype].Count) {
                      switch (TechLevelData[costtype].Type) {
                        case ClientLib.Base.EResourceType.Tiberium:
                          {
                            bHasTiberium = false;
                            if (TotalTiberium < TechLevelData[costtype].Count) {
                              bAffordableByTransfer = false;
                            }
                          }
                          break;
                        case ClientLib.Base.EResourceType.Power:
                          {
                            bHasPower = false;
                          }
                          break;
                      }
                    }
                    sRatio = sRatio + MaelstromTools.Wrapper.FormatNumbersCompact(RatioPerCostType[costtype]);

                    var techlevelData = MaelstromTools.Statics.LootTypeName(TechLevelData[costtype].Type);

                    var dCityProduction = prod[techlevelData].Delta + prod[techlevelData].ExtraBonusDelta + prod[techlevelData].POI;
                    if (dCityProduction > 0) {
                      if (lTicks < (3600 * RatioPerCostType[costtype] / dCityProduction)) {
                        lTicks = (3600 * RatioPerCostType[costtype] / dCityProduction);
                      }
                    }
                    oTimes[TechLevelData[costtype].Type] = 0;
                    if (oCosts[TechLevelData[costtype].Type] > city.GetResourceCount(TechLevelData[costtype].Type)) {
                      oTimes[TechLevelData[costtype].Type] = (3600 * (oCosts[TechLevelData[costtype].Type] - city.GetResourceCount(TechLevelData[costtype].Type))) / dCityProduction;
                    }
                  }
                  resbuilding["Ticks"] = lTicks;
                  resbuilding["Time"] = ClientLib.Vis.VisMain.FormatTimespan(lTicks);
                  resbuilding["Costtext"] = sCosts;
                  resbuilding["Costs"] = oCosts;
                  resbuilding["TimeTillUpgradable"] = oTimes;
                  resbuilding["Ratio"] = sRatio;
                  resbuilding["Affordable"] = bHasTiberium && bHasPower;
                  resbuilding["AffordableByTransfer"] = bHasPower && bAffordableByTransfer;
                  if (resbuilding["GainPerHour"] > 0 && (bOnlyAffordableBuildings == false || resbuilding["Affordable"] == true)) {
                    resAll[bindex] = resbuilding;
                  }
                }


                resAll = resAll.sort(this.comparePrio);
                if (!bOnlyTopBuildings) {
                  return resAll;
                }
                var res2 = [];
                if (MaelstromTools.Util.ArraySize(resAll) > 0) {
                  var iTopNotAffordable = -1;
                  var iTopAffordable = -1;
                  var iNextNotAffordable = -1;
                  var iLastIndex = -1;
                  for (var iNewIndex in resAll) {
                    if (resAll[iNewIndex].Affordable == true) {
                      if (iTopAffordable == -1) {
                        iTopAffordable = iNewIndex;
                        iNextNotAffordable = iLastIndex;
                      }
                    } else {
                      if (iTopNotAffordable == -1) {
                        iTopNotAffordable = iNewIndex;
                      }
                    }
                    iLastIndex = iNewIndex;
                  }
                  if (iTopAffordable == -1) {
                    iNextNotAffordable = iLastIndex;
                  }
                  var iIndex = 0;
                  if (iTopNotAffordable != -1) {
                    res2[iIndex++] = resAll[iTopNotAffordable];
                  }
                  if (iNextNotAffordable != -1) {
                    res2[iIndex++] = resAll[iNextNotAffordable];
                  }
                  if (iTopAffordable != -1) {
                    res2[iIndex++] = resAll[iTopAffordable];
                  }
                }
                res2 = res2.sort(this.comparePrio);
                return res2;
              } catch (e) {
                console.log("HuffyTools.getPrioList: ", e);
              }
            },
            TechTypeName: function (iTechType) {
              switch (iTechType) {
                case ClientLib.Base.ETechName.PowerPlant:
                  {
                    return Lang.gt("Powerplant");
                    break;
                  }
                case ClientLib.Base.ETechName.Refinery:
                  {
                    return Lang.gt("Refinery");
                    break;
                  }
                case ClientLib.Base.ETechName.Harvester_Crystal:
                  {
                    return Lang.gt("Harvester");
                    break;
                  }
                case ClientLib.Base.ETechName.Harvester:
                  {
                    return Lang.gt("Harvester");
                    break;
                  }
                case ClientLib.Base.ETechName.Silo:
                  {
                    return Lang.gt("Silo");
                    break;
                  }
                case ClientLib.Base.ETechName.Accumulator:
                  {
                    return Lang.gt("Accumulator");
                    break;
                  }
              }
              return "?";
            },
            collectData: function (bOnlyTopBuildings, bOnlyAffordableBuildings, oCityFilter, eSelectedResourceType) {
              try {
                MT_Cache.updateCityCache();
                this.Cache = {};
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Tiberium) {
                  this.Cache[ClientLib.Base.EResourceType.Tiberium] = {};
                }
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Crystal) {
                  this.Cache[ClientLib.Base.EResourceType.Crystal] = {};
                }
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Power) {
                  this.Cache[ClientLib.Base.EResourceType.Power] = {};
                }
                if (eSelectedResourceType == ClientLib.Base.EResourceType.Gold) {
                  this.Cache[ClientLib.Base.EResourceType.Gold] = {};
                }
                for (var cname in MT_Cache.Cities) {
                  var city = MT_Cache.Cities[cname].Object;
                  if (oCityFilter[cname] == false) {
                    continue;
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Tiberium) {
                    this.Cache[ClientLib.Base.EResourceType.Tiberium][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.TiberiumPackageSize, ClientLib.Base.EModifierType.TiberiumProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Crystal) {
                    this.Cache[ClientLib.Base.EResourceType.Crystal][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Harvester, ClientLib.Base.ETechName.Silo], ClientLib.Base.EModifierType.CrystalPackageSize, ClientLib.Base.EModifierType.CrystalProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Power) {
                    this.Cache[ClientLib.Base.EResourceType.Power][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.PowerPlant, ClientLib.Base.ETechName.Accumulator], ClientLib.Base.EModifierType.PowerPackageSize, ClientLib.Base.EModifierType.PowerProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                  if (eSelectedResourceType == ClientLib.Base.EResourceType.Gold) {
                    this.Cache[ClientLib.Base.EResourceType.Gold][cname] = this.getPrioList(city, [ClientLib.Base.ETechName.Refinery, ClientLib.Base.ETechName.PowerPlant], ClientLib.Base.EModifierType.CreditsPackageSize, ClientLib.Base.EModifierType.CreditsProduction, bOnlyTopBuildings, bOnlyAffordableBuildings);
                  }
                }
              } catch (e) {
                console.log("HuffyTools.UpgradePriority.collectData: ", e);
              }
            }
          }
        });

        var __MTCity_initialized = false; //k undeclared

        var Lang = MaelstromTools.Language.getInstance();
        var MT_Cache = MaelstromTools.Cache.getInstance();
        var MT_Base = MaelstromTools.Base.getInstance();
        var MT_Preferences = MaelstromTools.Preferences.getInstance();
        MT_Preferences.readOptions();

        if (!webfrontend.gui.region.RegionCityMenu.prototype.__MTCity_showMenu) {
          webfrontend.gui.region.RegionCityMenu.prototype.__MTCity_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
        }
        webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selectedVisObject) {

          MT_Cache.SelectedBaseForMenu = selectedVisObject;
          var baseStatusOverview = MaelstromTools.BaseStatus.getInstance();

          if (__MTCity_initialized == false) {
            //console.log(selectedBase.get_Name());
            __MTCity_initialized = true;
            baseStatusOverview.CityMenuButtons = [];

            for (var k in this) {
              try {
                if (this.hasOwnProperty(k)) {
                  if (this[k] && this[k].basename == "Composite") {
                    var button = new qx.ui.form.Button(Lang.gt("Calibrate support"));
                    button.addListener("execute", function (e) {
                      MaelstromTools.Util.calibrateWholeSupportOnSelectedBase();
                    }, this);

                    this[k].add(button);
                    baseStatusOverview.CityMenuButtons.push(button);
                  }
                }
              } catch (e) {
                console.log("webfrontend.gui.region.RegionCityMenu.prototype.showMenu: ", e);
              }
            }
          }

          var isAllowed = MaelstromTools.Util.checkIfSupportIsAllowed(MT_Cache.SelectedBaseForMenu);

          for (var x = 0; x < baseStatusOverview.CityMenuButtons.length; ++x) {
            baseStatusOverview.CityMenuButtons[x].setVisibility(isAllowed ? 'visible' : 'excluded');
          }
          this.__MTCity_showMenu(selectedVisObject);
        };

        if (MT_Preferences.Settings.showLoot) {
          // Wrap onCitiesChange method
          if (!webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__MTCity_NPCCamp) {
            webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__MTCity_NPCCamp = webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange;
          }
          webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange = function () {
            MT_Base.updateLoot(1, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionNPCCampStatusInfo.getInstance());
            return this.__MTCity_NPCCamp();
          };

          if (!webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__MTCity_NPCBase) {
            webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__MTCity_NPCBase = webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange;
          }
          webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange = function () {
            MT_Base.updateLoot(2, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance());
            //MT_Base.updateLoot(2, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(), webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance());
            return this.__MTCity_NPCBase();
          };

          if (!webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__MTCity_City) {
            webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__MTCity_City = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
          }
          webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function () {
            MT_Base.updateLoot(3, ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(), webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance());
            //MT_Base.updateLoot(3, ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(), webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance());
            return this.__MTCity_City();
          };
        }

      }
    } catch (e) {
      console.log("createMaelstromTools: ", e);
    }

    function MaelstromTools_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
          createMaelstromTools();
          MaelstromTools.Base.getInstance().initialize();
        } else {
          setTimeout(MaelstromTools_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log("MaelstromTools_checkIfLoaded: ", e);
      }
    }
    setTimeout(MaelstromTools_checkIfLoaded, 1000);
  };

  try {
    var MaelstromScript = document.createElement("script");
    MaelstromScript.innerHTML = "(" + MaelstromTools_main.toString() + ")();";
    MaelstromScript.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(MaelstromScript);
  } catch (e) {
    console.log("MaelstromTools: init error: ", e);
  }
})();

/***********************************************************************************
C&C Tiberium Alliances PvP/PvE Ranking
***********************************************************************************/
// ==UserScript==
// @name           C&C Tiberium Alliances PvP/PvE Ranking, POI Holding and split base kill score.
// @author         ViolentVin, KRS_L, YiannisS
// @description    Shows PvP/PvE Ranking of the players alliance in the PlayerWindow, also adds POIs the Player holds and splits pve/pvp score.
// @namespace      pvp_rank_mod
// @grant          none
// @version        1.7.3
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

/***********************************************************************************
WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army
***********************************************************************************/
// ==UserScript==
// @description     Upgrade your Base,Defense Army to a specific Level.
// @author          Eistee
// @version         2017.06.06

// @icon            http://eistee82.github.io/ta_simv2/icon.png
// ==/UserScript==
/**
 *  License: CC-BY-NC-SA 3.0
 *
 *  thx to TheStriker for his API knowledge.
 *
 */
(function () {
	var injectFunction = function () {
		function createClasses() {
			qx.Class.define("Upgrade", {
				type: "singleton",
				extend: qx.core.Object,
				construct: function () {
					try {
						var qxApp = qx.core.Init.getApplication();

						var stats = document.createElement('img');
						stats.src = "http://goo.gl/BuvwKs"; // http://goo.gl/#analytics/goo.gl/BuvwKs/all_time

						var btnUpgrade = new qx.ui.form.Button(qxApp.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png").set({
							toolTipText: qxApp.tr("tnf:toggle upgrade mode"),
							alignY: "middle",
							show: "icon",
							width : 60,
							allowGrowX : false,
							allowGrowY : false,
							appearance : "button"
						});
						btnUpgrade.addListener("click", this.toggleWindow, this);

						var btnTrade = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_TRADE);
						btnTrade.getLayoutParent().addAfter(btnUpgrade, btnTrade);
					} catch (e) {
						console.log("Error setting up Upgrade Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					toggleWindow: function () {
						if (Upgrade.Window.getInstance().isVisible()) Upgrade.Window.getInstance().close();
						else Upgrade.Window.getInstance().open();
					}
				}
			});
			qx.Class.define("Upgrade.Window", {
				type: "singleton",
				extend: qx.ui.window.Window,
				construct: function () {
					try {
						this.base(arguments);
						this.set({
							layout: new qx.ui.layout.VBox().set({ spacing: 0 }),
							contentPadding: 5,
							contentPaddingTop: 0,
							allowMaximize: false,
							showMaximize: false,
							allowMinimize: false,
							showMinimize: false,
							resizable: false
						});
						this.moveTo(124, 31);
						this.getChildControl("icon").set({ width : 18, height : 18, scale : true, alignY : "middle" });

						this.add(new Upgrade.Current());
						this.add(new Upgrade.All());
						this.add(new Upgrade.Repairtime());

						this.addListener("appear", this.onOpen, this);
						this.addListener("close", this.onClose, this);
					} catch (e) {
						console.log("Error setting up Upgrade.Window Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					onOpen: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
					},
					onClose: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
					},
					onViewModeChanged: function (oldMode, newMode) {
						if (oldMode !== newMode) {
							var qxApp = qx.core.Init.getApplication();
							switch (newMode) {
							case ClientLib.Vis.Mode.City:
								this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:base"));
								this.setIcon("FactionUI/icons/icon_arsnl_base_buildings.png");
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:defense"));
								this.setIcon("FactionUI/icons/icon_def_army_points.png");
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								this.setCaption(qxApp.tr("tnf:toggle upgrade mode") + ": " + qxApp.tr("tnf:offense"));
								this.setIcon("FactionUI/icons/icon_army_points.png");
								break;
							default:
								this.close();
								break;
							}
						}
					}
				}
			});
			qx.Class.define("Upgrade.All", {
				extend: qx.ui.container.Composite,
				construct: function () {
					try {
						qx.ui.container.Composite.call(this);
						this.set({
							layout : new qx.ui.layout.VBox(5),
							padding: 5,
							decorator: "pane-light-opaque"
						});
						this.add(this.title = new qx.ui.basic.Label("").set({ alignX: "center", font: "font_size_14_bold" }));

						var level = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
						level.add(new qx.ui.basic.Label(this.tr("tnf:level:")).set({ alignY: "middle" }));
						level.add(this.txtLevel = new qx.ui.form.Spinner(1).set({ maximum: 150, minimum: 1 }));
						this.txtLevel.addListener("changeValue", this.onInput, this);
						level.add(this.btnLevel = new qx.ui.form.Button(this.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png"));
						this.btnLevel.addListener("execute", this.onUpgrade, this);
						this.add(level);

						var requires = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
						requires.add(new qx.ui.basic.Label(this.tr("tnf:requires:")));
						var resource = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
						resource.add(this.resTiberium = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_tiberium.png"));
						this.resTiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
						this.resTiberium.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resChrystal = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_chrystal.png"));
						this.resChrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
						this.resChrystal.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resPower = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_power.png"));
						this.resPower.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
						this.resPower.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						requires.add(resource);
						this.add(requires);

						this.addListener("appear", this.onAppear, this);
						this.addListener("disappear", this.onDisappear, this);
					} catch (e) {
						console.log("Error setting up Upgrade.All Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					title: null,
					txtLevel: null,
					btnLevel: null,
					resTiberium: null,
					resChrystal: null,
					resPower: null,
					onAppear: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
						this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
					},
					onDisappear: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
					},
					onViewModeChanged: function (oldViewMode, newViewMode) {
						if (oldViewMode !== newViewMode) {
							switch (newViewMode) {
							case ClientLib.Vis.Mode.City:
								this.title.setValue(this.tr("All buildings"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								this.title.setValue(this.tr("All defense units"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								this.title.setValue(this.tr("All army units"));
								this.reset();
								break;
							}
						}
					},
					onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
						if (oldCurrentCity !== newCurrentCity) {
							this.reset();
						}
					},
					getResTime: function (need, type) {
						var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var Alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						need -= CurrentOwnCity.GetResourceCount(type);
						need = Math.max(0, need);
						var Con = CurrentOwnCity.GetResourceGrowPerHour(type);
						var Bonus = CurrentOwnCity.get_hasCooldown() ? 0 : CurrentOwnCity.GetResourceBonusGrowPerHour(type);
						var POI = CurrentOwnCity.get_IsGhostMode() ? 0 : Alliance.GetPOIBonusFromResourceType(type);
						return (need <= 0 ? 0 : need / (Con + Bonus + POI) * 3600);
					},
					getUpgradeCostsToLevel: function (newLevel) {
						if (newLevel > 0) {
							switch (ClientLib.Vis.VisMain.GetInstance().get_Mode()) {
							case ClientLib.Vis.Mode.City:
								return ClientLib.API.City.GetInstance().GetUpgradeCostsForAllBuildingsToLevel(newLevel);
							case ClientLib.Vis.Mode.DefenseSetup:
								return ClientLib.API.Defense.GetInstance().GetUpgradeCostsForAllUnitsToLevel(newLevel);
							case ClientLib.Vis.Mode.ArmySetup:
								return ClientLib.API.Army.GetInstance().GetUpgradeCostsForAllUnitsToLevel(newLevel);
							}
						}
						return null;
					},
					getLowLevel: function () {
						for (var newLevel = 1, Tib = 0, Cry = 0, Pow = 0; Tib === 0 && Cry === 0 && Pow === 0 && newLevel < 1000; newLevel++) {
							var costs = this.getUpgradeCostsToLevel(newLevel);
							if (costs !== null) {
								for (var i = 0; i < costs.length; i++) {
									var uCosts = costs[i];
									var cType = parseInt(uCosts.Type, 10);
									switch (cType) {
									case ClientLib.Base.EResourceType.Tiberium:
										Tib += uCosts.Count;
										break;
									case ClientLib.Base.EResourceType.Crystal:
										Cry += uCosts.Count;
										break;
									case ClientLib.Base.EResourceType.Power:
										Pow += uCosts.Count;
										break;
									}
								}
							}
						}
						return (newLevel === 1000?0:(newLevel - 1));
					},
					reset: function () {
						var LowLevel = this.getLowLevel();
						if (LowLevel > 0) {
							this.txtLevel.setMinimum(LowLevel);
							this.txtLevel.setMaximum(LowLevel + 50);
							this.txtLevel.setValue(LowLevel);
							this.txtLevel.setEnabled(true);
							this.btnLevel.setEnabled(true);
						} else {
							this.txtLevel.setMinimum(0);
							this.txtLevel.setMaximum(0);
							this.txtLevel.resetValue();
							this.txtLevel.setEnabled(false);
							this.btnLevel.setEnabled(false);
						}
						this.onInput();
					},
					onTick: function () {
						this.onInput();
					},
					onInput: function () {
						var newLevel = parseInt(this.txtLevel.getValue(), 10);
						var costs = this.getUpgradeCostsToLevel(newLevel);
						if (newLevel > 0 && costs !== null) {
							for (var i = 0, Tib = 0, Cry = 0, Pow = 0, TibTime = 0, CryTime = 0, PowTime = 0; i < costs.length; i++) {
								var uCosts = costs[i];
								switch (parseInt(uCosts.Type, 10)) {
								case ClientLib.Base.EResourceType.Tiberium:
									Tib += uCosts.Count;
									TibTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Tiberium);
									break;
								case ClientLib.Base.EResourceType.Crystal:
									Cry += uCosts.Count;
									CryTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Crystal);
									break;
								case ClientLib.Base.EResourceType.Power:
									Pow += uCosts.Count;
									PowTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Power);
									break;
								}
							}
							this.resTiberium.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Tib) + (TibTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(TibTime) : ""));
							this.resTiberium.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Tib));
							if (Tib === 0) this.resTiberium.exclude();
							else this.resTiberium.show();
							this.resChrystal.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Cry) + (CryTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(CryTime) : ""));
							this.resChrystal.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Cry));
							if (Cry === 0) this.resChrystal.exclude();
							else this.resChrystal.show();
							this.resPower.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Pow) + (PowTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(PowTime) : ""));
							this.resPower.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Pow));
							if (Pow === 0) this.resPower.exclude();
							else this.resPower.show();
						} else {
							this.resTiberium.setLabel("-");
							this.resTiberium.resetToolTipText();
							this.resTiberium.show();
							this.resChrystal.setLabel("-");
							this.resChrystal.resetToolTipText();
							this.resChrystal.show();
							this.resPower.setLabel("-");
							this.resPower.resetToolTipText();
							this.resPower.show();
						}
					},
					onUpgrade: function () {
						var newLevel = parseInt(this.txtLevel.getValue(), 10);
						if (newLevel > 0) {
							switch (ClientLib.Vis.VisMain.GetInstance().get_Mode()) {
							case ClientLib.Vis.Mode.City:
								ClientLib.API.City.GetInstance().UpgradeAllBuildingsToLevel(newLevel);
								this.reset();
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								ClientLib.API.Defense.GetInstance().UpgradeAllUnitsToLevel(newLevel);
								this.reset();
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								ClientLib.API.Army.GetInstance().UpgradeAllUnitsToLevel(newLevel);
								this.reset();
								break;
							}
						}
					}
				}
			});
			qx.Class.define("Upgrade.Current", {
				extend: qx.ui.container.Composite,
				construct: function () {
					try {
						qx.ui.container.Composite.call(this);
						this.set({
							layout : new qx.ui.layout.VBox(5),
							padding: 5,
							decorator: "pane-light-opaque"
						});
						this.add(this.title = new qx.ui.basic.Label("").set({ alignX: "center", font: "font_size_14_bold" }));
						this.add(this.txtSelected = new qx.ui.basic.Label("").set({ alignX: "center" }));

						var level = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
						level.add(new qx.ui.basic.Label(this.tr("tnf:level:")).set({ alignY: "middle" }));
						level.add(this.txtLevel = new qx.ui.form.Spinner(1).set({ maximum: 150, minimum: 1 }));
						this.txtLevel.addListener("changeValue", this.onInput, this);
						level.add(this.btnLevel = new qx.ui.form.Button(this.tr("tnf:toggle upgrade mode"), "FactionUI/icons/icon_building_detail_upgrade.png"));
						this.btnLevel.addListener("execute", this.onUpgrade, this);
						this.add(level);

						var requires = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
						requires.add(new qx.ui.basic.Label(this.tr("tnf:requires:")));
						var resource = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
						resource.add(this.resTiberium = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_tiberium.png"));
						this.resTiberium.setToolTipIcon("webfrontend/ui/common/icn_res_tiberium.png");
						this.resTiberium.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resChrystal = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_chrystal.png"));
						this.resChrystal.setToolTipIcon("webfrontend/ui/common/icn_res_chrystal.png");
						this.resChrystal.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						resource.add(this.resPower = new qx.ui.basic.Atom("-", "webfrontend/ui/common/icn_res_power.png"));
						this.resPower.setToolTipIcon("webfrontend/ui/common/icn_res_power.png");
						this.resPower.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						requires.add(resource);
						this.add(requires);

						this.addListener("appear", this.onAppear, this);
						this.addListener("disappear", this.onDisappear, this);
					} catch (e) {
						console.log("Error setting up Upgrade.Current Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					title: null,
					txtSelected: null,
					txtLevel: null,
					btnLevel: null,
					resTiberium: null,
					resChrystal: null,
					resPower: null,
					Selection: null,
					onAppear: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "SelectionChange", ClientLib.Vis.SelectionChange, this, this.onSelectionChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
						this.onViewModeChanged(null, ClientLib.Vis.VisMain.GetInstance().get_Mode());
					},
					onDisappear: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.onViewModeChanged);
						phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "SelectionChange", ClientLib.Vis.SelectionChange, this, this.onSelectionChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
					},
					onViewModeChanged: function (oldViewMode, newViewMode) {
						if (oldViewMode !== newViewMode) {
							switch (newViewMode) {
							case ClientLib.Vis.Mode.City:
								this.title.setValue(this.tr("Selected building"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.DefenseSetup:
								this.title.setValue(this.tr("Selected defense unit"));
								this.reset();
								break;
							case ClientLib.Vis.Mode.ArmySetup:
								this.title.setValue(this.tr("Selected army unit"));
								this.reset();
								break;
							}
						}
					},
					onSelectionChange: function (oldSelection, newSelection) {
						if (newSelection !== null) {
							var name, level;
							switch (newSelection.get_VisObjectType()) {
							case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
								this.Selection = newSelection;
								name = newSelection.get_BuildingName();
								level = newSelection.get_BuildingLevel();
								this.txtSelected.setValue(name + " (" + level + ")");
								this.txtLevel.setMinimum(level + 1);
								this.txtLevel.setMaximum(level + 51);
								this.txtLevel.setValue(level + 1);
								this.txtLevel.setEnabled(true);
								this.btnLevel.setEnabled(true);
								this.onInput();
								break;
							case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
							case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
								this.Selection = newSelection;
								name = newSelection.get_UnitName();
								level = newSelection.get_UnitLevel();
								this.txtSelected.setValue(name + " (" + level + ")");
								this.txtLevel.setMinimum(level + 1);
								this.txtLevel.setMaximum(level + 51);
								this.txtLevel.setValue(level + 1);
								this.txtLevel.setEnabled(true);
								this.btnLevel.setEnabled(true);
								this.onInput();
								break;
							}
						}
					},
					onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
						if (oldCurrentCity !== newCurrentCity) {
							this.reset();
						}
					},
					getResTime: function (need, type) {
						var CurrentOwnCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var Alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						need -= CurrentOwnCity.GetResourceCount(type);
						need = Math.max(0, need);
						var Con = CurrentOwnCity.GetResourceGrowPerHour(type);
						var Bonus = CurrentOwnCity.get_hasCooldown() ? 0 : CurrentOwnCity.GetResourceBonusGrowPerHour(type);
						var POI = CurrentOwnCity.get_IsGhostMode() ? 0 : Alliance.GetPOIBonusFromResourceType(type);
						return (need <= 0 ? 0 : need / (Con + Bonus + POI) * 3600);
					},
					getUpgradeCostsToLevel: function (unit, newLevel) {
						var costs = null;
						if (unit !== null && newLevel > 0) {
							switch (unit.get_VisObjectType()) {
							case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
								if (newLevel > unit.get_BuildingLevel())
									costs = ClientLib.API.City.GetInstance().GetUpgradeCostsForBuildingToLevel(unit.get_BuildingDetails(), newLevel);
								break;
							case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
								if (newLevel > unit.get_UnitLevel())
									costs = ClientLib.API.Defense.GetInstance().GetUpgradeCostsForUnitToLevel(unit.get_UnitDetails(), newLevel);
								break;
							case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
								if (newLevel > unit.get_UnitLevel())
									costs = ClientLib.API.Army.GetInstance().GetUpgradeCostsForUnitToLevel(unit.get_UnitDetails(), newLevel);
								break;
							}
						}
						return costs;
					},
					reset: function () {
						this.Selection = null;
						this.txtSelected.setValue("-");
						this.txtLevel.setMinimum(0);
						this.txtLevel.setMaximum(0);
						this.txtLevel.resetValue();
						this.txtLevel.setEnabled(false);
						this.btnLevel.setEnabled(false);
						this.onInput();
					},
					onTick: function () {
						this.onInput();
					},
					onInput: function () {
						var costs = this.getUpgradeCostsToLevel(this.Selection, parseInt(this.txtLevel.getValue(), 10));
						if (costs !== null) {
							for (var i = 0, Tib = 0, Cry = 0, Pow = 0, TibTime = 0, CryTime = 0, PowTime = 0; i < costs.length; i++) {
								var uCosts = costs[i];
								switch (parseInt(uCosts.Type, 10)) {
								case ClientLib.Base.EResourceType.Tiberium:
									Tib += uCosts.Count;
									TibTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Tiberium);
									break;
								case ClientLib.Base.EResourceType.Crystal:
									Cry += uCosts.Count;
									CryTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Crystal);
									break;
								case ClientLib.Base.EResourceType.Power:
									Pow += uCosts.Count;
									PowTime += this.getResTime(uCosts.Count, ClientLib.Base.EResourceType.Power);
									break;
								}
							}
							this.resTiberium.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Tib) + (TibTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(TibTime) : ""));
							this.resTiberium.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Tib));
							if (Tib === 0) this.resTiberium.exclude();
							else this.resTiberium.show();
							this.resChrystal.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Cry) + (CryTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(CryTime) : ""));
							this.resChrystal.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Cry));
							if (Cry === 0) this.resChrystal.exclude();
							else this.resChrystal.show();
							this.resPower.setLabel(phe.cnc.gui.util.Numbers.formatNumbersCompact(Pow) + (PowTime > 0 ? " @ " + phe.cnc.Util.getTimespanString(PowTime) : ""));
							this.resPower.setToolTipText(phe.cnc.gui.util.Numbers.formatNumbers(Pow));
							if (Pow === 0) this.resPower.exclude();
							else this.resPower.show();
						} else {
							this.resTiberium.setLabel("-");
							this.resTiberium.resetToolTipText();
							this.resTiberium.show();
							this.resChrystal.setLabel("-");
							this.resChrystal.resetToolTipText();
							this.resChrystal.show();
							this.resPower.setLabel("-");
							this.resPower.resetToolTipText();
							this.resPower.show();
						}
					},
					onUpgrade: function() {
						var newLevel = parseInt(this.txtLevel.getValue(), 10);
						if (newLevel > 0 && this.Selection !== null) {
							switch (this.Selection.get_VisObjectType()) {
							case ClientLib.Vis.VisObject.EObjectType.CityBuildingType:
								if (newLevel > this.Selection.get_BuildingLevel()) {
									ClientLib.API.City.GetInstance().UpgradeBuildingToLevel(this.Selection.get_BuildingDetails(), newLevel);
									this.onSelectionChange(null, this.Selection);
								}
								break;
							case ClientLib.Vis.VisObject.EObjectType.DefenseUnitType:
								if (newLevel > this.Selection.get_UnitLevel()) {
									ClientLib.API.Defense.GetInstance().UpgradeUnitToLevel(this.Selection.get_UnitDetails(), newLevel);
									this.onSelectionChange(null, this.Selection);
								}
								break;
							case ClientLib.Vis.VisObject.EObjectType.ArmyUnitType:
								if (newLevel > this.Selection.get_UnitLevel()) {
									ClientLib.API.Army.GetInstance().UpgradeUnitToLevel(this.Selection.get_UnitDetails(), newLevel);
									this.onSelectionChange(null, this.Selection);
								}
								break;
							}
						}
					}
				}
			});
			qx.Class.define("Upgrade.Repairtime", {
				extend: qx.ui.container.Composite,
				construct: function () {
					try {
						qx.ui.container.Composite.call(this);
						this.set({
							layout : new qx.ui.layout.VBox(5),
							padding: 5,
							decorator: "pane-light-opaque"
						});
						this.add(this.title = new qx.ui.basic.Label(this.tr("tnf:repair points")).set({ alignX: "center", font: "font_size_14_bold" }));
						this.add(this.grid = new qx.ui.container.Composite(new qx.ui.layout.Grid()));

						this.grid.add(this.basRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_base_buildings.png").set({toolTipText: this.tr("tnf:base")}), {row: 0, column: 0});
						this.basRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 0, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 0, column: 4});
						this.grid.add(this.btnBuildings = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 0, column: 6});
						this.btnBuildings.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnBuildings.addListener("execute", function () { this.upgradeBuilding(ClientLib.Base.ETechName.Construction_Yard); }, this);

						this.grid.add(this.infRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_squad.png").set({toolTipText: this.tr("tnf:infantry repair title")}), {row: 1, column: 0});
						this.infRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 1, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 1, column: 4});
						this.grid.add(this.btnInfantry = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 1, column: 6});
						this.btnInfantry.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnInfantry.addListener("execute", function () { this.upgradeBuilding(ClientLib.Base.ETechName.Barracks); }, this);

						this.grid.add(this.vehRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_vehicle.png").set({toolTipText: this.tr("tnf:vehicle repair title")}), {row: 2, column: 0});
						this.vehRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 2, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 2, column: 4});
						this.grid.add(this.btnVehicle = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 2, column: 6});
						this.btnVehicle.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnVehicle.addListener("execute", function () { this.upgradeBuilding(ClientLib.Base.ETechName.Factory); }, this);

						this.grid.add(this.airRT = new qx.ui.basic.Atom("", "FactionUI/icons/icon_arsnl_off_plane.png").set({toolTipText: this.tr("tnf:aircraft repair title")}), {row: 3, column: 0});
						this.airRT.getChildControl("icon").set({ width: 18, height: 18, scale: true, alignY: "middle" });
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 3, column: 2});
						this.grid.add(new qx.ui.basic.Label("").set({ alignX: "right", alignY: "middle" }), {row: 3, column: 4});
						this.grid.add(this.btnAircraft = new qx.ui.form.Button(null, "FactionUI/icons/icon_building_detail_upgrade.png").set({toolTipText: this.tr("tnf:toggle upgrade mode"), width: 25, maxHeight: 17, alignY: "middle", show: "icon", iconPosition: "top", appearance: "button-addpoints"}), {row: 3, column: 6});
						this.btnAircraft.getChildControl("icon").set({width: 14, height: 14, scale: true});
						this.btnAircraft.addListener("execute", function () { this.upgradeBuilding(ClientLib.Base.ETechName.Airport); }, this);

						this.grid.getLayout().setRowFlex(0, 0);
						this.grid.getLayout().setRowFlex(1, 0);
						this.grid.getLayout().setRowFlex(2, 0);
						this.grid.getLayout().setRowFlex(3, 0);
						this.grid.getLayout().setColumnFlex(1, 200);
						this.grid.getLayout().setColumnFlex(3, 200);
						this.grid.getLayout().setColumnFlex(5, 200);

						this.addListener("appear", this.onAppear, this);
						this.addListener("disappear", this.onDisappear, this);
					} catch (e) {
						console.log("Error setting up Upgrade.Repairtime Constructor: ");
						console.log(e.toString());
					}
				},
				destruct: function () {},
				members: {
					title: null,
					grid: null,
					btnBuildings: null,
					btnInfantry: null,
					btnVehicle: null,
					btnAircraft: null,
					onAppear: function () {
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().addListener("uiTick", this.onTick, this);
						this.getInfo();
					},
					onDisappear: function () {
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentOwnChange", ClientLib.Data.CurrentOwnCityChange, this, this.onCurrentCityChange);
						phe.cnc.Util.detachNetEvent(ClientLib.Data.MainData.GetInstance().get_Cities(), "CurrentChange", ClientLib.Data.CurrentCityChange, this, this.onCurrentCityChange);
						phe.cnc.base.Timer.getInstance().removeListener("uiTick", this.onTick, this);
					},
					onTick: function () {
						this.getInfo();
					},
					onCurrentCityChange: function (oldCurrentCity, newCurrentCity) {
						if (oldCurrentCity !== newCurrentCity) {
							this.getInfo();
						}
					},
					canUpgradeBuilding: function (ETechName) {
						var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var building = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ETechName);
						if (building) {
							var ResourceRequirements_Obj = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(building.get_CurrentLevel() + 1, building.get_UnitGameData_Obj());
							return (building.get_CurrentDamage() === 0 && !city.get_IsLocked() && city.HasEnoughResources(ResourceRequirements_Obj));
						} else return false;
					},
					upgradeBuilding: function (ETechName) {
						var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
						var building = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ETechName);
						if (building) {
							ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", {
								cityid : city.get_Id(),
								posX : building.get_CoordX(),
								posY : building.get_CoordY()
							}, null, null, true);
						}
					},
					getInfo: function () {
						try {
							var lvl, win, city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();

							lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard).get_CurrentLevel();
							win = (city.get_CityBuildingsData().GetFullRepairTime(true) - city.get_CityBuildingsData().GetFullRepairTime(false)) * -1;
							this.grid.getLayout().getCellWidget(0, 0).setLabel("("+ lvl +")");
							this.grid.getLayout().getCellWidget(0, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityBuildingsData().GetFullRepairTime()));
							this.grid.getLayout().getCellWidget(0, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));

							if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false) > 0) {
								lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Barracks).get_CurrentLevel();
								win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false)) * -1;
								this.grid.getLayout().getCellWidget(1, 0).setLabel("("+ lvl +")");
								this.grid.getLayout().getCellWidget(1, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false)));
								this.grid.getLayout().getCellWidget(1, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));
								this.grid.getLayout().setRowHeight(1, 18);
							} else {
								this.grid.getLayout().setRowHeight(1, 0);
							}

							if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false) > 0) {
								lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Factory).get_CurrentLevel();
								win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false)) * -1;
								this.grid.getLayout().getCellWidget(2, 0).setLabel("("+ lvl +")");
								this.grid.getLayout().getCellWidget(2, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false)));
								this.grid.getLayout().getCellWidget(2, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));
								this.grid.getLayout().setRowHeight(2, 18);
							} else {
								this.grid.getLayout().setRowHeight(2, 0);
							}

							if (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false) > 0) {
								lvl = city.get_CityBuildingsData().GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Airport).get_CurrentLevel();
								win = (city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, true) - city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false)) * -1;
								this.grid.getLayout().getCellWidget(3, 0).setLabel("("+ lvl +")");
								this.grid.getLayout().getCellWidget(3, 2).setValue(phe.cnc.Util.getTimespanString(city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false)));
								this.grid.getLayout().getCellWidget(3, 4).setValue("-"+ phe.cnc.Util.getTimespanString(win));
								this.grid.getLayout().setRowHeight(3, 18);
							} else {
								this.grid.getLayout().setRowHeight(3, 0);
							}

							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Construction_Yard)) this.btnBuildings.setEnabled(true);
							else this.btnBuildings.setEnabled(false);
							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Barracks)) this.btnInfantry.setEnabled(true);
							else this.btnInfantry.setEnabled(false);
							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Factory)) this.btnVehicle.setEnabled(true);
							else this.btnVehicle.setEnabled(false);
							if (this.canUpgradeBuilding(ClientLib.Base.ETechName.Airport)) this.btnAircraft.setEnabled(true);
							else this.btnAircraft.setEnabled(false);
						} catch (e) {
							console.log("Error in Upgrade.Repairtime.getInfo: ");
							console.log(e.toString());
						}
					}
				}
			});

		}
		function translation() {
			var localeManager = qx.locale.Manager.getInstance();

			// Default language is english (en)
			// Available Languages are: ar,ce,cs,da,de,en,es,fi,fr,hu,id,it,nb,nl,pl,pt,ro,ru,sk,sv,ta,tr,uk
			// You can send me translations so I can include them in the Script.

			// German
			localeManager.addTranslation("de", {
				"Selected building": "Markiertes Gebäude",
				"All buildings": "Alle Gebäude",
				"Selected defense unit": "Markierte Abwehrstellung",
				"All defense units": "Alle Abwehrstellungen",
				"Selected army unit": "Markierte Armee-Einheit",
				"All army units": "Alle Armee-Einheiten"
			});

			// Hungarian
			localeManager.addTranslation("hu", {
				"Selected building": "Kiválasztott létesítmény",
				"All buildings": "Összes létesítmény",
				"Selected defense unit": "Kiválasztott védelmi egység",
				"All defense units": "Minden védelmi egység",
				"Selected army unit": "Kiválasztott katonai egység",
				"All army units": "Minden katonai egység"
			});

			// Russian
			localeManager.addTranslation("ru", {
				"Selected building": "Вывбранное здание",
				"All buildings": "Все здания",
				"Selected defense unit": "Выбранный оборонный юнит",
				"All defense units": "Все оборонные юниты",
				"Selected army unit": "Выделенный юнит атаки",
				"All army units": "Все юниты атаки"
			});
		}
		function waitForGame() {
			try {
				if (typeof qx != 'undefined' && typeof qx.core != 'undfined' && typeof qx.core.Init != 'undefined') {
					var app = qx.core.Init.getApplication();
					if (app.initDone === true) {
						try {
							console.log("WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army: Loading");
							translation();
							createClasses();
							Upgrade.getInstance();
							console.log("WarChiefs - Tiberium Alliances Upgrade Base/Defense/Army: Loaded");
						} catch (e) {
							console.log(e);
						}
					} else {
						window.setTimeout(waitForGame, 1000);
					}
				} else {
					window.setTimeout(waitForGame, 1000);
				}
			} catch (e) {
				console.log(e);
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

/***********************************************************************************
CENTER DRIVEN Base Info
***********************************************************************************/
// ==UserScript==
// @name        CENTER DRIVEN Base Info (Basic)
// @description Provides basic offense and defense information regarding the player bases around you. It also displays your own bases repair time.
// @version     3.00
// @author      XDaast
// ==/UserScript==
(function () {
	var EnemyInfo_mainFunction = function () {

		function createTweak() {
			webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange_EnemyInfo = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
			webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function () {
				var widget = webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance();
				var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(ClientLib.Vis.VisMain.GetInstance().get_SelectedObject().get_Id());
				if (!widget.hasOwnProperty("offLevel")) {

					var offWidget = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 0));
					offWidget.setTextColor("orange");
					offWidget.setThemedFont("bold");
					offWidget.add(new qx.ui.basic.Label("-Basic Base Info-"), {
						row : 1,
						column : 0
					});
					offWidget.add(new qx.ui.basic.Label("Offense Level:"), {
						row : 2,
						column : 0
					});
					widget.offLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.offLevel, {
						row : 2,
						column : 1
					});
					offWidget.add(new qx.ui.basic.Label("Defense Level:"), {
						row : 3,
						column : 0
					});
					widget.defLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.defLevel, {
						row : 3,
						column : 1
					});
					widget.add(offWidget);
				}

				widget.offLevel.setValue(city.get_LvlOffense().toFixed(2));
				widget.defLevel.setValue(city.get_LvlDefense().toFixed(2));
				return this.onCitiesChange_EnemyInfo();
			}
		}

		function EnemyInfo_checkIfLoaded() {
			try {
				if (typeof qx !== "undefined" && qx.core.Init.getApplication() !== null && qx.core.Init.getApplication().getMenuBar() !== null) {
					createTweak();
				} else {
					setTimeout(EnemyInfo_checkIfLoaded, 1000);
				}
			} catch (e) {
				if (typeof console !== "undefined") {
					console.log(e + ": " + e.stack);
				} else if (window.opera) {
					opera.postError(e);
				} else {
					GM_log(e);
				}
			}
		}
		setTimeout(EnemyInfo_checkIfLoaded, 1000);
	};
	var EnemyInfoScript = document.createElement("script");
	var txt = EnemyInfo_mainFunction.toString();
	EnemyInfoScript.innerHTML = "(" + txt + ")();";
	EnemyInfoScript.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(EnemyInfoScript);
})();
(function () {
	var AllianceInfo_mainFunction = function () {

		function createTweak() {
		/*
		function FormatTimespan(value) {
                            var i;
                            var t = ClientLib.Vis.VisMain.FormatTimespan(value);
                            var colonCount = 0;
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') colonCount++;
                            }
                            var r = "";
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') {
                                    if (colonCount > 2) {
                                        r += "d ";
                                    } else {
                                        r += t.charAt(i);
                                    }
                                    colonCount--;
                                } else {
                                    r += t.charAt(i);
                                }
                            }
                            return r;
                        }
            */
			webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange_AllianceInfo = webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange;
			webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange = function () {
				var widget = webfrontend.gui.region.RegionCityStatusInfoAlliance.getInstance();
				var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(ClientLib.Vis.VisMain.GetInstance().get_SelectedObject().get_Id());
			/*
				var rt =  Math.min(city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf),
                                    city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh),
                                    city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir));
            */
				if (!widget.hasOwnProperty("offLevel")) {
					var offWidget = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 0));
					offWidget.setTextColor("#00e92d");
					offWidget.setThemedFont("bold");
					offWidget.add(new qx.ui.basic.Label("-Basic Alliance Base Info-"), {
						row : 1,
						column : 0
					});
					offWidget.add(new qx.ui.basic.Label("Offense Level:"), {
						row : 2,
						column : 0
					});
					widget.offLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.offLevel, {
						row : 2,
						column : 1
					});
					offWidget.add(new qx.ui.basic.Label("Defense Level:"), {
						row : 3,
						column : 0
					});
					widget.defLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.defLevel, {
						row : 3,
						column : 1
					});
					widget.add(offWidget);
				}
				widget.offLevel.setValue(city.get_LvlOffense().toFixed(2));
				widget.defLevel.setValue(city.get_LvlDefense().toFixed(2));
				//widget.base.setValue(city.get_LvlBase().toFixed(2));
				//widget.rt.setValue(rt.toFixed(2));
				//this.rt.setValue(FormatTimespan(rt));
				return this.onCitiesChange_AllianceInfo();
			}
		}

		function AllianceInfo_checkIfLoaded() {
			try {
				if (typeof qx !== "undefined" && qx.core.Init.getApplication() !== null && qx.core.Init.getApplication().getMenuBar() !== null) {
					createTweak();
				} else {
					setTimeout(AllianceInfo_checkIfLoaded, 1000);
				}
			} catch (e) {
				if (typeof console !== "undefined") {
					console.log(e + ": " + e.stack);
				} else if (window.opera) {
					opera.postError(e);
				} else {
					GM_log(e);
				}
			}
		}
		setTimeout(AllianceInfo_checkIfLoaded, 1000);
	};
	var AllianceInfoScript = document.createElement("script");
	var txt = AllianceInfo_mainFunction.toString();
	AllianceInfoScript.innerHTML = "(" + txt + ")();";
	AllianceInfoScript.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(AllianceInfoScript);
})();
(function () {
	var OwnInfo_mainFunction = function () {

		function createTweak() {
		function FormatTimespan(value) {
                            var i;
                            var t = ClientLib.Vis.VisMain.FormatTimespan(value);
                            var colonCount = 0;
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') colonCount++;
                            }
                            var r = "";
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') {
                                    if (colonCount > 2) {
                                        r += "d ";
                                    } else {
                                        r += t.charAt(i);
                                    }
                                    colonCount--;
                                } else {
                                    r += t.charAt(i);
                                }
                            }
                            return r;
                        }
			webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange_OwnInfo = webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange;
			webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange = function () {
				var widget = webfrontend.gui.region.RegionCityStatusInfoOwn.getInstance();
				var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(ClientLib.Vis.VisMain.GetInstance().get_SelectedObject().get_Id());
				var rt =  Math.min(city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf),
                                    city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh),
                                    city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir));
				if (!widget.hasOwnProperty("offLevel")) {

					var offWidget = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 0));
					offWidget.setTextColor("#00bfff");
					offWidget.setThemedFont("bold");
					offWidget.add(new qx.ui.basic.Label("-My Base Info-"), {
						row : 1,
						column : 0
					});
					offWidget.add(new qx.ui.basic.Label("Offense Level:"), {
						row : 2,
						column : 0
					});
					widget.offLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.offLevel, {
						row : 2,
						column : 1
					});
					offWidget.add(new qx.ui.basic.Label("Defense Level:"), {
						row : 3,
						column : 0
					});
					widget.defLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.defLevel, {
						row : 3,
						column : 1
					});
					offWidget.add(new qx.ui.basic.Label("Base Level:"), {
						row : 4,
						column : 0
					});
					widget.base = new qx.ui.basic.Label("");
					offWidget.add(widget.base, {
						row : 4,
						column : 1
					});
					offWidget.add(new qx.ui.basic.Label("Repair Time"), {
						row : 5,
						column : 0
					});
					widget.rt = new qx.ui.basic.Label("");
					offWidget.add(widget.rt, {
						row : 5,
						column : 1
					});

					widget.add(offWidget);
				}

				widget.offLevel.setValue(city.get_LvlOffense().toFixed(2));
				widget.defLevel.setValue(city.get_LvlDefense().toFixed(2));
				widget.base.setValue(city.get_LvlBase().toFixed(2));
				widget.rt.setValue(rt.toFixed(2));
				this.rt.setValue(FormatTimespan(rt));
				return this.onCitiesChange_OwnInfo();
			}
		}

		function OwnInfo_checkIfLoaded() {
			try {
				if (typeof qx !== "undefined" && qx.core.Init.getApplication() !== null && qx.core.Init.getApplication().getMenuBar() !== null) {
					createTweak();
				} else {
					setTimeout(OwnInfo_checkIfLoaded, 1000);
				}
			} catch (e) {
				if (typeof console !== "undefined") {
					console.log(e + ": " + e.stack);
				} else if (window.opera) {
					opera.postError(e);
				} else {
					GM_log(e);
				}
			}
		}
		setTimeout(OwnInfo_checkIfLoaded, 1000);
	};
	var OwnInfoScript = document.createElement("script");
	var txt = OwnInfo_mainFunction.toString();
	OwnInfoScript.innerHTML = "(" + txt + ")();";
	OwnInfoScript.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(OwnInfoScript);
})();

/***********************************************************************************
CnCTAOpt Link + Button
***********************************************************************************/
// ==UserScript==
// @version       1.0.7.6
// @name          CnC:TA CnCTAOpt Link
// @namespace     https://cnctaopt.com/
// @icon          https://cnctaopt.com/favicon.ico
// @description   Creates a "CnCTAOpt" button when selecting a base in Command & Conquer: Tiberium Alliances. The share button takes you to http://cnctaopt.com/ and fills in the selected base information so you can analyze or share the base.
// @author        zbluebugz
// @include       http*://*alliances*.com/*
// @include       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @homepage      https://github.com/zbluebugz/CnC-TA-Opt
// @updateURL     https://raw.githubusercontent.com/zbluebugz/CnC-TA-Opt/master/CnCTAOpt.link.user.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @contributor   zbluebugz (https://github.com/zbluebugz)
// ==/UserScript==
/*
    Original script for cncopt.com contributed by:
        @contributor   PythEch (http://userscripts.org/users/220246)
        @contributor   jerbri (http://userscripts.org/users/507954)
        @contributor   leo7044 (https://github.com/leo7044)
    Cloned and modified for cnctaopt.com
    1.0.7.3 2021-01: zbluebugz; rewrote/adapated various parts for cnctaopt.com;
    1.0.7.4 2021-02: zbluebugz; cnctaopt.com has SSL.
    1.0.7.5 2021-02: zbluebugz; changed "else GM_log(e);" to "else if (typeof GM_log != 'undefined') GM_log(e);"
    1.0.7.6 2021-02: zbluebugz; dropped unsafewindow and gm_log bits; simiplified fn cnctaoptLinkCheckIfLoaded() and error trapping;
    ***
    TODO:
        Infected units - needs testing.
    ***
*/
(function () {
    'use strict';
    const cnctaoptLink = function () {
        // link code version
        const cnctaopt_version = "1.0.7.6";
        // base / defense / offense - map units with cnctaopt's hotkeys.
        const base_unit_map = {
            /* GDI Buildings */
            "GDI_Construction Yard": "y", // construction yard
            "GDI_Power Plant": "p", // power plant
            "GDI_Refinery": "r", // refinery
            // "GDI_Trade Center": "u",
            "GDI_Silo": "s", // silo
            "GDI_Accumulator": "a", // accumulator
            "GDI_Command Center": "e", // command centre
            "GDI_Barracks": "b", // barracks
            "GDI_Factory": "f", // factory
            "GDI_Airport": "d", // airport
            "GDI_Defense HQ": "q", // defense hq
            "GDI_Defense Facility": "w", // defense facility
            "GDI_Support_Air": "i", // skystrike support
            "GDI_Support_Ion": "x", // ion cannon support
            "GDI_Support_Art": "z", // falcon support
            "GDI_Harvester": "h", // harvester (not in url - must be on tiberium or crystal)
            "GDI_Harvester_Crystal": "n", // harvester on crystal
            "GDI_Harvester_Tiberium": "j", // harvester on tiberium

            /* Nod Buildings */
            "NOD_Construction Yard": "y", // construction yard
            "NOD_Power Plant": "p", // power plant
            "NOD_Refinery": "r", // refinery
            // "NOD_Trade Center": "u",
            "NOD_Silo": "s", // silo
            "NOD_Accumulator": "a", // accumulator
            "NOD_Command Post": "e", // command centre
            "NOD_Barracks": "b", // hand of nod (barracks)
            "NOD_Factory": "f", // war factory (factory)
            "NOD_Airport": "d", // airfield / airport
            "NOD_Defense HQ": "q", // defense hq
            "NOD_Defense Facility": "w", // defense facility
            "NOD_Support_Air": "i", // fist of kane
            "NOD_Support_Ion": "x", // eye of kane
            "NOD_Support_Art": "z", // blade of kane
            "NOD_Harvester": "h", // harvester (not in url - must be on tiberium or crystal)
            "NOD_Harvester_Crystal": "n", // harvester on crystal
            "NOD_Harvester_Tiberium": "j", // harvester on tiberium

            /* Forgotten Buildings */
            "FOR_Construction Yard": "y", // construction yard
            "FOR_Refinery": "r", // refinery
            "FOR_Trade Center": "u", // trade centre
            "FOR_Silo": "s", // silo
            "FOR_Defense HQ": "q", // defense hq
            "FOR_Defense Facility": "w", // defense facility
            "FOR_Harvester_Crystal": "n", // harvester on crystal
            "FOR_Harvester_Tiberium": "j", // harvester on tiberium
            "FOR_Crystal Booster": "v", // adv crystal silo (booster)
            "FOR_Tiberium Booster": "o", // adv tiberium silo (booster)

            /* Forgotten Infected Buildings */
            "FOR_EVENT_Construction_Yard": "y",
            "FOR_GDI_Construction Yard": "y", // construction yard
            "FOR_GDI_Power Plant": "p", // power plant
            "FOR_GDI_Refinery": "r", // refinery
            // "GDI_Trade Center": "u",
            "FOR_GDI_Silo": "s", // silo
            "FOR_GDI_Accumulator": "a", // accumulator
            "FOR_GDI_Command Center": "e", // command centre
            "FOR_GDI_Barracks": "b", // barracks
            "FOR_GDI_Factory": "f", // factory
            "FOR_GDI_Airport": "d", // airport
            "FOR_GDI_Defense HQ": "q", // defense hq
            "FOR_GDI_Defense Facility": "w", // defense facility
            "FOR_GDI_Support_Air": "i", // skystrike support
            "FOR_GDI_Support_Ion": "x", // ion cannon support
            "FOR_GDI_Support_Art": "z", // falcon support
            "FOR_GDI_Harvester": "h", // harvester (not in url - must be on tiberium or crystal)
            "FOR_GDI_Harvester_Crystal": "n", // harvester on crystal
            "FOR_GDI_Harvester_Tiberium": "j", // harvester on tiberium

            "FOR_NOD_Construction Yard": "y", // construction yard
            "FOR_NOD_Power Plant": "p", // power plant
            "FOR_NOD_Refinery": "r", // refinery
            // "NOD_Trade Center": "u",
            "FOR_NOD_Silo": "s", // silo
            "FOR_NOD_Accumulator": "a", // accumulator
            "FOR_NOD_Command Post": "e", // command centre
            "FOR_NOD_Barracks": "b", // hand of nod (barracks)
            "FOR_NOD_Factory": "f", // war factory (factory)
            "FOR_NOD_Airport": "d", // airfield / airport
            "FOR_NOD_Defense HQ": "q", // defense hq
            "FOR_NOD_Defense Facility": "w", // defense facility
            "FOR_NOD_Support_Air": "i", // fist of kane
            "FOR_NOD_Support_Ion": "x", // eye of kane
            "FOR_NOD_Support_Art": "z", // blade of kane
            "FOR_NOD_Harvester": "h", // harvester (not in url - must be on tiberium or crystal)
            "FOR_NOD_Harvester_Crystal": "n", // harvester on crystal
            "FOR_NOD_Harvester_Tiberium": "j", // harvester on tiberium

            /* blanks */
            "": ""
        }

        const defense_unit_map = {
            /* GDI Defense Units */
            "GDI_Wall": "w", // wall
            "GDI_Def_Predator": "d", // predator
            "GDI_Turret": "m", // mg nest
            "GDI_Def_Pitbull": "p", // pitbull
            "GDI_Barbwire": "b", // barbwire
            "GDI_Def_Zone Trooper": "z", // zone trooper
            "GDI_Flak": "f", // flak
            "GDI_Def_Missile Squad": "q", // missile squad
            "GDI_Antitank Barrier": "t", // anti-tank barrier
            "GDI_Def_Sniper": "s", // sniper team
            "GDI_Cannon": "c", // guardian cannon
            "GDI_Def_APC Guardian": "g", // guardian
            "GDI_Art Tank": "a", // titan artillery (anti vehicle)
            "GDI_Art Air": "e", // sam site (anti air)
            "GDI_Art Inf": "r", // watchtower (anti infantry)

            /* Nod Defense Units */
            "NOD_Def_Wall": "w", // wall
            "NOD_Def_Scorpion Tank": "d", // scorpion
            "NOD_Def_MG Nest": "m", // mg nest
            "NOD_Def_Attack Bike": "p", // attack bike
            "NOD_Def_Barbwire": "b", // barbwire
            "NOD_Def_Black Hand": "z", // black hand
            "NOD_Def_Flak": "f", // flak
            "NOD_Def_Militant Rocket Soldiers": "q", // militant rocket squad
            "NOD_Def_Antitank Barrier": "t", // anti-tank barrier
            "NOD_Def_Confessor": "s", // confessor
            "NOD_Def_Cannon": "c", // beam cannon
            "NOD_Def_Reckoner": "g", // reckoner
            "NOD_Def_Art Tank": "a", // obelisk artillery (anti vehicle)
            "NOD_Def_Art Air": "e", // sam site (anti air)
            "NOD_Def_Art Inf": "r", // gatling cannon

            /* Forgotten Defense Units */
            "FOR_Wall": "w", // wall
            "FOR_Mammoth": "d", // mammoth
            "FOR_Turret_VS_Inf": "m", // mg nest
            "FOR_Veh_VS_Air": "p", // scrap bus
            "FOR_Barbwire_VS_Inf": "b", // barbwire
            "FOR_Inf_VS_Veh": "z", // rocket fist
            "FOR_Turret_VS_Air": "f", // flak
            "FOR_Inf_VS_Air": "q", // missile squad
            "FOR_Barrier_VS_Veh": "t", // anti-tank barrier
            "FOR_Sniper": "s", // sniper team
            "FOR_Turret_VS_Veh": "c", // buster
            "FOR_Veh_VS_Inf": "g", // bowler
            "FOR_Turret_VS_Veh_ranged": "a", // demolisher artillery  (anti vehicle)
            "FOR_Turret_VS_Air_ranged": "e", // sam site (anti air)
            "FOR_Turret_VS_Inf_ranged": "r", // reaper artillery (anti infantry)
            // extras
            "FOR_Inf_VS_Inf": "i", // forgotten (anti infantry)
            "FOR_Veh_VS_Veh": "o", // scooper (anti vehicle)

            /* Forgotten Fortress Defense Units (50+?) */
            "FOR_Fortress_DEF_Sniper": "s",
            "FOR_Fortress_DEF_Inf_VS_Inf": "i",
            "FOR_Fortress_DEF_Veh_VS_Air": "p",
            "FOR_Fortress_DEF_Turret_VS_Inf": "m",
            "FOR_Fortress_DEF_Turret_VS_Veh": "c",
            "FOR_Fortress_DEF_Turret_VS_Air": "f",
            "FOR_Fortress_DEF_Turret_VS_Veh_ranged": "a",
            "FOR_Fortress_DEF_Turret_VS_Air_ranged": "e",
            "FOR_Fortress_DEF_Turret_VS_Inf_ranged": "r",
            "FOR_Fortress_DEF_Mammoth": "d",

            /* Forgotten Infected GDI Defense Units */
            "FOR_GDI_Wall": "w", // wall
            "FOR_GDI_Def_Predator": "d", // predator
            "FOR_GDI_Turret": "m", // mg nest
            "FOR_GDI_Def_Pitbull": "p", // pitbull
            "FOR_GDI_Barbwire": "b", // barbwire
            "FOR_GDI_Def_Zone Trooper": "z", // zone trooper
            "FOR_GDI_Flak": "f", // flak
            "FOR_GDI_Def_Missile Squad": "q", // missile squad
            "FOR_GDI_Antitank Barrier": "t", // anti-tank barrier
            "FOR_GDI_Def_Sniper": "s", // sniper team
            "FOR_GDI_Cannon": "c", // guardian cannon
            "FOR_GDI_Def_APC Guardian": "g", // guardian
            "FOR_GDI_Art Tank": "a", // titan artillery (anti vehicle)
            "FOR_GDI_Art Air": "e", // sam site (anti air)
            "FOR_GDI_Art Inf": "r", // watchtower (anti infantry)

            /* Forgotten Infected NOD Defense Units */
            "FOR_NOD_Def_Wall": "w", // wall
            "FOR_NOD_Def_Scorpion Tank": "d", // scorpion
            "FOR_NOD_Def_MG Nest": "m", // mg nest
            "FOR_NOD_Def_Attack Bike": "p", // attack bike
            "FOR_NOD_Def_Barbwire": "b", // barbwire
            "FOR_NOD_Def_Black Hand": "z", // black hand
            "FOR_NOD_Def_Flak": "f", // flak
            "FOR_NOD_Def_Militant Rocket Soldiers": "q", // militant rocket squad
            "FOR_NOD_Def_Antitank Barrier": "t", // anti-tank barrier
            "FOR_NOD_Def_Confessor": "s", // confessor
            "FOR_NOD_Def_Cannon": "c", // beam cannon
            "FOR_NOD_Def_Reckoner": "g", // reckoner
            "FOR_NOD_Def_Art Tank": "a", // obelisk artillery (anti vehicle)
            "FOR_NOD_Def_Art Air": "e", // sam site (anti air)
            "FOR_NOD_Def_Art Inf": "r", // gatling cannon

            /* blanks */
            "": ""
        };

        const offense_unit_map = {
            /* GDI Offense Units */
            "GDI_Riflemen": "i", // rifleman squad
            "GDI_Missile Squad": "q", // missile squad
            "GDI_Zone Trooper": "z", // zone troooper
            "GDI_Commando": "c", // commando
            "GDI_Sniper Team": "s", // sniper team
            "GDI_APC Guardian": "g", // guardian
            "GDI_Pitbull": "p", // pitbull
            "GDI_Predator": "d", // predator
            "GDI_Juggernaut": "j", // juggernaut
            "GDI_Mammoth": "a", // mammoth
            "GDI_Orca": "v", // orca
            "GDI_Firehawk": "f", // firehawk
            "GDI_Paladin": "o", // paladin
            "GDI_Kodiak": "k", // kodiak

            /* Nod Offense Units */
            "NOD_Militants": "i", // militants
            "NOD_Militant Rocket Soldiers": "q", // militant rocket squad
            "NOD_Black Hand": "z", // black hand
            "NOD_Commando": "c", // commando
            "NOD_Confessor": "s", // confessor
            "NOD_Reckoner": "g", // reckoner
            "NOD_Attack Bike": "p", // attack bike
            "NOD_Scorpion Tank": "d", // scorpion
            "NOD_Specter Artilery": "j", // specter
            "NOD_Avatar": "a", // avatar
            "NOD_Venom": "v", // venom
            "NOD_Vertigo": "f", // vertigo
            "NOD_Cobra": "o", // cobra
            "NOD_Salamander": "k", // salamander

            /* blanks */
            "": ""
        };

        function findTechLayout(city) {
            for (let k in city) {
                if ((typeof (city[k]) == "object") && city[k] && (0 in city[k]) && (8 in city[k])) {
                    if ((typeof (city[k][0]) == "object") && city[k][0] && (0 in city[k][0]) && (15 in city[k][0])) {
                        if ((typeof (city[k][0][0]) == "object") && city[k][0][0] && ("BuildingIndex" in city[k][0][0])) {
                            //console.info("-- findTechLayout:", city[k]);
                            return city[k];
                        }
                    }
                }
            }
            return null;
        }

        function findBuildings(city) {
            let cityBuildings = city.get_CityBuildingsData();
            for (let k in cityBuildings) {
                if (PerforceChangelist >= 376877) {
                    if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && ("d" in cityBuildings[k]) && ("c" in cityBuildings[k]) && (cityBuildings[k].c > 0)) {
                        //console.info("-- findBuildings(1):", cityBuildings[k].d);
                        return cityBuildings[k].d;
                    }
                } else {
                    if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "l" in cityBuildings[k]) {
                        //console.info("-- findBuildings(2):", cityBuildings[k].l);
                        return cityBuildings[k].l;
                    }
                }
            }
        }

        function isDefenseUnit(unit) {
            //console.info("-- isDefenseUnits:", unit.get_UnitGameData_Obj().n);
            return (unit.get_UnitGameData_Obj().n in defense_unit_map);
        }

        function isOffenseUnit(unit) {
            //console.info("-- isOffenseUnits:", unit.get_UnitGameData_Obj().n);
            return (unit.get_UnitGameData_Obj().n in offense_unit_map);
        }

        function getUnitArrays(city) {
            let ret = [];
            for (let k in city) {
                if ((typeof (city[k]) == "object") && city[k]) {
                    for (let k2 in city[k]) {
                        if (PerforceChangelist >= 376877) {
                            if ((typeof (city[k][k2]) == "object") && city[k][k2] && "d" in city[k][k2]) {
                                let lst = city[k][k2].d;
                                if ((typeof (lst) == "object") && lst) {
                                    for (let i in lst) {
                                        if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                                            ret.push(lst);
                                        }
                                    }
                                }
                            }
                        } else {
                            if ((typeof (city[k][k2]) == "object") && city[k][k2] && "l" in city[k][k2]) {
                                let lst = city[k][k2].l;
                                if ((typeof (lst) == "object") && lst) {
                                    for (let i in lst) {
                                        if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                                            ret.push(lst);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return ret;
        }

        function getDefenseUnits(city) {
            let arr = getUnitArrays(city);
            //console.info("-- getDefenseUnits:", arr);
            for (let i = 0; i < arr.length; ++i) {
                for (let j in arr[i]) {
                    if (isDefenseUnit(arr[i][j])) {
                        return arr[i];
                    }
                }
            }
            return [];
        }

        function getOffenseUnits(city) {
            let arr = getUnitArrays(city);
            for (let i = 0; i < arr.length; ++i) {
                for (let j in arr[i]) {
                    if (isOffenseUnit(arr[i][j])) {
                        return arr[i];
                    }
                }
            }
            return [];
        }

        function cnctaopt3_create() {
            console.log("CnCTAOpt Link Button v" + cnctaopt_version + " loaded");
            const cnctaopt = {
                selected_base: null,
                make_sharelink: function () {
                    try {
                        let selected_base = cnctaopt.selected_base;
                        let city_id = selected_base.get_Id();
                        let city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
                        let own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                        let server = ClientLib.Data.MainData.GetInstance().get_Server();
                        let coordX = city.get_X();
                        let coordY = city.get_Y();
                        let worldName = server.get_Name().trim();
                        let worldId = server.get_WorldId();
                        let maxLevel = server.get_PlayerUpgradeCap();
                        let economy = (server.get_TechLevelUpgradeFactorBonusAmount() != 1.20) ? "new" : "old";
                        //console.log("Target City: ", city);
                        //console.log("Own City: ", own_city);
                        // buid link..
                        // (ver)sion = cnctaopt's codebase version #3.
                        let link = "ver=3~";
                        // base and defense faction (of base being viewed)
                        let faction = city.get_CityFaction();
                        if (faction === 1) {
                            link += "G~"; // GDI
                        } else if (faction === 2) {
                            link += "N~"; // NOD
                        } else if (faction > 2 && faction < 9) {
                            // 3: FOR faction, unseen, but in GAMEDATA
                            // 4, 5, 6, 8: Forgotten base, camp, outpost, infected camp
                            link += "F~";
                        } else {
                            console.log("cnctaopt: Unknown faction (1): " + faction);
                            link += "E~";
                        }
                        // offense faction
                        // - if viewing another player's base, get their offense setup
                        // - if view forgotton, get player's offense setup.
                        faction = city.get_CityFaction();
                        if (faction > 2) {
                            faction = own_city.get_CityFaction();
                        }
                        if (faction === 1) {
                            link += "G~"; // GDI
                        } else if (faction === 2) {
                            link += "N~"; // NOD
                        } else {
                            console.log("cnctaopt: Unknown faction (2): " + faction);
                            link += "E~";
                        }
                        // city's name
                        link += city.get_Name().trim() + "~";

                        // create an empty 2d array for defense units
                        let defense_units = [];
                        for (let i = 0; i < 20; ++i) {
                            let col = [];
                            for (let j = 0; j < 9; ++j) {
                                col.push(null);
                            }
                            defense_units.push(col);
                        }
                        // populate the defense units array
                        let defense_unit_list = getDefenseUnits(city);
                        if (PerforceChangelist >= 376877) {
                            for (let i in defense_unit_list) {
                                let unit = defense_unit_list[i];
                                defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                            }
                        } else {
                            for (let i = 0; i < defense_unit_list.length; ++i) {
                                let unit = defense_unit_list[i];
                                defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                            }
                        }
                        // create empty array for offense units
                        let offense_units = [];
                        for (let i = 0; i < 20; ++i) {
                            let col = [];
                            for (let j = 0; j < 9; ++j) {
                                col.push(null);
                            }
                            offense_units.push(col);
                        }
                        // populate the offense units array
                        let offense_unit_list;
                        if (city.get_CityFaction() == 1 || city.get_CityFaction() == 2) {
                            // another player's base
                            offense_unit_list = getOffenseUnits(city);
                        } else {
                            // player's base (viewing Forgotten base/camp/outpost/infected)
                            offense_unit_list = getOffenseUnits(own_city);
                        }
                        if (PerforceChangelist >= 376877) {
                            for (let i in offense_unit_list) {
                                let unit = offense_unit_list[i];
                                offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                            }
                        } else {
                            for (let i = 0; i < offense_unit_list.length; ++i) {
                                let unit = offense_unit_list[i];
                                offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                            }
                        }
                        // base ...
                        let techLayout = findTechLayout(city);
                        let buildings = findBuildings(city);
                        for (let i = 0; i < 20; ++i) {
                            let row = [];
                            for (let j = 0; j < 9; ++j) {
                                let spot = i > 16 ? null : techLayout[j][i];
                                let level = 0;
                                let building = null;
                                if (spot && spot.BuildingIndex >= 0) {
                                    building = buildings[spot.BuildingIndex];
                                    level = building.get_CurrentLevel();
                                }
                                let defense_unit = defense_units[j][i];
                                if (defense_unit) {
                                    level = defense_unit.get_CurrentLevel();
                                }
                                let offense_unit = offense_units[j][i];
                                if (offense_unit) {
                                    level = offense_unit.get_CurrentLevel();
                                }
                                if (level > 0) {
                                    link += level;
                                }

                                switch (i > 16 ? 0 : city.GetResourceType(j, i)) {
                                    case 0:
                                        if (building) {
                                            let techId = building.get_MdbBuildingId();
                                            if (GAMEDATA.Tech[techId].n in base_unit_map) {
                                                link += base_unit_map[GAMEDATA.Tech[techId].n];
                                            } else {
                                                console.log("cnctaopt [5b]: Unhandled building: " + techId, building);
                                                link += ".";
                                            }
                                        } else if (defense_unit) {
                                            if (defense_unit.get_UnitGameData_Obj().n in defense_unit_map) {
                                                link += defense_unit_map[defense_unit.get_UnitGameData_Obj().n];
                                            } else {
                                                console.log("cnctaopt [5d]: Unhandled unit: " + defense_unit.get_UnitGameData_Obj().n);
                                                link += ".";
                                            }
                                        } else if (offense_unit) {
                                            if (offense_unit.get_UnitGameData_Obj().n in offense_unit_map) {
                                                link += offense_unit_map[offense_unit.get_UnitGameData_Obj().n];
                                            } else {
                                                console.log("cnctaopt [5o]: Unhandled unit: " + offense_unit.get_UnitGameData_Obj().n);
                                                link += ".";
                                            }
                                        } else {
                                            link += ".";
                                        }
                                        break;
                                    case 1:
                                        /* Crystal ... < 0 means no harvester */
                                        link += (spot.BuildingIndex < 0) ? "c" : "n";
                                        break;
                                    case 2:
                                        /* Tiberium .. < 0 means no harvester */
                                        link += (spot.BuildingIndex < 0) ? "t" : "j";
                                        break;
                                    case 4:
                                        /* Woods */
                                        link += "j";
                                        break;
                                    case 5:
                                        /* Scrub */
                                        link += "h";
                                        break;
                                    case 6:
                                        /* Oil */
                                        link += "l";
                                        break;
                                    case 7:
                                        /* Swamp */
                                        link += "k";
                                        break;
                                    default:
                                        console.log("cnctaopt [4]: Unhandled resource type: " + city.GetResourceType(j, i));
                                        link += ".";
                                        break;
                                }
                            }
                        }

                        link += "~E=" + economy;

                        // console.log("cnctaopt: get_TechLevelUpgradeFactorBonusAmount = ", server.get_TechLevelUpgradeFactorBonusAmount());
                        // window.server = server;
                        // append base's coords to link
                        link += "~X=" + coordX + "~Y=" + coordY;
                        // append world id and world name
                        link += "~WID=" + worldId;
                        link += "~WN=" + worldName;
                        // append world's maximum level
                        link += "~ML=" + maxLevel;
                        link = "https://www.cnctaopt.com/index.html?" + encodeURI(link);
                        // console.log(link);
                        window.open(link, "_blank");
                    } catch (e) {
                        console.log("cnctaopt [1]: ", e);
                    }
                }
            };
            if (!webfrontend.gui.region.RegionCityMenu.prototype.__cnctaopt_real_showMenu) {
                webfrontend.gui.region.RegionCityMenu.prototype.__cnctaopt_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
            }

            let check_ct = 0;
            let check_timer = null;
            let button_enabled = 123456;
            /* Wrap showMenu so we can inject our Sharelink at the end of menus and
             * sync Base object to our cnctaopt.selected_base variable  */
            webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selected_base) {
                try {
                    let self = this;
                    //console.log(selected_base);
                    cnctaopt.selected_base = selected_base;
                    if (this.__cnctaopt_initialized != 1) {
                        this.__cnctaopt_initialized = 1;
                        this.__cnctaopt_links = [];
                        for (let i in this) {
                            try {
                                if (this[i] && this[i].basename == "Composite") {
                                    // let link = new qx.ui.form.Button("CnCTAOpt", "http://cnctaopt.com/favicon.ico");
                                    let link = new qx.ui.form.Button("CnCTAOpt");
                                    link.addListener("execute", function () {
                                        let bt = qx.core.Init.getApplication();
                                        bt.getBackgroundArea().closeCityInfo();
                                        cnctaopt.make_sharelink();
                                    });
                                    this[i].add(link);
                                    this.__cnctaopt_links.push(link);
                                }
                            } catch (e) {
                                console.log("cnctaopt [2]: ", e);
                            }
                        }
                    }
                    let tf = false;
                    switch (selected_base.get_VisObjectType()) {
                        case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                            switch (selected_base.get_Type()) {
                                case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
                                    tf = true;
                                    break;
                                case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
                                case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
                                    tf = true;
                                    break;
                            }
                            break;
                        case ClientLib.Vis.VisObject.EObjectType.RegionGhostCity:
                            tf = false;
                            console.log("cnctaopt: Ghost City selected.. ignoring because we don't know what to do here");
                            break;
                        case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                            tf = true;
                            break;
                        case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                            tf = true;
                            break;
                    }

                    let orig_tf = tf;

                    function check_if_button_should_be_enabled() {
                        try {
                            tf = orig_tf;
                            let selected_base = cnctaopt.selected_base;
                            let still_loading = false;
                            if (check_timer !== null) {
                                clearTimeout(check_timer);
                            }

                            /* When a city is selected, the data for the city is loaded in the background.. once the
                             * data arrives, this method is called again with these fields set, but until it does
                             * we can't actually generate the link.. so this section of the code grays out the button
                             * until the data is ready, then it'll light up. */
                            if (selected_base && selected_base.get_Id) {
                                let city_id = selected_base.get_Id();
                                let city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
                                //if (!city || !city.m_CityUnits || !city.m_CityUnits.m_DefenseUnits) {
                                //console.log("City", city);
                                //console.log("get_OwnerId", city.get_OwnerId());
                                if (!city || city.get_OwnerId() === 0) {
                                    still_loading = true;
                                    tf = false;
                                }
                            } else {
                                tf = false;
                            }
                            if (tf != button_enabled) {
                                button_enabled = tf;
                                for (let i = 0; i < self.__cnctaopt_links.length; ++i) {
                                    self.__cnctaopt_links[i].setEnabled(tf);
                                }
                            }
                            if (!still_loading) {
                                check_ct = 0;
                            } else {
                                if (check_ct > 0) {
                                    check_ct--;
                                    check_timer = setTimeout(check_if_button_should_be_enabled, 100);
                                } else {
                                    check_timer = null;
                                }
                            }
                        } catch (e) {
                            console.log("cnctaopt [3]: ", e);
                            tf = false;
                        }
                    }

                    check_ct = 50;
                    check_if_button_should_be_enabled();
                } catch (e) {
                    console.log("cnctaopt [3]: ", e);
                }
                this.__cnctaopt_real_showMenu(selected_base);
            };
        }

        function cnctaoptLinkCheckIfLoaded() {
            try {
                if (typeof qx != 'undefined') {
                    let a = qx.core.Init.getApplication(); // application
                    if (a) {
                        cnctaopt3_create();
                    } else {
                        window.setTimeout(cnctaoptLinkCheckIfLoaded, 1000);
                    }
                } else {
                    window.setTimeout(cnctaoptLinkCheckIfLoaded, 1000);
                }
            } catch (e) {
                console.log("cnctaoptLinkCheckIfLoaded: ", e);
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(cnctaoptLinkCheckIfLoaded, 1000);
        }
    };

    let cnctaoptLinkScript = document.createElement("script");
    cnctaoptLinkScript.type = "text/javascript";
    cnctaoptLinkScript.innerHTML = "(" + cnctaoptLink.toString() + ")();";
    if (/commandandconquer\.com/i.test(document.domain)) {
        document.getElementsByTagName("head")[0].appendChild(cnctaoptLinkScript);
    }
})();


/*
End of CnCTAOpt Link Button
*/

/***********************************************************************************
C&C Tiberium Alliances POIs Analyser
***********************************************************************************/
// ==UserScript==
// @name        C&C Tiberium Alliances POIs Analyser
// @description Display alliance's POIs scores and next tier requirements.
// @version     2.0.2+
// @contributor NetquiK (Fix) (https://github.com/netquik) (see first comment for changelog)
// @grant none
// @author zdoom
// ==/UserScript==

/*
codes by NetquiK
----------------
- PoiGlobalBonus FIX
- Deep Fix for AllianceOverlay Tabs
----------------
*/

(function()
{
	var injectScript = function()
	{

		function create_ccta_pa_class()
		{
			qx.Class.define('ccta_pa',
			{
				type: 'singleton',
				extend: qx.ui.tabview.Page,

				construct: function()
				{
					try
					{
						this.base(arguments);
						this.set({layout: new qx.ui.layout.Grow(), label: "Alliance POIs", padding: 10});
						var root = this;
						var footerLayout = new qx.ui.layout.Grid();
						footerLayout.setColumnFlex(1,1);
						var footer = new qx.ui.container.Composite(footerLayout).set({
                            font: "font_size_13", padding: [5, 10], marginTop: 5, decorator: "pane-light-opaque"});
						var label = new qx.ui.basic.Label().set({
                            textColor: "text-value", font: "font_size_13", padding: 10, alignX: 'right'});
						var abr = new qx.ui.basic.Label().set({
                            alignX: 'center', marginTop: 30, font: 'font_size_16', textColor: 'black'});
						var manager = qx.theme.manager.Font.getInstance();
						var defaultFont = manager.resolve(abr.getFont());
						var newFont = defaultFont.clone();
						newFont.setSize(32);
						abr.setFont(newFont);
						var deco = new qx.ui.decoration.Decorator().set({
                            backgroundImage: "http://eistee82.github.io/ta_simv2/icon.png"});
						var imgCont = new qx.ui.container.Composite(new qx.ui.layout.VBox());
						imgCont.set({
                            minWidth: 106, minHeight: 109, maxWidth: 110, maxHeight: 110, decorator: deco, alignX: 'center'});
						var scrl = new qx.ui.container.Scroll();
						var cont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({allowGrowY: true, padding: 10});
						var gb = new qx.ui.groupbox.GroupBox("Statistics").set({layout: new qx.ui.layout.VBox(), marginLeft: 2});
						var lgb = new webfrontend.gui.GroupBoxLarge().set({layout: new qx.ui.layout.Canvas()});
						var lgbc = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({padding: [50,10,20,10]});
						var widget = new qx.ui.core.Widget().set({minWidth: 628, minHeight: 335});
						var html = new qx.html.Element('div', null, {id: "graph"});
						var info = new qx.ui.groupbox.GroupBox("Additional Information").set({layout: new qx.ui.layout.VBox(), marginTop: 10});
						var buttonCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({marginTop: 10});
						var tableCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({minWidth: 500});
						var grid = new qx.ui.container.Composite(new qx.ui.layout.Grid(2,1));
						grid.add(buttonCont, {row: 1, column: 1});
						grid.add(tableCont, {row: 1, column: 2});
						var noAllianceLabel = new qx.ui.basic.Label('No Alliance found, please create or join an alliance.').set({maxHeight: 30});

						var data = ClientLib.Data.MainData.GetInstance();
						var alliance = data.get_Alliance();
						var exists = alliance.get_Exists();
						var allianceName = alliance.get_Name();
						var allianceAbbr = alliance.get_Abbreviation();
						var faction = ClientLib.Base.Util.GetFactionGuiPatchText();
						var fileManager = ClientLib.File.FileManager.GetInstance();
						var opois = alliance.get_OwnedPOIs();
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getScore = poiUtil.GetScoreByLevel;
						var getMultiplier = poiUtil.GetBoostModifierByRank;
						var getBonus = poiUtil.GetBonusByType;
						var getNextScore = poiUtil.GetNextScore;
						var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
						var endRank = ClientLib.Base.EPOIType.RankedTypeEnd;
						var maxPoiLevel = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxCenterLevel();
						var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
						var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
						var poiGlobalBonusFactor = data.get_Server().get_POIGlobalBonusFactor();
						var BonusLabel = "Bonus";
						1 < poiGlobalBonusFactor && (BonusLabel += " +" + 100 * poiGlobalBonusFactor + "%");

						var tiersData = [], scoreData = [], bonusData = [], tiers = [];
						for (var i = 0; i < 50; i++)
						{
							var previousScore = (i == 0) ? 0 : bonusData[i - 1][1];
							var score = getNextScore(previousScore);
							var bonus = getBonus(startRank, score, poiGlobalBonusFactor);
							var percent = getBonus(endRank - 1, score, poiGlobalBonusFactor);
							if (score != previousScore) {
								bonusData[i] = [i + 1, score, bonus, percent + '%'];
								tiers[i] = [i, previousScore, score];
							}
							else break;
						}
						for (var i = 1; i <= maxPoiLevel; i++)
						{
							if (getScore(i + 1) == 1) continue;
							scoreData.push([i, getScore(i)]);
						}
						for (var i = 1; i < 41; i++) tiersData.push([i, '+' + getMultiplier(i) + '%']);

						var createTable = function()
						{

							var columns = [
								["POI Level", "Score"],
								["Tier", "Score Required", BonusLabel, "Percentage"],
								["Rank", "Multiplier"]
							];
							var rows = [scoreData, bonusData, tiersData];

							var make = function(n)
							{
								var model = new qx.ui.table.model.Simple().set({columns: columns[n], data: rows[n]});
								var table = new qx.ui.table.Table(model).set({
									columnVisibilityButtonVisible: false,
									headerCellHeight: 25,
									marginTop: 20,
									minWidth: 500,
									height: 400});
								var renderer = new qx.ui.table.cellrenderer.Default().set({useAutoAlign: false});
								for (i = 0; i < columns[n].length; i++) table.getTableColumnModel().setDataCellRenderer(i, renderer);
								return table;
							};
							this.Scores = make(0);
							this.Tiers = make(1);
							this.Multiplier = make(2);
						};
						var tables = new createTable();

						['Scores', 'Multiplier', 'Tiers'].map(function(key)
						{
							var table = tables[key];
							var button = new qx.ui.form.Button(key).set({width: 100, margin: [10, 10, 0, 10]}) ;
							button.addListener('execute', function()
							{
								tableCont.removeAll();
								tableCont.add(table)
								scrl.scrollChildIntoViewY(tableCont, 'top');
							}, this);
							buttonCont.add(button);
						});

						info.add(grid);

						var tabview = new qx.ui.tabview.TabView().set({marginTop: 20, maxWidth: 500, maxHeight: 500});
						var coordsButton = new qx.ui.form.Button('Coords').set({width: 100, margin: [10, 10, 0, 10]});
						coordsButton.addListener('execute', function()
						{
							tableCont.removeAll();
							tableCont.add(tabview);
							scrl.scrollChildIntoViewY(tableCont, 'top');
						}, this);
						var res =
						[
							"ui/common/icn_res_tiberium.png",
							"ui/common/icn_res_chrystal.png",
							"ui/common/icn_res_power.png",
							"ui/" + faction + "/icons/icon_arsnl_off_squad.png",
							"ui/" + faction + "/icons/icon_arsnl_off_vehicle.png",
							"ui/" + faction + "/icons/icon_arsnl_off_plane.png",
							"ui/" + faction + "/icons/icon_def_army_points.png"
						];
						var columns = ['Coords', 'Level', 'Score'], models = [], pages = [];
						for (var i = 0; i < 7; i++)
						{
							var page = new qx.ui.tabview.Page().set({layout: new qx.ui.layout.VBox()});
							page.setIcon(fileManager.GetPhysicalPath(res[i]));
							var model = new qx.ui.table.model.Simple().set({columns: columns});
							model.sortByColumn(1, false);
							var table = new qx.ui.table.Table(model)
							table.set({columnVisibilityButtonVisible: false, headerCellHeight: 25, marginTop: 10, minWidth: 470, showCellFocusIndicator: false, height: 320});
							var renderer = new qx.ui.table.cellrenderer.Default().set({useAutoAlign: false});
							for (var n = 0; n < columns.length; n++)
							{
								if (n == 0) renderer = new qx.ui.table.cellrenderer.Html();
								table.getTableColumnModel().setDataCellRenderer(n, renderer);
							}
							page.add(table);
							tabview.add(page);
							models.push(model);
							pages.push(page);
						}
						this.__poisCoordsPages = pages;

					//Simulator
						var wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({decorator: 'tabview-pane-clear', padding: [10, 14, 13, 10], marginTop: 20});
						var header = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({decorator: 'pane-light-opaque', padding: [8, 12]});
						var initValCont = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({padding: [5,0], marginLeft: 20});
						var initVals = ['Score:', 'Tier: ', 'Rank:', 'Bonus:'], valueLabels = [];
						for (var i = 0; i < 4; i++)
						{
							var initCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
							var ln = new qx.ui.basic.Label(initVals[i]).set({textColor: webfrontend.gui.util.BBCode.clrLink, font: 'font_size_11'});
							var lv = new qx.ui.basic.Label().set({font: 'font_size_11', paddingLeft: 5, paddingRight: 10});
							initCont.add(ln);
							initCont.add(lv);
							initValCont.add(initCont, {flex: 1});
							valueLabels.push(lv);
						}
						var mainCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({maxWidth: 480});
						var modifierCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());

						var rankingModel = new qx.ui.table.model.Simple().set({columns: ['Rank', 'Name', 'Score', 'Multiplier', 'Total Bonus']});

                        var rankingTable = new qx.ui.table.Table(rankingModel);
						rankingTable.set({
							columnVisibilityButtonVisible: false,
							headerCellHeight: 25,
							marginTop: 3,
							showCellFocusIndicator: false,
							statusBarVisible: false,
							keepFirstVisibleRowComplete: false,
							height: 105});
						for (var n = 0; n < 5; n++)
						{
							if (n == 1) rankingTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Html());
							else rankingTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Default().set({useAutoAlign: false}));
						}
						var rankingTableColumnModel = rankingTable.getTableColumnModel();
						/*
						var rankingTableResizeBehavior = rankingTableColumnModel.getBehavior();
						rankingTableResizeBehavior.setWidth(0, 50);
						rankingTableResizeBehavior.setWidth(1, "2*");
						rankingTableResizeBehavior.setWidth(2, 100);
						rankingTableResizeBehavior.setWidth(3, 70);
						rankingTableResizeBehavior.setWidth(4, 100);
						*/

						var resultsModel = new qx.ui.table.model.Simple().set({columns: ['Property', 'Value']});
						var resultsTable = new qx.ui.table.Table(resultsModel);
						var resultsTableColumnModel = resultsTable.getTableColumnModel();

						resultsTable.set({
							columnVisibilityButtonVisible: false,
							headerCellHeight: 25,
							marginTop: 5,
							width: 210,
							maxWidth: 210,
							showCellFocusIndicator: false,
							height: 300});
						resultsTable.getTableColumnModel().setDataCellRenderer(0, new qx.ui.table.cellrenderer.Html());
						resultsTable.getTableColumnModel().setDataCellRenderer(1, new qx.ui.table.cellrenderer.Html());
						var codeToString = function(s){ return String.fromCharCode(s).toLowerCase() };
						label.setValue(String.fromCharCode(77) + [65,68,69,32,66,89,32,90,68,79,79,77].map(codeToString).join().replace(/,/g, ''));

						var poisColumns = ['Coords', 'Level', 'Score', 'Enabled'];
						var poisModel = new qx.ui.table.model.Simple().set({columns: poisColumns  });
						var poisTable = new qx.ui.table.Table(poisModel);
						poisTable.set({
							columnVisibilityButtonVisible: false,
							headerCellHeight: 25,
							marginTop: 5,
							marginLeft: 5,
							showCellFocusIndicator: false,
							height: 300});
						for (var n = 0; n < 4; n++)
						{
							if (n == 0) poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Html());
							else if (n == 3) poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Boolean())
							else poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Default().set({useAutoAlign: false}));
						}
						var poisTableColumnModel = poisTable.getTableColumnModel();

						var selectionModel = poisTable.getSelectionManager().getSelectionModel();
						selectionModel.setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION_TOGGLE);
						poisTable.getSelectionModel().addListener('changeSelection', function(e)
						{
							var table = this.__poisTable;
							var tableModel = table.getTableModel();
							var data = tableModel.getDataAsMapArray();
							var score = 0;
							for (var i = 0; i < data.length; i++)
							{
								var isSelected = selectionModel.isSelectedIndex(i);
								var level = tableModel.getValue(1, i);
								tableModel.setValue(3, i, !isSelected);
								if (!isSelected) score += getScore(parseInt(level, 10));
							}
							this.__setResultsRows(score);
							this.__setRankingRows(score);
							table.setUserData('score', score);
						}, this);

						var addRowCont = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({decorator: 'pane-light-opaque', padding: [8, 12], marginTop: 5});
						var selectPoiLabelCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
						var selectPoiLabel = new qx.ui.basic.Label('Select POI\'s Level').set({margin: [5, 10], font: 'font_size_11'});
						var selectLevel = new qx.ui.form.SelectBox().set({padding: [5, 15]});
						for (var i = 12; i <= maxPoiLevel; i++) selectLevel.add(new qx.ui.form.ListItem('Level ' + i, null, i));
						var addButton = new qx.ui.form.Button('Add POI').set({padding: [5, 20]});
						var resetButton = new qx.ui.form.Button('Reset').set({padding: [5, 20], marginLeft: 5});
						addButton.addListener('execute', function()
						{
							var level = selectLevel.getSelection()[0].getModel();
							var score = getScore(parseInt(level, 10));
							var originalScore = poisTable.getUserData('score');
							poisModel.addRows([['<p style="padding:0; margin:0; color:' + webfrontend.gui.util.BBCode.clrLink + '">New</p>', level, this.__format(score), true]]);
							var newScore = originalScore + score;
							this.__setResultsRows(newScore);
							this.__setRankingRows(newScore);
							poisTable.setUserData('score', newScore);
						}, this);
						resetButton.addListener('execute', this.__initSim, this);
						mainCont.add(rankingTable, {flex: 1});
						modifierCont.add(resultsTable);
						modifierCont.add(poisTable, {flex: 1});
						mainCont.add(modifierCont);
						selectPoiLabelCont.add(selectPoiLabel);
						addRowCont.add(selectLevel);
						addRowCont.add(selectPoiLabelCont, {flex: 1});
						addRowCont.add(addButton);
						addRowCont.add(resetButton);
						mainCont.add(addRowCont);

						var selectBox = new qx.ui.form.SelectBox().set({padding: [5,20]});
						for (var i = 0; i < 7; i++)
						{
							var type = poiInfo(i + startRank).type;
							var listItem = new qx.ui.form.ListItem(type, null, type);
							selectBox.add(listItem);
						}
						selectBox.addListener('changeSelection', function(e)
						{
							if (!e.getData()[0]) return;
							var type = e.getData()[0].getModel();
							this.__selectedSimPoi = type;
							this.__initSim();
						}, this);

						header.add(selectBox);
						header.add(initValCont, {flex: 1});
						wrapper.add(header);
						wrapper.add(mainCont);

						this.__simLabels = valueLabels;
						this.__rankingModel = rankingModel;
						this.__resultsModel = resultsModel;
						this.__poisModel = poisModel;
						this.__poisTable = poisTable;
						this.__selectPoiLevel = selectLevel;
						this.__simCont = wrapper;
						this.__selectedSimPoi = poiInfo(startRank).type;

						var simulatorButton = new qx.ui.form.Button('Simulator').set({width: 100, margin: [10, 10, 0, 10]});
						simulatorButton.addListener('execute', function()
						{
							scrl.scrollChildIntoViewY(tableCont, 'top');
							tableCont.removeAll();
							tableCont.add(wrapper);
						}, this);
						////////////////////////////////////////////////////////////////////////////////////////////////////////


						var showImage = true;
						scrl.add(cont);
						imgCont.add(abr);
						if (showImage) cont.add(imgCont);
						cont.add(lgb);
						lgb.add(lgbc);
						lgbc.add(gb);
						lgbc.add(info);
						lgbc.add(footer);
						widget.getContentElement().add(html);
						this.add(scrl);

						if (exists)
						{
							gb.add(widget);
							buttonCont.addAt(coordsButton, 0);
							buttonCont.addAt(simulatorButton, 1);
							tableCont.add(tabview);
							abr.setValue(allianceAbbr);
							this.__allianceName = allianceName;
							this.__allianceAbbr = allianceAbbr;
						}
						else
						{
							gb.add(noAllianceLabel);
							tableCont.add(tables.Scores);
							noAllianceLabel.setValue('No Alliance found, please create or join an alliance.');
							this.__isReset = true;
						}

						this.__models = models;
						this.__tableCont = tableCont;
						this.__timer = new qx.event.Timer(1000);
						this.__tiers = tiers;
						this.__timer.addListener('interval', this.__update, this);
						this.addListener('appear', function()
						{
							try
							{
								var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
								var allianceName = alliance.get_Name();
								var allianceAbbr = alliance.get_Abbreviation();
								var exists = alliance.get_Exists();
								if (!exists && !this.__isReset)
								{
									console.log('No alliance found');
									gb.removeAll();
									gb.add(noAllianceLabel);
									buttonCont.remove(coordsButton);
									buttonCont.remove(simulatorButton);
									tableCont.removeAll();
									tableCont.add(tables.Scores);
									abr.setValue('');
									this.__allianceName = '';
									this.__allianceAbbr = '';
									this.__pois = {};
									this.__isReset = true;
								}
								else if (exists)
								{
									if (this.__isReset)
									{
										gb.removeAll();
										gb.add(widget);
										buttonCont.addAt(coordsButton, 0);
										buttonCont.addAt(simulatorButton, 1);
										abr.setValue(allianceAbbr);
										this.__isReset = false;
										this.__allianceName = allianceName;
										this.__allianceAbbr = allianceAbbr;
									}
									tableCont.removeAll();
									tableCont.add(tabview);
									this.__update();
								}
							}
							catch(e)
							{
								console.log(e.toString())
							}
						}, this);
						// MOD DEEP FIX for AllianceOVerlay TABS by Netquik
						var AllianceOverlayGUI = webfrontend.gui.alliance.AllianceOverlay;
						var AllianceOverlay = AllianceOverlayGUI.getInstance();
						this.AllianceOverlayTabViewPopulateMethod = AllianceOverlay._activate.toString().match(/function\(\)\{this\.([_a-zA-Z]+)\(\);this\.[_a-zA-Z]+/)[1];
						var TabViewPopulateMethodString = AllianceOverlay[this.AllianceOverlayTabViewPopulateMethod].toString();
						this.AllianceOverlayTabViewMethod = TabViewPopulateMethodString.match(/this\.([_a-zA-Z]+)\.remove\(this\.[_a-zA-Z]+\);/)[1];
						var rewrittenFunctionBody = TabViewPopulateMethodString.replace(/(?!if\()this\.[_a-zA-Z]+(!|=)=(this\.[_a-zA-Z]+)(?=\){(this\.[_a-zA-Z]+)\.(?:add|remove))/g, function (match, g1, g2, g3) {
							return '-1' + ("="==g1?"!":"=") + '==' + g3 + '.indexOf(' + g2 + ')';
						});

						var fnBody = rewrittenFunctionBody.substring(rewrittenFunctionBody.indexOf('{') + 1, rewrittenFunctionBody.lastIndexOf('}'));
						var args = rewrittenFunctionBody.substring(rewrittenFunctionBody.indexOf("(") + 1, rewrittenFunctionBody.indexOf(")"));
						this.AllianceOverlayPatched = new Function(args, fnBody);
						AllianceOverlay[this.AllianceOverlayTabViewPopulateMethod] = this.AllianceOverlayPatched.bind(AllianceOverlay);
						this.AllianceOverlayMainTabview = AllianceOverlay[this.AllianceOverlayTabViewMethod];
						this.AllianceOverlayMainTabview.addAt(this, 0);
						for (var tab in AllianceOverlayGUI.tabs) {
							if (Object.prototype.hasOwnProperty.call(AllianceOverlayGUI.tabs, tab)) {
								AllianceOverlayGUI.tabs[tab] = AllianceOverlayGUI.tabs[tab] + 1;
							}
						}
						this.AllianceOverlayMainTabview.setSelection([this]);
					} catch (e) {
						console.log(e.toString());
					}
				},
				destruct: function(){},
				members:
				{
					__isReset: false,
					__timer: null,
					__allianceName: null,
					__allianceAbbr: null,
					__pois: null,
					__tiers: null,
					__ranks: {},
					__models: null,
					__poisCoordsPages: null,
					__tableCont: null,
					__simCont: null,
					__selectedSimPoi: null,
					__isolatedRanks: null,
					__simLabels: [],
					__rankingModel: null,
					__resultsModel: null,
					__poisModel: null,
					__poisTable: null,
					__selectPoi: null,
					__style:
					{
						"table": {"margin": "5px", "borderTop": "1px solid #333", "borderBottom": "1px solid #333", "fontFamily": "Verdana, Geneva, sans-serif"},
						"graph":
						{
							"td": {"width": "68px", "verticalAlign": "bottom", "textAlign": "center"},
							"div": {"width": "24px", "margin": "0 auto -1px auto", "border": "3px solid #333", "borderBottom": "none"}
						},
						"icon":
						{
							"ul": {"listStyleType": "none", "margin": 0, "padding": 0},
							"div": {"padding": "6px", "marginRight": "6px", "display": "inline-block", "border": "1px solid #000"},
							"p": {"display": "inline", "fontSize": "10px", "color": "#555"},
							"li": {"height": "15px", "padding": "2px", "marginLeft": "10px"}
						},
						"cell":
						{
							"data": {"width": "68px", "textAlign": "center", "color": "#555", "padding": "3px 2px"},
							"header": {"color": "#416d96", "padding": "3px 2px"}
						},
						"rows":
						{
							"graph": {"borderBottom": "3px solid #333", "height": "200px"},
							"tr": {"fontSize": "11px", "borderBottom": "1px solid #333",  "backgroundColor": "#d6dde1"}
						}
					},

					__element: function(tag)
					{
						var elm = document.createElement(tag), root = this;
						this.css = function(a)
						{
							for (var b in a)
							{
								root.elm.style[b] = a[b];
								root.__style[b] = a[b];
							}
						}
						this.set = function(a)
						{
							for (var b in a) root.elm[b] = a[b];
						}
						this.append = function()
						{
							for (var i in arguments)
							{
								if (arguments[i].__instanceof == 'element') root.elm.appendChild(arguments[i].elm);
								else if (arguments[i] instanceof Element) root.elm.appendChild(arguments[i]);
								else console.log(arguments[i] + ' is not an element');
							}
						}
						this.text = function(str)
						{
							var node = document.createTextNode(str);
							root.elm.appendChild(node);
						}
						this.elm = elm;
						this.__style = {};
						this.__instanceof = 'element';
					},

					__format: function(n)
					{
						var f = "", n = n.toString();
						if (n.length < 3) return n;
						for (var i = 0; i < n.length; i++)
						{
							(((n.length - i) % 3 === 0) && (i !== 0)) ? f += "," + n[i] : f += n[i];
						}
						return f;
					},

					__update: function()
					{
						this.__timer.stop();
						var div = document.getElementById('graph');
						if (!div)
						{
							this.__timer.start();
							console.log('Waiting for div dom element to be loaded');
						}
						if (div)
						{
							console.log('Reloading graph');
							div.innerHTML = "";
							this.__updatePOIList();
							this.__updateGraph();
							this.__updateRanks();
						}
					},

					__updatePOIList: function()
					{
						var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						var opois = alliance.get_OwnedPOIs();
						var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
						var getScore = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel;
						var models = this.__models, format = this.__format, pages = this.__poisCoordsPages;
						for (var i = 0; i < 7; i++)
						{
							var rows = [];
							opois.map(function(poi)
							{
								if (poi.t - startRank === i)
								{
									var a  = webfrontend.gui.util.BBCode.createCoordsLinkText((poi.x + ':' + poi.y), poi.x, poi.y);
									rows.push([a, poi.l, format(getScore(poi.l))]);
								}
							});
							models[i].setData(rows);
							models[i].sortByColumn(1, false);
							pages[i].setLabel(rows.length);
						}
					},

					__updateRanks: function()
					{
						this.__ranks = {}, this.__isolatedRanks = {}, root = this, allianceName = this.__allianceName;
						var getPoiRankType = ClientLib.Base.PointOfInterestTypes.GetPOITypeFromPOIRanking;
						var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType, startRank;
						for (var i = 0; i < 20; i++) if (getPoiRankType(i) > 0) { startRank = i; break; };
						var getPoiRanks = function(type, poiType, increment)
						{
							ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("RankingGetData",
							{'ascending': true, 'firstIndex': 0, 'lastIndex': 100, 'rankingType': poiType, 'sortColumn': 200 + increment, 'view': 1},
							phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, root, function(context, data)
							{
								if (data !== null)
								{
									var skip = 1, arr = [];
									for (var i = 0; i < data.a.length; i++)
									{
										var alliance = data.a[i], name = alliance.an, score = (alliance.pois || 0);
										if (name == allianceName)
										{
											skip = 0;
											continue;
										}
										alliance.r = i + skip;
										arr.push(alliance);
									}
									this.__isolatedRanks[type] = arr;
									this.__ranks[type] = data.a;
									if (this.__selectedSimPoi == type) this.__initSim();
								}
							}), null);
						};
						if (startRank) for (var n = 0; n < 7; n++) getPoiRanks(poiInfo(getPoiRankType(n + startRank)).type, n + startRank, n);
					},

					__setSimLabels: function()
					{
						var labels = this.__simLabels, pois = this.__pois, type = this.__selectedSimPoi, format = this.__format;
						if (pois[type])
						{
							labels[0].setValue(pois[type].s);
							labels[1].setValue((pois[type].tier == 0) ? "0" : pois[type].tier);
							labels[2].setValue((pois[type].rank == 0) ? "0" : pois[type].rank);
							labels[3].setValue(pois[type].tb);
						}
					},

					__setRankingRows: function(score)
					{
						var isolatedRanks = this.__isolatedRanks, format = this.__format, allianceName = this.__allianceName, type = this.__selectedSimPoi, pois = this.__pois;
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getMultiplier = poiUtil.GetBoostModifierByRank;
						var getBonus = poiUtil.GetBonusByType;
						var poiGlobalBonusFactor = ClientLib.Data.MainData.GetInstance().get_Server().get_POIGlobalBonusFactor();
						var getRankingData = function (i, type, nr) {
							var x = isolatedRanks[type][i],
								score = (x.pois || 0),
								name = webfrontend.gui.util.BBCode.createAllianceLinkText(x.an);
							var bonus = getBonus(pois[type].index, score, poiGlobalBonusFactor),
								multiplier = getMultiplier(nr),
								totalBonus = bonus + (bonus * multiplier / 100);
							totalBonus = (pois[type].bonusType == 1) ? format(Math.round(totalBonus)) : Math.round(totalBonus * 100) / 100 + '%';
							return [nr, name, format(score), '+' + multiplier + '%',  totalBonus]
						};
						getMyRanking = function (s, i, p) {
							var b = getBonus(pois[p].index, s, poiGlobalBonusFactor);
							var m = getMultiplier(i);
							var tb = b + (b * m / 100);
							tb = (pois[p].bonusType == 1) ? format(Math.round(tb)) : Math.round(tb * 100) / 100 + '%';
							var n = webfrontend.gui.util.BBCode.createAllianceLinkText(allianceName);
							return [i, n, format(s), '+' + m + '%',  tb];
						};
						var getRankingRows = function(s, type)
						{
							var rows;
							for (var i = 0; i < isolatedRanks[type].length; i++)
							{
								if (s >= (isolatedRanks[type][i].pois || 0))
								{
									var matched = getRankingData(i, type, i + 2);
									var nextMatched = getRankingData(i + 1, type, i + 3);
									var preMatched = (i > 0) ? getRankingData(i - 1, type, i) : null;
									if (i == 0) rows = [getMyRanking(s, i + 1, type), matched, nextMatched];
									else rows = [preMatched, getMyRanking(s, i + 1, type), matched];
									break;
								}
							}
							return rows;
						}
						var rankingRows = getRankingRows(score, type);
						if (rankingRows) this.__rankingModel.setData(rankingRows);
					},

					__setResultsRows: function(score)
					{
						var pois = this.__pois, tiers = this.__tiers, format = this.__format, type = this.__selectedSimPoi, ranks = this.__isolatedRanks;
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getScore = poiUtil.GetScoreByLevel;
						var getMultiplier = poiUtil.GetBoostModifierByRank;
						var getBonus = poiUtil.GetBonusByType;
						var poiGlobalBonusFactor = ClientLib.Data.MainData.GetInstance().get_Server().get_POIGlobalBonusFactor();
						var BonusLabel = "Bonus";
						1 < poiGlobalBonusFactor && (BonusLabel += " +" + 100 * poiGlobalBonusFactor + "%");;
						var getTier = function (s) {
							if (s == 0) return "0";
							else for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return tiers[i][0];
						};
						var getNextTier = function(s)
						{
							for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return (tiers[i][2] - s);
						};
						var getPreviousTier = function(s)
						{
							for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return (s - tiers[i][1]);
						};
						var getRank = function(s, t)
						{
							for (var i = 0; i < ranks[t].length; i++) if (s >= (ranks[t][i].pois || 0)) return i + 1;
						};
						var getNextRank = function(s, t)
						{
							for (var i = 0; i < ranks[t].length; i++) if (s >= (ranks[t][i].pois || 0)) return (ranks[t][i-1]) ? ranks[t][i-1].pois : s;
						};
						var getPreviousRank = function(s, t)
						{
							for (var i = 0; i < ranks[t].length; i++) if (s >= (ranks[t][i].pois || 0)) return (ranks[t][i].pois || 0);
						};
						var getSimulatedData = function(s, p)
						{
							var ot = pois[p].tier;
							var or = pois[p].rank;
							var ob = pois[p].bonus;
							var otb = pois[p].totalBonus;
							var pp = pois[p].bonusType;
							var t = getTier(s);
							var r = getRank(s, p);
							var ps = getPreviousRank(s, p);
							var ns = getNextRank(s, p);
							var pr = s - ps;
							var nr = ns - s;
							var nt = getNextTier(s);
							var pt = getPreviousTier(s);
							var b = getBonus(pois[p].index, s, poiGlobalBonusFactor);
							var m = getMultiplier(r);
							var f = format;
							var tb = b + (b * m / 100);
							var sc = function(val, org, poiType, fac)
							{
								var cs = [webfrontend.gui.util.BBCode.clrLink, '#41a921', '#e23636'];
								var st = function(c){return '<p style="padding: 0; margin: 0; color: ' + c + '">'}, et = '</p>';
								if (val == undefined) return null;
								if (org == undefined) return st(cs[0]) + val + et;
								else if (org != undefined && poiType == null) return ((val-org)*fac > 0) ? st(cs[1])+val+et : ((val-org)* fac < 0) ? st(cs[2])+val+et : val;
								else
								{
									var fv = (poiType == 1) ? format(Math.round(val)) : Math.round(val * 100) / 100 + '%';
									return ((val - org) * fac > 0) ? st(cs[1]) + fv + et : ((val - org) * fac < 0) ? st(cs[2]) + fv + et : fv;
								}
							};
							var rows = ['Score', 'Tier', 'Rank', 'Multiplier', 'Previous Rank', 'Next Rank', 'Previous Tier', 'Next Tier', 'Bonus', 'Total Bonus'];
							var data = [f(s), sc(t,ot,null,1), sc(r,or,null,-1), '+'+m+'%', '+'+f(pr), '-'+f(nr), '+'+f(pt), '-'+f(nt), sc(b,ob,pp,1), sc(tb,otb,pp,1)];
							var results = [];
							for (var i = 0; i < rows.length; i++) results.push([sc(rows[i]), data[i]]);
							return results;
						};
						var resultsRows = getSimulatedData(score, type);
						if (resultsRows) this.__resultsModel.setData(resultsRows);
					},

					__setPoisRows: function()
					{
						var poiUtil = ClientLib.Base.PointOfInterestTypes;
						var getScore = poiUtil.GetScoreByLevel; //poi level
						var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						var opois = alliance.get_OwnedPOIs();
						var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
						var poisRows = [], type = this.__selectedSimPoi;
						opois.map(function(poi)
						{
							if (poiInfo(poi.t).type == type)
							{
								var a  = webfrontend.gui.util.BBCode.createCoordsLinkText((poi.x + ':' + poi.y), poi.x, poi.y);
								poisRows.push([a, poi.l, getScore(poi.l), true]);
							}
						});
						if (poisRows) this.__poisModel.setData(poisRows);
					},

					__initSim: function()
					{
						var score = this.__pois[this.__selectedSimPoi].score;
						this.__setSimLabels();
						this.__setRankingRows(score);
						this.__setResultsRows(score);
						this.__setPoisRows();
						this.__poisTable.setUserData('score', score);
						this.__poisTable.resetSelection();
						this.__selectPoiLevel.setSelection([this.__selectPoiLevel.getSelectables()[0]]);
					},

					__updateGraph: function()
					{
						try
						{
							var data = ClientLib.Data.MainData.GetInstance();
							var alliance = data.get_Alliance();
							var ranks = alliance.get_POIRankScore();
							var poiUtil = ClientLib.Base.PointOfInterestTypes;
							var getScore = poiUtil.GetScoreByLevel;
							var getMultiplier = poiUtil.GetBoostModifierByRank;
							var getBonus = poiUtil.GetBonusByType;
							var getNextScore = poiUtil.GetNextScore;
							var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
							var endRank = ClientLib.Base.EPOIType.RankedTypeEnd;
							var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
							var poiGlobalBonusFactor = data.get_Server().get_POIGlobalBonusFactor();
							var BonusLabel = "Bonus";
							1 < poiGlobalBonusFactor && (BonusLabel += " +" + 100 * poiGlobalBonusFactor + "%");
							var pois = {},
								format = this.__format,
								tiers = this.__tiers;
							var colors = ["#8dc186", "#5b9dcb", "#8cc1c7", "#d7d49c", "#dbb476", "#c47f76", "#928195"];
							var getTier = function(s)
							{
								for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return tiers[i][0];
							};
							var getHeight = function(s)
							{
								if (s == 0) return 0;
								for (var i = 0; i < tiers.length; i++)
									if (s >= tiers[i][1] && s < tiers[i][2]) return Math.round((s - tiers[i][1]) / (tiers[i][2] - tiers[i][1]) * 100);
							};

							var colors = ["#8dc186", "#5b9dcb", "#8cc1c7", "#d7d49c", "#dbb476", "#c47f76", "#928195"];
							for (var i = 0; i < ranks.length; i++)
							{
								var type = i + startRank;
								var name = poiInfo(type).type;
								var rank = ranks[i].r;
								var multiplier = getMultiplier(rank);
								var score = ranks[i].s;
								var bonus = getBonus(type, score, poiGlobalBonusFactor);
								var nextScore = getNextScore(score);
								var nextBonus = getBonus(type, nextScore, poiGlobalBonusFactor);
								var totalBonus = bonus + (bonus * multiplier / 100);
								var nextTotalBonus = nextBonus + (nextBonus * multiplier / 100);
								var nextTier = format(nextScore - score);
								var poiType = (i > 2) ? 2 : 1;
								var color = colors[i];
								var tier = getTier(ranks[i].s);
								var height = getHeight(ranks[i].s);
								var f_score = format(score);
								var f_rank = rank + ' (' + multiplier + '%)';
								var f_totalBonus = (poiType == 1) ? format(totalBonus) : Math.round(totalBonus * 100) / 100 + ' %';
								nextTotalBonus = (poiType == 1) ? format(nextTotalBonus) : Math.round(nextTotalBonus * 100) / 100 + ' %';
								pois[name] =
								{
									'score': score,
									'tier': tier,
									'bonus': bonus,
									'totalBonus': totalBonus,
									'index': type,
									'bonusType': poiType,
									'rank': rank,
									'multiplier': multiplier,
									't': tier,
									's': f_score,
									'r': f_rank,
									'nt': nextTier,
									'tb': f_totalBonus,
									'ntb': nextTotalBonus,
									'c': color,
									'h': height
								};
							}
							console.log('data ready')
							this.__pois = pois;
							this.__graph.call(this);
						}
						catch(e)
						{
							console.log(e.toString());
						}
					},

					__graph: function()
					{
						console.log('creating graph');
						var root = this, pois = this.__pois, style = this.__style;
						var create = function(a, b)
						{
							var elm = new root.__element(a);
							if (b instanceof Object) elm.css(b);
							return elm;
						};
						var addRow = function(title, arr, table, selected)
						{
							var row = create('tr', style.rows.tr), header = create('td', style.cell.header);
							row.elm.onclick = function()
							{
								var tr = table.elm.getElementsByTagName('tr');
								for (var i = 1; i < tr.length; i++)
								{
									tr[i].style.backgroundColor = '#d6dde1';
								}
								this.style.backgroundColor ='#ecf6fc';
							};
							if (selected == 1) row.css({'backgroundColor': '#ecf6fc'});
							header.text(title);
							row.append(header);
							for (var key in arr)
							{
								var td = create('td', style.cell.data);
								td.text(arr[key]);
								row.append(td);
							}
							table.append(row);
						};

						var table = create('table', style.table);
						var	gc = create('tr', style.rows.graph);
						var	gh = create('td');
						var	ul = create('ul', style.icon.ul);
						table.set({"id": "data", "cell-spacing": 0, "cell-padding": 0, "rules": "groups", "width": "100%"});
						gh.append(ul);
						gc.append(gh);
						table.append(gc);

						var score = [], tier = [], nextTier = [], bns = [], nextBns = [], poiRank = [], m = 0;
						for (var key in pois)
						{
							var color = pois[key].c,
								name  = key,
								h     = pois[key].h,
								td    = create('td', style.graph.td),
								div   = create('div', style.graph.div),
								li    = create('li', style.icon.li),
								icon  = create('div', style.icon.div),
								p     = create('p', style.icon.p);

								bns[m]      = pois[key].tb;
								poiRank[m]  = pois[key].r;
								score[m]    = pois[key].s;
								tier[m]     = pois[key].t;
								nextTier[m] = pois[key].nt;
								nextBns[m]  = pois[key].ntb;

							div.css({'backgroundColor': color, 'height': h * 2 - 3 + 'px'});
							td.append(div);
							gc.append(td);
							icon.css({'backgroundColor': color});
							p.text(name);
							li.append(icon);
							li.append(p);
							ul.append(li);
							m++;
						}

						addRow('Tier', tier, table, 0);
						addRow('Alliance Rank', poiRank, table, 0);
						addRow('Score', score, table);
						addRow('Next Tier Requires', nextTier, table, 0);
						var poiGlobalBonusFactor = ClientLib.Data.MainData.GetInstance().get_Server().get_POIGlobalBonusFactor();
						var BonusLabel = "Bonus";
						1 < poiGlobalBonusFactor && (BonusLabel += " +" + 100 * poiGlobalBonusFactor + "%");
						addRow(BonusLabel, bns, table, 1);
						addRow('Next Tier Bonus', nextBns, table, 0);
						document.getElementById('graph').appendChild(table.elm);
					}
				}
			});
		}

		function initialize_ccta_pa()
		{
			console.log('poiAnalyser: ' + 'POIs Analyser retrying...');
			if (typeof qx != 'undefined' && typeof qx.core != 'undefined' && typeof qx.core.Init != 'undefined' && typeof ClientLib != 'undefined' && typeof webfrontend != 'undefined' && typeof phe != 'undefined')
			{
				var app = qx.core.Init.getApplication();
				if (app.initDone == true)
				{
					try
					{
						var isDefined = function(a){return (typeof a == 'undefined') ? false : true};
						var data = ClientLib.Data.MainData.GetInstance();
						var net = ClientLib.Net.CommunicationManager.GetInstance();
						if (isDefined(data) && isDefined(net))
						{
							var alliance = data.get_Alliance();
							var player = data.get_Player();
							var poiUtil = ClientLib.Base.PointOfInterestTypes;
							var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
							if (isDefined(alliance) && isDefined(player) && isDefined(alliance.get_Exists()) && isDefined(player.get_Name()) && player.get_Name() != '' && isDefined(poiUtil) && isDefined(poiInfo))
							{
								try
								{
									console.log('poiAnalyser: ' + 'initializing POIs Analyser');
									create_ccta_pa_class();
									ccta_pa.getInstance();
								}
								catch(e)
								{
									console.log('poiAnalyser: ' + "POIs Analyser script init error:");
									console.log('poiAnalyser: ' + e.toString());
								}
							}
							else window.setTimeout(initialize_ccta_pa, 10000);
						}
						else window.setTimeout(initialize_ccta_pa, 10000);
					}
					catch(e)
					{
						console.log('poiAnalyser: ' + e.toString());
					}
				}
				else window.setTimeout(initialize_ccta_pa, 10000);
			}
			else window.setTimeout(initialize_ccta_pa, 10000);
		};
		window.setTimeout(initialize_ccta_pa, 65000);
	};
	function inject()
	{
		var script = document.createElement("script");
			script.innerHTML = "(" + injectScript.toString() + ")();";
			script.type = "text/javascript";
			if (/commandandconquer\.com/i.test(document.domain)) {
				document.getElementsByTagName("head")[0].appendChild(script);
				console.log('injected');
			}
	};
	inject();
})();

/***********************************************************************************
Chat Helper Enhanced
***********************************************************************************/
// ==UserScript==
// @name        C&C: Tiberium Alliances Chat Helper Enhanced
// @description Automates the use of chat and message BB-Codes: [coords][url][player][alliance][b][i][s][u] - Contact list for whispering - Type /chelp <enter> in chat for help.
// @version     3.1.6
// ==/UserScript==

// Please report urls that are not tagged properly

// window.chatHelper_suppressBrowserAltKeys suppresses normal browser menu keys [Alt+(a,p,b,i,u,s)] when you are in a textarea so that the menus don't open.

(function () {
    var chatHelper_main = function () {
        window.chatHelper_debug = 0; //initial debug level, top level for easy console access
        var chlog = function chlog(str,lvl){
            if (lvl > 0) { //lvl 1+
                if (window.chatHelper_debug == 1) { // lvl 1
                    console.log("ChatHelper_debug: "+str+"\n");
                }
                if (window.chatHelper_debug == 2) { // lvl 2
                    console.log("ChatHelper_debug: "+str+"\n");
                }

            } else { //lvl 0 or no arg passed to lvl
                console.log("ChatHelper_log: "+str+"\n");
            }
        };
        try {
            function createchatHelper() {
                var onkeyupDelay = 50; //ms to wait after a keyupevent before searching contacts list. Lower for faster searching. Higher for better performance.
                window.chatHelper_suppressBrowserAltKeys = true;
                window.chatHelper_version = "3.1.6";
                window.chatHelper_name = "C&C: Tiberium Alliances Chat Helper Enhanced";
                chlog(window.chatHelper_name + ' v' + window.chatHelper_version + ': loading.',0);
                var saveObj = {
                    saveObjVer : "3.1.6",
                    contacts : []
                }

                var validCharPatt = /[-\w\.]/;
                var isWhisp = false;
                var contacts = [];
                var timer;
                var _sub;


                function getCaretPos(obj) {
                    // getCaretPos from: http://userscripts.org/scripts/show/151099
                    obj.focus();

                    if (obj.selectionStart) {
                        return obj.selectionStart; //Gecko
                    } else if (document.selection) //IE
                    {
                        var sel = document.selection.createRange();
                        var clone = sel.duplicate();
                        sel.collapse(true);
                        clone.moveToElementText(obj);
                        clone.setEndPoint('EndToEnd', sel);
                        return clone.text.length;
                    }

                        return 0;
                }

                function moveCaret(inputObject, pos) {
                    // moveCaretPos from: http://userscripts.org/scripts/show/151099
                    if (inputObject.selectionStart) {
                        inputObject.setSelectionRange(pos, pos);
                        inputObject.focus();
                    }
                }

                function getCursorWordPos(inputField) {
                    var pos = getCaretPos(inputField);
                    var inText = inputField.value;
                    var lc = inText.charAt(pos - 1);
                    if (lc.match(validCharPatt) != null) {
                        var sPos = pos;
                        var ePos = pos;
                        var t = inputField.value;
                        while (sPos >= 0 && t.charAt(sPos - 1).match(validCharPatt) != null) {
                            sPos--;
                        }
                        while (ePos <= t.length && t.charAt(ePos).match(validCharPatt) != null) {
                            ePos++;
                        }
                        //inputField.setSelectionRange(sPos,ePos);
                        return [sPos, ePos];
                    }
                }

                function tagWith(tag, inputField) {
                    var eTag = tag.replace('[', '[/'); //closing tag
                    var tagLen = tag.length;
                    var eTagLen = eTag.length;
                    if (inputField != null) {
                        var pos = getCaretPos(inputField);
                        var inText = inputField.value;
                        //save scroll position
                        if (inputField.type === 'textarea')
                            var st = inputField.scrollTop;
                        //if there is selected text
                        if (inputField.selectionStart !== inputField.selectionEnd) {
                            var a = inText.slice(0, inputField.selectionStart);
                            var b = inText.slice(inputField.selectionStart, inputField.selectionEnd);
                            var c = inText.slice(inputField.selectionEnd, inText.length);
                            inputField.value = a + tag + b + eTag + c;
                            moveCaret(inputField, pos + tagLen + eTagLen + b.length);
                            //if ((input IS empty) OR (the last char was a space)) AND next char ISNOT a left sqbracket
                        } else if ((inText === "" || inText.charAt(pos - 1) === " ") && (inText.charAt(pos) !== '[')) {
                            inputField.value = inText.substr(0, pos) + tag + eTag + inText.substr(pos, inText.length);
                            moveCaret(inputField, pos + tagLen);
                            //if last character is a valid playername character
                        } else if (inText.charAt(pos - 1).match(validCharPatt) != null) {
                            var arr = getCursorWordPos(inputField); //
                            var s = arr[0];
                            var e = arr[1];
                            inputField.value = inText.slice(0, s) + tag + inText.slice(s, e) + eTag + inText.slice(e, inText.length);
                            moveCaret(inputField, e + tagLen + eTagLen);
                        }
                            //restore scroll position
                            if (inputField.type === 'textarea')
                                inputField.scrollTop = st;
                    }
                }

                function showHelp() {
                    alert("Type /chelp in any text box to show this message.\n\nEnter key in chat:\tsearches your chat string for Urls and Coords and wraps them before submission.\n\nAlt + 1\t:\tsearches for Urls and Coords in a message or forum post and tags accordingly. Cursor is moved to the beginning.\nAlt + 2\t:\tManual URL insertion popup window\nAlt + 0\t:\tclears all tags\n\nWord wraps: tags a selected word -or- tags the word where the cursor is (if chat is empty or you hit <space> empty tags are inserted).\nAttempts to preserve cursor and scroll position.\n|\tAlt + p or Alt + 3\t:\tplayer tags\n|\tAlt + a or Alt + 4\t:\talliance tags\n|\tAlt + b\t\t\t:\tbold tags\n|\tAlt + i\t\t\t:\titalic tags\n|\tAlt + u\t\t\t:\tunderline tags\n|__\tAlt + s\t\t\t:\tstrikethrough tags\n\nContact list commands:\n/list -or- /contacts\n/add\n/del\n/del all - wipes your whole contact list");
                }

                function saveData() {
                    saveObj.contacts = contacts;
                    var jString = JSON.stringify(saveObj);
                    chlog("saveJSON: "+jString, 1);
                    localStorage.setItem('chatHelper', jString);
                }

                function loadData() {
                    try{
                        if (localStorage.getItem('myContacts')) { //should be removed eventually
                            var dat = localStorage.getItem('myContacts');
                            dat = dat.split(',');
                            saveObj.contacts = dat;

                            //unset old storage
                            localStorage.removeItem('myContacts');
                        } else if (localStorage.getItem('chatHelper')) {
                            var saveObjTmp = JSON.parse(localStorage.getItem('chatHelper'));
                            if (saveObjTmp.saveObjVer != window.chatHelper_version){
                                //version changed
                                var va = saveObjTmp.saveObjVer.split('.');
                                var vb = window.chatHelper_version.split('.');

                                if (va[0] != vb[0]){ //major version change
                                    chlog("ChatHelper: Major version change from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
                                } else {
                                    if (va[1] != vb[1]){ //minor version change
                                        chlog("ChatHelper: Minor version change from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
                                    } else {
                                        if (va[2] != vb[2]){ //patch release
                                            chlog("ChatHelper: Version Patched from v"+va[0]+"."+va[1]+"."+va[2]+" to v"+vb[0]+"."+vb[1]+"."+vb[2]);
                                        }
                                    }
                                }
                            } else {
                                //no version change
                                localStorage.getItem('chatHelper');
                            }
                            saveObj = saveObjTmp;
                        }
                            contacts = saveObj.contacts;
                        saveData();
                    }catch(err){
                        chlog(err);
                    }
                }

                if (!localStorage.myContacts) {
                    chlog("Deprecated contacts variable does not exist.",1);
                    loadData();
                } else {
                    //contacts = loadData();
                    loadData();
                    chlog("Contacts: " + contacts, 1);
                }

                function saveContact(fr) {
                    chlog("Number of contacts == "+contacts.length,1);
                    contacts.push(fr);
                    chlog(fr + " added to contacts list.",1);
                    saveData();
                }

                function caseInsensitiveSort(a, b) {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                    if (a > b)
                        return 1;
                    if (a < b)
                        return -1;
                    return 0;
                }

                function listContacts() {
                    var len = contacts.length;
                    var a = contacts.sort(caseInsensitiveSort);
                    if (len == 1) {
                        alert(len + " Contact:\n\n" + a.join("\n") + "\n");
                    } else if (len > 1) {
                        alert(len + " Contacts:\n\n" + a.join("\n") + "\n");
                    } else {
                        var p = prompt("Your contacts list is empty.\n\nType a name here to add a contact:\n", "");
                        if (p) {
                            saveContact(p);
                        }
                    }
                }

                function deleteContact(fr) {
                    if (fr === "all") {
                        contacts = [];
                        chlog("All contacts deleted",1);
                        saveData();
                    } else {
                        var ind = contacts.indexOf(fr);
                        if (ind > -1) {
                            saveObj.contacts = contacts.splice(ind, 1);
                            saveData();
                            chlog(contacts,1);
                            chlog(fr + " deleted from contacts list.");
                        }
                    }
                }
                function keyUpTimer(kEv) {
                    kEv = kEv || window.event;
                    if (kEv.target.type === "text" && kEv.target.value != '') {
                        var inputField = kEv.target;
                        var inText = inputField.value;
                        var len = inText.length;
                        var sub;
                        var kc = kEv.keyCode;
                        if (len >= 10 && inText.match(/^(\/whisper)/) != null) {
                            isWhisp = true;
                        }
                        if (isWhisp && len >= 10 && !kEv.altGraphKey && !kEv.ctrlKey && !kEv.altKey && kc > 47 && kc < 91) {
                            chlog("keyUpTimer keyCode =="+kEv.keyCode,1);
                            sub = inText.substr(9);
                            if (!sub.match(/\s/)) {
                                for (var i = 0; i < contacts.length; i++) {
                                    var slen = sub.length;
                                    if (contacts[i][slen - 1] === sub[slen - 1] && contacts[i].substr(0, slen) == sub) {
                                        inputField.value = "/whisper " + contacts[i] + " ";
                                        inputField.setSelectionRange(10 + slen - 1, 10 + contacts[i].length, "forward");
                                    }
                                }
                            } else {
                                isWhisp = false;
                            }
                        } else {
                            isWhisp = false;
                        }
                    }
                }

                document.onkeyup = function (kEv) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        keyUpTimer(kEv);
                    }, onkeyupDelay);
                }

                function delayedConfirm() {
                    if (confirm("Add " + _sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list")) {
                        saveContact(_sub);
                    }
                }

                function autoTag(inputField, inText) {
                    var isUrl = false;
                    var lookBack;
                    //the code here is mostly from Bruce Doan: http://userscripts.org/scripts/show/151965
                    ////auto url
                    inText = inText.replace(/(\[url\])*(https?:\/\/)([\da-z\.-]+)(\.[a-z]{2,6})([\/\w\.\-\=\?\&\%\+\|#:;,~\*\(\)\$]*)*\/?(\[\/url\])*/gi, function () {
                        var result = new Array();
                        var protocol = arguments[2].match(/https?:\/\//);
                        for (var i in arguments){
                            chlog("autoTag url reg arg "+i + "= " + arguments[i],1);
                        }
                        result.push('[url]');
                        result.push(arguments[2]); // http[s]://
                        result.push(arguments[3]); // domain
                        result.push(arguments[4]); // ext
                        result.push(arguments[5]); // query string
                        result.push('[/url]');
                        if (protocol === null){
                            chlog("autotag url - no protocol",2);
                        } else {
                            isUrl = true;
                            chlog("bypassing coords tagging\n detected protocol = " + protocol,2);

                        }
                        return result.join('');
                    });
                    ////auto coords
                    if (!isUrl) {
                        chlog("checking for coords",1);
                        lookBack = inText.replace(/(\[coords\])?([#])?([0-9]{3,4})[:.]([0-9]{3,4})([:.]\w+)?(\[\/coords\])?/gi, function () {
                            for (var i in arguments){
                                chlog("autoTag coords reg arg " + i + " = " + arguments[i],1);
                            }
                            var hashBefore = arguments[2];
                            chlog("hashBefore "+hashBefore,1);
                            if (!hashBefore) {
                                chlog("no hash returning");
                                var result = new Array();
                                result.push('[coords]');
                                result.push(arguments[3]);
                                result.push(':');
                                result.push(arguments[4]);
                                if (arguments[5] != undefined) {
                                    result.push(arguments[5].replace('.', ':'));
                                }
                                result.push('[/coords]');
                                return result.join('');
                            } else {
                                return arguments[0];
                            }
                        });
                        inText = lookBack;
                        chlog("lookedback",1);
                        chlog("LB string: "+lookBack,1);
                    }
                    // shorthand for player
                    inText = inText.replace(/\[p\]([a-z0-9_\-\s]+)\[\/p\]/gi, '[player]$1[/player]');
                    // shorthand for alliance
                    inText = inText.replace(/\[a\]([a-z0-9_\-\s]+)\[\/a\]/gi, '[alliance]$1[/alliance]');

                    return inText;
                }

                document.onkeydown = function (kEv) {
                    kEv = kEv || window.event;

                    /* Tab key
					if (kEv.keyCode == 9){
						chlog("Tab key pressed",1)
						var input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable(); // Input
						kEv.preventDefault();
						kEv.stopPropagation();
					}
					 */
                    if (!kEv.shiftKey && kEv.keyCode === 13 && (kEv.target.type === "text" || kEv.target.type === "textarea")) {
                        var inputField = kEv.target;
                        var inText = inputField.value;
                        var add = inText.match(/^(\/add)/);
                        var del = inText.match(/^(\/del)/);
                        var showContacts = inText.match(/^((\/contacts)|(\/list))/);
                        var sub;
                        var cf;
                        if (inText.match(/^(\/whisper)/) != null || add != null) {
                            if (add != null) {
                                sub = inText.substr(5);
                            } else {
                                sub = inText.substr(9);
                            }
                            if (sub.match(/^(\w*)\s/)) {
                                //if space after player name (is a whisper or a typo)
                                var arr = sub.match(/^(\w*)/);
                                sub = arr[0].replace(/\s$/, "");
                                if (contacts.indexOf(sub) == -1) {
                                    //not in contacts list
                                    _sub = sub;
                                    setTimeout(delayedConfirm, 500);
                                }
                            } else if (contacts.indexOf(sub) == -1) {
                                //no message to send, not in contacts, promt to add, clear input
                                chlog("clearing input field",1);
                                inputField.focus(); //?necessary?
                                inputField.value = "";
                                var cf = confirm("Add " + sub + " to your contacts list?\n\nYou can see a list of your contacts by typing /list");
                                if (cf) {
                                    saveContact(sub);
                                    return false;
                                } else {
                                    return false;
                                }
                            } else if (sub && contacts.indexOf(sub) > -1) {
                                //not a whisper, reject duplicate contact
                                alert(sub + " is already in your contacts list.");
                            }
                                }
                        //remove contact(s)
                        if (del) {
                            sub = inText.substr(5);
                            chlog("clearing input field",1);
                            inputField.value = "";
                            if ((contacts.indexOf(sub) > -1 || sub == "all") && confirm("Really delete " + sub + " from your contacts?")) {
                                deleteContact(sub);
                            } else {
                                alert(sub + " is not in your contacts list.");
                            }
                            return false;
                        }
                        // show contacts list
                        if (showContacts) {
                            chlog("clearing input field",1);
                            inputField.value = "";
                            listContacts();
                            return false;

                        }
                        // /chelp dialog
                        if (inText.length === 6 && inText.match(/^(\/chelp)/) != null) {
                            chlog("clearing input field",1);
                            inputField.value = "";
                            showHelp();
                            return false;
                        }

                        if (inputField != null && inputField.type === "text" && inText !== "") {
                            chlog("onEnter auto-tagging",1);

                            inText = autoTag(inputField, inText); //auto-tag

                            if (inText !== inputField.value) {
                                inputField.value = inText;
                            }
                        }
                    }

                    if (kEv.altKey && !kEv.shiftKey && !kEv.altGraphKey && !kEv.ctrlKey && kEv.target != null && (kEv.target.type === "textarea" || kEv.target.type === "text")) {
                        var inputField = kEv.target;
                        var inText = inputField.value;
                        // Alt key, not Ctrl or AltGr
                        if (kEv.altKey && !kEv.altGraphKey && !kEv.ctrlKey) {
                            var cc = kEv.charCode;
                            var kc = kEv.keyCode;
                            chlog("charCode == "+cc,1);
                            chlog("keyCode == "+kc,1);

                            /* Alt+1 for auto Coordinates/Urls in message body */
                            if (inputField.type === "textarea" && (cc === 49 || kc === 49)) {
                                var pos = getCaretPos(inputField);
                                chlog("attempting Alt+1 message auto-tag",1);
                                if (inputField != null) {
                                    var st = inputField.scrollTop;

                                    inText = autoTag(inputField, inText); //auto-tag

                                    if (inText !== "" || inText !== inputField.value) {
                                        inputField.value = inText;
                                        inputField.scrollTop = st;
                                        moveCaret(inputField, 0);
                                    }
                                }
                            }
                            /* Alt+2 for URLs fallback */
                            if (cc === 50 || kc === 50) {
                                if (inputField != null) {
                                    var url = prompt("Website (Syntax: google.com or www.google.com)", "");
                                    if (url != null) {
                                        inputField.value += '[url]' + url + '[/url]';
                                    }
                                }
                            }
                            /* Alt+3 or Alt+p for players */
                            if ((cc === 112 || kc === 80) || (cc === 51 || kc === 51)) {
                                tagWith('[player]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+4 or Alt+a for alliances */
                            if ((cc === 97 || kc === 65) || (cc === 52 || kc === 52)) {
                                tagWith('[alliance]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+0 to clear tags */
                            if (cc === 48 || kc === 48) {
                                if (inputField.type === 'textarea')
                                    var st = inputField.scrollTop;
                                if (inputField != null) {
                                    inText = inText.replace(/\[\/?coords\]/gi, '');
                                    inText = inText.replace(/\[\/?url\]/gi, '');
                                    inText = inText.replace(/\[\/?player\]/gi, '');
                                    inText = inText.replace(/\[\/?alliance\]/gi, '');
                                    inText = inText.replace(/\[\/?b\]/gi, '');
                                    inText = inText.replace(/\[\/?i\]/gi, '');
                                    inText = inText.replace(/\[\/?u\]/gi, '');
                                    inText = inText.replace(/\[\/?s\]/gi, '');
                                    inputField.value = inText;
                                }
                                if (inputField.type === 'textarea')
                                    inputField.scrollTop = st;
                            }
                            /* Alt+b for bold */
                            if (cc === 98 || kc === 66) {
                                tagWith('[b]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+i for italics */
                            if (cc === 105 || kc === 73) {
                                tagWith('[i]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+u for underline */
                            if (cc === 117 || kc === 85) {
                                tagWith('[u]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                            /* Alt+s for strikethrough */
                            if (cc === 115 || kc === 83) {
                                tagWith('[s]', inputField);
                                if (window.chatHelper_suppressBrowserAltKeys)
                                    return false;
                            }
                        }
                    }
                }
            }
        } catch (err) {
            chlog("createchatHelper: "+ err,1);
            console.error(err);
        }

        function chatHelper_checkIfLoaded() {
            try {
                if (typeof qx !== 'undefined') {
                    createchatHelper();
                } else {
                    window.setTimeout(chatHelper_checkIfLoaded, 1333);
                }
            } catch (err) {
                console.log("chatHelper_checkIfLoaded: ", err);
            }
        }
        window.setTimeout(chatHelper_checkIfLoaded, 1333);
    };
    try {
        var chatHelper = document.createElement("script");
        chatHelper.innerHTML = "(" + chatHelper_main.toString() + ")();";
        chatHelper.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(chatHelper);
    } catch (err) {
        console.log("chatHelper: init error: ", err);
    }
})();