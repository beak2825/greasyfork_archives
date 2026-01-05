// ==UserScript==
// @name        CURSOR.IO CHEAT (WORK IN PROGRESS)
// @namespace   DomsHax
// @description Provides wallhack, typing, +MORE
// @include     http://cursors.io/*
// @version     1.04
// @grant       none
// @author      
// @match        http://agar.io/*
// @require      http://cdn.jsdelivr.net/msgpack/1.05/msgpack.js
// @grant        none
// @run-at       document-window
// @downloadURL https://update.greasyfork.org/scripts/25560/CURSORIO%20CHEAT%20%28WORK%20IN%20PROGRESS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25560/CURSORIO%20CHEAT%20%28WORK%20IN%20PROGRESS%29.meta.js
// ==/UserScript==

var A = window;
var E = document;
 
var debugMode = false;
 
var posX, posY;
var lastX, lastY;
 
var lastFrame;
var currentFrame;
 
var initialLoad = true;
var buttonIndex = 0;
var maxButtons = 20;
var buttons = new Array(maxButtons);
for (var i = 0; i < maxButtons; i++)
    buttons[i] = new Array(3);
 
var auraEnabled = false;
var auraTime = 0;
var auraRadius = 10;
 
var markerEnabled = false;
 
var movementEnabled = true;
 
