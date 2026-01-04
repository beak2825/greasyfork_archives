// ==UserScript==
// @name         自用价值观 - 点击时刻提醒（优化点击性能）
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  价值观 在你每次点击时飘出并提示！
// @author       Cody
// @include      http://*
// @include      https://*
// @exclude      *mail.qq.com*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/398565/%E8%87%AA%E7%94%A8%E4%BB%B7%E5%80%BC%E8%A7%82%20-%20%E7%82%B9%E5%87%BB%E6%97%B6%E5%88%BB%E6%8F%90%E9%86%92%EF%BC%88%E4%BC%98%E5%8C%96%E7%82%B9%E5%87%BB%E6%80%A7%E8%83%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/398565/%E8%87%AA%E7%94%A8%E4%BB%B7%E5%80%BC%E8%A7%82%20-%20%E7%82%B9%E5%87%BB%E6%97%B6%E5%88%BB%E6%8F%90%E9%86%92%EF%BC%88%E4%BC%98%E5%8C%96%E7%82%B9%E5%87%BB%E6%80%A7%E8%83%BD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var animateInterval = 2;
  var coreSocialistValues = ["文明", "自由", "民主", "平等", "公正", "法制", "和谐", "敬业", "友善", '狗头保命', '爱学习', '埋头苦干', '加油干', '别走神', '去学习', '去工作', '别划水', '别吵我','别逼逼','思考中'],
    index;
  window.addEventListener('click', function (e) {
    index = Math.floor(Math.random() * coreSocialistValues.length)
    //if (e.target.tagName == 'A') {
    //return;
    //}
    var x = e.pageX,
      y = e.pageY,
      el;
    var bubble = document.querySelectorAll('.bubble')
    try {
      [].forEach.call(bubble, ((element, index) => {
        if (element.style.content == 'none') {
          el = element;
          throw "优化点击，DOM复用中";
        }
      }));
    }
     catch(error){
      //console.log(error)
      }
      finally {
      if (!el) {
        el = document.createElement('span');
        el.classList.add('bubble');
        document.body.appendChild(el);
      }
      el.style.cssText = ['z-index: 9999; position: absolute; font-size: 14px; font-weight: bold; color: #dd2222;opacity:1;content:"animateing"; top: ', y - 20, 'px; left: ', x, 'px;'].join('');
      el.textContent = coreSocialistValues[index];
      setTimeout(function () {
        animate(el);
      })
    }
  });

  function animate(el) {
    var top = parseInt(el.style.top);
    el.style.transition = 'all ' + animateInterval + 's'
    el.style.top = top - 200 + 'px';
    el.style.opacity = 0;
    setTimeout(function () {
      el.style.content = 'none'
      /*setTimeout(function () {
        if (el.style.content = 'none') {
          el.parentNode.removeChild(el);
        }
      }, 1000 * animateInterval)*/
    }, 1000 * animateInterval)
  }
})();