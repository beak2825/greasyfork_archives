// ==UserScript==
// @name         Auto Fill Repository Name when Deletion Confirmation
// @name:zh-CN   自动填写 GitHub 仓库名简化删除操作
// @namespace    https://github.com/chiperman/GHRepoDeleteHelper
// @version      1.2.1
// @description  Add a button above the "Delete this repository" button and auto-fill the repository name when deleting a repository on GitHub.
// @description:zh-CN 在“删除此存储库”按钮上方添加一个按钮，并在 GitHub 上删除存储库时自动填写存储库名称。
// @author       chiperman
// @match        https://github.com/*
// @grant        none
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485556/Auto%20Fill%20Repository%20Name%20when%20Deletion%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/485556/Auto%20Fill%20Repository%20Name%20when%20Deletion%20Confirmation.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let observer;

  const checkURL = () => {
    const currentURL = window.location.href;

    if (currentURL.match(/^https:\/\/github\.com\/.*\/.*\/settings/)) {
      const deleteMenuButton = document.getElementById('dialog-show-repo-delete-menu-dialog');

      if (deleteMenuButton) {
        deleteMenuButton.addEventListener('click', clickDeleteRepositoryBtn);
      }
    }
  };

  const clickDeleteRepositoryBtn = () => {
    const targetNode = document.getElementById('repo-delete-menu-dialog');
    observer = new MutationObserver(() => handleDialogClick());
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
  };

  const handleDialogClick = () => {
    const buttonElement = document.getElementById('repo-delete-proceed-button');
    const buttonLabel = buttonElement.textContent.trim();

    if (buttonLabel === 'Delete this repository' || buttonLabel === '删除仓库') {
      const autoInputBtn = createAutoInputButton();
      addButtonToContainer(autoInputBtn, buttonElement);
      autoInputBtn.addEventListener('click', autoInputFunction);
      observer.disconnect();
    }
  };

  const createAutoInputButton = () => {
    const button = document.createElement('span');
    button.innerText = '🤖 Auto Fill';
    button.id = 'auto-input-btn';
    button.className =
      'js-repo-delete-proceed-button Button--danger Button--medium Button Button--fullWidth';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.marginBottom = '8px';
    return button;
  };

  const addButtonToContainer = (autoInputBtn, targetButton) => {
    const buttonContainer = targetButton.parentElement;
    buttonContainer.insertBefore(autoInputBtn, targetButton);
  };

  const autoInputFunction = () => {
    const repositoryElement = document.querySelector('.text-bold.f3.mt-2');
    const repositoryName = repositoryElement.textContent.trim();
    const inputBlock = document.getElementById('verification_field');
    simulateInput(inputBlock, repositoryName);
  };

  // Simulate manually typing each character of the repository name into the input block
  const simulateInput = (inputBlock, repositoryName) => {
    inputBlock.focus();
    inputBlock.value = repositoryName;
    const inputEvent = new Event('input');
    inputBlock.dispatchEvent(inputEvent);
  };

  checkURL();
  const observerConfig = { childList: true, subtree: true };
  const mainObserver = new MutationObserver(() => checkURL());
  mainObserver.observe(document.body, observerConfig);
})();
