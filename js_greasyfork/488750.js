// ==UserScript==
// @name         BS Favorites Mod
// @namespace    https://bs.to
// @version      2
// @description  Easy Favorites, modded by getBrainError
// @author       Asu_nyan, getBrainError 
// @license MIT
// @match        https://bs.to/serie/*
// @grant        none
// @icon         https://bs.to/favicon.ico
// @require      https://greasyfork.org/scripts/375096-bs-library/code/BS_Library.js?version=651891
// @downloadURL https://update.greasyfork.org/scripts/488750/BS%20Favorites%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/488750/BS%20Favorites%20Mod.meta.js
// ==/UserScript==
// jshint esversion: 6

const BS = window.BS;
const AjaxReload = true; // Lädt die Serienliste in der Navigation neu, wenn eine Aktion ausgeführt wird.
const css = `
#fav_btn:hover {
   cursor: pointer;
}
`;

let favshows = [];

const addFav = 'Zu Favoriten hinzufügen';
const addFavIcon = 'fa-plus';

const remFav = 'Aus Favoriten entfernen';
const remFavIcon = 'fa-minus';

(function() {
    'use strict';
    BS.Favorites.Get((list) => {
        favshows = list;
    });
    setTimeout(setup, 1000);
})();


function setup() {
    BS.Helper.InjectCSS(null, css);
    let a = document.querySelector('#sp_right');
    let btnFav = document.createElement('a');
    let icon = document.createElement('span');
    let text = document.createElement('span');


    btnFav.setAttribute('id','fav_btn');
    icon.setAttribute('id','fav_icon');
    text.setAttribute('id','fav_text');


    btnFav.appendChild(icon);
    btnFav.appendChild(text);

    btnFav.addEventListener('click', clickEvent);
    a.insertBefore(btnFav, a.childNodes[2]);

    updateButton();
}



function updateButton(){
    let icon = document.querySelector('#fav_icon');
    let text = document.querySelector('#fav_text');

    if(favshows.includes(BS.Series.ID())){
        icon.className = 'fas fa-fw ' + remFavIcon;
        text.innerText = remFav;

    } else {
        icon.className = 'fas fa-fw ' + addFavIcon;
        text.innerText = addFav;

    }
}


function clickEvent(e) {
    let b = (favshows.includes(BS.Series.ID())) ? false : true;
    blockAction(e.target, 1000, () => {
        let id = BS.Series.ID();
        if(b) favshows.push(id);
        else {
            let index = favshows.indexOf(id);
            favshows.splice(index, 1);
        }
        BS.Favorites.Save(favshows, AjaxReload);
        updateButton();
    });

}

function blockAction(el, time, callback) {
    el.classList.add('disabled');
    el.setAttribute('disabled', true);
    if(callback) callback();
    setTimeout(() => {
        el.classList.remove('disabled');
        el.removeAttribute('disabled');
    }, time);
}