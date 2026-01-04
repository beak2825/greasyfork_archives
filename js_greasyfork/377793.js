// ==UserScript==
// @name        bugzilla 变色
// @author      dexteraquatic
// @description color schemes
// @namespace   dexteraquatic
// @include     http://*/bugzilla/buglist.cgi*
// @version     1.2
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/377793/bugzilla%20%E5%8F%98%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/377793/bugzilla%20%E5%8F%98%E8%89%B2.meta.js
// ==/UserScript==

GM_addStyle
(`
  .bz_UNCONFIRMED      { background-color: #ffdac8; }   /* 未确认     */
  .bz_CONFIRMED        { background-color: #ffad86; }   /* 已确认     */
  .bz_IN_PROGRESS      { background-color: #ceffce; }   /* 进行中     */
  .bz_RESOLVED.bz_FIXED                     { background-color: #fff0ac; }   /* 已修复     */
  .bz_RESOLVED.bz_已澄清_\\(CLARIFIED\\)    { background-color: #ffffbd; }   /* 已澄清     */
  .bz_RESOLVED.bz_INVALID                   { background-color: #ffe66f; }   /* 无效的     */
  .bz_RESOLVED.bz_已延期_\\(POSTPONE\\)     { background-color: #ffdc35; }   /* 已延期     */
  .bz_RESOLVED.bz_DUPLICATE                 { background-color: #eac100; }   /* 重复       */
  .bz_RESOLVED.bz_已关闭_\\(CLOSED\\)       { background-color: #c6a300; }   /* 已关闭     */
  .bz_已提交回归       { background-color: #97cbff; }   /* 已提交回归 */
  .bz_重打开           { background-color: #ea0000; }   /* 重打开     */
  .bz_VERIFIED         { background-color: #e0e0e0; }   /* 已认证     */
  .bz_CLOSED           { background-color: #c9ccc4; }   /* 已关闭     */
`);
