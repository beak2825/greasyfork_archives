// ==UserScript==
// @name        Strato Mail
// @description Simplifies layout of new Strato Webmail
// @include     https://communicator.strato.com/appsuite/#!&app=io.ox/mail*
// @version     1
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/33459
// @downloadURL https://update.greasyfork.org/scripts/17973/Strato%20Mail.user.js
// @updateURL https://update.greasyfork.org/scripts/17973/Strato%20Mail.meta.js
// ==/UserScript==
//
//.list-item.small { padding-bottom: 0; padding top: 0}
GM_addStyle(' .list-item.small { padding-bottom: 0 !important; padding-top: 0 !important; } ');
GM_addStyle(' #io-ox-core.show-banner #io-ox-topbar { top: 16px !important; } ');
GM_addStyle(' #io-ox-core.show-banner #io-ox-banner { height: 6px !important; padding: 8px 20px; }');
GM_addStyle(' .folder-tree .tree-container .selectable { color: #333px !important; line-height: 15px !important; }');
GM_addStyle(' #io-ox-core.show-banner #io-ox-screens { top: 50px !important; } ');
GM_addStyle(' .generic-toolbar .toolbar-item { line-height: 24px !important; } ');
GM_addStyle(' .generic-toolbar { height: 25px !important; }');
GM_addStyle(' .list-view-control.toolbar-top-visible:not(.upside-down) .list-view { top: 25px !important; } ');
GM_addStyle(' .window-sidepanel .upsell-link-wrapper { height: 0px !important; }');
GM_addStyle(' .folder-tree { bottom: 25px !important; } ');
GM_addStyle(' #io-ox-banner .banner-title { background-size: 50% !important; height: 14px !important; } ');
GM_addStyle(' #io-ox-topbar { height: 30px !important; } ');
GM_addStyle(' #io-ox-topbar .launcher-dropdown > a, #io-ox-topbar .launcher > a { line-height: 30px !important; } ');