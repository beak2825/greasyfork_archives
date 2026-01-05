// ==UserScript==
// @name         Recoger Moneditas V1
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Exprimiendo a Gary!
// @author       Fabián René
// @match        http://agar.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25001/Recoger%20Moneditas%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/25001/Recoger%20Moneditas%20V1.meta.js
// ==/UserScript==

var tiempo=0;
var controlador;
var step = 0;
var namef = ".agario-profile-name";
var facebookButton = document.getElementsByClassName("btn-fb")[0];
var googleButton = document.getElementsByClassName("btn-gplus")[0];
var coinsButton = document.getElementById("gifting");
var canvas = document.getElementById("openfl-content").childNodes[0];
const tenMinutes = 9;
$("<p id='monedasRecogidas'>Monedas:</p>").insertAfter($('#mainPanel h2'));
$("<button id='btnIniciar' class='btn btn-success'>Iniciar</button>").insertBefore($('#monedasRecogidas'));
$('#btnIniciar').on('click', iniciarClick);
var monedas = parseInt($('.agario-wallet-label').text().replace(' ',''));

$(document).ready(function(){
    // Loguear al Usuario si no lo está
    if ( $('#instructions').css("display") == "none") {
        loginuser();
    }
    // Iniciar automáticamente si se reinicio por código
    if (getCookie("reiniciar")=="si") {
        setCookie("reiniciar","no");
        setTimeout(function(){$('#btnIniciar').click();},5000);
    }
});
quitarPublicidad();

function quitarPublicidad(){
    $("#advertisement").remove();
    $(".us-elections").remove();
    $(".agario-promo").remove();
    $(".diep-cross").remove();
    $(".agario-panel.agario-side-panel.agario-shop-panel").insertBefore($('.agario-party'));
    $('#rightPanel').css("width",223);
    $('.tosBox').remove();
    $('#adsBottom').remove();
}

function tick() {
    if (monedas==100) monedas = parseInt($('.agario-wallet-label').text().replace(' ',''));
    var circuloRojo = $(".circle.small.red.gifts");
    var actual = parseInt($('.agario-wallet-label').text().replace(' ',''));
    var diferencia = actual - monedas;
    $('#monedasRecogidas').html('Monedas: ' +diferencia + '<br>' + tiempo + 's' + '<br>' + parseInt((diferencia/tiempo)*3600) + ' /hora' );
    if (step >= 0 && ( ($(namef).text() === "Guest") || ($('#helloContainer').attr('data-logged-in') == "0") )) step = -10;
    if (circuloRojo.css("display")=='block' && step<6) step=6;
    switch (step) {
        case -10:
            loginUser();
            setTimeout(function(){
                setCookie("reiniciar","si");
                location.reload(true);
            },5000);
            break;
        case 0:
            cambiarRegion();
            break;
        case 5:
            if (circuloRojo.css("display")=='none'){
                step=-1;
            }
            break;
        case 6:
            triggerMouseEvent("click", coinsButton, 0, 0);
            break;
        case 7:
            triggerMouseEvent("mousedown", canvas, window.innerWidth / 2 - 60, window.innerHeight / 2 - 90);
            triggerMouseEvent("mouseup", canvas, window.innerWidth / 2 - 60, window.innerHeight / 2 - 90);
            break;
        case 8:
            triggerKeyboardEvent("keydown", canvas, 27);
            break;
        case tenMinutes:
            step = -1;
            break;
        default:
    }
    step = step + 1;
    tiempo = tiempo +1;
    //if (window.storageInfo.context) window.localStorage.collectContext = window.storageInfo.context;
}

function cambiarRegion(){
    switch ($('#region').val()) {
        case "US-Atlanta":
            MC.setRegion('BR-Brazil');
            break;
        case "BR-Brazil":
            MC.setRegion('EU-London');
            break;
        default:
            MC.setRegion('US-Atlanta');
    }
}
function triggerMouseEvent(type, elem, x, y) {
    var e = new Event(type, {bubbles: true, cancelable: true});
    e.clientX = x;
    e.clientY = y;
    elem.dispatchEvent(e);
}

function triggerKeyboardEvent(type, elem, keyCode) {
    var e = new Event(type, {bubbles: true, cancelable: true});
    e.keyCode = keyCode;
    e.which = keyCode;
    elem.dispatchEvent(e);
}

function loginUser() {
    $('.btn-login-play')[0].click();
    setTimeout(function () {
        if (window.localStorage.collectContext === "facebook") $("#socialLoginContainer .btn-fb")[0].click();
        if (window.localStorage.collectContext === "google") $("#socialLoginContainer .btn-gplus")[0].click();
    }, 1000);
}
function iniciarClick(){
    controlador = setInterval(tick, 1000);
    $('#btnIniciar').remove();
    $("<button id='btnParar' class='btn btn-danger'>Parar</button>").insertBefore($('#monedasRecogidas'));
    $('#btnParar').on('click', pararClick);
}

function pararClick(){
    clearInterval(controlador);
    $('#btnParar').remove();
    $("<button id='btnIniciar' class='btn btn-success'>Iniciar</button>").insertBefore($('#monedasRecogidas'));
    $('#btnIniciar').on('click', iniciarClick);
}

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}