// ==UserScript==
// @name         Vecorder
// @namespace    https://www.joi-club.cn/
// @version      1.0.0
// @description  直播间内容记录 https://github.com/Xinrea/Vecorder
// @author       Xinrea
// @license      MIT
// @match        https://live.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/418799/Vecorder.user.js
// @updateURL https://update.greasyfork.org/scripts/418799/Vecorder.meta.js
// ==/UserScript==

// IndexedDB 存储管理
class VecorderStorage {
  constructor() {
    this.dbName = "VecorderDB";
    this.dbVersion = 1;
    this.storeName = "vecorder_data";
    this.db = null;
    this.isInitialized = false;
  }

  // 初始化数据库
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("Vecorder: IndexedDB 打开失败:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log("Vecorder: IndexedDB 初始化成功");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 创建对象存储
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "key",
          });
          console.log("Vecorder: 创建 IndexedDB 存储");
        }
      };
    });
  }

  // 获取数据
  async get(key, defaultValue = null) {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => {
        console.error("Vecorder: 获取数据失败:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve(result.value);
        } else {
          resolve(defaultValue);
        }
      };
    });
  }

  // 设置数据
  async set(key, value) {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, value });

      request.onerror = () => {
        console.error("Vecorder: 设置数据失败:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        console.log("Vecorder: 数据保存成功:", key);
        resolve();
      };
    });
  }

  // 删除数据
  async delete(key) {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => {
        console.error("Vecorder: 删除数据失败:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        console.log("Vecorder: 数据删除成功:", key);
        resolve();
      };
    });
  }

  // 获取存储空间信息
  async getStorageInfo() {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      try {
        // 获取已用空间
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onerror = () => {
          console.error("Vecorder: 获取存储信息失败:", request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          const data = request.result;
          let usedSize = 0;

          // 计算已用空间
          data.forEach((item) => {
            usedSize += JSON.stringify(item).length;
          });

          // 获取浏览器存储配额信息
          if ("storage" in navigator && "estimate" in navigator.storage) {
            navigator.storage
              .estimate()
              .then((estimate) => {
                const totalSpace = estimate.quota || 0;
                const availableSpace = estimate.usage || 0;
                const remainingSpace = totalSpace - availableSpace;

                resolve({
                  usedSize: usedSize,
                  totalSpace: totalSpace,
                  availableSpace: availableSpace,
                  remainingSpace: remainingSpace,
                  dataCount: data.length,
                });
              })
              .catch((error) => {
                console.error("Vecorder: 获取存储配额失败:", error);
                resolve({
                  usedSize: usedSize,
                  totalSpace: 0,
                  availableSpace: 0,
                  remainingSpace: 0,
                  dataCount: data.length,
                });
              });
          } else {
            // 如果不支持 storage.estimate，只返回已用空间
            resolve({
              usedSize: usedSize,
              totalSpace: 0,
              availableSpace: 0,
              remainingSpace: 0,
              dataCount: data.length,
            });
          }
        };
      } catch (error) {
        console.error("Vecorder: 获取存储信息时出错:", error);
        reject(error);
      }
    });
  }

  // 格式化字节大小
  formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // 检查是否有 GM 数据需要迁移
  async checkAndMigrateData() {
    try {
      // 检查是否有 GM 数据
      const gmData = GM_getValue(dbname, null);
      const gmOptions = GM_getValue("vop", null);

      if (gmData || gmOptions) {
        console.log("Vecorder: 检测到 GM 数据，开始迁移到 IndexedDB");

        // 迁移主数据
        if (gmData) {
          await this.set(dbname, gmData);
          GM_deleteValue(dbname);
          console.log("Vecorder: 主数据迁移完成");
        }

        // 迁移选项数据
        if (gmOptions) {
          await this.set("vop", gmOptions);
          GM_deleteValue("vop");
          console.log("Vecorder: 选项数据迁移完成");
        }

        console.log("Vecorder: 数据迁移完成，已清空 GM 存储");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Vecorder: 数据迁移失败:", error);
      return false;
    }
  }
}

// 创建存储实例
const vecorderStorage = new VecorderStorage();

