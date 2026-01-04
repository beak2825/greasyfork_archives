// ==UserScript==
// @name         kiwix-wiktionary-toggle-navcontent
// @version      0.0
// @description  Fixes toggling of all NavContent instances in kiwix wiktionary.
// @include      http://localhost:1024/*
// @namespace    https://greasyfork.org/users/217495-eric-toombs
// @downloadURL https://update.greasyfork.org/scripts/517632/kiwix-wiktionary-toggle-navcontent.user.js
// @updateURL https://update.greasyfork.org/scripts/517632/kiwix-wiktionary-toggle-navcontent.meta.js
// ==/UserScript==

for (nh of document.getElementsByClassName("NavHead")) {
  nh.onclick = (e) => {
    ncs = e.target.parentElement.getElementsByClassName("NavContent")[0].style;
    if (ncs.display == "block") {
      ncs.display = "none";
    }
    else {
      ncs.display = "block";
    }
  };
}