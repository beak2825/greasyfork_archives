// ==UserScript==
// @name         NGA Post Status Query
// @namespace    https://greasyfork.org/users/826221
// @version      1.0.4
// @description  Check NGA post status.
// @author       DSakura207
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|ngabbs\.com)/.+/
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js?version=809809
// @grant        none
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/DSakura207/NgaPostStatus/issues
// @downloadURL https://update.greasyfork.org/scripts/434049/NGA%20Post%20Status%20Query.user.js
// @updateURL https://update.greasyfork.org/scripts/434049/NGA%20Post%20Status%20Query.meta.js
// ==/UserScript==

// This user script is inspired by https://greasyfork.org/en/scripts/376589.
(function () {
  function init($) {
    let b = (commonui.PostQuery = {
      // Bit mask for post status
      statusFlag: {
        _POST_IF_COMMENT: { flag: 1, description: "此贴是评论" },
        _POST_IF_HIDDEN: { flag: 2, description: "此贴已隐藏" },
        _POST_IF_HAVE_COMMENT: { flag: 4, description: "此贴有评论" },
        _POST_UNKNOWN_BIT_4: { flag: 8, description: "未知状态4" },
        _POST_IF_EXTRA_USER_INFO: {
          flag: 16,
          description: "此贴在列表显示更多用户信息",
        },
        _POST_IF_REPORTED: { flag: 32, description: "此贴已被标记" },
        _POST_IF_NO_HINT: { flag: 64, description: "此贴不产生回复提示" },
        _POST_IF_FREE_EDIT: { flag: 128, description: "此贴无编辑期限" },
        _POST_MULTI_USE_1: {
          flag: 256,
          description: "此贴仅限自己回复/回复不受注册时间限制",
        },
        _POST_WAIT_FOR_AUDIT_1: { flag: 512, description: "此贴等待审核" },
        _POST_IF_LOCK: { flag: 1024, description: "此贴被锁定" },
        _POST_USER_PUNISHED_IN_POST: {
          flag: 2048,
          description: "此贴内有用户被处罚",
        },
        _POST_IF_HAS_AUTO_TRANSLATE: {
          flag: 4096,
          description: "此贴有版主翻译",
        },
        _POST_IF_HAS_ATTACHMENT: { flag: 8192, description: "此贴包含附件" },
        _POST_WAIT_FOR_AUDIT_2: { flag: 16384, description: "此贴等待审核" },
        _POST_IS_ST: { flag: 32768, description: "此贴是合集主题" },
        _POST_UNKNOWN_BIT_17: { flag: 65536, description: "未知状态17" },
        _POST_MULTI_USE_2: {
          flag: 131072,
          description: "不在联合版面中显示/锁定合集的全部主题",
        },
        _POST_MULTI_USE_3: {
          flag: 262144,
          description: "此贴是匿名发布/此主题新回复在前",
        },
        _POST_MULTI_USE_4: {
          flag: 524288,
          description: "此贴在主题列表中显示附件/合集子主题不上浮",
        },
        _POST_UNKNOWN_BIT_21: { flag: 1048576, description: "未知状态21" },
        _POST_MULTI_USE_5: {
          flag: 2097152,
          description: "版面镜像/此主题回复全部匿名",
        },
        _POST_UNKNOWN_BIT_23: { flag: 4194304, description: "未知状态23" },
        _POST_UNKNOWN_BIT_24: { flag: 8388608, description: "未知状态24" },
        _POST_MULTI_USE_6: {
          flag: 16777216,
          description: "此功能主题不上浮/此功能主题不显示子主题",
        },
        _POST_UNKNOWN_BIT_26: { flag: 33554432, description: "未知状态26" },
        _POST_MULTI_USE_7: {
          flag: 67108864,
          description: "此贴未通过审核/在主题列表中显示图片",
        },
        _POST_SHOW_RECENT_REPLY: {
          flag: 134217728,
          description: "在主题列表中显示最近回复",
        },
        _POST_UNKNOWN_BIT_29: { flag: 268435456, description: "未知状态29" },
        _POST_UNKNOWN_BIT_30: { flag: 536870912, description: "未知状态30" },
        _POST_ONLY_ONE_REPLY: {
          flag: 1073741824,
          description: "此贴只能回复一次",
        },
        _POST_UNKNOWN_BIT_32: { flag: 2147483648, description: "未知状态32" },
      },
      f: function (e) {
        const pidElement = $(e.currentTarget).parent().children("a[id]");
        console.debug(e.currentTarget);
        if (pidElement.length != 1) {
          console.error(
            "Expected 1 element, got " + pidElement.length + " elements"
          );
          return;
        }
        let pid = $(pidElement[0]).attr("id").match(/(\d+)/)[0];
        console.debug("PID from anchor: " + pid);
        if (pid == 0) {
          console.debug("Not a reply post, use TID!");
          let params = new URLSearchParams(
            document.location.search.substring(1)
          );
          let tid = params.get("tid");
          console.debug("TID is " + tid);
          $.get(`/read.php?tid=${tid}&__output=11`).done(function (data) {
            b.showData(data, tid, "thread");
          });
        } else {
          console.debug("PID is " + pid);
          $.get(`/read.php?pid=${pid}&__output=11`).done(function (data) {
            b.showData(data, pid, "post");
          });
        }
      },
      showData: function (data, pid, postType) {
        const typeName = postType.toUpperCase();
        const postData = data;
        // Post status
        const typeFlags = postData["data"]["__R"][0]["type"];
        // Thread status
        let typeFlags2 = postData["data"]["__T"]["type"];
        // POST status object
        let postStatusObj = {};
        // Thread status object
        let postStatusObj2 = {};
        // commonui.alert content string
        let postStatusString = "";
        // Produce thread main or reply post status object.
        for (const [info, mask] of Object.entries(b.statusFlag)) {
          // Hack for JavaScript bitwise operation.
          // Thanks for https://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
          let rc = (mask.flag & typeFlags) >>> 0;
          let rc2 = (mask.flag & typeFlags2) >>> 0;
          if (rc == mask.flag && postType === "post") {
            postStatusObj[info] = mask.description;
            postStatusString += (mask.description + "；");
          }
          if (rc2 == mask.flag && postType === "thread") {
            postStatusObj2[info] = mask.description;
            postStatusString += (mask.description + "；");
          }
        }
        // Output status object for reference
        console.debug(postStatusObj);
        console.debug(postStatusObj2);
        // Return when status is normal (0).
        if (postStatusString.length == 0) {
          return;
        }
        commonui.alert(postStatusString, `${typeName} ${pid}`);
      },
      r: function () {
        // Ensure only one handler is attached
        $("div.postInfo")
          .off("dblclick.PostQuery")
          .on("dblclick.PostQuery", b.f);
      },
      mo: new MutationObserver(function () {
        b.r();
      }),
    });

    b.r();

    b.mo.observe($("body")[0], {
      childList: true,
      subtree: true,
    });
  }

  (function check() {
    try {
      init(commonui.userScriptLoader.$);
    } catch (e) {
      setTimeout(check, 50);
    }
  })();
})();
