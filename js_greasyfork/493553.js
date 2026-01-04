// ==UserScript==
// @name         阿尔法编程自动答题
// @namespace    http://tampermonkey.net/
// @version      2024-04-28
// @description  （1）导出自己的答案与别人分享（2）得到他人分享的答案导入后自动填写
// @author       盧瞳
// @match        *://*.alphacoding.cn/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alphacoding.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493553/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BC%96%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/493553/%E9%98%BF%E5%B0%94%E6%B3%95%E7%BC%96%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
var answerJson = null; // 定义一个变量来存储答案的 JSON 对象

function sleep(time) {
  var timeStamp = new Date().getTime();
  var endTime = timeStamp + time;
  while (true) {
    if (new Date().getTime() > endTime) {
      return;
    }
  }
}

function collectAnswers() {
  // 获取所有的按钮
  var buttons = document.querySelectorAll(".exercises-buttons button");

  // 创建一个新的 'click' 事件
  var event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  var typeList = ["单选题", "多选题", "判断题", "填空题", "程序填空", "编程题"];
  var answerLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  answers = [];

  function download(data) {
    // 将对象转换为 JSON 字符串
    var json = JSON.stringify(data, null, 4);
    // 创建一个新的 Blob 对象来存储这个字符串
    var blob = new Blob([json], { type: "application/json" });

    // 创建一个指向这个 Blob 的 URL
    var url = URL.createObjectURL(blob);

    // 创建一个新的 <a> 元素
    var a = document.createElement("a");

    // 设置它的 href 属性为这个 URL
    a.href = url;

    // 设置它的 download 属性为你想要的文件名
    a.download = "answers.json";

    // 触发这个 <a> 元素的 click 事件来下载这个文件
    a.click();
  }

  // 使用递归函数来循环点击按钮
  function clickButton(index) {
    // 如果 index 大于等于按钮的数量，就返回
    if (index >= buttons.length) {
      // 下载文件
      download(answers);
      return;
    }

    var button = buttons[index];

    // 分派事件
    button.dispatchEvent(event);

    // 使用 setTimeout 来实现延时
    setTimeout(async function () {
      // 获取 题目类型
      var typeElement = document.querySelector(".exercise-type-name");
      var type = typeElement.textContent;

      switch (type) {
        case "单选题":
          var inputs = document.querySelectorAll(".choice-options-list input");
          var answer_index = -1;
          // 遍历所有 input 元素
          inputs.forEach(function (input, index) {
            // 如果 input 元素被选中
            if (input.checked) {
              // 将 input 元素的编号添加到数组中
              answer_index = index;
            }
          });
          // 获取题目
          var rich_content = document.querySelectorAll(".rich-content");
          question_content = rich_content[0].textContent;
          // 获取选项
          if (answer_index != -1) {
            var letter = answerLetters[answer_index];
            var options = rich_content[answer_index + 1].textContent;
          } else {
            var letter = "无答案";
            var options = "";
          }
          answers.push({
            type: type,
            answers: { question_content, letter, options },
          });
          break;

        case "多选题":
          var inputs = document.querySelectorAll(".choice-options-list input");
          var answer_index = [];
          // 遍历所有 input 元素
          inputs.forEach(function (input, index) {
            // 如果 input 元素被选中
            if (input.checked) {
              // 将 input 元素的编号添加到数组中
              answer_index.push(index);
            }
          });
          // 获取题目
          var rich_content = document.querySelectorAll(".rich-content");
          question_content = rich_content[0].textContent;
          // 获取选项
          if (answer_index.length != 0) {
            var letter = [];
            var options = [];
            answer_index.forEach(function (index) {
              letter.push(answerLetters[index]);
              options.push(rich_content[index + 1].textContent);
            });
          } else {
            var letter = "无答案";
            var options = "";
          }
          answers.push({
            type: type,
            answers: { question_content, letter, options },
          });
          break;
        case "判断题":
          var inputs = document.querySelectorAll(".choice-options-list input");
          var answer_index = -1;
          // 遍历所有 input 元素
          inputs.forEach(function (input, index) {
            // 如果 input 元素被选中
            if (input.checked) {
              answer_index = index;
            }
          });
          // 获取题目
          var rich_content = document.querySelectorAll(".rich-content");
          question_content = rich_content[0].textContent;
          // 获取选项
          if (answer_index != -1) {
            var letter = answerLetters[answer_index];
            var options = rich_content[answer_index + 1].textContent;
          } else {
            var letter = "无答案";
            var options = "";
          }
          answers.push({
            type: type,
            answers: { question_content, letter, options },
          });
          break;
        case "填空题":
          var inputs = document.querySelectorAll(".blank");
          var blanks = [];
          // 遍历所有 input 元素
          inputs.forEach(function (input, index) {
            blanks.push(input.value);
          });
          // 获取题目
          var rich_content = document.querySelectorAll(".rich-content");
          question_content = rich_content[0].textContent;

          answers.push({ type: type, answers: blanks });
          break;
        case "程序填空":
          var inputs = document.querySelectorAll(".blank");
          var blanks = [];
          // 遍历所有 input 元素
          inputs.forEach(function (input, index) {
            blanks.push(input.value);
          });
          // 获取题目
          var rich_content = document.querySelectorAll(".rich-content");
          question_content = rich_content[0].textContent;

          answers.push({ type: type, answers: blanks });
          break;
        case "编程题":
          // 获取题目
          var rich_content = document.querySelectorAll(".rich-content");
          question_content = rich_content[0].textContent;

          // 获取有几部分代码
          codes = [];
          // 获取CodeMirror实例
          var codeMirrorElement = document.querySelector(".CodeMirror");
          var codeMirrorInstance = codeMirrorElement.CodeMirror;

          // 获取所有 class 为 .el-tabs__item 的元素
          var tabs = document.querySelectorAll(".el-tabs__item");
          //   遍历所有元素
          async function getValue(index) {
            if (index >= tabs.length) {
              return;
            }
            var tab = tabs[index];
            tab.click();
            await new Promise((resolve) => setTimeout(resolve, 500));
            // 如果元素的 id 不为 tab-console 和 tab-exercise
            if (tab.id !== "tab-console" && tab.id !== "tab-exercise") {
              // 获取元素的文本内容
              // 点击元素
              // 获取当前标签页的代码
              var content = codeMirrorInstance.getValue();
              codes.push({ file: tab.textContent, content: content });
            }
            await getValue(index + 1);
          }
          await getValue(0);
          answers.push({ type: type, answers: codes });
          break;
      }
      clickButton(index + 1);
    }, 1000);
  }

  clickButton(0);
}

