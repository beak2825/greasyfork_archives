// ==UserScript==
// @name         View as member at hacked.com
// @version      0.0.1
// @description  enter something useful
// @author       TienNH
// @include      https://hacked.com/*
// @grant        none
// @run-at      document-start
// @namespace https://greasyfork.org/users/16893
// @downloadURL https://update.greasyfork.org/scripts/37730/View%20as%20member%20at%20hackedcom.user.js
// @updateURL https://update.greasyfork.org/scripts/37730/View%20as%20member%20at%20hackedcom.meta.js
// ==/UserScript==

function set_cookie(name, value) {
  document.cookie = name +'='+ value +'; Path=/;';
}
function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

(function() {
    'use strict';

   setInterval(function(){
     delete_cookie('pmpro_lpv_count');
   }, 0);

})();