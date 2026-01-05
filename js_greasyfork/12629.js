// ==UserScript==
// @name        Better Bing
// @namespace   feifeihang.info
// @description A better Bing experience
// @include     *.bing.com/search*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12629/Better%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/12629/Better%20Bing.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  var COLORS = [
    '#FFFF00',
    '#CCCCFF',
    '#00CCFF',
    '#33CCCC',
    '#FF8080',
    '#FFCC00',
    '#008000',
    '#FFFF99',
    '#808000',
    '#FFFFCC'
  ];
  //   find all <strong> for highlighting
  var strongs = document.querySelectorAll('strong');
  var count = 0;
  var style = {
  };
  strongs = Array.prototype.slice.apply(strongs);
  strongs.map(function (strong) {
    var item = strong.textContent;
    if (style[item]) {
      strong.style.background = style[item];
      strong.style.color = '#000';
      strong.style.fontWeight = 'bold';
    } 
    else {
      style[item] = COLORS[count++];
      if (count >= COLORS.length) {
        count = 0;
      }
      strong.style.background = style[item];
      strong.style.color = '#000';
      strong.style.fontWeight = 'bold';
    }
  });
  //   add top button.
  var btn = document.createElement('div');
  btn.id = 'better-bing-top-btn';
  btn.style = 'display: none; border-radius: 100%; position: fixed; bottom: 20px; right: 20px;' +
  'height: 50px; width: 50px; line-height: 50px; color: #fff; background: #CC0000;' +
  'cursor: pointer; text-align: center; text-weight: bold; box-shadow: 0 2px 5px grey;';
  btn.textContent = 'TOP';
  btn.onclick = function () {
    window.scrollTo(0, 0);
  };
  document.body.appendChild(btn);
  window.addEventListener('scroll', function () {
    if (window.pageYOffset >= 30) {
      document.querySelector('#better-bing-top-btn').style.display = 'block';
    } 
    else {
      document.querySelector('#better-bing-top-btn').style.display = 'none';
    }
  });
  //   remove annoying right context contents.
  var context = document.querySelector('#b_context');
  if (context) {
    context.remove();
  }
  //   remove ads

  var ads = document.querySelectorAll('.b_ad, .b_adBottom');
  ads = Array.prototype.slice.apply(ads);
  ads.map(function (ad) {
    ad.remove();
  });
}) (this, this.document);
