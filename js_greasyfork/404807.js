// ==UserScript==
// @name         Account Creator for UFS.PT [gazeta.pl]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Infinity
// @match        https://konto.gazeta.pl/konto/rejestracja.do
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @description  Account Creator for UFS.PT
// @downloadURL https://update.greasyfork.org/scripts/404807/Account%20Creator%20for%20UFSPT%20%5Bgazetapl%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/404807/Account%20Creator%20for%20UFSPT%20%5Bgazetapl%5D.meta.js
// ==/UserScript==

(function() {
  var css = ".wheatButton { padding: 5px 10px; display: inline-block; color: black!important; font-size: 13px; font-family: Calibri; font-weight: bold; font-variant: small-caps; text-decoration: none!important; background-color: white; border-radius: 2px; cursor: pointer; -webkit-font-smoothing:antialiased;  box-sizing: border-box; box-shadow: -2px 2px 1px black; border: 1px solid #1b1b1b; transition: all 250ms;  } .wheatButton:hover{ background-color: lightgrey; color: #d35400!important; box-shadow: -3px 3px 4px black!important; border: 1px solid #606060; transition: all 250ms;}";
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      var node = document.createElement("style");
      node.type = "text/css";
      node.appendChild(document.createTextNode(css));
      heads[0].appendChild(node);
    }
  }
})();

$(document).ready(function ()
{
  $("<a>",
  {
    "class": "wheatButton",
    text: "Powrót na stronę rejestracji",
    "id": "home",
    value: "up",
    type: "button",
    style: "position: fixed; top: 5px; right: 5px;"
  }).appendTo("body");
  $("<a>",
  {
    "class": "wheatButton",
    text: "Wykonaj skrypt (uzupełnij pola)",
    "id": "execute",
    value: "up",
    type: "button",
    style: "position: fixed; top: 32px; right: 5px;"
  }).appendTo("body");
  $("<a>",
  {
    "class": "wheatButton",
    text: "Instrukcja",
    "id": "instr",
    value: "up",
    type: "button",
    style: "position: fixed; top: 70px; right: 5px;"
  }).appendTo("body");

  $('#home').click(function() {
    window.location.replace("https://konto.gazeta.pl/konto/rejestracja.do");
  });
  $('#execute').click(function() {
    testy();
  });
  $('#instr').click(function() {
    instrukcja();
  });
  function testy() {

      void function(){
          function e(e,t){
              var a="",n="";
              n=0==e?"abcdefghijklmnopqrstuvwxyz":1==e?"abcdefghijklmnopqrstuvwxyz0123456789_-":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
              for(var o=0;o<Math.floor(10*Math.random())+t;o++) a+=n.charAt(Math.floor(Math.random()*n.length));
              return a
          }
          function t(e,t){
              return Math.floor(Math.random()*(t-e+1))+e}
          var znaki='1234567890';
          var znaki1='123456789';
          var znaki3='!@#$';
          var znaki4='qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
          var imiona=['Antoni','Jakub','Szymon','Adam','Mikolaj','Adrian','Milosz','Patryk','Pawel','Hubert','Albert','Kajetan','Kacper','Fabian','Marcin','Rafal','Daniel','Piotr','Krzysztof','Tomasz','Grzegorz','Wojciech'];
          var nazwiska=['Wisniewski','Wojcik','Kowalczyk','Kaminski','Kwiatkowski','Kaczmarek','Piotrowski','Krol','Wrobel','Olszewski','Malinowski','Witkowski','Walczak','Pietrzak','Zalewski','Jakubowski','Wilk','Borkowski'];
          var temp=znaki3[~~(Math.random()*znaki3.length)];
          var day=znaki1[~~(Math.random()*znaki1.length)];
          var name=imiona[~~(Math.random()*imiona.length)];
          var sname=nazwiska[~~(Math.random()*nazwiska.length)];
          var mail=znaki[~~(Math.random()*znaki.length)]+znaki[~~(Math.random()*znaki.length)]+znaki[~~(Math.random()*znaki.length)];
          var pwd='';
          for (i=0;i<=0;i++) mail+=znaki[~~(Math.random()*znaki.length)];
          for (i=0;i<=9;i++) pwd+=znaki4[~~(Math.random()*znaki4.length)];
          document.getElementById("login").value=name.toLowerCase()+'.'+sname.toLowerCase()+mail.toLowerCase();
          document.getElementById("pass").value=pwd+temp, document.getElementById("emailPassRecovery").value=e(0,6)+"@wp.pl", document.getElementById("sex1").checked=!0, document.getElementById("date-input-day").value=day, document.getElementById("date-input-month").value=t(1,12), document.getElementById("date-input-year").value=t(1950,2001), document.getElementById("acceptEmailAccountTerms").click(), document.getElementById("acceptAll").click();
          var o=window.open("","gazeta.pl","width=400,height=500");
          o.document.write("<title>gazeta.pl - założone konta</title>L: "+name.toLowerCase()+'.'+sname.toLowerCase()+mail.toLowerCase()+"@gazeta.pl<br/>P: "+pwd+temp+"<br/><br/>")}();
  }
  function instrukcja() {
          alert("1. Wykonać skrypt.\r\n2. Kliknąć na pole do wpisywania loginu.\r\n3. Wciskać klawisz TAB, aż do wybrania captchy.\r\n4. Rozwiazać captchę.\r\n5. Kliknąć w przycisk \"Zakładam konto\".\r\n6. Konto zostało poprawnie założone, jeśli po zatwierdzeniu formularza pojawi sie tekst \"Konto zostało utworzone\".")
  }
});