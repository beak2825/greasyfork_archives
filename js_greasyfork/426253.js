// ==UserScript==
// @name Volafile Upload-Helper
// @author Arnold François Lecherche and a Vola anon named Adonis
// @namespace greasyfork.org
// @icon https://volafile.org/favicon.ico
// @version 1.01
// @description Helps Volafile users avoid certain problematic servers when uploading files, shows what server each file was uploaded to on hover, and allows raising the parallel-upload limit, up to 10.
// @include http://volafile.org/*
// @include http://*.volafile.org/*
// @include https://volafile.org/*
// @include https://*.volafile.org/*
// @grant none
// @run-at document-end
// @copyright 2021 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/426253/Volafile%20Upload-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/426253/Volafile%20Upload-Helper.meta.js
// ==/UserScript==
(function (w, d, M) {
  'use strict';
  var a = false, dlcss = d.createElement('style'),
   nbRegEx = /^(?:[a-zA-Z0-9-]{3,},)*[a-zA-Z0-9-]{3,}|none$|^$/,
   commasRegExp = /,+$/, commaRegExp = /,/g, extRegExp = /\..+/,
   c, ulmenu, ub, r, ex, up, ftt, k;
  function getStatusText(t) {
    var server, name, blocklist, dl, dlclass;
    if (this.upload.currentAttempt && this.upload.currentAttempt.info && this.upload.file.size > 1e3) {
      server = this.upload.currentAttempt.info.server;
      name = this.file.dom.nameElement;
      blocklist = new RegExp((c.ulblock || 'none').replace(commasRegExp, '').replace(commaRegExp, '\\\.|') + '\\\.');
      if (blocklist.test(server.replace(extRegExp, '.'))) {
        this.upload.tries -= 0.9;
        name.className = 'file_name';
        this.upload.currentAttempt.abort();
      } else {
        dl = this.upload.currentAttempt.info.server.replace(extRegExp, '');
        dlclass = 'dl_' + dl;
        if (!name.classList.contains('dlnum')) {
          name.classList.add('dlnum', dlclass);
          if (dlcss.textContent.indexOf(dlclass) === -1) dlcss.textContent += '\n.' + dlclass + ':after{content:" \u2022 ' + dl + '\xA0"}';
        }
      }
    }
    return this.getStatusText_2(t);
  }
  function remove() {
    if ('undefined' === typeof e) return;
    e.removeTimeout = null;
    e.forceRemove();
  }
  function setRemoveTimeout(t) {
    if (this.error) {
      this.file.dom.nameElement.innerHTML += ' &bull; [<b>UPLOAD FAILED</b>]';
      return;
    }
    if (this.removeTimeout) w.clearTimeout(this.removeTimeout);
    this.removeTimeout = w.setTimeout(remove, t);
  }
  function isUploading() {
    var uppy = [up.uploadQueue.uploadQueue, up.runningUploads], i = uppy.length, j;
    while (i--) {
      j = uppy[i].length;
      while (j--) {
        uppy[i][j].getStatusText_2 = uppy[i][j].getStatusText_2 || uppy[i][j].getStatusText;
        uppy[i][j].getStatusText = getStatusText;
        uppy[i][j].setRemoveTimeout = setRemoveTimeout;
      }
    }
    return this.runningUploads.length > 0 || this.uploadQueue.length() > 0;
  }
  function addFileInfo(t, e) {
    var dl, dlclass, a, name;
    if (e && e.id && e.thumb) {
      dl = e.thumb.server.replace(extRegExp, '');
      dlclass = 'dl_' + dl;
      a = t.layout.elem;
      name = a.querySelector('.file_name');
      if (name && !name.classList.contains('dlnum')) {
        name.classList.add('dlnum', dlclass);
        if (dlcss.textContent.indexOf(dlclass) === -1) dlcss.textContent += '\n.' + dlclass + ':after{content:" \u2022 ' + dl + '\xA0"}';
        //ex.filelist.files_by_id[e.id].name += '@' + dl + '$';
        //a.href = a.href.replace('//volafile.org', '//'+e.thumb.server);
      }
    }
    this.addFileInfo_2(t, e);
  }
  function set_mcu() {
    var mcu = M.floor(prompt('config.max_concurrent_uploads', c.max_concurrent_uploads));
    if (mcu != mcu || mcu < 1 || mcu > 10) return;
    this.innerText = '⮅ ' + (c.max_concurrent_uploads = mcu);
  }
  function set_block() {
    var block = prompt('Enter a comma-separated list of server prefixes to block, e.g. "dl8" or "dl7,dl8" (without quotes).', c.ulblock);
    if (block === null || block === false || !nbRegEx.test(block)) return;
    this.innerText = '⦸ ' + (c.ulblock = block);
  }
  function init() {
    if (a) return k && w.clearInterval(k);
    else k = k || w.setInterval(init, 1e3);
    c = w.config;
    if (!c) return;
    ulmenu = d.getElementById('ulmenu') || d.createElement('div');
    r = w.RoomInstance;
    if (!r) return;
    ex = r.extensions;
    up = ex.upload;
    up.isUploading = isUploading;
    ftt = ex.fileTooltips;
    ftt.addFileInfo_2 = ftt.addFileInfo_2 || ftt.addFileInfo;
    ftt.addFileInfo = addFileInfo;
    ulmenu.id = 'ulmenu';
    ulmenu.setAttribute('style', 'display:inline-block;font-size:0.9em');
    ulmenu.innerHTML = '<a class="button" id="ul_mcu" title="set max concurrent uploads">⮅</a> ' + 
                       '<a class="button" id="ul_block" title="set upload blacklist">⦸</a> &nbsp;';
    ub = d.getElementById('upload_container');
    ub.insertBefore(ulmenu, ub.firstChild);
    d.getElementById('ul_mcu').addEventListener('click', set_mcu, false);
    d.getElementById('ul_block').addEventListener('click', set_block, false);
    a = true;
    if (k) w.clearInterval(k);
  }
  dlcss.textContent = '.dlnum:after {font-style:italic;opacity:0.5}';
  d.documentElement.appendChild(dlcss);
  init();
  d.addEventListener('DOMContentLoaded', init, false);
  w.addEventListener('load', init, false);
})(window, document, Math);