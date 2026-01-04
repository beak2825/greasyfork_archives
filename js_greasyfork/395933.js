// ==UserScript==
// @noframes
// @name          Anistar custom style
// @description	  Тема для сайта anistar
// @author        DygDyg
// @homepage      http://dygdyg.ddns.net
// @include       /^https?://(.*).online-star(.*)\.org/.*$/
// @include       /^https?://(.*)anistar(.*)\.org/.*$/
// @run-at        document-start
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @icon          https://cdn.discordapp.com/attachments/483711805529653268/609561809799872545/favicon2.png
// @require       https://greasyfork.org/scripts/397029-moment-with-locales/code/moment-with-locales.js
// @require       https://greasyfork.org/scripts/397028-moment/code/moment.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_notification
// @grant 		  GM_info
// @grant         GM_registerMenuCommand
// @version       0.47.12
// @namespace https://greasyfork.org/users/303755
// @downloadURL https://update.greasyfork.org/scripts/395933/Anistar%20custom%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/395933/Anistar%20custom%20style.meta.js
// ==/UserScript==




var $ = window.jQuery;
////////////////////////////////

if (GM_getValue('background', null) == null) GM_setValue('background', '');
if (GM_getValue('enable_push', null) == null) GM_setValue('enable_push', false);
if (GM_getValue('torrent_start', null) == null) GM_setValue('torrent_start', false);


var ver_info = '2';
var _label = 'Нововведения:';
var _info = 'Добавил в меню настроке пункты включения пуш уведомлений и автопереключения на вкладку "скачать"';


$(document).ready(function () {
    //menu();
})


var pazl = encodeURIComponent('<svg height="512pt" viewBox="0 -27 512.001 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m448.285156 329.226562 63.714844-63.710937-63.714844-63.714844 10.265625-10.265625c17.761719-17.761718 17.761719-46.660156.003907-64.421875-8.605469-8.601562-20.046876-13.339843-32.214844-13.339843-12.164063 0-23.605469 4.738281-32.207032 13.339843l-10.265624 10.265625-63.714844-63.714844-18.800782 18.804688v29.71875c33.257813 7.925781 58.066407 37.890625 58.066407 73.539062 0 35.652344-24.808594 65.617188-58.066407 73.539063v92.152344h-55.15625l-10.996093 10.996093 84.953125 84.949219 63.714844-63.714843 8.847656 8.851562c17.761718 17.761719 46.660156 17.761719 64.421875 0s17.761719-46.660156 0-64.421875zm0 0"/><path d="m271.316406 331.386719v-90.105469h12.511719c25.121094 0 45.554687-20.433594 45.554687-45.554688 0-25.117187-20.433593-45.550781-45.554687-45.550781h-12.511719v-90.105469h-90.105468v-14.515624c0-25.121094-20.433594-45.554688-45.554688-45.554688-25.117188 0-45.550781 20.433594-45.550781 45.554688v14.515624h-90.105469v90.105469h12.515625c22.039063 0 40.46875 15.730469 44.65625 36.554688 1.816406 2.539062 2.898437 5.640625 2.898437 8.996093 0 3.355469-1.082031 6.457032-2.898437 9-4.1875 20.820313-22.617187 36.554688-44.65625 36.554688h-12.515625v90.105469h90.105469v-14.519531c0-25.117188 20.433593-45.550782 45.550781-45.550782 25.121094 0 45.554688 20.433594 45.554688 45.550782v14.519531zm0 0"/></svg>')

var audio = new Audio();
// https://csscolor.ru Палитра цветов

//Цвет прозрачной "плёнки" на текущем видео
let RGBA1 = "rgba(69, 152, 255, 0.75)";

//Цвет задней подложки
let background2 = "#4a4a4a";
let background1 = "#333333";

//Основной цвет сайта
let MainColor = "#1368d1";




