// ==UserScript==
// @name         Rebekah's Buddy List Utilities
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Provides the ability to sort friends using custom categories and trade with them directly.
// @author       Rebekah
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?*;sa=editBuddies
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/488708/Rebekah%27s%20Buddy%20List%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/488708/Rebekah%27s%20Buddy%20List%20Utilities.meta.js
// ==/UserScript==

const debug = false;

(function() {
    'use strict';
    //#region Globals
        //#region Selectors
            const title = document.getElementsByClassName('catbg3')[0];
        //#endregion

        //#region Site Data
            const userID = location.href.split(';u=')[1].split(';sa=')[0];
        //#endregion

        //#region Stored Data
            const accountArr = GM_getValue('accountArr', {});
            const characterArr = accountArr[userID] ? accountArr[userID] : {buddyArr:{}, colourDictionary:{0:'#FFFFFF'}, titleDictionary:{0:'No Group'}};
            let max = Object.keys(characterArr.colourDictionary).length - 1;
        //#endregion
    //#endregion

    //#region Aggregation
        function buddyAggregation()
        {
            const rows = document.querySelectorAll('.windowbg, .windowbg2');
            let comparisonArr = []

            for(let i = 3; i < (rows.length - 2); i++)
            {
                const current = rows[i].firstElementChild.firstElementChild.href.split(';u=')[1];
                comparisonArr.push(current);
                if(!characterArr.buddyArr[current] || !characterArr.colourDictionary[characterArr.buddyArr[current]])
                {
                    characterArr.buddyArr[current] = 0;
                };
            };

            for(let x in characterArr.buddyArr)
            {
                if(!comparisonArr.includes(x))
                {
                    delete characterArr.buddyArr[x];
                };
            };

            debug ? console.log('Buddy Array:', characterArr.buddyArr) : null;
            accountArr[userID] = characterArr;
            GM_setValue('accountArr', accountArr);
        };
    //#endregion

    //#region Page Modification
        function pageSetup()
        {
            //#region Constants
                const mainSelect = document.getElementsByClassName('smalltext')[1];
            //#endregion

            //#region Definitions
                let container;
                let subContainer;
                let header;
                let button;
                let label;
                let input;
                let select;
            //#endregion

            //#region Main
                //#region Initial
                    button = document.createElement('button');
                    button.innerText = 'Buddy Sort Settings';
                    button.addEventListener('click', () =>
                    {
                        document.getElementById('settingsMenu').style.display = 'grid';
                    });
                    mainSelect.appendChild(button);
                //#endregion

                //#region Settings Menu
                    //#region Main Container
                        container = document.createElement('div');
                        container.id = 'settingsMenu';
                        container.setAttribute('style', 'position:fixed; display:none; grid-template-columns:auto max-content auto; grid-template-rows:auto max-content auto; background-color:rgba(0,0,0,0.5); top:50%; left:50%; transform:translate(-50%,-50%); height:100%; width:100%; z-index:100;');

                        //#region Dialog Box
                            subContainer = document.createElement('div');
                            subContainer.setAttribute('style', 'display:grid; grid-template-columns:50% 50%; row-gap:10px; grid-column:2/3; grid-row:2/3; background-color:rgba(0,0,0,0.8); padding:5px 20px; border:2px solid maroon;');

                            //#region Dialog Header
                                header = document.createElement('h4');
                                header.innerHTML = 'Buddy Sort Settings';
                                header.setAttribute('style', 'grid-column:1/span 2; justify-self:center; margin:0;');
                                subContainer.appendChild(header);
                            //#endregion

                            //#region New Group
                                header = document.createElement('h5');
                                header.innerHTML = 'New Group';
                                header.setAttribute('style', 'grid-column:1/span 2; margin:0;');
                                subContainer.appendChild(header);
                                label = document.createElement('label');
                                label.innerHTML = 'Name:';
                                subContainer.appendChild(label);
                                input = document.createElement('input');
                                input.id = 'newName';
                                input.type = 'text';
                                subContainer.appendChild(input);
                                label = document.createElement('label');
                                label.innerHTML = 'Colour:';
                                subContainer.appendChild(label);
                                input = document.createElement('input');
                                input.id = 'newColour';
                                input.type = 'color';
                                subContainer.appendChild(input);
                                button = document.createElement('button');
                                button.title = 'Add the group, the new group will be at the top when sorted.';
                                button.innerHTML = 'Add';
                                button.setAttribute('style', 'grid-column:1/span 2;');
                                button.addEventListener('click', () =>
                                {
                                    settingsMenu('new');
                                });
                                subContainer.appendChild(button);
                            //#endregion

                            //#region Edit Group
                                header = document.createElement('h5');
                                header.innerHTML = 'Edit Group';
                                header.setAttribute('style', 'grid-column:1/span 2; margin:0');
                                subContainer.appendChild(header);
                                select = document.createElement('select');
                                select.id = 'editSelect';
                                select.title = 'First group.';
                                select.setAttribute('style', 'grid-column:1/span 2');
                                select.addEventListener('change', function() {
                                    document.getElementById('editName').disabled = false;
                                    document.getElementById('editName').value = characterArr.titleDictionary[this.options[this.selectedIndex].value];
                                    document.getElementById('editColour').disabled = false;
                                    document.getElementById('editColour').value = characterArr.colourDictionary[this.options[this.selectedIndex].value];
                                    document.getElementById('save').disabled = false;
                                    document.getElementById('remove').disabled = false;
                                    updateSelect('generateSub', parseInt(this.options[this.selectedIndex].value));
                                });
                                subContainer.appendChild(select);
                                label = document.createElement('label');
                                label.innerHTML = 'Name:';
                                subContainer.appendChild(label);
                                input = document.createElement('input');
                                input.id = 'editName';
                                input.type = 'text';
                                input.disabled = true;
                                subContainer.appendChild(input);
                                label = document.createElement('label');
                                label.innerHTML = 'Colour:';
                                subContainer.appendChild(label);
                                input = document.createElement('input');
                                input.id = 'editColour';
                                input.type = 'color';
                                input.disabled = true;
                                subContainer.appendChild(input);
                                button = document.createElement('button');
                                button.id = 'save';
                                button.title = 'Save the selected group, note that changes will be lost if you select another group without saving.';
                                button.innerHTML = 'Save';
                                button.disabled = true;
                                button.addEventListener('click', () =>
                                {
                                    const select = document.getElementById('editSelect');
                                    settingsMenu('edit', parseInt(select.options[select.selectedIndex].value));
                                });
                                subContainer.appendChild(button);
                                button = document.createElement('button');
                                button.id = 'remove';
                                button.title = 'Remove the selected group, this is irreversable';
                                button.innerHTML = 'Remove';
                                button.disabled = true;
                                button.addEventListener('click', () =>
                                {
                                    const select = document.getElementById('editSelect');
                                    settingsMenu('delete', parseInt(select.options[select.selectedIndex].value));
                                });
                                subContainer.appendChild(button);
                            //#endregion

                            //#region Move Group
                                header = document.createElement('h5');
                                header.innerHTML = 'Move Group';
                                header.setAttribute('style', 'grid-column:1/span 2; margin:0;');
                                subContainer.appendChild(header);
                                select = document.createElement('select');
                                select.id = 'moveSelect';
                                select.title = 'Second group';
                                select.setAttribute('style', 'grid-column:1/span 2;');
                                select.disabled = true;
                                select.addEventListener('change', () =>
                                {
                                    document.getElementById('move').disabled = false;
                                });
                                subContainer.appendChild(select);
                                button = document.createElement('button');
                                button.id = 'move';
                                button.title = 'Will place the first group after the second group. Keep in mind that the last group in the list is sorted highest, the first group in the list is sorted lowest.';
                                button.innerHTML = 'Move';
                                button.setAttribute('style', 'grid-column:1/span 2;');
                                button.disabled = true;
                                button.addEventListener('click', () => {
                                    const selectA = document.getElementById('editSelect');
                                    const selectB = document.getElementById('moveSelect');
                                    settingsMenu('move', parseInt(selectA.options[selectA.selectedIndex].value), parseInt(selectB.options[selectB.selectedIndex].value));
                                });
                                subContainer.appendChild(button);
                            //#endregion

                            //#region Close Button
                            button = document.createElement('button');
                            button.title = 'Close this dialog; this will reload the page.';
                            button.innerHTML = 'Close';
                            button.setAttribute('style', 'grid-column:1/span 2;');
                            button.addEventListener('click', () =>
                            {
                                location.reload();
                            });
                            subContainer.appendChild(button);
                            //#endregion
                        //#endregion

                        container.appendChild(subContainer);
                        document.body.appendChild(container);
                    //#endregion
                //#endregion
            //#endregion
        };

        function pageMod()
        {
            //#region Constants
                const rows = document.querySelectorAll('.windowbg, .windowbg2');
            //#endregion

            //#region Definitions
                let td;
                let button;
                let label;
                let a;
            //#endregion
            
            td = document.createElement('td');
            td.setAttribute('style', 'align:center;text-align:center;');
            button = document.createElement('button');
            button.innerText = 'Sort';
            button.addEventListener('click', () =>
            {
                sort();
            });
            td.appendChild(button);
            title.appendChild(td);
            td = document.createElement('td');
            td.setAttribute('style', 'align:center;text-align:center;');
            label = document.createElement('label');
            label.innerText = 'Trade';
            td.appendChild(label);
            title.appendChild(td);

            for(let i = 3; i < (rows.length - 2); i++)
            {
                const current = rows[i];
                const index = current.firstElementChild.firstElementChild.href.split(';u=')[1];

                td = document.createElement('td');
                td.setAttribute('style', 'align:center;text-align:center;');
                button = document.createElement('button');
                button.title = characterArr.titleDictionary[characterArr.buddyArr[index]];
                button.id = index;
                button.dataset.sort = characterArr.buddyArr[index];
                button.setAttribute('style', `border-radius:20px; background-color:${characterArr.colourDictionary[characterArr.buddyArr[index]]}; width:20px; height:20px;`);
                button.addEventListener('click', function(e)
                {
                    buttonManager(e, this);
                });
                td.appendChild(button);
                rows[i].appendChild(td);
                td = document.createElement('td');
                td.setAttribute('style', 'align:center;text-align:center;');
                a = document.createElement('a');
                a.href = `https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=27&memto=${index}`;
                a.innerText = '\u{1F6D2}';
                a.setAttribute('style', 'font-size:18px;');
                td.appendChild(a);
                rows[i].appendChild(td);
            };
            title.previousElementSibling.firstElementChild.colSpan = title.previousElementSibling.firstElementChild.colSpan + 1;
        };

        function settingsMenu(action, selectedA, selectedB)
        {
            switch(action)
            {
                case 'new':
                    characterArr.titleDictionary[max + 1] = document.getElementById('newName').value;
                    characterArr.colourDictionary[max + 1] = document.getElementById('newColour').value;
                    break;
                case 'edit':
                    characterArr.titleDictionary[selectedA] = document.getElementById('editName').value;
                    characterArr.colourDictionary[selectedA] = document.getElementById('editColour').value;
                    break;
                case 'delete':
                    delete characterArr.titleDictionary[selectedA];
                    delete characterArr.colourDictionary[selectedA];
                    for(let i = (selectedA + 1); i < (max + 1); i++)
                    {
                        Object.defineProperty(characterArr.titleDictionary, (i - 1), Object.getOwnPropertyDescriptor(characterArr.titleDictionary, i));
                        Object.defineProperty(characterArr.colourDictionary, (i - 1), Object.getOwnPropertyDescriptor(characterArr.colourDictionary, i));
                    };
                    break;
                case 'move':
                    const oldTitle = characterArr.titleDictionary[selectedA];
                    const oldColour = characterArr.colourDictionary[selectedA];
                    let oldArr = [];
                    delete characterArr.titleDictionary[selectedA];
                    delete characterArr.colourDictionary[selectedA];
                    for(let x in characterArr.buddyArr)
                    {
                        if(characterArr.buddyArr[x] === selectedA)
                        {
                            oldArr.push(x);
                        };
                    };
                    for(let i = (selectedA + 1); i <= selectedB; i++)
                    {
                        Object.defineProperty(characterArr.titleDictionary, (i - 1), Object.getOwnPropertyDescriptor(characterArr.titleDictionary, i));
                        Object.defineProperty(characterArr.colourDictionary, (i - 1), Object.getOwnPropertyDescriptor(characterArr.colourDictionary, i));
                        delete characterArr.colourDictionary[i];
                        for(let x in characterArr.buddyArr)
                        {
                            if(characterArr.buddyArr[x] === i)
                            {
                                characterArr.buddyArr[x] = (characterArr.buddyArr[x] - 1);
                            };
                        };
                    };
                    for(let x in oldArr)
                    {
                        characterArr.buddyArr[oldArr[x]] = selectedB;
                    };
                    characterArr.titleDictionary[selectedB] = oldTitle;
                    characterArr.colourDictionary[selectedB] = oldColour;
                    break;
            };
            if(action === 'new' || action === 'edit' || action === 'delete' || action === 'move')
            {
                action === 'new' || action === 'delete' ? max = Object.keys(characterArr.colourDictionary).length - 1 : null;
                accountArr[userID] = characterArr;
                GM_setValue('accountArr', accountArr);
                updateSelect('update');
            };
        };

        function updateSelect(action, selected)
        {
            //#region Constants
                const mainSelect = document.getElementById('editSelect');
                const subSelect = document.getElementById('moveSelect');
            //#endregion

            //#region Definitions
                let option;
                let optGroup;
            //#endregion

            //#region Main
                switch(action)
                {
                    case 'update':
                        subSelect.innerHTML = '';
                        subSelect.disabled = true;
                        document.getElementById('editName').disabled = true;
                        document.getElementById('editName').value = '';
                        document.getElementById('editColour').disabled = true;
                        document.getElementById('editColour').value = '#000000';
                        document.getElementById('save').disabled = true;
                        document.getElementById('remove').disabled = true;
                        document.getElementById('move').disabled = true;
                    case 'initial':
                        mainSelect.innerHTML = '';
                        option = document.createElement('option');
                        option.innerHTML = 'Please Select an Option';
                        option.disabled = true;
                        option.selected = true;
                        mainSelect.appendChild(option);
                        optGroup = document.createElement('optgroup');
                        mainSelect.appendChild(optGroup);
                        for(let x in characterArr.titleDictionary)
                        {
                            if(parseInt(x) !== 0)
                            {
                                option = document.createElement('option');
                                option.value = x;
                                option.innerHTML = characterArr.titleDictionary[x];
                                mainSelect.appendChild(option);
                            };
                        };
                        break;
                    case 'generateSub':
                        subSelect.innerHTML = '';
                        option = document.createElement('option');
                        option.innerHTML = 'Please Select an Option';
                        option.disabled = true;
                        option.selected = true;
                        subSelect.appendChild(option);
                        optGroup = document.createElement('optgroup');
                        subSelect.appendChild(optGroup);
                        for(let x in characterArr.titleDictionary)
                        {
                            if(parseInt(x) !== selected && parseInt(x) !== 0)
                            {
                                option = document.createElement('option');
                                option.value = x;
                                option.innerHTML = characterArr.titleDictionary[x];
                                subSelect.appendChild(option);
                            };
                        };
                        subSelect.disabled = false;
                        break;
                };
            //#endregion
        };
    //#endregion

    //#region Main Functions
        function buttonManager(e, elem)
        {
            if(e.ctrlKey || e.metaKey)
            {
                characterArr.buddyArr[elem.id] = 0;
            } else
            {
                if(characterArr.buddyArr[elem.id] === 0 || characterArr.buddyArr[elem.id] === max)
                {
                    characterArr.buddyArr[elem.id] = 1;
                } else
                {
                    characterArr.buddyArr[elem.id] = characterArr.buddyArr[elem.id] + 1;
                };
            };
            elem.title = characterArr.titleDictionary[characterArr.buddyArr[elem.id]];
            elem.dataset.sort = characterArr.buddyArr[elem.id];
            elem.style.backgroundColor = characterArr.colourDictionary[characterArr.buddyArr[elem.id]];
            accountArr[userID] = characterArr;
            GM_setValue('accountArr', accountArr);
        };

        function sort(rows, switching, i, x, x2, y, y2, shouldSwitch)
        {
            switching = true;
            while(switching)
            {
                switching = false;
                rows = document.querySelectorAll('.windowbg, .windowbg2');
                for(i = 3; i < (rows.length - 2); i++)
                {
                    shouldSwitch = false;
                    x = rows[i].lastElementChild.previousElementSibling.firstElementChild;
                    y = rows[i + 1].lastElementChild.previousElementSibling.firstElementChild;
                    if(x.dataset.sort < y.dataset.sort)
                    {
                        shouldSwitch = true;
                        break;
                    };
                };
                if(shouldSwitch)
                {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                };
            };
            switching = true;
            while(switching)
            {
                switching = false;
                rows = document.querySelectorAll('.windowbg, .windowbg2');
                for(i = (rows.length - 4); i < 3; i--)
                {
                    shouldSwitch = false;
                    x = rows[i].firstElementChild.firstElementChild;
                    x2 = rows[i].lastElementChild.previousElementSibling.firstElementChild;
                    y = rows[i - 1].firstElementChild.firstElementChild;
                    y2 = rows[i - 1].lastElementChild.previousElementSibling.firstElementChild;
                    if(x2.dataset.sort === y2.dataset.sort && x.innerHTML > y.innerHTML)
                    {
                        shouldSwitch = true;
                        break;
                    };
                };
                if(shouldSwitch)
                {
                    rows[i].parentNode.insertBefore(rows[i - 1], rows[i]);
                    switching = true;
                };
            };
            rows = document.querySelectorAll('.windowbg, .windowbg2');
            for(i = 3; i < (rows.length - 2); i++)
            {
                rows[i].classList.remove('windowbg', 'windowbg2');
                if(i % 2 === 0)
                {
                    rows[i].classList.add('windowbg2');
                } else
                {
                    rows[i].classList.add('windowbg');
                };
            };
        };
    //#endregion

    //#region Startup
        function startUp()
        {
            pageSetup();
            updateSelect('initial');
            buddyAggregation();
            pageMod();
            sort();
        };
        
        setTimeout(() => {
            startUp();
        }, 300);
    //#endregion
})();