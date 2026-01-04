// ==UserScript==
// @name        Filmweb.pl eksport ocen (wersja poprawiona)
// @namespace   kapela86

// @description Skrypt pozwala na eksport ocen oraz chcę/nie chcę zobaczyć/zagrać do plików xls. Działa na własnym profilu oraz znajomych.
// @match       *://filmweb.pl/user/*
// @match       *://www.filmweb.pl/user/*
// @version     1.8.2
// @grant       none
// @license     GPL-3.0-or-later
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/455717/Filmwebpl%20eksport%20ocen%20%28wersja%20poprawiona%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455717/Filmwebpl%20eksport%20ocen%20%28wersja%20poprawiona%29.meta.js
// ==/UserScript==
"use strict";

/*
Changelog:
1.0		2015-04-14	pierwsze wydanie
1.1		2015-04-14	tytuły oryginalne są teraz klikalne i kierują do danego tytułu na stronie filmwebu
1.2		2015-04-21	dodano pobieranie komentarzy do ocen
1.3		2015-04-26	dodano pobieranie chcę/nie chcę zobaczyć/zagrać
1.4		2015-05-03	dodano pobieranie list znajomych
1.4.1	2015-05-04	różne drobne poprawki i optymalizacje kodu
1.4.2	2015-05-28	drobna poprawka dla osób mających spację w nicku
1.4.3	2016-11-27	poprawka dla osób które zainstalowały skrypt po 2016-10-04 i nie działał im przycisk zapisu do XLS
1.4.4	2017-07-09	naprawienie pobierania list "Chcę zobaczyć" (filmweb dodał kolumnę z datą dodania i to psuło wykonywanie skryptu)
1.5		2018-04-18	poprawienie skryptu aby mógł działać z nową wersją wyglądu profili i list ocen (na razie tylko pobieranie ocen zrobione)
1.6		2018-05-06	dodanie pobierania ocen programów i list "chcę zobaczyć/zagrać"
1.7		2018-05-27	dodanie pobierania list "nie interesuje mnie"
1.7.1	2018-05-29	poprawka dla nowego wyglądu strony profili
1.7.2	2018-07-22	poprawka drobnego błędu przy pobieraniu ocen
1.7.3	2019-04-14	poprawiłem błąd związany z nieładowaniem się skryptu i nieprawidłowym generowaniem odnośników do strony filmweb dla tytułów
1.7.4	2020-05-06  poprawilem błąd z brakiem polskich tytułów i roku produkcji (filmweb wprowadził drobne zmiany w kodzie strony); dodatkowo teraz kolumna z oryginalnym tytułem nie będzie pusta w sytuacji gdy jest on taki sam jak polski
1.7.5	2020-05-17  poprawilem błąd z niewyświetlaniem się panelu pobierania ocen (filmweb znowu wprowadził drobne zmiany w kodzie strony)
1.7.6	2021-09-19	tymczasowe obejście zmiań wprowadzonych w kodzie strony
1.7.7		        poprawki na zmiany w kodzie strony filmwebu i sposobie pobierania ocen
1.8     2022-11-15  poprawki dodane przez @tomfilmowiec, poprawione pobieranie danych (filmweb wprowdził drobne zmiany w kodzie strony), poprawione pobieranie ocen (teraz pobiera z osobnych requestów), dodane opóźnienia czasowe, poprawki kosmetyczne
1.8.1   2022-12-01  status pobierania widoczny w tytule strony
1.8.2   2023-11-18  poprawka dla nowego wyglądu profili

To do:
- kompatybilność z greasemonkey 4
- https://www.w3schools.com/howto/howto_js_progressbar.asp
- dogadać się z Grzegorz_Derebecki z FDB odnośnie nowych kolumn/formatu
- naprawić "w przypadku gdy polski tytuł jest taki sam jak oryginalny wtedy w kolumnie tytuł oryginalny zostawia puste pole."
- ogarnąć kwestię gdy ktoś nie ma ocen w danej kategorii lub nie mamy uprawnień do przeglądania ocen
- eksport ocen przy eksporcie listy chcę/nie chcę zobaczyć/zagrać
- eksport ocen aktorów
- eksport obejrzanych odcinków seriali wraz z ocenami
- przetestować ExcellentExport.js v3.x (eksport do xlsx, wiele arkuszy w pliku)
- sprawdzić czy da się też eksportować komentarze innych osób do naszej oceny
*/

