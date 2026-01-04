// ==UserScript==
// @name         let me in
// @version      0.0.0.1
// @description  在文玩部落的隐藏贴自动回复
// @include      /.*www.haohetao.com/thread-[0-9]*-[0-9]*-[0-9]*.html/
// @author       AkiyamaYummy
// @namespace https://greasyfork.org/users/9356
// @downloadURL https://update.greasyfork.org/scripts/39334/let%20me%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/39334/let%20me%20in.meta.js
// ==/UserScript==

if(document.getElementsByClassName('locked').length > 0) {
    var tid = /[0-9]*(?=-[0-9]*-[0-9]*.html)/.exec(location.href)[0];
    setTimeout("showWindow('reply', 'http://www.haohetao.com/forum.php?mod=post&action=reply&tid=' + tid);",1000);
    setTimeout("postmessage.textContent = '自动回复脚本,由 [url=http://www.haohetao.com/home.php?mod=space&uid=500854]我[/url] 制作';postsubmit.click();",2000);
    setTimeout("fwin_dialog_submit.click();",3000)
}
