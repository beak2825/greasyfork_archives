// ==UserScript==
// @name         「Z-Blog」前台编辑文章入口
// @namespace    https://www.wdssmq.com/
// @version      1.0.3
// @author       沉冰浮水
// @description  配合主题以显示前台编辑入口
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
// @match       *://*/post/*.html*
// @match       *://*/*.html
// @match       *://*/zb_system/admin/edit.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25003/%E3%80%8CZ-Blog%E3%80%8D%E5%89%8D%E5%8F%B0%E7%BC%96%E8%BE%91%E6%96%87%E7%AB%A0%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/25003/%E3%80%8CZ-Blog%E3%80%8D%E5%89%8D%E5%8F%B0%E7%BC%96%E8%BE%91%E6%96%87%E7%AB%A0%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

(function () {
  'use strict';

  // 初始常量或函数
  const curUrl = window.location.href;
  // ---------------------------------------------------
  const $ = window.$ || unsafeWindow.$;

  function _mdToc () {
    const postTitle = $(".post-title");
    const $$referenceLink = $(".reference-link");
    // console.log("$$referenceLink = ", $$referenceLink);

    const _setAnchorLink = (el, $refLink) => {
      const anchorId = el.attr("id");
      const title = $refLink.attr("name");
      // 锚点链接目标
      const arrHash = [
        `#${anchorId}`,
        `#${title}`,
      ];

      const $a = $("<a>")
        .attr("href", "#")
        .attr("title", title)
        .html("#")
        .addClass("header-anchor")
        .data("hash", arrHash[0])
        .css({
          borderBottom: "none",
          marginRight: "3px",
          marginLeft: "-11px",
          visibility: "hidden",
        })
        .click(() => {
          // 根据 data-hash 属性，切换锚点链接目标
          const hash = $a.data("hash");
          const newHash = arrHash.filter(item => item !== hash)[0];
          $a.attr("href", newHash);
          $a.data("hash", newHash);
          document.title = `${title} - ${postTitle.text()}`;
        });
      const $span = el.find(".header-link");

      $span.replaceWith($a);

      // // 移除 el 直接的文本节点，但是保留 el 的子节点
      // el.contents().filter(function () {
      //   return this.nodeType === 3;
      // }).remove();
    };

    // 遍历
    $$referenceLink.each(function (el) {
      const $anchor = $(this).parent();
      const _this = $(this);
      _setAnchorLink($anchor, _this);
      // 绑定鼠标 hover 事件
      $anchor.hover(function () {
        $anchor.find(".header-anchor").css({
          visibility: "visible",
          marginLeft: "-5px",
        });
      }, function () {
        $anchor.find(".header-anchor").css({
          visibility: "hidden",
          marginLeft: "-11px",
        });
      });
    });

  }

  $(function () {
    _mdToc();
    // 添加编辑按钮
    $(".js-edt")
      .each(function () {
        const id = $(this).data("id");
        const type = $(this).data("type");
        const act = type ? "PageEdt" : "ArticleEdt";
        $(this).html(
          `[<a title="编辑" rel="external" href="${window.bloghost}zb_system/cmd.php?act=${act}&id=${id}">编辑</a>]`,
        );
      })
      .removeClass("is-hidden hidden");

    // 清理评论失效网址
    $(".cmt-tips").each(function () {
      const $this = $(this);
      const authName = $this.data("name");
      $this.append(
        ` <a class="cmt-edit" title="查找编辑" rel="external" href="${window.bloghost}zb_users/plugin/cmt2rss/main.php?act=update&read_getWord=${authName}" target="_blank">查找编辑</a>`,
      );
    });
    $(".cmt-edit").css({ color: "#175199" });

    // 设置文章为回收
    if (curUrl.indexOf("zblogcn.com") > -1) {
      return;
    }
    $("#edtTitle").after(
      "<a class=\"js-empty\" href=\"javascript:;\" title=\"设置为回收\"> 「设置为回收」</a>",
    );
    let editor_api = window.editor_api;
    $(".js-empty").click(function () {
      $("#edtTitle").val("回收");
      $("#edtTag").val("回收");
      $("#edtDateTime").datetimepicker("setDate", (new Date()));
      $("#cmbPostStatus").val("1");
      let strMore = "";
      if (typeof window.EDITORMD == "object") {
        strMore = "\n\n<!--more-->";
      } else {
        strMore = "<hr class=\"more\" />";
      }
      let oBody = "回收" + strMore;
      editor_api.editor.content.put(oBody);
      editor_api.editor.intro.put("");
    });
  });

})();
