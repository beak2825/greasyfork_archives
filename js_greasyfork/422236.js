// ==UserScript==
// @name         「Z-Blog」使用 Markdown 编辑应用介绍
// @namespace    https://www.wdssmq.com/
// @version      0.1.1
// @author       wdssmq
// @description  使用 Markdown 编辑应用说明
// @null     ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null     ----------------------------
// @link     https://github.com/wdssmq/userscript
// @link     https://afdian.net/@wdssmq
// @link     https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null     ----------------------------
// @match        https://app.zblogcn.com/zb_system/admin/edit.php?*
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/4.1.1/marked.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422236/%E3%80%8CZ-Blog%E3%80%8D%E4%BD%BF%E7%94%A8%20Markdown%20%E7%BC%96%E8%BE%91%E5%BA%94%E7%94%A8%E4%BB%8B%E7%BB%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/422236/%E3%80%8CZ-Blog%E3%80%8D%E4%BD%BF%E7%94%A8%20Markdown%20%E7%BC%96%E8%BE%91%E5%BA%94%E7%94%A8%E4%BB%8B%E7%BB%8D.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* globals editor_api marked TurndownService sContent */
/* eslint no-useless-escape: 0 */
(function () {
  "use strict";

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  let fnPost;

  function fnPostEvet() {
    fnPost = $("#btnPost")[0].onclick;
    // console.log(fnPost);
    $("#btnPost").after("<input class=\"button\" style=\"width:180px;height:38px;\" type=\"submit\" value=\"提交\" id=\"btnPost2\"\">").hide();
    $("#btnPost2")[0].onclick = function () {
      let oBody = editor_api.editor.content.get();
      // console.log(oBody);
      if (oBody.indexOf("isMarkdown")>-1){
        oBody = oBody.replace(/<\/p>[<>\/pbr\n\s]+<p>/g,"\n\n");
        oBody = oBody.replace(/<p>|isMarkdown|<\/p>/g,"\n\n");
        // console.log(oBody);
        // console.log(marked(oBody));
        editor_api.editor.content.put(marked(oBody));
        return fnPost();
      }
    };
  }

  function fnMain() {
    console.log("start");
    const turndownService = new TurndownService({ headingStyle: "atx" });
    const oBody = editor_api.editor.content.get();
    fnPostEvet();
    if (oBody.indexOf("markdown-here-wrapper") > -1) {
      return;
    }
    if (oBody.indexOf("isMarkdown") > -1) {
      return;
    }
    // let markdown = turndownService.turndown("<h1>Hello world!</h1>");
    // console.log(markdown);
    let markdown = turndownService.turndown(oBody);
    console.log(markdown);
    const arrHtml = ["<p>", "", "</p>","<p>isMarkdown</p>"];
    arrHtml[1] = markdown.replace(/\n\n/g, "</p><p></p><p>");
    editor_api.editor.content.put(arrHtml.join(""));
  }

  async function fnStart() {
    if (!editor_api || $("#editor_content").length == 0 || sContent == "") {
      await sleep(3000);
      fnStart();
    } else {
      fnMain();
    }
  }
  fnStart();
})();
