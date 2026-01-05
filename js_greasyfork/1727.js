// ==UserScript==
// @name           TwComic Autoload
// @description    Autoload all images on one page when reading manga on www.twcomic.com.
// @grant          unsafeWindow
// @include        http://www.twcomic.com/vols/*
// @version 0.0.1.20140809083508
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/1727/TwComic%20Autoload.user.js
// @updateURL https://update.greasyfork.org/scripts/1727/TwComic%20Autoload.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var load_imgs = function()
{
    doc.body.innerHTML = ''
    var d = doc.createDocumentFragment()
    for(var i=0, len=imgs.length; i<len; i++)
    {
        var img = new Image()
        img.id = i
        img.onerror = function() { this.onerror = null; this.style.display = 'none' }
        img.src = imgs[i]
        img.style.cssText = 'display: block; margin-left: auto; margin-right: auto'
        img.width = wnd.innerWidth * 0.70
        d.appendChild(doc.createTextNode('p. '+i))
        d.appendChild(doc.createElement('BR'))
        d.appendChild(img)
        d.appendChild(doc.createElement('BR'))
    }
    doc.body.appendChild(d)
}

if(/^http:\/\/www\.twcomic\.com\//.test(href))
{
    if(href.indexOf('#')==-1) { loc.href = loc.href + '#' }
    var imgs = []
    var wnd = unsafeWindow
    if(typeof wnd.arrFiles != 'undefined') { imgs = wnd.arrFiles } else { alert('Cannot find the image links'); throw 'exit' }
    var server = wnd.getSLUrl(wnd.cuD)
    for(var i=imgs.length-1; i>=0; i--) { imgs[i] = server + imgs[i] }
    load_imgs()

    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", loc.origin + '/comic/' + /.*\/(\d+)_\d+\/?/.exec(href)[1], false)
    xmlhttp.send()
    var html = /\bcVolTag\b.*/.exec(xmlhttp.responseText)[0], m, p = /<a [^>]*?href='([^']*?)'>/g, vlnks = ['javascript:alert("This is the last volume")']
    while(m=p.exec(html)) { if(m[1] != href) { vlnks.push(m[1]) } else { break } }
    vlnks.sort()
    var nextlink = vlnks[0]

    var nextlink_el = doc.createElement('A')
    nextlink_el.appendChild(doc.createTextNode('Next'))
    nextlink_el.href = nextlink
    doc.body.appendChild(nextlink_el)
}
