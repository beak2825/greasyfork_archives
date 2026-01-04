// ==UserScript==
// @name               TeraBox domain redirect
// @name:zh-CN         TeraBox 域名重定向
// @namespace          terabox-redirect
// @version            2025.08.18.2
// @description        Automatically redirect TeraBox domains to terabox.com
// @description:zh-CN  自动重定向 TeraBox 域名到 terabox.com
// @author             Amelia
// @license            MIT
// @run-at             document-start
// @match              *://*.terabox.app/*
// @match              *://*.teraboxapp.com/*
// @match              *://*.1024tera.com/*
// @match              *://*.1024terabox.com/*
// @match              *://*.freeterabox.com/*
// @match              *://*.4funbox.com/*
// @match              *://*.gibibox.com/*
// @match              *://*.mirrobox.com/*
// @match              *://*.momerybox.com/*
// @match              *://*.nephobox.com/*
// @match              *://*.tibibox.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/529542/TeraBox%20domain%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/529542/TeraBox%20domain%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.hostname != "terabox.com") {
        window.location.hostname = "terabox.com";
    }
})();