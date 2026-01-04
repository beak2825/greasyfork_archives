// ==UserScript==
// @name           Up
// @author         sw.East
// @description    кнопка "вверх" в ГВД.
// @namespace      https://openuserjs.org/users/chesheerk/scripts
// @homepageURL    https://www.heroeswm.ru/pl_info.php?id=3541252
// @supportURL     https://www.heroeswm.ru/pl_info.php?id=3541252
// @version        0.3
// @icon           http://i.imgur.com/GScgZzY.jpg
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @include        *//*.heroeswm.*/*
// @include        *//178.248.235.15/.php*
// @include        *//*.lordswm.*/*
// @grant          GM_addStyle
// @copyright      2013-2018, sw.East (https://www.heroeswm.ru/pl_info.php?id=3541252)
// @license        MIT
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/375537/Up.user.js
// @updateURL https://update.greasyfork.org/scripts/375537/Up.meta.js
// ==/UserScript==

/** === Style === */
GM_addStyle ( `

    #up {
        background: none;

        border: 7px solid #7D614C;
        border-radius: 50%;

        margin: 0 auto;
        padding:5px;

        height:7px;
        width:100px;

        outline:none;
        text-decoration: none;

        display:none;
        right: -15;
        bottom: 50%;
        position: fixed;
    }
	.round {
        background: #44372C;
        background: -webkit-radial-gradient(center, #A16A31, #16130E);
        background: -moz-radial-gradient(center, #A16A31, #16130E);
        background: radial-gradient(ellipse at A16A31, #A18031, #16130E);

		border: 4px solid #CC9A2B;
		border-radius: 50%;

		display: block;
		position: absolute;
		left: 10;
		bottom: -25;

        margin:0 auto;
        padding:0;

        height:60px;
        width:60px;

        cursor:pointer;
		text-decoration: none;
		text-align: center;
		z-index: 2;

 box-shadow: 0 1px 4px rgba(0, 0, 0, .3), -23px 0 20px -23px rgba(0, 0, 0, .8), 23px 0 20px -23px rgba(0, 0, 0, .8), 0 0 40px rgba(0, 0, 0, .1) inset;
	}

	.round:hover {

        background:                                                          rgba(91, 61, 51, 1.0);
        background: -webkit-radial-gradient(top left, rgba(91, 61, 51, 1.0), rgba(22, 19, 14, 1.0));
        background:    -moz-radial-gradient(top left, rgba(91, 61, 51, 1.0), rgba(22, 19, 14, 1.0));
        background:         radial-gradient(top left, rgba(91, 61, 51, 1.0), rgba(22, 19, 14, 1.0));

-webkit-box-shadow: inset 5px 5px 12px -7px rgba(0,0,0,0.75);
   -moz-box-shadow: inset 5px 5px 12px -7px rgba(0,0,0,0.75);
        box-shadow: inset 5px 5px 12px -7px rgba(0,0,0,0.75);

		z-index: 2;
		border-radius: 50%;

		-webkit-transform: rotate(-360deg);
		   -moz-transform: rotate(-360deg);
		     -o-transform: rotate(-360deg);
		        transform: rotate(-360deg);
	}

.ts {
	display: block;
	position: absolute;
	left: 15;
	top: 20;

	font-family: Arial;
	font-size: 20px;
	font-weight: bold;

	color: #CC9A2B;

	text-shadow:
		-0   -1px 3px #201712,
		 0   -1px 3px #201712,
		-0    1px 3px #201712,
		 0    1px 3px #201712,
		-1px -0   3px #201712,
		 1px -0   3px #201712,
		-1px  0   3px #201712,
		 1px  0   3px #201712,
		-1px -1px 3px #201712,
		 1px -1px 3px #201712,
		-1px  1px 3px #201712,
		 1px  1px 3px #201712,
		-1px -1px 3px #201712,
		 1px -1px 3px #201712,
		-1px  1px 3px #201712,
		 1px  1px 3px #201712;
}

` );

/* Style End */

    $(document).ready(function(){

        // крепим элемент позади меню
        $('#breadcrumbs').append('<div id="up" class="hvr-box-shadow-inset"><div class="round hvr-box-shadow-inset"><span class="ts">Up</span></div></div>');

        /** При прокрутке страницы, показываем или срываем кнопку */
        $(window).scroll(function () {
            // Если отступ сверху больше 50px то показываем кнопку "Наверх"
            if ($(this).scrollTop() > 50) {
                $('#up').fadeIn();
            } else {
                $('#up').fadeOut();
            }
        });

        /** При нажатии на кнопку мы перемещаемся к началу страницы */
        $('#up').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    });