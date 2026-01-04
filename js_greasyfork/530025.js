// ==UserScript==
// @name         获取答题结果
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Capture only https://lms.ouchn.cn/api/exams/xxx/submissions requests with parameters and show in a popup using native JavaScript.
// @author       maven
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530025/%E8%8E%B7%E5%8F%96%E7%AD%94%E9%A2%98%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/530025/%E8%8E%B7%E5%8F%96%E7%AD%94%E9%A2%98%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const locationObj = window.location;
  const domain = locationObj.hostname;
  if (domain != "lms.ouchn.cn") return;
  let SELECT_DATA = [];
  let SELECT_INDEX = -1;

  // 创建弹窗元素
  const createPopup = () => {
    const popup = document.createElement("div");
    popup.className = "request01";
    popup.style.position = "fixed";
    popup.style.top = "10px";
    popup.style.right = "10px";
    popup.style.width = "400px";
    popup.style.maxHeight = "400px";
    popup.style.minHeight = "400px";
    popup.style.overflowY = "auto";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "10px";
    popup.style.zIndex = "9999";
    popup.style.borderRadius = "30px";
    popup.style.overflowX = "hidden";
    popup.style.display = "none";
    document.body.appendChild(popup);
    return popup;
  };

  const popup = createPopup();

  let api = localStorage.getItem("API_CONFIG") || "";
  if (api === "") {
    popup.style.display = "block";
    const createApiInputDOM = () => {
      return `
              <div
                  class="api_win"
                  style="
                      width: 100%;
                      height: 400px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-direction: column;
                  "
              >
                  <input
                      class="api_input"
                      type="text"
                      placeholder="请输入api地址"
                      style="
                          width: 80%;
                          height: 40px;
                          border-radius: 20px;
                          border: 2px solid #ccc;
                          padding: 20px;
                          box-sizing: border-box;
                          outline: none;
                      "
                  />
                  <div
                      class="save_api"
                      style="
                          margin-top: 20px;
                          width: 220px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          background: #409EFF;
                          color: #fff;
                          height: 40px;
                          border-radius: 20px;
                          cursor: pointer;
                      "
                  >
                      确认
                  </div>
              </div>
          `;
    };
    popup.innerHTML = createApiInputDOM();
    const saveApiButton = document.querySelector(".save_api");
    if (saveApiButton) {
      saveApiButton.addEventListener("click", function () {
        const apiInput = document.querySelector(".api_input");
        let api = apiInput.value || "";
        if (api === "") {
          alert("请输入api地址");
        } else {
          localStorage.setItem("API_CONFIG", api);
          window.location.reload();
        }
      });
    } else {
      console.error("未找到元素");
    }
  } else {
    // 重写 XMLHttpRequest
    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    const originalXhrSend = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      this._requestMethod = method;
      this._requestUrl = url;
      return originalXhrOpen.apply(this, arguments);
    };

    window.XMLHttpRequest.prototype.send = function (data) {
      const method = this._requestMethod;
      const url = this._requestUrl;
      const targetApiRegex = /api\/exams\/\d+\/submissions/;
      if (!targetApiRegex.test(url)) {
        return originalXhrSend.apply(this, arguments);
      }

      let params = {};
      try {
        if (method === "GET") {
          const urlObj = new URL("https://lms.ouchn.cn" + url);
          const searchParams = new URLSearchParams(urlObj.search);
          for (const [key, value] of searchParams.entries()) {
            params[key] = value;
          }
        } else if (data) {
          if (typeof data === "string") {
            try {
              params = JSON.parse(data);
            } catch (error) {
              const searchParams = new URLSearchParams(data);
              for (const [key, value] of searchParams.entries()) {
                params[key] = value;
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }

      const cookies = document.cookie;
      let courseName =
        document.querySelector(".course-name")?.innerText ||
        document.querySelector(".text-too-long").innerText;

      this.addEventListener("load", function () {
        if (this.status === 200) {
          try {
            const responseData = JSON.parse(this.responseText);
            const submissions = responseData.submissions;
            if (submissions && submissions.length > 0) {
              const createSubmissionsList = () => {
                const submissionsList = document.createElement("div");
                submissionsList.className = "submissions-list";
                submissions.forEach((submission, index) => {
                  const submissionItem = document.createElement("div");
                  submissionItem.className = "submissions-list-item";
                  submissionItem.style.marginBottom = "20px";
                  let data = {};
                  data["account"] = 1;
                  data["courseName"] = courseName;
                  data["cookie"] = cookies;
                  data["submissionId"] = submission.id;
                  data["examId"] = submission.exam_id;
                  data["type"] = 1;
                  SELECT_DATA.push(data);

                  // 创建选中区域
                  const checkDataDiv = document.createElement("div");
                  checkDataDiv.className = `check_data check_data_${index}`;
                  checkDataDiv.style.display = "flex";
                  checkDataDiv.style.alignItems = "center";
                  checkDataDiv.style.cursor = "pointer";
                  checkDataDiv.dataset.selectSwitch = 0;
                  checkDataDiv.addEventListener("click", (event) =>
                    check_data(index, event)
                  );

                  const selectText = document.createElement("div");
                  selectText.textContent = "选择";
                  selectText.style.marginRight = "10px";

                  const bigCircle = document.createElement("div");
                  bigCircle.className = "big";
                  bigCircle.style.width = "20px";
                  bigCircle.style.height = "20px";
                  bigCircle.style.borderRadius = "50%";
                  bigCircle.style.border = "1px solid #ccc";
                  bigCircle.style.display = "flex";
                  bigCircle.style.alignItems = "center";
                  bigCircle.style.justifyContent = "center";

                  const smallCircle = document.createElement("div");
                  smallCircle.className = "small";
                  smallCircle.style.width = "10px";
                  smallCircle.style.height = "10px";
                  smallCircle.style.borderRadius = "50%";
                  smallCircle.style.cursor = "pointer";
                  smallCircle.style.background = "#409EFF";
                  smallCircle.style.transform = "scale(0)";
                  smallCircle.style.transition = "all .4s";

                  bigCircle.appendChild(smallCircle);
                  checkDataDiv.appendChild(selectText);
                  checkDataDiv.appendChild(bigCircle);

                  submissionItem.appendChild(checkDataDiv);
                  submissionItem.insertAdjacentHTML(
                    "beforeend",
                    `
                        <strong>courseName:</strong> ${courseName}<br>
                        <strong>submissionId:</strong> ${submission.id}<br>
                        <strong>examId:</strong> ${submission.exam_id}<br>
                        <strong>分数:</strong> ${submission.score}<br>
                        <strong>提交时间:</strong> ${check_time(
                          submission.submitted_at
                        )}
                    `
                  );

                  submissionsList.appendChild(submissionItem);
                });
                return submissionsList;
              };

              const submissionsList = createSubmissionsList();
              popup.appendChild(submissionsList);

              const createSubmitButton = () => {
                let submit_data = `
                                  <div
                                      class="submit_data"
                                      style="
                                          margin-top: 20px;
                                          width: 220px;
                                          display: flex;
                                          align-items: center;
                                          justify-content: center;
                                          background: #409EFF;
                                          color: #fff;
                                          height: 40px;
                                          border-radius: 20px;
                                          cursor: pointer;
                                          margin: 0 auto;
                                      "
                                  >
                                      提交数据
                                  </div>
                              `;
                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = submit_data;
                let submitElement = tempDiv.firstElementChild;
                submitElement.addEventListener("click", () => submit_func());
                return submitElement;
              };

              const submitElement = createSubmitButton();
              submissionsList.appendChild(submitElement);
              popup.style.display = "block";
            } else {
              popup.style.display = "none";
            }
          } catch (error) {
            console.error("解析目标API响应出错:", error);
          }
        }
      });

      return originalXhrSend.apply(this, arguments);
    };
  }

  const check_time = (isoDate) => {
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        return "无效日期";
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return "无效日期";
    }
  };

  const check_data = (e, q) => {
    const selectSwitch = q.currentTarget.dataset.selectSwitch;
    q.currentTarget.dataset.selectSwitch = 1;
    SELECT_INDEX = e;

    SELECT_DATA.forEach((item, index) => {
      if (index != e) {
        const child = document.querySelectorAll(`.check_data_${index} .small`);
        child.forEach((element) => {
          element.style.transform = "scale(0)";
        });
      }
    });

    const childElements = document.querySelectorAll(`.check_data_${e} .small`);
    childElements.forEach((element) => {
      element.style.transform = "scale(1)";
    });
  };
  // const check_data = (e, q) => {
  //   // 获取当前点击元素的 data-select-switch 属性值
  //   const selectSwitch = q.currentTarget.dataset.selectSwitch;
  //   q.currentTarget.dataset.selectSwitch = 1;
  //   SELECT_INDEX = e;
  //   const parent = q.currentTarget.parentNode;
  //   const allCheckDataElements = parent.querySelectorAll(".check_data");
  //   console.log(allCheckDataElements);
  //   allCheckDataElements.forEach((checkDataElement) => {
  //     if (checkDataElement !== q.currentTarget) {
  //       checkDataElement.dataset.selectSwitch = 0;
  //       const smallElement = checkDataElement.querySelector(".small");
  //       if (smallElement) {
  //         smallElement.style.transform = "scale(0)";
  //       }
  //     }
  //   });

  //   // 找到当前点击元素下的 .small 元素
  //   const currentSmallElement = q.currentTarget.querySelector(".small");
  //   if (currentSmallElement) {
  //     // 将其 transform 样式设置为 scale(1)，即显示状态
  //     currentSmallElement.style.transform = "scale(1)";
  //   }
  //   console.log(SELECT_INDEX);
  // };

  const submit_func = () => {
    if (SELECT_INDEX.length === 0) {
      alert(".i. 得选择一个才能提交");
      return;
    }
    let list = SELECT_DATA[SELECT_INDEX];
    let API_CONFIG = localStorage.getItem("API_CONFIG");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_CONFIG, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const responseData = JSON.parse(xhr.responseText);
          console.log("Response:", responseData);
          alert("提交成功");
        } else {
          console.error("Request failed. Status:", xhr.status);
          alert("提交失败，请稍后重试");
        }
      }
    };
    xhr.send(JSON.stringify(list));
  };
})();
