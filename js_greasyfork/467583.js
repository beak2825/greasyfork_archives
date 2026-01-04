// ==UserScript==
// @name         GC - Neggsweeper better flagging
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  Makes flagging easier
// @author       wibreth
// @match        https://www.grundos.cafe/games/neggsweeper*
// @match        https://grundos.cafe/games/neggsweeper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467583/GC%20-%20Neggsweeper%20better%20flagging.user.js
// @updateURL https://update.greasyfork.org/scripts/467583/GC%20-%20Neggsweeper%20better%20flagging.meta.js
// ==/UserScript==

(function() {
	'use strict';
	GM_addStyle(`
	.flagging img[src="https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/negg.gif"]:hover {
		 content: url("https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/flagnegg.gif")
	}
	#container {
    grid-template-areas:
        'top top aio'
        'side banner aio'
        'side content aio'
        'side event aio'
        'side footer aio';
    grid-template-rows: 44px 72px min-content min-content minmax(0,1fr);
	}
    #page_content {
    margin-top: 16.5px;
    }
    main > p.center:not(.medfont) {
    position: absolute;
    background: var(--bgcolor);
    top: 117px;
    right: 735px;
}`);


	$('#flag_it').on('change', () => {
		let flag = $('#flag_it').prop('checked');
		if (persistent)
			GM_setValue('flag', flag);

		if(flag) {
            $('#neggsweeper_grid').addClass('flagging');
            return;
		}
		$('#neggsweeper_grid').removeClass('flagging');
	});


	$('.bonus_negg').insertAfter('#neggsweeper_grid');

	$(document).keydown(function(e) {
        if (e.which == 88) //x
            $('#flag_it').click();
        if (e.which == 69) //e
            $('input.ns_start:nth-child(3)').click();
        if (e.which == 77) //m
            $('input.ns_start:nth-child(4)').click();
        if (e.which == 72) //h
            $('input.ns_start:nth-child(5)').click();
	});

})();