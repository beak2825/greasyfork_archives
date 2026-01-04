// ==UserScript==
// @name         Incognito Mode enabler for school
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Search on google: classroom go ogle and pres OK
// @author       iron web10
// @match        https://www.google.com/search?q=classroom+go+ogle*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      iron web10
// @downloadURL https://update.greasyfork.org/scripts/468703/Incognito%20Mode%20enabler%20for%20school.user.js
// @updateURL https://update.greasyfork.org/scripts/468703/Incognito%20Mode%20enabler%20for%20school.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (confirm("Enter to incognito mode")) {
  (()=>{var t;(t=document.createElement("iframe")).setAttribute("src","https://history-bypass.vercel.app"),t.setAttribute("id","rusic-modal"),t.setAttribute("style","position:fixed;width:100%;height:100%;top:0;left:0;right:0;bottom:0;z-index:99999999999;background: #0f172a;border:0;"),document.getElementsByTagName("body")[0].appendChild(t),document.body.style.overflow="hidden"}).call(this);

} else {
  txt = "You pressed Cancel!";
}

   })();