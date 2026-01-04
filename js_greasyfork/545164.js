// ==UserScript==
// @name         [0]JAV跳转
// @version      1.1
// @description  Simplified JAV site navigation
// @license      GPL
// @match        *://*.javlibrary.com/*
// @match        *://*.javbus.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// @namespace    https://sleazyfork.org/zh-CN/scripts/428639-onejavoneweb


// @downloadURL https://update.greasyfork.org/scripts/545164/%5B0%5DJAV%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/545164/%5B0%5DJAV%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Simplified Configuration
    const jav_configuration = {
        javbus: 'https://www.javbus.com',
        javlibrary: 'https://www.javlibrary.com',
        magnet: 'https://sukebei.nyaa.si/',
        jable: 'https://jable.tv/videos/',
        netflav: 'https://netflav.com/search?type=title&keyword='
    };

    // Basic Styles (Simplified) — inject without GM APIs for MV3 compatibility
    const styleElement = document.createElement('style');
    styleElement.textContent = [
        '.jav-table {',
        '  font-family: sans-serif;',
        '  font-size: 14px;',
        '  background-color: #fff;',
        '  border: 1px solid #ccc;',
        '  padding: 5px;',
        '  position: absolute;',
        '  z-index: 9999;',
        '}',
        '.jav-link {',
        '  display: block;',
        '  margin-bottom: 3px;',
        '  color: #337ab7;',
        '}',
        '.jav-link:hover {',
        '  text-decoration: underline;',
        '}'
    ].join('\n');
    if (document.head) {
        document.head.appendChild(styleElement);
    }

    class JAV {
        constructor(i) {
            this.fanhao = i.trim().replace(/ +/, '-'); // Simplified fanhao handling
        }

        create_table() {
            const javbusLink = `${jav_configuration.javbus}/search/${this.fanhao}`;
            const javlibraryLink = `${jav_configuration.javlibrary}/cn/vl_searchbyid.php?keyword=${this.fanhao}`;
            const magnetLink = `${jav_configuration.magnet}/?f=0&c=0_0&q=${this.fanhao}`;
            const jableLink = `${jav_configuration.jable}${this.fanhao}/`;
            const netflavLink = `${jav_configuration.netflav}${this.fanhao}`;

            return `<div class="jav-table">
                        <a class="jav-link" target="_blank" rel="noopener noreferrer" href="${javbusLink}">JavBus</a>
                        <a class="jav-link" target="_blank" rel="noopener noreferrer" href="${javlibraryLink}">JAVLibrary</a>
                        <a class="jav-link" target="_blank" rel="noopener noreferrer" href="${magnetLink}">Magnet Download</a>
                        <a class="jav-link" target="_blank" rel="noopener noreferrer" href="${jableLink}">Jable</a>
                        <a class="jav-link" target="_blank" rel="noopener noreferrer" href="${netflavLink}">NetFlav</a>
                    </div>`;
        }
    }

    const siteHandlers = [
        {
            // JavBus
            pageCheck: () => document.querySelector('body div.container div.movie.row div.col-md-9.screencap') !== null,
            hoverSelector: 'div.container div.movie.row div.col-md-9.screencap',
            getBango: () => {
                const el = document.querySelector('body div.container h3');
                return el ? (el.textContent || '').trim().split(' ')[0] : '';
            }
        },
        {
            // JavLibrary
            pageCheck: () => document.querySelector('body.main div#content div#rightcolumn table#video_jacket_info tbody tr td div#video_jacket') !== null,
            hoverSelector: '#video_jacket',
            getBango: () => {
                const el = document.querySelector('#video_title > h3');
                return el ? (el.textContent || '').trim().split(' ')[0] : '';
            }
        }
    ];

    const handler = siteHandlers.find(h => h.pageCheck());

    if (handler) {
        const onMouseOver = (event) => {
            const target = event.target;
            const container = target && typeof target.closest === 'function' ? target.closest(handler.hoverSelector) : null;
            if (!container) return;
            const from = event.relatedTarget;
            if (from && container.contains(from)) return; // ignore moves within the same container
            if (container.querySelector('.jav-table')) return; // already present
            const bango = handler.getBango();
            if (!bango) return;
            const jav = new JAV(bango);
            container.insertAdjacentHTML('afterbegin', jav.create_table());
        };

        const onMouseOut = (event) => {
            const target = event.target;
            const container = target && typeof target.closest === 'function' ? target.closest(handler.hoverSelector) : null;
            if (!container) return;
            const to = event.relatedTarget;
            if (to && container.contains(to)) return; // ignore moves within the same container
            const tip = container.querySelector('.jav-table');
            if (tip) tip.remove();
        };

        document.body.addEventListener('mouseover', onMouseOver, true);
        document.body.addEventListener('mouseout', onMouseOut, true);
    }
})();