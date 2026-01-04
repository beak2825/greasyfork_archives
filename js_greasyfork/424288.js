// ==UserScript==
// @name Mover Army Minas Ggg jimmy
// @namespace kowsky.org
// @version 0.2
// @description Imperiaonline movearmy for v5, v6
// @match http://*/imperia/game_v5/game/villagejs.php
// @match https://*/imperia/game_v5/game/villagejs.php
// @match http://*/imperia/game_v5/game/village.php
// @match https://*/imperia/game_v5/game/village.php

// @match http://*/imperiaonline/game_v5/game/villagejs.php
// @match https://*/imperiaonline/game_v5/game/villagejs.php
// @match http://*/imperiaonline/game_v5/game/village.php
// @match https://*/imperiaonline/game_v5/game/village.php

// @match http://*/imperiaonline.org/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/game_v5/game/villagejs.php
// @match http://*/imperiaonline.org/game_v5/game/village.php
// @match https://*/imperiaonline.org/game_v5/game/village.php

// @match http://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match http://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/imperia/game_v5/game/villagejs.php

// @match https://www127.imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match http://www127.imperiaonline.org/imperia/game_v5/game/villagejs.php
// @copyright 2012+, You
// @downloadURL https://update.greasyfork.org/scripts/424288/Mover%20Army%20Minas%20Ggg%20jimmy.user.js
// @updateURL https://update.greasyfork.org/scripts/424288/Mover%20Army%20Minas%20Ggg%20jimmy.meta.js
// ==/UserScript==

function addJQuery(callback) {
var script = document.createElement("script");
script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
script.addEventListener('load', function() {
var script = document.createElement("script");
script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
document.body.appendChild(script);
}, false);
}

