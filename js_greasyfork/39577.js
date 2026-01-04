// ==UserScript==
// @name         fr anti grosbenz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Plus de problème de grosbenz ;)
// @author       Neolud
// @match        http://www.jeuxvideo.com/forums/0-36-0-1-0-1-0-guerre-des-consoles.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39577/fr%20anti%20grosbenz.user.js
// @updateURL https://update.greasyfork.org/scripts/39577/fr%20anti%20grosbenz.meta.js
// ==/UserScript==

(function() {
  var a = document.querySelectorAll('#forum-main-col li>a');
    for(var i = 0; i < a.length; i++){
        if (a[i].innerHTML.indexOf("grosbenz") !== -1)
            a[i].parentNode.remove();
    }
})();