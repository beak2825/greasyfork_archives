"use strict";
// ==UserScript==
// @name         PD / VD
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  try to take over the world!
// @author       You
// @match        https://torbjorn.xcbiaozhu.saicsdv.com/*
// @match        https://*.startask.net/*
// @icon         https://www.google.com/s2/favicons?domain=saicsdv.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432006/PD%20%20VD.user.js
// @updateURL https://update.greasyfork.org/scripts/432006/PD%20%20VD.meta.js
// ==/UserScript==
// https://stardustai.notion.site/f9788a87f0b547acbbc91999b0076a08?v=9c7e1c2a204443849e652c241dfeb248
async function getType(projectId) {
    const mapping = (await (await fetch("https://echo-apps.oss-cn-beijing.aliyuncs.com/notions/chrome_extension_pdvd.json")).json());
    const result = mapping.find((s) => s.ProjectID === projectId);
    if (result == null) {
        throw new Error(`该项目${projectId}没有配置PD/VD，请联系管理员`);
    }
    return result.Type;
}
async function getPDVD() {
    // @ts-ignore
    const store = window._annotationStore;
    if (store == null) {
        return;
    }
    if (store.taskParams.record.attachmentType !== "IMAGE") {
        return;
    }
    store.ui.alertWarning("获取照片中, 请耐心等待...");
    try {
        const type = await getType(store.info.projectId.toString());
        const url = `https://1521335688226052.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/lambda-python-fc/shangqi-pd-vd/${type.toLowerCase()}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                url: store.taskParams.record.attachment,
                annotations: store.taskResult.annotations,
            }),
        });
        const result = await response.json();
        store.ui.alertSuccess("获取成功。");
        showImage(result.url);
    }
    catch (error) {
        store.ui.alertError(error.message);
    }
}
let imgDiv;
function showImage(url) {
    const css = ((a) => a);
    if (imgDiv != null) {
        imgDiv.parentElement?.removeChild(imgDiv);
    }
    if (url == null) {
        return;
    }
    imgDiv = document.createElement("div");
    imgDiv.setAttribute("class", "absolute inset-0 h-screen w-screen");
    imgDiv.setAttribute("style", css `
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(10px);
    `);
    const img = document.createElement("img");
    img.setAttribute("class", "object-contain w-full h-full pointer-events-none select-none");
    img.setAttribute("src", url);
    let zoom = 1;
    let left = 0;
    let top = 0;
    let dragX;
    let dragY;
    function render() {
        img.setAttribute("style", `transform: translateX(${left}px) translateY(${top}px) scale(${zoom}); transform-origin: top left;`);
    }
    imgDiv.addEventListener("mousemove", (ev) => {
        if (dragY == null || dragX == null || ev.button !== 0) {
            return;
        }
        left += ev.clientX - dragX;
        top += ev.clientY - dragY;
        dragX = ev.clientX;
        dragY = ev.clientY;
        render();
    });
    imgDiv.addEventListener("mousedown", (ev) => {
        dragX = ev.clientX;
        dragY = ev.clientY;
        console.log("mouse down");
    });
    imgDiv.addEventListener("mouseup", (ev) => {
        dragX = undefined;
        dragY = undefined;
    });
    imgDiv.addEventListener("wheel", (e) => {
        e.preventDefault();
        const newZoom = zoom - (zoom * e.deltaY) / 2000;
        const x = (e.clientX - left) / zoom;
        const y = (e.clientY - top) / zoom;
        left -= x * (newZoom - zoom);
        top -= y * (newZoom - zoom);
        zoom = newZoom;
        render();
    });
    imgDiv.appendChild(img);
    const button = document.createElement("button");
    button.textContent = "关闭";
    button.setAttribute("style", css `
      position: absolute;
      left: 50%;
      bottom: 20px;
      background-color: white;
      border-radius: 5px;
      padding: 5px 10px;
      transform: translateX(-50%);
    `);
    button.addEventListener("click", () => {
        showImage();
    });
    imgDiv.appendChild(button);
    document.body.appendChild(imgDiv);
}
(function () {
    "use strict";
    addEventListener("keyup", (ev) => {
        if (ev.key === "q") {
            getPDVD().catch();
        }
        if (ev.key === 'Escape') {
            showImage();
        }
    });
})();
