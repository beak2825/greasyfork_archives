// ==UserScript==
// @name         application
// @namespace    npm/vite-plugin-monkey
// @version      1.0.10
// @author       monkey
// @description  本地存储预览
// @license      MIT
// @icon         https://www.qianxin.com/favicon.ico
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/510710/application.user.js
// @updateURL https://update.greasyfork.org/scripts/510710/application.meta.js
// ==/UserScript==

(function() {
    'use strict';
  class Application {
    constructor() {
      this.list = [];
      this.loading = false;
    }
    setHtml() {
      const container = document.createElement("div");
      container.className = "youhou-container";
      container.style.cssText =
        "position:fixed;bottom:20px;right:20px;z-index:999;";
      const html = '<div class="youhou-box">查看数据</div>';
      container.innerHTML = html;
      document.body.appendChild(container);
    }
    setStyle() {
      const style = `
                .youhou-box {
                  width: fit-content;
                  font-size: 12px;
                  color: #fff;
                  background:#000;
                  padding: 5px 10px;
                  border-radius: 5px;
                  cursor: pointer;
                }
                `;
      const styleTag = document.createElement("style");
      styleTag.innerHTML = style;
      document.head.appendChild(styleTag);
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
        GM_notification({
          title: "复制成功",
          image: "图像链接",
          text: content,
          highlight: true, // 布尔值，是否突出显示发送通知的选项卡
          silent: false, // 布尔值，是否播放声音
          timeout: 1000, // 设置通知隐藏时间
          onclick: function () {
            console.log("click");
          },
          ondone() {
            console.log("close");
          },
        }); // 在通知关闭（无论这是由超时还是单击触发）或突出显示选项卡时调用
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
               <tr style="border-bottom:1px solid #f5f5f5;padding:10px;" class="youhou-box-tr">
                      <td>${v.type}</td>
                      <td>${v.key}</td>
                      <td style="position:relative;text-align:center;display:block;border:none;">
                          <div style="position:absolute;white-space:nowrap;width:-webkit-fill-available;overflow:hidden;text-overflow:ellipsis;" title='${v.value}'>
                            ${v.value}
                          </div>
                      </td>
                      <td>
                          <div class="youhou-box-copy" data-value='${v.value}' style="color:#fff;background:#000;cursor:pointer;border-radius:5px;padding:5px 10px;">复制</div>
                      </td>
                 </tr>
              `;
          })
          .join("");
        div.innerHTML = `
            <div style="width:1200px;height:500px;background:#fff;padding:10px;overflow:auto" class="youhou-box-table">
                  <table id="table111" align="center"  cellspacing="0" cellpadding="10" style="table-layout:auto;border-collapse: collapse;text-align:center;width:100%;">
                       <tr style="border-bottom:1px solid #f5f5f5;padding:10px;">
                          <th width="100">类型</th>
                          <th width="100">键</th>
                          <th>值</th>
                          <th width="100">操作</th>
                     </tr>
                  ${trs}
                 </table>
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
              // navigator.clipboard.writeText(e.target.dataset.value);
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
        console.log("vent.target: ", event.target.className);
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
    setData() {
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
    }
    render() {
      this.setHtml();
      this.setStyle();
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