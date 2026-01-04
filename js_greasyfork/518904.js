// ==UserScript==
// @name         强制开启 Vue DevTools（支持 Vue 2 和 Vue 3）
// @namespace    https://github.com/SihenZhang
// @license      MIT
// @version      1.1.0
// @description  在生产环境强制开启 Vue DevTools，支持 Vue 2 和 Vue 3。原代码来自 wisokey (https://linux.do/t/topic/182358)，对原代码进行了部分重构。
// @author       SihenZhang, wisokey
// @copyright    wisokey (https://linux.do/t/topic/182358)
// @match        *://**/*
// @icon         https://vuejs.org/logo.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518904/%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%20Vue%20DevTools%EF%BC%88%E6%94%AF%E6%8C%81%20Vue%202%20%E5%92%8C%20Vue%203%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518904/%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%20Vue%20DevTools%EF%BC%88%E6%94%AF%E6%8C%81%20Vue%202%20%E5%92%8C%20Vue%203%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create TreeWalker to traverse DOM
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT
    );

    // Helper function to initialize Vue 3 DevTools
    const initVue3DevTools = (app) => {
        const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
        hook.emit('app:init', app, app.version, {
            Fragment: 'Fragment',
            Text: 'Text',
            Comment: 'Comment',
            Static: 'Static'
        });
    };

    // Helper function to initialize Vue 2 DevTools
    const initVue2DevTools = (vue) => {
        const root = vue.$root;
        let constructor = root.__proto__.__proto__.constructor;

        if (constructor.config?.devtools === undefined) {
            constructor = root.__proto__.constructor;
        }

        if (constructor.config.devtools === true) {
            return;
        }

        constructor.config.devtools = true;
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', constructor);
    };

    // Traverse DOM and initialize DevTools
    let node;
    while ((node = walker.nextNode())) {
        // Vue 3
        if (node.__vue_app__) {
            console.log('[强制开启 Vue DevTools] 检测到 Vue 3，尝试强制开启 Vue DevTools 中……');
            initVue3DevTools(node.__vue_app__);
        }
        // Vue 2
        else if (node.__vue__) {
            console.log('[强制开启 Vue DevTools] 检测到 Vue 2，尝试强制开启 Vue DevTools 中……');
            initVue2DevTools(node.__vue__);
        }
    }
})();