// ==UserScript==
// @name         [AO3] Kat's Tweaks: Settings Manager
// @author       Katstrel
// @description  Controls the storage and modification of various settings for all Kat's Tweaks scripts.
// @version      1.2.0
// @history      1.2.0 - added settings for Tag Colors module
// @history      1.1.0 - added settings for Bookmarking module
// @namespace    https://github.com/Katstrel/Kats-Tweaks-and-Skins
// @include      https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @require      https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.5.2/jscolor.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527145/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Settings%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/527145/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Settings%20Manager.meta.js
// ==/UserScript==
"use strict";
let DEBUG = true;

/*
    This userscript is to be used in conjuntion with the other scripts I've released.
    Set all scripts to update automatically and they should be good to go!
    Do NOT edit settings here, edit them in the header bar on AO3
*/

let LOADED_SETTINGS = {};
let DEFAULT_SETTINGS = {
    debugMode: false,
    reversi: false,
    readTime: {
        enabled: true,
        wordsPerMinute: 200,
        levels: [
            {
                id: "Level_0",
                name: "Level_0",
                mins: 0,
                color: '#80ff8080',
            },
            {
                id: "Level_1",
                name: "Level_1",
                mins: 60,
                color: '#ffff8080',
            },
            {
                id: "Level_2",
                name: "Level_2",
                mins: 180,
                color: '#ff808080',
            },
            {
                id: "Level_3",
                name: "24 Hours",
                mins: 1440,
                color: '#ff80ff80',
            },
        ],
    },
    bookmarking: {
        enabled: true,
        dateFormat: "Month/Year",
        defaultNote: "No Notes",
        details: "Tracking",
        includeFandom: false,
        newBookmarksPrivate: true,
        newBookmarksRec: false,
        hideDefaultToreadBtn: true,
        showUpdatedBookmarks: true,
        databaseInfo: [
            {
                keyID: "Bookmarked",
                tagLabel: "Bookmarked",
                enabled: true,
            },
            {
                keyID: "Checked",
                tagLabel: "Checked",
                enabled: true,
            },
            {
                keyID: "Commented",
                tagLabel: "Commented",
                enabled: false,
            },
            {
                keyID: "Kudosed",
                tagLabel: "Kudosed",
                enabled: false,
            },
            {
                keyID: "Series",
                tagLabel: "Series",
                enabled: true,
            },
            {
                keyID: "Subscribed",
                tagLabel: "Subscribed",
                enabled: false,
            },
        ],
        databaseTags: [
            {
                keyID: "toread",
                tagLabel: "To Read",
                posLabel: "📚 Mark as To Read",
                negLabel: "🧹 Remove from To Read",
                btnHeader: true,
                btnFooter: false,
            },
            {
                keyID: "awaitupdate",
                tagLabel: "Awaiting Update",
                posLabel: "📖 Add to Awaiting Update",
                negLabel: "📕 Remove from Awaiting Update",
                btnHeader: false,
                btnFooter: true,
            },
            {
                keyID: "finished",
                tagLabel: "Finished Reading",
                posLabel: "✔️ Mark as Finished",
                negLabel: "🗑️ Remove from Finished",
                btnHeader: false,
                btnFooter: true,
            },
            {
                keyID: "favorite",
                tagLabel: "Favorite",
                posLabel: "❤️ Add to Favorites",
                negLabel: "💔 Remove from Favorites",
                btnHeader: true,
                btnFooter: true,
            },
        ],
        databaseWord: [
            {
                keyID: "short",
                tagLabel: "Short Story | Under 10k",
                wordMin: 0,
                wordMax: 10000,
            },
            {
                keyID: "novella",
                tagLabel: "Novella | 10k to 50k",
                wordMin: 10000,
                wordMax: 50000,
            },
            {
                keyID: "novel",
                tagLabel: "Novel | 50k to 100k",
                wordMin: 50000,
                wordMax: 100000,
            },
            {
                keyID: "longfic",
                tagLabel: "Longfic | Over 100k",
                wordMin: 100000,
                wordMax: Infinity,
            },
        ],
    },
    tagColor: {
        enabled: true,
        cssMode: false,
        databaseWarn: [
            {
                keyID: "no-warn",
                keyName: 'No Warnings',
                priority: 0,
                tagNames: ["No Archive Warnings Apply"],
                color: '#80ff8080',
                css: `background-color: #80ff8080 !important;`,
            },
            {
                keyID: "chose-not",
                keyName: 'Chose Not To Use Warnings',
                priority: 0,
                tagNames: ["Chose Not To Use"],
                color: '#ffff8080',
                css: `background-color: #ffff8080 !important;`,
            },
            {
                keyID: "violence",
                keyName: 'Graphic Violence',
                priority: 0,
                tagNames: ["Violence"],
                color: '#ff808080',
                css: `background-color: #ff808080 !important;`,
            },
            {
                keyID: "mcd",
                keyName: 'Major Character Death',
                priority: 0,
                tagNames: ["Death"],
                color: '#ff80ff80',
                css: `background-color: #ff80ff80 !important;`,
            },
            {
                keyID: "noncon",
                keyName: 'Non-Con',
                priority: 0,
                tagNames: ["Non-Con"],
                color: '#8080ff80',
                css: `background-color: #8080ff80 !important;`,
            },
            {
                keyID: "underage",
                keyName: 'Underage',
                priority: 0,
                tagNames: ["Underage"],
                color: '#80ffff80',
                css: `background-color: #80ffff80 !important;`,
            },
        ],
        databaseShip: [
            {
                keyID: "example",
                keyName: 'Example',
                priority: 0,
                tagNames: ['Example & Example'],
                color: '#80808080',
                css: `background-color: #80808080 !important;`,
            },
        ],
        databaseChar: [
            {
                keyID: "example",
                keyName: 'Example',
                priority: 0,
                tagNames: ['Example Character'],
                color: '#80808080',
                css: `background-color: #80808080 !important;`,
            },
        ],
        databaseFree: [
            {
                keyID: "example",
                keyName: 'Example',
                priority: 0,
                tagNames: ['Example Tag'],
                color: '#80808080',
                css: `background-color: #80808080 !important;`,
            },
        ],
    }
};

class SettingsManager {
    constructor() {
        console.info(`[Kat's Tweaks] Initializing Settings Manager:`, LOADED_SETTINGS);
        this.dropMenu = this.createHeader();
        this.dropMenu.append(
            this.getMenuButton(`— Welcome to Kat's Tweaks —`),
            this.getMenuButton('Main Settings | Import/Export', this.manageSettings),
            this.getMenuButton('Report Issue/Request Feature', function () {
                window.open("https://github.com/Katstrel/Kats-Tweaks-and-Skins/issues/new", '_blank').focus();
            }),
            this.getMenuButton('— Tweaks Modules —'),
            this.getMenuButton('Bookmarking', this.initBookmarking),
            this.getMenuButton('Read Time & Word Count', this.initReadTime),
            this.getMenuButton('Tag Color', this.initTagColor),
        );
    }

    manageSettings() {
        let container = StyleManager.SETM_SettingsContainer();
        new SettingsMain(container);
    }

    initReadTime() {
        let container = StyleManager.SETM_SettingsContainer();
        new SettingsReadTime(container);
    }

    initBookmarking() {
        let container = StyleManager.SETM_SettingsContainer();
        new SettingsBookmarking(container);
    }

