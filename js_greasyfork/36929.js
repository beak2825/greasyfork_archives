// ==UserScript==
// @name           MooMoo.io | Agentum MOOMOO.IO MOD
// @namespace      https://greasyfork.org/de/users/165204
// @version        0.0.2
// @description    【 ENGLISH 】 ➜〖 AUTO HEAL 〗〖 DOUBLE ATTACK 〗〖 CHANGE HATS / ACCESSORIES IN TOOLBAR 〗〖 BETTER MINIMAP 〗〖 REMOVING NEEDLESSNESS 〗〖 OTHER IMPROVEMENTS 〗
// @author         Agentum
// @license        GPL version 3
// @match          http://moomoo.io/*
// @match          https://moomoo.io/*
// @match          http://45.77.0.81/*
// @match          https://45.77.0.81/*
// @require        http://code.jquery.com/jquery-3.2.1.min.js
// @icon           http://i.imgur.com/EVgFAYg.png
// @downloadURL https://update.greasyfork.org/scripts/36929/MooMooio%20%7C%20Agentum%20MOOMOOIO%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/36929/MooMooio%20%7C%20Agentum%20MOOMOOIO%20MOD.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////// Agentum MOOMOO.IO MOD \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// AUTO HEAL [ F4 ─ ☑ / ☐ ] | DOUBLE ATTACK [ Right Button ] | UPGRADE TREE [ F2 ] | CHANGE HATS / ACCESSORIES IN TOOLBAR [ F4 ] | CHANGE ITEMS [ Windmill ─ U / Spikes ─ I / Turret ─ O / Pit Trap ─ P / Boost Pad ─ P ] \\

(function () {
    var ITEM_TYPE = {
        WEAPON: 0,
        STONE: 1,
        FOOD: 2,
        PITTRAP: 3,
        WINDMILL: 4,
        TWO_WEAPON: 5,
        SPIKES: 6,
        TURRET: 7,
        MINE: 8,
        EXTRAS: 9
    };

    var ITEMS = [{
        id: 0,
        sid: 0,
        type: ITEM_TYPE.WEAPON,
        name: "Hammer"
    }, {
        id: 1,
        sid: 1,
        type: ITEM_TYPE.WEAPON,
        name: "Handaxt"
    }, {
        id: 2,
        sid: 2,
        type: ITEM_TYPE.WEAPON,
        name: "Großaxt"
    }, {
        id: 3,
        type: ITEM_TYPE.WEAPON,
        sid: 3,
        name: "Kurzschwert"
    }, {
        id: 4,
        sid: 4,
        type: ITEM_TYPE.WEAPON,
        name: "Katana"
    }, {
        id: 5,
        sid: 5,
        type: ITEM_TYPE.WEAPON,
        name: "Speer"
    }, {
        id: 6,
        sid: 6,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Jagdbogen"
    }, {
        id: 7,
        sid: 7,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Großhammer"
    }, {
        id: 8,
        sid: 8,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Holzschild"
    }, {
        id: 9,
        sid: 9,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Bogen"
    }, {
        id: 10,
        sid: 10,
        type: ITEM_TYPE.TWO_WEAPON,
        name: "Musket"
    }, {
        id: 0,
        sid: 11,
        type: ITEM_TYPE.FOOD,
        name: "Apfel"
    }, {
        id: 1,
        sid: 12,
        type: ITEM_TYPE.FOOD,
        name: "Keks"
    }, {
        id: 2,
        sid: 13,
        type: ITEM_TYPE.WALL,
        name: "Holzmauer"
    }, {
        id: 3,
        sid: 14,
        type: ITEM_TYPE.WALL,
        name: "Steinmauer"
    }, {
        id: 4,
        sid: 15,
        type: ITEM_TYPE.WALL,
        name: "Burgmauer"
    }, {
        id: 5,
        sid: 16,
        type: ITEM_TYPE.SPIKES,
        name: "Spikes"
    }, {
        id: 6,
        type: ITEM_TYPE.SPIKES,
        sid: 17,
        name: "Große Spikes"
    }, {
        id: 7,
        type: ITEM_TYPE.SPIKES,
        sid: 18,
        name: "Gift Spikes"
    }, {
        id: 8,
        type: ITEM_TYPE.SPIKES,
        sid: 19,
        name: "Wirbel Spikes"
    }, {
        id: 9,
        sid: 20,
        type: ITEM_TYPE.WINDMILL,
        name: "Windmühle"
    }, {
        id: 10,
        type: ITEM_TYPE.WINDMILL,
        sid: 21,
        name: "Schnelle Windmühle"
    }, {
        id: 11,
        type: ITEM_TYPE.MINE,
        sid: 22,
        name: "Mine"
    }, {
        id: 12,
        type: ITEM_TYPE.PITTRAP,
        sid: 23,
        name: "Fallgrube"
    }, {
        id: 13,
        type: ITEM_TYPE.PITTRAP,
        sid: 24,
        name: "Boost Platform"
    }, {
        id: 14,
        type: ITEM_TYPE.EXTRAS,
        sid: 25,
        name: "Turm"
    },  {
        id: 15,
        type: ITEM_TYPE.EXTRAS,
        sid: 26,
        name: "Platform"
    },  {
        id: 16,
        type: ITEM_TYPE.EXTRAS,
        sid: 27,
        name: "Heil Platform"
    },  {
        id: 17,
        type: ITEM_TYPE.EXTRAS,
        sid: 28,
        name: "Spawn Platform"
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
    var BOT_SETTINGS_TEMPLATE = '<style>.bot-settings{padding: 10px; background-color: rgba(0, 0, 0, 0.4); border-radius: 0px; position: absolute; left: 20px; top: 20px; min-width: 200px; max-width: 300px;aw}.equip-btn{display:inline-block; width: 25px; height: 25px; border: 1px solid grey; background-size: contain; cursor: pointer; background-color: lightgray;}.equip-btn.selected{background-color: rgb(255, 0, 0);}</style><div class="bot-settings"> <div> <div> <input type="checkbox" id="botAutoHealOn"/> <label for="botAutoHealOn">AUTOMATICKÝ ŽIVOT / AUTO HEAL</label> </div></div><hr/> <div id="bot-equips-0"> </div><hr/><div id="bot-equips-1"> </div></div>';
    var autoHealStarted = true;
    var btnEnterGame = document.getElementById('enterGame');

    function Player() {
        this.id = 0;

        this.resources = {
            food: 100,
            gold: 100,
            wood: 100,
            stone: 100
        };

        this.hp = 100;

        this.hat = 0;
        this.accessory = 0;

        this.items = {};
        this.items[ITEM_TYPE.WEAPON] = getItemById(0, ITEM_TYPE.WEAPON);
        this.items[ITEM_TYPE.SPIKES] = getItemById(5);
        this.items[ITEM_TYPE.WALL] = getItemById(2);
        this.items[ITEM_TYPE.FOOD] = getItemById(0);
        this.items[ITEM_TYPE.WINDMILL] = getItemById(9);
        this.items[ITEM_TYPE.EXTRAS] = getItemById(14);

        this.itemInHand = this.items[ITEM_TYPE.WEAPON];
    }

    btnEnterGame.onmousedown = function () {
        StartBot();
        btnEnterGame.onmousedown = null;
    };

    document.addEventListener('keydown', function (e) {
        if (ws) {
            switch (e.keyCode) {
                // U
                case 85:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.WINDMILL]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.WINDMILL].id + ",null]");
                    break;

                // I
                case 73:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.SPIKES]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.SPIKES].id + ",null]");
                    break;

                // O
                case 79:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.EXTRAS]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.TURRET].id + ",null]");
                    break;

                // P
                case 80:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.PITTRAP]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.PITTRAP].id + ",null]");
                    break;

                // F4
                case 115:
                    e.stopPropagation();
                    $('.bot-settings').toggle();
                    break;

                // F2
                case 113:
                    e.stopPropagation();
                    $('.InfoVylepšení').toggle();
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
            }, 150);
            setTimeout(function () {
                ws.send("42[\"5\"," + player.items[ITEM_TYPE.WEAPON].id + ",true]");
            }, 550);
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
        Log("AutoHeal gestartet");
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
                    if (id === 0 || id === 1) {
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
        }, 212.5);

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

