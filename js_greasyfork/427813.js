// ==UserScript==
// @name        KahootHackV2
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     2.99.2
// @match       https://kahoot.it/*
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @author      Kabus
// @description 12.10.2022
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427813/KahootHackV2.user.js
// @updateURL https://update.greasyfork.org/scripts/427813/KahootHackV2.meta.js
// ==/UserScript==

let quiz_data;

//wait for page to load
window.onload = function() {
    
    let infobox = document.createElement("div");
        infobox.style.position="fixed";
        infobox.style.top="10px";
        infobox.style.left="10px";
        infobox.style.width="calc( 100% - 20px )";
        infobox.style.height="calc( 100% - 20px )";
        infobox.style.background="black";
        infobox.style.zIndex="9999999";
        infobox.style.color="white";
        infobox.innerHTML="<h1 style='font-size: 2.5em;line-height:2.5em;'>KahootHackV2 - WAŻNA AKTUALIZACJA</h1>Ten skrypt nie działa. Pobierz nową wersję!<br>Nowe aktualizacje będą na: https://kabus.tk/kahoot.user.js<br><br><br><h1 style='font-size: 2.5em;line-height:2.5em;text-decoration:underline;color:blue;'><a href='https://kabus.tk/kahoot.user.js'>POBIERZ</a></h1>";
        document.querySelector("#root").appendChild(infobox);
    
    //get quiz id from URL
    /*
    let quiz_id=document.location.href.slice(document.location.href.search('kahoot.it/challenge') + 20, document.location.href.length);
    //get quiz data from api
    $.get("https://kahoot.it/rest/challenges/"+quiz_id+"?includeKahoot=true",function (resp, statustext, xhr) {
        quiz_data=resp;
        console.log(resp);
        const o_config = { childList: true, subtree: true };
        const o_callback = function(mList,obs) {
            mList.forEach(mut => {
                if(mut.addedNodes.length>0 && mut.addedNodes[0].nodeName=="HEADER") {
                    let question_local = mut.addedNodes[0].children[0].children[0].textContent;
                  console.log(question_local);
                    quiz_data.kahoot.questions.forEach(question => {
                        if(question.type=="content") return;
                        if(question.question.replaceAll("&nbsp;"," ")==question_local.replaceAll("&nbsp;"," ")) {
                            let answers_local = document.querySelectorAll("#challenge-game-router main > div > button");
                          console.log(answers_local);
                            answers_local.forEach(answer_local => {
                                question.choices.forEach(answer => {
                                    if(answer.answer.replaceAll("&nbsp;"," ").replaceAll("Prawda","True").replaceAll("Fałsz","False")==answer_local.children[1].textContent.replaceAll("&nbsp;"," ").replaceAll("Prawda","True").replaceAll("Fałsz","False") && answer.correct) {
                                      mut.addedNodes[0].children[0].style.display="block";
                                        mut.addedNodes[0].children[0].children[0].style.display="block";
                                        mut.addedNodes[0].children[0].innerHTML+="<br><span style='font-size:12px'>Poprawne: "+answer.answer+"</span>";
                                        answer_local.children[0].setAttribute("style","background: #f0f !important;");
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
        const obs = new MutationObserver(o_callback);
        obs.observe(document.getElementById("challenge-game-router"), o_config);
    }).fail(function(err) {
        let infobox = document.createElement("div");
        infobox.style.position="fixed";
        infobox.style.top="10px";
        infobox.style.left="10px";
        infobox.style.width="calc( 100% - 20px )";
        infobox.style.height="calc( 100% - 20px )";
        infobox.style.background="black";
        infobox.style.zIndex="9999999";
        infobox.style.color="white";
        infobox.innerHTML="<h1 style='font-size: 2.5em;line-height:2.5em;'>Błąd przy wczytywaniu danych</h1> "+err.responseText+"<br><br><h1 style='font-size: 2.5em;line-height:2.5em;text-decoration:underline;color:blue;'><a href='javascript:location.reload()'>ODŚWIEŻ</a></h1>";
        document.querySelector("#root").appendChild(infobox);

    });*/
}