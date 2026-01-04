// ==UserScript==
// @name         gm.163.com auto fill form,fuck WangYi LeiHuo.
// @namespace    http://hzx8964.github.io/
// @version      4.1.7
// @description  网易客服自动填写，每日问候网易雷火全家
// @author       hzx8964
// @match        *gm.163.com/user_help.html?index=5&stypeid=2478
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/426787/gm163com%20auto%20fill%20form%2Cfuck%20WangYi%20LeiHuo.user.js
// @updateURL https://update.greasyfork.org/scripts/426787/gm163com%20auto%20fill%20form%2Cfuck%20WangYi%20LeiHuo.meta.js
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
        "网易雷火技术死全家，封号砸种死吗",
        "你玛被狗曰了",
        "你玛死了",
        "李白乘舟将欲行，忽闻你吗惨叫声。",
        "风在吼，马在叫，你吗在咆哮。",
        "春天在哪里，春天在哪里，春天在你吗的臭碧里。",
        "艹你吗的金刚臭碧",
        "网易雷火员工苟砸种",
        "网易雷火员工全族癌症",
        "网易雷火员工全族你吗死了",
        "网易雷火员工你吗死了",
        "网易雷火员工端午祭日",
        "艹网易雷火员工吗碧艹你吗碧艹你吗碧",
        "艹你吗的汗血臭碧",
        "艹你吗的镶钻臭碧",
        "艹你吗的金刚臭碧",
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
        "艹你吗的汗血臭碧",
        "艹尼玛走的很安详"
    ];

    window.alert = function() {
        return false;
    }

    $("#clauseElement").click();
    // Your code here...
    $("#qtitle").val(titles[parseInt(Math.random()*titles.length)]);
    $("select[name='qtype']").val(types[parseInt(Math.random()*types.length)]);    
    $("#truename").val("诅咒网易兔年全家白肺！！" + Math.random()*10);
    $("#accounts").val("fjhzxiao@163.com_" + Math.random()*10);
    $("#server").val("诅咒网易兔年全族死绝！！" + Math.random()*10);
    $("#id").val(100000 + parseInt(Math.random() * 1000000));
    $("#cname").val("诅咒网易兔年全家阳性，白肺！！" + Math.random()*10);
    $("#time").val("2020-7-14 1:1:1");
    
    if("2021/6/1" == new Date().toLocaleDateString()) {
      $("#qtitle").val("六一网易雷火子孙祭日");
      $("#truename").val("六一网易雷火断子绝孙");
      $("#server").val("六一网易雷火断子绝孙");
      $("#cname").val("六一网易雷火断子绝孙");
    } else if("2021/6/2" == new Date().toLocaleDateString()) {
      $("#qtitle").val("六二该去收孩子骨灰盒");
      $("#truename").val("六一网易雷火断子绝孙");
      $("#server").val("六一网易雷火断子绝孙");
      $("#cname").val("六一网易雷火断子绝孙");
    } else {
      $("#qtitle").val( "虔诚祷告，诅咒网易员工全族癌症！永世不得超生！！！");
    }
    // 
    
    

    let sb = "乱斗西游也提倡文明用语，礼貌待人，共建美好环境？？？\n要点脸？？封号的时候你他女良的文明了？？明抢的时候你女良的礼貌了？？美好环境是靠抢劫创造的吗？？？";
    for(let i = 0; i < 5; i++) {
//         sb += remarks[parseInt(Math.random()*remarks.length)] + '\n';    //
        for(let j = 0; j < 5; j++) {
//         sb += remarks[parseInt(Math.random()*remarks.length)] + '\n';
        sb += "旗禱忘意铨家che获，1糊kou苯争争77！旗禱忘意铨家ai症，段仔絕孫。"
        //
        }
        sb += "\n"
    }
    $("#remark").html(sb);

    setInterval(function(){
        console.info("网易死妈");
        $(".btn2").click();
    }, 60*3*1000);

    setInterval(function(){
        location.reload();
    }, 60*30*1000);

})();