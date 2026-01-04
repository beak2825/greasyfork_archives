// ==UserScript==
// @name         每日直播新材料(崩坏星穹铁道)
// @namespace    none
// @version      2.5.2.3
// @description  1
// @author       LynLuc
// @match        *://live.bilibili.com/0*
// @grant        none
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503938/%E6%AF%8F%E6%97%A5%E7%9B%B4%E6%92%AD%E6%96%B0%E6%9D%90%E6%96%99%28%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503938/%E6%AF%8F%E6%97%A5%E7%9B%B4%E6%92%AD%E6%96%B0%E6%9D%90%E6%96%99%28%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%29.meta.js
// ==/UserScript==

//v0.12改动
// 修复材料码的浮空按钮点不到//
// 增加一个活动导航//
// 增加一个直播页面导航//
//刷新奖励列表,重置变量//
//材料列表刷新功能
//其他列表滚动条//

//v0.13
//部分重构//
//用户头像//
//串流码页面//
//一键复制简易的材料码(按顺序)//
// 材料码页面增加任务进度
//增加绝区0扩展//
//增加直播天数显示

//v0.2
//未获取到csrf时直接获取奖励列表
//增加挂播室,与相关的功能

//修正网页
// let burl = window.location.href;
// if (!(burl.indexOf("live.bilibili.com/04") !== -1)) {
//   window.location.replace("https://live.bilibili.com/04");
// }
let bnum = 0;
let web_location = 888.81821;
(function delOriginHtml() {
  if (bnum >= 10) {
    return;
  }
  bnum++;
  // 获取body元素
  const body = document.body;
  document.title = "直播工具";

  // 收集所有不包含'h-100'类的子元素
  // 注意：这里我们使用Array.from()将NodeList转换为数组，以便使用filter等方法
  const elementsToRemove = Array.from(body.children).filter((element) => {
    // 使用classList.contains()检查元素是否不包含'h-100'类
    return (
      !element.classList.contains("protected") &&
      !element.classList.contains("geetest_wind")
    );
  });

  // 反向遍历并删除这些元素
  // 从后向前遍历是因为直接删除元素会改变索引，导致出错
  for (let i = elementsToRemove.length - 1; i >= 0; i--) {
    elementsToRemove[i].remove();
  }

  setTimeout(delOriginHtml, 1000);
})();
(function () {
  "use strict";
  //队列类
  class Queue {
    constructor() {
      this.queue = [];
      this.isRunning = false;
      this.isPaused = false;
    }
    display() {
      let taskList = document.querySelector(".taskList");
      taskList.innerHTML = "";
      for (let i = 0; i < this.queue.length; i++) {
        let taskName = this.queue[i].taskName;
        let div = document.createElement("div");
        div.className = "d-grid gap-2";
        let button = document.createElement("button");
        button.className = "btn btn-dark";
        button.type = "button";
        button.innerText = taskName;
        button.addEventListener("click", (event) => {
          //获取div是父级的第几个元素
          let divToRemove = event.target.closest(".d-grid.gap-2");
          let index = Array.from(taskList.children).indexOf(divToRemove);
          if (index !== -1) {
            this.removeTask(index); // 假设 removeTask 是正确的方法且能访问
            divToRemove.remove();
          }
        });
        div.appendChild(button);
        taskList.appendChild(div);
      }
    }
    // 入队，传入一个函数和该函数的参数数组
    enqueue(func, taskName, ...args) {
      this.queue.push({ func, taskName, args, attempts: 0 });
      this.display();
    }
    // 删除指定索引的任务
    removeTask(index) {
      if (index >= 0 && index < this.queue.length) {
        let tmp = this.queue.splice(index, 1); // 使用splice方法删除指定索引的任务
        this.display(); // 重新显示任务列表
        return tmp; // 返回被删除的任务
      }
    }
    // 暂停队列
    pause() {
      this.isPaused = true;
    }

    // 恢复队列（如果队列已经停止，则重新开始）
    resume() {
      this.isPaused = false;
      if (!this.isRunning && this.queue.length > 0 && !this.isPaused) {
        this.run();
      }
    }

    // 异步执行队列中的函数，并在成功后出队
    async run() {
      this.isRunning = true;
      while (this.queue.length > 0 && !this.isPaused) {
        const { func, taskName, args, attempts } = this.queue[0];
        try {
          const result = await func(...args);
          if (result === true) {
            // 如果函数返回true，则从队列中移除该任务
            this.removeTask(0);
            addAndSaveLog(`任务: ${taskName} 成功`);
          } else {
            // 如果函数没有返回true，但也没有抛出错误，则增加尝试次数
            this.queue[0].attempts++;
            addAndSaveLog(`任务: ${taskName} 失败，尝试次数: ${attempts}`);
            // 如果函数没有返回true，但也没有抛出错误，可以增加尝试次数（可选）
            // 注意：这里我们没有增加尝试次数，因为题目没有明确要求
            // 如果需要，可以修改成 this.queue[0].attempts++;
          }
        } catch (error) {
          this.queue[0].attempts++;
          console.error("Error executing function:", error);
          addAndSaveLog(`任务: ${taskName} 失败，错误: ${error.message}`);
          // 如果需要，可以在这里处理错误，比如重试逻辑（可选）
          // 注意：简单的重试逻辑可能需要额外的逻辑来避免无限循环
        } finally {
          // 检查是否超过最大尝试次数，如果是，则移除任务
          if (this.queue.length > 0 && this.queue[0].attempts >= 5) {
            addAndSaveLog(`任务: ${taskName} 失败次数过多，已移除`);
            console.log("Task failed too many times, abandoning it.");
            this.removeTask(0);
          }
          //无论如何都严格延时一秒执行下一个任务
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒
          //虽然在while设置判断条件已经检测了队列是否为空，但这里再次检查是为了确保在队列变空时停止运行
          // 检查队列是否为空，如果为空，则停止运行
          if (this.queue.length === 0) {
            this.isRunning = false;
            this.isPaused = false;
            console.log("Queue is empty, stopping run.");
            document.querySelector(`.taskControl`).innerHTML = "开始任务";
            addAndSaveLog(`任务: ${taskName} 队列为空，停止运行`);
            return;
          }
        }
        // 这里没有使用setTimeout或延迟，因为题目要求是在函数执行完毕后立即检查
      }
      this.isRunning = false;
      document.querySelector(`.taskControl`).innerHTML = "开始任务";
      // 如果队列在执行过程中变空，并且有可能有新任务添加进来，
      // 但我们没有新的任务要执行（isRunning已经是false），
      // 我们可以考虑在队列非空时再次启动run方法（可选，取决于具体需求）
      // 但在这个简单的示例中，我们假设enqueue会负责启动run如果需要的话
    }
    // 首个出队
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.shift();
    }

    // 查看队首元素
    front() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items[0];
    }

    // 检查队列是否为空
    isEmpty() {
      return this.items.length === 0;
    }

    // 获取队列大小
    size() {
      return this.items.length;
    }

    // 打印队列
    print() {
      console.log(this.items.toString());
    }
  }
  //
  let userData = {
    data: (function () {
      let datatmp;
      fetch("https://api.bilibili.com/x/space/v2/myinfo", {
        method: "GET",
        mode: "cors",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          userDisplay(data);
          function userDisplay(data) {
            if (data.code == "0") {
              let disabledTab = document.getElementById("disabled-tab");
              let disabledTabparent = disabledTab.parentElement;
              disabledTabparent.innerHTML += `<img src="${data.data.profile.face}"  height="25.6rem" style="border-radius: 50%;"></img> <div>${data.data.profile.name}</div>`;
              disabledTabparent.style.display = "flex";
              disabledTabparent.style.alignItems = "center";
            }
          }
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    })(),
  };
  // http://81.71.160.165/award_list.json
  // async function getJson(fileName) {
  //     try {
  //         const response = await fetch(`http://81.71.160.165/${fileName}.json`);
  //         if (!response.ok) {
  //             throw new Error(`HTTP error! status: ${response.status}`);
  //         }
  //         const data = await response.json();
  //         return data;
  //     } catch (error) {
  //         console.error('Error loading the file:', error);
  //         return null; // 或者根据您的需求返回其他适当的值
  //     }
  // }
  let bdoc_jql = {
    list: [
      {
        name: "当日开播＞60分钟",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvwkr00",
        theme: "btn-outline-success",
      },
      {
        name: "当日送“牛哇牛哇”满2人",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvq3i00",
        theme: "btn-outline-success",
      },
      {
        name: "当日直播间弹幕数满10条",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvem800",
        theme: "btn-outline-success",
      },
      {
        name: "当日至少1名用户观看时长≥10分钟",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvwdf00",
        theme: "btn-outline-success",
      },
      {
        name: "web直播页面",
        url: "https://live.bilibili.com/p/html/web-hime/index.html",
        theme: "btn-outline-primary",
      },
      {
        name: "开播设置",
        url: "https://link.bilibili.com/p/center/index#/my-room/start-live",
        theme: "btn-outline-primary",
      },
      {
        name: "绝区零up创作激励计划主页",
        url: "https://www.bilibili.com/blackboard/era/eNm7VXZQObQCmav4.html",
        theme: "btn-outline-primary",
      },
      {
        name: "抢码工具",
        url: "https://www.bilibili.com/blackboard/activity-Cf9EeKvyZ4.htmll",
        theme: "btn-outline-primary",
      },
      {
        name: "完成3天每日所有直播任务",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvshu00",
      },
      {
        name: "完成5天每日所有直播任务",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvsxm00",
      },
      {
        name: "完成10天每日所有直播任务",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvdjn00",
      },
      {
        name: "完成20天每日所有直播任务",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvsh500",
      },
      {
        name: "完成30天每日所有直播任务",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvs2u00",
      },
      {
        name: "完成35天每日所有直播任务",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvs1e00",
      },
      {
        name: "新增1名舰长",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvwp300",
      },
      {
        name: "【萌新开播任务】累计开播1天",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvsll00",
      },
      {
        name: "【萌新开播任务】累计开播3天",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvdvw00",
      },
      {
        name: "【萌新开播任务】累计开播5天",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvdxm00",
      },
      {
        name: "【萌新开播任务】累计开播7天",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvszu00",
      },
      {
        name: "【萌新开播任务】累计开播14天",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvsle00",
      },
      {
        name: "单稿播放量≥100",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvq6q00",
      },
      {
        name: "累计投稿1天",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvvjv00",
      },
      {
        name: "累计投稿2天，且累计播放量≥200",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvqx600",
      },
      {
        name: "累计投稿3天，且累计播放量≥500",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvwmc00",
      },
      {
        name: "累计投稿7天，且累计播放量≥1000",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvqxo00",
      },
      {
        name: "累计投稿14天，且累计播放量≥3000",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvey200",
      },
      {
        name: "累计投稿21天，且累计播放量≥4000",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvwyr00",
      },
      {
        name: "累计投稿35天，且累计播放量≥6000",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvee500",
      },
      {
        name: "累计投稿35天，且累计播放量≥50000",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvwf500",
      },
      {
        name: "投稿≥4个，且播放量≥400",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghveqe00",
      },
      {
        name: "投稿≥5个，播放量≥500",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvq4000",
      },
      {
        name: "累计播放15万",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvqzk00",
      },
      {
        name: "累计播放70万",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvvdy00",
      },
    ],
  };
  let bdoc_bh = {
    list: [
      {
        name: "当日开播满60分钟",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvot900",
        theme: "btn-outline-success",
      },
      {
        name: " 当日获得礼物总价值≥2个电池 ",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghviw200",
        theme: "btn-outline-success",
      },
      {
        name: " 直播间发送弹幕人数≥4人 ",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu0500",
        theme: "btn-outline-success",
      },
      {
        name: " 当日累计有效观看时长满15分钟 ",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu0600",
        theme: "btn-outline-success",
      },
      {
        name: "web直播页面",
        url: "https://live.bilibili.com/p/html/web-hime/index.html",
        theme: "btn-outline-primary",
      },
      {
        name: "开播设置",
        url: "https://link.bilibili.com/p/center/index#/my-room/start-live",
        theme: "btn-outline-primary",
      },
      {
        name: "星穹铁道创作者激励计划主页",
        url: "https://www.bilibili.com/blackboard/era/LcLSa6PYSKBxpSVj.html",
        theme: "btn-outline-primary",
      },
      {
        name: "抢码工具",
        url: "https://www.bilibili.com/blackboard/activity-Cf9EeKvyZ4.htmll",
        theme: "btn-outline-primary",
      },
      {
        name: "累计3天完成全部“每日直播任务-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvseu00",
      },
      {
        name: "累计5天完成全部“每日直播任务-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp8300",
      },
      {
        name: "累计10天完成全部“每日直播任务-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp5k00",
      },
      {
        name: "累计15天完成全部“每日直播任务-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvaul00",
      },
      {
        name: "直播间新增一名舰长-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu0400",
      },
      {
        name: "累计3天完成全部“每日直播任务-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp4t00",
      },
      {
        name: "累计5天完成全部“每日直播任务-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvpbc00",
      },
      {
        name: "累计10天完成全部“每日直播任务-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp5j00",
      },
      {
        name: "累计15天完成全部“每日直播任务-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp5b00",
      },
      {
        name: "直播间新增一名舰长-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu6m00",
      },
      {
        name: " 限时开播任务（12月4日-12月24日） ",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghviec00",
      },
      {
        name: " 限时开播任务（12月25日-1月14日） ",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvot800",
      },
      {
        name: "新人累计1天开播",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp5l00",
      },
      {
        name: "新人累计3天开播",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvsei00",
      },
      {
        name: "新人累计5天开播",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp6u00",
      },
      {
        name: "新人累计7天开播",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp9k00",
      },
      {
        name: "新人累计14天开播",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=18ERAmwloghvp8400",
      },
      {
        name: "累计1天投稿-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghviwh00",
      },
      {
        name: "累计2天投稿，且播放量≥300-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvoic00",
      },
      {
        name: "累计3天投稿，且播放量≥500-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu2l00",
      },
      {
        name: "累计7天投稿，且播放量≥1000-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu8i00",
      },
      {
        name: "累计14天投稿，且播放量≥2000-上",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu0900",
      },
      {
        name: "累计1天投稿-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu5d00",
      },
      {
        name: "累计2天投稿，且播放量≥300-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvu4900",
      },
      {
        name: "累计3天投稿，且播放量≥500-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvi0w00",
      },
      {
        name: "累计7天投稿，且播放量≥1000-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvi0y00",
      },
      {
        name: "累计14天投稿，且播放量≥2000-下",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvot100",
      },
      {
        name: "累计35天投稿，且播放量≥5000",
        url: "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA3wloghvoal00",
      },
    ],
  };
  let bdoc = bdoc_bh;
  let Award;
  // 页面初始化设置
  function setbdoc() {
    //基于本地缓存设置bdoc
    if (localStorage.getItem("bdoc") == "bdoc_jql") {
      bdoc = bdoc_jql;
      if (typeof Award !== "undefined") {
        Award.awardID = "1ERA2wloghvfp800";
      }
    } else {
      bdoc = bdoc_bh;
      if (typeof Award !== "undefined") {
        Award.awardID = `1ERA2wloghvld900`;
      }
    }
  }
  setbdoc();
  // 检查样式链接是否已经存在
  if (
    !document.querySelector(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"]'
    )
  ) {
    // 创建一个新的link元素
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css";
    // 将link元素添加到head中
    document.head.appendChild(link);
  }
  // 创建一个新的script元素
  var script = document.createElement("script");
  script.className = "protected";
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js";
  // https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js
  // 将script元素添加到body中
  document.body.appendChild(script);

  // 将页面嵌入
  function insertDivAfterBody() {
    var newDiv = document.createElement("div");
    newDiv.className = `h-100 protected`;
    newDiv.style.width = "100%";
    newDiv.style.height = "100%";
    newDiv.style.backgroundColor = "#fff";
    newDiv.style.position = "fixed";
    newDiv.style.top = "0";
    newDiv.style.left = "0";
    newDiv.style.zIndex = "9999";
    newDiv.style.display = "flex";
    newDiv.style.flexDirection = "column";
    newDiv.style.fontSize = "16px";

    newDiv.innerHTML = `
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                type="button" role="tab" aria-controls="home-tab-pane" aria-selected="false">
                挂播工具
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">
                兑奖列表
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane"
                type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="true">
                其他列表
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane"
                type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" disabled></button>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            选择游戏
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" id="bh-selected">崩坏星穹铁道</a></li>
            <li><a class="dropdown-item" href="#" id="jql-selected">绝区零</a></li>
          </ul>
        </li>
    </ul>
    <div class="tab-content" id="myTabContent" style="flex: 1;">
        <div class="tab-pane fade h-100 liveTools" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
            tabindex="0" style="position: relative;">
        </div>
        <div class="tab-pane fade h-100" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab"
            tabindex="0">
            <div id="carouselExample" class="carousel carousel-dark slide h-100">
                <div class="carousel-inner h-100">
                    <div class="carousel-item h-100">
                        <iframe src="about:blank"
                            class="d-block w-100 h-100" frameborder="0" id="awardListBilibiliCommond"></iframe>
                    </div>
                    <div class="carousel-item h-100 text-center active" style="position: relative;">
                        <div class="box" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: auto;" id="rewardsList">
                            <div class="protectedClass" id="liveAlertPlaceholder"></div>
                            <button type="button" class="btn btn-primary protectedClass" id="liveAlertBtn1">一键复制今日的码</button>
                            <button type="button" class="btn btn-primary protectedClass" id="liveAlertBtn3">无日期信息的按顺序复制材料码</button>
                            <button type="button" class="btn btn-primary protectedClass" id="liveAlertBtn2">刷新当前列表</button>下面的码点击复制
                        </div>
                        
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                    data-bs-slide="prev" style="margin-top: 20%; margin-bottom: 20%;">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExample"
                    data-bs-slide="next" style="margin-top: 20%; margin-bottom: 20%;">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <div class="tab-pane fade text-center h-100 active show" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0" style="position: relative;">
            <div id="contact-tab-pane-inner" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: auto;">确保抢码脚本是v0.69及以上,2.4星穹铁道之后的活动需要用新脚本
            <br class="protectedClass">
			      如果奖励列表没有内容,检查油猴脚本是否装好
            <br class="protectedClass"></div>
            
        </div>
        <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
            ...
        </div>
    </div>
`;

    // 获取body元素
    var body = document.body;

    // 将新的div添加到body的末尾
    body.appendChild(newDiv);
  }
  // 调用函数以插入div
  insertDivAfterBody();

  //修改html的rem
  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `  
      * {  
          font-size: 16px !important;  
      }  
  `;
  document.head.appendChild(styleSheet);

  // 监听消息,获取csrf
  let csrf = getBiliJct();
  function getBiliJct() {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key.trim() === "bili_jct") {
        window.parent.postMessage(
          value.trim(),
          "https://www.bilibili.com/blackboard/activity-81qZUddgCl.html"
        );
        return value.trim();
      }
    }
    return null; // 如果找不到bili_jct，则返回null
  }

  // 关于奖励页面
  Award = {
    awardID: (function () {
      //基于本地缓存设置bdoc
      if (localStorage.getItem("bdoc") == "bdoc_jql") {
        return `1ERA2wloghvfp800`;
      } else {
        return `1ERA2wloghvld900`;
      }
    })(),
    todayAward: "",
    getRewardsList: function () {
      let awardListBilibiliCommondIframe = document.querySelector(
        "#awardListBilibiliCommond"
      );
      awardListBilibiliCommondIframe.src = `https://www.bilibili.com/blackboard/award-history.html?activity_id=${Award.awardID}`;
      let cod;
      fetch(
        `https://api.bilibili.com/x/lottery/rewards/awards/mylist/v2?activity_id=${Award.awardID}`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // console.log(data);
          cod = data.code;
          let rewardslist = data.data.list;
          this.todayAward = "";
          for (
            let i = 0;
            i <
            (function () {
              if (rewardslist) {
                return rewardslist.length;
              }
              return 0;
            })();
            i++
          ) {
            let award_name = rewardslist[i].award_name;
            let award_time = this.timestampToDateString(
              rewardslist[i].receive_time
            );
            let award_cdk = rewardslist[i].extra_info.cdkey_content;
            let award_icon_url = rewardslist[i].icon;
            this.insertTextRowIntoElement(
              "rewardsList",
              `${award_time} ${award_name} ${award_cdk}`,
              award_icon_url
            );
            let timetmp = new Date().getTime();
            let tmp = this.timestampToDateString(new Date().getTime() / 1000);
            if (tmp == award_time) {
              this.todayAward +=
                `${award_time} ${award_name} ${award_cdk}` + `\n`;
            }
          }
          return cod === 0;
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    },
    /**
     * 时间戳转换方法,返回`${year}-${month}-${day}`
     * @param timestamp 时间戳(秒)
     * @returns {string} 返回`${year}-${month}-${day}`
     */
    timestampToDateString: function (timestamp) {
      // 确保传入的是数字类型的时间戳
      if (typeof timestamp !== "number" || isNaN(timestamp)) {
        throw new Error("Invalid timestamp");
      }

      // 创建一个Date对象
      const date = new Date(timestamp * 1000);

      // 获取年月日并转换为字符串
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1，并使用padStart补零
      const day = String(date.getDate()).padStart(2, "0"); // getDate返回的是日期，不需要+1

      // 返回年月日的字符串格式
      return `${year}-${month}-${day}`;
    },
    /**
     * 将文本插入到具有给定ID的元素中，并在文本末尾添加一个图标
     * @param {string} elementId 要插入文本的元素的ID
     * @param {string} text 要插入的文本
     * @param {string} icon 图标的URL
     */
    insertTextRowIntoElement: function (elementId, text, icon) {
      // 查找具有给定ID的元素
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`无法找到ID为${elementId}的元素`);
        return;
      }

      // 创建一个新的段落元素
      const paragraph = document.createElement("div");

      // 设置段落的文本内容
      paragraph.textContent = text;
      if (icon) {
        // 创建一个新的图像元素
        const img = document.createElement("img");
        img.src = icon; // 设置图像源
        img.alt = icon; // 设置备用文本
        img.style.maxWidth = "75px";
        paragraph.appendChild(img);
      }
      paragraph.classList.add("disabled-tab");
      paragraph.style.cursor = "pointer";
      paragraph.style.maxWidth = "512px";
      paragraph.style.margin = "5px auto";
      paragraph.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      paragraph.onclick = function () {
        // 复制自身文本
        var text = this.innerText;
        var textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      };
      // 将段落元素添加到目标元素内部
      element.appendChild(paragraph);
    },
    //奖励页面顶部按钮部分
    alertPlaceholder: document.getElementById("liveAlertPlaceholder"),
    alert: function (message, type) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
      ].join("");

      this.alertPlaceholder.append(wrapper);
    },
    // 复制按钮
    alertTrigger1: document.getElementById("liveAlertBtn1"), // 复制
    alertTrigger2: document.getElementById("liveAlertBtn2"), // 刷新
    alertTrigger3: document.getElementById("liveAlertBtn3"), // 简易复制

    initEventListeners: function () {
      if (this.alertTrigger1) {
        this.alertTrigger1.addEventListener("click", () => {
          this.copyTodayAward();
        });
      }
      if (this.alertTrigger2) {
        this.alertTrigger2.addEventListener("click", () => {
          this.clearBoxExceptWhitelist("rewardsList", ["protectedClass"]);

          if (this.getRewardsList()) {
            this.alert("刷新成功", "success");
          }
        });
      }
      if (this.alertTrigger3) {
        this.alertTrigger3.addEventListener("click", () => {
          if (
            typeof this.todayAward !== "string" &&
            typeof this.todayAward !== "number"
          ) {
            console.error("todayAward 必须是字符串或数字");
            return;
          }
          let awardCommond = (function (input) {
            let codes;
            if (Award.awardID === `1ERA2wloghvld900`) {
              codes = {
                遗失碎金: "",
                漫游指南: "",
                冒险记录: "",
                信用点: "",
              };
            } else {
              codes = {
                "丁尼*1000": "",
                "音擎能源模块*2": "",
                "资深调查员记录*2": "",
                "丁尼*5000": "",
              };
            }

            const lines = input.split("\n");
            if (Award.awardID === `1ERA2wloghvld900`) {
              lines.forEach((line) => {
                // 尝试匹配行中的物品名称和代码
                const match = line.match(
                  /(遗失碎金|漫游指南|冒险记录|信用点).*?(\w+)$/
                );
                if (match) {
                  // 提取物品名称和代码
                  const itemName = match[1]; // 这里 match[1] 实际上是整个括号内的匹配，但因为我们使用了或运算符，它恰好是物品名称
                  const code = match[2];

                  // 检查物品名称是否在 codes 对象中作为键存在
                  if (codes.hasOwnProperty(itemName)) {
                    // 更新 codes 对象中对应物品名称的值
                    codes[itemName] = code;
                  }
                }
              });

              // 使用Object.values而不是Object.keys和map，因为我们已经知道对象的键
              const orderedCodes = Object.values(codes).join("\t");

              return orderedCodes;

              // function a12as(input){
              //   let codes = {
              //     "丁尼*1000": "",
              //     "音擎能源模块*2": "",
              //     "资深调查员记录*2": "",
              //     "丁尼*5000": "",
              //   };
              //   const lines = input.split("\n");

              //   lines.forEach((line) => {
              //     // 尝试匹配行中的物品名称和代码
              //     const match = line.match(
              //       /(丁尼\*1000|音擎能源模块\*2|资深调查员记录\*2|丁尼\*5000)\s*([^\s]+)/
              //     );
              //     if (match) {
              //       // 提取物品名称和代码
              //       const itemName = match[1]; // 这里 match[1] 实际上是整个括号内的匹配，但因为我们使用了或运算符，它恰好是物品名称
              //       const code = match[2];

              //       // 检查物品名称是否在 codes 对象中作为键存在
              //       if (codes.hasOwnProperty(itemName)) {
              //         // 更新 codes 对象中对应物品名称的值
              //         codes[itemName] = code;
              //       }
              //     }
              //   });

              //   // 使用Object.values而不是Object.keys和map，因为我们已经知道对象的键
              //   const orderedCodes = Object.values(codes).join("\t");
              //   return orderedCodes;
              // }
              // function a12as(input){
              //   codes = {
              //     遗失碎金: "",
              //     漫游指南: "",
              //     冒险记录: "",
              //     信用点: "",
              //   };
              //   const lines = input.split("\n");

              //   lines.forEach((line) => {
              //     // 尝试匹配行中的物品名称和代码
              //     const match = line.match(
              //       /(遗失碎金|漫游指南|冒险记录|信用点).*?(\w+)$/
              //     );
              //     if (match) {
              //       // 提取物品名称和代码
              //       const itemName = match[1]; // 这里 match[1] 实际上是整个括号内的匹配，但因为我们使用了或运算符，它恰好是物品名称
              //       const code = match[2];

              //       // 检查物品名称是否在 codes 对象中作为键存在
              //       if (codes.hasOwnProperty(itemName)) {
              //         // 更新 codes 对象中对应物品名称的值
              //         codes[itemName] = code;
              //       }
              //     }
              //   });

              //   // 使用Object.values而不是Object.keys和map，因为我们已经知道对象的键
              //   const orderedCodes = Object.values(codes).join("\t");
              //   return orderedCodes;
              // }
            } else {
              lines.forEach((line) => {
                // 尝试匹配行中的物品名称和代码
                const match = line.match(
                  /(丁尼\*1000|音擎能源模块\*2|资深调查员记录\*2|丁尼\*5000)\s*([^\s]+)/
                );
                if (match) {
                  // 提取物品名称和代码
                  const itemName = match[1]; // 这里 match[1] 实际上是整个括号内的匹配，但因为我们使用了或运算符，它恰好是物品名称
                  const code = match[2];

                  // 检查物品名称是否在 codes 对象中作为键存在
                  if (codes.hasOwnProperty(itemName)) {
                    // 更新 codes 对象中对应物品名称的值
                    codes[itemName] = code;
                  }
                }
              });

              // 使用Object.values而不是Object.keys和map，因为我们已经知道对象的键
              const orderedCodes = Object.values(codes).join("\t");
              return orderedCodes;
            }
          })(this.todayAward);

          var textarea = document.createElement("textarea");
          textarea.value = String(awardCommond);
          document.body.appendChild(textarea);
          textarea.select();

          try {
            if (awardCommond.length > 5) {
              var successful = document.execCommand("copy");
              var msg = successful
                ? this.alert("复制成功", "success")
                : this.alert("复制失败", "danger");
              console.log(msg);
            } else {
              this.alert("复制失败，没有材料", "danger");
            }
          } catch (err) {
            console.error("复制时发生错误:", err);
          }
        });
      }
    },
    //复制方法
    copyTodayAward: function () {
      if (
        typeof this.todayAward !== "string" &&
        typeof this.todayAward !== "number"
      ) {
        console.error("todayAward 必须是字符串或数字");
        return;
      }

      var textarea = document.createElement("textarea");
      textarea.value = String(this.todayAward); // 确保值是字符串类型
      document.body.appendChild(textarea);
      textarea.select();

      try {
        if (this.todayAward.length > 5) {
          var successful = document.execCommand("copy");
          var msg = successful
            ? this.alert("复制成功", "success")
            : this.alert("复制失败", "danger");
          console.log(msg);
        } else {
          this.alert("复制失败，没有材料", "danger");
        }
      } catch (err) {
        console.error("复制时发生错误:", err);
      }

      document.body.removeChild(textarea);
    },
    copyTodayAwardCommond: function () {
      if (typeof todayAward !== "string" && typeof todayAward !== "number") {
        console.error("todayAward 必须是字符串或数字");
        return;
      }
    },
    // 清除boxId中的内容，除了白名单中的ID protectedClass
    clearBoxExceptWhitelist: function (boxId, whitelistClasses) {
      // 获取盒子元素
      const box = document.getElementById(boxId);
      if (!box) {
        console.error(`No element found with ID: ${boxId}`);
        return;
      }

      for (let i = box.childNodes.length - 1; i >= 0; i--) {
        // 使用反向循环，避免移除节点时索引问题
        const currentNode = box.childNodes[i];

        // 检查节点是否为元素节点（避免文本节点或注释节点）
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          // 调用 isInWhitelist 函数前确保 currentNode 是一个元素且有 classList
          if (!isInWhitelist(currentNode)) {
            box.removeChild(currentNode);
          }
        }
      }

      // 创建一个辅助函数来检查元素是否在白名单中
      // 辅助函数
      function isInWhitelist(element) {
        // 检查 element 是否有 classList 属性，避免 undefined
        if (element.classList) {
          // 转换为 Set 并检查类名
          const whitelistSet = new Set(whitelistClasses);
          return Array.from(element.classList).some((className) =>
            whitelistSet.has(className)
          );
        }
        // 如果 element 没有 classList，则默认不在白名单中
        return false;
      }
    },
  };
  Award.getRewardsList();
  Award.initEventListeners();
  // 调用函数，传入盒子ID和白名单类名数组  示例
  // clearBoxExceptWhitelist('myBox', ['whitelist']);

  // // 修正4个材料码的iframe和加载时间
  // function updateIframeSrcs(newSrcs) {
  //   // 获取所有class为"cl"的iframe元素
  //   var iframes = document.getElementsByClassName("cl");

  //   // 遍历iframe元素和src数组
  //   for (var i = 0; i < iframes.length; i++) {
  //     (function (index) {
  //       setTimeout(function () {
  //         // 修改iframe的src属性
  //         iframes[index].src = newSrcs[index].url; // 注意这里应该添加 https:// 或 http:// 前缀
  //       }, 1050 * index); // 使时间错开
  //     })(i); // 立即执行函数，并将当前的 i 值作为参数传递
  //   }
  // }
  // updateIframeSrcs(bdoc.list);

  // const refreshHomeTab = document.getElementById("refreshHomeTab");
  // if (refreshHomeTab) {
  //   refreshHomeTab.addEventListener("click", () => {
  //     refreshIframeInActiveCarouselItem();
  //   });
  // }
  // //刷新iframe的方法,处在active下的iframe
  // function refreshIframeInActiveCarouselItem() {
  //   // 查找具有指定类名的 div 元素
  //   var carouselItem = document.querySelector(".carousel-item.h-100.active");

  //   // 检查是否找到了 div 元素
  //   if (carouselItem) {
  //     // 在 div 元素中查找 iframe 元素
  //     var iframe = carouselItem.querySelector("iframe");

  //     // 检查是否找到了 iframe 元素
  //     if (iframe) {
  //       // 刷新 iframe
  //       try {
  //         // 通过设置相同的 src 属性来触发重新加载
  //         iframe.src = iframe.src;
  //       } catch (error) {
  //         // 捕获并处理任何可能的错误
  //         console.error("Error refreshing iframe:", error);
  //       }
  //     } else {
  //       // 如果没有找到 iframe，可以在这里处理
  //       console.log("No iframe found in the carousel item.");
  //     }
  //   } else {
  //     // 如果没有找到具有指定类名的 div，可以在这里处理
  //     console.log("No carousel item with the specified classes found.");
  //   }
  // }

  let navList = {
    //将bdoc变成按钮添加到指定的面板中
    appendLinksToPane: function (linksArray, paneId) {
      // 获取目标容器元素
      var pane = document.getElementById(paneId);
      if (!pane) {
        console.error("No element found with the id: " + paneId);
        return;
      }

      // 遍历数组
      linksArray.forEach(function (linkData) {
        // 验证数据
        if (!linkData || !linkData.name || !linkData.url) {
          console.error("Invalid link data:", linkData);
          return false;
        }

        // 创建<a>标签
        var link = document.createElement("a");
        link.href = linkData.url; // 设置href为url
        link.textContent = linkData.name; // 设置文本为name
        link.classList.add("btn"); // 设置类名
        console.log(linkData.theme || "btn-outline-secondary");
        link.classList.add(linkData.theme || "btn-outline-secondary"); // 添加按钮样式
        link.setAttribute("role", "button"); // 设置role属性
        link.style.marginRight = "10px"; // 设置样式
        link.style.marginBottom = "5px"; // 设置样式
        link.target = "_blank"; // 设置target属性

        // 将<a>标签添加到容器中
        pane.appendChild(link);

        // 如果你需要在每个链接之间添加分隔符，可以在这里添加
        // 例如：pane.appendChild(document.createElement('br'));
      });
      return true;
    },
  };
  navList.appendLinksToPane(bdoc.list, "contact-tab-pane-inner");
  //选择游戏,切换游戏
  let gameSelect = {
    //设置游戏,监听器
    setKeyEventListener: (function () {
      let bh = document.getElementById("bh-selected");
      let jql = document.getElementById("jql-selected");
      bh.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.setItem("bdoc", "bdoc_bh");
        gameSelect.bdocset();
      });
      jql.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.setItem("bdoc", "bdoc_jql");
        gameSelect.bdocset();
      });
    })(),
    //先刷新其他列表
    bdocset: function () {
      // 清除内容先
      Award.clearBoxExceptWhitelist("contact-tab-pane-inner", [
        "protectedClass",
      ]);
      //设置bdoc,awardid
      setbdoc();
      //根据bdoc填充其他列表
      navList.appendLinksToPane(bdoc.list, "contact-tab-pane-inner");
      //更新奖励列表
      Award.clearBoxExceptWhitelist("rewardsList", ["protectedClass"]);
      Award.getRewardsList();
      //updateIframeSrcs(bdoc.list);
    },
  };

  //
  //
  //
  //以下是直播工具
  //
  //
  //

  function createElementDiv() {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.right = "0";
    div.style.bottom = "0";
    div.style.overflow = "auto";
    div.innerHTML = `<div class="container userAll">
    <div class="row">
      <div class="col-12">
        <div class="form-floating m-2">
          <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px;overflow: auto;"
            readonly></textarea>
          <label for="floatingTextarea2">日志</label>
        </div>
      </div>
      <div class="col-12">
        <p>
          <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button"
            aria-expanded="false" aria-controls="collapseExample">
            查看当前用户信息
          </a>
        </p>
        <div class="collapse" id="collapseExample">
          <div class="card card-body myinfoDisplay">
            <!--  -->
            <!-- 在这展示myinfo -->
          </div>
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">待执行任务列表</button>

        <div class="offcanvas offcanvas-start bg-dark-subtle" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
          <div class="offcanvas-header">
            <button type="button" class="btn btn-secondary taskControl">开始任务</button>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body taskList">
            
          </div>
        </div>
      </div>
      
    </div>
    <div class="button-group">
      <div class="row">
        <div class="col-lg-6 col-12">
          <div class="flex-nowrap" style="display: flex;">
            <span class="input-group-text" id="addon-wrapping">挂时长用,只送礼弹幕不需要加载=></span>
            <button type="button" class="btn btn-outline-secondary alluse">卸载/加载直播间</button>
          </div>
        </div>
        <div class="col-lg-6 col-12">
          <div class="flex-nowrap" style="display: flex;">
            <button type="button" class="btn btn-outline-secondary uninsTime">自动卸载</button>
            <input type="number" min="0" class="form-control uninsTimeInput" placeholder="时间(分钟)" style="flex:1;"
              value=15>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <button type="button" class="btn btn-outline-warning addLive flex-grow-1">添加直播间</button>
    </div>
  </div>
  <div class="container live">
    <!--  -->
  </div>
  <div class="project container text-center" style="position: relative;">
    <button type="button" class="btn btn-outline-secondary fixProject" style="position:absolute;right:0;top:-35px;">如果直播窗口无法完整加载(白色标题栏不显示东西),点我尝试修复 (使用后可能无法正常使用材料卡片)</button>
    <div class="content">
      <div class="row">
        <!--  -->
      </div>
    </div>
  </div>
  <div class="materrialCode container ">
    <div class="row">
      <button type="button" class="btn btn-outline-warning addLive flex-grow-1 materrialCodeReload">加载/重载材料卡片</button>
    </div>
    <div class="content">
      <div class="row justify-content-evenly">
        <!--  -->
      </div>
    </div>
  </div>
  <footer class="footer mt-auto py-3 bg-light">
    <div class="container">
      <span class="text-muted">&copy; 2024 LynLuc All rights reserved.</span>
    </div>
  </footer>
  `;
    let liveTools = document.querySelector(`.liveTools`);
    liveTools.insertAdjacentElement("afterbegin", div);
  }
  createElementDiv();
  let bhTaskId = {
    isnew: true,
    code: [
      "6ERA3wloghvot900",
      "6ERA3wloghviw200",
      "6ERA3wloghvu0500",
      "6ERA3wloghvu0600",
    ],
    taskName: "崩坏星穹铁道",
  };
  let jqlTaskId = {
    isnew: true,
    code: [
      "6ERA3wloghvwkr00",
      "6ERA3wloghvq3i00",
      "6ERA3wloghvem800",
      "6ERA3wloghvwdf00",
    ],
    taskName: "绝区零",
  };
  let bh3TaskId = {
    isnew: true,
    code: ["6ERA3wloghvbp200", "6ERA3wloghvv3300", "6ERA3wloghvbof00"],
    taskName: "崩坏3",
  };
  let mcTaskId = {
    isnew: true,
    code: [
      "6ERA3wloghvqjg00",
      "6ERA3wloghvebj00",
      "6ERA3wloghvwmh00",
      "6ERA3wloghvw0n00",
    ],
    taskName: "鸣潮",
  };
  let xytxTaskId = {
    isnew: true,
    code: ["6ERA3wloghvzpj00", "6ERA3wloghvzs600", "6ERA3wloghvxyf00"],
    taskName: "新月同行",
  };
  let taskList = [bhTaskId, jqlTaskId, bh3TaskId, mcTaskId];
  let adds = [];
  let allLive = false; //加载状态
  let time = 0; //自动卸载时间
  let myinfo = {
    name: null,
    csrf: null,
    uid: null,
    follower: null,
    myWallet: null,
    streamAddrCode: null,
    area_id: null,
    myRoom_id: null,
    toString: function () {
      return `uname:${myinfo.name}<br>csrf:${myinfo.csrf}<br>uid:${myinfo.uid}<br>粉丝数:${myinfo.follower}<br>拥有电池:${myinfo.myWallet}<br>我的直播间号:${myinfo.myRoom_id}<br>直播rtmp串流码:${myinfo.streamAddrCode}`;
    },
  }; //用于保存个人信息
  let chooseArea = [
    { name: "崩坏：星穹铁道", area_id: 549 },
    { name: "绝区零", area_id: 662 },
    { name: "崩坏3", area_id: 40 },
    { name: "新月同行", area_id: 931 },
    { name: "归龙潮", area_id: 924 },
    { name: "鸣潮", area_id: 874 },
  ];
  let queue = new Queue(); //队列
  // fetch("https://api.live.bilibili.com/xlive/web-interface/v1/index/getWebAreaList?source_id=2", {
  //   "headers": {
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-site"
  //   },
  //   "method": "GET",
  //   "mode": "cors",
  //   "credentials": "include"
  // });
  function setMyInfo() {
    myinfo.csrf = getBiliJct();
    addAndSaveLog(`csrf:${myinfo.csrf}`);
    myInfo()
      .then((tmp) => {
        if (tmp) {
          myinfo.uid = tmp.mid;
          myinfo.follower = tmp.follower;
          myinfo.name = tmp.name;
          addAndSaveLog(`uname:${myinfo.name}`);
          addAndSaveLog(`uid:${myinfo.uid}`);
          addAndSaveLog(`粉丝数:${myinfo.follower}`);
        }
      })
      .catch((error) => {
        console.error("Failed to get user info:", error);
      });

    getMyRoomID()
      .then((roomId) => {
        myinfo.myRoom_id = roomId;
        addAndSaveLog(`我的直播间号:${myinfo.myRoom_id}`);
        fetchWebUpStreamAddr(myinfo.csrf)
          .then((streamAddrCode) => {
            myinfo.streamAddrCode = streamAddrCode;
            addAndSaveLog(`直播rtmp串流码:${myinfo.streamAddrCode}`);
            displayMyInfo();
          })
          .catch((error) => {
            console.error("Failed to get stream address:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to get room ID:", error);
      });
    myWallet()
      .then((wallet) => {
        myinfo.myWallet = wallet;
        addAndSaveLog(`拥有电池:${myinfo.myWallet}`);
      })
      .catch((error) => {
        console.error("Failed to get wallet:", error);
      });
  }
  //展示我的信息
  function displayMyInfo() {
    let myInfoElement = document.querySelector(".myinfoDisplay");
    myInfoElement.innerHTML = myinfo.toString();
    myInfoElement.innerHTML +=
      "<br>rtmp服务器 : rtmp://live-push.bilivideo.com/live-bvc/";
    let refresh = document.createElement("button");
    refresh.type = "button";
    refresh.className = "btn btn-success";
    refresh.textContent = "刷新用户信息";
    refresh.addEventListener("click", function () {
      setMyInfo();
    });
    myInfoElement.appendChild(refresh);
    if (
      myinfo.streamAddrCode &&
      myinfo.myRoom_id /*&& myinfo.follower >= 50*/
    ) {
      //对直播进行操作
      // 分区选择
      // <select class="form-select" aria-label="Default select example">
      //   <option selected>Open this select menu</option>
      //   <option value="1">One</option>
      //   <option value="2">Two</option>
      //   <option value="3">Three</option>
      // </select>
      //对分区列表进行更新
      let selectArea = document.createElement("select");
      selectArea.className = "form-select chooseArea text-center";
      selectArea.setAttribute("aria-label", "Default select example");
      getMyChooseArea(myinfo.myRoom_id)
        .then((json) => {
          if (json) {
            chooseArea = json;
            for (let i = 0; i < chooseArea.length; i++) {
              let option = document.createElement("option");
              option.value = i;
              option.textContent = `选择分区 : ` + chooseArea[i].name;
              selectArea.appendChild(option);
            }
            myInfoElement.appendChild(selectArea);
          }
        })
        .catch((error) => {
          console.error("Failed to get getMyChooseArea():", error);
        });

      //启动直播
      // <button type="button" class="btn btn-info">Info</button>
      let onLive = document.createElement("button");
      let changeRoomArea = document.createElement("button");
      onLive.type = "button";
      changeRoomArea.type = "button";
      onLive.className = "btn btn-info";
      changeRoomArea.className = "btn btn-info";
      onLive.textContent = "开始直播";
      changeRoomArea.textContent = "更换分区";
      // 为按钮添加点击事件监听器
      onLive.addEventListener("click", function () {
        let selectedId = chooseArea[selectArea.value].area_id;
        let selectedName = chooseArea[selectArea.value].name;
        myinfo.area_id = selectedId;
        startLive(myinfo.csrf, myinfo.myRoom_id, selectedId)
          .then((is) => {
            if (is) {
              addAndSaveLog(
                `开播成功,当前分区:${selectedName},请使用推流地址查看是否成功推流`
              );
            } else {
              addAndSaveLog(`开播失败,请重试`);
            }
          })
          .catch((error) => {
            console.error("Failed", error);
          });
      });
      changeRoomArea.addEventListener("click", function () {
        let selectedId = chooseArea[selectArea.value].area_id;
        let selectedName = chooseArea[selectArea.value].name;
        myinfo.area_id = selectedId;
        anchorChangeRoomArea(myinfo.csrf, myinfo.myRoom_id, selectedId)
          .then((is) => {
            if (is) {
              addAndSaveLog(`分区更换成功,当前分区:${selectedName}`);
            } else {
              addAndSaveLog(`分区更换失败,请重试`);
            }
          })
          .catch((error) => {
            console.error("Failed to get wallet:", error);
          });
      });
      // 将按钮添加到末尾
      myInfoElement.appendChild(onLive);
      myInfoElement.appendChild(changeRoomArea);
    }
  }

  /**
   * @param className 要添加字符串的元素的类名querySelector(className)
   * @param strToInsert 要添加的字符串,可以解析元素标签,添加到尾部
   */
  function addStringToFirstElementByClass(className, strToInsert) {
    // 使用querySelector查找第一个匹配的元素
    let element = document.querySelector(className);
    if (element) {
      // 假设你想在元素的文本末尾添加字符串
      element.insertAdjacentHTML("beforeend", strToInsert);
      // 或者如果你想要在元素内部（例如，作为子元素）添加HTML内容，可以使用innerHTML
      // element.innerHTML += `<span>${strToInsert}</span>`;
    }
  }
  //增加Live行方法
  function add_InputGroup_Row(value) {
    //扩容adds
    adds.push(value || 0);
    let row = `<div class="row row${adds.length}">
                  <div class="col-3">
                    <div class="input-group mb-3">
                      <button type="button" class="btn btn-outline-secondary getinput">确定</button>
                      <input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="直播间地址" value='${
                        value || ""
                      }' />
                    </div>
                  </div>
                  <div class="col-9">
                    <div class="row">
                      <div class="col-xl-3 col-sm-6 col-12">
                        <div class="input-group flex-nowrap">
                          <span class="input-group-text" id="addon-wrapping">预送礼物数量</span>
                          <input type="number" min="0" class="form-control award-num" placeholder="礼物数量" value="0">
                        </div>
                      </div>
                      <div class="col-xl-3 col-sm-6 col-12">
                        <div class="input-group flex-nowrap">
                          <span class="input-group-text" id="addon-wrapping">预发弹幕数量</span>
                          <input type="number" min="0" class="form-control message-num" placeholder="弹幕数量" value="10">
                        </div>
                      </div>
                      <div class="col-xl-3 col-sm-6 col-12">
                        <div class="input-group flex-nowrap">
                          <span class="input-group-text" id="addon-wrapping">mid</span>
                          <input type="text" class="form-control mid" placeholder="mid" disabled>
                        </div>
                      </div>
                      <div class="col-xl-3 col-sm-6 col-12">
                        <div class="input-group">
                          <button type="button" class="btn btn-danger">删除该行</button>
                          <button type="button" class="btn btn-success">添加任务</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
    addStringToFirstElementByClass(".container.live", row);
  }
  //增加Live窗口方法
  function add_LiveWindow() {
    //
    let liveWinHtml = `<div class="col-lg-3 col-md-6" style="position: relative;">
                            <iframe src="" frameborder="no" framespacing="0" scrolling="no" allow="autoplay; encrypted-media"
                              allowfullscreen="true" ></iframe>
                            <div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;" class="iframeClick"></div>
                          </div>`;
    addStringToFirstElementByClass(
      ".project.container.text-center>.content .row",
      liveWinHtml
    );
  }
  //获取nth对应行的input内容并做相应处理
  function getinput(nth) {
    //获取到input的值
    let inputObject = document.querySelector(`.row${nth} .col-3 input`);
    let input = inputObject.value;
    //处理input的格式,不对则返回0
    input = extractBilibiliId(input);
    if (input === 0) {
      inputObject.value = "";
    }
    if (input) {
      inputObject.value = input;
    }
    return input;
  }
  //根据room_id获取并设置mid,填充到对应位置
  function setMid(nth, room_id) {
    let midObject = document.querySelector(`.row${nth} .col-9 .mid`);
    let nameObject = midObject.parentNode.querySelector("span");
    if (!room_id) {
      midObject.value = "";
      nameObject = "mid";
      return;
    }

    getRoomPlayInfo(room_id)
      .then((mid) => {
        midObject.value = mid;
        if (mid) {
          addAndSaveLog(`${nth}号房间号${room_id}获取到mid为${mid}`);
        } else {
          addAndSaveLog(`${nth}号房间号${room_id}获取mid失败${mid}`);
        }
      })
      .catch((error) => {
        console.error("Failed", error);
      });
  }

  //改写自动卸载按钮的内容('自动卸载' + 显示倒计时),传入time毫秒更改格式,  //time为0时自动卸载
  //传入分钟数设置倒计时
  let timerRunning = false; //用于控制计时器只能有一个
  function setUninsTime(minute) {
    // alert(minute);
    if (minute) {
      time = minute * 60 * 1000; //将分钟转换为毫秒
    }
    let str = null;
    if (time) {
      str = `${Math.floor(time / 1000 / 60)}:${(time / 1000) % 60}`;
    } else {
      str = "";
    }
    autoplayer.innerHTML = "自动卸载" + str;
    if (time > 0) {
      if (!timerRunning) {
        timerRunning = true;
        time -= 1000;
        setTimeout(function () {
          timerRunning = false;
          setUninsTime();
        }, 1000);
      }
    } else {
      timerRunning = false;
    }
    if (time <= 0 || !allLive) {
      time = 0;
      let liveIframe = document.querySelectorAll(
        ".project.container.text-center>.content>.row iframe"
      );
      for (let i = 0; i < liveIframe.length; i++) {
        liveIframe[i].src = ""; //完成卸载
      }
    }
  }

  function extractBilibiliId(input) {
    // 尝试从URL中提取ID，或者如果输入本身就是数字，则直接返回
    const regexUrl = /live\.bilibili\.com\/(\d+)|cid=(\d+)/;
    const matchUrl = input.match(regexUrl);

    // 如果从URL中匹配到了ID，则返回该ID
    if (matchUrl && (matchUrl[1] || matchUrl[2])) {
      return parseInt(matchUrl[1] || matchUrl[2]);
    }

    // 尝试将输入作为纯数字ID处理
    const regexId = /^\d+$/; // 匹配整个字符串都是数字的情况
    if (regexId.test(input)) {
      return parseInt(input);
    }

    // 如果没有找到ID，返回null或其他默认值
    return 0;
  }
  //添加日志
  function addAndSaveLog(content) {
    const textarea = document.getElementById("floatingTextarea2");
    const currentContent = textarea.value;

    // 添加新内容到文本区域
    textarea.value = currentContent + "\n" + content;

    // 保存内容到localStorage
    localStorage.setItem("log", textarea.value);
    //移动滚动条
    textarea.scrollTop = textarea.scrollHeight;
  }
  //获取待选中分区列表
  function getMyChooseArea(room_id) {
    return fetch(
      `https://api.live.bilibili.com/room/v1/Area/getMyChooseArea?roomid=${room_id}`,
      {
        headers: {
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        if (data.code !== 0) {
          return false;
        }
        let json = [];
        for (let i = 0; i < chooseArea.length; i++) {
          json.push({
            area_id: `${chooseArea[i].area_id}`,
            name: chooseArea[i].name,
          });
        }
        for (let i = 0; i < data.data.length; i++) {
          if (
            //如果data.data[i].id与json所有的area_id中存在，则跳过
            json.some((item) => item.area_id === data.data[i].id)
          ) {
            continue;
          }
          json.push({ area_id: data.data[i].id, name: data.data[i].name });
        }
        return json;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  //调用sendLiveMessage,每次调用都从messageList中取一个消息发送,依次遍历循环
  let messageList = [
    "[dog]",
    "[哇]",
    "[爱]",
    "[妙]",
    "[花]",
    "[赞]",
    "[滑稽]",
    "[傲娇]",
    "[吃瓜]",
    "[笑哭]",
    "[捂脸]",
    "[喝彩]",
  ];
  let emojiMessageList = [];
  let currentIndex = 0; // 用于记录当前发送的消息索引
  async function sendLiveMessageInList(liveId, csrf) {
    const message = messageList[currentIndex];
    currentIndex = (currentIndex + 1) % messageList.length;
    try {
      return await sendLiveMessage(liveId, message, csrf);
    } catch (error) {
      console.error("Failed", error);
      throw error; // 抛出错误，以便调用者可以处理
    }
  }
  /**
   * @param liveId 发送给哪个直播间 直播间Id
   * @param message 发送的消息
   * @param csrf 用户标识
   *  用于发送文字信息,无法发送表情包
   *
   */
  function sendLiveMessage(liveId, message, csrf) {
    // 发送直播弹幕
    const formData = new FormData();
    formData.append("bubble", "0"); // 通常这个值取决于是否需要弹幕特效
    formData.append("msg", message); // 发送的消息内容
    formData.append("color", "16777215"); // 弹幕颜色（这里使用白色）
    formData.append("mode", "1"); // 弹幕模式（这里假设为普通模式）
    formData.append("room_type", "0"); // 直播间类型（这里假设为普通直播间）
    formData.append("jumpfrom", "0"); // 跳转来源（这里假设为0）
    formData.append("reply_mid", "0"); // 回复的用户ID（这里假设为0）
    formData.append("reply_attr", "0"); // 回复属性（这里假设为0）
    formData.append("replay_dmid", ""); // 回复的弹幕ID（这里假设为空）
    formData.append("statistics", { appId: 100, platform: 5 }); // 统计信息
    formData.append("fontsize", "25"); // 弹幕字体大小
    formData.append("rnd", Math.floor(Math.random() * 100000) + 1722000000); // 随机数，可能需要根据实际API要求调整
    formData.append("roomid", liveId); // 直播间ID
    formData.append("csrf", csrf); // CSRF token
    formData.append("csrf_token", csrf); // 有些API可能需要单独的csrf_token字段

    return fetch("https://api.live.bilibili.com/msg/send", {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrer: `https://live.bilibili.com/${liveId}`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: formData,
      mode: "cors",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        if (data.code !== 0) {
          return false;
        }
        return true;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  /**
   * @param liveId 发送给哪个直播间 直播间Id
   * @param message 发送的消息
   * @param csrf 用户标识
   *  用于发送表情包,无法发送文字
   *
   */
  function sendLiveMessage_Emoji(liveId, message, csrf) {
    // 发送直播弹幕
    const formData = new FormData();
    formData.append("bubble", "0"); // 通常这个值取决于是否需要弹幕特效
    formData.append("msg", message); // 发送的消息内容
    formData.append("color", "16777215"); // 弹幕颜色（这里使用白色）
    formData.append("mode", "1"); // 弹幕模式（这里假设为普通模式）
    formData.append("dm_type", 1); //
    formData.append("emoticonOptions", "[object Object]");
    formData.append("fontsize", "25"); // 弹幕字体大小
    formData.append("rnd", Math.floor(Math.random() * 100000) + 1722000000); // 随机数，可能需要根据实际API要求调整
    formData.append("roomid", liveId); // 直播间ID
    formData.append("csrf", csrf); // CSRF token
    formData.append("csrf_token", csrf); // 有些API可能需要单独的csrf_token字段

    fetch("https://api.live.bilibili.com/msg/send", {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrer: `https://live.bilibili.com/${liveId}`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: formData,
      mode: "cors",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  /**
   * @param uid 用户id
   * @param ruid 主播id
   * @param gift_id 礼物id
   * @param gift_num 发送数量
   * @param price 礼物价格
   * @param biz_id 房间号
   * @param csrf 用户标识
   * @param csrf_token 用户标识
   * @param visit_id 随机id
   *  用于发送礼物,默认发送牛蛙
   * 返回数据 data.code === 0 || data.message === "0"为成功
   */
  async function sendGift(
    uid,
    ruid,
    gift_id,
    gift_num,
    price,
    biz_id,
    csrf,
    csrf_token,
    visit_id
  ) {
    // 假设其他参数是固定的或者可以根据需要调整
    //const gift_id = 31039; // 礼物ID，这里假设是固定的  31039牛蛙
    const coin_type = "gold"; // 硬币类型，这里假设是金瓜子
    const bag_id = 0; // 袋子ID，这里假设不使用袋子
    const platform = "pc"; // 平台，这里假设是PC端
    const biz_code = "Live"; // 业务代码，这里假设是直播业务
    const storm_beat_id = 0; // 风暴节拍ID，这里假设不使用或默认为0
    const metadata = ""; // 元数据，这里为空
    //const price = 100; // 礼物价格或价值，这里假设为100金瓜子
    const receive_users = ""; // 接收用户列表，这里为空（通常只发送给ruid）

    // 假设live_statistics和statistics是固定的JSON对象，实际中可能需要根据情况动态生成
    const liveStatistics = {
      pc_client: "pcWeb",
      jumpfrom: "-99998",
      room_category: "0",
      official_channel: {
        program_room_id: "-99998",
        program_up_id: "-99998",
      },
    };
    const statistics = {
      platform: 5,
      pc_client: "pcWeb",
      appId: 100,
    };

    // 将JSON对象转换为URL编码的字符串
    const liveStatisticsEncoded = encodeURIComponent(
      JSON.stringify(liveStatistics)
    );
    const statisticsEncoded = encodeURIComponent(JSON.stringify(statistics));

    // 构造请求体
    const body = `uid=${encodeURIComponent(
      uid
    )}&gift_id=${gift_id}&ruid=${encodeURIComponent(
      ruid
    )}&send_ruid=0&gift_num=${gift_num}&coin_type=${coin_type}&bag_id=${bag_id}&platform=${platform}&biz_code=${biz_code}&biz_id=${biz_id}&storm_beat_id=${storm_beat_id}&metadata=${metadata}&price=${price}&receive_users=${receive_users}&live_statistics=${liveStatisticsEncoded}&statistics=${statisticsEncoded}&_tracerReqKey=LIVE_ROOM_PRESENT_FEED_REQUEST&_tracerResKey=LIVE_ROOM_PRESENT_FEED_RESPONSE&csrf_token=${csrf_token}&csrf=${csrf}&visit_id=${visit_id}`;

    // 发送POST请求
    return fetch(
      "https://api.live.bilibili.com/xlive/revenue/v1/gift/sendGold",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // 其他可能需要的头部，如'Accept'等，可以根据需要添加
        },
        body: body,
        credentials: "include", // 如果需要包含cookies等凭证信息
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // 假设响应是JSON格式
      })
      .then((data) => {
        if (data.code !== 0) {
          console.log("Error:", data.message); // 处理错误响应
          return false;
        }
        console.log("Success:", data); // 处理成功响应
        return true;
      })
      .catch((error) => {
        console.error("Error:", error); // 处理错误
      });
  }
  /**
   * @param uid 用户id
   * @param ruid 主播id
   * @param biz_id 房间号
   * @param csrf 用户标识
   *  用于发送牛蛙1个,使用时需要先判断余额是否足够
   */
  let visit_id = 0; // 初始化为0，但稍后会被替换为随机字符串
  async function sendniuwaniuwa(uid, ruid, biz_id, csrf) {
    if (!uid || !ruid || !biz_id || !csrf) {
      addAndSaveLog("赠礼错误:输入参数或登录信息有误");
      return;
    }
    myWallet()
      .then((wallet) => {
        myinfo.myWallet = wallet;
      })
      .catch((error) => {
        console.error("Failed to get wallet:", error);
      });
    if (!myinfo.myWallet) {
      addAndSaveLog("赠礼错误:电池不足");
      return;
    }
    if (visit_id === 0) {
      // 检查visit_id是否为初始值
      // 使用IIFE来生成新的visit_id，并赋值给外部的visit_id
      (function (length = 16) {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charLength = chars.length;
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        // 将生成的随机字符串赋值给外部的visit_id
        visit_id = result;
      })();
    }
    // 现在可以使用已经生成或已经存在的visit_id
    return await sendGift(
      uid,
      ruid,
      31039,
      1,
      100,
      biz_id,
      csrf,
      csrf,
      visit_id
    );
  }

  /**
   * @param roomId 直播间号
   *  获取直播间主播的uid
   */
  function getRoomPlayInfo(roomId) {
    return fetch(
      `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomId}&protocol=0,1&format=0,1,2&codec=0,1,2`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          // 移除或根据需要添加其他头
        },
        referrer: `https://live.bilibili.com/${roomId}`,
        referrerPolicy: "no-referrer-when-downgrade",
        method: "GET",
        mode: "cors",
        credentials: "include", // 根据需要调整
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        //console.log(data); // 处理数据
        if (data.code === 60004 || data.code === -400) {
          alert(data.message);
          return null;
        }
        if (data.data.uid) {
          return data.data.uid;
        }
      })
      .catch((error) => {
        return null;
        console.error("There was a problem with your fetch operation:", error);
      });
  }
  //异步函数,防止返回值未定义
  //获取当前用户的房间号
  async function getMyRoomID() {
    try {
      const response = await fetch(
        "https://api.live.bilibili.com/xlive/app-blink/v1/room/GetInfo?platform=pc",
        {
          headers: {
            accept: "application/json",
            "accept-language": "zh-CN,zh;q=0.9",
            // 注意：通常不需要移除 sec-fetch-* 和 referrer/referrerPolicy，这些是浏览器自动添加的
          },
          method: "GET",
          mode: "cors",
          credentials: "include", // 如果需要发送 cookies，请确保服务器支持 CORS with credentials
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // 处理响应数据
      if (data.code !== 0) {
        throw new Error(data.message); // 使用 throw 抛出错误，以便在调用者处捕获
        return null;
      }

      return data.data.room_id; // 假设 data.data.room_id 存在且有效
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      throw error; // 重新抛出错误，以便在调用者处可以进一步处理
    }
  }
  /**
   * 获取用户info
   * return { "mid": 用户mid , "follower": 粉丝数 };
   */
  function myInfo() {
    return fetch("https://api.bilibili.com/x/space/v2/myinfo", {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        // 注意：通常不需要显式设置 accept 为 "*/*"，因为这是浏览器的默认值
        // 但这里保留以符合您的原始代码
      },
      method: "GET",
      mode: "cors",
      credentials: "include", // 如果需要包含 Cookies，请保留此设置
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // 处理用户信息
        if (data.code !== 0) {
          alert(data.message);
          throw new Error("Failed to retrieve user info"); // 使用 throw 抛出错误，以便在调用者处捕获
        }
        return {
          mid: data.data.profile.mid,
          follower: data.data.follower,
          name: data.data.profile.name,
        };
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        throw error; // 重新抛出错误，以便在调用者处可以进一步处理
      });
  }
  /**
   * @param csrf
   * @param room_id 直播间号
   * @param area_id 星穹铁道549 绝区零662
   * 修改直播分区
   */
  function anchorChangeRoomArea(csrf, room_id, area_id) {
    if (!(csrf && room_id && area_id)) {
      addAndSaveLog(
        `参数错误,无法开播,请检查:csrf:${csrf},room_id${room_id},area_id${area_id}`
      );
      return;
    }
    return fetch(
      "https://api.live.bilibili.com/xlive/app-blink/v2/room/AnchorChangeRoomArea",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `room_id=${room_id}&area_id=${area_id}&platform=pc&csrf_token=${csrf}&csrf=${csrf}`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data); // 处理用户信息
        if (data.code !== 0) {
          alert(data.message);
          return false;
        }
        return true;
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  }

  /**
   * @param csrf
   * @param room_id 直播间号
   * @param area_id 星穹铁道549 绝区零662
   * 开启直播,要求粉丝数>=50
   */
  function startLive(csrf, room_id, area_id) {
    if (!(csrf && room_id && area_id)) {
      addAndSaveLog(
        `参数错误,无法开播,请检查:csrf:${csrf},room_id${room_id},area_id${area_id}`
      );
      return;
    }
    if (!myinfo.follower >= 50) {
      addAndSaveLog("粉丝数不足50,无法开播");
      return;
    }
    //粉丝数验证
    return fetch("https://api.live.bilibili.com/room/v1/Room/startLive", {
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `room_id=${room_id}&platform=pc&area_v2=${area_id}&backup_stream=0&csrf_token=${csrf}&csrf=${csrf}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data); // 处理用户信息
        if (data.code !== 0) {
          alert(data.message);
          return;
        }
        return data.data.rtmp.code; //将串流码返回
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  }

  //获取串流码
  function fetchWebUpStreamAddr(csrf) {
    if (!myinfo.csrf) {
      addAndSaveLog(`获取串流码失败,请先获取csrf等用户信息`);
      return null;
    }
    return fetch(
      "https://api.live.bilibili.com/xlive/app-blink/v1/live/FetchWebUpStreamAddr",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `platform=pc&backup_stream=0&csrf_token=${csrf}&csrf=${csrf}`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data); // 处理用户信息
        if (data.code !== 0) {
          addAndSaveLog(`获取串流码失败,请先获取csrf等用户信息${data.message}`);
          return;
        }
        return data.data.addr.code; //将串流码返回
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  }
  /**
   * 余额查询
   * return 电池数量
   */
  function myWallet() {
    return fetch(
      "https://api.live.bilibili.com/xlive/revenue/v1/wallet/myWallet",
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data); // 处理用户信息
        if (data.code !== 0) {
          addAndSaveLog(`调用余额查询时出现问题 ` + data.message);
          return 0;
        }
        return Math.floor(data.data.gold / 100); //将金瓜子数返回 1/100电池
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  }
  //从cookie中获取获取csrf
  function getBiliJct() {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key.trim() === "bili_jct") {
        return value.trim();
      }
    }
    return null; // 如果找不到bili_jct，则返回null
  }
  //获取用户信息,配合send使用
  function getApiInfo(taskId, callback, isnew) {
    let wdata = get_w_rid(taskId); //获取w_rid
    fetch(
      (function () {
        return isnew
          ? `https://api.bilibili.com/x/activity_components/mission/info?task_id=${taskId}&web_location=${web_location}&w_rid=${wdata.w_rid}&wts=${wdata.time}`
          : `https://api.bilibili.com/x/activity/mission/single_task?csrf=${getBiliJct()}&id=${taskId}`;
      })(),
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // 在这里处理JSON数据
        if (data.code === -702) {
          //检测频繁时自动递归调用
          setTimeout(function () {
            //5秒执行,防止频繁
            getApiInfo(taskId, callback, isnew);
          }, 2000);
          return;
        }
        //在此设置各任务完成情况
        if (isnew) {
          callback({
            act_id: data.data.act_id, //活动id
            task_id: data.data.task_id, //任务id
            task_finished: data.data.task_finished, //任务是否完成 true/false
            message: data.data.message, //按钮显示
            task_name: data.data.task_name, //任务名称
            reward_name: data.data.reward_info.award_name, //奖励名称
            act_name: data.data.act_name, //活动名称
            award_icon: data.data.reward_info.award_icon,
            isnew: isnew,
          });
        } else {
          callback({
            act_id: data.data.task_info.act_id,
            task_id: taskId,
            id: data.data.task_info.id,
            receive_id: data.data.task_info.receive_id,
            task_name: data.data.task_info.task_name,
            reward_name: data.data.task_info.reward_info.reward_name,
            act_name: data.data.act_info.act_name.replace(" ", "+"),
            award_icon: data.data.task_info.reward_info.reward_icon,
            receive_status: data.data.task_info.receive_status, //0未完成,1已完成未领取,3已领取
            stock_num: data.data.task_info.reward_period_stock_num, //剩余单日库存
            isnew: isnew,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  //
  //
  //
  let i = localStorage.getItem("wbi_img_urls"),
    regex = /([a-f0-9]{32})/g;
  if (i) {
    i = i.split("-");
  } else {
    i = [
      localStorage.getItem("wbi_img_url"),
      localStorage.getItem("wbi_sub_url"),
    ];
  }
  let n = i[0].match(regex),
    r = i[1].match(regex);
  const e = (function (t) {
    const e = [];
    return (
      [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5,
        49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24,
        55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63,
        57, 62, 11, 36, 20, 34, 44, 52,
      ].forEach((n) => {
        t.charAt(n) && e.push(t.charAt(n));
      }),
      e.join("").slice(0, 32)
    );
  })(n + r); //n和r是localStorage.wbi_img_urls
  let u1 = `wts=${Math.round(Date.now() / 1e3)}`; //wts
  let bin = {
    stringToBytes: function (t) {
      for (var e = [], n = 0; n < t.length; n++) e.push(255 & t.charCodeAt(n));
      return e;
    },
    bytesToString: function (t) {
      for (var e = [], n = 0; n < t.length; n++)
        e.push(String.fromCharCode(t[n]));
      return e.join("");
    },
  };
  let utf8 = {
    stringToBytes: function (t) {
      return bin.stringToBytes(unescape(encodeURIComponent(t)));
    },
    bytesToString: function (t) {
      return decodeURIComponent(escape(u.bin.bytesToString(t)));
    },
  };
  let n0 = function (t) {
    return (
      null != t &&
      (d(t) ||
        (function (t) {
          return (
            "function" == typeof t.readFloatLE &&
            "function" == typeof t.slice &&
            d(t.slice(0, 0))
          );
        })(t) ||
        !!t._isBuffer)
    );
  };
  function d(t) {
    return (
      !!t.constructor &&
      "function" == typeof t.constructor.isBuffer &&
      t.constructor.isBuffer(t)
    );
  }
  let t = {
    rotl: function (t, e) {
      return (t << e) | (t >>> (32 - e));
    },
    rotr: function (t, e) {
      return (t << (32 - e)) | (t >>> e);
    },
    endian: function (t) {
      if (t.constructor == Number)
        return (16711935 & this.rotl(t, 8)) | (4278255360 & this.rotl(t, 24));
      for (var n = 0; n < t.length; n++) t[n] = this.endian(t[n]);
      return t;
    },
    randomBytes: function (t) {
      for (var e = []; t > 0; t--) e.push(Math.floor(256 * Math.random()));
      return e;
    },
    bytesToWords: function (t) {
      for (var e = [], n = 0, r = 0; n < t.length; n++, r += 8)
        e[r >>> 5] |= t[n] << (24 - (r % 32));
      return e;
    },
    wordsToBytes: function (t) {
      for (var e = [], n = 0; n < 32 * t.length; n += 8)
        e.push((t[n >>> 5] >>> (24 - (n % 32))) & 255);
      return e;
    },
    bytesToHex: function (t) {
      for (var e = [], n = 0; n < t.length; n++)
        e.push((t[n] >>> 4).toString(16)), e.push((15 & t[n]).toString(16));
      return e.join("");
    },
    hexToBytes: function (t) {
      for (var e = [], n = 0; n < t.length; n += 2)
        e.push(parseInt(t.substr(n, 2), 16));
      return e;
    },
    bytesToBase64: function (e) {
      for (var n = [], r = 0; r < e.length; r += 3)
        for (
          var i = (e[r] << 16) | (e[r + 1] << 8) | e[r + 2], o = 0;
          o < 4;
          o++
        )
          8 * r + 6 * o <= 8 * e.length
            ? n.push(t.charAt((i >>> (6 * (3 - o))) & 63))
            : n.push("=");
      return n.join("");
    },
    base64ToBytes: function (e) {
      e = e.replace(/[^A-Z0-9+\/]/gi, "");
      for (var n = [], r = 0, i = 0; r < e.length; i = ++r % 4)
        0 != i &&
          n.push(
            ((t.indexOf(e.charAt(r - 1)) & (Math.pow(2, -2 * i + 8) - 1)) <<
              (2 * i)) |
              (t.indexOf(e.charAt(r)) >>> (6 - 2 * i))
          );
      return n;
    },
  };
  i = {
    _ff: function (t, e, n, r, i, o, a) {
      var s = t + ((e & n) | (~e & r)) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _gg: function (t, e, n, r, i, o, a) {
      var s = t + ((e & r) | (n & ~r)) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _hh: function (t, e, n, r, i, o, a) {
      var s = t + (e ^ n ^ r) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _ii: function (t, e, n, r, i, o, a) {
      var s = t + (n ^ (e | ~r)) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _blocksize: 16,
    _digestsize: 16,
  };

  function i1(o, a) {
    o.constructor == String
      ? (o =
          a && "binary" === a.encoding
            ? bin.stringToBytes(o)
            : utf8.stringToBytes(o))
      : n0(o)
      ? (o = Array.prototype.slice.call(o, 0))
      : Array.isArray(o) || o.constructor === Uint8Array || (o = o.toString());
    for (
      var s = t.bytesToWords(o),
        c = 8 * o.length,
        u = 1732584193,
        l = -271733879,
        f = -1732584194,
        d = 271733878,
        p = 0;
      p < s.length;
      p++
    )
      s[p] =
        (16711935 & ((s[p] << 8) | (s[p] >>> 24))) |
        (4278255360 & ((s[p] << 24) | (s[p] >>> 8)));
    (s[c >>> 5] |= 128 << c % 32), (s[14 + (((c + 64) >>> 9) << 4)] = c);
    var h = i._ff,
      v = i._gg,
      m = i._hh,
      y = i._ii;
    for (p = 0; p < s.length; p += 16) {
      var g = u,
        b = l,
        _ = f,
        w = d;
      (u = h(u, l, f, d, s[p + 0], 7, -680876936)),
        (d = h(d, u, l, f, s[p + 1], 12, -389564586)),
        (f = h(f, d, u, l, s[p + 2], 17, 606105819)),
        (l = h(l, f, d, u, s[p + 3], 22, -1044525330)),
        (u = h(u, l, f, d, s[p + 4], 7, -176418897)),
        (d = h(d, u, l, f, s[p + 5], 12, 1200080426)),
        (f = h(f, d, u, l, s[p + 6], 17, -1473231341)),
        (l = h(l, f, d, u, s[p + 7], 22, -45705983)),
        (u = h(u, l, f, d, s[p + 8], 7, 1770035416)),
        (d = h(d, u, l, f, s[p + 9], 12, -1958414417)),
        (f = h(f, d, u, l, s[p + 10], 17, -42063)),
        (l = h(l, f, d, u, s[p + 11], 22, -1990404162)),
        (u = h(u, l, f, d, s[p + 12], 7, 1804603682)),
        (d = h(d, u, l, f, s[p + 13], 12, -40341101)),
        (f = h(f, d, u, l, s[p + 14], 17, -1502002290)),
        (u = v(
          u,
          (l = h(l, f, d, u, s[p + 15], 22, 1236535329)),
          f,
          d,
          s[p + 1],
          5,
          -165796510
        )),
        (d = v(d, u, l, f, s[p + 6], 9, -1069501632)),
        (f = v(f, d, u, l, s[p + 11], 14, 643717713)),
        (l = v(l, f, d, u, s[p + 0], 20, -373897302)),
        (u = v(u, l, f, d, s[p + 5], 5, -701558691)),
        (d = v(d, u, l, f, s[p + 10], 9, 38016083)),
        (f = v(f, d, u, l, s[p + 15], 14, -660478335)),
        (l = v(l, f, d, u, s[p + 4], 20, -405537848)),
        (u = v(u, l, f, d, s[p + 9], 5, 568446438)),
        (d = v(d, u, l, f, s[p + 14], 9, -1019803690)),
        (f = v(f, d, u, l, s[p + 3], 14, -187363961)),
        (l = v(l, f, d, u, s[p + 8], 20, 1163531501)),
        (u = v(u, l, f, d, s[p + 13], 5, -1444681467)),
        (d = v(d, u, l, f, s[p + 2], 9, -51403784)),
        (f = v(f, d, u, l, s[p + 7], 14, 1735328473)),
        (u = m(
          u,
          (l = v(l, f, d, u, s[p + 12], 20, -1926607734)),
          f,
          d,
          s[p + 5],
          4,
          -378558
        )),
        (d = m(d, u, l, f, s[p + 8], 11, -2022574463)),
        (f = m(f, d, u, l, s[p + 11], 16, 1839030562)),
        (l = m(l, f, d, u, s[p + 14], 23, -35309556)),
        (u = m(u, l, f, d, s[p + 1], 4, -1530992060)),
        (d = m(d, u, l, f, s[p + 4], 11, 1272893353)),
        (f = m(f, d, u, l, s[p + 7], 16, -155497632)),
        (l = m(l, f, d, u, s[p + 10], 23, -1094730640)),
        (u = m(u, l, f, d, s[p + 13], 4, 681279174)),
        (d = m(d, u, l, f, s[p + 0], 11, -358537222)),
        (f = m(f, d, u, l, s[p + 3], 16, -722521979)),
        (l = m(l, f, d, u, s[p + 6], 23, 76029189)),
        (u = m(u, l, f, d, s[p + 9], 4, -640364487)),
        (d = m(d, u, l, f, s[p + 12], 11, -421815835)),
        (f = m(f, d, u, l, s[p + 15], 16, 530742520)),
        (u = y(
          u,
          (l = m(l, f, d, u, s[p + 2], 23, -995338651)),
          f,
          d,
          s[p + 0],
          6,
          -198630844
        )),
        (d = y(d, u, l, f, s[p + 7], 10, 1126891415)),
        (f = y(f, d, u, l, s[p + 14], 15, -1416354905)),
        (l = y(l, f, d, u, s[p + 5], 21, -57434055)),
        (u = y(u, l, f, d, s[p + 12], 6, 1700485571)),
        (d = y(d, u, l, f, s[p + 3], 10, -1894986606)),
        (f = y(f, d, u, l, s[p + 10], 15, -1051523)),
        (l = y(l, f, d, u, s[p + 1], 21, -2054922799)),
        (u = y(u, l, f, d, s[p + 8], 6, 1873313359)),
        (d = y(d, u, l, f, s[p + 15], 10, -30611744)),
        (f = y(f, d, u, l, s[p + 6], 15, -1560198380)),
        (l = y(l, f, d, u, s[p + 13], 21, 1309151649)),
        (u = y(u, l, f, d, s[p + 4], 6, -145523070)),
        (d = y(d, u, l, f, s[p + 11], 10, -1120210379)),
        (f = y(f, d, u, l, s[p + 2], 15, 718787259)),
        (l = y(l, f, d, u, s[p + 9], 21, -343485551)),
        (u = (u + g) >>> 0),
        (l = (l + b) >>> 0),
        (f = (f + _) >>> 0),
        (d = (d + w) >>> 0);
    }
    return t.endian([u, l, f, d]);
  }

  function p(e, n) {
    if (null == e) throw new Error("Illegal argument " + e);
    var o = t.wordsToBytes(i1(e, n));
    return n && n.asBytes
      ? o
      : n && n.asString
      ? bin.bytesToString(o)
      : t.bytesToHex(o);
  }

  function get_w_rid(task_id) {
    if (!(n || r)) {
      return null;
    }
    let unit1 = "";
    if (task_id) {
      unit1 = `task_id=${task_id}&web_location=${web_location}&`;
    }
    let now = Math.round(Date.now() / 1e3);
    let data = {
      wts: (u1 = `${unit1}wts=${now}`),
      w_rid: p(u1 + e),
      time: now,
    };
    return data;
  }
  //获取w_rid,若无w_rid和wts信息进行send请求,可能会遇到拦截
  //
  //

  /**
   * 领取任务奖励
   * @param taskId 任务id
   * 直接传入任务Id,方法自动通过getApiInfo需要信息发包请求奖励,失败5秒后重试
   */
  function send(taskId, isnew, addFunction) {
    getApiInfo(
      taskId,
      function trySend(json) {
        // 可能是动态数据
        let dynamicData;
        if (isnew) {
          dynamicData = {
            task_id: json.task_id,
            activity_id: json.act_id,
            activity_name: json.act_name,
            task_name: json.task_name,
            reward_name: json.reward_name,
            gaia_vtoken: "", // 这个值应该是动态获取的，或者是空字符串
            receive_from: "missionPage",
            csrf: getBiliJct(),
          };
        } else {
          dynamicData = {
            act_id: json.act_id,
            act_name: json.act_name,
            csrf: getBiliJct(),
            gaia_vtoken: "", // 这个值应该是动态获取的，或者是空字符串
            group_id: "0",
            receive_from: "missionPage",
            receive_id: json.receive_id,
            reward_name: json.reward_name,
            task_id: json.id,
            task_name: json.task_name,
          };
        }

        // 将动态数据转换为URL编码的字符串
        const body = new URLSearchParams(dynamicData).toString();
        const wrid = get_w_rid();
        fetch(
          (function () {
            return isnew
              ? `https://api.bilibili.com/x/activity_components/mission/receive?w_rid=${wrid.w_rid}&${wrid.wts}`
              : "https://api.bilibili.com/x/activity/mission/task/reward/receive";
          })(),
          {
            headers: {
              accept: "*/*",
              "content-type": "application/x-www-form-urlencoded",
              "sec-fetch-mode": "cors",
            },
            referrer: (function () {
              return isnew
                ? `https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=${taskId}`
                : `https://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=${taskId}`;
            })(),
            referrerPolicy: "no-referrer-when-downgrade",
            body: body,
            method: "POST",
            mode: "cors",
            credentials: "include",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.message === "任务奖励已经领取" || data.message === "0") {
              console.log(data.message); //成功输出
            } else if (
              data.code === 202100 ||
              data.message === "该用户需要验证"
            ) {
              //对是否验证码和是否有资格进行验证
              console.log(data.message);
              const e =
                  "//s1.hdslb.com/bfs/seed/jinkela/risk-captcha-sdk/CaptchaLoader.js",
                n = document.createElement("script");
              (n.src = e),
                (n.onload = async () => {
                  try {
                    const e = await CaptchaLoader.load(),
                      n = await e({
                        riskParams: {
                          v_voucher: data.data,
                        },
                        onInit: (data) => {
                          const e = data.instance;
                          setTimeout(() => {
                            e.destroy();
                          }, 6e4);
                        },
                      });
                    setTimeout(function () {
                      trySend(json);
                    }, 1000); //如果失败,1秒后重试
                  } catch (t) {
                    //此处原是用于弹出黑色提示
                    addFunction(data);
                  }
                }),
                document.querySelector(".liveTools").appendChild(n);
            } else if (
              json[
                (function () {
                  return isnew ? "task_finished" : "receive_id";
                })()
              ] == 0 ||
              data.code === 75154 ||
              data.code === 202101
            ) {
              //对是否验证码和是否有资格进行验证
              console.log(data.message);
            } else {
              setTimeout(function () {
                trySend(json);
              }, 1000); //如果失败,1秒后重试
            }
            //在此统一处理
            addFunction(data);
          })
          .catch((error) => console.error("Error:", error));
      },
      isnew
    );
  }
  function isNew() {
    //基于本地缓存设置bdoc
    if (localStorage.getItem("bdoc") == "bdoc_jql") {
      return false;
    } else {
      return true;
    }
  }
  //将类中的内容替换为新的内容,若没有新的内容则替换为加载指示器
  //如果第3形参直接传入一个对象,则只替换该对象的内容
  function replaceContent(className, newContent, querySelectorObject) {
    // 使用querySelectorAll获取所有具有指定类名的元素
    const elements = document.querySelectorAll(className);
    const content =
      newContent ||
      `  
            <div class="spinner-border text-warning spinner-border-sm" role="status">  
                <span class="visually-hidden">Loading...</span>  
            </div>  
        `;
    if (querySelectorObject) {
      const originalContent = querySelectorObject.innerHTML;
      querySelectorObject.innerHTML = "";
      querySelectorObject.innerHTML = content;
      return;
    }
    // 遍历所有元素
    elements.forEach((element) => {
      // 保存当前元素的内容
      const originalContent = element.innerHTML;

      // 清空元素内容
      element.innerHTML = "";

      // 将加载指示器添加到元素中
      element.innerHTML = content;

      // 如果需要，可以在这里存储原始内容或执行其他操作
      // 例如，将原始内容存储到元素的某个属性或全局变量中
      // element.setAttribute('data-original-content', originalContent);
    });
  }
  let setTimeoutID = [];
  //对卡片内容重绘
  function repaintCard() {
    if (!getBiliJct()) {
      //无登录信息直接结束
      console.log("无登录信息");

      let materrialCodeCards = document.querySelectorAll(
        ".materrialCode .card"
      );
      for (let i = 0; i < materrialCodeCards.length; i++) {
        //设置按钮内容
        materrialCodeCards[i].querySelector(".btn").innerHTML = "未登录"; //按钮内容
        //设置标题
        materrialCodeCards[i].querySelector(".card-title").innerHTML = "未登录"; //标题
        //设置奖励
        materrialCodeCards[i].querySelector(".card-text").innerHTML =
          "登录信息获取失败"; //奖励
      }
      return;
    }
    //对材料码的8个卡片进行初始化
    //data(getApi)的回流数据,i为卡片索引
    function repaint(data, i) {
      let task_name = data.task_name; //任务
      let reward_name = data.reward_name; //奖励名称
      let task_finished =
        data[
          (function () {
            return data.isnew ? "task_finished" : "receive_id";
          })()
        ] == 0; //是否完成 boolean
      let icon = data.award_icon; //图标
      let message = (function () {
        if (data.isnew) {
          return data.message;
        } else {
          let status = data.receive_status;
          if (status == 0) {
            return "无资格";
          } else if (status == 1) {
            if (!data.stock_num) {
              return "无库存";
            }
            return "领取奖励";
          } else if (status == 3) {
            return "已领取";
          } else {
            return "未知状态,点击尝试领取";
          }
        }
      })();
      // let cardHtml = `<div class="card col-xxl-3 col-lg-6 col-12" style="width: 18rem;">
      //     <img src="${icon}" class="card-img-top" alt="${reward_name}">
      //     <div class="card-body">
      //       <h5 class="card-title">${task_name}</h5>
      //       <p class="card-text">${reward_name}</p>
      //       <a href="#" class="btn btn-primary">${message}</a>
      //       <p class="card-text-report lead"></p>
      //     </div>
      //   </div>`;
      // let materrialCodeContent = document.querySelector(
      //   ".materrialCode .content .row"
      // );
      // materrialCodeContent.insertAdjacentHTML("beforeend", cardHtml); //插入到末尾
      let materrialCodeCards = document.querySelectorAll(
        ".materrialCode .card"
      );
      //设置按钮内容
      materrialCodeCards[i].querySelector(".btn").innerHTML = message; //按钮内容
      //设置图片
      let img = materrialCodeCards[i].querySelector(".card-img-top");
      img.src = icon; //图片
      img.alt = reward_name;
      img.onclick = function () {
        //打开链接https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=6ERA2wloghv59r00
        window.open(
          "https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=" +
            data.task_id
        );
      };
      //设置标题
      materrialCodeCards[i].querySelector(".card-title").innerHTML = task_name; //标题
      //设置奖励
      materrialCodeCards[i].querySelector(".card-text").innerHTML = reward_name; //奖励
      //设置按钮点击事件

      materrialCodeCards[i].querySelector(".btn").onclick = function () {
        let cardTextReport =
          materrialCodeCards[i].querySelector(".card-text-report");
        replaceContent(".a", "", cardTextReport);
        send(data.task_id, data.isnew, function (reportData) {
          //将reportData.message打印
          if (reportData.message.includes("请稍后再试")) {
            replaceContent(".a", "", cardTextReport);
            cardTextReport.innerHTML += reportData.message;
          } else if (
            reportData.message === "任务奖励已领取" ||
            reportData.message === "任务奖励已经领取" ||
            reportData.message === "0"
          ) {
            cardTextReport.innerHTML = "奖励已领取,在兑奖列表中查看";
          } else if (reportData.message.includes("ReceiveId")) {
            cardTextReport.innerHTML = "任务未完成";
          } else {
            cardTextReport.innerHTML = reportData.message;
          }
        });
      };
    }

    let num = 1;
    for (let i = 0; i < taskList.length; i++) {
      for (let j = 0; j < taskList[i].code.length; j++) {
        let tmpnum = num;
        setTimeoutID.push(
          setTimeout(function () {
            replaceContent(".materrialCodeReload");
            getApiInfo(
              taskList[i].code[j],
              (data) => {
                repaint(data, tmpnum - 1);
                replaceContent(".materrialCodeReload", "重载材料卡片");
              },
              taskList[i].isnew
            );
          }, 1100 * tmpnum)
        );
        num++;
      }
    }
  }
  //用于预先根据taskList长度创建卡片
  function generateAndInsertCards(targetElementSelector) {
    let num = 0;
    for (let i = 0; i < taskList.length; i++) {
      num += taskList[i].code.length;
    }
    let cardHtmlTemplate = `<div class="card col-xxl-3 col-lg-6 col-12" style="width: 18rem;">  
        <img src="about:blank" class="card-img-top" alt="...">  
        <div class="card-body">  
          <h5 class="card-title">未初始化</h5>  
          <p class="card-text">未初始化</p>  
          <a href="#" class="btn btn-primary">未初始化</a>  
          <p class="card-text-report lead"></p>  
        </div>  
      </div>`;

    const targetElement = document.querySelector(targetElementSelector);
    if (!targetElement) {
      console.error("Target element not found");
      return;
    }
    for (let i = 0; i < num; i++) {
      targetElement.insertAdjacentHTML("beforeend", cardHtmlTemplate);
    }
  }

  function winonload() {
    // 载入本地缓存的log
    let logtmp = localStorage.getItem("log");
    if (logtmp) {
      //删除前面的空字符
      logtmp = logtmp.replace(/^\s+/, "");
      addAndSaveLog(logtmp);
    }
    //设置我的个人信息
    setMyInfo();

    //
    //使用事件委托来监听btn-danger按钮(删除按钮)
    document
      .querySelector(".container.live")
      .addEventListener("click", function (event) {
        if (event.target.matches(".btn-danger")) {
          // 删除当前行
          let row = event.target.closest(".row").parentNode.parentNode;
          let match = row.classList[1].match(/\d+/);
          let rowNumber = parseInt(match[0], 10); //获取到行数的整数型
          //删除对应元素
          adds.splice(rowNumber - 1, 1);
          localStorage.setItem("adds", JSON.stringify(adds));
          //从Html中删除
          row.parentNode.removeChild(row);

          //删除直播窗口
          let liveDiv = document.querySelectorAll(
            ".project.container.text-center>.content>.row>div"
          );
          liveDiv[rowNumber - 1].remove();

          //修正所有row的class(row行数指示)
          let rows = document.querySelectorAll(".container.live>.row");
          for (let i = 0; i < rows.length; i++) {
            let classes = rows[i].className.split(" ");
            if (classes.length > 1) {
              // 先从数组中移除
              classes.splice(1, 1);

              // 然后将处理后的数组转换回字符串，并设置回元素的 class 属性
              rows[i].className = classes.join(" ");
            }
            rows[i].classList.add(`row${i + 1}`);
          }
        }
        //监听确定按钮
        if (event.target.matches(".getinput")) {
          let row = event.target.closest(".row");
          let match = row.classList[1].match(/\d+/);
          let rowNumber = parseInt(match[0], 10); //获取到行数的整数型
          // console.log(rowNumber);
          //获取input的值为room_id
          let room_id = getinput(rowNumber);
          //保存adds
          adds[rowNumber - 1] = room_id;
          localStorage.setItem("adds", JSON.stringify(adds));
          setMid(rowNumber, room_id);
          //设置对应的iframe的src
          let liveIframe = document.querySelectorAll(
            ".project.container.text-center>.content>.row iframe"
          );
          if (room_id && allLive && liveIframe[rowNumber - 1]) {
            liveIframe[
              rowNumber - 1
            ].src = `https://live.bilibili.com/${room_id}`;
            let livetmp = `https://live.bilibili.com/${room_id}`;
            liveIframe[rowNumber - 1].parentNode.querySelector(
              ".iframeClick"
            ).onclick = function () {
              window.open(livetmp);
            };
            addAndSaveLog(`${rowNumber}号直播间修改房间号${room_id}完成`);
          } else if (allLive && !room_id) {
            liveIframe[rowNumber - 1].src = ``;
            addAndSaveLog(`${rowNumber}号完成卸载`);
          } else {
            liveIframe[rowNumber - 1].src = ``;
          }
        }
        //任务开始按钮
        if (event.target.matches(`.btn-success`)) {
          if (!myinfo.csrf) {
            addAndSaveLog("用户csrf未获取,请先登录,自动任务开始失败");
            return;
          }
          let rowNumber = parseInt(
            event.target
              .closest(".row")
              .parentNode.parentNode.classList[1].match(/\d+/)[0],
            10
          ); //获取到行数的整数型
          let room_id = adds[rowNumber - 1];
          //
          //
          let row = event.target.closest(".row");
          let award_num = row.querySelector(`.award-num`).value; //获取奖励数量
          let message_num = row.querySelector(`.message-num`).value; //获取消息数量
          let mid = row.querySelector(`.mid`).value; //获取mid
          if (!room_id) {
            addAndSaveLog(`${rowNumber}号未设置房间号,自动任务开始失败`);
            return;
          }
          if (!mid) {
            addAndSaveLog(`${rowNumber}号未获取mid,自动任务开始失败`);
            return;
          }

          tmp2(); //调用赠送牛蛙函数
          tmp1(); //调用发送消息函数
          //任务开始改成添加任务
          //添加队列任务列表展示,添加删除任务按钮

          function tmp1() {
            if (message_num <= 0) {
              return;
            }
            for (let i = 0; i < message_num; i++) {
              queue.enqueue(
                sendLiveMessageInList,
                `给${room_id}发送弹幕`,
                room_id,
                myinfo.csrf
              );
            }
          }
          function tmp2() {
            if (award_num <= 0) {
              return;
            }
            if (parseInt(myinfo.myRoom_id) === parseInt(room_id)) {
              addAndSaveLog("无法给自己赠送礼物哦");
              return;
            }
            async function sendGiftAndCheckWallet(uid, mid, room_id, csrf) {
              return await myWallet()
                .then(async (wallet) => {
                  myinfo.myWallet = wallet;
                  if (wallet) {
                    return await sendniuwaniuwa(uid, mid, room_id, csrf);
                  } else {
                    addAndSaveLog(`${rowNumber}号 电池数异常,可能没电池了`);
                    return false;
                  }
                })
                .catch((error) => {
                  console.error("Failed to get wallet:", error);
                });
            }
            for (let i = 0; i < award_num; i++) {
              queue.enqueue(
                sendGiftAndCheckWallet,
                `给${room_id}送牛蛙`,
                myinfo.uid,
                mid,
                room_id,
                myinfo.csrf
              );
            }
          }
        }
      });
    //加载直播间,基于adds设置iframe
    let styleSheetsHtml = `    .project {
      margin-top: 60px;
      text-align: center;
    }

    .project .row div {
      margin-bottom: 10px;
      height: 200px;
    }

    .project .row div iframe {
      display: block;
      width: 100%;
      height: 200px;
      border-radius: 4px;
      background-color: rgba(255, 192, 203, 0.493);
    }`; //用于设置iframe是否可看见
    let strtmp =
      styleSheetsHtml +
      `
   .project .row div {
      height: 0;
    }

    .project .row div iframe {
      height: 0;
    }
`;
    function setStyleToPage(styleString) {
      //设置style属性
      // 查找页面中是否已经存在 <style> 元素
      var styleElement = document.querySelector("style");
      if (!styleElement) {
        // 如果不存在，创建一个新的 <style> 元素
        styleElement = document.createElement("style");
        // 将 <style> 元素添加到 <head> 中
        document.head.appendChild(styleElement);
      }
      // 将传入的字符串设置为 <style> 元素的文本内容
      styleElement.type = "text/css";
      if (styleElement.styleSheet) {
        // 兼容 IE
        styleElement.styleSheet.cssText = styleString;
      } else {
        // 其他浏览器
        styleElement.textContent = styleString;
      }
    }
    setStyleToPage(strtmp);
    document
      .querySelector(".container.userAll .alluse")
      .addEventListener("click", function (event) {
        let liveDiv = document.querySelectorAll(
          ".project.container.text-center>.content>.row>div"
        );
        let liveIframe = document.querySelectorAll(
          ".project.container.text-center>.content>.row iframe"
        );
        allLive = !allLive;
        if (allLive) {
          setStyleToPage(styleSheetsHtml);
          for (let i = 0; i < liveIframe.length && i < adds.length; i++) {
            if (adds[i]) {
              let livetmp = `https://live.bilibili.com/${adds[i]}`;
              liveIframe[i].parentNode.querySelector(".iframeClick").onclick =
                function () {
                  window.open(livetmp);
                };
              liveIframe[i].src = `https://live.bilibili.com/${adds[i]}`;
              addAndSaveLog(`${i + 1}号已加载`);
            } else {
              addAndSaveLog(`${i + 1}号未设置房间号`);
            }
          }
        } else {
          setStyleToPage(strtmp);
          for (let i = 0; i < liveIframe.length && i < adds.length; i++) {
            liveIframe[i].parentNode.querySelector(".iframeClick").onclick =
              null;
            liveIframe[i].src = ``;
            addAndSaveLog(`${i + 1}号已卸载`);
          }
        }
      });
    //添加行数按钮
    document
      .querySelector(".container.userAll .addLive")
      .addEventListener("click", function (event) {
        //增加inputgroup
        add_InputGroup_Row();
        //增加直播展示窗口
        add_LiveWindow();
      });
    //自动卸载按钮
    document
      .querySelector(".userAll .uninsTime")
      .addEventListener("click", function (event) {
        let value = autoplayerInput.value;
        if (value >= 0) {
          setUninsTime(value);
        }
      });
    //重载材料卡片
    document
      .querySelector(".materrialCode .materrialCodeReload")
      .addEventListener("click", function (event) {
        //清除正在加载中的卡片
        for (let i = 0; i < setTimeoutID.length; i++) {
          clearTimeout(setTimeoutID[i]);
        }
        repaintCard();
      });
    document
      .querySelector(".fixProject")
      .addEventListener("click", function (event) {
        //修正网页
        let burl = window.location.href;
        if (!(burl.indexOf("live.bilibili.com/04") !== -1)) {
          window.location.replace("https://live.bilibili.com/04");
        } else {
          alert("还是无法解决问题? 检查网络配置,更换浏览器或设备尝试");
        }
      });
    document
      .querySelector(`.taskControl`)
      .addEventListener("click", function (event) {
        let target = event.target;
        if (queue.queue.length <= 0) {
          target.innerHTML = "开始任务";
          return;
        }
        target.innerHTML =
          target.innerHTML == "开始任务" ? "停止任务" : "开始任务";
        if (!queue.isRunning) {
          queue.isPaused = false;
          queue.run();
        } else if (queue.isPaused) {
          queue.resume();
        } else if (!queue.isPaused) {
          queue.pause();
        }
      });
    //预先生成卡片
    generateAndInsertCards(".materrialCode .content .row");
    //repaintCard();
    //加载adds
    let addstmp = JSON.parse(localStorage.getItem("adds"));
    if (addstmp == null) {
      addstmp = [];
    }
    for (let i = 0; i < addstmp.length; i++) {
      add_InputGroup_Row(addstmp[i]);
      add_LiveWindow();
      setMid(i + 1, adds[i]);
    }
  }
  winonload();
  let autoplayer = document.querySelector(".userAll .uninsTime");
  let autoplayerInput = document.querySelector(".userAll .uninsTimeInput");
  // 调用工具的简易复制功能,将材料码打印到面板上
  // 在房间号列表旁边做计划列表收集,增加日志框,用于展示发送结果
  // 添加emoji列表,遍历发送,添加延迟
  // 一键发送弹幕按钮,添加复选框,选中发送的直播间号(将已收录的直播间地址展示出来adds)

  //V2.2
  //调整自动任务,使用队列任务,防止频繁//
  //重构材料卡片加载逻辑//
  //增加行备注功能(显示昵称)
  //直播窗口单独卸载功能
  //增加分区选择项//
  // function tmp1111() {
  //   let tmp = document.querySelector(".tool-wrap>.button.exchange-button");
  //   setInterval(function () {
  //     tmp.click();
  //   }, 500);
  // }
  // tmp1111();

  //V2.3
  //将match改成正常的直播间 解决Referrer 策略：针对跨站请求，忽略对其限制较宽松的 referrer 策略//
  //添加验证码弹窗//

  //V2.3.1
  //异常时不重试
  //V2.3.2
  //于正常直播间时,进行获取材料请求会自动刷新(暂时不知道什么原因),因此添加按钮进行手动选择
  //修复未有领奖资格时无法获取验证码
  //V2.4
  //官方更新接口,无w_rid和wts信息将拦截,增加w_rid和wts信息获取//错误信息{"code":-351,"message":"受到神秘力量干扰，请稍后再试！","ttl":1}
  //V2.4.0.1
  //崩坏更新新版本//
  //V2.4.1
  //修正兑奖页面//
  //修复材料码卡片刷新会导致重复提交//
  //V2.4.2
  //修复无法一键复制//
  //V2.4.3
  //追加崩坏3材料码//
  //V2.5.0
  //崩坏星穹铁道新版本//
  //infoApi追加加密参数//
  //V2.5.0.1
  //绝区零新版本//
  //V2.5.0.2
  //修复web_location = 888.81821//
  //V2.5.1
  //修复兑奖列表无内容时报错//
  //添加更多直播分区选择//
  //修复bootstrap异常//
  //V2.5.1.1
  //添加材料码卡片//
  //V2.5.2
  //取消50粉丝限制开播//1521
  //V2.5.2.1
  //游戏版本更新//
  //V2.5.2.2
  //游戏更新追加//
  //V2.5.2.3
  //更换bootstrap的cdn地址

  //直播卡片常显示,添加窗口独立卸载功能
  //更改材料码逻辑,不再每次请求都调用api获取信息,调用第一次api时获取的信息保存下来,下次使用
  //集成抢码脚本,使用卡片加载
  //791行的记录今日兑换码,可以改为数组或者json形式,使扩展代码跟方便(复制功能等)
})();
