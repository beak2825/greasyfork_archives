// ==UserScript==
// @name         APU_AMZ
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Acquire picture-urls of AMZ
// @author       You
// @match        https://www.amazon.com/*/dp/*
// @match        https://www.amazon.com/dp/*
// @match        https://www.amazon.co.uk/*/dp/*
// @match        https://www.amazon.co.uk/dp/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.es/*/dp/*
// @match        https://www.amazon.es/dp/*
// @match        https://www.amazon.de/*/dp/*
// @match        https://www.amazon.de/dp/*
// @match        https://www.amazon.fr/*/dp/*
// @match        https://www.amazon.fr/dp/*
// @match        https://www.amazon.ca/*/dp/*
// @match        https://www.amazon.ca/dp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36128/APU_AMZ.user.js
// @updateURL https://update.greasyfork.org/scripts/36128/APU_AMZ.meta.js
// ==/UserScript==

var script=document.createElement('script');
/*jshint multistr: true */
var txt="\
function create_table(){var text='<tr>';\
var pr=document.getElementsByClassName('a-list-item');\
var len=pr.length;\
for (var i=0;i<len;i++){\
	try{text+='<td style=\\'width:100%;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\\'>https://images-na.ssl-images-amazon.'+pr[i].getElementsByTagName('img')[0].attributes['data-old-hires'].value.split('.')[2]+'.jpg</td>';}\
	catch(err){continue}}\
text+='</tr>';\
var table=document.createElement('table');\
table.setAttribute('border','1');\
table.setAttribute('width','400px');\
table.setAttribute('style','table-layout:fixed');\
table.innerHTML=text;\
document.getElementById('leftCol').appendChild(table)};";
script.innerHTML=txt;
document.getElementsByTagName('head')[0].appendChild(script);

var button1=document.createElement('button');
button1.setAttribute('type','button');
button1.innerHTML='生成表格';
button1.setAttribute('onclick','create_table()');
document.getElementById('nav-subnav').appendChild(button1);