// CHANGE HAT + BUYING 2 ║ Backspace [ Delete / 8 ] ─ Buying | Delete [ 46 ] ─ Not Buying | 0 [ Numpad 0 / 96 ] ─ Booster Hat | 1 [ Numpad 1 / 97 ] ─ Bushido Armor | 2 [ Numpad 2 / 98 ] ─ Flipper Hat | 3 [ Numpad 3 / 99 ] ─ Medic Gear | 4 [ Numpad 4 / 100 ] ─ Winter Cap | 5 [ Numpad 5 / 101 ] ─ Emp Helmet | 6 [ Numpad 6 / 102 ] ─ Tank Gear | 7 [ Numpad 7 / 103 ] ─ Samurai Armor | 8 [ Numpad 8 / 104 ] ─ Barbarian Armor | 9 [ Numpad 9 / 105 ] ─ Spike Gear | * [ Multiply / 106 ] ─ Kopf \\

var Zf = [0,0],
    tN = [[12, "Booster Hat"], [16, "Bushido Rüstung"], [31, "Flipper Hat"], [13, "Medic Gear"], [15, "Winter Cap"], [22, "Emp Helmet"], [40, "Tank Gear"], [20, "Samurai Armor"], [26, "Barbarian Armor"], [7, "Bull Helmet"]];

function Rt(sE){
    if(Zf[0] === 0){
        storeEquip(tN[sE][0]);
        document.title = tN[sE][1];
        Zf[1] = 90;
        revertTitle();
    } else {
        storeBuy(tN[sE][0]);
        Zf[0] = 0;
        Zf[1] = 180;
        document.title = "Už Koupeno┃Málo Zlata";
        revertTitle();
    }
}

document.addEventListener('keydown', function(kfc) {
    if(!$(':focus').length) {
        switch (kfc.keyCode) {
            case 8: Zf[0] = 1; Zf[1] = 300; document.title = "Kupování...."; kfc.preventDefault(); break;                         // Backspace [ Delete / 8 ]
            case 46: if(Zf[0] === 1){Zf[1] = 120; document.title = "Nekupování....";}  Zf[0] = 0; kfc.preventDefault(); break;    // Delete [ 46 ]
            case 106: storeEquip(45); kfc.preventDefault(); break;    // Kopf            = * [ Multiply / 106 ] * = Kopf
            case 96: Rt(0); kfc.preventDefault(); break;              // Booster Hat       = 0 [ Numpad 0 / 96 ]
            case 97: Rt(1); kfc.preventDefault(); break;              // Bushido Armor     = 1 [ Numpad 1 / 97 ]
            case 98: Rt(2); kfc.preventDefault(); break;              // Flipper Hat       = 2 [ Numpad 2 / 98 ]
            case 99: Rt(3); kfc.preventDefault(); break;              // Medic Gear        = 3 [ Numpad 3 / 99 ]
            case 100: Rt(4); kfc.preventDefault(); break;             // Winter Cap        = 4 [ Numpad 4 / 100 ]
            case 101: Rt(5); kfc.preventDefault(); break;             // Emp Helmet        = 5 [ Numpad 5 / 101 ]
            case 102: Rt(6); kfc.preventDefault(); break;             // Tank Gear         = 6 [ Numpad 6 / 102 ]
            case 103: Rt(7); kfc.preventDefault(); break;             // Samurai Armor     = 7 [ Numpad 7 / 103 ]
            case 104: Rt(8); kfc.preventDefault(); break;             // Barbarian Armor   = 8 [ Numpad 8 / 104 ]
            case 105: Rt(9); kfc.preventDefault(); break;             // Bull Helmet       = 9 [ Numpad 9 / 105 ]
          }
	}
});

// CHANGE HAT + BUYING ║ T [ 84 ] ─ Buying | Fn [ Toggle Touchpad / 255 ] ─ Not Buying | Shift [ 16 ] ─ Booster Hat | F [ 70 ] ─ Bushido Armor | Caps Lock [ 20 ] ─ Winter Cap | Alt [ 18 ] ─ Tank Gear | Y [ 89 ] ─ Samurai Armor | V [ 86 ] ─ Flipper Hat | G [ 71 ] ─ Medic Gear | \ [ < /git > / 226 ] ─ Emp Helmet | Escape [ 27 ] ─ Kopf | ; [ Grave Accent / Ñ / Æ ] ─ Barbarian Armor | B [ 66 ] ─ Bull Helmet \\

