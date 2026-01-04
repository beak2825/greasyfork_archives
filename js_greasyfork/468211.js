// ==UserScript==
// @name         指鼠为鸭
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  这个世界上不再有鼠鼠，全是鸭鸭！
// @author       HowardZhangdqs
// @match        https://*.bing.com/search?*
// @match        https://www.baidu.com/s?*
// @icon         data:image/png;base64,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
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/468211/%E6%8C%87%E9%BC%A0%E4%B8%BA%E9%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/468211/%E6%8C%87%E9%BC%A0%E4%B8%BA%E9%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要替换的内容
    const replace_ls = {
        '鸭脖': /老鼠|鼠鼠/g,
        '鸭': /鼠/g,
    };

    // Get all DOM tags on the webpage
    var tags = document.querySelectorAll('body');

    // Loop through all DOM tags
    for (var i = 0; i < tags.length; i++) {
        // Get the innerHTML of the current tag
        var html = tags[i].innerHTML;

        // Replace all occurrences of "老鼠" with "鸭脖"
        for (let i in replace_ls)
            html = html.replace(replace_ls[i], i);

        // Set the new innerHTML of the current tag
        tags[i].innerHTML = html;
    }

})();