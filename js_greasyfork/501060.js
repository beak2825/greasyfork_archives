// ==UserScript==
// @name         [elearning] video playrate helper
// @namespace    http://tampermonkey.net/
// @version      2024-01-15
// @description  elearning video player enhance
// @author       You
// @match        https://elearning1.acbel.com/LMSCourse/CourseReader/jwplayer/viewer.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acbel.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @resource     REMOTE_CSS https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501060/%5Belearning%5D%20video%20playrate%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/501060/%5Belearning%5D%20video%20playrate%20helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => init(), 0)

    function init() {
        const my_css = GM_getResourceText("REMOTE_CSS");
        GM_addStyle(my_css);

        console.log('---elearning video playrate helper init')
        initPlayrateCtrl()
        initVideoResizable()

    }
    async function initPlayrateCtrl() {
        const PLAYRATE_KEY = 'playrate'
        let playrate = await GM_getValue(PLAYRATE_KEY, 1);

        $('body').append($('<div>').slider({
            min: 0,
            max: 16,
            value: 1,
            step: 0.05,
            slide: function (event, { value }) {
                setPlaybackrate(value)
            }
        }))
        const plackbackDisplay = $(`<div>1x</div>`)
        $('body').append(plackbackDisplay)
        setPlaybackrate(playrate)
        async function setPlaybackrate(val) {
            await wait('video.jw-video')
            $('video.jw-video').get(0).playbackRate = val;
            plackbackDisplay.text(`${val}x`)
            GM_setValue(PLAYRATE_KEY, val);
        }
    }
    async function initVideoResizable() {
        while ($('div#MediaContainer').length === 0) {
            await sleep(100)
        }
        $('div#MediaContainer').css('width', '').css('height', '80dvh').resizable()
    }
    function sleep(ms) {
        return new Promise(res => setTimeout(res, ms))
    }
    async function wait(selector) {
        let findEle = ()=>$(selector).get(0) != undefined;
        while (!findEle()) {
            await sleep(300);
        }
        return;
    }
})();