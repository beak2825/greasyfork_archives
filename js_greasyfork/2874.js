// ==UserScript==
// @name           jkwon23 Saver
// @description    Ask jkwon23 to sleep when he is sitting up.
// @grant          GM_xmlhttpRequest
// @include        http://harddrop.com/file/shout/shout.php
// @version 0.0.1.20140809083510
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/2874/jkwon23%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/2874/jkwon23%20Saver.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(doc.getElementById('ShoutCloud-Container')==null) { throw 'exit' }

// enable the input box
addEventListener('load', function() {
    doc.getElementsByName('ShoutCloud-Msg')[0].disabled=false
    doc.getElementsByName('ShoutCloud-Msg')[0].value=''
}, false)

// don't clear unsent text when unfocuing the input box
doc.getElementsByName('ShoutCloud-Msg')[0].onblur = function() { return }

var is_late_night = function()
{
    try{
        var gm_xhr = GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://www.timeanddate.com/worldclock/fullscreen.html?n=137',
            synchronous: true,
        })
        var res = gm_xhr.responseText
        var hh = /(.+):(.+):(.+)/.exec(/id=.?i_time.?>([^<]+)<\/div>/.exec(res)[1])[1] // get LA time
        if(/0[0-6]/.test(hh)) { return true }
        return false
    }
    catch(e) { return true }
}

var users = ['Aaron', 'jkwon23']
var len_users = users.length

var send_night_msg = function()
{
    try{
        var chats = doc.getElementsByClassName('shout-msg')
        var last_chat = chats[chats.length-1]
        for(var i=0; i<len_users; i++)
        {
            if(last_chat.children[0].id.indexOf(users[i])!=-1)
            {
                doc.getElementsByName('ShoutCloud-Msg')[0].value = users[i] + ', go to bed. (this msg is auto-sent by a userscript)'
                doc.getElementById('ShoutCloud-Shout').click()
            }
        }
    }catch(e) { alert(e) }
}

addEventListener('load', function() {
    var len = doc.getElementsByClassName('shout-msg').length
    addEventListener('DOMNodeInserted', function() {
    //addEventListener('DOMSubtreeModified', function() { // only for testing purposes. this will fire every time you press a key in the input box.
        var len2 = doc.getElementsByClassName('shout-msg').length
        if(len2 > len)
        {
            len = len2
            try{
                if(is_late_night())
                {
                    send_night_msg()
                }
            }catch(e) { alert(e) }
        }
    }, false)
}, false)
