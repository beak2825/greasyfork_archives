// ==UserScript==
// @name        18AV Tweaks
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @include     http://18av.mm-cg.com/*
// @version 0.0.1.20181014041815
// @namespace https://greasyfork.org/users/2233
// @description Add some functions to 18av
// @downloadURL https://update.greasyfork.org/scripts/23810/18AV%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/23810/18AV%20Tweaks.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = wnd.location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/\/(18av|av_Broadcast)\//i.test(href)) {
    var v
    var v_css = [
        'iframe[src^="http://www.youjizz.com/videos/embed/"]',
        'iframe[src^="https://www.youjizz.com/videos/embed/"]',
        'iframe[src^="http://www.jizzhut.com/videos/embed/"]',
        'iframe[src^="https://www.jizzhut.com/videos/embed/"]',
        'iframe[src^="http://vshare.io/v/"]',
        'iframe[src^="https://vshare.io/v/"]',
        'iframe[src^="http://vidto.me/embed-"]',
        'iframe[src^="https://vidto.me/embed-"]',
        'iframe[src^="http://www.flashx.tv/embed-"]',
        'iframe[src^="https://www.flashx.tv/embed-"]',
    ]
    for(var i=0, len=v_css.length; i<len; i++) {
        v = $$(v_css[i])
        if(v.length != 0) { break }
    }
    if(v.length == 0) { alert("Error: Can't find embedded videos.") }
    for(var i=0, len=v.length; i<len; i++) {
        (function(i){
            v[i].style.display = 'none' // speed up the page load
            var btn = doc.createElement('button')
            var url = v[i].src
            var txt = doc.createTextNode(url)
            btn.appendChild(txt)
            $('.cs_mvwidth').appendChild(doc.createElement('br'))
            $('.cs_mvwidth').appendChild(btn)
            btn.addEventListener('click', function() {
                if(/(youjizz|jizzhut)\.com/.test(url)) { url = url }
                else if(/vshare\.io/.test(url)) { url = url }
                else if(/vidto\.me/.test(url)) { url = url.replace(/\/embed-/, '/').replace(/-.*\./, '.') }
                else if(/flashx\.tv/.test(url)) { url = url.replace(/\/embed-/, '/').replace(/-.*\./, '.') }
                else { url = url }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    overrideMimeType: 'text/xml',
                    headers: {
                        'Accept': 'text/xml',
                        'Content-Type': 'text/xml',
                    },
                    synchronous: false,
                    onload: function(res) {
                        //GM_setClipboard(res.responseText)
                        //alert(res.responseText)
                        var vlnk
                        var div = doc.createElement('div')
                        div.innerHTML = res.responseText
                        //div = res.responseXML
                        //div = new DOMParser().parseFromString(res.responseText, 'text/xml')
                        if(/(youjizz|jizzhut)\.com/.test(url)) {
                            try {
                                vlnk = res.responseText.match(/"filename":"(.*?)"/)[1].replace(/\\/g, '').replace(/^\/\//, 'https://')
                                //vlnk = 'https:' + div.encodings[0].filename
                                //vlnk = div.querySelector('video[id^="yj-video"]').src
                            }
                            catch(e) {
                                alert(e)
                                return
                            }
                            //try{ vlnk = div.querySelector('#yj-video').querySelector('source').src }
                            //catch(e) {
                                //alert(e)
                                //try {
                                    //vlnk = res.responseText.match(/newLink\.setAttribute\(['"]href['"],['"]([^'"]*)['"]\)/)[1]
                                //}
                                //catch(e2) {
                                    //alert(e2)
                                    //return
                                //}
                            //}
                            //if(/^\/\//i.test(vlnk)) { vlnk = vlnk.replace(/^\/\//, 'https://') }
                        }
                        else if(/vshare\.io/.test(url)) {
                            try{ vlnk = div.querySelector('#my-video').querySelector('source').src }
                            catch(e) {
                                alert(e)
                                try {
                                    vlnk = res.responseText.match(/<source +src=['"]([^'"]*?)['"]/)[1]
                                } catch(e2) {
                                    alert(e2)
                                    alert('Copy-n-Paste the URL to watch the video:\n' + url)
                                }
                            }
                            if(/^\/\//i.test(vlnk)) { vlnk = vlnk.replace(/^\/\//, 'https://') }
                        }
                        else if(/vidto\.me/.test(url)) {
                            alert('Error: Unsupported site.')
                            throw 'exit'
                        }
                        else if(/flashx\.tv/.test(url)) {
                            alert('Error: Unsupported site.')
                            throw 'exit'
                        }
                        var vid = 'download_link_' + (i+1)
                        GM_setClipboard(vlnk)
                        if(!$('#'+vid)) {
                            var a = doc.createElement('a')
                            a.id = vid
                            a.download = a.text = $('#main h1').textContent.match(/影片名稱：(.*)/)[1] + '_' + (i+1)
                            a.href = vlnk
                            btn.appendChild(doc.createElement('br'))
                            btn.appendChild(a)
                        }
                        var m3u = '#EXTM3U\n'
                        m3u += vlnk + '\n'
                        if(typeof InstallTrigger !== 'undefined') { // is Firefox
                            loc.href = 'data:audio/mpegurl;base64,' + btoa(m3u)
                        }
                        else {
                            loc.href = 'data:application/x-mpegurl;base64,' + btoa(m3u)
                        }
                    },
                })
            })
        })(i)
    }
}

var zap = function(e, css, hide) {
    if(!css) { css=e; e=doc }
    var a = e.querySelectorAll(css)
    if(a) {
        if(hide) { for(var i=0, len=a.length; i<len; i++) { a[i].style.display = 'none' } }
        else { for(var i=0, len=a.length; i<len; i++) { a[i].parentNode.removeChild(a[i]) } }
    }
}

zap('.TW_UTtoy')
zap('a[href^="http://goo.gl/"]')
zap('img[src*="blogspot.com"]')
zap('#ArticlesEx_box')
zap('.ut_ad_box')
zap('#main_mv')
zap(doc, 'iframe', true)
