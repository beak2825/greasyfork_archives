// ==UserScript==
// @name         5adanhao.com
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://www.5adanhao.com/Member/DsSearch.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368044/5adanhaocom.user.js
// @updateURL https://update.greasyfork.org/scripts/368044/5adanhaocom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(GetSel("_c2") != '全部'){
        layer.alert = function(){};
        $('#tbmy img[danhaotype]').click();
    }
})();