// ==UserScript==
// @name Volafile Unremover
// @author Arnold François Lecherche and a Vola anon named Adonis
// @namespace greasyfork.org
// @icon https://volafile.org/favicon.ico
// @version 1.09
// @description Preserves messages and files auto-removed by Volafile and prevents navigation to front page on room closure.
// @include http://volafile.org/*
// @include http://*.volafile.org/*
// @include https://volafile.org/*
// @include https://*.volafile.org/*
// @grant none
// @run-at document-end
// @copyright 2020 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/403451/Volafile%20Unremover.user.js
// @updateURL https://update.greasyfork.org/scripts/403451/Volafile%20Unremover.meta.js
// ==/UserScript==
(function (w, d) {
  'use strict';
  var e, v, c, g;
  function removeMessages(t) {
    var obj = ['messages', 'queued_messages'], i = obj.length, msg, j;
    while (i--) {
      msg = c[obj[i]];
      j = msg.length;
      while (j--) if (t.msgIds.indexOf(msg[j].data.id) !== -1) {
        msg[j].elem.style.opacity = '.4';
        msg[j].elem.style.textDecoration = 'line-through';
      }
    }
  }
  function delete_file(t) {
    var file = e.filelist.files_by_id[t];
    file.dom.fileElement.style.opacity = '.2';
    file.dom.fileElement.getElementsByTagName('a')[0].style.textDecoration = 'line-through';
    c.showMessage('YourMom', 'File deleted: ' + file.name + ' [' + JSON.stringify(file.tags) + ']', {'dontsave': true, 'staff': true});
  }
  function navigate(e) {
    c.showMessage('Script', 'Intercepted auto-navigation to "' + e + '".', {'dontsave': false, 'staff': true});
  }
  function reload(e) {
    c.showMessage('Script', 'Intercepted force-reload.', {'dontsave': true, 'staff': true});
  }
  function config(t) {
    var keys = Object.keys(t), old = (keys.length === 1 && w.config[keys[0]]) ? ' from {"' + keys[0] + '":' + JSON.stringify(w.config[keys[0]]) + '} ' : '';
    if (keys.length < 20) c.showMessage('Config', 'changed ' + old + 'to ' + JSON.stringify(t), {'dontsave': true, 'staff': true});
    g(t);
  }
  function init() {
    var n;
    e = w.RoomInstance.extensions;
    n = e.connection;
    n.navigate = navigate;
    v = n._events;
    v.removeMessages = removeMessages;
    v.delete_file = delete_file;
    v.forceReload[0] = reload;
    g = v.config;
    v.config = config;
    c = e.chat;
    c.showMessage('Script', 'Volafile spy mode', {'dontsave': true, 'staff': true});
  }
  w.addEventListener('load', init, false);
})(window, document);