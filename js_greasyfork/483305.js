// ==UserScript==
// @name         JVC Post Différé
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Poster en différé sur jeuxvideo.com
// @author       PneuTueur
// @match        *://*.jeuxvideo.com/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jeuxvideo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483305/JVC%20Post%20Diff%C3%A9r%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/483305/JVC%20Post%20Diff%C3%A9r%C3%A9.meta.js
// ==/UserScript==

const DELAY = 50;
let interval;

function setAttributes(el, attrs) {
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function currentTime() {
    const d = new Date();
    return (d.toTimeString().split(' ')[0])
}

function checkTime(date_usr, post_btn) {
    const curr_time = currentTime();
    // console.log(date_usr, curr_time);
    if (date_usr==curr_time) {
        clearInterval(interval);
        post_btn.click();
    }
}

(function() {
    'use strict';

    const post_btn = document.getElementsByClassName('btn-poster-msg')[0];
    const btn = document.createElement('button');
    btn.setAttribute('class','btn btn-poster-msg');
    btn.textContent = 'Poster en différé';
    const input = document.createElement('input');
    setAttributes(input, {'type':'time', 'step':'1', 'value':currentTime(), 'style':'height:2rem;'});

    input.addEventListener('change', (event) => {
        input.style.backgroundColor = 'transparent';
    })

    btn.addEventListener('click', (event) => {
        event.preventDefault();
        if (interval) { clearInterval(interval); }
        input.style.backgroundColor = 'green';
        const date = input.value;
        interval = setInterval(checkTime, DELAY, date, post_btn);
    });

    post_btn.parentNode.insertBefore(input, post_btn.nextSibling);
    post_btn.parentNode.insertBefore(btn, input);
})();