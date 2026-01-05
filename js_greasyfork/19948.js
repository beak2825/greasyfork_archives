// ==UserScript==
// @name			Andrew's Instagram Tag Downloader
// @include			https://www.instagram.com/explore/tags/*/
// @require			http://code.jquery.com/jquery-1.7.1.min.js
// @grant			none
// @version			1.0
// @description		Download all pictures and/or videos for a certain tag.
// @namespace https://greasyfork.org/users/36399
// @downloadURL https://update.greasyfork.org/scripts/19948/Andrew%27s%20Instagram%20Tag%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/19948/Andrew%27s%20Instagram%20Tag%20Downloader.meta.js
// ==/UserScript==

/*
 * For jQuery Conflicts.
 */
this.$ = this.jQuery = jQuery.noConflict(true);

// Variables
var retry = 0;
var retries = 10;
var igcollection = [];
var pics = 0;
var vids = 0;
var mode;

// Inject buttons into page
$(document).ready(function() {
    $('header h1').append('<br /><input type="button" id="andrewiggendownload" value="Download All">&nbsp;<input type="button" id="andrewigpicdownload" value="Download Photos Only">&nbsp;<input type="button" id="andrewigviddownload" value="Download Videos Only"><style>.igprocessed { opacity: 0.5; }</style>');
    $('#andrewiggendownload').click(function() { triggergendl('generic'); });
    $('#andrewigpicdownload').click(function() { triggergendl('pic'); });
    $('#andrewigviddownload').click(function() { triggergendl('vid'); });
});
jQuery.fn.simulateClick = function() {
    return this.each(function() {
        if('createEvent' in document) {
            var doc = this.ownerDocument,
                evt = doc.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.dispatchEvent(evt);
        } else {
            this.click();
        }
    });
};
function triggergendl(m) {
	if (confirm('Are you sure you wish to continue?\r\nTIP: Disable "Ask where to save each file before downloading" in your browser\'s settings otherwise you\'ll be doing a lot of clicking. Feel free to click on "Cancel" and check your settings, and then click on the Download button again.')) {
		retry = 0;
		$('.igprocessed').removeClass('igprocessed');
		mode = m;
		andrewhandler();
	}
}
function andrewhandler() {
	if (retry < retries) {
		if (!$("main > article > div > div > div > a:not(.igprocessed)").length) {
			$loadmore = $('a').filter(function(index) { return $(this).text() === "Load more"; });
			if ($loadmore.length) {
				$loadmore.simulateClick('click');
				retry = 0;
				setTimeout(function() { andrewhandler(); }, 500);
				return;
			}
			scrollTo(0, 99999999);
			setTimeout(function() { andrewhandler(); }, 500);
			retry++;
			//console.log('Seems to be done. '+retry+'/'+retries);
		} else {
			retry = 0;
			$el = $("main > article > div > div > div > a:not(.igprocessed):first");
			$igtype = $('span', $el).filter(function(index) { return $(this).text() === "Video"; });
			var igtype = 'photo';
			if ($igtype.length) igtype = 'video';
			$el.addClass('igprocessed');
			if (igtype == 'video') {
				if (mode != 'pic') {
					vids++;
					$el.simulateClick('click');
					setTimeout(processVideo, 500);
				} else andrewhandler();
			} else {
				if (mode != 'vid') {
					pics++;
					$igimg = $("img", $el);
					igcollection.push($igimg.attr('src'));
				}
				andrewhandler();
			}
		}
	} else {
		if (confirm('Done! Are you ready to download '+igcollection.length+' file(s)? ('+pics+' pics | '+vids+' vids)')) downloadAll();
	}
}
function processVideo() {
	igcollection.push($("video[src]").attr('src'));
	setTimeout(closeOverlay, 500);
}
function closeOverlay() {
	$('button:contains("Close")').simulateClick('click');
	andrewhandler();
}
function downloadAll() {
	var link = document.createElement('a');
	link.setAttribute('download', null);
	link.style.display = 'none';
	document.body.appendChild(link);
	for (var i = 0; i < igcollection.length; i++) {
		link.setAttribute('href', igcollection[i]);
		link.click();
	}
	document.body.removeChild(link);
}