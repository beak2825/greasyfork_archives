// ==UserScript==
// @name        Manuscript/Fogbugz
// @description XXX
// @include     https://paylogic.*.com/*
// @version     2019.05.07
// @grant       unsafeWindow
// @namespace   greasy
// @downloadURL https://update.greasyfork.org/scripts/35009/ManuscriptFogbugz.user.js
// @updateURL https://update.greasyfork.org/scripts/35009/ManuscriptFogbugz.meta.js
// ==/UserScript==



if (location.hostname == 'paylogic.manuscript.com') {
  location.href = location.href.replace('paylogic.manuscript.com', 'paylogic.fogbugz.com')
}


unsafeWindow.$('html').on('focus', '#2_Featurebranch', exportFunction(function() {
  if (!this.value) {
		this.value = "blaise/paylogic#c" + document.querySelector("#case-link a.case").textContent.trim();
  }
}, unsafeWindow));


unsafeWindow.$('html').on('focus', '#3_Originalbranch', exportFunction(function() {
  if (!this.value) {
		this.value = "r" + (new Date()).getFullYear().toString().substring(2);
  }
}, unsafeWindow));
