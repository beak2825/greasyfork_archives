// ==UserScript==
// @name        KahootHack
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.3
// @match       https://kahoot.it/challenge/*
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @author      -
// @description 20.01.2021, 14:01:24
// @downloadURL https://update.greasyfork.org/scripts/420460/KahootHack.user.js
// @updateURL https://update.greasyfork.org/scripts/420460/KahootHack.meta.js
// ==/UserScript==

//let ID = document.location.href.slice(document.location.href.search('kahoot.it/challenge') + 20, document.location.href.length);
function testuwa(){
  //$(".fullscreen__ButtonWrapper-sc-1y5utqb-1").html("<button onclick='wezodpowiedz();'>Dupa</button>");
  if($(".question-title__Title-sc-1aryxsk-1").length) {
    if($(".question-title__Title-sc-1aryxsk-1").html()!=last) {
      last=$(".question-title__Title-sc-1aryxsk-1").html();
      wezodpowiedz();
    }
  }
}
function inject(func) {
    var funcString = func.toString(),
        elem = document.createElement("script");
    elem.innerHTML = funcString;
    document.body.appendChild(elem);
}
function inject2(text) {
    var funcString = text.toString(),
        elem = document.createElement("script");
    elem.innerHTML = funcString;
    document.body.appendChild(elem);
}
function wezodpowiedz() {
    let quests=data["kahoot"]["questions"];
    if(quests==undefined) location.reload();
    //console.log(quests);
    //console.log(id);
    for(var i=0;i<quests.length;i++) {
      //console.log(quests[i]);
      //console.log($(".question-title__Title-sc-1aryxsk-1 b").html());
      //console.log($(".question-title__Title-sc-1aryxsk-1 b"));
      let quest=$(".question-title__Title-sc-1aryxsk-1");
      if($(".question-title__Title-sc-1aryxsk-1 b").length) {
        quest = $(".question-title__Title-sc-1aryxsk-1 b");
      };
      if(quests[i].question.replaceAll("&nbsp;"," ").includes(quest.html().replaceAll("&nbsp;"," ")) || quests[i].question.replaceAll("&nbsp;"," ").includes(quest.html().replaceAll("&nbsp;"," "))) {
        //console.log("dupa");
        for(var j=0;j<quests[i].choices.length;j++) {
          if(quests[i].choices[j].correct) {
            console.log(quests[i].choices[j].answer);
            let dupa = $(".card__Card-lblpdo-0 span span");
            let dupa2 = $(".card__Card-lblpdo-0");
            for(var k=0;k<dupa.length;k++) {
              if(dupa[k].innerHTML.replaceAll("&nbsp;"," ")==quests[i].choices[j].answer.replaceAll("&nbsp;"," ")) {
                dupa[k].innerHTML=dupa[k].innerHTML+"[TO]";
                dupa2[k].setAttribute("style","background:magenta !important; border-style:solid; border-color:blue;border-width:10px;");
              }
            }
          }
        }
      }
    }
}
function getdata() {
  let id=document.location.href.slice(document.location.href.search('kahoot.it/challenge') + 20, document.location.href.length);
  $.get("https://kahoot.it/rest/challenges/"+id+"?includeKahoot=true",function (resp) {
    data=resp;
    if(data===undefined || data.kahoot.questions === undefined) {
      location.reload();
    }
    console.log("cyce");
    setInterval(testuwa,400);
  });
}
window.onload=function() {
  inject(testuwa);
  inject(wezodpowiedz);
  inject(getdata);
  //inject2("getdata();");
  //inject2("");
  inject2("let last=''");
  inject2("let data;");
  setTimeout(inject2("getdata();"),3000);
  //setTimeout(inject2("if(data==undefined) location.reload();"),6000);
}
