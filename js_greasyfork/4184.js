// ==UserScript==
// @name        BajkiTV.pl Avatary użytkowników na czacie serwisu. Autor skryptu: Przmus
// @namespace   http://bajkitv.pl
// @include     http://bajkitv.pl*
// @version     4.5
var wersja = 4.5;
// @grant       none
// @description Skrypt wyświetlający avatary użytkowników obok wiadomości na czacie w serwisie BajkiTV.pl
// @downloadURL https://update.greasyfork.org/scripts/4184/BajkiTVpl%20Avatary%20u%C5%BCytkownik%C3%B3w%20na%20czacie%20serwisu%20Autor%20skryptu%3A%20Przmus.user.js
// @updateURL https://update.greasyfork.org/scripts/4184/BajkiTVpl%20Avatary%20u%C5%BCytkownik%C3%B3w%20na%20czacie%20serwisu%20Autor%20skryptu%3A%20Przmus.meta.js
// ==/UserScript==

/*
Oficjalny poradnik dotyczący skryptu, znajduje się tutaj: http://bajkitv.pl/poradnik_wyswietlanie_awatarow_uzytkownikow_obok_wiadomosci_na_czacie_w_serwisie_bajkitvpl-t39127
Czytaj uważnie notatki poza zmiennymi (var), jest tam objaśnione co dana opcja zmienia.
Miłego dnia życzy: Przmus.
 */

/////////////////////// KONFIGURACJA ////////////////////////
var KonfiguracjaGraficzna = true; // Od teraz skrypt można skonfigurować klikając na ikonkę "narzędzi", znajdującą się obok przycisku "Wyślij" na czacie.
//PONIŻSZE USTAWIENIA TO USTAWIENIA DOMYŚLNE, DZIAŁAJĄCE PO PRZYWRÓCENIU USTAWIEŃ FABRYCZNYCH:

var avatary_na_czacie = true; // "true" - włączone avatary na czacie, "false" - wyłączone.
var pisanie_od_gory = true; // "true" - wyświetlanie pola do pisania wiadomości na czacie od góry, "false" - wyświetlanie tego pola normalnie normalnie.
var odswiez_avatary_co_minut = 10; // Co ile minut aktualizować avatary? (Dopiero co X minut awatary będą się aktualizować na obecne). Mniejsza wartość może spowolinić wczytywanie strony.
var uzyj_wiekszych_avatarow = false; // "true" - używaj większych avatarów, "false" - używaj avatarów mieszczących się w rozmiarze domyślnym wiadomości na czacie.
var zachowaj_proporcje_16x13 = false; // "true" - zachowaj proporcje awatarów: 16:13, "false" - nie zachowuj proporcji i pokaż awatary w "kwadratowe".
var zachowaj_proporcje = false; // Opcja niezalecana! "true" - zachowuj proporcje awatarów względem ich szerokości, "false" - nie zachowuj tych proporcji.
var jaki_znak_dodawac = ""; // jaki znak dodawać przed nickiem użytkownika po kliknięciu na jego awatar? Zostaw to pole puste (""), aby nie dodawać.
var nowy_dzwiek_na_czacie = true; // Czy włączyć nowy dźwięk na czacie? Jeśli tak, zaleca się wyłączyć stary dźwięk w preferencjach: http://bajkitv.pl/ustawienia-prefs
var nowy_dzwiek_link = "http://przmus.ct8.pl/dzwieki/sound3.ogg"; //link do nowego dźwięku. Na serwerze przmus.ct8.pl dostępne są dźwięki od sound1.ogg do sound19.ogg.
var dzwiek_przy_nieaktywnym = true; // "true" - odtwarzaj dźwięk na czacie, tylko jeśli karta bajkitv.pl jest nieaktywne, "false" - używaj dźwięku na czacie przy nadejściu każdej wiadomości.
var inny_dzwiek_przy_aktywnym = true; // "true" - gdy opcja "dzwiek_przy_nieaktywnym" jest włączona używaj innego dźwięku przy nadejściu wiadomości w aktywnej karcie (zalecany krótszy dźwięk).
var inny_dzwiek_link = "http://przmus.ct8.pl/dzwieki/sound14.ogg"; //link do dźwięku używanego przy nadejściu wiadomości w aktywnej karcie, gdy opcja "inny_dzwiek_przy_aktywnym" jest aktywna.
var odsetki_w_banku = true; // "true" - włącza powiadomienia dotyczące potrzeby odwiedzenia banku serwisowego w celu naliczenia odsetek, "false" - wyłącza te powiadomienia.
var dzwiek_nowej_pw = true; // "true" - włącza powiadomienie dźwiękowe przy nadejściu nowej Prywatnej Wiadomości, "false" - wyłącza dźwięk przy nadejściu nowej PW.
var dzwiek_nowej_pw_link = "http://przmus.ct8.pl/dzwieki/sound8.ogg"; //link do dźwięku używanego przy nadejściu nowej Prywatnej Wiadomości.

//Lista ignorowanych użytkowników w postach na forum. Kolejnych użytkowników dodawaj w cudzysłowach, po przecinku, np: "Użytkownik1","Użytkownik2","Użytkowik3" itd.
//Nigdy nie zostawiaj tego pola pustego. Jeśli nie chcesz nikogo ignorować to wpisz coś w stylu: "Użytkownik1blablabla222".
var ignore_list = [
    "TutajWpiszNick1","TutajWpiszNick2","TutajWpiszNick3"
]

//Lista ignorowanych użytkowników w wiadomościach na czacie. Kolejnych użytkowników dodawaj w cudzysłowach, po przecinku, np: "Użytkownik1","Użytkownik2","Użytkowik3" itd.
//Nigdy nie zostawiaj tego pola pustego. Jeśli nie chcesz nikogo ignorować to wpisz coś w stylu: "Użytkownik1blablabla222".
var ignore_list_czat = [
    "TutajWpiszNick1","TutajWpiszNick2","TutajWpiszNick3"
]

var ignoruj_posty = false; //"true" aby włączyć ignorowanie postów wybranych użytkowników, "false" aby wyłączyć.
var ignoruj_na_czacie = false; //"true" aby włączyć ignorowanie wiadomości na czacie wybranych użytkowników, "false" aby wyłączyć.
var info_o_ukryciu_posty = true; // czy wyświetlić informację o ukryciu postu zignorowanego użytkownika?
var info_o_ukryciu_czat = true; // czy wyświetlić informację o wiadomości na czacie zignorowanego użytkownika?
var kopia_robocza_postów = true; // "true" - włączona kopia robocza postów, "false" - wyłączona.
var kopia_robocza_czat = true; // "true" - właczona kopia robocza na czacie, "false" - wyłączona.
var co_ile_sekund_zapisywac = 10; // Co ile sekund zapisywać post do kopii roboczej?
var co_ile_sekund_czat = 5; // Co ile sekund zapisywać wiadomość na czacie do kopii roboczej?
//////////////////// KONIEC KONFIGURACJI ////////////////////





















 //alert('hi');
var StopStopStop = false;
var datee = new Date();
datee.setTime(datee.getTime());
var expirese = datee.toUTCString();
localStorage['aktualnie'] = expirese;

if (localStorage['settings16'] === undefined){
    localStorage['settings16'] = "0";
}

var Wtejchwili = new Date(localStorage['aktualnie']);
var Wylaczono = new Date(localStorage['settings16']);
 //alert('hi');
if (Wylaczono > Wtejchwili){

   StopStopStop = true;
    var hide2 = document.getElementById('open_chat');
if (hide2.remove()){}
var hide1;
if (hide1 = document.getElementById('main_chat')){
if (hide1.remove()){}}
function hid2(){
var hide3;
if (hide3 = document.getElementById('open_chat')){
    if (hide3.remove()){}}
}
window.onload = hid2();
}