var imageScale = 1.0;
var imgData = [ [17,49,17,57],
[18,44,18,52],
[18,55,18,59],
[19,41,19,46],
[19,58,19,60],
[20,40,20,42],
[20,60,20,62],
[21,38,21,40],
[21,61,21,63],
[22,37,22,39],
[22,62,22,64],
[23,37,23,38],
[23,63,23,65],
[24,36,24,37],
[24,64,24,65],
[25,35,25,37],
[25,65,25,66],
[26,34,26,36],
[26,65,26,67],
[27,33,27,35],
[27,66,27,67],
[28,32,28,34],
[28,67,28,68],
[29,32,29,34],
[29,67,29,68],
[30,31,30,33],
[30,67,30,69],
[31,31,31,32],
[31,68,31,69],
[32,31,32,32],
[32,68,32,69],
[33,30,33,31],
[33,55,33,59],
[33,68,33,69],
[34,30,34,31],
[34,53,34,58],
[34,59,34,61],
[34,68,34,70],
[35,29,35,31],
[35,52,35,57],
[35,61,35,62],
[35,69,35,70],
[36,29,36,30],
[36,50,36,57],
[36,62,36,63],
[36,69,36,70],
[37,29,37,30],
[37,50,37,58],
[37,62,37,63],
[37,69,37,70],
[38,28,38,30],
[38,49,38,58],
[38,69,38,71],
[38,108,38,115],
[39,28,39,29],
[39,49,39,57],
[39,63,39,64],
[39,70,39,71],
[39,107,39,110],
[39,114,39,116],
[40,28,40,35],
[40,48,40,57],
[40,63,40,64],
[40,70,40,71],
[40,107,40,109],
[40,116,40,117],
[41,27,41,32],
[41,35,41,36],
[41,48,41,57],
[41,63,41,64],
[41,70,41,71],
[41,107,41,108],
[41,117,41,118],
[42,26,42,32],
[42,36,42,37],
[42,48,42,56],
[42,62,42,64],
[42,70,42,72],
[42,107,42,108],
[42,118,42,119],
[43,25,43,32],
[43,36,43,38],
[43,41,43,42],
[43,48,43,56],
[43,62,43,63],
[43,70,43,72],
[43,107,43,108],
[43,118,43,119],
[44,25,44,32],
[44,37,44,38],
[44,40,44,41],
[44,47,44,55],
[44,61,44,63],
[44,71,44,72],
[44,107,44,108],
[44,118,44,119],
[45,24,45,32],
[45,37,45,40],
[45,48,45,50],
[45,59,45,62],
[45,71,45,72],
[45,107,45,108],
[45,118,45,119],
[46,24,46,32],
[46,37,46,40],
[46,49,46,51],
[46,58,46,60],
[46,71,46,72],
[46,107,46,108],
[46,119,46,120],
[47,23,47,32],
[47,37,47,39],
[47,50,47,53],
[47,55,47,58],
[47,71,47,73],
[47,107,47,108],
[47,119,47,120],
[48,23,48,31],
[48,36,48,39],
[48,52,48,56],
[48,72,48,73],
[48,107,48,108],
[48,119,48,120],
[49,23,49,30],
[49,35,49,38],
[49,62,49,65],
[49,72,49,73],
[49,106,49,108],
[49,119,49,120],
[50,24,50,29],
[50,34,50,38],
[50,43,50,46],
[50,61,50,64],
[50,72,50,74],
[50,106,50,108],
[50,119,50,120],
[51,24,51,28],
[51,32,51,34],
[51,36,51,37],
[51,40,51,42],
[51,45,51,46],
[51,58,51,62],
[51,72,51,74],
[51,106,51,108],
[51,119,51,120],
[52,25,52,32],
[52,36,52,37],
[52,45,52,46],
[52,56,52,60],
[52,73,52,74],
[52,106,52,108],
[52,119,52,120],
[53,26,53,28],
[53,35,53,37],
[53,44,53,46],
[53,55,53,58],
[53,73,53,74],
[53,106,53,107],
[53,119,53,120],
[54,26,54,27],
[54,36,54,38],
[54,41,54,45],
[54,52,54,56],
[54,73,54,75],
[54,106,54,107],
[54,119,54,120],
[55,26,55,27],
[55,37,55,44],
[55,50,55,54],
[55,74,55,75],
[55,106,55,107],
[55,119,55,120],
[56,26,56,27],
[56,47,56,51],
[56,74,56,75],
[56,106,56,107],
[56,119,56,120],
[57,26,57,27],
[57,45,57,49],
[57,74,57,76],
[57,106,57,107],
[57,119,57,120],
[58,26,58,27],
[58,42,58,46],
[58,74,58,76],
[58,106,58,107],
[58,115,58,116],
[58,118,58,119],
[59,26,59,28],
[59,39,59,44],
[59,75,59,76],
[59,105,59,107],
[59,118,59,119],
[60,27,60,28],
[60,37,60,41],
[60,75,60,77],
[60,105,60,106],
[60,118,60,119],
[60,124,60,125],
[61,27,61,28],
[61,33,61,38],
[61,76,61,77],
[61,105,61,106],
[61,117,61,118],
[61,123,61,127],
[62,27,62,28],
[62,30,62,35],
[62,76,62,78],
[62,104,62,106],
[62,116,62,118],
[62,122,62,124],
[62,126,62,128],
[63,27,63,28],
[63,30,63,31],
[63,77,63,78],
[63,98,63,102],
[63,104,63,105],
[63,116,63,117],
[63,121,63,123],
[63,126,63,128],
[64,27,64,28],
[64,77,64,79],
[64,95,64,105],
[64,116,64,118],
[64,119,64,121],
[64,126,64,128],
[65,27,65,29],
[65,68,65,69],
[65,78,65,79],
[65,92,65,96],
[65,103,65,105],
[65,115,65,120],
[65,123,65,126],
[65,127,65,128],
[66,28,66,29],
[66,63,66,64],
[66,68,66,70],
[66,78,66,80],
[66,91,66,93],
[66,103,66,104],
[66,117,66,118],
[66,127,66,128],
[67,28,67,29],
[67,63,67,64],
[67,69,67,70],
[67,79,67,80],
[67,89,67,91],
[67,103,67,104],
[67,126,67,128],
[68,28,68,29],
[68,64,68,65],
[68,69,68,70],
[68,79,68,81],
[68,87,68,89],
[68,102,68,104],
[68,120,68,131],
[69,28,69,29],
[69,69,69,70],
[69,80,69,82],
[69,87,69,88],
[69,102,69,103],
[69,122,69,132],
[70,29,70,30],
[70,70,70,71],
[70,80,70,82],
[70,85,70,87],
[70,101,70,113],
[70,132,70,133],
[71,29,71,30],
[71,65,71,66],
[71,70,71,71],
[71,81,71,83],
[71,85,71,86],
[71,91,71,92],
[71,99,71,116],
[71,132,71,133],
[72,29,72,30],
[72,65,72,66],
[72,70,72,71],
[72,81,72,85],
[72,91,72,94],
[72,97,72,100],
[72,115,72,118],
[72,132,72,134],
[73,29,73,30],
[73,70,73,72],
[73,81,73,85],
[73,94,73,99],
[73,118,73,120],
[73,132,73,133],
[74,29,74,30],
[74,71,74,72],
[74,81,74,84],
[74,95,74,98],
[74,119,74,120],
[74,132,74,133],
[75,30,75,31],
[75,66,75,67],
[75,71,75,72],
[75,82,75,84],
[75,94,75,96],
[75,120,75,121],
[75,128,75,129],
[75,131,75,133],
[76,30,76,31],
[76,66,76,67],
[76,71,76,72],
[76,83,76,84],
[76,89,76,90],
[76,94,76,95],
[76,121,76,122],
[76,124,76,125],
[76,129,76,132],
[77,30,77,31],
[77,72,77,73],
[77,83,77,84],
[77,93,77,94],
[77,121,77,123],
[77,129,77,132],
[78,30,78,32],
[78,67,78,68],
[78,72,78,73],
[78,84,78,85],
[78,92,78,93],
[78,122,78,123],
[78,125,78,129],
[79,30,79,32],
[79,67,79,68],
[79,72,79,73],
[79,85,79,86],
[79,91,79,93],
[79,122,79,128],
[80,31,80,32],
[80,67,80,68],
[80,72,80,74],
[80,91,80,92],
[80,122,80,123],
[81,31,81,33],
[81,73,81,74],
[81,91,81,92],
[81,123,81,124],
[82,31,82,33],
[82,68,82,69],
[82,73,82,74],
[82,102,82,103],
[82,123,82,124],
[83,32,83,33],
[83,68,83,69],
[83,73,83,74],
[83,101,83,102],
[83,123,83,124],
[84,32,84,33],
[84,68,84,69],
[84,73,84,74],
[84,123,84,124],
[85,32,85,34],
[85,69,85,70],
[85,73,85,74],
[85,123,85,124],
[86,33,86,35],
[86,69,86,70],
[86,74,86,75],
[86,123,86,124],
[87,34,87,35],
[87,74,87,75],
[87,123,87,124],
[88,34,88,36],
[88,70,88,71],
[88,75,88,76],
[88,122,88,124],
[89,35,89,36],
[89,70,89,71],
[89,75,89,81],
[89,122,89,123],
[90,35,90,37],
[90,71,90,72],
[90,81,90,84],
[90,121,90,123],
[91,36,91,37],
[91,71,91,72],
[91,84,91,85],
[91,121,91,122],
[92,36,92,38],
[92,70,92,71],
[92,84,92,85],
[92,121,92,122],
[93,37,93,39],
[93,70,93,71],
[93,76,93,78],
[93,83,93,85],
[93,120,93,122],
[94,38,94,39],
[94,69,94,70],
[94,77,94,83],
[94,120,94,121],
[95,38,95,40],
[95,69,95,70],
[95,73,95,74],
[95,77,95,78],
[95,119,95,121],
[96,39,96,41],
[96,69,96,70],
[96,73,96,74],
[96,77,96,78],
[96,104,96,105],
[96,119,96,120],
[97,40,97,41],
[97,69,97,70],
[97,73,97,75],
[97,77,97,78],
[97,118,97,120],
[98,40,98,42],
[98,69,98,70],
[98,73,98,76],
[98,78,98,79],
[98,117,98,119],
[99,41,99,43],
[99,69,99,70],
[99,73,99,74],
[99,75,99,78],
[99,108,99,109],
[99,117,99,118],
[100,42,100,44],
[100,69,100,71],
[100,72,100,73],
[100,76,100,78],
[100,116,100,118],
[101,43,101,45],
[101,70,101,72],
[101,115,101,117],
[102,43,102,45],
[102,114,102,116],
[103,44,103,46],
[103,113,103,115],
[104,45,104,47],
[104,111,104,114],
[105,46,105,48],
[105,109,105,113],
[106,47,106,48],
[106,107,106,111],
[107,48,107,49],
[107,101,107,109],
[108,48,108,51],
[108,101,108,105],
[109,49,109,52],
[109,103,109,104],
[110,51,110,54],
[110,96,110,98],
[110,103,110,104],
[111,52,111,55],
[111,94,111,98],
[111,103,111,104],
[112,54,112,57],
[112,92,112,95],
[112,97,112,98],
[112,103,112,104],
[113,55,113,59],
[113,90,113,93],
[113,97,113,99],
[113,103,113,105],
[114,57,114,61],
[114,87,114,92],
[114,98,114,99],
[114,103,114,105],
[115,59,115,65],
[115,83,115,90],
[115,98,115,99],
[115,104,115,105],
[116,61,116,87],
[116,98,116,99],
[116,104,116,105],
[117,66,117,82],
[117,98,117,100],
[117,104,117,105],
[118,70,118,71],
[118,74,118,75],
[118,99,118,100],
[118,104,118,106],
[119,70,119,71],
[119,74,119,76],
[119,91,119,93],
[119,99,119,100],
[119,105,119,106],
[120,70,120,71],
[120,74,120,76],
[120,88,120,101],
[120,105,120,106],
[121,70,121,71],
[121,74,121,76],
[121,88,121,90],
[121,98,121,101],
[121,105,121,107],
[122,70,122,71],
[122,74,122,76],
[122,89,122,91],
[122,106,122,107],
[123,69,123,71],
[123,74,123,76],
[123,90,123,92],
[123,106,123,107],
[124,69,124,71],
[124,74,124,75],
[124,91,124,94],
[124,106,124,107],
[125,69,125,71],
[125,74,125,75],
[125,92,125,95],
[125,106,125,107],
[126,69,126,70],
[126,75,126,76],
[126,94,126,97],
[126,106,126,108],
[127,69,127,70],
[127,75,127,76],
[127,96,127,99],
[127,107,127,108],
[128,69,128,71],
[128,74,128,76],
[128,98,128,103],
[128,107,128,108],
[129,69,129,71],
[129,74,129,75],
[129,101,129,108],
[130,58,130,63],
[130,70,130,71],
[130,74,130,75],
[131,57,131,59],
[131,63,131,66],
[131,69,131,71],
[131,74,131,75],
[132,58,132,59],
[132,65,132,68],
[132,69,132,71],
[132,74,132,75],
[133,58,133,60],
[133,67,133,71],
[133,74,133,75],
[134,59,134,61],
[134,68,134,70],
[134,74,134,75],
[135,60,135,62],
[135,74,135,75],
[136,61,136,63],
[136,73,136,75],
[137,62,137,65],
[137,73,137,75],
[138,64,138,66],
[138,73,138,74],
[139,65,139,68],
[139,72,139,74],
[140,67,140,74],
[141,70,141,73],
];
 
