// ==UserScript==
// @name         YouTube Shorts Redirect
// @description  Force YouTube to Redirect to Normal Video instead of Shorts
// @author       636597
// @version      0.0.1
// @match        https://*.youtube.com/shorts/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/22755
// @downloadURL https://update.greasyfork.org/scripts/477482/YouTube%20Shorts%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/477482/YouTube%20Shorts%20Redirect.meta.js
// ==/UserScript==

// Example :
// Replace : https://www.youtube.com/shorts/on_c_Aujobc
// With : https://www.youtube.com/watch?v=on_c_Aujobc

let shorts_url = window.location.href;
let normal_url = shorts_url.replace( "shorts/" , "watch?v=" );
window.location.replace( normal_url );