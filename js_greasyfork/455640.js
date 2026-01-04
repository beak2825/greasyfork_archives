// ==UserScript==
// @name         助理狗
// @namespace    http://tampermonkey.net/
// @version      1.73
// @description  不贴心的小助手!
// @author       Chipmuck
// @license MIT
// @match       *://aiit.iflysse.com/web/teacher/homework/review?*
// @require  https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.js
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455640/%E5%8A%A9%E7%90%86%E7%8B%97.user.js
// @updateURL https://update.greasyfork.org/scripts/455640/%E5%8A%A9%E7%90%86%E7%8B%97.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let selectedNum = 0;
  const a = {
    sub: "页面设计",
    level: [
      {
        s: 8,
        t: "优秀",
        c: '页面效果与设计图一致;'
      }, {
        s: 6,
        t: "良好",
        c: '页面效果与设计图有部分差距;'
      }, {
        s: 4,
        t: "仅表单",
        c: '页面效果仅完成了表单部分;'
      },
      {
        s: 4,
        t: "仅Echarts图",
        c: '页面效果仅完成了Echarts图部分;'
      },
      {
        s: 1,
        t: "仅HTML结构",
        c: '仅创建了页面;'
      }
    ]
  }

  const b = {
    sub: "美观度",
    level: [
      {
        s: 4,
        t: "优秀",
        c: '页面样式优秀;'
      }, {
        s: 3,
        t: "良好",
        c: '页面样式美观度较好;'
      }, {
        s: 2,
        t: "一般",
        c: '页面样式美观度一般;'
      }, {
        s: 1,
        t: "较差",
        c: '页面样式美观度较差;'
      }
    ]
  }

  const c = {
    sub: "数据初始化",
    level: [
      {
        s: 4,
        t: "正确",
        c: 'ajax请求无误,radio数据渲染准确;'
      }, {
        s: 2,
        t: "仅ajax",
        c: 'ajax请求无误,radio数据渲染有误;'
      }, {
        s: 2,
        t: "仅radio",
        c: 'ajax请求有误,radio数据渲染准确;'
      }, {
        s: 1,
        t: "死数据",
        c: '数据固定，无请求与动态渲染;'
      }, {
        s: 0,
        t: "未实现",
        c: '为实现数据初始化;'
      }
    ]
  }
  const d = {
    sub: "Echarts渲染",
    level: [
      {
        s: 4,
        t: "正确",
        c: 'Echarts图选用正确;'
      }, {
        s: 1,
        t: "其他图",
        c: 'Echarts图使用错误;'
      }, {
        s: 0,
        t: "未渲染",
        c: '无Echarts效果;'
      }
    ]
  }
  const e = {
    sub: "Echarts切换",
    level: [
      {
        s: 8,
        t: "正确",
        c: '能够根据数据不同动态渲染;'
      }, {
        s: 4,
        t: "切换有误",
        c: '能够动态切换但过程有误;'
      }, {
        s: 0,
        t: "无切换",
        c: '渲染正确但不能动态切换;'
      }
    ]
  }
  const f = {
    sub: "表单保存",
    level: [
      {
        s: 4,
        t: "正确",
        c: '能够获取到表单数据;'
      }, {
        s: 2,
        t: "有误",
        c: '能够获取到部分表单数据;'
      }, {
        s: 0,
        t: "未实现",
        c: '未能获取表单数据;'
      }
    ]
  }
  const g = {
    sub: "今日数据渲染",
    level: [
      {
        s: 4,
        t: "正确",
        c: '能够将表单数据添加渲染至radio组,并正确渲染图表;'
      }, {
        s: 2,
        t: "有误",
        c: '渲染今日数据过程有误;'
      }, {
        s: 0,
        t: "未实现",
        c: '未将今日数据添加到radio组;'
      }
    ]
  }
  const h = {
    sub: "代码格式规范",
    level: [
      {
        s: 4,
        t: "优秀",
        c: '代码格式规范，变量、函数等命名清晰;'
      },
      {
        s: 3,
        t: "良好",
        c: '代码格式较为规范，变量、函数等命名较为清晰;'
      }, {
        s: 2,
        t: "及格",
        c: '代码格式基本规范，变量、函数等命名基本清晰;'
      }, {
        s: 1,
        t: "较差",
        c: '代码格式不规范，变量、函数等命名不清晰;'
      }
    ]
  }
  const i = {
    sub: "localStorage优化",
    level: [
      {
        s: 2,
        t: "使用",
        c: '使用了localStorage优化请求;'
      },
      {
        s: 1,
        t: "有误",
        c: '使用了localStorage优化请求,但有误;'
      }
    ]
  }



  const data = [a, b, c, d, e, f, g, h, i];
  let box = $('<div data-show="yes"></div>');
  box.css({ "display": "flex", "position": "absolute", "bottom": '50px', "align-items": "center", "transition": "1s" })

  let pic = $('<svg id="assistant_logo" t="1669780321724" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11537" width="200" height="200"><path d="M686.4 200c36.8-54.4 60.8-116.8 67.2-174.4 112 59.2 150.4 129.6 150.4 233.6 0 27.2-6.4 54.4-19.2 78.4" fill="#FFFFFF" p-id="11538"></path><path d="M884.8 361.6c-3.2 0-8-1.6-11.2-3.2-12.8-6.4-16-20.8-9.6-33.6 11.2-20.8 17.6-43.2 17.6-65.6 0-88-30.4-145.6-107.2-193.6-11.2 49.6-33.6 102.4-65.6 148.8-8 11.2-24 14.4-35.2 6.4-11.2-8-14.4-24-6.4-35.2 35.2-52.8 57.6-110.4 62.4-163.2 0-8 6.4-16 12.8-19.2 8-3.2 16-3.2 24 0C880 64 929.6 140.8 929.6 259.2c0 30.4-8 60.8-22.4 89.6-4.8 8-14.4 12.8-22.4 12.8z" fill="#05498F" p-id="11539"></path><path d="M337.6 200c-36.8-54.4-60.8-116.8-67.2-174.4-112 59.2-150.4 129.6-150.4 233.6 0 27.2 6.4 54.4 19.2 78.4" fill="#FFFFFF" p-id="11540"></path><path d="M139.2 361.6c-9.6 0-17.6-4.8-22.4-12.8-14.4-28.8-22.4-59.2-22.4-89.6C94.4 140.8 144 64 259.2 3.2c8-3.2 16-3.2 24 0s12.8 11.2 12.8 19.2c4.8 52.8 27.2 110.4 62.4 163.2 8 11.2 4.8 27.2-6.4 35.2-11.2 8-27.2 4.8-35.2-6.4-32-48-54.4-99.2-65.6-148.8-76.8 48-107.2 104-107.2 193.6 0 22.4 6.4 44.8 17.6 65.6 6.4 12.8 1.6 27.2-9.6 33.6-4.8 1.6-8 3.2-12.8 3.2z" fill="#05498F" p-id="11541"></path><path d="M969.6 630.4c0 104-41.6 185.6-112 243.2-81.6 65.6-200 100.8-337.6 100.8-123.2 0-233.6-27.2-316.8-80-91.2-59.2-148.8-147.2-148.8-264C54.4 497.6 128 360 240 268.8c78.4-62.4 174.4-102.4 278.4-102.4 145.6 0 272 78.4 352 185.6 62.4 81.6 99.2 182.4 99.2 278.4z" fill="#FFFFFF" p-id="11542"></path><path d="M520 166.4c145.6 0 272 78.4 352 185.6 60.8 81.6 97.6 180.8 97.6 278.4 0 104-41.6 185.6-112 243.2-81.6 65.6-200 100.8-337.6 100.8-123.2 0-233.6-27.2-316.8-80-91.2-59.2-148.8-147.2-148.8-264C54.4 497.6 128 360 240 268.8c78.4-62.4 174.4-102.4 280-102.4m0-49.6c-110.4 0-217.6 40-310.4 113.6C83.2 331.2 4.8 484.8 4.8 630.4c0 126.4 60.8 235.2 171.2 305.6 91.2 57.6 209.6 88 344 88 152 0 278.4-38.4 368-112 84.8-70.4 129.6-168 129.6-281.6 0-105.6-38.4-216-107.2-307.2-96-132.8-238.4-206.4-390.4-206.4z" fill="#05498F" p-id="11543"></path><path d="MNaN NaNaNaN NaN NaN 1 0 NaN NaN NaN NaN NaN 1 0 NaN NaNZ" fill="#05498F" p-id="11544"></path><path d="M825.6 435.2c-8 0-16-3.2-20.8-11.2-49.6-72-126.4-131.2-217.6-163.2-12.8-4.8-19.2-19.2-14.4-32 4.8-12.8 19.2-19.2 32-14.4 100.8 36.8 187.2 100.8 241.6 182.4 8 11.2 4.8 27.2-6.4 35.2-4.8 1.6-9.6 3.2-14.4 3.2z" fill="#05498F" p-id="11545"></path><path d="M550.4 470.4h-73.6c-48 0-76.8 51.2-52.8 92.8l36.8 38.4c27.2 25.6 80 25.6 107.2 0l36.8-38.4c24-40-6.4-92.8-54.4-92.8z" fill="#05498F" p-id="11546"></path><path d="M441.6 718.4c-54.4 0-97.6-43.2-97.6-97.6 0-14.4 11.2-25.6 25.6-25.6 14.4 0 25.6 11.2 25.6 25.6 0 27.2 20.8 48 48 48s48-20.8 48-48c0-14.4 11.2-25.6 25.6-25.6s25.6 11.2 25.6 25.6c-3.2 54.4-48 97.6-100.8 97.6z" fill="#05498F" p-id="11547"></path><path d="M587.2 718.4c-54.4 0-97.6-43.2-97.6-97.6 0-14.4 11.2-25.6 25.6-25.6 14.4 0 25.6 11.2 25.6 25.6 0 27.2 20.8 48 48 48s48-20.8 48-48c0-14.4 11.2-25.6 25.6-25.6s25.6 11.2 25.6 25.6c-1.6 54.4-46.4 97.6-100.8 97.6z" fill="#05498F" p-id="11548"></path></svg>');
  pic.css({ "width": "30px" });
  let div = $('<div id="scoring_assistant"></div');
  div.css({ "background-color": "LightCyan", "border-radius": "5px", "width": "280px", "box-shadow": "rgba(0, 0, 0, 0.1) 0px 4px 12px" });
  data.forEach(d => {
    const section = $('<section></section>')
    section.css({ "padding-left": "5px", "margin-bottom": "5px" });
    const title = $('<b style="display:block">' + d.sub + '</b>')
    section.append(title);
    d.level.forEach(l => {
      section.append('<button class="item_btn" data-s="' + l.s + '" data-c="' + l.c + '">' + l.t + '</button>')
    })
    div.append(section);
  })

  div.append($('<hr><b class="statistics">已选：' + selectedNum + '个</b><button class="reset">重置</button>'))

  box.append(div).append(pic);
  $("body").append(box);

  $(".reset").css({ "float": "right", "border": "none", "background-color": "DarkOrange", "width": "100px" }).hover(function () {
    $(this).css({ "cursor": "pointer" });
  }).bind('click', function () {
    $("input.inputScore").val('');
    $("textarea.form-control").val('');
    selectedNum = 0;
    $('.statistics').text('已选：' + selectedNum + '个');
    $('.item_btn').removeClass('selected');
    $('.item_btn').css({ "background-color": "#eee" });
  })

  $('#assistant_logo').css("cssText", "width: 50px !important").bind('click', function () {
    if (box.data('show') == 'yes') {
      box.data('show', 'no');
      box.css({ "left": "-280px", "bottom": "50px" })
    } else {
      box.data('show', 'yes');
      box.css({ "left": "0px", "bottom": "50px" })
    }
  })

  $('.item_btn').css({ "margin-right": "5px", "border": "none", "border-radius": "5px", "background-color": "#eee" }).hover(function () {
    $('.item_btn').css({ "cursor": "pointer" });
  });

  $('#scoring_assistant .item_btn').bind('click', function () {
    const s = $(this).data('s') - 0;
    const c = $(this).data('c');

    if (($("input.inputScore").val() - 0 + s) > 100) {
      alert("已超过满分");
      return;
    }

    let scroeEle = $('.line-info .el-input .el-input__inner');
    let commendEle = $('textarea.el-textarea__inner');

    if ($(this).hasClass('selected')) {
      selectedNum--;
      $('.statistics').text('已选：' + selectedNum + '个');
      $(this).removeClass('selected');
      $(this).css({ "background-color": "#eee" });
      scroeEle.val(scroeEle.val() - 0 - s);
      commendEle.val(commendEle.val().replace(c, ""));
    } else {
      selectedNum++;
      $('.statistics').text('已选：' + selectedNum + '个');
      $(this).addClass('selected');
      $(this).css({ "background-color": "HotPink" });
      scroeEle.val(scroeEle.val() - 0 + s);
      commendEle.val(commendEle.val() + c);
    }
    let event = document.createEvent('HTMLEvents');
    event.initEvent("input", true, true);
    scroeEle[0].dispatchEvent(event);
    commendEle[0].dispatchEvent(event);
  }).bind('mouseover', function () {
    $(this).css({ "box-shadow": "rgb(0 0 0 / 24%) 0px 3px 8px" });
  }).bind('mouseout', function () {
    $(this).css({ "box-shadow": "none" });
  })

})();