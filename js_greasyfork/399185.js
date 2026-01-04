// ==UserScript==
// @name         AutoZbieractwo
// @namespace    http://tampermonkey.net/
// @version      1.09
// @description  Auto zbieractwo
// @author       Nienawisc
// @match        https://*.plemiona.pl/game.php?*village=*&screen=place&mode=scavenge*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @run-at      document-idle
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399185/AutoZbieractwo.user.js
// @updateURL https://update.greasyfork.org/scripts/399185/AutoZbieractwo.meta.js
// ==/UserScript==
(function() {
    'use strict';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('.scavenge-option')) {
        observer.disconnect();
                $.cookie.json = true;
        var ciacho = $.cookie("autozbieractwo");
        drawInputs()
        if(ciacho != undefined)if(ciacho.autouzupelnianie==true)obliczPoziomy()
        drawSavedData()

        if(ciacho != undefined)if(ciacho.dziala==true){
            setInterval(working, 3000);
        }
        var timeToNext = getRandomInt(20000,40000);
        updateTime(timeToNext);
        if(TribalWars.getGameData().player.villages == "1")
        {
            setTimeout(() => {location.reload();}, timeToNext);
        }
        else{
            setTimeout(()=>{$(".arrowRight").click()},timeToNext)
        }
    }
}
})();

