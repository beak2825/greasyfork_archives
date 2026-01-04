// ==UserScript==
// @name         BS New Episodes
// @namespace    https://bs.to
// @version      1.0.1
// @description  Desktopbenachrichtigung bei neuen Episoden der Favoriten
// @author       Asu_nyan
// @match        https://bs.to/
// @grant        none
// @icon         https://bs.to/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/392074/BS%20New%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/392074/BS%20New%20Episodes.meta.js
// ==/UserScript==
// jshint esversion: 6

(function() {
    'use strict';
    check();
})();
function getFavLinks() {
    const names = Array.from(document.querySelectorAll('#other-series-nav > ul a')).map(el => el.href);
    return names.slice(0, names.length-2);
}
async function getNELinks() {
    const data = await fetch(window.location.origin).then(res => res.text());
    const div = document.createElement('div');
    div.innerHTML = data;
    let list = div.querySelectorAll('#newest_episodes > div > ul a');
    return Array.from(list).map(el => el.href);
}
function getShowRoot(url) {
    return url.split('/').slice(0, 5).join('/');
}
async function check() {
    let bsne = (window.localStorage.bsne) ? JSON.parse(window.localStorage.bsne) : [];
    bsne = (bsne.length > 40) ? bsne.slice(0, 20) : bsne;
    const fav_list = getFavLinks();
    const ne_list = await getNELinks();
    const filtered = ne_list.filter(e => fav_list.includes(getShowRoot(e)) && !bsne.includes(e));
    if(filtered.length) {
        filtered.forEach(async el => {
            const data = await fetch(el).then(res => res.text());
            const div = document.createElement('div');
            div.innerHTML = data;
            const cover = div.querySelector('img[alt="Cover"]').src;
            const title = div.querySelector('#sp_left > h2').textContent.split('Staffel')[0].trim()
            const options = { body: title, icon: cover };
            let n = new Notification('Neue Folge verfügbar!', options);
            n.href=el;
            n.onclick=function onclick(event){
                window.open(el);
                event.target.close();
            };
        });
        bsne = bsne.concat(filtered);
        window.localStorage.bsne = JSON.stringify(bsne);
    }
    setTimeout(check, 1000*60);
}