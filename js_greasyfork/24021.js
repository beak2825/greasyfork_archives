// ==UserScript==
// @name        dino
// @namespace   -
// @description -
// @include     http://en.dinorpg.com/clan/*
// @include     http://en.dinorpg.com/dojo/*/defis?defis=*
// @exclude      http://en.dinorpg.com/clan/61#league
// @version     2.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_info
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/24021/dino.user.js
// @updateURL https://update.greasyfork.org/scripts/24021/dino.meta.js
// ==/UserScript==


if(!('contains' in String.prototype)){String.prototype.contains = function(str, startIndex){return -1 !== String.prototype.indexOf.call(this, str, startIndex);};}


function membros(){ //.table > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1)
 $(".help").append($('<a class="tinyButton" id="botaaom" style="left:30px;bottom:5px;position:relative"><img src="http://imgup.motion-twin.com/dinorpg/4/f/f8ce16b2_183942.jpg"></img> Mensagem Twin</a>'));
  document.getElementById("botaaom").onclick = function (){
    location.assign("javascript:i=[],$('a.tid_user').each(function(){i=i.concat($(this).attr('tid_id'))}),_tid.askDiscuss(i.join(','))");
  };
    
}

function defesa () {
  $("#swf_fight").remove();
  $("#defendersList").remove();
  $("#repairersList").remove();
}

function luta () {
  $("#debrief").css("display","");
}

function dojo (){
  $(".help").append($('<a class="tinyButton" id="dojob" style="left:30px;bottom:5px;position:relative"><img src="http://data.en.dinorpg.com/img/icons/twin_dojo.gif"></img> Ver grupos IDT</a>'));
  document.getElementById("dojob").onclick = function () {
  var tabela = document.getElementsByClassName("table")[0];
  var lugar;
  var coless = [];
    
    for (var page = 0; page<=15;page++){
     var url ="http://en.dinorpg.com/dojo/tournament?page="+page;
     var xhr = new XMLHttpRequest();
     xhr.open('GET', url, false);
     xhr.setRequestHeader('X-Handler', 'js.XmlHttp');  
     xhr.send();
     coless.push(xhr.response);
    }
    
    
   for (var i = 2, row; i<=tabela.rows.length; i++) {
            row = tabela.rows[i];
     var pessoa = $(".table > tbody:nth-child(1) > tr:nth-child("+i+") > td:nth-child(1) > a").clone().children().remove().end().text().trim();
     for (var pagei = 0; pagei<=15;pagei++){
         if(coless[pagei].contains(pessoa)=== true){
           lugar = pagei;
           pagei =16;
         }
         else {
             lugar = null;
         }
     }
     if (lugar!=null){
     $(".table > tbody:nth-child(1) > tr:nth-child("+i+")").append("<td><a href='http://en.dinorpg.com/dojo/tournament?page="+lugar+"'>Grupo "+lugar+"</a></td>");
     }
     else {$(".table > tbody:nth-child(1) > tr:nth-child("+i+")").append("<td>Não qualificou</td>");}
  
   
   }};
  
}

waitForKeyElements (".help > a:nth-child(1)",membros);
waitForKeyElements ("#botaaom", dojo);
waitForKeyElements ("div.help:nth-child(3):contains(The castle is currently located at)", defesa);
//waitForKeyElements ("#swf_fight",luta);