var Zf = [0,0],
    tN = [[12, "Booster Hat"], [16, "Bushido Armor"], [31, "Flipper Hat"], [13, "Medic Gear"], [15, "Winter Cap"], [22, "Emp Helmet"], [26, "Barbarian Armor"], [20, "Samurai Armor"], [40, "Tank Gear"], [7, "Bull Helmet"]];

function Rt(sE){
    if(Zf[0] === 0){
        storeEquip(tN[sE][0]);
        document.title = tN[sE][1];
        Zf[1] = 90;
        revertTitle();
    } else {
        storeBuy(tN[sE][0]);
        Zf[0] = 0;
        Zf[1] = 180;
        document.title = "Už Koupeno┃Málo Zlata";
        revertTitle();
    }
}

document.addEventListener('keydown', function(kfc) {
    if(!$(':focus').length) {
        switch (kfc.keyCode) {
            case 84: Zf[0] = 1; Zf[1] = 300; document.title = "Kupování...."; kfc.preventDefault(); break;                      // T [ 84 ]
            case 255: if(Zf[0] === 1){Zf[1] = 120; document.title = "Nekupování....";}  Zf[0] = 0; kfc.preventDefault(); break; // Fn [ Toggle Touchpad / 255 ]
            case 27: storeEquip(45); kfc.preventDefault(); break;     // Kopf / Kopf                       = Escape [ 27 ]
            case 16: Rt(0); kfc.preventDefault(); break;              // Booster Hat          = Shift [ 16 ]
            case 70: Rt(1); kfc.preventDefault(); break;              // Bushido Armor        = F [ 70 ]
            case 86: Rt(2); kfc.preventDefault(); break;              // Flipper Hat          = V [ 86 ]
            case 71: Rt(3); kfc.preventDefault(); break;              // Medic Gear           = G [ 71 ]
            case 20: Rt(4); kfc.preventDefault(); break;              // Winter Cap           = Caps Lock [ 20 ]
            case 226: Rt(5); kfc.preventDefault(); break;             // Emp Helmet           = \ [ < /git > / 226 ]
            case 192: Rt(6); kfc.preventDefault(); break;             // Barbarian Armor      = ; [ Grave Accent / Ñ / Æ ]
            case 89: Rt(7); kfc.preventDefault(); break;              // Samurai Armor        = Y [ 89 ]
            case 18: Rt(8); kfc.preventDefault(); break;              // Tank Gear            = Alt [ 18 ]
            case 66: Rt(9); kfc.preventDefault(); break;              // Bull Helmet          = B [ 66 ]
          }
	}
});

// CHANGER HATS ║ Animals Free ─ PgDn [ Page Down / 34 ] | Panda / Bear / Monkey / Polar Bear ─ PgUp [ Page Up / 33 ] | Pig / Cow / Sheep / Bull ─ End [ 35 ] | Free ─ Home [ 36 ] | Animals ─ - [ Subtract / 109 ] | Blue / Red ─ + [ Add / 107 ] | Scavenger / Tank ─ ÷ [ Divide / 111 ] | All Gradually ─ , [ Decimal Point / 110 ] | ? ─ Insert [ 45 ] \\

// Animals Free ─ PgDn [ Page Down / 34 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
	var změna = true;
    var ID_Kopf = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 34) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 270);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 270);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 270);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Panda / Bear / Monkey / Polar Bear ─ PgUp [ Page Up / 33 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
	var změna = true;
    var ID_Kopf = 45;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 33) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Pandou_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar4);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Pig / Cow / Sheep / Bull ─ End [ 35 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
	var změna = true;
    var ID_Kopf = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Bull_Mask = 46;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 35) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar4);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Free ─ Home [ 36 ] \\

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
    var ID_Kopf = 45;
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
		if (e.keyCode == 36) {
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
            storeEquip(ID_Kopf);
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

// Animals ─ - [ Subtract / 109 ] \\

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
	var změna = true;
    var ID_Kopf = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;
    var ID_Flipper_Hat = 31;
    var ID_Bull_Mask = 46;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 109) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
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
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 270);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 270);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 270);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 270);
    }
    function h8() {
    storeEquip(ID_Flipper_Hat);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 270);
    }
    function h9() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar9);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Red / Blue ─ + [ Add / 107 ] \\

(function() {
    var můjVar;
    var můjVar2;
	var změna = true;
	var ID_Bummle_Hat = 8;
    var ID_Kopf = 45;
	var ID_Winter_Cap = 15;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 107) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Bummle_Hat);
            můjVar = setTimeout(function(){ h1(); }, 125);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Bummle_Hat);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 125);
    }
    function h2() {
    storeEquip(ID_Winter_Cap);
    clearTimeout(můjVar2);
    můjVar = setTimeout(function(){ h1(); }, 125);
    }
})();

// Scavenger / Tank ─ ÷ [ Divide / 111 ] \\

(function() {
    var můjVar;
    var můjVar2;
	var změna = true;
    var ID_Kopf = 45;
	var ID_Scavenger_Gear = 27;
	var ID_Tank_Gear = 40;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 111) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Scavenger_Gear);
            můjVar = setTimeout(function(){ h1(); }, 200);
            } else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Scavenger_Gear);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 200);
    }
    function h2() {
    storeEquip(ID_Tank_Gear);
    clearTimeout(můjVar2);
    můjVar = setTimeout(function(){ h1(); }, 200);
    }
})();

