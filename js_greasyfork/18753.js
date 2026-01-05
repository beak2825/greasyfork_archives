// ==UserScript==
// @name			Andrew's Facebook Tagged Photos Downloader
// @include			https://www.facebook.com/*/allactivity?privacy_source=activity_log&log_filter=cluster_200
// @require			http://code.jquery.com/jquery-1.7.1.min.js
// @grant			none
// @version			2.0
// @description		Download all Facebook photos that you are tagged in.
// @namespace https://greasyfork.org/users/36399
// @downloadURL https://update.greasyfork.org/scripts/18753/Andrew%27s%20Facebook%20Tagged%20Photos%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/18753/Andrew%27s%20Facebook%20Tagged%20Photos%20Downloader.meta.js
// ==/UserScript==

/*
 * For jQuery Conflicts.
 */
this.$ = this.jQuery = jQuery.noConflict(true);

// Variables
var fbname = document.title;
var firstrun = false;
var retry = 0;
var retries = 10;

// Inject buttons into page
$(document).ready(function() {
    $('#pagelet_main_column_personal div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"]').append('<input type="button" id="andrewfbdl" value="Download Photos"><style>.fbprocessed { background-color: #9AFF9A; }</style>');
    $('#andrewfbdl').click(triggerdl);
});
function triggerdl() {
	if (confirm('Are you sure you wish to continue? Chrome may tell you that this page is attempting to download multiple files: please click on Allow. After you do so, please avoid scrolling this page.')) {
		inited = false;
		firstrun = false;
		retry = 0;
		andrewhandler();
	}
}

// Behold: the master function.
function andrewhandler() {
	if (!firstrun) {
		scrollTo(0, 0);
		firstrun = true;
	}
	if (retry < retries) {
		scrollTo(0, $(document).scrollTop()+$(window).height());
		if (!$("#fbTimelineLogBody div._5shk:not(.fbprocessed)").length) {
			if ($(window).scrollTop() + $(window).height() == $(document).height()) {
				retry++;
				console.log('Seems to be done. '+retry+'/'+retries);
			}
			setTimeout(function() { andrewhandler(); }, 2000);
		} else {
			retry = 0;
			contents = $("#fbTimelineLogBody div._5shk:not(.fbprocessed):first div._42ef").text();
			if (contents.indexOf(fbname+' was tagged in') != -1 && contents.indexOf(' photo.') != -1) {
				dlphoto();
			} else {
				//console.log('> Not a relevant activity, skipping.');
				$("#fbTimelineLogBody div._5shk:not(.fbprocessed):first").addClass('fbprocessed');
				andrewhandler();
			}
		}
	} else {
		alert('Done scrolling! Please wait for all photos to be downloaded.');
	}
}

function dlphoto() {
	setTimeout(andrewhandler, 2000);
	code = $("#fbTimelineLogBody div._5shk:not(.fbprocessed):first td._5ep6 a img").attr('src');
	regexp = /\/[0-9]+_([0-9]+)_[0-9]+_/g;
	match = regexp.exec(code);
	if (match[1]) {
		$("body").append("<iframe class='picdl' src='https://www.facebook.com/photo/download/?fbid="+match[1]+"' style='display: none;'></iframe>");
	}
	$("#fbTimelineLogBody div._5shk:not(.fbprocessed):first").addClass('fbprocessed');
}