// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27299/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/27299/New%20Userscript.meta.js
// ==/UserScript==

let p = "<p> 过水关，谁敢闯？望经验，心悲凉。千古恨，等级低。眼一闭，被封号。这贴吧的无常，注定敢水的人一生伤！</p>";
function water(){
$("#ueditor_replace").html("");
$("#ueditor_replace").append(p);
$("#ueditor_replace").find("p:first").siblings("p").remove();
$(".j_floating a").trigger("click");
}
setInterval(water,10000);