if (KonfiguracjaGraficzna){
    //0 = true, 1 = false
    var checkedValue = 'checked="checked"';
    var checkedValue4 = 'selected="selected"';
    var checked1a;
    var checked1b;
    var checked7a;
    var checked7b;
    var checked8a;
    var checked8b;
    var checked9a;
    var checked9b;
    var checked9c;
    var checked11a;
    var checked11b;
    var checked11c;
    var checked13a;
    var checked13b;
    var checked13c;
    var checked3a;
    var checked3b;
    var checked3c;
    var checked3d;
    var checked3e;
    var checked3f;
    var checked40 = "";
    var checked4a = "";
    var checked4b = "";
    var checked4c = "";
    var checked4d = "";
    var checked4e = "";
    var checked4f = "";
    var checked4g = "";
    var checked4h = "";
    var checked4i = "";
    var checked4j = "";
    var checked4k = "";
    var checked4l = "";
    var checked4m = "";
    var checked4n = "";
    var checked4o = "";
    var checked4p = "";
    var checked4r = "";
    var checked4s = "";
    var checked4t = "";
    var checked4custom = "";
    var checked50 = "";
    var checked5a = "";
    var checked5b = "";
    var checked5c = "";
    var checked5d = "";
    var checked5e = "";
    var checked5f = "";
    var checked5g = "";
    var checked5h = "";
    var checked5i = "";
    var checked5j = "";
    var checked5k = "";
    var checked5l = "";
    var checked5m = "";
    var checked5n = "";
    var checked5o = "";
    var checked5p = "";
    var checked5r = "";
    var checked5s = "";
    var checked5t = "";
    var checked5custom = "";
    
    var checked60 = "";
    var checked6a = "";
    var checked6b = "";
    var checked6c = "";
    var checked6d = "";
    var checked6e = "";
    var checked6f = "";
    var checked6g = "";
    var checked6h = "";
    var checked6i = "";
    var checked6j = "";
    var checked6k = "";
    var checked6l = "";
    var checked6m = "";
    var checked6n = "";
    var checked6o = "";
    var checked6p = "";
    var checked6r = "";
    var checked6s = "";
    var checked6t = "";
    var checked6custom = "";
    
    if (localStorage['settings1'] === undefined){
        //alert('undefined');
        if (avatary_na_czacie) {
            localStorage['settings1'] = "0";
            //alert('set 0');
        }
        else {
            localStorage['settings1'] = "1";
            //alert('set 1');
        }
    }
    else if (localStorage['settings1'] == "0"){
        //alert('is 0');
        avatary_na_czacie = true;
    }
        if (localStorage['settings1'] == "1"){
            //alert('is 2');
            avatary_na_czacie = false;
        }
    
    if (avatary_na_czacie){
        checked1a = checkedValue;
        checked1b = ' ';
    }
    else {
        checked1a = ' ';
        checked1b = checkedValue;
    }
    
    
    if (localStorage['settings7'] === undefined){
        //alert('undefined');
        if (pisanie_od_gory) {
            localStorage['settings7'] = "0";
            //alert('set 0');
        }
        else {
            localStorage['settings7'] = "1";
            //alert('set 1');
        }
    }
    if (localStorage['settings7'] == "0"){
        //alert('is 0');
        pisanie_od_gory = true;
    }
    else if (localStorage['settings7'] == "1"){
        //alert('is 2');
        pisanie_od_gory = false;
    }
        
        if (pisanie_od_gory){
            checked7a = checkedValue;
            checked7b = ' ';
        }
    else {
        checked7a = ' ';
        checked7b = checkedValue;
    }
    
    if (localStorage['settings8'] === undefined){
        //alert('undefined');
        if (odsetki_w_banku) {
            localStorage['settings8'] = "0";
            //alert('set 0');
        }
        else {
            localStorage['settings8'] = "1";
            //alert('set 1');
        }
    }
    if (localStorage['settings8'] == "0"){
        //alert('is 0');
        odsetki_w_banku = true;
    }
    else if (localStorage['settings8'] == "1"){
        //alert('is 2');
        odsetki_w_banku = false;
    }
        
        if (odsetki_w_banku){
            checked8a = checkedValue;
            checked8b = ' ';
        }
    else {
        checked8a = ' ';
        checked8b = checkedValue;
    }
    
    
    if (localStorage['settings9'] === undefined){
        //alert('undefined');
        if (ignoruj_na_czacie) {
            localStorage['settings9'] = "1";
            if (info_o_ukryciu_czat) {
                localStorage['settings9'] = "0";
            }
        }
        else {
            localStorage['settings9'] = "2";
        }
    }
    if (localStorage['settings9'] == "0"){
        ignoruj_na_czacie = true;
        info_o_ukryciu_czat = true;
    }
    else if (localStorage['settings9'] == "1"){
        ignoruj_na_czacie = true;
        info_o_ukryciu_czat = false;
    }
        else {
            ignoruj_na_czacie = false;
            info_o_ukryciu_czat = false;
        }
    
    if (ignoruj_na_czacie){
        if (info_o_ukryciu_czat){
            checked9a = checkedValue;
            checked9b = ' ';
            checked9c = ' ';
        }
        else {
            checked9a = ' ';
            checked9b = checkedValue;
            checked9c = ' ';
        }
    }
    else {
        checked9a = ' ';
        checked9b = ' ';
        checked9c = checkedValue;
    }
    
    if (localStorage['settings11'] === undefined){
        //alert('undefined');
        if (ignoruj_posty) {
            localStorage['settings11'] = "1";
            if (info_o_ukryciu_posty) {
                localStorage['settings11'] = "0";
            }
        }
        else {
            localStorage['settings11'] = "2";
        }
    }
    if (localStorage['settings11'] == "0"){
        ignoruj_posty = true;
        info_o_ukryciu_posty = true;
    }
    else if (localStorage['settings11'] == "1"){
        ignoruj_posty = true;
        info_o_ukryciu_posty = false;
    }
        else {
            ignoruj_posty = false;
            info_o_ukryciu_posty = false;
        }
    
    if (ignoruj_posty){
        if (info_o_ukryciu_posty){
            checked11a = checkedValue;
            checked11b = ' ';
            checked11c = ' ';
        }
        else {
            checked11a = ' ';
            checked11b = checkedValue;
            checked11c = ' ';
        }
    }
    else {
        checked11a = ' ';
        checked11b = ' ';
        checked11c = checkedValue;
    }
    
    
    if (localStorage['settings13'] === undefined){
        //alert('undefined');
        if (kopia_robocza_czat) {
            localStorage['settings13'] = "0";
            if (kopia_robocza_postów) {
                localStorage['settings13'] = "0";
            }
        }
        else if (kopia_robocza_postów) {
            localStorage['settings13'] = "1";
        }
            else {
                localStorage['settings13'] = "2";
            }
    }
    if (localStorage['settings13'] == "0"){
        kopia_robocza_czat = true;
        kopia_robocza_postów = true;
    }
    else if (localStorage['settings13'] == "1"){
        kopia_robocza_czat = false;
        kopia_robocza_postów = true;
    }
        else {
            kopia_robocza_czat = false;
            kopia_robocza_postów = false;
        }
    
    if (kopia_robocza_czat){
        checked13a = checkedValue;
        checked13b = ' ';
        checked13c = ' ';
    }
    else if (kopia_robocza_postów){
        checked13a = ' ';
        checked13b = checkedValue;
        checked13c = ' ';
    }
        else {
            checked13a = ' ';
            checked13b = ' ';
            checked13c = checkedValue;
        }
    
    
    
    if (localStorage['settings2'] === undefined){
        // alert('undefined');
        localStorage['settings2'] = odswiez_avatary_co_minut;
    }
    else {
        odswiez_avatary_co_minut = localStorage['settings2'];
    }
    
    
    
    if (localStorage['settings10'] === undefined){
        //alert('undefined');
        localStorage['settings10'] = ignore_list_czat;
        var strignoreczat = localStorage['settings10'];
        ignore_list_czat = strignoreczat.split(",");
    }
    else {
        var strignoreczat = localStorage['settings10'];
        ignore_list_czat = strignoreczat.split(",");
    }
    
    
    if (localStorage['settings12'] === undefined){
        //alert('undefined');
        localStorage['settings12'] = ignore_list;
        var strignore = localStorage['settings12'];
        ignore_list = strignore.split(",");
    }
    else {
        var strignore = localStorage['settings12'];
        ignore_list = strignore.split(",");
    }
    
    if (localStorage['settings14'] === undefined){
        //alert('undefined');
        localStorage['settings14'] = co_ile_sekund_czat;
        var strigtimeczat = localStorage['settings14'];
        co_ile_sekund_czat = strigtimeczat.split(",");
    }
    else {
        var strigtimeczat = localStorage['settings14'];
        co_ile_sekund_czat = strigtimeczat.split(",");
    }
    
    
    if (localStorage['settings15'] === undefined){
        //alert('undefined');
        localStorage['settings15'] = co_ile_sekund_zapisywac;
        var strigtimepost = localStorage['settings15'];
        ignore_list = strigtimeposte.split(",");
    }
    else {
        var strigtimepost = localStorage['settings15'];
        co_ile_sekund_zapisywac = strigtimepost.split(",");
    }
    
    
    
    if (localStorage['settings3'] === undefined){
        //alert('undefined');
        if (!uzyj_wiekszych_avatarow) {
            if (!zachowaj_proporcje_16x13){
                if (!zachowaj_proporcje){
                    localStorage['settings3'] = "0";
                    checked3a = checkedValue;
                    checked3b = "";
                    checked3c = "";
                    checked3d = "";
                    checked3e = "";
                    checked3f = "";
                    //alert('set 0');
                }
            }
        }
        if (!uzyj_wiekszych_avatarow) {
            if (zachowaj_proporcje_16x13){
                localStorage['settings3'] = "1";
                checked3a = "";
                checked3b = checkedValue;
                checked3c = "";
                checked3d = "";
                checked3e = "";
                checked3f = "";
            }
        }
        if (!uzyj_wiekszych_avatarow) {
            if (!zachowaj_proporcje_16x13){
                if (zachowaj_proporcje){
                    localStorage['settings3'] = "2";
                    checked3a = "";
                    checked3b = "";
                    checked3c = checkedValue;
                    checked3d = "";
                    checked3e = "";
                    checked3f = "";
                }
            }
        }
        if (uzyj_wiekszych_avatarow) {
            if (!zachowaj_proporcje_16x13){
                if (!zachowaj_proporcje){
                    localStorage['settings3'] = "3";
                    checked3a = "";
                    checked3b = "";
                    checked3c = "";
                    checked3d = checkedValue;
                    checked3e = "";
                    checked3f = "";
                }
            }
        }
        if (uzyj_wiekszych_avatarow) {
            if (zachowaj_proporcje_16x13){
                localStorage['settings3'] = "4";
                checked3a = "";
                checked3b = "";
                checked3c = "";
                checked3d = "";
                checked3e = checkedValue;
                checked3f = "";
            }
        }
        if (uzyj_wiekszych_avatarow) {
            if (!zachowaj_proporcje_16x13){
                if (zachowaj_proporcje){
                    localStorage['settings3'] = "5";
                    checked3a = "";
                    checked3b = "";
                    checked3c = "";
                    checked3d = "";
                    checked3e = "";
                    checked3f = checkedValue;
                }
            }
        }
    }
    
    
    if (localStorage['settings3'] == "0"){
        uzyj_wiekszych_avatarow = false;
        zachowaj_proporcje_16x13 = false;
        zachowaj_proporcje = false;
        checked3a = checkedValue;
        checked3b = "";
        checked3c = "";
        checked3d = "";
        checked3e = "";
        checked3f = "";
    }
    else if (localStorage['settings3'] == "1"){
        uzyj_wiekszych_avatarow = false;
        zachowaj_proporcje_16x13 = true;
        zachowaj_proporcje = false;
        checked3a = "";
        checked3b = checkedValue;
        checked3c = "";
        checked3d = "";
        checked3e = "";
        checked3f = "";
    }
        else if (localStorage['settings3'] == "2"){
            uzyj_wiekszych_avatarow = false;
            zachowaj_proporcje_16x13 = false;
            zachowaj_proporcje = true;
            checked3a = "";
            checked3b = "";
            checked3c = checkedValue;
            checked3d = "";
            checked3e = "";
            checked3f = "";
        }
        else if (localStorage['settings3'] == "3"){
            uzyj_wiekszych_avatarow = true;
            zachowaj_proporcje_16x13 = false;
            zachowaj_proporcje = false;
            checked3a = "";
            checked3b = "";
            checked3c = "";
            checked3d = checkedValue;
            checked3e = "";
            checked3f = "";
        }
            else if (localStorage['settings3'] == "4"){
                uzyj_wiekszych_avatarow = true;
                zachowaj_proporcje_16x13 = true;
                zachowaj_proporcje = false;
                checked3a = "";
                checked3b = "";
                checked3c = "";
                checked3d = "";
                checked3e = checkedValue;
                checked3f = "";
            }
            else if (localStorage['settings3'] == "5"){
                uzyj_wiekszych_avatarow = true;
                zachowaj_proporcje_16x13 = false;
                zachowaj_proporcje = true;
                checked3a = "";
                checked3b = "";
                checked3c = "";
                checked3d = "";
                checked3e = "";
                checked3f = checkedValue;
            }
                
                var dzwiek00 = "http://przmus.ct8.pl/dzwieki/sound";
    var dzwiek01 = "http://przmus.ct8.pl/dzwieki/sound1.ogg";
    var dzwiek02 = "http://przmus.ct8.pl/dzwieki/sound2.ogg";
    var dzwiek03 = "http://przmus.ct8.pl/dzwieki/sound3.ogg";
    var dzwiek04 = "http://przmus.ct8.pl/dzwieki/sound4.ogg";
    var dzwiek05 = "http://przmus.ct8.pl/dzwieki/sound5.ogg";
    var dzwiek06 = "http://przmus.ct8.pl/dzwieki/sound6.ogg";
    var dzwiek07 = "http://przmus.ct8.pl/dzwieki/sound7.ogg";
    var dzwiek08 = "http://przmus.ct8.pl/dzwieki/sound8.ogg";
    var dzwiek09 = "http://przmus.ct8.pl/dzwieki/sound9.ogg";
    var dzwiek10 = "http://przmus.ct8.pl/dzwieki/sound10.ogg";
    var dzwiek11 = "http://przmus.ct8.pl/dzwieki/sound11.ogg";
    var dzwiek12 = "http://przmus.ct8.pl/dzwieki/sound12.ogg";
    var dzwiek13 = "http://przmus.ct8.pl/dzwieki/sound13.ogg";
    var dzwiek14 = "http://przmus.ct8.pl/dzwieki/sound14.ogg";
    var dzwiek15 = "http://przmus.ct8.pl/dzwieki/sound15.ogg";
    var dzwiek16 = "http://przmus.ct8.pl/dzwieki/sound16.ogg";
    var dzwiek17 = "http://przmus.ct8.pl/dzwieki/sound17.ogg";
    var dzwiek18 = "http://przmus.ct8.pl/dzwieki/sound18.ogg";
    var dzwiek19 = "http://przmus.ct8.pl/dzwieki/sound19.ogg";
    
    if (localStorage['settings4'] === undefined){
        if (nowy_dzwiek_na_czacie){
            nowy_dzwiek_na_czacie = true;
            nowy_dzwiek_link = dzwiek03;
            checked4c = checkedValue4;
            
            localStorage['settings4'] = "3";
        }
        else {
            checked40 = checkedValue4;
            localStorage['settings4'] = "0";
        }
    }
    if (localStorage['settings4'] == "0"){
        nowy_dzwiek_na_czacie = false;
        nowy_dzwiek_link = nowy_dzwiek_link;
        checked40 = checkedValue4;
    }
    else if (localStorage['settings4'] == "1"){
        nowy_dzwiek_na_czacie = true;
        nowy_dzwiek_link = dzwiek01;
        checked4a = checkedValue4;
        
    }
        else if (localStorage['settings4'] == "2"){
            nowy_dzwiek_na_czacie = true;
            nowy_dzwiek_link = dzwiek02;
            checked4b = checkedValue4;
        }
        else if (localStorage['settings4'] == "3"){
            nowy_dzwiek_na_czacie = true;
            nowy_dzwiek_link = dzwiek03;
            checked4c = checkedValue4;
        }
            else if (localStorage['settings4'] == "4"){
                nowy_dzwiek_na_czacie = true;
                nowy_dzwiek_link = dzwiek04;
                checked4d = checkedValue4;
            }
            else if (localStorage['settings4'] == "5"){
                nowy_dzwiek_na_czacie = true;
                nowy_dzwiek_link = dzwiek05;
                checked4e = checkedValue4;
            }
                else if (localStorage['settings4'] == "6"){
                    nowy_dzwiek_na_czacie = true;
                    nowy_dzwiek_link = dzwiek06;
                    checked4f = checkedValue4;
                }
                else if (localStorage['settings4'] == "7"){
                    nowy_dzwiek_na_czacie = true;
                    nowy_dzwiek_link = dzwiek07;
                    checked4g = checkedValue4;
                }
                    else if (localStorage['settings4'] == "8"){
                        nowy_dzwiek_na_czacie = true;
                        nowy_dzwiek_link = dzwiek08;
                        checked4h = checkedValue4;
                    }
                    else if (localStorage['settings4'] == "9"){
                        nowy_dzwiek_na_czacie = true;
                        nowy_dzwiek_link = dzwiek09;
                        checked4i = checkedValue4;
                    }
                        else if (localStorage['settings4'] == "10"){
                            nowy_dzwiek_na_czacie = true;
                            nowy_dzwiek_link = dzwiek10;
                            checked4j = checkedValue4;
                        }
                        else if (localStorage['settings4'] == "11"){
                            nowy_dzwiek_na_czacie = true;
                            nowy_dzwiek_link = dzwiek11;
                            checked4k = checkedValue4;
                        }
                            else if (localStorage['settings4'] == "12"){
                                nowy_dzwiek_na_czacie = true;
                                nowy_dzwiek_link = dzwiek12;
                                checked4l = checkedValue4;
                            }
                            else if (localStorage['settings4'] == "13"){
                                nowy_dzwiek_na_czacie = true;
                                nowy_dzwiek_link = dzwiek13;
                                checked4m = checkedValue4;
                            }
                                else if (localStorage['settings4'] == "14"){
                                    nowy_dzwiek_na_czacie = true;
                                    nowy_dzwiek_link = dzwiek14;
                                    checked4n = checkedValue4;
                                }
                                else if (localStorage['settings4'] == "15"){
                                    nowy_dzwiek_na_czacie = true;
                                    nowy_dzwiek_link = dzwiek15;
                                    checked4o = checkedValue4;
                                }
                                    else if (localStorage['settings4'] == "16"){
                                        nowy_dzwiek_na_czacie = true;
                                        nowy_dzwiek_link = dzwiek16;
                                        checked4p = checkedValue4;
                                    }
                                    else if (localStorage['settings4'] == "17"){
                                        nowy_dzwiek_na_czacie = true;
                                        nowy_dzwiek_link = dzwiek17;
                                        checked4r = checkedValue4;
                                    }
                                        else if (localStorage['settings4'] == "18"){
                                            nowy_dzwiek_na_czacie = true;
                                            nowy_dzwiek_link = dzwiek18;
                                            checked4s = checkedValue4;
                                        }
                                        else if (localStorage['settings4'] == "19"){
                                            nowy_dzwiek_na_czacie = true;
                                            nowy_dzwiek_link = dzwiek19;
                                            checked4t = checkedValue4;
                                        }
                                            else if (localStorage['settings4'] == "custom"){
                                                nowy_dzwiek_na_czacie = true;
                                                nowy_dzwiek_link = dzwiek03;
                                                checked4custom = checkedValue4;
                                            }
                                            else {
                                                nowy_dzwiek_na_czacie = true;
                                                nowy_dzwiek_link = localStorage['settings4'];
                                            }
    
    if (localStorage['settings5'] === undefined){
        if (inny_dzwiek_przy_aktywnym){
            inny_dzwiek_przy_aktywnym = true;
            
            checked5n = checkedValue4;
            inny_dzwiek_link = dzwiek14;
            
            localStorage['settings5'] = "14";
        }
        else {
            checked50 = checkedValue4;
            localStorage['settings5'] = "0";
        }
    }
    if (localStorage['settings5'] == "0"){
        inny_dzwiek_przy_aktywnym = false;
        inny_dzwiek_link = inny_dzwiek_link;
        checked50 = checkedValue4;
    }
    else if (localStorage['settings5'] == "1"){
        inny_dzwiek_przy_aktywnym = true;
        inny_dzwiek_link = dzwiek01;
        checked5a = checkedValue4;
        
    }
        else if (localStorage['settings5'] == "2"){
            inny_dzwiek_przy_aktywnym = true;
            inny_dzwiek_link = dzwiek02;
            checked5b = checkedValue4;
        }
        else if (localStorage['settings5'] == "3"){
            inny_dzwiek_przy_aktywnym = true;
            inny_dzwiek_link = dzwiek03;
            checked5c = checkedValue4;
        }
            else if (localStorage['settings5'] == "4"){
                inny_dzwiek_przy_aktywnym = true;
                inny_dzwiek_link = dzwiek04;
                checked5d = checkedValue4;
            }
            else if (localStorage['settings5'] == "5"){
                inny_dzwiek_przy_aktywnym = true;
                inny_dzwiek_link = dzwiek05;
                checked5e = checkedValue4;
            }
                else if (localStorage['settings5'] == "6"){
                    inny_dzwiek_przy_aktywnym = true;
                    inny_dzwiek_link = dzwiek06;
                    checked5f = checkedValue4;
                }
                else if (localStorage['settings5'] == "7"){
                    inny_dzwiek_przy_aktywnym = true;
                    inny_dzwiek_link = dzwiek07;
                    checked5g = checkedValue4;
                }
                    else if (localStorage['settings5'] == "8"){
                        inny_dzwiek_przy_aktywnym = true;
                        inny_dzwiek_link = dzwiek08;
                        checked5h = checkedValue4;
                    }
                    else if (localStorage['settings5'] == "9"){
                        inny_dzwiek_przy_aktywnym = true;
                        inny_dzwiek_link = dzwiek09;
                        checked5i = checkedValue4;
                    }
                        else if (localStorage['settings5'] == "10"){
                            inny_dzwiek_przy_aktywnym = true;
                            inny_dzwiek_link = dzwiek10;
                            checked5j = checkedValue4;
                        }
                        else if (localStorage['settings5'] == "11"){
                            inny_dzwiek_przy_aktywnym = true;
                            inny_dzwiek_link = dzwiek11;
                            checked5k = checkedValue4;
                        }
                            else if (localStorage['settings5'] == "12"){
                                inny_dzwiek_przy_aktywnym = true;
                                inny_dzwiek_link = dzwiek12;
                                checked5l = checkedValue4;
                            }
                            else if (localStorage['settings5'] == "13"){
                                inny_dzwiek_przy_aktywnym = true;
                                inny_dzwiek_link = dzwiek13;
                                checked5m = checkedValue4;
                            }
                                else if (localStorage['settings5'] == "14"){
                                    inny_dzwiek_przy_aktywnym = true;
                                    inny_dzwiek_link = dzwiek14;
                                    checked5n = checkedValue4;
                                }
                                else if (localStorage['settings5'] == "15"){
                                    inny_dzwiek_przy_aktywnym = true;
                                    inny_dzwiek_link = dzwiek15;
                                    checked5o = checkedValue4;
                                }
                                    else if (localStorage['settings5'] == "16"){
                                        inny_dzwiek_przy_aktywnym = true;
                                        inny_dzwiek_link = dzwiek16;
                                        checked5p = checkedValue4;
                                    }
                                    else if (localStorage['settings5'] == "17"){
                                        inny_dzwiek_przy_aktywnym = true;
                                        inny_dzwiek_link = dzwiek17;
                                        checked5r = checkedValue4;
                                    }
                                        else if (localStorage['settings5'] == "18"){
                                            inny_dzwiek_przy_aktywnym = true;
                                            inny_dzwiek_link = dzwiek18;
                                            checked5s = checkedValue4;
                                        }
                                        else if (localStorage['settings5'] == "19"){
                                            inny_dzwiek_przy_aktywnym = true;
                                            inny_dzwiek_link = dzwiek19;
                                            checked5t = checkedValue4;
                                        }
                                            else if (localStorage['settings5'] == "custom"){
                                                inny_dzwiek_przy_aktywnym = true;
                                                inny_dzwiek_link = dzwiek14;
                                                checked5custom = checkedValue4;
                                            }
                                            else {
                                                inny_dzwiek_przy_aktywnym = true;
                                                inny_dzwiek_link = localStorage['settings5'];
                                            }
    
    
    if (localStorage['settings6'] === undefined){
        if (dzwiek_nowej_pw){
            dzwiek_nowej_pw = true;
            
            checked6h = checkedValue4;
            dzwiek_nowej_pw_link = dzwiek08;
            
            localStorage['settings6'] = "8";
        }
        else {
            checked60 = checkedValue4;
            localStorage['settings6'] = "0";
        }
    }
    if (localStorage['settings6'] == "0"){
        dzwiek_nowej_pw = false;
        dzwiek_nowej_pw_link = dzwiek_nowej_pw_link;
        checked60 = checkedValue4;
    }
    else if (localStorage['settings6'] == "1"){
        dzwiek_nowej_pw = true;
        dzwiek_nowej_pw_link = dzwiek01;
        checked6a = checkedValue4;
        
    }
        else if (localStorage['settings6'] == "2"){
            dzwiek_nowej_pw = true;
            dzwiek_nowej_pw_link = dzwiek02;
            checked6b = checkedValue4;
        }
        else if (localStorage['settings6'] == "3"){
            dzwiek_nowej_pw = true;
            dzwiek_nowej_pw_link = dzwiek03;
            checked6c = checkedValue4;
        }
            else if (localStorage['settings6'] == "4"){
                dzwiek_nowej_pw = true;
                dzwiek_nowej_pw_link = dzwiek04;
                checked6d = checkedValue4;
            }
            else if (localStorage['settings6'] == "5"){
                dzwiek_nowej_pw = true;
                dzwiek_nowej_pw_link = dzwiek05;
                checked6e = checkedValue4;
            }
                else if (localStorage['settings6'] == "6"){
                    dzwiek_nowej_pw = true;
                    dzwiek_nowej_pw_link = dzwiek06;
                    checked6f = checkedValue4;
                }
                else if (localStorage['settings6'] == "7"){
                    dzwiek_nowej_pw = true;
                    dzwiek_nowej_pw_link = dzwiek07;
                    checked6g = checkedValue4;
                }
                    else if (localStorage['settings6'] == "8"){
                        dzwiek_nowej_pw = true;
                        dzwiek_nowej_pw_link = dzwiek08;
                        checked6h = checkedValue4;
                    }
                    else if (localStorage['settings6'] == "9"){
                        dzwiek_nowej_pw = true;
                        dzwiek_nowej_pw_link = dzwiek09;
                        checked6i = checkedValue4;
                    }
                        else if (localStorage['settings6'] == "10"){
                            dzwiek_nowej_pw = true;
                            dzwiek_nowej_pw_link = dzwiek10;
                            checked6j = checkedValue4;
                        }
                        else if (localStorage['settings6'] == "11"){
                            dzwiek_nowej_pw = true;
                            dzwiek_nowej_pw_link = dzwiek11;
                            checked6k = checkedValue4;
                        }
                            else if (localStorage['settings6'] == "12"){
                                dzwiek_nowej_pw = true;
                                dzwiek_nowej_pw_link = dzwiek12;
                                checked6l = checkedValue4;
                            }
                            else if (localStorage['settings6'] == "13"){
                                dzwiek_nowej_pw = true;
                                dzwiek_nowej_pw_link = dzwiek13;
                                checked6m = checkedValue4;
                            }
                                else if (localStorage['settings6'] == "14"){
                                    dzwiek_nowej_pw = true;
                                    dzwiek_nowej_pw_link = dzwiek14;
                                    checked6n = checkedValue4;
                                }
                                else if (localStorage['settings6'] == "15"){
                                    dzwiek_nowej_pw = true;
                                    dzwiek_nowej_pw_link = dzwiek15;
                                    checked6o = checkedValue4;
                                }
                                    else if (localStorage['settings6'] == "16"){
                                        dzwiek_nowej_pw = true;
                                        dzwiek_nowej_pw_link = dzwiek16;
                                        checked6p = checkedValue4;
                                    }
                                    else if (localStorage['settings6'] == "17"){
                                        dzwiek_nowej_pw = true;
                                        dzwiek_nowej_pw_link = dzwiek17;
                                        checked6r = checkedValue4;
                                    }
                                        else if (localStorage['settings6'] == "18"){
                                            dzwiek_nowej_pw = true;
                                            dzwiek_nowej_pw_link = dzwiek18;
                                            checked6s = checkedValue4;
                                        }
                                        else if (localStorage['settings6'] == "19"){
                                            dzwiek_nowej_pw = true;
                                            dzwiek_nowej_pw_link = dzwiek19;
                                            checked6t = checkedValue4;
                                        }
                                            else if (localStorage['settings6'] == "custom"){
                                                dzwiek_nowej_pw = true;
                                                dzwiek_nowej_pw_link = dzwiek08;
                                                checked6custom = checkedValue4;
                                            }
                                            else {
                                                dzwiek_nowej_pw = true;
                                                dzwiek_nowej_pw_link = localStorage['settings6'];
                                            }
    
}


