// ==UserScript==
// @name v2ex_default_style
// @description Make v2ex has no customized styles
// @author       just one v2ex-er
// @include https://v2ex.com/*
// @include http://v2ex.com/*
// @include https://www.v2ex.com/*
// @include http://www.v2ex.com/*
// @version 0.1
// @namespace https://greasyfork.org/users/302169
// @downloadURL https://update.greasyfork.org/scripts/388083/v2ex_default_style.user.js
// @updateURL https://update.greasyfork.org/scripts/388083/v2ex_default_style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('node-custom-css') && document.getElementById('node-custom-css').remove();
})();