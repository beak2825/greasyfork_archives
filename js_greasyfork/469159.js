// ==UserScript==
// @name           TGithub
// @author         Alexandre Díaz, Carlos Roca, Carlos Dauden
// @version        1.17.1
// @grant          none
// @run-at         document-idle
// @namespace      tecnativa
// @icon           https://www.tecnativa.com/web/image/website/1/favicon/
// @match          *://github.com/*
// @match          *://gitlab.tecnativa.com/*
// @description    Adds some features on github.com & gitlab.com to integrate it with tecnativa.com
// @downloadURL https://update.greasyfork.org/scripts/469159/TGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/469159/TGithub.meta.js
// ==/UserScript==

(function (window) {
    "use strict";

    const TGithub = {
        ODOO_SERVER: 'https://www.tecnativa.com',
        COMPANY_NAME: 'Tecnativa',
        REGEX_TEMPLATES: {},

        init: function () {
            if (this.initialized) {
                return;
            }
            this.initialized = true;
            this._addRegexTemplate('TT', /\bTT(\d+)/gi, `<a target='_blank' href='${this.ODOO_SERVER}/web#id=$1&model=project.task&view_type=form'>${this.COMPANY_NAME}-Task #$1</a>`);
            this._replaceTask();
            if (this._isLocationHost('github')) {
                this._ghAddNavbarOptions();
            }
        },

        _isLocationHost: function (host) {
            return document.location.host.toLowerCase().includes(host);
        },

        _addRegexTemplate: function (templateName, regex, html) {
            this.REGEX_TEMPLATES[templateName] = { regex, html };
        },

        _executeRegexReplace: function (templateName, text) {
            if (templateName in this.REGEX_TEMPLATES && text.match(this.REGEX_TEMPLATES[templateName].regex)) {
                return text.replace(this.REGEX_TEMPLATES[templateName].regex, this.REGEX_TEMPLATES[templateName].html);
            }
            return false;
        },

        _replaceTask: function () {
            const searchAndParse = () => {
                document.querySelectorAll('.comment-body, .note-text, .description, .commit-description, .js-comment-body, .js-issue-title, .markdown-body').forEach((elm) => {
                    const htmlTemplate = this._executeRegexReplace('TT', elm.innerHTML);
                    if (htmlTemplate) {
                        elm.innerHTML = htmlTemplate;
                    }
                });
            };
            // Setting up MutationObserver to handle dynamic content updates
            if (typeof this.observer === 'undefined') {
                const targetNode = document.body;

                if (targetNode) {
                    this.observer = new MutationObserver((mutations) => {
                        mutations.forEach(() => searchAndParse());
                    });
                    this.observer.observe(targetNode, { childList: true, subtree: true });
                }
            }
            // Initial execution to replace already loaded content
            searchAndParse();
        },

        _ghAddNavbarOptions: function () {
            const targetNode = document.querySelector('.AppHeader-globalBar-end') || document.querySelector('nav');
            if (targetNode) {
                const exampleItem = targetNode.querySelector("a[href^='/pulls']");
                const tecnativaItem = targetNode.querySelector("a#pulls-tecnativa");
                if (exampleItem && !tecnativaItem) {
                    const menuItem = document.createElement("A");
                    menuItem.id = "pulls-tecnativa";
                    menuItem.className = exampleItem.className;
                    menuItem.style.cssText = exampleItem.style.cssText;
                    menuItem.textContent = this.COMPANY_NAME;
                    menuItem.href = `/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+involves%3A${this.COMPANY_NAME}`;
                    targetNode.insertAdjacentElement('afterbegin', menuItem);
                }
            }
        },

        // Override history methods to detect navigation
        overrideHistoryMethods: function () {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            const handleStateChange = () => {
                this.initialized = false; // Allow reinitialization
                this.init();
            };
            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                handleStateChange();
            };
            history.replaceState = (...args) => {
                originalReplaceState.apply(history, args);
                handleStateChange();
            };
            window.addEventListener('popstate', handleStateChange);
        },
    };

    // Initialize the script when the DOM is ready
    const ready = (callback) => {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    ready(() => {
        TGithub.init();
        TGithub.overrideHistoryMethods();
    });

})(window);