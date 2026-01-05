// ==UserScript==
// @name         Borrar Actividad
// @namespace    http://taringa.net/rata__7
// @version      0.1
// @description  Borra actividad del perfil
// @author       Nezumi
// @match        *://www.taringa.net/*
// @downloadURL https://update.greasyfork.org/scripts/28174/Borrar%20Actividad.user.js
// @updateURL https://update.greasyfork.org/scripts/28174/Borrar%20Actividad.meta.js
// ==/UserScript==

var borrarActividad = function(){
    $('.icon.remove a').click();
};

var addBtn = function(){
    $('.perfil-info').append('<div class="follow-buttons" style="display:inline-block"><a original-title="Borra la actividad" id="delete-activity-btn" class="btn g"><div class="following-text">Borrar actividad</div></a></div>');
    $('#delete-activity-btn').click(borrarActividad);
};

var nick = $('.user-name').html();
if(nick !== null){
    nick = nick.slice(1);
    if(window.location.pathname.slice(1) == nick){
        addBtn();
    }
}