    initTagColor() {
        let container = StyleManager.SETM_SettingsContainer();
        new SettingsTagColor(container);
    }

    getMenuButton(text, func) {
        let button = document.createElement('li');
        let label = document.createElement('a');
        button.append(label);

        //button.className = 'menu dropdown-menu';
        label.textContent = text;

        if (func) {
            button.addEventListener("click", (func));
            button.classList.add('KT-SETM-menu-setting');
        }
        else {
            button.classList.add('KT-SETM-menu-header');
        }
        return button;
    }

    createHeader() {
        let header = document.querySelector('ul.primary.navigation.actions');
        let menu = document.createElement('li');
        header.querySelector('li.search').before(menu);

        let label = document.createElement('a');
        let drop = document.createElement('ul');
        menu.append(label);
        menu.append(drop);

        menu.id = 'KT-SETM-dropdown';
        menu.className = 'dropdown';
        label.textContent = "Kat's Tweaks";
        drop.className = 'menu dropdown-menu';
        
        return drop;
    }
}

class SettingsMenu {
    simpleTrueFalse(label, id, setting) {
        let container = this.menuOptionContainer(this.container);

        let objInput = Object.assign(document.createElement(`input`), {
            id: `${this.id}-${id}`,
            type: 'checkbox',
            checked: setting,
        });
        let objLabel = Object.assign(document.createElement(`label`), {
            htmlFor: `${this.id}-${id}`,
            innerHTML: `<span class="optionlabel">${label}</span>`,
        });

        container.append(objLabel);
        container.append(objInput);
    }

    simpleText(label, id, setting) {
        let container = this.menuOptionContainer(this.container);
        Object.assign(this.menuSpanInLine(container), {
            innerText: `${label}`,
        })

        let objInput = Object.assign(document.createElement(`input`), {
            id: `${this.id}-${id}`,
            type: 'text',
            value: setting,
        });

        container.append(objInput);
    }

    menuActionsMenu(container) {
        let footer = Object.assign(document.createElement('p'), {
            className: 'actions',
        });

        let saveButton = Object.assign(document.createElement('input'), {
            type: 'button',
            id: 'KT-SETM-optionssave',
            value: 'Save',
        });

        let closeButton = Object.assign(document.createElement('input'), {
            type: 'button',
            id: 'KT-SETM-optionsclose',
            value: 'Close',
        });
        closeButton.addEventListener("click", () => {
            container.remove();
            document.getElementById('KT-SETM-optionsbackground').remove();
        });

        container.append(footer);
        footer.append(saveButton, closeButton);
    }

    menuOptionContainer(container, id, className) {
        let p = Object.assign(document.createElement('p'), {
            className: 'KT-SETM-setting-container',
            id: id || "",
            className: className || "",
        });
        container.append(p);
        return p;
    }

    menuHardRule(container) {
        container.append(Object.assign(document.createElement('hr'), {
            className: 'big-hr',
        }));
    }

    menuSpanInLine(container) {
        let span = Object.assign(document.createElement('span'), {
            className: 'optionlabel',
        });
        container.append(span);
        return span;
    }

    menuSectionText(container, heading, paragraph) {
        container.append(Object.assign(document.createElement('h2'), {
            textContent: heading,
        }));
        container.append(Object.assign(document.createElement('p'), {
            textContent: paragraph,
        }));
    }
    
    createColorPick(container, moduleID, elementID, itemID, itemColor) {
        container.append(Object.assign(document.createElement('span'), {
            id: `${moduleID}-colorSpan-${itemID}`,
        }));
        document.getElementById(`${moduleID}-colorSpan-${itemID}`).innerHTML += `<input id="${moduleID}-colorPick-${itemID}" data-jscolor="{}" value="#80808080">`
        jscolor.install() // recognizes new inputs and installs jscolor on them
        
        // Color Picker
        let colorPick = document.getElementById(`${moduleID}-colorPick-${itemID}`);
        colorPick.jscolor.alphaChannel = true;
        colorPick.jscolor.format = 'any';
        colorPick.jscolor.fromString(`${itemColor}`);
        colorPick.addEventListener("input", function(e) {
            document.getElementById(`${moduleID}-${elementID}-${itemID}`).style.background = colorPick.jscolor.toHEXAString();
        });
        if (LOADED_SETTINGS.reversi) {
            colorPick.jscolor.backgroundColor = 'rgb(51, 51, 51)';
            colorPick.jscolor.borderColor = 'rgb(1, 1, 1)';
            colorPick.jscolor.controlBorderColor = 'rgb(1, 1, 1)';
        }
    }

    createNumberBox(container, moduleID, elementID, itemID, defaultNumber) {
        container.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-${elementID}-${itemID}`,
            type: 'text',
            value: defaultNumber,
        }));
        StyleManager.setInputFilter(document.getElementById(`${moduleID}-${elementID}-${itemID}`), function(value) {
            return /^\d*\.?\d*$/.test(value);
        }, "Only numbers are allowed!");
    }

    createRemoveItem(container, moduleID, elementID, itemID, database, textValue) {
        container.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-removeItem-${itemID}`,
            className: 'removeItem',
            value: textValue || 'Remove',
        }));
        document.querySelectorAll(`#${moduleID}-removeItem-${itemID}`).forEach(button => {
            button.addEventListener('click', () => {
                database.forEach(({keyID}, index, array) => {
                    if (keyID == itemID) {
                        array.splice(index, 1);
                        DEBUG && console.log(`[Kat's Tweaks] Item Remove ${itemID} | New Item List: `, database);
                        document.querySelectorAll(`#${moduleID}-${elementID}-${itemID}`).forEach(function() {
                            document.getElementById(`${moduleID}-${elementID}-${itemID}`).remove();
                        })
                    }
                });
            })
        });
    }

    createUniqueItemInput(container, moduleID) {
        container.append(Object.assign(document.createElement('input'), {
            type: 'text',
            id: `${moduleID}-addItem-text`,
            value: ""
        }));
        StyleManager.setInputFilter(document.getElementById(`${moduleID}-addItem-text`), function(value) {
            return /^[a-zA-Z0-9\-\_]{0,12}$/.test(value);
        }, "Only letters, dashes(-), and underscores(_) up to 12 characters are allowed!");

        container.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-addItem`,
            value: 'Add Key ID',
        }));
    }

}

class SettingsMain extends SettingsMenu {
    constructor(container) {
        super();
        this.id = "KT-SETM";
        this.settings = LOADED_SETTINGS;
        this.container = container;

        let text = document.createElement('p');
        text.textContent = `WORK IN PROGRESS\nWill be added in the future!`;
        this.container.append(text);

        // Actions Footer
        this.menuActionsMenu(this.container);
        document.getElementById('KT-SETM-optionssave').addEventListener("click", () => {
            this.saveSettings();
        });
    }

    saveSettings() {
        let confirmed = confirm('Sure you want to save these settings?');

        

        if (confirmed) {
            LOADED_SETTINGS = this.settings;
            DEBUG && console.log(`[Kat's Tweaks] Settings Saved:`, LOADED_SETTINGS);
        }
    }
}

