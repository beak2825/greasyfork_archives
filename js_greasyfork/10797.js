// ==UserScript==
// @name        HV - Open MoogleMail in New Tab
// @grant       unsafeWindow
// @grant       GM_openInTab
// @include     http://hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox*
// @include     http://hentaiverse.org/?s=Bazaar&ss=mm&filter=read*
// @include     http://hentaiverse.org/?s=Bazaar&ss=mm&filter=sent*
// @version 0.0.1.20150706005638
// @namespace https://greasyfork.org/users/2233
// @description Open MM in a new tab. Automatically recall MM. Automatically take attachments.
// @downloadURL https://update.greasyfork.org/scripts/10797/HV%20-%20Open%20MoogleMail%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/10797/HV%20-%20Open%20MoogleMail%20in%20New%20Tab.meta.js
// ==/UserScript==

/*** Settings ***/

var auto_take_attachment = false
var auto_recall = false // only used in the sentbox
var auto_close_mail_without_attachment = false

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var letters = $('#mainpane').querySelectorAll('tr[onclick]')
for(var i=0, len=letters.length; i<len; i++) {
    (function() {
        var url = ''
        if(/&filter=inbox/.test(href)) { url = 'http://hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox&mid=' }
        else if(/&filter=read/.test(href)) { url = 'http://hentaiverse.org/?s=Bazaar&ss=mm&filter=read&mid=' }
        else if(/&filter=sent/.test(href)) { url = 'http://hentaiverse.org/?s=Bazaar&ss=mm&filter=sent&mid=' }
        url += letters[i].onclick.toString().match(/&?\bmid=(\d+)/)[1]
        letters[i].onclick = function() {
            if(typeof GM_openInTab != 'undefined') { GM_openInTab(url, true) }
            else { window.open(url, '_blank') }
        }
    })()
}
if(auto_recall) {
    if(/&filter=sent/.test(href)) {
        if(/&?\bmid=/.test(href)) {
            if($('img[src="http://ehgt.org/v/mooglemail/recallmail.png"]')) {
                if(typeof unsafeWindow != 'undefined') { unsafeWindow.mooglemail.return_mail() }
                else { window.mooglemail.return_mail() }
            }
        }
    }
}
if(auto_take_attachment) {
    if(/&?\bmid=/.test(href)) {
        if($('img[src="http://ehgt.org/v/mooglemail/takeattacheditem.png"]')) {
            if(typeof unsafeWindow != 'undefined') { unsafeWindow.mooglemail.remove_attachment() }
            else { window.mooglemail.remove_attachment() }
        }
    }
}
if(auto_close_mail_without_attachment) {
    if(/&?\bmid=/.test(href)) {
        if(!$('img[src="http://ehgt.org/v/mooglemail/recallmail.png"]') && !$('img[src="http://ehgt.org/v/mooglemail/takeattacheditem.png"]') && $('img[src="http://ehgt.org/v/mooglemail/closemail.png"]')) {
            if(typeof unsafeWindow != 'undefined') { unsafeWindow.close() }
            else { window.close() }
        }
    }
}
