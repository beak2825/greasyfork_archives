// ==UserScript==
// @name               TW Accessible items
// @namespace          https://greasyfork.org/users/205257
// @version            0.2
// @description        Add any item to be always visible on the main game screen
// @author             qwerfghj
// @match              https://*.the-west.com.br/game.php*
// @match              https://*.the-west.com.pt/game.php*
// @match              https://*.the-west.cz/game.php*
// @match              https://*.the-west.de/game.php*
// @match              https://*.the-west.dk/game.php*
// @match              https://*.the-west.es/game.php*
// @match              https://*.the-west.fr/game.php*
// @match              https://*.the-west.gr/game.php*
// @match              https://*.the-west.hu/game.php*
// @match              https://*.the-west.it/game.php*
// @match              https://*.the-west.net/game.php*
// @match              https://*.the-west.nl/game.php*
// @match              https://*.the-west.org/game.php*
// @match              https://*.the-west.pl/game.php*
// @match              https://*.the-west.ro/game.php*
// @match              https://*.the-west.ru/game.php*
// @match              https://*.the-west.se/game.php*
// @match              https://*.the-west.sk/game.php*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/371237/TW%20Accessible%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/371237/TW%20Accessible%20items.meta.js
// ==/UserScript==

(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
    var scriptName = "TW Accessible items";
    var scriptURL = "https://greasyfork.org/en/scripts/371237-tw-accessible-items";
    var scriptAuthor = "qwerfghj";
    var scriptObject = "AccessibleItems";
    this[scriptObject] = {
        helpers: {
            item_by_id: function(item_id) {
                var base_id = ItemManager.itemIdToBaseItemId(item_id);
                return ItemManager.getByBaseId(base_id);
            },
            item_name: function(item_id) {
                return this.item_by_id(item_id).name;
            }
        },
		inventoryManager: {
			listeningSignals: [ 'inventory_loaded', 'inventory_changed', 'cooldown_changed', 'item_lifetime_changed', 'item_used' ],
			timeout: null,
            items: {},
			init: function() {
				EventHandler.listen(this.listeningSignals, this.signalHandler, this);
			},
			destroy: function() {
				clearTimeout(this.timeout);
				EventHandler.unlisten(this.listeningSignals, this.signalHandler, this);
			},
			check: function() {
                $.each(this.items, function(item_id, item) {
                    item.getMainDiv().css("display", "none");
                });
				clearTimeout(this.timeout);
                var that = this;
                $.each(AccessibleItems.settings.getItems(), function(item_id, position) {
                    var invItem = Bag.getItemByItemId(item_id);
                    if(invItem) {
                        that.handleItem(invItem, item_id, position);
                    }
                });
			},
			handleItem: function(item, id, position) {
                if (this.items[id] === undefined) {
                    this.items[id] = new tw2widget.InventoryItem(item.obj);
                    this.items[id].initDisplay();
                    var div = this.items[id].getMainDiv();
                    div.css("position", "absolute");
                    div.css("z-index", 1);
                    var action = item.obj.action;
                    this.items[id].getImgEl().click(function() { eval(action); });
                    this.items[id].setShowcompare(false);
                    div.appendTo(document.body);
                }

                item.initDisplay();
                if (item.elCooldown) {
                    this.items[id].showCooldown();
                    item.elCooldown = item.elCooldown.add(this.items[id].elCooldown);
                }

                this.items[id].setCooldown(Bag.itemCooldown[id]);
                this.items[id].setLifetime(item.lifetime, true);
                this.items[id].setCount(item.getCount());
                this.items[id].getMainDiv().css("left", position[0]);
                this.items[id].getMainDiv().css("top", position[1]);
                this.items[id].getMainDiv().css("display", "block");
            },
			signalHandler: function() {
				var that = this;
				this.timeout = setTimeout(function() { that.check(); }, 1000);
			}
		},
        settings: {
            init: function() {
                if (!AccessibleItems.storage.exists("items")) {
                    AccessibleItems.storage.add("items", { 2485000: [80, 217] });
                }
            },
            getItems: function() {
                return AccessibleItems.storage.get("items");
            },
            saveItems: function(items) {
                AccessibleItems.storage.add("items", items);
                AccessibleItems.inventoryManager.check();
                AccessibleItems.script.fillGui();
            },
            add: function() {
                this.createEditDialog();
            },
            createEditDialog: function(init_id = 0, init_x = "", init_y = "") {
                var that = this;

                var preview_item = null;
                var removePreviewIfNot = function(item_id) {
                    if (preview_item && preview_item.getId() !== item_id) {
                        preview_item.getMainDiv().remove();
                        preview_item = null;
                    }
                };

                var id = new west.gui.Textfield().setTooltip("1234000 or [item=1234000]");
                var x = new west.gui.Textfield(null, "number").setPlaceholder("left").setWidth(72).setValue(init_x);
                var y = new west.gui.Textfield(null, "number").setPlaceholder("top").setWidth(72).setValue(init_y);
                var d = new west.gui.Dialog(scriptName, '<div class="txcenter"><table style="margin: 0 auto"><tr><td class="qwerfghj_acs_item" style="padding-right: 10px"></td><td class="qwerfghj_acs_item_id" style="vertical-align: middle" colspan="2">Enter item id:<br /><input type="hidden" value="' + init_id + '" class="qwerfghj_acs_id" /></td></tr><tr><td style="vertical-align: middle">Position:</td><td class="qwerfghj_acs_x"></td><td class="qwerfghj_acs_y"></td></tr></table></div>').setDraggable(true).setBlockGame(false);
                d.addButton("cancel", function() {
                    removePreviewIfNot(-1);
                    return true;
                });
                var el = function(cls) { return $(".qwerfghj_acs_" + cls, d.getMainDiv()); };
                d.addButton("ok", function() {
                    var item_id = parseInt(el("id").val());
                    if (item_id == 0) {
                        new MessageError("Item is not selected!").show();
                        return false;
                    }
                    if (x.getValue() === "" || y.getValue() === "") {
                        new MessageError("Position is not set!").show();
                        return false;
                    }
                    removePreviewIfNot(-1);
                    that.set(item_id, [parseInt(x.getValue()), parseInt(y.getValue())]);
                    new MessageSuccess("Item added!").show();
                    return true;
                });

                new tw2widget.InventoryItem(ItemManager.get(init_id)).getMainDiv().appendTo(el("item"));

                if (init_id != 0) {
                    id.setValue(init_id);
                }

                var updatePreview = function() {
                    var item_id = parseInt(el("id").val());
                    if (item_id == 0 || x.getValue() === "" || y.getValue() === "") return;
                    removePreviewIfNot(item_id);
                    if (preview_item == null) {
                        preview_item = new tw2widget.InventoryItem(ItemManager.get(item_id));
                        preview_item.getMainDiv().css("z-index", 1);
                        preview_item.getMainDiv().css("position", "absolute");
                        preview_item.getMainDiv().append($('<span class="cooldown" style="display: inline">Preview</span>'));
                        preview_item.getMainDiv().appendTo(document.body);
                    }

                    preview_item.getMainDiv().css("left", x.getValue() + "px");
                    preview_item.getMainDiv().css("top", y.getValue() + "px");
                };

                id.addKeyUpListener(function() {
                    try {
                        var value = parseInt(id.getValue().replace(/\[item=(\d+)\]/, "$1"));
                        var item = ItemManager.get(value);
                        if (item) {
                            el("item").empty();
                            new tw2widget.InventoryItem(item).getMainDiv().appendTo(el("item"));
                            el("id").val(value);
                            updatePreview();
                        }
                    }
                    catch (e) { }
                });
                x.getField().add(y.getField()).attr("min", 0).on("input", updatePreview);

                id.getMainDiv().appendTo(el("item_id"));
                x.getMainDiv().appendTo(el("x"));
                y.getMainDiv().appendTo(el("y"));

                d.show();
                updatePreview();
            },
            change: function(item_id) {
                var pos = this.getItems()[item_id] || ["", ""];
                this.createEditDialog(item_id, pos[0], pos[1]);
            },
            set: function(item_id, position) {
                var items = this.getItems();
                items[item_id] = position;
                this.saveItems(items);
            },
            remove: function(item_id) {
                var dialog = new west.gui.Dialog(scriptName, "Do you really want to remove " + AccessibleItems.helpers.item_name(item_id) + "?", west.gui.Dialog.SYS_QUESTION), that = this;
                dialog.addButton("yes", function() {
                    var items = that.getItems();
                    delete items[item_id];
                    that.saveItems(items);
                    return true;
                });
                dialog.addButton("cancel").show();
            }
        },
        storage: {
            add: function(name, value) {
                localStorage.setItem("EnergyBag_" + name, JSON.stringify(value));
            },
            get: function(name) {
                if (!this.exists(name)) {
                    console.log("Storage contains no value for name: " + name);
                    return null;
                }
                return JSON.parse(localStorage.getItem("EnergyBag_" + name));
            },
            exists: function(name) {
                return localStorage.getItem("EnergyBag_" + name) !== null;
            }
        },
        script: {
			api: null,
			listeningSignal: 'game_config_loaded',
			init: function() {
                var that = this;
				if(!!(Game && Game.loaded)) {
					this.api = TheWestApi.register(scriptObject, scriptName, "2.82", Game.version.toString(), scriptAuthor, scriptURL);

                    AccessibleItems.settings.init();

                    if (!!(ItemManager && ItemManager.isLoaded())) {
                        AccessibleItems.inventoryManager.init();
                        this.fillGui();
                    }
                    else {
                        EventHandler.listen("itemmanager_loaded", function() {
                            AccessibleItems.inventoryManager.init();
                            that.fillGui();
                            return EventHandler.ONE_TIME_EVENT;
                        });
                    }

				}
                else {
                    EventHandler.listen(this.listeningSignal, function() {
                        that.init();
                        return EventHandler.ONE_TIME_EVENT;
                    });
                }
			},
            fillGui: function() {
                var html = '<p style="margin: 8px; margin-left: 16px; font-size: 18px;">Items to display:</p>';
                $.each(AccessibleItems.settings.getItems(), function(item_id, position) {
                    html += '<p style="margin: 8px; font-size: 16px;">';
                    html += Game.TextHandler.parse("[item=" + item_id + "]");
                    html += " at position [" + position + "]";
                    html += ' <a href="javascript:AccessibleItems.settings.change(' + item_id + ')">(change)</a>';
                    html += ' <a href="javascript:AccessibleItems.settings.remove(' + item_id + ')">[remove]</a>.';
                    html += "</p>";
                });
                html += '<div class="tw2gui_button" onclick="javascript:AccessibleItems.settings.add()" style="margin-left: 16px; margin-top: 16px;"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="tw2gui_button_middle_bg"></div><div class="textart_title">Add new item</div></div>';

                this.api.setGui(html);

                var script_window = wman.getById("scripts");
                if (script_window) {
                    if (script_window.currentActiveTabId == scriptObject) {
                        script_window.fireActivateTab(scriptObject);
                    }
                }
            }
		}
	};
	$(function() { try { AccessibleItems.script.init(); } catch(x) { console.trace(x); } });
});
