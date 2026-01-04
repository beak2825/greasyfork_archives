// ==UserScript==
// @name         课程圈答案获取
// @namespace    com.biquzhi.kechengquan
// @version      0.1
// @description  Fuck 课程圈
// @author       碧蛆汁
// @match        *://www.mykcq.com/
// @icon         <$ICON$>
// @grant        none
// @run-at       document-start
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/451133/%E8%AF%BE%E7%A8%8B%E5%9C%88%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451133/%E8%AF%BE%E7%A8%8B%E5%9C%88%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

function AddButton(index) {
  var btnArea = document.getElementById("top-box");
  var btn = document.createElement("button");
  btn.textContent = "点我获取答案";
  btnArea.insertBefore(btn, btnArea[5]);
  var itemList = document.getElementsByClassName("solutions-item");
  btn.onclick = function () {
    itemList[index].style.backgroundColor = "red";
  };
}
function GetAnswer(questionID, answerList) {
  var url = `http://39.98.156.91:9999/media/answer/list?questionId=${questionID}&pagesize=1&pageNum=1`;
  var answerid = "";
  console.log(url);
  //fetch
  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      answerid = res.rows[0].answerId;
      var index = answerList.indexOf(parseInt(answerid));
      console.log(index);
      AddButton(index);
    });
}
(function () {
  "use strict";
  ah.proxy({
    onResponse: (response, handler) => {
      handler.next(response);
      if (response.config.url.indexOf("question/getOneQuestion") != -1) {
        var data = JSON.parse(response.response);
        var questionID = data.data.item.id;
        var alist = data.data.item.mediaQuestionOptionList;
        //遍历answerList
        var answerList = [];
        for (var i = 0; i < alist.length; i++) {
          answerList = answerList.concat(alist[i].id);
        }
        GetAnswer(questionID, answerList);
      }
    },
  });
})();
