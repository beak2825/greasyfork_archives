// ==UserScript==
// @name         Music tab to MORGENSHTERN rename
// @version      1
// @description  Changes name of "Music" section to MORGENSHTERN
// @author       Intel777
// @copyright    2021, Vladimir Zhadaev (https://vk.com/magic3000)
// @license      MIT
// @match        https://vk.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/ru/users/777038-magic3000
// @downloadURL https://update.greasyfork.org/scripts/427153/Music%20tab%20to%20MORGENSHTERN%20rename.user.js
// @updateURL https://update.greasyfork.org/scripts/427153/Music%20tab%20to%20MORGENSHTERN%20rename.meta.js
// ==/UserScript==

var ai_title_translations = {
    'Music': 'MORGENSHTERN'
};

var tab_title_observer = new MutationObserver(function(mutations, me){
    if (document.title in ai_title_translations){
        document.title = ai_title_translations[document.title];
    }
});

var ai_title_observer = new MutationObserver(function(mutations, me){
    var music_ai = document.getElementById('l_aud');
    if(music_ai){
        var target_span3 = music_ai.getElementsByClassName('left_label');
        if(target_span3){
            if (target_span3[0].innerText in ai_title_translations){
                target_span3[0].innerText = ai_title_translations[target_span3[0].innerText];
            }
        }
    }
    setTimeout(function() {
        me.disconnect();
    }, 3000);
});

(function() {
    'use strict';
    ai_title_observer.observe(document, {childList: true, subtree: true});
    tab_title_observer.observe(document, {childList: true, subtree: true});
})();