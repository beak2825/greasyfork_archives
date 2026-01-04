// ==UserScript==
// @name         翱翔门户排名查看
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  学生画像中为排名增加UI
// @author       2ndElement
// @match        https://jwxt.nwpu.edu.cn/student/for-std/student-portrait
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nwpu.edu.cn
// @license MIT
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/461773/%E7%BF%B1%E7%BF%94%E9%97%A8%E6%88%B7%E6%8E%92%E5%90%8D%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461773/%E7%BF%B1%E7%BF%94%E9%97%A8%E6%88%B7%E6%8E%92%E5%90%8D%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
  $("document").ready(function () {
    "use strict";
    let id, rank, score_content, rank_div;
    let info_url =
      "https://jwxt.nwpu.edu.cn/student/for-std/student-portrait/getStdInfo?bizTypeAssoc=2&cultivateTypeAssoc=1";
    fetch(info_url).then((res) => {
      res.json().then((data) => {
        id = data.student.id;
        let rank_url =
          "https://jwxt.nwpu.edu.cn/student/for-std/student-portrait/getMyGrades?studentAssoc=" +
          id +
          "&semesterAssoc=";
        fetch(rank_url).then((res) => {
          res.json().then((data) => {
            rank = data.stdGpaRankDto.rank;
            score_content = document.querySelector(".score-content");
            rank_div = new DOMParser().parseFromString(
              '<li class="score-item" style="background: teal"><div class="icon-img"><i class="icon-paiming2"></i></div> <div class="score-info"><div class="score">' +
                rank +
                '</div> <div class="info">专业排名 <i class="el-tooltip iconfont icon-bangzhu item" aria-describedby="el-tooltip-9177" tabindex="0"></i></div></div></li>',
              "text/html"
            ).body.firstChild;
            score_content.appendChild(rank_div);
          });
        });
      });
    });
  });
})();
