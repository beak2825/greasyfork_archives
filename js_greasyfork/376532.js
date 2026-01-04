// ==UserScript==
// @name    Redirect to English Microsoft Documentation
// @version 1.0
// @description Redirects German Microsoft documentation links to the English site
// @author  CennoxX
// @contact cesar.bernard@gmx.de
// @homepage    https://twitter.com/CennoxX
// @namespace   https://greasyfork.org/users/21515
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/376532/Redirect%20to%20English%20Microsoft%20Documentation.user.js
// @updateURL https://update.greasyfork.org/scripts/376532/Redirect%20to%20English%20Microsoft%20Documentation.meta.js
// ==/UserScript==
(function() {
    'use strict';
    Array.prototype.forEach.call(document.links, item => {
        item.href=item.href.replace(/docs\.microsoft\.com\/de-de/,"docs.microsoft.com/en-us");
    });
})();