// 全局更新存储信息函数
async function updateStorageInfo() {
  try {
    if (!window.vecorderUseGMStorage) {
      const storageInfo = await vecorderStorage.getStorageInfo();
      let infoText = `已用: ${vecorderStorage.formatBytes(
        storageInfo.usedSize
      )} | 数据: ${storageInfo.dataCount}`;

      if (storageInfo.totalSpace > 0) {
        infoText += ` | 剩余: ${vecorderStorage.formatBytes(
          storageInfo.remainingSpace
        )}`;
      }

      $("#vecorder-storage-info").html(`
        <div class="storage-info-item">
          <span class="storage-value">${infoText}</span>
        </div>
      `);
    } else {
      $("#vecorder-storage-info").html(`
        <div class="storage-info-item">
          <span class="storage-value">GM 存储模式</span>
        </div>
      `);
    }
  } catch (error) {
    console.error("Vecorder: 更新存储信息失败:", error);
    $("#vecorder-storage-info").html(`
      <div class="storage-info-item">
        <span class="storage-value">存储信息获取失败</span>
      </div>
    `);
  }
}

// 存储适配器，根据情况选择使用 IndexedDB 还是 GM 存储
const storageAdapter = {
  async set(key, value) {
    if (window.vecorderUseGMStorage) {
      GM_setValue(key, value);
      return Promise.resolve();
    } else {
      return vecorderStorage.set(key, value);
    }
  },

  async get(key, defaultValue = null) {
    if (window.vecorderUseGMStorage) {
      const value = GM_getValue(key, defaultValue);
      return Promise.resolve(value);
    } else {
      return vecorderStorage.get(key, defaultValue);
    }
  },

  async delete(key) {
    if (window.vecorderUseGMStorage) {
      GM_deleteValue(key);
      return Promise.resolve();
    } else {
      return vecorderStorage.delete(key);
    }
  },
};

// 立即执行的调试信息
console.log("Vecorder: 脚本开始加载");
console.log(
  "Vecorder: jQuery版本:",
  typeof $ !== "undefined" ? $.fn.jquery : "未加载"
);
console.log(
  "Vecorder: Moment版本:",
  typeof moment !== "undefined" ? moment.version : "未加载"
);
console.log("Vecorder: 当前页面:", window.location.href);
vlog("脚本已加载，版本 0.70");

function vlog(msg) {
  console.log("[Vecorder]" + msg);
}

function p(msg) {
  return {
    time: new Date().getTime(),
    content: msg,
  };
}

// 根据当前地址获取直播间ID
function getRoomID() {
  let roomid = window.location.pathname.substring(1);
  return roomid; //获取当前房间号
}

var dbname = "vdb" + getRoomID();

// 初始化数据存储
let db = [];
let Option = { reltime: false, toffset: 0 };

// 异步初始化数据
async function initializeData() {
  try {
    // 检查并迁移数据
    const migrated = await vecorderStorage.checkAndMigrateData();

    // 从 IndexedDB 加载数据
    const dbData = await vecorderStorage.get(dbname, "[]");
    const optionsData = await vecorderStorage.get(
      "vop",
      '{"reltime":false,"toffset":0}'
    );

    db = JSON.parse(dbData);
    Option = JSON.parse(optionsData);

    console.log("Vecorder: 数据初始化完成");
    if (migrated) {
      console.log("Vecorder: 数据已从 GM 存储迁移到 IndexedDB");
    }
  } catch (error) {
    console.error("Vecorder: IndexedDB 初始化失败，回退到 GM 存储:", error);
    // 如果 IndexedDB 失败，回退到 GM 存储
    db = JSON.parse(GM_getValue(dbname, "[]"));
    Option = JSON.parse(GM_getValue("vop", '{"reltime":false,"toffset":0}'));

    // 标记使用 GM 存储模式
    window.vecorderUseGMStorage = true;
    console.log("Vecorder: 已切换到 GM 存储模式");
  }
}

// 数据初始化将在 DOM ready 时进行

function nindexOf(n) {
  for (let i in db) {
    if (!db[i].del && db[i].name == n) return i;
  }
  return -1;
}

function tindexOf(id, t) {
  for (let i in db[id].lives) {
    if (!db[id].lives[i].del && db[id].lives[i].title == t) return i;
  }
  return -1;
}

async function gc() {
  for (let i = db.length - 1; i >= 0; i--) {
    if (db[i].del) {
      db.splice(i, 1);
      continue;
    }
    for (let j = db[i].lives.length - 1; j >= 0; j--) {
      if (db[i].lives[j].del) {
        db[i].lives.splice(j, 1);
        continue;
      }
    }
  }
  await storageAdapter.set(dbname, JSON.stringify(db));
}

