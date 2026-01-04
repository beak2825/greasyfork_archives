
// ==UserScript==
// @name        Jogo Wiki
// @namespace   -
// @description Cria um jogo com as 4 fotos aleatórias que o Wikiaves mostra no cabeçalho da página
// @include     https://www.wikiaves.com/
// @include     https://www.wikiaves.com.br/
// @include     https://www.wikiaves.com.br/index.php?
// @include     https://www.wikiaves.com/index.php?
// @include     https://www.wikiaves.com.br/fotos/*
// @include     https://www.wikiaves.com/fotos/*
// @include     https://www.wikiaves.com.br/midias2/fotos/*
// @include     https://www.wikiaves.com/midias2/fotos/*
// @version     1.9
// @require    	https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require     https://greasyfork.org/scripts/36228-he-js/code/hejs.js?version=236227
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/35867/Jogo%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/35867/Jogo%20Wiki.meta.js
// ==/UserScript==

var giftimer = "https://i.imgur.com/qn5vlmz.gif";
var perg1,perg2,perg3,perg4,perg4F;
var resp1,resp2,resp3,resp4;
var pontos = 0;var rol = 0;var segundo = 1000;var seg41 = 91000;
var ancora1 = "#headertab > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)";
var ancora2 = "#headertab > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(2)";
var ancora3 = "#headertab > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(3)";
var ancora4 = "#headertab > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(4)";
var usuario_s = "#headertab > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)";
var certo = "Correto!";
var errado = "Errou!";
var ana1,ana2,ana3,ana4;
var lv1,lv2,lv3,lv4,tempoo,usuario;

if(!('contains' in String.prototype)){String.prototype.contains = function(str, startIndex){return -1 !== String.prototype.indexOf.call(this, str, startIndex);};}

function comeca() {

  $("#menu-container").append($('<button type="button" id="boto" align="left"> Jogar </button> '));
  document.getElementById("boto").onclick = function (){
    usuario = $(usuario_s).text();
    removerlinks();
    document.getElementById("boto").innerHTML = "Jogando";
    document.getElementById("boto").disabled = true;
    blink("#boto");
    reseta();
    tempoo = setInterval(function(){ contagem() }, 1000);
  };
}

