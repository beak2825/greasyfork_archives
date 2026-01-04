// ==UserScript==
// @name         DiabloData-Cube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  合成公式
// @author       班登
// @match        http://wiki.d.163.com/diablo/items/cube.htm
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        GM_setClipboard
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/431459/DiabloData-Cube.user.js
// @updateURL https://update.greasyfork.org/scripts/431459/DiabloData-Cube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const data = [];

    // Your code here...
    $('p > table').each(function(index, element) {
        const row = $(this);
        const content = row.find('tr > td:last');
        const lines = content.text().split('\n').map(i => i.replace(/\s+/g, ' ').trim());
        const recipe = lines[0].split(' = ');
        const ingredients = recipe[0].split(' + ');
        const result = recipe[1];
        data.push({
          ingredients,
          result,
          desc: lines.slice(1).join('\n')
        });
    });

    console.log(data);

    GM_setClipboard(JSON.stringify(data, null, 2));
})();