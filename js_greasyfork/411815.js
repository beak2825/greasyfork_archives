// ==UserScript==
// @name        re-enable autocomplete credit-cooperatif.coop
// @namespace   Violentmonkey Scripts
// @match       https://www.credit-cooperatif.coop/Institutionnel
// @match       https://www.credit-cooperatif.coop/Particuliers
// @match       https://www.credit-cooperatif.coop/se-connecter/mot-de-passe
// // @grant       none
// @version     1.0
// @author      Vivian Brégier
// @description 13/09/2020 à 11:24:47
// @downloadURL https://update.greasyfork.org/scripts/411815/re-enable%20autocomplete%20credit-cooperatifcoop.user.js
// @updateURL https://update.greasyfork.org/scripts/411815/re-enable%20autocomplete%20credit-cooperatifcoop.meta.js
// ==/UserScript==

console.log("toto");

var input_id = document.getElementById("idClient");
if (input_id)
{
  console.log("input_id=" + input_id);
  input_id.autocomplete = "username";
  var form = input_id.parentElement;
  console.log("form=" + form);
  form.autocomplete = "on";
}

var input_passwd = document.getElementById("inputPassword");
if (input_passwd)
{
  input_passwd.autocomplete = "current-password";
}