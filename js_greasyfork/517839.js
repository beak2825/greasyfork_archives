// ==UserScript==
// @name            Useful buttons | Steam
// @name:ru         Полезные кнопки | Steam
// @description     Adds SteamDB, Pirate sites and other buttons to the game page.
// @description:ru  Добавляет кнопки SteamDB, Пиратских сайтов и другие на страницу игры.
// @include         https://store.steampowered.com/app/*
// @namespace       https://greasyfork.org/users/1367171
// @author          corviciuz
// @version         1.42
// @license         MIT
// @icon            https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/517839/Useful%20buttons%20%7C%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/517839/Useful%20buttons%20%7C%20Steam.meta.js
// ==/UserScript==

var buttonSet = [
    { url: "https://stopgame.ru/search?s=", title: "StopGame" },
    { url: "https://rutor.info/search/0/0/100/0/", title: "Rutor" },
    { url: "https://rutracker.org/forum/tracker.php?nm=", title: "RuTracker" },
    { url: "https://online-fix.me/index.php?do=search&subaction=search&story=", title: "OnlineFIX" },
    { url: "https://freetp.org/index.php?do=search&subaction=search&story=", title: "FreeTP" },
    { url: "https://steamrip.com/?s=", title: "SteamRIP" },
    { url: "https://gog-games.to/?q=", title: "GOG" },
    { url: "https://plati.market/search/", title: "Plati" },
];

var appName = document.getElementsByClassName("apphub_AppName")[0].textContent.trim();
var parts = window.location.href.split('/');
if (parts.indexOf('store.steampowered.com') === 2 && parts[3] === 'app') {

  var container = document.querySelector('#queueActionsCtn');
  if (container) {

    var steamDb = document.createElement('a');
    steamDb.href = 'https://steamdb.info/app/' + parts[4];
    steamDb.className = 'btnv6_blue_hoverfade btn_medium';
    steamDb.target = '_blank';
    steamDb.style.flexGrow = 0;
    steamDb.style.display = 'inline-block';
    steamDb.innerHTML = '<span>SteamDB</span>';
    container.appendChild(steamDb);

    buttonSet.forEach((button) => {
        var a = document.createElement('a');
        a.href = button.url + appName;
        a.className = 'btnv6_blue_hoverfade btn_medium';
        a.target = '_blank';
        a.style.flexGrow = 0;
        a.style.display = 'inline-block';
        a.style.marginLeft = '3px';
        a.innerHTML = `<span>${button.title}</span>`;
        container.appendChild(a);
    });
    var walk = document.createElement('a');
    walk.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(appName) + ' gameplay no commentary';
    walk.className = 'btnv6_blue_hoverfade btn_medium';
    walk.target = '_blank';
    walk.style.flexGrow = 0;
    walk.style.display = 'inline-block';
    walk.style.marginLeft = '3px';
    walk.innerHTML = '<span>Gameplay</span>';
    container.appendChild(walk);
  }
}