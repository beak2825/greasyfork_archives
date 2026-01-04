// ==UserScript==
// @name         InfiniteCraft Pytems++
// @namespace    https://py9.dev/
// @version      1.4.0
// @description  Improved UI & Script for Infinite Craft Itemdata Editor
// @author       GavinGoGaming/Py9
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493022/InfiniteCraft%20Pytems%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/493022/InfiniteCraft%20Pytems%2B%2B.meta.js
// ==/UserScript==

// Stylus built in.

(function() {
    document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.3.0/css/all.css"/>');

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
                if (item.textContent.includes('Thank you for using Pytems')) {
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
    let scripts = [{"script":"https://code.jquery.com/ui/1.11.4/jquery-ui.js","type":"text/javascript"},
                   {"script":"https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js","type":"module"},
                   {"script":"https://code.jquery.com/jquery-3.6.0.min.js","type":"text/javascript"},
                  {"script":"","type":"text/javascript"}];
    scripts.forEach((scr) => {
        let script = document.createElement('script');
        script.src = scr.script;
        script.type = scr.type;
        document.head.appendChild(script);
    });

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
        let thanks = {"text":"Thank you for using Pytems","emoji":"🍉","discovered":false}
        if (!items.elements.some(e => e.text === thanks.text)) {
            items.elements.unshift(thanks)
        }
        localStorage.setItem('infinite-craft-data', JSON.stringify(items))
    }

    let pytemsBox = document.body;
    if (!('getEventListeners' in window)) {
        getEventListeners = function(el) {
            let _ev,
                _evs = Object.assign({}, (el._events || {}));
            for (let ev in el) {
                if (/^on/.test(ev) && (typeof(el[ev]) === 'function') && (_ev = ev.slice(2))) {
                    if (!_evs[_ev])
                        _evs[_ev] = [];
                    _evs[_ev].push({
                        listener: el[ev],
                        useCapture: false,
                        passive: false,
                        once: false,
                        type: _ev
                    });
                }
            }
            return _evs;
        }
        EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype._removeEventListener = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.addEventListener = function(a, b, c) {
            if (c == undefined)
                c = false;
            if (c && c.once) {
                let _b = b;
                b = function() {
                    this.removeEventListener(a, b, false, true);
                    _b.apply(this, arguments);
                };
            }
            this._addEventListener(a, b, c);
            if (!this._events) {
                this._events = {};
                Object.defineProperty(this, '_events', { enumerable: false });
            }
            if (!this._events[a])
                this._events[a] = [];
            this._events[a].push({
                listener: b,
                useCapture: (((c === true) || (c.capture)) || false),
                passive: ((c && c.passive) || false),
                once: ((c && c.once) || false),
                type: a
            });
        }
        EventTarget.prototype.removeEventListener = function(a, b, c, s) {
            if (c == undefined)
                c = false;
            if (!s)
                this._removeEventListener(a, b, c);
            if (this._events && this._events[a]) {
                for (var i=0; i<this._events[a].length; ++i) {
                    if ((this._events[a][i].listener == b) && (this._events[a][i].useCapture == c)) {
                        this._events[a].splice(i, 1);
                        break;
                    }
                }
                if (this._events[a].length == 0)
                    delete this._events[a];
            }
        }
    }

    let cheatsDisabled = localStorage.getItem('pytems:cheats');
 
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    pytemsBox.appendChild(buttonContainer);
 
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
        
        createItemMenu.style.display = 'flex';
    });

    let createIcon = document.createElement('i');
    createIcon.className = "fa-light fa-layer-plus";
    createIcon.style.fontSize = "20px";
    createIcon.style.marginRight = "5px";
    createButton.insertAdjacentElement('afterbegin', createIcon);
 
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
        
        deleteItemMenu.style.display = 'flex';
    });

    let deleteIcon = document.createElement('i');
    deleteIcon.className = "fa-light fa-trash-can-xmark";
    deleteIcon.style.fontSize = "20px";
    deleteIcon.style.marginRight = "5px";
    deleteButton.insertAdjacentElement('afterbegin', deleteIcon);

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
        
        magicCreateMenu.style.display = 'flex';
    });

    let magicCreateIcon = document.createElement('i');
    magicCreateIcon.className = "fa-light fa-merge";
    magicCreateIcon.style.fontSize = "20px";
    magicCreateIcon.style.marginRight = "5px";
    magicCreateButton.insertAdjacentElement('afterbegin', magicCreateIcon);

    let cleanUpButton = document.createElement('button');
    cleanUpButton.textContent = 'Clean Up';
    cleanUpButton.style.zIndex = 1000000;
    cleanUpButton.style.padding = '10px 20px';
    cleanUpButton.style.backgroundColor = '#6779d0';
    cleanUpButton.style.color = 'white';
    cleanUpButton.style.border = 'none';
    cleanUpButton.style.borderRadius = '5px';
    cleanUpButton.style.cursor = 'pointer';
    cleanUpButton.style.marginLeft = '10px';
    cleanUpButton.style.marginTop = '10px';
    cleanUpButton.style.display = 'flex';
    cleanUpButton.style.alignItems = 'center';
    cleanUpButton.style.justifyContent = 'center';
    buttonContainer.appendChild(cleanUpButton);

    let cleanUpSvg = document.createElement('i');
    cleanUpSvg.className = "fa-light fa-broom-wide";
    cleanUpSvg.style.fontSize = "23px";
    cleanUpSvg.style.marginRight = "5px";
    cleanUpButton.insertAdjacentElement('afterbegin', cleanUpSvg);

    if (cheatsDisabled) { cleanUpButton.style.display = 'none'; }
    cleanUpButton.addEventListener('click', function() {
        items = localStorage.getItem('infinite-craft-data')
        items = JSON.parse(items)
        items.elements = items.elements.filter(e => e.text !== "Nothing")
        localStorage.setItem('infinite-craft-data', JSON.stringify(items))
        location.reload();
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
    pytemsBox.appendChild(magicCreateMenu);

    /*jQuery(magicCreateMenu).draggable({
                containment: "parent",
                axis: 'xy',
                delay: 1000
            });*/


    let magiceCreateClose = document.createElement('button');
    magiceCreateClose.textContent = 'X';
    magiceCreateClose.style.position='absolute';
    magiceCreateClose.style.top='2px';
    magiceCreateClose.style.right='2px';
    magicCreateMenu.appendChild(magiceCreateClose);

    magiceCreateClose.addEventListener('click', function() {
        magicCreateMenu.style.display = 'none';
    });

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
    pytemsBox.appendChild(createItemMenu);

 
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

    let createItemClose = document.createElement('button');
    createItemClose.textContent = 'X';
    createItemClose.style.position='absolute';
    createItemClose.style.top='2px';
    createItemClose.style.right='2px';
    createItemMenu.appendChild(createItemClose);

    createItemClose.addEventListener('click', function() {
        createItemMenu.style.display = 'none';
    });
 
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
    pytemsBox.appendChild(deleteItemMenu);

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

    let deleteItemClose = document.createElement('button');
    deleteItemClose.textContent = 'X';
    deleteItemClose.style.position='absolute';
    deleteItemClose.style.top='2px';
    deleteItemClose.style.right='2px';
    deleteItemMenu.appendChild(deleteItemClose);

    deleteItemClose.addEventListener('click', function() {
        deleteItemMenu.style.display = 'none';
    });
 
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
    pytemsBox.appendChild(settingsMenu);

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
    <h3>OG: Py9, Mod: GavinGoGaming</h3>
    <span class="checkbox-info"><input type="checkbox" id="pytems-setting-hidethanks"></input><label for="pytems-setting-hidethanks" class="pytems-label">Hide Thanks Item</label></span>
    <span class="checkbox-info"><input type="checkbox" id="pytems-setting-cheats"></input><label for="pytems-setting-cheats" class="pytems-label">Disable Cheats</label></span>
    <a href="https://github.com/Proyo9/Infinite-Hack/" target="_blank" id="pytems-github">Oringinal Project</a>
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
    pytemsBox.appendChild(saveManagerMenu);

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
    // Override styles. Copy of PytemsUI made for Pytems++ originally, now built in
    var style = document.createElement('style');
    style.innerHTML = `body>div[style="display: flex; justify-content: center;"] {
    display: flex;
    width: 150px;
    flex-direction: column;
    margin-top: 60px;
    user-select: none;
}
body>div[style="display: flex; justify-content: center;"] button {
    margin-left: 15px !important;
    background-color: #11111110 !important;
    text-transform: lowercase;
    color: #040404 !important;
    font-family: Roboto,sans-serif;
    text-align: center;
    font-size: 16px;
    height: 40px;
    padding: 8px 5px !important;
    transition: all 0.2s;
    user-select: none;
}
body>div[style="display: flex; justify-content: center;"] button:hover {
    font-size: 18px;
    background-color: #11111120 !important;
}
body>div[style="display: flex; justify-content: center;"] button:nth-of-type(3) {
    font-size: 0;
}
body>div[style="display: flex; justify-content: center;"] button:nth-of-type(3):hover:after {
    font-size: 18px;
}
body>div[style="display: flex; justify-content: center;"] button:nth-of-type(3):after {
    transition: all 0.2s;
    user-select: none;
    font-size: 16px;
    content: "merge any";
}
a[href='/']:after {
    content: "admin mode";
    user-select: none;
    font-family: Consolas;
    text-decoration: none !important;
    border: none !important;
    color: black;
    position: absolute;
    top: 40px;
    left: 13px;
    width: 100px;
}`;
    document.body.appendChild(style);

    setTimeout(() => {
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
        sideControls.innerHTML = settingsToggle + saveManager + sideControls.innerHTML;
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
        });
        function removeAllEventListeners(selector = '*', eTypeArray = ['*']) {
            switch (selector.toLowerCase()) {
                case 'window':
                    removeListenersFromElem(window);
                    break;
                case 'document':
                    removeListenersFromElem(document);
                    break;
                case '*':
                    removeListenersFromElem(window);
                    removeListenersFromElem(document);
                    break;
                default:
                    document.querySelectorAll(selector).forEach(removeListenersFromElem);
            }
            function removeListenersFromElem(elem) {
                let eListeners = getEventListeners(elem);
                let eTypes = Object.keys(eListeners);
                for (let eType of inBoth(eTypes, eTypeArray)) {
                    eListeners[eType].forEach((eListener)=>{
                        let options = {};
                        inBoth(Object.keys(eListener), ['capture', 'once', 'passive', 'signal'])
                            .forEach((key)=>{ options[key] = eListener[key] });
                        elem.removeEventListener(eType, eListener.listener, eListener.useCapture);
                        elem.removeEventListener(eType, eListener.listener, options);
                    });
                }
            }

            function inBoth(arrA, arrB) {
                var setB = new Set(arrB);
                if (setB.has('*')) {
                    return arrA;
                } else {
                    return arrA.filter(a => setB.has(a));
                }
            }
        }

        removeAllEventListeners('*',['keydown']);
    }, 500);
})();