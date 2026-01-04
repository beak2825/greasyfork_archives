// ==UserScript==
// @name         Hide Useless Tasks from manaba
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  manabaの未提出課題欄の海外渡航届及びINFOSSを消す
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://manaba.tsukuba.ac.jp/ct/home_library_query
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/409491/Hide%20Useless%20Tasks%20from%20manaba.user.js
// @updateURL https://update.greasyfork.org/scripts/409491/Hide%20Useless%20Tasks%20from%20manaba.meta.js
// ==/UserScript==

var D = document;
const table = D.getElementsByTagName('table')[0]
const rows = table.getElementsByTagName('tr');
for(var i = 1;i <= rows.length-1;i++){
    var course =
        rows[i].getElementsByTagName('a')[2].text;
    if(course.match(/Overseas|INFOSS/)){
        rows[i].style.display = 'none';
    }
}