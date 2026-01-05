// ==UserScript==
// @name         Bitcointalk.org Autoreload
// @name:de      Bitcointalk.org Autoreload
// @homepage     http://greasyfork.org/scripts/19125-bitcointalk-org-autoreload/
// @homepage     http://openuserjs.org/scripts/LsHallo/Bitcointalk.org_Autoreload
// @version      0.64
// @iconURL      https://greasyfork.org/system/screenshots/screenshots/000/003/979/thumb/logo.png?1461614733
// @description    Automatically reloads the watchlist/unread posts
// @description:de Automatischer reload der post seiten bei bitcointalk
// @author       LsHallo
// @match        https://bitcointalk.org/index.php?action=watchlist
// @match        https://bitcointalk.org/index.php?action=unreadreplies
// @namespace https://greasyfork.org/en/scripts/19125-bitcointalk-org-autoreload/
// @downloadURL https://update.greasyfork.org/scripts/19125/Bitcointalkorg%20Autoreload.user.js
// @updateURL https://update.greasyfork.org/scripts/19125/Bitcointalkorg%20Autoreload.meta.js
// ==/UserScript==

load();
var y, x, link;

function changeTitle(state) {
    if(state === 0) {
        document.title = x + " Unread Posts";
        document.getElementById('faviconprovider').href = 'https://greasyfork.org/system/screenshots/screenshots/000/003/979/thumb/logo.png?1461614733';
        setTimeout(function(){changeTitle(1);},2000);
    } else {
        document.title = y;
        document.getElementById('faviconprovider').href = 'https://bitcointalk.org/favicon.ico';
        setTimeout(function(){changeTitle(0);},2000);
    }
}

function load() {
    y = document.title;
    time = ~~(Math.random()*75953+105896);
    console.log("Idle time: " + ~~(time/1000) + " seconds (" + ((time/1000).toFixed(0)/60).toFixed(2)+" minutes)");
    setTimeout(function(){location.reload();},time);

    d = new Date();
    if(d.getHours() < 10) Hours = "0"+d.getHours(); else Hours = d.getHours();
    if(d.getMinutes() < 10) Minutes = "0"+d.getMinutes(); else Minutes = d.getMinutes();
    if(d.getSeconds() < 10) Seconds = "0"+d.getSeconds(); else Seconds = d.getSeconds();

    console.log("Last reload: " + Hours + ":" + Minutes + ":" + Seconds);

    x = document.getElementsByClassName("windowbg").length/3;
    if(x > 0) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.id = 'faviconprovider';
        link.href = 'https://greasyfork.org/system/screenshots/screenshots/000/003/979/thumb/logo.png?1461614733';
        document.getElementsByTagName('head')[0].appendChild(link);
        changeTitle(0);
    }
}