// ==UserScript==
// @name         Force Https
// @version      0.1
// @description  Force websites using Https
// @author       X-Force
// @since        20168-08-26
// @include      http://*.polyv.net/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/5011
// @downloadURL https://update.greasyfork.org/scripts/375080/Force%20Https.user.js
// @updateURL https://update.greasyfork.org/scripts/375080/Force%20Https.meta.js
// ==/UserScript==
if(self.location.protocol == "http:") self.location.replace(self.location.href.replace(/^http:\/\//, "https://"));
