// ==UserScript==
// @name         RED File list search (replaces Log search)
// @version      0.1
// @description  Add a simple file list search box to the search bar; remove log search.
// @author       donkey
// @include      http*://redacted.ch/*
// @grant        none
// @namespace    https://greasyfork.org/users/162296
// @downloadURL https://update.greasyfork.org/scripts/371905/RED%20File%20list%20search%20%28replaces%20Log%20search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371905/RED%20File%20list%20search%20%28replaces%20Log%20search%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // This script is based on one by Chameleon.
  // Remove the following two lines to retain 'Log' searchbar.
  if(window.localStorage.hideLog != "false")
    document.getElementById('searchbar_log').style.display='none';

  var li=document.createElement('li');
  li.setAttribute('id', 'searchbar_filelist');
  var before=document.getElementById('searchbar_users');
  before.parentNode.insertBefore(li, before);
  var form=document.createElement('form');
  li.appendChild(form);
  form.setAttribute('class', 'search_form');
  form.setAttribute('name', 'torrents');
  form.setAttribute('action', 'torrents.php');
  form.setAttribute('method', 'get');
  var input=document.createElement('input');
  form.appendChild(input);
  input.placeholder="File Lists";
  input.value="File Lists";
  input.setAttribute('id', 'filelistssearch');
  input.setAttribute('accesskey', 'f');
  input.setAttribute('name', 'filelist');
  input.setAttribute('size', 17);
  input.setAttribute('onfocus', "if (this.value == 'File Lists') { this.value = ''; }");
  input.setAttribute('onblur', "if (this.value == '') { this.value = 'File Lists'; }");
  input.setAttribute('type', 'text');
})();