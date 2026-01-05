// ==UserScript==
// @name        3DS.Guide Streamlined
// @description Preload next step and put them below current guide.
// @namespace   moe.jixun.3ds
// @grant       none
// @run-at      document-start
// @include     https://3ds.guide/*
// @include     https://3dshax.cn/*
// @version     1.4
// 
// @name:zh-CN        3ds.guide 教程预加载
// @description:zh-CN 预读下一个步骤的内容放到当前页，免除手动翻页的麻烦。
// @downloadURL https://update.greasyfork.org/scripts/26309/3DSGuide%20Streamlined.user.js
// @updateURL https://update.greasyfork.org/scripts/26309/3DSGuide%20Streamlined.meta.js
// ==/UserScript==
(function () {

var each = [].forEach;

function ajax (url, onload, onerror) {
  var xhr = new XMLHttpRequest();
  xhr.onload  = onload ;
  xhr.onerror = onerror;
  xhr.open('GET', url);
  xhr.send();
}

function parseHTML (str) {
  var doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = str;
  return doc.body;
};

///////////////////////////////////////////////////////////////////////////////

addEventListener('DOMContentLoaded', function () {
  var main = document.getElementById('main');
  
  function appendToMain (el) {
    main.appendChild(el);
  }
  
  function preloadLinks () {
    var prim = main.getElementsByClassName('notice--primary');
    var total   = prim.length;
    var current = 0;
    var skip    = 0;
    
    function checkPreloads (doSkip) {
      current++;
      if (doSkip) skip++;
      if (current == total && skip != total) {
        preloadLinks();
      }
    }
    
    each.call(prim, function (block) {
      if (block.classList.contains('preload')) {
        checkPreloads(true);
        return ;
      }
      block.classList.add('preload');
      var text = block.textContent.trim().toLowerCase();
      
      if (text.indexOf('continue to') != -1
         || text.indexOf('继续') != -1) {
        var link = block.getElementsByTagName('a')[0];
        console.info('Preloading: ', link.href);
        ajax(link.href, function () {
          var body = parseHTML(this.responseText);
          var articles = body.getElementsByTagName('article');
          each.call(articles, appendToMain);
          checkPreloads(false);
        }, function () {
          var div = document.createElement('div');
          div.classList.add('notice--danger');
          var errText = document.createElement('b');
          errText.appendChild(document.createTextNode('Failed to fetch page: '));
          errText.appendChild(link.cloneNode(true));
          checkPreloads(false);
        });
      }
    });
  }
  
  preloadLinks();
}, false);

///////////////////////////////////////////////////////////////////////////////

function appendLocaleLink (links, name, url) {
  if (location.href.indexOf(url) === 0) return ;
  
  var link = document.createElement('a');
  link.href = location.href.replace(/https?:\/\/.+?\//, url);
  link.textContent = name;
  
  var li = document.createElement('li');
  li.classList.add('masthead__menu-item');
  li.appendChild(link);
  
  links.appendChild(li);
}

function addLocaleLinks () {
  var links = document.getElementsByClassName('hidden-links')[0];
  appendLocaleLink(links, '简体中文', 'https://3dshax.cn/');
  appendLocaleLink(links, 'English', 'https://3ds.guide/');
  updateNav();
}

addEventListener('load', addLocaleLinks, false);

///////////////////////////////////////////////////////////////////////////////

})();