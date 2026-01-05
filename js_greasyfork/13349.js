// ==UserScript==
// @name	卡饭头像
// @author		Kelo
// @namespace	https://github.com/ghKelo/userscript
// @version	1.5.2
// @description	为新版卡饭论坛帖子列表增加用户头像
// @include	*.kafan.cn/forum-*.html
// @include	*.kafan.cn/forum.php?mod=forumdisplay*
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/13349/%E5%8D%A1%E9%A5%AD%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/13349/%E5%8D%A1%E9%A5%AD%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==
(function() {
  var config = {
    // 延迟时间（毫秒）
    delay: 1000,
    // 加载图片
    load: 'chrome://global/skin/icons/loading.png',
    // 错误图片
    err: 'chrome://global/skin/icons/error-16.png',
  };

  var css = [
    '.GMKaFanAvatar {',
      'padding: 2px;',
      'margin: auto 5px;',
      'float: left;',
      'width: auto;',
      'height: auto;',
      'max-width: 22px;',
      'max-height: 22px;',
      'background: #FFF none repeat scroll 0% 0%;',
      'border-width: 1px;',
      'border-style: solid;',
      '-moz-border-top-colors: none;',
      '-moz-border-right-colors: none;',
      '-moz-border-bottom-colors: none;',
      '-moz-border-left-colors: none;',
      'border-image: none;',
      'border-color: #F8F8F8 #CDCDCD #CDCDCD #F8F8F8;',
      'border-radius: 5px;',
      '-moz-box-align: center;',
    '}',
    'td.by cite {',
      'overflow: hidden;',
    '}'
  ].join('');

  function init() {
    addStyle(css);
    asyncOnce(addAvatar, config.delay);
    mutationObserver(
      document.querySelector("#threadlist") ?
        '#threadlist' : 'body', function() {
      asyncOnce(addAvatar, config.delay);
    });
  }

  function addAvatar() {
    var list = document.querySelectorAll('tbody > tr > td.by:nth-child(3) > cite > a');
    for (var i in list) {
      var item = list[i];
      if (!item.href || "avatarIndex" in item.dataset) {
        continue;
      }
      item.dataset.avatarIndex = i;
      var img = document.createElement('img');
      img.setAttribute('class', 'GMKaFanAvatar');
      img.setAttribute('src', config.load);
      item.parentNode.parentNode.insertBefore(img, item.parentNode);
      loadImg(img, getAvatar(item.href));
    }
  }

  // http://www.kafan.cn/space-uid-968313.html to https://b.ikafan.com/000/96/83/13_avatar_middle.jpg
  function getAvatar(src) {
    var uid = src.split('-')[2].split('.')[0];
    if (uid.length < 6) {
      uid = '000000'.substring(uid.length) + uid;
    }
    var uidArr = uid.match(/\d{2}/g);
    var avatarSrc = 'https://b.ikafan.com/000/' + uidArr[0] + '/' + uidArr[1] + '/' + uidArr[2] + '_avatar_small.jpg';
    return avatarSrc;
  }

  function loadImg(img, src) {
    var imgloader = new Image();
    imgloader.src = src;
    imgloader.onload = function() {
      img.src = src;
    };
    imgloader.onerror = function() {
      img.src = config.err;
    };
  }

  function mutationObserver(selector, fn, option) {
    var elem = typeof selector === 'string' ?
      document.querySelector(selector) :
      document.documentElement;
    if (!elem) {
      throw 'mutationObserver: Something wrong';
    }
    var observer = new MutationObserver(fn);
    observer.observe(elem, option || {
        attributes: true,
        subtree: true,
        childList: true
    });
  }

  var asyncOnce = (function() {
    var callbacks = [];
    return function(fn, delay) {
      if (typeof fn != 'function') {
        throw 'The `fn` option must be a function.';
      }
      callbacks.forEach(function (item, i, arr) {
        if (item.fn === fn) {
          clearTimeout(item.id);
          delete arr[i];
        }
      });
      var id = setTimeout(fn, delay || 0);
      callbacks.push({
        fn: fn,
        id: id
      });
    };
  })();

  function addStyle(css) {
    document.head.appendChild(document.createElement('style')).textContent = css;
  }
  
  init();
})();