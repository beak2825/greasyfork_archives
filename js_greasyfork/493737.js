// ==UserScript==
// @name            Enable Vue Dev Tools
// @namespace       Enable Vue Dev Tools
// @match           *://*/*
// @grant           none
// @version         1.0
// @author          Alfredo3232
// @description     Forces Vue Dev Tools to work in production builds on any page.
// @license         GPL-3.0
// @homepageURL     https://github.com/Alfredo3232/webScripts
// @supportURL      https://github.com/Alfredo3232/webScripts/issues
// @compatible      firefox
// @compatible      librewolf
// @downloadURL https://update.greasyfork.org/scripts/493737/Enable%20Vue%20Dev%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/493737/Enable%20Vue%20Dev%20Tools.meta.js
// ==/UserScript==

let activeVueTools = () => {
    // Find Vue 2
    let app = Array.from(document.querySelectorAll("*")).find((e) => e.__vue__).__vue__;

    if (app) {
        // Enable VueDevTools config
        const devtools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
        devtools.enabled = true;

        // Enable VueDevTools
        let VueApp = Object.getPrototypeOf(app).constructor;

        while (VueApp.super) {
            VueApp = VueApp.super;
        }

        VueApp.config.devtools = true;

        // Restart Extension
        devtools.emit("init", VueApp);

        return;
    }

    // Find Vue 3
    if (app === undefined || app === null) {
        app = Array.from(document.querySelectorAll("*")).find((e) => e.__vue_app__).__vue_app__;

        if (app === undefined || app === null) return;
    }

    //  Initialize and enable VueDevTools config
    const version = app.version;
    const devtools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
    devtools.enabled = true;

    // Restart Extension
    devtools.emit("app:init", app, version, {});

    return;
};

// Time out to prevent some pages from breaking
setTimeout(activeVueTools, 500);