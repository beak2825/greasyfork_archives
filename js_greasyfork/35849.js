// ==UserScript==
// @name         aniti-acgn-fastvote
// @version      1.4.1
// @description  easy to vote
// @author       Juisen
// @match        https://acgn-stock.com/*
// @grant        none
// @namespace https://greasyfork.org/users/161366
// @downloadURL https://update.greasyfork.org/scripts/35849/aniti-acgn-fastvote.user.js
// @updateURL https://update.greasyfork.org/scripts/35849/aniti-acgn-fastvote.meta.js
// ==/UserScript==

function addPluginMenu() {
  const pluginMenu = $(`
    <li class="nav-item">
      <a class="nav-link btn btn-primary" href="#" id="block-vote">投票</a>
    </li>
    <li> <p>&nbsp</p></li>
    <li class="nav-item">
      <a class="nav-link btn btn-primary" href="#" id="text-Return">複製</a>
    </li>
    `).insertAfter($(".nav-item").last());
  pluginMenu.find("#block-vote").on("click", blockVote);
  pluginMenu.find("#text-Return").on("click", textReturn);
}

function openfolder() {
  var loadtext = $(".d-block.h4:eq(6)").text();
  if (loadtext == "") {
      setTimeout(function () {
          openfolder();
      }, 1000);
  } else {
      $(".d-block.h4:eq(3)").click();
      $(".d-block.h4:eq(6)").click();
      clearInterval();
  }
}

function blockVote() {
  $("button.btn.btn-primary.btn-sm:eq(0)").click();
}

function textReturn() {
  var subbutton = document.getElementById('text-Return');
  var text = document.getElementsByClassName("logData")[0].innerText;
  var suname = text.split(' ')[3];
  var copyThis = text;
  new Clipboard('.btn', {
      text: function (trigger) {
          return copyThis;
      }
  });
  subbutton.innerText = "已複製";
  setTimeout(function () {
      subbutton.innerText = "複製";
  }, 5000);
}

(function () {
  addPluginMenu();
  var script = document.createElement("SCRIPT");
  onload = openfolder();
  script.src = 'https://cdn.jsdelivr.net/npm/clipboard@1/dist/clipboard.min.js';
  script.type = 'text/javascript';
  script.onload = function () {
      var $ = window.jQuery;
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();