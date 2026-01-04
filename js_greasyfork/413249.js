// ==UserScript==
// @name          ebay.de - besuchte Links farbig markieren
// @description   Markiert "besuchte" Links mit einem roten, und "nicht besuchte" Links mit einem blauen Balken. -Screenshot anbei.
// @run-at        document-idle
// @include       *.ebay.de*
// @version       1.4
// @namespace     https://greasyfork.org/users/414179
// @downloadURL https://update.greasyfork.org/scripts/413249/ebayde%20-%20besuchte%20Links%20farbig%20markieren.user.js
// @updateURL https://update.greasyfork.org/scripts/413249/ebayde%20-%20besuchte%20Links%20farbig%20markieren.meta.js
// ==/UserScript==
var i=0;
if(document.title){
GM_addStyle( 'a:visited{color:red;}' );
document.querySelectorAll('a.s-item__link').forEach(
function(el) {
var hr = document.createElement('a');
hr.href = el.href;
var fa=el.nextSibling.className.toString();
if(fa=='s-item__subtitle'){
++i;var i5=i>9?i:'0'+i;
hr.innerText = '\xa0█████.'+i5}
else
{hr.innerText = '\xa0█████'}
el.nextSibling.appendChild(hr);
}
)}

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g,' !important;');
    head.appendChild(style);
}