// ==UserScript==
// @name         InsCNM
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description  获取INS数据！
// @author       Belugu
// @match        https://www.instagram.com/p/*
// @match        https://www.instagram.com/reel/*
// @match        https://www.instagram.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @icon         https://iili.io/29TPCR1.jpg
// @downloadURL https://update.greasyfork.org/scripts/512151/InsCNM.user.js
// @updateURL https://update.greasyfork.org/scripts/512151/InsCNM.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 添加 Toastify 的 CSS 样式
  GM_addStyle(GM_getResourceText("TOASTIFY_CSS"));

  // Main logic
  $(document).ready(async function() {
  if (window.location.href.match(/^https:\/\/www\.instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]+\/$/)) {
    const shortcode = extractShortcodeFromURL(window.location.href);
    if (shortcode) {
      const mediaInfo = await fetchMediaInfoByShortcode(shortcode);
      if (mediaInfo) {
        const { taken_at, comment_count, like_count } = mediaInfo.items[0];
        const mediaInfoHtml = `
          <p>发布时间: ${new Date(taken_at * 1000).toLocaleString()} <button class="copy-btn" data-copy="${new Date(taken_at * 1000).toLocaleString()}" style="background:none; border:none; cursor:pointer;">📋</button></p>
          <p>评论数: ${comment_count} <button class="copy-btn" data-copy="${comment_count}" style="background:none; border:none; cursor:pointer;">📋</button></p>
          <p>点赞数: ${like_count} <button class="copy-btn" data-copy="${like_count}" style="background:none; border:none; cursor:pointer;">📋</button></p>
        `;
        showMediaInfoUI(mediaInfoHtml);
      } else {
        showMediaInfoUI('<p>获取媒体信息失败。</p>');
      }
    }
  } else {
    // 如果不是特定的帖子页面，显示默认界面
    showMediaInfoUI('<p>输入网址后按 Enter 搜索。</p>');
  }
});

