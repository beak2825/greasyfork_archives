// ==UserScript==
// @name        NGA Fast View Post Fix
// @name:zh-CN  NGA “快速浏览这个帖子” 修复

// @description 修复论坛“快速浏览这个帖子”功能，并可在“快速浏览这个帖子”时点赞，以及点赞后更新实时点赞数

// @namespace   https://greasyfork.org/users/263018
// @version     1.1.1
// @author      snyssss
// @license     MIT

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @require     https://update.greasyfork.org/scripts/486070/1378387/NGA%20Library.js

// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482017/NGA%20Fast%20View%20Post%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/482017/NGA%20Fast%20View%20Post%20Fix.meta.js
// ==/UserScript==

((ui, ubbcode) => {
  if (!ui) return;
  if (!ubbcode) return;

  // KEY
  const USER_AGENT_KEY = "USER_AGENT";
  const IS_SHOW_SCORE_KEY = "IS_SHOW_SCORE";
  const IS_SHOW_SCORE_RESULT_KEY = "IS_SHOW_SCORE_RESULT_KEY";

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

  // 是否显示评分
  const showScore = (() => {
    const data = GM_getValue(IS_SHOW_SCORE_KEY) || false;

    GM_registerMenuCommand(`显示评分：${data ? "是" : "否"}`, () => {
      GM_setValue(IS_SHOW_SCORE_KEY, !data);

      location.reload();
    });

    return data;
  })();

  // 是否显示评分结果
  const showScoreResult = (() => {
    const data = GM_getValue(IS_SHOW_SCORE_RESULT_KEY) || false;

    GM_registerMenuCommand(`显示评分结果：${data ? "是" : "否"}`, () => {
      GM_setValue(IS_SHOW_SCORE_RESULT_KEY, !data);

      location.reload();
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

  // 获取帖子信息
  const getPostInfo = async (tid, pid) => {
    const url = `/read.php?tid=${tid}&pid=${pid}`;

    const data = await new Promise((resolve) =>
      request(url)
        .then((res) => res.blob())
        .then((res) => {
          // 读取内容
          const reader = new FileReader();

          reader.onload = () => {
            const parser = new DOMParser();

            const doc = parser.parseFromString(reader.result, "text/html");

            // 验证帖子正常
            const verify = doc.querySelector("#m_posts");

            if (verify === null) {
              throw new Error();
            }

            // 取得顶楼 UID
            const uid = (() => {
              const ele = doc.querySelector("#postauthor0");

              if (ele) {
                const res = ele.getAttribute("href").match(/uid=((-?)(\S+))/);

                if (res) {
                  return res[1];
                }
              }

              return 0;
            })();

            // 取得顶楼标题
            const subject = doc.querySelector("#postsubject0").innerHTML;

            // 取得顶楼内容
            const content = doc.querySelector("#postcontent0").innerHTML;

            // 取得用户信息
            const user = (() => {
              const text = Tools.searchPair(reader.result, `"${uid}":`);

              if (text) {
                try {
                  return JSON.parse(text);
                } catch {
                  return null;
                }
              }

              return null;
            })();

            // 取得额外信息
            const extra = (() => {
              const content = reader.result.substring(
                reader.result.indexOf(`commonui.postArg.proc( 0,`)
              );

              const text = Tools.searchPair(
                content,
                `commonui.postArg.proc`,
                `(`,
                `)`
              );

              if (text) {
                return text;
              }

              return null;
            })();

            // 返回结果
            resolve({
              subject,
              content,
              user,
              extra,
            });
          };

          reader.readAsText(res, "GBK");
        })
        .catch(() => {
          resolve(null);
        })
    );

    return data;
  };

  // 快速浏览
  const fastViewPost = (() => {
    const window = ui.createCommmonWindow();

    const container = document.createElement("DIV");

    container.className = `fastViewPost`;
    container.innerHTML = `
      <div class="forumbox">
        <div class="postrow"></div>
      </div>
    `;

    const list = container.querySelector(".postrow");

    window._.addContent(null);
    window._.addContent(container);

    return async (_, tid, pid = 0, opt) => {
      // 如果 opt 是 16，则说明是快速浏览窗口中的快速浏览，追加楼层
      // 反之清空楼层
      if (opt !== 16) {
        list.innerHTML = "";
      }

      // 如果已加载过，直接返回
      if (list && list.querySelector(`[data-pid="${pid}"]`)) {
        return;
      }

      // 请求内容，移除了 opt 参数
      // 泥潭会在快速浏览窗口里再次点击快速浏览时，把整个相关对话列出来，反而找不到当前帖子
      const data = await getPostInfo(tid, pid);

      // 没有内容
      if (data === null) {
        return;
      }

      // 解析数据
      const { content, user, extra } = data;

      // 发帖人姓名
      const username = ui.htmlName(user.username);

      // 加载楼层
      const row = document.createElement("DIV");

      row.className = `row${
        2 - (list.querySelectorAll(":scope > div").length % 2)
      }`;
      row.innerHTML = `
        <div class="c2" data-pid="${pid}">
          <div class="posterInfoLine b">${username}</div>
          <span class="postcontent ubbcode">${content}</span>
        </div>
      `;

      list.insertBefore(row, list.firstChild);

      // 格式转换完毕后显示窗口
      // 但泥潭这样做实际毫无意义，如果窗口开着的情况下进行格式转换，照样会短暂显示乱码
      ubbcode.bbsCode({
        c: row.querySelector(".ubbcode"),
        tId: tid,
        pId: pid,
        opt: 8,
        authorId: user.uid,
        noImg: 1,
        isNukePost: 0,
        callBack: () => {
          window._.show();
        },
      });

      // 显示评分
      if (showScore) {
        // 取得评分数据
        const recommend = extra.match(/'(\d+),(\d+),(\d+)'/);

        if (recommend) {
          const score_1 = recommend[2];
          const score_2 = recommend[3];

          const ele = document.createElement("DIV");

          ele.className = `right_`;
          ele.innerHTML = `
            <div style="display: inline-block; font-weight: normal;">
              <span class="small_colored_text_btn stxt block_txt_c2 vertmod">
                <span class="white">
                  <a class="white" href="javascript: void(0);" title="支持" style="text-decoration: none;">
                    <span style="font-family: comm_glyphs; -webkit-font-smoothing: antialiased; line-height: 1em; padding: 0 0.1em;">⯅</span>
                  </a>
                  <span class="recommendvalue"></span>
                  <a class="white" href="javascript: void(0);" title="反对" style="text-decoration: none;">
                    <span style="font-family: comm_glyphs; -webkit-font-smoothing: antialiased; line-height: 1em; padding: 0 0.1em;">⯆</span>
                  </a>
                </span>
              </span>
            </div>
          `;

          ele.querySelector(".recommendvalue").innerHTML =
            score_1 - score_2 || "&nbsp;";

          row.querySelector(".posterInfoLine").appendChild(ele);

          // 绑定事件
          (() => {
            const bindEvent = () => {
              const like = ele.querySelector("a:first-child");

              like.onclick = () => {
                ui.postScoreAdd(like, {
                  tid,
                  pid,
                });
              };

              const unlike = ele.querySelector("a:last-child");

              unlike.onclick = () => {
                ui.postScoreAdd(
                  unlike,
                  {
                    tid,
                    pid,
                  },
                  1
                );
              };
            };

            // 绑定事件
            if (ui.postScoreAdd) {
              bindEvent();
            } else {
              __SCRIPTS.asyncLoad("read", bindEvent);
            }
          })();
        }
      }
    };
  })();

  // 刷新评分
  const refreshScore = (anchor, { tid, pid }) => {
    const target = anchor.parentNode.querySelector(".recommendvalue");

    if (target === null) {
      return;
    }

    const observer = new MutationObserver(() => {
      observer.disconnect();

      getPostInfo(tid, pid).then(({ extra }) => {
        if (extra) {
          const recommend = extra.match(/'(\d+),(\d+),(\d+)'/);

          if (recommend) {
            const score_1 = recommend[2];
            const score_2 = recommend[3];

            target.innerHTML = score_1 - score_2 || "&nbsp;";
          }
        }
      });
    });

    observer.observe(target, {
      childList: true,
    });
  };

  // 加载脚本
  (() => {
    // 修复快速浏览
    ubbcode.fastViewPost = fastViewPost;

    // 绑定评分事件
    if (ui && showScoreResult) {
      Tools.interceptProperty(ui, "postScoreAdd", {
        afterGet: (_, args) => {
          refreshScore(...args);
        },
      });
    }
  })();
})(commonui, ubbcode);
