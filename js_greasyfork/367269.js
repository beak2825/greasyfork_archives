// ==UserScript==
// @name         社会主义核心价值观
// @namespace    https://icecacoa.com/
// @version      0.3
// @description  学习用-社会主义核心价值观
// @author       0.0
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367269/%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%E8%A7%82.user.js
// @updateURL https://update.greasyfork.org/scripts/367269/%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%E8%A7%82.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var coreSocialistValues = ["富强", "民主", "文明", "和谐",
    "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"];
  var index = Math.floor(Math.random() * coreSocialistValues.length);
  document.addEventListener('click', function (e) {
    var x = e.pageX, y = e.pageY;
    var span = document.createElement('span');
    span.textContent = coreSocialistValues[index];
    index = (index + 1) % coreSocialistValues.length;
    var hue = Math.floor(Math.random() * 360);
    var saturation = Math.floor(Math.random() * 21) + 80;
    var lightness = Math.floor(Math.random() * 26) + 50;
    var believe = Math.floor(Math.random() * 100);
    if (believe < 5) {
      span.textContent = "河蟹";
      lightness = 40;
    }
    span.style.cssText = ['z-index: 9999999; position: absolute; font-weight:',
      'bold; color: hsl(', hue, ',', saturation, '%,', lightness, '%); ',
      'top: ', y - 20, 'px; left: ', x, 'px;'].join('');
    document.body.appendChild(span);
    animate(span);
  });

  function animate(el) {
    var i = 0;
    var top = parseInt(el.style.top);
    var id = setInterval(frame, 16.7);

    function frame() {
      if (i > 180) {
        clearInterval(id);
        el.parentNode.removeChild(el);
      } else {
        i += 2;
        el.style.top = top - i + 'px';
        el.style.opacity = (180 - i) / 180;
      }
    }
  }
})();
