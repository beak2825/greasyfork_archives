// ==UserScript==
// @name         河南执（从）业药师继续教育视频弹窗延后
// @namespace    http://tampermonkey.net/
// @version      2024-01-27-15
// @description  视频弹窗延后
// @author       Twist
// @match        http://www.hnysw.org/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hnysw.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485582/%E6%B2%B3%E5%8D%97%E6%89%A7%EF%BC%88%E4%BB%8E%EF%BC%89%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%BC%B9%E7%AA%97%E5%BB%B6%E5%90%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/485582/%E6%B2%B3%E5%8D%97%E6%89%A7%EF%BC%88%E4%BB%8E%EF%BC%89%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%BC%B9%E7%AA%97%E5%BB%B6%E5%90%8E.meta.js
// ==/UserScript==

(function() {
  function isLessonOrExam() {
  const url = document.baseURI;
  const regex = /\/([a-zA-Z]+)Details\/course_id\/(\d+)/;
  const match = url.match(regex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

function getQuestionInfoFromHTML() {
  const matchRes = document.documentElement.outerHTML.match(
    /var ques = (\[.*?\]);/
  );
  const ques = JSON.parse(decodeURIComponent(escape(matchRes[1])));
  return ques;
}

function selectAnswerFromQues(ques) {
  ques.forEach((val, index) => {
    const inputNode = $(".exam-group-ul")
      .eq(index)
      .find("li")
      .eq(parseInt(val["answer"]))
      .find("input")[0];
    setTimeout(() => {
      inputNode.checked = true;
      inputNode.click();
      console.log(`Q${index}:A${val["answer"]}`);
    }, 3000+1000*index);
  });
}

function submitAnswer() {
  $("#submit")[0].click();
  $(".layui-layer-btn0")[0].click();
}

(function () {
  const lessonOrExam = isLessonOrExam();
  console.log(lessonOrExam);
  switch (lessonOrExam) {
    case "lesson":
      min_alert = 500;
      break;
    case "exam":
      selectAnswerFromQues(getQuestionInfoFromHTML());
      setTimeout(() => {
        submitAnswer();
      }, 15000 + Math.floor(Math.random() * 10000));
      break;
    default:
      break;
  }
})();

})();