// ==UserScript==
// @name         [MTurk Worker] Workspace Expander
// @namespace    https://github.com/Kadauchi
// @version      1.0.5
// @description  Expands accepted HITs to fill the browser viewport, scrolls to the HIT and focuses it.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/projects/*/tasks/*?assignment_id=*
// @include      https://worker.mturk.com/projects/*
// @downloadURL https://update.greasyfork.org/scripts/35104/%5BMTurk%20Worker%5D%20Workspace%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/35104/%5BMTurk%20Worker%5D%20Workspace%20Expander.meta.js
// ==/UserScript==

function expandWorkspace() {
  const captcha = document.querySelector('img[src^="https://opfcaptcha-prod.s3.amazonaws.com/"]');
  const workspace = document.querySelector('#MainContent');
  const taskRow = document.querySelector('.task-row');
  const taskPreview = document.querySelector('.task-preview');
  const iframeContainer = document.querySelector('.task-row > .col-xs-12');
  const iframe = document.querySelector('.task-question-iframe-container');

  if (!captcha) {
    if (workspace) {
      workspace.style.height = '100vh';
      workspace.scrollIntoView();
    }

    if (taskRow) {
      taskRow.style.height = '100vh';
      taskRow.scrollIntoView();
    }

    if (taskPreview) {
      taskPreview.style.height = '100%';
      taskPreview.scrollIntoView();
    }

    if (iframeContainer) {
      iframeContainer.style.height = `100%`;
      iframeContainer.scrollIntoView();
    }

    if (iframe) {
      iframe.style.height = `100%`;
      iframe.scrollIntoView();
      iframe.querySelector('iframe').focus();
    }
  }
}

function moveFooters() {
  const hr = document.querySelector('hr.footer-horizontal-rule');
  const div = document.querySelector('div.work-pipeline-bottom-bar');
  const footer = document.querySelector('footer');

  document.body.insertBefore(hr, footer);
  document.body.insertBefore(div, footer);
}

expandWorkspace();
moveFooters()