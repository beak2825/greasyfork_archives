// ==UserScript==
// @name         Duolingo Hack - DouBot
// @namespace    http://tampermonkey.net/
// @version      1.10.5
// @description  ayuda a burlarse de aureliano y juana
// @author       lets luthor
// @match        *://www.duolingo.com/*
// @grant        window.close
// @grant        window.focus
// @icon

// @downloadURL https://update.greasyfork.org/scripts/397629/Duolingo%20Hack%20-%20DouBot.user.js
// @updateURL https://update.greasyfork.org/scripts/397629/Duolingo%20Hack%20-%20DouBot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scripturl = "https://duobotdatabase.000webhostapp.com/v3/answers.js";
    var basesendurl = "https://duobotdatabase.000webhostapp.com/v3/receive.php?v=";

    var statusdiv = document.createElement("div");
    statusdiv.style = "z-index: 999; top: 10px; width: 70%; max-width: 700px; background-color: red; position: fixed !important;left: 50%;transform: translate(-50%, 0);text-align:center;padding:10px;border-radius:5px;display: none;";
    document.body.appendChild(statusdiv);
    //statusdiv.style.display = "block";


    var serverstatus = "";

    function checkServerStatus() {
        console.log("check server");
        serverstatus = "unknown";
        var img = document.body.appendChild(document.createElement("img"));
        img.onload = function() {
            serverstatus = "online";
        };
        img.onerror = function() {
            serverstatus = "offline";
        };
        img.src = "https://duobotdatabase.000webhostapp.com/1x1-testimage.png";
        console.log(serverstatus);
        setTimeout(function() {
            if (serverstatus == "" || serverstatus == "unknown") {
                setTimeout(function() {
                    checkServerStatus();
                }, 1000);
            } else if (serverstatus == "offline") {
                statusdiv.style.display = "block";
                statusdiv.innerHTML = "Server offline, please contact me at <a href='https://discord.gg/DXAwvrW'>https://discord.gg/DXAwvrW</a>";
                console.log("server offline");
            }
        }, 1000);
    }
    checkServerStatus();


    window.onload = function(){
        loadscript();
    }

    var questionst = [];
    var questionso = [];
    var questionsc = [];
    var questionsso = [];
    var questionsh = [];
    var questionsca = [];
    var questionscha = [];
    var questionswt = [];

    var finalstring = [];

    var mainurl = "";

    var mainlang = "";

    function checkurl(){
        var urlcheck = setInterval(function(){
            if(window.location.toString().split('://www.duolingo.com/skill/').length > 1){ // me idiot just use .includes() idiot
                mainurl = window.location.toString();
                mainlang = mainurl.split("skill/")[1].split("/")[0];
                console.log(mainlang);
                console.log(mainurl);
                xbtncheck();
                clearInterval(urlcheck);
            }
        },1000);
    }

    checkurl();

    var xbtnclicked = false;

    function xbtncheck(){
        var checkxbtn = setInterval(function(){
            if(document.querySelector('a[class="_38taa _2Zfkq cCL9P"][href="/"]')){
                document.querySelector('a[class="_38taa _2Zfkq cCL9P"][href="/"]').onclick = function(){
                    xbtnclicked = true;
                    checkurl();
                }
            }
        },1000);
    }

    setInterval(function(){
        if(window.location.toString() != mainurl && mainurl != "" && xbtnclicked == false){
            window.location = mainurl;
        }
    },1000)

    var sendurl = "";

    var succes = 0;

    function scriptloaded(){
        answers = answers.filter(type => type.lang == mainlang);
        questionswt = answers.filter(type => type.type == "whatsthis");
        questionst = answers.filter(type => type.type == "text");
        questionso = answers.filter(type => type.type == "order");
        questionsc = answers.filter(type => type.type == "choice");
        questionsso = answers.filter(type => type.type == "sounds");
        questionsh = answers.filter(type => type.type == "hybrid");
        questionsca = answers.filter(type => type.type == "cards");
        questionscha = answers.filter(type => type.type == "characters");
        findanswer();
    }

    function loadscript(){
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", scripturl);
        //script.onload = function(){console.log("script");scriptloaded();};
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    setTimeout( function(){
        var checkscript = setInterval( function(){
            console.log("check script");
            if(typeof answers != "undefined"){console.log("script loaded");clearInterval(checkscript);scriptloaded();}else{loadscript();}
        }, 1000)
    }, 1000)

    function findanswer(){
        console.log("called");
        var looptype = "";
        setInterval(function(){
            succes = 0;
            if(document.querySelector('div[data-test="player-end-carousel"]')){
                setTimeout(function(){looptype = "";window.location = mainurl},2000);
            }else if(document.querySelector("#root > div > div > div > div > div._2-1wu > div > div._1pmjQ > span") || document.querySelector("[class='_3_JZ0 _3xkKb _1-ph4 _3Lwfw']")){
                looptype = "";
                document.querySelector("button[data-test=player-next]").click();
            }else if(document.querySelector('div[data-test="challenge challenge-characterMatch"]') || document.querySelector('button[data-test=challenge-speak-button]') || document.querySelector('div[data-test="challenge challenge-listenTap"]' || document.querySelector('div[style="position: absolute; top: 0px; left: 0px; z-index: 150; transform: translate3d(239px, 114px, 0px); will-change: transform;"]'))){
                looptype = "";
                document.querySelector('button[data-test="player-skip"]').click();
                setTimeout(function(){ document.querySelector("button[data-test=player-next]").click(); }, 100);
            }else if(looptype != "0" && document.querySelector('div[class="_3usrL"]')){ // whatsthis
                for(let i=0;i<questionswt.length;i++){
                    if(questionswt[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        document.querySelector('input[data-test="challenge-text-input"]').value = questionswt[i].answer;
                        succes = 1;
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);
            }else if(looptype != "1" && document.querySelector('textarea[data-test=challenge-translate-input]')){ //textarea
                looptype = "1";
                for(let i=0;i<questionst.length;i++){
                    var searchtext = document.querySelector('span[data-test=hint-sentence]').innerText;
                    var questiontext = questionst[i].question;
                    if(searchtext == questiontext && questionst[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        if(document.querySelectorAll('textarea[data-test=challenge-translate-input]')[0].value != questionst[i].answer){
                            document.querySelectorAll('textarea[data-test=challenge-translate-input]')[0].value = questionst[i].answer.trim();
                            succes = 1;
                        }
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);
            }else if(looptype != "2" && document.querySelector('span[data-test=hint-sentence]')){
                looptype = "2";
                for(let i=0;i<questionso.length;i++){
                    if(document.querySelector('span[data-test=hint-sentence]').innerText == questionso[i].question && questionso[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        var ab = questionso[i].answer.split("{s}");
                        var amount = 0;
                        for(let a=0;a<ab.length;a++){
                            if(findbytext('button[data-test="challenge-tap-token"]',ab[a]) != undefined && ab[a] != ""){
                                amount++;
                            }
                        }
                        if(amount == ab.length){
                            for(let x=0;x<ab.length;x++){
                                if(ab[x] != ""){
                                    findbytext('button[data-test="challenge-tap-token"]',ab[x]).click();
                                }
                            }
                            succes = 1;
                            break;
                        }
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);
            }else if(looptype != "3" && document.querySelector('div[data-test=challenge-form-prompt]') || document.querySelector('div[data-test="challenge challenge-judge"]')){
                looptype = "3";
                var tempquestion = "";
                if(document.querySelector('div[data-test=challenge-form-prompt]')){tempquestion = document.querySelector('div[data-test=challenge-form-prompt]').getAttribute("data-prompt")}
                else{tempquestion = document.querySelector('div[data-test="challenge challenge-judge"]').childNodes[0].childNodes[1].childNodes[0].innerText;}
                for(let i=0;i<questionsc.length;i++){
                    if(tempquestion == questionsc[i].question && questionsc[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        try{
                            findbytext("div[data-test=challenge-judge-text]", questionsc[i].answer).click();
                            succes = 1;
                            setTimeout(function(){ document.querySelector("button[data-test=player-next]").click(); }, 100);
                        }
                        catch(err){console.log("cant find answer");}
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);
            }else if(looptype != "4" && document.querySelector('div[class="XOd-L"]')){ //sound
                looptype = "4";
                for(let i = 0;i<questionsso.length;i++){
                    if(questionsso[i].question == document.querySelector('div[class="XOd-L"]').innerText && questionsso[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        findbytext('div[data-test="challenge-judge-text"]', questionsso[i].answer).click();
                        succes = 1;
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);
            }else if(looptype != "5" && document.querySelector('div[data-test="challenge challenge-name"]')){ // hybrid
                looptype = "5";
                for(let i=0;i<questionsh.length;i++){
                    if(questionsh[i].question == document.querySelector('h1[data-test="challenge-header"]').innerText && questionsh[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        try{
                            var tempanswer = questionsh[i].answer.split("{s}");
                            findbytext("div[data-test='challenge-judge-text']", tempanswer[0]).parentNode.click();
                            document.querySelector('input[data-test="challenge-text-input"]').value = tempanswer[1];
                            document.querySelector('input[data-test="challenge-text-input"]').focus();
                            succes = 1;
                            setTimeout(function(){ document.querySelector("button[data-test=player-next]").click(); }, 200);
                        }
                        catch(err){console.log("cant find answer");}
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);
            }else if(looptype != "6" && document.querySelector('li[data-test="challenge-choice-card"][class="g1wrO _3H8zM _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT _2Zn_t"]')){ //character
                looptype = "6";
                for(let i = 0;i<questionscha.length;i++){
                    if(questionscha[i].question == document.querySelector('h1[data-test="challenge-header"]').innerText && questionscha[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        try{
                            findbytext('div[class=_3Ri-d]',questionscha[i].answer).click()
                            succes = 1;
                        }
                        catch(err){console.log("cant find answer");}
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);
            }else if(looptype != "7" && document.querySelector('li[data-test="challenge-choice-card"]')){ //cards
                looptype = "7";
                for(let i = 0;i<questionsca.length;i++){
                    if(questionsca[i].question == document.querySelector('h1[data-test="challenge-header"]').innerText && questionsca[i].title == document.querySelector('h1[data-test="challenge-header"]').innerText){
                        findbytext('span[class="_1xgIc"]', questionsca[i].answer).parentNode.parentNode.click();
                        succes = 1;
                    }
                }
                setTimeout(function(){ clicknext(); }, 200);}
            else{
                looptype = "";
                if(window.location.toString().split('://www.duolingo.com/skill/').length > 1){
                    console.log("not known type");
                }
                if(window.location.toString().split('://www.duolingo.com/learn').length > 1 && mainurl != "" && xbtnclicked == false){
                    window.location = mainurl;
                }
            }
        }, 200);
    }


    function recorddata(){

        console.log("data");
        var checkend = setInterval(function(){if(document.querySelector('div[data-test="player-end-carousel"]')){senddata();}},300);

        var type = "";
        var question = "";
        var answer = "";
        var title = "";
        function getdata(){
            type=question=answer=title="";
            function checktype(){
                if(document.querySelector('button[data-test=challenge-speak-button]') || document.querySelector('div[data-test="challenge challenge-listenTap"]')){
                    document.querySelector('button[data-test=player-next]').click();
                }else if(type != "whatsthis" && document.querySelector('div[class="_3usrL"]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "whatsthis";
                    question = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    answer = document.querySelector('input[data-test="challenge-text-input"]').value;
                }else if(type != "text" && document.querySelector('textarea[data-test=challenge-translate-input]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "text";
                    question = document.querySelector('span[data-test=hint-sentence]').innerText;
                    answer = document.querySelector("#root > div > div > div > div > div._2-1wu > div > div > div > div > div > div._23gwq > div > textarea").value.trim();
                }else if(type != "order" && document.querySelector('span[data-test=hint-sentence]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "order";
                    question = document.querySelector('span[data-test=hint-sentence]').innerText;
                    var blocks = document.getElementsByClassName('_3Ptco')[0].querySelectorAll('button[data-test="challenge-tap-token"]');
                    answer = "";
                    for(let i=0;i<blocks.length;i++){
                        answer += blocks[i].innerText + "{s}";
                    }
                }else if(type != "choice" && document.querySelector('div[data-test=challenge-form-prompt]') || document.querySelector('div[data-test="challenge challenge-judge"]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "choice";
                    if(document.querySelector('div[data-test=challenge-form-prompt]')){question = document.querySelector('div[data-test=challenge-form-prompt]').getAttribute("data-prompt")}
                    else{question = document.querySelector('div[data-test="challenge challenge-judge"]').childNodes[0].childNodes[1].childNodes[0].innerText;}
                    answer = document.querySelector('label[class="_1VKCj _2VgPp _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT _2jUZ7"]').children[2].innerText || document.querySelector('label[class="_1VKCj _2VgPp _1-PLN _2QNyK _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT"]').querySelector('div[data-test="challenge-judge-text"]').innerText;
                }else if(type != "sounds" && document.querySelector('div[class="XOd-L"]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "sounds";
                    question = document.querySelector('div[class="XOd-L"]').innerText;
                    answer = document.querySelector('label[class="_1VKCj _2VgPp _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT _2jUZ7"]').querySelector('div[data-test="challenge-judge-text"]').innerText;
                }else if(type != "hybrid" &&document.querySelector('div[data-test="challenge challenge-name"]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "hybrid";
                    question = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    answer = document.querySelector('label[class="_1VKCj _2VgPp _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT _2jUZ7"]').children[2].innerText +"{s}"+ document.querySelector('input[data-test="challenge-text-input"]').value;
                }else if(type != "characters" && document.querySelector('li[data-test="challenge-choice-card"][class="_2oF6E _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT _2Zn_t"]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "characters";
                    question = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    answer = document.querySelector('li[data-test="challenge-choice-card"][class="_2oF6E _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT _2Zn_t"]').children[0].children[0].children[0].innerText;
                }else if(type != "cards" && document.querySelector('li[data-test="challenge-choice-card"]')){
                    title = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    type = "cards";
                    question = document.querySelector('h1[data-test="challenge-header"]').innerText;
                    answer = document.querySelector('li[class="_2oF6E _2Zn_t _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT"]') || document.querySelector('li[class="_2oF6E _3DsW- _2q1CL _2Zh2S _1X3l0 eJd0I H7AnT _2Zn_t"]').children[0].children[1].children[0].innerText;
                }else{
                    console.log("not known type");
                }

                console.log(title);
                console.log(type);
                console.log(question);
                console.log(answer);

                if(type!=""&&question!=""&&answer!=""&&title){
                    collectdata();
                }else{
                    console.log("jain");
                    checktype();
                }
            }

            checktype();


            try {
                clicknext();
            }catch(e) { }
        }

        function collectdata(){
            finalstring[finalstring.length] = {"lang": mainlang.toString(),"title": title.toString(),"type": type.toString(),"question": question.toString(),"answer": answer.toString()};
            console.log(JSON.stringify(finalstring));
        }

        function senddata(){
            var lasturl = sendurl;
            sendurl = basesendurl+JSON.stringify(finalstring);
            if(lasturl != sendurl && finalstring != 0){
                var Window = window.open(sendurl, "_blank", "width=1, height=1");
                Window.blur();
                window.focus();
            }
            finalstring = [];
        }


        getdata();
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


    function clicknext(clickbool){
        if(succes != 1 && document.querySelector("#root > div > div > div > div > div._3gDW- > div > div > div.KekRP._3Txod._1yRbM > div > div.BYr_J._3nzjY > span")){
            succes = 1;
            recorddata();
        }else if(document.querySelector('div[data-test="player-end-carousel"]')){
            //document.getElementsByClassName('_3_pD1 _2ESN4 _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr _2L5kw _3Ry1f')[0].click();
            window.location = mainurl;
        }else if(succes == 1){
            if(clickbool != false){
                try {
                    document.querySelector("button[data-test=player-next]").click();
                    setTimeout(function(){ document.querySelector("button[data-test=player-next]").click(); }, 100);
                }catch(e) { }
                throw "cant click"
            }
            succes = 0;
        }
    }

})();