// ==UserScript==
// @name               My Mouse Gestures
// @name:zh-CN         我的鼠标手势
// @name:zh-TW         我的滑鼠手勢
// @description        A simple mouse gesture script
// @description:zh-CN  一个简单的鼠标手势脚本
// @description:zh-TW  一個簡單的滑鼠手勢腳本
// @version            0.1.8
// @include            *
// @run-at             document-start
// @grant              GM_openInTab
// @grant              window.close
// @namespace          https://greasyfork.org/users/4968
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/448194/My%20Mouse%20Gestures.user.js
// @updateURL https://update.greasyfork.org/scripts/448194/My%20Mouse%20Gestures.meta.js
// ==/UserScript==

// --- Settings ---

const SENSITIVITY = 3; // 1 ~ 5
const TOLERANCE   = 3; // 1 ~ 5

const funcs = {

    'U': function() {
        window.scrollTo(0, 0);
    },
    'D': function() {
        window.scrollTo(0, 1073741824);
    },
    'UD': function() {
        window.location.reload();
    }
};

// ----------------

const s = 1 << ((7 - SENSITIVITY) << 1);
const t1 = Math.tan(0.15708 * TOLERANCE),
      t2 = 1 / t1;

let x, y, path;

const tracer = function(e) {
    let cx = e.clientX,
        cy = e.clientY,
        deltaX = cx - x,
        deltaY = cy - y,
        distance = deltaX * deltaX + deltaY * deltaY;
    if (distance > s) {
        let slope = Math.abs(deltaY / deltaX),
            direction = '';
        if (slope > t1) {
            direction = deltaY > 0 ? 'D' : 'U';
        } else if (slope <= t2) {
            direction = deltaX > 0 ? 'R' : 'L';
        }
        if (path.charAt(path.length - 1) !== direction) {
            path += direction;
        }
        x = cx;
        y = cy;
    }
};

window.addEventListener('mousedown', function(e) {
    if (e.which === 3) {
        x = e.clientX;
        y = e.clientY;
        path = "";
        window.addEventListener('mousemove', tracer, false);
    }
}, false);

window.addEventListener('contextmenu', function(e) {
    window.removeEventListener('mousemove', tracer, false);
    if (path !== "") {
        e.preventDefault();
        if (funcs.hasOwnProperty(path)) {
            funcs[path]();
        }
    }
}, false);
