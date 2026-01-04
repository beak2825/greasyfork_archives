// ==UserScript==
// @name Rounded Square Label Badges for New Gmail
// @namespace http://github.com/exterrestris
// @version 0.4.0
// @description Display labels as 'badges' in the message list
// @grant GM_addStyle
// @run-at document-start
// @match *://*.mail.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/415188/Rounded%20Square%20Label%20Badges%20for%20New%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/415188/Rounded%20Square%20Label%20Badges%20for%20New%20Gmail.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

  /****************
  * Message List *
  ****************/
  .ar.as {
    position: relative;
    box-sizing: border-box;
    background-color: transparent;
    margin-top: 0;
    padding-right: 0;
    margin-right: 5px;

    &:nth-of-type(6) ~ & {
      display: none;
    }

    .at {
      width: 2.9ex;
      overflow: hidden;
      height: 2.9ex;

      .av {
        width: 0;
        padding: 0;
      }

      &[title="Inbox"], &[title="Bin"] {
        width: auto;
        overflow: visible;

        .av {
          width: auto;
          padding: 0 8px;
        }
      }

      &[title="Inbox"] .av {
        font-weight: bold;
      }
      
      &[title="Bin"] .av {
        font-style: italic;
      }


    }

    .au {
      border-width: 0;
    }

    .au .av {
      overflow: hidden;
    }
  }

  .as {
    position: relative;
  }

  .Zs .yi {
    max-width: none;
  }

  .y6 {
    line-height: 1.5;
  }

  .xT {
    justify-content: right;
  }

  /*********************
  * Add Custom Colour *
  *********************/
  .Kj-JD-Jz .ar.as .at {
    width: auto;
    overflow: visible;
    position: relative;
    margin-left: 4.3ex;

    &:before {
      content: '';
      width: 2.9ex;
      height: 2.9ex;
      position: absolute;
      left: -4.3ex;
      top: 0;
      background-color: inherit;
      border-radius: 3em;
      border: 1px solid rgba(51,51,51,0.4) !important;
    }

    .av {
      width: auto;
      padding: 0 8px;
    }
  }

  /****************
  * Preview Pane *
  ****************/
  .hX {
    border-collapse: separate;
    border-spacing: 0;
    border: 0;

    .hM {
      border: 1px solid transparent;
    }

    .hU.hM {
      border-right: 0;
      padding-left: 0.5em;
      padding-right: 0.4em;
    }

    .hV.hM {
      border-left: 0;
      padding-right: 0.8em;
      padding-left: 0.3em;

      .hO {
        padding: 0;
        vertical-align: top;
        top: -1px;
        position: relative;
      }
    }

    .hS.hM {
      border-width: 0;
    }
  }

  .hU.hM {
    position: relative;
    box-sizing: border-box;

    .hN {
      overflow: hidden;
      height: 3ex;
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
