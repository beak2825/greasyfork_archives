// ==UserScript==
// @name         「水水」豆瓣助手
// @namespace    https://www.wdssmq.com/
// @version      1.0.2
// @author       沉冰浮水
// @description  辅助删除日记什么的
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.net/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @run-at       document-end
// @match        https://www.douban.com/people/*/notes*
// @match        http://localhost:3000/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/463310/%E3%80%8C%E6%B0%B4%E6%B0%B4%E3%80%8D%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463310/%E3%80%8C%E6%B0%B4%E6%B0%B4%E3%80%8D%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

(function () {
  'use strict';

  const gm_name = "douban";

  // 初始常量或函数
  const curUrl = window.location.href;

  // -------------------------------------

  const _curUrl = () => { return window.location.href };

  // -------------------------------------

  const _log = (...args) => console.log(`[${gm_name}] |`, ...args);
  const _warn = (...args) => console.warn(`[${gm_name}] |`, ...args);

  // -------------------------------------

  const $ = window.$ || unsafeWindow.$;

  // localStorage 封装
  const lsObj = {
    setItem: function (key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: function (key, def = "") {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return def;
    },
  };

  // 数据读写封装
  const gobInfo = {
    // key: [默认值, 是否记录至 ls]
    userAgreed: [false, true],
    keepList: [[], true],
    delList: [[], true],
    autoDel: [false, true],
    lstPageUrl: ["", true],
    // 运行时获取
    infoList: [[], false],
  };
  const gob = {
    _lsKey: `${gm_name}_data`,
    _bolLoaded: false,
    data: {},
    // 初始
    init() {
      // 根据 gobInfo 设置 gob 属性
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          this.data[key] = item[0];
          Object.defineProperty(this, key, {
            // value: item[0],
            // writable: true,
            get() { return this.data[key] },
            set(value) { this.data[key] = value; },
          });
        }
      }
      return this;
    },
    // 读取
    load() {
      if (this._bolLoaded) {
        return;
      }
      const lsData = lsObj.getItem(this._lsKey, this.data);
      _log("[log]gob.load()", lsData);
      for (const key in lsData) {
        if (Object.hasOwnProperty.call(lsData, key)) {
          const item = lsData[key];
          this.data[key] = item;
        }
      }
      this._bolLoaded = true;
    },
    // 保存
    save() {
      const lsData = {};
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          if (item[1]) {
            lsData[key] = this.data[key];
          }
        }
      }
      _log("[log]gob.save()", lsData);
      lsObj.setItem(this._lsKey, lsData);
    },
  };

  // 初始化
  gob.init().load();

  // 判断是否首次执行
  const fnCheckFirst = () => {
    const { userAgreed } = gob;
    const fnNext = (bolAgree) => {
      if (bolAgree) {
        swal("请刷新网页使用脚本功能", "您已同意使用本脚本！", "success");
      } else {
        swal("请刷新网页重新选择或删除脚本", "须在上一步点击「继续」方可使用！", "info");
      }
    };
    if (!userAgreed) {
      // 提示
      swal({
        icon: "warning",
        title: "注意！ - 豆瓣助手",
        text: "请认真筛选要删除的日记，删除后无法恢复！",
        buttons: ["取消", "继续"],
      }).then((bolAgree) => {
        // _warn("fnCheckFirst", { bolAgree });
        if (bolAgree) {
          gob.userAgreed = true;
          gob.save();
        }
        fnNext(bolAgree);
      });
    }
  };

  const fnCheckKeep = (info) => {
    const { url } = info;
    const { keepList } = gob;
    const bolKeep = keepList.some(item => item.url === url);
    return bolKeep;
  };

  const fnAddKeep = (info) => {
    const { keepList } = gob;
    keepList.push(info);
    gob.keepList = keepList;
    gob.save();
  };

  const fnSavePageUrl = () => {
    gob.lstPageUrl = curUrl;
    gob.save();
  };

  const fnCheckPageUrl = (goto = false) => {
    let { lstPageUrl } = gob;
    // 移除掉 &_i=xxx
    const curUrl = _curUrl().replace(/&_i=.+/, "");
    lstPageUrl = lstPageUrl.replace(/&_i=.+/, "");
    // 调试
    _log("fnCheckPageUrl", { lstPageUrl, curUrl });
    // 判断是已在缓存的页面
    if (lstPageUrl === curUrl || !lstPageUrl) {
      return true;
    }
    if (goto && lstPageUrl) {
      window.location.href = lstPageUrl;
      return false;
    }
    // // 监听分页条点击，清除 lstPageUrl
    // $("div.paginator").on("click", "a", function (e) {
    //   gob.lstPageUrl = "";
    //   gob.save();
    // });
    return false;
  };

  const fnGetNotes = () => {
    const $$notes = $(".note-container");
    // _log("fnGetNotes", $$notes);
    return $$notes;
  };

  // 管理 infoList
  const fnUpInfoList = (noteInfo, i, act = "def") => {
    if ("keep" === act) {
      noteInfo.keep = true;
      noteInfo.$delBtn = null;
    }
    gob.infoList[i] = noteInfo;
    // _log("fnUpInfoList", gob.infoList);
    // gob.save();
    return;
  };

  // 对于保留的日记，简化显示
  const fnSetKeepView = ($note, info) => {
    const tplKeep = "「保留」<a href=\"-url-\" title=\"-title-\">-title-</a>";
    $note.html(tplKeep
      .replace(/-url-/g, info.url)
      .replace(/-title-/g, info.title));
    $note.addClass("note-keep");
    return;
  };

  const fnActDel = () => {
    // 延时控制
    const intDely = 1000;
    const { delList, autoDel } = gob;
    // 判断并执行自动删除
    if (autoDel && delList.length) {
      // 提取第一个
      const noteInfo = delList.shift();
      const $note = $(`#${noteInfo.id}`);
      const $delBtn = $note.find(".note-footer-stat-del a");
      // 调试
      // _log("fnActDel", { info, infoList: gob.infoList });
      if ($note.length && $delBtn.length) {
        // 构造删除函数
        const fnDel = () => {
          // 按钮样式及文本
          $delBtn.text("删除中...");
          $delBtn.css("color", "red");
          setTimeout(() => {
            $delBtn[0].click();
          }, intDely * 1.1);
        };
        // // 判断是否在可视区域
        // const bolInView = $note[0].getBoundingClientRect().top < window.innerHeight;
        // if (!bolInView) {
        //   setTimeout(() => {
        //     $note[0].scrollIntoView();
        //   }, intDely * .7);
        // }
        // 执行删除
        fnDel();
      } else {
        _warn("fnActDel", "not found $note or $delBtn");
      }
      setTimeout(() => {
        gob.delList = delList;
        gob.save();
      }, intDely);
    } else if (autoDel) {
      setTimeout(() => {
        $(".tip-cnt-down").text("完成");
      }, intDely * .7);
      // 清除自动删除状态
      gob.autoDel = false;
      gob.lstPageUrl = "";
      gob.save();
    }
  };

  // 构建删除任务
  const fnGenDelTask = () => {
    let { delList, infoList, autoDel } = gob;
    // 判断是否已有删除任务
    if (delList.length) {
      _warn("fnGenDelTask", "delList.length > 0");
      _warn("fnGenDelTask", { delList });
      return;
    }
    // 保存当前页面地址
    fnSavePageUrl();
    // 生成删除任务
    delList = infoList.filter(item => !item.keep);
    // 将删除以下日记，仅显示一次
    if (!autoDel) {
      let msg = "删除以下日记，仅显示一次：\n";
      _log("fnGenDelTask", { delList });
      delList.forEach((item, i) => {
        msg += `${i + 1}. ${item.title}\n`;
      });
      // 再次确认
      const bolConfirm = confirm(msg);
      if (!bolConfirm) {
        return;
      }
      autoDel = true;
    }
    _log("fnGenDelTask", { delList, infoList });
    // 保存
    gob.delList = delList;
    gob.autoDel = autoDel;
    gob.save();
    // 执行首个删除任务
    fnActDel();
  };

  // 添加删除按钮
  const fnAddDelBtn = ($note) => {
    const $usr = $("#db-usr-profile");
    // 添加删除按钮
    const tplDelBtn = "<h1><a href=\"javascript:;\" class=\"auto-del-btn\" title=\"自动删除\">自动删除</a><span class=\"tip-cnt-down\"></span></h1>";
    $usr.find(".info").after(tplDelBtn);
    const $delBtn = $usr.find(".auto-del-btn");
    // 按钮状态
    const fnActDelBtn = (autoDel = false) => {
      const { delList } = gob;
      if (autoDel) {
        const cntDown = delList.length + 1;
        $(".tip-cnt-down").text(`剩余 ${cntDown} 篇`);
      }
      $delBtn.text("执行中...");
      $delBtn.addClass("del-btn-ing");
    };
    // 判断是否已有删除任务
    if (gob.autoDel) {
      fnActDelBtn(true);
    }
    // 点击删除按钮
    $delBtn.click(function () {
      // 询问是否删除
      const bolConfirm = confirm("是否删除本页非保留状态的日记？");
      if (bolConfirm) {
        fnActDelBtn();
        fnGenDelTask();
      }
    });
  };

  // 初始函数
  const fnMngNotes = () => {
    const { userAgreed } = gob;
    // 判断是否已同意
    if (!userAgreed) {
      return;
    }
    // 判断是否在缓存的页面
    const bolPage = fnCheckPageUrl(true);
    if (!bolPage) {
      return;
    }
    // 执行已有删除任务
    fnActDel();
    // 获取元素
    const $$notes = fnGetNotes();
    // 遍历元素
    $$notes.each(function (i) {
      // 元素节点
      const $note = $(this);
      const $noteID = $note.attr("id");
      const $noteTitle = $note.find("h3>a");
      const $noteFooter = $note.find(".note-ft");
      const $noteSNS = $note.find(".sns-bar");
      const $delBtn = $note.find(".note-footer-stat-del a");
      // 日志信息
      const noteInfo = {
        id: $noteID,
        title: $noteTitle.text(),
        url: $note.data("url"),
        keep: false,
        $delBtn,
      };
      // 判断
      const bolKeep = fnCheckKeep(noteInfo);
      if (bolKeep) {
        fnUpInfoList(noteInfo, i, "keep");
        fnSetKeepView($note, noteInfo);
        return;
      } else {
        fnUpInfoList(noteInfo, i);
      }
      //  _log(gob.infoList);
      // 添加按钮用于设置保留
      const tplKeep = "- 「<a href=\"javascript:;\" class=\"keep-btn\">设为保留</a>」";
      $noteTitle.after(tplKeep);
      // 点击保留按钮
      $note.find(".keep-btn").click(function () {
        // const bolConfirm = confirm(`是否保留笔记：${noteInfo.title}`);
        // if (!bolConfirm) {
        //   return;
        // }
        fnAddKeep(noteInfo);
        fnUpInfoList(noteInfo, i, "keep");
        fnSetKeepView($note, noteInfo);
      });
      // 隐藏时间
      const $pubDate = $note.find(".pub-date").parent();
      $pubDate.hide();
      // 隐藏 SNS
      $noteSNS.before("<hr>");
      $noteSNS.hide();
      // 显示删除按钮
      $noteFooter.show().prepend("<br>");
      // _log("noteInfo", noteInfo);
    });
    // 添加删除按钮
    fnAddDelBtn();
    // _log(gob.data);
  };

  fnCheckFirst();
  fnMngNotes();

})();
