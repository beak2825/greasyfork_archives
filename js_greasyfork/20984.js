// ==UserScript==
// @name        LBCAccessibility
// @namespace   leboncoin
// @description Améliore l'accessiblité de leboncoin.fr
// @include     https://leboncoin.fr/*
// @include     http://leboncoin.fr/*
// @include     https://*.leboncoin.fr/*
// @include     http://*.leboncoin.fr/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20984/LBCAccessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/20984/LBCAccessibility.meta.js
// ==/UserScript==

document.getElementById('container').setAttribute('role', 'document');
