// ==UserScript==
// @name         Download QGIS Customizable SVG
// @namespace    http://github.com/liuxspro/
// @version      0.1.0
// @description  下载 iconfont SVG 图标为 QGIS 可调整参数的 SVG 图标
// @author       Liuxspro
// @license      MIT
// @homepage     https://gist.github.com/liuxspro/052d180ed5667560a5f9d4eda11a8b0a
// @match        https://www.iconfont.cn/collections/detail*
// @match        https://www.iconfont.cn/search/index*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02MC4yNTcyIDYxLjc1NTZMMjYuNTA3MiAyOC4wMDU2SDM1Ljg4MjJMNjAuMjU3MiA1Mi4zODA2TDYwLjI1NzIgNTIuMzgwNVY2MS43NTU2WiIgZmlsbD0iI0YxOEQzNiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI2LjUwNzIgMjguMDA1Nkw2MC4yNTcyIDYxLjc1NTZMNTAuODgyMiA2MS43NTU2TDI2LjUwNzIgMzcuMzgwNkwyNi41MDcyIDI4LjAwNTZaIiBmaWxsPSIjRUU3OTEzIi8+CjxwYXRoIGQ9Ik0zNC4zIDM1LjgxOTFMMzguMDQwNyAzOS41MjU2VjQ4Ljk0OTJMMzQuMyA0NS4xOTEyVjM1LjgxOTFaIiBmaWxsPSIjRjBFNjRBIi8+CjxwYXRoIGQ9Ik00Ny40MzAxIDM5LjU1OThMNDMuNjcyMSAzNS44MTkxTDM0LjMgMzUuODE5MUwzOC4wMzA2IDM5LjU1OThMNDcuNDMwMSAzOS41NTk4WiIgZmlsbD0iI0YyRUE2NSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTU4LjI1NzggNDYuNTIxQzYwLjY0MjMgNDIuMjE4MyA2MiAzNy4yNjc3IDYyIDMyQzYyIDE1LjQzMTUgNDguNTY4NSAyIDMyIDJDMTUuNDMxNSAyIDIgMTUuNDMxNSAyIDMyQzIgNDguNTY4NSAxNS40MzE1IDYyIDMyIDYyQzM2LjQ2MTEgNjIgNDAuNjk0NyA2MS4wMjYzIDQ0LjUgNTkuMjc5OEwzNS4yNjg3IDUwLjA0ODVDMzQuMjA4IDUwLjIzOTMgMzMuMTE1NiA1MC4zMzg5IDMyIDUwLjMzODlDMjEuODcxNyA1MC4zMzg5IDEzLjY2MTEgNDIuMTI4MyAxMy42NjExIDMyQzEzLjY2MTEgMjEuODcxNyAyMS44NzE3IDEzLjY2MTEgMzIgMTMuNjYxMUM0Mi4xMjgzIDEzLjY2MTEgNTAuMzM4OSAyMS44NzE3IDUwLjMzODkgMzJDNTAuMzM4OSAzMy45ODk3IDUwLjAyMjEgMzUuOTA1NCA0OS40MzYxIDM3LjY5OTNMNTguMjU3OCA0Ni41MjFaIiBmaWxsPSIjN0RBNjI5Ii8+Cjwvc3ZnPgo=
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498362/Download%20QGIS%20Customizable%20SVG.user.js
// @updateURL https://update.greasyfork.org/scripts/498362/Download%20QGIS%20Customizable%20SVG.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 参考资料:
   * https://github.com/qgis/QGIS/blob/9a800b49983ae266af1264e198b5fc433fdeaa9b/src/core/symbology/qgssvgcache.h#L105
   * https://www.w3.org/TR/2009/WD-SVGParamPrimer-20090616/
   * [教会你自定义SVG样式【文末附福利】](https://mp.weixin.qq.com/s/i9FvQrDlGUNdXT6kLoQxNg)
   * fill="param(fill)" fill-opacity="param(fill-opacity)"
   * stroke="param(outline)" stroke-opacity="param(outline-opacity)" stroke-width="param(outline-width)"
   */

  function tweak_svg(svg) {
    const fill = svg.getAttribute("fill");
    // 设置为 QGIS 可自定义的属性
    svg.setAttribute("fill", "param(fill)");
    svg.setAttribute("fill-opacity", "param(fill-opacity)");
    svg.setAttribute("stroke", "param(outline)");
    svg.setAttribute("stroke-opacity", "param(outline-opacity)");
    svg.setAttribute("stroke-width", "param(outline-width)");
    if (fill) {
      // 将原来的 fill 颜色作为默认值保留
      svg.setAttribute("fill", `param(fill) ${fill}`);
    }
  }

  function download() {
    const svgElement = document.querySelector("div.stage svg");
    const titleElement = document.querySelector("div.top-title span");
    let filename = "download.svg";
    if (titleElement) {
      filename = titleElement.innerText + "_QGIS";
    }
    if (svgElement) {
      const svgClone = svgElement.cloneNode(true);
      svgClone.removeAttribute("style");

      const elementsPath = svgClone.querySelectorAll("path");

      // 不止一条 Path 的时候，需要至少选择一条 Path 作为调整的对象
      if (elementsPath.length > 1) {
        const selectedPaths = Array.from(elementsPath).filter((path) => path.classList.contains("selected"));
        if (selectedPaths.length == 0) {
          alert("当前 SVG 图标有多条 PATH, 请至少选择一条");
          return;
        }
        selectedPaths.forEach((el) => {
          tweak_svg(el);
        });
      } else if (elementsPath.length == 1) {
        elementsPath.forEach((el) => {
          tweak_svg(el);
        });
      }

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert("SVG element not found");
    }
  }
  function add_download_btn() {
    const btn_container = document.querySelectorAll("div.download-btns")[0];
    if (btn_container && !btn_container.querySelector(".qgis-btn")) {
      const qgis_svg_download_btn = document.createElement("span");
      qgis_svg_download_btn.classList = "btn btn-normal qgis-btn";
      qgis_svg_download_btn.innerText = "下载 QGIS SVG";
      qgis_svg_download_btn.onclick = download;
      btn_container.appendChild(qgis_svg_download_btn);
    }
  }

  // MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        const d = mutation.addedNodes[0];
        if (d.classList.contains("download-dialog")) {
          observer2.observe(d, config);
        }
      }
    });
  });

  const observer2 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      observer2.disconnect();
      add_download_btn(document.body);
      observer2.observe(mutation.target, config);
    });
  });

  // Configuration of the observer
  const config = {
    attributes: false,
    childList: true,
    subtree: true,
  };

  // Start observing the target node for configured mutations
  const targetNode = document.body;
  observer.observe(targetNode, config);
})();
