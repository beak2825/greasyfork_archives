// ==UserScript==
// @name         KAT Headers Unified
// @namespace    NotNeo
// @version      0.7.4
// @description  Unifies and improves the headers of both the community and torrent sections of the site. (and makes community pages full width)
// @author       NotNeo
// @match        https://katcr.co/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require  	 https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/371342/KAT%20Headers%20Unified.user.js
// @updateURL https://update.greasyfork.org/scripts/371342/KAT%20Headers%20Unified.meta.js
// ==/UserScript==

(function(){
    var headerShrunkByDefault = "remember"; //yes,no,remember
    var PMCheckInterval = 90000; //in ms

    var url = window.location.href;
    var sessionId;
    var userName;
    var numOfPM;

    if(url.indexOf("/community") > -1) {
        //style
        if(true) {
            addGlobalStyle(`
				#wrapper {
					max-width: 100% !important;
				}

				#header {
					padding-left: 5px;
					position: fixed;
					width: 100%;
					z-index: 100;
				}

				#content_section {
					padding-top: 65px;
				}

				#header div.frame {
					padding-right: 5px;
				}

				#top_section > .forumtitle {
					margin-right: -55px;
				}

				#top_section {
					min-height: 0px;
				}

				#header > .frame > div:last-of-type, #header > .frame > br.clear {
					display: none;
				}

				#menu_nav > li > ul {
					position: fixed;
					border: solid #333 2px;
					width: -moz-min-content;
					width: -webkit-min-content;
				}

				#search_form {
					position: relative;
				}

				#search_form  .input_text {
					max-width: calc(100% - 1350px) !important;
					min-width: 200px;
				}

				.valueBubble {
					display: inline-block;
					height: 7px;
					width: 7px;
					margin-bottom: 7px;
					margin-left: -10px;
					margin-right: -2px;
					font-family: sans-serif;
					color: #fc7208;
					background: #fc7208;
					border: 2px solid #594c2d;
					border-radius: 50%;
					transition: .1s all;
				}

				.valueBubble span {
					position: absolute;
					margin-top: -22px;
					margin-left: 10px;
					font-size: 10px;
				}

				#search-new-button {
					background: 0 0;
					color: #5f5f5f;
					box-shadow: none;
					display: inline-block;
					border: none;
					position: absolute;
					top: 0px;
					right: 12px;
					cursor: pointer;
					padding: 0 !important;
				}

				#search-new-adv-button {
					background: 0 0;
					color: #5f5f5f !important;
					box-shadow: none;
					display: inline-block;
					border: none;
					position: absolute;
					top: 0px;
					right: 33px;
					cursor: pointer;
					padding: 0 !important;
				}

				.columns-2 {
					-webkit-column-count: 2;
					-moz-column-count: 2;
					column-count: 2;
					-webkit-column-gap: 0;
					-moz-column-gap: 0;
					column-gap: 0;
				}

			`);
        }

        function addGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }

        function CalcContentPad() {
            if($("#upshrink").attr("src").split("images/")[1] == "upshrink.png") {
                $("#content_section").prop("style", "padding-top: 165px;");
            }
            else {
                $("#content_section").prop("style", "padding-top: 65px;");
            }
        }

        $("#siteslogan").detach().appendTo('#upper_section');
        $("#main_menu").parent().detach().appendTo("#top_section");

        if(headerShrunkByDefault != "remember") { //if header shrink is "remember", let the site handle it...
            var imgSrc = $("#upshrink").attr("src").split("images/")[1]; //...else get current state
            if((headerShrunkByDefault == "yes" && imgSrc == "upshrink.png") || (headerShrunkByDefault == "no" && imgSrc == "upshrink2.png")) { //...and if the state is wrong...
                $("#upshrink").click(); //...change it
            }
        }

        //remove search tab and add it to main search ba as advanced
        $("#button_search").remove();
        $("#search_form .button_submit").remove();
        $("#search_form .input_text").after('<a id="search-new-adv-button" title="Advanced Search" href="https://katcr.co/show/community/index.php?action=search"><i class="ka ka-settings"></i></a>');
        $("#search_form .input_text").after('<button name="submit" id="search-new-button" title="Search" type="submit"><i class="ka ka-search"></i></button>');


        //GetUserName
        userName = $(".greeting > span").text();

        //Adding/removing/moving header parts
        $("#button_sitemap").remove();
        $("#button_help").remove();
        $("#gallery_torrents").remove();
        $("#menu_nav").prepend(`
			<li>
				<a class="firstlevel" onclick="return false;" href="#"><i class="ka ka-plus"></i> Other</a>
				<ul>
					<li class="topMsg">
						<a href="https://katcr.co/show/community/index.php?action=help">
						<i class="ka ka-idea"></i> Help</a>
					</li>
					<li class="topMsg">
						<a href="https://katcr.co/show/community/index.php?action=sitemap">
						<i class="ka ka-list"></i> Sitemap</a>
					</li>
					<li class="topMsg">
						<a href="https://katcr.co/gallery/movies/page/">
						<i class="ka ka-camera"></i> Gallery</a>
					</li>
				</ul>
			</li>
		`);

        numOfPM = $("#button_pm span.firstlevel strong").text() || 0;//get number of messages
        $("#button_pm").remove();
        $("#menu_nav").append(`
			<li id="button_pm">
				<a class="firstlevel" href="https://katcr.co/show/community/index.php?action=pm">
					<i class="ka ka-message"></i> <span class="valueBubble"><span>`+numOfPM+`</span></span> Messages
				</a>
				<ul class="navigation__sub_items">
					<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=pm;sa=send" class="navigation__link"><i class="ka ka-edit"></i> New message</a></li>
					<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=pm" class="navigation__link"><i class="ka ka-message"></i> Inbox</a></li>
				</ul>
			</li>
		`);

        //Get session id for log out
        sessionId = $("#button_logout a").prop("href").split(";")[1];

        $("#button_logout").remove();
        $("#button_profile").remove();
        $("#menu_nav").append(`
			<li id="button_profile">
				<a class="firstlevel" href="https://katcr.co/user/`+userName+`/profile/"><i class="ka ka-user"></i> `+userName+`</a>
				<ul class="navigation__sub_items" style="right: 45px;">
					<li class="navigation__item"><a href="https://katcr.co/user/`+userName+`/profile/" class="navigation__link"><i class="ka ka-torrent"></i> Torrent Profile</a></li>
					<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=profile" class="navigation__link"><i class="ka ka-community"></i> Forum Profile</a></li>
					<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=profile;area=forumprofile" class="navigation__link"><i class="ka ka-edit"></i> Edit Profile</a></li>
					<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=logout;`+sessionId+`" class="navigation__link">Log out</a></li>
				</ul>
			</li>
		`);

        $("#button_torrents ul").remove();
        $("#button_torrents .firstlevel").prop("href", "https://katcr.co/new/full/");
        $("#button_torrents").append(`
			<ul class="navigation__sub_items columns-2">
				<li class="navigation__item"><a class="navigation__link" href="/category/latest/page/"><i class="ka ka-torrent"></i> Latest</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/movies/page/"><i class="ka ka-film"></i> Movies</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/tv/page/"><i class="ka ka-film"></i> TV</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/music/page/"><i class="ka ka-music-note"></i> Music</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/games/page/"><i class="ka ka-tags"></i> Games</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/books/page/"><i class="ka ka-bookmark"></i> Books</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/new/full/"><i class="ka ka-torrent"></i> FULL</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/applications/page/"><i class="ka ka-settings"></i> Apps</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/anime/page/"><i class="ka ka-film"></i> Anime</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/other/page/"><i class="ka ka-torrent"></i> Other</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/category/xxx/page/"><i class="ka ka-delete"></i> XXX</a></li>
				<li class="navigation__item"><a class="navigation__link" href="/new/"><i class="ka ka-plus"></i> More</a></li>
			</ul>
		`);

        /*$("#upload_torrents").append(`
			<ul class="navigation__sub_items">
				<li class="navigation__item"><a class="navigation__link" href="/remote/bot-upload/authval/info/"><i class="ka ka-idea"></i> REMOTE API</a></li>
			</ul>
		`);*/

        CalcContentPad();
        $("#upshrink").click(CalcContentPad);
    }
    else {//====== Torrent Section =======
        var torrentProfileLink = $(".navigation__item > .navigation__link .kf__user").parent().prop("href");
        try {
            sessionId = $(".navigation__item .navigation__sub_items .navigation__link:contains('Log out')").prop("href").split(";")[1];
        } catch(err){ sessionId = false; };

        $(".navigation__item > .navigation__link .kf__user").parent().parent().find("ul.navigation__sub_items").remove();
        $(".navigation__item > .navigation__link .kf__user").parent().after(`
			<ul class="navigation__sub_items">
				<li class="navigation__item"><a href="`+torrentProfileLink+`" class="navigation__link"><i class="kf__torrent button button--icon-button"></i> Torrent Profile</a></li>
				<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=profile" class="navigation__link"><i class="kf__comments button button--icon-button"></i> Forum Profile</a></li>
				<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=profile;area=forumprofile" class="navigation__link"><i class="kf__gear button button--icon-button"></i> Edit Profile</a></li>
				`+(sessionId ? '<li class="navigation__item"><a href="https://katcr.co/show/community/index.php?action=logout;'+sessionId+'" class="navigation__link">Log out</a></li>' : '')+`
			</ul>
		`);

        $(".navigation__item > .navigation__link .kf__arrow_up").parent().parent().detach().prependTo("#js-scrollfix"); //Move upload to left
        $(".navigation__item > .navigation__link .kf__arrow_up").parent().parent().find("ul.navigation__sub_items").removeClass("columns-2").find("li:last").remove();

        $(".navigation__item > .navigation__link .kf__camera").parent().parent().remove(); //remove gallery
        $("#js-scrollfix").prepend(`
			<li class="navigation__item">
				<a class="navigation__link" onclick="return false;" href="#"><i class="kf__plus"></i> Other</a>
				<ul class="navigation__sub_items">
					<li class="navigation__item">
						<a class="navigation__link" href="https://katcr.co/show/community/index.php?action=help">
						<i class="kf__question button button--icon-button"></i> Help</a>
					</li>
					<li class="navigation__item">
						<a class="navigation__link" href="https://katcr.co/show/community/index.php?action=sitemap">
						<i class="kf__list button button--icon-button"></i> Sitemap</a>
					</li>
					<li class="navigation__item">
						<a class="navigation__link" href="https://katcr.co/gallery/movies/page/">
						<i class="kf__camera button button--icon-button"></i> Gallery</a>
					</li>
				</ul>
			</li>
		`);

        $(".navigation__item > .navigation__link[href='/new/'] .kf__torrent, .navigation__item > .navigation__link[href='https://katcr.co/new/'] .kf__torrent").parent().html('<i class="kf__torrent"></i> Browse Torrents');
        $(".navigation__item > .navigation__link[href='/new/'] .kf__torrent, .navigation__item > .navigation__link[href='https://katcr.co/new/'] .kf__torrent").parent().prop("href", "https://katcr.co/new/full/");
    }

    if(!numOfPM) {
        numOfPM = parseInt($(".valueBubble span").html(), 10);
    }
    if(numOfPM < 1) {
        $(".valueBubble").hide();
    }

    if(PMCheckInterval < 10000) {PMCheckInterval = 10000;}
    setInterval(function() {
        $.ajax({
            method: "GET",
            url: "https://katcr.co/show/community/index.php?action=help",
            dataType: "text"
        }).done(function(data) {
            try {
                let newPMs = parseInt(data.split('id="button_pm"')[1].split('<strong>')[1].split("</strong>")[0], 10);
                $(".valueBubble span").html(newPMs);
                $(".valueBubble").show();
            } catch(err){
                $(".valueBubble").hide();
            };
        });
    }, PMCheckInterval);
})();












