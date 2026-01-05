// ==UserScript==
// @name         DRRR 法官 Helper
// @namespace    com.drrr.judge-helper
// @version      0.6
// @description  try to take over the world!
// @author       Willian
// @match        http://drrr.com/room/*
// @match        https://drrr.com/room/*
// @match        http://drrr.lan/room*
// @match        https://drrr.lan/room*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/20061/DRRR%20%E6%B3%95%E5%AE%98%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/20061/DRRR%20%E6%B3%95%E5%AE%98%20Helper.meta.js
// ==/UserScript==

// let $ = unsafeWindow.$;

if(!window){
    var window = unsafeWindow;
}

let startRegex = /開始|开始/;
let button = $('.room-submit-btn');
$(window).on('room.chat.message', function (_, chat) {
    if (chat.message && chat.is_me && chat.message.search(startRegex) != -1) {
        resetCounter();
    }
});

let counter = null;
function resetCounter() {
    if (counter) clearInterval(counter);
    let counting = 1;
    counter = setInterval(function () {
        changeDisplay(counting);
        counting++;
    }, 1000);
};
function changeDisplay(sth) {
    button.val(sth);
};

function formDefaultInstruction(key, value) {
    return function () {
        return DRRRAPI.post_legacy({ default: { key: key, value: value } }).catch(function (e) { swal(e); });
    };
};
function formSetInstruction(key, value) {
    let settings = {
        to: 'all'
    };
    settings[key] = value;
    return function () {
        return $.post('', settings).done(function (e) { if (e) { swal(e); } });
    };
};
const trans = window.translator;
function isEnglish() {
    return trans.constructor.catalog["Yes"] == "YES"
}
function addTranslation() {
    let catalog = translator.constructor.catalog;
    catalog['Set all to {1}'] = '讓所有人成為 {1}';
    catalog['Set defalut to {1}'] = '設置進入默認為 {1}';
}
if (!isEnglish()) addTranslation();

$(window).on('room.user.menu.show', function (event, menu, user, dropdown) {
    if(DRRRClientBehavior.is_game_room){
        dropdown.resetDevider();
        dropdown.addDevisionIfNot();
        dropdown.addNode(t(`All`), null, 'dropdown-item-unclickable');
        if (user.hasOwnProperty('player')) {
            let playerTag = t(!user.player ? 'player' : 'non-player');
            dropdown.addNode(t('Set all to {1}', playerTag),
                formSetInstruction('player', !user.player)
            );
            
        }
        if (user.hasOwnProperty('alive')) {
            let aliveTag = t(!user.alive ? 'alive' : 'dead');
            dropdown.addNode(t('Set all to {1}', aliveTag),
                formSetInstruction('alive', !user.alive)
            )
        }

        dropdown.resetDevider();
        dropdown.addDevisionIfNot();
        dropdown.addNode(t(`Defaults`), null, 'dropdown-item-unclickable');
        let is_default_player = DRRRClientBehavior.gameDefaults?.player ?? false
        dropdown.addNode(t('Set defalut to {1}',  t(!is_default_player ? 'player' : 'non-player')),
            formDefaultInstruction('player', !is_default_player)
        );
        let is_default_alive = DRRRClientBehavior.gameDefaults?.alive ?? true
        dropdown.addNode(t('Set defalut to {1}', t(!is_default_alive ? 'alive' : 'dead')),
            formDefaultInstruction('alive', !is_default_alive)
        );    
        dropdown.resetDevider();
    }
});