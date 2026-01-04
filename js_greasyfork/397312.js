// ==UserScript==
// @name                Auto Fake Tribal Wars
// @namespace           @@marcosvinicius.santosmarques
// @icon                https://i.imgur.com/7WgHTT8.gif
// @website             https://tribalwarsbr100.wixsite.com/tw100
// @email               tribalwarsbr100@gmail.com
// @description         .Js feito para o game tribal wars, com finalidade de realizar comandos automatizados para atacar qualquer tipo de aldeia, deis que seja prenchido na tabela a coordenada da mesma. ou seja envio de fakes ou ataques reais. com painel com leque de opções podendo fazer toda tarefa sem a necessidade nenhuma de se modificar o codigo do script, ou mecher no mesmo toda vez que for atualizar coordenadas. ou tipos de tropas. ou quantidades de tropas.
// @codigo              Conteudo feito em linguagem javascript com base em EcmaScript totalmente Opensource
// @author              Marcos v.s Marques
// @copyright           2018, Tribalwarsbr100 (https://openuserjs.org//users/Tribalwarsbr100)
// @version             0.0.1
// @license             AGPL-3.0-or-later
// @include             http*://*.*screen=place&try=confirm*
// @include             http*://*.*screen=place*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397312/Auto%20Fake%20Tribal%20Wars.user.js
// @updateURL https://update.greasyfork.org/scripts/397312/Auto%20Fake%20Tribal%20Wars.meta.js
// ==/UserScript==

/////CONFIRMAR O BOTÃO!/////



setInterval(function () {document.getElementById("troop_confirm_go").click();}, Math.random()*50+300);

var paginagame = document.getElementById("topContainer");
if(!paginagame ){
  var Audio_Alarme= document.createElement("audio");
  Audio_Alarme.src = "https://www.dropbox.com/s/aa8zx2n4cwg8phz/Toque_no_Altar_Olha_Pra_%20Mim_www.toquesengracadosmp3.com.mp3";
  Audio_Alarme.play();
  Audio_Alarme.loop = "true";
}


var botchecker = document.getElementById("bot_check_image");
if(botchecker){
  var audio_Alarme = document.createElement("audio");
  audio_Alarme .src = "https://www.dropbox.com/s/aa8zx2n4cwg8phz/Toque_no_Altar_Olha_Pra_%20Mim_www.toquesengracadosmp3.com.mp3";
  audio_Alarme .play();
  audio_Alarme .loop = "true";
}

////PAINEL CSS - Iniciar ou Parar ///
var brasil= document.createElement("button");
var brasil_text = document.createTextNode("Iniciar");
brasil.appendChild(brasil_text);
brasil.style.position="fixed";
brasil.style.top="90%";
brasil.style.height="4%";
brasil.style.width="8%";
brasil.style.left="9%";
brasil.style.borderStyle = "ridge";
brasil.style.borderColor = "brown";
brasil.style.textAlign="center";
brasil.style.zIndex="999";
brasil.addEventListener("click", brasileiros);
document.body.appendChild(brasil);

function brasileiros(event){
brasil_text.nodeValue = brasil_text.nodeValue == 'Iniciar' ? 'Parar' : 'Iniciar';
GM_setValue("brasil_text", brasil_text.nodeValue);
}
brasil_text.nodeValue = GM_getValue("brasil_text", "");


////CONFIGURAÇÃO PAINEL GERAL CSS////
var config = document.createElement("div");
  config.style.position="fixed";
  config.style.background="#d2c09e";
  config.style.top="90px";
  config.style.height="450px";
  config.style.width="250px";
  config.style.textAlign="center";
  config.style.zIndex="999";
  config.style.visibility="hidden";
  document.body.appendChild(config);

