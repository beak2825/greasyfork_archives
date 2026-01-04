// ==UserScript==
// @name         Pixiv Novel Downloader
// @name:zh-CN   Pixiv 小说下载器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download novels from Pixiv
// @description:zh-CN 从Pixiv下载小说
// @author       calary
// @license      GPL-3.0
// @include      http*://www.pixiv.net*
// @match        https://www.pixiv.net/*
// @icon         http://www.pixiv.net/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/439918/Pixiv%20Novel%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/439918/Pixiv%20Novel%20Downloader.meta.js
// ==/UserScript==

jQuery(function ($) {
  const lang = (
    window.navigator.language ||
    window.navigator.browserLanguage ||
    "en-us"
  ).toLowerCase();

  const i18nMap = {
    "en-us": {
      ui_title: "Novel Downloader",
      ui_dl_page: "DL This Work",
      ui_dl_author: "Batch DL This Author",
      ui_dl_series: "Batch DL This Series",
      ui_dl_list: "Batch DL This List",
      ui_dl_favlist: "Batch DL Bookmark List",
      ui_start: "START",
      ui_pause: "PAUSE",
      ui_resume: "RESUME",
      ui_retry: "RETRY",
      ui_cancel: "CANCEL",
      ui_dl: "Download",
      ui_page: "P",
      ui_all: "All",
      ui_inludelikes: "Filename inludes likes",
      error_default: "Something went wrong",
      error_notpage: "This is not a novel page.",
      error_notauthor: "This is not an author page.",
      error_notseries: "This is not a series page.",
      error_notlist: "This is not a list page.",
      error_notfavlist: "This is not bookmark page",
      txt_title: "Title: ",
      txt_novelid: "Novel ID: ",
      txt_author: "Author: ",
      txt_authorid: "Author ID: ",
      txt_words: "Words: ",
      txt_likes: "Likes: ",
      txt_createtime: "Create Time: ",
      txt_updatetime: "Update Time: ",
      txt_tags: "Tags: ",
      txt_desc: "Description: ",
      txt_words2: "Words",
      txt_likes2: "Likes",
      txt_pageno: "Page {0}",
      txt_fav: "Bookmark",
    },
    "zh-cn": {
      ui_title: "小说下载器",
      ui_dl_page: "下载此小说",
      ui_dl_author: "批量下载此作者",
      ui_dl_series: "批量下载此系列",
      ui_dl_list: "批量下载此列表页",
      ui_dl_favlist: "批量下载收藏列表",
      ui_start: "开始",
      ui_pause: "暂停",
      ui_resume: "继续",
      ui_retry: "重试",
      ui_cancel: "取消",
      ui_dl: "下载",
      ui_page: "页",
      ui_all: "全部",
      ui_inludelikes: "文件命名包含喜欢数",
      error_default: "出错了",
      error_notpage: "该页不是小说页。",
      error_notauthor: "该页不是作者主页。",
      error_notseries: "该页不是系列页。",
      error_notlist: "该页不是列表页。",
      error_notfavlist: "该页不是收藏列表。",
      txt_title: "标题：",
      txt_novelid: "作品id：",
      txt_author: "作者：",
      txt_authorid: "Pixiv ID：",
      txt_words: "字数：",
      txt_likes: "喜欢：",
      txt_createtime: "创建时间：",
      txt_updatetime: "更新时间：",
      txt_tags: "标签：",
      txt_desc: "描述：",
      txt_words2: "字",
      txt_likes2: "喜欢",
      txt_pageno: "第{0}页",
      txt_fav: "收藏",
    },
  };
  const i18n = (key, ...args) => {
    let str = (i18nMap[lang] && i18nMap[lang][key]) || i18nMap["en-us"][key];
    args.forEach((value, index) => {
      str = str.replace(`{${index}}`, value);
    });
    return str;
  };

  const website = "pixiv";
  const fontFamily = "Arial, 'Microsoft Yahei', Helvetica, sans-serif";
  const noop = () => {};

  const $panel = $(`<div>
    <h4 style="padding: 0; margin: 0 0 10px;">${i18n("ui_title")}</h4>
    <div>
      <span>${i18n("ui_dl")}: </span>
      <label><input type="radio" name="dl_mode" value="single"> 1 ${i18n(
        "ui_page"
      )}</label>
      <label><input type="radio" name="dl_mode" value="all" checked> ${i18n(
        "ui_all"
      )}</label>
    </div>
    <div>
      <span>${i18n("ui_inludelikes")}: </span>
      <input type="checkbox" name="dl_includelikes" />
    </div>
  </div>`)
    .css({
      position: "fixed",
      left: 0,
      bottom: 50,
      zIndex: 999999,
      background: "#fff",
      color: "#333",
      fontSize: 16,
      fontFamily: fontFamily,
      padding: 10,
      borderRadius: 6,
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    })
    .appendTo($("body"));

  /*
    功能规划
    下载单页
    下载搜索页全部
    下载作者页全部
    每页保存成一个.zip
    自动下载下一页
    出错时可以重启
    保存文件名标识r18和r18g

    列表页url类型

    列表地址     https://www.pixiv.net/tags/标签/novels
    参数
      标签       word
      标签匹配   s_mode
        完全一致 s_tag_full <default>
        部分一致 s_tag_only
      排序       order
        从新到旧 date_d <default>
        从旧到新 date
      页数       p
      其他参数   mode=all lang=zh

    作者页面     https://www.pixiv.net/users/作者id
    作者小说列表 https://www.pixiv.net/users/作者id/novels

    小说系列列表 https://www.pixiv.net/novel/series/系列id
    /ajax/novel/series/系列id?lang=zh
    /ajax/novel/series_content/系列id?limit=10&last_order=0&order_by=asc&lang=zh

    小说地址     https://www.pixiv.net/novel/show.php?id=小说id

  */

  function baseRequest(config) {
    return new Promise((resolve, reject) => {
      $.ajax({
        timeout: 5000,
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

  function request(config) {
    return baseRequest(config).then(({ error, message, body }) => {
      if (error) {
        return new Error(message);
      }

      return body;
    });
  }

  // 过滤文件名非法字符
  function filterFilename(filename) {
    return filename.replace(/\?|\*|\:|\"|\<|\>|\\|\/|\|/g, "");
  }

  function wait(delay, ctrl = {}) {
    return new Promise((resolve, reject) => setTimeout(resolve, delay));
  }

  class Task {
    title = "";
    $item = null;

    // unstarted=''; running; paused; error.
    status = "";

    // 文件命名包含喜欢数
    includeLikes = false;

    constructor(title) {
      this.title = title;
      this.start = this.start.bind(this);
      this.pause = this.pause.bind(this);
      this.resume = this.resume.bind(this);
      this.retry = this.retry.bind(this);
      this.cancel = this.cancel.bind(this);
      this.errorHandler = this.errorHandler.bind(this);
      this.init();
    }
    init() {
      const $item = $(`<div>
        ${i18n(this.title)}
        <button class="start">${i18n("ui_start")}</button>
        <button class="pause">${i18n("ui_pause")}</button>
        <button class="resume">${i18n("ui_resume")}</button>
        <button class="retry">${i18n("ui_retry")}</button>
        <button class="cancel">${i18n("ui_cancel")}</button>
        <span class="status">
          <span class="current"></span> -
          <span class="page"></span>
        </span>
      </div>`).appendTo($panel);

      this.$item = $item;
      this.$start = $item.find(".start").on("click", this.start);
      this.$pause = $item.find(".pause").hide().on("click", this.pause);
      this.$resume = $item.find(".resume").hide().on("click", this.resume);
      this.$retry = $item.find(".retry").hide().on("click", this.retry);
      this.$cancel = $item.find(".cancel").hide().on("click", this.cancel);
      this.$status = $item.find(".status").hide();
      this.$currentStatus = $item.find(".status .current");
      this.$pageStatus = $item.find(".status .page");
    }
    start() {
      this.status = "running";
      this.includeLikes = $("input[name='dl_includelikes']:checked").val();
      this.$start.hide();
      this.$pause.show();
      this.$resume.hide();
      this.$retry.hide();
      this.$cancel.show();
      this.$status.hide();
    }
    pause() {
      this.status = "paused";
      this.$start.hide();
      this.$pause.hide();
      this.$resume.show();
      this.$retry.hide();
      this.$cancel.show();
      this.$status.show();
    }
    resume() {
      this.status = "running";
      this.$start.hide();
      this.$pause.show();
      this.$resume.hide();
      this.$retry.hide();
      this.$cancel.show();
      this.$status.show();
    }
    error() {
      this.status = "error";
      this.$start.hide();
      this.$pause.hide();
      this.$resume.hide();
      this.$retry.show();
      this.$cancel.show();
      this.$status.show();
    }
    retry() {
      this.status = "running";
      this.$start.hide();
      this.$pause.show();
      this.$resume.hide();
      this.$retry.hide();
      this.$cancel.show();
      this.$status.show();
    }
    cancel() {
      this.status = "";
      this.$start.show();
      this.$pause.hide();
      this.$resume.hide();
      this.$retry.hide();
      this.$cancel.hide();
      this.$status.hide();
    }
    isRunning() {
      return this.status === "running";
    }
    checkRunning() {
      if (!this.isRunning()) {
        throw new Error("CANCEL");
      }
    }
    errorHandler(e) {
      if (e.message === "CANCEL") {
        return;
      }
      this.error();
      console.trace(e);
      alert(e);
    }
    getWork(id) {
      return request({
        url: `/ajax/novel/${id}`,
        responseType: "json",
      }).then((body) => {
        let title = [];
        let output = [];

        title.push(`[${body.userName}]`);
        title.push(`[${website}]`);
        title.push(`[${body.id}]`);
        if (body.xRestrict === 1) {
          title.push("[R18]");
        } else if (body.xRestrict === 2) {
          title.push("[R18G]");
        }
        title.push(`[${body.title}]`);
        title.push(`[${body.content.length}${i18n("txt_words2")}]`);
        if (this.includeLikes) {
          title.push(`[${body.likeCount}${i18n("txt_likes2")}]`);
        }

        output.push(i18n("txt_title") + body.title);
        output.push(i18n("txt_novelid") + body.id);
        output.push(i18n("txt_author") + body.userName);
        output.push(i18n("txt_authorid") + body.userId);
        output.push(i18n("txt_words") + body.content.length);
        output.push(i18n("txt_likes") + body.likeCount);
        output.push(i18n("txt_createtime") + body.createDate);
        output.push(i18n("txt_updatetime") + body.uploadDate);
        output.push(
          i18n("txt_tags") +
            body.tags.tags
              .map(function (tag) {
                if (tag.userId === body.userId) {
                  return "#" + tag.tag;
                }
                return "(#" + tag.tag + ")";
              })
              .join(" ")
        );
        output.push("");
        output.push("");
        output.push(i18n("txt_desc"));
        output.push(body.description.replace(/<br \/>/gi, "\n"));
        output.push("");
        output.push("");
        output.push("");
        output.push("");

        let pageCount = 1;
        output.push(
          body.content
            .replace(/\\n/g, "\n")
            .replace(/\[jump:(\d+)\]/g, (_, $1) => {
              return `[${i18n("txt_pageno", $1)}]`;
            })
            .replace(/\[newpage\]/g, () => {
              return `\n\n[${i18n("txt_pageno", ++pageCount)}]\n\n`;
            })
        );

        const filename = filterFilename(title.join("")) + ".txt";
        const content = output.join("\n");

        return {
          filename,
          content,
        };
      });
    }
  }

  class TaskMultiPage extends Task {
    pageParam = "p";
    offsetParam = "offset";
    limitParam = "limit";
    defaultParams = {};

    // 当前页
    page = 1;
    // 当前页完成数量
    finished = 0;
    // 每页数量
    limit = 24;
    // 作品总数
    total = 0;
    // 总页数
    pages = 0;
    // 下载模式
    mode = "all";
    // 下载阶段 list=列表 works=作品
    step = "";

    url = null;
    params = null;
    promise = null;
    ids = null;
    entries = null;

    getUrl() {
      return "";
    }

    getSaveFilename() {
      return "";
    }

    check() {}

    start() {
      try {
        this.check();
      } catch (e) {
        alert(e);
        return;
      }
      super.start();

      this.mode = $("input[name='dl_mode']:checked").val();

      const curPageUrl = new URL(window.location.href);
      this.url = this.getUrl();
      this.params = Object.assign(
        {},
        this.defaultParams,
        Object.fromEntries(curPageUrl.searchParams)
      );
      this.page = parseInt(this.params[this.pageParam]) || 1;

      this.getInitData().then(() => this.getNextList());
    }

    resume() {
      super.resume();
      this.resumeOrRetry();
    }

    retry() {
      super.retry();
      this.resumeOrRetry();
    }

    resumeOrRetry() {
      if (this.step === "works") {
        this.getWorks();
      } else {
        this.getNextList();
      }
    }

    setParams() {
      this.params[this.pageParam] = this.page;
      this.params[this.limitParam] = this.limit;
      this.params[this.offsetParam] = (this.page - 1) * this.limit;
    }

    getInitData() {
      return Promise.resolve();
    }

    getNextList() {
      if (!this.isRunning()) {
        return;
      }
      this.step = "list";
      this.setParams();

      this.promise = this.getList()
        .then(({ data = [], total }) => {
          this.checkRunning();

          this.total = total;
          this.pages = Math.ceil(total / this.limit);
          this.finished = 0;
          this.entries = {};
          this.updateStatus();

          if (data.length < 0) {
            return;
          }

          const ids = (this.ids = new Set());
          data.forEach((item) => ids.add(item.id));

          this.getWorks();
        })
        .catch(this.errorHandler);
    }

    getList() {
      this.setParams();
      return request({
        url: this.url,
        data: this.params,
        method: "get",
        responseType: "json",
      }).then((body) => {
        this.checkRunning();
        return this.parseList(body);
      });
    }

    parseList(payload) {
      return payload;
    }

    getWorks() {
      if (!this.isRunning()) {
        return;
      }
      this.step = "works";

      const { ids } = this;

      let i = 0;

      this.promises = ids.map((id) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              this.checkRunning();
              resolve();
            } catch (e) {
              reject(e);
            }
          }, i++ * 100);
        })
          .then(() => {
            this.checkRunning();
            return this.getWork(id);
          })
          .then((work) => {
            this.checkRunning();

            this.finished++;
            this.ids.delete(id);
            this.entries[id] = work;
            this.updateStatus();
          });
      });

      Promise.all(this.promises)
        .then(() => {
          if (!this.isRunning()) {
            return;
          }

          const zip = new JSZip();
          let hasFile = false;
          Object.values(this.entries).forEach(({ filename, content }) => {
            hasFile = true;
            zip.file(filename, content);
          });

          if (hasFile) {
            this.savedPage = this.page;

            zip
              .generateAsync({ type: "blob" })
              .then((content) => saveAs(content, this.getSaveFilename()));
          }

          if (this.mode === "all" && this.page < this.pages) {
            this.page++;
            this.getNextList();
          } else {
            this.cancel();
          }
        })
        .catch(this.errorHandler);
    }

    updateStatus() {
      this.$status.show();

      const { finished, limit, total, page, pages } = this;
      let curPageTotal = limit;
      if (page === pages) {
        curPageTotal = total - limit * (page - 1);
      }

      this.$currentStatus.html(`${finished}/${curPageTotal}`);
      this.$pageStatus.html(
        `${page}${i18n("ui_page")}/${pages}${i18n("ui_page")}`
      );
    }
  }

  class TaskPage extends Task {
    promise = null;

    init() {
      super.init();
      this.$pause.remove();
      this.$resume.remove();
      this.$retry.remove();
    }

    start() {
      // https://www.pixiv.net/novel/show.php?id=作品id
      const exec = /\/novel\/show.php\?id=(.+)$/i.exec(window.location.href);
      if (!exec) {
        alert(i18n("error_notpage"));
        return;
      }
      const id = exec[1];
      super.start();

      this.promise = this.getWork(id)
        .then(({ filename, content }) => {
          if (!this.isRunning()) {
            return;
          }

          this.cancel();

          saveAs(
            new Blob([content], { type: "text/plain;charset=UTF-8" }),
            filename
          );
        })
        .catch((e) => {
          if (!this.isRunning()) {
            return;
          }
          this.cancel();
          alert(e.message);
        });
    }
  }

  // /ajax/user/7855356/profile/novels?ids%5B%5D=7783432&lang=zh
  class TaskAuthor extends TaskMultiPage {
    defaultParams = {
      limit: 10,
      last_order: 0,
      order_by: "asc",
      lang: "zh",
    };
    id = "";
    limit = 24;
    tag = "";
    userName = "";
    workIds = null;
    total = 0;

    check() {
      // /users/作者id
      // /users/作者id/novels
      // /users/作者id/novels/标签
      const pathname = window.location.pathname;
      const exec2 = /^\/users\/(\d+)\/novels\/(.+)$/.exec(pathname);
      const exec1 = /^\/users\/(\d+)(\/novels)*$/.exec(pathname);

      this.id = "";
      this.tag = "";

      if (exec2) {
        this.id = exec2[1];
        this.tag = decodeURIComponent(exec2[2]);
        if (!this.tag) {
          throw new Error(i18n("error_notauthor"));
        }
      } else if (exec1) {
        this.id = exec1[1];
      } else {
        throw new Error(i18n("error_notauthor"));
      }
    }

    getInitData() {
      // /ajax/user/44820588?full=1&lang=zh
      let infoPromise = request({
        url: `/ajax/user/${this.id}`,
        method: "get",
        data: {
          full: 1,
          lang: "zh",
        },
      }).then((payload) => {
        this.userName = payload.name;
      });

      let workPromise = request({
        url: `/ajax/user/${this.id}/profile/all`,
        method: "get",
        data: {
          lang: "zh",
        },
      }).then((payload) => {
        const { novels } = payload;
        this.workIds = Object.keys(novels).sort((a, b) => b - a);
        this.total = this.workIds.length;
      });

      return Promise.all([infoPromise, workPromise]);
    }

    getList() {
      if (this.tag) {
        return super.getList();
      }

      const { limit, page, workIds } = this;
      let offset = limit * (page - 1);
      return Promise.resolve({
        total: workIds.length,
        data: workIds.slice(offset, offset + limit).map((id) => {
          return { id };
        }),
      });
    }

    parseList(payload) {
      if (this.tag) {
        return {
          data: payload.works,
          total: payload.total,
        };
      }

      // 不用调用列表，直接查询id就完事了
      // 但如何结合现有的getList？
      return {
        total: this.total,
        works: Object.values(payload.works),
      };
    }

    getUrl() {
      return `/ajax/user/${this.id}/novels/tag`;
    }

    setParams() {
      const { tag, limit, page } = this;
      let offset = limit * (page - 1);
      this.params = {
        tag,
        limit,
        offset,
        lang: "zh",
      };
    }

    getSaveFilename() {
      const date = new Date().toISOString().substring(0, 10);
      let arr = [];

      arr.push(this.userName);
      if (this.tag) {
        arr.push(this.tag);
      }
      arr.push("p" + this.savedPage);
      arr.push(date);

      return filterFilename(arr.join("_")) + ".zip";
    }
  }

  class TaskSeries extends TaskMultiPage {
    defaultParams = {
      limit: 10,
      last_order: 0,
      order_by: "asc",
      lang: "zh",
    };
    id = "";
    limit = 10;
    title = "";
    userName = "";
    total = 0;

    check() {
      // https://www.pixiv.net/novel/series/系列id
      const exec = /^\/novel\/series\/(.+)$/i.exec(window.location.pathname);
      if (!exec) {
        throw new Error(i18n("error_notseries"));
      }

      this.id = exec[1];
    }

    getInitData() {
      return request({
        url: "/ajax/novel/series/" + this.id,
        method: "get",
        data: {
          lang: "zh",
        },
      }).then((payload) => {
        const { title, userName, displaySeriesContentCount } = payload;
        this.title = title;
        this.userName = userName;
        this.total = displaySeriesContentCount;
      });
    }

    parseList(payload) {
      return { data: payload.seriesContents, total: this.total };
    }

    getUrl() {
      return "/ajax/novel/series_content/" + this.id;
    }

    setParams() {
      this.params.last_order = this.limit * (this.page - 1);
    }

    getSaveFilename() {
      const date = new Date().toISOString().substring(0, 10);
      return (
        filterFilename(
          `${this.userName}_${this.id}_${this.title}_p${this.savedPage}_${date}`
        ) + ".zip"
      );
    }
  }

  class TaskList extends TaskMultiPage {
    defaultParams = {
      word: "",
      order: "date_d",
      mode: "all",
      p: 1,
      s_mode: "s_tag_full",
      gs: 0,
      lang: "zh",
    };
    tag = "";

    check() {
      // https://www.pixiv.net/tags/标签/
      const exec = /^\/tags\/(.+)\/novels$/i.exec(window.location.pathname);
      if (!exec) {
        throw new Error(i18n("error_notlist"));
      }

      this.tag = decodeURIComponent(exec[1]);
      this.defaultParams.word = this.tag;
    }

    parseList(payload) {
      const { data, total } = payload.novel;
      return { data, total };
    }

    getUrl() {
      return "/ajax/search/novels/" + encodeURIComponent(this.tag);
    }

    getSaveFilename() {
      const date = new Date().toISOString().substring(0, 10);
      return filterFilename(`${this.tag}_p${this.savedPage}_${date}`) + ".zip";
    }
  }

  class TaskFavList extends TaskMultiPage {
    defaultParams = {
      tag: "",
      offset: 0,
      limit: 24,
      rest: "show",
      lang: "zh",
    };

    userId = "";

    check() {
      // https://www.pixiv.net/users/本人id/bookmarks/novels
      const exec = /^\/users\/(.+)\/bookmarks\/novels$/i.exec(
        window.location.pathname
      );
      if (!exec) {
        throw new Error(i18n("error_notfavlist"));
      }
      this.userId = exec[1];
    }

    parseList(payload) {
      const { works, total } = payload;
      const data = works.filter((item) => !!item.xRestrict);
      return { data, total };
    }

    getUrl() {
      return `/ajax/user/${this.userId}/novels/bookmarks`;
    }

    getSaveFilename() {
      const date = new Date().toISOString().substring(0, 10);
      return (
        filterFilename(`${i18n("txt_fav")}_p${this.savedPage}_${date}`) + ".zip"
      );
    }
  }

  new TaskPage("ui_dl_page");
  new TaskAuthor("ui_dl_author");
  new TaskSeries("ui_dl_series");
  new TaskList("ui_dl_list");
  new TaskFavList("ui_dl_favlist");
});
