// ==UserScript==
// @name         抖音主页视频图文下载
// @namespace    douyin-homepage-download
// @version      1.1.3
// @description  拦截抖音主页接口，获取用户信息和视频列表数据，于视频、图文下载
// @author       chrngfu
// @match        https://www.douyin.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://unpkg.com/fflate@0.8.2
// @downloadURL https://update.greasyfork.org/scripts/526056/%E6%8A%96%E9%9F%B3%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E5%9B%BE%E6%96%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/526056/%E6%8A%96%E9%9F%B3%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E5%9B%BE%E6%96%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 新增：作者信息展示区域
  function createAuthorInfoBox() {
    const authorInfoBox = document.createElement("div");
    authorInfoBox.id = "authorInfoBox";
    authorInfoBox.innerHTML = `
      <div class="header">
          <h4>作者信息</h4>
          <button id="deleteAuthorBtn">删除作者数据</button>
      </div>
      <div class="info-grid">
          <div><strong>昵称：</strong><span id="authorNickname">-</span></div>
          <div><strong>粉丝数：</strong><span id="authorFollowers">-</span></div>
          <div><strong>获赞数：</strong><span id="authorLikes">-</span></div>
          <div><strong>作品数：</strong><span id="authorWorks">-</span></div>
          <div><strong>IP 属地：</strong><span id="authorIP">-</span></div>
          <div><strong>签名：</strong><span id="authorSignature">-</span></div>
      </div>
  `;
    return authorInfoBox;
  }

  // 新增：友好提示函数
  function showFriendlyMessage(message, isSuccess = true) {
    const msgBox = document.createElement("div");
    msgBox.className = `friendly-message ${isSuccess ? "success" : "error"}`;
    msgBox.textContent = message;
    document.body.appendChild(msgBox);

    setTimeout(() => {
      document.body.removeChild(msgBox);
    }, 3000);
  }

  // 使用 GM_addStyle 添加 CSS 样式
  GM_addStyle(`
      /* 新增禁用按钮样式 */
      button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
      }
      #videoTableContainer {
          width: 90%;
          height: 80%;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          padding: 20px;
          z-index: 10000;
          border: 1px solid #ccc;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
      }
      #videoTableContainer h3 {
          margin: 0 0 10px 0;
      }
      #videoTableContainer table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
      }
      #videoTableContainer table th,
      #videoTableContainer table td {
          border: 1px solid #ddd;
          font-size: 14px;
          padding: 4px 6px;
          text-align: left;
          vertical-align: middle; /* 上下居中 */
      }
      #videoTableContainer table th {
          text-align: center;
          background-color: #f2f2f2;
          font-weight: bold;
      }
      #videoTableContainer table tr {
          height: 50px; /* 固定每行高度 */
      }
      #videoTableContainer table tr:nth-child(even) {
          background-color: #f9f9f9;
      }
      #videoTableContainer table tr:hover {
          background-color: #f1f1f1;
      }
      #videoTableContainer table td.center {
          text-align: center; /* 左右居中 */
      }
      #videoTableContainer .cover-image {
          max-width: 100px;
          max-height: 50px;
          display: block;
          margin: 0 auto;
      }
      #videoTableContainer .filters {
          margin-bottom: 10px;
      }
      #videoTableContainer .filters select,
      #videoTableContainer .filters input {
          margin-right: 10px;
      }
      #videoTableContainer .actions {
          margin-bottom: 10px;
      }
      #videoTableContainer .actions button {
          margin-right: 10px;
      }
      #videoTableContainer #videoTableWrapper {
          flex: 1;
          overflow-y: auto;
      }
      /* 新增样式 */
      #closeButton {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
      }
      #authorInfoBox {
          margin-bottom: 10px;
          padding: 10px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          display: none;
      }
      #authorInfoBox .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
      }
      #authorInfoBox h4 {
          margin: 0;
      }
      #deleteAuthorBtn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
      }
      #authorInfoBox .info-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
      }
      .friendly-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          color: white;
          border-radius: 4px;
          z-index: 100000;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }
      .friendly-message.success {
          background-color: #4CAF50;
      }
      .friendly-message.error {
          background-color: #f44336;
      }
      #videoTable td {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      #showDataButton {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10001;
      }
      /* 图片预览相关样式 */
      .preview-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100001;
          cursor: pointer;
      }

      .preview-image {
          max-width: 90%;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      }

      .cover-image {
          max-width: 100px;
          max-height: 50px;
          display: block;
          margin: 0 auto;
          cursor: pointer;
          transition: transform 0.2s;
      }

      .cover-image:hover {
          transform: scale(1.05);
      }
  `);

  // 获取 Aweme 名称
  function getAwemeName(aweme) {
    let name = aweme.item_title ? aweme.item_title : aweme.caption;
    if (!name) name = aweme.desc ? aweme.desc : aweme.awemeId;
    return (
      (aweme.date ? `【${aweme.date.slice(0, 10)}】` : "") +
      name
        .replace(/[\/:*?"<>|\s]+/g, "")
        .slice(0, 27)
        .replace(/\.\d+$/g, "")
    );
  }

  // 拦截 XHR 请求
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url; // 保存请求的 URL
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    // 监听请求完成事件
    this.addEventListener("load", function () {
      if (this._url.includes("/aweme/v1/web/user/profile/other")) {
        // 用户主页信息
        const userProfile = JSON.parse(this.responseText);
        console.log("原始用户主页信息:", userProfile);

        // 格式化用户信息
        const formattedUserInfo = formatUserData(userProfile.user || {});
        console.log("格式化后的用户信息:", formattedUserInfo);

        // 缓存用户信息
        cacheUserInfo(formattedUserInfo);
      } else if (this._url.includes("/aweme/v1/web/aweme/post/")) {
        // 主页视频列表信息
        const videoList = JSON.parse(this.responseText);
        console.log("主页视频列表信息:", videoList);
        processVideoList(videoList);
      }
    });

    return originalSend.apply(this, arguments);
  };

  // 格式化用户信息
  function formatUserData(userInfo) {
    for (let key in userInfo) {
      if (!userInfo[key]) userInfo[key] = ""; // 确保每个字段都有值
    }
    return {
      uid: userInfo.uid,
      nickname: userInfo.nickname,
      following_count: userInfo.following_count,
      mplatform_followers_count: userInfo.mplatform_followers_count,
      total_favorited: userInfo.total_favorited,
      unique_id: userInfo.unique_id ? userInfo.unique_id : userInfo.short_id,
      ip_location: userInfo.ip_location ? userInfo.ip_location.replace("IP属地：", "") : "",
      gender: userInfo.gender ? "男女".charAt(userInfo.gender).trim() : "",
      city: [userInfo.province, userInfo.city, userInfo.district].filter(x => x).join("·"), // 合并城市信息
      signature: userInfo.signature,
      aweme_count: userInfo.aweme_count,
      create_time: Date.now(),
    };
  }

  // 格式化日期
  function formatDate(date, fmt) {
    date = new Date(date * 1000);
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "H+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
  }

  // 格式化秒数为时间字符串
  function formatSeconds(value) {
    let secondTime = parseInt(value);
    let minuteTime = 0;
    let hourTime = 0;
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      if (minuteTime >= 60) {
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    let result = "" + parseInt(secondTime) + "秒";
    if (minuteTime > 0) {
      result = "" + parseInt(minuteTime) + "分钟" + result;
    }
    if (hourTime > 0) {
      result = "" + parseInt(hourTime) + "小时" + result;
    }
    return result;
  }

  // 缓存用户信息
  function cacheUserInfo(userInfo) {
    const cachedData = new Map(GM_getValue("cachedUserInfo", [])); // 改为 Map 形式
    cachedData.set(userInfo.uid, userInfo); // 使用 uid 作为 key
    GM_setValue("cachedUserInfo", Array.from(cachedData.entries())); // 保存为数组形式
    console.log("用户信息已缓存:", userInfo);
  }

  // 处理视频列表数据
  function processVideoList(videoList) {
    if (videoList.aweme_list) {
      const formattedVideos = videoList.aweme_list.map(formatDouyinAwemeData);
      // 缓存视频列表信息
      cacheVideoList(new Map(formattedVideos.map(video => [video.awemeId, video])));
    }
  }

  // 格式化 Douyin 视频数据
  function formatDouyinAwemeData(item) {
    return {
      awemeId: item.aweme_id,
      item_title: item.item_title || "",
      caption: item.caption || "",
      desc: item.desc || "",
      type: item.images ? "图文" : "视频",
      tag: (item.text_extra || [])
        .map(tag => tag.hashtag_name)
        .filter(tag => tag)
        .join("#"),
      video_tag: (item.video_tag || [])
        .map(tag => tag.tag_name)
        .filter(tag => tag)
        .join("->"),
      date: formatDate(item.create_time, "yyyy-MM-dd HH:mm:ss"),
      create_time: item.create_time,
      ...(item.statistics && {
        diggCount: item.statistics.digg_count,
        commentCount: item.statistics.comment_count,
        collectCount: item.statistics.collect_count,
        shareCount: item.statistics.share_count,
      }),
      ...(item.video && {
        duration: formatSeconds(Math.round(item.video.duration / 1e3)),
        url: item.video.play_addr.url_list[0],
        cover: item.video.cover.url_list[0],
        images: item.images ? item.images.map(row => row.url_list.pop()) : null,
      }),
      ...(item.author && {
        uid: item.author.uid,
        nickname: item.author.nickname,
      }),
    };
  }

  // 缓存视频列表信息
  function cacheVideoList(videos) {
    const cachedData = new Map(GM_getValue("cachedVideoList", [])); // 获取缓存并转换为 Map

    videos.forEach((video, awemeId) => {
      cachedData.set(awemeId, video); // 设置新视频
    });

    GM_setValue("cachedVideoList", Array.from(cachedData.entries())); // 更新缓存
  }

  // 显示视频列表信息
  function displayVideoList() {
    // 先移除旧的表格容器
    const oldTableContainer = document.getElementById("videoTableContainer");
    if (oldTableContainer) document.body.removeChild(oldTableContainer);

    const videosArray = GM_getValue("cachedVideoList", []);
    const videos = new Map(videosArray);
    const authors = [...new Set(Array.from(videos.values()).map(video => video.nickname))];
    const types = ["视频", "图文"];

    const tableContainer = document.createElement("div");
    tableContainer.id = "videoTableContainer";
    tableContainer.innerHTML = `
          <button id="closeButton" style="position:absolute;top:10px;right:10px;background-color:#f44336;color:white;border:none;padding:5px 10px;cursor:pointer;">关闭</button>
          <div class="filters">
              <label for="authorFilter">作者:</label>
              <select id="authorFilter">
                  <option value="">全部</option>
                  ${authors.map(author => `<option value="${author}">${author}</option>`).join("")}
              </select>
              <label for="typeFilter">类型:</label>
              <select id="typeFilter">
                  <option value="">全部</option>
                  ${types.map(type => `<option value="${type}">${type}</option>`).join("")}
              </select>
          </div>
          <!-- 新增作者信息展示区域 -->
          ${createAuthorInfoBox().outerHTML}
          <div class="actions">
              <button id="downloadSelected">下载选中内容</button>
              <button id="clearSelected">清除选中内容</button>
              <span id="selectedCount" style="margin-left: 10px;">已选择: 0 个</span>
          </div>
          <p id="downloadStatus"></p>
          <h3>视频列表</h3>
          <div id="videoTableWrapper">
              <table id="videoTable">
                  <thead>
                      <tr>
                          <th style="width:55px;"><input type="checkbox" id="selectAll"></th>
                          <th style="width:100px;">封面</th>
                          <th style="width:180px;">标题</th>
                          <th>描述</th>
                          <th style="width:100px;">类型</th>
                          <th>标签</th>
                          <th style="width:200px;">发布时间</th>
                          <th style="width:100px;">点赞数</th>
                          <th style="width:100px;">评论数</th>
                          <th style="width:100px;">分享数</th>
                          <th style="width:100px;">收藏数</th>
                          <th style="width:100px;">时长</th>
                          <th style="width:100px;">作者</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${Array.from(videos.values())
                        .map(
                          video => `
                          <tr>
                              <td class="center"><input type="checkbox" class="videoCheckbox" data-id="${
                                video.awemeId
                              }"></td>
                              <td class="center">
                                  <img 
                                      src="${video.cover || (video.images ? video.images[0] : "")}" 
                                      class="cover-image" 
                                      data-preview="true"
                                      alt="封面"
                                  />
                              </td>
                              <td title="${
                                video.item_title
                              }" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${
                            video.item_title
                          }</td>
                              <td title="${
                                video.desc
                              }" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${video.desc}</td>
                              <td class="center">${video.type}</td>
                              <td title="${video.tag}">${video.tag}</td>
                              <td class="center">${video.date}</td>
                              <td class="center">${video.diggCount || 0}</td>
                              <td class="center">${video.commentCount || 0}</td>
                              <td class="center">${video.shareCount || 0}</td>
                              <td class="center">${video.collectCount || 0}</td>
                              <td class="center">${video.duration}</td>
                              <td class="center">${video.nickname}</td>
                          </tr>
                      `,
                        )
                        .join("")}
                  </tbody>
              </table>
          </div>
      `;
    document.body.appendChild(tableContainer);

    // 绑定关闭按钮事件
    document.getElementById("closeButton").addEventListener("click", () => {
      document.body.removeChild(tableContainer);
    });

    // 绑定筛选条件变化事件
    document.getElementById("authorFilter").addEventListener("change", filterTable);
    document.getElementById("typeFilter").addEventListener("change", filterTable);

    // 添加表格点击事件监听
    const videoTable = document.getElementById("videoTable");
    videoTable.addEventListener("click", e => {
      const target = e.target;
      if (target.matches("img.cover-image[data-preview]")) {
        showImagePreview(target.src);
      }
    });

    // 绑定下载和清除按钮事件
    document.getElementById("downloadSelected").addEventListener("click", downloadSelectedItems);
    document.getElementById("clearSelected").addEventListener("click", clearSelectedItems);

    // 绑定全选复选框事件
    document.getElementById("selectAll").addEventListener("change", e => {
      const checkboxes = document.querySelectorAll(".videoCheckbox");
      checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
      });
    });

    // 更新选中数量的函数
    function updateSelectedCount() {
      const selectedCount = document.querySelectorAll(".videoCheckbox:checked").length;
      const selectedCountElement = document.getElementById("selectedCount");
      selectedCountElement.textContent = `已选择: ${selectedCount} 个`;

      // 同时更新下载和清除按钮的状态
      const downloadBtn = document.getElementById("downloadSelected");
      const clearBtn = document.getElementById("clearSelected");
      const hasSelection = selectedCount > 0;
      downloadBtn.disabled = !hasSelection;
      clearBtn.disabled = !hasSelection;
    }

    // 为所有复选框添加change事件监听
    document.querySelectorAll(".videoCheckbox").forEach(checkbox => {
      checkbox.addEventListener("change", updateSelectedCount);
    });

    // 修改全选复选框事件
    document.getElementById("selectAll").addEventListener("change", e => {
      const checkboxes = document.querySelectorAll(".videoCheckbox");
      checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
      });
      updateSelectedCount();
    });

    // 初始化时设置按钮状态
    updateSelectedCount();
  }

  // 过滤表单（改为动态生成表格内容）
  function filterTable() {
    const authorFilter = document.getElementById("authorFilter").value;
    const typeFilter = document.getElementById("typeFilter").value;
    const videosArray = GM_getValue("cachedVideoList", []);
    const videos = new Map(videosArray);
    const userInfoArray = GM_getValue("cachedUserInfo", []);
    const userInfoMap = new Map(userInfoArray);

    // 更新作者信息
    const authorInfoBox = document.getElementById("authorInfoBox");
    const authorNickname = document.getElementById("authorNickname");
    const authorFollowers = document.getElementById("authorFollowers");
    const authorLikes = document.getElementById("authorLikes");
    const authorWorks = document.getElementById("authorWorks");
    const authorIP = document.getElementById("authorIP");
    const authorSignature = document.getElementById("authorSignature");
    const deleteAuthorBtn = document.getElementById("deleteAuthorBtn");

    if (authorFilter) {
      const selectedVideo = Array.from(videos.values()).find(video => video.nickname === authorFilter);
      if (selectedVideo) {
        const userInfo = userInfoMap.get(selectedVideo.uid);
        if (userInfo) {
          authorNickname.textContent = userInfo.nickname;
          authorFollowers.textContent = userInfo.mplatform_followers_count || "-";
          authorLikes.textContent = userInfo.total_favorited || "-";
          authorWorks.textContent = userInfo.aweme_count || "-";
          authorIP.textContent = userInfo.ip_location || "-";
          authorSignature.textContent = userInfo.signature || "-";
          deleteAuthorBtn.setAttribute("data-uid", userInfo.uid);
          authorInfoBox.style.display = "block";

          // 绑定删除按钮事件
          deleteAuthorBtn.onclick = () => deleteAuthorData(userInfo.uid);
        }
      }
    } else {
      authorInfoBox.style.display = "none";
    }

    // 重新绑定复选框事件
    document.querySelectorAll(".videoCheckbox").forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        const selectedCount = document.querySelectorAll(".videoCheckbox:checked").length;
        const selectedCountElement = document.getElementById("selectedCount");
        selectedCountElement.textContent = `已选择: ${selectedCount} 个`;

        // 更新按钮状态
        const downloadBtn = document.getElementById("downloadSelected");
        const clearBtn = document.getElementById("clearSelected");
        const hasSelection = selectedCount > 0;
        downloadBtn.disabled = !hasSelection;
        clearBtn.disabled = !hasSelection;
      });
    });

    // 更新选中数量显示
    const selectedCount = document.querySelectorAll(".videoCheckbox:checked").length;
    const selectedCountElement = document.getElementById("selectedCount");
    selectedCountElement.textContent = `已选择: ${selectedCount} 个`;

    // 重新生成表格内容
    const tbody = document.querySelector("#videoTable tbody");
    tbody.innerHTML = Array.from(videos.values())
      .filter(video => {
        const matchAuthor = !authorFilter || video.nickname === authorFilter;
        const matchType = !typeFilter || video.type === typeFilter;
        return matchAuthor && matchType;
      })
      .map(
        video => `
              <tr>
                  <td class="center"><input type="checkbox" class="videoCheckbox" data-id="${video.awemeId}"></td>
                  <td class="center">
                      <img 
                          src="${video.cover || (video.images ? video.images[0] : "")}" 
                          class="cover-image" 
                          data-preview="true"
                          alt="封面"
                      />
                  </td>
                  <td title="${video.item_title}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${
          video.item_title
        }</td>
                  <td title="${video.desc}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${
          video.desc
        }</td>
                  <td class="center">${video.type}</td>
                  <td title="${video.tag}">${video.tag}</td>
                  <td class="center">${video.date}</td>
                  <td class="center">${video.diggCount || 0}</td>
                  <td class="center">${video.commentCount || 0}</td>
                  <td class="center">${video.shareCount || 0}</td>
                  <td class="center">${video.collectCount || 0}</td>
                  <td class="center">${video.duration}</td>
                  <td class="center">${video.nickname}</td>
              </tr>
          `,
      )
      .join("");
  }

  // 修改下载选中的项目函数
  async function downloadSelectedItems() {
    const selectedCheckboxes = document.querySelectorAll(".videoCheckbox:checked");
    const selectedVideos = Array.from(selectedCheckboxes).map(cb => {
      const videosArray = GM_getValue("cachedVideoList", []);
      const videos = new Map(videosArray);
      return videos.get(cb.getAttribute("data-id"));
    });

    if (selectedVideos.length === 0) {
      alert("请选择要下载的内容。");
      return;
    }

    const firstType = selectedVideos[0].type;
    if (selectedVideos.some(video => video.type !== firstType)) {
      alert("只能选择同一种类型的项目进行下载。");
      return;
    }

    const statusElement = document.getElementById("downloadStatus");

    // 如果只选中一个视频，直接下载
    if (selectedVideos.length === 1 && firstType === "视频") {
      const video = selectedVideos[0];
      try {
        statusElement.textContent = "正在下载视频...";
        const response = await fetch(video.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${getAwemeName(video)}.mp4`;
        a.click();
        URL.revokeObjectURL(url);

        statusElement.textContent = "下载完成！";
        showFriendlyMessage("✅ 下载完成！");
      } catch (error) {
        console.error("下载失败:", error);
        statusElement.textContent = "下载失败，请重试。";
        showFriendlyMessage("❌ 下载失败，请重试", false);
      }
      return;
    }

    // 多个文件时使用 fflate 压缩
    let failedItems = [];
    const zipObj = {};
    const totalItems = selectedVideos.length;
    let completedItems = 0;

    statusElement.textContent = `准备下载 ${selectedVideos.length} 个${firstType}...`;

    // 并行下载所有文件
    const downloadPromises = selectedVideos.map(async video => {
      try {
        await downloadAndAddToZipObj(zipObj, video, firstType);
        completedItems++;
        statusElement.textContent = `下载中（${completedItems}/${totalItems}）`;
      } catch (error) {
        failedItems.push(video.item_title || video.desc);
        console.error(`下载失败: ${video.item_title}`, error);
      }
    });

    // 等待所有文件下载完成
    await Promise.all(downloadPromises);
    if (Object.keys(zipObj).length > 0) {
      try {
        // 计算所有文件的总大小
        let totalSize = 0;
        for (const key in zipObj) {
          totalSize += zipObj[key].length;
        }

        // 如果总大小超过100MB，进行分块压缩
        if (totalSize > 100 * 1024 * 1024) {
          const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB
          const chunks = {};
          let currentChunk = {};
          let currentSize = 0;
          let chunkIndex = 1;

          // 将文件分配到不同的块
          for (const key in zipObj) {
            if (currentSize + zipObj[key].length > CHUNK_SIZE) {
              chunks[chunkIndex] = currentChunk;
              currentChunk = {};
              currentSize = 0;
              chunkIndex++;
            }
            currentChunk[key] = zipObj[key];
            currentSize += zipObj[key].length;
          }
          if (Object.keys(currentChunk).length > 0) {
            chunks[chunkIndex] = currentChunk;
          }

          // 逐个压缩和下载每个块
          for (let i = 1; i <= chunkIndex; i++) {
            let dots = 0;
            statusElement.textContent = `压缩第 ${i}/${chunkIndex} 个文件包`;
            const compressInterval = setInterval(() => {
              dots = (dots + 1) % 4;
              statusElement.textContent = `压缩第 ${i}/${chunkIndex} 个文件包${"".padEnd(dots, "。")}`;
            }, 200);

            try {
              const zipData = await new Promise((resolve, reject) => {
                fflate.zip(
                  chunks[i],
                  {
                    level: 6,
                    mem: 8,
                  },
                  (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                  },
                );
              });

              clearInterval(compressInterval);
              statusElement.textContent = `下载第 ${i}/${chunkIndex} 个文件包...`;

              // 下载当前块
              const blob = new Blob([zipData], { type: "application/zip" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `[${firstType}]${selectedVideos[0]?.nickname}_part${i}.zip`;
              a.click();
              URL.revokeObjectURL(url);

              // 等待一段时间再开始下一个块的处理
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
              clearInterval(compressInterval);
              throw error;
            }
          }

          if (failedItems.length > 0) {
            statusElement.textContent = `完成！成功: ${completedItems}个，失败: ${failedItems.length}个`;
            showFriendlyMessage(`⚠️ 部分下载成功，${failedItems.length}个项目失败`, false);
          } else {
            statusElement.textContent = `全部完成！成功下载 ${completedItems} 个文件（共 ${chunkIndex} 个压缩包）`;
            showFriendlyMessage("✅ 下载完成！");
          }
        } else {
          // 原有的单个压缩包逻辑
          let dots = 0;
          statusElement.textContent = "压缩中";
          const compressInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            statusElement.textContent = `压缩中${"".padEnd(dots, "。")}`;
          }, 200);

          // 使用异步压缩
          const zipData = await new Promise((resolve, reject) => {
            try {
              fflate.zip(
                zipObj,
                {
                  level: 6,
                  mem: 8,
                },
                (err, data) => {
                  if (err) reject(err);
                  else resolve(data);
                },
              );
            } catch (error) {
              reject(error);
            }
          });

          clearInterval(compressInterval);
          statusElement.textContent = "压缩完成，准备下载...";

          // 创建并下载压缩文件
          const blob = new Blob([zipData], { type: "application/zip" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `[${firstType}]${selectedVideos[0]?.nickname}.zip`;
          a.click();
          URL.revokeObjectURL(url);

          if (failedItems.length > 0) {
            statusElement.textContent = `完成！成功: ${completedItems}个，失败: ${failedItems.length}个`;
            showFriendlyMessage(`⚠️ 部分下载成功，${failedItems.length}个项目失败`, false);
          } else {
            statusElement.textContent = `全部完成！成功下载 ${completedItems} 个文件`;
            showFriendlyMessage("✅ 下载完成！");
          }
        }
      } catch (error) {
        console.error("压缩失败:", error);
        statusElement.textContent = "压缩文件时出错，请重试。";
        showFriendlyMessage("❌ 压缩失败，请重试", false);
      }
    } else {
      statusElement.textContent = "所有项目下载失败。";
      showFriendlyMessage("❌ 下载失败，请重试", false);
    }
  }

  // 修改下载单个项目的函数
  async function downloadAndAddToZipObj(zipObj, video, type) {
    try {
      if (type === "视频") {
        const response = await fetch(video.url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        zipObj[`${getAwemeName(video)}.mp4`] = new Uint8Array(arrayBuffer);
      } else if (type === "图文") {
        const folderName = getAwemeName(video);
        const totalImages = video.images.length;

        for (let i = 0; i < totalImages; i++) {
          const imageUrl = video.images[i];
          try {
            const imgResponse = await fetch(imageUrl);
            if (!imgResponse.ok) throw new Error(`HTTP error! status: ${imgResponse.status}`);
            const arrayBuffer = await imgResponse.arrayBuffer();
            zipObj[`${folderName}/image_${i + 1}.jpg`] = new Uint8Array(arrayBuffer);
          } catch (error) {
            console.error(`图片 ${i + 1} 下载失败:`, error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error(`下载失败:`, error);
      throw error;
    }
  }

  // 清除选中的项目
  function clearSelectedItems() {
    const selectedCheckboxes = document.querySelectorAll(".videoCheckbox:checked");
    if (selectedCheckboxes.length === 0) {
      alert("请先选择要清除的内容。");
      return;
    }

    const videosArray = GM_getValue("cachedVideoList", []);
    const videos = new Map(videosArray);

    // 从缓存中删除选中的视频
    selectedCheckboxes.forEach(checkbox => {
      const awemeId = checkbox.getAttribute("data-id");
      videos.delete(awemeId); // 从 Map 中删除
    });

    // 更新缓存
    GM_setValue("cachedVideoList", Array.from(videos.entries()));
    console.log("已清除选中的内容:", Array.from(videos.values()));

    // 刷新表格
    displayVideoList();
    showFriendlyMessage("🗑️ 已清除选中内容！");
  }

  // 新增：删除作者数据的函数
  function deleteAuthorData(uid) {
    if (!confirm("确定要删除该作者的所有数据吗？此操作不可恢复。")) {
      return;
    }

    // 删除用户信息
    const userInfoArray = GM_getValue("cachedUserInfo", []);
    const userInfoMap = new Map(userInfoArray);
    userInfoMap.delete(uid);
    GM_setValue("cachedUserInfo", Array.from(userInfoMap.entries()));

    // 删除相关视频数据
    const videosArray = GM_getValue("cachedVideoList", []);
    const videos = new Map(videosArray);
    for (const [awemeId, video] of videos.entries()) {
      if (video.uid === uid) {
        videos.delete(awemeId);
      }
    }
    GM_setValue("cachedVideoList", Array.from(videos.entries()));

    // 刷新表格显示
    displayVideoList();
    showFriendlyMessage("✅ 作者数据已删除！");
  }

  // 添加预览图片功能
  function showImagePreview(imageUrl) {
    const overlay = document.createElement("div");
    overlay.className = "preview-overlay";

    const img = document.createElement("img");
    img.className = "preview-image";
    img.src = imageUrl;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // 点击关闭预览
    overlay.onclick = () => {
      document.body.removeChild(overlay);
    };

    // 按ESC键关闭预览
    const escHandler = e => {
      if (e.key === "Escape") {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  // 创建按钮
  const button = document.createElement("button");
  button.id = "showDataButton";
  button.innerText = "显示数据列表";
  button.onclick = displayVideoList;
  document.body.appendChild(button);

  console.log("抖音主页视频图文下载脚本已加载！");
})();
