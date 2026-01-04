// ==UserScript==
// @name         Amazon Multi-Country Check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check amazon products in multiple other countries.
// @author       daaawx
// @match        http://*/*
// @grant        none
// @include      http://www.amazon.*
// @include      https://www.amazon.*
// @downloadURL https://update.greasyfork.org/scripts/371888/Amazon%20Multi-Country%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/371888/Amazon%20Multi-Country%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var o;
    var rgx = /(\.es|\.co\.uk|\.com\.br|\.com|\.fr|\.ca|\.de|\.it|\.nl|\.au|\.jp|.cn|\.in|\.mx)/;
    let links = '<p>';
    var currURL = window.location.href;
    var title = document.getElementById('productTitle');

    if (/(\/dp\/|\/gp\/)/.test(currURL)) {
      o = currURL.replace(rgx, '.com');
      links += `<a href="${o}"><img src="https://i.imgur.com/Hdk4GAa.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.co.uk');
      links += `<a href="${o}"><img src="https://i.imgur.com/i9ALzZg.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.ca');
      links += `<a href="${o}"><img src="https://i.imgur.com/hOItgP9.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.es');
      links += `<a href="${o}"><img src="https://i.imgur.com/LYFA7ic.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.de');
      links += `<a href="${o}"><img src="https://i.imgur.com/VxS75Bk.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.com.br');
      links += `<a href="${o}"><img src="https://i.imgur.com/yXyZaPi.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.fr');
      links += `<a href="${o}"><img src="https://i.imgur.com/M3gZMSs.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.it');
      links += `<a href="${o}"><img src="https://i.imgur.com/oPX8yaF.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.nl');
      links += `<a href="${o}"><img src="https://i.imgur.com/aV4eQPw.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.au');
      links += `<a href="${o}"><img src="https://i.imgur.com/iyebylP.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.jp');
      links += `<a href="${o}"><img src="https://i.imgur.com/Ipbx2YQ.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.cn');
      links += `<a href="${o}"><img src="https://i.imgur.com/fXEizr9.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.in');
      links += `<a href="${o}"><img src="https://i.imgur.com/7e8QcJ9.png" style='margin-right:5px'></a>`;
      o = currURL.replace(rgx, '.mx');
      links += `<a href="${o}"><img src="https://i.imgur.com/cimpnfh.png" style='margin-right:5px'></a>`;
      links += '</p>';
      title.innerHTML += links;
    }

})();
