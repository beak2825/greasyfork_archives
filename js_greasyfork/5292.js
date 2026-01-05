// ==UserScript==
// @name            Shoutbox Everywhere
// @description     Press L to toggle the shoutbox anywhere in the Hard Drop Forum
// @include         http://harddrop.com/*
// @version 0.0.1.20140925095318
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/5292/Shoutbox%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/5292/Shoutbox%20Everywhere.meta.js
// ==/UserScript==

/*** Settings ***/

var display_sb_on_page_load = false // whether to display the shoutbox upon opening a page
var shoutbox_width = Math.floor(window.innerWidth/4) // width in pixel
var shoutbox_height = window.innerHeight // height in pixel
var hotkey = 76 // use "http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes" to find the keycode you want. 76 == L

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(/\/shout.php\b/.test(href) || /harddrop\.com\/?$/.test(href)) { throw 'exit' }

var sb_frm = doc.createElement('IFRAME')
sb_frm.id = 'sb_frm'
sb_frm.src = 'http://harddrop.com/file/shout/shout.php'
sb_frm.width = shoutbox_width
sb_frm.height = shoutbox_height
sb_frm.frameBorder = 0

var sb_div = doc.createElement('DIV')
sb_div.id = 'sb_div'
sb_div.style.cssText = 'top:15px; right:0px; position:fixed; background-color:white; z-index:100'
sb_div.appendChild(sb_frm)
doc.body.appendChild(sb_div)

if(display_sb_on_page_load) { sb_div.style.visibility = 'visible' }
else { sb_div.style.visibility = 'hidden' }

var toggle_sb = function() {
    var sb_div = doc.getElementById('sb_div')
    if(sb_div.style.visibility != 'hidden') { sb_div.style.visibility = 'hidden'; return }
    sb_div.style.visibility = 'visible'
}
addEventListener('keydown', function(evt) { if((evt.target.tagName!='INPUT') && (evt.target.tagName!='TEXTAREA') && (evt.keyCode == hotkey)) { toggle_sb() } }, false)
