// ==UserScript==
// @name Gitlab 集成 event
// @namespace mouyong
// @description 集成自动勾选所有选择复选 event
// @match https://git.cblink.net/*/hooks*
// @match https://git.cblink.net/*/settings/integrations
// @match https://git.cblink.net/*/*/merge_requests/*
// @license LGPL
// @grant none
// @version 0.0.1.20191014053154
// @downloadURL https://update.greasyfork.org/scripts/387315/Gitlab%20%E9%9B%86%E6%88%90%20event.user.js
// @updateURL https://update.greasyfork.org/scripts/387315/Gitlab%20%E9%9B%86%E6%88%90%20event.meta.js
// ==/UserScript==
document.querySelectorAll("input[name*='events']").forEach(function (_) {
    _.setAttribute('checked', true);
});

function addPubliskLink() {
  var currentSection = document.querySelector('.mr-info-list');
  if (currentSection === null) return;
  
  var publishLink = document.createElement("a");
  publishLink.setAttribute('href', location.href.substring(0, location.href.indexOf('merge_requests'))+'compare');
  publishLink.innerText = '发布到正式分支';
  publishLink.style.marginRight = '10px';
  
  var walleLink = document.createElement("a");
  walleLink.setAttribute('href', 'http://walle.cblink.net/task/submit/');
  walleLink.innerText = '前往瓦力部署';
  walleLink.style.marginRight = '10px';

  
  var piplinLink = document.createElement("a");
  piplinLink.setAttribute('href', 'http://piplin.tongxinghui.com/deploy-plan/1');
  piplinLink.innerText = '前往 piplin 部署';
  piplinLink.style.marginRight = '10px';
  
  currentSection.appendChild(publishLink);
  currentSection.appendChild(walleLink);
  currentSection.appendChild(piplinLink);
}

window.onload = function () {
  addPubliskLink();
}