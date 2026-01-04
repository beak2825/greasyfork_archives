// ==UserScript==
// @name         self test code
// @namespace    http://mytesttampermonkey.net/
// @version      0.1
// @description  self test code dont download
// @include      http*://issue.cpic.com.cn/*
// @include      http*://2.taobao.com/*
// @author       mmyy

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40923/self%20test%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/40923/self%20test%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';
   var cusName =  document.querySelector("#holderVo input[name='name']");
   console.log(cusName);
   console.log(cusName.value);
   
})();