// All Gradually ─ , [ Decimal Point / 110 ] \\

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
    var můjVar12;
    var můjVar13;
    var můjVar14;
    var můjVar15;
    var můjVar16;
    var můjVar17;
    var můjVar18;
    var můjVar19;
    var můjVar20;
    var můjVar21;
    var můjVar22;
    var můjVar23;
    var můjVar24;
    var můjVar25;
    var můjVar26;
    var můjVar27;
    var můjVar28;
    var můjVar29;
    var můjVar30;
    var můjVar31;
    var můjVar32;
    var můjVar33;
    var můjVar34;
    var můjVar35;
    var můjVar36;
    var můjVar37;
    var můjVar38;
    var můjVar39;
	var změna = true;
    var ID_Kopf = 45;
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
	var ID_Bummle_Hat = 8;
	var ID_Straw_Hat = 2;
	var ID_Winter_Cap = 15;
	var ID_Cowboy_Hat = 5;
	var ID_Ranger_Hat = 4;
	var ID_Explorer_Hat = 18;
	var ID_Flipper_Hat = 31;
	var ID_Marksman_Cap = 1;
	var ID_Bush_Gear = 10;
    var ID_Halo = 48;
	var ID_Soldier_Helmet = 6;
	var ID_Anti_Venom_Gear = 23;
	var ID_Medic_Gear = 13;
	var ID_Miners_Helmet = 9;
	var ID_Musketeer_Hat = 32;
	var ID_Bull_Helmet = 7;
    var ID_Emp_Helmet = 22;
    var ID_Booster_Hat = 12;
    var ID_Barbarian_Armor = 26;
    var ID_Plague_Mask = 21;
    var ID_Bull_Mask = 46;
    var ID_Windmill_Hat = 14;
    var ID_Spike_Gear = 11;
    var ID_Samurai_Armor = 20;
    var ID_Bushido_Armor = 16;
    var ID_Scavenger_Gear = 27;
    var ID_Tank_Gear = 40;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 110) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Kopf);
            můjVar = setTimeout(function(){ h1(); }, 75);
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
            clearTimeout(můjVar12);
            clearTimeout(můjVar13);
            clearTimeout(můjVar14);
            clearTimeout(můjVar15);
            clearTimeout(můjVar16);
            clearTimeout(můjVar17);
            clearTimeout(můjVar18);
            clearTimeout(můjVar19);
            clearTimeout(můjVar20);
            clearTimeout(můjVar21);
            clearTimeout(můjVar22);
            clearTimeout(můjVar23);
            clearTimeout(můjVar24);
            clearTimeout(můjVar25);
            clearTimeout(můjVar26);
            clearTimeout(můjVar27);
            clearTimeout(můjVar28);
            clearTimeout(můjVar29);
            clearTimeout(můjVar30);
            clearTimeout(můjVar31);
            clearTimeout(můjVar32);
            clearTimeout(můjVar33);
            clearTimeout(můjVar34);
            clearTimeout(můjVar35);
            clearTimeout(můjVar36);
            clearTimeout(můjVar37);
            clearTimeout(můjVar38);
            clearTimeout(můjVar39);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Kopf);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 75);
    }
    function h2() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 75);
    }
    function h3() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 75);
    }
    function h4() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 75);
    }
    function h5() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 75);
    }
    function h6() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 75);
    }
    function h7() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 75);
    }
    function h8() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 75);
    }
    function h9() {
    storeEquip(ID_Fez_Hat);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 75);
    }
    function h10() {
    storeEquip(ID_Enigma_Hat);
    clearTimeout(můjVar10);
    můjVar11 = setTimeout(function(){ h11(); }, 75);
    }
    function h11() {
    storeEquip(ID_Blitz_Hat);
    clearTimeout(můjVar11);
    můjVar12 = setTimeout(function(){ h12(); }, 75);
    }
    function h12() {
    storeEquip(ID_Bob_XIII_Hat);
    clearTimeout(můjVar12);
    můjVar13 = setTimeout(function(){ h13(); }, 75);
    }
    function h13() {
    storeEquip(ID_Bummle_Hat);
    clearTimeout(můjVar13);
    můjVar14 = setTimeout(function(){ h14(); }, 75);
    }
    function h14() {
    storeEquip(ID_Straw_Hat);
    clearTimeout(můjVar14);
    můjVar15 = setTimeout(function(){ h15(); }, 75);
    }
    function h15() {
    storeEquip(ID_Winter_Cap);
    clearTimeout(můjVar15);
    můjVar16 = setTimeout(function(){ h16(); }, 75);
    }
    function h16() {
    storeEquip(ID_Cowboy_Hat);
    clearTimeout(můjVar16);
    můjVar17 = setTimeout(function(){ h17(); }, 75);
    }
    function h17() {
    storeEquip(ID_Ranger_Hat);
    clearTimeout(můjVar17);
    můjVar18 = setTimeout(function(){ h18(); }, 75);
    }
    function h18() {
    storeEquip(ID_Explorer_Hat);
    clearTimeout(můjVar18);
    můjVar19 = setTimeout(function(){ h19(); }, 75);
    }
    function h19() {
    storeEquip(ID_Flipper_Hat);
    clearTimeout(můjVar19);
    můjVar20 = setTimeout(function(){ h20(); }, 75);
    }
    function h20() {
    storeEquip(ID_Marksman_Cap);
    clearTimeout(můjVar20);
    můjVar21 = setTimeout(function(){ h21(); }, 75);
    }
    function h21() {
    storeEquip(ID_Bush_Gear);
    clearTimeout(můjVar21);
    můjVar22 = setTimeout(function(){ h22(); }, 75);
    }
    function h22() {
    storeEquip(ID_Halo);
    clearTimeout(můjVar22);
    můjVar23 = setTimeout(function(){ h23(); }, 75);
    }
    function h23() {
    storeEquip(ID_Soldier_Helmet);
    clearTimeout(můjVar23);
    můjVar24 = setTimeout(function(){ h24(); }, 75);
    }
    function h24() {
    storeEquip(ID_Anti_Venom_Gear);
    clearTimeout(můjVar24);
    můjVar25 = setTimeout(function(){ h25(); }, 75);
    }
    function h25() {
    storeEquip(ID_Medic_Gear);
    clearTimeout(můjVar25);
    můjVar26 = setTimeout(function(){ h26(); }, 75);
    }
    function h26() {
    storeEquip(ID_Miners_Helmet);
    clearTimeout(můjVar26);
    můjVar27 = setTimeout(function(){ h27(); }, 75);
    }
    function h27() {
    storeEquip(ID_Musketeer_Hat);
    clearTimeout(můjVar27);
    můjVar28 = setTimeout(function(){ h28(); }, 75);
    }
    function h28() {
    storeEquip(ID_Bull_Helmet);
    clearTimeout(můjVar28);
    můjVar29 = setTimeout(function(){ h29(); }, 75);
    }
    function h29() {
    storeEquip(ID_Emp_Helmet);
    clearTimeout(můjVar29);
    můjVar30 = setTimeout(function(){ h30(); }, 75);
    }
    function h30() {
    storeEquip(ID_Booster_Hat);
    clearTimeout(můjVar30);
    můjVar31 = setTimeout(function(){ h31(); }, 75);
    }
    function h31() {
    storeEquip(ID_Barbarian_Armor);
    clearTimeout(můjVar31);
    můjVar32 = setTimeout(function(){ h32(); }, 75);
    }
    function h32() {
    storeEquip(ID_Plague_Mask);
    clearTimeout(můjVar32);
    můjVar33 = setTimeout(function(){ h33(); }, 75);
    }
    function h33() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar33);
    můjVar34 = setTimeout(function(){ h34(); }, 75);
    }
    function h34() {
    storeEquip(ID_Windmill_Hat);
    clearTimeout(můjVar34);
    můjVar35 = setTimeout(function(){ h35(); }, 75);
    }
    function h35() {
    storeEquip(ID_Spike_Gear);
    clearTimeout(můjVar35);
    můjVar36 = setTimeout(function(){ h36(); }, 75);
    }
    function h36() {
    storeEquip(ID_Samurai_Armor);
    clearTimeout(můjVar36);
    můjVar37 = setTimeout(function(){ h37(); }, 75);
    }
    function h37() {
    storeEquip(ID_Bushido_Armor);
    clearTimeout(můjVar37);
    můjVar38 = setTimeout(function(){ h38(); }, 75);
    }
    function h38() {
    storeEquip(ID_Scavenger_Gear);
    clearTimeout(můjVar38);
    můjVar39 = setTimeout(function(){ h39(); }, 75);
    }
    function h39() {
    storeEquip(ID_Tank_Gear);
    clearTimeout(můjVar39);
    můjVar = setTimeout(function(){ h1(); }, 75);
    }
})();