// Read Time & Word Count Module
class SettingsReadTime extends SettingsMenu {
    constructor(container) {
        super();
        this.id = "KT-RTWC";
        this.container = container;
        this.settings = this.moduleSettingValidation();
        
        let title = Object.assign(document.createElement('h1'), {
            textContent: "Read Time & Word Count",
        });
        this.container.append(title);

        this.simpleTrueFalse('Module Enabled', 'enabled', this.settings.enabled);
        this.menuHardRule(this.container);

        this.container.append(Object.assign(document.createElement('h2'), {
            textContent: "Reading Speed",
        }));
        this.container.append(Object.assign(document.createElement('p'), {
            textContent: `What is reading speed? You can get your reading speed by dividing the number of words a work has over by how many minutes it took to read it! This script will use your value to calculate how long it should take to read works.`,
        }));
        this.wordSpeed();
        this.menuHardRule(this.container);

        this.container.append(Object.assign(document.createElement('h2'), {
            textContent: "Time Levels",
        }));
        this.container.append(Object.assign(document.createElement('p'), {
            textContent: `Levels are super customizable for color coding how long it should take to read works! Simply enter the number of minutes it should take before the color code is used and change the color if you prefer.`,
        }));
        this.readingLevels();
        this.menuHardRule(this.container);
        
        // Actions Footer
        this.menuActionsMenu(this.container);
        document.getElementById('KT-SETM-optionssave').addEventListener("click", () => {
            this.saveSettings();
        });

    }
    
    wordSpeed() {
        let container = this.menuOptionContainer(this.container);
        Object.assign(this.menuSpanInLine(container), {
            innerText: "Words per Minute:",
        })

        let words = Object.assign(document.createElement(`input`), {
            id: `${this.id}-wpm`,
            type: 'text',
            onkeydown: "return StyleManager.isNumberKey(event)",
            value: this.settings.wordsPerMinute,
            min: 0,
        });

        container.append(words);

        StyleManager.setInputFilter(document.getElementById(`${this.id}-wpm`), function(value) {
            return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp.
        }, "Only numbers are allowed!");
    }

    readingLevels() {
        let container = this.menuOptionContainer(this.container);

        // Create the existing Levels
        let levelContainer = this.menuOptionContainer(container);
        console.info(`[Kat's Tweaks] Settings Manager - Levels: `, this.settings.levels)
        this.settings.levels.forEach(({id, name, mins, color}) => {
            this.drawLevel(levelContainer, this.id, id, name, mins, color);
        });

        // Add Levels Input
        container.append(Object.assign(document.createElement('input'), {
            type: 'text',
            id: `${this.id}-addlevel-text`,
            value: ""
        }));
        StyleManager.setInputFilter(document.getElementById(`${this.id}-addlevel-text`), function(value) {
            return /^[a-zA-Z0-9\-\_]{0,12}$/.test(value);
        }, "Only letters, dashes(-), and underscores(_) up to 12 characters are allowed!");

        container.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${this.id}-addlevel`,
            value: 'Add Level',
        }));
        document.getElementById(`${this.id}-addlevel`).addEventListener("click", () => {
            let textValue = document.getElementById(`${this.id}-addlevel-text`).value;
            let alreadyUsed = false;
            this.settings.levels.forEach(({id}) => {
                DEBUG && console.log(`[Kat's Tweaks] Testing id: `, id);
                if (id == `${textValue}`) {
                    alreadyUsed = true;
                }
            });

            if (`${textValue}` == "") {
                DEBUG && console.log(`[Kat's Tweaks] Level ID is empty!`);
                let box = document.getElementById(`${this.id}-addlevel-text`);
                box.classList.add("input-error");
                box.setCustomValidity("ID can't be empty!");
                box.reportValidity();
                return;
            }
            else if (alreadyUsed) {
                DEBUG && console.log(`[Kat's Tweaks] Level ID already in use!`);
                let box = document.getElementById(`${this.id}-addlevel-text`);
                box.classList.add("input-error");
                box.setCustomValidity("ID is already in use!");
                box.reportValidity();
                return;
            }
            else {
                this.settings.levels.push({
                    id: `${textValue}`,
                    name: `${textValue}`,
                    mins: 0,
                    color: '#80808080',
                });
                this.drawLevel(levelContainer, this.id, `${textValue}`, `${textValue}`, 0, '#80808080');
                DEBUG && console.log(`[Kat's Tweaks] Levels: `, this.settings.levels);
            }
        });
    }
    
    drawLevel(levelContainer, moduleID, levelID, levelName, levelMins, levelColor) {
        jscolor.init();
        let newLevel = this.menuOptionContainer(levelContainer, `${moduleID}-levelContainer-${levelID}`);
        levelContainer.append(newLevel);
        let label = Object.assign(this.menuSpanInLine(newLevel), {
            innerText: `${levelName}`,
            id: `${moduleID}-levelLabel-${levelID}`,
        })
        label.style.backgroundColor = levelColor;

        // Minutes
        newLevel.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-level-${levelID}`,
            type: 'text',
            value: levelMins,
        }));
        StyleManager.setInputFilter(document.getElementById(`${moduleID}-level-${levelID}`), function(value) {
            return /^\d*\.?\d*$/.test(value);
        }, "Only numbers are allowed!");

        // Create Color Picker
        newLevel.append(Object.assign(document.createElement('span'), {
            id: `${moduleID}-colorSpan-${levelID}`,
        }));
        document.getElementById(`${moduleID}-colorSpan-${levelID}`).innerHTML += `<input id="${moduleID}-colorPick-${levelID}" data-jscolor="{}" value="#80808080">`
        jscolor.install() // recognizes new inputs and installs jscolor on them
        
        // Color Picker
        let colorPick = document.getElementById(`${moduleID}-colorPick-${levelID}`);
        colorPick.jscolor.alphaChannel = true;
        colorPick.jscolor.format = 'any';
        colorPick.jscolor.fromString(`${levelColor}`);
        colorPick.addEventListener("input", function(e) {
            document.getElementById(`${moduleID}-levelLabel-${levelID}`).style.background = colorPick.jscolor.toHEXAString();
        });
        if (LOADED_SETTINGS.reversi) {
            colorPick.jscolor.backgroundColor = 'rgb(51, 51, 51)';
            colorPick.jscolor.borderColor = 'rgb(1, 1, 1)';
            colorPick.jscolor.controlBorderColor = 'rgb(1, 1, 1)';
        }

        DEBUG && console.log(`[Kat's Tweaks] Levels this. check: `, this.settings.levels);

        // Rename Level
        newLevel.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-renameLevel-${levelID}`,
            value: 'Rename',
        }));
        document.getElementById(`${moduleID}-renameLevel-${levelID}`).addEventListener("click", () => {
            this.settings.levels.forEach(({id}, index, array) => {
                if (id == levelID) {
                    let newName = prompt(`[Kat's Tweaks] Renaming ${levelName} (${levelID})\nEnter New Name:`);
                    array[index].name = newName;
                    document.getElementById(`${moduleID}-levelLabel-${levelID}`).innerText = newName;
                }
            });
        });
        
        // Remove Level
        newLevel.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-removeLevel-${levelID}`,
            className: 'removeLevel',
            value: 'Remove',
        }));


        document.querySelectorAll(`#${moduleID}-removeLevel-${levelID}`).forEach(button => {
            button.addEventListener('click', () => {
                this.settings.levels.forEach(({id}, index, array) => {
                    if (id == levelID) {
                        array.splice(index, 1);
                        DEBUG && console.log(`[Kat's Tweaks] Level Remove ${levelID} | New Levels List: `, this.settings.levels);
                        document.querySelectorAll(`#${moduleID}-levelContainer-${levelID}`).forEach(function() {
                            document.getElementById(`${moduleID}-levelContainer-${levelID}`).remove();
                        })
                    }
                });
            })
        });

        newLevel.append(document.createElement('hr'));
    }

    saveSettings() {
        let confirmed = confirm('Sure you want to save these settings?');

        this.settings.enabled = document.getElementById(`${this.id}-enabled`).checked;
        this.settings.wordsPerMinute = document.getElementById(`${this.id}-wpm`).value;

        // forEach (function (values, index, array) => {}) WHY AM I ONLY NOW LEARNING THIS?!
        this.settings.levels.forEach(({id}, index, array) => {
            array[index].name = document.getElementById(`${this.id}-levelLabel-${id}`).innerText;
            array[index].mins = document.getElementById(`${this.id}-level-${id}`).value;
            array[index].color = document.getElementById(`${this.id}-colorPick-${id}`).jscolor.toHEXAString();
        });

        if (confirmed) {
            LOADED_SETTINGS.readTime = this.settings;
            localStorage.setItem('KT-SavedSettings', JSON.stringify(LOADED_SETTINGS));
            DEBUG && console.log(`[Kat's Tweaks] Settings Saved:`, LOADED_SETTINGS);
            window.location.reload();
        }
    }

    moduleSettingValidation() {
        const setDefault = DEFAULT_SETTINGS.readTime;
        const setLoaded = LOADED_SETTINGS.readTime;
        let settings = setLoaded || setDefault;

        try { settings.wordsPerMinute = setLoaded.wordsPerMinute; }
        catch { settings.wordsPerMinute = setDefault.wordsPerMinute; }

        try { settings.levels = setLoaded.levels; }
        catch { settings.levels = setDefault.levels; }

        return settings;
    }
}

