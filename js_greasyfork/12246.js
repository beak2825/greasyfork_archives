// ==UserScript==
// @name        Better Baidu
// @namespace   feifeihang.info
// @description Remove the 'right' contents. Add Bing and Google search buttons.
// @include     http://www.baidu.com/
// @include     https://www.baidu.com/
// @include     http://www.baidu.com/s*
// @include     https://www.baidu.com/s*
// @include     http://www.baidu.com/baidu*
// @include     https://www.baidu.com/baidu*
// @version     1.2.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12246/Better%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/12246/Better%20Baidu.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  var hasAdded = false;
  // define search engines' urls.
  var URLS = {
    'Bing': 'http://www.bing.com/search?q=',
    'Google': 'http://www.google.com/#q='
  };
  // now, let's go implement keywords highlighting.
  var resultContainerQuery = '#content_left';
  var buffer = '';
  watch(resultContainerQuery, buffer);
  var COLORS = [
    '#FFFF00',
    '#FFCC00',
    '#CCCCFF',
    '#00CCFF',
    '#33CCCC',
    '#FF8080',
    '#008000',
    '#FFFF99',
    '#808000',
    '#FFFFCC'
  ];
  var counter = 0;
  var topBtn;
  window.addEventListener('scroll', function () {
    if (window.pageYOffset >= 20) {
      topBtn.style.display = 'block';
    } 
    else {
      topBtn.style.display = 'none';
    }
  });
  function watch(resultContainerQuery, buffer) {
    setInterval(function () {
      // first, remove the annoying right contents.
      if (document.querySelector('#content_right *')) {
        var all = document.querySelectorAll('#content_right *:not(.better-baidu-reserve)');
        all = Array.prototype.slice.apply(all);
        all.map(function (element) {
          element.remove();
        });
        topBtn = document.createElement('div');
        // now, add go-to-top button.
        topBtn.appendChild(document.createTextNode('TOP'));
        var displayStr = window.pageYOffset >= 20 ? 'block' : 'none';
        topBtn.style = 'display: ' + displayStr + '; position: fixed; bottom: 10px; right: 10px; line-height: 50px;' +
        'width: 50px; height: 50px; color: #fff; background: #ED614F; text-align: center;' +
        'cursor: pointer; font-weight: bold; border-radius: 100%; z-index: 999999;' +
        'box-shadow: 0 2px 5px grey;';
        topBtn.onclick = function () {
          window.scrollTo(0, 0);
        }
        document.body.appendChild(topBtn);
      }
      // if Bing and Google are not added yet, add them.

      var isNotBaiduHomepage =
      window.location.href.toUpperCase() !== 'HTTP://WWW.BAIDU.COM' &&
      window.location.href.toUpperCase() !== 'HTTPS://WWW.BAIDU.COM' &&
      window.location.href.toUpperCase() !== 'HTTP://WWW.BAIDU.COM/' &&
      window.location.href.toUpperCase() !== 'HTTPS://WWW.BAIDU.COM/';
      if (!hasAdded && isNotBaiduHomepage) {
        // find container and Baidu button.
        var container = document.querySelector('#form');
        var baidu = document.querySelector('#su').parentElement;
        var current = baidu;
        // now, create and add new buttons.
        for (var item in URLS) {
          var anchor = document.createElement('a');
          anchor.textContent = item;
          anchor.setAttribute('data-url', URLS[item]);
          anchor.setAttribute('target', '_blank');
          anchor.onmouseenter = function () {
            var q = document.querySelector('#kw').value || '';
            this.setAttribute('href', this.getAttribute('data-url') + q);
          };
          anchor.style = 'cursor: pointer; color: rgb(255, 255, 255);font-weight: bold; display: inline-block;' +
          'text-decoration: none;background: rgb(51, 133, 255) none repeat scroll 0% 0%; text-align: center; line-height: 33px;' +
          'margin-left: 2px; width: 60px; height: 33px; border-bottom: 1px solid transparent;';
          container.insertBefore(anchor, current.nextSibling);
          current = anchor;
        }
        hasAdded = true;
      }
      var resultContainer = document.querySelector(resultContainerQuery);
      if (resultContainer && resultContainer.textContent !== buffer) {
        // update buffer.
        buffer = resultContainer.textContent;
        // first, find all 'em's.
        var ems = document.querySelectorAll('em');
        // if there is no 'em's, do nothing.
        if (ems.length === 0) {
          return false;
        }
        // convert ems into an array.

        ems = Array.prototype.slice.apply(ems);
        var counter = 0;
        var styles = {
        };
        // iterate through all the keywords in search result, 
        // and map the predefined color to them.
        ems.forEach(function (em) {
          var text = em.innerHTML.toUpperCase().trim();
          var bg = styles[text];
          if (!bg) {
            bg = COLORS[counter++];
            styles[text] = bg;
            if (counter === COLORS.length) {
              counter = 0;
            }
          }
          em.style.background = bg;
          em.style.color = '#000';
          em.style.fontWeight = 'bold';
        });
      }
    }, 200);
  }
}) (this, document);
