// ==UserScript==
// @name         Download Kristen's HD Image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download Kristen's HD Image!
// @author       iPumpkin
// @match        http://kristenstewart.com.br/*
// @match        http://adoring-kstewart.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29431/Download%20Kristen%27s%20HD%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/29431/Download%20Kristen%27s%20HD%20Image.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle('.thumbnails td{position: relative;}.download-btn{border: 1px solid #f2f2f2;top: 50px;left: 10px;padding: 0;position: absolute;background-color: #f2f2f2;cursor: pointer;line-height: 0;}.download-btn svg path{fill: #777777;}.download-btn svg path:hover{fill: #3f729b}#download-all-btn {padding: 5px 8px;margin: 0 10px; background-color: #fff;border: 1px #ccc solid;cursor: pointer;font-size: 14px;}#download-all-btn:hover{background-color: #f2f2f2;}');

  function formatMonth(_m) {
    switch (_m) {
      case 'January':
        return '01';
      case 'February':
        return '02';
      case 'March':
        return '03';
      case 'April':
        return '04';
      case 'May':
        return '05';
      case 'June':
        return '06';
      case 'July':
        return '07';
      case 'August':
        return '08';
      case 'September':
        return '09';
      case 'October':
        return '10';
      case 'November':
        return '11';
      case 'December':
        return '12';
      default :
        return _m
    }
  }
  var allLinks = [];
  $(".thumbnails img").each(function (i, n) {
    var imgSrc = window.location.origin + '/' + window.location.pathname.split('/')[1] + '/' + $(n).attr('src').replace(/thumb_/, '');
    var parts = imgSrc.split('/');
    var fileName = parts[parts.length - 1].toLowerCase();
    if (parts.length > 8 && parts[9] !== undefined && parts[10] !== undefined && /^\d+$/.test(parts[9].substr(0,2))) {
      fileName = parts[7] + '-' + formatMonth(parts[8]) + '-' + parts[9].substr(0,2)+ ' ' + parts[6] + '_' + parts[parts.length - 1].toLowerCase();
    }
    $(n).parent().after('<a class="download-btn" href="' + imgSrc + '" download="' + fileName + '" title="Download" style="position: absolute; z-index: 100;"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M 4,0 4,8 0,8 8,16 16,8 12,8 12,0 4,0 z"></path></svg></a>');
    allLinks.push(imgSrc);
  });

  var copyLinks = allLinks.join('\n');
  console.log(copyLinks);

  $('td[colspan="6"] .tableh1').append('<button id="download-all-btn">Download All</button>');

  document.getElementById("download-all-btn").addEventListener("click", function () {
    var downloadList = $('a.download-btn');
    for (var i in downloadList) {
      downloadList[i].click();
    }
  });

})();
