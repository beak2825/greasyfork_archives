// ==UserScript==
// @name        steamgifts.com improved game filter
// @description Makes hiding giveaways for specific games much quicker and easier
// @namespace   Barefoot Monkey
// @include     https://www.steamgifts.com/
// @include     https://www.steamgifts.com/giveaways/search?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js
// @version     2.1.2
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/10448/steamgiftscom%20improved%20game%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/10448/steamgiftscom%20improved%20game%20filter.meta.js
// ==/UserScript==

var version = '2.1.2'
var OLD_VERSION_KEY = 'previous version'

$('<style>')
.text(
	'.BarefootMonkey-popup-bg {'
	+'	background: #3C424D;'
	+'	position: fixed;'
	+'	top: 0;'
	+'	bottom: 0;'
	+'	left: 0;'
	+'	right: 0;'
	+'	opacity: 0.85;'
	+'	z-index: 9988;'
	+'	cursor: pointer;'
	+'}'

	+'.BarefootMonkey-popup ul {'
	+'	list-style: inside;'
	+'}'
	
	+'.BarefootMonkey-popup p {'
	+'	margin: 0.7em 0;'
	+'	text-align: justify;'
	+'}'

	+'.BarefootMonkey-popup h1 i {'
	+'	font-size: 0.5em;'
	+'	font-weight: bold;'
	+'}'

	+'.BarefootMonkey-popup a {'
	+'	color: #4B72D4;'
	+'	font-weight: bold;'
	+'}'
	+'.BarefootMonkey-popup em {'
	+'	font-style: italic;'
	+'}'
	+'.BarefootMonkey-popup h1 {'
	+'	font-size: 1.5em;'
	+'	margin: 0px 0px 0.5em;'
	+'	border-bottom: 1px solid #6B7A8C;'
	+'	padding-bottom: 0.5em;'
	+'}'
	+'.BarefootMonkey-popup key, .BarefootMonkey-popup b {'
	+'	font-weight: bold;'
	+'}'
	
	+'.BarefootMonkey-popup {'
	+'	background: #F0F2F5 none repeat scroll 0% 0%;'
	+'	z-index: 9999;'
	+'	position: fixed;'
	+'	left: calc(50vw - 18em);'
	+'	top: 20vh;'
	+'	border-radius: 4px;'
	+'	color: #6B7A8C;'
	+'	font: 300 17px "Open Sans",sans-serif;'
	+'	padding: 1em;'
	+'	width: 36em;'
	+'	max-height: calc(80vh - 3em);'
	+'	overflow: auto;'
	+'}'
)
.appendTo(document.head)

function cmpVersion(a, b) {
	var i, cmp, len, re = /(\.0)+[^\.]*$/;
	a = (a + '').replace(re, '').split('.');
	b = (b + '').replace(re, '').split('.');
	len = Math.min(a.length, b.length);
	for( i = 0; i < len; i++ ) {
		cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
		if( cmp !== 0 ) {
			return cmp;
		}
	}
	return a.length - b.length;
}

function close_popup() {
	GM_setValue(OLD_VERSION_KEY, version)
	$('.BarefootMonkey-popup-bg, .BarefootMonkey-popup').fadeOut(500, function() { $(this).remove() })
}
function open_popup() {
	var bg = $('<div class="BarefootMonkey-popup-bg">')
	.hide()
	.appendTo(document.body)
	.click(close_popup)

	var popup = $('<aside class="BarefootMonkey-popup">')
	.hide()
	.html('<h1>improved game filter <i>steamgifts.com userscript, version '+version+'</i></h1>'
		+"<p>This script replaces steamgifts.com's default \"Hide Game\" interface with one that's a bit more practical.</p>"
		+"<p>Click on the <i class=\"giveaway__icon giveaway__hide fa fa-eye-slash\"></i> icon next to the name of a game you want to hide and the game will be hidden without asking you for confirmation.</p>"
		+"<p>Skipping the confirmation makes hiding games quicker, but increases the chance that you accidentally hide the wrong game. To solve that problem, <b>improved game filter</b> doesn't actually remove games from the page as soon as you hide them - it merely adds a visual indication that they're hidden. That way you can see what games you've just hidden and undo any accidents by clicking on the <i class=\"giveaway__icon giveaway__hide fa fa-eye-slash\"></i> icons again to undo hiding them.</p>"
		+"<p>If you have any comments or questions about the <b>improved game filter</b> userscript then feel free to <a href=\"http://www.steamgifts.com/discussion/c1xhr/userscript-improved-game-filter\">join this discussion</a>.</p>"
		+"<h1>recent changes</h1>"
		+"<ul>"
		+"<li>Fixed regression in previous update, which affected users running this script through Tampermonkey on Chrome.</li>"
		+"<li>General site compatiblity update. You may have noticed the noticed the regular \"hide game\" popups appearing recently despite having improved game filter installed. Version 2.1 fixes this issue.</li>"
		+"</ul>"
	)
	.appendTo(document.body)

	$('.BarefootMonkey-popup-bg, .BarefootMonkey-popup').fadeIn(500)
}

