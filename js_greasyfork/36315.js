// ==UserScript==
// @name        et
// @description Change radio button
// @namespace   none
// @include     http://213.168.39.150:8888/men/get_data.aspx?tabelnum=4970
// @version     v1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36315/et.user.js
// @updateURL https://update.greasyfork.org/scripts/36315/et.meta.js
// ==/UserScript==

window.onload=function(){
  document.querySelectorAll("[name='findtype']")[1].checked=true;
}