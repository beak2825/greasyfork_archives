// ==UserScript==
// @name         Add pixiv link on vroid hub
// @namespace    me.nzws.us.vroid_hub_pixiv_link
// @description VRoid Hubのプロフィールページにpixivリンクを追加します
// @version     1.0.0
// @author       nzws
// @match        https://hub.vroid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389354/Add%20pixiv%20link%20on%20vroid%20hub.user.js
// @updateURL https://update.greasyfork.org/scripts/389354/Add%20pixiv%20link%20on%20vroid%20hub.meta.js
// ==/UserScript==

const $ = e => document.querySelector(e);
const search = (value, search) => value && search && value.indexOf(search) !== -1;
let path = '';

const replace = () => {
    if (path === location.pathname) return;

    const name = $('header h1');
    if (!name || !search(name.id, 'User-username')) return;

    const id = location.pathname.replace('/users/', '');

    const link = document.createElement('a');
    link.href = 'https://pixiv.net/u/' + id;
    link.textContent = name.textContent;

    name.replaceChild(link, name.firstChild);

    path = location.pathname;
};

(function() {
    'use strict';

    replace();
    setInterval(replace, 1000);
    // なんで onpopstate はあるのに onpushstate はないの
})();