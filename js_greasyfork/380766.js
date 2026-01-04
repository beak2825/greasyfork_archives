// ==UserScript==
// @name         Infinite Scroll
// @author       Hauffen
// @description  Infinite scrolling for March 2019 layout redesign.
// @version      2.28.4
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace    https://greasyfork.org/users/285675
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/380766/Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/380766/Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
var url = document.URL, $ = window.jQuery;
var page = 0, cpage = 0, max = 0;
var query, nextUrl;
var setting = localStorage.getItem("ehif_float") ? localStorage.getItem("ehif_float") : 1;
var flag;
var timeout;
var d1 = url.split('/')[3];
var cate = ['doujinshi', 'manga', 'artistcg', 'gamecg', 'western', 'nonh', 'imageset', 'cosplay', 'asianporn', 'misc'];

if (d1.startsWith('archiver') || d1.startsWith('gallery') || d1.startsWith('g')) return;
$('.nopm').last().append('<label style="margin-left: 10px;"><input type="checkbox" class="ehxCheck" id="is_float" style="top: 5px;" ' + (setting == 1 ? 'checked' : '') + '>Float</label>');

function newUrl() {
	nextUrl = null;
	if (d1 === 'g' || d1 === 's') {
		return;
	}

	if (parseInt($('.ptt td:nth-last-child(2)').text()) > 1) {
		if (max === 0) {
			max = parseInt($('.ptt td:nth-last-child(2)').text()) - 1;
			page = parseInt($('.ptds').first().text()) - 1;
		}
		if ((page + 2) > parseInt($('.ptt td:nth-last-child(2)').text())) { // Return null if our next page is outside of the scope of the results for a tag search
			return;
		}
	} else { // Return null if we only have a single page
		return;
	}

	// Return null if we're doing a file hash search
	if (url.match(/f_shash/)) {
		return;
	}

	if (!cate.includes(d1) && d1 != 'tag' && d1 != 'uploader') {
		if (url.split('/').length == 4 && url.split('/') == '') { // Front Page
			nextUrl = url + '?page=' + (parseInt(page) + 1);
			return;
		}

		if (d1.startsWith('?')) { // Front page with either a set page, or a search
			if (url.includes('page=')) {
				query = url.substr(url.indexOf('&')); // Get query if page is already set
				query = (query.includes("from=")) ? query.substr(0, query.lastIndexOf("&")) : query; // Remove the gallery ID offset if it's included in the query
				cpage = parseInt(url.split('page=')[1].substr(0, url.split('page=')[1].indexOf('&')));
                if (page === 0) page = cpage;
				nextUrl = 'https://' + window.location.hostname + '/?page=' + (parseInt(page) + 1) + query;
			} else {
				query = url.split('?')[1]; // If page is unset, we just need the whole string
				query = (query.includes("from=")) ? query.substr(0, query.lastIndexOf("&")) : query; // Remove the gallery ID offset if it's included in the query
				nextUrl = 'https://' + window.location.hostname + '/?page=' + (parseInt(page) + 1) + '&' + query;
			}
		} else {
			if (d1.includes('watched')) { // Watched
				if (d1.indexOf('?') > 0) {
					cpage = url.substr(url.indexOf('=') + 1);
                    if (page === 0) page = cpage;
					nextUrl = url.substr(0, url.lastIndexOf('?')) + '?page=' + (parseInt(page) + 1); // Ignore the offset as we add it later
				} else {
					nextUrl = url + '?page=' + (parseInt(page) + 1);
				}
			} else { // Favorites
				if (d1.indexOf('?') > 0) {
					if (url.includes('favcat') && !url.includes('page=')) { // Category only
						if (url.includes('f_search')) { // Because I fucking hate favorites. Straight fucking garbage page.
							nextUrl = 'https://' + window.location.hostname + '/favorites.php?page=' + (parseInt(page) + 1) + '&' + url.split('?')[1];
						} else {
							nextUrl = url + '&page=' + (parseInt(page) + 1);
						}
					} else if (url.includes('favcat') && url.includes('page=')) { // Category and Page
						if (url.indexOf('favcat') < url.indexOf('page')) { // Category before page
							if (url.includes('f_search')) { // Category before page with search
								cpage = parseInt(url.split('page=')[1].substr(0, url.split('page=')[1].indexOf('&')));
                                if (page === 0) page = cpage;
								nextUrl = url.split('page=')[0] + 'page=' + (parseInt(page) + 1) + url.split('page=')[1].substr(url.split('page=')[1].indexOf('&'));
							} else {
								page = parseInt(url.substr(url.lastIndexOf('=') + 1));
								nextUrl = url.substr(0, url.lastIndexOf('=') + 1) + (parseInt(page) + 1);
							}
						} else { // Page before category
							query = url.substr(url.indexOf('&'));
							cpage = parseInt(url.substr(url.indexOf('?') + 6, url.indexOf('&') - url.indexOf('?') - 5));
                            if (page === 0) page = cpage;
							nextUrl = 'https://' + window.location.hostname + '/favorites.php?page=' + (parseInt(page) + 1) + query;
						}
					} else if (url.includes('f_search')) { // Search
						if (url.includes('page=')) {
							query = url.substr(url.indexOf('&'));
							cpage = parseInt(url.substr(url.indexOf('?') + 6, url.indexOf('&') - url.indexOf('?') - 5));
                            if (page === 0) page = cpage;
							nextUrl = 'https://' + window.location.hostname + '/favorites.php?page=' + (parseInt(page) + 1) + query;
						} else { // Search with no page
							query = url.substr(url.indexOf('?') + 1);
							nextUrl = 'https://' + window.location.hostname + '/favorites.php?page=' + (parseInt(page) + 1) + '&' + query;
						}
					} else { // Page only
						cpage = parseInt(url.substr(url.lastIndexOf('=') + 1));
                        if (page === 0) page = cpage;
						nextUrl = url.substr(0, url.lastIndexOf('?')) + '?page=' + (parseInt(page) + 1);
					}
				} else {
					nextUrl = url + '?page=' + (parseInt(page) + 1);
				}
			}
		}
	} else { // Otherwise, just do the next generic page URL
		if (cate.includes(d1)) {
			if (url.split('/').length == 5) { // Page already set
				cpage = url.split('/')[4];
                if (page === 0) page = cpage;
				nextUrl = url.substr(0, url.lastIndexOf('/')) + '/' + (parseInt(page) + 1); // Ignore the offset as we add it later
			} else {
				nextUrl = url + '/' + (parseInt(page) + 1);
			}
		} else {
			if (url.split('/').length == 6) { // page already set
				cpage = url.split('/')[5];
                if (page === 0) page = cpage;
				nextUrl = url.substr(0, url.lastIndexOf('/')) + '/' + (parseInt(page) + 1);
			} else {
				nextUrl = url + '/' + (parseInt(page) + 1);
			}
		}
	}
}

