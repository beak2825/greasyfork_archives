// ==UserScript==
// @name     Fix for travian-reports.net/pl
// @version  1.2.2
// @include *://*.travian.*/berichte.php?id=*
// @description Add-on for travian.pl
// @locale en
// @author aracoin
// @namespace aracoin
// @license GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/370049/Fix%20for%20travian-reportsnetpl.user.js
// @updateURL https://update.greasyfork.org/scripts/370049/Fix%20for%20travian-reportsnetpl.meta.js
// ==/UserScript==

/*********************** common library ****************************/

String.prototype.onlyText = function(){return this.replace(/([\u2000-\u20ff])/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[\s\S]+?>/g,'');}
function a() {r1 = new RegExp(atob('KFxzKk5hcGFzdG5pa1xzKk5hcGFzdG5pa1xzKk5hcGFzdG5pay4qJFxuKQ=='),'gm');r2=new RegExp(atob('KFxzKk9icm8uY2FccypPYnJvLmNhXHMqT2Jyby5jYS4qJFxuKQ=='),'gm');r3=new RegExp(atob('KFxkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzKSskXHMqKFxkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzKyk='),'gm');r4=new RegExp(atob('KFxkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzKykkXHMqKFxkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzK1xkK1xzKyk='),'gm');r5=new RegExp(atob('KFw/XHMrXD9ccytcP1xzK1w/XHMrXD9ccytcP1xzK1w/XHMrXD9ccytcP1xzK1w/XHMrXD9ccyopJFxzKg=='),'gm');};
function $g(aID) {return (aID != '' ? document.getElementById(aID) : null);}
function $gn(aID) {return (aID != '' ? document.getElementsByName(aID) : null);}
function $gt(str,m) { return (typeof m == 'undefined' ? document:m).getElementsByTagName(str); }
function $gc(str,m) { return (typeof m == 'undefined' ? document:m).getElementsByClassName(str); }
function $at(aElem, att) {if (att !== undefined) {for (var xi = 0; xi < att.length; xi++) {aElem.setAttribute(att[xi][0], att[xi][1]); if (att[xi][0].toUpperCase() == 'TITLE') aElem.setAttribute('alt', att[xi][1]);};};}//Acr111-addAttributes
function $t(iHTML) {return document.createTextNode(iHTML);}
function $e(nElem, att) {var Elem = document.createElement(nElem); $at(Elem, att); return Elem;}
function $ee(nElem, oElem, att) {var Elem = $e(nElem, att); if (oElem !== undefined) if( typeof(oElem) == 'object' ) Elem.appendChild(oElem); else Elem.innerHTML = oElem; return Elem;}
function $c(iHTML, att) { return $ee('TD',iHTML,att); }
function $a(iHTML, att) { return $ee('A',iHTML,att); }
function $am(Elem, mElem) { if (mElem !== undefined) for(var i = 0; i < mElem.length; i++) { if( typeof(mElem[i]) == 'object' ) Elem.appendChild(mElem[i]); else Elem.appendChild($t(mElem[i])); } return Elem;}
function $em(nElem, mElem, att) {var Elem = $e(nElem, att); return $am(Elem, mElem);}
function toNumber(aValue) {return parseInt(aValue.replace(/\W/g, "").replace(/\s/g, ""));}
function isNumeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
function insertAfter(node, rN) {rN.parentNode.insertBefore(node, rN.nextSibling);}
function ajaxNDIV(aR) {var ad = $ee('div',aR.responseText,[['style','display:none;']]); return ad;}
function $ib(node, rN) {rN.parentNode.insertBefore(node, rN);}
function newOption (node,text,value) { node.appendChild($ee('OPTION',text,[['value',value]])); }

/*********************** code ****************************/

var r1,r2,r3,r4,r5;a();
var reportO = $g('reportWrapper');
var report = reportO.cloneNode(true);
var reportV = report.innerHTML.replace(/<button[\s\S]+?button>/g,'').replace(/\"\"/g,'').
replace(/<script[\s\S]+?script>/g,'').replace(/alt=\"(.+?)\"/g,">$1<a").replace(/\s{2,}/g,' ').
replace(/<\/th>|<\/td>/g,"\t").replace(/<\/div>|<\/tr>/g,"\n").onlyText().replace(/\n{2,}/g,'\n').
replace(/(Wysłane)/,'Wysłana').replace(/(atakuje osadę)/,'zaatakował/a').replace(/(zdobycz)/,'Zdobycz').replace(/(szpieguje osadę)/,'zaobserwował/a').
replace(r1,'\nNapastnik').replace(r2,'\nObrońca').replace(r3, atob('SmVkbm9zdGtpJDEKU3RyYXR5JDI=')).replace(r4, atob('SmVkbm9zdGtpJDEKU3RyYXR5JDI=')).
replace(/(Obro.ca\s+Obro.ca)/gm, '\nObrońca').replace(r5, atob('SmVkbm9zdGtpJDE='));
var form = $e('FORM',[['method','post'],['action','http://travian-reports.net/convert'],['target','_blank']]);
form.appendChild($e('input',[['type','hidden'],['name','design'],['value',1]]));
form.appendChild($ee('textarea', reportV, [['name','report'],['cols',80],['rows',3],['type', 'hidden'],['style', 'margin-bottom: 10px; width: 100%']]));
var rf = $e('DIV', [['style', 'float: right;']]);
rf.appendChild($em('DIV',[$e('input',[['type','checkbox'],['name','anonymous']]),"Anonymous"],[['style', 'display: inline;']]));
rf.appendChild($em('DIV',[$e('input',[['type','checkbox'],['name','h_a']]),"Hide attaker"],[['style', 'display: inline;']]));
rf.appendChild($em('DIV',[$e('input',[['type','checkbox'],['name','h_d']]),"Hide defender"],[['style', 'display: inline;']]));
form.appendChild(rf);

var content = $g('content');
var b = $e('button',[['type','submit'],['name','step1'],['class', 'green '],['value', 'Convert']]);
var h1 = $e('DIV', [['class', 'button-container addHoverClick']]);
var h2 = $e('DIV', [['class', 'button-background']]);
var h3 = $e('DIV', [['class', 'buttonStart']]);
var h4 = $e('DIV', [['class', 'buttonEnd']]);
var h5 = $e('DIV', [['class', 'buttonMiddle']]);
var h0 = $e('DIV', [['class', 'button-content']]);
h0.appendChild($t('Convert'));
h4.appendChild(h5);
h3.appendChild(h4);
h2.appendChild(h3);
h1.appendChild(h2);
h1.appendChild(h0);
b.appendChild(h1);
var vam = $e('DIV', [['style', 'vertical-align: middle;']]);
vam.appendChild(b);
form.appendChild(vam);
content.appendChild(form);