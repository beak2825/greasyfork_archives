// ==UserScript==
// @name            OpenSuse Software tweaks
// @namespace       almaceleste
// @version         0.1.2
// @description     opens package pages in new tab and minify huge package list
// @description:ru  открывает страницы пакетов в новой вкладке и уменьшает список найденных пакетов
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/opensuse-32.png
// @icon64          https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/opensuse-128.png

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

// @match           https://software.opensuse.org/search*
// @match           https://software.opensuse.org/package/*
// @downloadURL https://update.greasyfork.org/scripts/40059/OpenSuse%20Software%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/40059/OpenSuse%20Software%20tweaks.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// script global variables
const searchbox = '.search-box';
const searchresultlist = '.search-result-list';
const packagelink = '.package-card a';
const container = '.container';
const cardimg = '.package-card .card-img-top';
const cardblock = '.card-block';
const card = '.col-md-4';

// config settings
const configId = 'osstweaksCfg';
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
    height: 305px;
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
        packagelink: {
            section: ['Package list', 'tweaks for package list'],
            label: 'open packages on new tab',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        searchlist: {
            label: 'minify search list',
            labelPos: 'right',
            type: 'checkbox',
            default: 'true',
        },
        iconmini: {
            section: ['Package page', 'tweaks for package page'],
            label: 'minify package image',
            labelPos: 'right',
            type: 'checkbox',
            default: 'true',
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

    $(document).ready(function(){
        if(GM_config.get('packagelink')) {
            $(packagelink).each(function() {
                $(this).attr('target', '_blank');
            });
        }

        if(GM_config.get('searchlist')) {
            $(searchbox).css({
                paddingBottom: '0 !important',
                paddingTop: '1rem !important',
            });
            $(container).css({
                padding: '0',
                width: '90%',
            });
            $(searchresultlist).css({
                margin: '0 auto',
            });
            $(card).css({
                flex: '0 0 auto !important',
                maxWidth: 'none !important',
                width: '23.5rem !important',
            });
            $(cardimg).css({
                height: '8rem',
            });
            $(cardblock).css({
                padding: '.95rem',
            });
        }

        if(GM_config.get('iconmini')) {
            $('img.img-fluid').width('10em');
            $('#search_result_container .row .col-md-6:first-child').css({
                flexBasis: 'auto',
                width: '11em',
            });
            $('#search_result_container .row .col-md-6:last-child').css({
                flexBasis: 'auto',
                maxWidth: '75%',
            });
        }
    });
})();
