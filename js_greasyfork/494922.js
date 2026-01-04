 // ==UserScript==
 // @name        ugyfelkapu es eeszt auto login
 // @namespace   Violentmonkey Scripts
 // @author      barn852
 // @include     https://kau.gov.hu/proxy/saml/authservice*
 // @include     https://idp.gov.hu/idp/saml/authnrequest*
 // @include     https://www.eeszt.gov.hu/oldalvalaszto.jsp
 // @include     https://www.eeszt.gov.hu/hu/nyito-oldal
 // @grant       none
 // @version     1.0
 // @author      -
 // @run-at      document-end
 // @description 5/13/2024, 6:11:54 PM
// @downloadURL https://update.greasyfork.org/scripts/494922/ugyfelkapu%20es%20eeszt%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/494922/ugyfelkapu%20es%20eeszt%20auto%20login.meta.js
 // ==/UserScript==


 if (window.location.href.indexOf("https://idp.gov.hu/idp/saml/authnrequest") > -1) {
   // we click login after the password manager has filled the username & password fields
     clickLoginWhenPopulated();
 } else if (window.location.href.indexOf("kau.gov.hu/proxy/saml/authservice") > -1) {
     document.querySelector('input[value="Ügyfélkapu"]').click()
   // EESZT kezdőlap
 } else if (window.location.href.indexOf("eeszt.gov.hu/oldalvalaszto.jsp") > -1) {
     document.querySelector('a[href="/nyito-oldal"]').click()
   // EESZT nyitóóldal
 } else if (window.location.href.indexOf("eeszt.gov.hu/hu/nyito-oldal") > -1) {
     document.querySelector('.nav-account-controls a[title="Bejelentkezés"] .nav-item-label').click()
 }

 function clickLoginWhenPopulated() {
     if (document.querySelector('#fldUser').value == "" || document.querySelector('#fldPass').value == "") {
         // fields not populated yet, so we have to wait
         setTimeout(clickLoginWhenPopulated, 100);
     } else {
         document.querySelector('button[name="submit"]').click();
     }
 }