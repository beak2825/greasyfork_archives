// ==UserScript==
// @name           TGithub
// @author         Alexandre Díaz
// @version        1.15
// @grant          none
// @run-at         document-idle
// @namespace      tecnativa
// @icon           https://www.tecnativa.com/web/image/website/1/favicon/
// @include        /^https?:\/\/(?:www\.)?github\.com\/?.*$/
// @include        /^https?:\/\/(?:www\.)?gitlab\.tecnativa\.com\/?.*$/
// @description    Adds some features on github.com & gitlab.com to integrate it with tecnativa.com
// @downloadURL https://update.greasyfork.org/scripts/390531/TGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/390531/TGithub.meta.js
// ==/UserScript==

(function (window) {
    "use strict";

    var TGithub = {
        ODOO_SERVER: 'https://www.tecnativa.com',
        COMPANY_NAME: 'Tecnativa',

        REGEX_TEMPLATES: {},

        init: function () {
            this._addRegexTemplate('TT', new RegExp(/\bTT(\d+)/gi), `<a target='_blank' href='${this.ODOO_SERVER}/web#id=$1&model=project.task&view_type=form'>${this.COMPANY_NAME}-Task #$1</a>`);

            this._replaceTask();
            if (this._isLocationHost('github')) {
                this._ghAddNavbarOptions();
            }
        },

        /* CORE FUNCTIONS */
        _isLocationHost: function (host) {
            return document.location.host.toLowerCase().includes(host);
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
                document.querySelectorAll('.comment-body,.note-text,.description,.commit-description').forEach((elm) => {
                    const htmlTemplate = this._executeRegexReplace('TT', elm.innerHTML);
                    if (htmlTemplate) {
                        elm.innerHTML = htmlTemplate;
                    }
                });
            };
            // Mutation Observer
            if (typeof this.observer === 'undefined') {
                let targetNode = undefined;
                if (this._isLocationHost('github')) {
                    targetNode = document.getElementsByTagName('main')[0];
                } else if (this._isLocationHost('gitlab')) {
                    targetNode = document.getElementById('notes-list');
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

    TGithub.init();

})(window)