function showMediaInfoUI(mediaInfoHtml) {
  // 检查是否已经存在菜单界面
  if ($('#instagram-fetcher-ui').length) {
    // 如果存在，更新内容即可
    $('#media-info-output').html(mediaInfoHtml);
    return;
  }

  const container = $(
    `<div id="instagram-fetcher-ui" style="
      position:fixed;
      top:20px;
      right:-350px;
      background: rgba(255, 255, 255, 0.7);
      color:black;
      border:1px solid #ccc;
      padding:15px;
      z-index:10000;
      width:350px;
      border-radius:10px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      cursor: move;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="color:black; margin:0; text-align:center; width:100%;">insCNM</h3>
      </div>
      <div id="input-area" style="margin-top:10px; width: 100%;">
        <input type="text" id="instagram-url-input" placeholder="输入网址" style="
          width: 100%;
          padding:5px;
          margin: 0;
          border:1px solid #ccc;
          border-radius:5px;
          box-sizing: border-box; /* 添加这行 */
          background: rgba(255, 255, 255, 0.8);
        " />
      </div>
      <div id="media-info-output" style="
          margin-top:15px;
          font-size:14px;
          text-align: left;
          width: 100%;
        ">${mediaInfoHtml}</div>
    </div>`
  );

  $('body').append(container);
  $('#instagram-fetcher-ui').animate({ right: '20px' }, 400);

  // 调用函数使菜单可拖动
  dragElement(document.getElementById("instagram-fetcher-ui"));

    $('#instagram-url-input').on('click', function() {
      $(this).focus();
    });

    $('#instagram-url-input').on('keyup', async function(e) {
      if (e.which === 13) { // Enter key pressed
        const url = $('#instagram-url-input').val();
        console.log("User entered URL:", url);
        if (url) {
          const shortcode = extractShortcodeFromURL(url);
          if (shortcode) {
            $('#media-info-output').slideUp(200, async function() {
              $('#media-info-output').text('正在获取媒体信息...');
              $(this).slideDown(200);
            });
            const mediaInfo = await fetchMediaInfoByShortcode(shortcode);
            if (mediaInfo) {
              const { taken_at, comment_count, like_count } = mediaInfo.items[0];
              $('#media-info-output').slideUp(200, function() {
                $('#media-info-output').html(
                  `<p>发布时间: ${new Date(taken_at * 1000).toLocaleString()} <button class="copy-btn" data-copy="${new Date(taken_at * 1000).toLocaleString()}" style="background:none; border:none; cursor:pointer;">📋</button></p>
                   <p>评论数: ${comment_count} <button class="copy-btn" data-copy="${comment_count}" style="background:none; border:none; cursor:pointer;">📋</button></p>
                   <p>点赞数: ${like_count} <button class="copy-btn" data-copy="${like_count}" style="background:none; border:none; cursor:pointer;">📋</button></p>`
                );
                $(this).slideDown(400);
              });
            } else {
              $('#media-info-output').slideUp(200, function() {
                $('#media-info-output').text('获取媒体信息失败。').slideDown(400);
              });
            }
          } else {
            $('#media-info-output').slideUp(200, function() {
              $('#media-info-output').text('无效的 Instagram URL。').slideDown(400);
            });
          }
        }
      }
    });

    $(document).on('click', '.copy-btn', function() {
      const textToCopy = $(this).data('copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification("已复制到剪贴板");
      }).catch(err => {
        console.error('复制失败:', err);
      });
    });
  }

  function showNotification(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'center',
      style: {
        background: getRandomGradientColor(),
        color: '#FFFFFF',
        borderRadius: '2px',
      },
      stopOnFocus: true,
    }).showToast();
  }

  function getRandomGradientColor() {
    const gradients = [
      'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(to right, #d4fc79, #96e6a1)',
      'linear-gradient(to right, #ff0844, #ffb199)',
      'linear-gradient(to right, #f83600, #f9d423)',
      'linear-gradient(to right, #00cdac, #8ddad5)',
      'linear-gradient(to right, #df89b5, #bfd9fe)',
      'linear-gradient(to right, #d7d2cc, #304352)',
      'linear-gradient(to right, #c1c161, #d4d4b1)',
      'linear-gradient(to right, #20E2D7, #F9FEA5)',
      'linear-gradient(to right, #8360c3, #2ebf91)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }

  document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key === 'n') {
      const container = $('#instagram-fetcher-ui');
      if (container.length) {
        container.css({
          transition: 'all 0.5s ease',
          filter: 'blur(10px)',
          opacity: '0'
        });
        setTimeout(() => container.remove(), 500);
      } else {
        showMediaInfoUI('<p>输入网址后按 Enter 搜索。</p>');
      }
    }
  });

  function extractShortcodeFromURL(url) {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      console.log("URL Object:", urlObj);
      console.log("Path Segments:", pathSegments);
      if (pathSegments[1] === 'p' || pathSegments[1] === 'reel') {
        return pathSegments[2] ? pathSegments[2] : null;
      }
      return null;
    } catch (error) {
      console.error("Error extracting shortcode from URL:", error);
      return null;
    }
  }

  async function fetchMediaInfoByShortcode(shortcode) {
    const mediaId = await getMediaID(shortcode);
    if (!mediaId) {
      console.error("Failed to fetch media ID.");
      $('#media-info-output').text('获取媒体 ID 失败，请稍后重试。');
      return null;
    }

    try {
      const mediaInfo = await getMediaInfo(mediaId);
      console.log("Media Info:", mediaInfo);
      return mediaInfo;
    } catch (error) {
      console.error("Error retrieving media info:", error);
      return null;
    }
  }

  async function getMediaID(shortcode) {
    try {
      const response = await fetch(`https://www.instagram.com/p/${shortcode}/`, {
        headers: {
          "User-Agent": window.navigator.userAgent,
          "Accept": "text/html"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const mediaIdMatch = html.match(/"media_id":"(\d+)"/);
      if (mediaIdMatch) {
        return mediaIdMatch[1];
      } else {
        console.error("Media ID not found in page HTML.");
      }
    } catch (error) {
      console.error("Error fetching media ID:", error);
    }
    return null;
  }

  function getAppID() {
    let result = null;
    $('script[type="application/json"]').each(function() {
      const regexp = /"APP_ID":"([0-9]+)"/ig;
      const matcher = $(this).text().match(regexp);
      if (matcher != null && result == null) {
        result = [...$(this).text().matchAll(regexp)];
      }
    });
    return (result) ? result.at(0).at(-1) : null;
  }

  async function getMediaInfo(mediaId) {
    return new Promise((resolve, reject) => {
      let getURL = `https://i.instagram.com/api/v1/media/${mediaId}/info/`;

      if (mediaId == null) {
        console.error("Cannot call Media API because the media ID is invalid.");
        reject("Cannot call Media API because the media ID is invalid.");
        return;
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: getURL,
        headers: {
          "User-Agent": window.navigator.userAgent,
          "Accept": "application/json",
          'X-IG-App-ID': getAppID()
        },
        onload: function (response) {
          try {
            if (response.finalUrl == getURL) {
              let obj = JSON.parse(response.responseText);
              resolve(obj);
            } else {
              let finalURL = new URL(response.finalUrl);
              if (finalURL.pathname.startsWith('/accounts/login')) {
                console.error("The account must be logged in to access Media API.");
              } else {
                console.error('Unable to retrieve content because the API was redirected to "' + response.finalUrl + '"');
              }
              reject(-1);
            }
          } catch (error) {
            console.error("Error parsing JSON response:", error);
            reject(error);
          }
        },
        onerror: function (err) {
          reject(err);
        }
      });
    });
  }

  // 使元素可拖动的函数
  function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (element) {
      element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // 获取鼠标的初始位置
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // 计算鼠标移动的距离
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // 设置元素的新位置
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // 停止拖动时清除事件监听
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
})();