// ? ─ Insert [ 45 ] \\

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
    var ID_0_0_0_0_0_0 = 0;
    var ID_17_17_17_17 = 17;
    var ID_24_24_24_24 = 24;
    var ID_33_33_33_33 = 33;
    var ID_34_34_34_34 = 34;
    var ID_39_39_39_39 = 39;
    var ID_41_41_41_41 = 41;
    var ID_45_45_45_45 = 45;
    var ID_47_47_47_47 = 47;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 45) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_0_0_0_0_0_0);
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
            storeEquip(ID_0_0_0_0_0_0);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_0_0_0_0_0_0);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 180);
    }
    function h2() {
    storeEquip(ID_17_17_17_17);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 180);
    }
    function h3() {
    storeEquip(ID_24_24_24_24);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 180);
    }
    function h4() {
    storeEquip(ID_33_33_33_33);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 180);
    }
    function h5() {
    storeEquip(ID_34_34_34_34);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 180);
    }
    function h6() {
    storeEquip(ID_39_39_39_39);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 180);
    }
    function h7() {
    storeEquip(ID_41_41_41_41);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 180);
    }
    function h8() {
    storeEquip(ID_45_45_45_45);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 180);
    }
    function h9() {
    storeEquip(ID_47_47_47_47);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 180);
    }
})();

// CHANGER HATS 2 ║ Animals Free ─ Right ⌘ [ Windows Menu / 93 ] | Panda / Bear / Monkey / Polar Bear ─ . [ Period / 190 ] | Pig / Cow / Sheep / Bull ─ Ů [ Semi-Colon / Ñ / 186 ] | Free ─ ¨ [ Back Slash / 220] | Animals ─ Ú [ Pen Bracket / 219 ] | Blue / Red ─ ) [ Close Bracket / Å / 221 ] | Scavenger / Tank ─ = [ Equal Sign / 187 ] | All Gradually ─ ´ [ Forward Slash / Ç / 191 ] | ? ─ F7 [ 118 ] \\

// Animals Free ─ Right ⌘ [ Windows Menu / 93 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
	var změna = true;
    var ID_Kopf = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 93) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 270);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 270);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 270);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Panda / Bear / Monkey / Polar Bear ─ . [ Period / 190 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
	var změna = true;
    var ID_Kopf = 45;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 190) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Pandou_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar4);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Pig / Cow / Sheep / Bull ─ Ů [ Semi-Colon / Ñ / 186 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
	var změna = true;
    var ID_Kopf = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Bull_Mask = 46;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 186) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar4);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Free ─ ¨ [ Back Slash / 220] \\

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
    var ID_Kopf = 45;
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
		if (e.keyCode == 220) {
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
            storeEquip(ID_Kopf);
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

// Animals ─ Ú [ Pen Bracket / 219 ] \\

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
	var změna = true;
    var ID_Kopf = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;
    var ID_Flipper_Hat = 31;
    var ID_Bull_Mask = 46;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 219) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
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
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 270);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 270);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 270);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 270);
    }
    function h8() {
    storeEquip(ID_Flipper_Hat);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 270);
    }
    function h9() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar9);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Blue / Red ─ ) [ Close Bracket / Å / 221 ] \\

(function() {
    var můjVar;
    var můjVar2;
	var změna = true;
	var ID_Bummle_Hat = 8;
    var ID_Kopf = 45;
	var ID_Winter_Cap = 15;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 221) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Bummle_Hat);
            můjVar = setTimeout(function(){ h1(); }, 125);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Bummle_Hat);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 125);
    }
    function h2() {
    storeEquip(ID_Winter_Cap);
    clearTimeout(můjVar2);
    můjVar = setTimeout(function(){ h1(); }, 125);
    }
})();

// Scavenger / Tank ─ = [ Equal Sign / 187 ] \\

(function() {
    var můjVar;
    var můjVar2;
	var změna = true;
    var ID_Kopf = 45;
	var ID_Scavenger_Gear = 27;
	var ID_Tank_Gear = 40;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 187) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Scavenger_Gear);
            můjVar = setTimeout(function(){ h1(); }, 200);
            } else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Scavenger_Gear);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 200);
    }
    function h2() {
    storeEquip(ID_Tank_Gear);
    clearTimeout(můjVar2);
    můjVar = setTimeout(function(){ h1(); }, 200);
    }
})();