class SettingsBookmarking extends SettingsMenu {
    constructor(container) {
        super();
        this.id = "KT-BOOK";
        this.container = container;
        this.settings = this.moduleSettingValidation();
        
        // Header
        let title = Object.assign(document.createElement('h1'), {
            textContent: "Bookmarking",
        });
        this.container.append(title);

        this.simpleTrueFalse('Module Enabled', 'enabled', this.settings.enabled);
        this.menuHardRule(this.container);

        // Bookmark Settings
        this.container.append(Object.assign(document.createElement('h2'), {
            textContent: "General Settings",
        }));
        this.container.append(Object.assign(document.createElement('p'), {
            textContent: `This mostly handles the note and if the bookmark is private and or rec.`,
        }));

        this.simpleText('Default Note:', 'usernote', this.settings.defaultNote);
        this.simpleText('Tracking Details Title:', 'details', this.settings.details);
        this.simpleTrueFalse('Include Fandom in Note:', 'includeFandom', this.settings.includeFandom);
        this.simpleTrueFalse('Private New Bookmarks:', 'newprivate', this.settings.newBookmarksPrivate);
        this.simpleTrueFalse('Rec New Bookmarks:', 'newrec', this.settings.newBookmarksRec);
        this.simpleTrueFalse('Show Updated Bookmark:', 'showupdate', this.settings.showUpdatedBookmarks);
        this.simpleTrueFalse('Hide Mark for Later:', 'hidemark', this.settings.hideDefaultToreadBtn);
        this.menuHardRule(this.container);

        // Bookmark Tags
        this.container.append(Object.assign(document.createElement('h2'), {
            textContent: "Bookmark Tags",
        }));
        this.container.append(Object.assign(document.createElement('p'), {
            textContent: `Create, edit, and delete tags. Beware, changing a tag will not automatically update bookmarks that already have it. When adding a tag, you must give an ID that is only used for local storage. You may set the tag label after you provide an ID.`,
        }));

        this.container.append(document.createElement('hr'));
        this.databaseTags();
        this.menuHardRule(this.container);
        
        // Words Tags
        this.container.append(Object.assign(document.createElement('h2'), {
            textContent: "Word Count Tags",
        }));
        this.container.append(Object.assign(document.createElement('p'), {
            textContent: `These tags are added automatically to allow for sorting based on word count. Ranges can overlap! Provided are generally accepted word count ranges for categorizing books. 100,000 words is actually on the longer side of most novels!`,
        }));

        this.container.append(document.createElement('hr'));
        this.databaseWord();
        this.menuHardRule(this.container);

        // Information Tags
        this.container.append(Object.assign(document.createElement('h2'), {
            textContent: "Information Tags",
        }));
        this.container.append(Object.assign(document.createElement('p'), {
            textContent: `These tags are for creating bookmarks when doing an action with a work. These are ONLY triggered with the buttons provided by AO3. You will also have to remove these tags manually if you ever want to remove them.`,
        }));

        this.simpleTrueFalse('When Leaving Kudos:', 'kudosed', this.settings.databaseInfo[3].enabled)
        //this.simpleTrueFalse('When Commenting:', 'commented', this.settings.databaseInfo[2].enabled)
        this.simpleTrueFalse('When Subscribing:', 'subscribed', this.settings.databaseInfo[5].enabled)
        this.menuHardRule(this.container);

        // Actions Footer
        this.menuActionsMenu(this.container);
        document.getElementById('KT-SETM-optionssave').addEventListener("click", () => {
            this.saveSettings();
        });
    }

    databaseTags() {
        let container = this.menuOptionContainer(this.container);

        // Create the existing Tags
        let tagContainer = this.menuOptionContainer(container);
        console.info(`[Kat's Tweaks] Settings Manager - Tags: `, this.settings.databaseTags)
        this.settings.databaseTags.forEach(({keyID, tagLabel, posLabel, negLabel, btnHeader, btnFooter}) => {
            this.drawTag(tagContainer, this.id, keyID, tagLabel, posLabel, negLabel, btnHeader, btnFooter);
        });

        // Add Tags Input
        container.append(Object.assign(document.createElement('input'), {
            type: 'text',
            id: `${this.id}-addTag-text`,
            value: ""
        }));
        StyleManager.setInputFilter(document.getElementById(`${this.id}-addTag-text`), function(value) {
            return /^[a-zA-Z0-9\-\_]{0,12}$/.test(value);
        }, "Only letters, dashes(-), and underscores(_) up to 12 characters are allowed!");

        container.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${this.id}-addTag`,
            value: 'Add Tag ID',
        }));
        document.getElementById(`${this.id}-addTag`).addEventListener("click", () => {
            let textValue = document.getElementById(`${this.id}-addTag-text`).value;
            let alreadyUsed = false;
            this.settings.databaseTags.forEach(({keyID}) => {
                DEBUG && console.log(`[Kat's Tweaks] Testing id: `, keyID);
                if (keyID == `${textValue}`) {
                    alreadyUsed = true;
                }
            });

