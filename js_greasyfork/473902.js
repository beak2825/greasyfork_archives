// ==UserScript==
// @name         Webpack
// @namespace    osu
// @version      1.0.7
// @description  Expose webpack modules to userscripts
// @author       Magnus Cosmos
// ==/UserScript==

function isNonEmptyObj(obj) {
    if (obj === null || (typeof obj !== "function" && typeof obj !== "object")) {
        return false;
    }
    for (const _key in obj) {
        return true;
    }
    return false;
}
class webpack {
    constructor() {
        if (this.constructor == webpack) {
            throw new Error("webpack class cannot be instantiated.");
        }
        this.loaded = false;
        this.modules = {};
    }

    inject(entryPoint, data) {
        try {
            if (unsafeWindow) {
                unsafeWindow[entryPoint].push(data);
            } else {
                window[entryPoint].push(data);
            }
        } catch (err) {
            throw new Error(`Injection failed: ${err.message}`);
        }
    }
}
// Based on `Webpack-module-crack` and `moduleRaid`
class Webpack extends webpack {
    constructor(options) {
        super();
        if (this.loaded) {
            return;
        }
        let { moduleId, chunkId, entryPoint } = options || {};
        moduleId = moduleId || Math.random().toString(36).substring(2, 6);
        chunkId = chunkId || Math.floor(101 + Math.random() * 899);
        entryPoint = entryPoint || "webpackJsonp";
        const data = [
            [chunkId],
            {
                [moduleId]: (_module, _exports, require) => {
                    const installedModules = require.c;
                    for (const id in installedModules) {
                        const exports = installedModules[id].exports;
                        if (isNonEmptyObj(exports)) {
                            this.modules[id] = exports;
                        }
                    }
                },
            },
            [[moduleId]],
        ];
        this.inject(entryPoint, data);
        this.loaded = true;
    }
}