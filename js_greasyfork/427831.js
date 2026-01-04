// ==UserScript==
// @name         CSDN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去广告
// @author       You
// @match        https://blog.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427831/CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/427831/CSDN.meta.js
// ==/UserScript==

GM_addStyle('.blog_container_aside{display:none}')
GM_addStyle('.toolbar-inside{display:none}')
GM_addStyle('.csdn-side-toolbar {display:none}')
GM_addStyle('#toolBarBox{display:none}')

(function() {
    'use strict';

    // Your code here...
})();