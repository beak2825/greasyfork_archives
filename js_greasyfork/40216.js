// ==UserScript==
// @name            Hola Mundo
// @namespace       almaceleste
// @version         0.5.4
// @description     does nothing, just writes a welcome message to the console. a very simple userscript that illustrates the use of the GM_config library, remote resources, themes and some common userscript mechanics
// @description:ru  не делает ничего, просто пишет приветственное сообщение в консоль. очень простой пользовательский скрипт, который иллюстрирует использование библиотеки GM_config, удаленных ресурсов, тем и некоторых общих механик пользовательского скрипта
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl
// @icon            https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-32.png
// @icon64          https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues

// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           http*://*/*
// @downloadURL https://update.greasyfork.org/scripts/40216/Hola%20Mundo.user.js
// @updateURL https://update.greasyfork.org/scripts/40216/Hola%20Mundo.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// set id that will used for an id of the settings window (frame)
const configId = 'holamundoCfg';
// set url to a usercript icon in the settings window
const iconUrl = GM_info.script.icon64;

// set patterns for replacing specific selectors in a default, centralized css (for settings window)
const pattern = {};
pattern[`#${configId}`] = /#configId/g;
pattern[`${iconUrl}`] = /iconUrl/g;

// get remote default css
let css = GM_getResourceText('css');
// iterate patterns and replace found substrings with them
Object.keys(pattern).forEach((key) => {
    css = css.replace(pattern[key], key);
});
const windowcss = css;
// main parameters of the settings window (frame). specific to each script due to the different amount of the parameters in each script
const iframecss = `
    height: 265px;
    width: 435px;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

// register settings menu in a userscript manager (Tampermonkey, Greasemonkey or other)
GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

// definition of the settings parameters for the script
GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        greeting: {
            section: ['Words', 'welcome words for writing to the console'],
            label: 'greeting word',
            labelPos: 'left',
            type: 'text',
            default: 'hola',
        },
        appeal: {
            label: 'appeal word',
            labelPos: 'left',
            type: 'text',
            default: 'mundo',
        },
        exclamation: {
            label: 'upside-down exclamation',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        support: {
            section: ['', 'Support'],
            label: 'almaceleste.github.io',
            title: 'more info on almaceleste.github.io',
            type: 'button',
            click: () => {
                GM_openInTab('https://almaceleste.github.io', {
                    active: true,
                    insert: true,
                    setParent: true
                });
            }
        },
    },
    css: windowcss,
    events: {
        save: function() {
            GM_config.close();
        }
    },
});

// functions that are used in the main function
function echo(message){
    console.log(message);
}

// userscipt main function that started when page are loaded
(function() {
    'use strict';

    // set greeting message
    let greeting;
    // use checkbox parameter as boolean to determine whether an inverted exclamation mark is needed or not
    greeting = `${GM_config.get('exclamation') ? '¡' : ''}`;
    // add greeting words
    greeting += `${GM_config.get('greeting')}, ${GM_config.get('appeal')}!`;
    
    // call messaging function
    echo(greeting);
})();
