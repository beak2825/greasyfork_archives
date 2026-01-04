// ==UserScript==
// @name         Renomeador de Ataques
// @include      https://*overview_villages&mode=incomings*
// @description can't be blank
// @version 0.0.1.20191103005033
// @namespace https://greasyfork.org/users/163899
// @downloadURL https://update.greasyfork.org/scripts/391904/Renomeador%20de%20Ataques.user.js
// @updateURL https://update.greasyfork.org/scripts/391904/Renomeador%20de%20Ataques.meta.js
// ==/UserScript==

setTimeout(function () { location.reload(1); }, 5000);
{
 $('input#select_all.selectAll').click();
    setTimeout(function(){
 var label = document.getElementsByName("label");
    label[0].click();
    }, 5000);
}