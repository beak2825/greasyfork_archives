// ==UserScript==
// @name        AWS VPN - Close Window
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:35001/
// @grant       window.close
// @version     1.0
// @author      Nicholas Hawkes
// @description Close the tab when successful AWS VPN is on
// @homepage    https://gist.github.com/hawkesn/ddfdb6f35ad23e8f4a00439bcaddaaa6
// @downloadURL https://update.greasyfork.org/scripts/427423/AWS%20VPN%20-%20Close%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/427423/AWS%20VPN%20-%20Close%20Window.meta.js
// ==/UserScript==

setInterval(() => {
  window.close()
}, 1000)