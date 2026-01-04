// ==UserScript==
// @name        NGA Follow Support
// @namespace   https://greasyfork.org/users/263018
// @version     1.3.5
// @author      snyssss
// @description 同步客户端关注功能

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addValueChangeListener
// @grant       GM_registerMenuCommand

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422270/NGA%20Follow%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/422270/NGA%20Follow%20Support.meta.js
// ==/UserScript==

((ui, self) => {
  if (!ui || !self) return;

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

  ui.sn = ui.sn || {};
  ui.sn.userInfo = ui.sn.userInfo || {};

  ((info) => {
    // 用户信息
    class UserInfo {
      execute(task) {
        task().finally(() => {
          if (this.waitingQueue.length) {
            const next = this.waitingQueue.shift();

            this.execute(next);
          } else {
            this.isRunning = false;
          }
        });
      }

      enqueue(task) {
        if (this.isRunning) {
          this.waitingQueue.push(task);
        } else {
          this.isRunning = true;

          this.execute(task);
        }
      }

      rearrange() {
        if (this.data) {
          const list = Object.values(this.children);

          for (let i = 0; i < list.length; i++) {
            if (list[i].source === undefined) {
              list[i].create(this.data);
            }

            Object.entries(this.container).forEach((item) => {
              list[i].clone(this.data, item);
            });
          }
        }
      }

      reload() {
        this.enqueue(async () => {
          this.data = await get_user_info(this.uid);

          Object.values(this.children).forEach((item) => item.destroy());

          this.rearrange();
        });
      }

      constructor(id) {
        this.uid = id;

        this.waitingQueue = [];
        this.isRunning = false;

        this.container = {};
        this.children = {};

        this.reload();
      }
    }

    // 用户信息组件
    class UserInfoWidget {
      destroy() {
        if (this.source) {
          this.source = undefined;
        }

        if (this.target) {
          Object.values(this.target).forEach((item) => {
            if (item.parentNode) {
              item.parentNode.removeChild(item);
            }
          });
        }
      }

      clone(data, [argid, container]) {
        if (this.source) {
          if (this.target[argid] === undefined) {
            this.target[argid] = this.source.cloneNode(true);

            if (this.callback) {
              this.callback(data, this.target[argid]);
            }
          }

          const isSmall = container.classList.contains("posterInfoLine");

          if (isSmall) {
            const anchor = container.querySelector(".author ~ br");

            if (anchor) {
              anchor.parentNode.insertBefore(this.target[argid], anchor);
            }
          } else {
            container.appendChild(this.target[argid]);
          }
        }
      }

      constructor(func, callback) {
        this.create = (data) => {
          this.destroy();

          this.source = func(data);
          this.target = {};
        };

        this.callback = callback;
      }
    }

    // 扩展规则
    const extraData = (() => {
      const key = `EXTRA_DATA`;
      const data = GM_getValue(key) || {
        [0]: {
          time: 0,
        },
      };

      const save = () => {
        GM_setValue(key, data);
      };

      const setValue = (uid, value) => {
        data[uid] = value;

        save();
      };

      const getValue = (uid) => data[uid];

      const remove = (uid) => {
        delete data[uid];

        save();
      };

      const specialList = () => {
        const result = Object.entries(data).filter(
          ([key, value]) => value.level
        );

        if (Object.keys(result)) {
          return result;
        }

        return null;
      };

      GM_addValueChangeListener(key, function (_, prev, next) {
        Object.assign(data, next);
      });

      return {
        specialList,
        setValue,
        getValue,
        remove,
      };
    })();

    // 获取用户信息
    const get_user_info = (uid) => {
      const searchPair = (content, keyword, start = "{", end = "}") => {
        // 获取成对括号的位置
        const getLastIndex = (content, position, start = "{", end = "}") => {
          if (position >= 0) {
            let nextIndex = position + 1;

            while (nextIndex < content.length) {
              if (content[nextIndex] === end) {
                return nextIndex;
              }

              if (content[nextIndex] === start) {
                nextIndex = getLastIndex(content, nextIndex, start, end);

                if (nextIndex < 0) {
                  break;
                }
              }

              nextIndex = nextIndex + 1;
            }
          }

          return -1;
        };

        // 起始位置
        const str = keyword + start;

        // 起始下标
        const index = content.indexOf(str) + str.length;

        // 结尾下标
        const lastIndex = getLastIndex(content, index, start, end);

        if (lastIndex >= 0) {
          return start + content.substring(index, lastIndex) + end;
        }

        return null;
      };

      return new Promise((resolve, reject) => {
        fetch(`/nuke.php?func=ucp&uid=${uid}`)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = searchPair(reader.result, `__UCPUSER =`);

              if (text) {
                try {
                  resolve(JSON.parse(text));
                  return;
                } catch {
                  reject();
                  return;
                }
              }

              reject();
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject();
          });
      });
    };

    // 获取用户发帖列表
    const get_user_topic_list = (uid) =>
      new Promise((resolve) => {
        fetch(`/thread.php?lite=js&authorid=${uid}`)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data.__T);
              } else {
                resolve({});
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            resolve({});
          });
      });

    // 获取用户回帖列表
    const get_user_post_list = (uid) =>
      new Promise((resolve, reject) => {
        fetch(`/thread.php?lite=js&authorid=${uid}&searchpost=1`)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data.__T);
              } else {
                resolve({});
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            resolve({});
          });
      });

    // 关注
    const follow = (uid) =>
      new Promise((resolve, reject) => {
        fetch(
          `/nuke.php?lite=js&__lib=follow_v2&__act=follow&id=${uid}&type=1`,
          {
            method: "post",
          }
        )
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data[0]);
              } else {
                reject(result.error[0]);
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject();
          });
      });

    // 取消关注
    const un_follow = (uid) =>
      new Promise((resolve, reject) => {
        fetch(
          `/nuke.php?lite=js&__lib=follow_v2&__act=follow&id=${uid}&type=8`,
          {
            method: "post",
          }
        )
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data[0]);
              } else {
                reject(result.error[0]);
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject();
          });
      });

    // 移除粉丝
    const un_follow_fans = (uid) =>
      new Promise((resolve, reject) => {
        fetch(
          `/nuke.php?lite=js&__lib=follow_v2&__act=follow&id=${uid}&type=256`,
          {
            method: "post",
          }
        )
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data[0]);
              } else {
                reject(result.error[0]);
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject();
          });
      });

    // 获取关注列表
    const follow_list = (page) =>
      new Promise((resolve, reject) => {
        fetch(
          `/nuke.php?lite=js&__lib=follow_v2&__act=get_follow&page=${page}`,
          {
            method: "post",
          }
        )
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data[0]);
              } else {
                reject(result.error[0]);
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject();
          });
      });

    // 获取粉丝列表
    const follow_by_list = (page) =>
      new Promise((resolve, reject) => {
        fetch(
          `/nuke.php?lite=js&__lib=follow_v2&__act=get_follow_by&page=${page}`,
          {
            method: "post",
          }
        )
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data[0]);
              } else {
                reject(result.error[0]);
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject();
          });
      });

    // 获取关注动态
    const follow_dymanic_list = (page) =>
      new Promise((resolve, reject) => {
        fetch(
          `/nuke.php?lite=js&__lib=follow_v2&__act=get_push_list&page=${page}`,
          {
            method: "post",
          }
        )
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = eval(`
                (${text.replace("window.script_muti_get_var_store=", "")})
              `);

              if (result.data) {
                resolve(result.data);
              } else {
                reject(result.error[0]);
              }
            };

            reader.readAsText(blob, "GBK");
          })
          .catch(() => {
            reject();
          });
      });

    // 切换关注
    const handleSwitchFollow = (uid, isFollow) => {
      if (isFollow) {
        if (confirm("取消关注?")) {
          un_follow(uid).then(() => {
            info[uid]?.reload();
            u.refresh();
          });
        }
      } else {
        follow(uid).then(() => {
          info[uid]?.reload();
          u.refresh();
        });
      }
    };

    // 移除粉丝
    const handleRemoveFans = (uid) => {
      if (confirm("移除粉丝?")) {
        un_follow_fans(uid).then(() => {
          u.refresh();
        });
      }
    };

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

    // MENU
    const m = (() => {
      const container = document.createElement("DIV");

      container.className = `td`;
      container.innerHTML = `<a class="mmdefault" href="javascript: void(0);" style="white-space: nowrap;">关注</a>`;

      const content = container.querySelector("A");

      const create = (onclick) => {
        const anchor = document.querySelector("#mainmenu .td:last-child");

        anchor.before(container);

        content.onclick = onclick;
      };

      const update = (count) => {
        if (count) {
          content.innerHTML = `关注 <span class="small_colored_text_btn stxt block_txt_c0 vertmod">${count}</span>`;
        } else {
          content.innerHTML = `关注`;
        }
      };

      return {
        create,
        update,
      };
    })();

    // UI
    const u = (() => {
      const modules = {};

      const createView = () => {
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
                  item.visible = true;
                } else {
                  item.tab.className = "nobr silver";
                  item.content.style = "display: none";
                  item.visible = false;
                }
              });

              module.refresh();
            };

            tc.append(tabBox);
            cc.append(module.content);

            tab.onclick = (() => {
              let timeout;

              return () => {
                if (timeout > 0) {
                  return;
                }

                timeout = setTimeout(() => {
                  timeout = 0;
                }, 320);

                toggle();
              };
            })();

            modules[module.name] = {
              ...module,
              tab,
              toggle,
              visible: false,
            };

            return modules[module.name];
          };
        })();

        return {
          content,
          addModule,
        };
      };

      const refresh = () => {
        Object.values(modules)
          .find((item) => item.visible)
          ?.refresh();
      };

      return {
        modules,
        createView,
        refresh,
      };
    })();

    // 我的关注
    {
      const name = "我的关注";

      const content = (() => {
        const c = document.createElement("div");

        c.style.display = "none";
        c.innerHTML = `
        <div class="s-table-wrapper">
          <table class="s-table forumbox">
            <thead>
              <tr class="block_txt_c0">
                <th class="c1" width="1">用户</th>
                <th class="c2">过滤规则</th>
                <th class="c3" width="1">特别关注</th>
                <th class="c4" width="1">操作</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="silver" style="margin-top: 5px;">特别关注功能需要占用额外的资源，请谨慎开启</div>
        `;

        return c;
      })();

      let page = 0;
      let hasNext = false;
      let isFetching = false;

      const box = content.querySelector("DIV");

      const list = content.querySelector("TBODY");

      const wrapper = content.querySelector(".s-table-wrapper");

      const fetchData = () => {
        isFetching = true;

        follow_list(page)
          .then((res) => {
            hasNext = Object.keys(res).length > 0;

            for (let i in res) {
              const { uid, username } = res[i];

              const data = extraData.getValue(uid) || {};

              if (list.querySelector(`[data-id="${uid}"]`)) {
                continue;
              }

              const item = document.createElement("TR");

              item.className = `row${
                (list.querySelectorAll("TR").length % 2) + 1
              }`;

              item.setAttribute("data-id", uid);

              item.innerHTML = `
                <td class="c1">
                  <a href="/nuke.php?func=ucp&uid=${uid}" class="b nobr">${username}</a>
                </td>
                <td class="c2">
                  <div class="s-input-wrapper">
                    <input value="${data.rule || ""}" />
                  </div>
                </td>
                <td class="c3">
                  <div style="text-align: center;">
                    <input type="checkbox" ${
                      data.level ? `checked="checked"` : ""
                    } />
                  </div>
                </td>
                <td class="c4">
                  <div class="s-button-group">
                    <button>重置</button>
                    <button>移除</button>
                  </div>
                </td>
              `;

              const ruleElement = item.querySelector("INPUT");
              const levelElement = item.querySelector(`INPUT[type="checkbox"]`);
              const actions = item.querySelectorAll("BUTTON");

              const save = () => {
                extraData.setValue(uid, {
                  rule: ruleElement.value,
                  level: levelElement.checked ? 1 : 0,
                });
              };

              const clear = () => {
                ruleElement.value = "";
                levelElement.checked = false;

                save();
              };

              ruleElement.onchange = save;

              levelElement.onchange = save;

              actions[0].onclick = () => clear();
              actions[1].onclick = () => handleSwitchFollow(uid, 1);

              list.appendChild(item);
            }
          })
          .finally(() => {
            isFetching = false;
          });
      };

      box.onscroll = () => {
        if (isFetching || !hasNext) {
          return;
        }

        if (
          box.scrollHeight - box.scrollTop - box.clientHeight <=
          wrapper.clientHeight
        ) {
          page = page + 1;

          fetchData();
        }
      };

      const refresh = () => {
        list.innerHTML = "";

        page = 1;
        hasNext = false;

        fetchData();
      };

      hookFunction(u, "createView", (view) => {
        view.addModule({
          name,
          content,
          refresh,
        });
      });
    }

    // 我的粉丝
    {
      const name = "我的粉丝";

      const content = (() => {
        const c = document.createElement("div");

        c.style.display = "none";
        c.innerHTML = `
        <div class="s-table-wrapper">
          <table class="s-table forumbox">
            <thead>
              <tr class="block_txt_c0">
                <th class="c1">用户</th>
                <th class="c2" width="1">操作</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        `;

        return c;
      })();

      let page = 0;
      let hasNext = false;
      let isFetching = false;

      const box = content.querySelector("DIV");

      const list = content.querySelector("TBODY");

      const wrapper = content.querySelector(".s-table-wrapper");

      const fetchData = () => {
        isFetching = true;

        follow_by_list(page)
          .then((res) => {
            hasNext = Object.keys(res).length > 0;

            for (let i in res) {
              const { uid, username } = res[i];

              if (list.querySelector(`[data-id="${uid}"]`)) {
                continue;
              }

              const item = document.createElement("TR");

              item.className = `row${
                (list.querySelectorAll("TR").length % 2) + 1
              }`;

              item.setAttribute("data-id", uid);

              item.innerHTML = `
                <td class="c1">
                  <a href="/nuke.php?func=ucp&uid=${uid}" class="b nobr">${username}</a>
                </td>
                <td class="c2">
                  <div class="s-button-group">
                    <button>移除</button>
                  </div>
                </td>
              `;

              const action = item.querySelector("BUTTON");

              action.onclick = () => handleRemoveFans(uid);

              list.appendChild(item);
            }
          })
          .finally(() => {
            isFetching = false;
          });
      };

      box.onscroll = () => {
        if (isFetching || !hasNext) {
          return;
        }

        if (
          box.scrollHeight - box.scrollTop - box.clientHeight <=
          wrapper.clientHeight
        ) {
          page = page + 1;

          fetchData();
        }
      };

      const refresh = () => {
        list.innerHTML = "";

        page = 1;
        hasNext = false;

        fetchData();
      };

      hookFunction(u, "createView", (view) => {
        view.addModule({
          name,
          content,
          refresh,
        });
      });
    }

    // 关注动态
    {
      const name = "关注动态";

      const content = (() => {
        const c = document.createElement("div");

        c.style.display = "none";
        c.innerHTML = `
        <div class="s-table-wrapper">
          <table class="s-table forumbox">
            <thead>
              <tr class="block_txt_c0">
                <th class="c1" width="1">时间</th>
                <th class="c2">内容</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        `;

        return c;
      })();

      let page = 0;
      let hasNext = false;
      let isFetching = false;

      const box = content.querySelector("DIV");

      const list = content.querySelector("TBODY");

      const wrapper = content.querySelector(".s-table-wrapper");

      const fetchData = () => {
        isFetching = true;

        follow_dymanic_list(page)
          .then((res) =>
            Promise.all(
              Object.keys(res[1]).map((uid) =>
                get_user_info(uid).then((item) => {
                  if (item.follow) {
                    const info = extraData.getValue(uid) || {
                      rule: "",
                      level: 0,
                    };

                    extraData.setValue(uid, {
                      ...info,
                    });
                  } else {
                    extraData.remove(uid);
                  }
                })
              )
            ).then(() => {
              return res;
            })
          )
          .then((res) => {
            hasNext = res[2] > res[3];

            extraData.setValue(0, {
              time: Math.floor(new Date() / 1000),
              unread: 0,
            });

            return res;
          })
          .then((res) => {
            const filtered = Object.values(res[0])
              .map((item) => ({
                id: item[0],
                uid: item[2],
                info: item[4]
                  ? res[4][`${item[3]}_${item[4]}`]
                  : res[4][item[3]],
                time: item[6],
                summary: item.summary
                  .replace(
                    /\[uid=(\d+)\](.+)\[\/uid\]/,
                    `<a href="/nuke.php?func=ucp&uid=${item[2]}" class="b nobr">$2</a>`
                  )
                  .replace(
                    /\[pid=(\d+)\](.+)\[\/pid\](\s?)/,
                    `<a href="/read.php?pid=${item[4]}" class="b nobr">回复</a>`
                  )
                  .replace(
                    /\[tid=(\d+)\](.+)\[\/tid\]/,
                    item[4] === 0
                      ? `<a href="/read.php?tid=${item[3]}" title="$2" class="b nobr">$2</a>`
                      : `<a href="/read.php?pid=${item[4]}&opt=128" title="$2" class="b nobr">$2</a>`
                  ),
              }))
              .filter((item) => {
                const { uid, info } = item;

                const data = extraData.getValue(uid);

                if (data) {
                  const { rule } = data;

                  if (rule) {
                    return (
                      info.subject.search(rule) >= 0 ||
                      info.content.search(rule) >= 0
                    );
                  }

                  return true;
                }

                return false;
              });

            return filtered;
          })
          .then((res) => {
            for (let i in res) {
              const { id, time, summary } = res[i];

              if (list.querySelector(`[data-id="${id}"]`)) {
                continue;
              }

              const item = document.createElement("TR");

              item.className = `row${
                (list.querySelectorAll("TR").length % 2) + 1
              }`;

              item.setAttribute("data-id", id);
              item.setAttribute("data-time", time);

              item.innerHTML = `
                <td class="c1">
                  <span class="nobr">${ui.time2dis(time)}</span>
                </td>
                <td class="c2">
                  <div class="s-text-ellipsis">
                    <span>${summary}</span>
                  </div>
                </td>
              `;

              list.appendChild(item);
            }

            if (box.scrollHeight === box.clientHeight && hasNext) {
              page = page + 1;

              fetchData();
            }
          })
          .finally(() => {
            isFetching = false;
          });
      };

      box.onscroll = () => {
        if (isFetching || !hasNext) {
          return;
        }

        if (
          box.scrollHeight - box.scrollTop - box.clientHeight <=
          wrapper.clientHeight
        ) {
          page = page + 1;

          fetchData();
        }
      };

      const refresh = () => {
        list.innerHTML = "";

        page = 1;
        hasNext = false;

        fetchData();
      };

      hookFunction(u, "createView", (view) => {
        view.addModule({
          name,
          content,
          refresh,
        });
      });
    }

    // 打开菜单
    const handleCreateView = (() => {
      let view, window;

      return () => {
        if (view === undefined) {
          view = u.createView();
        }

        u.modules["关注动态"].toggle();
        m.update(0);

        if (window === undefined) {
          window = ui.createCommmonWindow();
        }

        window._.addContent(null);
        window._.addTitle(`关注`);
        window._.addContent(view.content);
        window._.show();
      };
    })();

    // 扩展用户信息
    (() => {
      const execute = (argid) => {
        const args = ui.postArg.data[argid];

        if (args.comment) return;

        const uid = +args.pAid;

        if (uid > 0) {
          if (info[uid] === undefined) {
            info[uid] = new UserInfo(uid);
          }

          if (document.contains(info[uid].container[argid]) === false) {
            info[uid].container[argid] =
              args.uInfoC.closest("tr").querySelector(".posterInfoLine") ||
              args.uInfoC.querySelector("div");
          }

          info[uid].enqueue(async () => {
            args.uInfoC.className =
              args.uInfoC.className + " s-user-info-container";

            if (info[uid].children[16]) {
              info[uid].children[16].destroy();
            }

            info[uid].children[16] = new UserInfoWidget(
              (data) => {
                const value = data.follow_by_num || 0;

                const element = document.createElement("SPAN");

                if (uid === self || data.follow) {
                  element.className =
                    "small_colored_text_btn stxt block_txt_c2 vertmod";
                } else {
                  element.className =
                    "small_colored_text_btn stxt block_txt_c2 vertmod ah";
                }

                element.style.cursor = "default";
                element.innerHTML = `<span class="white"><span style="font-family: comm_glyphs; -webkit-font-smoothing: antialiased; line-height: 1em;">★</span>&nbsp;${value}</span>`;

                element.style.cursor = "pointer";

                return element;
              },
              (data, element) => {
                element.onclick = () => {
                  if (data.uid === self) {
                    handleCreateView();
                  } else {
                    handleSwitchFollow(data.uid, data.follow);
                  }
                };
              }
            );

            info[uid].rearrange();
          });
        }
      };

      let initialized = false;

      if (ui.postArg) {
        Object.keys(ui.postArg.data).forEach((i) => execute(i));
      }

      hookFunction(ui, "eval", () => {
        if (initialized) return;

        if (ui.postDisp) {
          hookFunction(
            ui,
            "postDisp",
            (returnValue, originalFunction, arguments) => execute(arguments[0])
          );

          initialized = true;
        }
      });
    })();

    // 提醒关注
    (async () => {
      // 增加菜单项
      m.create(handleCreateView);

      // 获取动态
      (() => {
        const cache = extraData.getValue(0) || {
          time: 0,
          unread: 0,
        };

        const fetchData = async (page = 1, result = {}) =>
          new Promise((resolve) => {
            follow_dymanic_list(page).then(async (res) => {
              const list = Object.values(res[0]);
              const prefiltered = list
                .map((item) => ({
                  id: item[0],
                  uid: item[2],
                  info: item[4]
                    ? res[4][`${item[3]}_${item[4]}`]
                    : res[4][item[3]],
                  time: item[6],
                }))
                .filter((item) => item.time > (cache.time || 0))
                .filter((item) => {
                  if (result[item.id]) {
                    return false;
                  }

                  result[item.id] = item;
                  return true;
                });

              if (prefiltered.length) {
                await Promise.all(
                  Object.keys(res[1]).map((uid) =>
                    get_user_info(uid).then((item) => {
                      if (item.follow) {
                        const info = extraData.getValue(uid) || {
                          rule: "",
                          level: 0,
                        };

                        extraData.setValue(uid, {
                          ...info,
                        });
                      } else {
                        extraData.remove(uid);
                      }
                    })
                  )
                );

                const hasNext =
                  prefiltered.length === list.length && res[2] > res[3];

                if (hasNext) {
                  const withNext = await fetchData(page + 1, result);

                  resolve(withNext);
                }
              }

              resolve(result);
            });
          });

        fetchData().then((res) => {
          const filtered = Object.values(res).filter((item) => {
            const { uid, info } = item;

            const data = extraData.getValue(uid);

            if (data) {
              const { rule } = data;

              if (rule) {
                return (
                  info.subject.search(rule) >= 0 ||
                  info.content.search(rule) >= 0
                );
              }

              return true;
            }

            return false;
          });

          const unread = (cache.unread || 0) + filtered.length;

          extraData.setValue(0, {
            time: Math.floor(new Date() / 1000),
            unread: unread,
          });

          m.update(unread);
        });
      })();

      // 特别关注
      {
        const fetchData = async (uid, value) => {
          // 请求用户信息
          const { username, follow, posts } = await get_user_info(uid);

          // 用户缓存
          const { rule, time, postNum } = value;

          // 已取消关注
          if (follow === 0) {
            extraData.remove(uid);
            return [];
          }

          // 判断是否有新活动
          if (posts <= (postNum || 0)) {
            return [];
          }

          // 是否匹配
          const isMatch = (text) => {
            if (rule) {
              return text.search(rule) >= 0;
            }

            return true;
          };

          // 请求发帖记录
          const ts = await get_user_topic_list(uid).then((res) =>
            Object.values(res)
              .filter(
                (item) => item.postdate > (time || 0) && isMatch(item.subject)
              )
              .map((item) => ({
                0: 5,
                1: item.authorid,
                2: item.author,
                5: item.subject,
                6: item.tid,
                9: item.postdate,
                10: 1,
              }))
          );

          // 请求回帖记录
          const ps = await get_user_post_list(uid).then((res) =>
            Object.values(res)
              .filter(
                (item) =>
                  item.__P.postdate > (time || 0) && isMatch(item.__P.content)
              )
              .map((item) => ({
                0: 6,
                1: uid,
                2: username,
                5: item.subject,
                6: item.__P.tid,
                7: item.__P.pid,
                9: item.__P.postdate,
                10: 1,
              }))
          );

          // 更新缓存
          extraData.setValue(uid, {
            ...value,
            time: Math.floor(new Date() / 1000),
            postNum: posts,
          });

          // 返回结果
          return [...ts, ...ps];
        };

        const data = (
          await Promise.all(
            extraData
              .specialList()
              .map(async ([key, value]) => await fetchData(key, value))
          )
        )
          .flat()
          .sort((a, b) => a[9] - b[9]);

        if (Object.keys(data).length) {
          const func = () => {
            // 修复 NGA 脚本错误
            TPL[KEY["_BIT_SYS"]][KEY["_TYPE_KEYWORD_WATCH_REPLY"]] = function (
              x
            ) {
              return x[KEY["_ABOUT_ID_4"]]
                ? "{_U} 在{_T1} {_R2} 中的 {_R5} 触发了关键词监视<br/>"
                : "{_U} 在主题 {_T} 中的 {_R5} 触发了关键词监视<br/>";
            };

            // 推送消息
            for (let i in data) {
              ui.notification._add(1, data[i], 1);
            }

            // 打开窗口
            ui.notification.openBox();
          };

          if (ui.notification) {
            func();
          } else {
            ui.loadNotiScript(() => {
              func();
            });
          }
        }
      }
    })();
  })(ui.sn.userInfo);
})(commonui, __CURRENT_UID);
