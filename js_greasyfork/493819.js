// ==UserScript==
// @name         【学习通】自动回复讨论
// @namespace    https://bbs.tampermonkey.net.cn/
// @namespace    https://greasyfork.org/zh-CN/scripts/493819
// @version      0.2.0
// @description  学习通课程话题自动评论，复制话题详情中最后一条评论进行评论，每次打开讨论进行回复。
// @author       LoveX2095
// @match        *://groupweb.chaoxing.com/*
// @resource     bootstrap https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493819/%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%91%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E8%AE%A8%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/493819/%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%91%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E8%AE%A8%E8%AE%BA.meta.js
// ==/UserScript==

// 模态框
function AddModal(title = "", message = "", isInput = false, listLengh = 0) {
  this.modalBox = document.createElement("div");
  this.modalBox.classList.add("modal", "d-block");
  this.modalBox.setAttribute("id", "completeModal");
  if (isInput) {
    this.modalBox.innerHTML = `
             <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <!-- 模态框头部 -->
            <div class="modal-header">
              <h4 class="modal-title">${title}</h4>
              <button
                type="button"
                class="btn-close d-none"
                id="modal-close1"
              ></button>
            </div>

            <!-- 模态框内容 -->
            <div class="modal-body">
              <p class="alert alert-warning">
                <b>注意：</b
                >建议根据自身电脑性能以及网络速率来输入，若填写数量大于话题列表数量会导致弹出大量页面。
              </p>
              <div class="input p-4 border rounded shadow-sm">
                <p>课程名：${localStorage.getItem("listPage")} </p>
                <p>
                  您的话题讨论列表数量：${listLengh}
                </p>
                <label for="number">每次弹出页数量(默认是 5)：</label>
                <div>
                  <input
                    class="form-control m-2 ms-0"
                    type="number"
                    name="number"
                    id="number"
                    placeholder="请输入数量"
                  />
                </div>
              </div>
            </div>

            <!-- 模态框底部 -->
            <div class="modal-footer">
              <button class="btn btn-primary" id="modal-save">保存</button>
              <button type="button" class="btn btn-danger d-none" id="modal-close2">
                关闭
              </button>
            </div>
          </div>
        </div>
            `;
  } else {
    this.modalBox.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <!-- 模态框头部 -->
                <div class="modal-header">
                    <h4 class="modal-title">${title}</h4>
                    <button type="button" class="btn-close" id="modal-close1"></button>
                </div>

                <!-- 模态框内容 -->
                <div class="modal-body">
                    ${message}
                </div>

                <!-- 模态框底部 -->
                <div class="modal-footer">
                    <button class="btn btn-primary d-none" id="modal-save">保存</button>
                    <button type="button" class="btn btn-danger" id="modal-close2">关闭</button>
                </div>

            </div>
        </div>
    `;
  }

  // 设置黑色遮罩
  this.showBg = document.createElement("div");
  this.showBg.classList.add("modal-backdrop", "show", "bg-black");
}

// 给模态框设置打开方法
AddModal.prototype.open = function (listLengh) {
  // 向页面添加
  waitForElement("body").then((body) => {
    body[0].appendChild(this.modalBox);
    body[0].appendChild(this.showBg);
  });

  // 给模态框设置事件
  this.modalBox.querySelector("#modal-close1").addEventListener("click", () => {
    this.close();
  });
  this.modalBox.querySelector("#modal-close2").addEventListener("click", () => {
    this.close();
  });
  this.modalBox.querySelector("#modal-save").addEventListener("click", () => {
    this.save(listLengh);
  });
};

// 给模态框设置关闭方法
AddModal.prototype.close = function () {
  this.modalBox.remove();
  this.showBg.remove();
};

// 给选项模态框设置保存方法
AddModal.prototype.save = function (list) {
  const inputNum = this.modalBox.querySelector("#number").value;
  if (inputNum >= list.length) {
    localStorage.setItem("inputValue", list.length);
  } else if (inputNum <= list.length && inputNum > 0) {
    localStorage.setItem("inputValue", inputNum);
  } else {
    localStorage.setItem("inputValue", 5);
  }
  localStorage.setItem("isInit", true);
  // 遍历打开详情
  setTimeout(() => {
    openDiscussion(list);
  }, 2000);

  this.close();
};

// 等待元素就绪
function waitForElement(selector) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelectorAll(selector);
      if (element.length !== 0) {
        clearInterval(interval);
        resolve(element);
      } else {
        clearInterval(interval);
        reject("错误，没找到元素");
      }
    }, 100);
  });
}

// 保存页面标题
function setPageTitle() {
  const title = document.title;
  if (title === "话题详情") {
    localStorage.setItem("topicPage", title);
  } else {
    if (localStorage.getItem("listPage")) {
      if (localStorage.getItem("listPage") !== title) {
        localStorage.setItem("isInit", false);
      }
    }
    localStorage.setItem("listPage", title);
  }
}

// 遍历打开详情
function openDiscussion(list) {
  const num = localStorage.getItem("inputValue") || 5;
  console.log(num);
  list
    .slice(0, num)
    .forEach((item) => item.querySelector(".dataBody_con").click());
}

// 提交
function submitAndClose() {
  // 获取所有评论
  waitForElement(
    ".topicDetail_replyList .topicDetail_replyItem .topicReply_right .replyContent"
  )
    .then((lastReview) => {
      // 获取评论输入框
      waitForElement(".textareawrap textarea").then((input) => {
        // 将最后一条评论内容赋值给输入框
        input[0].value = lastReview[0].innerText;
        // 获取提交按钮
        waitForElement(".addReply").then((submit) => {
          // 设置延迟提交
          const timer = setTimeout(() => {
            submit[0].click();
            clearTimeout(timer);
            // 关闭页面
            const timer2 = setTimeout(() => {
              clearInterval(timer2);
              window.close();
            }, 1000);
          }, 500);
        });
      });
    })
    .catch((error) => {
      waitForElement(".topicDetail_title span").then((res) => {
        if (localStorage.getItem("titles")) {
          const locaTitles = JSON.parse(localStorage.getItem("titles"));
          const title = res[0].innerText;
          locaTitles.push(title);
          localStorage.setItem(
            "titles",
            JSON.stringify(Array.from(new Set(locaTitles)))
          );
        } else {
          const title = res[0].innerText;
          const titles = [];
          titles.push(title);
          console.log(titles);
          localStorage.setItem("titles", JSON.stringify(titles));
        }
        setTimeout(() => {
          window.close();
        }, 1000);
      });
    });
}

// 将列表页面重新刷新
function reloadListPage() {
  if (!document.hidden) {
    location.reload();
  }
}

// 检查任务列表是否完成
function checkTopicList(list) {
  // 检查任务列表是否完成
  if (list.length === 0) {
    const endTip = new AddModal(
      "提示",
      "找不到未回复任务，请检查是否全部回复完成！"
    );
    endTip.open();
    localStorage.clear();
    return true;
  } else {
    return false;
  }
}

// 为没有评论的话题打上标记
function noReplyYet(list) {
  if (!localStorage.getItem("titles")) {
    return;
  }
  const newList = Array.from(list);
  // console.log('dssadsadsa')
  newList.filter((item) => {
    const noReplyList = JSON.parse(localStorage.getItem("titles"));
    const itemTitle = item.querySelector(".topicli_title_text").innerText;
    if (noReplyList.includes(itemTitle)) {
      const noReplyBox = document.createElement("span");
      noReplyBox.innerText = "无评论";
      noReplyBox.classList.add("topic_reply", "bg-danger");
      item.querySelector(".topicli_head_left").appendChild(noReplyBox);
    }
  });
}

(function () {
  "use strict";
  // Your code here...

  // 加载外部CSS
  const bootstrapCSS = GM_getResourceText("bootstrap");
  GM_addStyle(bootstrapCSS);

  // 保存页面标题至本地
  setPageTitle();

  // 获取当前页面标题
  const currentPageTitle = document.title;
  if (currentPageTitle === localStorage.getItem("listPage")) {
    // 监听列表页面的状态，当状态变化，重新刷新页面
    document.addEventListener("visibilitychange", reloadListPage);

    // 筛选未回复的列表
    waitForElement(".dataBody .dataBody_td")
      .then((res) => {
        noReplyYet(res);

        const list = Array.from(res).filter(
          (item) => !item.querySelector(".topic_reply")
        );

        if (list.length > 0) {
          const optionModal = new AddModal("基本配置", "", true, list.length);
          if (
            localStorage.getItem("isInit") === "false" ||
            !localStorage.getItem("isInit")
          ) {
            const listNum = optionModal.open(list);
          }
        }

        checkTopicList(list);

        // 遍历打开话题详情
        if (localStorage.getItem("isInit") === "true") {
          openDiscussion(list);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (currentPageTitle === localStorage.getItem("topicPage")) {
    window.addEventListener("load", () => {
      // 页面可见时执行
      function handleVisibilityChange() {
        if (!document.hidden) {
          // 执行提交函数
          submitAndClose();
        }
      }

      // 先执行一次 判断页面是否可见
      handleVisibilityChange();

      // 监听所有页面的状态，一旦状态改变（如可见或者不可见）执行函数
      document.addEventListener("visibilitychange", handleVisibilityChange);
    });
  }
})();
