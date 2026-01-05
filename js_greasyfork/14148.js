// ==UserScript==
// @name         T411 Shoutbox - MP Site
// @namespace    https://www.t411.io
// @version      1.3.3
// @description  Ajoute un bouton envoyer un MP a un membre
// @author       RavenRoth
// @include      http://www.t411.al/chati/*
// @include      https://www.t411.al/chati/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/14148/T411%20Shoutbox%20-%20MP%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/14148/T411%20Shoutbox%20-%20MP%20Site.meta.js
// ==/UserScript==
function ButtonClicked(x)
{
  GM_openInTab("http://www.t411.ch/mailbox/compose/?to="+x,false);
}
function BuildLink(message, libelle, libelleColor, respondItem)
{
  link = document.createElement('a');
  link.setAttribute('class', respondItem);
  link.setAttribute('style', 'color:' + libelleColor + ';a:hover{text-decoration:underline;};cursor:pointer;position:relative;right:1px;display:block;');
  link.addEventListener('click', function () {
    ButtonClicked(this.className);
  }, false);
  newText = document.createTextNode(libelle);
  link.appendChild(newText);
  emplacement_0 = message;
  emplacement_1 = emplacement_0.getElementsByTagName('div') [0];
  emplacement_1.appendChild(link);
}
function INIT()
{
  document.styleSheets[0].insertRule('#messages .data>a {display:block !important;}', 0);
  var messages_childs = document.getElementById('messages').getElementsByTagName('div');
  for (i = - 2; i < messages_childs.length; i = i + 3)
  {
    if (i == - 2 || i == - 1)
    {
      continue;
    }
    message = messages_childs[i];
    user_written_message = message.getElementsByClassName('button-delete').length;
    if (user_written_message === 0)
    {
        var id=element.className.split(" ")[1].split("-")[1]
        BuildLink(_first, 'MP Site', '#777', id);
    }
  }
}
function AnswerItems()
{
  document.getElementById('messages').addEventListener('DOMNodeInserted', function (event)
  {
    if (event.target.parentNode.id == 'messages')
    {
      var element = document.getElementsByClassName(event.target.className) [0];
      var _first = element.getElementsByTagName('div') [0];
      var _second = _first.getElementsByTagName('div') [0];
      var third = _second.getElementsByClassName('button-delete').length;
      var myid=unsafeWindow.me.uid
      if (third === 0)
      {
        var id=element.className.split(" ")[1].split("-")[1]
        if (!id)
        {
          id=element.className.split(" ")[2].split("-")[1]
        }
        if (id != myid)
         BuildLink(_first, 'MP Site', '#777', id);
      }
    }
  }, false);
}
INIT(this);
AnswerItems(this);
