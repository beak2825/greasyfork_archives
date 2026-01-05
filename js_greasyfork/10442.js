// ==UserScript==
// @name        Karma Plus
// @grant       none
// @include     http://forums.e-hentai.org/index.php?showuser=*
// @version 0.0.1.20150615030051
// @namespace https://greasyfork.org/users/2233
// @description Add a link to the Karma URL in the user profile page
// @downloadURL https://update.greasyfork.org/scripts/10442/Karma%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/10442/Karma%20Plus.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/\?.*&?\bshowuser=/.test(href)) {
    var a = doc.createElement('a')
    a.href = 'http://e-hentai.org/dmspublic/karma.php?u=' + href.match(/\?.*&?\bshowuser=(\d+)/)[1]
    a.text = 'Karma+'
    $('#profilename').appendChild(doc.createElement('br'))
    $('#profilename').appendChild(doc.createElement('br'))
    $('#profilename').appendChild(a)
}