            if (`${textValue}` == "") {
                DEBUG && console.log(`[Kat's Tweaks] Tag ID is empty!`);
                let box = document.getElementById(`${this.id}-addTag-text`);
                box.classList.add("input-error");
                box.setCustomValidity("ID can't be empty!");
                box.reportValidity();
                return;
            }
            else if (alreadyUsed) {
                DEBUG && console.log(`[Kat's Tweaks] Tag ID already in use!`);
                let box = document.getElementById(`${this.id}-addTag-text`);
                box.classList.add("input-error");
                box.setCustomValidity("ID is already in use!");
                box.reportValidity();
                return;
            }
            else {
                this.settings.databaseTags.push({
                    keyID: `${textValue}`,
                    tagLabel: 'New Tag',
                    posLabel: 'Mark as New Tag',
                    negLabel: 'Remove from New Tag',
                    btnHeader: false,
                    btnFooter: false,
                });
                this.drawTag(tagContainer, this.id, `${textValue}`, 'New Tag', 'Mark as New Tag', 'Remove from New Tag', false, false);
                DEBUG && console.log(`[Kat's Tweaks] Tags: `, this.settings.databaseTags);
            }
        });
    }

    drawTag(tagContainer, moduleID, tagID, tagNames, posLabel, negLabel, btnHeader, btnFooter) {
        let newTag = this.menuOptionContainer(tagContainer, `${moduleID}-tagContainer-${tagID}`);
        tagContainer.append(newTag);
        newTag.append(Object.assign(document.createElement('h4'), {
            innerText: `${tagNames}`,
            align: 'left',
            id: `${moduleID}-tagLabel-${tagID}`,
        }));
        
        // Header
        newTag.append(Object.assign(document.createElement(`label`), {
            htmlFor: `${this.id}-tagHeader-${tagID}`,
            innerHTML: `<span class="optionlabel">Display Button At Top:</span>`,
        }));
        newTag.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-tagHeader-${tagID}`,
            type: 'checkbox',
            checked: btnHeader,
        }));

        newTag.append(document.createElement('br'));

        // Footer
        newTag.append(Object.assign(document.createElement(`label`), {
            htmlFor: `${this.id}-tagFooter-${tagID}`,
            innerHTML: `<span class="optionlabel">Display Button At Bottom:</span>`,
        }));
        newTag.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-tagFooter-${tagID}`,
            type: 'checkbox',
            checked: btnFooter,
        }));

        newTag.append(document.createElement('br'));

        // Add Tag Label
        newTag.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-tagAddLabel-${tagID}`,
            type: 'text',
            value: posLabel,
        }));

        // Remove Tag Label
        newTag.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-tagRemoveLabel-${tagID}`,
            type: 'text',
            value: negLabel,
        }));

        // Rename Label
        newTag.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-renameTag-${tagID}`,
            value: 'Rename',
        }));
        document.getElementById(`${moduleID}-renameTag-${tagID}`).addEventListener("click", () => {
            this.settings.databaseTags.forEach(({keyID}, index, array) => {
                if (keyID == tagID) {
                    let newName = prompt(`[Kat's Tweaks] Renaming ${tagNames} (${tagID})\nEnter New Name:`) || tagNames;
                    array[index].name = newName;
                    document.getElementById(`${moduleID}-tagLabel-${tagID}`).innerText = newName;
                }
            });
        });
        
        // Remove Tag
        newTag.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-removeTag-${tagID}`,
            className: 'removeTag',
            value: 'Remove',
        }));

        document.querySelectorAll(`#${moduleID}-removeTag-${tagID}`).forEach(button => {
            button.addEventListener('click', () => {
                this.settings.databaseTags.forEach(({keyID}, index, array) => {
                    if (keyID == tagID) {
                        array.splice(index, 1);
                        DEBUG && console.log(`[Kat's Tweaks] Tag Remove ${tagID} | New Tag List: `, this.settings.databaseTags);
                        document.querySelectorAll(`#${moduleID}-tagContainer-${tagID}`).forEach(function() {
                            document.getElementById(`${moduleID}-tagContainer-${tagID}`).remove();
                        })
                    }
                });
            })
        });

        newTag.append(document.createElement('hr'));
    }
    
    databaseWord() {
        let container = this.menuOptionContainer(this.container);

        // Create the existing Tags
        let tagContainer = this.menuOptionContainer(container);
        console.info(`[Kat's Tweaks] Settings Manager - Tags: `, this.settings.databaseWord)
        this.settings.databaseWord.forEach(({keyID, tagLabel, wordMin, wordMax}) => {
            this.drawWord(tagContainer, this.id, keyID, tagLabel, wordMin, wordMax);
        });

        // Add Tags Input
        container.append(Object.assign(document.createElement('input'), {
            type: 'text',
            id: `${this.id}-addWord-text`,
            value: ""
        }));
        StyleManager.setInputFilter(document.getElementById(`${this.id}-addWord-text`), function(value) {
            return /^[a-zA-Z0-9\-\_]{0,12}$/.test(value);
        }, "Only letters, dashes(-), and underscores(_) up to 12 characters are allowed!");
        
        container.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${this.id}-addWord`,
            value: 'Add Tag ID',
        }));
        document.getElementById(`${this.id}-addWord`).addEventListener("click", () => {
            let textValue = document.getElementById(`${this.id}-addWord-text`).value;
            let alreadyUsed = false;
            this.settings.databaseWord.forEach(({keyID}) => {
                DEBUG && console.log(`[Kat's Tweaks] Testing id: `, keyID);
                if (keyID == `${textValue}`) {
                    alreadyUsed = true;
                }
            });

            if (`${textValue}` == "") {
                DEBUG && console.log(`[Kat's Tweaks] Tag ID is empty!`);
                let box = document.getElementById(`${this.id}-addWord-text`);
                box.classList.add("input-error");
                box.setCustomValidity("ID can't be empty!");
                box.reportValidity();
                return;
            }
            else if (alreadyUsed) {
                DEBUG && console.log(`[Kat's Tweaks] Tag ID already in use!`);
                let box = document.getElementById(`${this.id}-addWord-text`);
                box.classList.add("input-error");
                box.setCustomValidity("ID is already in use!");
                box.reportValidity();
                return;
            }
            else {
                this.settings.databaseWord.push({
                    keyID: `${textValue}`,
                    tagLabel: 'New Word Range',
                    wordMin: 0,
                    wordMax: Infinity,
                });
                this.drawWord(tagContainer, this.id, `${textValue}`, 'New Word Range', 0, Infinity);
                DEBUG && console.log(`[Kat's Tweaks] Tags: `, this.settings.databaseWord);
            }
        });
    }
    
    drawWord(tagContainer, moduleID, tagID, tagNames, wordMin, wordMax) {
        let newTag = this.menuOptionContainer(tagContainer, `${moduleID}-tagContainer-${tagID}`);
        tagContainer.append(newTag);
        Object.assign(this.menuSpanInLine(newTag), {
            innerText: `${tagNames}`,
            id: `${moduleID}-wordsLabel-${tagID}`,
        });
        
        // Min Words
        newTag.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-wordsMin-${tagID}`,
            type: 'text',
            value: wordMin,
        }));
        StyleManager.setInputFilter(document.getElementById(`${moduleID}-wordsMin-${tagID}`), function(value) {
            return /^\d*\.?\d*$/.test(value);
        }, "Only numbers are allowed!");

        // Max Words
        newTag.append(Object.assign(document.createElement(`input`), {
            id: `${moduleID}-wordsMax-${tagID}`,
            type: 'text',
            value: wordMax,
        }));
        StyleManager.setInputFilter(document.getElementById(`${moduleID}-wordsMax-${tagID}`), function(value) {
            return /^\d*\.?\d*$/.test(value);
        }, "Only numbers are allowed!");

        // Rename Label
        newTag.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-renameWords-${tagID}`,
            value: 'Rename',
        }));
        document.getElementById(`${moduleID}-renameWords-${tagID}`).addEventListener("click", () => {
            this.settings.databaseWord.forEach(({keyID}, index, array) => {
                if (keyID == tagID) {
                    let newName = prompt(`[Kat's Tweaks] Renaming ${tagNames} (${tagID})\nEnter New Name:`) || tagNames;
                    array[index].name = newName;
                    document.getElementById(`${moduleID}-wordsLabel-${tagID}`).innerText = newName;
                }
            });
        });
        
        // Remove Tag
        newTag.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-removeWords-${tagID}`,
            className: 'removeWords',
            value: 'Remove',
        }));

        document.querySelectorAll(`#${moduleID}-removeWords-${tagID}`).forEach(button => {
            button.addEventListener('click', () => {
                this.settings.databaseWord.forEach(({keyID}, index, array) => {
                    if (keyID == tagID) {
                        array.splice(index, 1);
                        DEBUG && console.log(`[Kat's Tweaks] Tag Remove ${tagID} | New Tag List: `, this.settings.databaseWord);
                        document.querySelectorAll(`#${moduleID}-tagContainer-${tagID}`).forEach(function() {
                            document.getElementById(`${moduleID}-tagContainer-${tagID}`).remove();
                        })
                    }
                });
            })
        });

        newTag.append(document.createElement('hr'));
    }

    saveSettings() {
        let confirmed = confirm('Sure you want to save these settings?');

        this.settings.enabled = document.getElementById(`${this.id}-enabled`).checked;
        this.settings.defaultNote = document.getElementById(`${this.id}-usernote`).value;
        this.settings.details = document.getElementById(`${this.id}-details`).value;
        this.settings.includeFandom = document.getElementById(`${this.id}-includeFandom`).checked;
        this.settings.newBookmarksPrivate = document.getElementById(`${this.id}-newprivate`).checked;
        this.settings.newBookmarksRec = document.getElementById(`${this.id}-newrec`).checked;
        this.settings.showUpdatedBookmarks = document.getElementById(`${this.id}-showupdate`).checked;
        this.settings.hideDefaultToreadBtn = document.getElementById(`${this.id}-hidemark`).checked;

        //this.settings.databaseInfo[2].enabled = document.getElementById(`${this.id}-commented`).checked;
        this.settings.databaseInfo[3].enabled = document.getElementById(`${this.id}-kudosed`).checked;
        this.settings.databaseInfo[5].enabled = document.getElementById(`${this.id}-subscribed`).checked;

        this.settings.databaseTags.forEach(({keyID}, index, array) => {
            array[index].tagLabel = document.getElementById(`${this.id}-tagLabel-${keyID}`).innerText;
            array[index].posLabel = document.getElementById(`${this.id}-tagAddLabel-${keyID}`).value;
            array[index].negLabel = document.getElementById(`${this.id}-tagRemoveLabel-${keyID}`).value;
            array[index].btnHeader = document.getElementById(`${this.id}-tagHeader-${keyID}`).checked;
            array[index].btnFooter = document.getElementById(`${this.id}-tagFooter-${keyID}`).checked;
        });

        this.settings.databaseWord.forEach(({keyID}, index, array) => {
            array[index].tagLabel = document.getElementById(`${this.id}-wordsLabel-${keyID}`).innerText;
            array[index].wordMin = document.getElementById(`${this.id}-wordsMin-${keyID}`).value || 0;
            array[index].wordMax = document.getElementById(`${this.id}-wordsMax-${keyID}`).value || Infinity;
        });

        if (confirmed) {
            LOADED_SETTINGS.bookmarking = this.settings;
            localStorage.setItem('KT-SavedSettings', JSON.stringify(LOADED_SETTINGS));
            DEBUG && console.log(`[Kat's Tweaks] Settings Saved:`, LOADED_SETTINGS);
            window.location.reload();
        }
    }

    moduleSettingValidation() {
        const setDefault = DEFAULT_SETTINGS.bookmarking;
        const setLoaded = LOADED_SETTINGS.bookmarking;
        let settings = setLoaded || setDefault;

        // Value Settings
        try { settings.dateFormat = setLoaded.dateFormat; }
        catch { settings.dateFormat = setDefault.dateFormat; }

        try { settings.defaultNote = setLoaded.defaultNote; }
        catch { settings.defaultNote = setDefault.defaultNote; }

        try { settings.details = setLoaded.details; }
        catch { settings.details = setDefault.details; }

        // Databases
        try { settings.databaseInfo = setLoaded.databaseInfo; }
        catch { settings.databaseInfo = setDefault.databaseInfo; }

        try { settings.databaseTags = setLoaded.databaseTags; }
        catch { settings.databaseTags = setDefault.databaseTags; }

        try { settings.databaseWord = setLoaded.databaseWord; }
        catch { settings.databaseWord = setDefault.databaseWord; }

        return settings;
    }
}

