// ==UserScript==
// @name                X(Twitter) - Add notes to the user
// @name:zh-CN          X(Twitter) - 为用户添加备注(别名/标签)
// @name:zh-TW          X(Twitter) - 為使用者新增備註(別名/標籤)
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://greasyfork.org/zh-CN/users/193133-pana
// @icon                data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+
// @version             6.1.14
// @description         Add notes (aliases/tags) for users to help identify and search, and support WebDAV sync
// @description:zh-CN   为用户添加备注(别名/标签)功能，以帮助识别和搜索，并支持 WebDAV 同步功能
// @description:zh-TW   為使用者新增備註(別名/標籤)功能，以幫助識別和搜尋，並支援 WebDAV 同步功能
// @author              pana
// @license             GNU General Public License v3.0 or later
// @compatible          chrome
// @compatible          firefox
// @match               *://x.com/*
// @match               *://*twitter.com/*
// @require             https://gcore.jsdelivr.net/gh/LightAPIs/greasy-fork-library@47d998f5f1e438fe137647b8735b1e17a77e4b69/Note_Obj.js
// @connect             *
// @noframes
// @grant               GM_info
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_listValues
// @grant               GM_openInTab
// @grant               GM_addStyle
// @grant               GM_xmlhttpRequest
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_addValueChangeListener
// @grant               GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/404587/X%28Twitter%29%20-%20Add%20notes%20to%20the%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/404587/X%28Twitter%29%20-%20Add%20notes%20to%20the%20user.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const UPDATED = '2024-05-15';
  const TWITTER_ICON = {
    NOTE_GRAY: 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2IoMTAxLCAxMTksIDEzNCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYigxMDEsIDExOSwgMTM0KSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)',
    NOTE_BLUE: 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)'
  };
  const selector = {
    root: '#react-root',
    homepage: {
      id: 'div[data-testid="User-Name"] a[role="link"] > div[dir] > span',
      article: 'article',
      toolBar: '[tabindex="0"]:scope [role="group"][id]',
      showName: 'div[data-testid="User-Name"] a[role="link"] > div > div[dir] > span',
      reprintA: 'a[role][dir][id]',
      reprintName: '[data-testid="socialContext"] [dir]',
      at: '[data-testid="tweetText"]  a[dir][role="link"]',
      blockquote: 'div[aria-labelledby][id] div[id] div[role="link"]',
      blockquoteId: 'div[data-testid="User-Name"] div[tabindex] div[dir]',
      blockquoteShowName: 'div[data-testid="User-Name"] div[dir]'
    },
    userpage: {
      main: '.css-175oi2r.r-ttdzmv.r-1ifxtd0',
      id: '[data-testid="UserName"] div[tabindex] div[dir] > span',
      showName: '[data-testid="UserName"] div[dir] > span',
      follow: '.css-175oi2r.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs'
    },
    comment: {
      toolBar: '[tabindex="-1"]:scope [role="group"][id]'
    },
    hover: {
      panel: 'div[data-testid="HoverCard"] > div > div',
      userAvatar: '[data-testid^="UserAvatar-Container-"]',
      id: 'a[role="link"]',
      showName: 'a[role="link"] > div > [dir] > span'
    },
    modal: {
      cell: '[aria-labelledby="modal-header"] [data-testid="UserCell"]',
      id: 'a[role="link"]',
      showName: 'a[role="link"] > div > [dir] > span'
    },
    follow: {
      cell: '[data-testid="cellInnerDiv"] [data-testid="UserCell"]',
      id: 'a[role="link"]',
      showName: 'a[role="link"] > div > [dir] > span'
    },
    rightRecommended: {
      cell: '[role="complementary"] [data-testid="UserCell"]',
      id: 'a[role="link"]',
      showName: 'a[role="link"] > div > [dir]'
    }
  };
  const nameSet = {
    blueTag: 'note-obj-twitter-blue-tag',
    noteBtn: 'note-obj-twitter-note-btn',
    panelBtn: 'note-obj-twitter-panel-btn',
    beforeFollowNoteBtn: 'note-obj-twitter-before-follow-note-btn',
    baseToolBarBtn: 'note-obj-twitter-base-tool-bar-btn',
    commentToolBarBtn: 'note-obj-twitter-comment-tool-bar-btn'
  };
  const style = `
    .${nameSet.blueTag} {
      background-color: #3c81df;
      color: #fff;
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      line-height: 100%;
      border-radius: 50px;
    }
    .${nameSet.noteBtn} {
      background-image: ${TWITTER_ICON.NOTE_GRAY};
      background-repeat: no-repeat;
      background-position: center;
      background-color: rgba(0, 0, 0, 0);
      border-bottom-left-radius: 9999px;
      border-bottom-right-radius: 9999px;
      border-top-left-radius: 9999px;
      border-top-right-radius: 9999px;
      transition-property: background-color, box-shadow;
      transition-duration: 0.2s;
    }
    .${nameSet.noteBtn}:hover {
      background-image: ${TWITTER_ICON.NOTE_BLUE};
      background-color: rgba(29, 161, 242, .1);
    }
    .${nameSet.panelBtn} {
      height: 32px;
      width: 32px;
      margin: 5px 0px 0px 0px;
      background-size: 28px auto;
      cursor: pointer !important;
      border-radius: 0px;
    }
    .${nameSet.panelBtn}:hover::after {
      content: "";
      display: flex;
      position: relative;
      background-color: rgba(29, 161, 242, .1);
      width: 48px;
      height: 48px;
      top: -8px;
      left: -8px;
      border-radius: 99px;
    }
    .${nameSet.beforeFollowNoteBtn} {
      height: 36px;
      width: 36px;
      background-image: ${TWITTER_ICON.NOTE_BLUE};
      background-repeat: no-repeat;
      background-size: 19px auto;
      background-position: center;
      margin-bottom: 12px;
      margin-right: 12px;
      cursor: pointer;
      border: 1px solid rgba(29, 161, 242, 1);
      border-bottom-left-radius: 9999px;
      border-bottom-right-radius: 9999px;
      border-top-left-radius: 9999px;
      border-top-right-radius: 9999px;
      background-color: rgba(0, 0, 0, 0);
      transition-property: background-color, box-shadow;
      transition-duration: 0.2s;
    }
    .${nameSet.beforeFollowNoteBtn}:hover {
      background-color: rgba(29, 161, 242, .1);
    }
    .${nameSet.baseToolBarBtn} {
      height: 18px;
      width: 18px;
      margin: 0px -40px 0px 0px;
      background-size: 20px auto;
      border-radius: 0px;
      margin: 0 12px;
    }
    .${nameSet.baseToolBarBtn}:hover::after {
      content: "";
      position: absolute;
      background-color: rgba(29, 161, 242, .1);
      width: 34px;
      height: 34px;
      top: -8px;
      right: 5px;
      border-radius: 99px;
    }
    .${nameSet.commentToolBarBtn} {
      height: 24px;
      width: 24px;
      margin: 10px 0px 0px 0px;
      background-size: 24px auto;
      border-radius: 0px;
      cursor: pointer;
      margin-left: 12px;
    }
    .${nameSet.commentToolBarBtn}:hover::after {
      content: "";
      position: absolute;
      background-color: rgba(29, 161, 242, .1);
      width: 38px;
      height: 38px;
      top: 3px;
      right: -2px;
      border-radius: 99px;
    }
    ${selector.homepage.showName}, ${selector.modal.showName} {
      white-space: normal;
    }
    .note-obj-add-frame-dialog button {
      text-align: center;
    }
    .note-obj-management-frame-save-content,
    .note-obj-management-frame-cancel-content,
    .note-obj-group-frame-save-content,
    .note-obj-group-frame-cancel-content {
      font-size: 12px;
    }`;
  const noteObj = new Note_Obj({
    id: 'myTwitterNote',
    script: {
      author: {
        name: 'pana',
        homepage: 'https://greasyfork.org/zh-CN/users/193133-pana'
      },
      url: 'https://greasyfork.org/scripts/404587',
      updated: UPDATED
    },
    style,
    changeEvent: changeEvent,
    settings: {
      showToolbarButton: {
        type: 'checkbox',
        lang: {
          en: 'Display the "Note" button in the toolbar below each tweet (if there is no such button in the user\'s hover information panel, this option can be turned on)',
          zhHans: '在每条推特下方的工具栏里显示"备注"按钮 (如果在用户的悬停信息面板里没有此按钮时，可以打开此选项)',
          zhHant: '在每條推特下方的工具欄裡顯示"備註"按鈕 (如果在使用者的懸停資訊面板裡沒有此按鈕時，可以開啟此選項)'
        },
        default: false,
        event: insertToolbarButtonEvent
      },
      disableInTweets: {
        type: 'checkbox',
        lang: {
          en: 'Disable replacing @user with @note in tweets',
          zhHans: '禁用将推文中的 @user 替换为 @note',
          zhHant: '禁用將推文中的 @user 替換為 @note'
        },
        default: false,
        event: disableInTweetsEvent
      }
    }
  });
  function atFilter(text) {
    return text.replace(/^@/, '');
  }
  function hrefComparator(href) {
    return /^\/[^/]+$/i.test(href);
  }
  function toolBarNoteButton(ele, state) {
    const eleId = noteObj.fn.getText(ele, selector.homepage.id, 'error', atFilter);
    if (eleId) {
      const eleName = noteObj.fn.getText(ele, selector.homepage.showName, 'info');
      const homepageToolBar = noteObj.fn.query(ele, selector.homepage.toolBar, 'info');
      const commentToolBar = noteObj.fn.query(ele, selector.comment.toolBar, 'info');
      if (homepageToolBar) {
        const homepageToolBarBtn = noteObj.fn.query(homepageToolBar, '.' + Note_Obj.btnClassName, 'none');
        if (state) {
          !homepageToolBarBtn && homepageToolBar.appendChild(noteObj.createNoteBtn(eleId, eleName, [nameSet.noteBtn, nameSet.baseToolBarBtn]));
        } else {
          homepageToolBarBtn && homepageToolBarBtn.remove();
        }
      }
      if (commentToolBar) {
        const commentToolBarBtn = noteObj.fn.query(commentToolBar, '.' + Note_Obj.btnClassName, 'none');
        if (state) {
          !commentToolBarBtn && commentToolBar.appendChild(noteObj.createNoteBtn(eleId, eleName, [nameSet.noteBtn, nameSet.commentToolBarBtn]));
        } else {
          commentToolBarBtn && commentToolBarBtn.remove();
        }
      }
    }
  }
  function homepageNote(ele, changeId) {
    const eleId = noteObj.fn.getText(ele, selector.homepage.id, 'error', atFilter);
    if (eleId) {
      if (changeId) {
        changeId === eleId && noteObj.handler(eleId, ele, selector.homepage.showName, {
          add: 'span',
          className: [nameSet.blueTag]
        });
      } else {
        const eleName = noteObj.fn.getText(ele, selector.homepage.showName, 'info');
        noteObj.handler(eleId, ele, selector.homepage.showName, {
          add: 'span',
          className: [nameSet.blueTag]
        }, eleName);
      }
    }
  }
  function reprintANote(ele, changeId) {
    const reprintA = noteObj.fn.queryAnchor(ele, selector.homepage.reprintA, 'info');
    if (reprintA) {
      const eleId = noteObj.fn.getIdFromUrl(reprintA.href);
      if (!changeId || changeId === eleId) {
        noteObj.handler(eleId, reprintA, selector.homepage.reprintName, {
          add: 'span',
          className: [nameSet.blueTag],
          offsetWidth: 30
        });
      }
    }
  }
  function blockquoteNote(ele, changeId) {
    const blockquote = noteObj.fn.query(ele, selector.homepage.blockquote, 'info');
    if (blockquote) {
      const blockquoteUser = noteObj.fn.query(blockquote, selector.homepage.blockquoteShowName);
      if (blockquoteUser) {
        const eleId = noteObj.fn.getText(blockquote, selector.homepage.blockquoteId, 'error', atFilter);
        if (!changeId || changeId === eleId) {
          noteObj.handler(eleId, blockquoteUser, undefined, {
            add: 'span',
            className: [nameSet.blueTag]
          });
        }
      }
    }
  }
  function homepageAtNote(ele, state, changeId) {
    for (const atUser of noteObj.fn.queryAllAnchor(ele, selector.homepage.at, 'info')) {
      if (hrefComparator(atUser.getAttribute('href') || '')) {
        const atUserId = noteObj.fn.getIdFromUrl(atUser.href);
        if (!changeId || changeId === atUserId) {
          noteObj.handler(atUserId, atUser, undefined, {
            prefix: '@',
            restore: state
          });
        }
      }
    }
  }
  function userpageNote(ele, changeId) {
    const eleId = noteObj.fn.getText(ele, selector.userpage.id, 'error', atFilter);
    if (changeId) {
      changeId === eleId && noteObj.handler(eleId, ele, selector.userpage.showName, {
        add: 'span',
        className: [nameSet.blueTag]
      });
    } else {
      const eleName = noteObj.fn.getText(ele, selector.userpage.showName, 'info');
      noteObj.handler(eleId, ele, selector.userpage.showName, {
        add: 'span',
        className: [nameSet.blueTag]
      }, eleName);
    }
  }
  function followNote(ele, changeId) {
    spanItemNote(ele, selector.follow.id, selector.follow.showName, changeId);
  }
  function rightRecommendedNote(ele, changeId) {
    spanItemNote(ele, selector.rightRecommended.id, selector.rightRecommended.showName, changeId);
  }
  function modalNote(ele, changeId) {
    spanItemNote(ele, selector.modal.id, selector.modal.showName, changeId);
  }
  function spanItemNote(ele, idSelector, nameSelector, changeId) {
    const eleId = noteObj.fn.getUrlId(ele, idSelector);
    if (!changeId || changeId === eleId) {
      noteObj.handler(eleId, ele, nameSelector, {
        add: 'span',
        className: [nameSet.blueTag]
      });
    }
  }
  function disableInTweetsEvent(status) {
    noteObj.fn.queryAll(selector.homepage.article, 'none').forEach(ele => {
      homepageAtNote(ele, status);
    });
  }
  function insertToolbarButtonEvent(status) {
    noteObj.fn.queryAll(selector.homepage.article, 'none').forEach(ele => {
      toolBarNoteButton(ele, status);
    });
  }
  function changeEvent(changeId) {
    noteObj.fn.queryAll(selector.homepage.article, 'none').forEach(ele => {
      homepageNote(ele, changeId);
      reprintANote(ele, changeId);
      blockquoteNote(ele, changeId);
      homepageAtNote(ele, noteObj.getOtherConfig().disableInTweets === true, changeId);
    });
    noteObj.fn.queryAll(selector.userpage.main).forEach(ele => {
      userpageNote(ele, changeId);
    });
    noteObj.fn.queryAll(selector.follow.cell, 'info').forEach(ele => {
      followNote(ele, changeId);
    });
    noteObj.fn.queryAll(selector.rightRecommended.cell).forEach(ele => {
      rightRecommendedNote(ele, changeId);
    });
    noteObj.fn.queryAll(selector.modal.cell, 'info').forEach(ele => {
      modalNote(ele, changeId);
    });
  }
  function init() {
    const arriveOption = {
      fireOnAttributesModification: true,
      existing: true
    };
    const rootDom = noteObj.fn.query(selector.root);
    if (rootDom === null) {
      return;
    }
    noteObj.arrive(rootDom, selector.homepage.article, arriveOption, ele => {
      toolBarNoteButton(ele, noteObj.getOtherConfig().showToolbarButton === true);
      homepageNote(ele);
      reprintANote(ele);
      blockquoteNote(ele);
      const disableInTweets = noteObj.getOtherConfig().disableInTweets === true;
      if (!disableInTweets) {
        homepageAtNote(ele, disableInTweets);
      }
    });
    noteObj.arrive(rootDom, selector.userpage.main, arriveOption, ele => {
      const eleId = noteObj.fn.getText(ele, selector.userpage.id, 'error', atFilter);
      if (eleId) {
        const eleName = noteObj.fn.getText(ele, selector.userpage.showName, 'info');
        let followNoteBtn;
        const userpageFollow = noteObj.fn.query(ele, selector.userpage.follow);
        if (userpageFollow) {
          followNoteBtn = noteObj.createNoteBtn(eleId, eleName, [nameSet.beforeFollowNoteBtn, 'css-901oao']);
          userpageFollow.insertAdjacentElement('afterbegin', followNoteBtn);
        }
        const userIdChange = new MutationObserver(() => {
          const newUserId = noteObj.fn.getText(ele, selector.userpage.id, 'error', atFilter);
          if (newUserId) {
            noteObj.handler('', ele, selector.userpage.showName, {
              add: 'span',
              className: [nameSet.blueTag]
            });
            const newUserName = noteObj.fn.getText(ele, selector.userpage.showName, 'info');
            if (followNoteBtn) {
              followNoteBtn.remove();
              followNoteBtn = noteObj.createNoteBtn(newUserId, newUserName, [nameSet.beforeFollowNoteBtn, 'css-901oao']);
              userpageFollow && userpageFollow.insertAdjacentElement('afterbegin', followNoteBtn);
            }
            noteObj.handler(newUserId, ele, selector.userpage.showName, {
              add: 'span',
              className: [nameSet.blueTag]
            }, newUserName);
          }
        });
        const obId = noteObj.fn.query(ele, selector.userpage.id);
        obId && userIdChange.observe(obId, {
          subtree: true,
          characterData: true
        });
      }
      userpageNote(ele);
    });
    noteObj.arrive(rootDom, selector.follow.cell, arriveOption, ele => {
      followNote(ele);
    });
    noteObj.arrive(rootDom, selector.rightRecommended.cell, arriveOption, ele => {
      rightRecommendedNote(ele);
    });
    noteObj.arrive(rootDom, selector.modal.cell, arriveOption, ele => {
      modalNote(ele);
    });
    noteObj.arrive(rootDom, selector.hover.panel, arriveOption, ele => {
      const eleId = noteObj.fn.getUrlId(ele, selector.hover.id);
      if (eleId) {
        const userShowNameText = noteObj.fn.getText(ele, selector.hover.showName, 'info');
        const userAvatar = noteObj.fn.query(ele, selector.hover.userAvatar);
        userAvatar && userAvatar.after(noteObj.createNoteBtn(eleId, userShowNameText, [nameSet.noteBtn, nameSet.panelBtn]));
        noteObj.handler(eleId, ele, selector.hover.showName, {
          add: 'span',
          className: [nameSet.blueTag]
        }, userShowNameText);
      }
    });
  }
  init();
})();
