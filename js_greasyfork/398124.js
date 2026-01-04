// ==UserScript==
// @name         suckStuInfo
// @namespace    https://github.com/ZenKaiii/suckStuInfo
// @version      0.4
// @description  导员喊你来打卡--东北大学“云成长”自动化打卡
// @author       某不愿透露姓名的jojo
// @match        http://stuinfo.neu.edu.cn/cloud-xxbl/studentinfo?tag=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398124/suckStuInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/398124/suckStuInfo.meta.js
// ==/UserScript==

(function() {
  'use strict';
window.onload =function () {

        let q1 = this.document.getElementById("sfgcyiqz"); //是否有医学观察、疑似、确诊经历
        q1.value = "否";
        let q2 = this.document.getElementsByName("hjnznl")[0]; //这个寒假你在哪里
        q2.value = "家";
        let q3 = this.document.getElementsByName("qgnl")[0]; //去过哪里
        q3.value = "家";
        let q4 = this.document.getElementById("sfqtdqlxs"); //是否有湖北或其他有本地病例持续传播地区的旅行史或居住史
        q4.value = "否";
        let q5 = this.document.getElementById("sfjcgbr"); //是否接触过湖北或其他有本地病例持续传播地区有发热或呼吸道症状的人
        q5.value = "否";
        let q6 = this.document.getElementById("sfjcglxsry"); //是否接触过湖北或其他有本地病例持续传播地区旅行史或居住史的人
        q6.value = "否";
        let q7 = this.document.getElementById("sfjcgysqzbr"); //是否有与疑似病例、确诊病例或无症状感染者的接触史
        q7.value = "否";
        let q8 = this.document.getElementById("sfjtcyjjfbqk"); //你的家庭成员是否有过聚集性发病情况
        q8.value = "否";
        let q9 = this.document.getElementById("sfqgfrmz"); //是否去过某医疗机构发热门诊看病
        q9.value = "否";
        let q10 = this.document.getElementById("sfygfr"); //是否有过发热
        q10.value = "无";
        let q11 = this.document.getElementById("sfyghxdbsy"); //是否有过呼吸道不适症状
        q11.value = "无";
        let q12 = this.document.getElementById("sfygxhdbsy"); //是否有过消化道不适症状
        q12.value = "无";
        let btn = this.document.getElementsByTagName("button")[0];
        btn.click();
      }
  }
)();