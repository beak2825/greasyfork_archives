// ==UserScript==
// @name        BajkiTV.pl Ignorowanie nielubianych użytkowników. Autor skryptu: Przmus
// @namespace   http://bajkitv.pl
// @include     http://bajkitv.pl*
// @version     1.6
// @grant       none
// @description Skrypt umożliwiający ignorowanie postów i wiadomości na czacie od nielubianych użytkowników w serwisie BajkiTV.pl
// @downloadURL https://update.greasyfork.org/scripts/4190/BajkiTVpl%20Ignorowanie%20nielubianych%20u%C5%BCytkownik%C3%B3w%20Autor%20skryptu%3A%20Przmus.user.js
// @updateURL https://update.greasyfork.org/scripts/4190/BajkiTVpl%20Ignorowanie%20nielubianych%20u%C5%BCytkownik%C3%B3w%20Autor%20skryptu%3A%20Przmus.meta.js
// ==/UserScript==

/*
Oficjalny poradnik dotyczący skryptu, znajduje się tutaj: http://bajkitv.pl/poradnik_blokowanie_postow_i_wiadomosci_na_czacie_od_nielubianych_uzytkownikow_na_bajkitvpl-t39087
Czytaj uważnie notatki poza zmiennymi (var), jest tam objaśnione co dana opcja zmienia.
Miłego dnia życzy: Przmus.
 */

/////////////////////// KONFIGURACJA ////////////////////////
//Lista ignorowanych użytkowników w postach na forum. Kolejnych użytkowników dodawaj w cudzysłowach, po przecinku, np: "Użytkownik1","Użytkownik2","Użytkowik3" itd.
//Nigdy nie zostawiaj tego pola pustego. Jeśli nie chcesz nikogo ignorować to wpisz coś w stylu: "Użytkownik1blablabla222".
var ignore_list = [
                        "TutajWpiszNick1","TutajWpiszNick2"
                  ]

//Lista ignorowanych użytkowników w wiadomościach na czacie. Kolejnych użytkowników dodawaj w cudzysłowach, po przecinku, np: "Użytkownik1","Użytkownik2","Użytkowik3" itd.
//Nigdy nie zostawiaj tego pola pustego. Jeśli nie chcesz nikogo ignorować to wpisz coś w stylu: "Użytkownik1blablabla222".
var ignore_list_czat = [
                        "TutajWpiszNick1","TutajWpiszNick2"
                  ]

var ignoruj_posty = true; //"true" aby włączyć ignorowanie postów wybranych użytkowników, "false" aby wyłączyć.
var ignoruj_na_czacie = true; //"true" aby włączyć ignorowanie wiadomości na czacie wybranych użytkowników, "false" aby wyłączyć.
var info_o_ukryciu_posty = true; // czy wyświetlić informację o ukryciu postu zignorowanego użytkownika?
var info_o_ukryciu_czat = true; // czy wyświetlić informację o wiadomości na czacie zignorowanego użytkownika?
//////////////////// KONIEC KONFIGURACJI ////////////////////







//nieaktualne
var odswiezaj_czat_co = 5; // Opcja nieaktualna, brak potrzeby używania od wersji 1.5 +. Co ile sekund uruchamiać skrypt, aby ukryć nowe wiadomości na czacie od nielubianych użytkowników?
//nieaktualne






if (document.getElementById("simple_chat")) {
var Joanna2 = document.getElementById("simple_chat");
Joanna2.addEventListener("DOMNodeRemoved", function() {
    CheckChatBox();
    //alert('kliknieto');
}, false);
}

var Marlenka2 = document.getElementById("chatData");
function Zaczynamy2() {
Marlenka2.addEventListener("DOMNodeInserted", function() {
    if (localStorage['flood2'] == "nie") {
    //alert("wywołuje event");
    //alert(localStorage['flood']);
    localStorage['flood2'] = "tak";
    CheckChatBox();
    }
    else {
    localStorage['flood2'] = "nie"; /// musi być bo czasem się zawiesza :(
    //alert("flood!");
    }
}, false);
}

function ZaczynamyChyba2() {
if (ignoruj_na_czacie == true) {
    window.setTimeout(function(){
        Zaczynamy2();
    }, 3000);
}
}
ZaczynamyChyba2();

if (ignore_list.indexOf("TutajWpiszNick1,TutajWpiszNick2") > -1) {
    if (ignore_list.indexOf("TutajWpiszNick2") > -1) {
ignoruj_posty = false
}
}
if (ignore_list_czat.indexOf("TutajWpiszNick1") > -1) {
    if (ignore_list_czat.indexOf("TutajWpiszNick2") > -1) {
ignoruj_na_czacie = false
}
}
var odswiezaj_czat_co2 = odswiezaj_czat_co * 1000;
var list = document.getElementsByClassName("nl");
var pierwszy_raz = false;
var drugi_raz = false;
var liczymy = 0;

function CheckPosts() {
if (ignoruj_posty == true) {
for(i=0 ; i<list.length ; i++)   
{
  var username = list[i].firstChild.textContent;
  for(j=0 ; j<ignore_list.length ; j++) 
  {
      if ((ignore_list[j].length) > 2) {
      if(username.indexOf(ignore_list[j]) > -1)
    {
      
      if (info_o_ukryciu_posty == true) {
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



var kolumny_list = [
                  "bl r11", "bl r10", "bl r9", "bl r8", "bl r7", "bl r6", "bl r5", "bl r4", "bl r3", "bl r2"
]


function CheckChatBox()
{
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
      if (info_o_ukryciu_czat == true) {
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

if (ignoruj_na_czacie == true) {
CheckChatBox();
//window.setInterval(function(){
    //CheckChatBox();
//}, odswiezaj_czat_co2);
}
CheckPosts();