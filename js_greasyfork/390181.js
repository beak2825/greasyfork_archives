// ==UserScript==
// @name         洛谷按难度随机跳题
// @version      0.1.5
// @description  添加可以选择难度的随机跳题功能
// @author       叶ID (KMnO4y_Fish, yezhiyi9670)
// @match        *://www.luogu.com.cn/
// @match        *://www.luogu.com.cn/
// @namespace    https://greasyfork.org/zh-CN/users/370663-yezhiyi9670
// @downloadURL https://update.greasyfork.org/scripts/390181/%E6%B4%9B%E8%B0%B7%E6%8C%89%E9%9A%BE%E5%BA%A6%E9%9A%8F%E6%9C%BA%E8%B7%B3%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/390181/%E6%B4%9B%E8%B0%B7%E6%8C%89%E9%9A%BE%E5%BA%A6%E9%9A%8F%E6%9C%BA%E8%B7%B3%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  $('document').ready(function(){setTimeout(function () {
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $firstele = $($sidebar.children()[0]);
    // console.log($firstele);
    $finder = $(`
      <div class="lg-article" id="rand-problem-form">
        <h2>按难度随机跳题</h2>
        <select class="am-form-field" style="background-color:#DDD;" name="rand-problem-rating" autocomplete="off" placeholder="选择难度">
          <option value="0">暂无评定</option>
          <option value="1">入门</option>
          <option value="2">普及-</option>
          <option value="3">普及/提高-</option>
          <option value="4">普及+/提高</option>
          <option selected value="5">提高+/省选-</option>
          <option value="6">省选/NOI-</option>
          <option value="7">NOI/NOI+/CTSC</option>
        </select>
        <select class="am-form-field" style="background-color:#DDD;margin-top:16px;" name="rand-problem-source" autocomplete="off" placeholder="选择来源">
          <option selected value="P">洛谷题库</option>
          <option value="CF">CodeForces</option>
          <option value="SP">SPOJ</option>
          <option value="AT">AtCoder</option>
          <option value="UVA">UVa</option>
        </select>
        <button class="am-btn am-btn-sm am-btn-primary" style="margin-top:16px;visibility:hidden">跳转</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="rand-problem-button" style="margin-top:16px;">跳转</button>
      </div>
    `);
    $finder.insertAfter($firstele);
    $('#rand-problem-button').click(function() {
      $('#rand-problem-button').addClass('am-disabled');
      $.get("https://www.luogu.com.cn/problem/list?difficulty=" + $('[name=rand-problem-rating]')[0].value + "&type=" + $('[name=rand-problem-source]')[0].value + "&page=1&_contentOnly=1",
        function (data) {
          //var arr = eval('(' + data + ')');
          var arr = data;
          if (arr['code'] != 200) {
            $('#rand-problem-button').removeClass('am-disabled');
            show_alert("好像哪里有点问题", arr["message"]);
          }
          else {
            // show_alert('调试','成功（题目数：'+arr['currentData']['problems']['count']+'）');
            var problem_count = arr['currentData']['problems']['count'];
            var page_count = Math.ceil(problem_count / 50);
            var rand_page = Math.floor(Math.random()*page_count) + 1;
            // show_alert('调试',rand_page+'/'+page_count);
            $.get("https://www.luogu.com.cn/problem/list?difficulty=" + $('[name=rand-problem-rating]')[0].value + "&type=" + $('[name=rand-problem-source]')[0].value + "&page=" + rand_page + "&_contentOnly=1",
              function(data) {
                var list = data['currentData']['problems']['result'];
                var rand_idx = Math.floor(Math.random()*list.length);
                var pid = list[rand_idx]['pid'];
                // show_alert('调试',pid);
                location.href = "https://www.luogu.com.cn/problem/" + pid;
              }
            );
          }
        }
      );
    });
      
    var zzlist = document.querySelectorAll('h2');
      
    for(var i=0;i<zzlist.length;i++) {
      if(zzlist[i].innerHTML=='智能推荐') zzlist[i].innerHTML='智障推荐';
    }
  },499)});
})();
