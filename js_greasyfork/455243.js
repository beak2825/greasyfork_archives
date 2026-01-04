// ==UserScript==
// @name         湖南人才市场公共教育网
// @namespace    咀嚼 代刷+V{lly6655}
// @version      9.8
// @description  自动切换课程、答题 代刷+V{lly6655}
// @author       You
// @match        https://ua.peixunyun.cn/*
// @match        https://www.hnpxw.org/*
// @match        https://admin.hnpxw.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455243/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/455243/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91.meta.js
// ==/UserScript==
(function () {
let t0 = setInterval(() => {
let hre = location.href
//答题脚本
if (hre.includes("https://www.hnpxw.org/shop/list")){window.location.replace('https://www.hnpxw.org/userStudy')}
if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=123")){
document.querySelectorAll("#answer_11305")[3].click()
document.querySelectorAll("#answer_11304")[1].click()
document.querySelectorAll("#answer_11310")[1].click()
document.querySelectorAll("#answer_11311")[1].click()
document.querySelectorAll("#answer_11312")[3].click()
document.querySelectorAll("#answer_11211")[0].click()
document.querySelectorAll("#answer_11210")[3].click()
document.querySelectorAll("#answer_11209")[2].click()
document.querySelectorAll("#answer_11207")[1].click()
document.querySelectorAll("#answer_11206")[3].click()
document.querySelectorAll("#answer_11205")[3].click()
document.querySelectorAll("#answer_11204")[3].click()
document.querySelectorAll("#answer_11303")[2].click()
document.querySelectorAll("#answer_11302")[0].click()
document.querySelectorAll("#answer_11301")[1].click()
document.querySelectorAll("#answer_11306")[2].click()
document.querySelectorAll("#answer_11307")[1].click()
document.querySelectorAll("#answer_11212")[3].click()
document.querySelectorAll("#answer_11308")[1].click()
document.querySelectorAll("#answer_11309")[3].click()
document.querySelectorAll("#answer_11145")[0].click()
document.querySelectorAll("#answer_11146")[1].click()
document.querySelectorAll("#answer_11167")[1].click()
document.querySelectorAll("#answer_11168")[0].click()
document.querySelectorAll("#answer_11169")[0].click()
document.querySelectorAll("#answer_11170")[0].click()
document.querySelectorAll("#answer_11171")[1].click()
document.querySelectorAll("#answer_11177")[1].click()
document.querySelectorAll("#answer_11178")[0].click()
document.querySelectorAll("#answer_11147")[0].click()
document.querySelectorAll("#answer_11148")[1].click()
document.querySelectorAll("#answer_11149")[0].click()
document.querySelectorAll("#answer_11164")[0].click()
document.querySelectorAll("#answer_11165")[0].click()
document.querySelectorAll("#answer_11166")[1].click()
document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
}

if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=120")){
document.querySelector("#part_518 > div:nth-child(4) > p:nth-child(3) > span:nth-child(1) > #answer_11024").click()
document.querySelector("#part_518 > div:nth-child(6) > p:nth-child(2) > span:nth-child(1) > #answer_11025").click()
document.querySelector("#part_518 > div:nth-child(8) > p:nth-child(4) > span:nth-child(1) > #answer_11034").click()
document.querySelector("#part_518 > div:nth-child(10) > p:nth-child(3) > span:nth-child(1)> #answer_11035").click()
document.querySelector("#part_518 > div:nth-child(12) > p:nth-child(2) > span:nth-child(1)> #answer_11036").click()
document.querySelector("#part_518 > div:nth-child(14) > p:nth-child(3) > span:nth-child(1)> #answer_11037").click()
document.querySelector("#part_518 > div:nth-child(16) > p:nth-child(4) > span:nth-child(1)> #answer_11038").click()
document.querySelector("#part_518 > div:nth-child(18) > p:nth-child(4) > span:nth-child(1)> #answer_11039").click()
document.querySelector("#part_518 > div:nth-child(20) > p:nth-child(3) > span:nth-child(1)> #answer_11040").click()
document.querySelector("#part_518 > div:nth-child(22) > p:nth-child(2) > span:nth-child(1)> #answer_11041").click()
document.querySelector("#part_518 > div:nth-child(24) > p:nth-child(2) > span:nth-child(1)> #answer_11042").click()
document.querySelector("#part_518 > div:nth-child(26) > p:nth-child(2) > span:nth-child(1)> #answer_11043").click()
document.querySelector("#part_518 > div:nth-child(28) > p:nth-child(3) > span:nth-child(1)> #answer_11026").click()
document.querySelector("#part_518 > div:nth-child(30) > p:nth-child(3) > span:nth-child(1)> #answer_11044").click()
document.querySelector("#part_518 > div:nth-child(32) > p:nth-child(2) > span:nth-child(1)> #answer_11045").click()
document.querySelector("#part_518 > div:nth-child(34) > p:nth-child(2) > span:nth-child(1)> #answer_11046").click()
document.querySelector("#part_518 > div:nth-child(36) > p:nth-child(1) > span:nth-child(1)> #answer_11047").click()
document.querySelector("#part_518 > div:nth-child(38) > p:nth-child(4) > span:nth-child(1)> #answer_11048").click()
document.querySelector("#part_518 > div:nth-child(40) > p:nth-child(4) > span:nth-child(1)> #answer_11049").click()
document.querySelector("#part_518 > div:nth-child(42) > p:nth-child(4) > span:nth-child(1)> #answer_11050").click()
document.querySelector("#part_518 > div:nth-child(44) > p:nth-child(3) > span:nth-child(1)> #answer_11051").click()
document.querySelector("#part_518 > div:nth-child(46) > p:nth-child(2) > span:nth-child(1)> #answer_11052").click()
document.querySelector("#part_518 > div:nth-child(48) > p:nth-child(4) > span:nth-child(1)> #answer_11053").click()
document.querySelector("#part_518 > div:nth-child(50) > p:nth-child(4) > span:nth-child(1)> #answer_11027").click()
document.querySelector("#part_518 > div:nth-child(52) > p:nth-child(3) > span:nth-child(1)> #answer_11028").click()
document.querySelector("#part_518 > div:nth-child(54) > p:nth-child(2) > span:nth-child(1)> #answer_11029").click()
document.querySelector("#part_518 > div:nth-child(56) > p:nth-child(2) > span:nth-child(1)> #answer_11030").click()
document.querySelector("#part_518 > div:nth-child(58) > p:nth-child(2) > span:nth-child(1)> #answer_11031").click()
document.querySelector("#part_518 > div:nth-child(60) > p:nth-child(3) > span:nth-child(1)> #answer_11032").click()
document.querySelector("#part_518 > div:nth-child(62) > p:nth-child(2) > span:nth-child(1)> #answer_11033").click()
document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
}

if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=124")){
document.querySelector("#part_539 > div:nth-child(4) > p:nth-child(2) > span:nth-child(1)> #answer_11348").click()
document.querySelector("#part_539 > div:nth-child(6) > p:nth-child(2) > span:nth-child(1)> #answer_11347").click()
document.querySelector("#part_539 > div:nth-child(8) > p:nth-child(4) > span:nth-child(1)> #answer_11338").click()
document.querySelector("#part_539 > div:nth-child(10) > p:nth-child(2) > span:nth-child(1)> #answer_11337").click()
document.querySelector("#part_539 > div:nth-child(12) > p:nth-child(2) > span:nth-child(1)> #answer_11336").click()
document.querySelector("#part_539 > div:nth-child(14) > p:nth-child(3) > span:nth-child(1)> #answer_11335").click()
document.querySelector("#part_539 > div:nth-child(16) > p:nth-child(4) > span:nth-child(1)> #answer_11334").click()
document.querySelector("#part_539 > div:nth-child(18) > p:nth-child(3) > span:nth-child(1)> #answer_11333").click()
document.querySelector("#part_539 > div:nth-child(20) > p:nth-child(2) > span:nth-child(1)> #answer_11332").click()
document.querySelector("#part_539 > div:nth-child(22) > p:nth-child(2) > span:nth-child(1)> #answer_11331").click()
document.querySelector("#part_539 > div:nth-child(24) > p:nth-child(3) > span:nth-child(1)> #answer_11330").click()
document.querySelector("#part_539 > div:nth-child(26) > p:nth-child(4) > span:nth-child(1)> #answer_11329").click()
document.querySelector("#part_539 > div:nth-child(28) > p:nth-child(1) > span:nth-child(1)> #answer_11346").click()
document.querySelector("#part_539 > div:nth-child(30) > p:nth-child(3) > span:nth-child(1)> #answer_11345").click()
document.querySelector("#part_539 > div:nth-child(32) > p:nth-child(3) > span:nth-child(1)> #answer_11344").click()
document.querySelector("#part_539 > div:nth-child(34) > p:nth-child(2) > span:nth-child(1)> #answer_11343").click()
document.querySelector("#part_539 > div:nth-child(36) > p:nth-child(2) > span:nth-child(1)> #answer_11342").click()
document.querySelector("#part_539 > div:nth-child(38) > p:nth-child(3) > span:nth-child(1)> #answer_11341").click()
document.querySelector("#part_539 > div:nth-child(40) > p:nth-child(4) > span:nth-child(1)> #answer_11340").click()
document.querySelector("#part_539 > div:nth-child(42) > p:nth-child(4) > span:nth-child(1)> #answer_11339").click()
document. getElementsByName('answer_11313')[0].click()
document. getElementsByName('answer_11314')[1].click()
document. getElementsByName('answer_11323')[0].click()
document. getElementsByName('answer_11324')[1].click()
document. getElementsByName('answer_11325')[0].click()
document. getElementsByName('answer_11326')[0].click()
document. getElementsByName('answer_11327')[1].click()
document. getElementsByName('answer_11315')[0].click()
document. getElementsByName('answer_11316')[1].click()
document. getElementsByName('answer_11317')[0].click()
document. getElementsByName('answer_11318')[0].click()
document. getElementsByName('answer_11319')[1].click()
document. getElementsByName('answer_11320')[0].click()
document. getElementsByName('answer_11321')[0].click()
document. getElementsByName('answer_11322')[1].click()
document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
}
//2024数字化
if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=130")){
document. getElementsByName("answer_12019")[2].click()
document. getElementsByName("answer_12017")[0].click()
  document. getElementsByName("answer_12015")[1].click()
  document. getElementsByName("answer_12013")[2].click()
  document. getElementsByName("answer_12001")[3].click()
  document. getElementsByName("answer_11999")[3].click()
document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
}
if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=131")){
document. getElementsByName("answer_12066")[3].click()
document. getElementsByName("answer_12062")[2].click()
  document. getElementsByName("answer_12060")[1].click()
  document. getElementsByName("answer_12058")[2].click()
  document. getElementsByName("answer_12032")[1].click()
  document. getElementsByName("answer_12030")[3].click()
