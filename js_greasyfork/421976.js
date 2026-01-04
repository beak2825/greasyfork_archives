// ==UserScript==
// @name         scnu 学者网sso界面改善
// @namespace    https://github.com/wulnm/
// @version      1.2
// @description  学者网未结课课程排版优化，sso默认显示我的应用，教务系统跳过等待页面, 砺儒云优化
// @author       wulnm
// @match        https://www.scholat.com/myCourses.html
// @match        https://sso.scnu.edu.cn/AccountService/user/index.html
// @match        https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html?jsdm=&_t=*
// @match        https://moodle.scnu.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js

// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_deleteValue
// @run-at document-end

// @note         2020年12月4日 改良了学者网课程判定逻辑
// @note         2020年12月7日 增加学者网自定义选项按钮
// @note         2021年1月22日 增加学者网自定义显示正在学习课程
// @note         2021年1月22日 将设置按钮移动至右上角
// @note         2021年1月31日 小小美化
// @note         2021年2月20日 添加砺儒云首页课程显示功能
// @note         2021年2月22日 添加砺儒云清除quiz记录功能
// @downloadURL https://update.greasyfork.org/scripts/421976/scnu%20%E5%AD%A6%E8%80%85%E7%BD%91sso%E7%95%8C%E9%9D%A2%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/421976/scnu%20%E5%AD%A6%E8%80%85%E7%BD%91sso%E7%95%8C%E9%9D%A2%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==
(function () {
  "use strict";

  // 学者网
  if (window.location.href == "https://www.scholat.com/myCourses.html") {
    var completedTD = [];
    var tab3 = document.getElementById("tabs_3");

    function getCourseList(type) {
      let ObjList;
      if (type != undefined) ObjList = document.getElementById(type);
      else ObjList = document;
      let lessons = Array.from(ObjList.getElementsByClassName("evlistTitle"));
      let res = [];
      for (let i in lessons) {
        let text = lessons[i].innerText;
        if (text == undefined) continue;
        res.push(text);
      }
      return res;
    }

    var userList = GM_getValue("userList"); // 用户设置课程列表

    var closedLessonObj = document.getElementById("closeCourse");
    var learnLessonObj = document.getElementById("learnCourse");

    function toLessons() {
      // 点击“学习的课程”
      document.getElementById("ui-id-4").click();
    }

    function toRealLessons() {
      function getTD(title) {
        // 获取课程 td
        return title.parentNode.parentNode.parentNode.parentNode;
      }

      let lessons = Array.from(document.getElementsByClassName("evlistTitle")); // 所有课程的集合

      // 对titles进行处理
      for (let i = lessons.length - 1; i >= 0; i--) {
        if (getTD(lessons[i]).parentNode == closedLessonObj) {
          lessons.splice(i, 1, 0); // 删除已经学习完毕的课程
        }
      }
      while (lessons[lessons.length - 1] == 0) {
        lessons.pop(); //删除尾部的空元素
      }
      var myLessons = userList == undefined ? lessons : userList;

      for (let i = 0; i < lessons.length; i++) {
        if (!myLessons.includes(lessons[i].innerText)) {
          completedTD.push(getTD(lessons[i]));
        }
      }

      //删除已完成的课程
      for (let i = 0; i < completedTD.length; i++) {
        learnLessonObj.removeChild(completedTD[i]);
      }

      //更改正在学习x门课的x
      let learnMsg = document.getElementById("learn_course_msg");
      let learnCnt = Number(
        learnMsg.innerText
          .replace(" ", "") //文本比较特殊需要删除两个不同的空格
          .replace(" ", "")
          .match(/正在学习(\S*)门课程/)[1]
      );
      learnMsg.innerHTML =
        "正在学习&nbsp;<a>" +
        (learnCnt - completedTD.length + "") +
        "</a>&nbsp;门课程";

      //新增一个未结课模块
      var almostMsg = document.createElement("div");
      almostMsg.innerHTML =
        '<span id="almostMsg" style="font-size:14px;">已结课但未被教师关闭&nbsp;<a>' +
        completedTD.length +
        "</a>&nbsp;门课程</span>";
      tab3.appendChild(almostMsg);
      var Intro3 = document.createElement("div");
      Intro3.innerHTML =
        '\
<div id="pl_event_eventIntro3" class="ev_intro">\
<div class="evlist_main clearfix">\
<ul id="pl_event_eventList3" style="margin-top: 0px;">\
<table class="datalist" cellspacing="1" style="margin-left: 0px;" id="datalist3">\
<tbody id="alomostCourse">\
</tbody>\
</table>\
</ul>\
</div>\
</div>';
      tab3.appendChild(Intro3);

      //添加到新模块中
      for (let i = 0; i < completedTD.length; i++) {
        document.getElementById("alomostCourse").appendChild(completedTD[i]);
      }

      //增加3个模块之间的空隙
      let emptyTR1 = document.createElement("tr");
      emptyTR1.innerHTML =
        '<HR style="border:3 double #5DAC81" width="100%" color=#5DAC81 SIZE=3>';
      let emptyTR2 = document.createElement("tr");
      emptyTR2.innerHTML =
        '<HR style="border:3 double #33A6B8" width="100%" color=#33A6B8 SIZE=3>';
      document.getElementById("learnCourse").appendChild(emptyTR1);
      document.getElementById("closeCourse").appendChild(emptyTR2);
      document.getElementById("close_course_msg").innerHTML =
        "<br><br><br>" + document.getElementById("close_course_msg").innerHTML;
      document.getElementById("almostMsg").innerHTML =
        "<br><br><br>" + document.getElementById("almostMsg").innerHTML;
    }

    toLessons(); // 自动转向“学习的课程”页
    toRealLessons(); // 排列课程

    // 关闭每个课程的悬浮效果
    let evlist = document.getElementsByClassName("evlist_detail");
    for (let i = 0; i < evlist.length; i++) {
      evlist[i].style.display = "none";
    }

    var sch_setting = document.createElement("div");
    sch_setting.id = "sch_app";
    sch_setting.innerHTML =
      '\
    <div v-show="showSetting" style="position:absolute;left:100%;width:100%;text-align:left;background-color:rgb(18, 202, 255)">\
    <div id="list" style="margin:13px">\
      </div>\
    </div>\
    ';
    var t5 = document.createElement("li");
    t5.id = "t5";
    t5.style = "position:absolute;top:0%;right:-30%";
    t5.innerHTML =
      '<p class="p1"  style="width:48px;text-align:left;">\
    <button style="position:absolute;cursor: pointer;top:20%;font-size:14px;background-color: #51A8DD;border-color: #577C8A;" @click="toggleSetting()">设置</button>\
    </p>';
    sch_setting.appendChild(t5);
    document.getElementsByClassName("navList")[0].appendChild(sch_setting);

    // document.getElementsByClassName("c")[0].appendChild(sch_setting);

    var allLessons = getCourseList();

    // 自定义div
    var listDiv = document.getElementById("list");

    var learnList = getCourseList("learnCourse"); //正在学习列表(学者网展示的列表)
    var closeList = getCourseList("closeCourse"); //已经被关闭的列表

    // 生成列表变量
    let tempList = [];
    for (let i = 0; i < allLessons.length; i++) {
      let lesson = allLessons[i];
      if (!closeList.includes(lesson)) tempList.push(lesson);
    }

    // 生成列表视图
    genUserlist(tempList);
    function genUserlist(lessons) {
      for (let i = 0; i < lessons.length; i++) {
        let lesson = lessons[i];
        if (lesson == undefined) continue;
        listDiv.innerHTML +=
          '<input type="checkbox" v-model="list" value="' +
          lesson +
          '">' +
          '<a style="color:#6E552F;margin:5px;" href="javascript:void(0);" @click="choose(\'' +
          lesson +
          "')\">" +
          lesson +
          "</a>" +
          "<br>";
      }
    }
    // 生成操作按钮
    let actionDiv = document.createElement("div");
    actionDiv.innerHTML =
      '<button id="btnSave" @click="save()">保存</button>\
      <button id="btnCancel" @click="toggleSetting()">取消</button>';
    listDiv.appendChild(actionDiv);

    var sch = new Vue({
      el: "#sch_app",
      methods: {
        toggleSetting: function () {
          this.showSetting = !this.showSetting;
          // console.log(this.showSetting)
        },
        save: function () {
          GM_setValue("userList", this.list);
          location.reload();
        },
        choose: function (item) {
          if (this.list.includes(item)) {
            let pos = this.list.indexOf(item);
            this.list.splice(pos, 1);
          } else {
            this.list.push(item);
          }
        },
      },
      data: {
        lessons: allLessons,
        list: userList == undefined ? [] : userList,
        showSetting: false,
      },
    });
  }
  // sso综合平台
  if (
    window.location.href ==
    "https://sso.scnu.edu.cn/AccountService/user/index.html"
  ) {
    var appList = document.getElementById("oauthapp").parentNode;
    appList.style.display = "none";

    var myappList = document.getElementById("myapp").parentNode;
    myappList.style.display = "block";

    var head = document
      .getElementById("paginate-application")
      .getElementsByClassName("toc");
    head[0].classList["value"] = "toc";
    head[1].classList["value"] = "toc selected";

    document.getElementById("bannerList").remove();
  }
  // 教务系统
  if (
    window.location.href.includes(
      "https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html"
    )
  ) {
    window.location.href = "https://jwxt.scnu.edu.cn/";
  }
  // 砺儒云
  if(window.location.href.includes("https://moodle.scnu.edu.cn/")){
    let moodle_userList = GM_getValue("moodle_userList");
  // quiz
  function removeMarked() {
    // TODO 减少误删的图标文本等
    // remove all icons
    var icons = document.getElementsByClassName("icon");
    for (let i = icons.length - 1; i >= 0; i--) {
      icons[i].parentNode.removeChild(icons[i]);
    }

    // remove correct class
    var t = document.getElementsByClassName("correct");
    for (let i = t.length - 1; i >= 0; i--) {
      if (
        t[i].className.search("que multichoice deferredfeedback") == -1 &&
        t[i].className.search("que truefalse deferredfeedback") == -1 &&
        t[i].className.search("que shortanswer deferredfeedback correct") == -1
      )
        t[i].className = "r0";
    }

    // remove incorrect class
    var t2 = document.getElementsByClassName("incorrect");
    for (let i = t2.length - 1; i >= 0; i--) {
      if (
        t2[i].className.search("que multichoice deferredfeedback") == -1 &&
        t2[i].className.search("que truefalse deferredfeedback") == -1 &&
        t2[i].className.search("que shortanswer deferredfeedback incorrect") == -1
      )
        t2[i].className = "r0";
    }

    // hide right answer
    $(".outcome.clearfix").each(function () {
      $(this).children(".feedback").children(".rightanswer").css("display", "none");
      $(this).hover(
        function () {
          $(this).children(".feedback").children(".rightanswer").css("display", "block");
        },
        function () {
          $(this).children(".feedback").children(".rightanswer").css("display", "none");
        }
      );
    });

    // checkbox & text
    var input = document.getElementsByTagName("input");
    for (let i in input) {
      if (input[i].checked != undefined) input[i].checked = false;
      if (input[i].type == "text") input[i].value = "";
    }
  }

  function buildClearQuizBtn(){
    let temp = $("<li></li>")
  temp.append(
    $(
      '<a href="javascript:void(0)"">清除quiz记录</a>'
    )
  );
  temp.css("background-color", "#ff855c");
  temp.css("cursor", "pointer");
  temp.bind("click",removeMarked)
  $(".nav:eq(2)").append(temp)
  }

  // 获取总课程列表于href映射关系
  function getLessonsMap() {
    let map = {};
    $(".type_system")
      .children("ul[id^='random'][id$='_group']")
      .children("li")
      .children("p")
      .children("a")
      .each(function () {
        map[$(this)[0].title] = $(this)[0].href;
      });
    return map;
  }

  // 新建设置按钮及列表
  function build(lessonsMap) {
    let temp = $('<li id="moodle_app"></li>');

    temp.append(
      $(
        '<a id="SettingTitle" href="javascript:void(0)" @click="toggleSetting">显示课程设置</a>'
      )
    );
    temp.css("background-color", "#ff855c");
    temp.css("cursor", "pointer");
    $(".nav.college").append(temp);

    // 生成列表
    let div = $(
      '<div id="settings" v-show="showSetting" style="position:absolute;width:400px;top:105%;background-color:#323a45;z-index:999;cursor:default;"></div>'
    );
    for (let key in lessonsMap) {
      let lesson = key;
      div.append(
        $(
          '<input v-model="list" type="checkbox" style="margin:5px;" value=' +
            lesson +
            ">"
        )
      );
      div.append(
        $(
          '<a style="margin:5px;" href="javascript:void(0);" @click="choose(\'' +
            lesson +
            "')\">" +
            lesson +
            "</a>"
        )
      );

      div.append($("<br>"));
    }
    div.append($('<button @click="save()">保存</button>'));
    $("#moodle_app").append(div);
  }

  // 首页显示已选课程
  function showLessons() {
    var lessonDiv = $('<div id="home-course-list" ></div>');
    var title_h2 = $("<h2></h2>").text("已选课程");
    let map = getLessonsMap()
    lessonDiv.append(title_h2);
    lessonDiv.append('<div class="divider line-01"></div>');
    let a = $('<div class="courses frontpage-course-list-all"></div>');
    let b = $('<div class="row-fluid"></div>');
    a.append(b);
    lessonDiv.append(a);
    $("#page").prepend(lessonDiv);
    let clearfix = $('<div class="clearfix hidexs"></div>');
    if (moodle_userList != undefined)
      for (let i = 0; i < moodle_userList.length; i++) {
        console.log(map["软件测试"])
        let lessonHtml =
          '<div class="image-box span3">' +
          '<a class="course-box" href="' +
          map[moodle_userList[i]]+
          '">' +
          '<div class="img-inner">' +
          '<img src="https://moodle.scnu.edu.cn/theme/image.php/lambda/theme/1613040290/noimage/default03" ' +
          'class="img-responsive" width="100%" alt=' +
          moodle_userList[i] +
          "</div></div>" +
          '<div class="image-box-content">'+
          '<div class="course-detail">'+
          '<h5 style="overflow: visible;">' +
          moodle_userList[i] +
          "</h5></div></div>" ;
        b.append($(lessonHtml));
        if (i % 4 == 3) b.append($(clearfix));
      }
  }

  // Main
  build(getLessonsMap());
  if(window.location.href == "https://moodle.scnu.edu.cn/")
    showLessons();
  if(window.location.href.includes("https://moodle.scnu.edu.cn/mod/quiz/review.php"))
    buildClearQuizBtn();
  $("#camera_wrap").remove(); // 去除公告栏

  var moodle = new Vue({
    el: "#moodle_app",
    methods: {
      toggleSetting: function () {
        this.showSetting = !this.showSetting;
        console.log(this.showSetting);
      },
      save: function () {
        GM_setValue("moodle_userList", this.list);
        location.reload();
      },
      choose: function (item) {
        if (this.list.includes(item)) {
          let pos = this.list.indexOf(item);
          this.list.splice(pos, 1);
        } else {
          this.list.push(item);
        }
        console.log(this.list);
      },
      getMap : function(){
        return map;
      }
    },
    data: {
      map: getLessonsMap(),
      list: moodle_userList == undefined ? [] : moodle_userList,
      showSetting: false,
    },
  });
  }
})();