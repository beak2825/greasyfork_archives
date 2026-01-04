// ==UserScript==
// @name force-landscape-video
// @namespace hakurouken/tamper-scripts/force-landscape-video
// @version 1.0.0
// @description Force full screen video to play in landscape.
// @author Hakurouken
// @license MIT
// @homepage https://github.com/hakurouken/tamper-scripts/packages/force-landscape-video
// @homepageURL https://github.com/hakurouken/tamper-scripts/packages/force-landscape-video
// @supportURL https://github.com/hakurouken/tamper-scripts/issues
// @run-at document-start
// @noframes
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/492083/force-landscape-video.user.js
// @updateURL https://update.greasyfork.org/scripts/492083/force-landscape-video.meta.js
// ==/UserScript==

function run() {
    if (navigator.maxTouchPoints < 1) {
        return;
    }
    window.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            screen.orientation.lock('landscape');
        }
        else {
            screen.orientation.unlock();
        }
    });
}
run();
