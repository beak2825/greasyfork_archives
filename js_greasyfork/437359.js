// ==UserScript==
// @name         Twitter hide content warning crap
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Makes it so nothing is marked as sensitive.
// @author       cromachina
// @match        https://*.twitter.com/*
// @match        https://*.x.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437359/Twitter%20hide%20content%20warning%20crap.user.js
// @updateURL https://update.greasyfork.org/scripts/437359/Twitter%20hide%20content%20warning%20crap.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    let find_objects_at_keys = function(obj, keys)
    {
        let found = [];
        let stack = Object.entries(obj);
        while (stack.length > 0)
        {
            let current = stack.pop();
            if (keys.includes(current[0]))
            {
                found.push(current[1]);
            }
            if (current[1] != null && typeof(current[1]) == 'object')
            {
                stack = stack.concat(Object.entries(current[1]));
            }
        }
        return found;
    };

    let fix_media = function(data)
    {
        for (let obj of find_objects_at_keys(data, ['media']))
        {
            if (!Array.isArray(obj))
            {
                continue;
            }
            for (let media of obj)
            {
                if (typeof media != 'object')
                {
                    continue;
                }
                delete media.sensitive_media_warning;
                media.ext_sensitive_media_warning = null;
            }
        };
        for (let obj of find_objects_at_keys(data, ['legacy']))
        {
            if (obj != null && obj.hasOwnProperty('possibly_sensitive') && typeof obj.possibly_sensitive == 'boolean')
            {
                obj.possibly_sensitive = false;
            }
        }
    };

    // Intercept JSON parses to alter the sensitive media data.
    let old_parse = unsafeWindow.JSON.parse;
    let new_parse = function(string)
    {
        let data = old_parse(string);
        try
        {
            if (data != null)
            {
                fix_media(data);
            }
        }
        catch(error)
        {
            console.log(error);
        }
        return data;
    };
    exportFunction(new_parse, unsafeWindow.JSON, { defineAs: "parse" });
})();
