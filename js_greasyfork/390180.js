// ==UserScript==
// @name         洛谷显示他人咕值
// @version      0.2.4
// @description  在洛谷中显示他人的咕值详情（仅限rk前1000用户）
// @author       叶ID (KMnO4y_Fish, yezhiyi9670)
// @match        *://www.luogu.com.cn/user/*
// @namespace    https://greasyfork.org/zh-CN/users/370663-yezhiyi9670
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/390180/%E6%B4%9B%E8%B0%B7%E6%98%BE%E7%A4%BA%E4%BB%96%E4%BA%BA%E5%92%95%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/390180/%E6%B4%9B%E8%B0%B7%E6%98%BE%E7%A4%BA%E4%BB%96%E4%BA%BA%E5%92%95%E5%80%BC.meta.js
// ==/UserScript==

(function () {
  $('document').ready(function(){setTimeout(function(){
    setInterval(function() {
      if($('.add-rating-inspector').length) return
      
      // console.log('iakioi');
      var $sidebar = $('section.side');
      var $firstele = $($sidebar.children()[0]);
      var $setting = $('.btn.btn-config.lfe-form-sz-middle');
      if($setting.length) return; // 是自己的账户
      var $rankbox = $('.stats.normal :nth-child(5) :nth-child(2)');
      if(!$rankbox.length) return; // 已开启完全隐私保护
      console.log($rankbox);

      $show_ele = $(`
        <div data-v-796309f8 class="card padding-default add-rating-inspector">
          <h3 class="lfe-h3"><svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="dice-d6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-dice-d6 fa-w-14" style="color: rgb(52, 152, 219);"><g data-v-d4260d54="" data-v-796309f8="" class="fa-group"><path data-v-d4260d54="" data-v-796309f8="" fill="currentColor" d="M25.87 124.42a8.54 8.54 0 0 1-.06-14.42l166-100.88a61.72 61.72 0 0 1 64.43 0L422.19 110a8.54 8.54 0 0 1-.05 14.47L224 242.55z" class="fa-secondary"></path><path data-v-d4260d54="" data-v-796309f8="" fill="currentColor" d="M0 161.83v197.7c0 23.77 12.11 45.74 31.79 57.7L184 509.71c10.67 6.48 24.05-1.54 24.05-14.44V271.46L12 154.58c-5.36-3.17-12 .85-12 7.25zm436-7.25L240 271.46v223.82c0 12.89 13.39 20.92 24.05 14.43l152.16-92.48c19.68-12 31.79-33.94 31.79-57.7v-197.7c0-6.41-6.64-10.42-12-7.25z" class="fa-primary"></path></g></svg>
            &nbsp;
            咕值
          </h3>
          <p id="add-rating-error" style="display:none;margin-bottom:0;">该用户排名大于1000，不能获取其咕值详情。</p>
          <button data-v-dc8d06e8="" data-v-4929b25c="" data-v-796309f8="" solid="" class="btn" id="add-rating-button" style="border-color: rgb(255, 255, 255); color: rgb(255, 255, 255); background-color: rgb(52, 152, 219);margin-top:16px;padding:4px 10px;">显示</button>
          <div id="add-rating-showbox" style="display:none;">
            <div data-v-d4260d54="" data-v-796309f8="" class="flex-lr info-row" style="margin-bottom: 0.5em;">
              <span data-v-d4260d54="" data-v-796309f8="">基础信用</span>
              <span data-v-d4260d54="" data-v-796309f8="" class="info-content add-rating-basic">-</span>
            </div>
            <div data-v-d4260d54="" data-v-796309f8="" class="flex-lr info-row" style="margin-bottom: 0.5em;">
              <span data-v-d4260d54="" data-v-796309f8="">练习情况</span>
              <span data-v-d4260d54="" data-v-796309f8="" class="info-content add-rating-practice">-</span>
            </div>
            <div data-v-d4260d54="" data-v-796309f8="" class="flex-lr info-row" style="margin-bottom: 0.5em;">
              <span data-v-d4260d54="" data-v-796309f8="">社区贡献</span>
              <span data-v-d4260d54="" data-v-796309f8="" class="info-content add-rating-community">-</span>
            </div>
            <div data-v-d4260d54="" data-v-796309f8="" class="flex-lr info-row" style="margin-bottom: 0.5em;">
              <span data-v-d4260d54="" data-v-796309f8="">比赛情况</span>
              <span data-v-d4260d54="" data-v-796309f8="" class="info-content add-rating-contest">-</span>
            </div>
            <div data-v-d4260d54="" data-v-796309f8="" class="flex-lr info-row" style="margin-bottom: 0.5em;">
              <span data-v-d4260d54="" data-v-796309f8="">获得成就</span>
              <span data-v-d4260d54="" data-v-796309f8="" class="info-content add-rating-achievement">-</span>
            </div>
            <div data-v-d4260d54="" data-v-796309f8="" class="flex-lr info-row" style="margin-bottom: 0.5em;">
              <span data-v-d4260d54="" data-v-796309f8="">总咕值</span>
              <span data-v-d4260d54="" data-v-796309f8="" class="info-content add-rating-total">-</span>
            </div>
            <div data-v-d4260d54="" data-v-796309f8="" class="flex-lr info-row" style="margin-bottom: 0.5em;">
              <span data-v-d4260d54="" data-v-796309f8="">更新日期</span>
              <span data-v-d4260d54="" data-v-796309f8="" class="info-content add-rating-date">-</span>
            </div>
          </div>
        </div>
        <style>
          .info-content[data-v-d4260d54][data-v-796309f8] {
            color: rgba(0, 0, 0, 0.45);
            float: right;
          }
        </style>
      `);
      $show_ele.insertAfter($firstele);

      var ranktxt = $rankbox.html().trim();

      var show_result = function(res, date) {
        $('.add-rating-basic').html(res['basicRating']);
        $('.add-rating-practice').html(res['practiceRating']);
        $('.add-rating-community').html(res['socialRating']);
        $('.add-rating-contest').html(res['contestRating']);
        $('.add-rating-achievement').html(res['prizeRating']);
        $('.add-rating-total').html(res['rating']);
        $('.add-rating-date').html(date);
      }
      var another_show_func = function() {
      };
      var show_error = function(str) {
        $('#add-rating-error').css('display','block');
        $('#add-rating-error').html(str);
        $('#add-rating-button')[0].removeAttribute('disabled');
      };
      if(ranktxt.indexOf("k")!=-1 || ranktxt > 1000) {
        $('#add-rating-error').css('display','block');
        $('#add-rating-button').click(another_show_func);
        $('#add-rating-button').css('display','none');
      }
      else if(ranktxt.indexOf("-")!=-1) {
        $('#add-rating-error').css('display','block');
        $('#add-rating-error').html('用户没有排名，不能获取其咕值详情。');
        $('#add-rating-button').click(another_show_func);
        $('#add-rating-button').css('display','none');
      }
      else {
        var tt_user_rk = ranktxt;
        // show_alert("用户排名："+tt_user_rk);
        var tt_rk_page = Math.floor((tt_user_rk-1)/50) + 1;
        // show_alert("排名信息在第"+tt_rk_page+"页");

        var tt_username = location.href.match(/^(\w+):\/\/www.luogu.com.cn\/user\/(\d+)/)[2];
        // else show_alert("调试","用户uid："+tt_username);

        var akioi = function(pageid,remain = 10){
          if(remain == 0 || pageid>20) {
            if(pageid<=20) show_error("找不到用户的咕值信息，请刷新重试。");
            else show_error("找不到用户的咕值信息。");
            return;
          }
          $('#add-rating-button')[0].setAttribute('disabled','disabled');
          var url = "https://www.luogu.com.cn/ranking?page="+pageid+"&_contentOnly=1";
          console.log("获取排名网址：",url);
          $.get(url,
            function (data) {
              // var arr = eval('(' + data + ')');
              // var arr = JSON.parse(data);
              var arr = data;
              console.log("用户数据：",arr);
              if (arr['code'] != 200) {
                show_error(arr["message"]);
              }
              else {
                var dat = arr['currentData']['rankList']['result'];
                for(var i = 0;i < 50;i++) {
                  if(!dat[i]) continue;
                  if(dat[i]['user']['uid'] == tt_username) {
                    // show_alert("找到用户");
                    $('#add-rating-button').css("display",'none');
                    /*$(function () {
                      $('#add-rating-display').highcharts({
                        chart:{
                          polar:true,type:'line',backgroundColor:"rgba(0,0,0,0)"
                        },
                        pane:{size:'36%'},title:{text:"",floating:true},legend:{enabled:false},credits:{enabled:false},
                        xAxis: {
                          categories: ['基础信用', '练习情况', '社区贡献', '比赛情况', '获得成就'],
                          tickmarkPlacement: 'on',
                          lineWidth: 0
                        },
                        yAxis: {
                          gridLineInterpolation: 'polygon',
                          lineWidth: 0,
                          min: 0,
                          max: 100
                        },
                        tooltip: {
                          shared: true,
                          pointFormat: '<b>{point.y:,.0f}</b>/100<br/>'
                        }, 
                        series: [{
                          name: '咕值',
                          data: [
                            dat[i]['basicRating'],
                            dat[i]['practiceRating'],
                            dat[i]['socialRating'],
                            dat[i]['contestRating'],
                            dat[i]['prizeRating']
                          ],
                          pointPlacement: 'on'
                        }]
                      });
                    });*/
                    function getdate(t) {
                      var now = new Date(t),
                      y = now.getFullYear(),
                      m = now.getMonth() + 1,
                      d = now.getDate();
                      return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
                    }
                    show_result(dat[i],getdate(dat[i]['calculateTime']*1000));
                    // $('#add-rating-date').html(getdate(dat[i]['calculateTime']*1000));
                    $('#add-rating-showbox').css('display','block');
                    return;
                  }
                }
                // show_alert("脚本：洛谷显示他人咕值", "找不到用户的咕值信息，请刷新重试。");
                akioi(pageid+1,remain-1);
              }
            }
          );
        };

        $('#add-rating-button').click(function(){akioi(tt_rk_page,10);});
      }
    },200);
  },800)});
})();