function perguntas () {

  if (rol>=40){
    postarGoogle();
    document.getElementById("botus").disabled = true;
    window.location.reload(true);
  }
  
  resp1 = document.getElementsByClassName("thumb100top")[0].alt;
  resp2 = document.getElementsByClassName("thumb100top")[1].alt;
  resp3 = document.getElementsByClassName("thumb100top")[2].alt;
  resp4 = document.getElementsByClassName("thumb100top")[3].alt;
  document.getElementsByClassName("thumb100top")[0].alt="";
  document.getElementsByClassName("thumb100top")[1].alt="";
  document.getElementsByClassName("thumb100top")[2].alt="";
  document.getElementsByClassName("thumb100top")[3].alt="";
  document.getElementsByClassName("thumb100top")[0].title="";
  document.getElementsByClassName("thumb100top")[1].title="";
  document.getElementsByClassName("thumb100top")[2].title="";
  document.getElementsByClassName("thumb100top")[3].title="";
  var newrf1 = document.getElementsByClassName("thumb100top")[0].src;
  var newrf2 = document.getElementsByClassName("thumb100top")[1].src;
  var newrf3 = document.getElementsByClassName("thumb100top")[2].src;
  var newrf4 = document.getElementsByClassName("thumb100top")[3].src;
  lv1 = $(ancora1).attr('href');
  lv2 = $(ancora2).attr('href');
  lv3 = $(ancora3).attr('href');
  lv4 = $(ancora4).attr('href');

  if (newrf1.length<55){
    $(ancora1).attr('href',newrf1.substring(0,newrf1.length-5)+".jpg");  $(ancora1).attr('target','_blank');
  }else{$(ancora1).attr('href',newrf1.substring(0,newrf1.indexOf("_")-1)+newrf1.substring(newrf1.indexOf("_"),newrf1.length));  $(ancora1).attr('target','_blank');}

  if (newrf2.length<55){
    $(ancora2).attr('href',newrf2.substring(0,newrf2.length-5)+".jpg");  $(ancora2).attr('target','_blank');
  }else{$(ancora2).attr('href',newrf2.substring(0,newrf2.indexOf("_")-1)+newrf2.substring(newrf2.indexOf("_"),newrf2.length)); $(ancora2).attr('target','_blank');}

  if (newrf3.length<55){
    $(ancora3).attr('href',newrf3.substring(0,newrf3.length-5)+".jpg");  $(ancora3).attr('target','_blank');
  }else{$(ancora3).attr('href',newrf3.substring(0,newrf3.indexOf("_")-1)+newrf3.substring(newrf3.indexOf("_"),newrf3.length));  $(ancora3).attr('target','_blank');}

  if (newrf4.length<55){
    $(ancora4).attr('href',newrf4.substring(0,newrf4.length-5)+".jpg"); $(ancora4).attr('target','_blank');
  }else{$(ancora4).attr('href',newrf4.substring(0,newrf4.indexOf("_")-1)+newrf4.substring(newrf4.indexOf("_"),newrf4.length)); $(ancora4).attr('target','_blank');}

  $("#header-container").append($('<tr align="right"><td style="width:360px;height:40px"><img id="relogio" src=https://i.imgur.com/qn5vlmz.gif><div id="timer"></div></td><td\
  style="padding-top:4px" valign="bottom"><button type="button" id="botus"> Avaliar </button> |->\
  <input style="width:100px;display:true" id="ave1" title="Que ave é essa?" tabindex="3" size="36" class="buscausuario ui-autocomplete-input"  name="usuario"\
  autocomplete="off">  <input style="width:100px;display:true" id="ave2" title="Que ave é essa?" tabindex="3" size="36" class="buscausuario ui-autocomplete-input"\
  name="usuario" autocomplete="off">  <input style="width:100px;display:true" id="ave3" title="Que ave é essa?" tabindex="3" size="36" class="buscausuario ui-autocomplete-input"\
  name="usuario" autocomplete="off">  <input style="width:100px;display:true" id="ave4" title="Que ave é essa?" tabindex="3" size="36" class="buscausuario ui-autocomplete-input"\
  name="usuario" autocomplete="off"></td></tr>'));
  location.href = 'javascript:void($(function() {\
  $("#ave1").autocomplete({		minLength: 2,\
					source: "getTaxonsJSON.php?idwiki=1",\
					open: zebrar,\
					select: function(event, ui) {\
          resp1 = document.getElementsByClassName("thumb100top")[0].alt;\
          document.getElementById("ave1").disabled = true;}\
					}).data( "ui-autocomplete" )._renderItem = renderBuscaTaxon;\
    $("#ave2").autocomplete({		minLength: 2,\
					source: "getTaxonsJSON.php?idwiki=1",\
					open: zebrar,\
					select: function(event, ui) {\
          resp2 = document.getElementsByClassName("thumb100top")[1].alt;\
          document.getElementById("ave2").disabled = true;}\
          }).data( "ui-autocomplete" )._renderItem = renderBuscaTaxon;\
    $("#ave3").autocomplete({		minLength: 2,\
					source: "getTaxonsJSON.php?idwiki=1",\
					open: zebrar,\
					select: function(event, ui) {\
          resp3 = document.getElementsByClassName("thumb100top")[2].alt;\
          document.getElementById("ave3").disabled = true;}\
					}).data( "ui-autocomplete" )._renderItem = renderBuscaTaxon;\
    $("#ave4").autocomplete({		minLength: 2,\
					source: "getTaxonsJSON.php?idwiki=1",\
					open: zebrar,\
					select: function(event, ui) {\
          resp4 = document.getElementsByClassName("thumb100top")[3].alt;\
          document.getElementById("ave4").disabled = true;}\
					}).data( "ui-autocomplete" )._renderItem = renderBuscaTaxon;\
  $("#ave1").jLabel();$("#ave2").jLabel();$("#ave3").jLabel();$("#ave4").jLabel();\
  $("#ave1").blur(function(e) {if(e.target.value == "") {$("#"+e.target.name+"_hidden").val("");}});\
  $("#ave2").blur(function(e) {if(e.target.value == "") {$("#"+e.target.name+"_hidden").val("");}});\
  $("#ave3").blur(function(e) {if(e.target.value == "") {$("#"+e.target.name+"_hidden").val("");}});\
$("#ave4").blur(function(e) {if(e.target.value == "") {$("#"+e.target.name+"_hidden").val("");}});}))';
 
   document.getElementById("botus").onclick = function (){
     var bubu = document.getElementById("botus").innerHTML;
     if (bubu.contains(" Seguir? ")){
       if (confirm('Mais aves?')) {
         document.getElementById("botus").innerHTML = " Avaliar ";
         reseta();
         tempoo = setInterval(function(){ contagem() }, 1000);
         } else {}                                                /// TOOODOOOOO terminar jogo e mandar respostas
    }
       else{
         document.getElementById("ave1").disabled = true;
         document.getElementById("ave2").disabled = true;
         document.getElementById("ave3").disabled = true;
         document.getElementById("ave4").disabled = true;
            para();
            seg41 = 91000;
       perg1 = document.getElementById("ave1").value;
       perg2 = document.getElementById("ave2").value;
       perg3 = document.getElementById("ave3").value;
       perg4 = document.getElementById("ave4").value;

       if (resp1.contains(perg1) && perg1 != "" && document.getElementById("ave1").disabled==true){
         ana1=certo;
         pontos++;
       }else{ana1=errado;}
       if (resp2.contains(perg2)&& perg2 != "" && document.getElementById("ave2").disabled==true){
         pontos++;
         ana2=certo;
       }else{ana2=errado;}
       if (resp3.contains(perg3)&& perg3 != "" && document.getElementById("ave3").disabled==true){
         pontos++;
         ana3=certo;
       }else{ana3=errado;}
       if (resp4.contains(perg4)&& perg4 != "" && document.getElementById("ave4").disabled==true){
         pontos++;
         ana4=certo;
       }else{ana4=errado;}
       rol+=4;
       document.getElementById("boto").innerHTML = "Jogando: "+pontos+" certos em "+rol+"!";
       $("#headertab > tbody:nth-child(1)").append($('<tr align="right" id="linha"><td></td><td valign="top"><a href="'+lv1+'" target="_blank" style=padding:40px ">'+ana1+'</a><a href="'+lv2+'"\
       style=padding:40px " target="_blank">'+ana2+'</a><a href="'+lv3+'" target="_blank" style=padding:40px ">'+ana3+'</a><a href="'+lv4+'" target="_blank" style=padding:40px "\
       >'+ana4+'</a></td></tr>'));
       document.getElementById("botus").innerHTML
       = " Seguir? ";
     }
   };
}

