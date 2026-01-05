// ==UserScript==
// @name        C&C:TA Count Forgotten Bases in Range
// @namespace   CountBasesButton
// @description Display the number of forgotten bases in range of selected world object and paste it to chat message
// @description im not the author of the code - this script is based on Paste Coords Button and Shockr's BaseScanner sripts
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     1.1.0
// @download https://greasyfork.org/scripts/3343-c-c-ta-count-forgotten-bases-in-range/code/CC:TA%20Count%20Forgotten%20Bases%20in%20Range.user.js
// @author      
// @downloadURL https://update.greasyfork.org/scripts/3343/CC%3ATA%20Count%20Forgotten%20Bases%20in%20Range.user.js
// @updateURL https://update.greasyfork.org/scripts/3343/CC%3ATA%20Count%20Forgotten%20Bases%20in%20Range.meta.js
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
                                        this[i].add(coordbutton);
                                        this[i].add(countbutton);
                                        this.__coordButton.push(coordbutton);
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