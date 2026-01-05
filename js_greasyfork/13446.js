// ==UserScript==
// @name         Zakop everywhere
// @namespace    http://www.wykop.pl/
// @version      1.1.0
// @description  dodaje możliwośc zakopania znalezisk sponsorowanych i na głównej
// @author       MirkoStats
// @match        http://www.wykop.pl/wykopalisko/*
// @match        http://www.wykop.pl/strona/*
// @match        http://www.wykop.pl/domena/*
// @match        http://www.wykop.pl/tag/znaleziska/*
// @match        http://www.wykop.pl/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/13446/Zakop%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/13446/Zakop%20everywhere.meta.js
// ==/UserScript==

var main = function() {
	var hash = wykop.params.hash;
	var location = wykop.params.action;
	var highlightZakop = { color : '#FF6A00!important' };
	$("#itemsStream .diggbox:not(:has(.dropdown-show), .digout, .burried, :contains('+'))").each(function() {
		var $this = $(this);
		var id = $this.parent().data('id');
		$this.append($('<a class="dropdown-show sponsorowane" href="#">zakop&nbsp;</a><div class="dropdown fix-dropdown bodyClosable"><div><ul><li><a href="http://www.wykop.pl/ajax2/links/voteDown/'+ id +'/1/hash/'+ hash +'/" class="ajax">duplikat</a></li><li><a href="http://www.wykop.pl/ajax2/links/voteDown/'+ id +'/2/hash/'+ hash +'/" class="ajax">spam</a></li><li><a href="http://www.wykop.pl/ajax2/links/voteDown/'+ id +'/3/hash/'+ hash +'/" class="ajax">informacja nieprawdziwa</a></li><li><a href="http://www.wykop.pl/ajax2/links/voteDown/'+ id +'/4/hash/'+ hash +'/" class="ajax">treść nieodpowiednia</a></li><li><a href="http://www.wykop.pl/ajax2/links/voteDown/'+ id +'/5/hash/'+ hash +'/" class="ajax">nie nadaje się</a></li></ul></div></div>'));
		(location === 'upcoming' ? $('.sponsorowane').css(highlightZakop).html('zakop&nbsp;(s)') : false);
	});
};

var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);