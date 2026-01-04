// ==UserScript==
// @name         Comment Zoomer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Add zoom button in github comment to provide full screen mode, allowing you to write comments more elegantly
// @author       IsaacKam
// @match        https://github.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453950/Comment%20Zoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/453950/Comment%20Zoomer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const namespace = '__ISSUE_EDITOR__';
  const emToggleState = {
    IDLE: '',
    NORMAL: 'normal',
    FULL_SCREEN: 'full_screen'
  };
  const emPreviewState = {
    IDLE: '',
    NORMAL: 'normal',
    PREVIEW: 'preview'
  };
  const store = {
    sup: null,
    previewTimer: 0,
    toggleStatus: emToggleState.IDLE,
    previewStatus: emPreviewState.IDLE
  };

  const initStyle = () => {
    const style = document.createElement('style');
    const cssText = document.createTextNode(`
      .issue-editor__body--disable-scroll {
        overflow: hidden;
      }
      .issue-editor__entry-btn {
        display: inline-block;
        cursor: pointer;
        user-select: none;
        color: rgb(87, 96, 106);
        margin-left: 8px;
        vertical-align: top;
      }
      .issue-editor__caret {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
      }
      .issue-editor__textarea {
        max-height: none !important;
        height: calc(100vh - 200px) !important;
      }
      .issue-editor__file-attachment {
        margin-left: 15px;
      }
      .issue-editor__file-attachment--preview {
        width: 50vw;
      }
      .issue-editor__file-attachment-write-content--preview {
        display: block !important;
      }
      .issue-editor__preview-content--preview {
        width: 50vw;
        margin-left: calc(50vw + 8px) !important;
        display: block !important;
        position: absolute;
        top: 56px;
        height: calc(100vh - 170px) !important;
        overflow: auto;
        border: 1px solid darkturquoise;
        border-radius: 2px;
      }
      markdown-toolbar.issue-editor__markdown-toolbar {
        display: block !important;
      }
    `);
    style.appendChild(cssText);
    document.head.appendChild(style);
  };

  const nodes = {};
  const intiGetter = (get) => ({ get });
  Object.defineProperties(nodes, {
    discussionBucket: intiGetter(
      () => document.querySelector("#discussion_bucket")),
    caret: intiGetter(
      () => store.sup.querySelector(".timeline-comment--caret")),
    markdownToolbar: intiGetter(
      () => store.sup.querySelector("markdown-toolbar")),
    textarea: intiGetter(
      () => store.sup.querySelector("textarea.js-comment-field")),
    commentFormActions: intiGetter(
      () => store.sup.querySelector('.comment-form-actions')),
    newCommentSup: intiGetter(
      () => nodes.discussionBucket.querySelector('.discussion-timeline-actions')),
    newCommentFormActions: intiGetter(
      () => nodes.newCommentSup.querySelector('#partial-new-comment-form-actions')),
    fileAttachment: intiGetter(
      () => store.sup.querySelector('file-attachment')),
    fileAttachmentWriteContent: intiGetter(
        () => nodes.fileAttachment.querySelector('.write-content')),
    previewContent: intiGetter(
      () => store.sup.querySelector('.preview-content')),
    previewEntery: intiGetter(
      () => store.sup.querySelector('.issue-editor__preview-btn')),
    updateEntery: intiGetter(
      () => store.sup.querySelector('.issue-editor__update-btn')),
    previewTab: intiGetter(
      () => store.sup.querySelector('.preview-tab')),
    writeTab: intiGetter(
      () => store.sup.querySelector('.write-tab')),
  });

  window[namespace] = {};
  window[namespace].store = store;
  window[namespace].nodes = nodes;

  function addClass({ node, classname }) {
    const classSet = new Set(node.classList);
    classSet.add(classname);
    node.setAttribute('class', Array.from(classSet).join(' '));
  }

  function removeClass({ node, classname }) {
    const classSet = new Set(node.classList);
    classSet.delete(classname);
    node.setAttribute('class', Array.from(classSet).join(' '));
  }

  function fullScreen() {
    store.toggleStatus = emToggleState.FULL_SCREEN;
    addClass({ node: document.body, classname: 'issue-editor__body--disable-scroll' });
    addClass({ node: nodes.caret, classname: 'issue-editor__caret' });
    addClass({ node: nodes.textarea, classname: 'issue-editor__textarea' });
    addClass({ node: nodes.fileAttachment, classname: 'issue-editor__file-attachment' });

    appendPreviewEntery();

    Object.assign(nodes.markdownToolbar.style, {
      display: 'block !important'
    });

    nodes.textarea.focus();
  }

  function normalScreen() {
    store.toggleStatus = emToggleState.NORMAL;
    removeClass({ node: document.body, classname: 'issue-editor__body--disable-scroll' });
    removeClass({ node: nodes.caret, classname: 'issue-editor__caret' });
    removeClass({ node: nodes.textarea, classname: 'issue-editor__textarea' });
    removeClass({ node: nodes.fileAttachment, classname: 'issue-editor__file-attachment' });
    removePreviewEntry();
  }

  function setPreviewMode() {
    store.previewStatus = emPreviewState.PREVIEW;
    addClass({
      node: nodes.fileAttachment,
      classname: 'issue-editor__file-attachment--preview'
    });
    addClass({
      node: nodes.fileAttachmentWriteContent,
      classname: 'issue-editor__file-attachment-write-content--preview'
    });
    addClass({
      node: nodes.previewContent,
      classname: 'issue-editor__preview-content--preview'
    });
    addClass({
      node: nodes.markdownToolbar,
      classname: 'issue-editor__markdown-toolbar'
    });
    nodes.previewTab.click();
    appendEntry({
      text: 'Update',
      classname: 'issue-editor__update-btn',
      onclick() {
        nodes.previewTab.click();
      }
    });
    Object.assign(nodes.markdownToolbar.style, {
      display: 'block !important'
    });
    nodes.markdownToolbar.setAttribute('style', 'display: block !important');
  }

  function removePreviewMode() {
    store.previewStatus = emPreviewState.NORMAL;
    removeClass({
      node: nodes.fileAttachment,
      classname: 'issue-editor__file-attachment--preview'
    });
    removeClass({
      node: nodes.fileAttachmentWriteContent,
      classname: 'issue-editor__file-attachment-write-content--preview'
    });
    removeClass({
      node: nodes.previewContent,
      classname: 'issue-editor__preview-content--preview'
    });
    removeClass({
      node: nodes.markdownToolbar,
      classname: 'issue-editor__markdown-toolbar'
    });
    removeEntry(nodes.updateEntery);
    nodes.writeTab.click();
    nodes.writeTab.focus();
    clearTimeout(store.previewTimer);
  }

  function interceptCommentFormActions(node) {
    node.onclick = () => {
      if (store.toggleStatus !== emToggleState.FULL_SCREEN) {
        return;
      }
      normalScreen();
    };
    interceptSubmitComment(node);
  }
  function interceptSubmitComment(node) {
    const submit = node.querySelector('[type=submit]');
    const oldSubmitClick = submit.click;
    submit.onclick = () => {
      oldSubmitClick();
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  }
  function appendEntry({
    text,
    classname,
    onclick
  }) {
    const isExist = nodes.markdownToolbar.querySelector('.' + classname);
    if (isExist) {
      return;
    }

    const node = document.createElement('div');
    const classnameSet = new Set(['issue-editor__entry-btn', classname]);
    addClass({ node, classname: Array.from(classnameSet).join(' ') })
    node.innerHTML = text;
    if (onclick) {
      node.onclick = onclick;
    }
    nodes.markdownToolbar.append(node);
    return node;
  }

  function appendZoomEntry(sup) {
    const zoom = appendEntry({
      text: 'Zoom',
      classname: 'issue-editor__zoom-btn',
      onclick() {
        console.info('[node.onclick] invoked!');
        if (store.toggleStatus === emToggleState.FULL_SCREEN) {
          normalScreen();
          return;
        }
        store.sup =sup;
        fullScreen();
      }
    });
    return zoom;
  }

  function appendPreviewEntery() {
    appendEntry({
      text: 'Preview',
      classname: 'issue-editor__preview-btn',
      onclick() {
        if (store.previewStatus === emPreviewState.PREVIEW) {
          removePreviewMode();
          return;
        }

        setPreviewMode();
      }
    });
  }

  function removeEntry(node) {
    if (!node) {
      return;
    }
    node.onclick = null;
    node.parentElement.removeChild(node);
  }

  function removePreviewEntry() {
    removeEntry(nodes.previewEntery)
    removePreviewMode();
    clearTimeout(store.previewTimer);
  }

  function initHistoryCommentEntries() {
    const parent = nodes.discussionBucket.querySelector(".js-discussion.js-socket-channel");
    const findEditBtn = (node) => node.querySelector('.js-comment-edit-button');
    const findAllTimelineItem = (node) => Array.from(node.querySelectorAll('.js-timeline-item'));
    const loopFindEditBtn = (it, cb) => {
      const editBtn = findEditBtn(it);
      if (editBtn) {
        cb(editBtn);
        return;
      }
      setTimeout(() => {
        loopFindEditBtn(it, cb)
      }, 200);
    };
    const findDetailBtn = (node) => node.querySelectorAll('details')[1];
    const getItem = (sup) => ({ sup, sub: findDetailBtn(sup) });
    const main = parent.children[0];
    const rest = parent.children[1];

    const items = [
      getItem(main),
      ...findAllTimelineItem(rest).map(it => getItem(it))
    ].filter(it => it.sub);

    for (const it of items) {
      it.sub.onclick = () => {
        it.sub.onclick = null;
        loopFindEditBtn(it.sub, (editBtn) => {
          editBtn.onclick = () => {
            store.sup = it.sup;
            appendZoomEntry(it.sup);
            interceptCommentFormActions(nodes.commentFormActions);
          }
        });
      };
    }
  }

  function initNewCommentEntry() {
    store.sup = nodes.newCommentSup;
    appendZoomEntry(nodes.newCommentSup);
    interceptCommentFormActions(nodes.newCommentFormActions);
  }

  function ready(cb) {
    if (nodes.discussionBucket) {
      return setTimeout(cb, 200);
    }
    setTimeout(() => ready(cb), 200)
  }

  ready(() => {
    console.info('invoked Issue Editor!');
    initStyle();
    initNewCommentEntry();
    initHistoryCommentEntries();
  });
})();
