// ==UserScript==
// @name         auto download pypi whl file
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @description  auto download whl file for pypi.org
// @author       russiavk
// @match        https://pypi.org/project/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534376/auto%20download%20pypi%20whl%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/534376/auto%20download%20pypi%20whl%20file.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.hash!='#files'){
        location.hash='#files';
        window.onhashchange=function(){
            if(location.hash==='#files'){
                const css_selector=`.file__card [href^="https://files.pythonhosted.org"][href$=".whl"]`;
                const observer = new MutationObserver((mutations) => {
                    const element = document.querySelector(css_selector);
                    if (element) {
                        element.click();
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

            }

        }
    }
})();