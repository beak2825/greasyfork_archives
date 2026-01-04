// ==UserScript==
// @name         DofusPlanet Quest Progress Saving
// @namespace    https://github.com/blackstar0169/dofusplanet-quest-saving
// @version      1.1
// @description  Save progress for DofusPlanet without account.
// @author       blackstar0169
// @match        https://dofusplanet.com/quetes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dofusplanet.com
// @license GNU GPLv3
// @grant  GM.setValue
// @grant  GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/467873/DofusPlanet%20Quest%20Progress%20Saving.user.js
// @updateURL https://update.greasyfork.org/scripts/467873/DofusPlanet%20Quest%20Progress%20Saving.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve checkboxes
    const checkboxeSelector = 'input[type="checkbox"][name^="quete"]';
    const checkboxes = document.querySelectorAll(checkboxeSelector);
    const scriptID = 'DPQPS_5ece4797eaf5e';

    console.log('['+scriptID+'] Init DofusPlanet Quest Progress Saving');

    function parseDatas(datas) {
        const defaultDatas = {
            quests: {}
        };
        if (typeof datas === 'string' && datas.charAt(0) === '{') {
            try {
                datas = JSON.parse(datas);
                datas = Object.assign(defaultDatas, datas);
            } catch (e) {
                datas = defaultDatas;
            }
        } else {
            datas = defaultDatas;
        }
        return datas;
    }

    function updateCheckboxes(datas) {
        // console.log('['+scriptID+'] updateCheckboxes');
        // console.log(datas);
        for (var i=0; i<checkboxes.length; i++) {
            var checked = false;
            const questId = checkboxes[i].name.replace('quete', '');

            for (var id in datas.quests) {
                if (datas.quests.hasOwnProperty(id) && id == questId) {
                    checked = datas.quests[id];
                    break;
                }
            }

            checkboxes[i].checked = checked;
        }
    }

    // Retrieve datas and update checkboxes
    setInterval(function () {
        GM.getValue(scriptID).then(function (datas) {
            updateCheckboxes(parseDatas(datas));
        });
    }, 3000);

    // Listen any modifications
    for (var i=0; i<checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function (e) {
            const questId = e.target.name.replace('quete', '');
            // console.log(e);
            //console.log('['+scriptID+'] Change '+questId);
            // Save modifications
            GM.getValue(scriptID).then(function (datas) {
                datas = parseDatas(datas);
                datas.quests[questId] = e.target.checked;
                GM.setValue(scriptID, JSON.stringify(datas));
            });
        });
    }


})();
