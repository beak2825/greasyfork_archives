// ==UserScript==
// @name         Fuchsia by 銀芽 (雙開插件)
// @version      1.1
// @description  Costum-skins, Better UI, Hotkeys and Multiboxxing, Public as of 25/3/30
// @author       Yinya銀芽
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @match        https://agario.xingkong.tw/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agario.xingkong.tw
// @connect      pastebin.com
// @license      MIT
// @namespace https://greasyfork.org/users/912109
// @downloadURL https://update.greasyfork.org/scripts/499302/Fuchsia%20by%20%E9%8A%80%E8%8A%BD%20%28%E9%9B%99%E9%96%8B%E6%8F%92%E4%BB%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499302/Fuchsia%20by%20%E9%8A%80%E8%8A%BD%20%28%E9%9B%99%E9%96%8B%E6%8F%92%E4%BB%B6%29.meta.js
// ==/UserScript==

var EjectDown = false;
var SDown = false;

var speed = 50; //in ms

function keydown2(event) {
    //console.log(event.keyCode);
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 65) { //key A
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 89) { //key Y
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
    }
    if (event.keyCode == 16) { //key Shift
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
       }
    if (event.keyCode == 83) { //key S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    if (event.keyCode == 82 && SDown === false) { //key R
        SDown = true;
        spinado();
    }
    if (event.keyCode == 38) { //key Up Arrow
        X = window.innerWidth/2;
        Y = -200000000;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    if (event.keyCode == 40) { //key Down Arrow
        X = window.innerWidth/2;
        Y = 200000000;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    if (event.keyCode == 37) { //key Left Arrow
        X = -200000000;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    if (event.keyCode == 39) { //key Right Arrow
        X = 200000000;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
}

function sendChat(text) {
    const writer = new Writer();
    writer.setUint8(0x63);
    writer.setUint8(0);
    writer.setStringUTF8(text);
    wsSend(writer);
}

function keyup2(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
    if (event.keyCode == 82) { // key W
        SDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}
var i=0;
function spinado() {
    const lut = [
        0, 2057, 4107, 6140, 8149, 10126, 12062,
        13952, 15786, 17557, 19260, 20886, 22431, 23886,
        25247, 26509, 27666, 28714, 29648, 30466, 31163,
        31738, 32187, 32509, 32702, 32767, 32702, 32509,
        32187, 31738, 31163, 30466, 29648, 28714, 27666,
        26509, 25247, 23886, 22431, 20886, 19260, 17557,
        15786, 13952, 12062, 10126, 8149, 6140, 4107,
        2057, 0, -2057, -4107, -6140, -8149,-10126,
        -12062,-13952,-15786,-17557,-19260,-20886,-22431,
        -23886,-25247,-26509,-27666,-28714,-29648,-30466,
        -31163,-31738,-32187,-32509,-32702,-32767,-32702,
        -32509,-32187,-31738,-31163,-30466,-29648,-28714,
        -27666,-26509,-25247,-23886,-22431,-20886,-19260,
        -17557,-15786,-13952,-12062,-10126, -8149, -6140,
        -4107, -2057 ];
    let spinItv= document.getElementById("spinItv");
    if (SDown) {
        X = lut[i]*10000
        Y = lut[(i+25)%100]*10000
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
        i=(i+(50/(1+spinItv.value*49))|0)%100;
        setTimeout(spinado, 34);
    }
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
function split() {
    $("body").trigger($.Event("keydown", { key: "[" })); //key space
}
console.log("a");

document.documentElement.innerHTML = null, GM_xmlhttpRequest({
    method : "GET",
    url : 'https://pastebin.com/raw/3xvgcm37',
    onload : function(e) {
        console.log(e.responseText)
        //var doc = inject(e.responseText);
        var doc = e.responseText
        console.log(doc)
        document.open();
        document.write(doc);
        document.close();
        window.addEventListener('keydown', keydown2);
        window.addEventListener('keyup', keyup2);
    }
});
//看屁
console.log("b");