async function fillAnswers() {
  lettersIndex = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9 };

  // 获取当前选中的按钮
  var button = document.querySelector(".exercise-nav-btn.current");
  // 获取按钮的索引
  var index = parseInt(button.textContent) - 1;
  // 获取答案
  var answer = answerJson[index];

  // 创建一个新的事件
  var inputEvent = new Event("input", {
    bubbles: true,
    cancelable: true,
  });

  // 根据题目类型填写答案
  switch (answer.type) {
    case "单选题":
      var inputs = document.querySelectorAll(".choice-options-list input");

      // 取消之前所有的选择
      inputs.forEach(function (input) {
        input.checked = false;
      });

      var answer_index = lettersIndex[answer.answers.letter];
      inputs[answer_index].click();
      break;
    case "多选题":
      var inputs = document.querySelectorAll(".choice-options-list input");

      // 取消之前所有的选择  这里因为可能点多下，所以更改了支持异步操作的for of并添加了等待，避免操作过快
      for (let input of inputs) {
        if (input.checked) {
          input.click();
          // 等待 500 毫秒
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      for (let letter of answer.answers.letter) {
        var answer_index = lettersIndex[letter];
        inputs[answer_index].click();
        // 等待 500 毫秒
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      break;
    case "判断题":
      var inputs = document.querySelectorAll(".choice-options-list input");

      // 取消之前所有的选择
      inputs.forEach(function (input) {
        if (input.checked) {
          input.click();
        }
      });

      var answer_index = lettersIndex[answer.answers.letter];
      inputs[answer_index].click();
      break;
    case "填空题":
      var inputs = document.querySelectorAll(".blank");
      inputs.forEach(function (input, index) {
        // 触发事件
        input.value = answer.answers[index];
        input.dispatchEvent(inputEvent);
      });
      break;
    case "程序填空":
      var inputs = document.querySelectorAll(".blank");
      inputs.forEach(function (input, index) {
        // 触发事件
        input.value = answer.answers[index];
        input.dispatchEvent(inputEvent);
      });
      break;
    case "编程题":
      // 获取CodeMirror实例
      var codeMirrorElement = document.querySelector(".CodeMirror");
      var codeMirrorInstance = codeMirrorElement.CodeMirror;

      var tabs = document.querySelectorAll(".el-tabs__item");

      async function chnageValue(index) {
        if (index >= tabs.length) {
          // 下载文件
          return;
        }
        var tab = tabs[index];
        tab.click();
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (tab.id !== "tab-console" && tab.id !== "tab-exercise") {
          // 点击元素
          tab.click();
          // 填写代码
          // 遍历答案
          answer.answers.forEach(function (code) {
            if (tab.textContent === code.file) {
              codeMirrorInstance.setValue(code.content);
            }
          });
        }
        await chnageValue(index + 1);
        // setTimeout(function () {
        //   if (tab.id !== "tab-console" && tab.id !== "tab-exercise") {
        //     // 点击元素
        //     tab.click();
        //     // 填写代码
        //     // 遍历答案
        //     answer.answers.forEach(function (code) {
        //       if (tab.textContent === code.file) {
        //         codeMirrorInstance.setValue(code.content);
        //       }
        //     });
        //   }
        //   chnageValue(index + 1);
        // }, 500);
      }
      await chnageValue(0);
      break;
  }
}

function submit() {
  // 获取所有的按钮
  var buttons = Array.from(document.querySelectorAll("button"));
  // 过滤出文本为 "提交" 的按钮
  var submitButtons = buttons.filter(function (button) {
    return button.textContent.trim() === "提交";
  });
  var submitButton = submitButtons[0];
  submitButton.click();
}

// 当文档加载完毕时
window.onload = function () {
  // 定义一个变量来存储答案的 JSON 对象
  answerJson = null;

  // 创建一个新的 div 元素作为面板
  var panel = document.createElement("div");

  // 设置面板的 CSS 属性，使其位于屏幕的正中间
  panel.style.position = "fixed";
  panel.style.top = "50%";
  panel.style.left = "50%";
  panel.style.transform = "translate(-50%, -50%)";
  panel.style.zIndex = "9999";
  panel.style.backgroundColor = "#f8f9fa";
  panel.style.padding = "20px";
  panel.style.borderRadius = "5px";
  panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.15)";

  // 按钮css

  // 创建一个新的按钮元素
  var button = document.createElement("button");
  // 设置按钮的文本内容为 "导出答案"
  button.textContent = "导出答案";
  // 为按钮添加点击事件监听器
  button.addEventListener("click", function () {
    // 在这里执行你的下载操作
    // 例如，你可以调用一个函数来下载一个文件
    collectAnswers();
  });

  button.style.backgroundColor = "#f44336"; // Green
  button.style.border = "none";
  button.style.color = "white";
  button.style.padding = "10px 12px";
  button.style.textAlign = "center";
  button.style.textDecoration = "none";
  button.style.display = "inline-block";
  button.style.fontSize = "16px";
  button.style.margin = "4px 2px";
  button.style.cursor = "pointer";
  button.style.borderRadius = "4px";

  // 将按钮添加到面板中
  panel.appendChild(button);

  // 创建一个新的 input 元素
  var fileInput = document.createElement("input");
  // 设置 input 的 type 属性为 "file"
  fileInput.type = "file";
  // 为 input 添加 change 事件监听器
  fileInput.addEventListener("change", function () {
    // 获取用户选择的文件
    var file = fileInput.files[0];
    // 创建一个新的 FileReader 对象
    var reader = new FileReader();
    // 为 FileReader 添加 load 事件监听器
    reader.addEventListener("load", function () {
      // 获取文件的文本内容
      var text = reader.result;
      // 解析 JSON
      answerJson = JSON.parse(text);

      // 恢复按钮的状态
      //   submitButton.disabled = false;
      //   fillButton.disabled = false;

      alert("成功导入答案！");
      // 在这里处理解析后的 JSON 对象
      console.log(answerJson);
    });
    // 读取文件的文本内容
    reader.readAsText(file);
  });

  // 创建一个新的按钮元素
  var importButton = document.createElement("button");
  // 设置按钮的文本内容为 "导入答案"
  importButton.textContent = "导入答案";
  // 为按钮添加点击事件监听器
  importButton.addEventListener("click", function () {
    // 触发 input 的 click 事件，弹出文件选择对话框
    fileInput.click();
  });

  importButton.style.backgroundColor = "#4CAF50"; // Green
  importButton.style.border = "none";
  importButton.style.color = "white";
  importButton.style.padding = "10px 12px";
  importButton.style.textAlign = "center";
  importButton.style.textDecoration = "none";
  importButton.style.display = "inline-block";
  importButton.style.fontSize = "16px";
  importButton.style.margin = "4px 2px";
  importButton.style.cursor = "pointer";
  importButton.style.borderRadius = "4px";

  panel.appendChild(importButton);

  // 创建一个新的按钮元素
  var submitButton = document.createElement("button");
  // 设置按钮的文本内容为 "填写并提交"
  submitButton.textContent = "填写并提交";
  // 为按钮添加点击事件监听器
  submitButton.addEventListener("click", async function () {
    // 在这里执行你的填写并提交操作
    // 检查 answerJson 是否已经被定义
    if (answerJson === null || answerJson === undefined) {
      // 如果没有，弹出一个对话框，提示用户需要先导入答案
      alert("请先导入答案！");
      fileInput.click();
    } else {
      // 如果已经被定义，你可以在这里使用 answerJson
      await fillAnswers();
      submit();
    }
  });

  submitButton.style.backgroundColor = "#008CBA"; // Green
  submitButton.style.border = "none";
  submitButton.style.color = "white";
  submitButton.style.padding = "10px 12px";
  submitButton.style.textAlign = "center";
  submitButton.style.textDecoration = "none";
  submitButton.style.display = "inline-block";
  submitButton.style.fontSize = "16px";
  submitButton.style.margin = "4px 2px";
  submitButton.style.cursor = "pointer";
  submitButton.style.borderRadius = "4px";

  panel.appendChild(submitButton);

  // 创建一个新的按钮元素
  var fillButton = document.createElement("button");
  // 设置按钮的文本内容为 "填写并提交"
  fillButton.textContent = "填写答案";
  // 为按钮添加点击事件监听器
  fillButton.addEventListener("click", async function () {
    // 在这里执行你的填写并提交操作
    if (answerJson === null || answerJson === undefined) {
      // 如果没有，弹出一个对话框，提示用户需要先导入答案
      alert("请先导入答案！");
      fileInput.click();
    } else {
      // 如果已经被定义，你可以在这里使用 answerJson
      await fillAnswers();
    }
  });

  fillButton.style.backgroundColor = "#800080"; // Green
  fillButton.style.border = "none";
  fillButton.style.color = "white";
  fillButton.style.padding = "10px 12px";
  fillButton.style.textAlign = "center";
  fillButton.style.textDecoration = "none";
  fillButton.style.display = "inline-block";
  fillButton.style.fontSize = "16px";
  fillButton.style.margin = "4px 2px";
  fillButton.style.cursor = "pointer";
  fillButton.style.borderRadius = "4px";

  panel.appendChild(fillButton);

  // 禁用按钮
  //   submitButton.disabled = true;
  //   fillButton.disabled = true;

  // 将面板添加到文档的 body 中
  document.body.appendChild(panel);

  // 使面板可拖动
  var mouseDown = false;
  var offsetX = 0;
  var offsetY = 0;

  panel.addEventListener("mousedown", function (event) {
    mouseDown = true;
    offsetX = event.clientX - panel.offsetLeft;
    offsetY = event.clientY - panel.offsetTop;
  });

  window.addEventListener("mousemove", function (event) {
    if (mouseDown) {
      panel.style.left = event.clientX - offsetX + "px";
      panel.style.top = event.clientY - offsetY + "px";
    }
  });

  window.addEventListener("mouseup", function () {
    mouseDown = false;
  });
};