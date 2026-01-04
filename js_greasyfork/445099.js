// ==UserScript==
// @name         自动评教
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  教务系统自动评教脚本
// @author       imbytecat
// @include      *://jwxt.shmtu.edu.cn/shmtu/*.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shmtu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445099/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/445099/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 评级：
  // 1：优秀，2：良好，3：中等，4：及格
  var evaluate = 1;

  // 覆盖系统 confirm 和 alert
  window.confirm = function () {
    return true;
  };

  window.alert = function () {
    return true;
  };

  // 延时函数
  const sleep = () => new Promise((res) => setTimeout(res, 2000));

  (async () => {
    for (;;) {
      await sleep();
      // 获取当前页面的 URL pathname
      const { pathname } = window.location;
      // 判断是否为评教页面
      if (pathname === "/shmtu/evaluateStd!loadQuestionnaire.action") {
        if (evaluate == 1) {
          $(`input[value='${124}']`).attr("checked", "true");
          $(`input[value='${136}']`).eq(0).attr("checked", "true");
        } else if (evaluate == 2) {
          $(`input[value='${136}']`).attr("checked", "true");
        } else if (evaluate == 3) {
          $(`input[value='${138}']`).attr("checked", "true");
        } else if (evaluate == 4) {
          $(`input[value='${166}']`).attr("checked", "true");
        }

        var div = $(
          "html body div#BodyBg div#MainBody.bg1 div#main._ajax_target table.indexpanel tbody tr td.index_content div#contentDiv._ajax_target form#evaluateEditForm.listform fieldset ol li table.gridtable tbody#evaluateTB tr"
        );
        var a = Number.parseInt(
          $(div.eq(-2).find("input")[0]).attr("name").substr(6)
        );

        if (a == 367 || a == 368 || a == 370 || evaluate == 4) {
          div.eq(-2).find(`input[value='86']`).attr("checked", "true");
        } else if ((a == 369 || a == 371) && evaluate == 1) {
          div.eq(-2).find(`input[value='89']`).attr("checked", "true");
        } else if ((a == 369 || a == 371) && evaluate == 2) {
          div.eq(-2).find(`input[value='88']`).attr("checked", "true");
        } else if ((a == 369 || a == 371) && evaluate == 3) {
          div.eq(-2).find(`input[value='87']`).attr("checked", "true");
        }

        a = Number.parseInt(
          $(div.eq(-1).find("input")[0]).attr("name").substr(6)
        );
        if (a == 367 || a == 368 || a == 370 || evaluate == 4) {
          div.eq(-1).find(`input[value='86']`).attr("checked", "true");
        } else if ((a == 369 || a == 371) && evaluate == 1) {
          div.eq(-1).find(`input[value='89']`).attr("checked", "true");
        } else if ((a == 369 || a == 371) && evaluate == 2) {
          div.eq(-1).find(`input[value='88']`).attr("checked", "true");
        } else if ((a == 369 || a == 371) && evaluate == 3) {
          div.eq(-1).find(`input[value='87']`).attr("checked", "true");
        }

        $('textarea[id="content_1"]').text("无");
        $('textarea[id="content_2"]').text("无");
        $(`input[value="提交"]`).click();
      }
    }
  })();
})();
