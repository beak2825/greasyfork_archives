// ==UserScript==
// @name         Italian Lotto
// @namespace    el_professor_italian
// @version      0.2.0
// @description  Make it easy to join and view if you won the Italian Lotto
// @author       El_Profesor
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      italianlotto.eu
// @downloadURL https://update.greasyfork.org/scripts/399515/Italian%20Lotto.user.js
// @updateURL https://update.greasyfork.org/scripts/399515/Italian%20Lotto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // styles
    GM_addStyle( '.il-cont-image{height: 190px;text-align: center;background: url(http://italianlotto.eu/img/stocks.png) left 33px no-repeat; }');
    GM_addStyle( '.il-cont-image:hover{background: url(http://italianlotto.eu/img/stocks-hover.png) left 32px no-repeat; }');
    GM_addStyle( '.il-cont{background: url(http://italianlotto.eu/svg/add-on.svg) 0 0 no-repeat !important; height: 190px !important;}');
    GM_addStyle( '#il-countDown{ background-color: #272B30; font-size: 1rem; margin: 10px 0; padding:5px; text-align: center; color: #fff; display:none; border-radius: 3px;}');
    GM_addStyle( '#il-countDown a{ text-shadow: none; display: block; font-size: 1rem; text-align: center; color: #fff; text-decoration: none;}');
    GM_addStyle( '#italot-content-wrapper{ background-color: #272B30; color: #fff; margin: 5px 0; padding: 10px;border-radius: 3px;}');
    GM_addStyle( '#italot-header-wrapper{ background-color: transparent;  margin: 5px 0;}');
    GM_addStyle( '#italot-header-wrapper  img { width:100%; height: auto; border-radius: 3px;}');
    GM_addStyle( '#italot-content-wrapper h3 { padding: 15px 5px 0 10px;}');
    GM_addStyle( '#italot-content-wrapper #il-countDown{ margin: 5px 0; padding:5px; text-align: center; color: #fff; display:none;}');
    GM_addStyle( '#italot-content-wrapper .table td{ margin: 5px 0; padding: 10px;}');
    GM_addStyle( '#italot-content-wrapper .table { width: 100%; margin-bottom: 1rem; color: #fff;}');
    GM_addStyle( '.table th, .table td {padding: 0.75rem; vertical-align: top; color: #fff; text-align: left; border-top: 1px solid rgba(0,0,0,0.6);');
    GM_addStyle( '#il-countDown .green { color: #62c462; }');

    // global functions
    function pad(num) {
		var s = num + "";
		while (s.length < 2) s = "0" + s;
		return s;
	}
    // page scripts
    if (window.location.href == 'https://www.torn.com/item.php?xid=2346077'){
      $('a#ui-id-10').trigger('click');
        setTimeout(function () {
        var dataID = $("[data-item='206'] [data-action='send'] button");
          $(dataID).trigger('click');
            setTimeout(function () {
                $("[data-item='206'] .action-message.left").trigger('click');
                $("[data-item='206'] input.user-id").val('2346077');
                $("[data-item='206'] input.message").attr('placeholder', 'your 4 digit number');
                $("#ac-all a").trigger('click');
                $("[data-item='206'] input.user-id").focus().trigger('click');
          }, 800);
        }, 800);
    }

    if (window.location.href == 'https://www.torn.com/casino.php'){

        var delimiter = $('.page-head-delimiter').first();
        $('<div id="il-countDown"></div>').insertAfter(delimiter);

        $('<li class="left il-cont-image"><a class="lottery" href="/casino.php?sid=italianlottery">' +
          '<span class="title">ITALIAN LOTTO</span><span class="title-l">LOCKED</span>' +
          '<span class="cont il-cont"><i class="delimiter"></i></a></li>')
            .insertBefore('.games-list .clear');

        var content;

        GM_xmlhttpRequest({
          method: "GET",
          url: "https://italianlotto.eu/api/v1/get_draw_data.php",
          onload: function(response) {
            content = $.parseJSON(response.responseText);
            var utc_time = content.timestamp * 1000;
            var now = new Date().getTime();
            var offset = utc_time - now;
            var x = setInterval(function () {

              if (content.countdownTimestamp) {
		        var timeNow = new Date().getTime() + offset;
		        var distance = (content.countdownTimestamp * 1000) - (timeNow);
		        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		        $("#il-countDown").html('<a href="casino.php?sid=italianlottery">Italian Lotto - Next draw in <span class="green">' + pad(hours) + ':'
			      + pad(minutes) + ':' + pad(seconds) + '</span></a>').css('display', 'block');

		          if (distance < 0) {
			        clearInterval(x);
                    $("#il-countDown").css('display', 'none');
		          }
              }
	        }, 1000);
          }
        }); // end GM_xmlhttpRequest
    }; // end casino.php

    if (window.location.search == '?sid=italianlottery'){
        $(document).attr("title", "Italian Lotto | TORN");
        $('.info-msg-cont').css('display','none');
        $('.content-title > h4').html('Italian Lotto');
        $('.games-list').css('display','none');
        $('.page-head-delimiter.m-top10').css('display','none');
        var delimiter = $('.page-head-delimiter.m-top10').last();
        $('<div id="italot-header-wrapper"><a href="item.php?xid=2346077"><img src="https://italianlotto.eu/img/queeneleanor_david.jpg"></a></div><div id="italot-content-wrapper"><div id="il-countDown"></div><div class="il-table"></div></div>').insertAfter(delimiter);
        $('.tutorial-desc').html('This is the Italian Lotto. You can participate daily at the lotto by sending a Xanax to El Profesor.');

        GM_xmlhttpRequest({
          method: "GET",
          url: "https://italianlotto.eu/api/v1/get_entrees_table.php",
            onload: function(response) {
              content = $.parseJSON(response.responseText);
              $('#italot-content-wrapper > .il-table').html('<h3>Todays entrees</h3>' + content.content);
          }
      });

      GM_xmlhttpRequest({
          method: "GET",
          url: "https://italianlotto.eu/api/v1/get_draw_data.php",
          onload: function(response) {
              console.log('start countdown');
            content = $.parseJSON(response.responseText);
            var utc_time = content.timestamp * 1000;
            var now = new Date().getTime();
            var offset = utc_time - now;
            var countdownTimestamp = content.countdownTimestamp;

            var x = setInterval(function () {

		        var timeNow = new Date().getTime() + offset;
		        var distance = (countdownTimestamp * 1000) - (timeNow);
		        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                  console.log('insert countdown');

		        $("#il-countDown").html("Next draw in <span class='green'>" + pad(hours) + ":"
			      + pad(minutes) + ":" + pad(seconds) + "</span>").css('display', 'block');

		          if (distance < 0) {
			        clearInterval(x);
                    $("#il-countDown").css('display', 'none');
		          }
	        }, 1000);
          }
        }); // end GM_xmlhttpRequest
    }
    // get userid to inform if prize is won (implement later)
    if ( $('#websocketConnectionData').length && GM_getValue('italot_userid') == undefined) {
        var websocketData = $('#websocketConnectionData').html();
        var jsonData = $.parseJSON(websocketData);
        console.log(jsonData.userID);
        GM_setValue('italot_userid', jsonData.userID);
    }
})();