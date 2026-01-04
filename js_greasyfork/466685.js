// ==UserScript==
// @name         领歌深色主题
// @namespace    https://github.com/pcy190/TamperMonkeyScript
// @version      1.6
// @description  暗金色主题,、隐藏多余组件
// @author       lnwazg
// @match        https://www.leangoo.com/kanban/board/*
// @grant        none
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/466685/%E9%A2%86%E6%AD%8C%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/466685/%E9%A2%86%E6%AD%8C%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

function filterCSSRules(selectorText) {
  let rules = document.styleSheets[0].cssRules;
  let matchedRules = [];
  for (let i=0; i<rules.length; i++) {
    let rule = rules[i];
    if (rule.selectorText === selectorText) {
      matchedRules.push(rule);
    }
  }
  return matchedRules;
}

document.body.style.backgroundColor="black";

//全局修改样式
filterCSSRules(".list_name").forEach(e => {
    e.style.color ="#10B910";
});
filterCSSRules(".list-header .list-title-div").forEach(e => {
    e.style.backgroundColor ="black";
});
filterCSSRules(".task_view").forEach(e => {
    e.style.backgroundColor ="black";
});
filterCSSRules(".task-name-content").forEach(e => {
    e.style.backgroundColor ="black";
    e.style.color ="#F0B27A";
});

filterCSSRules(".btn-default").forEach(e => {
    e.style.backgroundColor ="black";
     e.style.color ="darksalmon";
});

filterCSSRules(".btnEditTaskSlide").forEach(e => {
    e.style.color ="darksalmon";
});

//替换左上角的logo
document.querySelector(".navbar-logo").src = "https://www.leangoo.com/wp-content/uploads/2023/03/%E5%B7%A5%E4%BD%9C%E5%8F%B0.png"

//隐藏团队切换标识
document.querySelector("#ent_list_button").style.display="none";

