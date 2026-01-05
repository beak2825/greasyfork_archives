// ==UserScript==
// @name            I Wanna Be An Active User
// @description     Automatically posts the text content from Dawn event to the popular thread
// @include         http://e-hentai.org/*
// @include         http://g.e-hentai.org/*
// @include         http://forums.e-hentai.org/index.php?showtopic=12100&dawn_msg=*
// @version 0.0.1.20140902114634
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/24551/I%20Wanna%20Be%20An%20Active%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/24551/I%20Wanna%20Be%20An%20Active%20User.meta.js
// ==/UserScript==

/*** Settings ***/
var auto_submit = false // change this to 'false' if you don't want the script to auto-submit for you
/***          ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(/^http:\/\/e-hentai\.org\//.test(href))
{
    var eventpane = doc.getElementById('eventpane')
    if(!eventpane) { throw 'exit' }
    var t = eventpane.textContent
    if(!/\bdawn\b/i.test(t)) { throw 'exit' }
    var frm = doc.createElement('IFRAME')
    frm.src = 'http://forums.e-hentai.org/index.php?showtopic=12100&dawn_msg=' + encodeURIComponent(t)
    frm.width = wnd.innerWidth
    frm.height = wnd.innerHeight * 0.3
    frm.frameBorder = 0
    doc.getElementById('botm').parentNode.replaceChild(frm, doc.getElementById('botm'))
}
else
{
    ShowHide('qr_open','qr_closed')
    var fast_reply_area = doc.getElementById('fastreplyarea')
    fast_reply_area.value = decodeURIComponent(/&dawn_msg=([^&]*)/.exec(loc.search)[1])
    var btn = doc.getElementsByName('submit')[0]
    if(btn.value == 'Add Reply')
    {
        btn.focus()
        if(auto_submit) { btn.submit() }
    }
}