/*
ExcellentExport.js v1.5
https://github.com/jmaister/excellentexport
https://raw.githubusercontent.com/jmaister/excellentexport/v1.5/excellentexport.min.js
*/

var n=String.fromCharCode,p;a:{try{document.createElement("$")}catch(q){p=q;break a}p=void 0} window.btoa||(window.btoa=function(b){for(var g,c,f,h,e,a,d=0,r=b.length,s=Math.max,l="";d<r;){g=b.charCodeAt(d++)||0;c=b.charCodeAt(d++)||0;a=b.charCodeAt(d++)||0;if(255<s(g,c,a))throw p;f=g>>2&63;g=(g&3)<<4|c>>4&15;h=(c&15)<<2|a>>6&3;e=a&63;c?a||(e=64):h=e=64;l+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e)}return l}); window.atob||(window.atob=function(b){b=b.replace(/=+$/,"");var g,c,f,h,e=0,a=b.length,d=[];if(1===a%4)throw p;for(;e<a;)g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(e++)),g=(g&63)<< 2|c>>4&3,c=(c&15)<<4|f>>2&15,f=(f&3)<<6|h&63,d.push(n(g)),c&&d.push(n(c)),f&&d.push(n(f));return d.join("")});
var ExcellentExport=function(){function b(e,a){return e.replace(RegExp("{(\\w+)}","g"),function(d,e){return a[e]})}var g={excel:"data:application/vnd.ms-excel;base64,",csv:"data:application/csv;base64,"},c={excel:'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\x3c!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--\x3e</head><body><table>{table}</table></body></html>'},f= ",",h="\r\n";return{excel:function(e,a,d){a=a.nodeType?a:document.getElementById(a);var f=g.excel;a=b(c.excel,{a:d||"Worksheet",table:a.innerHTML});a=window.btoa(window.unescape(encodeURIComponent(a)));e.href=f+a;return!0},csv:function(e,a,d,b){void 0!==d&&d&&(f=d);void 0!==b&&b&&(h=b);a=a.nodeType?a:document.getElementById(a);var c="",l,k;for(d=0;d<a.rows.length;d++){l=a.rows[d];for(b=0;b<l.cells.length;b++){k=l.cells[b];var c=c+(b?f:""),m=k.textContent.trim();k=m;var t=-1!==m.indexOf(f)||-1!==m.indexOf("\r")|| -1!==m.indexOf("\n");(m=-1!==m.indexOf('"'))&&(k=k.replace(/"/g,'""'));if(t||m)k='"'+k+'"';c+=k}c+=h}a=g.csv+window.btoa(window.unescape(encodeURIComponent(c)));e.href=a;return!0}}}();

setTimeout(function()
{
    var TytulStrony = document.title;
    var OpoznieniePobraniaStrony = 750;
    var NazwaProfilu = TytulStrony.substring(0, TytulStrony.indexOf(" "));

    var KtoToJest;
    if (document.querySelector(".ico--photoThinMedium") !== null)
    {
        KtoToJest = "ja";
    }
    else if (document.querySelector(".ico--friendThin") !== null)
    {
        KtoToJest = "znajomy";
    }
    else
    {
        return;
    }

    if (window.location.pathname.toLowerCase() == "/user/"+NazwaProfilu.toLowerCase())
    {
        var Menu = document.querySelector("section").nextSibling;
        var KtoreElementy, NumerDiva, NumerPrzycisku, Tabela, RowSelector, CellSelector, KtoraStrona, CzyStrona, LiczbaOcen, LiczbaPobranychOcen, TempArray, TempNode;

        var TablicaDivow = [
            {selektor: "EksportOcen_DivOceny", id: "eksportocen", tytul: "pobierz oceny:"},
            {selektor: "EksportOcen_DivChcęZobaczyć", id: "eksportchcezobaczyc", tytul: "pobierz \"chcę zobaczyć/zagrać\":"},
            {selektor: "EksportOcen_DivNieInteresujeMnie", id: "eksportnieinteresujemnie", tytul: "pobierz \"nie interesuje mnie\":"}
        ];

        var TablicaPrzyciskow = [
            [
                {selektor: "EksportOcen_PrzyciskPobierzOcenyFilmow", tytul: "filmy", tytul_fw: "film", id: "0,0", ktoreelementy: "id,tytulpl,tytulorg,rokprod,ulubione,ocena,komentarz,gatunek,data", parametr: "film?page=", plik: " - oceny - filmy.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzOcenySeriali", tytul: "seriale", tytul_fw: "serial", id: "0,1", ktoreelementy: "id,tytulpl,tytulorg,rokprod,ulubione,ocena,komentarz,gatunek,data", parametr: "serial?page=", plik: " - oceny - seriale.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzOcenyProgramow", tytul: "programy", tytul_fw: "tvshow", id: "0,2", ktoreelementy: "id,tytulpl,tytulorg,rokprod,ulubione,ocena,komentarz,gatunek,data", parametr: "tvshow?page=", plik: " - oceny - programy.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzOcenyGier", tytul: "gry", tytul_fw: "videogame", id: "0,3", ktoreelementy: "id,tytulpl,tytulorg,rokprod,ulubione,ocena,komentarz,gatunek,data", parametr: "videogame?page=", plik: " - oceny - gry.xls"},
                {selektor: "EksportOcen_PrzyciskZapiszOcenyDoXLS", tytul: "zapisz do XLS", id: "zapisocen"}
            ],
            [
                {selektor: "EksportOcen_PrzyciskPobierzChceZobaczycFilmy", tytul: "filmy", tytul_fw: "film", id: "1,0", ktoreelementy: "id,tytulpl,tytulorg,rokprod,jakbardzo,gatunek", parametr: "film?page=", plik: " - chcę zobaczyć - filmy.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzChceZobaczycSeriale", tytul: "seriale", tytul_fw: "serial", id: "1,1", ktoreelementy: "id,tytulpl,tytulorg,rokprod,jakbardzo,gatunek", parametr: "serial?page=", plik: " - chcę zobaczyć - seriale.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzChceZobaczycProgramy", tytul: "programy", tytul_fw: "tvshow", id: "1,2", ktoreelementy: "id,tytulpl,tytulorg,rokprod,jakbardzo,gatunek", parametr: "tvshow?page=", plik: " - chcę zobaczyć - programy.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzChceZagrac", tytul: "gry", tytul_fw: "videogame", id: "1,3", ktoreelementy: "id,tytulpl,tytulorg,rokprod,jakbardzo,gatunek", parametr: "videogame?page=", plik: " - chcę zagrać.xls"},
                {selektor: "EksportOcen_PrzyciskZapiszChceZobaczycDoXLS", tytul: "zapisz do XLS", id: "zapischce"}
            ],
            [
                {selektor: "EksportOcen_PrzyciskPobierzNieInteresujeMnieFilmy", tytul: "filmy", tytul_fw: "film", id: "2,0", ktoreelementy: "id,tytulpl,tytulorg,rokprod,gatunek", parametr: "film?page=", plik: " - nie interesuje mnie - filmy.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzNieInteresujeMnieSeriale", tytul: "seriale", tytul_fw: "serial", id: "2,1", ktoreelementy: "id,tytulpl,tytulorg,rokprod,gatunek", parametr: "serial?page=", plik: " - nie interesuje mnie - seriale.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzNieInteresujeMnieProgramy", tytul: "programy", tytul_fw: "tvshow", id: "2,2", ktoreelementy: "id,tytulpl,tytulorg,rokprod,gatunek", parametr: "tvshow?page=", plik: " - nie interesuje mnie - programy.xls"},
                {selektor: "EksportOcen_PrzyciskPobierzNieInteresujeMnieGry", tytul: "gry", tytul_fw: "videogame", id: "2,3", ktoreelementy: "id,tytulpl,tytulorg,rokprod,gatunek", parametr: "videogame?page=", plik: " - nie interesuje mnie - gry.xls"},
                {selektor: "EksportOcen_PrzyciskZapiszNieInteresujeMnieDoXLS", tytul: "zapisz do XLS", id: "zapisnieinteresujemnie"}
            ]
        ];

        var ListaKolumn = {
            id: "ID",
            tytulpl: "Tytuł polski",
            tytulorg: "Tytuł oryginalny",
            rokprod: "Rok produkcji",
            jakbardzo: "Jak bardzo chcę",
            ulubione: "Ulubione",
            ocena: "Ocena",
            komentarz: "Komentarz",
            gatunek: "Gatunek",
            data: "Data",
        }

        var GlownyDiv = document.createElement("div");
        GlownyDiv.id = "glownydiv"
        GlownyDiv.style.display = "table";
        GlownyDiv.style.borderCollapse = "collapse";
        GlownyDiv.style.maxWidth = "66rem";
        GlownyDiv.style.width = "100%";
        GlownyDiv.style.margin = "0 auto";

        if (document.querySelector("#glownydiv") !== null)
        {
            document.querySelector("#glownydiv").remove();
        }

        Menu.parentNode.insertBefore(GlownyDiv, Menu.nextSibling);

        var GlownyDivBody = document.createElement("div");
        GlownyDivBody.id = "glownydivbody"
        GlownyDivBody.style.display = "table-row-group";
        GlownyDiv.appendChild(GlownyDivBody);

        for (var i = 0; i < TablicaDivow.length; i++)
        {
            window[TablicaDivow[i].selektor] = document.createElement("div");
            window[TablicaDivow[i].selektor].id = TablicaDivow[i].id;
            window[TablicaDivow[i].selektor].style.display = "table-row";
            GlownyDiv.appendChild(window[TablicaDivow[i].selektor]);
            TempNode = document.createElement("div");
            TempNode.style.border = "1px solid";
            TempNode.style.display = "table-cell";
            TempNode.style.padding = "6px 8px";

            if (TablicaDivow[i].id == "eksportnieinteresujemnie")
            {
                TempNode.style.color = "grey";
            }

            TempNode.textContent = TablicaDivow[i].tytul;
            window[TablicaDivow[i].selektor].appendChild(TempNode);

            for (var j = 0; j < TablicaPrzyciskow[i].length; j++)
            {
                TempNode = document.createElement("div");
                TempNode.style.border = "1px solid";
                TempNode.style.display = "table-cell";
                TempNode.style.padding = "6px 8px";
                window[TablicaDivow[i].selektor].appendChild(TempNode);
                window[TablicaPrzyciskow[i][j].selektor] = document.createElement("a");
                window[TablicaPrzyciskow[i][j].selektor].style.cursor = "pointer";
                TempNode.appendChild(window[TablicaPrzyciskow[i][j].selektor]);
            }
        }

        Reset();
    }

    function Reset()
    {
        for (var i = 0; i < TablicaPrzyciskow.length; i++)
        {
            for (var j = 0; j < TablicaPrzyciskow[i].length; j++)
            {
                window[TablicaPrzyciskow[i][j].selektor].textContent = TablicaPrzyciskow[i][j].tytul;
                window[TablicaPrzyciskow[i][j].selektor].id = TablicaPrzyciskow[i][j].id;
                window[TablicaPrzyciskow[i][j].selektor].style.color = "";

                if (j < 4)
                {
                    if (i < 2)
                    {
                        window[TablicaPrzyciskow[i][j].selektor].addEventListener("click", PrzygotowanieDoPobierania, false);
                    }
                    else
                    {
                        window[TablicaPrzyciskow[i][j].selektor].addEventListener("click", Nieaktywne, false);
                        window[TablicaPrzyciskow[i][j].selektor].style.color = "grey";
                    }
                }
                else
                {
                    window[TablicaPrzyciskow[i][j].selektor].addEventListener("click", Ostrzezenie, false);
                    window[TablicaPrzyciskow[i][j].selektor].style.color = "grey";
                }

                if (j === TablicaPrzyciskow[i].length-1)
                {
                    window[TablicaPrzyciskow[i][j].selektor].removeAttribute("download");
                    window[TablicaPrzyciskow[i][j].selektor].removeAttribute("href");
                }
            }
        }

        KtoraStrona = 0;
        CzyStrona = 1;
        LiczbaOcen = 0;
        LiczbaPobranychOcen = 0;

        EksportOcen_PrzyciskZapiszOcenyDoXLS.removeEventListener("click", ZapiszOcenyDoXLS, false);
        EksportOcen_PrzyciskZapiszChceZobaczycDoXLS.removeEventListener("click", ZapiszChceZobaczycDoXLS, false);
        EksportOcen_PrzyciskZapiszNieInteresujeMnieDoXLS.removeEventListener("click", ZapiszNieInteresujeMnieDoXLS, false);

        document.title = TytulStrony;
    }

    function PrzygotowanieDoPobierania()
    {
        TempArray = this.id.split(",");
        NumerDiva = parseInt(TempArray[0]);
        NumerPrzycisku = parseInt(TempArray[1]);
        Reset();

        StworzTabelke();
        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "rozpoczynanie pobierania...";
        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";

        if (NumerDiva === 0)
        {
                var Request = new XMLHttpRequest();
                Request.onerror = function()
                {
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";
                };
                Request.onload = function()
                {
                   LiczbaOcen = this.response;
                };

                var Parametr;
                if (KtoToJest == "ja")
                {
                    Parametr = "logged/vote/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].tytul_fw+"/count";
                }
                else if (KtoToJest == "znajomy")
                {
                    Parametr = "user/"+NazwaProfilu+"/votes/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].tytul_fw+"/count";
                }

                Request.open("GET", "https://www.filmweb.pl/api/v1/"+Parametr, false);
                Request.send();

                if (LiczbaOcen > 0)
                {
                    PobierzOceny();
                }
                else
                {
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "brak ocen";
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "green";
                }
        }
        else if (NumerDiva === 1)
        {
                var Request = new XMLHttpRequest();
                Request.onerror = function()
                {
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";
                };
                Request.onload = function()
                {
                   LiczbaOcen = this.response;
                };

                var Parametr;
                if (KtoToJest == "ja")
                {
                    Parametr = "logged/want2see/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].tytul_fw+"/count";
                }
                else if (KtoToJest == "znajomy")
                {
                    Parametr = "user/"+NazwaProfilu+"/want2see/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].tytul_fw+"/count";
                }

                Request.open("GET", "https://www.filmweb.pl/api/v1/"+Parametr, false);
                Request.send();

                if (LiczbaOcen > 0)
                {
                    PobierzChce();
                }
                else
                {
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "brak wpisów";
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "green";
                }
        }
        else if (NumerDiva === 2)
        {
                var Request = new XMLHttpRequest();
                Request.onerror = function()
                {
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";
                };
                Request.onload = function()
                {
                   LiczbaOcen = this.response;
                };

                var Parametr;
                if (KtoToJest == "ja")
                {
                    Parametr = "logged/dontwant2see/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].tytul_fw+"/count";
                }
                else if (KtoToJest == "znajomy")
                {
                    Parametr = "user/"+NazwaProfilu+"/dontwant2see/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].tytul_fw+"/count";
                }

                Request.open("GET", "https://www.filmweb.pl/api/v1/"+Parametr, false);
                Request.send();

                if (LiczbaOcen > 0)
                {
                    PobierzNieInteresujeMnie();
                }
                else
                {
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "brak wpisów";
                    window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "green";
                }
        }
    }

    function PobierzOceny()
    {
        KtoraStrona++;

        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "pobrano "+LiczbaPobranychOcen+"/"+LiczbaOcen+" ocen";
        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";

        document.title = "(Pobrano "+Math.round(LiczbaPobranychOcen/LiczbaOcen*100)+"%) "+TytulStrony;

        if (CzyStrona && LiczbaPobranychOcen < LiczbaOcen)
        {
            var Request = new XMLHttpRequest();
            Request.onerror = function()
            {
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "red";
            };
            Request.onload = PrzetworzOceny;

            var Parametr;
            if (KtoToJest == "ja")
            {
                Parametr = "logged/vote/title";
            }
            else if (KtoToJest == "znajomy")
            {
                Parametr = "logged/friend/"+NazwaProfilu+"/vote/title";
            }

            Request.open("GET", "https://www.filmweb.pl/api/v1/"+Parametr+"/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].parametr+KtoraStrona, true);
            Request.send();
        }
        else
        {
            EksportOcen_PrzyciskZapiszOcenyDoXLS.removeEventListener("click", Ostrzezenie, false);
            EksportOcen_PrzyciskZapiszOcenyDoXLS.addEventListener("click", ZapiszOcenyDoXLS, false);
            EksportOcen_PrzyciskZapiszOcenyDoXLS.setAttribute("download", NazwaProfilu+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].plik);
            EksportOcen_PrzyciskZapiszOcenyDoXLS.style.color = "";

            window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "green";
        }
    }

    function PobierzChce()
    {
        KtoraStrona++;

        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "pobrano "+LiczbaPobranychOcen+"/"+LiczbaOcen+" wpisów";
        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";

        document.title = "(Pobrano "+Math.round(LiczbaPobranychOcen/LiczbaOcen*100)+"%) "+TytulStrony;

        if (CzyStrona && LiczbaPobranychOcen < LiczbaOcen)
        {
            var Request = new XMLHttpRequest();
            Request.onerror = function()
            {
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "red";
            };
            Request.onload = PrzetworzChce;

            var Parametr;
            if (KtoToJest == "ja")
            {
                Parametr = "logged/want2see";
            }
            else if (KtoToJest == "znajomy")
            {
                Parametr = "logged/friend/"+NazwaProfilu+"/want2see";
            }

            Request.open("GET", "https://www.filmweb.pl/api/v1/"+Parametr+"/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].parametr+KtoraStrona, true);
            Request.send();
        }
        else
        {
            EksportOcen_PrzyciskZapiszChceZobaczycDoXLS.removeEventListener("click", Ostrzezenie, false);
            EksportOcen_PrzyciskZapiszChceZobaczycDoXLS.addEventListener("click", ZapiszChceZobaczycDoXLS, false);
            EksportOcen_PrzyciskZapiszChceZobaczycDoXLS.setAttribute("download", NazwaProfilu+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].plik);
            EksportOcen_PrzyciskZapiszChceZobaczycDoXLS.style.color = "";

            window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "green";
        }
    }

    function PobierzNieInteresujeMnie()
    {
        KtoraStrona++;

        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "pobrano "+LiczbaPobranychOcen+"/"+LiczbaOcen+" wpisów";
        window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";

        document.title = "(Pobrano "+Math.round(LiczbaPobranychOcen/LiczbaOcen*100)+"%) "+TytulStrony;

         if (CzyStrona && LiczbaPobranychOcen < LiczbaOcen)
        {
            var Request = new XMLHttpRequest();
            Request.onerror = function()
            {
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "red";
            };
            Request.onload = PrzetworzNieInteresujeMnie;

            var Parametr;
            if (KtoToJest == "ja")
            {
                Parametr = "logged/dontwant2see";
            }
            else if (KtoToJest == "znajomy")
            {
                Parametr = "logged/friend/"+NazwaProfilu+"/dontwant2see";
            }

            Request.open("GET", "https://www.filmweb.pl/api/v1/"+Parametr+"/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].parametr+KtoraStrona, true);
            Request.send();
        }
        else
        {
            EksportOcen_PrzyciskZapiszNieInteresujeMnieDoXLS.removeEventListener("click", Ostrzezenie, false);
            EksportOcen_PrzyciskZapiszNieInteresujeMnieDoXLS.addEventListener("click", ZapiszNieInteresujeMnieDoXLS, false);
            EksportOcen_PrzyciskZapiszNieInteresujeMnieDoXLS.setAttribute("download", NazwaProfilu+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].plik);
            EksportOcen_PrzyciskZapiszNieInteresujeMnieDoXLS.style.color = "";

            window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "green";
        }
    }

    function PrzetworzOceny()
    {
        var PageInfo = JSON.parse(this.responseText);

        if (this.responseText == "[]")
        {
            CzyStrona = 0;

            PobierzOceny();

            return;
        }

        for (var i = 0; i < PageInfo.length; i++)
        {
            var ID = PageInfo[i].entity;

            var MovieInfo = null;
            var MovieURL = "https://www.filmweb.pl/api/v1/title/"+ID+"/info";

            var Request = new XMLHttpRequest();
            Request.onerror = function()
            {
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";
            };
            Request.onload = function()
            {
                try
                {
                    MovieInfo = JSON.parse(this.response);
                }
                catch (e)
                {
                    MovieInfo = null;
                }
            };
            Request.open("GET", MovieURL, false);
            Request.setRequestHeader("x-locale", "PL");
            Request.send();

            if (MovieInfo === null)
            {
                continue;
            }

            var VoteInfo = null;

            var Parametr;
            if (KtoToJest == "ja")
            {
                Parametr = "logged/vote";
            }
            else if (KtoToJest == "znajomy")
            {
                Parametr = "logged/friend/"+NazwaProfilu+"/vote";
            }

            var VoteURL = "https://www.filmweb.pl/api/v1/"+Parametr+"/"+TablicaPrzyciskow[NumerDiva][NumerPrzycisku].tytul_fw+"/"+ID+"/details";

            var Request = new XMLHttpRequest();
            Request.onerror = function()
            {
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";
            };
            Request.onload = function()
            {
                try
                {
                    VoteInfo = JSON.parse(this.response);
                }
                catch (e)
                {
                    VoteInfo = null;
                }
            };
            Request.open("GET", VoteURL, false);
            Request.send();

            if (VoteInfo === null)
            {
                continue;
            }

            RowSelector = Tabela.insertRow();

            //ID
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = ID;

            //Tytuł polski
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.title;

            //Tytuł oryginalny
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.originalTitle;

            //Rok produkcji
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.year;

            //Ulubione
            CellSelector = RowSelector.insertCell();
            if (VoteInfo.favorite)
            {
                CellSelector.textContent = "tak";
            }

            //Ocena
            CellSelector = RowSelector.insertCell();
            VoteInfo.rate == 0 ? CellSelector.textContent = "brak oceny" : CellSelector.textContent = VoteInfo.rate;

            //Komentarz
            CellSelector = RowSelector.insertCell();
            if (VoteInfo.comment)
            {
                CellSelector.textContent = VoteInfo.comment;
            }

            //Gatunek
            CellSelector = RowSelector.insertCell();

            //Data
            CellSelector = RowSelector.insertCell();
            if (VoteInfo.viewDate)
            {
                var date = VoteInfo.viewDate.toString().substring(0, 4);
                if (VoteInfo.viewDate.toString().substring(4, 6) != "00")
                {
                    date = VoteInfo.viewDate.toString().substring(4, 6)+"-"+date;
                    if (VoteInfo.viewDate.toString().substring(6, 8) != "00")
                    {
                        date = VoteInfo.viewDate.toString().substring(6, 8)+"-"+date;
                    }
                }

                CellSelector.textContent = date;
            }

            LiczbaPobranychOcen++;
        }

        setTimeout(function()
        {
           PobierzOceny();
        }, OpoznieniePobraniaStrony);
    }

    function PrzetworzChce()
    {
        var PageInfo = JSON.parse(this.responseText);

        if (this.responseText == "[]")
        {
            CzyStrona = 0;

            PobierzChce();

            return;
        }

        for (var i = 0; i < PageInfo.length; i++)
        {
            var ID = PageInfo[i].entity;

            var MovieInfo = null;
            var MovieURL = "https://www.filmweb.pl/api/v1/title/"+ID+"/info";

            var Request = new XMLHttpRequest();
            Request.onerror = function()
            {
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";
            };
            Request.onload = function()
            {
                try
                {
                   MovieInfo = JSON.parse(this.response);
                }
                catch (e)
                {
                    MovieInfo = null;
                }
            };
            Request.open("GET", MovieURL, false);
            Request.setRequestHeader("x-locale", "PL");
            Request.send();

            if (MovieInfo === null)
            {
                continue;
            }

            RowSelector = Tabela.insertRow();

            //ID
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = ID;

            //Tytuł polski
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.title;

            //Tytuł oryginalny
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.originalTitle;

            //Rok produkcji
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.year;

            //Jak bardzo chce
            var levels;
            if (KtoToJest == "ja")
            {
                levels = ["Interesuje mnie", "Kiedyś obejrzę", "Na pewno obejrzę", "Muszę obejrzeć", "Umrę jak nie zobaczę"];
            }
            else if (KtoToJest == "znajomy")
            {
                levels = ["Jest zainteresowany", "Kiedyś obejrzy", "Na pewno obejrzy", "Musi obejrzeć", "Umrze jak nie zobaczy"];
            }
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = levels[PageInfo[i].level - 1];

            //Gatunek
            CellSelector = RowSelector.insertCell();

            LiczbaPobranychOcen++;
        }

        setTimeout(function()
        {
            PobierzChce();
        }, OpoznieniePobraniaStrony);
    }

    function PrzetworzNieInteresujeMnie()
    {
        var PageInfo = JSON.parse(this.responseText);

        if (this.responseText == "[]")
        {
            CzyStrona = 0;

            PobierzNieInteresujeMnie();

            return;
        }

        for (var i = 0; i < PageInfo.length; i++)
        {
            var ID = PageInfo[i].entity;

            var MovieInfo = null;
            var MovieURL = "https://www.filmweb.pl/api/v1/title/"+ID+"/info";

            var Request = new XMLHttpRequest();
            Request.onerror = function()
            {
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].textContent = "błąd pobierania";
                window[TablicaPrzyciskow[NumerDiva][NumerPrzycisku].selektor].style.color = "darkorange";
            };
            Request.onload = function()
            {
                try
                {
                   MovieInfo = JSON.parse(this.response);
                }
                catch (e)
                {
                    MovieInfo = null;
                }
            };
            Request.open("GET", MovieURL, false);
            Request.setRequestHeader("x-locale", "PL");
            Request.send();

            if (MovieInfo === null)
            {
                continue;
            }

            RowSelector = Tabela.insertRow();

            //Tytuł polski
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.title;

            //Tytuł oryginalny
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.originalTitle;

            //Rok produkcji
            CellSelector = RowSelector.insertCell();
            CellSelector.textContent = MovieInfo.year;

            //Gatunek
            CellSelector = RowSelector.insertCell();

            LiczbaPobranychOcen++;
        }

        setTimeout(function()
        {
            PobierzNieChce();
        }, OpoznieniePobraniaStrony);
    }

    function ZapiszOcenyDoXLS()
    {
        return ExcellentExport.excel(EksportOcen_PrzyciskZapiszOcenyDoXLS, "userscript", "Oceny");
    }

    function ZapiszChceZobaczycDoXLS()
    {
        return ExcellentExport.excel(EksportOcen_PrzyciskZapiszChceZobaczycDoXLS, "userscript", "Chcę zobaczyć");
    }

    function ZapiszNieInteresujeMnieDoXLS()
    {
        return ExcellentExport.excel(EksportOcen_PrzyciskZapiszNieInteresujeMnieDoXLS, "userscript", "Nie interesuje mnie");
    }

    function StworzTabelke()
    {
        Tabela = document.querySelector("#userscript");
        if (Tabela !== null)
        {
            document.body.removeChild(Tabela);
        }
        Tabela = document.createElement("table");
        Tabela.id = "userscript";
        Tabela.style.display = "none";
        document.body.appendChild(Tabela);
        RowSelector = Tabela.insertRow();

        KtoreElementy = TablicaPrzyciskow[NumerDiva][NumerPrzycisku].ktoreelementy.split(",");
        for (var i = 0; i < KtoreElementy.length; i++)
        {
            CellSelector = document.createElement("th");
            CellSelector.id = "abc";
            CellSelector.textContent = ListaKolumn[KtoreElementy[i]];
            RowSelector.appendChild(CellSelector);
        }
    }

    function Ostrzezenie()
    {
        alert("Najpierw pobierz którąś kategorię.");
    }

    function Nieaktywne()
    {
        alert("Niestety Filmweb nie udostępnia aktualnie tych danych.");
    }

}, 2000);