// ==UserScript==
// @name         smartsmartschool1.4.1 By ScrapMech
// @author       ScrapMech
// @description  smartschool tool
// @include      https://*.smartschool.be/*
// @exclude      view-source://*
// @exclude      https://*.smartschool.be/index.php?module=Messages&file=composeMessage&*
// @exclude      https://*.smartschool.be/Upload/*
// @exclude      https://wopi2.smartschool.be/*
// @version      1.4.1
// @grant        none
// @copyright    2022+
// @namespace schoolsmart

// @downloadURL https://update.greasyfork.org/scripts/451638/smartsmartschool141%20By%20ScrapMech.user.js
// @updateURL https://update.greasyfork.org/scripts/451638/smartsmartschool141%20By%20ScrapMech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urll = window.location.href.toString();
    let url2 = urll.indexOf("smartschool.be");
    urll = urll.slice(0,url2-1);
    urll = urll.replace("https://","");
    console.log("link:" + urll);
    let myStorage = window.localStorage;
    if(localStorage.getItem("commus")==null)
    {
        localStorage.setItem("commus","anthem");
    }
    var theme = localStorage.getItem("theme");



    var playing=true;
    var myFunctions = window.myFunctions = {};
    myFunctions.showhide = function ()
    {
        $(".prioriteit").toggle();
        $(".smscMain").toggle();
    };
   let audio = new Audio('');
    let suka = new Audio('');
    let nazisong = new Audio('');
    let thunder = new Audio("");
    let dubstep = new Audio("");
    let mars = new Audio("");


    myFunctions.entergame = function ()
    {
        alert("coming soon");
    };
    myFunctions.suka = function ()
    {
        suka.play();
    }
    myFunctions.pauseAll=function()
    {
        audio.pause();
        dubstep.pause();
        thunder.pause();
        mars.pause();

    }
    myFunctions.changemusic = function()
    {
     let song = prompt("geef de youtube link van de muziek aub");
     song = "\""+song+"?autoplay=1\"";
     song = song.replace("watch?v=","embed/");
     localStorage.setItem('youtube', song);
     myFunctions.pauseAll();
     location.reload();

    }
    myFunctions.resetmusic = function(){
        alert("als je terug de normale muziek wil moet je dan op toggle music klikken");
        localStorage.setItem('youtube', null);
        localStorage.setItem("music",true);
    location.reload();
    }

    myFunctions.thunderplay = function()
    {

        localStorage.setItem('theme', 'Thunder');

        myFunctions.pauseAll();
        if(localStorage.getItem("youtube"==null))
           {
           thunder.play();
    }


        if(localStorage.getItem("music") == "false")
        {
            thunder.pause();
        }
        $(".prioriteit").css("top","48px");
        $(".prioriteit").hide();
        $('span[style*="color: red"]').css("color","blue");
        $(".topnav").css("background-color","blue");
        $("#msgdetail").css("background-color","#FFFF");
        $("body").css("background-image","url('')");
        $("body").css("background-color","#FFFF");
        $("#homepage__block--administration").css("background-color","#87CEFA");
        $("#folders_parent_td").css("background-color","#FFFF");
        $("#toolbar").css("background-color","#FFFF");
        $("#homepage__block--administration").css("background-color","#FFFF");
        $('.admin').css("background-color","white");
    }

    myFunctions.complay = function()
    {
        localStorage.setItem('theme', 'Com');
        myFunctions.pauseAll();
        if(localStorage.getItem("music")=="true")
        {
            if(localStorage.getItem("commus")=="anthem")
            {
                if(localStorage.getItem("youtube"==null))
           {
                audio.play();
           }
            }

        }
        else if(localStorage.getItem("commus")=="mars")
        {
            mars.play();
        }

        $(".prioriteit").css("top","48px");
        $(".prioriteit").hide();
        $('span[style*="color: red"]').css("color","red");
        $(".topnav").css("background-color","red");
        $("body").css("background-color","#FFFF");
        $("#homepage__block--administration").css("background-color","#FFFF");
        $("body").css("background-image","url('')");
        $("#folders_parent_td").css("background-color","#FFFF");
        $("#msgdetail").css("background-color","#FFFF");
        $("#toolbar").css("background-color","#FFFF");
        $("#homepage__block--administration").css("background-color","#FFFF");
        $('.admin').css("background-color","white");
    }
    myFunctions.dubplay = function()
    {
         localStorage.setItem('theme', 'Nazi');


        $(".prioriteit").css("top","48px");
        $(".prioriteit").hide();
        $(".topnav").css("background-color","orange");
        $("#msgdetail").css("background-color","white");
        $("body").css("background-image","url('http://getwallpapers.com/wallpaper/full/a/b/8/1164051-top-meme-background-pictures-2560x1440-for-windows.jpg')");
        $("#homepage__block--administration").css("background-color","purple");
        $("#folders_parent_td").css("background-color","white");
        $("#toolbar").css("background-color","white");
        $("#homepage__block--administration").css("background-color","white");
        $('.admin').css("background-color","white");
    }
    myFunctions.togglemusic = function ()
    {
        if(playing==true)
        {
            myFunctions.pauseAll();
            playing=false;
            localStorage.setItem("music",false);


        }
        else if(playing==false)
        {
            if(localStorage.getItem("theme")=="Thunder")
            {
               thunder.play()
            }
            else if(localStorage.getItem("theme")=="Com")
            {
                if(localStorage.getItem("commus")=="anthem")
                {
                    audio.play();
                }
                if(localStorage.getItem("commus")=="mars")
                {
                    mars.play();
                }
            }
            playing=true;
            localStorage.setItem("music",true);
        }
        else
        {
            alert("error");
        }
    };




    audio.play();
    $(".topnav").append('<div data-profile class="topnav_btn-wrapper" id="jawohl"></div>');
    let kinda = "\"https://"+urll+".smartschool.be/?module=Agenda\""
    let kinda2 = "\"https://"+urll+".smartschool.be/results\""
    $("#jawohl").append('<a href='+kinda+'class="js-btn-home topnav__btn topnav__btn--push-right">Agenda</a>');
    $(".topnav").append('<div data-profile class="topnav_btn-wrapper" id="punten"></div>');
    $("#punten").append('<a href='+kinda2+'class="js-btn-home topnav__btn topnav__btn--push-right">Punten</a>');
    $(".js-btn-notifs").html("<p>Thema's</p>");
    $(".topnav").append('<div data-profile class="topnav_btn-wrapper js-btn-home topnav__btn" id="grepolis">Tetris</div>');
    $("#grepolis").on("click",myFunctions.showhide);
    //document.createElement("header");
    $("body").append('<iframe src="https://www.htmltetris.cz" width="100%" height="500%" class="prioriteit"></iframe>');
    $(".prioriteit").css("top","48px");
    $(".prioriteit").hide();

    $(".topnav").css("background-color","red");
    $("body").css("background-color","#FFFF");
    $("#homepage__block--administration").css("background-color","#FFFF");


    $("#folders_parent_td").css("background-color","FFFF");
    $("#toolbar").css("background-color","#FFFF");
    $("#homepage__block--administration").empty();
    $("#homepage__block--administration").append('<div class=admin>enter hidden game</div>');
    $("#homepage__block--administration").append('<div class=admin>toggle music</div>');
    $("#homepage__block--administration").append('<div class=admin>change nickname</div>');
    $("#homepage__block--administration").append('<div class=admin>change music</div>');
    $("#homepage__block--administration").append('<div class=admin>reset music</div>');
    $("#homepage__block--administration").append('<p>deze opties zijn eenmalig en slaan (nog) niet op, als je muziek NIET speelt ga dan naar youtube, klik een video aan en unmute je geluid :)</p>');
    $(".admin:nth-of-type(1)").on("click",myFunctions.entergame);
    $(".admin:nth-of-type(4)").on("click",myFunctions.changemusic);
    $(".admin:nth-of-type(2)").on("click",myFunctions.togglemusic);
    $(".admin:nth-of-type(3)").on("click",myFunctions.nickname);
    $(".admin:nth-of-type(5)").on("click",myFunctions.resetmusic);

    //$(".admin:nth-of-type(5)").on("click",myFunctions.download);
    $('.admin').css("background-color","white");
    $('.admin').css("color","white");
    $('.admin').css("padding","1px");
    $("#homepage__block--administration").css("text-align","center");
    $("#msgdetail").css("background-color","#FFFF");
    $(".topnav__menu--notifs").html("");
    $(".topnav__menu--notifs").html("<button id='thunder'>Blue</button><button id='communism'>Orange</button><button id='memes'>yellow</button>");
    $("#thunder").on("click", myFunctions.thunderplay);
    $("#communism").on("click", myFunctions.complay);
    $("#memes").on("click", myFunctions.dubplay);
     if(theme=="Thunder")
    {
        myFunctions.thunderplay();
    }
    else if(theme=="Com")
    {
        myFunctions.complay();
    }
    if(theme=="Nazi")
    {
        myFunctions.dubplay();
    }
let linkje= localStorage.getItem("youtube");
    if(linkje==null){

    }
    else{
        myFunctions.pauseAll();
        $('body').append('<iframe width="1" height="1" id="youtube" allow="autoplay" src='+linkje+'></iframe>');
    }
    //jonathan dhoop

})();