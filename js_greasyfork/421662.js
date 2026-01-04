// ==UserScript==
// @name         spmobile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://seller.shopee.co.id/*
// @grant        none
// @require      https://apis.google.com/js/client.js
// @downloadURL https://update.greasyfork.org/scripts/421662/spmobile.user.js
// @updateURL https://update.greasyfork.org/scripts/421662/spmobile.meta.js
// ==/UserScript==

(function() {
    'use strict';
var diva = document.createElement('div');
diva.style.position = 'fixed';
diva.style.top = '0px';
diva.style.zIndex = "7000";
diva.style.right = '420px';
document.getElementsByTagName("body")[0].appendChild(diva);

var imput = document.createElement('input');
imput.style.borderColor = '#ee4d2d';
imput.style.margin = '2px';
imput.style.padding = '15px';
imput.style.fontSize = '16px';


var nota = document.createElement('button');
nota.innerHTML = 'Buat Nota';
nota.style.backgroundColor = '#ee4d2d';
nota.style.margin = '2px';
nota.style.color = 'white';
nota.style.cursor = 'pointer';
nota.style.padding = '15px';
nota.style.fontSize = '16px';

var addrc = document.createElement('button');
addrc.innerHTML = 'Alamat Costom';
addrc.style.backgroundColor = '#ee4d2d';
addrc.style.margin = '2px';
addrc.style.padding = '15px';
addrc.style.fontSize = '16px';
addrc.style.color = 'white';

var addra = document.createElement('button');
addra.innerHTML = 'Alamat Asli';
addra.style.backgroundColor = '#ee4d2d';
addra.style.margin = '2px';
addra.style.padding = '15px';
addra.style.fontSize = '16px';
addra.style.color = 'white';

var tblprint = document.createElement('button');
tblprint.innerHTML = 'Print';
tblprint.style.backgroundColor = '#ee4d2d';
tblprint.style.margin = '2px';
tblprint.style.padding = '15px';
tblprint.style.fontSize = '16px';
tblprint.style.color = 'white';

var tblrfr = document.createElement('button');
tblrfr.innerHTML = 'Refresh';
tblrfr.style.backgroundColor = '#ee4d2d';
tblrfr.style.margin = '2px';
tblrfr.style.padding = '15px';
tblrfr.style.fontSize = '16px';
tblrfr.style.color = 'white';

diva.appendChild(imput);
diva.appendChild(nota);
diva.appendChild(addrc);
diva.appendChild(addra);
diva.appendChild(tblprint);
diva.appendChild(tblrfr);


})();