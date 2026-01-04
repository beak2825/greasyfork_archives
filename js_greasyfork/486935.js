// ==UserScript==
// @name            Google Redirect Bypasser
// @namespace       https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version         1
// @description     Automatically opens the link after the text notice "The previous page is sending you to https://" ...
// @author          hacker09
// @match           https://www.google.com/url?*
// @icon            https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=64
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/486935/Google%20Redirect%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/486935/Google%20Redirect%20Bypasser.meta.js
// ==/UserScript==

(function() {
    document.querySelector("a").click(); //Open the link
})();
