// ==UserScript==
// @name         4chan+
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Adds some kool features to 4chan!
// @author       MrSkeletal
// @match        http://boards.4chan.org/*
// @match        https://boards.4chan.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/38072/4chan%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/38072/4chan%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var Names = ['Wizard','Professional ShitPoster','Hiding In The Closet','A White Guy','Redpilled','A Black Guy','Faggot','Grill','Full Time Neet','Lurker','Jewd','Chad','Stacy','Basement Dweller','1337_H@x0r','Underage','EdgeLord','NORMIE','Nazi','Pesant','FAG','Suicidal','Weeb','I <3 Hentai','Woke','FBI','Mod In Disguise','Not A Cop'];
    var ValidNameColors = ['#ff66ff','#ff3300','#b3ffb3','#669999','#3399ff'];
    var HTMLNames = document.getElementsByClassName('name');
    var HTMLGET = document.getElementsByClassName('postNum desktop');
    var theme = document.getElementById('styleSelector');
    var TModernOn = false;
    var nav = document.getElementsByClassName('navLinks desktop')[0];
    var board = window.location.pathname.match(/\/[^\/]+\//)[0];

    //ToolBar
    //
    function Update(){
        //underline subjects
        //Add NickNames
        function ChangeNames(list){
            for (var i=0;i<HTMLNames.length;i++){
                if (HTMLNames[i].id != 'colored'){
                    HTMLNames[i].style.color = ValidNameColors[Math.floor((Math.random() * ValidNameColors.length) + 0)];
                    HTMLNames[i].id = 'colored';
                }
                if (HTMLNames[i].innerHTML == 'Anonymous'){
                    HTMLNames[i].title = "Username was originally Anonymous";
                    HTMLNames[i].innerHTML = list[Math.floor((Math.random() * list.length) + 0)];
                }
            }
        }
        //
		var nsfwNames = ['Currently Masterbaiting','NSA','Tits man','Ass man','Lurker','Kinky','Embassidor of porn','Porn merchant'];
        switch(board){
            default:
                ChangeNames(Names);
                break;
            case "/b/":
            case "/pol/":
                ChangeNames(Names);
                break;
		    case "/bant/":
				ChangeNames(Names);
                break;
		    case "/aco/":
            case "/r/":
            case "/gif/":
            case "/hr/":
            case "/t/":
            case "/y/":
            case "/d/":
            case "/e/":
            case "/s/":
            case "/hc/":
            case "/h/":
				ChangeNames(nsfwNames);
                break;
        }
        //GetHighlighter
        for (var i2=0;i2<HTMLGET.length;i2++){
            var GET = HTMLGET[i2].childNodes[1].text;
            var Len = GET.length - 1;
            var Dupes = 0;
            for (var l = Len; GET[l] == GET[l - 1]; l--){
                Dupes++;
            }
            if (GET[Len] == GET[Len - 1] & HTMLGET[i2].childNodes[1].id != 'Checked'){
                HTMLGET[i2].childNodes[1].style.backgroundColor = ValidNameColors[Math.floor((Math.random() * ValidNameColors.length) + 0)];
                HTMLGET[i2].childNodes[1].style.color = "black";
                HTMLGET[i2].childNodes[1].id = 'Checked';
                switch(Dupes){
                    default:
                        var saying = "GET ";
                        HTMLGET[i2].childNodes[1].title = saying;
                        HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                    case 1:
                        saying = "Dubs ";
                        HTMLGET[i2].childNodes[1].title = saying;
                        HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                    case 2:
                        saying = "Trips ";
                        HTMLGET[i2].childNodes[1].title = saying;
                        HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                    case 3:
                        saying = "Quads ";
                        HTMLGET[i2].childNodes[1].title = saying;
                        HTMLGET[i2].childNodes[0].innerHTML = saying + HTMLGET[i2].childNodes[0].innerHTML;
                        break;
                }
            }
        }
        //TestTheme
        if (theme.options[theme.selectedIndex].value == 'Test'){
            //BG
            document.body.style.backgroundColor = '#cccccc';
            document.getElementById('header-bar').style.backgroundColor = '#9BAEC8';
            //Post Form
            document.getElementById('postForm').style.backgroundColor = '#444b5d';
            document.getElementById('postForm').style.border = '3px  solid #282c37';
            document.getElementById('postForm').style.marginLeft = '35%';
            document.getElementById('postForm').style.borderRadius = '4px';
            //
            var PR = document.getElementsByClassName('post reply');
            var OP = document.getElementsByClassName('post op');
            for (i=0;i<PR.length;i++){
                PR[i].style.backgroundColor = '#444b5d';
                PR[i].style.color = '#e6e6e6';
                PR[i].style.border = '3px  solid #282c37';
                PR[i].style.borderRadius = '4px';
                PR[i].style.margin = '14px';
            }
            for (i=0;i<OP.length;i++){
                OP[i].style.backgroundColor = '#444b5d';
                OP[i].style.color = '#e6e6e6';
                OP[i].style.border = '3px  solid #282c37';
                OP[i].style.borderRadius = '4px';
                OP[i].style.margin = '14px';
            }
        }
        //loop
        setTimeout(Update,500);
    }
    function OneTimeUpdate(){
        //add tools
        var toolMenu = document.createElement('div');
        toolMenu.setAttribute("style","background-Color: #5f92ca; top: 50%; position: fixed; zIndex: 99999999; border: 3px  solid #6699ff; padding: 5px; left: 50%; transform: translate(-50%, -50%)");
        toolMenu.style.display = 'none';
        document.body.appendChild(toolMenu);
        //Header
        var TMText = document.createElement('h1');
        TMText.innerHTML = 'Tools Menu';
        toolMenu.appendChild(TMText);
        //Features
        //Highlighter
        var TMText2 = document.createElement('h4');
        TMText2.innerHTML = 'Features Undone';
        toolMenu.appendChild(TMText2);
        var TMAH = document.createElement('div');
        TMAH.id = 'TMHLDiv';
        //exit
        var TMExit = document.createElement('button');
        TMExit.innerHTML = 'Exit';
        toolMenu.appendChild(TMExit);
        TMExit.addEventListener('click',function(){
            toolMenu.style.display = 'none';
        });
        //Add Theme (TEST)
        var TModern = document.createElement('option');
        TModern.value = 'Test';
        TModern.innerHTML = 'Test';
        theme.appendChild(TModern);
        //add some tools
        if(nav !== undefined){
            nav.innerHTML += " [";
            var Settings = document.createElement('a');
            Settings.id = 'SID';
            Settings.innerHTML = 'Tools';
            Settings.style.cursor = 'pointer';
            nav.appendChild(Settings);
            nav.innerHTML += "]";
            document.getElementById('SID').addEventListener("click",function(){
                toolMenu.style.display = 'inline';
            });
        }
        //Add message for board
        var message = document.createElement('div');
        message.className = 'boardSubtitle';
        document.getElementsByClassName("boardBanner")[0].appendChild(message);
        console.log(board);
        var bantMSG = ["anime","Reminder that the animal of /bant/ is the blobfish","/b/ With flags","Death to frogposters",">coke without peanuts"];
        var animeMSG = ["Dubs > Subs","Dubs < Subs","Your waifu is shit"];
        var bMSG = ["NORMIES GET OUT REEEEEE","Not your personal army","Where porn is more common than memes","Dont be a gullible idiot","Home of Anonymous"];
        var nsfwMSG = ['Got some alone time eh ;)','The NSA is gonna love watching this','If you get caught, just blame it on ghosts','Kinky','2d > 3d','2d < 3d','Got a fine taste'];
        var r9kMSG = ['No chads allowed','NORMIES GET OUT REEEEEE','<p style="color:#B5BD67;"> >Feels Bad Man </p>'];
        var travelMSG = ['When you need a destination who are you gonna call ' + board + '!','More likly to get out than most people'];
        switch(board){
            case "/bant/":
                message.innerHTML = bantMSG[Math.floor((Math.random() * bantMSG.length) + 0)];
                break;
            case "/r9k/":
                message.innerHTML = r9kMSG[Math.floor((Math.random() * r9kMSG.length) + 0)];
                break;
            case "/n/":
            case "/o/":
            case "/out/":
                message.innerHTML = travelMSG[Math.floor((Math.random() * travelMSG.length) + 0)];
                break;
            case "/a/":
            case "/c/":
            case "/w/":
            case "/m/":
            case "/cgl/":
            case "/jp/":
            case "/cm/":
                message.innerHTML = animeMSG[Math.floor((Math.random() * animeMSG.length) + 0)];
                break;
            case "/b/":
                message.innerHTML = bMSG[Math.floor((Math.random() * bMSG.length) + 0)];
                document.getElementsByClassName("boardSubtitle")[0].remove();
                break;
            case "/aco/":
            case "/r/":
            case "/gif/":
            case "/hr/":
            case "/t/":
            case "/y/":
            case "/d/":
            case "/e/":
            case "/s/":
            case "/hc/":
            case "/h/":
                message.innerHTML = nsfwMSG[Math.floor((Math.random() * nsfwMSG.length) + 0)];
                break;
            default:
                message.innerHTML = "This Board Doesnt Have Messages Yet!";
        }
    }
    //
    new OneTimeUpdate();
    new Update();
    console.log('Started 4chan+ With No Errors!');
    //EVENTS

    //
})();