function addEvent(obj, event, func) {
    if (obj.addEventListener) {
        obj.addEventListener(event, func, false);
        return true;
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + event, func);
    } else {
        var f = obj['on' + event];
        obj['on' + event] = typeof f === 'function' ? function() {
            f();
            func();
        } : func
    }
}


var popupWindow = null;
var popupIsShown = false;

function MakePopup (event) {
    if (window.createPopup) {        //Internet Explorer
        if (!popupWindow) {
            popupWindow = window.createPopup ();
            var popupBody = popupWindow.document.body;
            popupBody.style.backgroundColor = "lightblue";
            popupBody.style.border = "solid black 1px";
            popupBody.innerHTML = "Click outside to close.";
        }
        popupWindow.show (100, 100, 150, 25, document.body);
    }
    else {
        if (!popupIsShown) {
            if (!popupWindow) {
                var szerokosc = 1024;
                var szerokosc_org = window.innerWidth;
                //alert(szerokosc_org);
                var szerokosc_marg = szerokosc_org - szerokosc;
                var szerokosc_single_marg = szerokosc_marg / 2;
                //alert(szerokosc_single_marg);
                var dlugosc = 550;
                var dlugosc_org = window.innerHeight;
                var dlugosc_marg = dlugosc_org - dlugosc;
                var dlugosc_single_marg = dlugosc_marg / 2;
                
                var margin1 = dlugosc_single_marg + "px ";
                var margin2 = margin1 + szerokosc_single_marg;
                var margin3 = margin2 + "px";
                //alert(margin3)
                
                if (szerokosc_org < szerokosc){
                szerokosc = szerokosc_org;
                dlugosc = dlugosc_org;
                
                szerokosc_marg = szerokosc_org - szerokosc;
                szerokosc_single_marg = szerokosc_marg / 2;
                dlugosc_marg = dlugosc_org - dlugosc;
                dlugosc_single_marg = dlugosc_marg / 2;
                }
                
                if (dlugosc_org < dlugosc){
                szerokosc = szerokosc_org;
                dlugosc = dlugosc_org;
                
                szerokosc_marg = szerokosc_org - szerokosc;
                szerokosc_single_marg = szerokosc_marg / 2;
                dlugosc_marg = dlugosc_org - dlugosc;
                dlugosc_single_marg = dlugosc_marg / 2;
                }
                
                
                popupWindow = document.createElement ("div");
                popupWindow.style.backgroundColor = "#222";
                //popupWindow.style.background = 'url("http://bajkitv.pl/galeria/obraz/199022216.png")';
                popupWindow.style.opacity = "0.95";
                //popupWindow.style.backgroundSize="100% 100%";
                popupWindow.style.border = "solid black 1px";
                popupWindow.style.position = "absolute";
                popupWindow.style.width = szerokosc + "px";
                //popupWindow.style.maxWidth = "600px";
                popupWindow.style.height = dlugosc + "px";
                popupWindow.style.top = "0px";
                popupWindow.style.left = "0px";
                popupWindow.className = "fl_out";
                popupWindow.style.overflow = "auto";
                //popupWindow.style.marginTop = dlugosc_single_marg + "px !important";
                //popupWindow.style.marginLeft = szerokosc_single_marg + "px !important";
               // popupWindow.style.margin = margin3;
                popupWindow.style.marginLeft = szerokosc_single_marg + "px";
                popupWindow.style.marginTop = dlugosc_single_marg + "px";
                
                
                var inner1 = '<h2 class="mactiv" style="color:#FFB200!important"><center>BajkiTV.pl - Użyteczne Skrypty stworzone przez Przemka ver. ';
                var inner1_5 = inner1 + wersja;
                var inner1_6 = inner1_5 + ' - KONFIGURACJA</center></h2><a class="close_wn" style="right:10px;top:5px;" id="CloseSettings"></a><br> <div class="s5 l5 cl"><b class="postbody"> Wyświetlać avatary użytkowników na czacie:</b></div><div class="s7 l7 cl"><input class="radio" type="radio" id="settings1_0" name="viewemail" value="0" ';
                var inner2 = inner1_6 + checked1a;
                var inner3 = inner2 + '><label for="settings1_0"><span>Tak</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings1_1" name="viewemail" value="1" ';
                var inner4 = inner3 + checked1b;
                var inner5 = inner4 + ' ><label for="settings1_1"><span>Nie</span></label><span class="hint" style="display: none;">Jeśli <i class="mactiv">Tak</i>, avatary użytkowników będą wyświetlane na czacie serwisu.</span></div>';
                var inner6 = inner5 + '<br><br><div class="s5 l5 cl"><b class="postbody">Co ile minut odświeżać avatary:</b></div><div class="s7 l7 cl"><input class="post" style="width:40px" type="text" name="email" id="settings2_0" maxlength="2" spellcheck="false" value="';
                var inner7 = inner6 + odswiez_avatary_co_minut;
                var inner8 = inner7 + '"><span class="hint" style="display: none;">Co ile minut aktualizaować avatary na czacie? Po tym czasie będą widoczne zmiany, jeśli któryś z użytkowników zmieni swój avatar.</span></div>';
                var inner9 = inner8 + '<br><br><div class="s5 l5 cl"><b class="postbody">Wybierz styl wyświetlania avatarów:</b></div><div class="s7 cl"><input class="radio" type="radio" id="settings3_0" name="sett3" value="0"'
                var inner10 = inner9 + checked3a;
                var inner11 = inner10 + '><label for="settings3_0"><span>Małe, kwadratowe (zalecane)</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings3_1" name="sett3" value="1" ';
                var inner12 = inner11 + checked3b;
                var inner13 = inner12 + '><label for="settings3_1"><span>Małe, 16:13</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings3_2" name="sett3" value="2" ';
                var inner14 = inner13 + checked3c;
                var inner15 = inner14 + '><label for="settings3_2"><span>Małe, proporcjonalne</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings3_3" name="sett3" value="3" ';
                var inner16 = inner15 + checked3d;
                var inner17 = inner16 + '><label for="settings3_3"><span>Duże, kwadratowe</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings3_4" name="sett3" value="4" ';
                var inner18 = inner17 + checked3e;
                var inner19 = inner18 + '><label for="settings3_4"><span>Duże, 16:13</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings3_5" name="sett3" value="5" ';
                var inner20 = inner19 + checked3f;
                var inner21 = inner20 + '><label for="settings3_5"><span>Duże, proporcjonalne</span></label><span class="hint" style="display: none;">Jeżeli <i class="mactiv">Tak</i>, Twoje osiągnięcia w profilu będą widoczne publicznie.</span></div>';
                
                var inner22 = inner21 + '<br><br><br><br><div class="s5 l5 cl"><b class="postbody">Dźwięk na czacie przy nieaktywnej karcie:</b></div><div class="s7 l7 cl"><select name="sett4" id="settings4" class="lc_select rsel" style="min-width:185px; color:white"><option value="0"';
                
                var inner225 = inner22 + checked40;
                var inner23 = inner225 + '>Wyłączony</option><option value="1"';
                var inner24 = inner23 + checked4a;
                var inner25 = inner24 + '>Dźwięk 01</option><option value="2"';
                var inner26 = inner25 + checked4b;
                var inner27 = inner26 + '>Dźwięk 02</option><option value="3"';
                var inner28 = inner27 + checked4c;
                var inner29 = inner28 + '>Dźwięk 03</option><option value="4"';
                // selected="selected"
                var inner30 = inner29 + checked4d;
                var inner31 = inner30 + '>Dźwięk 04</option><option value="5"';
                var inner32 = inner31 + checked4e;
                var inner33 = inner32 + '>Dźwięk 05</option><option value="6"';
                var inner34 = inner33 + checked4f;
                var inner35 = inner34 + '>Dźwięk 06</option><option value="7"';
                var inner36 = inner35 + checked4g;
                var inner37 = inner36 + '>Dźwięk 07</option><option value="8"';
                var inner38 = inner37 + checked4h;
                var inner39 = inner38 + '>Dźwięk 08</option><option value="9"';
                var inner40 = inner39 + checked4i;
                var inner41 = inner40 + '>Dźwięk 09</option><option value="10"';
                var inner42 = inner41 + checked4j;
                var inner43 = inner42 + '>Dźwięk 10</option><option value="11"';
                var inner44 = inner43 + checked4k;
                var inner45 = inner44 + '>Dźwięk 11</option><option value="12"';
                var inner46 = inner45 + checked4l;
                var inner47 = inner46 + '>Dźwięk 12</option><option value="13"';
                var inner48 = inner47 + checked4m;
                var inner49 = inner48 + '>Dźwięk 13</option><option value="14"';
                var inner50 = inner49 + checked4n;
                var inner51 = inner50 + '>Dźwięk 14</option><option value="15"';
                var inner52 = inner51 + checked4o;
                var inner53 = inner52 + '>Dźwięk 15</option><option value="16"';
                var inner54 = inner53 + checked4p;
                var inner55 = inner54 + '>Dźwięk 16</option><option value="17"';
                var inner56 = inner55 + checked4r;
                var inner57 = inner56 + '>Dźwięk 17</option><option value="18"';
                var inner58 = inner57 + checked4s;
                var inner59 = inner58 + '>Dźwięk 18</option><option value="19"';
                var inner60 = inner59 + checked4t;
                var inner61 = inner60 + '>Dźwięk 19</option><option value="custom"';
                var inner62 = inner61 + checked4custom;
                var inner63 = inner62 + '>Inny…</option></select></div>';
                
                var inner64 = inner63 + '<br><br><div class="s5 l5 cl"><b class="postbody">Dźwięk na czacie przy aktywnej karcie:</b></div><div class="s7 l7 cl"><select name="sett5" id="settings5" class="lc_select rsel" style="min-width:185px; color:white"><option value="0"';
                
                var inner65 = inner64 + checked50;
                var inner66 = inner65 + '>Wyłączony</option><option value="1"';
                var inner67 = inner66 + checked5a;
                var inner68 = inner67 + '>Dźwięk 01</option><option value="2"';
                var inner69 = inner68 + checked5b;
                var inner70 = inner69 + '>Dźwięk 02</option><option value="3"';
                var inner71 = inner70 + checked5c;
                var inner72 = inner71 + '>Dźwięk 03</option><option value="4"';
                var inner73 = inner72 + checked5d;
                var inner74 = inner73 + '>Dźwięk 04</option><option value="5"';
                var inner75 = inner74 + checked5e;
                var inner76 = inner75 + '>Dźwięk 05</option><option value="6"';
                var inner77 = inner76 + checked5f;
                var inner78 = inner77 + '>Dźwięk 06</option><option value="7"';
                var inner79 = inner78 + checked5g;
                var inner80 = inner79 + '>Dźwięk 07</option><option value="8"';
                var inner81 = inner80 + checked5h;
                var inner82 = inner81 + '>Dźwięk 08</option><option value="9"';
                var inner83 = inner82 + checked5i;
                var inner84 = inner83 + '>Dźwięk 09</option><option value="10"';
                var inner85 = inner84 + checked5j;
                var inner86 = inner85 + '>Dźwięk 10</option><option value="11"';
                var inner87 = inner86 + checked5k;
                var inner88 = inner87 + '>Dźwięk 11</option><option value="12"';
                var inner89 = inner88 + checked5l;
                var inner90 = inner89 + '>Dźwięk 12</option><option value="13"';
                var inner91 = inner90 + checked5m;
                var inner92 = inner91 + '>Dźwięk 13</option><option value="14"';
                var inner93 = inner92 + checked5n;
                var inner94 = inner93 + '>Dźwięk 14</option><option value="15"';
                var inner95 = inner94 + checked5o;
                var inner96 = inner95 + '>Dźwięk 15</option><option value="16"';
                var inner97 = inner96 + checked5p;
                var inner98 = inner97 + '>Dźwięk 16</option><option value="17"';
                var inner99 = inner98 + checked5r;
                var inner100 = inner99 + '>Dźwięk 17</option><option value="18"';
                var inner101 = inner100 + checked5s;
                var inner102 = inner101 + '>Dźwięk 18</option><option value="19"';
                var inner103 = inner102 + checked5t;
                var inner104 = inner103 + '>Dźwięk 19</option><option value="custom"';
                var inner105 = inner104 + checked5custom;
                var inner106 = inner105 + '>Inny…</option></select></div>';
                
                var inner107 = inner106 + '<br><br><div class="s5 l5 cl"><b class="postbody">Dźwięk nadejścia nowej Prywatnej Wiadomości:</b></div><div class="s7 l7 cl"><select name="sett6" id="settings6" class="lc_select rsel" style="min-width:185px; color:white"><option value="0"';
                
                var inner108 = inner107 + checked60;
                var inner109 = inner108 + '>Wyłączony</option><option value="1"';
                var inner110 = inner109 + checked6a;
                var inner111 = inner110 + '>Dźwięk 01</option><option value="2"';
                var inner112 = inner111 + checked6b;
                var inner113 = inner112 + '>Dźwięk 02</option><option value="3"';
                var inner114 = inner113 + checked6c;
                var inner115 = inner114 + '>Dźwięk 03</option><option value="4"';
                var inner116 = inner115 + checked6d;
                var inner117 = inner116 + '>Dźwięk 04</option><option value="5"';
                var inner118 = inner117 + checked6e;
                var inner119 = inner118 + '>Dźwięk 05</option><option value="6"';
                var inner120 = inner119 + checked6f;
                var inner121 = inner120 + '>Dźwięk 06</option><option value="7"';
                var inner122 = inner121 + checked6g;
                var inner123 = inner122 + '>Dźwięk 07</option><option value="8"';
                var inner124 = inner123 + checked6h;
                var inner125 = inner124 + '>Dźwięk 08</option><option value="9"';
                var inner126 = inner125 + checked6i;
                var inner127 = inner126 + '>Dźwięk 09</option><option value="10"';
                var inner128 = inner127 + checked6j;
                var inner129 = inner128 + '>Dźwięk 10</option><option value="11"';
                var inner130 = inner129 + checked6k;
                var inner131 = inner130 + '>Dźwięk 11</option><option value="12"';
                var inner132 = inner131 + checked6l;
                var inner133 = inner132 + '>Dźwięk 12</option><option value="13"';
                var inner134 = inner133 + checked6m;
                var inner135 = inner134 + '>Dźwięk 13</option><option value="14"';
                var inner136 = inner135 + checked6n;
                var inner137 = inner136 + '>Dźwięk 14</option><option value="15"';
                var inner138 = inner137 + checked6o;
                var inner139 = inner138 + '>Dźwięk 15</option><option value="16"';
                var inner140 = inner139 + checked6p;
                var inner141 = inner140 + '>Dźwięk 16</option><option value="17"';
                var inner142 = inner141 + checked6r;
                var inner143 = inner142 + '>Dźwięk 17</option><option value="18"';
                var inner144 = inner143 + checked6s;
                var inner145 = inner144 + '>Dźwięk 18</option><option value="19"';
                var inner146 = inner145 + checked6t;
                var inner147 = inner146 + '>Dźwięk 19</option><option value="custom"';
                var inner148 = inner147 + checked6custom;
                var inner149 = inner148 + '>Inny…</option></select></div>';
                
                var inner150 = inner149 + '<br><br><div class="s5 l5 cl"><b class="postbody">Ulepszone pole pisania wiadomości na czacie (od góry):</b></div><div class="s7 l7 cl"><input class="radio" type="radio" id="settings7_0" name="sett7" value="0" ';
                var inner151 = inner150 + checked7a;
                var inner152 = inner151 + '><label for="settings7_0"><span>Tak</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings7_1" name="sett7" value="1" ';
                var inner153 = inner152 + checked7b;
                var inner154 = inner153 + ' ><label for="settings7_1"><span>Nie</span></label><span class="hint" style="display: none;">Jeśli <i class="mactiv">Tak</i>, pole pisania wiadomości na czacie będzie znajdowało się u góry.</span></div>';
                
                var inner155 = inner154 + '<br><br><div class="s5 l5 cl"><b class="postbody">Przypomnienia o potrzebie odwiedzania banku co 24h:</b></div><div class="s7 l7 cl"><input class="radio" type="radio" id="settings8_0" name="sett8" value="0" ';
                var inner156 = inner155 + checked8a;
                var inner157 = inner156 + '><label for="settings8_0"><span>Tak</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings8_1" name="sett8" value="1" ';
                var inner158 = inner157 + checked8b;
                var inner159 = inner158 + ' ><label for="settings8_1"><span>Nie</span></label><span class="hint" style="display: none;">Jeśli <i class="mactiv">Tak</i>, co 24 godziny będą pojawiać się przypomnienia dotyczące odwiedzenia banku w celu naliczenia odsetek.</span></div>';
                var innerFull = inner159;
                
                var inner160 = inner159 + '<br><br><br><div class="s5 l5 cl"><b class="postbody">Ignorowanie nielubianych użytkowników na czacie:</b></div><div class="s7 l7 cl"><input class="radio" type="radio" id="settings9_0" name="sett9" value="0" ';
                var inner161 = inner160 + checked9a;
                var inner162 = inner161 + '><label for="settings9_0"><span>Włączone</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings9_1" name="sett9" value="1" ';
                var inner163 = inner162 + checked9b;
                var inner164 = inner163 + ' ><label for="settings9_1"><span>Włączone, ale bez powiadomienia o ukryciu</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings9_2" name="sett9" value="2" ';
                var inner165 = inner164 + checked9c;
                var inner166 = inner165 + ' ><label for="settings9_2"><span>Wyłączone</span></label><span class="hint" style="display: none;">Jeśli <i class="mactiv">Włączone</i>, wiadomości na czacie od użytkowników wymienionych poniżej będą ukrywane.</span></div>';
                
                
                var inner167 = inner166 + '<br><br><div class="s5 l5 cl"><b class="postbody">Lista użytkowników ignorowanych na czacie:</b></div><div class="s7 l7 cl"><input class="post" style="width:450px" type="text" name="ignore_czat" id="settings10_0" maxlength="500" spellcheck="false" value="';
                var inner168 = inner167 + ignore_list_czat;
                var inner169 = inner168 + '"><span class="hint" style="display: none;">Lista użytkowników, których wiadomości nie będą wyświetlane na czacie.</span></div>';
                
                var inner170 = inner169 + '<br><br><br><div class="s5 l5 cl"><b class="postbody">Ignorowanie nielubianych użytkowników w postach na forum:</b></div><div class="s7 l7 cl"><input class="radio" type="radio" id="settings11_0" name="sett11" value="0" ';
                var inner171 = inner170 + checked11a;
                var inner172 = inner171 + '><label for="settings11_0"><span>Włączone</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings11_1" name="sett11" value="1" ';
                var inner173 = inner172 + checked11b;
                var inner174 = inner173 + ' ><label for="settings11_1"><span>Włączone, ale bez informacji o ukryciu</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings11_2" name="sett11" value="2" ';
                var inner175 = inner174 + checked11c;
                var inner176 = inner175 + ' ><label for="settings11_2"><span>Wyłączone</span></label><span class="hint" style="display: none;">Jeśli <i class="mactiv">Włączone</i>, posty użytkowników wymienionych poniżej będą ukrywane.</span></div>';
                
                var inner177 = inner176 + '<br><br><div class="s5 l5 cl"><b class="postbody">Lista użytkowników ignorowanych w postach:</b></div><div class="s7 l7 cl"><input class="post" style="width:450px" type="text" name="ignore_posty" id="settings12_0" maxlength="500" spellcheck="false" value="';
                var inner178 = inner177 + ignore_list;
                var inner179 = inner178 + '"><span class="hint" style="display: none;">Lista użytkowników, których wiadomości nie będą wyświetlane na czacie.</span></div>';
                
                var inner180 = inner179 + '<br><br><br><div class="s5 l5 cl"><b class="postbody">Kopia robocza wiadomości na czacie i postów:</b></div><div class="s7 l7 cl"><input class="radio" type="radio" id="settings13_0" name="sett13" value="0" ';
                var inner181 = inner180 + checked13a;
                var inner182 = inner181 + '><label for="settings13_0"><span>Postów + wiadomości na czacie</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings13_1" name="sett13" value="1" ';
                var inner183 = inner182 + checked13b;
                var inner184 = inner183 + ' ><label for="settings13_1"><span>Tylko postów</span></label>&nbsp;&nbsp;<input class="radio" type="radio" id="settings13_2" name="sett13" value="2" ';
                var inner185 = inner184 + checked13c;
                var inner186 = inner185 + ' ><label for="settings13_2"><span>Wyłączona</span></label><span class="hint" style="display: none;">Jeśli <i class="mactiv">Włączone</i>, posty użytkowników wymienionych poniżej będą ukrywane.</span></div>';
                
                var inner187 = inner186 + '<br><br><div class="s5 l5 cl"><b class="postbody">Co ile sekund wykonywać kopię roboczą:</b></div><div class="s7 l7 cl">Na czacie: <input class="post" style="width:40px" type="text" name="kopia_czat" id="settings14_0" maxlength="2" spellcheck="false" value="';
                var inner188 = inner187 + co_ile_sekund_czat;
                var inner189 = inner188 + '"> Postów: <input class="post" style="width:40px" type="text" name="kopia_posty" id="settings15_0" maxlength="2" spellcheck="false" value="';
                var inner190 = inner189 + co_ile_sekund_zapisywac;
                var inner191 = inner190 + '">';
                var inner192 = inner191 + '<span class="hint" style="display: none;">Czas w sekundach, po którym utworzona zostanie kolejna kopia robocza.</span></div>';
                var inner1935 = inner192 + '<center><br><br><br><input type="button" id="WylaczCzat" value="Wyłącz czat na określony czas" class="btnlite bl ft_mid" style="margin-left: 0px">';
                var inner1936 = inner1935 + '<input type="button" id="WlaczCzat" value="Włącz" class="btnlite bl ft_mid" style="margin-left: 5px">';
                var inner193 = inner1936 + '<input type="button" id="FactorySettings" value="Napraw skrypt / Przywróć ustawienia fabryczne" class="btnlite bl ft_mid" style="margin-left: 30px">';
                var inner194 = inner193 + '<input type="button" id="SaveAndRefresh" value="Zastosuj aktualne ustawienia i odśwież stronę" class="btnlite bl ft_mid" style="margin-left: 30px"></center?';
                
                var innerFull = inner194;
                popupWindow.innerHTML = innerFull;
                popupWindow.style.zIndex= "2147483647";
            }
            
            
            document.body.appendChild (popupWindow);
            //window.addEventListener ('click', RemovePopup, true);
            addEvent(document.getElementById('CloseSettings'), 'click', function() {
                RemovePopup('settings');
            });
            addEvent(document.getElementById('settings1_0'), 'click', function() {
                localStorage['settings1'] = "0";
            });
            addEvent(document.getElementById('settings1_1'), 'click', function() {
                localStorage['settings1'] = "1";
            });
            
            //var SaveSettings2bool = false;
            function SaveSettings2(){
                // if (SaveSettings2bool){
                // alert('save settings2');
                localStorage['settings2'] = document.getElementById('settings2_0').value;
                window.removeEventListener ('click', SaveSettings2, true);
                //SaveSettings2bool = false;
                //}
            }
            addEvent(document.getElementById('settings2_0'), 'click', function() {
                window.addEventListener ('click', SaveSettings2, true);
                SaveSettings2bool = true;
                localStorage['settings2'] = document.getElementById('settings2_0').value;
                //alert(localStorage['settings2']);
            });
            
            addEvent(document.getElementById('settings3_0'), 'click', function() {
                localStorage['settings3'] = "0";
            });
            addEvent(document.getElementById('settings3_1'), 'click', function() {
                localStorage['settings3'] = "1";
            });
            addEvent(document.getElementById('settings3_2'), 'click', function() {
                localStorage['settings3'] = "2";
            });
            addEvent(document.getElementById('settings3_3'), 'click', function() {
                localStorage['settings3'] = "3";
            });
            addEvent(document.getElementById('settings3_4'), 'click', function() {
                localStorage['settings3'] = "4";
            });
            addEvent(document.getElementById('settings3_5'), 'click', function() {
                localStorage['settings3'] = "5";
            });
            
            var firstclick = 0;
            addEvent(document.getElementById('settings4'), 'click', function() {
                var value = document.getElementById('settings4').value;
                var graj = dzwiek00 + value;
                var graj1 = graj + ".ogg";
                var sndTst = new Audio(graj1);
                sndTst.volume = 1;
                if (value != "0"){
                    sndTst.play();
                }
                if (value == "custom"){
                    if (firstclick == 0){
                        var linkk = window.prompt("Wprowadź swój link do dźwięku na czacie (najlepiej w formacie .ogg), a następnie wciśnij klawisz: ENTER aby zapisać zmiany, lub ESC aby anulować", localStorage['settings4']);
                        value = linkk;
                        if (value === null){
                            value = "custom";
                        }
                        localStorage['settings4'] = value;
                        firstclick = firstclick + 1;
                        //alert(firstclick);
                    }
                }
                else {
                    localStorage['settings4'] = value;
                }
                if (firstclick != 0){
                    firstclick = firstclick + 1;
                    if (firstclick > 2){
                        firstclick = 0;
                    }
                }
                
            });
            
             var settings4nod = document.getElementById('settings4');
            function OnFocus4() {
            function settings4nodfunc(e) {
               var value = document.getElementById('settings4').value;
                var graj = dzwiek00 + value;
                var graj1 = graj + ".ogg";
                var sndTst = new Audio(graj1);
                sndTst.volume = 1;
                if (value != "0"){
                    sndTst.play();
                }
                if (value == "custom"){
                    if (firstclick == 0){
                        var linkk = window.prompt("Wprowadź swój link do dźwięku na czacie (najlepiej w formacie .ogg), a następnie wciśnij klawisz: ENTER aby zapisać zmiany, lub ESC aby anulować", localStorage['settings4']);
                        value = linkk;
                        if (value === null){
                            value = "custom";
                        }
                        localStorage['settings4'] = value;
                        firstclick = firstclick + 1;
                        //alert(firstclick);
                    }
                }
                else {
                    localStorage['settings4'] = value;
                }
                if (firstclick != 0){
                    firstclick = firstclick + 1;
                    if (firstclick > 2){
                        firstclick = 0;
                    }
                }
                
}
                settings4nod.addEventListener("keyup", settings4nodfunc, false);
            }
settings4nod.addEventListener("focus", OnFocus4, true);
             
            
            var firstclick2 = 0;
            addEvent(document.getElementById('settings5'), 'click', function() {
                var value = document.getElementById('settings5').value;
                var graj = dzwiek00 + value;
                var graj1 = graj + ".ogg";
                var sndTst = new Audio(graj1);
                sndTst.volume = 1;
                if (value != "0"){
                    sndTst.play();
                }
                if (value == "custom"){
                    if (firstclick2 == 0){
                        var linkk = window.prompt("Wprowadź swój link do dźwięku na czacie (najlepiej w formacie .ogg), a następnie wciśnij klawisz: ENTER aby zapisać zmiany, lub ESC aby anulować", localStorage['settings4']);
                        value = linkk;
                        if (value === null){
                            value = "custom";
                        }
                        localStorage['settings5'] = value;
                        firstclick2 = firstclick2 + 1;
                        //alert(firstclick);
                    }
                }
                else {
                    localStorage['settings5'] = value;
                }
                if (firstclick2 != 0){
                    firstclick2 = firstclick2 + 1;
                    if (firstclick2 > 2){
                        firstclick2 = 0;
                    }
                }
                
            });
            
            
            var settings5nod = document.getElementById('settings5');
            function OnFocus5() {
            function settings5nodfunc(e) {
               var value = document.getElementById('settings5').value;
                var graj = dzwiek00 + value;
                var graj1 = graj + ".ogg";
                var sndTst = new Audio(graj1);
                sndTst.volume = 1;
                if (value != "0"){
                    sndTst.play();
                }
                if (value == "custom"){
                    if (firstclick2 == 0){
                        var linkk = window.prompt("Wprowadź swój link do dźwięku na czacie (najlepiej w formacie .ogg), a następnie wciśnij klawisz: ENTER aby zapisać zmiany, lub ESC aby anulować", localStorage['settings4']);
                        value = linkk;
                        if (value === null){
                            value = "custom";
                        }
                        localStorage['settings5'] = value;
                        firstclick2 = firstclick2 + 1;
                        //alert(firstclick);
                    }
                }
                else {
                    localStorage['settings5'] = value;
                }
                if (firstclick2 != 0){
                    firstclick2 = firstclick2 + 1;
                    if (firstclick2 > 2){
                        firstclick2 = 0;
                    }
                }
                
}
                settings5nod.addEventListener("keyup", settings5nodfunc, false);
            }
settings5nod.addEventListener("focus", OnFocus5, true);
            
            var firstclick3 = 0;
            addEvent(document.getElementById('settings6'), 'click', function() {
                var value = document.getElementById('settings6').value;
                var graj = dzwiek00 + value;
                var graj1 = graj + ".ogg";
                var sndTst = new Audio(graj1);
                sndTst.volume = 1;
                if (value != "0"){
                    sndTst.play();
                }
                if (value == "custom"){
                    if (firstclick3 == 0){
                        var linkk = window.prompt("Wprowadź swój link do dźwięku Prywatnej Wiadomości (najlepiej w formacie .ogg), a następnie wciśnij klawisz: ENTER aby zapisać zmiany, lub ESC aby anulować", localStorage['settings4']);
                        value = linkk;
                        if (value === null){
                            value = "custom";
                        }
                        localStorage['settings6'] = value;
                        firstclick3 = firstclick3 + 1;
                        //alert(firstclick);
                    }
                }
                else {
                    localStorage['settings6'] = value;
                }
                if (firstclick3 != 0){
                    firstclick3 = firstclick3 + 1;
                    if (firstclick3 > 2){
                        firstclick3 = 0;
                    }
                }
                
            });
            
            
            var settings6nod = document.getElementById('settings6');
            function OnFocus6() {
            function settings6nodfunc(e) {
               var value = document.getElementById('settings6').value;
                var graj = dzwiek00 + value;
                var graj1 = graj + ".ogg";
                var sndTst = new Audio(graj1);
                sndTst.volume = 1;
                if (value != "0"){
                    sndTst.play();
                }
                if (value == "custom"){
                    if (firstclick3 == 0){
                        var linkk = window.prompt("Wprowadź swój link do dźwięku Prywatnej Wiadomości (najlepiej w formacie .ogg), a następnie wciśnij klawisz: ENTER aby zapisać zmiany, lub ESC aby anulować", localStorage['settings4']);
                        value = linkk;
                        if (value === null){
                            value = "custom";
                        }
                        localStorage['settings6'] = value;
                        firstclick3 = firstclick3 + 1;
                        //alert(firstclick);
                    }
                }
                else {
                    localStorage['settings6'] = value;
                }
                if (firstclick3 != 0){
                    firstclick3 = firstclick3 + 1;
                    if (firstclick3 > 2){
                        firstclick3 = 0;
                    }
                }
                
}
                settings6nod.addEventListener("keyup", settings6nodfunc, false);
            }
settings6nod.addEventListener("focus", OnFocus6, true);
            
            addEvent(document.getElementById('settings7_0'), 'click', function() {
                localStorage['settings7'] = "0";
            });
            addEvent(document.getElementById('settings7_1'), 'click', function() {
                localStorage['settings7'] = "1";
            });
            
            addEvent(document.getElementById('settings8_0'), 'click', function() {
                localStorage['settings8'] = "0";
            });
            addEvent(document.getElementById('settings8_1'), 'click', function() {
                localStorage['settings8'] = "1";
            });
            
            addEvent(document.getElementById('settings9_0'), 'click', function() {
                localStorage['settings9'] = "0";
            });
            addEvent(document.getElementById('settings9_1'), 'click', function() {
                localStorage['settings9'] = "1";
            });
            addEvent(document.getElementById('settings9_2'), 'click', function() {
                localStorage['settings9'] = "2";
            });
            
            
            function SaveSettings10(){
                // if (SaveSettings2bool){
                // alert('save settings2');
                localStorage['settings10'] = document.getElementById('settings10_0').value;
                window.removeEventListener ('click', SaveSettings10, true);
                //SaveSettings2bool = false;
                //}
            }
            addEvent(document.getElementById('settings10_0'), 'click', function() {
                window.addEventListener ('click', SaveSettings10, true);
                localStorage['settings10'] = document.getElementById('settings10_0').value;
            });
            
            addEvent(document.getElementById('settings11_0'), 'click', function() {
                localStorage['settings11'] = "0";
            });
            addEvent(document.getElementById('settings11_1'), 'click', function() {
                localStorage['settings11'] = "1";
            });
            addEvent(document.getElementById('settings11_2'), 'click', function() {
                localStorage['settings11'] = "2";
            });
            
            function SaveSettings12(){
                // if (SaveSettings2bool){
                // alert('save settings2');
                localStorage['settings12'] = document.getElementById('settings12_0').value;
                window.removeEventListener ('click', SaveSettings12, true);
                //SaveSettings2bool = false;
                //}
            }
            addEvent(document.getElementById('settings12_0'), 'click', function() {
                window.addEventListener ('click', SaveSettings12, true);
                localStorage['settings12'] = document.getElementById('settings12_0').value;
            });
            
            addEvent(document.getElementById('settings13_0'), 'click', function() {
                localStorage['settings13'] = "0";
            });
            addEvent(document.getElementById('settings13_1'), 'click', function() {
                localStorage['settings13'] = "1";
            });
            addEvent(document.getElementById('settings13_2'), 'click', function() {
                localStorage['settings13'] = "2";
            });
            
            function SaveSettings14(){
                // if (SaveSettings2bool){
                // alert('save settings2');
                localStorage['settings14'] = document.getElementById('settings14_0').value;
                window.removeEventListener ('click', SaveSettings14, true);
                //SaveSettings2bool = false;
                //}
            }
            
            localStorage['settings14'] = document.getElementById('settings14_0').value;
            window.removeEventListener ('click', SaveSettings14, true);
            //SaveSettings2bool = false;
            //}
            
            addEvent(document.getElementById('settings14_0'), 'click', function() {
                window.addEventListener ('click', SaveSettings14, true);
                localStorage['settings14'] = document.getElementById('settings14_0').value;
            });
            
            function SaveSettings15(){
                // if (SaveSettings2bool){
                // alert('save settings2');
                localStorage['settings15'] = document.getElementById('settings15_0').value;
                window.removeEventListener ('click', SaveSettings15, true);
                //SaveSettings2bool = false;
                //}
            }
            
            localStorage['settings15'] = document.getElementById('settings15_0').value;
            window.removeEventListener ('click', SaveSettings15, true);
            //SaveSettings2bool = false;
            //}
            
            addEvent(document.getElementById('settings15_0'), 'click', function() {
                window.addEventListener ('click', SaveSettings15, true);
                localStorage['settings15'] = document.getElementById('settings15_0').value;
            });
            
            addEvent(document.getElementById('FactorySettings'), 'click', function() {
                if (confirm('Ta opcja spowoduje trwałą utratę ustawień skryptu i przywróci skrypt do ustawień fabrycznych. Czy na pewno chcesz kontynuować? Kliknij OK aby potwierdzić, lub Anuluj, aby przerwać operację')) { 
                    localStorage.clear();
                    location.reload();
                }
            });
            
            addEvent(document.getElementById('SaveAndRefresh'), 'click', function() {
                SaveSettings15();
                SaveSettings14();
                SaveSettings12();
                SaveSettings10();
                SaveSettings2();
                location.reload();
            });
            
            addEvent(document.getElementById('WylaczCzat'), 'click', function() {
                var minutes;
                if (minutes = window.prompt("Podaj czas (w minutach), przez który czat serwisowy nie będzie dla Ciebie dostępny. Ma to na celu uniezależnienie się lub uniknięcie problemów wynikających z prowokacji innych użytkowników", "10")){
                    if (minutes > 1440){
                        alert("Za długo! Maksymalny czas wyłączenia to 1440 minut (24 godziny)!");
                    }
                    else {
                        //alert(minutes);
                        var date = new Date();
                        date.setTime(date.getTime()+(minutes*60*1000));
                        var expires = date.toUTCString();
                        localStorage['settings16'] = expires;
                        location.reload();
                    }
                }
            });
            
            addEvent(document.getElementById('WlaczCzat'), 'click', function() {
               
                if (confirm("Czy na pewno chcesz anulować wyłączenie czatu i znów go wyświetlać?")){
                   localStorage.removeItem('settings16');
                    }
            });
            
            popupIsShown = true;
            
            // to avoid that the current click event propagates up
            event.stopPropagation ();
            
        }
    }
}


