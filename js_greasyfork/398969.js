// ==UserScript==
// @name         cursors.io hack --tradução-- (2020)
// @namespace    q1k
// @version      1.2.1
// @description  cursorsio hack - drawing, texting, player ids, & more
// @author       q1k
// @match        http://cursors.io/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/398969/cursorsio%20hack%20--tradu%C3%A7%C3%A3o--%20%282020%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398969/cursorsio%20hack%20--tradu%C3%A7%C3%A3o--%20%282020%29.meta.js
// ==/UserScript==


/*
   ___ _   _ _ __ ___  ___  _ __ ___   _  ___
  / __| | | | `__/ __|/ _ \| `__/ __| | |/ _ \
 | (__| |_| | |  \__ \ (_) | |  \__ \_| | (_) |
  \___|\__,_|_|  |___/\___/|_|  |___(_)_|\___/

para uma versão mais atualizada, clique aqui:
https://greasyfork.org/scripts/369975

*/
/*     como usar:
    -> Vá para cursors.io, abra o console (ctrl + shift + j ou F12)
       e cole esse script inteiro no console e pressione enter
        -se você tiver problemas ao executar o script, certifique-se de bloquear "cursors.io/client_out.js"
    -> Para digitar: digite a mensagem e pressione Enter; shift + enter para nova linha;
       -todas as caracteres ASCII estão disponiveis.
    -> Para mover o cursor apenas ao clicar pressione delete
       -O Pathfinder estará ativo neste modo (CTRL + clique para ignorar o Pathfinder)
       - tente não usar um valor muito baixo do atraso, ou você poderá se desconectar em alguns níveis
       - verifique se 'nenhum bloqueio do cursor' está marcado para que o pathfinder funcione corretamente
    -> Para mover o cursor normalmente: pressione delete. novamente
    -> para desenhar um circulo em volta do seu cursor precione numpad 0 ou insert
    -> para parar de desenhar o circulo precione numpad 0 ou insert
    -> para desenhar setas use as setas do teclado
    -> para desenhar imagens diferentes: precione numpad 1 - numpad 9 teclas
    -> para alterar o tamanho da imagem use numpad + e -
    -> Redefinir o tamanho do desenho com o numpad *
    -> para ver os id's dos cursores use F8
    -> para mudar a posição do id precione F9
    -> para mostrar essa ajuda precione F1
*/

var _tempOnClose;
var _tempChangeCanvasID = undefined;
var canvas = document.getElementById("canvas"),
    _tempEvt = function() {
        _tempOnClose();
    };