GM_addStyle(`

.b-top-but {
    filter: hue-rotate(310deg);
}

.title_quote, .title_spoiler {
    background: #1368d1 !important;
}

.scriptcode,
.title_quote,
.quote,
.title_spoiler,
.text_spoiler
{
    border-color: transparent !important;
}

.news_header .title_left > a:hover,
.news_text ul a:hover {
    color: #bfbebe !important;
}

    .drowmenu,
    header .menu.active > p,
    header .menu:hover > p,
    header .menu.active > p > span, header .menu:hover > p
    {
        background-color: ${background2} !important;
    }

    small .news .descripts,
    .vide_be > span:hover,
    .vide_be > span.actv,
    .cat_anime.menu_link .tit_sp a,
    .descripts,
    .news_header .tags a,
    body,
    .left-menu ul li a,
    header .menu.active > p > span, header .menu:hover > p > span,
    .cal-list > span:hover, .cal-list > span.active,
    .top-new .janrs,
    .text-s p,
    .left-menu2 ul li a
    {
        color: #ffffff !important;
        text-shadow: -2px 2px 2px #000 !important;
    }

    .icon-clock span,
    .icon-vip span,
    .icon-resp span,
    .icon-chat span,
    .icon-copy span
    {
        filter: hue-rotate(280deg);
    }

    .list-nav ul li,
    .flat_button
    {
        background-color: ${MainColor} !important;
    }

    .torrent .download, torrent .download a
    {
        filter: hue-rotate(90deg) !important;
        background: #ffffff00 url(https://cdn.discordapp.com/attachments/667612136788328478/673252757150367744/tor_down_03.png) no-repeat top left !important;
    }
    .torrent .cont,
    .torrent .info_d
    {
        background:transparent !important;
    }

    .pagenav a,
    .left-panel-bottom,
    .news_header .title_left > a,
    .login_nav2 form input[type=submit],
    .search-block [type="submit"],
    .cal-list,
    .mini_nav li.logout a,
    .anime_status .block_selected .selected-title,
    .status_val::before,
    .news_text ul a,
    .vide_be > span,
    .contain_zerkls span,
    .color_t > span,
    .mirror_video>span,
    .contain_zerkls span,
    .select_config ul li:hover,
    #playlist_pric > span,
    header .menu.active .menu__handle::before,
    header .menu.active .menu__handle::after,
    header .menu.active .menu__handle span,
    header .menu.active > p:hover .menu__handle::before,
    header .menu.active > p:hover .menu__handle::after,
    header .menu.active > p:hover .menu__handle span,
    .panel-bottom-shor .right-panel-bottom > span,
    .mybutton,
    .color_t.com_links_tab a,
    .cat-cal.manga,
    .button_c,
    .berrors,
    .title-3
    {
        background: ${MainColor} !important;
    }

    .main.wrapper.width1200
    {
        background-color: #4a4a4ab0 !important;
    }


    .prefooter ul li a:hover,
    .left-menu2 ul li a:hover,
    #news_set_sort a,
    .autor_nav a,
    .news .descripts a,
    .news_text .descripts a,
    .video_as a,
    .left-menu ul li a:hover,
    .text-s h3,
    .text-s h1,
    .reason,
    .views-icon a,
    .date-icon a,
    .autor-icon a,
    .date-icon,
    .views-icon,
    .news_header .rat_col_new span,
    #alert_pric,
    .alert-title,
    .alert_vip_hd a,
    .close-alert,
    .news_header .title_left .title a,
    .news_header .tags,
    .title-6 span,
    .dle-confirm.ui-dialog-content.ui-widget-content a,
    .as_play_list li:hover .aslist_title,
    .panel-tab a.active-tab,
    .mini_nav ul li a:hover,
    .cal-list > span.active > span,
    .janrs .rate .rating .rat_col_new span,
    .login_nav2 a:hover,
    .cal-list > span:hover > span,
    .cal-list > span.active > span,
    .news_text ul b,
    .plash a,
    .right-anime .row-cyber:hover .col-text,
    .panel-tab a
    {
        text-shadow: -1px 1px 2px #000000 !important;
        color: ${MainColor} !important;
    }

    .top-w .title-top
    {
        text-shadow: 0px 0px 0px #000 !important;
        -webkit-text-stroke: 0.3px #000;
        font-size: 25px;
        color: ${MainColor} !important;
    }


    #alert_pric
    {
        border: ${MainColor}  3px solid !important;
    }

    .selected_form.active-s,
    .as_play_list li.play_as .aslist_title
    {
        background:${RGBA1}!important;
    }

    .list-nav ul li:hover a,
    .icon-vip:hover span,
    .icon-clock:hover span,
    .icon-resp:hover span,
    .icon-chat:hover span,
    .icon-copy:hover span
    {
        background-position: 0px 18px;
        color: ${MainColor} !important;
    }

    .soc,
    a[title="Официальный Telegram канал AniStar об аниме"] img
    {
        height: 0;
        width: 0;
    }

    .logo,
    .width50.float-left.left1 .logo a,
    .vk-top .icon-top:hover,
    .profile-top .icon-top
    {
        /*background: url('https://cdn.discordapp.com/attachments/483711805529653268/609547342256930816/svg-editor-image.svg') no-repeat top left;*/
        filter: hue-rotate(-45deg) brightness(145%) !important;
    }

    /*.logo,
    .width50.float-left.left1 .logo a
    {
        background: url('https://cdn.discordapp.com/attachments/483711805529653268/609548039014711296/logo1.png') no-repeat center;*/
        filter: hue-rotate(-45deg) brightness(145%);
    }*/

    .avatar
    {
        border: 2px solid ${MainColor} !important;
    }

    .vip_traf,
    .button.ui-button.ui-state-default,
    .mini_nav li a:before,
    .rating .unit-rating .current-rating,
    .top-w .janrs .unit-rating,
    .ui-button.ui-state-default
    {
        filter: hue-rotate(-45deg) brightness(145%) !important;
    }

    .panel-tab a
    {
        border-bottom: 3px solid ${MainColor} !important;
    }

    .panel-tab a.active-tab
    {
        border-bottom: 3px solid #FED000 !important;
    }

    .bg-white-main
    {
        backdrop-filter: blur(3px);
    }

    .UCOWisrw0aLVBW9otEVJiZmA0 a,
    .newclasswqasdvsdv .newclasswqasdvsdv2,
    .newclasswqasdvsdv .text_vi_sky,
    #timeout_autoplay,
    .sw_bladeo2,
    iframe#brend_iframe,
    .eapp-telegram-chat-root-layout-component,
    div#TTwitch_remove2
    {
        display: none !important;
    }

    .new_menu {
    background: #00000000 !important;
}

/*Тень для объектов*/
.cal-list,
.search-block,
.new_menu,
.news-list,
#page_wrap,
header,
.left-panel-bottom,
.title_left a,
.list-nav ul
{
    box-shadow: -12px 10px 7px 3px #00000045;
}

`);

