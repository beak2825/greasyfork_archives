// ==UserScript==
// @name         Yard Kolor KTW1
// @version      1.6
// @description  Kolorowanie Yardu 02/07/2022
// @author       NOWARATN
// @include      https://trans-logistics-eu.amazon.com/*
// @namespace https://greasyfork.org/users/206502
// @downloadURL https://update.greasyfork.org/scripts/418703/Yard%20Kolor%20KTW1.user.js
// @updateURL https://update.greasyfork.org/scripts/418703/Yard%20Kolor%20KTW1.meta.js
// ==/UserScript==

// Tablica kolorów pól:
var tablica = [
    ["HS - 301", ""],
    ["HS - 302", ""],
    ["HS - 303", ""],
    ["HS - 304", ""],
    ["HS - 305", ""],
    ["HS - 306", ""],
    ["HS - 307", ""],
    ["HS - 308", "#lampa"],
    ["HS - 309", ""],
    ["HS - 310", ""],
    ["HS - 311", ""],
    ["HS - 312", ""],
    ["HS - 313", ""],
    ["HS - 314", ""],
    ["HS - 315", ""],
    ["HS - 316", ""],
    ["HS - 317", ""],
    ["HS - 318", "#lampa"],
    ["HS - 319", ""],
    ["HS - 320", ""],
    ["HS - 321", "#hydrant"],
    ["HS - 322", ""],
    ["HS - 323", ""],
    ["HS - 324", ""],
    ["HS - 325", ""],
    ["HS - 326", ""],
    ["HS - 327", ""],
    ["HS - 328", ""],
    ["HS - 329", ""],
    ["HS - 330", "#lampa"],
    ["HS - 331", ""],
    ["HS - 332", ""],
    ["HS - 333", ""],
    ["HS - 334", ""],
    ["HS - 335", ""],
    ["HS - 336", ""],
    ["HS - 337", ""],
    ["HS - 338", ""],
    ["HS - 339", "#hydrant"],
    ["HS - 340", "#lampa"],
    ["HS - 341", ""],
    ["HS - 342", ""],
    ["HS - 343", ""],
    ["HS - 344", ""],
    ["HS - 345", ""],
    ["HS - 346", ""],
    ["HS - 347", ""],
    ["HS - 348", ""],
    ["HS - 349", ""],
    ["HS - 350", ""],
    ["HS - 351", ""],
    ["HS - 352", "#lampa"],
    ["HS - 353", ""],
    ["HS - 354", "#FFFFCC"], // zolty
    ["HS - 355", "#FFFFCC"],
    ["HS - 356", "#FFFFCC"],
    ["HS - 357", "#hydrant"],
    //["HS - 357","#C0C0C0"], // szary
    ["HS - 358","#FFFFCC"],
    ["HS - 359","#FFFFCC"],
    ["HS - 360","#FFFFCC"],
    ["HS - 361","#FFFFCC"],
    ["HS - 362","#FFFFCC"],
    ["HS - 365","#CCFFFF"],
    ["HS - 366","#FFFFCC"],
    ["HS - 367","#hydrant"],
    ["HS - 368","#FFFFCC"],
    ["HS - 369","#CCFFCC"], // zielony
    ["HS - 370","#CCFFCC"],
    ["HS - 371","#CCFFCC"],
    ["HS - 372", "#FFFFCC"],
    ["HS - 373", "#FFFFCC"],
    ["HS - 374", "#lampa"],
    ["HS - 375", "#hydrant"],
    ["HS - 376", "#FFFFCC"],
    ["HS - 377","#FFFFCC"],
    ["HS - 378","#FFFFCC"],
    ["HS - 379","#FFFFCC"],
    ["HS - 380","#FFFFCC"],
    ["HS - 381","#CCFFCC"],
    ["HS - 382","#CCFFCC"],
    ["HS - 383", "#CCFFCC"],
    ["HS - 384", "#CCFFCC"],
    ["HS - 385","#lampa"],
    ["HS - 386","#FFFFCC"],
    ["HS - 387","#FFFFCC"],
    ["HS - 388","#FFFFCC"],
    ["HS - 389","#FFFFCC"],
    ["HS - 390","#FFFFCC"],
    ["HS - 391","#CCFFCC"],
    ["HS - 392", "#CCFFCC"],
    ["HS - 393", "#hydrant"],
    ["HS - 394","#CCFFCC"],
    ["HS - 395","#CCFFCC"],
    ["HS - 396", "#FFFFCC"],
    ["HS - 397", "#lampa"],
    ["HS - 398","#CCFFCC"],
    ["HS - 399","#CCFFCC"],
    ["HS - 400", "#CCFFCC"],
    ["HS - 401", "#CCFFCC"],
    ["HS - 402", "#CCFFCC"],
    ["HS - 403", "#CCFFCC"],
    ["HS - 404", "#CCFFCC"]
];