function RemovePopup (event) {
    
    if (popupIsShown) {
        //var relation = popupWindow.compareDocumentPosition (event.target);
        //var clickInPopup = (event.target == popupWindow) || (relation & Node.DOCUMENT_POSITION_CONTAINED_BY);
        
        //if (!clickInPopup) {
        document.body.removeChild (popupWindow);
        window.removeEventListener ('click', RemovePopup, true);
        popupIsShown = false;
        // }
    } 
}


function LoadSettingsButton(){
    if (KonfiguracjaGraficzna){
     var jakastronka4 = window.location.href;
     if (jakastronka4.indexOf("http://bajkitv.pl/ustawienia") > -1) {
     StopStopStop = false;
     }
        if (!StopStopStop){

            var WhereButton = document.getElementById("chatForm");
            var img = new Image(18,18); // width, height values are optional params 
            img.src = 'http://bajkitv.pl/galeria/obraz/199022216.png';
            img.style.backgroundImage="url('')";
            img.className = "furl btnemo";
            img.id="ChatSettingsButton";
            img.title = "Ustawienia skryptu: 'BajkiTV.pl Avatary użytkowników na czacie serwisu. Autor skryptu: Przmus'";
            //document.getElementById("chatForm").appendChild(img);
            //img.insertBefore(img,WhereButton.childNodes[0]);
            //alert('k');
            
            
            
            
            
    //alert(jakastronka4);
    if (jakastronka4.indexOf("http://bajkitv.pl/ustawienia") > -1) {
    var wustawieniach;
    if (wustawieniach = document.getElementById("breadcrumb")){
     //wustawieniach.insertBefore(img,  wustawieniach.parentNode.firstChild);
     //alert(wustawieniach.parentNode.innerHTML);
    // wustawieniach.firstElementChild).insertBefore(img, wustawieniach.firstChild);
     wustawieniach.parentNode.children[4].childNodes[1].childNodes[1].childNodes[2].appendChild(img);
     
     //wustawieniach.parentNode.insertBefore(img,  wustawieniach.parentNode.children[4];
     //alert('hi');
    } 
    } 
    else {
            
            
            
            
            
            
            var whichEmo;
            if (whichEmo =  document.getElementById("cont_emo_1")){ 
                whichEmo =  document.getElementById("cont_emo_1");
            }
            else if (whichEmo =  document.getElementById("cont_emo_2")){
                whichEmo =  document.getElementById("cont_emo_2");
            }
                
                // WhereButton.insertBefore(img,  document.getElementById("cont_emo_2"));
                WhereButton.insertBefore(img,  whichEmo);
            
             
        
        }
         addEvent(document.getElementById('ChatSettingsButton'), 'click', function() {
                if (!popupIsShown){
                    MakePopup('settings');
                }
                else {
                    RemovePopup('settings');
                }
            });
        }
    }
}
window.onload=LoadSettingsButton();








