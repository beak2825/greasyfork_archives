// ==UserScript==
// @name         修复AP Classroom登陆
// @namespace    https://abucket.site/
// @version      0.1
// @description  Fix
// @author       Hanxi Zhang
// @match        https://prod.idp.collegeboard.org/*
// @icon         https://abucket.site/wp-content/uploads/2022/03/zue37Qj78-87c0K1iToS4i-4i.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441044/%E4%BF%AE%E5%A4%8DAP%20Classroom%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/441044/%E4%BF%AE%E5%A4%8DAP%20Classroom%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
      var config = OktaUtil.getSignInWidgetConfig();
      var oktaRequstContext = OktaUtil.getRequestContext();

      cb_customizeLinks(config);
	  cb_customizeTextLabelsWithRequestContext(oktaRequstContext);
      var oktaSignIn = new OktaSignIn(config);
      cb_customizeEventTracking(oktaSignIn);

      oktaSignIn.renderEl(
        {
          el: "#okta-login-container",
        },
        OktaUtil.completeLogin,
        function (error) {
          console.log(error.message, error);
        }
      );
})();