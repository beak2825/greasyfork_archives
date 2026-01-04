// ==UserScript==
// @name         Count Timer
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  For someone want to race with arena closer + remove ads
// @author       Fun
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437039/Count%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/437039/Count%20Timer.meta.js
// ==/UserScript==
/*
MIT License

Copyright (c) 2021 fun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var jjjs_0x12;
var get = function (key){return window.localStorage ? window.localStorage[key] : null;};
var put = function (key, value){if (window.localStorage) {window.localStorage[key] = value;}};
var remove = function (key){if (window.localStorage)  {window.localStorage.removeItem(key)}}
function pad(v) {
  var valString = v + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }}
const veryfun = 'QXJlbmEgY2xvc2VkOiBObyBwbGF5ZXJzIGNhbiBqb2lu';var _10X1fg = atob('MzA');var c0_xct = jjjs_0x12;var _00293434 = 0;
function _0112dxf(_0xf8h7ex){var _00x9h8ex = _0xf8h7ex.toString();var str = '';for (var n = 0; n < _00x9h8ex.length; n += 2) {str += String.fromCharCode(parseInt(_00x9h8ex.substr(n, 2), 16));}
return str;}
var fu = _0112dxf(_10X1fg);
var q = parseInt(fu);var _0s112sfx240 = atob('RnVu');var rr0_xcs = atob("UnVuIG5vdyBsb2w");var fo00z_Z = atob(veryfun);
var time = q;const _0z232ssd = [_0s112sfx240,'LTE','IVtd',"diep.io",rr0_xcs,fo00z_Z];
function _2ax0019 (_0xf8h7ex) {var _00x9h8ex = _0xf8h7ex.toString();var str = '';for (var i = 0; i < _00x9h8ex.length; i += 2) {str += String.fromCharCode(parseInt(_00x9h8ex.substr(i, 2), 16));}return str;}
var a = _2ax0019('2d31');
var p = parseInt(a);var Interval = p;var _1ofp = atob('MQ');var min = p;var reset = false;
const crx = CanvasRenderingContext2D.prototype;
function resettime(){time = q;if(time = 1){time = q;}_00293434=q;if(_00293434=1){_00293434=q}clearInterval(Interval);Interval = p;clearInterval(min);min=q}
crx.fillText = new Proxy(crx.fillText, {
    apply: function(f, _this, args) {
        const text = args[q];
        if (args[q] === _0z232ssd[3]) {
            args[q] = _0s112sfx240;
        }
        f.apply(_this, args);
    }
});
crx.strokeText = new Proxy(crx.strokeText, {
    apply: function(f, _this, args) {
        const text = args[0];
        if (args[q] === _0z232ssd[3]) {
            args[q] = _0s112sfx240;
        }
        f.apply(_this, args);
    }
});
    const rx = CanvasRenderingContext2D.prototype;
    rx.fillText = new Proxy(rx.fillText, {
        apply: function(f, _this, args) {
            const text = args[0];
            if (args[q] === _0z232ssd[5]) {
                args[q] = _0z232ssd[4];
                if(Interval == p){
                    Interval = setInterval(function (){
                        time++;
                        put('time',time);
                    }, 1000)
                }
               //Min
               if(min == p){
                    min = setInterval(function (){
                        _00293434++;
                        put('min',_00293434);
                        time = q;
                    }, 60000)
                }
            }
            f.apply(_this, args);
        }
    });
let ctx = document.querySelector('canvas').getContext('2d');
let ctx2 = document.querySelector('canvas').getContext('2d');
crx.fillText = new Proxy(crx.fillText, {
    apply: function(f, _this, args) {
        const text = args[0];
        if (args[0] === "You were killed by:") {
                clearInterval(Interval);
                clearInterval(min);
                Interval = p;
                min = p;
                //alert(`You got ${pad(get('min'))}:${pad(get('time'))}`);
                //Or
                //console.log(`Nice you got ${pad(get('min'))}:${pad(get('time'))}`);
                //Or
            if(get('time') == undefined || get('min') == undefined){
            put('time',time);
            put('min',_00293434);
            }
        }
        f.apply(_this, args);
    }
});
//start check Canvas height and width
const height = ctx.canvas.height*5/6-1;
const width = ctx.canvas.width*5/6-10;
crx.fillText = new Proxy(crx.fillText, {
    apply: function(f, _this, args) {
        const text = args[0];
        if (args[0] === "This is the tale of...") {
            //Auto reset when start
            resettime();
            if(get('time') == undefined || get('min') == undefined){
            put('time',time);
            put('min',_00293434);
            }
            const height = ctx.canvas.height*5/6-10;
            const width = ctx.canvas.width*5/6-10;
        }
        f.apply(_this, args);
    }
});
const RF = window.requestAnimationFrame;
window.requestAnimationFrame = function(cb) {
  return RF((t) => {
    cb(t);
if (input.should_prevent_unload()) {
    const height = ctx.canvas.height*5/6-10;
    const width = ctx.canvas.width*5/6-10;
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.font = 1 + "em Ubuntu";
        ctx.strokeStyle = "red";
        ctx.strokeText(`[Auto]Count Time: ${pad(_00293434)}:${pad(time)}`, 30, 190);
        ctx.fillText(`[Auto]Count Time: ${pad(_00293434)}:${pad(time)}`, 30, 190);
        ctx.strokeText(`[R]Reset Time: ${reset}`, 30, 210);
        ctx.fillText(`[R]Reset Time: ${reset}`, 30, 210);
        ctx2.fillStyle = "blue";
        ctx2.lineWidth = 3;
        ctx2.font = 1 + "em Ubuntu";
        ctx2.strokeStyle = "black";
        ctx2.strokeText(`Total Time: ${pad(get('min'))}:${pad(get('time'))}`, width, height);
        ctx2.fillText(`Total Time: ${pad(get('min'))}:${pad(get('time'))}`, width, height);
        if(get('time') == undefined || get('min') == undefined){
            put('time',time);
            put('min',_00293434);
        }
}else{
return;
}
  })
}
function removeads(){
    var remove1 = document.getElementById('diep-io_728x90');
    var remove2 = document.getElementById('diep-io_300x250');
    var remove3 = document.getElementById('diep-io_300x250_3');
    var remove4 = document.getElementById('diep-io_728x90_2');
    var remove5 = document.getElementById('diep-io_300x600_2');
    var remove6 = document.getElementById('diep-io_300x250_4');
    var remove7 = document.getElementById('diep-io_300x600');
    var remove8 = document.getElementById('diep-io_300x250_2');
    remove1.innerHTML = "";
    remove2.innerHTML = "";
    remove3.innerHTML = "";
    remove4.innerHTML = "";
    remove5.innerHTML = "";
    remove6.innerHTML = "";
    remove7.innerHTML = "";
    remove8.innerHTML = "";
}
setInterval(removeads, 10);
document.addEventListener('keydown',(kc)=>{
if(kc.keyCode === 82) {resettime();reset = !reset
                      setTimeout(function(){
                      reset = ![]
                      },200)
                      }
});