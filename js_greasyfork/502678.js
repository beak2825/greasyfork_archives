// ==UserScript==
// @name         monkey-yunxiao
// @namespace    npm/vite-plugin-monkey
// @version      0.0.9
// @author       monkey
// @description  云效脚本
// @license      MIT
// @icon         data:image/svg+xml,%3Csvg%20width%3D%22240%22%20height%3D%22240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3ClinearGradient%20x1%3D%2250.007%25%22%20y1%3D%2299.839%25%22%20x2%3D%2250.007%25%22%20y2%3D%22.339%25%22%20id%3D%22a%22%3E%3Cstop%20stop-color%3D%22%23006ad4%22%20stop-opacity%3D%22.5%22%20offset%3D%220%25%22%2F%3E%3Cstop%20stop-color%3D%22%23006ad4%22%20stop-opacity%3D%22.2%22%20offset%3D%22100%25%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20x1%3D%2250.035%25%22%20y1%3D%22-.079%25%22%20x2%3D%2250.035%25%22%20y2%3D%2299.929%25%22%20id%3D%22b%22%3E%3Cstop%20stop-color%3D%22%23006ad4%22%20offset%3D%220%25%22%2F%3E%3Cstop%20stop-color%3D%22%23006ad4%22%20stop-opacity%3D%22.5%22%20offset%3D%22100%25%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20width%3D%22240%22%20height%3D%22240%22%20rx%3D%2212%22%2F%3E%3Cg%20transform%3D%22translate(24%2024)%22%20fill-rule%3D%22nonzero%22%3E%3Cpath%20d%3D%22m192%20191.774-67.621-89.901%2048.997-67.087-33.921-26.202-69.395%2093.74%2060.748%2080.64c4.213%205.648%2010.642%208.81%2017.737%208.81H192Z%22%20fill%3D%22url(%23a)%22%2F%3E%3Cellipse%20fill%3D%22%23006ad4%22%20cx%3D%22156.527%22%20cy%3D%2221.685%22%20rx%3D%2221.284%22%20ry%3D%2221.685%22%2F%3E%3Cpath%20d%3D%22M124.379%20101.873%2061.413%2018.296c-4.212-5.647-10.642-8.809-17.736-8.809H0l69.838%2092.838L3.77%20192h43.012c7.094%200%2013.524-3.388%2017.736-9.035l59.862-81.092Z%22%20fill%3D%22url(%23b)%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E
// @match        https://devops.aliyun.com/projex/*
// @match        https://devops.aliyun.com/workbench*
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-10-y/rxjs/7.5.4/rxjs.umd.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-10-y/dayjs/1.10.8/dayjs.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502678/monkey-yunxiao.user.js
// @updateURL https://update.greasyfork.org/scripts/502678/monkey-yunxiao.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" ._status-button-progress_byk0r_1{position:absolute;bottom:0;left:0;width:100%;height:2px;background:red;transition:width .5s}._working-hours-tips_byk0r_11{color:red;white-space:nowrap;height:100%;display:flex;align-items:center}._copy-btn-wrapper_byk0r_19{position:absolute;top:8px;right:0;display:flex;align-items:center;gap:4px;>div{cursor:pointer;border-radius:4px;padding:0 4px;background:#fff}} ");

