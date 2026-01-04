// ==UserScript==
// @name         autoLoginOA
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://passport.sjfood.us/sso/login?ReturnUrl=%2Foauth2%2Fauthorize%3Fclient_id%3D450c6c03fc44c43b%26redirect_uri%3Dhttps%3A%2F%2Fmyoa.sjfood.us%2Fauthorize%2Fcallback%26response_type%3Dcode
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383310/autoLoginOA.user.js
// @updateURL https://update.greasyfork.org/scripts/383310/autoLoginOA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
		$('#loginbtn button').click();
    }, 2000);
})();