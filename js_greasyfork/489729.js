// ==UserScript==
// @name         Twitter/X.com mark all media as sensitive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Marks all media as sensitive. This could be used to avoid seeing unwanted NSFW content.
// @author       Azeez
// @match        https://*.twitter.com/*
// @match        https://*.x.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489729/TwitterXcom%20mark%20all%20media%20as%20sensitive.user.js
// @updateURL https://update.greasyfork.org/scripts/489729/TwitterXcom%20mark%20all%20media%20as%20sensitive.meta.js
// ==/UserScript==

(function() {
    let findObjectsForKey = function(obj, keys) {
        return Object.entries(obj).reduce((found, [key, value]) => {
            if (keys.includes(key)) {
                found.push(value);
            }
            if (value != null && typeof(value) == 'object') {
                found = found.concat(findObjectsForKey(value, keys));
            }
            return found;
        }, []);
    };

    let blurMedia = function(data) {
        findObjectsForKey(data, ['media']).forEach(obj => {
            if (Array.isArray(obj)) {
                obj.forEach(media => {
                    if (typeof media == 'object') {
                        media.sensitive_media_warning = {other: true};
                    }
                });
            }
        });
    };

    let old_parse = unsafeWindow.JSON.parse;
    let new_parse = function(string) {
        let data = old_parse(string);
        blurMedia(data);
        return data;
    };
    exportFunction(new_parse, unsafeWindow.JSON, { defineAs: "parse" });
})();
