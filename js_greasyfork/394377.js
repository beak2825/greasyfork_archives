// ==UserScript==
// @name         Duolingo Hack - DuoFarmer
// @namespace    http://tampermonkey.net/
// @version      1.0.3.4
// @description  Earn thousands of XP on Duolingo a day!
// @author       Lolo
// @match        *://stories.duolingo.com/lessons/es-buenos-dias
// @match        *://stories.duolingo.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=duobot.ml
// @downloadURL https://update.greasyfork.org/scripts/394377/Duolingo%20Hack%20-%20DuoFarmer.user.js
// @updateURL https://update.greasyfork.org/scripts/394377/Duolingo%20Hack%20-%20DuoFarmer.meta.js
// ==/UserScript==

(function() {
    'use strict'

    var maxtime = 120; //seconds
    var starttime = new Date().getTime();
    var currenttime;

    var amountworkers = 10;

    if(document.location.toString().includes("://stories.duolingo.com") && !window.location.toString().includes("/lessons/")){
        sessionStorage.setItem('xp', 0);

        function loadscript(){
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', 'https://duobotdatabase.000webhostapp.com/duofarmer/version.js');
            document.head.appendChild(script);
        }

        loadscript();

        var checkscript = setInterval(function(){
            if(typeof version != "undefined"){
                clearInterval(checkscript);
                var versionsplit = version.split(".");
                var myversion = GM_info.script.version;
                myversion = myversion.split(".");
                for(let i=0;i<versionsplit.length;i++){
                    if(versionsplit[i] > myversion[i]){
                        if (confirm("Please update to the newest version!")) {
                            window.location = "https://greasyfork.org/de/scripts/391926-duolingo-hack-duofarmer";
                        }
                        break;
                    }
                }
            }
        },500);

        document.head.innerHTML+= "<style>#workerinp{width:50px;}.botframe{width:100px;height:100px;volume: silent;display:none;} .progress-bar-container{padding:10px;}.progress-bar{text-align:left;-webkit-flex: 1 1 auto;background-color: #e5e5e5;border-radius: 8px;-webkit-box-flex: 1;-ms-flex: 1 1 auto;flex: 1 1 auto;height: 16px;position: relative;width: 100%;} .progress-bar-highlight{background-color: #78c800;border-radius: 16px;height: 16px;margin-top: 0px;position: relative;-webkit-transition: width .3s;transition: width .3s; width:0%;}</style>";

        var bodyelem = setInterval(function(){
            if(document.querySelector('div[class="home-page"]')){
                document.querySelector('div[class="home-page"]').innerHTML = "<center><br><span style='font-size:40px;'>DuoFarmer by Lolo</span><br><a href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2PL9HG9425XME&source=url'>Paypal</a> | <a href='https://discord.gg/DXAwvrW'>Contact/Discord</a> | <a href='https://www.youtube.com/c/lolo5'>Youtube</a></span><br><h4>Not earning enough XP / not working for you? Try out <a href='https://youtu.be/leVCe9-lygI'>DuoHacker</a>!</h4><br>Earned <span id='xpcount'>0</span> XP...<br><br><div class='progress-bar-container'></div></center>";
                clearInterval(bodyelem);
                addiframes();
            }
        },100);


        setInterval(function(){

            document.getElementById('xpcount').innerHTML = sessionStorage.getItem('xp');

            var iframes = document.querySelectorAll('iframe[class="botframe"]');
            for(let i=0;i<iframes.length;i++){
                document.getElementsByClassName('progress-bar-highlight')[i].style.width = iframes[i].contentWindow.document.getElementsByClassName('progress-bar-highlight')[0].style.width;
            }
        },1000);

        function addiframes(){
            var needworkers = amountworkers-document.getElementsByClassName('botframe').length;
            for(let i=0;i<needworkers;i++){
                console.log(needworkers);
                var iframe = document.createElement('iframe');
                iframe.src = 'https://stories.duolingo.com/lessons/es-buenos-dias';
                iframe.classList.add("botframe");
                iframe.muted = true;
                document.querySelector('div[class="home-page"]').appendChild(iframe);
                document.querySelector('div[class="progress-bar-container"]').innerHTML += "<div class='progress-bar'><div class='progress-bar-highlight'></div></div><br>";
            }
        }

    }else{

        var answers = [{"one":"sin","two":"without"},{"one":"bebe","two":"drinks"},{"one":"what","two":"Qué"},{"one":"aquí","two":"here"},{"one":"estás","two":"you are"},{"one":"o","two":"or"},{"one":"armor","two":"love"},{"one":"casa","two":"home"},{"one":"estoy","two":"i am"},{"one":"puts","two":"pone"},{"one":"libro","two":"book"},{"one":"quieres","two":"you want"},{"one":"Dónde","two":"where"},{"one":"su","two":"his"},{"one":"university","two":"universidad"},{"one":"tired","two":"cansada"},{"one":"está","two":"is"},{"one":"English book","two":"libro de inglés"},{"one":"table","two":"mesa"},{"one":"más","two":"more"},{"one":"examen de inglés","two":"English exam"},{"one":"café","two":"coffee"},{"one":"tengo","two":"i have"},{"one":"my","two":"mi"},{"one":"la","two":"the"},{"one":"tu","two":"your"},{"one":"Buenos días","two":"good morning"},{"one":"con","two":"with"},{"one":"milk","two":"leche"},{"one":"sal","two":"salt"},{"one":"eso","two":"that"},{"one":"en","two":"at"},{"one":"i need","two":"necesito"},{"one":"wife","two":"esposa"},{"one":"not","two":"no"},{"one":"Sí","two":"yes"},{"one":"azúcar","two":"sugar"},{"one":"excuse me","two":"Perdón"},{"one":"por favor","two":"please"},{"one":"she","two":"ella"},{"one":"it is not","two":"no es"},{"one":"muy","two":"very"},{"one":"un","two":"an"},{"one":"amor","two":"love"},{"one":"","two":""},{"one":"","two":""},{"one":"","two":""}];

        setTimeout(function(){check();},1000);

        function check(){

            var interval = setInterval(function(){
                if(document.getElementsByClassName('radio-button')[0] != undefined){
                    if(findbytext("[class=phrases-with-hints]","… su café.")){
                        findbytext("[class=phrases-with-hints]","… su café.").parentElement.querySelector('button').click();
                    }else if(findbytext("[class=phrases-with-hints]","My love.")){
                        findbytext("[class=phrases-with-hints]","My love.").parentElement.querySelector('button').click();
                    }else if(findbytext("[class=phrases-with-hints]","She put salt in her coffee.")){
                        findbytext("[class=phrases-with-hints]","She put salt in her coffee.").parentElement.querySelector('button').click();
                    }
                }else if(document.querySelector('div[class="challenge select-phrase-challenge challenge-marker"]')){
                    findbytexttwo('button[class="selectable-token"]',"examen de inglés").click();
                }else if(document.querySelector('div[class="phrase tappable-phrase"]')){
                    findbytext('div[class="phrase tappable-phrase"]',"cansada").click();
                }else if(document.querySelector('div[class="challenge arrange-challenge challenge-marker"]')){
                    triggerMouseEvent(findbytext('span[class="phrase"]', "con"), "mousedown");
                    triggerMouseEvent(findbytext('span[class="phrase"]', "o"), "mousedown");
                    triggerMouseEvent(findbytext('span[class="phrase"]', "sin"), "mousedown");
                    triggerMouseEvent(findbytext('span[class="phrase"]', "leche"), "mousedown");
                }else if(document.querySelector('div[class="challenge-question"]')){
                    for(let i=0;i<answers.length;i++){
                        if(findbytext('button[class="selectable-token"]', answers[i].one)){
                            findbytext('button[class="selectable-token"]', answers[i].one).click();
                            findbytext('button[class="selectable-token"]', answers[i].two).click();
                        }
                    }
                }else if(document.getElementsByClassName("story-starter-start-story")[0] != undefined){
                    setTimeout(function(){
                        document.getElementsByClassName("story-starter-start-story")[0].click();
                    },1000);
                }else if(document.querySelector('div[class="progress-ring-wrap"]')){
                    setTimeout(function(){
                        var xpcount = document.querySelector('div[class="story-end-ring-of-fire"]').querySelector('h2').innerText.replace( /^\D+/g, '');
                        xpcount = parseInt(xpcount)+parseInt(sessionStorage.getItem('xp'));
                        sessionStorage.setItem('xp', xpcount);
                        document.location.href = document.location.href;
                    },3000);
                    clearInterval(interval);
                }

                currenttime = new Date().getTime();
                if(currenttime - maxtime * 1000 > starttime){document.location.href = document.location.href;}

                if(document.querySelector('button[class="continue"]') && !document.querySelector('button[class="continue"][disabled]')){
                    document.querySelector('button[class="continue"]').click();
                }
            },1000);

        }

        function findbytext(selector,selectortext){
            selectortext = selectortext.toLowerCase();
            var nodes = document.querySelectorAll(selector);
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].innerText.toLowerCase() == selectortext){
                    return nodes[i];
                }
            }
        }


        function findbytexttwo(selector,selectortext){
            selectortext = selectortext.toLowerCase();
            var nodes = document.querySelectorAll(selector);
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].innerText.toLowerCase().includes(selectortext)){
                    return nodes[i];
                }
            }
        }


        function triggerMouseEvent (node, eventType) {
            var clickEvent = document.createEvent ('MouseEvents');
            clickEvent.initEvent (eventType, true, true);
            node.dispatchEvent (clickEvent);
        }

    }

})();