var fontSize = 2;
var letterOffset = 0;
var alphabet = new Array(200);
alphabet[58] = [
    [0,0,0,1],
    [2,0,2,1]
];
alphabet[40] = [
    [0,2,1,0],
    [2,2,1,0]
];
alphabet[41] = [
    [0,0,1,2],
    [2,0,1,2]
];
alphabet[63] = [
    [1,0,0,0],
    [0,0,0,2],
    [0,2,1,2],
    [1,2,1,1],
    [1,1,2,1]
];
alphabet[97] = [
    [2,0,0,0],
    [0,0,0,2],
    [0,2,2,2],
    [1,0,1,2]
];
alphabet[98] = [
    [2,0,0,0],
    [0,0,0,2],
    [0,2,2,2],
    [2,2,2,0],
    [1,0,1,2]
];
alphabet[99] = [
    [2,2,2,0],
    [2,0,0,0],
    [0,0,0,2]
];
alphabet[100] = [
    [2,0,0,0],
    [0,0,0,1],
    [0,1,1,2],
    [1,2,2,1],
    [2,1,2,0]
];
alphabet[101] = [
    [2,2,2,0],
    [2,0,0,0],
    [0,0,0,2],
    [1,0,1,2]
];
alphabet[102] = [
    [2,0,0,0],
    [0,0,0,2],
    [1,0,1,2]
];
alphabet[103] = [
    [1,1,1,2],
    [1,2,2,2],
    [2,2,2,0],
    [2,0,0,0],
    [0,0,0,2]
];
alphabet[104] = [
    [0,0,2,0],
    [0,2,2,2],
    [1,0,1,2]
];
alphabet[105] = [
    [0,0,0,2],
    [0,1,2,1],
    [2,0,2,2]
];
alphabet[106] = [
    [0,0,0,2],
    [0,1,2,1],
    [2,0,2,1]
];
alphabet[107] = [
    [0,0,2,0],
    [1,0,0,2],
    [1,0,2,2]
];
alphabet[108] = [
    [0,0,2,0],
    [2,0,2,2]
];
alphabet[109] = [
    [0,0,2,0],
    [0,0,2,1],
    [2,1,0,2],
    [0,2,2,2]
];
alphabet[110] = [
    [0,0,2,0],
    [0,0,2,2],
    [0,2,2,2]
];
alphabet[111] = [
    [2,0,0,0],
    [0,0,0,2],
    [0,2,2,2],
    [2,2,2,0]
];
alphabet[112] = [
    [2,0,0,0],
    [0,0,0,2],
    [0,2,1,2],
    [1,2,1,0]
];
alphabet[113] = [
    [2,0,0,0],
    [0,0,0,2],
    [0,2,2,2],
    [2,2,2,0],
    [1,1,2,2]
];
alphabet[114] = [
    [2,0,0,0],
    [0,0,0,2],
    [0,2,1,2],
    [1,2,1,0],
    [1,1,2,2]
];
alphabet[115] = [
    [0,0,0,2],
    [1,0,1,2],
    [2,0,2,2],
    [0,0,1,0],
    [1,2,2,2]
];
alphabet[116] = [
    [0,0,0,2],
    [0,1,2,1]
];
alphabet[117] = [
    [0,0,2,0],
    [0,2,2,2],
    [2,0,2,2]
];
alphabet[118] = [
    [0,0,2,1],
    [0,2,2,1]
];
alphabet[119] = [
    [0,0,2,0],
    [0,2,2,2],
    [2,0,1,1],
    [2,2,1,1]
];
alphabet[120] = [
    [0,0,2,2],
    [2,0,0,2]
];
alphabet[121] = [
    [0,0,1,1],
    [0,2,1,1],
    [1,1,2,1]
];
alphabet[122] = [
    [0,0,0,2],
    [0,2,2,0],
    [2,0,2,2]
];
 
 
function sa(f) {
    return f << 1
}
 
function ta(f) {
    return f << 1
}
 
function U() {
    //return E.pointerLockElement === y || E.mozPointerLockElement === y || E.webkitPointerLockElement === y
}
 
function ba() {
    a.fillStyle = "#000000";
    a.font = "35px NovaSquare";
    a.fillText("Please do not embed our website, thank you.", 400 - a.measureText("Please do not embed our website, thank you.").width / 2, 300);
    a.font = "16px NovaSquare";
    a.fillText("Play the game on http://cursors.io/", 400 - a.measureText("Play the game on http://cursors.io/").width /
        2, 330);
    top.location = "http://cursors.io";
    throw "Please do not embed our website, thank you.";
}
 
