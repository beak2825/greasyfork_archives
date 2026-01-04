// ==UserScript==
// @name         ImgGlue
// @namespace    ImgGlue
// @version      1.0
// @description  Stop images from being draggable
// @author       Gimrin
// @include      *.diamondhunt.co/*
// @match        https://www.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382836/ImgGlue.user.js
// @updateURL https://update.greasyfork.org/scripts/382836/ImgGlue.meta.js
// ==/UserScript==

$( document ).on("dragstart","img",function(){return false;});


