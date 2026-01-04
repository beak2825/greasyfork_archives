// ==UserScript==
// @name         Notification Spam Block
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Blocks intrusive spam ads notification websites.
// @author       cool66
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453993/Notification%20Spam%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/453993/Notification%20Spam%20Block.meta.js
// ==/UserScript==

var tnrp = Notification.requestPermission;
Notification.requestPermission = async () => {
  return new Promise(async (resolve, reject) => {
    if (document.body.innerHTML.toLowerCase().includes("allow")) {
      var d = document.createElement("div");
      var db = document.createElement("button");
      var ctm = document.createElement("button");
      d.innerHTML = `This website is being blocked because this website shows you intrusive spam ads notification. Close this tab now.<br><br>`;
      d.setAttribute("style", "position: fixed; top: 5px; left: 5px; width: calc(100% - 20px); height: calc(100% - 20px); background-color: gray; color: white; padding: 5px; text-align: center; font-size: 16px; font-family: Arial; z-index: 999999999999999999999999;");
      ctm.innerHTML = "Close this message";
      db.innerHTML = "Don't block";
      document.body.appendChild(d);
      d.appendChild(ctm);
      d.appendChild(db);
      db.addEventListener("click", async () => {
        d.remove();
        resolve(await tnrp());
      });
       ctm.addEventListener("click", () => {
        d.remove();
       });
    } else {
      resolve(await tnrp());
    }
  });
};