function updateTime(timeToNext)
{
    var timer = $("#timer");
    if(timer.length ==0){
        timer = $("<div id='timer'>");
        timer.append(`<h3>${timeToNext}</h3>`)
        var screen = $(".scavenge-screen-main-widget")
        screen.append(timer)
    }
    else{
        timer.children("h3").text(timeToNext);
    }
    timeToNext=timeToNext-1000;
    if(timeToNext<=0)timeToNext=0;
    setTimeout(()=>{updateTime(timeToNext)}, 1000);
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function drawInputs(){
        var ciacho = $.cookie("autozbieractwo");
            $.cookie.json = true;
     if(ciacho == undefined){
        $.cookie.json = true;
        $.cookie("autozbieractwo",{lvl:{0:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0},
                                   1:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0},
                                   2:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0},
                                   3:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0}},
                                  dziala:false,
                                  autouzupelnianie:true,
                                  radio: 1,
                                  autouzupelnianieJednostki:{piki:false,miecze:false,topory:false,luki:false,lekka:false,mongoly:false,ciezka:false,rycerz:false},
                                  zelazny:{spear:0,sword:0,axe:0,archer:0,light:0,marcher:0,heavy:0,knight:0},
                                  maksymalny:{spear:0,sword:0,axe:0,archer:0,light:0,marcher:0,heavy:0,knight:0},
                                  zablokowaneWioski:{}})
        ciacho = $.cookie("autozbieractwo");
    }
    var screen = $(".scavenge-screen-main-widget")
    var inputGroup = $("<div>");
    inputGroup.append("<h3>Auto zbieractwo by Nienawisc:</h3>")
    var autoZbieractwo = $('<input id="auto" type="checkbox">')
    if(ciacho.autouzupelnianie==true)autoZbieractwo.prop("checked",true)
    else autoZbieractwo.prop("checked",false)
    autoZbieractwo.change(function(){
        if($(this).is(":checked")){
            ciacho.autouzupelnianie=true;
             $.cookie("autozbieractwo",ciacho,{ expires: 700 });
        }
        else{
            ciacho.autouzupelnianie=false;
             $.cookie("autozbieractwo",ciacho,{ expires: 700 });
        }
    })
    var wioskaWylaczona = $('<input id="wioskaWylaczona" type="checkbox">')
    if(CheckVillage())wioskaWylaczona.prop("checked",true)
    else wioskaWylaczona.prop("checked",false)
    wioskaWylaczona.change(function(){
        if($(this).is(":checked")){
            zablokujWioske(true);
        }
        else{
            zablokujWioske(false);
        }
    })
    inputGroup.append(autoZbieractwo)
    inputGroup.append('<label>Automatycznie przydzielaj jednostki?</label>')
    inputGroup.append(wioskaWylaczona)
    inputGroup.append('<label>Wioska zablokowana?</label>')

    var selectAutoDiv = $("<div>");
    var radio1 = $('<input type="radio" name="radio" value="1">')
    var radio2 = $('<input type="radio" name="radio" value="2">')
    selectAutoDiv.append(radio1);
    selectAutoDiv.append("<label for=r1>Dziel po równo</label>");
    selectAutoDiv.append(radio2);
    selectAutoDiv.append("<label for=r1>Wszystko w najwyższy poziom</label>");
    radio1.change(function() {
           ciacho.radio=this.value;
           $.cookie("autozbieractwo",ciacho,{ expires: 700 });
           obliczPoziomy()
    });
    radio2.change(function() {
           ciacho.radio=this.value;
           $.cookie("autozbieractwo",ciacho,{ expires: 700 });
           obliczPoziomy()
    });
    if(ciacho.radio==1)radio1.prop("checked","true");
    if(ciacho.radio==2)radio2.prop("checked","true");
    inputGroup.append(selectAutoDiv);


    var copy =$(".candidate-squad-widget").clone();
    copy.find("a").click(function(e){
        e.preventDefault()
        $(this).parent().find("input").val($(this).text().replace("(","").replace(")",""))
        $(this).parent().find("input").change();
    })
    copy.find("input").addClass("input-autoZbieractwo").change(function(){
        var ileSurkow = 0;
        copy.find("input").each(function()
                                {
            if($(this).val()!=""){
                ileSurkow += $(this).val()*ScavengeScreen.loot_calculator.default_unit_stats[$(this).attr('name')].carry;
            }
        })
        copy.find(".carry-max").text(ileSurkow)
    })

    inputGroup.append(copy)
    var button = $('<button class="btn levelTemp">');
    button.click(function(){
        ciacho = $.cookie("autozbieractwo");
        var ktore = $(this).attr("lvl");
        if(copy.find('input[name="spear"]').val()!="")ciacho.lvl[ktore].piki = copy.find('input[name="spear"]').val();
        else ciacho.lvl[ktore].piki = 0;
        if(copy.find('input[name="sword"]').val()!="")ciacho.lvl[ktore].miecze = copy.find('input[name="sword"]').val();
        else ciacho.lvl[ktore].miecze =0;
        if(copy.find('input[name="axe"]').val()!="")ciacho.lvl[ktore].topory = copy.find('input[name="axe"]').val();
         else ciacho.lvl[ktore].topory =0;
        if(copy.find('input[name="archer"]').val()!="")ciacho.lvl[ktore].luki = copy.find('input[name="archer"]').val();
         else ciacho.lvl[ktore].luki =0;
        if(copy.find('input[name="light"]').val()!="")ciacho.lvl[ktore].lekka = copy.find('input[name="light"]').val();
         else ciacho.lvl[ktore].lekka =0;
        if(copy.find('input[name="marcher"]').val()!="")ciacho.lvl[ktore].mongoly = copy.find('input[name="marcher"]').val();
         else ciacho.lvl[ktore].mongoly =0;
        if(copy.find('input[name="heavy"]').val()!="")ciacho.lvl[ktore].ciezka = copy.find('input[name="heavy"]').val();
         else ciacho.lvl[ktore].ciezka =0;
        if(copy.find('input[name="knight"]').val()!="")ciacho.lvl[ktore].rycerz = copy.find('input[name="knight"]').val();
         else ciacho.lvl[ktore].rycerz =0;
        $.cookie("autozbieractwo",ciacho,{ expires: 700 });
        location.reload();
    })
    button.attr("lvl",0).text("Zapisz lvl 1");
    inputGroup.append(button);
    inputGroup.append(button.clone(true,true).attr("lvl",1).text("Zapisz lvl 2"));
    inputGroup.append(button.clone(true,true).attr("lvl",2).text("Zapisz lvl 3"));
    inputGroup.append(button.clone(true,true).attr("lvl",3).text("Zapisz lvl 4"));

    var autouzupelnianie = $("<div>");
    autouzupelnianie.append('<h3 style="margin-top:10px">Autouzupełnianie wszystkimi wojskami danego typu:</h3>')
        autouzupelnianie.append('<span class="piki" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_spear.png" title="Pikinier"><input class="autoZbieractwoAutouzupelnianie" name2="spear" name="piki" type="checkbox"/></span>')
        autouzupelnianie.append('<span class="miecze" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_sword.png" title="Miecznik"><input class="autoZbieractwoAutouzupelnianie" name2="sword" name="miecze" type="checkbox"/></span>')
        autouzupelnianie.append('<span class="topory" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_axe.png" title="Topornik"><strong><input class="autoZbieractwoAutouzupelnianie" name2="axe" name="topory" type="checkbox"/></span>')
        autouzupelnianie.append('<span class="luki" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_archer.png" title="Łucznik"><strong><input class="autoZbieractwoAutouzupelnianie" name2="archer" name="luki" type="checkbox"/></span>')
        autouzupelnianie.append('<span class="lekka" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_light.png" title="Lekki kawalerzysta"><input class="autoZbieractwoAutouzupelnianie" name2="light" name="lekka" type="checkbox"/></span>')
        autouzupelnianie.append('<span class="mongoly" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_marcher.png" title="Łucznik na koniu"><input class="autoZbieractwoAutouzupelnianie" name2="marcher" name="mongoly" type="checkbox"/></span>')
        autouzupelnianie.append('<span class="ciezka" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta"><input class="autoZbieractwoAutouzupelnianie" name2="heavy" name="ciezka" type="checkbox"/></span>')
        autouzupelnianie.append('<span class="rycerz" style="color:red;"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_knight.png" title="Rycerz"><input class="autoZbieractwoAutouzupelnianie" name2="knight" name="rycerz" type="checkbox"/></span>')

