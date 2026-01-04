// ==UserScript==
// @name         Hit Forker Fork - "Forking Over 9000" Installer
// @namespace    salembeats
// @version      1
// @description  Fork of Hit Forker. Adds extra fields (e.g., requester rejection rate), simplifies others (realtime feed values are simplified to symbols in order to read them more quickly), adds new features (e.g., home-row key accept for realtime feed), makes feed more readable (low-rated HITs are semitransparent, "caveman-speak" for narrow windows to convey only important details).
// @author       salembeats
// @include      https://worker.mturk.com/?over9000*
// @include      https://worker.mturk.com/?end_signin=1&over9000*
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/388135/Hit%20Forker%20Fork%20-%20%22Forking%20Over%209000%22%20Installer.user.js
// @updateURL https://update.greasyfork.org/scripts/388135/Hit%20Forker%20Fork%20-%20%22Forking%20Over%209000%22%20Installer.meta.js
// ==/UserScript==

if(!GM_getValue("runOnce")) {
    window.open("https://gist.github.com/salembeats/bcf6c091192c5adbd9b40011b40da0da/raw/forking-over-9000.user.js");
    GM_setValue("runOnce", true);
}