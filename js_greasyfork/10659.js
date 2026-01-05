// ==UserScript==
// @name 		HWM Hidden Clans
// @version 	1.1
// @description 	HWM Mod - Создаёт спойлер для списка кланов на странице игрока
// @author 	СтепнойВарварка
// @namespace 	mod Mefistophel_Gr
// @homepage 	https://greasyfork.org/ru/users/9016-Mefistophel-Gr
// @include 	http://*heroeswm.ru/pl_info.php*
// @include 	http://178.248.235.15/pl_info.php*
// @include 	http://*.lordswm.com/pl_info.php*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/10659/HWM%20Hidden%20Clans.user.js
// @updateURL https://update.greasyfork.org/scripts/10659/HWM%20Hidden%20Clans.meta.js
// ==/UserScript==


(function() {
    var hide_clans = false;
    
    var b = document.querySelector('td.wb>a[href*="clan_info.php?id="]>b');
    
    if (b) {
        var td = b.parentNode.parentNode; td.style.display = 'none';
        td.parentNode.previousSibling.addEventListener('click', expandClans);
    }

    function expandClans() {
        if (hide_clans) {
            td.style.display = 'none';
        } else {
            td.style.display = '';
        }
        hide_clans = !hide_clans;
    }

})();