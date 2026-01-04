// ==UserScript==
// @name         EventWinner
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  win it!
// @author       You
// @match        https://*.the-west.ru.com/game.php
// @icon         https://westru.innogamescdn.com/images/icons/nugget.png
// @grant        none
// @license MIT 
// @require https://update.greasyfork.org/scripts/490628/1347984/Ajax%20Async%20Lib.js
// @downloadURL https://update.greasyfork.org/scripts/491260/EventWinner.user.js
// @updateURL https://update.greasyfork.org/scripts/491260/EventWinner.meta.js
// ==/UserScript==

(function () {

    EventWinner = {
        images: {
            egg: "https://westru.innogamescdn.com/images/icons/Easter.png",
            nugget: "https://westru.innogamescdn.com/images/icons/nugget.png",
        },
        isRunning: false,
        wofid: 48,
        bribe: 8,
        reset: 12,
        ms: 800,
        botToken: "7194106399:AAHjteUE6YljOAOLU5ILdGVRQXwtcEgWt5k",
        chatId: -732543551,

        isEventCurrency: function(payid) { return payid == 16 },
        isNuggets: function(payid) { return payid == 2 },
        createMenuIcon: function (title, imageLink, functionStr) {
            let div = $(`<div class="ui_menucontainer" id="${title.toLowerCase()}"/>`);
            let link = $(`<div id="Menu" class="menulink" onclick=${functionStr}; title="${title}" />`)
                .css('background-image', `url(${imageLink})`)
                .css('background-size', 'contain');
            $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'))
        },

        run: function (payid) {
            if (this.isRunning) {
                this.isRunning = false;
                new UserMessage("Закончил", UserMessage.TYPE_HINT).show();
                return;
            }

            this.isRunning = true;
            new UserMessage("Погнали!", UserMessage.TYPE_SUCCESS).show();

            this.doEvent(payid);
        },

        doEvent: async function (payid) {
            let response = await AjaxAsync.remoteCallMode('wheeloffortune', 'init', { wofid: EventWinner.wofid });
            if ((Array.isArray(response.mode.cooldowns) && response.mode.cooldowns.length > 0
                || !Array.isArray(response.mode.cooldowns) && Object.keys(response.mode.cooldowns).length > 0)
                && response.mode.cooldowns[0].cdstamp * 1000 > Date.now()) {
                await EventWinner.resetIfHaveCurrency(payid);
            }

            let currentSet = await this.changeSetAndGetWeared();
            if (!currentSet) return;

            do {
                await this.playEasterEvent(payid, 0);
                //await this.playEasterEvent(payid, 25);
            } while (EventWinner.isRunning && (await this.resetIfHaveCurrency(payid)));

            //await this.equipSetBack(currentSet);
        },

        resetIfHaveCurrency: async function(payid) {
            let currency = EventWinner.getCurrency(payid);
            if (currency < EventWinner.bribe + EventWinner.reset) 
                return false;

            console.log('reset!');
            let response = await AjaxAsync.remoteCall('wheeloffortune', 'gamble', { 
                payid: payid, 
                action: 'reset', 
                wofid: EventWinner.wofid 
            });
            if (undefined !== response.nuggets) {
                Character.setNuggets(parseInt(response.nuggets));
            }
            if (EventWinner.isEventCurrency(payid)) {
                Character.ses_currency[EventWinner.currentEvent.toLowerCase()] -= EventWinner.reset * 60;
            }
            await AjaxAsync.wait(EventWinner.ms);

            return true;
        },

        getCurrency: function(payid) {
            return EventWinner.isEventCurrency(payid) ? Character.ses_currency.easter / 60
                                                      : Character.nuggets;
        },

        playEasterEvent: async function (payid, enhance) {
            let enhanceWithBribe = enhance + EventWinner.bribe;
            let currency = EventWinner.getCurrency(payid);

            if (currency < enhanceWithBribe) {
                console.log(`Недостаточно валюты`);
                return;
            }

            let response = await AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                payid: payid,
                action: 'main',
                wofid: EventWinner.wofid,
                enhance: enhance
            });

            if (response.error) {
                new UserMessage(response.msg, UserMessage.TYPE_ERROR).show();
                return;
            }
            if (undefined !== response.nuggets) {
                Character.setNuggets(parseInt(response.nuggets));
            }
            if (EventWinner.isEventCurrency(payid)) {
                Character.ses_currency[EventWinner.currentEvent.toLowerCase()] -= enhance * 60;
            }
            await AjaxAsync.wait(EventWinner.ms);
            console.log(`my: ${response?.streak?.streak}; his: ${response?.streak?.worldStreak};`);

            if (!response.outcome) {
                console.log('взятка!');
                response = await AjaxAsync.remoteCall('wheeloffortune', 'gamble', {
                    payid: payid,
                    action: 'bribe',
                    wofid: EventWinner.wofid
                });
                if (undefined !== response.nuggets) {
                    Character.setNuggets(parseInt(response.nuggets));
                }
                if (EventWinner.isEventCurrency(payid)) {
                    Character.ses_currency[EventWinner.currentEvent.toLowerCase()] -= EventWinner.bribe * 60;
                }
                await AjaxAsync.wait(EventWinner.ms);
            }

            let itemName = ItemManager.get(response.outcome.itemId).name;

            console.log(`Залутал ${itemName}`);
            if (response.outcome.itemEnhance > 0) {
                EventWinner.sendTgNotification(`[${Game.worldName}] ${Character.name} залутал ${itemName}!`);
            }
        },

        changeSetAndGetWeared: async function () {
            let currentSet = Object.values(Wear.wear).map(w => w.obj.item_id);
            EventWinner.sets = EventWinner.sets || (await AjaxAsync.remoteCallMode('inventory', 'show_equip', {})).data;
            let duelSet = EventWinner.sets.filter(s => s.name == 'дуэль');
            if (duelSet.length == 0) {
                console.warn('Duel set not found');
                return null;
            }
            EquipManager.switchEquip(duelSet[0].equip_manager_id);
            await EventWinner.waitEquip(EventWinner.getSetItemArray(duelSet[0]))
            return currentSet;
        },

        getSetItemArray: function (set) {
            var items = [];
            ['head', 'neck', 'body', 'right_arm', 'left_arm', 'belt', 'foot', 'animal', 'yield', 'pants'].forEach(item => {
                if (set[item] != null) items.push(set[item]);
            });
            return items;
        },

        waitEquip: async function (items) {
            while (true) {
                if (EventWinner.isGearEquiped(items)) break;
                await AjaxAsync.wait(10);
            }

            return Promise.resolve(true);
        },

        equipSetBack: async function (items) {
            console.log("equipSetBack");
            for (var i = 0; i < items.length; i++) {
                if (!EventWinner.isWearing(items[i]))
                    Wear.carry(Bag.getItemByItemId(items[i]));
            }
            await EventWinner.waitEquip(items);
        },

        isWearing: function (itemId) {
            let type = ItemManager.get(itemId).type;
            if (Wear.wear[type] == undefined) return false;
            return Wear.wear[type].obj.item_id == itemId;
        },

        isGearEquiped: function (items) {
            for (var i = 0; i < items.length; i++) {
                if (!EventWinner.isWearing(items[i])) return false;
            }
            return true;
        },

        sendTgNotification: function(message) {
            fetch(`https://api.telegram.org/bot${EventWinner.botToken}/sendMessage?chat_id=${EventWinner.chatId}&text=${message}`);
        },
    }



    $(document).ready(function () {
        try {
            let events = Game.sesData && Object.keys(Game.sesData);
            if (events && events.length > 0) {
                EventWinner.createMenuIcon('Nuggets', EventWinner.images.nugget, 'EventWinner.run(2)');
                EventWinner.currentEvent = events[0];

                if (EventWinner.currentEvent == 'Easter') {
                    EventWinner.createMenuIcon('Eggs', EventWinner.images.egg, 'EventWinner.run(16)');
                }
            }
        } catch (e) {
            console.log("exception occured");
        }
    });
})();