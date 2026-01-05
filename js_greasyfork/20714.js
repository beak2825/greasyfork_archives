// ==UserScript==
// @name         Charazay training extension
// @namespace    http://charazay.com/
// @version      0.1
// @locale       en-US
// @description  try to take over the world!
// @author       Lewy (adjusted to the new design from AlbaCats)
// @include      http://*charazay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20714/Charazay%20training%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/20714/Charazay%20training%20extension.meta.js
// ==/UserScript==




(function() {
    'use strict';



    var slownik = [];

    /*slownik["pl"]["Obrona"] = "Obrona";
slownik["pl"]["Rzuty Wolne"] = "Rzuty Wolne";
slownik["pl"]["Rzut za 2"] = "Rzut za 2";
slownik["pl"]["Rzut za 3"] = "Rzut za 3";
slownik["pl"]["Drybling"] = "Drybling";
slownik["pl"]["Podanie"] = "Podanie";
slownik["pl"]["Szybkość"] = "Szybkość";
slownik["pl"]["Praca Nóg"] = "Praca Nóg";
slownik["pl"]["Zbiórki"] = "Zbiórki";*/

    /*slownik["en"]["Obrona"] = "Defence";
slownik["en"]["Rzuty Wolne"] = "Free Throws";
slownik["en"]["Rzut za 2"] = "Two Point";
slownik["en"]["Rzut za 3"] = "Three Point";
slownik["en"]["Drybling"] = "Dribbling";
slownik["en"]["Podanie"] = "Passing";
slownik["en"]["Szybkość"] = "Speed";
slownik["en"]["Praca Nóg"] = "Footwork";
slownik["en"]["Zbiórki"] = "Rebounds";*/

    slownik["pl"] = [];
    slownik["pl"]["Plan Treningowy"] = "Plan Treningowy";
    slownik["pl"]["Plany treningowe"] = "Plany treningowe";
    slownik["pl"]["Rodzaj treningu"] = "Rodzaj treningu";
    slownik["pl"]["Umiejetność trenera"] = "Umiejetność trenera";
    slownik["pl"]["Długość treningu"] = "Długość treningu";
    slownik["pl"]["Usuń"] = "Usuń";
    slownik["pl"]["Dodaj"] = "Dodaj";
    slownik["pl"]["Zapisz"] = "Zapisz";
    slownik["pl"]["Wyczyść"] = "Wyczyść";
    slownik["pl"]["Podaj umiejętność trenera"] = "Podaj umiejętność trenera";
    slownik["pl"]["to nie jest liczba z przedziału"] = "to nie jest liczba z przedziału";

    slownik["en"] = [];
    slownik["en"]["Plan Treningowy"] = "Training Plan";
    slownik["en"]["Plany treningowe"] = "Training Plans";
    slownik["en"]["Rodzaj treningu"] = "Training";
    slownik["en"]["Umiejetność trenera"] = "Coach Skill";
    slownik["en"]["Długość treningu"] = "Number of trainings";
    slownik["en"]["Usuń"] = "Remove";
    slownik["en"]["Dodaj"] = "Add";
    slownik["en"]["Zapisz"] = "Save";
    slownik["en"]["Wyczyść"] = "Clear";
    slownik["en"]["Podaj umiejętność trenera"] = "Enter your Coach Skill";
    slownik["en"]["to nie jest liczba z przedziału"] = "it's not a number from range";

    slownik["fr"] = [];
    slownik["fr"]["Plan Treningowy"] = "Entraînement";//"Plan d'entraînement"; // or Plan de formation
    slownik["fr"]["Plany treningowe"] = "Plan d'entraînement"; //Similar to the first...
    slownik["fr"]["Rodzaj treningu"] = "Entraînement"; // or Formation
    slownik["fr"]["Umiejetność trenera"] = "Carac. du coach"; //CBM: Caractéristique entraîneur; Carac. du coach (It's too long otherwise), caractéristiques du coach
    slownik["fr"]["Długość treningu"] = "Nombre d'entraînement";
    slownik["fr"]["Usuń"] = "Effacer";
    slownik["fr"]["Dodaj"] = "Ajouter";
    slownik["fr"]["Zapisz"] = "Sauvegarder";
    slownik["fr"]["Wyczyść"] = "Retour";
    slownik["fr"]["Podaj umiejętność trenera"] = "Entrer les caractéristiques du coach";
    slownik["fr"]["to nie jest liczba z przedziału"] = "Le numéro doit être compris entre"; // DO PRZETLUMACZENIA	



    var nazwyskili = [];
    nazwyskili["pl"] = ["Obrona", "Rzuty Wolne", "Rzut za 2", "Rzut za 3", "Drybling", "Podanie", "Szybkość", "Praca Nóg", "Zbiórki"];
    nazwyskili["en"] = ["Defence", "Free Throws", "Two Point", "Three Point", "Dribbling", "Passing", "Speed", "Footwork", "Rebounds"];
    nazwyskili["fr"] = ["Défense", "Lancers francs", "2 points", "3 points", "Dribble", "Passe", "Vitesse", "Jeu de jambes", "Rebonds"];

    var language = "en";
    var ciastka = document.cookie.split(/; /g);
    for(var i = 0; i < ciastka.length; i++){
        var ciastko = ciastka[i];
        if(ciastko.indexOf("=") == -1)
            continue;
        var nazwa = ciastko.substring(0, ciastko.indexOf("="));
        if(nazwa == "language"){
            var jezyk = ciastko.substring(ciastko.indexOf("=") + 1);
            if(jezyk == "pl") language = "pl";
            else if(jezyk == "fr") language = "fr";
            break;
        }	
    }

    var X= [  0.1580,
            0.1578,
            0.1575,
            0.1425,
            0.1400,
            0.1350,
            0.1320,
            0.1180,
            0.1150,
            0.1000,
            0.0900,
            0.0860,
            0.0830,
            0.0700,
            0.0660,
            0.0500,
            0.0450];

    var skills =[0]; //stala
    var skillstd =[];
    var trenerskills = [0,0,0,0,0,0,0,0,0];
    var wiek; //stala
    var wiektd;
    var sezon; //stala
    var tydzien; //stala
    var dzien; //stala
    var S; //zmienne, uzywane przy planach
    var T;

    function extraTrening(co){

        if(trenerskills[co] == 0 && sezon == S && tydzien == T){
            var skilt = window.prompt(slownik[language]["Podaj umiejętność trenera"] + ": ", "30");
            if(skilt){
                var skilint = parseInt(skilt);
                if(isNaN(skilint) || skilint <1 || skilint > 30){
                    window.alert(skilt + " - " + slownik[language]["to nie jest liczba z przedziału"] + " 1 - 30");
                }
                else{
                    trenerskills[co] = skilint;
                }
            }

        }
        if(trenerskills[co] != 0){

            if(skills[0] == 0  || skillstd === "undefined" || skillstd.length===0 || wiektd === "undefined"){
                inicjalizuj();
            }
            if(sezon == S && tydzien == T){
                var skil = skills[co];
                var x = (wiek - 15) >= X.length ? 0 : X[wiek-15];
                var iledodac = x*(1 +(trenerskills[co] > Math.floor(skil) ? trenerskills[co] - Math.floor(skil) : 0) *0.03 );
                if(Math.floor(skil + iledodac) == Math.floor(skil)){
                    skills[co] += iledodac;
                    skillstd[co].innerHTML = parseInt(skills[co]*100)/100;
                    aktualizujGSy();
                }
            }
        }
    }

    function wyczysc(){
        if(skills[0] != 0){
            for(var i= 0; i< skills.length; i++){
                skillstd[i].innerHTML = parseInt(skills[i]*100)/100;
            }
            wiektd.innerHTML =wiek;
            S = sezon;
            T = tydzien;
            aktualizujGSy();
        }
    }

    function inicjalizuj(){
        var tablica = document.getElementById("mc").getElementsByClassName("mc-ls")[0].getElementsByTagName("table")[1];
        var td = tablica.getElementsByTagName("td");
        var indeks = 9;
        var i;
        for(i = td.length-1; indeks >= 0; i-= 2, indeks--){
            skills[indeks] = parseInt(td[i].innerHTML);
            skillstd[indeks] = td[i];
            i -= 3;
            indeks -= 1;
            skills[indeks] = parseInt(td[i].innerHTML);
            skillstd[indeks] = td[i];
        }
        wiek = parseInt(td[i-14].innerHTML);
        wiektd = td[i-14];

        var infoblocks = document.getElementsByTagName("footer")[0].getElementsByClassName("menufooter")[0];
        var tekst = infoblocks.getElementsByTagName("p")[0].innerHTML;
        var indexOf = tekst.indexOf("</span>");
        tekst = tekst.substring(indexOf+7, tekst.length).trim();
        var dane = tekst.split(",");
        sezon = parseInt(dane[0].substring(dane[0].lastIndexOf(" ")+1));
        tydzien = parseInt(dane[1].substring(dane[1].lastIndexOf(" ")+1));
        dzien = parseInt(dane[2].substring(dane[2].lastIndexOf(" ")+1));
        S = sezon;
        T = tydzien;
    }

    function klikPlan(nazwa){
        if(skills[0] == 0  || skillstd === "undefined" || skillstd.length===0 || wiektd === "undefined"){
            inicjalizuj();
        }
        //////////////////////kierwa//////////////////////////////
        /*if(tydzien == 17 && dzien == 7 && parseInt(wiektd.innerHTML) == wiek){ //jezeli jest ostatni dzien tygodnia
if(!czybylopytanie){ //jezeli uzytkownik nie byl jeszcze pytany o to, czy bylo dorastanie
var odp = window.confirm("Dziś jest ostatni dzień sezonu. Czy dorastanie już się odbyło? Błędna odpowiedź spowoduje, że obliczenia będą niepoprawne.");
czybylodorastanie = odp;
czybylopytanie = true;
if(czybylodorastanie){
wiektd.innerHTML = wiek-1;
}
}
}*/


        var pos = document.cookie.indexOf("plan=");
        if(pos != -1){
            var pos2 =document.cookie.indexOf(";", pos);
            var ciastko;
            if(pos2 == -1) ciastko = document.cookie.substring(pos+5);
            else ciastko = document.cookie.substring(pos+5, pos2);

            var plany = ciastko.split("&");
            for(var i= 0; i< plany.length; i++){
                var tab = plany[i].split(".");
                if(tab[0] == nazwa){
                    for(var j= 1; j< tab.length; j+= 3){
                        var um =tab[j]; //jaka umiejetnosc
                        var trener =tab[j+1]; // umiejetnosc trenera
                        var ileTyg =tab[j+2]; // ile tygodni trening
                        var trenerWolne = 0;
                        if(um == 2 || um == 3){
                            trenerWolne = tab[j+4];
                            j+=2;
                        }

                        while(ileTyg >0){
                            var skil =parseFloat(skillstd[um].innerHTML);
                            var wieknow = parseInt(wiektd.innerHTML);
                            wieknow = isNaN(wieknow) ? 39 : wieknow;
                            var x= (wieknow -15) >= X.length ?0 :X[wieknow-15];
                            skil += x*(1 +(trener > Math.floor(skil) ? trener - Math.floor(skil) : 0) *0.03 );
                            skillstd[um].innerHTML =skil;
                            if(trenerWolne != 0){
                                skil =parseFloat(skillstd[1].innerHTML);
                                skil += x*(1 +(trenerWolne > Math.floor(skil) ? trenerWolne - Math.floor(skil) : 0) *0.03 );
                                skillstd[1].innerHTML = skil;
                            }
                            ileTyg--;
                            T++;
                            if(T > 17){
                                S++;
                                wiektd.innerHTML = wieknow+1;
                                T = 1;
                            }
                        }

                    }
                    for(var j= 0; j < 9; j++){
                        skillstd[j].innerHTML =(parseInt(parseFloat(skillstd[j].innerHTML)*100))/100;
                        if(parseFloat(skillstd[j].innerHTML) > 30.0) skillstd[j].innerHTML = 30;
                    }
                    if(parseInt(wiektd.innerHTML) > 39) wiektd.innerHTML = "R.I.P.";
                    aktualizujGSy();
                    break;
                }
            }
        }
    }

    function aktualizujGSy(){
        var AS = 0.0;
        for(var j= 0; j < 9; j++)
            AS += parseFloat(skillstd[j].innerHTML);
        var GS = parseFloat(skillstd[0].innerHTML) +parseFloat(skillstd[4].innerHTML) +parseFloat(skillstd[5].innerHTML) +parseFloat(skillstd[6].innerHTML);
        var CS = parseFloat(skillstd[0].innerHTML) +parseFloat(skillstd[6].innerHTML) +parseFloat(skillstd[7].innerHTML) +parseFloat(skillstd[8].innerHTML);
        AS = (parseInt(AS*100))/100;
        GS = (parseInt(GS*100))/100;
        CS = (parseInt(CS*100))/100;

        var y = document.getElementById("geesy");
        y.innerHTML ="GS: "+ GS +"&nbsp;&nbsp;&nbsp;&nbsp;CS: "+ CS +"&nbsp;&nbsp;&nbsp;&nbsp;AS: "+ AS;
    }

    function zapiszPlan(idPlanu){
        var tds =document.getElementById(idPlanu).getElementsByTagName("td");
        var blad = false;

        for(var i= 5; i< tds.length-3; i+= 4){
            var value = parseInt(tds[i].childNodes[0].value);
            if(isNaN(value) || value <1 || value >30){
                window.alert(tds[i].childNodes[0].value + " - " + slownik[language]["to nie jest liczba z przedziału"] + " 1 - 30");
                blad = true;
                break;
            }
        }
        if(blad == false){
            for(var i = 6; i < tds.length-2; i += 4){
                if(tds[i].hasChildNodes()){
                    var value = parseInt(tds[i].childNodes[0].value);
                    if(isNaN(value) || value < 1 || value > 425){
                        window.alert(tds[i].childNodes[0].value + " - " + slownik[language]["to nie jest liczba z przedziału"] + " 1 - 425");
                        blad = true;
                        break;
                    }
                }
            }
        }
        if(blad == false){
            var poz = idPlanu.indexOf("-");
            var nazwa = idPlanu.substring(poz+1);
            var plan = nazwa;
            for(var i = 4; i < tds.length-4; i += 4){
                var lista = tds[i].childNodes[0];
                plan += "." + lista.options[lista.selectedIndex].value;
                plan += "." + parseInt(tds[i+1].childNodes[0].value);
                if(tds[i+2].hasChildNodes())plan += "." + parseInt(tds[i+2].childNodes[0].value);
            }

            var pos = document.cookie.indexOf("plan=");
            if(pos != -1){
                var pos2 = document.cookie.indexOf(";", pos);
                var ciastko;
                if(pos2 == -1) ciastko = document.cookie.substring(pos+5);
                else ciastko = document.cookie.substring(pos+5, pos2);

                var plany = ciastko.split("&");
                for(var i= 0; i< plany.length; i++){
                    var tab = plany[i].split(".");
                    if(tab[0] == nazwa){
                        plany[i] = plan;
                        break;
                    }
                }
                ciastko = plany.join("&");
                var data =new Date();
                data.setFullYear(data.getFullYear() +1);
                document.cookie = "plan=" + ciastko + "; expires=" + data.toUTCString();
            }
        }
    }

    function usun(idPlanu){
        var tds =document.getElementById(idPlanu).getElementsByTagName("td");
        if(tds.length >12){
            var teery = document.getElementById(idPlanu).getElementsByTagName("tr");
            if(teery[teery.length-2].id == "wolne" && tds.length > 16){ //jezeli ostatni to rzuty wolne, to usun tez wczesniejszy trening
                if(teery[teery.length-4].id == "wolne"){
                    tds[tds.length-17].innerHTML =tds[tds.length-9].innerHTML;
                }
                else{
                    tds[tds.length-13].innerHTML =tds[tds.length-9].innerHTML;
                }
                teery[teery.length-3].parentNode.removeChild(teery[teery.length-2]);
                teery[teery.length-2].parentNode.removeChild(teery[teery.length-2]);
            }
            else if(teery[teery.length-2].id != "wolne"){
                if(teery[teery.length-3].id == "wolne"){
                    tds[tds.length-13].innerHTML =tds[tds.length-5].innerHTML;
                }
                else{
                    tds[tds.length-9].innerHTML =tds[tds.length-5].innerHTML;
                }
                teery[teery.length-2].parentNode.removeChild(teery[teery.length-2]);
            }
        }
        addClickEventTP();
    }

    function dodaj(idPlanu){

        var tds =document.getElementById(idPlanu).getElementsByTagName("td");
        if(tds.length <68){
            var teery =document.getElementById(idPlanu).getElementsByTagName("tr");
            /*********************To jest kopiowanie ostatniego elementu, które oficjalnie pierdole -> padłem przy opcji, gdzie ostatni zapisany element
to rzuty, ale zamieniam ten rzut na np obrone; po dodaj kopiuje rzut, bez wolnych, bo nie mam ich kurwa skad kopiowac. Pierdole!!!
var kopiatr;
if(teery[teery.length-2].id != "wolne"){ //jezeli to nie sa wolne, to kopiuj ostatni trening
kopiatr = teery[teery.length-2].cloneNode(true);
tds[tds.length-5].innerHTML ="";
teery[teery.length-1].parentNode.insertBefore(kopiatr, teery[teery.length-1]);
}
else{ //a jezeli sa wolne, to skopiuj albo tylko przedostatni (jezeli nie jest rzutem) albo obydwa ostatnie
kopiatr = teery[teery.length-3].cloneNode(true);
tds[tds.length-9].innerHTML ="";
teery[teery.length-1].parentNode.insertBefore(kopiatr, teery[teery.length-1]);
if(kopiatr.firstChild.firstChild.selectedIndex == 1 || kopiatr.firstChild.firstChild.selectedIndex == 2){
teery[teery.length-1].parentNode.insertBefore(teery[teery.length-3].cloneNode(true), teery[teery.length-1]);
}
}
/********************************************************/
            //Zdrowe, normalne, dodanie nowego gówna:
            if(teery[teery.length-2].id != "wolne")
                tds[tds.length-5].innerHTML ="";
            else
                tds[tds.length-9].innerHTML ="";
            var nowy = document.createElement("tr");
            nowy.innerHTML = "<td><select class='skillslistselect' ><option value='0' selected='selected'>" + nazwyskili[language][0] + "</option><option value='2'>" + nazwyskili[language][2] + "</option><option value='3'>" + nazwyskili[language][3] + "</option><option value='4'>" + nazwyskili[language][4] + "</option><option value='5'>" + nazwyskili[language][5] + "</option><option value='6'>" + nazwyskili[language][6] + "</option><option value='7'>" + nazwyskili[language][7] + "</option><option value='8'>" + nazwyskili[language][8] + "</option></select></td><td><input type='text' size='2' value='30'></td><td><input type='text' size='2' value='17'></td><td><a class='remlinktrainingplan' remlinkvalue='" + idPlanu +"' >" + slownik[language]["Usuń"] + "</a> <a class='addlinktrainingplan' addlinkvalue='"+idPlanu+"'>" + slownik[language]["Dodaj"] + "</a></td>";
            teery[teery.length-1].parentNode.insertBefore(nowy, teery[teery.length-1]);
        }
        addClickEventTP();
    }

    function wybor(co){
        var nexttr = co.parentNode.parentNode.nextSibling;
        if(co.value == 2 || co.value == 3){
            if(nexttr.id != "wolne"){
                var nowy = document.createElement("tr");
                nowy.setAttribute("id", "wolne");
                nowy.innerHTML = "<td><select><option value='1' selected='selected'>" + nazwyskili[language][1] + "</option></select></td><td><input type='text' size='2' value='30'></td><td></td><td></td>";
                nexttr.parentNode.insertBefore(nowy, nexttr);
            }
        }
        else{
            if(nexttr.id == "wolne"){
                nexttr.parentNode.removeChild(nexttr);
            }
        }
    }
    function addClickEventTP(){
        var removelinks = document.getElementsByClassName("remlinktrainingplan");
        for(var i = 0; i< removelinks.length; i++){
            var link = removelinks[i];
            link.addEventListener("click", function(){
                usun(this.getAttribute("remlinkvalue"));
            },false);
        }
        var addlinks = document.getElementsByClassName("addlinktrainingplan");
        for(var i = 0; i< addlinks.length; i++){
            var link = addlinks[i];
            link.addEventListener("click", function(){
                dodaj(this.getAttribute("addlinkvalue"));
            },false);
        }
        var saveButtons = document.getElementsByClassName("saveplanbutton");
        for(var i = 0; i< saveButtons.length; i++){
            var link = saveButtons[i];
            link.addEventListener("click", function(){
                zapiszPlan(this.getAttribute("saveplanvalue"));
            },false);
        }
        var skillslists = document.getElementsByClassName("skillslistselect");
        for(var i = 0; i< skillslists.length; i++){
            var skillslist = skillslists[i];
            link.addEventListener("click", function(){
                wybor(this);
            },false);
        }
    }
    /**
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("language", "JavaScript");
    script.appendChild(document.createTextNode(scriptToHead));
    var head = document.getElementsByTagName('head')[0];
    document.head.appendChild(script);
**/




    /**
   LOOOK AT HERE
    var charurl = $(location).attr('href');
    var path = charurl.substr(charurl.indexOf("?"),charurl.length);

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    console.log($(location).attr('href'));
    if( $(location).attr('href').endsWith('?act=team'))
        $("#Spry ul").append('<li class="TabbedPanelsTab" >SmthElse</li>');


    **/
    var url1 ="http://www.charazay.com/?act=team";
    var url2 ="http://www.charazay.com/index.php?act=team";
    var url3 ="https://www.charazay.com/?act=team";
    var url4 ="https://www.charazay.com/index.php?act=team";

    var url5 ="http://www.charazay.com/?act=player&code=1&id=";
    var url6 ="http://www.charazay.com/index.php?act=player&code=1&id=";
    var url7 ="https://www.charazay.com/?act=player&code=1&id=";
    var url8 ="https://www.charazay.com/index.php?act=player&code=1&id=";


    if(document.cookie.indexOf("plan=") != -1){
        var pos = document.cookie.indexOf("plan=");
        var pos2 =document.cookie.indexOf(";", pos);
        var ciastko;
        if(pos2 == -1) ciastko = document.cookie.substring(pos+5);
        else ciastko = document.cookie.substring(pos+5, pos2);
        if(ciastko.indexOf("Center2") == -1){
            document.cookie = "plan=Guard1.0.30.17&Guard2.0.30.17&Center1.0.30.17&Center2.0.30.17";
        }
    }
    else{
        document.cookie="plan=Guard1.0.30.17&Guard2.0.30.17&Center1.0.30.17&Center2.0.30.17";
    }

    if(location.href.indexOf(url1) != -1 || location.href.indexOf(url2) != -1 || location.href.indexOf(url3) != -1 || location.href.indexOf(url4) != -1){

        var li =document.createElement("li");
        li.setAttribute("id", "plant");
        li.setAttribute("tabindex", "0");
        li.setAttribute("class","TabbedPanelsTab");
        li.addEventListener("click", function(){
            var tabs = document.getElementsByClassName('TabbedPanelsTab');
            for (var i = 0; i < tabs.length; i++){
                tabs[i].setAttribute("class","TabbedPanelsTab");
            }
            var tabbedContents = document.getElementsByClassName('TabbedPanelsContent');

            for (var i = 0; i < tabbedContents.length; i++){
                tabbedContents[i].setAttribute("class","TabbedPanelsContent");
                tabbedContents[i].setAttribute("style","display: none;");
            }
            document.getElementById("plant-content").setAttribute("style","display: block;");
            document.getElementById("plant-content").setAttribute("class","TabbedPanelsContent TabbedPanelsContentVisible");

            this.setAttribute("class","TabbedPanelsTab TabbedPanelsTabSelected");
        },false);
        li.innerHTML = slownik[language]["Plan Treningowy"];


        document.getElementById("Spry").getElementsByClassName("TabbedPanelsTabGroup")[0].appendChild(li);

        var plan =document.createElement("div");
        plan.setAttribute("class", "TabbedPanelsContent");

        plan.setAttribute("id", "plant-content");

        document.getElementsByClassName("TabbedPanelsContentGroup")[0].appendChild(plan);


        plan.innerHTML ="<h2>" + slownik[language]["Plany treningowe"] + "</h2>";

        var pos = document.cookie.indexOf("plan=");
        if(pos == -1){
            plan.innerHTML += "<br>Brak zdefiniowanego planu treningowego"; //brak tłumaczenia, bo ten komunikat nigdy nie jest wyświetlany
        }
        else{
            var pos2 =document.cookie.indexOf(";", pos);
            var ciastko;
            if(pos2 == -1) ciastko = document.cookie.substring(pos+5);
            else ciastko = document.cookie.substring(pos+5, pos2);

            var plany = ciastko.split("&");

            for(var i = 0; i < plany.length; i++){
                var tab =plany[i].split(".");

                var e1 =document.createElement("div");
                e1.setAttribute("class", "rc-s");
                var e2 =document.createElement("div");
                e2.setAttribute("class", "rc-t");
                e2.innerHTML =tab[0];
                var e3 =document.createElement("div");
                var iner = "<table id='plan-" + tab[0] + "'><tr><td>" + slownik[language]["Rodzaj treningu"] + "</td><td>" + slownik[language]["Umiejetność trenera"] + "</td><td>" + slownik[language]["Długość treningu"] + "</td><td></td></tr>";
                for(var j = 1; j < tab.length; j+=3){
                    var co = tab[j];
                    var trener = tab[j+1];
                    var ile;
                    if(co != 1) ile = tab[j+2];
                    iner += "<tr";
                    if(co == 1) iner += " id='wolne'";
                    iner += "><td><select class='skillslistselect' >";
                    for(var k = 0; k < 9; k++){
                        if(k != 1 && co != 1){
                            iner += "<option value='" + k + "'";
                            if(co == k) iner += " selected='selected'";
                            iner += ">" + nazwyskili[language][k] + "</option>";
                        }
                    }
                    if(co == 1) iner += "<option value='1' selected='selected'>" + nazwyskili[language][1] + "</option>";
                    iner += "</select></td><td><input type='text' size='2' value='" + trener + "' /></td><td>";
                    if(co != 1) iner += "<input type='text' size='2' value='" + ile + "' />";
                    iner += "</td><td>";
                    //warunek ponizej: jezeli to jest ostatni normalny trening lub przd ostatni, jezeli ostatnim sa wolne, to wtedy dodaj opcje "usun" i "dodaj":
                    if(co != 1 && (j+3 >= tab.length || j+5 == tab.length)) iner += "<a class='remlinktrainingplan' remlinkvalue='plan-" + tab[0] +"' >" + slownik[language]["Usuń"] + "</a> <a class='addlinktrainingplan' addlinkvalue='plan-" + tab[0] +"'>"  + slownik[language]["Dodaj"] + "</a>";
                    iner += "</td></tr>";
                    if(co == 1) j--;
                }
                iner += "<tr><td><button class='button white saveplanbutton' saveplanvalue='plan-" + tab[0] +"' >" + slownik[language]["Zapisz"] + "</button></td><td></td><td></td><td></td></tr></table>";
                e3.innerHTML = iner;

                plan.appendChild(e1);
                e1.appendChild(e2);
                e1.appendChild(e3);
            }


        }
        addClickEventTP();

    }

    else if(location.href.indexOf(url5) != -1 || location.href.indexOf(url6) != -1 || location.href.indexOf(url7) != -1 || location.href.indexOf(url8) != -1){
        var e= document.getElementsByClassName("mc-ls")[0];
        var table =e.getElementsByTagName("table")[1];
        var tr =table.getElementsByTagName("tr");
        var skills =new Array(10);
        var istart =tr.length -5;
        for(var i= istart; i< istart +5; i++){
            var td =tr[i].getElementsByTagName("td");
            skills[(i-istart)*2] =td[1].innerHTML;
            skills[(i-istart)*2+1] =td[4].innerHTML;
            td[0].setAttribute("extratraining",((i-istart)*2)+'');
            td[0].addEventListener("click", function(){
                extraTrening( this.getAttribute("extratraining")+ '');
            },false);
            td[0].setAttribute("onmouseover", "this.style.textDecoration=\"underline\";");
            td[0].setAttribute("onmouseout", "this.style.textDecoration=\"none\";");
            if((i-istart)*2+1 != 9){
                td[3].setAttribute("extratraining",((i-istart)*2+1)+'');
                td[3].addEventListener("click", function(){
                    extraTrening( this.getAttribute("extratraining")+ '');
                },false);
                td[3].setAttribute("onmouseover", "this.style.textDecoration=\"underline\";");
                td[3].setAttribute("onmouseout", "this.style.textDecoration=\"none\";");
            }
        }

        var AS =0;
        var GS =parseInt(skills[0]) +parseInt(skills[4]) +parseInt(skills[5]) +parseInt(skills[6]);
        var CS =parseInt(skills[0]) +parseInt(skills[6]) +parseInt(skills[7]) +parseInt(skills[8]);
        for(var i= 0; i< 9; i++)
            AS += parseInt(skills[i]);

        var y = tr[0].getElementsByTagName("td")[0];
        y.removeAttribute("height");
        y.setAttribute("style", "text-align: center;");
        y.setAttribute("id", "geesy");
        y.innerHTML ="GS: "+ GS +"&nbsp;&nbsp;&nbsp;&nbsp;CS: "+ CS +"&nbsp;&nbsp;&nbsp;&nbsp;AS: "+ AS;

        var nowy = document.createElement("div");
        document.getElementById("mc").getElementsByClassName("mc-ls")[0].insertBefore(nowy, document.getElementById("mc").getElementsByClassName("mc-ls")[0].childNodes[6]);
        var pos = document.cookie.indexOf("plan=");
        if(pos != -1){
            var pos2 =document.cookie.indexOf(";", pos);
            var ciastko;
            if(pos2 == -1) ciastko = document.cookie.substring(pos+5);
            else ciastko = document.cookie.substring(pos+5, pos2);

            var plany = ciastko.split("&");

            for(i=0; i<plany.length;i++){
                var tab =plany[i].split(".");
                var testbutton = document.createElement("button");
                testbutton.setAttribute("class","button white small");
                testbutton.innerHTML = tab[0];


                testbutton.addEventListener('click', function() {
                    //alert("Working");
                    klikPlan(this.innerHTML);
                }, false);


                nowy.appendChild(testbutton);
            }

            var testbutton = document.createElement("button");
            testbutton.setAttribute("class","button white small");
            testbutton.innerHTML =slownik[language]["Wyczyść"];

            testbutton.addEventListener('click', function() {
                //alert("Working");
                wyczysc();
            }, false);


            nowy.appendChild(testbutton);

            //nowy.innerHTML += "<button type='button' class='button white' onclick='wyczysc();'>" + slownik[language]["Wyczyść"] + "</button>";

        }



    }

    else{
        var e= document.getElementsByClassName("mc-ls")[0];
        var table =e.getElementsByTagName("table")[1];
        var tr = table.getElementsByTagName("tr");
        var skills =new Array(10);
        var istart =tr.length -5;
        for(var i= istart; i< istart +5; i++){
            var td =tr[i].getElementsByTagName("td");
            skills[(i-istart)*2] =td[1].innerHTML;
            skills[(i-istart)*2+1] =td[4].innerHTML;
            td[0].setAttribute("onclick", "extraTrening('" + ((i-istart)*2) + "');");
            td[0].setAttribute("onmouseover", "this.style.textDecoration=\"underline\";");
            td[0].setAttribute("onmouseout", "this.style.textDecoration=\"none\";");
            if((i-istart)*2+1 != 9){
                td[3].setAttribute("onclick", "extraTrening('" + ((i-istart)*2+1) + "');");
                td[3].setAttribute("onmouseover", "this.style.textDecoration=\"underline\";");
                td[3].setAttribute("onmouseout", "this.style.textDecoration=\"none\";");
            }
        }

        var AS =0;
        var GS =parseInt(skills[0]) +parseInt(skills[4]) +parseInt(skills[5]) +parseInt(skills[6]);
        var CS =parseInt(skills[0]) +parseInt(skills[6]) +parseInt(skills[7]) +parseInt(skills[8]);
        for(var i= 0; i< 9; i++)
            AS += parseInt(skills[i]);

        var y = tr[0].getElementsByTagName("td")[0];
        y.removeAttribute("height");
        y.setAttribute("style", "text-align: center;");
        y.setAttribute("id", "geesy");
        y.innerHTML ="GS: "+ GS +"&nbsp;&nbsp;&nbsp;&nbsp;CS: "+ CS +"&nbsp;&nbsp;&nbsp;&nbsp;AS: "+ AS;

        var nowy = document.createElement("div");
        var pos = document.cookie.indexOf("plan=");
        if(pos != -1){
            var pos2 =document.cookie.indexOf(";", pos);
            var ciastko;
            if(pos2 == -1) ciastko = document.cookie.substring(pos+5);
            else ciastko = document.cookie.substring(pos+5, pos2);

            var plany = ciastko.split("&");
            for(i in plany){
                var tab =plany[i].split(".");
                nowy.innerHTML += "<button type='button' class='button white' onclick='klikPlan(\"" + tab[0] + "\");'>" + tab[0] + "</button>";
            }
            nowy.innerHTML += "<button type='button' class='button white' onclick='wyczysc();'>" + slownik[language]["Wyczyść"] + "</button>";
        }
        document.getElementById("mc").getElementsByClassName("mc-ls")[0].insertBefore(nowy, document.getElementById("mc").getElementsByClassName("mc-ls")[0].childNodes[4]);
    }


})();


