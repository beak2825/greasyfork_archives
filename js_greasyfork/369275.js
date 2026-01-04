// ==UserScript==
// @namespace   image@PDAWiki.com
// @version     1.0.2.20180607
// @grant       unsafeWindow
// @include     /^https?://(www\.)?pdawiki\.com/
// @match       https://www.pdawiki.com/forum/forum.php?mod=viewthread&tid=13941
// @match       http://www.pdawiki.com/forum/forum.php?mod=viewthread&tid=13941
// @run-at      document-start
// @name        PDAWiki: Normal quality images.
// @name:zh-CN  PDAWiki: 正常质量的图片.
// @name:zh-TW  PDAWiki: 正常质量的图片.
// @description Fix PDAWiki blurred images.
// @description:zh-CN 修复 PDAWiki 模糊的图片。
// @description:zh-TW 修复 PDAWiki 模糊的图片。
// @downloadURL https://update.greasyfork.org/scripts/369275/PDAWiki%3A%20Normal%20quality%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/369275/PDAWiki%3A%20Normal%20quality%20images.meta.js
// ==/UserScript==
function _editSrc(element){
 
      var _src = element.getAttribute('src');
      if (/nothumb=yes/i.test(_src)) return;
      if (!(/^forum\.php/i.test(_src))) return;
      
      var _width = element.width;
      var _height = element.height;
  
      element.setAttribute('src', _src + "&nothumb=yes");
      element.removeAttribute('height');
      element.removeAttribute('width');
      console.log(`w:${_width} h:${_height}`);
      if ((_width === undefined)||(_height === undefined)|| (_width * 1.4 < _height)){
        element.setAttribute('style', 'max-width:80%;');
      } else {
        element.setAttribute('style', 'max-width:600px;');
      }
}

  var style = document.createElement('style');
  style.textContent = '.jammer, .fn_wx_fixed, .pct center, #floatPanel {' + [
    'display: none !important'
  ].join(';') + '}';
  document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', function () {
  console.log('PDA loaded');
  //console.log('select:' + document.querySelector('img.zoom'));
  
  var _href = window.location.href;
  if (!(/\bviewthread\b|\bthread\b/i.test(_href))) return;
  
  var imgs = document.querySelectorAll('img.zoom');
  console.log('----- imgs:' + imgs.length);
  
  for (var item of imgs){
    var _src = item.getAttribute('src');
    console.log('-- src:' + _src);
  
    //item.removeAttribute('lazyloaded');
    if (/^forum\.php/i.test(_src)){
      _editSrc(item);
    } else {
      item.addEventListener('load', function(){
        _editSrc(this);
      })
    }
    //console.log(item);
  
  }
  
}, true);


/*
setTimeout(function(){
  var imgs = document.querySelectorAll('img.zoom');
  console.log('imgs:' + imgs.length);
  for (var item of imgs){
    console.log('Loop');
    console.log(item);
  }
}, 0);
*/
