// ==UserScript==
// @name         [GC][Backup] - Virtupets.net Search Link
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/*
// @version      1.1
// @license      MIT
// @description
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @description Add virtupets.net search link to sitewide search helper.
// @downloadURL https://update.greasyfork.org/scripts/547299/%5BGC%5D%5BBackup%5D%20-%20Virtupetsnet%20Search%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/547299/%5BGC%5D%5BBackup%5D%20-%20Virtupetsnet%20Search%20Link.meta.js
// ==/UserScript==


document.querySelectorAll('div.searchhelp').forEach(function(div) {
var item = div.id;

item = item.trim().replace(/-links/g, '').replace(/\s+/g, '%20');


    var link = document.createElement('a');
    link.href = `https://virtupets.net/search?q=${item}`;
    link.target = '_blank';


    var img = document.createElement('img');
  // SWITCH THE // FROM THE BEGINNING OF THE IMG.SRC SO THE ONE YOU DONT WANT TO USE IS GREYED OUT

  //COLOR:
    img.src = 'https://virtupets.net/assets/images/vp.png';

  //BASIC:
  //  img.src = 'https://i.imgur.com/ogwfJ45.png';


    img.alt = 'Virtupets';
    img.style.width = '20px';

    link.appendChild(img);
    div.appendChild(link);
});

