// ==UserScript==
// @name         马院在线练习系统解除次数限制
// @namespace    https://github.com/yutian0525
// @version      20240618
// @description  解除马院在线练习系统次数限制
// @author       倪镭 冯国昊
// @match        http://222.73.57.149:6571/file/student/html/practiceSubject.html
// @match        http://222.73.57.149:6571/file/student/html/practiceChapter.html
// @match        http://222.73.57.153:6571/file/student/html/practiceSubject.html
// @match        http://222.73.57.153:6571/file/student/html/practiceChapter.html
// @match        http://222.73.57.149:6571/file/student/html/practiceLogin.html?id=1705139277953761280
// @match        http://222.73.57.153:6571/file/student/html/practiceLogin.html?id=1705139277953761280
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496421/%E9%A9%AC%E9%99%A2%E5%9C%A8%E7%BA%BF%E7%BB%83%E4%B9%A0%E7%B3%BB%E7%BB%9F%E8%A7%A3%E9%99%A4%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/496421/%E9%A9%AC%E9%99%A2%E5%9C%A8%E7%BA%BF%E7%BB%83%E4%B9%A0%E7%B3%BB%E7%BB%9F%E8%A7%A3%E9%99%A4%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
function getData() {
    var currentDomain = window.location.pathname;
    if(currentDomain == "/file/student/html/practiceSubject.html"){
        reqlist();
    }
    if(currentDomain == "/file/student/html/practiceChapter.html"){
        getSingleData();
    }
    
}
function saveQues() {
    var currentDomain = window.location.pathname;
    if(currentDomain == "/file/student/html/practiceSubject.html"){
        save();
    }
    if(currentDomain == "/file/student/html/practiceChapter.html"){
        saveSingleQues();
    }
    
}
function getSingleData() {
    var info = JSON.parse(localStorage.getItem("practice_userInfo"));
    var params = {
        subjectId: info.subjectId,
        chapterId: info.chapterId,
        branchId: info.branchId,
        studentId: info.id,
    };
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = 6571
    var baseUrl = protocol + "//" + hostname + ":" + port
    var fullUrl = baseUrl + "/examinationInfo/getPracticeInfo"
    $(".loadingMark").fadeIn();
    $.ajax({
        type: "post",
        url: fullUrl,
        dataType: "json",
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(params),
        success: function (res) {
            $(".loadingMark").fadeOut();
            if (parseInt(res.code) != 200) {
                alert(res.msg);
                return;
            }
            $(".nextBtn").css("display", "none");
            $(".backBtn").css("display", "none");
            $(".againBtn").css("display", "none");
            $(".saveBtn").css("display", "none");
            data = res.data.topicInfo;
            data.title = data.topicContent;
            data.options = data.topicSelect;
            data.standardAnswer = data.yesAnswer;
            updateExamData();
        },
        error: function (err) {
            $(".loadingMark").fadeOut();
        },
    });
}
function reqlist() {
    var info = JSON.parse(localStorage.getItem("practice_userInfo"));
    var params = {
        subjectId: info.subjectId,
        chapterId: info.chapterId,
        branchId: info.branchId,
        studentId: info.id,
    };
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = 6571
    var baseUrl = protocol + "//" + hostname + ":" + port
    var fullUrl = baseUrl + "/examinationInfo/getPracticeInfo"
    $(".loadingMark").fadeIn();
    $.ajax({
        type: "post",
        url: fullUrl,
        dataType: "json",
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(params),
        success: function (res) {
            $(".loadingMark").fadeOut();
            if (parseInt(res.code) != 200) {
                alert(res.msg);
                return;
            }
            $(".nextBtn").css("display", "none");
            $(".backBtn").css("display", "none");
            $(".score").css("display", "none");
            hasCommit = false;
            $(".saveBtn").css("display", "block");
            data = JSON.parse(res.data.paperStore.paperContent);
            updatePracticeData();
        }
    });
}
function saveSingleQues() {
    if (!data) {
        return;
    }
    let tip = [];
    if (!data.answer) {
        alert("请先答题");
        return;
    }
    hasCommit = false;
    $(".nextBtn").css("display", "none");
    $(".backBtn").css("display", "none");
    loadChapterQuestion();
    if (data.answer === data.standardAnswer) {

        $(".saveBtn").css("display", "none");
        $(".againBtn").css("display", "none");
        alert("回答正确")
        getData()
    } else {
        alert("回答错误")
    }
}
function save() {
    if (!data) {
      return;
    }
    let tip = "";
    for (var i = 0; i < data.danxuan.children.length; i++) {
      let item = data.danxuan.children[i];
      if (!item.answer) {
        tip = tip + "单选题";
        break;
      }
    }
    for (var i = 0; i < data.duoxuan.children.length; i++) {
      let item = data.duoxuan.children[i];
      if (!item.answer) {
        tip = tip + "多选题";
        break;
      }
    }
    for (var i = 0; i < data.panduan.children.length; i++) {
      let item = data.panduan.children[i];
      if (!item.answer) {
        tip = tip + "判断题";
        break;
      }
    }
    for (var i = 0; i < data.tiankong.children.length; i++) {
      let item = data.tiankong.children[i];
      if (!item.answer) {
        tip = tip + "填空题";
        break;
      }
    }
    if (tip) {
      tip = tip + "有未回答的，";
    }
    tip = tip + "是否确定提交";
  
    var result = confirm(tip);
    if (result) {
      hasCommit = true;
      $(".nextBtn").css("display", "none");
      $(".saveBtn").css("display", "none");
      loadPractice();
    }
  }
