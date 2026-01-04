// ==UserScript==
// @name       jenkins 跳转 deploy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  跳转 deploy
// @author       liushipeng
// @match        http://192.168.9.10:8082/job/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9.10
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480319/jenkins%20%E8%B7%B3%E8%BD%AC%20deploy.user.js
// @updateURL https://update.greasyfork.org/scripts/480319/jenkins%20%E8%B7%B3%E8%BD%AC%20deploy.meta.js
// ==/UserScript==

let config;

(function () {
  config = document.createElement("div");
  config.className = "aaa";
  document.body.appendChild(config);

  const url = new URL(window.location.href);

  // 单当前服务名字
  const serveName = findServeName(url.pathname);
  if (!serveName) {
    return;
  }

  // 是  deploy
  const isDeploy = serveName.includes("deploy");

  if (isDeploy) {
    const newServeName = serveName.replace("deploy", "build");
    url.pathname = `/job/${newServeName}/build`;
  } else {
    const newServeName = serveName.replace("build", "deploy");
    url.pathname = `/job/${newServeName}/build`;
  }

  createStopBtn(isDeploy ? "build" : "deploy", () => {
    window.location.href = url;
  });
})();

function findServeName(pathname) {
  const serveList = pathname.split("/");
  const serveIndex = serveList.findIndex((item) => item.includes("job"));

  if (serveIndex === -1 || serveIndex > serveList.length - 2) {
    return false;
  }
  return serveList[serveIndex + 1];
}

function createStopBtn(str, fn) {
  // 创建容器元素
  const container = document.createElement("div");
  container.className = "containerLiu";
  container.addEventListener("click", () => {
    fn?.();
  });

  // 创建按钮元素
  const button = document.createElement("button");
  button.className = "button";
  button.textContent = str ?? "stop";

  // 将按钮添加到容器中
  container.appendChild(button);

  const style = document.createElement("style");
  const theHead = document.head || document.getElementsByTagName("head")[0];
  style.appendChild(
    document.createTextNode(
      `.aaa{display:flex;gap:40px;position:fixed;left:30%;top:50px;z-index:999;}.containerLiu{font-size:12px;width:46px;height:42px;background-color:#644dff;overflow:hidden;border-radius:100%;display:flex;justify-content:center;align-items:center;transform:scale(1.5) translateX(-25%);box-shadow:0 8px 2px #4836bb;transition:all .1s ease;filter:drop-shadow(0 6px 2px rgba(72,54,187,0.22));border:1px solid #4836bb}.button{padding:0; cursor:pointer;position:absolute;height:110%;width:110%;background-color:#644dff;color:white}.container:has(.button:active){box-shadow:none;margin-top:32px;filter:drop-shadow(0 3px 1px rgba(72,54,187,0.75))}`
    )
  );
  theHead.appendChild(style);

  // 将容器添加到文档中的适当位置
  config.appendChild(container);
}
