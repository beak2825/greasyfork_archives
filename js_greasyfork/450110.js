// ==UserScript==
// @name         IG Gali
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Łatwe i szybkie wyzywanie gali.
// @author       Igorajs
// @match        https://www.the-west.pl/admin.php?screen=fort_battle_list
// @include      https://www.the-west.pl/admin.php?token*screen=fort_battle_list
// @include      https://www.the-west.pl/admin.php?screen=fort_battle_list&only*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hayageek.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450110/IG%20Gali.user.js
// @updateURL https://update.greasyfork.org/scripts/450110/IG%20Gali.meta.js
// ==/UserScript==
             (function() {
                window.IG_Gali ={
                    t: {
                        1:{
                            name: "Świat 1",
                            wid: 1,
                            playerid: 2070217,
                            fortid: 163,
                        },
                        10:{
                            name: "Świat 10",
                            wid: 10,
                            playerid: 2070217,
                            fortid: 163,
                        },
                        13:{
                            name: "Arizona",
                            wid: 13,
                            playerid: 2070217,
                            fortid: 163,
                        },
                        14:{
                            name: "Blackfoot",
                            wid: 14,
                            playerid: 2070217,
                            fortid: 163,
                        },
                        16:{
                            name: "Dakota",
                            wid: 16,
                            playerid: 2070217,
                            fortid: 163,
                        },
                        17:{
                            name: "Huron",
                            wid: 17,
                            playerid: 2070217,
                            fortid: 163,
                        },
                        18:{
                            name: "Iroquois",
                            wid: 18,
                            playerid: 2070217,
                            fortid: 45,
                        },
                        23:{
                            name: "Muscotah",
                            wid: 23,
                            playerid: 2070217,
                            fortid: 5,
                        },
                        24:{
                            name: "Nawaho",
                            wid: 24,
                            playerid: 2070217,
                            fortid: 3,
                        },
                        25:{
                            name: "Ohio",
                            wid: 25,
                            playerid: 2070217,
                            fortid: 3,
                        },
                        26:{
                            name: "Pensylwania",
                            wid: 26,
                            playerid: 2070217,
                            fortid: 3,
                        },
                        27:{
                            name: "Richmond",
                            wid: 27,
                            playerid: 2070217,
                            fortid: 3,
                        },
                        28:{
                            name: "Sacramento",
                            wid: 28,
                            playerid: 2070217,
                            fortid: 4,
                        }
                    },
                    rew_req_tab:{
                        winner : false,
                        loser : false
                    },
                    rew_world_tab:{

                    },
                    init: function(){
                        IG_Gali.build_html();
                        IG_Gali.build_css();
                        IG_Gali.build_desc();
                        IG_Gali.active_battles();
                        IG_Gali.load_rewards_info();
                        //IG_Gali.init_rewards();
                    },
                    build_html: function() {

                        const galiDiv = document.createElement("div");
                        galiDiv.setAttribute("id","galiDiv");
                        const galiTitle = document.createElement("div");
                        galiTitle.setAttribute("id","galiTitle");
                        galiTitle.setAttribute("onclick","IG_Gali.minimize()");
                        const galiMain = document.createElement("div");
                        galiMain.setAttribute("id","galiMain");
                        const galiCont = document.createElement("div");
                        galiCont.setAttribute("id","galiCont");
                        const galiDes = document.createElement("div");
                        galiDes.setAttribute("id","galiDes");

                        const gd1 = document.createElement("div");
                        gd1.setAttribute("class","gd1");
                        const gd2 = document.createElement("div");
                        gd2.setAttribute("class","gd2");
                        const gd3 = document.createElement("div");
                        gd3.setAttribute("class","gd3");
                        const gd4 = document.createElement("div");
                        gd4.setAttribute("class","gd4");
                        gd4.setAttribute("onclick","IG_Gali.open_rew()");
                        const gd5 = document.createElement("div");
                        gd5.setAttribute("class","gd5");
                        gd5.setAttribute("onclick","IG_Gali.open_rew()");
                        const hr = document.createElement("hr");
                        hr.setAttribute("class","ghr");

                        const tabw = Object.values(IG_Gali.t);
                        let g1 = []; let g2 = []; let g3 = []; let g4 = []; let g5 = []; let galiRow = []; let btn = [];
                        for(var i=0; i < tabw.length; i++){
                            galiRow[i] = document.createElement("div");
                            galiRow[i].setAttribute("class","galiRow wid-"+tabw[i]["wid"]);
                            g1[i] = document.createElement("div");
                            g1[i].setAttribute("class","g1 wid-"+tabw[i]["wid"]);
                            g2[i] = document.createElement("div");
                            g2[i].setAttribute("class","g2 wid-"+tabw[i]["wid"]);
                            g3[i] = document.createElement("div");
                            g3[i].setAttribute("class","g3 wid-"+tabw[i]["wid"]);
                            g4[i] = document.createElement("div");
                            g4[i].setAttribute("class","g4 wid-"+tabw[i]["wid"]);
                            g5[i] = document.createElement("div");
                            g5[i].setAttribute("class","g5 wid-"+tabw[i]["wid"]);
                            btn[i] = document.createElement("input");
                            btn[i].setAttribute("class","galiBtn wid-"+tabw[i]["wid"]);
                            btn[i].setAttribute("type","button");
                            btn[i].setAttribute("value","Wyzwij");
                            btn[i].setAttribute("onclick","IG_Gali.declare_war("+tabw[i]['wid']+","+tabw[i]['playerid']+","+ tabw[i]['fortid']+")");
                        }

                        const body = document.querySelector('body');
                        body.appendChild(galiDiv);
                        galiDiv.appendChild(galiMain);
                        galiMain.appendChild(galiTitle);
                        galiDiv.appendChild(galiCont);
                        galiMain.appendChild(galiDes);
                        galiDes.appendChild(gd1);
                        galiDes.appendChild(gd2);
                        galiDes.appendChild(gd3);
                        galiDes.appendChild(gd4);
                        galiDes.appendChild(gd5);
                        galiCont.appendChild(hr);
                        for(var i=0;i<tabw.length;i++){
                            galiCont.appendChild(galiRow[i]);
                            galiRow[i].appendChild(g1[i]);
                            galiRow[i].appendChild(g2[i]);
                            galiRow[i].appendChild(g3[i]);
                            g3[i].appendChild(btn[i]);
                            galiRow[i].appendChild(g4[i]);
                            galiRow[i].appendChild(g5[i]);
                        }

                    },
                    build_css: function() {
                        $('#galiDiv').css({
                            'width':'670px',
                            'height':'600px',
                            'border': '2px solid',
                            'background-color':'#dbdbd5',
                            'border-radius':'30px',
                            'left': '100%',
                            //'right': '5px',
                            'bottom': '5px',
                            'position':'sticky',
                            'z-index':'20',
                            'overflow':'overlay'
                        });
                        $('#galiMain').css({
                            'position':'sticky',
                            'top':'0',
                            'background-color':'#dbdbd5'
                        });
                        $('#galiTitle').css({
                            'width':'100%',
                            'height':'30px',
                            'background-color':'#c1c2ba',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'cursor':'pointer',
                            'border-bottom':'2px solid black'
                        });
                        $('#galiCont').css({
                            'width':'100%',
                            'min-height':'570px',
                            'background-color':'#f4f5ed',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'overflow':'hidden'
                        });
                        $('#galiDes').css({
                            'width':'100%',
                            'height':'30px',
                            'background-color':'yellow',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                        });
                        $('.gd1').css({
                            'width':'130px',
                            'height':'30px',
                            'background-color':'#dbdbd5',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.gd2').css({
                            'width':'120px',
                            'height':'30px',
                            'background-color':'#dbdbd5',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.gd3').css({
                            'width':'90px',
                            'height':'30px',
                            'background-color':'#dbdbd5',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.gd4').css({
                            'width':'157px',
                            'height':'30px',
                            'background-color':'#dbdbd5',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left',
                            'cursor':'pointer'
                        });
                        $('.gd5').css({
                            'width':'157px',
                            'height':'30px',
                            'background-color':'#dbdbd5',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left',
                            'cursor':'pointer'
                        });
                        $('.ghr').css({
                            'background-color':'black',
                            'height': '2px',
                            'border': 'none'
                        });
                        $('.galiRow').css({
                            'width':'100%',
                            'min-height':'30px',
                            'height':'auto',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'margin-bottom':'15px',
                            'display': 'flex',
                            'align-items': 'center'
                        });
                        $('.g1').css({
                            'width':'130px',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.g2').css({
                            'width':'120px',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.g3').css({
                            'width':'90px',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.g4').css({
                            'width':'157px',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.g5').css({
                            'width':'157px',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });

                    },
                    build_desc: function(){
                        $('#galiTitle').html("Gali");
                        $('.gd1').html("Świat");
                        $('.gd2').html("Stan");
                        $('.gd3').html("Bitwa");
                        $('.gd4').html("Nagrody Win");
                        $('.gd5').html("Nagrody Lose");
                        const tabw = Object.values(IG_Gali.t);
                        for(var i=0; i < tabw.length; i++){
                            $('.g1.wid-'+tabw[i]["wid"]).html(tabw[i]["name"]);
                            $('.g2.wid-'+tabw[i]["wid"]).html("Ładowanie...");
                            $('.g4.wid-'+tabw[i]["wid"]).html("Ładowanie...");
                            $('.g5.wid-'+tabw[i]["wid"]).html("Ładowanie...");
                        }
                    },
                    active_battles: function(){
                        const tabw = Object.values(IG_Gali.t);
                        for(var i=0; i < tabw.length; i++){
                            if($("#fort_battle_start_"+tabw[i]['fortid']+"_"+tabw[i]["wid"]).length){
                                $('.g2.wid-'+tabw[i]["wid"]).html("Wyzwana");
                                $('.g2.wid-'+tabw[i]["wid"]).css("color", "green");
                                $('.galiBtn.wid-'+tabw[i]["wid"]).attr('disabled','disabled');
                            }else{
                                $('.g2.wid-'+tabw[i]["wid"]).html("Niewyzwana");
                                $('.g2.wid-'+tabw[i]["wid"]).css("color", "red");
                            }
                        }
                    },
                    declare_war: function(a,b,c){
                        $('.galiBtn.wid-'+a).attr('disabled','disabled');
                        const formData = {world_id: a,fort_id: c,player_id: b,csrf_token: Cookies.get('csrf_token')};
                        $.post("?screen=fort_battle_list&action=declare_battle",
                            formData,
                            function(data, textStatus, jqXHR){
                                ajaxRequestAction("fort_battle_list", "edit_battle_start", {fort_id: c, world_id: a, new_date: IG_Gali.getNextSunday()+" 20:30"}, function(resp) {
                                    if(resp.error) {
                                        alert(resp.error);
                                    } else {
                                        $.get('https://www.the-west.pl/admin.php?&screen=fort_battle_list', function(html) {
                                            const dt = $(html).find("#fort_battle_start_"+c+"_"+a).parents().eq(8).clone();
                                            if(dt.length > 0){
                                                $("#fort_battle_world_"+a).parents().eq(1).children().eq(1).remove();
                                                $("#fort_battle_world_"+a).parents().eq(1).append(dt);
                                                $('.g2.wid-'+a).html("Wyzwana");
                                                $('.g2.wid-'+a).css("color", "green");
                                            }else{
                                                $('.g2.wid-'+a).html("Błąd!");
                                            }
                                        });
                                    }
                                });
                            }).fail(function(jqXHR, textStatus, errorThrown){
                                alert(textStatus);
                            });
                    },
                    getNextSunday: function(date = new Date()) {
                        const dateCopy = new Date(date.getTime());
                        const nextSunday = new Date(
                            dateCopy.setDate(
                            dateCopy.getDate() + ((7 - dateCopy.getDay() + 0) % 7 || 7),
                            ),
                        );
                            const yyyy = nextSunday.getFullYear().toString();
                            const mm = (nextSunday.getMonth()+1).toString();
                            const dd = nextSunday.getDate().toString();
                            const mmChars = mm.split('');
                            const ddChars = dd.split('');

                        return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
                    },
                    load_rewards_info: function(){
                        const tabw = Object.values(IG_Gali.t);
                        for(var i=0; i < tabw.length; i++){
                            $('.g4.wid-'+tabw[i]["wid"]).html("");
                            $('.g5.wid-'+tabw[i]["wid"]).html("");
                            if($("#fort_battle_start_"+tabw[i]['fortid']+"_"+tabw[i]["wid"]).length){
                                $.get('https://www.the-west.pl/admin.php?screen=fort_battle_list&mode=view_battle&world_id='+tabw[i]["wid"]+'&fort_id='+tabw[i]["fortid"], function(html) {
                                    let dt = $(html).find("form[name='add-reward']").find('.vis tbody');
                                    let searchParams = new URLSearchParams($(html).find("form[name='add-reward']").attr('action'));
                                    let wid = searchParams.get('world_id');
                                    let fortid = searchParams.get('fort_id');
                                    if(dt.length == 0){
                                        $('.g4.wid-'+wid).html("");
                                        $('.g5.wid-'+wid).html("");
                                    }else{
                                        $('.g4.wid-'+wid).html("");
                                        $('.g5.wid-'+wid).html("");
                                        $(dt).children().each(function(index,element){
                                            if(index != 0){
                                                var a = $(element).find("td").eq(0).text().replace(/\r?\n|\t|\r/g, "");
                                                var b = $(element).find("td").eq(1).text().replace(/\r?\n|\t|\r/g, "");
                                                var c = $(element).find("td").eq(2).find('a').attr("href");
                                                if(a == "winner"){
                                                    let gmr1 = document.createElement("div");
                                                    gmr1.setAttribute("class","gmr1 wid-"+wid+" gitem_"+index);
                                                    let gm1 = document.createElement("div");
                                                    gm1.setAttribute("onclick", 'IG_Gali.delete_item("'+c+'",'+wid+','+fortid+')');
                                                    gm1.setAttribute("class","gm1 wid-"+wid+" gitem_"+index);
                                                    let gm2 = document.createElement("div");
                                                    gm2.setAttribute("class","gm2 wid-"+wid+" gitem_"+index);
                                                    $(".g4.wid-"+wid).append(gmr1);
                                                    gmr1.append(gm1);
                                                    gmr1.append(gm2);
                                                    $(".gm1.wid-"+wid+".gitem_"+index).html("x");
                                                    $(".gm2.wid-"+wid+".gitem_"+index).html(b);
                                                }else{
                                                    let gmr1 = document.createElement("div");
                                                    gmr1.setAttribute("class","gmr1 wid-"+wid+" gitem_"+index);
                                                    let gm1 = document.createElement("div");
                                                    gm1.setAttribute("onclick", 'IG_Gali.delete_item("'+c+'",'+wid+','+fortid+')');
                                                    gm1.setAttribute("class","gm1 wid-"+wid+" gitem_"+index);
                                                    let gm2 = document.createElement("div");
                                                    gm2.setAttribute("class","gm2 wid-"+wid+" gitem_"+index);
                                                    $(".g5.wid-"+wid).append(gmr1);
                                                    gmr1.append(gm1);
                                                    gmr1.append(gm2);
                                                    $(".gm1.wid-"+wid+".gitem_"+index).html("x");
                                                    $(".gm2.wid-"+wid+".gitem_"+index).html(b);
                                                }
                                                IG_Gali.rewards_css();
                                            }
                                        })
                                    }
                                });
                            }else{
                                $('.g4.wid-'+tabw[i]["wid"]).html("");
                                $('.g5.wid-'+tabw[i]["wid"]).html("");
                            }
                        }
                    },
                    rewards_css: function(){
                        $('.gmr1').css({
                            'width':'100%',
                            'height':'14px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'14px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left'
                        });
                        $('.gm1').css({
                            'width':'10%',
                            'height':'14px',
                            'box-sizing':'border-box',
                            'color':'red',
                            'font-size':'14px',
                            'text-align':'center',
                            'display': 'block',
                            'float':'left',
                            'cursor':'pointer'
                        });
                        $('.gm2').css({
                            'width':'90%',
                            'height':'14px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'14px',
                            'text-align':'left',
                            'display': 'block',
                            'float':'left'
                        });
                    },
                    delete_item: function(url,wid,fortid){
                        $('.g4.wid-'+wid).html("Ładowanie...");
                        $('.g5.wid-'+wid).html("Ładowanie...");
                        $.get(url, function(html) {
                            let dt = $(html).find("form[name='add-reward']").find('.vis tbody');
                            if(dt.length == 0){
                                $('.g4.wid-'+wid).html("");
                                $('.g5.wid-'+wid).html("");
                            }else{
                                $('.g4.wid-'+wid).html("");
                                $('.g5.wid-'+wid).html("");
                                $(dt).children().each(function(index,element){
                                    if(index != 0){
                                        var a = $(element).find("td").eq(0).text().replace(/\r?\n|\t|\r/g, "");
                                        var b = $(element).find("td").eq(1).text().replace(/\r?\n|\t|\r/g, "");
                                        var c = $(element).find("td").eq(2).find('a').attr("href");
                                        if(a == "winner"){
                                            let gmr1 = document.createElement("div");
                                            gmr1.setAttribute("class","gmr1 wid-"+wid+" gitem_"+index);
                                            let gm1 = document.createElement("div");
                                            gm1.setAttribute("onclick", 'IG_Gali.delete_item("'+c+'",'+wid+','+fortid+')');
                                            gm1.setAttribute("class","gm1 wid-"+wid+" gitem_"+index);
                                            let gm2 = document.createElement("div");
                                            gm2.setAttribute("class","gm2 wid-"+wid+" gitem_"+index);
                                            $(".g4.wid-"+wid).append(gmr1);
                                            gmr1.append(gm1);
                                            gmr1.append(gm2);
                                            $(".gm1.wid-"+wid+".gitem_"+index).html("x");
                                            $(".gm2.wid-"+wid+".gitem_"+index).html(b);
                                        }else{
                                            let gmr1 = document.createElement("div");
                                            gmr1.setAttribute("class","gmr1 wid-"+wid+" gitem_"+index);
                                            let gm1 = document.createElement("div");
                                            gm1.setAttribute("onclick", 'IG_Gali.delete_item("'+c+'",'+wid+','+fortid+')');
                                            gm1.setAttribute("class","gm1 wid-"+wid+" gitem_"+index);
                                            let gm2 = document.createElement("div");
                                            gm2.setAttribute("class","gm2 wid-"+wid+" gitem_"+index);
                                            $(".g5.wid-"+wid).append(gmr1);
                                            gmr1.append(gm1);
                                            gmr1.append(gm2);
                                            $(".gm1.wid-"+wid+".gitem_"+index).html("x");
                                            $(".gm2.wid-"+wid+".gitem_"+index).html(b);
                                        }
                                        IG_Gali.rewards_css();
                                    }
                                })
                            }
                        });
                    },
                    minimize: function(){
                        if($("#galiTitle").hasClass("minimized")){
                            $("#galiDes").css({"display":"block"});
                            $("#galiCont").css({"display":"block"});
                            $("#galiDiv").css({"height":"600px"});
                            $("#galiTitle").removeClass("minimized");
                        }else{
                            $("#galiDes").css({"display":"none"});
                            $("#galiCont").css({"display":"none"});
                            $("#galiDiv").css({"height":""});
                            $("#galiTitle").addClass("minimized");
                        }
                    },
                    item_list:[
                        {
                            "id": "51980",
                            "name": "Pink eggs container",
                            "value": 0.5,
                            "req": "Św. Patryk"
                        },
                        {
                            "id": "51484",
                            "name": "Żółta walizka z fajerwerkami",
                            "value": 0.5,
                            "req": "Niepodległość"
                        },
                        {
                            "id": "52213",
                            "name": "25 Precli",
                            "value": 0.5,
                            "req": "Oktoberfest"
                        },
                        {
                            "id": "2675",
                            "name": "Pudełko aksamitek",
                            "value": 0.5,
                            "req": "DoD"
                        },
                        {
                            "id": "185200",
                            "name": "Easter Egg (Work motivation)",
                            "value": 1,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "185201",
                            "name": "Easter Egg (Travel time reduction)",
                            "value": 1,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "185202",
                            "name": "Easter Egg (Duel motivation)",
                            "value": 1,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "185203",
                            "name": "Easter Egg (Energy)",
                            "value": 1,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "185204",
                            "name": "Easter Egg (Health)",
                            "value": 1,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "185205",
                            "name": "Easter Egg (Energy and Health)",
                            "value": 1,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "2561",
                            "name": "Love apple (100 Hearts)",
                            "value": 1.5,
                            "req": "Walentynki"
                        },
                        {
                            "id": "51981",
                            "name": "Red eggs container",
                            "value": 2,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "51485",
                            "name": "Zielona walizka z fajerwerkami",
                            "value": 2,
                            "req": "Niepodległość"
                        },
                        {
                            "id": "52214",
                            "name": "50 Precli",
                            "value": 2,
                            "req": "Oktoberfest"
                        },
                        {
                            "id": "51255",
                            "name": "Niebieskie pudełko aksamitek",
                            "value": 2,
                            "req": "DoD"
                        },
                        {
                            "id": "2559",
                            "name": "$1000 Letter",
                            "value": 3,
                            "req": "Walentynki"
                        },
                        {
                            "id": "51932",
                            "name": "Green beer",
                            "value": 3,
                            "req": "Św. Patryk"
                        },
                        {
                            "id": "51933",
                            "name": "Green pancakes",
                            "value": 3,
                            "req": "Św. Patryk"
                        },
                        {
                            "id": "51982",
                            "name": "Violet eggs container",
                            "value": 3,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "51486",
                            "name": "Niebieska walizka z fajerwerkami",
                            "value": 3,
                            "req": "Niepodległość"
                        },
                        {
                            "id": "52215",
                            "name": "100 Precli",
                            "value": 3,
                            "req": "Oktoberfest"
                        },
                        {
                            "id": "51256",
                            "name": "Zielone pudełko aksamitek",
                            "value": 3,
                            "req": "DoD"
                        },
                        {
                            "id": "51983",
                            "name": "Dark blue eggs container",
                            "value": 4,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "2262",
                            "name": "Złota podkowa",
                            "value": 5,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2560",
                            "name": "$5000 Letter",
                            "value": 5,
                            "req": "Walentynki"
                        },
                        {
                            "id": "51984",
                            "name": "Light blue eggs container",
                            "value": 5,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "51487",
                            "name": "Fioletowa walizka z fajerwerkami",
                            "value": 5,
                            "req": "Niepodległość"
                        },
                        {
                            "id": "52216",
                            "name": "200 Precli",
                            "value": 5,
                            "req": "Oktoberfest"
                        },
                        {
                            "id": "51257",
                            "name": "Fioletowe pudełko aksamitek",
                            "value": 5,
                            "req": "DoD"
                        },
                        {
                            "id": "51985",
                            "name": "Yellow eggs container",
                            "value": 6,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "51488",
                            "name": "Czerwona walizka z fajerwerkami",
                            "value": 6,
                            "req": "Niepodległość"
                        },
                        {
                            "id": "52217",
                            "name": "400 Precli",
                            "value": 6,
                            "req": "Oktoberfest"
                        },
                        {
                            "id": "51258",
                            "name": "Czerwone pudełko aksamitek",
                            "value": 6,
                            "req": "DoD"
                        },
                        {
                            "id": "12701",
                            "name": "Lukrecja",
                            "value": 8,
                            "req": "Zimną"
                        },
                        {
                            "id": "12702",
                            "name": "Owies",
                            "value": 8,
                            "req": "Zimną"
                        },
                        {
                            "id": "12703",
                            "name": "Bożonarodzeniowy krakers",
                            "value": 8,
                            "req": "Zimną"
                        },
                        {
                            "id": "12704",
                            "name": "Piernik",
                            "value": 8,
                            "req": "Zimną"
                        },
                        {
                            "id": "12705",
                            "name": "Ciastko czekoladowe",
                            "value": 8,
                            "req": "Zimną"
                        },
                        {
                            "id": "12706",
                            "name": "Kartofelek marcepanowy",
                            "value": 8,
                            "req": "Zimną"
                        },
                        {
                            "id": "2562",
                            "name": "Sugar hearts (500 Hearts)",
                            "value": 8,
                            "req": "Walentynki"
                        },
                        {
                            "id": "51986",
                            "name": "Green eggs container",
                            "value": 8,
                            "req": "Wielkanoc"
                        },
                        {
                            "id": "2619",
                            "name": "650 Fajerwerków",
                            "value": 8,
                            "req": "Niepodległość"
                        },
                        {
                            "id": "2676",
                            "name": "650 Aksamitek",
                            "value": 8,
                            "req": "DoD"
                        },
                        {
                            "id": "2263",
                            "name": "Dwie złote podkowy",
                            "value": 10,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2270",
                            "name": "Koktajl paradny Christophera",
                            "value": 12,
                            "req": "Wiosną"
                        },
                        {
                            "id": "2264",
                            "name": "Trzy złote podkowy",
                            "value": 15,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "51066",
                            "name": "Karty Ligi Dzikiego Zachodu",
                            "value": 15,
                            "req": "Ev.Piłkarski"
                        },
                        {
                            "id": "52053",
                            "name": "Liga Dzikiego Zachodu 2020",
                            "value": 15,
                            "req": "Ev.Piłkarski"
                        },
                        {
                            "id": "2258",
                            "name": "Specjalny nabój",
                            "value": 18,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2116",
                            "name": "Flakonik życia",
                            "value": 18,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2128",
                            "name": "Kawa",
                            "value": 18,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "51232",
                            "name": "Kanapka",
                            "value": 18,
                            "req": "Raz na 3 miesiące"
                        },
                        {
                            "id": "51233",
                            "name": "Ser z owczego mleka",
                            "value": 18,
                            "req": "Raz na 3 miesiące"
                        },
                        {
                            "id": "52289",
                            "name": "Blok bożonarodzeniowy",
                            "value": 21,
                            "req": "Grudzień"
                        },
                        {
                            "id": "2119",
                            "name": "Tłusty olej do broni",
                            "value": 23,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2121",
                            "name": "Ulepszona szczerbinka",
                            "value": 23,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2486",
                            "name": "Namiot",
                            "value": 25,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2136",
                            "name": "Zielony list",
                            "value": 25,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2130",
                            "name": "Herbata Mate",
                            "value": 26,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "52290",
                            "name": "Świąteczne ciasteczka maślane",
                            "value": 26,
                            "req": "Grudzień"
                        },
                        {
                            "id": "2259",
                            "name": "Dwa specjalne naboje",
                            "value": 27,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "1974",
                            "name": "Eliksir życia",
                            "value": 27,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2129",
                            "name": "Guarana",
                            "value": 27,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2268",
                            "name": "Mydliny",
                            "value": 29,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "212600",
                            "name": "Banalne wskazówki do prac",
                            "value": 33,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2100",
                            "name": "Podstawowe wskazówki do prac",
                            "value": 33,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2106",
                            "name": "Lśniący olej do broni",
                            "value": 33,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2110",
                            "name": "Wytrzymała kolba",
                            "value": 33,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "51059",
                            "name": "Niebieska karta",
                            "value": 33,
                            "req": "Ev.Piłkarski"
                        },
                        {
                            "id": "52052",
                            "name": "Czerwona kartka",
                            "value": 33,
                            "req": "Ev.Piłkarski"
                        },
                        {
                            "id": "50846",
                            "name": "Niebieska magiczna mikstura",
                            "value": 35,
                            "req": "Zimną"
                        },
                        {
                            "id": "50845",
                            "name": "Czerwona magiczna mikstura",
                            "value": 35,
                            "req": "Zimną"
                        },
                        {
                            "id": "52291",
                            "name": "Różano-pomarańczowe ciasteczka",
                            "value": 35,
                            "req": "Grudzień"
                        },
                        {
                            "id": "2117",
                            "name": "Mikstura życia",
                            "value": 36,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "52285",
                            "name": "Ciasto śliwkowe",
                            "value": 36,
                            "req": "Grudzień"
                        },
                        {
                            "id": "52286",
                            "name": "Laski cukrowe",
                            "value": 37,
                            "req": "Grudzień"
                        },
                        {
                            "id": "2260",
                            "name": "Trzy specjalne naboje",
                            "value": 38,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "51127",
                            "name": "Ratatuj z rybą",
                            "value": 38,
                            "req": "Raz na 2 miesiące"
                        },
                        {
                            "id": "51038",
                            "name": "Kokos",
                            "value": 38,
                            "req": "Latem"
                        },
                        {
                            "id": "51039",
                            "name": "Kwiatowy koktail",
                            "value": 38,
                            "req": "Latem"
                        },
                        {
                            "id": "50135",
                            "name": "Indiańskie barwy wojenne",
                            "value": 38,
                            "req": "Latem"
                        },
                        {
                            "id": "50136",
                            "name": "Twój testament",
                            "value": 38,
                            "req": "Latem"
                        },
                        {
                            "id": "2118",
                            "name": "Banalne szczegółowe wskazówki do prac",
                            "value": 39,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2120",
                            "name": "Bardzo tłusty olej do broni",
                            "value": 39,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2122",
                            "name": "Ulepszona solidna szczerbinka",
                            "value": 39,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2393",
                            "name": "40 Obligacji",
                            "value": 40,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "52287",
                            "name": "Świąteczny puddling",
                            "value": 41,
                            "req": "Grudzień"
                        },
                        {
                            "id": "17028",
                            "name": "Puszka szpinaku",
                            "value": 45,
                            "req": "Raz na 2 miesiące"
                        },
                        {
                            "id": "52288",
                            "name": "Eggnog",
                            "value": 45,
                            "req": "Grudzień"
                        },
                        {
                            "id": "52292",
                            "name": "Świąteczny domek z piernika",
                            "value": 45,
                            "req": "Grudzień"
                        },
                        {
                            "id": "2102",
                            "name": "Zaawansowane wskazówki do prac",
                            "value": 49,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2108",
                            "name": "Błyszczący olej do broni",
                            "value": 49,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2112",
                            "name": "Wytrzymała lufa",
                            "value": 49,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2123",
                            "name": "Ulepszone naboje",
                            "value": 49,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2125",
                            "name": "Ulepszona komora",
                            "value": 49,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "51125",
                            "name": "Pudding z pomarańczami",
                            "value": 49,
                            "req": "Raz na 2 miesiące"
                        },
                        {
                            "id": "2483",
                            "name": "Indian rite necklace",
                            "value": 50,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2137",
                            "name": "Czerwony list",
                            "value": 50,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2269",
                            "name": "Trzy kawałki smalcu",
                            "value": 55,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2261",
                            "name": "Cztery specjalne naboje",
                            "value": 55,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "51126",
                            "name": "Chili Dzikiego Zachodu",
                            "value": 55,
                            "req": "Raz na 2 miesiące"
                        },
                        {
                            "id": "52263",
                            "name": "Legendarna czarna skrzynia",
                            "value": 55,
                            "req": "DoD"
                        },
                        {
                            "id": "2101",
                            "name": "Podstawowe szczegółowe wskazówki do prac",
                            "value": 59,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2107",
                            "name": "Bardzo lśniący olej do broni",
                            "value": 59,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "211100",
                            "name": "Solidna kolba",
                            "value": 59,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "50009",
                            "name": "Skrzynia Ibenezera Grincha",
                            "value": 60,
                            "req": "Tylko podczas wyprzedaży świątecznej"
                        },
                        {
                            "id": "2135",
                            "name": "Proszek ze skorupy rakietowego żółwia",
                            "value": 75,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "22103",
                            "name": "Zaawansowane szczegółowe wskazówki do prac",
                            "value": 95,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2109",
                            "name": "Bardzo błyszczący olej do broni",
                            "value": 95,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2113",
                            "name": "Wzmocniona wytrzymała lufa",
                            "value": 95,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2124",
                            "name": "Ulepszone liczne naboje",
                            "value": 95,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2127",
                            "name": "Ulepszona naoliwiona komora",
                            "value": 95,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2104",
                            "name": "Eksperckie wskazówki do prac",
                            "value": 123,
                            "req": "Bez Limitu"
                        },
                        {
                            "id": "2114",
                            "name": "Przedłużona lufa",
                            "value": 123,
                            "req": "Bez Limitu"
                        }
                    ],
                    init_rewards: function(){
                        IG_Gali.build_rewards();
                        IG_Gali.build_css_rewards();
                        IG_Gali.build_desc_rewards();
                    },
                    build_rewards : function(){
                        const galiRewDiv = document.createElement("div");
                        galiRewDiv.setAttribute("id","galiRewDiv");
                        const galiRewTitle = document.createElement("div");
                        galiRewTitle.setAttribute("id","galiRewTitle");
                        galiRewTitle.setAttribute("onclick","IG_Gali.close_rew()");
                        const galiRewCont = document.createElement("div");
                        galiRewCont.setAttribute("id","galiRewCont");
                        const gRewLeft = document.createElement("div");
                        gRewLeft.setAttribute("id","gRewLeft");
                        const gRewRight = document.createElement("div");
                        gRewRight.setAttribute("id","gRewRight");

                        const gRewL1 = document.createElement("div");
                        gRewL1.setAttribute("id","gRewL1");
                        const gRewL2 = document.createElement("div");
                        gRewL2.setAttribute("id","gRewL2");
                        const gRewL3 = document.createElement("div");
                        gRewL3.setAttribute("id","gRewL3");
                        const gRewL4 = document.createElement("div");
                        gRewL4.setAttribute("id","gRewL4");

                        const gRWin = document.createElement("div");
                        gRWin.setAttribute("id","gRWin");
                        gRWin.setAttribute("class","gRewReq");
                        gRWin.setAttribute("onclick","IG_Gali.reward_req(this,'gRWin')");
                        const gRLose = document.createElement("div");
                        gRLose.setAttribute("id","gRLose");
                        gRLose.setAttribute("class","gRewReq");
                        gRLose.setAttribute("onclick","IG_Gali.reward_req(this,'gRLose')");
                        const gRWinLose = document.createElement("div");
                        gRWinLose.setAttribute("id","gRWinLose");
                        gRWinLose.setAttribute("class","gRewReq");
                        gRWinLose.setAttribute("onclick","IG_Gali.reward_req(this,'gRWinLose')");
                        const tabw = Object.values(IG_Gali.t);
                        let g1 = []
                        for(var i=0; i < tabw.length; i++){
                            g1[i] = document.createElement("div");
                            g1[i].setAttribute("class","gRewReq wid-"+tabw[i]["wid"]);
                            g1[i].setAttribute("onclick","IG_Gali.reward_req_world( this,'"+tabw[i]["wid"]+"','"+tabw[i]["fortid"]+"','"+tabw[i]["name"]+"')")
                        }
                        const itab = IG_Gali.item_list;
                        let row = []; let r1 = []; let r2 = []; let r3 = [];
                        for(var i=0;i<itab.length;i++){
                            if(i == 0){
                                row[i] = document.createElement("div");
                                row[i].setAttribute("class","item-row item-mrow");
                                r1[i] = document.createElement("div");
                                r1[i].setAttribute("class","item-mr1 item-r1");
                                r2[i] = document.createElement("div");
                                r2[i].setAttribute("class","item-mr2 item-r2");
                                r3[i] = document.createElement("div");
                                r3[i].setAttribute("class","item-mr3 item-r3");
                            }else{
                                if((i%2)==1){
                                    row[i] = document.createElement("div");
                                    row[i].setAttribute("class","item-row gir1");
                                    row[i].setAttribute("onclick","IG_Gali.rewlist_add_item("+itab[i]["id"]+","+itab[i]["value"]+",'"+itab[i]["name"]+"','"+itab[i]["req"]+"')");
                                    r1[i] = document.createElement("div");
                                    r1[i].setAttribute("class","item-r1 pos-"+i);
                                    r2[i] = document.createElement("div");
                                    r2[i].setAttribute("class","item-r2 pos-"+i);
                                    r3[i] = document.createElement("div");
                                    r3[i].setAttribute("class","item-r3 pos-"+i);
                                }else{
                                    row[i] = document.createElement("div");
                                    row[i].setAttribute("class","item-row gir2");
                                    row[i].setAttribute("onclick","IG_Gali.rewlist_add_item("+itab[i]["id"]+","+itab[i]["value"]+",'"+itab[i]["name"]+"','"+itab[i]["req"]+"')");
                                    r1[i] = document.createElement("div");
                                    r1[i].setAttribute("class","item-r1 pos-"+i);
                                    r2[i] = document.createElement("div");
                                    r2[i].setAttribute("class","item-r2 pos-"+i);
                                    r3[i] = document.createElement("div");
                                    r3[i].setAttribute("class","item-r3 pos-"+i);
                                }

                            }
                        }
                        const gRewInput = document.createElement("input");
                        gRewInput.setAttribute("type","text");
                        gRewInput.setAttribute("id","rewinput");
                        gRewInput.setAttribute("placeholder","ID Itemu...");
                        const gRewBtnDod = document.createElement("input");
                        gRewBtnDod.setAttribute("type","button");
                        gRewBtnDod.setAttribute("value","Dodaj");
                        gRewBtnDod.setAttribute("onclick","IG_Gali.rew_add_item()");
                        const gRewBtnStart = document.createElement("input");
                        gRewBtnStart.setAttribute("type","button");
                        gRewBtnStart.setAttribute("value","Uruchom");
                        gRewBtnStart.setAttribute("onclick","IG_Gali.rew_start()");

                        let irow = document.createElement("div");
                        irow.setAttribute("class","item-row item-mrow");
                        let ir1 = document.createElement("div");
                        ir1.setAttribute("class","item-imr1 item-ir1");
                        let ir2 = document.createElement("div");
                        ir2.setAttribute("class","item-imr2 item-ir2");
                        let ir3 = document.createElement("div");
                        ir3.setAttribute("class","item-imr3 item-ir3");
                        let ir4 = document.createElement("div");
                        ir4.setAttribute("class","item-imr4 item-ir4");
                        let ir5 = document.createElement("div");
                        ir5.setAttribute("class","item-imr5 item-ir5");
                        let ridiv = document.createElement("div");
                        ridiv.setAttribute("class","ridiv");

                        const body = document.querySelector('body');
                        body.appendChild(galiRewDiv);
                        galiRewDiv.appendChild(galiRewTitle);
                        galiRewDiv.appendChild(galiRewCont);
                        galiRewCont.appendChild(gRewLeft);
                        galiRewCont.appendChild(gRewRight);
                        gRewLeft.appendChild(gRewL1);
                        gRewLeft.appendChild(gRewL2);
                        gRewLeft.appendChild(gRewL3);
                        gRewLeft.appendChild(gRewL4);
                        gRewL1.appendChild(gRWin);
                        gRewL1.appendChild(gRLose);
                        gRewL1.appendChild(gRWinLose);
                        for(var i=0;i<tabw.length;i++){
                            gRewL2.appendChild(g1[i]);
                        }
                        for(var i=0;i<row.length;i++){
                            gRewRight.appendChild(row[i]);
                            row[i].appendChild(r1[i]);
                            row[i].appendChild(r2[i]);
                            row[i].appendChild(r3[i]);
                        }
                        gRewL3.appendChild(gRewInput);
                        gRewL3.appendChild(gRewBtnDod);
                        gRewL3.appendChild(gRewBtnStart);
                        gRewL4.appendChild(irow);
                        irow.appendChild(ir1);
                        irow.appendChild(ir2);
                        irow.appendChild(ir3);
                        irow.appendChild(ir4);
                        irow.appendChild(ir5);
                        gRewL4.appendChild(ridiv);

                    },
                    build_css_rewards: function(){
                        $('#galiRewDiv').css({
                            'width':'770px',
                            'height':'600px',
                            'border': '2px solid',
                            'background-color':'#dbdbd5',
                            'border-radius':'30px',
                            'left': '',
                            //'right': '5px',
                            'bottom': '5px',
                            'position':'sticky',
                            'z-index':'20',
                            'overflow':'overlay'
                        });
                        $('#galiRewTitle').css({
                            'width':'100%',
                            'height':'30px',
                            'background-color':'rgb(97 98 86)',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'red',
                            'font-size':'20px',
                            'text-align':'center',
                            'cursor':'pointer',
                            'border-bottom':'2px solid black'
                        });
                        $('#galiRewCont').css({
                            'width':'100%',
                            'height':'570px',
                            'background-color':'#dda62a',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'overflow':'hidden'
                        });
                        $('#gRewLeft').css({
                            'width':'55%',
                            'height':'570px',
                            'background-color':'',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'float':'left'
                        });
                        $('#gRewRight').css({
                            'width':'45%',
                            'min-height':'570px',
                            'max-height':'570px',
                            'background-color':'',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'float':'left',
                            'overflow-y':'scroll',
                            'border': '2px black solid'

                        });
                        $('#gRewL1').css({
                            'width':'100%',
                            'min-height':'60px',
                            'background-color':'',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'float':'left',
                            'display':'flex',
                            'flex-direction': 'row',
                            'align-items': 'center',
                            'justify-content': 'space-evenly',
                        });
                        $('#gRewL2').css({
                            'width':'100%',
                            'min-height':'200px',
                            'background-color':'',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'float':'left',
                            'display':'flex',
                            'flex-direction': 'row',
                            'justify-content': 'space-evenly',
                            'flex-wrap': 'wrap',
                            'align-content': 'stretch',
                            'align-items': 'center',
                        });
                        $('#gRewL3').css({
                            'width':'100%',
                            'min-height':'60px',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'float':'left',
                            'display':'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                        });
                        $('#gRewL4').css({
                            'width':'100%',
                            'min-height':'240px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'20px',
                            'text-align':'center',
                            'float':'left',
                        });
                        $('.gRewReq').css({
                            'width':'fit-content',
                            'height':'30px',
                            'background-color':'#f15454',
                            'padding': '5px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'16px',
                            'text-align':'center',
                            'border' : '2px solid black',
                            'cursor' : 'pointer'
                        });
                        $('.item-row').css({
                            'width':'100%',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'color':'black',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'display': 'flex',
                            'align-items': 'center',
                            'cursor':'pointer'
                        });
                        $('.item-mrow').css({
                            'background-color':'rgb(97 98 86)',
                            'position':'sticky',
                            'top': '0',
                            'color':'#e7e5da',
                            'font-weight': 'bold',
                        });
                        $('.item-r1').css({
                            'width':'30px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                        });
                        $('.item-r2').css({
                            'width':'145px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                            'overflow': 'hidden',
                        });
                        $('.item-r3').css({
                            'width':'145px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                        });
                        $('.gir1').css({
                            'background-color':'#ad9730',
                        });
                        $('.gir2').css({
                            'background-color':'#d1b011',
                        });
                        $('.item-ir1').css({
                            'width':'30px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                        });
                        $('.item-ir2').css({
                            'width':'30px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                        });
                        $('.item-ir3').css({
                            'width':'100px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                            'overflow': 'hidden',
                        });
                        $('.item-ir4').css({
                            'width':'145px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                        });
                        $('.item-ir5').css({
                            'width':'115px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                        });
                    },
                    build_desc_rewards: function(){
                        $('#gRWin').html("Winner");
                        $('#gRLose').html("Loser");
                        $('#gRWinLose').html("Win/Lose");
                        const tabw = Object.values(IG_Gali.t);
                        for(var i=0; i < tabw.length; i++){
                            $(".gRewReq.wid-"+tabw[i]["wid"]).html(tabw[i]["name"])
                        }
                        const itab = IG_Gali.item_list;
                        for(var i=0; i < itab.length; i++){
                            if(i == 0){
                                $(".item-mr1").html("W");
                                $(".item-mr2").html("Item");
                                $(".item-mr3").html("Wymagania");
                            }else{
                                $(".item-r1.pos-"+i).html(itab[i]["value"]);
                                $(".item-r2.pos-"+i).html(itab[i]["name"]);
                                $(".item-r3.pos-"+i).html(itab[i]["req"]);
                            }
                        }
                        $(".item-imr1").html(" ");
                        $(".item-imr2").html("W");
                        $(".item-imr3").html("ID")
                        $(".item-imr4").html("Item")
                        $(".item-imr5").html("Wymagania")
                    },
                    reward_req_world: function(element, wid, fortid, name){
                        if($(element).hasClass("galiActive")){
                            $(element).removeClass("galiActive");
                            $(element).css({'background-color':'#f15454'});
                            delete IG_Gali.rew_world_tab[name];

                        }else{
                            $(element).addClass("galiActive");
                            $(element).css({'background-color':'#60ed1a'});
                            IG_Gali.rew_world_tab[name] = {"wid" : wid, "fortid" : fortid};
                        }
                    },
                    reward_req: function(element,val){
                        IG_Gali.rew_req_tab.winner = false;
                        IG_Gali.rew_req_tab.loser = false;
                        if($(element).hasClass("galiActive")){
                            $("#gRWin").removeClass("galiActive");
                            $("#gRLose").removeClass("galiActive");
                            $("#gRWinLose").removeClass("galiActive");
                            $("#gRWin").css({'background-color':'#f15454'});
                            $("#gRLose").css({'background-color':'#f15454'});
                            $("#gRWinLose").css({'background-color':'#f15454'});
                            $(element).removeClass("galiActive");
                            $(element).css({'background-color':'#f15454',});
                        }else{
                            $("#gRWin").removeClass("galiActive");
                            $("#gRLose").removeClass("galiActive");
                            $("#gRWinLose").removeClass("galiActive");
                            $("#gRWin").css({'background-color':'#f15454'});
                            $("#gRLose").css({'background-color':'#f15454'});
                            $("#gRWinLose").css({'background-color':'#f15454'});
                            $(element).addClass("galiActive");
                            $(element).css({'background-color':'#60ed1a'});
                        }
                        if($("#gRWinLose").hasClass("galiActive")){
                            IG_Gali.rew_req_tab.winner = true;
                            IG_Gali.rew_req_tab.loser = true;
                        }
                        else if($("#gRWin").hasClass("galiActive")){
                            IG_Gali.rew_req_tab.winner = true;
                            IG_Gali.rew_req_tab.loser = false;
                        }
                        else if($("#gRLose").hasClass("galiActive")){
                            IG_Gali.rew_req_tab.winner = false;
                            IG_Gali.rew_req_tab.loser = true;
                        }
                    },
                    rewlist_add_item: function(id,value,name,req){
                        IG_Gali.rew_item_tab.push({"id": id, "value": value,"name": name,"req": req});
                        IG_Gali.rew_loaditems();

                    },
                    rew_add_item: function(){
                        let val = document.getElementById("rewinput");
                        if(!(val.value == "")){
                            IG_Gali.rew_item_tab.push({"id": val.value, "value": "?","name": "Brak","req": "Brak"});
                            val.value = "";
                            IG_Gali.rew_loaditems();
                        }
                    },
                    rew_loaditems: function(){
                        let itemtab = IG_Gali.rew_item_tab;
                        $(".ridiv").html("");
                        for(var i = 0; i < itemtab.length; i++){
                            let irow = document.createElement("div");
                            if(i%2){
                                irow.setAttribute("class","item-irow gir2");
                            }else{
                                irow.setAttribute("class","item-irow gir1");
                            }
                            let ir1 = document.createElement("div");
                            ir1.setAttribute("class","item-ir1");
                            ir1.setAttribute("onclick","IG_Gali.rew_delete_item("+i+")");
                            $(ir1).css("color","red");
                            let ir2 = document.createElement("div");
                            ir2.setAttribute("class","item-ir2");
                            let ir3 = document.createElement("div");
                            ir3.setAttribute("class","item-ir3");
                            let ir4 = document.createElement("div");
                            ir4.setAttribute("class","item-ir4");
                            let ir5 = document.createElement("div");
                            ir5.setAttribute("class","item-ir5");

                            $(".ridiv").append(irow);
                            irow.appendChild(ir1);
                            irow.appendChild(ir2);
                            irow.appendChild(ir3);
                            irow.appendChild(ir4);
                            irow.appendChild(ir5);

                            ir1.innerHTML = "X";
                            ir2.innerHTML = itemtab[i]["value"];
                            ir3.innerHTML = itemtab[i]["id"];
                            ir4.innerHTML = itemtab[i]["name"];
                            ir5.innerHTML = itemtab[i]["req"];
                        }
                        $('.item-ir1').css({
                            'width':'30px',
                            'min-height':'14px',
                            'box-sizing':'border-box',
                            'font-size':'12px',
                            'margin-bottom':'1px',
                            'padding-left': '1px',
                            });
                            $('.item-ir2').css({
                                'width':'30px',
                                'min-height':'14px',
                                'box-sizing':'border-box',
                                'font-size':'12px',
                                'margin-bottom':'1px',
                                'padding-left': '1px',
                            });
                            $('.item-ir3').css({
                                'width':'100px',
                                'min-height':'14px',
                                'box-sizing':'border-box',
                                'font-size':'12px',
                                'margin-bottom':'1px',
                                'padding-left': '1px',
                                'overflow': 'hidden',
                            });
                            $('.item-ir4').css({
                                'width':'145px',
                                'min-height':'14px',
                                'box-sizing':'border-box',
                                'font-size':'12px',
                                'margin-bottom':'1px',
                                'padding-left': '1px',
                            });
                            $('.item-ir5').css({
                                'width':'115px',
                                'min-height':'14px',
                                'box-sizing':'border-box',
                                'font-size':'12px',
                                'margin-bottom':'1px',
                                'padding-left': '1px',
                            });
                            $('.item-irow').css({
                                'width':'100%',
                                'min-height':'14px',
                                'box-sizing':'border-box',
                                'color':'black',
                                'font-size':'12px',
                                'margin-bottom':'1px',
                                'display': 'flex',
                                'align-items': 'center',
                                'cursor':'pointer'
                            });
                            $('.gir1').css({
                                'background-color':'#ad9730',
                            });
                            $('.gir2').css({
                                'background-color':'#d1b011',
                            });

                    },
                    rew_delete_item: function(index){
                        let itemtab = IG_Gali.rew_item_tab;
                        itemtab.splice(index,1);
                        IG_Gali.rew_loaditems();
                    },
                    rew_start: function(){
                        $("#btnrewstart").attr("disabled","true");
                        const tabw = Object.values(IG_Gali.t);
                        const tabreq = IG_Gali.rew_req_tab;
                        const tabworld = IG_Gali.rew_world_tab;
                        const tabitems = IG_Gali.rew_item_tab;
                        let avaworlds = [];
                        let request = [];
                        for(var i=0; i < tabw.length; i++){
                            if($("#fort_battle_start_"+tabw[i]['fortid']+"_"+tabw[i]["wid"]).length && tabworld[tabw[i]["name"]]){
                                avaworlds.push(tabw[i]["wid"]);
                            }
                        }
                        for(var i = 0; i < avaworlds.length; i++){
                            if(tabreq.winner){
                                for(var j = 0; j < tabitems.length; j++){
                                    let post = "?screen=fort_battle_list&mode=view_battle&world_id="+avaworlds[i]+"&fort_id="+IG_Gali.t[avaworlds[i]]["fortid"]+"&action=add_reward";
                                    let formData = {reward_name:"QuestRewardItem",applies_to:"winner",'QuestRewardItem-item': tabitems[j]["id"],'QuestRewardItem-autoActivate': '',csrf_token: Cookies.get('csrf_token')};
                                    request.push({"post": post, "data": formData});
                                }
                            }
                            if(tabreq.loser){
                                for(var j = 0; j < tabitems.length; j++){
                                    let post = "?screen=fort_battle_list&mode=view_battle&world_id="+avaworlds[i]+"&fort_id="+IG_Gali.t[avaworlds[i]]["fortid"]+"&action=add_reward";
                                    let formData = {reward_name:"QuestRewardItem",applies_to:"loser",'QuestRewardItem-item': tabitems[j]["id"],'QuestRewardItem-autoActivate': '',csrf_token: Cookies.get('csrf_token')};
                                    request.push({"post": post, "data": formData});
                                }
                            }
                        }
                        console.log(request);
                        if(request.length){
                            let reqfr = 1100;
                            IG_Gali.max_count = request.length;
                            IG_Gali.rew_title_update();

                            for(var i = 0; i < request.length; i++){
                                IG_Gali.rew_setTimeout(request[i]["post"], request[i]["data"], reqfr);
                                reqfr = reqfr +1100;
                            }
                            $(".galiActive").each(function(index,element){
                                $(element).removeClass("galiActive");
                                $(element).css("background-color",'rgb(241, 84, 84)');
                            });
                            IG_Gali.rew_item_tab = [];
                            IG_Gali.rew_req_tab.winner = false;
                            IG_Gali.rew_req_tab.loser = false;
                            IG_Gali.rew_world_tab = {};
                            IG_Gali.rew_loaditems();
                        }
                    },
                    rew_setTimeout: function(p, d, dl){
                                    $.post(p,d,
                                        function(data, textStatus, jqXHR)
                                        {
                                            let dt = $(data).find("form[name='add-reward']").find('.vis tbody');
                                            let searchParams = new URLSearchParams($(data).find("form[name='add-reward']").attr('action'));
                                            let wid = searchParams.get('world_id');
                                            let fortid = searchParams.get('fort_id');
                                            if(dt.length == 0){
                                                $('.g4.wid-'+wid).html("");
                                                $('.g5.wid-'+wid).html("");
                                            }else{
                                                $('.g4.wid-'+wid).html("");
                                                $('.g5.wid-'+wid).html("");
                                                $(dt).children().each(function(index,element){
                                                    if(index != 0){
                                                        var a = $(element).find("td").eq(0).text().replace(/\r?\n|\t|\r/g, "");
                                                        var b = $(element).find("td").eq(1).text().replace(/\r?\n|\t|\r/g, "");
                                                        var c = $(element).find("td").eq(2).find('a').attr("href");
                                                        if(a == "winner"){
                                                            let gmr1 = document.createElement("div");
                                                            gmr1.setAttribute("class","gmr1 wid-"+wid+" gitem_"+index);
                                                            let gm1 = document.createElement("div");
                                                            gm1.setAttribute("onclick", 'IG_Gali.delete_item("'+c+'",'+wid+','+fortid+')');
                                                            gm1.setAttribute("class","gm1 wid-"+wid+" gitem_"+index);
                                                            let gm2 = document.createElement("div");
                                                            gm2.setAttribute("class","gm2 wid-"+wid+" gitem_"+index);
                                                            $(".g4.wid-"+wid).append(gmr1);
                                                            gmr1.append(gm1);
                                                            gmr1.append(gm2);
                                                            $(".gm1.wid-"+wid+".gitem_"+index).html("x");
                                                            $(".gm2.wid-"+wid+".gitem_"+index).html(b);
                                                        }else{
                                                            let gmr1 = document.createElement("div");
                                                            gmr1.setAttribute("class","gmr1 wid-"+wid+" gitem_"+index);
                                                            let gm1 = document.createElement("div");
                                                            gm1.setAttribute("onclick", 'IG_Gali.delete_item("'+c+'",'+wid+','+fortid+')');
                                                            gm1.setAttribute("class","gm1 wid-"+wid+" gitem_"+index);
                                                            let gm2 = document.createElement("div");
                                                            gm2.setAttribute("class","gm2 wid-"+wid+" gitem_"+index);
                                                            $(".g5.wid-"+wid).append(gmr1);
                                                            gmr1.append(gm1);
                                                            gmr1.append(gm2);
                                                            $(".gm1.wid-"+wid+".gitem_"+index).html("x");
                                                            $(".gm2.wid-"+wid+".gitem_"+index).html(b);
                                                        }
                                                        IG_Gali.rewards_css();
                                                    }
                                                })
                                            }
                                            IG_Gali.current_count++;
                                            IG_Gali.rew_title_update();
                                            if(IG_Gali.current_count == IG_Gali.max_count){
                                                IG_Gali.current_count = 0;
                                                IG_Gali.max_count = 0;
                                                $("#btnrewstart").removeAttr("disabled");
                                            }
                                        }).fail(function(jqXHR, textStatus, errorThrown)
                                        {
                                            alert(textStatus);
                                    });
                    },
                    rew_item_tab:[

                    ],
                    close_rew: function(){
                        $("#galiRewDiv").css("display","none");
                    },
                    open_rew: function(){
                        if($("#galiRewDiv").length == 0){
                            IG_Gali.init_rewards();
                        }else{
                            $("#galiRewDiv").css("display","block");
                        }
                    },
                    current_count: 0,
                    max_count: 0,
                    rew_title_update: function(){
                        $("#galiRewTitle").html("Dodanych: "+IG_Gali.current_count+"/"+IG_Gali.max_count);
                    },
            }
            IG_Gali.init();
            })();