$.each(ciacho.autouzupelnianieJednostki,function(i,v){
    if(v)autouzupelnianie.find('.autoZbieractwoAutouzupelnianie[name="'+i+'"]').prop('checked',true)
})

    autouzupelnianie.find(".autoZbieractwoAutouzupelnianie").change(function(){
        var ciacho = $.cookie("autozbieractwo");
        ciacho.autouzupelnianieJednostki[$(this).attr("name")]= $(this).is(":checked")
         $.cookie("autozbieractwo",ciacho,{ expires: 700 });
        obliczPoziomy()
        drawSavedData()
    })

    inputGroup.append(autouzupelnianie)

         var copyZelazny =$(".candidate-squad-widget").clone();
    copyZelazny.find("a").click(function(e){
        e.preventDefault()
        $(this).parent().find("input").val($(this).text().replace("(","").replace(")",""))
        $(this).parent().find("input").change();
    })
    copyZelazny.find("td").last().remove();
        copyZelazny.find("td").last().remove();
        copyZelazny.find("th").last().remove();
        copyZelazny.find("th").last().remove();
    copyZelazny.find("th").css("width","14%")
    copyZelazny.find("input").addClass("input-autoZbieractwo-zelazny").change(function(){
        ciacho.zelazny[$(this).attr('name')] = $(this).val();
        $.cookie("autozbieractwo",ciacho,{ expires: 700 });
    })
     $.each(ciacho.zelazny,function(index, value){
         copyZelazny.find('.input-autoZbieractwo-zelazny[name="'+index+'"]').val(parseInt(value))
    })
    inputGroup.append("<h3>Żelazny:</h3>")

    inputGroup.append(copyZelazny)

    var MaxJednostek =$(".candidate-squad-widget").clone();
    MaxJednostek.find("a").click(function(e){
        e.preventDefault()
        $(this).parent().find("input").val($(this).text().replace("(","").replace(")",""))
        $(this).parent().find("input").change();
    })
    MaxJednostek.find("td").last().remove();
        MaxJednostek.find("td").last().remove();
        MaxJednostek.find("th").last().remove();
        MaxJednostek.find("th").last().remove();
    MaxJednostek.find("th").css("width","14%")
    MaxJednostek.find("input").addClass("input-autoZbieractwo-maksymalny").change(function(){
        ciacho.maksymalny[$(this).attr('name')] = $(this).val();
        $.cookie("autozbieractwo",ciacho,{ expires: 700 });
    })
     $.each(ciacho.maksymalny,function(index, value){
         MaxJednostek.find('.input-autoZbieractwo-maksymalny[name="'+index+'"]').val(parseInt(value))
    })
    inputGroup.append("<h3>Maksymalnie jednostek na zbieractwo:</h3>")

    inputGroup.append(MaxJednostek)

    var div = $('<div style="margin-top:15px;">')
    var start = $('<button class="btn" id="zbieractwo">')
        $.cookie.json = true;
    start.click(function(){
            $.cookie.json = true;
        ciacho = $.cookie("autozbieractwo");

        if(ciacho.dziala==false){
            ciacho.dziala=true;
            start.text("Stop")
        }
        else{
            ciacho.dziala=false;
            start.text("Start")
        }
        $.cookie("autozbieractwo",ciacho,{ expires: 700 });
        location.reload();
    })

    ciacho = $.cookie("autozbieractwo");
    if(ciacho.dziala==false) start.text("Start")
    else start.text("Stop")
    div.append(start);
    inputGroup.append(div)
    screen.append(inputGroup)
}

