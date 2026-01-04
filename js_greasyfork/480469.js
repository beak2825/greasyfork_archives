// ==UserScript==
// @name         在9dmsgame网站上自动输入搜索验证码
// @namespace    none
// @version      1.0
// @description  在9dm上搜索时会弹出输入验证码，这个脚本的功能就是自动输入验证码。
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480469/%E5%9C%A89dmsgame%E7%BD%91%E7%AB%99%E4%B8%8A%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E6%90%9C%E7%B4%A2%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/480469/%E5%9C%A89dmsgame%E7%BD%91%E7%AB%99%E4%B8%8A%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E6%90%9C%E7%B4%A2%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==
// @license MIT

/* eslint-disable no-eval */ // 添加这一行以禁用 no-eval 规则
(function() {
  'use strict';

  // 定义一个函数，用于执行自动输入验证码的逻辑
  function autoFillCaptcha() {
    // 获取当前网址
    var url = window.location.href;
    // 判断当前网址是否以"http://www.9dmsgame.com/search.php"开头，如果是，说明是目标网站
    if (url.startsWith("http://www.9dmsgame.com/search.php")) {
      // 使用document.querySelector方法，传入".mask-box"参数，返回匹配该选择器的第一个元素，如果没有找到，返回null
      // 这个元素就是验证码元素，包含了数字和运算符的信息
      var element = document.querySelector(".mask-box");
      // 判断是否存在验证码元素
      if (element) {
        // 如果存在，就提取验证码元素的所有内容，这是一个字符串，包含了一些HTML标签
        var content = element.innerHTML;
        // 定义三个正则表达式，分别用于匹配第一个数字，运算符，和第二个数字
        // 这些正则表达式都有一个括号，表示捕获组，用于提取匹配的内容
        var regex1 = /<span id="num1">(\d+)<\/span>/;
        var regex2 = /<span>([+\-*/])<\/span>/;
        var regex3 = /<span id="num2">(\d+)<\/span>/;
        // 使用字符串的match方法，传入正则表达式参数，返回一个数组，包含匹配的结果，如果没有匹配，返回null
        // 数组的第一个元素是整个匹配的内容，第二个元素是第一个捕获组的内容，以此类推
        var match1 = content.match(regex1);
        var match2 = content.match(regex2);
        var match3 = content.match(regex3);
        // 判断是否三个正则表达式都匹配成功
        if (match1 && match2 && match3) {
          // 如果匹配成功，就从数组中提取出数字和运算符
          var num1 = match1[1]; // 第一个数字
          var op = match2[1]; // 运算符
          var num2 = match3[1]; // 第二个数字
          // 使用eval函数，传入一个字符串参数，执行该字符串表示的表达式，并返回结果
          // 例如，eval("1+2")会返回3
          // 注意，eval函数是一个危险的函数，可能会导致安全问题，所以在使用前需要禁用no-eval规则
          // 另外，eval函数可能会抛出异常，所以需要使用try...catch语句来捕获异常
          try {
            // 拼接一个字符串，表示验证码的表达式
            var expression = num1 + op + num2;
            // 使用eval函数，执行该表达式，并返回结果
            var result = eval(expression);
            // 将计算结果放入输入框
            // 使用document.querySelector方法，传入'#inp1[type="text"]'参数，返回匹配该选择器的第一个元素，如果没有找到，返回null
            // 这个元素就是输入框元素，用于输入验证码的结果
            var inputElement = document.querySelector('#inp1[type="text"]');
            // 判断是否找到输入框元素
            if (inputElement) {
              // 如果找到，将计算结果转换为字符串，赋值给输入框的value属性
              inputElement.value = result.toString();
              // 将焦点设置到输入框上
              inputElement.focus();
              // 模拟按下 Enter 键
              // 创建一个新的Event对象，传入'keydown'参数，表示键盘按下事件
              var enterKeyEvent = new Event('keydown');
              // 设置Event对象的key属性为'Enter'，表示按下的键是Enter键
              enterKeyEvent.key = 'Enter';
              // 设置Event对象的keyCode属性为13，表示按下的键的编码是13
              enterKeyEvent.keyCode = 13;
              // 使用输入框元素的dispatchEvent方法，传入Event对象，触发该事件
              inputElement.dispatchEvent(enterKeyEvent);
            } else {
              // 如果找不到输入框，可以在这里进行相应的处理
              console.error('Input element with id "inp1" and type "text" not found.');
            }
          } catch (error) {
            // 如果发生异常，打印错误信息
            console.error(error);
          }
        }
      }
    }
  }

  // 调用autoFillCaptcha函数，执行自动输入验证码的逻辑
  autoFillCaptcha();
})();