function ua(f) {
    V(f)
}
 
// Apparently unimportant
function W(f, b) {
    J = f;
    K = b;
    k = v = f;
    q = w = b;
    B = v << 1;
    C = w << 1
}
 
// Handles clicking
function va(f) {
    if (D) return L = !1, V(f), !1;
    //U() ? X || (X = !0, W(k, q)) : (X = !1, D || M.checked || y.requestPointerLock && y.requestPointerLock());
    if (L) L = !1, Q();
    else if (V(f), (f.ctrlKey || f.shiftKey) && !H.checked) Y = !0, R = k, S = q;
    else if (100 < t - ca && v == k && w == q) {
        ca = t;
        I.push([v << 1, w << 1, t]);
        wa(v, w, 10);
        var b = [v, w];
        N.push(b);
        setTimeout(function() {
            N.remove(b)
        }, 1E3)
    }
    return !1
}
 
// Apparently unimportant
function xa(f) {
    Y = !1
}
 
// Sets local storage for cursor lock and drawing
function ya() {
    A.localStorage && M && (A.localStorage.setItem("noCursorLock", M.checked ? "1" : "0"), A.localStorage.setItem("noDrawings", H.checked ? "1" : "0"))
}
 
// Handles mouse movement and drawing
function V(f) {
    if (U()) {
        var b = f.webkitMovementX || f.mozMovementX || f.movementX || 0;
        f = f.webkitMovementY || f.mozMovementY || f.movementY || 0;
        300 > Math.abs(b) + Math.abs(f) && (B += b, C += f, v = B >> 1, w = C >> 1)
    } else f.offsetX ? (B = f.offsetX, C = f.offsetY) : f.layerX && (B = f.layerX, C = f.layerY), v = B >> 1, w = C >> 1;
    k = v, q = w; /* Changed to allow movement through walls */
    lastX = posX;
    lastY = posY;
    posX = k;
    posY = q;
    if (debugMode) console.log(v + ", " + w);
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
            u.send(g)
 
            if (markerEnabled) {
                e.setUint8(0, 3);
                e.setUint16(1, b+2, !0);
                e.setUint16(3, f, !0);
                e.setUint16(5, a+2, !0);
                e.setUint16(7, d, !0);
                u.send(g)
                e.setUint8(0, 3);
                e.setUint16(1, b, !0);
                e.setUint16(3, f+2, !0);
                e.setUint16(5, a, !0);
                e.setUint16(7, d+2, !0);
                u.send(g)
                e.setUint8(0, 3);
                e.setUint16(1, b-2, !0);
                e.setUint16(3, f, !0);
                e.setUint16(5, a-2, !0);
                e.setUint16(7, d, !0);
                u.send(g)
                e.setUint8(0, 3);
                e.setUint16(1, b, !0);
                e.setUint16(3, f-2, !0);
                e.setUint16(5, a, !0);
                e.setUint16(7, d-2, !0);
                u.send(g)
            }
        }
        R = k;
        S = q;
        da = t
    }
}
 
// Apparently not important
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
                        break a
                    }
                    d[e -
                        1 + 400 * g] || (c.push([e - 1, g]), d[e - 1 + 400 * g] = 1);
                    d[e + 1 + 400 * g] || (c.push([e + 1, g]), d[e + 1 + 400 * g] = 1);
                    d[e + 400 * (g - 1)] || (c.push([e, g - 1]), d[e + 400 * (g - 1)] = 1);
                    d[e + 400 * (g + 1)] || (c.push([e, g + 1]), d[e + 400 * (g + 1)] = 1)
                }
            } while (0 < c.length);
            a = {
                x: a,
                y: b
            }
        }
        k = a.x;
        q = a.y
    }
    if (k != v || q != w) a = fa(k, q, v, w), k = a.x, q = a.y;
    ea(k, q) && Q()
}
 
// Cleans up map on level transition
function $() {
    console.log("Next map");
    initialLoad = true;
    for (var i = 0; i < maxButtons; i++)
        buttons[i] = new Array(3);
    buttonIndex = 0;
    T.set(za);
    r = [];
    I = [];
    O = []
}
 
// Enables image smoothing
function ga(f) {
    a.imageSmoothingEnabled = f;
    a.mozImageSmoothingEnabled = f;
    a.oImageSmoothingEnabled = f;
    a.webkitImageSmoothingEnabled = f
}
 
// Prints connected message
function Aa() {
    $();
    console.log("Connected!")
}
 
// Prints socket closed message
function Ba(a) {
    $();
    console.log("Socket closed: " + a.reason)
}
 
// Prints socket error message
function Ca(a) {
    console.log("Socket error")
}
 
// Gets strings, but without it the map won't load
function Da(a, b) {
    for (var c = "", d = 0, g = 0; 0 != (g = a.getUint8(b)); ++b) d <<= 8, d |= g, g & 128 || (c += String.fromCharCode(d), d = 0);
    0 != d && (c += String.fromCharCode(d));
    return [c, b + 1]
}
 
// You get a TERRIBLE framerate if you remove the contents of this function
function Ea(a, b) {
    setTimeout(function() {
        var c = a.getUint16(b, !0),
            d = 0;
        a: for (; d < c; d++) {
            for (var g = a.getUint16(b + 2 + 4 * d, !0), e = a.getUint16(b + 4 + 4 * d, !0), n = 0; n < N.length; n++) {
                var l = N[n];
                if (l[0] == g && l[1] == e) {
                    N.splice(n, 1);
                    continue a
                }
            }
            I.push([g << 1, e << 1, t])
        }
    }, 100);
    return b +
        2 + 4 * a.getUint16(b, !0)
}
 
// Apparently not important
function Fa(a, b) {
    !H.checked && setTimeout(function() {
        for (var c = a.getUint16(b, !0), d = 0; d < c; d++) {
            var g = a.getUint16(b + 2 + 8 * d, !0),
                e = a.getUint16(b + 4 + 8 * d, !0),
                n = a.getUint16(b + 6 + 8 * d, !0),
                l = a.getUint16(b + 8 + 8 * d, !0);
            O.push([g << 1, e << 1, n << 1, l << 1, t])
        }
    }, 50);
    return b + 2 + 8 * a.getUint16(b, !0)
}
 
