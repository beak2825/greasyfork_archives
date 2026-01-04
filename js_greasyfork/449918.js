// ==UserScript==
// @name         BigStudy
// @namespace    http://xjtudj.edu.cn/
// @version      0.1.1
// @description  XJTUDJ study
// @author       anonymous
// @match        http://xjtudj.edu.cn/course_detail.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449918/BigStudy.user.js
// @updateURL https://update.greasyfork.org/scripts/449918/BigStudy.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let s = document.getElementById("circuit");
  let bt = document.createElement("button");
  bt.innerHTML = "fuck";
  bt.setAttribute("style", "color:red;width:150px;height:150px;");
  bt.addEventListener("click", fuckStudy);
  s.appendChild(bt);
  let mode = 1;
  if(mode ===1){
  fuckStudy();
}


  function fuckStudy() {
    let T = 1500;
    let L = getList();
    for (let i = 0; i < L.length; i++) {
      const e = L[i];
      setTimeout(() => {
        postData(e.courseId, e.coursewareId);
      }, (i + 1) * T);
    }
  }

  function getList() {
    let L = document.getElementById("courseList").childNodes;
    let r = [];
    for (let i = 0; i < L.length; i++) {
      const e = L[i];
      // judge <a> tag
      if (e.nodeType === 1) {
        let tmp = {
          courseId:
            e.href.split("&")[1].split("=")[0] === "courseId"
              ? e.href.split("&")[1].split("=")[1]
              : "fuck",
          coursewareId:
            e.href.split("&")[2].split("=")[0] === "coursewareId"
              ? e.href.split("&")[2].split("=")[1]
              : "fuck",
        };
        r.push(tmp);
      }
    }
    return r;
  }

  function postData(courseId, coursewareId) {
    window.safePost(
      "/partyconstruction/client/course/getLearnedHistory",
      {
        courseId: courseId,
        coursewareId: coursewareId,
        progress: 0,
      },
      function (res) {
        window.safePost(
          "/partyconstruction/client/course/setFinished",
          {
            courseId: courseId,
            coursewareId: coursewareId,
            progress: res.data.mediaTime,
          },
          function (res) {
            console.log(res);
          }
        );
      }
    );
  }
})();
