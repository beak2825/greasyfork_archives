// ==UserScript==
// @name         联通内网 - 智慧法治平台
// @namespace    http://unicom.studio/
// @version      2025-05-15
// @description  创新与灵感的交汇处
// @author       easterNday
// @match        https://lawplatform.chinaunicom.cn/*
// @icon         https://unicom.studio/Unicom.svg
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      data:application/javascript,window.LAYUI_GLOBAL=%7Bdir:'https://unpkg.com/layui@2.10.3/dist/'%7D
// @require      https://unpkg.com/layui@2.10.3/dist/layui.js
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532019/%E8%81%94%E9%80%9A%E5%86%85%E7%BD%91%20-%20%E6%99%BA%E6%85%A7%E6%B3%95%E6%B2%BB%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532019/%E8%81%94%E9%80%9A%E5%86%85%E7%BD%91%20-%20%E6%99%BA%E6%85%A7%E6%B3%95%E6%B2%BB%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const PASSWORD = "lawtalkwebfront_";
  const CONCURRENCY_LIMIT = 5;

  // 状态管理对象
  const state = {
    authorization: localStorage.getItem("law_auth") || "", // 持久化存储[5](@ref)
    isRunning: false,
    currentPage: 1,
    ready: false,
    readLimit: parseInt(localStorage.getItem("law_read_limit")) || 500, // 阅读数量限制，0表示无限制
    processedCount: 0, // 已处理的文章数量
    minDelay: parseInt(localStorage.getItem("law_min_delay")) || 1000, // 最小延迟时间（毫秒）
    maxDelay: parseInt(localStorage.getItem("law_max_delay")) || 3000, // 最大延迟时间（毫秒）
    limitReached: false, // 是否已达到阅读限制
  };

  // 用户信息
  const userInfo = {
    name: "",
    pageSize: localStorage.getItem("law_page_size") || 50,
  };

  const articleStore = {
    list: new Map(),
    total: 0,
    get count() {
      return this.list.size;
    },
  };

  // 请求拦截
  (function setupRequestInterceptor() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSetHeader = XMLHttpRequest.prototype.setRequestHeader;

    // 请求头拦截
    XMLHttpRequest.prototype.requestHeaders = {};
    XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
      this.requestHeaders[name] = value;
      originalSetHeader.apply(this, arguments);
    };

    // 核心拦截逻辑
    XMLHttpRequest.prototype.open = function (method, url) {
      this.addEventListener("load", function () {
        // 仅捕获Authorization字段
        if (this.requestHeaders) {
          const authHeader =
            this.requestHeaders["Authorization"] ||
            this.requestHeaders["authorization"];
          if (authHeader && authHeader !== state.authorization) {
            state.authorization = authHeader;
            localStorage.setItem("law_auth", authHeader);
          }
        }

        if (url.includes("readPurview") && !userInfo.name) {
          const mm = new URL(url).searchParams.get("mm");
          userInfo.name = cryptoUtils.decryptECB(atob(mm));
        }
      });

      originalOpen.apply(this, arguments);
    };
  })();

  // 加密模块
  const cryptoUtils = {
    encryptECB: (text) => {
      const key = CryptoJS.enc.Utf8.parse(PASSWORD.padEnd(16, "\0"));
      return CryptoJS.AES.encrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
    },
    decryptECB: (cipherText) => {
      const key = CryptoJS.enc.Utf8.parse(PASSWORD.padEnd(16, "\0"));
      return CryptoJS.AES.decrypt(cipherText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
    },
  };

  // 请求队列系统
  const requestQueue = {
    queue: [],
    active: 0,
    async add(task) {
      this.queue.push(task);
      return this.process();
    },
    async process() {
      return new Promise((resolve) => {
        const runner = async () => {
          while (this.active < CONCURRENCY_LIMIT && this.queue.length) {
            const task = this.queue.shift();
            this.active++;
            try {
              await task();
            } catch (error) {
              console.error("Task failed:", error);
            } finally {
              this.active--;
              runner();
            }
          }
          if (this.queue.length === 0 && this.active === 0) {
            resolve();
          }
        };
        runner();
      });
    },
  };

  // 数据获取逻辑
  const dataService = {
    async getTotal() {
      const params = this.buildParams(1);
      const { total } = await this.fetchData(params);
      articleStore.total = total;
      return total;
    },

    async fetchPage(pageNum) {
      const params = this.buildParams(pageNum);
      const { rows } = await this.fetchData(params);
      rows.forEach((article) => {
        articleStore.list.set(article.articleId, article);
      });
      return rows;
    },

    buildParams(pageNum) {
      return {
        pageNum,
        pageSize: userInfo.pageSize,
        sortType: 0,
        columnOne: null,
        columnTwo: null,
        readPurviewValueList: [
          "52afcdceba40421e85ae255d84611ce1",
          "c9f4122a68904299b737555e2c13858d",
          "fb9a92b14df74671840dc9c5bce47b22",
          "42",
          "4211",
          "421121998",
        ],
        readPurviewRoleTypeList: [],
        m_m: userInfo.name,
      };
    },

    async fetchData(params) {
      const mm = cryptoUtils.encryptECB(JSON.stringify(params));
      const response = await fetch(
        `https://lawplatform.chinaunicom.cn/api/legal/more/article/list?pageSize=${userInfo.pageSize}&pageNum=${params.pageNum}`,
        {
          method: "POST",
          headers: {
            authorization: state.authorization,
            "content-type": "application/json",
          },
          body: JSON.stringify({ mm }),
        }
      );
      return response.json();
    },
  };

  // 生成随机延迟时间
  function getRandomDelay() {
    return (
      Math.floor(Math.random() * (state.maxDelay - state.minDelay + 1)) +
      state.minDelay
    );
  }

  // 延迟执行
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 文章处理
  async function processArticles() {
    try {
      // 重置状态
      state.processedCount = 0;
      state.limitReached = false;

      const totalPages = Math.ceil(articleStore.total / userInfo.pageSize);

      // 创建一个新的请求队列用于文章处理
      const articleProcessQueue = {
        queue: [],
        active: 0,
        async add(task) {
          this.queue.push(task);
          return this.process();
        },
        async process() {
          return new Promise((resolve) => {
            const runner = async () => {
              while (this.active < CONCURRENCY_LIMIT && this.queue.length) {
                const task = this.queue.shift();
                this.active++;
                try {
                  await task();
                } catch (error) {
                  console.error("Task failed:", error);
                } finally {
                  this.active--;
                  runner();
                }
              }
              if (this.queue.length === 0 && this.active === 0) {
                resolve();
              }
            };
            runner();
          });
        },
      };

      // 处理单个文章的函数
      const processArticle = async (article) => {
        // 检查是否已达到阅读限制
        if (
          state.readLimit > 0 &&
          (state.processedCount >= state.readLimit || state.limitReached)
        ) {
          return;
        }

        // 增加计数并检查是否刚好达到限制
        state.processedCount++;
        if (
          state.readLimit > 0 &&
          state.processedCount >= state.readLimit &&
          !state.limitReached
        ) {
          state.limitReached = true;

          // 清空文章处理队列，停止后续处理
          articleProcessQueue.queue = [];
        }

        const delayTime = getRandomDelay();
        await delay(delayTime);

        // 先处理阅读
        await processRead(article);

        await delay(delayTime);

        // 再处理点赞，并获取结果
        const likeResult = await processLike(article);

        // 如果是已点赞的文章，减少计数（因为之前已经增加了）
        if (likeResult && likeResult.isAlreadyLiked) {
          // 已点赞的文章不计入处理数量
          state.processedCount--;

          // 如果减少后低于限制，取消限制标志
          if (
            state.limitReached &&
            state.readLimit > 0 &&
            state.processedCount < state.readLimit
          ) {
            state.limitReached = false;
          }
        }
      };

      // 处理一页文章的函数
      const processPage = async (pageNum) => {
        const articles = await dataService.fetchPage(pageNum);
        // 立即开始处理这一页的文章
        for (const article of articles) {
          if (state.readLimit > 0 && state.processedCount >= state.readLimit) {
            if (!state.limitReached) {
              state.limitReached = true;
            }
            return;
          }
          // 不等待添加完成，让文章处理真正并行
          articleProcessQueue.add(() => processArticle(article));
        }
      };

      // 创建页面处理任务并逐个添加，以便在达到限制时停止
      for (let i = 0; i < totalPages; i++) {
        // 如果已达到阅读限制，停止添加更多页面任务
        if (state.readLimit > 0 && state.limitReached) {
          break;
        }

        // 添加单个页面处理任务
        requestQueue.queue.push(() => processPage(i + 1));

        // 每添加一批任务后处理一次队列
        if (
          requestQueue.queue.length >= CONCURRENCY_LIMIT ||
          i === totalPages - 1
        ) {
          await requestQueue.process();

          // 如果在处理过程中达到了限制，停止添加更多页面
          if (state.readLimit > 0 && state.limitReached) {
            break;
          }
        }
      }

      // 等待所有文章处理完成
      await articleProcessQueue.process();

      layer.msg(`操作已完成，共处理 ${state.processedCount} 篇文章`, {
        icon: 1,
        time: 7777,
      });
    } catch (error) {
      layer.msg("处理失败: " + error.message, { icon: 2 });
    }
  }

  // 阅读处理
  async function processRead(article) {
    // if (article.isBrowse) return;

    const timestamp = cryptoUtils.encryptECB(Date.now().toString());
    const mm = cryptoUtils.encryptECB(
      JSON.stringify({
        businessId: article.articleId,
        m_m: userInfo.name,
      })
    );

    await Promise.all([
      fetch(
        `https://lawplatform.chinaunicom.cn/api/legal-console/integral/checkIntegralForBrowser`,
        {
          method: "POST",
          headers: {
            authorization: state.authorization,
            "content-type": "application/json",
          },
          body: JSON.stringify({ mm }),
        }
      ),
      // fetch(`https://lawplatform.chinaunicom.cn/api/legal/article/details/readPurview?timeStamp=${btoa(timestamp)}&mm=${btoa(mm)}`, {
      //     headers: { authorization: state.authorization }
      // }),
      fetch(
        `https://lawplatform.chinaunicom.cn/api/legal/article/details/add-browse-num/${article.articleId}`,
        {
          headers: { authorization: state.authorization },
        }
      ),
    ]);

    // 显示阅读完成提示
    layer.msg(
      `已阅读文章: ${article.title.substring(0, 15)}${
        article.title.length > 15 ? "..." : ""
      }`,
      {
        time: 1500,
        offset: "rt",
      }
    );
  }

  // 点赞处理
  async function processLike(article) {
    // if (article.isLike) return;

    const mm = cryptoUtils.encryptECB(
      JSON.stringify({
        articleId: article.articleId,
        whetherLike: 1,
        m_m: userInfo.name,
      })
    );

    const response = await fetch(
      "https://lawplatform.chinaunicom.cn/api/legal/like-detail",
      {
        method: "POST",
        headers: {
          authorization: state.authorization,
          "content-type": "application/json",
        },
        body: JSON.stringify({ mm }),
      }
    );

    const data = await response.json();
    const isAlreadyLiked = data.msg === "已点赞";

    // 显示点赞完成提示，但如果是已点赞则显示不同消息
    if (!isAlreadyLiked) {
      layer.msg(
        `已点赞文章: ${article.title.substring(0, 15)}${
          article.title.length > 15 ? "..." : ""
        }`,
        {
          time: 1500,
          offset: "rt",
        }
      );
    }

    return { isAlreadyLiked }; // 返回是否是已点赞的状态
  }

  // 初始化入口
  async function init() {
    // setupRequestInterceptor();
    await waitForUserInfo().then(() => {
      layer.msg("基础信息获取完成", { time: 7777, icon: 1 });
    });

    await dataService.getTotal();
    await createUI();
  }

  async function waitForUserInfo() {
    return new Promise((resolve) => {
      const check = () => {
        if (userInfo.name && state.authorization) {
          state.ready = true;
          resolve();
        } else {
          setTimeout(check, 500);
        }
      };
      check();
    });
  }

  // 创建UI
  async function createUI() {
    // TODO: 完善UI
    let buttonSets = document.createElement("div");
    document.body.appendChild(buttonSets);
    buttonSets.id = "buttonSets";
    buttonSets.style.padding = "8px";
    buttonSets.style.display = "flex";
    buttonSets.style.flexDirection = "row";
    buttonSets.style.justifyContent = "center";
    buttonSets.style.alignItems = "center";
    buttonSets.style.position = "fixed";
    buttonSets.style.bottom = "20px";
    buttonSets.style.right = "20px";
    buttonSets.style.zIndex = "1000";
    buttonSets.innerHTML = `
        <link href="//unpkg.com/layui@2.10.3/dist/css/layui.css" rel="stylesheet">
        <button id="controlPanelButton" type="button" class="layui-btn layui-btn-lg layui-btn-primary layui-btn-radius layui-bg-red">控制面板</button>
        `;

    let controlPanelButton = document.getElementById("controlPanelButton");
    controlPanelButton.onclick = () => {
      layer.open({
        type: 1,
        id: "settingsPanel",
        title: "智慧法治平台配置",
        area: ["320px", "100%"],
        offset: "l",
        anim: "slideRight", // 从左往右
        shade: 0.1,
        // skin: 'layui-layer-win10',
        icon: 6,
        resize: false,
        move: false,
        content: `
                <div class="layui-input-group">
                    <div class="layui-input-prefix">用户昵称</div>
                    <input type="text" name="username" value="" lay-verify="required" placeholder="${userInfo.name}" class="layui-input" disabled>
                </div>
                <div class="layui-input-group">
                    <div class="layui-input-prefix">文章总数</div>
                    <input type="text" name="username" value="" lay-verify="required" placeholder="${articleStore.total}" class="layui-input" disabled>
                </div>
                <div class="layui-input-group">
                    <div class="layui-input-prefix">单次请求数目</div>
                    <input id="pageSize" type="number" lay-affix="number" value="${userInfo.pageSize}" step="10" min="10" max="50" class="layui-input">
                    <!-- <div class="layui-input-suffix">单次请求数目</div> -->
                </div>
                <div class="layui-input-group">
                    <div class="layui-input-prefix">阅读文章限制</div>
                    <input id="readLimit" type="number" lay-affix="number" value="${state.readLimit}" step="10" min="0" class="layui-input">
                    <div class="layui-input-suffix">0表示无限制</div>
                </div>
                <div class="layui-input-group">
                    <div class="layui-input-prefix">最小延迟(毫秒)</div>
                    <input id="minDelay" type="number" lay-affix="number" value="${state.minDelay}" step="500" min="0" class="layui-input">
                </div>
                <div class="layui-input-group">
                    <div class="layui-input-prefix">最大延迟(毫秒)</div>
                    <input id="maxDelay" type="number" lay-affix="number" value="${state.maxDelay}" step="500" min="0" class="layui-input">
                </div>
                `,
        btn: ["保存设置", "开始运行"],
        btn1: function (index, layero, that) {
          localStorage.setItem(
            "law_page_size",
            document.getElementById("pageSize").value
          );
          userInfo.pageSize = document.getElementById("pageSize").value;

          // 保存阅读限制
          const readLimit = document.getElementById("readLimit").value;
          state.readLimit = parseInt(readLimit) || 0;
          localStorage.setItem("law_read_limit", state.readLimit);

          // 保存延迟设置
          const minDelay = document.getElementById("minDelay").value;
          const maxDelay = document.getElementById("maxDelay").value;
          state.minDelay = parseInt(minDelay) || 1000;
          state.maxDelay = parseInt(maxDelay) || 3000;

          // 确保最小延迟不大于最大延迟
          if (state.minDelay > state.maxDelay) {
            state.minDelay = state.maxDelay;
          }

          localStorage.setItem("law_min_delay", state.minDelay);
          localStorage.setItem("law_max_delay", state.maxDelay);

          layer.msg("设置已保存", { icon: 1 });
          return false;
        },
        btn2: function (index, layero, that) {
          processArticles();
          return true;
        },
      });
    };
  }

  window.addEventListener("load", init);
})();
