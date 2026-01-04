// ==UserScript==
// @name         Multiup direct link
// @version      1
// @description  Get links without ads
// @author       N005
// @match        *://multiup.org/*/mirror/*/*
// @grant        none
// @namespace    https://gist.github.com/n005/17ae7fa69703c8f7f6be235875529097
// @downloadURL https://update.greasyfork.org/scripts/429439/Multiup%20direct%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/429439/Multiup%20direct%20link.meta.js
// ==/UserScript==

(function(){
function getFormElelemets(){
  var list = [];
  var forms = document.forms
  for (k=0; k<forms.length; k++){
    var elements = document.forms[k].elements;
	var link = document.forms[k].elements[0].getAttribute("value");
	list.push(link);
	document.forms[k].setAttribute('action',link);
  }
  return list;
}
getFormElelemets()
})();