document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()

}
if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=132")){
document. getElementsByName("answer_12093")[1].click()
document. getElementsByName("answer_12091")[3].click()
  document. getElementsByName("answer_12089")[2].click()
  document. getElementsByName("answer_12077")[1].click()
  document. getElementsByName("answer_12075")[2].click()
  document. getElementsByName("answer_12073")[2].click()
document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
}
if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=133")){
document. getElementsByName("answer_12144")[3].click()
document. getElementsByName("answer_12142")[0].click()
  document. getElementsByName("answer_12140")[3].click()
  document. getElementsByName("answer_12126")[0].click()
  document. getElementsByName("answer_12124")[0].click()
  document. getElementsByName("answer_12112")[2].click()
document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
}
  //2023数字化
if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=129"))
{
var a12 = document.getElementsByClassName("MsoNormal")
let arr = [3,6, 8, 15, 18,23,24,31,32,37,41,47,49,53,57,60,64,70,75,76];
for (let i = 0; i < arr.length; i++) {
	a12[arr[i]].getElementsByTagName('input')[0].click()
}
var a13 = document.getElementsByClassName("e_juan03")
let ar = [0,0,0,1,1,1,1,0,0,0,1,0,0,0,1];
for (let ii = 0; ii < a13.length; ii++) {
	a13[ii].getElementsByTagName('input')[ar[ii]].click()
}
  document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
  }

