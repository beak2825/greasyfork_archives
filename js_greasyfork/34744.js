// ==UserScript==
// @name         Settings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       yorares
// @match        http*://*.triburile.ro/*
// @include        http*://*.die-staemme.de/*
// @include        http*://*.staemme.ch/*
// @include        http*://*.tribalwars.net/*
// @include        http*://*.tribalwars.nl/*
// @include        http*://*.plemiona.pl/*
// @include        http*://*.tribalwars.se/*
// @include        http*://*.tribalwars.com.br/*
// @include        http*://*.tribos.com.pt/*
// @include        http*://*.divokekmeny.cz/*
// @include        http*://*.bujokjeonjaeng.org/*
// @include        http*://*.triburile.ro/*
// @include        http*://*.voyna-plemyon.ru/*
// @include        http*://*.fyletikesmaxes.gr/*
// @include        http*://*.tribalwars.no.com/*
// @include        http*://*.divoke-kmene.sk/*
// @include        http*://*.klanhaboru.hu/*
// @include        http*://*.tribalwars.dk/*
// @include        http*://*.plemena.net/*
// @include        http*://*.tribals.it/*
// @include        http*://*.klanlar.org/*
// @include        http*://*.guerretribale.fr/*
// @include        http*://*.guerrastribales.es/*
// @include        http*://*.tribalwars.fi/*
// @include        http*://*.tribalwars.ae/*
// @include        http*://*.tribalwars.co.uk/*
// @include        http*://*.vojnaplemen.si/*
// @include        http*://*.genciukarai.lt/*
// @include        http*://*.wartribes.co.il/*
// @include        http*://*.plemena.com.hr/*
// @include        http*://*.perangkaum.net/*
// @include        http*://*.tribalwars.jp/*
// @include        http*://*.tribalwars.bg/*
// @include        http*://*.tribalwars.asia/*
// @include        http*://*.tribalwars.us/*
// @include        http*://*.tribalwarsmasters.net/*
// @include        http*://*.perangkaum.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34744/Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/34744/Settings.meta.js
// ==/UserScript==

