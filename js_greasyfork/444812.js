// ==UserScript==
// @name         PrettyPTT
// @description  讓網頁版PTT不再傷害你的眼睛。
// @namespace    https://github.com/DonkeyBear/PrettyPTT
// @version      0.2
// @author       DonkeyBear
// @match        https://www.ptt.cc/bbs/*
// @match        https://www.ptt.cc/man/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444812/PrettyPTT.user.js
// @updateURL https://update.greasyfork.org/scripts/444812/PrettyPTT.meta.js
// ==/UserScript==

GM_addStyle(':root{--color-gray-1:#121212;--color-gray-2:#181818;--color-gray-3:#222222;--color-gray-4:#323232;--color-gray-5:#383838;--color-gray-6:#4c4c4c;--color-gray-7:#aaa;--color-blue-1:#23315e;--color-blue-2:#1e3771;--color-yellow-1:#bdb643;--color-yellow-2:#ee8}#action-bar-container,.b-list-container,.bbs-screen,.r-list-container{background-color:transparent}body{background-color:var(--color-gray-1)}#logo{color:var(--color-yellow-2)}#topbar-container{background-color:var(--color-blue-1)}.r-list-sep{background-color:var(--color-gray-4);height:2px;margin:1.5ex 0}.r-ent{background-color:var(--color-gray-2)}.bbs-screen{line-height:1.5}.article-metaline,.article-metaline-right{line-height:100%}.article-meta-value,.article-metaline{background-color:var(--color-blue-2)}.article-meta-tag{color:var(--color-blue-2)}.push-userid{color:var(--color-yellow-2)}.push-content{color:var(--color-yellow-1)}');