////PAINEL CSS ABRIR OU FECHAR PAINEL////
var Aberto = document.createElement("button");
var Aberto_text = document.createTextNode("Aberto");
  Aberto.appendChild(Aberto_text);
  Aberto.style.position="fixed";
  Aberto.style.top="90%";
  Aberto.style.height="4%";
  Aberto.style.width="8%";
  Aberto.style.left="1%";
  Aberto.style.borderStyle = "ridge";
  Aberto.style.borderColor = "brown";
  Aberto.style.textAlign="center";
  Aberto.style.zIndex="999";
  Aberto.addEventListener("click", Aberto_c);
  document.body.appendChild(Aberto);

function Aberto_c(event) {
  config.style.visibility = config.style.visibility == 'visible' ? 'hidden' : 'visible';
  Aberto_text.nodeValue = Aberto_text.nodeValue == 'Aberto' ? 'Fechado' : 'Aberto';
  GM_setValue("Aberto_a", Aberto_text.nodeValue);
  GM_setValue("Aberto_cc", config.style.visibility);
}
config.style.visibility = GM_getValue("Aberto_cc", "");
Aberto_text.nodeValue = GM_getValue("Aberto_a", "");

  ////PAINEL CSS COORDENADAS/////
  var coordtext = document.createTextNode("➡➡➡ ✅ 🎮  🇧🇷  AUTO ATAQUE  🇧🇷 🎮 ⬅⬅⬅");
  var coordDtext = document.createTextNode("🎱 INSIRA AS COORDENADAS ABAIXO 🎱");
  config.appendChild(coordtext);
config.appendChild(coordDtext);
  var coordinput=document.createElement("textarea");
  coordinput.style.width = "230px";
  coordinput.style.height= "100px";
  config.appendChild(coordinput);
  coordinput.value=GM_getValue("Coordenadas", "");

////TEMPORIZADOR DE INDICADOR (repetidor de envios) //////

