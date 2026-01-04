// ==UserScript==
// -----------------------------------------------------------------------------------------------
// @name Script Fakes Automatico On
// @author Eu
// @email felipe.fmedeiros95@gmail.com
// @namespace https://www.fmedeiros.com.br
// @version 1.0
// @grant Publico
// @description Script que facilita o envio de fakes.
// -----------------------------------------------------------------------------------------------
// @include http*://*.die-staemme.de/*
// @include http*://*.staemme.ch/*
// @include http*://*.tribalwars.net/*
// @include http*://*.tribalwars.nl/*
// @include http*://*.plemiona.pl/*
// @include http*://*.tribalwars.se/*
// @include http*://*.tribos.com.pt/*
// @include http*://*.divokekmeny.cz/*
// @include http*://*.triburile.ro/*
// @include http*://*.voyna-plemyon.ru/*
// @include http*://*.fyletikesmaxes.gr/*
// @include http*://*.tribalwars.no.com/*
// @include http*://*.divoke-kmene.sk/*
// @include http*://*.klanhaboru.hu/*
// @include http*://*.tribalwars.dk/*
// @include http*://*.plemena.net/*
// @include http*://*.tribals.it/*
// @include http*://*.klanlar.org/*
// @include http*://*.guerretribale.fr/*
// @include http*://*.guerrastribales.es/*
// @include http*://*.tribalwars.fi/*
// @include http*://*.tribalwars.ae/*
// @include http*://*.tribalwars.co.uk/*
// @include http*://*.vojnaplemen.si/*
// @include http*://*.genciukarai.lt/*
// @include http*://*.wartribes.co.il/*
// @include http*://*.plemena.com.hr/*
// @include http*://*.perangkaum.net/*
// @include http*://*.tribalwars.jp/*
// @include http*://*.tribalwars.bg/*
// @include http*://*.tribalwars.asia/*
// @include http*://*.tribalwars.us/*
// @include http*://*.tribalwarsmasters.net/*
// @include http*://*.tribalwars.com.br/*
// @downloadURL https://update.greasyfork.org/scripts/396676/Script%20Fakes%20Automatico%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/396676/Script%20Fakes%20Automatico%20On.meta.js
// ==/UserScript==

if (game_data.screen != 'place')
console.log('Você deve executar o script na praça de reunião!');
else if (game_data.player.premium === false)
UI.ErrorMessage('Você precisa de uma conta premium para que o script funcione!');
else {
/* Helper Functions */
var nextVillage = function() {
$('.arrowRight, .groupRight').click();
};
var alertCaptcha = function() {
$("<audio id='audio' autoplay><source src='nada' type='audio/mp3' /></audio>").appendTo("body");
setTimeout(function() {
alert('Para que o assistente de fakes possa continuar, você deve resolver o captcha!');
}, 5000);
};

if ($('body').data('bot-protect') !== undefined)
alertCaptcha();
else if ($.cookie('nextVill') == '1') {
$.cookie('nextVill', '0');
nextVillage();}
    else {
var targets = '460|526 461|529 457|531 456|528 452|531 463|524 458|526 478|529 456|525 467|519 467|528 468|528 470|531 467|526 467|527 472|528 468|526 467|529 468|527 473|527 463|531 467|532 470|530 465|517 401|637 464|538 476|527 477|525 476|525 465|538 480|527 483|529 466|538 481|654 486|653 479|652 469|525 471|523 466|524 470|524 471|524 475|522 471|520 471|528 470|521 469|523 475|523 471|521 478|521 470|520 396|610 397|611 466|520 399|614 400|611'
units = {
'spear': 0, // Lanceiro
'sword': 0, // Espadachim
'axe': 20, // Bárbaro
'archer': 0, // Arqueiro
'spy': 5, // Explorador
'light': 20, // Cavalaria leve
'marcher': 0, // Arqueiro à cavalo
'heavy': 0,  // Cavalaria pesada
'ram': 1, // Ariete
'catapult': 0, // Catapulta
'snob': 0, // Nobre
'knight': 0, // Paladino
};

var isSupport = false, // Enviar como apoio?
cookieName = 'bs'; // Informe aqui o nome do cookie

var actual = parseInt($.cookie(cookieName));
if (!actual) {
actual = 0;
$.cookie(cookieName, actual);
}

var coords = targets.split(' ');
if (coords.length && document.URL.search(/try=confirm/) === -1 && document.forms[0].x.value === "" && document.forms[0].y.value === "") {
if (actual >= coords.length) {
if (confirm('Último ataque já foi enviado, continuar?'))
actual = 0;
else
actual = -1;
}
if (actual >= 0) {
var target = coords[actual],
coord = target.split('|'),
xxx = coord[0],
yyy = coord[1];

$.cookie(cookieName, actual + 1);

document.forms[0].x.value = xxx;
document.forms[0].y.value = yyy;

$.each(game_data.units, function(key, value) {
if (value != 'militia')
insertUnit(document.forms[0][value], units[value]);
});

if (isSupport) document.forms[0].support.click();
else document.forms[0].attack.click();
}
} else if (coords.length && document.URL.search(/try=confirm/) != -1) {
document.forms[0].submit.click();

$.cookie('nextVill', '1');
}
}
}