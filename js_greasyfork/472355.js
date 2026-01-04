// ==UserScript==
// @name        Remove Notion Icon
// @description Force update notion icon
// @match https://www.notion.so/*/*
// @version 0.0.1.20230803164717
// @namespace https://greasyfork.org/users/1013759
// @downloadURL https://update.greasyfork.org/scripts/472355/Remove%20Notion%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/472355/Remove%20Notion%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setInterval(() => {
    
        var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = 'https://www.notion.so/front-static/favicon.ico';
    }, 1000)

})();