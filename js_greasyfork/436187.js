// ==UserScript==
// @name         Startpage.com search term in page title
// @namespace    https://startpage.com/
// @version      1.4
// @description  Show Startpage search term in title
// @author       xdpirate
// @license      GPL v2.0
// @match        https://startpage.com/sp/search*
// @match        https://startpage.com/do/search*
// @match        https://startpage.com/do/dsearch*
// @match        https://*.startpage.com/sp/search*
// @match        https://*.startpage.com/do/search*
// @match        https://*.startpage.com/do/dsearch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @downloadURL https://update.greasyfork.org/scripts/436187/Startpagecom%20search%20term%20in%20page%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/436187/Startpagecom%20search%20term%20in%20page%20title.meta.js
// ==/UserScript==
document.title = `${document.querySelector(`input[name="query"]`).value} - ${document.title}`;
