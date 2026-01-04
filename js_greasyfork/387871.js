// ==UserScript==
// @name                Instagram - Add notes to the user
// @name:zh-CN          Instagram - 为用户添加备注(别名/标签)
// @name:zh-TW          Instagram - 為使用者新增備註(別名/標籤)
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://greasyfork.org/zh-CN/users/193133-pana
// @icon                data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+
// @version             6.1.8
// @description         Add notes (aliases/tags) for users to help identify and search, and support WebDAV sync
// @description:zh-CN   为用户添加备注(别名/标签)功能，以帮助识别和搜索，并支持 WebDAV 同步功能
// @description:zh-TW   為使用者新增備註(別名/標籤)功能，以幫助識別和搜尋，並支援 WebDAV 同步功能
// @license             GNU General Public License v3.0 or later
// @compatible          chrome
// @compatible          firefox
// @author              pana
// @match               *://*.instagram.com/*
// @require             https://gcore.jsdelivr.net/gh/LightAPIs/greasy-fork-library@da0437e6a856e05158df61225f2b9ea9943ad9ef/Note_Obj.js
// @connect             *
// @noframes
// @grant               GM_info
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_listValues
// @grant               GM_openInTab
// @grant               GM_addStyle
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_addValueChangeListener
// @grant               GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/387871/Instagram%20-%20Add%20notes%20to%20the%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/387871/Instagram%20-%20Add%20notes%20to%20the%20user.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const UPDATED = '2023-04-21';
  const INS_ICON = {
    NOTE_BLACK: 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2IoMzgsIDM4LCAzOCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYigzOCwgMzgsIDM4KSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)'
  };
  const selector = {
    homepage: {
      article: '[role="main"] article',
      id: '._aaqt a',
      icon: 'span._aamz',
      commentId: '._ab8x .xt0psk2 a.notranslate',
      commentAt: '._ab8x ._aacl a.notranslate'
    },
    homepageStories: {
      id: '._aad6',
      idShell: 'li [role="menuitem"]'
    },
    homepageRecommend: {
      id: '._aak3 ._ab8x .xt0psk2 a'
    },
    userPage: {
      frame: '._aa_y',
      id: 'h2',
      bar: '.x8j4wrb',
      box: 'ul',
      common: 'span._aaai',
      suggest: '._acj1 a.notranslate',
      infoAt: '.notranslate',
      userName: '._aa_c > span'
    },
    watchList: {
      initialItem: '[role="dialog"] [aria-labelledby]',
      laterItem: '._aaei',
      id: '._ab8w a.notranslate'
    },
    stories: {
      id: 'a.notranslate',
      idShell: '._ac0o',
      cardId: '._afgd ._aacw'
    },
    dialog: {
      frame: '[role="dialog"] article',
      commentId: '._a9zc ._ab8w a, ._aacx._aacu a',
      commentAt: '._a9zs .notranslate'
    },
    request: {
      follow: '._aajc ._ab8x .xt0psk2 a'
    },
    suggest: {
      user: '._aa0- ._ab8x .xt0psk2 a'
    }
  };
  const nameSet = {
    backgroundBox: 'note-obj-ins-background-box',
    userpageTag: 'note-obj-ins-userpage-tag',
    fontBold: 'note-obj-ins-font-bold',
    addBtn: 'note-obj-ins-add-btn',
    homepageBtn: 'note-obj-ins-homepage-btn',
    userpageBtn: 'note-obj-ins-userpage-btn'
  };
  const INS_STYLE = `
    .${nameSet.backgroundBox} {
      display: inline-block;
      align-items: center;
      white-space: nowrap;
      border-radius: 50px;
      padding: 0px 10px;
      background-color: #336699;
      color: #fff;
    }
    .${nameSet.addBtn} {
      background-image: ${INS_ICON.NOTE_BLACK};
      background-size: 24px;
      background-repeat: no-repeat;
      background-position: center;
      margin-left: 5px;
      cursor: pointer;
      width: 24px;
      height: 24px;
    }
    .${nameSet.homepageBtn} {
      margin: 6px !important;
    }
    .${nameSet.homepageBtn}:hover {
      opacity: 0.5;
    }
    .${nameSet.userpageBtn} {
      margin-top: 2px;
    }
    .${nameSet.userpageTag} {
      display: block;
      font-size: 20px;
      margin-bottom: 20px;
      white-space: nowrap;
    }
    .${nameSet.fontBold} {
      font-weight: bold;
    }
    .note-obj-settings-frame-card label {
      color: #2f2f2f;
    }
    .note-obj-interface-dark .note-obj-settings-frame-card label {
      color: #fff;
    }
    .note-obj-group-frame-tbody input,
    .note-obj-webdav-frame-form-item input {
      color: #000;
    }`;
  const noteObj = new Note_Obj({
    id: 'myInstagramNote',
    script: {
      author: {
        name: 'pana',
        homepage: 'https://greasyfork.org/zh-CN/users/193133-pana'
      },
      url: 'https://greasyfork.org/scripts/387871',
      updated: UPDATED
    },
    style: INS_STYLE,
    primaryColor: '#336699',
    settings: {
      replaceHomepageID: {
        type: 'checkbox',
        lang: {
          en: 'Allow replacing user IDs on the home page',
          zhHans: '允许替换首页上的用户 ID',
          zhHant: '允許替換首頁上的使用者 ID'
        },
        default: true,
        event: instagramHomepageEvent
      }
    },
    changeEvent: instagramChangeEvent
  });
  function homepageNote(ele, changeId) {
    const user = noteObj.fn.queryAnchor(ele, selector.homepage.id);
    if (user) {
      const replaceHomepageID = noteObj.getOtherConfig().replaceHomepageID === true;
      const eleId = noteObj.fn.getIdFromUrl(user.href);
      if (!changeId || changeId === eleId) {
        noteObj.handler(eleId, user, undefined, {
          add: replaceHomepageID ? undefined : 'sapn',
          className: replaceHomepageID ? undefined : [nameSet.backgroundBox]
        });
      }
    }
  }
  function homepageCommentNote(ele, changeId) {
    for (const comment of noteObj.fn.queryAllAnchor(ele, selector.homepage.commentId, 'info')) {
      const commentId = noteObj.fn.getIdFromUrl(comment.href);
      if (!changeId || changeId === commentId) {
        noteObj.handler(commentId, comment);
      }
    }
  }
  function homepageCommentAtNote(ele, changeId) {
    const commentAtId = noteObj.fn.getIdFromUrl(ele.href);
    if (!changeId || changeId === commentAtId) {
      noteObj.handler(commentAtId, ele, undefined, {
        prefix: '@',
        title: true
      });
    }
  }
  function dialogCommentNote(ele, chagneId) {
    const picCommentId = noteObj.fn.getIdFromUrl(ele.href);
    if (!chagneId || chagneId === picCommentId) {
      noteObj.handler(picCommentId, ele);
    }
  }
  function dialogCommentAtNote(ele, changeId) {
    if (!ele.classList.contains(selector.homepage.commentId.replace(/^\.|\s+.*$/g, ''))) {
      const picCommentAtId = noteObj.fn.getIdFromUrl(ele.href);
      if (!changeId || changeId === picCommentAtId) {
        noteObj.handler(picCommentAtId, ele, undefined, {
          prefix: '@',
          title: true
        });
      }
    }
  }
  function homepageStoriesNote(ele, changeId) {
    const homepageStoriesId = noteObj.fn.getText(ele, selector.homepageStories.id);
    if (!changeId || changeId === homepageStoriesId) {
      ele.title = noteObj.getUserTag(homepageStoriesId);
    }
  }
  function anchorElementNote(ele, changeId) {
    const itemId = noteObj.fn.getIdFromUrl(ele.href);
    if (!changeId || changeId === itemId) {
      noteObj.handler(itemId, ele);
    }
  }
  function userPageNote(ele, changeId) {
    const userPageId = noteObj.fn.getText(ele, selector.userPage.id);
    const userPageBox = noteObj.fn.query(ele, selector.userPage.box);
    if (userPageId && userPageBox) {
      if (changeId) {
        if (changeId === userPageId) {
          noteObj.handler(userPageId, ele, undefined, {
            add: 'div',
            after: userPageBox,
            maskSecondaryColor: true,
            offsetWidth: -20,
            className: [nameSet.userpageTag, nameSet.fontBold]
          });
        }
      } else {
        const userNameText = noteObj.fn.getText(ele, selector.userPage.userName, 'warn');
        noteObj.handler(userPageId, ele, undefined, {
          add: 'div',
          after: userPageBox,
          maskSecondaryColor: true,
          offsetHeight: -20,
          className: [nameSet.userpageTag, nameSet.fontBold]
        }, userNameText);
      }
    }
  }
  function userPageCommonNote(ele, changeId) {
    for (const commonUser of noteObj.fn.queryAll(ele, selector.userPage.common, 'info')) {
      const commonUserId = commonUser.textContent?.trim();
      if (commonUserId) {
        if (!changeId || changeId === commonUserId) noteObj.handler(commonUserId, commonUser, undefined, {
          title: true,
          notModify: true
        });
      }
    }
  }
  function userPageInfoAtNote(ele, changeId) {
    for (const infoAtUser of noteObj.fn.queryAllAnchor(ele, selector.userPage.infoAt, 'info')) {
      const infoAtUserId = noteObj.fn.getIdFromUrl(infoAtUser.href);
      if (!changeId || changeId === infoAtUserId) {
        noteObj.handler(infoAtUserId, infoAtUser, undefined, {
          prefix: '@',
          title: true
        });
      }
    }
  }
  function storiesNote(ele, changeId) {
    itemNote(ele, selector.stories.id, changeId);
    noteObj.fn.queryAll(selector.stories.cardId).forEach(item => {
      const itemId = item.textContent?.trim() || '';
      if (!changeId || changeId === itemId) {
        noteObj.handler(itemId, item, undefined, {
          notModify: true,
          title: true
        });
      }
    });
  }
  function watchListItemNote(ele, changeId) {
    itemNote(ele, selector.watchList.id, changeId);
  }
  function itemNote(ele, idSelector, changeId) {
    const item = noteObj.fn.queryAnchor(ele, idSelector);
    if (item) {
      const itemId = noteObj.fn.getIdFromUrl(item.href);
      if (!changeId || changeId === itemId) {
        noteObj.handler(itemId, item);
      }
    }
  }
  function instagramChangeEvent(changeId) {
    for (const article of noteObj.fn.queryAll(selector.homepage.article, 'none')) {
      homepageNote(article, changeId);
      homepageCommentNote(article, changeId);
      for (const commentAt of noteObj.fn.queryAllAnchor(selector.homepage.commentAt, 'none')) {
        homepageCommentAtNote(commentAt, changeId);
      }
      for (const picCommentUser of noteObj.fn.queryAllAnchor(selector.dialog.commentId, 'none')) {
        dialogCommentNote(picCommentUser, changeId);
      }
      for (const picCommentAt of noteObj.fn.queryAllAnchor(selector.dialog.commentAt, 'none')) {
        dialogCommentAtNote(picCommentAt, changeId);
      }
    }
    for (const homepageStories of noteObj.fn.queryAll(selector.homepageStories.idShell, 'none')) {
      homepageStoriesNote(homepageStories, changeId);
    }
    for (const homepageRecommend of noteObj.fn.queryAllAnchor(selector.homepageRecommend.id, 'none')) {
      anchorElementNote(homepageRecommend, changeId);
    }
    for (const userPage of noteObj.fn.queryAll(selector.userPage.frame, 'none')) {
      userPageNote(userPage, changeId);
      userPageCommonNote(userPage, changeId);
      userPageInfoAtNote(userPage, changeId);
    }
    for (const storiesShell of noteObj.fn.queryAll(selector.stories.idShell, 'none')) {
      storiesNote(storiesShell, changeId);
    }
    for (const initial of noteObj.fn.queryAll(selector.watchList.initialItem, 'none')) {
      watchListItemNote(initial, changeId);
    }
    for (const later of noteObj.fn.queryAll(selector.watchList.laterItem, 'none')) {
      watchListItemNote(later, changeId);
    }
    for (const dialog of noteObj.fn.queryAll(selector.dialog.frame, 'none')) {
      homepageNote(dialog, changeId);
      homepageCommentNote(dialog, changeId);
      for (const commentUser of noteObj.fn.queryAllAnchor(selector.dialog.commentId, 'none')) {
        dialogCommentNote(commentUser, changeId);
      }
      for (const commentAt of noteObj.fn.queryAllAnchor(selector.dialog.commentAt, 'none')) {
        dialogCommentAtNote(commentAt, changeId);
      }
    }
    for (const follow of noteObj.fn.queryAllAnchor(selector.request.follow, 'none')) {
      anchorElementNote(follow, changeId);
    }
    for (const suggestUser of noteObj.fn.queryAllAnchor(selector.suggest.user, 'none')) {
      anchorElementNote(suggestUser, changeId);
    }
    for (const suggest of noteObj.fn.queryAllAnchor(selector.userPage.suggest, 'none')) {
      anchorElementNote(suggest, changeId);
    }
  }
  function instagramHomepageEvent(newValue, oldValue) {
    for (const article of noteObj.fn.queryAll(selector.homepage.article)) {
      const articleUser = noteObj.fn.queryAnchor(article, selector.homepage.id);
      if (articleUser) {
        const articleUserId = noteObj.fn.getIdFromUrl(articleUser.href);
        noteObj.handler(articleUserId, articleUser, undefined, {
          add: oldValue ? undefined : 'span',
          className: oldValue ? undefined : [nameSet.backgroundBox],
          title: oldValue,
          restore: true
        });
        noteObj.handler(articleUserId, articleUser, undefined, {
          add: newValue ? undefined : 'span',
          className: newValue ? undefined : [nameSet.backgroundBox],
          title: newValue
        });
      }
    }
  }
  function initInstagram() {
    const arriveOption = {
      fireOnAttributesModification: true,
      existing: true
    };
    noteObj.arrive(document.body, selector.homepage.article, arriveOption, article => {
      const homepageIcon = noteObj.fn.query(article, selector.homepage.icon);
      const articleUserId = noteObj.fn.getUrlId(article, selector.homepage.id);
      if (homepageIcon && articleUserId) {
        homepageIcon.insertAdjacentElement('beforebegin', noteObj.createNoteBtn(articleUserId, undefined, [nameSet.addBtn, nameSet.homepageBtn], 'span'));
      }
      homepageNote(article);
      homepageCommentNote(article);
      noteObj.arrive(article, selector.homepage.commentAt, arriveOption, commentAt => {
        homepageCommentAtNote(commentAt);
      });
      noteObj.arrive(article, selector.dialog.commentId, arriveOption, picCommentUser => {
        dialogCommentNote(picCommentUser);
      });
      noteObj.arrive(article, selector.dialog.commentAt, arriveOption, picCommentAt => {
        dialogCommentAtNote(picCommentAt);
      });
    });
    noteObj.arrive(document.body, selector.homepageStories.idShell, arriveOption, homepageStories => {
      homepageStoriesNote(homepageStories);
    });
    noteObj.arrive(document.body, selector.homepageRecommend.id, arriveOption, homepageRecommend => {
      anchorElementNote(homepageRecommend);
    });
    noteObj.arrive(document.body, selector.userPage.frame, arriveOption, userPage => {
      const userPageBar = noteObj.fn.query(userPage, selector.userPage.bar);
      const userPageId = noteObj.fn.getText(userPage, selector.userPage.id);
      if (userPageBar && userPageId) {
        const userNameText = noteObj.fn.getText(userPage, selector.userPage.userName, 'info');
        userPageBar.after(noteObj.createNoteBtn(userPageId, userNameText, [nameSet.addBtn, nameSet.userpageBtn]));
      }
      userPageNote(userPage);
      userPageCommonNote(userPage);
      userPageInfoAtNote(userPage);
    });
    noteObj.arrive(document.body, selector.stories.idShell, arriveOption, storiesShell => {
      storiesNote(storiesShell);
      const stories = noteObj.fn.queryAnchor(storiesShell, selector.stories.id);
      if (stories) {
        const userIdChange = new MutationObserver(() => {
          const newUserId = noteObj.fn.getIdFromUrl(stories.href);
          if (noteObj.judgeUsers(newUserId)) {
            noteObj.handler(newUserId, stories);
          } else {
            noteObj.handler(newUserId, stories, undefined, {
              restore: true
            });
          }
        });
        userIdChange.observe(stories, {
          attributeFilter: ['href']
        });
      }
    });
    noteObj.arrive(document.body, selector.watchList.initialItem, arriveOption, initial => {
      watchListItemNote(initial);
    });
    noteObj.arrive(document.body, selector.watchList.laterItem, arriveOption, later => {
      watchListItemNote(later);
    });
    noteObj.arrive(document.body, selector.dialog.frame, arriveOption, dialog => {
      const homepageIcon = noteObj.fn.query(dialog, selector.homepage.icon);
      const dialogUserId = noteObj.fn.getUrlId(dialog, selector.homepage.id);
      if (homepageIcon && dialogUserId) {
        homepageIcon.insertAdjacentElement('beforebegin', noteObj.createNoteBtn(dialogUserId, undefined, [nameSet.addBtn, nameSet.homepageBtn], 'span'));
      }
      homepageNote(dialog);
      homepageCommentNote(dialog);
      noteObj.arrive(dialog, selector.dialog.commentId, arriveOption, commentUser => {
        dialogCommentNote(commentUser);
      });
      noteObj.arrive(dialog, selector.dialog.commentAt, arriveOption, commentAt => {
        dialogCommentAtNote(commentAt);
      });
    });
    noteObj.arrive(document.body, selector.request.follow, arriveOption, follow => {
      anchorElementNote(follow);
    });
    noteObj.arrive(document.body, selector.suggest.user, arriveOption, suggestUser => {
      anchorElementNote(suggestUser);
    });
    noteObj.arrive(document.body, selector.userPage.suggest, arriveOption, suggest => {
      anchorElementNote(suggest);
    });
  }
  initInstagram();
})();
