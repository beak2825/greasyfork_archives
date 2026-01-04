// ==UserScript==
// @name     AnonTPP Redirect
// @version  1.0
// @grant    none
// @include  https://goplay.anontpp.com/
// @description Redirects Denied AnonTPP Index
// @namespace https://greasyfork.org/users/12583
// @downloadURL https://update.greasyfork.org/scripts/37952/AnonTPP%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/37952/AnonTPP%20Redirect.meta.js
// ==/UserScript==

//alert('hello');


text = document.documentElement.innerHTML;

check_text = text.toString().match(/Access is denied/);
if(check_text){
  link = "http://hezron93.pythonanywhere.com/kdrama";

  xml = new XMLHttpRequest();
  xml.open('get',link,false);
  xml.send();
  queryData = xml.responseText;

  new_location = queryData.toString().match(/http[A-Za-z:=\/\.\?0-9]*/);
  window.location = new_location;
}







