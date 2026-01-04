// ==UserScript==
// @name        lolitabot格距导出
// @namespace   Violentmonkey Scripts
// @match       https://lolitabot.cn/draw-tartan/*
// @grant       none
// @version     1.0
// @author      -
// @description 2020/6/5 下午3:35:35
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/404723/lolitabot%E6%A0%BC%E8%B7%9D%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/404723/lolitabot%E6%A0%BC%E8%B7%9D%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

setTimeout(() => {
  /** @type {HTMLCollection} */
  var buttonList = document.getElementsByTagName("ion-button");

  /** @type {Element | null} */
  let saveButton = null;

  for (let button of buttonList) {
    if (button.textContent.includes("保存")) {
      saveButton = button;
      break;
    }
  }

  if (saveButton == null) {
    window.alert("未找到按钮");
  } else {
    // 保存图像
    let cloneButton = saveButton.cloneNode(true);
    saveButton.parentElement.append(cloneButton);
    cloneButton.textContent = "导出格距工程图🤣";
    saveButton.click();
    cloneButton.addEventListener("click", () => {
      const drawIdMatch = window.location.href.match(/draw-tartan\/(\d+)/);
      const drawId = drawIdMatch[1];
      let freeTartan = null;

      fetch("https://api.lolitabot.cn:444/api/v1/tartan?sort=createdAt.ascend", {
        credentials: "include",
      }).then(async (response) => {
        const result = await response.json();
        freeTartan = result.data[0];
        console.log("freeTartan", freeTartan);

        for (const item of result.data) {
          if (item.id == drawId) {
            return item;
          }
        }

        window.alert('未找到当前格子');
      })
      .then(data => {
        console.log(data);
        data.id = freeTartan.id;
        data.createdAt = freeTartan.createdAt;
        data.payStatus = 1;

        return fetch('https://api.lolitabot.cn:444/api/v1/tartan/' + freeTartan.id, {
          method: 'PUT',
          credentials: "include",
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      })
      .then(() => {
        window.location.href = `https://api.lolitabot.cn:444/api/v1/tartan/${freeTartan.id}/blueprint?type=png&style=normal&tartanStyle=cross`;
      });
    });
  }

}, 1000);
