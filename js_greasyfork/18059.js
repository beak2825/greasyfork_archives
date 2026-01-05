// ==UserScript==
// @name TW - Lista de jugadores (traducido por pepe100)
// @namespace 
// @version 0.1.1
// @description:es  (Permite crear una lista de jugadores a partir de ciertas ciudades y/o alianzas)
// @author Thathanka Iyothanka
// @include http*://*.the-west.*/game.php*
// @grant none
// @description (Permite crear una lista de jugadores a partir de ciertas ciudades y/o alianzas)
// @downloadURL https://update.greasyfork.org/scripts/18059/TW%20-%20Lista%20de%20jugadores%20%28traducido%20por%20pepe100%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18059/TW%20-%20Lista%20de%20jugadores%20%28traducido%20por%20pepe100%29.meta.js
// ==/UserScript==
var settings_content = "<script>function save(id,value){localStorage['TW_playerlist_'+id] = value;}; function load(){ var ids = ['allys','supp_towns','supp_players','except_players']; for (j = 0; j < ids.length; j++){ document.getElementById(ids[j]).value = localStorage['TW_playerlist_'+ids[j]]; }; }; </script><p> <img src ='http://zupimages.net/up/15/37/idcw.png' onload='javascript:load();'><i> Syntaxe : nom1;nom2;nom3 (respecter les majuscules)</i></p> <br> <strong>Alliances : </strong> <input type='text' id = 'allys' onchange = 'javascript:save(this.id,this.value);' style='margin-bottom:4px;width:283px;'/> <br> <strong>Villes supplémentaires :</strong> <input type='text' id = 'supp_towns' onchange = 'javascript:save(this.id,this.value);'style='margin-bottom:4px;width:197px;'/> <br> <strong>Joueurs supplémentaires : </strong> <input type='text' id = 'supp_players' onchange = 'javascript:save(this.id,this.value);'style='margin-bottom:4px;width:181px;'/> <br> <strong>Joueurs à exclure de la liste :</strong> <input type='text' id = 'except_players' onchange = 'javascript:save(this.id,this.value);'style='margin-bottom:4px;width:164px;'/> <br> <br> <center><strong style='color:red'>Les paramètres seront perdus en cas de <br>suppression des cookies</strong></center>"
var townlist = []
var player_list =''
var list = []
var alliances = []
var supp_towns = [] 
var except_players = []
var cnt_players = 0
var icon = $('<div></div>').attr({
    'class': 'menulink',
    'title': 'Mofdificar los parámetros'
}).css({
    'background': 'url(http://www.zupimages.net/up/15/37/1pv6.png)',
    'background-position': '0px 0px'
}).mouseleave(function () {
    $(this).css('background-position', '0px 0px');
}).mouseenter(function (e) {
    $(this).css('background-position', '25px 0px');
}).click(function () {wman.open('tw_playerlist', 'Paramètres').appendToContentPane(settings_content).setSize(420,260);
                     });
var bottom = $('<div></div>').attr({
    'class': 'menucontainer_bottom'
});
$('#ui_menubar .ui_menucontainer :last').after($('<div></div>').attr({
    'class': 'ui_menucontainer',
    'id': 'Auto'
}).append(icon).append(bottom));
var icon = $('<div></div>').attr({
    'class': 'menulink',
    'title': 'Crear la lista'
}).css({
    'background': 'url(http://zupimages.net/up/15/31/71mg.png)',
    'background-position': '0px 0px'
}).mouseleave(function () {
    $(this).css('background-position', '0px 0px');
}).mouseenter(function (e) {
    $(this).css('background-position', '25px 0px');
}).click(function () {append()
                     });
