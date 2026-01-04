// ==UserScript==
// @name         Remover o shopback do terabyteshop
// @namespace    JRSB
// @version      1.2
// @description  você adora aquele maldito iframe? eu também amo ele!
// @author       RuiDev
// @match        https://www.terabyteshop.com.br/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373224/Remover%20o%20shopback%20do%20terabyteshop.user.js
// @updateURL https://update.greasyfork.org/scripts/373224/Remover%20o%20shopback%20do%20terabyteshop.meta.js
// ==/UserScript==

var $ = window.jQuery; //Gambiarra!?!?!?

$( document ).ready(function() { 
//Então a função é aqui bb, resto do código da linha 15 pra baixo. :)
    $("#f-content-9207", window.top.document).remove(); //Aqui o mizera remove o iframe!
    $("#f-content-6152", window.top.document).remove(); //Aqui o mizera remove o iframe!
});
