// ==UserScript==
// @name         traQ escaper
// @namespace    https://q.trap.jp/
// @version      0.1
// @description  人が来たら Esc キーを押して秒で逃げる部 🫣
// @author       hayatroid
// @match        https://q.trap.jp/*
// @license      CC0-1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/537542/traQ%20escaper.user.js
// @updateURL https://update.greasyfork.org/scripts/537542/traQ%20escaper.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let $router, $pinia;

    document.addEventListener('keydown', e => {
        // check if Esc pressed
        if (e.key !== 'Escape') return;

        // init $router and $pinia (for the first time)
        if (!$router || !$pinia) {
            const gp = document.querySelector('#app')?.__vue_app__?.config?.globalProperties;
            if (!gp?.$router || !gp?.$pinia) return;
            ({ $router, $pinia } = gp);
        }

        // move to your own DM channel!
        $router.push(`/users/${$pinia.state.value['domain/me'].detail.name}`);
    });
})();
