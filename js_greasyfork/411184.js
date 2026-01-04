// ==UserScript==
// @name         [DP] PlanetDP Forum Konuları
// @description  Planetdp portaldaki yapım sayfalarına forumdaki ilgili konuları ekler.
// @version      1.1
// @author       nht.ctn
// @namespace    https://github.com/nhtctn
// @icon         data:image/png;base64,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

// @include      *://planetdp.org/title/*
// @include      *://www.planetdp.org/title/*

// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue

/* global $ */
// @downloadURL https://update.greasyfork.org/scripts/411184/%5BDP%5D%20PlanetDP%20Forum%20Konular%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/411184/%5BDP%5D%20PlanetDP%20Forum%20Konular%C4%B1.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    // Bir sayfa için çekilen verinin ne kadar zamanda bir tazeleneceği [X, milisaniye / saniye / dakika / saat / gün / hafta / ay / yıl]
    var cacheTime = millisecondConverter(1, "saat");
    // Yanıt sayısı ve açılma tarihini gösterip göstermeme. [true / false]
    var detailOpt = true;
	// Yapımın sadece bahsedildiği konuları gösterip göstermeme. [true / false]
	var metionOpt = true;


    // Geliştirme için notlar: ===============================
    // Şablon için: document.querySelector('.ipsComposeArea_dummy').click();
    // =======================================================


    // Yapım türü ve forum id eşleştirmesi.

    // Bilgiler:       type: Sohbet, Çeviri, Çeviri İstek, Aktivite
    //                 ft:   forum, topic
    //                 url:
    //                 main: Film, Dizi
    //                 sub:  Genel, Uzak Doğu, Anime, Belgesel, Yerli, DpID -// Portalda önerdiğim sistem de buydu bu arada :/ DpID hariç tabii.

    var forum = [
		// Sinema
		{type: "Sohbet", ft: "topic", id: 14,  title: "Bugün Hangi Filmi İzlediniz?",         url: "14-bugün-hangi-filmi-izlediniz/",           main: ["Film"], sub: ["Genel", "Uzak Doğu", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 15,  title: "Sinema Haberleri",                     url: "15-sinema-haberler/",                       main: ["Film"], sub: ["Genel", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 236, title: "Asya Film Haberleri",                  url: "236-asya-film-haberleri/",                  main: ["Film"], sub: ["Uzak Doğu"]},
		{type: "Sohbet", ft: "forum", id: 17,  title: "Vizyondaki Filmler",                   url: "17-vizyondaki-filmler/",                    main: ["Film"], sub: ["Genel", "Yerli", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 18,  title: "Gelecek Program, Pek Yakında",         url: "18-gelecek-program-pek-yakında/",           main: ["Film"], sub: ["Genel", "Yerli", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 19,  title: "Gösterimden Kalkan Filmler Arşivi",    url: "19-gösterimden-kalkan-filmler-arşivi/",     main: ["Film"], sub: ["Genel", "Uzak Doğu", "Yerli", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 224, title: "TV Filmleri",                          url: "224-tv-filmleri/",                          main: ["Film"], sub: ["Genel", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 20,  title: "Film İncelemeleri",                    url: "20-film-incelemeleri/",                     main: ["Film"], sub: ["Genel", "Uzak Doğu", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 28,  title: "Yerli Film İncelemeleri",              url: "28-yerli-film-incelemeleri/",               main: ["Film"], sub: ["Yerli"]},
		{type: "Sohbet", ft: "forum", id: 21,  title: "Eleştiri & Yorum",                     url: "21-eleştiri-yorum/",                        main: ["Film"], sub: ["Genel", "Yerli", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 22,  title: "Unutulmazlar",                         url: "22-unutulmazlar/",                          main: ["Film"], sub: ["Genel", "Yerli", "Belgesel"]},

		// Dizi
		{type: "Sohbet", ft: "topic", id: 17,  title: "Bugün Hangi Dizi ve Dizi Bölümlerini İzlediniz?", url: "17-bugün-hangi-dizi-ve-dizi-bölümlerini-izlediniz/", main: ["Dizi"], sub: ["Genel", "Uzak Doğu", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 151, title: "Gösterimi Devam Eden Diziler",         url: "151-gösterimi-devam-eden-diziler/",         main: ["Dizi"], sub: ["Genel", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 238, title: "Asya Dizileri",                        url: "238-asya-dizileri/",                        main: ["Dizi"], sub: ["Uzak Doğu"]},
		{type: "Sohbet", ft: "forum", id: 32,  title: "Yerli Diziler",                        url: "32-yerli-diziler/",                         main: ["Dizi"], sub: ["Yerli"]},
		{type: "Sohbet", ft: "forum", id: 152, title: "Gelecek Dönemde Yayınlanacak Diziler", url: "152-gelecek-dönemde-yayınlanacak-diziler/", main: ["Dizi"], sub: ["Genel", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 237, title: "Gelecek Asya Dizileri",                url: "237-gelecek-asya-dizileri/",                main: ["Dizi"], sub: ["Uzak Doğu"]},
		{type: "Sohbet", ft: "forum", id: 219, title: "Mini Seriler",                         url: "219-mini-seriler/",                         main: ["Dizi"], sub: ["Genel", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 153, title: "Sonlanmış Diziler",                    url: "153-sonlanmış-diziler/",                    main: ["Dizi"], sub: ["Genel", "Belgesel"]},
		{type: "Sohbet", ft: "forum", id: 226, title: "Final Yapanlar",                       url: "226-final-yapanlar/",                       main: ["Dizi"], sub: ["Genel"]},
		{type: "Sohbet", ft: "forum", id: 227, title: "İptal Edilenler",                      url: "227-iptal-edilenler/",                      main: ["Dizi"], sub: ["Genel"]},
		{type: "Sohbet", ft: "forum", id: 241, title: "Sonlanmış Asya Dizileri",              url: "241-sonlanmış-asya-dizileri/",              main: ["Dizi"], sub: ["Uzak Doğu"]},

		// Diziye Özel Forumlar
		{type: "Sohbet", ft: "forum", id: 126, title: "Agents of S.H.I.E.L.D.",               url: "126-agents-of-shield/",                     main: ["Dizi"], sub: ["dp2235"]},
		{type: "Sohbet", ft: "forum", id: 127, title: "Arrow",                                url: "127-arrow/",                                main: ["Dizi"], sub: ["dp3927"]},
		{type: "Sohbet", ft: "forum", id: 128, title: "Doctor Who",                           url: "128-doctor-who/",                           main: ["Dizi"], sub: ["dp12322"]},
		{type: "Sohbet", ft: "forum", id: 129, title: "Game of Thrones",                      url: "129-game-of-thrones/",                      main: ["Dizi"], sub: ["dp16274", "dp98690"]},
		{type: "Sohbet", ft: "forum", id: 130, title: "Gotham",                               url: "130-gotham/",                               main: ["Dizi"], sub: ["dp17412"]},
		{type: "Sohbet", ft: "forum", id: 131, title: "Homeland",                             url: "131-homeland/",                             main: ["Dizi"], sub: ["dp54404"]},
		{type: "Sohbet", ft: "forum", id: 125, title: "Legion",                               url: "125-legion/",                               main: ["Dizi"], sub: ["dp54351"]},
		{type: "Sohbet", ft: "forum", id: 133, title: "Prison Break",                         url: "133-prison-break/",                         main: ["Dizi"], sub: ["dp35724", "dp35723"]},
		{type: "Sohbet", ft: "forum", id: 134, title: "Shameless",                            url: "134-shameless/",                            main: ["Dizi"], sub: ["dp39406"]},
		{type: "Sohbet", ft: "forum", id: 136, title: "Supernatural",                         url: "136-supernatural/",                         main: ["Dizi"], sub: ["dp42140"]},
		{type: "Sohbet", ft: "forum", id: 137, title: "The Big Bang Theory",                  url: "137-the-big-bang-theory/",                  main: ["Dizi"], sub: ["dp43687"]},
		{type: "Sohbet", ft: "forum", id: 138, title: "The Flash",                            url: "138-the-flash/",                            main: ["Dizi"], sub: ["dp44890"]},
		{type: "Sohbet", ft: "forum", id: 140, title: "True Detective",                       url: "140-true-detective/",                       main: ["Dizi"], sub: ["dp49990"]},
		{type: "Sohbet", ft: "forum", id: 141, title: "The Walking Dead",                     url: "141-the-walking-dead/",                     main: ["Dizi"], sub: ["dp48410", "dp95039"]},
		{type: "Sohbet", ft: "forum", id: 142, title: "The X-Files",                          url: "142-the-x-files/",                          main: ["Dizi"], sub: ["dp48644"]},
		{type: "Sohbet", ft: "forum", id: 143, title: "Westworld",                            url: "143-westworld/",                            main: ["Dizi"], sub: ["dp52252"]},
		{type: "Sohbet", ft: "forum", id: 145, title: "Breaking Bad",                         url: "145-breaking-bad/",                         main: ["Dizi"], sub: ["dp6992"]},
		{type: "Sohbet", ft: "forum", id: 146, title: "Dexter",                               url: "146-dexter/",                               main: ["Dizi"], sub: ["dp11707"]},
		{type: "Sohbet", ft: "forum", id: 147, title: "Friends",                              url: "147-friends/",                              main: ["Dizi"], sub: ["dp15877"]},
		{type: "Sohbet", ft: "forum", id: 148, title: "Lost",                                 url: "148-lost/",                                 main: ["Dizi"], sub: ["dp27780"]},

		// Altyazı
		{type: "Aktivite",     ft: "forum", id: 35,   title: "Türk Sineması Aktiviteleri",    url: "35-türk-sineması-aktiviteleri/",            main: ["Film", "Dizi"], sub: ["Yerli"]},
		{type: "Çeviri İstek", ft: "forum", id: 36,   title: "Çeviri İstek",                  url: "36-çeviri-istek/",                          main: ["Film", "Dizi"], sub: ["Genel", "Uzak Doğu", "Anime", "Belgesel"]},
		{type: "Çeviri İstek", ft: "topic", id: 5929, title: "Sahipsiz Kalmış Diziler",       url: "5929-sahipsiz-kalmış-diziler/",             main: ["Dizi"],         sub: ["Genel"]},
		{type: "Çeviri",       ft: "forum", id: 39,   title: "Film Çevirileri",               url: "39-film-çevirileri/",                       main: ["Film"],         sub: ["Genel"]},
		{type: "Çeviri",       ft: "forum", id: 40,   title: "Dizi Çevirileri",               url: "40-dizi-çevirileri/",                       main: ["Dizi"],         sub: ["Genel"]},
		{type: "Çeviri",       ft: "forum", id: 239,  title: "Anime Film Çevirileri",         url: "239-anime-film-çevirileri/",                main: ["Film"],         sub: ["Anime"]},
		{type: "Çeviri",       ft: "forum", id: 240,  title: "Anime Dizi Çevirileri",         url: "240-anime-dizi-çevirileri/",                main: ["Dizi"],         sub: ["Anime"]},
		{type: "Çeviri",       ft: "forum", id: 42,   title: "Belgesel Çevirileri",           url: "42-belgesel-çevirileri/",                   main: ["Film"],         sub: ["Belgesel"]},
		{type: "Çeviri",       ft: "forum", id: 234,  title: "Asya Film Çevirileri",          url: "234-asya-film-çevirileri/",                 main: ["Film"],         sub: ["Uzak Doğu"]},
		{type: "Çeviri",       ft: "forum", id: 235,  title: "Asya Dizi Çevirileri",          url: "235-asya-dizi-çevirileri/",                 main: ["Dizi"],         sub: ["Uzak Doğu"]},
		{type: "Aktivite",     ft: "forum", id: 43,   title: "Çeviri Aktiviteleri",           url: "43-çeviri-aktiviteleri/",                   main: ["Film", "Dizi"], sub: ["Genel", "Uzak Doğu", "Belgesel"]},
		{type: "Aktivite",     ft: "topic", id: 178,  title: "Anime Çeviri Aktiviteleri",     url: "178-anime-çeviri-aktiviteleri/",            main: ["Dizi"],         sub: ["Anime"]},
		{type: "Aktivite",     ft: "topic", id: 9485, title: "Anime Çeviri Aktiviteleri",     url: "9485-anime-çeviri-aktiviteleri/",           main: ["Film"],         sub: ["Anime"]},

		// Anime
		{type: "Sohbet", ft: "topic", id: 79,  title: "En Son Hangi Animeyi İzlediniz?",      url: "79-en-son-hangi-animeyi-izlediniz/",        main: ["Film", "Dizi"], sub: ["Anime"]},
		{type: "Sohbet", ft: "forum", id: 87,  title: "Anime Gelecek Program",                url: "87-anime-gelecek-program/",                 main: ["Film", "Dizi"], sub: ["Anime"]},
		{type: "Sohbet", ft: "forum", id: 88,  title: "Gösterime Girmiş/Tamamlanmış Animeler",url: "88-gösterime-girmiştamamlanmış-animeler/",  main: ["Film", "Dizi"], sub: ["Anime"]},
		{type: "Sohbet", ft: "forum", id: 89,  title: "Anime İncelemeleri",                   url: "89-anime-incelemeleri/",                    main: ["Film", "Dizi"], sub: ["Anime"]},

		// Animeye Özel Forumlar
		{type: "Sohbet", ft: "forum", id: 91,  title: "One Piece",                            url: "91-one-piece/",                             main: ["Film", "Dizi"], sub: ["dp51902"]},
		{type: "Sohbet", ft: "forum", id: 92,  title: "Naruto",                               url: "92-naruto/",                                main: ["Film", "Dizi"], sub: ["dp31731", "dp31734", "dp55543"]},
		{type: "Sohbet", ft: "forum", id: 93,  title: "Fairy Tail",                           url: "93-fairy-tail/",                            main: ["Film", "Dizi"], sub: ["dp14635"]},
		{type: "Sohbet", ft: "forum", id: 94,  title: "Bleach",                               url: "94-bleach/",                                main: ["Film", "Dizi"], sub: ["dp6299"]},
		{type: "Sohbet", ft: "forum", id: 95,  title: "Meitantei Conan",                      url: "95-meitantei-conan/",                       main: ["Film", "Dizi"], sub: ["dp29551"]},
		{type: "Sohbet", ft: "forum", id: 96,  title: "Gintama",                              url: "96-gintama/",                               main: ["Film", "Dizi"], sub: ["dp16914"]},
		{type: "Sohbet", ft: "forum", id: 97,  title: "Hunter X Hunter",                      url: "97-hunter-x-hunter/",                       main: ["Film", "Dizi"], sub: ["dp19995", "dp19996"]},
		{type: "Sohbet", ft: "forum", id: 221, title: "Universal Century",                    url: "221-universal-century/",                    main: ["Film", "Dizi"], sub: [""]},
		{type: "Sohbet", ft: "forum", id: 222, title: "Paralel Evrenler",                     url: "222-paralel-evrenler/",                     main: ["Film", "Dizi"], sub: [""]},

    ];

    var excludedForum = [
        {type: "archive", id: 117, title: "Deneme",                    url: "117-deneme/"},
    ];

    // Yapım sayfası için gerekli HTML ve CSS'ler.
    var forumHtml = `
<section class="forum_main" id="forumdiv">
    <h1>
        <i class="fa fa-comments" aria-hidden="true"></i> Forum Konuları
        <a id="forumButton">FORUMDA KONU AÇ<i class="fa fa-caret-down" id="caret-down"></i></a>
        <div style="position: relative;">
            <ul class="forum-dropdown unselectable">
            </ul>
        </div>
    </h1>
    <div class="exactTopicContainer"></div>
    <div class="mentionedTopicContainer"></div>
</section>
`;

    var forumCss = `
.forumCol { display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: 1fr; grid-column-gap: 0px; grid-row-gap: 0px; align-items: center; padding: 0 8px; margin-bottom: 3px; border-radius: 2px;}

.div1 { grid-area: 1 / 1 / span 1 / span 3; text-align:left;  align-items: center; padding: 0 4px; display: flex; position: relative;}
.div2 { grid-area: 1 / 4 / span 1 / span 2; text-align:right; align-items: center; padding: 0 4px; }
.div3 { grid-area: 1 / 6 / span 1 / span 1; text-align:right; align-items: center; padding: 0 4px; }

.div2 a, .div3 a { color: inherit; cursor: pointer; }

.colColor:nth-of-type(2n+1) { background-color: #d8d8d8; }
.colColor:nth-of-type(2n) { background-color: #f1efed; }
.colColor:hover { background-color:#ffffe0; }

.topicThumb { height: 50px; width: 50px; margin: 4px 10px 4px 18px; background-size: cover; background-position: center center; }
.defaultThumb_Dizi { background-image: url(https://forum.planetdp.org/uploads/monthly_2018_02/topicthumbnail.png.da974cf5f9ef0f494f4728dff92febde.png); }
.defaultThumb_Film { background-image: url(https://i.ibb.co/MP8wvPJ/film-default2.png); }
#caret-down {font-size: 15px;color: #fff;vertical-align: middle;margin-left: 15px;}

.autor-avatar {
    display: inline-block;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    vertical-align: sub;
    margin: 0 8px 0 0;
    background-size: cover;
    background-position: center center;
}

.forum_main {
    width: 100%;
    float: left;
    background: #fff;
    margin: 30px 0 0 0;
    padding: 25px;
}
.forum_main h1 {
    color: #000;
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 20px 0;
}

.topicUrl {
    display: flex;
    align-items: center;
}
.forumBadge {
    height: 17px;
    border-radius: 4px;
    margin-right: 5px;
    color: white;
    font-weight: 500;
    padding: 0 8px;
    font-size: 10px;
}
.readStatus {
    font-size: 12px!important;
    color: #ff6d00c4;
    position: absolute;
    left: -2px;
    top: 50%;
    transform: translateY(-40%);
}
.readedTopic .readStatus {
    color: #74797dd9;
}
.readedTopic b {
    font-weight: 600;
}

a#forumButton:hover {
    background-color: #ff6d00;
}
a#forumButton {
    background-color: #3f51b5;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    padding: 10px 11px 10px 11px;
    border-radius: 5px;
    float: right;
    margin: -5px 0 0 0;
    cursor: pointer;
}
.forum-dropdown {
    display: none;
    list-style: none;
    position: absolute;
    z-index: 100;
    width: 166px;
    text-align: left;
    right: 0px;
    left: auto;
    top: 6px;
}
.unselectable {
	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
}
.forum-dropdown li {
    height: 32px;
    line-height: 30px!important;
    box-shadow: none;
    border: none;
    margin-top: 1px;
    text-align: center;
    list-style: none;
}
.forum-dropdown > li {
    background-color: #ff6d00;
}
.forum-dropdown > li a {
    font-size: 16px;
    height: 32px;
    color: #fff!important;
    text-decoration: none!important;
    display: block!important;
    cursor: pointer;
    font-weight: 600;
    float: none!important;
    margin: 0!important;
    transform: none!important;
    -webkit-transform: none!important;
    transition: none!important;
    -webkit-transition: none!important;
}
.forum-dropdown > li a:hover {
    text-shadow: 0px 0px 1.5px white;
}
.forum-drop-show {
    display: inherit!important;
}
.forum-dropdown > li > ul {
    display: none;
    flex-direction: column;
    width: max-content;
    right: 0;
    position: absolute;
    z-index: 101;
}
.forum-dropdown > li > ul > li {
    min-width: 180px;
    background-color: brown;
    padding: 0 10px;
}
.sublist-drop-show {
    display: flex!important;
}

/* MOBİL GÖRÜNÜM */
@media only screen and (max-width: 767px) and (min-width: 320px){
    .forum_main {padding: 25px 15px;}
    .forum_main h1 {font-size: 18px !important;}

	.readStatus {display: none!important;}
	.topicThumb {margin: 0 10px 0 0;}
    a#forumButton {padding: 4px 6px 3px 6px; font-size: 12px; margin:auto;}

    .forumCol {display: flex; flex-wrap: wrap; flex-direction: column; align-items: center; padding: 8px; margin-bottom: 3px; width: 100%;}

    .div1 {display: inline-flex; width: 100%; text-align: left;}
    .div2 {display: inline-flex; width: 100%; text-align: end;}
    .div3 {display: inline-flex; width: 100%; text-align: end;}

    #date {display: none;}
    #comments {display: none;}
	.mentionCol #comments {display: block;}
	.mentionCol .div3 {display: none;}

    .aName {flex: auto; margin-right: 10px;}
    .tName {flex: auto; margin-bottom: 5px; font-size: 15px;}
    #autor {font-weight: normal !important;}
    #topicUrl {font-size: 15px;}
    .autor-avatar {box-shadow: 1px 1px 5px black;}
    .forum-dropdown {top: 2px;}
}
`;
    var forumCss_dark = `
.forum_main { background: #2a2a2a!important; }
.forum_main h1 { color: #ccc!important; }

.colColor:nth-of-type(2n+1) { background-color: #14141452!important; }
.colColor:nth-of-type(2n) { background-color: #2e2e2e!important; }
.colColor:hover { background-color: #1b1b1b!important; }
`;

    // HTML ve CSS'leri uygula.
    document.querySelector('section.section-one').insertAdjacentHTML("afterend", forumHtml);
    GM_addStyle(forumCss);
    $('#dpDarkCss').after('<style id="forumCss_dark">' + forumCss_dark + '</style>');
    darkToggle();
    $('#darkSwitchButton').on("click", function() {darkToggle();} );
    function darkToggle() {
        if ($('#dpDarkCss').attr("disabled")) { $('#forumCss_dark').prop("disabled", "disabled"); }
        else { $('#forumCss_dark').prop("disabled", ""); }
    }

    // Butona tıkladığında menüyü aç/kapa
    document.querySelector('#forumButton').onclick = function() {
        document.querySelector('.forum-dropdown').classList.toggle('forum-drop-show');
        this.querySelector('i.fa').classList.toggle('fa-caret-up');
        this.querySelector('i.fa').classList.toggle('fa-caret-down');
    };

    // Buton dışı bir yere tıklandığında menüyü kapa
    window.onclick = function(event) {
        if (!$(event.target).closest('#forumButton').length && !$(event.target).closest('.forum-dropdown').length && document.querySelector(".forum-dropdown.forum-drop-show")) {
            document.querySelector(".forum-drop-show").classList.remove('forum-drop-show');
            var icon = document.querySelector('#forumButton > i.fa');
            icon.classList.toggle('fa-caret-up');
            icon.classList.toggle('fa-caret-down');
        }
        else if (!$(event.target).closest('#sohbet-sublist').length && document.querySelector('#sohbet-sublist + .sublist-drop-show')) {
            document.querySelector('#sohbet-sublist + .sublist-drop-show').classList.remove('sublist-drop-show');
        }
        else if (!$(event.target).closest('#çeviri-sublist').length && document.querySelector('#çeviri-sublist + .sublist-drop-show')) {
            document.querySelector('#çeviri-sublist + .sublist-drop-show').classList.remove('sublist-drop-show');
        }
        else if (!$(event.target).closest('#çeviri-i̇stek-sublist').length && document.querySelector('#çeviri-i̇stek-sublist + .sublist-drop-show')) {
            document.querySelector('#çeviri-i̇stek-sublist + .sublist-drop-show').classList.remove('sublist-drop-show');
        }
        else if (!$(event.target).closest('#aktivite-sublist').length && document.querySelector('#aktivite-sublist + .sublist-drop-show')) {
            document.querySelector('#aktivite-sublist + .sublist-drop-show').classList.remove('sublist-drop-show');
        }
    };

    // PlanetDP, IMDb ve MAL ID'lerini al.
    var malId = document.querySelector( 'h1 span > a[href*="myanimelist.net/anime"]');
    if (malId != null) {
        malId = malId.href.replace( /.+\/anime\/(\/?\d+)/, "$1");
    }
    var imdbId = document.querySelector( 'div.baba_main_right a[href*="imdb.com/title/"]' );
    if (imdbId != null && imdbId.textContent.length > 2) {
        imdbId = imdbId.href.replace( /.+\/title\/tt(\d+)\/?/, "$1");
    }
    var pageUrl = window.location.href;
    var dpId = pageUrl.match( /planetdp\.org\/title\/.+?dp(\d+)/ )[1];

    // Forumda aranacak terimi belirle.
    var searcText = (malId) ? "%22[mal%20type=anime%20id=" + malId + "]%22" : "%22[imdb=tt" + imdbId + "]%22";

    // Yapımın tipini belirle (Temel: Dizi, Film | Alt: Genel, Anime, Drama, Belgesel, Yerli)
    var mainType = (document.querySelector( '[itemprop="copyrightYear"]').parentElement.querySelector('span > span:first-of-type' ).textContent.search("Dizi") >= 0) ? "Dizi" : "Film";
    var countryInfo = document.querySelector( '[itemprop="countryOfOrigin"]' ).textContent.trim();
    var genreInfo = document.querySelector( '[class*="three"] > [class="abd_value"]' ).textContent.trim();
    var subType = null;
    subType = (document.querySelector( 'h1 span > a[href*="myanimelist.net/anime"]') != null) ? "Anime" : subType;
    subType = (countryInfo.search( /(Türkiye)/i ) >= 0) ? "Yerli" : subType;
    subType = (genreInfo.search( /Belgesel/i ) >= 0) ? "Belgesel" : subType;
    subType = (countryInfo.search( /(ABD|İngiltere)/i ) < 0 && genreInfo.search( /Animasyon/i ) < 0 && countryInfo.search( /(Güney Kore|Japonya|Tayland|Çin|Tayvan|Hong Kong)/i ) >= 0) ? "Uzak Doğu" : subType;
    subType = !(subType) ? "Genel" : subType;

    // Cache'de bilgi yoksa istek atan fonksiyonu çalıştır.
	var topicArray = [];
    var topics = [];
    var d = new Date();
    var currentTime = d.getTime();
    var lastUpdateArray = GM_getValue("cache_time");
    var lastUpdateTime = (lastUpdateArray) ? JSON.parse(lastUpdateArray) : 0;

	// Cache yoksa istek at.
    if (lastUpdateTime[dpId] == null) {
        findTopics(searcText);
    }
    else {
		// Cache varsa eski bilgileri alıp yaz.
        topics = JSON.parse( GM_getValue( "exactCache" ) )[dpId];
        placeTopics(topics);
		if (metionOpt) {
        	topics = JSON.parse( GM_getValue( "mentionedCache" ) )[dpId];
        	placeTopics(topics, "mentioned");
		}

		// Cache var ama kodun başında belirtilen cache süresindenden eskiyse yeni istek at.
		if (currentTime - lastUpdateTime[dpId] > cacheTime) {
        	findTopics(searcText);
		}
    }

    // Kütüphanedeki forum ve konuları bu yapımın türlerini kullanarak süz.
    var forumsForThis = [];
    for( let f = 0; f < forum.length; f++ ){
        if ( forum[f].main.includes(mainType) && ( forum[f].sub.includes(subType) || forum[f].sub.includes("dp" + dpId) ) ) {
            forumsForThis.push(forum[f]);
        }
    }

    // Dropdown menüsünün içini doldur.
    makeTypeDropdowns("Sohbet");
    makeTypeDropdowns("Çeviri");
    makeTypeDropdowns("Çeviri İstek");
    makeTypeDropdowns("Aktivite");

    function makeTypeDropdowns(type) {
        var fa = arrayFilter(forumsForThis, "type", type);
        if (fa.length > 0) {
            var id = type.toLowerCase().replace(" ", "-");
            var inside = '';
            var idParams = "&template=yes&dpid=" + dpId + ( (malId) ? "&malid=" + malId : "&imdbid=tt" + imdbId );
            for (let x = 0; x < fa.length; x++) {
                var url = "https://forum.planetdp.org/index.php?/" + (fa[x].ft == "forum" ? "forum/" + fa[x].url + "&do=add" + idParams : "topic/" + fa[x].url + idParams + "/#replyForm");
                inside += '<li><a href="' + url + '" target="_blank">' + fa[x].title + '</a></li>';
            }
            var outside = '<li><a id="' + id + '-sublist">' + type + '</a><ul class="' + id + '-dropdown">' + inside + '</ul></li>';
            document.querySelector('ul.forum-dropdown').insertAdjacentHTML("beforeend", outside);

            // Butona tıkladığında menüyü aç/kapa
            document.querySelector('#' + id + '-sublist').onclick = function() {
                document.querySelector('.' + id + '-dropdown').classList.toggle('sublist-drop-show');
            };
        }
    }

    function findTopics (search, pageNo) {
        // Eğer birden sayfadan fazla sonuç varsa sayfa no'yu belirlemek için "repeat" değişkeni sakla. Bir sayfada 25 sonuç var.
        pageNo = (pageNo == null) ? 1 : pageNo;
        var offset = pageNo*25;
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://forum.planetdp.org/index.php?/search/&q=" + search + "&page=" + pageNo,
                onload: function(response) {
                    var json = response.responseText;
                    var htmlObj = $(json);
                    var page = htmlObj.find('[data-role="resultsArea"]')[0];
                    var lang = htmlObj.find('.ipsMenu_itemChecked button[name="id"]')[0].value == 1 ? "eng" : "tr";

                    // Foruma giriş yapılmadıysa veya bir sorun varsa portala uyarı ekle.
                    if (page == null) {
                        $('.exactTopicContainer').html('Konuların çekilmesi için foruma giriş yapmanız gerekir. Giriş yapmış olmanıza rağmen bunu görüyorsanız bir hata var demektir. Eklenti yazarı ile iletişime geçin.');
                    }

                    // Sonuçları ayıkla.
                    var topics = page.querySelectorAll('.ipsStreamItem_header .ipsStreamItem_title');
                    for (let x = 0; x < topics.length; x++) {
                        // Konunun bilgilerini ayrıştır ve "topicArray" dizisine kaydet.
                        var steamItem = topics[x].closest(".ipsStreamItem_container");
                        topicArray.push({
                            type:      steamItem.querySelector('.ipsStreamItem_header .ipsStreamItem_title.ipsStreamItem_titleSmall') ? "old" : "new",
                            topic:     steamItem.querySelector('h2.ipsStreamItem_title > span.ipsType_break > a').textContent,
                            topic_url: steamItem.querySelector('h2.ipsStreamItem_title > span.ipsType_break > a').href.replace(/\/\&do\=findComment\&comment\=\d+/, ""),
                            topic_id:  steamItem.querySelector('h2.ipsStreamItem_title > span.ipsType_break > a').href.replace(/.+\/topic\/(\d+)-.+/, "$1"),
                            comment_id:steamItem.querySelector('h2.ipsStreamItem_title > span.ipsType_break > a').href.replace(/.+\/\&do\=findComment\&comment\=(\d+)/, "$1"),
                            autor:     steamItem.querySelector('p.ipsStreamItem_status > a[href*="planetdp.org/index.php?/profile/"]').textContent,
                            autor_url: steamItem.querySelector('p.ipsStreamItem_status > a[href*="planetdp.org/index.php?/profile/"]').href,
                            autor_img: steamItem.querySelector('.ipsStreamItem_header > a.ipsUserPhoto > img').src,
                            forum:     steamItem.querySelector('p.ipsStreamItem_status > a[href*="planetdp.org/index.php?/forum/"]').textContent,
                            forum_url: steamItem.querySelector('p.ipsStreamItem_status > a[href*="planetdp.org/index.php?/forum/"]').href,
                            forum_id:  steamItem.querySelector('p.ipsStreamItem_status > a[href*="planetdp.org/index.php?/forum/"]').href.replace(/.+\/forum\/(\d+)-.+\//, "$1"),
                            badge:     steamItem.querySelector('.ipsStreamItem_title .ipsBadge') ? steamItem.querySelector('.ipsStreamItem_title .ipsBadge').textContent : null,
                            badge_clr: steamItem.querySelector('.ipsStreamItem_title .ipsBadge') ? steamItem.querySelector('.ipsStreamItem_title .ipsBadge').style.backgroundColor : null,
                            not_read:  steamItem.querySelector('.ipsItemStatus:not(.ipsItemStatus_read)') ? true : false,
                            posted:    steamItem.querySelector('.ipsItemStatus_posted') ? true : false,
                            thumbnail: steamItem.querySelector('img.ipsImage.ipsStream_image') ? steamItem.querySelector('img.ipsImage.ipsStream_image').src : null,
                            date:      dateTransform(steamItem.querySelector('ul.ipsStreamItem_meta time').title, "dd_month_yyyy", lang),
                            comments:  steamItem.querySelector('ul.ipsStreamItem_meta i.fa-comment') ? steamItem.querySelector('ul.ipsStreamItem_meta i.fa-comment').parentElement.textContent.trim() : "",
                        });
                    }

                    // Yapılan arama ile eşleşen sonuç sayısına bakarak tüm sayfalara bakana kadar isteği tekrarla.
                    var resultNumber = page.querySelector('p.ipsType_sectionTitle').textContent.trim().match(/(\d+)/)[1];
                    if(resultNumber > offset) {
                        findTopics (search, pageNo + 1);
                    }
                    // Tüm sayfalara bakınca cacheye al ve konuları bastır.
                    else {
                        // Yapıma ait konular
                        var exactTopics = arrayIntersection(forum, arrayFilter(topicArray, "type", "new"), "second", "id", "forum_id");

                        // Yapımdan bahsedilen konular (Büyük listenin üstteki süzülmüş hariç kısmı)
                        var mentionedTopics = arrayExclusion(topicArray, exactTopics, "first", "forum_id", "forum_id");
                        mentionedTopics = arrayExclusion(mentionedTopics, excludedForum, "first", "forum_id", "id");

						// Veri tabnalarını al, yoksa yarat.
                        var exactCache = GM_getValue("exactCache");
                        exactCache = (exactCache) ? JSON.parse(exactCache) : [];
                        var mentionedCache = GM_getValue("mentionedCache");
                        mentionedCache = (mentionedCache) ? JSON.parse(mentionedCache) : [];
                        var cache_time = GM_getValue("cache_time");
                        cache_time = (cache_time) ? JSON.parse(cache_time) : [];

						// Veri tabanlarına konuları işle ve kaydet.
                        exactCache[dpId] = exactTopics;
                        mentionedCache[dpId] = mentionedTopics;
                        cache_time[dpId] = currentTime;
                        GM_setValue( "exactCache", JSON.stringify(exactCache) );
                        GM_setValue( "mentionedCache", JSON.stringify(mentionedCache) );
                        GM_setValue( "cache_time", JSON.stringify(cache_time) );

						// Konulara sayfaya bastır.
                        placeTopics(exactTopics);
                        if (metionOpt) {
							placeTopics(mentionedTopics, "mentioned");
						}
                        console.log("Forum topics are refreshed.");
                    }
                }
            });
    }

    // Konuları yapım sayfasındaki HTML'ye yerleştiren fonksiyon.
    function placeTopics(array, isMentioned) {
        if (isMentioned != "mentioned") {
            array = arraySorter( arraySorter(array, "topic_id"), "forum_id" );
        } else {
            array = arraySorter( arraySorter( arraySorter(array, "comment_id", "reverse"), "topic_id" ), "forum_id" );
            array = arrayGroup(array, "topic_id");
        }

        var topicHtml = "";
        for (let x = 0; x < array.length; x++) {
            var a, comment, autorTitle, clss, url, urlThumb, dateTitle;
            if (isMentioned != "mentioned") {
                // Gerekli bilgileri topla.
                a          = array[x];
				clss       = `forumCol colColor`;
				url        = a.topic_url;
                comment    = `<br><span id="comments" class="aName">` + a.comments + `</span>`;
                autorTitle = `Konuyu açan üye`;
                dateTitle  = `Konunun açıldığı tarih`;
            } else {
                // Gerekli bilgileri topla.
                var commentTitle = 'Bahsedenler: ';
                for (let y = 0; y < array[x].length; y++) {commentTitle += (y != 0) ? ', ' + array[x][y].autor : array[x][y].autor;}
                a          = array[x][0];
				clss       = `forumCol colColor mentionCol`;
				url        = `https://forum.planetdp.org/index.php?/search/&q=` + searcText + `&type=forums_topic&item=` + a.topic_id;
                comment    = `<br><a id="comments" class="aName" href="https://forum.planetdp.org/index.php?/search/&q=` + searcText + `&type=forums_topic&item=` + a.topic_id + `" title="` + commentTitle + `" target="_blank">` + array[x].length + ` yanıtta bahsedilmiş</a>`;
                autorTitle = `Son bahseden üye`;
                dateTitle  = `Son bahsedilme tarihi`;
                /* Üste altyazı listesi gibi bir açıklama barı koyup onun üstünden iki kısmı ayıracağım galiba. */
            }
            topicHtml += `
<div class="` + clss + `">
	<div class="div1 ` + (!a.not_read ? `readedTopic` : ``) + `">
		<a href="` + a.topic_url + `/&do=getNewComment" target="_blank" title="İlk okunmamış iletiye git" target="_blank" style="position: relative;">
            <i class="fa fa-` + (a.posted ? 'star' : 'circle' ) + ` readStatus" title="İlk okunmamış iletiye git" target="_blank" goToNew="tooltip" data-placement="top"></i>
			<div class="topicThumb defaultThumb_` + mainType + `" style="` + ( a.thumbnail ? `background-image: url(` + a.thumbnail +`);` : `` ) + `"></div>
		</a>
	    <div>
            ` + (a.badge ? `<a href="https://forum.planetdp.org/index.php?/search/&type=forums_topic&tags=` + a.badge + `&nodes=` + a.forum_id + `" target="_blank">
                <span class="forumBadge" style="background-color:` + a.badge_clr + `" title="Aynı forumda bu etikete sahip diğer konular">` + a.badge + `</span>
            </a>` : ``) + `
            <a href="` + url + `" target="_blank">
                <b>` + a.topic + `</b>
            </a>
        </div>
    </div>
	<div class="div2">
        <span class="tName">
            <a href="` + a.forum_url + `" target="_blank" title="Konunun bulunduğu forum"><b>` + a.forum + `</b></a>` + (!detailOpt ? `` : comment ) + `
        </span>
    </div>
    <div class="div3">
        <span class="aName">
            <a href="` + a.autor_url + `" target="_blank" title="` + autorTitle + `">
                <div class="autor-avatar" style="background-image: url(` + a.autor_img +`);"></div>` + ( !detailOpt ? `</b>` : `<b>`) + `<span id="autor">` + a.autor +`</span></b>
            </a>
            ` + ( !detailOpt ? `` : `<br><span id="date" title="` + dateTitle + `">` + a.date + `</span>` ) + `</span>
    </div>
</div>
`;
        }

        if (isMentioned != "mentioned") {
            topicHtml = (topicHtml == "") ? "Bu yapım için hiçbir konu bulunamadı." : topicHtml;
            document.querySelector('.exactTopicContainer').innerHTML = topicHtml;
        } else {
            // Exact kısmı boşsa onun içini temizle.
            if (document.querySelectorAll('.exactTopicContainer .forumCol').length < 1) {
                document.querySelector('.exactTopicContainer').innerHTML = '';
                topicHtml = (topicHtml == "") ? "Bu yapım için hiçbir konu bulunamadı." : topicHtml;
            }
            document.querySelector('.exactTopicContainer').insertAdjacentHTML("beforeend", topicHtml);
        }
        //document.querySelector( '#forumdiv ' + (isMentioned == "mentioned" ? '.mentionedTopicContainer' : '.exactTopicContainer') ).innerHTML = topicHtml;
        $('[goToNew="tooltip"]').tooltip();
    }

    function millisecondConverter(unit, from, to) {
        var result;
        to = to == null ? "millisecond" : to;
        from = from.replace(/milisaniye/i,"millisecond").replace(/saniye/i,"second").replace(/dakika/i,"minute").replace(/saat/i,"hour").replace(/gün/i,"day").replace(/hafta/i,"week").replace(/^(ay)/i,"month").replace(/yıl/i,"year");
        to = to.replace(/milisaniye/i,"millisecond").replace(/saniye/i,"second").replace(/dakika/i,"minute").replace(/saat/i,"hour").replace(/gün/i,"day").replace(/hafta/i,"week").replace(/^(ay)/i,"month").replace(/yıl/i,"year");
        switch (from) {
            case "millisecond" :
                switch (to) {
                    case "year":    result = Math.round(unit / 31556952000); break;
                    case "month" :  result = Math.round(unit / 2592000000); break;
                    case "week" :   result = Math.round(unit / 604800000); break;
                    case "day" :    result = Math.round(unit / 86400000); break;
                    case "hour" :   result = Math.round(unit / 3600000); break;
                    case "minute" : result = Math.round(unit / 60000); break;
                    case "second" : result = Math.round(unit / 1000); break;
                }
                break;
            case "year":
                switch (to) {case "millisecond": result = unit * 31556952000; break;} break;
            case "month":
                switch (to) {case "millisecond": result = unit * 2592000000; break;} break;
            case "week":
                switch (to) {case "millisecond": result = unit * 604800000; break;} break;
            case "day":
                switch (to) {case "millisecond": result = unit * 86400000; break;} break;
            case "hour":
                switch (to) {case "millisecond": result = unit * 3600000; break;} break;
            case "minute":
                switch (to) {case "millisecond": result = unit * 60000; break;} break;
            case "second":
                switch (to) {case "millisecond": result = unit * 1000; break;} break;
        }
        return result;
    }

    function dateTransform(date, output, lang) {
        var day, month, month_name, month_name_short, year;
        var dateRegex2 = /(\d{4})-(\d{1,2})-(\d{1,2})/; // 2017-04-16T21:16:35Z
        var dateRegex3 = /(\d{1,2})(-|\/)(\d{1,2})(-|\/)(\d{2,4})/; // 11/18/18 00:25 || 11/18/2018 00:25

        if (date.search(dateRegex2) >= 0) {
            day =    Number( dateRegex2.exec(date)[3] ); // 09 => 9
            month =  Number( dateRegex2.exec(date)[2] ); // 03 => 3
            year =   Number( dateRegex2.exec(date)[1] );
        }
        else if (date.search(dateRegex3) >= 0) { //Gün ve ay yer değiştirmiş hal için. Buna bir belirteç eklemek lazım.
            day =    Number( dateRegex3.exec(date)[3] ); // 09 => 9
            month =  Number( dateRegex3.exec(date)[1] ); // 03 => 3
            year =   Number( dateRegex3.exec(date)[5] );
            year = year < 2000 ? 2000 + year : year; // 18 => 2018
        }

        // Ek işlemler
        month_name = lang == "eng" ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month-1] : ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"][month-1];
        month_name_short = ""; // lazım olabilir

        if (output == "dd_month_yyyy") return day + " " + month_name + " " + year;
    }

    function arraySorter(array, objectType, isReverse) {
        var resultArray = [];
        resultArray = array.sort(function(a, b) {
          var x = ( isFinite(a[objectType]) ) ? Number(a[objectType]) : a[objectType].toString().toLowerCase();
          var y = ( isFinite(b[objectType]) ) ? Number(b[objectType]) : b[objectType].toString().toLowerCase();
          if (x < y) {return (isReverse == "reverse" ? 1 : -1);}
          if (x > y) {return (isReverse == "reverse" ? -1 : 1);}
          return 0;
        });
        return resultArray;
    }

    function arrayFilter(array, type, typeValue) {
        var newArray = [];
        for (let x = 0; x < array.length; x++) {
            if (array[x] != null) {
                if (array[x][type] == typeValue) {
                    newArray.push(array[x]);
                }
            }
        }
        return newArray;
    }

    function arrayIntersection(array1, array2, which, attr1, attr2) {
        var resultArray = [];
        for(let o = 0; o < array1.length; o++){
            for (let i = 0; i < array2.length; i++) {
                if ( array1[o][attr1] == array2[i][attr2] ) {
                    if (which == "first") {
						resultArray.push(array1[o]);
					}
					else {
						resultArray.push(array2[i]);
					}
                }
            }
        }
        return resultArray;
    }

    function arrayExclusion(array1, array2, which, attr1, attr2) {
        var resultArray = [];
        if (array1.length == 0 || array2.length == 0) {
            resultArray = (which == "first") ? array1 : array2;
        } else {
            for(let o = 0; o < array1.length; o++){
                for (let i = 0; i < array2.length; i++) {
                    if (array1[o][attr1] == array2[i][attr2]) {
                        break;
                    }
                    else if (i+1 == array2.length) {
                        if(which == "first") {
							resultArray.push(array1[o]);
						}
						else {
							resultArray.push(array2[i]);
						}
                    }
                }
            }
        }
        return resultArray;
    }

    function arrayGroup(array, attr) {
        var resultArray = [];
        var usedIndex = [];
        for(let o = 0; o < array.length; o++){
            if (usedIndex.indexOf(o) < 0) {
                var subArray = [];
                for (let i = 0; i < array.length; i++) {
                    if (array[o][attr] == array[i][attr]) {
                        subArray.push(array[i]);
                        usedIndex.push(i);
                    }
                }
                resultArray.push(subArray);
            }
        }
        return resultArray;
    }

})();