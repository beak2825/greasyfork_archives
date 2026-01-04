// ==UserScript==
// @name         ALM indicate visited links
// @namespace    http://bosch.com
// @version      v1.0
// @description  use different colour for visited links in ALM
// @author       LSB2BP
// @match        https://rb-alm-11-p.de.bosch.com/ccm/web/projects/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373016/ALM%20indicate%20visited%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/373016/ALM%20indicate%20visited%20links.meta.js
// ==/UserScript==

GM_addStyle ( `
    a:visited {
        color: #00BCD4;
    }
` );