// ==UserScript==
// @name         Exhentai Cookie登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  输入cookie后点击空白处登录
// @author       wlm3201
// @match        https://exhentai.org
// @match        https://e-hentai.org
// @icon         https://exhentai.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/502744/Exhentai%20Cookie%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502744/Exhentai%20Cookie%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

let log = console.log;
let textarea = document.createElement("textarea");
textarea.style.width = "100%";
textarea.style.height = "100px";
textarea.placeholder = `ipb_member_id: ipb_member_id
ipb_pass_hash: ipb_pass_hash
igneous: igneous`;
textarea.style.fontSize = "xx-large";
if (!document.body.children.length) document.body.appendChild(textarea);
let login = async e => {
  if (!textarea.value) return;
  (await cookieStore.getAll()).forEach(async c => await cookieStore.delete(c));
  cookieStore.set("yay", "louder");
  textarea.value
    .split("\n")
    .map(x => x.split(/[:=]/).map(x => x.trim()))
    .filter(x => x.length == 2)
    .forEach(([k, v]) => cookieStore.set(k, v));
  location.reload();
};
textarea.onblur = login;
textarea.onkeydown = e => {
  if (e.ctrlkey && e.key == "Enter") login(e);
};
