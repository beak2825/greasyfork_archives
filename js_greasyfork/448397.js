// ==UserScript==
// @name         FreeWanwei
// @description  Free
// @version      0.1
// @author       Jeoy_Pei
// @match        https://www.wanweibaike.net/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/929066
// @downloadURL https://update.greasyfork.org/scripts/448397/FreeWanwei.user.js
// @updateURL https://update.greasyfork.org/scripts/448397/FreeWanwei.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     $(document).ready(function()
    {
         var mask=document.getElementsByClassName("real-all-mask");
         var maskP=mask[0].parentNode;
         maskP.removeChild(mask[0]);
        
     }
                       )
})();