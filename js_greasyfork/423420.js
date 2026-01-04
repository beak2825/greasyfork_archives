// ==UserScript==
// @name         回到顶部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  平时隐藏，鼠标经过页面右端 距离页面top 80%时，会显示按键，点击触发回到顶部
// @author       Candy.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423420/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/423420/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
          //创建盒子
    var candy_div1 = document.createElement("div");
    document.body.appendChild(candy_div1);
    candy_div1.className = 'candy_div1';
    var candy_div2 = document.createElement('div');
    candy_div1.appendChild(candy_div2);
    candy_div2.className = 'candy_div2';

    //鼠标经过显示图标，否则隐藏
    candy_div1.onmouseenter = function () {
      candy_div1.style.cssText = 'background: rgba(0, 0, 0, 0.1);';
      candy_div2.style.cssText = 'border-bottom-color: rgba(0, 0, 0, 0.4);';
    }
    candy_div1.onmouseleave = function () {
      candy_div1.style.cssText = 'background: rgba(0, 0, 0, 0);'
      candy_div2.style.cssText = 'border-bottom-color: rgba(0, 0, 0, 0);'
    }


    //回到顶部
    candy_div1.onclick = function () {
      if (timerID_1) {
        clearInterval(timerID_1);
      }
      var top_1 = document.documentElement.scrollTop;
      var target_1 = 0;
      var step = 30;
      var timerID_1 = setInterval(function () {

        if (top_1 > target_1) {
          top_1 = top_1 - step;
          document.documentElement.scrollTop = top_1;
        } else {
          clearInterval(timerID_1);
        }

      }, 1);
    }

    //添加CSS
    function addCSS(cssText) {
      var style = document.createElement('style'), //创建一个style元素
        head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
      style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
      if (style.styleSheet) { //IE
        var func = function () {
          try { //防止IE中stylesheet数量超过限制而发生错误
            style.styleSheet.cssText = cssText;
          } catch (e) {

          }
        }
        //如果当前styleSheet还不能用，则放到异步中则行
        if (style.styleSheet.disabled) {
          setTimeout(func, 10);
        } else {
          func();
        }
      } else { //w3c
        //w3c浏览器中只要创建文本节点插入到style元素中就行了
        var textNode = document.createTextNode(cssText);
        style.appendChild(textNode);
      }
      head.appendChild(style); //把创建的style元素插入到head中
    }

    addCSS(
      'body{height:2000px;}.candy_div1{position:fixed;top:80%;right:0;width:30px;height:30px;border-radius:10px;background:rgba(0,0,0,0);}.candy_div2{position:relative;left:5px;width:0;height:0;border:10px solid transparent;border-bottom-color:rgba(0,0,0,0);}'
      );

})();