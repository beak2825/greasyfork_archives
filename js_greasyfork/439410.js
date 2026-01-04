// ==UserScript==
// @name           OdooTasksLinks
// @original       https://greasyfork.org/es/scripts/390531-tgithub
// @author         Eduardo de Miguel
// @version        18.1.0
// @grant          none
// @run-at         document-idle
// @namespace      moduon
// @include        /^https?:\/\/(?:www\.)?github\.com\/?.*$/
// @include        /^https?:\/\/(?:www\.)?gitlab\.com\/?.*$/
// @include        /^https?:\/\/(?:www\.)?moduon\.team\/?.*$/
// @include        /^https?:\/\/(?:www\.)?loom\.com\/?.*$/
// @include        /^https?:\/\/(?:www\.)?youtube\.com\/?.*$/
// @include        /^https?:\/\/(?:www\.)?odoo\.com\/?.*$/
// @description    Adds some features on github.com, gitlab.com, moduon.team, loom.com and youtube.com to integrate it with Moduon Team and Odoo (Odoo v18+)
// @downloadURL https://update.greasyfork.org/scripts/439410/OdooTasksLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/439410/OdooTasksLinks.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function (window) {
    "use strict";

    var MTTaskLinks = {
        ODOO_SERVER: 'https://www.moduon.team',
        COMPANY_NAME: 'Moduon',
        COPY_REF_BUTTON_ID: 'OTL_copy_ref',
        MENU_ID: 256,
        ACTION_ID: 387,

        REGEX_TEMPLATES: {},
        QUERY_SELECTORS: {
            'github': ['.markdown-body'],
            'gitlab': ['.note-text', '.description', '.commit-box>.commit-description'],
            'moduon': ['div.o-mail-Message-body>p', '.o-mail-Activity-note>p'], // , '.o-mail-Activity-info>span.text-break'
            'loom': ['.below-video>span>span'],
            'youtube': ['div[id="title"]>h1.ytd-watch-metadata>yt-formatted-string.ytd-watch-metadata', 'span[id="plain-snippet-text"]', 'yt-formatted-string[id="content-text"]'],
            'odoo': ['div#card_body'], // Unable to track messages due to post-load of page
        },
        COMMON_QUERY_SELECTORS: '.commit-description,',
        init: function () {
            this._addRegexTemplate('MT', new RegExp(/\bMT-(\d+)/gi), `<a target="_blank" rel="noreferrer noopener" href="${this.ODOO_SERVER}/odoo/project.task/$1">${this.COMPANY_NAME} - Task #$1</a>`);
            this._addRegexTemplate('OPW', new RegExp(/\bOPW-(\d+)/gi), `<a target='_blank' href='https://www.odoo.com/my/tasks/$1'>Odoo - Ticket #$1</a>`);

            this._replaceTask();
            if (this._isLocationHost('github')) {
                this._ghAddNavbarOptions();
            }
        },

        /* CORE FUNCTIONS */
        _isLocationHost: function (host) {
            return this._getLocationHost().includes(host);
        },
        _getLocationHost: function() {
            return document.location.host.toLowerCase();
        },
        _addRegexTemplate: function (templateName, regex, html) {
            this.REGEX_TEMPLATES[templateName] = { regex: regex, html: html };
        },
        _executeRegexReplace: function (templateName, text) {
            if (templateName in this.REGEX_TEMPLATES && text.match(this.REGEX_TEMPLATES[templateName].regex)) {
                return text.replace(this.REGEX_TEMPLATES[templateName].regex, this.REGEX_TEMPLATES[templateName].html);
            }
            return false;
        },

        /* COMMON FUNCTIONS */
        _replaceTask: function () {
            const searchAndParse = () => {
                if (this.QUERY_SELECTORS[this._getLocationHost()]) {
                    var hostQuerySelector = this.QUERY_SELECTORS[this._getLocationHost()].join(',');
                } else {
                    var hostQuerySelector = Object.values(this.QUERY_SELECTORS).map(function(v){
                        return v.join(',');
                    }).join(',');
                }
                // Replace Company Links
                document.querySelectorAll(this.COMMON_QUERY_SELECTORS + hostQuerySelector).forEach((elm) => {
                    const htmlTemplate = this._executeRegexReplace('MT', elm.innerHTML);
                    if (htmlTemplate) {
                        elm.innerHTML = htmlTemplate;
                    }
                });
                // Replace Odoo Links
                document.querySelectorAll(this.COMMON_QUERY_SELECTORS + hostQuerySelector).forEach((elm) => {
                    const htmlTemplate = this._executeRegexReplace('OPW', elm.innerHTML);
                    if (htmlTemplate) {
                        elm.innerHTML = htmlTemplate;
                    }
                });
            };
            // Mutation Observer
            if (typeof this.observer === 'undefined') {
                let targetNode;
                if (this._isLocationHost('github')) {
                    targetNode = document.getElementsByTagName('main')[0];
                } else if (this._isLocationHost('gitlab')) {
                    targetNode = document.getElementById('notes-list');
                    if (!targetNode){
                        targetNode = document.getElementsByClassName('js-pipeline-container')[0]; // Pipelines
                    }
                } else if (this._isLocationHost('moduon')) {
                    targetNode = document.getElementsByClassName('o_web_client')[0];
                } else if (this._isLocationHost('loom')) {
                    targetNode = document.getElementsByClassName('mainContent')[0];
                } else if (this._isLocationHost('youtube')) {
                    targetNode = document.getElementById('content');
                }
                if (typeof targetNode !== 'undefined') {
                    this.observer = new MutationObserver(searchAndParse);
                    this.observer.observe(targetNode, { childList: true, subtree: true });
                }
            }
            searchAndParse();
        },

        /* GITHUB FUNCTIONS */
        _ghAddNavbarOptions: function () {
            const targetNode = document.getElementsByTagName('nav')[0];
            if (typeof targetNode !== 'undefined') {
                const exampleItem = targetNode.querySelector("a[href^='/pulls']");
                const menuItem = document.createElement("A");
                menuItem.className = exampleItem.className;
                menuItem.style.cssText = exampleItem.style.cssText
                menuItem.textContent = this.COMPANY_NAME;
                menuItem.href = `/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+involves%3A${this.COMPANY_NAME}`;
                targetNode.insertAdjacentElement('afterbegin', menuItem);
            }
        },
    };

    MTTaskLinks.init();

})(window)