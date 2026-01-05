// ==UserScript==
// @name        Flvcd Tweaks
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @include     /^http:\/\/www\d*\.flvcd\.com\/parse\.php\?/
// @version 0.0.1.20161007033307
// @namespace https://greasyfork.org/users/2233
// @description Add a few functions to Flvcd
// @downloadURL https://update.greasyfork.org/scripts/23807/Flvcd%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/23807/Flvcd%20Tweaks.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = wnd.location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

wnd.eval('alert = function() { return true }')
wnd.eval('_alert = function() { return true }')

if(/(视频网站前置广告系统|正在为您解析)/.test(doc.title)) {
    wnd.eval('avdPlay()') // if failed, try gogogo() or doPlay(), or see https://greasyfork.org/en/scripts/14473
    //$('a[onclick^="avdPlay("]').click()
}
else if(/由于网络限制.*只能用硕鼠下载/.test(doc.body.innerHTML)) { // Test page: 258577
    for(var i=0, e=$$('input'), len=e.length; i<len; i++) { if(e[i].value == '用硕鼠下载该视频') { e[i].click(); break } }
}
else if(/(不支持此地址的解析|不能在线观看|由于网络限制|禁止下载|解析失败)/.test(doc.body.innerHTML)) { // Test page: 53003
    setTimeout(function() { wnd.close() }, 3000)
}
else if(/这已经是视频地址了/.test(doc.body.innerHTML)) { // Test page: 240229
    //var a = doc.createElement('a')
    //a.href = 'data:audio/mpegurl;base64,' + btoa('#EXTM3U\n' + decodeURIComponent(href.match(/\?kw=([^&]*)/)[1]) + '\n')
    //var filename = ''
    //try { filename = doc.referrer.match(/\/(\d+)\.html?$/)[1] } catch(e) { filename = 'a' }
    //a.download = filename + '.m3u'
    //doc.body.appendChild(a)
    //a.click()

    var vlnks = decodeURIComponent(href.match(/\?kw=([^&]*)/)[1])
    try { GM_setClipboard(vlnks) } catch(e) {}
    var m3u = '#EXTM3U\n' + vlnks + '\n'
    //loc.href = 'data:application/x-mpegurl;base64,' + btoa(m3u)
    loc.href = 'data:audio/mpegurl;base64,' + btoa(m3u)
    setTimeout(function() { wnd.close() }, 3000)
}
//else if($('input[value=M3U列表]')) {
    //$('input[value=M3U列表]').click()
    //setTimeout(function() { wnd.close() }, 3000)
//}
else { // Test page: 240188
    var split_files = Array.prototype.slice.call($$('a[onclick^="_alert()"]')).map(function(a) { return a.href })
    if(split_files.length != 0) {
        //var a = doc.createElement('a')
        ////a.href = 'data:audio/mpegurl;base64,' + btoa('#EXTM3U\n' + split_files.join('\n') + '\n')
        //a.href = 'data:application/x-mpegurl;base64,' + btoa('#EXTM3U\n' + split_files.join('\n') + '\n')
        //a.target = '_self'
        //var filename = ''
        //try { filename = doc.referrer.match(/\/(\d+)\.html?$/)[1] } catch(e) { filename = 'a' }
        //a.download = filename + '.m3u'
        //doc.body.appendChild(a)
        //a.click()

        var vlnks = split_files.join('\n')
        try { GM_setClipboard(vlnks) } catch(e) {}
        var m3u = '#EXTM3U\n' + vlnks + '\n'
        //loc.href = 'data:application/x-mpegurl;base64,' + btoa(m3u)
        loc.href = 'data:audio/mpegurl;base64,' + btoa(m3u)
        setTimeout(function() { wnd.close() }, 3000)

        //var xhr = GM_xmlhttpRequest({
            //method: 'POST',
            //url: 'http://www.flvcd.com/get_m3u.php',
            //data: 'inf=' + split_files.map(function(href) { return encodeURIComponent(href) }).join('|') + '&filename=' + encodeURIComponent(doc.title.match(/(^.*?) - /)[1]),
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            //onload: function(response) {
                //var m3u = response.responseText + '\n'
                //if(m3u == '') { m3u = '#EXTM3U\n' + split_files.join('\n') + '\n' }
                //console.log(m3u)

                ////loc.href = 'data:application/x-mpegurl;base64,' + btoa(m3u)
                //loc.href = 'data:audio/mpegurl;base64,' + btoa(m3u)
                //setTimeout(function() { wnd.close() }, 3000)
            //},
            //synchronous: false,
        //})

        //var lnks = $$('a[onclick^="_alert()"]')
        //for(var i=0, len=lnks.length; i<len; i++) { lnks[i].onclick = null }
    } else { console.log('Error: No download link found.') }
}
