// ==UserScript==
// @name        Wrapper for Evad37's Rater: tag and assess assist
// @namespace   https://en.wikipedia.org/wiki/User:Evad37/rater
// @description Wrapper for Rater: tag and assess assist. A script to assist adding ratings to Wikiproject banners
// @match	*://en.wikipedia.org/*
// @run-at 	document-end
// @grant       none
// @version 0.0.1.20230524073732
// @downloadURL https://update.greasyfork.org/scripts/433042/Wrapper%20for%20Evad37%27s%20Rater%3A%20tag%20and%20assess%20assist.user.js
// @updateURL https://update.greasyfork.org/scripts/433042/Wrapper%20for%20Evad37%27s%20Rater%3A%20tag%20and%20assess%20assist.meta.js
// ==/UserScript==
var src = '//en.wikipedia.org/w/index.php?title=User:Evad37/rater.js&action=raw&ctype=text/javascript';
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = src;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);