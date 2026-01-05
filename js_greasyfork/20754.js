// ==UserScript==
// @name        Spacecat Simulator 2016 (steamgifts.com)
// @namespace   Barefoot Monkey
// @description Makes the "You won a new gift" popup appear even if you haven't won anything
// @include     https://www.steamgifts.com/
// @include     https://www.steamgifts.com/giveaways/search*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20754/Spacecat%20Simulator%202016%20%28steamgiftscom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20754/Spacecat%20Simulator%202016%20%28steamgiftscom%29.meta.js
// ==/UserScript==


// add background
var bg = $('<div style="background-color: rgb(60, 66, 77); position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px; opacity: 0.85; z-index: 9998; cursor: pointer;" class="b-modal __b-popup1__"></div>').appendTo(document.body)

// add spacecat
var popup = $('<div class="popup popup--gift-received"> <img src="https://cdn.steamgifts.com/img/cat/default.gif"> <p class="popup__heading"><span class="popup__heading__bold">Congratulations!</span><br>You won a new gift.</p> <a href="#" class="form__submit-button"><i class="fa fa-arrow-circle-right"></i> View Gift</a> <p class="popup__actions"> <span class="b-close">Close</span> </p> </div>').appendTo(document.body)
popup.find('a.form__submit-button').click(function(event) {
	event.stopPropagation()
	event.preventDefault()
	alert('Sorry, this is just a simulation. No new gifts for you, unless you\'re lucky and there\'s another spacecat hiding under this one :3')
})

popup.css({
	position: 'absolute',
	display: 'block',
	opacity: 1,
	'z-index': 9999,
	top: window.scrollY + 0.41*(window.innerHeight - popup.outerHeight()),
	left: window.scrollX + 0.5*(window.innerWidth - popup.outerWidth())
})

function close() {
	popup.fadeOut(500, popup.remove.bind(popup))
	bg.fadeOut(500, popup.remove.bind(bg))
}

bg.click(close)
popup.find('.b-close').click(close)

function move_popup(event) {
	popup.stop().animate(
		{
			top: window.scrollY + 0.48*($(window).height() - popup.outerHeight()),
			left: window.scrollX + 0.5*($(window).width() - popup.outerWidth())
		}, 500
	)
}

$(document).scroll(move_popup)
$(window).resize(move_popup)
