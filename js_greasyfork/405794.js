// ==UserScript==
// @name         ScoreSaber OneClick install button
// @namespace    https://scoresaber.com/
// @version      1.0.1
// @description  Adds a OneClick install button to the detail page of a beatmap on ScoreSaber
//
// @author       Veikko Lehmuskorpi
// @license      MIT
// @copyright    Copyright (C) 2020, by Veikko Lehmuskorpi
//
// @match        https://scoresaber.com/leaderboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405794/ScoreSaber%20OneClick%20install%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/405794/ScoreSaber%20OneClick%20install%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DETAIL_BOX_ELEM_SELECTOR = '.box.has-shadow';
    const ONECLICK_INSTALL_ELEM_SELECTOR = '#oneclick-install';

    const getEndpoint = () => {
        const endpoint = 'https://beatsaver.com/api/maps/by-hash';
        return endpoint;
    }

    const getMapByHash = async (hash) => {
        try {
            const endpoint = getEndpoint();
            const resp = await fetch(`${endpoint}/${hash}`);
            const data = await resp.json();
            return data;
        } catch(err) {
            throw new Error(`Error fetching map with hash "${hash}"`);
        }
    }

    const getMapHash = () => {
        const coverImgUrl = document.querySelector('meta').content;
        const coverImgName = coverImgUrl.split('/').pop();
        const mapHash = coverImgName.split('.').shift();
        return mapHash;
    }

    const formInstallUri = (mapKey) => {
        const installUri = `beatsaver://${mapKey}`;
        return installUri;
    }

    const createInstallElem = () => {
        const installElem = document.createElement('a');
        const installElemContent = document.createTextNode('OneClick™');
        installElem.appendChild(installElemContent);
        installElem.title = 'One-Click install';
        installElem.id = 'oneclick-install';
        installElem.style.marginTop = '1rem';
        installElem.classList.add('button', 'is-dark', 'is-loading');
        installElem.setAttribute('disabled', '');
        return installElem;
    }

    const addInstallButton = () => {
        const installElem = createInstallElem();
        const detailBoxElem = document.querySelector(DETAIL_BOX_ELEM_SELECTOR);
        detailBoxElem.appendChild(installElem);
    }

    const addInstallLink = (installUri) => {
        const installElem = document.querySelector(ONECLICK_INSTALL_ELEM_SELECTOR);
        installElem.href = installUri;
        installElem.removeAttribute('disabled');
        installElem.classList.remove('is-loading');
    }

    const start = async () => {
        addInstallButton();

        try {
            const mapHash = getMapHash();
            const { key: mapKey } = await getMapByHash(mapHash);
            const installUri = formInstallUri(mapKey);
            addInstallLink(installUri);
        } catch(err) {
            console.error(`"Scoresaber One-Click install button" userscript error:, ${err.message}`);
        }
    }

    start();
})();
