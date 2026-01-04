// ==UserScript==
// @name         爱斐程序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动追踪并点赞斐斐,今天你爱斐了嘛(｡･ω･｡)ﾉ♡
// @author       斐斐的小迷妹
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496682/%E7%88%B1%E6%96%90%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/496682/%E7%88%B1%E6%96%90%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  const username = "musifei";
  let continueLiking = true;
  let offset = 0;
  let likeNumber = 100;

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  // 获取或初始化已处理的帖子ID集合
  function storagePostIds(username) {
    const key = `${username}_liked`;
    const storedIds = JSON.parse(localStorage.getItem(key) || "[]");
    const processedPostIds = new Set(storedIds);
    return { key, processedPostIds };
  }

  const { key, processedPostIds } = storagePostIds(username);

  async function sendHeartReaction(postId) {
    try {
      const response = await fetch(
        `/discourse-reactions/posts/${postId}/custom-reactions/heart/toggle.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "X-Csrf-Token": csrfToken,
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
        }
      );
      if (response.status === 429) {
        log.picture(
          "https://s2.loli.net/2024/05/29/LprcD2Pl4BKq3As.jpg",
          0.3,
          "今日爱斐已完成，明天也要继续爱斐哦(｡･ω･｡)ﾉ♡"
        );
        continueLiking = false; // 设置标志为false来停止进一步的请求
        return;
      }

      const data = await response.json();
      if (data.error_type) {
        log.error(`爱斐失败`, `帖子ID:${postId}, ${error}`);
      } else {
        const postNumber = data.post_number;
        const topicId = data.topic_id;
        const url = `https://linux.do/t/topic/${topicId}/${postNumber}`;
        log.success(`爱斐成功`, `帖子ID:${postId} url:${url}`);
        likeNumber -= 1;
        continueLiking = (likeNumber > 0) || log.success(`点赞完成`,`程序停止`);
        processedPostIds.add(postId);
        localStorage.setItem(key, JSON.stringify(Array.from(processedPostIds)));
      }
    } catch (error) {
      log.error(`爱斐失败`, `帖子ID:${postId}, ${error}`);
    }
  }

  async function fetchPostDetails(postId) {
    const response = await fetch(`https://linux.do/posts/${postId}.json`);
    if (!response.ok) throw new Error(`无法获取帖子ID ${postId} 的详细信息`);
    return await response.json();
  }

  async function fetchUserActions(username, offset) {
    const response = await fetch(
      `https://linux.do/user_actions.json?offset=${offset}&limit=1000&username=${username}&filter=5`
    );
    if (!response.ok) throw new Error(`无法获取用户 ${username} 的活动`);
    const data = await response.json();
    return data.user_actions;
  }

  function makeMulti(string) {
    let l = new String(string);
    l = l.substring(l.indexOf("/*") + 3, l.lastIndexOf("*/"));
    return l;
  }

  const string1 = function () {
    /*   
  
                        _  __     _     _                        _             _   
                       (_)/ _|   (_)   | |                      | |           | |  
    _ __ ___  _   _ ___ _| |_ ___ _    | | _____   _____     ___| |_ __ _ _ __| |_ 
   | '_ ` _ \| | | / __| |  _/ _ \ |   | |/ _ \ \ / / _ \   / __| __/ _` | '__| __|
   | | | | | | |_| \__ \ | ||  __/ |   | | (_) \ V /  __/   \__ \ || (_| | |  | |_ 
   |_| |_| |_|\__,_|___/_|_| \___|_|   |_|\___/ \_/ \___|   |___/\__\__,_|_|   \__|
                                                                                   
                                                                                   
  
  */
  };

  const prettyLog = () => {
    const isEmpty = (value) => {
      return value == null || value === undefined || value === "";
    };

    const prettyPrint = (title, text, color) => {
      console.log(
        `%c ${title} %c ${text} %c`,
        `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
        "background:transparent"
      );
    };

    const info = (textOrTitle, content = "") => {
      const title = isEmpty(content) ? "Info" : textOrTitle;
      const text = isEmpty(content) ? textOrTitle : content;
      prettyPrint(title, text, "#909399");
    };

    const error = (textOrTitle, content = "") => {
      const title = isEmpty(content) ? "Error" : textOrTitle;
      const text = isEmpty(content) ? textOrTitle : content;
      prettyPrint(title, text, "#F56C6C");
    };

    const warning = (textOrTitle, content = "") => {
      const title = isEmpty(content) ? "Warning" : textOrTitle;
      const text = isEmpty(content) ? textOrTitle : content;
      prettyPrint(title, text, "#E6A23C");
    };

    const success = (textOrTitle, content = "") => {
      const title = isEmpty(content) ? "Success" : textOrTitle;
      const text = isEmpty(content) ? textOrTitle : content;
      prettyPrint(title, text, "#67C23A");
    };

    const table = () => {
      const data = [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
      ];
      console.log(
        "%c id%c name%c age",
        "color: white; background-color: black; padding: 2px 10px;",
        "color: white; background-color: black; padding: 2px 10px;",
        "color: white; background-color: black; padding: 2px 10px;"
      );

      data.forEach((row) => {
        console.log(
          `%c ${row.id} %c ${row.name} %c ${row.age} `,
          "color: black; background-color: lightgray; padding: 2px 10px;",
          "color: black; background-color: lightgray; padding: 2px 10px;",
          "color: black; background-color: lightgray; padding: 2px 10px;"
        );
      });
    };

    const picture = (
      url = "https://s2.loli.net/2024/05/29/LprcD2Pl4BKq3As.jpg",
      scale = 0.3,
      text = "Here is the text next to the image"
    ) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        if (ctx) {
          const width = img.width * scale;
          const height = img.height * scale;

          c.width = width;
          c.height = height;

          ctx.fillStyle = "red";
          ctx.fillRect(0, 0, width, height);
          ctx.beginPath();
          ctx.arc(
            width / 2,
            height / 2,
            Math.min(width, height) / 2,
            0,
            Math.PI * 2
          );
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, width, height);

          const dataUri = c.toDataURL("image/png");

          console.log(
            `%c ` + `%c${text}`,
            `font-size: 1px; padding: ${Math.floor(height / 2)}px ${Math.floor(width / 2)}px; background-image: url(${dataUri}); background-repeat: no-repeat; background-size: ${width}px ${height}px; border-radius: 50%; color: transparent; vertical-align: bottom;`,
            `font-size: 14px; color: #ffb6c1; margin-left: 20px; font-family: "Arial", sans-serif; vertical-align: bottom;`
          );
        }
      };
      img.src = url;
    };

    return {
      info,
      error,
      warning,
      success,
      table,
      picture,
    };
  };

  // 创建打印对象
  const log = prettyLog();
  console.log(`开启爱斐程序，请等待......`);

  console.log(makeMulti(string1));
  log.picture(
    "https://s2.loli.net/2024/05/29/LprcD2Pl4BKq3As.jpg",
    0.3,
    "关注musifei喵，关注musifei谢谢喵"
  );

  while (continueLiking) {
    const userActions = await fetchUserActions(username, offset);

    // 过滤已经处理过的帖子ID

    const initialActionCount = userActions.length;
    const newActions = userActions.filter(
      (action) => !processedPostIds.has(action.post_id)
    );
    const filteredCount = initialActionCount - newActions.length;
    if (filteredCount > 0) {
      log.warning(`跳过`, `已点赞帖子 ${filteredCount}`);
    }
    const postIds = [];
    // 请求帖子信息并检查是否已点赞
    for (const action of userActions) {
      if (!continueLiking) break; // 检查是否应停止
      const postId = action.post_id;
      if (!processedPostIds.has(postId)) {
        try {
          const postDetails = await fetchPostDetails(postId);
          const userReacted =
            postDetails.current_user_reaction &&
            postDetails.current_user_reaction.id === "heart";
          if (!userReacted) {
            await sendHeartReaction(postId);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 控制点赞请求间隔
          } else {
            processedPostIds.add(postId);
            localStorage.setItem(
              key,
              JSON.stringify(Array.from(processedPostIds))
            );
            log.warning(`数据更新`, `帖子ID ${postId} 已点赞`);
          }
        } catch (error) {
          console.error(`处理帖子ID ${postId} 失败`, error);
        }
      }
    }
    if (userActions.length < 1000) {
      continueLiking = false;
      log.success(`程序停止`, `已无可以赞帖子`)
    } else {
      offset += 1000;
    }
  }
})();
