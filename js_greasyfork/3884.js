// ==UserScript==
// @name            Countdown Timer for the Random Encounter Event on E-Hentai
// @description     Adds a countdown timer for the Random Encounter event on E-Hentai.org and its subdomains.
// @grant           none
// @include         https://e-hentai.org/*
// @include         https://*.e-hentai.org/*
// @version 0.0.1.20170121223709
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/3884/Countdown%20Timer%20for%20the%20Random%20Encounter%20Event%20on%20E-Hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/3884/Countdown%20Timer%20for%20the%20Random%20Encounter%20Event%20on%20E-Hentai.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(!doc.querySelector('*[name="ipb_login_submit"]') && /(\.e-hentai\.org\/)|(^e-hentai.org\/)/.test(loc.hostname+'/') && !/\/palette\.html?\b/.test(href) && !doc.getElementById('countdown_timer')) {
    var set_cookie = function(k, v, t) {
        var expires = '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
        if(t) {
            var d = new Date()
            d.setTime(d.getTime() + (t * 24 * 60 * 60 * 1000))
            expires = '; expires=' + d.toGMTString()
        }
        doc.cookie = k + '=' + escape(v) + expires + '; domain=.' + /[^\.]+\.[^\.]+$/.exec(loc.hostname)[0] + '; path=/';
        //doc.cookie = k + '=' + escape(v) + expires + '; path=/';
    }
    var get_cookie = function(k) {
        var n = k + '='
        var ca = doc.cookie.split(';')
        for(var i=0; i<ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) == ' ') { c = c.substring(1) }
            if (c.indexOf(n) == 0) { return unescape(c.substring(n.length, c.length)) }
        }
        return undefined
    }

    if(!get_cookie('event')) { console.log('The "event" cookie does not exist or is invalid.'); throw 'exit' }
    if(!get_cookie('re_cnt')) { set_cookie('re_cnt', 0) }
    if(!get_cookie('re_lst')) { set_cookie('re_lst', '[]') }

    var timer_box = doc.createElement('DIV')
    timer_box.id = 'countdown_timer'
    timer_box.onclick = function() { if(/\bReady\b/i.test(this.textContent)) { wnd.open('https://e-hentai.org/news.php', href=='https://e-hentai.org/news.php'?'_self':'_blank') } }

    var toggle_re_lst = function() {
        //alert(get_cookie('re_lst'))
        var re_lst_box = doc.getElementById('re_lst_box')
        if(re_lst_box) { re_lst_box.parentNode.removeChild(re_lst_box); return }
        re_lst_box = doc.createElement('DIV')
        re_lst_box.id = 're_lst_box'
        re_lst_box.style.cssText = 'top:15px; right:0px; position:fixed; z-index:2147483647; background:rgba(0,255,0,1); color:#ff0000;'
        setTimeout(function() { re_lst_box.style.cssText = 'top:15px; right:0px; position:fixed; z-index:2147483647; background:rgba(0,255,0,0.2); color:#ff0000;' }, 3000)
        re_lst_box.innerHTML = '[List of RE Events Occurred Today]<BR>'
        re_lst_box.onmouseover = function () { this.style.cssText = 'top:15px; right:0px; position:fixed; z-index:2147483647; background:rgba(0,255,0,1); color:#ff0000;' }
        re_lst_box.onmouseout = function () { this.style.cssText = 'top:15px; right:0px; position:fixed; z-index:2147483647; background:rgba(0,255,0,0.2); color:#ff0000;' }
        var decode_hv_b64 = function(e) {
            var a = doc.createElement('A')
            a.href = 'http://hentaiverse.org/?s=Battle&ss=ba&encounter=' + e
            a.target = '_blank'
            a.text = (i+1) + '. '
            a.style.cssText = 'color:#ff0000'
            var d = atob(e)
            var m = /([^-]+?)-([^-]+?)-([^-]+)/.exec(d)
            if(m == null) { return a }
            var uid = m[1]
            var epoch = m[2]
            var hash = m[3]
            var da = new Date()
            da.setTime(parseInt(epoch)*1000)
            da = da.toLocaleTimeString()
            a.text = a.text + da
            return a
        }
        var re_lst = JSON.parse(get_cookie('re_lst'))
        if(re_lst) {
            for(var i=0, len=re_lst.length; i<len; i++) {
                var a = decode_hv_b64(re_lst[i])
                if(i != 0) { re_lst_box.appendChild(doc.createElement('BR')) }
                re_lst_box.appendChild(a)
            }
            doc.body.appendChild(re_lst_box)
        }
    }
    addEventListener('keydown', function(evt) { if((evt.target.tagName!='INPUT') && (evt.target.tagName!='TEXTAREA') && (evt.keyCode == 76)) { toggle_re_lst() } }, false)
    if(href == 'https://e-hentai.org/news.php') { toggle_re_lst() }

    var newshead = doc.getElementById('newshead')
    if(newshead && /\/e-hentai\./.test(href)) {
        timer_box.style.color = '#ff0000'
        newshead.appendChild(timer_box)
    } else {
        timer_box.style.cssText = 'line-height:15px; top:0px; right:0px; position:fixed; z-index:2147483647; background:rgba(0,255,0,0.2); color:#ff0000;'
        doc.body.appendChild(timer_box)
    }

    var update_timer = function() {
        if(href == 'https://e-hentai.org/news.php') {
            var da = new Date()
            if((da.getUTCHours()==0) && (da.getUTCMinutes()==0) && (da.getUTCSeconds()<=10)) {
                if(!/^Your IP.*banned/i.test(doc.body.textContent)) {
                    setTimeout(function() {loc.reload()}, 10000)
                }
            }
        }
        var now = Math.floor(new Date().getTime()/1000)
        var diff = parseInt(get_cookie('event')) + 1800 - now
        if(isNaN(diff)) { setTimeout(function() {loc.reload()}, 60000); return }
        if(diff <= 0) {
            timer_box.textContent = 'Ready! re_cnt=' + get_cookie('re_cnt')
            if(href == 'https://e-hentai.org/news.php') {
                if(/^Your IP.*banned/i.test(doc.body.textContent)) {}
                else if(/The site is currently in Read Only\/Failover Mode/i.test(doc.documentElement.innerHTML)) { setTimeout(function() {loc.reload()}, 60000) }
                else { loc.reload() }
                return
            }
        } else {
            var mm = Math.floor(diff / 60) + ''
            mm = (mm.length >= 2 ? mm : '0' + mm)
            var ss = Math.floor(diff % 60) + ''
            ss = (ss.length >= 2 ? ss : '0' + ss)
            timer_box.textContent = mm + ':' + ss + ', re_cnt=' + get_cookie('re_cnt')
            if( (mm == '00') || ((mm == '01') && (ss == '00')) ) {
                try {
                    if(doc.getElementById('eventpane').getElementsByTagName('div')[1].getElementsByTagName('a')[0].textContent != 'HentaiVerse') {
                        if(!doc.getElementById('re_snd')) {
                            var audio = new Audio('http://www.freesound.org/data/previews/234/234524_4019029-lq.mp3')
                            audio.id = 're_snd'
                            audio.volume = 1
                            audio.loop = true
                            audio.play()
                            doc.body.appendChild(audio)
                        }
                        if(/50|40|30|20|10|05|00/.test(ss)) { alert('Random Encounter') }
                    }
                    else {
                        if(doc.getElementById('re_snd')) {
                            doc.getElementById('re_snd').parentNode.removeChild(doc.getElementById('re_snd'))
                        }
                    }
                } catch(e) {}
            }
        }
        setTimeout(update_timer, 1000)
    }
    update_timer()

    var eventpane = doc.getElementById('eventpane')
    if(eventpane != null) {
        var re_evt = eventpane.querySelector('a[onclick*="http://hentaiverse.org/"]')
        //var re_evt = eventpane.getElementsByTagName('div')[1].getElementsByTagName('a')[0]
        if(re_evt) {
            var hv_lnk = ''
            if((/^http:\/\//.test(re_evt.href)) && (!/#/.test(re_evt.href))) { hv_lnk = re_evt.href }
            else {
                hv_lnk = /.*window\.open\(['"]?([^'"]+)['"]?/.exec(re_evt.onclick.toString().split('\n').join(''))
                if(hv_lnk) { hv_lnk = hv_lnk[1] }
            }
            if(hv_lnk) {
                hv_b64 = hv_lnk.replace(/.+?&encounter=([^&]*).*/, '$1') // the base64 encoded part
                var re_lst = JSON.parse(get_cookie('re_lst'))
                if((!re_lst) || (re_lst.length == 0)) { re_lst = [] }
                if(re_lst.indexOf(hv_b64) == -1) { re_lst.push(hv_b64) }
                re_lst = JSON.stringify(re_lst, null, ' ')
                set_cookie('re_lst', re_lst)
            }
            else {
                console.log('Error: There is a random encounter event but the HentaiVerse link cannot be found.')
                throw 'exit'
            }
            re_evt.addEventListener('click', function() {
                if(re_evt.text != 'HentaiVerse') {
                    set_cookie('re_cnt', parseInt(get_cookie('re_cnt'))+1)
                    re_evt.text = 'HentaiVerse'
                    if(doc.getElementById('re_lst_box')) { toggle_re_lst(); toggle_re_lst() }
                }
                eventpane.style.display = 'block'
            }, false)
        }
        else if(/\bdawn\b/i.test(eventpane.textContent)) {
            set_cookie('re_cnt', 0)
            set_cookie('re_lst', '[]')
            if(doc.getElementById('re_lst_box')) { toggle_re_lst(); toggle_re_lst() }
        }
    }
}
