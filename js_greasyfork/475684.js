// ==UserScript==
// @name         武大综测F2年度计算小工具
// @namespace    whu
// @version      1.2
// @author       game-loader
// @description  计算武大综测F2部分
// @homepage     https://github.com/game-loader
// @match        https://jwgl.whu.edu.cn/cjcx/cjcx_cxDgXscj.html*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475684/%E6%AD%A6%E5%A4%A7%E7%BB%BC%E6%B5%8BF2%E5%B9%B4%E5%BA%A6%E8%AE%A1%E7%AE%97%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/475684/%E6%AD%A6%E5%A4%A7%E7%BB%BC%E6%B5%8BF2%E5%B9%B4%E5%BA%A6%E8%AE%A1%E7%AE%97%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 创建小窗口
  var container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "50%";
  container.style.right = "20%";
  container.style.transform = "translate(50%, -50%)";
  container.style.backgroundColor = "#ffffff";
  container.style.padding = "20px";
  container.style.border = "1px solid #000000";
  container.style.zIndex = "1000";

  // 创建年份下拉框
  var yearSelect = document.createElement("select");
  yearSelect.innerHTML = `
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
    `;
  container.appendChild(yearSelect);

  // 添加距离
  var spacer = document.createElement("div");
  spacer.style.height = "10px";
  container.appendChild(spacer);

  // 创建计算按钮
  var calculateButton = document.createElement("button");
  calculateButton.textContent = "计算综测F2";
  calculateButton.style.backgroundColor = "#5cb3cc";
  calculateButton.style.color = "#ffffff";
  calculateButton.style.border = "none";
  calculateButton.style.borderRadius = "5px";
  calculateButton.style.padding = "8px 16px";
  calculateButton.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.4)";
  container.appendChild(calculateButton);

  // Create the query elective courses button
  var queryButton = document.createElement("button");
  queryButton.textContent = "查询选修课";
  queryButton.style.backgroundColor = "#5cb3cc";
  queryButton.style.color = "#ffffff";
  queryButton.style.border = "none";
  queryButton.style.borderRadius = "5px";
  queryButton.style.padding = "8px 16px";
  queryButton.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.4)";
  queryButton.style.marginLeft = "20px"; // Add space between the buttons
  container.appendChild(queryButton);
  // 创建位数选择下拉框
  var decimalSelect = document.createElement("select");
  decimalSelect.innerHTML = `
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
`;
  container.appendChild(decimalSelect);

  // 添加提示文本
  var decimalLabel = document.createElement("p");
  decimalLabel.textContent = "选择保留的小数位数：";
  container.insertBefore(decimalLabel, decimalSelect);

  // 将小窗口添加到页面中
  document.body.appendChild(container);

  // 设置小窗口样式
  container.style.width = "300px";
  container.style.height = "200px";
  container.style.overflow = "auto";

  // 获取gnmkdmKey的值
  var gnmkdmKey = document.getElementById("gnmkdmKey").value;

  // 构造请求URL和postData
  var url = "https://jwgl.whu.edu.cn/cjcx/cjcx_cxXsgrcj.html";
  var params = "doType=query&gnmkdm=" + encodeURIComponent(gnmkdmKey);

  // 最终请求URL
  var finalUrl = url + "?" + params;

  // Bind click event to the query button
  queryButton.addEventListener("click", function () {
    var postData =
      "xnm=" +
      yearSelect.value +
      "&xqm=&kcbj=&_search=false&nd=" +
      Date.now() +
      "&queryModel.showCount=50&queryModel.currentPage=1&queryModel.sortName=&queryModel.sortOrder=asc&time=0";
    // Perform the same POST request as the calculate button
    // console.log(postData);
    GM_xmlhttpRequest({
      method: "POST",
      url: finalUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: postData,
      onload: function (response) {
        var responseData = JSON.parse(response.responseText);
        let items = responseData.items;
        // console.log(items);

        // Only consider items where kcxzmc includes "选修"
        var electiveItems = items.filter((item) => {
          // console.log('item:', items[item]);
          // console.log('kcxzmc:', items[item] && items[item].kcxzmc);
          return (
            item && items[item].kcxzmc && items[item].kcxzmc.includes("选修")
          );
        });
        // Create a label above the elective list
        var electiveListLabel = document.createElement("p");
        electiveListLabel.textContent = "请选择计入必修的选修课";
        container.appendChild(electiveListLabel);
        // Display these items in a list with checkboxes
        var electiveList = document.createElement("ul");
        electiveList.style.listStyleType = "none";
        electiveList.style.border = "1px solid black"; // Add border to the list
        electiveList.style.padding = "10px"; // Add some padding
        electiveList.style.marginTop = "20px"; // Add margin at the top

        electiveItems.forEach((item) => {
          var listItem = document.createElement("li");
          listItem.style.marginTop = "5px";
          listItem.style.display = "flex"; // Use flex layout
          listItem.style.alignItems = "center"; // Center-align items vertically

          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = item.kcmc;
          checkbox.style.marginRight = "10px"; // Add some space between the checkbox and the label
          listItem.appendChild(checkbox);

          var label = document.createElement("label");
          label.textContent = item.kcmc;
          listItem.appendChild(label);

          electiveList.appendChild(listItem);
        });

        // Add the list to the container
        container.appendChild(electiveList);
      },
    });
  });

  // 绑定按钮点击事件
  calculateButton.addEventListener("click", function () {
    let postData =
      "xnm=" +
      yearSelect.value +
      "&xqm=&kcbj=&_search=false&nd=" +
      Date.now() +
      "&queryModel.showCount=70&queryModel.currentPage=1&queryModel.sortName=&queryModel.sortOrder=asc&time=0";
    // 发送POST请求
    GM_xmlhttpRequest({
      method: "POST",
      url: finalUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: postData,
      onload: function (response) {
        var responseData = JSON.parse(response.responseText);
        let items = responseData.items;
        // console.log(items);

        // 创建变量用于存储必修成绩、选修成绩和必修学分
        var requiredScore = 0;
        var electiveScore = 0;
        var requiredCredits = 0;

        // Get the selected elective courses
        var selectedElectives = Array.from(
          container.querySelectorAll('input[type="checkbox"]:checked'),
        ).map((input) => input.value);
        // Iterate through each item in the items array
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var kcxzmc = item.kcxzmc;
          var bfzcj = parseFloat(item.bfzcj);
          var xf = parseFloat(item.xf);

          if (kcxzmc.includes("必修")) {
            requiredScore += bfzcj * xf;
            requiredCredits += xf;
          } else if (kcxzmc.includes("选修")) {
            if (selectedElectives.includes(item.kcmc)) {
              // Treat the selected elective courses as required courses
              requiredScore += bfzcj * xf;
              requiredCredits += xf;
            } else {
              // Only consider the non-selected elective courses for the elective score
              electiveScore += bfzcj * xf;
            }
          }
        }

        // 计算必修课平均成绩和选修课成绩
        var requiredGrade = requiredScore / requiredCredits;
        var electiveGrade = electiveScore * 0.002;

        // 在窗口中显示结果
        var resultElement = document.createElement("div");
        resultElement.style.marginTop = "10px";
        resultElement.textContent =
          "必修课： " +
          requiredGrade.toFixed(decimalSelect.value) +
          "，选修课： " +
          electiveGrade.toFixed(decimalSelect.value) +
          ",总成绩：" +
          (requiredGrade + electiveGrade).toFixed(decimalSelect.value);
        container.appendChild(resultElement);
      },
    });
  });
})();
