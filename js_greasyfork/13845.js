// ==UserScript==
// @name         MyAnimeList(MAL) - Compact Reviews
// @version      1.1.0
// @description  All reviews of a user on 1 page
// @author       Cpt_mathix
// @match        *://myanimelist.net/profile/*/reviews
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13845/MyAnimeList%28MAL%29%20-%20Compact%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/13845/MyAnimeList%28MAL%29%20-%20Compact%20Reviews.meta.js
// ==/UserScript==

var user = document.getElementsByTagName('title')[0].textContent.replace("'s Profile - Reviews - MyAnimeList.net", "");
var howManyReviews = $('#content > table > tbody > tr > td.profile_leftcell > div > ul.user-status.border-top.mt12.mb12 > li:nth-child(2) > a > span.user-status-data.di-ib.fl-r.fw-b')[0].innerHTML;
var count = ~~(parseInt(howManyReviews) / 10);

if (howManyReviews > 10)
	compactify($('#content > table > tbody > tr > td.pl8'), true);

for(var i = 0; i < count; i++) {
	getAllReviews(i + 2, user);
}

function getAllReviews(page, user) {
	$.get('/profile/' + user + '/reviews&p=' + page, function(data){
		var xhr = $(data).find('#content > table > tbody > tr > td.pl8');
		compactify(xhr, false);
	});
}

function compactify(content, original) {
	$(content).find('.spaceit.textReadability').each(function() {
		$(this).hide();
		$(this).next().find('.lightLink').first().parent().hide();
	});

	$(content).find('.mt12.pt4.pb4.pl0.pr0.clearfix').each(function () {
		this.innerHTML = this.innerHTML.replace(/permalink/g, "Read Review");
	});

	$(content).find('.borderDark').each(function() {
		this.style.padding = '5px 5px';

		$(this).on("mouseenter", function() {
			$(this).find('.spaceit.textReadability').each(function() {
				$(this).show();
				$(this).next().find('.lightLink').first().parent().show();
			});
		});

		$(this).on("mouseleave", function() {
			$(this).find('.spaceit.textReadability').each(function() {
				$(this).hide();
				$(this).next().find('.lightLink').first().parent().hide();
			});
		});
	});

	remove(content, original);
}

function remove(content, original) {
	$(content[0].childNodes).each(function() {
		if (this.className != 'borderDark')
			this.remove();
	});

	sort(content, original);
}

function sort(content, original) {
	$(content).find('.borderDark').each(function() {
		var name = $(this).find('.hoverinfo_trigger');
		this.id = name[0].innerHTML;
	});

	var originalContent = $('#content > table > tbody > tr > td.pl8').children('div').get();
	var listitems = null;
	if (!original) {
		originalContent.push.apply(originalContent, content.children('div').get());
		listitems = originalContent;
	} else
		listitems = content.children('div').get();

	listitems.sort(function(a, b) {
		var compA = $(a).attr('id');
		var compB = $(b).attr('id');
		return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	});
	$.each(listitems, function(idx, itm) {
		$('#content > table > tbody > tr > td.pl8').append(itm);
	});

	addNavigation();
}

function addNavigation() {
	$('#horiznav_nav').remove();

	$('.js-review-btn-helpful').each(function() {
		this.remove();
	});

	var user = document.getElementsByTagName('title')[0].textContent.replace("'s Profile - Reviews - MyAnimeList.net", "");

	var content = $('#content > table > tbody > tr > td.pl8');
	var navigation = document.createElement('div');
	content[0].insertBefore(navigation, content[0].firstChild);

	var string = '<div id="horiznav_nav" style="margin: 5px 0 10px;">';
	string +=		'<ul>';
	string +=			'<li><a href="/profile/' + user + '">Home</a></li>';
	string +=			'<li><a href="/profile/' + user + '/reviews" class="horiznav_active">Reviews</a></li>';
	string +=			'<li><a href="/profile/' + user + '/recommendations" rel="nofollow">Recommendations</a></li>';
	string +=			'<li><a href="/profile/' + user + '/clubs">Clubs</a></li>';
	string +=			'<li><a href="/profile/' + user + '/friends">Friends</a></li>';
	string +=		'</ul>';
	string +=	'</div>';

	navigation.outerHTML = string;
}


