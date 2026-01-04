// ==UserScript==
// @name         SS同盟信息增强
// @namespace    3BBBC94E5807338FF2A3A63A253333D049DECC00
// @version      0.2.1
// @description  自动计算积分并显示在用户资料页面
// @author       syd
// @license      2022 up to now, syd All Rights Reserved
// @match        https://sstm.moe/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sstm.moe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447658/SS%E5%90%8C%E7%9B%9F%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447658/SS%E5%90%8C%E7%9B%9F%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

const parseData = () => {
  let data = {
    content: 0,
    jc: undefined,
    luck: undefined,
  };
  const parseNumber = (num_str) => {
    return parseFloat(num_str.replaceAll(/[^\d\.\-]/g, ""));
  };
  let content_node = document.querySelector("#elProfileStats > ul > li");
  data.content = content_node ? parseNumber(content_node.innerText) : 0;
  for (const line of document.querySelectorAll(
    ".ipsDataItem_main:not(.ipsType_break)"
  )) {
    if (line.innerText.endsWith("J")) {
      data.jc = parseNumber(line.innerText);
    } else if (line.innerText.endsWith("F")) {
      data.luck = parseNumber(line.innerText);
    }
  }
  return data;
};

const calculatePoints = (data) => {
  let points_node = document.createElement("li");
  points_node.setAttribute("class", "ipsDataItem");
  const points = parseInt(data.content * 0.3 + data.luck * 10 + data.jc * 0.03);
  points_node.innerHTML = `<span class="ipsDataItem_generic ipsDataItem_size3 ipsType_break"><strong>积分</strong></span>
<span class="ipsDataItem_main ipsType_break" style="color: red;"><strong>${points}</strong></span>`;
  let username = "";
  for (const title of document.querySelectorAll(".ipsPageHead_barText")) {
    username =
      username === "" ? title.innerText : `${title.innerText} ${username}`;
  }
  console.info(`[SSTM] ${username}`, data, `=> ${points}`);
  let profile_node = document.querySelector(".cProfileFields");
  let first_line_node = profile_node.querySelector(".ipsDataItem");
  if (first_line_node) {
    profile_node.insertBefore(points_node, first_line_node);
  } else {
    profile_node.append(points_node);
  }
};

(function () {
  "use strict";
  let timer = setInterval(() => {
    const result = parseData();
    if (result.jc !== undefined) {
      clearInterval(timer);
      calculatePoints(result);
    }
  }, 1000);
})();
