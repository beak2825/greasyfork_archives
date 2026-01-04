// ==UserScript==
// @name     Export Map
// @author      simplexe
// @version  0.1.2
// @grant    none
// @description:en export map
// @include     https://ru*.waysofhistory.com/*
// @namespace https://greasyfork.org/users/3499
// @description export map
// @downloadURL https://update.greasyfork.org/scripts/37290/Export%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/37290/Export%20Map.meta.js
// ==/UserScript==



function InjectExport() {
function OnExportMap () {
var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});
    textFile = window.URL.createObjectURL(data);

    return textFile;
  };



var logo = document.createElement("div"); 

logo.innerHTML = '<button id="create">Create file</button> <a download="info.txt" id="downloadlink" style="display: none">Download</a>';

document.getElementById('frame').contentDocument.body.insertBefore(logo, document.getElementById('frame').contentDocument.body.firstChild);
  var create = document.getElementById('create');

  create.addEventListener('click', function () {
    var link = document.getElementById('downloadlink');
    link.href = makeTextFile(sessionStorage);
    link.style.display = 'block';
  }, false);
}

}


window.addEventListener('load', InjectExport, false);