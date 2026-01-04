// ==UserScript==
// @name        Wrapper for Kaldari's iNaturalist2Commons
// @namespace   https://commons.wikimedia.org/wiki/User:Kaldari/iNaturalist2Commons
// @description Wrapper for iNaturalist2Commons
// @match	*://*.wikimedia.org/*
// @run-at 	document-end
// @grant       none
// @version 0.0.1.20230524073629
// @downloadURL https://update.greasyfork.org/scripts/433041/Wrapper%20for%20Kaldari%27s%20iNaturalist2Commons.user.js
// @updateURL https://update.greasyfork.org/scripts/433041/Wrapper%20for%20Kaldari%27s%20iNaturalist2Commons.meta.js
// ==/UserScript==
var src = '//commons.wikimedia.org/w/index.php?title=User:Kaldari/inat2commons.js&action=raw&ctype=text/javascript';
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = src;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);