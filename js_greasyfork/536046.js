/**
 * ===========================================================
 * utils.js 工具函数文件 （注：此文件依赖于jquery，请确保require此文件前正确引入jquery。（正确引用代码块：// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js）
 *
 * 主要功能：
 * 1. 表单自动化操作 
 *    - waitForElement() : 等待元素加载
 *    - executeActions() : 顺序执行操作
 *    - bindButtonClick(): 绑定按钮点击事件
 * 2.JS添加CSS样式
 *   - addStyle() : 添加 CSS 样式到页面
 * ===========================================================
 */
/**
 * 公共方法：等待指定元素加载
 * @param {string} selector - 要等待的元素选择器
 * @param {function} callback - 元素加载完成后执行的回调函数
 * @example
 * waitForElement(".btn", () => {
 *   console.log("Button loaded");
 * });
 */
function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    if ($(selector).length > 0) {
      clearInterval(interval)
      callback()
    }
  }, 100) // 每 100ms 检查一次
}
/*
 * 公共方法：执行任务队列
 * @param {Array} actions - 操作数组，每个操作包含 ：selector（css选择器）、event（事件类型）、value（表单填写值） 和 delay（当前任务延时） 属性
 * @param {number} defaultDelay - 默认延时
 * @returns {Promise} - 返回一个 Promise 对象，表示所有操作完成
 * @example
 * executeActions([
 *   { selector: ".btn", event: "click" },
 *   { selector: "#input", event: "input", value: "Hello" },
 *   { selector: ".submit", event: "click", delay: 1000 }
 * ])
 */
function executeActions(actions, defaultDelay = 0) {
  actions.reduce((promise, action) => {
    return promise.then(() => {
      return new Promise((resolve, reject) => {
        try {
          waitForElement(action.selector, () => {
            if (action.event === "click") {
              $(action.selector).click(); // 执行点击事件
            } else if (action.event === "input" && action.value !== undefined) {
              const inputEvent = new Event('input', { bubbles: true });
              $(action.selector).val(action.value);
              $(action.selector)[0].dispatchEvent(inputEvent);
              // $(action.selector).val(action.value).trigger("input") // 执行输入事件
            }
            const delay = action.delay !== undefined ? action.delay : defaultDelay; // 确定延时
            if (delay > 0) {
              setTimeout(resolve, delay); // 延时处理
            } else {
              resolve(); // 无延时直接执行
            }
          });
        } catch (error) {
          reject(error); // 捕获并传递错误
        }
      });
    });
  }, Promise.resolve())
  .catch(error => {
    console.error("An error occurred during the execution of actions:", error);
  });
}


/**
 * 绑定按钮点击事件
 * @param {string} buttonSelector - 按钮选择器
 * @param {Array} actions - 操作数组
 * @param {number} defaultDelay - 默认延时
 * @example
 * bindButtonClick("span:contains('提报商保')", actionsForButton1, 0);
 */
function bindButtonClick2(buttonSelector, actions, defaultDelay = 0) {
  $(document).on("click", buttonSelector, function () {
    executeActions(actions, defaultDelay)
  })
}
function bindButtonClick(buttonSelector, actions, defaultDelay = 0) {
  $(document).on("click", function (event) {
    if ($(event.target).is(buttonSelector)) {
      executeActions(actions, defaultDelay)
    }
  })
}
/**
 * 初始化所有按钮及其任务
 * @param {Array} buttonActions - 按钮任务配置数组
 * @example
 * initializeButtonTasks([
 *   { buttonSelector: "span:contains('提报商保')", actions: actionsForButton1, defaultDelay: 0 },
 *   { buttonSelector: "span:contains('提报公积金')", actions: actionsForButton2, defaultDelay: 0 }
 * ]);
 */
function initializeButtonTasks(buttonActions) {
  buttonActions.forEach(button => {
    bindButtonClick(button.buttonSelector, button.actions, button.defaultDelay)
  })
}
/**
 * 添加 CSS 样式到页面
 * @param {string} cssContent - CSS 代码
 * @example
 * addStyle("body { background-color: #f5f5f5; }");
 */
function addStyle(cssContent) {
  // 创建一个 <style> 元素
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';

  // 检查浏览器支持的方式并添加 CSS 内容
  if (styleElement.styleSheet) {
    // 针对 IE 浏览器
    styleElement.styleSheet.cssText = cssContent;
  } else {
    // 现代浏览器
    styleElement.appendChild(document.createTextNode(cssContent));
  }

  // 将 <style> 元素添加到 <head> 中
  document.head.appendChild(styleElement);
}