//2023统筹
 if (hre.includes("https://admin.hnpxw.org/learner/examine/openPaper.do?examID=128"))
{
var a122 = document.getElementsByClassName("MsoNormal")
let arrr = [0,6,11,15,18,20,27,30,33,39,40,47,50,52,57,63,64,68,75,78];
for (let iii = 0; iii < arrr.length; iii++) {
	a122[arrr[iii]].getElementsByTagName('input')[0].click()
}


var a133 = document.getElementsByClassName("e_juan03")
let arrrr = [1,1,0,0,1,0,0,0,0,1,1,0,1,0,1];
for (let iiii = 0; iiii < a133.length; iiii++) {
	a133[iiii].getElementsByTagName('input')[arrrr[iiii]].click()
}
  document.getElementsByClassName("inputOver")[2].click()
document.querySelector("#overexam").click()
  }

if (hre.includes("https://www.hnpxw.org/userStudy")){
      setInterval(() => {
try {
  //切换至专业课
  if(document.querySelector("#tab-third").innerText != '专业课（0）'){document.querySelector("#tab-third").click()}

var cource_list = document.getElementsByClassName("margin-top-sm study-list-precent flex align-center")
for(var i = 0; i < cource_list.length; i ++) {
	//	if(document.getElementsByClassName("margin-top-sm study-list-precent flex align-center")[i].innerText != '您已学完，请在“我的考试”里进行考试。')
  //课完成判断
   // if(document.getElementsByClassName("margin-top-sm study-list-precent flex align-center")[i].innerText != '已学100%')
  if(document.getElementsByClassName("margin-top-sm study-list-precent flex align-center")[i].innerText == '您已学完，请在“我的考试”里进行考试。'||document.getElementsByClassName("margin-top-sm study-list-precent flex align-center")[i].innerText == '您已学完，请进行考试。 去考试'||document.getElementsByClassName("margin-top-sm study-list-precent flex align-center")[i].innerText == '已学100%'||document.getElementsByClassName("margin-top-sm study-list-precent flex align-center")[i].innerText == '您已学完并考试合格，请进行证书申请。 去申请证书')
		{console.log("此课程已完成");}
	else
		{document.getElementsByClassName('enter-btn')[i].click()
    break
    }
     }
} catch(err) {window.location.reload();}
      }, 3000);
	}

