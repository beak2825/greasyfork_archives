// ==UserScript==
// @name            Watch Transition
// @namespace       almaceleste
// @version         0.2.0
// @description     watches for a transition event and prints it to the console
// @description:ru  отслеживает событие transition и выводит его в консоль
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl
// @icon            https://cdn1.iconfinder.com/data/icons/jumpicon-basic-ui-line-1/32/-_Eye-Show-View-Watch-See-16.png
// @icon64          https://cdn1.iconfinder.com/data/icons/jumpicon-basic-ui-line-1/32/-_Eye-Show-View-Watch-See-64.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab

// @match           http*://*/*
// @downloadURL https://update.greasyfork.org/scripts/403416/Watch%20Transition.user.js
// @updateURL https://update.greasyfork.org/scripts/403416/Watch%20Transition.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const windowcss = `
    #wtCfg {
        background-color: lightblue;
    }
    #wtCfg .reset_holder {
        float: left;
        position: relative;
        bottom: -1em;
    }
    #wtCfg .saveclose_buttons {
        margin: .7em;
    }
    #wtCfg_field_url {
        background: none !important;
        border: none;
        cursor: pointer;
        padding: 0 !important;
        text-decoration: underline;
    }
    #wtCfg_field_url:hover,
    #wtCfg_resetLink:hover {
        filter: drop-shadow(0 0 1px dodgerblue);
    }
`;
const iframecss = `
    height: 34.5em;
    width: 25em;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

GM_registerMenuCommand('Watch Transition Settings', opencfg);

function opencfg(){
	GM_config.open();
	wtCfg.style = iframecss;
}

GM_config.init({
    id: 'wtCfg',
    title: `Watch Transition ${GM_info.script.version}`,
    fields: {
        run: {
            section: ['', 'Watch events'],
            label: 'transitionrun (created, not started)',
            labelPos: 'right',
            title: 'fired when a CSS transition is created, when it is added to a set of running transitions, though not necessarily started',
            type: 'checkbox',
            default: false,
        },
        start: {
            label: 'transitionstart (started)',
            labelPos: 'right',
            title: 'fired when a CSS transition has started transitioning',
            type: 'checkbox',
            default: false,
        },
        cancel: {
            label: 'transitioncancel (canceled)',
            labelPos: 'right',
            title: 'fired when a CSS transition has been cancelled',
            type: 'checkbox',
            default: false,
        },
        end: {
            label: 'transitionend (finished)',
            labelPos: 'right',
            title: 'fired when a CSS transition has finished playing (most useful)',
            type: 'checkbox',
            default: true,
        },
        property: {
            label: 'print event property',
            labelPos: 'left',
            type: 'select',
            title: 'print one preferred event property before the whole event',
            options: [
                'none',
                'bubbles',
                'cancelBubble',
                'cancelable',
                'composed',
                'currentTarget',
                'defaultPrevented',
                'elapsedTime',
                'eventPhase',
                'isTrusted',
                'path',
                'propertyName',
                'pseudoElement',
                'returnValue',
                'srcElement',
                'target',
                'timestamp',
                'type'
            ],
            default: 'target',
        },
        italic: {
            section: ['', 'Style Settings'],
            label: 'italic font',
            labelPos: 'right',
            type: 'checkbox',
            default: false,
        },
        bold: {
            label: 'bold font',
            labelPos: 'right',
            type: 'checkbox',
            default: false,
        },
        method: {
            label: 'console method',
            labelPos: 'left',
            type: 'select',
            options: [
                'debug',
                'dir',
                'dirxml',
                'error',
                'info',
                'log',
                'warn'
            ],
            default: 'log',
        },
        runcolor: {
            label: 'transitionrun color',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        runbackground: {
            label: 'transitionrun background',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        startcolor: {
            label: 'transitionstart color',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        startbackground: {
            label: 'transitionstart background',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        cancelcolor: {
            label: 'transitioncancel color',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        cancelbackground: {
            label: 'transitioncancel background',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        endcolor: {
            label: 'transitionend color',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        endbackground: {
            label: 'transitionend background',
            labelPos: 'left',
            type: 'select',
            options: [
                'unset',
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray'
            ],
            default: 'unset',
        },
        url: {
            section: ['', 'Support'],
            label: 'almaceleste.github.io',
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

function log(type, event){
    const color = GM_config.get(`${type}color`);
    const background = GM_config.get(`${type}background`);
    const style = `
        color: ${color};
        background-color: ${background};
        font-style: ${GM_config.get('italic') ? 'italic' : 'unset'};
        font-weight: ${GM_config.get('bold') ? 'bold' : 'unset'};
    `;
    let property = GM_config.get('property');

    if (property != 'none') {
        property = event.originalEvent[property];
    }
    else {
        property = '';
    }

    switch (GM_config.get('method')) {
        case 'debug':
            console.debug(`%ctransition${type}:`, style, property, event.originalEvent);
            break;
        case 'dir':
            console.log(`%ctransition${type}:`, style, property);
            console.dir(event.originalEvent);
            break;
        case 'dirxml':
            console.log(`%ctransition${type}:`, style, property);
            console.dirxml(event.originalEvent);
            break;
        case 'error':
            console.error(`%ctransition${type}:`, style, property, event.originalEvent);
            break;
        case 'info':
            console.info(`%ctransition${type}:`, style, property, event.originalEvent);
            break;
        case 'log':
            console.log(`%ctransition${type}:`, style, property, event.originalEvent);
            break;
        case 'warn':
            console.warn(`%ctransition${type}:`, style, property, event.originalEvent);
            break;
        default:
            console.log(`%ctransition${type}:`, style, property, event.originalEvent);
            break;
    }
}

(function() {
    'use strict';

    $(document).ready(() => {

        $(window).on({
            transitionrun: (e) => {
                if (GM_config.get('run')) {
                    log('run', e);
                }
            },
            transitionstart: (e) => {
                if (GM_config.get('start')) {
                    log('start', e);
                }
            },
            transitioncancel: (e) => {
                if (GM_config.get('cancel')) {
                    log('cancel', e);
                }
            },
            transitionend: (e) => {
                if (GM_config.get('end')) {
                    log('end', e);
                }
            },
        });
    });
})();
