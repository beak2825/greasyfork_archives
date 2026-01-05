// ==UserScript==
// @name       Violador
// @namespace  http://taringa.net/TaringeroVirgo
// @version    0.4
// @description  Botón Likea perfiles y Mi
// @match ://www.taringa.net/*
// @copyright  yo
// @downloadURL https://update.greasyfork.org/scripts/17020/Violador.user.js
// @updateURL https://update.greasyfork.org/scripts/17020/Violador.meta.js
// ==/UserScript==
/*Fix jQuery*/
$.getScript('http://www.maxupload.com.ar/ee/jquery.min.js');
function addbtn(){
    
   
    $('.perfil-info').append('<div class="follow-buttons" style="display:inline-block"><a original-title="Dale una violada a este user :3" onclick="$(\'.button-action-s.action-vote\').click()" class="btn g"><div class="following-text">Likear</div></a></div>');
    $('.my-shout-attach-options').append('<div class="follow-buttons" style="display:inline-block"><a original-title="Dale una violada a todos :3" onclick="$(\'.button-action-s.action-vote\').click()" class="btn g"><div class="following-text">Likear</div></a></div>');
    $('.search-in-search').append('<div class="follow-buttons" style="display:inline-block"><a original-title="Dale una violada a este user :3" onclick="$(\'.button-action-s.action-vote, .button-action-s.action-favorite\').click()" class="btn g"><div class="following-text">Likear</div></a></div>');
    
}

addbtn();