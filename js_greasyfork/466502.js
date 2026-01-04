// ==UserScript==
// @name 边缘下拉清除悬浮广告
// @version 2.0
// @description 任意页面左右侧边缘下拉手势可清除一些恼人的悬浮广告元素，并停止相关计时器，适用于移动设备浏览器。
// @author ChatGPT
// @match *://*/*
// @run-at document-end
// @grant none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/466502/%E8%BE%B9%E7%BC%98%E4%B8%8B%E6%8B%89%E6%B8%85%E9%99%A4%E6%82%AC%E6%B5%AE%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/466502/%E8%BE%B9%E7%BC%98%E4%B8%8B%E6%8B%89%E6%B8%85%E9%99%A4%E6%82%AC%E6%B5%AE%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// 配置参数
var triggerDistance = window.innerWidth / 15; // 边缘触发距离，单位 px
var triggerHeight = window.innerHeight / 3; // 下拉触发高度，单位 px

// 监听触屏下拉手势事件
document.addEventListener('touchstart', function(e) {
  // 获取手指位置和屏幕宽度、高度
  var touchX = e.touches[0].pageX;
  var touchY = e.touches[0].pageY;
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;

  // 计算左右边缘触发位置和上方触发位置
  var leftTrigger = triggerDistance;
  var rightTrigger = screenWidth - triggerDistance;
  var topTrigger = triggerHeight;

  // 判断手指是否在左侧或右侧边缘触发位置或上方触发位置下拉
  if (touchX < leftTrigger || touchX > rightTrigger || touchY < topTrigger) {
    var startY = e.touches[0].clientY;
    var isScrolled = false;
    // 监听触屏手势滑动事件
    document.addEventListener('touchmove', function(e) {
      var endY = e.changedTouches[0].clientY;
      var distance = endY - startY;
      // 判断向下滑动距离是否大于指定的下拉距离
      if (distance > triggerHeight && !isScrolled) {
        isScrolled = true;
        // 删除广告并清除计时器
        var elementsToRemove = Array.from(document.querySelectorAll('*')).filter(function(el) {
          var zIndex = parseInt(getComputedStyle(el).zIndex);
          return zIndex > 500;
        });
        elementsToRemove.forEach(function(el) {
          el.parentNode.removeChild(el);
        });
        setTimeout(function() {
          for(var i = 1; i < 99; i++) {
            clearInterval(i);
            clearTimeout(i);
          }
        }, 0);
      }
    });
    // 监听触屏手势结束事件和取消事件
    document.addEventListener('touchend', function(e) {
      isScrolled = false;
    });
    document.addEventListener('touchcancel', function(e) {
      isScrolled = false;
    });
  }
});
