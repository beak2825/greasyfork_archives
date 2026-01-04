// ==UserScript==
// @name         抖音历史记录搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音历史记录搜索，有时候想过一会再看的视频，等到想看的时候却找不到了，抖音网页版官方的历史记录搜索功能又不好用，于是写了这个脚本
// @author       You
// @match        https://www.douyin.com/user/self?showTab=record
// @icon         https://www.douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462895/%E6%8A%96%E9%9F%B3%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/462895/%E6%8A%96%E9%9F%B3%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 获取数据函数，返回一个字典列表
function getData() {
  // 获取所有类名为record_card的元素
  const recordCards = document.querySelectorAll(".record_card");
  // 构建字典列表
  const dictList = [];
  recordCards.forEach((card) => {
    const a = card.querySelector("a");
    const img = card.querySelector("img");
    const p = card.querySelector("p");
    // 将a标签链接、img链接和p的innerHTML保存到字典中
    dictList.push({ link: a.href, img: img.src, text: p.innerHTML });
  });
  return dictList;
}

// 主函数
function main() {

  // 将输入框和按钮按照指定格式添加到bbec3J8x的儿子节点里
  const container = document.createElement("div");

  container.innerHTML =
    '<div style="margin-left:10px;" class="lPytbapz XClSex3D QkLBoTmY nihbySfV"><form class="zyznJl4l" action="" target="_blank"><input class="igFQqPKs qYYUxsS2" data-e2e="searchbar-input" type="text" maxlength="100" placeholder="搜索历史记录" value=""><input type="submit" value="Submit" style="display: none;"></form><button class="rB8dMXOc" data-e2e="searchbar-button" type="button"><svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" class="FhOy97Hs"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.875 1.5a6.375 6.375 0 103.642 11.608l3.063 3.063a1.125 1.125 0 001.59-1.591l-3.062-3.063A6.375 6.375 0 007.875 1.5zM3.75 7.875a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0z" fill="#4F5168"></path></svg><span class="btn-title">搜索</span></button></div>';
  document.querySelector(".bbec3J8x > div").append(container);
  // 创建结果div并美化样式，包括居中、背景颜色、边框、阴影等
  const resultDiv = document.createElement("div");
  resultDiv.style.display = "none";
  resultDiv.style.position = "fixed";
  resultDiv.style.top = "50%";
  resultDiv.style.left = "50%";
  resultDiv.style.transform = "translate(-50%, -50%)";
  resultDiv.style.backgroundColor = "#f2f2f2";
  resultDiv.style.padding = "20px";
  resultDiv.style.borderRadius = "10px";
  resultDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, .5)";
  resultDiv.style.zIndex = "9999"; // 添加z-index属性
  resultDiv.style.maxHeight = "80vh"; // 设置最大高度
  resultDiv.style.overflowY = "auto"; // 添加滚动条
  //resultDiv.style.display = 'flex'; // 设置布局为flex
  resultDiv.style.flexDirection = "column"; // 设置方向为列
  container.appendChild(resultDiv);

  // 搜索操作的函数功能：在dictList中查找input里的内容，如果找到，把所有的匹配项在resultDiv中呈现，包括图片和文字
  function search() {
  const dictList = getData(); // 获取数据
    const keyword = input.value.toLowerCase(); // 将输入内容转换为小写
    const matches = dictList.filter((dict) =>
      dict.text.toLowerCase().includes(keyword)
    ); // 在字典列表中查找匹配项
    // 如果结果为空，显示结果为空
    if (matches.length === 0) {
      resultDiv.innerHTML = '<p style="text-align:center;">结果为空<br>请尝试将网页下滑加载更多记录后再次搜索</p>';
      resultDiv.style.display = "block";
    } else {
      // 如果有匹配项，将匹配的项以链接和图片的形式展示到resultDiv中
      resultDiv.innerHTML = `一共搜索到了${matches.length}个结果<br><br>`;
      matches.forEach((match) => {
        const cardDiv = document.createElement("div");
        cardDiv.style.display = "flex";
        cardDiv.style.alignItems = "center";
        cardDiv.style.marginBottom = "10px"; // 添加下边距
        // 创建包含图片和文字的div容器
        const contentDiv = document.createElement("div");
        contentDiv.style.display = "flex";
        contentDiv.style.alignItems = "center";
        contentDiv.style.flexGrow = "1"; // 设置弹性增长系数
        // 创建图片元素
        const img = document.createElement("img");
        img.src = match.img;
        img.style.width = "100%";
        img.style.maxWidth = "200px"; // 设置最大宽度
        img.style.borderRadius = "10px";
        img.style.marginRight = "10px"; // 添加右边距
        // 创建a标签元素
        const a = document.createElement("a");
        a.href = match.link;
        a.target = "_blank";
        a.style.textDecoration = "none"; // 去除下划线
        a.innerHTML = match.text;
        // 将图片和a标签添加到contentDiv中
        contentDiv.appendChild(img);
        contentDiv.appendChild(a);
        // 将contentDiv添加到cardDiv中
        cardDiv.appendChild(contentDiv);
        // 将cardDiv添加到resultDiv中
        resultDiv.appendChild(cardDiv);
      });
      resultDiv.style.display = "block";

    }
      // 在结果div中添加关闭按钮
      const closeButton = document.createElement("p");
      closeButton.innerHTML = "X";
      closeButton.style.position = "absolute";
      closeButton.style.top = "10px";
      closeButton.style.right = "10px";
      closeButton.addEventListener("click", () => {
        resultDiv.style.display = "none";
      });
            resultDiv.appendChild(closeButton);
  }

    const input = container.querySelector("input"); // 获取输入框元素
    const button = container.querySelector("button"); // 获取按钮元素

    button.addEventListener("click", search); // 给按钮绑定获取搜索操作
}

main(); // 调用主函数

})();