// ==UserScript==
// @name         提升网页浏览体验及效率
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Awesome
// @author       Silvio27
// @match        *://down.dataaps.com/*
// @icon         https://www.peanuts.com/sites/default/themes/peanuts/favicon.ico
// @grant        none
// @license      GPL

// @downloadURL https://update.greasyfork.org/scripts/457992/%E6%8F%90%E5%8D%87%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C%E5%8F%8A%E6%95%88%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/457992/%E6%8F%90%E5%8D%87%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C%E5%8F%8A%E6%95%88%E7%8E%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let webUrl = document.URL

    if (webUrl.includes('down.dataaps.com')) {
        magnetAutoClick(2)
        closePage()
    }

    function closePage(timeout = 2000) {
        console.log('in close func')
        setTimeout(() => {
            window.open("about:blank","_self")
            window.close()
        }, timeout)
    }

    async function magnetAutoClick(index = 2) {
        let alink = document.getElementsByTagName('a')
        alink[index].removeAttribute("onclick")
        // await copyPageUrl(alink[index].href)
        alink[index].click()

    }

    async function copyPageUrl(s) {
        try {
            await navigator.clipboard.writeText(s);
            console.log('copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy: \n', err)
        }
    }


})();