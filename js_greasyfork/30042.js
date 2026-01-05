// ==UserScript==
// @name         DEFINED
// @version      1.0
// @author       Puciek
// @match        https://lab.facepunch.com/undefined
// @match        https://lab.facepunch.com/undefined/*
// @grant    GM_addStyle
// @description ravioli
// @namespace https://greasyfork.org/users/127262
// @downloadURL https://update.greasyfork.org/scripts/30042/DEFINED.user.js
// @updateURL https://update.greasyfork.org/scripts/30042/DEFINED.meta.js
// ==/UserScript==

GM_addStyle ( "                                     \
\
.inner, .avatar, blockquote.ng-scope, .message.ng-scope, p.ng-scope, .threadicon, .meta, .header, .forumname, .user, .right {\
  -moz-animation-name: none;\
  -webkit-animation-name: none;\
}\
" );