// All Gradually ─ ´ [ Forward Slash / Ç / 191 ] \\

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
    var můjVar12;
    var můjVar13;
    var můjVar14;
    var můjVar15;
    var můjVar16;
    var můjVar17;
    var můjVar18;
    var můjVar19;
    var můjVar20;
    var můjVar21;
    var můjVar22;
    var můjVar23;
    var můjVar24;
    var můjVar25;
    var můjVar26;
    var můjVar27;
    var můjVar28;
    var můjVar29;
    var můjVar30;
    var můjVar31;
    var můjVar32;
    var můjVar33;
    var můjVar34;
    var můjVar35;
    var můjVar36;
    var můjVar37;
    var můjVar38;
    var můjVar39;
	var změna = true;
    var ID_Kopf = 45;
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
	var ID_Bummle_Hat = 8;
	var ID_Straw_Hat = 2;
	var ID_Winter_Cap = 15;
	var ID_Cowboy_Hat = 5;
	var ID_Ranger_Hat = 4;
	var ID_Explorer_Hat = 18;
	var ID_Flipper_Hat = 31;
	var ID_Marksman_Cap = 1;
	var ID_Bush_Gear = 10;
    var ID_Halo = 48;
	var ID_Soldier_Helmet = 6;
	var ID_Anti_Venom_Gear = 23;
	var ID_Medic_Gear = 13;
	var ID_Miners_Helmet = 9;
	var ID_Musketeer_Hat = 32;
	var ID_Bull_Helmet = 7;
    var ID_Emp_Helmet = 22;
    var ID_Booster_Hat = 12;
    var ID_Barbarian_Armor = 26;
    var ID_Plague_Mask = 21;
    var ID_Bull_Mask = 46;
    var ID_Windmill_Hat = 14;
    var ID_Spike_Gear = 11;
    var ID_Samurai_Armor = 20;
    var ID_Bushido_Armor = 16;
    var ID_Scavenger_Gear = 27;
    var ID_Tank_Gear = 40;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 191) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Kopf);
            můjVar = setTimeout(function(){ h1(); }, 75);
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
            clearTimeout(můjVar12);
            clearTimeout(můjVar13);
            clearTimeout(můjVar14);
            clearTimeout(můjVar15);
            clearTimeout(můjVar16);
            clearTimeout(můjVar17);
            clearTimeout(můjVar18);
            clearTimeout(můjVar19);
            clearTimeout(můjVar20);
            clearTimeout(můjVar21);
            clearTimeout(můjVar22);
            clearTimeout(můjVar23);
            clearTimeout(můjVar24);
            clearTimeout(můjVar25);
            clearTimeout(můjVar26);
            clearTimeout(můjVar27);
            clearTimeout(můjVar28);
            clearTimeout(můjVar29);
            clearTimeout(můjVar30);
            clearTimeout(můjVar31);
            clearTimeout(můjVar32);
            clearTimeout(můjVar33);
            clearTimeout(můjVar34);
            clearTimeout(můjVar35);
            clearTimeout(můjVar36);
            clearTimeout(můjVar37);
            clearTimeout(můjVar38);
            clearTimeout(můjVar39);
            storeEquip(ID_Kopf);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Kopf);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 75);
    }
    function h2() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 75);
    }
    function h3() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 75);
    }
    function h4() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 75);
    }
    function h5() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 75);
    }
    function h6() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 75);
    }
    function h7() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 75);
    }
    function h8() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 75);
    }
    function h9() {
    storeEquip(ID_Fez_Hat);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 75);
    }
    function h10() {
    storeEquip(ID_Enigma_Hat);
    clearTimeout(můjVar10);
    můjVar11 = setTimeout(function(){ h11(); }, 75);
    }
    function h11() {
    storeEquip(ID_Blitz_Hat);
    clearTimeout(můjVar11);
    můjVar12 = setTimeout(function(){ h12(); }, 75);
    }
    function h12() {
    storeEquip(ID_Bob_XIII_Hat);
    clearTimeout(můjVar12);
    můjVar13 = setTimeout(function(){ h13(); }, 75);
    }
    function h13() {
    storeEquip(ID_Bummle_Hat);
    clearTimeout(můjVar13);
    můjVar14 = setTimeout(function(){ h14(); }, 75);
    }
    function h14() {
    storeEquip(ID_Straw_Hat);
    clearTimeout(můjVar14);
    můjVar15 = setTimeout(function(){ h15(); }, 75);
    }
    function h15() {
    storeEquip(ID_Winter_Cap);
    clearTimeout(můjVar15);
    můjVar16 = setTimeout(function(){ h16(); }, 75);
    }
    function h16() {
    storeEquip(ID_Cowboy_Hat);
    clearTimeout(můjVar16);
    můjVar17 = setTimeout(function(){ h17(); }, 75);
    }
    function h17() {
    storeEquip(ID_Ranger_Hat);
    clearTimeout(můjVar17);
    můjVar18 = setTimeout(function(){ h18(); }, 75);
    }
    function h18() {
    storeEquip(ID_Explorer_Hat);
    clearTimeout(můjVar18);
    můjVar19 = setTimeout(function(){ h19(); }, 75);
    }
    function h19() {
    storeEquip(ID_Flipper_Hat);
    clearTimeout(můjVar19);
    můjVar20 = setTimeout(function(){ h20(); }, 75);
    }
    function h20() {
    storeEquip(ID_Marksman_Cap);
    clearTimeout(můjVar20);
    můjVar21 = setTimeout(function(){ h21(); }, 75);
    }
    function h21() {
    storeEquip(ID_Bush_Gear);
    clearTimeout(můjVar21);
    můjVar22 = setTimeout(function(){ h22(); }, 75);
    }
    function h22() {
    storeEquip(ID_Halo);
    clearTimeout(můjVar22);
    můjVar23 = setTimeout(function(){ h23(); }, 75);
    }
    function h23() {
    storeEquip(ID_Soldier_Helmet);
    clearTimeout(můjVar23);
    můjVar24 = setTimeout(function(){ h24(); }, 75);
    }
    function h24() {
    storeEquip(ID_Anti_Venom_Gear);
    clearTimeout(můjVar24);
    můjVar25 = setTimeout(function(){ h25(); }, 75);
    }
    function h25() {
    storeEquip(ID_Medic_Gear);
    clearTimeout(můjVar25);
    můjVar26 = setTimeout(function(){ h26(); }, 75);
    }
    function h26() {
    storeEquip(ID_Miners_Helmet);
    clearTimeout(můjVar26);
    můjVar27 = setTimeout(function(){ h27(); }, 75);
    }
    function h27() {
    storeEquip(ID_Musketeer_Hat);
    clearTimeout(můjVar27);
    můjVar28 = setTimeout(function(){ h28(); }, 75);
    }
    function h28() {
    storeEquip(ID_Bull_Helmet);
    clearTimeout(můjVar28);
    můjVar29 = setTimeout(function(){ h29(); }, 75);
    }
    function h29() {
    storeEquip(ID_Emp_Helmet);
    clearTimeout(můjVar29);
    můjVar30 = setTimeout(function(){ h30(); }, 75);
    }
    function h30() {
    storeEquip(ID_Booster_Hat);
    clearTimeout(můjVar30);
    můjVar31 = setTimeout(function(){ h31(); }, 75);
    }
    function h31() {
    storeEquip(ID_Barbarian_Armor);
    clearTimeout(můjVar31);
    můjVar32 = setTimeout(function(){ h32(); }, 75);
    }
    function h32() {
    storeEquip(ID_Plague_Mask);
    clearTimeout(můjVar32);
    můjVar33 = setTimeout(function(){ h33(); }, 75);
    }
    function h33() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar33);
    můjVar34 = setTimeout(function(){ h34(); }, 75);
    }
    function h34() {
    storeEquip(ID_Windmill_Hat);
    clearTimeout(můjVar34);
    můjVar35 = setTimeout(function(){ h35(); }, 75);
    }
    function h35() {
    storeEquip(ID_Spike_Gear);
    clearTimeout(můjVar35);
    můjVar36 = setTimeout(function(){ h36(); }, 75);
    }
    function h36() {
    storeEquip(ID_Samurai_Armor);
    clearTimeout(můjVar36);
    můjVar37 = setTimeout(function(){ h37(); }, 75);
    }
    function h37() {
    storeEquip(ID_Bushido_Armor);
    clearTimeout(můjVar37);
    můjVar38 = setTimeout(function(){ h38(); }, 75);
    }
    function h38() {
    storeEquip(ID_Scavenger_Gear);
    clearTimeout(můjVar38);
    můjVar39 = setTimeout(function(){ h39(); }, 75);
    }
    function h39() {
    storeEquip(ID_Tank_Gear);
    clearTimeout(můjVar39);
    můjVar = setTimeout(function(){ h1(); }, 75);
    }
})();