function background() {
    GM_addStyle(`
html
{
    background: url(${GM_getValue('background')})  ${background1};
    background-attachment: fixed;
    background-size: 100%;
}

`);
}

background();



$(document).ready(function () {
    $('body').prepend($('<div>', { id: 'pazl', 'data-tooltip': 'Настройки', style: 'filter: grayscale(1);' }).mouseover(function (eventObject) {
        $('#pazl').css({ filter: 'grayscale(0)' })
    }).mouseout(function (eventObject) {
        $('#pazl').css({ filter: 'grayscale(1)' })
    }))
    $('body').prepend($('<div>', { id: 'tooltip' }))


    $("[data-tooltip]").mousemove(function (eventObject) {

        $data_tooltip = $(this).attr("data-tooltip");

        $("#tooltip").text($data_tooltip)
            .css({
                "top": eventObject.pageY + 5,
                "left": eventObject.pageX - 100
            })
            .show();


    }).mouseout(function () {

        $("#tooltip").hide()
            .text("")
            .css({
                "top": 0,
                "left": 0
            });
    }).on('click', () => {
        menu();
    });
});

GM_addStyle(`
#pazl
{
    width: 64px;
    height: 64px;
    position: fixed;
    z-index: 9999999;
    top: 72px;
    right: -3px;
    cursor: pointer;
    transition: filter 0.5s;
    backdrop-filter: blur(3px);
    border-radius: 10px 0px 0px 10px;
    border-style: solid;
    border-color: #1368d1;
    box-shadow: -8px 8px 10px 4px #0000006e;
    background-size: 100%;
    background-color: #ffffff1a;
    background-image: url(https://www.pinclipart.com/picdir/big/413-4136396_clipart-of-cedar-puzzle-icon-png-download.png?width=60&height=60);
}

#tooltip {
    z-index: 999999999;
	position: absolute;
	display: none;
	top:0px;
	left:0px;
	background-color: #000;
	padding: 5px 10px 5px 10px;
	color: white;
	opacity: 0.6;
	border-radius: 5px;
}

.top-w > div,
.top-w > div:hover > a,
.news_avatar img,
.main-cal
{
    box-shadow: -8px 8px 10px 4px #0000006e;
    border-radius: 15px;
    border-color: #054a9e;
}

.top-w > div,
.news_avatar img,
.main-cal
{
/*border-style: solid;*/
}

.top-w > div .timer_cal,
.anime_title_cal
{
    border-radius: 0 0 11px 11px;
    backdrop-filter: blur(1px);
}

div#nextserial {
    border-radius: 0 0 11px 11px;
    bottom: 7px;
    backdrop-filter: blur(1px);
}
`);


$(document).ready(function () {

    $('head').append($('<link rel="shortcut icon" type="image/x-icon"/>').attr('href', "https://cdn.discordapp.com/attachments/483711805529653268/609561809799872545/favicon2.png"));
    //$('#myDiv').remove();

    if (GM_getValue('torrent_start') == true) {
        click = $("#torrent_all");
        if (click.length) click.click();
    } else {

    }


});


