// ==UserScript==
// @name         一键生成Cypress用例结构
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  根据当前用例的标题、领域等字段生成Cypress的用例代码结构
// @author       袁龙辉
// @match        https://rdcloud.zte.com.cn/*
// @match        https://studio.zte.com.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAABHNCSVQICAgIfAhkiAAAAQtJREFUSInt1c1Kw0AUhuFTF8kFTJnAFFwKYrHQUjE0Fq2iOxG8Bn/vQ8SbEMX+oLhQ9+raXom9g0lI8roQBDdmFi0q5FsOfOdZDIdTAZAZZ27WQImUyC8ju3v7Ug1q0tva+fZ+dn4h1aAmYacreZ7/PISCPL+8orRBacPbeAyAtZaFxTpKG27v7otGUIgAbGxuo7Th4OgEgMFwhNKGVjskTdPpIA+PTyhtCMw875MJ671PtD8YudTdkCzLWFmNUNpweHyK0oZGs02SJNNDAG76w6+/UdpweXXtWnVH4jim3mihtGFpuYm11hlx3hPP86S7FomISNQJxfd91+ofWcZ/g1SgPL8lUiIF+QCIeCJE+P0wYgAAAABJRU5ErkJggg==
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/515892/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90Cypress%E7%94%A8%E4%BE%8B%E7%BB%93%E6%9E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/515892/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90Cypress%E7%94%A8%E4%BE%8B%E7%BB%93%E6%9E%84.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(
    `#generate_st_btn {
        height: 28px;
        padding: 4px 8px;
        background: #07f;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    #generate_st_alert {
        display: none;
        position: fixed;
        top: 5%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 99999;
    }`
  );

  // 用例作者
  const defaultName = "";

  window.onpopstate = function () {
    main();
  };

  function main() {
    const targetSelector = ".item-detail-lay";
    const typeContent = "测试用例";

    // 创建按钮元素
    function createButton(container) {
      if (document.querySelector("#generate_st_btn")) return;

      const button = document.createElement("button");
      button.id = "generate_st_btn";
      button.textContent = "生成Cypress用例结构";
      button.onclick = () => {
        generateCode();
      };

      container.parentNode.insertBefore(button, container.nextSibling);
    }

    // 创建提示框
    function createAlertBox() {
      if (!document.getElementById("generate_st_alert")) {
        const alertBox = document.createElement("div");
        alertBox.id = "generate_st_alert";
        document.body.appendChild(alertBox);
      }
    }

    // 处理新添加的节点
    function handleAddedNodes(addedNodes) {
      for (const node of addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        const popup = document.querySelector(targetSelector);
        if (!popup) return;

        const typeElement = popup.querySelector(".work-item-type-name");
        if (!typeElement || !typeElement.textContent.includes(typeContent)) {
          return;
        }

        createAlertBox();

        const insertAfterElement = popup.querySelector(
          ".tag_wrapper.tags-view"
        );
        if (insertAfterElement) {
          createButton(insertAfterElement);
        }
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          handleAddedNodes(mutation.addedNodes);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  main();

  // 生成用例结构
  function generateCode() {
    // 1、获取标题
    const titleEle = document.getElementById("input-title");
    const title = titleEle.value.trim();
    // 2、获取作者
    const authorEle = document.querySelector(
      ".System_AppointedTo-key-field-content"
    );
    const author = authorEle.textContent.match(/[\u4e00-\u9fa5]+/g)?.[0] || "";
    // 3、切换到基本信息页签，获取领域标签和自动化领域大类标签
    const basicInfoTab = $('.el-tabs__item:contains("基本信息")');
    basicInfoTab?.click();
    scrollContainer("pane-page_2317");
    setTimeout(() => {
      const areaTag = getAreaTag();
      const majorTags = getMajorTags();
      const tags = areaTag ? [areaTag, ...majorTags] : majorTags;
      const tagsString =
        tags.length === 0
          ? "[]"
          : JSON.stringify(
              Array.from(
                new Set(
                  tags
                    .map((item) => item.match(/@\w+/g)) // 匹配@开头的单词
                    .flat() // 将结果展开为一维数组
                    .filter(Boolean) // 过滤掉 null 或 undefined 的值
                )
              )
            ).replace(/,/g, ", ");
      // 4、切换到步骤页签，获取领域标签和自动化领域大类标签
      const stepTab = $('.el-tabs__item:contains("步骤")');
      stepTab?.click();
      setTimeout(() => {
        scrollContainer("pane-page_2318");
        setTimeout(() => {
          const textareaContents = $(
            ".Steps-key-field-content textarea.el-textarea__inner"
          )
            .map(function () {
              return $(this).val(); // 获取每个 <textarea> 的内容
            })
            .get(); // 将 jQuery 对象转换为纯数组
          const stepCode = textareaContents
            .map((line) => `// ${line.trim()}`)
            .join("\n");

          // 5、生成用例结构代码
          const result = `it('${title}【作者-${
            defaultName || author
          }】', { tags: ${tagsString} }, function () {\n${stepCode}\n})`;
          GM_setClipboard(result);
          showAlert(
            "用例结构已生成到剪切板，请粘贴到Cypress项目中。",
            "success"
          );
        }, 500);
      }, 500);
    }, 800);
  }

  // 显示提示信息
  function showAlert(textContent, type, duration = 1500) {
    const alertBox = document.getElementById("generate_st_alert");
    if (type === "success") {
      alertBox.style.backgroundColor = "#d4edda";
    } else {
      alertBox.style.backgroundColor = "#f8d7da";
    }
    alertBox.textContent = textContent;
    alertBox.style.display = "block";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, duration);
  }

  // 获取领域标签
  function getAreaTag() {
    const areaPathEle = document.querySelector(
      ".System_AreaPath-key-field-content input"
    );
    if (!areaPathEle) {
      showAlert(
        "【领域】字段未获取到，可能是您的页面分辨率过低，请滚动基本信息页签内容后重试！",
        "error",
        2500
      );
      throw new Error("【领域】字段未获取到");
    }
    const areaPath = areaPathEle.value.trim();
    const areaPathMap = {
      LCAP远航团队: "@ProEnvCsST",
      低代码长沙特性2组: "@ProEnvCsST",
      低代码南京特性1组: "@ProEnvNJ1ST",
      低代码三亚特性1组: "@ProEnvSY1ST",
      南京工作项中心1组: "@ProEnvGZX1ST",
      南京工作项中心2组: "@ProEnvGZX2ST",
    };
    return areaPathMap[areaPath] || "";
  }

  // 获取自动化领域大类标签
  function getMajorTags() {
    const parentElement = document.querySelector(
      ".AreaMajorCategory-key-field-content"
    );
    if (!parentElement) {
      showAlert(
        "【自动化领域大类】字段未获取到，可能是您的页面分辨率过低，请滚动基本信息页签内容后重试！",
        "error",
        2500
      );
      throw new Error("【自动化领域大类】字段未获取到");
    }
    const spanElements = parentElement.querySelectorAll(
      ".el-select__tags-text"
    );
    const textArray = Array.from(spanElements).map((span) => span.textContent);
    return textArray;
  }

  // 滚动指定容器，加载内容
  function scrollContainer(id) {
    const container = document.getElementById(id);
    container.scrollTop = 0;
    // 记录滚动的次数
    var i = 1;
    function scroll() {
      if (
        Math.ceil(container.scrollTop + container.clientHeight) + 5 >=
        container.scrollHeight
      ) {
        clearInterval(interval);
        // 回到顶部
        container.scrollTop -= 200 * i;
      } else {
        i++;
        container.scrollTop += 200;
      }
    }
    var interval = setInterval(scroll, 0);
  }
})();
