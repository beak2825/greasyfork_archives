// ==UserScript==
// @name         T411 Shoutbox - Classes
// @namespace    https://www.t411.io
// @version      1.2.7
// @description  Ajoute le nom des classes a coté du pseudo
// @author       RavenRoth
// @include      http://www.t411.al/chati/*
// @include      https://www.t411.al/chati/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13236/T411%20Shoutbox%20-%20Classes.user.js
// @updateURL https://update.greasyfork.org/scripts/13236/T411%20Shoutbox%20-%20Classes.meta.js
// ==/UserScript==
function AddClass()
{
  document.getElementById('messages').addEventListener('DOMNodeInserted', function (event)
  {
    if (event.target.parentNode.id == 'messages')
    {
      var element = document.getElementsByClassName(event.target.className) [0];
      var _first = element.getElementsByTagName('div') [0];
      var _second = _first.getElementsByTagName('div') [0];
      var _third = _second.getElementsByTagName('strong') [0];
      var _fourth = _third.getElementsByTagName('a') [0];
      var rank = "";
      switch(_fourth.className) {
          case 'cls-1':
              rank = 'Us';
              break;
          case 'cls-2':
              rank = 'PS';
              break;
          case 'cls-3':
              rank = 'Up';
              break;
          case 'cls-4':
              rank = 'MS';
              break;
          case 'cls-5':
              rank = 'MF';
              break;
          case 'cls-6':
              rank = 'TP';
              break;
          case 'cls-8':
              rank = 'M';
              break;
          case 'cls-9':
              rank = 'SM';
              break;
          case 'cls-10':
              rank = 'A';
              break;
      } 
         _fourth.text= _fourth.text + " ("+rank+")";
    }
  }, false);
}
AddClass(this);
