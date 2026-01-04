// ==UserScript==
// @name         好视通打开助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击打开助手
// @required     http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @author       You
// @match        http://ws.hst.com/roomMgr/entermeeting.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371200/%E5%A5%BD%E8%A7%86%E9%80%9A%E6%89%93%E5%BC%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/371200/%E5%A5%BD%E8%A7%86%E9%80%9A%E6%89%93%E5%BC%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $(document).ready(function(){
            $("#clickme").click();
        });
})();