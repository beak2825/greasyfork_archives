// ==UserScript==
// @name:en zFilmHD - Resposive WideScreen Design CSS+JS
// @name zFilm-HD Адаптивный дизайн для больших экранов
// @namespace zFilm-HD Адаптивный дизайн для больших экранов
// @description:en For datalifeEngine TV-Agregators FullPage widescreen design CSS+JS.
// @description Полностью переработанный дизайн веб-сайта адаптированный под разные разрешения экрана. Специально для фанатов портала Zfilm-HD от пользователя bOok1.
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant boOk1
// @include *://*/*
// @resource jqUI_CSS  https://dl.dropbox.com/s/wq50hrk5xv5txah/book1style.css
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @license MIT
// @version 0.1.1.02122022
// @downloadURL https://update.greasyfork.org/scripts/31252/zFilm-HD%20%D0%90%D0%B4%D0%B0%D0%BF%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/31252/zFilm-HD%20%D0%90%D0%B4%D0%B0%D0%BF%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==

let domains = [false,false];
let domain = '';
try{ domains[0] = location.hostname; } catch(e1){ try{ domains[1] = document.domain; } catch(e2){console.error('I am sorry, domain is undefined');} }
if(domains[0]) { domain = domains[0]; } else { domain = domains[1]; }
if(domain.length > 0){
    let header = $('head').first();
    let checkUrls = ['link[rel="search"]','meta[property="og:site_name"]'];
    let target = false;
    for (let i = 0; i < checkUrls.length; ++i) {
        let obj = header.find(checkUrls[0]);
        if(obj.length > 0){
            if(obj.attr('title').indexOf('zFilm-HD') > -1){
                target = true;
                break;
            }
        }
    }
    if(target){
        var jqUI_CssSrc = GM_getResourceText ("jqUI_CSS");
        GM_addStyle (jqUI_CssSrc);

        $( "body" ).prepend( $('<!-- Preloader --><div id="preloader-book1"><div id="status-book1">&nbsp;</div></div><!-- /Preloader -->') );
        /* Preloader */
        $(window).on('load', function() {
            $('#status-book1').fadeOut();
            $('#preloader-book1').delay(250).fadeOut('fast');
            $('body').delay(350).css({'overflow':'visible'});
            $//('html,body').scrollTop($(".book1-poster").offset().top); #iframe_daily
            //$('html,body').animate({scrollTop: 210});
            $('html, body').animate({ scrollTop: $("h1").offset().top}, 250);

        });
        /* end Preloader */

        $(".conteiner .left-material").prependTo($(".conteiner"));

        $( ".left-material" ).append($( "<div class='book1-row'></div>" ));

        $( ".left-material" ).prepend($( "<div class='book1-zvuk'></div>" ));
        $( ".left-material" ).prepend($( "<div class='book1-addit'></div>" ));
        $( ".left-material" ).prepend($( "<div class='book1-rew'></div>" ));
        $( ".left-material" ).prepend($( "<div class='book1-poster'></div>" ));

        $( ".book1-zvuk" ).append($( "<div class='book1-zvuk-h'>Выбрать озвучку</div>" ));
        $( ".book1-addit" ).append($( "<div class='book1-addit-h'>О фильме</div>" ));
        $( ".book1-poster" ).append($( "<div class='book1-poster-h'>Постер и рейтинг</div>" ));

        $( ".book1-zvuk" ).append($( "<div class='book1-zvuk-h2'><span>Развернуть</span></div>" ));
        $( ".book1-addit" ).append($( "<div class='book1-addit-h2'><span>Развернуть</span></div>" ));
        $( ".book1-poster" ).append($( "<div class='book1-poster-h2'><span>Развернуть</span></div>" ));

        $( ".book1-zvuk" ).append($( "<div class='book1-zvuk-c'></div>" ));
        $( ".book1-addit" ).append($( "<div class='book1-addit-c'></div>" ));
        $( ".book1-poster" ).append($( "<div class='book1-poster-c'></div>" ));

        $( ".left-material>.poster-video" ).appendTo($( ".book1-poster-c" )); $( ".book1-poster>.poster-video-c" ).after( '<div class="clear"></div>' );
        $( '.left-material>div[title="Эта информация выводится только для вас."]' ).appendTo($( ".book1-poster-c" ));
        $( ".left-material>.playlist-add-area" ).appendTo($( ".book1-poster-c" )); $( ".book1-poster-c>.playlist-add-area" ).after( '<div class="clear"></div>' );
        $( ".left-material>.section" ).appendTo($( ".book1-poster-c" ));
        $( '.left-material>div[itemtype="http://data-vocabulary.org/Review-aggregate"]' ).appendTo($( ".book1-poster-c" )); //$( '.book1-poster-c>div[itemtype="http://data-vocabulary.org/Review-aggregate"]' ).after( '<hr />' );

        //$(".right-material>article").css('display', 'block !important');
        $(".right-material>article").css("display", "block");
        $("article").prepend($( "<div class='book1-article'></div>" ));
        //<article class="book1-article">
        $( "ul.favbutts" ).appendTo($('.book1-article')); //$( "ul.favbutts" ).appendTo($( ".book1-poster-c" ));
        $( "ul.favbutts" ).after( '<div class="clear"></div>' ); // $( ".book1-poster>ul.favbutts" ).after( '<div class="clear"></div>' );


        var book1okino = parseInt($(".view-info-title").length);
        for (let i = 0; i < book1okino; i++) {
            $( '.left-material .view-info-title:eq('+i+')' ).appendTo($( ".book1-addit-c" ));
            $( '.left-material .view-info-content:eq('+i+')' ).appendTo($( ".book1-addit-c" ));
        }


        $( ".left-material>ul.content-video3" ).appendTo($( ".book1-zvuk-c" ));

        $('.left-material').children().not('.book1-poster, .book1-addit, .book1-zvuk').remove(); $('.pl1, .e991, .podelitca').remove(); $('a[href="#content-video3"]').remove(); $('div.title-full:contains("Случайные кинофильмы")').remove();
        $('div.content> ul.content-video').remove();

        $(".book1-zvuk-c, .book1-addit-c, .book1-poster-c").css("display", "none");

        $(".book1-zvuk-h2, .book1-addit-h2, .book1-poster-h2").click(function () {
            let $header3 = $(this);
            let $content3 = $header3.next();
            $content3.slideToggle(500, function () {
                $header3.text(function () {
                    return $content3.is(":visible") ? "Свернуть" : "Развернуть";
                });
            });
        });

        //$(".poster-video").attr('class', 'poster-video-book1');
        //$('.poster-video:hover').css("opacity", "");
        $(".book1-poster").appendTo(".book1-row");
        $(".book1-addit").appendTo(".book1-row");
        $(".book1-zvuk").appendTo(".book1-row");
        $(".book1-rew").appendTo(".book1-row");
    }
}