(function (rxjs, dayjs) {
  'use strict';

  class ChainOfResponsibility {
    handlers;
    constructor() {
      this.handlers = [];
    }
    add(handler) {
      this.handlers.push(handler);
      handler.init?.();
      return this;
    }
    handleApi(params) {
      for (const handler of this.handlers) {
        if (handler.match(params.triggerURLPath)) {
          const task = handler.apiMaps.get(params.path);
          if (task) {
            console.log(
              `通过接口请求，触发了脚本: ${params.path} ===> ${handler.name}`
            );
            task(params.responseJSON);
          }
        }
      }
    }
  }
  const getUserInfo = /* @__PURE__ */ (() => {
    let promise;
    return async () => {
      if (promise) {
        return promise;
      }
      promise = fetch(`https://devops.aliyun.com/uiless/api/sdk/users/me`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "GET",
        credentials: "include"
      }).then((res) => res.json()).then((res) => {
        return {
          name: res.result.user.name,
          identifier: res.result.user.id
        };
      });
      return promise;
    };
  })();
  let isCheat = false;
  const initKeyBind = () => {
    const konami$ = [];
    const sub = rxjs.fromEvent(document, "keydown").pipe(
      rxjs.filter((e) => {
        konami$.push(e.key.toLocaleLowerCase());
        if (konami$.length > 10) {
          konami$.shift();
        }
        return konami$.join("") === "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba";
      })
    ).subscribe(() => {
      isCheat = true;
      sub.unsubscribe();
    });
  };
  const getAllMembers = /* @__PURE__ */ (() => {
    let allMembers;
    return async () => {
      if (allMembers) {
        return allMembers;
      }
      allMembers = fetch(
        "https://devops.aliyun.com/projex/api/workspace/space/recommend/member/list?pageSize=100&withDeletedAndDisabled=false",
        {
          credentials: "include"
        }
      ).then((res) => res.json()).then((res) => res.result);
      return allMembers;
    };
  })();

  const style = {
  	"status-button-progress": "_status-button-progress_byk0r_1",
  	"working-hours-tips": "_working-hours-tips_byk0r_11",
  	"copy-btn-wrapper": "_copy-btn-wrapper_byk0r_19"
  };

  const yunxiao = "data:image/svg+xml,%3csvg%20width='240'%20height='240'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient%20x1='50.007%25'%20y1='99.839%25'%20x2='50.007%25'%20y2='.339%25'%20id='a'%3e%3cstop%20stop-color='%23006ad4'%20stop-opacity='.5'%20offset='0%25'/%3e%3cstop%20stop-color='%23006ad4'%20stop-opacity='.2'%20offset='100%25'/%3e%3c/linearGradient%3e%3clinearGradient%20x1='50.035%25'%20y1='-.079%25'%20x2='50.035%25'%20y2='99.929%25'%20id='b'%3e%3cstop%20stop-color='%23006ad4'%20offset='0%25'/%3e%3cstop%20stop-color='%23006ad4'%20stop-opacity='.5'%20offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3crect%20width='240'%20height='240'%20rx='12'/%3e%3cg%20transform='translate(24%2024)'%20fill-rule='nonzero'%3e%3cpath%20d='m192%20191.774-67.621-89.901%2048.997-67.087-33.921-26.202-69.395%2093.74%2060.748%2080.64c4.213%205.648%2010.642%208.81%2017.737%208.81H192Z'%20fill='url(%23a)'/%3e%3cellipse%20fill='%23006ad4'%20cx='156.527'%20cy='21.685'%20rx='21.284'%20ry='21.685'/%3e%3cpath%20d='M124.379%20101.873%2061.413%2018.296c-4.212-5.647-10.642-8.809-17.736-8.809H0l69.838%2092.838L3.77%20192h43.012c7.094%200%2013.524-3.388%2017.736-9.035l59.862-81.092Z'%20fill='url(%23b)'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

  const match$1 = (path) => {
    return (
      // 任务视图
      /^\/projex\/project\/.+\/task/.test(path) || // 工作项视图
      /^\/projex\/workitem/.test(path) || // 工作台视图
      /^\/workbench$/.test(path)
    );
  };
  const apiMaps$1 = /* @__PURE__ */ new Map([
    [
      "/projex/api/workitem/workitem/list",
      (data) => {
        rxjs.interval(100).pipe(
          // 查询到元素存在后，停止轮询，并返回元素
          rxjs.map(() => {
            let dom = document.querySelector(
              "#AONE_MY_WORKITEM_CARD .next-table-inner"
            );
            let col = 1;
            let titleCol = 0;
            if (dom) {
              return {
                dom,
                col,
                titleCol
              };
            }
            dom = document.querySelector(
              ".workitemListMainAreaWrap .next-table-inner"
            );
            if (dom) {
              col = findColsNum(dom, "状态");
              titleCol = findColsNum(dom, "标题");
              return {
                dom,
                col,
                titleCol
              };
            }
            return void 0;
          }),
          rxjs.first((data2) => !!data2),
          rxjs.takeUntil(rxjs.timer(500))
        ).subscribe({
          next: ({ dom: target, col, titleCol }) => {
            if (target.getAttribute("init-progress")) {
              console.log("已经初始化过了");
              return;
            }
            target.setAttribute("init-progress", "true");
            const trList = target.querySelectorAll(
              ".next-table-body tr"
            );
            trList.forEach((tr, i) => {
              const dataItem = data.result[i];
              if (dataItem.workitemType.name !== "任务") return;
              const titleEl = tr.querySelector(
                `td[data-next-table-col="${titleCol}"] .next-table-cell-wrapper`
              );
              if (dataItem.parentWorkitem && titleEl) {
                const serialNumber = dataItem.parentWorkitem.parentSerialNumber;
                const title = dataItem.parentWorkitem.parentSubject.replaceAll(" ", "");
                const copyBtnWrapper = document.createElement("div");
                copyBtnWrapper.classList.add(style["copy-btn-wrapper"]);
                const txt = `${serialNumber}-${title}`;
                const copyBtn = document.createElement("div");
                copyBtn.innerText = "复制分支名称";
                copyBtn.addEventListener("click", () => {
                  navigator.clipboard.writeText(txt);
                });
                copyBtnWrapper.appendChild(copyBtn);
                titleEl.appendChild(copyBtnWrapper);
              }
              const btnEl = tr.querySelector(
                `td[data-next-table-col="${col}"] button`
              );
              const div = document.createElement("div");
              div.classList.add(style["status-button-progress"]);
              btnEl?.appendChild(div);
              const parentIdentifier = dataItem?.parentIdentifier;
              parentIdentifier && queryParentAndUpdateEl(parentIdentifier, div, dataItem);
            });
          }
        });
      }
    ]
  ]);
  function findColsNum(target, title) {
    const thList = target.querySelectorAll(
      ".next-table-header th"
    );
    for (let i = 0; i < thList.length; i++) {
      if (thList[i].innerText === title) {
        return i;
      }
    }
    return void 0;
  }
  let notCompletedTaskMap = /* @__PURE__ */ new Map();
  async function queryOtherTaskProgress(parentIdentifier, { identifier }) {
    const res = await fetch(
      `https://devops.aliyun.com/projex/api/workitem/v2/workitem/${parentIdentifier}/relation/workitem/list/by-relation-category?category=PARENT_SUB&isForward=true&_input_charset=utf-8`,
      {
        headers: {
          "Content-Type": "application/json"
        },
        method: "GET",
        credentials: "include"
      }
    ).then((res2) => res2.json());
    if (res.code !== 200) {
      return 0;
    }
    const taskList = res.result?.filter(
      (item) => item.workitemTypeName === "任务" && item.identifier !== identifier
    );
    if (!taskList?.length) {
      return 100;
    }
    const progress = taskList.length * 100;
    let completed = 0;
    taskList.forEach((task) => {
      const progressStr = task.fieldValueVOList.find(
        (field) => field.fieldIdentifier === "progress"
      )?.value;
      if (progressStr === "0.1") return;
      const n = Number(progressStr);
      if (n) {
        completed += n;
      }
    });
    return completed / progress * 100;
  }
  async function queryParentAndUpdateEl(parentIdentifier, dom, dataItem) {
    const progress = await queryOtherTaskProgress(parentIdentifier, {
      identifier: dataItem.identifier
    });
    dom.style.width = `${progress}%`;
    const userInfo = await getUserInfo();
    const userId = userInfo.identifier;
    if (userId === dataItem.assignedTo.identifier) {
      if (progress === 100) {
        notCompletedTaskMap.delete(dataItem.identifier);
      } else {
        if (!notCompletedTaskMap.has(dataItem.identifier)) {
          notCompletedTaskMap.set(dataItem.identifier, {
            subject: dataItem.subject,
            identifier: dataItem.identifier,
            spaceIdentifier: dataItem.spaceIdentifier,
            parentIdentifier
          });
        }
      }
    }
  }
  async function notificationTask([
    identifier,
    { subject, parentIdentifier, spaceIdentifier }
  ]) {
    try {
      const progress = await queryOtherTaskProgress(parentIdentifier, {
        identifier
      });
      if (progress === 100) {
        notCompletedTaskMap.delete(identifier);
        new Notification("其他任务进度已完成", {
          body: `任务：${subject} 的其他任务已完成，点击查看需求详情`,
          icon: yunxiao,
          requireInteraction: true
        }).addEventListener("click", () => {
          window.open(
            `https://devops.aliyun.com/projex/project/${spaceIdentifier}/req/${parentIdentifier}`
          );
        });
      }
    } catch {
      console.error("查询任务进度失败");
    }
  }
  rxjs.interval(1e3 * 60 * 10).pipe(
    rxjs.mergeMap(
      () => rxjs.from([...notCompletedTaskMap.entries()]).pipe(
        rxjs.mergeMap(notificationTask, 5)
      )
    )
  ).subscribe();
  const name$1 = "任务进度条";
  const taskHandler = {
    match: match$1,
    apiMaps: apiMaps$1,
    name: name$1
  };

  const workClassName = style["working-hours-tips"];
  async function getWorkingHours(userId) {
    if (userId) ; else {
      const { identifier } = await getUserInfo();
      userId = identifier;
    }
    const endTime = dayjs().format("YYYY-MM-DD");
    const startTime = dayjs().startOf("month").format("YYYY-MM-DD");
    return fetch(
      "https://devops.aliyun.com/metric/api/card/work-time/distribution-detail",
      {
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          projectIds: "",
          userIds: userId,
          startTime,
          endTime,
          tab: "time",
          pluginSourceProject: "projex",
          pluginType: "workTime",
          templateId: "",
          projectGroupIds: null,
          toPage: 1,
          pageSize: 40,
          keyWord: "",
          order: "desc",
          showCopyAndDownloadButton: false,
          sort: "",
          timeUsage: "arranged",
          types: "1,2,3",
          groupColumns: "default"
        }),
        method: "POST",
        mode: "cors",
        credentials: "include"
      }
    ).then((res) => res.json()).then((res) => {
      return res.result.content.map((e) => ({
        ...e,
        dateStr: dayjs(e.date).format("YYYY-MM-DD")
      }));
    });
  }
  async function updateWorkingHours(userId) {
    const list = await getWorkingHours(userId);
    let div = document.querySelector(`.${workClassName}`);
    if (!div) {
      div = document.createElement("div");
      div.classList.add(workClassName);
      div.addEventListener("click", async () => {
        if (isCheat) {
          const userName = window.prompt("请输入用户");
          const allMembers = await getAllMembers();
          const userId2 = allMembers.find((e) => e.name === userName)?._userId;
          await updateWorkingHours(userId2);
        } else {
          await updateWorkingHours();
        }
      });
      document.querySelector(".system-bar-middle")?.appendChild(div);
    }
    const todayWorkHours = list[list.length - 1]?.actualWorkTime || 0;
    const monthWorkHours = list.reduce((acc, cur) => acc + cur.actualWorkTime, 0);
    div.classList.add(workClassName);
    div.textContent = `[有几分钟延迟]今天工时: ${todayWorkHours} 小时, 这个月已累计: ${monthWorkHours.toFixed(2)} 小时（${(monthWorkHours / 4).toFixed(2)}个任务）`;
  }
  const init = () => {
    rxjs.timer(100).subscribe(() => {
      updateWorkingHours();
    });
  };
  const match = (path) => {
    return (
      // 工作项视图
      /^\/projex\/workitem/.test(path) || // 工作台视图
      /^\/projex\/project/.test(path)
    );
  };
  const apiMaps = /* @__PURE__ */ new Map([
    [
      "/projex/api/workitem/workitem/time",
      () => {
        rxjs.timer(5 * 60 * 1e3).subscribe(() => {
          updateWorkingHours();
        });
      }
    ]
  ]);
  const name = "工时统计";
  const workingHours = {
    match,
    apiMaps,
    name,
    init
  };

  const chain = new ChainOfResponsibility();
  chain.add(taskHandler).add(workingHours);
  const xhrOpen = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function(...args) {
    xhrOpen.apply(this, args);
    let triggerURLPath = location.pathname;
    this.addEventListener("readystatechange", function() {
      if (this.readyState === 4 && this.status === 200) {
        const path = new URL(this.responseURL).pathname;
        const responseJSON = this.responseType === "json" ? this.response : JSON.parse(this.responseText);
        chain.handleApi({
          path,
          responseJSON,
          triggerURLPath
        });
      }
    });
  };
  initKeyBind();

})(rxjs, dayjs);