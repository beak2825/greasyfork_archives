// ==UserScript==
// @name            Gnome Extensions tweaks
// @namespace       almaceleste
// @version         0.4.7
// @description     opens extension pages in the new tab and changes a sort type of the extensions list
// @description:ru  открывает страницы расширений в новой вкладке и изменяет сортировку списка расширений
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/gnome-32.png
// @icon64          https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/gnome-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand

// @match           https://extensions.gnome.org/
// @match           https://extensions.gnome.org/#sort*
// @downloadURL https://update.greasyfork.org/scripts/39797/Gnome%20Extensions%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/39797/Gnome%20Extensions%20tweaks.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const extensionsdiv = 'extensions-list';
const extensionslist = 'extensions';
const extensionlink = 'a.title-link';
const navbarbtn = '#navbar-wrapper a:contains("Extensions")';

const configId = 'getweaksCfg';
const windowcss = `
    #${configId} {
        background-color: darkslategray;
        color: whitesmoke;
    }
    #${configId} a,
    #${configId} button,
    #${configId} input,
    #${configId} select,
    #${configId} select option,
    #${configId} .section_desc {
        color: whitesmoke !important;
    }
    #${configId} a,
    #${configId} button,
    #${configId} input,
    #${configId} .section_desc {
        font-size: .8em !important;
    }
    #${configId} button,
    #${configId} input,
    #${configId} select,
    #${configId} select option,
    #${configId} .section_desc {
        background-color: #333;
        border: 1px solid #222;
    }
    #${configId} button{
        height: 1.65em !important;
    }
    #${configId}_header {
        font-size: 1.3em !important;
    }
    #${configId}.section_header {
        background-color: #454545;
        border: 1px solid #222;
        font-size: 1em !important;
    }
    #${configId} .field_label {
        font-size: .7em !important;
    }
    #${configId}_buttons_holder {
        position: fixed;
        width: 97%;
        bottom: 0;
    }
    #${configId} .reset_holder {
        float: left;
        position: relative;
        bottom: -1em;
    }
    #${configId} .saveclose_buttons {
        margin: .7em;
    }
    #${configId}_field_support {
        background: none !important;
        border: none !important;
        cursor: pointer !important;      
        padding: 0 !important;
        text-decoration: underline !important;
    }
    #${configId}_field_support:hover,
    #${configId}_resetLink:hover {
        filter: drop-shadow(0 0 1px dodgerblue);
    }
`;
const iframecss = `
    height: 15em;
    width: 30em;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        extensionlink: {
            section: ['', 'Settings'],
            label: 'open extension links in new tab',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        sorttype: {
            label: 'extension list sort type',
            labelPos: 'left',
            type: 'select',
            options: ['name', 'recent', 'downloads', 'popularity'],
            default: 'recent',
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

(function() {
    'use strict';

    const sorttype = '#sort=' + GM_config.get('sorttype');
    if (window.location.pathname == '/'){
        window.location.hash = sorttype;
    }

    $(document).ready(() => {
        if(GM_config.get('extensionlink')) {
            var targetNode, callback, observer;
            var config = {childList: true};
            targetNode = document.getElementById(extensionsdiv);
            callback = function(e){
                if(e.nodeName == 'UL' && e.className == extensionslist){
                    observer.disconnect();
                    $(extensionlink).attr('target', '_blank');
                }
            };

            observer = new MutationObserver(function(mutations) {
                for(var m of mutations) {
                    m.addedNodes.forEach(callback);
                }
            });

            observer.observe(targetNode, config);
        }
    });
})();
