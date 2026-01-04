// ==UserScript==
// @name         Infinite Craft - Double click to Duplicate - Deprecated
// @namespace    http://ow0.me/infinite
// @version      2048
// @description  Deprecated - Neal added this feature natively better lol
// @author       Ina'
// @match        https://neal.fun/*
// @icon         https://ow0.me/infinite/icon48.png
// @icon64       https://ow0.me/infinite/icon64.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://neal.fun/_nuxt/992eef7.js
// @require      https://neal.fun/_nuxt/dcc1889.js
// @run-at       document-idle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486559/Infinite%20Craft%20-%20Double%20click%20to%20Duplicate%20-%20Deprecated.user.js
// @updateURL https://update.greasyfork.org/scripts/486559/Infinite%20Craft%20-%20Double%20click%20to%20Duplicate%20-%20Deprecated.meta.js
// ==/UserScript==

var yuri = () => {
    'use strict';

    var that = unsafeWindow.$nuxt.$children[2].$children[0].$children[0];
    that.calcInstanceSize = function (e) {
        var element = document.getElementById('instance-' + e.id);
        if (element) {
            element.addEventListener("dblclick", (ev) => {
                var t = ev.target;
                var xi = that.instances.findIndex(function (e) {
                    return (('instance-' + e.id) === t.id);
                });
                var x = that.instances[xi];
                console.log(x);
                var d = that.instanceId++;
                var ct = {
                    id: d,
                    text: x.text,
                    emoji: x.emoji,
                    disabled: !1,
                    zIndex: d,
                    discovered: false,
                    isNew: false
                };
                that.instances.push(ct)

                that.$nextTick ( () => {
                    that.setInstancePosition(ct, x.left, x.top - x.height * 1.5);
                } );

            });
            (e.width = element.offsetWidth, e.height = element.offsetHeight);
        }
    };
};
window.addEventListener("load", yuri);