// ? ─ F7 [ 118 ] \\

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
    var ID_0_0_0_0_0_0 = 0;
    var ID_17_17_17_17 = 17;
    var ID_24_24_24_24 = 24;
    var ID_33_33_33_33 = 33;
    var ID_34_34_34_34 = 34;
    var ID_39_39_39_39 = 39;
    var ID_41_41_41_41 = 41;
    var ID_45_45_45_45 = 45;
    var ID_47_47_47_47 = 47;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 118) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_0_0_0_0_0_0);
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
            storeEquip(ID_0_0_0_0_0_0);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_0_0_0_0_0_0);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 180);
    }
    function h2() {
    storeEquip(ID_17_17_17_17);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 180);
    }
    function h3() {
    storeEquip(ID_24_24_24_24);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 180);
    }
    function h4() {
    storeEquip(ID_33_33_33_33);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 180);
    }
    function h5() {
    storeEquip(ID_34_34_34_34);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 180);
    }
    function h6() {
    storeEquip(ID_39_39_39_39);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 180);
    }
    function h7() {
    storeEquip(ID_41_41_41_41);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 180);
    }
    function h8() {
    storeEquip(ID_45_45_45_45);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 180);
    }
    function h9() {
    storeEquip(ID_47_47_47_47);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 180);
    }
})();

///////////////////////////////////////////////////////////////////////////////////// IMPROVEMENTS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

$('#mapDisplay').css({'background': 'url("https://i.imgur.com/MLjHJJC.png")'});

(function() { var conf = {'map': {'w': '260','h': '260',},};

$('#mapDisplay').css({'width': conf.map.w + 'px','height': conf.map.h + 'px'});
$('#scoreDisplay').css({'bottom': '290px'});})();

var moomooVer = $('#linksContainer2 .menuLink').html(),
    hideSelectors = ['#mobileDownloadButtonContainer',
                     '#followText',
                     '#smallLinks',
                     '#linksContainer1',
                     '#twitterFollow',
                     '#youtubeFollow',
                     '#cdm-zone-02',
                     '#youtuberOf',
                     '#downloadButtonContainer',
                     '#promoImg',
                     '.menuHeader',
                     '.menuLink',
                     '.menuHeader:nth-child(5)',
                     '.menuHeader:nth-child(6)',
                     '.menuText',
                     '#adCard',
                     '#promoImgHolder',
                     ],

    css = '#rightCardHolder {display: block!important}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

for ( let i = 0; i < hideSelectors.length; i++ ) {
    $(hideSelectors[i]).hide();
}

head.appendChild(style);
$('#linksContainer2').html('<a href="./docs/versions.txt" target="_blank" class="menuLink">' + moomooVer + '</a>');

// document.getElementById('promoImgHolder').innerHTML = '</iframe><iframe width="420px" height="236.25px" src="https://www.youtube-nocookie.com/embed/GPATUFiWoTI" frameborder="0" allowfullscreen></iframe>';
// document.getElementById('adCard').innerHTML = '<iframe width="420px" height="236.25px" src="https://www.youtube-nocookie.com/embed/D3_2AIOEnZQ" frameborder="0" allowfullscreen></iframe>';
// document.getElementById('downloadButtonContainer').innerHTML = '</iframe><iframe width="420px" height="236.25px" src="http://icecast3.play.cz/evropa2-128.mp3"></iframe>';

// document.getElementById("gameUI").style.backgroundImage = "url('http://dl.glitter-graphics.com/pub/762/762651vmy5bhl1dj.gif')";
// document.getElementById("mainMenu").style.backgroundImage = "url('http://dl.glitter-graphics.com/pub/762/762651vmy5bhl1dj.gif')";
document.getElementById('enterGame').innerHTML = 'Enter';
document.getElementById('loadingText').innerHTML = 'Laden';
document.getElementById("nameInput").placeholder = "Benutzername";
document.getElementById("chatBox").placeholder = "Senden";
document.getElementById('diedText').innerHTML = 'Du wurdest getötet!';
document.getElementById('gameName').innerHTML = 'MOOMOO.IO';