class SettingsTagColor extends SettingsMenu {
    constructor(container) {
        super();
        this.id = "KT-COLR";
        this.container = container;
        this.settings = this.moduleSettingValidation();
        
        let title = Object.assign(document.createElement('h1'), {
            textContent: "Tag Colors",
        });
        this.container.append(title);
        this.container.append(Object.assign(document.createElement('p'), {
            textContent: `Due to current bug you must save settings after creating a new group before tags will be saved within that group. Sorry for the inconvenience.`,
        }));

        this.simpleTrueFalse('Module Enabled', 'enabled', this.settings.enabled);
        this.menuHardRule(this.container);

        // Warnings Database
        this.menuSectionText(this.container, 'Content Warnings', 'Apply color coding the six content warning labels available.');
        this.databaseItems(this.settings.databaseWarn, 'WARN', true);
        this.menuHardRule(this.container);

        // Relationships Database
        this.menuSectionText(this.container, 'Relationships', 'This works by finding the containing phrase. It must match where the relationship symbol is or it can be left without a symbol to color code any relationships with a character. Such as all relationships with John can be selected with "John". For something like Jane Jones & John Jones, it must be selected with at least "Jones & John" however this might catch any other Jones except Jane. For best results, match the tag exactly. You can assign multiple tags to the same coloring group.');
        this.container.append(document.createElement('hr'));
        this.databaseItems(this.settings.databaseShip, 'SHIP');
        this.menuHardRule(this.container);

        // Character Database
        this.menuSectionText(this.container, 'Characters', 'This works by finding the containing phrase. To color any tags with Jane Jones, the tag added here can match "Jane" or "Jones". However this will match any Jane or Jones character. For best results, match the tag exactly. You can assign multiple tags to the same coloring group.');
        this.container.append(document.createElement('hr'));
        this.databaseItems(this.settings.databaseChar, 'CHAR');
        this.menuHardRule(this.container);

        // Freeform Database
        this.menuSectionText(this.container, 'Freeform', 'This works by finding the containing phrase. Tags like "no beta" can be caught as long as the case matches. For tags like "Angst", any other tags that include Angst will also be caught. For best results, match the tag exactly. You can assign multiple tags to the same coloring group. Priority can be used to make sure certain colors have higher priority over others. This might be used to make "No Angst" transparent to disable any coloring that might have been done.');
        this.container.append(document.createElement('hr'));
        this.databaseItems(this.settings.databaseFree, 'FREE');
        this.menuHardRule(this.container);
        
        // Actions Footer
        this.menuActionsMenu(this.container);
        document.getElementById('KT-SETM-optionssave').addEventListener("click", () => {
            this.saveSettings();
        });

    }

