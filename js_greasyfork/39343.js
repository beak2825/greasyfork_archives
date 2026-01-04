// ==UserScript==
// @name            StackExchange link newtaber
// @namespace       almaceleste
// @version         0.4.2
// @description     opens links from posts, answers, comments and user signatures in the new tab instead of the annoying in-place opening
// @description:ru  открывает ссылки из постов, ответов, комментариев и подписей пользователей в новой вкладке вместо надоедливого открытия в текущей
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/simple-icons/32/stackexchange-32-black.png
// @icon64          https://cdn1.iconfinder.com/data/icons/simple-icons/128/stackexchange-128-black.png

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

// @match           https://*.stackexchange.com/questions/*
// @match           https://*.stackoverflow.com/questions/*
// @match           https://askubuntu.com/questions/*
// @match           https://mathoverflow.net/questions/*
// @match           https://serverfault.com/questions/*
// @match           https://stackapps.com/questions/*
// @match           https://superuser.com/questions/*
// @downloadURL https://update.greasyfork.org/scripts/39343/StackExchange%20link%20newtaber.user.js
// @updateURL https://update.greasyfork.org/scripts/39343/StackExchange%20link%20newtaber.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// script variables
const postlink = '.js-post-body a';
const commentlink = '.comment-body a';
const userdetailslink = '.user-details a';

// config settings
const configId = 'newtaberCfg';
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
    height: 245px;
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
        postlink: {
            section: ['Link types', 'Choose link types to open in new tab'],
            label: 'post links',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        commentlink: {
            label: 'comment links',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        userdetailslink: {
            label: 'userdetails links',
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

    var links = [];

    if(GM_config.get('postlink')) links.push(postlink);
    if(GM_config.get('commentlink')) links.push(commentlink);
    if(GM_config.get('userdetailslink')) links.push(userdetailslink);

    var pattern = links.join(', ');

    $(pattern).attr('target', '_blank');
})();
