// ==UserScript==
// @name         Always video progress bar on ani.gamer.com.tw
// @namespace    https://wiki.gslin.org/wiki/Always_video_progress_bar_on_ani.gamer.com.tw
// @version      0.20210508.0
// @description  Enable progress bar on ani.gamer.com.tw
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/383563/Always%20video%20progress%20bar%20on%20anigamercomtw.user.js
// @updateURL https://update.greasyfork.org/scripts/383563/Always%20video%20progress%20bar%20on%20anigamercomtw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bar = document.createElement('div');
    bar.style = 'background: #000; display: block; height: 5px; margin: 0; padding: 0; position: relative; width: 100%;';

    let loadedbar = document.createElement('div');
    loadedbar.style = 'background: #777; display: block; height: 5px; margin: 0; padding: 0; position: absolute; width: 100%;';
    bar.appendChild(loadedbar);

    let progressbar = document.createElement('div');
    progressbar.style = 'background: #00b4d8; display: block; height: 5px; margin: 0; padding: 0; position: absolute; width: 100%; z-index: 1;';
    bar.appendChild(progressbar);

    let vf = document.querySelector('.videoframe');

    /*
     * Append "bar" element to the correspoding position.
     */
    let ob1 = new window.MutationObserver(() => {
        let vjs = document.querySelector('video-js');
        if (!vjs || !vjs.classList.contains('vjs-playing')) {
            return;
        }

        let v = vf.querySelector('#ani_video_html5_api');
        if (!v) {
            return;
        }

        v.addEventListener('progress', () => {
            loadedbar.style.width = (100 * v.buffered.end(0) / v.duration) + '%';
        });
        v.addEventListener('timeupdate', () => {
            progressbar.style.width = (100 * v.currentTime / v.duration) + '%';
        });

        // Different position in ".fullwindow" mode.
        if (vf.classList.contains('vjs-fullwindow')) {
            vf.after(bar);
        } else {
            vf.appendChild(bar);
        }

        ob1.disconnect();
    });
    ob1.observe(vf, {
        childList: true,
        subtree: true,
    });

    /*
     * Handle pause & resume.
     */
    let ob2 = new window.MutationObserver(() => {
        let vjs = document.querySelector('video-js');
        if (!vjs) {
            return;
        }

        if (vjs.classList.contains('vjs-playing') && vjs.classList.contains('vjs-user-inactive')) {
            bar.style.display = 'block';
        } else {
            bar.style.display = 'none';
        }
    });
    ob2.observe(vf, {
        childList: true,
        subtree: true,
    });
})();
