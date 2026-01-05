// ==UserScript==
// @name        	Reddcoin Mintpal Vote
// @description		Reminder for voting on Mintpal
// @namespace		http://www.reddcoin.gift
// @include			https://www.mintpal.com/voting
// @version			1.1.3
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/2718/Reddcoin%20Mintpal%20Vote.user.js
// @updateURL https://update.greasyfork.org/scripts/2718/Reddcoin%20Mintpal%20Vote.meta.js
// ==/UserScript==



// Prerequisites
var $ = unsafeWindow.$;
var jQuery = unsafeWindow.jQuery;

(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      el.apply(this, arguments);
    };
  });
})(jQuery);



// Scroll
$('html, body').animate({
	scrollTop: $("#vote-80").offset().top - (window.innerHeight / 2)
}, 1000);



// Highlight
$('#vote-80 td').css('background', '#51c19a');
$('#vote-80 td').css('font-weight', 'bold');



// Count votes
votes = parseInt (GM_getValue('mintpalVotes', 0));

addVote = function (){
	votes++;
	GM_setValue('mintpalVotes', votes + '');
}



// Bind
readyToStart = false;

$('#vote-80 td:eq(6) a').click(function(){
	readyToStart = true;
});

$('#sucessBox').on('show',function(){
	if (readyToStart){
		readyToStart = false;
		addVote();
		
		countdown = function (minutes, seconds){
			if (minutes > 0 || seconds > 0){
				
				minutesString = (minutes >= 10) ? minutes + '' : '0' + minutes;
				secondsString = (seconds >= 10) ? seconds + '' : '0' + seconds;
				
				window.document.title = minutesString + ':' + secondsString;
				if (seconds > 0){
					seconds--;
				} else {
					minutes--;
					seconds = 59;
				}
				
				setTimeout(function(){
					countdown (minutes, seconds);
				}, 1000);
			} else {
				window.document.title = '~~VOTE AGAIN~~';
				alert ('It\'s time to vote again\nSo far, you have voted ' + votes + ' times');
				window.location.reload();
			}
		}
		
		countdown (59, 59);
	}
});
