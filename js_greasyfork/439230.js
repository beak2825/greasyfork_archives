// ==UserScript==
// @name         电百网PDF在线下载
// @namespace    https://userscript.snomiao.com/
// @version      v2020.08.14
// @description  [电百网PDF在线下载] 注：本脚本仅是一个操作指导，并没有自动实现具体功能。脚本仅供学习研究计算机技术使用，严禁用于非法行为。
// @author       snomiao@gmail.com
// @match        https://www.ceppedu.com/home/pdf-preview-web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439230/%E7%94%B5%E7%99%BE%E7%BD%91PDF%E5%9C%A8%E7%BA%BF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/439230/%E7%94%B5%E7%99%BE%E7%BD%91PDF%E5%9C%A8%E7%BA%BF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
//
// Copyright © 2020 snomiao 转载请注明出处
//

console.log(
  "[电百网PDF在线下载] 注：本脚本仅是一个操作指导，并没有自动实现具体功能。脚本仅供学习研究计算机技术使用，严禁用于非法行为。"
);

() => {
  ```
    打开开发者工具
    点 Source
    找到 UIExtension.full.****.js
    搜索 ZoomInAndOutController
    在后面的 handle 函数内部，配置 断点
    点一下缩小的放大镜，此时将停在断点处
    打开控制台，执行下面的代码
    ```;

  _this = this;

  ```
    然后点继续执行（离开断点）
    然后执行下面代码，即可下载到 pdf 文件
    ```;

  function createAndDownloadBlobFile(
    arrayBuffers,
    filename,
    extension = "pdf"
  ) {
    const blob = new Blob(arrayBuffers);
    const fileName = `${filename}.${extension}`;
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  var o = (function () {
    return function (t, e) {
      if (Array.isArray(t)) return t;
      if (Symbol.iterator in Object(t))
        return (function (t, e) {
          var n = [],
            o = !0,
            r = !1,
            i = void 0;
          try {
            for (
              var a, s = t[Symbol.iterator]();
              !(o = (a = s.next()).done) &&
              (n.push(a.value), !e || n.length !== e);
              o = !0
            );
          } catch (t) {
            (r = !0), (i = t);
          } finally {
            try {
              !o && s.return && s.return();
            } finally {
              if (r) throw i;
            }
          }
          return n;
        })(t, e);
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    };
  })();

  Object.entries(window).map((e) => e[1].getPDFUI);
  _this
    .getPDFUI()
    .getPDFViewer()
    .then(function (t) {
      var e = [];
      return t.currentPDFDoc
        .getStream(function (t) {
          var n = t.arrayBuffer;
          e.push(n);
        })
        .then(function (n) {
          return [e, t.currentPDFDoc.getFileName()];
        });
    })
    .then(function (e) {
      var n = o(e, 2);
      createAndDownloadBlobFile(n[0], n[1]);
    });
};
