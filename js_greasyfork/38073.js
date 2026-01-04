// ==UserScript==
// @name         8Chan+
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  4chan unbean me reee
// @author       MrSkeletal
// @match        https://8ch.net/*
// @match        http://8ch.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38073/8Chan%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/38073/8Chan%2B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    var Names = ['loli lover','Pepe','Wizard','Professional ShitPoster','Hiding In The Closet','A White Guy','Redpilled','A Black Guy','Faggot','Grill','Full Time Neet','Lurker','Jewd','Chad','Stacy','Basement Dweller','1337_H@x0r','Underage','EdgeLord','NORMIE','Nazi','Pesant','FAG','Suicidal','Weeb','I <3 Hentai','Woke','FBI','Mod In Disguise','Not A Cop'];
    var ValidNameColors = ['#ff66ff','#ff3300','#6aa36a','#669999','#3399ff','#e28044'];
    var HTMLNames = document.getElementsByClassName('name');
    var HTMLGET = document.getElementsByClassName('post_no');
    //var theme = document.getElementById('styleSelector');
    //var TModernOn = false;
    var nav = document.getElementsByClassName('navLinks desktop')[0];
    var board = window.location.pathname.match(/\/[^\/]+\//)[0];
    var subject = document.getElementsByClassName('subject');
		
    //ToolBar
    //
    function Update(){
        //underline subjects
        //Add NickNames
        for (var i=0;i<HTMLNames.length;i++){
                if (HTMLNames[i].id != 'colored'){
                    HTMLNames[i].style.color = ValidNameColors[Math.floor((Math.random() * ValidNameColors.length) + 0)];
                    HTMLNames[i].id = 'colored';
                }
                if (HTMLNames[i].innerHTML == 'Anonymous'){
                    HTMLNames[i].title = "Username was originally Anonymous";
                    HTMLNames[i].innerHTML = Names[Math.floor((Math.random() * Names.length) + 0)];
                }
            }
        //GetHighlighter
        for (var i2=1;i2<HTMLGET.length;i2 += 2){
            var GET = HTMLGET[i2].innerHTML;
            var Len = GET.length - 1;
            var Dupes = 0;
            for (var l = Len; GET[l] == GET[l - 1]; l--){
                Dupes++;
            }
            if (GET[Len] == GET[Len - 1] & HTMLGET[i2].id != 'Checked'){
                HTMLGET[i2].style.backgroundColor = ValidNameColors[Math.floor((Math.random() * ValidNameColors.length) + 0)];
                HTMLGET[i2].style.color = "black";
                HTMLGET[i2].id = 'Checked';
                switch(Dupes){
                    default:
                        var saying = "GET ";
                        HTMLGET[i2].title = saying;
                        //HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                    case 1:
                        saying = "Dubs ";
                        HTMLGET[i2].title = saying;
                        //HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                    case 2:
                        saying = "Trips ";
                        HTMLGET[i2].title = saying;
                        //HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                    case 3:
                        saying = "Quads ";
                        HTMLGET[i2].title = saying;
                        //HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                }
            }
        }
        //loop
        setTimeout(Update,500);
    }
    function OneTimeUpdate(){
        //Features
    }
    //
    new OneTimeUpdate();
    new Update();
    console.log('Started 8Chan+ With No Errors!');
    //EVENTS

    //
})();