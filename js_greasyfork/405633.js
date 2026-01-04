// ==UserScript==
// @name              fuck off tdsourcetag v1.5
// @name:zh-CN        去除tdsourcetag v1.5
// @version           1.5
// @description       an improved version of https://greasyfork.org/zh-CN/scripts/392201
// @description:zh-cn 去除URL中的tdsourcetag
// @author            chess99
// @create            2020-06-18
// @match             http://*/*
// @match             https://*/*
// @grant             none
// @run-at            document-start
// @namespace         https://greasyfork.org/users/584389
// @downloadURL https://update.greasyfork.org/scripts/405633/fuck%20off%20tdsourcetag%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/405633/fuck%20off%20tdsourcetag%20v15.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // tdsourcetag=s_macqq_app
  // tdsourcetag=s_pctim_aiomsg
  if(/tdsourcetag=/.test(window.location.href)) {
      var newUrl = window.location.href.replace(/\?tdsourcetag=\w+\&/, '?').replace(/\?tdsourcetag=\w+/, '').replace(/\&tdsourcetag=\w+/g, '')
      window.location.replace(newUrl)
  }
})();