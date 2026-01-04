// ==UserScript==
// @name         AO3: [Wrangling] Change url of comment pages
// @namespace
// @description  change the url of tag link in the comment pages to redirect to edit tag
// @author       roissy
// @version      1.1
// @match        *://*.archiveofourown.org/tags/*/comments*
// @match        *://*.archiveofourown.org/comments*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1278384
// @downloadURL https://update.greasyfork.org/scripts/502896/AO3%3A%20%5BWrangling%5D%20Change%20url%20of%20comment%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/502896/AO3%3A%20%5BWrangling%5D%20Change%20url%20of%20comment%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

var element = document.getElementsByClassName("tag")[0];
var str = element.href;
var text = str + "/edit";
element.href = text;

})();