// ==UserScript==
// @name         NcorEdit
// @namespace    http://tampermonkey.net/
//
//
// @version      0.1_nSpring
// @description  try to take over the world!
// @author       RicsiRobi
// @match        https://ncore.pro/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/422298/NcorEdit.user.js
// @updateURL https://update.greasyfork.org/scripts/422298/NcorEdit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    

var bobafett = "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxH5rd9eDAjcFyv45SRYAFMIcKL_PArgVSL403ulRUWEndVKv8hZyECgUkal0H57ukfAQw0PWecGUWv4zkkNGNxKasNriBwGlQv5IljO2Spd2n3A36oQM7c2YXvwg";
var pilóta = "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxH5rd9eDAjcFyv45SRYAFMIcKL_PArgVSL403ulRUWEndVKv8hZ2BBA4kalYF5-r8fAU10fGdcDwUu4rukoTewKXyMOyDwTtT68Yo3uqY99yt3wP6oQM7eCFisXA";
var boba_mando = "https://i.ibb.co/HrSswh1/hatter-proba1.png";
var mandalorianlogo= "https://i.ibb.co/mzMxggk/eredeti-logo-ncore-nagybetu.png";
    var grogufejlec ="https://i.ibb.co/vV004Vq/grogu.png";


    var adatok = {hatterkep: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/1172380/7405b17ea0e60c7d01afa2bfab1486b60701b7f6.jpg', torrentsLogo: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/46b63d3c-ae67-464c-9a37-670829b2a157/dd4dmuy-0fed336c-c58b-4774-ab1f-66ca05043f3f.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNDZiNjNkM2MtYWU2Ny00NjRjLTlhMzctNjcwODI5YjJhMTU3XC9kZDRkbXV5LTBmZWQzMzZjLWM1OGItNDc3NC1hYjFmLTY2Y2EwNTA0M2YzZi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.B8JjeUiVa9i-z3KqbhoZ5aMId3iSpIfd3SCsKTrN7x4', loginLogo: 'https://i.ibb.co/9NGycPm/output-onlinepngtools-16.png', fejlec: "https://i.ibb.co/vV004Vq/grogu.png"};
    adatok.hatterkep = boba_mando; // ITT ADOM MEG MI LEGYEN A HÁTTÉR
    var profilbeallitas = {nSpringKep: adatok.hatterkep, nSpringSzoveg: 'Fallen Order'};
    var tipusok={};
    var kiskepek = {porno: 'https://i.ibb.co/TwQbzK6/pjabba.jpg', hd: 'https://i.ibb.co/pJX3sky/hd-grogupsd.png'};


    <!-- ez alapból kell -------------------------------------------------------------------------------------------------------------------------------
    document.body.style.backgroundImage = "url("+adatok.hatterkep+")"; document.body.style.backgroundAttachment="fixed";
    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------

      if(window.location.href.indexOf("profile.php?")>-1) <!-- Ha a profile.php-ban vagyok
      {
      document.getElementsByClassName("set_style")[3].innerHTML = '"<img src="'+profilbeallitas.nSpringKep+'" width="125" height="85" alt="'+profilbeallitas.nSpringSzoveg+'"> <br> <input type="radio" value="nspring" name="uj_stilus">'+profilbeallitas.nSpringSzoveg;

      }
    <!-- ------------------------COOKIE NÉZŐ ------------------------------------------------
    if(document.cookie.indexOf("nspring")>-1)
        {

        }
    <!-- -----------------------------------------------------------------------------------

        adatok.loginLogo=mandalorianlogo;
    <!-- ------------------------------------------------------------------------------------
     if (window.location.href.indexOf("login") > -1) <!-- LOGIN OLDAL
     {
        var login = document.getElementById("login");
        login.setAttribute('style', "background : transparent");
        document.getElementsByTagName("input")[3].style.border = "#009a93";
        document.getElementsByTagName("input")[3].style.background = "#10176c";
        login.setAttribute('style', "background-repeat : no repeat");
        login.style.backgroundColor = 'transparent';
        login.style.backgroundImage = "url('"+adatok.loginLogo+"')";
        login.style.height = '30px';
        login.style.width = '600px';
        login.style.padding="60% 0 0 90px";
    }
    else
    {
    document.getElementById("fej_fejlec").style.backgroundImage = "url('"+adatok.fejlec+"')";
    }
    <!-- ------------------------------------------------------------------------------------
    if (window.location.href.indexOf("torrents.php") > -1) <!-- LETÖLTÉSEK OLDAL
    {
        //document.getElementsByClassName("box_alap_utolso")[0].remove();
        //for(let i = 0; i < 25; i++) {document.getElementsByClassName("box_feltolto2")[0].remove();}



        var kepek = document.getElementsByTagName("img");
        for(let i = 0; i < kepek.length; i++) <!-- nezzuk at a kepeket
        {
            if(document.getElementsByTagName("img")[i].src.indexOf("xxx") > -1)
            {
               document.getElementsByTagName("img")[i].src = kiskepek.porno;
            }
            else if(document.getElementsByTagName("img")[i].src.indexOf("hd") > -1)
            {
               document.getElementsByTagName("img")[i].src = kiskepek.hd;
            }
        }
    }

    <!-- ----------------REKLÁM ------------------------------------------------------------------------------------------------------------------------ -->
            if(window.location.href.indexOf("torrents.php")>-1)
    {
        document.getElementsByTagName("img")[8].remove();
        document.getElementsByTagName("center")[3].remove();
        console.log("Sikeres remove 136.sor");
        document.cookie="adblock_stat=0 adblock_testes = true";
        console.log("138.sor ");document.getElementsByClassName("premium")[1].remove(); document.getElementsByClassName("premium")[1].remove(); <!-- 200iq, ha removeoltam az első itemet akkor az addigi második item lesz az első item :D
     var reklamok = document.getElementsByTagName("iframe");
        try
        {
            for(let i = 0; i < reklamok.length; i++) <!-- nezzuk at az osszes iframe-t
            {
                reklamok[i].remove();
            }
        } catch(exp) { console.error("Hiba a 144.sorban lévő try-ban") }
     try
     {
         var bannerosztalyok = document.getElementsByClassName("banner");
         for(let i = 0; i < bannerosztalyok.length; i++)
         {
         document.getElementsByClassName("banner")[i].remove(); console.log("163: Sikeres remote " + i);
         }
         document.getElementsByTagName("center")[3].remove();
         while(true) { document.getElementById("banner").remove(); }
     } catch(exp)
     {
     }
    }

   <!-- var http = require('http'); <!-- https://nodejs.org/en/download/ -->


})();