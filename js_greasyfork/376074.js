// ==UserScript==
// @name           	YouTube Embed Paused More Videos Remover  
// @author		eligon
// @namespace     	https://greasyfork.org/en/users/233017-eliran-gonen 
// @description    	Remove paused embedded youtube videos more videos suggestions
// @include        	/^https?:\/\/www.youtube\.com\/embed\/.*$/
// @version 0.0.1.20181229074314
// @downloadURL https://update.greasyfork.org/scripts/376074/YouTube%20Embed%20Paused%20More%20Videos%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/376074/YouTube%20Embed%20Paused%20More%20Videos%20Remover.meta.js
// ==/UserScript==

elem = document.querySelector("div.ytp-scroll-min.ytp-pause-overlay")
elem.remove();