if (hre.includes("https://www.hnpxw.org/studyDetail?")){
setInterval(() => {
try {

var aa = document.getElementsByClassName("el-progress__text")
for(var a = 1; a < aa.length; a ++) {
		if(document.getElementsByClassName("el-progress__text")[a].innerText != '100%')
    {
      document.getElementsByClassName("el-button el-button--primary el-button--mini is-round")[1].click()
      document.getElementsByClassName('el-button el-button--primary el-button--mini is-round')[a+1].click()
    break
    }
	}
} catch(err) {window.location.reload();}
  //更新学习进度
 // var gxjd = document.getElementsByClassName("el-button el-button--primary el-button--mini is-round")
  //for(var gx = 0; gx < gxjd.length;gx++){if(gxjd[gx].innerText == '更新学习进度'){gxjd[gx].click()}}
     if(document.getElementsByClassName("el-progress__text")[0].innerText == '学习进度\n\n100%'){window.location.replace('https://www.hnpxw.org/userStudy')}
},3000);
}

if (hre.includes("https://ua.peixunyun.cn/")){
//自动播放脚本
      function autoPlay() {
        var interval = setInterval(function () {
        var video = document.getElementsByTagName("video")[0];
        var play = document.getElementsByClassName("mejs__overlay-play")[0];
        var next_page_btn = document.getElementsByClassName("next-page-btn")[0];
        var continue_btn = document.getElementsByClassName("btn-submit")[0];
        //获取element
        //if(continue_btn){continue_btn.click();}
        video.setMuted(true);
        if (video.getPaused()) {
            play.click();
        }
        //if (video.duration - video.currentTime < 2) {next_page_btn.click();}
        }, 1000);
  }
    setTimeout(function () {
    try {
        autoPlay();
    } catch (e) {
        console.log(e);
    }
    }, 1000);


      setInterval(() => {
        window.helloworld = function() {if (document.querySelector("body > div.header > div > div.back-btn.control-btn.cursor.return-url > span") <= '0') {window.location.reload();}}
        window.setTimeout("helloworld()", 40000);
       //window.helloworld1 = function() {if (document.querySelector("div.mejs__overlay.mejs__layer.mejs__overlay-play") <= '0') {            document.querySelector("body > div.header > div > div.back-btn.control-btn.cursor.return-url > span").click()}}
       // window.setInterval("helloworld1()", 40000);
      //    try {
       //     if (document.querySelector("#statModal > div > div > div > div > div.stat-next > button:nth-child(2)").innerHTML != '0') {
      //        document.querySelector("#statModal > div > div > div > div > div.stat-next > button:nth-child(2)").click()
      //        document.querySelector("body > div.header > div > div.back-btn.control-btn.cursor.return-url > span").click()
      //      }
     //     } catch (error) {}
      }, 100000);

  setInterval(()=>  {
    var video = document.getElementsByTagName("video")[0];if (video.paused && !video.ended) {video.play()}}, 3000);//自动播放


      var submit_answer_button = $('[data-bind="text: $root.i18nMessageText().submit, click: submitQuiz"]')[0];
      setInterval(() => {
         var jx = document.querySelector("button.btn-submit.btn-video");if(jx){jx.click()} //继续播放
        var zjwc = document.querySelectorAll("i.iconfont.finish")
        var zj = document.querySelectorAll("div.page-icon")
        zj[zjwc.length].click()//下一节

        if(zjwc.length == zj.length){document.querySelector("span.back.btn-text").click()}
                  try {
        if (!submit_answer_button || submit_answer_button.innerHTML !== "提交"){
        }else{
            var pageId = koLearnCourseViewModel.currentPage().id();
            var answer_no = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'true': 0, 'false': 1};
            var question =  $('.question-wrapper.show-answer');
            var question_choice_list = [];
            var answer_list = [];

            for (var i = 0; i < question.length; i++) {
                //获取题目选项
                if ($('#' + question[i].id).find(".checking-type").length !== 0){
                    question_choice_list.push($('#' + question[i].id).find(".choice-btn"));
                }else{
                    question_choice_list.push($('#' + question[i].id).find(".choice-item"));
                }
                //获取题目答案
                $.ajax({
                    async: false,
                    type : "get",
                    url : 'https://api.ulearning.cn/questionAnswer/' + question[i].id.replace('question', '') + '?parentId=' + pageId,
                    datatype : 'json',
                    success : function(result) {
                        answer_list.push(result.correctAnswerList);
                    }
                });
            }

            for(var j = 0; j < answer_list.length; j++) {
                for(var k = 0; k < answer_list[j].length; k++){
                    //点击正确答案
                    question_choice_list[j][answer_no[answer_list[j][k]]].click();
                }
            }
            //点击提交按钮
            submit_answer_button.click();

        }
        } catch(err) {
         // submit_answer_button.click();
        }
    //  if(document.querySelector("div > div > div.question-operation-area > button").innerText == '提交') {submit_answer_button.click();}
},1000);


 }


  }, 1000);
})();