//#region Модальное окно //стиль
GM_addStyle(`

#alert {
    background: #000000a3;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23383838' stroke-width='2'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23696969'%3E%3Ccircle cx='769' cy='229' r='8'/%3E%3Ccircle cx='539' cy='269' r='8'/%3E%3Ccircle cx='603' cy='493' r='8'/%3E%3Ccircle cx='731' cy='737' r='8'/%3E%3Ccircle cx='520' cy='660' r='8'/%3E%3Ccircle cx='309' cy='538' r='8'/%3E%3Ccircle cx='295' cy='764' r='8'/%3E%3Ccircle cx='40' cy='599' r='8'/%3E%3Ccircle cx='102' cy='382' r='8'/%3E%3Ccircle cx='127' cy='80' r='8'/%3E%3Ccircle cx='370' cy='105' r='8'/%3E%3Ccircle cx='578' cy='42' r='8'/%3E%3Ccircle cx='237' cy='261' r='8'/%3E%3Ccircle cx='390' cy='382' r='8'/%3E%3C/g%3E%3C/svg%3E");
    backdrop-filter: blur(2px);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 9999999999;
    text-align: center;
}

#window1 {
    background-color: #272727db !important;
    width: 300px;
    /*height: 120px;*/
    border-radius: 4px;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%);
    padding: 10px 10px 10px 10px;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}

.stop-scrolling {
  height: 100%;
  overflow: hidden;
}

.theme_button {
    display: block;
    padding: 7px 16px 8px;
    margin: 5px;
    font-size: 12.5px;
    zoom: 1;
    cursor: pointer;
    white-space: nowrap;
    outline: none;
    font-family: -apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,"Noto Sans Armenian","Noto Sans Bengali","Noto Sans Cherokee","Noto Sans Devanagari","Noto Sans Ethiopic","Noto Sans Georgian","Noto Sans Hebrew","Noto Sans Kannada","Noto Sans Khmer","Noto Sans Lao","Noto Sans Osmanya","Noto Sans Tamil","Noto Sans Telugu","Noto Sans Thai",sans-serif;
    vertical-align: top;
    line-height: 15px;
    text-align: center;
    text-decoration: none;
    background: none;
    background-color: #5181b8;
    color: #fff;
    border: 0;
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}

.theme_button:hover {
    background-color: #3b597b;
}

#button_check_update:hover {
    color: #5181b8;
}

div#test1 {
    text-align: center;
}

div#key {
    text-align: center;
    margin-bottom: 40px;
}

.text {
    width: 290px;
    cursor: default;
    margin: 5px;
    box-sizing: border-box;
    padding: 7px;
    border: none;
    border-radius: 2px;
    display: flex;
    height: 86px;
    resize: none;
    background: #6b6b6bad !important;
    color: white;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}

div#image {
    width: 290px;
    height: 180px;
    margin: 0 auto;
    margin-bottom: 5px;
    border-radius: 4px;
}

div#cont2 {
    text-align: left;
    user-select: none;
}
}


.theme_text_name {
    //cursor: pointer;
    user-select: none;
    font-size: 19px;
    line-height: 25px;
    font-weight: 400;
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: auto;
    margin: -1px 0 -1px -1px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 1px;
    color: #fff;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}

.cont-bottom {
    border-bottom: 1px solid #b5b1b191;
}
img.izo {
    object-fit: cover;
    width: 100%;
    height: 100%;
    background: url(https://sun9-57.userapi.com/c857620/v857620009/18a5fd/uOxmtZm_L2A.jpg);
    background-size: 100%;
    border-radius: 3px;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}


`)

//#endregion
//#region Модальное окно //логика

