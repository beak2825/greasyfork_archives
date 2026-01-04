// ==UserScript==
// @name         [ECUST] 华东理工 旧版学习通 全自动刷课
// @namespace    ddin
// @version      1.0.5
// @author       gpt-4-turbo
// @description  华东理工旧版超星学习通专刷（高数线代大物） mooc.s.ecust.edu.cn
// @license      Unlicense
// @icon         https://s.ecust.edu.cn/favicon.ico
// @match        *://mooc.s.ecust.edu.cn/*
// @match        *://mooc1.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513018/%5BECUST%5D%20%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%20%E6%97%A7%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/513018/%5BECUST%5D%20%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%20%E6%97%A7%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(() => {
  let timer1;
  let timer2;
  let initialJobCount = null;
  let clickInterval;
  // 初始化本地存储项
  if (localStorage.getItem("scriptRunCounter") === null) {
    localStorage.setItem("scriptRunCounter", 0);
  }
  if (localStorage.getItem("chapterToCheck") === null) {
    localStorage.setItem("chapterToCheck", "不自动停止");
  }
  if (localStorage.getItem("autoReturnDelay") === null) {
    localStorage.setItem("autoReturnDelay", 60000);
  }
  if (localStorage.getItem("autoManageMode") === null) {
    localStorage.setItem("autoManageMode", "0");
  }
  if (localStorage.getItem("courseSelectionMode") === null) {
    localStorage.setItem("courseSelectionMode", "0");
  }
  function checkStop() {
    let currents = document.querySelectorAll(".currents");
    let chapterToCheck = localStorage.getItem("chapterToCheck");
    for (let i = 0; i < currents.length; i++) {
      let hideChapterNumber = currents[i].querySelector(".hideChapterNumber");
      if (hideChapterNumber && hideChapterNumber.textContent.trim() === chapterToCheck) {
        console.log(`Chapter number ${chapterToCheck} found, exiting.`);
        clearInterval(timer1);
        clearInterval(timer2);
        setChapterToCheck("不自动停止"); // 假设这是正确设置下一章节的方式
        localStorage.setItem("autoManageMode", "0");
        window.location.href = "about:blank";
        return; // 防止继续执行后续代码
      }
    }
  }
  // 检查课程的函数
  function checkLessons() {
    let videoPlayed = false; // 标志，表示是否已经播放过视频
    let isScriptPause = false; // 标志，表示是否由脚本触发的暂停

    // 等待 iframe 元素加载完成后查找并自动播放
    function waitForIframeAndPlay() {
      checkStop();
      if (videoPlayed) {
        console.log("已播放视频，停止脚本。");
        return; // 如果已经播放过视频，停止执行
      }

      // 查找页面中的第一个 iframe
      const outerIframe = document.querySelector("iframe");

      if (outerIframe) {
        console.log("找到外层 iframe，正在加载...");
        try {
          // 获取外层 iframe 的内容窗口和文档
          const outerIframeDocument = outerIframe.contentWindow.document;

          // 替换所有class为ans-attach-ct ans-job-finished的div为占位元素
          const divsToReplace = outerIframeDocument.querySelectorAll("div.ans-attach-ct.ans-job-finished");
          if (divsToReplace.length > 0) {
            divsToReplace.forEach((div) => {
              // 创建占位元素
              const placeholder = outerIframeDocument.createElement("div");
              // 设置占位元素的样式
              placeholder.style.width = "100%";
              placeholder.style.height = "200px"; // 根据需要调整高度
              placeholder.style.backgroundColor = "#f0fff0";
              placeholder.style.display = "flex";
              placeholder.style.alignItems = "center";
              placeholder.style.justifyContent = "center";
              placeholder.style.border = "2px solid #ccc";
              placeholder.style.boxSizing = "border-box";
              placeholder.style.fontSize = "24px";
              placeholder.style.color = "#555";
              placeholder.style.borderRadius = "20px"; // 添加圆角

              // 设置占位文本
              placeholder.textContent = "已播放完毕";

              // 替换原有的div
              div.parentNode.replaceChild(placeholder, div);
              console.log("已替换一个ans-attach-ct ans-job-finished的div元素为占位元素");
            });
          } else {
            console.log('未找到具有class "ans-attach-ct ans-job-finished" 的div元素');
          }

          // 查找外层 iframe 中的第一个内层 iframe
          const innerIframe = outerIframeDocument.querySelector("iframe");

          if (innerIframe) {
            console.log("找到内层 iframe，正在加载...");
            try {
              // 获取内层 iframe 的内容窗口和文档
              const innerIframeDocument = innerIframe.contentWindow.document;

              // 查找内层 iframe 中的第一个视频元素
              const video = innerIframeDocument.querySelector("video");

              if (video) {
                video.muted = true; // 静音视频
                video
                  .play()
                  .then(() => {
                    console.log("视频已开始播放");
                    videoPlayed = true; // 设置标志，表示已播放

                    // 添加事件监听器以监测视频状态变化
                    const onVideoStateChange = ({ type }) => {
                      if (isScriptPause) {
                        // 忽略脚本自身触发的暂停
                        return;
                      }
                      console.log(`检测到视频事件: ${type}`);
                      // 在事件发生后延迟1秒
                      setTimeout(() => {
                        goback();
                      }, 1000);
                      // 移除事件监听器，防止多次弹窗
                      video.removeEventListener("pause", onVideoStateChange);
                      video.removeEventListener("ended", onVideoStateChange);
                    };

                    video.addEventListener("pause", onVideoStateChange);
                    video.addEventListener("ended", onVideoStateChange);

                    // 在播放后1秒暂停视频
                    setTimeout(() => {
                      isScriptPause = true; // 标记即将由脚本暂停
                      video.pause();
                      console.log("视频已暂停");

                      // 再过1秒继续播放视频
                      setTimeout(() => {
                        video
                          .play()
                          .then(() => {
                            console.log("视频已继续播放");
                            isScriptPause = false; // 解除标记
                          })
                          .catch((err) => {
                            console.log("继续播放视频时出错:", err);
                            isScriptPause = false; // 解除标记
                          });
                      }, 1000);
                    }, 1000);
                  })
                  .catch((error) => {
                    console.log("播放视频时出错:", error);
                  });
              } else {
                console.log("未找到视频元素");

                // 替换包含内层 iframe 的 ans-attach-ct div 为“非视频内容”
                const parentDiv = innerIframe.closest("div.ans-attach-ct");
                if (parentDiv) {
                  const placeholder = outerIframeDocument.createElement("div"); // 使用外层 iframe 的文档
                  // 设置占位元素的样式（与“已播放完毕”一致）
                  placeholder.style.width = "100%";
                  placeholder.style.height = "200px"; // 根据需要调整高度
                  placeholder.style.backgroundColor = "#fff0f0";
                  placeholder.style.display = "flex";
                  placeholder.style.alignItems = "center";
                  placeholder.style.justifyContent = "center";
                  placeholder.style.border = "2px solid #ccc";
                  placeholder.style.boxSizing = "border-box";
                  placeholder.style.fontSize = "24px";
                  placeholder.style.color = "#555";
                  placeholder.style.borderRadius = "20px"; // 添加圆角

                  // 设置占位文本
                  placeholder.textContent = "非视频内容";

                  // 替换原有的div
                  parentDiv.parentNode.replaceChild(placeholder, parentDiv);
                  console.log("已替换包含内层 iframe 的ans-attach-ct div元素为“非视频内容”的占位元素");

                  // 重新运行整个查找
                  setTimeout(waitForIframeAndPlay, 1000); // 延迟1秒后重试
                } else {
                  console.log("无法找到包含内层 iframe 的ans-attach-ct div元素");
                }
              }
            } catch (error) {
              console.log("无法访问内层 iframe 内容，可能是跨域限制:", error);
            }
          } else {
            console.log("未找到内层 iframe");
          }
        } catch (error) {
          console.log("无法访问外层 iframe 内容，可能是跨域限制:", error);
        }
      } else {
        console.log("未找到外层 iframe，延迟重试...");
        setTimeout(waitForIframeAndPlay, 1000); // 每隔1秒重试
      }
    }

    // 页面加载完成后延迟3秒开始查找并播放
    setTimeout(waitForIframeAndPlay, 2000);
  }

  // 判断是否已登录
  function isLoggedIn() {
    // 查找页面上是否有特定的“退出登录”链接
    const logoutLink = document.querySelector('a[href="#"][onclick="logout()"]');
    return logoutLink !== null;
  }

  // 点击目标元素的函数
  function clickTargetElement() {
    // 如果未登录，则显示提示并停止自动点击
    if (!isLoggedIn()) {
      alert("未登录，请先登录！");
      clearInterval(clickInterval); // 停止setInterval循环
      return;
    }
    // 寻找ID为"clazzApplyBtn"的a标签
    const clazzApplyBtn = document.getElementById("clazzApplyBtn");
    if (clazzApplyBtn && clazzApplyBtn.tagName.toUpperCase() === "A") {
      clazzApplyBtn.click();
      console.log("已点击: clazzApplyBtn");
    }
    // 寻找ID为"iboxAlertOk-confirm"的a标签
    const iboxAlertOkConfirm = document.getElementById("iboxAlertOk-confirm");
    if (iboxAlertOkConfirm && iboxAlertOkConfirm.tagName.toUpperCase() === "A") {
      iboxAlertOkConfirm.click();
      console.log("已点击: iboxAlertOk-confirm");
    }
  }

  // 设置需要检查的章节号
  function setChapterToCheck(value) {
    localStorage.setItem("chapterToCheck", value);
    console.log(`Chapter to check has been set to: ${value}`);
  }

  // 点击目标的h3元素
  function clickTargetH3() {
    const spans = document.querySelectorAll("span.articlename");
    spans.forEach((span) => {
      // 查找该span元素下的所有a元素
      const links = span.querySelectorAll("a");
      links.forEach((link) => {
        const originalHref = link.href; // 获取原始href
        if (!originalHref.includes("&mooc2=1")) {
          // 检查是否已包含&mooc2=1
          link.href = `${originalHref}&mooc2=1`; // 添加参数
        }
      });
    });

    let h3Elements = document.querySelectorAll("h3");
    let targetElement = null;
    for (let i = 0; i < h3Elements.length; i++) {
      if (h3Elements[i].querySelector("em.orange")) {
        targetElement = h3Elements[i];
        break;
      }
    }

    if (targetElement) {
      let anchor = targetElement.querySelector("a");
      if (anchor) anchor.click();
    } else {
      // 如果找不到 em.orange，检查是否存在 em.openlock
      let openLockElements = document.querySelectorAll("em.openlock");
      if (openLockElements.length > 0) {
        // 找到 class 为 "content1 roundcorner" 的 div 元素
        let contentDiv = document.querySelector("div.content1.roundcorner");
        if (contentDiv) {
          // 创建占位符元素
          let placeholder = document.createElement("div");
          // 设置占位符样式（根据需要调整样式）
          placeholder.style.width = "100%";
          placeholder.style.height = "200px"; // 根据需要调整大小
          placeholder.style.display = "flex";
          placeholder.style.justifyContent = "center";
          placeholder.style.alignItems = "center";
          placeholder.style.backgroundColor = "#f0f0f0";
          placeholder.style.border = "2px solid #ccc";
          placeholder.style.borderRadius = "8px";
          placeholder.style.fontSize = "24px";
          placeholder.style.color = "#555";
          placeholder.textContent = "已全部播放完毕";

          // 替换原有的 div 元素
          contentDiv.parentNode.replaceChild(placeholder, contentDiv);
        }
      }
    }
  }

  // 修改标签的函数
  function modifyTags() {
    // 选择所有h4和h5元素
    const tags = document.querySelectorAll("h4, h5");

    tags.forEach((tag) => {
      // 查找第一个span和a元素
      const firstSpan = tag.querySelector("span");
      const firstA = tag.querySelector("a");

      if (firstSpan && firstA) {
        // 获取span的onclick属性
        const onclickAttr = firstSpan.getAttribute("onclick");

        if (onclickAttr) {
          // 将onclick属性设置到a标签并移除href属性
          firstA.setAttribute("onclick", onclickAttr);
          firstA.removeAttribute("href");
        }
      }
    });
  }

  const consoleScript = `window.addEventListener("mouseout",t=>{t.stopImmediatePropagation(),t.stopPropagation(),t.preventDefault()},!0);`;
  // 运行控制台脚本
  const runConsoleScript = () => {
    const script = document.createElement("script");
    script.textContent = consoleScript;
    document.head.appendChild(script);
    script.remove();
  };
  runConsoleScript();

  if (window === window.top) {
    setInterval(modifyTags, 1000);
    let counter = parseInt(localStorage.getItem("scriptRunCounter"), 10) || 0;
    counter++;
    localStorage.setItem("scriptRunCounter", counter);
    let titleElement = document.querySelector("h1");
    if (titleElement) {
      titleElement.innerText = `程序运行中 <${counter}> - ${titleElement.innerText}`;
    }
    // 创建一个容器div
    let containerDiv = document.createElement("div");
    containerDiv.style.padding = "10px";
    containerDiv.style.backgroundColor = "#f0f0f0";
    containerDiv.style.textAlign = "center";
    // 创建章节检查输入框
    let inputFieldChapter = document.createElement("input");
    inputFieldChapter.setAttribute("type", "text");
    inputFieldChapter.setAttribute("placeholder", "输入自动停止的章节号 如1.3");
    inputFieldChapter.id = "chapterInput";
    let storedChapter = localStorage.getItem("chapterToCheck");
    if (storedChapter) {
      inputFieldChapter.value = storedChapter;
    }
    // 创建确认按钮
    let confirmButtonChapter = document.createElement("button");
    confirmButtonChapter.textContent = "设置终止";
    confirmButtonChapter.onclick = () => {
      let inputValue = document.getElementById("chapterInput").value;
      if (inputValue.trim() !== "") {
        setChapterToCheck(inputValue);
        console.log(`Chapter to check has been updated to: ${inputValue}`);
      } else {
        alert("输入错误");
      }
    };

    // 创建自动托管模式开关
    let autoManageSwitch = document.createElement("input");
    autoManageSwitch.setAttribute("type", "checkbox");
    autoManageSwitch.id = "autoManageSwitch";
    let storedAutoManageMode = localStorage.getItem("autoManageMode");
    autoManageSwitch.checked = storedAutoManageMode === "1"; // 如果存储值为1，则选中
    // 创建自动托管模式标签
    let autoManageLabel = document.createElement("label");
    autoManageLabel.setAttribute("for", "autoManageSwitch");
    autoManageLabel.textContent = "自动切集";
    // 为开关添加事件监听器
    autoManageSwitch.onchange = () => {
      localStorage.setItem("autoManageMode", autoManageSwitch.checked ? "1" : "0");
      //alert(`全自动托管模式已${autoManageSwitch.checked ? "启用" : "禁用"}`);
      window.location.reload();
    };
    // 创建重置按钮
    let resetButton = document.createElement("button");
    resetButton.textContent = "重置程序";
    resetButton.onclick = () => {
      localStorage.removeItem("scriptRunCounter");
      localStorage.removeItem("chapterToCheck");
      localStorage.removeItem("autoReturnDelay");
      localStorage.removeItem("autoManageMode");
      //alert("所有设置已重置");
      window.location.reload(); // 重载页面以反映重置后的状态
    };
    // 创建选课模式开关
    let courseSelectionSwitch = document.createElement("input");
    courseSelectionSwitch.setAttribute("type", "checkbox");
    courseSelectionSwitch.id = "courseSelectionSwitch";
    let storedCourseSelectionMode = localStorage.getItem("courseSelectionMode");
    courseSelectionSwitch.checked = storedCourseSelectionMode === "1"; // 如果存储值为1，则选中
    // 创建选课模式标签
    let courseSelectionLabel = document.createElement("label");
    courseSelectionLabel.setAttribute("for", "courseSelectionSwitch");
    courseSelectionLabel.textContent = "选课模式";
    // 为开关添加事件监听器
    courseSelectionSwitch.onchange = () => {
      localStorage.setItem("courseSelectionMode", courseSelectionSwitch.checked ? "1" : "0");
      //alert(`选课模式已${courseSelectionSwitch.checked ? "启用" : "禁用"}`);
      window.location.reload();
    };
    containerDiv.style.padding = "20px";
    containerDiv.style.marginBottom = "20px";
    containerDiv.style.backgroundColor = "#ffffff";
    containerDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    containerDiv.style.borderRadius = "8px";
    containerDiv.style.textAlign = "center";
    const baseInputStyle = "margin: 5px; padding: 10px; width: 80%; max-width: 300px; border-radius: 4px; border: 1px solid #ccc;";
    const baseButtonStyle = "cursor: pointer; margin: 5px; padding: 10px 15px; border: none; border-radius: 4px; background-color: #007bff; color: white;";
    inputFieldChapter.style = baseInputStyle;
    confirmButtonChapter.style = baseButtonStyle;
    confirmButtonChapter.onmouseover = () => (confirmButtonChapter.style.backgroundColor = "#0056b3"); // Hover效果
    confirmButtonChapter.onmouseleave = () => (confirmButtonChapter.style.backgroundColor = "#007bff"); // 鼠标离开时恢复颜色
    // 自动托管模式开关样式调整
    autoManageSwitch.style = "margin: 10px; cursor: pointer;";
    // 自动托管模式标签样式调整
    autoManageLabel.style = "color: #333; font-size: 14px;";
    // 选课模式开关样式调整
    courseSelectionSwitch.style = "margin: 10px; cursor: pointer;";
    // 选课模式标签样式调整
    courseSelectionLabel.style = "color: #333; font-size: 14px;";
    // 重置按钮样式调整
    resetButton.style = "cursor: pointer; margin-top: 20px; padding: 10px 15px; border: none; border-radius: 4px; background-color: #dc3545; color: white;";
    resetButton.onmouseover = () => (resetButton.style.backgroundColor = "#c82333"); // Hover效果
    resetButton.onmouseleave = () => (resetButton.style.backgroundColor = "#dc3545"); // 鼠标离开时恢复颜色
    // 将新创建的元素添加到容器div中
    if (window.location.href.indexOf("https://mooc.s.ecust.edu.cn/course/") === 0) {
      containerDiv.appendChild(document.createElement("br"));
      containerDiv.appendChild(courseSelectionSwitch);
      containerDiv.appendChild(courseSelectionLabel);
    } else {
      // 将元素添加到容器div中
      containerDiv.appendChild(inputFieldChapter);
      containerDiv.appendChild(confirmButtonChapter);
      containerDiv.appendChild(document.createElement("br")); // 添加换行，美观分隔
      // 将新创建的元素添加到容器div中
      containerDiv.appendChild(document.createElement("br"));
      containerDiv.appendChild(autoManageSwitch);
      containerDiv.appendChild(autoManageLabel);
      containerDiv.appendChild(document.createElement("br"));
      containerDiv.appendChild(resetButton);
      // 将容器div添加到body的最开始的位置
    }
    document.body.insertBefore(containerDiv, document.body.firstChild);
  }
  checkLessons();
  if (localStorage.getItem("autoManageMode") === "1") {
    timer2 = setInterval(clickTargetH3, 2000);
  } else if (localStorage.getItem("courseSelectionMode") === "1") {
    clickInterval = setInterval(clickTargetElement, 100);
  }
})();
