// ==UserScript==
// @name        Proxer-DefekteStreamsEntfernen
// @author      Dravorle
// @description Script fügt der Watch-Seite einen "Stream defekt!"-Button hinzu.
// @description Mit diesem kann eine defekte Episode direkt im Schaufenster entfernt werden
// @namespace   AnimeModScripts
// @include     https://proxer.me/watch/*
// @version     1.5 Läuft wieder mal, ausnahmsweise xD
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/10680/Proxer-DefekteStreamsEntfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/10680/Proxer-DefekteStreamsEntfernen.meta.js
// ==/UserScript==

start();

function start() {
  //nur einbauen, wenn mindestens ein Mirror vorhanden ist
  if ($('td.wMirror').children().length > 0)
  {
    $('td.wMirror').append('<br /><a href="javascript:;" id="LinkRemove" class="menu">Stream defekt!</a>');
    //Funktion an Link binden
    $('#LinkRemove').on('click', function () {
      remove();
    });
  }
}

function remove() {
    //Viel zu kompliziert, wenn s_id von Proxer wieder korrekt gesetzt wird, dann ist es eine Zeile, statt 100 xD
    var activeStreamSid = streams[s_id].id;
    del(activeStreamSid);
}

function del(sid) {
  $.get('/uploadstream?format=json&action=delete&mid=' + sid + '&' + $("#proxerToken").val() + '=1', function (data) {
    if (data.error != 0) {
      create_message(0, 2500, data.msg);
    } else {
      location.reload();
    }
  });
}
