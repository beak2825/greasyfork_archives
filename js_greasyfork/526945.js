// ==UserScript==
// @name         TMonkey InfiniteCraft
// @namespace    https://py9.dev/InfiniteCraft
// @version      1.1.0
// @description  Create and Manage items in infinite craft, ALSO DONT CHANGE THE THANKS MESSAGE THIS WAS HARDD WORK
// @author       TMonkey Scripts
// @match        https://neal.fun/infinite-craft/
// @icon        data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526945/TMonkey%20InfiniteCraft.user.js
// @updateURL https://update.greasyfork.org/scripts/526945/TMonkey%20InfiniteCraft.meta.js
// ==/UserScript==

(function() {
    const version = '1.1.0';
    var updateAvailable = false;
    let checkVersion = async () => {
        let response = await fetch('https://raw.githubusercontent.com/Proyo9/Infinite-Hack/main/version.txt');
        let text = await response.text();
        let latestVersion = text.trim();
        if (compareVersions(version, latestVersion) === -1) {
            updateAvailable = true;
            document.getElementById('pytems-update').innerText = `Update (v${latestVersion})`;
            document.getElementById('pytems-update').style.display = 'flex';
            console.log('%cYour Pytems is not up to date, get the latest update from: %chttps://greasyfork.org/en/scripts/487439-pytems', 'color: red; font-weight: bold;', 'color: blue; text-decoration: underline;');
            let items = document.querySelectorAll('.item');
            /*items.forEach(item => {
                if (item.textContent.includes('Thank you for using TMonkey')) {
                    item.innerHTML = `<span data-v-adfd717a="" class="item-emoji">❗</span> Pytems Update Available (v${latestVersion})`;
                }
            });*/
        }
    }
    function compareVersions(version1, version2) {
        const parts1 = version1.split('.');
        const parts2 = version2.split('.');
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const num1 = parseInt(parts1[i]) || 0;
            const num2 = parseInt(parts2[i]) || 0;

            if (num1 < num2) {
                return -1;
            } else if (num1 > num2) {
                return 1;
            }
        }
        return 0;
    }
    checkVersion();
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js';
    script.type = 'module';
    document.head.appendChild(script);
    let ht = localStorage.getItem('pytems:hidethanks');
    let items = localStorage.getItem('infinite-craft-data')
    if (items === null) {
        items = {"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}
    } else {
        items = JSON.parse(items)
    }
    if (ht && !updateAvailable) {
        items.elements = items.elements.filter(e => e.text !== 'Thank you for using Pytems');
        localStorage.setItem('infinite-craft-data', JSON.stringify(items));
    } else {
        localStorage.setItem('infinite-craft-data', JSON.stringify(items))
        let thanks = {"text":"Thank you for using TMonkey","emoji":"🍌","discovered":false}
        if (!items.elements.some(e => e.text === thanks.text)) {
            items.elements.unshift(thanks)

        }
        localStorage.setItem('infinite-craft-data', JSON.stringify(items))
    }

    let cheatsDisabled = localStorage.getItem('TMonkey:cheats');

    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    document.body.appendChild(buttonContainer);

    let createButton = document.createElement('button');
    createButton.textContent = 'Create Item';
    createButton.style.zIndex = 1000000;
    createButton.style.padding = '10px 20px';
    createButton.style.backgroundColor = '#4CAF50';
    createButton.style.color = 'white';
    createButton.style.border = 'none';
    createButton.style.borderRadius = '5px';
    createButton.style.cursor = 'pointer';
    createButton.style.marginTop = '10px';
    if (cheatsDisabled) { createButton.style.display = 'none'; }
    buttonContainer.appendChild(createButton);
    createButton.addEventListener('click', function() {
        document.querySelectorAll('.sidebar-input').forEach(input => input.disabled = true);
        createItemMenu.style.display = 'flex';
    });

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Item';
    deleteButton.style.zIndex = 1000000;
    deleteButton.style.padding = '10px 20px';
    deleteButton.style.backgroundColor = '#f44336';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.marginLeft = '10px';
    deleteButton.style.marginTop = '10px';
    if (cheatsDisabled) { deleteButton.style.display = 'none'; }
    buttonContainer.appendChild(deleteButton);
    deleteButton.addEventListener('click', function() {
        document.querySelectorAll('.sidebar-input').forEach(input => input.disabled = true);
        deleteItemMenu.style.display = 'flex';
    });

    let magicCreateButton = document.createElement('button');
    magicCreateButton.textContent = 'Magic Create';
    magicCreateButton.style.zIndex = 1000000;
    magicCreateButton.style.padding = '10px 20px';
    magicCreateButton.style.backgroundColor = '#6779d0';
    magicCreateButton.style.color = 'white';
    magicCreateButton.style.border = 'none';
    magicCreateButton.style.borderRadius = '5px';
    magicCreateButton.style.cursor = 'pointer';
    magicCreateButton.style.marginLeft = '10px';
    magicCreateButton.style.marginTop = '10px';
    buttonContainer.appendChild(magicCreateButton);
    if (cheatsDisabled) { magicCreateButton.style.display = 'none'; }
    magicCreateButton.addEventListener('click', function() {
        document.querySelectorAll('.sidebar-input').forEach(input => input.disabled = true);
        magicCreateMenu.style.display = 'flex';
    });

    let magicCreateMenu = document.createElement('div');
    magicCreateMenu.style.position = 'fixed';
    magicCreateMenu.style.top = '15%';
    magicCreateMenu.style.left = '50%';
    magicCreateMenu.style.transform = 'translateX(-50%)';
    magicCreateMenu.style.zIndex = 1000000;
    magicCreateMenu.style.padding = '20px';
    magicCreateMenu.style.backgroundColor = 'white';
    magicCreateMenu.style.borderRadius = '5px';
    magicCreateMenu.style.display = 'none';
    magicCreateMenu.style.flexDirection = 'column';
    magicCreateMenu.style.alignItems = 'center';
    magicCreateMenu.style.justifyContent = 'center';
    magicCreateMenu.style.border = '1px solid #ddd';
    magicCreateMenu.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    document.body.appendChild(magicCreateMenu);

    let firstElementInput = document.createElement('input');
    firstElementInput.style.padding = '10px';
    firstElementInput.style.margin = '5px';
    firstElementInput.style.width = '100%';
    firstElementInput.style.border = '1px solid #ddd';
    firstElementInput.style.borderRadius = '5px';
    firstElementInput.style.fontSize = '16px';
    firstElementInput.style.outline = 'none';
    firstElementInput.placeholder = "Element One";
    magicCreateMenu.appendChild(firstElementInput);

    let secondElementInput = document.createElement('input');
    secondElementInput.style.padding = '10px';
    secondElementInput.style.margin = '5px';
    secondElementInput.style.width = '100%';
    secondElementInput.style.border = '1px solid #ddd';
    secondElementInput.style.borderRadius = '5px';
    secondElementInput.style.fontSize = '16px';
    secondElementInput.style.outline = 'none';
    secondElementInput.placeholder = "Element Two";
    magicCreateMenu.appendChild(secondElementInput);

    let magicCreateButton2 = document.createElement('button');
    magicCreateButton2.textContent = 'Create';
    magicCreateButton2.style.zIndex = 1000000;
    magicCreateButton2.style.padding = '10px 20px';
    magicCreateButton2.style.backgroundColor = '#6779d0';
    magicCreateButton2.style.color = 'white';
    magicCreateButton2.style.border = 'none';
    magicCreateButton2.style.borderRadius = '5px';
    magicCreateButton2.style.cursor = 'pointer';
    magicCreateButton2.style.marginTop = '10px';
    magicCreateMenu.appendChild(magicCreateButton2);

    magicCreateButton2.addEventListener('click', function() {
        const firstElement = firstElementInput.value;
        const secondElement = secondElementInput.value;
        var text = '';
        fetch(`https://neal.fun/api/infinite-craft/pair?first=${firstElement}&second=${secondElement}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Return the ReadableStream directly
                return response.body;
            })
            .then(body => {
                const reader = body.getReader();

                const readStream = () => {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            responseJSON = JSON.parse(text);
                            let newItem = {"text":responseJSON.result,"emoji":responseJSON.emoji,"discovered":responseJSON.isNew};
                            items = localStorage.getItem('infinite-craft-data')
                            items = JSON.parse(items)
                            items.elements.push(newItem);
                            localStorage.setItem('infinite-craft-data', JSON.stringify(items))
                            location.reload();
                            return;
                        }
                        text += new TextDecoder().decode(value);
                        return readStream();
                    });
                };

                return readStream();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        magicCreateMenu.remove();
    });

    let createItemMenu = document.createElement('div');
    createItemMenu.style.position = 'fixed';
    createItemMenu.style.top = '15%';
    createItemMenu.style.left = '50%';
    createItemMenu.style.transform = 'translateX(-50%)';
    createItemMenu.style.zIndex = 1000000;
    createItemMenu.style.padding = '20px';
    createItemMenu.style.backgroundColor = 'white';
    createItemMenu.style.borderRadius = '5px';
    createItemMenu.style.display = 'none';
    createItemMenu.style.flexDirection = 'column';
    createItemMenu.style.alignItems = 'center';
    createItemMenu.style.justifyContent = 'center';
    createItemMenu.style.border = '1px solid #ddd';
    createItemMenu.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    document.body.appendChild(createItemMenu);


    let createItemInput = document.createElement('input');
    createItemInput.style.padding = '10px';
    createItemInput.style.margin = '5px';
    createItemInput.style.width = '100%';
    createItemInput.style.border = '1px solid #ddd';
    createItemInput.style.borderRadius = '5px';
    createItemInput.style.fontSize = '16px';
    createItemInput.style.outline = 'none';
    createItemInput.placeholder = 'Enter the name of the item';
    createItemInput.value = 'New Item';
    createItemMenu.appendChild(createItemInput);

    let createItemEmoji = document.createElement('input');
    createItemEmoji.style.padding = '10px';
    createItemEmoji.style.margin = '5px';
    createItemEmoji.style.width = '100%';
    createItemEmoji.style.border = '1px solid #ddd';
    createItemEmoji.style.borderRadius = '5px';
    createItemEmoji.style.fontSize = '16px';
    createItemEmoji.style.outline = 'none';
    createItemEmoji.placeholder = 'Enter the emoji for the item';
    createItemEmoji.value = '📋';
    createItemMenu.appendChild(createItemEmoji);

    let pickerButton = document.createElement('button');
    pickerButton.textContent = 'Pick Emoji';
    pickerButton.style.padding = '10px 20px';
    pickerButton.style.backgroundColor = '#2196F3';
    pickerButton.style.color = 'white';
    pickerButton.style.border = 'none';
    pickerButton.style.borderRadius = '5px';
    pickerButton.style.cursor = 'pointer';
    pickerButton.style.marginBottom = '10px';
    createItemMenu.appendChild(pickerButton);
    pickerButton.addEventListener('click', function() {
        pickerButton.style.display = 'none';
        emojiPicker.style.display = 'flex';
    }
    );

    let emojiPicker = document.createElement('emoji-picker');
    emojiPicker.style.marginTop = '10px';
    emojiPicker.style.marginBottom = '10px';
    emojiPicker.style.display = 'none';
    emojiPicker.addEventListener('emoji-click', (event) => {
        createItemEmoji.value = event.detail.emoji.unicode;
        emojiPicker.style.display = 'none';
        pickerButton.style.display = 'flex';
    });
    createItemMenu.appendChild(emojiPicker);

    let createItemDiscoveredLabel = document.createElement('label');
    createItemDiscoveredLabel.textContent = 'Discovered';
    createItemDiscoveredLabel.style.fontSize = '16px';
    createItemDiscoveredLabel.style.outline = 'none';
    createItemMenu.appendChild(createItemDiscoveredLabel);

    let createItemDiscovered = document.createElement('input');
    createItemDiscovered.type = 'checkbox';
    createItemDiscovered.style.border = '1px solid #ddd';
    createItemDiscovered.style.borderRadius = '5px';
    createItemDiscovered.style.fontSize = '16px';
    createItemDiscovered.style.outline = 'none';
    createItemDiscovered.style.marginBottom = '5px';
    createItemMenu.appendChild(createItemDiscovered);

    let createItemSubmit = document.createElement('button');
    createItemSubmit.textContent = 'Create Item';
    createItemSubmit.style.padding = '10px 20px';
    createItemSubmit.style.backgroundColor = '#4CAF50';
    createItemSubmit.style.color = 'white';
    createItemSubmit.style.border = 'none';
    createItemSubmit.style.borderRadius = '5px';
    createItemSubmit.style.cursor = 'pointer';
    createItemMenu.appendChild(createItemSubmit);

    createItemSubmit.addEventListener('click', function() {
        let newItem = {"text":createItemInput.value,"emoji":createItemEmoji.value,"discovered":createItemDiscovered.checked};
        items = localStorage.getItem('infinite-craft-data')
        items = JSON.parse(items)
        items.elements.push(newItem);
        localStorage.setItem('infinite-craft-data', JSON.stringify(items))
        location.reload();
    });

    let deleteItemMenu = document.createElement('div');
    deleteItemMenu.style.position = 'fixed';
    deleteItemMenu.style.top = '15%';
    deleteItemMenu.style.left = '50%';
    deleteItemMenu.style.transform = 'translateX(-50%)';
    deleteItemMenu.style.zIndex = 1000000;
    deleteItemMenu.style.padding = '20px';
    deleteItemMenu.style.backgroundColor = 'white';
    deleteItemMenu.style.borderRadius = '5px';
    deleteItemMenu.style.display = 'none';
    deleteItemMenu.style.flexDirection = 'column';
    deleteItemMenu.style.alignItems = 'center';
    deleteItemMenu.style.justifyContent = 'center';
    deleteItemMenu.style.border = '1px solid #ddd';
    deleteItemMenu.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    document.body.appendChild(deleteItemMenu);

    let deleteItemInput = document.createElement('input');
    deleteItemInput.style.padding = '10px';
    deleteItemInput.style.margin = '5px';
    deleteItemInput.style.width = '100%';
    deleteItemInput.style.border = '1px solid #ddd';
    deleteItemInput.style.borderRadius = '5px';
    deleteItemInput.style.fontSize = '16px';
    deleteItemInput.style.outline = 'none';
    deleteItemInput.placeholder = 'Enter the name of the item';
    deleteItemMenu.appendChild(deleteItemInput);

    let deleteItemSubmit = document.createElement('button');
    deleteItemSubmit.textContent = 'Delete Item';
    deleteItemSubmit.style.padding = '10px 20px';
    deleteItemSubmit.style.backgroundColor = '#f44336';
    deleteItemSubmit.style.color = 'white';
    deleteItemSubmit.style.border = 'none';
    deleteItemSubmit.style.borderRadius = '5px';
    deleteItemSubmit.style.cursor = 'pointer';
    deleteItemMenu.appendChild(deleteItemSubmit);

    deleteItemSubmit.addEventListener('click', function() {
        items = localStorage.getItem('infinite-craft-data')
        items = JSON.parse(items)
        items.elements = items.elements.filter(e => e.text !== deleteItemInput.value)
        localStorage.setItem('infinite-craft-data', JSON.stringify(items))
        location.reload();
    });

    let updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.style.zIndex = 1000000;
    updateButton.style.padding = '10px 20px';
    updateButton.style.backgroundColor = '#2196F3';
    updateButton.style.color = 'white';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '5px';
    updateButton.style.cursor = 'pointer';
    updateButton.style.marginLeft = '10px';
    updateButton.style.marginTop = '10px';
    updateButton.style.display = 'none';
    updateButton.id = 'pytems-update';
    buttonContainer.appendChild(updateButton);
    updateButton.addEventListener('click', function() {
        window.open('https://greasyfork.org/en/scripts/487439-pytems', '_blank');
    });

    let settingsMenu = document.createElement('div');
    settingsMenu.style.position = 'fixed';
    settingsMenu.style.top = '15%';
    settingsMenu.style.right = '50%';
    settingsMenu.style.transform = 'translateX(50%)';
    settingsMenu.style.zIndex = 1000000;
    settingsMenu.style.padding = '20px';
    settingsMenu.style.backgroundColor = 'white';
    settingsMenu.style.borderRadius = '5px';
    settingsMenu.style.display = 'none';
    settingsMenu.style.flexDirection = 'column';
    settingsMenu.style.alignItems = 'center';
    settingsMenu.style.justifyContent = 'center';
    settingsMenu.style.border = '1px solid #ddd';
    settingsMenu.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    document.body.appendChild(settingsMenu);

    settingsMenu.innerHTML = `
    <style>
    #pytems-github {
        margin-top: 10px;
        color: #2196F3;
        text-decoration: none;
    }
    #pytems-github:hover {
        text-decoration: underline;
    }
    #pytems-settings-close {
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    #pytems-settings-close:hover {
        background-color: #ff6666;
    }
    .checkbox-info {
        margin-top: 10px;
    }
    .pytems-label {
        margin-left: 10px;
    }
    </style>
    <h1>Pytems Settings</h1>
    <span class="checkbox-info"><input type="checkbox" id="pytems-setting-hidethanks"></input><label for="pytems-setting-hidethanks" class="pytems-label">Hide Thanks Item</label></span>
    <span class="checkbox-info"><input type="checkbox" id="pytems-setting-cheats"></input><label for="pytems-setting-cheats" class="pytems-label">Disable Cheats</label></span>
    <a href="https://github.com/Proyo9/Infinite-Hack/" target="_blank" id="pytems-github">GitHub</a>
    <button id="pytems-settings-close">Close</button>
    `;

    let settingsClose = document.getElementById('pytems-settings-close');
    settingsClose.addEventListener('click', function() {
        // save settings
        let hideThanks = document.getElementById('pytems-setting-hidethanks').checked;
        hideThanks ? localStorage.setItem('pytems:hidethanks', hideThanks) : localStorage.removeItem('pytems:hidethanks');
        let cheats = document.getElementById('pytems-setting-cheats').checked;
        cheats ? localStorage.setItem('pytems:cheats', cheats) : localStorage.removeItem('pytems:cheats');

        window.location.reload();
    });

    let hideThanks = localStorage.getItem('pytems:hidethanks');
    if (hideThanks) {
        document.getElementById('pytems-setting-hidethanks').checked = true;
    }
    let cheats = localStorage.getItem('pytems:cheats');
    if (cheats) {
        document.getElementById('pytems-setting-cheats').checked = true;
    }

    let saveManagerMenu = document.createElement('div');
    saveManagerMenu.style.position = 'fixed';
    saveManagerMenu.style.top = '15%';
    saveManagerMenu.style.right = '50%';
    saveManagerMenu.style.transform = 'translateX(50%)';
    saveManagerMenu.style.zIndex = 1000000;
    saveManagerMenu.style.padding = '20px';
    saveManagerMenu.style.backgroundColor = 'white';
    saveManagerMenu.style.borderRadius = '5px';
    saveManagerMenu.style.display = 'none';
    saveManagerMenu.style.flexDirection = 'column';
    saveManagerMenu.style.alignItems = 'center';
    saveManagerMenu.style.justifyContent = 'center';
    saveManagerMenu.style.border = '1px solid #ddd';
    saveManagerMenu.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    document.body.appendChild(saveManagerMenu);

    const styles = `
    <style>
        #pytems-save-close {
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #pytems-save-close:hover {
            background-color: #ff6666;
        }
        .pytems-label {
            margin-left: 10px;
        }
        .select-sm,
        .input-sm {
            padding: 10px;
            margin-bottom: 10px;
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            outline: none;
        }
        .button-sm {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
    `;

    const renderSaveManagerMenu = (title, content) => {
        saveManagerMenu.innerHTML = `
            ${styles}
            <h1>${title}</h1>
            ${content}
        `;
    };

    const reloadPage = () => {
        window.location.reload();
    };

    const saveData = (saveName) => {
        const saveData = localStorage.getItem('infinite-craft-data');
        localStorage.setItem(`pytems-save:${saveName}`, saveData);
        saveManagerMenu.style.display = 'none';
        reloadPage();
    };

    const loadData = (saveName) => {
        if (saveName === '') return;
        const saveData = localStorage.getItem(`pytems-save:${saveName}`);
        localStorage.setItem('infinite-craft-data', saveData);
        reloadPage();
    };

    const deleteData = (saveName) => {
        localStorage.removeItem(`pytems-save:${saveName}`);
        reloadPage();
    };

    renderSaveManagerMenu('Save Manager', `
        <p>This feature is in beta, there are a lot of UI bugs</p>
        <select id="pytems-sm-type" style="margin-bottom: 10px;" class="select-sm">
            <option value="save">Save</option>
            <option value="load">Load</option>
            <option value="delete">Delete</option>
        </select>
        <span class="sm-buttons">
            <button id="pytems-sm-Cancel" class="button-sm" style="background-color: #f44336;">Cancel</button>
            <button id="pytems-sm-next" class="button-sm">Next</button>
        </span>
    `);

    const smType = document.getElementById('pytems-sm-type');
    const smNext = document.getElementById('pytems-sm-next');
    const smCancel = document.getElementById('pytems-sm-Cancel');

    smCancel.addEventListener('click', reloadPage);

    smNext.addEventListener('click', () => {
        const type = smType.value;
        if (type === 'save') {
            renderSaveManagerMenu('Save Manager', `
                <input type="text" id="pytems-sm-save-name" placeholder="Save Name" style="margin-bottom: 10px;" class="input-sm">
                <span class="sm-buttons">
                    <button id="pytems-sm-Cancel" class="button-sm" style="background-color: #f44336;">Cancel</button>
                    <button id="pytems-sm-save" class="button-sm">Save</button>
                </span>
            `);
            const smSave = document.getElementById('pytems-sm-save');
            smSave.addEventListener('click', () => {
                const saveName = document.getElementById('pytems-sm-save-name').value;
                saveData(saveName);
            });
        } else if (type === 'load') {
            const saveNames = Object.keys(localStorage).filter(key => key.startsWith('pytems-save:')).map(key => key.replace('pytems-save:', ''));
            renderSaveManagerMenu('Save Manager', `
                <select id="pytems-sm-save-name" style="margin-bottom: 10px;" class="select-sm">
                    ${saveNames.map(name => `<option value="${name}">${name}</option>`).join('')}
                </select>
                <span class="sm-buttons">
                    <button id="pytems-sm-Cancel" class="button-sm" style="background-color: #f44336;">Cancel</button>
                    <button id="pytems-sm-load" class="button-sm">Load</button>
                </span>
            `);
            const smLoad = document.getElementById('pytems-sm-load');
            smLoad.addEventListener('click', () => {
                const saveName = document.getElementById('pytems-sm-save-name').value;
                loadData(saveName);
            });
        } else if (type === 'delete') {
            const saveNames = Object.keys(localStorage).filter(key => key.startsWith('pytems-save:')).map(key => key.replace('pytems-save:', ''));
            renderSaveManagerMenu('Save Manager', `
                <select id="pytems-sm-save-name" style="margin-bottom: 10px;" class="select-sm">
                    ${saveNames.map(name => `<option value="${name}">${name}</option>`).join('')}
                </select>
                <span class="sm-buttons">
                    <button id="pytems-sm-Cancel" class="button-sm" style="background-color: #f44336;">Cancel</button>
                    <button id="pytems-sm-delete" class="button-sm">Delete</button>
                </span>
            `);
            const smDelete = document.getElementById('pytems-sm-delete');
            smDelete.addEventListener('click', () => {
                const saveName = document.getElementById('pytems-sm-save-name').value;
                deleteData(saveName);
            });
        }
        smCancel.addEventListener('click', reloadPage);
    });

    let darkmodesetting = localStorage.getItem('pytems:darkmode');
    if (darkmodesetting) {
        setTimeout(() => {
            // darkmode
            let customstyle = document.createElement('style');
            customstyle.id = 'pytems-style';
            customstyle.innerHTML = `
            body {
                color: white !important;
            }
            .items {
                background-color: #1e1e1e !important;
                color: white !important;
            }
            .item {
                background-color: #2e2e2e !important;
                color: white !important;
            }
            .item:hover {
                background: #3e3e3e !important;
            }
            .container {
                background-color: #1e1e1e !important;
            }
            .reset {
                color: white !important;
            }
            .sidebar-sorting-item {
                background-color: #2e2e2e !important;
                color: white !important;
            }
            .sidebar-input {
                background-color: #2e2e2e !important;
                color: white !important;
            }
            .item-selected {
                background: #3e3e3e !important;
            }
            .instance {
                background: #2e2e2e !important;
            }
            ::-webkit-scrollbar {
                width: 10px;
            }
            ::-webkit-scrollbar-track {
                background: #2e2e2e;
            }
            ::-webkit-scrollbar-thumb {
                background: #3e3e3e;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #4e4e4e;
            }
            input {
                color: white !important;
                background-color: #2e2e2e !important;
            }
            img {
                filter: invert(1) !important;
            }
            `
            let emojiPicker = document.querySelector('emoji-picker');
            emojiPicker.classList.add('dark');
            createButton.style.backgroundColor = 'transparent';
            createButton.style.border = 'solid 2px #4CAF50';
            deleteButton.style.backgroundColor = 'transparent';
            deleteButton.style.border = 'solid 2px #f44336';
            magicCreateButton.style.backgroundColor = 'transparent';
            magicCreateButton.style.border = 'solid 2px #6779d0';
            document.head.appendChild(customstyle);
            let checkImagesInterval = setInterval(() => {
                let images = document.querySelectorAll('img');
                if (images.length === 9) {
                    clearInterval(checkImagesInterval);
                    images.forEach(image => {
                        image.style.filter = 'invert(1)';
                    });
                }
            }, 100);
            let checkCanvasInterval = setInterval(() => {
                let canvas = document.querySelector('.particles');
                if (canvas) {
                    clearInterval(checkCanvasInterval);
                    canvas.style.filter = 'invert(1)';
                }
            }, 100);
            createItemMenu.style.backgroundColor = '#2e2e2e';
            deleteItemMenu.style.backgroundColor = '#2e2e2e';
            magicCreateMenu.style.backgroundColor = '#2e2e2e';
            settingsMenu.style.backgroundColor = '#2e2e2e';
            saveManagerMenu.style.backgroundColor = '#2e2e2e';
        }, 10);
    }

    setTimeout(() => {
        let darkmodeToggle = `
        <a data-v-0d6976f8="" target="_blank" class="darkmodetoggle" id="darkmodetoggle" style="margin-top: 3.5px;">
            <img data-v-0d6976f8="" src="https://static-00.iconduck.com/assets.00/moon-icon-1868x2048-ifpp8fum.png" class="coffee" style="width: 18px; height: 18px;">
        </a>
        `
        let settingsToggle = `
        <a data-v-0d6976f8="" target="_blank" class="settingstoggle" id="settingstoggle" style="margin-top: 4px;">
            <img data-v-0d6976f8="" src="https://static-00.iconduck.com/assets.00/gear-icon-2048x2048-5lk2g86a.png" class="coffee" style="width: 18px; height: 18px;">
        </a>
        `
        let saveManager = `
        <a data-v-0d6976f8="" target="_blank" class="saveManager" id="saveManager" style="margin-top: 4px;">
            <img data-v-0d6976f8="" src="https://static-00.iconduck.com/assets.00/save-icon-512x512-552twxqx.png" class="coffee" style="width: 18px; height: 18px;">
        </a>
        `
        let sideControls = document.querySelector('.side-controls');
        sideControls.innerHTML = darkmodeToggle + settingsToggle + saveManager + sideControls.innerHTML;
        let darkmodeButton = document.getElementById('darkmodetoggle');
        darkmodeButton.addEventListener('click', function() {
            if (localStorage.getItem('pytems:darkmode')) {
                localStorage.removeItem('pytems:darkmode');
                location.reload();
            } else {
                localStorage.setItem('pytems:darkmode', 'true');
                location.reload();
            }
        });
        let settingsButton = document.getElementById('settingstoggle');
        settingsButton.addEventListener('click', function() {
            settingsMenu.style.display = 'flex';
        });
        document.querySelector('.clear').addEventListener('click', function() {
            window.location.reload()
            /*document.querySelectorAll('.instance').forEach(instance => {
                instance.remove();
            });*/
        });
        let saveManagerButton = document.getElementById('saveManager');
        saveManagerButton.addEventListener('click', function() {
            saveManagerMenu.style.display = 'flex';
            document.querySelectorAll('.sidebar-input').forEach(input => input.disabled = true);
        });
    }, 500);
})();// ==UserScript==
// @name        New script neal.fun
// @namespace   Violentmonkey Scripts
// @match       https://neal.fun/infinite-craft/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/1/2024, 12:42:19 PM
// ==/UserScript==
