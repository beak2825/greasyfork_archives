// ==UserScript==
// @name Gmail Quick Links Extension Mods for new Gmail
// @namespace http://github.com/exterrestris
// @version 0.5.0
// @description Adjusts the quick links extension to fit within Gmail's visual look
// @grant GM_addStyle
// @run-at document-start
// @match *://*.mail.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/415190/Gmail%20Quick%20Links%20Extension%20Mods%20for%20new%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/415190/Gmail%20Quick%20Links%20Extension%20Mods%20for%20new%20Gmail.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

  #gmailQuickLinksContainer {
    display: block !important;
  }

  #gmailQuickLinks {
    width: 240px;

    .r {
      font-size: 80%;

      :first-child {
        opacity: 0;
      }
    }

    .pU {
      white-space: nowrap;
      margin-left: 70px;
    }

    #listContainer {
      padding-left: 0 !important;

      > div {
        padding-left: 0 !important;
        white-space: nowrap;
        overflow: hidden;

        > div {
          position: relative;
          padding-left: 58px;
          padding-right: 9px;
          height: 32px;
          display: flex;
          align-items: center;

          > span {
            float: none;
            flex: none;
            z-index: 3;
            margin-left: 3px;
            display: none;
          }

          .clear {
            display: none;
          }

          &::before, &::after {
            content: '';
            position: absolute;
            display: block;
            pointer-events: none;
          }

          &::before {
            left: 27px;
            top: -2px;
            width: 18px;
            height: 18px;
            transform: translateY(50%);
            background: #ccc url('https://ssl.gstatic.com/ui/v1/icons/mail/pimages/2/search_white.png');
            z-index: 2;
            border-radius: 4px;
          }

          &::after {
            border-radius: 16px;
            transition: border-radius .15s cubic-bezier(0.4,0.0,0.2,1),margin .15s cubic-bezier(0.4,0.0,0.2,1),width .15s cubic-bezier(0.4,0.0,0.2,1);

            .bhZ.bym & {
              margin: 0 -36px;
              width: 256px;
            }
          }

          &:hover {
            &::after {
              background-color: #f1f3f4;
              height: 32px;
              width: 32px;
              top: 0;
              left: 20px;
            }
            
            > span {
              display: block;
            }
          }
        }
      }

      .n0 {
        text-decoration: none !important;
        font-size: 14px;
        color: inherit !important;
        flex: 1 1 0;
        display: inline-block;
        margin-left: -60px;
        height: 32px;
        line-height: 32px;
        padding-left: 66px;
        z-index: 3;
      }
    }

    .bhZ:not(.bym) & {
      .po, .r, #listContainer > div > div > * {
        opacity: 0;
      }
    }
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
