// ==UserScript==
// @name         全屏查看测试用例
// @namespace    github.com/maojj
// @version      0.1
// @description  去掉不关心的内容，专注在用例上
// @author       maojj
// @license MIT
// @match        https://jira.zhenguanyu.com/browse/WUKONGTEST-*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481355/%E5%85%A8%E5%B1%8F%E6%9F%A5%E7%9C%8B%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481355/%E5%85%A8%E5%B1%8F%E6%9F%A5%E7%9C%8B%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B.meta.js
// ==/UserScript==

GM_addStyle('.table-container-wrapper{max-height:1000px !important}')
GM_addStyle('#view_issue_steps_section{height:1100px !important}')

GM_addStyle('#viewissuesidebar{display:none !important}')
GM_addStyle('#details-module{display:none !important}')
GM_addStyle('#descriptionmodule{display:none !important}')
GM_addStyle('#view_issue_execution_section{display:none !important}')
GM_addStyle('#checklistPanelCenter{display:none !important}')
GM_addStyle('#dnd-metadata{display:none !important}')
GM_addStyle('#attachmentmodule{display:none !important}')
GM_addStyle('#activitymodule{display:none !important}')
GM_addStyle('#addcomment{display:none !important}')
