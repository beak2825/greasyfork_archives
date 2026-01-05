// ==UserScript==
// @name         VkXStyle
// @namespace    VK
// @version      0.2.4
// @description  Vk special design
// @author       ProCompTEAM
// @include      https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22633/VkXStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/22633/VkXStyle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    > Внимание! Использование данного кода разрешено только в целях изменения стандартного вида сайта vk.com
    > Изменение и распространение кода без согласования с автором строго запрещено!
    > Помните о статье 146 УК РФ. Нарушение авторских и смежных прав; Подобные статьи есть и в других странах!
    > Пожалуйста, уважайте чужой труд! Спасибо за внимание!!!
    */
    /*
       *** АВТОР: vk.com/kirill_poroh ***
       *** ГРУППА: vk.com/vkstylex ***
       *** Версия: 0.2.4 [-+release+-] ***
    */
    /*
       *====================================================*
       *<| Данный код будет постоянно дополнятся.         |>*
       *<| Все свежие новости публикуются в нашей группе! |>*
       *====================================================*
    */
    //код с синхронизацией свойств
    function relw()
    {
    //*********************************изменение свойств активной страницы*********************************\\
    document.body.style.background = "#fff";
    //настройка левой менюшки
    document.getElementById("ads_left").style.display = "none";
    var avatars = document.getElementsByClassName('people_cell_img');
    var index; for (index = 0; index < avatars.length; ++index) {
        avatars[index].style.borderRadius = "5px"; }
    avatars = document.getElementsByClassName('thumb');
    for (index = 0; index < avatars.length; ++index) {
        avatars[index].style.borderRadius = "2px"; }
    document.getElementsByClassName("left_menu_nav_wrap")[0].style.display = "none";
    var navEvents = document.getElementById("l_nwsf").getElementsByTagName('a')[0];
    navEvents.href = "/feed?section=notifications";
    navEvents.getElementsByClassName("left_label inl_bl")[0].innerHTML = "События";
    //основная часть
    var all = document.getElementsByTagName('DIV');
    for (index = 0; index < all.length; ++index) {
        all[index].style.boxShadow = "none";}
    if(document.getElementById("profile_gifts") !== null)
    document.getElementById("profile_gifts").style.marginTop = "-20px";
    if(document.getElementById("profile_friends") !== null)
    document.getElementById("profile_friends").style.marginTop = "-20px";
    var imgs = document.getElementsByTagName('IMG');
    var imgsi; for (imgsi = 0; imgsi < imgs.length; ++imgsi) {
    if(imgs[imgsi].className != "people_cell_img") imgs[imgsi].style.borderRadius = "2px"; }
    //*****************************************верхняя панель**********************************************\\
    function actTop()
    {
     document.getElementById("page_header_cont").style.width = "0";
     document.getElementById("page_header").style.position = "relative";
     document.getElementById("page_header").style.background = "linear-gradient(to bottom, #4d7198, #6a8cb0)";
     document.getElementById("page_header_cont").style.position = "absolute";
     document.getElementById("page_header_wrap").style.width = "auto";
     document.getElementById("page_header").style.borderRadius = "0 0 10px 10px";
     document.getElementById("page_header").style.margin = "0";
     var leftmarg = document.getElementById("page_layout").offsetLeft;
     document.getElementById("page_header_cont").style.left = (leftmarg-5)+"px";
    }
    var srchEl = document.getElementById("ts_input");
    srchEl.style.width = "215px";
    srchEl.style.borderRadius = "5px";
    srchEl.style.marginLeft = "10px";
    srchEl.style.backgroundImage = "none";
    srchEl.style.backgroundColor = "white";
    var toppEl = document.getElementById("top_profile_link");
    toppEl.style.paddingRight = "10px";
    toppEl.style.marginRight = "20px";
    toppEl.innerHTML = "Профиль";
    var tlogoEl =  document.getElementsByClassName("top_home_logo")[0];
    tlogoEl.style.backgroundImage = "none";
    tlogoEl.innerHTML = '<span style="margin-left:5px;color:white;font-size:18px;font-weight:600;" id="txtlogo">ВК' +
    '<span style="color:#d7e2ec;">онтакте<sup style="font-size:10px;margin-left:3px;">RU</sup></span></span>';
    //иконки музыки и уведомлений
    document.getElementsByClassName("top_nav_btn_icon")[0].style.display = "none";
    document.getElementsByClassName("top_nav_btn_icon")[1].style.display = "none";
    document.getElementById("top_audio_player").style.display = "none";
    document.getElementById("top_profile_link").style.display = "none";
     document.getElementById("top_notify_count").style.display = "none";
    //настройка плеера
    var musicon = document.getElementsByClassName('audio_play');
    for (index = 0; index < musicon.length; ++index) {
        musicon[index].style.borderRadius = "5px"; }
    //******************************устранение конфликтов ui интерфейса***********************************\\
    var page = location.pathname;
    if(page == "/im" || page == "/friends" || page == "/groups" ||
       page == "/apps" || page == "/photos" || page == "/docs")
    {
       actTop();
       document.getElementById("page_header").style.position = "fixed";
       setInterval(function() { //fix бага с левой менюшкой
        if(document.getElementById("side_bar_inner").style.marginTop == "0px")
        document.getElementById("side_bar_inner").style.marginTop = "42px";
       }, 1000);
       //скругление фото в диалогах
        if(page == "/im")
        {
            var npp = document.getElementsByClassName('nim-peer--photo-w');
            for (index = 0; index < npp.length; ++index) {
                npp[index].style.borderRadius = "2px"; }
        }
    } else actTop();
    //***********************************блок для собственных дополнений**********************************\\
    if(document.getElementById("vkstylex") === null) {
    var form = '<div class="top_profile_sep"></div>'+
    '<a class="top_profile_mrow" href="/vkstylex" id="vkstylex">Обновление</a>';
    document.getElementById("top_profile_menu").innerHTML += form; }
    //***surprise***
    function getRandomInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min;}
    if(location.pathname == "/vkstylex") {
        var linkicon = "http://pp.vk.me/c636819/v636819412/2572b/26T1wonbMEw.jpg";
        document.body.style.background = "url("+linkicon+")";
        document.getElementsByClassName("page_block")[0].style.background = "aqua";
        imgs = document.getElementById("page_layout").getElementsByTagName('IMG');
        var imgall; for (imgall = 0; imgall < imgs.length; ++imgall) {
        var randv = getRandomInt(-15, 15);
        imgs[imgall].style.transform = "rotate("+randv+"deg)"; }
     }
     //изменение верхней навигации
     if(document.getElementById("top_exit_link") === null) {
     var elGET = null;//вспомогательный элемент хранения данных
     //перечесление будующих элементов навигации и их установка
     var pplBtn  = '<a id="top_ppl_link" class="top_nav_link" href="/search?c[section]=peoples">люди</a>';
     var groupsBtn  = '<a id="top_grps_link" class="top_nav_link" href="/groups?act=catalog">сообщества</a>';
     var gamesBtn  = '<a id="top_games_link" class="top_nav_link" href="/apps">игры</a>';
     elGET = document.getElementById("top_audio").getAttribute("onmousedown");
     var musBtn  = '<a id="top_mus_link" class="top_nav_link" aria-haspopup="true" href="#" onmoudeover='+
     '"prepareAudioLayer();" accesskey="3" onmousedown="'+elGET+'">музыка</a>';
     var helpBtn = '<a id="top_help_link" class="top_nav_link" href="/help">помощь</a>';
     elGET = document.getElementById("top_logout_link").getAttribute("href");
     var exitBtn = '<a id="top_exit_link" class="top_nav_link" href="'+elGET+'">выйти</a>';
     document.getElementsByClassName("head_nav_item")[3].innerHTML +=
     pplBtn + groupsBtn + gamesBtn + musBtn + helpBtn + exitBtn;
     }
    } /* -скобка окончания основного кода- */
    //********************************при скроллинге страницы мышкой***************************************\\
    function scrollf()
    {
        var sc = window.pageYOffset || document.documentElement.scrollTop;
        if(sc > window.innerHeight) {
            document.getElementById("narrow_column").style.display = "none";
            //если это профиль человека, а не другая страница - смещаем стену
            if(document.getElementById("profile_gifts") !== null)
            document.getElementById("page_body").style.marginRight = "20%";
        } else {
            if(document.getElementById("narrow_column") !== null)
            document.getElementById("narrow_column").style.display = "block";
            document.getElementById("page_body").style.marginRight = "0";
        }
        relw(); //доп.обновление
    }
    //**********************************основные обработчики событий страницы******************************\\
    window.onscroll = scrollf;
    window.onresize = relw;
    window.onload = relw;
    //если на странице происходят какие-либо изменения
    var temp_adr = "none";
    setInterval(function()
    {    
        var adr = location.href;
        if(adr != temp_adr)
            {
                temp_adr = location.href;
                relw();
            }
    }, 800);
    setInterval(function(){ relw(); }, 2500); 
})();