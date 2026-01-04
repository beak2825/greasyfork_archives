// ==UserScript==
// @name         FB2mbasic
// @author       Li_Bibo
// @namespace    https://greasyfork.org/zh-TW/scripts/474729
// @description  重整網頁就轉成mbasic.FB，避免www.FB或m.FB不定時重整讓您丟失目前網頁問題。Reload webpage to switch mbasic.FB, in order to avoid intermittent updates on www.FB or m.FB that may cause you to lose your current webpage state.
// @match        *://www.facebook.com/*
// @match        *://m.facebook.com/*
// @run-at       document-start
// @version 0.2.1.2
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/474729/FB2mbasic.user.js
// @updateURL https://update.greasyfork.org/scripts/474729/FB2mbasic.meta.js
// ==/UserScript==
var utm = location.href.match("//www.", "//m.")
if (utm == null)
{
    return
}
else
{
    utm = location.href.replace("//www.", "//mbasic.");
    location.replace (utm);
}
var url = location.href.match("//mbasic.")
if (url == null)
{
    return
}
else
{
    url = location.href.replace("//m.", "//mbasic.");
    location.replace (url);
};
