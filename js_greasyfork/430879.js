// ==UserScript==
// @name         Delete Discord [PRANK LOL]
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  Delete Discord Fully And Leave Your Friends Confused Why Its Not Loading...
// @author       Nex4922
// @run-at       document-end
// @match        *://*.discord.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430879/Delete%20Discord%20%5BPRANK%20LOL%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/430879/Delete%20Discord%20%5BPRANK%20LOL%5D.meta.js
// ==/UserScript==
jQuery('.container-3gCOGc').remove()
jQuery('#app-mount').remove()

// == Looks Like Lil Text But Causes Masive Distruction To Discords Server's That Discord Will Crash On The Web Version (Not on the client version)
// == So Yes Just Trust Me Run This And Feel Like A Boss :p