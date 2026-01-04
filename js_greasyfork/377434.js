// ==UserScript==
// @name         yande.re_db
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  yande.re_db downloader by Beats0
// @author       Beats0
// @home-url     https://greasyfork.org/zh-CN/scripts/377434-yande-re-db
// @home-url2    https://beats0.github.io/scripter/yande.re_db/
// @match        *://beats0.github.io/scripter/yande.re_db/*
// @match        *://mynovel.life/scripter/yande.re_db/*
// @grant        GM_download
// @grant        GM_info
// @grant        GM.download
// @grant        GM.info
// @downloadURL https://update.greasyfork.org/scripts/377434/yandere_db.user.js
// @updateURL https://update.greasyfork.org/scripts/377434/yandere_db.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const re = /([a-fA-F0-9]{40})/;

    function handleDownload(e) {
        if (e.target.id === 'download') {
            const saveEl = document.querySelectorAll('.btn')[1]
            saveEl.click()
            const db = JSON.parse(localStorage.getItem('yande.re_db'))
            if(!db || db.length === 0) {
                window.alert('please select image!')
            }
            localStorage.setItem('yande.re_db', JSON.stringify([]))
            for (let i = 0; i < db.length; i++) {
                GMDownload(db[i], db[i].match(re)[0])
            }
        }
    }

    // GM downloader
    function GMDownload(url, name) {
        var arg = {
            url: `https://steamuserimages-a.akamaihd.net/ugc/${url}`,
            name: `${name}.jpg`,
            onprogress: downloadProgress
        }
        console.log(arg)
        GM_download(arg)
    }

    // downloader progress
    function downloadProgress(xhr) {
        try {
            if (!xhr.lengthComputable) return;
            var stripe = document.getElementById('stripe'),
                width = Math.floor(xhr.loaded / xhr.total * 100);
            width === 100 ? stripe.style.width = 0 : stripe.style.width = `${width}%`
        } catch (e) {
            console.error(e);
        }
    }

    // create progress
    var body = document.getElementsByTagName('body')[0];
    var progressEl = document.createElement('div');
    progressEl.innerHTML = `
    <div id='stripe' style="
    position: fixed;
    height: 2px;
    width: 0;
    margin: 0 -3em;
    top: 0;
    background: #ee8887;
    box-shadow: 0 0 10px rgba(249,144,141,0.7);
    transition: width .4s ease;
"></div>`
    body.appendChild(progressEl)

    window.addEventListener('click', handleDownload, false)
})();