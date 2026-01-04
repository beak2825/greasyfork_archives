// ==UserScript==
// @name        NGA Topped Collapse
// @namespace   https://greasyfork.org/users/263018
// @version     1.0.1
// @author      snyssss
// @description 置顶折叠

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/427092/NGA%20Topped%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/427092/NGA%20Topped%20Collapse.meta.js
// ==/UserScript==

((ui) => {
  if (!ui) return;

  // KEY
  const COLLAPSE_SUBFORUMS_ENABLE_KEY = "COLLAPSE_SUBFORUMS_ENABLE";
  const COLLAPSE_ADS_ENABLE_KEY = "COLLAPSE_ADS_ENABLE";

  // 折叠子版块
  const collapseSubForumsEnable =
    GM_getValue(COLLAPSE_SUBFORUMS_ENABLE_KEY) || false;
  
  // 折叠广告
  const collapseAdsEnable =
    GM_getValue(COLLAPSE_ADS_ENABLE_KEY) || false;

  // 钩子
  const hookFunction = (object, functionName, callback) => {
    ((originalFunction) => {
      object[functionName] = function () {
        const returnValue = originalFunction.apply(this, arguments);

        callback.apply(this, [returnValue, originalFunction, arguments]);

        return returnValue;
      };
    })(object[functionName]);
  };

  // 是否折叠
  let collapsed = true;

  // 主函数
  const execute = () => {
    const topped = document.querySelector("#toptopics");

    if (topped) {
      const postrow = topped.querySelector(".postrow");
      const subForums = collapseSubForumsEnable ? document.querySelectorAll(
        "#sub_forums_c, #more_sub_forums_c"
      ) : [];
      const ads = collapseAdsEnable ? document.querySelectorAll(
        "[id*=bbs_ads]"
      ) : [];

      const collapse = () => {
        [postrow, ...subForums, ...ads].forEach(
          (element) => {
            element.style = `display: ${collapsed ? "none" : "block"}`;
          }
        );
      };

      const button = topped.querySelector("A");

      button.onclick = () => {
        collapsed = !collapsed;

        collapse();

        return false;
      };

      collapse();
    }
  };

  // 绑定事件
  (() => {
    let initialized = false;

    hookFunction(ui, "eval", () => {
      if (initialized) return;

      if (ui.parseToppedTopic) {
        hookFunction(ui, "parseToppedTopic", execute);

        initialized = true;
      }
    });

    execute();
  })();

  // 菜单项
  (() => {
    // 折叠子版块
    if (collapseSubForumsEnable) {
      GM_registerMenuCommand("折叠子版块：启用", () => {
        GM_setValue(COLLAPSE_SUBFORUMS_ENABLE_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("折叠子版块：禁用", () => {
        GM_setValue(COLLAPSE_SUBFORUMS_ENABLE_KEY, true);
        location.reload();
      });
    }
    
    // 折叠广告
    if (collapseAdsEnable) {
      GM_registerMenuCommand("折叠广告：启用", () => {
        GM_setValue(COLLAPSE_ADS_ENABLE_KEY, false);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("折叠广告：禁用", () => {
        GM_setValue(COLLAPSE_ADS_ENABLE_KEY, true);
        location.reload();
      });
    }
  })();
})(commonui);
