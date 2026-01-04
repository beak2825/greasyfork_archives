// ==UserScript==
// @name        SDSBG
// @namespace   SDSBG Scripts
// @match       http://hd/WorkOrder.do
// @grant       none
// @version     1.0
// @author      -
// @description 08.11.2019, 13:39:40
// @downloadURL https://update.greasyfork.org/scripts/392256/SDSBG.user.js
// @updateURL https://update.greasyfork.org/scripts/392256/SDSBG.meta.js
// ==/UserScript==

if (document.getElementById('operation_status_message').innerHTML == 'ЗАВЕРШЕНО:Заявки успешно отобраны') {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://192.168.2.153/sdpusher/work/sdsendy/?i='+document.getElementById('requestId').innerHTML+'&t='+document.getElementById('requestSubject_ID').innerHTML+'&user='+document.getElementsByClassName('prp-pdetails')[0].getElementsByTagName('div')[0].getElementsByTagName('b')[0].innerText, true);
  xhr.send();
}