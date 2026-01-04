// ==UserScript==
// @name         WeiboImageURLReplacer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replacer Weibo Image URLs
// @author       Sangjee Dondrub
// @match        https://theoldreader.com/*
// @match        https://www.inoreader.com/*
// @icon         https://s.theoldreader.com/assets/favicon-32x32-14f0ea359e8c8a5f19e253ff39e89505.png
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/480961/WeiboImageURLReplacer.user.js
// @updateURL https://update.greasyfork.org/scripts/480961/WeiboImageURLReplacer.meta.js
// ==/UserScript==


// Link: https://zmingcx.com/sina-micro-album-address.html
// https://tvax2.sinaimg.cn/large/006kZqPFgy1hkb6r37k5jj31jk2bch9p.jpg
// https://cdn.cdnjson.com/tvax2.sinaimg.cn/large/006kZqPFgy1hkb6r37k5jj31jk2bch9p.jpg


(function() {
  'use strict';

  var imgURLs = document.getElementsByTagName('img');
  var baseurl = 'https://cdn.cdnjson.com/';

  var regex = /https:\/\/(.+\.sinaimg.cn\/)(.+\.jpg)/;

  for (var i = 0; i < imgURLs.length; i++) {
    var url = imgURLs[i].src;
    var match = url.match(regex)

    if (match) {
      url = url.replace('https://', baseurl)
      imgURLs[i].src = url
    }
    else {
      console.log('not a weibo image, good for you!')
    }
  }
})();

