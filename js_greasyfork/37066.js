// ==UserScript==
// @name         FriendsInApp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds a button "friends in the game"
// @author       BAGOSI (vk.com/bagosi)
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37066/FriendsInApp.user.js
// @updateURL https://update.greasyfork.org/scripts/37066/FriendsInApp.meta.js
// ==/UserScript==

(function() {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.nodeType !== 1) return;
            if (cur.module=="app" && mutation.target.className!="fc_tab_title noselect" && !document.querySelector("#app_friends_info_btn")) addbtn();
        });
    });
    window.addEventListener("load", function () {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
    function addbtn() {
    var menu = document.getElementsByClassName("apps_options_bar_right apps_divided_links")[0];
    menu.innerHTML = '<a id="app_friends_info_btn" onclick="showBox(\'apps\', {act: \'show_app_friends_box\',aid: cur.aid})">Друзья в игре</a><span class="divider">|</span>'+menu.innerHTML;
    console.log("added");
    }
})();