// ==UserScript==
// @name         os piratas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nome teste
// @author       You
// @match       https://www.waze.com/pt-BR/editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20395/os%20piratas.user.js
// @updateURL https://update.greasyfork.org/scripts/20395/os%20piratas.meta.js
// ==/UserScript==
var para = document.createElement("P");                       // Create a <p> element
var t = document.createTextNode("os piratas");       // Create a text node
para.appendChild(t);                                          // Append the text to <p>
para.setAttribute("style", "font-size:25px;position:absolute;color:#FFFFFF;top:100px;right:850px;");
document.body.appendChild(para); 