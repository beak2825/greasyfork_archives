// ==UserScript==
// @name        NGA Cache History
// @name:zh-CN  NGA 帖子缓存插件
// @namespace   https://greasyfork.org/users/263018
// @version     1.2.4
// @author      snyssss
// @description 将帖子内容缓存 IndexedDB 里，以便在帖子被审核/删除时仍能查看
// @license     MIT

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/466500/NGA%20Cache%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/466500/NGA%20Cache%20History.meta.js
// ==/UserScript==
(async ({ commonui: ui, _LOADERREAD: loader }) => {
  // 检查是否支持 IndexedDB
  if (window.indexedDB === undefined) {
    return;
  }

  // 常量
  const VERSION = 1;
  const DB_NAME = "NGA_CACHE";
  const TABLE_NAME = "reads";
  const SHOW_DIFFRENCE_KEY = "SHOW_DIFFRENCE";
  const EXPIRE_DURATION_KEY = "EXPIRE_DURATION";
  const REFETCH_NOTIFICATION_INTERVAL_KEY = "REFETCH_NOTIFICATION_INTERVAL";

  // 显示差异
  const SHOW_DIFFRENCE = GM_getValue(SHOW_DIFFRENCE_KEY, false);

  // 缓存时长
  const EXPIRE_DURATION = GM_getValue(EXPIRE_DURATION_KEY, 7);

  // 获取提示信息间隔
  const REFETCH_NOTIFICATION_INTERVAL = GM_getValue(
    REFETCH_NOTIFICATION_INTERVAL_KEY,
    10
  );

  // 判断帖子是否正常
  const isSuccess = () => {
    return ui;
  };

  // 格式化 URL
  const formatUrl = (url) => {
    // 分割 URL
    const urlSplit = url.split("?");

    // 获取页面参数
    const params = new URLSearchParams(urlSplit[1]);

    // 如果是第一页，移除页码参数
    if (params.get("page") === "1") {
      params.delete("page");
    }

    // 移除 _ff 参数
    params.delete("_ff");

    // 返回格式化后的结果
    return `${urlSplit[0]}?${params.toString()}`;
  };

  // 获取首页 URL
  const getHeadUrl = (url) => {
    // 格式化 URL
    url = formatUrl(url);

    // 分割 URL
    const urlSplit = url.split("?");

    // 获取页面参数
    const params = new URLSearchParams(urlSplit[1]);

    // 获取 TID
    const tid = params.get("tid");

    // 返回首页 URL
    return `${urlSplit[0]}?tid=${tid}`;
  };

  // 获取数据库实例
  const db = await new Promise((resolve) => {
    // 打开 IndexedDB 数据库
    const request = window.indexedDB.open(DB_NAME, VERSION);

    // 如果数据库不存在则创建
    request.onupgradeneeded = (event) => {
      // 创建表
      const store = event.target.result.createObjectStore(TABLE_NAME, {
        keyPath: "url",
      });

      // 创建索引，用于清除过期数据
      store.createIndex("timestamp", "timestamp");
    };

    // 成功后返回实例
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });

  // 获取数据
  const get = (url, onsuccess, onerror = () => {}) => {
    // 格式化 URL
    url = formatUrl(url);

    // 只缓存帖子内容
    if (url.indexOf("/read.php") < 0) {
      return;
    }

    // 创建事务
    const transaction = db.transaction([TABLE_NAME], "readonly");

    // 获取对象仓库
    const store = transaction.objectStore(TABLE_NAME);

    // 获取数据
    const request = store.get(url);

    // 成功后处理数据
    request.onsuccess = (event) => {
      // 获取页面对象
      const data = event.target.result;

      // 不存在则抛出异常
      if (data === undefined) {
        onerror();
        return;
      }

      // 处理数据
      onsuccess(data);
    };

    // 失败后抛出异常
    request.onerror = () => {
      onerror();
    };
  };

  // 删除超时数据
  const expire = (offset) => {
    // 创建事务
    const transaction = db.transaction([TABLE_NAME], "readwrite");

    // 获取对象仓库
    const store = transaction.objectStore(TABLE_NAME);

    // 获取索引
    const index = store.index("timestamp");

    // 查找超时数据
    const request = index.openCursor(
      IDBKeyRange.upperBound(Date.now() - offset)
    );

    // 成功后删除数据
    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        store.delete(cursor.primaryKey);

        cursor.continue();
      }
    };
  };

  // 删除数据
  const remove = (url, onsuccess = () => {}, onerror = () => {}) => {
    // 格式化 URL
    url = formatUrl(url);

    // 创建事务
    const transaction = db.transaction([TABLE_NAME], "readwrite");

    // 获取对象仓库
    const store = transaction.objectStore(TABLE_NAME);

    // 删除数据
    const request = store.delete(url);

    // 成功后回调
    request.onsuccess = () => {
      onsuccess();
    };

    // 失败后回调
    request.onerror = () => {
      onerror();
    };
  };

  // 写入数据
  const put = (url, data, onsuccess = () => {}, onerror = () => {}) => {
    // 格式化 URL
    url = formatUrl(url);

    // 创建事务
    const transaction = db.transaction([TABLE_NAME], "readwrite");

    // 获取对象仓库
    const store = transaction.objectStore(TABLE_NAME);

    // 写入数据
    const request = store.put({
      url,
      timestamp: Date.now(),
      ...data,
    });

    // 成功后回调
    request.onsuccess = () => {
      onsuccess();
    };

    // 失败后回调
    request.onerror = () => {
      onerror();
    };
  };

  // 缓存数据
  const save = (url) => {
    // 格式化 URL
    url = formatUrl(url);

    // 只缓存帖子内容
    if (url.indexOf("/read.php") < 0) {
      return;
    }

    // 重新请求原始数据用于缓存
    fetch(url)
      .then((res) => res.blob())
      .then((res) => {
        // 读取内容
        const reader = new FileReader();

        reader.onload = async () => {
          // 读取内容
          const content = reader.result;

          // 解析标题
          const parser = new DOMParser();
          const html = parser.parseFromString(content, "text/html");
          const title = (() => {
            const str = html.querySelector("title").textContent;
            const index = str.lastIndexOf(" ");

            if (index > 0) {
              return str.substring(0, index);
            }

            return str;
          })();

          // 没有楼层，说明卡审核
          if (content.indexOf("commonui.postArg.proc(") < 0) {
            return;
          }

          // 找到 ID 是 postcontainer 开头的元素
          const containers = html.querySelectorAll("[id^=postcontainer]");

          if (containers.length === 0) {
            return;
          }

          // 有锚点，但是找不到楼层，也是卡审核
          const anchor = url.match(/(#pid\d+Anchor)$/);

          if (anchor && html.querySelector(anchor[1]) === null) {
            return;
          }

          // 如果未开启浏览记录，直接写入缓存
          if (SHOW_DIFFRENCE === false) {
            put(url, {
              title,
              content,
            });
          }
          // 否则判断是否是正常的翻页，如果是则需要更新最大楼层数
          else {
            // 分割 URL
            const urlSplit = url.split("?");

            // 获取页面参数
            const params = new URLSearchParams(urlSplit[1]);

            // 移除 TID 参数
            params.delete("tid");

            // 移除页码参数
            params.delete("page");

            // 如果仍有参数，只缓存当前页，无需更新最大楼层数
            if (params.size > 0) {
              put(url, {
                title,
                content,
              });
            }
            // 否则需要更新最大楼层数
            else {
              // 获取首页 URL
              const headUrl = getHeadUrl(url);

              // 当前页不是首页，写入缓存
              if (headUrl !== url) {
                put(url, {
                  title,
                  content,
                });
              }

              // 获取当前页面的最大楼层数
              const count = parseInt(
                containers[containers.length - 1]
                  .getAttribute("id")
                  .replace("postcontainer", ""),
                10
              );

              // 获取首页缓存
              get(
                headUrl,
                (data) => {
                  // 获取缓存楼层数
                  const cache = data.rows || 0;

                  // 计算最大楼层数
                  const max = Math.max(count, cache);

                  // 当前页是首页，直接更新缓存
                  if (headUrl === url) {
                    put(url, {
                      title,
                      content,
                      rows: max,
                    });

                    loadAction();
                    return;
                  }

                  // 如果与缓存的最大楼层数相同，无需更新
                  if (max === cache) {
                    return;
                  }

                  // 更新缓存
                  put(headUrl, {
                    ...data,
                    rows: max,
                  });
                },
                () => {
                  // 当前页是首页，直接更新缓存
                  if (headUrl === url) {
                    put(url, {
                      title,
                      content,
                      rows: count,
                    });

                    loadAction();
                  }
                }
              );
            }
          }
        };

        reader.readAsText(res, "GBK");
      });
  };

  // 读取数据
  const load = (url, document) => {
    // 格式化 URL
    url = formatUrl(url);

    return get(url, (data) => {
      // 加载缓存内容
      const html = document.open("text/html", "replace");

      html.write(data.content);
      html.close();

      // 缓存时间格式
      const formatedDate = (() => {
        const date = new Date(data.timestamp);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}`;
      })();

      // 写入缓存时间
      (() => {
        const execute = () => {
          const container = document.querySelector('td[id^="postcontainer"]');

          if (container) {
            const elements = container.querySelectorAll(":scope > .clear");

            const anchor = elements[elements.length - 1];

            if (anchor) {
              anchor.insertAdjacentHTML(
                "afterend",
                `<h4 class="silver subtitle">缓存</h4><span class="block_txt block_txt_c3">${formatedDate}</span>`
              );
              return;
            }
          }

          setTimeout(execute, 160);
        };

        execute();
      })();
    });
  };

  // STYLE
  GM_addStyle(`
      .s-table-wrapper {
        height: calc((2em + 10px) * 11 + 3px);
        overflow-y: auto;
      }
      .s-table {
        margin: 0;
      }
      .s-table th,
      .s-table td {
        position: relative;
        white-space: nowrap;
      }
      .s-table th {
        position: sticky;
        top: 2px;
        z-index: 1;
      }
      .s-text-ellipsis > * {
        flex: 1;
        width: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `);

  // UI
  const loadUI = () => {
    if (!ui) {
      return;
    }

    const content = (() => {
      const c = document.createElement("div");

      c.innerHTML = `
        <div class="s-table-wrapper" style="width: 1000px; max-width: 95vw;">
          <table class="s-table forumbox">
            <thead>
              <tr class="block_txt_c0">
                <th class="c1" width="1">时间</th>
                <th class="c2">内容</th>
                <th class="c3" width="1">操作</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div style="display: flex; margin-top: 10px;">
          <input type="text" style="flex: 1;" placeholder="目前支持通过帖子链接或标题进行筛选，查询旧数据可能需要一些时间" />
          <button>筛选</button>
        </div>
      `;

      return c;
    })();

    let position = null;
    let hasNext = true;
    let isFetching = false;
    let keyword = "";

    const list = content.querySelector("TBODY");

    const wrapper = content.querySelector(".s-table-wrapper");

    const keywordInput = content.querySelector("INPUT");

    const filterButton = content.querySelector("BUTTON");

    const fetchData = () => {
      isFetching = true;

      // 声明查询数量
      let limit = 10;

      // 创建事务
      const transaction = db.transaction([TABLE_NAME], "readonly");

      // 获取对象仓库
      const store = transaction.objectStore(TABLE_NAME);

      // 获取索引
      const index = store.index("timestamp");

      // 查找数据
      const request = index.openCursor(
        position ? IDBKeyRange.upperBound(position) : null,
        "prev"
      );

      // 加载列表
      request.onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor) {
          const { url, title, timestamp } = cursor.value;

          position = timestamp;

          if (list.querySelector(`[data-url="${url}"]`)) {
            cursor.continue();
            return;
          }

          if (keyword) {
            if (url.indexOf(keyword) < 0 && title.indexOf(keyword) < 0) {
              cursor.continue();
              return;
            }
          }

          const item = document.createElement("TR");

          item.className = `row${(list.querySelectorAll("TR").length % 2) + 1}`;

          item.setAttribute("data-url", url);

          item.innerHTML = `
            <td class="c1">
              <span class="nobr">${ui.time2dis(timestamp / 1000)}</span>
            </td>
            <td class="c2">
              <div class="s-text-ellipsis">
                <span>
                  <a href="${url}" title="${title}" class="b nobr">${title}</a>
                </span>
              </div>
            </td>
            <td class="c3">
              <button>查看缓存版本</button>
              <button>删除</button>
            </td>
          `;

          const buttons = item.querySelectorAll("button");

          // 查看缓存版本
          buttons[0].onclick = () => {
            const iWindow = ui.createCommmonWindow();
            const iframe = document.createElement("IFRAME");

            iframe.style.width = "80vw";
            iframe.style.height = "80vh";
            iframe.style.border = "none";

            const iframeLoad = () => {
              iframe.removeEventListener("load", iframeLoad);

              load(url, iframe.contentDocument);
            };

            iframe.addEventListener("load", iframeLoad);

            iWindow._.addTitle(title);
            iWindow._.addContent(iframe);
            iWindow._.show();
          };

          // 删除缓存
          buttons[1].onclick = () => {
            remove(url, () => {
              list.removeChild(item);

              if (list.childElementCount < 10) {
                fetchData();
              }
            });
          };

          list.appendChild(item);

          if (limit > 1) {
            cursor.continue();
          } else {
            isFetching = false;
          }
        } else {
          hasNext = false;
        }

        limit -= 1;
      };
    };

    const refetch = (value = ``) => {
      list.innerHTML = ``;

      position = null;
      hasNext = true;
      isFetching = false;
      keyword = value;

      keywordInput.value = value;

      fetchData();
    };

    wrapper.onscroll = () => {
      if (isFetching || !hasNext) {
        return;
      }

      if (
        wrapper.scrollHeight - wrapper.scrollTop <=
        wrapper.clientHeight * 1.1
      ) {
        fetchData();
      }
    };

    filterButton.onclick = () => {
      refetch(keywordInput.value);
    };

    // 增加菜单项
    (() => {
      const title = "浏览记录";

      let window;

      ui.mainMenu.addItemOnTheFly(title, null, () => {
        if (window === undefined) {
          window = ui.createCommmonWindow();
        }

        refetch();

        window._.addTitle(title);
        window._.addContent(content);
        window._.show();
      });
    })();
  };

  // 加载操作按钮
  // 目前只有主楼的删除缓存
  const loadAction = () => {
    if (ui && ui.postArg) {
      const { data } = ui.postArg;

      if (data && data["0"] && data["0"]["pid"] === 0) {
        const item = data["0"];
        const pInfoC = item["pInfoC"];
        const anchor = pInfoC.querySelector(`[title="操作菜单"]`);

        const action = pInfoC.querySelector(`[title="缓存"]`);

        if (anchor && action === null) {
          const element = document.createElement("A");

          element.href = "javascript:void(0)";
          element.className = `postinfob postfavb postoptb small_colored_text_btn block_txt_c0 stxt`;
          element.title = "缓存";

          element.append(...__TXT.svg("turned_in", "", 8));

          element.onclick = () => {
            const url = window.location.href;

            // 判断是否已有缓存
            // 目前默认缓存所有页面，所以一定会有缓存
            const cached = element.classList.contains("postoptb");

            if (cached) {
              remove(url, () => {
                element.classList.remove("postoptb");
              });
            } else {
              save(url);

              element.classList.add("postoptb");
            }
          };

          anchor.parentElement.insertBefore(element, anchor);
        }
      }
    }
  };

  // 加载消息
  const loadMessage = () => {
    if (!ui) {
      return;
    }

    // 获取消息并写入缓存
    const execute = () => {
      fetch("/nuke.php?lite=js&__lib=noti&__act=get_all")
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();

          reader.onload = () => {
            const text = reader.result;
            const result = JSON.parse(
              text
                .replace("window.script_muti_get_var_store=", "")
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
            );

            if (result.data) {
              const data = result.data[0];

              const list = ["0", "1", "2"].reduce(
                (res, key) => ({
                  ...res,
                  [key]: data[key],
                }),
                {}
              );

              // 有未读消息，说明抢先获取了，需要弹出提醒
              if (data.unread) {
                for (let type in list) {
                  const group = list[type];

                  if (!group) {
                    continue;
                  }

                  for (let i = 0; i < group.length; i += 1) {
                    const item = group[i];

                    if (!item) {
                      continue;
                    }

                    if (i < group.length - 5) {
                      continue;
                    }

                    ui.notification._add(type, item);
                  }

                  if (group.length > 5) {
                    ui.notification._more.style.display = "";
                  }
                }

                ui.notification.openBox();
              }

              // 处理缓存
              // 只处理 0，也就是 _BIT_REPLY 的情况
              if (list["0"]) {
                const group = list["0"];

                for (let i = 0; i < group.length; i += 1) {
                  const item = group[i];

                  if (!item) {
                    continue;
                  }

                  // 消息的时间
                  const time = item[9] * 1000;

                  // 消息的内容，参考 js_notification.js 的 TPL
                  let str = TPL[0][item[0]];

                  if (typeof str == "function") {
                    str = str(item);
                  }

                  str = str
                    .replace(/\{(_[A-Z0-9_]+)\}/g, function ($0, $1) {
                      return TPLSUB[$1] ? TPLSUB[$1] : $0;
                    })
                    .replace(/\{(_[A-Z0-9_]+)\}/g, function ($0, $1) {
                      return item[KEY[$1]] ? item[KEY[$1]] : $0;
                    });

                  // 获取里面出现的所有页面链接
                  const urls = [
                    ...str.matchAll(/href="(\/read.php[^"]*)"/gi),
                  ].map((match) => `${window.location.origin}${match[1]}`);

                  for (let index in urls) {
                    // 链接地址
                    const url = urls[index];

                    // 创建事务
                    const transaction = db.transaction(
                      [TABLE_NAME],
                      "readonly"
                    );

                    // 获取对象仓库
                    const store = transaction.objectStore(TABLE_NAME);

                    // 获取数据
                    const request = store.get(url);

                    // 成功后处理数据
                    request.onsuccess = (event) => {
                      // 获取页面对象
                      const data = event.target.result;

                      // 存在，且缓存的时间晚于消息时间则跳过
                      if (data && data.timestamp > time) {
                        return;
                      }

                      // 写入缓存
                      save(url);
                    };
                  }
                }
              }
            }
          };

          reader.readAsText(blob, "GBK");
        });
    };

    // NGA 的消息机制是在页面加载的时候由服务端写在页面里再请求消息
    // 这会导致页面不刷新的时候，收到的提醒不能及时获知，等刷新时帖子可能已经没了
    // 所以需要定时获取最新消息，保证不刷论坛的情况下也会缓存提醒
    // 泥潭审核机制导致有消息提示但是找不到帖子的情况待解决
    const excuteInterval = () => {
      if (REFETCH_NOTIFICATION_INTERVAL > 0) {
        execute();
        setInterval(execute, REFETCH_NOTIFICATION_INTERVAL * 60 * 1000);
      }
    };

    // 启动定时器
    if (ui.notification) {
      excuteInterval();
    } else {
      ui.loadNotiScript(excuteInterval);
    }
  };

  // 绑定事件
  const hook = () => {
    // 钩子
    const hookFunction = (object, functionName, callback) => {
      ((originalFunction) => {
        object[functionName] = function () {
          const returnValue = originalFunction.apply(this, arguments);

          callback.apply(this, [returnValue, originalFunction, arguments]);

          return returnValue;
        };
      })(object[functionName]);
    };

    // 页面跳转
    if (loader) {
      hookFunction(loader, "go", (returnValue, originalFunction, arguments) => {
        if (arguments[1]) {
          const { url } = arguments[1];

          save(url);
        }
      });
    }

    // 快速翻页
    if (ui) {
      hookFunction(
        ui,
        "loadReadHidden",
        (returnValue, originalFunction, arguments) => {
          if (arguments && __PAGE) {
            const p = (() => {
              if (arguments[1] & 2) {
                return __PAGE[2] + 1;
              }

              if (arguments[1] & 4) {
                return __PAGE[2] - 1;
              }

              return arguments[0];
            })();

            if (p < 1 || (__PAGE[1] > 0 && p > __PAGE[1])) {
              return;
            }

            const urlParams = new URLSearchParams(window.location.search);

            urlParams.set("page", p);

            const url = `${window.location.origin}${
              window.location.pathname
            }?${urlParams.toString()}`;

            save(url);
          }
        }
      );
    }

    // 显示浏览记录或恢复帖子列表里异常的帖子
    if (ui && ui.topicArg) {
      const execute = () => {
        ui.topicArg.data.forEach((item) => {
          const tid = item[8];
          const postDate = item[12];

          const url = `${window.location.origin}/read.php?tid=${tid}`;

          get(url, (data) => {
            if (postDate > 0) {
              if (SHOW_DIFFRENCE) {
                const replies = parseInt(item[0].innerHTML, 10);
                const rows = data.rows === undefined ? replies : data.rows;

                const diffrence = replies - rows;

                if (diffrence > 0) {
                  const page = Math.ceil(rows / 20);

                  if (page > 1) {
                    item[0].setAttribute("href", `${url}&page=${page}`);
                  }

                  item[0].innerHTML = `${replies}<small>(+${diffrence})</small>`;
                }

                item[1].style.opacity = "0.5";
              }
              return;
            }

            item[1].innerHTML = data.title;
            item[2].innerHTML = "缓存";
            item[3].innerHTML = ui.time2dis(data.timestamp / 1000);
          });
        });
      };

      hookFunction(ui.topicArg, "loadAll", execute);
      execute();
    }
  };

  // 加载菜单项
  (() => {
    GM_registerMenuCommand(
      `浏览记录：${SHOW_DIFFRENCE ? "显示" : "关闭"}`,
      () => {
        GM_setValue(SHOW_DIFFRENCE_KEY, !SHOW_DIFFRENCE);
        location.reload();
      }
    );

    GM_registerMenuCommand(`缓存天数：${EXPIRE_DURATION} 天`, () => {
      const input = prompt("请输入缓存天数（最大1000）：", EXPIRE_DURATION);

      if (input) {
        const value = parseInt(input, 10);

        if (value > 0 && value <= 1000) {
          GM_setValue(EXPIRE_DURATION_KEY, value);

          location.reload();
        }
      }
    });

    GM_registerMenuCommand(
      `消息刷新间隔：${REFETCH_NOTIFICATION_INTERVAL} 分钟`,
      () => {
        const input = prompt(
          "请输入消息刷新间隔（单位：分钟，设置为 0 的时候不启用）：",
          REFETCH_NOTIFICATION_INTERVAL
        );

        if (input) {
          const value = parseInt(input, 10);

          if (value <= 1440) {
            GM_setValue(REFETCH_NOTIFICATION_INTERVAL_KEY, value);

            location.reload();
          }
        }
      }
    );
  })();

  // 执行脚本
  (() => {
    // 绑定事件
    hook();

    // 删除超时数据
    expire(EXPIRE_DURATION * 24 * 60 * 60 * 1000);

    // 加载UI
    loadUI();

    // 加载消息
    loadMessage();

    // 当前链接地址
    const url = window.location.href;

    // 帖子正常的情况下缓存数据，否则尝试从缓存中读取
    if (isSuccess()) {
      save(url);
    } else {
      load(url, document);
    }
  })();
})(unsafeWindow);
