// ==UserScript==
// @name         AttackRange Helper
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Shows your attack range for the new Grepolis Casual World's
// @author       Marvins13
// @include      https://de99.grepolis.com/game/*
// @include      https://en112.grepolis.com/game/*
// @include      https://zz12.grepolis.com/game/*
// @include      https://fr114.grepolis.com/game/*
// @include      https://gr53.grepolis.com/game/*
// @include      https://nl65.grepolis.com/game/*
// @include      https://es76.grepolis.com/game*
// @include      https://it63.grepolis.com/game/*
// @include      https://ro53.grepolis.com/game/*
// @include      https://cz49.grepolis.com/game/*
// @include      https://pl75.grepolis.com/game/*
// @include      https://pt56.grepolis.com/game/*
// @include      https://hu50.grepolis.com/game/*
// @include      https://sk45.grepolis.com/game/*
// @include      https://dk42.grepolis.com/game/*
// @include      https://ru68.grepolis.com/game/*
// @include      https://br79.grepolis.com/game/*
// @include      https://tr39.grepolis.com/game/*
// @include      https://us76.grepolis.com/game/*
// @include      https://ar34.grepolis.com/game/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375790/AttackRange%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/375790/AttackRange%20Helper.meta.js
// ==/UserScript==

var uw = unsafeWindow || window,
$ = uw.jQuery;
var pPoints = uw.Game.player_points;

var rankingButton;
var infoButton = null;
load_menu_button();
load_info_button(infoButton);
load_settings_window()
towns_refresh();
load_att_range_members();
var count = 0;

//Get the Worlddata of all players
var playerList = $.ajax({type: "GET", url: "/data/players.txt", async: false}).responseText;
var subPlayer = playerList.split(/\r\n|\n/);

//Get the Worlddata of all towns
var townsList = $.ajax({type: "GET", url: "/data/towns.txt", async: false}).responseText;
var subTowns = townsList.split(/\r\n|\n/);

//add some CSS styles
GM_addStyle ( `
    .r_city_shield_blessing {
        background: url(https://i.ibb.co/W05MsxT/dr-city-shield-blessing-a1471e5.png) no-repeat 0 0 !important;
        width: 120px !important;
        height: 72px !important;
        pointer-events: none !important;
    }

    .o_city_shield_blessing {
        background: url(https://i.ibb.co/X8cn1fK/r-city-shield-blessing-a1471e5.png) no-repeat 0 0 !important;
        width: 120px !important;
        height: 72px !important;
        pointer-events: none !important;
    }

    .b_city_shield_blessing {
        background: url(https://i.ibb.co/9crM5x6/b-city-shield-blessing-a1471e5.png) no-repeat 0 0 !important;
        width: 120px !important;
        height: 72px !important;
        pointer-events: none !important;
    }

    .g_city_shield_blessing {
        background: url(https://i.ibb.co/6YmdJVk/g-city-shield-blessing-a1471e5.png) no-repeat 0 0 !important;
        width: 120px !important;
        height: 72px !important;
        pointer-events: none !important;
    }
` );

//Search for settings
function load_settings_window(){
    var settingsWindows = document.getElementsByClassName('settings-menu');

    if (settingsWindows.length === 0) {
        count = 0;
        setTimeout(() => load_settings_window(), 500);
    } else {
        var settingsWindow = settingsWindows[0];
        count++;
        arh_settings(count);
        setTimeout(() => load_settings_window(), 1000);
    }
}

function arh_settings(counter){
    if(counter == 1){
        console.log("create");
        $(".settings-menu ul:last").append('<li id="arh_li"></div> <a id="arh_helper" href="#"> ARH Helper</a></li>');
        $("#arh_helper").click(function () {
					settings_window();
				})
    }
}

//Search for member list
function load_att_range_members(){
    var memberList = document.getElementsByClassName('members_list');
    if (memberList.length === 0) {
        setTimeout(() => load_att_range_members(), 500);

    } else {
        setTimeout(() => {
            att_range_members();
            load_att_range_members();
        }, 1000);
    }
}

