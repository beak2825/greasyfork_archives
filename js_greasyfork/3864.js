// ==UserScript==
// @name            AutoPager for E-Hentai
// @description     Provides an AutoPager-like function for g.E-Hentai.org.
// @grant           GM_xmlhttpRequest
// @include         http://g.e-hentai.org/*
// @include         http://exhentai.org/*
// @version 0.0.1.20150802205409
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/3864/AutoPager%20for%20E-Hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/3864/AutoPager%20for%20E-Hentai.meta.js
// ==/UserScript==

/*** Settings ***/

var freq = [5, 10] // min seconds ~ max seconds

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(((/^http:\/\/g\.e-hentai\.org\//.test(href)) || (/^http:\/\/exhentai\.org\//.test(href))) && (/\/[gs]\//.test(href))) {
    var api_url = ''
    if(/^http:\/\/g\.e-hentai\.org\//.test(href)) { api_url = 'http://g.e-hentai.org/api.php' }
    else if(/^http:\/\/exhentai\.org\//.test(href)) { api_url = 'http://exhentai.org/api.php' }
    if(!api_url) { throw 'exit' }

    // g: gid, gtoken; s: gid, gtoken, imgkey
    var gid = gtoken = ''
    if(/\/g\//.test(href)) {
        //if(!/\??\bp=/.test(href)) { loc.assign(href + '?p=0') }
        var m = /\/g\/([^\/]+)\/([^\/]+)/.exec(href)
        if(m == null) { console.log('Invalid gallery.'); throw 'exit' }
        gid = m[1], gtoken = m[2]
    } else if(/\/s\//.test(href)) {
        var m = /\/s\/([^\/]+)\/([^\/]+)-([0-9]+)/.exec(href)
        if(m == null) { console.log('Invalid image page.'); throw 'exit' }
        var imgkey = m[1], gid = m[2], page = m[3]
        //if(imgkey.length > 10) { imgkey = imgkey.substring(0, 10) }
        if(typeof GM_xmlhttpRequest != 'undefined') {
            var xhr = GM_xmlhttpRequest({
                method: 'POST',
                url: api_url,
                data: JSON.stringify({'method':'gtoken', 'pagelist':[[gid, imgkey, page]]}),
                synchronous: true
            })
        }
        else {
            var xhr = new XMLHttpRequest()
            xhr.open('POST', api_url, false)
            xhr.send(JSON.stringify({'method':'gtoken', 'pagelist':[[gid, imgkey, page]]}))
        }
        console.log('xhr.responseText = ' + xhr.responseText)
        gtoken = JSON.parse(xhr.responseText)['tokenlist'][0]['token']
    }
    console.log('gid = ' + gid + ', gtoken = ' + gtoken)
    if(gid == '') { console.log('Cannot find gid.') }
    if(gtoken == '') { console.log('Cannot find gtoken.') }
    if((gid == '') || (gtoken == '')) { throw 'exit' }

    // g: filecount; s: filecount
    var filecount = ''
    if(typeof GM_xmlhttpRequest != 'undefined') {
        var xhr = GM_xmlhttpRequest({
            method: 'POST',
            url: api_url,
            data: JSON.stringify({'method':'gdata', 'gidlist':[[gid, gtoken]]}),
            synchronous: true
        })
    }
    else {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', api_url, false)
        xhr.send(JSON.stringify({'method':'gdata', 'gidlist':[[gid, gtoken]]}))
    }
    console.log('xhr.responseText = ' + xhr.responseText)
    filecount = parseInt(JSON.parse(xhr.responseText)['gmetadata'][0]['filecount'])
    console.log('filecount = ' + filecount)
    if(isNaN(filecount)) { console.log('Cannot find filecount.'); throw 'exit' }

    // g: page_url, imgkey; s: page_url
    if(/\/g\//.test(href)) {
        var imgkey = page_url = ''
        //var page = $$('.ip')[0].textContent.match(/\d+/)[0], page_url = ''
        //var page = parseInt($('#gdt a').href.replace(/^.*-([0-9]+)/, '$1')), page_url = ''
        var page = parseInt($('.gpc').textContent.match(/\d+/)[0])
        console.log('page = ' + page)

        var lnks = $$('A[href*="/s/"]')
        var url_pattern = new RegExp('/s/[^/]+/'+gid+'-'+page+'$')
        for(var i=lnks.length-1; i>=0; i--) {
            if(url_pattern.test(lnks[i].href)) {
                page_url = lnks[i].href
                imgkey = /\/s\/([^\/]+)/.exec(lnks[i].href)[1]
                //if(imgkey.length > 10) { imgkey = imgkey.substring(0, 10) }
                break
            }
        }
    }
    else if(/\/s\//.test(href)) { page_url = href.replace(/\?.*/, '') }
    if((page_url == '') || (imgkey == '')) {
        if(/\/g\//.test(href)) {
            var mpv_url = ''
            var lnks = $$('A[href*="/mpv/"]')
            var url_pattern = new RegExp('/mpv/'+gid+'/[^/]+/#page'+page+'$')
            for(var i=lnks.length-1; i>=0; i--) {
                if(url_pattern.test(lnks[i].href)) {
                    mpv_url = lnks[i].href
                    if(typeof GM_xmlhttpRequest != 'undefined') {
                        var xhr = GM_xmlhttpRequest({
                            method: 'GET',
                            url: mpv_url,
                            synchronous: true
                        })
                    }
                    else {
                        var xhr = new XMLHttpRequest()
                        xhr.open('GET', mpv_url, false)
                        xhr.send(null)
                    }
                    var pa = xhr.responseText.match(/var +imagelist *= *\[([^\]]+)\]/)[1].split('},').map(function(s) { return s + '}' })
                    imgkey = JSON.parse(pa[page-1]).k
                    page_url = loc.protocol + '//' + loc.hostname + '/s/' + imgkey + '/' + gid + '-' + page
                    break
                }
            }
        }
    }
    console.log('page_url = ' + page_url + ', imgkey = ' + imgkey)
    if(page_url == '') { console.log('Cannot find page_url.') }
    if(imgkey == '') { console.log('Cannot find the first imgkey.') }
    if((page_url == '') || (imgkey == '')) { throw 'exit' }

    // g: showkey; s: showkey
    var showkey = ''
    if(typeof GM_xmlhttpRequest != 'undefined') {
        var xhr = GM_xmlhttpRequest({
            method: 'GET',
            url: page_url,
            synchronous: true
        })
    }
    else {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', page_url, false)
        xhr.send(null)
    }
    //console.log('xhr.responseText = ' + xhr.responseText)
    try{ showkey = /\bshowkey=['"]?([-0-9a-z]+)/.exec(xhr.responseText)[1] } catch(e) { showkey = '' }
    console.log('showkey = ' + showkey)
    if(showkey == '') { console.log('Cannot find the first showkey.'); throw 'exit' }

    var get_rand = function(range) {
        var min = range[0]
        var max = range[1]
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    var b = doc.body
    var append_img = function() {
        if(typeof GM_xmlhttpRequest != 'undefined') {
            GM_xmlhttpRequest({
                method: 'POST',
                url: api_url,
                data: JSON.stringify({'method':'showpage', 'gid':gid, 'page':page, 'imgkey':imgkey, 'showkey':showkey}),
                onload: function(response) {
                    var res = JSON.parse(response.responseText)
                    var i3 = res['i3']
                    var img_src = /src=['"]([^'"]+)['"]/.exec(i3)[1].replace(/&amp;/g, '&')

                    var img = new Image()
                    img.id = page
                    img.onerror = function() { this.onerror = null; this.style.display = 'none' }
                    img.src = img_src
                    img.style.cssText = 'display: block; margin-left: auto; margin-right: auto'
                    img.width = wnd.innerWidth
                    var a = doc.createElement('A')
                    a.href = page_url.replace(/\/s\/.*/, '/s/' + imgkey + '/' + gid + '-' + page)
                    a.text = 'p. ' + page + ' / ' + filecount
                    b.appendChild(a)
                    b.appendChild(doc.createElement('BR'))
                    b.appendChild(img)
                    b.appendChild(doc.createElement('BR'))

                    if(page >= filecount) { return }
                    var m = /\/s\/([^'"]+?)\/[^'"]+-([0-9]+)['"]/.exec(i3)
                    if(m == null) { console.log('An error happened when parsing p. ' + page); return }
                    imgkey = m[1]
                    page = parseInt(m[2])
                    setTimeout(append_img, get_rand(freq)*1000)
                }
            })
        }
        else {
            var xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    var res = JSON.parse(xhr.responseText)
                    var i3 = res['i3']
                    var img_src = /src=['"]([^'"]+)['"]/.exec(i3)[1].replace(/&amp;/g, '&')

                    var img = new Image()
                    img.id = page
                    img.onerror = function() { this.onerror = null; this.style.display = 'none' }
                    img.src = img_src
                    img.style.cssText = 'display: block; margin-left: auto; margin-right: auto'
                    img.width = wnd.innerWidth
                    var a = doc.createElement('A')
                    a.href = page_url.replace(/\/s\/.*/, '/s/' + imgkey + '/' + gid + '-' + page)
                    a.text = 'p. ' + page + ' / ' + filecount
                    b.appendChild(a)
                    b.appendChild(doc.createElement('BR'))
                    b.appendChild(img)
                    b.appendChild(doc.createElement('BR'))

                    if(page >= filecount) { return }
                    var m = /\/s\/([^'"]+?)\/[^'"]+-([0-9]+)['"]/.exec(i3)
                    if(m == null) { console.log('An error happened when parsing p. ' + page); return }
                    imgkey = m[1]
                    page = parseInt(m[2])
                    setTimeout(append_img, get_rand(freq)*1000)
                }
            }
            xhr.open('POST', api_url, true)
            xhr.send(JSON.stringify({'method':'showpage', 'gid':gid, 'page':page, 'imgkey':imgkey, 'showkey':showkey}))
        }
    }
    append_img()
}
