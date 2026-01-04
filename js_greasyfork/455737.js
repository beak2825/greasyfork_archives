// ==UserScript==
// @name         __JIRA_pro
// @namespace    https://work.fineres.com/
// @version      0.5
// @description  拯救JIRA! 拯救帆软! 拯救世界!
// @author       LeoYuan
// @license      CC-BY-4.0; https://creativecommons.org/licenses/by/4.0/legalcode
// @match        https://work.fineres.com/browse/*
// @icon         https://work.fineres.com/s/3e84z9/805005/12f785fd3d3d0d63b7c21a41e0d048b2/_/jira-favicon-hires.png
// @require      https://greasyfork.org/scripts/455782-fork-of-gm-config/code/fork%20of%20GM_config.js
// @require      https://greasyfork.org/scripts/454354/code/yssWaitForNode.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js
// @resource     https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css
// @supportURL   https://greasyfork.org/en/scripts/455737
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455737/__JIRA_pro.user.js
// @updateURL https://update.greasyfork.org/scripts/455737/__JIRA_pro.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var $ = window.$ || {}
  const WFN = new WaitForNode();

  //  WFN.add('', '', '', (el) => el.click() );

  WFN.add('处理下拉框-问题涉及插件', '', 'select#customfield_17837', (el) => $(el).select2({width: '500px'}));

  WFN.add('处理下拉框-通用', '', 'select.select', (el) => {
    if(el.options.length > 20) $(el).select2({width: '500px'});
  });


})();