// ==UserScript==
// @name           HHcomic Autoload
// @description    Autoload all images on one page when reading manga on www.hhcomic.com
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @include        http://www.hhxiee.com/xiee/*/*
// @include        http://www.huhudm.com/mh/hu*
// @version 0.0.1.20161218193054
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/1778/HHcomic%20Autoload.user.js
// @updateURL https://update.greasyfork.org/scripts/1778/HHcomic%20Autoload.meta.js
// ==/UserScript==

var wnd = unsafeWindow || window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var load_imgs = function() {
    doc.body.innerHTML = ''
    doc.body.style.backgroundColor = '#191B21'
    var d = doc.createDocumentFragment()
    for(var i=0, len=imgs.length; i<len; i++) {
        var img = new Image()
        img.id = i
        img.onerror = function() { this.onerror = null; this.style.display = 'none' }
        img.src = imgs[i]
        img.style.cssText = 'display: block; margin-left: auto; margin-right: auto'
        img.width = wnd.innerWidth
        if(i==len-1) { img.addEventListener('click', function() { $('#nextlink_el').click() }) }
        d.appendChild(doc.createTextNode('p. ' + i + ' / ' + len))
        d.appendChild(doc.createElement('BR'))
        d.appendChild(img)
        d.appendChild(doc.createElement('BR'))
    }
    doc.body.appendChild(d)
}

//if(href.indexOf('#') == -1) { loc.href += '#' }
var imgs = []
if(typeof wnd.arrPicListUrl != 'undefined') { imgs = wnd.arrPicListUrl } else { alert('Error: Cannot find the image links.'); throw 'exit' }
var server = wnd.ServerList[/.*\bs=(\d+)/.exec(href)[1]-1]
for(var i=imgs.length-1; i>=0; i--) { imgs[i] = server + imgs[i] }
load_imgs()

var create_nextlink_el = function(html) {
    var div = doc.createElement('div')
    div.innerHTML = html
    var vlnks
    if(/huhudm/.test(href)) {
        vlnks = ['javascript: location.href = "' + home_url + '"'].concat(Array.prototype.slice.call($$(div, '#content .vol a[href^="/mh/hu"]')).map(function(a) { return a.href}))
    }
    else {
        vlnks = ['javascript: location.href = "' + home_url + '"'].concat(Array.prototype.slice.call($$(div, '#content .vol a[href*="/xiee/"]')).map(function(a) { return a.href}))
    }
    var alphanum = function(a, b) { // natural sorting algorithm from http://my.opera.com/GreyWyvern/blog/show.dml/1671288
        function chunkify(t) {
            var tz = [], x = 0, y = -1, n = 0, i, j
            while(i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >=48 && i <= 57))
                if(m != n) {
                    tz[++y] = ""
                    n = m
                }
                tz[y] += j
            }
            return tz
        }
        var aa = chunkify(a)
        var bb = chunkify(b)
        for(x = 0; aa[x] && bb[x]; x++) {
            if(aa[x] != bb[x]) {
                var c = Number(aa[x]), d = Number(bb[x])
                if(c == aa[x] && d == bb[x]) {
                    return c - d
                } else return (aa[x] > bb[x]) ? 1 : -1
            }
        }
        return aa.length - bb.length
    }
    vlnks.sort(function(a, b) { return alphanum(a, b) })

    var nextlink = vlnks[vlnks.indexOf(href.replace(/#/g, '')) + 1] || home_url
    var nextlink_el = doc.createElement('A')
    nextlink_el.id = 'nextlink_el'
    nextlink_el.appendChild(doc.createTextNode('Next'))
    nextlink_el.href = nextlink
    doc.body.appendChild(nextlink_el)

    addEventListener("keydown", function(evt) { if(evt.keyCode == 32) { evt.preventDefault(); loc.href = $('#nextlink_el') } }, false)
    if(/huhudm/.test(href)) {
        doc.title = doc.title.replace(/ ..漫画/g, '') + ' / ' + $(div, '#content .vol a[href^="/mh/hu"]').text
    }
    else {
        doc.title = doc.title.replace(/ ..漫画/g, '') + ' / ' + $(div, '#content .vol a[href*="/xiee/"]').text
    }
}

var home_url = ''
if(/huhudm/.test(href)) {
    home_url = loc.protocol + '//' + loc.hostname + '/manhua/hu' + /\/mh\/hu(\d+)\//.exec(href)[1] + '/'
}
else {
    home_url = loc.protocol + '//' + loc.hostname + '/comic/' + /.*?\/(\d+\/).*/.exec(href)[1]
}
var homelink_el = doc.createElement('A')
homelink_el.id = 'homelink_el'
homelink_el.text = 'Home'
homelink_el.href = home_url
doc.body.appendChild(homelink_el)
doc.body.appendChild(doc.createTextNode('\t'))

if(typeof GM_xmlhttpRequest != 'undefined') {
    GM_xmlhttpRequest({
        method: 'GET',
        url: home_url,
        overrideMimeType: 'text/html; charset=gbk',
        onload: function(response) { create_nextlink_el(response.responseText) },
    })
}
else if(typeof XMLHttpRequest != 'undefined') {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() { if(xhr.readyState == 4 && xhr.status == 200) { create_nextlink_el(xhr.responseText) } }
    xhr.open('GET', home_url, true)
    xhr.overrideMimeType('text/html; charset=gbk')
    xhr.send(null)
}
else {
    var f = doc.createElement('IFRAME')
    f.src = home_url
    f.width = 800
    f.height = 600
    f.frameBorder = 1
    doc.body.appendChild(f)
}
