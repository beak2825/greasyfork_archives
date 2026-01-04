// ==UserScript==
// @name         Wikipedia Spacing Fixer Upper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script/Style to adjust the spacing/layout on Wikipedia following the January 2023 redesign.
// @author       ZenithKnight#1225
// @match        https://en.wikipedia.org/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458565/Wikipedia%20Spacing%20Fixer%20Upper.user.js
// @updateURL https://update.greasyfork.org/scripts/458565/Wikipedia%20Spacing%20Fixer%20Upper.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let inject_css = `.vector-feature-page-tools-disabled .vector-main-menu {
			margin-left: 0px;
		}
		.vector-feature-page-tools-disabled .mw-page-container-inner {
			column-gap: 0px;
		}
		.mw-page-container {
			padding-left: 0;
			padding-right: 12px;
		}
        #mw-panel-toc {
            margin-left: 0 !important;
        }
		.vector-sitenotice-container {
			display: none;
		}
		.vector-feature-page-tools-disabled .mw-logo {
			margin-left: 10px;
			margin-top: 10px;
			margin-bottom: 10px;
			margin-right: -19px;
		}
		.mw-body {
			padding: 0.5em 0 1.5em 10px;
			margin-top: -25px;
		}
		#mw-sidebar-button {
			filter: opacity(0);
		}
		.vector-feature-page-tools-disabled #vector-toc-pinned-container .vector-toc, .vector-feature-page-tools-disabled #vector-toc-pinned-container .vector-toc:after {
			margin-left: 0;
			background-color: #f8f9fa;
		}
		.mw-footer-container {
			padding-left: 20px;
		}`;

    waitTillLoad('button[data-event-name="limited-width-toggle-off"]').then(a => {
        a.click()
        document.head.insertAdjacentHTML("beforeend", `<style>${inject_css}<style>`);
    });
    waitTillLoad("#mw-sidebar-button").then(a => {
        a.click()
    });
    function waitTillLoad(selector, timeout = 60000, updateSpeed = 100) {
        return _waitTillLoad(() => document.querySelector(selector), timeout, updateSpeed);
    }
    function _waitTillLoad(func, timeout = 60000, updateSpeed = 100) {
        return new Promise((resolve, reject) => {
            let found = false;

            if (func()) {
                found = true;
                resolve(func());
            } else {
                let _loading = setInterval(() => {
                    if (func()) {
                        found = true;
                        resolve(func());
                    }
                }, updateSpeed)

                if (!found) {
                    setTimeout(() => {
                        if (!found) {
                            clearInterval(_loading);
                            reject("Didn't load in time")
                        }
                    }, timeout);
                }
            }
        })
    }
})();