function CzekamyNaPW() {
    var sndPW = new Audio(dzwiek_nowej_pw_link);
    sndPW.volume = 1;
    var PrywatnaWiadomosc = document.getElementById("pw");
    var PoprzedniStan = PrywatnaWiadomosc.firstChild.textContent;
    PrywatnaWiadomosc.addEventListener("DOMNodeInserted", function() {
        //alert("nadeszla pw");
        var PWNumber = PrywatnaWiadomosc.firstChild.textContent;
        //alert(PWNumber);
        var PoinformowanoWczesniej = PWNumber.indexOf(PoprzedniStan);
        if (PoinformowanoWczesniej > -1) {
            
        }
        else {
            var NieMaPW = PWNumber.indexOf("Poczta");
            if (NieMaPW > -1) {
                
            }
            else {
                sndPW.play();
                PoprzedniStan = PWNumber;
            }
        }
    }, false);
}





var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();



if (document.getElementById("simple_chat")) {
    var Joanna = document.getElementById("simple_chat");
    Joanna.addEventListener("DOMNodeRemoved", function() {
        nowy_dzwiek_na_czacie2 = false;
        if (!StopStopStop){
            Avatary();
        }
        if (nowy_dzwiek_na_czacie) {
            window.setTimeout(function(){
                nowy_dzwiek_na_czacie2 = true;
            }, 1000);
        }
        //alert('kliknieto');
    }, false);
}


