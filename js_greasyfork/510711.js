// ==UserScript==
// @name         application
// @namespace    npm/vite-plugin-monkey
// @version      1.0.17
// @author       monkey
// @description  本地存储预览
// @license      MIT
// @icon         https://www.qianxin.com/favicon.ico
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/510711/application.user.js
// @updateURL https://update.greasyfork.org/scripts/510711/application.meta.js
// ==/UserScript==

(function() {
    'use strict';
  // ==UserScript==
// @name         application
// @namespace    npm/vite-plugin-monkey
// @version      1.0.15
// @author       monkey
// @description  本地存储预览
// @license      MIT
// @icon         https://www.qianxin.com/favicon.ico
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/510711/application.user.js
// @updateURL https://update.greasyfork.org/scripts/510711/application.meta.js
// ==/UserScript==

(function() {
    'use strict';
   async function getData(transaction, objectStoreName) {
    return new Promise((resolve, reject) => {
      let result = [];
      const obj = {};
      const objectStore = transaction.objectStore(objectStoreName);
      const request = objectStore.openCursor();
      request.onsuccess = function (event) {
        const target = event.target;
        const cursor = target.result;
        const table = target.source.name;
        const name = target.transaction.db.name;
        if (cursor) {
          obj[name] = cursor;
          result.push({
            type: "IndexDB",
            key: name + "_" + table + "_" + cursor.primaryKey,
            value: JSON.stringify(cursor.value),
          });
          cursor.continue();
        } else {
          if (!obj[name]) {
            result.push({
              type: "IndexDB",
              key: name + "_" + table,
              value: "",
            });
          }
          resolve(result);
        }
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  async function getOneData(db) {
    let res = null;
    let rej = null;
    const p = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    const transaction = await db.transaction(db.objectStoreNames, "readonly");
    let i = 0;
    let result = [];
    const obj = {};
    for (const objectStoreName of db.objectStoreNames) {
      const data = await getData(transaction, objectStoreName);
      result.push(...data);
    }
    res(result);
    return p;
  }

  async function getAllData() {
    let allData = [];
    const databases = await window.indexedDB.databases();
    for (const database of databases) {
      const db = await new Promise((resolve) => {
        const request = window.indexedDB.open(database.name, database.version);
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
      const data = await getOneData(db);
      allData.push(...data);
    }
    return allData;
  }
  class Application {
    constructor() {
      this.list = [];
      this.loading = false;
    }
    setHtml() {
      const container = document.createElement("div");
      container.className = "youhou-container";
      container.style.cssText =
        "position:fixed;bottom:40px;right:20px;z-index:999;font-family:Arial, Helvetica, sans-serif;font-size:12px;";
      const html =
        '<div class="youhou-box" style="line-height:16px;cursor:pointer;width:fit-content;border-radius:5px;font-size:12px;color:#fff;background:#000;padding:5px 10px;" title="双击查看">查看数据</div>';
      container.innerHTML = html;
      document.body.appendChild(container);
    }
    showTip(x, y, content) {
      const div = document.createElement("div");
      div.style.cssText =
        "position:fixed;top:20px;z-index:9999;text-align:center;color:#fff;background:#000;width:fit-content;padding:5px 10px;border-radius:5px;";
      div.style.left = x + "px";
      div.style.top = y + "px";
      document.body.appendChild(div);
      div.innerText = "复制成功";
      const moveAndChangeColor = [
        {
          transform: "translateY(0)",
        },
        {
          offset: 0.6,
          transform: "translateY(-60px)",
        },
        {
          transform: "translateY(-100px)",
        },
      ];
      const animation = div.animate(moveAndChangeColor, {
        duration: 1000,
        fill: "forwards",
        easing: "ease-in-out",
      });
      setTimeout(() => {
        document.body.removeChild(div);
        this.loading = false;
      }, 1000);
      this.addNotice(content);
    }

    addNotice(content) {
      try {
        GM_setClipboard(content);
      } catch (error) {
        console.log("error: ", error);
      }
    }

    setEvent() {
      const box = document.querySelector(".youhou-box");
      box.addEventListener("dblclick", (e) => {
        const div = document.createElement("div");
        const _this = this;
        const trs = this.list
          .map((v) => {
            return `
               <div style="border-bottom:1px solid #f5f5f5;padding:10px;display:flex;align-items:center;" class="youhou-box-tr">
                      <div style="width:120px">${v.type}</div>
                      <div style="width:150px;display:flex;align-items:center;position:relative;">
                          <div style="position:absolute;white-space:nowrap;width:-webkit-fill-available;overflow:hidden;text-overflow:ellipsis;" title='${v.key}'>
                            ${v.key}
                          </div>
                      </div>
                      <div style="flex:1;display:flex;align-items:center;position:relative;">
                          <div style="position:absolute;white-space:nowrap;width:-webkit-fill-available;overflow:hidden;text-overflow:ellipsis;" title='${v.value}'>
                            ${v.value}
                          </div>
                      </div>
                      <div style="width:100px">
                          <div class="youhou-box-copy" data-value='${v.value}' style="text-align:center;color:#fff;background:#000;cursor:pointer;border-radius:5px;padding:5px 10px;">复制</div>
                      </div>
                 </div>
              `;
          })
          .join("");
        div.innerHTML = `
            <div style="width:1200px;height:500px;background:#fff;padding:10px;overflow:auto;text-align:center;" class="youhou-box-table">
                  <div id="table111">
                       <div style="border-bottom:1px solid #f5f5f5;padding:10px;display:flex;align-items:center;font-weight:bold;">
                          <div style="width:120px">类型</div>
                          <div style="width:150px">键</div>
                          <div style="flex:1;">值</div>
                          <div style="width:100px">操作</div>
                     </div>
                  ${trs}
                 </div>
              </div>
            `;
        div.style.cssText =
          "display:flex;justify-content:center;align-items:center;position:fixed;z-index:9999;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);";
        div.onclick = () => {
          this.loading = false;
          document.body.removeChild(div);
        };
        document.body.appendChild(div);
        div
          .querySelector(".youhou-box-table")
          .addEventListener("click", (e) => {
            e.stopPropagation();
            if (e.target.className === "youhou-box-copy" && !this.loading) {
              const content = e.target.dataset.value;
              console.log("content: ", content);
              const x = e.clientX;
              const y = e.clientY;
              console.log(x, y);
              this.loading = true;
              this.showTip(x, y, content);
            }
          });
      });
      this.setMove();
    }
    setMove() {
      const draggableElement = document.querySelector(".youhou-container");
      let isDragging = false;
      let offsetX, offsetY;
      let w = document.documentElement.clientWidth;
      let h = document.documentElement.clientHeight;
      let elementRect = draggableElement.getBoundingClientRect();
      draggableElement.addEventListener("mousedown", startDragging);
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDragging);

      function startDragging(event) {
        if (event.target.className == "youhou-box") {
          isDragging = true;
          offsetX = event.clientX - draggableElement.offsetLeft;
          offsetY = event.clientY - draggableElement.offsetTop;
          event.preventDefault();
        }
      }

      function drag(event) {
        if (isDragging) {
          let x = event.clientX - offsetX;
          let y = event.clientY - offsetY;

          // 限制在容器范围内
          x = Math.max(0, Math.min(x, w - elementRect.width));
          y = Math.max(0, Math.min(y, h - elementRect.height));

          draggableElement.style.left = x + "px";
          draggableElement.style.top = y + "px";
        }
      }

      function stopDragging() {
        isDragging = false;
      }
    }
    async setData() {
      this.list = [];
      this.list.push({
        type: "cookie",
        key: "cookie",
        value: document.cookie,
      });
      Object.keys(localStorage).forEach((key) => {
        this.list.push({
          type: "localStorage",
          key: key,
          value: localStorage.getItem(key),
        });
      });
      Object.keys(sessionStorage).forEach((key) => {
        this.list.push({
          type: "sessionStorage",
          key: key,
          value: sessionStorage.getItem(key),
        });
      });
      try {
        const list = await getAllData();
        this.list.push(...list);
        console.log('this.list: ', this.list);
      } catch(err) {
        console.log("err: ", err);
      }
    }
    render() {
      this.setHtml();
      this.setEvent();
      this.setData();
      window.onresize = () => {
        const draggableElement = document.querySelector(".youhou-container");
        if (draggableElement) {
          draggableElement.remove();
        }
        this.setHtml();
        this.setEvent();
        this.setData();
      };
    }
  }
  const app = new Application();
  app.render();
})();
})();