function thelogin() {
    var studentCode = $("input[name=studentCode]").val();
    var password = $("input[name=studentPassword]").val();
    var subject = $("#subject").val();
    var chapter = $("#chapter").val();
    if (!studentCode) {
        alert("请输入学号");
        return;
    }
    if (!password) {
        alert("请输入密码");
        return;
    }

    if (!subject) {
        alert("请选择练习科目");
        return;
    }

    var practiceType = "";
    if (chapter) {
        practiceType = "2";
    } else {
        practiceType = "1";
    }

    var params = {
        branchId: branchId,
        studentNum: studentCode,
        practiceType: practiceType,
        password: password,
    };
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = 6571
    var baseUrl = protocol + "//" + hostname + ":" + port
    var fullUrl = baseUrl + "/login/practiceLogin"
    $(".loadingMark").fadeIn();
    $.ajax({
        type: "post",
        url: fullUrl,
        dataType: "json",
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(params),
        success: function (res) {
            $(".loadingMark").fadeOut();
            if (parseInt(res.code) != 200) {
                alert(res.msg);
                return;
            }
            var subjectName = "";
            var chapterName = "";
            for (var i = 0; i < subjectList.length; i++) {
                var subjectItem = subjectList[i];
                if (subjectItem.value === subject) {
                    subjectName = subjectItem.label;
                }
            }
            for (var i = 0; i < chapterList.length; i++) {
                var chapterItem = chapterList[i];
                if (chapterItem.value === chapter) {
                    chapterName = chapterItem.label;
                }
            }

            var practice_userInfo = res.data.studentInfo;
            practice_userInfo.subjectName = subjectName;
            practice_userInfo.chapterName = chapterName;
            practice_userInfo.subjectId = subject;
            practice_userInfo.chapterId = chapter;
            practice_userInfo.branchId = branchId;
            localStorage.setItem(
                "practice_userInfo",
                JSON.stringify(practice_userInfo)
            );

            if (practiceType == 1) {
                window.location.href = "practiceSubject.html";
            } else {
                window.location.href = "practiceChapter.html";
            }
        },
        error: function (err) {
            $(".loadingMark").fadeOut();
        },
    });
}

    // 创建浮动按钮
    var floatButton = document.createElement('button');
    floatButton.style.position = 'fixed'; // 固定位置
    floatButton.style.top = '20px'; // 距离底部20px
    floatButton.style.left = '20px'; // 距离右侧20px
    floatButton.style.zIndex = 9999; // 确保按钮在最上层
    floatButton.style.backgroundColor = '#4CAF50'; // 设置背景色
    floatButton.style.color = 'white'; // 文字颜色
    floatButton.style.padding = '10px 20px'; // 内边距
    floatButton.style.border = 'none'; // 无边框
    floatButton.style.cursor = 'pointer'; // 鼠标悬停时指针形状
    floatButton.textContent = '获取题目'; // 按钮文字


    var floatButton2 = document.createElement('button');
    floatButton2.style.position = 'fixed'; // 固定位置
    floatButton2.style.top = '60px'; // 距离底部20px
    floatButton2.style.left = '20px'; // 距离右侧20px
    floatButton2.style.zIndex = 9999; // 确保按钮在最上层
    floatButton2.style.backgroundColor = '#4CAF50'; // 设置背景色
    floatButton2.style.color = 'white'; // 文字颜色
    floatButton2.style.padding = '10px 20px'; // 内边距
    floatButton2.style.border = 'none'; // 无边框
    floatButton2.style.cursor = 'pointer'; // 鼠标悬停时指针形状
    floatButton2.textContent = '查看解析'; // 按钮文字

var floatButton3 = document.createElement('button');
    floatButton3.style.position = 'fixed'; // 固定位置
    floatButton3.style.top = '100px'; // 距离底部20px
    floatButton3.style.left = '20px'; // 距离右侧20px
    floatButton3.style.zIndex = 9999; // 确保按钮在最上层
    floatButton3.style.backgroundColor = '#4CAF50'; // 设置背景色
    floatButton3.style.color = 'white'; // 文字颜色
    floatButton3.style.padding = '10px 20px'; // 内边距
    floatButton3.style.border = 'none'; // 无边框
    floatButton3.style.cursor = 'pointer'; // 鼠标悬停时指针形状
    floatButton3.textContent = '强制登录'; // 按钮文字

    // 绑定点击事件// 绑定点击事件
    floatButton.onclick = function() {
        getData();
    };
    floatButton2.onclick = function() {
        saveQues();
    };
floatButton3.onclick = function() {
        thelogin();
    };

    // 将按钮添加到页面
    var currentDomain = window.location.pathname;
    if (currentDomain == "/file/student/html/practiceLogin.html"){
        document.body.appendChild(floatButton3);
    }
    else{
        document.body.appendChild(floatButton);
        document.body.appendChild(floatButton2);
    }
    

})();