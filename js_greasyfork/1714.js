// ==UserScript==
// @name           Hard Drop Forum Tweaks
// @description    Some tweaks on the Hard Drop Tetris forums.
// @grant          GM_xmlhttpRequest
// @include        http://harddrop.com/*
// @version 0.0.1.20150301023233
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/1714/Hard%20Drop%20Forum%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/1714/Hard%20Drop%20Forum%20Tweaks.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/^http:\/\/harddrop\.com\//.test(href))
{
    if(typeof users_to_hide == 'undefined')
    {
        var users_to_hide = ['USER_ID_1', 'USER_ID_2'] // add as many annoying users as you want
    }
    var len_hide = users_to_hide.length
    if(/forums/.test(href))
    {
        if(/showtopic/.test(href)) // on a forum thread page
        {
            // hide forum posts from annyoing users
            var tables = doc.getElementsByClassName('ipbtable'), len = tables.length
            for(var i=0; i<len; i++)
            {
                try
                {
                    for(var j=0; j<len_hide; j++)
                    {
                        if(tables[i].getElementsByTagName('TD')[0].getElementsByTagName('SPAN')[0].children[0].innerHTML.indexOf(users_to_hide[j])!=-1)
                        {
                            tables[i].style.cssText='display: none !important'
                        }
                    }
                }
                catch(err) {}
            }

            // hide user images, because some images are not comfortable to see
            var imgs = doc.getElementsByClassName('pic1')
            for(var i=imgs.length-1; i>=0; i--) { imgs[i].style.display = 'none' }

            // hide signatures
            var sigs = doc.getElementsByClassName('signature')
            for(var i=sigs.length-1; i>=0; i--) { sigs[i].style.display = 'none' }
        }
        else // on the forum main page
        {
            // add shoutbox, so that a user can chat with others on the current page
            var sbframe = doc.createElement('IFRAME')
            sbframe.id = 'my_sbframe'
            sbframe.src = 'http://harddrop.com/file/shout/shout.php'
            sbframe.width = 300
            sbframe.height = 570
            sbframe.frameBorder = 0
            doc.getElementById('fo_rtopics').appendChild(sbframe)

            // embed the live stream swf if it is live
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.twitch.tv/kraken/streams/harddrop',
                synchronous: false,
                onload: function(response) {
                    if(JSON.parse(response.responseText).stream != null) { // is live
                        doc.getElementById('fo_rtopics').innerHTML += '<object flashvars="hostname=www.twitch.tv&channel=harddrop&auto_play=false&start_volume=25" type="application/x-shockwave-flash" wmode="opaque" allowfullscreen="true" allownetworking="true" movie="http://www.twitch.tv/widgets/live_embed_player.swf" allowscriptaccess="always" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=harddrop" width="640" height="480"</object>'
                    }
                }
            })
        }
    }
    else if(/shout/.test(href)) // in the shoutbox
    {
        if(doc.getElementById('ShoutCloud-Container')==null) { throw 'exit' }
        
        // hide images
        var imgs = doc.querySelectorAll('img')
        for(var i=imgs.length-1; i>=0; i--) { imgs[i].style.display = 'none' }

        // enable the input box
        addEventListener('load', function() {
            try{
            doc.getElementsByName('ShoutCloud-Msg')[0].disabled = false
            doc.getElementsByName('ShoutCloud-Msg')[0].value = ''
            } catch(e) {}
        }, false)

        // don't clear unsent text when unfocuing the input box
        try{
            doc.getElementsByName('ShoutCloud-Msg')[0].onblur = function() { return }
        } catch(e) {}

        // hide annoying users in the shoutbox
        var hide_users = function()
        {
            var chats = doc.getElementsByClassName('shout-msg')
            var len = chats.length
            for(var i=0; i<len; i++)
            {
                for(var j=0; j<len_hide; j++)
                {
                    if(chats[i].children[0].id.indexOf(users_to_hide[j])!=-1)
                    {
                        chats[i].style.display = 'none'
                        break
                    }
                }
            }
        }
        hide_users()
        addEventListener("DOMNodeInserted", function() { // or DOMSubtreeModified
            hide_users()
        }, false)
        
        // hide chats with only emotes
        var hide_chats_with_only_emotes = function()
        {
            var chats = doc.getElementsByClassName('shout-msg')
            var len = chats.length
            for(var i=0; i<len; i++)
            {
                if(chats[i].textContent.replace(/.+?:[0-9][0-9]?/, '').replace(/[\n\s]/g, '') == '') {
                    chats[i].style.display = 'none'
                }
            }
        }
        hide_chats_with_only_emotes()
        addEventListener("DOMNodeInserted", function() { // or DOMSubtreeModified
            hide_chats_with_only_emotes()
        }, false)
    }
}
