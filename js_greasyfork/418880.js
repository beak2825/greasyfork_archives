// ==UserScript==
// @name          SWUST 抢课+
// @author	      lengthmin & Paranoid_AF
// @namespace     dean.swust.Qiangke
// @version  	  1.0
// @description   自动抢课
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @include https://matrix.dean.swust.edu.cn/acadmicManager/index.cfm?event=chooseCourse:*
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/418880/SWUST%20%E6%8A%A2%E8%AF%BE%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/418880/SWUST%20%E6%8A%A2%E8%AF%BE%2B.meta.js
// ==/UserScript==

function parseSearch() {
  var parms = {};
  //把location.search解析成对象parms
  var query = location.search.substring(1).split("&");
  for (var i = 0; i < query.length; i++) {
    var pos = query[i].split("=");
    if (pos[0]) {
      parms[pos[0]] = pos[1] ? pos[1] : "";
    }
  }
  return parms;
}

var storageKey = "SWUST.Paranoid_AF.CourseList";
var logKey = "SWUST.Paranoid_AF.ShowLog";
var scriptName = "SWUST抢课+";

var subjectInfo = [];

var currentPage = {
  DEFAULT_EVENT: "开始选课",
  fixupTask: "补修",
  programTask: "计划课程",
  commonTask: "全校通选课",
  retakeTask: "重修",
  sportTask: "体育",
  NON_COURSE_PICK: "非选课",
};

var setting = {
  // 给查看每节课详细信息一点缓冲时间
  wait: 100,
  // 抢课刷新间隔
  timeout: 500,
  // 当前抢了多少次
  count: 0,
};

$(document).ready(function () {
  var params = parseSearch();
  var event = params["event"];
  let page_;
  if (event.startsWith("chooseCourse:")) {
    page_ = event.replace("chooseCourse:", "");
    if (page_ === "chargeByTerm" || page_ === "courseTable") {
      page_ = "NON_COURSE_PICK";
    }
  } else {
    page_ = "NON_COURSE_PICK";
  }

  setting.div = $(
    `<div style=" width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(255, 255, 255, 0.6); overflow-x: auto;">
        <span style="font-size: medium;"></span>
        <div style="font-size: medium;">${currentPage[page_]}页面</div>
        ${
          page_ === "DEFAULT_EVENT" || page_ === "NON_COURSE_PICK"
            ? ``
            : `
        <button style="margin-right: 10px; font-weight: 800; color: #0078D7; font-size: 16px;" id="startQK">开始选课</button>
            `
        }
        <button style="margin-right: 10px; cursor: pointer; color: #0078D7;" id="newCourse">
          添加课程
        </button>
        <div style="max-height: 300px; overflow-y: auto;">
          抢课列表：
          <table border="1" style="font-size: 12px;">
            <thead>
              <tr>
                <th style="min-width: 100px;">课程</th>
                <th style="min-width: 60px;">教师</th>
                <th style="min-width: 60px;">时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
      <div id="logWindow" style="bottom: calc(25px - 40vh);transition: bottom 1s;width: 330px; position: fixed; left: 0; z-index: 99999; background-color: #1f4359; overflow-x: auto; height: 40vh;">
        <div style="font-size: medium; color: #fff;">
          <span style="float:left">输出窗口</span>
          <span id="logSwitch" style="float:right;cursor: pointer; user-select: none;"></span>
          <div id="logContent" style="left: calc((100% - 97%) / 2); bottom: 0; width: 97%; position: absolute; background-color: #fff; height: calc(40vh - 25px); color: #000; overflow-y: scroll; font-size: 12px;">
          </div>
        </div>
      </div>
      `
  ).appendTo("body");
  refreshList();
  refreshLogPos();
  $("#newCourse").click((e) => {
    let result = inputCourse();
    if (result !== null) {
      addCourse(result);
      refreshList();
    }
  });
  $("#logSwitch").click((e) => {
    let logEnabled = GM_getValue(logKey, true);
    GM_setValue(logKey, !logEnabled);
    refreshLogPos();
  });
  $("#startQK").click(() => {
    if (subjectInfo.length == 0) {
      pushLog("没有添加课！", 2);
      return;
    }
    if (setting.loop) {
      clearInterval(setting.loop);
      delete setting.loop;
      $("#startQK")[0].innerText = "继续抢课";
    } else {
      $("#startQK")[0].innerText = "暂停抢课";
      setting.loop = setInterval(findClass, setting.timeout);
    }
  });
  GM_addValueChangeListener(
    storageKey,
    (name, old_value, new_value, remote) => {
      if (new_value !== subjectInfo) {
        refreshList();
      }
    }
  );
  pushLog(`${scriptName} 已初始化完毕`, 3);
});

function pushLog(info, type = 0) {
  let text = "信息";
  switch (type) {
    case 0:
      text = "信息";
      break;
    case 1:
      text = "警告";
      break;
    case 2:
      text = "错误";
      break;
    case 3:
      text = "成功";
      break;
    default:
  }
  let date = new Date();
  $("#logContent").append(
    `<p>[${text}] ${date.toLocaleTimeString("zh", {
      hour12: false,
    })} - ${info}</p>`
  );
  $("#logContent").scrollTop($("#logContent")[0].scrollHeight);
}

function refreshLogPos() {
  let logEnabled = GM_getValue(logKey, true);
  if (logEnabled) {
    $("#logSwitch").html("👇收起&nbsp;");
    $("#logWindow").css("bottom", "0");
  } else {
    $("#logSwitch").html("👆展开&nbsp;");
    $("#logWindow").css("bottom", "calc(25px - 40vh)");
  }
}

