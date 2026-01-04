// ==UserScript==
// @name        Internet Roadtrip Keybinds
// @namespace   http://tampermonkey.net/
// @version     1.6
// @description Adds keybinds to Internet Roadtrip
// @author      LoG42
// @license     MIT
// @grant       GM.addStyle
// @grant       GM.info
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @match       https://neal.fun/internet-roadtrip/
// @run-at      document-start
// @icon        https://files.catbox.moe/o5iu1d.png
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @require     https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/542090/Internet%20Roadtrip%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/542090/Internet%20Roadtrip%20Keybinds.meta.js
// ==/UserScript==

// type hints
// import IRF from 'internet-roadtrip-framework';
// import _ from 'lodash';

(async () => { 
    if (!IRF.isInternetRoadtrip) return;

    const optionsBody = await IRF.dom.options;
    const chatVDOM = await IRF.vdom.chat;
    const containerVDOM = await IRF.vdom.container;
    const mapVDOM = await IRF.vdom.map;
    const optionsVDOM = await IRF.vdom.options;
    const radioVDOM = await IRF.vdom.radio;
    const wheelVDOM = await IRF.vdom.wheel;

    let optionsStyle = document.createElement('style');
    optionsStyle.textContent = `
    .option-number {
        top: -2vh;
        font-size: 6vh;
        -webkit-text-stroke: 0.2px white;
        position: relative;
        text-align: center;
        font-family: "Roboto", sans-serif;
    }
    `
    optionsBody.appendChild(optionsStyle);

    let aisvApi;
    const waitForAisvApi = new Promise((resolve) => {
        if (unsafeWindow._AISV) {
            resolve(unsafeWindow._AISV);
        } else {
            let aisvApi = unsafeWindow._AISV;
            Object.defineProperty(unsafeWindow, '_AISV', {
                get() {
                    return aisvApi;
                },
                set(newAisvApi) {
                    aisvApi = newAisvApi;
                    resolve(aisvApi);
                    return aisvApi;
                },
                configurable: true,
                enumerable: true,
            });
        }
    });
    waitForAisvApi.then((newAisvApi) => {
        aisvApi = newAisvApi;
    });

    class OptionChoices {
        /**
         * 
         * @param {HTMLCollectionOf<Element>} options 
         */
        constructor(options, showNumbers) {
            // sort options
            this.options = _.sortBy(options,function (option) {return getRotation(option);});
            for (let i = 0; i < this.options.length; i++) {
                let item = this.options[i];
                // am lazy
                let optionKey = i+1;
                
                if (!showNumbers) {
                    if (item.querySelector('.option-number')) {
                        item.querySelector('.option-number').remove();
                    }
                } else {
                    // does the NUMBERS
                    if (item.querySelector('.option-number')) {
                        item.querySelector('.option-number').textContent = optionKey;
                    } else {
                        // makes the NUMBERS
                        let optionNumber = document.createElement('h1');
                        optionNumber.classList.add('option-number');
                        optionNumber.textContent = optionKey;
                        item.insertBefore(optionNumber,item.firstChild);
                    }
                }
            }
        }

        //lazy
        get firstOption() {
            if (this.options[0]) {
                return this.options[0];
            }
            return null;
        }

        get middleOption() {
            let middle = _.minBy(this.options,function(option) {return Math.abs(getRotation(option));})
            if (middle) {
                return middle;
            }
            return null;
        }

        get lastOption() {
            if (this.options.at(-1)) {
                return this.options.at(-1);
            }
            return null;
        }
        /**
         * 
         * @param {Number} n 
         */
        getNthElement(n) {
            if (!Number.isInteger(n)) {
                return null;
            }
            if (n >= 0) {
                if (this.options[n]) {
                    return this.options[n];
                }
            } else {
                if (this.options[this.options.length+n]) {
                    return this.options[this.options.length+n];
                }
            }
            return null;
        }
    }
    
    const defaultKeybinds = {
        option0: '1',
        option1: '2',
        option2: '3',
        option3: '4',
        option4: '5',
        option5: '6',
        option6: '7',
        option7: '8',
        option8: '9',
        option9: '0',
        option10: '-',
        option11: '=',
        typeOptionNum: 'f',
        forward: 'w',
        left: 'a',
        right: 'd',
        pathfinder: 'q',
        seek: 's',
        forwardAISV: 'i',
        leftAISV: 'j',
        rightAISV: 'l',
        seekAISV: 'k',
        honk: ' ',
        radioPower: 'r',
        radioVolDown: ',',
        radioVolUp: '.',
        mapExpand: 'e',
        toggleChat: 't',
        openDiscord: '~',
        bandwagon: '?'
    };

    const keybindNames = {
        option0: 'Option 1',
        option1: 'Option 2',
        option2: 'Option 3',
        option3: 'Option 4',
        option4: 'Option 5',
        option5: 'Option 6',
        option6: 'Option 7',
        option7: 'Option 8',
        option8: 'Option 9',
        option9: 'Option 10',
        option10: 'Option 11',
        option11: 'Option 12',
        typeOptionNum: 'Type Option Number',
        forward: 'Forwardmost Option',
        left: 'Leftmost Option',
        right: 'Rightmost Option',
        pathfinder: 'Pathfinder Option',
        seek: 'Seek',
        forwardAISV: 'Forwardmost Option (AISV)',
        leftAISV: 'Leftmost Option (AISV)',
        rightAISV: 'Rightmost Option (AISV)',
        seekAISV: 'Seek (AISV)',
        honk: 'Honk',
        radioPower: 'Power On/Off Radio',
        radioVolDown: 'Radio Volume Down',
        radioVolUp: 'Radio Volume Up',
        mapExpand: 'Expand/Contract Map',
        toggleChat: 'Open/Close Chat Window',
        openDiscord: 'Open Discord Server',
        bandwagon: 'Bandwagon'
    };
    /**
     * @type {Object.<string,HTMLInputElement>} keybindInputStorage
     */
    let keybindInputStorage = {}
    /**
     * @type {Object.<string,string>} settings
     */
    let settings = {}
    let optionSelection = await getNewOptionChoices();

    for (const option in defaultKeybinds) {
        if (Object.hasOwnProperty.call(defaultKeybinds, option)) {
            settings[option] = await GM.getValue(option,defaultKeybinds[option]);
        }
    }

    const originalUpdateData = containerVDOM.methods.updateData;
    containerVDOM.state.updateData = new Proxy(originalUpdateData, {
        apply: async (target,thisArgs,args) => {
            optionSelection = await getNewOptionChoices();
            return Reflect.apply(target, thisArgs, args);
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.target !== document.body) {
            return;
        }

        handler(e);
    });

    waitForAisvApi.then((aisvApi) => {
        aisvApi.messenger.addEventListener('keyDown', (event) => {
            handler(event.args,true);
        });
    });

    async function getNewOptionChoices() {
        let options = optionsBody.getElementsByClassName('option');
        return new OptionChoices(options, await GM.getValue('showNumbers',true));
    }

    /** 
     * 
     * @param {String} key 
     * @param {boolean} aisv
     */

    function handler({key},aisv=false) {
        if(!aisv) {
            switch (key) {
                case settings.seek:
                    radioVDOM.methods.seek();
                    return;
                default:
                    break;
            }
        }

        switch (key) {
            case settings.radioPower:
                radioVDOM.methods.togglePower();
                break;
            case settings.seekAISV:
                radioVDOM.methods.seek();
                break;
            case settings.honk:
                wheelVDOM.methods.onHonkClick();
                break;
            case settings.mapExpand:
                mapVDOM.methods.toggleExpand();
                break;
            case settings.radioVolDown:
                volSetter(radioVDOM.data.volume - 5);
                break;
            case settings.radioVolUp:
                volSetter(radioVDOM.data.volume + 5);
                break;
            case settings.bandwagon:
                bandwagon();
                break;
            case settings.toggleChat:
                chatVDOM.methods.toggleChat();
                break;
            case settings.openDiscord:
                chatVDOM.methods.openDiscord();
                break;
            default:
                if (aisv) {
                    chooseOption(key,true);
                } else {
                    chooseOption(key);
                }
        }
    }

    function volSetter(wantedVol) {
        const newVol = Math.min(Math.max(wantedVol, 0),100);
        const rotation = (27/10*newVol-135)*(Math.PI/180);
        radioVDOM.methods.updateVolumeFromAngle(-Math.PI/2 + rotation);
    }

    /**
     * 
     * @param {String} key 
     * @returns 
     */
    function chooseOption(key, aisv=false) {
        const optionSelect = [
            'option0',
            'option1',
            'option2',
            'option3',
            'option4',
            'option5',
            'option6',
            'option7',
            'option8',
            'option9',
            'option10',
            'option11'
        ];

        // og code
        // if (optionSelect.hasOwnProperty(e.code)){
        //     if (optionsSorted[optionSelect[e.code]]) {
        //         optionsSorted[optionSelect[e.code]].click();
        //         return;
        //     }
        // }

        for (let i = 0; i < optionSelect.length; i++) {
            const element = optionSelect[i];    
            if (settings[element] === key) {
                let option = optionSelection.getNthElement(i);
                if (option) {
                    option.click();
                    return;
                }
            }
        }
        function pickFirst() {
            if (optionSelection.firstOption) {
                optionSelection.firstOption.click();
            }
        }

        function pickLast() {
            if (optionSelection.lastOption) {
                optionSelection.lastOption.click();
            }
        }

        function pickForward() {
            let middle = optionSelection.middleOption;
            if (middle) {
                middle.click();
            }
        }

        if(!aisv) {
            switch (key) {
                case settings.left:
                    pickFirst();
                    return;
                case settings.right:
                    pickLast();
                    return;
                case settings.forward:
                    pickForward();
                    return;
                default:
                    break;
            }
        }
        switch (key) {
            case settings.leftAISV:
                pickFirst();
                break;
            case settings.rightAISV:
                pickLast();
                break;
            case settings.forwardAISV:
                pickForward();
                break;
            case settings.pathfinder: {
                let pathfinder = optionsBody.querySelector('.pathfinder-chosen-option');
                if (pathfinder) {
                    pathfinder.click();
                }
            }
                break;
            case settings.typeOptionNum: {
                let optionNum = Number(prompt('Type in the option number you would like to click (1-indexed, from left).\nUse negative numbers to selected an option from right.\nType during the same stop to prevent unexpected behavior.'));

                if (isNaN(optionNum) || !Number.isInteger(optionNum) || optionNum === 0) {
                    alert('Not a valid option number!');
                    break;
                }
                let optionChosen = optionNum < 0 ? optionSelection.getNthElement(optionNum) : optionSelection.getNthElement(optionNum-1);
                if (optionChosen) {
                    optionChosen.click();
                    break;
                } else {
                    alert('Option doesn\'t exist!')
                }
            }
            default:
                break;
        }
    }

    function getRotation(elem){
        if (elem.style.rotate) {
            const re = new RegExp('.*(?=deg)')
            return parseFloat(elem.style.rotate.match(re)[0]);
        }
        return null;
    }

    function bandwagon() {
        const curVotes = containerVDOM.data.voteCounts;
        const popOption = parseInt(_.maxBy(Object.keys(curVotes), (o) => curVotes[o]));
        try {
            switch (popOption) {
                case -2:
                    wheelVDOM.methods.onHonkClick();
                    break;
                case -1:
                    radioVDOM.methods.seek();
                default:
                    optionsVDOM.methods.vote(popOption);
                    break;
            }
            console.log(`Joined the bandwagon for option ${popOption}.`);
        } catch (error) {
            console.log("Couldn't bandwagon.");
        }
    }

    const tab = await IRF.ui.panel.createTabFor(GM.info, {
        tabName: 'Keybinds',
        className: 'keybinds-tab'
    });

    const tabStyle = document.createElement('style');
    tabStyle.textContent = `
    .keybinds-tab .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    
        input[type=text], button {
            padding: 0.35rem 1rem;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 999px;
            background: transparent;
            color: rgb(255, 255, 255);
            font-size: 0.9rem;
            font-family: inherit;
            transition: 0.2s;
            white-space: nowrap;
        }
    
        input[type=text]:hover, button:hover {
            background: rgba(68, 68, 170, 0.1);
        }
    
        input[type=text]:focus, button:active {
            border: 1px solid rgb(68, 68, 170);
            background: rgb(68, 68, 170);
        }
    
        input[type=text].conflict {
            color:red;
        }
    }
    `

    const numberShower = async function(){
        optionSelection = await getNewOptionChoices();
    }

    tab.container.appendChild(tabStyle);
    await create_checkbox('Show numbers', 'showNumbers', numberShower);
    tab.container.appendChild(document.createElement('hr'));
    let instructionsRow = document.createElement('div');
    instructionsRow.classList.add('row');
    let instructionsLabel = document.createElement('ul');
    instructionsLabel.innerHTML = '<li>Set keybinds by clicking on their button and then typing the keybind</li><li>Reset keybinds by double clicking on their button</li><li>Reset All button at the bottom</li><li>Type Escape on a keybind button to unbind keybinds</li><li>Conflicts are marked in red text</li><li>The text on the button after you type in the keybind may be different from what you typed. This is due to keyboard differences. The keybind should still be what you typed.</li>';
    instructionsRow.appendChild(instructionsLabel);
    tab.container.appendChild(instructionsRow);
    
    tab.container.appendChild(document.createElement('hr'));
    for (const key in keybindNames) {
        if (Object.hasOwnProperty.call(keybindNames, key)) {
            let keybindRow = document.createElement('div');
            keybindRow.classList.add('row');
        
            let labelName = document.createElement('label');
            labelName.textContent = keybindNames[key];
        
            let keybindInput = document.createElement('input')
            keybindInput.type = 'text';
            keybindInput.readOnly = true;
            keybindInput.value = settings[key];
            keybindInput.addEventListener('keydown', async function(e){
                await updateKeybind(keybindInput,key,e);
            });

            keybindInput.addEventListener('dblclick', async function(){
                await resetKeybind(keybindInput,key);
            });
            
            tab.container.appendChild(keybindRow);
            keybindRow.appendChild(labelName);
            keybindRow.appendChild(keybindInput);
            keybindInputStorage[key] = keybindInput;
        }
    }
    checkForConflicts();
    let resetRow = document.createElement('div');
    resetRow.classList.add('row');
    let resetAllButton = document.createElement('button');
    resetAllButton.textContent = 'Reset All'
    resetAllButton.addEventListener('click', async function() {
        if(confirm('Are you sure you want to reset all keybinds? THIS IS IRREVERSIBLE!')) {
            await resetAll();
        }
    })

    resetRow.appendChild(resetAllButton);
    tab.container.appendChild(resetRow);

    async function create_checkbox(label, gmKey, action) {
        let checkboxRow = document.createElement('div');
        checkboxRow.classList.add('row');
    
        let labelName = document.createElement('label');
        labelName.textContent = label;

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = await GM.getValue(gmKey,true);
        checkbox.className = IRF.ui.panel.styles.toggle;
    
        checkbox.addEventListener('change', async (e) => {
            let checked = e.target.checked;
            await GM.setValue(gmKey, checked);
            await action();
        });

        
        tab.container.appendChild(checkboxRow);
        checkboxRow.appendChild(labelName);
        checkboxRow.appendChild(checkbox);
    }

    /**
     * 
     * @param {HTMLInputElement} keybindInput 
     * @param {string} key 
     * @param {KeyboardEvent} e 
     */
    async function updateKeybind(keybindInput,key,e) {
        if (e.code === 'Escape') {
            settings[key] = 'Not Bound';
            await GM.setValue(key,settings[key])
            keybindInput.value = settings[key];
            checkForConflicts();
            return;
        }

        settings[key] = e.key;
        await GM.setValue(key,settings[key])
        keybindInput.value = settings[key];
        checkForConflicts();
    }

    /**
     * 
     * @param {HTMLInputElement} keybindInput 
     * @param {string} key 
     */
    async function resetKeybind(keybindInput,key) {
        await GM.deleteValue(key);
        const ogSetting = defaultKeybinds[key];
        settings[key] = ogSetting;
        keybindInput.value = ogSetting;
        checkForConflicts();
    }

    async function resetAll() {
        for (const key in keybindInputStorage) {
            if (Object.hasOwnProperty.call(keybindInputStorage, key)) {
                const keybindInput = keybindInputStorage[key];
                await resetKeybind(keybindInput,key)
            }
        }
    }

    function checkForConflicts() {
        /**
         * @type {Map<string,HTMLInputElement>} conflictMap
         */
        let conflictMap = new Map()

        for (const key in keybindInputStorage) {
            if (Object.hasOwnProperty.call(keybindInputStorage, key)) {
                const keybindInput = keybindInputStorage[key];
                keybindInput.classList.remove('conflict');
                if (keybindInput.value === 'Not Bound') {
                    continue;
                }
                if (conflictMap.has(keybindInput.value)) {
                    keybindInput.classList.add('conflict')
                    conflictMap.get(keybindInput.value).classList.add('conflict')
                } else {
                    conflictMap.set(keybindInput.value,keybindInput);
                }
            }
        }
    }
})();