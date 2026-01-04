
// ==UserScript==
// @name         Grepolis town-disappear finder
// @author       Jesse de Gans
// @description  Find nearby towns that will disappear soon
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @version      2020.05.05
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// @namespace https://greasyfork.org/users/551826
// @downloadURL https://update.greasyfork.org/scripts/402627/Grepolis%20town-disappear%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/402627/Grepolis%20town-disappear%20finder.meta.js
// ==/UserScript==

(function() {
    var doc = document.getElementById('ui_box');
    //str = '<button onClick="showCityFinderWindow();" style="position:absolute;bottom:10px;left:10px;z-index:1000"><img src="http://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/ghostwriter-icon.png" onClick="showCityFinderWindow()" style="position:absolute;bottom:10px;left:10px;z-index:1000;width:30px"></button>';
    var str ='<input type="image" id="showiets" src="http://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/ghostwriter-icon.png" onclick="showCityFinderWindow();" style="position:absolute;bottom:10px;left:10px;z-index:9999;width:40px" />'
    doc.insertAdjacentHTML( 'beforeend', str );

    //showiets
    const el = document.getElementById("showiets");
    el.addEventListener("click", (function(){showCityFinderWindow();}), false);

    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src='https://rawcdn.githack.com/jessedegans/GrepolisCityDisappearScript/41d3a90e704805dca91ead4aa069dece92422c14/main.min.js';
    //document.getElementsByTagName('body')[0].appendChild(script);
     document.body.appendChild( script );
})();