function reseta(){//RESETAR 4 FOTOS
  $("#header-container > tr:nth-child(2)").remove();
  $("#headerimg").load("location.href #headerimg",function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success")
            perguntas(); //$("#headerimg").get(0).scrollIntoView();
        if(statusTxt == "error")
            alert("Erro: Sua internet é muito lenta para jogar."); //window.location.reload(true);
    });
}

function blink(x){
  var target = document.querySelector(x);
  var count = 0;
  var speed = 200;
  var id = setInterval(myFunction,speed);
  function myFunction(){
    if(count == 0) {
      target.style.opacity = "0";
      count++;
    }
    else if(count == 1){
     target.style.opacity = '1';
     count = 0;
    }
  }
}

function protege (){
  if((document.URL).contains('fotos')){
   document.addEventListener('contextmenu', function(e) {
            alert("© Imagem protegida pela Lei de Direito Autoral (nº 9610/98). É proibida a cópia e a reprodução sem autorização expressa do autor.");
            e.preventDefault();
        }, false);
  }
  else{}
  }

function postarGoogle(){
  var gog = "&#x61;&#x48;&#x52;&#x30;&#x63;&#x48;&#x4D;&#x36;&#x4C;&#x79;&#x39;&#x6B;&#x62;&#x32;&#x4E;&#x7A;&#x4C;&#x6D;&#x64;&#x76;&#x62;&#x32;&#x64;&#x73;&#x5A;&#x53;&#x35;&#x6A;&#x62;&#x32;&#x30;&#x76;&#x5A;&#x6D;&#x39;&#x79;&#x62;&#x58;&#x4D;&#x76;&#x5A;&#x43;&#x38;&#x78;&#x56;&#x30;&#x31;&#x4A;&#x4E;&#x30;&#x31;&#x4F;&#x51;&#x6E;&#x6F;&#x32;&#x64;&#x6B;&#x31;&#x43;&#x4D;&#x48;&#x64;&#x48;&#x65;&#x45;&#x70;&#x69;&#x63;&#x46;&#x70;&#x34;&#x62;&#x54;&#x49;&#x78;&#x52;&#x30;&#x31;&#x68;&#x57;&#x6B;&#x52;&#x61;&#x61;&#x6C;&#x68;&#x4F;&#x62;&#x57;&#x74;&#x4B;&#x56;&#x30;&#x4E;&#x32;&#x56;&#x32;&#x56;&#x50;&#x4E;&#x43;&#x39;&#x6D;&#x62;&#x33;&#x4A;&#x74;&#x55;&#x6D;&#x56;&#x7A;&#x63;&#x47;&#x39;&#x75;&#x63;&#x32;&#x55;&#x3D;";
  var nomejogador = prompt("Fim de Jogo!\nAcertou "+pontos+" aves em "+rol+"!\nSeu nome:",usuario);
  if (nomejogador == null){
    
  }else{          
  $.ajax({
                url: atob(he.decode(gog)),
                data: {"entry.2005439514" : nomejogador, "entry.752287174" : pontos},
                type: "POST",
                dataType: "xml",
                statusCode: {
                    0: function (){ 
                      nomejogador;
                      pontos;
                      window.open("https://docs.google.com/spreadsheets/d/1StrduhAXDAbAt7nxiMPZnwkHVQIbUnCfJ_anldpcjyQ/edit#gid=1950740070");
                    },
                    200: function (){
                      nomejogador;
                      pontos;
                      window.open("https://docs.google.com/spreadsheets/d/1StrduhAXDAbAt7nxiMPZnwkHVQIbUnCfJ_anldpcjyQ/edit#gid=1950740070");
                                  }
                }
  });}
        
}

