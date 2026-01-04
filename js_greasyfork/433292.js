// ==UserScript==
// @name               Gmail - Remove emoji on mail list
// @name:zh-TW         Gmail - 移除信件列表中的emoji表情符號
// @name:zh-CN         Gmail - 移除邮件列表中的emoji表情符号
// @version            1.1.1
// @description        Remove emoji on the mail list of Gmail.
// @description:zh-TW  在Gmail信件列表中移除emoji表情符號
// @description:zh-CN  在Gmail邮件列表中移除emoji表情符号
// @author             BaconBao
// @namespace          https://github.com/baconbao/
// @match              https://mail.google.com/mail/*
// @icon               https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico
// @grant              GM_addStyle
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         Tampermonkey
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/433292/Gmail%20-%20Remove%20emoji%20on%20mail%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/433292/Gmail%20-%20Remove%20emoji%20on%20mail%20list.meta.js
// ==/UserScript==

GM_addStyle(`
    tr[jscontroller][jsmodel][jsaction] img[data-emoji] {
        display: none;
    }
`);
