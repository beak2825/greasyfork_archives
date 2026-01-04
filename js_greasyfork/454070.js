// ==UserScript==
// @name               自用鼠标手势
// @description        鼠标手势脚本
// @version            0.1.2
// @include            *
// @run-at             document-start
// @grant              GM_openInTab
// @grant              window.close
// @namespace          https://greasyfork.org/users/4968
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/454070/%E8%87%AA%E7%94%A8%E9%BC%A0%E6%A0%87%E6%89%8B%E5%8A%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/454070/%E8%87%AA%E7%94%A8%E9%BC%A0%E6%A0%87%E6%89%8B%E5%8A%BF.meta.js
// ==/UserScript==

// --- Settings ---

const SENSITIVITY = 3; // 1 ~ 5
const TOLERANCE = 3; // 1 ~ 5

const funcs = {
    'DR': function() {
        window.top.close();
    },
    'RD': function() {
        GM_openInTab('about:newtab', false);
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