var newImage;
var on = true;
function menu() {

    $('body').addClass('stop-scrolling').prepend(
        $('<div>', { id: 'alert' }).append(
            $('<div>', { id: 'window1' }).append(
                $('<div>', {
                    class: 'cont-bottom', id: 'cont1', html:
                        [
                            $('<div>', { class: 'theme_text_name', text: 'Установка фона' }),
                            $('<div>', { id: 'image' }).append($('<img>', { class: 'izo', src: GM_getValue('background') })),
                            $('<textarea>', { class: 'text', id: 'text_background', text: GM_getValue('background') }).on('change keyup blur', function (e) {
                                let URLtext = $('#text_background').val();
                                $('#image img.izo').attr('src', URLtext);
                                newImage = URLtext;
                            })
                        ]
                })).append(
                    $('<div>', {
                        class: 'cont-bottom', id: 'cont2', html:
                            [
                                $('<input type="checkbox" id="check_torrent" name="cc" data-tooltip="test"/> Вкладка "скачать" по умолчанию<br />').prop('checked', GM_getValue('torrent_start')),
                                $('<input type="checkbox" id="enable_push" /> Включить пуш уведомления<br />').prop('checked', GM_getValue('enable_push'))
                            ]
                    })
                ).append(
                    $('<div>', { class: 'theme_button', id: 'button_save', style: 'margin-top: 10px;', text: 'Сохранить' }).on('click', () => {
                        newImage = $('#text_background').val();
                        console.log($('#text_background').val());

                        GM_setValue('torrent_start', $('#check_torrent').prop('checked'));
                        GM_setValue('background', $('#text_background').val());
                        GM_setValue('enable_push', $('#enable_push').prop('checked'));

                        $('html').css({ 'background': 'url("' + newImage + '") #2F2F30', 'background-size': '100%', 'background-attachment': 'fixed' });
                        exit_();
                    })).append(
                        $('<div>', { class: 'theme_button', id: 'button_exit', text: 'Закрыть' }).on('click', exit_)).append(
                            $('<div>', { class: 'theme_text_name', id: 'button_check_update', text: 'Проверить обновление' }).on('click', sites_)
                        )
        )
    );
}

function sites_() {
    window.open("https://greasyfork.org/ru/scripts/395933-anistar-custom-style");
}

function exit_() {
    $('#alert').remove();
    $('body').removeClass('stop-scrolling');
}
//#endregion

if (GM_getValue('ver_info', null) == null) GM_setValue('ver_info', '0');

$(document).ready(function () {
    if (GM_getValue('ver_info') != ver_info) {
        info();
        GM_setValue('ver_info', ver_info);
    }

})

function info() {
    $('body').addClass('stop-scrolling').prepend(
        $('<div>', { id: 'alert' }).append(
            $('<div>', { id: 'window1' }).append(
                $('<div>', {
                    class: 'cont-bottom', id: 'cont1', html: [
                        $('<div>', { class: 'theme_text_name', text: GM_info.script.name + ' ' + GM_info.script.version }),
                        $('<div>', { class: 'theme_text_name', text: _label }),
                    ]
                })
            ).append(
                $('<div>', {
                    class: 'cont-bottom', id: 'cont1', html: [
                        $('<div>', { style: 'font-size: 14px; text-align: -webkit-auto;', class: 'theme_text_name', text: _info })
                    ]
                })).append(
                    $('<div>', { class: 'theme_button', id: 'button_exit', text: 'Закрыть' }).on('click', exit_))
        )
    )
}




$(document).ready(function () {
    let news = $('.top-w');
    if (!news.length) return;
    let req = /^\d{2}:\d{2}:\d{2}/i;
    let serialy = [];
    for (let i = 0; news.length > i; i++) {
        let blok = $(news[i]);
        let timer = blok.find('.timer_cal').text().trim();
        if (req.test(timer)) {
            let title = blok.find('.title-top').text().trim();
            let imagePreview = blok.children().css("background-image").replace(/url\(|\)|\"|\'/g, '');
            let link = blok.find('a').attr('href');
            // link = new URL(link)
            // console.log(time, title, imagePreview, link);
            timer = timer.split(':')
            second = parseInt(timer[2]) + (timer[1] * 60) + (timer[0] * 60 * 60);
            enable = true;
            serialy.push({ title, link, imagePreview, timer, second, enable })
        }
    }


    var delay_ = 60 * 1000;
    var enable_ = true;

    if (GM_getValue('enable_push') == true) notification();

    function notification() {
        //$('.title-6').css({ color: '#39f941' });
        $('.title-6').css({ color: '#e91e63' }).text($('.title-6').text() + '(Пуш включены)');

        setInterval(function () {
            if (!serialy.length) return;
            if (GM_getValue('enable_push') == true) {
                for (let i = 0; serialy.length > i; i++) {
                    if (serialy[i].enable == true) {
                        if (serialy[i].second >= 0) {
                            serialy[i].second = serialy[i].second - (delay_ / 1000);
                        } else {
                            audio.src = 'https://cdn.discordapp.com/attachments/667612136788328478/682908205944537088/z_uk-budte-vkontakte-s-no_ostyami.mp3';
                            audio.play();
                            GM_notification({
                                title: 'Вышла новая серия',
                                text: serialy[i].title,
                                image: serialy[i].imagePreview,
                                onclick: function () {
                                    window.open(serialy[i].link);
                                }
                            });
                            serialy[i].enable = false;
                        }
                    }
                }
            }
        }, delay_)

    }

})
