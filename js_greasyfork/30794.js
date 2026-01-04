// ==UserScript==
// @name         Bloquear en MP
// @namespace    http://taringa.net/rata__7
// @version      0.1
// @description  Agrega opcion de bloquear usuario en mps
// @author       Nezumi
// @match        *://www.taringa.net/mensajes/leer/*
// @downloadURL https://update.greasyfork.org/scripts/30794/Bloquear%20en%20MP.user.js
// @updateURL https://update.greasyfork.org/scripts/30794/Bloquear%20en%20MP.meta.js
// ==/UserScript==

var bloquearUser = function(){
    var id = $('#bloquear-user-btn').attr("data-id");
    $.post("https://www.taringa.net/ajax/user/block",{key: global_data.user_key, user: id.toString(), bloqueado: "1"}, function(res){
        $('#bloquear-user-btn').attr("class","btn g").text("Bloqueado");
    });
};

var addBtn = function(){
    var $follow_buttons = $('.follow-buttons');
    var id = $($follow_buttons.children()[0]).attr("objid");
    $follow_buttons.append('<div class="follow-buttons" style="display:inline-block"><a original-title="Bloquear" id="bloquear-user-btn" class="btn r"><div class="following-text">Bloquear</div></a></div>');
    $('#bloquear-user-btn').attr("data-id",id).click(bloquearUser);
};

var nick = $('.user-name').html();
if(nick !== null){
    addBtn();
}