// ==UserScript==
// @name        Earnings Search
// @description searches
// @namespace   o_O
// @include     http://www.mturkcrowd.com/search/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24646/Earnings%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/24646/Earnings%20Search.meta.js
// ==/UserScript==

document.getElementById('ctrl_keywords').value = 'earnings full details';

document.getElementById('ctrl_nodes').selectedIndex = '2';

document.getElementById('ctrl_child_nodes').click();

setTimeout(function(){ 
    document.getElementsByClassName('button primary')[2].click();
}, 3000);