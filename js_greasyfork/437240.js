// ==UserScript==
// @name        南工大pu问卷自动完成
// @namespace   PairZhu
// @match       https://njtech.pocketuni.net/index.php*
// @grant       none
// @version     1.1
// @author      PairZhu
// @license     GPL
// @description 自动完成南工大pu问卷，满意、赞同、了解都自动选非常赞同非常满意，其余随机选择
// @downloadURL https://update.greasyfork.org/scripts/437240/%E5%8D%97%E5%B7%A5%E5%A4%A7pu%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/437240/%E5%8D%97%E5%B7%A5%E5%A4%A7pu%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==
(function () {
  var finishPage = function finishPage() {
    if (!/act=detail/.test(window.location.href)) {
      alert("请先进入一个问卷页面内！");
      return;
    }
    var qArray = $('.dy_list_a > p').toArray().slice(0, -2);
    for (var i in qArray) {
      var option = $(qArray[i]).find('label');
      if (/非常/.test(option[0].innerText)) {
        option[0].click();
      } else if (i == 23) {
        option[2].click();
      } else {
        option[Math.floor(Math.random() * option.length)].click();
      }
    }
    alert("完成！请自行填写最后所属学院的两个选项");
  };
  $('body > div.bg').append('<button id="auto_finish" style="position: fixed; top: 40vh; right: 10em">一键完成<button/>');
  $('#auto_finish').click(finishPage);
})();