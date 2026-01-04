// ==UserScript==
// @name        HUAT自动化评学
// @namespace   Neko_HAA
// @match       https://eas.wvpn.huat.edu.cn/TeachEval/*
// @match       https://eas.wvpn.huat.edu.cn/TeachEval/EvalCourse.aspx
// @grant       none
// @license     MIT
// @version     1.0.1
// @author      NekoRectifier
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @description 2022/7/11 18:55:07
// @downloadURL https://update.greasyfork.org/scripts/447709/HUAT%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%84%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/447709/HUAT%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%84%E5%AD%A6.meta.js
// ==/UserScript==

var MAX_OPTIONS_NUM = 70;
var textview;

(function () {
  "use strict";

  console.clear();
  // main func entry.
  if (checkCurrentPageValidity()) {
    for (var i = 1; i < MAX_OPTIONS_NUM + 1; i++) {
      $("#rblItem" + i + "_0").click();
    }

    console.log("in");
  }

  function checkCurrentPageValidity() {
    var table = $("#Table1");
    if (table != null) {
      console.log("in the correct page!");
      return true;
    } else {
      return false;
    }
  }
})();

$(document).ready(function () {
  $("#txtOpenMemo").val(
    "教学过程思路清晰，始终围绕教学目标。把握重点，突出难点。教师能够引导学生开展观察操作比较猜想推理交流等多种形式的活动，使学生有效地经历数学知识的构成过程教师能根据具体的教学资料，引导学生动手实践自主探索合作交流等。体现培养学生学数学思维方式，培养思维潜力反思潜力和动手操作潜力。能够从学生实际出发，充分相信学生自己会学。关注学生已有的知识经验，学生在课堂上能够主动参与用心交往和谐互动。教态亲切仪表端庄举止自然。教学民主，师生关系平等和谐，尊重学生，对学生有耐心。教师的应变和调控课堂潜力强，教学效果：到达预定的教学目标，教学效果好。学生思维活跃，信息交流畅通;学生会学，课堂气氛好。使学生在获得必要的基础知识与基本技能的同时，促进学生情感态度和价值观的和谐发展，培养学生的实践潜力与创新意识。"
  );

  $("#btnSave").click();
});
