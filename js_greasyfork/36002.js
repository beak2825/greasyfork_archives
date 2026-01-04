// ==UserScript==
// @name         dotnet-snippets.de
// @namespace    https://dotnet-snippets.de/*
// @version      0.12
// @description  maximale Fensterbreite auf dotnet-snippets.de nutzen
// @author       chillchef
// @match        http*://dotnet-snippets.de/*
// @include      http*://dotnet-snippets.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36002/dotnet-snippetsde.user.js
// @updateURL https://update.greasyfork.org/scripts/36002/dotnet-snippetsde.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var w;
    w = document.getElementsByClassName("box-1 news")[0].style;
    w.visibility = "hidden";
    w.height = "0px";
    document.getElementsByClassName("container")[0].style.width = "95%";
    document.getElementsByClassName("content")[0].style.width = "75%";
    document.getElementsByClassName("menu")[0].style.width = "20%";
    document.getElementsByClassName("footer")[0].style.backgroundSize = "100%";
})();