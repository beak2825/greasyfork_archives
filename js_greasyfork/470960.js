// ==UserScript==
// @name         Let Me Multitask, Bro
// @author       Christopher Conley
// @copyright    Copyright (C) 2023 Christopher Conley
// @license      GPL-2.0-only
// @version      0.2.1
// @description  A Tampermonkey script that allows picture-in-picture mode to be used for videos, even if the website has disabled it.
// @namespace    https://github.com/rosettast0ned/let-me-multitask-bro
// @source       https://github.com/rosettast0ned/let-me-multitask-bro
// @supportURL   https://github.com/rosettast0ned/let-me-multitask-bro/issues
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/rosettast0ned/let-me-multitask-bro/main/tampermonkey/let_me_multitask_bro.png
// @icon64       https://raw.githubusercontent.com/rosettast0ned/let-me-multitask-bro/main/tampermonkey/let_me_multitask_bro64.png
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/470960/Let%20Me%20Multitask%2C%20Bro.user.js
// @updateURL https://update.greasyfork.org/scripts/470960/Let%20Me%20Multitask%2C%20Bro.meta.js
// ==/UserScript==
//
// Picture in picture icon by Ria Fitriana from https://thenounproject.com/browse/icons/term/picture-in-picture/ Noun Project (CC BY 3.0)
//

(function () {
    console.log('LMMB: Let Me Multitask, Bro extension triggered.')

    var poller = setInterval(function () {
        if (document.querySelector('video') !== null) {
            clearInterval(poller);
            console.log("LMMB: Found video element.");

            var videos = document.querySelectorAll('video');

            videos.forEach(video => {
                if (video.hasAttribute('disablepictureinpicture')) {
                    console.log('LMMB: Removing disablepictureinpicture attribute from video element.');
                    video.removeAttribute('disablepictureinpicture');
                }
            });
        }
    }, 50);

})();
