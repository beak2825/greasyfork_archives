// ==UserScript==
// @name eta tema gavno
// @author ХУЙ тюлени!
// @match *://diep.io/*
// @grant none
// @icon https://2sticker.ru/wa-data/public/shop/products/26/1..
// @run-at document-start
// @description fgfgfgfg seals
// @version 0.0.1.20200728154230
// @namespace https://greasyfork.org/users/671078
// @downloadURL https://update.greasyfork.org/scripts/407855/eta%20tema%20gavno.user.js
// @updateURL https://update.greasyfork.org/scripts/407855/eta%20tema%20gavno.meta.js
// ==/UserScript==
if(localStorage.getItem("no_wasm") != "true") {
localStorage.setItem("no_wasm", true);
window.location.reload();
}
(function() {
"use strict";
Object.defineProperty(window, "input", {
get: function() {},
set: function(to) {
delete window.input;
window.input = to;
exect = window.input.execute;
init();
document.getElementById("textInput").autocomplete = "off";
},
configurable: true,
enumerable: true
});
let exect;
function init() {
"use strict";
function d2(x, xx, y, yy) {
return Math.sqrt(Math.pow(x - xx, 2) + Math.pow(y - yy, 2));
};
exect("net_replace_color 2 0x0073cf");
exect("net_replace_color 3 0x0073cf");
exect("net_replace_color 4 0xec2030");
exect("net_replace_color 5 0xac68cc");
exect("net_replace_color 6 0x50c878");
exect("net_replace_color 8 0xffff88");
exect("net_replace_color 9 0xff006e");
exect("net_replace_color 10 0x0073cf");
exect("net_replace_color 15 0xec2030");
exect("ren_health_fill_color 0xe30000");
exect("ren_health_background_color 0xe30000");
let c = CanvasRenderingContext2D.prototype;
let ctx = document.getElementById("canvas").getContext("2d");
let origin = { x: 0, y: 0 };
let second = { x: 0, y: 0 };
let length = { x: 0, y: 0 };
let angle = 0;
let count = 0;
let last = { x: 0, y: 0, r: 0 };
let transformation = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
c._setTransform = c.setTransform;
c.setTransform = function(a, b, c, d, e, f) {
this._setTransform(a, b, c, d, e, f);
transformation = { a, b, c, d, e, f };
};
c._fill = c.fill;
c._stroke = c.stroke;
c._moveTo = c.moveTo;
c.moveTo = function(x, y) {
this.fill = this._fill;
this.stroke = this._stroke;
origin = { x, y };
count = 1;
this._moveTo(x, y);
};
c._lineTo = c.lineTo;
c.lineTo = function(x, y) {
switch(count) {
case 1: {
length = d2(x, origin.x, y, origin.y);
second = { x, y };
angle = Math.atan2(y - origin.y, x - origin.x);
count++;
this.stroke = function() {
if(this.strokeStyle == "#64ff8c" || this.strokeStyle == "#ffde43" || this.strokeStyle == "43ff91") {
this._stroke();
}
this.stroke = this._stroke;
};
break;
}
case 2: {
if(d2(second.x + Math.cos(angle + 2/3 * Math.PI) * length, x, second.y + Math.sin(angle + 2/3 * Math.PI) * length, y) < 1e-5 ||
d2(second.x + Math.cos(angle + 0.5 * Math.PI) * length, x, second.y + Math.sin(angle + 0.5 * Math.PI) * length, y) < 1e-5 ||
d2(second.x + Math.cos(angle + 0.4 * Math.PI) * length, x, second.y + Math.sin(angle + 0.4 * Math.PI) * length, y) < 1e-5) {
this.fill = function() {
this.fill = this._fill;
};
this.stroke = function() {
if(this.strokeStyle == "#000000") {
this.strokeStyle = "#ffffff";
}
this._stroke();
};
} else {
if(d2(origin.x, second.x, origin.y, second.y) < 7) {
this.fill = this._fill;
} else {
this.fill = function() {
this.fill = this._fill;
}
}
this.stroke = this._stroke;
}
count = 0;
break;
}
}
this._lineTo(x, y);
};
c._rect = c.rect;
c.rect = function(...args) {
this._rect(...args);
this.fill = function() {
this.fill = this._fill;
this.strokeStyle = this.fillStyle;
this.lineWidth = Math.sqrt(Math.sqrt((Math.abs(transformation.a) + Math.abs(transformation.b)) * 0.1 + (Math.abs(transformation.c) + Math.abs(transformation.d)) * 0.1) * 2);
this._stroke();
};
this.stroke = function() {
this.stroke = this._stroke;
};
};
c._arc = c.arc;
c.arc = function(...args) {
this.fill = function() {
this.fill = this._fill;
};
this._arc(...args);
if(transformation.e == last.x && transformation.f == last.y && transformation.a < last.r) {
this.fill = function() {
this.lineWidth = 5;
this.strokeStyle = this.fillStyle;
this._stroke();
this.fill = this._fill;
};
last = { x: 0, y: 0, r: 0 };
} else {last = { x: transformation.e, y: transformation.f, r: transformation.a };
}
};
}
})();
