// ==UserScript==
// @name         VK Messanger remover
// @version      0.4
// @description  Changes name of "Messanger" section back
// @author       Intel777
// @copyright    2020, Alexander Boris (https://t.me/intel777)
// @license      MIT
// @match        https://vk.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/734002
// @downloadURL https://update.greasyfork.org/scripts/421113/VK%20Messanger%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/421113/VK%20Messanger%20remover.meta.js
// ==/UserScript==

var ai_title_translations = {
    'Мессенджер': 'Сообщения',
    'Messanger': 'Messages'
};

var legacy_ui_chat_tab_translations = {
    'Все чаты': 'Диалоги',
    'Chats': 'Dialogs'
};

var tab_title_observer = new MutationObserver(function(mutations, me){
    if (document.title in ai_title_translations){
        document.title = ai_title_translations[document.title];
    } 
});

var ai_title_observer = new MutationObserver(function(mutations, me){
    var messanger_ai = document.getElementById('l_msg');
    if(messanger_ai){
        var target_span = messanger_ai.getElementsByClassName('left_label');
        if(target_span){
            if (target_span[0].innerText in ai_title_translations){
                target_span[0].innerText = ai_title_translations[target_span[0].innerText];
            }
            me.disconnect();
            return;
        }
    }
});

var legacy_ui_chats_observer = new MutationObserver(function(mutations, me){
    var rmenu_chats_a = document.getElementById('ui_rmenu_all');
    if(rmenu_chats_a){
        if(rmenu_chats_a.innerText in legacy_ui_chat_tab_translations){
            rmenu_chats_a.innerText = legacy_ui_chat_tab_translations[rmenu_chats_a.innerText];
        }
        me.disconnect();
        return;
    }
});

(function() {
    'use strict';
    ai_title_observer.observe(document, {childList: true, subtree: true});
    legacy_ui_chats_observer.observe(document, {childList: true, subtree: true});
    tab_title_observer.observe(document, {childList: true, subtree: true});
})();