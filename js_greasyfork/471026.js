// ==UserScript==
// @name 懐古厨のぽまいらに捧ぐ……
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @match *://*.best-friends.chat/*
// @downloadURL https://update.greasyfork.org/scripts/471026/%E6%87%90%E5%8F%A4%E5%8E%A8%E3%81%AE%E3%81%BD%E3%81%BE%E3%81%84%E3%82%89%E3%81%AB%E6%8D%A7%E3%81%90%E2%80%A6%E2%80%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/471026/%E6%87%90%E5%8F%A4%E5%8E%A8%E3%81%AE%E3%81%BD%E3%81%BE%E3%81%84%E3%82%89%E3%81%AB%E6%8D%A7%E3%81%90%E2%80%A6%E2%80%A6.meta.js
// ==/UserScript==

(function() {
let css = `
    .item-list > article > div {
        > .status__wrapper {
            > .status:first-child {
                padding: 8px 10px;
                min-height: 1em;
                > .status__info {
                    margin-bottom: 0px;
                    > .status__display-name {
                        margin-left: calc(46px + 10px);
                        > .status__avatar {
                            position: absolute;
                            top: 10px;
                            left: 10px;
                        }
                        > .display-name {
                            display: flex !important;
                            gap: 8px;
                        }
                    }
                    > .status__relative-time {
                        height: initial !important;
                    }
                }
                > .status__content {
                    margin-left: calc(46px + 10px);
                    min-height: 1.5em;
                }
                > .status__action-bar {
                    margin-top: 8px;
                }
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