// Draws the level. Or at least, without it the level doesn't show up.
function Ga(a) {
    buttonIndex = 0;
    initialLoad = false;
    a = a.data;
    var b = new DataView(a);
    switch (b.getUint8(0)) {
        case 0: // If this doesn't run then you see two of your cursor. One of them lags behind
            ha = b.getUint32(1, !0);
            break;
        case 1: // Without this, doors don't show up
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
                if (g != ha)
                    if (null != F[g]) {
                        for (var p = 0; p < d.length; p++)
                            if (d[p] == g) {
                                d.splice(p, 1);
                                break
                            }
                        g = F[g];
                        g.oldX = g.getX();
                        g.oldY = g.getY();
                        g.newX = n;
                        g.newY = l;
                        g.time = t
                    } else F[g] = new ka(n, l)
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
                        break a
                    }c += 4
            }
            g = b.getUint16(c, !0);
            c += 2;
            for (d = 0; d < g; d++) {
                a: {
                    e = b.getUint32(c, !0);
                    for (n = 0; n < r.length; n++)
                        if (r[n].id == e) {
                            e = r[n];
                            break a
                        }
                    e = {
                        id: e
                    };
                    r.push(e)
                }
                c += 4;c = la(b, c, e)
            }
            c = Fa(b, c);
            if (a.byteLength < c + 4) break;
            aa = b.getUint32(c, !0);
            break;
        case 4: // Without this the level don't show
            $();
            W(b.getUint16(1, !0), b.getUint16(3, !0));
            g = b.getUint16(5, !0);
            c = 7;
            for (d = 0; d < g; d++) e = {}, e.id = b.getUint32(c, !0), c += 4, c = la(b, c, e), r.push(e);
            a.byteLength >= c + 4 ? G = Math.max(G, b.getUint32(c, !0)) : a.byteLength >= c + 2 && (G = Math.max(G, b.getUint16(c, !0)));
            Z();
            break;
        case 5: // Without this things don't trigger unless you are drawing. Also, you can't click buttons.
            W(b.getUint16(1, !0), b.getUint16(3, !0)), 9 <= b.byteLength ? G = Math.max(G, b.getUint32(5, !0)) : 7 <= b.byteLength && (G = Math.max(G, b.getUint16(5, !0))), Z()
    }
}
 
// Without this, your position only updates if you click or draw
function Q() {
    lastFrame = currentFrame;
    currentFrame = new Date().getTime();
 
    if (!(D || L || null == u || u.readyState != WebSocket.OPEN || k == J && q == K) && movementEnabled) {
        var a = new ArrayBuffer(9);
            b = new DataView(a);
        b.setUint8(0, 1);
        b.setUint16(1, k, !0);
        b.setUint16(3, q, !0);
        b.setUint32(5, G, !0);
        u.send(a);
        J = k;
        K = q
    }
 
    if (auraEnabled) // Drawing cursor aura
        drawAura(J, K);
}
 
// Without this clicking doesn't actually get transmitted to the server
function wa(a, b, numClicks) {
    if (!D && null != u && u.readyState == WebSocket.OPEN) {
        var c = new ArrayBuffer(9),
            d = new DataView(c);
        d.setUint8(0, 2);
        d.setUint16(1, a, !0);
        d.setUint16(3, b, !0);
        d.setUint32(5, G, !0);
        for (var i = 0; i < numClicks; i++) { u.send(c) } // Changed to click multiple times
    }
}
 
