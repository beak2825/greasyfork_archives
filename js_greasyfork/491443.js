// ==UserScript==
// @name         КНОПКА БАБЛО
// @namespace    http://tampermonkey.net/
// @version      2024-02-02.1
// @description  нарисует вам 100000
// @author       You
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491443/%D0%9A%D0%9D%D0%9E%D0%9F%D0%9A%D0%90%20%D0%91%D0%90%D0%91%D0%9B%D0%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/491443/%D0%9A%D0%9D%D0%9E%D0%9F%D0%9A%D0%90%20%D0%91%D0%90%D0%91%D0%9B%D0%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('div.navTabs ul.publicTabs div.hiddenWideUnder.fl_l li div ul.secondaryContent.blockLinksList').append(`
        <a href="#" id="knopka-bablo">
            <span class="forumSearchThreads--Link--Icon" style="color: white !important">БАБЛО</span>
        </a>
    `)

    $('#knopka-bablo').on('click', function(e) {
        e.preventDefault()

        $('head').append(`<link rel="stylesheet" href="/css.php?css=ban_page,lztng_chat2,mmenu_all_v3&style=16&dir=LTR">`)

        $('html').attr('class', '').attr('class', 'Public Cachify LoggedIn NoSidebar Responsive userLanguage--2 hasJs NoTouch HasDragDrop')

        $('.forumSearchThreadsButton._forumSearchThreadsButton').remove()

        $('.breadBoxTop fieldset').hide()

        $('#headerMover').html(`
	<div id="content" class="lzt_ban_page">

	<div class="pageWidth">

		<div class="pageContent">
			<div id="PreviewTooltip"><div class="previewContent"><span class="PreviewContents">Загрузка...</span></div></div>
			<!-- main content area -->



















							<!-- h1 title, description -->





						<!-- main template -->
















<div class="banPageContainer">
	<div class="banPageInfo">

		<img src="https://i.imgur.com/SBWbIOl.gif" width="166" height="150" alt="lzt_ban_page_access_to_the_site_is_denied">
		<div class="title mn-15-0">Доступ к сайту запрещен</div>

		<div>Накрутка баланса</div>



		<a href="https://zelenka.guru/rules/" class="mn-15-0-0 button" target="_blank">
			Правила форума
		</a>

		<a href="market/rules" class="mn-15-0-0 button" target="_blank">
			Правила маркета
		</a>





	</div>

	<div class="bottomContainer">

		<div class="title mn-0-0-15">
			Хотите разблокировать свой аккаунт?
		</div>

		<div class="mn-0-0-30">


				Пополните Ваш баланс на <b>100 000 ₽</b>
				<br>

				<a href="payment/balance/deposit?amount=100+000+%E2%82%BD" class="button mn-15-0-0 OverlayTrigger">
					Пополнить баланс
				</a>



		</div>


		<div class="title mn-0-0-15">
			Остались вопросы?
		</div>
		Обратитесь к <b><span class="username bold"><span class="style3 custom customb">root</span></span></b> по следующим контактам, указав свой никнейм на форуме (<span id="sethereusernameblyat"></span>):
		<br>



				<div class="contacts">

				</div>



	</div>

</div>










		</div>

	</div>

</div>
        `)

        $('#sethereusernameblyat').html($('#NavigationAccountUsername').text())
    })
})();