// ==UserScript==
// @name         FFN Redirect to Mobile
// @description  Redirect fanfiction.net to m.fanfiction.net.
// @author       C89sd
// @version      0.4
// @match        https://www.fanfiction.net/*
// @namespace    https://greasyfork.org/users/1376767
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/531494/FFN%20Redirect%20to%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/531494/FFN%20Redirect%20to%20Mobile.meta.js
// ==/UserScript==
location.replace(document.URL.replace("www.fanfiction.net", "m.fanfiction.net"));
