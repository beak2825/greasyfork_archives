// ==UserScript==
// @name         MOOMOO.IO Insane Mod! *Discontinued since Jan 2018*
// @namespace    MOOMOO.IO Insane Mod! *Discontinued since Jan 2018*
// @version      1
// @description  Better Minimap, Hat & Accessory Toolbar, Auto Heal, Double Hit, Easy Bow, Rainbow Hat, Hotkeys
// @author       TigerYT
// @license      Just don't copy my script, without crediting me in the description.
// @match        http://moomoo.io/*
// @match        http://45.77.0.81/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @connect      moomoo.io
// @icon         http://moomoo.io/img/icons/skull.png
// @downloadURL https://update.greasyfork.org/scripts/35021/MOOMOOIO%20Insane%20Mod%21%20%2ADiscontinued%20since%20Jan%202018%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/35021/MOOMOOIO%20Insane%20Mod%21%20%2ADiscontinued%20since%20Jan%202018%2A.meta.js
// ==/UserScript==



(function () {
    var ITEM_TYPE = {
        WEAPON: 0,
        STONE: 1,
        FOOD: 2,
        PITTRAP: 3,
        WINDMAIL: 4,
        TWO_WEAPON: 5,
        SPIKES: 6,
        TURRET: 7,
        MINE: 8,
        EXTRAS: 9
    };

    var ITEMS = [{
        id: 0,
        type: ITEM_TYPE.WEAPON,
        name: "Tool hammer"
    }, {
        id: 1,
        sid: 1,
        type: ITEM_TYPE.WEAPON,
        name: "Hand axe"
    }, {
        id: 2,
        sid: 2,
        type: ITEM_TYPE.WEAPON,
        name: "Great axe"
    }, {
        id: 3,
        type: ITEM_TYPE.WEAPON,
        sid: 3,
        name: "Short Sword"
    }, {
        id: 4,
        sid: 4,
        type: ITEM_TYPE.WEAPON,
        name: "Katana"
    }, {
        id: 5,
        sid: 5,
        type: ITEM_TYPE.WEAPON,
        name: "PoleArm"
    }, {
        id: 6,
        sid: 6,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Hunting bow"
    }, {
        id: 7,
        sid: 7,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Great hammer"
    }, {
        id: 8,
        sid: 8,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Wooden shield"
    }, {
        id: 9,
        sid: 9,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Crossbow"
    }, {
        id: 10,
        sid: 10,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Musket"
    }, {
        id: 0,
        sid: 11,
        type: ITEM_TYPE.FOOD,
        name: "Apple"
    }, {
        id: 1,
        sid: 12,
        type: ITEM_TYPE.FOOD,
        name: "Cookie"
    }, {
        id: 2,
        sid: 13,
        type: ITEM_TYPE.WALL,
        name: "Wood Wall"
    }, {
        id: 3,
        sid: 14,
        type: ITEM_TYPE.WALL,
        name: "Stone Wall"
    }, {
        id: 4,
        sid: 15,
        type: ITEM_TYPE.WALL,
        name: "Castle Wall"
    }, {
        id: 5,
        sid: 16,
        type: ITEM_TYPE.SPIKES,
        name: "Spikes"
    }, {
        id: 6,
        type: ITEM_TYPE.SPIKES,
        sid: 17,
        name: "Greater spikes"
    }, {
        id: 7,
        type: ITEM_TYPE.SPIKES,
        sid: 18,
        name: "Poison spikes"
    }, {
        id: 8,
        type: ITEM_TYPE.SPIKES,
        sid: 19,
        name: "Spinning spikes"
    }, {
        id: 9,
        sid: 20,
        type: ITEM_TYPE.WINDMAIL,
        name: "Windmill"
    }, {
        id: 10,
        type: ITEM_TYPE.WINDMAIL,
        sid: 21,
        name: "Faster windmill"
    }, {
        id: 11,
        type: ITEM_TYPE.MINE,
        sid: 22,
        name: "Mine"
    }, {
        id: 12,
        type: ITEM_TYPE.PITTRAP,
        sid: 23,
        name: "Pit trap"
    }, {
        id: 13,
        type: ITEM_TYPE.PITTRAP,
        sid: 24,
        name: "Boost pad "
    }, {
        id: 14,
        type: ITEM_TYPE.EXTRAS,
        sid: 25,
        name: "Turret"
    },  {
        id: 15,
        type: ITEM_TYPE.EXTRAS,
        sid: 26,
        name: "Platform"
    },  {
        id: 16,
        type: ITEM_TYPE.EXTRAS,
        sid: 27,
        name: "Healing Pad"
    },  {
        id: 17,
        type: ITEM_TYPE.EXTRAS,
        sid: 28,
        name: "Spawn Pad"
    }];

    function getItemById(id, type) {
        if (type !== undefined && !Array.isArray(type)) {
            type = [type];
        }
        return ITEMS.find(function (item) {
            return type === undefined ? item.id == id && ![ITEM_TYPE.WEAPON, ITEM_TYPE.TWO_WEAPON].includes(item.type) : item.id == id && type.includes(item.type);
        });
    }

    function getItemBySid(sid) {
        return ITEMS.find(function (item) {
            return item.sid !== undefined && sid !== undefined && item.sid == sid;
        });
    }

    var ws;
    var player;
    var BOT_SETTINGS_TEMPLATE = '<style>.bot-settings{padding: 10px; background-color: rgba(0, 0, 0, 0.2); border-radius: 3px; position: absolute; left: 0px; top: 0px; min-width: 200px; max-width: 300px;aw}.equip-btn{display:inline-block; width: 25px; height: 25px; border: 1px solid grey; background-size: contain; cursor: pointer; background-color: lightgray;}.equip-btn.selected{background-color: lightgreen;}</style><div class="bot-settings"> <div> <div> <input type="checkbox" id="botAutoHealOn"/> <label for="botAutoHealOn">AutoHeal</label> </div></div><hr/> <div id="bot-equips-0"> </div><hr/><div id="bot-equips-1"> </div></div>';
    var autoHealStarted = true;
    var btnEnterGame = document.getElementById('enterGame');

    function Player() {
        this.id = 0;

        this.resources = {
            food: 0,
            gold: 0,
            wood: 0,
            stone: 0
        };

        this.hp = 100;

        this.hat = 0;
        this.accessory = 0;

        this.items = {};
        this.items[ITEM_TYPE.WEAPON] = getItemById(0, ITEM_TYPE.WEAPON);
        this.items[ITEM_TYPE.SPIKES] = getItemById(5);
        this.items[ITEM_TYPE.WALL] = getItemById(2);
        this.items[ITEM_TYPE.FOOD] = getItemById(0);
        this.items[ITEM_TYPE.WINDMAIL] = getItemById(9);
        this.items[ITEM_TYPE.EXTRAS] = getItemById(14);

        this.itemInHand = this.items[ITEM_TYPE.WEAPON];
    }

    btnEnterGame.onmousedown = function () {
        StartBot();
        btnEnterGame.onmousedown = null;
    };

    $('#adCard').remove();

    document.addEventListener('keydown', function (e) {
        if (ws) {
            switch (e.keyCode) {
                // T
                case 84:
                    if (player.items[ITEM_TYPE.WINDMAIL]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.WINDMAIL].id + ",null]");
                    break;

                // G
                case 71:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.SPIKES]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.SPIKES].id + ",null]");
                    break;

                // Z
                case 90:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.EXTRAS]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.TURRET].id + ",null]");
                    break;

                // F
                case 70:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.PITTRAP]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.PITTRAP].id + ",null]");
                    break;
                    
                // ]
                case 221:
                    if (player.items[ITEM_TYPE.WINDMAIL]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.WINDMAIL].id + ",null]");
                    break;

                // ;
                case 186:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.SPIKES]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.SPIKES].id + ",null]");
                    break;

                // '
                case 222:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.EXTRAS]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.TURRET].id + ",null]");
                    break;

                // #
                case 70:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.PITTRAP]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.PITTRAP].id + ",null]");
                    break;
                    
                 // /
                case 191:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.WEAPON]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.WEAPON].id + ",null]");
                    break;

                 // .
                case 190:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.TWO_WEAPON]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.TWO_WEAPON].id + ",null]");
                    break;
                    
                // P
                case 80:
                    e.stopPropagation();
                    $('.bot-settings').toggle();
                    break;
                    
            }
        }
    }, true);

    document.addEventListener('mousedown', function (e) {
        if (ws && e.button == 2) {
            e.stopPropagation();
            ws.send("42[\"4\",1,null]");
            setTimeout(function () {
                ws.send("42[\"5\"," + player.items[ITEM_TYPE.TWO_WEAPON].id + ",true]");
            }, 100);
            setTimeout(function () {
                ws.send("42[\"4\",0,null]");
            }, 100);
            setTimeout(function () {
                ws.send("42[\"5\"," + player.items[ITEM_TYPE.WEAPON].id + ",true]");
            }, 700);
        }
    }, true);

    function Log(text) {
        return;
    }

    function init() {
        $('body').append(BOT_SETTINGS_TEMPLATE);

        $('#botAutoHealOn').prop("checked", autoHealStarted);
        $('#botAutoHealOn').change(function (e) {
            autoHealStarted = e.currentTarget.checked;
        });

        addEquip(0, 28);
        addEquip(0, 29);
        addEquip(0, 30);
        addEquip(0, 36);
        addEquip(0, 37);
        addEquip(0, 38);
        addEquip(0, 44);
        addEquip(0, 35);
        addEquip(0, 42);
        addEquip(0, 43);
        addEquip(0, 49);
    }

    function dead() {
        player = new Player();
    }

    function botLaunched() {
        return $('#botAutoHealOn').prop('checked');
    }

    function equipId(type, id) {
        return "bot-eq-" + type + id;
    }

    function equipIsSelect(type, id) {
        return $("#" + equipId(type, id)).hasClass("selected");
    }

    function equipSelect(type, id) {
        $("#" + equipId(type, id)).addClass("selected");
    }

    function equipCancleSelect(type, id) {
        if (id == "all") {
            $("#bot-equips-" + type + ">.equip-btn").removeClass("selected");
        } else $("#" + equipId(type, id)).removeClass("selected");
    }

    function equipExist(type, id) {
        return $("#bot-equips-" + type + ">#" + equipId(type, id)).length > 0;
    }

    function addEquip(type, id) {
        if (equipExist(type, id)) {
            return;
        }
        var url = "http://moomoo.io/img";

        if (type == 1) {
            url += "/accessories/access_" + id + ".png";
        } else {
            url += "/hats/hat_" + id + ".png";
        }

        $("<div/>", {
            id: equipId(type, id),
            "class": "equip-btn",
            css: {
                "background-image": "url(" + url + ")"
            },
            click: function click() {
                if (!equipIsSelect(type, id)) ws.send("42[\"13\",0," + id + ", " + type + "]");else ws.send("42[\"13\",0,0," + type + "]");
            }
        }).appendTo("#bot-equips-" + type);
    }

    function StartBot() {
        player = new Player();
        init();
        Log("AutoHeal loaded");
        WebSocket.prototype.oldSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function (m) {
            if (!ws) {
                ws = this;
                socketFound(this);
            }
            var parsed = parseWSMsg(m);

            if (parsed[0] == "5") {
                var id = parsed[1];
                var isWeapon = parsed[2] || false;
                if (!isWeapon) {
                    if (id == 0 || id == 1) {
                        player.itemInHand = player.items[ITEM_TYPE.FOOD];
                    }
                }
            }

            if (parsed[0] == "6") {
                var item = getItemBySid(parsed[1]);
                if (item) {
                    player.items[item.type] = item;
                    if (item.type == player.itemInHand.type) {
                        player.itemInHand = item;
                    }
                }
            }

            this.oldSend(m);
        };

        function socketFound(socket) {
            window.gameSocket = socket;
            socket.addEventListener("message", function (e) {
                var m = e.data;
                var parsed = parseWSMsg(m);

                switch (parsed[0]) {
                    case "1":
                        player.id = parsed[1];
                        break;

                    case "us":
                        var itemId = parsed[2];
                        var pacType = parsed[1];
                        var itemType = parsed[3];
                        switch (pacType) {
                            case 0:
                                addEquip(itemType, itemId);
                                break;

                            case 1:
                                if (itemType == 1) player.accessory = itemId;else if (itemType === 0) player.hat = itemId;
                                equipCancleSelect(itemType, "all");
                                equipSelect(itemType, itemId);
                                break;
                        }
                        break;

                    case "9":
                        player.resources[parsed[1]] = parsed[2];
                        break;

                    case "10":
                        if (parsed[1] == player.id) {
                            player.hp = parsed[2];
                            if (player.hp <= 0) {
                                dead();
                            }
                        }
                        break;
                }
            });
        }

        var healTimer = setInterval(function () {
            if (autoHealStarted) heal();
        }, 0);

        function parseWSMsg(s) {
            if (s.indexOf("42") === -1) return -1;
            var o = s.substring(s.indexOf("["));
            return JSON.parse(o);
        }

        function heal() {
            if (player.hp >= 100) return;
            if (hasApple()) {
                if (player.itemInHand.type == ITEM_TYPE.FOOD) {
                    ws.send("42[\"4\",1,null]");
                    player.itemInHand = player.items[ITEM_TYPE.WEAPON];
                } else {
                    ws.send("42[\"5\"," + player.items[ITEM_TYPE.FOOD].id + ",null]");
                    heal();
                }
            }
        }

        function hasApple() {
            if (player.items[ITEM_TYPE.FOOD].id === 0) return player.resources.food >= 10;else return player.resources.food >= 15;
        }
    }
})();

	$('#mapDisplay').css({
		'background': 'url("https://cdn.discordapp.com/attachments/374333551858155530/376303720540930048/moomooio-background.png")'
	});

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
    var můjVar8;
    var můjVar9;
    var můjVar10;
    var můjVar11;
	var změna = true;
    var ID_FAZE = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;
    var ID_Fez_Hat = 35;
    var ID_Enigma_Hat = 42;
    var ID_Blitz_Hat = 43;
    var ID_Bob_XIII_Hat = 49;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 48) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 180);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            clearTimeout(můjVar8);
            clearTimeout(můjVar9);
            clearTimeout(můjVar10);
            clearTimeout(můjVar11);
            storeEquip(ID_FAZE);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 180);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 180);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 180);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 180);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 180);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 180);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 180);
    }
    function h8() {
    storeEquip(ID_Fez_Hat);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 180);
    }
    function h9() {
    storeEquip(ID_Enigma_Hat);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 180);
    }
    function h10() {
    storeEquip(ID_Blitz_Hat);
    clearTimeout(můjVar10);
    můjVar11 = setTimeout(function(){ h11(); }, 180);
    }
    function h11() {
    storeEquip(ID_Bob_XIII_Hat);
    clearTimeout(můjVar11);
    můjVar = setTimeout(function(){ h1(); }, 180);
    }
})();
