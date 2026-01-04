// ==UserScript==
// @name        Show Cookies
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @match        https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&B_UID=0&sid=&channel=0&g_ut=1&cmd=store
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427206/Show%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/427206/Show%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $a = $(`<br><input id="foo" type="text"><button class="btn" data-clipboard-target="#foo">复制</button>`);
    let cookie = {"url": "https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?cmd=index", "cookie": document.cookie}
    $a.val(JSON.stringify(cookie));
    $("a").last().after($a);
    var clipboard = new ClipboardJS('.btn');
    clipboard.on('success', function(e) {
        alert("复制成功")
    });
    // Your code here...
})();