// ==UserScript==
// @name         RED -- Tag Search Bar
// @version      0.1
// @description  Add a search box for tags to the search bar.
// @author       Cosmic
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/164730
// @downloadURL https://update.greasyfork.org/scripts/36786/RED%20--%20Tag%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/36786/RED%20--%20Tag%20Search%20Bar.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.localStorage.hideLog != "false")
    document.getElementById('searchbar_users').style.display='none';

  var li=document.createElement('li');
  li.setAttribute('id', 'searchbar_tags');
  var before=document.getElementById('searchbar_requests');
  before.parentNode.insertBefore(li, before);
  var form=document.createElement('form');
  li.appendChild(form);
  form.setAttribute('class', 'search_form');
  form.setAttribute('name', 'tags');
  form.setAttribute('action', 'torrents.php');
  form.setAttribute('method', 'get');
  var input=document.createElement('input');
  form.appendChild(input);
  input.placeholder="Tags";
  input.value="Tags";
  input.setAttribute('name', 'taglist');
  input.setAttribute('size', 17);
  input.setAttribute('onfocus', "if (this.value == 'Tags') { this.value = ''; }");
  input.setAttribute('onblur', "if (this.value == '') { this.value = 'Tags'; }");
  input.setAttribute('type', 'text');
})();