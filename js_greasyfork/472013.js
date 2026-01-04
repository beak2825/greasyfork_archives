// ==UserScript==
// @name         postListControlsTransfer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Перемещает количество ответов и кнопку для сортировки
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472013/postListControlsTransfer.user.js
// @updateURL https://update.greasyfork.org/scripts/472013/postListControlsTransfer.meta.js
// ==/UserScript==

var source = document.querySelector('.threadView--postListControls');
var destination = document.querySelector('#content > div > div > form');
destination.insertBefore(source, destination.firstChild);
