// ==UserScript==
// @name Volafile Mark Read
// @author Arnold François Lecherche and a Vola anon named Adonis
// @namespace greasyfork.org
// @icon https://volafile.org/favicon.ico
// @version 1.07
// @description Adds a line to Volafile chat showing the line last read, along with a menu to show a list of file URLs for use with downloaders.
// @include http://volafile.org/*
// @include http://*.volafile.org/*
// @include https://volafile.org/*
// @include https://*.volafile.org/*
// @grant none
// @run-at document-end
// @copyright 2020 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/403450/Volafile%20Mark%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/403450/Volafile%20Mark%20Read.meta.js
// ==/UserScript==
(function (w, d, b) {
  'use strict';
  var pr = [w.prog0 || d.createElement('div'), w.prog1 || d.createElement('div')],
    menu = w.menu || d.createElement('div'),
    f = d.querySelector('#files_header_row'),
    u = d.getElementById('dolos_cuckmenu'),
    n = ['chat_message', 'filelist_file'],
    p = /^(?:MOTD|News|System|Script)/i,
    i = pr.length, g, m, c, s, k;
  function init() {
    g = w.config;
    g.bump = w.setInterval(refreshConfig, 60000);
    if (g.chat_max_history < 1000) g.chat_max_history = 1000;
    while (i--) {
      s = pr[i].style;
      pr[i].className = n[i];
      pr[i].id = 'prog' + i;
      s.borderTop = '3px dashed #f88';
      s.height = '2px';
      s.overflow = 'hidden';
      s.color = 'rgba(67,94,120,0)';
      pr[i].innerText = 'qwerty';
      b.appendChild(pr[i]);
    }
    w.chat_scroller.style.borderTop = '3px dotted #597895';
    g.title_append = g.title_append.replace(' - Volafile.org Live Filesharing & Chat', '');
    m = w.chat_messages;
    c = w.RoomInstance.extensions.chat;
    menu.id = 'menu';
    menu.style.display = 'inline-block';
    menu.innerHTML = '<a href="#" style="border-right:1px solid #597895;padding:0 1em;font-size:10px">File list</a>';
    f.insertBefore(menu, f.firstChild);
    menu.firstChild.addEventListener('click', flist, false);
    w.addEventListener('keydown', reloadMarker, false);
    c.showMessage('Script', 'Vola marker line loaded. Hit [esc] to activate.', {dontsave: true, staff: true});
  }
  function killnews(m) {
    var msg = c[m], i = msg.length;
    while (i--) if (msg[i].options.staff && p.test(msg[i].nick)) {
      if (msg[i].elem.parentNode) msg[i].elem.parentNode.removeChild(msg[i].elem);
      msg.splice(i, 1);
    }
  }
  function reloadMarker(e) {
    var key = e.key || e.charCode || e.keyCode, k;
    if (!key) return;
    if (key === 'Escape' || key === 'Esc' || key === 27) {
      if (g.chat_max_history < 1000) g.chat_max_history = 1000;
      m.appendChild(w.prog0);
      w.file_list.insertBefore(w.prog1, w.file_list.querySelector('#file_list .filelist_file:not(.file_uploading):not(.file_queued)'));
      killnews('messages');
      d.querySelector('.icon-arrow-down').style.display = 'none';
      k = d.querySelector('#kill_flist');
      if (k) k.click();
    }
  }
  function refreshConfig() {
    var pin = d.querySelector('.ui_frame_table [name="password"]'), b, i;
    if (g.chat_max_history < 1000) g.chat_max_history = 1000;
    g.title_append = g.title_append.replace(' - Volafile.org Live Filesharing & Chat', '');
    if (pin) {
      b = d.querySelectorAll('.ui_frame_buttons .button:not(.light)');
      i = b.length;
      while (i--) b[i].click();
    }
    killnews('queued_messages');
  }
  function flist(e) {
    var f = d.querySelectorAll('#file_list .filelist_file:not([id]):not([style]):not(.file_queued):not(.file_uploading)'),
      v = b.appendChild(d.createElement('div')),
      i = f.length, t = '', inf;
    while (i--) {
      if (f[i].id === 'prog1') {
        if (i !== 0) t += '#----------------------------------------------------------------------------------------------------\n';
        continue;
      }
      inf = '#____' + f[i].querySelector('a .file_tag').innerText + '_' +
        f[i].querySelector('.file_right_part').childNodes[0].data.replace(' ', '');
      t += f[i].querySelector('a[href]').href + inf + '\n';
    }
    v.innerHTML += '<div id="flist_list" style="position:absolute;top:0;left:0;background:#88f">' +
      '<a id="kill_flist" href="#" onclick="this.parentNode.parentNode.removeChild(this.parentNode)">[⮽ CLOSE]</a> &bull; ' +
      '<a href="#" onclick="window.text.value=window.text.value.replace(/\\n$/,[]).split(\'\\n\').reverse().join(\'\\n\')+\'\\n\'">[⇵ reverse]</a>' +
      '<textarea id="text" spellcheck="false" style="width:80em;height:30em;margin:1em;resize:both;display:block">' +
      t + '</textarea></div>';
    e.preventDefault();
    return false;
  }
  function unCuck() {
    u = d.getElementById('dolos_cuckmenu');
    if (u) {
      u.style.fontSize = '75%';
      if (k) w.clearInterval(k);
    }
  }
  w.addEventListener('load', init, false);
  d.addEventListener('DOMContentLoaded', unCuck, false);
  w.addEventListener('load', unCuck, false);
  if (u) u.style.fontSize = '75%';
  else k = w.setInterval(unCuck, 100);
})(window, document, document.body || body);