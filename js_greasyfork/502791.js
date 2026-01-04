// ==UserScript==
// @name         Hacker News - Remove 'Add comment' box
// @namespace    Stout
// @version      0.1
// @description  Remove 'Add comment' box
// @author       Stout
// @license      MIT
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=news.ycombinator.com
// @downloadURL https://update.greasyfork.org/scripts/502791/Hacker%20News%20-%20Remove%20%27Add%20comment%27%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/502791/Hacker%20News%20-%20Remove%20%27Add%20comment%27%20box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var commentFormElement = document.evaluate("//table[@id='hnmain']//tr[td/form/textarea]",
                                               document,
                                               null,
                                               XPathResult.FIRST_ORDERED_NODE_TYPE);

    commentFormElement.singleNodeValue.style = 'display:none;';
})();
