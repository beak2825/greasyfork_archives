// ==UserScript==
// @name         Qiita記事リンク生成
// @version      0.1
// @description  Qiita記事へのリンクをMarkdown記法で生成する
// @author       fukuchan
// @match        https://qiita.com/*/items/*
// @namespace https://greasyfork.org/users/432749
// @downloadURL https://update.greasyfork.org/scripts/397378/Qiita%E8%A8%98%E4%BA%8B%E3%83%AA%E3%83%B3%E3%82%AF%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/397378/Qiita%E8%A8%98%E4%BA%8B%E3%83%AA%E3%83%B3%E3%82%AF%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

const span = document.createElement("span");
span.classList.add("fa", "fa-link");

const div = document.createElement("div");
div.classList.add("it-Actions_shareButton");
div.style.marginTop = "16px";
div.append(span);
div.addEventListener("click", () => prompt(document.title, `[${document.title}](${location.href})`));

const container = document.querySelector(".it-Actions");
container.append(div);
