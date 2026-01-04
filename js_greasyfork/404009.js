// ==UserScript==
// @name         YNUer's Grade
// @namespace    https://nut-cj.gitee.io/
// @version      0.2
// @description  对金智教务系统成绩页的无语，故写了这个脚本，更直观的查看成绩，目前仅适配云大本科教务系统的成绩页
// @author       nut-cj
// @match        *://ehall.ynu.edu.cn/jwapp/sys/cjcx/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404009/YNUer%27s%20Grade.user.js
// @updateURL https://update.greasyfork.org/scripts/404009/YNUer%27s%20Grade.meta.js
// ==/UserScript==
var $ = $ || window.$;


//添加样式
var sty = `<style>#para {border-radius: 9px;margin: 0px;padding: 0px;background-color: #fff6e9;padding: 10px 0px;position: absolute;top: 44px;left: 24px;z-index: 99999;}
  .classname {text-align:center;font-size:20px;padding-top:3px;padding-bottom:10px;}
  .dbp {text-align:center;}
  .main {padding: 0px 10px;width: 400px;max-height: 475px;overflow: auto;}
  .item_con {display: none;padding: 3px;background: #eee;}
  .item {border-bottom: 1px solid #bbb;padding-bottom: 5px;}
  .item.active-tab {background: #eee;transition: all 0.3s ease;}
  .open {background: #0ff;}
  .z1,.z2,.z3 {padding: 1px;border-radius: 6px;color: #fff;display: inline-block;width: 80px;}
  .z1 {background-color: #5AA9E6;}
  .z2 {background-color: #06BA63;margin-left: 15px;margin-right: 15px;}
  .z3 {background-color: #FC9E4F;}
  table {text-align: center;background-color: #fff;width: 100%;}
  table tr:nth-child(2n) {background-color: rgba(0,0,0,0.05);}
  .label {width: 400px;height: 500px;text-align: center;}
  .label>ul {width: 400px;height: 20px;padding: 0;margin-bottom: 10px;margin-top: 0;}
  .label>ul>li {float: left;display: block;color: #888;text-align: center;padding: 1px 2px;text-decoration: none;border-bottom: solid 2px #fff0;font-weight: bold;}
  .label>div {width: 400px;max-height: 500px;position: absolute;display: none;}
  .label li.showed {border-bottom: solid 2px #FE9225;color: #FE9225;}
  .label div.showed {display: block;}
  .main::-webkit-scrollbar {width: 4px;height: 4px;scrollbar-arrow-color:red;}
  .main::-webkit-scrollbar-thumb {border-radius: 5px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #c1c1c1;scrollbar-arrow-color:red;}
  .main::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);border-radius: 0;background: #f1f1f1;}</style>`;
$("head").append(sty);

function isInArray(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) { return true; }
  }
  return false;
};

function db2main(datb) {
  var html = '';
  for (var i = 0; i < datb.length; i++) {
    var row = datb[i];
    html += `<div class="item">
    <div class="classname">${row.KCM}</div>
    <div class="dbp"><div class="z1">成绩：${String(row.ZCJ)}</div><div class="z2">绩点：${String(row.XFJD)}</div><div class="z3">学分：${String(row.XF)}</div></div></div>
    <div class="item_con" style="background-color:#eee"><table>
    <tr><td>期中</td><td>${String(row.QZCJ)}(${String(row.QZCJXS)}%)</td><td>平时</td><td>${String(row.PSCJ)}(${String(row.PSCJXS)}%)</td>
    </tr><tr><td>期末</td><td>${String(row.QMCJ)}(${String(row.QMCJXS)}%)</td><td>及格</td><td>${row.SFJG_DISPLAY}</td>
    </tr><tr><td>学时</td><td>${row.XS}</td><td>修读方式</td><td>${row.XDFSDM_DISPLAY}</td>
    </tr><tr><td>有效</td><td>${row.SFYX_DISPLAY}</td><td>性质</td><td>${row.KCLBDM_DISPLAY}</td>
    </tr><tr><td>类型</td><td>${row.KCXZDM_DISPLAY}
    </tr><tr><td>学期</td><td>${row.XNXQDM}</td><td></td><td></td>
    </tr><tr><td>开课单位</td><td>${row.KKDWDM_DISPLAY}</td>
    </tr><tr><td>考试时间</td><td>${row.KSSJ}</td><td></td><td></td>
    </tr></table></div>`;
  }
  return html;
};

function db2db(data) {
  var cjda = {};
  for (var i = 0; i < data.length; i++) {
    var da = data[i];
    var ks = Object.keys(cjda);
    if (!isInArray(ks, da.XNXQDM)) {
      cjda[da.XNXQDM] = [];
    }
    cjda[da.XNXQDM].push(da);
  };
  return cjda;
};


$(document).ready(function () {
  setTimeout(() => {
    $.post("/jwapp/sys/cjcx/modules/cjfx/xscjcx.do", {XNXQDM:"2019-2020-1"}, (data, status) => {
      /* var data = JSON.parse(data); */
      var cjda = db2db(data.datas.xscjcx.rows);
      var ks = Object.keys(cjda);
      ks.sort();
      var xqm = ["大一上", "大一下", "大二上", "大二下", "大三上", "大三下", "大四上", "大四下", "大五上", "大五下"];
      var xq = '<div id="para"><div class="label"><ul style="padding: 0px 10px;">';
      for (let i = ks.length - 1, j = 0; i >= 0; i--, j++) {
        if (j == 0) {
          xq += '<li class="showed">' + xqm[i] + '</li>';
        } else {
          xq += '<li>' + xqm[i] + '</li>';
        }
      };
      xq += '</ul>';
      var con = "";
      for (let i = ks.length - 1, j = 0; i >= 0; i--, j++) {
        if (j == 0) {
          con += '<div class="showed"><div class="main">' + db2main(cjda[ks[i]]) + '<br/></div></div>';
        } else {
          con += '<div><div class="main">' + db2main(cjda[ks[i]]) + '<br/></div></div>';
        }
      };
      var myjiaohu = `<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
      <script>
        $(".main").find(".item").click(function () {
          $(this).next().slideToggle("fast");
          $(this).toggleClass("active-tab");
          $(".item_con").not($(this).next()).slideUp("fast");
          $(".main .item").not($(this)).removeClass("active-tab");
        });

        $(".main").find(".item_con").click(function () {
          $(this).slideToggle("fast");
          $(this).prev().toggleClass("active-tab");
        });


        $(".label li").mouseenter(function () {
          if (!$(this).hasClass(".showed")) {
            $(".showed").removeClass("showed");
            $(this).addClass("showed");
            $(".label>div").eq($(this).index()).addClass("showed");
          }
        });
        $(".bh-headerBar-title").click(() => {
          $("#para").slideToggle("fast");
        });
        $(".bh-headerBar-logo").click(() => {
          $("#para").slideToggle("fast");
        });
        </script>`;
      var res = xq + con + "</div></div>";
      $("body").append(res);
      $("body").append(myjiaohu);
    });

    //$("body").on("click", function() {
    /*$("body").on("click", ".label li", function() {*/
    //交互
  }, 500);
});