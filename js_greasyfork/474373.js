// ==UserScript==
// @name         SideM Select
// @description  Makes the text on the SideM archive selectable.
// @match        https://asobistory.asobistore.jp/*
// @match        http://asobistory.asobistore.jp/*
// @grant        GM_addStyle
// @version 0.0.1.20230901183842
// @namespace https://greasyfork.org/users/1164338
// @downloadURL https://update.greasyfork.org/scripts/474373/SideM%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/474373/SideM%20Select.meta.js
// ==/UserScript==

GM_addStyle(" .unselectable,                    \
            {                                            \
                   -moz-user-select: inherit !important; \
                -webkit-user-select: inherit !important; \
                        user-select: inherit !important; \
            }");