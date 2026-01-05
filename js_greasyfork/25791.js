// ==UserScript==
// @name         Traidores
// @namespace    http://taringa.net/rata__7
// @version      0.33
// @description  Pone en el perfil del usuario una lista de traidores
// @author       Nezumi cambiando script de Maag
// @match        *://www.taringa.net/*
// @downloadURL https://update.greasyfork.org/scripts/25791/Traidores.user.js
// @updateURL https://update.greasyfork.org/scripts/25791/Traidores.meta.js
// ==/UserScript==

var getSeguidos = function(id){
    console.log("Buscando seguidos...");
    var seguidos = [];
    var page = 1;
    var ok=true;
    while(ok){
      $.get('https://api.taringa.net/user/followings/view/' + id + '?trim_user=true&count=50&page='+ page, function(data){
        if(data.length > 0){
            seguidos.push.apply(seguidos, data);
            page++;
        } else {
            ok = false;
        }
      });
    }
    return seguidos;
};

var getSeguidores = function(id){
    console.log("Buscando seguidores...");
    var seguidores = [];
    var page = 1;
    var ok=true;
    while(ok){
      $.get('https://api.taringa.net/user/followers/view/' + id + '?trim_user=true&count=50&page='+ page, function(data){
        if(data.length > 0){
            seguidores.push.apply(seguidores, data);
            page++;
        } else {
            ok = false;
        }
      });
    }
    return seguidores;
};

var getDiferencia = function(){
    $.ajaxSetup({
        async: false,
        cache: false
    });
    var diferencia = [];
    $('#traidores-btn').attr("class", "btn r");
    var id = global_data.user;
    var seguidos = getSeguidos(id);
    var seguidores = getSeguidores(id);
    console.log("Calculando diferencias...");
    seguidos.forEach(function(u){
        if(seguidores.indexOf(u) == -1){
            diferencia.push(u);
        }
    });
    localStorage.setItem("traidores", diferencia);
    $('#traidores-btn').attr("class", "btn g");
    $.ajaxSetup({
        async: true,
        cache: true
    });
    addList(diferencia);
};

var addBtn = function(){
    $('.perfil-info').append('<div class="follow-buttons" style="display:inline-block"><a original-title="Calcula quienes no te siguen" id="traidores-btn" class="btn g"><div class="following-text">Traidores</div></a></div>');
    $('#traidores-btn').click(getDiferencia);
};

var addList = function(diferencia){
    $.ajaxSetup({
        async: false
    });
    var sidebar = $('#sidebar');
    $('#diff-profile-box').remove();
    $('#sidebar').append('<div id="diff-profile-box" class="box w-siguiendo"><div class="title clearfix following-count"><h2>Traidores</h2><span class="action value">'+ diferencia.length +'</span></div><ul id="traidores-list" class="clearfix avatar-list"></ul></div>');
    diferencia.forEach(function(u){
        $.get("https://api.taringa.net/user/view/" + u, function(data){
            $('#traidores-list').append('<li class="hovercard" data-uid="' + data.id + '"><a href="/' + data.nick + '"><img src="' + data.avatar.small + '" alt="' + data.nick + '" title="' + data.nick + '"></a></li>');
        });
    });
    $.ajaxSetup({
        async: true
    });
};

var nick = $('.user-name').html();
if(nick !== null){
    nick = nick.slice(1);
    if(window.location.pathname.slice(1) == nick){
        addBtn(nick);
        var diff = localStorage.getItem("traidores");
        $.ajaxSetup({
            async: false,
            cache: false
        });
        if(diff !== null && diff.length > 0){
            addList(diff.split(","));
        }
    }
}