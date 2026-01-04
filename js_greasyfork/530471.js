// ==UserScript==
// @name         [AO3] Kat's Tweaks: Tag Colors
// @author       Katstrel
// @description  Allows for color coding tags.
// @version      1.1.1
// @namespace    https://github.com/Katstrel/Kats-Tweaks-and-Skins
// @include      https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530471/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Tag%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/530471/%5BAO3%5D%20Kat%27s%20Tweaks%3A%20Tag%20Colors.meta.js
// ==/UserScript==
"use strict";
let DEBUG = true;

// তততততততত SETTINGS তততততততত //

let SETTINGS = {
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

// তততততত STOP SETTINGS তততততত //

class TagColors {
    constructor(settings, moduleID) {
        this.id = moduleID;
        this.settings = settings.tagColor;
        this.bookmark = settings.bookmarking;

        // All blurbs
        document.querySelectorAll('li.work.blurb, li.bookmark.blurb, dl.work.meta, dl.series.meta, li.series.blurb').forEach(blurb=> {
            if (blurb.querySelector('p.message')) { return; }
            DEBUG && console.log(`[Kat's Tweaks] Blurb found: `, blurb);

            this.blurbTags(blurb, 'WARN', this.settings.databaseWarn, 'dd.warning a.tag, ul.tags li.warnings a');
            this.blurbTags(blurb, 'SHIP', this.settings.databaseShip, 'dd.relationship a.tag, ul.tags li.relationships a');
            this.blurbTags(blurb, 'CHAR', this.settings.databaseChar, 'dd.character a.tag, ul.tags li.characters a');
            this.blurbTags(blurb, 'FREE', this.settings.databaseFree, 'dd.freeform a.tag, ul.tags li.freeforms a');

            this.hiddenTags(blurb, 'WARN', this.settings.databaseWarn, 'warning');
            this.hiddenTags(blurb, 'FREE', this.settings.databaseFree, 'freeform');

        });

        // Add styling to tags
        this.styleTags('WARN', this.settings.databaseWarn, this.settings.cssMode);
        this.styleTags('SHIP', this.settings.databaseShip, this.settings.cssMode);
        this.styleTags('CHAR', this.settings.databaseChar, this.settings.cssMode);
        this.styleTags('FREE', this.settings.databaseFree, this.settings.cssMode);

    }

    hiddenTags(blurb, listID, database, tagClass) {
        let hidden = false;
        let tag = blurb.querySelector(`li.${tagClass}s a`);
        if (!tag) { return; }
        if ((tag.innerText == 'Show warnings') || (tag.innerText == 'Show additional tags')) {
            hidden = true;
        }

        if (hidden) {
            tag.addEventListener('click', async (event) => {
                event.preventDefault();
                await new Promise(res => setTimeout(res, 250));
                this.blurbTags(blurb, listID, database, `dd.${tagClass} a.tag, ul.tags li.${tagClass}s a`)
            });
        }
    }

    blurbTags(blurb, tagType, database, query) {
        let tags = blurb.querySelectorAll(query);
        DEBUG && console.log(`[Kat's Tweaks] Tags found: `, tags);
        tags.forEach(tag => {
            database.forEach(({keyID, tagNames}) => {
                let tagIncluded = false;
                tagNames.forEach((tagText) => {
                    if (tag.innerText.includes(tagText)) {
                        tagIncluded = true;
                    }
                });
                if (tagIncluded) {
                    tag.classList.add(`${this.id}-${tagType}-${keyID}`);
                    DEBUG && console.log(`[Kat's Tweaks] Tag ${tagNames} set to ${keyID}`);
                }
            });
        });
    }

    styleTags(tagType, database, useCSS) {
        database.sort((a,b) => a.priority - b.priority);
        database.forEach(({keyID, color, css}) => {
            if (useCSS) {
                StyleManager.addStyle(`ADVANCED ${tagType}-${keyID}`, `.${this.id}-${tagType}-${keyID} { ${css} }`);
            }
            else {
                StyleManager.addStyle(`SIMPLE ${tagType}-${keyID}`, `.${this.id}-${tagType}-${keyID} { background-color: ${color} !important; }`);
            }
        });
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
}

class Main {
    constructor() {
        this.settings = this.loadSettings();
        if (this.settings.tagColor.enabled) {
            let moduleID = "KT-COLR";
            console.info(`[Kat's Tweaks] Tag Color | Initialized with:`, this.settings.tagColor);
            new TagColors(this.settings, moduleID);
        }
    }

    // Load settings from the storage or fallback to default ones
    loadSettings() {
        const startTime = performance.now();
        let savedSettings = localStorage.getItem('KT-SavedSettings');
        let settings = SETTINGS;

        if (savedSettings) {
            try {
                let parse = JSON.parse(savedSettings);
                DEBUG && console.log(`[Kat's Tweaks] Settings loaded successfully:`, savedSettings);
                if (parse.tagColor) {
                    settings = parse;
                }
            } catch (error) {
                DEBUG && console.error(`[Kat's Tweaks] Error parsing settings: ${error}`);
            }
        } else {
            DEBUG && console.warn(`[Kat's Tweaks] No saved settings found for Tag Color, using default settings.`);
        }

        const endTime = performance.now();
        DEBUG && console.log(`[Kat's Tweaks] Settings loaded in ${endTime - startTime} ms`);
        return settings;
    }
}

new Main();