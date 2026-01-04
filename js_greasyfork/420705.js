// ==UserScript==
// @name         Dictionary.com Dumb Tab Fixer
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Fix the dumb tabs
// @author       By Jon for David
// @match        https://www.dictionary.com/*
// @match        https://www.thesaurus.com/*
// @icon         https://www.dictionary.com/hp-assets/_next/static/images/dcom_favicon-94e56a525da4e9fe0cda10a944923c91.png
// @downloadURL https://update.greasyfork.org/scripts/420705/Dictionarycom%20Dumb%20Tab%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/420705/Dictionarycom%20Dumb%20Tab%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateTab() {
        try { document.getElementsByTagName('form')[0].getElementsByTagName('div')[0].style.display = 'none'; } catch {}
        try { document.getElementsByTagName('header')[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[2].style.display = 'none'; } catch {}
        if (!!location.pathname.match('/browse/')) {
            if (location.hostname === 'www.dictionary.com') {
                document.getElementById('thesaurus-nav-tab').setAttribute('href', 'https://www.thesaurus.com' + location.pathname);
            } else {
                document.getElementById('dictionary-nav-tab').setAttribute('href', 'https://www.dictionary.com' + location.pathname);
            }
        }
    }

    const observer = new MutationObserver(updateTab);
    observer.observe(document.getElementsByTagName('header')[0], {childList: true, subtree: true});
    updateTab();
})();