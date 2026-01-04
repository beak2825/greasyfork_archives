// ==UserScript==
// @name         Доп
// @version      0.1
// @description  ...
// @author       
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @grant        none
// @namespace Мария Мещерякова
// @downloadURL https://update.greasyfork.org/scripts/440708/%D0%94%D0%BE%D0%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/440708/%D0%94%D0%BE%D0%BF.meta.js
// ==/UserScript==

function ite(){
let select= document.querySelector('tr.selected')
if (select==null){document.getElementById("dkvu-data-form-ok").style.background='red'
}
else{document.getElementById("dkvu-data-form-ok").style='/*background="red"*/'}}
setInterval( ite, 500 )
setInterval( update, 4 * 1000 )