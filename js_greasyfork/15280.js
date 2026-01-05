// ==UserScript==
// @name Réponse pré-défini
// @description Un script pour rajouter des réponses pré-défini au forum !
// @include http://www.worldaide.fr/*
// @include http://www.worldaide.fr/*
// @include http://www.worldaide.fr/*
// @include http://www.worldaide.fr/*
// @version 2.0
// @grant none
// @namespace https://greasyfork.org/users/23859
// @downloadURL https://update.greasyfork.org/scripts/15280/R%C3%A9ponse%20pr%C3%A9-d%C3%A9fini.user.js
// @updateURL https://update.greasyfork.org/scripts/15280/R%C3%A9ponse%20pr%C3%A9-d%C3%A9fini.meta.js
// ==/UserScript==


function load() {
var jsCode = document.createElement('script');
jsCode.setAttribute('id', 'repauto');
jsCode.setAttribute('src', 'http://scriptplug.besaba.com/site/repauto.js'); document.body.appendChild(jsCode);
}
setTimeout(load, 1000);