// ==UserScript==
// @name           adiary wiki content link key fix
// @namespace      http://efcl.info/
// @description    adiaryのwikiコンテンツ化したリンクキーを自動で入力
// @include        http://efcl.info/adiary/*?diary_edit
// @version 0.0.1.20140518104257
// @downloadURL https://update.greasyfork.org/scripts/1169/adiary%20wiki%20content%20link%20key%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/1169/adiary%20wiki%20content%20link%20key%20fix.meta.js
// ==/UserScript==
new function() {
    var title = document.getElementsByName("title")[0];
    var linkkey = document.getElementsByName("link_key")[0];
    var upnodeSelect = document.getElementById("upnode-select");
    var reg = /[\s.!#$%<>"'()=~|?:@,;\\]/g; // 除外する文字列
    title.addEventListener("keyup", function() {
        linkkey.value = title.value.replace(reg, "");
    }, false);
    upnodeSelect.addEventListener("change", function(evt) {
        var selectValue = evt.target.value || null;
        if (selectValue) {
            linkkey.value = selectValue.replace(reg, "") + "/" + linkkey.value;
        }
    }, false);
}