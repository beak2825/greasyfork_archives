// ==UserScript==
// @name        Detobellificator
// @namespace   fr.diagamma.bjrcdmt
// @description Bonjour, Cordialement
// @include     http://minecraft.fr/forum/*
// @version     1
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/22485/Detobellificator.user.js
// @updateURL https://update.greasyfork.org/scripts/22485/Detobellificator.meta.js
// ==/UserScript==

$(window).load(function(){
  GM_addStyle(".detobel { word-wrap: normal !important; width: 110px !important; } .detobel:before { content: '' !important; } .detobel:after { content: 'Detobellificator' !important; }");
  
  function detobellifier() {
    var texte = document.getElementsByClassName('redactor_MessageEditor')[0].contentWindow.document.body.innerHTML;
    document.getElementsByClassName('redactor_MessageEditor')[0].contentWindow.document.body.innerHTML = "Bonjour,<br/><br/>" + texte + "<br/>Cordialement,<br/>" + document.getElementsByClassName('accountUsername')[0].innerHTML;
    
    return false;
  }
  
  var btnDetobel = document.createElement('li');
  btnDetobel.className = 'redactor_btn_group';
  var ul = document.createElement('ul');
  
  var btnDetobelContainer = document.createElement('li');
  btnDetobelContainer.className = 'redactor_btn_container_redo';
  var btnDetobelA = document.createElement('a');
  btnDetobelA.className = 'redactor_btn_redo detobel';
  btnDetobelA.onclick = function(){detobellifier();};
  btnDetobelContainer.appendChild(btnDetobelA);
  
  ul.appendChild(btnDetobelContainer);
  
  btnDetobel.appendChild(ul);
  
  var toolbar = document.getElementsByClassName('redactor_toolbar')[0];
  toolbar.appendChild(btnDetobel);
});