var odswiezaj_czat_co = 5; // Opcja nieaktualna. Co ile sekund odświeżać czat (aby dodać awatary do nowych wiadomości)?

//localStorage['liczymy'] = 1;
if (uzyj_wiekszych_avatarow == true) {
    if (zachowaj_proporcje == true) {
        var wysokosc_avatara = "45.5px";
        var szerokosc_avatara = ""; 
    }
    else {
        if (zachowaj_proporcje_16x13 == true) {
            var wysokosc_avatara = "45.5px";
            var szerokosc_avatara = "37.5px";
        }
        else {
            var wysokosc_avatara = "45.5px";
            var szerokosc_avatara = "45.5px";
        }
    }
}
else {
    if (zachowaj_proporcje == true) {
        var wysokosc_avatara = "34.5px";
        var szerokosc_avatara = ""; 
    }
    else {
        if (zachowaj_proporcje_16x13 == true) {
            var wysokosc_avatara = "34.5px";
            var szerokosc_avatara = "28,5px";
        }
        else {
            var wysokosc_avatara = "34.5px";
            var szerokosc_avatara = "34.5px";  
        }    
    }
}

function GetAvatar(x,y) {
    var zapis = x;
    var username = y;
    var heyhey9 = null;
    //alert('funckja'+x+y);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            //alert(xhr.responseText);
            var heyhey = xhr.responseText.indexOf("/galeria/avatar");
            var heyhey3 = xhr.responseText.substr(heyhey);
            var heyhey2 = heyhey + 30;
            var heyhey5 = xhr.responseText.substr(heyhey2);
            var heyhey6 = heyhey5.indexOf("/galeria/avatar");
            //alert(heyhey6);
            var heyhey7 = heyhey5.substr(heyhey6);
            var heyhey8 = heyhey7.indexOf('"');
            //alert(heyhey8);
            var heyhey9 = heyhey7.substr(0,heyhey8);
            //alert(heyhey9);
            //var n = xhr.responseText.search("/galeria/avatar");
            //alert(xhr.responseText[n]);
            //alert(heyhey9);
            localStorage[zapis] = heyhey9;
            var JezusChrystus = heyhey9;
            return heyhey9;
        }
    }
    xhr.open('GET', username, heyhey9);
    xhr.send(null);
}


var odswiezaj_czat_co2 = odswiezaj_czat_co * 1000;
var kolumny_list = [
    "bl r11", "bl r10", "bl r9", "bl r8", "bl r7", "bl r6", "bl r5", "bl r4", "bl r3", "bl r2"
]


function imageExists(image_url){
    
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
    
}


function createCookie(name, value) {
    var date = new Date();
    date.setTime(date.getTime()+(odswiez_avatary_co_minut*60*1000));
    var expires = date.toUTCString();
    localStorage['wygasa'] = expires;
    //document.cookie = name+"="+value+expires+"; path=/";
}

