// ==UserScript==
// @name Bexio goto Arbeitszeiten for Home
// @namespace Script Runner Pro
// @include https://office.bexio.com/index.php/user/dashboard/*
// @match https://office.bexio.com/index.php/user/dashboard
// @description Fügt eine goto-Button in Bexio-Home hinzu
// @version 1.02
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502661/Bexio%20goto%20Arbeitszeiten%20for%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/502661/Bexio%20goto%20Arbeitszeiten%20for%20Home.meta.js
// ==/UserScript==

  
const block = $("#btn_edit").parent();
const filterButton = document.createElement("a");
var btnText = "Zeiten";


$(filterButton).addClass("btn btn-light js-first-btn");
$(filterButton).text(btnText);

$(filterButton).click(function() {
  window.location.replace("https://office.bexio.com/index.php/monitoring/list");
});

block.prepend("&nbsp;");
block.prepend(filterButton);
