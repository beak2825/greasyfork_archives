// ==UserScript==
// @name             所有视频2倍速度播放 / video speed 2x
// @name:en          Videos default at 2x speed
// @name:ja          2倍速でのデフォルトのビデオ再生
// @namespace        https://userscript.snomiao.com/
// @description      这个世界的一切都太慢了啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
// @description:en   Everything in this world is too sloooooooooooooooooooooooooow
// @description:ja   この世界のすべてが遅すぎるあああああああああああああああああああああああああああああああああああああああ
// @author           snomiao@gmail.com
// @match            *://*.youtube.com/*
// @match            *://*/*
// @exclude          *://mooc*.chaoxing.com/*
// @run-at           document-end
// @version          0.1.3
// @downloadURL https://update.greasyfork.org/scripts/395554/%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%912%E5%80%8D%E9%80%9F%E5%BA%A6%E6%92%AD%E6%94%BE%20%20video%20speed%202x.user.js
// @updateURL https://update.greasyfork.org/scripts/395554/%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%912%E5%80%8D%E9%80%9F%E5%BA%A6%E6%92%AD%E6%94%BE%20%20video%20speed%202x.meta.js
// ==/UserScript==
// (20200422)Update: avoid chaoxing online courses (needs 1x speed to complete the task)

(() => {
    var rate = 2;
    var init = () =>
        [...document.querySelectorAll('video')].map((e) => {
            if (!e.flag_speed_inited) {
                e.playbackRate = rate;
                console.debug(e, 'SPEED_X', rate);
                e.flag_speed_inited = 1;
            }
        });
    setInterval(init, 10000);
    window.addEventListener('load', init, false);
    init();
})();
