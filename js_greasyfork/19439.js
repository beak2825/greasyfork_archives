// ==UserScript==
// @name         Noot Noot
// @namespace    PXgamer
// @version      0.1
// @description  Pingu is trying to take over the world!
// @author       PXgamer
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19439/Noot%20Noot.user.js
// @updateURL https://update.greasyfork.org/scripts/19439/Noot%20Noot.meta.js
// ==/UserScript==

(function() {'use strict';var imgs = document.getElementsByTagName('img');for (var i = 0; i < imgs.length; i++)imgs[i].src = 'https://pximg.xyz/images/c62ae95769d9573985e77c5c3dd9661f.jpg';})();