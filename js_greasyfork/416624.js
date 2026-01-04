// ==UserScript==
// @name         Github 极速
// @version      0.0.0
// @author       Lxtyr
// @description  高速下载 Clone、Release、Raw、Code(ZIP) 等文件、项目列表单文件快捷下载 (☁)
// @include       *://github.com/*
// @include       *://github*
// @include       *://hub.fastgit.org/*
// @icon         https://github.githubassets.com/favicon.ico
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://greasyfork.org/scripts/412245
// @downloadURL https://update.greasyfork.org/scripts/416624/Github%20%E6%9E%81%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/416624/Github%20%E6%9E%81%E9%80%9F.meta.js
// ==/UserScript==

function log() {
  console.log("=== [github-ultra] ===", ...arguments);
}

(function () {
  ("use strict");

  var removeGithubDesktop = true;

  var cloneUrl = [
      "https://hub.fastgit.org/",
      "https://gitclone.com/github.com/",
      "https://github.com.cnpmjs.org/",
      "https://g.ioiox.com/https://github.com/",
    ],
    downloadUrl = [
      ["https://gh.con.sh/https://github.com", "美国"],
      ["https://gh.api.99988866.xyz/https://github.com", "美国"],
      ["https://download.fastgit.org", "日本东京"],
      ["https://pd.zwc365.com/seturl/https://github.com", "中国香港"],
      ["https://g.ioiox.com/https://github.com", "中国香港"],
      ["https://git.yumenaka.net/https://github.com", "美国洛杉矶"],
      ["https://github.wuyanzheshui.workers.dev", "CF加速 1"],
      ["https://github.rc1844.ml", "CF加速 2"],
    ],
    mirrorUrl = [
      ["https://hub.fastgit.org/", "FastGit"],
      ["https://github.com.cnpmjs.org/", "Cnpmjs"],
      ["https://github.wuyanzheshui.workers.dev/", "CF加速 1"],
      ["https://github.rc1844.ml/", "CF加速 2"],
      ["https://github.bajins.com/", "Bajins"],
      ["https://cdn.jsdelivr.net/gh/", "jsDelivr"],
    ],
    rawUrl = [
      ["https://cdn.jsdelivr.net/gh/", "中国国内", "@"],
      ["https://raw.fastgit.org", "中国香港", "/"],
      [
        "https://git.yumenaka.net/https://raw.githubusercontent.com",
        "美国洛杉矶",
        "/",
      ],
      ["https://github.bajins.com", "Bajins"],
      ["https://github.wuyanzheshui.workers.dev", "CF加速 1"],
      ["https://github.rc1844.ml", "CF加速 2"],
      ["https://cdn.staticaly.com/gh", "staticaly"],
    ],
    svg = [
      '<svg class="octicon octicon-file-zip mr-3" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.5 1.75a.25.25 0 01.25-.25h3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h2.086a.25.25 0 01.177.073l2.914 2.914a.25.25 0 01.073.177v8.586a.25.25 0 01-.25.25h-.5a.75.75 0 000 1.5h.5A1.75 1.75 0 0014 13.25V4.664c0-.464-.184-.909-.513-1.237L10.573.513A1.75 1.75 0 009.336 0H3.75A1.75 1.75 0 002 1.75v11.5c0 .649.353 1.214.874 1.515a.75.75 0 10.752-1.298.25.25 0 01-.126-.217V1.75zM8.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM6 5.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 016 5.25zm2 1.5A.75.75 0 018.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 6.75zm-1.25.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM8 9.75A.75.75 0 018.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 018 9.75zm-.75.75a1.75 1.75 0 00-1.75 1.75v3c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75v-3a1.75 1.75 0 00-1.75-1.75h-.5zM7 12.25a.25.25 0 01.25-.25h.5a.25.25 0 01.25.25v2.25H7v-2.25z"></path></svg>',
      '<svg class="octicon octicon-clippy" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg>',
      '<svg class="octicon octicon-cloud-download" aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M9 12h2l-3 3-3-3h2V7h2v5zm3-8c0-.44-.91-3-4.5-3C5.08 1 3 2.92 3 5 1.02 5 0 6.52 0 8c0 1.53 1 3 3 3h3V9.7H3C1.38 9.7 1.3 8.28 1.3 8c0-.17.05-1.7 1.7-1.7h1.3V5c0-1.39 1.56-2.7 3.2-2.7 2.55 0 3.13 1.55 3.2 1.8v1.2H12c.81 0 2.7.22 2.7 2.2 0 2.09-2.25 2.2-2.7 2.2h-2V11h2c2.08 0 4-1.16 4-3.5C16 5.06 14.08 4 12 4z"></path></svg>',
    ],
    style = [
      "padding:0 6px;margin-right: -1px;border-radius: 2px;background-color: #ffffff;border-color: rgba(27, 31, 35, 0.1);font-size: 11px;color: #888888;",
    ];
  var hrefs = location.href.split("/"),
    namespace = hrefs[3] + "/" + hrefs[4];
  addGitClone(); // Download ZIP/Code(ZIP) 加速
  addDownloadZIP();
  addMirror();
  addRelease();
  addRawFile();
  document.addEventListener("pjax:success", function () {
    // pjax 事件发生后
    addGitClone(); // Download ZIP/Code(ZIP) 加速
    addDownloadZIP();
    addMirror();
    addRelease();
    addRawFile();
  });

  // Git Clone
  function addGitClone() {
    $("[role='tabpanel'] div.input-group")
      .first()
      .each(function () {
        var url = cloneUrl.map(function (url) {
            return url + namespace + ".git";
          }),
          html = url
            .map(function (u) {
              return `<div class="input-group" style="margin-top: 4px;"><input value="${u}" aria-label="${u}" type="text" class="form-control input-monospace input-sm bg-gray-light" data-autoselect="" readonly=""><div class="input-group-button"><clipboard-copy value="${u}" aria-label="Copy to clipboard" class="btn btn-sm" tabindex="0" role="button">${svg[1]}</clipboard-copy></div></div>`;
            })
            .concat("");
        $(this).after(html);
      });
  }

  // Download ZIP
  function addDownloadZIP() {
    if (removeGithubDesktop) {
      $(".dropdown-menu.dropdown-menu-sw.p-0 ul li:first-child").remove();
    }
    var $link = $(".dropdown-menu.dropdown-menu-sw.p-0 ul li:last-child");
    var href = $link.children("a").attr("href"),
      html = downloadUrl
        .map(function (set) {
          return `<li class="Box-row Box-row--hover-gray p-0"><a class="d-flex flex-items-center text-gray-dark text-bold no-underline p-3" rel="noreferrer noopener nofollow" href="${
            set[0] + href
          }">${svg[0]}Download ZIP (${set[1]})</a></li>`;
        })
        .join("");
    $link.after(html);
  }

  function addMirror() {
    var start = `<details class="details-overlay details-reset position-relative d-block">
      <summary role="button" type="button" class="btn ml-2">
        <span class="d-none d-md-flex flex-items-center">
              镜像浏览
              <span class="dropdown-caret ml-1"></span>
            </span>
            <span class="d-inline-block d-md-none">
              <svg aria-label="More options" class="octicon octicon-kebab-horizontal" height="16" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
            </span>
      </summary>
    <div>
        <ul class="dropdown-menu dropdown-menu-sw">
    `;

    mirrorUrl.forEach((element, idx) => {
      if (idx < 5) {
        start += `<li><a href="${
          element[0] + namespace
        }" class="dropdown-item">镜像浏览(${element[1]})</a></li>`;
      }
    });
    if (
      hrefs.length == 5 ||
      namespace.includes("/tree/") ||
      namespace.includes("/blob/")
    ) {
      var Html =
        mirrorUrl[5][0] +
        namespace.replace("/tree/", "@").replace("/blob/", "@");
      if (!namespace.includes("/blob/")) {
        Html += "/";
      }
      start += `<li><a href="${Html}" class="dropdown-item">镜像浏览(${mirrorUrl[5][1]})</a></li>`;
    }
    if (location.hostname != "github.com") {
      start += `<li><a href="https://github.com/${namespace}" class="dropdown-item">返回GitHub</a></li>`;
    }

    start += "</ul></div></details>";
    $(".file-navigation").append($(start));
  }

  // Release
  function addRelease() {
    var addBtn = function () {
      var href = $(this).attr("href"),
        html = `<div style="display: flex;justify-content: flex-end;">
            ${downloadUrl
              .map(function (u) {
                return `<div><a style="${
                  style[0]
                }" class="btn" href="${u[0] + href}" rel="noreferrer noopener nofollow">${u[1]}</a></div>`;
              })
              .join("")}
          </div>`;
      if ($(this).next().length > 0) {
        $(this).next().after(html);
      } else {
        $(this).after(html);
      }
    };

    $(".Box.Box--condensed").each(function () {
      $(this).find(".d-flex.Box-body>a").each(addBtn);
      $(this)
        .find(".d-block.Box-body")
        .css({
          "justify-content": "space-between",
        })
        .removeClass("d-block")
        .addClass("d-flex")
        .children("a")
        .each(addBtn);
      // 修改[文件大小]元素样式
      $("small.pl-2.text-gray.flex-shrink-0").css({
        display: "flex",
        "justify-content": "flex-end",
        "flex-grow": 1,
        "margin-right": "8px",
      });
    });
  }

  // Raw
  function addRawFile() {
    $("#raw-url").each(function () {
      var href = $(this).attr("href").replace("https://github.com", "");
      var html = rawUrl
        .map(function (u) {
          var url;
          if (u[2]) {
            url = u[0] + href.replace("/raw/", u[2]);
          } else {
            url = u[0] + href;
          }
          return `<a href="${url}" title="${u[1]}" role="button" rel="noreferrer noopener nofollow" class="btn btn-sm BtnGroup-item">${u[1]}</a>`;
        })
        .join("");
      $(this).after(html);
    });
  }
})();
