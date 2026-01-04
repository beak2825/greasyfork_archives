// ==UserScript==
// @name         bitbucket净化
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  zh-cn
// @author       aries.zhou
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431694/bitbucket%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431694/bitbucket%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('header').append("<style> .aui-banner-error {display:none;} </style>");

})();