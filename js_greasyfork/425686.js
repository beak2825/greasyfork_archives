// ==UserScript==
// @name          WhatsApp Web Unblock Audio Speed
// @description   Allows Video Speed Controller to speed up audios from WhatsApp Web
// @version       1.0
// @author        xiaoxiaoflood
// @match         https://web.whatsapp.com/
// @namespace     https://github.com/xiaoxiaoflood
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/425686/WhatsApp%20Web%20Unblock%20Audio%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/425686/WhatsApp%20Web%20Unblock%20Audio%20Speed.meta.js
// ==/UserScript==

Object.defineProperty(unsafeWindow.HTMLAudioElement.prototype, 'playbackRate', { writable: true });