var flood = true;

function AntyFlood() {
    flood = true;
}

function KupionoDodatek() {
    localStorage['zakupiono_dodatek'] = "tak";
    /* var zakupiono = null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var heyhey = xhr.responseText.indexOf('<span class="mactiv">220$</span>');
            if (heyhey > -1) {
                //alert("kupiono");
                nowy_dzwiek_na_czacie = true;
                localStorage['zakupiono_dodatek'] = "tak";
            }
            else {
                //alert("nie kupiono");
                nowy_dzwiek_na_czacie = false;
                localStorage['zakupiono_dodatek'] = "nie";
            }
        }
    }
    xhr.open('GET', "http://bajkitv.pl/sklep", zakupiono);
    xhr.send(null);*/
}

nowy_dzwiek_na_czacie2 = false;
if (nowy_dzwiek_na_czacie) {
    var snd = new Audio(nowy_dzwiek_link);
    var snd2 = new Audio(inny_dzwiek_link);
    //snd.setAttribute("type", "audio/mp3");
    snd.volume = 1;
    snd2.volume = 1;
    if (localStorage['zakupiono_dodatek'] === undefined) {
        //alert("sprawdzanie");
        //nowy_dzwiek_na_czacie = false;
        KupionoDodatek();
    }
    else if (localStorage['zakupiono_dodatek'] == "tak") {
        nowy_dzwiek_na_czacie = true;
        //alert("zakupiono");
    }
        else {
            //alert("nie zakupiono");
            //nowy_dzwiek_na_czacie = false;
        }
    //snd.play();
}

var Marlenka = document.getElementById("chatData");
function Zaczynamy() {
    if (dzwiek_nowej_pw){
        CzekamyNaPW();
    }
    if (nowy_dzwiek_na_czacie) {
        nowy_dzwiek_na_czacie2 = true;
    }
    Marlenka.addEventListener("DOMNodeInserted", function() {
        if (localStorage['flood'] == "nie") {
            //alert("wywołuje event");
            //alert(localStorage['flood']);
            if (avatary_na_czacie) {
                localStorage['flood'] = "tak";
                if (!StopStopStop){
                    Avatary();
                }
            }
            if (ignoruj_na_czacie) {
                CheckChatBox();
            }
        }
        else {
            localStorage['flood'] = "nie"; /// musi być bo czasem się zawiesza :(
            //alert("flood!");
        }
    }, false);
}

if (pisanie_od_gory) {
    var ksiadz_proboszcz = document.getElementById("chatForm");
    var siostra_zakonna = ksiadz_proboszcz;
    var ojciec_swiety = document.getElementById("chatsc");
    ojciec_swiety.parentNode.insertBefore(siostra_zakonna, ojciec_swiety);
    var siostra_mary = document.getElementById("chatMessage");
    ksiadz_proboszcz.className = "row2 ft_cen";
    siostra_mary.style.width = "100%";
    siostra_mary.style.maxWidth = "100%";
    var dziewica_maryja = siostra_mary.clientWidth;
    if (dziewica_maryja < 1) {
        siostra_mary.style.width = 600 + "px";
        //alert("w ciąży");
    }
    else {
        var nowa_roz = dziewica_maryja - 125;
        siostra_mary.style.width = nowa_roz + "px";
    }
    //var jakastronka = window.location.pathname;
    ojciec_swiety.className = ojciec_swiety.className + " lf rf";
}
function ZaczynamyChyba() {
    if (ignoruj_na_czacie === true) {
        CheckChatBox();
    }
    window.setTimeout(function(){
        Zaczynamy();
    }, 1000);
}

function PomocZdalna(a,c,i) {
    var b = a.id;
    window.setTimeout(function(){
        //var pomoc_zdalna = -1;
        var pomoc_zdalna = document.getElementById(b).textContent;
        if (pomoc_zdalna.indexOf("$$Pomoc zdalna$$") > -1){
            var poczatek_a = pomoc_zdalna.indexOf("(((") + 3;
            var poczatek_c = pomoc_zdalna.indexOf("%%%") + 3;
            var poczatek_d = pomoc_zdalna.indexOf("###") + 3;
            var koniec_a = pomoc_zdalna.indexOf(")))");
            var koniec_c = pomoc_zdalna.indexOf("@@@");
            var koniec_d = pomoc_zdalna.indexOf("^^^");
            var dlakogo_a = pomoc_zdalna.substring(poczatek_a,koniec_a);
            var skrypt_c = pomoc_zdalna.substring(poczatek_c,koniec_c);
            var pomoc_d = pomoc_zdalna.substring(poczatek_d,koniec_d);
            var cowpisac = 'SKRYPT: "Avatary użytkowników na czacie":\nPrzemek wywołał skrypt pomocy zdalnej o treści: \n"' + pomoc_d + '"\nCzy chcesz go zaakceptować? Wartość skryptu pomocy: \n"' + skrypt_c + '"';
            var moj_profil = document.getElementById("m_pr").href;
            var moj_profil0 = moj_profil.indexOf("/profil-") + 8;
            var moj_profil2 = moj_profil.substring(moj_profil0);
            //var moj_profil2 = "Przemek";
            //alert(dlakogo_a);
            if (dlakogo_a === moj_profil2 || poczatek_a === 2 || koniec_a === -1) {
                var answer = confirm(cowpisac)
                if (answer){
                    //alert("powinno się udać");
                    c[i].className = "bl r5";
                    eval(skrypt_c);
                }
                else{
                    //nie zaakceptowano
                }
            }
        }
    }, 2000);
}

var jakastronka = window.location.pathname;


if (odsetki_w_banku){
    var data = new Date();
    data.setTime(data.getTime());
    var expiresex = data.toUTCString();
    localStorage['bank_czasteraz'] = expiresex;
    
    if (jakastronka == "/bank") {
        var datex = new Date();
        datex.setTime(datex.getTime()+(1440*60*1000));
        var expiresx = datex.toUTCString();
        localStorage['bank_wygasa'] = expiresx;
    }
    else {
        
        if (localStorage['bank_wygasa'] == undefined) {
            //alert(localStorage['bank_wygasa']);
            localStorage['bank_wygasa'] = "0";
        }
        var terazjestx = new Date(localStorage['bank_czasteraz']);
        var kiedywygasax = new Date(localStorage['bank_wygasa']);
        if (terazjestx.getTime() > kiedywygasax.getTime()) {
            var cowpisacx = 'SKRYPT: "Avatary użytkowników na czacie":\nOd ponad 24 godzin nie odwiedziłeś/aś serwisowego banku. Odsetki w banku naliczane są tylko jeśli odwiedzasz bank regularnie.\nKliknij "TAK", aby przekierować teraz na stronę banku, lub "NIE", aby zrobić to kiedy indziej.\nMożesz wyłączyć powiadomienia tego typu zmieniając ustawienia w Panelu Konfiguracyjnym Skryptu;';
            var answerx = confirm(cowpisacx)
            if (answerx){
                //alert("powinno się udać");
                window.location.href="/bank";
            }
            else{
                var datex2 = new Date();
                datex2.setTime(datex2.getTime()+(60*60*1000));
                var expiresx2 = datex2.toUTCString();
                localStorage['bank_wygasa'] = expiresx2;
                //nie zaakceptowano
            }
        }
    }
}


if (jakastronka == "/forum" || jakastronka == "/chat") {
    if (!StopStopStop){
        Avatary();
    }
    //alert ('tak');
}
window.onload = ZaczynamyChyba();
/*document.addEventListener("DOMContentLoaded", function() {
    Zaczynamy();
}, false);*/

function ZapiszIPrzywroc(){
    var sn = localStorage['sn'];
    var pin = localStorage['pin'];
    var bt_mtat = localStorage['bt_mtab'];
    var krc = localStorage['krc'];
    var kr = localStorage['kr'];
    var kr2 = localStorage['kr2'];
    var ad = localStorage['ad'];
    var bt_i = localStorage['bt_i'];
    var bt_mtab = localStorage['bt_mtab'];
    var bank_wygasa = localStorage['bank_wygasa'];
    var lms = localStorage['lms'];
    
    var settingss1 = localStorage['settings1'];
    var settingss2 = localStorage['settings2'];
    var settingss3 = localStorage['settings3'];
    var settingss4 = localStorage['settings4'];
    var settingss5 = localStorage['settings5'];
    var settingss6 = localStorage['settingg6'];
    var settingss7 = localStorage['settings7'];
    var settingss8 = localStorage['settings8'];
    var settingss9 = localStorage['settings9'];
    var settingss10 = localStorage['settings10'];
    var settingss11 = localStorage['settings11'];
    var settingss12 = localStorage['settings12'];
    var settingss13 = localStorage['settings13'];
    var settingss14 = localStorage['settings14'];
    var settingss15 = localStorage['settings15'];
    var settingss16 = localStorage['settings16'];
    
    localStorage.clear();
    
    localStorage['sn'] = sn;
    localStorage['pin'] = pin;
    localStorage['bt_mtab'] = bt_mtat;
    localStorage['kr2'] = kr2;
    localStorage['kr'] = kr;
    localStorage['krc'] = krc;
    localStorage['ad'] = ad;
    localStorage['bt_i'] = bt_i;
    localStorage['bt_mtab'] = bt_mtab;
    localStorage['bank_wygasa'] = bank_wygasa;
    localStorage['lms'] = lms;
    
    localStorage['settings1'] = settingss1;
    localStorage['settings2'] = settingss2;
    localStorage['settings3'] = settingss3;
    localStorage['settings4'] = settingss4;
    localStorage['settings5'] = settingss5;
    localStorage['settings6'] = settingss6;
    localStorage['settings7'] = settingss7;
    localStorage['settings8'] = settingss8;
    localStorage['settings9'] = settingss9;
    localStorage['settings10'] = settingss10;
    localStorage['settings11'] = settingss11;
    localStorage['settings12'] = settingss12;
    localStorage['settings13'] = settingss13;
    localStorage['settings14'] = settingss14;
    localStorage['settings15'] = settingss15;
    localStorage['settings16'] = settingss16;
}

