// ==UserScript==
// @name         Pokemon Showdown Backup Helper
// @name:zh-CN   Pokemon Showdown 备份助手
// @namespace    pokemon-showdown-backup-helper
// @version      0.4.0
// @description  Pokemon Showdown Local Backup Helper
// @description:zh-CN  Pokemon Showdown 本地备份助手
// @author       Sabertaz
// @license      MIT License
// @match        http://play.pokemonshowdown.com/*
// @match        https://play.pokemonshowdown.com/*
// @match        http://psim.us/*
// @match        https://psim.us/*
// @match        http://legacy.psim.us/*
// @match        https://legacy.psim.us/*
// @match        http://china.psim.us/*
// @match        https://china.psim.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415087/Pokemon%20Showdown%20Backup%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/415087/Pokemon%20Showdown%20Backup%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonGap = 40;
    const psTeamsFilename = 'PSTeams.dat';

    const psTeamsStorageKey = 'showdown_teams';
    let buttonIdx = 1;

    const createButton = (text, func) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.value = 'button';
        button.style.position = 'fixed';
        button.style.right = '40px';
        button.style.bottom = `${buttonIdx * buttonGap}px`;
        button.style.zIndex = 9999;
        button.textContent = text;
        button.classList.add('button');
        button.addEventListener('click', func);
        buttonIdx++;
        return button;
    }

    const downloadTeam = () => {
        const teamData = localStorage.getItem(psTeamsStorageKey);
        const blob = new Blob([teamData], {type: 'text/csv'});

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, psTeamsFilename);
        } else {
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = psTeamsFilename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    };

    const uploadTeam = () => {
        if (!window.FileReader) {
            alert('Your browser is not supported');
            return false;
        }

        const uploader = document.createElement('input');
        uploader.type = 'file';
        uploader.style.display = 'none';

        // listen for files
        uploader.addEventListener('change', () => {
            const files = uploader.files;

            if (files.length) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    uploader.parentNode.removeChild(uploader);
                    localStorage.setItem(psTeamsStorageKey, reader.result);
                    location.reload();
                })
                reader.readAsText(files[0]);
            }
        })

        // trigger input
        document.body.appendChild(uploader);
        uploader.click();
    };


    const downloadButton = createButton('Download All Teams', downloadTeam);
    const uploadButton = createButton('Upload Local Teams', uploadTeam);
    document.body.appendChild(downloadButton);
    document.body.appendChild(uploadButton);
})();