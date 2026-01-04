// ==UserScript==
// @name         New Brofist.io Hacks 2018 (May or May Not Work)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Try to have fun with this user script!
// @author       Kaden Baker (XxHacXKNiNjAXaDenXkErYTXx)
// @match        http://brofist.io/modes/twoPlayer/c/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372700/New%20Brofistio%20Hacks%202018%20%28May%20or%20May%20Not%20Work%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372700/New%20Brofistio%20Hacks%202018%20%28May%20or%20May%20Not%20Work%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
(function(k){"object"===typeof exports&&"undefined"!==typeof module?module.exports=k():"function"===typeof define&&define.amd?define([],k):("undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:this).brofistioplus=k()})(function(){return function a(c,b,g){function e(f,h){if(!b[f]){if(!c[f]){var d="function"==typeof require&&require;if(!h&&d)return d(f,!0);if(l)return l(f,!0);d=Error("Cannot find module '"+f+"'");throw d.code="MODULE_NOT_FOUND",d;}d=b[f]=
{exports:{}};c[f][0].call(d.exports,function(a){var b=c[f][1][a];return e(b?b:a)},d,d.exports,a,c,b,g)}return b[f].exports}for(var l="function"==typeof require&&require,h=0;h<g.length;h++)e(g[h]);return e}({1:[function(c,b,g){var a={_parent:null,_button:null,switchActivate:function(){var e=!window.mode.ghost;a._button.style.color=e?"green":"red";!0===e?(window.mode.ghost=!0,window.mode.player.gpData.setMass(0),window.mode.player.gpData.setAlpha(.3),window.mode.player.gpData.p.velocity[0]=0,window.mode.player.gpData.p.velocity[0]=
0):(window.mode.ghost=!1,window.mode.player.gpData.setMass(1),window.mode.player.gpData.setAlpha(1),window.mode.player.gpData.p.velocity[0]=0,window.mode.player.gpData.p.velocity[1]=4.76837158203125E-7)},init:function(e){a._parent=e;a.addButton()},addButton:function(){toolbar=a._parent._parent.toolbar;button=toolbar.addButton("cheat-fly","[Fly]");button.bindFn(a.switchActivate);button.bindKeyboardFn(45,!1,!1,!1);a._button=button._element}};b.exports=a},{}],2:[function(c,b,g){var a={_parent:null,_button:null,
activate:function(){door=window.gp.list.filter(function(a){if(null!=a&&a.id&&"door"===a.id)return a})[0];p=window.mode.player.gpData;p.setX(door.getX());p.setY(door.getY())},init:function(b){a._parent=b;a.addButton()},addButton:function(){toolbar=a._parent._parent.toolbar;button=toolbar.addButton("cheat-tptoexitgate","[Finish Map]");button.bindFn(a.activate);a._button=button._element}};b.exports=a},{}],3:[function(c,b,g){var a={_parent:null,init:function(b){a._parent=b;a.fly=c("../cheats/fly.js");
a.fly.init(a);a.tptoexitgate=c("../cheats/tptoexitgate.js");a.tptoexitgate.init(a)}};b.exports=a},{"../cheats/fly.js":1,"../cheats/tptoexitgate.js":2}],4:[function(c,b,g){var a={_parent:null,_element:null,buttons:[],create:function(){element=a._element=document.createElement("div");element.style.position="absolute";element.style.zIndex="99999999999";element.style.left="0";element.style.top="0";element.style.color="red";document.body.appendChild(element)},addButton:function(b,c){if(0===a.buttons.filter(function(a){return a.id&&
a.id===b}).length)return button={id:b,text:c,_element:document.createElement("button"),bindFn:function(a){this._element.onclick=a},bindKeyboardFn:function(a,b,c,d){self=this;b=b||!1;c=c||!1;d=d||!1;document.addEventListener("keydown",function(e){if(e.keyCode===a&&(b?e.shiftKey===b:1)&&(c?e.ctrlKey===c:1)&&(d?e.altKey===d:1))self._element.onclick()})}},button._element.innerHTML=button.text,a.buttons.push(button),a._element.appendChild(button._element),button},init:function(b){a._parent=b;a.create()}};
b.exports=a},{}],5:[function(c,b,g){var a={init:function(){a.toolbar=c("./core/toolbar.js");a.toolbar.init(a);a.cheats=c("./core/cheats.js");a.cheats.init(a)}};b.exports=a},{"./core/cheats.js":3,"./core/toolbar.js":4}]},{},[5])(5)});
setTimeout(function() {
  brofistioplus.init();
}, 100);
})();