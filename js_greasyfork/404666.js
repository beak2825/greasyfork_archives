// ==UserScript==
// @name         腾讯课堂自动送花
// @namespace    Anubis Ja
// @version      0.1
// @description  腾讯课堂自动送花。5秒一次。
// @author       Anubis Ja
// @match        https://ke.qq.com/webcourse/index.html
// @run-at       document-end
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404666/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E9%80%81%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/404666/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E9%80%81%E8%8A%B1.meta.js
// ==/UserScript==
var _self = unsafeWindow,
    $ = _self.jQuery || window.jQuery;
var i = 0;
window.flower = setInterval(function() {
    $("[title='献花']").click();
    i++;
    console.log('已送花：' + i);
}, 5000);