async function addPoint(t, msg) {
  console.log("addPoint", t, msg);
  let ltime = t * 1000;
  if (ltime == 0) return;
  let [name, link, title] = getRoomInfo();
  console.log("CurrentRoom:", name, link, title);
  let id = nindexOf(name);
  if (id == -1) {
    db.push({
      name: name,
      link: link,
      del: false,
      lives: [
        {
          title: title,
          time: ltime,
          del: false,
          points: [p(msg)],
        },
      ],
    });
  } else {
    let lid = tindexOf(id, title);
    if (lid == -1) {
      db[id].lives.push({
        title: title,
        time: ltime,
        points: [p(msg)],
      });
    } else {
      db[id].lives[lid].points.push(p(msg));
    }
  }
  await storageAdapter.set(dbname, JSON.stringify(db));
  $(`#vecorder-list`).replaceWith(dbToListview());
  // 更新存储信息
  if (toggle) {
    updateStorageInfo();
  }
}

function getMsg(body) {
  var vars = body.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == "msg") {
      return decodeURI(pair[1]);
    }
  }
  return false;
}

function getRoomInfo() {
  let resp = $.ajax({
    url:
      "https://api.live.bilibili.com/xlive/web-room/v1/index/getH5InfoByRoom?room_id=" +
      getRoomID(),
    async: false,
  }).responseJSON.data;
  console.log("RoomInfo:", resp);
  return [
    resp.anchor_info.base_info.uname,
    "https://space.bilibili.com/" + resp.room_info.uid,
    resp.room_info.title,
  ];
}

function tryAddPoint(msg) {
  // https://api.live.bilibili.com/room/v1/Room/room_init?id={roomID}
  console.log(msg, getRoomID());
  $.ajax({
    url:
      "https://api.live.bilibili.com/room/v1/Room/room_init?id=" + getRoomID(),
    async: true,
    success: function (resp) {
      let t = 0;
      if (resp.data.live_status != 1) t = 0;
      else t = resp.data.live_time;
      addPoint(t, msg).catch((error) => {
        console.error("Vecorder: 添加时间点失败:", error);
      });
    },
  });
}

let toggle = false;

// 确保DOM加载完成后再执行
$(document).ready(async function () {
  console.log("Vecorder: DOM已加载完成");
  vlog("开始初始化Vecorder功能");

  // 等待数据初始化完成
  try {
    await initializeData();
    console.log("Vecorder: 数据初始化完成，开始检查页面元素");
  } catch (error) {
    console.error("Vecorder: 数据初始化失败:", error);
  }

  // 延迟检查页面元素
  setTimeout(function () {
    console.log("Vecorder: 延迟检查页面元素");
    console.log(
      "Vecorder: control-panel-ctnr-box 存在:",
      $("#control-panel-ctnr-box").length > 0
    );
    console.log(
      "Vecorder: bottom-actions 存在:",
      $(".bottom-actions").length > 0
    );
    console.log(
      "Vecorder: bottom-actions 存在:",
      $(".bottom-actions").length > 0
    );
  }, 2000);
});

// 尝试多个可能的选择器来插入时间点输入框
function insertTimeInput() {
  const selectors = [
    "#control-panel-ctnr-box > div.bottom-actions.p-relative",
    "#control-panel-ctnr-box .bottom-actions",
    ".bottom-actions",
    "#control-panel-ctnr-box",
  ];

  for (let selector of selectors) {
    if ($(selector).length > 0) {
      console.log(`Vecorder: 使用选择器 ${selector} 插入时间点输入框`);

      // 创建时间点输入框容器
      const inputContainer = $(
        `<div id="vecorder-input-container">
          <div id="point-input">
            <textarea placeholder="输入内容并回车添加时间点"></textarea>
          </div>
        </div>`
      );

      inputContainer
        .find("#point-input > textarea")
        .bind("keypress", function (event) {
          if (event.keyCode == "13") {
            window.event.returnValue = false;
            console.log("Enter detected");
            tryAddPoint($("#point-input > textarea").val());
            $("#point-input > textarea").val("");
          }
        });

      // 尝试插入到不同的位置
      const targetSelectors = [
        "#control-panel-ctnr-box > div.bottom-actions.p-relative",
        ".bottom-actions",
        "#control-panel-ctnr-box",
      ];

      for (let targetSelector of targetSelectors) {
        if ($(targetSelector).length > 0) {
          $(targetSelector).append(inputContainer);
          console.log(`Vecorder: 时间点输入框已插入到 ${targetSelector}`);

          // 在同一个元素上插入记录按钮和面板
          insertRecordButton();
          return true; // 返回true表示成功插入，停止检查
        }
      }
    }
  }
  return false; // 如果没有找到合适的元素，返回false
}

console.log("Vecorder: 开始等待聊天输入区域元素");
waitForKeyElements(
  "#control-panel-ctnr-box > div.bottom-actions.p-relative",
  insertTimeInput,
  true // 只执行一次
);