    databaseItems(database, listID, immutable) {
        let container = this.menuOptionContainer(this.container);

        // Create the existing groups
        let tagContainer = this.menuOptionContainer(container);
        console.info(`[Kat's Tweaks] Settings Manager - Tags: `, database)
        database.forEach(({keyID, keyName, priority, tagNames, color, css}) => {
            this.drawGroup(tagContainer, this.id, listID, keyID, keyName, tagNames, priority, color, css, database, immutable);
        });

        // Add Tag Group Input
        if (!immutable) { 
            this.createUniqueItemInput(container, `${this.id}-${listID}`);
            document.getElementById(`${this.id}-${listID}-addItem`).addEventListener("click", () => {
                let textValue = document.getElementById(`${this.id}-${listID}-addItem-text`).value;
                let alreadyUsed = false;
                database.forEach(({keyID}) => {
                    DEBUG && console.log(`[Kat's Tweaks] Testing KeyID: `, keyID);
                    if (keyID == `${textValue}`) {
                        alreadyUsed = true;
                    }
                });
    
                if (`${textValue}` == "") {
                    DEBUG && console.log(`[Kat's Tweaks] KeyID is empty!`);
                    let box = document.getElementById(`${this.id}-${listID}-addItem-text`);
                    box.classList.add("input-error");
                    box.setCustomValidity("Key ID can't be empty!");
                    box.reportValidity();
                    return;
                }
                else if (alreadyUsed) {
                    DEBUG && console.log(`[Kat's Tweaks] KeyID '${textValue}' already in use!`);
                    let box = document.getElementById(`${this.id}-${listID}-addItem-text`);
                    box.classList.add("input-error");
                    box.setCustomValidity("Key ID is already in use!");
                    box.reportValidity();
                    return;
                }
                else {
                    this.pushItem(tagContainer, this.id, listID, database, textValue);
                }
            });
        }
    }

    drawGroup(itemContainer, moduleID, listID, itemID, itemName, itemTags, itemPriority, itemColor, itemCSS, database, immutable) {
        jscolor.init();
        let newItem = this.menuOptionContainer(itemContainer, `${moduleID}-${listID}-itemContainer-${itemID}`);

        if (immutable) {
            let label = Object.assign(this.menuSpanInLine(newItem), {
                innerText: `${itemTags[0]}`,
                id: `${moduleID}-${listID}-tagList-${itemID}`,
            })
            label.style.backgroundColor = itemColor;
            this.createColorPick(newItem, `${moduleID}-${listID}`, `tagList`, itemID, itemColor);
            return;
        }

        itemContainer.append(newItem);
        newItem.append(Object.assign(document.createElement('h4'), {
            innerText: `${itemName}`,
            align: 'left',
            id: `${moduleID}-${listID}-itemKeyID-${itemID}`,
        }));

        // Priority
        newItem.append(Object.assign(this.menuSpanInLine(newItem), {
            innerText: `Priority: `,
        }));
        this.createNumberBox(newItem, `${moduleID}-${listID}`, 'priority', itemID, itemPriority)
        newItem.append(document.createElement('br'));
        
        // Create Color Picker
        newItem.append(Object.assign(this.menuSpanInLine(newItem), {
            innerText: `Color: `,
        }));
        this.createColorPick(newItem, `${moduleID}-${listID}`, `tagList`, itemID, itemColor);

        // Tag List
        let tagListContainer = Object.assign(document.createElement('p'), {
            id: `${moduleID}-${listID}-tagList-${itemID}`,
        });
        tagListContainer.style.backgroundColor = itemColor;
        newItem.append(tagListContainer);
        itemTags.forEach(tag => {
            let randID = Math.floor(Math.random() * 1000000);
            DEBUG && console.log(`[Kat's Tweaks] ID ${randID} given to '${tag}' for ${itemID}`)
            this.drawItem(tagListContainer, moduleID, listID, itemID, itemTags, tag, randID, immutable);
        });
        
        // Add Tag to List
        newItem.append(Object.assign(document.createElement('input'), {
            type: 'text',
            id: `${moduleID}-${listID}-addItemTag-${itemID}-text`,
            value: ""
        }));
        newItem.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-${listID}-addItemTag-${itemID}`,
            value: 'Add Tag',
        }));
        document.getElementById(`${moduleID}-${listID}-addItemTag-${itemID}`).addEventListener("click", () => {
            let textValue = document.getElementById(`${moduleID}-${listID}-addItemTag-${itemID}-text`).value;
            let randID = Math.floor(Math.random() * 1000000);
            itemTags.push(`${textValue}`);
            DEBUG && console.log(`[Kat's Tweaks] Item ${itemID} Tag Add ${textValue} | New Tag List: `, itemTags);
            DEBUG && console.log(`[Kat's Tweaks] ID ${randID} given to '${textValue}' for ${itemID}`);
            this.drawItem(tagListContainer, moduleID, listID, itemID, itemTags, textValue, randID);
        });
        
        // Remove Database Item
        this.createRemoveItem(newItem, `${moduleID}-${listID}`, 'itemContainer', itemID, database, 'Remove Group')

        // Rename Label
        newItem.append(Object.assign(document.createElement('input'), {
            type: 'button',
            id: `${moduleID}-${listID}-renameTag-${itemID}`,
            value: 'Rename Group',
        }));
        document.getElementById(`${moduleID}-${listID}-renameTag-${itemID}`).addEventListener("click", () => {
            database.forEach(({keyID}, index, array) => {
                if (keyID == itemID) {
                    let newName = prompt(`[Kat's Tweaks] Renaming ${itemName} (${itemID})\nEnter New Name:`) || itemName;
                    array[index].keyName = newName;
                    document.getElementById(`${moduleID}-${listID}-itemKeyID-${itemID}`).innerText = newName;
                }
            });
        });

