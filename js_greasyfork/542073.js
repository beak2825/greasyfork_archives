
// ==UserScript==
// @name           Cloudflare 缓存清除工具
// @namespace      https://github.com/JsBeta/cloudflare-cache-purge/
// @version        1.8.4
// @author         xuwei
// @description    一个好用的 Cloudflare 缓存清理工具，支持清除当前页面链接缓存、图片/CSS/JS 资源缓存，以及自定义多个 URL 的缓存清除。
// @icon           data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjZTc4OTMwIiBkPSJNODAwLjIxMzMzMyA0MzQuMzQ2NjY3YTI5OC42NjY2NjcgMjk4LjY2NjY2NyAwIDAgMC01NjEuOTItNDEuNkEyMTMuMzMzMzMzIDIxMy4zMzMzMzMgMCAwIDAgMjk4LjY2NjY2NyA4MTAuNjY2NjY3aDQ0OGExOTIgMTkyIDAgMCAwIDUzLjU0NjY2Ni0zNzYuMzJ6TTc0Ni42NjY2NjcgNzI1LjMzMzMzM0gyOTguNjY2NjY3YTEyOCAxMjggMCAwIDEgMC0yNTZoNC4yNjY2NjZBMjEzLjMzMzMzMyAyMTMuMzMzMzMzIDAgMCAxIDcyNS4zMzMzMzMgNTEyYTcuMjUzMzMzIDcuMjUzMzMzIDAgMCAxIDAgMi4xMzMzMzMgMTIwLjk2IDEyMC45NiAwIDAgMSAyMS4zMzMzMzQtMi4xMzMzMzMgMTA2LjY2NjY2NyAxMDYuNjY2NjY3IDAgMCAxIDAgMjEzLjMzMzMzM3ogbS0yMzQuNjY2NjY3LTQyLjY2NjY2NmExNDkuMzMzMzMzIDE0OS4zMzMzMzMgMCAxIDEgMTQ5LjMzMzMzMy0xNDkuMzMzMzM0aC04NS4zMzMzMzNhNjQgNjQgMCAxIDAtNjQgNjR6IiAvPjwvc3ZnPg==
// @include        *
// @license        MIT
// @connect        api.cloudflare.com
// @run-at         document-end
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/542073/Cloudflare%20%E7%BC%93%E5%AD%98%E6%B8%85%E9%99%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542073/Cloudflare%20%E7%BC%93%E5%AD%98%E6%B8%85%E9%99%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".main_icon__RYCes {\n  display: inline-block;\n  vertical-align: middle;\n}\n.main_icon__RYCes path {\n  fill: #e78930;\n}\n.main_menu__MLtUQ {\n  position: fixed;\n  width: 40px;\n  right: 0;\n  top: 300px;\n  z-index: 100;\n  box-sizing: content-box;\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n}\n.main_menu__MLtUQ:hover ul {\n  right: 0px;\n}\n.main_menu__MLtUQ:hover .main_entry__oOnCr {\n  background: #0a4b85;\n  opacity: 1;\n}\n.main_menu__MLtUQ .main_entry__oOnCr {\n  padding: 3px;\n  cursor: pointer;\n  background: #fff;\n  border-radius: 25% 0 0 25%;\n  margin-bottom: 5px;\n  box-shadow: 2px 6px 10px 0px #0e121629;\n  opacity: 0.5;\n  transition: all 0.3s ease-in-out;\n}\n.main_menu__MLtUQ .main_entry__oOnCr .main_icon__RYCes path {\n  fill: #e78930;\n}\n.main_menu__MLtUQ .main_entry__oOnCr .main_icon__RYCes:hover {\n  rotate: 180deg;\n  transition: all 0.5s ease-in-out;\n}\n.main_menu__MLtUQ ul {\n  position: absolute;\n  transition: all 0.3s ease-in-out;\n  right: -40px;\n  margin: 0;\n  padding: 0;\n}\n.main_menu__MLtUQ li {\n  height: 34px;\n  margin-bottom: 2px;\n  list-style: none;\n  cursor: pointer;\n  position: relative;\n}\n.main_menu__MLtUQ li:hover .main_item__njE-F {\n  width: 85px;\n}\n.main_menu__MLtUQ li:hover .main_icon__RYCes path {\n  fill: #fff;\n}\n.main_menu__MLtUQ .main_item__njE-F {\n  box-sizing: content-box;\n  overflow: hidden;\n  white-space: nowrap;\n  width: 24px;\n  height: 24px;\n  line-height: 24px;\n  padding: 5px 5px 6px 5px;\n  position: absolute;\n  top: 0;\n  right: 0;\n  font-size: 12px;\n  color: #fff;\n  background: #0a4b85;\n  border-radius: 2px 0px 0px 2px;\n  transition: width 0.3s ease-in;\n}\n.main_menu__MLtUQ .main_item__njE-F:hover {\n  background: #e78930;\n}\n.main_menu__MLtUQ .main_item__njE-F .main_icon__RYCes {\n  margin-right: 5px;\n  transform: translateY(-1px);\n}\n.main_panel__t3SIt {\n  display: none;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  background: #fff;\n  z-index: 9999;\n}\n.main_panel__t3SIt.main_show__HRMDu {\n  display: block;\n}\n.main_panel__t3SIt .main_close__2MGVA {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n}\n.main_panel__t3SIt .main_head__AwcOE {\n  height: 40px;\n  line-height: 40px;\n  padding: 0 20px;\n  border-bottom: 1px solid #ccc;\n  color: #000;\n  font-size: 16px;\n  font-weight: 600;\n}\n.main_panel__t3SIt .main_foot__-LFyQ {\n  height: 55px;\n  line-height: 40px;\n  padding: 5px 20px;\n  display: flex;\n  justify-content: flex-end;\n  gap: 20px;\n  align-items: center;\n  border-top: 1px solid #ccc;\n}\n.main_panel__t3SIt .main_foot__-LFyQ button {\n  cursor: pointer;\n  height: 35px;\n  line-height: 35px;\n  padding: 0px 30px;\n  background: #e78930;\n  color: #fff;\n  font-size: 14px;\n  border: none;\n  border-radius: 8px;\n}\n.main_panel__t3SIt .main_foot__-LFyQ button[data-id=\"panel-close\"] {\n  background: #ccc;\n  color: #333;\n}\n.main_panel__t3SIt .main_foot__-LFyQ button[data-id=\"panel-close\"]:hover {\n  color: #fff;\n}\n.main_panel__t3SIt .main_foot__-LFyQ button:hover {\n  background: #c46d1c;\n}\n.main_panel__t3SIt .main_wall__0tq2S {\n  position: relative;\n  width: 900px;\n  /* 4列 × (200px + gap) */\n  height: 700px;\n  overflow-y: auto;\n  z-index: 99;\n}\n.main_panel__t3SIt .main_wall__0tq2S .main_item__njE-F {\n  box-sizing: content-box;\n  position: relative;\n  display: inline-block;\n  padding: 10px;\n  vertical-align: top;\n  position: absolute;\n  transition: opacity 0.3s;\n}\n.main_panel__t3SIt .main_wall__0tq2S img {\n  cursor: pointer;\n  box-sizing: content-box;\n  width: 200px;\n  height: auto;\n  display: block;\n  background: #f1f1f1;\n  object-fit: scale-down;\n}\n.main_panel__t3SIt .main_wall__0tq2S input[type=\"checkbox\"] {\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  z-index: 1;\n}\n.main_panel__t3SIt .main_wall__0tq2S input[type=\"checkbox\"] {\n  display: none;\n}\n.main_panel__t3SIt .main_wall__0tq2S input[type=\"checkbox\"]:checked + img {\n  box-shadow: 0 0 0 2px rgba(245, 148, 3, 0.76);\n}\n.main_panel__t3SIt .main_list__f6SQm {\n  padding: 20px;\n  position: relative;\n  width: 900px;\n  max-height: 600px;\n  overflow-y: auto;\n  z-index: 99;\n}\n.main_panel__t3SIt .main_list__f6SQm .main_item__njE-F {\n  cursor: pointer;\n  display: block;\n  padding: 0 5px;\n  margin-bottom: 8px;\n}\n.main_panel__t3SIt .main_list__f6SQm .main_item__njE-F span {\n  display: inline-block;\n  padding: 5px;\n  margin-left: 5px;\n  border-radius: 5px;\n}\n.main_panel__t3SIt .main_list__f6SQm input[type=\"checkbox\"]:checked + span {\n  box-shadow: 0 0 0 2px rgba(245, 148, 3, 0.76);\n}\n.main_panel__t3SIt .main_inputarea__mzOdr {\n  box-sizing: content-box;\n  padding: 20px;\n  position: relative;\n  width: 600px;\n  max-height: 600px;\n  overflow-y: auto;\n  z-index: 99;\n}\n.main_panel__t3SIt .main_inputarea__mzOdr textarea {\n  padding: 10px;\n  margin-top: 10px;\n  border: 1px solid #e78930;\n  line-height: 2;\n  border-radius: 5px;\n  max-width: 575px;\n  min-width: 575px;\n}\n.main_panel__t3SIt .main_inputarea__mzOdr textarea:focus {\n  outline: none;\n  border: 1px solid #fff;\n  box-shadow: 0 0 0 2px rgba(245, 148, 3, 0.76);\n}\n";
  var style = {"icon":"main_icon__RYCes","menu":"main_menu__MLtUQ","entry":"main_entry__oOnCr","item":"main_item__njE-F","panel":"main_panel__t3SIt","show":"main_show__HRMDu","close":"main_close__2MGVA","head":"main_head__AwcOE","foot":"main_foot__-LFyQ","wall":"main_wall__0tq2S","list":"main_list__f6SQm","inputarea":"main_inputarea__mzOdr"};
  styleInject(css_248z);

  // 配置信息
  let config = {
      apiToken: GM_getValue("cfApiToken", ""),
  };

  // 添加配置菜单
  GM_registerMenuCommand("配置 API Token", function() {
      const apiToken = prompt(
          "请输入您的 Cloudflare API Token:",
          config.apiToken
      );
      if (apiToken !== null) {
          GM_setValue("cfApiToken", apiToken);
          config.apiToken = apiToken;
      }
  });

  // 添加清除缓存菜单和页面按钮
  GM_registerMenuCommand("清除当前地址缓存", function() {
      clearCache([window.location.href]);
  });
  // 修改验证配置
  function validateConfig() {
      if (!config.apiToken) {
          alert("请先配置Cloudflare API Token.");
          return false;
      }
      return true;
  }

  // 查找zoneid
  async function getZoneId(domain) {
      return new Promise((resolve) => {
          console.debug("正在获取域名:", domain);
          GM_xmlhttpRequest({
              method: "GET",
              url: `https://api.cloudflare.com/client/v4/zones?name=${domain}`,
              headers: {
                  Authorization: `Bearer ${config.apiToken}`,
                  "Content-Type": "application/json",
              },
              onload: function(response) {
                  console.debug("API响应状态:", response.status);
                  const data = JSON.parse(response.responseText);
                  console.debug("完整API响应:", data);
                  if (data.result) {
                      resolve(data.result[0]?.id);
                  } else {
                      resolve(null);
                  }
              },
              onerror: function(error) {
                  console.error("获取Zone ID失败:", error);
                  resolve(null);
              },
          });
      });
  }

  // 清除缓存函数
  async function clearCache(urls) {
      console.debug("开始清除缓存流程");
      if (!urls.length) {
          alert("请选择或者输入需要清除的缓存项！");
          return;
      }
      if (!validateConfig()) return;
      let domain = new URL(window.location.href).hostname;
      // 去除domain的www前缀
      domain = domain.replace(/^www\./, "");
      console.debug("解析出的域名:", domain);
      const zoneId = await getZoneId(domain);
      if (!zoneId) {
          alert("未找到该域名对应的Cloudflare zone,请检查域名是否正确！");
          return;
      }
      // 使用动态zoneId发送请求...
      await purgeCache(zoneId, urls);
  }

  // 清除缓存封装
  function purgeCache(zongeId, urls) {
      const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zongeId}/purge_cache`;
      console.debug(
          "%c [ 需要清除的urls ]: ",
          "color: #bf2c9f; background: pink; font-size: 13px;",
          urls
      );
      GM_xmlhttpRequest({
          method: "POST",
          url: apiUrl,
          headers: {
              Authorization: `Bearer ${config.apiToken}`,
              "Content-Type": "application/json",
          },
          data: JSON.stringify({
              files: [...urls],
          }),
          onload: function(response) {
              const result = JSON.parse(response.responseText);
              if (result.success) {
                  alert("缓存清理成功!");
                  // 刷新当前页面
                  window.location.reload();
              } else {
                  alert(
                      "API请求清理缓存失败(onload):" +
                      (result.errors ?.[0]?.message || "Unknown error")
                  );
              }
          },
          onerror: function(error) {
              alert("API请求清理缓存失败(onerror): " + error.responseText);
          },
      });
  }

  // 获取当前链接请求响应头
  const getCfResponseHeaders = async (url) => {
      return new Promise((resolve) => {
          GM_xmlhttpRequest({
              method: "HEAD",
              url,
              onload: function(response) {
                  // 返回响应头中的cf-cache-status字段
                  const cfCacheStatusMatch = response.responseHeaders.match(/cf-cache-status:\s*(.+)/i);
                  const cfCacheStatusValue = cfCacheStatusMatch ? cfCacheStatusMatch[1] : null;
                  resolve(cfCacheStatusValue);
              },
              onerror: function(error) {
                  console.error("获取响应头失败:", error);
                  resolve(null);
              },
          });
      });
  };

  // 获取资源链接
  const getResources = () => {
      const blacklistedPatterns = [
          /analytics\.example\.com/,
          /www\.clarity/,
          /www\.google/,
          /app\.termly/,
      ];
      const jsLinks = Array.from(document.scripts)
          .map((s) => s.src)
          .filter(Boolean)
          .filter(
              (url) => !blacklistedPatterns.some((pattern) => pattern.test(url))
          );
      const cssLinks = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
      ).map((link) => link.href);
      const imgLinks = Array.from(document.images)
          .map((img) => img.src)
          .filter(Boolean);
      const cssBgImages = new Set();
      Array.from(document.querySelectorAll("*")).forEach((el) => {
          const bg = getComputedStyle(el).backgroundImage;
          const m = bg.match(/url\(["']?(.*?)["']?\)/);
          if (m && m[1]) cssBgImages.add(m[1]);
      });

      const allImages = Array.from(new Set([...imgLinks, ...cssBgImages]));
      return {
          js: jsLinks,
          css: cssLinks,
          img: allImages,
      };
  };

  // 图片瀑布流布局
  const layoutMasonry = (containerSelector, columnCount = 4, spacing = 10) => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const items = Array.from(container.querySelectorAll("label"));
      if (items.length === 0) return;

      const itemWidth = 200 + spacing * 2; // 每个图片项的宽度（含左右 margin）
      let columnHeights = Array(columnCount).fill(0); // 存储每一列的高度

      items.forEach((item) => {
          // 找到当前最短的一列
          const minHeight = Math.min(...columnHeights);
          const colIndex = columnHeights.indexOf(minHeight);

          // 设置绝对定位位置
          item.style.left = `${colIndex * itemWidth}px`;
          item.style.top = `${minHeight}px`;

          // 更新该列的高度
          const itemHeight = item.offsetHeight;
          columnHeights[colIndex] += itemHeight;
      });
  };

  // 创建资源列表面板;
  const createResourcePanel = (picArray, type) => {
      const container = document.createElement("div");
      container.classList.add(style.panel);
      container.innerHTML = `
        <div class="${style.head}">
            <span class="title">资源列表</span>
            <svg data-id="panel-close" class="${
                style.close
            }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <polygon
                    data-id="panel-close"
                    points="35.31 9.86 24 21.17 12.69 9.86 9.86 12.69 21.17 24 9.86 35.31 12.69 38.14 24 26.83 35.31 38.14 38.14 35.31 26.83 24 38.14 12.69 35.31 9.86" />
            </svg>
        </div>
        <div id="${type === "img" ? "x-panel-wall" : ""}" 
        class="${type === "img" ? style.wall : style.list}">
            ${picArray
                .map(
                    (url) =>
                        `
                        <label class="${style.item}">
                            <input type="checkbox" value="${url}"/>
                            ${
                                type === "img"
                                    ? `<img src="${url}" />`
                                    : `<span>${url}</span>`
                            }
                        </label>
                    `
                )
                .join("\n")}
        </div>
        <div class="${style.foot}">
            <button  data-id="panel-close">取消</button>
            <button data-id="panel-submit" data-type="${type}">清除</button>
        </div>
    