// 尝试多个可能的选择器来插入记录按钮和面板
function insertRecordButton() {
  console.log("Vecorder: 开始插入记录按钮和面板");

  // 直接使用当前找到的元素
  const n = $("#control-panel-ctnr-box > div.bottom-actions.p-relative");
  if (n.length > 0) {
    console.log(`Vecorder: 使用当前元素插入记录按钮和面板`);

    // 尝试调整现有按钮的样式
    try {
      // 这里可以添加对现有按钮的调整，如果需要的话
      console.log("Vecorder: 找到目标元素，准备插入记录按钮");
    } catch (e) {
      console.log("Vecorder: 调整按钮样式时出错，继续执行", e);
    }

    // 这里可以添加其他初始化代码，如果需要的话

    // create panel
    let panel = $(
      '<div id="vPanel"><p class="vecorder-title">🍊 直播笔记</p></div>'
    );

    // 添加存储空间信息区域
    let storageInfo = $(
      '<div id="vecorder-storage-info" class="vecorder-storage-info"></div>'
    );
    panel.append(storageInfo);

    let contentList = dbToListview();
    panel.append(contentList);

    // 创建底部操作区域
    let bottomActions = $('<div class="vecorder-bottom-actions"></div>');

    // 创建设置按钮和折叠面板
    let settingsBtn = $(
      '<button class="vecorder-settings-btn" title="导出设置">⚙️</button>'
    );
    let settingsPanel =
      $(`<div class="vecorder-settings-panel" style="display: none;">
      <div class="timeop-item">
        <input type="checkbox" id="reltime" value="false"/>
        <label for="reltime">按相对时间导出</label>
      </div>
      <div class="timeop-item">
        <label for="toffset">时间偏移(秒)：</label>
        <input type="number" id="toffset" value="${Option.toffset}"/>
      </div>
    </div>`);

    settingsBtn.click(function () {
      console.log("Vecorder: 设置按钮被点击");
      settingsPanel.slideToggle(200);
      console.log("Vecorder: 设置面板可见性:", settingsPanel.is(":visible"));
    });

    // 创建清空按钮
    let clearBtn = $(
      '<button class="vecorder-clear-btn" title="清空所有数据">🗑️</button>'
    );
    clearBtn.click(function () {
      if (confirm("确定要清空所有直播笔记吗？此操作不可恢复。")) {
        db = [];
        storageAdapter.delete(dbname).catch((error) => {
          console.error("Vecorder: 清空数据失败:", error);
        });
        // 重新生成列表并更新显示
        $(`#vecorder-list`).replaceWith(dbToListview());
        // 更新存储信息
        updateStorageInfo();
      }
    });

    // 添加按钮到底部操作区域
    bottomActions.append(settingsBtn);
    bottomActions.append(clearBtn);
    panel.append(bottomActions);

    // 将设置面板添加到主面板中
    panel.append(settingsPanel);

    let closeBtn = $('<a class="vecorder-close-btn">&times;</a>');
    closeBtn.click(function () {
      console.log("Close clicked");
      $("#vPanel").hide();
      gc().catch((error) => {
        console.error("Vecorder: 保存数据失败:", error);
      });
      toggle = false;
      recordBtn.removeClass("vecorder-record-btn-active");
      // 更新存储信息
      updateStorageInfo();
    });
    panel.append(closeBtn);

    // Setup recordButton
    let recordBtn = $('<div><span class="txt">记录</span></div>');
    recordBtn.addClass("vecorder-record-btn");

    // 将面板插入到body中，确保正确的定位
    $("body").append(panel);
    $("#vPanel").hide();
    console.log("Vecorder: 面板已插入到body中");

    recordBtn.hover(
      function () {
        if (!toggle) $(this).addClass("vecorder-record-btn-hover");
      },
      function () {
        if (!toggle) $(this).removeClass("vecorder-record-btn-hover");
      }
    );

    recordBtn.click(function () {
      if (toggle) {
        $("#vPanel").hide();
        gc();
        toggle = false;
        $(this).removeClass("vecorder-record-btn-active");
        return;
      }
      console.log("Toggle panel");
      $("#vPanel").show();
      // 更新存储信息
      updateStorageInfo();
      // 确保面板在正确的位置显示
      if (Option.reltime) {
        $("#reltime").attr("checked", true);
      }

      // 绑定设置面板的事件
      $("#reltime").change(function () {
        Option.reltime = $(this).prop("checked");
        storageAdapter.set("vop", JSON.stringify(Option)).catch((error) => {
          console.error("Vecorder: 保存选项失败:", error);
        });
      });
      $("#toffset").change(function () {
        Option.toffset = $(this).val();
        storageAdapter.set("vop", JSON.stringify(Option)).catch((error) => {
          console.error("Vecorder: 保存选项失败:", error);
        });
      });
      $(this).addClass("vecorder-record-btn-active");
      toggle = true;
    });

    // 将记录按钮插入到输入容器中，而不是直接插入到控制面板
    $("#vecorder-input-container").append(recordBtn);
    console.log("Vecorder: 记录按钮已插入到输入容器中");

    let styles = $(`<style type="text/css"></style>`);
    styles.text(`
            /* 主面板样式 */
            #vPanel {
                line-height: 1.4;
                font-size: 13px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                display: block;
                box-sizing: border-box;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                padding: 12px;
                position: fixed;
                right: 20px;
                bottom: 120px;
                z-index: 99999;
                min-width: 320px;
                max-width: 420px;
                max-height: 75vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }



            /* 列表容器样式 */
            .vecorder-list-container {
                max-height: 60vh;
                overflow-y: auto;
                padding: 0;
                margin: 0;
            }

            /* 空状态样式 */
            .vecorder-empty-state {
                text-align: center;
                padding: 24px 16px;
                color: #6b7280;
            }

            .vecorder-empty-icon {
                margin-bottom: 12px;
                opacity: 0.6;
                display: flex;
                justify-content: center;
            }

            .vecorder-empty-icon svg {
                width: 36px;
                height: 36px;
                stroke: currentColor;
                stroke-width: 1.5;
                fill: none;
            }

            .vecorder-empty-text {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 6px;
                color: #374151;
            }

            .vecorder-empty-hint {
                font-size: 11px;
                color: #9ca3af;
            }

            /* 主播分组样式 */
            .vecorder-anchor-group {
                margin-bottom: 12px;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
                background: #ffffff;
            }

            .vecorder-anchor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-bottom: 1px solid #e5e7eb;
            }

            .vecorder-anchor-name {
                font-size: 14px;
                font-weight: 600;
                color: #1f2937;
            }

            .vecorder-anchor-count {
                font-size: 11px;
                color: #6b7280;
                background: rgba(35, 173, 229, 0.1);
                padding: 2px 8px;
                border-radius: 12px;
            }

            /* 直播列表样式 */
            .vecorder-lives-list {
                max-height: 250px;
                overflow-y: auto;
            }

            .vecorder-live-item {
                border-bottom: 1px solid #f3f4f6;
                transition: all 0.2s ease;
            }

            .vecorder-live-item:last-child {
                border-bottom: none;
            }

            .vecorder-live-item:hover {
                background: #f9fafb;
            }

            .vecorder-live-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                min-height: 40px;
            }

            .vecorder-live-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
                flex: 1;
                min-width: 0;
            }

            .vecorder-live-date {
                font-size: 10px;
                color: #6b7280;
                font-weight: 500;
                background: rgba(35, 173, 229, 0.1);
                padding: 1px 4px;
                border-radius: 3px;
                display: inline-block;
                width: fit-content;
            }

            .vecorder-live-title {
                font-size: 12px;
                font-weight: 600;
                color: #1f2937;
                line-height: 1.3;
                word-break: break-word;
                white-space: normal;
                margin: 1px 0;
            }

            .vecorder-live-points-count {
                font-size: 10px;
                color: #9ca3af;
                font-weight: 500;
            }

            /* 操作按钮样式 */
            .vecorder-live-actions {
                display: flex;
                gap: 2px;
                margin-left: 8px;
            }

            .vecorder-action-btn {
                width: 24px;
                height: 24px;
                border: none;
                border-radius: 4px;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                color: #6b7280;
                padding: 0;
            }

            .vecorder-action-btn svg {
                width: 12px;
                height: 12px;
                stroke: currentColor;
                stroke-width: 2;
                fill: none;
            }

            .vecorder-action-btn:hover {
                background: rgba(35, 173, 229, 0.1);
                color: #23ade5;
                transform: translateY(-1px);
            }

            .vecorder-delete-btn:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }

            /* 滚动条样式 */
            .vecorder-lives-list::-webkit-scrollbar {
                width: 4px;
            }

            .vecorder-lives-list::-webkit-scrollbar-track {
                background: transparent;
            }

            .vecorder-lives-list::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 2px;
            }

            .vecorder-lives-list::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.2);
            }

            /* 标题样式 */
            .vecorder-title {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 12px 0;
                color: #1f2937;
                text-align: center;
            }

            /* 链接样式 */
            .vName {
                color: #23ade5;
                cursor: pointer;
                text-decoration: none;
                transition: all 0.2s ease;
                font-weight: 500;
            }

            .vName:hover {
                color: #1a8bb8;
                text-decoration: underline;
            }

            /* 按钮样式 */
            .vecorder-btn {
                font-family: inherit;
                font-size: 11px;
                font-weight: 500;
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background: #23ade5;
                color: white;
                cursor: pointer;
                margin-left: 6px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 28px;
            }

            .vecorder-btn:hover {
                background: #1a8bb8;
            }

            .vecorder-btn-danger {
                background: #ef4444;
            }

            .vecorder-btn-danger:hover {
                background: #dc2626;
            }

            .vecorder-btn-hover {
                background: linear-gradient(135deg, #1a8bb8 0%, #147a9e 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(35, 173, 229, 0.4);
            }

            /* 记录按钮样式 */
            .vecorder-record-btn {
                font-family: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-sizing: border-box;
                padding: 4px 10px;
                cursor: pointer;
                outline: none;
                overflow: hidden;
                background: linear-gradient(135deg, #23ade5 0%, #1a8bb8 100%);
                color: #fff;
                border-radius: 12px;
                min-width: 40px;
                height: 24px;
                font-size: 11px;
                font-weight: 500;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(35, 173, 229, 0.3);
                border: none;
                flex-shrink: 0;
            }

            .vecorder-record-btn:hover {
                background: linear-gradient(135deg, #1a8bb8 0%, #147a9e 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(35, 173, 229, 0.4);
            }

            .vecorder-record-btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(35, 173, 229, 0.3);
            }

            .vecorder-record-btn-hover {
                background: linear-gradient(135deg, #1a8bb8 0%, #147a9e 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(35, 173, 229, 0.4);
            }

            .vecorder-record-btn-active {
                background: linear-gradient(135deg, #0d749e 0%, #0a5a7a 100%);
                box-shadow: 0 4px 8px rgba(13, 116, 158, 0.4);
            }

            /* 关闭按钮 */
            .vecorder-close-btn {
                position: absolute !important;
                right: 12px !important;
                top: 12px !important;
                font-size: 18px !important;
                color: #6b7280 !important;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                text-decoration: none;
                font-weight: 300;
            }

            .vecorder-close-btn:hover {
                color: #ef4444 !important;
            }

            /* 分割线 */
            .vecorder-divider {
                border: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
                margin: 12px 0;
            }

            /* 存储信息区域样式 */
            .vecorder-storage-info {
                background: rgba(35, 173, 229, 0.05);
                border: 1px solid rgba(35, 173, 229, 0.2);
                border-radius: 4px;
                padding: 6px 10px;
                margin: 6px 0;
                font-size: 10px;
            }

            .storage-info-item {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
            }

            .storage-value {
                color: #23ade5;
                font-weight: 600;
                font-family: 'Courier New', monospace;
                text-align: center;
                line-height: 1.2;
            }

            /* 底部操作区域 */
            .vecorder-bottom-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                padding: 8px 0;
                border-top: 1px solid #e5e7eb;
                margin-top: 8px;
            }

            /* 设置按钮 */
            .vecorder-settings-btn {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 4px;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                color: #6b7280;
                font-size: 14px;
                padding: 0;
            }

            .vecorder-settings-btn:hover {
                background: rgba(35, 173, 229, 0.1);
                color: #23ade5;
                transform: translateY(-1px);
            }

            /* 清空按钮 */
            .vecorder-clear-btn {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 4px;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                color: #6b7280;
                font-size: 14px;
                padding: 0;
            }

            .vecorder-clear-btn:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                transform: translateY(-1px);
            }

            /* 设置面板 */
            .vecorder-settings-panel {
                background: rgba(35, 173, 229, 0.05);
                border: 1px solid rgba(35, 173, 229, 0.2);
                border-radius: 4px;
                padding: 12px;
                margin-top: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 12px;
                overflow: hidden;
            }

            /* 时间选项区域 */
            .timeop-item {
                margin: 8px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .timeop-item label {
                font-size: 12px;
                color: #374151;
                font-weight: 500;
                flex: 1;
            }

            .vecorder-settings-panel input[type="number"] {
                width: 80px;
                padding: 6px 10px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 12px;
                outline: none;
                transition: all 0.2s ease;
                background: rgba(255, 255, 255, 0.9);
            }

            .vecorder-settings-panel input[type="number"]:focus {
                border-color: #23ade5;
                box-shadow: 0 0 0 3px rgba(35, 173, 229, 0.1);
                background: white;
            }

            .vecorder-settings-panel input[type="checkbox"] {
                accent-color: #23ade5;
                transform: scale(1.2);
                margin: 0;
            }

            .vecorder-settings-panel .timeop-item {
                margin: 6px 0;
            }

            .vecorder-settings-panel .timeop-item label {
                font-size: 11px;
                color: #374151;
                font-weight: 500;
            }

            /* 聊天输入框样式 */
            #control-panel-ctnr-box > div.chat-input-ctnr-new.p-relative > div.medal-section {
                height: 30px;
                line-height: 13px;
            }

            /* Vecorder输入容器 */
            #vecorder-input-container {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-top: 6px;
                padding: 6px 10px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 6px;
                border: 1px solid rgba(0, 0, 0, 0.08);
                transition: all 0.2s ease;
            }

            #vecorder-input-container:focus-within {
                border-color: #23ade5;
                box-shadow: 0 0 0 3px rgba(35, 173, 229, 0.1);
            }

            /* 时间点输入框 */
            #point-input {
                flex: 1;
                min-width: 0;
            }

            #point-input > textarea {
                width: 100%;
                border: 0;
                outline: 0;
                resize: none;
                background: transparent;
                color: #374151;
                font-size: 12px;
                height: 20px;
                font-family: inherit;
                line-height: 1.4;
            }

            #point-input > textarea::placeholder {
                color: #9ca3af;
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                #vPanel {
                    right: 4px;
                    left: 4px;
                    bottom: 120px;
                    min-width: auto;
                    max-width: none;
                    max-height: 80vh;
                }
                
                .vecorder-lives-list {
                    max-height: 200px;
                }
            }

            /* 滚动条样式 */
            #vPanel::-webkit-scrollbar {
                width: 6px;
            }

            #vPanel::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
                border-radius: 3px;
            }

            #vPanel::-webkit-scrollbar-thumb {
                background: rgba(35, 173, 229, 0.3);
                border-radius: 3px;
            }

            #vPanel::-webkit-scrollbar-thumb:hover {
                background: rgba(35, 173, 229, 0.5);
            }

            /* 移除聊天控制面板的高度限制 */
            #chat-control-panel-vm {
                max-height: none !important;
                height: auto !important;
            }

            /* 优化bottom-actions区域的布局 */
            .bottom-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
                position: relative;
            }

            /* 调整发送按钮位置，避免覆盖输入框 */
            .bottom-actions .right-action {
                position: static !important;
                align-self: flex-end;
                margin-top: 4px;
            }

            /* 确保Vecorder输入容器不被覆盖 */
            #vecorder-input-container {
                position: relative;
                z-index: 1;
            }
        `);
    $("head").prepend(styles);

    return true; // 成功插入后退出函数
  }

  console.log("Vecorder: 未找到合适的控制面板元素");
  return false;
}

