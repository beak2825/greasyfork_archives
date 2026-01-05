// ==UserScript==
// @name        T411 Shoutbox Fast Reply 
// @namespace   T411 Shoutbox Fast Reply 
// @description Ajoute un bouton de réponse rapide au chat T411
// @include     http://*.t411.*/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18273/T411%20Shoutbox%20Fast%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/18273/T411%20Shoutbox%20Fast%20Reply.meta.js
// ==/UserScript==

javascript: (function () {
  function ButtonClicked(x) {
    if (document.getElementsByTagName('iframe').length > 0) {
      var iframe = document.getElementsByTagName('iframe') [0];
      var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      iframeDocument.getElementById('text-input').focus();
      iframeDocument.getElementById('text-input').value = x;
    } 
    else {
      document.getElementById('text-input').focus();
      document.getElementById('text-input').value = x;
    }
  }
  function BuildLink(message, libelle, libelleColor, respondItem) {
    link = document.createElement('a');
    link.setAttribute('class', respondItem);
    link.setAttribute('style', 'color:' + libelleColor + ';text-decoration: underline;cursor: pointer;position:relative;right:1px;display:block;');
    link.addEventListener('click', function () {
      ButtonClicked(this.className);
    }, false);
    newText = document.createTextNode(libelle);
    link.appendChild(newText);
    emplacement_0 = message;
    emplacement_1 = emplacement_0.getElementsByTagName('div') [0];
    emplacement_1.appendChild(link);
  }
  function FillInHistoriqueMessages() {
    var iframe = document.getElementsByTagName('iframe') [1];
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.styleSheets[0].insertRule('#messages .data>a {display:block !important;}', 0);
    var messages_historique_childs = iframeDocument.getElementById('messages').getElementsByTagName('div');
    for (i = - 2; i < messages_historique_childs.length; i = i + 3) {
      if (i == - 2 || i == - 1) {
        continue
      }
      message = messages_historique_childs[i];
      user_written_message = message.getElementsByClassName('button-delete').length;
      if (user_written_message == 0) {
        element2 = message.getElementsByTagName('a') [0];
        user_url_split = element2.href.split('/');
        name_user = user_url_split[5];
        BuildLink(message, 'Répondre', 'blue', '@' + name_user + ' ');
      }
    }
    iframeDocument.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
      if (event.target.parentNode.id == 'messages') {
        var element = iframeDocument.getElementsByClassName(event.target.className) [0];
        var _first = element.getElementsByTagName('div') [0];
        var _second = _first.getElementsByTagName('div') [0];
        var third = _second.getElementsByClassName('button-delete').length;
        if (third == 0) {
          var element2 = element.getElementsByTagName('a') [0];
          var user_url_split = element2.href.split('/');
          var name_user = user_url_split[5];
          BuildLink(_first, 'Répondre', 'blue', '@' + name_user + ' ');
        };
      };
    }, false)
  }
  function ChecksHistoriqueOpened() {
    if (document.getElementsByTagName('iframe').length > 0) {
      if ($(info).css('display') == 'block') {
        if (historique_opened == 0) {
          historique_opened = 1;
          setTimeout(FillInHistoriqueMessages, 100);
        }
      } else {
        historique_opened = 0;
      }
    }
  }
  function ChangedChannel() {
    if (document.getElementsByTagName('iframe').length > 0) {
      setTimeout(ReloadButtons, 1000);
    }
  }
  function ReloadButtons() {
    var iframe = document.getElementsByTagName('iframe') [0];
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    if (iframeDocument.readyState == 'complete') {
      INIT();
      AnswerItems();
    } else {
      setTimeout(ReloadButtons, 100);
    }
  }
  function INIT() {
    if (document.getElementsByTagName('iframe').length > 0) {
      var iframe = document.getElementsByTagName('iframe') [0];
      var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      link = iframeDocument.getElementById('rooms').getElementsByTagName('a') [0];
      link.addEventListener('click', function () {
        ChangedChannel();
      }, false);
      link = iframeDocument.getElementById('rooms').getElementsByTagName('a') [1];
      link.addEventListener('click', function () {
        ChangedChannel();
      }, false);
      link = iframeDocument.getElementById('history');
      link.addEventListener('click', function () {
        ChecksHistoriqueOpened();
      }, false);
      iframeDocument.styleSheets[0].insertRule('#messages .data>a {display:block !important;}', 0);
      var messages_childs = iframeDocument.getElementById('messages').getElementsByTagName('div');
      for (i = - 2; i < messages_childs.length; i = i + 3) {
        if (i == - 2 || i == - 1) {
          continue
        }
        message = messages_childs[i];
        user_written_message = message.getElementsByClassName('button-delete').length;
        if (user_written_message == 0) {
          element2 = message.getElementsByTagName('a') [0];
          user_url_split = element2.href.split('/');
          name_user = user_url_split[5];
          BuildLink(message, 'Répondre', 'blue', '@' + name_user + ' ');
        }
      }
    } else {
      document.styleSheets[0].insertRule('#messages .data>a {display:block !important;}', 0);
      var messages_childs = document.getElementById('messages').getElementsByTagName('div');
      for (i = - 2; i < messages_childs.length; i = i + 3) {
        if (i == - 2 || i == - 1) {
          continue
        }
        message = messages_childs[i];
        user_written_message = message.getElementsByClassName('button-delete').length;
        if (user_written_message == 0) {
          element2 = message.getElementsByTagName('a') [0];
          user_url_split = element2.href.split('/');
          name_user = user_url_split[5];
          BuildLink(message, 'Répondre', 'blue', '@' + name_user + ' ');
        }
      }
    }
  }
  function AnswerItems() {
    if (document.getElementsByTagName('iframe').length > 0) {
      var iframe = document.getElementsByTagName('iframe') [0];
      var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      iframeDocument.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
        if (event.target.parentNode.id == 'messages') {
          var element = iframeDocument.getElementsByClassName(event.target.className) [0];
          var _first = element.getElementsByTagName('div') [0];
          var _second = _first.getElementsByTagName('div') [0];
          var third = _second.getElementsByClassName('button-delete').length;
          if (third == 0) {
            var element2 = element.getElementsByTagName('a') [0];
            var user_url_split = element2.href.split('/');
            var name_user = user_url_split[5];
            BuildLink(_first, 'Répondre', 'blue', '@' + name_user + ' ');
          };
        };
      }, false);
    } else {
      document.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
        if (event.target.parentNode.id == 'messages') {
          var element = document.getElementsByClassName(event.target.className) [0];
          var _first = element.getElementsByTagName('div') [0];
          var _second = _first.getElementsByTagName('div') [0];
          var third = _second.getElementsByClassName('button-delete').length;
          if (third == 0) {
            var element2 = element.getElementsByTagName('a') [0];
            var user_url_split = element2.href.split('/');
            var name_user = user_url_split[5];
            BuildLink(_first, 'Répondre', 'blue', '@' + name_user + ' ');
          };
        };
      }, false);
    }
  }
  INIT(this);
  AnswerItems(this);
  setInterval(function () {
    ChecksHistoriqueOpened();
  }, 1000);
}) ();