`;
      return container;
  };

  // 创建输入框面板;
  const createInputPanel = (type) => {
      const container = document.createElement("div");
      container.classList.add(style.panel);
      container.innerHTML = `
        <div class="${style.head}">
            <span class="title">清除多个url链接</span>
            <svg data-id="panel-close" class="${style.close}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <polygon
                    data-id="panel-close"
                    points="35.31 9.86 24 21.17 12.69 9.86 9.86 12.69 21.17 24 9.86 35.31 12.69 38.14 24 26.83 35.31 38.14 38.14 35.31 26.83 24 38.14 12.69 35.31 9.86" />
            </svg>
        </div>
        <div 
        class="${style.inputarea}">
            <textarea cols="80" rows="6" name="inputarea" placeholder="输入url链接,多个链接需要另取一行"></textarea>
        </div>
        <div class="${style.foot}">
            <button  data-id="panel-close">取消</button>
            <button data-id="panel-submit" data-type="${type}">清除</button>
        </div>
    
`;
      return container;
  };

  // 创建侧边菜单
  const createMenu = () => {
      const menuEle = document.createElement("div");
      menuEle.classList.add(style.menu);
      const entryEle = document.createElement("div"); // 入口按钮
      entryEle.classList.add(style.entry);
      entryEle.innerHTML = `
            <svg class="${style.icon}" width="36" height="36" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <path fill="#8D929C"
                    d="M896 512A384 384 0 0 0 533.333333 129.066667h-21.333333A384 384 0 0 0 129.066667 490.666667v21.333333A384 384 0 0 0 490.666667 896h21.333333a384 384 0 0 0 384-362.666667v-21.333333z m-85.333333 0v13.013333a128 128 0 0 1-249.813334 23.893334A213.333333 213.333333 0 0 0 721.066667 298.666667 298.666667 298.666667 0 0 1 810.666667 512zM512 213.333333h13.013333a128 128 0 0 1 23.893334 249.813334A213.333333 213.333333 0 0 0 298.666667 302.933333 298.666667 298.666667 0 0 1 512 213.333333zM213.333333 512v-13.013333a128 128 0 0 1 249.813334-23.893334A213.333333 213.333333 0 0 0 302.933333 725.333333 298.666667 298.666667 0 0 1 213.333333 512z m298.666667 298.666667h-13.013333a128 128 0 0 1-23.893334-249.813334A213.333333 213.333333 0 0 0 725.333333 721.066667 298.666667 298.666667 0 0 1 512 810.666667z" />
            </svg>`;
      const menuUlEle = document.createElement("ul"); // 入口菜单列表
      menuUlEle.innerHTML = `
            <li>
                <div class="${style.item}" data-id="imgs">
                    <svg class="${style.icon}" width="24" height="24" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill="#8D929C"
                            d="M853.333333 682.666667v-42.666667a42.666667 42.666667 0 0 0-85.333333 0v170.666667a42.666667 42.666667 0 0 0 85.333333 0h-42.666666v-85.333334h128v85.333334a128 128 0 0 1-256 0v-170.666667a128 128 0 0 1 256 0v42.666667z m-512-85.333334v-85.333333H85.333333v85.333333h85.333334v256H85.333333v85.333334h256v-85.333334h-85.333333V597.333333z m298.666667-85.333333v426.666667h-85.333333V654.293333l-42.666667 56.746667-42.666667-56.746667V938.666667h-85.333333V512h85.333333l42.666667 56.96L554.666667 512z m85.333333-426.666667l213.333334 213.333334v170.666666h-85.333334v-135.253333L689.92 170.666667H170.666667v298.666666H85.333333V85.333333z" />
                    </svg>
                    图片文件
                </div>
            </li>
            <li>
                <div class="${style.item}" data-id="css">
                    <svg class="${style.icon}" width="24" height="24" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill="#8D929C"
                            d="M725.333333 85.333333l213.333334 213.333334v170.666666h-85.333334v-135.253333L689.92 170.666667H170.666667v298.666666H85.333333V85.333333zM256 768v42.666667a42.666667 42.666667 0 0 1-85.333333 0v-170.666667a42.666667 42.666667 0 0 1 85.333333 0v42.666667h85.333333v-42.666667a128 128 0 0 0-256 0v170.666667a128 128 0 0 0 256 0v-42.666667z m256-85.333333a42.666667 42.666667 0 1 1 42.666667-42.666667h85.333333a128 128 0 1 0-128 128 42.666667 42.666667 0 1 1-42.666667 42.666667h-85.333333a128 128 0 1 0 128-128z m298.666667 0a42.666667 42.666667 0 1 1 42.666666-42.666667h85.333334a128 128 0 1 0-128 128 42.666667 42.666667 0 1 1-42.666667 42.666667h-85.333333a128 128 0 1 0 128-128z" />
                    </svg>
                    CSS文件
                </div>
            </li>
            <li>
                <div class="${style.item}" data-id="js">
                    <svg class="${style.icon}" width="24" height="24" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill="#8D929C"
                            d="M938.666667 298.666667v640H682.666667v-85.333334h170.666666V334.08L689.92 170.666667H170.666667v298.666666H85.333333V85.333333h640zM512 682.666667a42.666667 42.666667 0 1 1 42.666667-42.666667h85.333333a128 128 0 1 0-128 128 42.666667 42.666667 0 1 1-42.666667 42.666667h-85.333333a128 128 0 1 0 128-128z m-256-170.666667v298.666667a42.666667 42.666667 0 0 1-85.333333 0v-42.666667H85.333333v42.666667a128 128 0 0 0 256 0V512z" />
                    </svg>
                    JS文件
                </div>
            </li>
            <li>
                <div class="${style.item}" data-id="link">
                    <svg class="${style.icon}" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#8D929C"
                            d="M18,44V30a6,6,0,0,1,12,0V44H26V30a2,2,0,0,0-4,0V44ZM16,28V24H4v4H8V40H4v4H16V40H12V28ZM34,4H4V22H8V8H32.34L40,15.66V22h4V14ZM32,24V44h4V24Zm12,0H40L36,34l4,10h4L40,34Z" />
                    </svg>
                    当前链接
                </div>
            </li>
            <li>
                <div class="${style.item}" data-id="urls">
                    <svg class="${style.icon}" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#8D929C"
                            d="M44,40v4H32V24h4V40ZM40,15.66V22h4V14L34,4H4V22H8V8H32.34ZM28.08,34.39,30,44H26l-1.6-8L24,36H22v8H18V24h6a6,6,0,0,1,4.08,10.39ZM24,32a2,2,0,0,0,0-4H22v4ZM12,24V38a2,2,0,0,1-4,0V24H4V38a6,6,0,0,0,12,0V24Z" />
                    </svg>
                    多个链接
                </div>
            </li>

    `;

      menuEle.appendChild(entryEle);
      menuEle.appendChild(menuUlEle);
      return menuEle;
  };

  if (window.self === window.top) {
      window.addEventListener("load", function() {
          let xtoolsEle = null;
          getCfResponseHeaders(window.location.href).then((res) => {
              if (res) {
                  console.info(
                      `%c INFO %c 检测到当前网站经过 CloudFlare CDN 加速, 缓存清理小工具已经正常加载! %c`,
                      `background:#909399;border:1px solid #909399; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
                      `border:1px solid #909399; padding: 1px; border-radius: 0 2px 2px 0; color: #909399;`,
                      'background:transparent'
                  );
                  xtoolsEle = document.createElement("div");
                  const menuEle = createMenu();
                  const resources = getResources();
                  const picPanelEle = createResourcePanel(resources.img, "img");
                  const cssPanelEle = createResourcePanel(resources.css, "css");
                  const jsPanelEle = createResourcePanel(resources.js, "js");
                  const inputPanelEle = createInputPanel("urls");

                  // 遍历childNodes，移除show样式
                  const closePanel = (nodes) => {
                      nodes.forEach((node) => {
                          node.classList.remove(style.show);
                      });
                  };

                  // 对菜单项的点击事件进行监听
                  xtoolsEle.addEventListener("click", function(e) {
                      e.stopPropagation();
                      switch (e.target.dataset.id) {
                          case "imgs":
                              // 选择图片
                              closePanel(this.childNodes);
                              picPanelEle.classList.add(style.show);
                              layoutMasonry("#x-panel-wall", 4);
                              break;
                          case "css":
                              // 选择css
                              closePanel(this.childNodes);
                              cssPanelEle.classList.add(style.show);
                              break;
                          case "js":
                              // 选择js
                              closePanel(this.childNodes);
                              jsPanelEle.classList.add(style.show);
                              break;
                          case "link":
                              // 清除当前link
                              clearCache([window.location.href]);
                              break;
                          case "urls":
                              closePanel(this.childNodes);
                              // 输入urls
                              inputPanelEle.classList.add(style.show);
                              break;

                          case "panel-submit": {
                              // 获取inputPanelEle中textarea的value 以回车分割成数组 // 如果textarea 为空 则返回空数组
                              const inputUrls = inputPanelEle
                                  .querySelector("textarea")
                                  .value.split("\n")
                                  .filter(Boolean);

                              const selected = [
                                  ...xtoolsEle.querySelectorAll(
                                      "input[type='checkbox']:checked"
                                  ),
                              ].map((c) => c.value);

                              clearCache([...inputUrls, ...selected]);
                          }
                          break;
                      case "panel-close":
                          // 遍历childNodes，移除show样式
                          closePanel(this.childNodes);
                          // 遍历所有的checkbox,取消选中
                          this.querySelectorAll("input[type=checkbox]").forEach(
                              (checkbox) => {
                                  checkbox.checked = false;
                              }
                          );
                          // 清空textarea的值
                          this.querySelector("textarea").value = "";
                          break;
                      }
                  });

                  xtoolsEle.appendChild(menuEle);
                  xtoolsEle.appendChild(picPanelEle);
                  xtoolsEle.appendChild(cssPanelEle);
                  xtoolsEle.appendChild(jsPanelEle);
                  xtoolsEle.appendChild(inputPanelEle);
                  document.body.appendChild(xtoolsEle);
              }
          });
      });
  }

})();
