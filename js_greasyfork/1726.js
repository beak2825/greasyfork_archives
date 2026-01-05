// ==UserScript==
// @name           18H Hentai Manga Autoload
// @description    Autoload hentai manga and CG images on one page on 18h.mm-cg.com.
// @grant          unsafeWindow
// @include        http://*.servik.com/*
// @include        http://18h.mm-cg.com/*
// @version 0.0.1.20140809083006
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/1726/18H%20Hentai%20Manga%20Autoload.user.js
// @updateURL https://update.greasyfork.org/scripts/1726/18H%20Hentai%20Manga%20Autoload.meta.js
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

if(/^http:\/\/18h\.mm-cg\.com\//.test(href))
{
    if(href.indexOf('.html')==-1)
    {
        try {
            doc.getElementById('fwin_dialog_submit').click()
            close_btns = doc.getElementsByClassName('mmad_drift_title')
            close_btns[1].click()
        } catch(e) {}

        // the key of the stored cookie
        var key = '18h'
        var sub = /.*\/(.*)/.exec(href)[1]
        if(sub) { key = key + '_' + sub }

        var lnks = doc.getElementsByTagName('A')
        for(var i=lnks.length-1; i>=0; i--)
        {
            lnks[i].target = '_blank'
            lnks[i].addEventListener('click', function(evt) {
                evt.preventDefault()
            }, false)
            lnks[i].addEventListener('mouseup', function(evt) {
                if(evt.ctrlKey)
                {
                    var t = this.text
                    if(t == '') { return }
                    var c = key + '=' + t + ' p.' + prompt('Title: ' + t + '\nEnter the page number: ', '0') + '; expires=Fri, 31 Dec 9999 23:59:59 GMT;'
                    if(/ p.[0-9]/.test(c))
                    {
                        doc.cookie = c
                        var e = this
                        var orig_color = e.style.color
                        e.style.color = '#ff9900'
                        setTimeout(function() {e.style.color = orig_color}, 2000)
                    }
                    return
                }
                wnd.open(this.href, '_blank') // (X) this.href + '#0'
                this.style.color = 'purple'
            }, false)
        }

        // press <cr> to focus the stored link and open it in a new tab
        addEventListener('keydown', function(evt) {
            if(evt.keyCode == 13)
            {
                evt.preventDefault()
                var a = doc.cookie.split('; ')
                var len = a.length
                var k, v, p
                for(var i=0; i<len; i++)
                {
                    k = /(.*?)=(.*)/.exec(a[i])[1]
                    v = /(.*?)=(.*)/.exec(a[i])[2]
                    if(k == key)
                    {
                        p = /(.*) p\.(\d+)/.exec(v)[2]
                        v = /(.*) p\.(\d+)/.exec(v)[1]
                        break
                    }
                    else { k = v = p = '' }
                }
                if(v)
                {
                    var a = []
                    var choice = 0
                    var len = lnks.length
                    for(var i=0; i<len; i++) { if(v == lnks[i].text) { a.push(i) } } // try to find the stored links from all links
                    len = a.length
                    if(len >= 2)
                    {
                        var s = ''
                        for(var i=0; i<len; i++) { s = s + '\n(' + i + ') ' + lnks[a[i]].href }
                        s = s + '\nEnter a number:'
                        choice = parseInt(prompt(s, '0'))
                    }
                    if(!isNaN(choice))
                    {
                        choice = a[choice]
                        lnks[choice].focus()
                        wnd.open(lnks[choice].href + '#' + p, '_blank')
                        lnks[choice].style.color = '#ff9900'
                        setTimeout(function() {lnks[choice].style.color = 'purple'}, 2000)
                    }
                }
            }
        }, false)
        throw 'exit'
    }
    if(href.indexOf('#')==-1) { loc.href = loc.href + '#' }
    var imgs = []
    var wnd = unsafeWindow
    if(typeof wnd.Large_cgurl != 'undefined') { imgs = wnd.Large_cgurl } else { alert('Cannot find the image links.'); throw 'exit' }
    imgs.shift()
    load_imgs()
}
else if(/^http:\/\/.*?\.servik\.com\//.test(href))
{
    if(href.indexOf('#')==-1) { loc.href = loc.href + '#' }
    var imgs = []
    href = href.replace(loc.hash, "")
    for(var i=1; i<=9; i++) { imgs[i] = href + '00' + i + '.jpg' }
    for(var i=10; i<=99; i++) { imgs[i] = href + '0' + i + '.jpg' }
    for(var i=100; i<=999; i++) { imgs[i] = href + '' + i + '.jpg' }
    imgs.shift()
    load_imgs()
}
