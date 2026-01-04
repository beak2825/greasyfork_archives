// ==UserScript==
// @name         研学通(师学宝)学习助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动测评,选课,打开学习页面
// @author       Yonghui
// @match        http://*.study.teacheredu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447420/%E7%A0%94%E5%AD%A6%E9%80%9A%28%E5%B8%88%E5%AD%A6%E5%AE%9D%29%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447420/%E7%A0%94%E5%AD%A6%E9%80%9A%28%E5%B8%88%E5%AD%A6%E5%AE%9D%29%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
let pojiexianshi = 1;
$(function () {
    var t= setInterval(function(){
        if($("#zonggong").text().replace('分钟','') >=0){
            pojietime();
            var exitAlert = 1
        }
        if($("#zonggong").text().replace('分钟','')>90){
            updateStudyTime(0);
            var exitAlert = 1
            window.open('http://cas.study.teacheredu.cn/proj/studentwork/course_list_new.htm?ptcode=34101','_blank')
            window.close();
            /*
        setTimeout(function(){
            //window.location.reload();
            autoxuexi();
        },3000)*/
}},5000)
});

function pojietime(t) {
   if(pojiexianshi == 1){
    var tishiBar = document.getElementById("benci").parentNode;
    var pjscript = document.createElement("script");
    var scriptText = document.createTextNode(
    'function openTishi(minute,second){\n'+
    '    if(minute==randomTime)\n'+
    '    {\n'+
    '        if(second == "0")\n'+
    '        {\n'+
    '            var tishiTime=document.form2.thzt.value;\n'+
    '            updateStudyTime(0);\n'+
    '            setRandomTipTime();\n'+
    '        }\n'+
    '    }\n'+
    '}\n'+

    'function openTishi(second){\n'+
    '    if(second==randomTime)\n'+
    '    {\n'+
    '        var tishiTime=document.form2.thzt.value;\n'+
    '        updateStudyTime(0);\n'+
    '        setRandomTipTime();\n'+
    '    }\n'+
    '}\n');
    pjscript.appendChild(scriptText);
    tishiBar.appendChild(pjscript);
    var childText = document.createTextNode("破解成功");
    tishiBar.appendChild(childText);
       pojiexianshi++;
   }
}
function xuexi() {
  window.alert = function (param) {
    console.log("alert", param);
  };

  var hre = location.href;
  if (hre.endsWith("index.html")) {
    let i0 = setInterval(() => {
      let dom = document.querySelector("#iframepage").contentWindow.document;
      if (dom.querySelector("#login_pass")) {
        clearInterval(i0);
        dom.querySelector("#login_pass").value = "123123";
      }
    }, 300);
  }

  if ($('[onclick="goTestOne()"]:contains("去评测"):visible')[0]) {
    $('[onclick="goTestOne()"]:contains("去评测")')[0].click();
  }

  if (hre == "http://cas.study.teacheredu.cn/proj/studentwork/index_new.htm?autoChangeRole=1") {
    let t0 = setInterval(() => {
      if ($('a:contains("去发布")')[0]) {
        clearInterval(t0);
        let a = $('a:contains("去发布")');
        console.log(a.length);
        $.map(a, function (elem, indexOrKey) {
          window.open(elem.href, "_blank");
        });
      }
    }, 200);
  }
autoxuexi()
function autoxuexi(){
  if (
    document.querySelector(".current_Position .last") &&
    document.querySelector(".current_Position .last").innerText == "课程学习"
  ) {
    let t0 = setInterval(() => {
      // document.querySelector("#button_content1 > div.fanye > span").innerText == "共 0 条记录";
      if (document.querySelector("#button_content1 > div.fanye > span")) {
        clearInterval(t0);
        //如果有去学习
        if (document.querySelector('[onclick^="goStudy"]')) {
            //------------------检测已学习时长————————
          var yixue=$(".xk_rs.clear").children("span").length
          for(var i=0;i<yixue;i++){
              var yixuenum=$(".xk_rs.clear").children("span")[i].innerText
              var num=yixuenum.replace("已学习 ","")
              var num=num.replace(" 分钟","")
              if(num < 90) {
                  $('.qxx[onclick^="goStudy"]')[i].click()
                   window.close();
                  break;
              }
          }
            //------------------————————
        } else {
          document.querySelector(".mian_title1.clear a").click();
        }
      }
    }, 500);
  }
}
  if (
    document.querySelector(".current_Position .last") &&
    document.querySelector(".current_Position .last").innerText == "课程选择" &&
    !hre.includes("msg=%E9%80%89%E8%AF%BE%E6%88%90%E5%8A%9F")
  ) {
    if ($('a:contains("取消选课")')[0]) {
      $('a:contains("课程学习")')[0].click();
    } else {
      let t0 = setInterval(() => {
        if (document.querySelector("#addAll")) {
          clearInterval(t0);
          document.querySelector("#addAll").click();
          setTimeout(() => {
            document.querySelector('[onclick="joinAll();"]').click();
            setTimeout(() => {
              document.querySelector('[onclick="showBXK()"]').click();
              setTimeout(() => {
                document.querySelector('[onclick^="sub"]').click();
              }, 1500);
            }, 1500);
          }, 1500);
        }
      }, 1000);
    }
  }

  if (hre.includes("msg=%E9%80%89%E8%AF%BE%E6%88%90%E5%8A%9F")) {
    $('a:contains("课程学习")')[0].click();
  }

  if (hre.includes("http://cas.study.teacheredu.cn/proj/studentwork/study.htm?courseId=")) {
    setInterval(() => {
      let v = $("video");
      if (v) {
        v.play();
        console.log("1");
      }
    }, 2000);
  }

  if (hre.includes("http://cas.study.teacheredu.cn/proj/studentwork/evaluation/TestResult?")) {
    $('a:contains("课程学习")')[0].click();
  }
}

var oldonload = window.onload;
if (typeof window.onload != "function") {
  window.onload = xuexi;
} else {
  window.onload = function () {
    oldonload();
    xuexi();
      console.log("1");
  };
}

(function () {
  let hre = location.href;
  if (hre.includes("http://cas.study.teacheredu.cn/ev/studentEv.html")) {
    let t0 = setInterval(() => {
      if ($('.box:contains("一般") input')[0]) {
        clearInterval(t0);
        let chos = $('.box:contains("一般") input');
        $.map(chos, function (elem, indexOrKey) {
          elem.click();
        });
        document.querySelector('[onclick="sureSub()"]').click();
      }
    }, 500);
  }
})();
