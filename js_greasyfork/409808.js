// ==UserScript==
// @name       lanzou
// @author	monsm
// @namespace  http://weibo.com/monsm
// @version    1.0
// @description  lanzou auto reload
// @include      http*://*lanzous*
// @copyright  2013+, monsm
// @downloadURL https://update.greasyfork.org/scripts/409808/lanzou.user.js
// @updateURL https://update.greasyfork.org/scripts/409808/lanzou.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.location.href = window.location.href.replace(/https?:.+?.lanzou[a-z]{1}/g, "https://pan.lanzou");
})();