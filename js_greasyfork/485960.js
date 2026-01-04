// ==UserScript==
// @name         剧本杀活动通知生成器
// @namespace    https://github.com/heiyexing
// @version      2024-07-17
// @description  用于获取本周剧本杀活动信息并生成 Markdown 代码
// @author       炎熊
// @match        https://yuque.antfin-inc.com/yuhmb7/pksdw8/**
// @match        https://yuque.antfin.com/yuhmb7/pksdw8/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=antfin-inc.com
// @require      https://registry.npmmirror.com/dayjs/1.11.9/files/dayjs.min.js
// @require      https://registry.npmmirror.com/dayjs/1.11.9/files/plugin/isSameOrAfter.js
// @require      https://registry.npmmirror.com/dayjs/1.11.9/files/plugin/isSameOrBefore.js
// @require      https://registry.npmmirror.com/dayjs/1.11.9/files/locale/zh-cn.js
// @require      https://www.layuicdn.com/layui-v2.8.0/layui.js
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485960/%E5%89%A7%E6%9C%AC%E6%9D%80%E6%B4%BB%E5%8A%A8%E9%80%9A%E7%9F%A5%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/485960/%E5%89%A7%E6%9C%AC%E6%9D%80%E6%B4%BB%E5%8A%A8%E9%80%9A%E7%9F%A5%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";

    dayjs.locale(dayjs_locale_zh_cn);
    dayjs.extend(dayjs_plugin_isSameOrAfter);
    dayjs.extend(dayjs_plugin_isSameOrBefore);

    const BTN_ID = "murder-mystery-btn";
    const USER_LIST_CLASS_NAME = "murder-user-list";
    const USER_ITEM_CLASS_NAME = "murder-user-item";

    let timeRange = [dayjs().startOf("week"), dayjs().endOf("week")];

    function initStyle() {
        const style = document.createElement("style");
        style.innerHTML = `
                      #${BTN_ID} {
                          position: fixed;
                          bottom: 25px;
                          right: 80px;
                          width: 40px;
                          height: 40px;
                          background-color: #fff;
                          border-radius: 50%;
                          box-shadow: 0 0 10px rgba(0, 0, 0, .2);
                          cursor: pointer;
                          display: inline-flex;
                          justify-content: center;
                          align-items: center;
                          z-index: 2;
                      }
                      #${BTN_ID} img {
                          width: 20px;
                      }
                      .${USER_LIST_CLASS_NAME} {
                        display: flex;
                        flex-wrap: wrap;
                      }
                      .${USER_ITEM_CLASS_NAME} {
                        margin-right: 12px;
                        margin-bottom: 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        line-height: 14px;
                        border-radius: 6px;
                        padding: 6px;
                        border: 1px solid #E7E9E8;
                      }
                      .${USER_ITEM_CLASS_NAME}.unchecked {
                        border-color: #ff0000;
                      }
                      .${USER_ITEM_CLASS_NAME} span {
                        white-space: nowrap;
                      }
                      .${USER_ITEM_CLASS_NAME} img {
                        width: 30px;
                        height: 30px;
                        border-radius: 30px;
                        margin-right: 6px;
                      }
                      .layui-card-body {
                        width: 100%;
                      }
                      .layui-card-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      }
                      `;
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.href =
          "https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/css/layui.min.css";
      document.head.appendChild(style);
      document.head.appendChild(link);
      return style;
  }

    function initBtn() {
        const btn = document.createElement("div");
        btn.id = BTN_ID;
        const logo = document.createElement("img");
        logo.src =
            "https://mdn.alipayobjects.com/huamei_baaa7a/afts/img/A*f8MvQYdbHPoAAAAAAAAAAAAADqSCAQ/original";
        btn.appendChild(logo);
        document.body.appendChild(btn);
        return btn;
    }

    function getTitleInfo(title) {
        const month = title.match(/\d+(?=\s*月)/)?.[0];
        const date = title.match(/\d+(?=\s*日)/)?.[0];
        const name = title.match(/(?<=《).*?(?=》)/)?.[0];
        if (!month || !date || !name) {
            return null;
        }
        return {
            month: +month,
            date: +date,
            name,
        };
    }

    function getRegExpStr(strList, regexp) {
        for (const str of strList) {
            const result = str.match(regexp);
            if (result) {
                return result[0].trim();
            }
        }
        return "";
    }

    function downloadFile(content, fileName) {
        const url = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(
            content
        )}`;
        // 创建a标签
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    }

    function exeCommandCopyText(text) {
        try {
            const t = document.createElement("textarea");
            t.nodeValue = text;
            t.value = text;
            document.body.appendChild(t);
            t.select();
            document.execCommand("copy");
            document.body.removeChild(t);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    function getInnerText(content) {
        const div = document.createElement("div");
        div.style = "height: 0px; overflow: hidden;";
        div.innerHTML = content;
        document.body.appendChild(div);
        return div.innerText;
    }

    function chineseToArabic(chineseNum) {
        let num = chineseNum
        .replace(/零/g, "0")
        .replace(/一/g, "1")
        .replace(/二/g, "2")
        .replace(/三/g, "3")
        .replace(/四/g, "4")
        .replace(/五/g, "5")
        .replace(/六/g, "6")
        .replace(/七/g, "7")
        .replace(/八/g, "8")
        .replace(/九/g, "9");
        num = num
            .replace(/十/g, "10")
            .replace(/百/g, "100")
            .replace(/千/g, "1000")
            .replace(/万/g, "10000");
        return num;
    }

    async function getAllActivesInfo() {
        if (!window.appData || !Array.isArray(window.appData?.book.toc)) {
            return;
        }
        const tocList = window.appData?.book.toc.filter((item) =>
                                                        ["BkpJsZ1b7Xm9MB8p", "_yvlr38511LXSB_-"].includes(item.parent_uuid)
                                                       );

        return tocList;
    }

    async function getActivesInfo(start, end) {
        if (!window.appData || !Array.isArray(window.appData?.book.toc)) {
            return;
        }
        const tocList = window.appData?.book.toc;
        const pathList = location.pathname.split("/");
        if (pathList.length <= 0) {
            return;
        }
        const docUrl = pathList[pathList.length - 1];
        const currentToc = tocList.find((item) => item.url === docUrl);
        if (!currentToc) {
            return;
        }
        const parentToc = tocList.find(
            (item) => item.uuid === currentToc.parent_uuid
        );
        if (!parentToc) {
            return;
        }
        const targetTocList = tocList.filter(
            (item) => item.parent_uuid === parentToc.uuid
        );

        const targetTimeRangeList = targetTocList
        .map((item) => {
            const titleInfo = getTitleInfo(item.title);
            if (!titleInfo) {
                return item;
            }
            return {
                ...item,
                ...titleInfo,
                dayjs: dayjs()
                .set("month", titleInfo.month - 1)
                .set("date", titleInfo.date),
            };
        })
        .filter((item) => {
            return (
                item.dayjs.isSameOrAfter(start, "date") &&
                item.dayjs.isSameOrBefore(end, "date")
            );
        })
        .sort((a, b) => a.dayjs - b.dayjs);

        return await Promise.all(
            targetTimeRangeList.map((item) => {
                return fetch(
                    `${location.origin}/api/docs/${item.url}?book_id=${window.appData?.book.id}&include_contributors=true&include_like=true&include_hits=true&merge_dynamic_data=false`
        )
            .then((res) => res.json())
            .then((res) => {
            const rowList = getInnerText(res.data.content).split("\n");

            const tag = getRegExpStr(rowList, /(?<=类型\s*[：:]\s*).+/)
            ?.split(/[/｜|]/)
            .join("/");

            const level = getRegExpStr(
                rowList,
                /(?<=(难度|适合)\s*[：:\s*]).+/
            );

            const dm = getRegExpStr(rowList, /(?<=(dm|DM)\s*[：:]\s*).+/);

            let place = getRegExpStr(rowList, /(?<=(地点|场地)\s*[：:]\s*).+/);

            if (/[Aa]\s?空间/.test(place)) {
                place = "A空间";
            }
            if (/元空间/.test(place)) {
                place = "元空间";
            }

            const persons = getRegExpStr(rowList, /(?<=(人数)\s*[：:]\s*).+/)
            .split(/[,，\(\)（）「」]/)
            .map((item) => item.replace(/(回复报名|注明男女|及人数)/, ""))
            .filter((item) => item.trim())
            .join("·");

            const manCount = +persons.match(/(\d+)\s?男/)?.[1] || undefined;
            const womanCount = +persons.match(/(\d+)\s?女/)?.[1] || undefined;
            const personCount = (() => {
                if (manCount && womanCount) {
                    return manCount + womanCount;
                }
                if (/(\d+)[~～到-](\d+)/.test(persons.replace(/\s/g, ""))) {
                    return +/(\d+)[~～到-](\d+)/.exec(
                        persons.replaceAll(" ", "")
                    )[1];
                }
                if (/(\d+)人?/.test(persons.replaceAll(/\s/g, ""))) {
                    return +/(\d+)人?/.exec(persons.replaceAll(" ", ""))[1];
                }
                return undefined;
            })();

            const reversable = !/不[^反]*反串/.test(persons);

            const week =
                  getRegExpStr(rowList, /周[一二三四五六日]/) ||
                  `周${
                ["日", "一", "二", "三", "四", "五", "六"][item.dayjs.day()]
            }`;

            const time = getRegExpStr(rowList, /\d{1,2}[:：]\d{2}/);

            const [hour = "", minute = ""] = time.split(/[:：]/);

            const duration = getRegExpStr(
                rowList,
                /(?<=(预计时.|时长)\s*[：:]\s*).+/
            ).replace(/(h|小时)/, "H");

            const url = `https://yuque.antfin.com/yuhmb7/pksdw8/${item.url}?singleDoc#`;

            return {
                ...item,
                tag,
                level,
                dm,
                week,
                hour,
                minute,
                place,
                persons,
                duration,
                url,
                manCount,
                womanCount,
                personCount,
                reversable,
            };
        });
      })
    );
  }

    async function copyMarkdownInfo(list) {
        const text = `
# 📢 剧本杀活动通知

---
${list
    .map((item) => {
        return `
🎬 《${item.name}》${item.tag}${item.level ? `/${item.level}` : ""}

🕙  ${item.month}.${item.date} ${item.week} ${item.hour}:${item.minute} 📍${
          item.place
      }

💎  DM ${item.dm}【${item.persons}·${item.duration}】[报名](${item.url})

---
`;
      })
    .join("")}

🔺 入门：新手友好，10推理本以内经验的玩家

🔺 进阶：中等难度，20推理本以内经验的玩家

🔺 烧脑：积极推理、全程在线、20推理本以上

🔍 务必结合自身经验和剧本难度充分评估后报名

🙋‍ [【活动须知】](https://yuque.antfin.com/yuhmb7/pksdw8/hyv3ir5v5gplvvgl?singleDoc#)[【报名规则】](https://yuque.antfin.com/yuhmb7/pksdw8/igri3gwp127v3v32?singleDoc#)[【情感本注意事项】](https://yuque.antfin.com/yuhmb7/pksdw8/sxs3yz5y5b00f65w?singleDoc#)
`;

      exeCommandCopyText(text);
      window.layui?.layer?.msg("已复制到剪贴板");
  }

    async function getCommentsList(list) {
        return Promise.all(
            list.map((item) => {
                return fetch(
                    `https://yuque.antfin-inc.com/api/comments/floor?commentable_type=Doc&commentable_id=${item.id}&include_section=true&include_to_user=true&include_reactions=true`,
                    {
                        headers: {
                            accept: "application/json",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "content-type": "application/json",
                            "sec-ch-ua":
                            '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": '"macOS"',
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-csrf-token": "7g3LVrMMDcljwFdl3GBLLIRy",
                            "x-requested-with": "XMLHttpRequest",
                        },
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: null,
                        method: "GET",
                        mode: "cors",
                        credentials: "include",
                    }
                )
                    .then((res) => res.json())
                    .then((res) => {
                    return {
                        ...item,
                        comments: res.data.comments,
                    };
                });
            })
        );
    }

    function openActivityModal(list) {
        requestAnimationFrame(() => {
            document
                .querySelector("#murder-activity-btn")
                ?.addEventListener("click", () => {
                const fullList = list.filter((item) => item.isFull);
                const unFullList = list.filter((item) => !item.isFull);
                if (fullList.length === list.length) {
                    window.layui?.layer?.msg("所有活动已满人，无需生成 Markdown");
                    return;
                }
                const text = `
# 📢 剧本杀活动通知

---
    ${unFullList
          .map((item) => {
              return `
🎬 《${item.name}》${item.tag}${item.level ? `/${item.level}` : ""}

🕙  ${item.month}.${item.date} ${item.week} ${item.hour}:${item.minute} 📍${
          item.place
      }

💎  DM ${item.dm}【${item.persons}·${item.inputValue ?? ""}·${
          item.duration
      }】[报名](${item.url})

---

`;
      })
          .join("")}

    ${
      fullList.length
          ? `
📎  本周其他剧本活动信息
    ${list
          .filter((item) => item.isFull)
          .map((item) => {
              return `
${item.month}月${item.date}日《${item.name}》【满】
    `;
      })
          .join("")}
---

`
        : ""
          }

🔺 入门：新手友好，10推理本以内经验的玩家

🔺 进阶：中等难度，20推理本以内经验的玩家

🔺 烧脑：积极推理、全程在线、20推理本以上

🔍 务必结合自身经验和剧本难度充分评估后报名

🙋‍ [【活动须知】](https://yuque.antfin.com/yuhmb7/pksdw8/hyv3ir5v5gplvvgl?singleDoc#)[【报名规则】](https://yuque.antfin.com/yuhmb7/pksdw8/igri3gwp127v3v32?singleDoc#)[【情感本注意事项】](https://yuque.antfin.com/yuhmb7/pksdw8/sxs3yz5y5b00f65w?singleDoc#)

`;

          exeCommandCopyText(text);
          window.layui?.layer?.msg("已复制到剪贴板");
      });
    });
      layui.layer.open(
          {
              type: 1, // page 层类型
              area: ["800px", "500px"],
              title: "活动报名情况",
              shade: 0.6, // 遮罩透明度
              shadeClose: true, // 点击遮罩区域，关闭弹层
              maxmin: true, // 允许全屏最小化
              anim: 0, // 0-6 的动画形式，-1 不开启
              content: `
                    <div style="padding: 12px; height: 400px; overflow: auto;">
                      ${list
          .map((item) => {
              let manCount = 0;
              let womanCount = 0;
              let unknownCount = 0;

              item.comments.forEach((comment) => {
                  const content = chineseToArabic(
                      getInnerText(comment.body) ?? ""
                  );

                  comment.checked = true;
                  if (/[=等]/.test(content)) {
                      comment.checked = false;
                  } else if (
                      /(\d+)\s*男\s*(\d+)\s*女/.test(content)
                  ) {
                      const result = /(\d+)\s*男\s*(\d+)\s*女/.exec(
                          content
                      );
                      manCount += +result[1];
                      womanCount += +result[2];
                      console.log(result);
                  } else if (/(\d+)\s?男/.test(content)) {
                      manCount += +/(\d+)\s?男/.exec(content)[1];
                  } else if (/男[\s+]*(\d+)/.test(content)) {
                      manCount += +/男[\s+]*(\d+)/.exec(content)[1];
                  } else if (/^\+?男$/.test(content)) {
                      manCount += 1;
                  } else if (/(\d+)\s?女/.test(content)) {
                      womanCount += +/(\d+)\s?女/.exec(content)[1];
                  } else if (/女[\s+]*(\d+)/.test(content)) {
                      womanCount += +/女[\s+]*(\d+)/.exec(content)[1];
                  } else if (/^\+?女$/.test(content)) {
                      womanCount += 1;
                  } else if (/\+(\d+)/.test(content)) {
                      unknownCount += +/\+(\d+)/.exec(content)[1];
                  } else if (content === "+") {
                      unknownCount += 1;
                  } else if (/\d+/.test(content)) {
                      unknownCount += +/\d+/.exec(content)[0];
                  } else {
                      comment.checked = false;
                  }
              });

              const listHTML = item.comments
              .map((comment) => {
                  const content = getInnerText(comment.body);
                  return `<a class="${USER_ITEM_CLASS_NAME} ${
                                !comment.checked ? "unchecked" : ""
                            }" href="https://yuque.antfin-inc.com/${
                                comment.user.login
                            }" target="_blank">
                            <img src="${comment.user.avatar_url}"/>
                            <div>
                              <div>${comment.user.name}</div>
                              <div style="font-size: 12px; color: gray; margin-top: 4px;">${content}</div>
                            </div>
                          </a>`;
                            })
                          .join("");

                            const personCount =
                                  manCount + womanCount + unknownCount;
                            const status = (() => {
                                if (
                                    item.manCount &&
                                    item.womanCount &&
                                    !item.reversable
                                ) {
                                    if (
                                        manCount >= item.manCount &&
                                        womanCount >= item.womanCount
                                    ) {
                                        return `<span class="layui-badge layui-bg-green">已满人</span>`;
                                    }
                                    if (
                                        personCount >=
                                        item.manCount + item.womanCount
                                    ) {
                                        return `<span class="layui-badge layui-bg-orange">满人，但男女未满</span>`;
                                    }
                                    return `<span class="layui-badge layui-bg-red">未满人</span>`;
                                }
                                if (item.personCount) {
                                    if (personCount >= item.personCount) {
                                        return `<span class="layui-badge layui-bg-green">已满人</span>`;
                                    }
                                    return `<span class="layui-badge layui-bg-red">未满人</span>`;
                                }
                                return "";
                            })();

                            item.isFull = status.indexOf("已满人") > -1;
                            item.inputValue = (() => {
                                if (
                                    item.personCount &&
                                    personCount < item.personCount
                                ) {
                                    return `=${item.personCount - personCount}`;
                                }
                                if (
                                    item.manCount &&
                                    item.womanCount &&
                                    !item.reversable
                                ) {
                                    let result = "=";
                                    if (manCount < item.manCount) {
                                        result += `${item.manCount - manCount}男`;
                                    }
                                    if (womanCount < item.womanCount) {
                                        result += `${item.womanCount - womanCount}女`;
                                    }
                                    if (result.length > 1) {
                                        return result;
                                    }
                                }
                                return "";
                            })();

                            const operation = document.createElement("div");
                            operation.style.width = "120px";
                            const operationId = `murder-operation-${item.uuid}`;
                            operation.id = operationId;

                            operation.style =
                                "display: flex; align-items: center;text-wrap: nowrap;";

                            const updateOperation = () => {
                                const checkboxId = `murder-checkbox-${item.uuid}`;
                                const inputId = `murder-input-${item.uuid}`;
                                let innerHTML = "";
                                if (!item.isFull) {
                                    innerHTML += `<input value="${item.inputValue}" type="text" id="${inputId}" class="layui-input" style="margin-right: 6px; width: 80px;" />`;
                                }
                                innerHTML += `<input type="checkbox" id="${checkboxId}" ${
                              item.isFull ? "checked" : ""
                          } /> 满人`;
                              const target =
                                    document.querySelector(`#${operationId}`) ??
                                    operation;
                              target.innerHTML = innerHTML;
                              requestAnimationFrame(() => {
                                  document
                                      .querySelector(`#${checkboxId}`)
                                      ?.addEventListener(
                                      "change",
                                      (e) => {
                                          item.isFull = !!e.target.checked;
                                          updateOperation();
                                      },
                                      {
                                          once: true,
                                      }
                                  );

                                  document
                                      .querySelector(`#${inputId}`)
                                      ?.addEventListener("change", (e) => {
                                      item.inputValue = e.target.value;
                                      console.log("chagne", item.inputValue);
                                  });
                              });
                          };

                            updateOperation();

                            return `
                          <div class="layui-card">
                            <div class="layui-card-header" style="display: flex; justify-content: space-between;">
                              <a href="${item.url}" target="_blank">🔗 ${
                            item.title
                        }</a>
                            </div>
                            <div class="layui-card-body">
                              <div class="${USER_LIST_CLASS_NAME}">
                                ${listHTML}
                              </div>
                              <div class="layui-card-footer">
                                <span>要求：${item.persons}</span>
                                <span>当前：${manCount}男${womanCount}女${
                            unknownCount ? `${unknownCount}未知` : ""
                        }，共${manCount + womanCount + unknownCount}人</span>
                                ${operation.outerHTML}
                              </div>
                            </div>
                          </div>
                        `;
                        })
          .join("")}
                    </div>
                    <div style="padding: 4px 12px; position: absolute; width: 100%; bottom: 0; left: 0; text-align: right;">
                        <button type="button" class="layui-btn" id="murder-activity-btn">生成 Markdown</button>
                    </div>
                  `,
      },
        2000
    );
  }

    function openDatePickerModal([start, end]) {
        const modalIndex = layui.layer.open(
            {
                type: 1, // page 层类型
                title: "请选择日期范围",
                shade: 0.6, // 遮罩透明度
                area: ["655px", "400px"],
                shadeClose: true, // 点击遮罩区域，关闭弹层
                maxmin: true, // 允许全屏最小化
                anim: 0, // 0-6 的动画形式，-1 不开启
                content: `
                      <div style="padding: 12px">
                          <div id="date"></div>
                      </div>
                  `,
      },
        2000
    );
      layui.laydate.render({
          elem: "#date",
          range: true,
          type: "date",
          rangeLinked: true,
          weekStart: 1,
          show: true,
          theme: "#0271BD",
          position: "static",
          value: `${start.format("YYYY-MM-DD")} - ${end.format("YYYY-MM-DD")}`,
          mark: {
              [dayjs().format("YYYY-MM-DD")]: "今天",
          },
          shortcuts: [
              {
                  text: "本周",
                  value: [
                      new Date(+dayjs().startOf("week")),
                      new Date(+dayjs().endOf("week")),
                  ],
              },
              {
                  text: "上周",
                  value: [
                      new Date(+dayjs().startOf("week").subtract(1, "week")),
                      new Date(+dayjs().endOf("week").subtract(1, "week")),
                  ],
              },
              {
                  text: "下周",
                  value: [
                      new Date(+dayjs().startOf("week").add(1, "week")),
                      new Date(+dayjs().endOf("week").add(1, "week")),
                  ],
              },
              {
                  text: "本月",
                  value: [
                      new Date(+dayjs().startOf("month")),
                      new Date(+dayjs().endOf("month")),
                  ],
              },
              // 更多选项 …
          ],
          done: function (value, startDate, endDate) {
              const [startStr, endStr] = value.split(" - ");
              timeRange = [
                  dayjs(startStr, "YYYY-MM-DD"),
                  dayjs(endStr, "YYYY-MM-DD"),
              ];
              layui.dropdown.reload(BTN_ID, {
                  data: getDropdownItems(),
              });
              layui.layer.close(modalIndex);
          },
      });
  }

    initStyle();
    initBtn();

    function getDropdownItems() {
        return [
            {
                title: "导出所有参与人员报名结果",
                id: "export all user activity",
            },
            {
                title: `日期范围：${timeRange[0].format("M-D")} - ${timeRange[1].format(
                    "M-D"
                )}`,
                disabled: true,
            },
            {
                title: `更改日期范围`,
                id: "edit date range",
            },
            {
                title: "复制活动信息 Markdown",
                id: "copy week markdown",
            },
            {
                title: "查看活动报名情况",
                id: "check sign up",
            },
        ];
    }

    layui.dropdown.render({
        elem: `#${BTN_ID}`,
        data: getDropdownItems(),
        click: async function ({ id }) {
            if (id === "export all user activity") {
                const list = await getCommentsList(await getAllActivesInfo());
                const userMap = new Map();
                list.forEach((item) => {
                    item.comments.forEach((comment) => {
                        const userName = comment.user.name;
                        userMap.set(userName, (userMap.get(userName) ?? 0) + 1);
                    });
                });

                const result = Array.from(userMap.entries()).sort(
                    (a, b) => b[1] - a[1]
                );
                const csv = `name,count\n${result
                .map((item) => `${item[0]},${item[1]}`)
                .join("\n")}`;

                downloadFile(csv, "result.csv");

                return;
            }
            let list = await getActivesInfo(...timeRange);
            if (id === "edit date range") {
                openDatePickerModal(timeRange);
            }
            if (id === "copy week markdown") {
                copyMarkdownInfo(list);
            }
            if (id === "check sign up") {
                list = await getCommentsList(list);
                openActivityModal(list);
            }
        },
    });
})();
