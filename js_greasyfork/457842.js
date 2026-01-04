// ==UserScript==
// @name         Floatplane Theater Mode
// @namespace    https://github.com/AktasC/floatplane-plus-plus
// @version      1.0
// @description  Ultrawide users retaliate against Luke Lafreniere
// @author       AktasC
// @match        https://www.floatplane.com/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=floatplane.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/457842/Floatplane%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/457842/Floatplane%20Theater%20Mode.meta.js
// ==/UserScript==

GM_addStyle(`
.player-container { max-height: 100% !important; max-width: 100% !important; }
.inner-container { max-width: calc(100vh * (16/9)) !important; margin: auto; }
`);

/*
** W.I.P aka Trial & Error
.video-js, .vjs-tech, .video-js.vjs-fill { max-height: 90% !important; max-width: 90vw !important; }
.sidebar, sidebar-inner, .sidebar-inner-main-nav { max-width: 220px !important; }
.route-wrapper {max-width: calc(100vw - 110px) !important; }
.player-wrapper { max-height: 100vh !important; max-width: 100vw !important; }
*/
