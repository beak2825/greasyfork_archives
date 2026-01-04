// ==UserScript==
// @name         noclick krakenfiles download
// @namespace    https://telegra.ph/glory-03-12-2
// @version      2024-03-14
// @description  tired of getting these shit ads when im downloading leaks
// @author       honor
// @match        https://krakenfiles.com/view/*
// @icon         https://i.imgur.com/9BoZvsW.jpeg
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489832/noclick%20krakenfiles%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/489832/noclick%20krakenfiles%20download.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const form = new FormData();
    let token = document.getElementById('dl-token').value;
    let id = window.location.pathname.split('/')[2];

    form.append('token', token);

    fetch(`https://s10.krakenfiles.com/download/${id}`, { // you can pick any server you want from s1 to s10
        method: 'POST',
        body: form
    }).then((response) => {
        if (!response.ok) {
            throw new Error('we are not ok!');
        }
        return response.json()
    }).then(data => {
        window.location.replace(data.url)
    });
})();