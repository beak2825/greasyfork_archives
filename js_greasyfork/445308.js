// ==UserScript==
// @name         BS Favorites
// @namespace    https://bs.to
// @version      1.3.7
// @description  Easy Favorites
// @author       Asu_nyan
// @match        https://bs.to/*
// @match        https://burningseries.co/*
// @grant        none
// @icon         https://bs.to/favicon.ico
// @require      https://greasyfork.org/scripts/375096-bs-library/code/BS_Library.js?version=651891
// @downloadURL https://update.greasyfork.org/scripts/445308/BS%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/445308/BS%20Favorites.meta.js
// ==/UserScript==
// jshint esversion: 6

const BS = window.BS;
const AjaxReload = true; // Lädt die Serienliste in der Navigation neu, wenn eine Aktion ausgeführt wird.
const css = `
.bootstrap-btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 20rem !important;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

@media screen and (prefers-reduced-motion: reduce) {
  .bootstrap-btn {
    transition: none;
  }
}

.bootstrap-btn:hover, .bootstrap-btn:focus {
  text-decoration: none;
}

.bootstrap-btn:focus, .bootstrap-btn.focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.bootstrap-btn.disabled, .bootstrap-btn:disabled {
  opacity: 0.65;
}

.bootstrap-btn:not(:disabled):not(.disabled) {
  cursor: pointer;
}

a.bootstrap-btn.disabled,
fieldset:disabled a.btn {
  pointer-events: none;
}

.btn-info {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  color: #fff;
  background-color: #138496;
  border-color: #117a8b;
}

.btn-info:focus, .btn-info.focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}

.btn-info.disabled, .btn-info:disabled {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:not(:disabled):not(.disabled):active, .btn-info:not(:disabled):not(.disabled).active,
.show > .btn-info.dropdown-toggle {
  color: #fff;
  background-color: #117a8b;
  border-color: #10707f;
}

.btn-info:not(:disabled):not(.disabled):active:focus, .btn-info:not(:disabled):not(.disabled).active:focus,
.show > .btn-info.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}

.btn-outline-info {
  color: #17a2b8;
  background-color: transparent;
  background-image: none;
  border-color: #17a2b8;
}

.btn-outline-info:hover {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-outline-info:focus, .btn-outline-info.focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}

.btn-outline-info.disabled, .btn-outline-info:disabled {
  color: #17a2b8;
  background-color: transparent;
}

.btn-outline-info:not(:disabled):not(.disabled):active, .btn-outline-info:not(:disabled):not(.disabled).active,
.show > .btn-outline-info.dropdown-toggle {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-outline-info:not(:disabled):not(.disabled):active:focus, .btn-outline-info:not(:disabled):not(.disabled).active:focus,
.show > .btn-outline-info.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
}

.btn-sm, .bootstrap-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}
`;

let favshows = [];

const addFav = 'Zu Favoriten hinzufügen';
const remFav = 'Aus Favoriten entfernen';

(function() {
    'use strict';
    BS.Favorites.Get((list) => {
        favshows = list;
    });
    setTimeout(setup, 1000);
})();


function setup() {
    BS.Helper.InjectCSS(null, css);
    let a = document.querySelector('#sp_left h2');
    let span = document.createElement('span');
    let btnFav = document.createElement('button');
    let btnClass = (favshows.includes(BS.Series.ID())) ? 'btn-info' : 'btn-outline-info';
    span.id = 'bs-fav-script';
    span.appendChild(btnFav);
    btnFav.classList.add('bootstrap-btn');
    btnFav.classList.add('btn-xs');
    btnFav.classList.add(btnClass);
    btnFav.innerText = (favshows.includes(BS.Series.ID())) ? remFav : addFav;
    btnFav.addEventListener('click', clickEvent);
    a.appendChild(span);
}

function clickEvent(e) {
    let b = (e.target.innerText.trim() == addFav) ? true : false;
    if(b) {
        e.target.classList.remove('btn-outline-info');
        e.target.classList.add('btn-info');
        e.target.innerText = remFav;
    } else {
        e.target.classList.remove('btn-info');
        e.target.classList.add('btn-outline-info');
        e.target.innerText = addFav;
    }
    blockAction(e.target, 1000, () => {
        let id = BS.Series.ID();
        if(b) favshows.push(id);
        else {
            let index = favshows.indexOf(id);
            favshows.splice(index, 1);
        }
        BS.Favorites.Save(favshows, AjaxReload);
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