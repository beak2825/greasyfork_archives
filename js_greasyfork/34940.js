// ==UserScript==
// @name         Макрос-хуякрос
// @namespace    tuxuuman:aor.free.macros
// @version      0.1.3
// @description  Заменяет стандартный макрос. Не урезает дроп, доступны все функции премиум макроса.
// @author       tuxuuman<tuxuuman@gmail.com>
// @match        http://game.aor-game.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34940/%D0%9C%D0%B0%D0%BA%D1%80%D0%BE%D1%81-%D1%85%D1%83%D1%8F%D0%BA%D1%80%D0%BE%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/34940/%D0%9C%D0%B0%D0%BA%D1%80%D0%BE%D1%81-%D1%85%D1%83%D1%8F%D0%BA%D1%80%D0%BE%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oldStartGame = window.StartGame;
    window.StartGame = function(data) {
        oldStartGame(data);
        botInit();
    };

    var botData = {};
    var timeItemsTimer;

    console.log("Хуякрос запущен!");

    function SendPacket(e) {
        var f = true;
        if (f) {
            var g = {
                encode: function (s, k) {
                    var c = '';
                    var d = '';
                    d = s.toString();
                    for (var i = 0; i < s.length; i++) {
                        var a = s.charCodeAt(i);
                        var b = a ^ k;
                        c = c + String.fromCharCode(b);
                    }
                    return c;
                },
                getNum: function () {
                    if (!window['clientData'].numeric) {
                        window['clientData'].numeric = 0;
                        return 0;
                    } else {
                        return parseInt(window['clientData'].numeric);
                    }
                }
            };
            e.numericPacket = g.getNum();
            e = g.encode(JSON.stringify(e), (199429672276830).toString());
            client.send(e);
            window['clientData'].numeric++;
            if (window['clientData'].numeric > 255) {
                window['clientData'].numeric = 0;
            }
        }
    }
    
    function getMacroData() {
        let macroData = {
            mob: 0,
            hp_items: [],
            time_items: []
        };
        
        macroData.mob = $("#macrosMob").data('value');
        
        var hpItems = $('[data-type="macros_hp"]');
        var secItems = $('[data-type="macros_sec"]');
        for (var i=0; i<hpItems.length; i++) {
            if ($(hpItems[i]).data('from') == 'skill') {
                macroData.hp_items.push({type: 1, id: $(hpItems[i]).data('realid'), hp: $(hpItems[i]).parent().parent().parent().children('.macrosTextBlock').children('.changeMacrosHp').val()});
            } else {
                macroData.hp_items.push({type: 0, item_id: $(hpItems[i]).data('realid'), id: $(hpItems[i]).data('itemid'), hp: $(hpItems[i]).parent().parent().parent().children('.macrosTextBlock').children('.changeMacrosHp').val()});
            }
        }
        for (var i=0; i<secItems.length; i++) {
            if ($(secItems[i]).parent().parent().hasClass('macrosSkillsPotionsBlockedItem')) {
                continue;
            }
            if ($(secItems[i]).data('from') == 'skill') {
                macroData.time_items.push({lastUse: 0, type: 1, id: $(secItems[i]).data('realid'), time: parseInt($(secItems[i]).parent().parent().children('.macrosTimeWaiting').val())});
            } else {
                macroData.time_items.push({lastUse: 0, type: 0, id: $(secItems[i]).data('itemid'), time: parseInt($(secItems[i]).parent().parent().children('.macrosTimeWaiting').val())});
            }
        }

        macroData.hp_items = macroData.hp_items.sort((a,b)=>{
            if(a.hp < b.hp) return -1;
            else if(a.hp > b.hp) return 1;
            return 0;
        });
        
        return macroData;
    }
    
    function botInit(){
        client.off("message", messageHandler);

        $('.macrosSkillsPotionsItem').removeClass('macrosSkillsPotionsBlockedItem');
        $('.macrosTimeWaiting').prop('disabled', false);
        $('.macros>.windowHeader').html("<span style='text-decoration:line-through'>Макрос</span> Хуякрос");

        $("#startMacros").off('click');
        $("#startMacros").on('click', function() {
            if ($(this).hasClass('disabled')) return;
            botStart();
        });

        $("#stopMacros").off("click");
        $("#stopMacros").on('click', function() {
            if ($(this).hasClass('disabled')) return;
            botStop();
        });

        console.log("Бот готов к использованию!");
    }

    function getInventoryItem(propName, value) {
        for (let i in clientData.inventory){
            let item = clientData.inventory[i];
            if(item.hasOwnProperty(propName) && item[propName] == value) return item;
        }

        return null;
    }

    function getInventoryItems(propName, ...values) {
        let result = [];
        for (let i in clientData.inventory){
            let item = clientData.inventory[i];
            for(let val of values){
                if(item.hasOwnProperty(propName) && item[propName] == val)
                result.push(item);
            }
        }
        return result;
    }

    function botStart(macroData){
        botData = macroData || getMacroData();
        
        $('.macrosSkillsPotionsItem').removeClass('macrosSkillsPotionsBlockedItem');
        $('.macrosTimeWaiting').prop('disabled', false);

        $("#startMacros").addClass('disabled');
        $("#stopMacros").removeClass('disabled');
      
        client.on("message", messageHandler);
        setTarget();

        timeItemsTimer = setInterval(function() {
            for(let item of botData.time_items){
                if(item.lastUse < Date.now()){
                    if(item.type == 1) {
                        useSkill(item.id);
                        console.log("timeItemsTimer Юзаем скилл", item.id);
                    } else {
                        useItem(item.id);
                        console.log("timeItemsTimer Юзаем шмотку", item.id);
                    }
                    item.lastUse = Date.now() + item.time * 1000;
                    break;
                }
            }
        }, 1000);
        console.log("Macros started", botData);
    }

    function rnd(max) {
        return Math.floor(Math.random() * max);
    }


    function botStop(){
        clearInterval(timeItemsTimer);
        client.off("message", messageHandler);
        $("#startMacros").removeClass('disabled');
        $("#stopMacros").addClass('disabled');
    }

    function setTarget(){
        setTimeout(function(){
            SendPacket({type: "SetTarget", is: "mob", id: botData.mob});
        }, Math.round(Math.random() * 200 + 100));
    }

    function messageHandler(e) {
        switch(e.type) {
            case "StartGame":
                //
                break;

            // отмена цели
            case "UnTarget":
                   setTarget();
                break;

            // изменение hp
            case "CharacterHpMp":
                let pcHp = Math.round(e.hp / e.max_hp * 100); // текущее hp в процентах
                for(let item of botData.hp_items) {
                    let heal = false;
                    
                    if (/%/.test(item.hp)) { // процентное сравнение hp
                        let pc = parseInt(item.hp.replace("%", "")) || 80; // при скольки % юзать предмет, по умолчанию 80
                        if (pcHp < pc) {
                            heal = true;
                        }
                    } else if(e.hp <= parseInt(item.hp)) { // числовое сравнение
                        heal = true;
                    }
                    
                    if (heal) {
                        if(item.type == 0) useItem(item.id);
                        else useSkill(item.id);
                        break;
                    }
                }
                break;

            case "InitLocation":
                botStop();
                break;
        }
    }

    function useItem(unique_id) {
        if(getInventoryItem("unique_id", unique_id)) {
            SendPacket({type: "UseItem", uniqueID: unique_id});
        } else {
            console.error("useItem error. Item", unique_id, "not found");
        }
    }

    function useSkill(skill_id){
        let skillInfo = Config.skills[skill_id];
        let items = [];

        if(skillInfo.params.need_item) {
            for(let need_item of skillInfo.params.need_item){
                let item = getInventoryItem("item_id", need_item.id);
                items.push(item.unique_id);
            }
        }

        SendPacket({type: "UseSkill", id: skill_id, target: "", items: items, friends: false});
    }
})();