$(document).ready(function(){

var mina1 = 63202751;
var mina2 = 63164082;
var mina3 = 63201161;

if (typeof(Storage) !== "undefined") {
}
else {
alert("Desculpe! web storage não suportado, esse script não vai funcionar neste browser, aconselho a utilizar Mozilla Firefox ou Google Chrome");
}

// Store
if(localStorage.getItem("localizacao_inimigo") == null || localStorage.getItem("localizacao_inimigo") == ""){
localStorage.setItem("localizacao_inimigo", mina1);
}
else
{
if(localStorage.getItem("localizacao_inimigo") == mina1){
localStorage.setItem("localizacao_inimigo", mina3);
}
else if(localStorage.getItem("localizacao_inimigo") == mina2){
localStorage.setItem("localizacao_inimigo", mina1);
}
else if(localStorage.getItem("localizacao_inimigo") == mina3){
localStorage.setItem("localizacao_inimigo", mina2);
}
}

// Inimigo
var localizacao_Do_Inimigo = localStorage.getItem("localizacao_inimigo");

// Exercito
// var Falanges = 21543; // M_P3
// var Arqueiros_De_Elite = 31922; // M_S3
// var Guardioes = 14863; // M_M3
// var Cavalaria_De_Elite = 28237; // M_K3
var Lanceiros_De_Dardos = 2565; // M_P1
var Arietes = 7; // M_C1
var Carrinhos = 1039; // M_CT
var Cavalaria_Leve = 9386; // M_K1
var Arqueiros_Cavalo_Leve = 494; // M_K4
var Catapultas = 97; // M_C2
//var Trabucos = 25;  // M_C3
var Balistas = 198; // M_C4
var Cavalaria_Pesada = 19037; // M_K2
var Arqueiros_Pesados = 6050; // M_S2
var Espadaschis_Pesados = 17239; // M_M2
var Espadachins_Leves = 68; // M_M1
var Arqueiros_Leves = 49; // M_S1
var Lanceiros_Pesados = 7100;  // M_P2

$("#WzTtDiV").append('<div id="vidAtackkMina"></div>');
$("#vidAtackkMina").append("<form id='sendAttackForm' onsubmit='return false;'></form>");

// Localização do inimigo - Obs: Não mexa nisso
/*Localização do inimigo*/ $("#sendAttackForm").append("<input type='hidden' name='foundId' id='checkMe' value="+localizacao_Do_Inimigo+">");


// Form de ataque

$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_C2' id='M_C2' value="+Catapultas+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Catapultas+")?"+Catapultas+":tv);calcArmyCapacyty(2)'>");
//$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_C3' id='M_C3' value="+Trabucos+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Trabucos+")?"+Trabucos+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_P2' id='M_P2' value="+Lanceiros_Pesados+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Lanceiros_Pesados+")?"+Lanceiros_Pesados+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_M1' id='M_M1' value="+Espadachins_Leves+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Espadachins_Leves+")?"+Espadachins_Leves+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_M2' id='M_M2' value="+Espadaschis_Pesados+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Espadaschis_Pesados+")?"+Espadaschis_Pesados+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_P1' id='M_P1' value="+Lanceiros_De_Dardos+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Lanceiros_De_Dardos+")?"+Lanceiros_De_Dardos+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_K1' id='M_K1' value="+Cavalaria_Leve+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Cavalaria_Leve+")?"+Cavalaria_Leve+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_K4' id='M_K4' value="+Arqueiros_Cavalo_Leve+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Arqueiros_Cavalo_Leve+")?"+Arqueiros_Cavalo_Leve+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_K2' id='M_K2' value="+Cavalaria_Pesada+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Cavalaria_Pesada+")?"+Cavalaria_Pesada+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_C4' id='M_C4' value="+Balistas+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Balistas+")?"+Balistas+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_S1' id='M_S1' value="+Arqueiros_Leves+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Arqueiros_Leves+")?"+Arqueiros_Leves+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_S2' id='M_S2' value="+Arqueiros_Pesados+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Arqueiros_Pesados+")?"+Arqueiros_Pesados+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_CT' id='M_CT' value="+Carrinhos+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Carrinhos+")?"+Carrinhos+":tv);calcArmyCapacyty(2)'>");
$("#sendAttackForm").append("<input type='text' class='input-v2' name='M_C1' id='M_C1' value="+Arietes+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Arietes+")?"+Arietes+":tv);calcArmyCapacyty(2)'>");
// $("#sendAttackForm").append("<input type='text' class='input-v2' name='M_K3' id='M_K3' value="+Cavalaria_De_Elite+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Cavalaria_De_Elite+")?"+Cavalaria_De_Elite+":tv);calcArmyCapacyty(2)'>");
// $("#sendAttackForm").append("<input type='text' class='input-v2' name='M_M3' id='M_M3' value="+Guardioes+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Guardioes+")?"+Guardioes+":tv);calcArmyCapacyty(2)'>");
// $("#sendAttackForm").append("<input type='text' class='input-v2' name='M_S3' id='M_S3' value="+Arqueiros_De_Elite+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Arqueiros_De_Elite+")?"+Arqueiros_De_Elite+":tv);calcArmyCapacyty(2)'>");
// $("#sendAttackForm").append("<input type='text' class='input-v2' name='M_P3' id='M_P3' value="+Falanges+" onkeyup='tv=IsNumeric(this.value);this.value=((tv>"+Falanges+")?"+Falanges+":tv);calcArmyCapacyty(2)'>");

// Obs: Não mexa nisso
$("#sendAttackForm").append("<input type='hidden' name='nomer' id='nomer' value='1'>");
$("#sendAttackForm").append("<a href='javascript: void(0);' rel='0' onclick='document.getElementById('nomer').value=1; xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),document.getElementById('checkMe').value,666);'>1</a>");


// ********* Método de ataque Campal ou Cerco: Só pode escolher um dos dois. Descomenta o que quiser e comenta o que não quer **********

// Cerco a fortaleza
$("#sendAttackForm").append("<button type='button' name='move' class='button-v2 med-green' onclick='xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),document.getElementById('checkMe').value,1);SetFocusTop();' value='Cerco à Fortaleza'>Cerco à Fortaleza</button>");
xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),document.getElementById('checkMe').value,1);SetFocusTop();

// Batalha Campal
//$("#sendAttackForm").append("<button type='button' name='move' class='button-v2 med-green' onclick='xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),document.getElementById('checkMe').value,2);SetFocusTop();' value='Batalha campal'>Batalha campal</button>");
//xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),document.getElementById('checkMe').value,2);SetFocusTop();


// Ação para abrir a aba de missões: Caso queira que apareça, descomente a linha de baixo
//xajax_listBlueFlag(containersStuff.findContaner({saveName:'showBlueMissions',template:'untabbed', title:'As minhas missões'}));


// Validando ataques
if($('#missions').html() != null && $('#missions .incoming.province').html() != null){
$('body').css('background',"red");
 window.open("https://mp3.fastupload.co/data/1615671550/07-Break-Me-Out.mp3");
}else{
$('body').css('background',"green");
}

// Verificação do ouro
if(parseFloat($("#resources-list #gold a").text().trim()) < 100000)
{
window.open("https://mp3.fastupload.co/data/1615671550/07-Break-Me-Out.mp3");
}
});

setInterval(
function checker(){
window.location.href= $(location).attr('href');
},15000);//10s
