// ==UserScript==
// @name           Binnewz auto Login
// @namespace      www.binnews.in
// @description    Auto login ( pour les référenceurs uniquement)
// @include        http://*binnews.in/_admin/login.php*
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/5047/Binnewz%20auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/5047/Binnewz%20auto%20Login.meta.js
// ==/UserScript==
var usrnm="Votre Login ici";
var psswrd="Votre password ici";
document.getElementsByName("try_user")[0].value=usrnm;
var pswrd=document.getElementsByName("try_pass")[0];
pswrd.maxLength="50";
pswrd.value=psswrd;
document.getElementsByTagName("input")[2].click();