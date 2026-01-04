// ==UserScript==
// @name         洛谷用户查找
// @version      0.1.9
// @description  在洛谷主页添加类似Codeforces的Find User（暂不支持自动补全）
// @author       C2020陈铭浩
// @match        *://www.luogu.com.cn/
// @match        *://www.luogu.com.cn/
// @namespace    https://greasyfork.org/zh-CN/users/370663-yezhiyi9670
// @downloadURL https://update.greasyfork.org/scripts/504344/%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E6%9F%A5%E6%89%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/504344/%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E6%9F%A5%E6%89%BE.meta.js
// ==/UserScript==

(function () {
  $('document').ready(function(){setTimeout(function () {
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $firstele = $($sidebar.children()[0]);
    // console.log($firstele);
    $finder = $(`
      <div class="lg-article" id="find-user-form">
        <h2>查找用户</h2>
        <form id="find-user-form">
          <input type="text" class="am-form-field" name="finder-uid" placeholder="用户名或uid" autocomplete="off" />
        </form>
        <button class="am-btn am-btn-sm am-btn-primary" style="margin-top:16px;visibility:hidden">查找</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="find-user-button" style="margin-top:16px;">查找</button>
      </div>
    `);
    $finder.insertAfter($firstele);
    var find_func = function() {
      $('#find-user-button').addClass('am-disabled');
      $.get("/fe/api/user/search?keyword=" + $('[name=finder-uid]')[0].value,
        function (data) {
          var arr = data;
          if (!arr['users'][0]) {
            $('#find-user-button').removeClass('am-disabled');
            show_alert("好像哪里有点问题", "无法找到指定用户");
          }
          else {
            location.href = "/user/"+arr['users'][0]['uid'];
          }
        }
      );
      return false;
    };
    $('#find-user-button').click(find_func);
    $('#find-user-form').submit(find_func);

  },500)});
})();