function contagem(){
  $("#relogio").show();$("#timer").show();
  var distance = seg41 - segundo;
  seg41 -= segundo;
  var seconds = Math.floor((distance % (1000 * 91)) / 1000);
  document.getElementById("timer").innerHTML = seconds + "s ";
  if (distance <= 0) {
    clearInterval(tempoo);
    $("#botus").click();  
    $("#relogio").hide();$("#timer").hide();
    seg41 = 91000;
  }
}

function para(){
  $("#relogio").hide();$("#timer").hide();
  clearInterval(tempoo);
}

function removerlinks (){
  for (var c = 0;c<4;c++){
    document.getElementsByClassName("menusub")[0].remove(); 
  }
  $('.divConteudo').html("- Durante o jogo não feche essa aba ou perderá seu progresso.<p>- Para sair do jogo basta apenas atualizar a página (F5)<\p>\
  <p>- Você tem 90 segundos para tentar adivinhar as 4 aves. (Clique em Avaliar caso já tenha respondido no tempo hábil)<\p><p>- Caso o tempo acabe,\
   as respostas serão avaliadas automáticamente.<\p><p>- Clique em 'Errou'' ou 'Correto'' para verificar a página do registro daquela ave (o gabarito).<p>\
   - Lembre-se que sua resposta só será válida se digitar o nome comum/científico da ave na caixa de resposta e escolher a ave na lista que surgir.<\p><p>- Uma vez o nome \
   escolhido não há como trocá-lo.<\p>");
   document.getElementsByClassName("divDireita")[0].remove();
   $("#102").remove();$("#100").remove();$("#107").remove();
}

waitForKeyElements('#tabsMelhores', comeca);
waitForKeyElements('body', protege);