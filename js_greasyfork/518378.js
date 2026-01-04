// ==UserScript==
// @name        Spoof Bluesky mobile detection
// @namespace   https://bas.sh
// @match       https://bsky.app/*
// @match       https://main.bsky.dev/*
// @grant       none
// @version     2.0
// @author      Bas (@bas.sh)
// @description Temporary userscript to work around Bluesky's incorrect touch device detection (obsolete)
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/518378/Spoof%20Bluesky%20mobile%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/518378/Spoof%20Bluesky%20mobile%20detection.meta.js
// ==/UserScript==

/*
 * If you're reading this then that means you can remove/uninstall this
 * userscript :).
 *
 * This workaround is no longer necessary as my PR with a fix has been merged
 * and deployed.
 *
 * If you do still experience this issue (hovercards/volume slider not showing
 * up), then please open a new GitHub issue at
 * https://github.com/bluesky-social/social-app/issues/new?template=bug_report.yml
 */
//Object.defineProperty(navigator, "maxTouchPoints", { get: () => 0 });
