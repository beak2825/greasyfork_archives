// ==UserScript==
// @name        Chatzy shorthands
// @namespace   Raku
// @description Makes the formatting shorthanded
// @include     http://*chatzy.*/*
// @version     1.0.2
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/13622/Chatzy%20shorthands.user.js
// @updateURL https://update.greasyfork.org/scripts/13622/Chatzy%20shorthands.meta.js
// ==/UserScript==    
$('#X91').on('keydown', function (e) {
  if (e.keyCode == 13) {
    this.value = this.value.replace(/\*([^*]+?)\*/g, '[b]$1[/b]');
    this.value = this.value.replace(/\_([^*]+?)\_/g, '[u]$1[/u]');
    this.value = this.value.replace(/\^([^*]+?)\^/g, '[i]$1[/i]');
  }
});
// Thanks dust ;3c
// Thanks dust ;3c