// ==UserScript==
// @name         PTH Collages on searchbar
// @version      0.4
// @description  Add a search box for collages to the search bar
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25744/PTH%20Collages%20on%20searchbar.user.js
// @updateURL https://update.greasyfork.org/scripts/25744/PTH%20Collages%20on%20searchbar.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.localStorage.hideLog != "false")
    document.getElementById('searchbar_log').style.display='none';

  var li=document.createElement('li');
  li.setAttribute('id', 'searchbar_collages');
  var before=document.getElementById('searchbar_requests');
  before.parentNode.insertBefore(li, before);
  var form=document.createElement('form');
  li.appendChild(form);
  form.setAttribute('class', 'search_form');
  form.setAttribute('name', 'collages');
  form.setAttribute('action', 'collages.php');
  form.setAttribute('method', 'get');
  var input=document.createElement('input');
  form.appendChild(input);
  input.placeholder="Collages";
  input.value="Collages";
  input.setAttribute('name', 'search');
  input.setAttribute('size', 17);
  input.setAttribute('onfocus', "if (this.value == 'Collages') { this.value = ''; }");
  input.setAttribute('onblur', "if (this.value == '') { this.value = 'Collages'; }");
  input.setAttribute('type', 'text');
})();