//Coloring the member list
function att_range_members(){
    var players = document.getElementsByClassName('small-descr');
        try{
            for(var player of players) {
                var pointsOfPlayer = player.innerHTML.substring(0,player.innerHTML.indexOf("P"));
                if (pointsOfPlayer > 0) {
                    if (pointsOfPlayer < (pPoints * 0.83333333333) || pointsOfPlayer > (pPoints * 1.2)) {
                        player.style.color = 'red';
                    } else {
                        player.style.color = 'green';
                    }
                }
            }
    }catch(err){}
}

function settings_window(){

}

//Refreshes the towns
function towns_refresh(){
    setInterval(() => town_coloring(), 1500);
}

//Coloring the visible twons on the map
function town_coloring(){
    var towns = document.getElementsByClassName('flag town');
    for(var town of towns){
        try{
            if((town.nextSibling.nextSibling.classList.contains("city_shield_blessing"))||(town.nextSibling.nextSibling.classList.contains("r_city_shield_blessing"))||(town.nextSibling.nextSibling.classList.contains("b_city_shield_blessing"))){

                var nextelement = town.nextSibling;
                var content = nextelement.getAttribute("href");
                var base64 = window.atob(content.substring(1));

                var ix = base64.substring(base64.indexOf(",\"ix")+6, base64.indexOf(",\"iy"));
                var iy = base64.substring(base64.indexOf(",\"iy")+6, base64.indexOf(",\"tp"));
                var pos = base64.substring(base64.indexOf("island")+8, base64.indexOf("}"));
                var search = ix+","+iy+","+pos;
                var player_of_town = subTowns.find(function(element) {
                    return element.includes(search);
                });
                var playerArr = player_of_town.split(/,/);
                var pl_id = playerArr[1];

                var player = subPlayer.find(function(element) {
                    return element.includes(pl_id);
                });
                var playerArray = player.split(/,/);
                if ((playerArray[3] < (pPoints * 0.83333333333) || playerArray[3] > (pPoints * 1.2))) {
                    town.nextSibling.nextSibling.classList.remove("city_shield_blessing");
                    town.nextSibling.nextSibling.classList.add("r_city_shield_blessing");
                } else {
                    town.nextSibling.nextSibling.classList.remove("city_shield_blessing");
                    town.nextSibling.nextSibling.classList.add("b_city_shield_blessing");
                }

            }else{
                var n_nextelement = town.nextSibling;
                var n_content = n_nextelement.getAttribute("href");
                var n_base64 = window.atob(n_content.substring(1));

                var n_ix = n_base64.substring(n_base64.indexOf(",\"ix")+6, n_base64.indexOf(",\"iy"));
                var n_iy = n_base64.substring(n_base64.indexOf(",\"iy")+6, n_base64.indexOf(",\"tp"));
                var n_pos = n_base64.substring(n_base64.indexOf("island")+8, n_base64.indexOf("}"));
                var n_search = n_ix+","+n_iy+","+n_pos;
                var n_player_of_town = subTowns.find(function(element) {
                    return element.includes(n_search);
                });
                var n_playerArr = n_player_of_town.split(/,/);
                var n_pl_id = n_playerArr[1];

                var n_player = subPlayer.find(function(element) {
                    return element.includes(n_pl_id);
                });
                var n_playerArray = n_player.split(/,/);
                var style = town.nextSibling.getAttribute("style");
                var classEle = town.nextSibling.getAttribute("class");
                var town_id = town.getAttribute("id");
                var classIn = classEle.substring(5, 12);
                var l = style.substring(style.indexOf("left")+6,style.indexOf("top")-4);
                var t = style.substring(style.indexOf("top")+5, style.length-3);
                var fixedStyle = "left: " + (l-25) + "px; top: " + (t-20) + "px;";
                if ((n_playerArray[3] < (pPoints * 0.83333333333) || n_playerArray[3] > (pPoints * 1.2)) && !(town.children[0].getAttribute("class").includes("ghost"))) {
                    var div = document.createElement("div");
                    div.setAttribute("class","o_city_shield_blessing " + classIn);
                    div.setAttribute("style",fixedStyle + " position: absolute;");
                    div.setAttribute("id","blessing_"+town_id);
                    if(document.getElementById("blessing_"+town_id) == null){
                        town.parentElement.appendChild(div);
                    }
                } else {
                    var div2 = document.createElement("div");
                    div2.setAttribute("class","g_city_shield_blessing " + classIn);
                    div2.setAttribute("style",fixedStyle + " position: absolute;");
                    div2.setAttribute("id","blessing_"+town_id);
                    if(document.getElementById("blessing_"+town_id) == null){
                        town.parentElement.appendChild(div2);
                    }
                }
            }
        }catch(err){}
    }
}

