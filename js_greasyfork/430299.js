// ==UserScript==
// @name         Discord Experiments
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This code was extracted from Samogot's LibDiscordInternals.
// @author       ඞ ｒｅｄ#4818
// @match       *://discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430299/Discord%20Experiments.user.js
// @updateURL https://update.greasyfork.org/scripts/430299/Discord%20Experiments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (() => {
    // Extracted from Samogot's LibDiscordInternals for BetterDiscord.
    const req = typeof(webpackJsonp) === "function" ? webpackJsonp([], {
        '__extra_id__': (module, exports, req) => exports.default = req
    }, ['__extra_id__']).default : webpackJsonp.push([[], {
        '__extra_id__': (module, exports, req) => module.exports = req
    }, [['__extra_id__']]]);
    delete req.m['__extra_id__'];
    delete req.c['__extra_id__'];
    const find = (filter, options = {}) => {
        const {cacheOnly = true} = options;
        for (let i in req.c) {
            if (req.c.hasOwnProperty(i)) {
                let m = req.c[i].exports;
                if (m && m.__esModule && m.default && filter(m.default))
                    return m.default;
                if (m && filter(m))
                    return m;
            }
        }
        if (cacheOnly) {
            console.warn('Cannot find loaded module in cache');
            return null;
        }
        console.warn('Cannot find loaded module in cache. Loading all modules may have unexpected side effects');
        for (let i = 0; i < req.m.length; ++i) {
            try {
                let m = req(i);
                if (m && m.__esModule && m.default && filter(m.default))
                    return m.default;
                if (m && filter(m))
                    return m;
            }
            catch (e) {
            }
        }
        console.warn('Cannot find module');
        return null;
    };
    const findByUniqueProperties = (propNames, options) => find(module => propNames.every(prop => module[prop] !== undefined), options);
    // https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/discordexperiments.plugin.js
    Object.defineProperty(findByUniqueProperties(["isDeveloper"]),"isDeveloper",{get:_=>1,set:_=>_,configurable:true});
})();
})();