$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0.74)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'margin': '15px',
                    'margin-top': '15px'});

$('#menuContainer').css({'white-space': 'normal'});

$('#nativeResolution').css({'cursor': 'pointer'});

$('#playMusic').css({'cursor': 'pointer'});

$('#guideCard').css({'overflow-y': 'hidden',
                     'margin-top': 'auto',
                     'margin-bottom': '30px'});

$('#serverSelect').css({'margin-bottom': '30.75px'});

$('#skinColorHolder').css({'margin-bottom': '30.75px'});

$('.settingRadio').css({'margin-bottom': '30.75px'});

$('#partyButton').css({'right': '70%',
                       'left': '10%',
                       'text-align': 'center',
                       'bottom': '48px',
                       'text-align': 'center',
                       'font-size': '24px',
                       'top': 'unset'});

$('#joinPartyButton').css({'right': '10%',
                           'left': '70%',
                           'text-align': 'center',
                           'bottom': '48px',
                           'font-size': '24px',
                           'top': 'unset'});

$('#linksContainer2').css({'-webkit-border-radius': '0px 0 0 0',
                           '-moz-border-radius': '0px 0 0 0',
                           'border-radius': '0px 0 0 0',
                           'right': '44%',
                           'left': '44%',
                           'background-color': 'rgba(0, 0, 0, 0.74)',
                           'text-align': 'center',
                           'bottom': '12px'});

$('#gameName').css({'color': '#FF0000',
                    'text-shadow': '0 1px 0 rgba(255, 255, 255, 0), 0 2px 0 rgba(255, 255, 255, 0), 0 3px 0 rgba(255, 255, 255, 0), 0 4px 0 rgba(255, 255, 255, 0), 0 5px 0 rgba(255, 255, 255, 0), 0 6px 0 rgba(255, 255, 255, 0), 0 7px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 9px 0 rgba(255, 255, 255, 0)',
                    'margin-bottom': '-10px',
                    'text-align': 'center',
                    'font-size': '156px',
                    'margin-bottom': '-30px'});

$('#loadingText').css({'color': '#808080',
                       'background-color': 'rgba(0, 0, 0, 0.74)',
                       'padding': '8px',
                       'right': '150%',
                       'left': '150%',
                       'margin-top': '40px'});

$('.ytLink').css({'color': '#144db4',
                  'padding': '8px',
                  'background-color': 'rgba(0, 0, 0, 0.74)'});

$('.menuLink').css({'color': '#144db4'});

$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});

$('#serverSelect').css({'cursor': 'pointer',
                        'color': '#FF0000',
                        'background-color': '#808080',
                        'border': 'hidden',
                        'font-size': '20px'});

$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',
                      '-webkit-border-radius': '0px'});

$('#promoImgHolder').css({'position': 'absolute',
                          'bottom': '-7%',
                          'left': '20px',
                          'width': '420px',
                          'height': '236.25px',
                          'padding-bottom': '18px',
                          'margin-top': '0px'});

$('#adCard').css({'position': 'absolute',
                  'bottom': '-7%',
                  'right': '20px',
                  'width': '420px',
                  'height': '236.25px',
                  'padding-bottom': '18px'});

$('#mapDisplay').css({'-webkit-border-radius': '0px',
                      '-moz-border-radius': '0px',
                      'border-radius': '0px'});

$('.menuHeader').css({'color': 'rgba(255, 255, 255, 1)'});

$('#killCounter').css({'color': '#ededed'});

$('#diedText').css({'background-color': 'rgba(0, 0, 0, 0.74)'});

$('#gameCanvas').css({'background-color': '#f4f4f4'});

$('#allianceButton').css({'color': 'rgba(0, 0, 0, 1)'});

$('#storeButton').css({'color': 'rgba(0, 0, 0, 1)'});

$('#chatButton').css({'color': 'rgba(0, 0, 0, 1)'});

$('.gameButton').css({'-webkit-border-radius': '0px 0 0 0',
                      '-moz-border-radius': '0px 0 0 0',
                      'border-radius': '0px 0 0 0',
                      'background-color': 'rgba(0, 0, 0, 0.4)'});

$('.uiElement, .resourceDisplay').css({'-webkit-border-radius': '0px',
                                       '-moz-border-radius': '0px',
                                       'border-radius': '0px',
                                       'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#chatBox').css({'-webkit-border-radius': '0px',
                   '-moz-border-radius': '0px',
                   'border-radius': '0px',
                   'background-color': 'rgba(0, 0, 0, 0.4)',
                   'text-align': 'center'});

$('#foodDisplay').css({'color': '#ae4d54'});

$('#woodDisplay').css({'color': '#758f58'});

$('#stoneDisplay').css({'color': '#818198'});

$('#scoreDisplay').css({'color': '#c2b17a'});

$('#leaderboard').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)',
                       'text-align': 'center'});

$('#ageText').css({'color': '#000'});

$('#ageBar').css({'-webkit-border-radius': '0px',
                  '-moz-border-radius': '0px',
                  'border-radius': '0px',
                  'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#ageBarBody').css({'-webkit-border-radius': '0px',
                      '-moz-border-radius': '0px',
                      'border-radius': '0px',
                      'background-color': '#FF0000'});

$('.storeTab').css({'-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#storeHolder').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#allianceHolder').css({'-webkit-border-radius': '0px',
                          '-moz-border-radius': '0px',
                          'border-radius': '0px',
                          'background-color': 'rgba(0, 0, 0, 0.4)'});

$('.actionBarItem').css({'-webkit-border-radius': '0px',
                         'border-radius': '0px',
                         'background-color': 'rgba(0, 0, 0, 0.4)'});

var myElement = document.querySelector("#nameInput");
myElement.style.backgroundColor = "#808080";
myElement.style.color = "#FF0000";

var myElement = document.querySelector("#enterGame");
myElement.style.backgroundColor = "#FF0000";
myElement.style.color = "#808080";

$('#leaderboard').append('FERANYZERIR');

$('body').prepend('<img class= "InfoVylepšení" src= "https://i.imgur.com/Fa3yyMa.png" alt= "Info O Vylepšení" width= "455" height= "455" style= "position: absolute ; left: 33.33% ; top: 7% ; display: none; pointer-events: none ; "/>' );