jQuery(function($){
    var url = window.location.href;
    var split = url.split(/=|&/);
    var coordonatePlus = url.slice(-8);
    var control = coordonatePlus.slice(0,1);
    var coordonate = coordonatePlus.slice(1,8);
    var coordonateBune = coordonate.replace(";","|");
    var barbArray = JSON.parse(localStorage.getItem("coordonateBarb"));
    var pulei = JSON.parse(localStorage.getItem("pulei"));
    var sabie = JSON.parse(localStorage.getItem("sabie"));
    var topor = JSON.parse(localStorage.getItem("topor"));
    var calut = JSON.parse(localStorage.getItem("calut"));
    var calutArcas = JSON.parse(localStorage.getItem("calutArcas"));
    var calutTare = JSON.parse(localStorage.getItem("calutTare"));
    var sate = JSON.parse(localStorage.getItem("sate"));
    var obiect = {};
    var idSat = split[1];


    function getVillage(){
        obiect = JSON.parse(localStorage.getItem("obiect"));
        var cor = $("#coordonateSat").val();
        obiect[idSat] = [cor,1,3];
        let sate = JSON.parse(localStorage.getItem("sate"));
        let unde = sate.indexOf(url);
        if(unde == -1){
            sate.push(url);
            obiect.modificat = 1;
            localStorage.setItem("obiect", JSON.stringify(obiect));
            localStorage.setItem("sate", JSON.stringify(sate));
        }
    }
    function deleteVillage(){
        let sate = JSON.parse(localStorage.getItem("sate"));
        let unde = sate.indexOf(url);
        if(unde !== -1){sate.splice(unde,1);
                        localStorage.setItem("sate", JSON.stringify(sate));
                       }


    }

    function getUnits(){
        var pulei = parseInt($("#pulei").val());
        localStorage.setItem("pulei", JSON.stringify(pulei));
        var sabie = parseInt($("#sabie").val());
        localStorage.setItem("sabie", JSON.stringify(sabie));
        var topor = parseInt($("#topor").val());
        localStorage.setItem("topor", JSON.stringify(topor));
        var calut = parseInt($("#calut").val());
        localStorage.setItem("calut", JSON.stringify(calut));
        var calutArcas = parseInt($("#calutArcas").val());
        localStorage.setItem("calutArcas", JSON.stringify(calutArcas));
        var calutTare = parseInt($("#calutTare").val());
        localStorage.setItem("calutTare", JSON.stringify(calutTare));
    }
    if(typeof localStorage.getItem("obiect") === 'undefined' || localStorage.getItem("obiect") === null){

        obiect[idSat] = ["coordonate Default"];
        obiect.modificat = 1;
        console.log(obiect);
        localStorage.setItem("obiect", JSON.stringify(obiect));
    }

    if (typeof localStorage.getItem("coordonateBarb") !== 'undefined' && localStorage.getItem("coordonateBarb") !== null){}else{
        let barbArray = [];
        localStorage.setItem("coordonateBarb", JSON.stringify(barbArray));}
    if (typeof localStorage.getItem("sate") !== 'undefined' && localStorage.getItem("sate") !== null){}else{
        let sateArray = [];
        localStorage.setItem("sate", JSON.stringify(sateArray));}
    if(url.slice(0,43) == "https://ro59.triburile.ro/game.php?village=" && url.slice(-13) == "&screen=place"){
        $("body").prepend("<div id='piataCentrala' style=' position: absolute; top: 40%; right: 30%'></div>");
        var unde = sate.indexOf(url);
        if(unde !== -1){
            $("#piataCentrala").append("<input type='button' style=' background-color: white;color: black;border: 2px solid #f44336;' value='Delete' id='deleteSat'>");
        }
        if(unde == -1){
            $("#piataCentrala").append("<br><input type='text' id='coordonateSat' placeholder='Coordonate sat curent'>");
            $("#piataCentrala").append("<input type='button' style=' background-color: white;color: black;border: 2px solid #f44336;' value='Add' id='addSat'>");
        }

        if(sate.indexOf(url) == "-1"){
            $("#piataCentrala").append("<p>Not Added, "+sate.length+" added until naw</p>");}else{$("#piataCentrala").append("<p>Added, "+sate.length+" villages</p>");}
        $("#addSat").click(function(){
            getVillage();
            location.reload();
        });
        $("#deleteSat").click(function(){
            deleteVillage();
            location.reload();

        });
        $("#adaugaCoordonate").click(function(){
            obiect = JSON.parse(localStorage.getItem("obiect"));
            idSat = split[1];
            var cor = $("#coordonateSat").val();
            obiect[idSat] = [cor,1,3];
            // obiect[idSat].splice(0,1,cor);
            localStorage.setItem("obiect", JSON.stringify(obiect));
            console.log(obiect);
            location.reload();

        });
    }
    if (control === "#"){

        $("body").prepend("<div id='botMeu' style=' position: absolute; top: 40%; right: 25%'></div>");

        $("#botMeu").append("<br><img src='https://dsro.innogamescdn.com/8.101/34907/graphic/unit/unit_spear.png'>");
        $("#botMeu").append("<input type='text' style=' width: 50px;' placeholder='rares' id='pulei'>");
        $("#botMeu").append("<img src='https://dsro.innogamescdn.com/8.101/34907/graphic/unit/unit_sword.png'>");
        $("#botMeu").append("<input type='text' style=' width: 50px;' placeholder='este' id='sabie'>");
        $("#botMeu").append("<img src='https://dsro.innogamescdn.com/8.101/34907/graphic/unit/unit_axe.png'>");
        $("#botMeu").append("<input type='text' style=' width: 50px;' placeholder='smecher' id='topor'>");
        $("#botMeu").append("<img src='https://dsro.innogamescdn.com/8.101/34907/graphic/unit/unit_light.png'>");
        $("#botMeu").append("<input type='text' style=' width: 50px;' placeholder='smecher' id='calut'>");
        $("#botMeu").append("<img src='https://dsro.innogamescdn.com/8.104/35234/graphic/unit/unit_marcher.png'>");
        $("#botMeu").append("<input type='text' style=' width: 50px;' placeholder='smecher' id='calutArcas'>");
        $("#botMeu").append("<img src='https://dsro.innogamescdn.com/8.104/35234/graphic/unit/unit_heavy.png'>");
        $("#botMeu").append("<input type='text' style=' width: 50px;' placeholder='smecher' id='calutTare'>");
        $("#botMeu").append("<input type='button' style=' font-size: 16px; background-color: white;color: black;border: 2px solid #f44336;' value='Set Units' id='setUnits'>");
        $("#botMeu").append("<p>Sulite: "+pulei+"; Sabii: "+sabie+"; Topor: "+topor+"; Calut: "+calut+"; MArcher: "+calutArcas+"; Heavy "+calutTare+"</p>");
        $("#botMeu").append("<input type='text' id='distanta' placeholder='distanta maxima de atac'>");
        $("#botMeu").append("<input type='button' id='addDistanta' value='Adauga'>");
        if(barbArray.indexOf(coordonateBune) == "-1"){
            $("#botMeu").append("<p>Not Added, "+barbArray.length+" added until naw</p>");}else{$("#botMeu").append("<p>Added, "+barbArray.length+" villages</p>");}
        $("#botMeu").append("<input type='button' style=' background-color: white;color: black;border: 2px solid #f44336;' value='Delete' id='Delete'>");
        $("#botMeu").append("<input type='button' style=' background-color: white;color: black;border: 2px solid #f44336;' value='Add' id='Add'>");
        $("#Delete").click(function(){
            var indexN = barbArray.indexOf(coordonateBune);
            if(indexN !== -1){barbArray.splice(indexN,1);
                              localStorage.setItem("coordonateBarb", JSON.stringify(barbArray));
                              var obiect = JSON.parse(localStorage.getItem("obiect"));
                              obiect.modificat = 1;
                              localStorage.setItem("obiect", JSON.stringify(obiect));
                              localStorage.setItem("lastBarb", JSON.stringify(indexN));
                              location.reload();
                             }
        });
        $("#Add").click(function(){
            barbArray.push(coordonateBune);
            localStorage.setItem("coordonateBarb", JSON.stringify(barbArray));
            var obiect = JSON.parse(localStorage.getItem("obiect"));
            obiect.modificat = 1;
            console.log(obiect.modificat);
            localStorage.setItem("obiect", JSON.stringify(obiect));
            console.log(obiect);
            location.reload();
        });

        $("#setUnits").hover(function(){
            $(this).css("background-color", "red");
            $(this).css("color", "white");
        }, function(){
            $(this).css("background-color", "white");
            $(this).css("color", "red");
        });
        $("#setUnits").click(function(){
            getUnits();
            location.reload();
        });
        $("#addDistanta").click(function(){
            obiect = JSON.parse(localStorage.getItem("obiect"));
            let distanta = parseInt($("#distanta").val());
            obiect.distanta = distanta;
            console.log(obiect);
            localStorage.setItem("obiect", JSON.stringify(obiect));
            location.reload();
        });

    }
});