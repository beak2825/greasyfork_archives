// ==UserScript==
// @name         skytree-5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  resoure dispatch style adaptor
// @author       You
// @match        http://skytree.alif2e.com/table/5/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26435/skytree-5.user.js
// @updateURL https://update.greasyfork.org/scripts/26435/skytree-5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
html {
    font-size: 62.5%;
}
body {
    font-size: 12px;
    font-size: 1.2rem;
    line-height:1;
}

#head {
    height: 5.3rem;
}

#body {
    margin-top: 5.7rem;
}

#thead th span{
    font-size:1rem;
}

tbody td ,
thead span{
    padding: 0rem;
    -webkit-text-size-adjust:none;
    font-size: 0.5rem;
}

#thead th,
#thead th span,
#tbody td{
    width: 8em;
}

#thead th:nth-child(1),
#thead th:nth-child(1) span,
#tbody td:nth-child(1){
    width: 2em;
}

#thead th:nth-child(2),
#thead th:nth-child(2) span,
#tbody td:nth-child(2){
    width: 3em;
}



`);
    // Your code here...
})();