// ==UserScript==
// @name         求职魔法师 - 求职神器｜智能填充工作信息｜免去输入烦恼
// @namespace    http://t.net/1
// @version      0.91
// @description  点击输入框时请求ChatGPT，并显示智能建议供选择，点击一键填充输入框
// @author       jiguang
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501353/%E6%B1%82%E8%81%8C%E9%AD%94%E6%B3%95%E5%B8%88%20-%20%E6%B1%82%E8%81%8C%E7%A5%9E%E5%99%A8%EF%BD%9C%E6%99%BA%E8%83%BD%E5%A1%AB%E5%85%85%E5%B7%A5%E4%BD%9C%E4%BF%A1%E6%81%AF%EF%BD%9C%E5%85%8D%E5%8E%BB%E8%BE%93%E5%85%A5%E7%83%A6%E6%81%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/501353/%E6%B1%82%E8%81%8C%E9%AD%94%E6%B3%95%E5%B8%88%20-%20%E6%B1%82%E8%81%8C%E7%A5%9E%E5%99%A8%EF%BD%9C%E6%99%BA%E8%83%BD%E5%A1%AB%E5%85%85%E5%B7%A5%E4%BD%9C%E4%BF%A1%E6%81%AF%EF%BD%9C%E5%85%8D%E5%8E%BB%E8%BE%93%E5%85%A5%E7%83%A6%E6%81%BC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // OpenAI API 的密钥
  const API_KEY = "sk-XXXXXXX"; // 请替换为你的 OpenAI API 密钥

  // 向 OpenAI API 发送请求
  const fetchSuggestions = async (inputHTML, isTextarea) => {
    // 获取 body 的 innerText
    let text = document.body.innerText;

    // 截取前 1000 个字符或全部内容（如果少于 1000 个字符）
    let first1000Chars = text.length > 1000 ? text.slice(0, 1000) : text;
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `我的名字：张三
        手机号：13111112222
        身份证号：111211199012011111
        生日：1991年1月1日
        地址：北京市
        邮箱(密码可以是邮箱)：1@foxmail.com
        求职意向：Web 开发

        教育背景：

        - 2016.9-2020.6 清华大学软件工程专业，专业排名年级前 10%
        - 主修课程：操作系统、计算机组成原理、计算机网络、数据结构与算法、C 语言程序设计、Java 语言程序设计、JavaWeb 开发与框架开发、Python 程序开发、嵌入式开发、Linux 操作系统、软件工程、软件测试、项目管理等

        工作经历：

        - 2022.02-2022.05 XXX有限公司 Python 后端工程师
          - XXXXX
        - 2022.06-2023.12 XXX公司 Java后端工程师
          - XXXXX
        - 2024.2 至今 XXXX公司 技术总监
          - 负责技术管理工作

        技能荣誉：

        - 校级奖学金 2019-6

        自我评价：
        我具备较强的问题解决能力。在面对挑战时，我能够冷静分析情况，快速找出解决方案并付诸实施。这使我在项目进程中能够保持高效运作，并不断推动工作向前发展。在专业技能方面，我不断学习和提升自己，通过参加培训和阅读相关书籍，积累了丰富的知识和经验。我对新事物保持开放的态度，乐于尝试新的工作方法，力求在工作中寻求创新和突破。
        。`,
            },
            {
              role: "user",
              content: `网页信息： ${first1000Chars}`,
              //content: `网页信息： ${document.body.innerHTML}`,
            },
            {
              role: "user",
              content: `要填充的元素： ${inputHTML}`,
            },
            {
              role: "user",
              content: `请基于以上HTML内容和我的个人信息，推测3-6条我要需要填充进去的内容${
                isTextarea ? "(每条不少于200字)" : ""
              }，一行一个，请你只回复推测结果的内容，不要有其他内容，也不要有序号`,
            },
          ],
          max_tokens: isTextarea ? 3000 : 300,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim()?.split("\n") || [];
  };

  // 创建下拉框
  const createDropdown = () => {
    const dropdown = document.createElement("div");
    dropdown.style.position = "absolute";
    dropdown.style.display = "none";
    dropdown.style.backgroundColor = "white";
    dropdown.style.border = "1px solid #ccc";
    dropdown.style.zIndex = "1000";
    dropdown.style.maxHeight = "150px";
    dropdown.style.overflowY = "auto";
    dropdown.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.3)";
    return dropdown;
  };

  // 创建加载动画
  const createLoadingSpinner = () => {
    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";
    spinner.style.position = "absolute";
    spinner.style.border = "4px solid #f3f3f3";
    spinner.style.borderTop = "4px solid #3498db";
    spinner.style.borderRadius = "50%";
    spinner.style.width = "20px";
    spinner.style.height = "20px";
    spinner.style.animation = "spin 1s linear infinite";
    spinner.style.zIndex = "1001"; // 确保加载动画在最上层
    return spinner;
  };

  // 在输入框上点击时显示下拉列表
  const attachDropdownToInput = (input) => {
    let dropdown = createDropdown(); // 创建下拉框
    let spinner = createLoadingSpinner(); // 创建加载动画
    document.body.appendChild(dropdown); // 将下拉框添加到DOM
    document.body.appendChild(spinner); // 将加载动画添加到DOM
    let isDropdownVisible = false; // 下拉框是否可见的标记

    input.addEventListener("focus", async (event) => {
      const rect = event.target.getBoundingClientRect();
      dropdown.style.left = `${rect.left + window.scrollX}px`;
      dropdown.style.top = `${rect.bottom + window.scrollY}px`;
      spinner.style.left = `${rect.left + window.scrollX}px`; // 移动到左上角
      spinner.style.top = `${rect.top + window.scrollY - 30}px`; // 移动到左上角
      spinner.style.display = "block"; // 显示加载动画

      // 请求 OpenAI API 获取建议
      try {
        const isTextarea = input.tagName.toLowerCase() === "textarea";
        const suggestions = await fetchSuggestions(input.outerHTML, isTextarea);
        dropdown.innerHTML = ""; // 清空之前的选项

        suggestions.forEach((optionValue) => {
          const option = document.createElement("div");
          option.textContent = optionValue;
          option.style.padding = "5px 10px";
          option.style.cursor = "pointer";

          option.addEventListener("click", () => {
            input.value = ""; // 先清空输入框
            const inputEvent = new Event("input", { bubbles: true }); // 创建输入事件
            for (let char of optionValue.replace(/\s+/g, "")) {
              input.value += char; // 模拟逐字符输入
              input.dispatchEvent(inputEvent); // 触发输入事件
            }
            dropdown.style.display = "none"; // 选择后隐藏下拉列表
            isDropdownVisible = false; // 更新标记
          });

          option.addEventListener("mouseenter", () => {
            option.style.backgroundColor = "#f0f0f0"; // 高亮显示
          });

          option.addEventListener("mouseleave", () => {
            option.style.backgroundColor = "white"; // 恢复颜色
          });

          dropdown.appendChild(option);
        });

        dropdown.style.display = "block"; // 显示下拉列表
        isDropdownVisible = true; // 更新标记
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        dropdown.innerHTML = '<div style="padding:10px;">无法获取建议</div>';
        dropdown.style.display = "block"; // 显示错误信息
        isDropdownVisible = true; // 更新标记
      } finally {
        spinner.style.display = "none"; // 隐藏加载动画
      }
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (!isDropdownVisible) {
          dropdown.style.display = "none"; // 隐藏下拉框
        }
      }, 150); // 延迟以容许选择下拉框选项
    });

    // 在下拉框聚焦时，用户交互时更改标记
    dropdown.addEventListener("mouseenter", () => {
      isDropdownVisible = true; // 进入下拉框时标记为可见
    });

    dropdown.addEventListener("mouseleave", () => {
      isDropdownVisible = false; // 离开下拉框时标记为不可见
      dropdown.style.display = "none"; // 隐藏下拉框
    });
  };

  // 查找所有的输入框和文本区域并嵌入下拉列表
  const updateInputs = () => {
    const inputs = document.querySelectorAll(
      "input:not([updated]), textarea:not([updated])"
    );

    inputs.forEach((input) => {
      if (
        input.tagName.toLowerCase() === "textarea" ||
        ["text", "password", "email", "search", "url", "tel"].includes(
          input.type
        )
      ) {
        attachDropdownToInput(input);
        input.setAttribute("updated", "true");
      }
    });
  };

  // 每隔3秒执行一次
  setInterval(updateInputs, 3000);

  // 添加 CSS 动画
  const style = document.createElement("style");
  style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loading-spinner {
        display: none;
      }
    `;
  document.head.appendChild(style);
})();
