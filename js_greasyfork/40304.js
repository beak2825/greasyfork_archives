// ==UserScript==
// @name            External link newtaber
// @namespace       almaceleste
// @version         0.3.4
// @description     opens external links in a new tab on all sites (now can work with dynamic link lists, such as search results)
// @description:ru  открывает внешние ссылки в новой вкладке на всех сайтах (теперь должно работать с динамическими списками ссылок, такими как результаты поисковых запросов)
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-32.png
// @icon64          https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-128.png

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
// @downloadURL https://update.greasyfork.org/scripts/40304/External%20link%20newtaber.user.js
// @updateURL https://update.greasyfork.org/scripts/40304/External%20link%20newtaber.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// script global variables
let host = window.location.hostname;
const root = '*.' + host.split('.').pop();
const flat = host.replace(/\..*/, '');
let parent = host.replace(/^[^.]*\./, '');
const child = '*.' + host;
const neighbor = '*.' + parent;

// config settings
const configId = 'allnewtaberCfg';
const iconUrl = GM_info.script.icon64;
const pattern = {};
pattern[`#${configId}`] = /#configId/g;
pattern[`${iconUrl}`] = /iconUrl/g;

let css = GM_getResourceText('css');
Object.keys(pattern).forEach((key) => {
    css = css.replace(pattern[key], key);
});
const windowcss = css;
const iframecss = `
    height: 375px;
    width: 435px;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        rootzone: {
            section: ['', 'Exclude these domains (do not open in new tab)'],
            label: `parent and neighbor sites if parent site is a root domain (${root})`,
            labelPos: 'right',
            type: 'checkbox',
            default: false,
        },
        parent: {
            label: `parent site links (${parent})`,
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        neighbor: {
            label: `neighbor site links (${neighbor})`,
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        host: {
            label: `this site links (${host})`,
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        child: {
            label: `child site links (${child})`,
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        background: {
            section: ['', 'Other options'],
            label: 'open new tab in background',
            labelPos: 'right',
            type: 'checkbox',
            default: false,
        },
        insert: {
            label: 'insert new tab next to the current instead of the right end',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        setParent: {
            label: 'return to the current tab after new tab closed',
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

// script code
(function() {
    'use strict';

    const empty = new RegExp('^$');
    let patternparent = empty;
    let patternhost = empty;
    host = host.replace(/\./g, '\\\.');
    parent = parent.replace(/\./g, '\\\.');
    const background = GM_config.get('background');
    const insert = GM_config.get('insert');
    const setParent = GM_config.get('setParent');
    const options = {active: !background, insert: insert, setParent: setParent};

    if (GM_config.get('parent')){patternparent = new RegExp(`^${parent}$`);}    // abc.x               => ^abc\.x$
    if (GM_config.get('neighbor')){
        if (GM_config.get('parent')){
            patternparent = new RegExp(`[^(${flat}\.)]?${parent}$`);     // abc.x + *.abc.x     => [^(w\.)]?abc\.x$
        }
        else {patternparent = new RegExp(`[^(${flat})]?\.${parent}$`);}  // *.abc.x             => [^(w)]?\.abc\.x$
    }
    if (!GM_config.get('rootzone') && parent.search(/\..+\./) == -1){patternparent = empty;}
    if (GM_config.get('host')){patternhost = new RegExp(`^${host}$`);}    // w.abc.x             => ^w\.abc\.x$
    if (GM_config.get('child')){
        if (GM_config.get('host')){
            patternhost = new RegExp(`(.+\.)?${host}$`);                  // w.abc.x + *.w.abc.x => (.+\.)?w\.abc\.x$
        }
        else {patternhost = new RegExp(`.+\.${host}$`);}                  // *.w.abc.x           => .+\.w\.abc\.x$
    }

    window.onload = function(){
        const anchors = document.getElementsByTagName('a');
        for (let i = 0; i < anchors.length; i++) {
            const a = anchors[i];
            const target = a.host;
            if (a.hasAttribute('href')){
                if (target && !empty.test(target)){
                    if (!patternparent.test(target) && !patternhost.test(target)){
                        a.addEventListener('click', newtaber);
                    }
                }
            }
        }
    }

    function newtaber(e){
        e.preventDefault();
        e.stopPropagation();
        GM_openInTab(this.href, options);
    }
})();
