// ==UserScript==
// @name        Poipiku Downloader
// @name:zh-CN  Poipiku下载器
// @name:ja  ポイピク ダウンローダー
// @description Download images or text from Poipiku
// @description:zh-CN 从Poipiku下载图片或文字
// @description:ja Download images or text from Poipiku
// @author      calary
// @namespace   http://tampermonkey.net/
// @version     0.4.4
// @license     GPL-3.0
// @include     http*://poipiku.com*
// @match       https://poipiku.com/
// @connect     img.poipiku.com
// @connect     img-org.poipiku.com
// @icon        https://poipiku.com/favicon.ico
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/439053/Poipiku%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/439053/Poipiku%20Downloader.meta.js
// ==/UserScript==

jQuery(function ($) {
  const lang = (
    window.navigator.language ||
    window.navigator.browserLanguage ||
    "en-us"
  ).toLowerCase();

  const i18nMap = {
    "en-us": {
      ui_logined: "Logined",
      ui_password: "Password",
      ui_qualitytrue: "You can download high quality images.",
      ui_qualityfalse: "You cannot download high quality images.",
      ui_mode: "Rename image with page id",
      btn_downloadimages: "Save images (.zip)",
      btn_downloadimageseperately: "Save images Seperately",
      btn_downloadtext: "Save text (.txt)",
      error_default: "Something went wrong",
      error_fetch: "Fetch content error. Entered wrong password?",
      error_noimage: "No Images",
      error_zip: "Failed to create zip. Please try to save images seperagtely.",
      txt_title: "Title: ",
      txt_author: "Author: ",
      txt_twitter: "Twitter: ",
      txt_link: "Link: ",
    },
    "zh-cn": {
      ui_logined: "登录状态",
      ui_password: "密码",
      ui_qualitytrue: "可以下载高质量图片。",
      ui_qualityfalse: "不能下载高质量图片。",
      ui_mode: "图片命名包含当页ID",
      btn_downloadimages: "图片打包为(.zip)",
      btn_downloadimageseperately: "独立保存图片",
      btn_downloadtext: "保存文字为(.txt)",
      error_default: "出错了",
      error_fetch: "请求失败。是否输入密码有误？",
      error_noimage: "没有图片",
      error_zip: "打包失败，请尝试独立保存",
      txt_title: "标题：",
      txt_author: "作者：",
      txt_twitter: "推特：",
      txt_link: "地址：",
    },
    ja: {
      ui_logined: "ログイン",
      ui_password: "パスワード",
      ui_qualitytrue: "高品質の画像を保存できます。",
      ui_qualityfalse: "高品質の画像を保存することはできません。",
      ui_mode: "IDをファイル名に入れます",
      btn_downloadimages: "画像を保存（.zip）",
      btn_downloadimageseperately: "画像を個別に保存",
      btn_downloadtext: "テキストを保存（.txt）",
      error_default: "問題が発生しました",
      error_fetch:
        "コンテンツの取得エラー。間違ったパスワードを入力しましたか？",
      error_zip: "ZIPの作成に失敗しました。 画像を個別に保存してみてください。",
      error_noimage: "画像なし",
      txt_title: "タイトル：",
      txt_author: "ユーザー：",
      txt_twitter: "Twitter：",
      txt_link: "URL：",
    },
  };
  const i18n = (key) =>
    (i18nMap[lang] && i18nMap[lang][key]) || i18nMap["en-us"][key];

  const website = "poipiku";
  const logined = $(".LoginButton").length === 0;
  const fontFamily = "Arial, 'Microsoft Yahei', Helvetica, sans-serif";

  class PageInfo {
    authorId = "";
    workId = "";
    title = "";
    author = "";
    twiter = "";
    saveFilename = "";
    isText = false;
    hasPassword = false;

    constructor(url) {
      this.url = url;
      this.saveImages = this.saveImages.bind(this);
      this.saveText = this.saveText.bind(this);
      this.downloadImages = this.downloadImages.bind(this);
      this.downloadImagesAsZip = this.downloadImagesAsZip.bind(this);
      this.downloadImagesSeperately = this.downloadImagesSeperately.bind(this);
      this.downloadText = this.downloadText.bind(this);
      this.downloadAppendPage = this.downloadAppendPage.bind(this);
      this.init();
    }

    init() {
      if (this.initPromise) {
        return this.initPromise;
      }

      const url = this.url;
      const execResult = /\/(\d+)\/(\d+)/.exec(url);
      const authorId = execResult && execResult[1];
      const workId = execResult && execResult[2];

      this.authorId = authorId;
      this.workId = workId;

      let promise;

      if (this.url === window.location.href) {
        promise = Promise.resolve(document.body.innerHTML);
      } else {
        promise = request({ url: url });
      }

      this.initPromise = promise.then((payload) => this.load(payload));
      return this.initPromise;
    }

    load(payload) {
      let html = payload;
      html = html.replace(/^.+<body>/, "");
      html = html.replace(/<\/body>.+$/, "");

      const $html = $(`<div>${html}</div>`);
      const twitter = $html.find(".UserInfoProgile a").html();
      const username = $html.find(".UserInfoUserName a").html();
      const username2 =
        (twitter &&
          (twitter.charAt(0) === "@"
            ? twitter.substring(1)
            : twitter.split("/").slice(-1).join(""))) ||
        username;
      const desc = $html.find(".IllustItemDesc").text().substring(0, 20);

      this.saveFilename = filterFilename(
        `[${username2}][${website}][${this.authorId}_${this.workId}]${desc}`
      );
      this.title = $html.find(".IllustItemDesc").text();
      this.author = $html.find(".UserInfoUserName a").html();
      this.twitter = $html.find(".UserInfoProgile a").prop("href");

      this.isText = $html.find(".IllustItem").hasClass("Text");
      this.hasPassword = $html.find(".IllustItem").hasClass("Password");

      this.existingHtml =
        $html.find(".IllustItemThumb").eq(0).prop("outerHTML") +
        $html.find(".IllustItemText").eq(0).prop("outerHTML");
    }

    // 生成保存文件名
    getSaveFilename() {
      return this.saveFilename;
    }

    // 生成保存图片文件名
    // 默认：序号.后缀名
    // 选中：网站_作品id_序号.后缀名
    getSaveImageFilename(src, index) {
      let suffix = src.split(".").splice(-1);
      const mode = $saveFileMode.is(":checked");

      if (mode) {
        return `${website}_${this.workId}_${index + 1}.${suffix}`;
      }

      return `${index + 1}.${suffix}`;
    }

    // 批量下载图片的默认方法
    saveImages(list, saveAsZip, $status) {
      let finishehCount = 0;
      let zip;
      let folder;

      if (saveAsZip) {
        try {
          zip = new JSZip();
          folder = zip.folder(this.saveFilename);
        } catch (e) {
          alert(e);
        }
      }

      $status = $status || $("<div></div>");
      $status.text(`0/${list.length}`);

      let promises = list.map((src, index) => {
        return getBlob(src).then((blob) => {
          finishehCount++;
          $status.text(`${finishehCount}/${list.length}`);

          if (zip) {
            folder.file(this.getSaveImageFilename(src, index), blob, {
              binary: true,
            });
          } else {
            let suffix = src.split(".").splice(-1);
            saveAs(
              new Blob([blob]),
              `${this.saveFilename}_${index + 1}.${suffix}`
            );
          }
        });
      });

      Promise.all(promises)
        .then(() => {
          if (zip) {
            return zip
              .generateAsync({ type: "blob", base64: true })
              .then((content) => saveAs(content, this.saveFilename + ".zip"));
          }
        })
        .catch((e) => {
          alert(i18n("error_zip"));
        });
    }

    // 保存文字的默认方法
    saveText(option) {
      let str = "";

      if (option.title) {
        str += `${i18n("txt_title")}${option.title}\n`;
      }
      if (option.author) {
        str += `${i18n("txt_author")}${option.author}\n`;
      }
      if (option.twitter) {
        str += `${i18n("txt_twitter")}${option.twitter}\n`;
      }
      str += `${i18n("txt_link")}${window.location.href}\n`;
      str += `\n\n`;
      str += option.content;

      saveAs(
        new Blob([str], { type: "text/plain;charset=UTF-8" }),
        this.saveFilename + ".txt"
      );
    }

    // 下载图片
    downloadImages(saveAsZip, $status) {
      this.init()
        .then(this.downloadAppendPage)
        .then(($page) => {
          if (logined) {
            return request({
              url: "/f/ShowIllustDetailF.jsp",
              type: "POST",
              data: {
                ID: this.authorId,
                TD: this.workId,
                AD: "-1",
                PAS: $password.val(),
              },
              dataType: "json",
            }).then((payload) => {
              if (!payload.html) {
                throw new Error(i18n("error_fetch"));
              }
              return $(payload.html);
            });
          }

          return $page;
        })
        .then(($page) => {
          let list = [];

          $page
            .find(logined ? ".DetailIllustItemImage" : ".IllustItemThumbImg")
            .each(function () {
              const src = $(this).attr("src");

              if (src && !/^\/img/.test(src)) {
                list.push(window.location.protocol + src);
              }
            });

          if (list.length) {
            this.saveImages(list, saveAsZip, $status);
          } else {
            throw new Error(i18n("error_noimage"));
          }
        })
        .catch((e) => {
          alert(e.message || i18n("error_default"));
        });
    }

    // 打包图片
    downloadImagesAsZip($btn) {
      this.downloadImages(true, $btn && $btn.find(".status"));
    }

    // 独立下载图片
    downloadImagesSeperately($btn) {
      this.downloadImages(false, $btn && $btn.find(".status"));
    }

    // 下载文字
    downloadText() {
      this.init()
        .then(this.downloadAppendPage)
        .then(($page) => {
          this.saveText({
            title: this.title,
            author: this.author,
            twitter: this.twitter,
            content: $page.find(".NovelSection").text(),
          });
        })
        .catch((e) => {
          alert(e.message || i18n("error_default"));
        });
    }

    downloadAppendPage() {
      return request({
        url: "/f/ShowAppendFileF.jsp",
        type: "POST",
        data: {
          UID: this.authorId,
          IID: this.workId,
          PAS: $password.val(),
          MD: 0,
          TWF: -1,
        },
        dataType: "json",
      }).then((payload) => {
        if (payload.result_num < 0) {
          throw new Error(payload.html);
        }

        return $(`<div>${this.existingHtml}${payload.html}</div>`);
      });
    }
  }

  const pageInfo = new PageInfo(window.location.href);

  $(".IllustThumb").each(function () {
    const $this = $(this);
    const isText = /文字/.test($this.find(".Num").text());
    const hasPassword =
      /pass\.png/.test($this.find(".IllustThumbImg").css("background-image")) ||
      /pass\.png/.test($this.find(".Publish").css("background-image"));

    if (hasPassword) {
      return;
    }

    if (isText) {
      $(`<button>${i18n("btn_downloadtext")}</button>`)
        .on("click", downloadTextFromList)
        .css({
          position: "absolute",
          left: 4,
          top: 110,
          zIndex: 1,
          fontFamily: fontFamily,
        })
        .appendTo($this);
    } else {
      $(
        `<button>${i18n(
          "btn_downloadimageseperately"
        )}  <b class='status'></b></button>`
      )
        .on("click", downloadImagesSeperatelyFromList)
        .css({
          position: "absolute",
          left: 4,
          top: 110,
          zIndex: 1,
          fontFamily: fontFamily,
        })
        .appendTo($this);

      $(
        `<button>${i18n("btn_downloadimages")}  <b class='status'></b></button>`
      )
        .on("click", downloadImagesAsZipFromList)
        .css({
          position: "absolute",
          left: 4,
          top: 140,
          zIndex: 1,
          fontFamily: fontFamily,
        })
        .appendTo($this);
    }
  });

  const $panel = $(`<div>
    <div>${i18n("ui_logined")}: <b style="color:red">${logined}</b>.</div>
    <div class="line-qualitytip" >${
      logined ? i18n("ui_qualitytrue") : i18n("ui_qualityfalse")
    }</div>
    <div class="line-password">${i18n(
      "ui_password"
    )} <input type='text' class="password"></div>
    <div class="line-mode" >${i18n(
      "ui_mode"
    )} <input type='checkbox' class="saveFileMode"></div>
    <div class="line-images">
      <button class="btn-downloadImagesSeperately" style="font-size:20px">${i18n(
        "btn_downloadimageseperately"
      )} <b class='status'></b></button></button><br>
      <button class="btn-downloadImages" style="font-size:20px">${i18n(
        "btn_downloadimages"
      )} <b class='status'></b></button>
    </div>
    <div class="line-text"><button class="btn-downloadText" style="font-size:20px">${i18n(
      "btn_downloadtext"
    )}</button></div>
  </div>`)
    .css({
      position: "fixed",
      left: 0,
      bottom: 50,
      zIndex: 999999,
      background: "#fff",
      color: "#333",
      fontSize: 18,
      fontFamily: fontFamily,
      padding: 10,
    })
    .appendTo($("body"));

  const $password = $panel.find(".password");
  const $saveFileMode = $panel.find(".saveFileMode");
  $panel.find("button").css({
    fontFamily: fontFamily,
  });

  pageInfo.init().then(function () {
    if (!pageInfo.workId) {
      $panel.find(".line-password").hide();
      $panel.find(".line-images").hide();
      $panel.find(".line-mode").hide();
      $panel.find(".line-text").hide();
      return;
    }

    if (!pageInfo.hasPassword) {
      $panel.find(".line-password").hide();
    }
    if (pageInfo.isText) {
      $panel.find(".line-images").hide();
      $panel.find(".line-qualitytip").hide();
      $panel.find(".line-mode").hide();
    } else {
      $panel.find(".line-text").hide();
    }
    $panel.find(".btn-downloadImages").on("click", function () {
      pageInfo.downloadImagesAsZip($(this));
    });
    $panel.find(".btn-downloadImagesSeperately").on("click", function () {
      pageInfo.downloadImagesSeperately($(this));
    });
    $panel.find(".btn-downloadText").on("click", function () {
      pageInfo.downloadText($(this));
    });
  });

  function request(config) {
    return new Promise((resolve, reject) => {
      $.ajax({
        ...config,
        success: (response) => {
          resolve(response);
        },
        error: () => {
          reject(new Error(i18n("error_default")));
        },
      });
    });
  }

  function getMimeType(suffix) {
    let map = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
    };

    return map[suffix] || "text/plain";
  }

  function getBlob(url) {
    // return fetch(url).then((response) => response.blob());

    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        headers: { referer: window.location.href },
        onload: (payload) => {
          resolve(payload.response);
        },
        onerror: () => {
          reject(new Error(i18n("error_default")));
        },
      });
    });

    // return new Promise((resolve, reject) => {
    //   GM.xmlHttpRequest({
    //     method: "GET",
    //     url: url,
    //     overrideMimeType: "text/plain; charset=x-user-defined",
    //     headers: { referer: window.location.href },
    //     onload: (xhr) => {
    //       let r = xhr.responseText;
    //       let data = new Uint8Array(r.length);
    //       let i = 0;
    //       while (i < r.length) {
    //         data[i] = r.charCodeAt(i);
    //         i++;
    //       }
    //       let suffix = url.split(".").splice(-1);
    //       let blob = new Blob([data], { type: getMimeType(suffix) });

    //       resolve(blob);
    //     },
    //     onerror: () => {
    //       reject(new Error(i18n("error_default")));
    //     },
    //   });
    // });
  }

  // 过滤文件名非法字符
  function filterFilename(filename) {
    return filename.replace(/\?|\*|\:|\"|\<|\>|\\|\/|\|/g, "");
  }

  function getPageInfo($btn) {
    const url = $btn.siblings(".IllustThumbImg").prop("href");
    return new PageInfo(url);
  }

  function downloadImagesAsZipFromList() {
    const $this = $(this);
    const pageInfo = getPageInfo($this);
    pageInfo.init().then(() => {
      pageInfo.downloadImagesAsZip($this);
    });
  }

  function downloadImagesSeperatelyFromList() {
    const $this = $(this);
    const pageInfo = getPageInfo($this);
    pageInfo.init().then(() => {
      pageInfo.downloadImagesSeperately($this);
    });
  }

  function downloadTextFromList() {
    const $this = $(this);
    const pageInfo = getPageInfo($this);
    pageInfo.init().then(() => {
      pageInfo.downloadText($this);
    });
  }
});