newUrl();

function loadMore() {
	if (typeof(nextUrl) == "object") { return; }
	var index = document.getElementsByTagName("select").length > 1 ? 1 : 0; // Offset the select index if there are more than one
	flag = false;
	clearTimeout(timeout);
	// Don't do anything if we're in a gallery or viewing pages
	if (d1 === "g" || d1 === "s") {
		return;
	}

	// Make sure we're near enough to the bottom of the page
	if ($(window).scrollTop() + $(window).height() >= $(document).height() && nextUrl != null) {
		var $content = $('<div>'); // Create a div container to throw scraped content into

		var offset = "";
		if (!url.match("favorites")) {
			offset = "&from=" + document.getElementsByClassName('itg')[0].lastChild.getElementsByTagName("a")[0].href.split("/")[4]; // Append the gallery offset to URL
		}
		if (url.match(/\/tag\//) || cate.includes(d1)) {
			offset = "?from=" + document.getElementsByClassName('itg')[0].lastChild.getElementsByTagName("a")[0].href.split("/")[4]; // Append the gallery offset to URL
		}
		$content.load(url.match(/\/uploader\//) ? nextUrl : `${nextUrl + offset}`, function() { // Only add the gallery offset if we're not doing a tag search, since tag search uses a different URL scheme
			var divs = null;
			// Error catching
			if (document.getElementsByTagName("select")[index] == null) {
				index = 0;
			}

			// Different selectors for e-h versus exh
			if (window.location.hostname.substr(1,1) !== "x") {
				if (document.getElementsByTagName("select")[index].selectedIndex == 4 || url.match("favorites")) {
					divs = this.getElementsByClassName('itg')[0].children;
				} else {
					divs = this.getElementsByClassName('itg')[0].children;
				}
			} else {
				if (document.getElementsByTagName("select")[index].selectedIndex == 4 || url.match("favorites")) {
					divs = this.getElementsByClassName('itg')[0].children;
				} else {
					divs = this.getElementsByClassName('itg')[0].children[0].children;
				}
			}

			// Remove the first element (table header) if not in thumbnail mode
			if (document.getElementsByTagName("select")[index].selectedIndex !== 3 && document.getElementsByTagName("select")[index].selectedIndex !== 4 && !url.match("favorites")) {
				divs[0].parentNode.removeChild(divs[0]);
			}

			// Add scraped content to our current page
			while (divs.length > 0) {
				$('.itg').append(divs[0]);
			};
			flag = true;
			timeout = setTimeout(forceLoad());
		});
		page = parseInt(page) + 1;
		newUrl();
	}
}

function forceLoad() {
	// Force page load if body height is less than window height
	if ($("body").height() < $(window).height()) {
		loadMore();
		if (!flag) {
			return;
		} else {
			timeout = setTimeout(forceLoad(), 10000);
		}
	}
}

forceLoad();

$(document).on('change', 'input', e => {
    if ($('#is_float').prop('checked')) localStorage.setItem("ehif_float", "1");
    else localStorage.setItem("ehif_float", "0");
});

//Otherwise, do the normal scroll checks
$(window).on('scroll', function(){
	if (page + 1 <= max) loadMore();
	if (d1 == "" || d1.startsWith("?") || url.match(/\/tag\//) || url.match(/\/uploader\//) || url.includes('watched')) {
		var offset = (document.getElementById('advdiv').style.display == "none") ? 108 : 291;

		if(window.pageYOffset > (document.getElementById("searchbox").offsetTop + offset) && $('#is_float').prop('checked')) {
			$('#searchbox').css({
				position:'fixed',
				top:'5px',
				width:'612px',
				zIndex:'3',
				background:'#3a4650', //This line is the background color for the box, edit to your preference
				//background: window.getComputedStyle($("div.ido")[0]).background, // Use this line if you don't want to think about it
				left:'50%',
				marginLeft:'-306px'
			});
			$('.ido')[0].lastChild.style.paddingTop = parseInt(offset) + 6 + 'px';
		} else { // Reset CSS rules
			$('#searchbox').css({
				position:'',
				top:'',
				width:'',
				zIndex:'',
				background:'',
				left:'',
				marginLeft:''
			});
			$('.ido')[0].lastChild.style.paddingTop = '';
		}
	}
});
})();