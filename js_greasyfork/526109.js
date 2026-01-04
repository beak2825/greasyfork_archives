// ==UserScript==
// @name         Miami Proxy for sandbox.moomoo.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Route traffic through a Miami proxy for low ping on sandbox.moomoo.io.
// @author       Evil Seek
// @match        https://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526109/Miami%20Proxy%20for%20sandboxmoomooio.user.js
// @updateURL https://update.greasyfork.org/scripts/526109/Miami%20Proxy%20for%20sandboxmoomooio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const proxyServer = "84.46.239.104:3128"; // Miami proxy server and port

    function setProxy() {
        const proxyConfig = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: proxyServer.split(':')[0],
                    port: parseInt(proxyServer.split(':')[1])
                },
                bypassList: ["localhost"]
            }
        };

        chrome.proxy.settings.set(
            {value: proxyConfig, scope: 'regular'},
            function() {}
        );

        console.log("Proxy set to Miami server for sandbox.moomoo.io:", proxyServer);
    }

    setProxy();
})();