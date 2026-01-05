// ==UserScript==
// @name        Proxmox 4 Login form autocomplete
// @namespace   Davbfr
// @include     https://*:8006/*
// @version     1
// @grant       none
// @author      David PHAM-VAN
// @description Enable autocomplete login and password in Proxmox VE 4.x
// @downloadURL https://update.greasyfork.org/scripts/23979/Proxmox%204%20Login%20form%20autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/23979/Proxmox%204%20Login%20form%20autocomplete.meta.js
// ==/UserScript==

var t = setInterval(function(){ 
  var a = document.getElementById('form-1055');
  var s = document.getElementById('button-1061-btnEl');

  if (a && s) {
    clearInterval(t);
    var f = document.createElement('form');
    a.parentNode.appendChild(f)
    f.appendChild(a);
    var b = document.createElement('button');
    b.setAttribute('type', 'submit');
    b.setAttribute('style', 'background:transparent;border:none;');
    s.parentNode.appendChild(b)
    b.appendChild(s);
    f.addEventListener('submit', function (event) {
      //event.preventDefault();
    }, false);
  }
}, 500);