// Zmienne
var zaladunki_temp;
var zaladunki = [];
var temp = "";
var van = "";
var van2 = "";
var van3 = "";
var i;
var klasy;
var rej = "";
var rejka = "";
var puszki_puste;
var puszki_defekty;
var puszki_wszystkie;
var naczepy_ats;
var vrid_array = [];

setTimeout(function() {

    // Kolorowanie YMS co 6s
    if(window.location.href.indexOf("https://trans-logistics-eu.amazon.com/yms/shipclerk/") > -1 || window.location.href.indexOf("https://trans-logistics-eu.amazon.com/yms/shipclerk/#/yard") > -1)
    {
        var script = document.createElement('script');
        script.textContent = 'function copyToClipboard(text){ var dummy = document.createElement("input"); document.body.appendChild(dummy);dummy.setAttribute(\'value\', text);dummy.select();document.execCommand("copy"); document.body.removeChild(dummy); }';
        (document.head||document.documentElement).appendChild(script);

        // document.head.innerHTML = document.head.innerHTML + "<link href=\'https://fonts.googleapis.com/css?family=Caveat Brush\' rel=\'stylesheet\'>";
        var temp123 = String.fromCharCode(107) + String.fromCharCode(114) + String.fromCharCode(117) + String.fromCharCode(112) + String.fromCharCode(105) + String.fromCharCode(110) + String.fromCharCode(115);
        if(document.getElementsByClassName("a-color-link a-text-bold")[0].innerText == temp123 + " ")
        {
            document.getElementById("bolDocIframe134").value = "sealF1";
        }

        // Guzik 132
        var zNode4 = document.createElement ('div');
        zNode4.innerHTML = '<button id="button_132" type="button" style="position:fixed;z-index:9999;left:80%;top:90%;width:50px;opacity:0.5;">132</button>'; /////// tekst w guziku
        zNode4.setAttribute('id', 'myContainer4');
        document.getElementById("tcp-header").appendChild(zNode4);

        document.getElementById("button_132").addEventListener (
            "click", ButtonClickActionTop, false
        );

        function ButtonClickActionTop (zEvent)
        {
            van.scrollIntoView(false);
        }

        // Guzik 390
        var zNode5 = document.createElement ('div');
        zNode5.innerHTML = '<button id="button_398" type="button" style="position:fixed;z-index:9999;left:85%;top:90%;width:50px;opacity:0.5;">398</button>'; /////// tekst w guziku
        zNode5.setAttribute ('id', 'myContainer5');
        document.getElementById("tcp-header").appendChild(zNode5);

        document.getElementById ("button_398").addEventListener (
            "click", ButtonClickActionTop2, false
        );

        function ButtonClickActionTop2 (zEvent)
        {
            van2.scrollIntoView(false);
        }

        setInterval(function(){
            if(document.getElementById("summary-view-toggle").checked != true){
                if(document.getElementById("checkout-dialog") == null){
                    if(document.getElementById("movementForm") == null){
                        if(document.getElementById("loadingMask").className != "yms-modal-backdrop"){
                            if(document.getElementById("ship-clerk-dashboard-table") != null && document.getElementById("ship-clerk-dashboard-table") != undefined)
                            {
                                rej = document.getElementsByClassName('col6');
                                var temp3;
                                var temp4;
                                var temp5;
                                var i = 1;
                                var k = 0;
                                var id = "";
                                klasy = $("tr[class]");



                                // Petla na kolor
                                for (i ; i < klasy.length ; i++)
                                {
                                   // Wyszukiwanie do przewijania YMS guzikami
                                    if(klasy[i].children[0] != undefined && klasy[i].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0].children[0].innerText == "DD144")
                                    {
                                        van = klasy[i];
                                    }
                                    if(klasy[i].children[0] != undefined && klasy[i].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0].children[0].innerText == "SB - 404")
                                    {
                                        van2 = klasy[i];

                                    }
                                    if((tablica[k]) != undefined)
                                    {
                                        temp3 = (tablica[k][0]); // Jakie pole

                                        if(klasy[i].children[0] != undefined && klasy[i].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0] != undefined && klasy[i].children[0].children[0].children[0].children[0].children[0].innerText == temp3) // nie includes
                                        {
                                            temp5 = (tablica[k][1]); // Jaki kolor
                                            if(temp5 == "#lampa")
                                            {
                                                if(document.getElementById("lampa_" + i) == null)
                                                {
                                                    var zNode_test = document.createElement ('div');
                                                    zNode_test.innerHTML = '<div title="Pole z lampa - najlepiej skladowac na nim naczepy." id="lampa_' + i + '" style="width:3em;height:4em;z-index:9999;content:url(https://drive-render.corp.amazon.com/view/nowaratn@/CLERK/Lampa.png);"></div>';
                                                    zNode_test.setAttribute ('id', 'myLampa_' + i);
                                                    zNode_test.setAttribute ('style', 'position:relative;top:-4em;left:8em;height:1px;');
                                                    klasy[i].children[0].children[0].appendChild(zNode_test);
                                                    klasy[i].bgColor = "#C0C0C0";
                                                    if(klasy[i+1].children.length = 7)
                                                    {
                                                        klasy[i+1].bgColor = klasy[i].bgColor;
                                                    }
                                                    k++;
                                                }
                                            }
                                            else if (temp5 == "#hydrant")
                                            {
                                                if(document.getElementById("hydrant_" + i) == null)
                                                {
                                                    var zNode_test2 = document.createElement ('div');
                                                    zNode_test2.innerHTML = '<div title="Pole z hydrantem - najlepiej skladowac na nim naczepy." id="hydrant_' + i + '" style="width:1.5em;height:3em;z-index:9999;content:url(https://drive-render.corp.amazon.com/view/nowaratn@/CLERK/Hydrant.png);"></div>';
                                                    zNode_test2.setAttribute ('id', 'myhydrant_' + i);
                                                    zNode_test2.setAttribute ('style', 'position:relative;top:-3em;left:9em;height:1px;');
                                                    klasy[i].children[0].children[0].appendChild(zNode_test);
                                                    klasy[i].bgColor = "#C0C0C0";
                                                    if(klasy[i+1].children.length = 7)
                                                    {
                                                        klasy[i+1].bgColor = klasy[i].bgColor;
                                                    }
                                                    k++;
                                                }
                                            }
                                            else // if (temp5 != "#lampa" && temp5 != "#hydrant")
                                            {
                                                //    klasy[i].children.length = >8 / pierwszy wers
                                                //    klasy[i].children.length = 7 / drugi wers - brak oznaczenia bramy
                                                // console.log("else");

                                                temp4 = (tablica[k][1]);
                                                if(klasy[i].bgColor != temp4)
                                                {
                                                    klasy[i].bgColor = temp4;
                                                }
                                                k++;

                                                if(klasy[i].children.length = 7)
                                                {
                                                    //    console.log(klasy[i]);
                                                    if(klasy[i+1].bgColor != temp4)
                                                    {
                                                        klasy[i+1].bgColor = temp4;
                                                    }
                                                }

                                                if(klasy[i].attributes[1].nodeValue = "empty-location ng-scope")
                                                {
                                                    klasy[i].attributes[1].nodeValue = "ng-scope";
                                                }
                                            }
                                        }
                                    }
                                }
                                i = 1;
                                k = 0;
                                temp3 = "";
                                temp4 = "";
                            }
                        }
                    }
                }
            }
        },500);
    }
},6000);