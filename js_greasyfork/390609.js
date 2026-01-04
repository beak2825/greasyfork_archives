// ==UserScript==
// @name        智慧树 - 提交作业页面添加作业详情文字内容
// @description 为智慧树作业的“提交作业”页面添加“作业详情”中的文字内容
// @namespace   UnKnown
// @match        https://hiexam.zhihuishu.com/atHomeworkExam/stu/homeworkQ/homeworkDetail/*
// @version     1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/390609/%E6%99%BA%E6%85%A7%E6%A0%91%20-%20%E6%8F%90%E4%BA%A4%E4%BD%9C%E4%B8%9A%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E4%BD%9C%E4%B8%9A%E8%AF%A6%E6%83%85%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/390609/%E6%99%BA%E6%85%A7%E6%A0%91%20-%20%E6%8F%90%E4%BA%A4%E4%BD%9C%E4%B8%9A%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E4%BD%9C%E4%B8%9A%E8%AF%A6%E6%83%85%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

const main = async (count) => {

  const delay = 250; // 每次尝试前的等待间隔
   this.limit = 32;  // 尝试次数限制

  // 达到/超过次数限制时停止尝试
  if (count <= 0) return false;

  // 等一波
  await new Promise(
    resolve => setTimeout(resolve, delay)
  );

  if ( // 验证是否加载完毕
    document.querySelector("#pane-doHomeWork .doexam-div") &&
    document.querySelector("#pane-homeworkDetail .detail-text > p")
  ) { // 加载完毕时

    const parentNode = document.querySelector("#pane-doHomeWork .doexam-div");
    const newNode = document.createElement("div");

    newNode.className = "detail-content stu-detail Jobcontent-p";

    // 作业详情
    newNode.appendChild(
      (function() {
        const h2 = document.createElement("h2");
        h2.textContent = "作业详情";
        h2.setAttribute("style", "margin:30px 0 -20px;color:#3d4059");
        return h2;
      })()
    );

    // 内容
    newNode.appendChild(
      document.querySelector("#pane-homeworkDetail .detail-text")
              .cloneNode(true)
    );

    parentNode.insertBefore(
      newNode,
      parentNode.querySelector(".Jobcontent-div")
    );

  } else { // 没有加载完毕时，利用递归继续重试。
    // console.info(count);
    main(--count);
  }

};

main(main.limit);