if (_tempChangeCanvasID != undefined) canvas.setAttribute("id", _tempChangeCanvasID);
if (canvas.style.cursor == "none") {
    var _tempWSSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(send) {
        return function(data) {
            if (this.readyState == 1) {
                this.onclose = _tempEvt;
                this.close();
            }
            if (this.readyState > 0) {
                clearInterval(_tempInterval);
                WebSocket.prototype.send = _tempWSSend;
            }
            return {}
        }
    }(WebSocket.prototype.send);
    var _tempCanvasEvent = function(_mevt) {
        var _tempMouseEvent;
        if (document.createEvent) {
            _tempMouseEvent = document.createEvent("HTMLEvents");
            _tempMouseEvent.initEvent(_mevt, true, true);
        } else {
            _tempMouseEvent = document.createEventObject();
            _tempMouseEvent.eventType = _mevt;
        }
        _tempMouseEvent.eventName = _mevt;
        if (document.createEvent) {
            canvas.dispatchEvent(_tempMouseEvent);
        } else {
            canvas.fireEvent("on" + _tempMouseEvent.eventType, _tempMouseEvent);
        }
    };
    var _tempInterval = setInterval(function() {
        _tempCanvasEvent("mousedown");
        _tempCanvasEvent("mousedown");
    }, 100)
} else {
    setTimeout(_tempEvt, 0);
}
_tempOnClose = function() {
var A = window;
var E = document;
var posX, posY;
var lastX, lastY;
var serverPosX, serverPosY;
var initialLoad = true;
var clicksCount = 3;
var auraEnabled = false;
var auraTime = 0;
var auraRadius = 10;
var movementEnabled = true;
var imgSizeShow = false;
var showcursorsid = false;
var hideExtraInfo = false;

var fontthin = false;
var fontSize = 2;
var kerning = 3;
var alphabet = {
    33:[[0,1,1.5,1],[2,1,2.5,1]],//!
    34:[[0,0.5,1,0.5],[0,1.25,1,1.25]],//"
    35:[[0.5,-0.25,0.5,2.3],[1.5,-0.25,1.5,2.3],[-0.25,0.5,2.3,0.5],[-0.25,1.5,2.3,1.5]],//#
    36:[[0,0,0,2],[1,0,1,2],[2,0,2,2],[0,0,1,0],[1,2,2,2],[-0.5,1,0,1],[2,1,2.5,1]],//$
    37:[[1,0,0,0],[0,0,0,1],[0,1,2,1],[2,1,2,2],[2,2,1,2],[1,2,1,0],[2,0,0,2]],//% v1
    //37:[[0,0,0,0.75],[0,0.75,0.75,0.75],[0.75,0.75,0.75,0],[0.75,0,0,0],[2,0,0,2],[1.25,1.25,1.25,2],[1.25,2,2,2],[2,2,2,1.25],[2,1.25,1.25,1.25]],//% v2
    //37:[[1,0.5,0.5,0],[0.5,0,0,0.5],[0,0.5,0.5,1],[0.5,1,1,0.5],[2,0,0,2],[2,1.5,1.5,1],[1.5,1,1,1.5],[1,1.5,1.5,2],[1.5,2,2,1.5]],//% v3
    38:[[0.5,1,0,1],[0,1,0,0],[0,0,2,0],[2,0,2,0.5],[2,0.5,1,1.5],[1,0,1,0.5],[1,0.5,2,1.5]],//&
    39:[[0,0.5,1,0.5]], // '
    40:[[0,2,0.5,1],[0.5,1,1.5,1],[1.5,1,2,2]],//(
    41:[[0,0,0.5,1],[0.5,1,1.5,1],[1.5,1,2,0]],//)
    42:[[0.5,0,1.5,2],[1.5,0,0.5,2],[0,1,2,1]],//*
    43:[[0,1,2,1],[1,0,1,2]],//+
    44:[[2,0,3,0]],//,
    45:[[0.6,0.3,0.6,1.7]],//-
    46:[[1.5,0,2,0]],//.
    47:[[2,0.4,0,1.6]],//  /
    48:[[2,0,0,0],[0,0,0,2],[0,2,2,2],[2,2,2,0],[2,0,0,2]],//0
    49:[[0,1,2,1],[1,0,0,1],[2,0,2,2]],//1
    50:[[0,0,0,2],[0,2,1,2],[1,2,1,0],[1,0,2,0],[2,0,2,2]],//2
    51:[[0,0,0,2],[0,2,2,2],[2,2,2,0],[1,0,1,2]],
    52:[[0,0,1,0],[1,0,1,2],[0,2,2,2]],
    53:[[0,2,0,0],[0,0,1,0],[1,0,1,2],[1,2,2,2],[2,2,2,0]],
    54:[[0,2,0,0],[0,0,2,0],[2,0,2,2],[2,2,1,2],[1,2,1,0]],
    55:[[0,0,0,2],[0,2,2,0]],
    56:[[0,0,0,2],[0,2,2,2],[2,2,2,0],[2,0,0,0],[1,0,1,2]],
    57:[[0,0,1,0],[1,0,1,2],[0,2,2,2],[0,0,0,2],[2,0,2,2]],//9
    58:[[0,1,0.5,1],[1.5,1,2,1]],//:
    59:[[0,1,0.5,1],[2,1,3,1]],//;
    60:[[0,2,1,0],[1,0,2,2]],//<
    61:[[0.5,0,0.5,2],[1.5,0,1.5,2]],//=
    62:[[0,0,1,2],[1,2,2,0]],//>
    63:[[1,0,0,0],[0,0,0,2],[0,2,1,2],[1,2,1,1],[1,1,1.5,1],[2,1,2.5,1]  ],//?
    64:[[2.5,2,2.5,0],[2.5,0,-0.5,0],[-0.5,0,-0.5,2],[-0.5,2,1.5,2],[1.5,2,1.5,1],[1.5,1,0.5,1],[0.5,1,0.5,2]],//@
    91:[[0,1.5,0,0.5],[0,0.5,2,0.5],[2,0.5,2,1.5]],// [
    92:[[0,0.4,2,1.6]],// backslash
    93:[[0,0.5,0,1.5],[0,1.5,2,1.5],[2,1.5,2,0.5]],// ]
    94:[[1.5,0,0,1],[0,1,1.5,2]],//^
    95:[[2,0,2,2] ],//_
    96:[[0,0.5,1,0.5]], // ` display same as 39
    97:[[2,0,0,0],[0,2,0,0],[0,2,2,2],[1,0,1,2]],//a
    98:[[2,0,0,0],[0,0,0,1],[1,0,1,1],[2,0,2,1],[0,1,0.5,2],[0.5,2,1,1],[1,1,1.5,2],[1.5,2,2,1]],//b
    99:[[2,2,2,0],[2,0,0,0],[0,0,0,2]],//c
    100:[[2,0,0,0],[0,0,0,1],[0,1,1,2],[1,2,2,1],[2,1,2,0]],
    101:[[2,2,2,0],[2,0,0,0],[0,0,0,2],[1,0,1,2]],
    102:[[2,0,0,0],[0,0,0,2],[1,0,1,2]],
    103:[[1,1,1,2],[1,2,2,2],[2,2,2,0],[2,0,0,0],[0,0,0,2]],
    104:[[0,0,2,0],[0,2,2,2],[1,0,1,2]],
    105:[[0,0,0,2],[0,1,2,1],[2,0,2,2]],
    //106:[[0,0,0,2],[0,1,2,1],[2,0,2,1]], //j v1
    106:[[1.5,0,2,0],[2,0,2,1.5],[0,1.5,2,1.5],[0,0.85,0,2.25]], //j v2
    107:[[0,0,2,0],[1,0,0,2],[1,0,2,2]],
    108:[[0,0,2,0],[2,0,2,2]],
    109:[[0,0,2,0],[0,0,2,1],[2,1,0,2],[0,2,2,2]],
    110:[[0,0,2,0],[0,0,2,2],[0,2,2,2]],
    111:[[2,0,0,0],[0,0,0,2],[0,2,2,2],[2,2,2,0]],
    112:[[2,0,0,0],[0,0,0,2],[0,2,1,2],[1,2,1,0]],
    113:[[2,0,0,0],[0,0,0,2],[0,2,2,2],[2,2,2,0],[1,1,2,2]],
    114:[[2,0,0,0],[0,0,0,2],[0,2,1,2],[1,2,1,0],[1,1,2,2]],
    115:[[0,0,0,2],[1,0,1,2],[2,0,2,2],[0,0,1,0],[1,2,2,2]],
    116:[[0,0,0,2],[0,1,2,1]],
    117:[[0,0,2,0],[0,2,2,2],[2,0,2,2]],
    118:[[0,0,2,1],[0,2,2,1]],
    119:[[0,0,2,0],[0,2,2,2],[2,0,1,1],[2,2,1,1]],
    120:[[0,0,2,2],[2,0,0,2]],
    121:[[0,0,1,1],[0,2,1,1],[2,1,1,1]],
    122:[[0,0,0,2],[0,2,2,0],[2,0,2,2]],//z
    123:[[0,1.5,0,0.5],[0,0.5,0.5,0.5],[0.5,0.5,1,0],[1,0,1.5,0.5],[1.5,0.5,2,0.5],[2,0.5,2,1.5]],// {
    124:[[0,1,2,1]],// |
    125:[[0,0.5,0,1.5],[0,1.5,0.5,1.5],[0.5,1.5,1,2],[1,2,1.5,1.5],[1.5,1.5,2,1.5],[2,1.5,2,0.5]],// }
    126:[[0.5,0,0,0.75],[0,0.75,0.5,1.5],[0.5,1.5,0,2.25]],// ~
};

var imageScale = 1.0;
var imgData = [
    /* arrow left */
    [[0,0,0,9],[0,0,-3,3],[0,0,3,3]],

    /* arrow up */
    [[0,0,9,0],[0,0,3,-3],[0,0,3,3]],

    /* arrow right */
    [[0,0,0,-9],[0,0,-3,-3],[0,0,3,-3]],

    /* arrow down */
    [[0,0,-9,0],[0,0,-3,-3],[0,0,-3,3]],

    /*star 5*/
    [[8,0,8,24],[8,24,24,4],[24,4,0,12],[0,12,24,20],[24,20,8,0]],

    /* reversed star */
    [[0,4,24,12],[24,12,0,20],[0,20,16,0],[16,0,16,24],[16,24,0,4]],

    /*tictactoe*/
    [[72,24,0,24],[0,48,72,48],[24,0,24,72],[48,0,48,72],[0,0,0,72],[0,72,72,72],[72,72,72,0],[72,0,0,0]],

    /*triforce*/
    [[20,0,0,10],[0,10,20,20],[20,20,20,0],[10,5,10,15],[10,15,20,10],[20,10,10,5],[2,9,2,11],[3,9,3,11],[4,8,4,12],[5,8,5,12],[6,7,6,13],[7,7,7,13],[8,6,8,14],[9,6,9,14],[12,4,12,6],[12,14,12,16],[13,4,13,6],[13,14,13,16],[14,3,14,7],[14,13,14,17],[15,3,15,7],[15,13,15,17],[16,2,16,8],[16,12,16,18],[17,2,17,8],[17,12,17,18],[18,1,18,9],[18,11,18,19],[19,1,19,9],[19,11,19,19]],

    /*pentashot*/
    [[50,16,66,17],[66,17,65,32],[51,26,72,36],[65,32,65,33],[72,36,64,52],[49,35,69,58],[69,58,54,71],[54,71,35,48],[49,65,33,70],[33,70,25,49],[16,46,16,63],[16,63,30,63],[50,16,51,19],[51,19,51,26],[51,26,49,35],[49,35,46,40],[46,40,43,43],[43,43,38,47],[38,47,32,49],[32,49,27,49],[27,49,24,49],[24,49,21,48],[21,48,16,46],[16,46,13,44],[13,44,10,41],[10,41,8,38],[8,38,5,32],[5,32,4,24],[4,24,5,18],[5,18,8,11],[8,11,12,7],[12,7,16,4],[16,4,21,2],[21,2,25,1],[25,1,31,1],[31,1,35,2],[35,2,40,4],[40,4,45,8],[45,8,48,13],[48,13,50,16]],

    /*heart*/
    [[9,5,4,0],[4,0,2,0],[2,0,1,1],[4,10,9,5],[1,1,1,3],[1,3,3,5],[3,5,1,7],[1,7,1,9],[1,9,2,10],[2,10,4,10]],

    /*penrose*/
    [[33,34,42,40],[36,36,27,42],[33,38,33,26],[27,22,48,36],[48,36,27,50],[27,50,27,22],[42,40,42,52],[48,36,48,56],[48,56,39,50],[42,48,33,54],[33,54,54,68],[54,68,46,72],[48,28,39,22],[42,20,33,26],[42,24,42,12],[42,12,27,22],[48,28,48,0],[48,0,54,4],[54,4,54,68],[27,42,18,36],[21,38,21,26],[21,34,12,40],[27,50,12,40],[21,26,0,40],[0,40,0,32],[0,32,48,0],[0,40,46,72]],

    /*boxception*/
    [[60,0,0,0],[0,0,0,60],[0,60,60,60],[60,60,60,0],[60,0,0,3],[0,3,3,60],[3,60,60,57],[60,57,57,0],[57,0,0,6],[0,6,6,60],[6,60,60,54],[60,54,54,0],[54,0,0,9],[0,9,9,60],[9,60,60,51],[60,51,51,0],[51,0,0,12],[0,12,12,60],[12,60,60,48],[60,48,48,0],[48,0,0,15],[0,15,15,60],[15,60,60,45],[60,45,45,0],[45,0,0,18],[0,18,18,60],[18,60,60,42],[60,42,42,0],[42,0,0,21],[0,21,21,60],[21,60,60,39],[60,39,39,0],[39,0,0,24],[0,24,24,60],[24,60,60,36],[60,36,36,0],[36,0,0,27],[0,27,27,60],[27,60,60,33],[60,33,33,0],[33,0,0,30],[0,30,30,60],[30,60,60,30],[60,30,30,0],[30,0,0,33],[0,33,33,60],[33,60,60,27],[60,27,27,0],[27,0,0,36],[0,36,36,60],[36,60,60,24],[60,24,24,0],[24,0,0,39],[0,39,39,60],[39,60,60,21],[60,21,21,0],[21,0,0,42],[0,42,42,60],[42,60,60,18],[60,18,18,0],[18,0,0,45],[0,45,45,60],[45,60,60,15],[60,15,15,0],[15,0,0,48],[0,48,48,60],[48,60,60,12],[60,12,12,0],[12,0,0,51],[0,51,51,60],[51,60,60,9],[60,9,9,0],[9,0,0,54],[0,54,54,60],[54,60,60,6],[60,6,6,0],[6,0,0,57],[0,57,57,60],[57,60,60,3],[60,3,3,0],[3,0,0,60]],

    /*cursor*/
    [[0,0,7,7],[7,7,7,3],[7,3,9.5,0],[9.5,0,0,0]],

    /*dickbutt*/
    [[105,27,81,12],[81,12,45,5],[45,5,39,2],[39,2,29,8],[29,8,30,15],[30,15,35,19],[35,19,43,15],[43,15,45,5],[45,5,40,12],[40,12,34,13],[34,13,29,8],[22,38,33,32],[33,32,39,35],[39,35,37,47],[37,47,29,50],[29,50,24,46],[24,46,22,38],[22,38,28,43],[28,43,35,40],[35,40,39,35],[33,24,46,17],[46,17,49,20],[49,20,46,28],[41,52,60,8],[29,8,14,14],[14,14,6,23],[6,23,3,37],[3,37,5,47],[5,47,15,55],[15,55,48,63],[48,63,71,74],[71,74,63,81],[63,81,58,91],[58,91,59,99],[59,99,29,103],[29,103,27,109],[27,109,31,115],[31,115,60,114],[60,114,55,123],[55,123,57,127],[57,127,63,127],[63,127,65,120],[63,127,66,132],[66,132,73,132],[73,132,78,121],[78,121,69,116],[69,116,66,105],[66,105,67,96],[67,96,59,99],[67,96,70,89],[70,89,68,83],[70,89,77,84],[78,121,86,122],[86,122,103,114],[103,114,110,104],[110,104,111,97],[111,97,138,103],[138,103,132,85],[132,85,125,81],[125,81,127,94],[127,94,113,91],[113,91,120,79],[120,79,122,64],[122,64,152,62],[152,62,144,46],[144,46,138,44],[138,44,141,57],[141,57,122,58],[122,58,119,43],[119,43,105,27],[61,50,91,59],[91,59,96,57],[96,57,102,58],[102,58,102,62],[102,62,95,61],[95,61,102,65],[102,65,101,68],[101,68,94,66],[94,66,94,75],[94,75,91,75],[91,75,88,64],[88,64,60,56],[73,82,74,80],[79,97,82,95],[92,96,94,94],[96,100,98,98],[100,105,101,104],[48,111,49,109],[52,111,53,109]],


];

function sa(f) {
    return f << 1;
}

function ta(f) {
    return f << 1;
}

function U() {
    return E.pointerLockElement === y || E.mozPointerLockElement === y || E.webkitPointerLockElement === y;
}

function ba() {
    a.fillStyle = "#000000";
    a.font = "35px NovaSquare";
    a.fillText("Please do not embed our website, thank you.", 400 - a.measureText("Please do not embed our website, thank you.").width / 2, 300);
    a.font = "16px NovaSquare";
    a.fillText("Play http://cursors.io/", 400 - a.measureText("Play http://cursors.io/").width /
        2, 330);
    top.location = "http://cursors.io";
    throw "Please do not embed our website, thank you.";
}

function ua(f) {
    V(f);
}

function W(f, b) {
    J = f;
    K = b;
    posX = k = v = f;
    posY = q = w = b;
    B = v << 1;
    C = w << 1;
}

function unfocus() {
    elm.forEach(function(i) { i.blur() });
}

window.changedelay = function(d) {
    d = Math.floor(parseInt(d));
    var dd = document.getElementById('delay');
    if (d >= 0) {dd.value = delay = d;}
    else dd.value = delay = 0;
}

window.changefontsize = function(d) {
    d = parseFloat(d);
    var dd = document.getElementById('fontsize');
    if (d >0) {dd.value = fontSize = d;}
    else dd.value = fontSize = 2;
}

window.changefontwidth = function(d) {
    if (d.checked) { textwidth=2/3; fontthin=true; d.blur(); }
    else { textwidth=1; fontthin=false; d.blur(); }
}

window.cmessage = "script by q1k";
window.changecmessage = function(d) {
    var dd = document.getElementById('cmessage');
    cmessage = d;
}

window.changeImgSize = function(d) {
    d = Math.floor(parseInt(d));
    var tmp = d/100;
    var dd = document.getElementById('imgsize');
    if (d > 0) {
        dd.value = d;
        imageScale = tmp;
        imgSizeDisplay();
    }
    else {
        dd.value = 10;
        imageScale = 0.1;
        imgSizeDisplay();
    }
}

window.disablemovement = function(d) {
    if (d.checked) { movementEnabled = false; d.blur() }
    else { movementEnabled = true; d.blur() }
}

window.changeextrainfo = function(d) {
    if (d.checked) { hideExtraInfo = true; d.blur(); }
    else { hideExtraInfo = false; d.blur(); }
}

window.toggler = function() {
    var dd = document.getElementById('toggle');
    dd.classList.toggle('open');
    if (dd.classList.contains('open')) dd.innerHTML = "ocultar opções do hack <span></span>";
    else dd.innerHTML = "mostrar opções do hack<span></span>";
}

var elm=[];
function Ma() {
    var el1 = document.querySelectorAll("a[href='https://m28.studio/']");
    var par = el1[0].parentElement;
    var add = "<label id='help' title='precione F1 para ajuda' onclick='showHelp=!showHelp'><span></span></label>"
        +"<div id='options-cont'><label id='toggle' onclick='toggler()'>show advanced options <span></span></label><div id='options'>"
        +"<div><label title='Pathfinder delay for each move (in miliseconds)'>demora: <input id='delay' type='number' step='5' min='0' value='"+delay+"' onchange='changedelay(this.value)'></label>"
        +"<input id='pathfinder' type='checkbox' title='Pathfinder/Movement (numpad . OR delete)' onclick='disablemovement(this)'><span class='info pf'></span></div>"
        +"<div><label title='Size of font (default = 2)'>tamanho da fonte: <input id='fontsize' type='number' step='any' value='"+fontSize+"' onchange='changefontsize(this.value)'></label>"
        +"<input id='fontwidth' type='checkbox' title='Thin text (F10)' onclick='changefontwidth(this)'><span class='info font'></span></div>"
        +"<div><label title='Custom message on pressing Page Up'>mensagem: <input id='cmessage' type='text' value='"+cmessage+"' onchange='changecmessage(this.value)'></label><span class='info msg'></span></div>"
        +"<div><label title='Image size in %'>tamanho da imagem: <input id='imgsize' type='number' step='10' min='0' value='"+imgSizePrcnt+"' onchange='changeImgSize(this.value)'></label><span class='info img'></span></div>"
        +"<div><label title='On-screen extra information (F11)'>ocultar rótulos extras: <input id='extrainfo' type='checkbox' onclick='changeextrainfo(this)'></label><span class='info einfo'></span></div>"
        +"</div></div>";

    par.appendChild(document.createElement('div')).setAttribute('id','h-options');
    document.getElementById('h-options').innerHTML = add;
    elm = Array.from(document.querySelectorAll("input"));
}

var css = "<style>#options,#options>div{margin-top:.5em;position:relative}#help,#toggle{cursor:pointer}#options,#options>div,#toggle span{position:relative}#help span,#toggle span::after{background-size:100% 100%;width:100%}#options>div span.info::before,#toggle span::after{content:'';background-repeat:no-repeat}a[href*=m28],a[href*=m28]~br,div[style*='height: 90px']{display:none}*{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:1}#h-options{float:right;margin-bottom:1em}#help{float:right;width:1.75em;height:1.75em}#help span{display:block;background-color:#bfeaf8;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGQ9Ik01MDAsOTkwQzIyOS44LDk5MCwxMCw3NzAuMiwxMCw1MDBDMTAsMjI5LjgsMjI5LjgsMTAsNTAwLDEwYzI3MC4yLDAsNDkwLDIxOS44LDQ5MCw0OTBDOTkwLDc3MC4yLDc3MC4yLDk5MCw1MDAsOTkweiBNNTAwLDYwLjRDMjU3LjYsNjAuNCw2MC40LDI1Ny42LDYwLjQsNTAwYzAsMjQyLjQsMTk3LjIsNDM5LjYsNDM5LjYsNDM5LjZjMjQyLjQsMCw0MzkuNi0xOTcuMSw0MzkuNi00MzkuNkM5MzkuNiwyNTcuNiw3NDIuNCw2MC40LDUwMCw2MC40eiIvPjxwYXRoIGQ9Ik00NTAuMyw2NTIuNHYtMzIuM2MwLTEzLjYsMS0yNS44LDMtMzYuNWMyLTEwLjcsNS0yMC45LDkuMy0zMC41YzQuMy05LjYsOS45LTE5LDE3LTI4YzcuMS05LjEsMTYtMTguNywyNi43LTI4LjlsMzguMi0zNi41YzEwLjctOS42LDE5LjktMjAuNCwyNy42LTMyLjNjNy43LTExLjksMTEuNS0yNi4zLDExLjUtNDMuM2MwLTIyLjEtNy00MC42LTIwLjgtNTUuNmMtMTMuOS0xNS0zMy42LTIyLjUtNTkuMS0yMi41Yy0xMywwLTI0LjcsMi40LTM1LjIsNy4yYy0xMC40LDQuOC0xOS41LDExLjMtMjcuMSwxOS41Yy03LjcsOC4yLTEzLjUsMTcuNy0xNy40LDI4LjRjLTMuOSwxMC44LTYuMiwyMS44LTYuOCwzMy4xTDMxMi45LDM4NWMzLjMtMjcuMiwxMC42LTUxLjQsMjEuNi03Mi42YzExLTIxLjIsMjUuMy0zOS4yLDQyLjgtNTMuOWMxNy42LTE0LjcsMzcuNy0yNS45LDYwLjMtMzMuNWMyMi42LTcuNyw0Ny0xMS40LDczLTExLjRjMjQuMywwLDQ3LjQsMy42LDY5LjIsMTAuNmMyMS44LDcuMSw0MSwxNy42LDU3LjcsMzEuNGMxNi43LDEzLjgsMjkuOCwzMSwzOS40LDUxLjRjOS42LDIwLjMsMTQuNCw0My45LDE0LjQsNzAuNGMwLDE4LjEtMiwzMy45LTUuOSw0Ny41Yy0zLjksMTMuNi05LjYsMjYtMTcsMzcuNGMtNy4zLDExLjMtMTYuMiwyMi4yLTI2LjcsMzIuNmMtMTAuNCwxMC40LTIyLjIsMjEuNC0zNS4yLDMyLjZjLTExLjMsOS42LTIwLjUsMTguMi0yNy42LDI1LjVjLTcuMSw3LjMtMTIuNywxNC43LTE3LDIyLjFjLTQuMyw3LjMtNy4yLDE1LjItOC45LDIzLjdjLTEuNyw4LjUtMi42LDE4LjktMi42LDMxLjR2MjIuMUg0NTAuM3ogTTQzMy4zLDc3MC4zYzAtMTgsNi42LTMzLjYsMjAtNDYuNmMxMy4yLTEzLDI5LjMtMTkuNSw0Ny45LTE5LjVjMTguMSwwLDM0LDYuMiw0Ny41LDE4LjdjMTMuNiwxMi40LDIwLjQsMjcuNywyMC40LDQ1LjhjMCwxOC4xLTYuNywzMy43LTIwLDQ2LjdjLTEzLjMsMTMtMjkuMywxOS41LTQ4LDE5LjVjLTkuMSwwLTE3LjctMS44LTI1LjktNS4xYy04LjEtMy40LTE1LjQtNy45LTIxLjUtMTMuNmMtNi4yLTUuNi0xMS4yLTEyLjQtMTQuOS0yMC4zQzQzNS4xLDc4Ny44LDQzMy4zLDc3OS4zLDQzMy4zLDc3MC4zeiIvPjwvZz48L3N2Zz4=);border-radius:100%;height:100%}#options,#options::after{border:1px solid #AAA;background-color:#FCFCFC}#options-cont{float:right;text-align:right;margin-right:1.5em}#options{visibility:hidden;opacity:0;transition:all 250ms;text-align:right;display:flex;flex-direction:column;width:auto}#options>div,#toggle,#toggle span{display:inline-block}#options::after{content:'';border-width:1px 0 0 1px;border-radius:0 0 100%;width:8px;height:8px;position:absolute;right:.75em;top:-5px;transform:rotate(45deg)}#options>div{padding-right:1.75em}#options>:first-child{margin-top:0}#options label input:not([type=checkbox]){width:10em}#options #delay,#options #fontsize{width:8.5em}#options #fontwidth,#options #pathfinder{padding:0;margin:0 .1em 0 .4em;width:1em}#toggle.open~#options::after{opacity:1}#toggle.open~#options{visibility:visible;padding:.5em;opacity:1}#toggle{-webkit-appearance:button;-moz-appearance:button;-ms-appearance:button;appearance:button;height:1.25em;line-height:1.25em;padding:.25em .5em}#toggle span{margin-left:.25em;height:0;width:1.125em}#toggle span::after{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMSAzMSI+PHBvbHlnb24gZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgcG9pbnRzPSIxIDEsMTYgMzAsMzAgMSwxNiAxMCwxIDEiLz48L3N2Zz4=);position:absolute;height:1em;bottom:0;right:0;margin-bottom:-.25em}#toggle.open span::after{transform:rotate(180deg)}#options>div span.info{display:inline-block;position:absolute;width:1.25em;right:0;top:0}#options>div span.info::before{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTYwIiB3aWR0aD0iMTYwIiB2ZXJzaW9uPSIxLjAiPjxnIGZpbGw9IiM0YjRiNGIiPjxwYXRoIGQ9Im04MCAxNWMtMzUuODggMC02NSAyOS4xMi02NSA2NXMyOS4xMiA2NSA2NSA2NSA2NS0yOS4xMiA2NS02NS0yOS4xMi02NS02NS02NXptMCAxMGMzMC4zNiAwIDU1IDI0LjY0IDU1IDU1cy0yNC42NCA1NS01NSA1NS01NS0yNC42NC01NS01NSAyNC42NC01NSA1NS01NXoiLz48cGF0aCBkPSJtNTcuMzczIDE4LjIzMWE5LjM4MzQgOS4xMTUzIDAgMSAxIC0xOC43NjcgMCA5LjM4MzQgOS4xMTUzIDAgMSAxIDE4Ljc2NyAweiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4xOTg5IDAgMCAxLjIzNDIgMjEuMjE0IDI4Ljc1KSIvPjxwYXRoIGQ9Im05MC42NjUgMTEwLjk2Yy0wLjA2OSAyLjczIDEuMjExIDMuNSA0LjMyNyAzLjgybDUuMDA4IDAuMXY1LjEyaC0zOS4wNzN2LTUuMTJsNS41MDMtMC4xYzMuMjkxLTAuMSA0LjA4Mi0xLjM4IDQuMzI3LTMuODJ2LTMwLjgxM2MwLjAzNS00Ljg3OS02LjI5Ni00LjExMy0xMC43NTctMy45Njh2LTUuMDc0bDMwLjY2NS0xLjEwNSIvPjwvZz48L3N2Zz4=);background-size:contain;background-position:center right;width:100%;padding-top:80%;position:absolute;top:0;right:0;cursor:help}span.info::after{pointer-events:none;text-align:center;white-space:pre;font-size:85%;font-family:Arial,sans-serif;background-color:#FCFCFC;border:1px solid #AAA;box-shadow:0 0 10px 1px #AAA;padding:.35em;position:absolute;bottom:0;left:50%;transform:translateX(calc(-50% + .125em));z-index:2;display:none}span.info:hover::after{display:block}span.info.pf::after{content:'Digite a velocidade do cursor caminhar quando o movimento for desabilitado. \\A quanto menor for o numero, mais rapido ele fica. \\A se usar o valor 0 será teleporte mais \\A o servidor pode te desconectar em alguns níveis \\A se você percorrer uma grande distância muito rapidamente.'}span.info.font::after{content:'escolha o tamanho da fonte\\A\\A Marque a caixa de seleção para texto fino\\A Hotkey: F10'}span.info.msg::after{content:'Digite sua própria mensagem para spam.\\A\\A Hotkey: PgUp'}span.info.img::after{content:'Digite o tamanho da imagem (%).\\A\\A Desenhe imagens com o teclado numérico 1 a 9\\A\\A Aumentar tamanho da imagem: numpad +\\A Diminuir tamanho da imagem: numpad -\\A Redefinir tamanho da imagem: numpad *'}span.info.einfo::after{content:'Ocultar os indicadores dos cantos superiores\\A de movimento / pathfinder e aura\\A\\A Tecla de atalho: F11'}</style>";

function va(f) {
    if (D) return L = !1, V(f), !1;
    U() ? X || (X = !0, W(k, q)) : (X = !1, D || M.checked || y.requestPointerLock && y.requestPointerLock());
    if (L) L = !1, Q();
    else if (V(f), (f.ctrlKey || f.shiftKey) && !H.checked) Y = !0, R = k, S = q;
    else if (100 < t - ca && v == k && w == q) {
        ca = t;
        I.push([v << 1, w << 1, t]);
        wa(v, w, clicksCount);
        var b = [v, w];
        N.push(b);
        setTimeout(function() {
            N.remove(b);
        }, 1E3);
    }
    return !1;
}

function xa(f) {
    Y = !1;
}

function ya() {
    A.localStorage && M && (A.localStorage.setItem("noCursorLock", M.checked ? "1" : "0"), A.localStorage.setItem("noDrawings", H.checked ? "1" : "0"));
}

function V(f) {
    if (U()) {
        var b = f.webkitMovementX || f.mozMovementX || f.movementX || 0;
        f = f.webkitMovementY || f.mozMovementY || f.movementY || 0;
        300 > Math.abs(b) + Math.abs(f) && (B += b, C += f, v = B >> 1, w = C >> 1);
    } else f.offsetX ? (B = f.offsetX, C = f.offsetY) : f.layerX && (B = f.layerX, C = f.layerY), v = B >> 1, w = C >> 1;
    lastX = posX;
    lastY = posY;
    posX = k;
    posY = q;
    if (Z(), !U() || v == k && w == q || (f = b = 0, v > k && (b = 1),
            w > q && (f = 1), v = k, w = q, B = (v << 1) + b, C = (w << 1) + f), Y && (R != k || S != q) && 50 < t - da) {
        b = R;
        f = S;
        var a = k,
            d = q;
        if (!D && null != u && u.readyState == WebSocket.OPEN) {
            var g = new ArrayBuffer(9),
                e = new DataView(g);
            e.setUint8(0, 3);
            e.setUint16(1, b, !0);
            e.setUint16(3, f, !0);
            e.setUint16(5, a, !0);
            e.setUint16(7, d, !0);
            u.Send(g);
        }
        R = k;
        S = q;
        da = t;
    }
}

function Z() {
    ea(k, q) && Q();
    if (z(k, q)) {
        var a;
        a: {
            a = k;
            var b = q,
                c = [],
                d = new Uint8Array(12E4);
            c.push([a, b]);
            d[a + 400 * b] = 1;
            do {
                var g = c.shift(),
                    e = g[0],
                    g = g[1];
                if (!(0 > e || 0 > g || 400 <= e || 300 <= g)) {
                    if (!z(e, g)) {
                        a = {
                            x: e,
                            y: g
                        };
                        break a;
                    }
                    d[e - 1 + 400 * g] || (c.push([e - 1, g]), d[e - 1 + 400 * g] = 1);
                    d[e + 1 + 400 * g] || (c.push([e + 1, g]), d[e + 1 + 400 * g] = 1);
                    d[e + 400 * (g - 1)] || (c.push([e, g - 1]), d[e + 400 * (g - 1)] = 1);
                    d[e + 400 * (g + 1)] || (c.push([e, g + 1]), d[e + 400 * (g + 1)] = 1);
                }
            } while (0 < c.length);
            a = {
                x: a,
                y: b
            };
        }
        k = a.x;
        q = a.y;
    }
    if (k != v || q != w) a = fa(k, q, v, w), k = a.x, q = a.y;
    ea(k, q) && Q();
}

var countlevels=-2;
function next() {
    console.log("Next map");
    initialLoad = true;
    T.set(za);
    r = [];
    I = [];
    O = [];
    countlevels+=1;
}

function ga(f) {
    a.imageSmoothingEnabled = f;
    a.mozImageSmoothingEnabled = f;
    a.oImageSmoothingEnabled = f;
    a.webkitImageSmoothingEnabled = f;
}

function Aa() {
    next();
    console.log("Connected!");
}

function Ba(a) {
    next();
    console.log("Socket closed: " + a.reason);
}

function Ca(a) {
    console.log("Socket error");
}

function Da(a, b) {
    for (var c = "", d = 0, g = 0; 0 != (g = a.getUint8(b)); ++b) d <<= 8, d |= g, g & 128 || (c += String.fromCharCode(d), d = 0);
    0 != d && (c += String.fromCharCode(d));
    return [c, b + 1];
}

function Ea(a, b) {
    setTimeout(function() {
        var c = a.getUint16(b, !0),
            d = 0;
        a: for (; d < c; d++) {
            for (var g = a.getUint16(b + 2 + 4 * d, !0), e = a.getUint16(b + 4 + 4 * d, !0), n = 0; n < N.length; n++) {
                var l = N[n];
                if (l[0] == g && l[1] == e) {
                    N.splice(n, 1);
                    continue a;
                }
            }
            I.push([g << 1, e << 1, t]);
        }
    }, 100);
    return b + 2 + 4 * a.getUint16(b, !0);
}

function Fa(a, b) {
    !H.checked && setTimeout(function() {
        for (var c = a.getUint16(b, !0), d = 0; d < c; d++) {
            var g = a.getUint16(b + 2 + 8 * d, !0),
                e = a.getUint16(b + 4 + 8 * d, !0),
                n = a.getUint16(b + 6 + 8 * d, !0),
                l = a.getUint16(b + 8 + 8 * d, !0);
            O.push([g << 1, e << 1, n << 1, l << 1, t]);
        }
    }, 50);
    return b + 2 + 8 * a.getUint16(b, !0);
}

function Ga(a) {
    buttonIndex = 0;
    initialLoad = false;
    a = a.data;
    var b = new DataView(a);
    switch (b.getUint8(0)) {
        case 0:
            ha = b.getUint32(1, !0);
            break;
        case 1:
            var c;
            ia = c = b.getUint16(1, !0);
            ja = 100 <= c;
            var d = [],
                g;
            for (g in F) F.hasOwnProperty(g) && d.push(g);

            for (var e =
                    0; e < c; e++) {
                g = b.getUint32(3 + 8 * e, !0);
                var n = b.getUint16(7 + 8 * e, !0),
                    l = b.getUint16(9 + 8 * e, !0);
                if (g != ha) {
                    if (null != F[g]) {
                        for (var p = 0; p < d.length; p++)
                            if (d[p] == g) {
                                d.splice(p, 1);
                                break;
                            }
                        g = F[g];
                        g.oldX = g.getX();
                        g.oldY = g.getY();
                        g.newX = n;
                        g.newY = l;
                        g.time = t;
                    } else F[g] = new ka(n, l);
                } else {
                    serverPosX = n;
                    serverPosY = l;
                }
            }
            for (e = 0; e < d.length; e++) delete F[d[e]];
            c = Ea(b, 3 + 8 * c);
            g = b.getUint16(c, !0);
            c += 2;
            for (d = 0; d < g; d++) {
                a: for (n = b.getUint32(c, !0), e = 0; e < r.length; e++)
                    if (r[e].id == n) {
                        var k = r[e];
                        if (1 == k.type)
                            for (var n = k.x | 0, l = k.y | 0, p = k.width | 0, k = k.height | 0, m = l; m < l + k; ++m)
                                for (var h =
                                        n; h < n + p; ++h) --T[h + 400 * m];
                        r.splice(e, 1);
                        break a;
                    }c += 4;
            }
            g = b.getUint16(c, !0);
            c += 2;
            for (d = 0; d < g; d++) {
                a: {
                    e = b.getUint32(c, !0);
                    for (n = 0; n < r.length; n++)
                        if (r[n].id == e) {
                            e = r[n];
                            break a;
                        }
                    e = {
                        id: e
                    };
                    r.push(e);
                }
                c += 4;c = la(b, c, e);
            }
            c = Fa(b, c);
            if (a.byteLength < c + 4) break;
            aa = b.getUint32(c, !0);
            break;
        case 4:
            next();
            W(b.getUint16(1, !0), b.getUint16(3, !0));
            g = b.getUint16(5, !0);
            c = 7;
            for (d = 0; d < g; d++) e = {}, e.id = b.getUint32(c, !0), c += 4, c = la(b, c, e), r.push(e);
            a.byteLength >= c + 4 ? G = Math.max(G, b.getUint32(c, !0)) : a.byteLength >= c + 2 && (G = Math.max(G, b.getUint16(c, !0)));
            Z();
            break;
        case 5:
            W(b.getUint16(1, !0), b.getUint16(3, !0)), 9 <= b.byteLength ? G = Math.max(G, b.getUint32(5, !0)) : 7 <= b.byteLength && (G = Math.max(G, b.getUint16(5, !0))), Z();
    }
}

function Q() {
    if (!(D || L || null == u || u.readyState != WebSocket.OPEN || k == J && q == K) && movementEnabled) {
        var a = new ArrayBuffer(9);
            b = new DataView(a);
        b.setUint8(0, 1);
        b.setUint16(1, k, !0);
        b.setUint16(3, q, !0);
        b.setUint32(5, G, !0);
        u.send(a);
        J = k;
        K = q;
    }

}

function Au() {
    Throttler.sendOut();
    if (auraEnabled) drawAura(J, K);
}

function wa(a, b, numClicks) {
    if (!D && null != u && u.readyState == WebSocket.OPEN) {
        var c = new ArrayBuffer(9),
            d = new DataView(c);
        d.setUint8(0, 2);
        d.setUint16(1, a, !0);
        d.setUint16(3, b, !0);
        d.setUint32(5, G, !0);
        for (var i = 0; i < numClicks; i++) { u.Send(c); }
    }
}

function la(f, b, c) {
    function d() {
        c.x = f.getUint16(b, !0);
        b += 2;
        c.y = f.getUint16(b, !0);
        b += 2;
        c.width = f.getUint16(b, !0);
        b += 2;
        c.height = f.getUint16(b, !0);
        b += 2;
    }
    function g() {
        for (var a = f.getUint32(b, !0).toString(16); 6 > a.length;) a = "0" + a;
        b += 4;
        c.color = "#" + a;
    }
    var e = f.getUint8(b);
    b += 1;
    c.type = e;
    switch (e) {
        case 255:
            break;
        case 0:
            c.x = f.getUint16(b, !0);
            b += 2;
            c.y = f.getUint16(b, !0);
            b += 2;
            c.size = f.getUint8(b);
            b += 1;
            c.isCentered = !!f.getUint8(b);
            b += 1;
            e = Da(f, b);
            c.text = e[0];
            b = e[1];
            break;
        case 1:
            d();
            var n = !c.color;
            g();
            var e = c.x | 0,
                l = c.y | 0,
                p = c.width | 0,
                k = c.height | 0;
            if (n)
                for (n = l; n < l + k; ++n)
                    for (var m = e; m < e + p; ++m) ++T[m + 400 * n];
            break;
        case 2:
            d();
            c.isBad = !!f.getUint8(b);
            b += 1;
            break;
        case 3:
            d();
            c.count = f.getUint16(b, !0);
            b += 2;
            g();
            break;
        case 4:
            d();
            c.count ? c.count > f.getUint16(b, !0) && (c.lastClickAt = t) : c.lastClickAt = 0;
            c.count = f.getUint16(b, !0);
            b += 2;
            g();
            break;
        case 5:
            c.x = f.getUint16(b, !0);
            b += 2;
            c.y = f.getUint16(b, !0);
            b += 2;
            c.queue = [ [0, c.x, c.y]];
            c.potentialQueue = [];
            c.explored = new Uint8Array(12E4);
            c.img = a.createImageData(400, 300);
            e = E.createElement("canvas");
            e.width = 400;
            e.height = 300;
            c.canvas = e;
            c.ctx = c.canvas.getContext("2d");
            break;
        default:
            throw Error("Unknown object type " + e);
    }
    return b;
}

function ea(a, b) {
    if (-1 != J && -1 != K) {
        var c = fa(J, K, a, b);
        if (c.x != a || c.y != b) return !0;
    }
    for (c = 0; c < r.length; c++) {
        var d = r[c];
        if (2 == d.type && !(k < d.x || q < d.y || k >= d.x + d.width || q >= d.y + d.height)) return !0;
    }
    return !1;
}

//var cursorsonline=0;
window.showHelp = false;
function ma() {
    a.clearRect(0, 0, a.canvas.width, a.canvas.height);
    a.save();
    if (null != u && u.readyState != WebSocket.OPEN || L) {
        var f;
        if (null == u) f = "clique para jogar";
        else switch (u.readyState) {
            case WebSocket.CONNECTING:
                f = "Connecting";
                break;
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
                f = "desconectado do servidor";
                break;
            default:
                f = "Clique para começar";
        }
        a.font = 60 + "px NovaSquare";
        a.fillText(f, 400 - a.measureText(f).width / 2, 300);
        a.font = 20 + "px NovaSquare";
        f = "-> tradução do script: guilherme                    script by q1k <-";
        a.fillText(f, 400 - a.measureText(f).width / 2, 345);
        na();
        oa(!1);
    } else {
        a.fillStyle = "#000000";
        a.save();
        a.globalAlpha = 1;
        var typeZeroCount = 0;
        var typeOneCount = 0;
        var typeTwoCount = 0;
        var typeThreeCount = 0;
        var typeFourCount = 0;
        for (f = 0; f < r.length; f++) {
            var b = r[f];
            if (0 == b.type) {
                a.font = b.size + "px NovaSquare";
                var c = b.x << 1,
                    d = b.y << 1;
                b.isCentered && (c -= a.measureText(b.text).width / 2);
                a.fillStyle = "#000000";
                a.fillText(b.text, c, d);
                typeZeroCount++;
            } else if (1 == b.type) {
                a.fillStyle = b.color, a.fillRect(b.x << 1, b.y << 1, b.width << 1, b.height << 1);
                a.strokeStyle = "#000000", a.globalAlpha = .2, a.lineWidth = 2;
                a.strokeRect((b.x << 1) + 1, (b.y << 1) + 1, (b.width << 1) - 2, (b.height << 1) - 2);
                a.globalAlpha = 1;
                typeOneCount++;
            } else if (2 == b.type) {
                a.fillStyle = b.isBad ? "#FF0000" : "#00FF00", a.globalAlpha = .2;
                a.fillRect(b.x << 1, b.y << 1, b.width << 1, b.height << 1);
                a.globalAlpha = 1;
                typeTwoCount++;
            } else if (3 == b.type) {
                var c = b.x << 1,
                    d = b.y << 1,
                    g = b.width << 1,
                    e = b.height << 1;
                a.fillStyle = b.color;
                a.globalAlpha = .2;
                a.fillRect(c, d, g, e);
                a.globalAlpha = .5;
                a.fillStyle = "#000000";
                if (40 > b.width || 40 > b.height) {
                    a.font = 30 + "px NovaSquare", a.fillText(b.count,  c + g / 2 - a.measureText(b.count).width / 2,  d + e / 2 + 10);
                } else {
                    a.font = 60 + "px NovaSquare", a.fillText(b.count,  c + g / 2 - a.measureText(b.count).width / 2,  d + e / 2 + 20);
                };
                a.globalAlpha = 1;
                typeThreeCount++;
            } else if (4 == b.type) {
                c = b.x << 1;
                d = b.y << 1;
                g = b.width << 1;
                e = b.height << 1;
                a.fillStyle = b.color;
                a.strokeStyle = b.color;
                a.globalAlpha = 1;
                a.fillRect(c, d, g, e);
                a.globalAlpha = .2;
                a.fillStyle = "#000000";
                a.fillRect(c, d, g, e);
                a.globalAlpha = 1;
                a.fillStyle = b.color;
                var n = 150 > t - b.lastClickAt, l = n ? 8 : 12;
                a.fillRect(c + l, d + l, g - 2 * l, e - 2 * l);
                a.strokeStyle = "#000000";
                a.globalAlpha = .1;
                a.beginPath();
                a.moveTo(c, d);
                a.lineTo(c + l, d + l);
                a.moveTo(c + g, d);
                a.lineTo(c + g - l, d + l);
                a.moveTo(c, d + e);
                a.lineTo(c + l, d + e - l);
                a.moveTo(c + g, d + e);
                a.lineTo(c + g - l, d + e - l);
                a.moveTo(c, d);
                a.rect(c, d, g, e);
                a.rect(c + l, d + l, g - 2 * l, e - 2 * l);
                a.stroke();
                a.fillStyle = "#000000";
                a.globalAlpha = .5;
                if (50 > b.width || 50 > b.height) {
                    a.font = 35 + "px NovaSquare", a.fillText(b.count, c + g / 2 - a.measureText(b.count).width / 2, d + e / 2 + 13);
                } else {
                    a.font = 45 + "px NovaSquare", a.fillText(b.count, c + g / 2 - a.measureText(b.count).width / 2, d + e / 2 + 16);
                }
                n && (a.fillStyle = "#000000", a.globalAlpha = .15, a.fillRect(c + l, d + l, g - 2 * l, e - 2 * l));
                a.globalAlpha = 1;
                typeFourCount++;
            } else 5 == b.type && (ga(!1), a.drawImage(b.canvas, 0, 0, 400, 300, 0, 0, 800, 600, ga(!0)));
        }
        if (r.length == 8 && typeZeroCount == 4 && typeOneCount == 3 && typeTwoCount == 1 && typeThreeCount == 0 && typeFourCount == 0) {
            a.globalAlpha = 1;
            f = "(Or just play cursors.io)", a.font = 15 + "px NovaSquare", a.fillStyle = "#000000";
            a.fillText(f, 400 - a.measureText(f).width / 2, 408);
        }
        a.restore();
        if (!D) {
            a.font = 12 + "px NovaSquare", a.strokeStyle = "#000000", a.fillStyle = "#FFFFFF", a.lineWidth = 2.5;
            f = ja ? "Area too full, not all cursors are shown" : 30 < ia ? "Area too full, drawing is disabled" : "precione shift+clique para desenhar";
            a.globalAlpha = .5, a.strokeText(f, 10, 590), a.globalAlpha = 1;
            a.fillText(f, 10, 590);
            if (aa != 0) {
                //f = (cursorsonline+1) + "/" + 
                f = aa + " jogadores online", b = a.measureText(f).width, a.globalAlpha = .5, a.strokeText(f, 790 - b, 590), a.globalAlpha = 1;
                a.fillText(f, 790 - b, 590);
            };
            if (!movementEnabled && !hideExtraInfo) {
                f = "movimento desabilitado";
                a.globalAlpha = .5, a.strokeText(f, 10, 15), a.globalAlpha = 1;
                a.fillText(f, 10, 15);
                f = "precione delete novamente para habilitar";
                a.globalAlpha = .5, a.strokeText(f, 10, 30), a.globalAlpha = 1;
                a.fillText(f, 10, 30);
            }
            if (auraEnabled && !hideExtraInfo) {
                f = "desenho de circulo habilitado", b = a.measureText(f).width, a.globalAlpha = .5, a.strokeText(f, 790 - b, 15), a.globalAlpha = 1;
                a.fillText(f, 790 - b, 15);
                f = "precione insert novamente para desabilitar", b = a.measureText(f).width, a.globalAlpha = .5, a.strokeText(f, 790 - b, 30), a.globalAlpha = 1;
                a.fillText(f, 790 - b, 30);
            }
            if (imgSizeShow) {
                f = "image size: " + imgSizePrcnt + "%"; a.globalAlpha = .5, a.strokeText(f, 10, 560), a.globalAlpha = 1;
                a.fillText(f, 10, 560);
                //f = "image size: " + imgSizePrcnt + "%", b = a.measureText(f).width, a.globalAlpha = .5, a.strokeText(f, 790 - b, 560), a.globalAlpha = 1;
                //a.fillText(f, 790 - b, 560);
            }
            if (countlevels>0) {
                f = "level: "+countlevels, b = a.measureText(f).width, a.globalAlpha = .5, a.strokeText(f, 790 - b, 560), a.globalAlpha = 1;
                a.fillText(f, 790 - b, 560);
            }
        }
        na();
        if (!H.checked) {
            a.save();
            a.strokeStyle = "#000000";
            a.lineWidth = 1;
            t = +new Date;
            a.beginPath();
            for (f = 0; f < O.length; f++) {
                b = O[f];
                c = 10 - (t - b[4]) / 1E3;
                if (c <= 0) {
                    O.splice(f, 1),
                    --f;
                } else {
                    1 < c && (c = 1), a.globalAlpha = .3 * c;
                    a.moveTo(b[0] - .5, b[1] - .5);
                    a.lineTo(b[2] - .5, b[3] - .5);
                }
            }
            a.stroke();
            a.restore();
        }
        a.save();
        //for (var p in F) F.hasOwnProperty(p) && a.drawImage(P, scale(sa(F[p].getX()) - 6), scale(ta(F[p].getY()) - 6), scale(P.width), scale(P.height));
        //cursorsonline=0;
        for (var p in F) {
            F.hasOwnProperty(p) && a.drawImage(P, sa(F[p].getX()) - 6, ta(F[p].getY()) - 6);
            //cursorsonline+=1;
            // show ids?
            if (showcursorsid) {
                if(cursorIDPos==2) {
                    cp=a.measureText(p).width;
                    a.globalAlpha = .5; a.strokeText( p, sa(F[p].getX()) - cp + cursorIDX, ta(F[p].getY()) + cursorIDY );
                    a.globalAlpha= 1; a.fillText( p, sa(F[p].getX()) - cp + cursorIDX, ta(F[p].getY()) + cursorIDY );
                }
                else{
                    a.globalAlpha = .5; a.strokeText( p, sa(F[p].getX()) + cursorIDX, ta(F[p].getY()) + cursorIDY );
                    a.globalAlpha= 1; a.fillText( p, sa(F[p].getX()) + cursorIDX, ta(F[p].getY()) + cursorIDY );
                }
            }
        }
        if (showcursorsid) {
            if(cursorIDPos==2) {
                cp=a.measureText(ha).width;
                a.globalAlpha = .5; a.strokeText( ha, sa(k) - cp + cursorIDX, ta(q) + cursorIDY ) ;
                a.globalAlpha= 1; a.fillText( ha, sa(k) - cp + cursorIDX, ta(q) + cursorIDY ) ;
            }
            else{
                a.globalAlpha = .5; a.strokeText( ha, sa(k) + cursorIDX, ta(q) + cursorIDY ) ;
                a.globalAlpha= 1; a.fillText( ha, sa(k) + cursorIDX, ta(q) + cursorIDY ) ;
            }
        }

        a.restore();
        oa(!0);
        if (!D) {
            a.font = 15 + "px NovaSquare", a.strokeStyle = "#000000", a.fillStyle = "#FFFFFF", a.lineWidth = 2.5;
            if (message.length>0) {
                b = a.measureText(message).width/2;
                a.globalAlpha = .5, a.strokeText(message, 400 - b, 580), a.globalAlpha = 1;
                a.fillText(message, 400 - b, 580);
            }
            for (var i=0; i < messages.length; i++) {
                b = a.measureText(messages[i]).width/2;
                a.globalAlpha = .5, a.strokeText(messages[i], 400 - b, 580 - messages.length*15 + i*15 ), a.globalAlpha = 1;
                a.fillText(messages[i], 400 - b, 580 - messages.length*15 + i*15);
            }
            if (showHelp) {
                var oo = a.measureText("->").width;
                a.font = 12 + "px NovaSquare";
                f = "como usar (precione F1):",                                    a.globalAlpha = .5, a.strokeText(f, 10, 45), a.globalAlpha = 1, a.fillText(f, 10, 45);
                f = "-> para digitar escreva a mensagem e precione enter (Shift+click para proxima linha)",  a.globalAlpha = .5, a.strokeText(f, 10, 60), a.globalAlpha = 1, a.fillText(f, 10, 60);
                f = "-> para habilitar ou desabilitar o movimento precione delete",        a.globalAlpha = .5, a.strokeText(f, 10, 75), a.globalAlpha = 1, a.fillText(f, 10, 75);
                f =    "O pathfiner estará ativo neste modo",                          a.globalAlpha = .5, a.strokeText(f, 10+oo, 90), a.globalAlpha = 1, a.fillText(f, 10+oo, 90);
                f = "-> para desenhar um circulo precione insert",         a.globalAlpha = .5, a.strokeText(f, 10, 105), a.globalAlpha = 1, a.fillText(f, 10, 105);
                f = "-> para desenhar setas precione as setas do teclado",                             a.globalAlpha = .5, a.strokeText(f, 10, 120), a.globalAlpha = 1, a.fillText(f, 10, 120);
                f = "-> para desenhar imagens precione numpad 1 - numpad 9",                      a.globalAlpha = .5, a.strokeText(f, 10, 135), a.globalAlpha = 1, a.fillText(f, 10, 135);
                f = "-> para almentar ou diminuir o tamanho das imagens precione + e -",               a.globalAlpha = .5, a.strokeText(f, 10, 150), a.globalAlpha = 1, a.fillText(f, 10, 150);
                f = "-> Redefinir o tamanho do desenho com o numpad *",                             a.globalAlpha = .5, a.strokeText(f, 10, 165), a.globalAlpha = 1, a.fillText(f, 10, 165);
                f = "-> mostrar ou ocultar o id dos cursores precione F8",                             a.globalAlpha = .5, a.strokeText(f, 10, 180), a.globalAlpha = 1, a.fillText(f, 10, 180);
                f = "-> para mudar a posição do id precione F9",                                  a.globalAlpha = .5, a.strokeText(f, 10, 195), a.globalAlpha = 1, a.fillText(f, 10, 195);
            }
        }
    }
    a.restore();
    A.requestAnimationFrame(ma)
}

function scale(z) {
    return Math.round(z/600*a.canvas.height);
}

function na() {
    a.save();
    a.strokeStyle = "#000000";
    t = +new Date;
    for (var f = 0; f < I.length; f++) {
        var b = I[f],
            c = (t - b[2]) / 1E3,
            d = 1 - 2 * c;
        0 >= d ? (I.splice(f, 1), --f) : (c *= 50, a.beginPath(), a.globalAlpha = .3 * d, a.arc(b[0], b[1], c, 0, 2 * Math.PI, !1), a.stroke());
    }
    a.restore()
}

function oa(f) {
    if (D) a.save(), a.globalAlpha = 1, a.drawImage(P, B - 5, C - 5, P.width, P.height);
    else {
        var b = 0,
            c = 0;
        if (v != k || w != q) {
            a.save();
            if (f) {
                a.globalAlpha = .2, a.fillStyle = "#FF0000", a.beginPath();
                a.arc(B + 2, C + 8, 20, 0, 2 * Math.PI, !1);
                a.fill();
            }
            a.globalAlpha = .5;
            a.drawImage(P, B - 5, C - 5, P.width, P.height);
            a.restore();
        } else {
            b = B & 1, c = C & 1;
        }
        a.save();
        if (f) {
            a.globalAlpha = .2, a.fillStyle = "#FFFF00", a.beginPath();
            a.arc((k << 1) + b + 2, (q << 1) + c + 8, 20, 0, 2 * Math.PI, !1);
            a.fill();
        }
        a.globalAlpha = 1;
        a.drawImage(Ia, (k << 1) + b - 5, (q << 1) + c - 5, Ia.width, Ia.height);
        if (!movementEnabled) {
            a.strokeStyle = "#DD4444", a.lineWidth = 1;
            a.beginPath();
            a.arc(serverPosX << 1, serverPosY << 1, 4, 0, 2*Math.PI);
            a.stroke();
        }
    }
    a.restore();
}

function ka(a, b) {
    this.oldX = this.newX = a;
    this.oldY = this.newY = b;
    this.time = t
}

function pa(a) {
    return a * a * (3 - 2 * a)
}

function fa(a, b, c, d) {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    if (z(a, b)) return {
        x: a,
        y: b
    };
    if (a == c && b == d) return {
        x: c,
        y: d
    };
    var g = a,
        e = b;
    c = c - a | 0;
    d = d - b | 0;
    var n =
        0,
        l = 0,
        p = 0,
        k = 0;
    0 > c ? n = -1 : 0 < c && (n = 1);
    0 > d ? l = -1 : 0 < d && (l = 1);
    0 > c ? p = -1 : 0 < c && (p = 1);
    var m = Math.abs(c) | 0,
        h = Math.abs(d) | 0;
    m <= h && (m = Math.abs(d) | 0, h = Math.abs(c) | 0, 0 > d ? k = -1 : 0 < d && (k = 1), p = 0);
    c = m >> 1;
    for (d = 0; d <= m && !z(a, b); d++) g = a, e = b, c += h, c >= m ? (c -= m, a += n, b += l) : (a += p, b += k);
    return {
        x: g,
        y: e
    }
}

function z(a, b) {
    return 0 > a || 400 <= a || 0 > b || 300 <= b ? !0 : T[a + 400 * b]
}

function Ja() {
    for (var a = 0; a < r.length; a++) {
        var b = r[a];
        5 == b.type && Ka(b)
    }
}

function Ka(a) {
    function b(a, b, c) {
        e.push([c, a, b]);
        l[a + 400 * b] = !0;
        g(a, b)
    }

    function c(a, b, c) {
        p.push([c,
            a, b
        ]);
        l[a + 400 * b] = !0
    }

    function d(a, b) {
        return 255 != k[4 * (a + 400 * b) + 3] && !l[a + 400 * b]
    }

    function g(a, b) {
        var c = 4 * (a + 400 * b);
        k[c + 0] = 255;
        k[c + 1] = 153;
        k[c + 2] = 153;
        k[c + 3] = 255
    }
    for (var e = a.queue, k = a.img.data, l = a.explored, p = a.potentialQueue, r = e.length, m = 0; m < p.length; m++) z(p[m][1], p[m][2]) || (g(p[m][1], p[m][2]), e.push(p[m]), p.splice(m, 1), --m);
    for (m = 0; m < r; ++m) z(e[m][1], e[m][2]) && (p.push(e[m]), e.splice(m, 1), --m, --r);
    for (r = 0; 50 > r && 0 != e.length; ++r) {
        for (var h = Number.POSITIVE_INFINITY, q = [e[0]], m = 1; m < e.length; ++m) {
            var x = e[m][0];
            .01 > Math.abs(x - h) ? q.push(e[m]) : x < h && (h = x, q = [e[m]])
        }
        for (m = 0; m < q.length; ++m) {
            var x = q[m][0],
                h = q[m][1],
                s = q[m][2],
                qa = e.indexOf(q[m]); - 1 != qa && e.splice(qa, 1);
            0 < h && d(h - 1, s) && (z(h - 1, s) ? c(h - 1, s, x + 1) : b(h - 1, s, x + 1));
            0 < s && d(h, s - 1) && (z(h, s - 1) ? c(h, s - 1, x + 1) : b(h, s - 1, x + 1));
            400 > h + 1 && d(h + 1, s) && (z(h + 1, s) ? c(h + 1, s, x + 1) : b(h + 1, s, x + 1));
            300 > s + 1 && d(h, s + 1) && (z(h, s + 1) ? c(h, s + 1, x + 1) : b(h, s + 1, x + 1));
            0 < h && 0 < s && d(h - 1, s - 1) && (z(h - 1, s - 1) ? c(h - 1, s - 1, x + Math.SQRT2) : b(h - 1, s - 1, x + Math.SQRT2));
            0 < h && 300 > s + 1 && d(h - 1, s + 1) && (z(h - 1, s + 1) ? c(h - 1, s + 1, x + Math.SQRT2) :
                b(h - 1, s + 1, x + Math.SQRT2));
            400 > h + 1 && 0 < s && d(h + 1, s - 1) && (z(h + 1, s - 1) ? c(h + 1, s - 1, x + Math.SQRT2) : b(h + 1, s - 1, x + Math.SQRT2));
            400 > h + 1 && 300 > s + 1 && d(h + 1, s + 1) && (z(h + 1, s + 1) ? c(h + 1, s + 1, x + Math.SQRT2) : b(h + 1, s + 1, x + Math.SQRT2))
        }
    }
    a.ctx.putImageData(a.img, 0, 0)
}
var y, a, ia = 0,
    Rat = A.devicePixelRatio;
    cp = 0,
    v = 0,
    w = 0,
    B = 0,
    C = 0,
    k = 0,
    q = 0,
    J = -1,
    K = -1,
    M = null,
    H = null,
    P = new Image;
P.src = "img/cursor.png";
var Ia = P,
    D = -1 != A.location.search.indexOf("editor"),
    I = [],
    O = [],
    t = 0,
    ca = 0,
    u = null,
    ha = -1,
    F = {},
    aa = 0,
    ja = !1,
    Y = !1,
    R = 0,
    S = 0,
    da = 0,
    X = !1,
    L = !D && !0,
    T = new Uint8Array(12E4),
    r = [],
    N = [];
Array.prototype.remove =
    function(a) {
        a = this.indexOf(a);
        return -1 != a ? (this.splice(a, 1), !0) : !1
    };
var G = 0;
ka.prototype = {
    oldX: 0,
    oldY: 0,
    newX: 0,
    newY: 0,
    time: 0,
    getX: function() {
        var a = this.newX - this.oldX,
            b = (t - this.time) / 100,
            b = pa(0 >= b ? 0 : 1 <= b ? 1 : b);
        return this.oldX + b * a
    },
    getY: function() {
        var a = this.newY - this.oldY,
            b = (t - this.time) / 100,
            b = pa(0 >= b ? 0 : 1 <= b ? 1 : b);
        return this.oldY + b * a
    }
};

var za = new Uint8Array(12E4);
Array.prototype.remove = function(a) {
    a = this.indexOf(a);
    return -1 != a ? (this.splice(a, 1), !0) : !1
};

var imgSizeShowDur;
var imgSizePrcnt=100;
function imgSizeDisplay() {
    clearTimeout(imgSizeShowDur);
    imgSizePrcnt = Math.round(imageScale*100);
    imgSizeInput(imgSizePrcnt);
    imgSizeShow = true;
    imgSizeShowDur = setTimeout(function() { imgSizeShow = false; }, 3000);
}

function imgSizeInput(d) {
    var dd = document.getElementById('imgsize');
    dd.value=d;
}

function imgSizeUp() {
    imageScale += 0.1;
    imgSizeDisplay();
}

function imgSizeDown() {
    if(imageScale > 0.19) imageScale -= 0.1;
    imgSizeDisplay();
}

function imgSizeReset() {
    imageScale = 1.0;
    imgSizeDisplay();
}

function pathfinderbox() {
    dd = document.getElementById('pathfinder');
    movementEnabled = !movementEnabled; 
    if (movementEnabled) dd.checked = false;
    else dd.checked = true;
}

function fontwidth() {
    dd = document.getElementById('fontwidth');
    fontthin = !fontthin;
    if (fontthin) { textwidth=2/3; dd.checked = true; }
    else { textwidth=1; dd.checked = false; }
}

function hideExtraInfoLbls() {
    dd = document.getElementById('extrainfo');
    hideExtraInfo=!hideExtraInfo;
    if (hideExtraInfo) dd.checked = true;
    else dd.checked = false;
}

var taploop, tapchk=false;
function tap() {// send a click every 3 seconds
    if (tapchk) { clearInterval(taploop); tapchk=false; }
    else { taploop = setInterval(function() { wa(k,q,1); }, 3000); tapchk=true; }
}

var message = new String();
var messages = new Array();

function drawM(m,d,x,y) {
    setTimeout(function() {
        drawWord(m, x, y );
    }, d);
}

function handleKeypress(e) {
    if (e.target.tagName.toUpperCase() == 'INPUT') return;
    if ((e.which >= 32 && e.which <= 64) ||
        (e.which >= 65 && e.which <= 90) ||
        (e.which >= 91 && e.which <= 126) ) {
        e.preventDefault();
        message = message.concat(String.fromCharCode(e.which));
        return;
    }
    switch(e.which) {
        case 13:
            e.preventDefault();
            if (e.shiftKey) { //add new row
                messages.push(message);
                message = "";
            }
            else { //print all rows
                messages.push(message);
                for(var i=0; i < messages.length; i++) {
                    if (i>0) var del = messages[i-1].length*i*50;
                    else var del=0;
                    drawM(messages[i],del,k,q+i*kerning*fontSize);//not ideal printing, but better than printing as columns
                }
                message = "";
                messages = [];
            }

            break;
        default:
            return;
    }
}

function handleKeydown(e) {
    if (e.target.tagName.toUpperCase() == 'INPUT') return;
    if (e.keyCode == 8 || e.keyCode == 9 || (e.keyCode >=33 && e.keyCode <= 40)
        || (e.keyCode >= 96 && e.keyCode <= 122)
        //|| e.keyCode == 12 || e.keyCode == 45 || (e.keyCode >= 33 && e.keyCode <= 36)
    ) {
        e.preventDefault();
    }
    if (e.keyCode == 8) {
        if (message.length > 0) {
            message = message.substring(0, message.length - 1);
        }
        else if (messages.length > 0) {
            message = messages.pop();
        }
    }
    switch(e.keyCode) {
        case 37: // left arrow
            drawImage(0, posX, posY); // draw arrow pointing left
            break;
        case 38: // up arrow
            drawImage(1, posX, posY); // draw arrow pointing up
            break;
        case 39: // right arrow
            drawImage(2, posX, posY); // draw arrow right
            break;
        case 40: // down arrow
            drawImage(3, posX, posY); // draw arrow down
            break;
        case 106: //numpad *
            imgSizeReset(); // reset drawings size
            break;
        case 107: //numpad +
            imgSizeUp(); // make drawings bigger
            break;
        case 109: //numpad -
            imgSizeDown(); // make drawings smaller
            break;
        case 33: // Page Up
            drawWord(cmessage, posX, posY); //print message
            break;
        case 46: case 110: // numpad .
            pathfinderbox(); // disable/enable movement by click
            break;
        case 45: case 96: // numpad 0
            auraEnabled = !auraEnabled; // start/stop drawing circle
            break;
        case 97: //case 35: // numpad 1
            drawImage(4, posX, posY); // star
            break;
        case 98: //case 40: // numpad 2
            drawImage(5, posX, posY); // reversed star
            break;
        case 99: //case 34: // numpad 3
            drawImage(6, posX, posY); // tictactoe
            break;
        case 100: //case 37: // numpad 4
            drawImage(7, posX, posY); // triforce
            break;
        case 101: //case 12: // numpad 5
            drawImage(8, posX, posY); // cannon - pentashot
            break;
        case 102: //case 39: // numpad 6
            drawImage(9, posX,posY); // heart
            break;
        case 103: //case 36: // numpad 7
            imageScale/=1.25;
            drawImage(10, posX, posY); // penrose
            imageScale*=1.25;
            break;
        case 104: //case 38: // numpad 8
            //imageScale/=2.5;
            drawImage(11, posX, posY); // boxception
            //imageScale*=2.5;
            break;
        case 105: // numpad 9
            drawImage(12, posX, posY); // cursor
            break;
        case 111: // numpad /
            imageScale/=2.5;
            drawImage(13, posX, posY); // dickboob
            imageScale*=2.5;
            break;
        case 112: // F1
            showHelp = !showHelp; // show/hide help
            break;
        case 115: // F4
            //tap();
            break;
        case 119: // F8
            showcursorsid = !showcursorsid; // show/hide cursors ids
            break;
        case 120: // F9
            cursorIDPos+=1;
            changeCursorIDpos(cursorIDPos);
            break;
        case 121: // F10
            fontwidth();
            break;
        case 122: // F11
            hideExtraInfoLbls();
            break;
        default:
            return;
    }
}

var cursorIDPos=1;
var cursorIDX=-2;
var cursorIDY=24;

function changeCursorIDpos(c) {
    switch(c) {
        case 1: cursorIDX=-2; cursorIDY=24; break;
        case 2: cursorIDX=-3; cursorIDY=14; break;
        case 3: cursorIDX=-2; cursorIDY=-3; break;
        case 4: cursorIDX=10; cursorIDY=14; break;
        default: cursorIDX=-2; cursorIDY=24; cursorIDPos=1;
    }
}

function drawAura(x, y) {
    var dt = 360/(1000/40)/2;
    if (u != null && u.readyState == WebSocket.OPEN) {
        var g = new ArrayBuffer(9),
            e = new DataView(g);
        e.setUint8(0, 3);
        e.setUint16(1, x+Math.sin(degToRad(auraTime+dt))*auraRadius, !0);
        e.setUint16(3, y+Math.cos(degToRad(auraTime+dt))*auraRadius, !0);
        e.setUint16(5, x+Math.sin(degToRad(auraTime))*auraRadius, !0);
        e.setUint16(7, y+Math.cos(degToRad(auraTime))*auraRadius, !0);
        u.Send(g)
    }

    auraTime += dt;
}

function drawImage(ind, x, y) {
    if (!imgData[ind]) return;
    for (var i = 0; i < imgData[ind].length; i++) {
        var g = new ArrayBuffer(9),
            e = new DataView(g);
        e.setUint8(0, 3);
        e.setUint16(1, x+imgData[ind][i][1]*imageScale, !0);
        e.setUint16(3, y+imgData[ind][i][0]*imageScale, !0);
        e.setUint16(5, x+imgData[ind][i][3]*imageScale, !0);
        e.setUint16(7, y+imgData[ind][i][2]*imageScale, !0);
        u.Send(g);
    }
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

var textwidth = 1; // 1 = full width, 2/3 = thin text
function drawLetter(a, x, y) {
    var letter;
    var capital = 1;
    var shift = 0;
    if (alphabet.hasOwnProperty(a)) {
        letter = alphabet[a];
    } else if (a + 32 >= 97 && a + 32 <= 122) {
        capital = 1.5;
        shift = -2;
        letter = alphabet[a + 32];
    } else return;
    for (var i = 0; i < letter.length; i++) {
        var g = new ArrayBuffer(9),
            e = new DataView(g);
        e.setUint8(0, 3);
        e.setUint16(1, x+letter[i][1]*fontSize*textwidth, !0);
        e.setUint16(3, y+letter[i][0]*fontSize*capital + shift, !0);
        e.setUint16(5, x+letter[i][3]*fontSize*textwidth, !0);
        e.setUint16(7, y+letter[i][2]*fontSize*capital + shift, !0);
        u.Send(g);
    }
}

function drawWord(s, x, y) {
    if (s == null) return;
    setTimeout(function () {
        if (!z(Math.round(x+fontSize*kerning*textwidth), Math.round(y)))    {
            drawLetter(s.charCodeAt(0), x, y);
            if (s.length > 0) drawWord(s.substring(1, s.length), x+fontSize*kerning*textwidth, y);
        }
    }, 1);
}
WebSocket.prototype.Send = function(frm) {
    if (u != null && u.readyState == WebSocket.OPEN) {
        if (Throttler.check(frm)) this.send(frm);
    }
};

var Throttler = {
    rate: 3,
    per: 150,
    storage: [],
    allowed: 3,
    lastFrameAt: 0,
    sendOut: function() {
        if (this.storage.length != 0) {
            u.Send(this.storage.shift());
        }
    },
    check: function(frm) {
        var now = Date.now();
        var allowance = this.allowed;
        var timeDiff = now - this.lastFrameAt;
        this.lastFrameAt = now;
        allowance += timeDiff*(this.rate/this.per);
        if (allowance > this.rate) allowance = this.rate;
        this.allowed = allowance;
        if (this.allowed < 1) {
            if (this.storage.length < 300)  {
                var dv = new DataView(frm);
                if (dv.getUint8(0) == 3) this.storage.push(frm);
            }
            return false;
        }
        this.allowed -= 1;
        return true;
    }
};

var ff = navigator.userAgent.indexOf("Chrome") == -1;

function dos(head) {
    var gridX = 400,
        gridY = 300;
    var grid = [];
    visit = [];
    for (var i = 0; i < gridY; i++) {
        grid[i] = [];
        visit[i] = [];
        for (var j = 0; j < gridX; j++) grid[i][j] = 0, visit[i][j] = 0;
    }
    r.forEach(function(d) {
        if ((d.type == 1) || (d.type == 2 && d.isBad))
            for (var j = 0; j < d.height; j++)
                for (var i = 0; i < d.width; i++) grid[d.y + j][d.x + i] = 3
    });
    var bfs = [head],
        bfs2 = [];
    while (bfs.length) {
        bfs.forEach(function(dat) {
            var x = dat[0],
                y = dat[1];
            if (x == null || y == null) return;
            if (grid[y][x] == 3) return;
            grid[y][x] = 3;
            for (var X = x + 1; X < gridX && !(grid[y][X] & 1); X++) {
                grid[y][X] |= 1;
                if (!visit[y][X]) {
                    visit[y][X] = [x, y], bfs2.push([X, y]);
                }
            }
            for (var X = x - 1; X >= 0 && !(grid[y][X] & 1); X--) {
                grid[y][X] |= 1;
                if (!visit[y][X]) {
                    visit[y][X] = [x, y], bfs2.push([X, y]);
                }
            }
            for (var Y = y + 1; Y < gridY && !(grid[Y][x] & 2); Y++) {
                grid[Y][x] |= 2;
                if (!visit[Y][x]) {
                    visit[Y][x] = [x, y], bfs2.push([x, Y]);
                }
            }
            for (var Y = y - 1; Y >= 0 && !(grid[Y][x] & 2); Y--) {
                grid[Y][x] |= 2;
                if (!visit[Y][x]) {
                    visit[Y][x] = [x, y], bfs2.push([x, Y]);
                }
            }
        });
        bfs = bfs2;
        bfs2 = [];
    }
}

window.head=[];
window.delay=30;
function fm(mov, i=0) {
    if (!D && null != u && u.readyState == WebSocket.OPEN) {
        if (i >= mov.length) {
            var buf = new ArrayBuffer(9),
            q = new DataView(buf);
            q.setUint8(0, 2, 1);
            q.setUint16(1, mov[i-1][0], 1);
            q.setUint16(3, mov[i-1][1], 1);
            q.setInt32(5, -1, 1);
            WebSocket.prototype.send.call(u, buf);
            WebSocket.prototype.send.call(u, buf);
            return;
        }
        var buf = new ArrayBuffer(9),
        q = new DataView(buf);
        q.setUint8(0, 1, 1);
        q.setUint16(1, mov[i][0], 1);
        q.setUint16(3, mov[i][1], 1);
        q.setInt32(5, -1, 1);
        WebSocket.prototype.send.call(u, buf);
        W(mov[i][0], mov[i][1]);
        if(delay == 0) {
            fm(mov,i+1);
        } else {
            setTimeout(function() {
                fm(mov, i + 1)
            }, delay);
        }
    }
}

function pf(e) {
    auraEnabled = false;
    unfocus();
    if(ff) {e.offsetX = e.pageX - canvas.offsetLeft; e.offsetY = e.pageY - canvas.offsetTop}
    var xy = [e.offsetX / 2 | 0, e.offsetY / 2 | 0];
    var mov = [];
    if (r && !(xy[0] == head[0] && xy[1] == head[1]) && !e.ctrlKey && !movementEnabled) {
        head = [serverPosX,serverPosY];
        dos(head);
        var xy2 = xy.slice(0);
        while (visit[xy2[1]][xy2[0]]) {
            mov.push(xy2);
            xy2 = visit[xy2[1]][xy2[0]]
        }
        mov = mov.reverse();
        if (mov.length == 0) {
            return;
        }
        else fm(mov);
    } else if (!movementEnabled) {mov.push(xy); fm(mov);}
    else {}
}

function connect() {
    if (m28n.findServerPreference) {
         if (!u) m28n.findServerPreference("cursors", function(e,a) {
            if (e||0 == a.length) {
                setTimeout(self.connect, 1E3);
            } else {
                var ipv4 = a[0].ipv4;
                var ipv6 = a[0].ipv6;
                var port = a[0].port;
                port = 2828;
                u = new WebSocket("ws://" + (ipv4 || "[" + ipv6 + "]") + ":" + port);
                setHandlers();
            }
        });
    } else {
        if (!u) u = new WebSocket("ws://s1.cursors.io:443/");
        setHandlers();
    }
    function setHandlers() {
        u.binaryType = "arraybuffer";
        u.onopen = Aa, u.onmessage = Ga, u.onclose = Ba, u.onerror = Ca;
    }
}

var messageDisplay;
function doit() {
    //document.body.innerHTML += '<div id="messageDisplay"></div>';
    //messageDisplay = document.getElementById("messageDisplay");
    var el0 =  document.getElementById('h-options');
    if (el0 != null) { el0.remove(); }

    document.body.innerHTML += css;

    y = E.getElementById("canvas");
    a = y.getContext("2d");

    try {
        A.top.location.origin != A.location.origin && ba()
    } catch (f) {
        ba()
    }
    y.width = 800 * Rat;
    y.height = 600 * Rat;
    a.scale(Rat, Rat);
    y.onmousemove = ua;
    y.onmousedown = va;
    y.onmouseup = xa;
    y.onclick = pf;
    M = E.getElementById("noCursorLock");
    H = E.getElementById("noDrawings");
    null != localStorage && (Ma(), M.checked = "1" == A.localStorage.getItem("noCursorLock") ? !0 : !1, H.checked = "1" == A.localStorage.getItem("noDrawings") ? !0 : !1);
    A.onbeforeunload = ya;
    y.requestPointerLock = y.requestPointerLock || y.mozRequestPointerLock || y.webkitRequestPointerLock;
    y.style.cursor = "none";
    D || connect();
    setInterval(Q, 40);
    //setInterval(Ja, 40);
    setInterval(Au, 50);
    A.requestAnimationFrame(ma);

    document.onkeypress = handleKeypress;
    document.onkeydown = handleKeydown;
}
doit();
}

/*
   ___ _   _ _ __ ___  ___  _ __ ___   _  ___
  / __| | | | `__/ __|/ _ \| `__/ __| | |/ _ \
 | (__| |_| | |  \__ \ (_) | |  \__ \_| | (_) |
  \___|\__,_|_|  |___/\___/|_|  |___(_)_|\___/

para uma versão mais atualizada, clique aqui:
https://greasyfork.org/en/scripts/369975

    como usar:
    -> Vá para cursors.io, abra o console (ctrl + shift + j ou F12)
       e cole esse script inteiro no console e pressione enter
        -se você tiver problemas ao executar o script, certifique-se de bloquear "cursors.io/client_out.js"
    -> Para digitar: digite a mensagem e pressione Enter; shift + enter para nova linha;
       -todas as caracteres ASCII estão disponiveis.
    -> Para mover o cursor apenas ao clicar pressione delete
       -O Pathfinder estará ativo neste modo (CTRL + clique para ignorar o Pathfinder)
       - tente não usar um valor muito baixo do atraso, ou você poderá se desconectar em alguns níveis
       - verifique se 'nenhum bloqueio do cursor' está marcado para que o pathfinder funcione corretamente
    -> Para mover o cursor normalmente: pressione delete. novamente
    -> para desenhar um circulo em volta do seu cursor precione numpad 0 ou insert
    -> para parar de desenhar o circulo precione numpad 0 ou insert
    -> para desenhar setas use as setas do teclado
    -> para desenhar imagens diferentes: precione numpad 1 - numpad 9 teclas
    -> para alterar o tamanho da imagem use numpad + e -
    -> Redefinir o tamanho do desenho com o numpad *
    -> para ver os id's dos cursores use F8
    -> para mudar a posição do id precione F9
    -> para mostrar essa ajuda precione F1
*/