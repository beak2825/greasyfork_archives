// ==UserScript==
// @name         Bt No Login
// @version      0.2
// @description  N0N
// @author       Panda
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/730524
// @downloadURL https://update.greasyfork.org/scripts/424387/Bt%20No%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/424387/Bt%20No%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var check = document.getElementsByClassName('bt-warp');
    if(check.length > 0){
        document.getElementById('layui-layer-shade1').remove();
        document.getElementById('layui-layer1').remove();
    }
})();