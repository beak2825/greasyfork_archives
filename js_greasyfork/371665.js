// ==UserScript==
// @name         YuoTubeQuickDo
// @namespace    https://gist.github.com/jeayu
// @version      0.0.1
// @description  hot key: '+','-' adjust speed; 'I' rotate left; 'O' rotate right; 'U' mirror; 'R' reset
// @author       jeayu
// @license      MIT
// @match        *://www.youtube.com/watch?*
// @downloadURL https://update.greasyfork.org/scripts/371665/YuoTubeQuickDo.user.js
// @updateURL https://update.greasyfork.org/scripts/371665/YuoTubeQuickDo.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const q = (query) => document.querySelectorAll(query);
    const qI = (query) => document.getElementById(query);
    const qT = (query) => document.getElementsByTagName(query);
    const YuoTubeQuickDo = {
        keyCode: {
            'enter': 13,
            'esc': 27,
            '=+': 187,
            '-_': 189,
            '+': 107,
            '-': 109,
            '0': 48,
            '1': 49,
            '2': 50,
            '3': 51,
            '4': 52,
            '5': 53,
            '6': 54,
            '7': 55,
            '8': 56,
            '9': 57,
            'a': 65,
            'b': 66,
            'c': 67,
            'd': 68,
            'e': 69,
            'f': 70,
            'g': 71,
            'h': 72,
            'i': 73,
            'j': 74,
            'k': 75,
            'l': 76,
            'm': 77,
            'n': 78,
            'o': 79,
            'p': 80,
            'q': 81,
            'r': 82,
            's': 83,
            't': 84,
            'u': 85,
            'v': 86,
            'w': 87,
            'x': 88,
            'y': 89,
            'z': 90,
        },
        config: {
            quickDo: {
                'addSpeed': '=+',
                'subSpeed': '-_',
                'mirror': 'u',
                'rotateRight': 'o',
                'rotateLeft': 'i',
                'reset': 'r',
            },
        },
        getKeyCode: function (type) {
            return this.keyCode[this.config.quickDo[type]];
        },
        bindKeydown: function () {
            document.addEventListener("keydown", e => {
                if (q('input:focus, textarea:focus').length <= 0) {
                    if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                        this.keyHandler(e.keyCode);
                    }
                }
            }, true);
        },
        keyHandler: function (keyCode) {
            const h5Player = qT('video')[0];
            if (keyCode === this.getKeyCode('addSpeed') && h5Player.playbackRate < 4) {
                h5Player.playbackRate += 0.25;
            } else if (keyCode === this.getKeyCode('subSpeed') && h5Player.playbackRate > 0.5) {
                h5Player.playbackRate -= 0.25;
            } else if (keyCode === this.getKeyCode('rotateRight')) {
                this.h5PlayerRotate(1);
            } else if (keyCode === this.getKeyCode('rotateLeft')) {
                this.h5PlayerRotate(-1);
            } else if (keyCode === this.getKeyCode('mirror')) {
                if (this.getTransformCss(h5Player) != 'none') {
                    this.setH5PlayerRransform('');
                } else {
                    this.setH5PlayerRransform('rotateY(180deg)');
                }
            } else if (keyCode === this.getKeyCode('reset')) {
                h5Player.playbackRate = 1;
                this.setH5PlayerRransform('');
            }
        },
        h5PlayerRotate: function (flag) {
            const h5Player = qT('video')[0];
            const deg = this.rotationDeg(h5Player) + 90 * flag;
            let transform = `rotate(${deg}deg)`;
            if (deg == 0 || deg == 180 * flag) {
                transform += ` scale(1)`;
            } else {
                transform += ` scale(${h5Player.videoHeight / h5Player.videoWidth})`;
            }
            this.setH5PlayerRransform(transform);
        },
        setH5PlayerRransform: function (transform) {
            qT('video')[0].style.transform = transform;
        },
        getTransformCss: function (e) {
            return getComputedStyle(e).transform;
        },
        rotationDeg: function (e) {
            const transformCss = this.getTransformCss(e);
            let matrix = transformCss.match('matrix\\((.*)\\)');
            if (matrix) {
                matrix = matrix[1].split(',');
                if (matrix) {
                    const rad = Math.atan2(matrix[1], matrix[0]);
                    return parseFloat((rad * 180 / Math.PI).toFixed(1));
                }
            }
            return 0;
        },
        init: function () {
            this.bindKeydown();
        }
    };
    YuoTubeQuickDo.init();
})();