// ==UserScript==
// @name        Region loop
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @grant       unsafeWindow
// @version     1.0.1
// @author      5ec1cff
// @run-at      document-body
// @description 2024/5/15 14:39:50
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/495015/Region%20loop.user.js
// @updateURL https://update.greasyfork.org/scripts/495015/Region%20loop.meta.js
// ==/UserScript==

((window) => {
    let document = window.document;
    let enableCheck;
    let leftBtn;
    let leftResetBtn;
    let rightBtn;
    let rightResetBtn;

    let left = null, right = null, enabled = false;
    function install(dom, video) {
        let root = dom.querySelector('#my_play_control');
        if (root == null) root = document.createElement('div');
        root.id = 'my_play_control';
        dom.appendChild(root);
        root.innerHTML = `
        <input type="checkbox" id="enable_loop">
        <label for="enable_loop">开启循环</label>
        <input type="button" value="[x" id="reset_left" />
        <input type="button" value="[" id="set_left" />
        <input type="button" value="]" id="set_right" />
        <input type="button" value="x]" id="reset_right" />
        `;
        enableCheck = root.querySelector('#enable_loop');
        leftBtn = root.querySelector('#set_left');
        leftResetBtn = root.querySelector('#reset_left');
        rightBtn = root.querySelector('#set_right');
        rightResetBtn = root.querySelector('#reset_right');
        enableCheck.addEventListener('change', () => {
            enabled = enableCheck.checked;
        })
        leftBtn.addEventListener('click', () => {
            let newLeft = video.currentTime;
            if (newLeft >= (right ?? Infinity)) return;
            left = newLeft;
            leftBtn.value='['+left;
        })
        rightBtn.addEventListener('click', () => {
            let newRight = video.currentTime;
            if (newRight <= (left ?? 0)) return;
            right = newRight;
            rightBtn.value=right+']';
        })
        leftResetBtn.addEventListener('click', () => {
            left = null;
            leftBtn.value='[';
        })
        rightResetBtn.addEventListener('click', () => {
            right = null;
            rightBtn.value=']';
        })
        video.addEventListener('timeupdate', () => {
            if (!enabled) return;
            let current = video.currentTime;
            if (current >= (right ?? Infinity) || current < left) video.currentTime = left ?? 0;
        })
        video.addEventListener('ended', () => {
            if (!enabled) return;
            video.currentTime = left ?? 0;
            video.play();
        })
    }
    let intv = 0;
    intv = setInterval(() => {
      let root = document.querySelector('#viewbox_report'), video = document.querySelector('video');
      if (root == null || video == null) return;
      install(root, video);
      console.log('install success on', root, video)
      clearInterval(intv);
    }, 1000)

})(unsafeWindow)
