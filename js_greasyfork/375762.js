// ==UserScript==
// @name           Up [green]
// @author         sw.East
// @description    кнопка "вверх" в ГВД.
// @namespace      https://openuserjs.org/users/chesheerk/scripts
// @homepageURL    https://www.heroeswm.ru/pl_info.php?id=3541252
// @supportURL     https://www.heroeswm.ru/pl_info.php?id=3541252
// @version        0.3g
// @icon           http://i.imgur.com/GScgZzY.jpg
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @include        *//*.heroeswm.*/*
// @include        *//178.248.235.15/.php*
// @include        *//*.lordswm.*/*
// @grant          GM_addStyle
// @copyright      2013-2018, sw.East (https://www.heroeswm.ru/pl_info.php?id=3541252)
// @license        MIT
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/375762/Up%20%5Bgreen%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/375762/Up%20%5Bgreen%5D.meta.js
// ==/UserScript==

/** === Style === */
GM_addStyle ( `

    #up {
        background: none;

        border: none;

        margin: 0 auto;
        padding:5px;

        height:7px;
        width:100px;

        outline:none;
        text-decoration: none;

        display:none;
        right: -15;
        bottom: 30%;
        position: fixed;
    }
	.round {
        background: #1C1C1C;
        background: -webkit-radial-gradient(center, #1C1C1C, #313131);
        background: -moz-radial-gradient(center, #1C1C1C, #313131);
        background: radial-gradient(ellipse at center, #1C1C1C, #313131);

		border: 4px solid #8bc34a;
		border-radius: 10%;

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

background: #1C1C1C;
background: -webkit-radial-gradient(bottom right, #1C1C1C, #313131);
background: -moz-radial-gradient(bottom right, #1C1C1C, #313131);
background: radial-gradient(bottom right, #1C1C1C, #313131);

-webkit-box-shadow: inset 5px 5px 12px -7px rgba(0,0,0,0.75);
   -moz-box-shadow: inset 5px 5px 12px -7px rgba(0,0,0,0.75);
        box-shadow: inset 5px 5px 12px -7px rgba(0,0,0,0.75);

		z-index: 2;
		border-radius: 10%;

		-webkit-transform: rotate(-360deg);
		   -moz-transform: rotate(-360deg);
		     -o-transform: rotate(-360deg);
		        transform: rotate(-360deg);
	}

.ts {
	display: block;
	position: absolute;
	left: 22;
	top: 11;

font-family: Arial;
	font-size: 30px;
	color: #8BC34A;
	text-shadow:
		-0   -2px 3px #000000,
		 0   -2px 3px #000000,
		-0    2px 3px #000000,
		 0    2px 3px #000000,
		-2px -0   3px #000000,
		 2px -0   3px #000000,
		-2px  0   3px #000000,
		 2px  0   3px #000000,
		-1px -2px 3px #000000,
		 1px -2px 3px #000000,
		-1px  2px 3px #000000,
		 1px  2px 3px #000000,
		-2px -1px 3px #000000,
		 2px -1px 3px #000000,
		-2px  1px 3px #000000,
		 2px  1px 3px #000000,
		-2px -2px 3px #000000,
		 2px -2px 3px #000000,
		-2px  2px 3px #000000,
		 2px  2px 3px #000000,
		-2px -2px 3px #000000,
		 2px -2px 3px #000000,
		-2px  2px 3px #000000,
		 2px  2px 3px #000000;
}

` );

/* Style End */

    $(document).ready(function(){

        // крепим элемент позади меню
        $('#breadcrumbs').append('<div id="up" class="hvr-box-shadow-inset"><div class="round hvr-box-shadow-inset"><span class="ts"> ↑ </span></div></div>');

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