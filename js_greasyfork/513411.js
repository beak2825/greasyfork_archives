// ==UserScript==
// @name         DF Competition Helper
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Assists in getting entries from a forum thread-based contest
// @author       Rebekah
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?topic=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/513411/DF%20Competition%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/513411/DF%20Competition%20Helper.meta.js
// ==/UserScript==

const debug = false;

(function() {
    'use strict';
    //#region Globals
        let currentThreadData = GM_getValue(document.location.href.split('?topic=')[1].split('.')[0], {idList:{}, lastPageChecked:'None'});
        let userSettings = GM_getValue('userSettings', {listMode:0})
    //#endregion

    //#region Page Modification
        function pageMod()
        {
            //#region Constants
                const mainSelect = document.body;
            //#endregion

            //#region Declarations
                let container;
                let p;
                let button;
                let select;
                let option;
            //#endregion

            //#region Initial
                document.getElementById('toolContainer') ? document.getElementById('toolContainer').remove() : null;
                document.getElementById('confirmationContainer') ? document.getElementById('confirmationContainer').remove() : null;
            //#endregion

            //#region Main
                debug ? console.log(Object.keys(currentThreadData.idList).length) : null;
                container = document.createElement('div');
                container.id = 'toolContainer';
                container.setAttribute('style', 'display:grid; grid-template-rows:auto auto auto auto; row-gap:5px; position:fixed; top:150px; right:10px; padding:10px; background-color:rgba(0,0,0,0.8); border:1px solid rgb(113,0,0);');
                p = document.createElement('p');
                p.setAttribute('style', 'justify-self:center; align-self:center;');
                p.innerText = `IDs in list: ${Object.keys(currentThreadData.idList).length}\nLast page checked: ${currentThreadData.lastPageChecked}`;
                container.appendChild(p);
                button = document.createElement('input');
                button.type = 'button';
                button.value = 'Get IDs';
                button.addEventListener('click', function()
                {
                    getIDs();
                });
                container.appendChild(button);
                p = document.createElement('p');
                p.setAttribute('style', 'margin:0');
                p.innerText = 'List Mode:';
                container.appendChild(p);
                select = document.createElement('select');
                option = document.createElement('option');
                option.innerText = 'IDs only';
                select.appendChild(option);
                option = document.createElement('option');
                option.innerText = 'Names only';
                select.appendChild(option);
                option = document.createElement('option');
                option.innerText = 'Name: ID pairs';
                select.appendChild(option);
                option = document.createElement('option');
                option.innerText = 'ID: Name pairs';
                select.appendChild(option);
                select.selectedIndex = userSettings.listMode;
                select.addEventListener('change', function()
                {
                    userSettings.listMode = this.selectedIndex;
                    GM_setValue('userSettings', userSettings);
                })
                container.appendChild(select)
                button = document.createElement('input');
                button.type = 'button';
                button.value = 'List Data';
                Object.keys(currentThreadData.idList).length < 1 ? button.disabled = true : null
                button.addEventListener('click', function()
                {
                    showIDList();
                });
                container.appendChild(button);
                button = document.createElement('input');
                button.type = 'button';
                button.value = 'Clear Data';
                Object.keys(currentThreadData.idList).length < 1 ? button.disabled = true : null
                button.addEventListener('click', function()
                {
                    showClearConfirm();
                });
                container.appendChild(button);
                mainSelect.appendChild(container);
            //#endregion
        };

        function showIDList()
        {
            //#region Constants
                const mainSelect = document.body;
            //#endregion

            //#region Declarations
                let background;
                let container;
                let p;
                let subContainer;
                let button;
            //#endregion

            //#region Initial
                document.getElementById('toolContainer') ? document.getElementById('toolContainer').remove() : null;
                document.getElementById('confirmationContainer') ? document.getElementById('confirmationContainer').remove() : null;
            //#endregion

            //#region Main
                background = document.createElement('div');
                background.id = 'confirmationContainer';
                background.setAttribute('style', 'position:fixed; width:100%; height:100%; top:0px; left:0px; background-color:rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index:20;');
                container = document.createElement('div');
                container.setAttribute('style', 'display:grid; position:fixed; grid-template-rows:auto auto auto; row-gap:5px; top: 50%; left: 50%; transform: translate(-50%, -50%); padding:10px; background-color:rgba(0,0,0,0.8); border:1px solid rgb(113,0,0);');
                p = document.createElement('p');
                p.setAttribute('style', 'justify-self:center; align-self:center; text-align:center;');
                p.innerText = 'Click the scrollbox to copy all data to clipboard.';
                container.appendChild(p);
                subContainer = document.createElement('div');
                subContainer.setAttribute('style', 'height:200px; padding:5px; border:1px solid rgb(113,0,0); overflow:auto;');
                for(let i = 0; i < Object.keys(currentThreadData.idList).length; i++)
                {
                    switch(userSettings.listMode)
                    {
                        case 0:
                            subContainer.innerHTML += currentThreadData.idList[Object.keys(currentThreadData.idList)[i]]
                            break;
                        case 1:
                            subContainer.innerHTML += Object.keys(currentThreadData.idList)[i]
                            break;
                        case 2:
                            subContainer.innerHTML += `${Object.keys(currentThreadData.idList)[i]}: ${currentThreadData.idList[Object.keys(currentThreadData.idList)[i]]}`
                            break;
                        case 3:
                            subContainer.innerHTML += `${currentThreadData.idList[Object.keys(currentThreadData.idList)[i]]}: ${Object.keys(currentThreadData.idList)[i]}`
                            break;
                    };
                    if(i !== Object.keys(currentThreadData.idList).length - 1)
                    {
                        subContainer.innerHTML += ',<br />';
                    };
                };
                subContainer.addEventListener('click', function()
                {
                    navigator.clipboard.writeText(this.innerText);
                    alert("IDs copied to clipboard");
                    pageMod();
                });
                container.appendChild(subContainer);
                button = document.createElement('input');
                button.type = 'button';
                button.setAttribute('style', 'justify-self:right');
                button.value = 'Close';
                button.addEventListener('click', function()
                {
                    pageMod();
                });
                container.appendChild(button)
                background.appendChild(container);
                mainSelect.appendChild(background)
            //#endregion
        };

        function showClearConfirm()
        {
            //#region Constants
                const mainSelect = document.body;
            //#endregion

            //#region Declarations
                let background;
                let container;
                let p;
                let subContainer
                let button;
            //#endregion

            //#region Initial
                document.getElementById('toolContainer') ? document.getElementById('toolContainer').remove() : null;
                document.getElementById('confirmationContainer') ? document.getElementById('confirmationContainer').remove() : null;
            //#endregion

            //#region Main
                background = document.createElement('div');
                background.id = 'confirmationContainer';
                background.setAttribute('style', 'position:fixed; width:100%; height:100%; top:0px; left:0px; background-color:rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index:20;');
                container = document.createElement('div');
                container.setAttribute('style', 'display:grid; position:fixed; grid-template-rows:auto auto; row-gap:5px; top: 50%; left: 50%; transform: translate(-50%, -50%); padding:10px; background-color:rgba(0,0,0,0.8); border:1px solid rgb(113,0,0);');
                p = document.createElement('p');
                p.setAttribute('style', 'justify-self:center; align-self:center; text-align:center;');
                p.innerText = 'This will clear all of the ID: Username pairs stored for this thread and cannot be undone.\n\nAre you sure you wish to proceed?';
                container.appendChild(p);
                subContainer = document.createElement('div');
                subContainer.setAttribute('style', 'display:grid; grid-template-columns:auto auto; column-gap:5px;');
                button = document.createElement('input');
                button.type = 'button';
                button.value = 'Confirm';
                button.addEventListener('click', function()
                {
                    clearIDs();
                    pageMod();
                });
                subContainer.appendChild(button);
                button = document.createElement('input');
                button.type = 'button';
                button.value = 'Cancel';
                button.addEventListener('click', function()
                {
                    pageMod();
                });
                subContainer.appendChild(button);
                container.appendChild(subContainer)
                background.appendChild(container);
                mainSelect.appendChild(background)
            //#endregion
        };
    //#endregion

    //#region Main Functions
        function getIDs()
        {
            const mainSelect = document.getElementsByClassName('forumline')[0].firstElementChild;
            debug ? console.log(mainSelect.children) : null
            for(let i = 0; i < mainSelect.children.length - 1; i++)
            {
                const secondarySelect = mainSelect.children[i].getElementsByTagName('tbody')[1].getElementsByTagName('a')[0];
                debug ? console.log(secondarySelect) : null;

                !currentThreadData.idList[secondarySelect.innerText] ? currentThreadData.idList[secondarySelect.innerText] = secondarySelect.href.split('profile;u=')[1] : null;
            };
            debug ? console.log(currentThreadData.idList) : null;

            if(mainSelect.children.length == 31)
            {
                document.getElementsByClassName('middletext')[0].getElementsByTagName('b')[0].innerText == '... ' ? currentThreadData.lastPageChecked = document.getElementsByClassName('middletext')[0].getElementsByTagName('b')[1].innerText : currentThreadData.lastPageChecked = document.getElementsByClassName('middletext')[0].getElementsByTagName('b')[0].innerText;
            };
            debug ? console.log(currentThreadData.lastPageChecked) : null;

            saveData();
            pageMod();
        };

        function clearIDs()
        {
            GM_deleteValue(document.location.href.split('?topic=')[1].split('.')[0]);
            currentThreadData = GM_getValue(document.location.href.split('?topic=')[1].split('.')[0], {idList:{}, lastPageChecked:'None'});
        };

        function saveData()
        {
            GM_setValue(document.location.href.split('?topic=')[1].split('.')[0], currentThreadData);
        };
    //#endregion

    pageMod();
})();