        newItem.append(document.createElement('hr'));
    }

    drawItem(container, moduleID, listID, itemID, itemTags, tag, randID, immutable) {
        let tagLabel = Object.assign(this.menuSpanInLine(container), {
            innerText: `${tag}`,
            id: `${moduleID}-${listID}-tagLabel-${itemID}-${randID}`,
        });
        container.append(tagLabel);

        if (!immutable) {
            tagLabel.append(Object.assign(document.createElement('input'), {
                type: 'button',
                id: `${moduleID}-${listID}-removeItem-${itemID}-${randID}`,
                className: 'removeItemTag',
                value: 'X',
            }));
            document.querySelectorAll(`#${moduleID}-${listID}-removeItem-${itemID}-${randID}`).forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll(`#${moduleID}-${listID}-tagLabel-${itemID}-${randID}`).forEach(function() {
                        document.getElementById(`${moduleID}-${listID}-tagLabel-${itemID}-${randID}`).remove();
                    });
                    document.querySelectorAll(`#${moduleID}-${listID}-removeItem-${itemID}-${randID}`).forEach(function() {
                        document.getElementById(`${moduleID}-${listID}-removeItem-${itemID}-${randID}`).remove();
                    });
                    let foundTag = false;
                    itemTags.forEach((arrTag, index, array) => {
                        if ((arrTag == tag) && (!foundTag)) {
                            array.splice(index, 1);
                            DEBUG && console.log(`[Kat's Tweaks] Item ${itemID} Tag Remove ${tag} | New Tag List: `, itemTags);
                            foundTag = true;
                        }
                    });
                })
            });
        }
    }

    pushItem(container, moduleID, listID, database, keyID) {
        database.push({
            keyID: `${keyID}`,
            keyName: 'New Tag Color Group',
            priority: 0,
            tagNames: ['No Tag Set'],
            color: '#80808080',
            css: `background-color: #80808080 !important;`,
        });
        this.drawGroup(container, moduleID, listID, keyID, 'New Tag Color Group', ['No Tag Set'], 0, '#80808080', `background-color: #80808080 !important;`, database);
        DEBUG && console.log(`[Kat's Tweaks] Created ${keyID} | Database Items: `, database);
    }

    saveSettings() {
        let confirmed = confirm('Sure you want to save these settings?');

        // Databases
        this.settings.databaseWarn.forEach(({keyID}, index, array) => {
            array[index].color = document.getElementById(`${this.id}-WARN-colorPick-${keyID}`).jscolor.toHEXAString();
        });
        this.settings.databaseShip.forEach(({keyID}, index, array) => {
            array[index].priority = document.getElementById(`${this.id}-SHIP-priority-${keyID}`).value;
            array[index].color = document.getElementById(`${this.id}-SHIP-colorPick-${keyID}`).jscolor.toHEXAString();
        });
        this.settings.databaseChar.forEach(({keyID}, index, array) => {
            array[index].priority = document.getElementById(`${this.id}-CHAR-priority-${keyID}`).value;
            array[index].color = document.getElementById(`${this.id}-CHAR-colorPick-${keyID}`).jscolor.toHEXAString();
        });
        this.settings.databaseFree.forEach(({keyID}, index, array) => {
            array[index].priority = document.getElementById(`${this.id}-FREE-priority-${keyID}`).value;
            array[index].color = document.getElementById(`${this.id}-FREE-colorPick-${keyID}`).jscolor.toHEXAString();
        });

        if (confirmed) {
            LOADED_SETTINGS.tagColor = this.settings;
            localStorage.setItem('KT-SavedSettings', JSON.stringify(LOADED_SETTINGS));
            DEBUG && console.log(`[Kat's Tweaks] Settings Saved:`, LOADED_SETTINGS);
            window.location.reload();
        }
    }

    moduleSettingValidation() {
        const setDefault = DEFAULT_SETTINGS.tagColor;
        const setLoaded = LOADED_SETTINGS.tagColor;
        let settings = setLoaded || setDefault;

        // Databases
        try { settings.databaseWarn = setLoaded.databaseWarn; }
        catch { settings.databaseWarn = setDefault.databaseWarn; }
        try { settings.databaseShip = setLoaded.databaseShip; }
        catch { settings.databaseShip = setDefault.databaseShip; }
        try { settings.databaseChar = setLoaded.databaseChar; }
        catch { settings.databaseChar = setDefault.databaseChar; }
        try { settings.databaseFree = setLoaded.databaseFree; }
        catch { settings.databaseFree = setDefault.databaseFree; }

        return settings;
    }
}

class StyleManager {
    static addStyle(debugID, css) {
        const customStyle = document.createElement('style');
        customStyle.id = 'KT';
        customStyle.innerHTML = css;
        document.head.appendChild(customStyle);
        DEBUG && console.info(`[Kat's Tweaks] Custom style '${debugID}' added successfully`);
    }

    // Restricts input for the given textbox to the given inputFilter function.
    // https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
    static setInputFilter(textbox, inputFilter, errMsg) {
        [ "input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout" ].forEach(function(event) {
            textbox.addEventListener(event, function(e) {
                if (inputFilter(this.value)) {
                    // Accepted value.
                    if ([ "keydown", "mousedown", "focusout" ].indexOf(e.type) >= 0){
                      this.classList.remove("input-error");
                      this.setCustomValidity("");
                    }

                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                }
                else if (this.hasOwnProperty("oldValue")) {
                    // Rejected value: restore the previous one.
                    this.classList.add("input-error");
                    this.setCustomValidity(errMsg);
                    this.reportValidity();
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                }
                else {
                    // Rejected value: nothing to restore.
                    this.value = "";
                }
            });
        });
    }

    static SETM_SettingsContainer() {
        let background = document.createElement('div');
        background.id = 'KT-SETM-optionsbackground';
        background.style.background = 'rgba(0, 0, 0, 0.75)';
        background.style.position = 'fixed';
        background.style.width = '100%';
        background.style.height = '100%';

        let box = document.createElement('div');
        box.id = 'KT-SETM-optionsbox';

        document.body.append(background);
        document.querySelector('#main').append(box);
        
        return box;
    }
}

class Main {
    constructor() {
        this.settings = this.loadSettings();
        this.reversiCheck();
        this.initStyles();
        new SettingsManager();
    }

    reversiCheck() {
        let bgColor = window.getComputedStyle(document.body).backgroundColor;
        let reversi = document.querySelector('.wrapper').classList.contains('KT-reversi');
        if ((bgColor == 'rgb(51, 51, 51)' && !reversi) || this.settings.reversi) {
            document.querySelector('.wrapper').classList.add('KT-reversi');
            LOADED_SETTINGS.reversi = true;
            DEBUG && console.log(`[Kat's Tweaks] Reversi Detected!`)
        }
    }

    // Load settings from the storage or fallback to default ones
    loadSettings() {
        const startTime = performance.now();
        let savedSettings = localStorage.getItem('KT-SavedSettings');

        if (savedSettings) {
            try {
                LOADED_SETTINGS = JSON.parse(savedSettings);
                DEBUG && console.log(`[Kat's Tweaks] Settings loaded successfully:`, savedSettings);
            } catch (error) {
                DEBUG && console.error(`[Kat's Tweaks] Error parsing settings: ${error}`);
                LOADED_SETTINGS = DEFAULT_SETTINGS
            }
        } else {
            LOADED_SETTINGS = DEFAULT_SETTINGS;
            DEBUG && console.warn(`[Kat's Tweaks] No saved settings found, using default settings.`, LOADED_SETTINGS);
        }

        const endTime = performance.now();
        DEBUG && console.log(`[Kat's Tweaks] Settings loaded in ${endTime - startTime} ms`);
        return LOADED_SETTINGS;
    }

    initStyles() {
        StyleManager.addStyle('SETM Default Style', `#header .KT-SETM-menu-header { text-align: center !important; font-weight: bold; } #KT-SETM-optionsbox { position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; height: min-content; width: 70%; max-height: 90%; max-width: 800px; margin: auto; overflow-y: auto; border: 10px solid #990000; box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, .2); padding: 0 20px; background-color: rgb(255, 255, 255); z-index: 999; } #KT-SETM-optionsbox hr.big-hr { border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), #990000, rgba(0, 0, 0, 0)); } #KT-SETM-optionsbox p.actions { text-align: right } #KT-SETM-optionsbox p input[type="button"] { float: none; text-align: right; } #KT-SETM-optionsbox h1, #KT-SETM-optionsbox h2 { text-align: center; } #KT-SETM-optionsbox input[type="button"] { height: auto; cursor: pointer; } #KT-SETM-optionsbox .optionlabel { display: inline-block; min-width: 13.5em; } .input-error{ outline: 1px solid #990000 !important; }`);
        StyleManager.addStyle('SETM Reversi Overrides', `.KT-reversi #KT-SETM-optionsbox { border: 10px solid #5998D6; background-color: rgb(51, 51, 51); } .KT-reversi #KT-SETM-optionsbox hr.big-hr { background-image: linear-gradient(to right, rgba(0, 0, 0, 0), #5998D6, rgba(0, 0, 0, 0)); } .KT-reversi .input-error  { outline: 1px solid #5998D6 !important; }`)
    }
}

new Main();