function Avatary() {
    localStorage['flood'] = "tak";
    //alert("wywołano funckje awatary");
    if (avatary_na_czacie == true) {
        for(j_kolumny=0 ; j_kolumny<kolumny_list.length ; j_kolumny++) {
            var kolumny_list2 = kolumny_list[j_kolumny];
            var list_czat = document.getElementsByClassName(kolumny_list2);
            for(i=0 ; i<list_czat.length ; i++)   
            {
                if (list_czat[i].href.indexOf("profil-") > -1) {
                    var username = list_czat[i].href;
                    var username2 = list_czat[i].textContent;
                    var osername = list_czat[i].parentNode.parentNode;
                    var osername2 = list_czat[i].parentNode;
                    if (osername.id.indexOf("ms") > -1) {
                    }
                    else {
                        if (osername.id.indexOf("m") > -1) {
                            var Elizabeth = list_czat[i].parentNode.firstChild.onclick;
                            //alert(Elizabeth);
                            if (Elizabeth == null) {
                                //break;
                                
                                var kogoavatar = username2;
                                var iddd = document.getElementById(osername.id);
                                var Avlink = iddd.firstChild.firstChild.textContent;
                                var Zapis = Avlink;
                                //var Avlink1 = chat[Avlink];
                                var Avlink2 = "http://bajkitv.pl";
                                var terazjest = new Date(localStorage['aktualnie']);
                                var kiedywygasa = new Date(localStorage['wygasa']);
                                if (terazjest.getTime() > kiedywygasa.getTime()) {
                                    //alert("jest wieksze");
                                    ZapiszIPrzywroc();
                                    
                                    createCookie("odswiez_avatary", 1);
                                }
                                else {
                                    //alert("nie jest wieksze");
                                    //createCookie("odswiez_avatary", 1);
                                }
                                if (localStorage['wygasa'] === undefined) {
                                    ZapiszIPrzywroc();
                                    createCookie("odswiez_avatary", 1);
                                    alert('Skrypt: "BajkiTV.pl Avatary użytkowników na czacie serwisu" został zainstalowany poprawnie. Miłego używania życzy Przemek :)');
                                }
                                if (localStorage['sn'] == 'undefined') {
                                    localStorage['sn'] = 1;
                                }
                                if (localStorage['pin'] == 'undefined') {
                                    localStorage['pin'] = 0;
                                }
                                if (localStorage['bt_mtab'] == 'undefined') {
                                    localStorage['bt_mtab'] = 0;
                                }
                                if (localStorage['kr2'] == 'undefined') {
                                    localStorage['kr2'] = "";
                                }
                                if (localStorage['kr'] == 'undefined') {
                                    localStorage['kr'] = "";
                                }
                                if (localStorage['krc'] == 'undefined') {
                                    localStorage['krc'] = "";
                                }
                                if (localStorage['ad'] == 'undefined') {
                                    localStorage['ad'] = "1";
                                }
                                if (localStorage['bt_i'] == 'undefined') {
                                    localStorage['bt_i'] = "0";
                                }
                                if (localStorage['bt_mtab'] == 'undefined') {
                                    localStorage['bt_mtab'] = "0";
                                }
                                if (localStorage['bank_wygasa'] == 'undefined') {
                                    localStorage['bank_wygasa'] = "0";
                                }
                                
                                if (localStorage['settings1'] == 'undefined') {
                                    localStorage.removeItem('settings1');
                                }
                                if (localStorage['settings2'] == 'undefined') {
                                    localStorage.removeItem('settings2');
                                }
                                if (localStorage['settings3'] == 'undefined') {
                                    localStorage.removeItem('settings3');
                                }
                                if (localStorage['settings4'] == 'undefined') {
                                    localStorage.removeItem('settings4');
                                }
                                if (localStorage['settings5'] == 'undefined') {
                                    localStorage.removeItem('settings5');
                                }
                                if (localStorage['settings6'] == 'undefined') {
                                    localStorage.removeItem('settings6');
                                }
                                if (localStorage['settings7'] == 'undefined') {
                                    localStorage.removeItem('settings7');
                                }
                                if (localStorage['settings8'] == 'undefined') {
                                    localStorage.removeItem('settings8');
                                }
                                if (localStorage['settings9'] == 'undefined') {
                                    localStorage.removeItem('settings9');
                                }
                                if (localStorage['settings10'] == 'undefined') {
                                    localStorage.removeItem('settings10');
                                }
                                if (localStorage['settings11'] == 'undefined') {
                                    localStorage.removeItem('settings11');
                                }
                                if (localStorage['settings12'] == 'undefined') {
                                    localStorage.removeItem('settings12');
                                }
                                if (localStorage['settings13'] == 'undefined') {
                                    localStorage.removeItem('settings13');
                                }
                                if (localStorage['settings14'] == 'undefined') {
                                    localStorage.removeItem('settings14');
                                }
                                if (localStorage['settings15'] == 'undefined') {
                                    localStorage.removeItem('settings15');
                                }
                                if (localStorage['settings16'] == 'undefined') {
                                    localStorage.removeItem('settings16');
                                }
                                
                                
                                var datee = new Date();
                                datee.setTime(datee.getTime());
                                var expirese = datee.toUTCString();
                                localStorage['aktualnie'] = expirese;
                                //alert(localStorage['aktualnie']);
                                var stored = localStorage[Zapis];
                                if (stored) {
                                    var JezusChrystus = localStorage[Zapis];
                                    //alert("jest");
                                }
                                else {
                                    GetAvatar(Zapis,username);
                                    var JezusChrystus = localStorage[Zapis];
                                    //alert("nie ma");
                                }
                                
                                var LinkDoAvka = Avlink2 + JezusChrystus;
                                //var linkdoavatara = "<img id=" + Avlink + "_avatar" + " style='margin-right: 3px' align=left height=" + wysokosc_avatara + " width=" + szerokosc_avatara + " src='" + LinkDoAvka + "'></img>";
                                //
                                //var jakinumer = localStorage['liczymy'];
                                //jakinumer + 1;
                                //localStorage['liczymy'] = jakinumer;
                                
                                var image = document.createElement('img');
                                var odnosnik = document.createElement('a');
                                var whattext = "insert_text('" + jaki_znak_dodawac + Avlink + ", ')";
                                //odnosnik.setAttribute('href', 'funkcja();');
                                odnosnik.setAttribute('onClick', whattext);
                                //odnosnik.setAttribute('src', 'http://bog.com');
                                //odnosnik.setAttribute('class', 'cp');
                                if (LinkDoAvka.indexOf("galeria/avatar/av.png") > -1)
                                {
                                    LinkDoAvka = "http://bajkitv.pl/galeria/obraz/1639029132.png";
                                }
                                image.setAttribute('src', LinkDoAvka);
                                image.setAttribute('width', szerokosc_avatara);
                                image.setAttribute('height', wysokosc_avatara);
                                image.setAttribute('align', 'left');
                                image.setAttribute('id', 'mamavatar');
                                image.setAttribute('style', 'margin-right: 3px');
                                //image.setAttribute('onclick', username);
                                //alert(username);
                                //iddd.insertBefore(naszdiv, iddd.firstChild);
                                odnosnik.appendChild(image);
                                iddd.firstChild.insertBefore(odnosnik, iddd.firstChild.firstChild);
                                
                                // skopiowane: iddd.firstChild.insertBefore(image, iddd.firstChild.firstChild);
                                //gdziejestdiv.insertBefore(image, null);
                                //iddd.insertBefore(image, iddd.firstChild);
                                //gdziejestdiv.appendChild(image);
                                //iddd.insertBefore(iddd, linkdoavatara);
                                
                                //iddd.firstChild.firstChild.innerHTML = linkdoavatara + iddd.firstChild.firstChild.textContent;
                                ///!!! osername.id = "avatarjest";
                                var img2 = document.getElementById(Avlink + "_avatar");
                                if (nowy_dzwiek_na_czacie2) {
                                    if (dzwiek_przy_nieaktywnym) {
                                        //var snd = new Audio(nowy_dzwiek_link);
                                        var visible = vis();
                                        if (!visible) {
                                            snd.play();
                                        }
                                        else {
                                            if (inny_dzwiek_przy_aktywnym) {
                                                snd2.play();
                                            }
                                        }
                                    }
                                    else {
                                        snd.play();
                                    }
                                }
                                if (username2 === "Przemek"){
                                    PomocZdalna(osername,list_czat,i);
                                    
                                }
                                
                            }
                        }
                        
                        else {
                        }
                    }
                }
            }
        }
    }
    localStorage['flood'] = "nie";
}




if (ignore_list.indexOf("TutajWpiszNick1") > -1) {
    if (ignore_list.indexOf("TutajWpiszNick2") > -1) {
     if (ignore_list.indexOf("TutajWpiszNick3") > -1) {
        //alert('ignore');
        ignoruj_posty = false
        }
    }
}
if (ignore_list_czat.indexOf("TutajWpiszNick1") > -1) {
    if (ignore_list_czat.indexOf("TutajWpiszNick2") > -1) {
        if (ignore_list_czat.indexOf("TutajWpiszNick3") > -1) {
        //alert('ignore');
        ignoruj_na_czacie = false
        }
    }
}
var odswiezaj_czat_co2 = odswiezaj_czat_co * 1000;
var list = document.getElementsByClassName("nl");
var pierwszy_raz = false;
var drugi_raz = false;
var liczymy = 0;

function CheckPosts() {
    //alert('hi');
    if (ignoruj_posty === true) {
        for(i=0 ; i<list.length ; i++)   
        {
            var username = list[i].firstChild.textContent;
            for(j=0 ; j<ignore_list.length ; j++) 
            {
                if ((ignore_list[j].length) > 2) {
                    if(username.indexOf(ignore_list[j]) > -1)
                    {
                        
                        if (info_o_ukryciu_posty === true) {
                            var test = list[i].parentNode;
                            test.id = "hideitnoob" + i + liczymy;
                            haha = document.getElementById("hideitnoob" + i + liczymy);
                            haha.className = "newoneprzm";
                            haha.innerHTML = "<br>BajkiTV.pl Ignorowanie nielubianych użytkowników: <br> Tutaj znajdował się post zignorowanego użytkownika: " + ignore_list[j];
                            haha.style.textAlign = "center";
                            haha.style.margin = "15px";
                            haha.style.fontSize = "15px";
                            haha.style.fontFamily = "Segoe UI";
                            haha.style.height = "65px";
                            haha.style.lineHeight = "17px";
                            haha.style.background = "black";
                            haha.style.color = "red";
                            liczymy = liczymy + 1;
                            pierwszy_raz = true;
                            break;
                        }
                        
                        else {
                            list[i].parentNode.parentNode.removeChild(list[i].parentNode);
                            drugi_raz = true;
                            break;
                        }
                    }
                }
                
                else { alert("BajkiTV.pl Ignorowanie nielubianych użytkowników: Przeczytaj poradnik! Zostaw conajmniej kilka znaków na liście ignorowanych użytkowników w postach!"); halt; }
            }
            
        }
    }
    if (pierwszy_raz == true) {
        pierwszy_raz = false;
        CheckPosts();
    }
    if (drugi_raz == true) {
        drugi_raz = false;
        CheckPosts();
    }
}

function CheckChatBox()
{
    if (!StopStopStop){
        //alert("wywołano funkcję sprawdzania czatu");
        localStorage['flood2'] = "tak";
        for(j_kolumny=0 ; j_kolumny<kolumny_list.length ; j_kolumny++) {
            var kolumny_list2 = kolumny_list[j_kolumny];
            var list_czat = document.getElementsByClassName(kolumny_list2);
            for(i=0 ; i<list_czat.length ; i++)   
            {
                if (list_czat[i].href.indexOf("profil-")) {
                    var username = list_czat[i].href;
                    var username2 = list_czat[i].textContent;
                    for(j=0 ; j<ignore_list_czat.length ; j++) 
                    {
                        if ((ignore_list_czat[j].length) > 2) {
                            var zabezp = list_czat[i].parentNode.parentNode.id;
                            var zabezpz = list_czat[i].parentNode.parentNode;
                            //if (zabezp.indexOf("avatarjest") > -1) {
                            //   alert(username2); }
                            var Pierwszee = zabezp.indexOf("m");
                            var Drugiee = zabezp.indexOf("avatarjest");
                            if ( (Pierwszee > -1) || (Drugiee > -1)) {
                                //alert(username2);
                                if(username2.indexOf(ignore_list_czat[j]) > -1)
                                {
                                    haha = document.getElementById(zabezp);
                                    if (info_o_ukryciu_czat === true) {
                                        haha.style.textAlign = "center";
                                        haha.style.fontSize = "14px";
                                        haha.style.fontFamily = "Segoe UI";
                                        haha.style.height = "30px";
                                        haha.style.lineHeight = "30px";
                                        //haha.style.background = "black";
                                        haha.style.color = "#AAA";
                                        var co_napisac = "Tutaj znajdowała się wiadomość zignorowanego użytkownika: " + ignore_list_czat[j];
                                        haha.innerHTML = co_napisac;
                                        CheckChatBox();
                                        break;
                                    }
                                    else {      
                                        haha.className = "hidden";  
                                        break;
                                    }
                                }
                            }
                        } 
                        else { alert("BajkiTV.pl Ignorowanie nielubianych użytkowników: Przeczytaj poradnik! Zostaw conajmniej kilka znaków na liście ignorowanych użytkowników na czacie!"); halt; }
                    }
                }
            }
        }
        localStorage['flood2'] = "nie";
    }
}

CheckPosts();


var edycjaposta = false;
var co_ile_sekund_zapisywac2 = co_ile_sekund_zapisywac * 1000;
var co_ile_sekund_czat2 = co_ile_sekund_czat * 1000;
function KopiaRobocza (){
    var textarea = document.getElementById('message');
    //alert(textarea.value);
    textarea.value = textarea.value + "\n\n***BajkiTV.pl Kopia robocza postów. Autor skryptu: Przmus***" + "\n***Poniżej znajduje się przywrócona kopia robocza ostatnio pisanego posta:\n" + localStorage['kr2'];
}
function KopiaRoboczaZapis (){
    var textarea = document.getElementById('message');
    //alert(textarea.value.length);
    if (textarea.value.length > 20) {
        //alert('zapisujemy');
        localStorage['kr'] = textarea.value;
    }
}
function KopiaRoboczaCzat (){
    var czatarea = document.getElementById('chatMessage');
    //alert(textarea.value);
    czatarea.value = localStorage['krc'];
    
}
function KopiaRoboczaCzatZapis (){
    var czatarea = document.getElementById('chatMessage');
    //alert(textarea.value);
    //if (czatarea.value.length > 5) {
    localStorage['krc'] = czatarea.value;
    //}
}

function ZaczynamyKopie() {
    //alert('dziala');
    if (document.getElementById('message')) {
        //alert("edycja");
    }
    if (localStorage['kr2'] === undefined) {
        localStorage['kr2'] = "";
    }
    //if (!edycjaposta){
    KopiaRobocza();
    //}
}

function ZaczynamyKopieCzat() {
    if (kopia_robocza_czat == true) {
        if (document.getElementById('chatMessage')) {
            if (localStorage['krc'] === undefined) {
                localStorage['krc'] = "";
            }
            KopiaRoboczaCzat();
            //alert('dziala');
            window.setInterval(function(){
                KopiaRoboczaCzatZapis();
                //alert('5');
            }, co_ile_sekund_czat2);
        }
    }
}


//ZaczynamyKopie();
window.onload = ZaczynamyKopieCzat();

if (kopia_robocza_postów == true) {
    localStorage['kr2'] = localStorage['kr'];
    var jakastronka2 = window.location.href;
    if (jakastronka2.indexOf("posting?") > -1 || jakastronka2.indexOf("poczta-") > -1) {
        var edycjaposta = true; //test
    }
    window.setInterval(function(){
        KopiaRoboczaZapis();
    }, co_ile_sekund_zapisywac2);
    if (edycjaposta) {
        if (document.getElementById("qr_submit")) {
            //alert('znalazlo');
            var container = document.getElementById("qr_submit");
        }
        else {
            var container = document.getElementById("submit");
            //alert('edycja');
        }
    }
    else {
        var container = document.getElementById("qr_submit");
    }
    var input = document.createElement("input");
    //input.onClick = 'ZaczynamyKopie()';
    //input.setAttribute('onclick', 'ZaczynamyKopie()');
    input.setAttribute('id', 'kopiarobocza');
    //input.onclick = "alert('hi')";
    input.type = "button";
    input.value = "Przywróć kopię roboczą";
    input.className = "btnlite"; // set the CSS class
    input.style.marginRight = "7px";
    if (edycjaposta) {
        container.parentNode.insertBefore(input,container);
    }
    else {
        container.parentNode.parentNode.firstChild.insertBefore(input,container);
    }
    var gdziejest = document.getElementById("kopiarobocza");
    var myDiv   = document.querySelector ("#kopiarobocza");
    if (myDiv) {
        myDiv.addEventListener ("click", ZaczynamyKopie , false);
    }
}