// ==UserScript==
// @name            Realtime Auction Countdown Timer
// @description     Show realtime countdown timers next to all auction threads in the WTS forum
// @grant           none
// @include         /https?://forums\.e-hentai\.org/index\.php\?showforum=77\b/
// @version 0.0.1.20161218195024
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/5013/Realtime%20Auction%20Countdown%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/5013/Realtime%20Auction%20Countdown%20Timer.meta.js
// ==/UserScript==

/*** Settings ***/

var update_interval = 60    // The interval (in seconds) for the timers to be updated.
var timer_height    = 45    // The height of timers (in pixels).

/****************/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var init_timer = function(timer, thread_url) {
    var timer_url = ''
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var container = doc.implementation.createHTMLDocument().documentElement
            container.innerHTML = xhr.responseText
            var timer_img = container.querySelector('img.linked-image[src^="http://reasoningtheory.net/countdown.png?"]')
            if(timer_img) {
                timer_url = timer_img.src.replace(/([?&]?)title=[^&]*/i, '$1')
            } else {
                timer_img = container.querySelector('img.linked-image[src^="http://e-hentai-countdown.darknessfall.com/EH-Cdwn.png?"]')
                if(timer_img) {
                    timer_url = timer_img.src.replace(/([?&]?)auctionname=[^&]*/i, '$1').replace(/([?&]?)expire=[^&]*/i, '$1')
                }
                else {
                    timer_img = container.querySelector('img[src*="countdown"]')
                    if(timer_img) {
                        var yy = mm = dd = hh = mi = ss = offset = ''
                        try { yy = timer_img.src.match(/year=([-0-9]*)/i)[1] } catch(e) {}
                        try { mm = timer_img.src.match(/month=([-0-9]*)/i)[1] } catch(e) {}
                        try { dd = timer_img.src.match(/day=([-0-9]*)/i)[1] } catch(e) {}
                        try { hh = timer_img.src.match(/hour=([-0-9]*)/i)[1] } catch(e) {}
                        try { mi = timer_img.src.match(/minute=([-0-9]*)/i)[1] } catch(e) {}
                        try { ss = timer_img.src.match(/second=([-0-9]*)/i)[1] } catch(e) {}
                        try { offset = timer_img.src.match(/offset=([-0-9]*)/i)[1] } catch(e) {}
                        timer_url = 'http://reasoningtheory.net/countdown.png?'
                        timer_url += '&year=' + yy
                        timer_url += '&month=' + mm
                        timer_url += '&day=' + dd
                        timer_url += '&hour=' + hh
                        timer_url += '&minute=' + mi
                        timer_url += '&second=' + ss
                        timer_url += '&offset=' + offset
                    }
                }
            }
            timer.src = timer_url
        }
    }
    xhr.open('GET', thread_url, true)
    xhr.send(null)
}

var threads = doc.querySelectorAll('table.ipbtable>tbody>tr>td.row1>div:last-child')
for(var i=threads.length-1; i>=0; i--) {
    var title = threads[i].textContent
    //if(/\[(auction|lottery|free)\b/i.test(title)) {
    if(/\[auction\b/i.test(title)) {
        (function() {
            var thread_url = threads[i].querySelector('span>a:first-child').href
            var timer = doc.createElement('IFRAME')
            timer.height = timer_height + 'px'
            timer.frameBorder = 0
            setInterval(function() { timer.src = timer.src }, update_interval*1000)
            threads[i].appendChild(timer)
            init_timer(timer, thread_url)
        })()
    }
}
