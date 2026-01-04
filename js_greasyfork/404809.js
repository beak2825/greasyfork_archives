// ==UserScript==
// @name         Account Creator for UFS.PT [wp.pl]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Infinity
// @match        https://nowyprofil.wp.pl/rejestracja/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @description  Account Creator for UFS.PT
// @downloadURL https://update.greasyfork.org/scripts/404809/Account%20Creator%20for%20UFSPT%20%5Bwppl%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/404809/Account%20Creator%20for%20UFSPT%20%5Bwppl%5D.meta.js
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
    window.location.replace("https://nowyprofil.wp.pl/rejestracja/");
  });
  $('#execute').click(function() {
    testy();
  });
  $('#instr').click(function() {
    instrukcja();
  });
  function testy() {

      void function(){
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
          var tel=znaki[~~(Math.random()*znaki.length)];
          var name=imiona[~~(Math.random()*imiona.length)];
          var sname=nazwiska[~~(Math.random()*nazwiska.length)];
          var mail=znaki[~~(Math.random()*znaki.length)]+znaki[~~(Math.random()*znaki.length)]+znaki[~~(Math.random()*znaki.length)];
          var pwd='';  for (i=0;i<=4;i++) tel+=znaki[~~(Math.random()*znaki.length)];
          for (i=0;i<=0;i++) mail+=znaki[~~(Math.random()*znaki.length)];
          for (i=0;i<=9;i++) pwd+=znaki4[~~(Math.random()*znaki4.length)];
          document.getElementsByTagName("input")[0].click();
          document.getElementsByTagName("input")[0].value=name;
          document.getElementsByTagName("input")[0].focus();
          document.getElementsByTagName("input")[1].click();
          document.getElementsByTagName("input")[1].value=sname;
          document.getElementsByTagName("input")[1].focus();
          document.getElementById("male").click();
          document.getElementById("male").checked=true;
          document.getElementsByTagName("input")[4].click();
          document.getElementsByTagName("input")[4].value=day;
          document.getElementsByTagName("input")[4].focus();
          var n=document.getElementsByTagName("select")[0];n.selectedIndex=t(1,12);
          var a=new Event("change",{bubbles:!0});n.dispatchEvent(a);
          var l=document.getElementsByTagName("select")[1];l.selectedIndex=t(19,80);
          var o=new Event("change",{bubbles:!0});l.dispatchEvent(o);
          var m=name.toLowerCase()+'.'+sname.toLowerCase()+mail.toLowerCase(),c=document.getElementsByTagName("input")[5];c.click();
          var u=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;u.call(c,m);
          var r=new Event("input",{bubbles:!0});c.dispatchEvent(r);document.getElementsByTagName("input")[6].click();
          document.getElementsByTagName("input")[6].value=pwd+temp;
          document.getElementsByTagName("input")[6].focus();
          document.getElementsByTagName("input")[7].click();
          document.getElementsByTagName("input")[7].value=pwd+temp;
          document.getElementsByTagName("input")[7].focus();
          document.getElementsByTagName("input")[8].click();
          document.getElementsByTagName("input")[8].value='797'+tel;
          document.getElementsByTagName("input")[8].focus();
          document.getElementById("free").click(),setTimeout(function(){document.getElementById("selectAll").click()},1e3);
          document.getElementsByTagName("input")[0].focus();
          wp_konta=window.open ('','wp_konta','scrollbars=1,width=360,height=400');
          wp_konta.document.write('L: ' + name.toLowerCase()+'.'+sname.toLowerCase()+mail.toLowerCase() + '@wp.pl<br />P: ' + pwd+temp + '<br /><br />');}();
  }
  function instrukcja() {
          alert("1. Wykonać skrypt.\r\n2. Kliknąć na pole do wpisywania imienia.\r\n3. Wciskać klawisz TAB, aż do wybrania captchy.\r\n4. Rozwiazać captchę.\r\n5. Kliknąć w przycisk \"Załóż konto\".\r\n6. Konto zostało poprawnie założone, jeśli po zatwierdzeniu formularza pojawi sie tekst \"Twoje konto w Poczcie wp zostało założone!\".")
  }
});