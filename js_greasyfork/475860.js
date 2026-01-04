// ==UserScript==
// @namespace       https://greasyfork.org/fr/users/868328-invincible812
// @name            MultiUp Tools
// @name:fr         MultiUp Tools
// @match           https://**multiup.io/**
// @match           https://**multiup.org/**
// @match           https://**multiup.**/**
// @grant           none
// @version         1.1
// @author          Invincible812
// @description     Tools for MultiUp
// @description:fr  Utilitaires pour MultiUp
// @supportURL      -
// @grant           GM.xmlHttpRequest
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/475860/MultiUp%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/475860/MultiUp%20Tools.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.alert = function(message) {};

  if (document.location.href.includes('/upload/from-torrent')) {

    document.getElementById('radio-no-archive').click();

    function uncheckFilesWithExtension() {
      for (var i = 1; i < document.getElementById("list-files").getElementsByTagName("tr").length-1; i++) {
        var fileNameInput = document.getElementById("list-files").getElementsByTagName("tr")[i].querySelector('td:nth-child(2) input');
        var fileNameValue = fileNameInput.getAttribute('value');

        if (fileNameValue.endsWith(".nfo") || fileNameValue.endsWith(".NFO")) {
          var checkbox = document.getElementById("list-files").getElementsByTagName("tr")[i].querySelector('td:first-child input');
          checkbox.click();
        }
      }
    }

    function onTorrentLoaded() {
      setTimeout(function () {
        uncheckFilesWithExtension();
      }, 2000);
      window.alert = function(message) {};
    }

    var torrentInput = document.getElementById("file");
    torrentInput.addEventListener("change", function () {
      onTorrentLoaded();
      window.alert = function(message) {};
    });

    function convertSize(size) {
      var sizeInGo = size / (1024 * 1024 * 1024);
      return sizeInGo.toFixed(2) + " Go";
    }

    function unblockTorrentsGreaterThan10Go() {
      var button = $("button[type=submit]");
      var totalSize = parseInt($("#total-selected-files-size").text());
      window.alert = function(message) {};
      button.removeAttr("disabled");
    }

    var observer = new MutationObserver(unblockTorrentsGreaterThan10Go);
    var targetNode = document.body;
    var config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
  }

  if (document.location.href.includes('/download/')) {
    document.getElementsByTagName('form')[0].removeAttribute('target');
    document.getElementsByTagName('form')[0].removeAttribute('onsubmit');

    function statut() {
      if (document.getElementsByClassName('amount')[3].textContent == "upload pas terminé") {
        document.getElementsByClassName('panel-body')[3].style.backgroundColor = "red";
      } else {
        document.getElementsByClassName('panel-body')[3].style.backgroundColor = "green";
      }
    }
    setTimeout(statut, 500)
  }

  if (document.location.href.includes('/project/')) {

    var hrefValues = [];
    for (let a = 0; a < document.getElementsByClassName('panel-body')[3].children.length; a++) {
      hrefValues.push(document.getElementsByClassName('panel-body')[3].children[a].children[0].href);
    }
    for (let a = 0; a < hrefValues.length; a++) {
      GM.xmlHttpRequest({
        method: "GET",
        url: hrefValues[a],
        onload: function (response) {
          let parser = new DOMParser();
          let temp = parser.parseFromString(response.responseText, "text/html");
          if (temp.querySelector('body > section > div > section > div:nth-child(4) > div:nth-child(4) > section > div > div > div:nth-child(2) > div > div > strong').textContent == "upload pas terminé") {
            document.getElementsByClassName('panel-body')[3].children[a].children[0].style.backgroundColor = "red";
          } else {
            document.getElementsByClassName('panel-body')[3].children[a].children[0].style.backgroundColor = "green";
          }
        }
      });
    }
  }
})();