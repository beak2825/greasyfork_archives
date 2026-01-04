// ==UserScript==
// @name         自动点赞（大哥特供版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动追踪并点赞用户最近的发帖
// @author       嘉心糖
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496508/%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%EF%BC%88%E5%A4%A7%E5%93%A5%E7%89%B9%E4%BE%9B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/496508/%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%EF%BC%88%E5%A4%A7%E5%93%A5%E7%89%B9%E4%BE%9B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
 
(async function () {
    "use strict";
   
    //填写点赞次数
    let likeNumber = 88;
   
    //填写要点赞的用户名
    const username = "musifei";

    //每次拉取的数据,可根据已点赞帖子数量进行修改
    const limit = 1000;
   
    let continueLiking = true;
    let offset = 0;
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
          continueLiking = false; // 设置标志为false来停止进一步的请求
          return;
        }
   
        const data = await response.json();
        if (data.error_type) {
          log.error(`点赞失败`, `帖子ID:${postId}, ${error}`);
        } else {
          const postNumber = data.post_number;
          const topicId = data.topic_id;
          const url = `https://linux.do/t/topic/${topicId}/${postNumber}`;
   
          log.success(`点赞成功`, `帖子ID:${postId} url:${url}`);
          likeNumber -= 1;
          continueLiking = (likeNumber > 0) || log.success(`点赞完成`,`程序停止`);
          processedPostIds.add(postId);
          localStorage.setItem(key, JSON.stringify(Array.from(processedPostIds)));
        }
      } catch (error) {
        log.error(`点赞失败`, `帖子ID:${postId}, ${error}`);
      }
    }
   
    async function fetchPostDetails(postId) {
      const response = await fetch(`https://linux.do/posts/${postId}.json`);
      if (!response.ok) throw new Error(`无法获取帖子ID ${postId} 的详细信息`);
      return await response.json();
    }
   
    async function fetchUserActions(username, offset,limit) {
      const response = await fetch(
        `https://linux.do/user_actions.json?offset=${offset}&limit=${limit}&username=${username}&filter=5`
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
   
   
   
  !      __ __ _                         __  __      _                                       ____            ____    _     
  !     / //_/(_)___  ____ _            / / / /_  __(_)      _____  ____              ____  / __/           / __ \  (_)___ 
  !    / ,<  / / __ \/ __ `/  ______   / /_/ / / / / / | /| / / _ \/ __ \   ______   / __ \/ /_   ______   / / / / / / __ \
  !   / /| |/ / / / / /_/ /  /_____/  / __  / /_/ / /| |/ |/ /  __/ / / /  /_____/  / /_/ / __/  /_____/  / /_/ / / / / / /
  !  /_/ |_/_/_/ /_/\__, /           /_/ /_/\__,_/_/ |__/|__/\___/_/ /_/            \____/_/              \___\_\/_/_/ /_/ 
  !                /____/                                                                                                  
   
      */
    };
   
    const prettyLog = () => {
      const prettyPrint = (title, text, color) => {
        console.log(
          `%c ${title} %c ${text} %c`,
          `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
          `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
          "background:transparent"
        );
      };
   
      const info = (textOrTitle, content) => {
        prettyPrint(textOrTitle, content, "#909399");
      };
   
      const error = (textOrTitle, content) => {
        prettyPrint(textOrTitle, content, "#F56C6C");
      };
   
      const warning = (textOrTitle, content) => {
        prettyPrint(textOrTitle, content, "#E6A23C");
      };
   
      const success = (textOrTitle, content) => {
        prettyPrint(textOrTitle, content, "#67C23A");
      };
   
      return {
        info,
        error,
        warning,
        success,
      };
    };
   
    // 创建打印对象
    const log = prettyLog();
   
    console.log(makeMulti(string1));
   
    while (continueLiking) {
      const userActions = await fetchUserActions(username, offset,limit);
   
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
      if (userActions.length < limit) {
        continueLiking = false;
      } else {
        offset += limit;
      }
    }
  })();