// ==UserScript==
// @name         Pawoo show 'Not Available' images
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Attempt to fix the issue where images show as 'Not Available' on Pawoo.
// @author       cro
// @match        https://pawoo.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pawoo.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470147/Pawoo%20show%20%27Not%20Available%27%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/470147/Pawoo%20show%20%27Not%20Available%27%20images.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
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

    let video_types = new Set([
        '3g2',
        '3gp',
        'avi',
        'm4v',
        'mov',
        'mp4',
        'mpeg',
        'ogv',
        'ts',
        'webm',
    ]);

    let get_type = function(url)
    {
        if (video_types.has(url.split('.').pop()))
        {
            return 'video';
        }
        return 'image';
    };

    let fix_media = function(media)
    {
        if (typeof media == 'object' && media.type == 'unknown')
        {
            media.url = media.remote_url;
            media.preview_url = media.remote_url;
            media.preview_remote_url = media.remote_url;
            media.type = get_type(media.remote_url);
        }
    };

    let fix_media_attachments = function(data)
    {
        for (let obj of find_objects_at_keys(data, ['media_attachments']))
        {
            if (!Array.isArray(obj))
            {
                continue;
            }
            for (let media of obj)
            {
                fix_media(media);
            }
        };
    };

    let old_parse = unsafeWindow.JSON.parse;
    let new_parse = function(string)
    {
        let data = old_parse(string);
        if (data != null)
        {
            fix_media_attachments(data);
        }
        return data;
    };
    exportFunction(new_parse, unsafeWindow.JSON, { defineAs: "parse" });
})();