// 移除单独的insertRecordButton调用，因为现在在insertTimeInput中调用

function dbToListview() {
  let urlObject = window.URL || window.webkitURL || window;
  let content = $(
    `<div id="vecorder-list" class="vecorder-list-container"></div>`
  );

  // 如果没有数据，显示空状态
  if (db.length === 0 || db.every((item) => item.del)) {
    content.append(`
      <div class="vecorder-empty-state">
        <div class="vecorder-empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <div class="vecorder-empty-text">暂无直播笔记</div>
        <div class="vecorder-empty-hint">在下方输入框添加时间点即可开始记录</div>
      </div>
    `);
    return content;
  }

  // 创建主播分组列表
  for (let i in db) {
    if (db[i].del) continue;

    // 检查该主播是否有未删除的直播
    let hasValidLives = false;
    for (let j in db[i].lives) {
      if (!db[i].lives[j].del) {
        hasValidLives = true;
        break;
      }
    }
    if (!hasValidLives) continue;

    // 创建主播分组
    let anchorGroup = $(`
      <div class="vecorder-anchor-group">
        <div class="vecorder-anchor-header">
          <span class="vecorder-anchor-name">${db[i].name}</span>
          <span class="vecorder-anchor-count">${
            db[i].lives.filter((live) => !live.del).length
          } 场直播</span>
        </div>
        <div class="vecorder-lives-list"></div>
      </div>
    `);

    let livesList = anchorGroup.find(".vecorder-lives-list");

    // 按时间倒序排列直播
    let sortedLives = db[i].lives
      .filter((live) => !live.del)
      .sort((a, b) => b.time - a.time);

    for (let live of sortedLives) {
      let liveItem = $(`
        <div class="vecorder-live-item">
          <div class="vecorder-live-header">
            <div class="vecorder-live-info">
              <span class="vecorder-live-date">${moment(live.time).format(
                "MM/DD HH:mm"
              )}</span>
              <span class="vecorder-live-title">${live.title}</span>
              <span class="vecorder-live-points-count">${
                live.points.length
              } 个时间点</span>
            </div>
            <div class="vecorder-live-actions">
              <button class="vecorder-action-btn vecorder-export-btn" title="导出笔记">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button class="vecorder-action-btn vecorder-delete-btn" title="删除">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `);

      // 绑定导出事件
      liveItem.find(".vecorder-export-btn").click(function () {
        exportRaw(
          live,
          db[i].name,
          `[${db[i].name}][${live.title}][${moment(live.time).format(
            "YYYY-MM-DD"
          )}].txt`
        );
      });

      // 绑定删除事件
      liveItem.find(".vecorder-delete-btn").click(function () {
        if (confirm(`确定要删除 "${live.title}" 的直播笔记吗？`)) {
          if (db[i].lives.length == 1) {
            db[i].del = true;
            anchorGroup.remove();
          } else {
            live.del = true;
            liveItem.remove();
          }
          storageAdapter.set(dbname, JSON.stringify(db)).catch((error) => {
            console.error("Vecorder: 保存数据失败:", error);
          });

          // 更新存储信息
          updateStorageInfo();

          // 如果该主播组没有更多直播，移除整个组
          if (anchorGroup.find(".vecorder-live-item").length === 0) {
            anchorGroup.remove();
          }

          // 检查是否所有数据都被删除了，如果是则重新生成列表显示空状态
          let hasValidData = false;
          for (let j in db) {
            if (!db[j].del) {
              for (let k in db[j].lives) {
                if (!db[j].lives[k].del) {
                  hasValidData = true;
                  break;
                }
              }
              if (hasValidData) break;
            }
          }

          if (!hasValidData) {
            // 重新生成列表显示空状态
            $(`#vecorder-list`).replaceWith(dbToListview());
          }
        }
      });

      livesList.append(liveItem);
    }

    content.append(anchorGroup);
  }

  return content;
}

