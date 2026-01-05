// ==UserScript==
// @name        Rm Readonly x Claudio
// @description Rm Readonly per Claudio su risp
// @namespace   http://zawardo.it
// @include     http://inlinea.provincia.mi.it/risp/web/editaudit.do?risp.request.idaudit*
// @version     1
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/3893/Rm%20Readonly%20x%20Claudio.user.js
// @updateURL https://update.greasyfork.org/scripts/3893/Rm%20Readonly%20x%20Claudio.meta.js
// ==/UserScript==
$("input[id*='resp_manutentore']").attr("readOnly",false);
$("select[id*='resp_manutentore']").removeAttr('disabled');