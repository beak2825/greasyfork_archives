/* eslint-disable no-await-in-loop */
// ==UserScript==
// @name        Greasyfork-Admin
// @namespace   Greasyfork-Admin
// @match       https://greasyfork.org/*/scripts/reported
// @match       https://greasyfork.org/*/reports
// @grant       none
// @version     1.3
// @author      Mach6
// @description 4/13/2020, 1:20:36 PM
// @downloadURL https://update.greasyfork.org/scripts/400641/Greasyfork-Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/400641/Greasyfork-Admin.meta.js
// ==/UserScript==
(() => {
  if (/https?:\/\/greasyfork\.org\/[\w-]+\/scripts\/reported/.test(document.location.href)) {
    const rootNode = document.getElementById("browse-script-list");
    const articles = document.querySelectorAll("article");

    [].forEach.call(articles, (x, i) => {
      const checkBox = document.createElement("INPUT");
      checkBox.type = "checkbox";
      checkBox.id = `checkbox_${i}`;
      const h2 = x.querySelector("h2");
      h2.insertBefore(checkBox, h2.childNodes[0]);
    });

    const btnSelectAll = document.createElement("BUTTON");
    btnSelectAll.innerHTML = "Select All";
    btnSelectAll.onclick = function() {
      for (let i = 0; i < articles.length; i++) {
        document.getElementById(`checkbox_${i}`).checked = true;
      }
    };
    rootNode.insertBefore(btnSelectAll, rootNode.childNodes[0]);

    const resolveReport = async (level) => {
      // level = 0: dismiss
      //       = 1: delete
      for (let i = 0; i < articles.length; i++) {
        if (document.getElementById(`checkbox_${i}`).checked) {
          const link = articles[i].querySelector("ul > li > a").href;
          const html = await (await fetch(link, {
            withCredentials: true
          })).text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          const token = doc.querySelector("meta[name=csrf-token]").content;
          const formData = new FormData();

          formData.append("authenticity_token", token);

          let l;
          if (level === 0) {
            formData.append("commit", "Dismiss+report");
            l = `${link}/dismiss`;
          } else if (level == 1) {
            formData.append("commit", "Delete+script");
            l = `${link}/resolve_delete`;
          }
          formData.append("_method", "patch");
          formData.append("moderator_note", "");
          const html2 = await (
            await fetch(l, {
              credentials: "include",
              method: "POST",
              body: formData
            })
          ).text();
          //console.log(html2);
        }
      }
    };

    const banUsers = async () => {
      const bannedUsers = [];
      for (let i = 0; i < articles.length; i++) {
        if (document.getElementById(`checkbox_${i}`).checked) {
          const authorPage = articles[i].querySelector(".script-list-author a").href;
          if (!bannedUsers.includes(authorPage)) {
            bannedUsers.push(authorPage);
          }
        }
      }
      if (bannedUsers.length > 0) {
        for (const l of bannedUsers) {
          const html = await (await fetch(l, {
            withCredentials: true
          })).text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          const token = doc.querySelector("meta[name=csrf-token]").content;
          const formData = new FormData();

          formData.append("authenticity_token", token);
          formData.append("reason", "spam");
          formData.append("script_delete_type_id", 2);
          const html2 = await (
            await fetch(`${l}/ban`, {
              credentials: "include",
              method: "POST",
              body: formData
            })
          ).text();
          //console.log(html2);
        }
      }
    };

    let btn = document.createElement("BUTTON");
    btn.innerHTML = "Dismiss Selected";
    btn.id = "dismissButton";
    rootNode.insertBefore(btn, rootNode.childNodes[1]);
    btn.onclick = function() {
      resolveReport(0).then(() => alert("done"));
    };

    btn = document.createElement("BUTTON");
    btn.innerHTML = "Delete Selected";
    btn.id = "deleteButton";
    rootNode.insertBefore(btn, rootNode.childNodes[1]);
    btn.onclick = function() {
      resolveReport(1).then(() => alert("done"));
    };

    btn = document.createElement("BUTTON");
    btn.innerHTML = "Ban Selected";
    btn.id = "banButton";
    rootNode.insertBefore(btn, rootNode.childNodes[1]);
    btn.onclick = function() {
      banUsers().then(() => alert("done"));
    };
  }
  
  
  // https://greasyfork.org/en/reports
  if (/https?:\/\/greasyfork\.org\/[\w-]+\/reports/.test(document.location.href)) {
    const reports = document.querySelectorAll(".report-list-item");
    [].forEach.call(reports, (x, i) => {
      const checkBox = document.createElement("INPUT");
      checkBox.type = "checkbox";
      checkBox.id = `checkbox_${i}`;
      const h2 = x.querySelector("h4");
      h2.insertBefore(checkBox, h2.childNodes[0]);
    });

    rootNode = document.querySelector('.text-content')

    const btnSelectAll = document.createElement("BUTTON");
    btnSelectAll.innerHTML = "Select All";
    btnSelectAll.onclick = function () {
      for (let i = 0; i < reports.length; i++) {
        document.getElementById(`checkbox_${i}`).checked = true;
      }
    };

    const btnBan = document.createElement("BUTTON");
    btnBan.innerHTML = "Ban User";
    btnBan.id = "banButton";
    btnBan.onclick = function() {
      const p = new Promise((resolve) => {
        for (let i = 0; i < reports.length; i++) {
          if (document.getElementById(`checkbox_${i}`).checked) {
            const banbutton = document.evaluate(`(//section[@class="report-list-item"])[${i+1}]//input[contains(@value, "Ban")]`,document,document,XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
            if (banbutton) {
              banbutton.click();
            }
          }
        }
        resolve();
      });
      p.then(() => alert("done"));
    };
    
    const btnDismiss = document.createElement("BUTTON");
    btnBan.innerHTML = "Dismiss Selected";
    btnBan.id = "dimissSelected";
    btnBan.onclick = function() {
      const p = new Promise(async (resolve) => {
        for (let i = 0; i < reports.length; i++) {
          if (document.getElementById(`checkbox_${i}`).checked) {
            const link = `https://greasyfork.org/en/reports/773/dismiss?index=${i}`;
            const token = document.querySelector("meta[name=csrf-token]").content;
            const formData = new FormData();
            formData.append("authenticity_token", token);
            const html2 = await (
              await fetch(link, {
                credentials: "include",
                method: "POST",
              //  body: formData
              })
              ).text();
          }
        }
        resolve();
      });
      p.then(() => alert("done"));
    };
    rootNode.insertBefore(btnDismiss, rootNode.childNodes[0])
    rootNode.insertBefore(btnBan, rootNode.childNodes[0]);
    rootNode.insertBefore(btnSelectAll, rootNode.childNodes[0]);
  }

})();