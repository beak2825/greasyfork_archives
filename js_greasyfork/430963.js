// ==UserScript==
// @name         Auto Claim Twitch international
// @namespace    http://tampermonkey.net/
// @version      2021.08.17
// @description  Auto Claim Twitch live video
// @author       ga601218
// @match        https://www.twitch.tv/warframeinternational*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430963/Auto%20Claim%20Twitch%20international.user.js
// @updateURL https://update.greasyfork.org/scripts/430963/Auto%20Claim%20Twitch%20international.meta.js
// ==/UserScript==

setInterval(function() {
                  window.location.reload();
                }, 6*60000);