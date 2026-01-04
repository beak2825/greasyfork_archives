// ==UserScript==
// @name            Opal-Keep-Login
// @author          Norman
// @namespace       https://bildungsportal.sachsen.de/*
// @description     Reloads the currently open OPAL page after 1,5 hours so that it keeps logged in
// @license         WTFPL
// @version             0.1
// @include         https://bildungsportal.sachsen.de/*
// @released        2020-11-16
// @updated         2020-11-16
// @compatible      Greasemonkey
// @downloadURL https://update.greasyfork.org/scripts/416285/Opal-Keep-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/416285/Opal-Keep-Login.meta.js
// ==/UserScript==
 
(function(){
        setTimeout(function(){ location.reload(); }, 1.5 * 60*60*1000);
})();