var bottom = $('<div></div>').attr({
    'class': 'menucontainer_bottom'
});
$('#ui_menubar .ui_menucontainer :last').after($('<div></div>').attr({
    'class': 'ui_menucontainer',
    'id': 'Auto'
}).append(icon).append(bottom));
function append(){
    new MessageHint('Creación de la lista en curso... Por favor espere').show();
    townlist = []
    player_list =''
    list = []
    cnt_players = 0
    alliances = []
    supp_towns =[]
    except_players = []
    if (localStorage['TW_playerlist_allys'] !== undefined && localStorage['TW_playerlist_allys'] !== ''){
        alliances = localStorage['TW_playerlist_allys'].split(';')}
    if (localStorage['TW_playerlist_supp_towns'] !== undefined && localStorage['TW_playerlist_supp_towns'] !== ''){
        supp_towns = localStorage['TW_playerlist_supp_towns'].split(';')}
    if (localStorage['TW_playerlist_except_players'] !== undefined && localStorage['TW_playerlist_except_players'] !== ''){
        except_players = localStorage['TW_playerlist_except_players'].split(';')}
    console.log(alliances)
    console.log(supp_towns)
    console.log(except_players)
    $.post('game.php?window=map&ajax=get_minimap',{},function(resp){
        $.each(resp.towns,function(i,town){
            if(!town.npctown && town.alliance_id != null && town.member_count > 0){
                var present = false
                for (k = 0; k < list.length; k++){
                    if (town.alliance_id == list[k]){
                        present = true
                    }
                }
                if (present == false){
                    list[list.length] = town.alliance_id
                }
            }
        })
        console.log(list)
        for (i = 0; i < list.length; i++){
            ajax_ally(i)
        };
        
    },'json');  
}
function append_towns(){
    console.log(supp_towns.length)
        if (supp_towns.length == 0) {
            create_list()
            console.log(townlist)
        } else {
            for (i = 0; i < supp_towns.length; i++){
                ajax_town(i)
            }
        }
}
function create_list(){
    for (i = 0; i < townlist.length; i++){
        ajax_players(i)
    }
}
function ajax_ally(i){
    Ajax.remoteCallMode("alliance","get_data",{alliance_id:list[i]},function(e){
        if (e.error == false){
            for (x = 0; x < alliances.length;x++){
                if (e.data.allianceName == alliances[x]){
                    for (z = 0; z < e.data.towns.length; z++){
                        townlist[townlist.length] = e.data.towns[z].town_id;
                    };
                }
            }
        }
        if (i == list.length -1){
            append_towns();
        }
    })
}
function ajax_town(i){
    Ajax.remoteCallMode('ranking', 'get_data', {rank : NaN,search : supp_towns[i],tab : 'cities'},function(u) {
        var found = false;
        for (var j = 0; j < u.ranking.length; j++) {
            if (u.ranking[j].town_name == supp_towns[i]){
                found = true;
                supp_towns[i] = u.ranking[j].town_id;
            };
        };
        if (!found){new MessageHint('Se ha producido un problema: Nombre de la ciudad incorrecto').show();
                   };
        if (i== supp_towns.length -1 ){
            townlist = townlist.concat(supp_towns)
            console.log(townlist)
            create_list();
        }
    });
};
function ajax_players(i){
    Ajax.remoteCallMode('building_cityhall','list_residents',{town_id:townlist[i]},function(e){
        for (z = 0; z < e.list.data.length; z++){
            var except = false
            for (u = 0; u < except_players.length; u++){
                if (e.list.data[z].name == except_players[u]){
                    except=true
                }
            }
            if (except == false){
                player_list +=  e.list.data[z].name + ";"
                cnt_players++
            }
        }
        if (i == townlist.length -1){

            if (localStorage['TW_playerlist_supp_players'] !== undefined && localStorage['TW_playerlist_supp_players'] !== ''){
                player_list += localStorage['TW_playerlist_supp_players']
            } else {
                player_list = player_list.slice(0,-1);
            }
            new MessageSuccess('Terminado ! (' + cnt_players + ' jugadores importados.)').show();
            document.location = "data:text/tab-separated-values,"+encodeURI(player_list);
        }
    })
}