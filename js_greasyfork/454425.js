"use strict";
// ==UserScript==
// @name        KameSame Open Framework - Injector module
// @namespace   timberpile
// @description Injector module for KameSame Open Framework
// @version     0.0.0.1
// @copyright   2022+, Timberpile
// @license     MIT; http://opensource.org/licenses/MIT
// ==/UserScript==

(async (global) => {
    const ksof = global.ksof;
    await ksof.ready('document');
    class Section {
        constructor(title) {
            this.html = document.createElement('div');
            this.header = {
                html: ksof.pageInfo.on !== 'item_page' ? document.createElement('h2') : document.createElement('h3'),
            };
            this.header.html.innerText = title;
            this.html.appendChild(this.header.html);
        }
    }
    class SettingsSection extends Section {
        constructor(title, onclick) {
            super(title);
            this.settingsButton = {
                html: document.createElement('i'),
            };
            this.settingsButton.html.textContent = '⚙';
            this.settingsButton.html.setAttribute('class', 'fa fa-gear');
            this.settingsButton.html.setAttribute('style', 'cursor: pointer; vertical-align: middle; margin-left: 10px;');
            if (onclick) {
                this.settingsButton.html.onclick = onclick;
            }
            this.header.html.append(this.settingsButton.html);
        }
    }
    const addSection = (section) => {
        switch (ksof.pageInfo.on) {
            case 'item_page':
                {
                    document.querySelector('#app.kamesame #item')?.appendChild(section.html);
                }
                break;
            case 'review':
                {
                    document.querySelector('.outcome')?.appendChild(section.html);
                }
                break;
            default:
                {
                    return undefined;
                }
                break;
        }
        return section;
    };
    ksof.Injector = {
        addSection: (title) => {
            return addSection(new Section(title));
        },
        addSettingsSection: (title, onclick) => {
            return addSection(new SettingsSection(title, onclick));
        },
    };
    // Notify listeners that we are ready.
    // Delay guarantees include() callbacks are called before ready() callbacks.
    setTimeout(() => { ksof.setState('ksof.Injector', 'ready'); }, 0);
})(window);
