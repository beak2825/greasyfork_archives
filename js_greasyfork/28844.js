// ==UserScript==
// @name        UVA Tab Problem Title
// @namespace   https://greasyfork.org/users/8233
// @description Put problem name in as title when viewing a problem on UVA
// @include      https://uva.onlinejudge.org/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28844/UVA%20Tab%20Problem%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/28844/UVA%20Tab%20Problem%20Title.meta.js
// ==/UserScript==
var probname = document.getElementById('col3_content_wrapper').getElementsByTagName('h3') [0].innerText;
if (probname !== undefined) {
  document.title = probname;
}
