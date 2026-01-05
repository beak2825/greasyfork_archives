// ==UserScript==
// @name         Direct Google - Rix
// @namespace    http://userscripts.org/users/92143
// @version      1.4
// @description  Removes Google redirects and exposes "Cached" links. 
// @include      /^https?\:\/\/(www|news|maps|docs|cse|encrypted)\.google\./
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/10840/Direct%20Google%20-%20Rix.user.js
// @updateURL https://update.greasyfork.org/scripts/10840/Direct%20Google%20-%20Rix.meta.js
// ==/UserScript==

var hostname = location.hostname
var pathname = location.pathname
var href = location.href

String.prototype.contains = function(s) {
	return -1 !== this.indexOf(s)
}

String.prototype.startsWith = function(s) {
	return this.slice(0, s.length) == s
}

function blockListeners(element, events) {
	function stopBubbling(event) {
		event.stopPropagation()
	}

	var eventList = events.split(' ')
	if(eventList) {
		var i, event
		for(i = eventList.length - 1; i > -1; i--) {
			event = eventList[i].trim()
			if(event) {
				element.removeEventListener(event, stopBubbling, true)
				element.addEventListener(event, stopBubbling, true)
			}
		}
	}
}

function modifyGoogle() {
	//remove web/video search redirects
    $('a[onmousedown^="return rwt("]').removeAttr('onmousedown').each(function() {
        this.target = "_blank";
    });
	//remove custom search redirects
	$('.gsc-results a[href][data-cturl]').each(function() {
        this.target = "_blank";
		blockListeners(this, 'mousedown')
	})
	//remove image search redirects
	$('a').filter('[class^="irc_"], [class*=" irc_"], [id^="irc_"]').each(function() {
        this.target = "_blank";
		blockListeners(this, 'mousedown')
	})
	//remove news search redirects
	if(href.contains('tbm=nws') || hostname.startsWith('news.google.')) {
		$('a.article[href^="http"]').each(function() {
            this.target = "_blank";
			blockListeners(this, 'click contextmenu mousedown mousemove')
		})
	}
	//remove shopping search redirects
	else if(href.contains('tbm=shop') || pathname.startsWith('/shopping/')) {
		$('a').filter('[href*="/aclk?"], [href*="/url?"]').each(function() {
            this.target = "_blank";
			var m = this.href.match(/(?:\&adurl|\?q|\&url)\=(http.*?)(\&|$)/i)
			if(m && m[1]) {
				var link = decodeURIComponent(m[1])
				m = link.match(/\=(https?(\%3A\%2F\%2F|\:\/\/).*?)(\&|$)/i)
				if(m && m[1]) {
					link = decodeURIComponent(m[1])
				}
				this.href = link
			}
		})
	}
	//remove map search redirects; does not remove redirects of advertisement
	else if(pathname.startsWith('/maps/') || '/maps' == pathname) {
		$('a[href^="http"]').each(function() {
            this.target = "_blank";
			blockListeners(this, 'click contextmenu')
			//legacy
			if(this.href.contains('url?')) {
				var m = this.href.match(/(?:\&|\?)q\=(http.*?)(\&|$)/i)
				if(m && m[1]) {
					this.href = decodeURIComponent(m[1])
				}
			}
		})
	}
	//remove legacy search redirects and docs redirects
	//should be done last as shopping uses the same url pattern
	$('a[href*="/url?"]').each(function() {
        this.target = "_blank";
		var m = this.href.match(/\/url\?(?:url|q)\=(http.*?)(\&|$)/i)
		if(m && m[1]) {
			this.href = decodeURIComponent(m[1])
		}
	})
	//expose cached links
	$('div[role="menu"] ul li a[href^="http://webcache.googleusercontent."]').each(
		function() {
			this.style.display = 'inline'
			$(this).closest('div.action-menu.ab_ctl, div._nBb')
			.after(' <a href="https' + this.href.substring(4) + '">(https)</a> ')
			.after($(this))
		}
	)
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver
if(MutationObserver) { 
	var observer = new MutationObserver(function(mutations) {
		modifyGoogle()
	})
	//tiny delay needed for firefox
	setTimeout(function() {
		observer.observe(document.body, {
			childList: true, 
			subtree: true
		})
		modifyGoogle()
	}, 100)
}
//for chrome v18-, firefox v14-, internet explorer v11-, opera v15- and safari v6-
else {
	setInterval(function() {
		modifyGoogle()
	}, 500)
}
