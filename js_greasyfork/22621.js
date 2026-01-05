// ==UserScript==
// @name         HACG Force Https
// @version      0.1
// @description  对琉璃神社强制使用HTTPS，解决某些地方打不开的问题
// @author       aviraxp
// @licence      CC BY-NC-SA 3.0 (https://creativecommons.org/licenses/by-nc-sa/3.0/)
// @since        2016-08-26
// @include      http://*.hacg.*/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/60721
// @downloadURL https://update.greasyfork.org/scripts/22621/HACG%20Force%20Https.user.js
// @updateURL https://update.greasyfork.org/scripts/22621/HACG%20Force%20Https.meta.js
// ==/UserScript==
if(self.location.protocol == "http:") self.location.replace(self.location.href.replace(/^http/, "https"));