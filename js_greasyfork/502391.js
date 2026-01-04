// ==UserScript==
// @name        双卫网省点心吧999999
// @namespace   Violentmonkey Scripts
// @match       https://?*.sww.com.cn?*
// @match       https://*.sww.com.cn/html/myProfile?*
// @match       https://sww.com.cn/html/studyExam*.*
// @match       https://sww.com.cn/html/studyExam*
// @match       https://*.sww.com.cn/html/studyExam*.*
// @match       https://sww.com.cn/html/studyExam?study_id*
// @match       https://sww.com.cn/html/studyExam?study_id=58a444bd-80c5-4b51-b726-b66f7f74a73f&project_id=165363b4-9288-40f1-9f33-f30f3147a919
// @grant       none
// @version     99
// @author      kubixueyiren
// @description 自动听课、考试、答题、交卷，不解释，尽快学习，失效不修复。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502391/%E5%8F%8C%E5%8D%AB%E7%BD%91%E7%9C%81%E7%82%B9%E5%BF%83%E5%90%A7999999.user.js
// @updateURL https://update.greasyfork.org/scripts/502391/%E5%8F%8C%E5%8D%AB%E7%BD%91%E7%9C%81%E7%82%B9%E5%BF%83%E5%90%A7999999.meta.js
// ==/UserScript==
 
$(document).ready(  function() {$("li[is_right=1]").each(function(e, f) {$(this).find("span").click()});});
$(document).ready( function(){$(this).find("#btn-submit.jiaoquan").click()});
(function() {'use strict';if (!isPopQuestion) {isPopQuestion = true;};
var observer = new MutationObserver(function(mutations){mutations.forEach(function(mutation) {var confirmButton = document.querySelector('#btnKaoShi.kaoshi'); if (confirmButton) {observer.disconnect(); confirmButton.click(); } }); });
var targetNode = document.body; var config = { childList: true, subtree: true }; observer.observe(targetNode, config);})();