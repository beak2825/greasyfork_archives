// ==UserScript==
// @name        NGA Auto Pagerize
// @namespace   https://greasyfork.org/users/263018
// @version     1.7.6
// @author      snyssss
// @description 简单的自动翻页，以及更多附加功能，如：快捷翻页、抽楼检测、只看楼主、大召唤术

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/423546/NGA%20Auto%20Pagerize.user.js
// @updateURL https://update.greasyfork.org/scripts/423546/NGA%20Auto%20Pagerize.meta.js
// ==/UserScript==

((ui, n = {}, api = {}, uid) => {
  if (!ui) return;

  // KEY
  const ATTACHMENT_STYLE_ENABLE_KEY = "ATTACHMENT_STYLE_ENABLE";
  const PAGE_BUTTON_STYLE_ENABLE_KEY = "PAGE_BUTTON_STYLE_ENABLE_KEY";
  const HOTKEYS_ENABLE_KEY = "HOTKEYS_ENABLE_KEY";
  const FORUM_NAME_ENABLE_KEY = "FORUM_NAME_ENABLE_KEY";
  const POST_LOSS_DETECTION_KEY = "POSTS_LOSS_DETECTION_KEY";
  const AUTHOR_ONLY_KEY = "AUTHOR_ONLY_KEY";
  const AUTO_CHECK_IN_ENABLE_KEY = "AUTO_CHECK_IN_ENABLE_KEY";
  const AUTO_CHECK_IN_LAST_TIME_KEY = "AUTO_CHECK_IN_LAST_TIME_KEY";

  // 附件样式
  const attachmentStyleEnable =
    GM_getValue(ATTACHMENT_STYLE_ENABLE_KEY) || false;

  // 页码样式
  const pageButtonStyleEnable =
    GM_getValue(PAGE_BUTTON_STYLE_ENABLE_KEY) || false;

  // 快捷翻页
  const hotkeysEnable = GM_getValue(HOTKEYS_ENABLE_KEY) || false;

  // 版面名称
  const forumNameEnable = GM_getValue(FORUM_NAME_ENABLE_KEY) || false;

  // 抽楼检测
  const postLossDetectionEnable = GM_getValue(POST_LOSS_DETECTION_KEY) || false;

  // 只看楼主
  const authorOnlyEnable = GM_getValue(AUTHOR_ONLY_KEY) || false;

  // 自动签到
  const autoCheckInEnable = GM_getValue(AUTO_CHECK_IN_ENABLE_KEY) || false;

  // 自动签到时间
  const autoCheckInLastTime = GM_getValue(AUTO_CHECK_IN_LAST_TIME_KEY) || 0;

  // 自动签到 UA
  const autoCheckInUserAgent = "Nga_Official/80024(Android12)";

  // STYLE
  GM_addStyle(`
    .s-table-wrapper {
      max-height: 80vh;
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
    .s-table input:not([type]), .s-table input[type="text"] {
      margin: 0;
      box-sizing: border-box;
      height: 100%;
      width: 100%;
    }
    .s-input-wrapper {
      position: absolute;
      top: 6px;
      right: 6px;
      bottom: 6px;
      left: 6px;
    }
    .s-text-ellipsis {
      display: flex;
    }
    .s-text-ellipsis > * {
      flex: 1;
      width: 1px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s-button-group {
      margin: -.1em -.2em;
    }
  `);

  // 防抖
  const debounce = (func, delay = 500) => {
    let id;

    return (...args) => {
      clearTimeout(id);

      id = setTimeout(() => func(...args), delay);
    };
  };

  // 扩展菜单
  const enhanceMenu = (() => {
    // 大召唤术
    const summon = (() => {
      let window;

      return () => {
        // 标识
        const key = "SUMMON";

        // 标题
        const title = "大召唤术";

        // 内容
        const content = (() => {
          const c = document.createElement("DIV");

          c.innerHTML = `
            <div class="s-table-wrapper" style="width: 1000px; max-width: 95vw;">
              <table class="s-table forumbox">
                <thead>
                  <tr class="block_txt_c0">
                    <th class="c1" width="1">用户</th>
                    <th class="c2">内容</th>
                    <th class="c3" width="1">选择</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
            <div style="display: flex; margin-top: 10px;">
              <textarea readonly rows="3" style="flex: 1; overflow: auto;"></textarea>
              <div style="display: flex; flex-direction: column;">
                <button style="flex: 1;">复制</button>
                <button style="flex: 1;">全选/全不选</button>
              </div>
            </div>
          `;

          return c;
        })();

        // 选项改变事件
        const handleChange = (e) => {
          const items = content.querySelectorAll("INPUT");

          if (e) {
            const { checked } = e.target;

            const id = e.target.getAttribute("data-id");

            items.forEach((item) => {
              if (item.getAttribute("data-id") === id) {
                item.checked = checked;
              }
            });
          }

          const result = content.querySelector("TEXTAREA");

          const resultItems = [...items]
            .filter((item) => item.checked)
            .map((item) => item.getAttribute("data-name"))
            .filter((name, index, self) => self.indexOf(name) === index);

          result.value = resultItems.join("");
        };

        // 刷新列表
        const refresh = (() => {
          const container = content.querySelector("TBODY");

          const func = () => {
            container.innerHTML = "";

            Object.values(ui.postArg.data).forEach((item) => {
              const { pAid, contentC, uInfoC } = item;

              if (pAid < 0 || pAid === String(uid || 0)) {
                return;
              }

              if (uInfoC === undefined) {
                return;
              }

              const pName = (() => {
                const container =
                  uInfoC.closest("TR").querySelector(".posterInfoLine") ||
                  uInfoC;

                return container.querySelector(".author").innerText;
              })();

              const tc = document.createElement("TR");

              tc.className = `row${
                (container.querySelectorAll("TR").length % 2) + 1
              }`;

              tc.innerHTML = `
                <td class="c1">
                  <a href="/nuke.php?func=ucp&uid=${pAid}" class="b nobr">
                    [@${pName}]
                  </a>
                </td>
                <td class="c2">
                  <div class="filter-text-ellipsis">
                    <span title="${contentC.innerText}">
                      ${contentC.innerText}
                    </span>
                  </div>
                </td>
                <td class="c3">
                  <input type="checkbox" data-id="${pAid}" data-name="[@${pName}]" />
                </td>
              `;

              tc.querySelector("INPUT").addEventListener(
                "change",
                handleChange
              );

              container.appendChild(tc);
            });

            handleChange();
          };

          // 绑定事件
          (() => {
            const textarea = content.querySelector("textarea");

            textarea.addEventListener("click", () => {
              textarea.select();
            });

            const clipboard = content.querySelector("button:first-child");

            clipboard.addEventListener("click", () => {
              GM_setClipboard(textarea.value);
            });

            const selectAll = content.querySelector("button:last-child");

            selectAll.addEventListener("click", () => {
              const items = content.querySelectorAll("INPUT");

              const checked = [...items].some((item) => !item.checked);

              items.forEach((item) => {
                item.checked = checked;
              });

              handleChange();
            });
          })();

          return func;
        })();

        // 生成菜单
        ui.postBtn.d[key] = {
          n2: title,
          n3: title,
          on: () => {
            if (window === undefined) {
              window = ui.createCommmonWindow();
            }

            refresh();

            window._.addContent(null);
            window._.addTitle(title);
            window._.addContent(content);
            window._.show();
          },
          ck: () => true,
        };

        // 写入系统菜单
        if (ui.postBtn.all["扩展"].indexOf(key) < 0) {
          ui.postBtn.all["扩展"].push(key);
        }
      };
    })();

    return () => {
      if (ui.postBtn) {
        ui.postBtn.all["扩展"] = ui.postBtn.all["扩展"] || [];

        // 大召唤术
        summon();
      }
    };
  })();

  // 加载脚本
  (() => {
    const hookFunction = (object, functionName, callback) => {
      ((originalFunction) => {
        object[functionName] = function () {
          const returnValue = originalFunction.apply(this, arguments);

          callback.apply(this, [returnValue, originalFunction, arguments]);

          return returnValue;
        };
      })(object[functionName]);
    };

    const hooked = {
      autoPagerize: false,
      uniqueTopic: false,
      attachmentStyle: false,
      pageButtonStyle: false,
      hotkeys: false,
      forumName: false,
      postLossDetection: false,
      postLossDetectionTopic: false,
      authorOnly: false,
    };

    const hook = () => {
      // 翻页
      const loadReadHidden = (() => {
        const THREAD_MAX_PAGE = 500;

        // const delay = (interval) =>
        //   new Promise((resolve) => setTimeout(resolve, interval));

        // const retry = async (fn, retriesLeft = 10, interval = 160) => {
        //   try {
        //     return await fn();
        //   } catch (error) {
        //     await delay(interval);

        //     if (retriesLeft > 0) {
        //       return await retry(fn, retriesLeft - 1, interval);
        //     }
        //   }
        // };

        return (p, opt = 1) => {
          // if (ui.loadReadHidden) {
          // retry(() => {
          // if (ui.loadReadHidden.lock) {
          //   throw new Error();
          // }

          if (__PAGE) {
            const max = __PAGE[1];
            const cur = __PAGE[2];

            if (location.pathname === "/thread.php") {
              if (p > THREAD_MAX_PAGE) {
                return;
              }

              if (p === 0 && opt === 2 && cur === THREAD_MAX_PAGE) {
                return;
              }
            }

            if (p < 1 && opt === 1) {
              return;
            }

            if (p > max && max > 0) {
              p = max;
            }

            if (p === cur) {
              return;
            }

            // ui.loadReadHidden(p, opt);

            // 临时的处理
            const anchor = (() => {
              if (opt === 2) {
                return document.querySelector('[title="加载下一页"]');
              }

              if (opt === 4) {
                return document.querySelector('[title="加载上一页"]');
              }

              // 获取当前页面参数
              const params = new URLSearchParams(location.search);

              // 替换 page 参数
              if (p > 1) {
                params.set("page", p);
              } else {
                params.delete("page");
              }

              // 计算目标 URL
              const target = location.pathname + "?" + params.toString();

              // 返回目标 URL
              return document.querySelector(`A[href="${target}"]`);
            })();

            if (anchor) {
              anchor.click();
            }
          }
          // });
          // }
        };
      })();

      // 自动翻页
      if (hooked.autoPagerize === false) {
        if (ui.pageBtn) {
          const execute = (() => {
            const observer = new IntersectionObserver((entries) => {
              if (entries.find((item) => item.isIntersecting)) {
                if (
                  location.pathname === "/thread.php" &&
                  location.search.indexOf("authorid") > 0
                ) {
                  return;
                }

                loadReadHidden(0, 2);
              }
            });

            return debounce(() => {
              const anchor = document.querySelector('[title="加载下一页"]');

              if (anchor) {
                observer.observe(anchor);
              } else {
                observer.disconnect();
              }
            }, 2000);
          })();

          hookFunction(ui, "pageBtn", execute);

          hooked.autoPagerize = true;

          execute();
        }
      }

      // 移除重复内容
      if (hooked.uniqueTopic === false) {
        if (ui.topicArg) {
          const execute = () => {
            if (location.search.indexOf("searchpost=1") > 0) {
              return;
            }

            ui.topicArg.data = ui.topicArg.data.reduce(
              (accumulator, currentValue) => {
                if (document.contains(currentValue[0])) {
                  const index = accumulator.findIndex(
                    (item) => item[8] === currentValue[8]
                  );

                  if (index < 0) {
                    return [...accumulator, currentValue];
                  }

                  currentValue[0].closest("TBODY").style.display = "none";
                }

                return accumulator;
              },
              []
            );
          };

          hookFunction(ui.topicArg, "loadAll", execute);

          hooked.uniqueTopic = true;

          execute();
        }
      }

      // 附件样式
      if (hooked.attachmentStyle === false && attachmentStyleEnable) {
        if (ui.topicArg) {
          const execute = () => {
            const elements =
              document.querySelectorAll('[title="主题中有附件"]');

            elements.forEach((element) => {
              element.className = "block_txt white nobr vertmod";
              element.style = "background-color: #BD7E6D";
              element.innerHTML = "附件";
            });
          };

          hookFunction(ui.topicArg, "loadAll", execute);

          hooked.attachmentStyle = true;

          execute();
        }
      }

      // 页码样式
      if (hooked.pageButtonStyle === false && pageButtonStyleEnable) {
        const execute = () => {
          if (ui.pageBtn) {
            const elements = document.querySelectorAll('[name="pageball"] A');

            elements.forEach((element) => {
              const matches = element.innerHTML.match(/\d+/);

              if (matches) {
                element.innerHTML = `&nbsp;${matches[0]}&nbsp;`;
              }
            });
          }
        };

        hookFunction(ui, "pageBtn", execute);

        hooked.pageButtonStyle = true;

        execute();
      }

      // 快捷翻页
      if (hooked.hotkeys === false && hotkeysEnable) {
        const execute = () => {
          document.addEventListener("keydown", ({ key, ctrlKey }) => {
            if (__PAGE) {
              const max = __PAGE[1];
              // const cur = __PAGE[2];

              const activeElement = document.activeElement;

              if (activeElement === null || activeElement.tagName !== "BODY") {
                return;
              }

              if (key === "ArrowLeft" && ctrlKey) {
                loadReadHidden(1);
                return;
              }

              if (key === "ArrowRight" && ctrlKey) {
                loadReadHidden(max);
                return;
              }

              if (key === "ArrowLeft") {
                // document.getElementById("m_pbtntop").scrollIntoView();

                loadReadHidden(0, 4);
                return;
              }

              if (key === "ArrowRight") {
                // document.getElementById("m_pbtnbtm").scrollIntoView();

                loadReadHidden(0, 2);
                return;
              }
            }
          });
        };

        hooked.hotkeys = true;

        execute();
      }

      // 版面名称
      if (hooked.forumName === false && forumNameEnable) {
        if (ui.topicArg) {
          if (!n.doRequest || !api.indexForumList) {
            return;
          }

          class Queue {
            execute(task) {
              task(this.data).finally(() => {
                if (this.waitingQueue.length) {
                  const next = this.waitingQueue.shift();

                  this.execute(next);
                } else {
                  this.isRunning = false;
                }
              });
            }

            enqueue(task) {
              if (this.initialized === false) {
                this.initialized = true;
                this.init();
              }

              if (this.isRunning) {
                this.waitingQueue.push(task);
              } else {
                this.isRunning = true;

                this.execute(task);
              }
            }

            init() {
              this.enqueue(async () => {
                this.data = await new Promise((resolve) => {
                  try {
                    n.doRequest({
                      u: api.indexForumList(),
                      f: function (res) {
                        if (res.data) {
                          resolve(res.data[0]);
                        } else {
                          resolve({});
                        }
                      },
                    });
                  } catch (e) {
                    resolve({});
                  }
                });
              });
            }

            constructor() {
              this.waitingQueue = [];
              this.isRunning = false;

              this.initialized = false;
            }
          }

          const deepSearch = (content = {}, fid = 0) => {
            const children = Object.values(content);

            for (let i = 0; i < children.length; i += 1) {
              const item = children[i];

              if (item.fid === fid) {
                return item;
              }

              if (item.content) {
                const result = deepSearch(item.content || [], fid);

                if (result !== null) {
                  return result;
                }
              }
            }

            return null;
          };

          const queue = new Queue();

          const execute = () => {
            if (location.search.indexOf("authorid") < 0) {
              return;
            }

            ui.topicArg.data.forEach((item) => {
              const parentNode = item[1].closest(".c2");

              if (parentNode.querySelector(".titleadd2") === null) {
                const fid = item[7];

                queue.enqueue(async (data) => {
                  const result = deepSearch(data.all, parseInt(fid, 10));

                  if (result) {
                    const anchor = parentNode.querySelector(".topic_content");

                    const title = document.createElement("SPAN");

                    title.className = "titleadd2";
                    title.innerHTML = `<a href="/thread.php?fid=${fid}" class="silver">[${result.name}]</a>`;

                    if (anchor) {
                      anchor.before(title);
                    } else {
                      parentNode.append(title);
                    }
                  }
                });
              }
            });
          };

          hookFunction(ui.topicArg, "loadAll", execute);

          hooked.forumName = true;

          execute();
        }
      }

      // 抽楼检测
      if (postLossDetectionEnable) {
        const cache = {};
        const action = "&action=modify";

        const fetchData = async (key, tid, pid, extraArg = "") => {
          if (cache[key] === undefined) {
            const url = `/post.php?lite=js&tid=${tid}&pid=${pid}${extraArg}`;

            cache[key] = await new Promise((resolve) => {
              fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                  const reader = new FileReader();

                  reader.onload = async () => {
                    const text = reader.result;
                    const result = JSON.parse(
                      text.replace("window.script_muti_get_var_store=", "")
                    );

                    const { data, error } = result;

                    if (error) {
                      resolve(error[0]);
                      return;
                    }

                    if (data && data["post_type"] & 2) {
                      resolve("只有作者/版主可见");
                      return;
                    }

                    if (url.indexOf(action) < 0) {
                      resolve(await fetchData(key, tid, pid, action));
                      return;
                    }

                    resolve("");
                  };

                  reader.readAsText(blob, "GBK");
                })
                .catch(() => {
                  resolve("");
                });
            });
          }

          return cache[key];
        };

        if (hooked.postLossDetection === false) {
          if (ui.postArg && uid) {
            const execute = debounce(() => {
              if (ui.postArg === undefined) {
                return;
              }

              Object.values(ui.postArg.data).forEach(
                async ({ tid, pid, pAid, pInfoC }) => {
                  if (parseInt(pAid, 10) !== uid) {
                    return;
                  }

                  const key = `${tid}#${pid}`;

                  const error = await fetchData(key, tid, pid);

                  if (error) {
                    if (pInfoC) {
                      if (pInfoC.querySelector(`[id="${key}"]`)) {
                        return;
                      }

                      const node = document.createElement("SPAN");

                      node.id = key;
                      node.className =
                        "small_colored_text_btn block_txt_c0 stxt";
                      node.style = "margin-left: 0.4em; line-height: inherit;";
                      node.innerHTML = error;

                      pInfoC.prepend(node);
                    }
                  }
                }
              );
            }, 2000);

            hookFunction(ui, "loadReadHidden", execute);

            hooked.postLossDetection = true;

            execute();
          }
        }

        if (hooked.postLossDetectionTopic === false) {
          if (ui.topicArg && uid) {
            const execute = debounce(() => {
              Object.values(ui.topicArg.data).forEach(async (item) => {
                const tid = item[8];
                const pid = item[9] || 0;

                const author = item[2];
                const authorID =
                  parseInt(
                    author.getAttribute("href").match(/uid=(\S+)/)[1],
                    10
                  ) || 0;

                const postDate = item[12];

                if (authorID !== uid) {
                  return;
                }

                if (tid && postDate) {
                  const key = `${tid}#${pid}`;

                  const error = await fetchData(key, tid, pid);

                  if (error) {
                    const node = document.createElement("SPAN");

                    node.id = key;
                    node.className = "small_colored_text_btn block_txt_c0";
                    node.innerHTML = error;

                    const anchor = author.parentNode;

                    anchor.innerHTML = "";
                    anchor.appendChild(node);
                  }
                }
              });
            }, 2000);

            hookFunction(ui.topicArg, "loadAll", execute);

            hooked.postLossDetectionTopic = true;

            execute();
          }
        }
      }

      // 只看楼主
      if (hooked.authorOnly === false && authorOnlyEnable) {
        if (ui.topicBtn) {
          const key = 99;
          const execute = () => {
            if (ui.topicBtn.d[key]) {
              return;
            }

            const anchor = document.querySelector("#postbtop");

            if (anchor) {
              ui.topicBtn.d[key] = {
                n1: "楼主",
                n2: "只看楼主",
                on: (_, { tid }) => {
                  const api = `/read.php?tid=${tid}`;

                  const params = new URLSearchParams(location.search);

                  // 如果已经是匿名的只看楼主状态，则直接跳转原始页面
                  if (params.get("opt")) {
                    location.href = api;
                    return;
                  }

                  // 请求获取顶楼 UID
                  fetch(api)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const getLastIndex = (content, position) => {
                        if (position >= 0) {
                          let nextIndex = position + 1;

                          while (nextIndex < content.length) {
                            if (content[nextIndex] === "}") {
                              return nextIndex;
                            }

                            if (content[nextIndex] === "{") {
                              nextIndex = getLastIndex(content, nextIndex);

                              if (nextIndex < 0) {
                                break;
                              }
                            }

                            nextIndex = nextIndex + 1;
                          }
                        }

                        return -1;
                      };

                      const reader = new FileReader();

                      reader.onload = async () => {
                        const parser = new DOMParser();

                        const doc = parser.parseFromString(
                          reader.result,
                          "text/html"
                        );

                        // 验证帖子正常
                        const verify = doc.querySelector("#m_posts");

                        if (verify) {
                          // 取得顶楼 UID
                          const uid = (() => {
                            const ele = doc.querySelector("#postauthor0");

                            if (ele) {
                              const res = ele
                                .getAttribute("href")
                                .match(/uid=(\S+)/);

                              if (res) {
                                return res[1];
                              }
                            }

                            return 0;
                          })();

                          // 匿名贴
                          if (uid <= 0) {
                            location.href = `${api}&opt=512`;
                            return;
                          }

                          // 判断 UID 是否一致
                          if (uid !== params.get("authorid")) {
                            location.href = `${api}&authorid=${uid}`;
                            return;
                          }

                          // 跳转原始页面
                          location.href = api;
                        }
                      };

                      reader.readAsText(blob, "GBK");
                    });
                },
              };

              ui.topicBtn.def.push(key);

              ui.topicBtn.load(anchor);
            }
          };

          hookFunction(ui.topicBtn, "load", execute);

          hooked.authorOnly = true;

          execute();
        }
      }
    };

    hookFunction(ui, "eval", () => {
      enhanceMenu();

      if (Object.values(hooked).findIndex((item) => item === false) < 0) {
        return;
      }

      hook();
    });

    hook();

    enhanceMenu();
  })();

  // 加载菜单项
  (() => {
    if (attachmentStyleEnable) {
      GM_registerMenuCommand("附件样式：启用", () => {
        GM_setValue(ATTACHMENT_STYLE_ENABLE_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("附件样式：禁用", () => {
        GM_setValue(ATTACHMENT_STYLE_ENABLE_KEY, true);
        location.reload();
      });
    }

    if (pageButtonStyleEnable) {
      GM_registerMenuCommand("页码样式：启用", () => {
        GM_setValue(PAGE_BUTTON_STYLE_ENABLE_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("页码样式：禁用", () => {
        GM_setValue(PAGE_BUTTON_STYLE_ENABLE_KEY, true);
        location.reload();
      });
    }

    if (hotkeysEnable) {
      GM_registerMenuCommand("快捷翻页：启用", () => {
        GM_setValue(HOTKEYS_ENABLE_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("快捷翻页：禁用", () => {
        GM_setValue(HOTKEYS_ENABLE_KEY, true);
        location.reload();
      });
    }

    if (forumNameEnable) {
      GM_registerMenuCommand("版面名称：启用", () => {
        GM_setValue(FORUM_NAME_ENABLE_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("版面名称：禁用", () => {
        GM_setValue(FORUM_NAME_ENABLE_KEY, true);
        location.reload();
      });
    }

    if (postLossDetectionEnable) {
      GM_registerMenuCommand("抽楼检测：启用", () => {
        GM_setValue(POST_LOSS_DETECTION_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("抽楼检测：禁用", () => {
        GM_setValue(POST_LOSS_DETECTION_KEY, true);
        location.reload();
      });
    }

    if (authorOnlyEnable) {
      GM_registerMenuCommand("只看楼主：启用", () => {
        GM_setValue(AUTHOR_ONLY_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("只看楼主：禁用", () => {
        GM_setValue(AUTHOR_ONLY_KEY, true);
        location.reload();
      });
    }

    if (autoCheckInEnable) {
      GM_registerMenuCommand("自动签到：启用", () => {
        GM_setValue(AUTO_CHECK_IN_ENABLE_KEY, false);
        GM_setValue(AUTO_CHECK_IN_LAST_TIME_KEY, 0);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("自动签到：禁用", () => {
        GM_setValue(AUTO_CHECK_IN_ENABLE_KEY, true);
        location.reload();
      });
    }
  })();

  // 自动签到
  if (autoCheckInEnable && uid) {
    const today = new Date();

    const lastTime = new Date(autoCheckInLastTime);

    const isToday =
      lastTime.getDate() === today.getDate() &&
      lastTime.getMonth() === today.getMonth() &&
      lastTime.getFullYear() === today.getFullYear();

    if (isToday === false) {
      fetch(`/nuke.php?__lib=check_in&__act=check_in&lite=js`, {
        method: "POST",
        headers: {
          "X-User-Agent": autoCheckInUserAgent,
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();

          reader.onload = () => {
            const text = reader.result;
            const result = JSON.parse(
              text.replace("window.script_muti_get_var_store=", "")
            );

            const { data, error } = result;

            if (data || error) {
              alert((data || error)[0]);
            }

            GM_setValue(AUTO_CHECK_IN_LAST_TIME_KEY, today.getTime());
          };

          reader.readAsText(blob, "GBK");
        });
    }
  }
})(commonui, __NUKE, __API, __CURRENT_UID);
