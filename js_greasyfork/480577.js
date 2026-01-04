// ==UserScript==
// @name        Add Jira Bug Template
// @description 填充模板到 Jira 解决问题中的备注部分
// @author      SpikeLeung
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version     0.0.5
// @match     https://jira.gyenno.com/*
// @downloadURL https://update.greasyfork.org/scripts/480577/Add%20Jira%20Bug%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/480577/Add%20Jira%20Bug%20Template.meta.js
// ==/UserScript==

(function () {
  const TEMPALTE_VISUAL = [
    "问题原因",
    "问题影响范围",
    "修复方案",
    "修复方案影响范围",
    "验证建议",
  ].map((title, index) => {
    const newline = index === 0 ? '' : '<br>'
    return `<p><strong>${newline}${title}</strong></p>`
  }).join("<hr><br>") + "<hr><br>" // 在最后补充一个横线

  const fillTemplateIntoVisual = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const remarkDocument = document.querySelector("#comment-wiki-edit iframe").contentWindow.document;
    remarkDocument.querySelector("#tinymce").innerHTML = TEMPALTE_VISUAL;
  };

  const createFillTemplateButton = () => {
    const button = document.createElement("button");

    button.innerText = "填充 Bug 模板"
    button.classList.add("aui-button")

    return button
  }

  const initResolveButton = () => {
    setTimeout(() => {
      const resolveButton = document.querySelector("#action_id_5");
      resolveButton && resolveButton.addEventListener("click", addTemplateBtn);
    }, 500)
  }

  const addTemplateBtn = () => {
    setTimeout(() => {
      const parentNode = document.querySelector(".buttons-container.form-footer .buttons");
      const resolveButton = document.querySelector(".buttons-container.form-footer .buttons #issue-workflow-transition-submit");
      const button = createFillTemplateButton()

      parentNode.insertBefore(button, resolveButton);
      button.onclick = fillTemplateIntoVisual
    }, 500);
  };

  const initStartButton = () => {
    const startButton = document.querySelector("#opsbar-transitions_more");
    startButton && startButton.addEventListener("click", initResolveButton)
  }

  const initCommetBtn = () => {
    const commentBtn = document.querySelector("#footer-comment-button");
    commentBtn && commentBtn.addEventListener("click", addTemplateBtnForComment)
  }

  const addTemplateBtnForComment = () => {
    setTimeout(() => {
      const parentNode = document.querySelector(".comment-input .editor-toggle-tabs .aui-nav");
      const textButton = document.querySelector(".comment-input .editor-toggle-tabs [data-mode='source']");
      const button = createFillTemplateButton()
      button.style.marginLeft = '4px'

      parentNode.insertBefore(button, textButton.nextSibling);
      button.onclick = fillTemplateIntoVisual
    }, 500)
  };

  const init = () => {
    console.log('Add_Jira_Bug_Template inited...')
    initStartButton()
    initResolveButton()
    initCommetBtn()
  };

  init()

  JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, () => {
    console.log("Something changed, recreating button...");
    init()
  });
})();