function refreshList() {
  let subjectInfo = GM_getValue(storageKey, []);
  setting.div.find("tbody").html(`
      <tr>
      <td colspan="2" style="display: none;"></td>
      </tr>
  `);
  subjectInfo.map((value, index) => {
    setting.div.find("tbody").append(
      `
      <tr index="${index}">
        <td>
        ${value.subjectName}
        </td>
        <td>
        ${value.teacherName}
        </td>
        <td>
        ${value.time}
        </td>
        <td>
          <button style="margin-top: -2px; color: #0078D7; font-size: 11.5px; cursor: pointer;" class="editCourse">编辑</button>
          <button style="margin-top: -2px; color: #0078D7; font-size: 11.5px;cursor: pointer;" class="delCourse">移除</button>
        </td>
      </tr>`
    );
  });

  $(".delCourse").on("click", (e) => {
    let targetIndex = Number(
      e.currentTarget.parentElement.parentElement.attributes.index.value
    );
    if (confirm("确认删除吗?")) {
      delCourse(targetIndex);
    }
    refreshList();
  });

  $(".editCourse").on("click", (e) => {
    let targetIndex = Number(
      e.currentTarget.parentElement.parentElement.attributes.index.value
    );
    let result = inputCourse({
      course: subjectInfo[targetIndex].subjectName,
      teacher: subjectInfo[targetIndex].teacherName,
      time: subjectInfo[targetIndex].time,
    });
    if (result !== null) {
      editCourse(targetIndex, result);
      refreshList();
    }
  });
}

function addCourse(info) {
  subjectInfo.push({
    subjectName: info.course, // 要抢的科目名字
    teacherName: info.teacher, // 要抢的科目教师
    time: info.time,
  });
  GM_setValue(storageKey, subjectInfo);
}

function editCourse(index, info) {
  subjectInfo[index] = {
    subjectName: info.course, // 要抢的科目名字
    teacherName: info.teacher, // 要抢的科目教师
    time: info.time,
  };
  GM_setValue(storageKey, subjectInfo);
}

function delCourse(index) {
  subjectInfo.splice(index, 1);
  GM_setValue(storageKey, subjectInfo);
}

function inputCourse(defaultInfo = { course: "", teacher: ".*", time: ".*" }) {
  let result = {};
  let course = prompt(
    "输入课程名称(支持正则表达式)\n可以少写，但不要写错",
    defaultInfo.course
  );
  if (course !== null) {
    if (course === "") {
      alert("课程名称不能为空!");
      return null;
    } else {
      result.course = course;
    }
  } else {
    return null;
  }
  let teacher = prompt(
    "输入教师名称(支持正则表达式)\n.* 为任意。\n可以少写，但不要写错",
    defaultInfo.teacher
  );
  if (teacher !== null) {
    if (teacher === "") {
      alert("教师名称不能为空!");
      return null;
    } else {
      result.teacher = teacher;
    }
  } else {
    return null;
  }
  let time = prompt(
    `输入匹配的时间(支持正则表达式)\n如 ^((?!第一讲).)+$ 就是不匹配带有第一讲的\n可以少写，但不要写错`,
    defaultInfo.time
  );
  if (time !== null) {
    if (time === "") {
      alert("时间不能为空!");
      return null;
    } else {
      result.time = time;
    }
  } else {
    return null;
  }
  return result;
}

function findClass() {
  for (let k = 0; k < subjectInfo.length; k++) {
    // 从选课首页点进教师详情那一页
    $("div.courseShow.clearfix span.name").each(function () {
      let subjectNameRegex = new RegExp(subjectInfo[k].subjectName, "iu");
      let currsubjectName = $(this).text();
      if (currsubjectName.match(subjectNameRegex)) {
        pushLog("已找到" + subjectInfo[k].subjectName, 0);
        // 进入选课详情
        $(this).parent().find("a.trigger[cid]")[0].click();
      }
    });
    var flag = false;
    var empty_flag = true;
    // 遍历详情页
    setTimeout(() => {
      pushLog(
        "对“" +
          subjectInfo[k].subjectName +
          "”开始查询，第" +
          setting.count +
          "次",
        0
      );
      setting.count++;
      // 获取当前课的所有可选课程
      for (var i = 0; i < $("a.stat.off").length; i++) {
        empty_flag = false;
        var $this = $("a.stat.off").eq(i);
        var $parents = $this.parents("tr.editRows");
        // 获取可选课程的老师上课时间地点等信息
        for (var j = 0; j < $parents.length; j++) {
          setting.time = $parents.eq(j).children().eq(8).text();
          pushLog("上课时间:" + setting.time, 0);
          setting.location = $parents.eq(j).children().eq(9).text();
          pushLog("上课地点:" + setting.location, 0);
          setting.teacher = $parents.eq(j).children().eq(2).text();
          pushLog("上课老师:" + setting.teacher, 0);
          let teacherNameRegex = new RegExp(subjectInfo[k].teacherName, "iu");
          let timeRegex = new RegExp(subjectInfo[k].time, "iu");

          if (
            setting.teacher.match(teacherNameRegex) &&
            setting.time.match(timeRegex)
          ) {
            // 选课
            eval($this.attr("href"));
            pushLog("完成对课程“" + subjectInfo[k].subjectName + "”的选课", 3);
            delCourse(k);
            if (subjectInfo.length === 0) {
              clearInterval(setting.loop);
              delete setting.loop;
              $("#startQK")[0].innerText = "开始抢课";
            }
          } else {
            pushLog("目标课暂无满足要求的席位，重试中", 0);
            // 返回课程列表
            $("a.trigger.open")[0].click();
          }
        }
      }
      if (empty_flag) {
        pushLog("课程“" + subjectInfo[k].subjectName + "”暂无空课，重试中", 0);
      }
    }, setting.wait);
    // 没找到就返回刷新
  }
}