function exportRaw(live, v, fname) {
  var urlObject = window.URL || window.webkitURL || window;
  var export_blob = new Blob([rawToString(live, v)]);
  var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
  save_link.href = urlObject.createObjectURL(export_blob);
  save_link.download = fname;
  save_link.click();
}

function rawToString(live, v) {
  let r =
    "# 由Vecorder自动生成，不妨关注下可爱的@轴伊Joi_Channel：https://space.bilibili.com/61639371/\n";
  r += `# ${v} \n`;
  r += `# ${live.title} - 直播开始时间：${moment(live.time).format(
    "YYYY-MM-DD HH:mm:ss"
  )}\n\n`;
  for (let i in live.points) {
    if (!Option.reltime)
      r += `[${moment(live.points[i].time)
        .add(Option.toffset, "seconds")
        .format("HH:mm:ss")}] ${live.points[i].content}\n`;
    else {
      let seconds =
        moment(live.points[i].time).diff(moment(live.time), "second") +
        Number(Option.toffset);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      r += `[${f(hours)}:${f(minutes)}:${f(seconds)}] ${
        live.points[i].content
      }\n`;
    }
  }
  return r;
}

function f(num) {
  if (String(num).length > 2) return num;
  return (Array(2).join(0) + num).slice(-2);
}

function waitForKeyElements(
  selectorTxt /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */,
  actionFunction /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */,
  bWaitOnce /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */,
  iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
  console.log(`Vecorder: waitForKeyElements 检查选择器: ${selectorTxt}`);
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    console.log(`Vecorder: 找到 ${targetNodes.length} 个匹配元素`);
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        console.log(`Vecorder: 执行动作函数`);
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) {
          console.log(`Vecorder: 动作函数返回true，标记为已处理并停止检查`);
          jThis.data("alreadyFound", true);
          btargetsFound = true; // 保持为true，这样会清除定时器
        } else {
          jThis.data("alreadyFound", true);
          console.log(`Vecorder: 元素已标记为已处理`);
        }
      } else {
        console.log(`Vecorder: 元素已经处理过，跳过`);
      }
    });
  } else {
    console.log(`Vecorder: 未找到匹配元素，继续等待`);
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    console.log(`Vecorder: 清除定时器，停止检查`);
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else if (!btargetsFound) {
    //--- Set a timer, if needed.
    if (!timeControl) {
      console.log(`Vecorder: 设置定时器，继续检查`);
      timeControl = setInterval(function () {
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
