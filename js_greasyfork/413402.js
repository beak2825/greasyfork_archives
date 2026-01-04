// ==UserScript==
// @name         DiscordExperiments
// @version      1.0.0
// @description  Enable the Experiments menu in your Discord settings
// @author       lexisother
// @license      Apache-2.0
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/695397-lexisother
// @downloadURL https://update.greasyfork.org/scripts/413402/DiscordExperiments.user.js
// @updateURL https://update.greasyfork.org/scripts/413402/DiscordExperiments.meta.js
// ==/UserScript==

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
    Object.defineProperty(findByUniqueProperties(["isDeveloper"]),"isDeveloper",{get:_=>1,set:_=>_,configurable:true});
})();