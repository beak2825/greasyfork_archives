// ==UserScript==
// @name                Greasyfork - Add notes to the script
// @name:zh-CN          Greasyfork - 为脚本添加备注(别名/标签)
// @name:zh-TW          Greasyfork - 為指令碼新增備註(別名/標籤)
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://greasyfork.org/zh-CN/users/193133-pana
// @icon                data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2JhKDI5LDE2MSwyNDIsMS4wMCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYmEoMjksMTYxLDI0MiwxLjAwKSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+
// @version             3.1.7
// @description         Add notes (aliases/tags) for scripts to help identify and search, and support WebDAV sync
// @description:zh-CN   为脚本添加备注(别名/标签)功能，以帮助识别和搜索，并支持 WebDAV 同步功能
// @description:zh-TW   為指令碼新增備註(別名/標籤)功能，以幫助識別和搜尋，並支援 WebDAV 同步功能
// @author              pana
// @license             GNU General Public License v3.0 or later
// @compatible          chrome
// @compatible          firefox
// @match               *://*.greasyfork.org/*
// @match               *://*.sleazyfork.org/*
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
// @grant               GM_xmlhttpRequest
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_addValueChangeListener
// @grant               GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/404275/Greasyfork%20-%20Add%20notes%20to%20the%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/404275/Greasyfork%20-%20Add%20notes%20to%20the%20script.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const UPDATED = '2023-04-21';
  const GF_ICON = {
    NOTE_BLACK: 'url(data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9Im5ld0ljb25UaXRsZSIgc3Ryb2tlPSJyZ2IoMzgsIDM4LCAzOCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZmlsbD0ibm9uZSIgY29sb3I9InJnYigzOCwgMzgsIDM4KSI+IDx0aXRsZSBpZD0ibmV3SWNvblRpdGxlIj5OZXc8L3RpdGxlPiA8cGF0aCBkPSJNMTkgMTRWMjJIMi45OTk5N1Y0SDEzIi8+IDxwYXRoIGQ9Ik0xNy40NjA4IDQuMDM5MjFDMTguMjQxOCAzLjI1ODE3IDE5LjUwODIgMy4yNTgxNiAyMC4yODkyIDQuMDM5MjFMMjAuOTYwOCA0LjcxMDc5QzIxLjc0MTggNS40OTE4NCAyMS43NDE4IDYuNzU4MTcgMjAuOTYwOCA3LjUzOTIxTDExLjU4NTggMTYuOTE0MkMxMS4yMTA3IDE3LjI4OTMgMTAuNzAyIDE3LjUgMTAuMTcxNiAxNy41TDcuNSAxNy41TDcuNSAxNC44Mjg0QzcuNSAxNC4yOTggNy43MTA3MSAxMy43ODkzIDguMDg1NzkgMTMuNDE0MkwxNy40NjA4IDQuMDM5MjFaIi8+IDxwYXRoIGQ9Ik0xNi4yNSA1LjI1TDE5Ljc1IDguNzUiLz4gPC9zdmc+)'
  };
  const nameSet = {
    noteBtn: 'note-obj-gf-note-btn',
    infoNoteBtn: 'note-obj-gf-info-note-btn',
    libraryNoteBtn: 'note-obj-gf-library-note-btn',
    listNoteBtn: 'note-obj-gf-list-note-btn',
    tsNoteBtn: 'note-obj-gf-ts-note-btn',
    noteTag: 'note-obj-gf-note-tag',
    tsNoteTag: 'note-obj-gf-ts-note-tag',
    listNoteTag: 'note-obj-gf-list-note-tag'
  };
  const GF_STYLE = `
    .${nameSet.noteBtn} {
      background-image: ${GF_ICON.NOTE_BLACK};
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      vertical-align: top;
    }
    .${nameSet.infoNoteBtn} {
      background-size: 32px auto;
      width: 32px;
      height: 32px;
      margin-left: 20px;
      display: inline-block;
    }
    .${nameSet.libraryNoteBtn} {
      background-size: 24px auto;
      width: 24px;
      height: 24px;
      margin-left: 20px;
      display: inline-block;
    }
    .${nameSet.listNoteBtn} {
      background-size: 24px auto;
      width: 24px;
      height: 24px;
      margin-left: 10px;
      display: none;
    }
    .${nameSet.tsNoteBtn} {
      background-size: 16px auto;
      width: 16px;
      height: 16px;
      margin-left: 10px;
      display: none;
      vertical-align: sub;
    }
    ol.script-list li:hover .${nameSet.listNoteBtn},
    #script-table tbody tr:hover .${nameSet.tsNoteBtn} {
      display: inline-block;
    }
    .${nameSet.noteTag},
    .${nameSet.tsNoteTag} {
      background-color: #3c81df;
      color: #fff;
      display: inline-block;
      align-items: center;
      white-space: nowrap;
      border-radius: 50px;
      padding: 1px 10px;
      line-height: 1em;
    }
    .${nameSet.listNoteTag} {
      text-decoration: none;
    }`;
  const noteObj = new Note_Obj({
    id: 'myGreasyForkNote',
    script: {
      author: {
        name: 'pana',
        homepage: 'https://greasyfork.org/zh-CN/users/193133-pana'
      },
      url: 'https://greasyfork.org/scripts/404275',
      updated: UPDATED
    },
    itemClick: key => `${location.origin}/scripts/${key}`,
    language: {
      userIdText: {
        en: 'Script ID',
        zhHans: '脚本 ID',
        zhHant: '指令碼 ID'
      },
      userNameText: {
        en: 'Script name',
        zhHans: '脚本名',
        zhHant: '指令碼名'
      }
    },
    changeEvent,
    style: GF_STYLE
  });
  function changeEvent(id) {
    const scriptId = getScriptIdFromPathname(location.pathname);
    if (scriptId) {
      infoPageNotes(scriptId, undefined, id);
    } else {
      listPageNotes(id);
      initTS(id);
    }
  }
  function initTS(changeId) {
    noteObj.fn.queryAll('#script-table tbody tr').forEach(item => {
      const scriptTitle = noteObj.fn.queryAnchor(item, '.thetitle a');
      if (scriptTitle) {
        const res = scriptTitle.href.match(/\d+$/);
        if (res) {
          const scriptId = res[0];
          const scriptName = scriptTitle.textContent?.trim();
          const thetitle = noteObj.fn.query(item, '.thetitle');
          if (thetitle && !noteObj.fn.query(thetitle, '.' + Note_Obj.btnClassName, 'none')) {
            thetitle.appendChild(noteObj.createNoteBtn(scriptId, scriptName, [nameSet.noteBtn, nameSet.tsNoteBtn]));
          }
          if (!changeId || changeId === scriptId) {
            noteObj.handler(scriptId, scriptTitle, undefined, {
              add: 'span',
              className: [nameSet.tsNoteTag]
            }, scriptName);
          }
        }
      }
    });
  }
  function getScriptIdFromPathname(pathname) {
    const res = pathname.match(/^\/[\w-]+\/scripts\/(\d+)-/);
    if (res && res.length === 2) {
      return res[1];
    }
    return null;
  }
  function infoPageNotes(scriptId, scriptName, changeId) {
    const ele = noteObj.fn.query('#script-info h2', 'info');
    if (ele) {
      if (!changeId || changeId === scriptId) noteObj.handler(scriptId, ele, undefined, {
        add: 'sapn',
        className: [nameSet.noteTag]
      }, scriptName);
    }
  }
  function listPageNotes(changeId) {
    const list = noteObj.fn.queryAll('ol.script-list li', 'info');
    for (const ele of list) {
      const scriptId = ele.dataset.scriptId;
      if (scriptId) {
        const description = noteObj.fn.query(ele, '.description');
        const scriptName = noteObj.fn.getText(ele, 'article > h2 > a', 'warn');
        if (description) {
          const desParent = description.parentElement;
          if (desParent && !noteObj.fn.query(desParent, '.' + Note_Obj.btnClassName, 'none')) {
            description.before(noteObj.createNoteBtn(scriptId, scriptName, [nameSet.noteBtn, nameSet.listNoteBtn]));
          }
        }
        const header = noteObj.fn.query(ele, 'article > h2 > a');
        if (header) {
          if (!changeId || changeId === scriptId) noteObj.handler(scriptId, header, undefined, {
            add: 'span',
            className: [nameSet.noteTag, nameSet.listNoteTag]
          }, scriptName);
        }
      }
    }
  }
  function init() {
    const scriptId = getScriptIdFromPathname(location.pathname);
    if (scriptId) {
      const installHelpLink = noteObj.fn.query('#install-area .install-help-link:last-child', 'info');
      const scriptName = noteObj.fn.getText('header h2');
      if (installHelpLink) {
        installHelpLink.after(noteObj.createNoteBtn(scriptId, scriptName, [nameSet.noteBtn, nameSet.infoNoteBtn]));
      } else {
        const suggestion = noteObj.fn.query('#script-feedback-suggestion');
        suggestion?.appendChild(noteObj.createNoteBtn(scriptId, scriptName, [nameSet.noteBtn, nameSet.libraryNoteBtn]));
      }
      infoPageNotes(scriptId, scriptName);
    } else {
      listPageNotes();
      const scriptList = noteObj.fn.query('#browse-script-list', 'info');
      if (scriptList) {
        const listObserver = new MutationObserver(() => {
          listPageNotes();
        });
        listObserver.observe(scriptList, {
          childList: true
        });
      }
      initTS();
      const tsTbody = noteObj.fn.query('#script-table tbody', 'none');
      if (tsTbody) {
        const tsObserver = new MutationObserver(() => {
          initTS();
        });
        tsObserver.observe(tsTbody, {
          childList: true
        });
      }
    }
  }
  init();
})();
