// ==UserScript==
// @name           grim's exhentai popular right now
// @namespace      https://greasyfork.org/en/users/4367-d-p
// @description    add an iframe for g.e-hentai
// @include        http://exhentai.org/
// @include        https://exhentai.org/
// @version        0.1
// @downloadURL https://update.greasyfork.org/scripts/24555/grim%27s%20exhentai%20popular%20right%20now.user.js
// @updateURL https://update.greasyfork.org/scripts/24555/grim%27s%20exhentai%20popular%20right%20now.meta.js
// ==/UserScript==

/*

see:
I wanna be an active user.js
+ for iframe usage
http://stackoverflow.com/questions/14249712/basic-method-to-add-html-content-to-the-page-with-greasemonkey
+ for adding a new element to an html page

*/

var newHtmlCustomElement         = document.createElement ('div');
newHtmlCustomElement.innerHTML   = '             \
    <div id="gmCustomIdForExhentai">             \
        <p>Some paragraph</p>       \
        etc.                        \
    </div>                          \
';

document.body.appendChild (newHtmlCustomElement);



/*** start I wanna be an active user userscript ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(/^http:\/\/exhentai\.org\//)
{
    var eventpane = doc.getElementById('gmCustomIdForExhentai')
    if(!eventpane) { throw 'exit' }
    var t = eventpane.textContent
    
    var frm = doc.createElement('IFRAME')
    frm.src = 'http://g.e-hentai.org/#pp'
    frm.width = wnd.innerWidth
    frm.height = wnd.innerHeight * 0.3
    frm.frameBorder = 0
    doc.getElementById('gmCustomIdForExhentai').parentNode.replaceChild(frm, doc.getElementById('gmCustomIdForExhentai'))
}


/*** end I wanna be an active user userscript ***/