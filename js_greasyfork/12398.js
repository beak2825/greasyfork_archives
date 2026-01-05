// ==UserScript==
// @name        Better ifeng.com Pictures 凤凰网 图片尺寸修复及键盘左右页面切换
// @namespace   feifeihang.info
// @description 如题
// @include     http://*.ifeng.com/*
// @include     https://*.ifeng.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12398/Better%20ifengcom%20Pictures%20%E5%87%A4%E5%87%B0%E7%BD%91%20%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E4%BF%AE%E5%A4%8D%E5%8F%8A%E9%94%AE%E7%9B%98%E5%B7%A6%E5%8F%B3%E9%A1%B5%E9%9D%A2%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/12398/Better%20ifengcom%20Pictures%20%E5%87%A4%E5%87%B0%E7%BD%91%20%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E4%BF%AE%E5%A4%8D%E5%8F%8A%E9%94%AE%E7%9B%98%E5%B7%A6%E5%8F%B3%E9%A1%B5%E9%9D%A2%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  var LEFT = 37;
  var RIGHT = 39;
  var style = document.createElement('style');
  var css = 'body {width: 100% !important;}' +
  '#picDiv {border: none;}' +
  '#photoimg {display: block !important;} img#photo {width: 100% !important;}';
  style.appendChild(document.createTextNode(css));
  document.body.appendChild(style);
  // set #imgBox width to window.innerWidth - 20px.
  var box = document.querySelector('#imgBox');
  if (box) {
    box.style.maxWidth = box.style.width = (window.innerWidth - 20) + 'px !important';
    window.addEventListener('resize', function () {
      box.style.maxWidth = box.style.width = (window.innerWidth - 20) + 'px !important';
    }, true);
    // bind left and right arrow keys for turning pages if there are page-turning anchors.
    var prev = document.querySelector('a.picPrev');
    var next = document.querySelector('a.picNext');
    if (prev || next) {
      window.addEventListener('keypress', function (evt) {
        // only turn page if no inputs or textareas are active.
        var inputs = document.querySelectorAll('input[type=text], textarea');
        inputs = Array.prototype.slice.apply(inputs);
        if (inputs.indexOf(document.activeElement) === - 1) {
          if (evt.keyCode === LEFT && prev) {
            evt.preventDefault();
            prev.click();
          } 
          else if (evt.keyCode === RIGHT && next) {
            evt.preventDefault();
            next.click();
          }
        }
      });
    }
  }
}) (window, document);
