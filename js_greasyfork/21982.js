// ==UserScript==
// @name           E-H Better Gallery Hiding
// @description    Undoable hiding based on tags, title keywords, and uploader name. Edit script to configure options.
// @author         Hen-Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        /^https?:\/\/(e-|ex)hentai\.org\/(watched.*|\?page=.*|\?f_.*|tag\/.*|uploader\/.*)?$/
// @grant          none
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon           https://i.imgur.com/pMMVGRx.png
// @version        4.3
// @downloadURL https://update.greasyfork.org/scripts/372999/E-H%20Better%20Gallery%20Hiding.user.js
// @updateURL https://update.greasyfork.org/scripts/372999/E-H%20Better%20Gallery%20Hiding.meta.js
// ==/UserScript==

/*───────────────────┐
│   CONFIGURATION    │
├────────────────────┼──────────────────────────┬─────────────────────────────────┐
│  uploader hiding   │       title hiding       │           tag hiding            │
├────────────────────┼──────────────────────────┼─────────────────────────────────┤
│ edit "var blocked" │ edit "var hidePixiv"     │ add tag to exhentai.org/mytags  │
│ case insensitive   │ edit "var hideOngoing"   │ set colour to #FF0000 and keep  |
│ format:            │ edit "var hidePortfolio" │ "hidden" unchecked. result:     |
│ ['user1','user2']  │ format:                  │ script can soft-hide and toggle |
│                    │ true/false               │ hiding (except in minimal view) |
└────────────────────┴──────────────────────────┴────────────────────────────────*/
var softHiding = false; //dim "hidden" galleries without removing from page
var blocked = []; //list of blocked uploaders
var hidePixiv = false; //pixiv art dumps
var hideOngoing = false; //ongoing or wip galleries
var hidePortfolio = false; //other artist dumps
var hideMisc = true; //ai generated/textless/sample galleries
/*───────────────────────────────────────────────────────────────────────────────*/

//track removed galleries by type
var removed, fRemoved, uRemoved, oRemoved, pRemoved, aRemoved, mRemoved;
removed = fRemoved = uRemoved = oRemoved = pRemoved = aRemoved = mRemoved = 0;

//all view modes
$('table.itg>tbody>tr, .gl1t').each(function() {
	var uploader = $(this).find('.glhide div a, .gl3e div a').text().toLowerCase();
	var galTitle = $(this).find('.glink, .gl4t.glname').text();

	$.each(blocked, function(index,value) {
		blocked[index] = value.toLowerCase();
	});

	//tag flagged
	//gallery with flagged tag in colour #FF0000 is to be blocked
	if ($(this).find('.gt[style$=",#FF0000) !important"]').length > 0) {
		hidden($(this));
		removed++, fRemoved++;
	}
	//ongoing gallery
	else if(/[([]wip[)\]]|\[incomplete\]|on[- ]?going|en progreso|[\(\[](work )?in[ -]progress.*[\)\]]/i.test(galTitle) && hideOngoing) {
		hidden($(this));
		removed++, oRemoved++;
	}
	//pixiv gallery
	else if(/pixiv|fanbox/i.test(galTitle) && hidePixiv) {
		hidden($(this));
		removed++, pRemoved++;
	}
	//artist gallery
	else if(/^artist \w+$|site ?rip|subscribestar|fantia|patreon|hentaifoundry|hentai foundry|hentai-foundry|artist archives|twitter|artist galleries|artist ?[:—–-]|[\(\[]artist[\)\]]/i.test(galTitle) && hidePortfolio) {
		hidden($(this));
		removed++, aRemoved++;
	}
	else if (/\[(ai generated|textless|sample|MTL|rough translation)\]/i.test(galTitle) && hideMisc) {
		hidden($(this));
		removed++, mRemoved++;
	}
	//uploader blocked - unavailable in thumbnail mode
	else if ($.inArray(uploader, blocked) !== -1) {
		hidden($(this));
		removed++, uRemoved++;
	}
});

//display removed count with mouseover data
var ctrlAnchor = $('.searchnav');
if (removed > 0) {
	var removedInfo = 'Flagged:'+fRemoved+' Uploader:'+uRemoved+' Ongoing:'+oRemoved+' Pixiv:'+pRemoved+' Artist:'+aRemoved+' Misc:'+mRemoved;
	if (softHiding) {
		ctrlAnchor.before('<div class="eh-bgh-controls">(<em class="eh-bgh-hiddenCount" title="'+removedInfo+'">Soft-Hiding '+removed+'</em> / <a class="eh-bgh-toggle" href="javascript:;" title="Temporarily disable E-H Better Gallery Hiding">Disable</a>)</div>');
	} else {
		ctrlAnchor.before('<div class="eh-bgh-controls">(<em class="eh-bgh-hiddenCount" title="'+removedInfo+'">Hiding '+removed+'</em> / <a class="eh-bgh-toggle" href="javascript:;" title="Temporarily disable E-H Better Gallery Hiding">Disable</a>)</div>');
	}
}

function hidden(elem) {
	if (softHiding) {
		elem.addClass('eh-bgh-hidden');
	} else {
		elem.addClass('eh-bgh-hidden').hide();
	}
}

//temporarily disable hiding
$('.eh-bgh-toggle').click(function() {
	var toggle = $('.eh-bgh-toggle');

	toggle.toggleClass('eh-bgh-showing');
	$('.eh-bgh-hidden').toggle();

	if (toggle.hasClass('eh-bgh-showing')) {
		toggle.text('Enable');
	} else {
		toggle.text('Disable');
	}
});

//add custom css
$('head').append(`<style data-jqstyle="ehBGH">
.eh-bgh-controls {display:block; text-align:center; padding:3px 1px;}
.eh-bgh-hidden {opacity: .2; transition:200ms ease-out;}
.eh-bgh-hidden:hover {opacity: 1;}
.eh-bgh-hiddenCount {border-bottom: 1px dotted currentColor;}
</style>`);