// ==UserScript==
// @name        NGA Smiles Manager
// @namespace   https://greasyfork.org/users/263018
// @version     1.3.0
// @author      snyssss
// @description 表情管理器，支持快速添加表情包，自动同步表情包，隐藏系统表情，显示最近表情

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addValueChangeListener
// @grant       GM_registerMenuCommand

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/449822/NGA%20Smiles%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/449822/NGA%20Smiles%20Manager.meta.js
// ==/UserScript==

((ui, poster, smiles, basePath) => {
  if (!ui) return;
  if (!poster) return;
  if (!smiles) return;
  if (!basePath) return;

  // KEY
  const USER_AGENT_KEY = "USER_AGENT_KEY";

  // User Agent
  const USER_AGENT = (() => {
    const data = GM_getValue(USER_AGENT_KEY) || "Nga_Official";

    GM_registerMenuCommand(`修改UA：${data}`, () => {
      const value = prompt("修改UA", data);

      if (value) {
        GM_setValue(USER_AGENT_KEY, value);

        location.reload();
      }
    });

    return data;
  })();

  // 简单的统一请求
  const request = (url, config = {}) =>
    fetch(url, {
      headers: {
        "X-User-Agent": USER_AGENT,
      },
      ...config,
    });

  // 数据操作
  const manager = (() => {
    const KEY = `NGA_SMILES_MANAGER`;

    const RECENT_KEY = `NGA_SMILES_RECENT`;

    const data = {};

    const fetchData = (pid) =>
      new Promise((resolve, reject) => {
        const api = `/read.php?pid=${pid}`;

        request(api)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = async () => {
              const parser = new DOMParser();

              const doc = parser.parseFromString(reader.result, "text/html");

              const verify = doc.querySelector("#m_posts");

              if (verify) {
                const subject = doc.querySelector("#postsubject0").innerHTML;

                const content = doc.querySelector("#postcontent0").innerHTML;

                const items = content.match(/(?<=\[img\])(.+?)(?=\[\/img\])/g);

                if (items.length) {
                  resolve({
                    name: subject,
                    items,
                  });
                } else {
                  reject("图楼内容有误");
                }
              } else {
                reject(doc.title);
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject("服务器异常");
          });
      });

    const assign = (next) => {
      Object.getOwnPropertyNames(data).forEach((property) => {
        delete data[property];
      });

      Object.getOwnPropertyNames(next).forEach((property) => {
        data[property] = next[property];
      });
    };

    const save = () => {
      GM_setValue(KEY, data);
    };

    const load = () => {
      assign(
        GM_getValue(KEY) || {
          [0]: {
            syncInterval: 3600,
            hiddenSmiles: [],
            showRecent: 0,
          },
        }
      );
    };

    const settings = () => {
      if (Object.keys(data).length < 1) {
        load();
      }

      return data[0];
    };

    const updateSettings = (values) => {
      const entity = settings();

      Object.getOwnPropertyNames(values).forEach((property) => {
        entity[property] = values[property];
      });

      save();
    };

    const list = () => {
      if (Object.keys(data).length < 1) {
        load();
      }

      return Object.keys(data)
        .filter((key) => key > 0)
        .reduce((root, key) => {
          return [...root, data[key]];
        }, []);
    };

    const get = (pid) => {
      return list().find((item) => item.pid === pid);
    };

    const set = (pid, values) => {
      const entity = get(pid);

      if (entity) {
        Object.getOwnPropertyNames(values).forEach((property) => {
          entity[property] = values[property];
        });
      } else {
        const index = Math.max(...Object.keys(data), 0) + 1;

        data[index] = {
          pid,
          name: `#${pid}`,
          error: "",
          enabled: true,
          syncDate: null,
          ...values,
        };
      }

      save();
    };

    const sync = async (pid) => {
      const { syncInterval } = settings();

      const syncDate = new Date().getTime();

      const entity = get(pid);

      if (
        syncInterval > 0 &&
        entity &&
        entity.syncDate + syncInterval * 1000 > syncDate
      ) {
        return false;
      }

      try {
        const { name, items } = await fetchData(pid);

        set(pid, {
          name: name || `#${pid}`,
          error: "",
          syncDate,
        });

        GM_setValue(pid, items);
      } catch (error) {
        set(pid, {
          error,
          syncDate,
        });

        return false;
      }

      return true;
    };

    const add = async (url) => {
      const params = new URLSearchParams(url.substring(url.indexOf("?")));

      const pid = params.get("pid");

      if (pid === null) {
        alert("图楼地址有误");
        return false;
      }

      await sync(pid);

      return true;
    };

    const remove = (pid) => {
      GM_deleteValue(pid);

      Object.keys(data).forEach((key) => {
        if (data[key].pid === pid) {
          delete data[key];
        }
      });

      save();
    };

    const listRecent = () => {
      return GM_getValue(RECENT_KEY) || [];
    };

    const pushRecent = (value) => {
      const { showRecent } = settings();

      const list = listRecent();

      GM_setValue(
        RECENT_KEY,
        [value, ...list.filter((item) => item !== value)].slice(0, showRecent)
      );
    };

    GM_addValueChangeListener(KEY, function (_, prev, next) {
      assign(next);
    });

    return {
      add,
      set,
      sync,
      remove,
      list,
      listRecent,
      pushRecent,
      settings,
      updateSettings,
    };
  })();

  // STYLE
  GM_addStyle(`
      .s-user-info-container:not(:hover) .ah {
        display: none !important;
      }
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

  // UI
  const u = (() => {
    const modules = {};

    const tabContainer = (() => {
      const c = document.createElement("div");

      c.className = "w100";
      c.innerHTML = `
            <div class="right_" style="margin-bottom: 5px;">
                <table class="stdbtn" cellspacing="0">
                    <tbody>
                        <tr></tr>
                    </tbody>
                </table>
            </div>
            <div class="clear"></div>
            `;

      return c;
    })();

    const tabPanelContainer = (() => {
      const c = document.createElement("div");

      c.style = "width: 800px;";

      return c;
    })();

    const content = (() => {
      const c = document.createElement("div");

      c.append(tabContainer);
      c.append(tabPanelContainer);

      return c;
    })();

    const addModule = (() => {
      const tc = tabContainer.getElementsByTagName("tr")[0];
      const cc = tabPanelContainer;

      return (module) => {
        const tabBox = document.createElement("td");

        tabBox.innerHTML = `<a href="javascript:void(0)" class="nobr silver">${module.name}</a>`;

        const tab = tabBox.childNodes[0];

        const toggle = () => {
          Object.values(modules).forEach((item) => {
            if (item.tab === tab) {
              item.tab.className = "nobr";
              item.content.style = "display: block";
              item.refresh();
            } else {
              item.tab.className = "nobr silver";
              item.content.style = "display: none";
            }
          });
        };

        tc.append(tabBox);
        cc.append(module.content);

        tab.onclick = toggle;

        modules[module.name] = {
          ...module,
          tab,
          toggle,
        };

        return modules[module.name];
      };
    })();

    return {
      content,
      modules,
      addModule,
    };
  })();

  // 列表
  (() => {
    const content = (() => {
      const c = document.createElement("div");

      c.style = "display: none";
      c.innerHTML = `
          <div class="s-table-wrapper">
            <table class="s-table forumbox">
              <thead>
                <tr class="block_txt_c0">
                  <th class="c1">标题</th>
                  <th class="c2">自定义标题</th>
                  <th class="c3">异常信息</th>
                  <th class="c4" width="1">同步时间</th>
                  <th class="c5" width="1">是否启用</th>
                  <th class="c6" width="1">操作</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        `;

      return c;
    })();

    const refresh = (() => {
      const container = content.getElementsByTagName("tbody")[0];

      const func = () => {
        container.innerHTML = "";

        Object.values(manager.list()).forEach((item) => {
          const { pid, name, label, error, enabled, syncDate } = item;

          const tc = document.createElement("tr");

          tc.className = `row${
            (container.querySelectorAll("TR").length % 2) + 1
          }`;

          tc.innerHTML = `
              <td class="c1">
                  <a href="/read.php?pid=${pid}" class="b nobr">${name}</a>
              </td>
              <td class="c2">
                  <div class="s-input-wrapper">
                    <input type="text" value="${label || ""}" maxlength="20" />
                  </div>
              </td>
              <td class="c3">
                  <span class="nobr">${error}</span>
              </td>
              <td class="c4">
                  <span class="nobr">${ui.time2dis(syncDate / 1000)}</span>
              </td>
              <td class="c5">
                  <div style="text-align: center;">
                      <input type="checkbox" ${
                        enabled ? `checked="checked"` : ""
                      } />
                  </div>
              </td>
              <td class="c6">
                  <div class="s-button-group">
                      <button>同步</button>
                      <button>删除</button>
                  </div>
              </td>
              `;

          const labelInput = tc.querySelector(`INPUT[type="text"]`);

          if (labelInput) {
            const save = () => {
              manager.set(pid, {
                label: labelInput.value,
              });
            };

            labelInput.onblur = save;
          }

          const enabledElement = tc.querySelector(`INPUT[type="checkbox"]`);

          if (enabledElement) {
            const save = () => {
              manager.set(pid, {
                enabled: enabledElement.checked ? 1 : 0,
              });
            };

            enabledElement.onchange = save;
          }

          const actions = tc.getElementsByTagName("button");

          actions[0].onclick = async () => {
            await manager.sync(pid);

            refresh();
          };

          actions[1].onclick = () => {
            if (confirm("是否确认?")) {
              manager.remove(pid);

              refresh();
            }
          };

          container.appendChild(tc);
        });

        {
          const tc = document.createElement("tr");

          tc.className = `row${
            (container.querySelectorAll("TR").length % 2) + 1
          }`;

          tc.innerHTML = `
                <td class="c1" colspan="4">
                    <div class="s-input-wrapper">
                      <input value="" />
                    </div>
                </td>
                <td class="c5">
                    <div class="s-button-group">
                      <button>添加</button>
                    </div>
                </td>
              `;

          const inputElement = tc.querySelector("INPUT");
          const actions = tc.getElementsByTagName("button");

          actions[0].onclick = async () => {
            if (inputElement.value) {
              if (await manager.add(inputElement.value)) {
                refresh();
              }
            }
          };

          container.appendChild(tc);
        }
      };

      return func;
    })();

    u.addModule({
      name: "列表",
      content,
      refresh,
    });
  })();

  // 系统
  (() => {
    const content = (() => {
      const c = document.createElement("div");

      c.style = "display: none";
      c.innerHTML = `
          <div class="s-table-wrapper">
            <table class="s-table forumbox">
              <thead>
                <tr class="block_txt_c0">
                  <th class="c1">标题</th>
                  <th class="c2" width="1">是否启用</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        `;

      return c;
    })();

    const refresh = (() => {
      const container = content.getElementsByTagName("tbody")[0];

      const func = () => {
        container.innerHTML = "";

        const hiddenSmiles = manager.settings().hiddenSmiles || [];

        Object.values(smiles).forEach((item) => {
          const { _______name: name } = item;

          if (name) {
            const tc = document.createElement("tr");

            tc.className = `row${
              (container.querySelectorAll("TR").length % 2) + 1
            }`;

            tc.innerHTML = `
                <td class="c1">
                    <span class="nobr">${name}</span>
                </td>
                <td class="c2">
                    <div style="text-align: center;">
                        <input type="checkbox" ${
                          hiddenSmiles.includes(name) ? "" : `checked="checked"`
                        } />
                    </div>
                </td>
                `;

            const enabledElement = tc.querySelector(`INPUT[type="checkbox"]`);

            const save = () => {
              manager.updateSettings({
                hiddenSmiles: hiddenSmiles
                  .filter((item) => item !== name)
                  .concat(enabledElement.checked ? [] : [name]),
              });

              refresh();
            };

            enabledElement.onchange = save;

            container.appendChild(tc);
          }
        });
      };

      return func;
    })();

    u.addModule({
      name: "系统",
      content,
      refresh,
    });
  })();

  // 通用设置
  (() => {
    const content = (() => {
      const c = document.createElement("div");

      c.style = "display: none";

      return c;
    })();

    const refresh = (() => {
      const container = content;

      const func = () => {
        container.innerHTML = "";

        // 自动同步
        {
          const syncInterval = manager.settings().syncInterval || 0;

          const tc = document.createElement("div");

          tc.innerHTML += `
                <div>自动同步设置</div>
                <div></div>
              `;

          [
            {
              label: "1小时",
              value: 3600,
            },
            {
              label: "1天",
              value: 3600 * 24,
            },
            {
              label: "从不",
              value: 0,
            },
          ].forEach(({ label, value }) => {
            const ele = document.createElement("SPAN");

            ele.innerHTML += `
                  <label style="cursor: pointer;">
                      <input type="radio" name="syncInterval" ${
                        syncInterval === value && "checked"
                      }>${label}
                  </label>
                `;

            const items = ele.querySelector("input");

            items.onchange = () => {
              if (items.checked) {
                manager.updateSettings({
                  syncInterval: value,
                });
              }
            };

            tc.querySelectorAll("div")[1].append(ele);
          });

          container.appendChild(tc);
        }

        // 显示最近表情
        {
          const showRecent = manager.settings().showRecent || 0;

          const tc = document.createElement("div");

          tc.innerHTML += `
              <br/>
              <div>显示最近表情</div>
              <div></div>
              `;

          [
            {
              label: "0",
              value: 0,
            },
            {
              label: "10",
              value: 10,
            },
            {
              label: "20",
              value: 20,
            },
            {
              label: "50",
              value: 50,
            },
          ].forEach(({ label, value }) => {
            const ele = document.createElement("SPAN");

            ele.innerHTML += `
                  <label style="cursor: pointer;">
                      <input type="radio" name="showRecent" ${
                        showRecent === value && "checked"
                      }>${label}
                  </label>
                `;

            const items = ele.querySelector("input");

            items.onchange = () => {
              if (items.checked) {
                manager.updateSettings({
                  showRecent: value,
                });
              }
            };

            tc.querySelectorAll("div")[1].append(ele);
          });

          container.appendChild(tc);
        }
      };

      return func;
    })();

    u.addModule({
      name: "设置",
      content,
      refresh,
    });
  })();

  // 增加菜单项
  (() => {
    const title = "表情管理";

    let window;

    ui.mainMenu.addItemOnTheFly(title, null, () => {
      if (window === undefined) {
        window = ui.createCommmonWindow();
      }

      u.modules["列表"].toggle();

      window._.addContent(null);
      window._.addTitle(title);
      window._.addContent(u.content);
      window._.show();
    });
  })();

  // 判断是否为系统表情
  const isSystemSmile = (value) => {
    const result = value.match(/\[s:(.{1,10}?)\]/);

    if (result) {
      const [group, item] = parseInt(result[1], 10)
        ? [0, result[1]]
        : result[1].split(":");

      if (smiles[group || 0] && smiles[group || 0][item]) {
        return `${basePath}/post/smile/${smiles[group || 0][item]}`;
      }
    }

    return null;
  };

  // 加载表情
  const loadSmile = (content, list) => {
    const { correctAttachUrl } = ui;

    content.innerHTML = ``;

    list.forEach((item) => {
      const smile = document.createElement("IMG");

      const path = isSystemSmile(item);

      if (path) {
        smile.src = path;
        smile.onclick = () => {
          poster.selectSmilesw._.hide();
          poster.addText(item);
        };
      } else {
        smile.src = item.indexOf("http") < 0 ? correctAttachUrl(item) : item;
        smile.style = "max-height: 200px";
        smile.onclick = () => {
          poster.selectSmilesw._.hide();
          poster.addText(`[img]${item}[/img]`);

          manager.pushRecent(item);
        };
      }

      content.appendChild(smile);
    });
  };

  // 加载表情
  const loadSmiles = (loaded) => {
    if (loaded) return;

    const tabs = poster.selectSmilesw._.__c.firstElementChild;
    const contents = poster.selectSmilesw._.__c.lastElementChild;

    const hiddenSmiles = manager.settings().hiddenSmiles || [];

    [...tabs.querySelectorAll("button.block_txt_big")].forEach((item) => {
      const name = item.innerHTML;

      if (hiddenSmiles.includes(name)) {
        item.style.display = "none";
      }
    });

    manager.list().forEach((item) => {
      const { pid, name, label, enabled } = item;

      if (enabled) {
        const tab = document.createElement("BUTTON");
        const content = document.createElement("DIV");

        tab.className = "block_txt_big";
        tab.innerText = label || name;
        tab.onclick = async () => {
          tabs.firstChild.innerHTML = ``;

          contents.childNodes.forEach((item) => {
            if (item !== content) {
              item.style.display = "none";
            } else {
              item.style.display = "";
            }
          });

          if (content.childNodes.length === 0) {
            await manager.sync(pid);

            const list = GM_getValue(pid) || [];

            loadSmile(content, list);
          }
        };

        tabs.appendChild(tab);
        contents.appendChild(content);
      }
    });
  };

  // 加载最近表情
  const loadRecent = () => {
    const list = manager.listRecent();

    if (list.length) {
      const contents = poster.selectSmilesw._.__c.lastElementChild;

      const recentElementId = `smile_recent`;
      const recentElement =
        contents.querySelector(`[id="smile_recent"]`) ||
        document.createElement("DIV");

      if (!recentElement.id) {
        recentElement.id = recentElementId;

        contents.appendChild(recentElement);
      }

      contents.childNodes.forEach((item) => {
        if (item !== recentElement) {
          item.style.display = "none";
        } else {
          item.style.display = "";
        }
      });

      loadSmile(recentElement, list);
    }
  };

  // 扩展菜单
  const enhanceMenu = () => {
    // 标识
    const key = "SMILES_MANAGER_IMPORT";

    // 生成菜单
    if (ui.postBtn) {
      ui.postBtn.d[key] = {
        n2: "导入表情",
        n3: "导入表情",
        on: async (_, { pid }) => {
          const result = await manager.sync(pid);

          if (result) {
            alert("导入成功");
          }
        },
        ck: ({ pid }) => {
          return pid > 0;
        },
      };

      // 写入系统菜单
      ui.postBtn.all["扩展"] = ui.postBtn.all["扩展"] || [];

      if (ui.postBtn.all["扩展"].indexOf(key) < 0) {
        ui.postBtn.all["扩展"].push(key);
      }
    }
  };

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

    hookFunction(poster, "selectSmiles", (returnValue) => {
      loadSmiles(returnValue);
      loadRecent();
    });

    hookFunction(poster, "addText", (returnValue, _, arguments) => {
      const path = isSystemSmile(arguments[0]);

      if (path) {
        manager.pushRecent(arguments[0]);
      }
    });

    hookFunction(ui, "eval", enhanceMenu);

    enhanceMenu();
  })();
})(commonui, postfunc, ubbcode.smiles, __IMGPATH);
