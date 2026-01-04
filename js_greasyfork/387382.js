// ==UserScript==
// @name         Placer
// @version      1.71
// @description  ???
// @author       Anonymous
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://45.77.0.81/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/
// @icon         https://vignette.wikia.nocookie.net/moom/images/7/7a/Cacti.PNG/revision/latest?cb=20170524094943
// @downloadURL https://update.greasyfork.org/scripts/387382/Placer.user.js
// @updateURL https://update.greasyfork.org/scripts/387382/Placer.meta.js
// ==/UserScript==


(function() {
    var ITEM_TYPE = {
        WEAPON: 0,
        PITTRAP: 3,
        TWO_WEAPON: 5,
        SPIKES: 6
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
        id: 12,
        type: ITEM_TYPE.PITTRAP,
        sid: 23,
        name: "Pit trap"
    }, {
        id: 13,
        type: ITEM_TYPE.PITTRAP,
        sid: 24,
        name: "Boost pad "
    }, ];
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
        this.itemInHand = this.items[ITEM_TYPE.WEAPON];
    }


document.addEventListener('keydown', function (e) {
        if (ws) {
            switch (e.keyCode) {
                // G
                case 71:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.SPIKES]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.SPIKES].id + ",null]");
                    break;
                // F
                case 70:
                    e.stopPropagation();
                    if (player.items[ITEM_TYPE.PITTRAP]) ws.send("42[\"5\"," + player.items[ITEM_TYPE.PITTRAP].id + ",null]");
                    break;
                    
            }
        }
    }, true);

})();