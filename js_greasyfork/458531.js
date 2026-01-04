// ==UserScript==
// @name move-youtube-comments-to-sidebar
// @version 1.0.1
// @license MIT
// @name:ja YouTubeのコメント欄をサイドバーで見れるようにする
// @author yakisova41
// @description Make the Youtube comments section visible from the sidebar
// @description:ja YouTubeのコメント欄をサイドバーから見れるようにします。
// @match https://www.youtube.com/*
// @namespace https://yakisova.com
// @icon data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/458531/move-youtube-comments-to-sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/458531/move-youtube-comments-to-sidebar.meta.js
// ==/UserScript==

(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/findElement.ts
  var findElement;
  var init_findElement = __esm({
    "src/findElement.ts"() {
      findElement = (selector) => {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            const elem = document.querySelector(selector);
            if (elem !== null) {
              clearInterval(interval);
              resolve(elem);
            }
          });
        });
      };
    }
  });

  // src/css/style.css
  var require_style = __commonJS({
    "src/css/style.css"(exports, module) {
      (function() {
        if (!document.getElementById("7e1065fb51bb77ce35a77cffc916cbd9c74a211ded1e7f6c59e5d2b931e3a9eb")) {
          var e = document.createElement("style");
          e.id = "7e1065fb51bb77ce35a77cffc916cbd9c74a211ded1e7f6c59e5d2b931e3a9eb";
          e.textContent = `.mycsButton_cbfc566d866c2a43bc5bcf5094735b68_1{background:var(--yt-spec-badge-chip-background);border:none;color:var(--yt-spec-text-primary);font-size:14px;line-height:36px;height:36px;padding:0 16px;margin-left:8px;border-radius:18px;cursor:pointer;font-family:"Roboto; Arial; sans-serif;";position:relative;display:flex;justify-content:center;align-items:center}.mycsButton_cbfc566d866c2a43bc5bcf5094735b68_1>svg{fill:var(--yt-spec-text-primary)}.mycsButtonDown_cbfc566d866c2a43bc5bcf5094735b68_1{border-radius:18px;position:absolute;width:100%;height:100%;top:0;left:0}.mycsButton_cbfc566d866c2a43bc5bcf5094735b68_1:hover{background:var(--yt-spec-mono-tonal-hover)}.mycsButtonDown_cbfc566d866c2a43bc5bcf5094735b68_1:active{background:var(--yt-spec-touch-response);opacity:.1}.mycsCommentArea_cbfc566d866c2a43bc5bcf5094735b68_1{width:100%}.mycsCommentAreaSecondaryInner_cbfc566d866c2a43bc5bcf5094735b68_1{height:var(--ytd-watch-flexy-chat-max-height);margin-bottom:20px}.mycsCommentAreaBelow_cbfc566d866c2a43bc5bcf5094735b68_1{height:calc(100vh - 56.25vw - var(--ytd-margin-6x) - 56px);margin:20px 0}.mycsCommentInner_cbfc566d866c2a43bc5bcf5094735b68_1{width:100%;height:100%;border-radius:12px;border:solid 1px var(--ytd-searchbox-legacy-button-border-color)}.mycsComments_cbfc566d866c2a43bc5bcf5094735b68_1{overflow-y:scroll;overscroll-behavior:contain;padding:0 20px;height:100%}.mycsComments_cbfc566d866c2a43bc5bcf5094735b68_1::-webkit-scrollbar-thumb{height:56px;border-radius:8px;border:4px solid transparent;background-clip:content-box;background-color:var(--yt-spec-icon-disabled)}.mycsComments_cbfc566d866c2a43bc5bcf5094735b68_1::-webkit-scrollbar{background:transparent;width:16px}.mycsHidden_cbfc566d866c2a43bc5bcf5094735b68_1{display:none}`;
          document.head.appendChild(e);
        }
      })();
      module.exports = JSON.parse('{"mycsButton":"mycsButton_cbfc566d866c2a43bc5bcf5094735b68_1","mycsButtonDown":"mycsButtonDown_cbfc566d866c2a43bc5bcf5094735b68_1","mycsCommentArea":"mycsCommentArea_cbfc566d866c2a43bc5bcf5094735b68_1","mycsCommentAreaSecondaryInner":"mycsCommentAreaSecondaryInner_cbfc566d866c2a43bc5bcf5094735b68_1","mycsCommentAreaBelow":"mycsCommentAreaBelow_cbfc566d866c2a43bc5bcf5094735b68_1","mycsCommentInner":"mycsCommentInner_cbfc566d866c2a43bc5bcf5094735b68_1","mycsComments":"mycsComments_cbfc566d866c2a43bc5bcf5094735b68_1","mycsHidden":"mycsHidden_cbfc566d866c2a43bc5bcf5094735b68_1"}');
    }
  });

  // src/addButton.ts
  var import_style, addButton_default;
  var init_addButton = __esm({
    "src/addButton.ts"() {
      init_findElement();
      import_style = __toESM(require_style());
      addButton_default = async (eventElement) => {
        const button = document.createElement("button");
        button.className = import_style.default.mycsButton;
        button.innerHTML = button.innerHTML + `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><path d="M8,7h8v2H8V7z M8,13h5v-2H8V13z M5,3v13h10h0.41l0.29,0.29L19,19.59V3H5 M4,2h16v20l-5-5H4V2L4,2z"></path></svg>`;
        const buttonDown = document.createElement("div");
        button.appendChild(buttonDown);
        buttonDown.className = import_style.default.mycsButtonDown;
        const buttonsParent = await findElement(
          "ytd-menu-renderer.ytd-watch-metadata"
        );
        buttonsParent.appendChild(button);
        button.onclick = (e) => {
          eventElement.dispatchEvent(
            new CustomEvent("toggleClick", {
              detail: e
            })
          );
        };
      };
    }
  });

  // src/createComments.ts
  async function createComments() {
    const root = document.createElement("div");
    root.classList.add(import_style2.default.mycsCommentArea);
    root.innerHTML = `<div class=${import_style2.default.mycsCommentInner}><div class=${import_style2.default.mycsComments}></div></div>`;
    const commentsOuter = root.querySelector(`.${import_style2.default.mycsComments}`);
    const comments = await findElement("ytd-comments#comments");
    return {
      root,
      commentsOuter,
      comments
    };
  }
  async function smallMode(root) {
    const panels = await findElement("#primary-inner > #below > #panels");
    panels.before(root);
    root.classList.add(import_style2.default.mycsCommentAreaBelow);
    root.classList.remove(import_style2.default.mycsCommentAreaSecondaryInner);
  }
  async function bigMode(root) {
    const panels = await findElement("#secondary-inner > #panels");
    panels.before(root);
    root.classList.add(import_style2.default.mycsCommentAreaSecondaryInner);
    root.classList.remove(import_style2.default.mycsCommentAreaBelow);
  }
  var import_style2, createComments_default;
  var init_createComments = __esm({
    "src/createComments.ts"() {
      import_style2 = __toESM(require_style());
      init_findElement();
      createComments_default = async (eventElement) => {
        const { root, comments, commentsOuter } = await createComments();
        if (window.innerWidth > 1015) {
          bigMode(root);
        } else {
          smallMode(root);
        }
        let innerWidthTmp = 0;
        window.addEventListener("resize", () => {
          setTimeout(async () => {
            if (innerWidthTmp > 1015 && window.innerWidth < 1015) {
              await smallMode(root);
              const related = commentsOuter.querySelector("#related");
              findElement("#primary-inner > #below").then(
                (e) => e.appendChild(related)
              );
            } else if (innerWidthTmp < 1015 && window.innerWidth > 1015) {
              bigMode(root);
            }
            innerWidthTmp = window.innerWidth;
          }, 1);
        });
        eventElement.addEventListener(
          "toggleComments",
          async (e) => {
            if (e.detail) {
              root.classList.add(import_style2.default.mycsHidden);
              const commentParent = await findElement(
                "#primary-inner > #below"
              );
              commentParent.appendChild(comments);
            } else {
              root.classList.remove(import_style2.default.mycsHidden);
              commentsOuter.appendChild(comments);
            }
          }
        );
      };
    }
  });

  // src/main.ts
  function pageChangeListener(eventelement) {
    let beforeHref = "";
    const observer = new MutationObserver(() => {
      const href = location.href;
      if (href !== beforeHref) {
        eventelement.dispatchEvent(
          new CustomEvent("pageChange", {
            detail: {
              beforeHref,
              newHref: href
            }
          })
        );
      }
      beforeHref = href;
    });
    observer.observe(document.querySelector("body"), {
      childList: true,
      subtree: true
    });
  }
  function main() {
    const mycs = document.createElement("div");
    let isButtonCreated = false;
    let isCommentsCreated = false;
    let commentsHide = true;
    pageChangeListener(mycs);
    mycs.addEventListener(
      "pageChange",
      async (e) => {
        const { newHref } = e.detail;
        const pageName = newHref.split("/")[3].split("?")[0];
        if (pageName === "watch") {
          console.log(isButtonCreated);
          if (!isButtonCreated) {
            isButtonCreated = true;
            await addButton_default(mycs);
          }
          if (!isCommentsCreated) {
            isCommentsCreated = true;
            await createComments_default(mycs);
          }
          commentsHide = true;
          mycs.dispatchEvent(
            new CustomEvent("toggleComments", {
              detail: commentsHide
            })
          );
        }
      }
    );
    mycs.addEventListener("toggleClick", () => {
      if (commentsHide) {
        commentsHide = false;
      } else {
        commentsHide = true;
      }
      mycs.dispatchEvent(
        new CustomEvent("toggleComments", {
          detail: commentsHide
        })
      );
    });
  }
  var init_main = __esm({
    "src/main.ts"() {
      init_addButton();
      init_createComments();
    }
  });

  // src/index.ts
  var require_src = __commonJS({
    "src/index.ts"() {
      init_main();
      main();
    }
  });
  require_src();
})();
