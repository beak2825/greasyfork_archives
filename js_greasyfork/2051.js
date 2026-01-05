// ==UserScript==
// @name        muyuge.bookmark.close
// @namespace   clumsyman
// @description Close window automatically after adding a bookmark - delay 3 seconds
// @include     http://muyuge.com/addbookcase.php?*
// @include     http://muyuge.net/addbookcase.php?*
// @include     http://www.muyuge.net/addbookcase.php?*
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/2051/muyugebookmarkclose.user.js
// @updateURL https://update.greasyfork.org/scripts/2051/muyugebookmarkclose.meta.js
// ==/UserScript==

var delay = 3;

function closeAfter(delay, msgBox) {
    if (delay > 0) {
        msgBox.innerHTML = "窗口将在"+delay+"秒后自动关闭……";
        setTimeout(closeAfter, 1000, delay-1, msgBox);
    } else {
        window.close();
    }
}

var msgBox = document.querySelector(".msgBox > ol");
if (msgBox) {
    closeAfter(delay, msgBox);
} else {
    alert("not found: .msgBox");
}
