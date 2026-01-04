// ==UserScript==
// @name         Auto highlight all links
// @namespace    https://lai-0602.com
// @version      1764509279
// @description  This script highlight all the links in a webpage automatically.
// @author       Lai0602
// @match        *
// @match        https://*
// @match        http://*
// @match        extension://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/509151/Auto%20highlight%20all%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/509151/Auto%20highlight%20all%20links.meta.js
// ==/UserScript==

const autoHighlightLinks = setInterval(document.querySelectorAll('[href],[src]').forEach(link => link.innerHTML = `<mark>${link.outerHTML}</mark>`), 500)