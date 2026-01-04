// ==UserScript==
// @name         [HWM] War helper
// @namespace    https://greasyfork.org/en/users/242258
// @description  Adds hotkeys and shows active spell.
// @version      0.19
// @author       Alex_2oo8
// @match        https://www.heroeswm.ru/war.php*
// @downloadURL https://update.greasyfork.org/scripts/377150/%5BHWM%5D%20War%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/377150/%5BHWM%5D%20War%20helper.meta.js
// ==/UserScript==

(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
    /* globals $ WarHelper Konva PIXI */

    var SCRIPT_VERSION = "0.19";

    this.WarHelper = {
        helpers: {
            inject: function(className, methodName, fun_before, fun_after) {
                var oldMethod = className[methodName];
                className[methodName] = function() {
                    if (typeof fun_before == "function") {
                        try {
                            if (fun_before.apply(this, arguments) === true) return;
                        }
                        catch (error) {
                            console.log("Whoops... there was an error: ", error);
                        }
                    }

                    var ret = oldMethod.apply(this, arguments);

                    if (typeof fun_after == "function") {
                        try {
                            fun_after.apply(this, arguments);
                        }
                        catch (error) {
                            console.log("Whoops... there was an error: ", error);
                        }
                    }

                    return ret;
                };
            },
            addCSS: function(css) {
                $('<style type="text/css">' + css + '</style>').appendTo('head');
            },
            addChatMessage: function(message) {
                window.chatlog += '<b style="color: #b78639;">[War Helper Script]</b> ' + message + "<br>";
                window.newmess_count++;
                $("#chat_inside").html(window.chatlog);
                window.check_newmess();
            },
            getImageURL: function(path) {
                return window.stage[window.war_scr].subpath + path + "?v=" + window.image_ver;
            },
            warningText: null,
            warningTextKind: null,
            warningTimer: null,
            showWarning: function(text) {
                var x;
                if (WarHelper.helpers.warningTextKind == "pixi") {
                    WarHelper.helpers.warningText.text = text;
                    WarHelper.helpers.warningText.style.fontSize = Math.max(1, 50 * window.stage[window.war_scr].scaling);

                    x = window.stage_width / 2 - WarHelper.helpers.warningText.width / 2;
                    WarHelper.helpers.warningText.x = x;
                    WarHelper.helpers.warningText.y = 200 * window.stage[window.war_scr].scaling;

                    WarHelper.helpers.warningText.visible = 1;
                }
                else {
                    WarHelper.helpers.warningText.setAttr("text", text);
                    WarHelper.helpers.warningText.fontSize(50 * window.stage[window.war_scr].scaling);

                    x = window.stage_width / 2 - WarHelper.helpers.warningText.getWidth() / 2;
                    WarHelper.helpers.warningText.setAttrs({x: x, y: 200 * window.stage[window.war_scr].scaling});

                    WarHelper.helpers.warningText.visible(1);
                    WarHelper.helpers.warningText.parent.draw();
                }

                clearTimeout(WarHelper.helpers.warningTimer);
                WarHelper.helpers.warningTimer = setTimeout(WarHelper.helpers.hideWarning, 5000);
            },
            hideWarning: function() {
                if (WarHelper.helpers.warningTextKind == "pixi") {
                    WarHelper.helpers.warningText.visible = 0;
                }
                else {
                    WarHelper.helpers.warningText.visible(0);
                    WarHelper.helpers.warningText.parent.draw();
                }
            },
            init: function() {
                var layer;
                if (typeof window.stage[window.war_scr].add != "function") {
                    WarHelper.helpers.warningTextKind = "pixi";
                    layer = new PIXI.Sprite();
                    layer.zIndex = 100000;
                    WarHelper.helpers.warningText = new PIXI.Text('', {
                        fontFamily: 'Arial',
                        align: 'center',
                        fill: 0xFFFFFF,
                        dropShadowColor: 0x000000,
                        dropShadowBlur: 5,
                        dropShadowAlpha: 10,
                        dropShadow: true,
                        dropShadowDistance: 0,
                        dropShadowAngle: 0,
                        zIndex: 5
                    });
                    layer.addChild(WarHelper.helpers.warningText);
                    window.stage[window.war_scr].unit_layer.addChild(layer);
                }
                else {
                    WarHelper.helpers.warningTextKind = "konva";
                    layer = new Konva.Layer({hitGraphEnabled : false, listening: false});
                    WarHelper.helpers.warningText = new Konva.Text({
                        text: '',
                        fontFamily: 'Arial',
                        align: 'center',
                        fill: 'white',
                        shadowColor: 'black',
                        shadowBlur: 5,
                        shadowOpacity: 10,
                        hitGraphEnabled : false
                    });
                    layer.add(WarHelper.helpers.warningText);
                    window.stage[window.war_scr].add(layer);
                }
            }
        },

        settings: {
            settingsWindow: $('<div class="window WarHelper_settings" style="display: none; top: -5vh;" />'),
            hotkeyContainer: $('<div class="fullLog_croppedArea WinCroppedBlockHeight" style="max-height: 40vh;" />'),
            newHotkeyRow: null,
            keyForSetup: null,
            init: function() {
                WarHelper.helpers.addCSS(".hotkey_table { width: 100%; border-collapse: collapse; }");
                WarHelper.helpers.addCSS(".hotkey_table tr { height: 26px; }");
                WarHelper.helpers.addCSS(".hotkey_table tr:nth-child(odd) { background-color: rgba(56, 110, 125, 0.5); }");
                WarHelper.helpers.addCSS(".hotkey_table tr:nth-child(even) { background-color: rgba(131, 162, 171, 0.5); }");
                WarHelper.helpers.addCSS(".hotkey_table tr:nth-child(odd):hover { background-color: rgba(56, 110, 125, 0.7); }");
                WarHelper.helpers.addCSS(".hotkey_table tr:nth-child(even):hover { background-color: rgba(131, 162, 171, 0.2); }");
                WarHelper.helpers.addCSS(".hotkey_table .btn_x { position: initial; width: 21px; height: 21px; margin: 2px auto 2px auto; min-height: 21px; min-width: 21px; }");
                WarHelper.helpers.addCSS(".hotkey_table td { padding: 0 10px 0 10px; }");

                WarHelper.helpers.addCSS(".number-input input { -webkit-appearance: textfield; -moz-appearance: textfield; appearance: textfield; }");
                WarHelper.helpers.addCSS(".number-input input::-webkit-inner-spin-button, .number-input input::-webkit-outer-spin-button { -webkit-appearance: none; }");
                WarHelper.helpers.addCSS(".number-input { border: 2px solid #555; display: inline-flex !important; vertical-align: middle; margin-left: 0.3em !important; }");
                WarHelper.helpers.addCSS(".number-input, .number-input * { box-sizing: border-box; }");
                WarHelper.helpers.addCSS(".number-input button { outline:none; -webkit-appearance: none; background-color: transparent; border: none; align-items: center; justify-content: center; width: 1.5em; height: 1.5em; cursor: pointer; margin: 0;  position: relative; }");
                WarHelper.helpers.addCSS(".number-input button:before, .number-input button:after { display: inline-block; position: absolute; content: ''; width: 1rem; height: 2px; background-color: #353535; transform: translate(-50%, -50%); }");
                WarHelper.helpers.addCSS(".number-input button.plus:after { transform: translate(-50%, -50%) rotate(90deg); }");
                WarHelper.helpers.addCSS(".number-input input { font-family: sans-serif; border: solid #555; border-width: 0 2px; font-size: 90%; font-weight: bold; text-align: center; }");

                WarHelper.helpers.addCSS(".WarHelper_settings .info_row { margin-right: 16px; }");

                if (WarHelper.storage.exists("enable_hotkeys") == false) {
                    WarHelper.settings.setHotkey(87, "wait");
                    WarHelper.settings.setHotkey(68, "defend");
                    WarHelper.settings.setHotkey(67, "magicbook");
                }

                if (WarHelper.storage.exists("max_cell_size_ratio") == false) {
                    WarHelper.settings.setMaxCellSizeRatio(9.9);
                }

                if (WarHelper.storage.exists("max_obj_scale") == false) {
                    WarHelper.settings.setMaxObjScale(9.9);
                }

                var SETTINGS = [
                    {text: "Показывать активное заклинание", set: "setEnableActiveSpell", get: "activeSpellEnabled", default: true, tooltip: "Показывать информацию о выбранном заклинании в правом верхнем углу.<br>Полезно при использовании горячих клавиш для заклинаний.", setting: "enable_active_spell"},
                    {text: "Включить горячие клавиши", set: "setEnableHotkeys", get: "hotkeysEnabled", default: true, setting: "enable_hotkeys"},
                    {text: "Показывать id отряда в информации", set: "setShowCreatureId", get: "showCreatureId", default: false, tooltip: "Показывать id в левом верхнем углу информации об отряде.<br><br>Полезно при рассчете цели цепной молнии или ярости берсерка (среди близжайших выбирается отряд с минимальным id).", setting: "show_creature_id"},
                    {text: "Показывать умения фракции в информации героя", set: "setShowHeroSkills", get: "showHeroSkills", default: false, tooltip: "Перезагрузите страницу, чтобы применить изменения этой настройки.", setting: "show_hero_skills"},
                    {text: "Доступ к книге магии в информации героя и существ", set: "setPreviewMagicBook", get: "getPreviewMagicBook", default: false, tooltip: "Перезагрузите страницу, чтобы применить изменения этой настройки.", setting: "show_hero_magic_book"},
                    {text: "Оповещение о доступном автоматическом завершении боя", set: "setAutoNotification", get: "getAutoNotification", default: false, setting: "auto_notification"}
                ];

                var gameSettingsCloseButton = $("#win_Settings center");
                var settingsButton = $('<div class="btns">War Helper Script</div>');
                settingsButton.click(WarHelper.settings.open);
                $('<center />').append(settingsButton).insertBefore(gameSettingsCloseButton);
                $('<div class="info_separator_horizontal" />').insertBefore(gameSettingsCloseButton);

                var changeHandler = function(event) { this(event.target.checked); };
                var setter = function(value) { WarHelper.storage.add(this, value); };
                var getter = function() { return WarHelper.storage.get(this); };

                var settingsContainer = $('<div class="fullLog_croppedArea WinCroppedBlockHeight" style="min-width: 25vw; max-height: 30vh;"></div>');
                for (var i = 0; i < SETTINGS.length; i++) {
                    var setting = SETTINGS[i];
                    WarHelper.settings[setting.set] = setter.bind(setting.setting);
                    WarHelper.settings[setting.get] = getter.bind(setting.setting);

                    if (WarHelper.storage.exists(setting.setting) == false) {
                        WarHelper.storage.add(setting.setting, setting.default);
                    }

                    var div = $('<div class="info_row"><label class="checkbox_container">' + setting.text + '<input type="checkbox"><span class="checkbox_checkmark"></span></label></div>');
                    $("input", div).attr("checked", WarHelper.settings[setting.get]());
                    $("input", div).change(changeHandler.bind(WarHelper.settings[setting.set]));
                    if (setting.hasOwnProperty("tooltip")) {
                        div.easyTooltip({content: setting.tooltip});
                    }
                    div.appendTo(settingsContainer);
                    $("<br />").appendTo(settingsContainer);
                }

                var updateGridSizeRatio = function(value) {
                    WarHelper.settings.setMaxCellSizeRatio(value);
                    window.stage[window.war_scr].resized_war_scr(1);
                };

                var gridSizeRatioDiv = WarHelper.settings.createNumericSetting("Максимальная растянутость клеток",
                                                                               "В боях с большим полем сжимать его (горизонтально) для более приятной картинки.<br />Чем меньше значение этой настройки, тем сильнее будет сжато поле.",
                                                                               WarHelper.settings.getMaxCellSizeRatio(),
                                                                               updateGridSizeRatio);

                settingsContainer.append(gridSizeRatioDiv);

                var updateObjScale = function(value) {
                    WarHelper.settings.setMaxObjScale(value);
                    window.stage[window.war_scr].resized_war_scr(1);
                };

                var objScaleDiv = WarHelper.settings.createNumericSetting("Максимальная высота отряда",
                                                                          "Уменьшает картинки существ в боях с маленькими (в высоту) клетками.<br />Численное значение примерно равно высоте ангела (от ног до конца крыльев) в клетках.",
                                                                          WarHelper.settings.getMaxObjScale(),
                                                                          updateObjScale);

                settingsContainer.append(objScaleDiv);

                WarHelper.settings.populateHotkeyContainer();

                var closeButton = $('<div class="btns">Закрыть</div>');
                closeButton.click(WarHelper.settings.close);
                WarHelper.settings.settingsWindow.append($('<div class="info_head" style="text-transform: none;">WAR HELPER SCRIPT v' + SCRIPT_VERSION + "</div>"));
                WarHelper.settings.settingsWindow.append($('<div class="info_separator_horizontal" />'));
                WarHelper.settings.settingsWindow.append(settingsContainer);
                WarHelper.settings.settingsWindow.append($('<div class="info_separator_horizontal" />'));
                WarHelper.settings.settingsWindow.append($('<div class="info_head">Горячие клавиши</div>'));
                WarHelper.settings.settingsWindow.append($('<div class="info_separator_horizontal" />'));
                WarHelper.settings.settingsWindow.append(WarHelper.settings.hotkeyContainer);
                WarHelper.settings.settingsWindow.append($('<div class="info_separator_horizontal" />'));
                WarHelper.settings.settingsWindow.append($('<center />').append(closeButton));
                WarHelper.settings.settingsWindow.appendTo($("#full_container"));
            },
            createNumericSetting: function(caption, tooltip, value, update) {
                var div = $('<div class="info_row">' + caption + ': <div class="number-input"><button /><input step="0.1" min="1.0" max="9.9" type="number" disabled /><button class="plus" /></div></div>');
                div.easyTooltip({content: tooltip});
                var input = $("input", div)[0];
                input.value = value;
                var buttons = $("button", div);
                $(buttons[0]).click(function() { input.stepDown(); update(input.value); });
                $(buttons[1]).click(function() { input.stepUp(); update(input.value); });

                return div;
            },
            populateHotkeyContainer: function() {
                var hotkeyTable = $('<table class="hotkey_table" />');

                WarHelper.settings.hotkeyContainer.empty();
                WarHelper.settings.hotkeyContainer.append(hotkeyTable);

                var getRemoveHotkeyHandler = function(key, keyName, action) { return function() {
                    if (confirm("Удалить горячую клавишу " + keyName + ' для "' + action + '"?')) {
                        WarHelper.settings.removeHotkey(key);
                    }
                }; };
                for (var key = 0; key < 255; key++) {
                    var action = WarHelper.settings.getHotkey(key);
                    if (action === null || action == "nothing") continue;
                    if (WarHelper.hotkeys.actions.hasOwnProperty(action)) {
                        action = WarHelper.hotkeys.actions[action].name;
                    }
                    else if (action.startsWith("rune")) {
                        if (action == "rune0") action = "rune10";
                        action = $("#" + action + "_description").html();
                    }
                    else {
                        var powered = action.slice(-1) - 0;
                        var spell = action.slice(0, -1);
                        action = WarHelper.spell.getName(spell, powered);
                    }
                    var keyName = "[" + WarHelper.hotkeys.keyCodes[key] + "]";
                    var row = $("<tr><td>" + keyName + "</td><td>" + action + '</td><td><div class="btn_x" /></td></tr>');
                    $(".btn_x", row).click(getRemoveHotkeyHandler(key, keyName, action));
                    hotkeyTable.append(row);
                }

                WarHelper.settings.newHotkeyRow = $('<tr><td colspan="3"><div style="position: relative; overflow: hidden;"><div class="btn_x" style="transform: rotate(45deg);" /></div></td></tr>');
                $(".btn_x", WarHelper.settings.newHotkeyRow).click(function() {
                    WarHelper.settings.newHotkeyRow.empty();
                    WarHelper.settings.newHotkeyRow.append($('<td colspan="3">[Нажмите клавишу]</td>'));
                    WarHelper.hotkeys.catchKeyForSetup = true;
                });
                hotkeyTable.append(WarHelper.settings.newHotkeyRow);
            },
            processKeyForSetup: function(key) {
                var actionSelect = $('<select style="border: none; background: transparent; font-family: inherit; font-size: inherit;"/>');
                actionSelect.append($('<option value="0" disabled="true" selected="true">Выберите действие</option>'));
                for (var action in WarHelper.hotkeys.actions) {
                    if (action == "auto") continue;

                    actionSelect.append($('<option value="' + action + '">' + WarHelper.hotkeys.actions[action].name + "</option>"));
                }
                actionSelect.append($('<option value="spell">Заклинание</option>'));
                actionSelect.append($('<option value="rune">Руна гномов</option>'));
                actionSelect.change(function(event) { WarHelper.settings.setupHotkey(key, event.currentTarget.value); });

                WarHelper.settings.newHotkeyRow.empty();
                WarHelper.settings.newHotkeyRow.append($("<td>[" + WarHelper.hotkeys.keyCodes[key] + "]</td>"));
                WarHelper.settings.newHotkeyRow.append($("<td />").append(actionSelect));
                WarHelper.settings.newHotkeyRow.append($('<td><div class="btn_x" /></td>'));
                $(".btn_x", WarHelper.settings.newHotkeyRow).click(WarHelper.settings.populateHotkeyContainer);
            },
            setupHotkey: function(key, action) {
                if (action != "spell" && action != "rune") {
                    WarHelper.settings.setHotkey(key, action);
                    return;
                }

                WarHelper.settings.keyForSetup = key;

                if (action == "rune") {
                    WarHelper.runes.catchRuneForHotkey = true;
                    WarHelper.settings.close();
                    window.prepare_runes();
                    window.show_button("scroll_runes");
                    return;
                }

                var EXCLUDED_SPELLS = ["armageddon", "hypnos", "skyandearth", "setsnares", "vampirizm", "waves", "spiritlink", "mskyandearth", "firstblood", "deepfreeze", "divinevengeance", "stormcaller", "magicmine", "sorrow", "djinluck", "djinunluck"];

                window.stage.pole.obj.test = {darkpower: 1, nowmanna: 1, maxmanna: 1, nownumber: 1};
                window.magic.test = {};
                window.activeobj = "test";
                for (var i = 0; i < window.magicbookspells.length; i++) {
                    var spell = window.magicbookspells[i];
                    if (EXCLUDED_SPELLS.indexOf(spell) != -1) continue;
                    window.stage.pole.obj.test[spell] = 1;
                    window.stage.pole.obj.test[spell + "cost"] = 0;
                }
                window.bookpage = 0;
                window.stage.pole.showmagicbook(0, 0);
                window.stage.pole.checkpage();
                WarHelper.settings.close();
                window.show_button("magic_book");

                WarHelper.activeSpell.catchSpellForHotkey = true;
            },
            setupSpellHotkey: function(spellId) {
                window.hide_button("magic_book");

                WarHelper.settings.setHotkey(WarHelper.settings.keyForSetup, window.spell_id[spellId] + window.spell_powered[spellId]);
                WarHelper.settings.open();
            },
            setupRuneHotkey: function(rune) {
                window.hide_button("scroll_runes");

                WarHelper.settings.setHotkey(WarHelper.settings.keyForSetup, "rune" + rune);
                WarHelper.settings.open();
            },
            open: function() {
                window.hide_button("win_Settings");
                WarHelper.settings.settingsWindow.css("display", "");
            },
            close: function() {
                WarHelper.settings.settingsWindow.css("display", "none");
            },
            getHotkey: function(key) {
                if (WarHelper.storage.exists("hotkey" + key)) {
                    return WarHelper.storage.get("hotkey" + key);
                }
                else {
                    return null;
                }
            },
            setHotkey: function(key, action) {
                WarHelper.storage.add("hotkey" + key, action);
                WarHelper.settings.populateHotkeyContainer();
            },
            removeHotkey: function(key) {
                WarHelper.storage.add("hotkey" + key, "nothing");
                WarHelper.settings.populateHotkeyContainer();
            },
            setMaxCellSizeRatio(value) {
                WarHelper.storage.add("max_cell_size_ratio", value);
            },
            getMaxCellSizeRatio() {
                return WarHelper.storage.get("max_cell_size_ratio");
            },
            setMaxObjScale(value) {
                WarHelper.storage.add("max_obj_scale", value);
            },
            getMaxObjScale() {
                return WarHelper.storage.get("max_obj_scale");
            }
        },

        storage: {
            add: function(name, value) {
                localStorage.setItem("WarHelper_" + name, JSON.stringify(value));
            },
            get: function(name) {
                if (!WarHelper.storage.exists(name)) {
                    console.log("Storage contains no value for name: " + name);
                    return null;
                }
                return JSON.parse(localStorage.getItem("WarHelper_" + name));
            },
            remove: function(name) {
                localStorage.removeItem("WarHelper_" + name);
            },
            exists: function(name) {
                return localStorage.getItem("WarHelper_" + name) !== null;
            }
        },

        spell: {
            getName: function(spell, powered) {
                var i = window.magicbookspells.indexOf(spell);
                return window.magicbooknames[i] + (powered ? " (усиленное)" : "");
            },
            getCost: function(spell, powered) {
                var noCostSpells = ["explosion", "invisibility", "channeling", "siphonmana", "leap", "sacrificegoblin", "gating", "summonpitlords", "seduction", "teleportother", "consumecorpse", "benediction"];
                if (noCostSpells.indexOf(spell) != -1) return "";

                var stage = window.stage[window.war_scr], activeObj = stage.obj[window.activeobj], cost = activeObj[spell + "cost"], kz = 1, eco = 1;

                if (powered) cost *= 2;

                if (activeObj.hero) {
                    if (window.isperk(window.activeobj, 110)) kz *= 0.8;
                    if (window.isperk(window.activeobj, 111)) kz *= 0.8;

                    var haveEnergyChannel = false, haveManaEater = false;
                    for (var i = 0; i < stage.obj_array.length; i++) {
                        var currentObj = stage.obj[stage.obj_array[i]];
                        if (currentObj.energychannel && currentObj.nownumber > 0 && currentObj.owner == activeObj.owner) {
                            haveEnergyChannel = true;
                        }
                        if (currentObj.manaeater && currentObj.nownumber > 0 && currentObj.side != activeObj.side) {
                            haveManaEater = true;
                        }
                    }

                    if (haveEnergyChannel) eco *= 0.75;
                    if (haveManaEater) eco *= 1.3;
                }
                else if (window.isperk(window.activeobj, 87)) kz = 0.5;

                cost = Math.round(cost * kz);
                cost = Math.round(cost * eco);

                if (spell == "manafeed") cost = Math.min(activeObj.nowmanna, activeObj.nownumber);

                return cost;
            },
            getEffect: function(spell, powered) {
                var stage = window.stage[window.war_scr], activeObj = stage.obj[window.activeobj], eff;
                if (spell == "angerofhorde") {
                    var effmain = 0, len = stage.obj_array.length;
                    for (var i = 0; i < len; i++) {
                        var currentObj = stage.obj[stage.obj_array[i]];
                        if (currentObj.owner == activeObj.owner && !currentObj.hero && !currentObj.warmachine) {
                            effmain += currentObj.nownumber;
                        }
                    }
                    activeObj[spell + "effmain"] = effmain;
                }
                if (activeObj[spell + "effmain"] > 0) {
                    var sp = 0;
                    if (activeObj.hero) {
                        sp = stage.getspellpower(window.activeobj);
                        if (window.isperk(window.activeobj, 93) && (spell == "magicfist" || spell == "raisedead")) sp += 4;
                        if (window.isperk(window.activeobj, 78) && (spell == "poison" || spell == "mpoison")) sp += 5;
                        if (window.isperk(window.activeobj, 89) && (spell == "poison" || spell == "mpoison")) sp += 3;
                    }
                    else sp = Math.pow(activeObj.nownumber, 0.7);

                    eff = Math.round(activeObj[spell + "effmain"] + activeObj[spell + "effmult"] * sp);
                    if (activeObj.hero && powered) eff = Math.round(eff * 1.5);

                    if (activeObj[spell + "time"] > 0 && activeObj[spell + "effmain"] > 15 && spell != "antimagic") {
                        eff = activeObj[spell + "effmain"] + "%";
                    }

                    if (spell.substr(0, spell.length - 1) == "summoncreature") {
                        if (window.magic[window.activeobj].suc) {
                            eff = Math.floor(eff * Math.pow(0.9, window.magic[window.activeobj].suc.effect));
                        }
                    }
                }
                else {
                    if (spell == "explosion") {
                        eff = Math.round(9 + 9 * Math.pow(activeObj.nownumber, 0.7));
                    }
                    if (spell == "channeling") {
                        eff = Math.max(1, Math.floor(activeObj.nownumber * 0.5));
                    }
                }

                return eff;
            },
            getDuration: function(spell) {
                var activeObj = window.stage[window.war_scr].obj[window.activeobj], dur = "";
                if (activeObj[spell + "time"] > 0) {
                    if (activeObj.hero || window.magic[window.activeobj].her /* ??? */) {
                        dur = window.stage[window.war_scr].getspellpower(window.activeobj);
                        if (window.isperk(window.activeobj, 89)) dur += 3;
                        if (window.isperk(window.activeobj, 78) && window.checkdark(spell)) dur += 5;
                    }
                    else {
                        dur = activeObj.nownumber;
                    }

                    if (dur == 0) dur = 0.5;
                }

                return dur;
            }
        },

        activeSpell: {
            catchSpellForHotkey: false,
            mainDiv: $('<div class="active_spell_container" style="display: none;"><div class="book_skill_block_Desktop"><div class="book_skill_block_container"><div class="book_skill_block_amounts book_skill_block_name" style="font-size: 100%;">NAME</div><div class="book_skill_block_amounts book_skill_block_effects">COST</div><div class="book_skill_block_amounts book_skill_block_cost">EFFECT</div><div class="book_skill_block_amounts book_skill_block_durt">DURATION</div></div></div></div>'),
            init: function() {
                WarHelper.helpers.addCSS(".active_spell_container { position: absolute; top: 0; right: 90px; width: 20vh; max-width: 13%; }");
                WarHelper.helpers.addCSS('.active_spell_container:before { content: ""; display: block; padding-top: 100%; }');
                WarHelper.helpers.addCSS(".active_spell_container .book_skill_block_Desktop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; margin: 0; }");

                this.mainDiv.appendTo($("#full_container"));
            },
            show: function(spell, powered) {
                var setDesc = function(selector, method) {
                    var text = WarHelper.spell[method](spell, powered);
                    $(selector, this.mainDiv).text(text);
                    $(selector, this.mainDiv).css("display", (text == "" || text == undefined) ? "none" : "");
                }

                setDesc(".book_skill_block_name", "getName");
                setDesc(".book_skill_block_effects", "getCost");
                setDesc(".book_skill_block_cost", "getEffect");
                setDesc(".book_skill_block_durt", "getDuration");
                $(".book_skill_block_Desktop", this.mainDiv).css("background-image", "url(" + WarHelper.helpers.getImageURL("combat/magicbook/" + spell + ".png") + ")");
                this.mainDiv.css("display", "");
            },
            hide: function() {
                WarHelper.activeSpell.mainDiv.css("display", "none");
            }
        },

        runes: {
            catchRuneForHotkey: false,
            release: function(event) {
                if (WarHelper.runes.catchRuneForHotkey) {
                    WarHelper.runes.catchRuneForHotkey = false;
                    WarHelper.settings.setupRuneHotkey(this.rune);
                    return true;
                }
            }
        },

        hotkeys: {
            keyCodes: {0: "\\0", 3: "break", 8: "backspace", 9: "tab", 12: "clear", 13: "enter", 19: "pause", 20: "caps lock", 21: "hangul", 25: "hanja", 27: "escape", 28: "conversion", 29: "non-conversion", 32: "spacebar", 33: "page up", 34: "page down", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 41: "select", 42: "print", 43: "execute", 44: "Print Screen", 45: "insert", 46: "delete", 47: "help", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 58: ":", 59: "semicolon (firefox), equals", 60: "<", 61: "equals (firefox)", 63: "ß", 64: "@ (firefox)", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z", 91: "Left Windows Key", 92: "Right Windows Key", 93: "Windows Menu / Right ⌘", 95: "sleep", 96: "numpad 0", 97: "numpad 1", 98: "numpad 2", 99: "numpad 3", 100: "numpad 4", 101: "numpad 5", 102: "numpad 6", 103: "numpad 7", 104: "numpad 8", 105: "numpad 9", 106: "multiply", 107: "add", 108: "numpad period (firefox)", 109: "subtract", 110: "decimal point", 111: "divide", 112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12", 124: "f13", 125: "f14", 126: "f15", 127: "f16", 128: "f17", 129: "f18", 130: "f19", 131: "f20", 132: "f21", 133: "f22", 134: "f23", 135: "f24", 144: "num lock", 145: "scroll lock", 160: "^", 161: "!", 162: "؛ (arabic semicolon)", 163: "#", 164: "$", 165: "ù", 166: "page backward", 167: "page forward", 168: "refresh", 169: "closing paren (AZERTY)", 170: "*", 171: "~ + * key", 172: "home key", 173: "minus (firefox), mute/unmute", 174: "decrease volume level", 175: "increase volume level", 176: "next", 177: "previous", 178: "stop", 179: "play/pause", 180: "e-mail", 181: "mute/unmute (firefox)", 182: "decrease volume level (firefox)", 183: "increase volume level (firefox)", 186: ";", 187: "=", 188: "<", 189: "-", 190: ">", 191: "?", 192: "~", 193: "?, / or °", 194: "numpad period (chrome)", 219: "{", 220: "back slash", 221: "}", 222: '"', 223: "`", 224: "left or right ⌘ key (firefox)", 225: "altgr", 226: "< /git >, left back slash", 230: "GNOME Compose Key", 231: "ç", 233: "XF86Forward", 234: "XF86Back", 235: "non-conversion", 240: "alphanumeric", 242: "hiragana/katakana", 243: "half-width/full-width", 244: "kanji", 251: "unlock trackpad (Chrome/Edge)", 255: "toggle touchpad"},
            catchKeyForSetup: false,
            actions: {
                "arrange": {name: "Автоматическая расстановка", handler: function() { if (window.randinsc > 0) { window.make_ins_but(); } }},
                "confirm_arr": {name: "Подтвердить расстановку", handler: function() { if (window.buttons_visible.confirm_ins || window.buttons_visible.confirm_ins2) { window.confirm_ins_but(); } }},
//                "auto": {name: "Автоматическая битва", handler: function() { if (window.buttons_visible.fastbattle_on) { window.fastbut_onRelease(); } else if (window.buttons_visible.fastbattle_off) { window.fastbutcancel_onRelease(); } }},
                "auto": {name: "Автоматическая битва", handler: function() { WarHelper.helpers.showWarning("Hotkey на авто отключен, так как считается\nадминистрацией как \"автоматический скрипт\"."); }},
                "wait": {name: "Ожидание"},
                "defend": {name: "Оборона"},
                "magicbook": {name: "Открыть книгу магии"},
                "magicbook_next_page": {name: "Следующая страница книги магии", handler: function() { if (window.buttons_visible.book_next) { window.book_next_release(); } }},
                "magicbook_prev_page": {name: "Предыдущая страница книги магии", handler: function() { if (window.buttons_visible.book_prev) { window.book_prev_release(); } }},
                "play": {name: "Пауза / воспроизведение битвы", handler: function() { if (window.gpause) window.play_button_onRelease(); else window.pause_button_onRelease(); }},
                "back": {name: "Вернуться в игру"},
                "chat": {name: "Открыть / закрыть чат", handler: function() { if (window.chat_opened) window.close_chat(); else window.open_chat(); }}
            },
            init: function() {
                var check_keys = window.check_keys;
                WarHelper.hotkeys.actions.wait.handler = function() { check_keys(87); };
                WarHelper.hotkeys.actions.defend.handler = function() { check_keys(68); };
                WarHelper.hotkeys.actions.magicbook.handler = function() { check_keys(67); };
                WarHelper.hotkeys.actions.back.handler = window.back_to_game_button_onRelease;
            },
            makeAction: function(action) {
                if (WarHelper.hotkeys.actions.hasOwnProperty(action)) {
                    WarHelper.hotkeys.actions[action].handler();
                }
                else if (action == "nothing") { /* to disable default hotkeys */ }
                else if (action.startsWith("rune")) {
                    var rune = parseInt(action.substr(4));
                    ({rune: rune, use: window.release_rune}).use();
                }
                else { // magic
                    var powered = action.slice(-1) - 0;
                    var spell = action.slice(0, -1);
                    if (window.magicuse == spell && window.magicpower == powered) {
                        window.hide_magic_book();
                    }
                    else {
                        if (window.magicuse != "") {
                            window.hide_magic_book();
                        }

                        var activeObj = window.stage[window.war_scr].obj[window.activeobj];
                        if (activeObj[spell] != 1 || (powered == 1 && activeObj.darkpower != 1)) {
                            WarHelper.helpers.showWarning('Заклинание "' + WarHelper.spell.getName(spell, powered) + '" недоступно!');
                        }
                        else if (WarHelper.spell.getCost(spell, powered) > activeObj.nowmanna) {
                            WarHelper.helpers.showWarning("Недостаточно маны!");
                        }
                        else if (spell != "manafeed" || activeObj.nowmanna > 0) {
                            activeObj[spell + '_magiceff'] = WarHelper.spell.getEffect(spell, false);

                            window.spell_id[0] = spell;
                            window.spell_powered[0] = powered;
                            window.spell_button_release(0);
                            delete window.spell_id[0];
                            delete window.spell_powered[0];
                            window.show_button(window.classic_chat ? 'magicbook_button_close2' : 'magicbook_button_close');
                            window.hide_button(window.classic_chat ? 'magicbook_button2' : 'magicbook_button');
                        }
                    }
                }
            },
            handler: function(key) {
                if (key == 16 || key == 17 || key == 18 || key == 27) return false;
                if (WarHelper.settings.hotkeysEnabled() == false) return true;

                if (WarHelper.hotkeys.catchKeyForSetup) {
                    WarHelper.hotkeys.catchKeyForSetup = false;
                    WarHelper.settings.processKeyForSetup(key);
                    return true;
                }

                var action = WarHelper.settings.getHotkey(key);
                if (action == null) return false;

                if (window.chatfocus && action != "chat") return false;

                WarHelper.hotkeys.makeAction(action);
                return true;
            }
        },

        creatureInfo: {
            previewMagicBook: false,
            creatureMagicBookBtn: null,
            init: function() {
                WarHelper.helpers.addCSS(".cre_id { margin-right: -100%; margin-left: 10px; color: grey; float: left; }");

                var winHero = $("#win_InfoHero");

                if (WarHelper.settings.getPreviewMagicBook()) {
                    var magicBookBtn = $('<div class="btns"><span>&#8203;</span></div>');
                    magicBookBtn.css("padding", "1.25em 1.5em");
                    magicBookBtn.css("background", "url(https://dcdn.heroeswm.ru/i/artifacts/book.png) center center no-repeat, url(https://dcdn2.heroeswm.ru/i/combat/btn_gold_l.png?v=6) left center no-repeat, url(https://dcdn2.heroeswm.ru/i/combat/btn_gold_r.png?v=6) right center no-repeat, url(https://dcdn2.heroeswm.ru/i/combat/btn_gold.png?v=6) center center repeat-x");
                    magicBookBtn.css("background-size", "contain, cover, cover, cover");
                    magicBookBtn.css("min-width", "16px");
                    magicBookBtn.click(function() {
                        window.bookpage = 0;
                        WarHelper.creatureInfo.openMagicBook();
                    });

                    $("#btn_effects_info_hero", winHero).after(magicBookBtn);
                    $("#btn_effects_info_hero", winHero).after(" ");

                    WarHelper.creatureInfo.creatureMagicBookBtn = magicBookBtn.clone(true);

                    $("#btn_effects_info_creature", $("#win_InfoCreature")).after(WarHelper.creatureInfo.creatureMagicBookBtn);
                    $("#btn_effects_info_creature", $("#win_InfoCreature")).after(" ");

                    window.stage.pole.obj[0] = {};
                }

                if (WarHelper.settings.showHeroSkills()) {
                    $(".info_columns_block", winHero).css("width", "100%");
                    var firstColumn = $(".info_column1col", winHero);
                    firstColumn.removeClass("info_column1col");
                    firstColumn.addClass("info_column_separator");
                    firstColumn.css("padding", "0 16px 0 0");

                    var container = firstColumn.parent();
                    container.css("display", "flex");

                    var firstColumnWrapper = $("<div style='display: flex; flex-direction: column; height: 100%; justify-content: space-between;'>");
                    var firstColumnContents = firstColumn.children();
                    for (var i = 0; i < firstColumnContents.length; i++) {
                        if (firstColumnContents[i].tagName == "BR") {
                            firstColumnContents[i].remove();
                        }
                        else {
                            firstColumnWrapper.append(firstColumnContents[i]);
                        }
                    }

                    firstColumn.append(firstColumnWrapper);

                    var img = Array('', 'knight', 'necromancer', 'mage', 'elveon', 'barbarian', 'darkelves', 'demon', 'dwarf', 'steppebarbarian', 'egypt');
                    var names = Array('', 'Рыцарь', 'Некромант', 'Маг', 'Эльф', 'Варвар', 'Темный эльф', 'Демон', 'Гном', 'Степной варвар', 'Фараон');
                    var secondColumn = $('<div class="info_column" style="padding: 0 0 0 8px;"></div>');
                    for (var frac = 1; frac < 11; frac++) {
                        if (frac != 1) $("<br />").appendTo(secondColumn);

                        var row = $('<div class="info_row"><div id="hero_info_skill_name_' + frac + '">' + names[frac] + '</div><div id="hero_info_skill_' + frac + '">?</div></div>');
                        row.css("background-image", 'url(' + WarHelper.helpers.getImageURL("combat/factions_icons/faction_" + img[frac] + ".png") + ')');
                        row.css("background-origin", "content-box");
                        row.css("background-size", "contain");
                        row.appendTo(secondColumn);
                    }
                    firstColumn.after(secondColumn);

                    window.show_cre_info();
                    window.hide_windows();
                }
            },
            prepareHeroSkills: function(i) {
                var skills = window.umelka[window.stage.pole.obj[i].owner];
                for (var frac = 1; frac < 11; frac++) {
                    $("#hero_info_skill_" + frac).html(skills[frac]);
                    $("#hero_info_skill_name_" + frac).css("font-weight", skills[0] == frac ? "bold" : "normal");
                }
            },
            openMagicBook: function() {
                WarHelper.creatureInfo.previewMagicBook = true;

                window.stage.pole.checkpage();
                window.stage.pole.showmagicbook(window.bookpage, 0);

                window.hide_windows();
                window.show_button("magic_book");
            }
        },

        gridSize: {
            getDelta: function() {
                const K = WarHelper.settings.getMaxCellSizeRatio();

                var pole_bottom_width = window.stage_width - window.scr_left - window.scr_right - (window.pole_left + window.pole_right) * window.stage[window.war_scr].scaling;
                var pole_top_width = pole_bottom_width * window.top_size_def;
                var pole_height = window.stage_height - window.scr_bottom - window.scr_top - (window.pole_top + window.pole_bottom) * window.stage[window.war_scr].scaling;

                var max_width = pole_height * (window.defxn - 2) / window.defyn * K;
                return Math.max(pole_top_width - max_width, 0) / (window.top_size_def * window.stage[window.war_scr].scaling);
            },
            prepareSizes: function(width, height, scaling, top_size) {
                if (window.iscastle || window.iscastle_wall) return;

                var delta = WarHelper.gridSize.getDelta();
                window.pole_left += delta / 2;
                window.pole_right += delta / 2;
            },
            fixScaling: function() {
                if (window.iscastle || window.iscastle_wall) return;

                window.minus_pole = WarHelper.gridSize.getDelta();
            },
            getRatio: function() {
                var h = window.pole_height / window.defyn;
                var w = window.pole_top_width / (window.defxn - 2);
                return h / w;
            }
        },

        objScaling: {
            changeScaling: function() {
                this.oldScaling = this.scaling;
                var maxScaling = (window.stage_height / window.defyn) * WarHelper.settings.getMaxObjScale() / 4.5 * 0.008935310990338164;
                this.scaling = Math.min(this.scaling, maxScaling);
            },
            revertScaling: function() {
                this.scaling = this.oldScaling;
            }
        },

        notifications: {
            seenAuto: false,
            checkAuto: function(bname) {
                if (bname == "fastbattle_on" && WarHelper.notifications.seenAuto == false && WarHelper.settings.getAutoNotification()) {
                    WarHelper.notifications.seenAuto = true;
                    WarHelper.helpers.showWarning("Доступно автоматическое завершение боя!");
                }
            }
        },

        script: {
            init: function() {
                if (typeof window.pole_showed === 'undefined' || window.pole_showed == false) {
                    setTimeout(WarHelper.script.init, 1000);
                    return;
                }

                // Fixes "back" button for "&lt=-1" war logs
                if (document.referrer.indexOf("war.php") != -1) {
                    $("#back_to_game").on('mouseup', function() { history.go(-1); });
                }

                WarHelper.helpers.init();
                WarHelper.settings.init();
                WarHelper.activeSpell.init();
                WarHelper.hotkeys.init();
                WarHelper.creatureInfo.init();

                var savedPreviewMagicBook;
                WarHelper.helpers.inject(window.stage.pole, "calcinitiative", function() {
                    savedPreviewMagicBook = WarHelper.creatureInfo.previewMagicBook;
                }, function() {
                    if (savedPreviewMagicBook) {
                        WarHelper.creatureInfo.openMagicBook();
                    }
                });

                WarHelper.helpers.inject(window, "hide_button", null, function(name) {
                    if (name == "magic_book") {
                        if (WarHelper.activeSpell.catchSpellForHotkey) {
                            WarHelper.activeSpell.catchSpellForHotkey = false;
                            WarHelper.settings.open();
                            WarHelper.settings.populateHotkeyContainer();
                        }
                        else if (WarHelper.creatureInfo.previewMagicBook) {
                            WarHelper.creatureInfo.previewMagicBook = false;
                        }
                    }
                });

                WarHelper.helpers.inject(window, "spell_button_release", function(b) {
                    if (WarHelper.activeSpell.catchSpellForHotkey) {
                        WarHelper.activeSpell.catchSpellForHotkey = false;
                        WarHelper.settings.setupSpellHotkey(b);
                        return true;
                    }
                    if (WarHelper.creatureInfo.previewMagicBook) return true;
                }, function() {
                    if (window.magicuse != "" && WarHelper.settings.activeSpellEnabled()) {
                        WarHelper.activeSpell.show(window.magicuse, window.magicpower == 1);
                    }
                });

                WarHelper.helpers.inject(window, "release_rune", WarHelper.runes.release);

                WarHelper.helpers.inject(window, "reset_magicuse", WarHelper.activeSpell.hide);
                WarHelper.helpers.inject(window, "check_keys", WarHelper.hotkeys.handler);

                // Allow TAB key to be used for hotkeys
                WarHelper.helpers.inject(window, "onkeydown", function(e) { if(e.keyCode == 9) e.preventDefault(); });

                var savedActiveObj;
                WarHelper.helpers.inject(window.stage.pole, "checkpage", function() {
                    if (WarHelper.creatureInfo.previewMagicBook) {
                        savedActiveObj = window.activeobj;
                        window.activeobj = window.cur_unit_info;
                        window.stage.pole.obj[window.activeobj].bookpage = window.bookpage;
                    }
                }, null);

                WarHelper.helpers.inject(window.stage.pole, "showmagicbook", null, function() {
                    if (WarHelper.creatureInfo.previewMagicBook) {
                        window.activeobj = savedActiveObj;
                    }
                });

                WarHelper.helpers.inject(window.stage.pole, "prepare_info", null, function(i) {
                    if (WarHelper.settings.showCreatureId()) {
                        $("#cre_info_head").html('<span class="cre_id">#' + i + "</span>" + this.get_name_html(i));
                    }

                    if (WarHelper.settings.getPreviewMagicBook()) {
                        WarHelper.creatureInfo.creatureMagicBookBtn.css("display", (window.stage.pole.obj[i].caster == 1 ? "" : "none"));
                    }
                });

                WarHelper.helpers.inject(window.stage.pole, "prepare_hero_info", null, function(i) {
                    if (WarHelper.settings.showHeroSkills()) {
                        WarHelper.creatureInfo.prepareHeroSkills(i);
                    }
                });

                WarHelper.helpers.inject(window, "show_button", WarHelper.notifications.checkAuto);

                WarHelper.helpers.inject(window, "set_pole_data", WarHelper.gridSize.prepareSizes);
                WarHelper.helpers.inject(window, "get_scr_left_right", null, WarHelper.gridSize.fixScaling);

                WarHelper.helpers.inject(window, "set_pole_pos", WarHelper.objScaling.changeScaling, WarHelper.objScaling.revertScaling);

                var objs = window.stage.pole.obj;
                for (var i in objs) {
                    WarHelper.helpers.inject(objs[i], "set_pole_pos", WarHelper.objScaling.changeScaling, WarHelper.objScaling.revertScaling);
                }

                window.stage[window.war_scr].resized_war_scr(1);
            }
        }
    };

	$(function() { try { WarHelper.script.init(); } catch(x) { console.trace(x); } });
});