function obliczPoziomy(){
    var ciacho = $.cookie("autozbieractwo");
    var ileLadownosci = 0;
    var naNajwyzszy = ciacho.radio == 2;
    var maksymalny = ciacho.maksymalny;
    var zelazny = ciacho.zelazny;
    $.each(ScavengeScreen.village.unit_counts_home,function(index, value){
        try{
            if($('.autoZbieractwoAutouzupelnianie[name2="'+index+'"]').is(":checked"))ileLadownosci += ScavengeScreen.loot_calculator.default_unit_stats[index].carry * value;
        }
        catch(e){}
    })

    //867
    var lvls = [{lup:0.1,procent:0.57670126874,ladownosc:ileLadownosci*0.5767},//500 : 50
                {lup:0.25,procent:0.23068050749,ladownosc:ileLadownosci*0.2306},//200 : 50
                {lup:0.5,procent:0.11534025374,ladownosc:ileLadownosci*0.11534},//100 : 50
                {lup:0.75,procent:0.07727797001,ladownosc:ileLadownosci*0.07727797} //67: ~50
               ];
    //ktore lvly mamy odblokowane i zaktualzowanie procentow oraz ladownosci
    var ileMamy = 3 - $(".locked-view").length
    for(var i = 3;i>ileMamy;i--){
        var a = 0
        for(var j = 0;j<i;j++)a += 1/(lvls[j].lup*10)
        a = lvls[i].procent/a;
        for(var j = 0;j<=i-1;j++){
             lvls[j].procent += a/(lvls[j].lup*10)
             lvls[j].ladownosc = ileLadownosci * lvls[j].procent;
        }
        lvls = lvls.slice(0,i--);
    }
    if(naNajwyzszy){
          for(var i = 0;i<ileMamy;i++){
              lvls[ileMamy].procent+=lvls[i].procent;
              lvls[i].procent = 0;
              lvls[ileMamy].ladownosc+=lvls[i].ladownosc;
              lvls[i].ladownosc = 0;
          }
    }
    var jednostki = { ...ScavengeScreen.village.unit_counts_home };
    $.each(jednostki,function(index, value){
        jednostki[index] -= zelazny[index];
        if(jednostki[index]<0) jednostki[index] = 0;
    });
    $.each(jednostki,function(index, value){
        if(maksymalny[index]<=0)return;
        jednostki[index] = Math.min(maksymalny[index],jednostki[index]);
    });
    var ileZostalo = {"spear":jednostki["spear"],
                      "sword":jednostki["sword"],
                      "axe":jednostki["axe"],
                      "archer":jednostki["archer"],
                      "light":jednostki["light"],
                      "marcher":jednostki["marcher"],
                      "heavy":jednostki["heavy"],
                      "knight":jednostki["knight"]
                     }
    for(var i = 0;i<=ileMamy;i++){
        if($('.autoZbieractwoAutouzupelnianie[name="piki"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].piki = Math.round(jednostki["spear"]*lvls[i].procent)
            ileZostalo["spear"] -= Math.round(jednostki["spear"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].piki = ileZostalo["spear"]
            }
        }
        else ciacho.lvl[i].piki = 0
        if($('.autoZbieractwoAutouzupelnianie[name="miecze"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].miecze = Math.round(jednostki["sword"]*lvls[i].procent)
            ileZostalo["sword"] -= Math.round(jednostki["sword"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].miecze = ileZostalo["sword"]
            }
        }
        else ciacho.lvl[i].miecze = 0
        if($('.autoZbieractwoAutouzupelnianie[name="topory"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].topory = Math.round(jednostki["axe"]*lvls[i].procent)
            ileZostalo["axe"] -= Math.round(jednostki["axe"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].topory = ileZostalo["axe"]
            }
        }
        else ciacho.lvl[i].topory = 0
        if($('.autoZbieractwoAutouzupelnianie[name="luki"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].luki = Math.round(jednostki["archer"]*lvls[i].procent)
            ileZostalo["archer"] -= Math.round(jednostki["archer"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].luki = ileZostalo["archer"]
            }
        }
        else ciacho.lvl[i].luki = 0
        if($('.autoZbieractwoAutouzupelnianie[name="lekka"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].lekka = Math.round(jednostki["light"]*lvls[i].procent)
            ileZostalo["light"] -= Math.round(jednostki["light"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].lekka = ileZostalo["light"]
            }
        }
        else ciacho.lvl[i].lekka = 0
        if($('.autoZbieractwoAutouzupelnianie[name="mongoly"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].mongoly = Math.round(jednostki["marcher"]*lvls[i].procent)
            ileZostalo["marcher"] -= Math.round(jednostki["marcher"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].mongoly = ileZostalo["marcher"]
            }
        }
        else ciacho.lvl[i].mongoly = 0
        if($('.autoZbieractwoAutouzupelnianie[name="ciezka"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].ciezka = Math.round(jednostki["heavy"]*lvls[i].procent)
            ileZostalo["heavy"] -= Math.round(jednostki["heavy"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].ciezka = ileZostalo["heavy"]
            }
        }
        else ciacho.lvl[i].ciezka = 0
        if($('.autoZbieractwoAutouzupelnianie[name="rycerz"]').is(":checked")){
            if(i+1<=ileMamy){
            ciacho.lvl[i].rycerz = Math.round(jednostki["knight"]*lvls[i].procent)
            ileZostalo["knight"] -= Math.round(jednostki["knight"]*lvls[i].procent)
            }
            else{
                ciacho.lvl[i].rycerz = ileZostalo["knight"]
            }
        }
        else ciacho.lvl[i].rycerz = 0
    }
                    $.cookie.json = true;
    $.cookie("autozbieractwo",ciacho,{ expires: 700 });
}

function zablokujWioske(value){
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let village = params.get('village');
    village = village.replace(/\D/g,''); // Usuwa wszystkie znaki inne niż cyfry

    var ciacho = $.cookie("autozbieractwo");
    $.cookie.json = true;
    ciacho.zablokowaneWioski[village] = value;
    $.cookie("autozbieractwo", ciacho, { expires: 7, path: '/' });
}

function CheckVillage(){
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let village = params.get('village');
    village = village.replace(/\D/g,''); // Usuwa wszystkie znaki inne niż cyfry

    var ciacho = $.cookie("autozbieractwo");
    $.cookie.json = true;
    var isVillageBlocked = ciacho.zablokowaneWioski[village];
    return Boolean(isVillageBlocked);
}


function working(){
    if(CheckVillage())return;
   $.cookie.json = true;
    var ciacho = $.cookie("autozbieractwo");
    var portrety = $(".scavenge-option");

    for(var i = 1; i<=4; i++){
        if(ScavengeScreen.village.options[i].is_locked){
            for (var j = i - 1; j < 4; j++) {
            portrety = portrety.not(':eq(' + j + ')');
            }
            break;
        }
    }

    var wykonujRazem = false;
    var wszystkieGotowe = false;
    if(ciacho.autouzupelnianie==true)
    {
        obliczPoziomy();
        drawSavedData();
        wykonujRazem=true;
        if(portrety.find('.return-countdown').length==0)wszystkieGotowe=true;
    }
    if(wykonujRazem){
    if(wszystkieGotowe)doJob();
    }
    else{
        doJob();
    }
}

function doJob(){
    if(CheckVillage())return;
       $.cookie.json = true;
    var ciacho = $.cookie("autozbieractwo");
        var portrety = $(".scavenge-option");
    portrety.each(function()
    {
        var port = $(this);
        var czas = $(this).find(".return-countdown");
        if(czas.length==0){

            if(ciacho != undefined){
                var data = ciacho.lvl[port.find(".port").attr("lvl")];
                if(data.piki + data.miecze + data.topory + data.luki + data.lekka + data.mongoly + data.ciezka + data.rycerz >10){
                $(".candidate-squad-container").find('input[name="spear"]').val(ciacho.lvl[port.find(".port").attr("lvl")].piki).change();
                 $(".candidate-squad-container").find('input[name="sword"]').val(ciacho.lvl[port.find(".port").attr("lvl")].miecze).change();
                 $(".candidate-squad-container").find('input[name="axe"]').val(ciacho.lvl[port.find(".port").attr("lvl")].topory).change();
                 $(".candidate-squad-container").find('input[name="archer"]').val(ciacho.lvl[port.find(".port").attr("lvl")].luki).change();
                 $(".candidate-squad-container").find('input[name="light"]').val(ciacho.lvl[port.find(".port").attr("lvl")].lekka).change();
                 $(".candidate-squad-container").find('input[name="marcher"]').val(ciacho.lvl[port.find(".port").attr("lvl")].mongoly).change();
                 $(".candidate-squad-container").find('input[name="heavy"]').val(ciacho.lvl[port.find(".port").attr("lvl")].ciezka).change();
                 $(".candidate-squad-container").find('input[name="knight"]').val(ciacho.lvl[port.find(".port").attr("lvl")].rycerz).change();
                 $(this).find(".free_send_button").click()
                }
            }
        }
    })
}

function drawSavedData(){
    var portrety = $(".portrait");
    var i=0;
    $.cookie.json = true;
    var ciacho = $.cookie("autozbieractwo");
    if(ciacho == undefined){
                        $.cookie.json = true;
        $.cookie("autozbieractwo",{lvl:{0:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0},
                                   1:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0},
                                   2:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0},
                                   3:{piki:0,miecze:0,topory:0,luki:0,lekka:0,mongoly:0,ciezka:0,rycerz:0}},
                                  dziala:false,
                                  autouzupelnianie:true,
                                  autouzupelnianieJednostki:{piki:false,miecze:false,topory:false,luki:false,lekka:false,mongoly:false,ciezka:false,rycerz:false},
                                  zelazny:{spear:0,sword:0,axe:0,archer:0,light:0,marcher:0,heavy:0,knight:0},
                                  maksymalny:{spear:0,sword:0,axe:0,archer:0,light:0,marcher:0,heavy:0,knight:0},
                                  zablokowaneWioski:{}})
        ciacho = $.cookie("autozbieractwo");
    }
    portrety.each(function()
        {
        var dane = ciacho.lvl[i];
        var data;
        if($(this).find(".port").length==0){
        data = $("<div>")
        data.addClass('port')
        data.attr("lvl",i)
        }
        else{
            data=$(this).find(".port")
            data.html("")
            data.attr("lvl",i)
        }
        data.append('<div class="piki" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_spear.png" title="Pikinier"><strong>'+dane.piki+'</strong></div>')
        data.append('<div class="miecze" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_sword.png" title="Miecznik"><strong>'+dane.miecze+'</strong></div>')
        data.append('<div class="topory" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_axe.png" title="Topornik"><strong>'+dane.topory+'</strong></div>')
        data.append('<div class="luki" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_archer.png" title="Łucznik"><strong>'+dane.luki+'</strong></div>')
        data.append('<div class="lekka" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_light.png" title="Lekki kawalerzysta"><strong>'+dane.lekka+'</strong></div>')
        data.append('<div class="mongoly" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_marcher.png" title="Łucznik na koniu"><strong>'+dane.mongoly+'</strong></div>')
        data.append('<div class="ciezka" style="color:red"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta"><strong>'+dane.ciezka+'</strong></div>')
        data.append('<div class="rycerz" style="color:red;"><img src="https://dspl.innogamescdn.com/asset/d64c3c7/graphic/unit/unit_knight.png" title="Rycerz"><strong>'+dane.rycerz+'</strong></div>')
        $(this).append(data);
        i++;
        })

}