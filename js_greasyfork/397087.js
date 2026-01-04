// ==UserScript==
// @name         GITEE授权
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  授权
// @author       hulala
// @match        https://gitee.com/api/v5/swagger*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/moment.js/2.22.2/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397087/GITEE%E6%8E%88%E6%9D%83.user.js
// @updateURL https://update.greasyfork.org/scripts/397087/GITEE%E6%8E%88%E6%9D%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.$jq = jQuery.noConflict(true);
    
    function getToken() {
      var token = $jq('input[name="access_token"]');
      return $jq.trim(token.val());
    }
  
    window.top.postMessage({
      from: 'gitee',
      token: getToken()
    }, '*');
})();