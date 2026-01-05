// ==UserScript==
// @name           Agar.io - fast skins changer
// @name:ru        Agar.io - быстрая смена скинов
// @namespace      Agar.io script
// @author         Madzal
// @version        1
// @description    Fast switch show/hide open menu change skins
// @description:ru Быстрый вход/выход из меню смены скинов
// @include        http://agar.io*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/17541/Agario%20-%20fast%20skins%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/17541/Agario%20-%20fast%20skins%20changer.meta.js
// ==/UserScript==
document.onkeydown = function(skin) {
    if(skin.keyCode == "82") {
        document.clicked = !document.clicked >>> 0;
        if(document.clicked) {
            MC.openShop('shopSkins',{tab: document.getElementById("skinButton").getAttribute("data-type")}); // tab можно изменить на OWNED или PREMIUM или VETERAN        
        }
        else {
            document.getElementById("openfl-content").style.display="none";
            document.getElementById("openfl-overlay").style.display="none";
            setNick(document.getElementById('nick').value);            
        }
    }
}