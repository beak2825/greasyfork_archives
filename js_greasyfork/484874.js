// ==UserScript==
// @name         通途关键词检查
// @namespace    http://maxpeedingrods.cn/
// @version      0.0.4
// @description  检查Listing关键词是否符合要求
// @license      No License
// @author       Knight
// @match        https://listing.tongtool.com/online/aliexpress/info.htm?listingId=*
// @match        https://listing.tongtool.com/draft/aliexpress/info.htm?id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/484874/%E9%80%9A%E9%80%94%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/484874/%E9%80%9A%E9%80%94%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

function start() {
  //创建检查按钮
  createCheckButton();
}

/**
 * 创建检查按钮
 */
function createCheckButton() {
  let button = document.createElement("button");
  button.className = "baseBtn";
  button.innerText = "关键词检查";
  button.id = "knight-kewords-check";
  button.style.width = "100px";
  button.style.backgroundColor = "#0089cf";
  button.style.color = "#ffffff";
  button.style.border = "none";
  button.style.height = "30px";
  button.style.cursor = "pointer";

  button.onclick = function () {
    //获取标题
    let title = $("table:first").first().find(".textbox-value").val();

    //获取属性
    let dataOne = $(
      "#rootEle > div > table > tbody > tr:nth-child(5)  table"
    ).find("input[type=text]");
    let dataTwo = [];
    dataOne.each(function () {
      dataTwo.push($(this).val());
    });

    //获取PC描述
    let pcDesc = getPcDesc();
    //获取移动端描述
    let mobileDesc = getMobileDesc();

    let desc = dataTwo + pcDesc + mobileDesc;

    postCheckKeywords(title, desc);

    return false;
  };

  document.querySelector("#btnbar").append(button);
}

/**
 * 查询检测结果
 */
function postCheckKeywords(title, desc) {
  let url = "http://120.24.251.138/index.php/ajax/checkBrandKeywords?key=123";
  let timeout = 60 * 1000;
  let myData = new FormData();
  myData.append("title", title);
  myData.append("desc", desc);

  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    timeout: timeout,
    data: myData,
    onload: function (response) {
      console.log(response);
      let result = JSON.parse(response.responseText);

      if (result.status == 0) {
        $.messager.alert("失败", result.info, "error");
        //alert("检查未过："+result.info);
      } else {
        $.messager.alert("成功", result.info, "info");
        //alert("检查通过："+result.info);
      }
    },
    onerror: function (e) {
      console.log(e);
      alert("检查异常：" + e.message);
    },
    ontimeout: function () {
      alert("检查超时");
    },
  });
}

function waitForElement(selector) {
  var element = $(selector); // 获取目标元素

  if (element.length > 0) {
    // 若元素已经存在于DOM中，则直接执行相应代码
    start();
  } else {
    setTimeout(function () {
      // 否则，每隔1000ms重新查找该元素，直到找到为止
      waitForElement(selector);
    }, 1000);
  }
}
function getMobileDesc() {
  const container = document.querySelector(
    "#rootEle > div > table > tbody > tr:nth-child(9) > td > div > div > div:nth-child(5) > table"
  );

  if (!container) {
    console.log("容器元素未找到");
    return "";
  }

  // 查找第二个td
  let targetTd = container.querySelector("tbody tr td:nth-child(2)");

  if (!targetTd) {
    console.log("未找到第二个td，检查HTML结构:");
    console.log(container.innerHTML.substring(0, 500) + "...");
    return "";
  }

  // 获取所有p标签
  const pTags = targetTd.querySelectorAll("div div p");
  //   console.log(`找到 ${pTags.length} 个p标签`);

  const pTexts = [];
  pTags.forEach((p, index) => {
    const text = p.textContent.trim();
    if (text) {
      pTexts.push(text);
      //   console.log(`p${index + 1}: "${text}"`);
    }
  });

  //   const mobileDesc = pTexts.join("\n\n");
  //   console.log("最终提取内容:", mobileDesc);

  return pTexts;
}

function getPcDesc() {
  let oIframe = document.getElementById("ueditor_0");
  let body = oIframe.contentWindow.document.getElementsByTagName("body")[0];

  // 查找 body > div > div 下的所有p标签
  const divDivElements = body.querySelectorAll("div > div");
  let allTexts = [];

  divDivElements.forEach((divDiv) => {
    // 在当前div>div下查找所有p标签
    const pTags = divDiv.querySelectorAll("p");
    pTags.forEach((p) => {
      const text = p.textContent.trim();
      if (text) {
        allTexts.push(text);
      }
    });
  });

  // return allTexts.join('\n\n');
  return allTexts;
}

(function () {
  "use strict";

  $(document).ready(function () {
    waitForElement(
      "#rootEle > div  table > tbody > tr:nth-child(1) > td > div.mb10.detail-max-width > div > div:nth-child(2) > span:nth-child(1) > span.textbox > textarea"
    );
  });
})();