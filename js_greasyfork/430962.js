// ==UserScript==
// @name         Auto Claim Twitch
// @namespace    http://tampermonkey.net/
// @version      2021.08.17
// @description  Auto Claim Twitch live video
// @author       ga601218
// @match        https://www.twitch.tv/warframe*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430962/Auto%20Claim%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/430962/Auto%20Claim%20Twitch.meta.js
// ==/UserScript==

setInterval(function() {
                  window.location.reload();
                }, 6*60000);