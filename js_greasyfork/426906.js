// ==UserScript==
// @name         all
// @namespace    http://hzx8964.github.io/
// @version      2.0
// @description  网易客服自动填写，每日问候网易雷火全家
// @author       hzx8964
// @match        http*://gm.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426906/all.user.js
// @updateURL https://update.greasyfork.org/scripts/426906/all.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let types = [
    "BUG反馈",
    "充值问题",
    "处罚问题",
    "游戏问题",
    "运行问题"
  ];

  let titles = [
    "李白乘舟将欲行，忽闻你吗惨叫声。",
    "艹你奶奶全家死",
    "艹你吗碧全家死",
    "艹尼玛烂逼全家死",
    "艹尼玛臭逼全家死",
    "艹尼玛全家死",
    "艹畜生全家死",
    "艹狗砸种全家死",
    "艹臭女表子全家死",
    "艹全家死全家死",
    "艹砸种今日家里死了几个？",
    "艹尼玛走的很安详"
  ];

  let remarks = [
    "网易游戏，你的书都读到狗肚子里了吗？",
    "网易游戏，像你这种垃圾公司，你最好的下场就该跟大太监刘瑾一样刮上三千刀而死。",
    "网易游戏，你懂不懂人的尊严，人的权利？？网易游戏就是个败类，禽兽。",
    "网易游戏，用什么样的语言来骂你，都是对这种语言的侮辱。",
    "网易游戏，个李莲英看了沉默，安德海看了流泪的垃圾公司。",
    "网易游戏，你配叫“游戏爱好者”？ 为了钱，无耻封号，下流卑鄙。",
    "网易游戏，你他么就是挑梁小丑，不齿于人类的渣子，畜牲东西。",
    "网易游戏，网易论游戏爱好者，安公公论鸡鸡多余。",
    "网易游戏，上下五千年出你们这么一个垃圾公司，抢劫的还爽？",
    "网易游戏，网易游戏，150级都封？尼玛没了，全家原地爆炸。",
    "网易游戏，150级都封？尼玛没了。玩了2300天，任务一天不落，封了？砸种",
    "网易游戏，150级都封？善恶有报，赶紧回去看看你爸妈儿女安好？",
    "网易游戏，150级都封？苟砸种，艹你麻痹狗咋哄在那个，吃相是不是难看了一点？？",
    "网易游戏，150级都封？苟砸种，不是说90+大号不会封？？老子1天充1000给你吗买棺材。",
    "网易游戏，网易游戏，150级都封？苟砸种，充了几十万，就封了？给你吗买的棺材请签收。",
    "网易游戏，150级都封？苟砸种，安卓各种优惠，你跟你m碧说公平？",
    "网易游戏，150级都封？苟砸种，艹了你吗都嫌碧臭。",
    "网易游戏，150级都封？苟砸种，艹你奶奶的嘴？",
    "网易游戏，150级都封？苟砸种，艹你女儿，无法下床。",
    "网易游戏，150级都封？苟砸种，艹你狗砸碎。",
    "艹你仙人全家死",
    "艹你奶奶全家死",
    "艹你吗碧全家死",
    "艹尼玛烂逼全家死",
    "艹尼玛臭逼全家死",
    "艹尼玛全家死",
    "艹畜生全家死",
    "艹狗砸种全家死",
    "艹臭女表子全家死",
    "艹全家死全家死",
    "艹砸种今日家里死了几个？",
    "艹尼玛走的很安详"
  ];

  window.alert = function() {
    return false;
  }

  //
  if(-1 != location.href.indexOf("user_help")) {
    // Your code here...
    $("#qtitle").val(titles[parseInt(Math.random()*titles.length)]);
    $("select[name='qtype']").val(types[parseInt(Math.random()*types.length)]);

    $("#truename").val("恶意封号者一户口本整齐");
    $("#accounts").val("fjhzxiao@163.com");
    $("#server").val(titles[parseInt(Math.random()*titles.length)]);
    $("#id").val("4191070");
    $("#cname").val("恶意封号者一户口本整齐");
    $("#time").val("2020-7-14 1:1:1");
    // $("#remark").html("善恶有报，赶紧回去看看你爸妈儿女安好？善恶有报，赶紧回去看看你爸妈儿女安好？网易杂种，非法剥夺公民财产，全家暴毙！！草泥马，人在做天在看" + Math.random());
    let sb = "";
    for(let i = 0; i < 20; i++) {
      sb += remarks[parseInt(Math.random()*remarks.length)] + '\n';
    }
    $("#remark").html(sb);

    setInterval(function(){
      console.info("网易死妈");
      $(".btn2").click();
    }, 60*1000);
  } else if(-1 != location.href.indexOf("myquestions")) {
    $(".service-con_6__list tr:gt(0) .id a").each((i, v) => {
      if($(v).css("font-weight") == 700){
        location.href = $(v).attr("href");
      }
    });
    setTimeout(function(){
      location.href = "https://gm.163.com/user_help.html?index=5&stypeid=2478";
    }, 5000);
  } else if(-1 != location.href.indexOf("question_detail")) {
    $("#ae_tips").click();
    $(".eval-stars li:eq(0)").click();
    $(".eval-detail li").click();
    $(".suggestion").html("既然都靠封号发财了，还装妮吗游戏爱好者，爱你麻痹。苟砸种全家不得好死。。。");
    setTimeout(function(){
      $("#submitEvaluation").click();
    }, 500)
    setTimeout(function(){
      location.href = "https://gm.163.com/myquestions.html";
    }, 1500)
  } else {
    setTimeout(function(){
      location.href="https://gm.163.com/myquestions.html";
    }, 3000)

  }


})();