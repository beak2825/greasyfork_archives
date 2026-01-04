// ==UserScript==
// @name         Biliplus Chrome 整本下载
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Biliplus Chrome 整本下载，需要在https://www.biliplus.com/manga/?act=detail&mangaid=类似详情页下载
// @author       Aoba Xu
// @match        https://www.biliplus.com/manga/?act=detail&mangaid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=biliplus.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493691/Biliplus%20Chrome%20%E6%95%B4%E6%9C%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/493691/Biliplus%20Chrome%20%E6%95%B4%E6%9C%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const createStyles = () => {
    const style = document.createElement("style");
    style.innerText += `.b-toolbox-d-flex { display: flex } .b-toolbox-d-none { display: none } .b-toolbox-flex-column { flex-direction: column }`;
    document.head.append(style);
    return {
      element: style,
      addStyle: (newStyle) => {
        style.innerText += newStyle;
      },
    };
  };
  const styles = createStyles();
  const createPopupPanel = (styles) => {
    const panel = document.createElement("div");
    styles.addStyle(
      `.b-toolbox-popup { top:70px; right: 1rem; position: fixed; border-radius: 6px; max-height: 50% }`
    );
    panel.className = "b-toolbox-popup b-toolbox-d-flex";
    document.body.append(panel);
    return panel;
  };
  const popupPanel = createPopupPanel(styles);
  const createToolboxPanel = (parentPanel, styles) => {
    const panel = document.createElement("div");
    styles.addStyle(
      `.b-toolbox-panel { margin-right: 1.5rem; background: rgba(255, 255, 255, 0.8); padding: 1rem; gap: 1rem }`
    );
    panel.className = "b-toolbox-panel b-toolbox-d-none b-toolbox-flex-column";
    parentPanel.append(panel);
    return panel;
  };
  const toolboxPanel = createToolboxPanel(popupPanel, styles);
  const createToolboxShowBtn = (parentPanel, showablePanel, styles) => {
    const container = document.createElement("div");
    container.className = "b-toolbox-d-flex b-toolbox-flex-column";
    parentPanel.append(container);
    const btn = document.createElement("button");
    btn.role = "button";
    btn.insertAdjacentHTML("beforeEnd", "<div>工具箱</div>");
    styles.addStyle(
      `.b-toolbox-toolbox-btn { align-items: center; background-color: #32aaff; border: none; border-radius: 6px; color: #fff; cursor: pointer; display: flex; justify-content: center; padding: 1rem 0.5rem }`
    );
    btn.className += "b-toolbox-toolbox-btn";
    container.append(btn);
    btn.onclick = () => {
      showablePanel.classList.toggle("b-toolbox-d-none");
      showablePanel.classList.toggle("b-toolbox-d-flex");
    };
  };
  createToolboxShowBtn(popupPanel, toolboxPanel, styles);
  const createStatusDisplay = (parentPanel) => {
    const panel = document.createElement("div");
    panel.className = "b-toolbox-d-flex b-toolbox-flex-column";
    panel.style.overflow = "auto";
    panel.insertAdjacentHTML("beforeEnd", "<div>等待任务</div>");
    parentPanel.append(panel);
    let timer = 0;
    const complete = () => {
      panel.insertAdjacentHTML("beforeEnd", "<div>已完成</div>");
      timer = setTimeout(() => {
        panel.innerHTML = "";
        panel.insertAdjacentHTML("beforeEnd", "<div>等待任务</div>");
      }, 2000);
    };
    return {
      element: panel,
      complete,
      clear: () => {
        clearTimeout(timer);
        panel.innerHTML = "";
        panel.insertAdjacentHTML("beforeEnd", "<div>等待任务</div>");
      },
      addStatus: (status) => {
        panel.insertAdjacentHTML("beforeEnd", `<div>${status}</div>`);
      },
    };
  };
  const statusDisplay = createStatusDisplay(toolboxPanel);
  const safeFileName = (name) => {
    return name.replace(/[\\/:*?"<>|]/g, "_").replace(/\.\.$/, "_");
  };
  const createDownloadBtn = (parentPanel, statusDisplay) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.insertAdjacentHTML("beforeEnd", "<div>下载本书已购内容</div>");
    btn.className += "b-toolbox-toolbox-btn";
    parentPanel.append(btn);
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const { storage, needExport } = (() => {
        if (window.showDirectoryPicker) {
          return {
            storage: window.showDirectoryPicker({
              id: "b-toolbox-download-folder",
              startIn: "desktop",
              mode: "readwrite",
            }),
            needExport: false,
          };
        } else {
          return {
            storage: navigator.storage.getDirectory(),
            needExport: true,
          };
        }
      })();
      if (needExport) {
        statusDisplay.addStatus(`暂不支持导出`);
        statusDisplay.complete();
      }
      const epList = Array.from(
        document.querySelectorAll(".contents-full>a.episode:not(.locked)")
      ).map((x) => ({
        url: x.href,
        title: x.innerText,
      }));
      statusDisplay.addStatus(`共${epList.length}个章节`);
      if (epList.length === 0) {
        statusDisplay.addStatus(`无需下载`);
        statusDisplay.complete();
        btn.disabled = false;
        return;
      }
      const dir = await storage;
      const comicFolder = await dir.getDirectoryHandle(
        safeFileName(document.querySelector("h3").innerText),
        {
          create: true,
        }
      );
      const docParser = new DOMParser();
      for (let i = 0; i < epList.length; i++) {
        const ep = epList[i];
        statusDisplay.addStatus(`正在下载第${i + 1}话 ${ep.title}`);
        const res = await fetch(ep.url, {
            method: "GET",
            credentials: "include",
        });
        const text = await res.text();
        const subDoc = docParser.parseFromString(text, "text/html");
        const downloadUrls = Array.from(
          subDoc.querySelectorAll("img.comic-single")
        ).map((x) => x.attributes._src.nodeValue);
        console.log(subDoc.querySelectorAll("img.comic-single"));
        console.log(downloadUrls);
        const epFolder = await comicFolder.getDirectoryHandle(
          safeFileName(ep.title),
          {
            create: true,
          }
        );
        const padding = Math.ceil(Math.log10(downloadUrls.length));
        const tasks = downloadUrls.map(async (url, j) => {
          const file = await epFolder.getFileHandle(
            `${(j + 1).toString().padStart(padding, "0")}.jpg`,
            { create: true }
          );
          const writable = await file.createWritable();
          const res = await fetch(url);
          await res.body.pipeTo(writable);
        });
        await Promise.all(tasks);
        const delay = Math.floor(Math.random() * 1000) + 500;
        statusDisplay.addStatus(`等待${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      if (needExport) {
        statusDisplay.addStatus(`导出下载文件`);
      }
      statusDisplay.complete();
      btn.disabled = false;
    });
  };
  createDownloadBtn(toolboxPanel, statusDisplay);
})();