function la(f, b, c) {
    function d() { // Handles drawing stuff
        if (c.type == 4 && initialLoad) {
            c.x = f.getUint16(b, !0);
            buttons[buttonIndex][0] = c.x
            b += 2;
            c.y = f.getUint16(b, !0);
            buttons[buttonIndex][1] = c.y
            b += 2;
            c.width = f.getUint16(b, !0);
            b += 2;
            c.height = f.getUint16(b, !0);
            b += 2
 
            buttonIndex++;
        } else {
            c.x = f.getUint16(b, !0);
            b += 2;
            c.y = f.getUint16(b, !0);
            b += 2;
            c.width = f.getUint16(b, !0);
            b += 2;
            c.height = f.getUint16(b, !0);
            b += 2
        }
    }
    function g() { // Handles coloring stuff
        for (var a = f.getUint32(b, !0).toString(16); 6 > a.length;) a = "0" + a;
        b += 4;
        c.color = "#" + a
    }
    var e = f.getUint8(b);
    b += 1;
    c.type = e;
    switch (e) {
        case 255:
            break;
        case 0: // Draws text
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
        case 1: // May relate to cursor movement?
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
        case 2: // Draws exit points
            d();
            c.isBad = !!f.getUint8(b);
            b += 1;
            break;
        case 3: // Handles the area triggers
            d();
            c.count = f.getUint16(b, !0);
            b += 2;
            g();
            break;
        case 4: // Something about buttons, but also affects doors and area triggers
            d();
            c.count ? c.count > f.getUint16(b, !0) && (c.lastClickAt = t) : c.lastClickAt = 0;
            c.count = f.getUint16(b, !0);
            if (initialLoad) buttons[buttonIndex-1][2] = 1;
            b += 2;
            g();
            break;
        case 5:
            c.x = f.getUint16(b, !0);
            b += 2;
            c.y = f.getUint16(b, !0);
            b += 2;
            c.queue = [
                [0, c.x, c.y]
            ];
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
    return b
}
 
function ea(a, b) {
    if (-1 != J && -1 != K) {
        var c = fa(J, K, a, b);
        if (c.x != a || c.y != b) return !0
    }
    for (c = 0; c < r.length; c++) {
        var d = r[c];
        if (2 == d.type && !(k < d.x || q < d.y || k >= d.x + d.width || q >= d.y + d.height)) return !0
    }
    return !1
}
 
function ma() {
    a.clearRect(0, 0, 800, 600);
    a.save();
    if (null != u && u.readyState != WebSocket.OPEN || L) {
        var f;
        if (null == u) f = "Click to begin";
        else switch (u.readyState) {
            case WebSocket.CONNECTING:
                f = "Connecting";
                break;
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
                f = "Lost connection to server";
                break;
            default:
                f = "Click to begin"
        }
        a.font = "60px NovaSquare";
        a.fillText(f, 400 - a.measureText(f).width / 2, 315);
        na();
        oa(!1)
    } else {
        a.fillStyle = "#000000";
        a.save();
        a.globalAlpha = 1;
        Ha();
        for (f = 0; f < r.length; f++) {
            var b = r[f];
            if (0 == b.type) {
                a.font = b.size + "px NovaSquare";
                var c = b.x << 1,
                    d = b.y << 1;
                b.isCentered && (c -= a.measureText(b.text).width / 2);
                a.fillStyle = "#000000";
                a.fillText(b.text,
                    c, d)
            } else if (1 == b.type) a.fillStyle = b.color, a.fillRect(b.x << 1, b.y << 1, b.width << 1, b.height << 1), a.strokeStyle = "#000000", a.globalAlpha = .2, a.lineWidth = 2, a.strokeRect((b.x << 1) + 1, (b.y << 1) + 1, (b.width << 1) - 2, (b.height << 1) - 2), a.globalAlpha = 1;
            else if (2 == b.type) a.fillStyle = b.isBad ? "#FF0000" : "#00FF00", a.globalAlpha = .2, a.fillRect(b.x << 1, b.y << 1, b.width << 1, b.height << 1), a.globalAlpha = 1;
            else if (3 == b.type) {
                var c = b.x << 1,
                    d = b.y << 1,
                    g = b.width << 1,
                    e = b.height << 1;
                a.fillStyle = b.color;
                a.globalAlpha = .2;
                a.fillRect(c, d, g, e);
                a.globalAlpha =
                    .5;
                a.fillStyle = "#000000";
                40 > b.width || 40 > b.height ? (a.font = "30px NovaSquare", a.fillText(b.count, c + g / 2 - a.measureText(b.count).width / 2, d + e / 2 + 10)) : (a.font = "60px NovaSquare", a.fillText(b.count, c + g / 2 - a.measureText(b.count).width / 2, d + e / 2 + 20));
                a.globalAlpha = 1
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
                var n = 150 > t - b.lastClickAt,
                    l = n ? 8 : 12;
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
                50 > b.width || 50 > b.height ? (a.font = "35px NovaSquare", a.fillText(b.count, c + g / 2 - a.measureText(b.count).width / 2, d + e / 2 + 13)) : (a.font = "45px NovaSquare", a.fillText(b.count,
                    c + g / 2 - a.measureText(b.count).width / 2, d + e / 2 + 16));
                n && (a.fillStyle = "#000000", a.globalAlpha = .15, a.fillRect(c + l, d + l, g - 2 * l, e - 2 * l));
                a.globalAlpha = 1
            } else 5 == b.type && (ga(!1), a.drawImage(b.canvas, 0, 0, 400, 300, 0, 0, 800, 600), ga(!0))
        }
        a.restore();
        D || (a.font = "12px NovaSquare", a.strokeStyle = "#000000", a.fillStyle = "#FFFFFF", a.lineWidth = 2.5, f = ja ? "Area too full, not all cursors are shown" : 30 < ia ? "Area too full, drawing is disabled" : "Use shift+click to draw", a.globalAlpha = .5, a.strokeText(f, 10, 590), a.globalAlpha = 1, a.fillText(f,
            10, 590), 0 != aa && (f = aa + " players online", b = a.measureText(f).width, a.globalAlpha = .5, a.strokeText(f, 790 - b, 590), a.globalAlpha = 1, a.fillText(f, 790 - b, 590)));
        na();
        if (!H.checked) {
            a.save();
            a.strokeStyle = "#000000";
            a.lineWidth = 1;
            t = +new Date;
            for (f = 0; f < O.length; f++) b = O[f], c = 10 - (t - b[4]) / 1E3, 0 >= c ? (O.splice(f, 1), --f) : (1 < c && (c = 1), a.globalAlpha = .3 * c, a.beginPath(), a.moveTo(b[0] - .5, b[1] - .5), a.lineTo(b[2] - .5, b[3] - .5), a.stroke());
            a.restore()
        }
        a.save();
        for (var p in F) F.hasOwnProperty(p) && a.drawImage(P, sa(F[p].getX()) - 6, ta(F[p].getY()) -
            6);
        a.restore();
        oa(!0)
    }
    a.restore();
    A.requestAnimationFrame(ma)
}
 
function na() { // draws circles when you click
    a.save();
    a.strokeStyle = "#000000";
    t = +new Date;
    for (var f = 0; f < I.length; f++) {
        var b = I[f],
            c = (t - b[2]) / 1E3,
            d = 1 - 2 * c;
        0 >= d ? (I.splice(f, 1), --f) : (c *= 50, a.beginPath(), a.globalAlpha = .3 * d, a.arc(b[0], b[1], c, 0, 2 * Math.PI, !1), a.stroke())
    }
    a.restore()
}
 
function oa(f) {
    if (D) a.save(), a.globalAlpha = 1, a.drawImage(P, B - 5, C - 5);
    else {
        var b = 0,
            c = 0;
        v != k || w != q ? (a.save(), f && (a.globalAlpha = .2, a.fillStyle = "#FF0000", a.beginPath(), a.arc(B + 2, C + 8, 20, 0, 2 * Math.PI, !1),
            a.fill()), a.globalAlpha = .5, a.drawImage(P, B - 5, C - 5), a.restore()) : (b = B & 1, c = C & 1);
        a.save();
        f && (a.globalAlpha = .2, a.fillStyle = "#FFFF00", a.beginPath(), a.arc((k << 1) + b + 2, (q << 1) + c + 8, 20, 0, 2 * Math.PI, !1), a.fill());
        a.globalAlpha = 1;
        a.drawImage(Ia, (k << 1) + b - 5, (q << 1) + c - 5)
    }
    a.restore()
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
var ra = function() {
        function f() {
            var a = 0,
                b = 0,
                c = v / 10,
                d = w / 10;
            n < c ? (c = Math.ceil(c), a = Math.floor(n)) : (c = Math.floor(c), a = Math.ceil(n));
            l < d ? (d = Math.ceil(d), b = Math.floor(l)) :
                (d = Math.floor(d), b = Math.ceil(l));
            if (a > c) var e = c,
                c = a,
                a = e;
            b > d && (e = d, d = b, b = e);
            return {
                sx: a,
                sy: b,
                fx: c,
                fy: d
            }
        }
 
        function b() {
            e = !0;
            n = v / 10;
            l = w / 10
        }
 
        function c(a) {
            return "0x" + parseInt(a.slice(1), 16).toString(16).toUpperCase()
        }
 
        function d(a, b, c, d, e) {
            a = {
                x: 10 * ~~(k / 10) - ~~(a / 2) + c,
                y: 10 * ~~(q / 10) - ~~(b / 2) + d,
                width: a,
                height: b
            };
            for (var f in e) e.hasOwnProperty(f) && (a[f] = e[f]);
            return a
        }
 
        function g(a, b) {
            for (var c = null, d = Number.POSITIVE_INFINITY, e = 0; e < r.length; e++) {
                var f = r[e];
                if (f.hasOwnProperty("x") && f.hasOwnProperty("y") && f.hasOwnProperty("width") &&
                    f.hasOwnProperty("height")) {
                    var g = f.x + f.width / 2,
                        h = f.y + f.height / 2,
                        g = (a - g) * (a - g) + (b - h) * (b - h);
                    g < d && (d = g, c = f)
                }
            }
            return c
        }
        var e = !1,
            n = 0,
            l = 0,
            p = 1,
            u = 200,
            m = 150,
            h = new Uint8Array(1200),
            t = "#000000 #FF9999 #9999FF #FFFF99 #99FFFF #FF99FF #3333FF".split(" ");
        E.addEventListener("mouseup", function() {
            if (e) {
                for (var a = f(), b = p, c = a.sy; c < a.fy; ++c)
                    for (var d = a.sx; d < a.fx; ++d) h[d + 40 * c] = b;
                e = !1
            }
        });
        E.addEventListener("mousemove", function() {});
        A.generateCode = function() {
            for (var a = "class Level? : public Level {\npublic:\n\tLevel?() : Level(" +
                    u + ", " + m + "){}\n\n\tvoid OnInit(){\n", a = a + ("\t\tstd::vector<LevelObject*> wallByColor[" + t.length + "];\n"), b = new Uint8Array(1200), d = [], e = 0; 30 > e; ++e)
                for (var f = 0; 40 > f; ++f)
                    if (!b[f + 40 * e]) {
                        var g = h[f + 40 * e];
                        if (0 != g) {
                            for (var k = f; 40 > f && h[f + 40 * e] == g && !b[f + 40 * e];) b[f + 40 * e] = !0, ++f;
                            var l = f--,
                                p = l - k,
                                q = e++;
                            a: for (; 30 > e;) {
                                for (var n = k; n < l; ++n) {
                                    if (h[n + 40 * e] != g) break a;
                                    if (b[n + 40 * e]) break a
                                }
                                for (n = k; n < l; ++n) b[n + 40 * e] = !0;
                                ++e
                            }
                            l = e - q;
                            e = q;
                            d.push({
                                x: 10 * k,
                                y: 10 * q,
                                width: 10 * p,
                                height: 10 * l,
                                color: g - 1
                            })
                        }
                    }
            for (b = 0; b < d.length; b++) e = d[b], 0 ==
                e.color ? a += "\t\tAddObject(new ObjWall(" + e.x + ", " + e.y + ", " + e.width + ", " + e.height + ", 0x000000));\n" : (f = c(t[e.color]), a += "\t\twallByColor[" + e.color + "].push_back(AddObject(new ObjWall(" + e.x + ", " + e.y + ", " + e.width + ", " + e.height + ", " + f + ")));\n");
            for (b = 0; b < r.length; b++) d = r[b], 0 != d.type && (2 == d.type ? a += "\t\tAddObject(new ObjTeleport(LevelManager::GetNextLevel(this), " + d.x + ", " + d.y + ", " + d.width + ", " + d.height + "));\n" : 3 == d.type ? (a += "\t\tAddObject(new ObjAreaCounter(wallByColor[" + d.colorCode + "], " + d.x + ", " + d.y +
                ", " + d.width + ", " + d.height + ", ", a += d.count + ", " + c(d.color) + "));\n") : 4 == d.type && (a += "\t\tAddObject(new ObjClickBox(wallByColor[" + d.colorCode + "], " + d.x + ", " + d.y + ", " + d.width + ", " + d.height + ", ", a += d.count + ", 1000, " + c(d.color) + "));\n"));
            return a += "\t}\n};\n"
        };
        E.addEventListener("keydown", function(a) {
            if (a.keyCode == 8) {
                a.preventDefault();
                if (message.length > 0) {
                    message = message.substring(0, message.length - 1);
                    messageDisplay.innerHTML = message;
                }
            }
            else if (a.keyCode == 9) {
                a.preventDefault();
            }
            if (D) {
                var b = a.keyCode;
                65 == b ? (--p, 0 > p && (p = t.length)) : 83 == b ? (++p, p > t.length && (p = 0)) : 66 == b ? 1 >= p || r.push(d(40, 40, 5, 5, {
                    type: 4,
                    color: t[p - 1],
                    colorCode: p - 1,
                    count: 5
                })) : 90 == b ? r.pop() : 87 == b ? r.push(d(50, 50, -5, -5, {
                    type: 2,
                    isBad: !1
                })) : 79 == b ? (u = k, m = q) : 78 == b ? 1 >= p || r.push(d(40, 40, 0, 0, {
                    type: 3,
                    color: t[p - 1],
                    colorCode: p - 1,
                    count: 1
                })) : 37 == b ? (b = g(v, w), null != b && (a.shiftKey ? b.width -= 10 : (b.x -= 10, b.width += 10), 0 == b.width && r.splice(r.indexOf(b), 1))) : 39 == b ? (b = g(v, w), null != b && (a.shiftKey ? (b.x += 10, b.width -= 10) : b.width += 10, 0 == b.width && r.splice(r.indexOf(b), 1))) : 38 == b ? (b = g(v, w), null != b && (a.shiftKey ? b.height -= 10 : (b.y -= 10, b.height += 10), 0 == b.height && r.splice(r.indexOf(b), 1))) : 40 == b && (b = g(v, w), null != b && (a.shiftKey ? (b.y += 10, b.height -= 10) : b.height +=
                    10, 0 == b.height && r.splice(r.indexOf(b), 1)))
            }
        });
        return {
            renderEditor: function() {
                if (D) {
                    a.save();
                    a.fillStyle = "#FF0000";
                    a.strokeStyle = "#FF0000";
                    a.lineWidth = 1;
                    a.globalAlpha = .09;
                    a.beginPath();
                    for (var b = 0; 400 > b; b += 10) a.moveTo((b << 1) + .5, 0), a.lineTo((b << 1) + .5, 600);
                    for (var c = 0; 300 > c; c += 10) a.moveTo(0, (c << 1) + .5), a.lineTo(800, (c << 1) + .5);
                    a.stroke();
                    a.lineWidth = 2;
                    a.beginPath();
                    a.moveTo(400.5, 0);
                    a.lineTo(400.5, 600);
                    a.moveTo(0, 300.5, 0);
                    a.lineTo(800, 300.5);
                    a.stroke();
                    a.lineWidth = 1;
                    a.globalAlpha = 1;
                    a.fillStyle = "#000000";
                    for (var d = f(), c = 0; 300 > c; c += 10)
                        for (b = 0; 400 > b; b += 10) {
                            var g = b / 10 | 0,
                                k = c / 10 | 0,
                                l = h[g + 40 * k];
                            e && g >= d.sx && g < d.fx && k >= d.sy && k < d.fy && (l = p);
                            0 != l && (a.fillStyle = t[l - 1], a.fillRect(b << 1, c << 1, 20, 20))
                        }
                    a.save();
                    a.globalAlpha = .09;
                    a.fillStyle = "#0000FF";
                    a.beginPath();
                    a.arc(u << 1, m << 1, 20, 0, 2 * Math.PI, !1);
                    a.fill();
                    a.restore();
                    a.save();
                    a.fillStyle = "#FFFFFF";
                    a.strokeStyle = "#000000";
                    a.lineWidth = 2.5;
                    a.font = "14px NovaSquare";
                    a.globalAlpha = .5;
                    a.strokeText("Current color: ", 10, 590);
                    a.globalAlpha = 1;
                    a.fillText("Current color: ", 10,
                        590);
                    0 == p ? a.fillText("ESR", 105, 590) : (a.fillStyle = "#000000", a.fillRect(104, 575, 22, 22), a.fillStyle = t[p - 1], a.fillRect(105, 576, 20, 20));
                    a.restore();
                    a.restore()
                }
            },
            initEditor: function() {
                y.addEventListener("mousedown", b)
            }
        }
    }(),
    Ha = ra.renderEditor,
    La = ra.initEditor,
    za = new Uint8Array(12E4);
Array.prototype.remove = function(a) {
    a = this.indexOf(a);
    return -1 != a ? (this.splice(a, 1), !0) : !1
};
 
function handleKeyboard(e) {
    if ((e.keyCode >= 97 && e.keyCode <= 122) || e.keyCode == 32 || e.keyCode == 63 || e.keyCode == 58 || e.keyCode == 40 || e.keyCode == 41) {
        message = message.concat(String.fromCharCode(e.keyCode));
        messageDisplay.innerHTML = message;
        return;
    }
    switch(e.keyCode) {
        case 13:
            drawWord(message, posX, posY);
            message = "";
            messageDisplay.innerHTML = message;
            e.preventDefault();
            break;
        case 96: // Click all buttons
            clickAllButtons();
            break;
        case 47:
            movementEnabled = !movementEnabled
            break;
        case 45: // Toggle Aura
            auraEnabled = !auraEnabled;
            break;
        case 43:
            drawImage(posX, posY);
            break;
        case 42:
            markerEnabled = !markerEnabled;
            break;
        default:
            return;
    }
}
 
function clickAllButtons() {
    for (var i = 0; i < maxButtons; i++) {
        if (buttons[i][0] == null) break;
        wa(buttons[i][0], buttons[i][1], buttons[i][2]);
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
        u.send(g)
    }
 
    auraTime += dt;
}
 
function degToRad(deg) {
    return deg * (Math.PI / 180);
}
 
function radToDeg(rad) {
    return rad * (180 / Math.PI);
}
 
var drawIndex = 0;
function drawImage(x, y) {
    setTimeout(function () {
        var g = new ArrayBuffer(9),
            e = new DataView(g);
 
        e.setUint8(0, 3);
        e.setUint16(1, x+imgData[drawIndex][1]*imageScale, !0);
        e.setUint16(3, y+imgData[drawIndex][0]*imageScale, !0);
        e.setUint16(5, x+imgData[drawIndex][3]*imageScale, !0);
        e.setUint16(7, y+imgData[drawIndex][2]*imageScale, !0);
        u.send(g);
 
        drawIndex++;
        if (drawIndex < imgData.length)
            drawImage(x, y);
        else
            drawIndex = 0;
    }, 15)
}
 
function drawLetter(a, x, y) {
    var letter = alphabet[a];
 
    if (letter == null)
        return;
 
    var g = new ArrayBuffer(9),
        e = new DataView(g);
 
    for (var i = 0; i < letter.length; i++) {
        e.setUint8(0, 3);
        e.setUint16(1, x+alphabet[a][i][1]*fontSize, !0);
        e.setUint16(3, y+alphabet[a][i][0]*fontSize, !0);
        e.setUint16(5, x+alphabet[a][i][3]*fontSize, !0);
        e.setUint16(7, y+alphabet[a][i][2]*fontSize, !0);
        for (var j = 0; j < 4; j++) { u.send(g); }
    }
}
 
var messageDisplay;
var message = new String();
var wordIndex = 0;
function drawWord(s, x, y) {
    setTimeout(function () {
        drawLetter(s.charCodeAt(0), x, y);
        wordIndex++;
        if (s.length > 0)
            drawWord(s.substring(1, s.length), x+fontSize*3, y);
        else {
            wordIndex = 0;
            letterOffset = 0;
        }
    }, 20);
}
 
function doit() {
    document.body.innerHTML += '<div id="messageDisplay"></div>';
    messageDisplay = document.getElementById("messageDisplay");
 
    y = E.getElementById("canvas");
    a = y.getContext("2d");
    try {
        A.top.location.origin != A.location.origin && ba()
    } catch (f) {
        ba()
    }
    y.onmousemove = ua;
    y.onmousedown = va;
    y.onmouseup = xa;
    M = E.getElementById("noCursorLock");
    H = E.getElementById("noDrawings");
    null != localStorage && (M.checked = "1" == A.localStorage.getItem("noCursorLock") ? !0 : !1, H.checked = "1" == A.localStorage.getItem("noDrawings") ? !0 : !1);
    A.onbeforeunload = ya;
    y.requestPointerLock = y.requestPointerLock || y.mozRequestPointerLock || y.webkitRequestPointerLock;
    y.style.cursor = "none";
    La();
    D || null == u && (u = new WebSocket("ws://s1.cursors.io:443/"), u.binaryType = "arraybuffer", u.onopen = Aa, u.onmessage = Ga, u.onclose =
        Ba, u.onerror = Ca);
    setInterval(Q, 50);
    setInterval(Ja, 40);
    A.requestAnimationFrame(ma)
 
    document.onkeypress = handleKeyboard;
}
 
doit();