if(GM_getValue("brasil_text", "") == "Parar"){
  var br_miniseg_t = document.getElementById("units_entry_all_light").innerHTML;
  var br_miniseg_s  = br_miniseg_t.match(/\d/g);
  br_miniseg_s = br_miniseg_s.join("");
    var min_br_meniseg = 12;
    function tick(){
      var coords = coordinput.value.split(" ");
      var sp=document.getElementsByName("input")[0];
      var c = GM_getValue("lastcoordid", "");
      c+=1;
      sp.value=coords[c];
      GM_setValue("lastcoordid", c);
        if(coords.length <= c){
          c=0;
          sp.value=coords[c];
          GM_setValue("lastcoordid", c);
          setInterval(function() {document.getElementById("target_attack").click();}, Math.random()*100+500); // Repetidor de Envios //
        } else {
          document.getElementById("target_attack").click();
        }
    }
  setTimeout(tick,Math.random()*60+100);
} 
 







  //// MODELO DE TROPAS ////
  //// LANCEIROS ///
  var lanceiroskep = document.createElement("img");
  lanceiroskep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_spear.png?48b3b"
  config.appendChild(lanceiroskep);
  var lanceiros=document.createElement("input");
  config.appendChild(lanceiros);
  lanceiros.value=GM_getValue("lanceirosTW100", "");
  lanceirosi=document.getElementById("unit_input_spear");
  lanceirosi.value=lanceiros.value;

  var sortores = document.createElement("br");
  config.appendChild(sortores);

  //// ESPADACHIM ////
  var espadachimkep = document.createElement("img");
  espadachimkep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_sword.png?b389d"
  config.appendChild(espadachimkep);
  var espadachim=document.createElement("input");
  config.appendChild(espadachim);
  espadachim.value=GM_getValue("espadachimTW100", "");
  espadachimi=document.getElementById("unit_input_sword");
  espadachimi.value=espadachim.value;

  var sortores1 = document.createElement("br");
  config.appendChild(sortores1);

  //// BARBAROS ////
  var barbaroskep = document.createElement("img");
  barbaroskep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_axe.png?48b3b"
  config.appendChild(barbaroskep);
  var barbaros=document.createElement("input");
  config.appendChild(barbaros);
  barbaros.value=GM_getValue("barbarosTW100", "");
  barbarosi=document.getElementById("unit_input_axe");
  barbarosi.value=barbaros.value;

  var sortores2 = document.createElement("br");
  config.appendChild(sortores2);

  ////  EXPLORADOR  ////
  var exploradorkep = document.createElement("img");
  exploradorkep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_spy.png?48b3b"
  config.appendChild(exploradorkep);
  var explorador=document.createElement("input");
  config.appendChild(explorador);
  explorador.value=GM_getValue("exploradorTW100", "");
  exploradori=document.getElementById("unit_input_spy");
  exploradori.value=explorador.value;

  var sortores3 = document.createElement("br");
  config.appendChild(sortores3);

  //// CAVALARIA LEVE ////
  var Cavalaria_levekep = document.createElement("img");
  Cavalaria_levekep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_light.png?48b3b"
  config.appendChild(Cavalaria_levekep);
  var Cavalaria_leve=document.createElement("input");
  config.appendChild(Cavalaria_leve);
  Cavalaria_leve.value=GM_getValue("Cavalaria_leveTW100","");
  Cavalaria_levei=document.getElementById("unit_input_light");
  Cavalaria_levei.value=Cavalaria_leve.value;

  var sortores4 = document.createElement("br");
  config.appendChild(sortores4);

  //// CAVALARIA PESADA ////
  var cavalaria_pesadakep = document.createElement("img");
  cavalaria_pesadakep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_heavy.png?48b3b"
  config.appendChild(cavalaria_pesadakep);
  var cavalaria_pesada=document.createElement("input");
  config.appendChild(cavalaria_pesada);
  cavalaria_pesada.value=GM_getValue("cavalaria_pesadaTW100", "");
  cavalaria_pesadai=document.getElementById("unit_input_heavy");
  cavalaria_pesadai.value=cavalaria_pesada.value;

  var sortores5 = document.createElement("br");
  config.appendChild(sortores5);

  //// ARIETE ////
  var arietekep = document.createElement("img");
  arietekep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_ram.png?48b3b"
  config.appendChild(arietekep);
  var ariete=document.createElement("input");
  config.appendChild(ariete);
  ariete.value=GM_getValue("arieteTW100", "");
  arietei=document.getElementById("unit_input_ram");
  arietei.value=ariete.value;

  var sortores6 = document.createElement("br");
  config.appendChild(sortores6);

  //// CATAPULTA ////
  var catapultakep = document.createElement("img");
  catapultakep.src = "http://dsbr.innogamescdn.com/8.31/24103/graphic/unit/unit_catapult.png?48b3b"
  config.appendChild(catapultakep);
  var catapulta=document.createElement("input");
  config.appendChild(catapulta);
  catapulta.value=GM_getValue("catapultaTW100", "");
  catapultai=document.getElementById("unit_input_catapult");
  catapultai.value=catapulta.value;

  var sortores7 = document.createElement("br");
  config.appendChild(sortores7);

//// Encaixe dos Modelos de Tropas////
  function memoria(event){

    GM_setValue("Coordenadas", coordinput.value);
    GM_setValue("lanceirosTW100", lanceiros.value);
    GM_setValue("espadachimTW100", espadachim.value);
    GM_setValue("barbarosTW100", barbaros.value);
    GM_setValue("exploradorTW100", explorador.value);
    GM_setValue("Cavalaria_leveTW100", Cavalaria_leve.value);
    GM_setValue("cavalaria_pesadaTW100", cavalaria_pesada.value);
    GM_setValue("arieteTW100", ariete.value);
    GM_setValue("catapultaTW100", catapulta.value);

  }
  var memoria_salvar=document.createElement("button");
  memoria_salvar.appendChild(document.createTextNode("Salvar"));
  memoria_salvar.addEventListener("click", memoria);
  config.appendChild(memoria_salvar);
