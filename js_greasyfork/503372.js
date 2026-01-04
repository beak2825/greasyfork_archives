// ==UserScript==
// @name        双卫网省点心吧0.3
// @namespace   Violentmonkey Scripts
// @match       https://*.www.sww.com.cn/*
// @grant       none
// @version     0.2.0
// @author      kubixueyiren
// @description 自动听课、考试、答题、交卷，不解释，尽快学习，失效不修复。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503372/%E5%8F%8C%E5%8D%AB%E7%BD%91%E7%9C%81%E7%82%B9%E5%BF%83%E5%90%A703.user.js
// @updateURL https://update.greasyfork.org/scripts/503372/%E5%8F%8C%E5%8D%AB%E7%BD%91%E7%9C%81%E7%82%B9%E5%BF%83%E5%90%A703.meta.js
// ==/UserScript==
 
$(document).ready(  function() {$("li[is_right=1]").each(function(e, f) {$(this).find("span").tap()});});
$(document).ready( function(){$(this).find("#btn-submit.jiaoquan").click()});
(function() {'use strict';if (!isPopQuestion) {isPopQuestion = true;};
var observer = new MutationObserver(function(mutations){mutations.forEach(function(mutation) {var confirmButton = document.querySelector('#btnKaoShi.kaoshi'); if (confirmButton) {observer.disconnect(); confirmButton.tap(); } }); });
var targetNode = document.body; var config = { childList: true, subtree: true }; observer.observe(targetNode, config);})();