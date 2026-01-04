   // ==UserScript==
// @name         Custom Twitter Notifications
// @namespace    null
// @version      0.6
// @description  null
// @author       You
// @match        https://mobile.twitter.com/notifications
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370663/Custom%20Twitter%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/370663/Custom%20Twitter%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';	
	
	function checkUpdate()
	{
	    if ($('section > div > div > div > div > article > div > div > svg:not([class="rn-4qtqp9 rn-yyyyoo rn-yucp9h rn-dnmrzs rn-bnwqim rn-m6rgpd rn-lrvibr"])').length && $('div[class="rn-1oszu61 rn-84x3in rn-qklmqi rn-1efd50x rn-14skgim rn-rull8r rn-mm0ijv rn-13yce4e rn-fnigne rn-gxnn5r rn-deolkf rn-1adg3ll rn-eqz5dr rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-ifefl9 rn-bcqeeo rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bnwqim rn-1lgpqti"] > div[class="rn-1oszu61 rn-1efd50x rn-14skgim rn-rull8r rn-mm0ijv rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-1loqt21 rn-6koalj rn-1pxmb3b rn-7vfszb rn-eqz5dr rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-ifefl9 rn-bcqeeo rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bnwqim rn-o7ynqc rn-1j63xyz rn-1lgpqti"]').length)
        {
           filterTweets();
        }
	}
	
	/*
	rn-1oszu61 rn-1efd50x rn-14skgim rn-rull8r rn-mm0ijv rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-1loqt21 rn-6koalj rn-1pxmb3b rn-7vfszb rn-eqz5dr rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-ifefl9 rn-bcqeeo rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bnwqim rn-o7ynqc rn-1j63xyz rn-1lgpqti
	*/
    function filterTweets()
	{ 
	    $('section > div > div > div > div > article > div > div > svg:not([class="rn-4qtqp9 rn-yyyyoo rn-yucp9h rn-dnmrzs rn-bnwqim rn-m6rgpd rn-lrvibr"])').parent().parent().parent().parent().css("display", "none")
		$('div[class="rn-1oszu61 rn-84x3in rn-qklmqi rn-1efd50x rn-14skgim rn-rull8r rn-mm0ijv rn-13yce4e rn-fnigne rn-gxnn5r rn-deolkf rn-1adg3ll rn-eqz5dr rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-ifefl9 rn-bcqeeo rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bnwqim rn-1lgpqti"] > div[class="rn-1oszu61 rn-1efd50x rn-14skgim rn-rull8r rn-mm0ijv rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-1loqt21 rn-6koalj rn-1pxmb3b rn-7vfszb rn-eqz5dr rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-ifefl9 rn-bcqeeo rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bnwqim rn-o7ynqc rn-1j63xyz rn-1lgpqti"]').parent().css("display", "none")
		
	}
	
	
    setInterval(checkUpdate, 2500);
})();