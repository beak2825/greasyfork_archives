// ==UserScript==
// @name        SMBC-style keyboard shortcuts for xkcd
// @namespace   helado.de.brownie@gmail.com
// @description Provide previous (z), random (x), and next (c) keyboard shortcuts for xkcd just like SMBC has.
// @include     http*://xkcd.com/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10425/SMBC-style%20keyboard%20shortcuts%20for%20xkcd.user.js
// @updateURL https://update.greasyfork.org/scripts/10425/SMBC-style%20keyboard%20shortcuts%20for%20xkcd.meta.js
// ==/UserScript==
 
void function () {
    var query = document.querySelector.bind(document)
      , keyMap =
        { 'z': query('a[rel=prev]')
        , 'x': query('a[href$="c.xkcd.com/random/comic/"]')
        , 'c': query('a[rel=next]')
        }
    
    document.addEventListener('keypress', function (key) {
        var element = keyMap[ String.fromCharCode(key.which) ]
        if (element != null) element.click()
    })
}()
