// ==UserScript==
// @name         网页复制限制解除
// @version      0.1
// @description  通杀大部分网站，可以解除禁止复制、剪切、选择文本的限制。原作者：油猴 Cat73
// @author       TUT
// @include      *
// @grant        none
// @namespace https://greasyfork.org/users/291956
// @downloadURL https://update.greasyfork.org/scripts/396310/%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/396310/%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function () {
  /* 判断是否该执行 */
  const key = encodeURIComponent('Cat73:网页限制解除:执行判断');
  if (window[key]) {
    return;
  };
  window[key] = true;

  /* 开始执行代码 */
  const script = document.createElement('script');
  script.setAttribute('src', 'https://greasyfork.org/scripts/14146-%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4/code/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js');
  document.body.append(script);
})();