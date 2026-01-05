// ==UserScript==
// @name       jawz Hybrid - Log In
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/users/sign_in*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12613/jawz%20Hybrid%20-%20Log%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/12613/jawz%20Hybrid%20-%20Log%20In.meta.js
// ==/UserScript==

$('#user_email').val('USER HERE');
$('#user_password').val('PASSWORD HERE');
$('input[name=commit]').click();