//Searches for the ranking window
function load_menu_button() {
    var rankingButtons = document.getElementsByClassName('ranking main_menu_item');
    if (rankingButtons.length === 0) {
        setTimeout(() => load_menu_button(), 500);
    } else {
        rankingButton = rankingButtons[0];
        rankingButton.addEventListener('click', () => {
            setInterval(() => att_range_ranking(), 1000);
        });
    }
}

//Search for "info windows"
function load_info_button(){
    try{
        if(((document.getElementsByClassName('list_item_left')[0]).innerHTML).includes('<a href="#ey'))
        {
            att_range_info();
        }
    }catch(err){}
    setTimeout(() => load_info_button(), 1000);

}

//Coloring the ranking
function att_range_ranking() {
    var points = document.getElementsByClassName('r_points');
    var names = document.getElementsByClassName('r_name');

    //Coloring for the world ranking
    try{
        if (document.getElementById('ranking-index').className=="submenu_link active"){
            for(var point of points) {
                if (point.innerHTML > 0) {
                    if (point.innerHTML < (pPoints * 0.83333333333) || point.innerHTML > (pPoints * 1.2)) {
                        point.style.color = 'red';
                    } else {
                        point.style.color = 'green';
                    }
                }
            }
        }
    }catch(err){}

    //Coloring for the sea ranking
    try{
        if (document.getElementById('ranking-sea_player').className=="submenu_link active"){
                for(var i = 0; i < names.length; i++){
                    var name = names[i];
                    var content = name.innerHTML;
                    var base64 = window.atob(content.substring(content.indexOf("href")+7, content.indexOf("class")-2));
                    var id = base64.substring(base64.indexOf("id\"")+4,base64.indexOf("}"));
                    var player = subPlayer.find(function(element) {
                        return element.includes(id);
                    });
                    try{
                        var playerArr = player.split(/,/);
                        if (playerArr[3] < (pPoints * 0.83333333333) || playerArr[3] > (pPoints * 1.2)) {
                            points[i].style.color = 'red';
                        } else {
                            points[i].style.color = 'green';
                        }
                    }catch(err){}

                }
        }
    }catch(err){}
}


//Coloring the points in the "info window" of players
function att_range_info(){
    var opened_info_windows = document.getElementsByClassName('list_item_left');
    for(var j = 0; j < opened_info_windows.length; j++){
        var line = opened_info_windows[j].innerHTML;
        console.log(opened_info_windows[j].innerHTML);
        var a = line.indexOf('#');
        var b = line.indexOf('" ');
        var base64 = window.atob(line.substring(a+1,b));
        var id = base64.substring(base64.indexOf("id\"")+4,base64.indexOf("}"));
        var player = subPlayer.find(function(element) {
            return element.includes(id);
        });
        try{
            var playerArr = player.split(/,/);
            if (playerArr[3] < (pPoints * 0.83333333333) || playerArr[3] > (pPoints * 1.2)) {
                opened_info_windows[j].style.color = 'red';
            } else {
                opened_info_windows[j].style.color = 'green';
            }
        }catch(err){}
    }
}





