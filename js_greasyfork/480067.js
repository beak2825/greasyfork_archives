// ==UserScript==
// @name         Admin URL Rewrite
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically updates admin links to point to the internal or external site depending on your settings.
// @author       https://github.com/cgriebel
// @match        https://roger-team.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/480067/Admin%20URL%20Rewrite.user.js
// @updateURL https://update.greasyfork.org/scripts/480067/Admin%20URL%20Rewrite.meta.js
// ==/UserScript==
/* global $ GM_config */

(function () {
    'use strict';

    let initialized = false;
    const internal = "admin.i.corpayone.com"
    const external = "admin.corpayone.com"

    let gmc = new GM_config(
        {
            'id': 'Admin_URL_Rewrite',
            'title': 'Admin URL Rewrite',
            'fields':
            {
                'fleetcor':
                {
                    'label': 'Are you on the Fleetcor VPN?',
                    'type': 'checkbox',
                    'default': false,
                },
                'initialized': {
                    type: 'hidden',
                    default: false,
                },
            },
            'events':
            {
                'init': function () {
                    if (!this.get('initialized')) {
                        this.open();
                        const style = this.frame.style
                        style.width = '280px';
                        style.height = '145px';
                        style.inset = undefined;
                        style.top = '50%';
                    }
                    else {
                        initialized = true;
                    }
                },
                'save': function () {
                    this.set('initialized', true);
                    initialized = true;
                    this.frame.style.display = 'none';
                }
            },
        });


    const interval = setInterval(() => {
        console.log(initialized)
        if (initialized) replaceLinks();
    }, 250)

    function replaceLinks() {
        const source = gmc.get('fleetcor') ? internal : external
        const target = gmc.get('fleetcor') ? external : internal
        const externalLinks = [...document.querySelectorAll(`a[href*="${source}"]`)]
        externalLinks.forEach(node => {
            if (node.innerHTML) {
                node.innerHTML = node.innerHTML.replace(source, target);
            }
            if (node.title) {
                node.title = node.title.replace(source, target);
            }
            node.href = node.href.replace(source, target);
        })
    }
})();