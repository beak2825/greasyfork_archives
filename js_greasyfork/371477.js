// ==UserScript==
// @name         编辑网页
// @namespace    https://github.com/zhchjiang95
// @version      0.1
// @description  该脚本允许你在任何地方去操作增加或删除网页上的文字及图片等信息，点击目标，然后打字即可添加新文字，按删除键backspace删除内容。
// @author       zhchjiang95 <zhchjiang99@outlook.com>
// @include      http://*
// @include	 https://*
// @match        http://*
// @match        https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371477/%E7%BC%96%E8%BE%91%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/371477/%E7%BC%96%E8%BE%91%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==


document.body.contentEditable = true;