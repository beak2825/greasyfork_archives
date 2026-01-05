// ==UserScript==
// @name         Avenoel Plus
// @version      0.2
// @description  Smileys exclusifs
// @author       Xehanort
// @include      http://avenoel.org/*
// @exclude      http://avenoel.org/blabla.php*
// @namespace https://greasyfork.org/users/14292
// @downloadURL https://update.greasyfork.org/scripts/11706/Avenoel%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/11706/Avenoel%20Plus.meta.js
// ==/UserScript==

var version = 0.2;
var smileys = [];

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function updateSmileys() {
  for (var i in smileys) {
    var re = new RegExp(escapeRegExp(smileys[i].code), "g");
    if (document.location.pathname == "/chat.php") {
      var messages = document.querySelectorAll('.amessage');
      for (var j = 0; j < messages.length; j++) {
        messages[j].innerHTML =  messages[j].innerHTML.replace(re, '<img src="'+smileys[i].link+'" />')
      }
    } else {
      document.body.innerHTML = document.body.innerHTML.replace(re, '<img src="'+smileys[i].link+'" />');
    }
  }
}

function ajax(url, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState==4 && xhr.status==200) {
      callback(xhr);
    }
  }

  xhr.open("GET", url, false);
  xhr.send(null);
}

function update(xhr) {
  if (version < xhr.responseText) alert("Avenoel Plus doit être mis à jour");
}

ajax("http://xehanort.alwaysdata.net/AvenoelPlus/version.php", update);
ajax("http://xehanort.alwaysdata.net/AvenoelPlus/smileys.php", function(xhr) {
  smileys = eval(xhr.responseText);
});

updateSmileys();

if (document.location.pathname == "/chat.php") {
  console.log(document.querySelector('.messages'))
  document.querySelector(".messages").onscroll = updateSmileys;
}
