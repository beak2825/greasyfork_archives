// ==UserScript==
// @name         Cleaner Qwant
// @version      1.0.2
// @description  Removes everything but the "Qwant" title and the search bar from Qwant homepage. This script does not remove the stuff that can be removed from Qwant settings. Also removes everything that's not necessary from the search results page. Qwant theme and other settings can still be accessed but only from the search results page or disabling the script temporarily.
// @author       alekarhis
// @match    	 *://*.qwant.com/*
// @run-at       document-start
// @namespace    https://greasyfork.org/en/users/1249571-alekarhis
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485091/Cleaner%20Qwant.user.js
// @updateURL https://update.greasyfork.org/scripts/485091/Cleaner%20Qwant.meta.js
// ==/UserScript==

const style = document.createElement('style');
style.type = 'text/css';

// to tweak, replace the css code inside the '' and edit it with the help of a minifier
style.innerHTML = 'header, footer, nav,.all_content,.header_content.header_content--classic :not(.header__item--appmenu),.verticals__container,div._1gyaA,.result-smart__news, section._2gJiB._3eNpH{display: none !important}main._15VRu{margin-left: 0;width: 100%}main._15VRu div._2GMK3{padding-left: 50px}main._15VRu div._27RFp{margin-left: 0;padding-left: 50px;width: 100%}main._15VRu div._1l9TR{border-bottom: 0}main._15VRu div._3gNfz{padding-left: 196px}div._3yM0k{margin-top: 20px}section._1G88Y{height: 100vh}'

if (document.querySelector('head')) {
    document.querySelector('head').appendChild(style);
} else {
    document.addEventListener("readystatechange", e => {
        if (document.readyState === "interactive") {
            document.querySelector('head').appendChild(style)
        }
    })
}