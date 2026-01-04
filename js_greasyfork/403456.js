// ==UserScript==
// @name         Rpoint Revives Tracking Script
// @namespace
// @version      1.1.3
// @description  Creates a form to retrieve revive data on the homepage
// @author       Rpoint [2314746]
// @match        https://www.torn.com/index.php
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/563780
// @downloadURL https://update.greasyfork.org/scripts/403456/Rpoint%20Revives%20Tracking%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/403456/Rpoint%20Revives%20Tracking%20Script.meta.js
// ==/UserScript==
'use strict';

if(document.getElementById('column0')){
    insertReviveDiv();
    loadUserData();
}




function insertReviveDiv() {

    let reviveDiv = `<div class="sortable-box t-blue-cont h" id="revives">
        <div class="title main-title title-black active top-round" role="table">
            <div class="arrow-wrap">
                <a href="#/" role="button" class="accordion-header-arrow right" aria-label="Close revives panel"
                    tabindex="0"></a>
            </div>
            <h5 class="box-title">Revives</h5>
        </div>
        <div class="bottom-round">
            <div class="cont-gray bottom-round">
                <ul class="info-cont-wrap">
                    <li tabindex="0" role="row" aria-label="User id">
                        <span class="divider">
                            <span>User id</span>
                        </span>
                        <input type='text' id="revive-user-id" />
                    </li>
                    <li tabindex="0" role="row" aria-label="API Key">
                        <span class="divider">
                            <span>API Key</span>
                        </span>
                        <input type='password' id="revive-api-key" />
                    </li>
                    <li tabindex="0" role="row" aria-label="buttons">
                        <span class="divider" style="text-align: center;">
                            <button id="save-user-data-button">Save User Data</button>
                        </span>
                        <span class="desc" style="text-align: center;">
                            <button id="load-revives-button">Load Revives</button>
                        </span>
                    </li>
                </ul>
                <hr/>
                <ul class="info-cont-wrap" id="revive-content">

                </ul>
            </div>
        </div>
    </div>`;

    const mainContent = document.getElementById('column0').innerHTML;
    reviveDiv += mainContent;
    document.getElementById('column0').innerHTML = reviveDiv;

    const saveButton = document.getElementById('save-user-data-button');
    const loadButton = document.getElementById('load-revives-button');


    saveButton.addEventListener('click', function () {
        saveUserData()
    });

    loadButton.addEventListener('click', function () {
        loadRevives()
    });

}

async function loadUserData() {
    const userId = await GM.getValue('userId', null);
    const key = await GM.getValue('key', null);
    if (userId) document.getElementById('revive-user-id').value = userId;
    if (key) document.getElementById('revive-api-key').value = key;
}

async function saveUserData() {
    const userId = document.getElementById('revive-user-id').value;
    const key = document.getElementById('revive-api-key').value;
    if (userId) await GM.setValue('userId', userId);
    if (key) await GM.setValue('key', key);
}

function loadRevives() {
    const userId = document.getElementById('revive-user-id').value;
    const key = document.getElementById('revive-api-key').value;

    let url = `https://api.torn.com/user/${userId}?selections=revives&key=${key}`
    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
            const revivesData = JSON.parse(response.responseText);
            if(revivesData.error){
                loadError(JSON.stringify(revivesData.error));
                return;
            }
            loadRevivesTable(revivesData.revives);
        },
        onerror: function (error) {
            loadError(error);
        }
    })

}

function loadRevivesTable(revivesData) {
    const navigationButtons = `<li tabindex="0" role="row" aria-label="navigation-buttons">
            <span class="divider" style="text-align: center;">
                <button id="load-previous-revives">Previous</button>
            </span>
            <span class="desc" style="text-align: center;">
                <button id="load-next-revives">Next</button>
            </span>
        </li>`;
    const reviveArray = [];
    Object.keys(revivesData).forEach(revive => {
        const time = new Date(revivesData[revive].timestamp * 1000);
        const name = revivesData[revive].target_name + '[' + revivesData[revive].target_id + ']';
        const readableTime = String(time.getDate()).padStart(2, '0') + '/' + String(time.getMonth()).padStart(2, '0') + '/' + time.getFullYear()
            + ' ' + String(time.getHours()).padStart(2, '0') + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0');
        reviveArray.unshift({name: name, time: readableTime});
    })
    let revivesContent = '';
    reviveArray.forEach((revive, index) => {
        if(index % 10 == 0){
            revivesContent += `<div style="${index/10 == 0 ? 'display:block;' : 'display:none;'}" class="revives">`
        }
        revivesContent +=
            `<li tabindex="0" role="row" aria-label="revive-${revive.name}">
                <span class="divider">
                    <span>${revive.name}</span>
                </span>
                <span class="desc">
                    <span>${revive.time}</span>
                </span>
            </li>`;
        if(index % 10 == 9 || index == reviveArray.length - 1){
            revivesContent += `</div>`
        }
    })
    revivesContent += navigationButtons;

    document.getElementById('revive-content').innerHTML = revivesContent;
    const previousButton = document.getElementById('load-previous-revives');
    const nextButton = document.getElementById('load-next-revives');

    previousButton.addEventListener('click', function () {
        let index = -1;
        const revivesLength = document.getElementsByClassName('revives').length;
        for(let i = 0; i < revivesLength; i++){
            if(document.getElementsByClassName('revives')[i].style.display == 'block'){
                index = i - 1;
                break;
            }
        }
        if(index < 0){
            return;
        } else {
            document.getElementsByClassName('revives')[index+1].style.display = 'none';
            document.getElementsByClassName('revives')[index].style.display = 'block';
        }
    });

    nextButton.addEventListener('click', function () {
        let index = -1;
        const revivesLength = document.getElementsByClassName('revives').length;
        for(let i = 0; i < revivesLength; i++){
            if(document.getElementsByClassName('revives')[i].style.display == 'block'){
                index = i + 1;
                break;
            }
        }
        if(index > revivesLength - 1){
            return;
        } else {
            document.getElementsByClassName('revives')[index-1].style.display = 'none';
            document.getElementsByClassName('revives')[index].style.display = 'block';
        }
    });
}

function loadError(error) {
    const errorDiv = `<li tabindex="0" role="row" aria-label="errors">
            <span class="divider" style="text-align: center;">
                <span>Error</span>
            </span>
            <span class="desc" style="text-align: center;">
                <span>${error}</span>
            </span>
        </li>`;
    document.getElementById('revive-content').innerHTML = errorDiv;
}