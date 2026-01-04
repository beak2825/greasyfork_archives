// ==UserScript==
// @name         极简 solidot 奇客
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  极简版，适合上班看
// @author       You
// @match        https://*.solidot.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/384525/%E6%9E%81%E7%AE%80%20solidot%20%E5%A5%87%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/384525/%E6%9E%81%E7%AE%80%20solidot%20%E5%A5%87%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle(`
#main {
  max-width: 820px;
  min-width: unset;
  background: rgba(246, 245, 243, 0.14);
}

.bg_col {
  background-color: #fff;
}
.nav-secondary-wrap,
.ct_tittle .bg_htit {
background-image:none;
 background-color: rgb(243, 243, 243);
}

.ct_tittle  h2 a,
.ct_tittle  h2 {
  color: #000;
}

.nav-wrap a, .nav-secondary a {
  color: #0d0d0d;
}

#center {
  margin: 0px 0px 0px 0;
}

#footer,
#right,
.notice,
.a_bold,
img,
.mid_bgtittle,
.e_reply
.notice,
.logo_sosobox,
.combined_log,
#center  b,
.talk_more,
.talk_time
 {
  display: none !important;
}

     `)
    // Your code here...
})();