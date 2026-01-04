// ==UserScript==
// @name         秘火前端自动发布
// @version      6.2
// @description  秘火前端自动发布，无需等待，如果别人占用发布则会轮询请求直到发布成功，加入commit功能，自动发布可以加入自定义的提交信息
// @author       HouWin
// @match        http://192.168.1.151:*/manage/
// @match        http://223.71.127.14:*/manage/
// @icon         http://img.houm.cn/%E7%93%A6%E5%8A%9B2.png
// @grant        none
// @namespace https://greasyfork.org/users/1298884
// @downloadURL https://update.greasyfork.org/scripts/494476/%E7%A7%98%E7%81%AB%E5%89%8D%E7%AB%AF%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/494476/%E7%A7%98%E7%81%AB%E5%89%8D%E7%AB%AF%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("hello 油猴~");
  // 创建按钮元素
  var button = document.createElement("button");
  var SearchButton = document.createElement("input");
  var Message = document.createElement("div");
  Message.innerText = "";
  button.textContent = "自动发布";
  let timerId = null;
  function starttimerId() {
    if (timerId == null) {
      timerId = setTimeout(function () {
        fabu();
      }, 10000);
    }
  }
  // 设置按钮样式
  button.style.backgroundColor = "#0958d9";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.padding = "10px 20px";
  button.style.position = "fixed";
  button.style.bottom = "10px";
  button.style.right = "10px";
  button.style.cursor = "pointer";
  button.style.zIndex = "1000"; // 确保按钮在其他内容之上
  //设置搜索框样式
  SearchButton.style.zIndex = "1000";
  SearchButton.style.position = "fixed";
  SearchButton.style.bottom = "60px";
  SearchButton.style.right = "10px";
  SearchButton.placeholder = "输入菜单ID/标识/名称搜索";
  SearchButton.value = "fix:bug修复";
  SearchButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchFn();
    }
  });
  //设置提示信息样式
  Message.style.zIndex = "1000";
  Message.style.position = "fixed";
  Message.style.bottom = "100px";
  Message.style.right = "10px";
  Message.style.fontSize = "14px";
  //var saveBtn = document.getElementById('engineSaveButton')

  //初始发布按钮
  function resetFbBtn() {
    button.style.border = "none";
    button.style.backgroundColor = "#0958d9";
    button.style.color = "white";
    clearTimeout(timerId);
    timerId = null;
    button.textContent = "自动发布";
  }

  button.addEventListener("click", () => {
    if (button.textContent == "自动发布") {
      if (!SearchButton.value) {
        tongzhi("请输入commit内容");
        return false;
      }
      tongzhi("任务即将开始10s循环");
      starttimerId();
      button.style.backgroundColor = "white";
      button.style.color = "#575757";
      button.style.border = "1px solid #575757";
      button.textContent = "取消自动发布";
    } else {
      resetFbBtn();
    }
  });

  function isNumeric(str) {
    const pattern = /^[0-9]+\.?[0-9]*$/;
    return pattern.test(str);
  }
  function findObjectsByIdOrName(data, targetId, targetName) {
    let paths = [];

    function search(resources, currentPath) {
      for (let i = 0; i < resources.length; i++) {
        const item = resources[i];
        const newPath = [...currentPath, item.name]; // 构建新的路径

        // 如果当前项匹配，添加到路径数组
        if (
          item.id == targetId ||
          item.name === targetName ||
          item.address == targetName
        ) {
          paths.push(newPath);
        }

        // 如果有子项，递归搜索
        if (item.resources) {
          search(item.resources, newPath);
        }
      }
    }

    search(data, []); // 从根开始搜索

    return paths; // 返回所有找到的路径
  }

  // 将按钮添加到页面中
  document.body.appendChild(button);
  document.body.appendChild(SearchButton);
  document.body.appendChild(Message);
  async function searchFn() {
    console.clear();
    const value = SearchButton.value;
    try {
      const url = "/sf_dev/system/menu/list";
      const token = sessionStorage.getItem("token");
      const res = await fetch(url, {
        headers: {
          token: token,
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }

      const result = await res.json();
      let resultMeg = "";
      if (result.code === 200) {
        //判断是否为数字 如果是数字则按id查找
        if (isNumeric(value)) {
          resultMeg = findObjectsByIdOrName(result.data, value, "");
        } else {
          resultMeg = findObjectsByIdOrName(result.data, "", value);
        }
        if (resultMeg?.length) {
          tongzhi(resultMeg.join("\n").replace(/,/g, "➡️"), 100000);
        } else {
          tongzhi("没有符合的结果");
        }
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function tongzhi(content, time = 3000) {
    console.log(content);
    Message.innerText = content;
    clearTimeout(timerId2);
    Message.style.display = "block";
    var timerId2 = setTimeout(() => {
      Message.style.display = "none";
    }, time);
  }

  function timeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`请求超时`));
      }, 20000);
    });
  }

  async function fetchFn() {
    const url = "/sf_dev/system/menu/release";
    const token = sessionStorage.getItem("token");
    return await fetch(url, {
      method: "POST",
      headers: {
        token: token,
      },
      body: JSON.stringify({
        note: SearchButton.value,
      }),
    });
  }

  async function fabu() {
    try {
      const res = Promise.race([timeout(), fetchFn()])
        .then(async (result) => {
          if (!result.ok) {
            throw new Error("Network response was not ok " + res.statusText);
          }
          const resultJson = await result.json();
          if (resultJson.code == 500 && button.textContent == "取消自动发布") {
            clearTimeout(timerId);
            timerId = null;
            starttimerId();
            tongzhi("自动发布失败:" + resultJson.msg);
          }
          if (resultJson.code == 200) {
            tongzhi("自动发布成功:" + resultJson.msg);
          }
        })
        .catch((error) => {
          if (error == "Error: 请求超时") {
            tongzhi("自动发布成功", 100000);
            resetFbBtn();
          } else {
            button.textContent = "失败，请检查系统是否正常运行";
          }
        });
      // console.log(res)
    } catch (error) {
      console.log(error);
    }
  }
})();