var old_version = GM_getValue(OLD_VERSION_KEY)
if (old_version == null || cmpVersion(old_version, version) < 0) {
	open_popup()
}

$('<style>')
.text(
	'@keyframes rotate-right-60px {'
	+'	from {'
	+'		background-position: 0px 0;'
	+'	}'
	+'	to {'
	+'		background-position: 300px 0;'
	+'	}'
	+'}'

	+'@keyframes rotate-left-60px {'
	+'	from {'
	+'		background-position: 0px 0;'
	+'	}'
	+'	to {'
	+'		background-position: -300px 0;'
	+'	}'
	+'}'

	+'.giveaway__row-outer-wrap {'
	+'	transition: opacity 1s linear;'
	+'}'

	+'.BarefootMonkey-hidden {'
	+'	opacity: 0.6;'
	+'	background: repeating-linear-gradient(45deg, transparent 0px, transparent 10px, #ccc, 10px, #ccc 12px, transparent 12px), repeating-linear-gradient(-45deg, transparent 0px, transparent 10px, #ccc, 10px, #ccc 12px, transparent 12px);'
	+'}'

	+'.BarefootMonkey-hiding, .BarefootMonkey-unhiding {'
	+'	opacity: 0.6;'
	+'	animation-duration: 12s;'
	+'	animation-iteration-count: infinite;'
	+'	animation-timing-function: linear;'
	+'}'

	+'.BarefootMonkey-hiding {'
	+'	animation-name: rotate-right-60px;'
	+'	background: repeating-linear-gradient(45deg, transparent 0px, transparent 10px, #ccc, 10px, #ccc 12px);'
	+'}'

	+'.BarefootMonkey-unhiding {'
	+'	animation-name: rotate-left-60px;'
	+'	background: repeating-linear-gradient(-45deg, transparent 0px, transparent 10px, #ccc, 10px, #ccc 12px);'
	+'}'
)
.appendTo(document.head)

function update_filter(id, token, action, url, prior_class, progress_class, complete_class) {

	$('.giveaway__row-outer-wrap[data-game-id='+id+']')
	.addClass(progress_class)
	.removeClass('BarefootMonkey-error')
	.removeClass(prior_class)

	$.ajax({
		url: url,
		method: 'POST',
		context: {id: id, progress_class: progress_class, complete_class: complete_class},
		data: {
			'xsrf_token':token,
			'game_id':id,
			'do': action
		},
		'error': function() {
			$('.giveaway__icon.giveaway__hide[data-popup="popup--hide-games"][data-game-id='+this.id+']')
			.closest('.giveaway__row-outer-wrap')
			.removeClass(this.progress_class)
			.addClass('BarefootMonkey-error')
		},
		'success': function() {
			$('.giveaway__row-outer-wrap[data-game-id='+this.id+']')
			.removeClass(this.progress_class)
			.addClass(this.complete_class)
		}
	})
}

function callback(event) {
	var closest = $(this).closest('.giveaway__row-outer-wrap[data-game-id]')
	if (closest.length > 0) {

		// get id and token
		var id = closest.data('game-id')
		var token = $('.popup--hide-games form input[name="xsrf_token"]').val()

		// hide or unhide the game
		if (id && token) {
			if (closest.hasClass('BarefootMonkey-hidden')) {
				update_filter(id, token, 'remove_filter', '/ajax.php', 'BarefootMonkey-hidden', 'BarefootMonkey-unhiding', null)
			} else if (!closest.hasClass('BarefootMonkey-unhiding') && !closest.hasClass('BarefootMonkey-hiding')) {
				update_filter(id, token, 'hide_giveaways_by_game_id', '/ajax.php', null, 'BarefootMonkey-hiding', 'BarefootMonkey-hidden')
			}
		}
	}

	event.stopPropagation()
}

setTimeout(function() {
	
	// remove existing click handlers
	unsafeWindow.$('.giveaway__icon.giveaway__hide').off('click')
	
	// handle clicking on hide button
	$('.giveaway__icon.giveaway__hide')
	.removeClass('trigger-popup')
	.click(callback)

	// observe DOM tree mutations to improve compatibility with endless scrolling userscripts
	var container = document.querySelector('.page__outer-wrap>.page__inner-wrap>.widget-container>.sidebar+div')
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			var added = mutation.addedNodes
			for (var i = 0; i < mutation.addedNodes.length; i += 1) {
				var node = $(mutation.addedNodes[i])

				node.find('.giveaway__icon.giveaway__hide')
				.off()
				.click(callback)
			}
		});
	});
	observer.observe(container, {childList:true});

}, 10)
